'use client';

/**
 * Sprint 11 — Full registry section (352 real measures).
 *
 * Renders the real dataset extracted from 03_Support_Measures_Registry.xlsx
 * as a dense, filterable, paginated list — distinct from the ~30 hand-crafted
 * demo measures that drive the deep personalisation flow in AuthorisedView.
 *
 * Why both? The 30 demo measures carry full metadata (rating, exact criteria,
 * persona matches) used by the funnel + drill-down modal. The 352 real
 * measures carry the breadth that makes the Platform credible at scale —
 * "we're not showing a handful of examples, this is the actual catalogue".
 *
 * Rendered inside B_Registry below the demo grid.
 */

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, Building2, Banknote, CheckCircle2, ChevronRight, Filter, X } from 'lucide-react';
import { ALL_MEASURES, getAgencies, getTypes, REGISTRY_STATS } from '@/lib/data/measures_full';
import { Card } from '@/components/ui/Card';
import { cn } from '@/lib/cn';

const PAGE_SIZE = 24;

export function FullRegistrySection() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<'all' | 'financial' | 'non-financial'>('all');
  const [type, setType] = useState<string>('all');
  const [agency, setAgency] = useState<string>('all');
  const [activeOnly, setActiveOnly] = useState(true);
  const [page, setPage] = useState(1);

  const topAgencies = useMemo(() => getAgencies().slice(0, 8), []);
  const topTypes = useMemo(() => getTypes().slice(0, 8), []);

  const filtered = useMemo(() => {
    return ALL_MEASURES.filter((m) => {
      if (activeOnly && !m.active) return false;
      if (category !== 'all' && m.category !== category) return false;
      if (type !== 'all' && m.type !== type) return false;
      if (agency !== 'all' && m.agency !== agency) return false;
      if (query.trim()) {
        const q = query.toLowerCase();
        if (
          !m.name.toLowerCase().includes(q) &&
          !m.agency.toLowerCase().includes(q) &&
          !m.source.toLowerCase().includes(q)
        )
          return false;
      }
      return true;
    });
  }, [query, category, type, agency, activeOnly]);

  const pageCount = Math.ceil(filtered.length / PAGE_SIZE);
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const activeFilterCount =
    (category !== 'all' ? 1 : 0) +
    (type !== 'all' ? 1 : 0) +
    (agency !== 'all' ? 1 : 0) +
    (query.trim() ? 1 : 0);

  const reset = () => {
    setQuery('');
    setCategory('all');
    setType('all');
    setAgency('all');
    setPage(1);
  };

  // Reset page when filters change
  const applyFilter = <T,>(setter: (v: T) => void) => (v: T) => {
    setter(v);
    setPage(1);
  };

  return (
    <section className="mt-12 pt-8 border-t-2 border-dashed border-ink-line">
      {/* Header */}
      <div className="mb-6 flex flex-col md:flex-row md:items-end md:justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-navy text-white text-[10.5px] font-bold uppercase tracking-wider mb-3">
            Широкий каталог · 352 реальные меры
          </div>
          <h3 className="font-serif text-2xl md:text-3xl font-semibold text-navy leading-tight">
            Полный реестр мер поддержки
          </h3>
          <p className="mt-2 text-ink-muted">
            Извлечён из реального массива Министерства экономики и финансов.
            <span className="mx-1 text-ink-line">·</span>
            {REGISTRY_STATS.agencyCount} ведомств
            <span className="mx-1 text-ink-line">·</span>
            {REGISTRY_STATS.active} активных мер
            <span className="mx-1 text-ink-line">·</span>
            {REGISTRY_STATS.financial} финансовых
            <span className="mx-1 text-ink-line">·</span>
            {REGISTRY_STATS.nonFinancial} нефинансовых
          </p>
        </div>
        <div className="shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-gold-soft text-[10px] font-bold uppercase tracking-wider text-gold-dark">
          требует верификации · черновые названия
        </div>
      </div>

      {/* Filters */}
      <div className="surface-card p-4 mb-5">
        {/* Search */}
        <div className="relative mb-3">
          <Search className="h-4 w-4 text-ink-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            placeholder='Поиск по названию, ведомству, источнику…'
            className="w-full pl-9 pr-3 h-11 rounded-lg border border-ink-line bg-bg-white text-sm focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/30"
          />
        </div>

        {/* Category + Active-only */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <Pill active={category === 'all'} onClick={() => applyFilter(setCategory)('all')}>
            Все ({ALL_MEASURES.length})
          </Pill>
          <Pill
            active={category === 'financial'}
            tone="gold"
            onClick={() => applyFilter(setCategory)('financial')}
          >
            Финансовые ({REGISTRY_STATS.financial})
          </Pill>
          <Pill
            active={category === 'non-financial'}
            tone="navy"
            onClick={() => applyFilter(setCategory)('non-financial')}
          >
            Нефинансовые ({REGISTRY_STATS.nonFinancial})
          </Pill>
          <div className="ml-auto flex items-center gap-2 text-[12px]">
            <label className="inline-flex items-center gap-1.5 cursor-pointer text-ink-muted hover:text-ink">
              <input
                type="checkbox"
                checked={activeOnly}
                onChange={(e) => {
                  setActiveOnly(e.target.checked);
                  setPage(1);
                }}
                className="h-3.5 w-3.5 rounded border-ink-line text-gold focus:ring-gold/30"
              />
              только активные
            </label>
            {activeFilterCount > 0 && (
              <button
                onClick={reset}
                className="inline-flex items-center gap-1 h-7 px-2 rounded-md border border-ink-line text-ink-muted hover:text-ink hover:border-gold/40"
              >
                <X className="h-3 w-3" />
                Сбросить ({activeFilterCount})
              </button>
            )}
          </div>
        </div>

        {/* Agency + Type chips */}
        <div className="grid md:grid-cols-2 gap-3">
          <div>
            <div className="text-[10px] uppercase tracking-wider font-semibold text-ink-muted mb-1.5 flex items-center gap-1">
              <Building2 className="h-3 w-3" />
              Ведомство
            </div>
            <div className="flex flex-wrap gap-1">
              <MiniPill active={agency === 'all'} onClick={() => applyFilter(setAgency)('all')}>
                Все
              </MiniPill>
              {topAgencies.map((a) => (
                <MiniPill
                  key={a.name}
                  active={agency === a.name}
                  onClick={() => applyFilter(setAgency)(a.name)}
                >
                  {a.name} · {a.count}
                </MiniPill>
              ))}
            </div>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-wider font-semibold text-ink-muted mb-1.5 flex items-center gap-1">
              <Filter className="h-3 w-3" />
              Тип меры
            </div>
            <div className="flex flex-wrap gap-1">
              <MiniPill active={type === 'all'} onClick={() => applyFilter(setType)('all')}>
                Все
              </MiniPill>
              {topTypes.map((t) => (
                <MiniPill
                  key={t.name}
                  active={type === t.name}
                  onClick={() => applyFilter(setType)(t.name)}
                >
                  {t.name} · {t.count}
                </MiniPill>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Result summary */}
      <div className="flex items-center justify-between mb-3">
        <div className="text-[13px] text-ink">
          <span className="font-serif font-semibold text-navy text-base">{filtered.length}</span>{' '}
          мер найдено
        </div>
        {pageCount > 1 && (
          <div className="text-[12px] text-ink-muted">
            страница {page} из {pageCount}
          </div>
        )}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="py-12 text-center text-ink-muted">
          Ничего не найдено. Попробуйте снять фильтры.
        </div>
      ) : (
        <>
          <div className="grid md:grid-cols-2 gap-3">
            {pageItems.map((m, i) => (
              <MeasureRow key={m.id} measure={m} index={i} />
            ))}
          </div>

          {pageCount > 1 && (
            <div className="mt-6 flex items-center justify-center gap-2">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="h-9 px-3 rounded-lg border border-ink-line text-sm font-medium disabled:opacity-40 hover:border-gold/40"
              >
                ← Назад
              </button>
              <span className="text-[12px] text-ink-muted px-2">
                {page} / {pageCount}
              </span>
              <button
                onClick={() => setPage(Math.min(pageCount, page + 1))}
                disabled={page === pageCount}
                className="h-9 px-3 rounded-lg border border-ink-line text-sm font-medium disabled:opacity-40 hover:border-gold/40"
              >
                Вперёд →
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
}

// ─── Row card ─────────────────────────────────────────────────────────

function MeasureRow({
  measure: m,
  index,
}: {
  measure: (typeof ALL_MEASURES)[number];
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: Math.min(index * 0.01, 0.15) }}
    >
      <Card
        padding="md"
        className={cn(
          'h-full flex flex-col hover:border-gold/40 transition-colors',
          !m.active && 'opacity-60',
        )}
      >
        <div className="flex items-start gap-3 mb-2">
          <div
            className={cn(
              'h-8 w-8 rounded-lg flex items-center justify-center shrink-0',
              m.category === 'financial'
                ? 'bg-gold-soft text-gold-dark'
                : 'bg-navy-50 text-navy',
            )}
          >
            <Banknote className="h-4 w-4" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[10px] font-mono text-ink-muted">{m.id}</div>
            <h4 className="font-serif text-[15px] font-semibold text-navy leading-tight">
              {m.name}
            </h4>
          </div>
        </div>

        <div className="grid grid-cols-[90px_1fr] gap-x-2 gap-y-1 text-[11.5px] mb-2">
          <span className="text-ink-muted">Ведомство</span>
          <span className="text-ink font-medium truncate">{m.agency}</span>
          <span className="text-ink-muted">Тип</span>
          <span className="text-ink font-medium">{m.type}</span>
          <span className="text-ink-muted">Сумма</span>
          <span className="text-ink truncate" title={m.amount}>
            {m.amount}
          </span>
          <span className="text-ink-muted">НПА</span>
          <span className="text-ink truncate">{m.legal || '—'}</span>
        </div>

        <div className="flex items-center justify-between mt-auto pt-2 border-t border-dashed border-ink-line/50">
          <div className="flex items-center gap-1.5">
            {m.active ? (
              <span className="inline-flex items-center gap-1 text-[10.5px] font-medium text-success">
                <CheckCircle2 className="h-3 w-3" />
                Активна
              </span>
            ) : (
              <span className="text-[10.5px] text-ink-muted font-medium">Неактивна</span>
            )}
            <span className="text-[10.5px] text-ink-muted">
              · {m.recipient === 'physical' ? 'физлицам' : m.recipient === 'legal' ? 'юрлицам' : 'физ. и юр.'}
            </span>
          </div>
          <ChevronRight className="h-3.5 w-3.5 text-ink-muted" />
        </div>
      </Card>
    </motion.div>
  );
}

// ─── Pills ────────────────────────────────────────────────────────────

function Pill({
  children,
  active,
  onClick,
  tone,
}: {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
  tone?: 'gold' | 'navy';
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-1.5 h-8 px-3 rounded-full text-[12.5px] font-medium transition-colors border',
        active
          ? tone === 'gold'
            ? 'bg-gold text-white border-gold'
            : tone === 'navy'
              ? 'bg-navy text-white border-navy'
              : 'bg-ink text-white border-ink'
          : 'bg-bg-white text-ink border-ink-line hover:border-gold/40',
      )}
    >
      {children}
    </button>
  );
}

function MiniPill({
  children,
  active,
  onClick,
}: {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'inline-flex items-center h-6 px-2 rounded text-[10.5px] font-medium transition-colors border',
        active
          ? 'bg-gold-soft text-gold-dark border-gold/50'
          : 'bg-bg-white text-ink-muted border-ink-line hover:border-gold/40',
      )}
    >
      {children}
    </button>
  );
}
