package qdtt.tiklearn.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // 1. Cấu hình CORS (quan trọng)
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))

                // 2. Tắt CSRF (vì chúng ta dùng API)
                .csrf(csrf -> csrf.disable())

                // 3. Tắt quản lý session (chuyển sang stateless)
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                // 4. Cấu hình các "luật" truy cập
                .authorizeHttpRequests(authorize -> authorize
                        // Tạm thời cho phép tất cả các API dưới /api/**
                        .requestMatchers("/api/**").permitAll()

                        // (Sau này chúng ta sẽ sửa lại:
                        // .requestMatchers("/api/auth/**").permitAll() // Cho phép đăng nhập/ký
                        // .anyRequest().authenticated() // Bắt tất cả các yêu cầu khác phải đăng nhập
                        // )

                        // Tạm thời cho phép mọi yêu cầu khác
                        .anyRequest().permitAll()
                );

        return http.build();
    }

    /**
     * Đây là phần "mở cửa" cho React (Vite)
     * Nó cho phép React chạy ở localhost:5173 gọi API ở localhost:8080
     */
    @Bean
    CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        // Cho phép frontend của Vite truy cập
        configuration.setAllowedOrigins(List.of("http://localhost:5173"));

        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration); // Áp dụng cho tất cả các đường dẫn
        return source;
    }
}
