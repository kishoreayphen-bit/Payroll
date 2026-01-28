-- Add OTP-related columns to users table for forgot password flow
ALTER TABLE users
    ADD COLUMN IF NOT EXISTS reset_otp VARCHAR(6);

ALTER TABLE users
    ADD COLUMN IF NOT EXISTS reset_otp_expiry TIMESTAMP;
