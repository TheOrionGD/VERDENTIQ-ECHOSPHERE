package com.verdantiq.gateway.auth;

import com.verdantiq.gateway.common.security.CustomUserDetails;
import com.verdantiq.gateway.common.security.JwtTokenProvider;
import com.verdantiq.gateway.user.User;
import com.verdantiq.gateway.user.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.UUID;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final OtpRepository otpRepository;
    private final JwtTokenProvider jwtTokenProvider;
    private static final Logger log = LoggerFactory.getLogger(AuthService.class);

    public AuthService(UserRepository userRepository, OtpRepository otpRepository, JwtTokenProvider jwtTokenProvider) {
        this.userRepository = userRepository;
        this.otpRepository = otpRepository;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    public SendOtpResponse sendOtp(SendOtpRequest request) {
        String code = String.format("%06d", new java.util.Random().nextInt(999999));
        OtpEntity otp = new OtpEntity(request.getEmail(), code, Instant.now().plusSeconds(300));
        otpRepository.save(otp);
        log.info("Sending OTP {} to {}", code, request.getEmail());
        return new SendOtpResponse(true, "OTP verification code dispatched via transactional email", Instant.now().toString());
    }

    public VerifyOtpResponse verifyOtp(VerifyOtpRequest request) {
        OtpEntity otp = otpRepository.findById(request.getEmail()).orElse(null);
        if (otp != null && otp.getCode().equals(request.getCode()) && otp.getExpiry().isAfter(Instant.now())) {
            otpRepository.delete(otp);
            
            // Find or create user in MongoDB for OTP authentication
            User user = userRepository.findByEmail(request.getEmail()).orElseGet(() -> {
                User newUser = new User();
                newUser.setId("usr_" + UUID.randomUUID().toString().substring(0, 8));
                newUser.setEmail(request.getEmail());
                newUser.setName(request.getEmail().split("@")[0]);
                newUser.setRole("user");
                newUser.setTenantId("tenant_default");
                newUser.setCreatedAt(Instant.now().toString());
                newUser.setUpdatedAt(Instant.now().toString());
                return userRepository.save(newUser);
            });

            String token = jwtTokenProvider.generateToken(
                    user.getId(), user.getEmail(), user.getRole(), user.getTenantId(), user.getDepartmentId(), null);

            return new VerifyOtpResponse(true, "OTP verified successfully", token);
        }
        throw new RuntimeException("Invalid or expired OTP");
    }

    public LoginResponse login(LoginRequest request) {
        String email = request.getEmail().toLowerCase();
        
        // Find existing user by email or create new MongoDB user record
        User user = userRepository.findByEmail(email).orElseGet(() -> {
            User newUser = new User();
            newUser.setId("usr_" + UUID.randomUUID().toString().substring(0, 8));
            newUser.setEmail(email);
            newUser.setName(email.split("@")[0]);
            newUser.setRole(request.getRole() != null ? request.getRole() : "user");
            newUser.setTenantId("tenant_default");
            newUser.setCreatedAt(Instant.now().toString());
            newUser.setUpdatedAt(Instant.now().toString());
            return userRepository.save(newUser);
        });

        // Update role or timestamp if necessary
        if (request.getRole() != null && !request.getRole().equals(user.getRole())) {
            user.setRole(request.getRole());
            user.setUpdatedAt(Instant.now().toString());
            user = userRepository.save(user);
        }

        String token = jwtTokenProvider.generateToken(
                user.getId(), user.getEmail(), user.getRole(), user.getTenantId(), user.getDepartmentId(), null);

        UserDto userDto = new UserDto(
                user.getId(), user.getEmail(), user.getName(), user.getRole(), user.getTenantId(), user.getDepartmentId());

        return new LoginResponse(true, userDto, token);
    }

    public SyncUserResponse syncUser(SyncUserRequest request) {
        String targetId = (request.getUid() != null && !request.getUid().isEmpty()) 
                ? request.getUid() 
                : "usr_" + UUID.randomUUID().toString().substring(0, 8);

        User user = userRepository.findById(targetId)
                .orElseGet(() -> userRepository.findByEmail(request.getEmail().toLowerCase())
                .orElse(new User()));

        if (user.getId() == null) {
            user.setId(targetId);
            user.setCreatedAt(Instant.now().toString());
        }
        user.setEmail(request.getEmail().toLowerCase());
        user.setName(request.getName());
        user.setRole(request.getRole());
        user.setTenantId(request.getTenantId());
        user.setDepartmentId(request.getDepartmentId());
        user.setUpdatedAt(Instant.now().toString());

        userRepository.save(user);

        UserDto userDto = new UserDto(
                user.getId(), user.getEmail(), user.getName(), user.getRole(), user.getTenantId(), user.getDepartmentId());
        return new SyncUserResponse(true, userDto);
    }

    public UserDto getMe() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !(authentication.getPrincipal() instanceof CustomUserDetails userDetails)) {
            throw new RuntimeException("Unauthorized");
        }

        User user = userRepository.findById(userDetails.getUid())
                .orElseGet(() -> userRepository.findByEmail(userDetails.getUsername()).orElse(null));

        String name = (user != null && user.getName() != null) ? user.getName() : userDetails.getUsername().split("@")[0];
        String email = (user != null && user.getEmail() != null) ? user.getEmail() : userDetails.getUsername();

        return new UserDto(
                userDetails.getUid(),
                email,
                name,
                userDetails.getRole(),
                userDetails.getTenantId(),
                userDetails.getDeptId()
        );
    }
}
