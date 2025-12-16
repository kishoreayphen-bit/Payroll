# PAYROLL APPLICATION - DEVELOPMENT PAGE ORDER WORKFLOW (PART 1)
## Foundation & Authentication Pages

---

## 📋 DEVELOPMENT OVERVIEW

**Total Pages in Complete Payroll System:** 85+ pages
**Development Approach:** Agile, Feature-by-Feature
**Tech Stack Reference:** React/Next.js Frontend, Node.js Backend, PostgreSQL Database

---

## 🎯 DEVELOPMENT ORDER RATIONALE

1. **Phase 1:** Foundation & Authentication (Pages 1-8)
2. **Phase 2:** Onboarding & Setup (Pages 9-20)
3. **Phase 3:** Core Employee Management (Pages 21-35)
4. **Phase 4:** Payroll Processing Engine (Pages 36-50)
5. **Phase 5:** Compliance & Tax (Pages 51-62)
6. **Phase 6:** Advanced Features (Pages 63-75)
7. **Phase 7:** Analytics & Reporting (Pages 76-85)

---

# PHASE 1: FOUNDATION & AUTHENTICATION PAGES

---

## PAGE 1: LANDING PAGE (/)
**Development Priority:** HIGH  
**Development Order:** 1st  
**Estimated Time:** 3-4 days  
**Dependencies:** None

### **Page Purpose:**
Marketing page to attract potential customers and explain the payroll solution.

### **Detailed Functionality to Implement:**

#### **Section 1: Hero Section**
- **Headline:** Dynamic, attention-grabbing headline with value proposition
- **Subheadline:** Brief description of what the payroll software does
- **Primary CTA Button:** "Start Free Trial" → leads to signup
- **Secondary CTA Button:** "Watch Demo" → opens video modal
- **Hero Image/Animation:** Illustration of payroll dashboard or happy employees
- **Trust Badge:** "Trusted by 10,000+ businesses"

#### **Section 2: Features Overview**
- **Feature Cards:** 6-8 key features with icons
  - Automated Payroll Processing
  - Tax Calculation & Filing
  - Employee Self-Service Portal
  - Time & Attendance Integration
  - Direct Deposit
  - Compliance Management
  - Mobile App Access
  - Detailed Reports & Analytics
- **Functionality:** Hover effects, animated icons, "Learn More" links

#### **Section 3: How It Works**
- **Step-by-step Visual:**
  1. Add Employees
  2. Set Up Payroll Schedule
  3. Run Payroll
  4. Employees Get Paid
- **Functionality:** Animated timeline, interactive steps

#### **Section 4: Pricing Section**
- **Pricing Tiers:** Starter, Professional, Enterprise
- **Price Display:** Monthly/Annual toggle switch
- **Feature Comparison:** Checkmarks for included features
- **CTA Buttons:** "Start Free Trial" for each tier

#### **Section 5: Testimonials**
- **Customer Reviews:** 3-5 testimonials with photos
- **Star Ratings:** 5-star display
- **Company Logos:** Logos of businesses using the platform
- **Functionality:** Carousel/slider for multiple testimonials

#### **Section 6: Integration Partners**
- **Logo Grid:** Show integration logos (QuickBooks, Xero, Gusto, ADP, etc.)
- **Categories:** Accounting, HR, Time Tracking, Benefits
- **Functionality:** Clickable logos → integration detail pages

#### **Section 7: Call-to-Action Footer**
- **Final CTA:** "Ready to simplify payroll? Start your free trial"
- **Sign Up Button**
- **Contact Sales Link**

#### **Section 8: Footer**
- **Links:**
  - Product (Features, Pricing, Integrations)
  - Resources (Blog, Help Center, API Docs)
  - Company (About, Careers, Contact)
  - Legal (Privacy Policy, Terms of Service, Security)
- **Social Media Icons**
- **Newsletter Subscription**

### **Technical Implementation Details:**

#### **Frontend Components:**
```
components/
├── Hero.jsx
├── FeatureCards.jsx
├── HowItWorks.jsx
├── PricingTable.jsx
├── Testimonials.jsx
├── IntegrationLogos.jsx
├── CTASection.jsx
└── Footer.jsx
```

#### **API Endpoints Needed:**
- `GET /api/public/pricing` - Fetch pricing tiers
- `POST /api/public/newsletter-subscribe` - Newsletter signup
- `POST /api/public/contact` - Contact form submission

#### **State Management:**
- Pricing toggle (monthly/annual)
- Video modal open/close state
- Newsletter subscription status

#### **SEO Requirements:**
- Meta title, description, keywords
- Open Graph tags for social sharing
- Schema.org markup for organization
- Sitemap inclusion

---

## PAGE 2: SIGN UP PAGE (/signup)
**Development Priority:** HIGH  
**Development Order:** 2nd  
**Estimated Time:** 4-5 days  
**Dependencies:** Authentication service, email service

### **Page Purpose:**
Allow new users to create an account and start using the payroll system.

### **Detailed Functionality to Implement:**

#### **Section 1: Sign Up Form**

##### **Field 1: Full Name**
- **Input Type:** Text
- **Label:** "Full Name"
- **Placeholder:** "John Doe"
- **Validation:**
  - Required field
  - Minimum 2 characters
  - No special characters except hyphens and apostrophes
  - Real-time validation on blur
- **Error Messages:**
  - "Please enter your full name"
  - "Name must be at least 2 characters"
  - "Please use only letters, spaces, hyphens, and apostrophes"
- **Icon:** User icon on the left

##### **Field 2: Work Email**
- **Input Type:** Email
- **Label:** "Work Email"
- **Placeholder:** "john@company.com"
- **Validation:**
  - Required field
  - Valid email format (RFC 5322)
  - No disposable email domains (temp-mail.org, guerrillamail.com, etc.)
  - Email uniqueness check (AJAX call on blur)
  - Real-time format validation
- **Error Messages:**
  - "Please enter your work email"
  - "Please enter a valid email address"
  - "This email is already registered. Please sign in instead."
  - "Please use a business email address"
- **Icon:** Envelope icon
- **Success Indicator:** Green checkmark when valid and unique

##### **Field 3: Company Name**
- **Input Type:** Text
- **Label:** "Company Name"
- **Placeholder:** "Acme Corporation"
- **Validation:**
  - Required field
  - Minimum 2 characters
  - Maximum 100 characters
  - Company name uniqueness suggestion
- **Error Messages:**
  - "Please enter your company name"
  - "Company name must be at least 2 characters"
- **Icon:** Building icon
- **Auto-suggestion:** Show if similar company exists

##### **Field 4: Password**
- **Input Type:** Password (with show/hide toggle)
- **Label:** "Create Password"
- **Placeholder:** "Minimum 8 characters"
- **Validation:**
  - Required field
  - Minimum 8 characters
  - At least one uppercase letter
  - At least one lowercase letter
  - At least one number
  - At least one special character (@$!%*?&)
  - Cannot contain email or name
  - Real-time strength indicator
- **Password Strength Meter:**
  - Weak (red) - basic requirements not met
  - Fair (yellow) - minimum requirements met
  - Good (light green) - strong password
  - Excellent (dark green) - very strong password
- **Error Messages:**
  - "Password is required"
  - "Password must be at least 8 characters"
  - "Password must include uppercase, lowercase, number, and special character"
- **Show/Hide Toggle:** Eye icon to reveal password

##### **Field 5: Confirm Password**
- **Input Type:** Password
- **Label:** "Confirm Password"
- **Placeholder:** "Re-enter password"
- **Validation:**
  - Required field
  - Must match password field exactly
  - Real-time match validation
- **Error Messages:**
  - "Please confirm your password"
  - "Passwords do not match"
- **Success Indicator:** Green checkmark when matched

##### **Field 6: Phone Number (Optional)**
- **Input Type:** Tel
- **Label:** "Phone Number (Optional)"
- **Placeholder:** "(555) 123-4567"
- **Auto-formatting:** Format as user types: (XXX) XXX-XXXX
- **Validation:**
  - Optional field
  - Valid US phone format if provided
  - 10 digits required
- **Icon:** Phone icon

##### **Field 7: How Did You Hear About Us?**
- **Input Type:** Dropdown
- **Label:** "How did you hear about us? (Optional)"
- **Options:**
  - Search Engine (Google, Bing)
  - Social Media (LinkedIn, Facebook, Twitter)
  - Referral from Friend/Colleague
  - Blog or Publication
  - Online Advertisement
  - Trade Show/Event
  - Other
- **Functionality:** If "Other" selected, show text input for details

##### **Field 8: Terms and Conditions Checkbox**
- **Input Type:** Checkbox
- **Label:** "I agree to the Terms of Service and Privacy Policy"
- **Validation:** Must be checked to proceed
- **Error Message:** "You must agree to the terms to continue"
- **Links:** "Terms of Service" and "Privacy Policy" open in new tab

##### **Field 9: Marketing Opt-in (Optional)**
- **Input Type:** Checkbox
- **Label:** "Send me product updates and marketing emails"
- **Default:** Unchecked
- **Functionality:** Optional, GDPR compliant

#### **Section 2: Social Sign Up Options**

##### **Google Sign Up Button**
- **Label:** "Sign up with Google"
- **Icon:** Google logo
- **Functionality:**
  - OAuth 2.0 integration
  - Redirect to Google authentication
  - Auto-populate name and email from Google profile
  - Still require company name and password
  - Handle existing email conflict

##### **Microsoft Sign Up Button**
- **Label:** "Sign up with Microsoft"
- **Icon:** Microsoft logo
- **Functionality:** Same as Google OAuth

##### **LinkedIn Sign Up Button**
- **Label:** "Sign up with LinkedIn"
- **Icon:** LinkedIn logo
- **Functionality:** Same as Google OAuth

#### **Section 3: Form Submission**

##### **Sign Up Button**
- **Label:** "Create Account"
- **State Management:**
  - Disabled if form is invalid
  - Loading spinner during submission
  - Success state after account creation
- **Click Functionality:**
  1. Validate all fields
  2. Check password strength
  3. Verify email uniqueness
  4. Submit to API: `POST /api/auth/signup`
  5. Hash password (bcrypt, salt rounds: 10)
  6. Create user record in database
  7. Generate email verification token
  8. Send verification email
  9. Create session/JWT token
  10. Redirect to email verification page or onboarding

##### **Already Have Account Link**
- **Label:** "Already have an account? Sign In"
- **Functionality:** Redirect to `/login` page

#### **Section 4: Email Verification Flow**

##### **Verification Email Sent**
- **Trigger:** After successful signup
- **Email Content:**
  - Subject: "Verify your email for [App Name]"
  - Greeting with user's name
  - Verification link (expires in 24 hours)
  - Alternative: 6-digit verification code
  - Support contact info
- **Functionality:**
  - Click verification link → verify email → redirect to dashboard
  - Enter code manually on verification page

### **Technical Implementation Details:**

#### **Frontend Components:**
```
components/signup/
├── SignUpForm.jsx
├── FormField.jsx
├── PasswordStrengthMeter.jsx
├── SocialSignUpButtons.jsx
├── TermsCheckbox.jsx
└── EmailVerificationPrompt.jsx
```

#### **API Endpoints:**
- `POST /api/auth/signup` - Create new user account
- `POST /api/auth/check-email` - Check if email exists
- `POST /api/auth/send-verification` - Resend verification email
- `GET /api/auth/verify-email/:token` - Verify email with token
- `POST /api/auth/verify-code` - Verify with 6-digit code

#### **Database Schema:**
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  company_id UUID REFERENCES companies(id),
  email_verified BOOLEAN DEFAULT FALSE,
  email_verification_token VARCHAR(255),
  verification_token_expires TIMESTAMP,
  referral_source VARCHAR(100),
  marketing_opt_in BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_verification_token ON users(email_verification_token);
```

#### **Security Measures:**
- Password hashing with bcrypt (10 salt rounds)
- CSRF token protection
- Rate limiting (5 attempts per 15 minutes per IP)
- ReCAPTCHA v3 for bot prevention
- Email verification required before full access
- Secure session management with HTTP-only cookies
- SQL injection prevention with parameterized queries

#### **Validation Library:**
- Use Yup or Zod for schema validation
- Real-time validation with debounce (300ms)
- Server-side validation as final check

---

## PAGE 3: LOGIN PAGE (/login)
**Development Priority:** HIGH  
**Development Order:** 3rd  
**Estimated Time:** 3-4 days  
**Dependencies:** Authentication service, session management

### **Page Purpose:**
Allow existing users to sign into their accounts and access the payroll system.

### **Detailed Functionality to Implement:**

#### **Section 1: Login Form**

##### **Field 1: Email Address**
- **Input Type:** Email
- **Label:** "Email Address"
- **Placeholder:** "john@company.com"
- **Autocomplete:** email
- **Validation:**
  - Required field
  - Valid email format
  - Real-time format validation
- **Error Messages:**
  - "Please enter your email address"
  - "Please enter a valid email address"
- **Icon:** Envelope icon
- **Remember Me:** Pre-fill if previously saved

##### **Field 2: Password**
- **Input Type:** Password (with show/hide toggle)
- **Label:** "Password"
- **Placeholder:** "Enter your password"
- **Autocomplete:** current-password
- **Validation:**
  - Required field
- **Error Messages:**
  - "Please enter your password"
  - "Incorrect email or password" (generic for security)
- **Show/Hide Toggle:** Eye icon

##### **Field 3: Remember Me Checkbox**
- **Input Type:** Checkbox
- **Label:** "Remember me on this device"
- **Default:** Unchecked
- **Functionality:**
  - If checked, store secure token for 30 days
  - Auto-login on next visit
  - Clear on logout

##### **Forgot Password Link**
- **Label:** "Forgot Password?"
- **Position:** Below password field, right-aligned
- **Functionality:** Redirect to `/forgot-password` page

#### **Section 2: Social Login Options**

##### **Google Login Button**
- **Label:** "Continue with Google"
- **Icon:** Google logo
- **Functionality:**
  - OAuth 2.0 authentication
  - Check if Google email matches existing account
  - Auto-login if matched
  - Error if no account exists

##### **Microsoft Login Button**
- **Label:** "Continue with Microsoft"
- **Icon:** Microsoft logo
- **Functionality:** Same as Google OAuth

##### **LinkedIn Login Button**
- **Label:** "Continue with LinkedIn"
- **Icon:** LinkedIn logo
- **Functionality:** Same as Google OAuth

#### **Section 3: Form Submission**

##### **Sign In Button**
- **Label:** "Sign In"
- **State Management:**
  - Disabled if email or password empty
  - Loading spinner during authentication
  - Success state before redirect
- **Click Functionality:**
  1. Validate email and password fields
  2. Submit to API: `POST /api/auth/login`
  3. Server verifies credentials (bcrypt compare)
  4. Check if email is verified
  5. Check account status (active/suspended)
  6. Generate JWT token or session
  7. Set HTTP-only cookie
  8. Log login event (IP, timestamp, device)
  9. Redirect to dashboard or last visited page

##### **Error Handling:**
- **Invalid Credentials:** "Incorrect email or password"
- **Unverified Email:** "Please verify your email first" + resend link
- **Account Suspended:** "Your account has been suspended. Contact support."
- **Too Many Attempts:** "Too many login attempts. Try again in 15 minutes."
- **Server Error:** "Something went wrong. Please try again."

##### **Don't Have Account Link**
- **Label:** "Don't have an account? Sign Up"
- **Functionality:** Redirect to `/signup` page

#### **Section 4: Security Features**

##### **Two-Factor Authentication (2FA)**
- **Trigger:** If user has 2FA enabled
- **Flow:**
  1. After password verification, redirect to 2FA page
  2. Send 6-digit code via SMS or authenticator app
  3. User enters code
  4. Verify code
  5. Grant access

##### **Account Lockout**
- **Failed Attempts:** Track failed login attempts
- **Threshold:** 5 failed attempts
- **Lockout Duration:** 15 minutes
- **Notification:** Email user about suspicious activity
- **Unlock:** Automatic after duration or manual via email link

##### **Device Recognition**
- **New Device Detection:** Check if logging in from new device
- **Notification:** Email user about new device login
- **Verification:** Option to require email verification for new devices

### **Technical Implementation Details:**

#### **Frontend Components:**
```
components/login/
├── LoginForm.jsx
├── SocialLoginButtons.jsx
├── RememberMeCheckbox.jsx
├── TwoFactorModal.jsx
└── LoginErrorAlert.jsx
```

#### **API Endpoints:**
- `POST /api/auth/login` - Authenticate user
- `POST /api/auth/logout` - End session
- `POST /api/auth/refresh-token` - Refresh JWT
- `POST /api/auth/2fa/verify` - Verify 2FA code
- `POST /api/auth/2fa/resend` - Resend 2FA code

#### **Session Management:**
- **JWT Token:** Store in HTTP-only cookie
- **Token Expiration:** 1 hour
- **Refresh Token:** 7 days
- **Token Payload:**
  ```json
  {
    "userId": "uuid",
    "email": "user@company.com",
    "companyId": "uuid",
    "role": "admin/user",
    "iat": 1234567890,
    "exp": 1234571490
  }
  ```

#### **Security Measures:**
- Rate limiting: 5 attempts per 15 minutes per IP
- CSRF protection
- Brute force protection with exponential backoff
- Login attempt logging with IP and user agent
- Suspicious activity detection and notification
- Secure session cookies (HTTP-only, Secure, SameSite)

#### **Analytics Tracking:**
- Login success/failure rates
- Social login usage
- Device and browser statistics
- Geographic login locations (for security)

---

## PAGE 4: FORGOT PASSWORD PAGE (/forgot-password)
**Development Priority:** HIGH  
**Development Order:** 4th  
**Estimated Time:** 2-3 days  
**Dependencies:** Email service, token generation

### **Page Purpose:**
Allow users to reset their password if they've forgotten it.

### **Detailed Functionality to Implement:**

#### **Section 1: Request Password Reset**

##### **Field 1: Email Address**
- **Input Type:** Email
- **Label:** "Email Address"
- **Placeholder:** "Enter your registered email"
- **Validation:**
  - Required field
  - Valid email format
  - Check if email exists in database
- **Error Messages:**
  - "Please enter your email address"
  - "Please enter a valid email address"
- **Success Message:** "If this email is registered, you'll receive reset instructions"
- **Icon:** Envelope icon

##### **Submit Button**
- **Label:** "Send Reset Link"
- **State Management:**
  - Disabled if email invalid
  - Loading spinner during submission
  - Success state after email sent
- **Click Functionality:**
  1. Validate email
  2. Check if email exists: `POST /api/auth/forgot-password`
  3. Generate password reset token (UUID)
  4. Set token expiration (1 hour)
  5. Save token to database
  6. Send email with reset link
  7. Show success message (even if email doesn't exist - security)
  8. Redirect to confirmation page

#### **Section 2: Reset Email Content**

##### **Email Template:**
- **Subject:** "Reset your password for [App Name]"
- **Content:**
  - Greeting with user's name
  - "We received a request to reset your password"
  - Reset link button (valid for 1 hour)
  - Alternative: Display reset code if link doesn't work
  - Security note: "If you didn't request this, ignore this email"
  - Link expiration notice
  - Support contact info
- **Reset Link Format:** `https://app.com/reset-password?token=abc123xyz`

#### **Section 3: Confirmation Page**

##### **Success Message:**
- **Heading:** "Check Your Email"
- **Message:** "We've sent password reset instructions to your email"
- **Instructions:**
  1. Check your email inbox
  2. Click the reset link
  3. Create a new password
- **Didn't Receive Email Section:**
  - Check spam folder
  - "Resend Email" button (with cooldown timer)
  - Verify email address is correct

##### **Back to Login Link**
- **Label:** "Back to Login"
- **Functionality:** Redirect to `/login`

### **Technical Implementation Details:**

#### **Frontend Components:**
```
components/forgot-password/
├── ForgotPasswordForm.jsx
├── EmailSentConfirmation.jsx
└── ResendEmailButton.jsx
```

#### **API Endpoints:**
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/resend-reset-email` - Resend reset email
- `POST /api/auth/validate-reset-token` - Check if token is valid

#### **Database Schema:**
```sql
ALTER TABLE users ADD COLUMN reset_token VARCHAR(255);
ALTER TABLE users ADD COLUMN reset_token_expires TIMESTAMP;

CREATE INDEX idx_users_reset_token ON users(reset_token);
```

#### **Security Measures:**
- Rate limiting: 3 reset requests per 15 minutes per email
- Generic success message (don't reveal if email exists)
- Token expiration: 1 hour
- One-time use tokens (invalidate after use)
- Log all reset attempts

---

## PAGE 5: RESET PASSWORD PAGE (/reset-password)
**Development Priority:** HIGH  
**Development Order:** 5th  
**Estimated Time:** 2-3 days  
**Dependencies:** Token validation, password hashing

### **Page Purpose:**
Allow users to create a new password after clicking the reset link.

### **Detailed Functionality to Implement:**

#### **Section 1: Token Validation (On Page Load)**

##### **Token Check:**
1. Extract token from URL query parameter
2. Call API: `GET /api/auth/validate-reset-token?token=xyz`
3. Check if token exists in database
4. Check if token has expired
5. **If Valid:** Show password reset form
6. **If Invalid/Expired:** Show error message and link to request new reset

##### **Error States:**
- **Expired Token:**
  - Message: "This password reset link has expired"
  - Action: "Request a new reset link" button
- **Invalid Token:**
  - Message: "This password reset link is invalid"
  - Action: "Go to login" or "Request new link"
- **Already Used Token:**
  - Message: "This reset link has already been used"
  - Action: "Go to login"

#### **Section 2: New Password Form**

##### **Field 1: New Password**
- **Input Type:** Password (with show/hide toggle)
- **Label:** "New Password"
- **Placeholder:** "Create a strong password"
- **Validation:**
  - Required field
  - Minimum 8 characters
  - At least one uppercase letter
  - At least one lowercase letter
  - At least one number
  - At least one special character
  - Cannot be same as old password (check hash)
  - Real-time strength indicator
- **Password Strength Meter:** Same as signup page
- **Error Messages:**
  - "Password is required"
  - "Password must be at least 8 characters"
  - "Password must include uppercase, lowercase, number, and special character"
  - "New password cannot be the same as your old password"
- **Show/Hide Toggle:** Eye icon

##### **Field 2: Confirm New Password**
- **Input Type:** Password
- **Label:** "Confirm New Password"
- **Placeholder:** "Re-enter your new password"
- **Validation:**
  - Required field
  - Must match new password exactly
  - Real-time match validation
- **Error Messages:**
  - "Please confirm your password"
  - "Passwords do not match"
- **Success Indicator:** Green checkmark when matched

##### **Password Requirements Checklist:**
Display requirements with checkmarks:
- ✓ At least 8 characters
- ✓ One uppercase letter
- ✓ One lowercase letter
- ✓ One number
- ✓ One special character

#### **Section 3: Form Submission**

##### **Reset Password Button**
- **Label:** "Reset Password"
- **State Management:**
  - Disabled if passwords don't match or requirements not met
  - Loading spinner during submission
  - Success state after reset
- **Click Functionality:**
  1. Validate both password fields
  2. Check password strength
  3. Submit to API: `POST /api/auth/reset-password`
  4. Verify token again (server-side)
  5. Hash new password (bcrypt)
  6. Update user's password in database
  7. Invalidate reset token
  8. Invalidate all existing sessions (logout from all devices)
  9. Send confirmation email
  10. Show success message
  11. Auto-redirect to login after 3 seconds

##### **Success Message:**
- **Heading:** "Password Reset Successful!"
- **Message:** "Your password has been changed successfully"
- **Action:** "Redirecting to login..." (countdown timer)
- **Manual Link:** "Go to Login Now"

#### **Section 4: Security Notifications**

##### **Password Changed Email:**
- **Trigger:** After successful password reset
- **Subject:** "Your password has been changed"
- **Content:**
  - Confirmation that password was changed
  - Timestamp and IP address
  - Device information
  - "If you didn't make this change, contact support immediately"
  - Support contact link
  - Security tips

### **Technical Implementation Details:**

#### **Frontend Components:**
```
components/reset-password/
├── ResetPasswordForm.jsx
├── PasswordStrengthMeter.jsx
├── TokenValidator.jsx
├── SuccessMessage.jsx
└── ErrorMessage.jsx
```

#### **API Endpoints:**
- `GET /api/auth/validate-reset-token` - Check token validity
- `POST /api/auth/reset-password` - Update password
- `POST /api/auth/invalidate-sessions` - Logout from all devices

#### **Database Operations:**
```sql
-- Update password and invalidate token
UPDATE users 
SET password_hash = $1,
    reset_token = NULL,
    reset_token_expires = NULL,
    updated_at = NOW()
WHERE reset_token = $2 
AND reset_token_expires > NOW();

-- Invalidate all sessions
DELETE FROM sessions WHERE user_id = $1;
```

#### **Security Measures:**
- Token must be validated on both page load and submission
- One-time use tokens (deleted after use)
- Logout from all devices after password change
- Email notification of password change
- Log password reset events with IP and timestamp

---

## PAGE 6: EMAIL VERIFICATION PAGE (/verify-email)
**Development Priority:** HIGH  
**Development Order:** 6th  
**Estimated Time:** 2 days  
**Dependencies:** Email service, token validation

### **Page Purpose:**
Confirm user's email address after signup to ensure it's valid and belongs to them.

### **Detailed Functionality to Implement:**

#### **Section 1: Automatic Verification (via Link)**

##### **Token Verification on Page Load:**
1. Extract verification token from URL: `/verify-email?token=abc123`
2. Call API: `GET /api/auth/verify-email/:token`
3. Check if token exists and matches user
4. Check if token has expired (24 hours)
5. **If Valid:**
   - Mark email as verified in database
   - Invalidate verification token
   - Show success message
   - Auto-redirect to onboarding or dashboard
6. **If Invalid/Expired:**
   - Show error message
   - Offer to resend verification email

##### **Success State:**
- **Heading:** "Email Verified Successfully!"
- **Icon:** Large green checkmark
- **Message:** "Your email has been confirmed"
- **Action:** "Redirecting to your dashboard..." (3-second countdown)
- **Manual Link:** "Continue to Dashboard"

##### **Error States:**
- **Expired Token:**
  - Message: "This verification link has expired"
  - Action: "Send New Verification Email" button
- **Invalid Token:**
  - Message: "This verification link is invalid"
  - Action: "Resend Verification" or "Contact Support"
- **Already Verified:**
  - Message: "This email has already been verified"
  - Action: "Go to Dashboard"

#### **Section 2: Manual Verification (Code Entry)**

##### **Alternative Verification Method:**
If user didn't click link, allow manual code entry.

##### **Field 1: 6-Digit Verification Code**
- **Input Type:** Text (numeric only)
- **Label:** "Enter Verification Code"
- **Placeholder:** "000000"
- **Format:** Auto-format as 000-000 or separate input boxes
- **Validation:**
  - Required field
  - Must be exactly 6 digits
  - Real-time validation
- **Error Messages:**
  - "Please enter the 6-digit code"
  - "Invalid verification code"
  - "Code has expired"
- **Auto-focus:** Focus on input when page loads

##### **Verify Code Button**
- **Label:** "Verify Email"
- **Functionality:**
  1. Submit code to API: `POST /api/auth/verify-code`
  2. Check if code matches user's verification code
  3. Check if code has expired (24 hours)
  4. Mark email as verified
  5. Show success message
  6. Redirect to dashboard

#### **Section 3: Resend Verification Email**

##### **Didn't Receive Email Section:**
- **Message:** "Didn't receive the email?"
- **Suggestions:**
  - Check your spam folder
  - Verify your email address is correct
  - Wait a few minutes
- **Resend Button:** "Resend Verification Email"

##### **Resend Functionality:**
- **Click Action:**
  1. Call API: `POST /api/auth/resend-verification`
  2. Generate new verification token
  3. Update token expiration
  4. Send new verification email
  5. Show success toast
  6. Disable button for 60 seconds (cooldown)
- **Cooldown Timer:** "Resend in 60s..." countdown
- **Rate Limiting:** Maximum 3 resends per hour

##### **Change Email Option:**
- **Link:** "Wrong email? Update your email address"
- **Functionality:** Open modal to change email
- **Modal Fields:**
  - New email address
  - Password confirmation
  - Update button
- **Update Flow:**
  1. Verify password
  2. Update email in database
  3. Mark as unverified
  4. Send new verification email
  5. Show confirmation

#### **Section 4: Email Templates**

##### **Verification Email Content:**
- **Subject:** "Verify your email for [App Name]"
- **Content:**
  - Greeting with user's name
  - "Thanks for signing up!"
  - **Primary CTA:** Big "Verify Email" button
  - **Alternative:** "Or copy this link:" with full URL
  - **Code Option:** "Or enter this code: 123456"
  - Expiration notice (24 hours)
  - Support contact

### **Technical Implementation Details:**

#### **Frontend Components:**
```
components/verify-email/
├── AutoVerification.jsx
├── ManualCodeEntry.jsx
├── ResendEmailButton.jsx
├── ChangeEmailModal.jsx
└── VerificationStatus.jsx
```

#### **API Endpoints:**
- `GET /api/auth/verify-email/:token` - Verify via token
- `POST /api/auth/verify-code` - Verify via 6-digit code
- `POST /api/auth/resend-verification` - Resend email
- `POST /api/auth/update-email` - Change email address

#### **Database Schema:**
```sql
ALTER TABLE users ADD COLUMN email_verified BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN email_verification_token VARCHAR(255);
ALTER TABLE users ADD COLUMN email_verification_code VARCHAR(6);
ALTER TABLE users ADD COLUMN verification_token_expires TIMESTAMP;

CREATE INDEX idx_users_verification_token ON users(email_verification_token);
```

#### **Security Measures:**
- Token expiration: 24 hours
- Code expiration: 24 hours
- Rate limiting on resend (3 per hour)
- One-time use tokens and codes
- Log all verification attempts

---

## PAGE 7: TWO-FACTOR AUTHENTICATION SETUP (/settings/2fa)
**Development Priority:** MEDIUM  
**Development Order:** 7th  
**Estimated Time:** 3-4 days  
**Dependencies:** Authenticator app integration, SMS service

### **Page Purpose:**
Allow users to enable and configure two-factor authentication for enhanced account security.

### **Detailed Functionality to Implement:**

#### **Section 1: 2FA Overview**

##### **Information Section:**
- **Heading:** "Two-Factor Authentication (2FA)"
- **Description:** "Add an extra layer of security to your account by requiring both your password and a verification code to sign in."
- **Benefits List:**
  - Protect against unauthorized access
  - Secure sensitive payroll data
  - Industry-standard security practice
  - Required for compliance (SOC 2, PCI DSS)

##### **2FA Status Badge:**
- **If Disabled:** Red badge "Not Enabled" + "Enable 2FA" button
- **If Enabled:** Green badge "Enabled" + "Disable 2FA" button
- **Last Updated:** Show when 2FA was enabled/disabled

#### **Section 2: Choose 2FA Method**

##### **Method 1: Authenticator App (Recommended)**
- **Radio Button:** Select authenticator app
- **Label:** "Authenticator App (Recommended)"
- **Description:** "Use Google Authenticator, Authy, or similar apps"
- **Pros:**
  - Works offline
  - More secure than SMS
  - Free
- **Supported Apps:**
  - Google Authenticator
  - Microsoft Authenticator
  - Authy
  - 1Password
  - LastPass Authenticator

##### **Method 2: SMS Text Message**
- **Radio Button:** Select SMS
- **Label:** "SMS Text Message"
- **Description:** "Receive codes via text message"
- **Warning:** "Less secure than authenticator apps"
- **Requires:** Phone number verification

##### **Method 3: Email (Backup)**
- **Radio Button:** Select email
- **Label:** "Email Verification"
- **Description:** "Receive codes via email (not recommended for primary method)"

#### **Section 3: Setup Authenticator App**

##### **Step 1: Download App**
- **Instructions:** "Download an authenticator app if you don't have one"
- **App Links:**
  - Google Authenticator (iOS | Android)
  - Microsoft Authenticator (iOS | Android)
  - Authy (iOS | Android | Desktop)

##### **Step 2: Scan QR Code**
- **QR Code Display:** Generate unique QR code for user
- **Instructions:** "Open your authenticator app and scan this QR code"
- **QR Code Generation:**
  1. Generate secret key (base32)
  2. Create TOTP URL: `otpauth://totp/PayrollApp:user@email.com?secret=ABC123&issuer=PayrollApp`
  3. Generate QR code from URL
- **Manual Entry Option:** "Can't scan? Enter this code manually:"
- **Secret Key:** Display in monospace font: `ABCD EFGH IJKL MNOP`

##### **Step 3: Enter Verification Code**
- **Field:** 6-digit code input
- **Label:** "Enter the 6-digit code from your app"
- **Placeholder:** "000000"
- **Format:** Auto-format as 000-000 or separate boxes
- **Validation:**
  - Required field
  - 6 digits only
  - Verify against TOTP algorithm
- **Verify Button:** "Verify and Enable 2FA"
- **Verification Logic:**
  1. User enters code
  2. Submit to API: `POST /api/auth/2fa/verify-setup`
  3. Server validates code using TOTP algorithm
  4. Allow ±1 time window (30 seconds)
  5. If valid: Enable 2FA, save secret key
  6. If invalid: Show error, allow retry

#### **Section 4: Setup SMS 2FA**

##### **Phone Number Entry:**
- **Field:** Phone number input
- **Label:** "Enter your mobile number"
- **Placeholder:** "(555) 123-4567"
- **Auto-formatting:** Format as (XXX) XXX-XXXX
- **Validation:**
  - Required field
  - Valid US phone format
  - 10 digits
- **Send Code Button:** "Send Verification Code"

##### **SMS Verification:**
1. Call API: `POST /api/auth/2fa/send-sms`
2. Generate 6-digit code
3. Send SMS via Twilio/AWS SNS
4. User enters code
5. Verify code
6. Enable SMS 2FA

#### **Section 5: Backup Codes**

##### **Generate Backup Codes:**
- **Trigger:** After 2FA is enabled
- **Heading:** "Save Your Backup Codes"
- **Warning:** "Store these codes in a safe place. Each code can only be used once."
- **Code Display:**
  - Generate 10 backup codes
  - 8-character alphanumeric codes
  - Display in a grid or list
  - Format: `ABCD-1234`
- **Actions:**
  - Download as text file
  - Print codes
  - Copy to clipboard
  - "I've saved my codes" checkbox (required to proceed)

##### **Backup Code Storage:**
```sql
CREATE TABLE backup_codes (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  code_hash VARCHAR(255),
  used BOOLEAN DEFAULT FALSE,
  used_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### **Section 6: 2FA Management (After Setup)**

##### **Enabled 2FA Status:**
- **Status:** "Two-Factor Authentication is enabled"
- **Method:** Display which method is active
- **Added On:** Timestamp of when 2FA was enabled

##### **Change 2FA Method:**
- **Button:** "Change 2FA Method"
- **Functionality:** Switch between authenticator app and SMS

##### **View Backup Codes:**
- **Button:** "View Backup Codes"
- **Require Password:** Confirm password before showing codes
- **Regenerate Option:** "Generate New Backup Codes" (invalidates old ones)

##### **Disable 2FA:**
- **Button:** "Disable Two-Factor Authentication"
- **Warning Modal:**
  - "Are you sure? This will make your account less secure."
  - Require password confirmation
  - Confirm button
- **Functionality:**
  1. Verify password
  2. Disable 2FA in database
  3. Delete secret key and backup codes
  4. Send notification email
  5. Log security event

#### **Section 7: Recovery Options**

##### **Lost Device Recovery:**
- **Link:** "Lost your device? Recover your account"
- **Recovery Methods:**
  1. Use backup code
  2. Contact support with identity verification
  3. Account recovery via email (if enabled)

### **Technical Implementation Details:**

#### **Frontend Components:**
```
components/2fa/
├── TwoFactorSetup.jsx
├── QRCodeDisplay.jsx
├── AuthenticatorSetup.jsx
├── SMSSetup.jsx
├── BackupCodes.jsx
├── TwoFactorStatus.jsx
└── DisableModal.jsx
```

#### **API Endpoints:**
- `POST /api/auth/2fa/setup` - Initialize 2FA setup
- `POST /api/auth/2fa/verify-setup` - Verify and enable 2FA
- `POST /api/auth/2fa/send-sms` - Send SMS code
- `POST /api/auth/2fa/disable` - Disable 2FA
- `GET /api/auth/2fa/backup-codes` - Get backup codes
- `POST /api/auth/2fa/regenerate-backup-codes` - Create new backup codes

#### **TOTP Algorithm:**
- **Library:** Use `speakeasy` or `otplib`
- **Time Window:** 30 seconds
- **Tolerance:** ±1 window (allow codes 30s before/after)
- **Secret Generation:** 32-character base32 string

#### **Security Measures:**
- Secret key encrypted at rest
- Backup codes hashed (bcrypt)
- Rate limiting on verification attempts
- Email notification when 2FA status changes
- Require password confirmation for changes
- Log all 2FA events

---

## PAGE 8: USER PROFILE PAGE (/profile)
**Development Priority:** MEDIUM  
**Development Order:** 8th  
**Estimated Time:** 3 days  
**Dependencies:** File upload service, image processing

### **Page Purpose:**
Allow users to view and edit their personal profile information and account settings.

### **Detailed Functionality to Implement:**

#### **Section 1: Profile Header**

##### **Profile Photo:**
- **Display:** Circular avatar (150x150px)
- **Default:** If no photo, show initials with colored background
- **Upload Functionality:**
  - Click to upload or drag-and-drop
  - Accepted formats: JPG, PNG, GIF
  - Max file size: 5MB
  - Image cropping tool (square crop)
  - Preview before saving
  - Upload to S3/CloudFront
- **Change Photo Button:** Appears on hover
- **Remove Photo Option:** Delete custom photo, revert to initials

##### **User Name Display:**
- **Name:** Large text display of full name
- **Email:** Below name, smaller text
- **Member Since:** "Member since [Month Year]"
- **Edit Button:** Pencil icon to edit profile

#### **Section 2: Personal Information**

##### **Editable Fields:**

###### **Field 1: Full Name**
- **Input Type:** Text
- **Current Value:** Display current name
- **Validation:** Same as signup (min 2 chars, letters only)
- **Edit Mode:** Click to edit inline or open modal

###### **Field 2: Email Address**
- **Input Type:** Email
- **Current Value:** Display current email
- **Edit Functionality:**
  - Click "Change Email"
  - Require password confirmation
  - Enter new email
  - Send verification to new email
  - Email changes after verification
  - Keep old email until verified
- **Status:** Show "Verified" badge if email is verified

###### **Field 3: Phone Number**
- **Input Type:** Tel
- **Current Value:** Display current phone
- **Auto-formatting:** (XXX) XXX-XXXX
- **Validation:** Valid US phone format

###### **Field 4: Job Title**
- **Input Type:** Text
- **Placeholder:** "HR Manager, Payroll Administrator, etc."
- **Optional:** Can be blank

###### **Field 5: Company Role**
- **Input Type:** Dropdown
- **Options:**
  - Owner
  - Administrator
  - Payroll Manager
  - HR Manager
  - Accountant
  - Employee
  - Other

###### **Field 6: Time Zone**
- **Input Type:** Searchable dropdown
- **Options:** All time zones (America/New_York, etc.)
- **Auto-detect:** Suggest browser's time zone
- **Functionality:** Affects all timestamps in app

###### **Field 7: Language**
- **Input Type:** Dropdown
- **Options:**
  - English (US)
  - English (UK)
  - Spanish
  - French
  - German
- **Functionality:** Change app language

###### **Field 8: Date Format**
- **Input Type:** Radio buttons
- **Options:**
  - MM/DD/YYYY (US)
  - DD/MM/YYYY (International)
  - YYYY-MM-DD (ISO)

###### **Field 9: Number Format**
- **Input Type:** Radio buttons
- **Options:**
  - 1,234.56 (US)
  - 1.234,56 (European)

##### **Save Changes Button:**
- **Label:** "Save Changes"
- **Position:** Bottom of form
- **Functionality:**
  1. Validate all fields
  2. Submit to API: `PUT /api/users/profile`
  3. Update user record in database
  4. Show success toast
  5. Update UI with new values

##### **Cancel Button:**
- **Label:** "Cancel"
- **Functionality:** Revert all changes, restore original values

#### **Section 3: Security Settings**

##### **Password Section:**
- **Heading:** "Password"
- **Current Status:** "Last changed [X days ago]"
- **Change Password Button:** Opens modal

##### **Change Password Modal:**
- **Field 1:** Current Password (required for verification)
- **Field 2:** New Password (with strength meter)
- **Field 3:** Confirm New Password
- **Validation:** Same as reset password page
- **Submit Functionality:**
  1. Verify current password
  2. Validate new password
  3. Update password hash
  4. Invalidate all sessions except current
  5. Send confirmation email
  6. Show success message

##### **Two-Factor Authentication:**
- **Status:** Show if enabled or disabled
- **Toggle:** Enable/disable 2FA
- **Link:** "Manage 2FA Settings" → redirects to 2FA page

##### **Active Sessions:**
- **Heading:** "Active Sessions"
- **List:** Show all active login sessions
  - Device type (Desktop, Mobile, Tablet)
  - Browser
  - Location (city, country)
  - IP address
  - Last active timestamp
  - Current session highlighted
- **Actions:**
  - "Sign out" button for each session
  - "Sign out all other sessions" button

#### **Section 4: Notification Preferences**

##### **Email Notifications:**
- **Toggle Switches for Each Type:**
  - Payroll run completed
  - Employee added/removed
  - Tax filing reminders
  - System updates
  - Security alerts
  - Weekly summary reports
  - Marketing emails
- **Frequency Options:**
  - Instant
  - Daily digest
  - Weekly digest
  - Never

##### **In-App Notifications:**
- **Toggle Switches:**
  - Browser notifications
  - Sound alerts
  - Badge counts

##### **SMS Notifications (if phone number added):**
- **Toggle:** Enable/disable SMS
- **Types:**
  - Critical alerts only
  - Payroll reminders
  - Security alerts

#### **Section 5: Privacy Settings**

##### **Profile Visibility:**
- **Options:**
  - Visible to everyone in company
  - Visible to admins only
  - Private

##### **Activity Status:**
- **Toggle:** "Show when I'm online"
- **Options:**
  - Show to everyone
  - Show to no one

##### **Data Export:**
- **Button:** "Download My Data"
- **Functionality:** GDPR compliance
  - Generate report of all user data
  - Include profile info, activity logs, payroll records
  - Email download link when ready
  - ZIP file with JSON/CSV exports

#### **Section 6: Account Management**

##### **Delete Account:**
- **Button:** "Delete My Account" (red, danger style)
- **Warning Modal:**
  - "This action cannot be undone"
  - List what will be deleted
  - Require typing "DELETE" to confirm
  - Require password
- **Deletion Process:**
  1. Verify password
  2. Verify "DELETE" text match
  3. Mark account as deleted (soft delete)
  4. Anonymize personal data
  5. Send confirmation email
  6. Log out immediately
  7. 30-day grace period before permanent deletion

### **Technical Implementation Details:**

#### **Frontend Components:**
```
components/profile/
├── ProfileHeader.jsx
├── PhotoUpload.jsx
├── PersonalInfoForm.jsx
├── SecuritySettings.jsx
├── ChangePasswordModal.jsx
├── ActiveSessions.jsx
├── NotificationPreferences.jsx
├── PrivacySettings.jsx
└── DeleteAccountModal.jsx
```

#### **API Endpoints:**
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile
- `POST /api/users/upload-photo` - Upload profile photo
- `PUT /api/users/change-password` - Change password
- `GET /api/users/sessions` - Get active sessions
- `DELETE /api/users/sessions/:id` - Sign out session
- `PUT /api/users/preferences` - Update notification preferences
- `POST /api/users/export-data` - Request data export
- `DELETE /api/users/account` - Delete account

#### **File Upload:**
- **Storage:** AWS S3 or similar
- **CDN:** CloudFront for fast delivery
- **Image Processing:**
  - Resize to 300x300px
  - Convert to WebP for efficiency
  - Generate thumbnail (150x150px)
  - Optimize file size

#### **Database Schema:**
```sql
ALTER TABLE users ADD COLUMN profile_photo_url VARCHAR(500);
ALTER TABLE users ADD COLUMN job_title VARCHAR(100);
ALTER TABLE users ADD COLUMN time_zone VARCHAR(50);
ALTER TABLE users ADD COLUMN language VARCHAR(10) DEFAULT 'en';
ALTER TABLE users ADD COLUMN date_format VARCHAR(20) DEFAULT 'MM/DD/YYYY';
ALTER TABLE users ADD COLUMN number_format VARCHAR(20) DEFAULT 'US';

CREATE TABLE user_preferences (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  email_payroll_complete BOOLEAN DEFAULT TRUE,
  email_employee_added BOOLEAN DEFAULT TRUE,
  email_tax_reminders BOOLEAN DEFAULT TRUE,
  email_system_updates BOOLEAN DEFAULT TRUE,
  email_security_alerts BOOLEAN DEFAULT TRUE,
  email_weekly_summary BOOLEAN DEFAULT TRUE,
  email_marketing BOOLEAN DEFAULT FALSE,
  notification_frequency VARCHAR(20) DEFAULT 'instant',
  browser_notifications BOOLEAN DEFAULT TRUE,
  sms_enabled BOOLEAN DEFAULT FALSE,
  profile_visibility VARCHAR(20) DEFAULT 'company',
  show_online_status BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE active_sessions (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  token_hash VARCHAR(255),
  device_type VARCHAR(50),
  browser VARCHAR(100),
  ip_address VARCHAR(45),
  location VARCHAR(255),
  last_active TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

**END OF PART 1 - FOUNDATION & AUTHENTICATION PAGES**

**Next:** Part 2 will cover Onboarding & Setup Pages (Pages 9-20)
