import { cn } from '@/lib/cn';
import { Check, Clock, AlertTriangle, X, Eye, Hourglass } from 'lucide-react';

type Status =
  | 'draft'
  | 'submitted'
  | 'in-review'
  | 'approved'
  | 'rejected'
  | 'overdue'
  | 'paid';

interface StatusPillProps {
  status: Status;
  label: string;
  className?: string;
}

const CONFIG: Record<Status, { cls: string; Icon: typeof Check }> = {
  draft: { cls: 'bg-ink-line text-ink-muted', Icon: Eye },
  submitted: { cls: 'bg-secondary/15 text-secondary', Icon: Hourglass },
  'in-review': { cls: 'bg-gold/15 text-gold-dark', Icon: Clock },
  approved: { cls: 'bg-success/15 text-success', Icon: Check },
  rejected: { cls: 'bg-danger/15 text-danger', Icon: X },
  overdue: { cls: 'bg-danger/10 text-danger border border-danger/20', Icon: AlertTriangle },
  paid: { cls: 'bg-success/20 text-success border border-success/30', Icon: Check },
};

export function StatusPill({ status, label, className }: StatusPillProps) {
  const { cls, Icon } = CONFIG[status];
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium',
        cls,
        className,
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      {label}
    </span>
  );
}
