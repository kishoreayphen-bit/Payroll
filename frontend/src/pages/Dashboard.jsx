import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import AppHeader from '../components/AppHeader';
import { api } from '../services/authService';
import { useAuth } from '../contexts/AuthContext';
import {
    Users, DollarSign, Calendar, TrendingUp, TrendingDown,
    CheckCircle, XCircle, Clock, AlertCircle, FileText,
    UserPlus, PlayCircle, Download, Eye, BarChart3,
    PieChart, Activity, Briefcase, Coffee, Heart,
    ArrowUpRight, ArrowDownRight, Plus, ChevronRight,
    CalendarDays, Wallet, Receipt, Bell, RefreshCw, Shield
} from 'lucide-react';
import { Button } from '../components/ui/button';

export default function DashboardNew() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [organization, setOrganization] = useState(null);
    const [loading, setLoading] = useState(true);
    const [dashboardData, setDashboardData] = useState({
        employees: { total: 0, active: 0, onLeave: 0, newThisMonth: 0 },
        payroll: { currentMonth: 0, lastMonth: 0, totalYTD: 0, avgSalary: 0 },
        attendance: { present: 0, absent: 0, onLeave: 0, rate: 0 },
        leaves: { pending: 0, approved: 0, rejected: 0 },
        payRuns: { total: 0, pending: 0, completed: 0, recent: [] },
        recentActivity: []
    });

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            const orgId = localStorage.getItem('selectedOrganizationId');
            if (!orgId) {
                navigate('/select-organization');
                return;
            }

            const orgRes = await api.get('/organizations');
            const org = orgRes.data?.find(o => o.id === parseInt(orgId));
            setOrganization(org);

            // Fetch all dashboard data in parallel
            const [employeesRes, payRunsRes, attendanceRes, leavesRes] = await Promise.all([
                api.get(`/employees?organizationId=${orgId}`, { headers: { 'X-Tenant-ID': orgId } }),
                api.get('/pay-runs', { headers: { 'X-Tenant-ID': orgId } }),
                api.get(`/attendance/summary/organization?date=${new Date().toISOString().split('T')[0]}`, { 
                    headers: { 'X-Tenant-ID': orgId } 
                }).catch(() => ({ data: {} })),
                api.get('/leave/requests', { headers: { 'X-Tenant-ID': orgId } }).catch(() => ({ data: [] }))
            ]);

            const employees = employeesRes.data || [];
            const payRuns = payRunsRes.data || [];
            const attendanceSummary = attendanceRes.data || {};
            const leaveRequests = leavesRes.data || [];

            // Calculate metrics
            const activeEmployees = employees.filter(e => e.status === 'ACTIVE').length;
            const currentMonth = new Date().getMonth();
            const newThisMonth = employees.filter(e => {
                const joinDate = new Date(e.dateOfJoining);
                return joinDate.getMonth() === currentMonth;
            }).length;

            // Payroll calculations
            const currentMonthPayRuns = payRuns.filter(pr => {
                const prDate = new Date(pr.payPeriodEnd);
                return prDate.getMonth() === currentMonth;
            });
            const currentMonthPayroll = currentMonthPayRuns.reduce((sum, pr) => sum + (pr.totalNetPay || 0), 0);
            
            const lastMonthPayRuns = payRuns.filter(pr => {
                const prDate = new Date(pr.payPeriodEnd);
                return prDate.getMonth() === currentMonth - 1;
            });
            const lastMonthPayroll = lastMonthPayRuns.reduce((sum, pr) => sum + (pr.totalNetPay || 0), 0);

            const totalYTD = payRuns.reduce((sum, pr) => sum + (pr.totalNetPay || 0), 0);
            const avgSalary = activeEmployees > 0 ? currentMonthPayroll / activeEmployees : 0;

            // Leave statistics
            const pendingLeaves = leaveRequests.filter(l => l.status === 'PENDING').length;
            const approvedLeaves = leaveRequests.filter(l => l.status === 'APPROVED').length;
            const rejectedLeaves = leaveRequests.filter(l => l.status === 'REJECTED').length;

            // Pay run statistics
            const pendingPayRuns = payRuns.filter(pr => pr.status === 'PENDING_APPROVAL' || pr.status === 'DRAFT').length;
            const completedPayRuns = payRuns.filter(pr => pr.status === 'COMPLETED').length;
            const recentPayRuns = payRuns.slice(0, 5);

            setDashboardData({
                employees: {
                    total: employees.length,
                    active: activeEmployees,
                    onLeave: attendanceSummary.onLeave || 0,
                    newThisMonth
                },
                payroll: {
                    currentMonth: currentMonthPayroll,
                    lastMonth: lastMonthPayroll,
                    totalYTD,
                    avgSalary
                },
                attendance: {
                    present: attendanceSummary.present || 0,
                    absent: attendanceSummary.absent || 0,
                    onLeave: attendanceSummary.onLeave || 0,
                    rate: attendanceSummary.attendanceRate || 0
                },
                leaves: {
                    pending: pendingLeaves,
                    approved: approvedLeaves,
                    rejected: rejectedLeaves
                },
                payRuns: {
                    total: payRuns.length,
                    pending: pendingPayRuns,
                    completed: completedPayRuns,
                    recent: recentPayRuns
                },
                recentActivity: []
            });

        } catch (error) {
            console.error('Error loading dashboard:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount || 0);
    };

    const getPayrollTrend = () => {
        const diff = dashboardData.payroll.currentMonth - dashboardData.payroll.lastMonth;
        const percentChange = dashboardData.payroll.lastMonth > 0 
            ? ((diff / dashboardData.payroll.lastMonth) * 100).toFixed(1)
            : 0;
        return { diff, percentChange, isPositive: diff >= 0 };
    };

    const payrollTrend = getPayrollTrend();

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

            <div className={`flex-1 flex flex-col h-screen transition-all duration-300 ${sidebarOpen ? 'ml-56' : 'ml-0'}`}>
                <AppHeader 
                    sidebarOpen={sidebarOpen} 
                    setSidebarOpen={setSidebarOpen}
                    organization={organization}
                />

                <div className="flex-1 overflow-y-auto p-4">
                    {/* Header */}
                    <div className="mb-4">
                        <h1 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
                            Dashboard Overview
                        </h1>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                            Welcome back, {user?.email?.split('@')[0]}! Here's what's happening today.
                        </p>
                    </div>

                    {/* Key Metrics Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
                        {/* Total Employees */}
                        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-3 hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between mb-2">
                                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded flex items-center justify-center">
                                    <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                </div>
                                <span className="text-[10px] font-medium text-green-600 dark:text-green-400 flex items-center gap-0.5">
                                    <ArrowUpRight className="w-2.5 h-2.5" />
                                    {dashboardData.employees.newThisMonth} new
                                </span>
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                                {dashboardData.employees.total}
                            </h3>
                            <p className="text-xs text-slate-600 dark:text-slate-400">Total Employees</p>
                            <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-700">
                                <div className="flex items-center justify-between text-[10px]">
                                    <span className="text-slate-600 dark:text-slate-400">Active</span>
                                    <span className="font-semibold text-slate-900 dark:text-white">{dashboardData.employees.active}</span>
                                </div>
                            </div>
                        </div>

                        {/* Current Month Payroll */}
                        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-3 hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between mb-2">
                                <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded flex items-center justify-center">
                                    <DollarSign className="w-4 h-4 text-green-600 dark:text-green-400" />
                                </div>
                                <span className={`text-[10px] font-medium flex items-center gap-0.5 ${
                                    payrollTrend.isPositive 
                                        ? 'text-green-600 dark:text-green-400' 
                                        : 'text-red-600 dark:text-red-400'
                                }`}>
                                    {payrollTrend.isPositive ? <ArrowUpRight className="w-2.5 h-2.5" /> : <ArrowDownRight className="w-2.5 h-2.5" />}
                                    {Math.abs(payrollTrend.percentChange)}%
                                </span>
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                                {formatCurrency(dashboardData.payroll.currentMonth)}
                            </h3>
                            <p className="text-xs text-slate-600 dark:text-slate-400">Current Month Payroll</p>
                            <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-700">
                                <div className="flex items-center justify-between text-[10px]">
                                    <span className="text-slate-600 dark:text-slate-400">Avg Salary</span>
                                    <span className="font-semibold text-slate-900 dark:text-white">{formatCurrency(dashboardData.payroll.avgSalary)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Attendance Rate */}
                        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-3 hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between mb-2">
                                <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded flex items-center justify-center">
                                    <Calendar className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                                </div>
                                <span className="text-[10px] font-medium text-purple-600 dark:text-purple-400">
                                    Today
                                </span>
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                                {dashboardData.attendance.rate.toFixed(1)}%
                            </h3>
                            <p className="text-xs text-slate-600 dark:text-slate-400">Attendance Rate</p>
                            <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-700">
                                <div className="flex items-center gap-3 text-[10px]">
                                    <div className="flex items-center gap-1">
                                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                                        <span className="text-slate-600 dark:text-slate-400">{dashboardData.attendance.present} Present</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                                        <span className="text-slate-600 dark:text-slate-400">{dashboardData.attendance.absent} Absent</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Pending Approvals */}
                        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-3 hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between mb-2">
                                <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/30 rounded flex items-center justify-center">
                                    <Clock className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                                </div>
                                {dashboardData.leaves.pending > 0 && (
                                    <span className="w-5 h-5 bg-orange-500 text-white rounded-full flex items-center justify-center text-[10px] font-bold">
                                        {dashboardData.leaves.pending}
                                    </span>
                                )}
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                                {dashboardData.leaves.pending}
                            </h3>
                            <p className="text-xs text-slate-600 dark:text-slate-400">Pending Leave Requests</p>
                            <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-700">
                                <Link to="/attendance?tab=leave-requests" className="text-[10px] text-orange-600 dark:text-orange-400 hover:underline font-medium">
                                    Review requests →
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 mb-4">
                        {/* Quick Actions - Compact Design */}
                        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-2.5">
                            <h2 className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">
                                Quick Actions
                            </h2>
                            <div className="grid grid-cols-2 gap-1.5">
                                <button
                                    onClick={() => navigate('/pay-runs')}
                                    className="flex items-center gap-2 px-2.5 py-2 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white rounded-md text-[11px] font-medium transition-all"
                                >
                                    <PlayCircle className="w-3.5 h-3.5" />
                                    Run Payroll
                                </button>
                                <button
                                    onClick={() => navigate('/employees/add')}
                                    className="flex items-center gap-2 px-2.5 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-white rounded-md text-[11px] font-medium transition-all"
                                >
                                    <UserPlus className="w-3.5 h-3.5 text-blue-500" />
                                    Add Employee
                                </button>
                                <button
                                    onClick={() => navigate('/attendance')}
                                    className="flex items-center gap-2 px-2.5 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-white rounded-md text-[11px] font-medium transition-all"
                                >
                                    <CalendarDays className="w-3.5 h-3.5 text-purple-500" />
                                    Attendance
                                </button>
                                <button
                                    onClick={() => navigate('/reports')}
                                    className="flex items-center gap-2 px-2.5 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-white rounded-md text-[11px] font-medium transition-all"
                                >
                                    <BarChart3 className="w-3.5 h-3.5 text-emerald-500" />
                                    Reports
                                </button>
                            </div>
                        </div>

                        {/* Payroll Summary */}
                        <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-3">
                            <div className="flex items-center justify-between mb-3">
                                <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                    <Wallet className="w-4 h-4 text-pink-600" />
                                    Payroll Summary
                                </h2>
                                <Link to="/pay-runs" className="text-xs text-pink-600 hover:text-pink-700 font-medium flex items-center gap-1">
                                    View All <ChevronRight className="w-3 h-3" />
                                </Link>
                            </div>
                            
                            <div className="grid grid-cols-3 gap-2 mb-3">
                                <div className="bg-slate-50 dark:bg-slate-700/50 rounded p-2">
                                    <p className="text-[10px] text-slate-600 dark:text-slate-400">Total Pay Runs</p>
                                    <p className="text-lg font-bold text-slate-900 dark:text-white">{dashboardData.payRuns.total}</p>
                                </div>
                                <div className="bg-slate-50 dark:bg-slate-700/50 rounded p-2">
                                    <p className="text-[10px] text-slate-600 dark:text-slate-400">Pending</p>
                                    <p className="text-lg font-bold text-orange-600">{dashboardData.payRuns.pending}</p>
                                </div>
                                <div className="bg-slate-50 dark:bg-slate-700/50 rounded p-2">
                                    <p className="text-[10px] text-slate-600 dark:text-slate-400">Completed</p>
                                    <p className="text-lg font-bold text-green-600">{dashboardData.payRuns.completed}</p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">Recent Pay Runs</h3>
                                {dashboardData.payRuns.recent.length > 0 ? (
                                    dashboardData.payRuns.recent.map((payRun) => (
                                        <div key={payRun.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                                    payRun.status === 'COMPLETED' ? 'bg-green-100 dark:bg-green-900/30' :
                                                    payRun.status === 'PENDING_APPROVAL' ? 'bg-orange-100 dark:bg-orange-900/30' :
                                                    'bg-blue-100 dark:bg-blue-900/30'
                                                }`}>
                                                    <Receipt className={`w-5 h-5 ${
                                                        payRun.status === 'COMPLETED' ? 'text-green-600' :
                                                        payRun.status === 'PENDING_APPROVAL' ? 'text-orange-600' :
                                                        'text-blue-600'
                                                    }`} />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-slate-900 dark:text-white text-sm">
                                                        {new Date(payRun.payPeriodStart).toLocaleDateString()} - {new Date(payRun.payPeriodEnd).toLocaleDateString()}
                                                    </p>
                                                    <p className="text-xs text-slate-600 dark:text-slate-400">
                                                        {payRun.employeeCount || 0} employees
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-slate-900 dark:text-white text-sm">
                                                    {formatCurrency(payRun.totalNetPay)}
                                                </p>
                                                <span className={`text-xs px-2 py-1 rounded-full ${
                                                    payRun.status === 'COMPLETED' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                                                    payRun.status === 'PENDING_APPROVAL' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' :
                                                    'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                                                }`}>
                                                    {payRun.status}
                                                </span>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                                        <Receipt className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                        <p className="text-sm">No pay runs yet</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Bottom Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Leave Statistics */}
                        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                    <Coffee className="w-5 h-5 text-pink-600" />
                                    Leave Overview
                                </h2>
                                <Link to="/attendance?tab=leave-requests" className="text-sm text-pink-600 hover:text-pink-700 font-medium flex items-center gap-1">
                                    Manage <ChevronRight className="w-4 h-4" />
                                </Link>
                            </div>
                            
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                                            <Clock className="w-5 h-5 text-orange-600" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-slate-900 dark:text-white">Pending Approval</p>
                                            <p className="text-xs text-slate-600 dark:text-slate-400">Requires action</p>
                                        </div>
                                    </div>
                                    <span className="text-2xl font-bold text-orange-600">{dashboardData.leaves.pending}</span>
                                </div>

                                <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                                            <CheckCircle className="w-5 h-5 text-green-600" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-slate-900 dark:text-white">Approved</p>
                                            <p className="text-xs text-slate-600 dark:text-slate-400">This month</p>
                                        </div>
                                    </div>
                                    <span className="text-2xl font-bold text-green-600">{dashboardData.leaves.approved}</span>
                                </div>

                                <div className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
                                            <XCircle className="w-5 h-5 text-red-600" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-slate-900 dark:text-white">Rejected</p>
                                            <p className="text-xs text-slate-600 dark:text-slate-400">This month</p>
                                        </div>
                                    </div>
                                    <span className="text-2xl font-bold text-red-600">{dashboardData.leaves.rejected}</span>
                                </div>
                            </div>
                        </div>

                        {/* Year to Date Summary */}
                        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-pink-600" />
                                Year to Date Summary
                            </h2>
                            
                            <div className="space-y-6">
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm text-slate-600 dark:text-slate-400">Total Payroll (YTD)</span>
                                        <span className="text-lg font-bold text-slate-900 dark:text-white">
                                            {formatCurrency(dashboardData.payroll.totalYTD)}
                                        </span>
                                    </div>
                                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                                        <div className="bg-gradient-to-r from-pink-500 to-rose-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4">
                                        <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Current Month</p>
                                        <p className="text-xl font-bold text-slate-900 dark:text-white">
                                            {formatCurrency(dashboardData.payroll.currentMonth)}
                                        </p>
                                    </div>
                                    <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4">
                                        <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Last Month</p>
                                        <p className="text-xl font-bold text-slate-900 dark:text-white">
                                            {formatCurrency(dashboardData.payroll.lastMonth)}
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-gradient-to-r from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20 rounded-lg p-4 border border-pink-200 dark:border-pink-800">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Average Salary</p>
                                            <p className="text-2xl font-bold text-slate-900 dark:text-white">
                                                {formatCurrency(dashboardData.payroll.avgSalary)}
                                            </p>
                                        </div>
                                        <div className="w-12 h-12 bg-pink-100 dark:bg-pink-900/30 rounded-lg flex items-center justify-center">
                                            <DollarSign className="w-6 h-6 text-pink-600" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Statutory Compliance Section */}
                    <div className="mt-4 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-4">
                        <div className="flex items-center justify-between mb-3">
                            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <Shield className="w-4 h-4 text-pink-600" />
                                Statutory Compliance
                            </h2>
                            <Link to="/settings/statutory" className="text-xs text-pink-600 hover:text-pink-700 font-medium flex items-center gap-1">
                                Configure <ChevronRight className="w-3 h-3" />
                            </Link>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 border border-blue-200 dark:border-blue-800">
                                <div className="flex items-center gap-2 mb-1">
                                    <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900/30 rounded flex items-center justify-center">
                                        <span className="text-xs font-bold text-blue-600">PF</span>
                                    </div>
                                    <span className="text-xs font-medium text-blue-800 dark:text-blue-200">Provident Fund</span>
                                </div>
                                <p className="text-lg font-bold text-blue-700 dark:text-blue-300">12%</p>
                                <p className="text-[10px] text-blue-600 dark:text-blue-400">Employee + Employer</p>
                            </div>
                            
                            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 border border-green-200 dark:border-green-800">
                                <div className="flex items-center gap-2 mb-1">
                                    <div className="w-6 h-6 bg-green-100 dark:bg-green-900/30 rounded flex items-center justify-center">
                                        <span className="text-xs font-bold text-green-600">ESI</span>
                                    </div>
                                    <span className="text-xs font-medium text-green-800 dark:text-green-200">State Insurance</span>
                                </div>
                                <p className="text-lg font-bold text-green-700 dark:text-green-300">0.75%</p>
                                <p className="text-[10px] text-green-600 dark:text-green-400">If gross ≤ ₹21,000</p>
                            </div>
                            
                            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3 border border-purple-200 dark:border-purple-800">
                                <div className="flex items-center gap-2 mb-1">
                                    <div className="w-6 h-6 bg-purple-100 dark:bg-purple-900/30 rounded flex items-center justify-center">
                                        <span className="text-xs font-bold text-purple-600">PT</span>
                                    </div>
                                    <span className="text-xs font-medium text-purple-800 dark:text-purple-200">Professional Tax</span>
                                </div>
                                <p className="text-lg font-bold text-purple-700 dark:text-purple-300">₹200</p>
                                <p className="text-[10px] text-purple-600 dark:text-purple-400">Max per month</p>
                            </div>
                            
                            <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-3 border border-orange-200 dark:border-orange-800">
                                <div className="flex items-center gap-2 mb-1">
                                    <div className="w-6 h-6 bg-orange-100 dark:bg-orange-900/30 rounded flex items-center justify-center">
                                        <span className="text-xs font-bold text-orange-600">TDS</span>
                                    </div>
                                    <span className="text-xs font-medium text-orange-800 dark:text-orange-200">Income Tax</span>
                                </div>
                                <p className="text-lg font-bold text-orange-700 dark:text-orange-300">Slab</p>
                                <p className="text-[10px] text-orange-600 dark:text-orange-400">As per regime</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
