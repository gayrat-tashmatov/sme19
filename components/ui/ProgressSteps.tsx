import { cn } from '@/lib/cn';
import { Check } from 'lucide-react';

interface Step {
  id: string | number;
  label: string;
  description?: string;
}

interface ProgressStepsProps {
  steps: Step[];
  current: number; // 0-based
  className?: string;
}

export function ProgressSteps({ steps, current, className }: ProgressStepsProps) {
  return (
    <ol className={cn('flex items-start w-full', className)}>
      {steps.map((s, i) => {
        const done = i < current;
        const active = i === current;
        const last = i === steps.length - 1;
        return (
          <li key={s.id} className={cn('flex-1 flex items-start', !last && 'relative')}>
            <div className="flex flex-col items-center w-auto">
              <div
                className={cn(
                  'h-9 w-9 rounded-full flex items-center justify-center font-serif font-semibold border-2 transition-colors',
                  done && 'bg-success text-white border-success',
                  active && 'bg-gold text-white border-gold shadow-card',
                  !done && !active && 'bg-bg-white text-ink-muted border-ink-line',
                )}
              >
                {done ? <Check className="h-4 w-4" /> : i + 1}
              </div>
              <div className={cn('mt-2 text-center max-w-[140px]', active ? 'text-ink' : 'text-ink-muted')}>
                <div className="text-sm font-medium">{s.label}</div>
                {s.description && <div className="text-xs mt-0.5 text-ink-muted leading-snug">{s.description}</div>}
              </div>
            </div>
            {!last && (
              <div className="flex-1 h-0.5 mt-[18px] mx-2 bg-bg-band relative overflow-hidden">
                <div
                  className={cn('absolute inset-y-0 left-0 bg-gold transition-all duration-500')}
                  style={{ width: done ? '100%' : active ? '50%' : '0%' }}
                />
              </div>
            )}
          </li>
        );
      })}
    </ol>
  );
}
