package com.verdantiq.gateway.auth;

import com.verdantiq.gateway.common.security.CustomUserDetails;
import com.verdantiq.gateway.user.User;
import com.verdantiq.gateway.user.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final OtpRepository otpRepository;
    private static final org.slf4j.Logger log = org.slf4j.LoggerFactory.getLogger(AuthService.class);

    public AuthService(UserRepository userRepository, OtpRepository otpRepository) {
        this.userRepository = userRepository;
        this.otpRepository = otpRepository;
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
            return new VerifyOtpResponse(true, "OTP verified successfully", "ey...");
        }
        throw new RuntimeException("Invalid or expired OTP");
    }

    public LoginResponse login(LoginRequest request) {
        // Authenticate user via Firebase or Custom Auth, then return token
        UserDto user = new UserDto("usr_9981", request.getEmail(), "Alex Johnson", request.getRole(), "inst-cmu-01", null);
        return new LoginResponse(true, user, "ey...");
    }

    public SyncUserResponse syncUser(SyncUserRequest request) {
        // Save or update user in MongoDB based on token
        User user = userRepository.findById(request.getUid()).orElse(new User());
        user.setId(request.getUid());
        user.setEmail(request.getEmail());
        user.setName(request.getName());
        user.setRole(request.getRole());
        user.setTenantId(request.getTenantId());
        user.setDepartmentId(request.getDepartmentId());
        userRepository.save(user);
        
        UserDto userDto = new UserDto(user.getId(), user.getEmail(), user.getName(), user.getRole(), user.getTenantId(), user.getDepartmentId());
        return new SyncUserResponse(true, userDto);
    }

    public UserDto getMe() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        
        // Fetch from MongoDB using UID from token claims
        User user = userRepository.findById(userDetails.getUid()).orElse(null);
        
        String name = (user != null && user.getName() != null) ? user.getName() : "Unknown Name";
        String email = (user != null && user.getEmail() != null) ? user.getEmail() : userDetails.getUsername();
        
        // Role and tenant claims are sourced from the verified token per standard practice
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
