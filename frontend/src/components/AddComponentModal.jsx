import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Plus, TrendingUp, TrendingDown, ChevronDown, Check } from 'lucide-react';
import { Button } from './ui/button';
import { api } from '../services/authService';

export default function AddComponentModal({ employeeId, type, onClose, onSave }) {
    const navigate = useNavigate();
    const [components, setComponents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedComponent, setSelectedComponent] = useState('');
    const [value, setValue] = useState('');
    const [effectiveFrom, setEffectiveFrom] = useState(new Date().toISOString().split('T')[0]);
    const [remarks, setRemarks] = useState('');
    const [saving, setSaving] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const isEarning = type === 'EARNING';
    const title = isEarning ? 'Add Earning Component' : 'Add Deduction Component';
    const Icon = isEarning ? TrendingUp : TrendingDown;
    const colorClass = isEarning ? 'emerald' : 'red';

    useEffect(() => {
        fetchComponents();
    }, []);

    const fetchComponents = async () => {
        try {
            const selectedOrgId = localStorage.getItem('selectedOrganizationId');
            if (selectedOrgId) {
                const response = await api.get(`/salary-components?organizationId=${selectedOrgId}`);
                const filtered = response.data.filter(c => c.type === type && c.isActive);
                setComponents(filtered);
            }
        } catch (error) {
            console.error('Error fetching components:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedComponent || !value) {
            alert('Please select a component and enter a value');
            return;
        }

        setSaving(true);
        try {
            await api.post(`/employees/${employeeId}/salary-components`, {
                componentId: selectedComponent,
                value: parseFloat(value),
                effectiveFrom,
                remarks
            });
            onSave();
        } catch (error) {
            console.error('Error assigning component:', error);
            alert(error.response?.data?.message || 'Failed to assign component');
        } finally {
            setSaving(false);
        }
    };

    const selectedComponentData = components.find(c => c.id === parseInt(selectedComponent));

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className={`bg-gradient-to-r from-${colorClass}-600 to-${colorClass}-700 px-6 py-4 flex items-center justify-between`}
                    style={{
                        background: isEarning
                            ? 'linear-gradient(to right, rgb(5, 150, 105), rgb(4, 120, 87))'
                            : 'linear-gradient(to right, rgb(220, 38, 38), rgb(185, 28, 28))'
                    }}
                >
                    <div className="flex items-center gap-2">
                        <Icon className="w-6 h-6 text-white" />
                        <h2 className="text-xl font-bold text-white">{title}</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-white/20 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5 text-white" />
                    </button>
                </div>

                {/* Content */}
                <form onSubmit={handleSubmit} className="p-6">
                    {loading ? (
                        <div className="text-center py-8">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto"></div>
                            <p className="text-slate-600 mt-4">Loading components...</p>
                        </div>
                    ) : components.length === 0 ? (
                        <div className="text-center py-8">
                            <Icon className={`w-16 h-16 text-${colorClass}-200 mx-auto mb-4`} />
                            <h3 className="text-lg font-semibold text-slate-900 mb-2">
                                No {isEarning ? 'Earning' : 'Deduction'} Components Found
                            </h3>
                            <p className="text-slate-600 mb-6">
                                You need to create {isEarning ? 'earning' : 'deduction'} components first.
                            </p>
                            <Button
                                type="button"
                                onClick={() => navigate('/salary-components')}
                                className={`bg-gradient-to-r from-${colorClass}-600 to-${colorClass}-700 hover:from-${colorClass}-700 hover:to-${colorClass}-800 text-white`}
                                style={{
                                    background: isEarning
                                        ? 'linear-gradient(to right, rgb(5, 150, 105), rgb(4, 120, 87))'
                                        : 'linear-gradient(to right, rgb(220, 38, 38), rgb(185, 28, 28))'
                                }}
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Create Component
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {/* Component Selection */}
                            <div className="relative">
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Select Component <span className="text-red-500">*</span>
                                </label>
                                <button
                                    type="button"
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg flex items-center justify-between text-left focus:outline-none focus:ring-2 focus:ring-pink-500 bg-white"
                                >
                                    <span className={selectedComponent ? 'text-slate-900' : 'text-slate-500'}>
                                        {selectedComponent
                                            ? components.find(c => c.id === parseInt(selectedComponent))?.name || 'Choose a component...'
                                            : 'Choose a component...'}
                                    </span>
                                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                                </button>

                                {isDropdownOpen && (
                                    <>
                                        <div
                                            className="fixed inset-0 z-10"
                                            onClick={() => setIsDropdownOpen(false)}
                                        />
                                        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-xl z-20 max-h-60 overflow-y-auto">
                                            {components.map(component => (
                                                <button
                                                    key={component.id}
                                                    type="button"
                                                    onClick={() => {
                                                        setSelectedComponent(component.id);
                                                        setIsDropdownOpen(false);
                                                    }}
                                                    className="w-full px-4 py-2 text-left hover:bg-slate-50 flex items-center justify-between group"
                                                >
                                                    <div className="flex flex-col">
                                                        <span className="font-medium text-slate-900">{component.name}</span>
                                                        <span className="text-xs text-slate-500">{component.code}</span>
                                                    </div>
                                                    {parseInt(selectedComponent) === component.id && (
                                                        <Check className="w-4 h-4 text-pink-500" />
                                                    )}
                                                </button>
                                            ))}

                                            <div className="border-t border-slate-100 my-1"></div>

                                            <button
                                                type="button"
                                                onClick={() => {
                                                    navigate('/salary-components');
                                                }}
                                                className="w-full px-4 py-3 text-left hover:bg-rose-50 flex items-center gap-2 group transition-colors"
                                            >
                                                <div className="w-6 h-6 rounded-full bg-rose-100 flex items-center justify-center group-hover:bg-rose-200 transition-colors">
                                                    <Plus className="w-3 h-3 text-rose-600" />
                                                </div>
                                                <span className="font-semibold text-rose-600 group-hover:text-rose-700">Create New Component</span>
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* Component Details */}
                            {selectedComponentData && (
                                <div className={`p-3 bg-${colorClass}-50 border border-${colorClass}-200 rounded-lg`}
                                    style={{
                                        backgroundColor: isEarning ? 'rgb(236, 253, 245)' : 'rgb(254, 242, 242)',
                                        borderColor: isEarning ? 'rgb(167, 243, 208)' : 'rgb(254, 202, 202)'
                                    }}
                                >
                                    <p className="text-xs text-slate-600 mb-1">
                                        <span className="font-medium">Type:</span> {selectedComponentData.calculationType}
                                    </p>
                                    {selectedComponentData.baseComponentName && (
                                        <p className="text-xs text-slate-600 mb-1">
                                            <span className="font-medium">Based on:</span> {selectedComponentData.baseComponentName}
                                        </p>
                                    )}
                                    <p className="text-xs text-slate-600 mb-1">
                                        <span className="font-medium">Taxable:</span> {selectedComponentData.isTaxable ? 'Yes' : 'No'}
                                    </p>
                                    {selectedComponentData.description && (
                                        <p className="text-xs text-slate-600 mt-2">
                                            {selectedComponentData.description}
                                        </p>
                                    )}
                                </div>
                            )}

                            {/* Value */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Value <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={value}
                                    onChange={(e) => setValue(e.target.value)}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                                    placeholder={selectedComponentData?.calculationType === 'PERCENTAGE' ? 'Enter percentage (e.g., 50 for 50%)' : 'Enter amount'}
                                    required
                                />
                                {selectedComponentData?.calculationType === 'PERCENTAGE' && (
                                    <p className="text-xs text-slate-500 mt-1">
                                        Enter percentage value (e.g., 50 for 50%)
                                    </p>
                                )}
                            </div>

                            {/* Effective From */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Effective From <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="date"
                                    value={effectiveFrom}
                                    onChange={(e) => setEffectiveFrom(e.target.value)}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                                    required
                                />
                            </div>

                            {/* Remarks */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Remarks (Optional)
                                </label>
                                <textarea
                                    value={remarks}
                                    onChange={(e) => setRemarks(e.target.value)}
                                    rows={2}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                                    placeholder="Add any notes..."
                                />
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3 pt-4 border-t border-slate-200">
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
                                    className={`flex-1 bg-gradient-to-r from-${colorClass}-600 to-${colorClass}-700 hover:from-${colorClass}-700 hover:to-${colorClass}-800 text-white`}
                                    style={{
                                        background: isEarning
                                            ? 'linear-gradient(to right, rgb(5, 150, 105), rgb(4, 120, 87))'
                                            : 'linear-gradient(to right, rgb(220, 38, 38), rgb(185, 28, 28))'
                                    }}
                                >
                                    {saving ? 'Assigning...' : 'Assign Component'}
                                </Button>
                            </div>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
}
