'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  LineChart, Line, AreaChart, Area, PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Legend,
} from 'recharts';
import {
  TrendingUp, TrendingDown, Minus, FileText, Globe, Calendar, MapPin,
  BookOpen, ExternalLink, Users, Award, Building2, Sparkles,
} from 'lucide-react';
import { Tabs, TabPanel } from '@/components/ui/Tabs';
import { Card, CardTitle, CardDescription } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { useT } from '@/lib/i18n';
import { cn } from '@/lib/cn';
import {
  GDP_TIMELINE, SME_SHARE, MACRO_KPI, INDUSTRIES_BREAKDOWN, INDUSTRY_GROWTH,
  TOP_EXPORT_COUNTRIES, TRADE_BALANCE, COMMODITY_PRICES, MACRO_LABELS,
} from '@/lib/data/macro';
import { PhaseRoadmapStrip } from '@/components/sections/PhaseRoadmapStrip';

// ═══════════════════════════════════════════════════════════════════
// Sprint 4 · International reports & events
// ═══════════════════════════════════════════════════════════════════

interface IntlReport {
  id: string;
  title: string;
  publisher: string;
  year: string;
  url: string;
  summary: string;
  category: 'country' | 'climate' | 'sme' | 'regional' | 'trade';
}

const INTL_REPORTS: IntlReport[] = [
  {
    id: 'wb-2025',
    title: 'Uzbekistan Country Economic Update',
    publisher: 'Всемирный банк',
    year: '2025',
    url: 'https://www.worldbank.org/en/country/uzbekistan/publication/economic-update',
    summary: 'Полугодовой макроэкономический обзор: рост ВВП, бедность, частный сектор, рекомендации по реформам.',
    category: 'country',
  },
  {
    id: 'imf-art4',
    title: 'Article IV Consultation — Staff Report',
    publisher: 'Международный валютный фонд',
    year: '2025',
    url: 'https://www.imf.org/en/Countries/UZB',
    summary: 'Ежегодные консультации: курсовая политика, бюджет, финсектор, структурные реформы.',
    category: 'country',
  },
  {
    id: 'wef-gci',
    title: 'Global Competitiveness Report — индекс конкурентоспособности',
    publisher: 'World Economic Forum',
    year: '2024',
    url: 'https://www.weforum.org/reports/',
    summary: 'Позиция Узбекистана в глобальном индексе конкурентоспособности по 12 столпам.',
    category: 'country',
  },
  {
    id: 'ifc-sme',
    title: 'SME Finance Gap · Uzbekistan',
    publisher: 'International Finance Corporation',
    year: '2025',
    url: 'https://www.smefinanceforum.org/data-sites/ifc-enterprise-finance-gap',
    summary: 'Разрыв в финансировании МСБ: оценка неудовлетворённого спроса на кредиты и потребности женщин-предпринимателей.',
    category: 'sme',
  },
  {
    id: 'ebrd-ts',
    title: 'Transition Report — Uzbekistan',
    publisher: 'Европейский банк реконструкции и развития',
    year: '2024–2025',
    url: 'https://www.ebrd.com/transition-report',
    summary: 'Оценка переходных качеств экономики по 6 параметрам: рыночность, зелёность, инклюзивность и др.',
    category: 'country',
  },
  {
    id: 'adb-outlook',
    title: 'Asian Development Outlook',
    publisher: 'Азиатский банк развития',
    year: '2025',
    url: 'https://www.adb.org/outlook/',
    summary: 'Макропрогноз по странам Азии, включая Узбекистан и ЦАР.',
    category: 'regional',
  },
  {
    id: 'wto-trade',
    title: 'Trade Policy Review — Uzbekistan',
    publisher: 'World Trade Organization',
    year: '2024',
    url: 'https://www.wto.org/english/tratop_e/tpr_e/tpr_e.htm',
    summary: 'Анализ торговой политики, тарифов, нетарифных барьеров и обязательств в рамках ВТО.',
    category: 'trade',
  },
  {
    id: 'oecd-cai',
    title: 'Economic Assessment of Uzbekistan',
    publisher: 'Организация экономического сотрудничества и развития',
    year: '2024',
    url: 'https://www.oecd.org/eurasia/',
    summary: 'Оценка ОЭСР экономических реформ, инвестиционного климата, борьбы с бедностью.',
    category: 'country',
  },
];

interface BizEvent {
  id: string;
  title: string;
  type: 'forum' | 'expo' | 'training' | 'summit';
  startDate: string;
  endDate?: string;
  location: string;
  organiser: string;
  summary: string;
  url?: string;
  registrationOpen: boolean;
}

const UPCOMING_EVENTS: BizEvent[] = [
  {
    id: 'uz-tashkent-intlforum',
    title: 'Ташкентский международный инвестиционный форум',
    type: 'forum',
    startDate: '28 апр 2026',
    endDate: '30 апр 2026',
    location: 'г. Ташкент · «Центральный Азия»',
    organiser: 'МИВТ + УзТПП',
    summary: 'Крупнейший ежегодный форум инвесторов: B2B-встречи, презентации инвестпроектов Узбекистана, финалы питчей стартапов.',
    url: 'https://tashkent-invest.uz',
    registrationOpen: true,
  },
  {
    id: 'uz-innoweek',
    title: 'InnoWeek · Неделя инноваций',
    type: 'summit',
    startDate: '19 мая 2026',
    endDate: '23 мая 2026',
    location: 'г. Ташкент · IT Park',
    organiser: 'IT Park + МИНВТ + ПРООН',
    summary: 'Конференция ИКТ-компаний и стартапов. Треки: AI, FinTech, GovTech, климат. 120+ спикеров.',
    url: 'https://innoweek.uz',
    registrationOpen: true,
  },
  {
    id: 'uz-textile',
    title: 'Uzbekistan International Textile Expo',
    type: 'expo',
    startDate: '11 июн 2026',
    endDate: '13 июн 2026',
    location: 'г. Ташкент · «Узэкспоцентр»',
    organiser: 'Uztextileprom + УзТПП',
    summary: 'B2B-выставка текстильной отрасли: хлопок, пряжа, ткани, готовая одежда. Ожидается 500+ экспонентов из 20 стран.',
    registrationOpen: true,
  },
  {
    id: 'uz-agri',
    title: 'AgroWorld Uzbekistan',
    type: 'expo',
    startDate: '07 окт 2026',
    endDate: '09 окт 2026',
    location: 'г. Ташкент · «Узэкспоцентр»',
    organiser: 'ITECA + Минсельхоз',
    summary: 'Главная сельскохозяйственная выставка. Оборудование, технологии, семена, переработка.',
    registrationOpen: false,
  },
  {
    id: 'uz-women-biz',
    title: 'Форум женщин-предпринимателей ЦАР',
    type: 'forum',
    startDate: '24 июн 2026',
    endDate: '25 июн 2026',
    location: 'г. Самарканд',
    organiser: 'Бизнес-школа МЭФ + USAID',
    summary: 'Нетворкинг, питч-сессии, менторство от успешных женщин-предпринимателей региона.',
    url: 'https://women-business.uz',
    registrationOpen: true,
  },
  {
    id: 'uz-export-training',
    title: 'Экспорт в ЕАЭС · практический тренинг',
    type: 'training',
    startDate: '15 мая 2026',
    location: 'онлайн + г. Ташкент',
    organiser: 'Enterprise Uzbekistan + МЭФ',
    summary: '3-дневный курс: таможенное оформление, логистика, сертификация, сделки, выход на маркетплейсы СНГ.',
    registrationOpen: true,
  },
  {
    id: 'uz-buxgalter',
    title: 'Обновления налогового законодательства 2026',
    type: 'training',
    startDate: '22 апр 2026',
    location: 'онлайн',
    organiser: 'Институт налоговой и бюджетной политики',
    summary: 'Свежие изменения Налогового кодекса, новые формы отчётности, позиция ГНК по спорным вопросам.',
    registrationOpen: true,
  },
];

// Map KPI → source label for Sprint 4 transparency
const MACRO_SOURCES: Record<string, string> = {
  gdp:       'stat.uz',
  inflation: 'cbu.uz',
  smeShare:  'stat.uz',
  salary:    'stat.uz',
  export:    'customs.uz',
  fdi:       'cbu.uz',
};

export function GBusinessInfo() {
  const t = useT();
  const [tab, setTab] = useState('macro');
  return (
    <div className="container-wide py-10 md:py-14">
      <PhaseRoadmapStrip
        embedded
        currentPhase={1}
        points={[
          // Фаза 1 — до 01.07.2026
          { phase: 1, text: 'Макроэкономические показатели (ВВП, инфляция, доля МСБ, средняя ЗП)' },
          { phase: 1, text: 'Отраслевые дашборды (промышленность, услуги, АПК, строительство, ИТ, e-commerce)' },
          { phase: 1, text: 'Внешняя торговля и цены на commodities (ручное обновление модератором)' },
          { phase: 1, text: 'Раздел «Международные отчёты» (WB, МВФ, WEF, IFC, EBRD, ADB, WTO, OECD)' },
          { phase: 1, text: 'Предстоящие мероприятия для бизнеса (форумы, выставки, тренинги)' },
          // Фаза 2 — 2-я половина 2026
          { phase: 2, text: 'Обратная связь от отраслевых ассоциаций по составу данных' },
          // Фаза 3 — 2027
          { phase: 3, text: 'Интеграция с stat.uz, UZEX, cbu.uz — авто-обновление через API', blockedBy: 'PKM + кибер-экспертиза' },
          // Фаза 4 — 2028+
          { phase: 4, text: 'Расширенная аналитика по ОКЭД и регионам, персональные инсайты' },
        ]}
      />

      <Tabs
        items={[
          { id: 'macro',      label: 'Макроэкономика' },
          { id: 'industries', label: 'Отрасли' },
          { id: 'trade',      label: 'Внешняя торговля' },
          { id: 'prices',     label: 'Цены commodities' },
          { id: 'reports',    label: 'Международные отчёты' },
          { id: 'events',     label: 'Мероприятия' },
        ]}
        value={tab}
        onChange={setTab}
        size="lg"
      />

      <TabPanel active={tab === 'macro'}><MacroTab /></TabPanel>
      <TabPanel active={tab === 'industries'}><IndustriesTab /></TabPanel>
      <TabPanel active={tab === 'trade'}><TradeTab /></TabPanel>
      <TabPanel active={tab === 'prices'}><PricesTab /></TabPanel>
      <TabPanel active={tab === 'reports'}><ReportsTab /></TabPanel>
      <TabPanel active={tab === 'events'}><EventsTab /></TabPanel>
    </div>
  );
}

/* ─────────── Tab 1: macro ─────────── */
function MacroTab() {
  return (
    <div>
      <div className="surface-card bg-bg-band/50 p-4 mb-6 flex items-start gap-3">
        <Sparkles className="h-4 w-4 text-gold mt-0.5 shrink-0" />
        <div className="text-xs text-ink-soft leading-relaxed">
          Источники показателей: <strong className="text-ink">stat.uz</strong>, <strong className="text-ink">cbu.uz</strong>,{' '}
          <strong className="text-ink">customs.uz</strong>. До Ф3 — ручное обновление модератором; после интеграции API — автоматически.
        </div>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {MACRO_KPI.map((k) => (
          <Card key={k.labelKey}>
            <div className="text-xs uppercase tracking-wider text-ink-muted mb-1">{MACRO_LABELS[k.labelKey as keyof typeof MACRO_LABELS].ru}</div>
            <div className="flex items-end gap-2">
              <div className="kpi-number text-navy">{k.value}</div>
              <div className="text-xs text-ink-muted mb-1.5">{k.unit}</div>
            </div>
            <div className={cn('text-xs flex items-center gap-1 mt-2', k.positive ? 'text-success' : 'text-danger')}>
              <TrendingUp className="h-3 w-3" /> {k.delta}
            </div>
            <div className="text-[10px] text-ink-muted mt-2 pt-2 border-t border-ink-line/60">
              источник: {MACRO_SOURCES[k.labelKey] ?? 'stat.uz'}
            </div>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        <Card padding="lg">
          <CardTitle>ВВП и экспорт · 2020–2025</CardTitle>
          <CardDescription>млрд долларов США</CardDescription>
          <div className="h-72 mt-5">
            <ResponsiveContainer>
              <AreaChart data={GDP_TIMELINE} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="gdpFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8B6F3A" stopOpacity={0.32} />
                    <stop offset="100%" stopColor="#8B6F3A" stopOpacity={0.02} />
                  </linearGradient>
                  <linearGradient id="expFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#5B8DB8" stopOpacity={0.28} />
                    <stop offset="100%" stopColor="#5B8DB8" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="#EFF1F4" />
                <XAxis dataKey="year" fontSize={11} stroke="#5A6575" tickLine={false} />
                <YAxis fontSize={11} stroke="#5A6575" tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid #E5E7EB', fontSize: 13 }} />
                <Area type="monotone" dataKey="gdp" stroke="#8B6F3A" strokeWidth={2.5} fill="url(#gdpFill)" name="ВВП" />
                <Area type="monotone" dataKey="export" stroke="#5B8DB8" strokeWidth={2.5} fill="url(#expFill)" name="Экспорт" />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card padding="lg">
          <CardTitle>Доля МСБ в ВВП</CardTitle>
          <CardDescription>2020–2025, %</CardDescription>
          <div className="h-72 mt-5">
            <ResponsiveContainer>
              <LineChart data={SME_SHARE} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid vertical={false} stroke="#EFF1F4" />
                <XAxis dataKey="year" fontSize={11} stroke="#5A6575" tickLine={false} />
                <YAxis fontSize={11} stroke="#5A6575" tickLine={false} axisLine={false} domain={[50, 65]} />
                <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid #E5E7EB', fontSize: 13 }} />
                <Line type="monotone" dataKey="share" stroke="#1B2A3D" strokeWidth={3} dot={{ r: 4, fill: '#8B6F3A', stroke: '#1B2A3D', strokeWidth: 2 }} name="Доля МСБ, %" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}

/* ─────────── Tab 2: industries ─────────── */
function IndustriesTab() {
  return (
    <div className="grid lg:grid-cols-2 gap-5">
      <Card padding="lg">
        <CardTitle>Структура ВВП по отраслям</CardTitle>
        <CardDescription>2025, %</CardDescription>
        <div className="h-80 mt-5">
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={INDUSTRIES_BREAKDOWN}
                dataKey="value"
                nameKey="name"
                cx="50%" cy="50%"
                outerRadius={110}
                innerRadius={55}
                paddingAngle={2}
                label={(e) => `${e.value}%`}
                labelLine={false}
              >
                {INDUSTRIES_BREAKDOWN.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Pie>
              <Tooltip
                contentStyle={{ borderRadius: 10, border: '1px solid #E5E7EB', fontSize: 13 }}
                formatter={(v: number) => `${v}%`}
              />
              <Legend iconType="circle" layout="vertical" verticalAlign="middle" align="right" wrapperStyle={{ fontSize: 12, paddingLeft: 16 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card padding="lg">
        <CardTitle>Рост отраслей YoY</CardTitle>
        <CardDescription>2025, %</CardDescription>
        <div className="h-80 mt-5">
          <ResponsiveContainer>
            <BarChart data={INDUSTRY_GROWTH} layout="vertical" margin={{ top: 10, right: 16, left: 10, bottom: 0 }}>
              <CartesianGrid horizontal={false} stroke="#EFF1F4" />
              <XAxis type="number" fontSize={11} stroke="#5A6575" tickLine={false} axisLine={false} />
              <YAxis type="category" dataKey="name" fontSize={12} stroke="#1B2A3D" width={120} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid #E5E7EB', fontSize: 13 }} formatter={(v: number) => `${v}%`} cursor={{ fill: 'rgba(139,111,58,0.08)' }} />
              <Bar dataKey="growth" radius={[0, 6, 6, 0]} fill="#8B6F3A" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}

/* ─────────── Tab 3: trade ─────────── */
function TradeTab() {
  return (
    <div>
      <div className="grid md:grid-cols-4 gap-3 mb-6">
        <Card><div className="text-xs text-ink-muted">Экспорт 2025</div><div className="kpi-number text-success mt-1">{TRADE_BALANCE.exports}<span className="text-sm text-ink-muted"> млрд $</span></div></Card>
        <Card><div className="text-xs text-ink-muted">Импорт 2025</div><div className="kpi-number text-navy mt-1">{TRADE_BALANCE.imports}<span className="text-sm text-ink-muted"> млрд $</span></div></Card>
        <Card><div className="text-xs text-ink-muted">Сальдо</div><div className="kpi-number text-danger mt-1">{TRADE_BALANCE.balance}<span className="text-sm text-ink-muted"> млрд $</span></div></Card>
        <Card><div className="text-xs text-ink-muted">Покрытие импорта</div><div className="kpi-number text-gold mt-1">{TRADE_BALANCE.coverage}<span className="text-sm text-ink-muted">%</span></div></Card>
      </div>

      <Card padding="lg">
        <CardTitle>Топ-7 стран экспорта</CardTitle>
        <CardDescription>млрд $ и % экспорта, 2025</CardDescription>
        <div className="h-80 mt-5">
          <ResponsiveContainer>
            <BarChart data={TOP_EXPORT_COUNTRIES} margin={{ top: 10, right: 16, left: 0, bottom: 0 }}>
              <CartesianGrid vertical={false} stroke="#EFF1F4" />
              <XAxis dataKey="country" fontSize={11} stroke="#5A6575" tickLine={false} />
              <YAxis fontSize={11} stroke="#5A6575" tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{ borderRadius: 10, border: '1px solid #E5E7EB', fontSize: 13 }}
                cursor={{ fill: 'rgba(139,111,58,0.08)' }}
                formatter={(v: number, name) => [name === 'billion' ? `${v} млрд $` : `${v}%`, name === 'billion' ? 'Объём' : 'Доля']}
              />
              <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="billion" fill="#1B2A3D" radius={[6, 6, 0, 0]} name="Объём, млрд $" />
              <Bar dataKey="pct" fill="#8B6F3A" radius={[6, 6, 0, 0]} name="Доля, %" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}

/* ─────────── Tab 4: commodity prices ─────────── */
function PricesTab() {
  return (
    <Card padding="none" className="overflow-hidden">
      <div className="p-5 border-b border-ink-line flex items-center justify-between">
        <div>
          <CardTitle>Цены ключевых commodities</CardTitle>
          <CardDescription>Еженедельный snapshot</CardDescription>
        </div>
        <Badge variant="info">Обновлено: 15 апр. 2026</Badge>
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-ink-muted bg-bg-band">
            <th className="py-3 px-5 font-medium">Товар</th>
            <th className="py-3 px-5 font-medium">Ед. изм.</th>
            <th className="py-3 px-5 font-medium text-right">Цена</th>
            <th className="py-3 px-5 font-medium text-right">Δ за неделю</th>
          </tr>
        </thead>
        <tbody>
          {COMMODITY_PRICES.map((c, i) => {
            const Icon = c.change > 0 ? TrendingUp : c.change < 0 ? TrendingDown : Minus;
            const col = c.change > 0 ? 'text-success' : c.change < 0 ? 'text-danger' : 'text-ink-muted';
            return (
              <tr key={i} className="border-t border-ink-line hover:bg-bg-band/60 transition-colors">
                <td className="py-3 px-5 font-medium text-ink">{c.name}</td>
                <td className="py-3 px-5 text-ink-muted">{c.unit}</td>
                <td className="py-3 px-5 text-right font-mono font-semibold text-ink">{c.price.toLocaleString('ru')}</td>
                <td className={cn('py-3 px-5 text-right font-medium', col)}>
                  <span className="inline-flex items-center gap-1 justify-end">
                    <Icon className="h-3.5 w-3.5" />
                    {c.change > 0 ? '+' : ''}{c.change}%
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </Card>
  );
}

/* ─────────── Tab 5: international reports (Sprint 4) ─────────── */
function ReportsTab() {
  const categoryLabels: Record<IntlReport['category'], string> = {
    country:  'Страновой обзор',
    sme:      'МСБ и финансирование',
    regional: 'Региональный',
    trade:    'Торговая политика',
    climate:  'Климат',
  };
  return (
    <div>
      <div className="surface-card bg-secondary/5 border-secondary/25 p-4 mb-6 flex items-start gap-3">
        <BookOpen className="h-5 w-5 text-secondary shrink-0 mt-0.5" />
        <div className="text-sm text-ink leading-relaxed">
          <strong className="font-serif text-ink">Каталог открытых международных отчётов по Узбекистану.</strong>{' '}
          Обновляется модератором МЭФ ежеквартально. В Ф3 — автоподтягивание по RSS/метаданным от публикующих организаций.
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        {INTL_REPORTS.map((r, i) => (
          <motion.a
            key={r.id}
            href={r.url}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.3, delay: i * 0.04 }}
          >
            <Card hover className="h-full">
              <div className="flex items-start justify-between gap-3 mb-2 flex-wrap">
                <div className="flex-1 min-w-0">
                  <div className="text-xs uppercase tracking-wider text-gold font-semibold mb-1">
                    {r.publisher}
                  </div>
                  <CardTitle className="text-[15px] leading-snug">{r.title}</CardTitle>
                </div>
                <Badge variant="outline">{r.year}</Badge>
              </div>
              <CardDescription className="text-[12.5px] leading-relaxed">
                {r.summary}
              </CardDescription>
              <div className="mt-4 pt-3 border-t border-ink-line/60 flex items-center justify-between">
                <Badge variant="queue">{categoryLabels[r.category]}</Badge>
                <div className="text-xs text-gold flex items-center gap-1 font-medium">
                  Открыть <ExternalLink className="h-3 w-3" />
                </div>
              </div>
            </Card>
          </motion.a>
        ))}
      </div>
    </div>
  );
}

/* ─────────── Tab 6: events (Sprint 4) ─────────── */
function EventsTab() {
  const typeMeta: Record<BizEvent['type'], { label: string; Icon: typeof Calendar; color: string }> = {
    forum:    { label: 'Форум',    Icon: Users,      color: 'text-gold'      },
    expo:     { label: 'Выставка', Icon: Building2,  color: 'text-secondary' },
    training: { label: 'Тренинг',  Icon: BookOpen,   color: 'text-success'   },
    summit:   { label: 'Саммит',   Icon: Award,      color: 'text-gold-dark' },
  };
  return (
    <div>
      <div className="surface-card bg-gold-soft/40 border-gold/25 p-4 mb-6 flex items-start gap-3">
        <Calendar className="h-5 w-5 text-gold shrink-0 mt-0.5" />
        <div className="text-sm text-ink leading-relaxed">
          <strong className="font-serif text-ink">Предстоящие форумы, выставки и тренинги для МСБ.</strong>{' '}
          Наполняется модератором МЭФ совместно с отраслевыми ассоциациями и организаторами.
          В Ф3 — автоинтеграция с календарями УзТПП, IT Park, бизнес-школы МЭФ.
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        {UPCOMING_EVENTS.map((e, i) => {
          const meta = typeMeta[e.type];
          const Ic = meta.Icon;
          return (
            <motion.div
              key={e.id}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.3, delay: i * 0.04 }}
            >
              <Card hover className="h-full">
                <div className="flex items-start gap-3 mb-3">
                  <div className={`h-10 w-10 rounded-xl bg-bg-band flex items-center justify-center shrink-0 ${meta.color}`}>
                    <Ic className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-0.5">
                      <Badge variant="outline">{meta.label}</Badge>
                      {e.registrationOpen ? (
                        <Badge variant="success">регистрация открыта</Badge>
                      ) : (
                        <Badge variant="queue">регистрация позже</Badge>
                      )}
                    </div>
                    <CardTitle className="text-[15px] leading-snug">{e.title}</CardTitle>
                  </div>
                </div>
                <CardDescription className="text-[12.5px] leading-relaxed mb-3">
                  {e.summary}
                </CardDescription>
                <div className="grid grid-cols-2 gap-2 text-[12px] text-ink-muted">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-3 w-3" />
                    {e.endDate ? `${e.startDate} – ${e.endDate}` : e.startDate}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-3 w-3" />
                    <span className="truncate">{e.location}</span>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-ink-line/60 flex items-center justify-between text-xs">
                  <span className="text-ink-muted">Организатор: <strong className="text-ink">{e.organiser}</strong></span>
                  {e.url && (
                    <a
                      href={e.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gold hover:text-gold-dark inline-flex items-center gap-1 font-medium"
                      onClick={(ev) => ev.stopPropagation()}
                    >
                      Сайт <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
