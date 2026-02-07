'use client';

import React, { useState } from 'react';
import { X, ShieldCheck, AlertCircle, CheckCircle2, Landmark, WalletMinimal, ExternalLink, Info } from 'lucide-react';
import { colors } from '@/themes/colors';

interface PayoutModalProps {
    isOpen: boolean;
    onClose: () => void;
    recipientName: string;
    amount: number;
    bankDetails?: {
        bankName: string;
        accountNumber: string;
    };
    onConfirm: (refNo: string, remark: string) => void;
    isProcessing?: boolean;
}

export function PayoutModal({ isOpen, onClose, recipientName, amount, bankDetails, onConfirm, isProcessing = false }: PayoutModalProps) {
    const [step, setStep] = useState(1);
    const [refNo, setRefNo] = useState('');
    const [remark, setRemark] = useState('');

    if (!isOpen) return null;

    const handleNext = () => {
        window.open('https://www.seylanbank.lk/corporate/login', '_blank');
        setStep(2);
    };

    const handleConfirm = () => {
        onConfirm(refNo, remark);
        setStep(1);
        setRefNo('');
        setRemark('');
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-xl animate-in fade-in duration-300">
            <div className="bg-white rounded-2xl shadow-[0_15px_50px_-15px_rgba(0,0,0,0.2)] max-w-[440px] w-full overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-5 duration-500 border border-gray-100">
                {/* Precision Tool Header */}
                <div className="p-5 pb-1.5 flex items-center justify-between bg-gray-50/30">
                    <div className="flex items-center gap-3">
                        <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg transition-transform"
                            style={{
                                background: `linear-gradient(135deg, ${colors.primary[600]}, ${colors.primary[700]})`,
                                boxShadow: `0 6px 12px ${colors.primary[600]}25`
                            }}
                        >
                            <ShieldCheck className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-base font-black text-gray-900 tracking-tight uppercase leading-none">Capital Settlement</h3>
                            <div className="flex items-center gap-2.5 mt-2.5">
                                <div className="flex gap-1">
                                    <div className={`h-1 rounded-full transition-all duration-500 ${step === 1 ? 'bg-primary-600 w-10' : 'bg-gray-200 w-3'}`} />
                                    <div className={`h-1 rounded-full transition-all duration-500 ${step === 2 ? 'bg-primary-600 w-10' : 'bg-gray-200 w-3'}`} />
                                </div>
                                <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Protocol Stage 0{step} / 02</span>
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-all group"
                    >
                        <X className="w-4 h-4 text-gray-400 group-hover:text-gray-900" />
                    </button>
                </div>

                <div className="p-5">
                    {step === 1 ? (
                        <div className="space-y-5">
                            <div className="bg-gray-50/50 rounded-xl p-5 border border-gray-100 relative overflow-hidden group">
                                <div className="absolute -top-6 -right-6 opacity-5">
                                    <Landmark className="w-24 h-24 text-primary-600" />
                                </div>
                                <div className="relative z-10 flex flex-col gap-4">
                                    <div>
                                        <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1 opacity-80">Authorized Recipient</p>
                                        <p className="text-sm font-black text-gray-900 uppercase tracking-tight leading-none">{recipientName}</p>
                                    </div>
                                    <div className="h-px bg-gray-200/50 w-full" />
                                    <div>
                                        <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1 opacity-80">Capital Allocation</p>
                                        <div className="flex items-baseline gap-1.5">
                                            <span className="text-xl font-black text-gray-900 tracking-tighter tabular-nums">
                                                {amount.toLocaleString()}
                                            </span>
                                            <span className="text-[8px] font-black text-primary-500 uppercase tracking-widest bg-primary-50 px-1.5 py-0.5 rounded-md border border-primary-100/30">LKR Total</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-amber-50/30 rounded-lg p-3.5 border border-amber-100/50 flex gap-3">
                                <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0" />
                                <div className="flex-1">
                                    <h4 className="text-[9px] font-black text-amber-900 uppercase tracking-widest mb-0.5 flex items-center gap-1.5 leading-none">
                                        Verification Layer
                                        <div className="w-1 h-1 rounded-full bg-amber-500 animate-pulse" />
                                    </h4>
                                    <p className="text-[8px] font-bold text-amber-800/60 uppercase leading-relaxed tracking-wider">
                                        Initiate banking terminal. Reference token is mandatory for finality.
                                    </p>
                                </div>
                            </div>

                            <button
                                onClick={handleNext}
                                className="relative overflow-hidden w-full py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-2.5 transition-all shadow-md active:scale-[0.98] group"
                            >
                                <span className="relative z-10">Initiate & Open Terminal</span>
                                <ExternalLink className="w-3.5 h-3.5 relative z-10" />
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-5 animate-in slide-in-from-right-10 duration-500">
                            <div className="bg-primary-50/10 rounded-xl p-5 border border-primary-100/20 relative overflow-hidden">
                                <div className="flex justify-between items-start mb-4 border-b border-primary-100/10 pb-4">
                                    <div className="space-y-1.5">
                                        <p className="text-[8px] font-black text-primary-500 uppercase tracking-widest opacity-60">Recipient</p>
                                        <p className="text-sm font-black text-gray-900 uppercase tracking-tight leading-none">{recipientName}</p>
                                    </div>
                                    <div className="text-right space-y-1.5">
                                        <p className="text-[8px] font-black text-primary-500 uppercase tracking-widest opacity-60">Settlement</p>
                                        <p className="text-xl font-black text-primary-600 tracking-tighter tabular-nums leading-none">{amount.toLocaleString()}</p>
                                    </div>
                                </div>

                                {bankDetails && (
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Bank</p>
                                            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white rounded-lg border border-gray-100 w-fit">
                                                <Landmark className="w-3 h-3 text-primary-500" />
                                                <p className="text-[9px] font-black text-gray-900 uppercase tracking-tight">{bankDetails.bankName}</p>
                                            </div>
                                        </div>
                                        <div className="space-y-1.5 text-right">
                                            <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Account Registry</p>
                                            <p className="text-[9px] font-black text-gray-900 font-mono tracking-widest bg-white px-2.5 py-1 rounded-lg border border-gray-100 select-all">
                                                {bankDetails.accountNumber}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-[8px] font-black text-primary-600 uppercase tracking-widest ml-1">
                                        <Info className="w-3 h-3" />
                                        Terminal Reference Token
                                    </label>
                                    <input
                                        type="text"
                                        value={refNo}
                                        onChange={(e) => setRefNo(e.target.value)}
                                        placeholder="EX: SEB-TRS-PROTOCOL-998"
                                        className="w-full px-4 py-2.5 bg-gray-50 border-gray-100 border rounded-xl focus:border-primary-500 focus:bg-white outline-none transition-all font-black text-[12px] text-gray-900 uppercase tracking-widest placeholder:text-gray-200"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[8px] font-black text-gray-400 uppercase tracking-widest ml-1 block">
                                        Audit Registry Commentary
                                    </label>
                                    <textarea
                                        value={remark}
                                        onChange={(e) => setRemark(e.target.value)}
                                        placeholder="Enter institutional remarks..."
                                        rows={1}
                                        className="w-full px-4 py-2.5 bg-gray-50 border-gray-100 border rounded-xl focus:border-primary-500 focus:bg-white outline-none transition-all font-bold text-[11px] text-gray-600 resize-none min-h-[44px]"
                                    ></textarea>
                                </div>
                            </div>

                            <div className="flex gap-3 pt-1">
                                <button
                                    onClick={() => setStep(1)}
                                    className="flex-1 py-3 bg-gray-50 hover:bg-gray-100 text-gray-400 hover:text-gray-900 rounded-xl font-black text-[9px] uppercase tracking-widest transition-all active:scale-[0.95]"
                                >
                                    Back
                                </button>
                                <button
                                    onClick={handleConfirm}
                                    disabled={!refNo || isProcessing}
                                    className="flex-[2] relative overflow-hidden py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-100 disabled:text-gray-300 text-white rounded-xl font-black text-[10px] uppercase tracking-[0.2em] transition-all shadow-md active:scale-[0.98] flex items-center justify-center gap-2 group"
                                >
                                    {isProcessing ? (
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            <span className="relative z-10">Finalize Settlement</span>
                                            <CheckCircle2 className="w-3.5 h-3.5 relative z-10" />
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                <div className="px-5 py-3 bg-gray-50/50 border-t border-gray-100 text-center">
                    <p className="text-[8px] font-black text-gray-300 uppercase tracking-[0.5em] opacity-60">
                        Operational Finality v4.8 • Core Protocol
                    </p>
                </div>
            </div>
        </div>
    );
}
