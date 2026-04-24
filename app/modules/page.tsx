'use client';

/**
 * Sprint 10.3 (revised) — Modules catalog with URL as source of truth.
 *
 * Previous version used useState initialized from URL params once, which
 * meant clicking a lifecycle door was a new navigation but the state didn't
 * re-read the params, so the filter didn't apply. This revision treats the
 * URL as the only source of truth: stage/phase/category are read from
 * searchParams on every render; the click handlers push new query strings.
 *
 * Only the text search is kept in local state (to avoid dispatching a
 * navigation on every keystroke), with a light debounced sync to the URL.
 *
 *   stage     · lifecycle: start | run | grow | close
 *   phase     · launch wave: phase1 | phase2 | phase3
 *   category  · menu category: services | measures | tools | knowledge | cabinets
 *   q         · full-text search against title + description
 */

import { useState, useEffect, useMemo, Suspense, useCallback } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Search,
  LayoutGrid,
  Rocket,
  CheckCircle2,
  TrendingUp,
  LogOut,
  X,
  SlidersHorizontal,
  Wrench,
  BookMarked,
  BookOpen,
  UserRound,
  Clock,
} from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Card, CardTitle, CardDescription } from '@/components/ui/Card';
import { LetterBadge } from '@/components/ui/LetterBadge';
import { Icon } from '@/components/ui/Icon';
import { PhaseBadge } from '@/components/ui/PhaseBadge';
import { ALL_MODULES } from '@/lib/data/modules';
import type { LifecycleStage, ModulePhase, NavCategory, ModuleMeta } from '@/lib/types';
import { useT } from '@/lib/i18n';
import { cn } from '@/lib/cn';

// ─── Filter definitions ───────────────────────────────────────────────

const STAGES: { id: LifecycleStage; label: string; icon: typeof Rocket; accent: string }[] = [
  { id: 'start', label: 'Старт', icon: Rocket, accent: 'bg-gold-soft text-gold-dark' },
  { id: 'run', label: 'Вести', icon: CheckCircle2, accent: 'bg-navy-50 text-navy' },
  { id: 'grow', label: 'Рост', icon: TrendingUp, accent: 'bg-success/10 text-success' },
  { id: 'close', label: 'Закрыть', icon: LogOut, accent: 'bg-bg-band text-ink-muted' },
];

const PHASES: { id: ModulePhase; label: string }[] = [
  { id: 'phase1', label: 'Фаза 1 · к 01.07.2026' },
  { id: 'phase2', label: 'Фаза 2 · H2 2026–2027' },
  { id: 'phase3', label: 'Фаза 3 · 2027+' },
];

const CATEGORIES: { id: NavCategory; label: string; icon: typeof Wrench }[] = [
  { id: 'services', label: 'Сервисы', icon: CheckCircle2 },
  { id: 'measures', label: 'Меры поддержки', icon: BookMarked },
  { id: 'tools', label: 'Инструменты роста', icon: Wrench },
  { id: 'knowledge', label: 'База знаний', icon: BookOpen },
  { id: 'cabinets', label: 'Кабинеты', icon: UserRound },
];

// ─── Page shell with Suspense (useSearchParams needs it) ──────────────

export default function ModulesCatalogPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <ModulesCatalogInner />
    </Suspense>
  );
}

function LoadingFallback() {
  return (
    <div className="container-wide py-20 text-center text-ink-muted">
      <Clock className="h-6 w-6 mx-auto mb-2 animate-pulse" />
      Загрузка…
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────

function ModulesCatalogInner() {
  const t = useT();
  const router = useRouter();
  const searchParams = useSearchParams();

  // URL is the source of truth for three discrete filters.
  const stage = (searchParams.get('stage') as LifecycleStage | null) || null;
  const phase = (searchParams.get('phase') as ModulePhase | null) || null;
  const category = (searchParams.get('category') as NavCategory | null) || null;
  const urlQuery = searchParams.get('q') ?? '';

  // Search stays local so typing doesn't dispatch a navigation per keystroke.
  const [query, setQuery] = useState(urlQuery);

  // Keep local search in sync when the URL changes externally (e.g. back button).
  useEffect(() => {
    setQuery(urlQuery);
  }, [urlQuery]);

  // Debounced URL sync for the search field.
  useEffect(() => {
    if (query === urlQuery) return;
    const handle = setTimeout(() => {
      updateUrl({ q: query });
    }, 250);
    return () => clearTimeout(handle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  // Unified URL writer — applies a partial patch without dropping other params.
  const updateUrl = useCallback(
    (patch: Partial<{ stage: LifecycleStage | null; phase: ModulePhase | null; category: NavCategory | null; q: string }>) => {
      const next = new URLSearchParams();
      const nextStage = 'stage' in patch ? patch.stage : stage;
      const nextPhase = 'phase' in patch ? patch.phase : phase;
      const nextCategory = 'category' in patch ? patch.category : category;
      const nextQ = 'q' in patch ? (patch.q ?? '') : query;
      if (nextStage) next.set('stage', nextStage);
      if (nextPhase) next.set('phase', nextPhase);
      if (nextCategory) next.set('category', nextCategory);
      if (nextQ.trim()) next.set('q', nextQ.trim());
      const qs = next.toString();
      router.replace(qs ? `/modules?${qs}` : '/modules', { scroll: false });
    },
    [router, stage, phase, category, query],
  );

  const toggleStage = (id: LifecycleStage) => updateUrl({ stage: stage === id ? null : id });
  const togglePhase = (id: ModulePhase) => updateUrl({ phase: phase === id ? null : id });
  const toggleCategory = (id: NavCategory) => updateUrl({ category: category === id ? null : id });

  // Compute filtered modules.
  const filtered = useMemo(() => {
    return ALL_MODULES.filter((m) => {
      if (stage && !m.lifecycleStages?.includes(stage)) return false;
      if (phase && m.phaseTag !== phase) return false;
      if (category && m.category !== category) return false;
      if (query.trim()) {
        const q = query.toLowerCase();
        const title = t(m.titleKey).toLowerCase();
        const desc = t(m.descKey).toLowerCase();
        if (!title.includes(q) && !desc.includes(q)) return false;
      }
      return true;
    });
  }, [stage, phase, category, query, t]);

  const activeFilterCount =
    (stage ? 1 : 0) + (phase ? 1 : 0) + (category ? 1 : 0) + (query.trim() ? 1 : 0);

  const resetAll = () => {
    setQuery('');
    router.replace('/modules', { scroll: false });
  };

  const heroTitle = composeHeroTitle({ stage, phase, category });

  return (
    <>
      {/* Hero */}
      <section className="relative hero-glow text-white overflow-hidden">
        <div className="absolute inset-0 pattern-grid opacity-50 pointer-events-none" />
        <div className="container-wide relative py-12 md:py-16">
          <motion.div
            key={`${stage ?? 'all'}-${phase ?? 'all'}-${category ?? 'all'}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-medium mb-5">
              <LayoutGrid className="h-3.5 w-3.5 text-gold-light" />
              <span>Каталог модулей</span>
            </div>
            <h1 className="font-serif text-3xl md:text-5xl font-semibold text-white leading-[1.05] text-balance">
              {heroTitle}
            </h1>
            <p className="mt-3 text-base md:text-lg text-white/75 max-w-3xl leading-relaxed">
              Найдено {filtered.length} из {ALL_MODULES.length} модулей.{' '}
              {activeFilterCount > 0 && (
                <span className="text-gold-light">Активных фильтров: {activeFilterCount}.</span>
              )}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Sticky filter bar */}
      <section className="sticky top-16 z-20 bg-bg-white/92 backdrop-blur-md border-b border-ink-line">
        <div className="container-wide py-4 space-y-3">
          {/* Top row: search + reset */}
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <Input
                leftIcon={<Search className="h-4 w-4" />}
                placeholder="Поиск по названию или описанию…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            {activeFilterCount > 0 && (
              <button
                onClick={resetAll}
                className="inline-flex items-center gap-1.5 h-10 px-3.5 rounded-lg border border-ink-line text-[13px] font-medium text-ink-muted hover:text-ink hover:border-gold/40 focus-ring"
              >
                <X className="h-3.5 w-3.5" />
                Сбросить ({activeFilterCount})
              </button>
            )}
            <div className="hidden md:inline-flex items-center gap-1.5 text-[12px] text-ink-muted">
              <SlidersHorizontal className="h-3.5 w-3.5" />
              <span className="font-medium">{filtered.length}</span> из {ALL_MODULES.length}
            </div>
          </div>

          {/* Filter rows */}
          <div className="grid md:grid-cols-[auto_1fr] gap-x-4 gap-y-2 items-start">
            {/* Stage row */}
            <div className="text-[10.5px] uppercase tracking-wider font-semibold text-ink-muted pt-1.5 md:pt-2">
              Этап
            </div>
            <div className="flex flex-wrap gap-1.5">
              {STAGES.map((s) => {
                const active = stage === s.id;
                const SIcon = s.icon;
                return (
                  <button
                    key={s.id}
                    onClick={() => toggleStage(s.id)}
                    className={cn(
                      'inline-flex items-center gap-1.5 h-8 px-3 rounded-full text-[12.5px] font-medium transition-colors focus-ring border',
                      active
                        ? 'bg-navy text-white border-navy'
                        : 'bg-bg-white text-ink border-ink-line hover:border-gold/40',
                    )}
                  >
                    <SIcon className="h-3.5 w-3.5" />
                    {s.label}
                  </button>
                );
              })}
            </div>

            {/* Phase row */}
            <div className="text-[10.5px] uppercase tracking-wider font-semibold text-ink-muted pt-1.5 md:pt-2">
              Фаза
            </div>
            <div className="flex flex-wrap gap-1.5">
              {PHASES.map((p) => {
                const active = phase === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => togglePhase(p.id)}
                    className={cn(
                      'inline-flex items-center gap-1.5 h-8 px-3 rounded-full text-[12.5px] font-medium transition-colors focus-ring border',
                      active
                        ? p.id === 'phase1'
                          ? 'bg-gold text-white border-gold'
                          : p.id === 'phase2'
                            ? 'bg-navy text-white border-navy'
                            : 'bg-ink-muted text-white border-ink-muted'
                        : 'bg-bg-white text-ink border-ink-line hover:border-gold/40',
                    )}
                  >
                    {p.label}
                  </button>
                );
              })}
            </div>

            {/* Category row */}
            <div className="text-[10.5px] uppercase tracking-wider font-semibold text-ink-muted pt-1.5 md:pt-2">
              Раздел
            </div>
            <div className="flex flex-wrap gap-1.5">
              {CATEGORIES.map((c) => {
                const active = category === c.id;
                const CIcon = c.icon;
                return (
                  <button
                    key={c.id}
                    onClick={() => toggleCategory(c.id)}
                    className={cn(
                      'inline-flex items-center gap-1.5 h-8 px-3 rounded-full text-[12.5px] font-medium transition-colors focus-ring border',
                      active
                        ? 'bg-gold-soft text-gold-dark border-gold/50'
                        : 'bg-bg-white text-ink border-ink-line hover:border-gold/40',
                    )}
                  >
                    <CIcon className="h-3.5 w-3.5" />
                    {c.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="container-wide py-10 md:py-14">
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <div className="h-16 w-16 mx-auto mb-4 rounded-2xl bg-bg-band flex items-center justify-center">
              <SlidersHorizontal className="h-8 w-8 text-ink-muted" />
            </div>
            <div className="font-serif text-xl font-semibold text-navy mb-1">
              Ничего не найдено
            </div>
            <div className="text-ink-muted mb-5">
              Попробуйте снять один из фильтров или изменить запрос.
            </div>
            <button
              onClick={resetAll}
              className="inline-flex items-center gap-1.5 h-10 px-4 rounded-lg bg-navy text-white text-sm font-medium"
            >
              <X className="h-3.5 w-3.5" />
              Сбросить все фильтры
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((m, i) => (
              <ModuleCard key={m.slug} module={m} index={i} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}

// ─── Card ─────────────────────────────────────────────────────────────

function ModuleCard({ module: m, index }: { module: ModuleMeta; index: number }) {
  const t = useT();
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.03, 0.3) }}
    >
      <Link href={m.href} className="block h-full focus-ring rounded-xl group">
        <Card
          hover
          className={cn(
            'h-full flex flex-col',
            m.priority === 'queue' && 'bg-bg-band/50',
          )}
        >
          <div className="flex items-start gap-4">
            {m.letter ? (
              <LetterBadge letter={m.letter} size="md" variant="gold" />
            ) : (
              <div className="h-10 w-10 rounded-full border border-ink-line flex items-center justify-center text-ink-muted bg-bg-white shrink-0">
                <Icon name={m.iconName} className="h-5 w-5" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <CardTitle className="text-[16px] leading-snug">{t(m.titleKey)}</CardTitle>
              <CardDescription className="mt-1.5 text-[12.5px] leading-relaxed">
                {t(m.descKey)}
              </CardDescription>
            </div>
          </div>

          {/* Lifecycle chips — show which stages this module covers */}
          {m.lifecycleStages && m.lifecycleStages.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1">
              {m.lifecycleStages.map((st) => {
                const stageSpec = STAGES.find((s) => s.id === st);
                if (!stageSpec) return null;
                const SIcon = stageSpec.icon;
                return (
                  <span
                    key={st}
                    className={cn(
                      'inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9.5px] font-medium',
                      stageSpec.accent,
                    )}
                  >
                    <SIcon className="h-2.5 w-2.5" />
                    {stageSpec.label}
                  </span>
                );
              })}
            </div>
          )}

          {m.phaseTag && (
            <div className="mt-3">
              <PhaseBadge
                phase={m.phaseTag}
                integrationBy={m.integrationBy}
                infoReady={m.infoReady}
                size="sm"
                compact={m.phaseTag !== 'phase1'}
              />
            </div>
          )}

          <div className="flex-1" />

          <div className="mt-4 flex items-center justify-end">
            <span className="text-[13px] text-gold font-medium group-hover:translate-x-0.5 transition-transform">
              {t('ui.open')} →
            </span>
          </div>
        </Card>
      </Link>
    </motion.div>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────

function composeHeroTitle({
  stage,
  phase,
  category,
}: {
  stage: LifecycleStage | null;
  phase: ModulePhase | null;
  category: NavCategory | null;
}): string {
  if (stage) {
    return {
      start: 'Модули для старта бизнеса',
      run: 'Модули для ведения бизнеса',
      grow: 'Модули для роста бизнеса',
      close: 'Модули для закрытия бизнеса',
    }[stage];
  }
  if (phase) {
    return {
      phase1: 'Модули Фазы 1 — к 01.07.2026',
      phase2: 'Модули Фазы 2 — H2 2026–2027',
      phase3: 'Модули Фазы 3 — 2027 и далее',
    }[phase];
  }
  if (category) {
    return {
      services: 'Сервисы бизнеса',
      measures: 'Меры поддержки',
      tools: 'Инструменты роста',
      knowledge: 'База знаний',
      cabinets: 'Кабинеты',
    }[category];
  }
  return 'Все модули Платформы';
}
