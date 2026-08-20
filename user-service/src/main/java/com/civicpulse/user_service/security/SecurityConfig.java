package com.civicpulse.user_service.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.http.HttpMethod;
@Configuration
public class SecurityConfig {

    private final JwtFilter jwtFilter;

    public SecurityConfig(JwtFilter jwtFilter) {
        this.jwtFilter = jwtFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
                .csrf(csrf -> csrf.disable())
                .cors(Customizer.withDefaults())
                .formLogin(form -> form.disable())
                .httpBasic(httpBasic -> httpBasic.disable())
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )

       .authorizeHttpRequests(auth -> auth

    // Public endpoints
    .requestMatchers(
            "/auth/**",
            "/users",
            "/v3/api-docs/**",
            "/swagger-ui/**",
            "/swagger-ui.html"
    ).permitAll()

    // Department APIs
    .requestMatchers(HttpMethod.GET, "/departments/**")
    .permitAll()

    .requestMatchers(HttpMethod.POST, "/departments/**")
    .hasRole("ADMIN")

    .requestMatchers(HttpMethod.PUT, "/departments/**")
    .hasRole("ADMIN")

    .requestMatchers(HttpMethod.DELETE, "/departments/**")
    .hasRole("ADMIN")

    // User APIs
    .requestMatchers("/users/**")
    .hasRole("ADMIN")

    .anyRequest().authenticated()
)

                .addFilterBefore(jwtFilter,
                        UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}