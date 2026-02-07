'use client';

import React from 'react';
import {
    X,
    Calculator,
    ShieldCheck,
    Clock,
    Wallet,
    BarChart3,
    Tag,
    AlertCircle,
    TrendingUp,
    UserCheck,
    Calendar,
    ArrowRight
} from 'lucide-react';
import { InvestmentProduct } from '../../types/investment-product.types';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    product: InvestmentProduct | null;
}

export function InvestmentProductDetailModal({ isOpen, onClose, product }: Props) {
    if (!isOpen || !product) return null;

    const detailRows = [
        { label: 'Minimum Age', value: `${product.age_limited || 18}+ Years`, icon: UserCheck },
        { label: 'Date Created', value: product.created_at ? new Date(product.created_at).toLocaleDateString() : 'N/A', icon: Calendar },
    ];

    return (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
            <div className="bg-card rounded-[2.5rem] max-w-lg w-full shadow-2xl overflow-hidden animate-in zoom-in duration-300 border border-border-default">
                {/* Header Section */}
                <div className="relative p-10 bg-gradient-to-br from-primary-600 via-primary-700 to-indigo-800">
                    <button
                        onClick={onClose}
                        className="absolute right-8 top-8 p-3 bg-white/10 hover:bg-white/20 rounded-2xl text-white transition-all group backdrop-blur-xl border border-white/10"
                    >
                        <X className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                    </button>

                    <div className="flex items-center gap-4 mb-6">
                        <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-lg text-white text-[10px] font-black tracking-widest uppercase font-mono border border-white/10">
                            {product.product_code}
                        </span>
                        <div className="h-1 w-1 bg-white/30 rounded-full" />
                        <span className="text-white/70 text-[10px] font-black uppercase tracking-[0.2em]">Product Specifications</span>
                    </div>

                    <h2 className="text-4xl font-black text-white mb-3 tracking-tight">
                        {product.name}
                    </h2>

                    <div className="flex items-center gap-2 text-white/60">
                        <ShieldCheck className="w-4 h-4" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Verify official product parameters below</span>
                    </div>
                </div>

                {/* Main Stats Row */}
                <div className="grid grid-cols-2 gap-px bg-border-divider border-b border-border-divider">
                    <div className="bg-card p-8 flex flex-col items-center text-center">
                        <span className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-3">Base Return</span>
                        <div className="flex items-baseline gap-1">
                            <span className="text-4xl font-black text-emerald-500">
                                {product.interest_rates_json?.[0]?.interest_maturity || Number(product.interest_rate) || 0}
                            </span>
                            <span className="text-xl font-black text-emerald-500">%</span>
                        </div>
                    </div>
                    <div className="bg-card p-8 flex flex-col items-center text-center">
                        <span className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-3">Default Term</span>
                        <div className="flex items-baseline gap-1">
                            <span className="text-4xl font-black text-primary-500">
                                {product.interest_rates_json?.[0]?.term_months || product.duration_months || 0}
                            </span>
                            <span className="text-sm font-black text-primary-500 uppercase">Mo</span>
                        </div>
                    </div>
                </div>

                {/* Rates Table if JSON exists */}
                {product.interest_rates_json && product.interest_rates_json.length > 0 && (
                    <div className="px-10 pt-8">
                        <div className="bg-muted-bg/30 rounded-[2rem] border border-border-divider overflow-hidden">
                            <table className="w-full text-left text-[10px]">
                                <thead className="bg-table-header text-text-muted uppercase font-black tracking-[0.2em]">
                                    <tr>
                                        <th className="px-6 py-4">Term</th>
                                        <th className="px-6 py-4 text-center">Monthly %</th>
                                        <th className="px-6 py-4 text-center">Maturity %</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border-divider/50">
                                    {product.interest_rates_json.map((tier, i) => (
                                        <tr key={i} className="hover:bg-card transition-colors font-black text-text-secondary">
                                            <td className="px-6 py-4">{tier.term_months} Mo</td>
                                            <td className="px-6 py-4 text-center text-emerald-500">{tier.interest_monthly}%</td>
                                            <td className="px-6 py-4 text-center text-primary-500">{tier.interest_maturity}%</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                <div className="p-10 space-y-10">
                    {/* Limits section */}
                    <div className="bg-muted-bg/30 rounded-[2rem] p-8 border border-border-divider shadow-inner flex flex-col gap-6">
                        <div className="flex items-center gap-3">
                            <Wallet className="w-5 h-5 text-primary-500" />
                            <h3 className="text-[10px] font-black text-text-primary uppercase tracking-[0.2em]">Investment Limits</h3>
                        </div>
                        <div className="flex items-center justify-between gap-8">
                            <div className="flex-1">
                                <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-2 opacity-50">Minimum</p>
                                <p className="text-xl font-black text-text-primary tracking-tight">LKR {Number(product.min_amount).toLocaleString()}</p>
                            </div>
                            <div className="w-12 h-px bg-border-divider" />
                            <div className="flex-1 text-right">
                                <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-2 opacity-50">Maximum</p>
                                <p className="text-xl font-black text-text-primary tracking-tight">LKR {Number(product.max_amount).toLocaleString()}</p>
                            </div>
                        </div>
                    </div>

                    {/* Additional Details Grid */}
                    <div className="grid grid-cols-2 gap-y-8 gap-x-12">
                        {detailRows.map((row, idx) => (
                            <div key={idx} className="flex gap-4 group">
                                <div className="p-3 rounded-2xl bg-muted-bg flex-shrink-0 group-hover:bg-primary-500/10 transition-colors">
                                    <row.icon className="w-5 h-5 text-text-muted group-hover:text-primary-500 transition-colors" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.1em] mb-1 opacity-50">{row.label}</p>
                                    <p className="text-sm font-black truncate capitalize text-text-primary">
                                        {row.value}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer Advice */}
                <div className="p-8 bg-primary-500/5 border-t border-primary-500/10 flex items-center gap-5">
                    <div className="p-3 bg-primary-500/10 rounded-2xl">
                        <TrendingUp className="w-5 h-5 text-primary-600" />
                    </div>
                    <p className="text-[10px] font-black text-primary-700/80 leading-relaxed uppercase tracking-wider">
                        This configured product governs the interest calculation for all active accounts under this scheme.
                    </p>
                </div>
            </div>
        </div>
    );
}
