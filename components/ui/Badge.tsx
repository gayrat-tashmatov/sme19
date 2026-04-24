import { HTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

type BadgeVariant =
  | 'info'
  | 'success'
  | 'warning'
  | 'queue'
  | 'priority'
  | 'priority-solid'
  | 'danger'
  | 'outline'
  | 'new';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const VARIANTS: Record<BadgeVariant, string> = {
  info: 'bg-secondary/10 text-secondary border-secondary/20',
  success: 'bg-success/10 text-success border-success/20',
  warning: 'bg-gold/10 text-gold border-gold/20',
  queue: 'bg-ink-line text-ink-muted border-ink-line',
  priority: 'bg-gold/10 text-gold-dark border-gold/30',
  'priority-solid': 'bg-gold text-white border-gold',
  danger: 'bg-danger/10 text-danger border-danger/20',
  outline: 'bg-transparent text-ink-muted border-ink-line',
  new: 'bg-success text-white border-success shadow-sm',
};

export function Badge({ variant = 'info', className, ...rest }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium whitespace-nowrap',
        VARIANTS[variant],
        className,
      )}
      {...rest}
    />
  );
}
