'use client'

import React from 'react';
import { TrendingUp, TrendingDown, Wallet, ArrowRightLeft, CreditCard, Activity, Target, ShieldCheck } from 'lucide-react';
import { colors } from '@/themes/colors';

export function BranchTruncationStats({ stats, period = 'day' }: { stats: any; period?: string }) {
    const cards = [
        {
            title: `Total Income (${period})`,
            value: stats?.total_income || 0,
            icon: TrendingUp,
            color: colors.success[600],
            bgColor: colors.success[50],
            borderColor: colors.success[100],
            glowColor: colors.success[500],
            trend: 'Inflow Logged'
        },
        {
            title: `Total Expense (${period})`,
            value: stats?.total_expense || 0,
            icon: TrendingDown,
            color: colors.danger[600],
            bgColor: colors.danger[50],
            borderColor: colors.danger[100],
            glowColor: colors.danger[500],
            trend: 'Outflow Logged'
        },
        {
            title: 'Net Cumulative Flow',
            value: stats?.net_flow || 0,
            icon: Wallet,
            color: colors.primary[600],
            bgColor: colors.primary[50],
            borderColor: colors.primary[100],
            glowColor: colors.primary[500],
            trend: 'Liquidity Trace'
        },
        {
            title: `Truncation Total (${period})`,
            value: stats?.total_truncation || 0,
            icon: ArrowRightLeft,
            color: colors.indigo[600],
            bgColor: colors.indigo[50],
            borderColor: colors.indigo[100],
            glowColor: colors.indigo[500],
            trend: 'Delta Finalization'
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {cards.map((card, idx) => (
                <div
                    key={idx}
                    className="group relative bg-white rounded-[2.5rem] border border-gray-100 p-7 shadow-sm hover:shadow-2xl transition-all duration-500 cursor-default overflow-hidden transform hover:-translate-y-1"
                >
                    {/* Visual Depth Background */}
                    <div className="absolute -right-10 -bottom-10 w-32 h-32 rounded-full blur-3xl opacity-0 group-hover:opacity-10 transition-opacity duration-700"
                        style={{ backgroundColor: card.glowColor }} />

                    <div className="relative z-10">
                        {/* Card Header */}
                        <div className="flex items-center justify-between mb-8">
                            <div className="space-y-1.5">
                                <div className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: card.color }} />
                                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                                        {card.title}
                                    </h4>
                                </div>
                                <p className="text-[9px] font-black uppercase tracking-widest opacity-40 leading-none ml-3.5">
                                    Institutional Metric
                                </p>
                            </div>
                            <div
                                className="w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:rotate-12 group-hover:scale-110 shadow-lg"
                                style={{
                                    background: `linear-gradient(135deg, ${card.color}, ${card.color}dd)`,
                                    boxShadow: `0 8px 16px ${card.color}25`
                                }}
                            >
                                <card.icon className="w-5 h-5 text-white" strokeWidth={2.5} />
                            </div>
                        </div>

                        {/* Value Display */}
                        <div className="flex flex-col mb-6">
                            <div className="flex items-baseline gap-2">
                                <span className="text-[11px] font-black text-gray-300 uppercase tracking-widest">LKR</span>
                                <h3 className="text-3xl font-black text-gray-900 tracking-tighter tabular-nums leading-none">
                                    {card.value.toLocaleString()}
                                </h3>
                            </div>
                        </div>

                        {/* Status Footer */}
                        <div className="flex items-center justify-between pt-5 border-t border-gray-50">
                            <div className="flex items-center gap-2">
                                <Activity className="w-3 h-3 text-gray-300" />
                                <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{card.trend}</span>
                            </div>
                            <div className="flex gap-1">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="w-1 h-3 rounded-full bg-gray-50 group-hover:bg-primary-500/10 transition-all duration-700"
                                        style={{ height: `${2 + i * 2}px`, backgroundColor: i === 3 ? card.color : undefined, opacity: i === 3 ? 0.3 : 1 }} />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
