import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Mail, Lock, Eye, EyeOff, ArrowLeft, CheckCircle2, AlertCircle, KeyRound } from 'lucide-react';
import { api } from '../services/authService';

const emailSchema = z.object({
  email: z.string().email('Invalid email address').min(1, 'Email is required'),
});

const passwordSchema = z.object({
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
      'Password must contain uppercase, lowercase, number, and special character'
    ),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

export default function ForgotPassword() {
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password, 4: Success
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const emailForm = useForm({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: '' }
  });

  const passwordForm = useForm({
    resolver: zodResolver(passwordSchema),
    defaultValues: { password: '', confirmPassword: '' }
  });

  const handleSendOTP = async (data) => {
    try {
      setLoading(true);
      setError('');
      setEmail(data.email);
      
      // API call to send OTP
      await api.post('/auth/forgot-password', { email: data.email });
      
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
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

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };

  const handleVerifyOTP = async () => {
    const otpValue = otp.join('');
    if (otpValue.length !== 6) {
      setError('Please enter the complete 6-digit OTP');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      // API call to verify OTP
      await api.post('/auth/verify-otp', { email, otp: otpValue });
      
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (data) => {
    try {
      setLoading(true);
      setError('');
      
      // API call to reset password
      await api.post('/auth/reset-password', {
        email,
        otp: otp.join(''),
        newPassword: data.password
      });
      
      setStep(4);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    try {
      setLoading(true);
      setError('');
      setOtp(['', '', '', '', '', '']);
      
      await api.post('/auth/forgot-password', { email });
      
      alert('OTP resent successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend OTP.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Decorative */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-pink-100 via-rose-50 to-white p-12 flex-col justify-center relative overflow-hidden">
        <div className="absolute top-20 left-20 w-64 h-64 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-64 h-64 bg-rose-200 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-pulse"></div>
        <div className="absolute bottom-20 left-40 w-64 h-64 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-pulse"></div>

        <div className="relative z-10 max-w-md">
          <div className="w-20 h-20 bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl flex items-center justify-center mb-8 shadow-xl">
            <KeyRound className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            Reset Your Password
          </h2>
          <p className="text-slate-600 text-lg mb-8">
            Don't worry, it happens to the best of us. We'll help you get back into your account.
          </p>
          
          {/* Steps indicator */}
          <div className="flex items-center gap-2">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  step >= s 
                    ? 'bg-pink-600 text-white' 
                    : 'bg-slate-200 text-slate-500'
                }`}>
                  {step > s ? <CheckCircle2 className="w-5 h-5" /> : s}
                </div>
                {s < 3 && (
                  <div className={`w-12 h-1 mx-1 rounded ${step > s ? 'bg-pink-600' : 'bg-slate-200'}`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex gap-4 mt-2 text-xs text-slate-600">
            <span className="w-8 text-center">Email</span>
            <span className="w-12"></span>
            <span className="w-8 text-center">OTP</span>
            <span className="w-12"></span>
            <span className="w-8 text-center">Reset</span>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          {/* Back to Login */}
          <Link to="/login" className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-pink-600 mb-8">
            <ArrowLeft className="w-4 h-4" />
            Back to Login
          </Link>

          {/* Error Message */}
          {error && (
            <div className="mb-5 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Step 1: Enter Email */}
          {step === 1 && (
            <div>
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900 mb-2">Forgot Password?</h1>
                <p className="text-slate-600">Enter your email address and we'll send you an OTP to reset your password.</p>
              </div>

              <form onSubmit={emailForm.handleSubmit(handleSendOTP)} className="space-y-5">
                <div>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none z-10" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email address"
                      className="pl-10 h-12 border-slate-300 focus:border-pink-500 focus:ring-pink-500 rounded-lg"
                      {...emailForm.register('email')}
                    />
                  </div>
                  {emailForm.formState.errors.email && (
                    <p className="mt-1.5 text-sm text-red-600">{emailForm.formState.errors.email.message}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white font-semibold rounded-lg shadow-lg"
                  disabled={loading}
                >
                  {loading ? 'Sending OTP...' : 'Send OTP'}
                </Button>
              </form>
            </div>
          )}

          {/* Step 2: Enter OTP */}
          {step === 2 && (
            <div>
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900 mb-2">Enter OTP</h1>
                <p className="text-slate-600">
                  We've sent a 6-digit OTP to <span className="font-semibold text-pink-600">{email}</span>
                </p>
              </div>

              <div className="space-y-5">
                <div>
                  <p className="text-xs font-semibold text-slate-700 mb-3">Enter 6-digit OTP</p>
                  <div className="flex gap-2 justify-center">
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        id={`otp-${index}`}
                        type="text"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                        className="w-12 h-14 text-center text-xl font-bold border-2 border-slate-300 rounded-lg focus:border-pink-500 focus:ring-2 focus:ring-pink-500 focus:outline-none transition-all"
                      />
                    ))}
                  </div>
                </div>

                <Button
                  onClick={handleVerifyOTP}
                  className="w-full h-12 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white font-semibold rounded-lg shadow-lg"
                  disabled={loading || otp.join('').length !== 6}
                >
                  {loading ? 'Verifying...' : 'Verify OTP'}
                </Button>

                <div className="text-center">
                  <p className="text-sm text-slate-600">
                    Didn't receive the OTP?{' '}
                    <button
                      type="button"
                      onClick={handleResendOTP}
                      disabled={loading}
                      className="font-semibold text-pink-600 hover:text-pink-700"
                    >
                      Resend OTP
                    </button>
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => { setStep(1); setOtp(['', '', '', '', '', '']); setError(''); }}
                  className="w-full text-sm text-slate-600 hover:text-pink-600"
                >
                  Change email address
                </button>
              </div>

              {/* Demo hint */}
              <div className="mt-6 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-xs text-amber-700">
                  <strong>Demo:</strong> Use OTP <code className="bg-white px-1 rounded">123456</code> to proceed
                </p>
              </div>
            </div>
          )}

          {/* Step 3: New Password */}
          {step === 3 && (
            <div>
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900 mb-2">Create New Password</h1>
                <p className="text-slate-600">Your new password must be different from previously used passwords.</p>
              </div>

              <form onSubmit={passwordForm.handleSubmit(handleResetPassword)} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">New Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none z-10" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter new password"
                      className="pl-10 pr-10 h-12 border-slate-300 focus:border-pink-500 focus:ring-pink-500 rounded-lg"
                      {...passwordForm.register('password')}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {passwordForm.formState.errors.password && (
                    <p className="mt-1.5 text-sm text-red-600">{passwordForm.formState.errors.password.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none z-10" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm new password"
                      className="pl-10 pr-10 h-12 border-slate-300 focus:border-pink-500 focus:ring-pink-500 rounded-lg"
                      {...passwordForm.register('confirmPassword')}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {passwordForm.formState.errors.confirmPassword && (
                    <p className="mt-1.5 text-sm text-red-600">{passwordForm.formState.errors.confirmPassword.message}</p>
                  )}
                </div>

                <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="text-xs font-semibold text-slate-700 mb-2">Password must contain:</p>
                  <ul className="text-xs text-slate-600 space-y-1">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3 h-3 text-green-600" /> At least 8 characters
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3 h-3 text-green-600" /> Uppercase and lowercase letters
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3 h-3 text-green-600" /> At least one number
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3 h-3 text-green-600" /> At least one special character (@$!%*?&)
                    </li>
                  </ul>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white font-semibold rounded-lg shadow-lg"
                  disabled={loading}
                >
                  {loading ? 'Resetting Password...' : 'Reset Password'}
                </Button>
              </form>
            </div>
          )}

          {/* Step 4: Success */}
          {step === 4 && (
            <div className="text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10 text-green-600" />
              </div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">Password Reset Successful!</h1>
              <p className="text-slate-600 mb-8">
                Your password has been reset successfully. You can now login with your new password.
              </p>
              <Button
                onClick={() => navigate('/login')}
                className="w-full h-12 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white font-semibold rounded-lg shadow-lg"
              >
                Back to Login
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
