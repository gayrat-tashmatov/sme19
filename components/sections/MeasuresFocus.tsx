'use client';

/**
 * Sprint 10.2 — Measures focus.
 *
 * A focal block for the Unified Measures Registry — one of the 6 priority
 * modules. The home page mentions the registry as a grid card, but
 * the Deputy Minister needs to SEE this isn't a flat list — it's a real
 * policy instrument with:
 *
 *   • 359+ programmes aggregated from 27 agencies + 14 regions
 *   • AI-navigator that picks matching measures for a given SME profile
 *   • One-click application ("Подай один раз") with auto-fill from the profile
 *
 * The block shows:
 *   • A top-row stats strip (programmes / agencies / funded last year)
 *   • A mock of the AI navigator input + 3 suggested measures
 *   • CTA to the full registry module
 *
 * Keeps the promise honest: "Информация ✓ к 01.07.2026, заявки через API ведомств
 * подключаются волной Q3–Q4 2026".
 */

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Sparkles,
  BookMarked,
  ArrowRight,
  Building2,
  Banknote,
  GraduationCap,
  Search,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { PhaseBadge } from '@/components/ui/PhaseBadge';
import { useT } from '@/lib/i18n';
import { cn } from '@/lib/cn';

export function MeasuresFocus() {
  const t = useT();

  return (
    <section className="container-wide py-16 md:py-20">
      <div className="rounded-3xl overflow-hidden bg-navy-gradient text-white relative">
        {/* Decorative glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(ellipse at 15% 20%, rgba(176,141,76,0.22) 0%, transparent 55%), radial-gradient(ellipse at 85% 85%, rgba(91,141,184,0.12) 0%, transparent 50%)',
          }}
        />

        <div className="relative p-8 md:p-12 grid lg:grid-cols-[1.1fr_1fr] gap-10 items-center">
          {/* ─── Left: story ───────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-soft border border-gold/40 text-[11px] font-semibold text-gold-dark tracking-wider uppercase mb-4">
              <BookMarked className="h-3.5 w-3.5" />
              Единый реестр мер — модуль «б»
            </div>

            <h2 className="font-serif text-3xl md:text-4xl font-semibold text-white leading-[1.1] text-balance">
              359+ программ поддержки. Одна точка входа. AI-навигатор вместо лабиринта.
            </h2>

            <p className="mt-4 text-[15px] text-white/75 leading-relaxed max-w-xl">
              Заявки, статусы, результаты — в одном месте. Из 27 ведомств и 14 регионов. Больше не
              нужно знать, какой приказ какого ведомства что-то обещает.
            </p>

            {/* Top stats strip */}
            <div className="mt-6 grid grid-cols-3 gap-3">
              <StatCell value="359" unit="+" label="программ поддержки" />
              <StatCell value="27" label="ведомств-операторов" />
              <StatCell value="28.4" unit="млрд сум" label="одобрено в Q2 2026" />
            </div>

            {/* Phase honesty */}
            <div className="mt-6">
              <PhaseBadge
                phase="phase1"
                integrationBy="Q4 2026 · подача заявок через API ведомств"
                infoReady
                size="md"
              />
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/modules/registry">
                <Button size="lg" variant="primary" rightIcon={<ArrowRight className="h-4 w-4" />}>
                  Открыть реестр
                </Button>
              </Link>
              <Link href="/modules/registry?ai=1">
                <Button
                  size="lg"
                  variant="outline-white"
                  leftIcon={<Sparkles className="h-4 w-4" />}
                >
                  AI-навигатор
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* ─── Right: AI navigator mock ──────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.12 }}
          >
            <div className="rounded-2xl bg-white/8 backdrop-blur-sm border border-white/15 p-5 shadow-card-hover">
              {/* AI input mock */}
              <div className="text-[10px] uppercase tracking-wider font-semibold text-gold-light mb-2 flex items-center gap-1.5">
                <Sparkles className="h-3 w-3" />
                AI-навигатор · подбор мер
              </div>
              <div className="flex items-center gap-2 rounded-xl bg-white/10 border border-white/20 px-3 py-2.5">
                <Search className="h-4 w-4 text-white/60 shrink-0" />
                <div className="flex-1 text-[13px] text-white/90 truncate">
                  текстильное производство · Фергана · экспорт · 34 сотрудника
                </div>
                <div className="h-1.5 w-1.5 rounded-full bg-gold animate-pulse" />
              </div>
              <div className="mt-2 text-[11px] text-white/55">
                Профиль «Силк Трейд» подтянут из OneID + Soliq автоматически.
              </div>

              {/* Suggested measures */}
              <div className="mt-4 text-[10px] uppercase tracking-wider font-semibold text-white/55 mb-2">
                Найдено 7 подходящих мер · топ-3
              </div>
              <div className="space-y-2">
                {SUGGESTED.map((m, i) => (
                  <SuggestedMeasure key={i} {...m} />
                ))}
              </div>

              <button className="mt-3 w-full text-center py-2 rounded-lg border border-dashed border-white/25 text-[12px] text-white/65 hover:bg-white/5 transition-colors">
                Показать ещё 4 меры →
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ─── Stats cell ───────────────────────────────────────────────────────

function StatCell({ value, unit, label }: { value: string; unit?: string; label: string }) {
  return (
    <div className="rounded-xl bg-white/8 border border-white/15 px-4 py-3 backdrop-blur-sm">
      <div className="flex items-baseline gap-1">
        <div className="font-serif text-2xl md:text-3xl font-semibold text-gold-light leading-none">
          {value}
        </div>
        {unit && <div className="text-[12px] text-white/70">{unit}</div>}
      </div>
      <div className="mt-1.5 text-[11px] text-white/70">{label}</div>
    </div>
  );
}

// ─── Suggested measure card ───────────────────────────────────────────

interface SuggestedProps {
  icon: typeof Banknote;
  title: string;
  agency: string;
  amount: string;
  match: number;
  tone: 'gold' | 'navy' | 'success';
}

const SUGGESTED: SuggestedProps[] = [
  {
    icon: Banknote,
    title: 'Субсидия на экспорт текстиля',
    agency: 'Минсельхоз · МЭФ',
    amount: 'до 340 млн сум',
    match: 94,
    tone: 'gold',
  },
  {
    icon: Building2,
    title: 'Льготная аренда производственной площади',
    agency: 'Давактив · Фергана',
    amount: '−60% от рынка',
    match: 87,
    tone: 'navy',
  },
  {
    icon: GraduationCap,
    title: 'Грант на обучение персонала',
    agency: 'IT-парк · Enterprise SG',
    amount: 'до 85 млн сум',
    match: 76,
    tone: 'success',
  },
];

function SuggestedMeasure({ icon: MIcon, title, agency, amount, match, tone }: SuggestedProps) {
  const matchColor =
    match >= 90 ? 'text-gold-light' : match >= 80 ? 'text-secondary' : 'text-white/65';

  return (
    <div className="rounded-lg bg-white/5 border border-white/10 px-3 py-2.5 flex items-start gap-3 hover:bg-white/8 transition-colors">
      <div
        className={cn(
          'h-8 w-8 rounded-lg flex items-center justify-center shrink-0',
          tone === 'gold' && 'bg-gold-soft/30 text-gold-light',
          tone === 'navy' && 'bg-secondary/20 text-secondary',
          tone === 'success' && 'bg-success/20 text-success',
        )}
      >
        <MIcon className="h-4 w-4" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[12.5px] font-semibold text-white truncate">{title}</div>
        <div className="text-[10.5px] text-white/60 mt-0.5">
          {agency} · {amount}
        </div>
      </div>
      <div className="text-right shrink-0">
        <div className={cn('font-serif text-base font-semibold leading-none', matchColor)}>
          {match}%
        </div>
        <div className="text-[9px] uppercase tracking-wider text-white/50 mt-0.5">совпадение</div>
      </div>
    </div>
  );
}
