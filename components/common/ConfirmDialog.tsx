'use client'

import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmDialogProps {
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel: () => void;
    variant?: 'danger' | 'warning' | 'info';
}

export function ConfirmDialog({
    isOpen,
    title,
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    onConfirm,
    onCancel,
    variant = 'warning'
}: ConfirmDialogProps) {
    if (!isOpen) return null;

    const variantStyles = {
        danger: {
            icon: 'bg-red-100 dark:bg-red-900/20',
            iconColor: 'text-red-600 dark:text-red-400',
            button: 'bg-red-600 hover:bg-red-700'
        },
        warning: {
            icon: 'bg-amber-100 dark:bg-amber-900/20',
            iconColor: 'text-amber-600 dark:text-amber-400',
            button: 'bg-amber-600 hover:bg-amber-700'
        },
        info: {
            icon: 'bg-blue-100 dark:bg-blue-900/20',
            iconColor: 'text-blue-600 dark:text-blue-400',
            button: 'bg-blue-600 hover:bg-blue-700'
        }
    };

    const styles = variantStyles[variant];

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-card rounded-lg max-w-md w-full shadow-xl border border-border-default">
                <div className="p-6">
                    <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 ${styles.icon} rounded-full flex items-center justify-center flex-shrink-0`}>
                            <AlertTriangle className={`w-6 h-6 ${styles.iconColor}`} />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-semibold text-text-primary mb-2">
                                {title}
                            </h3>
                            <p className="text-sm text-text-secondary">
                                {message}
                            </p>
                        </div>
                        <button
                            onClick={onCancel}
                            className="p-1 hover:bg-hover rounded transition-colors"
                        >
                            <X className="w-5 h-5 text-text-muted" />
                        </button>
                    </div>
                </div>

                <div className="p-4 border-t border-border-default flex gap-3 justify-end bg-table-header">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 border border-border-input rounded-lg hover:bg-hover transition-colors font-medium text-sm text-text-secondary"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={() => {
                            onConfirm();
                            onCancel();
                        }}
                        className={`px-4 py-2 text-white rounded-lg transition-colors font-medium text-sm ${styles.button}`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}
