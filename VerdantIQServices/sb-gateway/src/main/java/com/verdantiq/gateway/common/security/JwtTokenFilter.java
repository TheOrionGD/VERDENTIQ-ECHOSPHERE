package com.verdantiq.gateway.common.security;

import io.jsonwebtoken.Claims;
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
public class JwtTokenFilter extends OncePerRequestFilter {

    private final JwtTokenProvider jwtTokenProvider;

    public JwtTokenFilter(JwtTokenProvider jwtTokenProvider) {
        this.jwtTokenProvider = jwtTokenProvider;
    }

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

        if (token != null && jwtTokenProvider.validateToken(token)) {
            try {
                Claims claims = jwtTokenProvider.getClaims(token);

                String uid = claims.getSubject();
                String email = claims.get("email", String.class);
                String role = claims.get("role", String.class);
                String tenantId = claims.get("tenant_id", String.class);
                String deptId = claims.get("dept_id", String.class);
                String regionId = claims.get("region_id", String.class);

                if (role == null) {
                    role = "user";
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

            } catch (Exception e) {
                logger.error("Database JWT token verification failed", e);
            }
        }

        filterChain.doFilter(request, response);
    }
}
