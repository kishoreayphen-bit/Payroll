import React, { useState, useEffect } from 'react';
import { X, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { getVariableComponents } from '../api/salaryComponentApi';

export function SkipEmployeeModal({ isOpen, onClose, onConfirm, employeeName, loading }) {
    const [skipType, setSkipType] = useState('SKIP');
    const [reason, setReason] = useState('');

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Skip from Payroll</h3>
                    <button onClick={onClose} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg">
                        <X className="w-5 h-5 text-slate-500" />
                    </button>
                </div>
                <div className="p-6 space-y-4">
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                        Skip <span className="font-semibold text-slate-900 dark:text-white">{employeeName}</span> from this payroll?
                    </p>

                    <div className="space-y-3">
                        <label className="flex items-start gap-3 p-3 rounded-lg border border-slate-200 dark:border-slate-700 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                            <input
                                type="radio"
                                name="skipType"
                                value="SKIP"
                                checked={skipType === 'SKIP'}
                                onChange={(e) => setSkipType(e.target.value)}
                                className="mt-1 accent-pink-500"
                            />
                            <div>
                                <p className="text-sm font-medium text-slate-900 dark:text-white">Skip entirely</p>
                                <p className="text-xs text-slate-500">Won't be paid in this pay run</p>
                            </div>
                        </label>

                        <label className="flex items-start gap-3 p-3 rounded-lg border border-slate-200 dark:border-slate-700 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                            <input
                                type="radio"
                                name="skipType"
                                value="PAY_AS_ARREARS"
                                checked={skipType === 'PAY_AS_ARREARS'}
                                onChange={(e) => setSkipType(e.target.value)}
                                className="mt-1 accent-pink-500"
                            />
                            <div>
                                <p className="text-sm font-medium text-slate-900 dark:text-white">Pay as arrears in next pay run</p>
                                <p className="text-xs text-slate-500">Amount will be deferred to next cycle</p>
                            </div>
                        </label>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-500 uppercase">Reason *</label>
                        <textarea
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder="Enter reason for skipping..."
                            className="w-full min-h-[100px] p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition-all dark:text-white"
                            required
                        />
                    </div>
                </div>
                <div className="flex items-center justify-end gap-3 p-4 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-700">
                    <Button variant="ghost" onClick={onClose} disabled={loading} className="text-slate-600 dark:text-slate-400">Cancel</Button>
                    <Button
                        onClick={() => onConfirm({ skipType, reason })}
                        disabled={loading || !reason.trim()}
                        className="bg-rose-500 hover:bg-rose-600 text-white"
                    >
                        {loading ? 'Processing...' : 'Skip Employee'}
                    </Button>
                </div>
            </div>
        </div>
    );
}

export function OneTimeComponentModal({ isOpen, onClose, onConfirm, employeeName, type, loading }) {
    const [selectedComponent, setSelectedComponent] = useState('');
    const [amount, setAmount] = useState('');
    const [isTaxable, setIsTaxable] = useState(true);
    const [notes, setNotes] = useState('');
    const [components, setComponents] = useState([]);
    const [loadingComponents, setLoadingComponents] = useState(false);

    useEffect(() => {
        if (isOpen) {
            fetchVariableComponents();
            // Reset form
            setSelectedComponent('');
            setAmount('');
            setIsTaxable(true);
            setNotes('');
        }
    }, [isOpen, type]);

    const fetchVariableComponents = async () => {
        try {
            setLoadingComponents(true);
            const response = await getVariableComponents(type);
            setComponents(response.data || []);
        } catch (error) {
            console.error('Failed to fetch variable components:', error);
            setComponents([]);
        } finally {
            setLoadingComponents(false);
        }
    };

    if (!isOpen) return null;

    const isEarning = type === 'EARNING';
    const selectedComponentData = components.find(c => c.id.toString() === selectedComponent);

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                        Add One-Time {isEarning ? 'Earning' : 'Deduction'}
                    </h3>
                    <button onClick={onClose} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg">
                        <X className="w-5 h-5 text-slate-500" />
                    </button>
                </div>
                <div className="p-6 space-y-4">
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                        Employee: <span className="font-semibold text-slate-900 dark:text-white">{employeeName}</span>
                    </p>

                    <div className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-500 uppercase">Component *</label>
                            {loadingComponents ? (
                                <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm text-slate-500">
                                    Loading components...
                                </div>
                            ) : components.length === 0 ? (
                                <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-amber-50 dark:bg-amber-900/20 text-sm text-amber-700 dark:text-amber-400">
                                    No variable {isEarning ? 'earnings' : 'deductions'} configured. Please create one in Settings first.
                                </div>
                            ) : (
                                <select
                                    value={selectedComponent}
                                    onChange={(e) => {
                                        setSelectedComponent(e.target.value);
                                        const comp = components.find(c => c.id.toString() === e.target.value);
                                        if (comp) setIsTaxable(comp.isTaxable);
                                    }}
                                    className="w-full p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm outline-none focus:ring-2 focus:ring-pink-500 dark:text-white"
                                    required
                                >
                                    <option value="">Select a component</option>
                                    {components.map((comp) => (
                                        <option key={comp.id} value={comp.id}>
                                            {comp.name} ({comp.code})
                                        </option>
                                    ))}
                                </select>
                            )}
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-500 uppercase">Amount *</label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">₹</span>
                                <Input
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    placeholder="0.00"
                                    className="pl-7 dark:bg-slate-900"
                                    required
                                />
                            </div>
                        </div>

                        {isEarning && (
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={isTaxable}
                                    onChange={(e) => setIsTaxable(e.target.checked)}
                                    className="w-4 h-4 accent-pink-500"
                                    disabled={selectedComponentData}
                                />
                                <span className="text-sm text-slate-700 dark:text-slate-300">
                                    Is Taxable {selectedComponentData && '(from component settings)'}
                                </span>
                            </label>
                        )}

                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-500 uppercase">Notes</label>
                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="Add optional notes..."
                                className="w-full min-h-[80px] p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm outline-none focus:ring-2 focus:ring-pink-500 dark:text-white"
                            />
                        </div>
                    </div>
                </div>
                <div className="flex items-center justify-end gap-3 p-4 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-700">
                    <Button variant="ghost" onClick={onClose} disabled={loading} className="text-slate-600 dark:text-slate-400">Cancel</Button>
                    <Button
                        onClick={() => {
                            const comp = components.find(c => c.id.toString() === selectedComponent);
                            onConfirm({
                                componentType: type,
                                componentName: comp?.name || '',
                                amount: parseFloat(amount),
                                isTaxable,
                                notes
                            });
                        }}
                        disabled={loading || !selectedComponent || !amount || loadingComponents || components.length === 0}
                        className="bg-pink-500 hover:bg-pink-600 text-white"
                    >
                        {loading ? 'Adding...' : 'Add Component'}
                    </Button>
                </div>
            </div>
        </div>
    );
}

export function AddLOPModal({ isOpen, onClose, onConfirm, employeeName, maxDays, loading }) {
    const [days, setDays] = useState('0');
    const [reason, setReason] = useState('');

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Add Loss of Pay (LOP)</h3>
                    <button onClick={onClose} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg">
                        <X className="w-5 h-5 text-slate-500" />
                    </button>
                </div>
                <div className="p-6 space-y-4">
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                        Employee: <span className="font-semibold text-slate-900 dark:text-white">{employeeName}</span>
                    </p>

                    <div className="bg-amber-50 dark:bg-amber-900/20 p-3 rounded-lg flex gap-3 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-900/30">
                        <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                        <div className="text-xs">
                            Maximum LOP days for this period: <span className="font-bold">{maxDays} days</span>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-500 uppercase">LOP Days *</label>
                            <Input
                                type="number"
                                step="0.5"
                                min="0"
                                max={maxDays}
                                value={days}
                                onChange={(e) => setDays(e.target.value)}
                                className="dark:bg-slate-900"
                                required
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-500 uppercase">Reason (Optional)</label>
                            <textarea
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                placeholder="Optional: Add reason for LOP..."
                                className="w-full min-h-[80px] p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm outline-none focus:ring-2 focus:ring-pink-500 dark:text-white"
                            />
                        </div>
                    </div>
                </div>
                <div className="flex items-center justify-end gap-3 p-4 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-700">
                    <Button variant="ghost" onClick={onClose} disabled={loading} className="text-slate-600 dark:text-slate-400">Cancel</Button>
                    <Button
                        onClick={() => onConfirm({ lopDays: parseFloat(days), reason: reason.trim() || null })}
                        disabled={loading || parseFloat(days) < 0 || parseFloat(days) > maxDays}
                        className="bg-amber-500 hover:bg-amber-600 text-white"
                    >
                        {loading ? 'Applying...' : 'Apply LOP'}
                    </Button>
                </div>
            </div>
        </div>
    );
}
