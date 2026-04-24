'use client';

import { useState, ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { motion } from 'framer-motion';

export interface TabItem {
  id: string;
  label: string;
  icon?: ReactNode;
}

interface TabsProps {
  items: TabItem[];
  value: string;
  onChange: (id: string) => void;
  size?: 'md' | 'lg';
  className?: string;
}

export function Tabs({ items, value, onChange, size = 'md', className }: TabsProps) {
  return (
    <div className={cn('border-b border-ink-line', className)}>
      <div className="flex gap-1 overflow-x-auto scrollbar-slim -mb-px" role="tablist">
        {items.map((t) => {
          const active = t.id === value;
          return (
            <button
              key={t.id}
              role="tab"
              aria-selected={active}
              onClick={() => onChange(t.id)}
              className={cn(
                'relative flex items-center gap-2 px-4 font-medium transition-colors focus-ring whitespace-nowrap',
                size === 'lg' ? 'h-12 text-[15px]' : 'h-11 text-sm',
                active ? 'text-navy' : 'text-ink-muted hover:text-ink',
              )}
            >
              {t.icon}
              {t.label}
              {active && (
                <motion.span
                  layoutId="tab-indicator"
                  className="absolute inset-x-1.5 -bottom-px h-0.5 bg-gold rounded-full"
                  transition={{ type: 'spring', stiffness: 500, damping: 40 }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function TabPanel({ active, children, className }: { active: boolean; children: ReactNode; className?: string }) {
  if (!active) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className={cn('pt-6', className)}
    >
      {children}
    </motion.div>
  );
}

/** Simple hook to manage tab state. */
export function useTabs(initial: string) {
  return useState(initial);
}
