import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from './ui/button';
import { api } from '../services/authService';

export default function ComponentModal({ component, onClose, onSave, organizationId, components }) {
    const [formData, setFormData] = useState({
        name: '',
        nameInPayslip: '',
        code: '',
        type: 'EARNING',
        calculationType: 'FIXED',
        baseComponentId: '',
        formula: '',
        isTaxable: true,
        isStatutory: false,
        isRecurring: true,
        isVariable: false,
        isPfApplicable: false,
        isIncludeInCtc: true,
        isProRataApplicable: true,
        displayOrder: 0,
        description: ''
    });
    const [errors, setErrors] = useState({});
    const [saving, setSaving] = useState(false);
    const [serverError, setServerError] = useState('');

    useEffect(() => {
        if (component) {
            setFormData({
                name: component.name || '',
                nameInPayslip: component.nameInPayslip || '',
                code: component.code || '',
                type: component.type || 'EARNING',
                calculationType: component.calculationType || 'FIXED',
                baseComponentId: component.baseComponentId || '',
                formula: component.formula || '',
                isTaxable: component.isTaxable !== undefined ? component.isTaxable : true,
                isStatutory: component.isStatutory !== undefined ? component.isStatutory : false,
                isRecurring: component.isRecurring !== undefined ? component.isRecurring : true,
                isVariable: component.isVariable !== undefined ? component.isVariable : false,
                isPfApplicable: component.isPfApplicable !== undefined ? component.isPfApplicable : false,
                isIncludeInCtc: component.isIncludeInCtc !== undefined ? component.isIncludeInCtc : true,
                isProRataApplicable: component.isProRataApplicable !== undefined ? component.isProRataApplicable : true,
                displayOrder: component.displayOrder || 0,
                description: component.description || ''
            });
        }
    }, [component]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        // Clear error for this field
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validate = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Component name is required';
        }

        if (!formData.code.trim()) {
            newErrors.code = 'Component code is required';
        } else if (!/^[A-Z_]+$/.test(formData.code)) {
            newErrors.code = 'Code must be uppercase letters and underscores only';
        } else if (
            Array.isArray(components) &&
            components.some(c =>
                c && c.code && c.code.toUpperCase() === formData.code.toUpperCase() && (!component || c.id !== component.id)
            )
        ) {
            newErrors.code = 'Component code already exists';
        }

        if (formData.calculationType === 'PERCENTAGE' && !formData.baseComponentId) {
            newErrors.baseComponentId = 'Base component is required for percentage calculation';
        }

        if (formData.calculationType === 'FORMULA' && !formData.formula.trim()) {
            newErrors.formula = 'Formula is required for formula-based calculation';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!organizationId) {
            alert('Organization context is missing. Please select an organization or refresh the page.');
            return;
        }

        if (!validate()) {
            return;
        }

        setSaving(true);
        try {
            // Ensure organizationId is a number
            const orgId = typeof organizationId === 'string' ? parseInt(organizationId, 10) : organizationId;

            const payload = {
                name: formData.name,
                nameInPayslip: formData.nameInPayslip,
                code: formData.code.toUpperCase(),
                type: formData.type,
                calculationType: formData.calculationType,
                isTaxable: formData.isTaxable,
                isStatutory: formData.isStatutory,
                isRecurring: formData.isRecurring,
                isVariable: formData.isVariable,
                isPfApplicable: formData.isPfApplicable,
                isIncludeInCtc: formData.isIncludeInCtc,
                isProRataApplicable: formData.isProRataApplicable,
                isActive: true,
                displayOrder: parseInt(formData.displayOrder) || 0,
                description: formData.description || null,
                organizationId: orgId,
                baseComponentId: formData.baseComponentId ? parseInt(formData.baseComponentId, 10) : null,
                formula: formData.formula || null
            };

            if (component) {
                // Update existing component
                await api.put(`/salary-components/${component.id}`, payload);
            } else {
                // Create new component
                await api.post('/salary-components', payload);
            }

            setServerError('');
            onSave();
        } catch (error) {
            console.error('Error saving component:', error);
            const msg = error.response?.data?.message || 'Failed to save component';
            setServerError(msg);
            // Map common server messages to field-level errors where possible
            if (/already exists/i.test(msg)) {
                setErrors(prev => ({ ...prev, code: msg }));
                // Double-check on server if the component now exists; if yes, treat as success
                try {
                    const orgId = typeof organizationId === 'string' ? parseInt(organizationId, 10) : organizationId;
                    const list = await api.get(`/salary-components?organizationId=${orgId}`);
                    const exists = (list.data || []).some(c => c.code?.toUpperCase() === formData.code.toUpperCase());
                    if (exists) {
                        setServerError('Component already exists. Refreshed the list.');
                        onSave();
                        return;
                    }
                } catch (e) {
                    // ignore fetch failure; keep error banner visible
                }
            }
        } finally {
            setSaving(false);
        }
    };

    // Filter components for base component dropdown
    const availableBaseComponents = components.filter(c =>
        c.type === 'EARNING' && c.id !== component?.id
    );

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-pink-600 to-rose-600 px-6 py-4 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-white">
                        {component ? 'Edit Component (Zoho)' : 'Add Component (Zoho)'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-white/20 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5 text-white" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-80px)] space-y-4">
                    <div className="space-y-4">
                        {serverError && (
                            <div className="rounded-lg border border-rose-300 bg-rose-50 text-rose-700 px-3 py-2 text-sm">
                                {serverError}
                            </div>
                        )}
                        <div className="text-xs uppercase tracking-wide text-slate-500">Basic Information</div>
                        {/* Component Name */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
                                Component Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 bg-white dark:bg-slate-700 dark:text-white ${errors.name ? 'border-red-500' : 'border-slate-300 dark:border-slate-600'
                                    }`}
                                placeholder="e.g., Basic Salary, House Rent Allowance"
                            />
                            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                        </div>

                        {/* Name in Payslip */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
                                Name in Payslip
                            </label>
                            <input
                                type="text"
                                name="nameInPayslip"
                                value={formData.nameInPayslip}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 bg-white dark:bg-slate-700 dark:text-white"
                                placeholder="e.g., Basic, HRA (if different from name)"
                            />
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">This name will appear on employee payslips</p>
                        </div>

                        {/* Component Code */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
                                Component Code <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="code"
                                value={formData.code}
                                onChange={handleChange}
                                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 font-mono bg-white dark:bg-slate-700 dark:text-white ${errors.code ? 'border-red-500' : 'border-slate-300 dark:border-slate-600'
                                    }`}
                                placeholder="e.g., BASIC, HRA, PF"
                                style={{ textTransform: 'uppercase' }}
                            />
                            {errors.code && <p className="text-red-500 text-xs mt-1">{errors.code}</p>}
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Use uppercase letters and underscores only</p>
                        </div>

                        <div className="text-xs uppercase tracking-wide text-slate-500 pt-1">Computation</div>
                        {/* Type and Calculation Type */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
                                    Type <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="type"
                                    value={formData.type}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 bg-white dark:bg-slate-700 dark:text-white"
                                >
                                    <option value="EARNING">Earning</option>
                                    <option value="DEDUCTION">Deduction</option>
                                </select>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Choose whether this is an earning or deduction</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
                                    Calculation Type <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="calculationType"
                                    value={formData.calculationType}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 bg-white dark:bg-slate-700 dark:text-white"
                                >
                                    <option value="FIXED">Fixed Amount</option>
                                    <option value="PERCENTAGE">Percentage</option>
                                    <option value="FORMULA">Formula</option>
                                </select>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Percentage requires selecting a base component</p>
                            </div>
                        </div>

                        {/* Base Component (for PERCENTAGE type) */}
                        {formData.calculationType === 'PERCENTAGE' && (
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Base Component <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="baseComponentId"
                                    value={formData.baseComponentId}
                                    onChange={handleChange}
                                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 ${errors.baseComponentId ? 'border-red-500' : 'border-slate-300'
                                        }`}
                                >
                                    <option value="">Select base component</option>
                                    {availableBaseComponents.map(c => (
                                        <option key={c.id} value={c.id}>{c.name} ({c.code})</option>
                                    ))}
                                </select>
                                {errors.baseComponentId && <p className="text-red-500 text-xs mt-1">{errors.baseComponentId}</p>}
                                <p className="text-xs text-slate-500 mt-1">Component to calculate percentage from</p>
                            </div>
                        )}

                        {/* Formula (for FORMULA type) */}
                        {formData.calculationType === 'FORMULA' && (
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Formula <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    name="formula"
                                    value={formData.formula}
                                    onChange={handleChange}
                                    rows={3}
                                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 font-mono text-sm ${errors.formula ? 'border-red-500' : 'border-slate-300'
                                        }`}
                                    placeholder="e.g., (BASIC + HRA) * 0.12"
                                />
                                {errors.formula && <p className="text-red-500 text-xs mt-1">{errors.formula}</p>}
                                <p className="text-xs text-slate-500 mt-1">Formula for complex calculations</p>
                            </div>
                        )}

                        <div className="text-xs uppercase tracking-wide text-slate-500 pt-1">Configuration</div>
                        {/* Flags */}
                        {/* Configuration Flags */}
                        <div className="space-y-3 pt-2">
                            <label className="text-xs font-semibold text-slate-500 uppercase block mb-2">Configuration</label>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                                <label className="flex items-start gap-2 p-3 rounded-lg border border-slate-200 dark:border-slate-700 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                                    <input
                                        type="checkbox"
                                        name="isRecurring"
                                        checked={formData.isRecurring}
                                        onChange={handleChange}
                                        className="mt-0.5 accent-pink-500"
                                    />
                                    <div>
                                        <div className="text-sm font-medium text-slate-900 dark:text-white">Recurring</div>
                                        <div className="text-xs text-slate-500">Part of monthly salary structure</div>
                                    </div>
                                </label>

                                <label className="flex items-start gap-2 p-3 rounded-lg border border-slate-200 dark:border-slate-700 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                                    <input
                                        type="checkbox"
                                        name="isVariable"
                                        checked={formData.isVariable}
                                        onChange={handleChange}
                                        className="mt-0.5 accent-pink-500"
                                    />
                                    <div>
                                        <div className="text-sm font-medium text-slate-900 dark:text-white">Variable / One-time</div>
                                        <div className="text-xs text-slate-500">Available in pay run dropdowns</div>
                                    </div>
                                </label>
                            </div>

                            <div className="flex flex-wrap gap-4 pt-2">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="isIncludeInCtc"
                                        checked={formData.isIncludeInCtc}
                                        onChange={handleChange}
                                        className="w-4 h-4 text-pink-600 border-slate-300 rounded focus:ring-pink-500"
                                    />
                                    <span className="text-sm text-slate-700 dark:text-slate-200">
                                        Include in CTC
                                    </span>
                                </label>

                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="isProRataApplicable"
                                        checked={formData.isProRataApplicable}
                                        onChange={handleChange}
                                        className="w-4 h-4 text-pink-600 border-slate-300 rounded focus:ring-pink-500"
                                    />
                                    <span className="text-sm text-slate-700 dark:text-slate-200">
                                        Calculate on pro-rata basis
                                    </span>
                                </label>

                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="isTaxable"
                                        checked={formData.isTaxable}
                                        onChange={handleChange}
                                        className="w-4 h-4 text-pink-600 border-slate-300 rounded focus:ring-pink-500"
                                    />
                                    <span className="text-sm text-slate-700 dark:text-slate-200">
                                        Taxable
                                    </span>
                                </label>

                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="isPfApplicable"
                                        checked={formData.isPfApplicable}
                                        onChange={handleChange}
                                        className="w-4 h-4 text-pink-600 border-slate-300 rounded focus:ring-pink-500"
                                    />
                                    <span className="text-sm text-slate-700 dark:text-slate-200">
                                        PF Applicable
                                    </span>
                                </label>

                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="isStatutory"
                                        checked={formData.isStatutory}
                                        onChange={handleChange}
                                        className="w-4 h-4 text-pink-600 border-slate-300 rounded focus:ring-pink-500"
                                    />
                                    <span className="text-sm text-slate-700 dark:text-slate-200">
                                        Statutory
                                    </span>
                                </label>
                            </div>
                        </div>

                        {/* Display Order */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
                                Display Order
                            </label>
                            <input
                                type="number"
                                name="displayOrder"
                                value={formData.displayOrder}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 bg-white dark:bg-slate-700 dark:text-white"
                                min="0"
                            />
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Order in which component appears in lists</p>
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
                                Description
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows={3}
                                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 bg-white dark:bg-slate-700 dark:text-white"
                                placeholder="Brief description of this component"
                            />
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
                        <Button
                            type="button"
                            onClick={onClose}
                            variant="outline"
                            className="flex-1"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={saving}
                            className="flex-1 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white"
                        >
                            {saving ? 'Saving...' : (component ? 'Update Component' : 'Create Component')}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
