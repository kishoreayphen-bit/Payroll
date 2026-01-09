import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import {
    Users,
    DollarSign,
    Settings,
    Heart,
    CheckCircle2,
    Circle,
    ChevronRight,
    Search,
    Bell,
    User,
    Menu,
    LayoutDashboard,
    Receipt,
    Shield,
    FileCheck,
    Wallet,
    FolderOpen,
    BarChart3,
    X,
    ArrowRight,
    LogOut,
    Building,
    CheckCircle,
    Calendar,
    Gift,
    FileText,
    PieChart
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/authService';
import { Moon, Sun } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import AppHeader from '../components/AppHeader';

export default function Dashboard() {
    const { user, logout } = useAuth();
    const { darkMode, toggleDarkMode } = useTheme();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [showCompanyMenu, setShowCompanyMenu] = useState(false);
    const [organization, setOrganization] = useState(null);
    const [loading, setLoading] = useState(true);

    // Fetch organization data
    useEffect(() => {
        const fetchOrganization = async () => {
            try {
                const selectedOrgId = localStorage.getItem('selectedOrganizationId');

                if (!selectedOrgId) {
                    // No organization selected, redirect to selection page
                    window.location.href = '/select-organization';
                    return;
                }

                const response = await api.get('/organizations');
                if (response.data && response.data.length > 0) {
                    // Find the selected organization
                    const selectedOrg = response.data.find(org => org.id === parseInt(selectedOrgId));
                    if (selectedOrg) {
                        setOrganization(selectedOrg);
                    } else {
                        // Selected org not found, use first one
                        setOrganization(response.data[0]);
                        localStorage.setItem('selectedOrganizationId', response.data[0].id);
                    }
                }
            } catch (error) {
                console.error('Error fetching organization:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrganization();
    }, []);

    const [stats, setStats] = useState({ employees: 0, payRuns: 0, pendingLeaves: 0 });

    // Fetch dashboard stats
    useEffect(() => {
        const fetchStats = async () => {
            if (!organization?.id) return;
            try {
                const [empRes, payRunRes] = await Promise.all([
                    api.get(`/employees?organizationId=${organization.id}`, { headers: { 'X-Tenant-ID': organization.id } }),
                    api.get('/pay-runs', { headers: { 'X-Tenant-ID': organization.id } })
                ]);
                setStats({
                    employees: empRes.data?.length || 0,
                    payRuns: payRunRes.data?.length || 0,
                    pendingLeaves: 0
                });
            } catch (error) {
                console.error('Error fetching stats:', error);
            }
        };
        fetchStats();
    }, [organization?.id]);

    // Getting started steps - Updated with completed items
    const steps = [
        {
            id: 1,
            title: 'Add Organisation Details',
            completed: true,
            link: '/tenant/register'
        },
        {
            id: 2,
            title: 'Configure your Pay Schedule',
            completed: true,
            link: '/settings/pay-schedule'
        },
        {
            id: 3,
            title: 'Set up Statutory Components',
            completed: true,
            subItems: [
                { name: "Employees' Provident Fund", completed: true },
                { name: "Employees' State Insurance", completed: true },
                { name: "Professional Tax", completed: true },
                { name: "TDS/Income Tax", completed: true }
            ],
            link: '/settings/statutory'
        },
        {
            id: 4,
            title: 'Set up Salary Components',
            completed: true,
            link: '/settings?tab=salary-components'
        },
        {
            id: 5,
            title: 'Add Employees',
            completed: stats.employees > 0,
            link: '/employees'
        },
        {
            id: 6,
            title: 'Configure Attendance & Leave',
            completed: true,
            link: '/attendance'
        },
        {
            id: 7,
            title: 'Run First Payroll',
            completed: stats.payRuns > 0,
            link: '/pay-runs'
        }
    ];

    const completedSteps = steps.filter(s => s.completed).length;
    const totalSteps = steps.length;
    const progressPercentage = (completedSteps / totalSteps) * 100;

    return (
        <div className="h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-white dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex overflow-hidden">
            {/* Sidebar */}
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            {/* Main Content - With left margin for fixed sidebar */}
            <div className={`flex-1 flex flex-col h-screen transition-all duration-300 ${sidebarOpen ? 'ml-56' : 'ml-0'}`}>
                {/* Top Bar - Fixed */}
                <div className="bg-white/80 dark:bg-slate-900/90 backdrop-blur-md border-b border-pink-100 dark:border-slate-700 px-6 py-4 flex-shrink-0 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 flex-1">
                            {/* Menu button to open sidebar when closed */}
                            {!sidebarOpen && (
                                <button
                                    onClick={() => setSidebarOpen(true)}
                                    className="p-2 hover:bg-pink-50 dark:hover:bg-slate-700 rounded-xl transition-colors"
                                    title="Open sidebar"
                                >
                                    <Menu className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                                </button>
                            )}
                            <div className="relative flex-1 max-w-md">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500" />
                                <input
                                    type="text"
                                    placeholder="Search employees..."
                                    className="w-full pl-10 pr-4 py-2 border border-pink-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 bg-white dark:bg-slate-800 dark:text-white dark:placeholder-slate-400"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && e.target.value.trim()) {
                                            window.location.href = `/employees?search=${encodeURIComponent(e.target.value.trim())}`;
                                        }
                                    }}
                                />
                            </div>
                        </div>
                        <div className="flex items-center gap-3">


                            {/* Company Dropdown */}
                            <div className="relative">
                                <button
                                    onClick={() => {
                                        setShowCompanyMenu(!showCompanyMenu);
                                        setShowProfileMenu(false);
                                    }}
                                    className="flex items-center gap-2 px-3 py-1.5 bg-pink-50 rounded-xl hover:bg-pink-100 transition-colors"
                                >
                                    <span className="text-slate-700 font-medium text-xs">
                                        {loading ? 'Loading...' : (organization?.companyName || 'No Company')}
                                    </span>
                                    <ChevronRight className="w-4 h-4 text-slate-400" />
                                </button>

                                {showCompanyMenu && (
                                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-pink-100 py-2 z-50">
                                        <div className="px-4 py-3 border-b border-slate-100">
                                            <div className="flex items-center gap-2 mb-2">
                                                <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-rose-600 rounded-lg flex items-center justify-center">
                                                    <Building className="w-5 h-5 text-white" />
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-slate-900 text-sm">
                                                        {organization?.companyName || 'No Company'}
                                                    </p>
                                                    <p className="text-xs text-slate-500">
                                                        {organization?.industry || 'Not specified'}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="px-2 py-1">
                                            <Link to="/company/settings" className="flex items-center gap-2 px-3 py-2 hover:bg-pink-50 rounded-lg transition-colors">
                                                <Settings className="w-4 h-4 text-slate-600" />
                                                <span className="text-sm text-slate-700">Company Settings</span>
                                            </Link>
                                            <Link to="/company/profile" className="flex items-center gap-2 px-3 py-2 hover:bg-pink-50 rounded-lg transition-colors">
                                                <Building className="w-4 h-4 text-slate-600" />
                                                <span className="text-sm text-slate-700">Company Profile</span>
                                            </Link>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Dark Mode Toggle */}
                            <button
                                onClick={toggleDarkMode}
                                className="p-2 hover:bg-pink-50 dark:hover:bg-slate-700 rounded-xl transition-colors"
                                title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                            >
                                {darkMode ? (
                                    <Sun className="w-4 h-4 text-yellow-500" />
                                ) : (
                                    <Moon className="w-4 h-4 text-slate-600" />
                                )}
                            </button>

                            <Link to="/notifications" className="p-2 hover:bg-pink-50 dark:hover:bg-slate-700 rounded-xl transition-colors block">
                                <Bell className="w-4 h-4 text-slate-600 dark:text-slate-300" />
                            </Link>

                            <button className="p-2 hover:bg-pink-50 dark:hover:bg-slate-700 rounded-xl transition-colors">
                                <Settings className="w-4 h-4 text-slate-600 dark:text-slate-300" />
                            </button>

                            {/* Profile Dropdown */}
                            <div className="relative">
                                <button
                                    onClick={() => {
                                        setShowProfileMenu(!showProfileMenu);
                                        setShowCompanyMenu(false);
                                    }}
                                    className="w-8 h-8 bg-gradient-to-br from-pink-500 to-rose-600 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-lg hover:shadow-xl transition-shadow"
                                >
                                    K
                                </button>

                                {showProfileMenu && (
                                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-pink-100 py-2 z-50">
                                        <div className="px-4 py-3 border-b border-slate-100">
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                                                    K
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-slate-900 text-sm">{user?.email?.split('@')[0] || 'User'}</p>
                                                    <p className="text-xs text-slate-500">{user?.email || 'user@example.com'}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="px-2 py-1">
                                            <Link to="/profile" className="flex items-center gap-2 px-3 py-2 hover:bg-pink-50 rounded-lg transition-colors">
                                                <User className="w-4 h-4 text-slate-600" />
                                                <span className="text-sm text-slate-700">My Profile</span>
                                            </Link>
                                            <Link to="/settings" className="flex items-center gap-2 px-3 py-2 hover:bg-pink-50 rounded-lg transition-colors">
                                                <Settings className="w-4 h-4 text-slate-600" />
                                                <span className="text-sm text-slate-700">Account Settings</span>
                                            </Link>
                                            <button
                                                onClick={() => {
                                                    logout();
                                                    window.location.href = '/login';
                                                }}
                                                className="w-full flex items-center gap-2 px-3 py-2 hover:bg-red-50 rounded-lg transition-colors text-left"
                                            >
                                                <LogOut className="w-4 h-4 text-red-600" />
                                                <span className="text-sm text-red-600">Logout</span>
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Page Content */}
                <div className="flex-1 overflow-y-auto p-8">
                    {/* Welcome Section */}
                    <div className="mb-8">
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent mb-2">
                            Welcome {user?.email?.split('@')[0] || 'User'}! 👋
                        </h1>
                        <p className="text-slate-600 dark:text-slate-300 text-lg">Set up your organisation before you run your first payroll.</p>
                    </div>

                    {/* Getting Started Card - Redesigned */}
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-pink-100 dark:border-slate-700 overflow-hidden">
                        {/* Header with gradient */}
                        <div className="bg-gradient-to-r from-pink-600 via-rose-600 to-pink-600 text-white p-5">
                            <div className="flex items-center gap-2.5 mb-3">
                                <div className="w-9 h-9 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0">
                                    <CheckCircle2 className="w-5 h-5" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold">Get started with Payroll</h2>
                                    <p className="text-pink-100 text-xs mt-0.5">Complete the following steps to have a hassle-free payroll experience</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="flex-1 bg-white/20 backdrop-blur-sm rounded-full h-2">
                                    <div
                                        className="bg-white h-2 rounded-full transition-all duration-500 shadow-lg"
                                        style={{ width: `${progressPercentage}%` }}
                                    />
                                </div>
                                <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                                    <span className="font-bold text-sm">{completedSteps}/{totalSteps} Completed</span>
                                </div>
                            </div>
                        </div>

                        {/* Steps List */}
                        <div className="p-5 space-y-3">
                            {steps.map((step, index) => (
                                <div key={step.id} className="group">
                                    <div className="flex items-start gap-3 p-3 rounded-xl hover:bg-pink-50/50 dark:hover:bg-slate-700/50 transition-all">
                                        <div className="flex-shrink-0 mt-0.5">
                                            {step.completed ? (
                                                <div className="w-6 h-6 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg shadow-green-500/30">
                                                    <CheckCircle2 className="w-4 h-4 text-white" />
                                                </div>
                                            ) : (
                                                <div className="w-6 h-6 border-2 border-pink-300 rounded-full flex items-center justify-center group-hover:border-pink-500 transition-colors">
                                                    <Circle className="w-3 h-3 text-pink-300 group-hover:text-pink-500" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between mb-1.5">
                                                <Link
                                                    to={step.link}
                                                    className="flex items-center gap-2 group/link hover:text-pink-600 transition-colors"
                                                >
                                                    <h3 className="font-semibold text-slate-900 dark:text-white text-sm group-hover/link:text-pink-600">{step.id}. {step.title}</h3>
                                                    <ArrowRight className="w-4 h-4 text-pink-500 opacity-0 group-hover/link:opacity-100 transition-opacity" />
                                                </Link>
                                                {step.completed ? (
                                                    <span className="px-2.5 py-0.5 bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 font-semibold text-xs rounded-full whitespace-nowrap">
                                                        COMPLETED
                                                    </span>
                                                ) : !step.comingSoon && (
                                                    <Button
                                                        variant="link"
                                                        className="text-pink-600 hover:text-pink-700 font-semibold text-xs h-auto p-0 whitespace-nowrap"
                                                        onClick={() => window.location.href = step.link}
                                                    >
                                                        Complete Now →
                                                    </Button>
                                                )}
                                            </div>
                                            {step.subItems && (
                                                <div className="mt-2 ml-2.5 space-y-1.5 p-2.5 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                                                    {step.subItems.map((subItem, idx) => (
                                                        <div key={idx} className="flex items-center gap-2">
                                                            {subItem.completed ? (
                                                                <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                                                            ) : (
                                                                <Circle className="w-4 h-4 text-slate-300 flex-shrink-0" />
                                                            )}
                                                            <span className="text-slate-700 dark:text-slate-300 flex-1 text-xs">
                                                                {subItem.name}
                                                                {subItem.note && <span className="text-slate-500 ml-1">{subItem.note}</span>}
                                                            </span>
                                                            {!subItem.completed && (
                                                                <Button variant="link" className="text-pink-600 hover:text-pink-700 text-xs font-semibold h-auto p-0 whitespace-nowrap">
                                                                    Configure Now
                                                                </Button>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Additional Features */}
                        <div className="bg-gradient-to-br from-pink-50 to-rose-50 dark:from-slate-700 dark:to-slate-800 p-8 border-t border-pink-100 dark:border-slate-700">
                            <h3 className="font-bold text-slate-900 dark:text-white mb-6 text-xl">ADDITIONAL NOTABLE FEATURES</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-pink-100 dark:border-slate-600 shadow-sm hover:shadow-md transition-all group">
                                    <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                        <DollarSign className="w-6 h-6 text-white" />
                                    </div>
                                    <h4 className="font-bold text-slate-900 dark:text-white mb-2">Automated Payroll</h4>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">Run payroll automatically every month</p>
                                </div>
                                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-pink-100 dark:border-slate-600 shadow-sm hover:shadow-md transition-all group">
                                    <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                        <Shield className="w-6 h-6 text-white" />
                                    </div>
                                    <h4 className="font-bold text-slate-900 dark:text-white mb-2">Tax Compliance</h4>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">Stay compliant with all tax regulations</p>
                                </div>
                                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-pink-100 dark:border-slate-600 shadow-sm hover:shadow-md transition-all group">
                                    <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                        <Users className="w-6 h-6 text-white" />
                                    </div>
                                    <h4 className="font-bold text-slate-900 dark:text-white mb-2">Employee Self-Service</h4>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">Let employees access their payslips</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
