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
    TrendingDown,
    PieChart,
    Gift,
    FileText,
    Download,
    Trash,
    Plus,
    Save
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/authService';
import AddComponentModal from '../components/AddComponentModal';
import AppHeader from '../components/AppHeader';
import { useTheme } from '../contexts/ThemeContext';
import { ArrowLeft } from 'lucide-react';

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
    const { user, logout } = useAuth();
    const { darkMode } = useTheme();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [showCompanyMenu, setShowCompanyMenu] = useState(false);
    const [showAddMenu, setShowAddMenu] = useState(false);
    const [showAddEarningModal, setShowAddEarningModal] = useState(false);
    const [showAddDeductionModal, setShowAddDeductionModal] = useState(false);
    const [showEditBasicInfoModal, setShowEditBasicInfoModal] = useState(false);
    const [showEditPersonalInfoModal, setShowEditPersonalInfoModal] = useState(false);
    const [showEditPaymentInfoModal, setShowEditPaymentInfoModal] = useState(false);
    const [showEditSalaryInfoModal, setShowEditSalaryInfoModal] = useState(false);
    const [organization, setOrganization] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');
    const [salaryBreakdown, setSalaryBreakdown] = useState(null);

    // Mock employee data - replace with API call
    // Initial state with defaults
    const [employee, setEmployee] = useState({
        id: null,
        employeeId: '',
        name: '',
        designation: '-',
        department: '-',
        status: 'Active',
        email: '-',
        phone: '-',
        workLocation: '-',
        dateOfJoining: '-',
        gender: '-',
        portalAccess: false,
        professionalTax: false,
        dateOfBirth: '-',
        fatherName: '-',
        pan: '-',
        personalEmail: '-',
        residentialAddress: '-',
        differentlyAbledType: 'None',
        paymentMode: '-',
        annualCtc: 0,
        monthlyCtc: 0,
        basicPercent: 50,
        hraPercent: 50,
        basic: 0,
        hra: 0,
        fixedAllowance: 0,
        // Payment Info
        bankName: '-',
        accountNumber: '-',
        ifscCode: '-'
    });

    // Fetch Data Function
    const refreshEmployeeData = async (isBackground = false) => {
        if (!isBackground) setLoading(true);
        try {
            // 1. Fetch Organization
            const selectedOrgId = localStorage.getItem('selectedOrganizationId');
            if (!selectedOrgId) {
                window.location.href = '/select-organization';
                return;
            }

            const orgResponse = await api.get('/organizations');
            if (orgResponse.data && orgResponse.data.length > 0) {
                const selectedOrg = orgResponse.data.find(org => org.id === parseInt(selectedOrgId));
                if (selectedOrg) {
                    setOrganization(selectedOrg);
                } else {
                    setOrganization(orgResponse.data[0]);
                    localStorage.setItem('selectedOrganizationId', orgResponse.data[0].id);
                }
            }

            // 2. Fetch Employee Details
            if (id) {
                const empResponse = await api.get(`/employees/${id}`);
                const data = empResponse.data;

                // 3. Fetch Salary Breakdown
                try {
                    const breakdownResponse = await api.get(`/employees/${id}/salary-breakdown`);
                    setSalaryBreakdown(breakdownResponse.data);
                } catch (err) {
                    console.error('Error fetching breakdown:', err);
                }

                // Construct address string
                const addressParts = [
                    data.addressLine1,
                    data.addressLine2,
                    data.city,
                    data.state,
                    data.pinCode
                ].filter(Boolean);
                const fullAddress = addressParts.length > 0 ? addressParts.join(', ') : (data.address || '-');

                setEmployee({
                    ...data, // Spread original DTO to ensure we have all keys for payload construction
                    id: data.id,
                    employeeId: data.employeeId || '-',
                    name: data.fullName || `${data.firstName || ''} ${data.lastName || ''}`.trim(),
                    designation: data.designation || '-',
                    department: data.department || '-',
                    status: data.status || 'Active',
                    email: data.workEmail || '-',
                    phone: data.mobileNumber || '-',
                    workLocation: data.workLocation || '-',
                    dateOfJoining: data.dateOfJoining || '-',
                    gender: data.gender || '-',
                    portalAccess: data.enablePortalAccess || false,
                    professionalTax: data.professionalTax || false,
                    dateOfBirth: data.dateOfBirth || '-',
                    fatherName: data.fatherName || '-', // Fallback to avoid null
                    personalEmail: data.personalEmail || '-',
                    address: data.address || '',
                    residentialAddress: fullAddress, // Kept for display if needed, but 'address' is used for editing
                    differentlyAbledType: data.differentlyAbledType || 'None',
                    paymentMode: data.paymentMethod || '-', // Display key
                    paymentMethod: data.paymentMethod || 'Direct Deposit', // Edit/Payload key
                    panNumber: data.panNumber || '', // Edit/Payload key
                    pan: data.panNumber || '-', // Display key (legacy)

                    // Salary keys
                    annualCtc: data.annualCtc || 0,
                    monthlyCtc: (data.annualCtc || 0) / 12,
                    basicPercentOfCtc: data.basicPercentOfCtc || 50, // Payload key
                    basicPercent: data.basicPercentOfCtc || 50, // Display key
                    hraPercentOfBasic: data.hraPercentOfBasic || 50, // Payload key
                    hraPercent: data.hraPercentOfBasic || 50, // Display key

                    basic: data.basicMonthly || 0,
                    hra: data.hraMonthly || 0,
                    fixedAllowance: data.fixedAllowanceMonthly || 0,

                    // Bank
                    bankName: data.bankName || '',
                    accountNumber: data.accountNumber || '',
                    ifscCode: data.ifscCode || ''
                });

                // DEBUG: Confirm Scan
                if (data.professionalTax !== undefined) {
                    console.log(`Debug: Refreshed Data. PT Enabled: ${data.professionalTax}`);
                }
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            alert("Failed to refresh data: " + (error.message || "Unknown error"));
        } finally {
            if (!isBackground) setLoading(false);
        }
    };

    // Initial Fetch
    useEffect(() => {
        refreshEmployeeData();
    }, [id]);

    // Generic Update Handler
    const handleUpdateEmployee = async (updatedFields) => {
        try {
            const updatedEmployee = { ...employee, ...updatedFields };

            // DEBUG: Verify PT Update Payload
            if (updatedFields.professionalTax !== undefined) {
                alert(`Debug: Updating PT. New Value being sent: ${updatedFields.professionalTax}`);
            }

            // Helper to handle Date formats
            const formatDate = (d) => {
                if (!d) return null;
                if (Array.isArray(d)) {
                    const [y, m, dVal] = d;
                    return `${y}-${String(m).padStart(2, '0')}-${String(dVal).padStart(2, '0')}`;
                }
                return d;
            };

            // Construct Payload
            const payload = {
                firstName: updatedEmployee.firstName || "",
                middleName: updatedEmployee.middleName || "",
                lastName: updatedEmployee.lastName || "",
                employeeId: updatedEmployee.employeeId,
                dateOfJoining: formatDate(updatedEmployee.dateOfJoining),
                workEmail: updatedEmployee.workEmail || "",
                mobileNumber: updatedEmployee.mobileNumber || "",
                isDirector: updatedEmployee.isDirector,
                gender: updatedEmployee.gender,
                workLocation: updatedEmployee.workLocation,
                designation: updatedEmployee.designation,
                department: updatedEmployee.department,
                enablePortalAccess: updatedEmployee.enablePortalAccess,
                professionalTax: updatedEmployee.professionalTax,

                // Salary
                annualCtc: updatedEmployee.annualCtc,
                basicPercentOfCtc: updatedEmployee.basicPercentOfCtc,
                hraPercentOfBasic: updatedEmployee.hraPercentOfBasic,
                conveyanceAllowanceMonthly: updatedEmployee.conveyanceAllowanceMonthly,
                basicMonthly: updatedEmployee.basicMonthly,
                hraMonthly: updatedEmployee.hraMonthly,
                fixedAllowanceMonthly: updatedEmployee.fixedAllowanceMonthly,

                // Personal
                dateOfBirth: formatDate(updatedEmployee.dateOfBirth),
                age: updatedEmployee.age,
                fatherName: updatedEmployee.fatherName || "",
                personalEmail: updatedEmployee.personalEmail || "",
                differentlyAbledType: updatedEmployee.differentlyAbledType || "none",
                address: updatedEmployee.address || "",
                addressLine1: updatedEmployee.addressLine1 || "",
                addressLine2: updatedEmployee.addressLine2 || "",
                city: updatedEmployee.city || "",
                state: updatedEmployee.state || "",
                pinCode: updatedEmployee.pinCode || "",

                // Emergency
                emergencyContact: updatedEmployee.emergencyContact || "",
                emergencyContactName: updatedEmployee.emergencyContactName || "",

                // Payment
                bankName: updatedEmployee.bankName || "",
                accountNumber: updatedEmployee.accountNumber || "",
                ifscCode: updatedEmployee.ifscCode || "",
                paymentMethod: updatedEmployee.paymentMethod || "",
                panNumber: updatedEmployee.panNumber || "",
                aadharNumber: updatedEmployee.aadharNumber || "",

                organizationId: updatedEmployee.organizationId
            };

            console.log("Updating Employee Payload:", payload);

            await api.put(`/employees/${id}`, payload);

            // Refresh all data from backend to ensure consistency
            await refreshEmployeeData();

            return true; // Success
        } catch (err) {
            console.error("Error updating employee:", err);
            if (err.response?.data) {
                console.error("Server Error Details:", err.response.data);
            }
            const errorMsg = err.response?.data?.error || err.response?.data?.message || err.message;
            alert(`Failed to update: ${typeof errorMsg === 'object' ? JSON.stringify(errorMsg) : errorMsg}`);
            return false;
        }
    };

    const handleTogglePT = async () => {
        await handleUpdateEmployee({ professionalTax: !employee.professionalTax });
    };

    const handleCompleteProfile = (step = 1) => {
        navigate(`/employees/add?edit=${employee.id}&step=${step}`);
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case 'overview':
                return <OverviewTab
                    employee={employee}
                    onTogglePT={handleTogglePT}
                    onEditBasicInfo={() => setShowEditBasicInfoModal(true)}
                    onEditPersonalInfo={() => setShowEditPersonalInfoModal(true)}
                    onEditPaymentInfo={() => setShowEditPaymentInfoModal(true)}
                    onCompleteProfile={() => handleCompleteProfile(1)}
                />;
            case 'salary':
                return <SalaryTab
                    employee={employee}
                    salaryBreakdown={salaryBreakdown}
                    onEditSalaryInfo={() => setShowEditSalaryInfoModal(true)}
                    onCompleteProfile={() => handleCompleteProfile(2)}
                />;
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
        <div className="h-screen bg-slate-50 dark:bg-slate-900 flex overflow-hidden">
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
                        <nav className="flex-1 p-4 space-y-6 overflow-y-auto scrollbar-hide">
                            {/* Main Section */}
                            <div className="space-y-1">
                                <div className="px-3 mb-2">
                                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Main</span>
                                </div>
                                <Link to="/dashboard" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-700/50 text-slate-300 hover:text-white transition-all group">
                                    <LayoutDashboard className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                    <span className="font-medium">Dashboard</span>
                                </Link>

                                <Link to="/employees" className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg shadow-pink-500/30">
                                    <Users className="w-5 h-5" />
                                    <span className="font-medium">Employees</span>
                                </Link>
                            </div>

                            {/* Payroll Section */}
                            <div className="space-y-1">
                                <div className="px-3 mb-2">
                                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Payroll</span>
                                </div>
                                <Link to="/pay-runs" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-700/50 text-slate-300 hover:text-white transition-all group">
                                    <Calendar className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                    <span className="font-medium">Pay Runs</span>
                                </Link>

                                <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-700/50 text-slate-300 hover:text-white transition-all cursor-pointer group">
                                    <CheckCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                    <span className="font-medium">Approvals</span>
                                    <ChevronRight className="w-4 h-4 ml-auto opacity-50" />
                                </div>

                                <Link to="/form16" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-700/50 text-slate-300 hover:text-white transition-all group">
                                    <FileText className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                    <span className="font-medium">Form 16</span>
                                </Link>
                            </div>

                            {/* Benefits Section */}
                            <div className="space-y-1">
                                <div className="px-3 mb-2">
                                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Benefits</span>
                                </div>
                                <Link to="/loans" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-700/50 text-slate-300 hover:text-white transition-all group">
                                    <Wallet className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                    <span className="font-medium">Loans</span>
                                </Link>

                                <Link to="/giving" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-700/50 text-slate-300 hover:text-white transition-all group">
                                    <Gift className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                    <span className="font-medium">Giving</span>
                                </Link>
                            </div>

                            {/* Management Section */}
                            <div className="space-y-1">
                                <div className="px-3 mb-2">
                                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Management</span>
                                </div>
                                <Link to="/documents" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-700/50 text-slate-300 hover:text-white transition-all group">
                                    <FolderOpen className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                    <span className="font-medium">Documents</span>
                                </Link>

                                <Link to="/reports" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-700/50 text-slate-300 hover:text-white transition-all group">
                                    <PieChart className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                    <span className="font-medium">Reports</span>
                                </Link>

                                <Link to="/settings" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-700/50 text-slate-300 hover:text-white transition-all group">
                                    <Settings className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                    <span className="font-medium">Settings</span>
                                </Link>
                            </div>
                        </nav>
                    </>
                )}
            </div>

            {/* Main Content */}
            <div
                className={`flex-1 min-w-0 flex flex-col h-screen transition-all duration-300 ${sidebarOpen ? 'ml-56' : 'ml-0'}`}
                style={{ width: sidebarOpen ? 'calc(100vw - 14rem)' : '100vw' }}
            >
                {/* Top Bar - Using AppHeader */}
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

                {/* Employee Header */}
                <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            {/* Sleek Back Button */}
                            <button
                                onClick={() => navigate('/employees')}
                                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors group"
                                title="Back to Employees"
                            >
                                <ArrowLeft className="w-5 h-5 text-slate-500 dark:text-slate-400 group-hover:text-pink-600 transition-colors" />
                            </button>
                            <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center text-rose-600 font-bold text-lg">
                                {(employee.fullName || employee.firstName || employee.fatherName || '?').charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <div className="flex items-center gap-3">
                                    <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                                        {employee.employeeId} - {employee.fullName || `${employee.firstName || ''} ${employee.lastName || ''}`.trim() || employee.fatherName || 'Unknown'}
                                    </h1>
                                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full">
                                        {employee.status}
                                    </span>
                                </div>
                                <p className="text-sm text-slate-600 dark:text-slate-400">{employee.designation}</p>
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
                <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-6">
                    <div className="flex gap-6">
                        {TABS.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === tab.id
                                    ? 'border-rose-500 text-rose-600'
                                    : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
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

            {/* Edit Basic Info Modal */}
            {showEditBasicInfoModal && (
                <EditBasicInfoModal
                    employee={employee}
                    onClose={() => setShowEditBasicInfoModal(false)}
                    onSave={async (updatedData) => {
                        const success = await handleUpdateEmployee(updatedData);
                        if (success) setShowEditBasicInfoModal(false);
                    }}
                />
            )}

            {/* Edit Personal Info Modal */}
            {showEditPersonalInfoModal && (
                <EditPersonalInfoModal
                    employee={employee}
                    onClose={() => setShowEditPersonalInfoModal(false)}
                    onSave={async (updatedData) => {
                        const success = await handleUpdateEmployee(updatedData);
                        if (success) setShowEditPersonalInfoModal(false);
                    }}
                />
            )}

            {/* Edit Payment Info Modal */}
            {showEditPaymentInfoModal && (
                <EditPaymentInfoModal
                    employee={employee}
                    onClose={() => setShowEditPaymentInfoModal(false)}
                    onSave={async (updatedData) => {
                        const success = await handleUpdateEmployee(updatedData);
                        if (success) setShowEditPaymentInfoModal(false);
                    }}
                />
            )}

            {/* Edit Salary Info Modal */}
            {showEditSalaryInfoModal && (
                <EditSalaryInfoModal
                    employee={employee}
                    refreshData={refreshEmployeeData}
                    onClose={() => setShowEditSalaryInfoModal(false)}
                    onSave={async (updatedData) => {
                        const success = await handleUpdateEmployee(updatedData);
                        if (success) setShowEditSalaryInfoModal(false);
                    }}
                />
            )}
        </div>
    );
}

function EditBasicInfoModal({ employee, onClose, onSave }) {
    const [formData, setFormData] = React.useState({
        firstName: employee.firstName || '',
        middleName: employee.middleName || '',
        lastName: employee.lastName || '',
        workEmail: employee.workEmail || '',
        mobileNumber: employee.mobileNumber || '',
        designation: employee.designation || '',
        department: employee.department || '',
        workLocation: employee.workLocation || ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <h2 className="text-lg font-bold text-slate-800">Edit Basic Information</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">First Name</label>
                            <input
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all"
                                placeholder="First Name"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Middle Name</label>
                            <input
                                name="middleName"
                                value={formData.middleName}
                                onChange={handleChange}
                                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all"
                                placeholder="Middle Name"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Last Name</label>
                            <input
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all"
                                placeholder="Last Name"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Work Email</label>
                            <input
                                name="workEmail"
                                value={formData.workEmail}
                                onChange={handleChange}
                                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all"
                                placeholder="email@company.com"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Mobile Number</label>
                            <input
                                name="mobileNumber"
                                value={formData.mobileNumber}
                                onChange={handleChange}
                                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all"
                                placeholder="+91 0000000000"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Designation</label>
                            <input
                                name="designation"
                                value={formData.designation}
                                onChange={handleChange}
                                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all"
                                placeholder="e.g. Senior Developer"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Department</label>
                            <input
                                name="department"
                                value={formData.department}
                                onChange={handleChange}
                                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all"
                                placeholder="e.g. Engineering"
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Work Location</label>
                        <input
                            name="workLocation"
                            value={formData.workLocation}
                            onChange={handleChange}
                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all"
                            placeholder="e.g. Bangalore"
                        />
                    </div>

                    <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-sm font-medium text-white bg-pink-600 hover:bg-pink-700 rounded-lg shadow-sm shadow-pink-200 transition-all"
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// Overview Tab Component
function OverviewTab({ employee, onTogglePT, onEditBasicInfo, onEditPersonalInfo, onEditPaymentInfo, onCompleteProfile }) {
    return (
        <div className="max-w-5xl space-y-6">
            {/* Incomplete Profile Alert */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                    <p className="text-sm text-yellow-800">
                        This employee's profile is incomplete. <button onClick={onCompleteProfile} className="text-rose-600 hover:text-rose-700 font-medium">Complete now</button>
                    </p>
                </div>
            </div>

            {/* Basic Information */}
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">Basic Information</h2>
                    <Button variant="ghost" size="sm" onClick={onEditBasicInfo}>
                        <Edit className="w-4 h-4" />
                    </Button>
                </div>
                <div className="grid grid-cols-2 gap-x-12 gap-y-4">
                    <div>
                        <p className="text-xs text-slate-500 mb-1">Name</p>
                        <p className="text-sm text-slate-900 dark:text-white">
                            {employee.fullName || `${employee.firstName || ''} ${employee.lastName || ''}`.trim() || employee.fatherName || '-'}
                        </p>
                    </div>
                    <div>
                        <p className="text-xs text-slate-500 mb-1">Work Location</p>
                        <p className="text-sm text-slate-900 dark:text-white">{employee.workLocation || '-'}</p>
                    </div>
                    <div>
                        <p className="text-xs text-slate-500 mb-1">Email Address</p>
                        <p className="text-sm text-slate-900 dark:text-white">{employee.workEmail || '-'}</p>
                    </div>
                    <div>
                        <p className="text-xs text-slate-500 mb-1">Designation</p>
                        <p className="text-sm text-slate-900 dark:text-white">{employee.designation || '-'}</p>
                    </div>
                    <div>
                        <p className="text-xs text-slate-500 mb-1">Mobile Number</p>
                        <p className="text-sm text-slate-900 dark:text-white">{employee.mobileNumber || '-'}</p>
                    </div>
                    <div>
                        <p className="text-xs text-slate-500 mb-1">Departments</p>
                        <p className="text-sm text-slate-900 dark:text-white">{employee.department || '-'}</p>
                    </div>
                    <div>
                        <p className="text-xs text-slate-500 mb-1">Date of Joining</p>
                        <p className="text-sm text-slate-900 dark:text-white">
                            {Array.isArray(employee.dateOfJoining)
                                ? `${employee.dateOfJoining[0]}-${String(employee.dateOfJoining[1]).padStart(2, '0')}-${String(employee.dateOfJoining[2]).padStart(2, '0')}`
                                : employee.dateOfJoining}
                        </p>
                    </div>
                    <div>
                        <p className="text-xs text-slate-500 mb-1">Portal Access</p>
                        <p className="text-sm text-slate-900 dark:text-white flex items-center gap-1">
                            <X className="w-4 h-4 text-slate-400" />
                            Disabled <button className="text-rose-600 text-xs">(Enable)</button>
                        </p>
                    </div>
                    <div>
                        <p className="text-xs text-slate-500 mb-1">Gender</p>
                        <p className="text-sm text-slate-900 dark:text-white">{employee.gender}</p>
                    </div>
                </div>
            </div>

            {/* Statutory Information */}
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">Statutory Information</h2>
                    <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                    </Button>
                </div>
                <div className="grid grid-cols-2 gap-x-12 gap-y-4">
                    <div>
                        <p className="text-xs text-slate-500 mb-1">Professional Tax</p>
                        <p className="text-sm text-slate-900 dark:text-white flex items-center gap-1">
                            {employee?.professionalTax ? (
                                <>
                                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                                    <span>Enabled</span>
                                    <button
                                        onClick={onTogglePT}
                                        className="text-slate-400 text-xs hover:text-rose-600 ml-1 underline decoration-dotted"
                                    >
                                        (Disable)
                                    </button>
                                </>
                            ) : (
                                <>
                                    <X className="w-4 h-4 text-slate-400" />
                                    <span>Disabled</span>
                                    <button
                                        onClick={onTogglePT}
                                        className="text-rose-600 text-xs font-medium hover:text-rose-700 ml-1 underline decoration-dotted"
                                    >
                                        (Enable)
                                    </button>
                                </>
                            )}
                        </p>
                    </div>
                </div>
            </div>

            {/* Personal Information */}
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">Personal Information</h2>
                    <Button variant="ghost" size="sm" onClick={onEditPersonalInfo}>
                        <Edit className="w-4 h-4" />
                    </Button>
                </div>
                <div className="grid grid-cols-2 gap-x-12 gap-y-4">
                    <div>
                        <p className="text-xs text-slate-500 mb-1">Date of Birth</p>
                        <p className="text-sm text-slate-900 dark:text-white">{employee.dateOfBirth}</p>
                    </div>
                    <div>
                        <p className="text-xs text-slate-500 mb-1">Email Address</p>
                        <p className="text-sm text-slate-900 dark:text-white">{employee.personalEmail}</p>
                    </div>
                    <div>
                        <p className="text-xs text-slate-500 mb-1">Father's Name</p>
                        <p className="text-sm text-slate-900 dark:text-white">{employee.fatherName}</p>
                    </div>
                    <div>
                        <p className="text-xs text-slate-500 mb-1">Residential Address</p>
                        <p className="text-sm text-slate-900 dark:text-white">{employee.address || '-'}</p>
                    </div>
                    <div>
                        <p className="text-xs text-slate-500 mb-1">PAN</p>
                        <p className="text-sm text-slate-900 dark:text-white">{employee.panNumber || '-'}</p>
                    </div>
                    <div>
                        <p className="text-xs text-slate-500 mb-1">Differently Abled Type</p>
                        <p className="text-sm text-slate-900 dark:text-white">{employee.differentlyAbledType || 'None'}</p>
                    </div>
                </div>
            </div>

            {/* Payment Information */}
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">Payment Information</h2>
                    <Button variant="ghost" size="sm" onClick={onEditPaymentInfo}>
                        <Edit className="w-4 h-4" />
                    </Button>
                </div>
                <div className="grid grid-cols-2 gap-x-12 gap-y-4">
                    <div>
                        <p className="text-xs text-slate-500 mb-1">Payment Mode</p>
                        <p className="text-sm text-slate-900 dark:text-white">{employee.paymentMethod || '-'}</p>
                    </div>
                    <div>
                        <p className="text-xs text-slate-500 mb-1">Bank Name</p>
                        <p className="text-sm text-slate-900 dark:text-white">{employee.bankName || '-'}</p>
                    </div>
                    <div>
                        <p className="text-xs text-slate-500 mb-1">Account Number</p>
                        <p className="text-sm text-slate-900 dark:text-white">{employee.accountNumber || '-'}</p>
                    </div>
                    <div>
                        <p className="text-xs text-slate-500 mb-1">IFSC Code</p>
                        <p className="text-sm text-slate-900 dark:text-white">{employee.ifscCode || '-'}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}


// Salary Tab Component
// Salary Tab Component
function SalaryTab({ employee, salaryBreakdown, onEditSalaryInfo, onCompleteProfile }) {

    // Safety check for breakdown data
    const earnings = salaryBreakdown?.earnings || [];
    const deductions = salaryBreakdown?.deductions || [];
    const totalDeductions = salaryBreakdown?.totalDeductions || 0;

    // Calculate approximate net salary if breakdown is missing basic/HRA/fixed
    // If breakdown is present, it should ideally have the full netSalary.
    // If we are mixing modes (hardcoded + components), we do:
    // Net = Monthly CTC (Employee Obj) - Total Deductions (Breakdown)
    const netSalary = (employee.monthlyCtc || 0) - totalDeductions;

    return (
        <div className="max-w-5xl space-y-6">
            {/* Incomplete Profile Alert */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                    <p className="text-sm text-yellow-800">
                        This employee's profile is incomplete. <button onClick={onCompleteProfile} className="text-rose-600 hover:text-rose-700 font-medium">Complete now</button>
                    </p>
                </div>
            </div>

            {/* Compensation Overview */}
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">Compensation Overview</h2>
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" onClick={onEditSalaryInfo}>
                            <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" className="gap-2">
                            <Download className="w-4 h-4" />
                            Download Structure
                        </Button>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-8 mb-8">
                    <div>
                        <p className="text-sm text-slate-500 mb-1">Annual CTC</p>
                        <p className="text-2xl font-bold text-slate-900 dark:text-white">₹{employee.annualCtc.toLocaleString()}.00 per year</p>
                    </div>
                    <div>
                        <p className="text-sm text-slate-500 mb-1">Monthly CTC</p>
                        <p className="text-2xl font-bold text-slate-900 dark:text-white">₹{employee.monthlyCtc.toLocaleString()}.00 per month</p>
                    </div>
                </div>
            </div>

            {/* Salary Structure */}
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Salary Structure</h2>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase">Salary Components</th>
                                <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase">Monthly Amount</th>
                                <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase">Annual Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {/* Standard Earnings */}
                            <tr>
                                <td colSpan="3" className="px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-700">Earnings</td>
                            </tr>
                            <tr>
                                <td className="px-4 py-3">
                                    <div className="text-sm text-slate-900 dark:text-white">Basic</div>
                                    <div className="text-xs text-slate-500">({employee.basicPercent}.00 % of CTC)</div>
                                </td>
                                <td className="px-4 py-3 text-right text-sm text-slate-900 dark:text-white">₹{employee.basic.toLocaleString()}.00</td>
                                <td className="px-4 py-3 text-right text-sm text-slate-900 dark:text-white">₹{(employee.basic * 12).toLocaleString()}.00</td>
                            </tr>
                            <tr>
                                <td className="px-4 py-3">
                                    <div className="text-sm text-slate-900 dark:text-white">House Rent Allowance</div>
                                    <div className="text-xs text-slate-500">({employee.hraPercent}.00 % of Basic Amount)</div>
                                </td>
                                <td className="px-4 py-3 text-right text-sm text-slate-900 dark:text-white">₹{employee.hra.toLocaleString()}.00</td>
                                <td className="px-4 py-3 text-right text-sm text-slate-900 dark:text-white">₹{(employee.hra * 12).toLocaleString()}.00</td>
                            </tr>
                            <tr>
                                <td className="px-4 py-3">
                                    <div className="text-sm text-slate-900 dark:text-white">Fixed Allowance</div>
                                </td>
                                <td className="px-4 py-3 text-right text-sm text-slate-900 dark:text-white">₹{employee.fixedAllowance.toLocaleString()}.00</td>
                                <td className="px-4 py-3 text-right text-sm text-slate-900 dark:text-white">₹{(employee.fixedAllowance * 12).toLocaleString()}.00</td>
                            </tr>

                            {/* Additional Earnings from Breakdown */}
                            {earnings.map(earning => (
                                <tr key={earning.componentCode}>
                                    <td className="px-4 py-3">
                                        <div className="text-sm text-slate-900">{earning.componentName}</div>
                                        <div className="text-xs text-slate-500">({earning.calculationType === 'PERCENTAGE' ? '% based' : 'Fixed'})</div>
                                    </td>
                                    <td className="px-4 py-3 text-right text-sm text-slate-900">₹{earning.calculatedAmount?.toLocaleString()}</td>
                                    <td className="px-4 py-3 text-right text-sm text-slate-900">₹{(earning.calculatedAmount * 12)?.toLocaleString()}</td>
                                </tr>
                            ))}

                            {/* Deductions */}
                            {deductions.length > 0 && (
                                <>
                                    <tr>
                                        <td colSpan="3" className="px-4 py-2 text-sm font-semibold text-slate-700 bg-slate-50">Deductions</td>
                                    </tr>
                                    {deductions.map(deduction => (
                                        <tr key={deduction.componentCode}>
                                            <td className="px-4 py-3">
                                                <div className="text-sm text-slate-900">{deduction.componentName}</div>
                                                <div className="text-xs text-slate-500">{deduction.componentCode} ({deduction.calculationType === 'PERCENTAGE' ? '% based' : 'Fixed'})</div>
                                            </td>
                                            <td className="px-4 py-3 text-right text-sm text-red-600">- ₹{deduction.calculatedAmount?.toLocaleString()}</td>
                                            <td className="px-4 py-3 text-right text-sm text-red-600">- ₹{(deduction.calculatedAmount * 12)?.toLocaleString()}</td>
                                        </tr>
                                    ))}
                                </>
                            )}

                            {/* Totals */}
                            <tr className="bg-slate-50 font-semibold border-t-2 border-slate-200">
                                <td className="px-4 py-3 text-sm text-slate-900">Cost to Company (CTC)</td>
                                <td className="px-4 py-3 text-right text-sm text-slate-900">₹{employee.monthlyCtc.toLocaleString()}.00</td>
                                <td className="px-4 py-3 text-right text-sm text-slate-900">₹{employee.annualCtc.toLocaleString()}.00</td>
                            </tr>
                            {totalDeductions > 0 && (
                                <tr className="font-semibold text-red-700 bg-red-50/30">
                                    <td className="px-4 py-3 text-sm">Total Deductions</td>
                                    <td className="px-4 py-3 text-right text-sm">- ₹{totalDeductions.toLocaleString()}</td>
                                    <td className="px-4 py-3 text-right text-sm">- ₹{(totalDeductions * 12).toLocaleString()}</td>
                                </tr>
                            )}
                            <tr className="font-bold text-emerald-800 bg-emerald-50 border-t border-emerald-100">
                                <td className="px-4 py-3 text-sm">Net Pay (Take Home)</td>
                                <td className="px-4 py-3 text-right text-sm">₹{netSalary.toLocaleString()}</td>
                                <td className="px-4 py-3 text-right text-sm">₹{(netSalary * 12).toLocaleString()}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Perquisites */}
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Perquisites</h2>
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
    // Mock Data
    const declarations = [
        { section: '80C', title: 'Life Insurance Premium', amount: 0, maxOffset: 150000 },
        { section: '80C', title: 'Public Provident Fund (PPF)', amount: 0, maxOffset: 150000 },
        { section: '80D', title: 'Medical Insurance', amount: 0, maxOffset: 25000 },
        { section: '24(b)', title: 'Home Loan Interest', amount: 0, maxOffset: 200000 },
    ];

    return (
        <div className="max-w-5xl space-y-6">
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">Tax Saving Investments</h2>
                    <Button variant="outline" className="gap-2">
                        <Edit className="w-4 h-4" />
                        Edit Declarations
                    </Button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase w-24">Section</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Investment Type</th>
                                <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600 uppercase">Max Limit</th>
                                <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600 uppercase">Declared Amount</th>
                                <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600 uppercase">Accepted Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {declarations.map((item, idx) => (
                                <tr key={idx} className="hover:bg-slate-50/50">
                                    <td className="px-4 py-3 text-sm font-medium text-slate-600">{item.section}</td>
                                    <td className="px-4 py-3 text-sm text-slate-900">{item.title}</td>
                                    <td className="px-4 py-3 text-right text-sm text-slate-500">₹{item.maxOffset.toLocaleString()}</td>
                                    <td className="px-4 py-3 text-right text-sm font-medium text-slate-900">₹{item.amount.toLocaleString()}</td>
                                    <td className="px-4 py-3 text-right text-sm text-slate-500">₹0</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex justify-between items-center text-sm text-slate-500">
                    <p>Total Taxable Income will be calculated after verified investment proofs.</p>
                </div>
            </div>
        </div>
    );
}

// Payslips Tab
function PayslipsTab() {
    const payslips = [
        // Mock Data
    ];

    return (
        <div className="max-w-5xl space-y-6">
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">Payslip History</h2>
                    <div className="flex gap-2">
                        <select className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-pink-500/20">
                            <option>FY 2024-25</option>
                            <option>FY 2023-24</option>
                        </select>
                    </div>
                </div>

                {payslips.length > 0 ? (
                    <table className="w-full">
                        {/* Table Header */}
                    </table>
                ) : (
                    <div className="text-center py-12 bg-slate-50/50 rounded-lg border border-slate-100 border-dashed">
                        <Receipt className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                        <h3 className="text-slate-900 font-medium mb-1">No Payslips Generated</h3>
                        <p className="text-slate-500 text-sm">Payslips will appear here once payroll is run.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

// Loans Tab
function LoansTab() {
    return (
        <div className="max-w-5xl space-y-6">
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">Active Loans</h2>
                    <Button variant="outline" className="gap-2">
                        <Plus className="w-4 h-4" />
                        New Loan Request
                    </Button>
                </div>

                <div className="text-center py-12 bg-slate-50/50 rounded-lg border border-slate-100 border-dashed">
                    <Wallet className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                    <h3 className="text-slate-900 font-medium mb-1">No Active Loans</h3>
                    <p className="text-slate-500 text-sm">There are no active loans or advances for this employee.</p>
                </div>
            </div>
        </div>
    );
}

function EditPersonalInfoModal({ employee, onClose, onSave }) {
    const [formData, setFormData] = React.useState({
        dateOfBirth: employee.dateOfBirth ? (Array.isArray(employee.dateOfBirth) ?
            `${employee.dateOfBirth[0]}-${String(employee.dateOfBirth[1]).padStart(2, '0')}-${String(employee.dateOfBirth[2]).padStart(2, '0')}`
            : employee.dateOfBirth) : '',
        fatherName: employee.fatherName || '',
        personalEmail: employee.personalEmail || '',
        address: employee.address || '',
        panNumber: employee.panNumber || ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <h2 className="text-lg font-bold text-slate-800">Edit Personal Information</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Date of Birth</label>
                            <input
                                type="date"
                                name="dateOfBirth"
                                value={formData.dateOfBirth}
                                onChange={handleChange}
                                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Father's Name</label>
                            <input
                                name="fatherName"
                                value={formData.fatherName}
                                onChange={handleChange}
                                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all"
                                placeholder="Father Name"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Personal Email</label>
                            <input
                                type="email"
                                name="personalEmail"
                                value={formData.personalEmail}
                                onChange={handleChange}
                                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all"
                                placeholder="personal@email.com"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">PAN Number</label>
                            <input
                                name="panNumber"
                                value={formData.panNumber}
                                onChange={handleChange}
                                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all"
                                placeholder="PAN"
                            />
                        </div>
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Residential Address</label>
                        <textarea
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            rows={3}
                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all resize-none"
                            placeholder="Full Address"
                        />
                    </div>
                    <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors">Cancel</button>
                        <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-pink-600 hover:bg-pink-700 rounded-lg shadow-sm shadow-pink-200 transition-all">Save Changes</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

function EditPaymentInfoModal({ employee, onClose, onSave }) {
    const [formData, setFormData] = React.useState({
        bankName: employee.bankName || '',
        accountNumber: employee.accountNumber || '',
        ifscCode: employee.ifscCode || '',
        paymentMethod: employee.paymentMethod || 'Direct Deposit'
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <h2 className="text-lg font-bold text-slate-800">Edit Payment Information</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Bank Name</label>
                            <input name="bankName" value={formData.bankName} onChange={handleChange} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all" />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Account Number</label>
                            <input name="accountNumber" value={formData.accountNumber} onChange={handleChange} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all" />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">IFSC Code</label>
                            <input name="ifscCode" value={formData.ifscCode} onChange={handleChange} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all" />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Payment Method</label>
                            <select name="paymentMethod" value={formData.paymentMethod} onChange={handleChange} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all">
                                <option value="Direct Deposit">Direct Deposit</option>
                                <option value="Check">Check</option>
                                <option value="Cash">Cash</option>
                            </select>
                        </div>
                    </div>
                    <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors">Cancel</button>
                        <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-pink-600 hover:bg-pink-700 rounded-lg shadow-sm shadow-pink-200 transition-all">Save Changes</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

function EditSalaryInfoModal({ employee, onClose, onSave, refreshData }) {
    const [formData, setFormData] = React.useState({
        annualCtc: employee.annualCtc || 0,
        basicPercentOfCtc: employee.basicPercentOfCtc || 50,
        hraPercentOfBasic: employee.hraPercentOfBasic || 50
    });

    // Component Management State
    const [loading, setLoading] = React.useState(true);
    const [assignedComponents, setAssignedComponents] = React.useState([]);
    const [masterEarnings, setMasterEarnings] = React.useState([]);
    const [masterDeductions, setMasterDeductions] = React.useState([]);

    // Temporary states for new entries
    const [newEarningId, setNewEarningId] = React.useState("");
    const [newEarningAmount, setNewEarningAmount] = React.useState("");
    const [newDeductionId, setNewDeductionId] = React.useState("");
    const [newDeductionAmount, setNewDeductionAmount] = React.useState("");

    React.useEffect(() => {
        const fetchComponents = async () => {
            try {
                if (!employee.organizationId) return;

                // Fetch Master Components
                const masterRes = await api.get(`/salary-components?organizationId=${employee.organizationId}`);
                if (masterRes.data) {
                    setMasterEarnings(masterRes.data.filter(c => c.type === 'EARNING' && !c.isStatutory));
                    setMasterDeductions(masterRes.data.filter(c => c.type === 'DEDUCTION' && !c.isStatutory));
                }

                // Fetch Assigned Components
                const assignedRes = await api.get(`/employees/${employee.id}/salary-components`);
                if (assignedRes.data) {
                    setAssignedComponents(assignedRes.data);
                }
            } catch (err) {
                console.error("Error fetching components:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchComponents();
    }, [employee.id, employee.organizationId]);

    const refreshLists = async () => {
        try {
            const assignedRes = await api.get(`/employees/${employee.id}/salary-components`);
            setAssignedComponents(assignedRes.data);
            if (refreshData) refreshData(true); // Trigger background refresh of parent data
        } catch (err) {
            console.error("Error refreshing list:", err);
        }
    };

    const handleAddComponent = async (id, amount, setId, setAmount) => {
        if (!id || !amount) return;
        try {
            await api.post(`/employees/${employee.id}/salary-components`, {
                componentId: parseInt(id),
                value: parseFloat(amount),
                isActive: true
            });
            setId("");
            setAmount("");
            refreshLists();
        } catch (err) {
            alert("Failed to add component.");
        }
    };

    const handleUpdateValue = async (id, value) => {
        try {
            await api.put(`/employee-salary-components/${id}`, {
                value: parseFloat(value),
                isActive: true
            });
            refreshLists();
        } catch (err) {
            console.error("Update failed", err);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Remove this component?")) return;
        try {
            await api.delete(`/employee-salary-components/${id}`);
            refreshLists();
        } catch (err) {
            alert("Failed to delete.");
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <h2 className="text-lg font-bold text-slate-800">Edit Salary Structure</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-8">
                    {/* Core Parameters */}
                    <form id="coreForm" onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Annual CTC</label>
                            <div className="relative">
                                <span className="absolute left-3 top-2 text-slate-400">₹</span>
                                <input type="number" name="annualCtc" value={formData.annualCtc} onChange={handleChange} className="w-full pl-8 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all" />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Basic % of CTC</label>
                                <input type="number" name="basicPercentOfCtc" value={formData.basicPercentOfCtc} onChange={handleChange} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all" />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">HRA % of Basic</label>
                                <input type="number" name="hraPercentOfBasic" value={formData.hraPercentOfBasic} onChange={handleChange} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all" />
                            </div>
                        </div>
                    </form>

                    <div className="border-t border-slate-100 pt-6">
                        <h3 className="text-sm font-bold text-slate-900 mb-4">Allowances & Earnings</h3>

                        {/* List Assigned Earnings */}
                        <div className="space-y-2 mb-4">
                            {assignedComponents.filter(c => c.componentName && c.componentType === 'EARNING').map((comp) => (
                                <div key={comp.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                                    <span className="flex-1 text-sm font-medium text-slate-700">{comp.componentName}</span>
                                    <div className="relative w-32">
                                        <span className="absolute left-2 top-1.5 text-slate-400 text-xs">₹</span>
                                        <input
                                            type="number"
                                            defaultValue={comp.value}
                                            onBlur={(e) => handleUpdateValue(comp.id, e.target.value)}
                                            className="w-full pl-6 pr-2 py-1 bg-white border border-slate-200 rounded text-sm"
                                        />
                                    </div>
                                    <button onClick={() => handleDelete(comp.id)} className="text-slate-400 hover:text-rose-500">
                                        <Trash className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Add Earning */}
                        <div className="flex gap-2">
                            <select
                                value={newEarningId}
                                onChange={(e) => setNewEarningId(e.target.value)}
                                className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm"
                            >
                                <option value="">Select Allowance...</option>
                                {masterEarnings.map(m => (
                                    <option key={m.id} value={m.id}>{m.name}</option>
                                ))}
                            </select>
                            <input
                                type="number"
                                placeholder="Amount"
                                value={newEarningAmount}
                                onChange={(e) => setNewEarningAmount(e.target.value)}
                                className="w-32 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm"
                            />
                            <button
                                onClick={() => handleAddComponent(newEarningId, newEarningAmount, setNewEarningId, setNewEarningAmount)}
                                disabled={!newEarningId || !newEarningAmount}
                                className="p-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50"
                            >
                                <Plus className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    <div className="border-t border-slate-100 pt-6">
                        <h3 className="text-sm font-bold text-slate-900 mb-4">Deductions</h3>

                        {/* List Assigned Deductions */}
                        <div className="space-y-2 mb-4">
                            {assignedComponents.filter(c => c.componentType === 'DEDUCTION').map((comp) => (
                                <div key={comp.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                                    <span className="flex-1 text-sm font-medium text-slate-700">{comp.componentName}</span>
                                    <div className="relative w-32">
                                        <span className="absolute left-2 top-1.5 text-slate-400 text-xs">₹</span>
                                        <input
                                            type="number"
                                            defaultValue={comp.value}
                                            onBlur={(e) => handleUpdateValue(comp.id, e.target.value)}
                                            className="w-full pl-6 pr-2 py-1 bg-white border border-slate-200 rounded text-sm"
                                        />
                                    </div>
                                    <button onClick={() => handleDelete(comp.id)} className="text-slate-400 hover:text-rose-500">
                                        <Trash className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Add Deduction */}
                        <div className="flex gap-2">
                            <select
                                value={newDeductionId}
                                onChange={(e) => setNewDeductionId(e.target.value)}
                                className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm"
                            >
                                <option value="">Select Deduction...</option>
                                {masterDeductions.map(m => (
                                    <option key={m.id} value={m.id}>{m.name}</option>
                                ))}
                            </select>
                            <input
                                type="number"
                                placeholder="Amount"
                                value={newDeductionAmount}
                                onChange={(e) => setNewDeductionAmount(e.target.value)}
                                className="w-32 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm"
                            />
                            <button
                                onClick={() => handleAddComponent(newDeductionId, newDeductionAmount, setNewDeductionId, setNewDeductionAmount)}
                                disabled={!newDeductionId || !newDeductionAmount}
                                className="p-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 disabled:opacity-50"
                            >
                                <Plus className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-end gap-3 bg-slate-50/50">
                    <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors">Close</button>
                    <button type="submit" form="coreForm" className="px-4 py-2 text-sm font-medium text-white bg-pink-600 hover:bg-pink-700 rounded-lg shadow-sm shadow-pink-200 transition-all flex items-center gap-2">
                        <Save className="w-4 h-4" />
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
}
