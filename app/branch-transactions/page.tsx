"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { BranchTruncationStats } from '../../components/branch-transactions/BranchTruncationStats';
import { BranchActivityForm } from '../../components/branch-transactions/BranchActivityForm';
import { BranchActivityTable } from '../../components/branch-transactions/BranchActivityTable';
import { LoanDuePaymentsTable } from '../../components/branch-transactions/LoanDuePaymentsTable';
import { financeService } from '../../services/finance.service';
import { BranchExpense } from '../../types/finance.types';
import { Calendar, Building2, LayoutDashboard, Database, Activity, Landmark } from 'lucide-react';
import { authService } from '../../services/auth.service';
import { branchService } from '../../services/branch.service';
import { Branch } from '../../types/branch.types';
import BMSLoader from '../../components/common/BMSLoader';
import { colors } from '@/themes/colors';

export default function BranchTransactionsPage() {
    const [activeTab, setActiveTab] = useState<'activity' | 'due-payments'>('activity');
    const [activities, setActivities] = useState<BranchExpense[]>([]);
    const [stats, setStats] = useState<any>(null);
    const [loanDues, setLoanDues] = useState<any[]>([]);
    const [collectionStatus, setCollectionStatus] = useState<'active' | 'settled'>('active');
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [selectedPeriod, setSelectedPeriod] = useState('day');
    const [branches, setBranches] = useState<Branch[]>([]);
    const [selectedBranchId, setSelectedBranchId] = useState<number | undefined>(undefined);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        setIsAdmin(authService.hasPermission('data.view_all'));
        const fetchBranches = async () => {
            try {
                const data = await branchService.getBranchesAll();
                setBranches(data);
            } catch (error) {
                console.error('Failed to fetch branches', error);
            }
        };
        fetchBranches();
    }, []);

    const fetchActivities = useCallback(async () => {
        try {
            setLoading(true);
            const data = await financeService.getBranchTransactions(selectedBranchId, selectedDate, selectedPeriod);
            setActivities(data.activities);
            setStats(data.stats);
        } catch (error) {
            console.error('Failed to fetch activities', error);
        } finally {
            setLoading(false);
        }
    }, [selectedDate, selectedPeriod, selectedBranchId]);

    const fetchLoanDues = useCallback(async () => {
        try {
            setLoading(true);
            const data = await financeService.getUnsettledReceipts(selectedBranchId, collectionStatus);
            setLoanDues(data);
        } catch (error) {
            console.error('Failed to fetch loan dues', error);
        } finally {
            setLoading(false);
        }
    }, [collectionStatus, selectedBranchId]);

    useEffect(() => {
        if (activeTab === 'activity') {
            fetchActivities();
        } else {
            fetchLoanDues();
        }
    }, [activeTab, fetchActivities, fetchLoanDues, collectionStatus]);

    return (
        <div className="min-h-screen relative overflow-hidden" style={{ backgroundColor: colors.surface.background }}>
            {/* Ambient Premium Effects */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div
                    className="absolute -top-[10%] -left-[5%] w-[45%] h-[45%] rounded-full opacity-10 blur-[140px]"
                    style={{ background: `radial-gradient(circle, ${colors.primary[500]}, transparent)` }}
                />
                <div
                    className="absolute top-[20%] -right-[5%] w-[35%] h-[35%] rounded-full opacity-5 blur-[120px]"
                    style={{ background: `radial-gradient(circle, ${colors.indigo[400]}, transparent)` }}
                />
            </div>

            <div className="relative z-10 p-8 space-y-8 animate-in fade-in duration-700 max-h-screen overflow-y-auto no-scrollbar">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 bg-white/70 backdrop-blur-xl p-8 rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-white/50 relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-2 h-full" style={{ background: `linear-gradient(to bottom, ${colors.primary[500]}, ${colors.primary[700]})` }} />

                    <div className="flex items-center gap-6 relative z-10">
                        <div className="w-16 h-16 rounded-[1.5rem] flex items-center justify-center text-white shadow-2xl shrink-0"
                            style={{ background: `linear-gradient(135deg, ${colors.primary[600]}, ${colors.indigo[900]})` }}>
                            <Landmark className="w-8 h-8" strokeWidth={2.5} />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black text-gray-900 tracking-tighter uppercase leading-none mb-2">
                                Branch Truncation
                            </h1>
                            <div className="flex items-center gap-3">
                                <span className="text-[11px] text-gray-400 font-extrabold uppercase tracking-[0.2em] flex items-center gap-2">
                                    <Activity className="w-3.5 h-3.5 text-primary-500" />
                                    Operational Liquidity Module
                                </span>
                                <div className="w-1 h-3 rounded-full bg-gray-100" />
                                <span className="text-[11px] text-gray-400 font-bold uppercase tracking-widest">Institutional Trace Verified</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 relative z-10">
                        <div className="flex items-center gap-2 bg-gray-50/50 p-2 rounded-2xl border border-gray-100/50 backdrop-blur-sm shadow-inner group/period">
                            {['day', 'month', 'year', 'all'].map((period) => (
                                <button
                                    key={period}
                                    onClick={() => setSelectedPeriod(period)}
                                    className={`px-5 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all duration-300 ${selectedPeriod === period
                                        ? 'bg-white text-primary-600 shadow-xl scale-105'
                                        : 'text-gray-400 hover:text-gray-600'
                                        }`}
                                >
                                    {period}
                                </button>
                            ))}
                        </div>
                        <div className="h-10 w-px bg-gray-100 hidden md:block" />
                        <div className="relative group/date">
                            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within/date:text-primary-500 transition-colors" />
                            <input
                                type="date"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                className="pl-12 pr-6 py-3.5 bg-white border border-gray-100 rounded-2xl text-[10px] font-black uppercase tracking-widest outline-none ring-4 ring-primary-500/0 focus:ring-primary-500/5 focus:border-primary-500/50 transition-all w-52 text-gray-900 shadow-sm"
                            />
                        </div>
                    </div>
                </div>

                {/* Statistics Layer */}
                <div className="animate-in slide-in-from-bottom-8 duration-800">
                    <BranchTruncationStats stats={stats} period={selectedPeriod} />
                </div>

                {/* Interaction Tabs Area */}
                <div className="bg-white/80 backdrop-blur-xl rounded-[3rem] border border-gray-100 shadow-2xl shadow-gray-200/50 overflow-hidden flex flex-col min-h-[600px]">
                    <div className="flex flex-wrap items-center bg-gray-50/30 px-8 pt-8 gap-4 border-b border-gray-50">
                        {[
                            { id: 'activity', label: 'Branch Registry Activity', icon: Database },
                            { id: 'due-payments', label: 'Loan Liquidation Dues', icon: Landmark }
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`flex items-center gap-3 px-8 pb-8 text-[11px] font-black uppercase tracking-[0.2em] transition-all relative group ${activeTab === tab.id
                                    ? 'text-primary-600'
                                    : 'text-gray-400 hover:text-gray-600'
                                    }`}
                            >
                                <tab.icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${activeTab === tab.id ? 'text-primary-500' : 'text-gray-300'}`} />
                                {tab.label}
                                {activeTab === tab.id && (
                                    <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-primary-600 rounded-t-full shadow-[0_-2px_15px_rgba(124,58,237,0.4)] animate-in slide-in-from-bottom-2 duration-300" />
                                )}
                            </button>
                        ))}

                        {isAdmin && (
                            <div className="ml-auto mb-8 flex items-center gap-4 px-6 py-2.5 bg-white rounded-2xl border border-gray-100 shadow-sm group/branch">
                                <Building2 className="w-4 h-4 text-primary-500 group-hover/branch:rotate-12 transition-transform" />
                                <div className="h-4 w-px bg-gray-100" />
                                <select
                                    value={selectedBranchId || ''}
                                    onChange={(e) => setSelectedBranchId(e.target.value ? parseInt(e.target.value) : undefined)}
                                    className="bg-transparent border-none outline-none font-black text-[10px] uppercase tracking-widest text-gray-900 cursor-pointer min-w-[180px]"
                                >
                                    <option value="">Global Network Log</option>
                                    {branches.map(branch => (
                                        <option key={branch.id} value={branch.id}>{branch.branch_name.toUpperCase()}</option>
                                    ))}
                                </select>
                            </div>
                        )}
                    </div>

                    <div className="flex-1 p-8 animate-in slide-in-from-right-4 duration-500">
                        {activeTab === 'activity' ? (
                            <div className="space-y-12">
                                {!isAdmin && (
                                    <div className="animate-in fade-in slide-in-from-top-4 duration-700">
                                        <BranchActivityForm onSuccess={fetchActivities} />
                                    </div>
                                )}
                                {loading ? (
                                    <div className="flex flex-col items-center justify-center py-32 space-y-4">
                                        <BMSLoader message="Synchronizing Activity Registry..." size="xsmall" />
                                    </div>
                                ) : (
                                    <div className="animate-in slide-in-from-bottom-6 duration-800">
                                        <BranchActivityTable activities={activities} />
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="space-y-8">
                                <div className="flex justify-between items-center px-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Liquidation Status Management</p>
                                    </div>
                                    <div className="bg-gray-100/50 p-1.5 rounded-2xl border border-gray-100 backdrop-blur-sm shadow-inner overflow-hidden">
                                        {[
                                            { id: 'active', label: 'Pending Dues' },
                                            { id: 'settled', label: 'History Archives' }
                                        ].map((s) => (
                                            <button
                                                key={s.id}
                                                onClick={() => setCollectionStatus(s.id as any)}
                                                className={`px-8 py-2.5 text-[10px] font-black uppercase tracking-[0.1em] rounded-xl transition-all duration-300 ${collectionStatus === s.id
                                                    ? 'bg-white text-primary-600 shadow-xl scale-105'
                                                    : 'text-gray-400 hover:text-gray-600'
                                                    }`}
                                            >
                                                {s.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {loading ? (
                                    <div className="flex flex-col items-center justify-center py-32 space-y-4">
                                        <BMSLoader message="Verifying Liquidation Logs..." size="xsmall" />
                                    </div>
                                ) : (
                                    <div className="animate-in slide-in-from-bottom-6 duration-800">
                                        <LoanDuePaymentsTable records={loanDues} onSettled={fetchLoanDues} status={collectionStatus} />
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Protocol Precision Footer */}
                    <div className="px-12 py-6 bg-gray-50/20 border-t border-gray-50 flex items-center justify-between opacity-60">
                        <div className="flex items-center gap-4">
                            <p className="text-[9px] text-gray-400 font-bold uppercase tracking-[0.4em]">
                                Registry Integrity Verified • Protocol v4.0.2
                            </p>
                            <div className="h-4 w-px bg-gray-200" />
                            <p className="text-[9px] text-gray-400 font-bold uppercase tracking-[0.4em]">
                                Sync: Global Network Active
                            </p>
                        </div>
                        <div className="flex items-center gap-2 grayscale group-hover:grayscale-0 transition-all">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary-500" />
                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
