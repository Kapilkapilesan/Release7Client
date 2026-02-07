'use client'

import React, { useState, useEffect } from 'react';
import { Wallet, Calendar, ArrowUpCircle, ArrowDownCircle, Building2, Loader2, Sparkles, Activity, FileText, ChevronDown, ShieldCheck } from 'lucide-react';
import { branchService } from '../../services/branch.service';
import { financeService } from '../../services/finance.service';
import { authService } from '../../services/auth.service';
import { Branch } from '../../types/branch.types';
import { toast } from 'react-toastify';
import { colors } from '@/themes/colors';

export function BranchActivityForm({ onSuccess }: { onSuccess: () => void }) {
    const [branches, setBranches] = useState<Branch[]>([]);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        branch_id: '',
        amount: '',
        type: 'outflow',
        expense_type: 'Other',
        medium: 'Cash',
        date: new Date().toISOString().split('T')[0],
        description: ''
    });

    useEffect(() => {
        const fetchBranches = async () => {
            try {
                const data = await branchService.getBranchesAll();
                setBranches(data);
                if (data.length > 0) {
                    setFormData(prev => ({ ...prev, branch_id: data[0].id.toString() }));
                }
            } catch (error) {
                console.error('Failed to fetch branches', error);
            }
        };
        fetchBranches();
    }, []);

    const handleSubmit = async () => {
        if (!formData.branch_id || !formData.amount || !formData.expense_type) {
            toast.error("Please fill all required fields");
            return;
        }

        const currentUser = authService.getCurrentUser();
        if (!currentUser) {
            toast.error("User not authenticated");
            return;
        }

        try {
            setSubmitting(true);
            await financeService.recordExpense({
                branch_id: parseInt(formData.branch_id),
                staff_id: currentUser.user_name,
                amount: parseFloat(formData.amount),
                type: formData.type,
                expense_type: formData.expense_type,
                medium: formData.medium,
                date: formData.date,
                description: formData.description
            });
            toast.success("Activity recorded successfully");
            setFormData(prev => ({ ...prev, amount: '', description: '' }));
            onSuccess();
        } catch (error: any) {
            toast.error(error.message || "Failed to record activity");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="bg-white/70 backdrop-blur-xl rounded-[2.5rem] border border-gray-100 p-8 shadow-2xl shadow-gray-200/50 relative overflow-hidden group">
            {/* Ambient Background branding */}
            <div className="absolute -right-20 -top-20 w-60 h-60 bg-primary-500/[0.03] rounded-full blur-[100px] pointer-events-none" />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 relative z-10">
                <div className="flex items-center gap-5">
                    <div
                        className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-xl transition-all duration-500 group-hover:rotate-6 shadow-primary-500/20"
                        style={{ background: `linear-gradient(135deg, ${colors.primary[600]}, ${colors.primary[700]})` }}
                    >
                        <Wallet className="w-7 h-7" strokeWidth={2.5} />
                    </div>
                    <div>
                        <h3 className="text-xl font-black text-gray-900 tracking-tight uppercase leading-none">
                            Entry Registration
                        </h3>
                        <div className="flex items-center gap-3 mt-2">
                            <div className="flex items-center gap-1.5 bg-primary-50/50 px-2 py-0.5 rounded-lg border border-primary-100/50">
                                <Sparkles className="w-3 h-3 text-primary-500" />
                                <span className="text-[9px] font-black text-primary-600 uppercase tracking-widest">New Protocol</span>
                            </div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Record Branch capital velocity</p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3 grayscale opacity-40">
                    <Activity size={18} className="text-primary-500" />
                    <div className="w-1 h-3 rounded-full bg-gray-200" />
                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em]">Transaction Registry Lock Active</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
                <div className="space-y-6">
                    <div className="group/field">
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2.5 ml-2">Execution Date</label>
                        <div className="relative">
                            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-300 group-focus-within/field:text-primary-500 transition-colors" />
                            <input
                                type="date"
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                className="w-full pl-12 pr-4 py-4 bg-gray-50/50 border border-gray-100 rounded-2xl text-[11px] font-black uppercase tracking-widest text-gray-900 outline-none focus:ring-4 focus:ring-primary-500/5 focus:border-primary-500/50 focus:bg-white transition-all shadow-sm"
                            />
                        </div>
                    </div>

                    <div className="group/field">
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2.5 ml-2">Capital Delta Type</label>
                        <div className="relative">
                            <select
                                value={formData.type}
                                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                className="w-full pl-6 pr-12 py-4 bg-gray-50/50 border border-gray-100 rounded-2xl text-[11px] font-black uppercase tracking-widest text-gray-900 outline-none focus:ring-4 focus:ring-primary-500/5 focus:border-primary-500/50 focus:bg-white transition-all appearance-none shadow-sm cursor-pointer"
                            >
                                <option value="inflow">Inflow (Money Received)</option>
                                <option value="outflow">Outflow (Branch Expense)</option>
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                {formData.type === 'inflow' ? <ArrowUpCircle className="w-5 h-5 text-emerald-500 shadow-sm" /> : <ArrowDownCircle className="w-5 h-5 text-rose-500 shadow-sm" />}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="group/field">
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2.5 ml-2">Expense Category</label>
                        <div className="relative">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-300 group-focus-within/field:text-primary-500 transition-colors">
                                <FileText size={18} />
                            </div>
                            <select
                                value={formData.expense_type}
                                onChange={(e) => setFormData({ ...formData, expense_type: e.target.value })}
                                className="w-full pl-12 pr-12 py-4 bg-gray-50/50 border border-gray-100 rounded-2xl text-[11px] font-black uppercase tracking-widest text-gray-900 outline-none focus:ring-4 focus:ring-primary-500/5 focus:border-primary-500/50 focus:bg-white transition-all appearance-none shadow-sm cursor-pointer"
                            >
                                <option value="Rent">Rent Logistics</option>
                                <option value="Bills">Utility / Bills</option>
                                <option value="Stationery">Branch Stationery</option>
                                <option value="Travel">Field Logistics</option>
                                <option value="Salary">Salary Advance</option>
                                <option value="Other">Miscellaneous</option>
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 pointer-events-none" />
                        </div>
                    </div>

                    <div className="group/field">
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2.5 ml-2">Settlement Medium</label>
                        <select
                            value={formData.medium}
                            onChange={(e) => setFormData({ ...formData, medium: e.target.value })}
                            className="w-full px-6 py-4 bg-gray-50/50 border border-gray-100 rounded-2xl text-[11px] font-black uppercase tracking-widest text-gray-900 outline-none focus:ring-4 focus:ring-primary-500/5 focus:border-primary-500/50 focus:bg-white transition-all appearance-none shadow-sm cursor-pointer"
                        >
                            <option value="Cash">Physical Cash</option>
                            <option value="Bank">Bank Wire Transfer</option>
                        </select>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="group/field">
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2.5 ml-2">Assigned Entity</label>
                        <div className="relative">
                            <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-300 group-focus-within/field:text-primary-500 transition-colors" />
                            <select
                                value={formData.branch_id}
                                onChange={(e) => setFormData({ ...formData, branch_id: e.target.value })}
                                className="w-full pl-12 pr-12 py-4 bg-gray-50/50 border border-gray-100 rounded-2xl text-[11px] font-black uppercase tracking-widest text-gray-900 outline-none focus:ring-4 focus:ring-primary-500/5 focus:border-primary-500/50 focus:bg-white transition-all appearance-none shadow-sm cursor-pointer"
                            >
                                {branches.map(branch => (
                                    <option key={branch.id} value={branch.id}>{branch.branch_name.toUpperCase()}</option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 pointer-events-none" />
                        </div>
                    </div>

                    <div className="group/field">
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2.5 ml-2">Registry Amount (LKR)</label>
                        <div className="relative">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-gray-300 uppercase">Rs.</div>
                            <input
                                type="number"
                                placeholder="0.00"
                                value={formData.amount}
                                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                className="w-full pl-14 pr-6 py-4 bg-gray-50/50 border border-gray-100 rounded-2xl text-[13px] font-black text-gray-900 tabular-nums outline-none focus:ring-4 focus:ring-primary-500/5 focus:border-primary-500/50 focus:bg-white transition-all shadow-sm"
                            />
                        </div>
                    </div>
                </div>

                <div className="md:col-span-3 group/field">
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2.5 ml-2">Registry Memo / Justification</label>
                    <textarea
                        placeholder="Detailed documentation of the delta event..."
                        rows={3}
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="w-full px-6 py-5 bg-gray-50/50 border border-gray-100 rounded-3xl text-[11px] font-bold text-gray-700 outline-none focus:ring-4 focus:ring-primary-500/5 focus:border-primary-500/50 focus:bg-white transition-all resize-none shadow-sm"
                    ></textarea>
                </div>
            </div>

            <div className="mt-10 flex justify-end relative z-10 border-t border-gray-50 pt-8">
                <button
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="group/btn px-12 py-4 text-[11px] font-black uppercase tracking-[0.3em] text-white rounded-[1.5rem] transition-all relative overflow-hidden active:scale-95 disabled:opacity-70 shadow-2xl shadow-primary-500/30"
                    style={{ background: `linear-gradient(135deg, ${colors.primary[600]}, ${colors.primary[700]})` }}
                >
                    <div className="relative z-10 flex items-center gap-3">
                        {submitting ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <ShieldCheck className="w-5 h-5 group-hover/btn:rotate-12 transition-transform" />
                        )}
                        {submitting ? 'Authenticating...' : 'Authorize Activity'}
                    </div>
                    <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
                </button>
            </div>

            {/* Precision Tag */}
            <div className="absolute bottom-4 left-8 pointer-events-none">
                <p className="text-[7px] font-black text-gray-200 uppercase tracking-[0.5em]">Institutional Form-X9</p>
            </div>
        </div>
    );
}
