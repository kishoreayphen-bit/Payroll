import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import AppHeader from '../components/AppHeader';
import { Button } from '../components/ui/button';
import { 
    Settings as SettingsIcon, 
    Calendar, 
    Shield, 
    DollarSign, 
    FileText,
    Building2,
    Save,
    RefreshCw,
    Plus,
    Pencil,
    Trash2,
    Search,
    Calculator,
    Users,
    Eye,
    Info,
    CheckCircle,
    AlertCircle,
    CalendarDays,
    Sun,
    Gift
} from 'lucide-react';
import { api } from '../services/authService';
import { useAuth } from '../contexts/AuthContext';

export default function Settings() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [searchParams, setSearchParams] = useSearchParams();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [organization, setOrganization] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'pay-schedule');
    const [alert, setAlert] = useState(null);

    useEffect(() => {
        fetchOrganization();
    }, []);

    useEffect(() => {
        setSearchParams({ tab: activeTab });
    }, [activeTab]);

    const fetchOrganization = async () => {
        try {
            const orgId = localStorage.getItem('selectedOrganizationId');
            if (orgId) {
                const response = await api.get(`/organizations`);
                const org = response.data?.find(o => o.id === parseInt(orgId));
                setOrganization(org);
            }
        } catch (error) {
            console.error('Error fetching organization:', error);
        } finally {
            setLoading(false);
        }
    };

    const showAlert = (message, type = 'success') => {
        setAlert({ message, type });
        setTimeout(() => setAlert(null), 5000);
    };

    const tabs = [
        { id: 'pay-schedule', label: 'Pay Schedule', icon: Calendar },
        { id: 'leave-holidays', label: 'Leave & Holidays', icon: CalendarDays },
        { id: 'statutory', label: 'Statutory Compliance', icon: Shield },
        { id: 'salary-components', label: 'Salary Components', icon: DollarSign },
        { id: 'tax-details', label: 'Tax Details', icon: FileText },
        { id: 'organization', label: 'Organization', icon: Building2 }
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
                <AppHeader 
                    sidebarCollapsed={!sidebarOpen} 
                    setSidebarCollapsed={(collapsed) => setSidebarOpen(!collapsed)} 
                    organization={organization} 
                    user={user} 
                />
                <main className="flex-1 overflow-y-auto p-4">
                    <div className="max-w-7xl mx-auto">
                        {/* Header */}
                        <div className="mb-4">
                            <h1 className="text-xl font-bold text-slate-900 dark:text-white">Settings</h1>
                            <p className="text-xs text-slate-600 dark:text-slate-400">
                                Configure your payroll system settings
                            </p>
                        </div>

                        {/* Alert */}
                        {alert && (
                            <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
                                alert.type === 'success' 
                                    ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300 border border-green-200 dark:border-green-800' 
                                    : 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-800'
                            }`}>
                                {alert.type === 'success' ? (
                                    <CheckCircle className="w-5 h-5" />
                                ) : (
                                    <AlertCircle className="w-5 h-5" />
                                )}
                                <span>{alert.message}</span>
                            </div>
                        )}

                        {/* Tabs */}
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

                            {/* Tab Content */}
                            <div className="p-6">
                                {activeTab === 'pay-schedule' && (
                                    <PayScheduleTab organization={organization} showAlert={showAlert} />
                                )}
                                {activeTab === 'leave-holidays' && (
                                    <LeaveHolidaysTab organization={organization} showAlert={showAlert} />
                                )}
                                {activeTab === 'statutory' && (
                                    <StatutoryTab organization={organization} showAlert={showAlert} />
                                )}
                                {activeTab === 'salary-components' && (
                                    <SalaryComponentsTab organization={organization} showAlert={showAlert} />
                                )}
                                {activeTab === 'tax-details' && (
                                    <TaxDetailsTab organization={organization} showAlert={showAlert} />
                                )}
                                {activeTab === 'organization' && (
                                    <OrganizationTab organization={organization} showAlert={showAlert} />
                                )}
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}

function PayScheduleTab({ organization, showAlert }) {
    const navigate = useNavigate();
    
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Pay Schedule Configuration</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                        Configure your organization's pay frequency and schedule
                    </p>
                </div>
                <Button onClick={() => navigate('/settings/pay-schedule')} className="bg-pink-600 hover:bg-pink-700">
                    <Calendar className="w-4 h-4 mr-2" />
                    Configure Pay Schedule
                </Button>
            </div>
            <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                    Set up your pay frequency (monthly, bi-weekly, etc.), pay dates, and payroll calendar.
                </p>
            </div>
        </div>
    );
}

function LeaveHolidaysTab({ organization, showAlert }) {
    const [settings, setSettings] = useState(null);
    const [holidays, setHolidays] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showHolidayModal, setShowHolidayModal] = useState(false);
    const [newHoliday, setNewHoliday] = useState({ name: '', holidayDate: '', holidayType: 'NATIONAL' });
    const currentYear = new Date().getFullYear();

    useEffect(() => {
        if (organization?.id) {
            loadSettings();
            loadHolidays();
        }
    }, [organization?.id]);

    const loadSettings = async () => {
        try {
            const response = await api.get('/organization-settings', {
                headers: { 'X-Tenant-ID': organization.id }
            });
            setSettings(response.data);
        } catch (error) {
            console.error('Error loading settings:', error);
            // Create default settings if none exist
            setSettings({
                saturdayRule: 'ALL_SATURDAYS_OFF',
                sundayOff: true,
                holidayWorkEnabled: false,
                holidayCompensationType: 'EXTRA_PAY',
                holidayPayMultiplier: 1.5,
                autoMarkGovtHolidays: true,
                stateCode: 'TN'
            });
        } finally {
            setLoading(false);
        }
    };

    const loadHolidays = async () => {
        try {
            const response = await api.get(`/organization-settings/holidays/year/${currentYear}`, {
                headers: { 'X-Tenant-ID': organization.id }
            });
            setHolidays(response.data || []);
        } catch (error) {
            console.error('Error loading holidays:', error);
        }
    };

    const saveSettings = async () => {
        setSaving(true);
        try {
            await api.put('/organization-settings', settings, {
                headers: { 'X-Tenant-ID': organization.id }
            });
            showAlert('Settings saved successfully');
        } catch (error) {
            showAlert('Failed to save settings', 'error');
        } finally {
            setSaving(false);
        }
    };

    const initializeHolidays = async () => {
        try {
            await api.post(`/organization-settings/holidays/initialize/${currentYear}`, {}, {
                headers: { 'X-Tenant-ID': organization.id }
            });
            showAlert('Default holidays initialized');
            loadHolidays();
        } catch (error) {
            showAlert('Failed to initialize holidays', 'error');
        }
    };

    const addHoliday = async () => {
        if (!newHoliday.name || !newHoliday.holidayDate) {
            showAlert('Please fill all fields', 'error');
            return;
        }
        try {
            await api.post('/organization-settings/holidays', newHoliday, {
                headers: { 'X-Tenant-ID': organization.id }
            });
            showAlert('Holiday added');
            setShowHolidayModal(false);
            setNewHoliday({ name: '', holidayDate: '', holidayType: 'COMPANY' });
            loadHolidays();
        } catch (error) {
            showAlert('Failed to add holiday', 'error');
        }
    };

    const deleteHoliday = async (id) => {
        if (!confirm('Delete this holiday?')) return;
        try {
            await api.delete(`/organization-settings/holidays/${id}`, {
                headers: { 'X-Tenant-ID': organization.id }
            });
            showAlert('Holiday deleted');
            loadHolidays();
        } catch (error) {
            showAlert('Failed to delete holiday', 'error');
        }
    };

    if (loading) {
        return <div className="flex justify-center py-8"><RefreshCw className="w-6 h-6 animate-spin text-pink-500" /></div>;
    }

    return (
        <div className="space-y-6">
            {/* Weekend Configuration */}
            <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                    <Sun className="w-5 h-5 text-orange-500" />
                    Weekend Configuration
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Saturday Rule
                        </label>
                        <select
                            value={settings?.saturdayRule || 'ALL_SATURDAYS_OFF'}
                            onChange={(e) => setSettings({ ...settings, saturdayRule: e.target.value })}
                            className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                        >
                            <option value="ALL_SATURDAYS_OFF">All Saturdays Off</option>
                            <option value="SECOND_FOURTH_SATURDAY">2nd & 4th Saturday Off</option>
                            <option value="FIRST_THIRD_SATURDAY">1st & 3rd Saturday Off</option>
                            <option value="SECOND_SATURDAY_ONLY">Only 2nd Saturday Off</option>
                            <option value="FOURTH_SATURDAY_ONLY">Only 4th Saturday Off</option>
                            <option value="NO_SATURDAY_OFF">No Saturday Off (All Working)</option>
                        </select>
                        <p className="text-xs text-slate-500 mt-1">
                            Choose which Saturdays are holidays in your organization
                        </p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Sunday
                        </label>
                        <div className="flex items-center gap-3 mt-2">
                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={settings?.sundayOff !== false}
                                    onChange={(e) => setSettings({ ...settings, sundayOff: e.target.checked })}
                                    className="rounded border-slate-300"
                                />
                                <span className="text-sm text-slate-700 dark:text-slate-300">Sunday is a holiday</span>
                            </label>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">
                            Sunday is typically a holiday (default: enabled)
                        </p>
                    </div>
                </div>
            </div>

            {/* Holiday Work Compensation */}
            <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                    <Gift className="w-5 h-5 text-green-500" />
                    Holiday Work Compensation (Optional)
                </h3>
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 mb-4 border border-blue-200 dark:border-blue-800">
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                        Enable this to give extra pay or compensatory off when employees work on holidays/weekends.
                    </p>
                </div>
                <div className="space-y-4">
                    <label className="flex items-center gap-3">
                        <input
                            type="checkbox"
                            checked={settings?.holidayWorkEnabled || false}
                            onChange={(e) => setSettings({ ...settings, holidayWorkEnabled: e.target.checked })}
                            className="rounded border-slate-300 w-5 h-5"
                        />
                        <span className="font-medium text-slate-900 dark:text-white">Enable Holiday Work Compensation</span>
                    </label>

                    {settings?.holidayWorkEnabled && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pl-8">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Compensation Type
                                </label>
                                <select
                                    value={settings?.holidayCompensationType || 'EXTRA_PAY'}
                                    onChange={(e) => setSettings({ ...settings, holidayCompensationType: e.target.value })}
                                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                                >
                                    <option value="EXTRA_PAY">Extra Pay</option>
                                    <option value="DOUBLE_PAY">Double Pay</option>
                                    <option value="COMP_OFF">Compensatory Off</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Pay Multiplier (for Extra Pay)
                                </label>
                                <input
                                    type="number"
                                    step="0.1"
                                    min="1"
                                    max="3"
                                    value={settings?.holidayPayMultiplier || 1.5}
                                    onChange={(e) => setSettings({ ...settings, holidayPayMultiplier: parseFloat(e.target.value) })}
                                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                                />
                                <p className="text-xs text-slate-500 mt-1">1.5 = 150% pay, 2.0 = double pay</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Government Holidays */}
            <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                        <CalendarDays className="w-5 h-5 text-purple-500" />
                        Government & Company Holidays ({currentYear})
                    </h3>
                    <div className="flex gap-2">
                        <Button onClick={initializeHolidays} variant="outline" size="sm">
                            <RefreshCw className="w-4 h-4 mr-1" />
                            Initialize Defaults
                        </Button>
                        <Button onClick={() => setShowHolidayModal(true)} className="bg-pink-600 hover:bg-pink-700" size="sm">
                            <Plus className="w-4 h-4 mr-1" />
                            Add Holiday
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {holidays.length === 0 ? (
                        <div className="col-span-full text-center py-8 text-slate-500">
                            No holidays configured. Click "Initialize Defaults" to add standard Indian holidays.
                        </div>
                    ) : (
                        holidays.map(holiday => (
                            <div key={holiday.id} className="bg-slate-50 dark:bg-slate-800 rounded-lg p-3 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                                <div>
                                    <p className="font-medium text-slate-900 dark:text-white text-sm">{holiday.name}</p>
                                    <p className="text-xs text-slate-500">
                                        {new Date(holiday.holidayDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                    </p>
                                    <span className={`text-xs px-2 py-0.5 rounded mt-1 inline-block ${
                                        holiday.holidayType === 'NATIONAL' ? 'bg-green-100 text-green-700' :
                                        holiday.holidayType === 'STATE' ? 'bg-blue-100 text-blue-700' :
                                        'bg-purple-100 text-purple-700'
                                    }`}>
                                        {holiday.holidayType}
                                    </span>
                                </div>
                                <button
                                    onClick={() => deleteHoliday(holiday.id)}
                                    className="p-1 hover:bg-red-100 rounded text-red-600"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
                <Button onClick={saveSettings} disabled={saving} className="bg-pink-600 hover:bg-pink-700">
                    <Save className="w-4 h-4 mr-2" />
                    {saving ? 'Saving...' : 'Save Settings'}
                </Button>
            </div>

            {/* Add Holiday Modal */}
            {showHolidayModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-slate-800 rounded-lg max-w-md w-full p-6">
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Add Holiday</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                    Holiday Name
                                </label>
                                <input
                                    type="text"
                                    value={newHoliday.name}
                                    onChange={(e) => setNewHoliday({ ...newHoliday, name: e.target.value })}
                                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                                    placeholder="e.g., Company Anniversary"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                    Date
                                </label>
                                <input
                                    type="date"
                                    value={newHoliday.holidayDate}
                                    onChange={(e) => setNewHoliday({ ...newHoliday, holidayDate: e.target.value })}
                                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                    Type
                                </label>
                                <select
                                    value={newHoliday.holidayType}
                                    onChange={(e) => setNewHoliday({ ...newHoliday, holidayType: e.target.value })}
                                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                                >
                                    <option value="NATIONAL">National</option>
                                    <option value="STATE">State</option>
                                    <option value="COMPANY">Company</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex gap-3 mt-6">
                            <Button onClick={addHoliday} className="flex-1 bg-pink-600 hover:bg-pink-700">
                                Add Holiday
                            </Button>
                            <Button onClick={() => setShowHolidayModal(false)} className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-900">
                                Cancel
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function StatutoryTab({ organization, showAlert }) {
    const navigate = useNavigate();
    
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Statutory Compliance</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                        Configure PF, ESI, Professional Tax, and TDS settings
                    </p>
                </div>
                <Button onClick={() => navigate('/settings/statutory')} className="bg-pink-600 hover:bg-pink-700">
                    <Shield className="w-4 h-4 mr-2" />
                    Manage Statutory Settings
                </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                            <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <h4 className="font-semibold text-slate-900 dark:text-white">Provident Fund (PF)</h4>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                        12% employee + 12% employer contributions
                    </p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                            <Shield className="w-5 h-5 text-green-600 dark:text-green-400" />
                        </div>
                        <h4 className="font-semibold text-slate-900 dark:text-white">ESI</h4>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                        0.75% employee + 3.25% employer
                    </p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                            <Calculator className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <h4 className="font-semibold text-slate-900 dark:text-white">Professional Tax</h4>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                        State-wise PT slabs configuration
                    </p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                            <FileText className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                        </div>
                        <h4 className="font-semibold text-slate-900 dark:text-white">TDS / Income Tax</h4>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                        Old & New tax regime calculations
                    </p>
                </div>
            </div>
        </div>
    );
}

function SalaryComponentsTab({ organization, showAlert }) {
    const [components, setComponents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingComponent, setEditingComponent] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        code: '',
        type: 'EARNING',
        calculationType: 'FIXED',
        isStatutory: false,
        isTaxable: true,
        isActive: true,
        displayOrder: 0
    });

    useEffect(() => {
        if (organization?.id) {
            fetchComponents();
        }
    }, [organization?.id]);

    const fetchComponents = async () => {
        if (!organization?.id) return;
        try {
            const response = await api.get(`/salary-components?organizationId=${organization.id}`);
            setComponents(response.data || []);
        } catch (error) {
            console.error('Error fetching components:', error);
            showAlert('Failed to load salary components', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!organization?.id) return;
        try {
            if (editingComponent) {
                await api.put(`/salary-components/${editingComponent.id}`, {
                    ...formData,
                    organizationId: organization.id
                });
                showAlert('Component updated successfully');
            } else {
                await api.post('/salary-components', {
                    ...formData,
                    organizationId: organization.id
                });
                showAlert('Component created successfully');
            }
            setShowModal(false);
            setEditingComponent(null);
            setFormData({
                name: '',
                code: '',
                type: 'EARNING',
                calculationType: 'FIXED',
                isStatutory: false,
                isTaxable: true,
                isActive: true,
                displayOrder: 0
            });
            fetchComponents();
        } catch (error) {
            console.error('Error saving component:', error);
            showAlert('Failed to save component', 'error');
        }
    };

    const handleDelete = async (id) => {
        if (!organization?.id || !confirm('Are you sure you want to delete this component?')) return;
        try {
            await api.delete(`/salary-components/${id}`);
            showAlert('Component deleted successfully');
            fetchComponents();
        } catch (error) {
            console.error('Error deleting component:', error);
            showAlert('Failed to delete component', 'error');
        }
    };

    const filteredComponents = components.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const earnings = filteredComponents.filter(c => c.type === 'EARNING');
    const deductions = filteredComponents.filter(c => c.type === 'DEDUCTION');

    if (loading) {
        return <div className="flex justify-center py-8"><RefreshCw className="w-6 h-6 animate-spin text-pink-500" /></div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Salary Components</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                        Manage earnings and deductions for your payroll
                    </p>
                </div>
                <Button 
                    onClick={() => {
                        setEditingComponent(null);
                        setFormData({
                            name: '',
                            code: '',
                            type: 'EARNING',
                            calculationType: 'FIXED',
                            isStatutory: false,
                            isTaxable: true,
                            isActive: true,
                            displayOrder: 0
                        });
                        setShowModal(true);
                    }}
                    className="bg-pink-600 hover:bg-pink-700"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Component
                </Button>
            </div>

            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                    type="text"
                    placeholder="Search components..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Earnings */}
                <div>
                    <h4 className="font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                        <DollarSign className="w-5 h-5 text-green-600" />
                        Earnings ({earnings.length})
                    </h4>
                    <div className="space-y-2">
                        {earnings.map(component => (
                            <div key={component.id} className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-3 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                                <div>
                                    <p className="font-medium text-slate-900 dark:text-white">{component.name}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-xs px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded">
                                            {component.calculationType}
                                        </span>
                                        {component.isTaxable && (
                                            <span className="text-xs px-2 py-0.5 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded">
                                                Taxable
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => {
                                            setEditingComponent(component);
                                            setFormData(component);
                                            setShowModal(true);
                                        }}
                                        className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded"
                                    >
                                        <Pencil className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(component.id)}
                                        className="p-1.5 hover:bg-red-100 dark:hover:bg-red-900/30 rounded"
                                    >
                                        <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                                    </button>
                                </div>
                            </div>
                        ))}
                        {earnings.length === 0 && (
                            <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-4">
                                No earnings configured
                            </p>
                        )}
                    </div>
                </div>

                {/* Deductions */}
                <div>
                    <h4 className="font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                        <DollarSign className="w-5 h-5 text-red-600" />
                        Deductions ({deductions.length})
                    </h4>
                    <div className="space-y-2">
                        {deductions.map(component => (
                            <div key={component.id} className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-3 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                                <div>
                                    <p className="font-medium text-slate-900 dark:text-white">{component.name}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-xs px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded">
                                            {component.calculationType}
                                        </span>
                                        {component.isStatutory && (
                                            <span className="text-xs px-2 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded">
                                                Statutory
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => {
                                            setEditingComponent(component);
                                            setFormData(component);
                                            setShowModal(true);
                                        }}
                                        className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded"
                                    >
                                        <Pencil className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(component.id)}
                                        className="p-1.5 hover:bg-red-100 dark:hover:bg-red-900/30 rounded"
                                    >
                                        <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                                    </button>
                                </div>
                            </div>
                        ))}
                        {deductions.length === 0 && (
                            <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-4">
                                No deductions configured
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-slate-800 rounded-lg max-w-md w-full p-6">
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                            {editingComponent ? 'Edit Component' : 'Add Component'}
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                    Component Name
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                                    placeholder="e.g., House Rent Allowance"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                    Component Code
                                </label>
                                <input
                                    type="text"
                                    value={formData.code}
                                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                                    placeholder="e.g., HRA"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                    Type
                                </label>
                                <select
                                    value={formData.type}
                                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                                >
                                    <option value="EARNING">Earning</option>
                                    <option value="DEDUCTION">Deduction</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                    Calculation Type
                                </label>
                                <select
                                    value={formData.calculationType}
                                    onChange={(e) => setFormData({ ...formData, calculationType: e.target.value })}
                                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                                >
                                    <option value="FIXED">Fixed Amount</option>
                                    <option value="PERCENTAGE">Percentage</option>
                                    <option value="COMPUTED">Computed</option>
                                </select>
                            </div>
                            <div className="flex items-center gap-4">
                                <label className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={formData.isTaxable}
                                        onChange={(e) => setFormData({ ...formData, isTaxable: e.target.checked })}
                                        className="rounded border-slate-300"
                                    />
                                    <span className="text-sm text-slate-700 dark:text-slate-300">Taxable</span>
                                </label>
                                <label className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={formData.isStatutory}
                                        onChange={(e) => setFormData({ ...formData, isStatutory: e.target.checked })}
                                        className="rounded border-slate-300"
                                    />
                                    <span className="text-sm text-slate-700 dark:text-slate-300">Statutory</span>
                                </label>
                            </div>
                        </div>
                        <div className="flex gap-3 mt-6">
                            <Button onClick={handleSave} className="flex-1 bg-pink-600 hover:bg-pink-700">
                                <Save className="w-4 h-4 mr-2" />
                                Save
                            </Button>
                            <Button 
                                onClick={() => {
                                    setShowModal(false);
                                    setEditingComponent(null);
                                }}
                                className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-900"
                            >
                                Cancel
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function TaxDetailsTab({ organization, showAlert }) {
    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Tax Details Configuration</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Configure GST, TAN, and other tax-related information
                </p>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                <div className="flex items-start gap-3">
                    <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                    <div>
                        <p className="text-sm font-medium text-blue-900 dark:text-blue-300">Coming Soon</p>
                        <p className="text-sm text-blue-700 dark:text-blue-400 mt-1">
                            Tax details configuration including GST registration, TAN number, and tax filing preferences will be available soon.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

function OrganizationTab({ organization, showAlert }) {
    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Organization Settings</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Manage your organization profile and preferences
                </p>
            </div>
            {organization && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
                        <p className="text-sm text-slate-600 dark:text-slate-400">Company Name</p>
                        <p className="font-semibold text-slate-900 dark:text-white mt-1">{organization.companyName}</p>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
                        <p className="text-sm text-slate-600 dark:text-slate-400">Industry</p>
                        <p className="font-semibold text-slate-900 dark:text-white mt-1">{organization.industry || 'Not specified'}</p>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
                        <p className="text-sm text-slate-600 dark:text-slate-400">Employee Count</p>
                        <p className="font-semibold text-slate-900 dark:text-white mt-1">{organization.employeeCount || 'Not specified'}</p>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
                        <p className="text-sm text-slate-600 dark:text-slate-400">Location</p>
                        <p className="font-semibold text-slate-900 dark:text-white mt-1">{organization.location || 'Not specified'}</p>
                    </div>
                </div>
            )}
        </div>
    );
}
