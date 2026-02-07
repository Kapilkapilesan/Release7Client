'use client';

import React from 'react';
import { SearchCode, WalletMinimal, CheckCircle2, Landmark, FileText } from 'lucide-react';
import { colors } from '@/themes/colors';

interface Props {
    records: any[];
    onDisburse: (record: any) => void;
}

export function LoanDisbursementTable({ records, onDisburse }: Props) {
    return (
        <div className="space-y-4">
            {/* High Density Filter Section */}
            <div className="bg-gray-50/40 p-2 rounded-2xl border border-gray-100/50 backdrop-blur-md flex flex-wrap gap-4 items-center justify-between">
                <div className="flex flex-1 min-w-[300px] items-center gap-3 bg-white px-4 py-2.5 rounded-xl shadow-sm border border-gray-100/50 focus-within:ring-4 focus-within:ring-primary-500/10 transition-all duration-300 group">
                    <SearchCode className="w-4 h-4 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                    <input
                        type="text"
                        placeholder="Search assets by application identifier or borrower..."
                        className="w-full bg-transparent outline-none text-[10px] font-black text-gray-700 placeholder:text-gray-300 uppercase tracking-[0.1em]"
                    />
                </div>
                <div className="flex items-center gap-4 px-6 border-l border-gray-200/50 text-right">
                    <div>
                        <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Active Queue</span>
                        <div className="flex items-center gap-1.5 mt-0.5 justify-end">
                            <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest">{records.filter(r => r.status === 'approved').length} Awaiting</span>
                            <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-2xl overflow-hidden shadow-[0_10px_30px_-10px_rgba(0,0,0,0.04)] border border-gray-100/50">
                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left border-separate border-spacing-0">
                        <thead>
                            <tr className="bg-gray-50/40">
                                <th className="px-6 py-4 text-[9px] font-black text-gray-500 uppercase tracking-[0.2em] border-b border-gray-100/50 whitespace-nowrap">Asset Identity</th>
                                <th className="px-6 py-4 text-[9px] font-black text-gray-500 uppercase tracking-[0.2em] border-b border-gray-100/50 whitespace-nowrap">Principal Entity</th>
                                <th className="px-6 py-4 text-[9px] font-black text-gray-500 uppercase tracking-[0.2em] border-b border-gray-100/50 whitespace-nowrap">Allocated Capital</th>
                                <th className="px-6 py-4 text-[9px] font-black text-gray-500 uppercase tracking-[0.2em] border-b border-gray-100/50 text-center whitespace-nowrap">Protocol Status</th>
                                <th className="px-6 py-4 text-[9px] font-black text-gray-500 uppercase tracking-[0.2em] border-b border-gray-100/50 text-right whitespace-nowrap">Action Control</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50/80">
                            {records.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-16 text-center bg-gray-50/20">
                                        <div className="flex flex-col items-center">
                                            <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em]">Institutional queue currently synchronized</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                records.map((record) => (
                                    <tr key={record.id} className="group hover:bg-white/40 transition-all duration-300">
                                        <td className="px-6 py-4.5">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2.5 rounded-xl bg-violet-50 text-violet-600 group-hover:bg-violet-600 group-hover:text-white transition-all duration-300 shadow-sm">
                                                    <FileText className="w-4 h-4" />
                                                </div>
                                                <div className="flex flex-col gap-1">
                                                    <code className="text-[10px] font-black text-gray-900 tracking-tighter uppercase">{record.loan_id}</code>
                                                    <div className="flex items-center gap-1.5">
                                                        <div className="w-1 h-1 rounded-full bg-gray-200 group-hover:bg-violet-400 transition-colors" />
                                                        <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">{record.SoapRefNo || 'INTERNAL-TRANS'}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4.5">
                                            <div>
                                                <p className="text-sm font-black text-gray-900 group-hover:text-primary-600 transition-colors uppercase tracking-tight leading-none mb-1.5">{record.customer?.full_name}</p>
                                                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                                                    <span className="w-2.5 h-[1px] bg-gray-200" />
                                                    {record.product?.product_name || 'Generic Asset Management'}
                                                </p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4.5">
                                            <div className="flex flex-col">
                                                <span className="text-lg font-black text-gray-900 tracking-tighter tabular-nums leading-none mb-1.5 group-hover:scale-105 origin-left transition-transform duration-300">
                                                    {parseFloat(record.approved_amount).toLocaleString()}
                                                </span>
                                                <div className="flex items-center gap-1.5 py-0.5 px-2 bg-emerald-50 rounded-lg w-fit border border-emerald-100/50 shadow-sm">
                                                    <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                                                    <span className="text-[8px] font-black text-emerald-600 uppercase tracking-widest">Authorized</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4.5 text-center">
                                            <div className="flex flex-col items-center gap-1.5">
                                                <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black border uppercase tracking-[0.15em] transition-all duration-300 shadow-sm min-w-[120px] ${record.status === 'approved'
                                                    ? 'bg-amber-50 text-amber-600 border-amber-100 shadow-amber-100/20'
                                                    : 'bg-emerald-50 text-emerald-600 border-emerald-100 shadow-emerald-100/20'
                                                    }`}>
                                                    {record.status === 'approved' ? 'Awaiting Payout' : record.status}
                                                </span>
                                                <span className="text-[8px] font-black text-gray-300 uppercase tracking-[0.2em]">Operational</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4.5 text-right">
                                            {record.status === 'approved' ? (
                                                <button
                                                    onClick={() => onDisburse(record)}
                                                    className="relative overflow-hidden group/btn px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-[9px] font-black uppercase tracking-[0.2em] shadow-lg shadow-primary-600/20 active:scale-95 transition-all flex items-center gap-3 ml-auto"
                                                >
                                                    <WalletMinimal className="w-3.5 h-3.5 relative z-10" />
                                                    <span className="relative z-10">Process Release</span>
                                                </button>
                                            ) : (
                                                <div className="inline-flex items-center gap-3 px-6 py-2.5 bg-emerald-50 text-emerald-600 rounded-xl text-[9px] font-black uppercase tracking-[0.15em] border border-emerald-100/50 shadow-inner ml-auto">
                                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                                    Finalized
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="p-5 bg-gray-50/20 border-t border-gray-100/50 rounded-b-2xl text-center">
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.3em] opacity-60">
                    Institutional asset distribution matrix synchronized
                </p>
            </div>
        </div>
    );
}
