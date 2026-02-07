'use client';

import React, { useState } from 'react';
import { Calendar, TrendingUp, Landmark } from 'lucide-react';
import { Investment } from '../../types/investment.types';
import { InvestmentDetailModal } from '../investment/InvestmentDetailModal';
import { colors } from '@/themes/colors';

interface Props {
    records: Investment[];
}

export function CustomerInvestmentsTable({ records }: Props) {
    const [selectedInvestment, setSelectedInvestment] = useState<Investment | null>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);

    const handleRowClick = (investment: Investment) => {
        setSelectedInvestment(investment);
        setIsDetailOpen(true);
    };

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'ACTIVE': return { bg: 'bg-emerald-500/10', text: 'text-emerald-500', border: 'border-emerald-500/20' };
            case 'CLOSED': return { bg: 'bg-text-muted/10', text: 'text-text-muted', border: 'border-text-muted/20' };
            case 'MATURED': return { bg: 'bg-amber-500/10', text: 'text-amber-500', border: 'border-amber-500/20' };
            case 'RENEWED': return { bg: 'bg-primary-500/10', text: 'text-primary-500', border: 'border-primary-500/20' };
            default: return { bg: 'bg-text-muted/10', text: 'text-text-muted', border: 'border-border-divider' };
        }
    };

    return (
        <div className="space-y-4">
            <div className="bg-card rounded-[2.5rem] overflow-hidden shadow-2xl border border-border-default">
                <div className="p-8 border-b border-border-divider flex items-center justify-between bg-muted-bg/10">
                    <div className="flex items-center gap-5">
                        <div className="w-12 h-12 rounded-2xl bg-primary-600 flex items-center justify-center shadow-xl shadow-primary-500/20">
                            <Landmark className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-text-primary tracking-tight uppercase leading-none">Investor Portfolios</h3>
                            <p className="text-[10px] text-text-muted font-black tracking-[0.2em] uppercase mt-2 opacity-60">Managed Capital Accounts Matrix</p>
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left border-separate border-spacing-0">
                        <thead>
                            <tr className="bg-table-header">
                                <th className="px-8 py-6 text-[10px] font-black text-text-muted uppercase tracking-[0.2em] border-b border-border-divider whitespace-nowrap">Account Hierarchy</th>
                                <th className="px-8 py-6 text-[10px] font-black text-text-muted uppercase tracking-[0.2em] border-b border-border-divider whitespace-nowrap">Principal Investor</th>
                                <th className="px-8 py-6 text-[10px] font-black text-text-muted uppercase tracking-[0.2em] border-b border-border-divider whitespace-nowrap">Structure & Return</th>
                                <th className="px-8 py-6 text-[10px] font-black text-text-muted uppercase tracking-[0.2em] border-b border-border-divider text-right whitespace-nowrap">Active Balance</th>
                                <th className="px-8 py-6 text-[10px] font-black text-text-muted uppercase tracking-[0.2em] border-b border-border-divider whitespace-nowrap text-right">Lifecycle</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border-divider">
                            {records.length > 0 ? records.map((record) => {
                                const status = getStatusStyle(record.status);
                                return (
                                    <tr
                                        key={record.id}
                                        onClick={() => handleRowClick(record)}
                                        className="group hover:bg-table-row-hover transition-all duration-300 cursor-pointer"
                                    >
                                        <td className="px-8 py-6">
                                            <div className="flex flex-col gap-3">
                                                <div className="flex items-center gap-2">
                                                    <code className="text-[10px] font-black bg-primary-500/10 text-primary-600 px-3 py-1.5 rounded-xl border border-primary-500/20 group-hover:bg-primary-600 group-hover:text-white transition-all duration-500 shadow-sm uppercase tracking-tighter">
                                                        {record.transaction_id}
                                                    </code>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <div className={`w-2 h-2 rounded-full ${status.text.replace('text-', 'bg-')} shadow-[0_0_8px_currentColor] animate-pulse`} />
                                                    <span className={`text-[10px] font-black uppercase tracking-widest ${status.text} opacity-80`}>
                                                        {record.status}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div>
                                                <p className="text-base font-black text-text-primary group-hover:text-primary-600 transition-colors uppercase tracking-tight leading-none mb-2">{record.customer?.full_name || 'N/A'}</p>
                                                <span className="text-[10px] font-black text-text-muted uppercase tracking-widest bg-muted-bg/50 px-2 py-1 rounded-lg border border-border-divider/50">ID: {record.customer?.customer_code}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="space-y-2">
                                                <p className="text-[11px] font-black text-primary-500 uppercase tracking-widest group-hover:text-primary-600 transition-colors">{record.snapshot_product_name}</p>
                                                <div className="flex items-center gap-2">
                                                    <div className="flex items-center gap-1.5 text-[10px] font-black text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-xl border border-emerald-500/20 shadow-sm">
                                                        <TrendingUp className="w-3.5 h-3.5" />
                                                        {record.snapshot_payout_type === 'MONTHLY' ? record.snapshot_interest_rate_monthly : record.snapshot_interest_rate_maturity}%
                                                    </div>
                                                    <span className="text-[9px] font-black text-text-muted uppercase tracking-[0.2em] opacity-50">{record.snapshot_payout_type} Return</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-right text-nowrap">
                                            <div className="flex flex-col items-end gap-2">
                                                <span className="text-2xl font-black text-text-primary tracking-tighter tabular-nums leading-none group-hover:scale-110 transition-transform duration-500 origin-right">
                                                    {Number(record.amount).toLocaleString()}
                                                </span>
                                                <div className="flex items-center gap-2 px-2 py-1 bg-muted-bg/50 rounded-lg border border-border-divider shadow-inner">
                                                    <span className="text-[9px] font-black text-text-muted uppercase tracking-widest opacity-60">Principal Amount</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex flex-col items-end gap-2">
                                                <div className="flex items-center gap-2 px-3 py-1.5 bg-muted-bg rounded-2xl border border-border-divider group-hover:bg-card transition-colors">
                                                    <Calendar className="w-4 h-4 text-primary-500" />
                                                    <span className="text-[10px] font-black text-text-primary uppercase tracking-tight">{record.start_date ? new Date(record.start_date).toLocaleDateString() : 'N/A'}</span>
                                                </div>
                                                <div className="flex items-center gap-2 px-3 py-1.5 bg-rose-500/10 rounded-2xl border border-rose-500/20 text-rose-500">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse shadow-[0_0_8px_rgba(244,63,94,0.5)]" />
                                                    <span className="text-[9px] font-black uppercase tracking-widest opacity-80">EXP: {record.maturity_date ? new Date(record.maturity_date).toLocaleDateString() : 'N/A'}</span>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            }) : (
                                <tr>
                                    <td colSpan={5} className="px-6 py-20 text-center bg-gray-50/20">
                                        <div className="flex flex-col items-center">
                                            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-4 shadow-xl border border-gray-50">
                                                <Landmark className="w-8 h-8 text-gray-100" />
                                            </div>
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">No capital subscriptions detected</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="p-8 bg-muted-bg/10 border-t border-border-divider rounded-b-[2.5rem] text-center">
                <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.4em] opacity-40">
                    Institutional capital subscription records verified & authenticated
                </p>
            </div>

            <InvestmentDetailModal
                isOpen={isDetailOpen}
                onClose={() => setIsDetailOpen(false)}
                investment={selectedInvestment}
            />
        </div>
    );
}
