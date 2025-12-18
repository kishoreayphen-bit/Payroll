import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Button } from '../components/ui/button';
import { Building2, Code, Globe, User, Phone, CheckCircle2, X } from 'lucide-react';

const tenantSchema = z.object({
  tenantName: z.string().min(3).max(200),
  tenantCode: z.string().regex(/^[A-Z0-9]{3,10}$/),
  subdomain: z.string().regex(/^[a-z0-9]{3,30}$/),
  adminFirstName: z.string().min(2),
  adminLastName: z.string().min(2),
  adminPhone: z.string().regex(/^\d{10}$/),
  subscriptionPlan: z.enum(['TRIAL', 'STARTER', 'PROFESSIONAL', 'ENTERPRISE']),
  maxEmployees: z.coerce.number().min(1).max(10000),
  industry: z.string().optional(),
  country: z.string().min(1),
  timeZone: z.string().min(1),
});

export default function TenantRegister() {
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [verifying, setVerifying] = useState(false);

  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(tenantSchema),
    defaultValues: {
      subscriptionPlan: 'TRIAL',
      country: 'United States',
      timeZone: 'America/New_York',
      maxEmployees: 50,
    }
  });

  const phoneNumber = watch('adminPhone');

  const handleSendOTP = () => {
    if (phoneNumber && phoneNumber.match(/^\d{10}$/)) {
      // TODO: Integrate SMS API
      console.log('Sending OTP to:', phoneNumber);
      setOtpSent(true);
      // Simulate OTP sent
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

      // Auto-focus next input
      if (value && index < 5) {
        document.getElementById(`otp-${index + 1}`)?.focus();
      }
    }
  };

  const handleVerifyOTP = () => {
    setVerifying(true);
    const otpValue = otp.join('');
    // TODO: Integrate OTP verification API
    console.log('Verifying OTP:', otpValue);

    // Simulate verification
    setTimeout(() => {
      if (otpValue === '123456') { // Mock verification
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
    // TODO: Implement social signup
  };

  const onSubmit = (data) => {
    if (!phoneVerified) {
      alert('Please verify your phone number first');
      return;
    }
    // TODO: integrate POST /api/v1/admin/tenants
    console.log('Tenant registration:', data);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-slate-50 flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-4xl">
        {/* Logo & Header */}
        <div className="text-center mb-8">
          <img src="/logo.png" alt="PayrollPro" className="h-16 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Create your company</h1>
          <p className="text-slate-600">We'll set up your tenant and an admin account</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl shadow-xl shadow-slate-200/50 p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Company Information */}
            <div>
              <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-pink-600" />
                Company Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="md:col-span-2">
                  <Label htmlFor="tenantName" className="text-slate-700 font-semibold">Company Name</Label>
                  <Input
                    id="tenantName"
                    placeholder="Acme Corporation"
                    className="mt-2 h-12 border-slate-300 focus:border-pink-500 focus:ring-pink-500"
                    {...register('tenantName')}
                  />
                  {errors.tenantName && <p className="mt-1.5 text-sm text-red-600">Company name must be 3-200 characters</p>}
                </div>

                <div>
                  <Label htmlFor="tenantCode" className="text-slate-700 font-semibold">Company Code</Label>
                  <Input
                    id="tenantCode"
                    placeholder="ACME"
                    className="mt-2 h-12 border-slate-300 focus:border-pink-500 focus:ring-pink-500 uppercase"
                    {...register('tenantCode')}
                  />
                  {errors.tenantCode && <p className="mt-1.5 text-sm text-red-600">3-10 uppercase letters/numbers</p>}
                </div>

                <div>
                  <Label htmlFor="subdomain" className="text-slate-700 font-semibold">Subdomain</Label>
                  <div className="flex mt-2">
                    <Input
                      id="subdomain"
                      placeholder="acme"
                      className="rounded-r-none h-12 border-slate-300 focus:border-pink-500 focus:ring-pink-500 lowercase"
                      {...register('subdomain')}
                    />
                    <span className="inline-flex items-center px-4 border border-l-0 border-slate-300 rounded-r-lg bg-slate-50 text-slate-600 text-sm font-medium">
                      .yourpayroll.com
                    </span>
                  </div>
                  {errors.subdomain && <p className="mt-1.5 text-sm text-red-600">3-30 lowercase letters/numbers</p>}
                </div>
              </div>
            </div>

            {/* Admin Information */}
            <div>
              <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-pink-600" />
                Admin Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <Label htmlFor="adminFirstName" className="text-slate-700 font-semibold">First Name</Label>
                  <Input
                    id="adminFirstName"
                    placeholder="John"
                    className="mt-2 h-12 border-slate-300 focus:border-pink-500 focus:ring-pink-500"
                    {...register('adminFirstName')}
                  />
                  {errors.adminFirstName && <p className="mt-1.5 text-sm text-red-600">Required</p>}
                </div>

                <div>
                  <Label htmlFor="adminLastName" className="text-slate-700 font-semibold">Last Name</Label>
                  <Input
                    id="adminLastName"
                    placeholder="Doe"
                    className="mt-2 h-12 border-slate-300 focus:border-pink-500 focus:ring-pink-500"
                    {...register('adminLastName')}
                  />
                  {errors.adminLastName && <p className="mt-1.5 text-sm text-red-600">Required</p>}
                </div>

                {/* Phone Number with OTP */}
                <div className="md:col-span-2">
                  <Label htmlFor="adminPhone" className="text-slate-700 font-semibold">Phone Number</Label>
                  <div className="flex gap-2 mt-2">
                    <div className="relative flex-1">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <Input
                        id="adminPhone"
                        placeholder="9876543210"
                        className="pl-10 h-12 border-slate-300 focus:border-pink-500 focus:ring-pink-500"
                        {...register('adminPhone')}
                        disabled={phoneVerified}
                      />
                      {phoneVerified && (
                        <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-600" />
                      )}
                    </div>
                    {!phoneVerified && (
                      <Button
                        type="button"
                        onClick={handleSendOTP}
                        disabled={!phoneNumber || !phoneNumber.match(/^\d{10}$/) || otpSent}
                        className="h-12 bg-pink-600 hover:bg-pink-700"
                      >
                        {otpSent ? 'OTP Sent' : 'Send OTP'}
                      </Button>
                    )}
                  </div>
                  {errors.adminPhone && <p className="mt-1.5 text-sm text-red-600">10 digits required</p>}

                  {/* OTP Input */}
                  {otpSent && !phoneVerified && (
                    <div className="mt-4 p-4 bg-pink-50 border border-pink-200 rounded-xl">
                      <p className="text-sm font-semibold text-slate-700 mb-3">Enter the 6-digit OTP sent to your phone</p>
                      <div className="flex gap-2 mb-4">
                        {otp.map((digit, index) => (
                          <input
                            key={index}
                            id={`otp-${index}`}
                            type="text"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleOtpChange(index, e.target.value)}
                            className="w-12 h-12 text-center text-lg font-bold border-2 border-slate-300 rounded-lg focus:border-pink-500 focus:ring-2 focus:ring-pink-500 focus:outline-none"
                          />
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          onClick={handleVerifyOTP}
                          disabled={otp.join('').length !== 6 || verifying}
                          className="flex-1 bg-green-600 hover:bg-green-700"
                        >
                          {verifying ? 'Verifying...' : 'Verify OTP'}
                        </Button>
                        <Button
                          type="button"
                          onClick={() => {
                            setOtpSent(false);
                            setOtp(['', '', '', '', '', '']);
                          }}
                          variant="outline"
                          className="border-slate-300"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                      <p className="mt-2 text-xs text-slate-500">Demo: Use OTP <code className="bg-white px-1 py-0.5 rounded">123456</code></p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Subscription Plan */}
            <div>
              <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Code className="w-5 h-5 text-pink-600" />
                Subscription Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <Label htmlFor="subscriptionPlan" className="text-slate-700 font-semibold">Plan</Label>
                  <select
                    id="subscriptionPlan"
                    className="mt-2 w-full h-12 px-3 rounded-lg border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                    {...register('subscriptionPlan')}
                  >
                    <option value="TRIAL">Trial (14 days free)</option>
                    <option value="STARTER">Starter ($40/month)</option>
                    <option value="PROFESSIONAL">Professional ($80/month)</option>
                    <option value="ENTERPRISE">Enterprise (Custom)</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="maxEmployees" className="text-slate-700 font-semibold">Max Employees</Label>
                  <Input
                    id="maxEmployees"
                    type="number"
                    placeholder="50"
                    className="mt-2 h-12 border-slate-300 focus:border-pink-500 focus:ring-pink-500"
                    {...register('maxEmployees', { valueAsNumber: true })}
                  />
                  {errors.maxEmployees && <p className="mt-1.5 text-sm text-red-600">1 - 10,000</p>}
                </div>
              </div>
            </div>

            {/* Location */}
            <div>
              <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Globe className="w-5 h-5 text-pink-600" />
                Location Settings
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <Label htmlFor="country" className="text-slate-700 font-semibold">Country</Label>
                  <select
                    id="country"
                    className="mt-2 w-full h-12 px-3 rounded-lg border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                    {...register('country')}
                  >
                    <option>United States</option>
                    <option>India</option>
                    <option>United Kingdom</option>
                    <option>Singapore</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="timeZone" className="text-slate-700 font-semibold">Time Zone</Label>
                  <select
                    id="timeZone"
                    className="mt-2 w-full h-12 px-3 rounded-lg border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                    {...register('timeZone')}
                  >
                    <option value="America/New_York">America/New_York (EST)</option>
                    <option value="America/Los_Angeles">America/Los_Angeles (PST)</option>
                    <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                    <option value="Europe/London">Europe/London (GMT)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <Button
                type="submit"
                className="w-full h-14 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white font-bold text-lg shadow-xl shadow-pink-500/30"
                disabled={isSubmitting || !phoneVerified}
              >
                {isSubmitting ? 'Creating company...' : 'Create Company'}
              </Button>
              {!phoneVerified && (
                <p className="mt-2 text-sm text-amber-600 text-center">Please verify your phone number to continue</p>
              )}
            </div>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-slate-500 font-medium">Or sign up with</span>
            </div>
          </div>

          {/* Social Signup - Moved to Bottom */}
          <div className="grid grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => handleSocialSignup('google')}
              className="flex items-center justify-center px-4 py-3 border border-slate-300 rounded-xl hover:bg-slate-50 hover:border-slate-400 transition-all"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => handleSocialSignup('microsoft')}
              className="flex items-center justify-center px-4 py-3 border border-slate-300 rounded-xl hover:bg-slate-50 hover:border-slate-400 transition-all"
            >
              <svg className="w-5 h-5" viewBox="0 0 23 23">
                <path fill="#f3f3f3" d="M0 0h23v23H0z" />
                <path fill="#f35325" d="M1 1h10v10H1z" />
                <path fill="#81bc06" d="M12 1h10v10H12z" />
                <path fill="#05a6f0" d="M1 12h10v10H1z" />
                <path fill="#ffba08" d="M12 12h10v10H12z" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => handleSocialSignup('github')}
              className="flex items-center justify-center px-4 py-3 border border-slate-300 rounded-xl hover:bg-slate-50 hover:border-slate-400 transition-all"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
            </button>
          </div>

          {/* Login Link */}
          <p className="mt-8 text-center text-sm text-slate-600">
            Already have an account? <Link to="/login" className="font-bold text-pink-600 hover:text-pink-700">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
