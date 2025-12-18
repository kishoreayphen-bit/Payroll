import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';

export default function GetStarted() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-3xl bg-white border border-slate-200 rounded-2xl shadow-sm p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-slate-900">How would you like to get started?</h1>
          <p className="text-sm text-slate-600 mt-2">Choose what fits you. You can always switch paths later.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-6 rounded-xl border border-slate-200 hover:shadow-lg hover:shadow-pink-500/10 transition-all">
            <h2 className="text-lg font-semibold text-slate-900 mb-2">Create a new company</h2>
            <p className="text-sm text-slate-600 mb-4">Become the Tenant Admin for your organization and set up payroll for your team.</p>
            <Link to="/tenant/register">
              <Button className="w-full">Create Company</Button>
            </Link>
            <p className="mt-3 text-xs text-slate-500">Only the company creator (or invited admins) receive admin privileges.</p>
          </div>

          <div className="p-6 rounded-xl border border-slate-200 hover:shadow-lg hover:shadow-pink-500/10 transition-all">
            <h2 className="text-lg font-semibold text-slate-900 mb-2">Join an existing company</h2>
            <p className="text-sm text-slate-600 mb-4">Create your user account and join via an invite link or admin approval.</p>
            <Link to="/signup">
              <Button className="w-full" variant="secondary">Sign Up</Button>
            </Link>
            <p className="mt-3 text-xs text-slate-500">Public signups receive a basic role by default. Admin/HR roles require an invite.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
