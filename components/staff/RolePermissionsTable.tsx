import { Permission } from '../../types/staff.types';
import { colors } from '@/themes/colors';

interface RolePermissionsTableProps {
    roles: string[];
    permissions: Permission[];
}

export function RolePermissionsTable({ roles, permissions }: RolePermissionsTableProps) {
    return (
        <div className="p-6">
            <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">Available Roles</h3>
                <div className="flex flex-wrap gap-2">
                    {roles.map((role: any) => (
                        <button
                            key={role.id || role}
                            className="px-3 py-1.5 rounded-lg transition-colors text-sm font-medium"
                            style={{ backgroundColor: colors.primary[50], color: colors.primary[600] }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.primary[100]}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = colors.primary[50]}
                        >
                            {role.display_name || role}
                        </button>
                    ))}
                </div>
            </div>

            <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                <div className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
                    <div className="grid grid-cols-5 gap-4 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">
                        <div className="col-span-1">Module</div>
                        <div className="col-span-1 text-center">View</div>
                        <div className="col-span-1 text-center">Create</div>
                        <div className="col-span-1 text-center">Edit</div>
                        <div className="col-span-1 text-center">Delete</div>
                    </div>
                </div>
                <div className="divide-y divide-gray-100 dark:divide-gray-700">
                    {permissions.map((perm, index) => (
                        <div key={index} className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                            <div className="grid grid-cols-5 gap-4 items-center">
                                <div className="col-span-1">
                                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{perm.module}</p>
                                </div>
                                <div className="col-span-1 flex justify-center">
                                    <input
                                        type="checkbox"
                                        checked={perm.view}
                                        readOnly
                                        className="w-4 h-4 rounded border-gray-300 dark:border-gray-600"
                                        style={{ accentColor: colors.primary[600] }}
                                    />
                                </div>
                                <div className="col-span-1 flex justify-center">
                                    <input
                                        type="checkbox"
                                        checked={perm.create}
                                        readOnly
                                        className="w-4 h-4 rounded border-gray-300 dark:border-gray-600"
                                        style={{ accentColor: colors.primary[600] }}
                                    />
                                </div>
                                <div className="col-span-1 flex justify-center">
                                    <input
                                        type="checkbox"
                                        checked={perm.edit}
                                        readOnly
                                        className="w-4 h-4 rounded border-gray-300 dark:border-gray-600"
                                        style={{ accentColor: colors.primary[600] }}
                                    />
                                </div>
                                <div className="col-span-1 flex justify-center">
                                    <input
                                        type="checkbox"
                                        checked={perm.delete}
                                        readOnly
                                        className="w-4 h-4 rounded border-gray-300 dark:border-gray-600"
                                        style={{ accentColor: colors.primary[600] }}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="mt-4 flex justify-end">
                <button
                    className="px-4 py-2 text-white rounded-lg transition-colors text-sm font-medium"
                    style={{ backgroundColor: colors.primary[600] }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.primary[700]}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = colors.primary[600]}
                >
                    Save Permissions
                </button>
            </div>
        </div>
    );
}
