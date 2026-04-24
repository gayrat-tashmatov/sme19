'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ShoppingBag, Users2, Globe, Gavel, Plane, Store, Smartphone, Building2,
  Sparkles, CheckCircle2, AlertCircle, ArrowRight, TrendingUp, Target,
  BarChart3, Info,
} from 'lucide-react';
import { Card, CardTitle, CardDescription } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { PhaseRoadmapStrip } from '@/components/sections/PhaseRoadmapStrip';

// ═══════════════════════════════════════════════════════════════════
// Sprint 7 · N_Sales — Sales Channels Map
// 5 channels · industry matrix · mix strategy · KPIs · cross-links
// ═══════════════════════════════════════════════════════════════════

interface Channel {
  id: 'b2c' | 'b2b' | 'ecom' | 'gov' | 'export';
  name: string;
  shortName: string;
  Icon: typeof Store;
  color: string;
  description: string;
  bestFor: string[];
  avgMargin: string;
  avgDealSize: string;
  cycleLength: string;
  barriers: string[];
  keyKpis: string[];
  linkedModule?: { title: string; href: string };
}

const CHANNELS: Channel[] = [
  {
    id: 'b2c',
    name: 'B2C · розничные продажи',
    shortName: 'B2C',
    Icon: Store,
    color: 'text-gold',
    description: 'Прямые продажи физическим лицам: розничные магазины, кафе, сервисы, онлайн-витрина.',
    bestFor: ['Товары массового спроса', 'Услуги физлицам', 'Общепит', 'Beauty и здоровье'],
    avgMargin: '30–60%',
    avgDealSize: '50 тыс – 500 тыс сум',
    cycleLength: 'от 1 минуты',
    barriers: ['Локация критична', 'Зависимость от трафика', 'Конкуренция за внимание'],
    keyKpis: ['Средний чек', 'Конверсия в покупку', 'LTV клиента', 'Количество возвратных клиентов'],
    linkedModule: { title: 'Геоаналитика · подбор места', href: '/modules/geo' },
  },
  {
    id: 'b2b',
    name: 'B2B · корпоративные продажи',
    shortName: 'B2B',
    Icon: Users2,
    color: 'text-secondary',
    description: 'Продажи другим бизнесам через Cooperation.uz, прямые контракты, отраслевые гильдии.',
    bestFor: ['Производство компонентов', 'Оптовые поставки', 'B2B-услуги', 'SaaS для бизнеса'],
    avgMargin: '15–35%',
    avgDealSize: '5 млн – 500 млн сум',
    cycleLength: '1–6 месяцев',
    barriers: ['Длинный цикл сделки', 'Нужен отдел продаж', 'Требуется репутация'],
    keyKpis: ['Pipeline value', 'Win rate', 'Average contract value', 'Customer retention'],
    linkedModule: { title: 'B2B/B2G коммуникация', href: '/modules/comms' },
  },
  {
    id: 'ecom',
    name: 'E-commerce · маркетплейсы',
    shortName: 'E-commerce',
    Icon: Smartphone,
    color: 'text-gold-dark',
    description: 'Продажи через Uzum, Wildberries, Amazon, собственный интернет-магазин.',
    bestFor: ['Одежда и обувь', 'Электроника', 'Детские товары', 'Сувениры'],
    avgMargin: '15–40%',
    avgDealSize: '100 тыс – 2 млн сум',
    cycleLength: 'от 1 дня',
    barriers: ['Комиссия 10–25%', 'Логистика и возвраты', 'Фотосессия и карточки'],
    keyKpis: ['Conversion rate', 'Средний чек', 'Оборачиваемость склада', 'Рейтинг продавца'],
    linkedModule: { title: 'E-commerce и маркетплейсы', href: '/modules/ecommerce' },
  },
  {
    id: 'gov',
    name: 'Госзакупки · B2G',
    shortName: 'Тендеры',
    Icon: Gavel,
    color: 'text-navy',
    description: 'Продажи государственным и муниципальным заказчикам через тендеры на xarid.uzex.uz и 6 ведомственных площадок.',
    bestFor: ['Униформа и спецодежда', 'Строительство и ремонт', 'IT-услуги', 'Продукты питания'],
    avgMargin: '10–20%',
    avgDealSize: '100 млн – 5 млрд сум',
    cycleLength: '1–3 месяца',
    barriers: ['Квалификационные требования', 'Банковская гарантия', 'Сложная документация'],
    keyKpis: ['Win rate по тендерам', 'Средний размер контракта', 'Соблюдение сроков исполнения'],
    linkedModule: { title: 'Госзакупки · поиск тендеров', href: '/modules/nProcure' },
  },
  {
    id: 'export',
    name: 'Экспорт · зарубежные рынки',
    shortName: 'Экспорт',
    Icon: Plane,
    color: 'text-success',
    description: 'Продажи в зарубежные страны через прямые контракты, международные B2B, торговые миссии.',
    bestFor: ['Текстиль', 'АПК и сушёные фрукты', 'Ремёсла и сувениры', 'IT-услуги'],
    avgMargin: '20–45%',
    avgDealSize: '$10K – $500K',
    cycleLength: '3–12 месяцев',
    barriers: ['Сертификация и стандарты', 'Валютный контроль', 'Логистика'],
    keyKpis: ['Количество стран', 'Валютная выручка', 'Доля экспорта в обороте', 'NPS зарубежных клиентов'],
    linkedModule: { title: 'Экспортный навигатор', href: '/modules/nExport' },
  },
];

interface IndustryMatrix {
  industry: string;
  icon: string;
  channels: Record<Channel['id'], 'primary' | 'secondary' | 'unsuitable'>;
  recommendation: string;
}

const MATRIX: IndustryMatrix[] = [
  { industry: 'Кафе и общепит',          icon: '☕', channels: { b2c: 'primary',    b2b: 'secondary',  ecom: 'secondary',  gov: 'unsuitable', export: 'unsuitable' }, recommendation: 'B2C + доставка (Яндекс.Еда, Uzum Eats) + event-catering для B2B' },
  { industry: 'IT и разработка',           icon: '💻', channels: { b2c: 'secondary',  b2b: 'primary',    ecom: 'unsuitable', gov: 'primary',    export: 'primary'   }, recommendation: 'B2B + тендеры + экспорт IT-услуг (льготы IT-парка)' },
  { industry: 'Текстильное производство',  icon: '🧵', channels: { b2c: 'secondary',  b2b: 'primary',    ecom: 'secondary',  gov: 'primary',    export: 'primary'   }, recommendation: 'B2B оптовые каналы + тендеры на униформу + экспорт в РФ/Турцию' },
  { industry: 'Сельское хозяйство',        icon: '🌾', channels: { b2c: 'secondary',  b2b: 'primary',    ecom: 'secondary',  gov: 'primary',    export: 'primary'   }, recommendation: 'B2B переработчики + тендеры интернатов + экспорт сушёных фруктов' },
  { industry: 'Beauty-салон',              icon: '💅', channels: { b2c: 'primary',    b2b: 'unsuitable', ecom: 'secondary',  gov: 'unsuitable', export: 'unsuitable' }, recommendation: 'B2C + онлайн-запись + продажа косметики через e-commerce' },
  { industry: 'Интернет-магазин',          icon: '🛒', channels: { b2c: 'primary',    b2b: 'secondary',  ecom: 'primary',    gov: 'unsuitable', export: 'secondary'  }, recommendation: 'E-commerce маркетплейсы + собственный сайт + экспорт в СНГ' },
  { industry: 'Ремёсла и сувениры',        icon: '🎨', channels: { b2c: 'primary',    b2b: 'secondary',  ecom: 'primary',    gov: 'unsuitable', export: 'primary'   }, recommendation: 'B2C туризм + e-commerce Etsy/Amazon + экспорт через Halal-сегмент' },
  { industry: 'Мебельное производство',    icon: '🪑', channels: { b2c: 'secondary',  b2b: 'primary',    ecom: 'secondary',  gov: 'primary',    export: 'secondary'  }, recommendation: 'B2B застройщики + тендеры на офисную мебель + B2C через шоурум' },
];

interface Kpi {
  channel: string;
  metric: string;
  target: string;
  action: string;
}

const KEY_KPIS: Kpi[] = [
  { channel: 'B2C',         metric: 'Средний чек',           target: '≥ 150 тыс сум',      action: 'Cross-sell и up-sell' },
  { channel: 'B2C',         metric: 'Конверсия посещение→покупка', target: '5–15%',              action: 'Мерчандайзинг, персонал' },
  { channel: 'B2B',         metric: 'Pipeline velocity',      target: '< 60 дней',          action: 'Автоматизация CRM' },
  { channel: 'B2B',         metric: 'Win rate',              target: '≥ 30%',              action: 'Улучшение пресейла' },
  { channel: 'E-commerce',  metric: 'Конверсия в покупку',   target: '2–5%',               action: 'A/B-тесты, лучшие фото' },
  { channel: 'E-commerce',  metric: 'Рейтинг продавца',       target: '≥ 4.7',              action: 'Быстрые ответы, возвраты без споров' },
  { channel: 'Тендеры',     metric: 'Win rate по тендерам',  target: '≥ 20%',              action: 'Анализ проигранных заявок' },
  { channel: 'Экспорт',     metric: 'Доля экспорта в обороте', target: '≥ 25% через 2 года', action: 'Диверсификация рынков' },
];

function getCellStyle(v: 'primary' | 'secondary' | 'unsuitable'): { bg: string; label: string } {
  if (v === 'primary')     return { bg: 'bg-success text-white',      label: 'основной' };
  if (v === 'secondary')   return { bg: 'bg-gold/70 text-white',      label: 'вторичный' };
  return                         { bg: 'bg-ink-line text-ink-muted',  label: '—' };
}

export function N_Sales() {
  const [activeChannel, setActiveChannel] = useState<Channel['id']>('b2b');
  const current = CHANNELS.find((c) => c.id === activeChannel) ?? CHANNELS[0];

  return (
    <section className="container-wide py-10 md:py-14 space-y-8">
      {/* Hero */}
      <Card padding="lg" tone="navy" className="text-white relative overflow-hidden">
        <div className="absolute inset-0 pattern-dots opacity-30 pointer-events-none" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <Badge variant="new">NEW · ч. жизненного цикла</Badge>
            <span className="text-xs uppercase tracking-wider text-gold-light">Этап 8 · Каналы сбыта</span>
          </div>
          <h2 className="font-serif text-2xl md:text-3xl text-white mb-2 leading-tight">
            Каналы сбыта — B2C, B2B, E-commerce, тендеры, экспорт
          </h2>
          <p className="text-white/75 max-w-3xl text-sm leading-relaxed">
            Карта 5 основных каналов сбыта для МСБ Узбекистана. Детальное описание каждого — маржа, размер сделки,
            цикл продаж, барьеры, KPI. Матрица «канал × отрасль» и рекомендации по микс-стратегии.
            Перекрёстные ссылки на профильные модули Платформы.
          </p>
        </div>
      </Card>

      <PhaseRoadmapStrip
        embedded
        currentPhase={2}
        points={[
          { phase: 2, text: 'Обзор 5 каналов сбыта (B2C, B2B, E-commerce, тендеры, экспорт)' },
          { phase: 2, text: 'Матрица «канал × 8 отраслей» с рекомендациями по mix' },
          { phase: 2, text: 'Ключевые KPI каждого канала с целевыми значениями' },
          { phase: 2, text: 'Cross-ссылки на специализированные модули (comms, ecom, nProcure, nExport)' },
          { phase: 2, text: 'Отраслевые кейсы и best-practice от чемпионов предпринимательства' },
          { phase: 3, text: 'AI-рекомендации mix каналов на основе данных Soliq и отрасли' },
          { phase: 4, text: 'Персональный sales-дашборд с интеграцией CRM (1С, Битрикс24, amoCRM)' },
        ]}
      />

      {/* ─── Channels overview ─── */}
      <Card padding="lg">
        <div className="flex items-start gap-3 mb-5">
          <div className="h-11 w-11 rounded-xl bg-gold/15 text-gold flex items-center justify-center shrink-0">
            <ShoppingBag className="h-5 w-5" />
          </div>
          <div>
            <CardTitle>5 каналов сбыта · сравнение</CardTitle>
            <CardDescription className="mt-0.5">
              Выбирайте канал по цели и возможностям. Для большинства МСБ правильно работать в mix 2–3 каналах одновременно.
            </CardDescription>
          </div>
        </div>

        {/* Channel selector */}
        <div className="grid grid-cols-5 gap-2 mb-5">
          {CHANNELS.map((c) => {
            const isActive = c.id === activeChannel;
            return (
              <button
                key={c.id}
                onClick={() => setActiveChannel(c.id)}
                className={`p-3 rounded-lg border-2 text-left transition-all ${
                  isActive ? 'border-gold bg-gold-soft/50 shadow-subtle' : 'border-ink-line bg-bg-white hover:border-gold/40'
                }`}
              >
                <c.Icon className={`h-5 w-5 ${isActive ? 'text-gold' : 'text-ink-muted'}`} />
                <div className={`mt-2 text-[12px] font-semibold leading-tight ${isActive ? 'text-ink' : 'text-ink-muted'}`}>
                  {c.shortName}
                </div>
              </button>
            );
          })}
        </div>

        {/* Active channel details */}
        <motion.div
          key={current.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="p-5 rounded-xl border border-gold/25 bg-gold-soft/15"
        >
          <div className="flex items-start gap-3 mb-4 flex-wrap">
            <div className="h-12 w-12 rounded-xl bg-gold text-white flex items-center justify-center shrink-0">
              <current.Icon className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <CardTitle className="text-[17px]">{current.name}</CardTitle>
              <CardDescription className="text-[13px] mt-0.5">{current.description}</CardDescription>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-3 mb-4">
            <div className="p-3 rounded-lg bg-bg-white border border-gold/20">
              <div className="text-[10px] uppercase tracking-wider text-ink-muted font-semibold">Средняя маржа</div>
              <div className="font-serif text-lg font-bold text-gold mt-0.5">{current.avgMargin}</div>
            </div>
            <div className="p-3 rounded-lg bg-bg-white border border-gold/20">
              <div className="text-[10px] uppercase tracking-wider text-ink-muted font-semibold">Средний размер сделки</div>
              <div className="font-serif text-lg font-bold text-navy mt-0.5">{current.avgDealSize}</div>
            </div>
            <div className="p-3 rounded-lg bg-bg-white border border-gold/20">
              <div className="text-[10px] uppercase tracking-wider text-ink-muted font-semibold">Длина цикла продаж</div>
              <div className="font-serif text-lg font-bold text-secondary mt-0.5">{current.cycleLength}</div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="h-4 w-4 text-success" />
                <div className="text-sm font-serif font-semibold text-ink">Лучше всего для</div>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {current.bestFor.map((b, i) => (
                  <span key={i} className="text-[11.5px] px-2 py-1 rounded-md bg-success/10 text-success font-medium">
                    {b}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="h-4 w-4 text-danger" />
                <div className="text-sm font-serif font-semibold text-ink">Барьеры входа</div>
              </div>
              <ul className="space-y-1">
                {current.barriers.map((b, i) => (
                  <li key={i} className="flex items-start gap-1.5 text-[12.5px] text-ink-soft">
                    <span className="text-danger mt-0.5 shrink-0">✕</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="h-4 w-4 text-gold" />
              <div className="text-sm font-serif font-semibold text-ink">Ключевые метрики канала</div>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {current.keyKpis.map((k, i) => (
                <span key={i} className="text-[11.5px] px-2 py-1 rounded-md bg-gold/10 text-gold-dark font-medium">
                  {k}
                </span>
              ))}
            </div>
          </div>

          {current.linkedModule && (
            <div className="pt-3 border-t border-gold/20">
              <Link
                href={current.linkedModule.href}
                className="text-sm text-gold hover:text-gold-dark font-semibold inline-flex items-center gap-1"
              >
                Подробный модуль: {current.linkedModule.title} <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          )}
        </motion.div>
      </Card>

      {/* ─── Industry × channel matrix ─── */}
      <Card padding="lg">
        <div className="flex items-start gap-3 mb-5">
          <div className="h-11 w-11 rounded-xl bg-secondary/15 text-secondary flex items-center justify-center shrink-0">
            <Target className="h-5 w-5" />
          </div>
          <div>
            <CardTitle>Матрица каналов по отраслям</CardTitle>
            <CardDescription className="mt-0.5">
              Какие каналы наиболее эффективны для вашей отрасли. Основной канал приносит 50+% выручки,
              вторичный — поддерживающий. Микс увеличивает устойчивость.
            </CardDescription>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[720px]">
            <thead>
              <tr className="text-left text-ink-muted bg-bg-band">
                <th className="py-2 px-3 font-medium text-[11px] uppercase tracking-wider">Отрасль</th>
                {CHANNELS.map((c) => (
                  <th key={c.id} className="py-2 px-2 font-medium text-[11px] uppercase tracking-wider text-center">
                    {c.shortName}
                  </th>
                ))}
                <th className="py-2 px-3 font-medium text-[11px] uppercase tracking-wider">Рекомендация</th>
              </tr>
            </thead>
            <tbody>
              {MATRIX.map((m, i) => (
                <tr key={i} className="border-t border-ink-line">
                  <td className="py-2.5 px-3">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{m.icon}</span>
                      <span className="font-medium text-ink text-[12.5px]">{m.industry}</span>
                    </div>
                  </td>
                  {CHANNELS.map((c) => {
                    const val = m.channels[c.id];
                    const style = getCellStyle(val);
                    return (
                      <td key={c.id} className="py-2 px-2 text-center">
                        <span className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-semibold ${style.bg}`}>
                          {style.label}
                        </span>
                      </td>
                    );
                  })}
                  <td className="py-2.5 px-3 text-[12px] text-ink-soft leading-snug">
                    {m.recommendation}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex items-center gap-4 flex-wrap text-[11px]">
          <div className="flex items-center gap-1.5">
            <span className="inline-block h-3 w-3 rounded bg-success" />
            <span className="text-ink-soft">Основной канал</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="inline-block h-3 w-3 rounded bg-gold/70" />
            <span className="text-ink-soft">Вторичный канал</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="inline-block h-3 w-3 rounded bg-ink-line" />
            <span className="text-ink-soft">Не подходит или требует больших инвестиций</span>
          </div>
        </div>
      </Card>

      {/* ─── KPI reference ─── */}
      <Card padding="lg">
        <div className="flex items-start gap-3 mb-5">
          <div className="h-11 w-11 rounded-xl bg-success/15 text-success flex items-center justify-center shrink-0">
            <BarChart3 className="h-5 w-5" />
          </div>
          <div>
            <CardTitle>Целевые KPI по каналам</CardTitle>
            <CardDescription className="mt-0.5">
              Ориентиры для средних МСБ. Зависят от отрасли, региона, зрелости бизнеса — но задают правильный порядок значений.
            </CardDescription>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-2">
          {KEY_KPIS.map((k, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -8 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.25, delay: i * 0.03 }}
              className="p-3 rounded-lg border border-ink-line bg-bg-white flex items-start gap-3"
            >
              <Badge variant="outline">{k.channel}</Badge>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-ink">{k.metric}</div>
                <div className="text-[11px] text-gold font-semibold mt-0.5">Цель: {k.target}</div>
                <div className="text-[11px] text-ink-muted mt-0.5">{k.action}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* ─── Mix strategy ─── */}
      <Card padding="lg" className="border-gold/25 bg-gold-soft/15">
        <div className="flex items-start gap-3 mb-4">
          <div className="h-11 w-11 rounded-xl bg-gold text-white flex items-center justify-center shrink-0">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <CardTitle>Микс-стратегия · правило 2–3 каналов</CardTitle>
            <CardDescription className="mt-0.5">
              Одноканальный бизнес хрупкий. Развитие 2–3 дополняющих каналов делает выручку устойчивой.
            </CardDescription>
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-3">
          <div className="p-4 rounded-xl border border-gold/20 bg-bg-white">
            <div className="text-[11px] uppercase tracking-wider text-ink-muted font-semibold mb-1">Старт · 1 канал</div>
            <div className="font-serif text-lg text-ink">Сфокусируйтесь</div>
            <div className="text-[12px] text-ink-soft mt-1.5 leading-snug">
              Выберите один основной канал, дойдите до устойчивого оборота и узнаваемого качества. Распылятся — обречь себя на медленный рост.
            </div>
          </div>
          <div className="p-4 rounded-xl border border-gold/50 bg-gold/10 shadow-subtle">
            <div className="text-[11px] uppercase tracking-wider text-gold-dark font-semibold mb-1">Рост · 2–3 канала</div>
            <div className="font-serif text-lg text-ink">Диверсифицируйтесь</div>
            <div className="text-[12px] text-ink-soft mt-1.5 leading-snug">
              Когда основной канал стабилен — добавьте 1–2 дополняющих. Например: B2C + e-commerce + B2B. Это снижает риски и увеличивает маржу.
            </div>
          </div>
          <div className="p-4 rounded-xl border border-gold/20 bg-bg-white">
            <div className="text-[11px] uppercase tracking-wider text-ink-muted font-semibold mb-1">Зрелость · 4–5 каналов</div>
            <div className="font-serif text-lg text-ink">Масштабируйтесь</div>
            <div className="text-[12px] text-ink-soft mt-1.5 leading-snug">
              Зрелый бизнес работает во всех применимых каналах: продаёт частным лицам, предприятиям, государству, экспортирует. Каждый канал — отдельная команда.
            </div>
          </div>
        </div>
      </Card>

      {/* Footer callout */}
      <Card padding="lg" className="border-success/25 bg-success/[0.03]">
        <div className="flex items-start gap-4 flex-wrap">
          <div className="h-10 w-10 rounded-lg bg-success/10 text-success flex items-center justify-center shrink-0">
            <Sparkles className="h-5 w-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-serif font-semibold text-ink">Связано с другими модулями</div>
            <CardDescription className="mt-1">
              Каждый канал сбыта — самостоятельный модуль с глубоким наполнением. Выберите основной и используйте его инструменты.
            </CardDescription>
            <div className="mt-3 grid sm:grid-cols-3 lg:grid-cols-5 gap-2">
              <Link href="/modules/comms" className="text-xs text-gold hover:text-gold-dark inline-flex items-center gap-1">
                B2B · Cooperation <ArrowRight className="h-3 w-3" />
              </Link>
              <Link href="/modules/ecommerce" className="text-xs text-gold hover:text-gold-dark inline-flex items-center gap-1">
                E-commerce <ArrowRight className="h-3 w-3" />
              </Link>
              <Link href="/modules/nProcure" className="text-xs text-gold hover:text-gold-dark inline-flex items-center gap-1">
                Госзакупки <ArrowRight className="h-3 w-3" />
              </Link>
              <Link href="/modules/nExport" className="text-xs text-gold hover:text-gold-dark inline-flex items-center gap-1">
                Экспорт <ArrowRight className="h-3 w-3" />
              </Link>
              <Link href="/modules/nLifecycle" className="text-xs text-gold hover:text-gold-dark inline-flex items-center gap-1">
                Жизненный цикл <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </div>
      </Card>
    </section>
  );
}
