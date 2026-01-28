import React, { useState, useEffect } from 'react';
import {
    MoreVertical,
    ChevronDown,
    ChevronUp,
    UserMinus,
    UserPlus,
    PlusCircle,
    MinusCircle,
    Calendar,
    Trash2,
    Info,
    AlertTriangle,
    Clock
} from 'lucide-react';
import { Button } from './ui/button';
import { payRunManagementApi } from '../services/payRunManagementApi';
import { SkipEmployeeModal, OneTimeComponentModal, AddLOPModal } from './PayRunManagementModals';

export default function PayRunEmployeeList({
    payRun,
    organization,
    onUpdate,
    selectable = false,
    selectedEmployees = [],
    onSelectionChange,
    onEmployeeClick
}) {
    const [employees, setEmployees] = useState(payRun.employees || []);
    const [expandedRows, setExpandedRows] = useState(new Set());
    const [employeeDetails, setEmployeeDetails] = useState({});
    const [loadingDetails, setLoadingDetails] = useState(new Set());

    // Modal states
    const [modalConfig, setModalConfig] = useState({
        type: null, // 'SKIP', 'EARNING', 'DEDUCTION', 'LOP'
        employee: null,
        isOpen: false
    });
    const [actionLoading, setActionLoading] = useState(false);

    // Dropdown menu state for each employee
    const [openMenuId, setOpenMenuId] = useState(null);
    const menuRef = React.useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setOpenMenuId(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        setEmployees(payRun.employees || []);
    }, [payRun]);

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            onSelectionChange(employees.map(emp => emp.employeeId));
        } else {
            onSelectionChange([]);
        }
    };

    const handleSelectOne = (employeeId) => {
        const newSelected = [...selectedEmployees];
        const index = newSelected.indexOf(employeeId);
        if (index > -1) {
            newSelected.splice(index, 1);
        } else {
            newSelected.push(employeeId);
        }
        onSelectionChange(newSelected);
    };

    const toggleRow = async (employeeId) => {
        const newExpanded = new Set(expandedRows);
        if (newExpanded.has(employeeId)) {
            newExpanded.delete(employeeId);
        } else {
            newExpanded.add(employeeId);
            if (!employeeDetails[employeeId]) {
                fetchEmployeeDetail(employeeId);
            }
        }
        setExpandedRows(newExpanded);
    };

    const fetchEmployeeDetail = async (employeeId) => {
        try {
            setLoadingDetails(prev => new Set(prev).add(employeeId));
            const response = await payRunManagementApi.getEmployeeDetail(payRun.id, employeeId, organization.id);
            setEmployeeDetails(prev => ({ ...prev, [employeeId]: response.data }));
        } catch (error) {
            console.error('Failed to fetch employee detail:', error);
        } finally {
            setLoadingDetails(prev => {
                const next = new Set(prev);
                next.delete(employeeId);
                return next;
            });
        }
    };

    const handleAction = async (actionData) => {
        const { employee, type } = modalConfig;
        try {
            setActionLoading(true);
            const tenantId = organization.id;
            const userId = JSON.parse(localStorage.getItem('user'))?.id || 1;

            if (type === 'SKIP') {
                await payRunManagementApi.skipEmployee(payRun.id, employee.id, actionData, tenantId, userId);
            } else if (type === 'EARNING' || type === 'DEDUCTION') {
                await payRunManagementApi.addOneTimeComponent(payRun.id, employee.id, actionData, tenantId, userId);
            } else if (type === 'LOP') {
                await payRunManagementApi.addLOP(payRun.id, employee.id, actionData, tenantId);
            }

            setModalConfig({ ...modalConfig, isOpen: false });
            onUpdate(); // Refresh parent data
            if (expandedRows.has(employee.id)) {
                fetchEmployeeDetail(employee.id);
            }
        } catch (error) {
            console.error(`Failed to perform ${type}:`, error);
            alert(error.response?.data?.error || `Failed to ${type.toLowerCase()}`);
        } finally {
            setActionLoading(false);
        }
    };

    const handleUnskip = async (employeeId) => {
        if (!confirm('Re-add this employee to payroll?')) return;
        try {
            setActionLoading(true);
            await payRunManagementApi.unskipEmployee(payRun.id, employeeId, organization.id);
            onUpdate();
            if (expandedRows.has(employeeId)) fetchEmployeeDetail(employeeId);
        } catch (error) {
            console.error('Failed to unskip:', error);
            alert(error.response?.data?.error || 'Failed to unskip employee');
        } finally {
            setActionLoading(false);
        }
    };

    const handleWithholdSalary = async (employeeId) => {
        if (!confirm('Withhold salary for this employee? It will be skipped from the bank advice and payment recording.')) return;
        try {
            setActionLoading(true);
            await payRunManagementApi.withholdSalary(payRun.id, employeeId, organization.id);
            onUpdate();
            alert('Salary withheld successfully');
        } catch (error) {
            console.error('Failed to withhold salary:', error);
            alert(error.response?.data?.error || 'Failed to withhold salary');
        } finally {
            setActionLoading(false);
        }
    };

    const handleReleaseSalary = async (employeeId) => {
        if (!confirm('Release withheld salary for this employee?')) return;
        try {
            setActionLoading(true);
            await payRunManagementApi.releaseSalary(payRun.id, employeeId, organization.id);
            onUpdate();
            alert('Salary released successfully');
        } catch (error) {
            console.error('Failed to release salary:', error);
            alert(error.response?.data?.error || 'Failed to release salary');
        } finally {
            setActionLoading(false);
        }
    };

    const handleDeleteComponent = async (componentId, employeeId) => {
        if (!confirm('Delete this adjustment?')) return;
        try {
            setActionLoading(true);
            await payRunManagementApi.deleteComponent(componentId, organization.id);
            onUpdate();
            fetchEmployeeDetail(employeeId);
        } catch (error) {
            console.error('Failed to delete component:', error);
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

    return (
        <div className="space-y-4">
            <div className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-slate-50 dark:bg-slate-800/50">
                        <tr>
                            <th className="w-10 px-4 py-3">
                                {selectable && (
                                    <input
                                        type="checkbox"
                                        className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                                        checked={selectedEmployees.length === employees.length && employees.length > 0}
                                        onChange={handleSelectAll}
                                    />
                                )}
                            </th>
                            <th className="text-left px-4 py-3 font-semibold text-slate-400 text-[10px] uppercase tracking-wider">Employee Name</th>
                            <th className="text-center px-4 py-3 font-semibold text-slate-400 text-[10px] uppercase tracking-wider">Paid Days</th>
                            <th className="text-right px-4 py-3 font-semibold text-slate-400 text-[10px] uppercase tracking-wider">Gross Pay</th>
                            <th className="text-right px-4 py-3 font-semibold text-slate-400 text-[10px] uppercase tracking-wider">Deductions</th>
                            <th className="text-right px-4 py-3 font-semibold text-slate-400 text-[10px] uppercase tracking-wider">Taxes</th>
                            <th className="text-right px-4 py-3 font-semibold text-slate-400 text-[10px] uppercase tracking-wider">Benefits</th>
                            <th className="text-right px-4 py-3 font-semibold text-slate-400 text-[10px] uppercase tracking-wider">Reimbursements</th>
                            <th className="text-right px-4 py-3 font-semibold text-slate-400 text-[10px] uppercase tracking-wider">Net Pay</th>
                            <th className="w-10 px-4 py-3"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                        {employees.map((pre) => {
                            const isExpanded = expandedRows.has(pre.employeeId);
                            const details = employeeDetails[pre.employeeId];
                            const isSkipped = pre.isSkipped || pre.status === 'EXCLUDED';
                            const isSelected = selectedEmployees.includes(pre.employeeId);

                            // Calculate Zoho-style columns
                            const paidDays = (pre.workingDays || 30) - (pre.lopDays || 0);
                            const taxes = (pre.tds || 0) + (pre.professionalTax || 0);
                            const deductions = (pre.pfEmployee || 0) + (pre.esiEmployee || 0) + (pre.otherDeductions || 0) + (pre.lopDeduction || 0);
                            const benefits = 0; // Placeholder for FBP
                            const reimbursements = 0; // Placeholder

                            return (
                                <React.Fragment key={pre.id}>
                                    <tr className={`hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors ${isSelected ? 'bg-indigo-50/30 dark:bg-indigo-900/10' : ''} ${isSkipped ? 'bg-slate-50/50 opacity-75' : ''}`}>
                                        <td className="px-4 py-3 text-center">
                                            {selectable ? (
                                                <input
                                                    type="checkbox"
                                                    className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                                                    checked={isSelected}
                                                    onChange={() => handleSelectOne(pre.employeeId)}
                                                />
                                            ) : (
                                                <button
                                                    onClick={() => toggleRow(pre.employeeId)}
                                                    className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition-transform"
                                                >
                                                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                                </button>
                                            )}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-[10px] font-bold text-slate-500">
                                                    {pre.employeeName.split(' ').map(n => n[0]).join('')}
                                                </div>
                                                <div
                                                    onClick={() => onEmployeeClick && onEmployeeClick(pre)}
                                                    className={onEmployeeClick ? "cursor-pointer hover:text-indigo-600" : ""}
                                                >
                                                    <p className="font-semibold text-slate-900 dark:text-white text-xs">
                                                        {pre.employeeName}
                                                        {isSkipped && <span className="ml-2 text-[8px] bg-slate-200 dark:bg-slate-600 text-slate-600 dark:text-slate-300 px-1 py-0.5 rounded uppercase font-bold tracking-tighter">Skipped</span>}
                                                    </p>
                                                    <p className="text-[10px] text-slate-500">({pre.employeeNumber})</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-center text-xs font-medium text-slate-600">
                                            {paidDays}
                                        </td>
                                        <td className="px-4 py-3 text-right text-xs font-medium text-slate-900 dark:text-white">
                                            {formatCurrency(pre.grossSalary)}
                                        </td>
                                        <td className="px-4 py-3 text-right text-xs font-medium text-slate-600">
                                            {formatCurrency(deductions)}
                                        </td>
                                        <td className="px-4 py-3 text-right text-xs font-medium text-slate-600">
                                            {formatCurrency(taxes)}
                                        </td>
                                        <td className="px-4 py-3 text-right text-xs font-medium text-slate-600">
                                            {formatCurrency(benefits)}
                                        </td>
                                        <td className="px-4 py-3 text-right text-xs font-medium text-slate-600">
                                            {formatCurrency(reimbursements)}
                                        </td>
                                        <td className="px-4 py-3 text-right font-bold text-slate-900 dark:text-white text-xs">
                                            {formatCurrency(pre.netSalary)}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="relative" ref={openMenuId === pre.employeeId ? menuRef : null}>
                                                <button 
                                                    onClick={() => setOpenMenuId(openMenuId === pre.employeeId ? null : pre.employeeId)}
                                                    className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded"
                                                >
                                                    <MoreVertical className="w-4 h-4 text-slate-400 hover:text-slate-600" />
                                                </button>
                                                {openMenuId === pre.employeeId && (
                                                    <div className="absolute right-0 top-full mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl rounded-lg z-50 py-1 min-w-[180px]">
                                                        {isSkipped ? (
                                                            <button
                                                                onClick={() => { handleUnskip(pre.employeeId); setOpenMenuId(null); }}
                                                                className="w-full text-left px-4 py-2 text-xs text-emerald-600 hover:bg-emerald-50 flex items-center gap-2"
                                                            >
                                                                <UserPlus className="w-3.5 h-3.5" /> Re-add to Payroll
                                                            </button>
                                                        ) : (
                                                            <>
                                                                <button
                                                                    onClick={() => { setModalConfig({ type: 'SKIP', employee: pre, isOpen: true }); setOpenMenuId(null); }}
                                                                    className="w-full text-left px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                                                                >
                                                                    <UserMinus className="w-3.5 h-3.5" /> Skip from Payroll
                                                                </button>
                                                                <button
                                                                    onClick={() => { handleWithholdSalary(pre.employeeId); setOpenMenuId(null); }}
                                                                    className="w-full text-left px-4 py-2 text-xs text-amber-600 hover:bg-amber-50 flex items-center gap-2"
                                                                >
                                                                    <Clock className="w-3.5 h-3.5" /> Withhold Salary
                                                                </button>
                                                                <div className="border-t border-slate-100 dark:border-slate-700 my-1"></div>
                                                                <button
                                                                    onClick={() => { setModalConfig({ type: 'EARNING', employee: pre, isOpen: true }); setOpenMenuId(null); }}
                                                                    className="w-full text-left px-4 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2"
                                                                >
                                                                    <PlusCircle className="w-3.5 h-3.5" /> Add Earning
                                                                </button>
                                                                <button
                                                                    onClick={() => { setModalConfig({ type: 'DEDUCTION', employee: pre, isOpen: true }); setOpenMenuId(null); }}
                                                                    className="w-full text-left px-4 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2"
                                                                >
                                                                    <MinusCircle className="w-3.5 h-3.5" /> Add Deduction
                                                                </button>
                                                                <button
                                                                    onClick={() => { setModalConfig({ type: 'LOP', employee: pre, isOpen: true }); setOpenMenuId(null); }}
                                                                    className="w-full text-left px-4 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2"
                                                                >
                                                                    <Calendar className="w-3.5 h-3.5" /> Add LOP
                                                                </button>
                                                            </>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                    {isExpanded && (
                                        <tr className="bg-slate-50/50 dark:bg-slate-900/30">
                                            <td colSpan="7" className="px-10 py-4">
                                                {loadingDetails.has(pre.employeeId) ? (
                                                    <div className="flex items-center gap-2 text-slate-400 py-4 italic">
                                                        <PlusCircle className="w-4 h-4 animate-spin" /> Loading details...
                                                    </div>
                                                ) : details ? (
                                                    <div className="grid grid-cols-2 gap-8 animate-in slide-in-from-top-2 duration-300">
                                                        {/* Earnings Column */}
                                                        <div>
                                                            <div className="flex items-center justify-between mb-2">
                                                                <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Earnings</h4>
                                                                <button
                                                                    onClick={() => setModalConfig({ type: 'EARNING', employee: pre, isOpen: true })}
                                                                    className="text-pink-500 hover:text-pink-600 p-1"
                                                                >
                                                                    <PlusCircle className="w-3.5 h-3.5" />
                                                                </button>
                                                            </div>
                                                            <div className="space-y-1">
                                                                <div className="flex justify-between text-xs py-1 text-slate-600 dark:text-slate-400">
                                                                    <span>Basic Salary</span>
                                                                    <span>{formatCurrency(details.basicSalary)}</span>
                                                                </div>
                                                                <div className="flex justify-between text-xs py-1 text-slate-600 dark:text-slate-400">
                                                                    <span>HRA</span>
                                                                    <span>{formatCurrency(details.hra)}</span>
                                                                </div>
                                                                {details.oneTimeEarnings?.map(ote => (
                                                                    <div key={ote.id} className="group flex justify-between text-xs py-1 text-pink-600 dark:text-pink-400 bg-pink-50 dark:bg-pink-900/20 px-2 rounded">
                                                                        <span className="flex items-center gap-1">
                                                                            {ote.componentName}
                                                                            <Info className="w-3 h-3 cursor-help text-pink-300" title={ote.notes} />
                                                                        </span>
                                                                        <span className="flex items-center gap-2">
                                                                            {formatCurrency(ote.amount)}
                                                                            <button onClick={() => handleDeleteComponent(ote.id, pre.employeeId)} className="opacity-0 group-hover:opacity-100 text-pink-300 hover:text-pink-600 transition-opacity">
                                                                                <Trash2 className="w-3 h-3" />
                                                                            </button>
                                                                        </span>
                                                                    </div>
                                                                ))}
                                                                <div className="h-px bg-slate-200 dark:bg-slate-800 my-2"></div>
                                                                <div className="flex justify-between text-sm font-bold text-slate-900 dark:text-white">
                                                                    <span>Total Earnings</span>
                                                                    <span>{formatCurrency(details.grossSalary)}</span>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Deductions Column */}
                                                        <div>
                                                            <div className="flex items-center justify-between mb-2">
                                                                <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Deductions</h4>
                                                                <button
                                                                    onClick={() => setModalConfig({ type: 'DEDUCTION', employee: pre, isOpen: true })}
                                                                    className="text-pink-500 hover:text-pink-600 p-1"
                                                                >
                                                                    <PlusCircle className="w-3.5 h-3.5" />
                                                                </button>
                                                            </div>
                                                            <div className="space-y-1">
                                                                {details.lopDays > 0 && (
                                                                    <div className="flex justify-between text-xs py-1 text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-2 rounded">
                                                                        <span>LOP ({details.lopDays} days)</span>
                                                                        <span>{formatCurrency(details.lopDeduction)}</span>
                                                                    </div>
                                                                )}
                                                                <div className="flex justify-between text-xs py-1 text-slate-600 dark:text-slate-400">
                                                                    <span>Income Tax (TDS)</span>
                                                                    <span>{formatCurrency(details.tds)}</span>
                                                                </div>
                                                                {details.oneTimeDeductions?.map(otd => (
                                                                    <div key={otd.id} className="group flex justify-between text-xs py-1 text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-900/20 px-2 rounded">
                                                                        <span className="flex items-center gap-1">
                                                                            {otd.componentName}
                                                                            <Info className="w-3 h-3 cursor-help text-rose-300" title={otd.notes} />
                                                                        </span>
                                                                        <span className="flex items-center gap-2">
                                                                            {formatCurrency(otd.amount)}
                                                                            <button onClick={() => handleDeleteComponent(otd.id, pre.employeeId)} className="opacity-0 group-hover:opacity-100 text-rose-300 hover:text-rose-600 transition-opacity">
                                                                                <Trash2 className="w-3 h-3" />
                                                                            </button>
                                                                        </span>
                                                                    </div>
                                                                ))}
                                                                <div className="h-px bg-slate-200 dark:bg-slate-800 my-2"></div>
                                                                <div className="flex justify-between text-sm font-bold text-slate-900 dark:text-white">
                                                                    <span>Total Deductions</span>
                                                                    <span>{formatCurrency(details.totalDeductions)}</span>
                                                                </div>
                                                            </div>

                                                            {isSkipped && (
                                                                <div className="mt-4 p-3 bg-slate-100 dark:bg-slate-800 rounded-lg flex gap-3 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                                                                    <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
                                                                    <div className="text-xs italic">
                                                                        Skipped: {details.skipReason}
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="text-center py-4 text-slate-400 italic">Failed to load details</div>
                                                )}
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Modals */}
            <SkipEmployeeModal
                isOpen={modalConfig.isOpen && modalConfig.type === 'SKIP'}
                onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
                onConfirm={handleAction}
                employeeName={modalConfig.employee?.employeeName}
                loading={actionLoading}
            />
            <OneTimeComponentModal
                isOpen={modalConfig.isOpen && (modalConfig.type === 'EARNING' || modalConfig.type === 'DEDUCTION')}
                type={modalConfig.type}
                onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
                onConfirm={handleAction}
                employeeName={modalConfig.employee?.employeeName}
                loading={actionLoading}
            />
            <AddLOPModal
                isOpen={modalConfig.isOpen && modalConfig.type === 'LOP'}
                onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
                onConfirm={handleAction}
                employeeName={modalConfig.employee?.employeeName}
                maxDays={30} // Could be dynamic based on period
                loading={actionLoading}
            />
        </div>
    );
}
