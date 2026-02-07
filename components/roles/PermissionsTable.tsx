import React, { useState } from 'react';
import { Check, ChevronDown, Shield, ShieldAlert, ShieldCheck } from 'lucide-react';
import { Permission, Privilege } from '../../types/role.types';
import { authService } from '../../services/auth.service';

interface PermissionsTableProps {
    permissions: Permission[];
    availablePrivileges: Privilege[];
    allPrivileges?: Privilege[];    // Add this for filtering
    onChange?: (moduleIndex: number, privilegeName: string, value: boolean) => void;
    readOnly?: boolean;
}

export function PermissionsTable({ permissions, availablePrivileges, allPrivileges = [], onChange, readOnly = false }: PermissionsTableProps) {
    const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({});

    const toggleModule = (module: string) => {
        setExpandedModules(prev => ({
            ...prev,
            [module]: !prev[module]
        }));
    };

    const getActiveCount = (perm: Permission) => {
        return Object.values(perm.permissions).filter(Boolean).length;
    };

    // Helper to get allowed actions specifically for THIS module
    const getModuleActions = (moduleName: string) => {
        if (allPrivileges.length > 0) {
            const moduleSpecific = allPrivileges.filter(p => p.module === moduleName);
            const validSuffixes = moduleSpecific.map(p => p.name.split('.').pop());
            return availablePrivileges.filter(p => validSuffixes.includes(p.name));
        }
        return availablePrivileges;
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-1">
            {permissions.map((perm, modIdx) => {
                const isExpanded = expandedModules[perm.module];
                const activeCount = getActiveCount(perm);
                const hasUnauthorized = Object.entries(perm.permissions).some(([privName, isChecked]) =>
                    isChecked && !authService.hasModulePermission(perm.module, privName)
                );

                const moduleActions = getModuleActions(perm.module);
                if (moduleActions.length === 0 && allPrivileges.length > 0) return null;

                return (
                    <div
                        key={perm.module}
                        className={`group flex flex-col bg-white dark:bg-gray-800 rounded-[2rem] border transition-all duration-300 ${isExpanded
                            ? 'ring-2 ring-blue-500/20 border-blue-500/30 shadow-xl shadow-blue-500/5'
                            : 'border-gray-100 dark:border-gray-700/50 hover:border-gray-200 dark:hover:border-gray-600'
                            }`}
                    >
                        {/* Card Header - Clickable to Expand */}
                        <div
                            onClick={() => toggleModule(perm.module)}
                            className="p-5 flex items-center justify-between cursor-pointer select-none"
                        >
                            <div className="flex items-center gap-3">
                                <div className={`p-2.5 rounded-xl transition-colors ${isExpanded ? 'bg-blue-600 text-white' : 'bg-gray-50 dark:bg-gray-900 text-gray-400 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 group-hover:text-blue-500'
                                    }`}>
                                    {hasUnauthorized ? <ShieldAlert size={18} /> : activeCount > 0 ? <ShieldCheck size={18} /> : <Shield size={18} />}
                                </div>
                                <div>
                                    <h4 className="text-sm font-black text-gray-900 dark:text-white capitalize tracking-tight leading-none">
                                        {perm.module.replace(/_/g, ' ')}
                                    </h4>
                                    <div className="flex items-center gap-2 mt-1.5">
                                        <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${activeCount > 0 ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600' : 'bg-gray-50 dark:bg-gray-900 text-gray-400'
                                            }`}>
                                            {activeCount} Permissions Active
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className={`p-1.5 rounded-lg text-gray-300 dark:text-gray-600 transition-transform duration-300 ${isExpanded ? 'rotate-180 text-blue-500' : ''}`}>
                                <ChevronDown size={18} />
                            </div>
                        </div>

                        {/* Expandable Content Area */}
                        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0 pointer-events-none'}`}>
                            <div className="px-5 pb-6 pt-2 border-t border-gray-50 dark:border-gray-700/30 mt-1">
                                <div className="space-y-3">
                                    {moduleActions.map(priv => {
                                        const isChecked = perm.permissions[priv.name] || false;
                                        const userHasPermission = authService.hasModulePermission(perm.module, priv.name);
                                        const isUnauthorized = isChecked && !userHasPermission;

                                        return (
                                            <div
                                                key={priv.id}
                                                className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${isChecked
                                                    ? isUnauthorized
                                                        ? 'bg-red-50/30 dark:bg-red-900/10 border-red-100 dark:border-red-900/30'
                                                        : 'bg-blue-50/30 dark:bg-blue-900/10 border-blue-100/50 dark:border-blue-900/30'
                                                    : 'bg-gray-50/30 dark:bg-gray-900/20 border-transparent hover:border-gray-100 dark:hover:border-gray-700'
                                                    }`}
                                            >
                                                <div className="flex flex-col min-w-0">
                                                    <span className={`text-[11px] font-bold tracking-wide capitalize ${isUnauthorized ? 'text-red-600' : isChecked ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'
                                                        }`}>
                                                        {priv.name.replace(/_/g, ' ')}
                                                    </span>
                                                </div>

                                                {readOnly ? (
                                                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all ${isChecked
                                                        ? isUnauthorized ? 'bg-red-500 text-white' : 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                                                        : 'bg-gray-100 dark:bg-gray-700/50 text-transparent'
                                                        }`}>
                                                        <Check size={14} strokeWidth={4} />
                                                    </div>
                                                ) : (
                                                    <button
                                                        type="button"
                                                        disabled={!userHasPermission && !isChecked}
                                                        onClick={() => {
                                                            if (userHasPermission || isChecked) {
                                                                onChange?.(modIdx, priv.name, !isChecked);
                                                            }
                                                        }}
                                                        className={`relative w-11 h-6 rounded-full transition-all flex items-center px-1 ${isChecked
                                                            ? isUnauthorized ? 'bg-red-500' : 'bg-blue-600'
                                                            : 'bg-gray-200 dark:bg-gray-700'
                                                            } ${!userHasPermission && !isChecked ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'}`}
                                                    >
                                                        <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-all transform ${isChecked ? 'translate-x-5' : 'translate-x-0'}`} />
                                                    </button>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>

                                {!readOnly && (
                                    <div className="mt-5 pt-4 border-t border-gray-50 dark:border-gray-700/30 flex items-center justify-between">
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                moduleActions.forEach(p => {
                                                    if (authService.hasModulePermission(perm.module, p.name)) {
                                                        onChange?.(modIdx, p.name, true);
                                                    }
                                                });
                                            }}
                                            className="text-[9px] font-black uppercase tracking-[0.2em] text-blue-600 hover:text-blue-700 transition-colors"
                                        >
                                            Select All Allowed
                                        </button>
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                moduleActions.forEach(p => onChange?.(modIdx, p.name, false));
                                            }}
                                            className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-gray-600 transition-colors"
                                        >
                                            Clear All
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
