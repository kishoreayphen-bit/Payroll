import React, { useState, useEffect, useRef } from 'react';
import {
    X,
    PlusCircle,
    MinusCircle,
    Trash2,
    Edit2
} from 'lucide-react';
import { Button } from './ui/button';
import { AddLOPModal } from './PayRunManagementModals';
import { payRunManagementApi } from '../services/payRunManagementApi';
import { getVariableComponents } from '../api/salaryComponentApi';

export default function PayRunEmployeeDrawer({
    employee,
    payRun,
    organization,
    onClose,
    onUpdate
}) {
    const [showLOPModal, setShowLOPModal] = useState(false);
    const [employeeDetails, setEmployeeDetails] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);
    
    // Dropdown states for Zoho-style inline component addition
    const [earningComponents, setEarningComponents] = useState([]);
    const [deductionComponents, setDeductionComponents] = useState([]);
    const [showEarningDropdown, setShowEarningDropdown] = useState(false);
    const [showDeductionDropdown, setShowDeductionDropdown] = useState(false);
    const [selectedEarning, setSelectedEarning] = useState('');
    const [selectedDeduction, setSelectedDeduction] = useState('');
    const [earningAmount, setEarningAmount] = useState('');
    const [deductionAmount, setDeductionAmount] = useState('');
    const [earningNotes, setEarningNotes] = useState('');
    const [deductionNotes, setDeductionNotes] = useState('');
    const [loadingComponents, setLoadingComponents] = useState(false);
    
    // Refs for auto-opening dropdowns
    const earningSelectRef = useRef(null);
    const deductionSelectRef = useRef(null);

    useEffect(() => {
        if (employee) {
            fetchEmployeeDetail();
            fetchVariableComponents();
        }
    }, [employee]);

    // Also refresh variable components when the dropdowns are opened
    useEffect(() => {
        if (showEarningDropdown || showDeductionDropdown) {
            fetchVariableComponents();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [showEarningDropdown, showDeductionDropdown]);


    const fetchVariableComponents = async () => {
        try {
            setLoadingComponents(true);
            const [earningsRes, deductionsRes] = await Promise.all([
                getVariableComponents('EARNING'),
                getVariableComponents('DEDUCTION')
            ]);
            // getVariableComponents already returns the data array
            setEarningComponents(earningsRes || []);
            setDeductionComponents(deductionsRes || []);
            try {
                console.log('[Drawer] variable components fetched', {
                    earnings: Array.isArray(earningsRes) ? earningsRes.length : 'n/a',
                    deductions: Array.isArray(deductionsRes) ? deductionsRes.length : 'n/a'
                });
            } catch (e) {}
        } catch (error) {
            console.error('Failed to fetch variable components:', error);
            setEarningComponents([]);
            setDeductionComponents([]);
        } finally {
            setLoadingComponents(false);
        }
    };

    const fetchEmployeeDetail = async () => {
        try {
            const orgId = organization?.id || localStorage.getItem('selectedOrganizationId');
            if (!orgId || !employee?.employeeId) return;

            const response = await payRunManagementApi.getEmployeeDetail(
                payRun.id,
                employee.employeeId,
                orgId
            );
            setEmployeeDetails(response.data);
        } catch (error) {
            console.error('Failed to fetch employee detail:', error);
            // Fallback to prop data
            setEmployeeDetails({
                ...employee,
                oneTimeEarnings: employee.oneTimeEarnings || [],
                oneTimeDeductions: employee.oneTimeDeductions || []
            });
        }
    };

    const handleAction = async (actionData, type) => {
        try {
            setActionLoading(true);
            const tenantId = organization?.id || localStorage.getItem('selectedOrganizationId');
            const userId = JSON.parse(localStorage.getItem('user'))?.id || 1;
            const payRunId = payRun?.id;
            const employeeId = employee?.employeeId;

            console.log(`[Drawer] handleAction ${type}:`, {
                payRunId,
                employeeId,
                tenantId,
                userId,
                actionData
            });

            if (!payRunId || !employeeId || !tenantId) {
                console.error('[Drawer] Missing required IDs:', { payRunId, employeeId, tenantId });
                alert('Connection error: Missing required information. Please refresh the page.');
                return;
            }

            if (type === 'EARNING' || type === 'DEDUCTION') {
                await payRunManagementApi.addOneTimeComponent(
                    payRunId,
                    employeeId,
                    actionData,
                    tenantId,
                    userId
                );
            } else if (type === 'LOP') {
                await payRunManagementApi.addLOP(
                    payRunId,
                    employeeId,
                    actionData,
                    tenantId
                );
            }

            // Close modals
            setShowEarningModal(false);
            setShowDeductionModal(false);
            setShowLOPModal(false);

            // Refresh local state and parent
            await fetchEmployeeDetail();
            onUpdate();
        } catch (error) {
            console.error(`Failed to perform ${type}:`, error);
            const errorMessage = error.response?.data?.error || error.response?.data?.message || `Failed to add ${type.toLowerCase()}`;
            alert(errorMessage);
        } finally {
            setActionLoading(false);
        }
    };

    const handleDeleteComponent = async (componentId) => {
        if (!confirm('Delete this adjustment?')) return;
        try {
            setActionLoading(true);
            const orgId = organization?.id || localStorage.getItem('selectedOrganizationId');
            await payRunManagementApi.deleteComponent(componentId, orgId);
            onUpdate();
            onClose();
        } catch (error) {
            console.error('Failed to delete component:', error);
            alert(error.response?.data?.error || 'Failed to delete component');
        } finally {
            setActionLoading(false);
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 2
        }).format(amount || 0);
    };

    if (!employee || !employeeDetails) return null;

    // Use employeeDetails if available, otherwise fallback to props
    const data = employeeDetails || employee;

    // Calculate component values
    const earnings = [
        { name: 'Basic', amount: data.basicSalary || 0, isFixed: true },
        { name: 'House Rent Allowance', amount: data.hra || 0, isFixed: true },
        { name: 'Fixed Allowance', amount: data.fixedAllowance || 0, isFixed: true },
        // Add one-time earnings
        ...(data.oneTimeEarnings?.map(e => ({
            name: e.componentName,
            amount: e.amount,
            isFixed: false,
            id: e.id
        })) || [])
    ];

    const deductions = [
        // Taxes
        { name: 'Income Tax', amount: data.tds || 0, isFixed: true, category: 'Taxes' },
        { name: 'Professional Tax', amount: data.professionalTax || 0, isFixed: true, category: 'Taxes' },
        // Statutory deductions
        { name: 'PF Employee', amount: data.pfEmployee || 0, isFixed: true, category: 'Deductions' },
        { name: 'ESI Employee', amount: data.esiEmployee || 0, isFixed: true, category: 'Deductions' },
        // One-time deductions
        ...(data.oneTimeDeductions?.map(d => ({
            name: d.componentName,
            amount: d.amount,
            isFixed: false,
            id: d.id,
            category: 'Deductions'
        })) || [])
    ];

    const payableDays = (data.workingDays || 30) - (data.lopDays || 0);

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 z-40 animate-in fade-in duration-200"
                onClick={onClose}
            />

            {/* Drawer Panel */}
            <div className="fixed inset-y-0 right-0 max-w-xl w-full bg-white dark:bg-slate-800 shadow-2xl z-50 flex flex-col transform transition-transform animate-in slide-in-from-right duration-300">
                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
                    <div className="flex-1">
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                            {employee.employeeName}
                        </h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            Emp. ID: {employee.employeeNumber}
                        </p>
                    </div>
                    <div className="text-right mr-8">
                        <p className="text-xs text-slate-500 dark:text-slate-400">Net Pay</p>
                        <p className="text-2xl font-bold text-slate-900 dark:text-white">
                            {formatCurrency(data.netSalary)}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5 text-slate-500" />
                    </button>
                </div>

                {/* Content - Scrollable */}
                <div className="flex-1 overflow-y-auto px-6 py-4">
                    {/* Payable Days */}
                    <div className="flex items-center justify-between py-3 border-b border-slate-200 dark:border-slate-700">
                        <span className="text-sm text-slate-700 dark:text-slate-300">Payable Days</span>
                        <span className="text-sm font-semibold text-slate-900 dark:text-white">{payableDays}</span>
                    </div>

                    {/* Add LOP Button */}
                    <button
                        onClick={() => setShowLOPModal(true)}
                        className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 font-medium py-2 hover:text-blue-700"
                    >
                        <PlusCircle className="w-4 h-4" />
                        Add LOP
                    </button>

                    {/* Earnings Section */}
                    <div className="mt-6">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                                (+) EARNINGS
                            </h3>
                            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">AMOUNT</span>
                        </div>

                        {earnings.map((earning, index) => (
                            <div
                                key={`${earning.id}-${earning.name}-${index}`}
                                className="flex items-center justify-between py-2.5 border-b border-slate-100 dark:border-slate-700/50"
                            >
                                <span className="text-sm text-slate-700 dark:text-slate-300">{earning.name}</span>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-semibold text-slate-900 dark:text-white">
                                        {formatCurrency(earning.amount)}
                                    </span>
                                    {!earning.isFixed && (
                                        <button
                                            onClick={() => handleDeleteComponent(earning.id)}
                                            className="p-1 hover:bg-rose-100 dark:hover:bg-rose-900/30 rounded transition-colors"
                                        >
                                            <Trash2 className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}

                        {/* Add Earning Button & Dropdown (Zoho Style) */}
                        <div className="mt-3 space-y-3">
                            {!showEarningDropdown ? (
                                <button
                                    onClick={() => setShowEarningDropdown(true)}
                                    className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 font-medium py-2 hover:text-blue-700 transition-colors"
                                >
                                    <PlusCircle className="w-4 h-4" />
                                    Add Earning
                                </button>
                            ) : (
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">Select Component</span>
                                        <button
                                            onClick={() => {
                                                setShowEarningDropdown(false);
                                                setSelectedEarning('');
                                                setEarningAmount('');
                                                setEarningNotes('');
                                            }}
                                            className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-colors"
                                            title="Close"
                                        >
                                            <X className="w-4 h-4 text-slate-500" />
                                        </button>
                                    </div>
                                    {loadingComponents ? (
                                        <div className="p-3 text-sm text-slate-500 dark:text-slate-400 border border-slate-300 dark:border-slate-600 rounded-lg">
                                            Loading components...
                                        </div>
                                    ) : earningComponents.length === 0 ? (
                                        <div className="p-3 text-sm text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                                            No variable earnings found. Create one in Settings → Salary Components.
                                        </div>
                                    ) : (
                                        <div className="border border-slate-300 dark:border-slate-600 rounded-lg overflow-hidden max-h-48 overflow-y-auto">
                                            {earningComponents.map((comp) => (
                                                <button
                                                    key={comp.id}
                                                    onClick={() => setSelectedEarning(comp.id.toString())}
                                                    className="w-full px-3 py-2 text-left text-sm hover:bg-blue-50 dark:hover:bg-blue-900/20 border-b border-slate-200 dark:border-slate-700 last:border-b-0 transition-colors text-slate-700 dark:text-slate-300"
                                                >
                                                    {comp.name}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                            
                            {/* Inline form when earning selected */}
                            {selectedEarning && (
                                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg space-y-2 border border-blue-200 dark:border-blue-800">
                                    <div className="flex items-center gap-2">
                                        <div className="flex-1">
                                            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1 block">Amount *</label>
                                            <div className="relative">
                                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">₹</span>
                                                <input
                                                    type="number"
                                                    value={earningAmount}
                                                    onChange={(e) => setEarningAmount(e.target.value)}
                                                    placeholder="0.00"
                                                    className="w-full pl-7 pr-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1 block">Notes</label>
                                        <input
                                            type="text"
                                            value={earningNotes}
                                            onChange={(e) => setEarningNotes(e.target.value)}
                                            placeholder="Optional notes..."
                                            className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
                                        />
                                    </div>
                                    <div className="flex items-center gap-2 justify-end">
                                        <button
                                            onClick={() => {
                                                setShowEarningDropdown(false);
                                                setSelectedEarning('');
                                                setEarningAmount('');
                                                setEarningNotes('');
                                            }}
                                            className="px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={async () => {
                                                if (!earningAmount) {
                                                    alert('Please enter amount');
                                                    return;
                                                }
                                                const comp = earningComponents.find(c => c.id.toString() === selectedEarning);
                                                await handleAction({
                                                    componentType: 'EARNING',
                                                    componentName: comp?.name || '',
                                                    amount: parseFloat(earningAmount),
                                                    isTaxable: comp?.isTaxable || true,
                                                    notes: earningNotes
                                                }, 'EARNING');
                                                setShowEarningDropdown(false);
                                                setSelectedEarning('');
                                                setEarningAmount('');
                                                setEarningNotes('');
                                            }}
                                            disabled={!earningAmount || actionLoading}
                                            className="px-3 py-1.5 text-xs font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {actionLoading ? 'Adding...' : 'Add'}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Deductions Section */}
                    <div className="mt-6">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-sm font-bold text-rose-600 dark:text-rose-400">
                                (-) DEDUCTIONS
                            </h3>
                            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">AMOUNT</span>
                        </div>

                        {/* Taxes Subsection */}
                        <div className="mb-4">
                            <h4 className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">Taxes</h4>
                            {deductions.filter(d => d.category === 'Taxes').map((deduction, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-700/50"
                                >
                                    <span className="text-sm text-slate-700 dark:text-slate-300 pl-3">{deduction.name}</span>
                                    <span className="text-sm font-semibold text-slate-900 dark:text-white">
                                        {formatCurrency(deduction.amount)}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* Other Deductions Subsection */}
                        <div className="mb-4">
                            <h4 className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">Deductions</h4>
                            {deductions.filter(d => d.category === 'Deductions').map((deduction, index) => (
                                <div
                                    key={deduction.id || index}
                                    className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-700/50"
                                >
                                    <span className="text-sm text-slate-700 dark:text-slate-300 pl-3">{deduction.name}</span>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-semibold text-slate-900 dark:text-white">
                                            {formatCurrency(deduction.amount)}
                                        </span>
                                        {!deduction.isFixed && (
                                            <button
                                                onClick={() => handleDeleteComponent(deduction.id)}
                                                className="p-1 hover:bg-rose-100 dark:hover:bg-rose-900/30 rounded transition-colors"
                                            >
                                                <Edit2 className="w-3.5 h-3.5 text-slate-400" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Add Deduction Button & Dropdown (Zoho Style) */}
                        <div className="mt-3 space-y-3">
                            {!showDeductionDropdown ? (
                                <button
                                    onClick={() => setShowDeductionDropdown(true)}
                                    className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 font-medium py-2 hover:text-blue-700 transition-colors"
                                >
                                    <PlusCircle className="w-4 h-4" />
                                    Add Deduction
                                </button>
                            ) : (
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">Select Component</span>
                                        <button
                                            onClick={() => {
                                                setShowDeductionDropdown(false);
                                                setSelectedDeduction('');
                                                setDeductionAmount('');
                                                setDeductionNotes('');
                                            }}
                                            className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-colors"
                                            title="Close"
                                        >
                                            <X className="w-4 h-4 text-slate-500" />
                                        </button>
                                    </div>
                                    {loadingComponents ? (
                                        <div className="p-3 text-sm text-slate-500 dark:text-slate-400 border border-slate-300 dark:border-slate-600 rounded-lg">
                                            Loading components...
                                        </div>
                                    ) : deductionComponents.length === 0 ? (
                                        <div className="p-3 text-sm text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                                            No variable deductions found. Create one in Settings → Salary Components.
                                        </div>
                                    ) : (
                                        <div className="border border-slate-300 dark:border-slate-600 rounded-lg overflow-hidden max-h-48 overflow-y-auto">
                                            {deductionComponents.map((comp) => (
                                                <button
                                                    key={comp.id}
                                                    onClick={() => setSelectedDeduction(comp.id.toString())}
                                                    className="w-full px-3 py-2 text-left text-sm hover:bg-rose-50 dark:hover:bg-rose-900/20 border-b border-slate-200 dark:border-slate-700 last:border-b-0 transition-colors text-slate-700 dark:text-slate-300"
                                                >
                                                    {comp.name}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                            
                            {/* Inline form when deduction selected */}
                            {selectedDeduction && (
                                <div className="bg-rose-50 dark:bg-rose-900/20 p-3 rounded-lg space-y-2 border border-rose-200 dark:border-rose-800">
                                    <div className="flex items-center gap-2">
                                        <div className="flex-1">
                                            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1 block">Amount *</label>
                                            <div className="relative">
                                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">₹</span>
                                                <input
                                                    type="number"
                                                    value={deductionAmount}
                                                    onChange={(e) => setDeductionAmount(e.target.value)}
                                                    placeholder="0.00"
                                                    className="w-full pl-7 pr-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1 block">Notes</label>
                                        <input
                                            type="text"
                                            value={deductionNotes}
                                            onChange={(e) => setDeductionNotes(e.target.value)}
                                            placeholder="Optional notes..."
                                            className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
                                        />
                                    </div>
                                    <div className="flex items-center gap-2 justify-end">
                                        <button
                                            onClick={() => {
                                                setShowDeductionDropdown(false);
                                                setSelectedDeduction('');
                                                setDeductionAmount('');
                                                setDeductionNotes('');
                                            }}
                                            className="px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={async () => {
                                                if (!deductionAmount) {
                                                    alert('Please enter amount');
                                                    return;
                                                }
                                                const comp = deductionComponents.find(c => c.id.toString() === selectedDeduction);
                                                await handleAction({
                                                    componentType: 'DEDUCTION',
                                                    componentName: comp?.name || '',
                                                    amount: parseFloat(deductionAmount),
                                                    isTaxable: false,
                                                    notes: deductionNotes
                                                }, 'DEDUCTION');
                                                setShowDeductionDropdown(false);
                                                setSelectedDeduction('');
                                                setDeductionAmount('');
                                                setDeductionNotes('');
                                            }}
                                            disabled={!deductionAmount || actionLoading}
                                            className="px-3 py-1.5 text-xs font-medium bg-rose-600 hover:bg-rose-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {actionLoading ? 'Adding...' : 'Add'}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Net Pay */}
                    <div className="flex items-center justify-between py-4 mt-6 border-t-2 border-slate-300 dark:border-slate-600">
                        <span className="text-sm font-bold text-slate-900 dark:text-white uppercase">Net Pay</span>
                        <span className="text-lg font-bold text-slate-900 dark:text-white">
                            {formatCurrency(data.netSalary)}
                        </span>
                    </div>
                </div>

                {/* Footer - Save/Cancel Buttons */}
                <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Button
                                onClick={onClose}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6"
                            >
                                Save
                            </Button>
                            <Button
                                onClick={onClose}
                                variant="outline"
                                className="border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-semibold px-6"
                            >
                                Cancel
                            </Button>
                        </div>
                        <p className="text-xs text-orange-600 dark:text-orange-400 flex items-center gap-1">
                            <span className="text-orange-500">ⓘ</span>
                            Click Save to update Net Pay
                        </p>
                    </div>
                </div>
            </div>

            {/* Modals */}
            <AddLOPModal
                isOpen={showLOPModal}
                onClose={() => setShowLOPModal(false)}
                onConfirm={(data) => handleAction(data, 'LOP')}
                employeeName={employee.employeeName}
                maxDays={employee.workingDays || 30}
                loading={actionLoading}
            />
        </>
    );
}
