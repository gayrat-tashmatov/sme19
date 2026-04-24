'use client';

/**
 * Sprint 10.3 — Policy Dashboard panel for MoEF cabinet.
 *
 * Showcase of the backend-analytics layer the Platform provides to MoEF:
 *
 *   1. TRIGGERS — automatically detected anomalies (drops in coverage,
 *      SLA breaches, measure effectiveness slipping)
 *   2. DATA SOURCES — visible integrations with Soliq, Stat, Minjust,
 *      Customs, Banks; connection status + latency
 *   3. POLICY INSIGHTS — periodic reports with actionable recommendations
 *      (e.g. "adjust criteria of measure M-034", "target regional MoEF briefing")
 *
 * Placed at the top of MEF cabinet right after CabinetHero. Surfaces the
 * "MoEF is the 4th user of the Platform and the BI engine for decision-making"
 * story — the piece most visitors miss.
 */

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  AlertTriangle,
  ShieldAlert,
  TrendingDown,
  Database,
  Activity,
  CheckCircle2,
  Clock,
  ArrowRight,
  Zap,
  Target,
  BarChart3,
  FileBarChart,
  Banknote,
  ChevronRight,
  Radio,
} from 'lucide-react';
import { Card, CardTitle, CardDescription } from '@/components/ui/Card';
import { PhaseBadge } from '@/components/ui/PhaseBadge';
import { AnalyticsCharts } from './AnalyticsCharts';
import { cn } from '@/lib/cn';

export function PolicyDashboardPanel() {
  return (
    <>
      {/* Sprint 12 (A1) — 3 live charts strip rendered above the original panel */}
      <AnalyticsCharts />

      <section className="container-wide pt-4 pb-2">
      <div className="flex items-end justify-between flex-wrap gap-3 mb-5">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-navy text-white text-[10.5px] font-bold uppercase tracking-wider mb-2">
            <BarChart3 className="h-3 w-3" />
            Policy Dashboard · Backend-аналитика
          </div>
          <h2 className="font-serif text-2xl md:text-3xl font-semibold text-navy">
            Инструмент принятия решений МЭФ
          </h2>
          <p className="mt-1.5 text-[14px] text-ink-muted max-w-2xl">
            Триггеры на аномалии, сводные отчёты по эффективности мер, интеграция с Soliq / Stat /
            Минюст / Таможня / Банки. Это не только витрина для бизнеса — это и BI для
            государства.
          </p>
        </div>
        <PhaseBadge phase="phase2" size="md" />
      </div>

      <div className="grid lg:grid-cols-[1.3fr_1fr] gap-4">
        {/* ═══ Column A — Triggers + Data sources ═══ */}
        <div className="space-y-4">
          <TriggersCard />
          <DataSourcesCard />
        </div>

        {/* ═══ Column B — Policy insights ═══ */}
        <InsightsCard />
      </div>
    </section>
    </>
  );
}

// ═══ Triggers card ═══════════════════════════════════════════════════

interface Trigger {
  severity: 'high' | 'medium' | 'low';
  title: string;
  detail: string;
  metric: string;
  timeAgo: string;
  action: string;
}

const TRIGGERS: Trigger[] = [
  {
    severity: 'high',
    title: 'Падение охвата меры М-034 в 3 регионах',
    detail: 'Навои · Сурхандарья · Джизак — против целевых 4.5% фактически 1.2–2.1%',
    metric: '−68%',
    timeAgo: '2 часа назад',
    action: 'Сформировать бриф регионального МЭФ',
  },
  {
    severity: 'medium',
    title: 'SLA-просрочка в Министерстве сельского хозяйства',
    detail: '14 из 89 заявок > 15 дней в статусе «На рассмотрении»',
    metric: '15.7%',
    timeAgo: '6 часов назад',
    action: 'Автописьмо руководителю ведомства',
  },
  {
    severity: 'low',
    title: 'Мера М-127 превысила план заявок',
    detail: '1 283 заявки за неделю — в 4.6× больше прогноза. Возможна нехватка лимита.',
    metric: '+360%',
    timeAgo: 'вчера',
    action: 'Пересчёт лимита транша',
  },
];

function TriggersCard() {
  return (
    <Card padding="lg">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-danger/10 text-danger flex items-center justify-center">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <CardTitle>Триггеры · автоматические сигналы</CardTitle>
            <CardDescription className="mt-0.5">
              Аномалии, выявленные системой в реальном времени
            </CardDescription>
          </div>
        </div>
        <div className="inline-flex items-center gap-1.5 text-[11px] text-ink-muted">
          <Radio className="h-3 w-3 text-success animate-pulse" />
          live · 3 активных
        </div>
      </div>

      <div className="space-y-2">
        {TRIGGERS.map((tr, i) => (
          <TriggerRow key={i} trigger={tr} />
        ))}
      </div>

      <div className="mt-3 flex justify-end">
        <Link
          href="#"
          className="inline-flex items-center gap-1 text-[12.5px] text-gold font-medium hover:text-gold-dark"
        >
          Все 47 триггеров <ChevronRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </Card>
  );
}

function TriggerRow({ trigger }: { trigger: Trigger }) {
  const spec = {
    high: { bg: 'bg-danger/5', border: 'border-l-danger', icon: ShieldAlert, iconColor: 'text-danger' },
    medium: { bg: 'bg-gold-soft/40', border: 'border-l-gold', icon: Clock, iconColor: 'text-gold-dark' },
    low: { bg: 'bg-success/5', border: 'border-l-success', icon: TrendingDown, iconColor: 'text-success' },
  }[trigger.severity];

  const Icon = spec.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3 }}
      className={cn(
        'flex items-start gap-3 rounded-r-lg border-l-4 px-3 py-2.5',
        spec.bg,
        spec.border,
      )}
    >
      <Icon className={cn('h-4 w-4 mt-0.5 shrink-0', spec.iconColor)} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-[13px] font-semibold text-navy leading-tight">{trigger.title}</span>
          <span className={cn('text-[11px] font-bold font-serif', spec.iconColor)}>
            {trigger.metric}
          </span>
        </div>
        <div className="text-[11.5px] text-ink-muted mb-1.5">{trigger.detail}</div>
        <div className="flex items-center justify-between gap-2">
          <button className="inline-flex items-center gap-1 text-[11px] font-medium text-navy hover:text-gold-dark">
            <Zap className="h-3 w-3" />
            {trigger.action}
          </button>
          <span className="text-[10.5px] text-ink-muted">{trigger.timeAgo}</span>
        </div>
      </div>
    </motion.div>
  );
}

// ═══ Data sources card ═══════════════════════════════════════════════

interface DataSource {
  name: string;
  purpose: string;
  status: 'live' | 'pending' | 'planned';
  latency?: string;
  phase: 'phase1' | 'phase2' | 'phase3';
}

const DATA_SOURCES: DataSource[] = [
  { name: 'Soliq', purpose: 'Налоги · платежи · ИНН', status: 'live', latency: '< 3 сек', phase: 'phase1' },
  { name: 'Stat.uz', purpose: 'Статистика по отраслям', status: 'live', latency: '< 5 сек', phase: 'phase1' },
  { name: 'Минюст', purpose: 'Регистрация юрлиц', status: 'live', latency: '< 2 сек', phase: 'phase1' },
  { name: 'Таможня', purpose: 'Импорт / экспорт', status: 'pending', latency: '—', phase: 'phase2' },
  { name: 'Банки (ЦБ)', purpose: 'Кредиты · обороты', status: 'pending', latency: '—', phase: 'phase2' },
  { name: 'Кадастр', purpose: 'Недвижимость · лоты', status: 'planned', latency: '—', phase: 'phase3' },
];

function DataSourcesCard() {
  const liveCount = DATA_SOURCES.filter((s) => s.status === 'live').length;

  return (
    <Card padding="lg">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-navy/10 text-navy flex items-center justify-center">
            <Database className="h-5 w-5" />
          </div>
          <div>
            <CardTitle>Источники данных</CardTitle>
            <CardDescription className="mt-0.5">
              Интеграции, питающие data warehouse — основа Policy Dashboard
            </CardDescription>
          </div>
        </div>
        <div className="text-right">
          <div className="text-[10px] uppercase tracking-wider text-ink-muted font-semibold">
            Подключено
          </div>
          <div className="font-serif text-xl font-semibold text-navy leading-tight">
            {liveCount} / {DATA_SOURCES.length}
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-2">
        {DATA_SOURCES.map((ds) => (
          <DataSourceRow key={ds.name} source={ds} />
        ))}
      </div>

      <div className="mt-4 pt-3 border-t border-dashed border-ink-line/60 text-[11.5px] text-ink-muted flex items-start gap-2">
        <Target className="h-3.5 w-3.5 text-gold shrink-0 mt-0.5" />
        <span>
          Выбор BI-инструмента (Metabase vs Superset vs Power BI) — решается в Ф2 финтранша ВБ,
          совместно с ИВЦ МЭФ. Ориентир запуска warehouse: Q4 2026.
        </span>
      </div>
    </Card>
  );
}

function DataSourceRow({ source }: { source: DataSource }) {
  const spec = {
    live: { color: 'text-success', bg: 'bg-success/10', label: 'live' },
    pending: { color: 'text-gold-dark', bg: 'bg-gold-soft', label: 'Q3–Q4 2026' },
    planned: { color: 'text-ink-muted', bg: 'bg-bg-band', label: '2027' },
  }[source.status];

  return (
    <div className="flex items-center gap-2.5 rounded-lg bg-bg-band/60 border border-ink-line px-3 py-2">
      <div
        className={cn(
          'h-2 w-2 rounded-full shrink-0',
          source.status === 'live' && 'bg-success animate-pulse',
          source.status === 'pending' && 'bg-gold',
          source.status === 'planned' && 'bg-ink-line',
        )}
      />
      <div className="flex-1 min-w-0">
        <div className="text-[12.5px] font-semibold text-navy truncate">{source.name}</div>
        <div className="text-[10.5px] text-ink-muted truncate">{source.purpose}</div>
      </div>
      <div className="text-right shrink-0">
        <div
          className={cn(
            'text-[9.5px] uppercase tracking-wider font-bold px-1.5 py-0.5 rounded',
            spec.bg,
            spec.color,
          )}
        >
          {spec.label}
        </div>
        {source.latency && source.status === 'live' && (
          <div className="text-[9.5px] text-ink-muted mt-0.5">{source.latency}</div>
        )}
      </div>
    </div>
  );
}

// ═══ Policy insights card ═══════════════════════════════════════════

interface Insight {
  title: string;
  detail: string;
  impact: string;
  icon: typeof CheckCircle2;
  tone: 'gold' | 'navy' | 'success';
}

const INSIGHTS: Insight[] = [
  {
    title: 'Оптимизировать критерии М-047',
    detail: '3 критерия срабатывают у 92% заявителей — по факту не фильтруют. Можно упростить форму и сократить время подачи на 4 мин.',
    impact: '−4 мин подачи',
    icon: Target,
    tone: 'gold',
  },
  {
    title: 'Увеличить лимит транша М-012',
    detail: 'Реальный спрос в 4.6× превышает прогноз. Рекомендовано обсуждение на коллегии МЭФ.',
    impact: '+2.4 млрд сум',
    icon: Banknote,
    tone: 'navy',
  },
  {
    title: 'Таргетированный бриф в Каракалпакстане',
    detail: 'Охват мер в 2.1× ниже среднего. Причина: недоинформирование. Рекомендация — отдельная кампания.',
    impact: '4 300 МСБ',
    icon: Activity,
    tone: 'success',
  },
];

function InsightsCard() {
  return (
    <Card padding="lg" className="h-full flex flex-col">
      <div className="flex items-center gap-3 mb-4">
        <div className="h-10 w-10 rounded-xl bg-gold-gradient text-white flex items-center justify-center">
          <FileBarChart className="h-5 w-5" />
        </div>
        <div>
          <CardTitle>Policy Insights</CardTitle>
          <CardDescription className="mt-0.5">Для коллегии · 28 апреля</CardDescription>
        </div>
      </div>

      <div className="space-y-3 flex-1">
        {INSIGHTS.map((ins, i) => (
          <InsightRow key={i} insight={ins} index={i} />
        ))}
      </div>

      <div className="mt-4 pt-3 border-t border-ink-line">
        <Link
          href="#"
          className="flex items-center justify-between w-full h-10 px-3 rounded-lg bg-navy text-white text-[13px] font-medium hover:bg-navy-700"
        >
          <span>Сформировать отчёт для коллегии</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </Card>
  );
}

function InsightRow({ insight, index }: { insight: Insight; index: number }) {
  const IIcon = insight.icon;
  const spec =
    insight.tone === 'gold'
      ? { bg: 'bg-gold-soft/60', border: 'border-gold/30', icon: 'text-gold-dark' }
      : insight.tone === 'navy'
        ? { bg: 'bg-navy-50', border: 'border-navy/20', icon: 'text-navy' }
        : { bg: 'bg-success/10', border: 'border-success/30', icon: 'text-success' };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className={cn('rounded-lg border p-3', spec.bg, spec.border)}
    >
      <div className="flex items-start gap-2.5">
        <div className={cn('mt-0.5', spec.icon)}>
          <IIcon className="h-4 w-4" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <div className="text-[13px] font-semibold text-navy leading-tight">{insight.title}</div>
            <div
              className={cn(
                'shrink-0 text-[10.5px] font-bold font-serif px-1.5 py-0.5 rounded',
                spec.icon,
                'bg-bg-white',
              )}
            >
              {insight.impact}
            </div>
          </div>
          <div className="text-[11.5px] text-ink-muted leading-snug">{insight.detail}</div>
        </div>
      </div>
    </motion.div>
  );
}
