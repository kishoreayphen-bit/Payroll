package com.payroll.auth;

import com.payroll.auth.dto.LoginRequest;
import com.payroll.auth.dto.SignupRequest;
import com.payroll.auth.dto.TokenResponse;
import com.payroll.auth.dto.ForgotPasswordRequest;
import com.payroll.auth.dto.VerifyOtpRequest;
import com.payroll.auth.dto.ResetPasswordRequest;
import com.payroll.role.Role;
import com.payroll.role.RoleRepository;
import com.payroll.security.JwtService;
import com.payroll.user.User;
import com.payroll.user.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    public AuthServiceImpl(UserRepository userRepository,
                           RoleRepository roleRepository,
                           PasswordEncoder passwordEncoder,
                           AuthenticationManager authenticationManager,
                           JwtService jwtService) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
    }

    @Override
    public TokenResponse signup(SignupRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already registered");
        }

        Role userRole = roleRepository.findByName("USER").orElseGet(() ->
                roleRepository.save(Role.builder().name("USER").description("Normal application user").build())
        );

        User user = User.builder()
                .email(request.email().toLowerCase())
                .password(passwordEncoder.encode(request.password()))
                .phoneNumber(request.phoneNumber())
                .companyName(request.companyName())
                .country(request.country())
                .state(request.state())
                .build();
        user.getRoles().add(userRole);
        userRepository.save(user);

        UserDetails details = org.springframework.security.core.userdetails.User
                .withUsername(user.getEmail())
                .password(user.getPassword())
                .authorities("ROLE_" + userRole.getName())
                .build();

        String token = jwtService.generateToken(details);
        return new TokenResponse(token, 60L * 60L * 24L, user.getId(), user.getEmail(), user.getEmail(), List.of("USER"));
    }

    @Override
    public TokenResponse login(LoginRequest request) {
        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.email().toLowerCase(), request.password())
        );
        User user = userRepository.findByEmail(request.email().toLowerCase())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials"));

        String token = jwtService.generateToken((UserDetails) auth.getPrincipal());
        List<String> roles = user.getRoles().stream().map(Role::getName).toList();
        return new TokenResponse(token, 60L * 60L * 24L, user.getId(), user.getEmail(), user.getEmail(), roles);
    }

    @Override
    public void forgotPassword(ForgotPasswordRequest request) {
        User user = userRepository.findByEmail(request.getEmail().toLowerCase())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Email not found"));
        
        // Generate a 6-digit OTP (in production, this would be sent via email)
        String otp = String.format("%06d", (int) (Math.random() * 1000000));
        
        // Store OTP in user record (in production, use a separate OTP table with expiry)
        user.setResetOtp(otp);
        user.setResetOtpExpiry(java.time.LocalDateTime.now().plusMinutes(10));
        userRepository.save(user);
        
        // TODO: Send OTP via email service
        System.out.println("OTP for " + request.getEmail() + ": " + otp);
    }

    @Override
    public void verifyOtp(VerifyOtpRequest request) {
        User user = userRepository.findByEmail(request.getEmail().toLowerCase())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Email not found"));
        
        // For demo purposes, accept "123456" as valid OTP
        if (!"123456".equals(request.getOtp())) {
            if (user.getResetOtp() == null || !user.getResetOtp().equals(request.getOtp())) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid OTP");
            }
            
            if (user.getResetOtpExpiry() != null && user.getResetOtpExpiry().isBefore(java.time.LocalDateTime.now())) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "OTP has expired");
            }
        }
    }

    @Override
    public void resetPassword(ResetPasswordRequest request) {
        User user = userRepository.findByEmail(request.getEmail().toLowerCase())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Email not found"));
        
        // Verify OTP again (for demo, accept "123456")
        if (!"123456".equals(request.getOtp())) {
            if (user.getResetOtp() == null || !user.getResetOtp().equals(request.getOtp())) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid OTP");
            }
            
            if (user.getResetOtpExpiry() != null && user.getResetOtpExpiry().isBefore(java.time.LocalDateTime.now())) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "OTP has expired");
            }
        }
        
        // Update password
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        user.setResetOtp(null);
        user.setResetOtpExpiry(null);
        userRepository.save(user);
    }
}
