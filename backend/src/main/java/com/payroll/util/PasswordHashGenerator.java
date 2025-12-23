package com.payroll.util;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

/**
 * Utility to generate BCrypt password hashes
 * Run this to generate password hash for admin user
 */
public class PasswordHashGenerator {

    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

        // Generate hash for admin password: Admin@123456
        String password = "Admin@123456";
        String hash = encoder.encode(password);

        System.out.println("=".repeat(80));
        System.out.println("ADMIN USER CREDENTIALS");
        System.out.println("=".repeat(80));
        System.out.println("Email:    admin@payrollpro.com");
        System.out.println("Password: " + password);
        System.out.println("=".repeat(80));
        System.out.println("BCrypt Hash (for database):");
        System.out.println(hash);
        System.out.println("=".repeat(80));
    }
}
