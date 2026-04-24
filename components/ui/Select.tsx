'use client';

import { forwardRef, SelectHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';
import { ChevronDown } from 'lucide-react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { value: string; label: string }[];
  hint?: string;
  error?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { label, options, hint, error, className, id, ...rest },
  ref,
) {
  return (
    <label className="block">
      {label && <span className="block text-sm font-medium text-ink mb-1.5">{label}</span>}
      <div className="relative">
        <select
          ref={ref}
          id={id ?? rest.name}
          className={cn(
            'appearance-none block w-full rounded-lg bg-bg-white border border-ink-line px-3.5 pr-10 h-11 text-[15px] text-ink',
            'focus-ring focus-visible:border-gold',
            error && 'border-danger/50',
            className,
          )}
          {...rest}
        >
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-muted pointer-events-none" />
      </div>
      {error ? (
        <span className="block mt-1.5 text-xs text-danger">{error}</span>
      ) : hint ? (
        <span className="block mt-1.5 text-xs text-ink-muted">{hint}</span>
      ) : null}
    </label>
  );
});
