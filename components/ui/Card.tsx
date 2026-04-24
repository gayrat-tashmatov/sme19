'use client';

import { forwardRef, HTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  tone?: 'default' | 'muted' | 'gold' | 'navy';
}

const PADDING = {
  none: '',
  sm: 'p-4',
  md: 'p-5 md:p-6',
  lg: 'p-6 md:p-8',
};

const TONE = {
  default: 'bg-bg-white border-ink-line',
  muted: 'bg-bg-band border-ink-line',
  gold: 'bg-gold-soft border-gold/30',
  navy: 'bg-navy text-white border-navy-700',
};

export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  { hover, padding = 'md', tone = 'default', className, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cn(
        'rounded-xl border shadow-card',
        TONE[tone],
        PADDING[padding],
        hover && 'hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200 cursor-pointer',
        className,
      )}
      {...rest}
    />
  );
});

export function CardTitle({ className, ...rest }: HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn('font-serif text-lg md:text-xl font-semibold text-ink', className)} {...rest} />;
}

export function CardDescription({ className, ...rest }: HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn('text-sm text-ink-muted mt-1.5 leading-relaxed', className)} {...rest} />;
}

export function CardFooter({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('mt-4 pt-4 border-t border-ink-line flex items-center justify-between gap-2', className)}
      {...rest}
    />
  );
}
