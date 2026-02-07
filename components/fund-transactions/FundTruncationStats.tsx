'use client';

import React from 'react';
import { Users, TrendingUp, TrendingDown, LayoutPanelLeft, ArrowRightLeft, Landmark } from 'lucide-react';
import { colors } from '@/themes/colors';

interface Props {
    stats: {
        total_income: number;
        total_expense: number;
        net_flow: number;
        total_truncation: number;
        total_shareholder_investment?: number;
        total_customer_investment?: number;
    }
}

export function FundTruncationStats({ stats }: Props) {
    const statCards = [
        {
            label: 'Shareholders Total',
            value: stats.total_shareholder_investment || 0,
            subLabel: 'Resident Capital',
            icon: Users,
            color: colors.primary[600],
            bgColor: colors.primary[50],
            gradient: 'from-violet-500/5 to-transparent'
        },
        {
            label: 'Investment Total',
            value: stats.total_customer_investment || 0,
            subLabel: 'Managed Assets',
            icon: Landmark,
            color: colors.indigo[600],
            bgColor: colors.indigo[50],
            gradient: 'from-indigo-500/5 to-transparent'
        },
        {
            label: 'Total Inflow',
            value: stats.total_income,
            subLabel: 'Monthly Cycle',
            icon: TrendingUp,
            color: colors.success[600],
            bgColor: colors.success[50],
            gradient: 'from-emerald-500/5 to-transparent'
        },
        {
            label: 'Total Outflow',
            value: stats.total_expense,
            subLabel: 'Monthly Cycle',
            icon: TrendingDown,
            color: colors.danger[600],
            bgColor: colors.danger[50],
            gradient: 'from-rose-500/5 to-transparent'
        },
        {
            label: 'Net Positioning',
            value: stats.net_flow,
            subLabel: 'Institutional Flow',
            icon: LayoutPanelLeft,
            color: colors.primary[600],
            bgColor: colors.primary[50],
            gradient: 'from-primary-500/5 to-transparent'
        },
        {
            label: 'Fund Truncation',
            value: stats.total_truncation,
            subLabel: 'Terminal Volume',
            icon: ArrowRightLeft,
            color: colors.indigo[600],
            bgColor: colors.indigo[50],
            gradient: 'from-indigo-500/5 to-transparent'
        }
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
            {statCards.map((card, index) => {
                const Icon = card.icon;
                return (
                    <div
                        key={index}
                        className="group relative bg-white border border-gray-100 p-4 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 overflow-hidden"
                    >
                        <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-3">
                                <div
                                    className="w-9 h-9 rounded-xl flex items-center justify-center transition-all shadow-sm"
                                    style={{
                                        backgroundColor: card.bgColor,
                                    }}
                                >
                                    <Icon size={18} color={card.color} strokeWidth={2.5} />
                                </div>
                                <div className="w-1 h-1 rounded-full bg-gray-100 group-hover:bg-primary-300 transition-colors" />
                            </div>

                            <div className="space-y-0.5">
                                <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1 group-hover:text-gray-500">
                                    {card.label}
                                </p>
                                <h3 className="text-lg font-black text-gray-900 tracking-tighter tabular-nums leading-none">
                                    {Number(card.value).toLocaleString()}
                                </h3>
                                <div className="pt-2 flex items-center gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
                                    <div className="w-2 h-[1.5px] rounded-full bg-gray-200 group-hover:bg-primary-500 transition-all duration-300" />
                                    <p className="text-[7px] font-bold text-gray-400 uppercase tracking-widest">
                                        {card.subLabel}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
