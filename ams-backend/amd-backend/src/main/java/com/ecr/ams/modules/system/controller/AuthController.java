package com.ecr.ams.modules.system.controller;

import com.ecr.ams.common.dto.ApiResponse;
import com.ecr.ams.modules.system.dto.AuthResponse;
import com.ecr.ams.modules.system.dto.LoginRequest;
import com.ecr.ams.modules.system.entity.User;
import com.ecr.ams.modules.system.repository.UserRepository;
import com.ecr.ams.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final PasswordEncoder passwordEncoder;

    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYEE')")
    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> register(@RequestBody User request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Email already exists", null));
        }
        
        User user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole() != null ? request.getRole() : "EMPLOYEE")
                .fullName(request.getFullName())
                .build();
        
        userRepository.save(user);
        String token = jwtService.generateToken(user);
        
        return ResponseEntity.ok(ApiResponse.success("User registered successfully", 
            AuthResponse.builder().token(token).email(user.getEmail()).role(user.getRole()).fullName(user.getFullName()).build()));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@RequestBody LoginRequest request) {
        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );
        
        User user = userRepository.findByEmail(request.getEmail()).orElseThrow();
        String token = jwtService.generateToken(user);
        
        return ResponseEntity.ok(ApiResponse.success("Login successful", 
            AuthResponse.builder().token(token).email(user.getEmail()).role(user.getRole()).fullName(user.getFullName()).build()));
    }
}
