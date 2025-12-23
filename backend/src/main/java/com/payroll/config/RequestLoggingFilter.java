package com.payroll.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class RequestLoggingFilter extends OncePerRequestFilter {

    private static final Logger logger = LoggerFactory.getLogger(RequestLoggingFilter.class);

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        logger.info("=== Incoming Request ===");
        logger.info("Method: {}", request.getMethod());
        logger.info("URI: {}", request.getRequestURI());
        logger.info("Auth Header: {}", request.getHeader("Authorization"));
        logger.info("Content-Type: {}", request.getContentType());

        try {
            filterChain.doFilter(request, response);
            logger.info("Filter chain completed successfully");
        } catch (Exception e) {
            logger.error("Exception in filter chain: ", e);
            throw e;
        }

        logger.info("Response Status: {}", response.getStatus());
        logger.info("=== End Request ===");
    }
}
