package com.payroll.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@Slf4j
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;

    public JwtAuthFilter(JwtService jwtService, UserDetailsService userDetailsService) {
        this.jwtService = jwtService;
        this.userDetailsService = userDetailsService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        String requestURI = request.getRequestURI();
        log.debug("JWT Filter processing request: {}", requestURI);
        
        String authHeader = request.getHeader("Authorization");
        String jwt = null;
        String username = null;

        if (StringUtils.hasText(authHeader) && authHeader.startsWith("Bearer ")) {
            jwt = authHeader.substring(7);
            log.debug("JWT token found in Authorization header");
            try {
                username = jwtService.extractUsername(jwt);
                log.debug("Extracted username from JWT: {}", username);
            } catch (Exception e) {
                log.error("Failed to extract username from JWT token", e);
            }
        } else {
            log.debug("No Bearer token found in Authorization header for request: {}", requestURI);
        }

        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            log.debug("Attempting to authenticate user: {}", username);
            try {
                UserDetails userDetails = this.userDetailsService.loadUserByUsername(username);
                log.debug("User details loaded successfully for: {}", username);
                
                if (jwtService.isTokenValid(jwt, userDetails)) {
                    log.debug("JWT token is valid for user: {}", username);
                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                            userDetails, null, userDetails.getAuthorities());
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                    log.debug("Authentication set in SecurityContext for user: {}", username);
                } else {
                    log.warn("JWT token is INVALID for user: {}", username);
                }
            } catch (Exception e) {
                log.error("Error during authentication for user: {}", username, e);
            }
        } else if (username == null) {
            log.debug("No username extracted from token for request: {}", requestURI);
        }

        filterChain.doFilter(request, response);
    }
}
