import React from 'react';
import { Users, UserCheck, Shield } from 'lucide-react';
import { colors } from '@/themes/colors';
import { StaffStats } from '../../types/staff.types';

interface StaffStatsProps {
    stats: StaffStats;
}

export function StaffStatsCard({ stats }: StaffStatsProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-card rounded-lg border border-border-default/50 p-5 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                    <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: colors.primary[50], color: colors.primary[600] }}
                    >
                        <Users className="w-5 h-5" />
                    </div>
                </div>
                <p className="text-sm text-text-muted mb-1">Total Users</p>
                <p className="text-2xl font-bold text-text-primary">{stats.totalUsers}</p>
            </div>

            <div className="bg-card rounded-lg border border-border-default/50 p-5 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                    <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: colors.success[50] }}
                    >
                        <UserCheck className="w-5 h-5" style={{ color: colors.success[600] }} />
                    </div>
                    <span className="text-xs font-medium text-text-muted">
                        {stats.totalUsers > 0 ? ((stats.activeUsers / stats.totalUsers) * 100).toFixed(0) : 0}%
                    </span>
                </div>
                <p className="text-sm text-text-muted mb-1">Active Users</p>
                <p className="text-2xl font-bold text-text-primary">{stats.activeUsers}</p>
            </div>

            <div className="bg-card rounded-lg border border-border-default/50 p-5 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                    <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: `${colors.primary[100]}80` }}
                    >
                        <Shield className="w-5 h-5" style={{ color: colors.primary[600] }} />
                    </div>
                </div>
                <p className="text-sm text-text-muted mb-1">User Roles</p>
                <p className="text-2xl font-bold text-text-primary">{stats.totalRoles}</p>
            </div>
        </div>
    );
}
