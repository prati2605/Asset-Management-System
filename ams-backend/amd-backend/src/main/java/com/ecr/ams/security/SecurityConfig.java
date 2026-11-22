package com.ecr.ams.security;

import com.ecr.ams.modules.system.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.header.writers.ReferrerPolicyHeaderWriter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final UserRepository userRepository;
    private final JwtService jwtService;

    @Bean
    public UserDetailsService userDetailsService() {
        return username -> userRepository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService());
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(12); 
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(
                    "/swagger-ui/**",
                    "/swagger-ui.html",
                    "/v3/api-docs/**",
                    "/api-docs/**",
                    "/webjars/**",
                    "/swagger-resources/**"
                ).permitAll()
                .requestMatchers("/api/v1/auth/login", "/api/v1/assets/public/**", "/actuator/health", "/actuator/info").permitAll()
                .requestMatchers(org.springframework.http.HttpMethod.GET, 
                    "/api/v1/assets/**", 
                    "/api/v1/employees/**", 
                    "/api/v1/dashboard/stats", 
                    "/api/v1/vendors/**", 
                    "/api/v1/maintenance/**").hasAnyRole("ADMIN", "EMPLOYEE", "VIEWER")
                .requestMatchers(org.springframework.http.HttpMethod.POST, "/api/v1/**").hasAnyRole("ADMIN", "EMPLOYEE")
                .requestMatchers(org.springframework.http.HttpMethod.PUT, "/api/v1/**").hasAnyRole("ADMIN", "EMPLOYEE")
                .requestMatchers(org.springframework.http.HttpMethod.DELETE, "/api/v1/**").hasAnyRole("ADMIN", "EMPLOYEE")
                .requestMatchers("/api/v1/reports/**", "/api/v1/auth/register").hasAnyRole("ADMIN", "EMPLOYEE")
                .anyRequest().authenticated()
            )
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authenticationProvider(authenticationProvider())
            .addFilterBefore(new JwtAuthenticationFilter(jwtService, userDetailsService()), 
                           UsernamePasswordAuthenticationFilter.class)
            // Spring Security 6 Compatible Headers Configuration
            .headers(headers -> headers
                .frameOptions(frame -> frame.disable())
                .contentTypeOptions(Customizer.withDefaults()) // Adds X-Content-Type-Options: nosniff
                .cacheControl(Customizer.withDefaults())
                // HSTS is enabled by default in Spring Security 6 with max-age=1 year and includeSubDomains!
                .httpStrictTransportSecurity(Customizer.withDefaults()) 
                .referrerPolicy(referrer -> referrer.policy(ReferrerPolicyHeaderWriter.ReferrerPolicy.STRICT_ORIGIN_WHEN_CROSS_ORIGIN))
            );
        
        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:8082", "https://localhost:8082", "http://localhost:3000", "http://localhost:4200", "https://your-production-domain.com"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
        configuration.setAllowedHeaders(Arrays.asList(
            HttpHeaders.AUTHORIZATION,
            HttpHeaders.CONTENT_TYPE,
            HttpHeaders.ACCEPT,
            "X-Requested-With"
        ));
        configuration.setExposedHeaders(List.of("Authorization"));
        configuration.setMaxAge(3600L);
        configuration.setAllowCredentials(true);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
