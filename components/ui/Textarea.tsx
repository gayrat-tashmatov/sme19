'use client';

import { forwardRef, TextareaHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  hint?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { label, hint, error, className, id, ...rest },
  ref,
) {
  return (
    <label className="block">
      {label && <span className="block text-sm font-medium text-ink mb-1.5">{label}</span>}
      <textarea
        ref={ref}
        id={id ?? rest.name}
        className={cn(
          'block w-full rounded-lg bg-bg-white border border-ink-line px-3.5 py-3 text-[15px] text-ink placeholder:text-ink-muted/60 min-h-[96px] resize-y',
          'focus-ring focus-visible:border-gold',
          error && 'border-danger/50',
          className,
        )}
        {...rest}
      />
      {error ? (
        <span className="block mt-1.5 text-xs text-danger">{error}</span>
      ) : hint ? (
        <span className="block mt-1.5 text-xs text-ink-muted">{hint}</span>
      ) : null}
    </label>
  );
});
