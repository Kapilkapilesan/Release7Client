'use client'

import React from 'react';
import { TrendingUp, TrendingDown, Clock, ShieldCheck, Hash, User, Activity, Landmark } from 'lucide-react';
import { BranchExpense } from '../../types/finance.types';
import { colors } from '@/themes/colors';

export function BranchActivityTable({ activities }: { activities: BranchExpense[] }) {
    const netTotal = activities.reduce((sum, activity) => {
        return activity.type === 'inflow' ? sum + parseFloat(activity.amount) : sum - parseFloat(activity.amount);
    }, 0);

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div className="flex items-center justify-between px-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-primary-50 border border-primary-100 shadow-sm transition-transform hover:scale-105">
                        <Activity className="w-5 h-5 text-primary-600" strokeWidth={2.5} />
                    </div>
                    <div>
                        <h3 className="text-sm font-black text-gray-900 tracking-tight uppercase leading-none">
                            Activity Ledger
                        </h3>
                        <p className="text-[9px] font-black text-gray-400 mt-1 uppercase tracking-widest leading-none">Complete transaction history</p>
                    </div>
                </div>
                <div className="flex items-center gap-6">
                    <div className="text-right hidden sm:block">
                        <p className="text-[8px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Period Delta</p>
                        <p className={`text-lg font-black tabular-nums tracking-tighter leading-none ${netTotal >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                            {netTotal >= 0 ? '+' : '-'} LKR {Math.abs(netTotal).toLocaleString()}
                        </p>
                    </div>
                    <div className="w-px h-8 bg-gray-100" />
                </div>
            </div>

            <div className="bg-white rounded-[2rem] border border-gray-50 overflow-hidden shadow-sm">
                <div className="overflow-x-auto no-scrollbar">
                    <table className="w-full text-left border-separate border-spacing-0">
                        <thead>
                            <tr className="bg-gray-50/30">
                                <th className="px-8 py-5 text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] border-b border-gray-50">Temporal Origin</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] border-b border-gray-50">Log Profile</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] border-b border-gray-50">Entity Focus</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] border-b border-gray-50">Delta Value</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50/50">
                            {activities.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-8 py-24 text-center">
                                        <div className="flex flex-col items-center justify-center uppercase">
                                            <div className="p-8 bg-gray-50 rounded-[2rem] mb-6">
                                                <Activity size={48} className="text-gray-200" />
                                            </div>
                                            <p className="text-[10px] font-black text-gray-400 tracking-[0.4em]">Historical Log Empty</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                activities.map((activity, idx) => (
                                    <tr key={activity.id || idx} className="group hover:bg-gray-50/30 transition-all duration-500 cursor-default">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center border border-gray-100 shadow-sm transition-transform group-hover:scale-110">
                                                    <Clock className="w-5 h-5 text-gray-300" strokeWidth={2.5} />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-black text-gray-900 uppercase tracking-tight group-hover:text-primary-600 transition-colors">
                                                        {new Date(activity.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                    </p>
                                                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mt-1 opacity-60">
                                                        {new Date(activity.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex flex-col gap-2">
                                                <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl border ring-4 transition-all border-white shadow-sm w-fit ${activity.type === 'inflow'
                                                        ? 'bg-emerald-50 text-emerald-600 ring-emerald-500/10'
                                                        : 'bg-rose-50 text-rose-600 ring-rose-500/10'
                                                    }`}>
                                                    {activity.type === 'inflow' ? <TrendingUp size={12} strokeWidth={2.5} /> : <TrendingDown size={12} strokeWidth={2.5} />}
                                                    <span className="text-[9px] font-black uppercase tracking-widest">
                                                        {activity.expense_type}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-1.5 opacity-60 ml-1">
                                                    <ShieldCheck className="w-3 h-3 text-primary-500" />
                                                    <span className="text-[9px] font-black text-gray-400 tracking-widest uppercase truncate max-w-[120px]">
                                                        {activity.transaction?.soap_ref_no || `TRX-${activity.id || 'N/A'}`}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center border border-gray-100 shadow-sm transition-transform group-hover:scale-110">
                                                    <Landmark className="w-5 h-5 text-gray-400" />
                                                </div>
                                                <div>
                                                    <p className="text-xs font-black text-gray-900 uppercase tracking-tight group-hover:text-primary-600 transition-colors">
                                                        {activity.branch?.branch_name}
                                                    </p>
                                                    <div className="flex items-center gap-1.5 mt-1.5 opacity-60">
                                                        <User className="w-2.5 h-2.5 text-gray-400" />
                                                        <span className="text-[9px] font-black text-gray-400 tracking-widest uppercase whitespace-nowrap overflow-hidden text-ellipsis max-w-[150px]">
                                                            {activity.transaction?.staff?.full_name || activity.transaction?.staff_id || 'Global Processor'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex flex-col items-end gap-1">
                                                <div className="flex items-baseline gap-1.5">
                                                    <span className="text-[9px] font-black text-gray-300 uppercase">LKR</span>
                                                    <p className={`text-base font-black tabular-nums tracking-tighter ${activity.type === 'inflow' ? 'text-emerald-600' : 'text-rose-600'}`}>
                                                        {activity.type === 'inflow' ? '+' : '-'} {parseFloat(activity.amount).toLocaleString()}
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-1.5 opacity-40">
                                                    <Hash className="w-2.5 h-2.5 text-gray-400" />
                                                    <span className="text-[8px] font-black text-gray-400 uppercase tracking-[0.2em]">Atomic Settlement</span>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Precision Protocol Tag */}
            <div className="flex items-center justify-between px-8 py-4 bg-gray-50/50 rounded-2xl border border-gray-100/50 opacity-60">
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.3em]">Institutional Verification v4.0 • Atomic Trace Active</p>
                <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Real-Time Ledger Sync</span>
                </div>
            </div>
        </div>
    );
}
