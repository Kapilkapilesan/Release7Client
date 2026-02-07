'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { TrendingUp, User, X, Calendar, Download, RefreshCcw, AlertTriangle, ArrowRight, Calculator, DollarSign, Clock, Info } from 'lucide-react';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { toast } from 'react-toastify';
import { Investment } from '../../types/investment.types';
import { colors } from '@/themes/colors';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    investment: Investment | null;
}

export function InvestmentDetailModal({ isOpen, onClose, investment }: Props) {
    const [mounted, setMounted] = useState(false);
    const [isPreviewing, setIsPreviewing] = useState(false);
    const [returnPreview, setReturnPreview] = useState<any>(null);
    const [isLoadingPreview, setIsLoadingPreview] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showRenewConfirm, setShowRenewConfirm] = useState(false);
    const [showReturnConfirm, setShowReturnConfirm] = useState(false);
    const [breakReason, setBreakReason] = useState('');

    useEffect(() => {
        setMounted(true);
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            setIsPreviewing(false);
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen || !investment || !mounted) return null;

    const handlePreviewReturn = async () => {
        setIsLoadingPreview(true);
        setIsPreviewing(true);
        try {
            const data = await import('../../services/investment.service').then(m => m.investmentService.previewReturn(investment.id));
            setReturnPreview(data);
        } catch (error) {
            console.error(error);
            toast.error('Failed to calculate return preview');
        } finally {
            setIsLoadingPreview(false);
        }
    };

    const handleConfirmReturn = async () => {
        setIsSubmitting(true);
        try {
            await import('../../services/investment.service').then(m =>
                m.investmentService.initiatePayout(investment.id, returnPreview.status === 'MATURITY' ? 'MATURITY' : 'EARLY_BREAK', breakReason)
            );
            toast.success('Return request initiated successfully! It now requires approval.');
            onClose();
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setIsSubmitting(false);
            setShowReturnConfirm(false);
        }
    };

    const handleRenew = async () => {
        setIsSubmitting(true);
        try {
            await import('../../services/investment.service').then(m => m.investmentService.renewInvestment(investment.id));
            toast.success('Investment renewed successfully!');
            onClose();
        } catch (error: any) {
            toast.error(error.message || 'Renewal failed');
        } finally {
            setIsSubmitting(false);
            setShowRenewConfirm(false);
        }
    };

    const modalContent = (
        <div className="fixed inset-0 z-[9999] overflow-y-auto flex items-start justify-center p-4 sm:p-10 md:p-16">
            {/* Backdrop: Transparent & Lighter */}
            <div
                className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal Body: Bit Small (max-w-5xl) & Correct Scroll */}
            <div
                className={`bg-white shadow-2xl relative animate-in fade-in zoom-in duration-300 w-full overflow-hidden z-10 rounded-[2rem]
                    ${isPreviewing ? 'max-w-xl' : 'max-w-5xl'}
                `}
            >
                {isPreviewing ? (
                    /* Preview Return View */
                    <div className="p-8 space-y-6">
                        <div className="flex items-center justify-between border-b pb-4">
                            <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">
                                <Calculator className="w-6 h-6 text-red-600" />
                                Return Settlement Preview
                            </h2>
                            <button onClick={() => setIsPreviewing(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {isLoadingPreview ? (
                            <div className="py-12 text-center">
                                <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                                <p className="font-bold text-gray-500">Calculating yields from snapshot...</p>
                            </div>
                        ) : returnPreview && (
                            <div className="space-y-6">
                                <div className={`p-6 rounded-2xl border flex flex-col items-center ${returnPreview.is_early_break
                                    ? 'bg-red-50 border-red-100'
                                    : 'bg-emerald-50 border-emerald-100'
                                    }`}>
                                    <p className={`text-xs font-black uppercase tracking-widest mb-1 ${returnPreview.is_early_break ? 'text-red-400' : 'text-emerald-400'
                                        }`}>Total Payout Amount</p>
                                    <div className="flex items-end gap-2">
                                        <span className={`text-sm font-bold mb-1 ${returnPreview.is_early_break ? 'text-red-300' : 'text-emerald-300'
                                            }`}>LKR</span>
                                        <span className={`text-4xl font-black ${returnPreview.is_early_break ? 'text-red-600' : 'text-emerald-600'
                                            }`}>
                                            {Number(returnPreview.total_payout).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                        </span>
                                    </div>
                                    <span className={`mt-2 px-3 py-1 text-white text-[10px] font-black rounded-full uppercase ${returnPreview.is_early_break ? 'bg-red-600' : 'bg-emerald-600'
                                        }`}>
                                        {returnPreview.badge}
                                    </span>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                                        <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Principal Invested</p>
                                        <p className="text-base font-black text-gray-900">LKR {Number(returnPreview.principal).toLocaleString()}</p>
                                    </div>
                                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                                        <div className="flex justify-between items-start mb-1">
                                            <p className="text-[10px] font-black text-gray-400 uppercase truncate mr-2">Interest Payable Today</p>
                                            <span className="text-[10px] font-bold text-gray-500 bg-gray-200 px-1.5 rounded">{returnPreview.interest_rate_used}%</span>
                                        </div>
                                        <p className={`text-base font-black ${returnPreview.interest_payable_today > 0 ? 'text-emerald-600' : 'text-gray-900'}`}>
                                            LKR {Number(returnPreview.interest_payable_today || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                        </p>
                                    </div>

                                    {/* CLAWBACK BREAKDOWN - Only for Monthly Early Break */}
                                    {returnPreview.payout_type === 'MONTHLY' && returnPreview.is_early_break && (
                                        <div className="p-4 bg-red-50 rounded-xl border border-red-200 col-span-1 md:col-span-2">
                                            <div className="flex justify-between items-center mb-3">
                                                <p className="text-[10px] font-black text-red-600 uppercase">Clawback Calculation</p>
                                                <div className="flex items-center gap-1.5 px-2 py-0.5 bg-red-100 rounded text-[9px] font-bold text-red-700 uppercase">
                                                    <AlertTriangle className="w-3 h-3" /> Penalty Applied
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <div className="flex justify-between text-[11px] font-medium text-gray-600">
                                                    <span>Interest Already Paid (at {returnPreview.normal_rate}% normal rate)</span>
                                                    <span>LKR {Number(returnPreview.interest_already_paid).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                                                </div>
                                                <div className="flex justify-between text-[11px] font-medium text-emerald-600">
                                                    <span>Allowed Interest (at {returnPreview.break_rate}% break rate)</span>
                                                    <span>- LKR {Number(returnPreview.allowed_interest).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                                                </div>
                                                <div className="pt-2 border-t border-red-200 flex justify-between text-sm font-black text-red-700 uppercase">
                                                    <span>Overpaid Interest (Penalty)</span>
                                                    <span>LKR {Number(returnPreview.overpaid_interest).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                                                </div>
                                            </div>
                                            <div className="mt-3 pt-3 border-t border-red-200 space-y-1">
                                                <div className="flex justify-between text-xs font-bold text-gray-600">
                                                    <span>Principal</span>
                                                    <span>LKR {Number(returnPreview.principal).toLocaleString()}</span>
                                                </div>
                                                <div className="flex justify-between text-xs font-bold text-red-600">
                                                    <span>Less: Penalty Recovered</span>
                                                    <span>- LKR {Number(returnPreview.overpaid_interest).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                                                </div>
                                                <div className="flex justify-between text-sm font-black text-gray-900 pt-1 border-t border-red-200">
                                                    <span>Capital Returned</span>
                                                    <span>LKR {Number(returnPreview.capital_returned).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {returnPreview.notice && (
                                    <div className="bg-amber-50 p-4 rounded-xl border border-amber-100 flex gap-3">
                                        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                                        <p className="text-[11px] text-amber-800 font-bold leading-relaxed uppercase tracking-tight">
                                            {returnPreview.notice}
                                        </p>
                                    </div>
                                )}

                                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex gap-3">
                                    <Info className="w-5 h-5 text-blue-600 shrink-0" />
                                    <p className="text-[11px] text-blue-800 font-medium leading-relaxed">
                                        <strong>Bank Correctness Notice:</strong> This calculation uses the immutable snapshot created at the time of investment.
                                        Total term stayed: <b>{returnPreview.stayed_months} Months</b>.
                                    </p>
                                </div>

                                {/* Break Reason Field */}
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Reason for Settlement</label>
                                    <textarea
                                        className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-red-500 transition-all font-medium text-sm"
                                        placeholder="Enter the reason for breaking/settling this investment..."
                                        rows={3}
                                        value={breakReason}
                                        onChange={(e) => setBreakReason(e.target.value)}
                                    />
                                </div>

                                <div className="flex gap-4 pt-4 text-center">
                                    <button onClick={() => setIsPreviewing(false)} className="flex-1 py-4 bg-gray-100 text-gray-700 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-gray-200 transition-all">
                                        Back
                                    </button>
                                    <button
                                        onClick={() => setShowReturnConfirm(true)}
                                        disabled={isSubmitting}
                                        className="flex-1 py-4 bg-red-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-red-700 transition-all shadow-xl shadow-red-600/20 flex items-center justify-center gap-2"
                                    >
                                        {isSubmitting ? 'Processing...' : 'Request Payout'}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    /* Main Detail View - Simplified & Smaller Scaling */
                    <div className="flex flex-col">
                        {/* Header Section */}
                        <div
                            className="p-8 text-white relative flex-shrink-0"
                            style={{
                                background: `linear-gradient(135deg, ${colors.indigo[600]}, ${colors.primary[500]}, ${colors.primary[600]})`
                            }}
                        >
                            <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none">
                                <TrendingUp className="w-32 h-32" />
                            </div>

                            <div className="flex justify-between items-start mb-6 relative z-10">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-3">
                                        <span className="px-3 py-0.5 bg-white/20 backdrop-blur-md rounded-full text-[9px] font-black uppercase tracking-[0.2em] border border-white/10 text-white">
                                            {investment.snapshot_product_code}
                                        </span>
                                        <span className="px-3 py-0.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border border-white/40 bg-white/10 text-white">
                                            {investment.status}
                                        </span>
                                    </div>
                                    <h2 className="text-2xl font-black tracking-tighter">{investment.snapshot_product_name}</h2>
                                    <p className="text-white/80 flex items-center gap-2 font-bold text-xs sm:text-sm">
                                        <User className="w-4 h-4" />
                                        {investment.customer?.full_name} <span className="text-white/40">•</span> <span className="opacity-60">{investment.customer?.customer_code}</span>
                                    </p>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-2.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl transition-all group active:scale-95"
                                >
                                    <X className="w-5 h-5 transition-all group-hover:rotate-90" />
                                </button>
                            </div>

                            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10">
                                <div className="bg-white/10 backdrop-blur-2xl border border-white/20 p-5 rounded-3xl min-w-[240px] shadow-2xl">
                                    <p className="text-[9px] text-white/60 font-black uppercase tracking-widest mb-1.5">Principal Invested</p>
                                    <div className="flex items-end gap-2 text-white">
                                        <span className="text-sm font-bold opacity-40 mb-1">LKR</span>
                                        <span className="text-3xl font-black tracking-tighter">{Number(investment.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Parameters & Timeline */}
                            <div className="lg:col-span-2 space-y-8">
                                {/* Summary Cards */}
                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                    <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 shadow-sm">
                                        <p className="text-[10px] font-black text-gray-400 uppercase mb-2 flex items-center gap-1.5">
                                            <Clock className="w-3.5 h-3.5" /> Policy Term
                                        </p>
                                        <p className="text-lg font-black text-gray-900">{investment.snapshot_policy_term} <span className="text-xs font-bold text-gray-400">Months</span></p>
                                    </div>
                                    <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 shadow-sm">
                                        <p className="text-[10px] font-black text-gray-400 uppercase mb-2 flex items-center gap-1.5">
                                            <DollarSign className="w-3.5 h-3.5" /> Payout Type
                                        </p>
                                        <p className="text-lg font-black text-gray-900 capitalize">{investment.snapshot_payout_type.toLowerCase()}</p>
                                    </div>
                                    <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 shadow-sm">
                                        <p className="text-[10px] font-black text-gray-400 uppercase mb-1.5">Active Rate</p>
                                        <p className="text-xl font-black text-emerald-600">
                                            {investment.snapshot_payout_type === 'MONTHLY' ? investment.snapshot_interest_rate_monthly : investment.snapshot_interest_rate_maturity}%
                                        </p>
                                    </div>
                                    <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 shadow-sm">
                                        <p className="text-[10px] font-black text-gray-400 uppercase mb-1.5">Neg. Rate</p>
                                        <p className="text-xl font-black text-blue-600">+{investment.snapshot_negotiation_rate}%</p>
                                    </div>
                                </div>

                                {/* Yield Calculation Engine Preview */}
                                <div className="bg-white rounded-[2rem] border border-gray-100 overflow-hidden shadow-lg shadow-gray-200/20">
                                    <div className="bg-gray-50/50 px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                                        <h3 className="font-black text-gray-900 flex items-center gap-2 text-xs">
                                            <div className="p-1.5 bg-blue-100 rounded-lg">
                                                <TrendingUp className="w-4 h-4 text-blue-600" />
                                            </div>
                                            Yield Calculation Engine
                                        </h3>
                                        <div className="text-[8px] font-black bg-emerald-600 text-white px-2.5 py-1 rounded-full uppercase tracking-widest">Live Rules</div>
                                    </div>
                                    <div className="p-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="space-y-4">
                                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50 pb-2">Interest Parameters</p>
                                                <div className="space-y-3">
                                                    <div className="flex justify-between items-center text-xs font-bold text-gray-500">
                                                        <span>Normal Rate (Monthly)</span>
                                                        <span className="text-gray-900 font-black">{investment.snapshot_interest_rate_monthly}%</span>
                                                    </div>
                                                    <div className="flex justify-between items-center text-xs font-bold text-gray-500">
                                                        <span>Normal Rate (Maturity)</span>
                                                        <span className="text-gray-900 font-black">{investment.snapshot_interest_rate_maturity}%</span>
                                                    </div>
                                                    <div className="flex justify-between items-center text-xs font-bold text-violet-600 pt-2 border-t border-dashed">
                                                        <span>Negotiation Surcharge</span>
                                                        <span className="font-black">+{investment.snapshot_negotiation_rate}%</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="space-y-4">
                                                <p className="text-[9px] font-black text-red-400 uppercase tracking-widest border-b border-red-50 pb-2">Early Break Penalty</p>
                                                <div className="space-y-3">
                                                    <div className="flex justify-between items-center text-xs font-bold text-gray-500">
                                                        <span>Penalty Rate (Monthly)</span>
                                                        <span className="text-red-500 font-black">{investment.snapshot_early_break_rate_monthly}%</span>
                                                    </div>
                                                    <div className="flex justify-between items-center text-xs font-bold text-gray-500">
                                                        <span>Penalty Rate (Maturity)</span>
                                                        <span className="text-red-500 font-black">{investment.snapshot_early_break_rate_maturity}%</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Nominees */}
                                <div className="space-y-4">
                                    <h3 className="font-black text-gray-900 flex items-center gap-2 text-xs">
                                        <User className="w-4 h-4 text-violet-600" />
                                        Nominee Information
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {investment.nominees?.map((n, i) => (
                                            <div key={i} className="p-4 bg-white border border-gray-100 rounded-2xl shadow-sm">
                                                <p className="font-black text-gray-900 text-sm">{n.name}</p>
                                                <div className="flex items-center justify-between mt-1">
                                                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">NIC: {n.nic}</span>
                                                    <span className="px-2 py-0.5 bg-violet-50 text-violet-600 rounded-full text-[8px] font-black uppercase tracking-wider">{n.relationship}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Timeline & Audit */}
                            <div className="space-y-8">
                                <div
                                    className="rounded-[2rem] p-6 text-white space-y-6 shadow-xl relative overflow-hidden"
                                    style={{
                                        background: `linear-gradient(135deg, ${colors.indigo[950]}, ${colors.indigo[900]})`
                                    }}
                                >
                                    <h3 className="text-[10px] font-black uppercase tracking-[0.25em] text-indigo-300 flex items-center gap-2">
                                        <Calendar className="w-3.5 h-3.5" /> Timeline
                                    </h3>

                                    <div className="space-y-6 relative">
                                        <div className="absolute left-[9px] top-2 bottom-2 w-0.5 bg-white/10"></div>

                                        <div className="relative pl-8">
                                            <div className="absolute left-0 top-1 w-5 h-5 bg-emerald-500 rounded-full border-4 border-[#1e1b4b] flex items-center justify-center">
                                                <div className="w-1 h-1 bg-white rounded-full"></div>
                                            </div>
                                            <p className="text-[9px] font-black text-emerald-400 uppercase tracking-widest mb-0.5">Start Date</p>
                                            <p className="text-base font-black">{new Date(investment.start_date).toLocaleDateString('en-GB')}</p>
                                        </div>

                                        <div className="relative pl-8">
                                            <div className="absolute left-0 top-1 w-5 h-5 bg-white/20 rounded-full border-4 border-[#1e1b4b] flex items-center justify-center">
                                                <div className="w-1 h-1 bg-white rounded-full opacity-40"></div>
                                            </div>
                                            <p className="text-[9px] font-black text-indigo-300 uppercase tracking-widest mb-1.5">Current Progress</p>
                                            <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                                                <div
                                                    className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full"
                                                    style={{
                                                        width: `${Math.min(100, Math.max(0,
                                                            ((new Date().getTime() - new Date(investment.start_date).getTime()) /
                                                                (new Date(investment.maturity_date).getTime() - new Date(investment.start_date).getTime())) * 100
                                                        ))}%`
                                                    }}
                                                ></div>
                                            </div>
                                        </div>

                                        <div className="relative pl-8">
                                            <div className="absolute left-0 top-1 w-5 h-5 bg-rose-500 rounded-full border-4 border-[#1e1b4b] flex items-center justify-center">
                                                <div className="w-1 h-1 bg-white rounded-full"></div>
                                            </div>
                                            <p className="text-[9px] font-black text-rose-300 uppercase tracking-widest mb-0.5">Maturity Date</p>
                                            <p className="text-base font-black">{new Date(investment.maturity_date).toLocaleDateString('en-GB')}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h4 className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Security Audit</h4>
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-[10px] font-bold bg-gray-50/50 p-3 rounded-xl border border-gray-100">
                                            <span className="text-gray-400 uppercase">TX ID</span>
                                            <span className="text-gray-900 font-mono">{investment.transaction_id}</span>
                                        </div>
                                        <div className="flex justify-between text-[10px] font-bold bg-gray-50/50 p-3 rounded-xl border border-gray-100">
                                            <span className="text-gray-400 uppercase">Timestamp</span>
                                            <span className="text-gray-900">{new Date(investment.created_at).toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>

                                <button className="w-full py-4 bg-gray-900 hover:bg-black text-white rounded-2xl font-black uppercase text-[9px] tracking-widest flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg">
                                    <Download className="w-4 h-4" /> Download Certificate
                                </button>
                            </div>
                        </div>

                        {/* Footer Actions */}
                        <div className="p-6 bg-gray-50 border-t border-gray-100 flex flex-col sm:flex-row justify-end gap-3">
                            <button onClick={onClose} className="px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl font-black uppercase text-[9px] tracking-widest hover:bg-gray-100 transition-all">
                                Close Window
                            </button>
                            {(investment.status === 'ACTIVE' || investment.status === 'MATURED') && (
                                <button
                                    onClick={() => setShowRenewConfirm(true)}
                                    className="px-6 py-3 bg-blue-600 text-white rounded-xl font-black uppercase text-[9px] tracking-widest hover:bg-blue-700 transition-all shadow-lg flex items-center justify-center gap-2"
                                >
                                    <RefreshCcw className="w-3.5 h-3.5" /> Renew
                                </button>
                            )}
                            {investment.status === 'ACTIVE' && (
                                <button
                                    onClick={handlePreviewReturn}
                                    className="px-6 py-3 bg-red-600 text-white rounded-xl font-black uppercase text-[9px] tracking-widest hover:bg-red-700 transition-all shadow-lg flex items-center justify-center gap-2"
                                >
                                    <ArrowRight className="w-3.5 h-3.5 rotate-[-45deg]" /> Return
                                </button>
                            )}
                        </div>
                    </div>
                )}

                {/* Confirmation Dialogs */}
                <ConfirmDialog
                    isOpen={showRenewConfirm}
                    title="Renew Investment"
                    message="Are you sure you want to renew this investment?"
                    onConfirm={handleRenew}
                    onCancel={() => setShowRenewConfirm(false)}
                    variant="info"
                    confirmText="Renew Now"
                />

                <ConfirmDialog
                    isOpen={showReturnConfirm}
                    title="Confirm Settlement"
                    message="Are you sure you want to initiate this settlement?"
                    onConfirm={handleConfirmReturn}
                    onCancel={() => setShowReturnConfirm(false)}
                    variant="danger"
                    confirmText="Settle Now"
                />
            </div>
        </div>
    );

    return createPortal(modalContent, document.body);
}
