import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    Search,
    Bell,
    Settings,
    Menu,
    ChevronRight,
    Building,
    User,
    LogOut,
    Receipt,
    LayoutDashboard,
    Users,
    DollarSign,
    Shield,
    FileCheck,
    Wallet,
    Heart,
    FolderOpen,
    BarChart3,
    Plus,
    Edit,
    Trash2,
    Filter,
    X
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import ComponentModal from '../components/ComponentModal';
import { api } from '../services/authService';

export default function SalaryComponents() {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [showCompanyMenu, setShowCompanyMenu] = useState(false);
    const [organization, setOrganization] = useState(null);
    const [loading, setLoading] = useState(true);

    // Component state
    const [components, setComponents] = useState([]);
    const [filteredComponents, setFilteredComponents] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState('ALL'); // ALL, EARNING, DEDUCTION
    const [showComponentModal, setShowComponentModal] = useState(false);
    const [editingComponent, setEditingComponent] = useState(null);

    useEffect(() => {
        fetchOrganization();
        fetchComponents();
    }, []);

    useEffect(() => {
        filterComponents();
    }, [components, searchQuery, filterType]);

    const fetchOrganization = async () => {
        try {
            const selectedOrgId = localStorage.getItem('selectedOrganizationId');
            if (selectedOrgId) {
                const response = await api.get(`/organizations/${selectedOrgId}`);
                setOrganization(response.data);
            }
        } catch (error) {
            console.error('Error fetching organization:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchComponents = async () => {
        try {
            const selectedOrgId = localStorage.getItem('selectedOrganizationId');
            if (selectedOrgId) {
                const response = await api.get(`/salary-components?organizationId=${selectedOrgId}`);
                setComponents(response.data);
            }
        } catch (error) {
            console.error('Error fetching components:', error);
        }
    };

    const filterComponents = () => {
        let filtered = components;

        // Filter by type
        if (filterType !== 'ALL') {
            filtered = filtered.filter(c => c.type === filterType);
        }

        // Filter by search query
        if (searchQuery) {
            filtered = filtered.filter(c =>
                c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                c.code.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        setFilteredComponents(filtered);
    };

    const handleDeleteComponent = async (id) => {
        if (window.confirm('Are you sure you want to delete this component?')) {
            try {
                await api.delete(`/salary-components/${id}`);
                fetchComponents();
            } catch (error) {
                console.error('Error deleting component:', error);
                alert('Failed to delete component');
            }
        }
    };

    const earnings = filteredComponents.filter(c => c.type === 'EARNING');
    const deductions = filteredComponents.filter(c => c.type === 'DEDUCTION');

    return (
        <div className="h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-white flex overflow-hidden">
            {/* Sidebar */}
            <div
                className={`bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white flex flex-col fixed left-0 top-0 h-screen transition-all duration-300 shadow-2xl ${sidebarOpen ? 'w-56' : 'w-0'}`}
                style={{ overflow: sidebarOpen ? 'visible' : 'hidden' }}
            >
                {sidebarOpen && (
                    <>
                        {/* Logo */}
                        <div className="p-6 border-b border-slate-700/50 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-rose-600 rounded-lg flex items-center justify-center">
                                    <Receipt className="w-5 h-5 text-white" />
                                </div>
                                <span className="text-xl font-bold bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent">Payroll</span>
                            </div>
                            <button
                                onClick={() => setSidebarOpen(false)}
                                className="p-1.5 hover:bg-slate-700/50 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Navigation - NO Salary Components link */}
                        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                            <Link to="/dashboard" className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-slate-700/50 text-slate-300 hover:text-white transition-all">
                                <LayoutDashboard className="w-5 h-5" />
                                <span>Dashboard</span>
                            </Link>

                            <Link to="/employees" className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-slate-700/50 text-slate-300 hover:text-white transition-all">
                                <Users className="w-5 h-5" />
                                <span>Employees</span>
                            </Link>

                            <Link to="/pay-runs" className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-slate-700/50 text-slate-300 hover:text-white transition-all">
                                <DollarSign className="w-5 h-5" />
                                <span>Pay Runs</span>
                            </Link>

                            <div className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-slate-700/50 text-slate-300 hover:text-white transition-all cursor-pointer">
                                <Shield className="w-5 h-5" />
                                <span>Approvals</span>
                                <ChevronRight className="w-4 h-4 ml-auto" />
                            </div>

                            <Link to="/form16" className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-slate-700/50 text-slate-300 hover:text-white transition-all">
                                <FileCheck className="w-5 h-5" />
                                <span>Form 16</span>
                            </Link>

                            <Link to="/loans" className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-slate-700/50 text-slate-300 hover:text-white transition-all">
                                <Wallet className="w-5 h-5" />
                                <span>Loans</span>
                            </Link>

                            <Link to="/giving" className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-slate-700/50 text-slate-300 hover:text-white transition-all">
                                <Heart className="w-5 h-5" />
                                <span>Giving</span>
                            </Link>

                            <Link to="/documents" className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-slate-700/50 text-slate-300 hover:text-white transition-all">
                                <FolderOpen className="w-5 h-5" />
                                <span>Documents</span>
                            </Link>

                            <Link to="/reports" className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-slate-700/50 text-slate-300 hover:text-white transition-all">
                                <BarChart3 className="w-5 h-5" />
                                <span>Reports</span>
                            </Link>

                            <Link to="/settings" className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-slate-700/50 text-slate-300 hover:text-white transition-all">
                                <Settings className="w-5 h-5" />
                                <span>Settings</span>
                            </Link>
                        </nav>
                    </>
                )}
            </div>

            {/* Main Content */}
            <div className={`flex-1 flex flex-col h-screen transition-all duration-300 ${sidebarOpen ? 'ml-56' : 'ml-0'}`}>
                {/* Header */}
                <div className="bg-white/80 backdrop-blur-md border-b border-pink-100 px-6 py-4 flex-shrink-0 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 flex-1">
                            {!sidebarOpen && (
                                <button
                                    onClick={() => setSidebarOpen(true)}
                                    className="p-2 hover:bg-pink-50 rounded-xl transition-colors"
                                >
                                    <Menu className="w-5 h-5 text-slate-600" />
                                </button>
                            )}
                            <div className="relative flex-1 max-w-md">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Search components..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 bg-white"
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
                            </div>

                            <Link to="/notifications" className="p-2 hover:bg-pink-50 rounded-xl transition-colors block">
                                <Bell className="w-4 h-4 text-slate-600" />
                            </Link>

                            <button className="p-2 hover:bg-pink-50 rounded-xl transition-colors">
                                <Settings className="w-4 h-4 text-slate-600" />
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
                                    {user?.email?.charAt(0).toUpperCase() || 'U'}
                                </button>

                                {showProfileMenu && (
                                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-pink-100 py-2 z-50">
                                        <div className="px-4 py-3 border-b border-slate-100">
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                                                    {user?.email?.charAt(0).toUpperCase() || 'U'}
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
                <div className="flex-1 overflow-y-auto p-6">
                    <div className="max-w-7xl mx-auto">
                        {/* Page Header */}
                        <div className="mb-6">
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent mb-2">
                                Salary Components
                            </h1>
                            <p className="text-slate-600">Manage earnings and deductions for your organization</p>
                        </div>

                        {/* Actions Bar */}
                        <div className="bg-white rounded-xl border border-pink-100 p-4 mb-6 shadow-sm">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Filter className="w-4 h-4 text-slate-400" />
                                    <span className="text-sm text-slate-600 mr-2">Filter:</span>
                                    <button
                                        onClick={() => setFilterType('ALL')}
                                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${filterType === 'ALL'
                                                ? 'bg-pink-500 text-white'
                                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                            }`}
                                    >
                                        All ({components.length})
                                    </button>
                                    <button
                                        onClick={() => setFilterType('EARNING')}
                                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${filterType === 'EARNING'
                                                ? 'bg-emerald-500 text-white'
                                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                            }`}
                                    >
                                        Earnings ({components.filter(c => c.type === 'EARNING').length})
                                    </button>
                                    <button
                                        onClick={() => setFilterType('DEDUCTION')}
                                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${filterType === 'DEDUCTION'
                                                ? 'bg-red-500 text-white'
                                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                            }`}
                                    >
                                        Deductions ({components.filter(c => c.type === 'DEDUCTION').length})
                                    </button>
                                </div>
                                <Button
                                    onClick={() => {
                                        setEditingComponent(null);
                                        setShowComponentModal(true);
                                    }}
                                    className="bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white shadow-lg shadow-pink-500/30"
                                >
                                    <Plus className="w-4 h-4 mr-2" />
                                    Add Component
                                </Button>
                            </div>
                        </div>

                        {/* Components Grid */}
                        {filterType === 'ALL' || filterType === 'EARNING' ? (
                            <div className="mb-8">
                                <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                                    <div className="w-2 h-6 bg-gradient-to-b from-emerald-500 to-emerald-600 rounded-full"></div>
                                    Earnings
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {earnings.map((component) => (
                                        <ComponentCard
                                            key={component.id}
                                            component={component}
                                            onEdit={() => {
                                                setEditingComponent(component);
                                                setShowComponentModal(true);
                                            }}
                                            onDelete={() => handleDeleteComponent(component.id)}
                                        />
                                    ))}
                                    {earnings.length === 0 && (
                                        <div className="col-span-3 text-center py-12 text-slate-500">
                                            No earning components found
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : null}

                        {filterType === 'ALL' || filterType === 'DEDUCTION' ? (
                            <div>
                                <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                                    <div className="w-2 h-6 bg-gradient-to-b from-red-500 to-red-600 rounded-full"></div>
                                    Deductions
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {deductions.map((component) => (
                                        <ComponentCard
                                            key={component.id}
                                            component={component}
                                            onEdit={() => {
                                                setEditingComponent(component);
                                                setShowComponentModal(true);
                                            }}
                                            onDelete={() => handleDeleteComponent(component.id)}
                                        />
                                    ))}
                                    {deductions.length === 0 && (
                                        <div className="col-span-3 text-center py-12 text-slate-500">
                                            No deduction components found
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : null}
                    </div>
                </div>
            </div>

            {/* Component Modal */}
            {showComponentModal && (
                <ComponentModal
                    component={editingComponent}
                    onClose={() => {
                        setShowComponentModal(false);
                        setEditingComponent(null);
                    }}
                    onSave={() => {
                        setShowComponentModal(false);
                        setEditingComponent(null);
                        fetchComponents();
                    }}
                    organizationId={organization?.id}
                    components={components}
                />
            )}
        </div>
    );
}

// Component Card
function ComponentCard({ component, onEdit, onDelete }) {
    const isEarning = component.type === 'EARNING';

    return (
        <div className={`bg-white rounded-xl border-2 ${isEarning ? 'border-emerald-200' : 'border-red-200'} p-4 hover:shadow-lg transition-all`}>
            <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-slate-900">{component.name}</h3>
                        {component.isStatutory && (
                            <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">
                                Statutory
                            </span>
                        )}
                    </div>
                    <p className="text-xs text-slate-500 font-mono">{component.code}</p>
                </div>
                <div className={`px-2 py-1 rounded-lg text-xs font-medium ${isEarning ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                    }`}>
                    {component.type}
                </div>
            </div>

            <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Calculation:</span>
                    <span className="font-medium text-slate-900">{component.calculationType}</span>
                </div>
                {component.baseComponentName && (
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-600">Based on:</span>
                        <span className="font-medium text-slate-900">{component.baseComponentName}</span>
                    </div>
                )}
                <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Taxable:</span>
                    <span className={`font-medium ${component.isTaxable ? 'text-orange-600' : 'text-slate-400'}`}>
                        {component.isTaxable ? 'Yes' : 'No'}
                    </span>
                </div>
            </div>

            {component.description && (
                <p className="text-xs text-slate-500 mb-4 line-clamp-2">{component.description}</p>
            )}

            <div className="flex gap-2">
                <button
                    onClick={onEdit}
                    className="flex-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1"
                >
                    <Edit className="w-3.5 h-3.5" />
                    Edit
                </button>
                <button
                    onClick={onDelete}
                    className="flex-1 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1"
                >
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete
                </button>
            </div>
        </div>
    );
}
