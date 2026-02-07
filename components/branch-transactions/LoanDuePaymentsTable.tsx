'use client'

import React, { useState } from 'react';
import { User, CheckCircle, Loader2, Receipt as ReceiptIcon, Hash, ShieldCheck, Landmark, ArrowRightCircle } from 'lucide-react';
import { financeService } from '../../services/finance.service';
import { authService } from '../../services/auth.service';
import { toast } from 'react-toastify';
import { colors } from '@/themes/colors';

export function LoanDuePaymentsTable({ records, onSettled, status = 'active' }: { records: any[], onSettled: () => void, status?: 'active' | 'settled' }) {
    const [settlingId, setSettlingId] = useState<number | null>(null);

    const handleSettle = async (receiptId: number) => {
        const currentUser = authService.getCurrentUser();
        if (!currentUser) {
            toast.error("User not authenticated");
            return;
        }

        try {
            setSettlingId(receiptId);
            await financeService.settleReceipt(receiptId, currentUser.user_name);
            toast.success("Payment settled successfully");
            onSettled();
        } catch (error: any) {
            toast.error(error.message || "Failed to settle payment");
        } finally {
            setSettlingId(null);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div className="flex items-center justify-between px-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-indigo-50 border border-indigo-100 shadow-sm transition-transform hover:scale-105">
                        <Landmark className="w-5 h-5 text-indigo-600" strokeWidth={2.5} />
                    </div>
                    <div>
                        <h3 className="text-sm font-black text-gray-900 tracking-tight uppercase leading-none">
                            {status === 'active' ? 'Liquidation Queue' : 'Settlement Archives'}
                        </h3>
                        <p className="text-[9px] font-black text-gray-400 mt-1 uppercase tracking-widest leading-none">Real-time collection monitoring</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 opacity-50">
                    <div className={`w-2 h-2 rounded-full ${status === 'active' ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`} />
                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{status === 'active' ? 'Awaiting Verification' : 'Finalized History'}</span>
                </div>
            </div>

            <div className="bg-white rounded-[2rem] border border-gray-50 overflow-hidden shadow-sm">
                <div className="overflow-x-auto no-scrollbar">
                    <table className="w-full text-left border-separate border-spacing-0">
                        <thead>
                            <tr className="bg-gray-50/30">
                                <th className="px-8 py-5 text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] border-b border-gray-50">Log Identity</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] border-b border-gray-50">Personnel Focus</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] border-b border-gray-50 text-center">Protocol Context</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] border-b border-gray-50 text-right">Liquidity Amount</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] border-b border-gray-50 text-center">Finalization</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50/50">
                            {records.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-8 py-24 text-center">
                                        <div className="flex flex-col items-center justify-center uppercase">
                                            <div className="p-8 bg-gray-50 rounded-[2rem] mb-6">
                                                <ReceiptIcon size={48} className="text-gray-200" />
                                            </div>
                                            <p className="text-[10px] font-black text-gray-400 tracking-[0.4em]">No Authorized Logs Found</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                records.map((record, idx) => (
                                    <tr key={record.id || idx} className="group hover:bg-gray-50/30 transition-all duration-500 cursor-default">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center border border-gray-100 shadow-sm transition-transform group-hover:scale-110">
                                                    <ReceiptIcon className="w-5 h-5 text-indigo-500" strokeWidth={2.5} />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-black text-gray-900 uppercase tracking-tight group-hover:text-primary-600 transition-colors">
                                                        #{record.receipt_id}
                                                    </p>
                                                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mt-1 opacity-60">
                                                        {new Date(record.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="relative">
                                                    {record.staff?.avatar ? (
                                                        <img src={record.staff.avatar} className="w-10 h-10 rounded-xl object-cover ring-1 ring-gray-100" alt="" />
                                                    ) : (
                                                        <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center border border-gray-100 shadow-sm">
                                                            <User className="w-5 h-5 text-gray-300" />
                                                        </div>
                                                    )}
                                                    <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white" />
                                                </div>
                                                <div>
                                                    <p className="text-xs font-black text-gray-900 uppercase tracking-tight group-hover:text-primary-600 transition-colors">
                                                        {record.staff?.full_name || record.staff?.user_name}
                                                    </p>
                                                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest opacity-60">Field Origin Trace</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex flex-col items-center gap-2">
                                                <div className="flex items-center gap-3">
                                                    <div className="text-center">
                                                        <p className="text-xs font-black text-gray-900 uppercase tracking-tight">{record.customer?.full_name}</p>
                                                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mt-0.5 opacity-60">CID-{record.customer_id}</p>
                                                    </div>
                                                    <div className="w-px h-6 bg-gray-100" />
                                                    <div className="text-center">
                                                        <p className="text-xs font-black text-gray-900 tracking-tighter">LN-{record.loan_id}</p>
                                                        <div className={`mt-0.5 px-1.5 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest ${record.loan?.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-50 text-gray-400'
                                                            }`}>
                                                            {record.loan?.status}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex flex-col items-end gap-1">
                                                <div className="flex items-baseline gap-1.5">
                                                    <span className="text-[9px] font-black text-gray-300 uppercase">LKR</span>
                                                    <p className="text-lg font-black text-gray-900 tabular-nums tracking-tighter leading-none">
                                                        {(parseFloat(record.current_due_amount || '0')).toLocaleString()}
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-1.5 opacity-40">
                                                    <ShieldCheck className="w-2.5 h-2.5 text-primary-500" />
                                                    <span className="text-[8px] font-black text-gray-400 uppercase tracking-[0.2em]">Atomic Verification</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            {status === 'active' ? (
                                                <button
                                                    onClick={() => handleSettle(record.id)}
                                                    disabled={settlingId === record.id}
                                                    className="group/btn relative w-full flex items-center justify-center gap-3 px-6 py-3 bg-white border border-emerald-100 rounded-xl text-emerald-600 text-[10px] font-black uppercase tracking-[0.2em] transition-all hover:bg-emerald-600 hover:text-white hover:shadow-xl hover:shadow-emerald-500/20 active:scale-95 disabled:opacity-50"
                                                >
                                                    {settlingId === record.id ? (
                                                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                                    ) : (
                                                        <ArrowRightCircle className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-1" />
                                                    )}
                                                    {settlingId === record.id ? 'Syncing...' : 'Settle'}
                                                </button>
                                            ) : (
                                                <div className="flex items-center justify-center gap-2 text-emerald-600 bg-emerald-50/50 px-4 py-2 rounded-xl border border-emerald-100 w-fit mx-auto shadow-sm">
                                                    <CheckCircle size={12} strokeWidth={3} />
                                                    <span className="text-[9px] font-black uppercase tracking-widest">Finalized</span>
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

            {/* Protocol Tag */}
            <div className="flex items-center justify-end gap-6 px-12 opacity-30">
                <p className="text-[7px] font-black text-gray-400 uppercase tracking-[0.6em]">System Protocol Finalization x2.41</p>
                <div className="flex gap-1">
                    {[1, 2, 3, 4].map(i => <div key={i} className="w-1 h-1 rounded-full bg-indigo-500" />)}
                </div>
            </div>
        </div>
    );
}
