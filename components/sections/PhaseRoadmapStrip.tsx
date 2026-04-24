'use client';

import { motion } from 'framer-motion';
import { Calendar, CheckCircle2, Clock, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/cn';

export type PhaseNumber = 1 | 2 | 3 | 4;

export interface PhasePoint {
  /** Which of the 4 platform horizons this bullet belongs to. */
  phase: PhaseNumber;
  /** One-sentence description of what is delivered in this module by the given horizon. */
  text: string;
  /** Optional: mark "coming but blocked by dependency" (e.g., waiting for E-Ijro integration). */
  blockedBy?: string;
}

interface PhaseRoadmapStripProps {
  /** Current phase the module is in (1 = Фаза 1 до 01.07.2026, 4 = 2028+). */
  currentPhase: PhaseNumber;
  /** Per-module content distributed across the 4 horizons. */
  points: PhasePoint[];
  /** Optional compact mode — single row without expanded descriptions. */
  variant?: 'default' | 'compact';
  /** If true, skip outer container-wide wrapper — for nested use inside existing `<section className="container-wide">`. */
  embedded?: boolean;
}

const PHASE_META: Record<
  PhaseNumber,
  { date: string; label: string; labelShort: string }
> = {
  1: { date: '01.07.2026',        label: 'Фаза 1 · Фундамент 6 модулей', labelShort: 'Фаза 1' },
  2: { date: '2-я половина 2026', label: 'Фаза 2 · Расширение и обсуждение', labelShort: 'Фаза 2' },
  3: { date: '2027',               label: 'Фаза 3 · Формальное завершение', labelShort: 'Фаза 3' },
  4: { date: '2028–2030',          label: 'Фаза 4 · Полное развитие', labelShort: 'Фаза 4' },
};

/**
 * Visual 4-horizon roadmap strip shown inside each module page.
 * Purpose: give МЭФ a clear "what is live by 01.07.2026 / what comes next"
 * breakdown for this specific module, cross-referencing the home-page
 * four-phase roadmap. Added in Sprint 1 (April 2026 МЭФ feedback).
 */
export function PhaseRoadmapStrip({
  currentPhase,
  points,
  variant = 'default',
  embedded = false,
}: PhaseRoadmapStripProps) {
  const grouped: Record<PhaseNumber, PhasePoint[]> = {
    1: points.filter((p) => p.phase === 1),
    2: points.filter((p) => p.phase === 2),
    3: points.filter((p) => p.phase === 3),
    4: points.filter((p) => p.phase === 4),
  };

  const content = (
    <div className="surface-card p-5 md:p-6 relative overflow-hidden">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="h-4 w-4 text-gold" />
          <h3 className="text-sm font-serif font-semibold text-ink">
            Что и когда по этому модулю
          </h3>
          <div className="ml-auto text-xs text-ink-muted">
            Сейчас: <span className="text-gold font-semibold">{PHASE_META[currentPhase].labelShort}</span>
          </div>
        </div>

        {/* Desktop — 4 columns */}
        <div className="hidden md:grid grid-cols-4 gap-3 relative">
          {/* Connector line */}
          <div
            className="absolute top-[22px] left-8 right-8 h-px bg-ink-line"
            aria-hidden
          />

          {([1, 2, 3, 4] as PhaseNumber[]).map((p, i) => (
            <PhaseColumn
              key={p}
              phase={p}
              isCurrent={p === currentPhase}
              isPast={p < currentPhase}
              points={grouped[p]}
              variant={variant}
              delay={i * 0.08}
            />
          ))}
        </div>

        {/* Mobile — vertical */}
        <div className="md:hidden space-y-4 relative pl-7">
          <div className="absolute left-[13px] top-2 bottom-2 w-px bg-ink-line" aria-hidden />
          {([1, 2, 3, 4] as PhaseNumber[]).map((p, i) => (
            <motion.div
              key={p}
              initial={{ opacity: 0, x: -8 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.35, delay: i * 0.06 }}
              className="relative"
            >
              <Dot phase={p} isCurrent={p === currentPhase} isPast={p < currentPhase} />
              <div className={cn(
                'text-[11px] uppercase tracking-wide font-semibold mb-1',
                p === currentPhase ? 'text-gold' : p < currentPhase ? 'text-success' : 'text-ink-muted',
              )}>
                {PHASE_META[p].labelShort} · {PHASE_META[p].date}
              </div>
              {grouped[p].length === 0 ? (
                <div className="text-xs text-ink-muted italic">—</div>
              ) : (
                <ul className="text-xs text-ink-soft space-y-1">
                  {grouped[p].map((pt, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="mt-[6px] h-1 w-1 rounded-full bg-ink-line shrink-0" />
                      <span>
                        {pt.text}
                        {pt.blockedBy && (
                          <span className="text-gold-dark"> · ждёт {pt.blockedBy}</span>
                        )}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </motion.div>
          ))}
        </div>
      </div>
  );

  if (embedded) {
    return (
      <div aria-label="Дорожная карта модуля" className="my-6">
        {content}
      </div>
    );
  }

  return (
    <section
      aria-label="Дорожная карта модуля"
      className="container-wide pt-8 pb-2"
    >
      {content}
    </section>
  );
}

function PhaseColumn({
  phase, isCurrent, isPast, points, variant, delay,
}: {
  phase: PhaseNumber;
  isCurrent: boolean;
  isPast: boolean;
  points: PhasePoint[];
  variant: 'default' | 'compact';
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.4, delay, ease: 'easeOut' }}
      className="relative pt-12 px-1"
    >
      <Dot phase={phase} isCurrent={isCurrent} isPast={isPast} center />

      <div className={cn(
        'text-[11px] uppercase tracking-wide font-semibold mb-0.5 text-center',
        isCurrent ? 'text-gold' : isPast ? 'text-success' : 'text-ink-muted',
      )}>
        {PHASE_META[phase].labelShort}
      </div>
      <div className="text-[11px] text-ink-muted mb-2.5 text-center">
        {PHASE_META[phase].date}
      </div>

      {points.length === 0 ? (
        <div className="text-[11px] text-ink-muted italic text-center leading-snug">
          {phase === 1 ? 'В очереди · после 01.07.2026' : '—'}
        </div>
      ) : (
        <ul className={cn(
          'text-xs space-y-1.5',
          isCurrent ? 'text-ink' : 'text-ink-soft',
        )}>
          {points.map((pt, i) => (
            <li key={i} className="flex items-start gap-1.5">
              <span className={cn(
                'mt-[6px] h-1 w-1 rounded-full shrink-0',
                isCurrent ? 'bg-gold' : isPast ? 'bg-success' : 'bg-ink-line',
              )} />
              <span className="leading-relaxed">
                {pt.text}
                {pt.blockedBy && (
                  <span className="block mt-0.5 text-[10.5px] text-gold-dark italic">
                    ждёт {pt.blockedBy}
                  </span>
                )}
              </span>
            </li>
          ))}
        </ul>
      )}
    </motion.div>
  );
}

function Dot({
  phase, isCurrent, isPast, center = false,
}: {
  phase: PhaseNumber;
  isCurrent: boolean;
  isPast: boolean;
  center?: boolean;
}) {
  return (
    <div
      className={cn(
        center
          ? 'absolute left-1/2 -translate-x-1/2 top-3'
          : 'absolute -left-7 top-0.5',
        'h-6 w-6 rounded-full border-[3px] border-bg flex items-center justify-center font-serif text-[11px] font-bold',
        isCurrent && 'bg-gold text-white shadow-card',
        isPast && !isCurrent && 'bg-success text-white',
        !isCurrent && !isPast && 'bg-bg-white text-ink-muted border-ink-line',
      )}
    >
      {isPast ? <CheckCircle2 className="h-3 w-3" /> : isCurrent ? <Clock className="h-3 w-3" /> : phase}
    </div>
  );
}
