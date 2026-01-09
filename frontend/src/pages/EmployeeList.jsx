import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import {
    Users,
    Plus,
    Search,
    Filter,
    MoreVertical,
    Edit,
    Trash2,
    Mail,
    Phone,
    DollarSign,
    Settings,
    Heart,
    Shield,
    Wallet,
    FolderOpen,
    BarChart3,
    Menu,
    LayoutDashboard,
    Receipt,
    ChevronRight,
    Bell,
    LogOut,
    Building,
    FileCheck,
    X,
    Download,
    Upload,
    Eye,
    CheckCircle,
    Calendar,
    TrendingUp,
    Gift,
    FileText,
    PieChart
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/authService';
import AppHeader from '../components/AppHeader';
import Sidebar from '../components/Sidebar';

export default function EmployeeList() {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout } = useAuth();
    const { darkMode } = useTheme();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [showCompanyMenu, setShowCompanyMenu] = useState(false);
    const [organization, setOrganization] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    // Read search query from URL on mount
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const searchParam = params.get('search');
        if (searchParam) {
            setSearchQuery(searchParam);
        }
    }, [location.search]);

    // Filter states
    const [showMoreFilters, setShowMoreFilters] = useState(false);
    const [showViewDropdown, setShowViewDropdown] = useState(false);
    const [showCreateCustomView, setShowCreateCustomView] = useState(false);
    const [activeView, setActiveView] = useState('Active Employees');
    const [filters, setFilters] = useState({
        workLocation: '',
        department: '',
        designation: '',
        investmentDeclaration: '',
        proofOfInvestments: '',
        flexibleBenefitPlan: '',
        reimbursement: '',
        onboardingStatus: '',
        portalAccess: ''
    });

    // Employee data from database
    const [employees, setEmployees] = useState([]);

    // Fetch organization data
    useEffect(() => {
        const fetchOrganization = async () => {
            try {
                const selectedOrgId = localStorage.getItem('selectedOrganizationId');

                if (!selectedOrgId) {
                    window.location.href = '/select-organization';
                    return;
                }

                const response = await api.get('/organizations');
                if (response.data && response.data.length > 0) {
                    const selectedOrg = response.data.find(org => org.id === parseInt(selectedOrgId));
                    if (selectedOrg) {
                        setOrganization(selectedOrg);
                    } else {
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

    // Fetch employees when organization is loaded
    useEffect(() => {
        const fetchEmployees = async () => {
            if (!organization) {
                console.log('⏳ Waiting for organization to load...');
                return;
            }

            console.log('🔄 Fetching employees for organization:', organization.id, organization.companyName);

            try {
                const response = await api.get(`/employees?organizationId=${organization.id}`);
                console.log('✅ API Response received:', response);
                console.log('📊 Employee count:', response.data?.length || 0);
                console.log('📋 Raw employee data:', response.data);

                // Map backend data to frontend format
                const mappedEmployees = response.data.map(emp => {
                    console.log('Mapping employee:', emp.employeeId, emp.fullName);
                    return {
                        id: emp.id,
                        name: emp.fullName || `${emp.firstName} ${emp.lastName || ''}`.trim(),
                        employeeId: emp.employeeId,
                        email: emp.workEmail,
                        phone: emp.mobileNumber,
                        designation: emp.designation,
                        department: emp.department,
                        workLocation: emp.workLocation,
                        salary: emp.annualCtc ? `₹${emp.annualCtc.toLocaleString()}` : 'N/A',
                        status: emp.status || 'Active',
                        joinDate: emp.dateOfJoining,
                        onboardingStatus: emp.onboardingStatus || 'Incomplete',
                        isProfileComplete: emp.isProfileComplete || false,
                        profileCompletionPercentage: emp.profileCompletionPercentage || 0,
                        portalAccess: emp.enablePortalAccess || false
                    };
                });

                console.log('✨ Mapped employees:', mappedEmployees);
                console.log('📌 Setting employees state with', mappedEmployees.length, 'employees');
                setEmployees(mappedEmployees);
            } catch (error) {
                console.error('❌ Error fetching employees:', error);
                console.error('Error details:', error.response?.data);
                console.error('Error status:', error.response?.status);
                console.error('Error message:', error.message);
            }
        };

        fetchEmployees();
    }, [organization]);

    const filteredEmployees = employees.filter(emp => {
        // View-based filtering
        let matchesView = true;
        switch (activeView) {
            case 'All Employees':
                matchesView = true;
                break;
            case 'Active Employees':
                matchesView = emp.status === 'Active';
                break;
            case 'Exited Employees':
                matchesView = emp.status === 'Exited' || emp.status === 'Inactive';
                break;
            case 'Incomplete Employees':
                matchesView = emp.onboardingStatus === 'Incomplete' || emp.onboardingStatus === 'Pending';
                break;
            case 'Portal Enabled Employees':
                matchesView = emp.portalAccess === true;
                break;
            case 'Portal Disabled Employees':
                matchesView = emp.portalAccess === false;
                break;
            default:
                matchesView = true;
        }

        // Search query filter
        const matchesSearch = emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            emp.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
            emp.email.toLowerCase().includes(searchQuery.toLowerCase());

        // Work location filter
        const matchesWorkLocation = !filters.workLocation || emp.workLocation === filters.workLocation;

        // Department filter
        const matchesDepartment = !filters.department || emp.department === filters.department;

        // Designation filter
        const matchesDesignation = !filters.designation || emp.designation === filters.designation;

        // Onboarding status filter
        const matchesOnboardingStatus = !filters.onboardingStatus || emp.onboardingStatus === filters.onboardingStatus;

        // Portal access filter
        const matchesPortalAccess = !filters.portalAccess ||
            (filters.portalAccess === 'enabled' && emp.portalAccess === true) ||
            (filters.portalAccess === 'disabled' && emp.portalAccess === false);

        return matchesView && matchesSearch && matchesWorkLocation && matchesDepartment &&
            matchesDesignation && matchesOnboardingStatus && matchesPortalAccess;
    });

    // Debug logging for filtered employees
    console.log('🔍 Filter Debug:');
    console.log('  Total employees:', employees.length);
    console.log('  Active view:', activeView);
    console.log('  Search query:', searchQuery);
    console.log('  Filters:', filters);
    console.log('  Filtered employees:', filteredEmployees.length);
    console.log('  Filtered employee list:', filteredEmployees);

    const handleFilterChange = (filterName, value) => {
        setFilters(prev => ({
            ...prev,
            [filterName]: value
        }));
    };

    const handleApplyFilters = () => {
        setShowMoreFilters(false);
    };

    const handleClearFilters = () => {
        setFilters({
            workLocation: '',
            department: '',
            designation: '',
            investmentDeclaration: '',
            proofOfInvestments: '',
            flexibleBenefitPlan: '',
            reimbursement: '',
            onboardingStatus: '',
            portalAccess: ''
        });
    };

    const activeFilterCount = Object.values(filters).filter(v => v !== '').length;

    // Predefined views
    const predefinedViews = [
        { name: 'All Employees', icon: Users },
        { name: 'Active Employees', icon: Users },
        { name: 'Exited Employees', icon: Users },
        { name: 'Incomplete Employees', icon: Users },
        { name: 'Portal Enabled Employees', icon: Shield },
        { name: 'Portal Disabled Employees', icon: Shield }
    ];

    return (
        <div className="h-screen bg-slate-50 dark:bg-slate-900 flex overflow-hidden">
            {/* Sidebar */}
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            {/* Main Content */}
            <div
                className={`flex-1 min-w-0 flex flex-col h-screen transition-all duration-300 ${sidebarOpen ? 'ml-56' : 'ml-0'}`}
                style={{ width: sidebarOpen ? 'calc(100vw - 14rem)' : '100vw' }}
            >
                {/* Top Bar */}
                <AppHeader
                    sidebarOpen={sidebarOpen}
                    setSidebarOpen={setSidebarOpen}
                    showCompanyMenu={showCompanyMenu}
                    setShowCompanyMenu={setShowCompanyMenu}
                    showProfileMenu={showProfileMenu}
                    setShowProfileMenu={setShowProfileMenu}
                    organization={organization}
                    loading={loading}
                    user={user}
                    logout={logout}
                />

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-4 min-w-0">
                    <div className="max-w-full">


                        {/* View Selector */}
                        <div className="mb-4 flex items-center gap-3">
                            <div className="relative">
                                <button
                                    onClick={() => setShowViewDropdown(!showViewDropdown)}
                                    className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                                >
                                    <Users className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                                    <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{activeView}</span>
                                    <ChevronRight className="w-4 h-4 text-slate-400 rotate-90" />
                                </button>

                                {showViewDropdown && (
                                    <div className="absolute top-full left-0 mt-2 w-72 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 z-50">
                                        <div className="p-3 border-b border-slate-200">
                                            <div className="relative">
                                                <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
                                                <input
                                                    type="text"
                                                    placeholder="Search"
                                                    className="w-full pr-3 py-1.5 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-rose-500"
                                                    style={{ paddingLeft: '2rem' }}
                                                />
                                            </div>
                                        </div>
                                        <div className="max-h-96 overflow-y-auto">
                                            {predefinedViews.map((view) => (
                                                <button
                                                    key={view.name}
                                                    onClick={() => {
                                                        setActiveView(view.name);
                                                        setShowViewDropdown(false);
                                                    }}
                                                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-slate-50 transition-colors ${activeView === view.name ? 'bg-blue-50 text-blue-600' : 'text-slate-700'
                                                        }`}
                                                >
                                                    {activeView === view.name && (
                                                        <span className="text-blue-600">✓</span>
                                                    )}
                                                    {activeView !== view.name && (
                                                        <span className="w-4"></span>
                                                    )}
                                                    <view.icon className="w-4 h-4" />
                                                    <span className="text-sm font-medium">{view.name}</span>
                                                </button>
                                            ))}
                                        </div>
                                        <div className="p-3 border-t border-slate-200">
                                            <button
                                                onClick={() => {
                                                    setShowViewDropdown(false);
                                                    setShowCreateCustomView(true);
                                                }}
                                                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                                            >
                                                <Plus className="w-4 h-4" />
                                                New Custom View
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <span className="text-sm text-slate-500 dark:text-slate-400">
                                {filteredEmployees.length} employee{filteredEmployees.length !== 1 ? 's' : ''}
                            </span>
                        </div>

                        {/* Actions Bar */}
                        <div className="mb-4 space-y-3">
                            {/* Search and Add Employee Row */}
                            <div className="flex items-center justify-between gap-3">
                                <div className="flex items-center gap-2 flex-1">
                                    <div className="max-w-sm relative">
                                        <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
                                        <Input
                                            type="text"
                                            placeholder="Search in Employee"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="pr-3 py-2 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-rose-500 focus:border-rose-500 bg-white"
                                            style={{ paddingLeft: '2rem' }}
                                        />
                                    </div>

                                    {/* Compact Incomplete Employee Indicator */}
                                    {filteredEmployees.filter(e => !e.isProfileComplete).length > 0 && activeView === 'Active Employees' && (
                                        <button
                                            onClick={() => setActiveView('Incomplete Employees')}
                                            className="flex items-center gap-1.5 px-3 py-2 bg-orange-50 border border-orange-200 rounded-md hover:bg-orange-100 transition-colors"
                                        >
                                            <span className="text-orange-600 text-sm">⚠️</span>
                                            <span className="text-xs font-medium text-orange-700">
                                                {filteredEmployees.filter(e => !e.isProfileComplete).length} Incomplete
                                            </span>
                                        </button>
                                    )}
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            // Export employees to CSV
                                            const csvContent = [
                                                ['Employee ID', 'Name', 'Email', 'Phone', 'Department', 'Designation', 'Status'].join(','),
                                                ...filteredEmployees.map(emp =>
                                                    [emp.employeeId, emp.name, emp.email, emp.phone, emp.department, emp.designation, emp.status].join(',')
                                                )
                                            ].join('\n');

                                            const blob = new Blob([csvContent], { type: 'text/csv' });
                                            const url = window.URL.createObjectURL(blob);
                                            const a = document.createElement('a');
                                            a.href = url;
                                            a.download = `employees_${new Date().toISOString().split('T')[0]}.csv`;
                                            a.click();
                                            window.URL.revokeObjectURL(url);
                                        }}
                                        className="px-4 py-2 text-sm bg-white border border-slate-300 text-slate-700 rounded-md hover:bg-slate-50 transition-colors flex items-center gap-2 font-medium"
                                    >
                                        <Download className="w-4 h-4 text-slate-700" />
                                        <span className="text-slate-700">Export</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            // Trigger file input for import
                                            document.getElementById('import-employees').click();
                                        }}
                                        className="px-4 py-2 text-sm bg-white border border-slate-300 text-slate-700 rounded-md hover:bg-slate-50 transition-colors flex items-center gap-2 font-medium"
                                    >
                                        <Upload className="w-4 h-4 text-slate-700" />
                                        <span className="text-slate-700">Import</span>
                                    </button>
                                    <input
                                        id="import-employees"
                                        type="file"
                                        accept=".csv,.xlsx"
                                        className="hidden"
                                        onChange={(e) => {
                                            const file = e.target.files[0];
                                            if (file) {
                                                alert('Import functionality will be implemented soon. File: ' + file.name);
                                                // TODO: Implement CSV/Excel parsing and bulk employee creation
                                            }
                                        }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => navigate('/employees/add')}
                                        className="px-4 py-2 text-sm bg-rose-500 text-white rounded-md hover:bg-rose-600 transition-colors flex items-center gap-2 font-medium"
                                    >
                                        <Plus className="w-4 h-4" />
                                        <span>Add Employee</span>
                                    </button>
                                </div>
                            </div>

                            {/* Filters Row */}
                            <div className="flex items-center gap-3">
                                <span className="text-sm text-slate-600 dark:text-slate-300 font-medium">FILTER BY :</span>

                                {/* Work Location Filter */}
                                <div className="relative inline-block">
                                    <select
                                        value={filters.workLocation}
                                        onChange={(e) => handleFilterChange('workLocation', e.target.value)}
                                        className="appearance-none pl-2.5 pr-7 py-1.5 text-xs border border-slate-200 dark:border-slate-600 rounded-md focus:outline-none focus:ring-1 focus:ring-rose-500 focus:border-rose-500 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-200 cursor-pointer"
                                    >
                                        <option value="">Select Work Location</option>
                                        <option value="Head Office">Head Office</option>
                                        <option value="Branch Office">Branch Office</option>
                                        <option value="Remote">Remote</option>
                                    </select>
                                    <ChevronRight className="absolute right-1.5 top-1/2 transform -translate-y-1/2 w-3 h-3 text-slate-400 pointer-events-none rotate-90" />
                                </div>

                                {/* Department Filter */}
                                <div className="relative inline-block">
                                    <select
                                        value={filters.department}
                                        onChange={(e) => handleFilterChange('department', e.target.value)}
                                        className="appearance-none pl-2.5 pr-7 py-1.5 text-xs border border-slate-200 dark:border-slate-600 rounded-md focus:outline-none focus:ring-1 focus:ring-rose-500 focus:border-rose-500 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-200 cursor-pointer"
                                    >
                                        <option value="">Select Department</option>
                                        <option value="Engineering">Engineering</option>
                                        <option value="Product">Product</option>
                                        <option value="Design">Design</option>
                                        <option value="HR">HR</option>
                                        <option value="Marketing">Marketing</option>
                                    </select>
                                    <ChevronRight className="absolute right-1.5 top-1/2 transform -translate-y-1/2 w-3 h-3 text-slate-400 pointer-events-none rotate-90" />
                                </div>

                                {/* Designation Filter */}
                                <div className="relative inline-block">
                                    <select
                                        value={filters.designation}
                                        onChange={(e) => handleFilterChange('designation', e.target.value)}
                                        className="appearance-none pl-2.5 pr-7 py-1.5 text-xs border border-slate-200 dark:border-slate-600 rounded-md focus:outline-none focus:ring-1 focus:ring-rose-500 focus:border-rose-500 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-200 cursor-pointer"
                                    >
                                        <option value="">Select Designation</option>
                                        <option value="Senior Developer">Senior Developer</option>
                                        <option value="Product Manager">Product Manager</option>
                                        <option value="UI/UX Designer">UI/UX Designer</option>
                                        <option value="HR Manager">HR Manager</option>
                                        <option value="Marketing Manager">Marketing Manager</option>
                                    </select>
                                    <ChevronRight className="absolute right-1.5 top-1/2 transform -translate-y-1/2 w-3 h-3 text-slate-400 pointer-events-none rotate-90" />
                                </div>

                                {/* More Filters Button */}
                                <Button
                                    type="button"
                                    onClick={() => setShowMoreFilters(true)}
                                    className="px-3 py-1.5 text-sm text-blue-600 rounded-md hover:bg-blue-50 transition-colors flex items-center gap-1.5 font-medium border-none"
                                >
                                    <Filter className="w-4 h-4" />
                                    More Filters
                                    {activeFilterCount > 3 && (
                                        <span className="ml-1 px-1.5 py-0.5 bg-blue-100 text-blue-600 text-xs rounded-full">
                                            {activeFilterCount - 3}
                                        </span>
                                    )}
                                </Button>

                                {/* Clear Filters */}
                                {activeFilterCount > 0 && (
                                    <Button
                                        type="button"
                                        onClick={handleClearFilters}
                                        className="px-3 py-1.5 text-sm text-slate-600 rounded-md hover:bg-slate-50 transition-colors flex items-center gap-1.5"
                                    >
                                        <X className="w-4 h-4" />
                                        Clear All
                                    </Button>
                                )}
                            </div>
                        </div>

                        {/* Employee Table - Modern Sleek Design */}
                        {filteredEmployees.length === 0 ? (
                            <div className="text-center py-8 bg-white dark:bg-slate-800 rounded-lg border border-slate-200/60 dark:border-slate-700/60 shadow-sm">
                                <div className="w-12 h-12 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-2">
                                    <Users className="w-6 h-6 text-slate-400" />
                                </div>
                                <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-1">No Employees Found</h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
                                    {searchQuery ? 'No employees match your search.' : 'Get started by adding your first employee.'}
                                </p>
                                {!searchQuery && (
                                    <Button
                                        type="button"
                                        onClick={() => navigate('/employees/add')}
                                        className="px-3 py-1.5 text-xs bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-md hover:from-rose-600 hover:to-pink-600 transition-all inline-flex items-center gap-1.5 shadow-sm"
                                    >
                                        <Plus className="w-3.5 h-3.5" />
                                        Add Employee
                                    </Button>
                                )}
                            </div>
                        ) : (
                            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200/60 dark:border-slate-700/60 shadow-sm overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-slate-50/80 dark:bg-slate-700/50">
                                            <tr>
                                                <th className="px-4 py-2.5 text-left text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Name</th>
                                                <th className="px-4 py-2.5 text-left text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Email</th>
                                                <th className="px-4 py-2.5 text-left text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Department</th>
                                                <th className="px-4 py-2.5 text-left text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                                            {filteredEmployees.map((employee) => (
                                                <tr key={employee.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/30 transition-colors cursor-pointer" onClick={() => navigate(`/employees/${employee.id}`)}>
                                                    <td className="px-4 py-3">
                                                        <div className="flex items-center gap-2.5">
                                                            <div className="w-8 h-8 bg-gradient-to-br from-rose-400 to-pink-500 rounded-full flex items-center justify-center text-white font-medium text-xs flex-shrink-0 shadow-sm">
                                                                {employee.name.charAt(0)}
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-medium text-slate-900 dark:text-white">{employee.name}</p>
                                                                <p className="text-[10px] text-slate-500 dark:text-slate-400">{employee.employeeId}</p>
                                                            </div>
                                                            {!employee.isProfileComplete && (
                                                                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-orange-50 text-orange-600 text-[10px] font-medium rounded">
                                                                    ⚠️ {employee.profileCompletionPercentage}%
                                                                </span>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <span className="text-xs text-slate-600 dark:text-slate-300">{employee.email}</span>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <span className="text-xs text-slate-700 dark:text-slate-200">{employee.department}</span>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <span className="inline-flex px-2 py-0.5 text-[10px] font-medium rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200">
                                                            {employee.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* More Filters Modal */}
            {showMoreFilters && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white">More Filters</h2>
                            <button
                                onClick={() => setShowMoreFilters(false)}
                                className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            {/* Work Location */}
                            <div className="grid grid-cols-3 gap-4 items-center">
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Work Location</label>
                                <div className="col-span-2 relative">
                                    <select
                                        value={filters.workLocation}
                                        onChange={(e) => handleFilterChange('workLocation', e.target.value)}
                                        className="w-full appearance-none pl-3 pr-10 py-2.5 text-sm border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 bg-white dark:bg-slate-700 text-slate-700 dark:text-white cursor-pointer"
                                    >
                                        <option value="">Select Work Location</option>
                                        <option value="Head Office">Head Office</option>
                                        <option value="Branch Office">Branch Office</option>
                                        <option value="Remote">Remote</option>
                                    </select>
                                    <ChevronRight className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none rotate-90" />
                                </div>
                            </div>

                            {/* Department */}
                            <div className="grid grid-cols-3 gap-4 items-center">
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Department</label>
                                <div className="col-span-2 relative">
                                    <select
                                        value={filters.department}
                                        onChange={(e) => handleFilterChange('department', e.target.value)}
                                        className="w-full appearance-none pl-3 pr-10 py-2.5 text-sm border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 bg-white dark:bg-slate-700 text-slate-700 dark:text-white cursor-pointer"
                                    >
                                        <option value="">Select Department</option>
                                        <option value="Engineering">Engineering</option>
                                        <option value="Product">Product</option>
                                        <option value="Design">Design</option>
                                        <option value="HR">HR</option>
                                        <option value="Marketing">Marketing</option>
                                    </select>
                                    <ChevronRight className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none rotate-90" />
                                </div>
                            </div>

                            {/* Designation */}
                            <div className="grid grid-cols-3 gap-4 items-center">
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Designation</label>
                                <div className="col-span-2 relative">
                                    <select
                                        value={filters.designation}
                                        onChange={(e) => handleFilterChange('designation', e.target.value)}
                                        className="w-full appearance-none pl-3 pr-10 py-2.5 text-sm border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 bg-white dark:bg-slate-700 text-slate-700 dark:text-white cursor-pointer"
                                    >
                                        <option value="">Select Designation</option>
                                        <option value="Senior Developer">Senior Developer</option>
                                        <option value="Product Manager">Product Manager</option>
                                        <option value="UI/UX Designer">UI/UX Designer</option>
                                        <option value="HR Manager">HR Manager</option>
                                        <option value="Marketing Manager">Marketing Manager</option>
                                    </select>
                                    <ChevronRight className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none rotate-90" />
                                </div>
                            </div>

                            {/* Investment Declaration */}
                            <div className="grid grid-cols-3 gap-4 items-center">
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Investment Declaration</label>
                                <div className="col-span-2 relative">
                                    <select
                                        value={filters.investmentDeclaration}
                                        onChange={(e) => handleFilterChange('investmentDeclaration', e.target.value)}
                                        className="w-full appearance-none pl-3 pr-10 py-2.5 text-sm border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 bg-white dark:bg-slate-700 text-slate-700 dark:text-white cursor-pointer"
                                    >
                                        <option value="">Select Status</option>
                                        <option value="Submitted">Submitted</option>
                                        <option value="Pending">Pending</option>
                                        <option value="Not Started">Not Started</option>
                                    </select>
                                    <ChevronRight className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none rotate-90" />
                                </div>
                            </div>

                            {/* Proof Of Investments */}
                            <div className="grid grid-cols-3 gap-4 items-center">
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Proof Of Investments</label>
                                <div className="col-span-2 relative">
                                    <select
                                        value={filters.proofOfInvestments}
                                        onChange={(e) => handleFilterChange('proofOfInvestments', e.target.value)}
                                        className="w-full appearance-none pl-3 pr-10 py-2.5 text-sm border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 bg-white dark:bg-slate-700 text-slate-700 dark:text-white cursor-pointer"
                                    >
                                        <option value="">Select Status</option>
                                        <option value="Submitted">Submitted</option>
                                        <option value="Pending">Pending</option>
                                        <option value="Not Started">Not Started</option>
                                    </select>
                                    <ChevronRight className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none rotate-90" />
                                </div>
                            </div>

                            {/* Flexible Benefit Plan */}
                            <div className="grid grid-cols-3 gap-4 items-center">
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Flexible Benefit Plan</label>
                                <div className="col-span-2 relative">
                                    <select
                                        value={filters.flexibleBenefitPlan}
                                        onChange={(e) => handleFilterChange('flexibleBenefitPlan', e.target.value)}
                                        className="w-full appearance-none pl-3 pr-10 py-2.5 text-sm border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 bg-white dark:bg-slate-700 text-slate-700 dark:text-white cursor-pointer"
                                    >
                                        <option value="">Select Status</option>
                                        <option value="Active">Active</option>
                                        <option value="Inactive">Inactive</option>
                                        <option value="Pending">Pending</option>
                                    </select>
                                    <ChevronRight className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none rotate-90" />
                                </div>
                            </div>

                            {/* Reimbursement */}
                            <div className="grid grid-cols-3 gap-4 items-center">
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Reimbursement</label>
                                <div className="col-span-2 relative">
                                    <select
                                        value={filters.reimbursement}
                                        onChange={(e) => handleFilterChange('reimbursement', e.target.value)}
                                        className="w-full appearance-none pl-3 pr-10 py-2.5 text-sm border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 bg-white dark:bg-slate-700 text-slate-700 dark:text-white cursor-pointer"
                                    >
                                        <option value="">Select Status</option>
                                        <option value="Approved">Approved</option>
                                        <option value="Pending">Pending</option>
                                        <option value="Rejected">Rejected</option>
                                    </select>
                                    <ChevronRight className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none rotate-90" />
                                </div>
                            </div>

                            {/* Onboarding Status */}
                            <div className="grid grid-cols-3 gap-4 items-center">
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Onboarding Status</label>
                                <div className="col-span-2 relative">
                                    <select
                                        value={filters.onboardingStatus}
                                        onChange={(e) => handleFilterChange('onboardingStatus', e.target.value)}
                                        className="w-full appearance-none pl-3 pr-10 py-2.5 text-sm border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 bg-white dark:bg-slate-700 text-slate-700 dark:text-white cursor-pointer"
                                    >
                                        <option value="">Select Status</option>
                                        <option value="Complete">Complete</option>
                                        <option value="Incomplete">Incomplete</option>
                                        <option value="Pending">Pending</option>
                                    </select>
                                    <ChevronRight className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none rotate-90" />
                                </div>
                            </div>

                            {/* Portal Access */}
                            <div className="grid grid-cols-3 gap-4 items-center">
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Portal Access</label>
                                <div className="col-span-2 relative">
                                    <select
                                        value={filters.portalAccess}
                                        onChange={(e) => handleFilterChange('portalAccess', e.target.value)}
                                        className="w-full appearance-none pl-3 pr-10 py-2.5 text-sm border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 bg-white dark:bg-slate-700 text-slate-700 dark:text-white cursor-pointer"
                                    >
                                        <option value="">Select Status</option>
                                        <option value="enabled">Enabled</option>
                                        <option value="disabled">Disabled</option>
                                    </select>
                                    <ChevronRight className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none rotate-90" />
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="flex items-center justify-start gap-3 p-6 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700">
                            <Button
                                type="button"
                                onClick={handleApplyFilters}
                                className="px-6 py-2.5 text-sm bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white rounded-md transition-colors font-medium"
                            >
                                Apply
                            </Button>
                            <Button
                                type="button"
                                onClick={() => setShowMoreFilters(false)}
                                className="px-6 py-2.5 text-sm bg-white dark:bg-slate-600 text-slate-700 dark:text-white border border-slate-300 dark:border-slate-500 rounded-md hover:bg-slate-50 dark:hover:bg-slate-500 transition-colors font-medium"
                            >
                                Cancel
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
