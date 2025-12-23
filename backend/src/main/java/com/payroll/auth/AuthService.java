package com.payroll.auth;

import com.payroll.auth.dto.LoginRequest;
import com.payroll.auth.dto.SignupRequest;
import com.payroll.auth.dto.TokenResponse;

public interface AuthService {
    TokenResponse signup(SignupRequest request);
    TokenResponse login(LoginRequest request);
}
