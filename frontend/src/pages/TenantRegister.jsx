import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Button } from '../components/ui/button';
import { Building2, MapPin, Briefcase, FileText, CheckCircle2, Loader2 } from 'lucide-react';
import { api } from '../services/authService';

const tenantSchema = z.object({
  companyName: z.string().min(2, 'Company name is required').max(200),
  businessLocation: z.string().min(1, 'Business location is required'),
  industry: z.string().min(1, 'Industry is required'),
  addressLine1: z.string().min(5, 'Address is required'),
  addressLine2: z.string().optional(),
  state: z.string().min(1, 'State is required'),
  city: z.string().min(2, 'City is required'),
  pinCode: z.string().regex(/^\d{6}$/, 'PIN code must be 6 digits'),
  hasRunPayroll: z.enum(['yes', 'no'], { required_error: 'Please select an option' }),
});

const COUNTRIES = ['India', 'United States', 'United Kingdom', 'Canada', 'Singapore'];

const INDUSTRIES = [
  'Agency or Sales House',
  'Agriculture',
  'Art and Design',
  'Automotive',
  'Construction',
  'Consulting',
  'Consumer Packaged Goods',
  'Education',
  'Engineering',
  'Entertainment',
  'Financial Services',
  'Food Services (Restaurants/Fast Food)',
  'Gaming',
  'Government',
  'Health Care',
  'Interior Design',
  'Internal',
  'Legal',
  'Manufacturing',
  'Marketing',
  'Mining and Logistics',
  'Non-Profit',
  'Publishing and Web Media',
  'Real Estate',
  'Retail (E-Commerce and Offline)',
  'Services',
  'Technology',
  'Telecommunications',
  'Travel/Hospitality',
  'Web Designing',
  'Web Development',
  'Writers'
];

const STATES_BY_COUNTRY = {
  'India': ['Andhra Pradesh', 'Karnataka', 'Kerala', 'Tamil Nadu', 'Telangana', 'Maharashtra', 'Gujarat', 'Delhi', 'West Bengal', 'Rajasthan'],
  'United States': ['California', 'Texas', 'Florida', 'New York', 'Illinois', 'Pennsylvania', 'Ohio'],
  'United Kingdom': ['England', 'Scotland', 'Wales', 'Northern Ireland'],
  'Canada': ['Ontario', 'Quebec', 'British Columbia', 'Alberta'],
  'Singapore': ['Singapore']
};

export default function TenantRegister() {
  const navigate = useNavigate();
  const [isCreating, setIsCreating] = useState(false);
  const { register, handleSubmit, watch, setValue, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(tenantSchema),
    defaultValues: {
      companyName: '',
      businessLocation: 'India',
      industry: '',
      addressLine1: '',
      addressLine2: '',
      state: '',
      city: '',
      pinCode: '',
      hasRunPayroll: 'no',
    }
  });

  const selectedCountry = watch('businessLocation');
  const stateOptions = STATES_BY_COUNTRY[selectedCountry] || [];

  // Reset state when country changes
  React.useEffect(() => {
    setValue('state', '');
  }, [selectedCountry, setValue]);

  const onSubmit = async (data) => {
    try {
      setIsCreating(true);

      // Call API to create organization
      await api.post('/organizations', data);

      // Show loading for 2 seconds
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Navigate to organization selection page
      navigate('/select-organization');
    } catch (error) {
      console.error('Error creating organization:', error);
      alert(error.response?.data?.message || 'Failed to create organization. Please try again.');
      setIsCreating(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Decorative */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-pink-100 via-rose-50 to-white p-12 flex-col justify-start relative overflow-hidden">
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

        {/* Header Section */}
        <div className="relative z-10 mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-pink-500/30">
            <Building2 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Create Your Organization</h1>
          <p className="text-slate-600">Set up your company profile to get started</p>
        </div>

        {/* Middle Section - Feature Cards with Decorative Blobs */}
        <div className="relative mb-8">
          {/* Decorative Blobs */}
          <div className="absolute top-1/2 left-20 w-64 h-64 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob -translate-y-1/2"></div>
          <div className="absolute top-1/2 right-20 w-64 h-64 bg-rose-200 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000 -translate-y-1/2"></div>
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000 -translate-x-1/2 -translate-y-1/2"></div>

          {/* Feature Cards */}
          <div className="relative z-10 space-y-4">
            <div className="flex items-center gap-4 bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-600 rounded-full flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-bold text-slate-900">Company Setup</p>
                <p className="text-sm text-slate-600">Create your organization profile</p>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-600 rounded-full flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-bold text-slate-900">Address Details</p>
                <p className="text-sm text-slate-600">Add your location and address</p>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-600 rounded-full flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-bold text-slate-900">Payroll Ready</p>
                <p className="text-sm text-slate-600">Finish and start using PayrollPro</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section - Tagline */}
        <div className="relative z-10">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Organize, configure, and launch quickly.</h2>
          <p className="text-slate-600 mb-6">Trusted by growing companies</p>

          {/* Additional Features */}
          <div className="grid grid-cols-2 gap-6 mt-6">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="w-4 h-4 text-pink-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">Auto Compliance</p>
                <p className="text-xs text-slate-600">Stay compliant automatically</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="w-4 h-4 text-pink-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">Secure & Reliable</p>
                <p className="text-xs text-slate-600">Bank-level encryption</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="w-4 h-4 text-pink-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">Easy Integration</p>
                <p className="text-xs text-slate-600">Connect your tools</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="w-4 h-4 text-pink-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">24/7 Support</p>
                <p className="text-xs text-slate-600">We're here to help</p>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-pink-200">
            <div className="text-center">
              <p className="text-2xl font-bold text-pink-600">500+</p>
              <p className="text-xs text-slate-600 mt-1">Companies</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-pink-600">50K+</p>
              <p className="text-xs text-slate-600 mt-1">Employees</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-pink-600">99.9%</p>
              <p className="text-xs text-slate-600 mt-1">Uptime</p>
            </div>
          </div>

          {/* Testimonial */}
          <div className="mt-6 bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-pink-100">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-rose-600 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold">
                A
              </div>
              <div className="flex-1">
                <p className="text-sm text-slate-700 italic">"PayrollPro simplified our entire payroll process. Setup was quick and the support team is amazing!"</p>
                <p className="text-xs font-semibold text-slate-900 mt-2">— Alex Kumar</p>
                <p className="text-xs text-slate-600">HR Manager, TechCorp</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-white overflow-y-auto">
        <div className="w-full max-w-2xl py-4 pb-32">

          <div className="bg-white rounded-2xl shadow-xl border border-pink-100 p-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Company Name */}
              <div>
                <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-pink-600" />
                  Company Information
                </h2>
                <div>
                  <Label htmlFor="companyName" className="text-slate-700 font-semibold">
                    Company Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="companyName"
                    placeholder="Enter your company name"
                    className="mt-2 h-10 border-slate-300 focus:border-pink-500 focus:ring-pink-500"
                    {...register('companyName')}
                  />
                  {errors.companyName && <p className="mt-1.5 text-sm text-red-600">{errors.companyName.message}</p>}
                </div>
              </div>

              {/* Business Location & Industry */}
              <div>
                <h2 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-pink-600" />
                  Business Details
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="businessLocation" className="text-slate-700 font-semibold">
                      Business Location <span className="text-red-500">*</span>
                    </Label>
                    <select
                      id="businessLocation"
                      className="mt-2 w-full h-10 px-4 rounded-lg border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                      {...register('businessLocation')}
                    >
                      {COUNTRIES.map(country => (
                        <option key={country} value={country}>{country}</option>
                      ))}
                    </select>
                    {errors.businessLocation && <p className="mt-1.5 text-sm text-red-600">{errors.businessLocation.message}</p>}
                  </div>

                  <div>
                    <Label htmlFor="industry" className="text-slate-700 font-semibold">
                      Industry <span className="text-red-500">*</span>
                    </Label>
                    <select
                      id="industry"
                      className="mt-2 w-full h-10 px-4 rounded-lg border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                      style={{ appearance: 'menulist' }}
                      {...register('industry')}
                    >
                      <option value="">Select an industry type</option>
                      {INDUSTRIES.map(industry => (
                        <option key={industry} value={industry}>{industry}</option>
                      ))}
                    </select>
                    {errors.industry && <p className="mt-1.5 text-sm text-red-600">{errors.industry.message}</p>}
                  </div>
                </div>
              </div>

              {/* Organization Address */}
              <div>
                <h2 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-pink-600" />
                  Organisation Address <span className="text-red-500">*</span>
                </h2>
                <p className="text-sm text-slate-600 mb-3">This will be considered as the address of your primary work location.</p>

                <div className="space-y-3">
                  <div>
                    <Input
                      id="addressLine1"
                      placeholder="Address Line 1"
                      className="h-10 border-slate-300 focus:border-pink-500 focus:ring-pink-500"
                      {...register('addressLine1')}
                    />
                    {errors.addressLine1 && <p className="mt-1.5 text-sm text-red-600">{errors.addressLine1.message}</p>}
                  </div>

                  <div>
                    <Input
                      id="addressLine2"
                      placeholder="Address Line 2 (Optional)"
                      className="h-10 border-slate-300 focus:border-pink-500 focus:ring-pink-500"
                      {...register('addressLine2')}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <select
                        id="state"
                        className="w-full h-10 px-4 rounded-lg border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 disabled:bg-slate-50"
                        disabled={stateOptions.length === 0}
                        {...register('state')}
                      >
                        <option value="">Select State</option>
                        {stateOptions.map(state => (
                          <option key={state} value={state}>{state}</option>
                        ))}
                      </select>
                      {errors.state && <p className="mt-1.5 text-sm text-red-600">{errors.state.message}</p>}
                    </div>

                    <div>
                      <Input
                        id="city"
                        placeholder="City"
                        className="h-10 border-slate-300 focus:border-pink-500 focus:ring-pink-500"
                        {...register('city')}
                      />
                      {errors.city && <p className="mt-1.5 text-sm text-red-600">{errors.city.message}</p>}
                    </div>

                    <div>
                      <Input
                        id="pinCode"
                        placeholder="PIN Code"
                        maxLength={6}
                        className="h-10 border-slate-300 focus:border-pink-500 focus:ring-pink-500"
                        {...register('pinCode')}
                      />
                      {errors.pinCode && <p className="mt-1.5 text-sm text-red-600">{errors.pinCode.message}</p>}
                    </div>
                  </div>
                </div>
              </div>

              {/* Payroll Questions */}
              <div className="space-y-6">
                <div>
                  <Label className="text-slate-900 font-bold text-base mb-3 block">
                    Have you run payroll earlier this financial year? <span className="text-red-500">*</span>
                  </Label>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 p-4 border-2 border-slate-200 rounded-xl cursor-pointer hover:border-pink-300 hover:bg-pink-50/50 transition-all">
                      <input
                        type="radio"
                        value="yes"
                        {...register('hasRunPayroll')}
                        className="w-5 h-5 text-pink-600 focus:ring-pink-500"
                      />
                      <span className="text-slate-700">Yes, we've already run payroll(s) for this financial year.</span>
                    </label>
                    <label className="flex items-center gap-3 p-4 border-2 border-slate-200 rounded-xl cursor-pointer hover:border-pink-300 hover:bg-pink-50/50 transition-all">
                      <input
                        type="radio"
                        value="no"
                        {...register('hasRunPayroll')}
                        className="w-5 h-5 text-pink-600 focus:ring-pink-500"
                      />
                      <span className="text-slate-700">No, we'll run this financial year's first payroll with PayrollPro.</span>
                    </label>
                  </div>
                  {errors.hasRunPayroll && <p className="mt-1.5 text-sm text-red-600">{errors.hasRunPayroll.message}</p>}
                </div>
              </div>

              {/* Terms */}
              <div className="bg-slate-50 rounded-xl p-4 text-sm text-slate-600">
                By clicking <span className="font-semibold">Save & Continue</span>, you agree to the{' '}
                <a href="#" className="text-pink-600 hover:text-pink-700 font-semibold">Terms of Service</a> and{' '}
                <a href="#" className="text-pink-600 hover:text-pink-700 font-semibold">Privacy Policy</a>.
              </div>

              {/* Submit Button */}
              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/select-organization')}
                  className="flex-1 h-14 border-2 border-slate-300 hover:bg-slate-50"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 h-14 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white font-bold text-lg shadow-xl shadow-pink-500/30"
                  disabled={isSubmitting || isCreating}
                >
                  {isSubmitting || isCreating ? 'Creating...' : 'Save & Continue'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Loading Overlay */}
      {isCreating && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 shadow-2xl max-w-md w-full mx-4 text-center">
            <div className="mb-6">
              <Loader2 className="w-16 h-16 text-pink-600 animate-spin mx-auto" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Creating Your Organization</h3>
            <p className="text-slate-600">Please wait while we set up your workspace...</p>
            <div className="mt-6 bg-pink-50 rounded-lg p-4">
              <div className="flex items-center justify-center gap-2 text-pink-700">
                <CheckCircle2 className="w-5 h-5" />
                <span className="font-semibold">Almost there!</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
