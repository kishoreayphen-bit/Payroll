import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import AppHeader from '../components/AppHeader';
import { api } from '../services/authService';
import { useAuth } from '../contexts/AuthContext';
import {
    Building2, FileText, Download, CreditCard, Users,
    RefreshCw, CheckCircle, AlertCircle, Banknote, FileSpreadsheet,
    Receipt, Calendar, ChevronDown
} from 'lucide-react';

export default function AdvancedFeatures() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [organization, setOrganization] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('bank-files');
    const [payRuns, setPayRuns] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [selectedPayRun, setSelectedPayRun] = useState(null);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [bankSummary, setBankSummary] = useState(null);
    const [generating, setGenerating] = useState(false);
    const [financialYear, setFinancialYear] = useState('2025-26');

    const financialYears = ['2023-24', '2024-25', '2025-26', '2026-27'];

    const tabs = [
        { id: 'bank-files', label: 'Bank Files', icon: Banknote },
        { id: 'form16', label: 'Form 16', icon: FileText },
        { id: 'challans', label: 'Challans', icon: Receipt }
    ];

    useEffect(() => {
        loadInitialData();
    }, []);

    useEffect(() => {
        if (selectedPayRun && organization?.id) {
            loadBankSummary();
        }
    }, [selectedPayRun]);

    const loadInitialData = async () => {
        try {
            const orgId = localStorage.getItem('selectedOrganizationId');
            if (orgId) {
                const [orgRes, payRunRes, empRes] = await Promise.all([
                    api.get('/organizations'),
                    api.get('/pay-runs', { headers: { 'X-Tenant-ID': orgId } }),
                    api.get('/employees', { headers: { 'X-Tenant-ID': orgId } })
                ]);
                const org = orgRes.data?.find(o => o.id === parseInt(orgId));
                setOrganization(org);
                setPayRuns(payRunRes.data || []);
                setEmployees(empRes.data || []);
                
                if (payRunRes.data?.length > 0) {
                    setSelectedPayRun(payRunRes.data[0].id);
                }
            }
        } catch (error) {
            console.error('Error loading data:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadBankSummary = async () => {
        if (!selectedPayRun || !organization?.id) return;
        try {
            const res = await api.get(`/bank-files/summary/${selectedPayRun}`, {
                headers: { 'X-Tenant-ID': organization.id }
            });
            setBankSummary(res.data);
        } catch (error) {
            console.error('Error loading bank summary:', error);
            setBankSummary(null);
        }
    };

    const downloadBankFile = async (type) => {
        if (!selectedPayRun || !organization?.id) return;
        setGenerating(true);
        try {
            let endpoint = `/bank-files/generate/${selectedPayRun}?type=${type}`;
            if (type === 'HDFC') {
                endpoint = `/bank-files/generate/hdfc/${selectedPayRun}`;
            } else if (type === 'ICICI') {
                endpoint = `/bank-files/generate/icici/${selectedPayRun}`;
            }

            const res = await api.get(endpoint, {
                headers: { 'X-Tenant-ID': organization.id },
                responseType: 'blob'
            });

            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `bank_file_${type.toLowerCase()}_${selectedPayRun}.${type === 'NEFT' || type === 'RTGS' ? 'txt' : 'csv'}`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error('Error downloading bank file:', error);
        } finally {
            setGenerating(false);
        }
    };

    const downloadForm16 = async (employeeId) => {
        if (!organization?.id) return;
        setGenerating(true);
        try {
            const res = await api.get(`/form16/generate/${employeeId}?financialYear=${financialYear}`, {
                headers: { 'X-Tenant-ID': organization.id },
                responseType: 'blob'
            });

            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `form16_${employeeId}_${financialYear}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error('Error downloading Form 16:', error);
        } finally {
            setGenerating(false);
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount || 0);
    };

    if (loading) {
        return (
            <div className="h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
                <RefreshCw className="w-6 h-6 animate-spin text-pink-500" />
            </div>
        );
    }

    return (
        <div className="h-screen bg-slate-50 dark:bg-slate-900 flex overflow-hidden">
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            <div className={`flex-1 flex flex-col h-screen transition-all duration-300 ${sidebarOpen ? 'ml-56' : 'ml-0'}`}>
                <AppHeader 
                    sidebarOpen={sidebarOpen} 
                    setSidebarOpen={setSidebarOpen}
                    organization={organization}
                />

                <div className="flex-1 overflow-y-auto p-4">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h1 className="text-xl font-bold text-slate-900 dark:text-white">Advanced Features</h1>
                            <p className="text-xs text-slate-600 dark:text-slate-400">Bank files, Form 16, and compliance documents</p>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-1 mb-4 bg-white dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700 w-fit">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                                    activeTab === tab.id
                                        ? 'bg-pink-500 text-white'
                                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                                }`}
                            >
                                <tab.icon className="w-3.5 h-3.5" />
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Bank Files Tab */}
                    {activeTab === 'bank-files' && (
                        <div className="space-y-4">
                            {/* Pay Run Selection */}
                            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4">
                                <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Select Pay Run</h3>
                                <select
                                    value={selectedPayRun || ''}
                                    onChange={(e) => setSelectedPayRun(e.target.value ? parseInt(e.target.value) : null)}
                                    className="w-full max-w-md px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                                >
                                    <option value="">Select a pay run...</option>
                                    {payRuns.map(pr => (
                                        <option key={pr.id} value={pr.id}>
                                            {pr.payRunNumber} - {new Date(pr.payPeriodStart).toLocaleDateString()} to {new Date(pr.payPeriodEnd).toLocaleDateString()}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Bank File Summary */}
                            {bankSummary && (
                                <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4">
                                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Payment Summary</h3>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                                        <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-3">
                                            <p className="text-[10px] text-slate-500 uppercase">Total Employees</p>
                                            <p className="text-lg font-bold text-slate-900 dark:text-white">{bankSummary.totalEmployees}</p>
                                        </div>
                                        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3">
                                            <p className="text-[10px] text-green-600 uppercase">Valid Accounts</p>
                                            <p className="text-lg font-bold text-green-700">{bankSummary.validBankAccounts}</p>
                                        </div>
                                        <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-3">
                                            <p className="text-[10px] text-red-600 uppercase">Invalid Accounts</p>
                                            <p className="text-lg font-bold text-red-700">{bankSummary.invalidBankAccounts}</p>
                                        </div>
                                        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
                                            <p className="text-[10px] text-blue-600 uppercase">Total Amount</p>
                                            <p className="text-lg font-bold text-blue-700">{formatCurrency(bankSummary.totalAmount)}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Download Options */}
                            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4">
                                <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Download Bank Files</h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                    <button
                                        onClick={() => downloadBankFile('NEFT')}
                                        disabled={!selectedPayRun || generating}
                                        className="flex flex-col items-center gap-2 p-4 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg border border-blue-200 dark:border-blue-800 transition-colors disabled:opacity-50"
                                    >
                                        <Banknote className="w-6 h-6 text-blue-600" />
                                        <span className="text-xs font-medium text-blue-800 dark:text-blue-200">NEFT File</span>
                                    </button>
                                    <button
                                        onClick={() => downloadBankFile('RTGS')}
                                        disabled={!selectedPayRun || generating}
                                        className="flex flex-col items-center gap-2 p-4 bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/30 rounded-lg border border-purple-200 dark:border-purple-800 transition-colors disabled:opacity-50"
                                    >
                                        <CreditCard className="w-6 h-6 text-purple-600" />
                                        <span className="text-xs font-medium text-purple-800 dark:text-purple-200">RTGS File</span>
                                    </button>
                                    <button
                                        onClick={() => downloadBankFile('HDFC')}
                                        disabled={!selectedPayRun || generating}
                                        className="flex flex-col items-center gap-2 p-4 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-lg border border-green-200 dark:border-green-800 transition-colors disabled:opacity-50"
                                    >
                                        <Building2 className="w-6 h-6 text-green-600" />
                                        <span className="text-xs font-medium text-green-800 dark:text-green-200">HDFC Format</span>
                                    </button>
                                    <button
                                        onClick={() => downloadBankFile('ICICI')}
                                        disabled={!selectedPayRun || generating}
                                        className="flex flex-col items-center gap-2 p-4 bg-orange-50 dark:bg-orange-900/20 hover:bg-orange-100 dark:hover:bg-orange-900/30 rounded-lg border border-orange-200 dark:border-orange-800 transition-colors disabled:opacity-50"
                                    >
                                        <Building2 className="w-6 h-6 text-orange-600" />
                                        <span className="text-xs font-medium text-orange-800 dark:text-orange-200">ICICI Format</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Form 16 Tab */}
                    {activeTab === 'form16' && (
                        <div className="space-y-4">
                            {/* FY Selection */}
                            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4">
                                <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Financial Year</h3>
                                <select
                                    value={financialYear}
                                    onChange={(e) => setFinancialYear(e.target.value)}
                                    className="px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                                >
                                    {financialYears.map(fy => (
                                        <option key={fy} value={fy}>FY {fy}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Employee List */}
                            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
                                <div className="p-3 border-b border-slate-200 dark:border-slate-700">
                                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Generate Form 16</h3>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-xs">
                                        <thead className="bg-slate-50 dark:bg-slate-700">
                                            <tr>
                                                <th className="text-left p-2 font-medium text-slate-600 dark:text-slate-300">Employee ID</th>
                                                <th className="text-left p-2 font-medium text-slate-600 dark:text-slate-300">Name</th>
                                                <th className="text-left p-2 font-medium text-slate-600 dark:text-slate-300">PAN</th>
                                                <th className="text-left p-2 font-medium text-slate-600 dark:text-slate-300">Department</th>
                                                <th className="text-center p-2 font-medium text-slate-600 dark:text-slate-300">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                                            {employees.map(emp => (
                                                <tr key={emp.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                                                    <td className="p-2 text-slate-900 dark:text-white">{emp.employeeId}</td>
                                                    <td className="p-2 text-slate-900 dark:text-white">{emp.firstName} {emp.lastName}</td>
                                                    <td className="p-2 text-slate-600 dark:text-slate-400">{emp.panNumber || '-'}</td>
                                                    <td className="p-2 text-slate-600 dark:text-slate-400">{emp.department || '-'}</td>
                                                    <td className="p-2 text-center">
                                                        <button
                                                            onClick={() => downloadForm16(emp.id)}
                                                            disabled={generating}
                                                            className="inline-flex items-center gap-1 px-2 py-1 bg-pink-500 hover:bg-pink-600 text-white rounded text-[10px] font-medium transition-colors disabled:opacity-50"
                                                        >
                                                            <Download className="w-3 h-3" />
                                                            Form 16
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Challans Tab */}
                    {activeTab === 'challans' && (
                        <div className="space-y-4">
                            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
                                <div className="text-center py-8">
                                    <Receipt className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-1">Challan Generation</h3>
                                    <p className="text-xs text-slate-600 dark:text-slate-400 mb-4">
                                        Generate PF, ESI, and TDS challans for statutory compliance
                                    </p>
                                    <div className="flex flex-wrap justify-center gap-3">
                                        <button className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg text-xs font-medium hover:bg-blue-200 transition-colors">
                                            PF Challan
                                        </button>
                                        <button className="px-4 py-2 bg-green-100 text-green-700 rounded-lg text-xs font-medium hover:bg-green-200 transition-colors">
                                            ESI Challan
                                        </button>
                                        <button className="px-4 py-2 bg-orange-100 text-orange-700 rounded-lg text-xs font-medium hover:bg-orange-200 transition-colors">
                                            TDS Challan
                                        </button>
                                    </div>
                                    <p className="text-[10px] text-slate-500 mt-4">Coming soon - Challan generation will be available in the next update</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
