'use client';

import { ReactNode, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/lib/cn';

interface DialogProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg';
  footer?: ReactNode;
}

const SIZE = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
};

export function Dialog({ open, onClose, title, description, children, size = 'md', footer }: DialogProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          role="dialog"
          aria-modal
        >
          <div
            className="absolute inset-0 bg-navy/60 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden
          />
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className={cn(
              'relative w-full bg-bg-white rounded-2xl shadow-card-hover border border-ink-line overflow-hidden',
              SIZE[size],
            )}
          >
            {(title || description) && (
              <div className="px-6 pt-6 pb-4 border-b border-ink-line">
                {title && <h3 className="font-serif text-xl font-semibold text-ink">{title}</h3>}
                {description && <p className="text-sm text-ink-muted mt-1.5">{description}</p>}
              </div>
            )}
            <button
              onClick={onClose}
              aria-label="Close"
              className="absolute top-4 right-4 h-9 w-9 flex items-center justify-center rounded-full hover:bg-bg-band text-ink-muted focus-ring"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="px-6 py-5 max-h-[70vh] overflow-y-auto scrollbar-slim">{children}</div>
            {footer && <div className="px-6 py-4 border-t border-ink-line bg-bg-band flex justify-end gap-2">{footer}</div>}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
