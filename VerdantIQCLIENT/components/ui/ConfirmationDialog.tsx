'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle, ShieldAlert, X, Info, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

export interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title: string;
  description: string | React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
  isLoading?: boolean;
  icon?: React.ReactNode;
  requireTypedConfirmation?: string;
  badgeText?: string;
}

export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Confirm Action',
  cancelText = 'Cancel',
  variant = 'danger',
  isLoading = false,
  icon,
  requireTypedConfirmation,
  badgeText,
}) => {
  const [typedValue, setTypedValue] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset typed input when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setTypedValue('');
      setIsSubmitting(false);
    }
  }, [isOpen]);

  // Handle ESC key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !isLoading && !isSubmitting) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isLoading, isSubmitting, onClose]);

  const handleConfirmClick = async () => {
    if (requireTypedConfirmation && typedValue.trim().toLowerCase() !== requireTypedConfirmation.trim().toLowerCase()) {
      return;
    }
    try {
      setIsSubmitting(true);
      await onConfirm();
    } finally {
      setIsSubmitting(false);
      onClose();
    }
  };

  const isConfirmDisabled = Boolean(
    isLoading ||
    isSubmitting ||
    (requireTypedConfirmation && typedValue.trim().toLowerCase() !== requireTypedConfirmation.trim().toLowerCase())
  );

  const getVariantStyles = () => {
    switch (variant) {
      case 'danger':
        return {
          iconBox: 'bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800',
          borderAccent: 'border-rose-300 dark:border-rose-800/80',
          badgeVariant: 'coral' as const,
          defaultBadge: 'DESTRUCTIVE ACTION',
          confirmButtonVariant: 'rose' as const,
          defaultIcon: <ShieldAlert className="h-5 w-5" />,
          warningBox: 'bg-rose-50 dark:bg-rose-950/50 border-rose-200 dark:border-rose-900/60 text-rose-900 dark:text-rose-200',
        };
      case 'warning':
        return {
          iconBox: 'bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800',
          borderAccent: 'border-amber-300 dark:border-amber-800/80',
          badgeVariant: 'amber' as const,
          defaultBadge: 'WARNING REQUIRED',
          confirmButtonVariant: 'amber' as const,
          defaultIcon: <AlertTriangle className="h-5 w-5" />,
          warningBox: 'bg-amber-50 dark:bg-amber-950/50 border-amber-200 dark:border-amber-900/60 text-amber-900 dark:text-amber-200',
        };
      case 'info':
      default:
        return {
          iconBox: 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
          borderAccent: 'border-emerald-300 dark:border-emerald-800/80',
          badgeVariant: 'emerald' as const,
          defaultBadge: 'ADMIN CONFIRMATION',
          confirmButtonVariant: 'primary' as const,
          defaultIcon: <Info className="h-5 w-5" />,
          warningBox: 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-900/60 text-emerald-900 dark:text-emerald-200',
        };
    }
  };

  const vStyles = getVariantStyles();

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop Blur Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => !isLoading && !isSubmitting && onClose()}
            className="fixed inset-0 bg-stone-950/75 backdrop-blur-md cursor-pointer"
          />

          {/* Dialog Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className={`relative w-full max-w-md bg-white dark:bg-stone-900 border ${vStyles.borderAccent} rounded-3xl p-6 shadow-2xl z-10 space-y-5 overflow-hidden`}
          >
            {/* Top Accent Line */}
            <div
              className={`absolute top-0 left-0 right-0 h-1.5 ${
                variant === 'danger'
                  ? 'bg-rose-600'
                  : variant === 'warning'
                  ? 'bg-amber-500'
                  : 'bg-emerald-600'
              }`}
            />

            {/* Header Area */}
            <div className="flex items-start justify-between gap-3 pt-1">
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-2xl border ${vStyles.iconBox} shadow-xs shrink-0`}>
                  {icon || vStyles.defaultIcon}
                </div>
                <div>
                  <Badge variant={vStyles.badgeVariant}>
                    {badgeText || vStyles.defaultBadge}
                  </Badge>
                  <h3 className="font-editorial text-lg font-bold text-stone-900 dark:text-stone-100 tracking-tight mt-1">
                    {title}
                  </h3>
                </div>
              </div>

              <button
                onClick={onClose}
                disabled={isLoading || isSubmitting}
                className="p-1 rounded-xl text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 transition-colors cursor-pointer disabled:opacity-40"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Content Description */}
            <div className={`p-3.5 rounded-2xl border text-xs leading-relaxed font-sans ${vStyles.warningBox}`}>
              {typeof description === 'string' ? <p>{description}</p> : description}
            </div>

            {/* Optional Typed Confirmation Input */}
            {requireTypedConfirmation && (
              <div className="space-y-1.5 bg-stone-50 dark:bg-stone-950 p-3 rounded-2xl border border-stone-200 dark:border-stone-800 text-xs">
                <label className="font-semibold text-stone-700 dark:text-stone-300 block">
                  Confirmation Keyword Required:
                </label>
                <p className="text-[11px] text-stone-500 dark:text-stone-400">
                  To prevent accidental execution, type <strong className="font-mono text-stone-900 dark:text-stone-100 bg-stone-200 dark:bg-stone-800 px-1 py-0.5 rounded">{requireTypedConfirmation}</strong> below:
                </p>
                <input
                  type="text"
                  value={typedValue}
                  onChange={(e) => setTypedValue(e.target.value)}
                  placeholder={`Type "${requireTypedConfirmation}"`}
                  className="w-full px-3 py-2 bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-xl font-mono text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-rose-500"
                  autoFocus
                />
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-stone-200 dark:border-stone-800">
              <Button
                variant="outline"
                size="md"
                onClick={onClose}
                disabled={isLoading || isSubmitting}
                className="text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800"
              >
                {cancelText}
              </Button>

              <Button
                variant={vStyles.confirmButtonVariant}
                size="md"
                onClick={handleConfirmClick}
                disabled={isConfirmDisabled}
                isLoading={isLoading || isSubmitting}
                className="font-semibold shadow-md cursor-pointer"
              >
                {confirmText}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
