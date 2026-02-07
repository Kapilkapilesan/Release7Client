import React from 'react';
import { DollarSign, UserCheck, Users } from 'lucide-react';
import { SalaryStats } from '@/types/salary.types';
import { colors } from '@/themes/colors';

interface SalaryStatsCardProps {
    stats: SalaryStats;
}

export const SalaryStatsCard: React.FC<SalaryStatsCardProps> = ({ stats }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            <div
                className="p-6 rounded-2xl border transition-all"
                style={{ backgroundColor: colors.primary[50], borderColor: colors.primary[100] }}
            >
                <div className="flex items-center justify-between mb-4">
                    <div
                        className="p-3 rounded-xl"
                        style={{ backgroundColor: colors.primary[100] }}
                    >
                        <DollarSign className="w-6 h-6" style={{ color: colors.primary[600] }} />
                    </div>
                    <span
                        className="text-xs font-semibold px-2 py-1 rounded"
                        style={{ backgroundColor: colors.primary[100], color: colors.primary[700] }}
                    >
                        2026-01
                    </span>
                </div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Payroll</h3>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">
                    Rs. {stats.totalPayroll.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500 mt-1">{stats.processedCount} salaries processed</p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-xl">
                        <DollarSign className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                    </div>
                </div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Average Salary</h3>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">
                    Rs. {stats.averageSalary.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500 mt-1">Per employee this month</p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                    <div
                        className="p-3 rounded-xl"
                        style={{ backgroundColor: colors.success[100] }}
                    >
                        <UserCheck className="w-6 h-6" style={{ color: colors.success[600] }} />
                    </div>
                    <div
                        className="p-3 rounded-full"
                        style={{ backgroundColor: colors.success[50] }}
                    >
                        <Users className="w-4 h-4" style={{ color: colors.success[600] }} />
                    </div>
                </div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Headcount</h3>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">
                    {stats.activeHeadcount}
                </p>
                <p className="text-xs text-gray-500 mt-1">{stats.eligibleForPayroll} Eligible for payroll</p>
            </div>
        </div>
    );
};
