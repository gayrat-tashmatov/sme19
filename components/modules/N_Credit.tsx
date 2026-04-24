'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Coins, Calculator, Landmark, ShieldCheck, AlertCircle, CheckCircle2,
  FileText, TrendingUp, Sparkles, ArrowRight, ExternalLink, Info, XCircle,
  Building, Briefcase, Home, Package,
} from 'lucide-react';
import { Card, CardTitle, CardDescription } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { PhaseRoadmapStrip } from '@/components/sections/PhaseRoadmapStrip';

// ═══════════════════════════════════════════════════════════════════
// Sprint 7 · N_Credit — Credit Navigator
// Credit story prep · loan calculator · lender comparison ·
// collateral requirements · typical refusal reasons
// ═══════════════════════════════════════════════════════════════════

interface Lender {
  id: string;
  name: string;
  type: 'state' | 'commercial' | 'development' | 'international';
  products: number;
  typicalRate: string;
  maxAmount: string;
  maxTerm: string;
  specialty: string;
  bestFor: string;
}

const LENDERS: Lender[] = [
  {
    id: 'bdb',
    name: 'Банк развития Узбекистана',
    type: 'development',
    products: 8,
    typicalRate: 'ЦБ + 3–5%',
    maxAmount: 'до 50 млрд сум',
    maxTerm: 'до 15 лет',
    specialty: 'Долгосрочные инвестпроекты, экспорт, инфраструктура',
    bestFor: 'Крупные инвестиции, экспорт, модернизация производства',
  },
  {
    id: 'uzncb',
    name: 'ОАБ «Узнацбанк»',
    type: 'state',
    products: 12,
    typicalRate: '18–22%',
    maxAmount: 'до 10 млрд сум',
    maxTerm: 'до 7 лет',
    specialty: 'Льготное кредитование МСБ, коммерческие кредиты',
    bestFor: 'Средний бизнес, производство, сельхозпереработка',
  },
  {
    id: 'agro',
    name: 'Агробанк',
    type: 'state',
    products: 10,
    typicalRate: '16–20%',
    maxAmount: 'до 8 млрд сум',
    maxTerm: 'до 10 лет',
    specialty: 'Сельское хозяйство, АПК, фермерство',
    bestFor: 'Фермеры, переработка сельхозпродукции, ирригация',
  },
  {
    id: 'xalq',
    name: 'Халк банк',
    type: 'state',
    products: 6,
    typicalRate: '20–24%',
    maxAmount: 'до 2 млрд сум',
    maxTerm: 'до 5 лет',
    specialty: 'Микрокредиты, самозанятые, стартапы',
    bestFor: 'ИП, микробизнес, стартапы на ранней стадии',
  },
  {
    id: 'ebrd',
    name: 'EBRD Women in Business (через банки-партнёры)',
    type: 'international',
    products: 3,
    typicalRate: '18–21%',
    maxAmount: 'до 1.2 млрд сум',
    maxTerm: 'до 5 лет',
    specialty: 'Кредитование женщин-предпринимателей + менторство',
    bestFor: 'Женщины-учредители и руководительницы',
  },
  {
    id: 'anor',
    name: 'Anor Bank · коммерческий',
    type: 'commercial',
    products: 15,
    typicalRate: '22–28%',
    maxAmount: 'до 3 млрд сум',
    maxTerm: 'до 5 лет',
    specialty: 'Онлайн-заявки, быстрые решения, овердрафт',
    bestFor: 'Быстрая потребность в оборотке, овердрафт',
  },
];

interface CreditStoryStep {
  order: number;
  title: string;
  details: string;
  tips: string[];
  Icon: typeof FileText;
}

const CREDIT_STORY_STEPS: CreditStoryStep[] = [
  {
    order: 1,
    title: 'Финансовая история 12–24 месяца',
    details: 'Подготовьте P&L, движение денежных средств, балансы за последние 1–2 года. Чистая, прозрачная отчётность без «серых» схем.',
    tips: [
      'Обороты по банковскому счёту должны соответствовать декларациям',
      'Минимальный уровень рентабельности 10–15% — банки насторожат нули',
      'Стабильность доходов важнее их абсолютного размера',
    ],
    Icon: FileText,
  },
  {
    order: 2,
    title: 'Финансовая модель на срок кредита',
    details: 'Excel-модель с прогнозом P&L, кэш-флоу, коэффициентами покрытия долга (DSCR ≥ 1.3). План использования кредитных средств с разбивкой.',
    tips: [
      'Включите 3 сценария: консервативный / базовый / оптимистичный',
      'Покажите, как конкретно кредит увеличит выручку или сократит затраты',
      'DSCR выше 1.3 — комфортная зона для банка',
    ],
    Icon: TrendingUp,
  },
  {
    order: 3,
    title: 'Обеспечение (залог или гарантия)',
    details: 'Большинство банков требует залог 120–150% от суммы кредита. Варианты: недвижимость, оборудование, ТМЦ, поручительство.',
    tips: [
      'LTV по недвижимости — до 70%, по оборудованию — до 50%',
      'ТМЦ принимаются с большим дисконтом',
      'Альтернатива — гарантийный фонд поддержки МСБ (покрывает до 50% кредита)',
    ],
    Icon: Home,
  },
  {
    order: 4,
    title: 'Кредитная история учредителей и бизнеса',
    details: 'Банки проверяют кредитное бюро Креди-Инфо. Погашенные просрочки на дату подачи, без активной проблемной задолженности.',
    tips: [
      'Просрочки > 30 дней в последние 12 мес — отказ',
      'Закрытые вовремя кредиты положительно влияют на рейтинг',
      'Можно запросить свой отчёт в Креди-Инфо заранее',
    ],
    Icon: ShieldCheck,
  },
  {
    order: 5,
    title: 'Рейтинг устойчивости и отсутствие задолженностей',
    details: 'Высокая категория Рейтинга (AA и выше) даёт ускоренное рассмотрение и льготные условия. Задолженности по налогам и ЕСП — автоматический отказ.',
    tips: [
      'Категория AAA — скидка 1–2% к ставке у многих банков',
      'Погасите мелкие задолженности ≤ 1 месяц до подачи',
      'Получите справку об отсутствии задолженности из Soliq',
    ],
    Icon: ShieldCheck,
  },
];

interface RefusalReason {
  reason: string;
  frequency: number; // % of refusals
  howToFix: string;
}

const COMMON_REFUSALS: RefusalReason[] = [
  { reason: 'Слабая или нереалистичная финмодель',           frequency: 28, howToFix: 'Консультация ЦПП по бизнес-плану и финмодели (бесплатно)' },
  { reason: 'Недостаточный залог или его низкое качество',    frequency: 22, howToFix: 'Гарантийный фонд МСБ или залог нескольких активов' },
  { reason: 'Проблемная кредитная история учредителей',       frequency: 18, howToFix: 'Закрыть просрочки, подождать 6–12 мес, подавать через другой банк' },
  { reason: 'Низкий Рейтинг устойчивости (ниже B)',           frequency: 12, howToFix: 'Работа над критериями ПКМ №55: уплата в срок, отсутствие спорных операций' },
  { reason: 'Задолженности по налогам и ЕСП',                 frequency: 10, howToFix: 'Погасить до подачи, получить справку из Soliq' },
  { reason: 'Документы не соответствуют требованиям',         frequency: 6,  howToFix: 'Чек-лист пакета документов заранее' },
  { reason: 'Деятельность не подпадает под программу',        frequency: 4,  howToFix: 'Выбрать другой банк/программу с подходящим ОКЭД' },
];

interface CollateralType {
  type: string;
  ltv: string;
  note: string;
  Icon: typeof Home;
}

const COLLATERAL_TYPES: CollateralType[] = [
  { type: 'Недвижимость коммерческая',   ltv: 'до 70%',  note: 'Офисы, магазины, склады. Независимая оценка.',                       Icon: Building },
  { type: 'Недвижимость жилая',           ltv: 'до 60%',  note: 'Квартиры, дома учредителей. Без обременений.',                       Icon: Home },
  { type: 'Оборудование производственное', ltv: 'до 50%',  note: 'Новое + с сервисной историей. Переоценка ежегодно.',                Icon: Briefcase },
  { type: 'Товары в обороте (ТМЦ)',        ltv: 'до 40%',  note: 'Требуется охрана и инвентаризация. Высокий контроль.',              Icon: Package },
  { type: 'Гарантийный фонд МСБ',          ltv: 'до 50% от кредита', note: 'Госгарантия покрывает часть риска банка.',                Icon: ShieldCheck },
  { type: 'Поручительство физ. лица',      ltv: 'по доходам', note: 'Дополнительно к основному залогу.',                               Icon: Sparkles },
];

// ─── Loan calculator ────────────────────────────────────────────
function calcMonthlyPayment(principal: number, annualRate: number, months: number, kind: 'annuity' | 'diff'): {
  monthlyPayment: number; totalPaid: number; overpayment: number; firstMonth: number; lastMonth: number;
} {
  const monthlyRate = annualRate / 12 / 100;
  if (kind === 'annuity') {
    const monthlyPayment = principal * monthlyRate * Math.pow(1 + monthlyRate, months) / (Math.pow(1 + monthlyRate, months) - 1);
    const totalPaid = monthlyPayment * months;
    return {
      monthlyPayment,
      totalPaid,
      overpayment: totalPaid - principal,
      firstMonth: monthlyPayment,
      lastMonth: monthlyPayment,
    };
  } else {
    const principalPart = principal / months;
    const firstMonth = principalPart + principal * monthlyRate;
    const lastMonth = principalPart + principalPart * monthlyRate;
    const totalPaid = months * principalPart + principal * monthlyRate * (months + 1) / 2;
    return {
      monthlyPayment: (firstMonth + lastMonth) / 2,
      totalPaid,
      overpayment: totalPaid - principal,
      firstMonth,
      lastMonth,
    };
  }
}

function formatUzs(v: number): string {
  if (v >= 1_000_000_000) return `${(v / 1_000_000_000).toFixed(2)} млрд сум`;
  if (v >= 1_000_000)     return `${(v / 1_000_000).toFixed(1)} млн сум`;
  if (v >= 1_000)         return `${(v / 1_000).toFixed(0)} тыс сум`;
  return v.toLocaleString('ru') + ' сум';
}

export function N_Credit() {
  const [amount, setAmount]     = useState(500_000_000);
  const [rate, setRate]         = useState(20);
  const [termMonths, setTerm]   = useState(36);
  const [kind, setKind]         = useState<'annuity' | 'diff'>('annuity');

  const calc = useMemo(() => calcMonthlyPayment(amount, rate, termMonths, kind), [amount, rate, termMonths, kind]);

  const typeMeta: Record<Lender['type'], { label: string; color: string }> = {
    state:         { label: 'Государственный',    color: 'bg-navy/10 text-navy' },
    development:   { label: 'Банк развития',       color: 'bg-gold/15 text-gold-dark' },
    commercial:    { label: 'Коммерческий',        color: 'bg-secondary/10 text-secondary' },
    international: { label: 'Международный',       color: 'bg-success/10 text-success' },
  };

  return (
    <section className="container-wide py-10 md:py-14 space-y-8">
      {/* Hero */}
      <Card padding="lg" tone="navy" className="text-white relative overflow-hidden">
        <div className="absolute inset-0 pattern-dots opacity-30 pointer-events-none" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <Badge variant="new">NEW · ч. жизненного цикла</Badge>
            <span className="text-xs uppercase tracking-wider text-gold-light">Этап 5 · Стартовый капитал</span>
          </div>
          <h2 className="font-serif text-2xl md:text-3xl text-white mb-2 leading-tight">
            Кредитный навигатор — как получить финансирование
          </h2>
          <p className="text-white/75 max-w-3xl text-sm leading-relaxed">
            Сравнение 6 ключевых кредиторов, калькулятор платежей, пошаговая подготовка credit story,
            требования к залогу, анализ 100 причин отказов. Для МСБ — от микрокредита до проектного финансирования
            до 50 млрд сум.
          </p>
        </div>
      </Card>

      <PhaseRoadmapStrip
        embedded
        currentPhase={2}
        points={[
          { phase: 2, text: 'Сравнение 6 кредиторов (ставки, сроки, специализация)' },
          { phase: 2, text: 'Калькулятор платежей (аннуитетный и дифференцированный)' },
          { phase: 2, text: 'Пошаговая подготовка credit story за 5 шагов' },
          { phase: 2, text: 'Карточки типов залога с LTV-соотношениями' },
          { phase: 2, text: 'Топ-7 причин отказов и способы их устранения' },
          { phase: 2, text: 'Расширение до 15 кредиторов + нишевые программы (МФО, лизинг, факторинг)' },
          { phase: 3, text: 'Интеграция с банками: предварительные решения за 1 день', blockedBy: 'API банков + кибер-экспертиза' },
          { phase: 4, text: 'AI-скоринг шансов одобрения на основе профиля предпринимателя' },
        ]}
      />

      {/* ─── Loan calculator ─── */}
      <Card padding="lg">
        <div className="flex items-start gap-3 mb-5">
          <div className="h-11 w-11 rounded-xl bg-gold/15 text-gold flex items-center justify-center shrink-0">
            <Calculator className="h-5 w-5" />
          </div>
          <div>
            <CardTitle>Калькулятор платежей</CardTitle>
            <CardDescription className="mt-0.5">
              Введите сумму, ставку, срок — увидите ежемесячный платёж и общую переплату по двум схемам.
            </CardDescription>
          </div>
        </div>

        <div className="grid lg:grid-cols-[1fr_1.2fr] gap-5">
          {/* Inputs */}
          <div className="space-y-4">
            <Input
              type="number"
              label="Сумма кредита, сум"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              leftIcon={<Coins className="h-4 w-4" />}
            />
            <div className="text-[11px] text-ink-muted -mt-2">Сейчас: {formatUzs(amount)}</div>

            <div className="grid grid-cols-2 gap-3">
              <Input
                type="number"
                label="Ставка, % годовых"
                value={rate}
                onChange={(e) => setRate(Number(e.target.value))}
                step="0.5"
              />
              <Input
                type="number"
                label="Срок, месяцев"
                value={termMonths}
                onChange={(e) => setTerm(Number(e.target.value))}
              />
            </div>

            <div>
              <label className="text-[11px] uppercase tracking-wider text-ink-muted font-semibold">
                Схема погашения
              </label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <button
                  onClick={() => setKind('annuity')}
                  className={`p-3 rounded-lg border-2 text-left transition-all ${
                    kind === 'annuity' ? 'border-gold bg-gold-soft/50' : 'border-ink-line bg-bg-white'
                  }`}
                >
                  <div className="font-serif font-semibold text-ink text-[13px]">Аннуитет</div>
                  <div className="text-[11px] text-ink-muted mt-0.5">равный платёж</div>
                </button>
                <button
                  onClick={() => setKind('diff')}
                  className={`p-3 rounded-lg border-2 text-left transition-all ${
                    kind === 'diff' ? 'border-gold bg-gold-soft/50' : 'border-ink-line bg-bg-white'
                  }`}
                >
                  <div className="font-serif font-semibold text-ink text-[13px]">Дифференцированный</div>
                  <div className="text-[11px] text-ink-muted mt-0.5">убывающий</div>
                </button>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-secondary/5 border border-secondary/20 text-[12px] text-ink-soft flex items-start gap-2">
              <Info className="h-3.5 w-3.5 text-secondary shrink-0 mt-0.5" />
              <span>
                Ориентировочные ставки на апрель 2026: льготные программы от 16%, коммерческие 22–28%,
                международные 18–21%. Ставка ЦБ РУз — 14%.
              </span>
            </div>
          </div>

          {/* Result */}
          <div className="space-y-3">
            <div className="p-5 rounded-xl border-2 border-gold/30 bg-gold-soft/30">
              <div className="text-[10px] uppercase tracking-wider text-gold-dark font-semibold mb-1">
                Ежемесячный платёж {kind === 'diff' && '(в среднем)'}
              </div>
              <div className="font-serif text-3xl font-bold text-navy">
                {formatUzs(calc.monthlyPayment)}
              </div>
              <div className="text-[11px] text-ink-muted mt-0.5">
                {kind === 'diff'
                  ? `Первый: ${formatUzs(calc.firstMonth)} · Последний: ${formatUzs(calc.lastMonth)}`
                  : 'Одинаков весь срок'}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="p-3 rounded-lg border border-ink-line bg-bg-white">
                <div className="text-[10px] uppercase tracking-wider text-ink-muted font-semibold">
                  Всего к выплате
                </div>
                <div className="font-serif text-lg font-semibold text-navy mt-0.5">
                  {formatUzs(calc.totalPaid)}
                </div>
              </div>
              <div className="p-3 rounded-lg border border-danger/25 bg-danger/5">
                <div className="text-[10px] uppercase tracking-wider text-danger font-semibold">
                  Переплата
                </div>
                <div className="font-serif text-lg font-semibold text-danger mt-0.5">
                  {formatUzs(calc.overpayment)}
                </div>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-bg-band/40 border border-ink-line text-[12px] text-ink-soft leading-relaxed">
              <strong className="text-ink">Рекомендация:</strong> для МСБ с сезонной выручкой (АПК, туризм, розница в декабре)
              аннуитет удобнее — равные платежи легче планировать. Для стабильного бизнеса с растущими оборотами
              дифференцированный выгоднее — меньше общая переплата.
            </div>
          </div>
        </div>
      </Card>

      {/* ─── Lenders comparison ─── */}
      <Card padding="lg">
        <div className="flex items-start gap-3 mb-5">
          <div className="h-11 w-11 rounded-xl bg-secondary/15 text-secondary flex items-center justify-center shrink-0">
            <Landmark className="h-5 w-5" />
          </div>
          <div>
            <CardTitle>Сравнение кредиторов</CardTitle>
            <CardDescription className="mt-0.5">
              6 ключевых институтов, работающих с МСБ. Ставки и условия ориентировочные — уточняйте перед подачей.
            </CardDescription>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-3">
          {LENDERS.map((l, i) => {
            const meta = typeMeta[l.type];
            return (
              <motion.div
                key={l.id}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.25, delay: i * 0.04 }}
              >
                <Card hover className="h-full">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-[15px] leading-tight">{l.name}</CardTitle>
                      <span className={`mt-1 inline-block text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-md ${meta.color}`}>
                        {meta.label}
                      </span>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="font-serif text-lg font-bold text-gold">{l.typicalRate}</div>
                      <div className="text-[10px] text-ink-muted">ставка</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-1.5 mt-3 text-[11.5px]">
                    <div className="p-2 rounded bg-bg-band/50 text-center">
                      <div className="text-[9px] uppercase text-ink-muted">Лимит</div>
                      <div className="font-semibold text-ink">{l.maxAmount}</div>
                    </div>
                    <div className="p-2 rounded bg-bg-band/50 text-center">
                      <div className="text-[9px] uppercase text-ink-muted">Срок</div>
                      <div className="font-semibold text-ink">{l.maxTerm}</div>
                    </div>
                    <div className="p-2 rounded bg-bg-band/50 text-center">
                      <div className="text-[9px] uppercase text-ink-muted">Продуктов</div>
                      <div className="font-semibold text-ink">{l.products}</div>
                    </div>
                  </div>

                  <div className="mt-3 text-[12px] text-ink-soft leading-snug">
                    <strong className="text-ink">Специализация:</strong> {l.specialty}
                  </div>
                  <div className="mt-2 pt-2 border-t border-ink-line/60 text-[11.5px] text-gold font-medium">
                    Лучше всего для: {l.bestFor}
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </Card>

      {/* ─── Credit story preparation ─── */}
      <Card padding="lg" className="border-gold/25 bg-gold-soft/15">
        <div className="flex items-start gap-3 mb-5">
          <div className="h-11 w-11 rounded-xl bg-gold text-white flex items-center justify-center shrink-0">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <CardTitle>Подготовка credit story за 5 шагов</CardTitle>
            <CardDescription className="mt-0.5">
              Что нужно иметь в порядке до обращения в банк. Порядок важен — каждый следующий шаг опирается на предыдущие.
            </CardDescription>
          </div>
        </div>

        <div className="space-y-3">
          {CREDIT_STORY_STEPS.map((s, i) => (
            <motion.div
              key={s.order}
              initial={{ opacity: 0, x: -8 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.3, delay: i * 0.04 }}
              className="p-4 rounded-xl border border-gold/25 bg-bg-white flex items-start gap-4"
            >
              <div className="h-10 w-10 rounded-lg bg-gold text-white flex items-center justify-center shrink-0 font-serif font-bold">
                {s.order}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-serif font-semibold text-ink text-[15px] mb-1">{s.title}</div>
                <div className="text-[13px] text-ink-soft leading-relaxed mb-2">{s.details}</div>
                <ul className="space-y-1">
                  {s.tips.map((tip, ti) => (
                    <li key={ti} className="flex items-start gap-1.5 text-[12px] text-ink-soft">
                      <CheckCircle2 className="h-3 w-3 text-gold shrink-0 mt-0.5" />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* ─── Collateral types ─── */}
      <Card padding="lg">
        <div className="flex items-start gap-3 mb-5">
          <div className="h-11 w-11 rounded-xl bg-secondary/15 text-secondary flex items-center justify-center shrink-0">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <CardTitle>Типы обеспечения и LTV</CardTitle>
            <CardDescription className="mt-0.5">
              Loan-to-Value — сколько банк готов выдать от оценочной стоимости залога. Выше LTV = меньший залог при той же сумме.
            </CardDescription>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
          {COLLATERAL_TYPES.map((c, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.25, delay: i * 0.04 }}
              className="p-3 rounded-xl border border-ink-line bg-bg-white"
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="h-9 w-9 rounded-lg bg-secondary/10 text-secondary flex items-center justify-center">
                  <c.Icon className="h-4 w-4" />
                </div>
                <Badge variant="success">{c.ltv}</Badge>
              </div>
              <div className="text-sm font-medium text-ink leading-tight">{c.type}</div>
              <div className="text-[11.5px] text-ink-muted mt-1.5 leading-snug">{c.note}</div>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* ─── Common refusal reasons ─── */}
      <Card padding="lg">
        <div className="flex items-start gap-3 mb-5">
          <div className="h-11 w-11 rounded-xl bg-danger/15 text-danger flex items-center justify-center shrink-0">
            <XCircle className="h-5 w-5" />
          </div>
          <div>
            <CardTitle>Топ-7 причин отказов в кредите</CardTitle>
            <CardDescription className="mt-0.5">
              По обобщённой статистике банков, работающих с МСБ в Узбекистане. Под каждой причиной — способ её устранить.
            </CardDescription>
          </div>
        </div>

        <div className="space-y-2">
          {COMMON_REFUSALS.map((r, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -8 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.25, delay: i * 0.03 }}
              className="p-3 rounded-lg border border-ink-line bg-bg-white flex items-start gap-3"
            >
              <div className="h-10 w-10 rounded-lg bg-danger/10 flex items-center justify-center shrink-0">
                <span className="font-serif font-bold text-danger text-[13px]">{r.frequency}%</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-ink">{r.reason}</div>
                <div className="mt-1 flex items-start gap-1.5 text-[12px] text-ink-soft">
                  <ArrowRight className="h-3 w-3 text-success shrink-0 mt-0.5" />
                  <span><strong className="text-success">Что делать:</strong> {r.howToFix}</span>
                </div>
              </div>
            </motion.div>
          ))}
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
              Кредит — финансовый инструмент, тесно связанный с налогами, рейтингом и мерами поддержки.
            </CardDescription>
            <div className="mt-3 grid sm:grid-cols-3 gap-2">
              <Link href="/modules/registry?category=financial" className="text-xs text-gold hover:text-gold-dark inline-flex items-center gap-1">
                Финансовые меры поддержки <ArrowRight className="h-3 w-3" />
              </Link>
              <Link href="/modules/nTax" className="text-xs text-gold hover:text-gold-dark inline-flex items-center gap-1">
                Налоги и Рейтинг устойчивости <ArrowRight className="h-3 w-3" />
              </Link>
              <Link href="/modules/nLifecycle" className="text-xs text-gold hover:text-gold-dark inline-flex items-center gap-1">
                Жизненный цикл бизнеса <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </div>
      </Card>
    </section>
  );
}
