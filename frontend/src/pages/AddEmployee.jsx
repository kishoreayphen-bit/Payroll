import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import {
    ArrowRight,
    Check,
    User,
    DollarSign,
    FileText,
    CreditCard,
    X,
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
    Search,
    Bell,
    LogOut,
    Building,
    FileCheck,
    Calendar,
    PieChart
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Checkbox } from '../components/ui/checkbox';
import { Select } from '../components/ui/select';
import { Radio } from '../components/ui/radio';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { api } from '../services/authService';

const STEPS = [
    { id: 1, name: 'Basic Details', icon: User },
    { id: 2, name: 'Salary Details', icon: DollarSign },
    { id: 3, name: 'Personal Details', icon: FileText },
    { id: 4, name: 'Payment Information', icon: CreditCard }
];

export default function AddEmployee() {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const { darkMode } = useTheme();
    const [searchParams] = useSearchParams();
    const editEmployeeId = searchParams.get('edit');
    const stepParam = searchParams.get('step');
    const isEditMode = !!editEmployeeId;

    const [currentStep, setCurrentStep] = useState(stepParam ? parseInt(stepParam) : 1);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [showCompanyMenu, setShowCompanyMenu] = useState(false);
    const [organization, setOrganization] = useState(null);
    const [loading, setLoading] = useState(true);
    const [employeeData, setEmployeeData] = useState(null);

    const { register, handleSubmit, formState: { errors }, watch, setValue, reset } = useForm({
        defaultValues: {
            firstName: '',
            middleName: '',
            lastName: '',
            employeeId: '',
            dateOfJoining: '',
            workEmail: '',
            mobileNumber: '',
            isDirector: false,
            gender: '',
            workLocation: '',
            designation: '',
            department: '',
            enablePortalAccess: false,
            professionalTax: true,
            annualCtc: '',
            basicPercentOfCtc: 50,
            hraPercentOfBasic: 50,
            conveyanceAllowanceMonthly: '',
            basicMonthly: '',
            hraMonthly: '',
            fixedAllowanceMonthly: '',
            dateOfBirth: '',
            age: '',
            fatherName: '',
            personalEmail: '',
            differentlyAbledType: 'none',
            address: '',
            addressLine1: '',
            addressLine2: '',
            city: '',
            state: '',
            pinCode: '',
            emergencyContact: '',
            emergencyContactName: '',
            bankName: '',
            accountNumber: '',
            ifscCode: '',
            paymentMethod: 'bank_transfer',
            panNumber: '',
            aadharNumber: ''
        }
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

    // Fetch employee data if in edit mode
    useEffect(() => {
        const fetchEmployeeData = async () => {
            if (!isEditMode || !editEmployeeId || editEmployeeId === 'undefined' || editEmployeeId === 'null') {
                console.warn('Invalid Edit ID:', editEmployeeId);
                return;
            }

            console.log('Fetching data for employee:', editEmployeeId);

            try {
                const response = await api.get(`/employees/${editEmployeeId}`);
                const employee = response.data;

                // Fetch salary breakdown to get component details if needed
                // const breakdownRes = await api.get(`/employees/${editEmployeeId}/salary-breakdown`);

                const mappedData = {
                    firstName: employee.firstName || '',
                    middleName: employee.middleName || '',
                    lastName: employee.lastName || '',
                    employeeId: employee.employeeId || '',
                    dateOfJoining: employee.dateOfJoining || '',
                    workEmail: employee.workEmail || '',
                    mobileNumber: employee.mobileNumber || '',
                    isDirector: employee.isDirector || false,
                    gender: employee.gender || '',
                    workLocation: employee.workLocation || '',
                    designation: employee.designation || '',
                    department: employee.department || '',
                    enablePortalAccess: employee.enablePortalAccess || false,
                    professionalTax: employee.professionalTax !== undefined ? employee.professionalTax : true,

                    // Salary
                    annualCtc: employee.annualCtc || '',
                    basicPercentOfCtc: employee.basicPercentOfCtc || 50,
                    hraPercentOfBasic: employee.hraPercentOfBasic || 50,
                    conveyanceAllowanceMonthly: employee.conveyanceAllowanceMonthly || '',
                    basicMonthly: employee.basicMonthly || '',
                    hraMonthly: employee.hraMonthly || '',
                    fixedAllowanceMonthly: employee.fixedAllowanceMonthly || '',

                    // Personal
                    dateOfBirth: employee.dateOfBirth || '',
                    age: employee.age || '',
                    fatherName: employee.fatherName || '',
                    personalEmail: employee.personalEmail || '',
                    differentlyAbledType: employee.differentlyAbledType || 'none',
                    address: employee.address || '',
                    addressLine1: employee.addressLine1 || '',
                    addressLine2: employee.addressLine2 || '',
                    city: employee.city || '',
                    state: employee.state || '',
                    pinCode: employee.pinCode || '',

                    // Emergency
                    emergencyContact: employee.emergencyContact || '',
                    emergencyContactName: employee.emergencyContactName || '',

                    // Payment
                    bankName: employee.bankName || '',
                    accountNumber: employee.accountNumber || '',
                    ifscCode: employee.ifscCode || '',
                    paymentMethod: employee.paymentMethod || 'bank_transfer',
                    panNumber: employee.panNumber || '',
                    aadharNumber: employee.aadharNumber || ''
                };

                setEmployeeData(mappedData);

                // Pre-fill form
                Object.keys(mappedData).forEach(key => {
                    setValue(key, mappedData[key]);
                });

            } catch (error) {
                console.error('Error fetching employee data:', error);
                alert('Failed to load employee data');
            }
        };

        fetchEmployeeData();
    }, [isEditMode, editEmployeeId, setValue]);

    const onSubmit = async (data) => {
        try {
            const selectedOrgId = localStorage.getItem('selectedOrganizationId');

            if (!selectedOrgId) {
                alert('Please select an organization first');
                navigate('/select-organization');
                return;
            }

            // Prepare employee data
            const employeeData = {
                ...data,
                organizationId: parseInt(selectedOrgId)
            };

            if (isEditMode) {
                // Update existing employee
                const response = await api.put(`/employees/${editEmployeeId}`, employeeData);
                console.log('Employee updated:', response.data);
                alert('Employee updated successfully!');
                navigate(`/employees/${editEmployeeId}`);
            } else {
                // Create new employee
                const response = await api.post('/employees', employeeData);
                console.log('Employee created:', response.data);
                alert('Employee added successfully!');
                navigate('/employees');
            }
        } catch (error) {
            console.error('Error saving employee:', error);
            const errorMessage = error.response?.data?.error || 'Failed to save employee. Please try again.';
            alert(errorMessage);
        }
    };

    const nextStep = () => {
        if (currentStep < STEPS.length) {
            setCurrentStep(currentStep + 1);
        }
    };

    const prevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return <BasicDetailsStep register={register} errors={errors} />;
            case 2:
                return <SalaryDetailsStep register={register} errors={errors} watch={watch} setValue={setValue} />;
            case 3:
                return <PersonalDetailsStep register={register} errors={errors} watch={watch} setValue={setValue} />;
            case 4:
                return <PaymentInformationStep register={register} errors={errors} watch={watch} />;
            default:
                return null;
        }
    };

    return (
        <div className="h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-white dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 flex overflow-hidden">
            {/* Sidebar */}
            <div
                className={`bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white flex flex-col fixed left-0 top-0 h-screen transition-all duration-300 shadow-2xl ${sidebarOpen ? 'w-56' : 'w-0'
                    }`}
                style={{ overflow: sidebarOpen ? 'visible' : 'hidden' }}
            >
                {sidebarOpen && (
                    <>
                        {/* Logo and Close Button */}
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
                                title="Close sidebar"
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
                                    <Shield className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                    <span className="font-medium">Approvals</span>
                                    <ChevronRight className="w-4 h-4 ml-auto opacity-50" />
                                </div>

                                <Link to="/form16" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-700/50 text-slate-300 hover:text-white transition-all group">
                                    <FileCheck className="w-5 h-5 group-hover:scale-110 transition-transform" />
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
                                    <Heart className="w-5 h-5 group-hover:scale-110 transition-transform" />
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
            <div className={`flex-1 flex flex-col h-screen transition-all duration-300 ${sidebarOpen ? 'ml-56' : 'ml-0'}`}>
                {/* Top Bar */}
                <div className="bg-white/80 backdrop-blur-md border-b border-pink-100 px-4 py-2.5 flex-shrink-0 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 flex-1">
                            {!sidebarOpen && (
                                <button
                                    onClick={() => setSidebarOpen(true)}
                                    className="p-1.5 hover:bg-pink-50 rounded-lg transition-colors"
                                    title="Open sidebar"
                                >
                                    <Menu className="w-4 h-4 text-slate-600" />
                                </button>
                            )}
                            <h1 className="text-xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
                                {isEditMode ? 'Edit Employee' : 'Add Employee'}
                            </h1>
                        </div>
                        <div className="flex items-center gap-2">
                            {/* Close Button */}
                            <button
                                onClick={() => navigate(isEditMode ? `/employees/${editEmployeeId}` : '/employees')}
                                className="p-2 hover:bg-pink-50 rounded-lg transition-colors"
                                title={isEditMode ? "Close and return to employee details" : "Close and return to employee list"}
                            >
                                <X className="w-5 h-5 text-slate-600" />
                            </button>

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

                            {/* Profile Dropdown */}
                            <div className="relative">
                                <button
                                    onClick={() => {
                                        setShowProfileMenu(!showProfileMenu);
                                        setShowCompanyMenu(false);
                                    }}
                                    className="w-8 h-8 bg-gradient-to-br from-pink-500 to-rose-600 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-lg hover:shadow-xl transition-shadow"
                                >
                                    {user?.email?.charAt(0).toUpperCase()}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Form Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {/* Stepper */}
                    <div className="max-w-4xl mx-auto mb-8">
                        <div className="flex items-center justify-between">
                            {STEPS.map((step, index) => {
                                const Icon = step.icon;
                                const isActive = currentStep === step.id;
                                const isCompleted = currentStep > step.id;

                                return (
                                    <React.Fragment key={step.id}>
                                        <div className="flex flex-col items-center gap-2">
                                            <div className={`
                                                w-10 h-10 rounded-full flex items-center justify-center transition-all
                                                ${isActive ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-lg shadow-pink-500/30' : ''}
                                                ${isCompleted ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white' : ''}
                                                ${!isActive && !isCompleted ? 'bg-slate-200 text-slate-400' : ''}
                                            `}>
                                                {isCompleted ? (
                                                    <Check className="w-5 h-5" />
                                                ) : (
                                                    <Icon className="w-5 h-5" />
                                                )}
                                            </div>
                                            <p className={`text-xs font-semibold ${isActive ? 'text-pink-600' : 'text-slate-600 dark:text-slate-400'}`}>
                                                {step.name}
                                            </p>
                                        </div>
                                        {index < STEPS.length - 1 && (
                                            <div className={`flex-1 h-0.5 mx-4 transition-all ${currentStep > step.id ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-slate-200'
                                                }`} />
                                        )}
                                    </React.Fragment>
                                );
                            })}
                        </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit(onSubmit)} className="max-w-4xl mx-auto">
                        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-pink-100 dark:border-slate-700 p-6 mb-6">
                            {renderStepContent()}
                        </div>

                        {/* Navigation Buttons */}
                        <div className="flex items-center justify-between">
                            <div>
                                {currentStep > 1 && (
                                    <Button
                                        type="button"
                                        onClick={prevStep}
                                        className="border-2 border-pink-600 text-pink-600 bg-pink-50 hover:bg-pink-100"
                                    >
                                        Previous
                                    </Button>
                                )}
                            </div>
                            <div className="flex gap-3">
                                {currentStep < STEPS.length ? (
                                    <Button
                                        type="button"
                                        onClick={nextStep}
                                        className="bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white shadow-lg shadow-pink-500/30"
                                    >
                                        Next
                                        <ArrowRight className="w-4 h-4 ml-2" />
                                    </Button>
                                ) : (
                                    <Button
                                        type="submit"
                                        className="bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white shadow-lg shadow-pink-500/30"
                                    >
                                        <Check className="w-4 h-4 mr-2" />
                                        Save Employee
                                    </Button>
                                )}
                            </div>
                        </div>

                        <p className="text-xs text-pink-600 text-right mt-4">* indicates mandatory fields</p>
                    </form>
                </div>
            </div>
        </div>
    );
}

// Step Components (same as before)
function BasicDetailsStep({ register, errors }) {
    return (
        <div className="space-y-6">
            <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">
                    Employee Name <span className="text-pink-600">*</span>
                </label>
                <div className="grid grid-cols-3 gap-4">
                    <Input
                        {...register('firstName', { required: 'First name is required' })}
                        placeholder="First Name"
                        className="border-pink-200 focus:ring-pink-500 focus:border-pink-500"
                    />
                    <Input
                        {...register('middleName')}
                        placeholder="Middle Name"
                        className="border-pink-200 focus:ring-pink-500 focus:border-pink-500"
                    />
                    <Input
                        {...register('lastName', { required: 'Last name is required' })}
                        placeholder="Last Name"
                        className="border-pink-200 focus:ring-pink-500 focus:border-pink-500"
                    />
                </div>
                {errors.firstName && <p className="text-xs text-red-500 mt-1">{errors.firstName.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Employee ID <span className="text-pink-600">*</span>
                    </label>
                    <Input
                        {...register('employeeId', { required: 'Employee ID is required' })}
                        placeholder="Enter Employee ID"
                        className="border-pink-200 focus:ring-pink-500 focus:border-pink-500"
                    />
                    {errors.employeeId && <p className="text-xs text-red-500 mt-1">{errors.employeeId.message}</p>}
                </div>
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Date of Joining <span className="text-pink-600">*</span>
                    </label>
                    <Input
                        type="date"
                        {...register('dateOfJoining', { required: 'Date of joining is required' })}
                        className="border-pink-200 focus:ring-pink-500 focus:border-pink-500"
                    />
                    {errors.dateOfJoining && <p className="text-xs text-red-500 mt-1">{errors.dateOfJoining.message}</p>}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Work Email <span className="text-pink-600">*</span>
                    </label>
                    <Input
                        type="email"
                        {...register('workEmail', {
                            required: 'Work email is required',
                            pattern: {
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                message: 'Invalid email address'
                            }
                        })}
                        placeholder="abc@xyz.com"
                        className="border-pink-200 focus:ring-pink-500 focus:border-pink-500"
                    />
                    {errors.workEmail && <p className="text-xs text-red-500 mt-1">{errors.workEmail.message}</p>}
                </div>
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Mobile Number
                    </label>
                    <Input
                        type="tel"
                        {...register('mobileNumber')}
                        placeholder="Enter Mobile Number"
                        className="border-pink-200 focus:ring-pink-500 focus:border-pink-500"
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Gender <span className="text-pink-600">*</span>
                    </label>
                    <Select
                        {...register('gender', { required: 'Gender is required' })}
                        className="w-full px-3 py-2 border border-pink-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                    >
                        <option value="">Select</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                    </Select>
                    {errors.gender && <p className="text-xs text-red-500 mt-1">{errors.gender.message}</p>}
                </div>
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Work Location <span className="text-pink-600">*</span>
                    </label>
                    <Select
                        {...register('workLocation', { required: 'Work location is required' })}
                        className="w-full px-3 py-2 border border-pink-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                    >
                        <option value="">Select</option>
                        <option value="head-office">Head Office</option>
                        <option value="branch-1">Branch 1</option>
                        <option value="branch-2">Branch 2</option>
                        <option value="remote">Remote</option>
                    </Select>
                    {errors.workLocation && <p className="text-xs text-red-500 mt-1">{errors.workLocation.message}</p>}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Designation <span className="text-pink-600">*</span>
                    </label>
                    <Select
                        {...register('designation', { required: 'Designation is required' })}
                        className="w-full px-3 py-2 border border-pink-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                    >
                        <option value="">Select</option>
                        <option value="manager">Manager</option>
                        <option value="developer">Developer</option>
                        <option value="designer">Designer</option>
                        <option value="analyst">Analyst</option>
                        <option value="hr">HR</option>
                    </Select>
                    {errors.designation && <p className="text-xs text-red-500 mt-1">{errors.designation.message}</p>}
                </div>
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Department <span className="text-pink-600">*</span>
                    </label>
                    <Select
                        {...register('department', { required: 'Department is required' })}
                        className="w-full px-3 py-2 border border-pink-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                    >
                        <option value="">Select</option>
                        <option value="engineering">Engineering</option>
                        <option value="design">Design</option>
                        <option value="marketing">Marketing</option>
                        <option value="sales">Sales</option>
                        <option value="hr">Human Resources</option>
                    </Select>
                    {errors.department && <p className="text-xs text-red-500 mt-1">{errors.department.message}</p>}
                </div>
            </div>

            <div className="border-t border-pink-100 pt-6">
                <div className="flex items-start gap-3 p-4 bg-pink-50 rounded-lg">
                    <Checkbox
                        {...register('enablePortalAccess')}
                        className="w-4 h-4 text-pink-600 border-pink-300 rounded focus:ring-pink-500 mt-1"
                    />
                    <div>
                        <label className="text-sm font-semibold text-slate-700 block mb-1">
                            Enable Portal Access
                        </label>
                        <p className="text-xs text-slate-600">
                            The employee will be able to view payslips, submit their IT declaration and create reimbursement claims through the employee portal.
                        </p>
                    </div>
                </div>
            </div>

            <div className="border-t border-pink-100 pt-6">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Statutory Components</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">Enable the necessary benefits and tax applicable for this employee.</p>
                <div className="flex items-center gap-2 p-3 bg-pink-50 rounded-lg">
                    <Checkbox
                        {...register('professionalTax')}
                        defaultChecked
                        className="w-4 h-4 text-pink-600 border-pink-300 rounded focus:ring-pink-500"
                    />
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                        Professional Tax
                    </label>
                </div>
            </div>
        </div>
    );
}

function SalaryDetailsStep({ register, errors, watch, setValue }) {
    const annualCtc = parseFloat(watch('annualCtc')) || 0;
    const basicPercentOfCtc = parseFloat(watch('basicPercentOfCtc')) || 0;
    const hraPercentOfBasic = parseFloat(watch('hraPercentOfBasic')) || 0;
    const conveyanceAllowanceMonthly = parseFloat(watch('conveyanceAllowanceMonthly')) || 0;
    const monthlyCtc = annualCtc > 0 ? annualCtc / 12 : 0;
    const basicMonthlyCalc = monthlyCtc * (basicPercentOfCtc / 100);
    const hraMonthlyCalc = basicMonthlyCalc * (hraPercentOfBasic / 100);
    const fixedAllowanceMonthlyCalc = Math.max(0, monthlyCtc - (basicMonthlyCalc + hraMonthlyCalc + conveyanceAllowanceMonthly));
    React.useEffect(() => {
        setValue('basicMonthly', Number.isFinite(basicMonthlyCalc) ? basicMonthlyCalc.toFixed(2) : '0.00');
        setValue('hraMonthly', Number.isFinite(hraMonthlyCalc) ? hraMonthlyCalc.toFixed(2) : '0.00');
        setValue('fixedAllowanceMonthly', Number.isFinite(fixedAllowanceMonthlyCalc) ? fixedAllowanceMonthlyCalc.toFixed(2) : '0.00');
    }, [annualCtc, basicPercentOfCtc, hraPercentOfBasic, conveyanceAllowanceMonthly, setValue, basicMonthlyCalc, hraMonthlyCalc, fixedAllowanceMonthlyCalc]);
    return (
        <div className="space-y-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Salary Details</h3>
            {/* Hidden fields to submit computed values */}
            <input type="hidden" {...register('basicMonthly')} value={(basicMonthlyCalc || 0).toFixed(2)} />
            <input type="hidden" {...register('hraMonthly')} value={(hraMonthlyCalc || 0).toFixed(2)} />
            <input type="hidden" {...register('fixedAllowanceMonthly')} value={(fixedAllowanceMonthlyCalc || 0).toFixed(2)} />
            <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">Annual CTC <span className="text-pink-600">*</span></label>
                <div className="flex items-center gap-2">
                    <div className="relative w-full max-w-xs">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">₹</span>
                        <Input type="number" step="0.01" min="0" placeholder="0"
                            {...register('annualCtc', { required: 'Annual CTC is required' })}
                            className="pl-7 border-pink-200 focus:ring-pink-500 focus:border-pink-500" />
                    </div>
                    <span className="text-sm text-slate-600">per year</span>
                </div>
                {errors.annualCtc && <p className="text-xs text-red-500 mt-1">{errors.annualCtc.message}</p>}
            </div>
            <div className="bg-white rounded-2xl border border-pink-100">
                <div className="grid grid-cols-4 gap-4 px-4 py-3 text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider bg-slate-50 dark:bg-slate-700 border-b border-pink-100 dark:border-slate-600">
                    <div>Salary Components</div>
                    <div>Calculation Type</div>
                    <div className="text-right">Monthly Amount</div>
                    <div className="text-right">Annual Amount</div>
                </div>
                <div className="px-4 py-3 text-xs text-slate-500 dark:text-slate-400">Earnings</div>
                <div className="divide-y divide-slate-100 dark:divide-slate-700">
                    <div className="grid grid-cols-4 gap-4 px-4 py-3 items-center">
                        <div className="text-sm text-slate-900 dark:text-white">Basic</div>
                        <div className="flex items-center gap-2">
                            <Input type="number" step="0.01" min="0" max="100" {...register('basicPercentOfCtc')} className="w-24 border-pink-200 focus:ring-pink-500 focus:border-pink-500" />
                            <span className="text-sm text-slate-600 dark:text-slate-400">% of CTC</span>
                        </div>
                        <div className="text-right">
                            <Input readOnly value={(basicMonthlyCalc || 0).toFixed(2)} className="w-28 text-right bg-slate-50" />
                        </div>
                        <div className="text-right text-slate-900 dark:text-white">{(basicMonthlyCalc * 12).toFixed(2)}</div>
                    </div>
                    <div className="grid grid-cols-4 gap-4 px-4 py-3 items-center">
                        <div className="text-sm text-slate-900 dark:text-white">House Rent Allowance</div>
                        <div className="flex items-center gap-2">
                            <Input type="number" step="0.01" min="0" max="100" {...register('hraPercentOfBasic')} className="w-24 border-pink-200 focus:ring-pink-500 focus:border-pink-500" />
                            <span className="text-sm text-slate-600 dark:text-slate-400">% of Basic</span>
                        </div>
                        <div className="text-right">
                            <Input readOnly value={(hraMonthlyCalc || 0).toFixed(2)} className="w-28 text-right bg-slate-50" />
                        </div>
                        <div className="text-right text-slate-900 dark:text-white">{(hraMonthlyCalc * 12).toFixed(2)}</div>
                    </div>
                    <div className="grid grid-cols-4 gap-4 px-4 py-3 items-center">
                        <div className="text-sm text-slate-900 dark:text-white">Conveyance Allowance</div>
                        <div className="text-sm text-slate-600 dark:text-slate-400">Fixed amount</div>
                        <div className="text-right">
                            <Input type="number" step="0.01" min="0" {...register('conveyanceAllowanceMonthly')} className="w-28 text-right border-pink-200 focus:ring-pink-500 focus:border-pink-500" />
                        </div>
                        <div className="text-right text-slate-900 dark:text-white">{(conveyanceAllowanceMonthly * 12).toFixed(2)}</div>
                    </div>
                    <div className="grid grid-cols-4 gap-4 px-4 py-3 items-center">
                        <div className="text-sm text-slate-900 dark:text-white">Fixed Allowance</div>
                        <div className="text-sm text-slate-600 dark:text-slate-400">Fixed amount</div>
                        <div className="text-right">
                            <Input readOnly value={(fixedAllowanceMonthlyCalc || 0).toFixed(2)} className="w-28 text-right bg-slate-50" />
                        </div>
                        <div className="text-right text-slate-900 dark:text-white">{(fixedAllowanceMonthlyCalc * 12).toFixed(2)}</div>
                    </div>
                </div>
                <div className="px-4 py-3 bg-slate-50 dark:bg-slate-700 border-t border-pink-100 dark:border-slate-600 flex items-center justify-between">
                    <div className="font-semibold text-slate-900 dark:text-white">Cost to Company</div>
                    <div className="flex items-center gap-8">
                        <div className="text-right">
                            <div className="text-xs text-slate-500 dark:text-slate-400">Monthly</div>
                            <div className="font-semibold text-slate-900 dark:text-white">₹{(monthlyCtc || 0).toFixed(2)}</div>
                        </div>
                        <div className="text-right">
                            <div className="text-xs text-slate-500 dark:text-slate-400">Annual</div>
                            <div className="font-semibold text-slate-900 dark:text-white">₹{(annualCtc || 0).toFixed(2)}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function PersonalDetailsStep({ register, errors, watch, setValue }) {
    const dob = watch('dateOfBirth');
    useEffect(() => {
        if (!dob) { setValue('age', ''); return; }
        const birth = new Date(dob);
        const today = new Date();
        let age = today.getFullYear() - birth.getFullYear();
        const m = today.getMonth() - birth.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) { age--; }
        setValue('age', age > 0 ? String(age) : '0');
    }, [dob, setValue]);
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Date of Birth <span className="text-pink-600">*</span>
                    </label>
                    <Input
                        type="date"
                        {...register('dateOfBirth', { required: 'Date of birth is required' })}
                        className="border-pink-200 focus:ring-pink-500 focus:border-pink-500"
                    />
                    {errors.dateOfBirth && <p className="text-xs text-red-500 mt-1">{errors.dateOfBirth.message}</p>}
                </div>
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Age
                    </label>
                    <Input
                        readOnly
                        {...register('age')}
                        placeholder="0"
                        className="border-pink-200 focus:ring-pink-500 focus:border-pink-500 bg-slate-50"
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Father's Name <span className="text-pink-600">*</span>
                    </label>
                    <Input
                        {...register('fatherName', { required: "Father's name is required" })}
                        placeholder="Enter father's name"
                        className="border-pink-200 focus:ring-pink-500 focus:border-pink-500"
                    />
                    {errors.fatherName && <p className="text-xs text-red-500 mt-1">{errors.fatherName.message}</p>}
                </div>
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                        PAN
                    </label>
                    <Input
                        {...register('panNumber', { pattern: { value: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, message: 'Invalid PAN format' } })}
                        placeholder="AAAAA0000A"
                        className="border-pink-200 focus:ring-pink-500 focus:border-pink-500"
                    />
                    {errors.panNumber && <p className="text-xs text-red-500 mt-1">{errors.panNumber.message}</p>}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Differently Abled Type
                    </label>
                    <Select
                        {...register('differentlyAbledType')}
                        className="w-full px-3 py-2 border border-pink-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                    >
                        <option value="none">None</option>
                        <option value="physical">Physical Disability</option>
                        <option value="visual">Visual Impairment</option>
                        <option value="hearing">Hearing Impairment</option>
                        <option value="other">Other</option>
                    </Select>
                </div>
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Personal Email Address
                    </label>
                    <Input
                        type="email"
                        {...register('personalEmail')}
                        placeholder="abc@xyz.com"
                        className="border-pink-200 focus:ring-pink-500 focus:border-pink-500"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Residential Address
                </label>
                <Input
                    {...register('addressLine1')}
                    placeholder="Address Line 1"
                    className="mb-3 border-pink-200 focus:ring-pink-500 focus:border-pink-500"
                />
                <Input
                    {...register('addressLine2')}
                    placeholder="Address Line 2"
                    className="mb-3 border-pink-200 focus:ring-pink-500 focus:border-pink-500"
                />
                <div className="grid grid-cols-3 gap-6">
                    <Input
                        {...register('city')}
                        placeholder="City"
                        className="border-pink-200 focus:ring-pink-500 focus:border-pink-500"
                    />
                    <Select
                        {...register('state')}
                        className="w-full px-3 py-2 border border-pink-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                    >
                        <option value="">State</option>
                        <option value="Tamil Nadu">Tamil Nadu</option>
                        <option value="Telangana">Telangana</option>
                        <option value="Karnataka">Karnataka</option>
                        <option value="Kerala">Kerala</option>
                        <option value="Maharashtra">Maharashtra</option>
                        <option value="Delhi">Delhi</option>
                        <option value="Other">Other</option>
                    </Select>
                    <Input
                        {...register('pinCode', { pattern: { value: /^[0-9]{6}$/, message: 'PIN must be 6 digits' } })}
                        placeholder="PIN Code"
                        className="border-pink-200 focus:ring-pink-500 focus:border-pink-500"
                    />
                    {errors.pinCode && <p className="text-xs text-red-500 mt-1">{errors.pinCode.message}</p>}
                </div>
            </div>
        </div>
    );
}

function PaymentInformationStep({ register, errors, watch }) {
    const paymentMethod = watch('paymentMethod');
    return (
        <div className="space-y-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">How would you like to pay this employee? <span className="text-pink-600">*</span></h3>

            <div className="space-y-3">
                <label className={`flex items-start gap-4 p-4 rounded-xl border ${paymentMethod === 'direct_deposit' ? 'border-pink-400 bg-pink-50' : 'border-pink-100'} cursor-pointer`}>
                    <Radio value="direct_deposit" {...register('paymentMethod', { required: 'Please choose a payment method' })} className="mt-1" />
                    <div>
                        <div className="font-semibold text-slate-900 dark:text-white">Direct Deposit (Automated Process)</div>
                        <div className="text-sm text-slate-600 dark:text-slate-400">Initiate payment in the system once the pay run is approved</div>
                    </div>
                    <span className="ml-auto text-xs text-pink-600">Configure Now</span>
                </label>

                <label className={`flex items-start gap-4 p-4 rounded-xl border ${paymentMethod === 'bank_transfer' ? 'border-pink-400 bg-pink-50' : 'border-pink-100'} cursor-pointer`}>
                    <Radio value="bank_transfer" {...register('paymentMethod', { required: 'Please choose a payment method' })} className="mt-1" />
                    <div>
                        <div className="font-semibold text-slate-900 dark:text-white">Bank Transfer (Manual Process)</div>
                        <div className="text-sm text-slate-600 dark:text-slate-400">Download Bank Advice and process the payment through your bank's website</div>
                    </div>
                </label>

                <label className={`flex items-start gap-4 p-4 rounded-xl border ${paymentMethod === 'cheque' ? 'border-pink-400 bg-pink-50' : 'border-pink-100'} cursor-pointer`}>
                    <Radio value="cheque" {...register('paymentMethod', { required: 'Please choose a payment method' })} className="mt-1" />
                    <div>
                        <div className="font-semibold text-slate-900 dark:text-white">Cheque</div>
                    </div>
                </label>

                <label className={`flex items-start gap-4 p-4 rounded-xl border ${paymentMethod === 'cash' ? 'border-pink-400 bg-pink-50' : 'border-pink-100'} cursor-pointer`}>
                    <Radio value="cash" {...register('paymentMethod', { required: 'Please choose a payment method' })} className="mt-1" />
                    <div>
                        <div className="font-semibold text-slate-900 dark:text-white">Cash</div>
                    </div>
                </label>
                {errors.paymentMethod && <p className="text-xs text-red-500">{errors.paymentMethod.message}</p>}
            </div>

            {paymentMethod === 'bank_transfer' && (
                <div className="border-t border-pink-100 pt-6">
                    <h4 className="text-md font-bold text-slate-900 dark:text-white mb-4">Bank Details</h4>
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">Bank Name <span className="text-pink-600">*</span></label>
                            <Input
                                {...register('bankName', { validate: (v) => paymentMethod !== 'bank_transfer' || !!v || 'Bank name is required' })}
                                placeholder="Enter bank name"
                                className="border-pink-200 focus:ring-pink-500 focus:border-pink-500"
                            />
                            {errors.bankName && <p className="text-xs text-red-500 mt-1">{errors.bankName.message}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Account Number <span className="text-pink-600">*</span></label>
                            <Input
                                {...register('accountNumber', { validate: (v) => paymentMethod !== 'bank_transfer' || !!v || 'Account number is required' })}
                                placeholder="Enter account number"
                                className="border-pink-200 focus:ring-pink-500 focus:border-pink-500"
                            />
                            {errors.accountNumber && <p className="text-xs text-red-500 mt-1">{errors.accountNumber.message}</p>}
                        </div>
                    </div>
                    <div className="mt-4">
                        <label className="block text-sm font-semibold text-slate-700 mb-2">IFSC Code <span className="text-pink-600">*</span></label>
                        <Input
                            {...register('ifscCode', { validate: (v) => paymentMethod !== 'bank_transfer' || !!v || 'IFSC code is required' })}
                            placeholder="Enter IFSC code"
                            className="border-pink-200 focus:ring-pink-500 focus:border-pink-500"
                        />
                        {errors.ifscCode && <p className="text-xs text-red-500 mt-1">{errors.ifscCode.message}</p>}
                    </div>
                </div>
            )}
        </div>
    );
}
