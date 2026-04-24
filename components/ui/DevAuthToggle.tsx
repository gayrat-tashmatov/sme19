'use client';

/**
 * Sprint 10.1 — DevAuthToggle.
 *
 * A segmented "Guest ↔ Signed in" switch that lives in the header. In the
 * prototype it's the fastest way for the Deputy Minister (and developers)
 * to compare both states of the UI side-by-side without leaving the page.
 *
 * The component is marked with a tiny PROTOTYPE badge so it's visually clear
 * this is not a real sign-in — it's a preview tool. In production this
 * component is removed; the OneID button in the header handles the real flow.
 *
 * State is persisted in the store via `setAuthenticated`, which also keeps
 * `role` in sync (guest ↔ entrepreneur by default).
 */

import { UserRound, ShieldCheck } from 'lucide-react';
import { useStore } from '@/lib/store';
import { useT } from '@/lib/i18n';
import { cn } from '@/lib/cn';

interface DevAuthToggleProps {
  /** Compact mobile mode — omits the label. */
  compact?: boolean;
  className?: string;
}

export function DevAuthToggle({ compact = false, className }: DevAuthToggleProps) {
  const t = useT();
  const isAuth = useStore((s) => s.isAuthenticated);
  const setAuth = useStore((s) => s.setAuthenticated);

  return (
    <div
      className={cn(
        'inline-flex items-center gap-2 rounded-xl border border-dashed border-gold/40 bg-gold-soft/50 px-2 py-1',
        className,
      )}
      title={t('auth.devToggle.hint')}
    >
      {!compact && (
        <span className="text-[9.5px] uppercase tracking-wider font-semibold text-gold-dark hidden xl:inline">
          {t('auth.devToggle.label')}
        </span>
      )}

      <div className="flex items-center gap-0.5 rounded-lg bg-white/70 p-0.5">
        <button
          type="button"
          onClick={() => setAuth(false)}
          aria-pressed={!isAuth}
          className={cn(
            'inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[11px] font-medium transition-colors focus-ring',
            !isAuth
              ? 'bg-navy text-white shadow-subtle'
              : 'text-ink-muted hover:text-navy',
          )}
        >
          <UserRound className="h-3 w-3" />
          {t('auth.devToggle.guest')}
        </button>
        <button
          type="button"
          onClick={() => setAuth(true)}
          aria-pressed={isAuth}
          className={cn(
            'inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[11px] font-medium transition-colors focus-ring',
            isAuth
              ? 'bg-navy text-white shadow-subtle'
              : 'text-ink-muted hover:text-navy',
          )}
        >
          <ShieldCheck className="h-3 w-3" />
          {t('auth.devToggle.authorized')}
        </button>
      </div>

      {/* tiny prototype badge */}
      <span className="hidden xl:inline text-[8.5px] uppercase tracking-[0.1em] font-bold text-gold-dark/70 px-1">
        ★ PROTOTYPE
      </span>
    </div>
  );
}
