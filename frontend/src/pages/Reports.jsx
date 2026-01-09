import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import AppHeader from '../components/AppHeader';
import { api } from '../services/authService';
import { useAuth } from '../contexts/AuthContext';
import {
    FileText, Download, Calendar, Users, DollarSign, 
    Building2, Shield, Clock, TrendingUp, BarChart3,
    PieChart, RefreshCw, Filter, ChevronDown, FileSpreadsheet,
    Briefcase, AlertCircle, CheckCircle
} from 'lucide-react';

export default function Reports() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [organization, setOrganization] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('payroll');
    const [reportData, setReportData] = useState(null);
    const [generating, setGenerating] = useState(false);
    const [exporting, setExporting] = useState(false);

    const currentDate = new Date();
    const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth() + 1);
    const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
    const [financialYear, setFinancialYear] = useState('2025-26');

    const months = [
        { value: 1, label: 'January' }, { value: 2, label: 'February' },
        { value: 3, label: 'March' }, { value: 4, label: 'April' },
        { value: 5, label: 'May' }, { value: 6, label: 'June' },
        { value: 7, label: 'July' }, { value: 8, label: 'August' },
        { value: 9, label: 'September' }, { value: 10, label: 'October' },
        { value: 11, label: 'November' }, { value: 12, label: 'December' }
    ];

    const years = [2023, 2024, 2025, 2026];
    const financialYears = ['2023-24', '2024-25', '2025-26', '2026-27'];

    const tabs = [
        { id: 'payroll', label: 'Payroll', icon: DollarSign },
        { id: 'tax', label: 'Tax', icon: FileText },
        { id: 'compliance', label: 'Compliance', icon: Shield },
        { id: 'attendance', label: 'Attendance', icon: Clock },
        { id: 'analytics', label: 'Analytics', icon: BarChart3 }
    ];

    useEffect(() => {
        loadOrganization();
    }, []);

    useEffect(() => {
        if (organization?.id) {
            generateReport();
        }
    }, [activeTab, selectedMonth, selectedYear, financialYear, organization?.id]);

    const loadOrganization = async () => {
        try {
            const orgId = localStorage.getItem('selectedOrganizationId');
            if (orgId) {
                const res = await api.get('/organizations');
                const org = res.data?.find(o => o.id === parseInt(orgId));
                setOrganization(org);
            }
        } catch (error) {
            console.error('Error loading organization:', error);
        } finally {
            setLoading(false);
        }
    };

    const generateReport = async () => {
        if (!organization?.id) return;
        setGenerating(true);
        setReportData(null);

        try {
            let endpoint = '';
            let params = {};

            switch (activeTab) {
                case 'payroll':
                    endpoint = '/reports/payroll/summary';
                    params = { month: selectedMonth, year: selectedYear };
                    break;
                case 'tax':
                    endpoint = '/reports/tax/summary';
                    params = { financialYear };
                    break;
                case 'compliance':
                    endpoint = '/reports/compliance/pf';
                    params = { month: selectedMonth, year: selectedYear };
                    break;
                case 'attendance':
                    endpoint = '/reports/attendance';
                    params = { month: selectedMonth, year: selectedYear };
                    break;
                default:
                    return;
            }

            const res = await api.get(endpoint, {
                headers: { 'X-Tenant-ID': organization.id },
                params
            });
            setReportData(res.data);
        } catch (error) {
            console.error('Error generating report:', error);
            setReportData({ error: 'Failed to generate report' });
        } finally {
            setGenerating(false);
        }
    };

    const exportToExcel = async (type) => {
        if (!organization?.id) return;
        setExporting(true);

        try {
            const endpoint = type === 'payroll' ? '/reports/export/payroll' : '/reports/export/attendance';
            const res = await api.get(endpoint, {
                headers: { 'X-Tenant-ID': organization.id },
                params: { month: selectedMonth, year: selectedYear },
                responseType: 'blob'
            });

            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${type}_report_${selectedMonth}_${selectedYear}.xlsx`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error('Error exporting report:', error);
        } finally {
            setExporting(false);
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
                            <h1 className="text-xl font-bold text-slate-900 dark:text-white">Reports & Analytics</h1>
                            <p className="text-xs text-slate-600 dark:text-slate-400">Generate and export comprehensive reports</p>
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

                    {/* Filters */}
                    <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-3 mb-4">
                        <div className="flex items-center gap-3 flex-wrap">
                            <div className="flex items-center gap-2">
                                <Filter className="w-3.5 h-3.5 text-slate-500" />
                                <span className="text-xs font-medium text-slate-700 dark:text-slate-300">Filters:</span>
                            </div>

                            {activeTab === 'tax' ? (
                                <select
                                    value={financialYear}
                                    onChange={(e) => setFinancialYear(e.target.value)}
                                    className="px-2 py-1 text-xs border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                                >
                                    {financialYears.map(fy => (
                                        <option key={fy} value={fy}>FY {fy}</option>
                                    ))}
                                </select>
                            ) : (
                                <>
                                    <select
                                        value={selectedMonth}
                                        onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                                        className="px-2 py-1 text-xs border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                                    >
                                        {months.map(m => (
                                            <option key={m.value} value={m.value}>{m.label}</option>
                                        ))}
                                    </select>

                                    <select
                                        value={selectedYear}
                                        onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                                        className="px-2 py-1 text-xs border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                                    >
                                        {years.map(y => (
                                            <option key={y} value={y}>{y}</option>
                                        ))}
                                    </select>
                                </>
                            )}

                            <button
                                onClick={generateReport}
                                disabled={generating}
                                className="flex items-center gap-1 px-3 py-1 bg-pink-500 hover:bg-pink-600 text-white rounded text-xs font-medium transition-colors disabled:opacity-50"
                            >
                                {generating ? <RefreshCw className="w-3 h-3 animate-spin" /> : <BarChart3 className="w-3 h-3" />}
                                Generate
                            </button>

                            {(activeTab === 'payroll' || activeTab === 'attendance') && (
                                <button
                                    onClick={() => exportToExcel(activeTab)}
                                    disabled={exporting || !reportData}
                                    className="flex items-center gap-1 px-3 py-1 bg-emerald-500 hover:bg-emerald-600 text-white rounded text-xs font-medium transition-colors disabled:opacity-50"
                                >
                                    {exporting ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Download className="w-3 h-3" />}
                                    Export Excel
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Report Content */}
                    {generating ? (
                        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-8 flex items-center justify-center">
                            <div className="text-center">
                                <RefreshCw className="w-6 h-6 animate-spin text-pink-500 mx-auto mb-2" />
                                <p className="text-sm text-slate-600 dark:text-slate-400">Generating report...</p>
                            </div>
                        </div>
                    ) : reportData?.error ? (
                        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-8 flex items-center justify-center">
                            <div className="text-center">
                                <AlertCircle className="w-6 h-6 text-red-500 mx-auto mb-2" />
                                <p className="text-sm text-slate-600 dark:text-slate-400">{reportData.error}</p>
                            </div>
                        </div>
                    ) : reportData ? (
                        <div className="space-y-4">
                            {/* Summary Cards */}
                            {activeTab === 'payroll' && reportData.summary && (
                                <>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-3">
                                            <p className="text-[10px] text-slate-500 uppercase tracking-wide">Total Gross Pay</p>
                                            <p className="text-lg font-bold text-slate-900 dark:text-white">{formatCurrency(reportData.summary.totalGrossPay)}</p>
                                        </div>
                                        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-3">
                                            <p className="text-[10px] text-slate-500 uppercase tracking-wide">Total Deductions</p>
                                            <p className="text-lg font-bold text-red-600">{formatCurrency(reportData.summary.totalDeductions)}</p>
                                        </div>
                                        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-3">
                                            <p className="text-[10px] text-slate-500 uppercase tracking-wide">Total Net Pay</p>
                                            <p className="text-lg font-bold text-emerald-600">{formatCurrency(reportData.summary.totalNetPay)}</p>
                                        </div>
                                        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-3">
                                            <p className="text-[10px] text-slate-500 uppercase tracking-wide">Employees</p>
                                            <p className="text-lg font-bold text-blue-600">{reportData.summary.employeeCount}</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800 p-3">
                                            <p className="text-[10px] text-blue-600 uppercase tracking-wide">Total PF</p>
                                            <p className="text-base font-bold text-blue-700">{formatCurrency(reportData.summary.totalPF)}</p>
                                        </div>
                                        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800 p-3">
                                            <p className="text-[10px] text-green-600 uppercase tracking-wide">Total ESI</p>
                                            <p className="text-base font-bold text-green-700">{formatCurrency(reportData.summary.totalESI)}</p>
                                        </div>
                                        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800 p-3">
                                            <p className="text-[10px] text-purple-600 uppercase tracking-wide">Total PT</p>
                                            <p className="text-base font-bold text-purple-700">{formatCurrency(reportData.summary.totalPT)}</p>
                                        </div>
                                        <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800 p-3">
                                            <p className="text-[10px] text-orange-600 uppercase tracking-wide">Total TDS</p>
                                            <p className="text-base font-bold text-orange-700">{formatCurrency(reportData.summary.totalTDS)}</p>
                                        </div>
                                    </div>
                                </>
                            )}

                            {activeTab === 'tax' && (
                                <>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-3">
                                            <p className="text-[10px] text-slate-500 uppercase tracking-wide">Financial Year</p>
                                            <p className="text-lg font-bold text-slate-900 dark:text-white">{reportData.financialYear}</p>
                                        </div>
                                        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-3">
                                            <p className="text-[10px] text-slate-500 uppercase tracking-wide">Total Tax Deducted</p>
                                            <p className="text-lg font-bold text-orange-600">{formatCurrency(reportData.totalTaxDeducted)}</p>
                                        </div>
                                        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-3">
                                            <p className="text-[10px] text-slate-500 uppercase tracking-wide">Employees</p>
                                            <p className="text-lg font-bold text-blue-600">{reportData.employeeCount}</p>
                                        </div>
                                    </div>
                                </>
                            )}

                            {activeTab === 'compliance' && (
                                <>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-3">
                                            <p className="text-[10px] text-slate-500 uppercase tracking-wide">Due Date</p>
                                            <p className="text-base font-bold text-slate-900 dark:text-white">{reportData.dueDate}</p>
                                        </div>
                                        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800 p-3">
                                            <p className="text-[10px] text-blue-600 uppercase tracking-wide">Employee Share</p>
                                            <p className="text-base font-bold text-blue-700">{formatCurrency(reportData.totalEmployeeContribution)}</p>
                                        </div>
                                        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800 p-3">
                                            <p className="text-[10px] text-green-600 uppercase tracking-wide">Employer Share</p>
                                            <p className="text-base font-bold text-green-700">{formatCurrency(reportData.totalEmployerContribution)}</p>
                                        </div>
                                        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800 p-3">
                                            <p className="text-[10px] text-purple-600 uppercase tracking-wide">Grand Total</p>
                                            <p className="text-base font-bold text-purple-700">{formatCurrency(reportData.grandTotal)}</p>
                                        </div>
                                    </div>
                                </>
                            )}

                            {activeTab === 'attendance' && reportData.summary && (
                                <>
                                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                                        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-3">
                                            <p className="text-[10px] text-slate-500 uppercase tracking-wide">Total Employees</p>
                                            <p className="text-lg font-bold text-slate-900 dark:text-white">{reportData.summary.totalEmployees}</p>
                                        </div>
                                        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800 p-3">
                                            <p className="text-[10px] text-green-600 uppercase tracking-wide">Total Present</p>
                                            <p className="text-lg font-bold text-green-700">{reportData.summary.totalPresent}</p>
                                        </div>
                                        <div className="bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800 p-3">
                                            <p className="text-[10px] text-red-600 uppercase tracking-wide">Total Absent</p>
                                            <p className="text-lg font-bold text-red-700">{reportData.summary.totalAbsent}</p>
                                        </div>
                                        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800 p-3">
                                            <p className="text-[10px] text-blue-600 uppercase tracking-wide">Total Leave</p>
                                            <p className="text-lg font-bold text-blue-700">{reportData.summary.totalLeave}</p>
                                        </div>
                                        <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800 p-3">
                                            <p className="text-[10px] text-orange-600 uppercase tracking-wide">Half Days</p>
                                            <p className="text-lg font-bold text-orange-700">{reportData.summary.totalHalfDay}</p>
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* Data Table */}
                            {reportData.employees && reportData.employees.length > 0 && (
                                <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
                                    <div className="p-3 border-b border-slate-200 dark:border-slate-700">
                                        <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Employee Details</h3>
                                    </div>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-xs">
                                            <thead className="bg-slate-50 dark:bg-slate-700">
                                                <tr>
                                                    <th className="text-left p-2 font-medium text-slate-600 dark:text-slate-300">Employee ID</th>
                                                    <th className="text-left p-2 font-medium text-slate-600 dark:text-slate-300">Name</th>
                                                    {activeTab === 'payroll' && (
                                                        <>
                                                            <th className="text-right p-2 font-medium text-slate-600 dark:text-slate-300">Gross</th>
                                                            <th className="text-right p-2 font-medium text-slate-600 dark:text-slate-300">Deductions</th>
                                                            <th className="text-right p-2 font-medium text-slate-600 dark:text-slate-300">Net</th>
                                                        </>
                                                    )}
                                                    {activeTab === 'tax' && (
                                                        <>
                                                            <th className="text-left p-2 font-medium text-slate-600 dark:text-slate-300">PAN</th>
                                                            <th className="text-right p-2 font-medium text-slate-600 dark:text-slate-300">Total Gross</th>
                                                            <th className="text-right p-2 font-medium text-slate-600 dark:text-slate-300">Tax Deducted</th>
                                                        </>
                                                    )}
                                                    {activeTab === 'compliance' && (
                                                        <>
                                                            <th className="text-left p-2 font-medium text-slate-600 dark:text-slate-300">UAN/PF No.</th>
                                                            <th className="text-right p-2 font-medium text-slate-600 dark:text-slate-300">Basic</th>
                                                            <th className="text-right p-2 font-medium text-slate-600 dark:text-slate-300">Employee</th>
                                                            <th className="text-right p-2 font-medium text-slate-600 dark:text-slate-300">Employer</th>
                                                        </>
                                                    )}
                                                    {activeTab === 'attendance' && (
                                                        <>
                                                            <th className="text-left p-2 font-medium text-slate-600 dark:text-slate-300">Department</th>
                                                            <th className="text-center p-2 font-medium text-slate-600 dark:text-slate-300">Present</th>
                                                            <th className="text-center p-2 font-medium text-slate-600 dark:text-slate-300">Absent</th>
                                                            <th className="text-center p-2 font-medium text-slate-600 dark:text-slate-300">Leave</th>
                                                            <th className="text-center p-2 font-medium text-slate-600 dark:text-slate-300">Rate</th>
                                                        </>
                                                    )}
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                                                {reportData.employees.map((emp, idx) => (
                                                    <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                                                        <td className="p-2 text-slate-900 dark:text-white">{emp.employeeId}</td>
                                                        <td className="p-2 text-slate-900 dark:text-white">{emp.name}</td>
                                                        {activeTab === 'payroll' && (
                                                            <>
                                                                <td className="p-2 text-right text-slate-900 dark:text-white">{formatCurrency(emp.grossSalary)}</td>
                                                                <td className="p-2 text-right text-red-600">{formatCurrency(emp.totalDeductions)}</td>
                                                                <td className="p-2 text-right text-emerald-600 font-medium">{formatCurrency(emp.netSalary)}</td>
                                                            </>
                                                        )}
                                                        {activeTab === 'tax' && (
                                                            <>
                                                                <td className="p-2 text-slate-600 dark:text-slate-400">{emp.pan || '-'}</td>
                                                                <td className="p-2 text-right text-slate-900 dark:text-white">{formatCurrency(emp.totalGross)}</td>
                                                                <td className="p-2 text-right text-orange-600 font-medium">{formatCurrency(emp.totalTaxDeducted)}</td>
                                                            </>
                                                        )}
                                                        {activeTab === 'compliance' && (
                                                            <>
                                                                <td className="p-2 text-slate-600 dark:text-slate-400">{emp.uan || emp.pfNumber || '-'}</td>
                                                                <td className="p-2 text-right text-slate-900 dark:text-white">{formatCurrency(emp.basicWages)}</td>
                                                                <td className="p-2 text-right text-blue-600">{formatCurrency(emp.employeeShare)}</td>
                                                                <td className="p-2 text-right text-green-600">{formatCurrency(emp.employerShare)}</td>
                                                            </>
                                                        )}
                                                        {activeTab === 'attendance' && (
                                                            <>
                                                                <td className="p-2 text-slate-600 dark:text-slate-400">{emp.department || '-'}</td>
                                                                <td className="p-2 text-center text-green-600">{emp.present}</td>
                                                                <td className="p-2 text-center text-red-600">{emp.absent}</td>
                                                                <td className="p-2 text-center text-blue-600">{emp.leave}</td>
                                                                <td className="p-2 text-center font-medium">{emp.attendanceRate}%</td>
                                                            </>
                                                        )}
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            {/* Analytics Tab */}
                            {activeTab === 'analytics' && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4">
                                        <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                                            <PieChart className="w-4 h-4 text-pink-500" />
                                            Salary Distribution
                                        </h3>
                                        <div className="text-center py-8 text-slate-500">
                                            <BarChart3 className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                            <p className="text-xs">Analytics charts coming soon</p>
                                        </div>
                                    </div>
                                    <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4">
                                        <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                                            <TrendingUp className="w-4 h-4 text-emerald-500" />
                                            Payroll Trends
                                        </h3>
                                        <div className="text-center py-8 text-slate-500">
                                            <TrendingUp className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                            <p className="text-xs">Trend charts coming soon</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-8 flex items-center justify-center">
                            <div className="text-center">
                                <FileText className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                                <p className="text-sm text-slate-600 dark:text-slate-400">Select filters and click Generate to view report</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
