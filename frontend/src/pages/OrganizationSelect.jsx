import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building, Plus, ArrowRight, Users, Calendar } from 'lucide-react';
import { api } from '../services/authService';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';

export default function OrganizationSelect() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [organizations, setOrganizations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrganizations();
    }, []);

    const fetchOrganizations = async () => {
        try {
            console.log('Fetching organizations...');
            const response = await api.get('/organizations');
            console.log('API Response:', response);
            console.log('Organizations data:', response.data);
            setOrganizations(response.data || []);
        } catch (error) {
            console.error('Error fetching organizations:', error);
            console.error('Error response:', error.response);
        } finally {
            setLoading(false);
        }
    };

    const handleSelectOrganization = (orgId) => {
        // Store selected organization in localStorage
        localStorage.setItem('selectedOrganizationId', orgId);
        // Navigate to dashboard
        navigate('/dashboard');
    };

    const handleCreateNew = () => {
        navigate('/tenant/register');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-white flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-pink-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-600">Loading your organizations...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-white">
            {/* Header */}
            <div className="bg-white/80 backdrop-blur-md border-b border-pink-100 shadow-sm">
                <div className="max-w-6xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-rose-600 rounded-lg flex items-center justify-center">
                                <Building className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-slate-900">Your Organizations</h1>
                                <p className="text-xs text-slate-500">Select an organization to continue</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-sm text-slate-600">Welcome, {user?.email?.split('@')[0]}</span>
                            <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-rose-600 rounded-full flex items-center justify-center text-white font-bold text-xs">
                                {user?.email?.charAt(0).toUpperCase()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-6xl mx-auto px-6 py-12">
                {organizations.length === 0 ? (
                    /* No Organizations */
                    <div className="text-center py-16">
                        <div className="w-24 h-24 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Building className="w-12 h-12 text-pink-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900 mb-3">No Organizations Yet</h2>
                        <p className="text-slate-600 mb-8 max-w-md mx-auto">
                            Get started by creating your first organization to manage payroll and employees.
                        </p>
                        <Button
                            onClick={handleCreateNew}
                            className="bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white shadow-lg shadow-pink-500/30"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Create Your First Organization
                        </Button>
                    </div>
                ) : (
                    /* Organizations Grid */
                    <div>
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h2 className="text-2xl font-bold text-slate-900">Select Organization</h2>
                                <p className="text-slate-600 text-sm mt-1">Choose which organization you want to work with</p>
                            </div>
                            <Button
                                onClick={handleCreateNew}
                                className="bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white shadow-lg shadow-pink-500/30"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Create New Organization
                            </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {organizations.map((org) => (
                                <div
                                    key={org.id}
                                    onClick={() => handleSelectOrganization(org.id)}
                                    className="group bg-white rounded-2xl border border-pink-100 shadow-sm hover:shadow-xl transition-all cursor-pointer overflow-hidden"
                                >
                                    {/* Card Header */}
                                    <div className="bg-gradient-to-r from-pink-600 to-rose-600 p-6">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                                                <Building className="w-7 h-7 text-white" />
                                            </div>
                                            <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                <ArrowRight className="w-5 h-5 text-white" />
                                            </div>
                                        </div>
                                        <h3 className="text-xl font-bold text-white mb-1">{org.companyName}</h3>
                                        <p className="text-pink-100 text-sm">{org.industry}</p>
                                    </div>

                                    {/* Card Body */}
                                    <div className="p-6 space-y-3">
                                        <div className="flex items-center gap-2 text-sm text-slate-600">
                                            <Users className="w-4 h-4 text-pink-500" />
                                            <span>0 Employees</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-slate-600">
                                            <Building className="w-4 h-4 text-pink-500" />
                                            <span>{org.businessLocation}</span>
                                        </div>
                                        <div className="pt-3 border-t border-slate-100">
                                            <p className="text-xs text-slate-500">
                                                {org.city}, {org.state}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Hover Effect */}
                                    <div className="px-6 pb-6">
                                        <div className="w-full py-2 bg-pink-50 group-hover:bg-gradient-to-r group-hover:from-pink-600 group-hover:to-rose-600 rounded-lg text-center transition-all">
                                            <span className="text-sm font-semibold text-pink-600 group-hover:text-white transition-colors">
                                                Open Organization
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
