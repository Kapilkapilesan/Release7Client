"use client";
import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  TrendingUp,
  BadgeDollarSign,
  Download,
  Plus,
} from "lucide-react";
import { CustomerInvestmentsTable } from "../../components/fund-transactions/CustomerInvestmentsTable";
import { investmentService } from "../../services/investment.service";
import { authService } from "../../services/auth.service";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";
import BMSLoader from "../../components/common/BMSLoader";
import { colors } from "@/themes/colors";
import {
  filterInvestments,
  calculateInvestmentStats,
} from "@/utils/investment.utils";

export default function InvestmentsListPage() {
  const [investments, setInvestments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ACTIVE");
  const [isMounted, setIsMounted] = useState(false);

  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
    loadInvestments(true);

    const interval = setInterval(() => loadInvestments(false), 5000);
    return () => clearInterval(interval);
  }, []);

  const loadInvestments = async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      const data = await investmentService.getInvestments();
      setInvestments(data);
    } catch (error) {
      console.error(error);
      if (showLoading) toast.error("Failed to load investments");
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  const filteredInvestments = filterInvestments(
    investments,
    searchTerm,
    statusFilter
  );

  const stats = calculateInvestmentStats(investments);

  return (
    <div className="min-h-screen relative overflow-hidden bg-app-background transition-colors duration-300">
      {/* Ambient Background Glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-40 dark:opacity-60">
        <div
          className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full blur-[120px] opacity-25 dark:opacity-45"
          style={{ background: `radial-gradient(circle, ${colors.primary[400]}, transparent)` }}
        />
        <div
          className="absolute top-[20%] -right-[10%] w-[35%] h-[35%] rounded-full blur-[100px] opacity-15 dark:opacity-30"
          style={{ background: `radial-gradient(circle, ${colors.indigo[400]}, transparent)` }}
        />
      </div>

      <div className="relative z-10 p-6 md:p-8 max-w-[1600px] mx-auto space-y-8 animate-in fade-in duration-700">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 md:gap-8 bg-card/70 backdrop-blur-2xl p-6 md:p-8 rounded-3xl shadow-2xl border border-border/40">
          <div className="flex items-center gap-5 md:gap-6">
            <div
              className="p-4 md:p-5 rounded-2xl shadow-xl transform transition-transform hover:scale-105 duration-400"
              style={{
                background: `linear-gradient(135deg, ${colors.primary[600]}, ${colors.primary[700]})`,
                boxShadow: `0 15px 35px ${colors.primary[600]}40`,
              }}
            >
              <TrendingUp className="w-7 h-7 md:w-8 md:h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-black text-text-primary tracking-tight">
                Investment <span style={{ color: colors.primary[500] }}>Accounts</span>
              </h1>
              <p className="text-xs md:text-sm font-semibold text-text-muted mt-1 uppercase tracking-[0.18em]">
                Institutional Asset Management
              </p>
            </div>
          </div>

          {isMounted && authService.hasPermission("investments.create") && (
            <button
              onClick={() => router.push("/investments/create")}
              className="group relative flex items-center justify-center gap-2.5 px-7 md:px-10 py-4 rounded-2xl transition-all duration-300 active:scale-95 shadow-xl hover:shadow-2xl overflow-hidden"
              style={{
                background: `linear-gradient(135deg, ${colors.primary[600]}, ${colors.primary[700]})`,
                boxShadow: `0 10px 30px ${colors.primary[600]}35`,
              }}
            >
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-12 transition-opacity duration-300" />
              <Plus className="w-5 h-5 text-white" />
              <span className="text-white font-black tracking-wider text-xs md:text-[10px] uppercase">
                Initialize New Asset
              </span>
            </button>
          )}
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {/* Stat 1 */}
          <div className="group bg-card/75 backdrop-blur-2xl p-6 md:p-8 rounded-3xl border border-border/30 shadow-xl transition-all duration-400 hover:shadow-2xl hover:-translate-y-1">
            <div className="flex items-center gap-4 md:gap-5">
              <div className="p-3.5 md:p-4 bg-emerald-500/10 rounded-2xl transition-all group-hover:bg-emerald-500/20 group-hover:rotate-3">
                <BadgeDollarSign className="w-7 h-7 md:w-8 md:h-8 text-emerald-500" />
              </div>
              <div>
                <p className="text-[10px] md:text-xs font-black text-text-muted uppercase tracking-widest mb-1 opacity-70">
                  Total Active Principal
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl md:text-3xl font-black text-text-primary tracking-tight">
                    {stats.totalPrincipal.toLocaleString()}
                  </span>
                  <span className="text-xs font-bold text-emerald-500/90 uppercase tracking-widest">LKR</span>
                </div>
              </div>
            </div>
          </div>

          {/* Stat 2 */}
          <div className="group bg-card/75 backdrop-blur-2xl p-6 md:p-8 rounded-3xl border border-border/30 shadow-xl transition-all duration-400 hover:shadow-2xl hover:-translate-y-1">
            <div className="flex items-center gap-4 md:gap-5">
              <div className="p-3.5 md:p-4 bg-primary-500/10 rounded-2xl transition-all group-hover:bg-primary-500/20 group-hover:rotate-3">
                <TrendingUp className="w-7 h-7 md:w-8 md:h-8 text-primary-500" />
              </div>
              <div>
                <p className="text-[10px] md:text-xs font-black text-text-muted uppercase tracking-widest mb-1 opacity-70">
                  Total Subscriptions
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl md:text-3xl font-black text-text-primary tracking-tight">
                    {stats.totalCount}
                  </span>
                  <span className="text-xs font-bold text-primary-500/90 uppercase tracking-widest italic">
                    Accounts
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Stat 3 */}
          <div className="group bg-card/75 backdrop-blur-2xl p-6 md:p-8 rounded-3xl border border-border/30 shadow-xl transition-all duration-400 hover:shadow-2xl hover:-translate-y-1">
            <div className="flex items-center gap-4 md:gap-5">
              <div className="p-3.5 md:p-4 bg-indigo-500/10 rounded-2xl transition-all group-hover:bg-indigo-500/20 group-hover:rotate-3">
                <Filter className="w-7 h-7 md:w-8 md:h-8 text-indigo-500" />
              </div>
              <div>
                <p className="text-[10px] md:text-xs font-black text-text-muted uppercase tracking-widest mb-1 opacity-70">
                  Portfolio Integrity
                </p>
                <div className="flex flex-col gap-1.5">
                  <span className="text-2xl md:text-3xl font-black text-text-primary tracking-tight">
                    {stats.activePercentage}%
                  </span>
                  <div className="w-28 md:w-32 h-1.5 bg-muted/30 rounded-full overflow-hidden shadow-inner">
                    <div
                      className="h-full bg-indigo-500 rounded-full shadow-[0_0_12px_rgba(99,102,241,0.5)] transition-all"
                      style={{ width: `${stats.activePercentage}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="space-y-6">
          <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 items-center">
            <div className="relative flex-1 w-full group">
              <Search className="w-5 h-5 text-text-muted absolute left-5 top-1/2 -translate-y-1/2 group-focus-within:text-primary-500 transition-colors opacity-60" />
              <input
                type="text"
                placeholder="Search accounts, customers, or products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-14 pr-6 py-4 bg-card border-border/40 border rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary-500/15 focus:border-primary-500/50 transition-all shadow-lg text-text-primary font-semibold text-sm placeholder:text-text-muted/50"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
              <div className="relative w-full sm:w-64 lg:w-72">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full appearance-none pl-5 pr-12 py-4 bg-card border-border/40 border rounded-2xl text-text-primary font-semibold shadow-lg cursor-pointer focus:outline-none focus:ring-4 focus:ring-primary-500/15 focus:border-primary-500/50 transition-all uppercase tracking-wide text-sm"
                >
                  <option value="ALL">ALL PORTFOLIO</option>
                  <option value="ACTIVE">● ACTIVE ONLY</option>
                  <option value="CLOSED">● CLOSED</option>
                  <option value="MATURED">● MATURED</option>
                  <option value="RENEWED">● RENEWED</option>
                </select>
                <Filter className="w-4 h-4 text-text-muted absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none opacity-50" />
              </div>

              <button className="flex items-center justify-center gap-2.5 px-7 py-4 bg-card hover:bg-muted/50 border-border/40 border rounded-2xl text-text-primary font-semibold shadow-lg transition-all active:scale-95 uppercase tracking-wide text-sm group">
                <Download className="w-4.5 h-4.5 text-text-muted group-hover:text-primary-500 transition-colors" />
                Export Portfolio
              </button>
            </div>
          </div>

          <div className="bg-card/50 backdrop-blur-2xl rounded-3xl shadow-2xl border border-border/30 p-1.5 md:p-2 overflow-hidden">
            {loading ? (
              <div className="min-h-[50vh] md:min-h-[calc(100vh-24rem)] flex items-center justify-center">
                <BMSLoader message="Analyzing Portfolio Intelligence..." size="medium" />
              </div>
            ) : (
              <div className="rounded-3xl overflow-hidden">
                <CustomerInvestmentsTable records={filteredInvestments} />
              </div>
            )}
          </div>
        </div>
      </div>

      <ToastContainer position="bottom-right" theme="dark" limit={3} />
    </div>
  );
}