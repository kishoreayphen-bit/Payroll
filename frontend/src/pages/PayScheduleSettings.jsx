import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
    Settings,
    Calendar,
    Plus,
    Edit,
    Trash2,
    Check,
    X,
    Clock,
    AlertCircle,
    Star,
    ChevronRight,
    Menu,
    LayoutDashboard,
    Users,
    Receipt,
    Wallet,
    Gift,
    FolderOpen,
    PieChart,
    FileText,
    CheckCircle
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { api } from '../services/authService';
import AppHeader from '../components/AppHeader';

const PAY_FREQUENCIES = [
    { value: 'MONTHLY', label: 'Monthly', description: 'Employees are paid once a month' },
    { value: 'WEEKLY', label: 'Weekly', description: 'Employees are paid every week' },
    { value: 'BI_WEEKLY', label: 'Bi-Weekly', description: 'Employees are paid every two weeks' },
    { value: 'SEMI_MONTHLY', label: 'Semi-Monthly', description: 'Employees are paid twice a month' }
];

const WEEK_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function PayScheduleSettings() {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const { darkMode } = useTheme();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [showCompanyMenu, setShowCompanyMenu] = useState(false);
    const [organization, setOrganization] = useState(null);
    const [loading, setLoading] = useState(true);
    const [schedules, setSchedules] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingSchedule, setEditingSchedule] = useState(null);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        scheduleName: '',
        payFrequency: 'MONTHLY',
        payDay: 1,
        weekDay: 'Friday',
        firstPayDay: 1,
        secondPayDay: 15,
        cutOffDays: 5,
        processingDays: 3,
        effectiveFrom: new Date().toISOString().split('T')[0],
        isDefault: false
    });

    useEffect(() => {
        fetchOrganization();
    }, []);

    useEffect(() => {
        if (organization) {
            fetchSchedules();
        }
    }, [organization]);

    const fetchOrganization = async () => {
        try {
            const selectedOrgId = localStorage.getItem('selectedOrganizationId');
            if (!selectedOrgId) {
                navigate('/select-organization');
                return;
            }

            const response = await api.get('/organizations');
            if (response.data && response.data.length > 0) {
                const selectedOrg = response.data.find(org => org.id === parseInt(selectedOrgId));
                if (selectedOrg) {
                    setOrganization(selectedOrg);
                }
            }
        } catch (err) {
            console.error('Error fetching organization:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchSchedules = async () => {
        try {
            const response = await api.get(`/pay-schedules/organization/${organization.id}`);
            setSchedules(response.data || []);
        } catch (err) {
            console.error('Error fetching pay schedules:', err);
        }
    };

    const handleOpenModal = (schedule = null) => {
        if (schedule) {
            setEditingSchedule(schedule);
            setFormData({
                scheduleName: schedule.scheduleName,
                payFrequency: schedule.payFrequency,
                payDay: schedule.payDay || 1,
                weekDay: schedule.weekDay || 'Friday',
                firstPayDay: schedule.firstPayDay || 1,
                secondPayDay: schedule.secondPayDay || 15,
                cutOffDays: schedule.cutOffDays || 5,
                processingDays: schedule.processingDays || 3,
                effectiveFrom: schedule.effectiveFrom || new Date().toISOString().split('T')[0],
                isDefault: schedule.isDefault || false
            });
        } else {
            setEditingSchedule(null);
            setFormData({
                scheduleName: '',
                payFrequency: 'MONTHLY',
                payDay: 1,
                weekDay: 'Friday',
                firstPayDay: 1,
                secondPayDay: 15,
                cutOffDays: 5,
                processingDays: 3,
                effectiveFrom: new Date().toISOString().split('T')[0],
                isDefault: schedules.length === 0
            });
        }
        setError('');
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingSchedule(null);
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError('');

        try {
            const payload = {
                ...formData,
                organizationId: organization.id,
                payDay: formData.payFrequency === 'MONTHLY' ? parseInt(formData.payDay) : null,
                weekDay: formData.payFrequency === 'WEEKLY' || formData.payFrequency === 'BI_WEEKLY' ? formData.weekDay : null,
                firstPayDay: formData.payFrequency === 'SEMI_MONTHLY' ? parseInt(formData.firstPayDay) : null,
                secondPayDay: formData.payFrequency === 'SEMI_MONTHLY' ? parseInt(formData.secondPayDay) : null,
                cutOffDays: parseInt(formData.cutOffDays),
                processingDays: parseInt(formData.processingDays)
            };

            if (editingSchedule) {
                await api.put(`/pay-schedules/${editingSchedule.id}`, payload);
            } else {
                await api.post('/pay-schedules', payload);
            }

            await fetchSchedules();
            handleCloseModal();
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to save pay schedule');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this pay schedule?')) return;

        try {
            await api.delete(`/pay-schedules/${id}/organization/${organization.id}`);
            await fetchSchedules();
        } catch (err) {
            alert(err.response?.data?.error || 'Failed to delete pay schedule');
        }
    };

    const handleSetDefault = async (id) => {
        try {
            await api.put(`/pay-schedules/${id}/organization/${organization.id}/set-default`);
            await fetchSchedules();
        } catch (err) {
            alert(err.response?.data?.error || 'Failed to set as default');
        }
    };

    const getPayDayDescription = (schedule) => {
        switch (schedule.payFrequency) {
            case 'MONTHLY':
                return `Day ${schedule.payDay} of each month`;
            case 'WEEKLY':
                return `Every ${schedule.weekDay}`;
            case 'BI_WEEKLY':
                return `Every other ${schedule.weekDay}`;
            case 'SEMI_MONTHLY':
                return `Day ${schedule.firstPayDay} and ${schedule.secondPayDay} of each month`;
            default:
                return '';
        }
    };

    return (
        <div className="h-screen bg-slate-50 dark:bg-slate-900 flex overflow-hidden">
            {/* Sidebar */}
            <div
                className={`bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white flex flex-col fixed left-0 top-0 h-screen transition-all duration-300 shadow-2xl ${sidebarOpen ? 'w-56' : 'w-0'}`}
                style={{ overflow: sidebarOpen ? 'visible' : 'hidden' }}
            >
                {sidebarOpen && (
                    <>
                        {/* Logo */}
                        <div className="p-6 border-b border-slate-700/50 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-rose-600 rounded-lg flex items-center justify-center">
                                    <Receipt className="w-5 h-5 text-white" />
                                </div>
                                <span className="text-xl font-bold bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent">Payroll</span>
                            </div>
                            <button onClick={() => setSidebarOpen(false)} className="p-1.5 hover:bg-slate-700/50 rounded-lg transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Navigation */}
                        <nav className="flex-1 p-4 space-y-6 overflow-y-auto scrollbar-hide">
                            <div className="space-y-1">
                                <div className="px-3 mb-2">
                                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Main</span>
                                </div>
                                <Link to="/dashboard" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-700/50 text-slate-300 hover:text-white transition-all group">
                                    <LayoutDashboard className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                    <span className="font-medium">Dashboard</span>
                                </Link>
                                <Link to="/employees" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-700/50 text-slate-300 hover:text-white transition-all group">
                                    <Users className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                    <span className="font-medium">Employees</span>
                                </Link>
                            </div>

                            <div className="space-y-1">
                                <div className="px-3 mb-2">
                                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Payroll</span>
                                </div>
                                <Link to="/pay-runs" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-700/50 text-slate-300 hover:text-white transition-all group">
                                    <Calendar className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                    <span className="font-medium">Pay Runs</span>
                                </Link>
                                <Link to="/salary-components" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-700/50 text-slate-300 hover:text-white transition-all group">
                                    <Wallet className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                    <span className="font-medium">Salary Components</span>
                                </Link>
                            </div>

                            <div className="space-y-1">
                                <div className="px-3 mb-2">
                                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Management</span>
                                </div>
                                <Link to="/settings/pay-schedule" className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg shadow-pink-500/30">
                                    <Settings className="w-5 h-5" />
                                    <span className="font-medium">Settings</span>
                                </Link>
                            </div>
                        </nav>
                    </>
                )}
            </div>

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
                <div className="flex-1 overflow-y-auto p-6">
                    <div className="max-w-5xl mx-auto">
                        {/* Page Header */}
                        <div className="mb-6">
                            <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-2">
                                <Link to="/settings" className="hover:text-pink-600">Settings</Link>
                                <ChevronRight className="w-4 h-4" />
                                <span className="text-slate-900 dark:text-white">Pay Schedule</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Pay Schedule Configuration</h1>
                                    <p className="text-slate-600 dark:text-slate-400 mt-1">
                                        Configure how and when your employees get paid
                                    </p>
                                </div>
                                <Button
                                    onClick={() => handleOpenModal()}
                                    className="bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white"
                                >
                                    <Plus className="w-4 h-4 mr-2" />
                                    Add Pay Schedule
                                </Button>
                            </div>
                        </div>

                        {/* Info Card */}
                        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 mb-6">
                            <div className="flex gap-3">
                                <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                                <div>
                                    <h3 className="font-semibold text-blue-900 dark:text-blue-300">Why Configure Pay Schedule?</h3>
                                    <p className="text-sm text-blue-700 dark:text-blue-400 mt-1">
                                        Pay schedules determine when payroll is processed and when employees receive their salaries. 
                                        Setting up accurate pay schedules ensures timely salary disbursement and helps with payroll planning.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Schedules List */}
                        {schedules.length === 0 ? (
                            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-12 text-center">
                                <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Calendar className="w-8 h-8 text-slate-400" />
                                </div>
                                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">No Pay Schedules Yet</h3>
                                <p className="text-slate-600 dark:text-slate-400 mb-4">
                                    Create your first pay schedule to start processing payroll
                                </p>
                                <Button
                                    onClick={() => handleOpenModal()}
                                    className="bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white"
                                >
                                    <Plus className="w-4 h-4 mr-2" />
                                    Create Pay Schedule
                                </Button>
                            </div>
                        ) : (
                            <div className="grid gap-4">
                                {schedules.map((schedule) => (
                                    <div
                                        key={schedule.id}
                                        className={`bg-white dark:bg-slate-800 rounded-xl border-2 ${
                                            schedule.isDefault 
                                                ? 'border-pink-300 dark:border-pink-600' 
                                                : 'border-slate-200 dark:border-slate-700'
                                        } p-5 hover:shadow-lg transition-all`}
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                                                        {schedule.scheduleName}
                                                    </h3>
                                                    {schedule.isDefault && (
                                                        <span className="px-2 py-0.5 bg-pink-100 dark:bg-pink-900/50 text-pink-700 dark:text-pink-300 text-xs font-medium rounded-full flex items-center gap-1">
                                                            <Star className="w-3 h-3" />
                                                            Default
                                                        </span>
                                                    )}
                                                    <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-medium rounded-full">
                                                        {PAY_FREQUENCIES.find(f => f.value === schedule.payFrequency)?.label}
                                                    </span>
                                                </div>
                                                <div className="grid grid-cols-3 gap-4 text-sm">
                                                    <div>
                                                        <span className="text-slate-500 dark:text-slate-400">Pay Day:</span>
                                                        <p className="font-medium text-slate-900 dark:text-white">{getPayDayDescription(schedule)}</p>
                                                    </div>
                                                    <div>
                                                        <span className="text-slate-500 dark:text-slate-400">Cut-off:</span>
                                                        <p className="font-medium text-slate-900 dark:text-white">{schedule.cutOffDays} days before pay day</p>
                                                    </div>
                                                    <div>
                                                        <span className="text-slate-500 dark:text-slate-400">Processing:</span>
                                                        <p className="font-medium text-slate-900 dark:text-white">{schedule.processingDays} days</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {!schedule.isDefault && (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleSetDefault(schedule.id)}
                                                        className="text-slate-600 dark:text-slate-300 hover:text-pink-600 dark:hover:text-pink-400"
                                                    >
                                                        <Star className="w-4 h-4" />
                                                    </Button>
                                                )}
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleOpenModal(schedule)}
                                                    className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleDelete(schedule.id)}
                                                    className="text-slate-600 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-hidden">
                        <div className="bg-gradient-to-r from-pink-600 to-rose-600 px-6 py-4 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-white">
                                {editingSchedule ? 'Edit Pay Schedule' : 'Create Pay Schedule'}
                            </h2>
                            <button onClick={handleCloseModal} className="p-1 hover:bg-white/20 rounded-lg transition-colors">
                                <X className="w-5 h-5 text-white" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
                            {error && (
                                <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300 text-sm">
                                    {error}
                                </div>
                            )}

                            <div className="space-y-4">
                                {/* Schedule Name */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
                                        Schedule Name <span className="text-red-500">*</span>
                                    </label>
                                    <Input
                                        type="text"
                                        value={formData.scheduleName}
                                        onChange={(e) => setFormData({ ...formData, scheduleName: e.target.value })}
                                        placeholder="e.g., Monthly Payroll"
                                        className="bg-white dark:bg-slate-700 dark:text-white border-slate-300 dark:border-slate-600"
                                        required
                                    />
                                </div>

                                {/* Pay Frequency */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">
                                        Pay Frequency <span className="text-red-500">*</span>
                                    </label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {PAY_FREQUENCIES.map((freq) => (
                                            <button
                                                key={freq.value}
                                                type="button"
                                                onClick={() => setFormData({ ...formData, payFrequency: freq.value })}
                                                className={`p-3 rounded-lg border-2 text-left transition-all ${
                                                    formData.payFrequency === freq.value
                                                        ? 'border-pink-500 bg-pink-50 dark:bg-pink-900/30'
                                                        : 'border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500'
                                                }`}
                                            >
                                                <div className={`font-medium ${
                                                    formData.payFrequency === freq.value 
                                                        ? 'text-pink-700 dark:text-pink-300' 
                                                        : 'text-slate-900 dark:text-white'
                                                }`}>
                                                    {freq.label}
                                                </div>
                                                <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                                    {freq.description}
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Pay Day Settings based on frequency */}
                                {formData.payFrequency === 'MONTHLY' && (
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
                                            Pay Day (Day of Month) <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            value={formData.payDay}
                                            onChange={(e) => setFormData({ ...formData, payDay: e.target.value })}
                                            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-pink-500"
                                        >
                                            {[...Array(31)].map((_, i) => (
                                                <option key={i + 1} value={i + 1}>
                                                    {i + 1}{i === 0 ? 'st' : i === 1 ? 'nd' : i === 2 ? 'rd' : 'th'}
                                                </option>
                                            ))}
                                            <option value="31">Last day of month</option>
                                        </select>
                                    </div>
                                )}

                                {(formData.payFrequency === 'WEEKLY' || formData.payFrequency === 'BI_WEEKLY') && (
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
                                            Pay Day (Day of Week) <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            value={formData.weekDay}
                                            onChange={(e) => setFormData({ ...formData, weekDay: e.target.value })}
                                            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-pink-500"
                                        >
                                            {WEEK_DAYS.map((day) => (
                                                <option key={day} value={day}>{day}</option>
                                            ))}
                                        </select>
                                    </div>
                                )}

                                {formData.payFrequency === 'SEMI_MONTHLY' && (
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
                                                First Pay Day <span className="text-red-500">*</span>
                                            </label>
                                            <select
                                                value={formData.firstPayDay}
                                                onChange={(e) => setFormData({ ...formData, firstPayDay: e.target.value })}
                                                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-pink-500"
                                            >
                                                {[...Array(15)].map((_, i) => (
                                                    <option key={i + 1} value={i + 1}>{i + 1}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
                                                Second Pay Day <span className="text-red-500">*</span>
                                            </label>
                                            <select
                                                value={formData.secondPayDay}
                                                onChange={(e) => setFormData({ ...formData, secondPayDay: e.target.value })}
                                                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-pink-500"
                                            >
                                                {[...Array(16)].map((_, i) => (
                                                    <option key={i + 15} value={i + 15}>{i + 15}</option>
                                                ))}
                                                <option value="31">Last day</option>
                                            </select>
                                        </div>
                                    </div>
                                )}

                                {/* Cut-off and Processing Days */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
                                            Cut-off Days
                                        </label>
                                        <Input
                                            type="number"
                                            min="0"
                                            max="15"
                                            value={formData.cutOffDays}
                                            onChange={(e) => setFormData({ ...formData, cutOffDays: e.target.value })}
                                            className="bg-white dark:bg-slate-700 dark:text-white border-slate-300 dark:border-slate-600"
                                        />
                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Days before pay day to stop accepting changes</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
                                            Processing Days
                                        </label>
                                        <Input
                                            type="number"
                                            min="1"
                                            max="10"
                                            value={formData.processingDays}
                                            onChange={(e) => setFormData({ ...formData, processingDays: e.target.value })}
                                            className="bg-white dark:bg-slate-700 dark:text-white border-slate-300 dark:border-slate-600"
                                        />
                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Days needed to process payroll</p>
                                    </div>
                                </div>

                                {/* Effective From */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
                                        Effective From
                                    </label>
                                    <Input
                                        type="date"
                                        value={formData.effectiveFrom}
                                        onChange={(e) => setFormData({ ...formData, effectiveFrom: e.target.value })}
                                        className="bg-white dark:bg-slate-700 dark:text-white border-slate-300 dark:border-slate-600"
                                    />
                                </div>

                                {/* Default Toggle */}
                                <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                                    <input
                                        type="checkbox"
                                        id="isDefault"
                                        checked={formData.isDefault}
                                        onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                                        className="w-4 h-4 text-pink-600 border-slate-300 rounded focus:ring-pink-500"
                                    />
                                    <label htmlFor="isDefault" className="text-sm text-slate-700 dark:text-slate-200">
                                        Set as default pay schedule for new employees
                                    </label>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3 mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
                                <Button
                                    type="button"
                                    onClick={handleCloseModal}
                                    variant="outline"
                                    className="flex-1 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-700"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={saving}
                                    className="flex-1 bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white"
                                >
                                    {saving ? 'Saving...' : editingSchedule ? 'Update Schedule' : 'Create Schedule'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
