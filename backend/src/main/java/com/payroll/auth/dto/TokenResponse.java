package com.payroll.auth.dto;

import java.util.List;

public record TokenResponse(
        String token,
        long expiresInSeconds,
        String email,
        List<String> roles
) {}
