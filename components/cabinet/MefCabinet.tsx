'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Cell,
  LineChart, Line, PieChart, Pie, AreaChart, Area,
} from 'recharts';
import {
  Users2, FileText, MessageSquare, TrendingUp, Sparkles, ShieldAlert, DatabaseZap, Activity,
  Filter, LayoutGrid, Clock, CheckCircle2, XCircle, AlertCircle, ArrowRight, PieChart as PieChartIcon,
} from 'lucide-react';
import { Card, CardTitle, CardDescription } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { CabinetHero } from './CabinetHero';
import { PolicyDashboardPanel } from './PolicyDashboardPanel';
import { REGIONS } from '@/lib/data/regions';
import { cn } from '@/lib/cn';

const GLOBAL_KPI = [
  { label: 'Активных МСБ на Платформе',        value: '127k',   delta: '+18.2%' , Icon: Users2 },
  { label: 'Заявок на меры (мес.)',       value: '8 430',  delta: '+12.4%' , Icon: FileText },
  { label: 'Обращений в B2G (мес.)',      value: '2 847',  delta: '+6.8%'  , Icon: MessageSquare },
  { label: 'Сумма одобренных мер (мес.)', value: '₽ 412 млрд', delta: '+22.1%', Icon: TrendingUp },
];

const APPS_BY_MONTH = [
  { month: 'Ноя', submitted: 5400, approved: 3800 },
  { month: 'Дек', submitted: 6100, approved: 4400 },
  { month: 'Янв', submitted: 6800, approved: 5100 },
  { month: 'Фев', submitted: 7200, approved: 5600 },
  { month: 'Мар', submitted: 7900, approved: 6200 },
  { month: 'Апр', submitted: 8430, approved: 6700 },
];

const MEASURE_SPLIT = [
  { name: 'Субсидии', value: 42, color: '#8B6F3A' },
  { name: 'Кредиты',  value: 28, color: '#1B2A3D' },
  { name: 'Льготы',   value: 18, color: '#B08D4C' },
  { name: 'Гранты',   value: 12, color: '#5B8DB8' },
];

const ALERTS = [
  { title: 'Просрочено > 10% SLA по B2G',       agency: 'Антимонопольный комитет', severity: 'high' as const },
  { title: 'Снижение одобряемости в Каракалпакстане', agency: 'МЭФ · региональный',       severity: 'medium' as const },
  { title: 'Новая мера M015 — 1 283 заявки за неделю', agency: 'МЭФ',                      severity: 'low' as const },
];

export function MefCabinet() {
  // Synthetic regional breakdown — proportional to SME density
  const regional = [...REGIONS]
    .map((r) => ({
      name: r.name_ru.replace(' обл.', '').replace('Республика ', ''),
      apps: Math.round(r.smeDensity * 38 + Math.random() * 120),
    }))
    .sort((a, b) => b.apps - a.apps);

  return (
    <>
      <CabinetHero
        eyebrow="Министерство экономики и финансов · сводная аналитика"
        title="Платформа в цифрах"
        subtitle="14 регионов + Ташкент + Каракалпакстан · 885 инструментов в 4 реестрах"
        badge={<Badge variant="priority-solid">mef</Badge>}
      />

      {/* Sprint 10.3 — Policy Dashboard: triggers + data sources + insights */}
      <PolicyDashboardPanel />

      <section className="container-wide py-10 md:py-14 space-y-6">
        {/* Global KPI */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {GLOBAL_KPI.map((k, i) => (
            <motion.div
              key={k.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: i * 0.05 }}
            >
              <Card>
                <div className="flex items-start justify-between mb-2">
                  <k.Icon className="h-5 w-5 text-gold" />
                  <span className="text-xs text-success flex items-center gap-0.5">
                    <TrendingUp className="h-3 w-3" /> {k.delta}
                  </span>
                </div>
                <div className="kpi-number text-navy">{k.value}</div>
                <div className="text-sm text-ink-muted mt-1">{k.label}</div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* ─── B2G routing queue (Sprint 2) ─── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.2 }}
        >
          <Card padding="lg" className="border-gold/30 bg-gold-soft/25">
            <div className="flex items-start justify-between flex-wrap gap-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-xl bg-gold/15 text-gold flex items-center justify-center">
                  <Filter className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle>B2G · очередь маршрутизации</CardTitle>
                  <CardDescription className="mt-0.5">
                    Ручная маршрутизация до интеграции с E-Ijro (ijro.gov.uz) — Фаза 3
                  </CardDescription>
                </div>
              </div>
              <a
                href="/modules/comms"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gold text-white text-sm font-medium hover:bg-gold-dark transition-colors"
              >
                Открыть полную очередь
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>

            <div className="grid md:grid-cols-4 gap-3">
              <div className="p-3 rounded-lg bg-bg-white border border-danger/30">
                <div className="text-xs uppercase tracking-wider text-danger font-semibold mb-1">
                  Срочно · жалобы
                </div>
                <div className="kpi-number text-navy text-2xl">12</div>
                <div className="text-xs text-ink-muted mt-1">SLA &lt; 24 ч</div>
              </div>
              <div className="p-3 rounded-lg bg-bg-white border border-gold/30">
                <div className="text-xs uppercase tracking-wider text-gold-dark font-semibold mb-1">
                  Средний приоритет
                </div>
                <div className="kpi-number text-navy text-2xl">43</div>
                <div className="text-xs text-ink-muted mt-1">в работе</div>
              </div>
              <div className="p-3 rounded-lg bg-bg-white border border-ink-line">
                <div className="text-xs uppercase tracking-wider text-ink-muted font-semibold mb-1">
                  Низкий · предложения
                </div>
                <div className="kpi-number text-navy text-2xl">12</div>
                <div className="text-xs text-ink-muted mt-1">до 7 дней</div>
              </div>
              <div className="p-3 rounded-lg bg-bg-white border border-success/30">
                <div className="text-xs uppercase tracking-wider text-success font-semibold mb-1">
                  Среднее время
                </div>
                <div className="kpi-number text-navy text-2xl">14<span className="text-sm text-ink-muted">ч</span></div>
                <div className="text-xs text-ink-muted mt-1">до маршрутизации</div>
              </div>
            </div>

            <div className="mt-4 p-3 rounded-lg bg-bg-band/80 border border-ink-line/60 text-xs text-ink-soft flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-gold shrink-0 mt-0.5" />
              <span>
                После интеграции с E-Ijro (ориентир 2027 — требует PKM и 3-ступенчатой кибер-экспертизы) очередь перейдёт
                в режим автомаршрутизации с SLA-контролем и персональной ответственностью руководителей ведомств.
              </span>
            </div>
          </Card>
        </motion.div>

        {/* Main charts */}
        <div className="grid lg:grid-cols-[2fr_1fr] gap-5">
          <Card padding="lg">
            <CardTitle>Динамика заявок</CardTitle>
            <CardDescription>Отправлено vs. одобрено, последние 6 месяцев</CardDescription>
            <div className="h-80 mt-5">
              <ResponsiveContainer>
                <LineChart data={APPS_BY_MONTH} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                  <CartesianGrid vertical={false} stroke="#EFF1F4" />
                  <XAxis dataKey="month" fontSize={11} stroke="#5A6575" tickLine={false} />
                  <YAxis fontSize={11} stroke="#5A6575" tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid #E5E7EB', fontSize: 13 }} />
                  <Line type="monotone" dataKey="submitted" stroke="#1B2A3D" strokeWidth={2.5} dot={{ r: 4, fill: '#1B2A3D' }} name="Отправлено" />
                  <Line type="monotone" dataKey="approved"  stroke="#8B6F3A" strokeWidth={2.5} dot={{ r: 4, fill: '#8B6F3A' }} name="Одобрено" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card padding="lg">
            <CardTitle>Распределение мер</CardTitle>
            <CardDescription>По типам финансирования, %</CardDescription>
            <div className="h-80 mt-5">
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={MEASURE_SPLIT}
                    dataKey="value" nameKey="name"
                    cx="50%" cy="50%"
                    innerRadius={50} outerRadius={100}
                    paddingAngle={2}
                    label={(e) => `${e.value}%`}
                    labelLine={false}
                  >
                    {MEASURE_SPLIT.map((m, i) => <Cell key={i} fill={m.color} />)}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid #E5E7EB', fontSize: 13 }} formatter={(v: number) => `${v}%`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs mt-2">
              {MEASURE_SPLIT.map((m) => (
                <span key={m.name} className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full inline-block" style={{ background: m.color }} />
                  {m.name}
                </span>
              ))}
            </div>
          </Card>
        </div>

        {/* Regions */}
        <Card padding="lg">
          <div className="flex items-center justify-between mb-2">
            <div>
              <CardTitle>Заявки по регионам</CardTitle>
              <CardDescription>Все 14 регионов РУз, этот месяц</CardDescription>
            </div>
            <Badge variant="info">апрель 2026</Badge>
          </div>
          <div className="h-80 mt-5">
            <ResponsiveContainer>
              <BarChart data={regional} margin={{ top: 10, right: 16, left: 0, bottom: 60 }}>
                <CartesianGrid vertical={false} stroke="#EFF1F4" />
                <XAxis dataKey="name" fontSize={10} stroke="#5A6575" angle={-35} textAnchor="end" interval={0} />
                <YAxis fontSize={11} stroke="#5A6575" tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid #E5E7EB', fontSize: 13 }} cursor={{ fill: 'rgba(139,111,58,0.08)' }} />
                <Bar dataKey="apps" radius={[6, 6, 0, 0]}>
                  {regional.map((_, i) => (
                    <Cell key={i} fill={i === 0 ? '#8B6F3A' : i < 3 ? '#B08D4C' : '#5B8DB8'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* NEW 7.7 — Conversion funnel with interactive period switcher */}
        <ConversionFunnel />

        {/* NEW 7.7 — Traffic timeline by module (interactive) */}
        <TrafficByModule />

        {/* NEW 7.7 — Regional coverage heat grid */}
        <RegionalCoverageGrid />

        {/* Alerts + System */}
        <div className="grid lg:grid-cols-[1.5fr_1fr] gap-5">
          <Card padding="lg">
            <div className="flex items-center gap-2 mb-4">
              <ShieldAlert className="h-5 w-5 text-danger" />
              <CardTitle>Алерты системы</CardTitle>
            </div>
            <div className="space-y-2">
              {ALERTS.map((a, i) => (
                <div key={i} className={`p-3.5 rounded-lg border flex items-start gap-3 ${
                  a.severity === 'high'   ? 'border-danger/30 bg-danger/5' :
                  a.severity === 'medium' ? 'border-gold/30 bg-gold-soft/40' :
                                            'border-ink-line bg-bg-band/40'
                }`}>
                  <ShieldAlert className={`h-5 w-5 mt-0.5 shrink-0 ${
                    a.severity === 'high' ? 'text-danger' : a.severity === 'medium' ? 'text-gold' : 'text-ink-muted'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-ink text-sm">{a.title}</div>
                    <div className="text-xs text-ink-muted mt-0.5">{a.agency}</div>
                  </div>
                  <Badge variant={a.severity === 'high' ? 'danger' : a.severity === 'medium' ? 'warning' : 'outline'}>
                    {a.severity === 'high' ? 'high' : a.severity === 'medium' ? 'medium' : 'info'}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>

          <Card padding="lg" tone="navy" className="text-white">
            <div className="flex items-center gap-2 mb-4">
              <Activity className="h-5 w-5 text-gold-light" />
              <CardTitle className="text-white">Статус системы</CardTitle>
            </div>
            <div className="space-y-3">
              <StatusLine text="API gateway"   pct={99.98} />
              <StatusLine text="OneID"          pct={99.95} />
              <StatusLine text="Soliq API"      pct={99.84} />
              <StatusLine text="Давактив sync" pct={97.12} />
            </div>
            <div className="mt-5 pt-4 border-t border-white/10 text-xs text-white/60 flex items-center gap-1.5">
              <DatabaseZap className="h-3.5 w-3.5 text-gold-light" /> Обновлено минуту назад
            </div>
          </Card>
        </div>

        {/* ══════════════════════════════════════════════════════ */}
        {/* Sprint 6 · Backend BI-аналитика для выработки политики */}
        {/* ══════════════════════════════════════════════════════ */}
        <PolicyMakingAnalytics />
      </section>
    </>
  );
}

// ════════════════════════════════════════════════════════════════════
// Sprint 6 · Policy Making Analytics — Backend BI for MEF
// Core pitch: Платформа не только инструмент для предпринимателей,
// но и аналитический движок для министерства — как данные из Soliq/Stat/
// Минюст/Таможня/Банки становятся политическими решениями.
// ════════════════════════════════════════════════════════════════════

function PolicyMakingAnalytics() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.4 }}
    >
      {/* Section hero */}
      <Card padding="lg" tone="navy" className="text-white relative overflow-hidden mb-5">
        <div className="absolute inset-0 pattern-dots opacity-25 pointer-events-none" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <Badge variant="priority-solid">Backend · для МЭФ</Badge>
            <span className="text-xs uppercase tracking-wider text-gold-light">
              Policy Making Analytics
            </span>
          </div>
          <h2 className="font-serif text-2xl md:text-3xl text-white mb-2 leading-tight">
            Аналитический движок для выработки политики
          </h2>
          <p className="text-white/75 max-w-3xl text-sm leading-relaxed">
            Платформа — не только витрина мер для МСБ, но и инструмент принятия решений для министерства.
            BI-слой собирает данные из 6 источников (Soliq, Stat, Минюст, Таможня, Банки, ЦБ), строит дашборды
            по отраслям, регионам и мерам поддержки — и показывает, какая мера действительно работает, а какая
            расходует бюджет впустую.
          </p>
        </div>
      </Card>

      {/* BI tool selection */}
      <Card padding="lg" className="mb-5">
        <div className="flex items-start gap-3 mb-5">
          <div className="h-11 w-11 rounded-xl bg-secondary/15 text-secondary flex items-center justify-center shrink-0">
            <Activity className="h-5 w-5" />
          </div>
          <div>
            <CardTitle>Выбор BI-инструмента</CardTitle>
            <CardDescription className="mt-0.5">
              Сравнение трёх основных open-source и коммерческих инструментов для backend-аналитики МЭФ.
              Решение принимается совместно с ИВЦ при МЭФ и IT-разработчиком Платформы на Фазе 2.
            </CardDescription>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-3">
          <BiToolCard
            name="Apache Superset"
            licence="Apache 2.0 · open-source"
            score="рекомендовано"
            scoreColor="success"
            pros={['Zero vendor lock-in', 'Уже используется МИВТ и ИВЦ', 'SQL Lab для ad-hoc-запросов', 'Совместимо с ClickHouse / Postgres']}
            cons={['Требует опытного DevOps', 'UI менее polished чем у коммерческих решений']}
            bestFor="Массовая выдача готовых дашбордов + ad-hoc SQL-анализ"
          />
          <BiToolCard
            name="Metabase"
            licence="AGPL · open-source + платная"
            score="альтернатива"
            scoreColor="gold"
            pros={['Простой UI — могут пользоваться не-аналитики', 'Быстрое развёртывание', 'Хорошо работает с MySQL/Postgres']}
            cons={['Ограничения кастомизации', 'Платная версия для enterprise функций']}
            bestFor="Руководство министерства без IT-бэкграунда"
          />
          <BiToolCard
            name="Power BI / Tableau"
            licence="коммерческая лицензия"
            score="дороже"
            scoreColor="ink-muted"
            pros={['Лучший UX', 'Богатая визуализация', 'Глубокая интеграция с Excel']}
            cons={['Vendor lock-in', 'Стоимость лицензий на 100+ пользователей', 'Требует per-seat лицензии']}
            bestFor="Если бюджет позволяет и критична скорость запуска"
          />
        </div>
      </Card>

      {/* Data warehouse sources */}
      <Card padding="lg" className="mb-5">
        <div className="flex items-start gap-3 mb-5">
          <div className="h-11 w-11 rounded-xl bg-gold/15 text-gold flex items-center justify-center shrink-0">
            <DatabaseZap className="h-5 w-5" />
          </div>
          <div>
            <CardTitle>Архитектура Data Warehouse</CardTitle>
            <CardDescription className="mt-0.5">
              6 внешних источников собираются в единое хранилище через МИП (межведомственная интеграционная
              платформа). Обновление — дневное для операционных данных, месячное для статистики.
            </CardDescription>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <DataSourceCard
            source="Soliq · Налоговый комитет"
            dataKind="Операционные"
            items={['Обороты и объёмы', 'Задолженности', 'Рейтинг устойчивости (AAA→D)', 'Режим налогообложения']}
            updateFreq="Дневная синхронизация"
            channel="МИП API"
          />
          <DataSourceCard
            source="Stat · Комитет статистики"
            dataKind="Макро"
            items={['ВВП по отраслям', 'Доля МСБ в ВВП', 'Занятость и з/п', 'Промышленное производство']}
            updateFreq="Месячная / квартальная"
            channel="stat.uz API"
          />
          <DataSourceCard
            source="Минюст · e-biz"
            dataKind="Регистрационные"
            items={['Реестр ЮЛ и ИП', 'Изменения учредителей', 'Ликвидации и банкротства', 'Учредители и бенефициары']}
            updateFreq="Дневная синхронизация"
            channel="МИП API"
          />
          <DataSourceCard
            source="Таможня · customs.uz"
            dataKind="Внешторг"
            items={['Экспорт / импорт по ТН ВЭД', 'Средние цены', 'Партнёры по странам', 'Таможенные режимы']}
            updateFreq="Дневная"
            channel="customs.uz API"
          />
          <DataSourceCard
            source="Банки + ЦБ"
            dataKind="Финансовые"
            items={['Кредиты МСБ по отраслям', 'Просрочка и NPL', 'Депозиты бизнеса', 'Курсы и ставки']}
            updateFreq="Дневная"
            channel="ЦБ агрегация"
          />
          <DataSourceCard
            source="Платформа (своё)"
            dataKind="Поведенческие"
            items={['Заявки на меры', 'Одобряемость и SLA', 'B2G-обращения', 'Passage по pathways']}
            updateFreq="Real-time"
            channel="внутренние логи"
          />
        </div>

        <div className="mt-5 p-4 rounded-xl bg-navy/[0.03] border border-navy/10 flex items-start gap-3">
          <Activity className="h-4 w-4 text-navy shrink-0 mt-0.5" />
          <div className="text-xs text-ink-soft leading-relaxed">
            <strong className="text-ink">Архитектура ETL:</strong> 6 источников → daily batch через МИП → staging-слой в PostgreSQL →
            витрины в ClickHouse (OLAP) → дашборды в Superset. Исторические срезы хранятся 7 лет (соответствует
            требованиям налогового законодательства). Все соединения PKM-сертифицированы после прохождения
            кибер-экспертизы в Фазе 3.
          </div>
        </div>
      </Card>

      {/* Example dashboards */}
      <Card padding="lg" className="mb-5">
        <div className="flex items-start gap-3 mb-5">
          <div className="h-11 w-11 rounded-xl bg-success/15 text-success flex items-center justify-center shrink-0">
            <PieChartIcon className="h-5 w-5" />
          </div>
          <div>
            <CardTitle>Примеры дашбордов для министерства</CardTitle>
            <CardDescription className="mt-0.5">
              12 стандартных дашбордов из коробки + возможность создавать новые через SQL Lab Superset.
            </CardDescription>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-3">
          <DashboardPreview
            name="Эффективность мер поддержки"
            subtitle="Субсидии, гранты, кредиты · одобряемость и ROI"
            metrics={['Заявок: 45 820', 'Одобрено: 29 100 (63%)', 'Средний срок: 14 дн', 'Бюджет/получатель: 18.4 млн сум']}
            insight="Мера M007 «Экспортный кредит» одобряется в 89% — нужно расширить лимит. Мера M015 стагнирует при 42% — требует пересмотра критериев."
          />
          <DashboardPreview
            name="Отраслевая динамика МСБ"
            subtitle="Регистрации и закрытия по ОКЭД · тренды"
            metrics={['ИТ: +22% YoY', 'Общепит: +8% YoY', 'Торговля: -3% YoY', 'Производство: +12% YoY']}
            insight="Отток в торговле коррелирует с ростом e-commerce — запуск программы цифровизации розницы на Ф2."
          />
          <DashboardPreview
            name="Региональная разбивка активности"
            subtitle="МСБ/1000 населения · по областям"
            metrics={['Ташкент: 74', 'Самарканд: 52', 'Каракалпакстан: 28', 'Разрыв Топ-Нижний: 2.6×']}
            insight="В Каракалпакстане и Сурхандарье — наименьшая активность. Регионы приоритетной поддержки 4–5 категории → повышенные субсидии."
          />
          <DashboardPreview
            name="Воронка B2G-обращений"
            subtitle="SLA по ведомствам"
            metrics={['Всего: 2 847', 'Просрочено: 134 (4.7%)', 'Среднее время: 12 дн', 'Лидер: Антимонопольный']}
            insight="Антимонопольный комитет — 14% просрочки (при нормативе 5%). Требуется обсуждение на Совете МЭФ."
          />
        </div>

        <div className="mt-4 text-xs text-ink-muted text-center">
          + 8 стандартных дашбордов: экспорт МСБ · финансовые индикаторы · воронка регистрации бизнеса ·
          карта Давактив-лотов · рейтинг устойчивости · использование сервисов Платформы · pathways · AI-ассистент
        </div>
      </Card>

      {/* Funding and roadmap */}
      <div className="grid lg:grid-cols-[1.2fr_1fr] gap-5">
        {/* Resources plan — neutral (no specific funding mentions) */}
        <Card padding="lg" className="border-gold/25 bg-gold-soft/20">
          <div className="flex items-start gap-3 mb-4">
            <div className="h-11 w-11 rounded-xl bg-gold text-white flex items-center justify-center shrink-0">
              <DatabaseZap className="h-5 w-5" />
            </div>
            <div>
              <CardTitle>Ресурсы и компоненты</CardTitle>
              <CardDescription className="mt-0.5">
                Состав Backend BI для Policy Making. Источники финансирования определяются на этапе подготовки ТЗ.
              </CardDescription>
            </div>
          </div>

          <div className="space-y-2.5 text-sm">
            <ResourceLine label="Лицензии BI-инструмента (Superset — open source)" phase="Ф1–Ф3" />
            <ResourceLine label="Инфраструктура data warehouse (ClickHouse + Postgres)" phase="Ф2+" />
            <ResourceLine label="Разработка ETL-интеграций (Soliq, Stat, Минюст, Таможня, CBU)" phase="Ф3" highlighted />
            <ResourceLine label="Обучение аналитиков МЭФ (15 человек)" phase="Ф2–Ф3" />
            <ResourceLine label="Поддержка и сопровождение" phase="Ф3+" />
          </div>

          <div className="mt-4 pt-4 border-t border-gold/20 text-xs text-ink-soft leading-relaxed">
            Конкретный объём капитальных и эксплуатационных затрат уточняется в ТЗ.
            Варианты финансирования прорабатываются с МЭФ и партнёрами.
          </div>
        </Card>

        {/* Roadmap */}
        <Card padding="lg">
          <div className="flex items-start gap-3 mb-4">
            <div className="h-11 w-11 rounded-xl bg-secondary/15 text-secondary flex items-center justify-center shrink-0">
              <Activity className="h-5 w-5" />
            </div>
            <div>
              <CardTitle>План развёртывания</CardTitle>
              <CardDescription className="mt-0.5">По 4 фазам Платформы</CardDescription>
            </div>
          </div>

          <div className="space-y-3">
            <RoadmapPhase
              phase="Ф1"
              subtitle="до 01.07.2026"
              items={['Внутренняя аналитика МЭФ на ручных выгрузках', '2 прототипных дашборда (меры + B2G)']}
              status="current"
            />
            <RoadmapPhase
              phase="Ф2"
              subtitle="2-я половина 2026"
              items={['Выбор BI-инструмента (Superset vs Metabase)', 'Пилот на 3 интеграциях (Soliq + Stat + Platform-internal)']}
              status="upcoming"
            />
            <RoadmapPhase
              phase="Ф3"
              subtitle="2027"
              items={['Полная интеграция 6 источников через МИП', '12 стандартных дашбордов', 'SQL Lab для отдела анализа МЭФ']}
              status="upcoming"
            />
            <RoadmapPhase
              phase="Ф4"
              subtitle="2028+"
              items={['AI/ML поверх DWH', 'Прогнозные модели эффективности мер', 'Publish API для партнёров и исследователей']}
              status="future"
            />
          </div>
        </Card>
      </div>
    </motion.div>
  );
}

// ─── BI Tool card ─────────────────────────────────────────────
function BiToolCard({
  name, licence, score, scoreColor, pros, cons, bestFor,
}: {
  name: string; licence: string; score: string; scoreColor: 'success' | 'gold' | 'ink-muted';
  pros: string[]; cons: string[]; bestFor: string;
}) {
  const toneBg =
    scoreColor === 'success' ? 'bg-success/10 text-success border-success/30' :
    scoreColor === 'gold'    ? 'bg-gold/10 text-gold-dark border-gold/30' :
                               'bg-bg-band text-ink-muted border-ink-line';
  return (
    <div className="p-4 rounded-xl border border-ink-line bg-bg-white flex flex-col h-full">
      <div className="flex items-start justify-between gap-2 mb-2">
        <div>
          <div className="font-serif font-bold text-ink text-[16px]">{name}</div>
          <div className="text-[11px] text-ink-muted mt-0.5">{licence}</div>
        </div>
        <span className={`text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-md border ${toneBg}`}>
          {score}
        </span>
      </div>
      <div className="mt-2 space-y-1">
        {pros.map((p, i) => (
          <div key={i} className="flex items-start gap-1.5 text-[12px]">
            <CheckCircle2 className="h-3 w-3 text-success shrink-0 mt-0.5" />
            <span className="text-ink-soft leading-snug">{p}</span>
          </div>
        ))}
        {cons.map((c, i) => (
          <div key={i} className="flex items-start gap-1.5 text-[12px]">
            <XCircle className="h-3 w-3 text-ink-muted shrink-0 mt-0.5" />
            <span className="text-ink-muted leading-snug">{c}</span>
          </div>
        ))}
      </div>
      <div className="mt-3 pt-3 border-t border-ink-line/60 text-[11px] text-gold font-medium leading-snug">
        Лучше всего: {bestFor}
      </div>
    </div>
  );
}

// ─── Data source card ─────────────────────────────────────────
function DataSourceCard({ source, dataKind, items, updateFreq, channel }: {
  source: string; dataKind: string; items: string[]; updateFreq: string; channel: string;
}) {
  return (
    <div className="p-4 rounded-xl border border-ink-line bg-bg-white">
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="font-serif font-semibold text-ink text-[14px] leading-tight">{source}</div>
        <Badge variant="outline">{dataKind}</Badge>
      </div>
      <ul className="space-y-1 my-3">
        {items.map((it, i) => (
          <li key={i} className="text-[12px] text-ink-soft flex items-start gap-1.5">
            <span className="text-gold mt-1">›</span>
            <span>{it}</span>
          </li>
        ))}
      </ul>
      <div className="pt-3 border-t border-ink-line/60 text-[11px] text-ink-muted space-y-0.5">
        <div><strong className="text-ink">Частота:</strong> {updateFreq}</div>
        <div><strong className="text-ink">Канал:</strong> {channel}</div>
      </div>
    </div>
  );
}

// ─── Dashboard preview card ───────────────────────────────────
function DashboardPreview({ name, subtitle, metrics, insight }: {
  name: string; subtitle: string; metrics: string[]; insight: string;
}) {
  return (
    <div className="p-4 rounded-xl border border-ink-line bg-bg-white hover:border-gold/40 transition-all">
      <div className="flex items-start gap-3 mb-3">
        <PieChartIcon className="h-5 w-5 text-gold shrink-0 mt-0.5" />
        <div>
          <div className="font-serif font-semibold text-ink text-[14.5px] leading-tight">{name}</div>
          <div className="text-[11px] text-ink-muted mt-0.5">{subtitle}</div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-1.5 mb-3">
        {metrics.map((m, i) => (
          <div key={i} className="p-2 rounded-md bg-bg-band/50 text-[11px] text-ink font-medium">
            {m}
          </div>
        ))}
      </div>
      <div className="p-2.5 rounded-md bg-gold-soft/50 border border-gold/20 text-[12px] text-ink-soft leading-snug">
        <strong className="text-gold-dark">Инсайт:</strong> {insight}
      </div>
    </div>
  );
}

// ─── Funding line ─────────────────────────────────────────────
function ResourceLine({ label, phase, highlighted = false }: {
  label: string; phase: string; highlighted?: boolean;
}) {
  return (
    <div className={`flex items-center gap-3 p-2 rounded-md ${highlighted ? 'bg-gold/10 border border-gold/25' : ''}`}>
      <div className="flex-1 min-w-0 text-ink">{label}</div>
      <div className="text-[11px] text-ink-muted shrink-0 w-14 text-right">{phase}</div>
    </div>
  );
}

// ─── Roadmap phase ────────────────────────────────────────────
function RoadmapPhase({ phase, subtitle, items, status }: {
  phase: string; subtitle: string; items: string[]; status: 'current' | 'upcoming' | 'future';
}) {
  const bg =
    status === 'current'  ? 'bg-gold/15 border-gold text-gold-dark' :
    status === 'upcoming' ? 'bg-secondary/10 border-secondary/30 text-secondary' :
                            'bg-bg-band border-ink-line text-ink-muted';
  return (
    <div className="flex gap-3">
      <div className={`h-12 w-12 rounded-lg border-2 flex items-center justify-center shrink-0 ${bg}`}>
        <div className="text-center">
          <div className="font-serif font-bold text-sm leading-none">{phase}</div>
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-xs uppercase tracking-wider text-ink-muted font-semibold">{subtitle}</div>
        <ul className="mt-1 space-y-1">
          {items.map((it, i) => (
            <li key={i} className="text-[12.5px] text-ink-soft leading-snug flex items-start gap-1.5">
              <span className="text-gold mt-0.5 shrink-0">•</span>
              <span>{it}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function StatusLine({ text, pct }: { text: string; pct: number }) {
  const color = pct >= 99.9 ? '#4CAF50' : pct >= 99 ? '#B08D4C' : '#E57373';
  return (
    <div>
      <div className="flex items-center justify-between text-sm mb-1.5">
        <span className="text-white/80">{text}</span>
        <span className="font-mono font-semibold text-white">{pct.toFixed(2)}%</span>
      </div>
      <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
        <div className="h-full rounded-full" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════
// 7.7 — NEW INTERACTIVE METRICS FOR MEF DASHBOARD
// ════════════════════════════════════════════════════════════════════

// ────── Demo data ──────

const FUNNEL_DATA = {
  week: [
    { stage: 'Просмотры реестра',    count: 18_420, pct: 100 },
    { stage: 'Открыли карточку',      count: 7_840,  pct: 42.6 },
    { stage: 'Начали заявку',         count: 3_120,  pct: 16.9 },
    { stage: 'Подали заявку',         count: 2_080,  pct: 11.3 },
    { stage: 'Одобрено',              count: 1_580,  pct: 8.6  },
  ],
  month: [
    { stage: 'Просмотры реестра',    count: 71_200, pct: 100 },
    { stage: 'Открыли карточку',      count: 32_100, pct: 45.1 },
    { stage: 'Начали заявку',         count: 13_400, pct: 18.8 },
    { stage: 'Подали заявку',         count: 8_430,  pct: 11.8 },
    { stage: 'Одобрено',              count: 6_700,  pct: 9.4  },
  ],
  quarter: [
    { stage: 'Просмотры реестра',    count: 218_500, pct: 100 },
    { stage: 'Открыли карточку',      count: 91_700,  pct: 42.0 },
    { stage: 'Начали заявку',         count: 38_200,  pct: 17.5 },
    { stage: 'Подали заявку',         count: 23_400,  pct: 10.7 },
    { stage: 'Одобрено',              count: 17_600,  pct: 8.1  },
  ],
};

function ConversionFunnel() {
  const [period, setPeriod] = useState<'week' | 'month' | 'quarter'>('month');
  const data = FUNNEL_DATA[period];

  return (
    <Card padding="lg">
      <div className="flex items-start justify-between mb-4 flex-wrap gap-2">
        <div>
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-gold" />
            <CardTitle>Воронка конверсии</CardTitle>
          </div>
          <CardDescription>От просмотра реестра до одобрения заявки</CardDescription>
        </div>
        <div className="flex gap-1 p-1 rounded-lg bg-bg-band/60 border border-ink-line">
          {[
            { id: 'week',    label: 'Неделя' },
            { id: 'month',   label: 'Месяц'  },
            { id: 'quarter', label: 'Квартал'},
          ].map((p) => (
            <button
              key={p.id}
              onClick={() => setPeriod(p.id as typeof period)}
              className={cn(
                'h-8 px-3 rounded-md text-xs font-medium transition-colors',
                period === p.id ? 'bg-navy text-white' : 'text-ink-muted hover:text-ink',
              )}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2 mt-5">
        {data.map((d, i) => {
          const dropoff = i > 0 ? data[i - 1].count - d.count : 0;
          const dropoffPct = i > 0 ? ((dropoff / data[i - 1].count) * 100).toFixed(1) : null;
          return (
            <div key={d.stage}>
              <div className="flex items-center justify-between text-sm mb-1 flex-wrap gap-2">
                <span className="font-medium text-ink">{i + 1}. {d.stage}</span>
                <div className="flex items-center gap-3">
                  <span className="font-mono font-semibold text-ink">{d.count.toLocaleString('ru')}</span>
                  <span className="font-mono text-xs text-gold">{d.pct}%</span>
                </div>
              </div>
              <div className="h-7 rounded-md bg-bg-band/60 overflow-hidden relative">
                <div
                  className="h-full transition-all"
                  style={{
                    width: `${d.pct}%`,
                    background: `linear-gradient(90deg, #8B6F3A 0%, #B08D4C 100%)`,
                  }}
                />
              </div>
              {dropoffPct && (
                <div className="text-[11px] text-danger mt-0.5 flex items-center gap-1">
                  <XCircle className="h-3 w-3" />
                  Потеряли {dropoff.toLocaleString('ru')} пользователей ({dropoffPct}%)
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-5 pt-4 border-t border-ink-line grid grid-cols-3 gap-3">
        <FunnelStat label="Общая конверсия" value={`${data[data.length - 1].pct}%`} tone="gold" />
        <FunnelStat
          label="Биг drop-off"
          value={`шаг ${data.slice(1).reduce((maxIdx, d, i) => {
            const dropThis = data[i].count - d.count;
            const dropMax = data[maxIdx].count - data[maxIdx + 1].count;
            return dropThis > dropMax ? i : maxIdx;
          }, 0) + 1}→${data.slice(1).reduce((maxIdx, d, i) => {
            const dropThis = data[i].count - d.count;
            const dropMax = data[maxIdx].count - data[maxIdx + 1].count;
            return dropThis > dropMax ? i : maxIdx;
          }, 0) + 2}`}
          tone="danger"
        />
        <FunnelStat label="Одобрено всего" value={data[data.length - 1].count.toLocaleString('ru')} tone="success" />
      </div>
    </Card>
  );
}

function FunnelStat({ label, value, tone }: { label: string; value: string; tone: 'gold' | 'success' | 'danger' }) {
  const colorMap = {
    gold:    'text-gold',
    success: 'text-success',
    danger:  'text-danger',
  };
  return (
    <div className="p-2.5 rounded-lg bg-bg-band/50 border border-ink-line">
      <div className="text-[10px] uppercase tracking-wider text-ink-muted font-semibold">{label}</div>
      <div className={cn('font-serif text-base font-semibold mt-0.5', colorMap[tone])}>{value}</div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════
// Traffic by module — interactive area chart with module selector
// ════════════════════════════════════════════════════════════════════

const MODULE_TRAFFIC: Record<string, { month: string; views: number }[]> = {
  registry: [
    { month: 'Ноя', views: 42_100 }, { month: 'Дек', views: 48_600 },
    { month: 'Янв', views: 56_800 }, { month: 'Фев', views: 62_400 },
    { month: 'Мар', views: 68_900 }, { month: 'Апр', views: 71_200 },
  ],
  maturity: [
    { month: 'Ноя', views: 8_400 }, { month: 'Дек', views: 11_200 },
    { month: 'Янв', views: 14_600 }, { month: 'Фев', views: 17_800 },
    { month: 'Мар', views: 21_300 }, { month: 'Апр', views: 24_800 },
  ],
  ecommerce: [
    { month: 'Ноя', views: 14_200 }, { month: 'Дек', views: 15_800 },
    { month: 'Янв', views: 18_400 }, { month: 'Фев', views: 19_900 },
    { month: 'Мар', views: 22_100 }, { month: 'Апр', views: 24_500 },
  ],
  geo: [
    { month: 'Ноя', views: 11_200 }, { month: 'Дек', views: 12_400 },
    { month: 'Янв', views: 13_900 }, { month: 'Фев', views: 15_100 },
    { month: 'Мар', views: 16_800 }, { month: 'Апр', views: 18_200 },
  ],
  nLearn: [
    { month: 'Ноя', views: 6_800 }, { month: 'Дек', views: 8_400 },
    { month: 'Янв', views: 9_900 }, { month: 'Фев', views: 11_800 },
    { month: 'Мар', views: 13_400 }, { month: 'Апр', views: 15_200 },
  ],
};

const MODULE_META: Record<string, { label: string; color: string }> = {
  registry:  { label: 'Реестр мер',         color: '#8B6F3A' },
  maturity:  { label: 'Оценка зрелости',    color: '#1B2A3D' },
  ecommerce: { label: 'E-commerce',         color: '#B08D4C' },
  geo:       { label: 'Геоаналитика',       color: '#5B8DB8' },
  nLearn:    { label: 'Обучение',           color: '#4CAF50' },
};

function TrafficByModule() {
  const [selected, setSelected] = useState<string>('registry');
  const data = MODULE_TRAFFIC[selected];
  const meta = MODULE_META[selected];
  const totalViews = data.reduce((a, b) => a + b.views, 0);
  const growth = (((data[data.length - 1].views - data[0].views) / data[0].views) * 100).toFixed(1);

  return (
    <Card padding="lg">
      <div className="flex items-start justify-between mb-4 flex-wrap gap-2">
        <div>
          <div className="flex items-center gap-2">
            <LayoutGrid className="h-5 w-5 text-gold" />
            <CardTitle>Трафик по модулям Платформы</CardTitle>
          </div>
          <CardDescription>Просмотры за 6 месяцев · выберите модуль</CardDescription>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap mb-5">
        {Object.entries(MODULE_META).map(([id, m]) => (
          <button
            key={id}
            onClick={() => setSelected(id)}
            className={cn(
              'h-9 px-3 rounded-lg border text-sm font-medium transition-all flex items-center gap-1.5',
              selected === id
                ? 'text-white border-transparent'
                : 'bg-bg-white text-ink-muted border-ink-line hover:border-gold/40',
            )}
            style={selected === id ? { background: m.color } : {}}
          >
            <span
              className="h-2 w-2 rounded-full"
              style={{ background: selected === id ? '#fff' : m.color }}
            />
            {m.label}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-3 gap-3 mb-4">
        <FunnelStat label="Всего просмотров (6 мес)" value={totalViews.toLocaleString('ru')} tone="gold" />
        <FunnelStat label="Рост месяц-к-месяцу" value={`+${growth}%`} tone="success" />
        <FunnelStat label="Апрель 2026" value={data[data.length - 1].views.toLocaleString('ru')} tone="gold" />
      </div>

      <div className="h-72">
        <ResponsiveContainer>
          <AreaChart data={data} margin={{ top: 10, right: 16, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="trafficGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stopColor={meta.color} stopOpacity={0.35} />
                <stop offset="100%" stopColor={meta.color} stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke="#EFF1F4" />
            <XAxis dataKey="month" fontSize={11} stroke="#5A6575" tickLine={false} />
            <YAxis fontSize={11} stroke="#5A6575" tickLine={false} axisLine={false} />
            <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid #E5E7EB', fontSize: 13 }} />
            <Area
              type="monotone"
              dataKey="views"
              stroke={meta.color}
              strokeWidth={2.5}
              fill="url(#trafficGrad)"
              name="Просмотры"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

// ════════════════════════════════════════════════════════════════════
// Regional coverage heat grid — interactive map
// ════════════════════════════════════════════════════════════════════

interface RegionCoverage {
  region: string;
  activeSmb: number;     // активных МСБ на платформе
  appsPerK: number;       // заявок на 1 000 МСБ
  approvalPct: number;    // % одобрения
  coverage: 'high' | 'medium' | 'low';
}

const REGIONAL_COVERAGE: RegionCoverage[] = [
  { region: 'Ташкент г.',            activeSmb: 34_200, appsPerK: 62, approvalPct: 81, coverage: 'high' },
  { region: 'Ташкентская обл.',      activeSmb: 18_400, appsPerK: 48, approvalPct: 76, coverage: 'high' },
  { region: 'Самаркандская',          activeSmb: 14_800, appsPerK: 41, approvalPct: 73, coverage: 'high' },
  { region: 'Ферганская',             activeSmb: 13_600, appsPerK: 38, approvalPct: 69, coverage: 'medium' },
  { region: 'Андижанская',            activeSmb: 11_200, appsPerK: 35, approvalPct: 71, coverage: 'medium' },
  { region: 'Наманганская',           activeSmb: 10_400, appsPerK: 32, approvalPct: 68, coverage: 'medium' },
  { region: 'Бухарская',              activeSmb: 8_600,  appsPerK: 34, approvalPct: 72, coverage: 'medium' },
  { region: 'Кашкадарьинская',        activeSmb: 7_800,  appsPerK: 28, approvalPct: 64, coverage: 'medium' },
  { region: 'Сурхандарьинская',       activeSmb: 5_200,  appsPerK: 22, approvalPct: 58, coverage: 'low'  },
  { region: 'Навоийская',             activeSmb: 4_800,  appsPerK: 31, approvalPct: 74, coverage: 'medium' },
  { region: 'Джизакская',             activeSmb: 4_100,  appsPerK: 26, approvalPct: 67, coverage: 'medium' },
  { region: 'Сырдарьинская',           activeSmb: 3_200,  appsPerK: 24, approvalPct: 63, coverage: 'low'  },
  { region: 'Хорезмская',             activeSmb: 6_400,  appsPerK: 29, approvalPct: 65, coverage: 'medium' },
  { region: 'Каракалпакстан',         activeSmb: 4_300,  appsPerK: 19, approvalPct: 54, coverage: 'low'  },
];

function RegionalCoverageGrid() {
  const [metric, setMetric] = useState<'activeSmb' | 'appsPerK' | 'approvalPct'>('appsPerK');
  const [hovered, setHovered] = useState<RegionCoverage | null>(null);

  const metricLabels: Record<typeof metric, string> = {
    activeSmb:   'Активные МСБ',
    appsPerK:    'Заявок на 1 000 МСБ',
    approvalPct: '% одобрения',
  };

  // Determine min/max of selected metric for color scale
  const values = REGIONAL_COVERAGE.map((r) => r[metric]);
  const maxVal = Math.max(...values);
  const minVal = Math.min(...values);

  function getIntensity(r: RegionCoverage): number {
    return (r[metric] - minVal) / Math.max(1, maxVal - minVal);
  }

  return (
    <Card padding="lg">
      <div className="flex items-start justify-between mb-4 flex-wrap gap-2">
        <div>
          <div className="flex items-center gap-2">
            <PieChartIcon className="h-5 w-5 text-gold" />
            <CardTitle>Покрытие регионов</CardTitle>
          </div>
          <CardDescription>14 регионов РУз · интенсивность по выбранной метрике</CardDescription>
        </div>
        <div className="flex gap-1 p-1 rounded-lg bg-bg-band/60 border border-ink-line">
          {Object.entries(metricLabels).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setMetric(key as typeof metric)}
              className={cn(
                'h-8 px-3 rounded-md text-xs font-medium transition-colors whitespace-nowrap',
                metric === key ? 'bg-gold text-white' : 'text-ink-muted hover:text-ink',
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2">
        {REGIONAL_COVERAGE.map((r) => {
          const intensity = getIntensity(r);
          const bgColor = `rgba(139, 111, 58, ${0.1 + intensity * 0.75})`;
          const textColor = intensity > 0.5 ? '#fff' : '#1B2A3D';
          return (
            <button
              key={r.region}
              onMouseEnter={() => setHovered(r)}
              onMouseLeave={() => setHovered(null)}
              className="aspect-square rounded-lg p-2 text-left transition-all hover:scale-105 hover:z-10 relative border border-ink-line/50"
              style={{ backgroundColor: bgColor, color: textColor }}
            >
              <div className="text-[10px] font-medium leading-tight opacity-90">{r.region}</div>
              <div className="font-serif text-base font-semibold mt-1 leading-none">
                {metric === 'activeSmb'   ? (r.activeSmb / 1000).toFixed(1) + 'k' :
                 metric === 'appsPerK'    ? r.appsPerK :
                                            r.approvalPct + '%'}
              </div>
            </button>
          );
        })}
      </div>

      {/* Hover detail */}
      <div className="mt-4 p-3 rounded-lg bg-bg-band/40 border border-ink-line min-h-[64px]">
        {hovered ? (
          <div className="flex items-center gap-4 flex-wrap">
            <div className="font-serif text-[15px] text-ink font-semibold">{hovered.region}</div>
            <div className="flex items-center gap-4 text-[12.5px] text-ink-muted">
              <span><strong className="text-ink">{hovered.activeSmb.toLocaleString('ru')}</strong> активных МСБ</span>
              <span><strong className="text-ink">{hovered.appsPerK}</strong> заявок/1K</span>
              <span><strong className="text-ink">{hovered.approvalPct}%</strong> одобрения</span>
            </div>
            <Badge variant={hovered.coverage === 'high' ? 'success' : hovered.coverage === 'medium' ? 'warning' : 'danger'} className="ml-auto">
              покрытие {hovered.coverage === 'high' ? 'высокое' : hovered.coverage === 'medium' ? 'среднее' : 'низкое'}
            </Badge>
          </div>
        ) : (
          <div className="text-[13px] text-ink-muted">
            Наведите курсор на регион для деталей
          </div>
        )}
      </div>

      {/* Gradient legend */}
      <div className="mt-3 flex items-center gap-3">
        <span className="text-[11px] text-ink-muted">Низкая</span>
        <div className="flex-1 h-2 rounded-full" style={{ background: 'linear-gradient(90deg, rgba(139,111,58,0.1), rgba(139,111,58,0.85))' }} />
        <span className="text-[11px] text-ink-muted">Высокая</span>
      </div>
    </Card>
  );
}
