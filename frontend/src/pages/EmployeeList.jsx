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

// Custom Filter Dropdown Component
const FilterDropdown = ({ label, value, options, onChange, active }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = React.useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-medium rounded-lg transition-all border shadow-sm bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-rose-200 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700 dark:hover:bg-slate-700"
            >
                <span>{value || label}</span>
                <ChevronRight className={`w-2.5 h-2.5 transition-transform duration-200 ${isOpen ? 'rotate-[-90deg]' : 'rotate-90 text-slate-400'}`} />
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 mt-1 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-100 dark:border-slate-700 z-[60] overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                    <div className="py-1 max-h-60 overflow-y-auto custom-scrollbar">
                        <button
                            onClick={() => {
                                onChange('');
                                setIsOpen(false);
                            }}
                            className={`w-full text-left px-3 py-2 text-[11px] hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors ${!value ? 'text-rose-600 font-semibold bg-rose-50/50' : 'text-slate-600 dark:text-slate-300'}`}
                        >
                            All {label}s
                        </button>
                        {options.map((opt) => (
                            <button
                                key={opt}
                                onClick={() => {
                                    onChange(opt);
                                    setIsOpen(false);
                                }}
                                className={`w-full text-left px-3 py-2 text-[11px] hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors flex items-center justify-between ${value === opt ? 'text-rose-600 font-semibold bg-rose-50/50' : 'text-slate-600 dark:text-slate-300'
                                    }`}
                            >
                                {opt}
                                {value === opt && <CheckCircle className="w-3 h-3 text-rose-500" />}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default function EmployeeList() {
    // ... (rest of component code remains same until return)
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

    // Read search query from URL on mount and update
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const searchParam = params.get('search');
        setSearchQuery(searchParam || '');
    }, [location.search]);

    // Filter states
    const [showMoreFilters, setShowMoreFilters] = useState(false);
    const [showViewDropdown, setShowViewDropdown] = useState(false);
    const [showCreateCustomView, setShowCreateCustomView] = useState(false);
    const [activeView, setActiveView] = useState('Active Employees');
    const [showFilters, setShowFilters] = useState(false);
    const viewSelectorRef = React.useRef(null);

    // Click away for View Selector
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (viewSelectorRef.current && !viewSelectorRef.current.contains(event.target)) {
                setShowViewDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Custom Views State
    const [customViews, setCustomViews] = useState(() => {
        const saved = localStorage.getItem('customViews');
        return saved ? JSON.parse(saved) : [];
    });
    const [newViewName, setNewViewName] = useState('');
    const [viewFilters, setViewFilters] = useState({
        searchQuery: '',
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

    // Sort state
    const [sortBy, setSortBy] = useState('name-asc'); // default: alphabetic ascending

    // Import modal state
    const [showImportModal, setShowImportModal] = useState(false);

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

    const filteredAndSortedEmployees = employees.filter(emp => {
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
                matchesView = emp.status === 'Exited';
                break;
            case 'Inactive Employees':
                matchesView = emp.status === 'Inactive';
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
    }).sort((a, b) => {
        // Apply sorting
        switch (sortBy) {
            case 'name-asc':
                return (a.name || '').localeCompare(b.name || '');
            case 'name-desc':
                return (b.name || '').localeCompare(a.name || '');
            case 'empid-asc':
                return (a.employeeId || '').localeCompare(b.employeeId || '');
            case 'empid-desc':
                return (b.employeeId || '').localeCompare(a.employeeId || '');
            default:
                return 0;
        }
    });

    // Debug logging for filtered employees
    console.log('🔍 Filter Debug:');
    console.log('  Total employees:', employees.length);
    console.log('  Active view:', activeView);
    console.log('  Search query:', searchQuery);
    console.log('  Filters:', filters);
    console.log('  Filtered employees:', filteredAndSortedEmployees.length);
    console.log('  Sort by:', sortBy);
    console.log('  Filtered employee list:', filteredAndSortedEmployees);

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

    const handleSaveCustomView = () => {
        if (!newViewName.trim()) return;
        const newView = {
            id: Date.now(),
            name: newViewName,
            filters: { ...viewFilters },
            icon: Users
        };
        const updatedViews = [...customViews, newView];
        setCustomViews(updatedViews);
        localStorage.setItem('customViews', JSON.stringify(updatedViews));

        // Reset and close
        setNewViewName('');
        setViewFilters({
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
        setShowCreateCustomView(false);
        setActiveView(newView.name);
        setFilters(newView.filters);
        setShowFilters(true); // Show filters to indicate they are active
    };

    const handleDeleteCustomView = (e, viewId) => {
        e.stopPropagation();
        const updatedViews = customViews.filter(v => v.id !== viewId);
        setCustomViews(updatedViews);
        localStorage.setItem('customViews', JSON.stringify(updatedViews));
        if (activeView === customViews.find(v => v.id === viewId)?.name) {
            setActiveView('Active Employees');
        }
    };

    const handleViewSelect = (view) => {
        setActiveView(view.name);
        setShowViewDropdown(false);

        // If it's a custom view, apply its filters
        if (view.filters) {
            setFilters(view.filters);
            setShowFilters(true);

            // Apply Search Query if saved in the view
            if (view.filters.searchQuery) {
                navigate(`${location.pathname}?search=${encodeURIComponent(view.filters.searchQuery)}`);
            } else {
                navigate(location.pathname);
            }
        } else {
            // For predefined views, you might want to reset or apply specific logic
            // For now, I'll just clear filters or handle logic based on view name if needed
            // But existing code seems to handle predefined views via filtering logic in the render
            // I should ensure I don't accidentally clear the logic for 'Active Employees' etc.
            // The filtering logic for predefined views exists lower down (I need to check that).
            // Assuming existing logic handles predefined views by name.
            handleClearFilters(); // Reset filters when switching to standard views to avoid confusion
        }
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


                        <div className="mb-2 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="relative" ref={viewSelectorRef}>
                                    <button
                                        onClick={() => setShowViewDropdown(!showViewDropdown)}
                                        className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-900/20 hover:border-rose-200 dark:hover:border-rose-800 transition-all shadow-sm group"
                                    >
                                        <div className="p-1 bg-rose-50 dark:bg-rose-900/30 rounded-md group-hover:bg-rose-100 dark:group-hover:bg-rose-900/50 transition-colors">
                                            <Users className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                                        </div>
                                        <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">{activeView}</span>
                                        <ChevronRight className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${showViewDropdown ? 'rotate-[-90deg]' : 'rotate-90'}`} />
                                    </button>

                                    {showViewDropdown && (
                                        <div className="absolute top-full left-0 mt-1 w-64 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 z-50 overflow-hidden ring-1 ring-black/5 animate-in fade-in zoom-in-95 duration-100">
                                            <div className="py-1.5 overflow-y-auto max-h-[300px] custom-scrollbar">
                                                <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">System Views</div>
                                                {predefinedViews.map((view) => (
                                                    <button
                                                        key={view.name}
                                                        onClick={() => handleViewSelect(view)}
                                                        className={`w-full flex items-center gap-2.5 px-3 py-2 text-left transition-all ${activeView === view.name
                                                            ? 'bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 font-medium border-l-[3px] border-rose-500'
                                                            : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white border-l-[3px] border-transparent'
                                                            }`}
                                                    >
                                                        <view.icon className={`w-3.5 h-3.5 ${activeView === view.name ? 'text-rose-500' : 'text-slate-400'}`} />
                                                        <span className="text-xs">{view.name}</span>
                                                    </button>
                                                ))}

                                                {customViews.length > 0 && (
                                                    <>
                                                        <div className="px-3 py-1.5 mt-2 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider border-t border-slate-100 dark:border-slate-700/50">Custom Views</div>
                                                        {customViews.map((view) => (
                                                            <div key={view.id} className="group relative flex items-center">
                                                                <button
                                                                    onClick={() => handleViewSelect(view)}
                                                                    className={`w-full flex items-center gap-2.5 px-3 py-2 text-left transition-all ${activeView === view.name
                                                                        ? 'bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 font-medium border-l-[3px] border-rose-500'
                                                                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white border-l-[3px] border-transparent'
                                                                        }`}
                                                                >
                                                                    <Users className={`w-3.5 h-3.5 ${activeView === view.name ? 'text-rose-500' : 'text-slate-400'}`} />
                                                                    <span className="text-xs truncate max-w-[140px]">{view.name}</span>
                                                                </button>
                                                                <button
                                                                    onClick={(e) => handleDeleteCustomView(e, view.id)}
                                                                    className="absolute right-2 p-1 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded opacity-0 group-hover:opacity-100 transition-all"
                                                                    title="Delete View"
                                                                >
                                                                    <Trash2 className="w-3 h-3" />
                                                                </button>
                                                            </div>
                                                        ))}
                                                    </>
                                                )}
                                            </div>
                                            <div className="p-1.5 border-t border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                                                <button
                                                    onClick={() => {
                                                        setShowViewDropdown(false);
                                                        setShowCreateCustomView(true);
                                                    }}
                                                    className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 text-[11px] font-medium text-rose-600 dark:text-rose-400 hover:text-white hover:bg-rose-500 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 hover:border-rose-500 rounded-md transition-all shadow-sm"
                                                >
                                                    <Plus className="w-3 h-3" />
                                                    New Custom View
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="relative">
                                    <FilterDropdown
                                        label="Sort"
                                        value={sortBy === 'name-asc' ? 'Name (A-Z)' : sortBy === 'name-desc' ? 'Name (Z-A)' : sortBy === 'empid-asc' ? 'Employee ID (Asc)' : sortBy === 'empid-desc' ? 'Employee ID (Desc)' : ''}
                                        options={['Name (A-Z)', 'Name (Z-A)', 'Employee ID (Asc)', 'Employee ID (Desc)']}
                                        onChange={(val) => {
                                            const sortMap = {
                                                'Name (A-Z)': 'name-asc',
                                                'Name (Z-A)': 'name-desc',
                                                'Employee ID (Asc)': 'empid-asc',
                                                'Employee ID (Desc)': 'empid-desc'
                                            };
                                            setSortBy(sortMap[val] || 'name-asc');
                                        }}
                                    />
                                </div>

                                <button
                                    onClick={() => setShowFilters(!showFilters)}
                                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all shadow-sm font-medium text-xs ${showFilters
                                        ? 'bg-rose-50 border-rose-200 text-rose-600 dark:bg-rose-900/20 dark:border-rose-800 dark:text-rose-400'
                                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-rose-200 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-700'
                                        }`}
                                >
                                    <Filter className={`w-3.5 h-3.5 ${showFilters ? 'text-rose-600' : 'text-slate-400'}`} />
                                    <span>{showFilters ? 'Hide Filters' : 'Filters'}</span>
                                    {activeFilterCount > 0 && (
                                        <span className="flex items-center justify-center w-4 h-4 bg-rose-500 text-white text-[10px] rounded-full font-bold ml-1">
                                            {activeFilterCount}
                                        </span>
                                    )}
                                </button>
                            </div>

                            {/* Actions Buttons (Restored to align with View Selector) */}
                            <div className="flex items-center gap-2">
                                <div className="flex items-center rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-0.5 shadow-sm">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            // Export implementation
                                        }}
                                        className="px-2.5 py-1.5 text-[11px] font-medium text-slate-600 dark:text-slate-300 hover:bg-rose-50 dark:hover:bg-rose-900/30 hover:text-rose-600 dark:hover:text-rose-400 rounded-md transition-colors flex items-center gap-1.5"
                                    >
                                        <Download className="w-3 h-3" />
                                        Export
                                    </button>
                                    <div className="w-px h-3.5 bg-slate-200 dark:bg-slate-700 mx-0.5"></div>
                                    <button
                                        type="button"
                                        onClick={() => setShowImportModal(true)}
                                        className="px-2.5 py-1.5 text-[11px] font-medium text-slate-600 dark:text-slate-300 hover:bg-rose-50 dark:hover:bg-rose-900/30 hover:text-rose-600 dark:hover:text-rose-400 rounded-md transition-colors flex items-center gap-1.5"
                                    >
                                        <Upload className="w-3 h-3" />
                                        Import
                                    </button>
                                </div>
                                <input
                                    id="import-employees"
                                    type="file"
                                    accept=".csv,.xlsx"
                                    className="hidden"
                                    onChange={(e) => {
                                        // Import implementation
                                    }}
                                />
                                <button
                                    type="button"
                                    onClick={() => navigate('/employees/add')}
                                    className="px-3.5 py-2 text-xs font-semibold text-white bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 rounded-lg shadow-md shadow-rose-500/20 hover:shadow-rose-500/30 transform hover:-translate-y-0.5 transition-all flex items-center gap-1.5"
                                >
                                    <Plus className="w-3.5 h-3.5" />
                                    <span>Add Employee</span>
                                </button>
                            </div>
                        </div>

                        {/* Filters Row (Shifted up since Actions bar is merged) */}
                        <div className="mb-3">

                            {/* Filters Row */}
                            {showFilters && (
                                <div className="flex flex-wrap items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
                                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 tracking-wider uppercase mr-1">Filter By</span>

                                    {[
                                        { label: 'Work Location', key: 'workLocation', options: ['Head Office', 'Branch Office', 'Remote'] },
                                        { label: 'Department', key: 'department', options: ['Engineering', 'Product', 'Design', 'HR', 'Marketing'] },
                                        { label: 'Designation', key: 'designation', options: ['Senior Developer', 'Product Manager', 'UI/UX Designer', 'HR Manager', 'Marketing Manager'] }
                                    ].map((filter) => (
                                        <FilterDropdown
                                            key={filter.key}
                                            label={filter.label}
                                            value={filters[filter.key]}
                                            options={filter.options}
                                            onChange={(val) => handleFilterChange(filter.key, val)}
                                        />
                                    ))}

                                    {/* More Filters Button */}
                                    <button
                                        type="button"
                                        onClick={() => setShowMoreFilters(true)}
                                        className="flex items-center gap-1.5 px-3 py-1 text-[11px] font-bold text-white bg-rose-500 hover:bg-rose-600 rounded-full transition-all shadow-md shadow-rose-500/20 h-7"
                                    >
                                        <Filter className="w-3 h-3 text-white" />
                                        More
                                        {activeFilterCount > 3 && (
                                            <span className="flex items-center justify-center w-3.5 h-3.5 bg-white text-rose-600 text-[9px] rounded-full font-extrabold">
                                                {activeFilterCount - 3}
                                            </span>
                                        )}
                                    </button>

                                    {/* Clear Filters */}
                                    {activeFilterCount > 0 && (
                                        <button
                                            type="button"
                                            onClick={handleClearFilters}
                                            className="px-2 py-1 text-[11px] font-medium text-slate-500 hover:text-rose-600 transition-colors flex items-center gap-1 ml-auto sm:ml-0"
                                        >
                                            <X className="w-3 h-3" />
                                            Reset
                                        </button>
                                    )}

                                    {/* Close Filters Button */}
                                    <button
                                        onClick={() => setShowFilters(false)}
                                        className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-all ml-auto"
                                        title="Hide Filters"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </div>
                            )}

                        </div>

                        {/* Employee Table - Sleek Glassmorphism Design */}
                        {filteredAndSortedEmployees.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-16 px-4 bg-white dark:bg-slate-800 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700 text-center animate-in fade-in zoom-in-95 duration-300">
                                <div className="w-20 h-20 bg-rose-50 dark:bg-rose-900/20 rounded-full flex items-center justify-center mb-5 shadow-inner">
                                    <Users className="w-9 h-9 text-rose-400 opacity-80" />
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 tracking-tight">No Employees Found</h3>
                                <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-6 text-xs leading-relaxed">
                                    {searchQuery ? `We couldn't find any matches for "${searchQuery}". Try checking for typos or use different keywords.` : 'Your team is empty! Get started by adding your first employee to the system.'}
                                </p>
                                {!searchQuery && (
                                    <Button
                                        type="button"
                                        onClick={() => navigate('/employees/add')}
                                        className="px-6 py-2.5 bg-gradient-to-r from-rose-500 to-pink-600 text-white rounded-full hover:shadow-lg hover:shadow-rose-500/30 hover:-translate-y-0.5 transition-all font-semibold flex items-center gap-2 text-xs"
                                    >
                                        <Plus className="w-4 h-4" />
                                        Add New Employee
                                    </Button>
                                )}
                            </div>
                        ) : (
                            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-white/20 shadow-xl shadow-rose-900/5 overflow-hidden flex flex-col h-[calc(100vh-14rem)] transition-all">
                                <div className="overflow-auto flex-1 custom-scrollbar">
                                    <table className="w-full">
                                        <thead className="sticky top-0 z-10 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border-b border-slate-100 dark:border-slate-700/50 shadow-sm">
                                            <tr>
                                                <th className="px-6 py-3.5 text-left text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest pl-8">Employee</th>
                                                <th className="px-6 py-3.5 text-left text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Contact</th>
                                                <th className="px-6 py-3.5 text-left text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Role</th>
                                                <th className="px-6 py-3.5 text-left text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Status</th>

                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-50 dark:divide-slate-700/30">
                                            {filteredAndSortedEmployees.map((employee, index) => (
                                                <tr
                                                    key={employee.id}
                                                    className="group hover:bg-rose-50/30 dark:hover:bg-rose-900/10 transition-all duration-200 cursor-pointer hover:shadow-sm"
                                                    onClick={() => navigate(`/employees/${employee.id}`)}
                                                    style={{ animationDelay: `${index * 30}ms` }}
                                                >
                                                    <td className="px-6 py-3 pl-8">
                                                        <div className="flex items-center gap-3.5">
                                                            <div className="relative">
                                                                <div className="w-9 h-9 bg-gradient-to-br from-rose-400 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-md shadow-rose-500/20 group-hover:ring-2 ring-rose-50 dark:ring-rose-900/20 transition-all">
                                                                    {employee.name.charAt(0)}
                                                                </div>
                                                                <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 border-2 border-white dark:border-slate-800 rounded-full"></div>
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-bold text-slate-700 dark:text-slate-200 group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">{employee.name}</p>
                                                                <p className="text-[10px] font-medium text-slate-400 dark:text-slate-500 font-mono mt-0.5 tracking-tight">{employee.employeeId}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-3">
                                                        <div className="flex flex-col gap-1">
                                                            <span className="text-[11px] font-medium text-slate-600 dark:text-slate-300 flex items-center gap-1.5 group-hover:translate-x-0.5 transition-transform">
                                                                <div className="p-0.5 bg-slate-50 dark:bg-slate-800 rounded text-slate-400">
                                                                    <Mail className="w-2.5 h-2.5" />
                                                                </div>
                                                                {employee.email}
                                                            </span>
                                                            <span className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5 group-hover:translate-x-0.5 transition-transform delay-75">
                                                                <div className="p-0.5 bg-slate-50 dark:bg-slate-800 rounded text-slate-400">
                                                                    <Phone className="w-2.5 h-2.5" />
                                                                </div>
                                                                {employee.phone}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-3">
                                                        <div className="flex flex-col gap-0.5">
                                                            <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">{employee.designation}</span>
                                                            <span className="text-[10px] font-medium text-slate-500 flex items-center gap-1">
                                                                <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                                                                {employee.department}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-3">
                                                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded-full border shadow-sm ${employee.status === 'Active'
                                                            ? 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-900/20 dark:border-emerald-800 dark:text-emerald-400'
                                                            : 'bg-slate-50 text-slate-500 border-slate-100 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400'
                                                            }`}>
                                                            <span className={`w-1 h-1 rounded-full ${employee.status === 'Active' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`}></span>
                                                            {employee.status}
                                                        </span>
                                                    </td>

                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <div className="px-6 py-3 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-t border-slate-100 dark:border-slate-700/50 flex items-center justify-between text-[11px] font-medium text-slate-500">
                                    <span>Showing <span className="font-bold text-slate-800 dark:text-white">{filteredAndSortedEmployees.length}</span> employees</span>
                                    <div className="flex gap-2">
                                        <button className="px-2.5 py-1 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-rose-300 dark:hover:border-rose-700 hover:text-rose-600 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed" disabled>Previous</button>
                                        <button className="px-2.5 py-1 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-rose-300 dark:hover:border-rose-700 hover:text-rose-600 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed" disabled>Next</button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Import Modal */}
            {showImportModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
                            <div>
                                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Import Employees</h2>
                                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Upload a CSV or Excel file with employee data</p>
                            </div>
                            <button
                                onClick={() => setShowImportModal(false)}
                                className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            {/* File Upload Area */}
                            <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-8 text-center">
                                <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                                <p className="text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">
                                    Click to upload or drag and drop
                                </p>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                                    CSV or Excel files only (Max 10MB)
                                </p>
                                <input
                                    type="file"
                                    accept=".csv,.xlsx,.xls"
                                    onChange={(e) => {
                                        // Import implementation
                                        console.log('File selected:', e.target.files[0]);
                                    }}
                                    className="hidden"
                                    id="file-upload-input"
                                />
                                <label
                                    htmlFor="file-upload-input"
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white text-sm font-medium rounded-lg cursor-pointer transition-colors"
                                >
                                    <Upload className="w-4 h-4" />
                                    Choose File
                                </label>
                            </div>

                            {/* Format Instructions */}
                            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                                <h3 className="text-sm font-bold text-blue-900 dark:text-blue-300 mb-2 flex items-center gap-2">
                                    <FileText className="w-4 h-4" />
                                    Required CSV Format
                                </h3>
                                <p className="text-xs text-blue-800 dark:text-blue-400 mb-3">
                                    Your CSV file must include the following columns in this exact order:
                                </p>
                                <div className="bg-white dark:bg-slate-800 rounded border border-blue-200 dark:border-blue-700 p-3 overflow-x-auto">
                                    <table className="w-full text-xs">
                                        <thead>
                                            <tr className="border-b border-slate-200 dark:border-slate-700">
                                                <th className="text-left py-2 px-2 font-semibold text-slate-700 dark:text-slate-300">Column Name</th>
                                                <th className="text-left py-2 px-2 font-semibold text-slate-700 dark:text-slate-300">Example</th>
                                                <th className="text-left py-2 px-2 font-semibold text-slate-700 dark:text-slate-300">Required</th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-slate-600 dark:text-slate-400">
                                            <tr className="border-b border-slate-100 dark:border-slate-700/50">
                                                <td className="py-2 px-2 font-mono">firstName</td>
                                                <td className="py-2 px-2">John</td>
                                                <td className="py-2 px-2 text-red-600 dark:text-red-400">Yes</td>
                                            </tr>
                                            <tr className="border-b border-slate-100 dark:border-slate-700/50">
                                                <td className="py-2 px-2 font-mono">middleName</td>
                                                <td className="py-2 px-2">Michael</td>
                                                <td className="py-2 px-2">No</td>
                                            </tr>
                                            <tr className="border-b border-slate-100 dark:border-slate-700/50">
                                                <td className="py-2 px-2 font-mono">lastName</td>
                                                <td className="py-2 px-2">Doe</td>
                                                <td className="py-2 px-2 text-red-600 dark:text-red-400">Yes</td>
                                            </tr>
                                            <tr className="border-b border-slate-100 dark:border-slate-700/50">
                                                <td className="py-2 px-2 font-mono">employeeId</td>
                                                <td className="py-2 px-2">EMP001</td>
                                                <td className="py-2 px-2 text-red-600 dark:text-red-400">Yes</td>
                                            </tr>
                                            <tr className="border-b border-slate-100 dark:border-slate-700/50">
                                                <td className="py-2 px-2 font-mono">workEmail</td>
                                                <td className="py-2 px-2">john.doe@company.com</td>
                                                <td className="py-2 px-2 text-red-600 dark:text-red-400">Yes</td>
                                            </tr>
                                            <tr className="border-b border-slate-100 dark:border-slate-700/50">
                                                <td className="py-2 px-2 font-mono">mobileNumber</td>
                                                <td className="py-2 px-2">9876543210</td>
                                                <td className="py-2 px-2 text-red-600 dark:text-red-400">Yes</td>
                                            </tr>
                                            <tr className="border-b border-slate-100 dark:border-slate-700/50">
                                                <td className="py-2 px-2 font-mono">designation</td>
                                                <td className="py-2 px-2">Manager</td>
                                                <td className="py-2 px-2 text-red-600 dark:text-red-400">Yes</td>
                                            </tr>
                                            <tr className="border-b border-slate-100 dark:border-slate-700/50">
                                                <td className="py-2 px-2 font-mono">department</td>
                                                <td className="py-2 px-2">Engineering</td>
                                                <td className="py-2 px-2 text-red-600 dark:text-red-400">Yes</td>
                                            </tr>
                                            <tr className="border-b border-slate-100 dark:border-slate-700/50">
                                                <td className="py-2 px-2 font-mono">dateOfJoining</td>
                                                <td className="py-2 px-2">2024-01-15</td>
                                                <td className="py-2 px-2 text-red-600 dark:text-red-400">Yes</td>
                                            </tr>
                                            <tr className="border-b border-slate-100 dark:border-slate-700/50">
                                                <td className="py-2 px-2 font-mono">annualCtc</td>
                                                <td className="py-2 px-2">1200000</td>
                                                <td className="py-2 px-2 text-red-600 dark:text-red-400">Yes</td>
                                            </tr>
                                            <tr>
                                                <td className="py-2 px-2 font-mono">gender</td>
                                                <td className="py-2 px-2">Male/Female</td>
                                                <td className="py-2 px-2">No</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Download Template */}
                            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                                        <Download className="w-5 h-5 text-green-600 dark:text-green-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-slate-900 dark:text-white">Download Template</p>
                                        <p className="text-xs text-slate-600 dark:text-slate-400">Get a pre-formatted CSV template</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => {
                                        // Create and download template CSV
                                        const template = 'firstName,middleName,lastName,employeeId,workEmail,mobileNumber,designation,department,dateOfJoining,annualCtc,gender\\nJohn,Michael,Doe,EMP001,john.doe@company.com,9876543210,Manager,Engineering,2024-01-15,1200000,Male';
                                        const blob = new Blob([template], { type: 'text/csv' });
                                        const url = window.URL.createObjectURL(blob);
                                        const a = document.createElement('a');
                                        a.href = url;
                                        a.download = 'employee_import_template.csv';
                                        a.click();
                                    }}
                                    className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
                                >
                                    <Download className="w-4 h-4" />
                                    Download CSV Template
                                </button>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200 dark:border-slate-700">
                            <button
                                onClick={() => setShowImportModal(false)}
                                className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    // Import implementation
                                    setShowImportModal(false);
                                }}
                                className="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white text-sm font-medium rounded-lg transition-colors"
                            >
                                Import Employees
                            </button>
                        </div>
                    </div>
                </div>
            )}

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
                        <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
                            <button
                                type="button"
                                onClick={() => setShowMoreFilters(false)}
                                className="px-5 py-2 text-xs font-bold text-slate-900 dark:text-slate-200 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-600 transition-all shadow-sm"
                            >
                                Cancel
                            </button>
                            <Button
                                type="button"
                                onClick={handleApplyFilters}
                                className="px-5 py-2 text-xs font-bold text-white bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 rounded-lg shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all"
                            >
                                Apply Filters
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Create Custom View Modal */}
            {showCreateCustomView && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Create Custom View</h2>
                            <button
                                onClick={() => setShowCreateCustomView(false)}
                                className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            {/* View Name Input */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">
                                    View Name <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={newViewName}
                                    onChange={(e) => setNewViewName(e.target.value)}
                                    placeholder="e.g. Remote Engineers"
                                    className="w-full px-4 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                                    autoFocus
                                />
                            </div>

                            {/* Search Query Input (Optional) */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">
                                    Search Query <span className="text-xs font-normal text-slate-400">(Optional)</span>
                                </label>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                                    <input
                                        type="text"
                                        value={viewFilters.searchQuery}
                                        onChange={(e) => setViewFilters(prev => ({ ...prev, searchQuery: e.target.value }))}
                                        placeholder="e.g. Manager"
                                        className="w-full pl-9 pr-4 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                                    />
                                </div>
                            </div>

                            <div className="border-t border-slate-100 dark:border-slate-700 pt-4">
                                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4 uppercase tracking-wider">Configure Filters</h3>
                                <div className="space-y-4">
                                    {[
                                        { label: 'Work Location', key: 'workLocation', options: ['Head Office', 'Branch Office', 'Remote'] },
                                        { label: 'Department', key: 'department', options: ['Engineering', 'Product', 'Design', 'HR', 'Marketing'] },
                                        { label: 'Designation', key: 'designation', options: ['Senior Developer', 'Product Manager', 'UI/UX Designer', 'HR Manager', 'Marketing Manager'] },
                                        { label: 'Investment', key: 'investmentDeclaration', options: ['Submitted', 'Pending', 'Not Started'] },
                                        { label: 'Onboarding', key: 'onboardingStatus', options: ['Complete', 'Incomplete', 'Pending'] }
                                    ].map((field) => (
                                        <div key={field.key} className="grid grid-cols-3 gap-4 items-center">
                                            <label className="text-sm font-medium text-slate-600 dark:text-slate-300">{field.label}</label>
                                            <div className="col-span-2 relative">
                                                <select
                                                    value={viewFilters[field.key]}
                                                    onChange={(e) => setViewFilters(prev => ({ ...prev, [field.key]: e.target.value }))}
                                                    className="w-full appearance-none pl-3 pr-10 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500 bg-white dark:bg-slate-700 text-slate-700 dark:text-white"
                                                >
                                                    <option value="">Any</option>
                                                    {field.options.map(opt => (
                                                        <option key={opt} value={opt}>{opt}</option>
                                                    ))}
                                                </select>
                                                <ChevronRight className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none rotate-90" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
                            <button
                                type="button"
                                onClick={() => setShowCreateCustomView(false)}
                                className="px-5 py-2 text-xs font-bold text-slate-900 dark:text-slate-200 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-600 transition-all shadow-sm"
                            >
                                Cancel
                            </button>
                            <Button
                                type="button"
                                onClick={handleSaveCustomView}
                                disabled={!newViewName.trim()}
                                className="px-5 py-2 text-xs font-bold text-white bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 rounded-lg shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                                Save View
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
