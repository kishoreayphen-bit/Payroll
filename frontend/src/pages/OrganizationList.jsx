import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Plus, Clock, MapPin, Users, ArrowRight, Sparkles } from 'lucide-react';

export default function OrganizationList() {
    const navigate = useNavigate();
    const [organizations] = useState([
        {
            id: '60051788711',
            name: 'Aygren',
            timeZone: '(GMT 5:30) India Standard Time (Asia/Calcutta)',
            employeeCount: 150,
            createdDate: '2024-01-15'
        },
        {
            id: '60054621880',
            name: 'Aygren',
            timeZone: '(GMT 5:30) India Standard Time (Asia/Calcutta)',
            employeeCount: 75,
            createdDate: '2024-02-20'
        }
    ]);

    const handleCreateOrganization = () => {
        navigate('/tenant/register');
    };

    const handleJoinOrganization = (orgId) => {
        console.log('Joining organization:', orgId);
        // TODO: Implement join organization logic
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50">
            {/* Decorative Background Elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-20 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
                <div className="absolute top-40 right-20 w-96 h-96 bg-rose-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
                <div className="absolute bottom-20 left-1/2 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
            </div>

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

            <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Header */}
                <div className="mb-12">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl flex items-center justify-center shadow-lg shadow-pink-500/30">
                            <Building2 className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold text-slate-900">Hi kishore M!</h1>
                            <div className="flex items-center gap-2 mt-1">
                                <Sparkles className="w-4 h-4 text-pink-600" />
                                <p className="text-slate-600">Welcome to your workspace</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-pink-100">
                        <p className="text-slate-700 leading-relaxed">
                            Here's a list of all the organizations you are a part of. You can choose to either join an existing
                            organization which would sync all your payroll data to that account automatically, or create a new
                            organization to explore all the features of <span className="font-semibold text-pink-600">PayrollPro</span>.
                        </p>
                    </div>
                </div>

                {/* Create New Organization Button */}
                <div className="mb-8">
                    <button
                        onClick={handleCreateOrganization}
                        className="group relative w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white font-bold rounded-2xl shadow-xl shadow-pink-500/30 hover:shadow-pink-500/50 transition-all duration-300 hover:-translate-y-1"
                    >
                        <div className="flex items-center justify-center gap-3">
                            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                                <Plus className="w-5 h-5" />
                            </div>
                            <span className="text-lg">Create New Organization</span>
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </div>
                    </button>
                </div>

                {/* Organizations List */}
                <div className="space-y-4">
                    <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <Building2 className="w-5 h-5 text-pink-600" />
                        Your Organizations
                    </h2>

                    {organizations.map((org, index) => (
                        <div
                            key={org.id}
                            className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl border border-slate-100 hover:border-pink-200 transition-all duration-300 hover:-translate-y-1"
                        >
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                <div className="flex-1">
                                    <div className="flex items-start gap-4">
                                        <div className="w-14 h-14 bg-gradient-to-br from-pink-100 to-rose-100 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                                            <Building2 className="w-7 h-7 text-pink-600" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-2xl font-bold text-slate-900 mb-2">{org.name}</h3>
                                            <div className="space-y-1.5">
                                                <div className="flex items-center gap-2 text-sm text-slate-600">
                                                    <div className="w-5 h-5 bg-pink-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                                        <span className="text-xs font-bold text-pink-600">ID</span>
                                                    </div>
                                                    <span className="font-mono">Organization ID: {org.id}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-slate-600">
                                                    <Clock className="w-4 h-4 text-pink-600 flex-shrink-0" />
                                                    <span>Time Zone: {org.timeZone}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-slate-600">
                                                    <Users className="w-4 h-4 text-pink-600 flex-shrink-0" />
                                                    <span>{org.employeeCount} Employees</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={() => handleJoinOrganization(org.id)}
                                    className="px-6 py-3 bg-white border-2 border-pink-600 text-pink-600 font-semibold rounded-xl hover:bg-pink-600 hover:text-white transition-all duration-300 flex items-center justify-center gap-2 group/btn"
                                >
                                    <span>Join Organization</span>
                                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Empty State (if no organizations) */}
                {organizations.length === 0 && (
                    <div className="bg-white rounded-2xl p-12 shadow-lg border border-slate-100 text-center">
                        <div className="w-20 h-20 bg-gradient-to-br from-pink-100 to-rose-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Building2 className="w-10 h-10 text-pink-600" />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 mb-3">No Organizations Yet</h3>
                        <p className="text-slate-600 mb-6 max-w-md mx-auto">
                            You haven't joined any organizations yet. Create your first organization to get started with PayrollPro.
                        </p>
                        <button
                            onClick={handleCreateOrganization}
                            className="px-8 py-4 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white font-bold rounded-xl shadow-lg shadow-pink-500/30 hover:shadow-pink-500/50 transition-all duration-300 hover:-translate-y-1 inline-flex items-center gap-2"
                        >
                            <Plus className="w-5 h-5" />
                            <span>Create Your First Organization</span>
                        </button>
                    </div>
                )}

                {/* Footer Info */}
                <div className="mt-12 text-center">
                    <p className="text-sm text-slate-500">
                        Need help? <a href="#" className="text-pink-600 hover:text-pink-700 font-semibold">Contact Support</a>
                    </p>
                </div>
            </div>
        </div>
    );
}
