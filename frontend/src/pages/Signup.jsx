import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '../contexts/AuthContext';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Select } from '../components/ui/select';
import { Checkbox } from '../components/ui/checkbox';
import { Mail, Lock, Eye, EyeOff, Phone, CheckCircle2, X, Building2, MapPin, AlertCircle } from 'lucide-react';

const signupSchema = z
  .object({
    companyName: z.string().min(2, 'Company name must be at least 2 characters').max(200, 'Company name too long'),
    email: z.string().email('Invalid email address').min(1, 'Email is required'),
    phoneNumber: z.string().regex(/^[0-9]{10}$/, 'Enter a valid 10-digit phone number'),
    country: z.string().min(1, 'Country is required'),
    state: z.string().min(1, 'State is required'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
        'Password must contain uppercase, lowercase, number, and special character'
      ),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
    acceptTerms: z
      .boolean()
      .refine((v) => v === true, { message: 'Please accept the Terms & Privacy Policy' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export default function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const { signup } = useAuth();

  const { register, handleSubmit, formState: { errors, isSubmitting }, watch, setValue } = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      companyName: '',
      email: '',
      phoneNumber: '',
      country: '',
      state: '',
      password: '',
      confirmPassword: '',
      acceptTerms: false,
    },
  });

  const phoneNumber = watch('phoneNumber');
  const selectedCountry = watch('country');

  // State options based on country
  const stateOptions = {
    'India': ['Andhra Pradesh', 'Karnataka', 'Kerala', 'Tamil Nadu', 'Telangana', 'Maharashtra', 'Gujarat', 'Delhi', 'West Bengal'],
    'United States': ['California', 'Texas', 'Florida', 'New York', 'Illinois', 'Pennsylvania', 'Ohio'],
    'United Kingdom': ['England', 'Scotland', 'Wales', 'Northern Ireland'],
    'Canada': ['Ontario', 'Quebec', 'British Columbia', 'Alberta'],
  };

  const currentStateOptions = stateOptions[selectedCountry] || [];

  // Reset state when country changes
  React.useEffect(() => {
    setValue('state', '');
  }, [selectedCountry, setValue]);

  const handleSendOTP = () => {
    if (phoneNumber && phoneNumber.match(/^\d{10}$/)) {
      console.log('Sending OTP to:', phoneNumber);
      setOtpSent(true);
      setTimeout(() => {
        alert(`OTP sent to ${phoneNumber}`);
      }, 500);
    }
  };

  const handleOtpChange = (index, value) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < 5) {
        document.getElementById(`otp-${index + 1}`)?.focus();
      }
    }
  };

  const handleVerifyOTP = () => {
    setVerifying(true);
    const otpValue = otp.join('');
    console.log('Verifying OTP:', otpValue);

    setTimeout(() => {
      if (otpValue === '123456') {
        setPhoneVerified(true);
        alert('Phone number verified successfully!');
      } else {
        alert('Invalid OTP. Try 123456 for demo.');
      }
      setVerifying(false);
    }, 1000);
  };

  const handleSocialSignup = (provider) => {
    console.log(`Sign up with ${provider}`);
  };

  const onSubmit = async (data) => {
    try {
      if (!phoneVerified) {
        setError('Please verify your phone number first');
        return;
      }

      setError('');
      await signup({
        companyName: data.companyName,
        email: data.email,
        phoneNumber: data.phoneNumber,
        country: data.country,
        state: data.state,
        password: data.password,
      });

      // Navigate to login after successful signup
      navigate('/login');
    } catch (err) {
      setError(err.message || 'Signup failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Decorative */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-pink-100 via-rose-50 to-white p-12 flex-col justify-start relative overflow-hidden">
        {/* Decorative Blobs */}
        <div className="absolute top-20 left-20 w-64 h-64 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
        <div className="absolute top-40 right-20 w-64 h-64 bg-rose-200 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-40 w-64 h-64 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>

        <style>{`
          @keyframes blob {
            0%, 100% { transform: translate(0, 0) scale(1); }
            33% { transform: translate(30px, -50px) scale(1.1); }
            66% { transform: translate(-20px, 20px) scale(0.9); }
          }
          .animate-blob {
            animation: blob 7s infinite;
          }
          .animation-delay-2000 {
            animation-delay: 2s;
          }
          .animation-delay-4000 {
            animation-delay: 4s;
          }
        `}</style>

        <div className="relative z-10 space-y-5 pb-12 lg:pb-16">
          <div className="flex items-center gap-4 bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
            <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-600 rounded-full flex items-center justify-center flex-shrink-0">
              <CheckCircle2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="font-bold text-slate-900">Create your account</p>
              <p className="text-sm text-slate-600">Quick and easy setup</p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
            <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-600 rounded-full flex items-center justify-center flex-shrink-0">
              <CheckCircle2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="font-bold text-slate-900">Configure settings</p>
              <p className="text-sm text-slate-600">Customize your workspace</p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
            <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-600 rounded-full flex items-center justify-center flex-shrink-0">
              <CheckCircle2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="font-bold text-slate-900">Run payroll</p>
              <p className="text-sm text-slate-600">Start processing in minutes</p>
            </div>
          </div>
        </div>
        <div className="relative z-10 pt-6 lg:pt-8">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            Payroll made simple, efficient, and auto-compliant for every business.
          </h2>
          <p className="text-slate-600 text-lg">Trusted by growing companies</p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white overflow-y-auto">
        <div className="w-full max-w-md py-8">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <img src="/logo.png" alt="PayrollPro" className="h-12 mx-auto" />
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Let's get started</h1>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-5 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Company Name */}
            <div>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 z-10" />
                <Input
                  id="companyName"
                  placeholder="Company Name"
                  className="pl-10 h-11 border-slate-300 focus:border-pink-500 focus:ring-pink-500 rounded-lg text-sm"
                  {...register('companyName')}
                />
              </div>
              {errors.companyName && <p className="mt-1 text-xs text-red-600">{errors.companyName.message}</p>}
            </div>

            {/* Email */}
            <div>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 z-10" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Email Address"
                  className="pl-10 h-11 border-slate-300 focus:border-pink-500 focus:ring-pink-500 rounded-lg text-sm"
                  {...register('email')}
                />
              </div>
              {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
            </div>

            {/* Country and State */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none z-10" />
                  <Select
                    id="country"
                    className="w-full h-11 pl-10 pr-3 rounded-lg border border-slate-300 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 appearance-none"
                    {...register('country')}
                  >
                    <option value="">Select Country</option>
                    <option value="India">India</option>
                    <option value="United States">United States</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Canada">Canada</option>
                  </Select>
                </div>
                {errors.country && <p className="mt-1 text-xs text-red-600">{errors.country.message}</p>}
              </div>

              <div>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none z-10" />
                  <Select
                    id="state"
                    disabled={!selectedCountry || currentStateOptions.length === 0}
                    className="w-full h-11 pl-10 pr-3 rounded-lg border border-slate-300 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 disabled:bg-slate-50 disabled:text-slate-400 appearance-none"
                    {...register('state')}
                  >
                    <option value="">{currentStateOptions.length ? 'Select State' : 'Select Country First'}</option>
                    {currentStateOptions.map((state) => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </Select>
                </div>
                {errors.state && <p className="mt-1 text-xs text-red-600">{errors.state.message}</p>}
              </div>
            </div>

            {/* Phone Number with OTP */}
            <div>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 z-10" />
                  <Input
                    id="phoneNumber"
                    placeholder="Phone Number"
                    className="pl-10 h-11 border-slate-300 focus:border-pink-500 focus:ring-pink-500 rounded-lg text-sm"
                    {...register('phoneNumber')}
                    disabled={phoneVerified}
                  />
                  {phoneVerified && (
                    <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-600" />
                  )}
                </div>
                {!phoneVerified && (
                  <Button
                    type="button"
                    onClick={handleSendOTP}
                    disabled={!phoneNumber || !phoneNumber.match(/^\d{10}$/) || otpSent}
                    className="h-11 px-4 bg-pink-600 hover:bg-pink-700 text-sm"
                  >
                    {otpSent ? 'Sent' : 'Send OTP'}
                  </Button>
                )}
              </div>
              {errors.phoneNumber && <p className="mt-1 text-xs text-red-600">{errors.phoneNumber.message}</p>}

              {/* OTP Input */}
              {otpSent && !phoneVerified && (
                <div className="mt-3 p-3 bg-pink-50 border border-pink-200 rounded-lg">
                  <p className="text-xs font-semibold text-slate-700 mb-2">Enter 6-digit OTP</p>
                  <div className="flex gap-1.5 mb-3">
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        id={`otp-${index}`}
                        type="text"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        className="w-9 h-9 text-center text-sm font-bold border-2 border-slate-300 rounded-md focus:border-pink-500 focus:ring-1 focus:ring-pink-500 focus:outline-none"
                      />
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      onClick={handleVerifyOTP}
                      disabled={otp.join('').length !== 6 || verifying}
                      className="flex-1 h-9 bg-green-600 hover:bg-green-700 text-sm"
                    >
                      {verifying ? 'Verifying...' : 'Verify'}
                    </Button>
                    <Button
                      type="button"
                      onClick={() => {
                        setOtpSent(false);
                        setOtp(['', '', '', '', '', '']);
                      }}
                      variant="outline"
                      className="h-9 px-3 border-slate-300"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                  <p className="mt-1.5 text-xs text-slate-500">Demo OTP: <code className="bg-white px-1 rounded">123456</code></p>
                </div>
              )}
            </div>

            {/* Password Fields */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 z-10" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    className="pl-10 pr-10 h-11 border-slate-300 focus:border-pink-500 focus:ring-pink-500 rounded-lg text-sm"
                    {...register('password')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>}
              </div>

              <div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 z-10" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm Password"
                    className="pl-10 pr-10 h-11 border-slate-300 focus:border-pink-500 focus:ring-pink-500 rounded-lg text-sm"
                    {...register('confirmPassword')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="mt-1 text-xs text-red-600">{errors.confirmPassword.message}</p>}
              </div>
            </div>

            {/* Terms & Conditions */}
            <div>
              <label className="inline-flex items-start gap-2 text-xs text-slate-600 cursor-pointer">
                <Checkbox
                  {...register('acceptTerms')}
                  className="h-4 w-4 mt-0.5 rounded border-slate-300 text-pink-600 focus:ring-pink-500"
                />
                <span>
                  I agree to the <a href="#" className="font-semibold text-pink-600 hover:text-pink-700 underline">Terms of Service</a> and <a href="#" className="font-semibold text-pink-600 hover:text-pink-700 underline">Privacy Policy</a>
                </span>
              </label>
              {errors.acceptTerms && <p className="mt-1 text-xs text-red-600">{errors.acceptTerms.message}</p>}
            </div>

            <p className="text-xs text-slate-500">Your data will be in INDIA data center.</p>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full h-12 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white font-semibold rounded-lg shadow-lg"
              disabled={isSubmitting || !phoneVerified}
            >
              {isSubmitting ? 'Creating account...' : 'Sign up now'}
            </Button>
            {!phoneVerified && (
              <p className="text-xs text-amber-600 text-center -mt-2">Please verify your phone number</p>
            )}
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-slate-500">Or sign up using</span>
            </div>
          </div>

          {/* Social Signup */}
          <div className="flex justify-center gap-3">
            <Button
              type="button"
              onClick={() => handleSocialSignup('google')}
              className="w-12 h-12 flex items-center justify-center border border-slate-300 rounded-lg hover:bg-slate-50 transition-all"
              variant="secondary"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
            </Button>
            <Button
              type="button"
              onClick={() => handleSocialSignup('linkedin')}
              className="w-12 h-12 flex items-center justify-center border border-slate-300 rounded-lg hover:bg-slate-50 transition-all"
              variant="secondary"
            >
              <svg className="w-5 h-5" fill="#0A66C2" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </Button>
            <Button
              type="button"
              onClick={() => handleSocialSignup('github')}
              className="w-12 h-12 flex items-center justify-center border border-slate-300 rounded-lg hover:bg-slate-50 transition-all"
              variant="secondary"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
            </Button>
          </div>

          {/* Login Link */}
          <p className="mt-6 text-center text-sm text-slate-600">
            Already have an account? <Link to="/login" className="font-semibold text-pink-600 hover:text-pink-700">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
