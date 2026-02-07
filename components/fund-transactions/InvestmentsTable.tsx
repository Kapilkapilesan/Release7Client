'use client';

import React from 'react';
import { User, ShieldCheck } from 'lucide-react';
import { colors } from '@/themes/colors';

interface ShareholderRecord {
    id: string | number;
    name: string;
    total_investment: number;
    nic?: string;
}

export function ShareholdersTable({ records }: { records: ShareholderRecord[] }) {
    return (
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100/50">
            <div className="p-5 border-b border-gray-50 flex items-center justify-between bg-white">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-primary-50">
                        <User className="w-4 h-4 text-primary-600" />
                    </div>
                    <div>
                        <h3 className="text-lg font-black text-gray-900 tracking-tight uppercase">Capital Structure</h3>
                        <p className="text-[9px] text-gray-400 font-bold tracking-[0.2em] uppercase mt-0.5">Shareholder Equity Matrix</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 rounded-lg border border-emerald-100">
                    <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest leading-none">Persistent</span>
                </div>
            </div>

            <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full text-left border-separate border-spacing-0">
                    <thead>
                        <tr className="bg-gray-50/30">
                            <th className="px-6 py-4 text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-50">Identity</th>
                            <th className="px-6 py-4 text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-50">NIC / Identifier</th>
                            <th className="px-6 py-4 text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-50">Allocation</th>
                            <th className="px-6 py-4 text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-50 text-right">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {records.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="px-6 py-16 text-center">
                                    <div className="flex flex-col items-center">
                                        <div className="w-14 h-14 bg-gray-50 rounded-xl flex items-center justify-center mb-4 border border-gray-100 shadow-inner">
                                            <User className="w-7 h-7 text-gray-200" />
                                        </div>
                                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">No shareholders record found</p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            records.map((record) => (
                                <tr key={record.id} className="group hover:bg-gray-50/50 transition-all duration-300">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div
                                                className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-white text-[10px] shadow-md transition-all duration-500 group-hover:rotate-3"
                                                style={{
                                                    background: `linear-gradient(135deg, ${colors.primary[600]}, ${colors.primary[700]})`,
                                                    boxShadow: `0 6px 12px ${colors.primary[600]}15`
                                                }}
                                            >
                                                {record.name.charAt(0)}
                                            </div>
                                            <p className="text-sm font-black text-gray-900 group-hover:text-primary-600 transition-colors uppercase tracking-tight">{record.name}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-[9px] font-black text-gray-400 font-mono tracking-widest uppercase">{record.nic || 'UNSPECIFIED'}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-black text-gray-900 tabular-nums tracking-tighter">
                                                Rs. {Number(record.total_investment).toLocaleString()}
                                            </span>
                                            <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Active Capital</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <span className="inline-flex items-center px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[8px] font-black uppercase tracking-widest border border-emerald-100/30">
                                            Active Tier
                                        </span>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <div className="p-4 bg-gray-50/30 border-t border-gray-50">
                <p className="text-[8px] font-black text-gray-300 uppercase tracking-[0.3em] text-center">
                    Shareholder distribution matrix verified by internal audit
                </p>
            </div>
        </div>
    );
}
