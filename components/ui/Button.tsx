'use client';

import { forwardRef, ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { Loader2 } from 'lucide-react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline-white';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
}

const VARIANT: Record<Variant, string> = {
  primary:
    'bg-gold text-white hover:bg-gold-dark active:bg-gold-dark shadow-subtle hover:shadow-card',
  secondary:
    'bg-navy text-white hover:bg-navy-700 active:bg-navy shadow-subtle hover:shadow-card',
  ghost: 'bg-transparent text-navy hover:bg-bg-band',
  danger: 'bg-danger text-white hover:brightness-95 shadow-subtle',
  'outline-white':
    'bg-transparent text-white border border-white/60 hover:bg-white/10',
};

const SIZE: Record<Size, string> = {
  sm: 'h-9 px-3.5 text-sm rounded-lg gap-1.5',
  md: 'h-11 px-5 text-[15px] rounded-lg gap-2',
  lg: 'h-13 px-7 text-base rounded-xl gap-2.5',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = 'primary',
    size = 'md',
    loading,
    leftIcon,
    rightIcon,
    fullWidth,
    className,
    disabled,
    children,
    ...rest
  },
  ref,
) {
  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={cn(
        'inline-flex items-center justify-center font-medium tracking-tight',
        'transition-all duration-150 focus-ring',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        VARIANT[variant],
        SIZE[size],
        fullWidth && 'w-full',
        className,
      )}
      {...rest}
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : leftIcon}
      {children}
      {!loading && rightIcon}
    </button>
  );
});
