import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ChevronLeft,
    Calculator,
    CheckCircle,
    Check,
    RefreshCw,
    FileText,
    Download,
    Send,
    X,
    Calendar,
    Clock,
    DollarSign,
    AlertCircle,
    MoreVertical,
    HelpCircle,
    Trash2
} from 'lucide-react';
import { Button } from '../components/ui/button';
import PayRunEmployeeList from '../components/PayRunEmployeeList';
import PayRunEmployeeDrawer from '../components/PayRunEmployeeDrawer';
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

export default function PayRunDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user: authUser, logout } = useAuth();
    const { darkMode } = useTheme();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [organization, setOrganization] = useState(null);
    const [payRun, setPayRun] = useState(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('employees');
    const [payslips, setPayslips] = useState([]);
    const [loadingPayslips, setLoadingPayslips] = useState(false);
    const [showRecordPayment, setShowRecordPayment] = useState(false);
    const [selectedEmployees, setSelectedEmployees] = useState([]);
    const [showMenu, setShowMenu] = useState(false);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [drawerEmployee, setDrawerEmployee] = useState(null);

    const user = authUser || JSON.parse(localStorage.getItem('user') || 'null');

    useEffect(() => {
        fetchOrganization();
    }, []);

    useEffect(() => {
        if (organization?.id) {
            fetchPayRunDetails();
        }
    }, [organization, id]);

    useEffect(() => {
        if (payRun && (payRun.status === 'COMPLETED' || payRun.status === 'APPROVED') && organization?.id) {
            fetchPayslips();
        }
    }, [payRun?.status, organization?.id, id]);

    const fetchOrganization = async () => {
        try {
            const selectedOrgId = localStorage.getItem('selectedOrganizationId');
            if (!selectedOrgId) {
                navigate('/select-organization');
                return;
            }
            const response = await api.get('/organizations');
            const org = response.data?.find(o => o.id === parseInt(selectedOrgId));
            if (org) {
                setOrganization(org);
            }
        } catch (error) {
            console.error('Failed to fetch organization:', error);
        }
    };

    const fetchPayRunDetails = async () => {
        try {
            setLoading(true);
            const response = await api.get(`/pay-runs/${id}/details`, {
                headers: {
                    'X-Tenant-ID': organization.id
                }
            });
            setPayRun(response.data);
        } catch (error) {
            console.error('Failed to fetch pay run details:', error);
            alert('Failed to fetch pay run details');
        } finally {
            setLoading(false);
        }
    };

    const fetchPayslips = async () => {
        try {
            setLoadingPayslips(true);
            const response = await api.get(`/payslips/pay-run/${id}`, {
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

    const handleCalculate = async () => {
        try {
            setActionLoading(true);
            const response = await api.post(`/pay-runs/${id}/calculate`, {}, {
                headers: {
                    'X-Tenant-ID': organization.id
                }
            });
            setPayRun(response.data);
            alert('Pay run calculated successfully!');
            fetchPayRunDetails();
        } catch (error) {
            console.error('Failed to calculate pay run:', error);
            console.error('Error response data:', error.response?.data);
            console.error('Full error response:', JSON.stringify(error.response?.data, null, 2));
            const errorMessage = error.response?.data?.error || error.response?.data?.message || JSON.stringify(error.response?.data) || 'Failed to calculate pay run';
            alert('Calculation Error: ' + errorMessage);
        } finally {
            setActionLoading(false);
        }
    };

    const handleSubmitForApproval = async () => {
        try {
            setActionLoading(true);
            const response = await api.post(`/pay-runs/${id}/submit`, {}, {
                headers: {
                    'X-Tenant-ID': organization.id,
                    'X-User-ID': user?.id || 1
                }
            });
            setPayRun(response.data);
            alert('Pay run submitted for approval');
        } catch (error) {
            console.error('Failed to submit pay run:', error);
            alert(error.response?.data?.error || 'Failed to submit pay run');
        } finally {
            setActionLoading(false);
        }
    };

    const handleApprove = async () => {
        try {
            setActionLoading(true);
            const response = await api.post(`/pay-runs/${id}/approve`, {}, {
                headers: {
                    'X-Tenant-ID': organization.id,
                    'X-User-ID': user?.id || 1
                }
            });
            setPayRun(response.data);
            alert('Pay run approved');
        } catch (error) {
            console.error('Failed to approve pay run:', error);
            alert(error.response?.data?.error || 'Failed to approve pay run');
        } finally {
            setActionLoading(false);
        }
    };

    const handleComplete = async () => {
        try {
            setActionLoading(true);
            const response = await api.post(`/pay-runs/${id}/complete`, {}, {
                headers: {
                    'X-Tenant-ID': organization.id
                }
            });
            setPayRun(response.data);
            alert('Pay run completed successfully! Redirecting to History tab...');
            // Navigate back to pay runs page after a short delay
            setTimeout(() => {
                navigate('/pay-runs?tab=history');
            }, 1500);
        } catch (error) {
            console.error('Failed to complete pay run:', error);
            alert(error.response?.data?.error || 'Failed to complete pay run');
        } finally {
            setActionLoading(false);
        }
    };

    const handleRecordPayment = async (paymentData) => {
        try {
            setActionLoading(true);
            const response = await api.post(`/pay-runs/${id}/record-payment`, {
                employeeIds: paymentData.employeeIds,
                paymentDate: paymentData.paymentDate
            }, {
                headers: {
                    'X-Tenant-ID': organization.id
                }
            });
            setPayRun(response.data);
            setShowRecordPayment(false);
            alert('Payment recorded successfully');
            fetchPayRunDetails();
        } catch (error) {
            console.error('Failed to record payment:', error);
            alert(error.response?.data?.error || 'Failed to record payment');
        } finally {
            setActionLoading(false);
        }
    };

    const handleCancel = async () => {
        if (!confirm('Are you sure you want to cancel this pay run?')) return;
        try {
            setActionLoading(true);
            await api.post(`/pay-runs/${id}/cancel`, {}, {
                headers: {
                    'X-Tenant-ID': organization.id
                }
            });
            navigate('/pay-runs');
        } catch (error) {
            console.error('Failed to cancel pay run:', error);
            alert(error.response?.data?.error || 'Failed to cancel pay run');
        } finally {
            setActionLoading(false);
        }
    };

    const handleDelete = async () => {
        // For completed pay runs, require a deletion reason
        if (payRun?.status === 'COMPLETED') {
            const reason = prompt('⚠️ DELETING COMPLETED PAY RUN\n\nThis pay run has been completed and processed.\nPlease provide a reason for deletion (required):');
            
            if (reason === null) {
                // User cancelled
                return;
            }
            
            if (!reason || reason.trim() === '') {
                alert('Deletion reason is required for completed pay runs.');
                return;
            }
            
            // Additional confirmation for completed pay runs
            if (!confirm(`Are you sure you want to delete this COMPLETED pay run?\n\nReason: ${reason}\n\nThis action cannot be undone and will remove all payment records.`)) {
                return;
            }
        } else {
            // Standard confirmation for draft/cancelled pay runs
            if (!confirm('Are you sure you want to delete this pay run?')) return;
        }
        
        try {
            setActionLoading(true);
            await api.delete(`/pay-runs/${id}`, {
                headers: {
                    'X-Tenant-ID': organization.id
                }
            });
            navigate('/pay-runs');
        } catch (error) {
            console.error('Failed to delete pay run:', error);
            alert(error.response?.data?.error || 'Failed to delete pay run');
        } finally {
            setActionLoading(false);
        }
    };

    const handleGeneratePayslips = async () => {
        try {
            setActionLoading(true);
            await api.post(`/payslips/generate/${id}`, {}, {
                headers: {
                    'X-Tenant-ID': organization.id
                }
            });
            alert('Payslips generated successfully!');
            fetchPayRunDetails();
        } catch (error) {
            console.error('Failed to generate payslips:', error);
            alert(error.response?.data?.error || 'Failed to generate payslips');
        } finally {
            setActionLoading(false);
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
        }
    };

    const handleEmailPayslip = async (payslipId) => {
        try {
            await api.post(`/payslips/${payslipId}/send-email`, {}, {
                headers: {
                    'X-Tenant-ID': organization.id
                }
            });
            alert('Payslip email sent successfully!');
            fetchPayslips();
        } catch (error) {
            console.error('Failed to send payslip email:', error);
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR'
        }).format(amount || 0);
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
                <RefreshCw className="w-8 h-8 animate-spin text-pink-500" />
            </div>
        );
    }

    if (!payRun) return null;

    return (
        <div className="h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-white dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex overflow-hidden">
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            <div className={`flex-1 min-w-0 flex flex-col h-screen transition-all duration-300 ${sidebarOpen ? 'ml-56' : 'ml-0'}`}>
                <AppHeader
                    sidebarOpen={sidebarOpen}
                    setSidebarOpen={setSidebarOpen}
                    organization={organization}
                    user={user}
                    logout={logout}
                />

                <div className="flex-1 overflow-y-auto p-6">
                    <div className="max-w-7xl mx-auto">
                        {/* Page Header (Zoho Image 2 Alignment) */}
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => navigate('/pay-runs')}
                                    className="p-2 hover:bg-white dark:hover:bg-slate-800 rounded-lg transition-colors"
                                >
                                    <ChevronLeft className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                                </button>
                                <div className="flex items-center gap-3">
                                    <h1 className="text-xl font-bold text-slate-900 dark:text-white uppercase tracking-tight">
                                        Payroll Run
                                    </h1>
                                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded uppercase tracking-wider ${STATUS_COLORS[payRun.status]}`}>
                                        {payRun.status.replace('_', ' ')}
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                                    <div className="flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-400">
                                        <FileText className="w-4 h-4" />
                                    </div>
                                </button>
                                {/* Debug: Log status */}
                                {console.log('PayRun Status:', payRun.status, 'Is DRAFT?', payRun.status === 'DRAFT')}
                                {payRun.status === 'DRAFT' && (
                                    <Button onClick={handleSubmitForApproval} disabled={actionLoading} className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold text-sm px-6">
                                        Submit and Approve
                                    </Button>
                                )}
                                {payRun.status === 'PENDING_APPROVAL' && (
                                    <Button onClick={handleApprove} disabled={actionLoading} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm px-6">
                                        Approve
                                    </Button>
                                )}
                                {(payRun.status === 'APPROVED' || payRun.status === 'PROCESSING') && (
                                    <>
                                        <Button onClick={() => setShowRecordPayment(true)} disabled={actionLoading} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm px-6">
                                            Record Payment
                                        </Button>
                                        <Button onClick={handleComplete} disabled={actionLoading} className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm px-6">
                                            <CheckCircle className="w-4 h-4 mr-2" />
                                            Complete Pay Run
                                        </Button>
                                    </>
                                )}

                                <div className="relative">
                                    <button
                                        onClick={() => setShowMenu(!showMenu)}
                                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700"
                                    >
                                        <MoreVertical className="w-4 h-4 text-slate-400" />
                                    </button>

                                    {showMenu && (
                                        <>
                                            <div
                                                className="fixed inset-0 z-10"
                                                onClick={() => setShowMenu(false)}
                                            />
                                            <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 z-20 overflow-hidden">
                                                {(payRun.status === 'DRAFT' || payRun.status === 'APPROVED' || payRun.status === 'COMPLETED' || payRun.status === 'CANCELLED') && (
                                                    <button
                                                        onClick={() => {
                                                            setShowMenu(false);
                                                            handleCancel();
                                                        }}
                                                        className="w-full text-left px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors flex items-center gap-2"
                                                    >
                                                        <X className="w-4 h-4" />
                                                        Cancel Pay Run
                                                    </button>
                                                )}
                                                {(payRun.status === 'DRAFT' || payRun.status === 'COMPLETED' || payRun.status === 'CANCELLED') && (
                                                    <button
                                                        onClick={() => {
                                                            setShowMenu(false);
                                                            handleDelete();
                                                        }}
                                                        className="w-full text-left px-4 py-2.5 text-sm text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors flex items-center gap-2"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                        Delete Pay Run
                                                    </button>
                                                )}
                                            </div>
                                        </>
                                    )}
                                </div>
                                <button className="p-2 bg-rose-500 text-white rounded-lg">
                                    <HelpCircle className="w-4 h-4 font-bold" />
                                </button>
                            </div>
                        </div>


                        {/* Overdue Alert (Zoho Style) */}
                        {(() => {
                            const payDate = new Date(payRun.payDate);
                            const now = new Date();
                            const diffTime = Math.abs(now - payDate);
                            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                            const isOverdue = now > payDate && payRun.status !== 'COMPLETED';

                            if (isOverdue) {
                                return (
                                    <div className="bg-rose-50 border border-rose-100 rounded-lg p-3 flex items-center gap-3 mb-6 animate-in slide-in-from-top-2">
                                        <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />
                                        <p className="text-sm text-rose-700">
                                            This payment is overdue by <strong>{diffDays} day(s)</strong>. Please pay your employees immediately. If you have paid them already, approve this payroll and record the payment.
                                        </p>
                                    </div>
                                );
                            }
                            return null;
                        })()}

                        {/* Financial Summary Grid (Zoho Image 2 Alignment) */}
                        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm mb-6 overflow-hidden">
                            <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-100 dark:divide-slate-700">
                                {/* Period & Core Stats */}
                                <div className="p-6">
                                    <div className="flex items-center gap-2 mb-4">
                                        <p className="text-xs text-slate-500 dark:text-slate-400">
                                            Period: <span className="font-bold text-slate-900 dark:text-white">
                                                {new Date(payRun.payPeriodStart).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
                                            </span>
                                        </p>
                                        <span className="text-xs text-slate-400 hover:text-slate-600 cursor-pointer">| 31 Base Days <Calculator className="w-3 h-3 inline ml-1" /></span>
                                    </div>
                                    <div className="flex items-center gap-8">
                                        <div>
                                            <p className="text-[20px] font-bold text-slate-900 dark:text-white">{formatCurrency(payRun.totalGrossPay + (payRun.totalEmployerContribution || 0))}</p>
                                            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mt-1">PAYROLL COST</p>
                                        </div>
                                        <div>
                                            <p className="text-[20px] font-bold text-slate-900 dark:text-white">{formatCurrency(payRun.totalNetPay)}</p>
                                            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mt-1">TOTAL NET PAY</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Pay Day & Employee Count */}
                                <div className="p-6 flex flex-col items-center justify-center text-center">
                                    <div className="flex flex-col items-center border border-slate-100 dark:border-slate-700 p-3 rounded-lg min-w-[120px]">
                                        <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">PAY DAY</p>
                                        <p className="text-3xl font-black text-slate-900 dark:text-white">{new Date(payRun.payDate).getDate()}</p>
                                        <p className="text-[10px] text-slate-500 font-bold uppercase mt-1">
                                            {new Date(payRun.payDate).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
                                        </p>
                                    </div>
                                    <p className="text-xs font-bold text-slate-600 dark:text-slate-400 mt-2">
                                        {payRun.employeeCount} Employees
                                    </p>
                                </div>

                                {/* Taxes & Deductions Breakdown */}
                                <div className="p-6">
                                    <div className="space-y-3">
                                        <h4 className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-2">Taxes & Deductions</h4>
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-slate-500">Taxes</span>
                                            <span className="font-semibold text-slate-900 dark:text-white">{formatCurrency(payRun.employees?.reduce((sum, e) => sum + (e.tds || 0) + (e.professionalTax || 0), 0) || 0)}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-slate-500">Benefits</span>
                                            <span className="font-semibold text-slate-900 dark:text-white">{formatCurrency(0)}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-slate-500">Donations</span>
                                            <span className="font-semibold text-slate-900 dark:text-white">{formatCurrency(0)}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm pt-2 border-t border-slate-50 dark:border-slate-700">
                                            <span className="text-slate-500 font-bold">Total Deductions</span>
                                            <span className="font-bold text-slate-900 dark:text-white">{formatCurrency(payRun.totalDeductions)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Tabs Navigation (Zoho Image 2 Alignment) */}
                        <div className="flex gap-8 mb-6 border-b border-slate-200 dark:border-slate-700 overflow-x-auto no-scrollbar">
                            {[
                                { id: 'employees', label: 'Employee Summary' },
                                { id: 'taxes', label: 'Taxes & Deductions' },
                                { id: 'insights', label: 'Overall Insights' }
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`pb-4 text-sm font-bold transition-all relative whitespace-nowrap ${activeTab === tab.id
                                        ? 'text-indigo-600 dark:text-indigo-400'
                                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'
                                        }`}
                                >
                                    {tab.label}
                                    {activeTab === tab.id && (
                                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 dark:bg-indigo-400" />
                                    )}
                                </button>
                            ))}
                        </div>

                        {/* Tab Content */}
                        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden mb-8">
                            {activeTab === 'employees' ? (
                                <div className="p-0">
                                    <PayRunEmployeeList
                                        payRun={payRun}
                                        organization={organization}
                                        onUpdate={() => fetchPayRunDetails()}
                                        selectable={(payRun.status === 'APPROVED' || payRun.status === 'PROCESSING' || payRun.status === 'DRAFT')}
                                        selectedEmployees={selectedEmployees}
                                        onSelectionChange={setSelectedEmployees}
                                        onEmployeeClick={(employee) => {
                                            setDrawerEmployee(employee);
                                            setDrawerOpen(true);
                                        }}
                                    />
                                </div>
                            ) : activeTab === 'taxes' ? (
                                <div className="p-6">
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Taxes & Deductions Summary</h3>

                                    {/* Statutory Deductions */}
                                    <div className="space-y-6">
                                        {/* EPF Section */}
                                        <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-4">
                                            <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
                                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                                Employee Provident Fund (EPF)
                                            </h4>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                <div>
                                                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Employee Contribution</p>
                                                    <p className="text-lg font-bold text-slate-900 dark:text-white">
                                                        {formatCurrency(payRun.employees?.reduce((sum, e) => sum + (e.pfEmployee || 0), 0) || 0)}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Employer Contribution</p>
                                                    <p className="text-lg font-bold text-slate-900 dark:text-white">
                                                        {formatCurrency(payRun.employees?.reduce((sum, e) => sum + (e.pfEmployer || 0), 0) || 0)}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Total EPF</p>
                                                    <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                                                        {formatCurrency(payRun.employees?.reduce((sum, e) => sum + (e.pfEmployee || 0) + (e.pfEmployer || 0), 0) || 0)}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* ESI Section */}
                                        <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-4">
                                            <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
                                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                                Employee State Insurance (ESI)
                                            </h4>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                <div>
                                                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Employee Contribution</p>
                                                    <p className="text-lg font-bold text-slate-900 dark:text-white">
                                                        {formatCurrency(payRun.employees?.reduce((sum, e) => sum + (e.esiEmployee || 0), 0) || 0)}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Employer Contribution</p>
                                                    <p className="text-lg font-bold text-slate-900 dark:text-white">
                                                        {formatCurrency(payRun.employees?.reduce((sum, e) => sum + (e.esiEmployer || 0), 0) || 0)}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Total ESI</p>
                                                    <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                                                        {formatCurrency(payRun.employees?.reduce((sum, e) => sum + (e.esiEmployee || 0) + (e.esiEmployer || 0), 0) || 0)}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Tax Deductions */}
                                        <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-4">
                                            <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
                                                <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                                                Tax Deductions
                                            </h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Professional Tax (PT)</p>
                                                    <p className="text-lg font-bold text-slate-900 dark:text-white">
                                                        {formatCurrency(payRun.employees?.reduce((sum, e) => sum + (e.professionalTax || 0), 0) || 0)}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">TDS (Tax Deducted at Source)</p>
                                                    <p className="text-lg font-bold text-slate-900 dark:text-white">
                                                        {formatCurrency(payRun.employees?.reduce((sum, e) => sum + (e.tds || 0), 0) || 0)}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Summary */}
                                        <div className="bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 rounded-lg p-4 border border-indigo-100 dark:border-indigo-800">
                                            <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">Total Statutory Obligations</h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Total Employee Deductions</p>
                                                    <p className="text-xl font-bold text-slate-900 dark:text-white">
                                                        {formatCurrency(payRun.totalDeductions || 0)}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Total Employer Contributions</p>
                                                    <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                                                        {formatCurrency(payRun.totalEmployerContributions || 0)}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : activeTab === 'insights' ? (
                                <div className="p-6">
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Overall Insights</h3>

                                    <div className="space-y-6">
                                        {/* Payroll Cost Breakdown */}
                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-4 border border-blue-100 dark:border-blue-800">
                                                <p className="text-xs text-blue-600 dark:text-blue-400 font-bold uppercase tracking-wider mb-2">Gross Pay</p>
                                                <p className="text-2xl font-black text-slate-900 dark:text-white">{formatCurrency(payRun.totalGrossPay || 0)}</p>
                                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Total earnings before deductions</p>
                                            </div>
                                            <div className="bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 rounded-lg p-4 border border-emerald-100 dark:border-emerald-800">
                                                <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider mb-2">Net Pay</p>
                                                <p className="text-2xl font-black text-slate-900 dark:text-white">{formatCurrency(payRun.totalNetPay || 0)}</p>
                                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Amount to be paid</p>
                                            </div>
                                            <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-lg p-4 border border-amber-100 dark:border-amber-800">
                                                <p className="text-xs text-amber-600 dark:text-amber-400 font-bold uppercase tracking-wider mb-2">Deductions</p>
                                                <p className="text-2xl font-black text-slate-900 dark:text-white">{formatCurrency(payRun.totalDeductions || 0)}</p>
                                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Total withholdings</p>
                                            </div>
                                            <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg p-4 border border-purple-100 dark:border-purple-800">
                                                <p className="text-xs text-purple-600 dark:text-purple-400 font-bold uppercase tracking-wider mb-2">Employer Cost</p>
                                                <p className="text-2xl font-black text-slate-900 dark:text-white">{formatCurrency(payRun.totalEmployerContributions || 0)}</p>
                                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Statutory contributions</p>
                                            </div>
                                        </div>

                                        {/* Employee Statistics */}
                                        <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-6">
                                            <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-4">Employee Statistics</h4>
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                                <div className="text-center">
                                                    <p className="text-3xl font-black text-indigo-600 dark:text-indigo-400">{payRun.employeeCount || 0}</p>
                                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Total Employees</p>
                                                </div>
                                                <div className="text-center">
                                                    <p className="text-3xl font-black text-emerald-600 dark:text-emerald-400">
                                                        {payRun.employees?.filter(e => e.status === 'CALCULATED' || e.status === 'PAID').length || 0}
                                                    </p>
                                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Processed</p>
                                                </div>
                                                <div className="text-center">
                                                    <p className="text-3xl font-black text-amber-600 dark:text-amber-400">
                                                        {payRun.employees?.filter(e => e.status === 'PENDING').length || 0}
                                                    </p>
                                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Pending</p>
                                                </div>
                                                <div className="text-center">
                                                    <p className="text-3xl font-black text-slate-600 dark:text-slate-400">
                                                        {formatCurrency((payRun.totalNetPay || 0) / (payRun.employeeCount || 1))}
                                                    </p>
                                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Avg Net Pay</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Cost Analysis */}
                                        <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-6">
                                            <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-4">Total Payroll Cost</h4>
                                            <div className="space-y-3">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-sm text-slate-600 dark:text-slate-400">Gross Salaries</span>
                                                    <span className="text-sm font-bold text-slate-900 dark:text-white">{formatCurrency(payRun.totalGrossPay || 0)}</span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-sm text-slate-600 dark:text-slate-400">Employer Contributions (EPF, ESI)</span>
                                                    <span className="text-sm font-bold text-slate-900 dark:text-white">{formatCurrency(payRun.totalEmployerContributions || 0)}</span>
                                                </div>
                                                <div className="border-t border-slate-200 dark:border-slate-700 pt-3 flex justify-between items-center">
                                                    <span className="text-base font-bold text-slate-900 dark:text-white">Total Cost to Company</span>
                                                    <span className="text-xl font-black text-indigo-600 dark:text-indigo-400">
                                                        {formatCurrency((payRun.totalGrossPay || 0) + (payRun.totalEmployerContributions || 0))}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : activeTab === 'payslips' ? (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead className="bg-slate-50 dark:bg-slate-800/50">
                                            <tr>
                                                <th className="px-6 py-4 text-left font-semibold text-slate-600 dark:text-slate-400">Payslip #</th>
                                                <th className="px-6 py-4 text-left font-semibold text-slate-600 dark:text-slate-400">Employee</th>
                                                <th className="px-6 py-4 text-right font-semibold text-slate-600 dark:text-slate-400">Net Pay</th>
                                                <th className="px-6 py-4 text-center font-semibold text-slate-600 dark:text-slate-400">Email Status</th>
                                                <th className="px-6 py-4 text-center font-semibold text-slate-600 dark:text-slate-400">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                                            {loadingPayslips ? (
                                                <tr><td colSpan="5" className="px-6 py-12 text-center text-slate-400 italic">Loading payslips...</td></tr>
                                            ) : payslips.length === 0 ? (
                                                <tr><td colSpan="5" className="px-6 py-12 text-center text-slate-400 italic">No payslips generated for this run</td></tr>
                                            ) : (
                                                payslips.map((ps) => (
                                                    <tr key={ps.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                                                        <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{ps.payslipNumber}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="font-semibold text-slate-900 dark:text-white">{ps.employeeName}</div>
                                                            <div className="text-xs text-slate-500">{ps.employeeNumber}</div>
                                                        </td>
                                                        <td className="px-6 py-4 text-right font-bold text-emerald-600">{formatCurrency(ps.netSalary)}</td>
                                                        <td className="px-6 py-4 text-center">
                                                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${ps.emailSent ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                                                                {ps.emailSent ? 'Sent' : 'Pending'}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 text-center">
                                                            <div className="flex justify-center gap-2">
                                                                <Button size="sm" variant="ghost" onClick={() => handleDownloadPayslip(ps.id, ps.employeeId)}>
                                                                    <Download className="w-4 h-4" />
                                                                </Button>
                                                                <Button size="sm" variant="ghost" onClick={() => handleEmailPayslip(ps.id)}>
                                                                    <Send className="w-4 h-4" />
                                                                </Button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            ) : null}
                        </div>
                    </div>
                </div>
            </div>
            {showRecordPayment && (
                <RecordPaymentModal
                    onClose={() => setShowRecordPayment(false)}
                    onRecord={handleRecordPayment}
                    payRun={payRun}
                    selectedEmployeeIds={selectedEmployees}
                    loading={actionLoading}
                />
            )}
            {drawerOpen && drawerEmployee && (
                <PayRunEmployeeDrawer
                    employee={drawerEmployee}
                    payRun={payRun}
                    organization={organization}
                    onClose={() => {
                        setDrawerOpen(false);
                        setDrawerEmployee(null);
                    }}
                    onUpdate={() => fetchPayRunDetails()}
                />
            )}
        </div>
    );
}

function RecordPaymentModal({ onClose, onRecord, payRun, selectedEmployeeIds, loading }) {
    const [formData, setFormData] = useState({
        paymentDate: new Date().toISOString().split('T')[0],
        allEmployees: selectedEmployeeIds.length === 0
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onRecord({
            employeeIds: formData.allEmployees ? [] : selectedEmployeeIds,
            paymentDate: formData.paymentDate
        });
    };

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700 bg-emerald-50/50 dark:bg-emerald-900/10">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <DollarSign className="w-5 h-5 text-emerald-600" />
                            Record Payment
                        </h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Confirm payment disbursement for employees</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors">
                        <X className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="bg-emerald-50 dark:bg-emerald-900/10 p-4 rounded-xl border border-emerald-100 dark:border-emerald-800/50">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-sm text-slate-600 dark:text-slate-400">Total Net Pay to Disbursement:</span>
                            <span className="text-lg font-bold text-emerald-600">
                                {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(payRun.totalNetPay)}
                            </span>
                        </div>
                        <p className="text-[10px] text-emerald-700 dark:text-emerald-400">
                            {selectedEmployeeIds.length > 0
                                ? `Recording payment for ${selectedEmployeeIds.length} selected employees.`
                                : `Recording payment for all ${payRun.employeeCount} employees.`}
                        </p>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1.5">
                            Payment Date
                        </label>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="date"
                                className="w-full pl-10 pr-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500 dark:bg-slate-700 dark:text-white outline-none"
                                value={formData.paymentDate}
                                onChange={(e) => setFormData({ ...formData, paymentDate: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-2 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-100 dark:border-slate-600">
                        <input
                            type="checkbox"
                            role="checkbox"
                            id="payAll"
                            checked={formData.allEmployees}
                            onChange={(e) => setFormData({ ...formData, allEmployees: e.target.checked })}
                            className="w-4 h-4 rounded text-emerald-600 border-slate-300 focus:ring-emerald-500 cursor-pointer"
                        />
                        <label htmlFor="payAll" className="text-sm text-slate-700 dark:text-slate-200 cursor-pointer">
                            Record payment for all employees in this run
                        </label>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-700">
                        <Button type="button" variant="outline" onClick={onClose} className="px-6">
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={loading}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 font-bold shadow-lg shadow-emerald-500/20"
                        >
                            {loading ? (
                                <div className="flex items-center gap-2">
                                    <RefreshCw className="w-4 h-4 animate-spin" />
                                    Recording...
                                </div>
                            ) : 'Confirm Payment'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
