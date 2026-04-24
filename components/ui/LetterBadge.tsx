import { cn } from '@/lib/cn';

interface LetterBadgeProps {
  letter: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'gold' | 'navy' | 'outline';
  className?: string;
}

const SIZES = {
  sm: 'w-8 h-8 text-sm',
  md: 'w-10 h-10 text-lg',
  lg: 'w-14 h-14 text-2xl',
};

const VARIANTS = {
  gold: 'bg-gold/10 text-gold border-gold/20',
  navy: 'bg-navy text-white border-navy-700',
  outline: 'bg-bg-white text-ink border-ink-line',
};

export function LetterBadge({ letter, size = 'md', variant = 'gold', className }: LetterBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center justify-center rounded-full border font-serif font-semibold select-none',
        SIZES[size],
        VARIANTS[variant],
        className,
      )}
      aria-hidden
    >
      {letter}
    </span>
  );
}
