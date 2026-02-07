'use client';

import React from 'react';
import { DollarSign, User, CheckCircle2, Landmark } from 'lucide-react';
import { colors } from '@/themes/colors';

interface StaffLoanDisbursementTableProps {
    records: any[];
    onDisburse: (record: any) => void;
}

export function StaffLoanDisbursementTable({ records, onDisburse }: StaffLoanDisbursementTableProps) {
    if (!records || records.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 bg-gray-50/20 rounded-2xl border border-gray-100/50">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-xl border border-gray-50">
                    <User className="w-8 h-8 text-gray-100" />
                </div>
                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">No Pending Internal Disbursements</h3>
                <p className="text-[8px] text-gray-300 font-bold uppercase tracking-widest mt-2">Corporate resource allocation is synchronized</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="bg-white rounded-2xl overflow-hidden shadow-[0_10px_30px_-10px_rgba(0,0,0,0.04)] border border-gray-100/50">
                <div className="p-5 border-b border-gray-50/80 flex items-center justify-between bg-gray-50/20">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-violet-600 flex items-center justify-center shadow-lg shadow-violet-600/20">
                            <Landmark className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h3 className="text-lg font-black text-gray-900 tracking-tight uppercase leading-none">Internal Capital Release</h3>
                            <p className="text-[9px] text-gray-400 font-bold tracking-[0.2em] uppercase mt-1.5">Institutional Resource Allocation</p>
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left border-separate border-spacing-0">
                        <thead>
                            <tr className="bg-gray-50/40">
                                <th className="px-6 py-4 text-[9px] font-black text-gray-500 uppercase tracking-[0.2em] border-b border-gray-100/50 whitespace-nowrap">Principal Staff Member</th>
                                <th className="px-6 py-4 text-[9px] font-black text-gray-500 uppercase tracking-[0.2em] border-b border-gray-100/50 whitespace-nowrap">Asset Purpose</th>
                                <th className="px-6 py-4 text-[9px] font-black text-gray-500 uppercase tracking-[0.2em] border-b border-gray-100/50 text-right whitespace-nowrap">Capital Volume</th>
                                <th className="px-6 py-4 text-[9px] font-black text-gray-500 uppercase tracking-[0.2em] border-b border-gray-100/50 text-center whitespace-nowrap">Registry Status</th>
                                <th className="px-6 py-4 text-[9px] font-black text-gray-500 uppercase tracking-[0.2em] border-b border-gray-100/50 text-right whitespace-nowrap">Control</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50/80">
                            {records.map((record) => (
                                <tr key={record.id} className="group hover:bg-white/40 transition-all duration-300">
                                    <td className="px-6 py-4">
                                        <div>
                                            <p className="text-sm font-black text-gray-900 group-hover:text-primary-600 transition-colors uppercase tracking-tight leading-none mb-1">{record.staff?.full_name}</p>
                                            <div className="flex items-center gap-1.5">
                                                <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest bg-gray-50 px-1.5 py-0.5 rounded border border-gray-100/50 transition-colors">{record.staff?.staff_id}</span>
                                                <span className="text-[8px] font-bold text-gray-300">•</span>
                                                <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">{record.staff?.branch?.branch_name}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col gap-1.5">
                                            <p className="text-[10px] font-black text-gray-700 uppercase tracking-tight leading-none group-hover:text-primary-600 transition-colors">{record.purpose}</p>
                                            <div className="flex items-center gap-1.5 px-2 py-0.5 bg-violet-50 rounded-md border border-violet-100/30 w-fit">
                                                <span className="text-[8px] font-black text-violet-600 uppercase tracking-widest">TERM: {record.loan_duration} MONTHS</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex flex-col items-end">
                                            <span className="text-lg font-black text-gray-900 tracking-tighter tabular-nums leading-none mb-1 group-hover:scale-105 transition-transform duration-300 origin-right">
                                                {Number(record.amount).toLocaleString()}
                                            </span>
                                            <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest bg-gray-50 px-1.5 py-0.5 rounded-md">Principal</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="flex flex-col items-center">
                                            <span className={`px-3 py-1.5 rounded-xl text-[9px] font-black border uppercase tracking-[0.1em] transition-all duration-300 shadow-sm min-w-[100px] ${record.status === 'disbursed'
                                                ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                                                : 'bg-amber-50 text-amber-600 border-amber-100 animate-pulse'
                                                }`}>
                                                {record.status}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        {record.status === 'disbursed' ? (
                                            <div className="inline-flex items-center gap-2 px-6 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-[9px] font-black uppercase tracking-[0.15em] border border-emerald-100/50 shadow-inner ml-auto">
                                                <CheckCircle2 className="w-3.5 h-3.5" />
                                                Authorized
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => onDisburse(record)}
                                                className="relative overflow-hidden group/btn px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-[9px] font-black uppercase tracking-[0.15em] shadow-lg active:scale-95 transition-all flex items-center gap-2 ml-auto"
                                            >
                                                <DollarSign className="w-3.5 h-3.5 relative z-10" />
                                                <span className="relative z-10">Process Release</span>
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="p-4 bg-gray-50/20 border-t border-gray-100/50 rounded-b-2xl text-center">
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.3em] opacity-60">
                    Internal asset registry synchronized
                </p>
            </div>
        </div>
    );
}
