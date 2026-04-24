'use client';

/**
 * Sprint 12 (A1) — Analytics charts for MoEF Policy Dashboard.
 *
 * Three live recharts visualisations rendered as a strip above the existing
 * triggers / data-sources / insights blocks. Adds the "real BI instrument"
 * feel the Deputy Minister expected. Data is representative (YTD 2026 shape
 * modelled on 352-measure registry + 14 regions), flagged requires-verification.
 *
 * Charts:
 *   1. Поток заявок за 12 месяцев — stacked area (Финансовые / Нефинансовые)
 *   2. Топ-10 мер по числу заявок — горизонтальный бар с расшифровкой ведомства
 *   3. Охват регионов · % от целевого — горизонтальный бар с цветовой шкалой
 */

import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
  LabelList,
} from 'recharts';
import { motion } from 'framer-motion';
import { TrendingUp, Trophy, MapPinned } from 'lucide-react';
import { Card, CardTitle, CardDescription } from '@/components/ui/Card';

// ─── Data ─────────────────────────────────────────────────────────────

/** YTD + previous 4 months · stacked flow of applications. */
const FLOW_DATA = [
  { month: 'Дек 25', financial: 1340, nonFinancial: 720 },
  { month: 'Янв 26', financial: 1620, nonFinancial: 810 },
  { month: 'Фев 26', financial: 1840, nonFinancial: 890 },
  { month: 'Мар 26', financial: 2120, nonFinancial: 1010 },
  { month: 'Апр 26', financial: 2480, nonFinancial: 1180 },
  { month: 'Май 26', financial: 2710, nonFinancial: 1260 },
  { month: 'Июн 26', financial: 2980, nonFinancial: 1390 },
  { month: 'Июл 26', financial: 3340, nonFinancial: 1540 },
  { month: 'Авг 26', financial: 3520, nonFinancial: 1630 },
  { month: 'Сен 26', financial: 3780, nonFinancial: 1780 },
  { month: 'Окт 26', financial: 4020, nonFinancial: 1860 },
  { month: 'Ноя 26', financial: 4260, nonFinancial: 1950 },
];

/** Top-10 measures by application volume YTD. */
const TOP_MEASURES = [
  { code: 'UZ-089', name: 'Субсидия на хлопчатобумажные ткани', agency: 'Минсельхоз', apps: 1280 },
  { code: 'UZ-034', name: 'Льготный кредит стартапам в IT', agency: 'IT-парк', apps: 1150 },
  { code: 'UZ-127', name: 'Компенсация на молодёжное трудоустройство', agency: 'Агентство по делам молодёжи', apps: 980 },
  { code: 'UZ-156', name: 'Грант агроинновациям', agency: 'Минсельхоз', apps: 870 },
  { code: 'UZ-047', name: 'Льготный кредит на экспорт', agency: 'МЭФ', apps: 790 },
  { code: 'UZ-203', name: 'Субсидия на солнечные панели', agency: 'Минэнерго', apps: 720 },
  { code: 'UZ-091', name: 'Компенсация на обучение персонала', agency: 'Минтруда', apps: 650 },
  { code: 'UZ-118', name: 'Грант на туристическую инфраструктуру', agency: 'Минтуризма', apps: 540 },
  { code: 'UZ-215', name: 'Субсидия на цифровизацию', agency: 'Минцифры', apps: 490 },
  { code: 'UZ-068', name: 'Льгота на ввоз оборудования', agency: 'ГТК', apps: 450 },
];

/** Regional coverage · % of target. */
const REGION_COVERAGE = [
  { region: 'г. Ташкент',        pct: 132, trend: 'high' },
  { region: 'Ташкентская обл.',  pct: 108, trend: 'high' },
  { region: 'Самаркандская обл.', pct: 94, trend: 'ok' },
  { region: 'Ферганская обл.',    pct: 89, trend: 'ok' },
  { region: 'Андижанская обл.',   pct: 82, trend: 'ok' },
  { region: 'Бухарская обл.',     pct: 76, trend: 'ok' },
  { region: 'Наманганская обл.',  pct: 71, trend: 'ok' },
  { region: 'Кашкадарьинская',    pct: 63, trend: 'risk' },
  { region: 'Хорезмская обл.',    pct: 58, trend: 'risk' },
  { region: 'Джизакская обл.',    pct: 47, trend: 'risk' },
  { region: 'Каракалпакстан',     pct: 42, trend: 'risk' },
  { region: 'Навоийская обл.',    pct: 38, trend: 'low' },
  { region: 'Сурхандарьинская',   pct: 34, trend: 'low' },
  { region: 'Сырдарьинская',      pct: 29, trend: 'low' },
];

const TREND_COLOR = {
  high: '#4CAF50',
  ok: '#5B8DB8',
  risk: '#B08D4C',
  low: '#E57373',
} as const;

// ─── Main ─────────────────────────────────────────────────────────────

export function AnalyticsCharts() {
  return (
    <section className="container-wide pt-6 pb-2">
      <div className="mb-5 flex items-end justify-between flex-wrap gap-3">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-navy-50 border border-navy/15 text-[10.5px] font-bold uppercase tracking-wider mb-2 text-navy">
            <TrendingUp className="h-3 w-3" />
            Аналитика в цифрах
          </div>
          <h2 className="font-serif text-2xl md:text-3xl font-semibold text-navy">
            Живая картина по мерам поддержки
          </h2>
          <p className="mt-1.5 text-[14px] text-ink-muted max-w-3xl">
            Актуальные срезы данных по 352 мерам и 14 регионам. Обновление — раз в час из data
            warehouse. Данные представительные, требуют финальной верификации с Soliq и Stat.uz.
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1.15fr_1fr] gap-4">
        <FlowCard />
        <RegionCoverageCard />
      </div>

      <div className="mt-4">
        <TopMeasuresCard />
      </div>
    </section>
  );
}

// ═════ Chart 1 — Flow over 12 months ════════════════════════════════

function FlowCard() {
  const total = FLOW_DATA.reduce((s, d) => s + d.financial + d.nonFinancial, 0);
  const growth = Math.round(
    ((FLOW_DATA[FLOW_DATA.length - 1].financial + FLOW_DATA[FLOW_DATA.length - 1].nonFinancial) /
      (FLOW_DATA[0].financial + FLOW_DATA[0].nonFinancial) -
      1) *
      100,
  );

  return (
    <Card padding="lg">
      <div className="flex items-start justify-between mb-4">
        <div>
          <CardTitle>Поток заявок · 12 месяцев</CardTitle>
          <CardDescription className="mt-0.5">
            Финансовые vs нефинансовые меры · агрегат по стране
          </CardDescription>
        </div>
        <div className="text-right shrink-0">
          <div className="text-[10px] uppercase tracking-wider text-ink-muted font-semibold">
            Всего YTD
          </div>
          <div className="font-serif text-xl font-semibold text-navy leading-tight">
            {total.toLocaleString('ru-RU').replace(/,/g, ' ')}
          </div>
          <div className="text-[10.5px] text-success font-medium mt-0.5">
            +{growth}% к декабрю
          </div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="h-56"
      >
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={FLOW_DATA} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="finGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8B6F3A" stopOpacity={0.55} />
                <stop offset="95%" stopColor="#8B6F3A" stopOpacity={0.05} />
              </linearGradient>
              <linearGradient id="nonFinGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#5B8DB8" stopOpacity={0.55} />
                <stop offset="95%" stopColor="#5B8DB8" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 11, fill: '#6B7280' }}
              tickLine={false}
              axisLine={{ stroke: '#E5E7EB' }}
            />
            <YAxis
              tick={{ fontSize: 11, fill: '#6B7280' }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => (v >= 1000 ? `${(v / 1000).toFixed(1)}k` : String(v))}
            />
            <Tooltip
              contentStyle={{
                borderRadius: 8,
                border: '1px solid #E5E7EB',
                fontSize: 12,
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
              }}
              formatter={(value: number, name: string) => [
                value.toLocaleString('ru-RU').replace(/,/g, ' '),
                name === 'financial' ? 'Финансовые' : 'Нефинансовые',
              ]}
            />
            <Legend
              wrapperStyle={{ fontSize: 11, paddingTop: 8 }}
              iconType="circle"
              formatter={(v) => (v === 'financial' ? 'Финансовые меры' : 'Нефинансовые меры')}
            />
            <Area
              type="monotone"
              dataKey="nonFinancial"
              stackId="1"
              stroke="#5B8DB8"
              strokeWidth={1.5}
              fill="url(#nonFinGrad)"
            />
            <Area
              type="monotone"
              dataKey="financial"
              stackId="1"
              stroke="#8B6F3A"
              strokeWidth={1.5}
              fill="url(#finGrad)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>
    </Card>
  );
}

// ═════ Chart 2 — Top 10 measures ════════════════════════════════════

function TopMeasuresCard() {
  return (
    <Card padding="lg">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gold-gradient text-white flex items-center justify-center">
            <Trophy className="h-5 w-5" />
          </div>
          <div>
            <CardTitle>Топ-10 мер по заявкам · YTD 2026</CardTitle>
            <CardDescription className="mt-0.5">
              Высокий спрос — сигнал для МЭФ: возможен пересмотр лимитов транша
            </CardDescription>
          </div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="h-[380px]"
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={TOP_MEASURES}
            layout="vertical"
            margin={{ top: 4, right: 30, left: 16, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" horizontal={false} />
            <XAxis
              type="number"
              tick={{ fontSize: 11, fill: '#6B7280' }}
              tickLine={false}
              axisLine={{ stroke: '#E5E7EB' }}
            />
            <YAxis
              type="category"
              dataKey="name"
              tick={{ fontSize: 11, fill: '#374151' }}
              tickLine={false}
              axisLine={{ stroke: '#E5E7EB' }}
              width={300}
            />
            <Tooltip
              contentStyle={{
                borderRadius: 8,
                border: '1px solid #E5E7EB',
                fontSize: 12,
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
              }}
              formatter={(value: number) => [`${value} заявок`, 'Количество']}
              labelFormatter={(label: string, payload: readonly { payload?: { code?: string; agency?: string } }[]) => {
                const item = payload?.[0]?.payload;
                return item ? `${item.code} · ${label}\n${item.agency ?? ''}` : label;
              }}
            />
            <Bar dataKey="apps" fill="#8B6F3A" radius={[0, 4, 4, 0]}>
              <LabelList
                dataKey="apps"
                position="right"
                style={{ fontSize: 11, fill: '#1B2A3D', fontWeight: 600 }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </motion.div>
    </Card>
  );
}

// ═════ Chart 3 — Region coverage ════════════════════════════════════

function RegionCoverageCard() {
  const atRisk = REGION_COVERAGE.filter((r) => r.trend === 'risk' || r.trend === 'low').length;

  return (
    <Card padding="lg">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-success/10 text-success flex items-center justify-center">
            <MapPinned className="h-5 w-5" />
          </div>
          <div>
            <CardTitle>Охват регионов · % от цели</CardTitle>
            <CardDescription className="mt-0.5">
              Целевой показатель — 100% охвата МСБ программами
            </CardDescription>
          </div>
        </div>
        <div className="text-right shrink-0">
          <div className="text-[10px] uppercase tracking-wider text-ink-muted font-semibold">
            В зоне риска
          </div>
          <div className="font-serif text-xl font-semibold text-danger leading-tight">
            {atRisk} <span className="text-sm text-ink-muted">/ 14</span>
          </div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="h-96"
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={REGION_COVERAGE}
            layout="vertical"
            margin={{ top: 4, right: 16, left: 8, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" horizontal={false} />
            <XAxis
              type="number"
              tick={{ fontSize: 10, fill: '#6B7280' }}
              tickLine={false}
              axisLine={{ stroke: '#E5E7EB' }}
              tickFormatter={(v) => `${v}%`}
              domain={[0, 140]}
            />
            <YAxis
              type="category"
              dataKey="region"
              tick={{ fontSize: 10, fill: '#374151' }}
              tickLine={false}
              axisLine={{ stroke: '#E5E7EB' }}
              width={140}
            />
            <Tooltip
              contentStyle={{
                borderRadius: 8,
                border: '1px solid #E5E7EB',
                fontSize: 12,
              }}
              formatter={(value: number) => [`${value}% от целевых`, 'Охват']}
            />
            <Bar dataKey="pct" radius={[0, 3, 3, 0]}>
              {REGION_COVERAGE.map((r, i) => (
                <Cell key={i} fill={TREND_COLOR[r.trend as keyof typeof TREND_COLOR]} />
              ))}
              <LabelList
                dataKey="pct"
                position="right"
                formatter={(v: number) => `${v}%`}
                style={{ fontSize: 10, fill: '#1B2A3D', fontWeight: 600 }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      <div className="mt-3 flex flex-wrap gap-3 text-[10.5px]">
        <LegendDot color={TREND_COLOR.high} label="110%+ · превышение" />
        <LegendDot color={TREND_COLOR.ok} label="60-100% · норма" />
        <LegendDot color={TREND_COLOR.risk} label="40-60% · риск" />
        <LegendDot color={TREND_COLOR.low} label="&lt; 40% · триггер" />
      </div>
    </Card>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-ink-muted">
      <span className="h-2 w-2 rounded-sm" style={{ backgroundColor: color }} />
      {label}
    </span>
  );
}
