package com.payroll.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.Arrays;

@Configuration
public class CorsConfig {

        @Bean
        public CorsFilter corsFilter() {
                UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
                CorsConfiguration config = new CorsConfiguration();

                // Allow credentials (cookies, authorization headers)
                config.setAllowCredentials(true);

                // Allow frontend origins
                config.setAllowedOrigins(Arrays.asList(
                                "http://localhost:5173",
                                "http://localhost:3000",
                                "http://localhost:5174"));

                // Allow all headers
                config.setAllowedHeaders(Arrays.asList("*"));

                // Allow all HTTP methods
                config.setAllowedMethods(Arrays.asList(
                                "GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));

                // Expose headers that frontend can access
                config.setExposedHeaders(Arrays.asList(
                                "Authorization",
                                "Content-Type",
                                "X-Requested-With",
                                "Accept",
                                "Origin",
                                "Access-Control-Request-Method",
                                "Access-Control-Request-Headers"));

                // Cache preflight response for 1 hour
                config.setMaxAge(3600L);

                // Apply CORS configuration to all endpoints
                source.registerCorsConfiguration("/**", config);

                return new CorsFilter(source);
        }
}
