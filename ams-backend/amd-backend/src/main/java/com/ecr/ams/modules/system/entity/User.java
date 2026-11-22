package com.ecr.ams.modules.system.entity;

import com.ecr.ams.common.BaseEntity;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import java.util.Collection;
import java.util.List;

@Entity
@Table(name = "users")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class User extends BaseEntity implements UserDetails {
    
    @NotBlank @Email @Column(unique = true, nullable = false)
    private String email;

    @NotBlank @Column(nullable = false)
    private String password;

    @NotBlank @Column(nullable = false, length = 50)
    private String role; // e.g., "ADMIN", "EMPLOYEE"

    @NotBlank @Column(nullable = false, length = 100)
    private String fullName;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + role));
    }

    @Override
    public String getUsername() { return email; }
    @Override
    public boolean isAccountNonExpired() { return true; }
    @Override
    public boolean isAccountNonLocked() { return true; }
    @Override
    public boolean isCredentialsNonExpired() { return true; }
    @Override
    public boolean isEnabled() { return true; }
}
