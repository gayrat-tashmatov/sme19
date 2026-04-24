'use client';

import { forwardRef, InputHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/cn';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: ReactNode;
  rightAddon?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, hint, leftIcon, rightAddon, className, id, ...rest },
  ref,
) {
  const uid = id ?? rest.name;
  return (
    <label className="block">
      {label && <span className="block text-sm font-medium text-ink mb-1.5">{label}</span>}
      <div className="relative flex items-stretch">
        {leftIcon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted pointer-events-none">
            {leftIcon}
          </span>
        )}
        <input
          ref={ref}
          id={uid}
          className={cn(
            'block w-full rounded-lg bg-bg-white border border-ink-line px-3.5 h-11 text-[15px] text-ink placeholder:text-ink-muted/60',
            'focus-ring focus-visible:border-gold',
            leftIcon && 'pl-10',
            rightAddon && 'rounded-r-none',
            error && 'border-danger/50 focus-visible:border-danger',
            className,
          )}
          {...rest}
        />
        {rightAddon && (
          <span className="inline-flex items-center rounded-r-lg border border-l-0 border-ink-line bg-bg-band px-3 text-sm text-ink-muted">
            {rightAddon}
          </span>
        )}
      </div>
      {error ? (
        <span className="block mt-1.5 text-xs text-danger">{error}</span>
      ) : hint ? (
        <span className="block mt-1.5 text-xs text-ink-muted">{hint}</span>
      ) : null}
    </label>
  );
});
