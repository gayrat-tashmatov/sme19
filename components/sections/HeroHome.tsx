'use client';

/**
 * Sprint 10.1 — HeroHome V2.
 *
 * Two-mode hero controlled by the global `isAuthenticated` flag:
 *
 *   Left column (always):
 *     • Eyebrow label
 *     • Big headline
 *     • Lead paragraph
 *     • Natural-language search bar ("what do you want to do?")
 *     • 6 quick-task chips (intents, inspired by business.gov.au)
 *
 *   Right column:
 *     • Guest: DashboardPreview in "blurred + OneID overlay" mode
 *     • Authenticated: DashboardPreview in real cabinet mockup mode
 *
 * The map + KPI tiles that lived in the previous hero were moved OUT of the
 * hero entirely. KPI strip with regional selector lives further down the
 * home page as the "Platform in figures" section (Sprint 10.2).
 */

import Link from 'next/link';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Sparkles, ArrowRight } from 'lucide-react';
import { useT } from '@/lib/i18n';
import { Icon } from '@/components/ui/Icon';
import { HERO_CHIPS } from '@/lib/data/navigation';
import { DashboardPreview } from '@/components/sections/DashboardPreview';

export function HeroHome() {
  const t = useT();
  const [query, setQuery] = useState('');

  // Simple "search" action: route to the modules catalog with a q param.
  // Real AI search will be wired in a later sprint; the input is a promise,
  // not a blocking feature.
  const searchHref = query.trim() ? `/modules?q=${encodeURIComponent(query.trim())}` : '/modules';

  return (
    <section className="relative hero-glow text-white overflow-hidden">
      <div className="absolute inset-0 pattern-grid opacity-50 pointer-events-none" />
      <div className="container-wide relative py-16 md:py-20 lg:py-24 grid lg:grid-cols-[1.15fr_1fr] gap-10 lg:gap-14 items-center">
        {/* ─── Left column ──────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-medium mb-5 backdrop-blur-sm">
            <Sparkles className="h-3.5 w-3.5 text-gold-light" />
            <span>{t('home.hero.eyebrow')}</span>
          </div>

          <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-semibold text-white leading-[1.08] text-balance">
            {t('home.hero.titleV2')}
          </h1>

          <p className="mt-4 text-[15px] md:text-base text-white/75 leading-relaxed max-w-xl">
            {t('home.hero.subtitleV2')}
          </p>

          {/* Search bar */}
          <form
            onSubmit={(e) => e.preventDefault()}
            className="mt-6 flex items-center gap-2 rounded-xl bg-white/95 backdrop-blur-sm p-1.5 shadow-card-hover"
          >
            <Search className="h-5 w-5 text-ink-muted ml-2.5 shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t('home.hero.search.placeholder')}
              className="flex-1 bg-transparent outline-none text-[14px] text-ink placeholder:text-ink-muted py-2 min-w-0"
            />
            <Link
              href={searchHref}
              className="inline-flex items-center gap-1.5 h-10 px-4 rounded-lg bg-gold text-white text-[13px] font-semibold shadow-subtle hover:bg-gold-dark transition-colors shrink-0"
            >
              {t('home.hero.search.action')}
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </form>

          {/* Quick task chips */}
          <div className="mt-5">
            <div className="text-[10.5px] uppercase tracking-wider text-white/55 font-semibold mb-2.5">
              {t('home.hero.quickTasks')}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {HERO_CHIPS.map((chip) => (
                <Link
                  key={chip.id}
                  href={chip.href}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-[12.5px] font-medium text-white hover:bg-white/15 hover:border-gold-light/40 transition-colors backdrop-blur-sm"
                >
                  <Icon name={chip.iconName} className="h-3.5 w-3.5 text-gold-light" />
                  {t(chip.labelKey)}
                </Link>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ─── Right column: Dashboard preview ─────────────────────── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.15, ease: 'easeOut' }}
        >
          <DashboardPreview />
        </motion.div>
      </div>
    </section>
  );
}
