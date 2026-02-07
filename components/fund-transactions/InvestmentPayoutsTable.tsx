'use client';

import React from 'react';
import { Search, WalletMinimal, CheckCircle2, DollarSign, Landmark, TrendingUp, TrendingDown, Clock, SearchCode } from 'lucide-react';
import { colors } from '@/themes/colors';

interface InvestmentPayout {
    id: number;
    investment_id: number;
    payout_type: 'MONTHLY_INTEREST' | 'MATURITY' | 'EARLY_BREAK';
    principal_amount: number;
    interest_amount: number;
    penalty_amount: number;
    total_payout: number;
    status: 'PENDING' | 'APPROVED' | 'PAID';
    investment?: {
        transaction_id: string;
        customer?: {
            full_name: string;
        };
        product?: {
            name: string;
        };
    };
    remarks?: string;
    created_at: string;
}

interface Props {
    records: InvestmentPayout[];
    onDisburse: (record: any) => void;
    onSettle: (id: number) => void;
}

export function InvestmentPayoutsTable({ records, onDisburse, onSettle }: Props) {
    const [searchTerm, setSearchTerm] = React.useState('');

    const filteredRecords = records.filter(p =>
        p.investment?.transaction_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.investment?.customer?.full_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-4">
            {/* High Density Filter Section */}
            <div className="bg-gray-50/40 p-2 rounded-2xl border border-gray-100/50 backdrop-blur-md flex flex-wrap gap-4 items-center justify-between">
                <div className="flex flex-1 min-w-[300px] items-center gap-3 bg-white px-4 py-2.5 rounded-xl shadow-sm border border-gray-100/50 focus-within:ring-4 focus-within:ring-primary-500/10 transition-all duration-50 group">
                    <SearchCode className="w-4 h-4 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                    <input
                        type="text"
                        placeholder="Search investment returns by asset identifier or investor name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-transparent outline-none text-[10px] font-black text-gray-700 placeholder:text-gray-300 uppercase tracking-[0.1em]"
                    />
                </div>
                <div className="flex items-center gap-4 px-6 border-l border-gray-200/50">
                    <div className="flex flex-col items-end">
                        <span className="text-[9px] font-black text-gray-400 uppercase tracking-[0.15em]">Investment Return Registry</span>
                        <div className="flex items-center gap-1.5 mt-0.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                            <span className="text-[8px] font-black text-indigo-600 uppercase tracking-widest">Active Sync</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-2xl overflow-hidden shadow-[0_10px_30px_-10px_rgba(0,0,0,0.04)] border border-gray-100/50">
                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left border-separate border-spacing-0">
                        <thead>
                            <tr className="bg-gray-50/40">
                                <th className="px-4 py-4 text-[9px] font-black text-gray-500 uppercase tracking-[0.2em] border-b border-gray-100/50 whitespace-nowrap">Asset Payout</th>
                                <th className="px-4 py-4 text-[9px] font-black text-gray-500 uppercase tracking-[0.2em] border-b border-gray-100/50 whitespace-nowrap">Entity / Investor</th>
                                <th className="px-4 py-4 text-[9px] font-black text-gray-500 uppercase tracking-[0.2em] border-b border-gray-100/50 whitespace-nowrap">Settlement Reason</th>
                                <th className="px-4 py-4 text-[9px] font-black text-gray-500 uppercase tracking-[0.2em] border-b border-gray-100/50 text-right whitespace-nowrap">Return Architecture</th>
                                <th className="px-4 py-4 text-[9px] font-black text-gray-500 uppercase tracking-[0.2em] border-b border-gray-100/50 text-right whitespace-nowrap">Disbursement</th>
                                <th className="px-4 py-4 text-[9px] font-black text-gray-500 uppercase tracking-[0.2em] border-b border-gray-100/50 text-center whitespace-nowrap">Lifecycle</th>
                                <th className="px-4 py-4 text-[9px] font-black text-gray-500 uppercase tracking-[0.2em] border-b border-gray-100/50 text-right whitespace-nowrap">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50/80">
                            {filteredRecords.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-20 text-center bg-gray-50/20">
                                        <div className="flex flex-col items-center">
                                            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-4 shadow-xl border border-gray-50">
                                                <Landmark className="w-8 h-8 text-gray-100" />
                                            </div>
                                            <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em]">No pending liquidity events</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredRecords.map((record) => (
                                    <tr key={record.id} className="group hover:bg-white/40 transition-all duration-300">
                                        <td className="px-4 py-4">
                                            <div className="flex flex-col gap-2">
                                                <div className="flex items-center gap-1.5">
                                                    <code className="text-[8px] font-black text-primary-600 bg-primary-50 px-2 py-0.5 rounded border border-primary-100/50 group-hover:bg-primary-600 group-hover:text-white transition-all duration-300 w-fit tracking-tighter uppercase shadow-sm">
                                                        {record.investment?.transaction_id}
                                                    </code>
                                                </div>
                                                <div className="flex items-center gap-1 px-1.5 py-0.5 bg-gray-50/80 rounded w-fit group-hover:bg-white transition-colors">
                                                    <DollarSign className="w-2.5 h-2.5 text-primary-500" />
                                                    <span className="text-[7px] font-black text-gray-900 uppercase tracking-widest leading-none">
                                                        {record.payout_type.replace(/_/g, ' ')}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 text-left">
                                            <div>
                                                <p className="text-xs font-black text-gray-900 group-hover:text-primary-600 transition-colors uppercase tracking-tight leading-none mb-1">{record.investment?.customer?.full_name}</p>
                                                <div className="flex items-center gap-1.5 px-1.5 py-0.5 bg-gray-50 rounded border border-gray-100/50 w-fit">
                                                    <Landmark className="w-2.5 h-2.5 text-gray-400" />
                                                    <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">{record.investment?.product?.name || 'Asset Account'}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4">
                                            {record.remarks ? (
                                                <div className="group/reason relative min-w-[120px]">
                                                    <p className="text-[10px] font-bold text-gray-500 leading-relaxed line-clamp-2 italic">
                                                        "{record.remarks}"
                                                    </p>
                                                    <div className="absolute bottom-full left-0 mb-2 hidden group-hover/reason:block z-50">
                                                        <div className="bg-gray-900 text-white text-[10px] p-3 rounded-xl shadow-xl max-w-xs leading-relaxed font-medium">
                                                            {record.remarks}
                                                            <div className="absolute top-full left-4 border-8 border-transparent border-t-gray-900" />
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest">No Remarks</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-4 text-right">
                                            <div className="flex flex-col gap-1.5">
                                                <div className="flex items-center justify-end gap-2 text-gray-500 group-hover:text-gray-900 transition-colors">
                                                    <span className="text-[8px] font-black uppercase tracking-[0.15em] opacity-40">Principal</span>
                                                    <span className="text-[10px] font-black tabular-nums tracking-tighter">{Number(record.principal_amount).toLocaleString()}</span>
                                                </div>
                                                <div className="flex items-center justify-end gap-1.5 text-emerald-600 py-0.5 px-1.5 bg-emerald-50 rounded-lg w-fit ml-auto border border-emerald-100/30">
                                                    <TrendingUp className="w-2.5 h-2.5" />
                                                    <span className="text-[8px] font-black uppercase tracking-[0.15em]">Return</span>
                                                    <span className="text-[10px] font-black tabular-nums tracking-tighter">+ {Number(record.interest_amount).toLocaleString()}</span>
                                                </div>
                                                {Number(record.penalty_amount) > 0 && (
                                                    <div className="flex items-center justify-end gap-1.5 text-rose-500 py-0.5 px-1.5 bg-rose-50 rounded-lg w-fit ml-auto border border-rose-100/30">
                                                        <TrendingDown className="w-2.5 h-2.5" />
                                                        <span className="text-[8px] font-black uppercase tracking-[0.15em]">Penalty</span>
                                                        <span className="text-[10px] font-black tabular-nums tracking-tighter">- {Number(record.penalty_amount).toLocaleString()}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 text-right">
                                            <div className="flex flex-col items-end">
                                                <span className="text-[8px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1 opacity-60">Total Payable</span>
                                                <span className="text-lg font-black text-gray-900 tracking-tighter tabular-nums leading-none mb-1.5 group-hover:scale-105 origin-right transition-transform duration-500">
                                                    {Number(record.total_payout).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                                </span>
                                                <div className="flex items-center gap-1 px-1.5 py-0.5 bg-gray-50 rounded border border-gray-100 shadow-inner">
                                                    <span className="text-[7px] font-black text-primary-600 uppercase tracking-widest">LKR Net</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 text-center">
                                            <div className="flex flex-col items-center gap-1.5">
                                                <span className={`px-3 py-1 rounded-lg text-[8px] font-black border uppercase tracking-[0.15em] transition-all duration-300 shadow-sm min-w-[80px] ${record.status === 'PAID'
                                                    ? 'bg-emerald-50 text-emerald-600 border-emerald-100 shadow-emerald-100/20'
                                                    : record.status === 'PENDING'
                                                        ? 'bg-amber-50 text-amber-600 border-amber-100 shadow-amber-100/20 animate-pulse'
                                                        : 'bg-indigo-50 text-indigo-600 border-indigo-100 shadow-indigo-100/20'
                                                    }`}>
                                                    {record.status}
                                                </span>
                                                <div className="flex items-center gap-1 px-1.5 py-0.5 bg-gray-50 rounded group-hover:bg-white transition-colors">
                                                    <Clock className="w-2 h-2 text-gray-300" />
                                                    <p className="text-[7px] font-black text-gray-400 uppercase tracking-widest">{new Date(record.created_at).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 text-right">
                                            <div className="flex justify-end">
                                                {record.status !== 'PAID' ? (
                                                    <button
                                                        onClick={() => onDisburse(record)}
                                                        className={`relative overflow-hidden group/btn px-4 py-2 rounded-lg text-[8px] font-black uppercase tracking-[0.2em] text-white transition-all shadow-lg active:scale-95 flex items-center gap-2 ${record.status === 'PENDING'
                                                            ? 'bg-primary-600 hover:bg-primary-700 shadow-primary-600/20'
                                                            : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/20'
                                                            }`}
                                                    >
                                                        <WalletMinimal className="w-3 h-3 relative z-10" />
                                                        <span className="relative z-10">Pay Return</span>
                                                    </button>
                                                ) : (
                                                    <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-lg text-[8px] font-black uppercase tracking-[0.15em] border border-emerald-100/50 shadow-inner group-hover:bg-emerald-50 transition-colors">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                                        Finalized
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="p-5 bg-gray-50/20 border-t border-gray-100/50 rounded-b-2xl text-center">
                <div className="flex flex-col items-center gap-3">
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.3em] opacity-60">
                        Institutional yield distribution protocols enabled
                    </p>
                    <div className="flex gap-1.5">
                        <div className="w-1 h-1 rounded-full bg-primary-400/30" />
                        <div className="w-1 h-1 rounded-full bg-indigo-400/30" />
                        <div className="w-1 h-1 rounded-full bg-emerald-400/30" />
                    </div>
                </div>
            </div>
        </div>
    );
}
