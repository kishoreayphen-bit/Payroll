import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from './ui/button';
import { api } from '../services/authService';

export default function ComponentModal({ component, onClose, onSave, organizationId, components }) {
    const [formData, setFormData] = useState({
        name: '',
        code: '',
        type: 'EARNING',
        calculationType: 'FIXED',
        baseComponentId: '',
        formula: '',
        isTaxable: true,
        isStatutory: false,
        displayOrder: 0,
        description: ''
    });
    const [errors, setErrors] = useState({});
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (component) {
            setFormData({
                name: component.name || '',
                code: component.code || '',
                type: component.type || 'EARNING',
                calculationType: component.calculationType || 'FIXED',
                baseComponentId: component.baseComponentId || '',
                formula: component.formula || '',
                isTaxable: component.isTaxable !== undefined ? component.isTaxable : true,
                isStatutory: component.isStatutory !== undefined ? component.isStatutory : false,
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
                code: formData.code.toUpperCase(),
                type: formData.type,
                calculationType: formData.calculationType,
                isTaxable: formData.isTaxable,
                isStatutory: formData.isStatutory,
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

            onSave();
        } catch (error) {
            console.error('Error saving component:', error);
            alert(error.response?.data?.message || 'Failed to save component');
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
                        {component ? 'Edit Component' : 'Add Component'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-white/20 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5 text-white" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
                    <div className="space-y-4">
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

                        {/* Type and Calculation Type */}
                        <div className="grid grid-cols-2 gap-4">
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

                        {/* Flags */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    name="isTaxable"
                                    checked={formData.isTaxable}
                                    onChange={handleChange}
                                    className="w-4 h-4 text-pink-600 border-slate-300 rounded focus:ring-pink-500"
                                />
                                <label className="ml-2 text-sm text-slate-700 dark:text-slate-200">
                                    Taxable
                                </label>
                            </div>

                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    name="isStatutory"
                                    checked={formData.isStatutory}
                                    onChange={handleChange}
                                    className="w-4 h-4 text-pink-600 border-slate-300 rounded focus:ring-pink-500"
                                />
                                <label className="ml-2 text-sm text-slate-700 dark:text-slate-200">
                                    Statutory (PF, ESI, PT, etc.)
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
