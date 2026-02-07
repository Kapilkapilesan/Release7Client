'use client';

import React, { useState, useEffect } from 'react';
import { FundTruncationStats } from '../../components/fund-transactions/FundTruncationStats';
import { ShareholdersTable } from '../../components/fund-transactions/InvestmentsTable';
import { CustomerInvestmentsTable } from '../../components/fund-transactions/CustomerInvestmentsTable';
import { LoanDisbursementTable } from '../../components/fund-transactions/LoanDisbursementTable';
import { SalaryDisbursementTable } from '../../components/fund-transactions/SalaryDisbursementTable';
import { PayoutModal } from '../../components/fund-transactions/PayoutModal';
import { toast } from 'react-toastify';
import { financeService } from '../../services/finance.service';
import { investmentService } from '../../services/investment.service';
import { shareholderService } from '../../services/shareholder.service';
import { staffLoanService } from '../../services/staffLoan.service';
import { StaffLoanDisbursementTable } from '../../components/fund-transactions/StaffLoanDisbursementTable';
import { InvestmentPayoutsTable } from '../../components/fund-transactions/InvestmentPayoutsTable';
import { colors } from '@/themes/colors';
import { ArrowLeftRight, Calendar, Download, Filter } from 'lucide-react';
import BMSLoader from '@/components/common/BMSLoader';

export default function FundTransactionsPage() {
    const [activeTab, setActiveTab] = useState<'shareholders' | 'investments' | 'loans' | 'salaries' | 'staff-loans' | 'investment-payouts'>('shareholders');
    const [payoutModal, setPayoutModal] = useState<{
        isOpen: boolean;
        recipientName: string;
        amount: number;
        type: 'loan' | 'salary' | 'bulk-salary' | 'staff-loan' | 'investment';
        bankDetails?: {
            bankName: string;
            accountNumber: string;
        };
        id: string | string[];
    }>({
        isOpen: false,
        recipientName: '',
        amount: 0,
        type: 'loan',
        bankDetails: undefined,
        id: ''
    });

    const [isLoading, setIsLoading] = useState(false);
    const [isPageLoading, setIsPageLoading] = useState(true);
    const [stats, setStats] = useState({
        total_income: 0,
        total_expense: 0,
        net_flow: 0,
        total_truncation: 0,
        total_shareholder_investment: 0,
        total_customer_investment: 0
    });
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [selectedDay, setSelectedDay] = useState(new Date().getDate());
    const [period, setPeriod] = useState<'day' | 'month' | 'year' | 'all'>('month');
    const [shareholders, setShareholders] = useState<any[]>([]);
    const [customerInvestments, setCustomerInvestments] = useState<any[]>([]);
    const [loans, setLoans] = useState<any[]>([]);
    const [salaries, setSalaries] = useState<any[]>([]);
    const [staffLoans, setStaffLoans] = useState<any[]>([]);
    const [investmentPayouts, setInvestmentPayouts] = useState<any[]>([]);

    const fetchShareholders = async () => {
        try {
            const data = await shareholderService.getAll();
            setShareholders(data.shareholders);
        } catch (error: any) {
            console.error('Failed to fetch shareholders', error);
            toast.error(error.message || 'Failed to fetch shareholders');
        }
    };

    const fetchInvestments = async () => {
        try {
            const data = await investmentService.getInvestments();
            setCustomerInvestments(data);
        } catch (error) {
            console.error('Failed to fetch investments', error);
        }
    };

    const fetchLoans = async () => {
        try {
            const data = await financeService.getApprovedLoans();
            setLoans(data);
        } catch (error: any) {
            toast.error(error.message || 'Failed to fetch loans for disbursement');
        }
    };

    const fetchStats = async () => {
        try {
            const dateStr = `${selectedYear}-${String(selectedMonth).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`;
            const data = await financeService.getBranchTransactions(undefined, dateStr, period);
            setStats(data.stats);
        } catch (error) {
            console.error('Failed to fetch stats', error);
        }
    };

    const fetchSalaries = async () => {
        try {
            const data = await financeService.getPendingSalaries();
            setSalaries(data);
        } catch (error: any) {
            toast.error(error.message || 'Failed to fetch pending salaries');
        }
    };

    const fetchStaffLoans = async () => {
        try {
            const response = await staffLoanService.getAll({ status: 'approved,disbursed' });
            if (response.status === 'success') {
                const sorted = response.data.data.sort((a: any, b: any) => {
                    if (a.status === b.status) return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
                    return a.status === 'approved' ? -1 : 1;
                });
                setStaffLoans(sorted);
            }
        } catch (error) {
            console.error('Failed to fetch staff loans', error);
        }
    };

    const fetchPayouts = async () => {
        try {
            const data = await investmentService.getPayouts();
            setInvestmentPayouts(data);
        } catch (error) {
            console.error('Failed to fetch investment payouts', error);
        }
    };

    useEffect(() => {
        const init = async () => {
            setIsPageLoading(true);
            await Promise.all([
                fetchShareholders(),
                fetchInvestments(),
                fetchLoans(),
                fetchSalaries(),
                fetchStaffLoans(),
                fetchPayouts(),
                fetchStats()
            ]);
            setIsPageLoading(false);
        };
        init();
    }, []);

    useEffect(() => {
        if (!isPageLoading) {
            fetchStats();
        }
    }, [selectedMonth, selectedYear, selectedDay, period]);

    const handleDisburseClick = (type: 'loan' | 'salary' | 'staff-loan' | 'investment', record: any) => {
        setPayoutModal({
            isOpen: true,
            recipientName: type === 'loan' || type === 'investment'
                ? record.investment?.customer?.full_name || record.customer?.full_name
                : record.staff?.full_name,
            amount: type === 'loan'
                ? parseFloat(record.approved_amount)
                : type === 'staff-loan'
                    ? parseFloat(record.amount)
                    : type === 'investment'
                        ? parseFloat(record.total_payout)
                        : parseFloat(record.net_payable),
            bankDetails: type === 'loan' && record.borrower_bank_details ? {
                bankName: record.borrower_bank_details.bank_name,
                accountNumber: record.borrower_bank_details.account_number
            } : undefined,
            type,
            id: record.id
        });
    };

    const handleBulkSalaryDisburse = (selectedRecords: any[]) => {
        const totalAmount = selectedRecords.reduce((sum, rec) => sum + parseFloat(rec.net_payable), 0);
        setPayoutModal({
            isOpen: true,
            recipientName: `${selectedRecords.length} Staff Members (Bulk Transfer)`,
            amount: totalAmount,
            type: 'bulk-salary',
            id: selectedRecords.map(r => r.id.toString())
        });
    };

    const handleConfirmPayout = async (refNo: string, remark: string) => {
        setIsLoading(true);
        try {
            if (payoutModal.type === 'loan') {
                await financeService.disburseLoan(Number(payoutModal.id));
                toast.success('Loan disbursed successfully!');
                await fetchLoans();
            } else if (payoutModal.type === 'salary') {
                await financeService.disburseSalary(Number(payoutModal.id));
                toast.success('Salary disbursed successfully!');
                await fetchSalaries();
            } else if (payoutModal.type === 'bulk-salary') {
                const ids = payoutModal.id as string[];
                await Promise.all(ids.map(id => financeService.disburseSalary(Number(id))));
                toast.success(`${ids.length} Salaries disbursed successfully!`);
                await fetchSalaries();
            } else if (payoutModal.type === 'staff-loan') {
                await staffLoanService.disburse(Number(payoutModal.id), refNo);
                toast.success('Staff Loan disbursed successfully!');
                await fetchStaffLoans();
            } else if (payoutModal.type === 'investment') {
                await investmentService.settlePayout(Number(payoutModal.id), refNo);
                toast.success('Investment yield disbursed successfully!');
                await fetchPayouts();
                await fetchInvestments();
            }
            fetchStats();
            setPayoutModal(prev => ({ ...prev, isOpen: false }));
        } catch (error: any) {
            toast.error(error.message || 'Disbursement failed');
        } finally {
            setIsLoading(false);
        }
    };

    if (isPageLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <BMSLoader message="Architecting Truncation Intelligence..." size="small" />
            </div>
        );
    }

    return (
        <div className="min-h-screen relative overflow-hidden" style={{ backgroundColor: colors.surface.background }}>
            {/* Ambient Background Glows */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none text-red-100">
                <div
                    className="absolute -top-[5%] -left-[5%] w-[35%] h-[35%] rounded-full opacity-5 blur-[100px]"
                    style={{ background: `radial-gradient(circle, ${colors.primary[400]}, transparent)` }}
                />
                <div
                    className="absolute bottom-[5%] -right-[5%] w-[30%] h-[30%] rounded-full opacity-5 blur-[80px]"
                    style={{ background: `radial-gradient(circle, ${colors.indigo[400]}, transparent)` }}
                />
            </div>

            <div className="relative z-10 p-4 max-w-[1500px] mx-auto space-y-4 animate-in fade-in duration-700">
                {/* High Density Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/70 backdrop-blur-xl p-5 rounded-2xl shadow-lg border border-white/50">
                    <div className="flex items-center gap-4">
                        <div
                            className="p-3 rounded-xl shadow-md transform transition-transform hover:scale-105 duration-500"
                            style={{
                                background: `linear-gradient(135deg, ${colors.primary[600]}, ${colors.primary[700]})`,
                                boxShadow: `0 8px 16px ${colors.primary[600]}25`
                            }}
                        >
                            <ArrowLeftRight className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-black text-gray-900 tracking-tight uppercase leading-none">Fund Truncation</h1>
                            <p className="text-[9px] text-gray-400 font-bold tracking-[0.2em] uppercase mt-1">
                                Institutional Liquidity & Capital Allocation Matrix
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-3">
                        <div className="flex bg-gray-50/50 p-1 rounded-xl border border-gray-100/50 backdrop-blur-sm">
                            {(['day', 'month', 'year', 'all'] as const).map((p) => (
                                <button
                                    key={p}
                                    onClick={() => setPeriod(p)}
                                    className={`px-4 py-1.5 text-[8px] font-black uppercase tracking-widest rounded-lg transition-all duration-300 ${period === p
                                        ? 'bg-white text-primary-600 shadow-md scale-105'
                                        : 'text-gray-400 hover:text-gray-500'
                                        }`}
                                >
                                    {p}
                                </button>
                            ))}
                        </div>

                        {period !== 'all' && (
                            <div className="flex items-center gap-2 bg-gray-50/50 p-1 rounded-xl border border-gray-100/50">
                                {period === 'day' ? (
                                    <div className="relative">
                                        <Calendar className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400" />
                                        <input
                                            type="date"
                                            value={`${selectedYear}-${String(selectedMonth).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`}
                                            onChange={(e) => {
                                                if (e.target.value) {
                                                    const d = new Date(e.target.value);
                                                    setSelectedYear(d.getFullYear());
                                                    setSelectedMonth(d.getMonth() + 1);
                                                    setSelectedDay(d.getDate());
                                                }
                                            }}
                                            className="pl-7 pr-3 py-1.5 text-[9px] font-black uppercase tracking-widest rounded-lg bg-white border-none text-gray-900 ring-1 ring-gray-100 outline-none cursor-pointer"
                                        />
                                    </div>
                                ) : (
                                    <div className="flex gap-1.5">
                                        <select
                                            value={selectedMonth}
                                            onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                                            disabled={period === 'year'}
                                            className="px-3 py-1.5 text-[9px] font-black uppercase tracking-widest rounded-lg bg-white border-none text-gray-900 ring-1 ring-gray-100 outline-none cursor-pointer appearance-none min-w-[90px] text-center"
                                        >
                                            {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map((month, index) => (
                                                <option key={month} value={index + 1}>{month}</option>
                                            ))}
                                        </select>
                                        <select
                                            value={selectedYear}
                                            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                                            className="px-3 py-1.5 text-[9px] font-black uppercase tracking-widest rounded-lg bg-white border-none text-gray-900 ring-1 ring-gray-100 outline-none cursor-pointer appearance-none min-w-[70px] text-center"
                                        >
                                            {[2024, 2025, 2026, 2027, 2028].map(y => (
                                                <option key={y} value={y}>{y}</option>
                                            ))}
                                        </select>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                <FundTruncationStats stats={stats} />

                {/* High Density Navigation Tabs */}
                <div className="bg-white/70 backdrop-blur-xl p-1.5 rounded-2xl shadow-md border border-white/50">
                    <div className="flex flex-wrap items-center gap-1.5">
                        {[
                            { id: 'shareholders', label: 'Shareholders' },
                            { id: 'investments', label: 'Investments' },
                            { id: 'loans', label: 'Loans', count: loans.length },
                            { id: 'salaries', label: 'Salaries', count: salaries.length },
                            { id: 'staff-loans', label: 'Staff Loans', count: staffLoans.length },
                            { id: 'investment-payouts', label: 'Investment Return', count: investmentPayouts.length }
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`px-4 py-2.5 text-[9px] font-black uppercase tracking-widest transition-all duration-300 rounded-xl flex items-center gap-2 relative group ${activeTab === tab.id
                                    ? 'bg-primary-600 text-white shadow-lg'
                                    : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
                                    }`}
                            >
                                <span>{tab.label}</span>
                                {tab.count !== undefined && tab.count > 0 && (
                                    <span className={`flex items-center justify-center min-w-[18px] h-4.5 rounded-md px-1 text-[8px] font-black ${activeTab === tab.id ? 'bg-white text-primary-600' : 'bg-primary-50 text-primary-600 group-hover:bg-primary-100'
                                        }`}>
                                        {tab.count}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="animate-in slide-in-from-bottom-4 duration-500 bg-white/80 backdrop-blur-xl rounded-2xl p-4 border border-white shadow-lg overflow-hidden">
                    {activeTab === 'shareholders' && <ShareholdersTable records={shareholders} />}
                    {activeTab === 'investments' && <CustomerInvestmentsTable records={customerInvestments} />}
                    {activeTab === 'loans' && (
                        <LoanDisbursementTable
                            records={loans}
                            onDisburse={(rec) => handleDisburseClick('loan', rec)}
                        />
                    )}
                    {activeTab === 'salaries' && (
                        <SalaryDisbursementTable
                            records={salaries}
                            onDisburse={(rec) => handleDisburseClick('salary', rec)}
                            onBulkDisburse={handleBulkSalaryDisburse}
                        />
                    )}
                    {activeTab === 'staff-loans' && (
                        <StaffLoanDisbursementTable
                            records={staffLoans}
                            onDisburse={(rec) => handleDisburseClick('staff-loan', rec)}
                        />
                    )}
                    {activeTab === 'investment-payouts' && (
                        <InvestmentPayoutsTable
                            records={investmentPayouts}
                            onDisburse={(rec) => handleDisburseClick('investment', rec)}
                            onSettle={(id) => { }}
                        />
                    )}
                </div>
            </div>

            <PayoutModal
                isOpen={payoutModal.isOpen}
                onClose={() => setPayoutModal(prev => ({ ...prev, isOpen: false }))}
                recipientName={payoutModal.recipientName}
                amount={payoutModal.amount}
                bankDetails={payoutModal.bankDetails}
                onConfirm={handleConfirmPayout}
                isProcessing={isLoading}
            />
        </div>
    );
}
