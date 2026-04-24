'use client';

import { useState, useRef, useEffect } from 'react';
import { ArrowUpRight, ArrowDownRight, RefreshCw, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/cn';

// Demo data — in production, fetched from cbu.uz API
const CURRENCIES = [
  { code: 'USD', name: 'Доллар США',  rate: 12126.10, diff: -32.49,  prev: 12158.59 },
  { code: 'EUR', name: 'Евро',        rate: 14171.77, diff: -67.15,  prev: 14238.92 },
  { code: 'RUB', name: 'Рос. рубль',   rate: 159.11,   diff: 1.23,    prev: 157.88  },
];

// Date when rates were "updated" (demo)
const UPDATE_DATE = '22 апреля 2026';

export function CurrencyWidget() {
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

  // Only show USD on trigger button to save space
  const usd = CURRENCIES[0];
  const isUp = usd.diff > 0;

  return (
    <div className="relative">
      <button
        ref={btnRef}
        onClick={() => setOpen(!open)}
        className={cn(
          'flex items-center gap-1.5 px-2.5 h-9 rounded-lg border transition-all text-sm font-mono',
          open
            ? 'bg-gold-soft/60 border-gold/40 text-ink'
            : 'bg-bg-white border-ink-line text-ink-muted hover:border-gold/40 hover:text-ink',
        )}
        aria-label="Курс валют ЦБ РУз"
      >
        <span className="text-[10.5px] uppercase tracking-wider text-gold font-semibold font-sans">USD</span>
        <span className="font-semibold">{usd.rate.toLocaleString('ru', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        {isUp
          ? <ArrowUpRight className="h-3 w-3 text-success" />
          : <ArrowDownRight className="h-3 w-3 text-danger" />}
      </button>

      {open && (
        <div
          ref={popRef}
          className="absolute top-full right-0 mt-2 w-80 z-50 bg-bg-white rounded-xl shadow-2xl border border-ink-line p-4 animate-fade-in"
        >
          <div className="flex items-center justify-between mb-3 pb-3 border-b border-ink-line">
            <div>
              <div className="flex items-center gap-1.5">
                <TrendingUp className="h-4 w-4 text-gold" />
                <div className="font-serif font-semibold text-[14px] text-ink">Курс валют ЦБ РУз</div>
              </div>
              <div className="text-[11px] text-ink-muted mt-0.5">на {UPDATE_DATE}</div>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); /* demo: no actual refresh */ }}
              className="h-7 w-7 rounded-md flex items-center justify-center text-ink-muted hover:bg-bg-band hover:text-ink transition-colors"
              title="Обновить"
            >
              <RefreshCw className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="space-y-2">
            {CURRENCIES.map((c) => {
              const up = c.diff > 0;
              return (
                <div key={c.code} className="flex items-center justify-between p-2.5 rounded-lg bg-bg-band/40 border border-ink-line">
                  <div className="flex items-center gap-2">
                    <div className="h-9 w-9 rounded-md bg-gold/10 text-gold-dark flex items-center justify-center font-mono text-[11px] font-bold">
                      {c.code}
                    </div>
                    <div>
                      <div className="text-[12.5px] text-ink font-medium">{c.name}</div>
                      <div className="text-[10.5px] text-ink-muted font-mono">
                        {c.prev.toLocaleString('ru', { minimumFractionDigits: 2 })} → текущий
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono font-semibold text-[14px] text-ink">
                      {c.rate.toLocaleString('ru', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                    <div className={cn(
                      'text-[11px] font-mono flex items-center justify-end gap-0.5',
                      up ? 'text-success' : 'text-danger',
                    )}>
                      {up
                        ? <ArrowUpRight className="h-3 w-3" />
                        : <ArrowDownRight className="h-3 w-3" />}
                      {up ? '+' : ''}{c.diff.toLocaleString('ru', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-3 pt-3 border-t border-ink-line">
            <div className="text-[11px] text-ink-muted leading-relaxed">
              Демо-данные. В рабочей версии интеграция с{' '}
              <a href="https://cbu.uz/" target="_blank" rel="noopener noreferrer" className="text-gold font-semibold hover:underline">
                cbu.uz
              </a>
              {' '}— курсы обновляются ежедневно в 18:00.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
