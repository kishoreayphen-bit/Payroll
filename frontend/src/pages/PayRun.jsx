import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Receipt,
    Users,
    Settings,
    HelpCircle,
    ChevronRight,
    Plus,
    Calculator,
    CheckCircle,
    Clock,
    DollarSign,
    FileText,
    Send,
    Download,
    Eye,
    MoreVertical,
    Calendar,
    AlertCircle,
    X,
    Play,
    Pause,
    Check,
    RefreshCw
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { api } from '../services/authService';
import AppHeader from '../components/AppHeader';
import Sidebar from '../components/Sidebar';

const STATUS_COLORS = {
    DRAFT: 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300',
    CALCULATING: 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300',
    PENDING_APPROVAL: 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300',
    APPROVED: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300',
    PROCESSING: 'bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300',
    COMPLETED: 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300',
    CANCELLED: 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300',
};

export default function PayRun() {
    const navigate = useNavigate();
    const { user: authUser, logout } = useAuth();
    const { darkMode } = useTheme();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [showCompanyMenu, setShowCompanyMenu] = useState(false);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [organization, setOrganization] = useState(null);
    const [loading, setLoading] = useState(true);
    const [payRuns, setPayRuns] = useState([]);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [selectedPayRun, setSelectedPayRun] = useState(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);

    // Get user from localStorage if authUser is not available
    const user = authUser || JSON.parse(localStorage.getItem('user') || 'null');

    useEffect(() => {
        // Fetch organization first, then pay runs
        fetchOrganization();
    }, []);

    useEffect(() => {
        // Fetch pay runs when organization is loaded
        if (organization?.id) {
            fetchPayRuns();
        }
    }, [organization]);

    const fetchOrganization = async () => {
        try {
            const selectedOrgId = localStorage.getItem('selectedOrganizationId');
            if (!selectedOrgId) {
                window.location.href = '/select-organization';
                return;
            }
            const response = await api.get('/organizations');
            const org = response.data?.find(o => o.id === parseInt(selectedOrgId));
            if (org) {
                setOrganization(org);
            } else {
                console.error('Organization not found');
            }
        } catch (error) {
            console.error('Failed to fetch organization:', error);
            setLoading(false);
        }
    };

    const fetchPayRuns = async () => {
        try {
            setLoading(true);
            const response = await api.get('/pay-runs', {
                headers: {
                    'X-Tenant-ID': organization.id
                }
            });
            setPayRuns(response.data);
        } catch (error) {
            console.error('Failed to fetch pay runs:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreatePayRun = async (data) => {
        try {
            setActionLoading(true);
            
            // Debug: Check authentication state
            const token = localStorage.getItem('token');
            console.log('Creating pay run with token:', token ? 'exists' : 'missing');
            console.log('User:', user);
            console.log('Organization ID:', organization?.id || localStorage.getItem('organizationId'));
            
            const response = await api.post('/pay-runs', data, {
                headers: {
                    'X-Tenant-ID': organization?.id || localStorage.getItem('organizationId'),
                    'X-User-ID': user?.id || 1
                }
            });
            setPayRuns([response.data, ...payRuns]);
            setShowCreateModal(false);
        } catch (error) {
            console.error('Failed to create pay run:', error);
            console.error('Error response:', error.response);
            alert(error.response?.data?.error || 'Failed to create pay run');
        } finally {
            setActionLoading(false);
        }
    };

    const handleCalculate = async (payRunId) => {
        try {
            setActionLoading(true);
            const response = await api.post(`/pay-runs/${payRunId}/calculate`, {}, {
                headers: {
                    'X-Tenant-ID': organization?.id || localStorage.getItem('organizationId')
                }
            });
            setPayRuns(payRuns.map(pr => pr.id === payRunId ? response.data : pr));
            if (selectedPayRun?.id === payRunId) {
                fetchPayRunDetails(payRunId);
            }
        } catch (error) {
            console.error('Failed to calculate pay run:', error);
            alert(error.response?.data?.error || 'Failed to calculate pay run');
        } finally {
            setActionLoading(false);
        }
    };

    const handleApprove = async (payRunId) => {
        try {
            setActionLoading(true);
            const response = await api.post(`/pay-runs/${payRunId}/approve`, {}, {
                headers: {
                    'X-Tenant-ID': organization?.id || localStorage.getItem('organizationId'),
                    'X-User-ID': user?.id || 1
                }
            });
            setPayRuns(payRuns.map(pr => pr.id === payRunId ? response.data : pr));
            if (selectedPayRun?.id === payRunId) {
                setSelectedPayRun(response.data);
            }
        } catch (error) {
            console.error('Failed to approve pay run:', error);
            alert(error.response?.data?.error || 'Failed to approve pay run');
        } finally {
            setActionLoading(false);
        }
    };

    const handleComplete = async (payRunId) => {
        try {
            setActionLoading(true);
            const response = await api.post(`/pay-runs/${payRunId}/complete`, {}, {
                headers: {
                    'X-Tenant-ID': organization?.id || localStorage.getItem('organizationId')
                }
            });
            setPayRuns(payRuns.map(pr => pr.id === payRunId ? response.data : pr));
            if (selectedPayRun?.id === payRunId) {
                setSelectedPayRun(response.data);
            }
        } catch (error) {
            console.error('Failed to complete pay run:', error);
            alert(error.response?.data?.error || 'Failed to complete pay run');
        } finally {
            setActionLoading(false);
        }
    };

    const handleCancel = async (payRunId) => {
        if (!confirm('Are you sure you want to cancel this pay run? This action cannot be undone.')) {
            return;
        }
        try {
            setActionLoading(true);
            await api.post(`/pay-runs/${payRunId}/cancel`, {}, {
                headers: {
                    'X-Tenant-ID': organization?.id || localStorage.getItem('organizationId')
                }
            });
            // Refresh pay runs list
            fetchPayRuns();
            if (selectedPayRun?.id === payRunId) {
                setShowDetailsModal(false);
                setSelectedPayRun(null);
            }
            alert('Pay run cancelled successfully');
        } catch (error) {
            console.error('Failed to cancel pay run:', error);
            alert(error.response?.data?.error || 'Failed to cancel pay run');
        } finally {
            setActionLoading(false);
        }
    };

    const handleDelete = async (payRunId) => {
        if (!confirm('Are you sure you want to delete this pay run? This action cannot be undone.')) {
            return;
        }
        try {
            setActionLoading(true);
            await api.delete(`/pay-runs/${payRunId}`, {
                headers: {
                    'X-Tenant-ID': organization?.id || localStorage.getItem('organizationId')
                }
            });
            // Remove from list
            setPayRuns(payRuns.filter(pr => pr.id !== payRunId));
            if (selectedPayRun?.id === payRunId) {
                setShowDetailsModal(false);
                setSelectedPayRun(null);
            }
            alert('Pay run deleted successfully');
        } catch (error) {
            console.error('Failed to delete pay run:', error);
            alert(error.response?.data?.error || 'Failed to delete pay run');
        } finally {
            setActionLoading(false);
        }
    };

    const handleGeneratePayslips = async (payRunId) => {
        try {
            setActionLoading(true);
            await api.post(`/payslips/generate/${payRunId}`, {}, {
                headers: {
                    'X-Tenant-ID': organization?.id || localStorage.getItem('organizationId')
                }
            });
            alert('Payslips generated successfully!');
            fetchPayRunDetails(payRunId);
        } catch (error) {
            console.error('Failed to generate payslips:', error);
            alert(error.response?.data?.error || 'Failed to generate payslips');
        } finally {
            setActionLoading(false);
        }
    };

    const fetchPayRunDetails = async (payRunId) => {
        try {
            const tenantId = organization?.id;
            if (!tenantId) {
                console.error('Organization ID not available');
                alert('Unable to fetch pay run details. Please refresh the page.');
                return;
            }
            
            const response = await api.get(`/pay-runs/${payRunId}/details`, {
                headers: {
                    'X-Tenant-ID': tenantId
                }
            });
            setSelectedPayRun(response.data);
            setShowDetailsModal(true);
        } catch (error) {
            console.error('Failed to fetch pay run details:', error);
            alert('Failed to fetch pay run details: ' + (error.response?.data?.error || error.message));
        }
    };

    const openDetails = async (payRun) => {
        await fetchPayRunDetails(payRun.id);
    };

    const formatCurrency = (amount) => {
        if (!amount) return '₹0.00';
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 2
        }).format(amount);
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    return (
        <div className="h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-white dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex overflow-hidden">
            {/* Sidebar */}
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            {/* Main Content */}
            <div
                className={`flex-1 min-w-0 flex flex-col h-screen transition-all duration-300 ${sidebarOpen ? 'ml-56' : 'ml-0'}`}
                style={{ width: sidebarOpen ? 'calc(100vw - 14rem)' : '100vw' }}
            >
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
                <div className="flex-1 overflow-y-auto p-4">
                    <div className="max-w-7xl mx-auto">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h1 className="text-xl font-bold text-slate-900 dark:text-white">Pay Runs</h1>
                                <p className="text-xs text-slate-600 dark:text-slate-400">Manage payroll processing and generate payslips</p>
                            </div>
                            <Button
                                onClick={() => setShowCreateModal(true)}
                                className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white gap-1.5 text-xs px-3 py-1.5 h-auto"
                            >
                                <Plus className="w-3.5 h-3.5" />
                                Create Pay Run
                            </Button>
                        </div>

                        {/* Stats Cards - Compact */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
                            <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-slate-200/60 dark:border-slate-700/60 shadow-sm">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 bg-blue-50 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                                        <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-slate-500 dark:text-slate-400">Draft</p>
                                        <p className="text-lg font-bold text-slate-900 dark:text-white">
                                            {payRuns.filter(pr => pr.status === 'DRAFT').length}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-slate-200/60 dark:border-slate-700/60 shadow-sm">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 bg-amber-50 dark:bg-amber-900/30 rounded-lg flex items-center justify-center">
                                        <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-slate-500 dark:text-slate-400">Pending</p>
                                        <p className="text-lg font-bold text-slate-900 dark:text-white">
                                            {payRuns.filter(pr => pr.status === 'PENDING_APPROVAL').length}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-slate-200/60 dark:border-slate-700/60 shadow-sm">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 bg-emerald-50 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center">
                                        <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-slate-500 dark:text-slate-400">Approved</p>
                                        <p className="text-lg font-bold text-slate-900 dark:text-white">
                                            {payRuns.filter(pr => pr.status === 'APPROVED').length}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-slate-200/60 dark:border-slate-700/60 shadow-sm">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 bg-green-50 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                                        <DollarSign className="w-4 h-4 text-green-600 dark:text-green-400" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-slate-500 dark:text-slate-400">Completed</p>
                                        <p className="text-lg font-bold text-slate-900 dark:text-white">
                                            {payRuns.filter(pr => pr.status === 'COMPLETED').length}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Pay Runs Table - Sleek Design */}
                        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200/60 dark:border-slate-700/60 shadow-sm overflow-hidden">
                            <div className="px-4 py-2.5 border-b border-slate-200/60 dark:border-slate-700/60">
                                <h2 className="text-sm font-semibold text-slate-900 dark:text-white">All Pay Runs</h2>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-slate-50/80 dark:bg-slate-700/30">
                                        <tr>
                                            <th className="px-3 py-2 text-left text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Pay Run #</th>
                                            <th className="px-3 py-2 text-left text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Pay Period</th>
                                            <th className="px-3 py-2 text-left text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Pay Date</th>
                                            <th className="px-3 py-2 text-center text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Employees</th>
                                            <th className="px-3 py-2 text-right text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Net Pay</th>
                                            <th className="px-3 py-2 text-center text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                                            <th className="px-3 py-2 text-center text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                                        {loading ? (
                                            <tr>
                                                <td colSpan="7" className="px-4 py-8 text-center text-slate-500 dark:text-slate-400">
                                                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2" />
                                                    Loading pay runs...
                                                </td>
                                            </tr>
                                        ) : payRuns.length === 0 ? (
                                            <tr>
                                                <td colSpan="7" className="px-4 py-8 text-center text-slate-500 dark:text-slate-400">
                                                    <DollarSign className="w-10 h-10 mx-auto mb-2 text-slate-300 dark:text-slate-600" />
                                                    <p>No pay runs found</p>
                                                    <p className="text-sm">Create your first pay run to get started</p>
                                                </td>
                                            </tr>
                                        ) : (
                                            payRuns.map((payRun) => (
                                                <tr key={payRun.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30">
                                                    <td className="px-4 py-3">
                                                        <button
                                                            onClick={() => openDetails(payRun)}
                                                            className="font-medium text-pink-600 hover:text-pink-700 dark:text-pink-400"
                                                        >
                                                            {payRun.payRunNumber}
                                                        </button>
                                                    </td>
                                                    <td className="px-4 py-3 text-sm text-slate-700 dark:text-slate-300">
                                                        {formatDate(payRun.payPeriodStart)} - {formatDate(payRun.payPeriodEnd)}
                                                    </td>
                                                    <td className="px-4 py-3 text-sm text-slate-700 dark:text-slate-300">
                                                        {formatDate(payRun.payDate)}
                                                    </td>
                                                    <td className="px-4 py-3 text-center text-sm text-slate-700 dark:text-slate-300">
                                                        {payRun.employeeCount}
                                                    </td>
                                                    <td className="px-4 py-3 text-right text-sm font-medium text-slate-900 dark:text-white">
                                                        {formatCurrency(payRun.totalNetPay)}
                                                    </td>
                                                    <td className="px-4 py-3 text-center">
                                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${STATUS_COLORS[payRun.status]}`}>
                                                            {payRun.status.replace('_', ' ')}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <div className="flex items-center justify-center gap-1">
                                                            {payRun.status === 'DRAFT' && (
                                                                <Button
                                                                    size="sm"
                                                                    variant="ghost"
                                                                    onClick={() => handleCalculate(payRun.id)}
                                                                    disabled={actionLoading}
                                                                    title="Calculate Payroll"
                                                                >
                                                                    <Calculator className="w-4 h-4" />
                                                                </Button>
                                                            )}
                                                            {payRun.status === 'PENDING_APPROVAL' && (
                                                                <>
                                                                    <Button
                                                                        size="sm"
                                                                        variant="ghost"
                                                                        onClick={() => handleCalculate(payRun.id)}
                                                                        disabled={actionLoading}
                                                                        title="Recalculate"
                                                                    >
                                                                        <RefreshCw className="w-4 h-4" />
                                                                    </Button>
                                                                    <Button
                                                                        size="sm"
                                                                        variant="ghost"
                                                                        onClick={() => handleApprove(payRun.id)}
                                                                        disabled={actionLoading}
                                                                        title="Approve"
                                                                        className="text-emerald-600 hover:text-emerald-700"
                                                                    >
                                                                        <Check className="w-4 h-4" />
                                                                    </Button>
                                                                </>
                                                            )}
                                                            {payRun.status === 'APPROVED' && (
                                                                <>
                                                                    <Button
                                                                        size="sm"
                                                                        variant="ghost"
                                                                        onClick={() => handleComplete(payRun.id)}
                                                                        disabled={actionLoading}
                                                                        title="Mark as Completed"
                                                                    >
                                                                        <CheckCircle className="w-4 h-4" />
                                                                    </Button>
                                                                    <Button
                                                                        size="sm"
                                                                        variant="ghost"
                                                                        onClick={() => handleGeneratePayslips(payRun.id)}
                                                                        disabled={actionLoading}
                                                                        title="Generate Payslips"
                                                                    >
                                                                        <FileText className="w-4 h-4" />
                                                                    </Button>
                                                                </>
                                                            )}
                                                            {payRun.status === 'COMPLETED' && (
                                                                <Button
                                                                    size="sm"
                                                                    variant="ghost"
                                                                    onClick={() => handleGeneratePayslips(payRun.id)}
                                                                    disabled={actionLoading}
                                                                    title="Generate Payslips"
                                                                >
                                                                    <FileText className="w-4 h-4" />
                                                                </Button>
                                                            )}
                                                            <Button
                                                                size="sm"
                                                                variant="ghost"
                                                                onClick={() => openDetails(payRun)}
                                                                title="View Details"
                                                            >
                                                                <Eye className="w-4 h-4" />
                                                            </Button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Create Pay Run Modal */}
            {showCreateModal && (
                <CreatePayRunModal
                    onClose={() => setShowCreateModal(false)}
                    onCreate={handleCreatePayRun}
                    loading={actionLoading}
                />
            )}

            {/* Pay Run Details Modal */}
            {showDetailsModal && selectedPayRun && (
                <PayRunDetailsModal
                    payRun={selectedPayRun}
                    organization={organization}
                    onClose={() => {
                        setShowDetailsModal(false);
                        setSelectedPayRun(null);
                    }}
                    onCalculate={() => handleCalculate(selectedPayRun.id)}
                    onApprove={() => handleApprove(selectedPayRun.id)}
                    onComplete={() => handleComplete(selectedPayRun.id)}
                    onCancel={() => handleCancel(selectedPayRun.id)}
                    onDelete={() => handleDelete(selectedPayRun.id)}
                    onGeneratePayslips={() => handleGeneratePayslips(selectedPayRun.id)}
                    loading={actionLoading}
                    formatCurrency={formatCurrency}
                    formatDate={formatDate}
                />
            )}
        </div>
    );
}

function CreatePayRunModal({ onClose, onCreate, loading }) {
    const [formData, setFormData] = useState({
        payPeriodStart: '',
        payPeriodEnd: '',
        payDate: '',
        notes: ''
    });

    // Set default dates (current month)
    useEffect(() => {
        const now = new Date();
        const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
        const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        const payDate = new Date(now.getFullYear(), now.getMonth() + 1, 5);

        setFormData({
            payPeriodStart: firstDay.toISOString().split('T')[0],
            payPeriodEnd: lastDay.toISOString().split('T')[0],
            payDate: payDate.toISOString().split('T')[0],
            notes: ''
        });
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        onCreate(formData);
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-lg">
                <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Create Pay Run</h2>
                    <button onClick={onClose} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg">
                        <X className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
                                Pay Period Start
                            </label>
                            <Input
                                type="date"
                                value={formData.payPeriodStart}
                                onChange={(e) => setFormData({ ...formData, payPeriodStart: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
                                Pay Period End
                            </label>
                            <Input
                                type="date"
                                value={formData.payPeriodEnd}
                                onChange={(e) => setFormData({ ...formData, payPeriodEnd: e.target.value })}
                                required
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
                            Pay Date
                        </label>
                        <Input
                            type="date"
                            value={formData.payDate}
                            onChange={(e) => setFormData({ ...formData, payDate: e.target.value })}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
                            Notes (Optional)
                        </label>
                        <textarea
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-pink-500 dark:bg-slate-700 dark:text-white"
                            rows={3}
                            placeholder="Add any notes for this pay run..."
                        />
                    </div>
                    <div className="flex justify-end gap-3 pt-4">
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={loading}
                            className="bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white"
                        >
                            {loading ? 'Creating...' : 'Create Pay Run'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}

function PayRunDetailsModal({ payRun, organization, onClose, onCalculate, onApprove, onComplete, onCancel, onDelete, onGeneratePayslips, loading, formatCurrency, formatDate }) {
    const [payslips, setPayslips] = React.useState([]);
    const [loadingPayslips, setLoadingPayslips] = React.useState(false);
    const [activeTab, setActiveTab] = React.useState('employees');

    React.useEffect(() => {
        if ((payRun.status === 'COMPLETED' || payRun.status === 'APPROVED') && organization?.id) {
            fetchPayslips();
        }
    }, [payRun.id, organization?.id]);

    const fetchPayslips = async () => {
        if (!organization?.id) {
            console.error('Organization ID not available');
            return;
        }
        try {
            setLoadingPayslips(true);
            const response = await api.get(`/payslips/pay-run/${payRun.id}`, {
                headers: {
                    'X-Tenant-ID': organization.id
                }
            });
            setPayslips(response.data);
        } catch (error) {
            console.error('Failed to fetch payslips:', error);
        } finally {
            setLoadingPayslips(false);
        }
    };

    const handleDownloadPayslip = async (payslipId, employeeId) => {
        try {
            const response = await api.get(`/payslips/${payslipId}/download`, {
                headers: {
                    'X-Employee-ID': employeeId
                },
                responseType: 'blob'
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `payslip-${payslipId}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error('Failed to download payslip:', error);
            alert('Failed to download payslip: ' + (error.response?.data?.error || error.message));
        }
    };

    const handleEmailPayslip = async (payslipId) => {
        if (!organization?.id) {
            alert('Organization ID not available');
            return;
        }
        try {
            await api.post(`/payslips/${payslipId}/send-email`, {}, {
                headers: {
                    'X-Tenant-ID': organization.id
                }
            });
            alert('Payslip email sent successfully!');
            fetchPayslips(); // Refresh to update email sent status
        } catch (error) {
            console.error('Failed to send payslip email:', error);
            alert('Failed to send email: ' + (error.response?.data?.error || error.message));
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
                <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">{payRun.payRunNumber}</h2>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                            {formatDate(payRun.payPeriodStart)} - {formatDate(payRun.payPeriodEnd)}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 text-sm font-medium rounded-full ${STATUS_COLORS[payRun.status]}`}>
                            {payRun.status.replace('_', ' ')}
                        </span>
                        <button onClick={onClose} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg">
                            <X className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                    {/* Summary Cards */}
                    <div className="grid grid-cols-4 gap-4 mb-6">
                        <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4">
                            <p className="text-sm text-slate-600 dark:text-slate-400">Gross Pay</p>
                            <p className="text-xl font-bold text-slate-900 dark:text-white">{formatCurrency(payRun.totalGrossPay)}</p>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4">
                            <p className="text-sm text-slate-600 dark:text-slate-400">Deductions</p>
                            <p className="text-xl font-bold text-red-600 dark:text-red-400">{formatCurrency(payRun.totalDeductions)}</p>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4">
                            <p className="text-sm text-slate-600 dark:text-slate-400">Net Pay</p>
                            <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">{formatCurrency(payRun.totalNetPay)}</p>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4">
                            <p className="text-sm text-slate-600 dark:text-slate-400">Employees</p>
                            <p className="text-xl font-bold text-slate-900 dark:text-white">{payRun.employeeCount}</p>
                        </div>
                    </div>

                    {/* Tabs */}
                    {(payRun.status === 'COMPLETED' || payRun.status === 'APPROVED') && (
                        <div className="flex gap-2 mb-4 border-b border-slate-200 dark:border-slate-700">
                            <button
                                onClick={() => setActiveTab('employees')}
                                className={`px-4 py-2 font-medium text-sm transition-colors ${
                                    activeTab === 'employees'
                                        ? 'text-pink-600 dark:text-pink-400 border-b-2 border-pink-600 dark:border-pink-400'
                                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                                }`}
                            >
                                Employee Breakdown
                            </button>
                            <button
                                onClick={() => setActiveTab('payslips')}
                                className={`px-4 py-2 font-medium text-sm transition-colors ${
                                    activeTab === 'payslips'
                                        ? 'text-pink-600 dark:text-pink-400 border-b-2 border-pink-600 dark:border-pink-400'
                                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                                }`}
                            >
                                Payslips {payslips.length > 0 ? `(${payslips.length})` : ''}
                            </button>
                        </div>
                    )}

                    {/* Employee Breakdown */}
                    {activeTab === 'employees' && payRun.employees && payRun.employees.length > 0 && (
                        <div className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
                            <div className="bg-slate-50 dark:bg-slate-700/50 px-4 py-3">
                                <h3 className="font-semibold text-slate-900 dark:text-white">Employee Breakdown</h3>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-slate-50 dark:bg-slate-700/30">
                                        <tr>
                                            <th className="px-4 py-2 text-left text-xs font-semibold text-slate-600 dark:text-slate-300">Employee</th>
                                            <th className="px-4 py-2 text-right text-xs font-semibold text-slate-600 dark:text-slate-300">Gross</th>
                                            <th className="px-4 py-2 text-right text-xs font-semibold text-slate-600 dark:text-slate-300">LOP</th>
                                            <th className="px-4 py-2 text-right text-xs font-semibold text-slate-600 dark:text-slate-300">PF</th>
                                            <th className="px-4 py-2 text-right text-xs font-semibold text-slate-600 dark:text-slate-300">ESI</th>
                                            <th className="px-4 py-2 text-right text-xs font-semibold text-slate-600 dark:text-slate-300">PT</th>
                                            <th className="px-4 py-2 text-right text-xs font-semibold text-slate-600 dark:text-slate-300">Total Ded.</th>
                                            <th className="px-4 py-2 text-right text-xs font-semibold text-slate-600 dark:text-slate-300">Net Pay</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                                        {payRun.employees.map((emp) => (
                                            <tr key={emp.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30">
                                                <td className="px-4 py-2">
                                                    <div className="text-sm font-medium text-slate-900 dark:text-white">{emp.employeeName}</div>
                                                    <div className="text-xs text-slate-500 dark:text-slate-400">{emp.employeeNumber}</div>
                                                </td>
                                                <td className="px-4 py-2 text-right text-sm text-slate-700 dark:text-slate-300">{formatCurrency(emp.grossSalary)}</td>
                                                <td className="px-4 py-2 text-right text-sm text-orange-600 dark:text-orange-400">{formatCurrency(emp.lopDeduction || 0)}</td>
                                                <td className="px-4 py-2 text-right text-sm text-slate-700 dark:text-slate-300">{formatCurrency(emp.pfEmployee)}</td>
                                                <td className="px-4 py-2 text-right text-sm text-slate-700 dark:text-slate-300">{formatCurrency(emp.esiEmployee)}</td>
                                                <td className="px-4 py-2 text-right text-sm text-slate-700 dark:text-slate-300">{formatCurrency(emp.professionalTax)}</td>
                                                <td className="px-4 py-2 text-right text-sm text-red-600 dark:text-red-400">{formatCurrency(emp.totalDeductions)}</td>
                                                <td className="px-4 py-2 text-right text-sm font-medium text-emerald-600 dark:text-emerald-400">{formatCurrency(emp.netSalary)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Payslips Tab */}
                    {activeTab === 'payslips' && (
                        <div className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
                            <div className="bg-slate-50 dark:bg-slate-700/50 px-4 py-3">
                                <h3 className="font-semibold text-slate-900 dark:text-white">Generated Payslips</h3>
                            </div>
                            {loadingPayslips ? (
                                <div className="p-8 text-center text-slate-600 dark:text-slate-400">
                                    Loading payslips...
                                </div>
                            ) : payslips.length === 0 ? (
                                <div className="p-8 text-center text-slate-600 dark:text-slate-400">
                                    No payslips generated yet
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-slate-50 dark:bg-slate-700/30">
                                            <tr>
                                                <th className="px-4 py-2 text-left text-xs font-semibold text-slate-600 dark:text-slate-300">Payslip #</th>
                                                <th className="px-4 py-2 text-left text-xs font-semibold text-slate-600 dark:text-slate-300">Employee</th>
                                                <th className="px-4 py-2 text-right text-xs font-semibold text-slate-600 dark:text-slate-300">Net Pay</th>
                                                <th className="px-4 py-2 text-center text-xs font-semibold text-slate-600 dark:text-slate-300">Email Sent</th>
                                                <th className="px-4 py-2 text-center text-xs font-semibold text-slate-600 dark:text-slate-300">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                                            {payslips.map((payslip) => (
                                                <tr key={payslip.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30">
                                                    <td className="px-4 py-3 text-sm text-slate-900 dark:text-white">{payslip.payslipNumber}</td>
                                                    <td className="px-4 py-3">
                                                        <div className="text-sm font-medium text-slate-900 dark:text-white">{payslip.employeeName}</div>
                                                        <div className="text-xs text-slate-500 dark:text-slate-400">{payslip.employeeNumber}</div>
                                                    </td>
                                                    <td className="px-4 py-3 text-right text-sm font-medium text-emerald-600 dark:text-emerald-400">
                                                        {formatCurrency(payslip.netSalary)}
                                                    </td>
                                                    <td className="px-4 py-3 text-center">
                                                        {payslip.emailSent ? (
                                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300">
                                                                <CheckCircle className="w-3 h-3 mr-1" />
                                                                Sent
                                                            </span>
                                                        ) : (
                                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300">
                                                                Pending
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <div className="flex items-center justify-center gap-2">
                                                            <Button
                                                                size="sm"
                                                                variant="ghost"
                                                                onClick={() => handleDownloadPayslip(payslip.id, payslip.employeeId)}
                                                                title="Download PDF"
                                                            >
                                                                <Download className="w-4 h-4" />
                                                            </Button>
                                                            <Button
                                                                size="sm"
                                                                variant="ghost"
                                                                onClick={() => handleEmailPayslip(payslip.id)}
                                                                title="Send Email"
                                                            >
                                                                <Send className="w-4 h-4" />
                                                            </Button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between gap-3 p-6 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50">
                    <div className="flex items-center gap-2">
                        {/* Cancel button - show for DRAFT and PENDING_APPROVAL */}
                        {(payRun.status === 'DRAFT' || payRun.status === 'PENDING_APPROVAL') && (
                            <Button onClick={onCancel} disabled={loading} variant="outline" className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50">
                                <X className="w-4 h-4" />
                                Cancel Pay Run
                            </Button>
                        )}
                        {/* Delete button - show for DRAFT, CANCELLED, and COMPLETED */}
                        {(payRun.status === 'DRAFT' || payRun.status === 'CANCELLED' || payRun.status === 'COMPLETED') && (
                            <Button onClick={onDelete} disabled={loading} variant="outline" className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50">
                                <X className="w-4 h-4" />
                                Delete Pay Run
                            </Button>
                        )}
                    </div>
                    <div className="flex items-center gap-3">
                        {payRun.status === 'DRAFT' && (
                            <Button onClick={onCalculate} disabled={loading} className="gap-2">
                                <Calculator className="w-4 h-4" />
                                Calculate Payroll
                            </Button>
                        )}
                        {payRun.status === 'PENDING_APPROVAL' && (
                            <>
                                <Button onClick={onCalculate} disabled={loading} variant="outline" className="gap-2">
                                    <RefreshCw className="w-4 h-4" />
                                    Recalculate
                                </Button>
                                <Button onClick={onApprove} disabled={loading} className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white">
                                    <Check className="w-4 h-4" />
                                    Approve
                                </Button>
                            </>
                        )}
                        {payRun.status === 'APPROVED' && (
                            <>
                                <Button onClick={onGeneratePayslips} disabled={loading} variant="outline" className="gap-2">
                                    <FileText className="w-4 h-4" />
                                    Generate Payslips
                                </Button>
                                <Button onClick={onComplete} disabled={loading} className="gap-2 bg-green-600 hover:bg-green-700 text-white">
                                    <CheckCircle className="w-4 h-4" />
                                    Mark Complete
                                </Button>
                            </>
                        )}
                        {payRun.status === 'COMPLETED' && (
                            <Button onClick={onGeneratePayslips} disabled={loading} className="gap-2">
                                <FileText className="w-4 h-4" />
                                Generate Payslips
                            </Button>
                        )}
                        <Button onClick={onClose} variant="outline">
                            Close
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
