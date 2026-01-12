import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import AppHeader from '../components/AppHeader';
import { Button } from '../components/ui/button';
import { api } from '../services/authService';
import { useAuth } from '../contexts/AuthContext';
import {
    Calendar, Clock, Users, CheckCircle, XCircle, Coffee, Sun, Moon,
    ChevronLeft, ChevronRight, Plus, Search, Filter, Download, RefreshCw,
    AlertCircle, Check, X, FileText, CalendarDays, Upload
} from 'lucide-react';

export default function AttendanceLeave() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [organization, setOrganization] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('attendance');
    const [employees, setEmployees] = useState([]);
    const [attendance, setAttendance] = useState([]);
    const [leaveTypes, setLeaveTypes] = useState([]);
    const [leaveRequests, setLeaveRequests] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [searchTerm, setSearchTerm] = useState('');
    const [showLeaveModal, setShowLeaveModal] = useState(false);
    const [showAttendanceModal, setShowAttendanceModal] = useState(false);
    const [showLeaveTypeModal, setShowLeaveTypeModal] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [selectedDay, setSelectedDay] = useState(null);
    const [selectedLeaveType, setSelectedLeaveType] = useState(null);
    const [newLeaveType, setNewLeaveType] = useState({ name: '', code: '', daysPerYear: 0, isPaid: true, description: '' });
    const [alert, setAlert] = useState(null);
    const [showImportModal, setShowImportModal] = useState(false);
    const [importFile, setImportFile] = useState(null);
    const [importing, setImporting] = useState(false);
    const [importResult, setImportResult] = useState(null);

    useEffect(() => {
        loadInitialData();
    }, []);

    useEffect(() => {
        if (organization?.id) {
            // Always load leave types for attendance marking
            loadLeaveTypes();
            
            if (activeTab === 'attendance') {
                loadAttendance();
            } else if (activeTab === 'leave-requests') {
                loadLeaveRequests();
            }
        }
    }, [activeTab, organization?.id, selectedMonth, selectedYear]);

    const loadInitialData = async () => {
        try {
            const orgId = localStorage.getItem('selectedOrganizationId');
            if (orgId) {
                const orgRes = await api.get(`/organizations`);
                const org = orgRes.data?.find(o => o.id === parseInt(orgId));
                setOrganization(org);
                
                const empRes = await api.get(`/employees?organizationId=${orgId}`, { 
                    headers: { 'X-Tenant-ID': orgId } 
                });
                setEmployees(empRes.data || []);
                
                // Load leave types for attendance marking
                const leaveRes = await api.get('/leave/types', {
                    headers: { 'X-Tenant-ID': orgId }
                });
                setLeaveTypes(leaveRes.data || []);
            }
        } catch (error) {
            console.error('Error loading data:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadAttendance = async () => {
        if (!organization?.id) return;
        try {
            const response = await api.get(`/attendance/month?month=${selectedMonth}&year=${selectedYear}`, {
                headers: { 'X-Tenant-ID': organization.id }
            });
            setAttendance(response.data || []);
        } catch (error) {
            console.error('Error loading attendance:', error);
        }
    };

    const loadLeaveTypes = async () => {
        if (!organization?.id) return;
        try {
            const response = await api.get('/leave/types', {
                headers: { 'X-Tenant-ID': organization.id }
            });
            setLeaveTypes(response.data || []);
        } catch (error) {
            console.error('Error loading leave types:', error);
        }
    };

    const loadLeaveRequests = async () => {
        if (!organization?.id) return;
        try {
            const response = await api.get('/leave/requests', {
                headers: { 'X-Tenant-ID': organization.id }
            });
            setLeaveRequests(response.data || []);
        } catch (error) {
            console.error('Error loading leave requests:', error);
        }
    };

    const initializeLeaveTypes = async () => {
        if (!organization?.id) return;
        try {
            await api.post('/leave/types/initialize', {}, {
                headers: { 'X-Tenant-ID': organization.id }
            });
            showAlertMessage('Leave types initialized successfully', 'success');
            loadLeaveTypes();
        } catch (error) {
            showAlertMessage('Failed to initialize leave types', 'error');
        }
    };

    const initializeAttendance = async () => {
        if (!organization?.id) return;
        try {
            await api.post(`/attendance/initialize?month=${selectedMonth}&year=${selectedYear}`, {}, {
                headers: { 'X-Tenant-ID': organization.id }
            });
            showAlertMessage('Attendance initialized for the month', 'success');
            loadAttendance();
        } catch (error) {
            showAlertMessage('Failed to initialize attendance', 'error');
        }
    };

    const handleApproveLeave = async (requestId) => {
        try {
            await api.post(`/leave/requests/${requestId}/approve`, {}, {
                headers: { 'X-Tenant-ID': organization.id, 'X-User-ID': user?.id || 1 }
            });
            showAlertMessage('Leave approved successfully', 'success');
            loadLeaveRequests();
        } catch (error) {
            showAlertMessage('Failed to approve leave', 'error');
        }
    };

    const handleRejectLeave = async (requestId) => {
        const reason = prompt('Enter rejection reason:');
        if (!reason) return;
        try {
            await api.post(`/leave/requests/${requestId}/reject`, { reason }, {
                headers: { 'X-Tenant-ID': organization.id, 'X-User-ID': user?.id || 1 }
            });
            showAlertMessage('Leave rejected', 'success');
            loadLeaveRequests();
        } catch (error) {
            showAlertMessage('Failed to reject leave', 'error');
        }
    };

    const markAttendance = async (employeeId, status, day) => {
        try {
            // Validate leave type selection for LEAVE status
            if (status === 'LEAVE' && !selectedLeaveType) {
                showAlertMessage('Please select a leave type', 'error');
                return;
            }
            
            const dateStr = `${selectedYear}-${String(selectedMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const attendanceData = {
                employeeId,
                date: dateStr,
                status,
                checkInTime: status === 'PRESENT' ? '09:00' : null,
                checkOutTime: status === 'PRESENT' ? '18:00' : null
            };
            
            // Add leave type if status is LEAVE
            if (status === 'LEAVE' && selectedLeaveType) {
                attendanceData.leaveTypeId = selectedLeaveType;
            }
            
            await api.post('/attendance', attendanceData, {
                headers: { 'X-Tenant-ID': organization.id }
            });
            showAlertMessage('Attendance marked successfully', 'success');
            setShowAttendanceModal(false);
            setSelectedLeaveType(null);
            loadAttendance();
        } catch (error) {
            showAlertMessage('Failed to mark attendance', 'error');
        }
    };

    const createLeaveType = async () => {
        if (!newLeaveType.name || !newLeaveType.code) {
            showAlertMessage('Please fill in all required fields', 'error');
            return;
        }
        try {
            await api.post('/leave/types', newLeaveType, {
                headers: { 'X-Tenant-ID': organization.id }
            });
            showAlertMessage('Leave type created successfully', 'success');
            setShowLeaveTypeModal(false);
            setNewLeaveType({ name: '', code: '', daysPerYear: 0, isPaid: true, description: '' });
            loadLeaveTypes();
        } catch (error) {
            showAlertMessage('Failed to create leave type', 'error');
        }
    };

    const markAllPresentForDay = async (day) => {
        if (!confirm(`Mark all employees present for ${new Date(selectedYear, selectedMonth - 1, day).toLocaleDateString()}?`)) {
            return;
        }
        try {
            const dateStr = `${selectedYear}-${String(selectedMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            await api.post(`/attendance/bulk/mark-all-present?date=${dateStr}`, {}, {
                headers: { 'X-Tenant-ID': organization.id }
            });
            showAlertMessage('All employees marked present', 'success');
            loadAttendance();
        } catch (error) {
            showAlertMessage(error.response?.data?.error || 'Failed to mark attendance', 'error');
        }
    };

    const markEmployeeForMonth = async (employeeId, status) => {
        const employee = employees.find(e => e.id === employeeId);
        if (!confirm(`Mark ${employee?.firstName} ${employee?.lastName} as ${status} for entire month?`)) {
            return;
        }
        try {
            await api.post('/attendance/bulk/mark-month', {
                employeeId,
                month: selectedMonth,
                year: selectedYear,
                status
            }, {
                headers: { 'X-Tenant-ID': organization.id }
            });
            showAlertMessage('Employee attendance marked for month', 'success');
            loadAttendance();
        } catch (error) {
            showAlertMessage('Failed to mark attendance', 'error');
        }
    };

    const markAllEmployeesForMonth = async (status) => {
        if (!confirm(`Mark ALL employees as ${status} for entire month?`)) {
            return;
        }
        try {
            await api.post(`/attendance/bulk/mark-all-month?month=${selectedMonth}&year=${selectedYear}&status=${status}`, {}, {
                headers: { 'X-Tenant-ID': organization.id }
            });
            showAlertMessage('All employees marked for month', 'success');
            loadAttendance();
        } catch (error) {
            showAlertMessage('Failed to mark attendance', 'error');
        }
    };

    const autoInitializeAttendance = async () => {
        const monthName = new Date(selectedYear, selectedMonth - 1).toLocaleString('default', { month: 'long' });
        if (!confirm(`Auto-initialize attendance for ${monthName} ${selectedYear}?\n\n✅ Weekends → Marked as WEEKEND\n✅ Working days → Marked as PRESENT\n\nYou can change individual days afterwards.`)) {
            return;
        }
        try {
            setLoading(true);
            await api.post(`/attendance/auto-initialize?month=${selectedMonth}&year=${selectedYear}`, {}, {
                headers: { 'X-Tenant-ID': organization.id }
            });
            showAlertMessage(`Attendance initialized for ${monthName}! Weekends marked, all working days set to PRESENT.`, 'success');
            loadAttendance();
        } catch (error) {
            showAlertMessage(error.response?.data?.message || 'Failed to initialize attendance', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadTemplate = async () => {
        try {
            const response = await api.get('/attendance/import/template', {
                responseType: 'blob'
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'attendance_import_template.xlsx');
            document.body.appendChild(link);
            link.click();
            link.remove();
            showAlertMessage('Template downloaded successfully', 'success');
        } catch (error) {
            showAlertMessage('Failed to download template', 'error');
        }
    };

    const handleFileSelect = (event) => {
        const file = event.target.files[0];
        if (file) {
            if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
                showAlertMessage('Please select a valid Excel file (.xlsx or .xls)', 'error');
                return;
            }
            setImportFile(file);
        }
    };

    const handleImportAttendance = async () => {
        if (!importFile) {
            showAlertMessage('Please select a file to import', 'error');
            return;
        }

        try {
            setImporting(true);
            const formData = new FormData();
            formData.append('file', importFile);

            const response = await api.post('/attendance/import', formData, {
                headers: {
                    'X-Tenant-ID': organization.id,
                    'Content-Type': 'multipart/form-data'
                }
            });

            setImportResult(response.data);
            
            if (response.data.success) {
                showAlertMessage(
                    `Import completed! ${response.data.successCount} records created, ${response.data.updatedCount} updated`,
                    'success'
                );
                loadAttendance();
            } else {
                showAlertMessage(
                    `Import completed with errors. ${response.data.errorCount} errors found.`,
                    'warning'
                );
            }
        } catch (error) {
            showAlertMessage(error.response?.data?.message || 'Failed to import attendance', 'error');
        } finally {
            setImporting(false);
        }
    };

    const closeImportModal = () => {
        setShowImportModal(false);
        setImportFile(null);
        setImportResult(null);
    };

    const resetAttendanceForMonth = async () => {
        const monthName = new Date(selectedYear, selectedMonth - 1).toLocaleString('default', { month: 'long' });
        if (!confirm(`⚠️ RESET ALL ATTENDANCE for ${monthName} ${selectedYear}?\n\n🗑️ This will DELETE all attendance records for this month\n🚫 This action CANNOT be undone\n\nAre you absolutely sure?`)) {
            return;
        }
        // Double confirmation for safety
        if (!confirm(`Final confirmation: Delete ALL attendance for ${monthName} ${selectedYear}?`)) {
            return;
        }
        try {
            setLoading(true);
            const response = await api.delete(`/attendance/reset-month?month=${selectedMonth}&year=${selectedYear}`, {
                headers: { 'X-Tenant-ID': organization.id }
            });
            showAlertMessage(`Attendance cleared for ${monthName}! ${response.data.deletedRecords} records deleted.`, 'success');
            loadAttendance();
        } catch (error) {
            showAlertMessage(error.response?.data?.message || 'Failed to reset attendance', 'error');
        } finally {
            setLoading(false);
        }
    };

    const showAlertMessage = (message, type) => {
        setAlert({ message, type });
        setTimeout(() => setAlert(null), 3000);
    };

    const tabs = [
        { id: 'attendance', label: 'Attendance', icon: Calendar },
        { id: 'leave-requests', label: 'Leave Requests', icon: FileText },
        { id: 'leave-types', label: 'Leave Types', icon: CalendarDays }
    ];

    const getStatusColor = (status) => {
        const colors = {
            'PRESENT': 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
            'ABSENT': 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300',
            'HALF_DAY': 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300',
            'LEAVE': 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
            'HOLIDAY': 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300',
            'WEEKEND': 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300',
            'PENDING': 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300',
            'APPROVED': 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
            'REJECTED': 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
        };
        return colors[status] || 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
    };

    const filteredEmployees = employees.filter(emp =>
        emp.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.employeeId?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getAttendanceForEmployee = (employeeId, day) => {
        const dateStr = `${selectedYear}-${String(selectedMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        return attendance.find(a => a.employeeId === employeeId && a.date === dateStr);
    };

    const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();
    const monthDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);

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
                <AppHeader
                    sidebarCollapsed={!sidebarOpen}
                    setSidebarCollapsed={(collapsed) => setSidebarOpen(!collapsed)}
                    organization={organization}
                    user={user}
                />
                <main className="flex-1 overflow-y-auto p-4">
                    <div className="max-w-7xl mx-auto">
                        <div className="mb-4">
                            <h1 className="text-xl font-bold text-slate-900 dark:text-white">Attendance & Leave</h1>
                            <p className="text-xs text-slate-600 dark:text-slate-400">Manage employee attendance and leave requests</p>
                        </div>

                        {alert && (
                            <div className={`mb-3 px-3 py-2 rounded-lg flex items-center gap-2 text-sm ${alert.type === 'success' ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800' : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800'}`}>
                                {alert.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                                {alert.message}
                            </div>
                        )}

                        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                            <div className="flex overflow-x-auto border-b border-slate-200 dark:border-slate-700">
                                {tabs.map(tab => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap ${
                                            activeTab === tab.id
                                                ? 'text-pink-600 dark:text-pink-400 border-b-2 border-pink-600 dark:border-pink-400 bg-pink-50/50 dark:bg-pink-900/20'
                                                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                                        }`}
                                    >
                                        <tab.icon className="w-4 h-4" />
                                        {tab.label}
                                    </button>
                                ))}
                            </div>

                            <div className="p-6">
                                {activeTab === 'attendance' && (
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-4">
                                                <div className="flex items-center gap-2">
                                                    <button onClick={() => setSelectedMonth(m => m > 1 ? m - 1 : 12)} className="p-1 hover:bg-slate-100 rounded">
                                                        <ChevronLeft className="w-5 h-5" />
                                                    </button>
                                                    <select value={selectedMonth} onChange={(e) => setSelectedMonth(parseInt(e.target.value))} className="px-3 py-1.5 border rounded-lg">
                                                        {[...Array(12)].map((_, i) => (
                                                            <option key={i + 1} value={i + 1}>{new Date(2024, i).toLocaleString('default', { month: 'long' })}</option>
                                                        ))}
                                                    </select>
                                                    <select value={selectedYear} onChange={(e) => setSelectedYear(parseInt(e.target.value))} className="px-3 py-1.5 border rounded-lg">
                                                        {[2024, 2025, 2026].map(y => <option key={y} value={y}>{y}</option>)}
                                                    </select>
                                                    <button onClick={() => setSelectedMonth(m => m < 12 ? m + 1 : 1)} className="p-1 hover:bg-slate-100 rounded">
                                                        <ChevronRight className="w-5 h-5" />
                                                    </button>
                                                </div>
                                                <div className="relative">
                                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                                    <input
                                                        type="text"
                                                        placeholder="Search employees..."
                                                        value={searchTerm}
                                                        onChange={(e) => setSearchTerm(e.target.value)}
                                                        className="pl-10 pr-4 py-1.5 border rounded-lg w-64"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Bulk Actions */}
                                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-4">
                                            <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-3 flex items-center gap-2">
                                                <Users className="w-4 h-4" />
                                                Smart Attendance Initialization
                                            </h3>
                                            
                                            {/* Auto-Initialize - Most Recommended */}
                                            <div className="bg-white dark:bg-slate-800 rounded-lg p-3 mb-3 border-2 border-indigo-300 dark:border-indigo-600">
                                                <div className="flex items-start gap-3">
                                                    <div className="flex-1">
                                                        <h4 className="font-semibold text-indigo-900 dark:text-indigo-100 mb-1 flex items-center gap-2">
                                                            ⚡ Auto-Initialize (Recommended)
                                                        </h4>
                                                        <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">
                                                            Automatically marks weekends as WEEKEND and all working days as PRESENT. Then just change exceptions!
                                                        </p>
                                                        <button
                                                            onClick={autoInitializeAttendance}
                                                            disabled={loading}
                                                            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                                                        >
                                                            <Calendar className="w-4 h-4" />
                                                            Auto-Initialize This Month
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Excel Import */}
                                            <div className="bg-white dark:bg-slate-800 rounded-lg p-3 mb-3 border-2 border-purple-300 dark:border-purple-600">
                                                <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
                                                    <div>
                                                        <h4 className="font-semibold text-purple-900 dark:text-purple-100 mb-1 flex items-center gap-2">
                                                            <Upload className="w-4 h-4" />
                                                            Import from Excel
                                                        </h4>
                                                        <p className="text-xs text-purple-700 dark:text-purple-300 mb-2">
                                                            Bulk import attendance records from Excel file. Automatically detects leaves and marks attendance.
                                                        </p>
                                                        <div className="flex gap-2">
                                                            <button
                                                                onClick={() => setShowImportModal(true)}
                                                                className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors"
                                                            >
                                                                <Upload className="w-4 h-4" />
                                                                Import Attendance
                                                            </button>
                                                            <button
                                                                onClick={handleDownloadTemplate}
                                                                className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-purple-50 text-purple-700 border border-purple-300 rounded-lg text-sm font-medium transition-colors"
                                                            >
                                                                <Download className="w-4 h-4" />
                                                                Download Template
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Manual Bulk Actions */}
                                            <details className="text-sm">
                                                <summary className="cursor-pointer text-blue-700 dark:text-blue-300 font-medium mb-2">Other Bulk Actions</summary>
                                                <div className="flex flex-wrap gap-2 mt-2">
                                                    <button
                                                        onClick={() => markAllEmployeesForMonth('PRESENT')}
                                                        className="flex items-center gap-2 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs font-medium transition-colors"
                                                    >
                                                        <CheckCircle className="w-3 h-3" />
                                                        All Present (Month)
                                                    </button>
                                                    <button
                                                        onClick={() => markAllEmployeesForMonth('ABSENT')}
                                                        className="flex items-center gap-2 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-medium transition-colors"
                                                    >
                                                        <XCircle className="w-3 h-3" />
                                                        All Absent (Month)
                                                    </button>
                                                    <button
                                                        onClick={resetAttendanceForMonth}
                                                        disabled={loading}
                                                        className="flex items-center gap-2 px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-xs font-medium transition-colors disabled:opacity-50"
                                                    >
                                                        <RefreshCw className="w-3 h-3" />
                                                        Reset/Clear Month
                                                    </button>
                                                </div>
                                            </details>
                                        </div>

                                        {/* Legend */}
                                        <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-3 mb-3 border border-slate-200 dark:border-slate-700">
                                            <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">Status Legend:</p>
                                            <div className="flex flex-wrap gap-3 text-xs">
                                                <div className="flex items-center gap-1.5">
                                                    <div className="w-5 h-5 rounded bg-green-500"></div>
                                                    <span className="text-slate-600 dark:text-slate-400">P - Present</span>
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <div className="w-5 h-5 rounded bg-red-500"></div>
                                                    <span className="text-slate-600 dark:text-slate-400">A - Absent</span>
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <div className="w-5 h-5 rounded bg-yellow-500"></div>
                                                    <span className="text-slate-600 dark:text-slate-400">HD - Half Day</span>
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <div className="w-5 h-5 rounded bg-blue-500"></div>
                                                    <span className="text-slate-600 dark:text-slate-400">L - Leave</span>
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <div className="w-5 h-5 rounded bg-purple-500"></div>
                                                    <span className="text-slate-600 dark:text-slate-400">H - Holiday</span>
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <div className="w-5 h-5 rounded bg-slate-300"></div>
                                                    <span className="text-slate-600 dark:text-slate-400">W - Weekend</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="overflow-x-auto">
                                            <table className="w-full text-sm">
                                                <thead className="bg-slate-50 border-b">
                                                    <tr>
                                                        <th className="px-3 py-2 text-left font-semibold sticky left-0 bg-slate-50 z-10">Employee</th>
                                                        {monthDays.map(day => (
                                                            <th key={day} className="px-1 py-2 text-center font-medium min-w-[32px]">
                                                                {day}
                                                            </th>
                                                        ))}
                                                        <th className="px-3 py-2 text-center font-semibold sticky right-0 bg-slate-50 z-10">Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {filteredEmployees.map(emp => (
                                                        <tr key={emp.id} className="border-b hover:bg-slate-50">
                                                            <td className="px-3 py-2 font-medium sticky left-0 bg-white z-10">
                                                                {emp.firstName} {emp.lastName}
                                                            </td>
                                                            {monthDays.map(day => {
                                                                const att = getAttendanceForEmployee(emp.id, day);
                                                                const status = att?.status || '-';
                                                                const dayOfWeek = new Date(selectedYear, selectedMonth - 1, day).getDay();
                                                                const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
                                                                return (
                                                                    <td key={day} className={`px-1 py-1 text-center ${isWeekend ? 'bg-slate-100' : ''}`}>
                                                                        <button
                                                                            onClick={() => {
                                                                                setSelectedEmployee(emp);
                                                                                setSelectedDay(day);
                                                                                setShowAttendanceModal(true);
                                                                            }}
                                                                            className={`w-8 h-8 rounded-lg text-xs font-semibold transition-all hover:scale-110 ${
                                                                                status === 'PRESENT' ? 'bg-green-500 text-white shadow-sm' :
                                                                                status === 'ABSENT' ? 'bg-red-500 text-white shadow-sm' :
                                                                                status === 'HALF_DAY' ? 'bg-yellow-500 text-white shadow-sm' :
                                                                                status === 'LEAVE' ? 'bg-blue-500 text-white shadow-sm' :
                                                                                status === 'HOLIDAY' ? 'bg-purple-500 text-white shadow-sm' :
                                                                                status === 'WEEKEND' ? 'bg-slate-300 text-slate-600' :
                                                                                'bg-slate-200 text-slate-500 hover:bg-slate-300'
                                                                            }`}
                                                                            title={status}
                                                                        >
                                                                            {status === 'PRESENT' ? 'P' : status === 'ABSENT' ? 'A' : status === 'HALF_DAY' ? 'HD' : status === 'LEAVE' ? 'L' : status === 'HOLIDAY' ? 'H' : status === 'WEEKEND' ? 'W' : '-'}
                                                                        </button>
                                                                    </td>
                                                                );
                                                            })}
                                                            <td className="px-3 py-2 sticky right-0 bg-white z-10">
                                                                <div className="flex items-center gap-1">
                                                                    <button
                                                                        onClick={() => markEmployeeForMonth(emp.id, 'PRESENT')}
                                                                        className="p-1.5 hover:bg-green-100 rounded text-green-600 transition-colors"
                                                                        title="Mark Present for Month"
                                                                    >
                                                                        <CheckCircle className="w-4 h-4" />
                                                                    </button>
                                                                    <button
                                                                        onClick={() => markEmployeeForMonth(emp.id, 'ABSENT')}
                                                                        className="p-1.5 hover:bg-red-100 rounded text-red-600 transition-colors"
                                                                        title="Mark Absent for Month"
                                                                    >
                                                                        <XCircle className="w-4 h-4" />
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'leave-requests' && (
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <h3 className="font-semibold text-slate-900">Leave Requests</h3>
                                            <Button onClick={loadLeaveRequests} variant="outline">
                                                <RefreshCw className="w-4 h-4 mr-2" />
                                                Refresh
                                            </Button>
                                        </div>

                                        <div className="overflow-x-auto">
                                            <table className="w-full">
                                                <thead className="bg-slate-50 border-b">
                                                    <tr>
                                                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Employee</th>
                                                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Leave Type</th>
                                                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">From</th>
                                                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">To</th>
                                                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Days</th>
                                                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Reason</th>
                                                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Status</th>
                                                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-slate-200">
                                                    {leaveRequests.length === 0 ? (
                                                        <tr>
                                                            <td colSpan="8" className="px-4 py-8 text-center text-slate-500">
                                                                No leave requests found
                                                            </td>
                                                        </tr>
                                                    ) : (
                                                        leaveRequests.map(request => {
                                                            const emp = employees.find(e => e.id === request.employeeId);
                                                            const leaveType = leaveTypes.find(t => t.id === request.leaveTypeId);
                                                            return (
                                                                <tr key={request.id} className="hover:bg-slate-50">
                                                                    <td className="px-4 py-3 font-medium">{emp ? `${emp.firstName} ${emp.lastName}` : 'Unknown'}</td>
                                                                    <td className="px-4 py-3">{leaveType?.name || 'Unknown'}</td>
                                                                    <td className="px-4 py-3">{request.startDate}</td>
                                                                    <td className="px-4 py-3">{request.endDate}</td>
                                                                    <td className="px-4 py-3">{request.totalDays}</td>
                                                                    <td className="px-4 py-3 max-w-[200px] truncate">{request.reason}</td>
                                                                    <td className="px-4 py-3">
                                                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                                                                            {request.status}
                                                                        </span>
                                                                    </td>
                                                                    <td className="px-4 py-3">
                                                                        {request.status === 'PENDING' && (
                                                                            <div className="flex items-center gap-2">
                                                                                <button onClick={() => handleApproveLeave(request.id)} className="p-1 hover:bg-green-100 rounded text-green-600">
                                                                                    <Check className="w-4 h-4" />
                                                                                </button>
                                                                                <button onClick={() => handleRejectLeave(request.id)} className="p-1 hover:bg-red-100 rounded text-red-600">
                                                                                    <X className="w-4 h-4" />
                                                                                </button>
                                                                            </div>
                                                                        )}
                                                                    </td>
                                                                </tr>
                                                            );
                                                        })
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'leave-types' && (
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <h3 className="font-semibold text-slate-900">Leave Types</h3>
                                            <div className="flex gap-2">
                                                <Button onClick={() => setShowLeaveTypeModal(true)} className="bg-pink-600 hover:bg-pink-700">
                                                    <Plus className="w-4 h-4 mr-2" />
                                                    Add Leave Type
                                                </Button>
                                                <Button onClick={initializeLeaveTypes} variant="outline">
                                                    <RefreshCw className="w-4 h-4 mr-2" />
                                                    Initialize Defaults
                                                </Button>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {leaveTypes.length === 0 ? (
                                                <div className="col-span-full text-center py-8 text-slate-500">
                                                    No leave types configured. Click "Initialize Default Types" to add standard leave types.
                                                </div>
                                            ) : (
                                                leaveTypes.map(type => (
                                                    <div key={type.id} className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                                                        <div className="flex items-center gap-3 mb-2">
                                                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: type.color || '#6B7280' }}></div>
                                                            <h4 className="font-semibold text-slate-900">{type.name}</h4>
                                                            <span className="text-xs bg-slate-200 px-2 py-0.5 rounded">{type.code}</span>
                                                        </div>
                                                        <p className="text-sm text-slate-600 mb-2">{type.description}</p>
                                                        <div className="flex items-center gap-4 text-sm">
                                                            <span className="text-slate-500">Days/Year: <strong>{type.daysPerYear}</strong></span>
                                                            <span className={`px-2 py-0.5 rounded text-xs ${type.isPaid ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                                {type.isPaid ? 'Paid' : 'Unpaid'}
                                                            </span>
                                                            {type.isCarryForward && (
                                                                <span className="px-2 py-0.5 rounded text-xs bg-blue-100 text-blue-700">Carry Forward</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </main>
            </div>

            {/* Attendance Modal */}
            {showAttendanceModal && selectedEmployee && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowAttendanceModal(false)}>
                    <div className="bg-white dark:bg-slate-800 rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Mark Attendance</h3>
                            <button onClick={() => setShowAttendanceModal(false)} className="p-1 hover:bg-slate-100 rounded">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <p className="text-sm text-slate-600 dark:text-slate-400">Employee</p>
                                <p className="font-medium text-slate-900 dark:text-white">{selectedEmployee.firstName} {selectedEmployee.lastName}</p>
                            </div>
                            <div>
                                <p className="text-sm text-slate-600 dark:text-slate-400">Date</p>
                                <p className="font-medium text-slate-900 dark:text-white">
                                    {new Date(selectedYear, selectedMonth - 1, selectedDay).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">Select Status</p>
                                <div className="grid grid-cols-2 gap-2">
                                    <button
                                        onClick={() => markAttendance(selectedEmployee.id, 'PRESENT', selectedDay)}
                                        className="flex items-center justify-center gap-2 p-3 rounded-lg bg-green-50 hover:bg-green-100 border-2 border-green-200 text-green-700 font-medium transition-all"
                                    >
                                        <CheckCircle className="w-5 h-5" />
                                        Present
                                    </button>
                                    <button
                                        onClick={() => markAttendance(selectedEmployee.id, 'ABSENT', selectedDay)}
                                        className="flex items-center justify-center gap-2 p-3 rounded-lg bg-red-50 hover:bg-red-100 border-2 border-red-200 text-red-700 font-medium transition-all"
                                    >
                                        <XCircle className="w-5 h-5" />
                                        Absent
                                    </button>
                                    <button
                                        onClick={() => markAttendance(selectedEmployee.id, 'HALF_DAY', selectedDay)}
                                        className="flex items-center justify-center gap-2 p-3 rounded-lg bg-yellow-50 hover:bg-yellow-100 border-2 border-yellow-200 text-yellow-700 font-medium transition-all"
                                    >
                                        <Coffee className="w-5 h-5" />
                                        Half Day
                                    </button>
                                    <button
                                        onClick={() => markAttendance(selectedEmployee.id, 'HOLIDAY', selectedDay)}
                                        className="flex items-center justify-center gap-2 p-3 rounded-lg bg-purple-50 hover:bg-purple-100 border-2 border-purple-200 text-purple-700 font-medium transition-all"
                                    >
                                        <CalendarDays className="w-5 h-5" />
                                        Holiday
                                    </button>
                                    <button
                                        onClick={() => markAttendance(selectedEmployee.id, 'WEEKEND', selectedDay)}
                                        className="flex items-center justify-center gap-2 p-3 rounded-lg bg-slate-50 hover:bg-slate-100 border-2 border-slate-200 text-slate-700 font-medium transition-all"
                                    >
                                        <Sun className="w-5 h-5" />
                                        Weekend
                                    </button>
                                </div>
                            </div>
                            <div>
                                <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">Leave Type (Required for Leave)</p>
                                <select
                                    value={selectedLeaveType || ''}
                                    onChange={(e) => setSelectedLeaveType(e.target.value ? parseInt(e.target.value) : null)}
                                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-pink-500 dark:bg-slate-700 dark:text-white"
                                >
                                    <option value="">Select Leave Type</option>
                                    {leaveTypes.map(type => (
                                        <option key={type.id} value={type.id}>
                                            {type.name} ({type.isPaid ? 'Paid' : 'Unpaid'}) - {type.daysPerYear} days/year
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <button
                                    onClick={() => markAttendance(selectedEmployee.id, 'LEAVE', selectedDay)}
                                    disabled={!selectedLeaveType}
                                    className="w-full flex items-center justify-center gap-2 p-3 rounded-lg bg-blue-50 hover:bg-blue-100 border-2 border-blue-200 text-blue-700 font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Calendar className="w-5 h-5" />
                                    Mark as Leave
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Leave Type Modal */}
            {showLeaveTypeModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowLeaveTypeModal(false)}>
                    <div className="bg-white dark:bg-slate-800 rounded-xl p-6 max-w-lg w-full mx-4 shadow-2xl" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Add Leave Type</h3>
                            <button onClick={() => setShowLeaveTypeModal(false)} className="p-1 hover:bg-slate-100 rounded">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Leave Name *</label>
                                <input
                                    type="text"
                                    value={newLeaveType.name}
                                    onChange={(e) => setNewLeaveType({ ...newLeaveType, name: e.target.value })}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                                    placeholder="e.g., Casual Leave"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Leave Code *</label>
                                <input
                                    type="text"
                                    value={newLeaveType.code}
                                    onChange={(e) => setNewLeaveType({ ...newLeaveType, code: e.target.value.toUpperCase() })}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                                    placeholder="e.g., CL"
                                    maxLength={10}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Days Per Year</label>
                                <input
                                    type="number"
                                    value={newLeaveType.daysPerYear}
                                    onChange={(e) => setNewLeaveType({ ...newLeaveType, daysPerYear: parseInt(e.target.value) || 0 })}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                                    min="0"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Description</label>
                                <textarea
                                    value={newLeaveType.description}
                                    onChange={(e) => setNewLeaveType({ ...newLeaveType, description: e.target.value })}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                                    rows="3"
                                    placeholder="Brief description of this leave type"
                                />
                            </div>
                            <div className="flex items-center gap-4">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={newLeaveType.isPaid}
                                        onChange={(e) => setNewLeaveType({ ...newLeaveType, isPaid: e.target.checked })}
                                        className="w-4 h-4 text-pink-600 border-slate-300 rounded focus:ring-pink-500"
                                    />
                                    <span className="text-sm text-slate-700 dark:text-slate-300">Paid Leave</span>
                                </label>
                            </div>
                            <div className="flex gap-2 pt-4">
                                <Button onClick={createLeaveType} className="flex-1 bg-pink-600 hover:bg-pink-700">
                                    Create Leave Type
                                </Button>
                                <Button onClick={() => setShowLeaveTypeModal(false)} variant="outline" className="flex-1">
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Import Modal */}
            {showImportModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={closeImportModal}>
                    <div className="bg-white dark:bg-slate-800 rounded-xl p-6 max-w-2xl w-full mx-4 shadow-2xl" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <Upload className="w-5 h-5 text-purple-600" />
                                Import Attendance from Excel
                            </h3>
                            <button onClick={closeImportModal} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            {/* Instructions */}
                            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                                <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">📋 Instructions:</h4>
                                <ol className="text-sm text-blue-800 dark:text-blue-200 space-y-1 list-decimal list-inside">
                                    <li>Download the Excel template using the button below</li>
                                    <li>Fill in attendance data (Employee ID, Date, Status, Leave Type, etc.)</li>
                                    <li>Upload the completed Excel file</li>
                                    <li>Review import results and fix any errors if needed</li>
                                </ol>
                            </div>

                            {/* Template Download */}
                            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-200 dark:border-slate-600">
                                <div>
                                    <p className="font-medium text-slate-900 dark:text-white">Excel Template</p>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">Download the template with sample data</p>
                                </div>
                                <button
                                    onClick={handleDownloadTemplate}
                                    className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors"
                                >
                                    <Download className="w-4 h-4" />
                                    Download Template
                                </button>
                            </div>

                            {/* File Upload */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Upload Excel File
                                </label>
                                <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-6 text-center hover:border-purple-500 dark:hover:border-purple-400 transition-colors">
                                    <input
                                        type="file"
                                        accept=".xlsx,.xls"
                                        onChange={handleFileSelect}
                                        className="hidden"
                                        id="excel-upload"
                                    />
                                    <label htmlFor="excel-upload" className="cursor-pointer">
                                        <Upload className="w-12 h-12 mx-auto text-slate-400 dark:text-slate-500 mb-2" />
                                        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                            {importFile ? importFile.name : 'Click to select Excel file'}
                                        </p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                            Supports .xlsx and .xls files
                                        </p>
                                    </label>
                                </div>
                            </div>

                            {/* Import Results */}
                            {importResult && (
                                <div className={`p-4 rounded-lg border ${
                                    importResult.success 
                                        ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
                                        : 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800'
                                }`}>
                                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                                        {importResult.success ? (
                                            <CheckCircle className="w-5 h-5 text-green-600" />
                                        ) : (
                                            <AlertCircle className="w-5 h-5 text-yellow-600" />
                                        )}
                                        Import Results
                                    </h4>
                                    <div className="text-sm space-y-1">
                                        <p>✅ Created: {importResult.successCount}</p>
                                        <p>🔄 Updated: {importResult.updatedCount}</p>
                                        <p>❌ Errors: {importResult.errorCount}</p>
                                        <p>📊 Total Processed: {importResult.totalProcessed}</p>
                                    </div>
                                    
                                    {importResult.errors && importResult.errors.length > 0 && (
                                        <div className="mt-3">
                                            <p className="font-medium text-red-700 dark:text-red-300 mb-1">Errors:</p>
                                            <div className="max-h-32 overflow-y-auto bg-white dark:bg-slate-800 rounded p-2 text-xs">
                                                {importResult.errors.map((error, idx) => (
                                                    <p key={idx} className="text-red-600 dark:text-red-400">{error}</p>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    
                                    {importResult.warnings && importResult.warnings.length > 0 && (
                                        <div className="mt-3">
                                            <p className="font-medium text-yellow-700 dark:text-yellow-300 mb-1">Warnings:</p>
                                            <div className="max-h-32 overflow-y-auto bg-white dark:bg-slate-800 rounded p-2 text-xs">
                                                {importResult.warnings.map((warning, idx) => (
                                                    <p key={idx} className="text-yellow-600 dark:text-yellow-400">{warning}</p>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
                                <Button onClick={closeImportModal} variant="outline">
                                    {importResult ? 'Close' : 'Cancel'}
                                </Button>
                                {!importResult && (
                                    <Button 
                                        onClick={handleImportAttendance} 
                                        disabled={!importFile || importing}
                                        className="bg-purple-600 hover:bg-purple-700"
                                    >
                                        {importing ? (
                                            <>
                                                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                                                Importing...
                                            </>
                                        ) : (
                                            <>
                                                <Upload className="w-4 h-4 mr-2" />
                                                Import Attendance
                                            </>
                                        )}
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
