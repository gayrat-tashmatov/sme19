import { Inbox } from 'lucide-react';
import { cn } from '@/lib/cn';

interface EmptyStateProps {
  title: string;
  description?: string;
  className?: string;
}

export function EmptyState({ title, description, className }: EmptyStateProps) {
  return (
    <div className={cn('text-center py-12 px-4 rounded-xl border border-dashed border-ink-line bg-bg', className)}>
      <div className="inline-flex h-12 w-12 rounded-full bg-ink-line/60 text-ink-muted items-center justify-center mb-3">
        <Inbox className="h-5 w-5" />
      </div>
      <div className="font-serif font-semibold text-ink">{title}</div>
      {description && <p className="mt-1.5 text-sm text-ink-muted max-w-sm mx-auto">{description}</p>}
    </div>
  );
}
