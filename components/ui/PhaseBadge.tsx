'use client';

/**
 * Sprint 10.1 — PhaseBadge.
 *
 * A unified phase indicator used on every module card, module detail hero,
 * and inside mega-menu dropdowns. Three visual tiers:
 *
 *   phase1 (gold)  — foundation by 01.07.2026. Optionally rendered with a
 *                     two-layer indicator: "Информация ✓ · Интеграции <date>"
 *                     so we don't over-promise full integration by 01.07.
 *   phase2 (navy)  — H2 2026 – 2027. Informational with CTA "Subscribe to launch".
 *   phase3 (gray)  — 2027+. Light style. CTA "Join the discussion".
 *
 * The component is intentionally self-contained: no module data, no router —
 * callers pass phase + optional integration date + size. Keeps it reusable
 * in hero, lists, modal previews, dropdowns.
 */

import { Check, Clock, MessageCircle } from 'lucide-react';
import type { ModulePhase } from '@/lib/types';
import { useT } from '@/lib/i18n';
import { cn } from '@/lib/cn';

export type PhaseBadgeSize = 'sm' | 'md' | 'lg';

interface PhaseBadgeProps {
  phase: ModulePhase;
  /** Only honoured when phase === 'phase1'. When provided, renders the dual-layer indicator. */
  integrationBy?: string;
  /** Only honoured when phase === 'phase1'. Defaults to true for phase 1. */
  infoReady?: boolean;
  size?: PhaseBadgeSize;
  className?: string;
  /** When true, renders compact single-line badge without the secondary line. */
  compact?: boolean;
}

export function PhaseBadge({
  phase,
  integrationBy,
  infoReady,
  size = 'md',
  className,
  compact = false,
}: PhaseBadgeProps) {
  const t = useT();

  if (phase === 'phase1') {
    return (
      <Phase1Badge
        integrationBy={integrationBy}
        infoReady={infoReady ?? true}
        size={size}
        compact={compact}
        className={className}
      />
    );
  }

  const spec =
    phase === 'phase2'
      ? {
          label: t('phase2.short'),
          fullLabel: t('phase2.label'),
          hint: t('phase2.hint'),
          icon: Clock,
          bg: 'bg-navy-50',
          border: 'border-navy/20',
          text: 'text-navy',
          iconColor: 'text-navy/70',
        }
      : {
          label: t('phase3.short'),
          fullLabel: t('phase3.label'),
          hint: t('phase3.hint'),
          icon: MessageCircle,
          bg: 'bg-bg-band',
          border: 'border-ink-line',
          text: 'text-ink-muted',
          iconColor: 'text-ink-muted',
        };

  const S = SIZE_SPEC[size];
  const Icon = spec.icon;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border font-medium whitespace-nowrap',
        spec.bg,
        spec.border,
        spec.text,
        S.padding,
        S.text,
        className,
      )}
    >
      <Icon className={cn(S.icon, spec.iconColor)} />
      {compact ? spec.label : spec.fullLabel}
    </span>
  );
}

// ─── Phase 1: dual-layer badge ────────────────────────────────────────
// The signature indicator for priority modules. Two rows inside one capsule:
//   row 1 — "Фаза 1 · к 01.07.2026"     (gold pill)
//   row 2 — "Информация ✓ · Интеграции: Q3–Q4 2026"  (smaller, inline)
// In compact mode, only the first row is rendered.

function Phase1Badge({
  integrationBy,
  infoReady,
  size,
  compact,
  className,
}: {
  integrationBy?: string;
  infoReady: boolean;
  size: PhaseBadgeSize;
  compact: boolean;
  className?: string;
}) {
  const t = useT();
  const S = SIZE_SPEC[size];

  if (compact || !integrationBy) {
    return (
      <span
        className={cn(
          'inline-flex items-center gap-1.5 rounded-full border bg-gold-soft border-gold/30 text-gold-dark font-medium whitespace-nowrap',
          S.padding,
          S.text,
          className,
        )}
      >
        <Clock className={cn(S.icon, 'text-gold')} />
        {t('phase1.label')}
      </span>
    );
  }

  return (
    <div
      className={cn(
        'inline-flex flex-col gap-1.5 rounded-xl border bg-gold-soft border-gold/30 p-2.5',
        className,
      )}
    >
      {/* Row 1 — headline */}
      <span className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-gold-dark">
        <Clock className="h-3.5 w-3.5 text-gold" />
        {t('phase1.label')}
      </span>

      {/* Row 2 — dual indicator: info-ready + integrations date */}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px]">
        <span className="inline-flex items-center gap-1 text-success">
          <Check className="h-3 w-3" strokeWidth={3} />
          <span className="font-medium">
            {t('phase1.info')}{' '}
            <span className="text-success/80">{infoReady ? '✓' : '…'}</span>
          </span>
        </span>
        <span className="inline-flex items-center gap-1 text-ink-muted">
          <span className="font-medium">{t('phase1.integration')}:</span>
          <span className="text-ink">{integrationBy}</span>
        </span>
      </div>
    </div>
  );
}

const SIZE_SPEC: Record<PhaseBadgeSize, { padding: string; text: string; icon: string }> = {
  sm: { padding: 'px-2 py-0.5', text: 'text-[11px]', icon: 'h-3 w-3' },
  md: { padding: 'px-2.5 py-1', text: 'text-xs', icon: 'h-3.5 w-3.5' },
  lg: { padding: 'px-3 py-1.5', text: 'text-sm', icon: 'h-4 w-4' },
};
