package com.payroll.auth;

import com.payroll.auth.dto.LoginRequest;
import com.payroll.auth.dto.SignupRequest;
import com.payroll.auth.dto.TokenResponse;
import com.payroll.auth.dto.ForgotPasswordRequest;
import com.payroll.auth.dto.VerifyOtpRequest;
import com.payroll.auth.dto.ResetPasswordRequest;

public interface AuthService {
    TokenResponse signup(SignupRequest request);
    TokenResponse login(LoginRequest request);
    void forgotPassword(ForgotPasswordRequest request);
    void verifyOtp(VerifyOtpRequest request);
    void resetPassword(ResetPasswordRequest request);
}
