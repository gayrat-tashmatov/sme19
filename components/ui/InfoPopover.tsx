'use client';

import { useState, useRef, useEffect } from 'react';
import { Info } from 'lucide-react';
import { cn } from '@/lib/cn';

interface Props {
  /** Short title shown in bold. */
  title: string;
  /** The "what is it" explanation. */
  whatIs: string;
  /** When it's relevant. */
  whenNeeded?: string;
  /** Concrete example to make it tangible. */
  example?: string;
  /** Visual size. */
  size?: 'sm' | 'md';
  /** Optional custom styling colour theme. */
  tone?: 'gold' | 'navy' | 'neutral';
}

/**
 * Tiny "i" button that opens a popover with explanation.
 * Designed for financial instruments (factoring, leasing, overdraft)
 * or any concept that beginners might not understand.
 */
export function InfoPopover({
  title, whatIs, whenNeeded, example,
  size = 'sm', tone = 'gold',
}: Props) {
  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const popRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (
        btnRef.current && !btnRef.current.contains(e.target as Node) &&
        popRef.current && !popRef.current.contains(e.target as Node)
      ) setOpen(false);
    };
    const onEsc = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onEsc);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onEsc);
    };
  }, [open]);

  const iconSizeClass = size === 'sm' ? 'h-3.5 w-3.5' : 'h-4 w-4';
  const buttonSizeClass = size === 'sm' ? 'h-5 w-5' : 'h-6 w-6';

  const toneClasses = {
    gold:    'text-gold hover:bg-gold/10 hover:text-gold-dark',
    navy:    'text-navy hover:bg-navy/10',
    neutral: 'text-ink-muted hover:bg-bg-band hover:text-ink',
  };

  return (
    <span className="relative inline-flex items-center align-middle">
      <button
        ref={btnRef}
        type="button"
        onClick={(e) => { e.stopPropagation(); setOpen(!open); }}
        className={cn(
          'rounded-full flex items-center justify-center transition-colors focus-ring',
          buttonSizeClass,
          toneClasses[tone],
        )}
        aria-label={`Что такое ${title}`}
      >
        <Info className={iconSizeClass} />
      </button>

      {open && (
        <div
          ref={popRef}
          className="absolute top-full left-0 mt-2 w-72 md:w-80 z-50 p-4 bg-bg-white rounded-xl shadow-2xl border border-ink-line text-left animate-fade-in"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="font-serif font-semibold text-[14px] text-ink mb-2">{title}</div>

          <div className="space-y-2 text-[12.5px] leading-relaxed">
            <div>
              <div className="text-[10px] uppercase tracking-wider text-gold font-semibold mb-0.5">Что это</div>
              <div className="text-ink">{whatIs}</div>
            </div>
            {whenNeeded && (
              <div>
                <div className="text-[10px] uppercase tracking-wider text-gold font-semibold mb-0.5">Когда нужно</div>
                <div className="text-ink">{whenNeeded}</div>
              </div>
            )}
            {example && (
              <div className="pt-2 border-t border-ink-line">
                <div className="text-[10px] uppercase tracking-wider text-gold font-semibold mb-0.5">Пример</div>
                <div className="text-ink-muted italic">{example}</div>
              </div>
            )}
          </div>
        </div>
      )}
    </span>
  );
}
