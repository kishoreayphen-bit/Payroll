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
    X,
    Download,
    Upload,
    Eye
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

    // Mock employee data
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
            status: 'Active',
            joinDate: '2023-01-15'
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
            status: 'Active',
            joinDate: '2023-02-20'
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
            status: 'Active',
            joinDate: '2023-03-10'
        },
        {
            id: 4,
            name: 'Sarah Williams',
            employeeId: 'EMP004',
            email: 'sarah.williams@company.com',
            phone: '+1 234 567 8903',
            designation: 'HR Manager',
            department: 'HR',
            salary: '₹75,000',
            status: 'Active',
            joinDate: '2023-04-05'
        },
        {
            id: 5,
            name: 'David Brown',
            employeeId: 'EMP005',
            email: 'david.brown@company.com',
            phone: '+1 234 567 8904',
            designation: 'Sales Executive',
            department: 'Sales',
            salary: '₹65,000',
            status: 'Active',
            joinDate: '2023-05-12'
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
        <div className="h-screen bg-slate-50 flex overflow-hidden">
            {/* Sidebar */}
            <div
                className={`bg-slate-900 text-white flex flex-col fixed left-0 top-0 h-screen transition-all duration-300 shadow-xl ${sidebarOpen ? 'w-56' : 'w-0'
                    }`}
                style={{ overflow: sidebarOpen ? 'visible' : 'hidden' }}
            >
                {sidebarOpen && (
                    <>
                        {/* Logo */}
                        <div className="p-3 border-b border-slate-700/50 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 bg-rose-500 rounded-md flex items-center justify-center">
                                    <Receipt className="w-3.5 h-3.5 text-white" />
                                </div>
                                <span className="text-base font-semibold text-white">Payroll</span>
                            </div>
                            <button
                                onClick={() => setSidebarOpen(false)}
                                className="p-1 hover:bg-slate-700/50 rounded transition-colors"
                            >
                                <X className="w-3.5 h-3.5" />
                            </button>
                        </div>

                        {/* Navigation */}
                        <nav className="flex-1 p-2 space-y-0.5 overflow-y-auto">
                            <Link to="/dashboard" className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-slate-700/50 text-slate-300 hover:text-white transition-all text-sm">
                                <LayoutDashboard className="w-3.5 h-3.5" />
                                <span>Dashboard</span>
                            </Link>

                            <Link to="/employees" className="flex items-center gap-2 px-2 py-1.5 rounded-md bg-rose-500/10 text-rose-400 border border-rose-500/20">
                                <Users className="w-3.5 h-3.5" />
                                <span className="text-sm">Employees</span>
                            </Link>

                            <Link to="/pay-runs" className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-slate-700/50 text-slate-300 hover:text-white transition-all text-sm">
                                <DollarSign className="w-3.5 h-3.5" />
                                <span>Pay Runs</span>
                            </Link>

                            <Link to="/form16" className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-slate-700/50 text-slate-300 hover:text-white transition-all text-sm">
                                <FileCheck className="w-3.5 h-3.5" />
                                <span>Form 16</span>
                            </Link>

                            <Link to="/loans" className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-slate-700/50 text-slate-300 hover:text-white transition-all text-sm">
                                <Wallet className="w-3.5 h-3.5" />
                                <span>Loans</span>
                            </Link>

                            <Link to="/documents" className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-slate-700/50 text-slate-300 hover:text-white transition-all text-sm">
                                <FolderOpen className="w-3.5 h-3.5" />
                                <span>Documents</span>
                            </Link>

                            <Link to="/reports" className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-slate-700/50 text-slate-300 hover:text-white transition-all text-sm">
                                <BarChart3 className="w-3.5 h-3.5" />
                                <span>Reports</span>
                            </Link>

                            <Link to="/settings" className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-slate-700/50 text-slate-300 hover:text-white transition-all text-sm">
                                <Settings className="w-3.5 h-3.5" />
                                <span>Settings</span>
                            </Link>
                        </nav>
                    </>
                )}
            </div>

            {/* Main Content */}
            <div className={`flex-1 flex flex-col h-screen transition-all duration-300 ${sidebarOpen ? 'ml-56' : 'ml-0'}`}>
                {/* Top Bar */}
                <div className="bg-white border-b border-slate-200 px-4 py-2 flex-shrink-0">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            {!sidebarOpen && (
                                <button
                                    onClick={() => setSidebarOpen(true)}
                                    className="p-1.5 hover:bg-slate-100 rounded transition-colors"
                                >
                                    <Menu className="w-4 h-4 text-slate-600" />
                                </button>
                            )}
                            <h1 className="text-lg font-semibold text-slate-900">Employees</h1>
                            <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs font-medium rounded">
                                {filteredEmployees.length} total
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => {
                                    setShowCompanyMenu(!showCompanyMenu);
                                    setShowProfileMenu(false);
                                }}
                                className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-50 rounded-md hover:bg-slate-100 transition-colors border border-slate-200"
                            >
                                <span className="text-slate-700 font-medium text-xs">
                                    {loading ? 'Loading...' : (organization?.companyName || 'Company')}
                                </span>
                                <ChevronRight className="w-3 h-3 text-slate-400" />
                            </button>

                            <button
                                onClick={() => {
                                    setShowProfileMenu(!showProfileMenu);
                                    setShowCompanyMenu(false);
                                }}
                                className="w-7 h-7 bg-rose-500 rounded-full flex items-center justify-center text-white font-medium text-xs"
                            >
                                {user?.email?.charAt(0).toUpperCase()}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-4">
                    <div className="max-w-full">
                        {/* Actions Bar */}
                        <div className="mb-3 flex items-center justify-between gap-3">
                            <div className="flex-1 max-w-sm relative">
                                <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Search employees..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-9 pr-3 py-1.5 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-rose-500 focus:border-rose-500 bg-white"
                                />
                            </div>
                            <div className="flex gap-2">
                                <button className="px-3 py-1.5 text-sm border border-slate-200 text-slate-600 rounded-md hover:bg-slate-50 transition-colors flex items-center gap-1.5">
                                    <Filter className="w-3.5 h-3.5" />
                                    Filter
                                </button>
                                <button className="px-3 py-1.5 text-sm border border-slate-200 text-slate-600 rounded-md hover:bg-slate-50 transition-colors flex items-center gap-1.5">
                                    <Download className="w-3.5 h-3.5" />
                                    Export
                                </button>
                                <button
                                    onClick={() => navigate('/employees/add')}
                                    className="px-3 py-1.5 text-sm bg-rose-500 text-white rounded-md hover:bg-rose-600 transition-colors flex items-center gap-1.5 font-medium"
                                >
                                    <Plus className="w-3.5 h-3.5" />
                                    Add Employee
                                </button>
                            </div>
                        </div>

                        {/* Employee Table */}
                        {filteredEmployees.length === 0 ? (
                            <div className="text-center py-12 bg-white rounded-lg border border-slate-200">
                                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <Users className="w-8 h-8 text-slate-400" />
                                </div>
                                <h3 className="text-base font-semibold text-slate-900 mb-1">No Employees Found</h3>
                                <p className="text-sm text-slate-500 mb-4">
                                    {searchQuery ? 'No employees match your search.' : 'Get started by adding your first employee.'}
                                </p>
                                {!searchQuery && (
                                    <button
                                        onClick={() => navigate('/employees/add')}
                                        className="px-4 py-2 text-sm bg-rose-500 text-white rounded-md hover:bg-rose-600 transition-colors inline-flex items-center gap-2"
                                    >
                                        <Plus className="w-4 h-4" />
                                        Add Employee
                                    </button>
                                )}
                            </div>
                        ) : (
                            <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
                                <table className="w-full">
                                    <thead className="bg-slate-50 border-b border-slate-200">
                                        <tr>
                                            <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Employee</th>
                                            <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">ID</th>
                                            <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Department</th>
                                            <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Designation</th>
                                            <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Contact</th>
                                            <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Salary</th>
                                            <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Status</th>
                                            <th className="px-4 py-2.5 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200">
                                        {filteredEmployees.map((employee) => (
                                            <tr key={employee.id} className="hover:bg-slate-50 transition-colors">
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-2.5">
                                                        <div className="w-8 h-8 bg-rose-100 rounded-full flex items-center justify-center text-rose-600 font-semibold text-xs flex-shrink-0">
                                                            {employee.name.charAt(0)}
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="text-sm font-medium text-slate-900 truncate">{employee.name}</p>
                                                            <p className="text-xs text-slate-500 truncate">{employee.email}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className="text-sm text-slate-600 font-mono">{employee.employeeId}</span>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className="text-sm text-slate-900">{employee.department}</span>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className="text-sm text-slate-600">{employee.designation}</span>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="text-xs text-slate-500">
                                                        <div className="flex items-center gap-1 mb-0.5">
                                                            <Mail className="w-3 h-3" />
                                                            <span className="truncate max-w-[150px]">{employee.email}</span>
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <Phone className="w-3 h-3" />
                                                            <span>{employee.phone}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className="text-sm font-semibold text-slate-900">{employee.salary}</span>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className="inline-flex px-2 py-0.5 text-xs font-medium rounded-full bg-emerald-100 text-emerald-700">
                                                        {employee.status}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center justify-end gap-1">
                                                        <button
                                                            className="p-1.5 hover:bg-slate-100 rounded transition-colors"
                                                            title="View details"
                                                        >
                                                            <Eye className="w-3.5 h-3.5 text-slate-600" />
                                                        </button>
                                                        <button
                                                            className="p-1.5 hover:bg-slate-100 rounded transition-colors"
                                                            title="Edit"
                                                        >
                                                            <Edit className="w-3.5 h-3.5 text-slate-600" />
                                                        </button>
                                                        <button
                                                            className="p-1.5 hover:bg-slate-100 rounded transition-colors"
                                                            title="More options"
                                                        >
                                                            <MoreVertical className="w-3.5 h-3.5 text-slate-600" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
