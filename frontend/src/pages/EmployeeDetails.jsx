import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import {
    Users,
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
    DollarSign,
    FileCheck,
    X,
    Edit,
    MoreVertical,
    Mail,
    Phone,
    MapPin,
    Calendar,
    Building,
    User,
    AlertCircle,
    CheckCircle,
    Coins,
    ChevronDown,
    TrendingUp,
    TrendingDown
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/authService';
import AddComponentModal from '../components/AddComponentModal';

const TABS = [
    { id: 'overview', label: 'Overview' },
    { id: 'salary', label: 'Salary Details' },
    { id: 'investments', label: 'Investments' },
    { id: 'payslips', label: 'Payslips & Forms' },
    { id: 'loans', label: 'Loans' }
];

export default function EmployeeDetails() {
    const navigate = useNavigate();
    const { id } = useParams();
    const { user } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [showCompanyMenu, setShowCompanyMenu] = useState(false);
    const [showAddMenu, setShowAddMenu] = useState(false);
    const [showAddEarningModal, setShowAddEarningModal] = useState(false);
    const [showAddDeductionModal, setShowAddDeductionModal] = useState(false);
    const [organization, setOrganization] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');

    // Mock employee data - replace with API call
    const [employee] = useState({
        id: 1,
        employeeId: '01',
        name: 'kishore',
        designation: 'associate',
        department: 'Engineering',
        status: 'Active',
        email: 'admin@payrollpro.com',
        phone: '9487042778',
        workLocation: 'Head Office',
        dateOfJoining: '23/12/2025',
        gender: 'Male',
        portalAccess: false,
        professionalTax: false,
        dateOfBirth: '-',
        fatherName: '-',
        pan: '-',
        personalEmail: '-',
        residentialAddress: '-',
        differentlyAbledType: 'None',
        paymentMode: '-',
        annualCtc: 6000000,
        monthlyCtc: 50000,
        basicPercent: 50,
        hraPercent: 50,
        basic: 25000,
        hra: 12500,
        fixedAllowance: 12500
    });

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

    const renderTabContent = () => {
        switch (activeTab) {
            case 'overview':
                return <OverviewTab employee={employee} />;
            case 'salary':
                return <SalaryTab employee={employee} />;
            case 'investments':
                return <InvestmentsTab />;
            case 'payslips':
                return <PayslipsTab />;
            case 'loans':
                return <LoansTab />;
            default:
                return <OverviewTab employee={employee} />;
        }
    };

    return (
        <div className="h-screen bg-slate-50 flex overflow-hidden">
            {/* Sidebar */}
            <div
                className={`bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white flex flex-col fixed left-0 top-0 h-screen transition-all duration-300 shadow-2xl ${sidebarOpen ? 'w-56' : 'w-0'
                    }`}
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

                        {/* Navigation */}
                        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                            <Link to="/dashboard" className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-slate-700/50 text-slate-300 hover:text-white transition-all">
                                <LayoutDashboard className="w-5 h-5" />
                                <span>Dashboard</span>
                            </Link>

                            <Link to="/employees" className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md">
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
            <div
                className={`flex-1 min-w-0 flex flex-col h-screen transition-all duration-300 ${sidebarOpen ? 'ml-56' : 'ml-0'}`}
                style={{ width: sidebarOpen ? 'calc(100vw - 14rem)' : '100vw' }}
            >
                {/* Top Bar */}
                <div className="bg-white border-b border-slate-200 px-4 py-2 flex-shrink-0">
                    <div className="flex items-center justify-between min-w-0">
                        <div className="flex items-center gap-3 min-w-0">
                            {!sidebarOpen && (
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setSidebarOpen(true)}
                                    className="p-1.5"
                                >
                                    <Menu className="w-4 h-4 text-slate-600" />
                                </Button>
                            )}
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => navigate('/employees')}
                                className="text-slate-600 hover:text-slate-900"
                            >
                                ← Back to Employees
                            </Button>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                    setShowCompanyMenu(!showCompanyMenu);
                                    setShowProfileMenu(false);
                                }}
                                className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-50 rounded-md hover:bg-slate-100 border border-slate-200"
                            >
                                <span className="text-slate-700 font-medium text-xs">
                                    {loading ? 'Loading...' : (organization?.companyName || 'Company')}
                                </span>
                                <ChevronRight className="w-3 h-3 text-slate-400" />
                            </Button>

                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => {
                                    setShowProfileMenu(!showProfileMenu);
                                    setShowCompanyMenu(false);
                                }}
                                className="w-7 h-7 bg-rose-500 rounded-full flex items-center justify-center text-white font-medium text-xs p-0"
                            >
                                {user?.email?.charAt(0).toUpperCase()}
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Employee Header */}
                <div className="bg-white border-b border-slate-200 px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center text-rose-600 font-bold text-lg">
                                {employee.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <div className="flex items-center gap-3">
                                    <h1 className="text-xl font-bold text-slate-900">{employee.employeeId} - {employee.name}</h1>
                                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full">
                                        {employee.status}
                                    </span>
                                </div>
                                <p className="text-sm text-slate-600">{employee.designation}</p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            {/* Add Dropdown */}
                            <div className="relative">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="border-slate-300"
                                    onClick={() => setShowAddMenu(!showAddMenu)}
                                >
                                    Add
                                    <ChevronDown className="w-3 h-3 ml-1" />
                                </Button>

                                {showAddMenu && (
                                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-pink-100 py-2 z-50">
                                        <button
                                            onClick={() => {
                                                setShowAddEarningModal(true);
                                                setShowAddMenu(false);
                                            }}
                                            className="w-full flex items-center gap-2 px-4 py-2 hover:bg-emerald-50 rounded-lg transition-colors mx-2 text-left"
                                        >
                                            <TrendingUp className="w-4 h-4 text-emerald-600" />
                                            <span className="text-sm text-slate-700">Add Earning</span>
                                        </button>
                                        <button
                                            onClick={() => {
                                                setShowAddDeductionModal(true);
                                                setShowAddMenu(false);
                                            }}
                                            className="w-full flex items-center gap-2 px-4 py-2 hover:bg-red-50 rounded-lg transition-colors mx-2 text-left"
                                        >
                                            <TrendingDown className="w-4 h-4 text-red-600" />
                                            <span className="text-sm text-slate-700">Add Deduction</span>
                                        </button>
                                        <div className="border-t border-slate-100 my-1 mx-2"></div>
                                        <Link
                                            to="/salary-components"
                                            className="flex items-center gap-2 px-4 py-2 hover:bg-pink-50 rounded-lg transition-colors mx-2"
                                            onClick={() => setShowAddMenu(false)}
                                        >
                                            <Coins className="w-4 h-4 text-slate-600" />
                                            <span className="text-sm text-slate-700">Manage Components</span>
                                        </Link>
                                    </div>
                                )}
                            </div>

                            <Button variant="ghost" size="sm">
                                <MoreVertical className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => navigate('/employees')}>
                                <X className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="bg-white border-b border-slate-200 px-6">
                    <div className="flex gap-6">
                        {TABS.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === tab.id
                                    ? 'border-rose-500 text-rose-600'
                                    : 'border-transparent text-slate-600 hover:text-slate-900'
                                    }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 min-w-0">
                    {renderTabContent()}
                </div>
            </div>

            {/* Add Earning Modal */}
            {showAddEarningModal && (
                <AddComponentModal
                    employeeId={id}
                    type="EARNING"
                    onClose={() => setShowAddEarningModal(false)}
                    onSave={() => {
                        setShowAddEarningModal(false);
                    }}
                />
            )}

            {/* Add Deduction Modal */}
            {showAddDeductionModal && (
                <AddComponentModal
                    employeeId={id}
                    type="DEDUCTION"
                    onClose={() => setShowAddDeductionModal(false)}
                    onSave={() => {
                        setShowAddDeductionModal(false);
                    }}
                />
            )}
        </div>
    );
}

// Overview Tab Component
function OverviewTab({ employee }) {
    return (
        <div className="max-w-5xl space-y-6">
            {/* Incomplete Profile Alert */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                    <p className="text-sm text-yellow-800">
                        This employee's profile is incomplete. <button className="text-rose-600 hover:text-rose-700 font-medium">Complete now</button>
                    </p>
                </div>
            </div>

            {/* Basic Information */}
            <div className="bg-white rounded-lg border border-slate-200 p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-slate-900">Basic Information</h2>
                    <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                    </Button>
                </div>
                <div className="grid grid-cols-2 gap-x-12 gap-y-4">
                    <div>
                        <p className="text-xs text-slate-500 mb-1">Name</p>
                        <p className="text-sm text-slate-900">{employee.name}</p>
                    </div>
                    <div>
                        <p className="text-xs text-slate-500 mb-1">Work Location</p>
                        <p className="text-sm text-slate-900">{employee.workLocation}</p>
                    </div>
                    <div>
                        <p className="text-xs text-slate-500 mb-1">Email Address</p>
                        <p className="text-sm text-slate-900">{employee.email}</p>
                    </div>
                    <div>
                        <p className="text-xs text-slate-500 mb-1">Designation</p>
                        <p className="text-sm text-slate-900">{employee.designation}</p>
                    </div>
                    <div>
                        <p className="text-xs text-slate-500 mb-1">Mobile Number</p>
                        <p className="text-sm text-slate-900">{employee.phone}</p>
                    </div>
                    <div>
                        <p className="text-xs text-slate-500 mb-1">Departments</p>
                        <p className="text-sm text-slate-900">{employee.department}</p>
                    </div>
                    <div>
                        <p className="text-xs text-slate-500 mb-1">Date of Joining</p>
                        <p className="text-sm text-slate-900">{employee.dateOfJoining}</p>
                    </div>
                    <div>
                        <p className="text-xs text-slate-500 mb-1">Portal Access</p>
                        <p className="text-sm text-slate-900 flex items-center gap-1">
                            <X className="w-4 h-4 text-slate-400" />
                            Disabled <button className="text-rose-600 text-xs">(Enable)</button>
                        </p>
                    </div>
                    <div>
                        <p className="text-xs text-slate-500 mb-1">Gender</p>
                        <p className="text-sm text-slate-900">{employee.gender}</p>
                    </div>
                </div>
            </div>

            {/* Statutory Information */}
            <div className="bg-white rounded-lg border border-slate-200 p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-slate-900">Statutory Information</h2>
                    <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                    </Button>
                </div>
                <div className="grid grid-cols-2 gap-x-12 gap-y-4">
                    <div>
                        <p className="text-xs text-slate-500 mb-1">Professional Tax</p>
                        <p className="text-sm text-slate-900 flex items-center gap-1">
                            <X className="w-4 h-4 text-slate-400" />
                            Disabled <button className="text-rose-600 text-xs">(Enable)</button>
                        </p>
                    </div>
                </div>
            </div>

            {/* Personal Information */}
            <div className="bg-white rounded-lg border border-slate-200 p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-slate-900">Personal Information</h2>
                    <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                    </Button>
                </div>
                <div className="grid grid-cols-2 gap-x-12 gap-y-4">
                    <div>
                        <p className="text-xs text-slate-500 mb-1">Date of Birth</p>
                        <p className="text-sm text-slate-900">{employee.dateOfBirth}</p>
                    </div>
                    <div>
                        <p className="text-xs text-slate-500 mb-1">Email Address</p>
                        <p className="text-sm text-slate-900">{employee.personalEmail}</p>
                    </div>
                    <div>
                        <p className="text-xs text-slate-500 mb-1">Father's Name</p>
                        <p className="text-sm text-slate-900">{employee.fatherName}</p>
                    </div>
                    <div>
                        <p className="text-xs text-slate-500 mb-1">Residential Address</p>
                        <p className="text-sm text-slate-900">{employee.residentialAddress}</p>
                    </div>
                    <div>
                        <p className="text-xs text-slate-500 mb-1">PAN</p>
                        <p className="text-sm text-slate-900">{employee.pan}</p>
                    </div>
                    <div>
                        <p className="text-xs text-slate-500 mb-1">Differently Abled Type</p>
                        <p className="text-sm text-slate-900">{employee.differentlyAbledType}</p>
                    </div>
                </div>
            </div>

            {/* Payment Information */}
            <div className="bg-white rounded-lg border border-slate-200 p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-slate-900">Payment Information</h2>
                    <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                    </Button>
                </div>
                <div className="grid grid-cols-2 gap-x-12 gap-y-4">
                    <div>
                        <p className="text-xs text-slate-500 mb-1">Payment Mode</p>
                        <p className="text-sm text-slate-900">{employee.paymentMode}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Salary Tab Component
function SalaryTab({ employee }) {
    return (
        <div className="max-w-5xl space-y-6">
            {/* Incomplete Profile Alert */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                    <p className="text-sm text-yellow-800">
                        This employee's profile is incomplete. <button className="text-rose-600 hover:text-rose-700 font-medium">Complete now</button>
                    </p>
                </div>
            </div>

            {/* Salary Details */}
            <div className="bg-white rounded-lg border border-slate-200 p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-bold text-slate-900">Salary Details</h2>
                    <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                    </Button>
                </div>
                <div className="grid grid-cols-2 gap-8 mb-8">
                    <div>
                        <p className="text-sm text-slate-500 mb-1">Annual CTC</p>
                        <p className="text-2xl font-bold text-slate-900">₹{employee.annualCtc.toLocaleString()}.00 per year</p>
                    </div>
                    <div>
                        <p className="text-sm text-slate-500 mb-1">Monthly CTC</p>
                        <p className="text-2xl font-bold text-slate-900">₹{employee.monthlyCtc.toLocaleString()}.00 per month</p>
                    </div>
                </div>
            </div>

            {/* Salary Structure */}
            <div className="bg-white rounded-lg border border-slate-200 p-6">
                <h2 className="text-lg font-bold text-slate-900 mb-6">Salary Structure</h2>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Salary Components</th>
                                <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600 uppercase">Monthly Amount</th>
                                <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600 uppercase">Annual Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            <tr>
                                <td colSpan="3" className="px-4 py-2 text-sm font-semibold text-slate-700 bg-slate-50">Earnings</td>
                            </tr>
                            <tr>
                                <td className="px-4 py-3">
                                    <div className="text-sm text-slate-900">Basic</div>
                                    <div className="text-xs text-slate-500">({employee.basicPercent}.00 % of CTC)</div>
                                </td>
                                <td className="px-4 py-3 text-right text-sm text-slate-900">₹{employee.basic.toLocaleString()}.00</td>
                                <td className="px-4 py-3 text-right text-sm text-slate-900">₹{(employee.basic * 12).toLocaleString()}.00</td>
                            </tr>
                            <tr>
                                <td className="px-4 py-3">
                                    <div className="text-sm text-slate-900">House Rent Allowance</div>
                                    <div className="text-xs text-slate-500">({employee.hraPercent}.00 % of Basic Amount)</div>
                                </td>
                                <td className="px-4 py-3 text-right text-sm text-slate-900">₹{employee.hra.toLocaleString()}.00</td>
                                <td className="px-4 py-3 text-right text-sm text-slate-900">₹{(employee.hra * 12).toLocaleString()}.00</td>
                            </tr>
                            <tr>
                                <td className="px-4 py-3">
                                    <div className="text-sm text-slate-900">Fixed Allowance</div>
                                </td>
                                <td className="px-4 py-3 text-right text-sm text-slate-900">₹{employee.fixedAllowance.toLocaleString()}.00</td>
                                <td className="px-4 py-3 text-right text-sm text-slate-900">₹{(employee.fixedAllowance * 12).toLocaleString()}.00</td>
                            </tr>
                            <tr className="bg-slate-50 font-semibold">
                                <td className="px-4 py-3 text-sm text-slate-900">Cost to Company</td>
                                <td className="px-4 py-3 text-right text-sm text-slate-900">₹{employee.monthlyCtc.toLocaleString()}.00</td>
                                <td className="px-4 py-3 text-right text-sm text-slate-900">₹{employee.annualCtc.toLocaleString()}.00</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Perquisites */}
            <div className="bg-white rounded-lg border border-slate-200 p-6">
                <h2 className="text-lg font-bold text-slate-900 mb-4">Perquisites</h2>
                <div>
                    <p className="text-sm text-slate-500 mb-1">Additional Benefits</p>
                    <p className="text-lg font-semibold text-slate-900">₹0.00 <button className="text-sm text-rose-600 hover:text-rose-700 ml-2">View Details ›</button></p>
                </div>
            </div>
        </div>
    );
}

// Investments Tab
function InvestmentsTab() {
    return (
        <div className="max-w-5xl">
            <div className="bg-white rounded-lg border border-slate-200 p-12 text-center">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileCheck className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">No Investments</h3>
                <p className="text-sm text-slate-500">Investment declarations will appear here</p>
            </div>
        </div>
    );
}

// Payslips Tab
function PayslipsTab() {
    return (
        <div className="max-w-5xl">
            <div className="bg-white rounded-lg border border-slate-200 p-12 text-center">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Receipt className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">No Payslips</h3>
                <p className="text-sm text-slate-500">Payslips and forms will appear here</p>
            </div>
        </div>
    );
}

// Loans Tab
function LoansTab() {
    return (
        <div className="max-w-5xl">
            <div className="bg-white rounded-lg border border-slate-200 p-12 text-center">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Wallet className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">No Loans</h3>
                <p className="text-sm text-slate-500">Employee loans will appear here</p>
            </div>
        </div>
    );
}
