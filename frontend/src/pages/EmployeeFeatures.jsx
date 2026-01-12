import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import AppHeader from '../components/AppHeader';
import { Button } from '../components/ui/button';
import { api } from '../services/authService';
import { useAuth } from '../contexts/AuthContext';
import {
    Calculator, Wallet, Receipt, Plus, Search, RefreshCw, Check, X,
    AlertCircle, CheckCircle, FileText, DollarSign, Clock, CreditCard,
    TrendingUp, Building2, PiggyBank, Heart, GraduationCap, Home
} from 'lucide-react';

export default function EmployeeFeatures() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [organization, setOrganization] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('investments');
    const [employees, setEmployees] = useState([]);
    const [investments, setInvestments] = useState([]);
    const [loans, setLoans] = useState([]);
    const [reimbursements, setReimbursements] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState('');
    const [financialYear, setFinancialYear] = useState('2025-26');
    const [alert, setAlert] = useState(null);

    useEffect(() => { loadInitialData(); }, []);

    useEffect(() => {
        if (organization?.id) {
            if (activeTab === 'investments') loadInvestments();
            else if (activeTab === 'loans') loadLoans();
            else if (activeTab === 'reimbursements') loadReimbursements();
        }
    }, [activeTab, organization?.id]);

    const loadInitialData = async () => {
        try {
            const orgId = localStorage.getItem('selectedOrganizationId');
            if (orgId) {
                const [orgRes, empRes] = await Promise.all([
                    api.get(`/organizations`),
                    api.get('/employees', { headers: { 'X-Tenant-ID': orgId } })
                ]);
                const org = orgRes.data?.find(o => o.id === parseInt(orgId));
                setOrganization(org);
                setEmployees(empRes.data || []);
            }
        } catch (error) { console.error('Error:', error); }
        finally { setLoading(false); }
    };

    const loadInvestments = async () => {
        try {
            const res = await api.get(`/investments/year/${financialYear}`, {
                headers: { 'X-Tenant-ID': organization.id }
            });
            setInvestments(res.data || []);
        } catch (error) { console.error('Error:', error); }
    };

    const loadLoans = async () => {
        try {
            const res = await api.get('/loans', {
                headers: { 'X-Tenant-ID': organization.id }
            });
            setLoans(res.data || []);
        } catch (error) { console.error('Error:', error); }
    };

    const loadReimbursements = async () => {
        try {
            const res = await api.get('/reimbursements', {
                headers: { 'X-Tenant-ID': organization.id }
            });
            setReimbursements(res.data || []);
        } catch (error) { console.error('Error:', error); }
    };

    const handleApprove = async (type, id) => {
        try {
            const endpoint = type === 'investment' ? `/investments/${id}/approve`
                : type === 'loan' ? `/loans/${id}/approve`
                : `/reimbursements/${id}/approve`;
            
            const body = type === 'reimbursement' 
                ? { approvedAmount: reimbursements.find(r => r.id === id)?.amount }
                : {};
            
            await api.post(endpoint, body, {
                headers: { 'X-Tenant-ID': organization.id, 'X-User-ID': user?.id || 1 }
            });
            showAlertMessage('Approved successfully', 'success');
            if (type === 'investment') loadInvestments();
            else if (type === 'loan') loadLoans();
            else loadReimbursements();
        } catch (error) { showAlertMessage('Failed to approve', 'error'); }
    };

    const handleReject = async (type, id) => {
        const reason = prompt('Enter rejection reason:');
        if (!reason) return;
        try {
            const endpoint = type === 'investment' ? `/investments/${id}/reject`
                : type === 'loan' ? `/loans/${id}/reject`
                : `/reimbursements/${id}/reject`;
            
            await api.post(endpoint, { reason }, {
                headers: { 'X-Tenant-ID': organization.id, 'X-User-ID': user?.id || 1 }
            });
            showAlertMessage('Rejected', 'success');
            if (type === 'investment') loadInvestments();
            else if (type === 'loan') loadLoans();
            else loadReimbursements();
        } catch (error) { showAlertMessage('Failed to reject', 'error'); }
    };

    const handleDisburseLoan = async (id) => {
        try {
            await api.post(`/loans/${id}/disburse`, {}, {
                headers: { 'X-Tenant-ID': organization.id }
            });
            showAlertMessage('Loan disbursed', 'success');
            loadLoans();
        } catch (error) { showAlertMessage('Failed to disburse', 'error'); }
    };

    const showAlertMessage = (message, type) => {
        setAlert({ message, type });
        setTimeout(() => setAlert(null), 3000);
    };

    const getStatusColor = (status) => ({
        'DRAFT': 'bg-slate-100 text-slate-700',
        'PENDING': 'bg-yellow-100 text-yellow-700',
        'SUBMITTED': 'bg-blue-100 text-blue-700',
        'APPROVED': 'bg-green-100 text-green-700',
        'REJECTED': 'bg-red-100 text-red-700',
        'DISBURSED': 'bg-purple-100 text-purple-700',
        'ACTIVE': 'bg-green-100 text-green-700',
        'CLOSED': 'bg-slate-100 text-slate-700',
        'PAID': 'bg-green-100 text-green-700',
        'PARTIALLY_APPROVED': 'bg-orange-100 text-orange-700'
    }[status] || 'bg-slate-100 text-slate-700');

    const formatCurrency = (amount) => amount ? new Intl.NumberFormat('en-IN', {
        style: 'currency', currency: 'INR', minimumFractionDigits: 0
    }).format(amount) : '₹0';

    const getEmployeeName = (empId) => {
        const emp = employees.find(e => e.id === empId);
        return emp ? `${emp.firstName} ${emp.lastName}` : 'Unknown';
    };

    const tabs = [
        { id: 'investments', label: 'Investment Declarations', icon: Calculator },
        { id: 'loans', label: 'Loans & Advances', icon: Wallet },
        { id: 'reimbursements', label: 'Reimbursements', icon: Receipt }
    ];

    if (loading) {
        return (
            <div className="h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
                <RefreshCw className="w-8 h-8 animate-spin text-pink-500" />
            </div>
        );
    }

    return (
        <div className="h-screen bg-slate-50 dark:bg-slate-900 flex overflow-hidden">
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            <div className={`flex-1 flex flex-col min-w-0 overflow-hidden transition-all duration-300 ${sidebarOpen ? 'ml-56' : 'ml-0'}`}>
                <AppHeader sidebarCollapsed={!sidebarOpen} setSidebarCollapsed={(c) => setSidebarOpen(!c)} organization={organization} user={user} />
                <main className="flex-1 overflow-y-auto p-6">
                    <div className="max-w-7xl mx-auto">
                        <div className="mb-6">
                            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Employee Benefits</h1>
                            <p className="text-slate-600 dark:text-slate-400 mt-1">Manage investment declarations, loans, and reimbursements</p>
                        </div>

                        {alert && (
                            <div className={`mb-4 p-4 rounded-lg flex items-center gap-2 ${alert.type === 'success' ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300 border border-green-200 dark:border-green-800' : 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-800'}`}>
                                {alert.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                                {alert.message}
                            </div>
                        )}

                        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                            <div className="flex overflow-x-auto border-b border-slate-200 dark:border-slate-700">
                                {tabs.map(tab => (
                                    <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                                        className={`flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap ${
                                            activeTab === tab.id ? 'text-pink-600 dark:text-pink-400 border-b-2 border-pink-600 dark:border-pink-400 bg-pink-50/50 dark:bg-pink-900/20' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                                        }`}>
                                        <tab.icon className="w-4 h-4" />{tab.label}
                                    </button>
                                ))}
                            </div>

                            <div className="p-6">
                                {activeTab === 'investments' && (
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <select value={financialYear} onChange={(e) => setFinancialYear(e.target.value)}
                                                    className="px-3 py-1.5 border border-slate-300 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-white">
                                                    <option value="2024-25">FY 2024-25</option>
                                                    <option value="2025-26">FY 2025-26</option>
                                                    <option value="2026-27">FY 2026-27</option>
                                                </select>
                                                <Button onClick={loadInvestments} variant="outline" size="sm">
                                                    <RefreshCw className="w-4 h-4 mr-2" />Refresh
                                                </Button>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                                            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <PiggyBank className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                                    <span className="text-sm font-medium text-blue-800 dark:text-blue-200">Section 80C</span>
                                                </div>
                                                <p className="text-xs text-blue-600 dark:text-blue-300">PPF, ELSS, LIC, NSC, FD - Max ₹1,50,000</p>
                                            </div>
                                            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Heart className="w-5 h-5 text-green-600 dark:text-green-400" />
                                                    <span className="text-sm font-medium text-green-800 dark:text-green-200">Section 80D</span>
                                                </div>
                                                <p className="text-xs text-green-600 dark:text-green-300">Medical Insurance - Max ₹75,000</p>
                                            </div>
                                            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <GraduationCap className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                                    <span className="text-sm font-medium text-purple-800 dark:text-purple-200">Section 80E</span>
                                                </div>
                                                <p className="text-xs text-purple-600 dark:text-purple-300">Education Loan Interest - No Limit</p>
                                            </div>
                                            <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4 border border-orange-200 dark:border-orange-800">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Home className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                                                    <span className="text-sm font-medium text-orange-800 dark:text-orange-200">Section 24</span>
                                                </div>
                                                <p className="text-xs text-orange-600 dark:text-orange-300">Home Loan Interest - Max ₹2,00,000</p>
                                            </div>
                                        </div>

                                        <table className="w-full">
                                            <thead className="bg-slate-50 dark:bg-slate-700 border-b border-slate-200 dark:border-slate-600">
                                                <tr>
                                                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase">Employee</th>
                                                    <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase">80C</th>
                                                    <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase">80D</th>
                                                    <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase">HRA</th>
                                                    <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase">Total</th>
                                                    <th className="px-4 py-3 text-center text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase">Status</th>
                                                    <th className="px-4 py-3 text-center text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-200 dark:divide-slate-600">
                                                {investments.length === 0 ? (
                                                    <tr><td colSpan="7" className="px-4 py-8 text-center text-slate-500 dark:text-slate-400">No declarations found</td></tr>
                                                ) : investments.map(inv => (
                                                    <tr key={inv.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                                                        <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">{getEmployeeName(inv.employeeId)}</td>
                                                        <td className="px-4 py-3 text-right text-slate-700 dark:text-slate-300">{formatCurrency(inv.total80C)}</td>
                                                        <td className="px-4 py-3 text-right text-slate-700 dark:text-slate-300">{formatCurrency(inv.total80D)}</td>
                                                        <td className="px-4 py-3 text-right text-slate-700 dark:text-slate-300">{formatCurrency(inv.hraRentPaidAnnual)}</td>
                                                        <td className="px-4 py-3 text-right font-semibold text-slate-900 dark:text-white">{formatCurrency(inv.totalDeductions)}</td>
                                                        <td className="px-4 py-3 text-center">
                                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(inv.status)}`}>{inv.status}</span>
                                                        </td>
                                                        <td className="px-4 py-3 text-center">
                                                            {inv.status === 'SUBMITTED' && (
                                                                <div className="flex items-center justify-center gap-2">
                                                                    <button onClick={() => handleApprove('investment', inv.id)} className="p-1 hover:bg-green-100 rounded text-green-600"><Check className="w-4 h-4" /></button>
                                                                    <button onClick={() => handleReject('investment', inv.id)} className="p-1 hover:bg-red-100 rounded text-red-600"><X className="w-4 h-4" /></button>
                                                                </div>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}

                                {activeTab === 'loans' && (
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <h3 className="font-semibold text-slate-900 dark:text-white">Loan Applications</h3>
                                            <Button onClick={loadLoans} variant="outline" size="sm">
                                                <RefreshCw className="w-4 h-4 mr-2" />Refresh
                                            </Button>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                                            <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4 border border-slate-200 dark:border-slate-600">
                                                <p className="text-sm text-slate-500 dark:text-slate-400">Total Loans</p>
                                                <p className="text-2xl font-bold text-slate-900 dark:text-white">{loans.length}</p>
                                            </div>
                                            <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 border border-yellow-200 dark:border-yellow-800">
                                                <p className="text-sm text-yellow-600 dark:text-yellow-400">Pending</p>
                                                <p className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">{loans.filter(l => l.status === 'PENDING').length}</p>
                                            </div>
                                            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
                                                <p className="text-sm text-green-600 dark:text-green-400">Active</p>
                                                <p className="text-2xl font-bold text-green-700 dark:text-green-300">{loans.filter(l => ['ACTIVE', 'DISBURSED'].includes(l.status)).length}</p>
                                            </div>
                                            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                                                <p className="text-sm text-blue-600 dark:text-blue-400">Total Outstanding</p>
                                                <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">{formatCurrency(loans.reduce((sum, l) => sum + (l.outstandingAmount || 0), 0))}</p>
                                            </div>
                                        </div>

                                        <table className="w-full">
                                            <thead className="bg-slate-50 dark:bg-slate-700 border-b border-slate-200 dark:border-slate-600">
                                                <tr>
                                                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase">Employee</th>
                                                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase">Type</th>
                                                    <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase">Amount</th>
                                                    <th className="px-4 py-3 text-center text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase">Tenure</th>
                                                    <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase">EMI</th>
                                                    <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase">Outstanding</th>
                                                    <th className="px-4 py-3 text-center text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase">Status</th>
                                                    <th className="px-4 py-3 text-center text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-200 dark:divide-slate-600">
                                                {loans.length === 0 ? (
                                                    <tr><td colSpan="8" className="px-4 py-8 text-center text-slate-500 dark:text-slate-400">No loan applications</td></tr>
                                                ) : loans.map(loan => (
                                                    <tr key={loan.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                                                        <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">{getEmployeeName(loan.employeeId)}</td>
                                                        <td className="px-4 py-3 text-slate-700 dark:text-slate-300">{loan.loanType?.replace('_', ' ')}</td>
                                                        <td className="px-4 py-3 text-right text-slate-700 dark:text-slate-300">{formatCurrency(loan.principalAmount)}</td>
                                                        <td className="px-4 py-3 text-center text-slate-700 dark:text-slate-300">{loan.tenureMonths} months</td>
                                                        <td className="px-4 py-3 text-right text-slate-700 dark:text-slate-300">{formatCurrency(loan.emiAmount)}</td>
                                                        <td className="px-4 py-3 text-right text-slate-700 dark:text-slate-300">{formatCurrency(loan.outstandingAmount)}</td>
                                                        <td className="px-4 py-3 text-center">
                                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(loan.status)}`}>{loan.status}</span>
                                                        </td>
                                                        <td className="px-4 py-3 text-center">
                                                            {loan.status === 'PENDING' && (
                                                                <div className="flex items-center justify-center gap-2">
                                                                    <button onClick={() => handleApprove('loan', loan.id)} className="p-1 hover:bg-green-100 rounded text-green-600"><Check className="w-4 h-4" /></button>
                                                                    <button onClick={() => handleReject('loan', loan.id)} className="p-1 hover:bg-red-100 rounded text-red-600"><X className="w-4 h-4" /></button>
                                                                </div>
                                                            )}
                                                            {loan.status === 'APPROVED' && (
                                                                <Button onClick={() => handleDisburseLoan(loan.id)} size="sm" className="bg-purple-600 hover:bg-purple-700 text-xs">Disburse</Button>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}

                                {activeTab === 'reimbursements' && (
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <h3 className="font-semibold text-slate-900 dark:text-white">Expense Claims</h3>
                                            <Button onClick={loadReimbursements} variant="outline" size="sm">
                                                <RefreshCw className="w-4 h-4 mr-2" />Refresh
                                            </Button>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                                            <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4 border border-slate-200 dark:border-slate-600">
                                                <p className="text-sm text-slate-500 dark:text-slate-400">Total Claims</p>
                                                <p className="text-2xl font-bold text-slate-900 dark:text-white">{reimbursements.length}</p>
                                            </div>
                                            <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 border border-yellow-200 dark:border-yellow-800">
                                                <p className="text-sm text-yellow-600 dark:text-yellow-400">Pending</p>
                                                <p className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">{reimbursements.filter(r => r.status === 'PENDING').length}</p>
                                            </div>
                                            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
                                                <p className="text-sm text-green-600 dark:text-green-400">Approved</p>
                                                <p className="text-2xl font-bold text-green-700 dark:text-green-300">{reimbursements.filter(r => ['APPROVED', 'PARTIALLY_APPROVED'].includes(r.status)).length}</p>
                                            </div>
                                            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                                                <p className="text-sm text-blue-600 dark:text-blue-400">Pending Payout</p>
                                                <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">{formatCurrency(reimbursements.filter(r => ['APPROVED', 'PARTIALLY_APPROVED'].includes(r.status) && r.paidInPayrollId == null).reduce((sum, r) => sum + (r.approvedAmount || r.amount || 0), 0))}</p>
                                            </div>
                                        </div>

                                        <table className="w-full">
                                            <thead className="bg-slate-50 dark:bg-slate-700 border-b border-slate-200 dark:border-slate-600">
                                                <tr>
                                                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase">Employee</th>
                                                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase">Category</th>
                                                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase">Description</th>
                                                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase">Date</th>
                                                    <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase">Amount</th>
                                                    <th className="px-4 py-3 text-center text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase">Status</th>
                                                    <th className="px-4 py-3 text-center text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-200 dark:divide-slate-600">
                                                {reimbursements.length === 0 ? (
                                                    <tr><td colSpan="7" className="px-4 py-8 text-center text-slate-500 dark:text-slate-400">No expense claims</td></tr>
                                                ) : reimbursements.map(claim => (
                                                    <tr key={claim.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                                                        <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">{getEmployeeName(claim.employeeId)}</td>
                                                        <td className="px-4 py-3 text-slate-700 dark:text-slate-300">{claim.category}</td>
                                                        <td className="px-4 py-3 max-w-[200px] truncate text-slate-700 dark:text-slate-300">{claim.description}</td>
                                                        <td className="px-4 py-3 text-slate-700 dark:text-slate-300">{claim.expenseDate}</td>
                                                        <td className="px-4 py-3 text-right text-slate-700 dark:text-slate-300">{formatCurrency(claim.amount)}</td>
                                                        <td className="px-4 py-3 text-center">
                                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(claim.status)}`}>{claim.status}</span>
                                                        </td>
                                                        <td className="px-4 py-3 text-center">
                                                            {claim.status === 'PENDING' && (
                                                                <div className="flex items-center justify-center gap-2">
                                                                    <button onClick={() => handleApprove('reimbursement', claim.id)} className="p-1 hover:bg-green-100 rounded text-green-600"><Check className="w-4 h-4" /></button>
                                                                    <button onClick={() => handleReject('reimbursement', claim.id)} className="p-1 hover:bg-red-100 rounded text-red-600"><X className="w-4 h-4" /></button>
                                                                </div>
                                                            )}
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
                </main>
            </div>
        </div>
    );
}
