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
    Calendar,
    AlertCircle,
    RefreshCw,
    Trash2
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Checkbox } from '../components/ui/checkbox';
import PayRunEmployeeList from '../components/PayRunEmployeeList';
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
    const [actionLoading, setActionLoading] = useState(false);

    // Check URL query parameter for tab
    const searchParams = new URLSearchParams(window.location.search);
    const tabParam = searchParams.get('tab');
    const [activeTab, setActiveTab] = useState(tabParam === 'history' ? 'history' : 'active');
    const [selectedPayRun, setSelectedPayRun] = useState(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);

    // First payrun date selection modal state
    const [showFirstPayRunModal, setShowFirstPayRunModal] = useState(false);
    const [showPriorPayrollModal, setShowPriorPayrollModal] = useState(false);
    const [customPayPeriod, setCustomPayPeriod] = useState({
        payPeriodStart: '',
        payPeriodEnd: '',
        payDate: ''
    });

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
            // Interceptor will automatically add X-Tenant-ID header
            const response = await api.get('/pay-runs');
            console.log('Fetched pay runs:', response.data);
            setPayRuns(response.data || []);
            setLoading(false);
        } catch (error) {
            console.error('Failed to fetch pay runs:', error);
            setLoading(false);
        }
    };

    const getNextPayRunDates = async () => {
        // Helper to calculate next pay period based on last completed run
        const calculateNextPeriod = (lastRun) => {
            let nextStart, nextEnd;

            if (lastRun && lastRun.payPeriodEnd) {
                // Start from the day after last pay period ended
                const lastEndDate = new Date(lastRun.payPeriodEnd);
                nextStart = new Date(lastEndDate);
                nextStart.setDate(lastEndDate.getDate() + 1);
                
                // End date is the last day of the month containing nextStart
                nextEnd = new Date(nextStart.getFullYear(), nextStart.getMonth() + 1, 0);
            } else {
                // No previous pay runs - start from 1st of current month
                const now = new Date();
                nextStart = new Date(now.getFullYear(), now.getMonth(), 1);
                nextEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
            }

            // Validation: Ensure start is before end
            if (nextStart > nextEnd) {
                // If start is after end (shouldn't happen but safety check)
                // Move to next month
                nextStart = new Date(nextEnd.getFullYear(), nextEnd.getMonth() + 1, 1);
                nextEnd = new Date(nextStart.getFullYear(), nextStart.getMonth() + 1, 0);
            }

            return { nextStart, nextEnd };
        };

        try {
            // Fetch pay schedule configuration
            const orgId = organization?.id || localStorage.getItem('organizationId');
            const scheduleResponse = await api.get(`/pay-schedules/organization/${orgId}/default`);
            const paySchedule = scheduleResponse.data;

            // Get completed pay runs sorted by end date
            const completedRuns = payRuns.filter(pr => pr.status === 'COMPLETED');
            const sortedRuns = [...completedRuns].sort((a, b) => new Date(b.payPeriodEnd) - new Date(a.payPeriodEnd));
            const lastRun = sortedRuns[0];
            
            const { nextStart, nextEnd } = calculateNextPeriod(lastRun);
            let nextPayDate;

            // Use pay schedule configuration for pay date
            if (paySchedule && paySchedule.payDay) {
                if (paySchedule.payDay <= 0 || paySchedule.payDay >= 28) {
                    // Last day of the pay period month
                    nextPayDate = new Date(nextEnd);
                } else {
                    // Specific day of the month AFTER the pay period ends
                    const payMonth = nextEnd.getMonth() + 1;
                    const payYear = payMonth > 11 ? nextEnd.getFullYear() + 1 : nextEnd.getFullYear();
                    const actualPayMonth = payMonth > 11 ? 0 : payMonth;
                    nextPayDate = new Date(payYear, actualPayMonth, paySchedule.payDay);
                }
            } else {
                // Default: last day of the pay period month
                nextPayDate = new Date(nextEnd);
            }

            console.log('Calculated pay run dates:', {
                start: nextStart.toISOString().split('T')[0],
                end: nextEnd.toISOString().split('T')[0],
                payDate: nextPayDate.toISOString().split('T')[0]
            });

            return {
                payPeriodStart: nextStart.toISOString().split('T')[0],
                payPeriodEnd: nextEnd.toISOString().split('T')[0],
                payDate: nextPayDate.toISOString().split('T')[0],
                notes: `Automated draft for ${new Intl.DateTimeFormat('en-IN', { month: 'long', year: 'numeric' }).format(nextStart)}`
            };
        } catch (error) {
            console.warn('Pay Schedule not configured, using default:', error.response?.status);
            
            // Fallback to default logic
            const completedRuns = payRuns.filter(pr => pr.status === 'COMPLETED');
            const sortedRuns = [...completedRuns].sort((a, b) => new Date(b.payPeriodEnd) - new Date(a.payPeriodEnd));
            const lastRun = sortedRuns[0];
            
            const { nextStart, nextEnd } = calculateNextPeriod(lastRun);
            const nextPayDate = new Date(nextEnd);

            return {
                payPeriodStart: nextStart.toISOString().split('T')[0],
                payPeriodEnd: nextEnd.toISOString().split('T')[0],
                payDate: nextPayDate.toISOString().split('T')[0],
                notes: `Automated draft for ${new Intl.DateTimeFormat('en-IN', { month: 'long', year: 'numeric' }).format(nextStart)}`
            };
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

            // Step 1: Create the pay run
            const response = await api.post('/pay-runs', data);
            const newPayRun = response.data;
            console.log('Pay run created:', newPayRun.id);

            // Step 2: Auto-calculate the pay run
            console.log('Auto-calculating pay run...');
            const calculateResponse = await api.post(`/pay-runs/${newPayRun.id}/calculate`, {}, {
                headers: {
                    'X-Tenant-ID': organization?.id
                }
            });
            console.log('Pay run calculated successfully');

            // Step 3: Navigate to details page
            navigate(`/pay-runs/${newPayRun.id}`);

        } catch (error) {
            console.error('Failed to create/calculate pay run:', error);
            console.error('Error response:', error.response);
            alert(error.response?.data?.error || 'Failed to create pay run');
            setActionLoading(false);
        }
    };

    const handleCalculate = async (payRunId) => {
        try {
            setActionLoading(true);
            const response = await api.post(`/pay-runs/${payRunId}/calculate`, {}, {
                headers: {
                    'X-Tenant-ID': organization?.id
                }
            });
            setPayRuns(payRuns.map(pr => pr.id === payRunId ? response.data : pr));
            if (selectedPayRun?.id === payRunId) {
                fetchPayRunDetails(payRunId);
            }
            alert('Pay run calculated successfully!');
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

    const handleResetStuck = async () => {
        try {
            setActionLoading(true);
            const response = await api.post('/pay-runs/reset-stuck', {}, {
                headers: {
                    'X-Tenant-ID': organization?.id || localStorage.getItem('organizationId')
                }
            });
            alert(`Reset ${response.data.count} stuck pay run(s) to DRAFT status. Refreshing...`);
            fetchPayRuns();
        } catch (error) {
            console.error('Failed to reset stuck pay runs:', error);
            alert(error.response?.data?.error || 'Failed to reset stuck pay runs');
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
        // Find the pay run to check its status
        const payRunToDelete = payRuns.find(pr => pr.id === payRunId);
        
        // For completed pay runs, require a deletion reason
        if (payRunToDelete?.status === 'COMPLETED') {
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
            if (!confirm('Are you sure you want to delete this pay run? This action cannot be undone.')) {
                return;
            }
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
        // Obsolete: Details now handled by new page
        navigate(`/pay-runs/${payRunId}`);
    };

    const openDetails = (payRun) => {
        navigate(`/pay-runs/${payRun.id}`);
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
                        </div>

                        {/* Tab Switcher */}
                        <div className="flex items-center border-b border-slate-200 dark:border-slate-700 mb-6 font-Inter">
                            <button
                                onClick={() => setActiveTab('active')}
                                className={`px-6 py-3 text-sm font-semibold transition-colors relative ${activeTab === 'active'
                                    ? 'text-pink-600 dark:text-pink-400'
                                    : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'
                                    }`}
                            >
                                Active Pay Runs
                                {activeTab === 'active' && (
                                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-pink-600 dark:bg-pink-400" />
                                )}
                            </button>
                            <button
                                onClick={() => setActiveTab('history')}
                                className={`px-6 py-3 text-sm font-semibold transition-colors relative ${activeTab === 'history'
                                    ? 'text-pink-600 dark:text-pink-400'
                                    : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'
                                    }`}
                            >
                                Pay Run History
                                {activeTab === 'history' && (
                                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-pink-600 dark:bg-pink-400" />
                                )}
                            </button>
                        </div>

                        {/* First Time Setup Banner - Show based on organization settings */}
                        {activeTab === 'active' && payRuns.length === 0 && !loading && (
                            <div className="bg-gradient-to-r from-pink-50 to-rose-50 dark:from-slate-800 dark:to-slate-800 rounded-xl border border-pink-200 dark:border-pink-900/50 shadow-md mb-6 overflow-hidden">
                                <div className="p-6">
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl flex items-center justify-center flex-shrink-0">
                                            <Calendar className="w-6 h-6 text-white" />
                                        </div>
                                        <div className="flex-1">
                                            {organization?.hasRunPayroll === 'yes' ? (
                                                <>
                                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Record Your Previous Payrolls</h3>
                                                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                                                        You indicated that you've already run payrolls this financial year. 
                                                        Record your previous payroll data to ensure accurate YTD calculations.
                                                    </p>
                                                    <div className="flex gap-3">
                                                        <Button
                                                            onClick={() => setShowPriorPayrollModal(true)}
                                                            className="bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white font-semibold text-sm"
                                                        >
                                                            <Plus className="w-4 h-4 mr-2" />
                                                            Record Prior Payrolls
                                                        </Button>
                                                        <Button
                                                            onClick={() => {
                                                                const now = new Date();
                                                                setCustomPayPeriod({
                                                                    payPeriodStart: new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0],
                                                                    payPeriodEnd: new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0],
                                                                    payDate: new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0]
                                                                });
                                                                setShowFirstPayRunModal(true);
                                                            }}
                                                            variant="outline"
                                                            className="border-pink-300 text-pink-600 hover:bg-pink-50 font-semibold text-sm"
                                                        >
                                                            Skip & Start New Pay Run
                                                        </Button>
                                                    </div>
                                                </>
                                            ) : (
                                                <>
                                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Start Your First Pay Run</h3>
                                                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                                                        Welcome! This is your first payroll with PayrollPro. 
                                                        Select the pay period dates to begin processing your payroll.
                                                    </p>
                                                    <Button
                                                        onClick={() => {
                                                            const now = new Date();
                                                            setCustomPayPeriod({
                                                                payPeriodStart: new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0],
                                                                payPeriodEnd: new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0],
                                                                payDate: new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0]
                                                            });
                                                            setShowFirstPayRunModal(true);
                                                        }}
                                                        className="bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white font-semibold text-sm"
                                                    >
                                                        <Plus className="w-4 h-4 mr-2" />
                                                        Start First Pay Run
                                                    </Button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Next Pay Run Indicator - Show when there are completed pay runs */}
                        {activeTab === 'active' && payRuns.filter(pr => pr.status === 'COMPLETED').length > 0 && !payRuns.find(pr => ['DRAFT', 'CALCULATING', 'PENDING_APPROVAL', 'APPROVED', 'PROCESSING'].includes(pr.status)) && (
                            <div className="bg-gradient-to-r from-emerald-50 to-green-50 dark:from-slate-800 dark:to-slate-800 rounded-xl border border-emerald-200 dark:border-emerald-900/50 shadow-md mb-6 overflow-hidden">
                                <div className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-start gap-4">
                                            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center flex-shrink-0">
                                                <CheckCircle className="w-6 h-6 text-white" />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Ready for Next Pay Run</h3>
                                                <p className="text-sm text-slate-600 dark:text-slate-400">
                                                    Last payroll completed for {formatDate(payRuns.filter(pr => pr.status === 'COMPLETED').sort((a, b) => new Date(b.payPeriodEnd) - new Date(a.payPeriodEnd))[0]?.payPeriodEnd)}. 
                                                    Start processing next month's payroll.
                                                </p>
                                            </div>
                                        </div>
                                        <Button
                                            onClick={async () => {
                                                const dates = await getNextPayRunDates();
                                                handleCreatePayRun(dates);
                                            }}
                                            disabled={actionLoading}
                                            className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-semibold text-sm"
                                        >
                                            {actionLoading ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
                                            Draft Next Pay Run
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Current/Next Pay Run Banner (Zoho Image 1 Alignment) */}
                        {activeTab === 'active' && (() => {
                            const activeRun = payRuns.find(pr => ['DRAFT', 'CALCULATING', 'PENDING_APPROVAL', 'APPROVED', 'PROCESSING'].includes(pr.status));

                            if (activeRun) {
                                // Check if this run is "Ready" (Draft with no calculation yet)
                                const isReady = activeRun.status === 'DRAFT' && (activeRun.totalGrossPay === 0 || !activeRun.totalGrossPay);
                                const payDate = new Date(activeRun.payDate);
                                const now = new Date();
                                const isOverdue = now > payDate && activeRun.status !== 'COMPLETED';

                                if (isReady) {
                                    return (
                                        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200/60 dark:border-slate-700/60 shadow-md mb-6 overflow-hidden animate-in slide-in-from-top-4 duration-500">
                                            <div className="p-5 flex flex-col gap-6">
                                                <div className="flex items-center gap-2">
                                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                                                        Process Pay Run {formatDate(activeRun.payPeriodStart)} to {formatDate(activeRun.payPeriodEnd)}
                                                    </h3>
                                                    <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-indigo-600 text-white uppercase tracking-wider">
                                                        READY
                                                    </span>
                                                </div>

                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-12">
                                                        <div>
                                                            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-1">Employees' Net Pay</p>
                                                            <div className="bg-slate-100 dark:bg-slate-700/50 px-3 py-1.5 rounded flex items-center justify-center">
                                                                <p className="text-xs font-black text-slate-400 uppercase tracking-tighter">Yet to Process</p>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-1">Payment Date</p>
                                                            <p className="text-lg font-bold text-slate-900 dark:text-white">{formatDate(activeRun.payDate)}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-1">No. of Employees</p>
                                                            <p className="text-lg font-bold text-slate-900 dark:text-white">{activeRun.employeeCount}</p>
                                                        </div>
                                                    </div>

                                                    <Button
                                                        onClick={() => openDetails(activeRun)}
                                                        className="bg-indigo-500 hover:bg-indigo-600 dark:bg-indigo-600 dark:hover:bg-indigo-700 text-white font-bold text-sm px-6 py-2.5 rounded-lg h-auto shadow-lg shadow-indigo-500/20"
                                                    >
                                                        Create Pay Run
                                                    </Button>
                                                </div>

                                                {isOverdue && (
                                                    <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                                                        <AlertCircle className="w-4 h-4 text-amber-500" />
                                                        <p className="text-xs font-medium">You haven't processed this pay run and it's past the pay day.</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                }

                                // Processing summary for non-Ready states (Already calculated)
                                const totalPayrollCost = (activeRun.totalNetPay || 0) * 1.15;
                                const totalTaxesDeductions = (activeRun.totalNetPay || 0) * 0.15;

                                return (
                                    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200/60 dark:border-slate-700/60 shadow-md mb-6 overflow-hidden transition-all hover:shadow-lg animate-in fade-in duration-500">
                                        <div className="bg-slate-900 dark:bg-slate-950 p-4 flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-pink-500/20 rounded-lg flex items-center justify-center border border-pink-500/30">
                                                    <Calendar className="w-5 h-5 text-pink-500" />
                                                </div>
                                                <div>
                                                    <h3 className="text-sm font-bold text-white">Current Month Payroll summary</h3>
                                                    <p className="text-[10px] text-slate-400">
                                                        For {formatDate(activeRun.payPeriodStart)} - {formatDate(activeRun.payPeriodEnd)}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full uppercase tracking-wider ${STATUS_COLORS[activeRun.status]}`}>
                                                    {activeRun.status.replace('_', ' ')}
                                                </span>
                                                <Button
                                                    onClick={() => openDetails(activeRun)}
                                                    className="bg-pink-600 hover:bg-pink-700 text-white font-bold text-xs px-4 py-1.5 rounded-lg h-auto"
                                                >
                                                    Process Pay Run
                                                </Button>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-slate-100 dark:divide-slate-700">
                                            <div className="p-5">
                                                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-1">Net Pay</p>
                                                <p className="text-2xl font-black text-slate-900 dark:text-white">{formatCurrency(activeRun.totalNetPay)}</p>
                                                <p className="text-[10px] text-slate-400 mt-1">Direct deposit amount</p>
                                            </div>
                                            <div className="p-5">
                                                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-1">Payroll Cost</p>
                                                <p className="text-xl font-bold text-slate-900 dark:text-white">{formatCurrency(totalPayrollCost)}</p>
                                                <p className="text-[10px] text-slate-400 mt-1">Gross + Employer Stat</p>
                                            </div>
                                            <div className="p-5">
                                                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-1">Taxes & Deductions</p>
                                                <p className="text-xl font-bold text-slate-900 dark:text-white">{formatCurrency(totalTaxesDeductions)}</p>
                                                <p className="text-[10px] text-slate-400 mt-1">Sum of all withholdings</p>
                                            </div>
                                            <div className="p-5 bg-slate-50/50 dark:bg-slate-800/50">
                                                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-2">Employee Summary</p>
                                                <div className="space-y-2">
                                                    <div className="flex items-center justify-between text-xs">
                                                        <span className="text-slate-600 dark:text-slate-400">Total Employees</span>
                                                        <span className="font-bold text-slate-900 dark:text-white">{activeRun.employeeCount}</span>
                                                    </div>
                                                    <div className="flex items-center justify-between text-xs font-medium text-amber-600 dark:text-amber-400">
                                                        <span>Action Required</span>
                                                        <span>{activeRun.employees?.filter(e => e.status === 'PENDING').length || 0}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            }

                            // No active run? Calculate and show "Next Month" draft banner
                            // Use default calculation for display, actual dates will be fetched when creating
                            const sortedRuns = [...payRuns].sort((a, b) => new Date(b.payPeriodEnd) - new Date(a.payPeriodEnd));
                            const lastRun = sortedRuns[0];
                            let nextStart, nextEnd, nextPayDate;

                            if (lastRun) {
                                nextStart = new Date(lastRun.payPeriodEnd);
                                nextStart.setDate(nextStart.getDate() + 1);
                                nextEnd = new Date(nextStart.getFullYear(), nextStart.getMonth() + 1, 0);
                            } else {
                                const now = new Date();
                                nextStart = new Date(now.getFullYear(), now.getMonth(), 1);
                                nextEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
                            }

                            // Default to last day of month for display
                            nextPayDate = new Date(nextEnd.getFullYear(), nextEnd.getMonth() + 1, 0);

                            const nextPR = {
                                payPeriodStart: nextStart.toISOString().split('T')[0],
                                payPeriodEnd: nextEnd.toISOString().split('T')[0],
                                payDate: nextPayDate.toISOString().split('T')[0]
                            };

                            return (
                                <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200/60 dark:border-slate-700/60 shadow-md mb-6 overflow-hidden border-l-4 border-l-indigo-500 animate-in slide-in-from-right-4 duration-700">
                                    <div className="p-5 flex flex-col gap-6">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg flex items-center justify-center">
                                                    <Calendar className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                                                        Create Pay Run for {new Intl.DateTimeFormat('en-IN', { month: 'long', year: 'numeric' }).format(nextStart)}
                                                    </h3>
                                                    <p className="text-xs text-slate-500">Upcoming cycle: {formatDate(nextPR.payPeriodStart)} to {formatDate(nextPR.payPeriodEnd)}</p>
                                                </div>
                                            </div>
                                            <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400 uppercase tracking-wider">
                                                UPCOMING
                                            </span>
                                        </div>

                                        <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                                            <div className="flex items-center gap-12">
                                                <div>
                                                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-1">Status</p>
                                                    <p className="text-sm font-bold text-slate-900 dark:text-white">Not Created</p>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-1">Target Pay Date</p>
                                                    <p className="text-sm font-bold text-slate-900 dark:text-white">{formatDate(nextPR.payDate)}</p>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-1">Employees</p>
                                                    <p className="text-sm font-bold text-slate-900 dark:text-white">All Active</p>
                                                </div>
                                            </div>

                                            <Button
                                                onClick={async () => {
                                                    const dates = await getNextPayRunDates();
                                                    handleCreatePayRun(dates);
                                                }}
                                                disabled={actionLoading}
                                                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm px-6 py-2 shadow-lg shadow-indigo-500/20"
                                            >
                                                {actionLoading ? <RefreshCw className="w-4 h-4 animate-spin mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
                                                Build Pay Run
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })()}

                        {/* Pay Runs Content */}
                        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200/60 dark:border-slate-700/60 shadow-sm overflow-hidden animate-in fade-in duration-500">
                            <div className="px-4 py-2.5 border-b border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between">
                                <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
                                    {activeTab === 'active' ? 'Active Pay Runs' : 'Pay Run History'}
                                </h2>
                                {activeTab === 'history' && (
                                    <div className="flex items-center gap-2">
                                        <select
                                            className="text-[10px] bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded px-2 py-1 text-slate-600 dark:text-slate-300 outline-none"
                                        >
                                            <option>All Months</option>
                                            <option>January 2026</option>
                                            <option>December 2025</option>
                                        </select>
                                    </div>
                                )}
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-slate-50/80 dark:bg-slate-700/30">
                                        <tr>
                                            <th className="px-3 py-2 text-left text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider pl-4">Pay Period</th>
                                            <th className="px-3 py-2 text-left text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Pay Date</th>
                                            <th className="px-3 py-2 text-center text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Employees</th>
                                            <th className="px-3 py-2 text-right text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider pr-4">Net Pay</th>
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
                                        ) : (activeTab === 'active'
                                            ? payRuns.filter(pr => ['DRAFT', 'CALCULATING', 'PENDING_APPROVAL', 'APPROVED', 'PROCESSING'].includes(pr.status))
                                            : payRuns.filter(pr => ['COMPLETED', 'CANCELLED'].includes(pr.status))
                                        ).length === 0 ? (
                                            <tr>
                                                <td colSpan="7" className="px-4 py-8 text-center text-slate-500 dark:text-slate-400">
                                                    <DollarSign className="w-10 h-10 mx-auto mb-2 text-slate-300 dark:text-slate-600" />
                                                    <p>No {activeTab === 'active' ? 'active' : 'historical'} pay runs found</p>
                                                </td>
                                            </tr>
                                        ) : (
                                            (activeTab === 'active'
                                                ? payRuns.filter(pr => ['DRAFT', 'CALCULATING', 'PENDING_APPROVAL', 'APPROVED', 'PROCESSING'].includes(pr.status))
                                                : payRuns.filter(pr => ['COMPLETED', 'CANCELLED'].includes(pr.status))
                                            ).map((payRun) => (
                                                <tr key={payRun.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                                                    <td className="px-4 py-3 pl-4">
                                                        <div>
                                                            <button
                                                                onClick={() => openDetails(payRun)}
                                                                className="font-semibold text-slate-900 dark:text-white hover:text-pink-600 dark:hover:text-pink-400 transition-colors text-sm"
                                                            >
                                                                {formatDate(payRun.payPeriodStart)} - {formatDate(payRun.payPeriodEnd)}
                                                            </button>
                                                            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                                                                Pay Run #{payRun.payRunNumber}
                                                            </p>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400 font-medium font-Inter">
                                                        {formatDate(payRun.payDate)}
                                                    </td>
                                                    <td className="px-4 py-3 text-center text-sm text-slate-600 dark:text-slate-400">
                                                        {payRun.employeeCount}
                                                    </td>
                                                    <td className="px-4 py-3 text-right text-sm font-bold text-slate-900 dark:text-white pr-4">
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
                                                            {(payRun.status === 'DRAFT' || payRun.status === 'COMPLETED' || payRun.status === 'CANCELLED') && (
                                                                <Button
                                                                    size="sm"
                                                                    variant="ghost"
                                                                    onClick={() => handleDelete(payRun.id)}
                                                                    disabled={actionLoading}
                                                                    title="Delete Pay Run"
                                                                    className="text-slate-400 hover:text-rose-600 dark:text-slate-500 dark:hover:text-rose-400"
                                                                >
                                                                    <Trash2 className="w-4 h-4" />
                                                                </Button>
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

            {/* First Pay Run Date Selection Modal */}
            {showFirstPayRunModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-lg overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-rose-500 to-pink-600">
                            <h2 className="text-lg font-bold text-white">Start Your First Pay Run</h2>
                            <p className="text-sm text-rose-100">Select the pay period for your first payroll</p>
                        </div>
                        <div className="p-6 space-y-5">
                            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                                <div className="flex items-start gap-3">
                                    <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-medium text-blue-900 dark:text-blue-300">First Time Setup</p>
                                        <p className="text-xs text-blue-700 dark:text-blue-400 mt-1">
                                            Since this is your first pay run, please select the pay period dates. 
                                            For subsequent pay runs, dates will be calculated automatically.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
                                        Pay Period Start
                                    </label>
                                    <input
                                        type="date"
                                        value={customPayPeriod.payPeriodStart}
                                        onChange={(e) => setCustomPayPeriod(prev => ({ ...prev, payPeriodStart: e.target.value }))}
                                        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
                                        Pay Period End
                                    </label>
                                    <input
                                        type="date"
                                        value={customPayPeriod.payPeriodEnd}
                                        onChange={(e) => setCustomPayPeriod(prev => ({ ...prev, payPeriodEnd: e.target.value }))}
                                        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
                                    Payment Date
                                </label>
                                <input
                                    type="date"
                                    value={customPayPeriod.payDate}
                                    onChange={(e) => setCustomPayPeriod(prev => ({ ...prev, payDate: e.target.value }))}
                                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                                />
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                    The date when salaries will be paid to employees
                                </p>
                            </div>

                            <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
                                <button
                                    onClick={() => setShowPriorPayrollModal(true)}
                                    className="text-sm text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 flex items-center gap-2"
                                >
                                    <Calendar className="w-4 h-4" />
                                    Have previous payrolls to record? Import prior payroll data
                                </button>
                            </div>
                        </div>
                        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-700 flex justify-end gap-3 bg-slate-50 dark:bg-slate-800/50">
                            <Button
                                variant="outline"
                                onClick={() => setShowFirstPayRunModal(false)}
                                className="text-sm"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={() => {
                                    if (!customPayPeriod.payPeriodStart || !customPayPeriod.payPeriodEnd || !customPayPeriod.payDate) {
                                        alert('Please fill in all date fields');
                                        return;
                                    }
                                    setShowFirstPayRunModal(false);
                                    handleCreatePayRun({
                                        ...customPayPeriod,
                                        notes: `First pay run for ${new Intl.DateTimeFormat('en-IN', { month: 'long', year: 'numeric' }).format(new Date(customPayPeriod.payPeriodStart))}`
                                    });
                                }}
                                disabled={actionLoading}
                                className="bg-rose-500 hover:bg-rose-600 text-white text-sm"
                            >
                                {actionLoading ? 'Creating...' : 'Create Pay Run'}
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Prior Payroll Recording Modal */}
            {showPriorPayrollModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Record Prior Payroll</h2>
                            <p className="text-sm text-slate-600 dark:text-slate-400">Import historical payroll data from your previous system</p>
                        </div>
                        <div className="p-6 space-y-5">
                            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                                <div className="flex items-start gap-3">
                                    <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-medium text-amber-900 dark:text-amber-300">Why Record Prior Payroll?</p>
                                        <p className="text-xs text-amber-700 dark:text-amber-400 mt-1">
                                            If you've been running payroll with another system, recording prior payroll helps maintain accurate year-to-date calculations for taxes, PF, and other statutory deductions.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Steps to Record Prior Payroll:</h3>
                                <ol className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
                                    <li className="flex items-start gap-3">
                                        <span className="flex-shrink-0 w-6 h-6 bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 rounded-full flex items-center justify-center text-xs font-bold">1</span>
                                        <span>Download the prior payroll template CSV file</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="flex-shrink-0 w-6 h-6 bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 rounded-full flex items-center justify-center text-xs font-bold">2</span>
                                        <span>Fill in the historical payroll data for each employee (gross pay, deductions, taxes paid)</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="flex-shrink-0 w-6 h-6 bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 rounded-full flex items-center justify-center text-xs font-bold">3</span>
                                        <span>Upload the filled template to import prior payroll records</span>
                                    </li>
                                </ol>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                                        <Download className="w-5 h-5 text-green-600 dark:text-green-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-slate-900 dark:text-white">Download Template</p>
                                        <p className="text-xs text-slate-600 dark:text-slate-400">Get the prior payroll import template</p>
                                    </div>
                                </div>
                                <Button
                                    onClick={() => {
                                        const template = 'employeeId,employeeName,payPeriodStart,payPeriodEnd,basicPay,hra,allowances,grossPay,pf,esi,tax,deductions,netPay\nEMP001,John Doe,2024-01-01,2024-01-31,50000,25000,10000,85000,6000,1500,5000,12500,72500';
                                        const blob = new Blob([template], { type: 'text/csv' });
                                        const url = window.URL.createObjectURL(blob);
                                        const a = document.createElement('a');
                                        a.href = url;
                                        a.download = 'prior_payroll_template.csv';
                                        a.click();
                                    }}
                                    variant="outline"
                                    className="text-sm"
                                >
                                    <Download className="w-4 h-4 mr-2" />
                                    Download CSV
                                </Button>
                            </div>

                            <div className="text-center py-6 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg">
                                <Calendar className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                                <p className="text-sm text-slate-600 dark:text-slate-400">
                                    Prior payroll import feature coming soon
                                </p>
                                <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                                    For now, you can proceed with your first pay run
                                </p>
                            </div>
                        </div>
                        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-700 flex justify-end gap-3 bg-slate-50 dark:bg-slate-800/50">
                            <Button
                                variant="outline"
                                onClick={() => setShowPriorPayrollModal(false)}
                                className="text-sm"
                            >
                                Close
                            </Button>
                            <Button
                                onClick={() => {
                                    setShowPriorPayrollModal(false);
                                    // Keep first payrun modal open
                                }}
                                className="bg-rose-500 hover:bg-rose-600 text-white text-sm"
                            >
                                Continue Without Prior Data
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div >
    );
}
