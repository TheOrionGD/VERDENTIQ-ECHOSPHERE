package com.verdantiq.gateway.common.security;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.FirebaseToken;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

@Component
public class FirebaseTokenFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        
        String header = request.getHeader("Authorization");
        String token = null;
        
        if (header != null && header.startsWith("Bearer ")) {
            token = header.substring(7);
        } else if (request.getParameter("token") != null) {
            token = request.getParameter("token");
        }
        
        if (token != null) {
            try {
                FirebaseToken decodedToken = FirebaseAuth.getInstance().verifyIdToken(token);
                
                String uid = decodedToken.getUid();
                String email = decodedToken.getEmail();
                
                // Extract custom claims
                String role = (String) decodedToken.getClaims().get("role");
                String tenantId = (String) decodedToken.getClaims().get("tenant_id");
                String deptId = (String) decodedToken.getClaims().get("dept_id");
                String regionId = (String) decodedToken.getClaims().get("region_id");
                
                if (role == null) {
                    role = "user"; // default role if not set
                }

                CustomUserDetails userDetails = new CustomUserDetails(
                        uid, 
                        email, 
                        role, 
                        tenantId, 
                        deptId, 
                        regionId, 
                        Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + role.toUpperCase()))
                );

                UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                        userDetails, null, userDetails.getAuthorities());
                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                SecurityContextHolder.getContext().setAuthentication(authentication);

            } catch (FirebaseAuthException e) {
                logger.error("Firebase token verification failed", e);
                // We don't return 401 here, let Spring Security handle it based on the endpoint configuration
            }
        }
        
        filterChain.doFilter(request, response);
    }
}
