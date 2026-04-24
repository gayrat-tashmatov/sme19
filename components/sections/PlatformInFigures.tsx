'use client';

/**
 * Sprint 10.2 — Platform in figures.
 *
 * 6 KPI tiles with a regional selector above them. When the user picks a
 * region from the dropdown, all tile numbers reshape in place — national
 * figures are replaced by that region's stats.
 *
 * Why 6 tiles, not 4:
 *   • Two "Platform" figures (modules count, priority-modules deadline)
 *     anchor the Platform's scope.
 *   • Four "SME reality" figures (count, share of GDP, applications,
 *     champions) anchor the Platform in the country's real economic picture.
 *
 * Replaces the old StatsBand (map + 4 tiles) that was removed in the
 * Sprint 10.1 restructure. The map now lives exclusively in Geoanalytics.
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Building2,
  TrendingUp,
  FileCheck,
  Trophy,
  LayoutGrid,
  Calendar,
  ChevronDown,
  Check,
  MapPin,
} from 'lucide-react';
import { useT } from '@/lib/i18n';
import { cn } from '@/lib/cn';
import { NATIONAL_STATS, REGION_STATS, type RegionStats } from '@/lib/data/region_stats';

export function PlatformInFigures() {
  const t = useT();
  const [selectedRegion, setSelectedRegion] = useState<RegionStats | null>(null);
  const [open, setOpen] = useState(false);

  const isRegional = !!selectedRegion;
  const stats = selectedRegion ?? NATIONAL_STATS;

  return (
    <section className="container-wide py-16 md:py-20 border-t border-ink-line">
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-10">
        <div className="max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-navy-50 border border-navy/15 text-[11px] font-semibold text-navy tracking-wider uppercase mb-3">
            Платформа в цифрах
          </div>
          <h2 className="font-serif text-3xl md:text-4xl font-semibold text-navy text-balance">
            {isRegional
              ? `Вклад ${selectedRegion.name}`
              : 'Масштаб по стране'}
          </h2>
          <p className="mt-3 text-lg text-ink-muted text-pretty">
            {isRegional
              ? 'Срез по выбранному региону. Все цифры платформы — те же метрики, пересчитанные для вашего региона.'
              : '2.1 млн субъектов МСБ · 54.1% ВВП страны · 359 программ поддержки. Платформа объединяет эти факты в одну точку входа.'}
          </p>
        </div>

        {/* Regional selector */}
        <div className="relative shrink-0">
          <div className="text-[10.5px] uppercase tracking-wider font-semibold text-ink-muted mb-1.5 flex items-center gap-1.5">
            <MapPin className="h-3 w-3" />
            Регион
          </div>
          <button
            onClick={() => setOpen((v) => !v)}
            className={cn(
              'inline-flex items-center justify-between gap-3 min-w-[280px] h-11 px-4 rounded-xl border text-[14px] font-medium transition-colors focus-ring',
              open
                ? 'bg-navy text-white border-navy'
                : 'bg-bg-white text-navy border-ink-line hover:border-gold/50',
            )}
          >
            <span>{isRegional ? selectedRegion.name : 'Вся Республика Узбекистан'}</span>
            <ChevronDown
              className={cn('h-4 w-4 transition-transform', open && 'rotate-180')}
            />
          </button>

          {open && (
            <>
              <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
              <div className="absolute right-0 top-full mt-2 z-40 w-[320px] max-h-[380px] overflow-y-auto rounded-xl border border-ink-line bg-bg-white shadow-card-hover">
                <button
                  onClick={() => {
                    setSelectedRegion(null);
                    setOpen(false);
                  }}
                  className={cn(
                    'w-full flex items-center justify-between px-4 py-2.5 text-[13.5px] font-medium border-b border-ink-line hover:bg-bg-band transition-colors',
                    !isRegional && 'bg-gold-soft text-gold-dark',
                  )}
                >
                  <span className="flex items-center gap-2">
                    <Building2 className="h-3.5 w-3.5" />
                    Вся Республика Узбекистан
                  </span>
                  {!isRegional && <Check className="h-4 w-4 text-gold" />}
                </button>
                <div className="py-1">
                  {REGION_STATS.map((r) => {
                    const isActive = selectedRegion?.id === r.id;
                    return (
                      <button
                        key={r.id}
                        onClick={() => {
                          setSelectedRegion(r);
                          setOpen(false);
                        }}
                        className={cn(
                          'w-full flex items-center justify-between px-4 py-2 text-[13.5px] hover:bg-bg-band transition-colors',
                          isActive && 'bg-gold-soft text-gold-dark font-medium',
                        )}
                      >
                        <span>{r.name}</span>
                        {isActive && <Check className="h-4 w-4 text-gold" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* KPI grid */}
      <motion.div
        key={selectedRegion?.id ?? 'national'}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.25 }}
        className="grid grid-cols-2 lg:grid-cols-6 gap-3 md:gap-4"
      >
        {/* ★ Platform-level tiles — always national */}
        <KpiTile
          icon={<LayoutGrid className="h-4 w-4" />}
          value="15"
          unit="модулей"
          label="Архитектура Платформы"
          tone="gold"
          subtitle="6 приоритетных + 9 очереди"
        />
        <KpiTile
          icon={<Calendar className="h-4 w-4" />}
          value="01.07.2026"
          label="Дедлайн фазы 1"
          tone="navy"
          subtitle="Постановление Президента УП-50"
          valueIsText
        />

        {/* SME reality — reshapes by region */}
        <KpiTile
          icon={<Building2 className="h-4 w-4" />}
          value={formatThousands(stats.smeCount)}
          unit={isRegional ? 'тыс. МСБ' : 'млн МСБ'}
          label={isRegional ? 'Субъектов в регионе' : 'Субъектов МСБ в стране'}
          tone="navy"
          subtitle={isRegional ? `плотность ${(stats.smeCount * 1000 / estimatePopulation(selectedRegion.id)).toFixed(0)} на 1000 чел.` : '+4.2% к 2024 г.'}
          valueIsText
        />
        <KpiTile
          icon={<TrendingUp className="h-4 w-4" />}
          value={stats.smeShareGrp.toString()}
          unit="%"
          label={isRegional ? 'Доля МСБ в ВРП' : 'Доля МСБ в ВВП'}
          tone="success"
          subtitle={isRegional ? compareToNational(stats.smeShareGrp, NATIONAL_STATS.smeShareGrp) : 'рост с 53.9% в 2020 г.'}
        />
        <KpiTile
          icon={<FileCheck className="h-4 w-4" />}
          value={formatThousands(stats.applications)}
          unit="YTD"
          label="Заявок через Платформу"
          tone="gold"
          subtitle={isRegional ? `${((stats.applications / NATIONAL_STATS.applications) * 100).toFixed(1)}% от страны` : '28 540 с начала 2026 г.'}
          valueIsText
        />
        <KpiTile
          icon={<Trophy className="h-4 w-4" />}
          value={stats.champions.toString()}
          label="Чемпионов предпринимательства"
          tone="navy"
          subtitle={isRegional ? `${((stats.champions / NATIONAL_STATS.champions) * 100).toFixed(1)}% от 678 по стране` : 'ПФ-50 ст. 6 · ежемесячное обновление'}
        />
      </motion.div>
    </section>
  );
}

// ─── KPI tile ─────────────────────────────────────────────────────────

interface KpiTileProps {
  icon: React.ReactNode;
  value: string;
  unit?: string;
  label: string;
  subtitle?: string;
  tone: 'gold' | 'navy' | 'success';
  /** When true, don't apply number-style font treatment (e.g. for "01.07.2026"). */
  valueIsText?: boolean;
}

function KpiTile({ icon, value, unit, label, subtitle, tone, valueIsText }: KpiTileProps) {
  const toneSpec =
    tone === 'gold'
      ? { iconBg: 'bg-gold-soft text-gold', valueColor: 'text-gold-dark', border: 'hover:border-gold/40' }
      : tone === 'navy'
        ? { iconBg: 'bg-navy-50 text-navy', valueColor: 'text-navy', border: 'hover:border-navy/30' }
        : { iconBg: 'bg-success/10 text-success', valueColor: 'text-success', border: 'hover:border-success/40' };

  return (
    <div
      className={cn(
        'rounded-xl border border-ink-line bg-bg-white p-4 md:p-5 transition-colors',
        toneSpec.border,
      )}
    >
      <div className={cn('inline-flex h-8 w-8 rounded-lg items-center justify-center mb-3', toneSpec.iconBg)}>
        {icon}
      </div>
      <div className="flex items-baseline gap-1.5">
        <div
          className={cn(
            'font-serif font-semibold leading-none',
            toneSpec.valueColor,
            valueIsText ? 'text-xl md:text-2xl' : 'text-3xl md:text-4xl',
          )}
        >
          {value}
        </div>
        {unit && <div className="text-[12px] text-ink-muted">{unit}</div>}
      </div>
      <div className="mt-2 text-[12.5px] font-medium text-ink">{label}</div>
      {subtitle && <div className="mt-0.5 text-[11px] text-ink-muted">{subtitle}</div>}
    </div>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────

function formatThousands(n: number): string {
  if (n >= 1000) return (n / 1000).toFixed(1).replace('.0', '');
  // In national context we show 2.14 → but 2,140 thousand = 2.14 million.
  // National SME count is stored as thousands, so 2140 thousands → "2.14"
  return n.toLocaleString('ru-RU').replace(/,/g, ' ');
}

function compareToNational(regional: number, national: number): string {
  const diff = regional - national;
  const sign = diff >= 0 ? '+' : '−';
  return `${sign}${Math.abs(diff).toFixed(1)} п.п. к стране`;
}

/** Rough population estimate used for SME density — for the subtitle only. */
function estimatePopulation(regionId: string): number {
  const pop: Record<string, number> = {
    'tashkent-city': 3_000_000,
    samarkand: 4_100_000,
    fergana: 4_000_000,
    tashkent: 3_100_000,
    andijan: 3_300_000,
    kashkadarya: 3_400_000,
    namangan: 3_000_000,
    surkhandarya: 2_700_000,
    bukhara: 2_000_000,
    khorezm: 2_000_000,
    karakalpakstan: 2_000_000,
    jizzakh: 1_400_000,
    navoi: 1_100_000,
    syrdarya: 900_000,
  };
  return pop[regionId] ?? 2_500_000;
}
