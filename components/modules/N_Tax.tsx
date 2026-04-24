'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Receipt, Calculator, Calendar, BookOpen, TrendingUp, AlertCircle,
  CheckCircle2, ExternalLink, Sparkles, ShieldCheck, ArrowRight,
  Percent, Wallet, FileText, Info,
} from 'lucide-react';
import { Card, CardTitle, CardDescription } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { PhaseRoadmapStrip } from '@/components/sections/PhaseRoadmapStrip';

// ═══════════════════════════════════════════════════════════════════
// Sprint 7 · N_Tax — Taxes for MSB
// Calculator + regime comparison + Sustainability Rating + tax calendar
// Rates illustrative · final rates are in Tax Code and change yearly
// ═══════════════════════════════════════════════════════════════════

interface TaxRegime {
  id: 'usn' | 'nds' | 'esp-fixed' | 'it-park';
  name: string;
  shortName: string;
  rate: string;
  base: string;
  bestFor: string;
  pros: string[];
  cons: string[];
  turnoverLimit?: string;
}

const REGIMES: TaxRegime[] = [
  {
    id: 'usn',
    name: 'Упрощённый налоговый режим (УСН)',
    shortName: 'УСН',
    rate: '4%',
    base: 'оборот (все поступления)',
    bestFor: 'Микро и малые бизнесы с оборотом до 1 млрд сум/год',
    pros: [
      'Простое администрирование — одна декларация в квартал',
      'Освобождение от НДС и налога на прибыль',
      'Низкие временные затраты на учёт',
    ],
    cons: [
      'Нельзя работать с НДС-плательщиками без потери конкурентоспособности',
      'Ограничение по обороту — 1 млрд сум/год',
      'Нельзя принимать к вычету входящий НДС',
    ],
    turnoverLimit: 'до 1 млрд сум/год',
  },
  {
    id: 'nds',
    name: 'Общеустановленный режим с НДС',
    shortName: 'НДС + Налог на прибыль',
    rate: '12% + 15%',
    base: 'добавленная стоимость + прибыль',
    bestFor: 'Средний и крупный бизнес, работающий с плательщиками НДС',
    pros: [
      'Возможность работать с крупными корпоративными клиентами',
      'Вычет входящего НДС — реальная экономия',
      'Без ограничения по обороту',
    ],
    cons: [
      'Ежемесячная декларация НДС + ежеквартальная по прибыли',
      'Требуется профессиональный бухгалтер',
      'Высокие штрафы за ошибки в декларациях',
    ],
  },
  {
    id: 'esp-fixed',
    name: 'Фиксированный налог для ремесленников и самозанятых',
    shortName: 'Фикс. налог',
    rate: '~1 млн сум/год',
    base: 'фиксированная сумма',
    bestFor: 'Самозанятые, ремесленники, мелкие услуги без сотрудников',
    pros: [
      'Фиксированная сумма — прогнозируемая налоговая нагрузка',
      'Без деклараций по доходам — только уплата налога',
      'Подходит для начинающих и подработки',
    ],
    cons: [
      'Ограничение по видам деятельности',
      'Нельзя нанимать сотрудников',
      'Лимит годового дохода',
    ],
  },
  {
    id: 'it-park',
    name: 'Льготный режим резидентов IT-парка',
    shortName: 'IT-парк',
    rate: '0% + 7.5%',
    base: 'нулевой подоходный + сниженный ЕСП',
    bestFor: 'IT-компании: разработка ПО, аутсорсинг, SaaS, экспорт IT-услуг',
    pros: [
      'Нулевой подоходный налог (до 2028 года)',
      'Сниженный соцналог с фонда оплаты труда',
      'Освобождение от некоторых видов проверок',
      'Налоговые каникулы при экспорте IT-услуг',
    ],
    cons: [
      'Требуется резидентство IT-парка (фильтры по видам деятельности)',
      'Обязательства по росту экспорта и найму',
    ],
  },
];

interface RatingLevel {
  category: string;
  scoreRange: string;
  colorClass: string;
  benefits: string[];
}

const RATING_LEVELS: RatingLevel[] = [
  { category: 'AAA', scoreRange: '96–100 баллов', colorClass: 'bg-success text-white', benefits: ['Без налоговых проверок', 'Возмещение НДС за 1 день без проверки', 'Рекомендация к госнаградам на День предпринимателей'] },
  { category: 'AA',  scoreRange: '91–95 баллов',  colorClass: 'bg-success/90 text-white', benefits: ['Рассрочка по госактивам до 5 лет без %', 'Упрощённое получение льгот в 4–5 категории районов'] },
  { category: 'A',   scoreRange: '86–90 баллов',  colorClass: 'bg-gold text-white', benefits: ['Стандартные налоговые льготы', 'Ускоренное рассмотрение заявок на субсидии'] },
  { category: 'B',   scoreRange: '81–85 баллов',  colorClass: 'bg-gold/80 text-white', benefits: ['Базовый набор льгот', 'Доступ к большинству мер поддержки'] },
  { category: 'C',   scoreRange: '26–80 баллов',  colorClass: 'bg-ink-muted text-white', benefits: ['Ограниченный доступ к льготам', 'Стандартный контроль от ГНК'] },
  { category: 'D',   scoreRange: 'до 25 баллов',  colorClass: 'bg-danger text-white', benefits: ['Частые проверки', 'Невозможность получить большинство льгот'] },
];

interface TaxDate {
  date: string;
  title: string;
  regime: string;
  importance: 'high' | 'medium' | 'low';
}

const TAX_CALENDAR_2026: TaxDate[] = [
  { date: '20 апр', title: 'Декларация по НДС за март',                    regime: 'НДС',      importance: 'high' },
  { date: '25 апр', title: 'Декларация по УСН за Q1',                       regime: 'УСН',      importance: 'high' },
  { date: '30 апр', title: 'Расчёт ЕСП за март',                             regime: 'Все',      importance: 'high' },
  { date: '10 мая', title: 'Уплата налога на имущество (1-й платёж)',        regime: 'Все',      importance: 'medium' },
  { date: '20 мая', title: 'Декларация по НДС за апрель',                    regime: 'НДС',      importance: 'high' },
  { date: '30 мая', title: 'Расчёт ЕСП за апрель',                           regime: 'Все',      importance: 'high' },
  { date: '20 июн', title: 'Декларация по НДС за май',                       regime: 'НДС',      importance: 'high' },
  { date: '15 июл', title: 'Авансовый платёж налога на прибыль за Q2',       regime: 'Прибыль',  importance: 'high' },
  { date: '20 июл', title: 'Декларация по НДС за июнь',                      regime: 'НДС',      importance: 'high' },
  { date: '25 июл', title: 'Декларация по УСН за Q2',                        regime: 'УСН',      importance: 'high' },
];

interface TaxGuide {
  title: string;
  summary: string;
  topics: string[];
  duration: string;
  lexLink?: string;
}

const GUIDES: TaxGuide[] = [
  {
    title: 'НДС: практическое руководство',
    summary: 'Когда становиться плательщиком, как работать с вычетами, возмещение, спецрежимы (экспорт, сельхоз).',
    topics: ['Регистрация плательщика', 'Вычеты и документы', 'Возмещение НДС', 'НДС при экспорте'],
    duration: '12 мин чтения',
    lexLink: 'https://lex.uz/nk-vat',
  },
  {
    title: 'Единый социальный платёж (ЕСП)',
    summary: 'Как считать, куда платить, особенности для разных категорий работников, льготы работодателя.',
    topics: ['Ставка ЕСП', 'Расчёт с оклада', 'Льготы для молодёжи', 'Отчётность в Soliq'],
    duration: '8 мин чтения',
  },
  {
    title: 'Льготы IT-парка',
    summary: 'Как стать резидентом, обязательства, нулевой подоходный, экспортные льготы, продление до 2028.',
    topics: ['Условия резидентства', 'Обязательства по росту', 'Налоговые каникулы', 'Обход частых ошибок'],
    duration: '10 мин чтения',
  },
  {
    title: 'Приоритетные районы 4–5 категории',
    summary: 'Какие районы, какие льготы, как применять. Стимулы для локализации производства.',
    topics: ['Список районов', 'Виды льгот', 'Документы для получения', 'Комбинирование со статусом МСБ'],
    duration: '7 мин чтения',
  },
  {
    title: 'Рейтинг устойчивости: как дойти до AAA',
    summary: '23 критерия ПКМ №55, практические действия по улучшению категории, типичные ошибки.',
    topics: ['Критерии оценки', 'Повышение категории', 'Оспаривание оценки', 'Использование льгот AAA'],
    duration: '15 мин чтения',
    lexLink: 'https://lex.uz/pkm55',
  },
  {
    title: 'Налоговый календарь и санкции',
    summary: 'Штрафы за просрочку, способы уплаты, электронное взаимодействие с ГНК.',
    topics: ['Штрафы и пени', 'Электронные платежи', 'Сверка с ГНК', 'Просрочки и реструктуризация'],
    duration: '9 мин чтения',
  },
];

// ─── Tax calculator logic ─────────────────────────────────────
function calculateTax({ regime, annualRevenue, employees, avgSalary }: {
  regime: TaxRegime['id']; annualRevenue: number; employees: number; avgSalary: number;
}) {
  const monthlyPayroll = employees * avgSalary;
  const annualPayroll  = monthlyPayroll * 12;

  // Social tax ~ 25% of payroll (ESP), personal income tax ~ 12% (withheld from employee)
  const espEmployer = annualPayroll * 0.25;
  const pit         = annualPayroll * 0.12; // withheld, not a cost but needed to show

  let incomeOrVat = 0;
  let vatCredit = 0;
  let regimeSpecificNote = '';

  if (regime === 'usn') {
    incomeOrVat = annualRevenue * 0.04;
    regimeSpecificNote = 'УСН: 4% с годового оборота, без вычета входящего НДС';
  } else if (regime === 'nds') {
    // Assume 40% value-added ratio, VAT 12%, net profit ~ 20% revenue at 15%
    const vatNet   = annualRevenue * 0.4 * 0.12;
    const profitTax = annualRevenue * 0.2 * 0.15;
    incomeOrVat = vatNet + profitTax;
    vatCredit = annualRevenue * 0.6 * 0.12; // incoming VAT that can be credited
    regimeSpecificNote = 'НДС+прибыль: 12% с добавленной стоимости (~40% оборота) + 15% с чистой прибыли';
  } else if (regime === 'esp-fixed') {
    incomeOrVat = 1_000_000;
    regimeSpecificNote = 'Фиксированный налог: ~ 1 млн сум/год, без сотрудников';
  } else if (regime === 'it-park') {
    incomeOrVat = 0; // zero CIT for residents
    const espReduced = annualPayroll * 0.075; // 7.5% ESP for IT Park
    regimeSpecificNote = 'IT-парк: 0% подоходного + 7.5% ЕСП (вместо 25%)';
    return { incomeOrVat, esp: espReduced, pit, vatCredit, monthlyPayroll, annualPayroll, regimeSpecificNote, total: incomeOrVat + espReduced };
  }

  return { incomeOrVat, esp: espEmployer, pit, vatCredit, monthlyPayroll, annualPayroll, regimeSpecificNote, total: incomeOrVat + espEmployer };
}

function formatUzs(v: number): string {
  if (v >= 1_000_000_000) return `${(v / 1_000_000_000).toFixed(2)} млрд сум`;
  if (v >= 1_000_000)     return `${(v / 1_000_000).toFixed(1)} млн сум`;
  if (v >= 1_000)         return `${(v / 1_000).toFixed(0)} тыс сум`;
  return v.toLocaleString('ru') + ' сум';
}

export function N_Tax() {
  const [activeRegime, setActiveRegime] = useState<TaxRegime['id']>('usn');
  const [revenue, setRevenue]         = useState(500_000_000);
  const [employees, setEmployees]     = useState(5);
  const [avgSalary, setAvgSalary]     = useState(5_000_000);

  const calc = useMemo(
    () => calculateTax({ regime: activeRegime, annualRevenue: revenue, employees, avgSalary }),
    [activeRegime, revenue, employees, avgSalary],
  );

  return (
    <section className="container-wide py-10 md:py-14 space-y-8">
      {/* Hero */}
      <Card padding="lg" tone="navy" className="text-white relative overflow-hidden">
        <div className="absolute inset-0 pattern-dots opacity-30 pointer-events-none" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <Badge variant="new">NEW · ч. жизненного цикла</Badge>
            <span className="text-xs uppercase tracking-wider text-gold-light">Этап 4 · Налоговый режим</span>
          </div>
          <h2 className="font-serif text-2xl md:text-3xl text-white mb-2 leading-tight">
            Налоги для МСБ — режимы, Рейтинг, календарь
          </h2>
          <p className="text-white/75 max-w-3xl text-sm leading-relaxed">
            Калькулятор нагрузки по 4 основным режимам, Рейтинг устойчивости субъектов предпринимательства,
            налоговый календарь на год, практические гайды по НДС, ЕСП, льготам IT-парка и приоритетных районов.
            Данные — с учётом актуальной редакции Налогового кодекса и ПКМ №55 от 30.01.2024.
          </p>
        </div>
      </Card>

      <PhaseRoadmapStrip
        embedded
        currentPhase={2}
        points={[
          { phase: 2, text: 'Калькулятор 4 режимов (УСН, НДС, фикс., IT-парк) с конкретными цифрами' },
          { phase: 2, text: 'Справочник по Рейтингу устойчивости (AAA → D) и соответствующим льготам' },
          { phase: 2, text: 'Налоговый календарь с ключевыми датами деклараций' },
          { phase: 2, text: '6 практических гайдов по актуальным темам налогообложения' },
          { phase: 2, text: 'Отраслевые разделы (для IT, АПК, общепита) с особенностями' },
          { phase: 3, text: 'Интеграция с Soliq через МИП — автозаполнение профиля', blockedBy: 'кибер-экспертиза' },
          { phase: 3, text: 'Персональный налоговый календарь с push-уведомлениями за N дней' },
          { phase: 4, text: 'AI-ассистент «проверь мою декларацию» до подачи в Soliq' },
        ]}
      />

      {/* ─── Tax calculator ─── */}
      <Card padding="lg">
        <div className="flex items-start gap-3 mb-5">
          <div className="h-11 w-11 rounded-xl bg-gold/15 text-gold flex items-center justify-center shrink-0">
            <Calculator className="h-5 w-5" />
          </div>
          <div>
            <CardTitle>Калькулятор налоговой нагрузки</CardTitle>
            <CardDescription className="mt-0.5">
              Подставьте свои цифры — увидите ориентировочную годовую налоговую нагрузку по каждому режиму.
              Финальные суммы считаются по Налоговому кодексу (lex.uz) — калькулятор для предварительной оценки.
            </CardDescription>
          </div>
        </div>

        <div className="grid lg:grid-cols-[1.3fr_1fr] gap-5">
          {/* Inputs */}
          <div className="space-y-4">
            <div>
              <label className="text-[11px] uppercase tracking-wider text-ink-muted font-semibold">
                Режим налогообложения
              </label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {REGIMES.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => setActiveRegime(r.id)}
                    className={`p-3 rounded-lg border-2 text-left transition-all ${
                      activeRegime === r.id
                        ? 'border-gold bg-gold-soft/50'
                        : 'border-ink-line bg-bg-white hover:border-gold/40'
                    }`}
                  >
                    <div className="font-serif font-semibold text-ink text-[13px] leading-tight">{r.shortName}</div>
                    <div className="text-[11px] text-ink-muted mt-0.5">ставка: {r.rate}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Input
                type="number"
                label="Годовой оборот, сум"
                value={revenue}
                onChange={(e) => setRevenue(Number(e.target.value))}
                leftIcon={<TrendingUp className="h-4 w-4" />}
              />
              <div className="text-[11px] text-ink-muted mt-1">
                Сейчас: {formatUzs(revenue)}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Input
                type="number"
                label="Сотрудники"
                value={employees}
                onChange={(e) => setEmployees(Number(e.target.value))}
              />
              <Input
                type="number"
                label="Ср. з/п, сум/мес"
                value={avgSalary}
                onChange={(e) => setAvgSalary(Number(e.target.value))}
              />
            </div>

            <div className="p-3 rounded-lg bg-secondary/5 border border-secondary/20 text-[12px] text-ink-soft flex items-start gap-2">
              <Info className="h-3.5 w-3.5 text-secondary shrink-0 mt-0.5" />
              <span>
                Калькулятор — предварительный. Финальный расчёт зависит от ОКЭД, региона, категории Рейтинга устойчивости
                и многих отраслевых нюансов. Для точного расчёта — консультация с ГНК или квалифицированным бухгалтером.
              </span>
            </div>
          </div>

          {/* Result */}
          <div>
            <div className="p-5 rounded-xl border-2 border-gold/30 bg-gold-soft/30">
              <div className="text-xs uppercase tracking-wider text-gold-dark font-semibold mb-3">
                Итоговая нагрузка в год
              </div>
              <div className="font-serif text-3xl font-bold text-navy">{formatUzs(calc.total)}</div>
              <div className="text-[11px] text-ink-muted mt-1">
                {((calc.total / revenue) * 100).toFixed(1)}% от оборота
              </div>

              <div className="mt-5 pt-4 border-t border-gold/20 space-y-2">
                <CalcLine
                  label={activeRegime === 'nds' ? 'НДС + прибыль' : activeRegime === 'usn' ? 'УСН 4%' : activeRegime === 'it-park' ? 'Подоходный 0%' : 'Фикс. налог'}
                  value={calc.incomeOrVat}
                />
                <CalcLine label="ЕСП работодателя" value={calc.esp} />
                {calc.vatCredit > 0 && (
                  <CalcLine label="Вычет входящего НДС" value={-calc.vatCredit} />
                )}
                <CalcLine label="ФОТ в год" value={calc.annualPayroll} muted />
              </div>

              <div className="mt-4 pt-4 border-t border-gold/20 text-[11.5px] text-ink-soft leading-snug">
                <strong className="text-ink">Режим:</strong> {calc.regimeSpecificNote}
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* ─── Regime comparison ─── */}
      <Card padding="lg">
        <div className="flex items-start gap-3 mb-5">
          <div className="h-11 w-11 rounded-xl bg-secondary/15 text-secondary flex items-center justify-center shrink-0">
            <Percent className="h-5 w-5" />
          </div>
          <div>
            <CardTitle>Сравнение режимов</CardTitle>
            <CardDescription className="mt-0.5">
              Плюсы и минусы каждого режима. Выбор делается при регистрации и изменяется раз в год по заявлению.
            </CardDescription>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-3">
          {REGIMES.map((r) => (
            <div
              key={r.id}
              className={`p-4 rounded-xl border transition-all ${
                activeRegime === r.id
                  ? 'border-gold bg-gold-soft/30 shadow-subtle'
                  : 'border-ink-line bg-bg-white'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="font-serif font-semibold text-ink text-[15px] leading-tight">{r.name}</div>
                <Badge variant="outline">{r.rate}</Badge>
              </div>
              <div className="text-[11.5px] text-gold-dark uppercase tracking-wider font-semibold mb-2">
                {r.bestFor}
              </div>
              {r.turnoverLimit && (
                <div className="text-[11px] text-ink-muted mb-2">Лимит: {r.turnoverLimit}</div>
              )}
              <div className="space-y-1 mt-2">
                {r.pros.slice(0, 2).map((p, i) => (
                  <div key={i} className="flex items-start gap-1.5 text-[12px]">
                    <CheckCircle2 className="h-3 w-3 text-success shrink-0 mt-0.5" />
                    <span className="text-ink-soft leading-snug">{p}</span>
                  </div>
                ))}
                {r.cons.slice(0, 1).map((c, i) => (
                  <div key={i} className="flex items-start gap-1.5 text-[12px]">
                    <AlertCircle className="h-3 w-3 text-gold shrink-0 mt-0.5" />
                    <span className="text-ink-muted leading-snug">{c}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* ─── Sustainability Rating ─── */}
      <Card padding="lg" className="border-gold/25 bg-gold-soft/20">
        <div className="flex items-start gap-3 mb-5">
          <div className="h-11 w-11 rounded-xl bg-gold text-white flex items-center justify-center shrink-0">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <CardTitle>Рейтинг устойчивости субъектов предпринимательства</CardTitle>
            <CardDescription className="mt-0.5">
              Официальный рейтинг Налогового комитета (ПКМ №55 от 30.01.2024) — 23 критерия, 100 баллов, 6 категорий.
              Высокая категория = быстрое возмещение НДС, отсутствие проверок, налоговые привилегии.
            </CardDescription>
          </div>
        </div>

        <div className="space-y-2">
          {RATING_LEVELS.map((l) => (
            <div key={l.category} className="p-3 rounded-lg border border-ink-line bg-bg-white flex items-start gap-3">
              <div className={`h-12 w-12 rounded-lg flex items-center justify-center font-serif font-bold text-lg shrink-0 ${l.colorClass}`}>
                {l.category}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[11px] uppercase tracking-wider text-ink-muted font-semibold">
                  {l.scoreRange}
                </div>
                <div className="mt-1 space-y-0.5">
                  {l.benefits.map((b, i) => (
                    <div key={i} className="text-[12.5px] text-ink-soft flex items-start gap-1.5">
                      <span className="text-gold mt-1 shrink-0">›</span>
                      <span>{b}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-gold/20 flex items-center justify-between flex-wrap gap-2 text-xs text-ink-muted">
          <span className="flex items-center gap-2">
            <Sparkles className="h-3.5 w-3.5 text-gold" />
            Данные через МИП от Налогового комитета — обновление ежедневное
          </span>
          <a
            href="https://my3.soliq.uz"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gold hover:text-gold-dark inline-flex items-center gap-1 font-medium"
          >
            Узнать свою категорию <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </Card>

      {/* ─── Tax calendar ─── */}
      <Card padding="lg">
        <div className="flex items-start justify-between gap-3 mb-5 flex-wrap">
          <div className="flex items-start gap-3">
            <div className="h-11 w-11 rounded-xl bg-secondary/15 text-secondary flex items-center justify-center shrink-0">
              <Calendar className="h-5 w-5" />
            </div>
            <div>
              <CardTitle>Налоговый календарь · апрель–июль 2026</CardTitle>
              <CardDescription className="mt-0.5">
                Ключевые даты подачи деклараций и уплаты налогов. В Ф3 — персональный календарь с push-уведомлениями.
              </CardDescription>
            </div>
          </div>
          <Button size="sm" variant="ghost" leftIcon={<Calendar className="h-3.5 w-3.5" />}>
            Скачать в ICS
          </Button>
        </div>

        <div className="space-y-2">
          {TAX_CALENDAR_2026.map((d, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -8 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.25, delay: i * 0.03 }}
              className={`p-3 rounded-lg border flex items-center gap-3 ${
                d.importance === 'high'
                  ? 'border-gold/30 bg-gold-soft/20'
                  : 'border-ink-line bg-bg-white'
              }`}
            >
              <div className="h-12 w-16 rounded-lg bg-navy text-white flex flex-col items-center justify-center font-serif font-bold shrink-0 text-[13px] leading-tight">
                {d.date}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-ink">{d.title}</div>
                <div className="text-xs text-ink-muted mt-0.5">режим: {d.regime}</div>
              </div>
              {d.importance === 'high' && <Badge variant="priority">важно</Badge>}
            </motion.div>
          ))}
        </div>
      </Card>

      {/* ─── Guides ─── */}
      <div>
        <h3 className="font-serif text-xl text-ink mb-4">Практические гайды</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
          {GUIDES.map((g, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
            >
              <Card hover className="h-full flex flex-col">
                <div className="flex items-center gap-2 mb-2">
                  <BookOpen className="h-4 w-4 text-gold shrink-0" />
                  <div className="text-[10px] uppercase tracking-wider text-ink-muted font-semibold">
                    {g.duration}
                  </div>
                </div>
                <CardTitle className="text-[15px] leading-snug">{g.title}</CardTitle>
                <CardDescription className="mt-1.5 text-[12.5px] flex-1">{g.summary}</CardDescription>
                <div className="mt-3 pt-3 border-t border-ink-line/60 flex items-center justify-between">
                  <div className="text-[11px] text-ink-muted">{g.topics.length} тем</div>
                  {g.lexLink ? (
                    <a
                      href={g.lexLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-gold hover:text-gold-dark inline-flex items-center gap-1 font-medium"
                    >
                      lex.uz <ExternalLink className="h-3 w-3" />
                    </a>
                  ) : (
                    <span className="text-xs text-gold font-medium">Читать →</span>
                  )}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Footer callout with cross-links */}
      <Card padding="lg" className="border-success/25 bg-success/[0.03]">
        <div className="flex items-start gap-4 flex-wrap">
          <div className="h-10 w-10 rounded-lg bg-success/10 text-success flex items-center justify-center shrink-0">
            <Sparkles className="h-5 w-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-serif font-semibold text-ink">Связано с другими модулями</div>
            <CardDescription className="mt-1">
              Налоги — неотъемлемая часть жизненного цикла. На стадии регистрации выбирается режим, при росте
              пересматривается, при экспорте добавляются особые правила, при найме — появляется ЕСП.
            </CardDescription>
            <div className="mt-3 grid sm:grid-cols-3 gap-2">
              <Link href="/modules/nLifecycle" className="text-xs text-gold hover:text-gold-dark inline-flex items-center gap-1">
                Жизненный цикл бизнеса <ArrowRight className="h-3 w-3" />
              </Link>
              <Link href="/modules/nHR" className="text-xs text-gold hover:text-gold-dark inline-flex items-center gap-1">
                Кадры и ЕСП <ArrowRight className="h-3 w-3" />
              </Link>
              <Link href="/modules/registry" className="text-xs text-gold hover:text-gold-dark inline-flex items-center gap-1">
                Льготы в реестре мер <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </div>
      </Card>
    </section>
  );
}

function CalcLine({ label, value, muted = false }: { label: string; value: number; muted?: boolean }) {
  const isNegative = value < 0;
  return (
    <div className="flex items-center justify-between gap-3 text-[13px]">
      <span className={muted ? 'text-ink-muted' : 'text-ink-soft'}>{label}</span>
      <span className={`font-mono font-semibold ${isNegative ? 'text-success' : muted ? 'text-ink-muted' : 'text-ink'}`}>
        {isNegative ? '−' : ''}{formatUzs(Math.abs(value))}
      </span>
    </div>
  );
}
