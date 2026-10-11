package com.verdantiq.gateway.common.security;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;

public class CustomUserDetails implements UserDetails {

    private final String uid;
    private final String email;
    private final String role;
    private final String tenantId;
    private final String deptId;
    private final String regionId;
    private final Collection<? extends GrantedAuthority> authorities;

    public CustomUserDetails(String uid, String email, String role, String tenantId, String deptId, String regionId, Collection<? extends GrantedAuthority> authorities) {
        this.uid = uid;
        this.email = email;
        this.role = role;
        this.tenantId = tenantId;
        this.deptId = deptId;
        this.regionId = regionId;
        this.authorities = authorities;
    }

    public String getUid() {
        return uid;
    }

    public String getRole() {
        return role;
    }

    public String getTenantId() {
        return tenantId;
    }

    public String getDeptId() {
        return deptId;
    }

    public String getDepartmentId() {
        return deptId;
    }

    public String getRegionId() {
        return regionId;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public String getPassword() {
        return null;
    }

    @Override
    public String getUsername() {
        return email != null ? email : uid;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
