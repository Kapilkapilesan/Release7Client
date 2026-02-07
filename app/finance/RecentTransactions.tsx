'use client';

import React from 'react';
import { colors } from '@/themes/colors';
import { ArrowUpRight, ArrowDownLeft, ChevronRight, History } from 'lucide-react';

interface RecentTransactionsProps {
    transactions: any[];
}

export const RecentTransactions: React.FC<RecentTransactionsProps> = ({ transactions }) => {
    return (
        <div className="bg-white/80 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white shadow-xl shadow-gray-200/50 flex flex-col w-full hover:shadow-2xl transition-all duration-500">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center border border-gray-100/50 shadow-sm">
                        <History className="w-5 h-5 text-gray-400" />
                    </div>
                    <div>
                        <h3 className="text-lg font-black text-gray-900 tracking-tight">Recent Activity</h3>
                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Live Transaction Feed</p>
                    </div>
                </div>
                <button className="p-2.5 rounded-xl bg-gray-50/50 hover:bg-gray-100 transition-all group border border-gray-100/50 active:scale-95">
                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:translate-x-0.5 transition-transform" />
                </button>
            </div>

            <div className="flex-1 space-y-3.5">
                {transactions.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center mb-4 border border-gray-100 shadow-inner">
                            <History className="w-6 h-6 text-gray-300" />
                        </div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-relaxed">
                            No recent records<br />detected in ledger
                        </p>
                    </div>
                ) : (
                    transactions.map((tx, index) => {
                        const isInflow = tx.type === 'inflow' || tx.type === 'income';
                        return (
                            <div
                                key={index}
                                className="flex items-center justify-between p-4 rounded-3xl group hover:bg-gray-50/50 transition-all duration-300 border border-transparent hover:border-white shadow-none hover:shadow-xl hover:shadow-gray-200/20"
                            >
                                <div className="flex items-center gap-4">
                                    <div
                                        className={`w-11 h-11 rounded-2xl flex items-center justify-center shadow-sm transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 ${isInflow
                                                ? 'bg-emerald-50 text-emerald-600'
                                                : 'bg-rose-50 text-rose-600'
                                            }`}
                                    >
                                        {isInflow ? (
                                            <ArrowUpRight className="w-5 h-5" />
                                        ) : (
                                            <ArrowDownLeft className="w-5 h-5" />
                                        )}
                                    </div>
                                    <div>
                                        <p className="text-[12px] font-black text-gray-900 tracking-tight leading-none mb-1.5 group-hover:text-primary-600 transition-colors">
                                            {tx.category || tx.description}
                                        </p>
                                        <div className="flex items-center gap-2">
                                            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">
                                                {tx.date}
                                            </p>
                                            <span className="w-1 h-1 rounded-full bg-gray-200" />
                                            <span className="text-[8px] font-black text-primary-500/60 uppercase tracking-tighter">
                                                {tx.status}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className={`text-[14px] font-black tracking-tight ${isInflow ? 'text-emerald-600' : 'text-rose-600'
                                        }`}>
                                        {isInflow ? '+' : '-'} {tx.amount.toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            <button className="w-full mt-8 py-4 px-6 rounded-2xl bg-gray-50/50 hover:bg-gray-100 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] transition-all active:scale-95 border border-gray-100 group">
                <span className="group-hover:text-gray-600 transition-colors">View Audit Trail</span>
            </button>
        </div>
    );
}
