'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { X, Calculator, Info, AlertCircle, CheckCircle2, Plus, Trash2, Save, ShieldAlert } from 'lucide-react';
import { toast } from 'react-toastify';
import { InvestmentProduct, InvestmentProductFormData, InterestRateTier } from '../../types/investment-product.types';
import { investmentProductService } from '../../services/investment-product.service';
import { colors } from '@/themes/colors';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: InvestmentProductFormData) => void;
    initialData?: InvestmentProduct | null;
}

interface ValidationErrors {
    [key: string]: string;
}

export function InvestmentProductForm({ isOpen, onClose, onSave, initialData }: Props) {
    const [formData, setFormData] = useState<InvestmentProductFormData>({
        product_code: '',
        name: '',
        age_limited: 18,
        min_amount: 1000,
        max_amount: 1000000,
        interest_rates_json: [
            { term_months: 12, interest_monthly: 10, interest_maturity: 11, breakdown_monthly: 0.5, breakdown_maturity: 0.5 }
        ],
        negotiation_rates_json: { monthly: 0, maturity: 0 }
    });

    const [errors, setErrors] = useState<ValidationErrors>({});
    const [touched, setTouched] = useState<{ [key: string]: boolean }>({});
    const [isLoadingCode, setIsLoadingCode] = useState(false);

    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                setFormData({
                    product_code: initialData.product_code || '',
                    name: initialData.name || '',
                    age_limited: initialData.age_limited || 18,
                    min_amount: initialData.min_amount || 0,
                    max_amount: initialData.max_amount || 0,
                    interest_rates_json: initialData.interest_rates_json || [],
                    negotiation_rates_json: initialData.negotiation_rates_json || { monthly: 0, maturity: 0 }
                });
            } else {
                setFormData({
                    product_code: 'Loading...',
                    name: '',
                    age_limited: 18,
                    min_amount: 1000,
                    max_amount: 1000000,
                    interest_rates_json: [
                        { term_months: 12, interest_monthly: 0, interest_maturity: 0, breakdown_monthly: 0, breakdown_maturity: 0 }
                    ],
                    negotiation_rates_json: { monthly: 0, maturity: 0 }
                });

                const fetchNextCode = async () => {
                    setIsLoadingCode(true);
                    try {
                        const code = await investmentProductService.getNextCode();
                        setFormData(prev => ({ ...prev, product_code: code }));
                    } catch (error) {
                        console.error('Error fetching next code:', error);
                        setFormData(prev => ({ ...prev, product_code: '' }));
                    } finally {
                        setIsLoadingCode(false);
                    }
                };
                fetchNextCode();
            }
            setErrors({});
            setTouched({});
        }
    }, [initialData, isOpen]);

    const addRateRow = () => {
        setFormData(prev => ({
            ...prev,
            interest_rates_json: [
                ...prev.interest_rates_json,
                { term_months: 0, interest_monthly: 0, interest_maturity: 0, breakdown_monthly: 0, breakdown_maturity: 0 }
            ]
        }));
    };

    const removeRateRow = (index: number) => {
        setFormData(prev => ({
            ...prev,
            interest_rates_json: prev.interest_rates_json.filter((_, i) => i !== index)
        }));
    };

    const updateRateRow = (index: number, field: keyof InterestRateTier, value: any) => {
        setFormData(prev => {
            const newRates = [...prev.interest_rates_json];
            // If the value is NaN (e.g. from empty input), store it as 0 or empty to prevent rendering issues
            const numericValue = isNaN(parseFloat(value)) ? 0 : parseFloat(value);
            const intValue = isNaN(parseInt(value)) ? 0 : parseInt(value);

            const finalValue = field === 'term_months' ? intValue : numericValue;

            newRates[index] = { ...newRates[index], [field]: finalValue };
            return { ...prev, interest_rates_json: newRates };
        });
    };

    const handleSubmit = () => {
        // Simple validaton
        if (!formData.name || formData.product_code === 'Loading...') {
            toast.error("Please complete the basic product details (Name and Code).", {
                position: "top-right",
                toastId: "val-error-basic"
            });
            return;
        }

        if (formData.interest_rates_json.length === 0) {
            toast.error("Please add at least one rate configuration row", {
                position: "top-right",
                toastId: "val-error-rates"
            });
            return;
        }
        onSave(formData);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-300 overflow-y-auto">
            <div className="bg-card rounded-[2.5rem] max-w-4xl w-full shadow-2xl relative my-8 animate-in zoom-in duration-300 border border-border-default overflow-hidden flex flex-col">
                {/* Header */}
                <div
                    className="p-8 border-b border-border-divider flex items-center justify-between rounded-t-[2.5rem]"
                    style={{ backgroundImage: `linear-gradient(135deg, ${colors.primary[600]}, ${colors.primary[500]}, ${colors.indigo[600]})` }}
                >
                    <div className="flex items-center gap-5">
                        <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-xl border border-white/20 shadow-2xl">
                            <Calculator className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-white tracking-tight uppercase leading-none">{initialData ? 'Update' : 'Initialize'} Asset Product</h2>
                            <p className="text-white/70 text-[10px] font-black uppercase tracking-[0.2em] mt-2 opacity-80">Financial Architecture & Governance</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-3 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl transition-all group active:scale-90">
                        <X className="w-6 h-6 text-white transition-all group-hover:rotate-90" />
                    </button>
                </div>

                <div className="p-8 space-y-8 max-h-[75vh] overflow-y-auto custom-scrollbar">
                    {/* Identification */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2 flex items-center gap-3 border-b border-border-divider pb-4">
                            <Info className="w-5 h-5" style={{ color: colors.primary[600] }} />
                            <h3 className="text-sm font-black text-text-primary uppercase tracking-[0.2em]">Product Identification</h3>
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-text-muted uppercase tracking-widest mb-3">Product Code</label>
                            <input
                                type="text"
                                value={formData.product_code}
                                readOnly
                                className="w-full px-5 py-4 bg-muted-bg/30 border border-border-divider rounded-2xl font-mono text-text-primary opacity-60"
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-text-muted uppercase tracking-widest mb-3">Product Name</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                placeholder="e.g. Fixed Deposit - 12 Months"
                                className="w-full px-5 py-4 bg-muted-bg/30 border border-border-divider rounded-2xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500/50 outline-none text-text-primary transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-text-muted uppercase tracking-widest mb-3">Age Limit (Min Years)</label>
                            <input
                                type="number"
                                min="0"
                                value={formData.age_limited || ''}
                                onChange={e => {
                                    const val = Math.max(0, parseInt(e.target.value) || 0);
                                    setFormData(prev => ({ ...prev, age_limited: e.target.value === '' ? 18 : val }));
                                }}
                                className="w-full px-5 py-4 bg-muted-bg/30 border border-border-divider rounded-2xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500/50 outline-none text-text-primary transition-all"
                            />
                        </div>
                    </div>

                    {/* Rate Configuration Table */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between border-b border-border-divider/50 pb-6 pt-4">
                            <div className="flex items-center gap-4">
                                <div className="p-2 bg-primary-500/10 rounded-xl">
                                    <Calculator className="w-5 h-5 text-primary-500" />
                                </div>
                                <h3 className="text-sm font-black text-text-primary uppercase tracking-[0.2em]">Asset yield matrix</h3>
                            </div>
                            <button
                                onClick={addRateRow}
                                className="flex items-center gap-3 px-8 py-3 bg-primary-500/10 border border-primary-500/20 rounded-2xl text-[10px] font-black text-primary-600 uppercase tracking-widest hover:bg-primary-500/20 transition-all active:scale-95 shadow-lg"
                            >
                                <Plus className="w-4 h-4" /> Add Row
                            </button>
                        </div>

                        <div className="overflow-x-auto rounded-3xl border border-border-divider/50 shadow-sm bg-muted-bg/10">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-table-header text-[10px] uppercase tracking-widest text-text-muted">
                                    <tr>
                                        <th className="px-6 py-4 border-b border-border-divider font-black" rowSpan={2}>Months</th>
                                        <th className="px-6 py-4 border-b border-border-divider text-center font-black" colSpan={2}>Interest Rate (%)</th>
                                        <th className="px-6 py-4 border-b border-border-divider text-center font-black text-primary-500" colSpan={2}>Interest Breakdown (%)</th>
                                        <th className="px-6 py-4 border-b border-border-divider text-right font-black" rowSpan={2}>Actions</th>
                                    </tr>
                                    <tr>
                                        <th className="px-6 py-3 border-b border-border-divider text-center font-black">Monthly</th>
                                        <th className="px-6 py-3 border-b border-border-divider text-center font-black">Maturity</th>
                                        <th className="px-6 py-3 border-b border-border-divider text-center font-black text-primary-500 opacity-80">Monthly</th>
                                        <th className="px-6 py-3 border-b border-border-divider text-center font-black text-primary-500 opacity-80">Maturity</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border-divider">
                                    {formData.interest_rates_json.map((rate, idx) => (
                                        <tr key={idx} className="hover:bg-table-row-hover transition-colors">
                                            <td className="px-6 py-5">
                                                <input
                                                    type="number"
                                                    min="1"
                                                    value={rate.term_months || ''}
                                                    onChange={e => {
                                                        const val = Math.max(1, parseInt(e.target.value) || 0);
                                                        updateRateRow(idx, 'term_months', e.target.value === '' ? '' : val);
                                                    }}
                                                    className="w-24 px-4 py-2.5 bg-card border border-border-divider rounded-xl focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500/50 outline-none text-center text-text-primary text-sm font-black shadow-inner-sm transition-all"
                                                />
                                            </td>
                                            <td className="px-6 py-5 text-center">
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    min="0"
                                                    value={rate.interest_monthly || ''}
                                                    onChange={e => {
                                                        const val = Math.max(0, parseFloat(e.target.value) || 0);
                                                        updateRateRow(idx, 'interest_monthly', e.target.value === '' ? '' : val);
                                                    }}
                                                    className="w-24 px-4 py-2.5 bg-card border border-border-divider rounded-xl focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500/50 outline-none text-center text-text-primary text-sm font-black shadow-inner-sm transition-all"
                                                />
                                            </td>
                                            <td className="px-6 py-5 text-center">
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    min="0"
                                                    value={rate.interest_maturity || ''}
                                                    onChange={e => {
                                                        const val = Math.max(0, parseFloat(e.target.value) || 0);
                                                        updateRateRow(idx, 'interest_maturity', e.target.value === '' ? '' : val);
                                                    }}
                                                    className="w-24 px-4 py-2.5 bg-card border border-border-divider rounded-xl focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500/50 outline-none text-center text-text-primary text-sm font-black shadow-inner-sm transition-all"
                                                />
                                            </td>
                                            <td className="px-6 py-5 text-center">
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    min="0"
                                                    value={rate.breakdown_monthly || ''}
                                                    onChange={e => {
                                                        const val = Math.max(0, parseFloat(e.target.value) || 0);
                                                        updateRateRow(idx, 'breakdown_monthly', e.target.value === '' ? '' : val);
                                                    }}
                                                    className="w-24 px-4 py-2.5 bg-primary-500/5 border border-primary-500/30 rounded-xl focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500/50 outline-none text-center text-primary-600 text-sm font-black shadow-inner-sm transition-all"
                                                />
                                            </td>
                                            <td className="px-6 py-5 text-center">
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    min="0"
                                                    value={rate.breakdown_maturity || ''}
                                                    onChange={e => {
                                                        const val = Math.max(0, parseFloat(e.target.value) || 0);
                                                        updateRateRow(idx, 'breakdown_maturity', e.target.value === '' ? '' : val);
                                                    }}
                                                    className="w-24 px-4 py-2.5 bg-primary-500/5 border border-primary-500/30 rounded-xl focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500/50 outline-none text-center text-primary-600 text-sm font-black shadow-inner-sm transition-all"
                                                />
                                            </td>
                                            <td className="px-6 py-5 text-right">
                                                <button onClick={() => removeRateRow(idx)} className="p-3 text-rose-500 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 rounded-2xl transition-all active:scale-95 shadow-sm group">
                                                    <Trash2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Negotiation Config */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                        <div className="md:col-span-2 flex items-center gap-3 border-b border-border-divider pb-4">
                            <Info className="w-5 h-5 text-primary-500" />
                            <h3 className="text-sm font-black text-text-primary uppercase tracking-[0.2em]">Negotiation Configuration</h3>
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-text-muted uppercase tracking-widest mb-3">Negotiation Interest (Monthly) %</label>
                            <div className="relative">
                                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-text-muted font-bold opacity-40">%</span>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={formData.negotiation_rates_json?.monthly || 0}
                                    onChange={e => {
                                        const val = Math.max(0, parseFloat(e.target.value) || 0);
                                        setFormData(prev => ({
                                            ...prev,
                                            negotiation_rates_json: {
                                                ...prev.negotiation_rates_json!,
                                                monthly: e.target.value === '' ? 0 : val
                                            }
                                        }));
                                    }}
                                    className="w-full pl-10 pr-5 py-4 bg-muted-bg/30 border border-border-divider rounded-2xl focus:ring-2 focus:ring-primary-500/20 outline-none text-text-primary font-bold transition-all"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-text-muted uppercase tracking-widest mb-3">Negotiation Interest (Annually) %</label>
                            <div className="relative">
                                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-text-muted font-bold opacity-40">%</span>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={formData.negotiation_rates_json?.maturity || 0}
                                    onChange={e => {
                                        const val = Math.max(0, parseFloat(e.target.value) || 0);
                                        setFormData(prev => ({
                                            ...prev,
                                            negotiation_rates_json: {
                                                ...prev.negotiation_rates_json!,
                                                maturity: e.target.value === '' ? 0 : val
                                            }
                                        }));
                                    }}
                                    className="w-full pl-10 pr-5 py-4 bg-muted-bg/30 border border-border-divider rounded-2xl focus:ring-2 focus:ring-primary-500/20 outline-none text-text-primary font-bold transition-all"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Limits */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                        <div className="md:col-span-2 flex items-center gap-3 border-b border-border-divider pb-4">
                            <ShieldAlert className="w-5 h-5 text-primary-500" />
                            <h3 className="text-sm font-black text-text-primary uppercase tracking-[0.2em]">Investment Limits</h3>
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-text-muted uppercase tracking-widest mb-3">Min Investment (LKR)</label>
                            <input
                                type="number"
                                min="0"
                                value={formData.min_amount || ''}
                                onChange={e => {
                                    const val = Math.max(0, parseFloat(e.target.value) || 0);
                                    setFormData(prev => ({ ...prev, min_amount: e.target.value === '' ? 0 : val }));
                                }}
                                className="w-full px-5 py-4 bg-muted-bg/30 border border-border-divider rounded-2xl focus:ring-2 focus:ring-primary-500/20 outline-none text-text-primary font-black transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-text-muted uppercase tracking-widest mb-3">Max Investment (LKR)</label>
                            <input
                                type="number"
                                min="0"
                                value={formData.max_amount || ''}
                                onChange={e => {
                                    const val = Math.max(0, parseFloat(e.target.value) || 0);
                                    setFormData(prev => ({ ...prev, max_amount: e.target.value === '' ? 0 : val }));
                                }}
                                className="w-full px-5 py-4 bg-muted-bg/30 border border-border-divider rounded-2xl focus:ring-2 focus:ring-primary-500/20 outline-none text-text-primary font-black transition-all"
                            />
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-10 border-t border-border-divider flex gap-5 justify-end bg-muted-bg/30 backdrop-blur-3xl sticky bottom-0">
                    <button
                        onClick={onClose}
                        className="px-10 py-4 bg-transparent border border-border-divider rounded-2xl hover:bg-muted transition-all font-black text-[10px] uppercase tracking-[0.25em] text-text-secondary active:scale-95"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="px-12 py-4 bg-primary-600 text-white rounded-2xl transition-all font-black text-[10px] uppercase tracking-[0.3em] active:scale-95 shadow-2xl shadow-primary-500/40 hover:bg-primary-500 hover:shadow-primary-500/60 flex items-center gap-3"
                    >
                        {initialData ? <Save className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
                        {initialData ? 'Update Product' : 'Create Product'}
                    </button>
                </div>
            </div>
        </div>
    );
}
