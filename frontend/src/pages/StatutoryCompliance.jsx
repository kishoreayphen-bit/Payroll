import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/authService';
import Sidebar from '../components/Sidebar';
import AppHeader from '../components/AppHeader';
import { Button } from '../components/ui/button';
import { Building2, Shield, Calculator, FileText, Users, Settings, Save, RefreshCw, Info, CheckCircle, AlertCircle, Search, Eye } from 'lucide-react';

export default function StatutoryCompliance() {
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [showCompanyMenu, setShowCompanyMenu] = useState(false);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [organization, setOrganization] = useState(null);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('settings');
    const [saving, setSaving] = useState(false);
    const [settings, setSettings] = useState({
        pfEnabled: true, pfEmployeeRate: 12, pfEmployerRate: 12, pfAdminChargesRate: 0.5, pfEdliRate: 0.5,
        pfWageCeiling: 15000, pfIncludeEmployerContributionInCtc: true, pfEstablishmentId: '', pfEstablishmentName: '',
        esiEnabled: true, esiEmployeeRate: 0.75, esiEmployerRate: 3.25, esiWageCeiling: 21000, esiCode: '',
        ptEnabled: true, ptState: 'Tamil Nadu', tdsEnabled: true, tanNumber: '', deductorName: '', deductorCategory: 'Company',
        lwfEnabled: false, lwfEmployeeContribution: 0, lwfEmployerContribution: 0
    });
    const [ptSlabs, setPtSlabs] = useState([]);
    const [ptStates, setPtStates] = useState([]);
    const [selectedPtState, setSelectedPtState] = useState('Tamil Nadu');
    const [taxDeclarations, setTaxDeclarations] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [financialYear, setFinancialYear] = useState('2025-26');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => { loadInitialData(); }, []);

    const loadInitialData = async () => {
        try {
            setLoading(true);
            const selectedOrgId = localStorage.getItem('selectedOrganizationId');
            if (!selectedOrgId) { navigate('/select-organization'); return; }
            const orgResponse = await api.get('/organizations');
            if (orgResponse.data?.length > 0) {
                const selectedOrg = orgResponse.data.find(org => org.id === parseInt(selectedOrgId));
                setOrganization(selectedOrg || orgResponse.data[0]);
            }
            const userResponse = await api.get('/auth/me');
            setUser(userResponse.data);
            await loadStatutorySettings(selectedOrgId);
            await loadPTData();
        } catch (error) { console.error('Failed to load:', error); } 
        finally { setLoading(false); }
    };

    const loadStatutorySettings = async (tenantId) => {
        try {
            const response = await api.get('/statutory/settings', { headers: { 'X-Tenant-ID': tenantId } });
            if (response.data) setSettings(response.data);
        } catch (error) { console.error('Failed to load settings:', error); }
    };

    const loadPTData = async () => {
        try {
            const [slabsRes, statesRes] = await Promise.all([api.get('/statutory/pt/slabs'), api.get('/statutory/pt/states')]);
            setPtSlabs(slabsRes.data || []); setPtStates(statesRes.data || []);
        } catch (error) { console.error('Failed to load PT:', error); }
    };

    const loadEmployees = async () => {
        if (!organization?.id) return;
        try {
            const response = await api.get('/statutory/employees', { headers: { 'X-Tenant-ID': organization.id } });
            setEmployees(response.data || []);
        } catch (error) { console.error('Failed to load employees:', error); }
    };

    const loadTaxDeclarations = async () => {
        if (!organization?.id) return;
        try {
            const response = await api.get(`/statutory/tax-declarations?financialYear=${financialYear}`, { headers: { 'X-Tenant-ID': organization.id } });
            setTaxDeclarations(response.data || []);
        } catch (error) { console.error('Failed to load declarations:', error); }
    };

    const saveSettings = async () => {
        if (!organization?.id) return;
        try {
            setSaving(true);
            await api.post('/statutory/settings', settings, { headers: { 'X-Tenant-ID': organization.id } });
            alert('Settings saved successfully!');
        } catch (error) { alert('Failed to save: ' + error.message); } 
        finally { setSaving(false); }
    };

    const initializePTSlabs = async () => {
        if (!organization?.id) return;
        try {
            await api.post('/statutory/pt/initialize', {}, { headers: { 'X-Tenant-ID': organization.id } });
            await loadPTData();
            alert('PT slabs initialized!');
        } catch (error) { alert('Failed to initialize PT slabs'); }
    };

    useEffect(() => {
        if (activeTab === 'employees' && organization?.id) loadEmployees();
        else if (activeTab === 'tds' && organization?.id) loadTaxDeclarations();
    }, [activeTab, organization?.id, financialYear]);

    const formatCurrency = (amount) => amount ? new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(amount) : '₹0';
    const logout = () => { localStorage.clear(); navigate('/login'); };
    const tabs = [
        { id: 'settings', label: 'Settings', icon: Settings }, { id: 'pf', label: 'PF/EPF', icon: Building2 },
        { id: 'esi', label: 'ESI', icon: Shield }, { id: 'pt', label: 'Prof. Tax', icon: Calculator },
        { id: 'tds', label: 'TDS', icon: FileText }, { id: 'employees', label: 'Employees', icon: Users }
    ];

    if (loading) return <div className="h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center"><RefreshCw className="w-8 h-8 animate-spin text-pink-500" /></div>;

    return (
        <div className="h-screen bg-slate-50 dark:bg-slate-900 flex overflow-hidden">
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            <div className={`flex-1 flex flex-col min-w-0 overflow-hidden transition-all duration-300 ${sidebarOpen ? 'ml-56' : 'ml-0'}`}>
                <AppHeader sidebarCollapsed={!sidebarOpen} setSidebarCollapsed={(collapsed) => setSidebarOpen(!collapsed)} organization={organization} user={user} />
                <main className="flex-1 overflow-y-auto p-6">
                    <div className="max-w-7xl mx-auto">
                        <div className="mb-6">
                            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Statutory Compliance</h1>
                            <p className="text-slate-600 dark:text-slate-400 mt-1">Configure PF, ESI, Professional Tax, and TDS</p>
                        </div>
                        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 mb-6">
                            <div className="flex overflow-x-auto border-b border-slate-200 dark:border-slate-700">
                                {tabs.map(tab => (<button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap ${activeTab === tab.id ? 'text-pink-600 dark:text-pink-400 border-b-2 border-pink-600 dark:border-pink-400 bg-pink-50/50 dark:bg-pink-900/20' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50'}`}><tab.icon className="w-4 h-4" />{tab.label}</button>))}
                            </div>
                            <div className="p-6">
                                {activeTab === 'settings' && <SettingsTab settings={settings} setSettings={setSettings} saveSettings={saveSettings} saving={saving} />}
                                {activeTab === 'pf' && <PFTab settings={settings} setSettings={setSettings} saveSettings={saveSettings} saving={saving} />}
                                {activeTab === 'esi' && <ESITab settings={settings} setSettings={setSettings} saveSettings={saveSettings} saving={saving} />}
                                {activeTab === 'pt' && <PTTab settings={settings} setSettings={setSettings} ptSlabs={ptSlabs} ptStates={ptStates} selectedPtState={selectedPtState} setSelectedPtState={setSelectedPtState} initializePTSlabs={initializePTSlabs} formatCurrency={formatCurrency} />}
                                {activeTab === 'tds' && <TDSTab taxDeclarations={taxDeclarations} financialYear={financialYear} setFinancialYear={setFinancialYear} formatCurrency={formatCurrency} />}
                                {activeTab === 'employees' && <EmployeesTab employees={employees} searchTerm={searchTerm} setSearchTerm={setSearchTerm} loadEmployees={loadEmployees} />}
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}

function SettingsTab({ settings, setSettings, saveSettings, saving }) {
    const toggles = [
        { key: 'pfEnabled', label: 'Provident Fund (PF)', desc: '12% Employee + 12% Employer', icon: Building2, color: 'blue' },
        { key: 'esiEnabled', label: 'ESI', desc: '0.75% Employee + 3.25% Employer', icon: Shield, color: 'green' },
        { key: 'ptEnabled', label: 'Professional Tax', desc: 'State-wise slabs', icon: Calculator, color: 'purple' },
        { key: 'tdsEnabled', label: 'TDS (Income Tax)', desc: 'Tax Deducted at Source', icon: FileText, color: 'orange' }
    ];
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Organization Settings</h2>
                <Button onClick={saveSettings} disabled={saving} className="bg-pink-600 hover:bg-pink-700">{saving ? <RefreshCw className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}Save</Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {toggles.map(t => (<div key={t.key} className="bg-slate-50 dark:bg-slate-700/30 rounded-lg p-4 border border-slate-200 dark:border-slate-600 flex justify-between items-center">
                    <div className="flex items-center gap-3"><div className={`w-10 h-10 rounded-lg bg-${t.color}-100 dark:bg-${t.color}-900/30 flex items-center justify-center`}><t.icon className={`w-5 h-5 text-${t.color}-600`} /></div><div><h3 className="font-medium text-slate-900 dark:text-white">{t.label}</h3><p className="text-sm text-slate-500 dark:text-slate-400">{t.desc}</p></div></div>
                    <label className="relative inline-flex items-center cursor-pointer"><input type="checkbox" checked={settings[t.key]} onChange={e => setSettings({...settings, [t.key]: e.target.checked})} className="sr-only peer" /><div className="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:bg-pink-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div></label>
                </div>))}
            </div>
            <div className="bg-slate-50 dark:bg-slate-700/30 rounded-lg p-6 border border-slate-200 dark:border-slate-600">
                <h3 className="font-medium text-slate-900 dark:text-white mb-4">TDS Deductor Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div><label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">TAN Number</label><input type="text" value={settings.tanNumber || ''} onChange={e => setSettings({...settings, tanNumber: e.target.value.toUpperCase()})} placeholder="ABCD12345E" className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white" /></div>
                    <div><label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Deductor Name</label><input type="text" value={settings.deductorName || ''} onChange={e => setSettings({...settings, deductorName: e.target.value})} placeholder="Company Name" className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white" /></div>
                    <div><label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Category</label><select value={settings.deductorCategory || 'Company'} onChange={e => setSettings({...settings, deductorCategory: e.target.value})} className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"><option value="Company">Company</option><option value="Government">Government</option><option value="Individual">Individual</option></select></div>
                </div>
            </div>
        </div>
    );
}

function PFTab({ settings, setSettings, saveSettings, saving }) {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Provident Fund Configuration</h2>
                <Button onClick={saveSettings} disabled={saving} className="bg-pink-600 hover:bg-pink-700">{saving ? <RefreshCw className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}Save</Button>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 rounded-lg p-4"><div className="flex gap-3"><Info className="w-5 h-5 text-blue-600 flex-shrink-0" /><div className="text-sm text-blue-800 dark:text-blue-200"><p className="font-medium">Standard PF: 12% Employee + 12% Employer</p><p>Admin Charges: 0.50% | EDLI: 0.50%</p></div></div></div>
            <div className="bg-slate-50 dark:bg-slate-700/30 rounded-lg p-6 border">
                <h3 className="font-medium mb-4 text-slate-900 dark:text-white">Establishment Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div><label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">PF Establishment ID</label><input type="text" value={settings.pfEstablishmentId || ''} onChange={e => setSettings({...settings, pfEstablishmentId: e.target.value.toUpperCase()})} placeholder="TNCHE1234567000" className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500" /></div>
                    <div><label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Establishment Name</label><input type="text" value={settings.pfEstablishmentName || ''} onChange={e => setSettings({...settings, pfEstablishmentName: e.target.value})} className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500" /></div>
                </div>
            </div>
            <div className="bg-slate-50 dark:bg-slate-700/30 rounded-lg p-6 border">
                <h3 className="font-medium mb-4 text-slate-900 dark:text-white">Contribution Rates</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div><label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Employee %</label><input type="number" step="0.01" value={settings.pfEmployeeRate || 12} onChange={e => setSettings({...settings, pfEmployeeRate: parseFloat(e.target.value)})} className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500" /></div>
                    <div><label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Employer %</label><input type="number" step="0.01" value={settings.pfEmployerRate || 12} onChange={e => setSettings({...settings, pfEmployerRate: parseFloat(e.target.value)})} className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500" /></div>
                    <div><label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Admin %</label><input type="number" step="0.01" value={settings.pfAdminChargesRate || 0.5} onChange={e => setSettings({...settings, pfAdminChargesRate: parseFloat(e.target.value)})} className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500" /></div>
                    <div><label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Wage Ceiling ₹</label><input type="number" value={settings.pfWageCeiling || 15000} onChange={e => setSettings({...settings, pfWageCeiling: parseInt(e.target.value)})} className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500" /></div>
                </div>
            </div>
        </div>
    );
}

function ESITab({ settings, setSettings, saveSettings, saving }) {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">ESI Configuration</h2>
                <Button onClick={saveSettings} disabled={saving} className="bg-pink-600 hover:bg-pink-700">{saving ? <RefreshCw className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}Save</Button>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 rounded-lg p-4"><div className="flex gap-3"><Info className="w-5 h-5 text-green-600 flex-shrink-0" /><div className="text-sm text-green-800"><p className="font-medium">ESI applicable when gross ≤ ₹21,000</p><p>Employee: 0.75% | Employer: 3.25%</p></div></div></div>
            <div className="bg-slate-50 dark:bg-slate-700/30 rounded-lg p-6 border">
                <h3 className="font-medium mb-4 text-slate-900 dark:text-white">ESI Registration</h3>
                <div><label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">ESI Code</label><input type="text" value={settings.esiCode || ''} onChange={e => setSettings({...settings, esiCode: e.target.value})} placeholder="12345678901234567" className="w-full md:w-1/2 px-3 py-2 border rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500" /></div>
            </div>
            <div className="bg-slate-50 dark:bg-slate-700/30 rounded-lg p-6 border">
                <h3 className="font-medium mb-4 text-slate-900 dark:text-white">Rates</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div><label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Employee %</label><input type="number" step="0.01" value={settings.esiEmployeeRate || 0.75} onChange={e => setSettings({...settings, esiEmployeeRate: parseFloat(e.target.value)})} className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500" /></div>
                    <div><label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Employer %</label><input type="number" step="0.01" value={settings.esiEmployerRate || 3.25} onChange={e => setSettings({...settings, esiEmployerRate: parseFloat(e.target.value)})} className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500" /></div>
                    <div><label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Wage Ceiling ₹</label><input type="number" value={settings.esiWageCeiling || 21000} onChange={e => setSettings({...settings, esiWageCeiling: parseInt(e.target.value)})} className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500" /></div>
                </div>
            </div>
        </div>
    );
}

function PTTab({ settings, setSettings, ptSlabs, ptStates, selectedPtState, setSelectedPtState, initializePTSlabs, formatCurrency }) {
    const filteredSlabs = ptSlabs.filter(s => s.state === selectedPtState);
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Professional Tax</h2>
                {ptSlabs.length === 0 && <Button onClick={initializePTSlabs} className="bg-pink-600 hover:bg-pink-700">Initialize PT Slabs</Button>}
            </div>
            <div className="bg-slate-50 dark:bg-slate-700/30 rounded-lg p-6 border">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div><label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Organization State</label><select value={settings.ptState || 'Tamil Nadu'} onChange={e => { setSettings({...settings, ptState: e.target.value}); setSelectedPtState(e.target.value); }} className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white">{(ptStates.length > 0 ? ptStates : ['Tamil Nadu', 'Karnataka', 'Maharashtra', 'Andhra Pradesh', 'Telangana', 'West Bengal', 'Gujarat', 'Kerala']).map(s => <option key={s} value={s}>{s}</option>)}</select></div>
                    <div><label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">View Slabs For</label><select value={selectedPtState} onChange={e => setSelectedPtState(e.target.value)} className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white">{(ptStates.length > 0 ? ptStates : ['Tamil Nadu', 'Karnataka', 'Maharashtra']).map(s => <option key={s} value={s}>{s}</option>)}</select></div>
                </div>
            </div>
            <div className="bg-slate-50 dark:bg-slate-700/30 rounded-lg p-6 border">
                <h3 className="font-medium mb-4 text-slate-900 dark:text-white">PT Slabs - {selectedPtState}</h3>
                {filteredSlabs.length > 0 ? (
                    <table className="w-full"><thead className="bg-slate-100 dark:bg-slate-700"><tr><th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 dark:text-slate-300">From (₹)</th><th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 dark:text-slate-300">To (₹)</th><th className="px-4 py-3 text-right text-xs font-semibold text-slate-700 dark:text-slate-300">Tax (₹)</th></tr></thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-600">{filteredSlabs.map((s, i) => <tr key={i} className="hover:bg-slate-100/50 dark:hover:bg-slate-700/50"><td className="px-4 py-3 text-sm text-slate-700 dark:text-slate-300">{formatCurrency(s.fromAmount)}</td><td className="px-4 py-3 text-sm text-slate-700 dark:text-slate-300">{s.toAmount ? formatCurrency(s.toAmount) : 'Above'}</td><td className="px-4 py-3 text-sm text-right font-medium text-slate-900 dark:text-white">{formatCurrency(s.taxAmount)}</td></tr>)}</tbody></table>
                ) : <div className="text-center py-8 text-slate-500"><Calculator className="w-10 h-10 mx-auto mb-3 opacity-50" /><p>No PT slabs found. Click "Initialize PT Slabs" to add.</p></div>}
            </div>
        </div>
    );
}

function TDSTab({ taxDeclarations, financialYear, setFinancialYear, formatCurrency }) {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">TDS / Income Tax</h2>
                <select value={financialYear} onChange={e => setFinancialYear(e.target.value)} className="px-3 py-2 border rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"><option value="2025-26">FY 2025-26</option><option value="2024-25">FY 2024-25</option></select>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 rounded-lg p-4"><h3 className="font-medium text-blue-800 mb-2">Old Regime</h3><ul className="text-sm text-blue-700 space-y-1"><li>0 - ₹2.5L: Nil</li><li>₹2.5L - ₹5L: 5%</li><li>₹5L - ₹10L: 20%</li><li>Above ₹10L: 30%</li><li className="font-medium mt-2">+ Std Deduction ₹50K</li></ul></div>
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 rounded-lg p-4"><h3 className="font-medium text-green-800 mb-2">New Regime (Default)</h3><ul className="text-sm text-green-700 space-y-1"><li>0 - ₹3L: Nil</li><li>₹3L - ₹7L: 5%</li><li>₹7L - ₹10L: 10%</li><li>₹10L - ₹12L: 15%</li><li>₹12L - ₹15L: 20%</li><li>Above ₹15L: 30%</li><li className="font-medium mt-2">+ Std Deduction ₹75K</li></ul></div>
            </div>
            <div className="bg-slate-50 dark:bg-slate-700/30 rounded-lg p-6 border">
                <h3 className="font-medium mb-4 text-slate-900 dark:text-white">Tax Declarations</h3>
                {taxDeclarations.length > 0 ? (
                    <table className="w-full"><thead className="bg-slate-100 dark:bg-slate-700"><tr><th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 dark:text-slate-300">Employee</th><th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 dark:text-slate-300">Regime</th><th className="px-4 py-3 text-right text-xs font-semibold text-slate-700 dark:text-slate-300">80C</th><th className="px-4 py-3 text-center text-xs font-semibold text-slate-700 dark:text-slate-300">Status</th></tr></thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-600">{taxDeclarations.map(d => <tr key={d.id} className="hover:bg-slate-100/50 dark:hover:bg-slate-700/50"><td className="px-4 py-3 text-sm text-slate-900 dark:text-white">{d.employeeName}</td><td className="px-4 py-3"><span className={`px-2 py-1 rounded-full text-xs font-medium ${d.taxRegime === 'NEW' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>{d.taxRegime || 'NEW'}</span></td><td className="px-4 py-3 text-sm text-right text-slate-700 dark:text-slate-300">{formatCurrency(d.total80C)}</td><td className="px-4 py-3 text-center"><span className={`px-2 py-1 rounded-full text-xs ${d.status === 'SUBMITTED' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{d.status || 'DRAFT'}</span></td></tr>)}</tbody></table>
                ) : <div className="text-center py-8 text-slate-500"><FileText className="w-10 h-10 mx-auto mb-3 opacity-50" /><p>No tax declarations for {financialYear}</p></div>}
            </div>
        </div>
    );
}

function EmployeesTab({ employees, searchTerm, setSearchTerm, loadEmployees }) {
    const filtered = employees.filter(e => e.employeeName?.toLowerCase().includes(searchTerm.toLowerCase()) || e.employeeCode?.toLowerCase().includes(searchTerm.toLowerCase()));
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Employee Statutory Info</h2>
                <Button onClick={loadEmployees} variant="outline"><RefreshCw className="w-4 h-4 mr-2" />Refresh</Button>
            </div>
            <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" /><input type="text" placeholder="Search employees..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500" /></div>
            <div className="bg-slate-50 dark:bg-slate-700/30 rounded-lg border overflow-hidden">
                {filtered.length > 0 ? (
                    <table className="w-full"><thead className="bg-slate-100 dark:bg-slate-700"><tr><th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 dark:text-slate-300">Employee</th><th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 dark:text-slate-300">UAN</th><th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 dark:text-slate-300">ESI</th><th className="px-4 py-3 text-center text-xs font-semibold text-slate-700 dark:text-slate-300">PF</th><th className="px-4 py-3 text-center text-xs font-semibold text-slate-700 dark:text-slate-300">ESI</th><th className="px-4 py-3 text-center text-xs font-semibold text-slate-700 dark:text-slate-300">PT</th><th className="px-4 py-3 text-center text-xs font-semibold text-slate-700 dark:text-slate-300">Regime</th></tr></thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-600">{filtered.map(e => <tr key={e.id} className="hover:bg-slate-100/50 dark:hover:bg-slate-700/50"><td className="px-4 py-3"><p className="text-sm font-medium text-slate-900 dark:text-white">{e.employeeName}</p><p className="text-xs text-slate-500 dark:text-slate-400">{e.employeeCode}</p></td><td className="px-4 py-3 text-sm text-slate-700 dark:text-slate-300">{e.uanNumber || '-'}</td><td className="px-4 py-3 text-sm text-slate-700 dark:text-slate-300">{e.esiNumber || '-'}</td><td className="px-4 py-3 text-center">{e.isPfApplicable ? <CheckCircle className="w-4 h-4 text-green-500 mx-auto" /> : <AlertCircle className="w-4 h-4 text-slate-300 mx-auto" />}</td><td className="px-4 py-3 text-center">{e.isEsiApplicable ? <CheckCircle className="w-4 h-4 text-green-500 mx-auto" /> : <AlertCircle className="w-4 h-4 text-slate-300 mx-auto" />}</td><td className="px-4 py-3 text-center">{e.isPtApplicable ? <CheckCircle className="w-4 h-4 text-green-500 mx-auto" /> : <AlertCircle className="w-4 h-4 text-slate-300 mx-auto" />}</td><td className="px-4 py-3 text-center"><span className={`px-2 py-1 rounded text-xs ${e.taxRegime === 'OLD' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>{e.taxRegime || 'NEW'}</span></td></tr>)}</tbody></table>
                ) : <div className="text-center py-8 text-slate-500"><Users className="w-10 h-10 mx-auto mb-3 opacity-50" /><p>No employees found</p></div>}
            </div>
        </div>
    );
}
