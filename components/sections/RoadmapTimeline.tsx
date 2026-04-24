'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, Clock, Users2 } from 'lucide-react';
import { useT } from '@/lib/i18n';

interface Phase {
  n: 1 | 2 | 3 | 4;
  dateKey: string;
  titleKey: string;
  descKey: string;
  moduleCount: string;
  highlights: string[];
}

const PHASES: Phase[] = [
  {
    n: 1,
    dateKey: 'home.roadmap.phase1.date',
    titleKey: 'home.roadmap.phase1.title',
    descKey: 'home.roadmap.phase1.desc',
    moduleCount: '6 + 2 NEW',
    highlights: [
      'Фундамент 6 приоритетных модулей',
      'Информационный каркас без тяжёлых интеграций',
      'Матрица ролей и user-auth модуль',
    ],
  },
  {
    n: 2,
    dateKey: 'home.roadmap.phase2.date',
    titleKey: 'home.roadmap.phase2.title',
    descKey: 'home.roadmap.phase2.desc',
    moduleCount: 'публичное демо',
    highlights: [
      'Открытая демонстрация ведомствам и ассоциациям',
      'Сбор обратной связи от предпринимателей',
      'Расширение базы мер поддержки до 500+',
    ],
  },
  {
    n: 3,
    dateKey: 'home.roadmap.phase3.date',
    titleKey: 'home.roadmap.phase3.title',
    descKey: 'home.roadmap.phase3.desc',
    moduleCount: '+ 9 модулей очереди',
    highlights: [
      'Интеграции: E-Ijro, my.gov.uz, Soliq, Онлайн-махалля',
      'Обязательный перевод всех мер на Платформу (01.07.2027)',
      'Backend BI-tool для Policy Making',
    ],
  },
  {
    n: 4,
    dateKey: 'home.roadmap.phase4.date',
    titleKey: 'home.roadmap.phase4.title',
    descKey: 'home.roadmap.phase4.desc',
    moduleCount: 'все 20 модулей',
    highlights: [
      'Интеграция с OASIS (дек. 2026) и полной ведомственной экосистемой',
      'Доля МСБ в ВВП ≥ 65%',
      'Mentorship и международные финансовые институты',
    ],
  },
];

/**
 * Current phase marker — drives "you are here" positioning.
 * As of April 2026 we are in Phase 1 actively developing towards 01.07.2026.
 */
const CURRENT_PHASE: 1 | 2 | 3 | 4 = 1;

export function RoadmapTimeline() {
  const t = useT();
  return (
    <section className="container-wide py-16 md:py-20">
      <div className="flex items-end justify-between flex-wrap gap-6 mb-12">
        <div className="max-w-2xl">
          <p className="text-xs uppercase tracking-[0.18em] text-gold font-medium mb-3">
            {t('home.roadmap.eyebrow')}
          </p>
          <h2 className="text-balance">{t('home.roadmap.title')}</h2>
          <p className="mt-3 text-base text-ink-muted">
            Каждая фаза — свой артефакт и дедлайн. Плашки в модулях показывают, какая функция
            приходится на какую фазу — чтобы было видно, что готово к 01.07.2026, а что ждёт интеграций.
          </p>
        </div>
        <div className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-lg bg-gold/10 border border-gold/30">
          <Clock className="h-4 w-4 text-gold" />
          <div>
            <div className="text-[10px] uppercase tracking-wider text-gold-dark font-semibold">Вы здесь</div>
            <div className="text-sm font-serif font-semibold text-gold">
              Фаза {CURRENT_PHASE} · активная разработка
            </div>
          </div>
        </div>
      </div>

      {/* Desktop — horizontal */}
      <div className="hidden lg:block relative">
        <div className="absolute left-8 right-8 top-[60px] h-px bg-ink-line" aria-hidden />
        <div className="grid grid-cols-4 gap-5 relative">
          {PHASES.map((p, i) => {
            const isCurrent = p.n === CURRENT_PHASE;
            const isPast = p.n < CURRENT_PHASE;
            return (
              <motion.div
                key={p.n}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.4, delay: i * 0.1, ease: 'easeOut' }}
                className="relative pt-24"
              >
                <div
                  className={`absolute left-1/2 -translate-x-1/2 top-12 h-7 w-7 rounded-full border-[3px] border-bg flex items-center justify-center font-serif text-[11px] font-bold ${
                    isCurrent
                      ? 'bg-gold text-white shadow-card ring-4 ring-gold/20'
                      : isPast
                      ? 'bg-success text-white'
                      : 'bg-bg-white text-ink-muted border-ink-line'
                  }`}
                >
                  {isPast ? <CheckCircle2 className="h-3.5 w-3.5" /> : p.n}
                </div>

                <div className={`font-serif font-semibold text-sm uppercase tracking-wide mb-2 ${
                  isCurrent ? 'text-gold' : isPast ? 'text-success' : 'text-ink-muted'
                }`}>
                  {t(p.dateKey)}
                </div>

                <div className="font-serif font-semibold text-lg text-ink leading-tight mb-1.5">
                  {t(p.titleKey)}
                </div>

                <div className={`text-xs font-semibold mb-3 ${isCurrent ? 'text-gold-dark' : 'text-ink-muted'}`}>
                  {p.moduleCount}
                </div>

                <p className="text-sm text-ink-muted leading-relaxed mb-3">
                  {t(p.descKey)}
                </p>

                <ul className="space-y-1 text-[11.5px] text-ink-soft">
                  {p.highlights.map((h, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className={`mt-[7px] h-1 w-1 rounded-full shrink-0 ${isCurrent ? 'bg-gold' : isPast ? 'bg-success' : 'bg-ink-line'}`} />
                      <span className="leading-snug">{h}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Mobile / tablet — vertical */}
      <div className="lg:hidden relative pl-8">
        <div className="absolute left-[14px] top-2 bottom-2 w-px bg-ink-line" aria-hidden />
        <div className="space-y-8">
          {PHASES.map((p, i) => {
            const isCurrent = p.n === CURRENT_PHASE;
            const isPast = p.n < CURRENT_PHASE;
            return (
              <motion.div
                key={p.n}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="relative"
              >
                <div
                  className={`absolute -left-8 top-0.5 h-7 w-7 rounded-full border-[3px] border-bg flex items-center justify-center font-serif text-xs font-bold ${
                    isCurrent
                      ? 'bg-gold text-white shadow-card ring-4 ring-gold/20'
                      : isPast
                      ? 'bg-success text-white'
                      : 'bg-bg-white text-ink-muted border-ink-line'
                  }`}
                >
                  {isPast ? <CheckCircle2 className="h-3.5 w-3.5" /> : p.n}
                </div>
                <div className={`font-serif font-semibold text-sm uppercase tracking-wide mb-1 ${
                  isCurrent ? 'text-gold' : isPast ? 'text-success' : 'text-ink-muted'
                }`}>
                  {t(p.dateKey)}
                </div>
                <div className="font-serif font-semibold text-lg text-ink leading-tight mb-0.5">
                  {t(p.titleKey)}
                </div>
                <div className={`text-xs font-semibold mb-2 ${isCurrent ? 'text-gold-dark' : 'text-ink-muted'}`}>
                  {p.moduleCount}
                </div>
                <p className="text-sm text-ink-muted leading-relaxed mb-2">
                  {t(p.descKey)}
                </p>
                <ul className="space-y-1 text-[11.5px] text-ink-soft">
                  {p.highlights.map((h, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className={`mt-[7px] h-1 w-1 rounded-full shrink-0 ${isCurrent ? 'bg-gold' : isPast ? 'bg-success' : 'bg-ink-line'}`} />
                      <span className="leading-snug">{h}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>
      </div>

      <div className="mt-12 flex items-center justify-center">
        <Link
          href="/architecture/roles"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-ink-line bg-bg-band/50 hover:bg-gold-soft/50 hover:border-gold/40 transition-all text-sm font-medium text-ink group"
        >
          <Users2 className="h-4 w-4 text-gold" />
          Матрица ролей и прав доступа
          <ArrowRight className="h-4 w-4 text-gold group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </section>
  );
}
