import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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
    X
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/authService';

export default function EmployeeList() {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [showCompanyMenu, setShowCompanyMenu] = useState(false);
    const [organization, setOrganization] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    // Mock employee data - replace with API call later
    const [employees, setEmployees] = useState([
        {
            id: 1,
            name: 'John Doe',
            employeeId: 'EMP001',
            email: 'john.doe@company.com',
            phone: '+1 234 567 8900',
            designation: 'Senior Developer',
            department: 'Engineering',
            salary: '₹80,000',
            status: 'Active'
        },
        {
            id: 2,
            name: 'Jane Smith',
            employeeId: 'EMP002',
            email: 'jane.smith@company.com',
            phone: '+1 234 567 8901',
            designation: 'Product Manager',
            department: 'Product',
            salary: '₹95,000',
            status: 'Active'
        },
        {
            id: 3,
            name: 'Mike Johnson',
            employeeId: 'EMP003',
            email: 'mike.johnson@company.com',
            phone: '+1 234 567 8902',
            designation: 'UI/UX Designer',
            department: 'Design',
            salary: '₹70,000',
            status: 'Active'
        }
    ]);

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

    const filteredEmployees = employees.filter(emp =>
        emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-white flex overflow-hidden">
            {/* Sidebar */}
            <div
                className={`bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white flex flex-col fixed left-0 top-0 h-screen transition-all duration-300 shadow-2xl ${sidebarOpen ? 'w-56' : 'w-0'
                    }`}
                style={{ overflow: sidebarOpen ? 'visible' : 'hidden' }}
            >
                {sidebarOpen && (
                    <>
                        {/* Logo and Close Button */}
                        <div className="p-4 border-b border-slate-700/50 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="w-7 h-7 bg-gradient-to-br from-pink-500 to-rose-600 rounded-lg flex items-center justify-center">
                                    <Receipt className="w-4 h-4 text-white" />
                                </div>
                                <span className="text-lg font-bold bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent">Payroll</span>
                            </div>
                            <button
                                onClick={() => setSidebarOpen(false)}
                                className="p-1 hover:bg-slate-700/50 rounded-lg transition-colors"
                                title="Close sidebar"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Navigation */}
                        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
                            <Link to="/dashboard" className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-slate-700/50 text-slate-300 hover:text-white transition-all">
                                <LayoutDashboard className="w-4 h-4" />
                                <span className="text-sm">Dashboard</span>
                            </Link>

                            <Link to="/employees" className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md">
                                <Users className="w-4 h-4" />
                                <span className="text-sm">Employees</span>
                            </Link>

                            <Link to="/pay-runs" className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-slate-700/50 text-slate-300 hover:text-white transition-all">
                                <DollarSign className="w-4 h-4" />
                                <span className="text-sm">Pay Runs</span>
                            </Link>

                            <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-slate-700/50 text-slate-300 hover:text-white transition-all cursor-pointer">
                                <Shield className="w-4 h-4" />
                                <span className="text-sm">Approvals</span>
                                <ChevronRight className="w-3 h-3 ml-auto" />
                            </div>

                            <Link to="/form16" className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-slate-700/50 text-slate-300 hover:text-white transition-all">
                                <FileCheck className="w-4 h-4" />
                                <span className="text-sm">Form 16</span>
                            </Link>

                            <Link to="/loans" className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-slate-700/50 text-slate-300 hover:text-white transition-all">
                                <Wallet className="w-4 h-4" />
                                <span className="text-sm">Loans</span>
                            </Link>

                            <Link to="/giving" className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-slate-700/50 text-slate-300 hover:text-white transition-all">
                                <Heart className="w-4 h-4" />
                                <span className="text-sm">Giving</span>
                            </Link>

                            <Link to="/documents" className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-slate-700/50 text-slate-300 hover:text-white transition-all">
                                <FolderOpen className="w-4 h-4" />
                                <span className="text-sm">Documents</span>
                            </Link>

                            <Link to="/reports" className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-slate-700/50 text-slate-300 hover:text-white transition-all">
                                <BarChart3 className="w-4 h-4" />
                                <span className="text-sm">Reports</span>
                            </Link>

                            <Link to="/settings" className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-slate-700/50 text-slate-300 hover:text-white transition-all">
                                <Settings className="w-4 h-4" />
                                <span className="text-sm">Settings</span>
                            </Link>
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
                                Employees
                            </h1>
                        </div>
                        <div className="flex items-center gap-2">
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

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    <div className="max-w-7xl mx-auto">
                        {/* Header with Search and Add Button */}
                        <div className="mb-6 flex items-center justify-between gap-4">
                            <div className="flex-1 max-w-md relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Search employees..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 bg-white"
                                />
                            </div>
                            <div className="flex gap-3">
                                <Button
                                    variant="outline"
                                    className="border-pink-200 text-pink-600 hover:bg-pink-50"
                                >
                                    <Filter className="w-4 h-4 mr-2" />
                                    Filter
                                </Button>
                                <Button
                                    onClick={() => navigate('/employees/add')}
                                    className="bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white shadow-lg shadow-pink-500/30"
                                >
                                    <Plus className="w-4 h-4 mr-2" />
                                    Add Employee
                                </Button>
                            </div>
                        </div>

                        {/* Employee Cards */}
                        {filteredEmployees.length === 0 ? (
                            <div className="text-center py-16">
                                <div className="w-24 h-24 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Users className="w-12 h-12 text-pink-600" />
                                </div>
                                <h2 className="text-2xl font-bold text-slate-900 mb-3">No Employees Found</h2>
                                <p className="text-slate-600 mb-8 max-w-md mx-auto">
                                    {searchQuery ? 'No employees match your search criteria.' : 'Get started by adding your first employee.'}
                                </p>
                                {!searchQuery && (
                                    <Button
                                        onClick={() => navigate('/employees/add')}
                                        className="bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white shadow-lg shadow-pink-500/30"
                                    >
                                        <Plus className="w-4 h-4 mr-2" />
                                        Add Your First Employee
                                    </Button>
                                )}
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredEmployees.map((employee) => (
                                    <div
                                        key={employee.id}
                                        className="bg-white rounded-2xl border border-pink-100 shadow-sm hover:shadow-xl transition-all overflow-hidden group"
                                    >
                                        {/* Card Header */}
                                        <div className="bg-gradient-to-r from-pink-600 to-rose-600 p-4">
                                            <div className="flex items-start justify-between mb-3">
                                                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white font-bold text-lg">
                                                    {employee.name.charAt(0)}
                                                </div>
                                                <button className="p-1.5 hover:bg-white/20 rounded-lg transition-colors">
                                                    <MoreVertical className="w-4 h-4 text-white" />
                                                </button>
                                            </div>
                                            <h3 className="text-lg font-bold text-white mb-1">{employee.name}</h3>
                                            <p className="text-pink-100 text-sm">{employee.employeeId}</p>
                                        </div>

                                        {/* Card Body */}
                                        <div className="p-4 space-y-3">
                                            <div>
                                                <p className="text-xs text-slate-500 mb-1">Designation</p>
                                                <p className="text-sm font-semibold text-slate-900">{employee.designation}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-slate-500 mb-1">Department</p>
                                                <p className="text-sm font-semibold text-slate-900">{employee.department}</p>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-slate-600">
                                                <Mail className="w-4 h-4 text-pink-500" />
                                                <span className="text-xs truncate">{employee.email}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-slate-600">
                                                <Phone className="w-4 h-4 text-pink-500" />
                                                <span className="text-xs">{employee.phone}</span>
                                            </div>
                                            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                                                <div>
                                                    <p className="text-xs text-slate-500">Salary</p>
                                                    <p className="text-sm font-bold text-pink-600">{employee.salary}</p>
                                                </div>
                                                <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                                                    {employee.status}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Card Footer */}
                                        <div className="px-4 pb-4 flex gap-2">
                                            <button className="flex-1 py-2 px-3 border border-pink-200 text-pink-600 rounded-lg hover:bg-pink-50 transition-colors text-sm font-semibold flex items-center justify-center gap-2">
                                                <Edit className="w-4 h-4" />
                                                Edit
                                            </button>
                                            <button className="flex-1 py-2 px-3 bg-gradient-to-r from-pink-600 to-rose-600 text-white rounded-lg hover:from-pink-700 hover:to-rose-700 transition-colors text-sm font-semibold">
                                                View Details
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
