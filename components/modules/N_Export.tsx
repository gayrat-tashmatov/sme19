'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Plane, Globe, FileCheck, Truck, DollarSign, Megaphone, Sparkles, CheckCircle2,
  AlertCircle, ArrowRight, ExternalLink, Info, TrendingUp, Package, Award,
  MapPin, Briefcase,
} from 'lucide-react';
import { Card, CardTitle, CardDescription } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { PhaseRoadmapStrip } from '@/components/sections/PhaseRoadmapStrip';

// ═══════════════════════════════════════════════════════════════════
// Sprint 7 · N_Export — Export Navigator
// 5-step process · country reference · certifications · subsidies ·
// Enterprise Uzbekistan
// ═══════════════════════════════════════════════════════════════════

interface ExportStep {
  order: number;
  title: string;
  subtitle: string;
  duration: string;
  Icon: typeof Plane;
  keyActions: string[];
  pitfalls: string[];
  resources: string[];
}

const EXPORT_STEPS: ExportStep[] = [
  {
    order: 1,
    title: 'Анализ целевого рынка',
    subtitle: 'Выбор страны, оценка спроса, конкуренция, таможенные правила',
    duration: '1–3 месяца',
    Icon: Globe,
    keyActions: [
      'Определите 2–3 целевые страны с наибольшим потенциалом',
      'Изучите объём рынка, конкурентов, средние цены',
      'Проверьте торговые режимы и тарифы (ЕАЭС, ВТО, СНГ, ЗСТ)',
      'Оцените требования к продукту (сертификаты, маркировка)',
    ],
    pitfalls: [
      'Экспорт «на всё подряд» без фокуса → потеря ресурсов',
      'Игнорирование культурных и языковых особенностей',
    ],
    resources: [
      'Enterprise Uzbekistan — консультации',
      'ЦАР-базы данных по товарным кодам ТН ВЭД',
    ],
  },
  {
    order: 2,
    title: 'Сертификация и стандарты',
    subtitle: 'ISO, HACCP, CE, FSC, Halal — в зависимости от продукта и страны',
    duration: '3–6 месяцев',
    Icon: FileCheck,
    keyActions: [
      'ISO 9001 — базовый стандарт качества, почти везде',
      'HACCP — для пищевой промышленности',
      'CE — для ЕС и всех товаров, требующих европейской маркировки',
      'Halal — для стран ОИС (Малайзия, Индонезия, Саудовская Аравия)',
      'FSC — для лесной и мебельной продукции',
    ],
    pitfalls: [
      'Покупка «сертификата за 10 дней» — отзываются при первой проверке',
      'Отсутствие поддержания системы качества после получения',
    ],
    resources: [
      'Torgsert — национальный орган сертификации',
      'Субсидия НФ009: компенсация 50% затрат на сертификацию',
    ],
  },
  {
    order: 3,
    title: 'Таможня и документооборот',
    subtitle: 'ГТД, инвойсы, упаковочные листы, сертификаты происхождения',
    duration: 'на каждую поставку',
    Icon: Truck,
    keyActions: [
      'Регистрация во внешнеэкономической деятельности (ВЭД) в Soliq',
      'Получение сертификата происхождения СТ-1 или Form-A',
      'Подготовка ГТД (грузовая таможенная декларация) в customs.uz',
      'Страхование груза и оформление договора перевозки',
    ],
    pitfalls: [
      'Неправильный код ТН ВЭД → задержки и доначисление пошлин',
      'Отсутствие страховки груза при международной перевозке',
    ],
    resources: [
      'customs.uz — электронное декларирование',
      'Таможенные брокеры — упрощение первых поставок',
    ],
  },
  {
    order: 4,
    title: 'Валютный контроль',
    subtitle: 'Паспорт сделки, возврат валютной выручки, репатриация',
    duration: 'постоянно',
    Icon: DollarSign,
    keyActions: [
      'Оформите паспорт сделки в уполномоченном банке при контракте > $100K',
      'Отслеживайте сроки возврата валютной выручки (180 дней по ЦБ)',
      'Репатриируйте выручку в установленные сроки — штрафы до 100% от суммы',
      'Ведите учёт валютных операций для отчётности в ЦБ',
    ],
    pitfalls: [
      'Просрочка репатриации = административная ответственность и штрафы',
      'Расчёты через третьи страны без оформления — налоговый и валютный риск',
    ],
    resources: [
      'cbu.uz — разъяснения Центробанка',
      'Банк обслуживающий внешнеэкономическую деятельность',
    ],
  },
  {
    order: 5,
    title: 'Маркетинг и продвижение',
    subtitle: 'B2B-площадки, Enterprise Uzbekistan, участие в выставках',
    duration: 'постоянно',
    Icon: Megaphone,
    keyActions: [
      'Зарегистрируйтесь на Enterprise.uz — господдержка экспорта',
      'Участвуйте в международных отраслевых выставках',
      'Создайте английскую/русскую/целевую-языковую версию сайта',
      'Размещайтесь на международных B2B: Alibaba, Globalpiyasa, European Sources',
    ],
    pitfalls: [
      'Переводы через Google Translate без вычитки носителем',
      'Отсутствие exportable-материалов (карточки продукта, видео, тех.описания)',
    ],
    resources: [
      'Enterprise.uz — единое окно поддержки экспорта',
      'UzTPP — организация экспортных миссий',
    ],
  },
];

interface TargetMarket {
  country: string;
  flag: string;
  tradeRegime: string;
  keyProducts: string[];
  avgTariff: string;
  smeShare: string;
  tips: string[];
}

const TARGET_MARKETS: TargetMarket[] = [
  {
    country: 'Россия',
    flag: '🇷🇺',
    tradeRegime: 'Зона свободной торговли СНГ · ЕАЭС-партнёр',
    keyProducts: ['Текстиль', 'Плодоовощи', 'Мебель', 'Стройматериалы'],
    avgTariff: '0% по большинству позиций',
    smeShare: '~ 38% от экспорта МСБ',
    tips: [
      'Регистрация в системе «Меркурий» для сельхозпродукции',
      'Маркировка «Честный знак» для ряда товаров',
      'Требуется русскоязычная техдокументация',
    ],
  },
  {
    country: 'Казахстан',
    flag: '🇰🇿',
    tradeRegime: 'ЕАЭС · таможенный союз',
    keyProducts: ['Автозапчасти', 'Продукты питания', 'Одежда', 'Химическая продукция'],
    avgTariff: '0% внутри ЕАЭС',
    smeShare: '~ 12% от экспорта МСБ',
    tips: [
      'Сертификация по техрегламентам ЕАЭС (ТР ТС)',
      'Регистрация продукции в реестре ЕЭК',
      'Приграничная логистика — низкие издержки',
    ],
  },
  {
    country: 'Китай',
    flag: '🇨🇳',
    tradeRegime: 'Соглашение о стратегическом партнёрстве',
    keyProducts: ['Хлопок-волокно', 'Медь', 'Уран', 'Плодоовощи'],
    avgTariff: '5–12% для сельхоз; 0% для сырья',
    smeShare: '~ 8% от экспорта МСБ',
    tips: [
      'Фитосанитарные сертификаты для сельхозпродукции',
      'Китайские B2B: Alibaba, Made-in-China',
      'Сложная логистика — требует опыта',
    ],
  },
  {
    country: 'Турция',
    flag: '🇹🇷',
    tradeRegime: 'Преференциальный режим + ОИС',
    keyProducts: ['Хлопок', 'Шёлк', 'Ковры', 'Сушёные фрукты'],
    avgTariff: '0–8%',
    smeShare: '~ 6% от экспорта МСБ',
    tips: [
      'Halal-сертификация даёт премию',
      'Активные торговые палаты на стороне Турции',
      'Участие в İzmir Economic Forum',
    ],
  },
  {
    country: 'ЕС',
    flag: '🇪🇺',
    tradeRegime: 'GSP+ (Generalised Scheme of Preferences)',
    keyProducts: ['Текстиль', 'Натуральные материалы', 'Ковры', 'Фрукты'],
    avgTariff: 'Льготные тарифы по GSP+',
    smeShare: '~ 5% от экспорта МСБ',
    tips: [
      'Жёсткие требования к качеству и документам',
      'CE-маркировка + экологические стандарты',
      'Требуется европейский представитель или импортёр',
    ],
  },
  {
    country: 'ОАЭ',
    flag: '🇦🇪',
    tradeRegime: 'Соглашение о свободной торговле (ССЭТ)',
    keyProducts: ['Ювелирные изделия', 'Фрукты', 'Текстиль', 'Декор'],
    avgTariff: '0% с 2024 по СЭЗ',
    smeShare: '~ 4% от экспорта МСБ',
    tips: [
      'Халяль-сертификация',
      'Дубай Expo + выставки как входная точка',
      'Низкое налогообложение партнёров в СЭЗ',
    ],
  },
];

interface ExportCertification {
  id: string;
  name: string;
  forIndustries: string[];
  cost: string;
  duration: string;
  issuer: string;
}

const CERTIFICATIONS: ExportCertification[] = [
  { id: 'iso',   name: 'ISO 9001 · система менеджмента качества', forIndustries: ['Все отрасли'],                            cost: '50–120 млн сум', duration: '3–6 мес', issuer: 'Аккредитованные органы Uzakkred' },
  { id: 'haccp', name: 'HACCP · безопасность пищевых продуктов',   forIndustries: ['Пищепром', 'Общепит', 'Сельхоз'],         cost: '25–80 млн сум',  duration: '2–4 мес', issuer: 'Torgsert + аккредитованные' },
  { id: 'ce',    name: 'CE · европейская маркировка',              forIndustries: ['Электроника', 'Игрушки', 'Стройматериалы'], cost: '80–250 млн сум', duration: '4–8 мес', issuer: 'Европейские Notified Bodies' },
  { id: 'halal', name: 'Halal · халяльная сертификация',            forIndustries: ['Пищепром', 'Косметика', 'Фарма'],         cost: '15–40 млн сум',  duration: '1–3 мес', issuer: 'Муфтий УзТПП · аккредитован в странах ОИС' },
  { id: 'fsc',   name: 'FSC · лесная сертификация',                forIndustries: ['Мебель', 'Бумага', 'Дерево'],              cost: '40–90 млн сум',  duration: '3–6 мес', issuer: 'FSC International' },
  { id: 'gost',  name: 'ГОСТ Р / ТР ТС · евразийские регламенты',  forIndustries: ['Все для ЕАЭС'],                            cost: '20–60 млн сум',  duration: '1–3 мес', issuer: 'Роскачество + аккредитованные в РФ' },
];

const KEY_STATS = [
  { label: 'Доля МСБ в экспорте РУз',       value: '~ 30%',    note: '+3 п.п. за 2 года' },
  { label: 'Экспортёры МСБ',                value: '~ 14 800', note: 'рост +22% к 2025' },
  { label: 'Средний контракт МСБ',          value: '~ $85K',   note: '+18% к 2025' },
  { label: 'Топ-3 рынка',                    value: 'RU · KZ · CN', note: '~ 58% экспорта МСБ' },
];

export function N_Export() {
  const [activeStep, setActiveStep] = useState<number>(1);

  const current = EXPORT_STEPS.find((s) => s.order === activeStep) ?? EXPORT_STEPS[0];

  return (
    <section className="container-wide py-10 md:py-14 space-y-8">
      {/* Hero */}
      <Card padding="lg" tone="navy" className="text-white relative overflow-hidden">
        <div className="absolute inset-0 pattern-dots opacity-30 pointer-events-none" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <Badge variant="new">NEW · ч. жизненного цикла</Badge>
            <span className="text-xs uppercase tracking-wider text-gold-light">Этап 10 · Экспорт</span>
          </div>
          <h2 className="font-serif text-2xl md:text-3xl text-white mb-2 leading-tight">
            Экспортный навигатор — от местного рынка к зарубежному
          </h2>
          <p className="text-white/75 max-w-3xl text-sm leading-relaxed">
            5-шаговый процесс выхода на экспорт: анализ рынка, сертификация, таможня, валютный контроль, маркетинг.
            Справочник по 6 ключевым рынкам, 6 видам сертификации, субсидии на экспортную логистику.
            Интеграция с Enterprise Uzbekistan — единым окном господдержки экспорта.
          </p>
        </div>
      </Card>

      <PhaseRoadmapStrip
        embedded
        currentPhase={2}
        points={[
          { phase: 2, text: '5-шаговый процесс экспорта с ключевыми действиями и типичными ошибками' },
          { phase: 2, text: 'Справочник 6 приоритетных рынков (RU, KZ, CN, TR, EU, AE)' },
          { phase: 2, text: '6 видов экспортной сертификации с ценами и сроками' },
          { phase: 2, text: 'Ссылки на Enterprise.uz, customs.uz, UzTPP, Torgsert' },
          { phase: 2, text: 'Отраслевые гайды по экспорту (текстиль, АПК, IT-услуги, ремёсла)' },
          { phase: 3, text: 'Интеграция с customs.uz через МИП — статус ГТД в кабинет', blockedBy: 'кибер-экспертиза' },
          { phase: 3, text: 'База данных зарубежных партнёров и распределителей' },
          { phase: 4, text: 'AI-матчинг экспортной продукции с спросом в 30+ странах' },
        ]}
      />

      {/* ─── Export stats ─── */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {KEY_STATS.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.25, delay: i * 0.05 }}
          >
            <Card>
              <div className="flex items-start justify-between mb-2">
                <Plane className="h-5 w-5 text-gold" />
                <TrendingUp className="h-3.5 w-3.5 text-success" />
              </div>
              <div className="kpi-number text-navy text-[22px]">{s.value}</div>
              <div className="text-xs text-ink-muted mt-1">{s.label}</div>
              <div className="text-[11px] text-success mt-1 italic">{s.note}</div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* ─── 5-step process ─── */}
      <Card padding="lg">
        <div className="flex items-start gap-3 mb-5">
          <div className="h-11 w-11 rounded-xl bg-gold/15 text-gold flex items-center justify-center shrink-0">
            <Plane className="h-5 w-5" />
          </div>
          <div>
            <CardTitle>Процесс экспорта за 5 шагов</CardTitle>
            <CardDescription className="mt-0.5">
              Последовательный путь от идеи экспорта до первой сделки. Полный цикл — 6–12 месяцев подготовки.
            </CardDescription>
          </div>
        </div>

        {/* Step selector */}
        <div className="grid grid-cols-5 gap-2 mb-5">
          {EXPORT_STEPS.map((s) => {
            const isActive = s.order === activeStep;
            return (
              <button
                key={s.order}
                onClick={() => setActiveStep(s.order)}
                className={`p-3 rounded-lg border-2 text-left transition-all ${
                  isActive
                    ? 'border-gold bg-gold-soft/50 shadow-subtle'
                    : 'border-ink-line bg-bg-white hover:border-gold/40'
                }`}
              >
                <div className={`h-8 w-8 rounded-lg flex items-center justify-center mb-2 ${
                  isActive ? 'bg-gold text-white' : 'bg-bg-band text-ink-muted'
                }`}>
                  <s.Icon className="h-4 w-4" />
                </div>
                <div className={`text-[10px] uppercase tracking-wider font-semibold ${isActive ? 'text-gold-dark' : 'text-ink-muted'}`}>
                  Шаг {s.order}
                </div>
                <div className={`text-[12px] font-medium leading-tight mt-0.5 ${isActive ? 'text-ink' : 'text-ink-muted'}`}>
                  {s.title}
                </div>
              </button>
            );
          })}
        </div>

        {/* Step details */}
        <motion.div
          key={current.order}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="p-5 rounded-xl border border-gold/25 bg-gold-soft/20"
        >
          <div className="flex items-start gap-3 mb-4 flex-wrap">
            <div className="h-12 w-12 rounded-xl bg-gold text-white flex items-center justify-center shrink-0">
              <current.Icon className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <Badge variant="priority-solid">Шаг {current.order} / 5</Badge>
                <Badge variant="outline">{current.duration}</Badge>
              </div>
              <CardTitle className="text-[17px]">{current.title}</CardTitle>
              <CardDescription className="text-[13px]">{current.subtitle}</CardDescription>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="h-4 w-4 text-success" />
                <div className="text-sm font-serif font-semibold text-ink">Ключевые действия</div>
              </div>
              <ul className="space-y-1.5">
                {current.keyActions.map((a, i) => (
                  <li key={i} className="flex items-start gap-1.5 text-[13px] text-ink-soft leading-relaxed">
                    <span className="h-5 w-5 rounded-full bg-gold/15 text-gold flex items-center justify-center shrink-0 mt-0.5 font-mono text-[10px] font-semibold">
                      {i + 1}
                    </span>
                    <span>{a}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="h-4 w-4 text-danger" />
                <div className="text-sm font-serif font-semibold text-ink">Типичные ошибки</div>
              </div>
              <ul className="space-y-1.5">
                {current.pitfalls.map((p, i) => (
                  <li key={i} className="flex items-start gap-1.5 text-[13px] text-ink-soft leading-relaxed">
                    <span className="text-danger mt-0.5 shrink-0">✕</span>
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="pt-3 border-t border-gold/20">
            <div className="text-[11px] uppercase tracking-wider text-ink-muted font-semibold mb-1.5">
              Полезные ресурсы
            </div>
            <div className="flex flex-wrap gap-1.5">
              {current.resources.map((r, i) => (
                <span key={i} className="text-[11.5px] text-gold font-medium px-2 py-1 rounded-md bg-gold/10">
                  {r}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </Card>

      {/* ─── Target markets ─── */}
      <Card padding="lg">
        <div className="flex items-start gap-3 mb-5">
          <div className="h-11 w-11 rounded-xl bg-secondary/15 text-secondary flex items-center justify-center shrink-0">
            <Globe className="h-5 w-5" />
          </div>
          <div>
            <CardTitle>6 приоритетных рынков для МСБ</CardTitle>
            <CardDescription className="mt-0.5">
              Топ-направления по объёму экспорта МСБ. Каждое — с торговым режимом, ключевыми продуктами и практическими советами.
            </CardDescription>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
          {TARGET_MARKETS.map((m, i) => (
            <motion.div
              key={m.country}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.25, delay: i * 0.05 }}
            >
              <Card hover className="h-full flex flex-col">
                <div className="flex items-center gap-3 mb-2">
                  <div className="text-4xl">{m.flag}</div>
                  <div>
                    <CardTitle className="text-[15px]">{m.country}</CardTitle>
                    <div className="text-[11px] text-gold-dark">{m.smeShare}</div>
                  </div>
                </div>
                <div className="text-[12px] text-ink-muted mb-2">{m.tradeRegime}</div>
                <div className="text-[11px] uppercase tracking-wider text-ink-muted font-semibold mt-2">
                  Ключевые продукты
                </div>
                <div className="flex flex-wrap gap-1 mt-1 mb-2">
                  {m.keyProducts.map((p, pi) => (
                    <span key={pi} className="text-[10.5px] px-1.5 py-0.5 rounded bg-bg-band/60 text-ink-soft">
                      {p}
                    </span>
                  ))}
                </div>
                <div className="text-[11.5px] text-gold font-medium">Тариф: {m.avgTariff}</div>
                <div className="mt-3 pt-3 border-t border-ink-line/60 flex-1">
                  <div className="text-[10px] uppercase tracking-wider text-ink-muted font-semibold mb-1">
                    Советы
                  </div>
                  <ul className="space-y-0.5">
                    {m.tips.map((t, ti) => (
                      <li key={ti} className="flex items-start gap-1 text-[11.5px] text-ink-soft">
                        <span className="text-gold shrink-0 mt-0.5">›</span>
                        <span>{t}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* ─── Certifications ─── */}
      <Card padding="lg">
        <div className="flex items-start gap-3 mb-5">
          <div className="h-11 w-11 rounded-xl bg-success/15 text-success flex items-center justify-center shrink-0">
            <Award className="h-5 w-5" />
          </div>
          <div>
            <CardTitle>Ключевые виды сертификации</CardTitle>
            <CardDescription className="mt-0.5">
              Международные стандарты для экспорта. Стоимость и сроки ориентировочные — зависят от размера компании.
              Субсидия НФ009 компенсирует до 50% затрат.
            </CardDescription>
          </div>
        </div>

        <div className="space-y-2">
          {CERTIFICATIONS.map((c, i) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, x: -8 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.25, delay: i * 0.03 }}
              className="p-3 rounded-lg border border-ink-line bg-bg-white flex items-start gap-3 flex-wrap"
            >
              <div className="h-10 w-10 rounded-lg bg-success/10 text-success flex items-center justify-center shrink-0">
                <FileCheck className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-serif font-semibold text-ink text-[14.5px] leading-tight">{c.name}</div>
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {c.forIndustries.map((ind, ii) => (
                    <span key={ii} className="text-[10.5px] px-1.5 py-0.5 rounded bg-bg-band/60 text-ink-muted">
                      {ind}
                    </span>
                  ))}
                </div>
                <div className="text-[11px] text-ink-muted mt-1">Выдаёт: {c.issuer}</div>
              </div>
              <div className="text-right shrink-0">
                <div className="font-serif text-sm font-semibold text-gold">{c.cost}</div>
                <div className="text-[10px] text-ink-muted">срок: {c.duration}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* ─── Enterprise Uzbekistan callout ─── */}
      <Card padding="lg" className="border-gold/25 bg-gold-soft/25">
        <div className="flex items-start gap-4 flex-wrap">
          <div className="h-12 w-12 rounded-xl bg-gold text-white flex items-center justify-center shrink-0">
            <Plane className="h-6 w-6" />
          </div>
          <div className="flex-1 min-w-0">
            <CardTitle className="text-[17px]">Enterprise Uzbekistan — единое окно господдержки экспорта</CardTitle>
            <CardDescription className="text-[13px] mt-1">
              Государственный оператор экспортной поддержки. Бесплатные консультации, субсидии на логистику и сертификацию,
              организация торговых миссий, участие в международных выставках, поиск зарубежных партнёров.
            </CardDescription>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
              <div className="p-3 rounded-lg bg-bg-white border border-gold/20">
                <Briefcase className="h-4 w-4 text-gold mb-1.5" />
                <div className="text-[12px] font-medium text-ink">Консультации</div>
                <div className="text-[11px] text-ink-muted">по странам и продуктам</div>
              </div>
              <div className="p-3 rounded-lg bg-bg-white border border-gold/20">
                <Truck className="h-4 w-4 text-gold mb-1.5" />
                <div className="text-[12px] font-medium text-ink">Логистика</div>
                <div className="text-[11px] text-ink-muted">субсидия 30%</div>
              </div>
              <div className="p-3 rounded-lg bg-bg-white border border-gold/20">
                <Award className="h-4 w-4 text-gold mb-1.5" />
                <div className="text-[12px] font-medium text-ink">Сертификация</div>
                <div className="text-[11px] text-ink-muted">компенсация 50%</div>
              </div>
              <div className="p-3 rounded-lg bg-bg-white border border-gold/20">
                <Globe className="h-4 w-4 text-gold mb-1.5" />
                <div className="text-[12px] font-medium text-ink">Торговые миссии</div>
                <div className="text-[11px] text-ink-muted">до 50% компенсация участия</div>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <a
                href="https://enterprise.uz"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-gold hover:text-gold-dark font-medium inline-flex items-center gap-1"
              >
                enterprise.uz <ExternalLink className="h-3.5 w-3.5" />
              </a>
              <span className="text-ink-muted">·</span>
              <a
                href="https://customs.uz"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-gold hover:text-gold-dark font-medium inline-flex items-center gap-1"
              >
                customs.uz <ExternalLink className="h-3.5 w-3.5" />
              </a>
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
              Экспорт затрагивает налоги (льготы IT-парка), сбыт (e-commerce + B2B-площадки), кредиты (экспортное финансирование).
            </CardDescription>
            <div className="mt-3 grid sm:grid-cols-3 gap-2">
              <Link href="/modules/ecommerce" className="text-xs text-gold hover:text-gold-dark inline-flex items-center gap-1">
                E-commerce и маркетплейсы <ArrowRight className="h-3 w-3" />
              </Link>
              <Link href="/modules/nSales" className="text-xs text-gold hover:text-gold-dark inline-flex items-center gap-1">
                Каналы сбыта <ArrowRight className="h-3 w-3" />
              </Link>
              <Link href="/modules/nCredit" className="text-xs text-gold hover:text-gold-dark inline-flex items-center gap-1">
                Кредитный навигатор <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </div>
      </Card>
    </section>
  );
}
