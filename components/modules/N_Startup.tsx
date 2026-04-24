'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Rocket, Coins, Banknote, Award, ShieldCheck, Sparkles, ArrowRight,
  ExternalLink, CheckCircle2, Clock, Calculator, TrendingUp, Users2,
  BookOpen, Building2, HelpCircle, ChevronDown, Globe, Target,
} from 'lucide-react';
import { Card, CardTitle, CardDescription } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/cn';

// ════════════════════════════════════════════════════════════════════
// Four Digital Startups Program instruments (per spot.uz article · PP-4632)
// ════════════════════════════════════════════════════════════════════
type InstrumentId = 'acceleration' | 'coinvest' | 'loan' | 'ip';

interface Instrument {
  id: InstrumentId;
  title: string;
  tagline: string;
  amount: string;
  coverage: string;
  Icon: typeof Coins;
  color: string;
  conditions: string[];
  howTo: string[];
  approvalDays: number;
  payoutDays: number;
}

const INSTRUMENTS: Instrument[] = [
  {
    id: 'acceleration',
    title: 'Компенсация акселерации',
    tagline: 'Прошёл международную программу — государство вернёт половину',
    amount: 'до $20 000',
    coverage: '50% расходов',
    Icon: Award,
    color: '#4CAF50',
    conditions: [
      'Стартап прошёл международную акселерационную программу или бизнес-курс',
      'Курс соответствует профилю деятельности стартапа',
      'Преподаватели с опытом, обоснованная стоимость',
      'Компенсация для нескольких участников из одного стартапа — но общая сумма ≤ $20 тыс',
    ],
    howTo: [
      'Заполнить форму на startupbase.uz',
      'Приложить сертификат об участии',
      'Приложить авиабилеты (эконом), чеки отеля, оплату курса',
    ],
    approvalDays: 15,
    payoutDays: 10,
  },
  {
    id: 'coinvest',
    title: 'Программа «1+1»',
    tagline: 'Привлекли инвестиции от зарубежного венчурного фонда — государство повторит',
    amount: 'до $100 000',
    coverage: '1:1 к иностранному фонду',
    Icon: Coins,
    color: '#8B6F3A',
    conditions: [
      'Инвестиции получены от иностранного фонда с активами ≥ $50 млн',
      'Стартап зарегистрирован в Узбекистане, работает 6 мес – 7 лет',
      'Совокупный годовой доход не выше 10 млрд сум',
      'IT Park Ventures получит долю на тех же условиях, что и иностранный фонд',
    ],
    howTo: [
      'Подать информацию о фонде на startupbase.uz',
      'Приложить подтверждение получения инвестиций (банковский перевод)',
      'Копия инвестиционного соглашения',
      'Документы, подтверждающие размер активов фонда',
    ],
    approvalDays: 15,
    payoutDays: 5,
  },
  {
    id: 'loan',
    title: 'Займ без залога',
    tagline: 'Прошли валидацию идеи — получите финансирование без продажи доли',
    amount: 'до 300 млн сум',
    coverage: 'ставка ЦБ + 4% = 18%',
    Icon: Banknote,
    color: '#5B8DB8',
    conditions: [
      'Стартап прошёл этап валидации идеи',
      'Проект масштабируемый, ориентирован на глобальный рынок',
      'Универсальная модель монетизации',
      'Технологическое преимущество: уникальная технология, ноу-хау',
      'Срок займа: от 6 месяцев до 3 лет',
    ],
    howTo: [
      'Заполнить форму на startupbase.uz',
      'Цель получения средств и бизнес-план с прогнозом',
      'Бухгалтерская отчётность (баланс, P&L, cash flow, декларации)',
      'Учредительные документы и решение учредителей',
      'Скоринг от IT Park Ventures',
    ],
    approvalDays: 15,
    payoutDays: 5,
  },
  {
    id: 'ip',
    title: 'Компенсация патентов и товарных знаков',
    tagline: 'Защитите интеллектуальную собственность — 100% госпошлин возвращают',
    amount: '100% расходов',
    coverage: 'госпошлины + патентный поверенный',
    Icon: ShieldCheck,
    color: '#1B2A3D',
    conditions: [
      'Возмещение госпошлин за регистрацию изобретений, товарных знаков, полезных моделей',
      'Возмещение услуг патентных поверенных',
      'Регистрация в Узбекистане или за рубежом — ограничений нет',
      'Компенсируются только фактические, подтверждённые расходы',
    ],
    howTo: [
      'Подать заявку на startupbase.uz',
      'Приложить копии заявок и свидетельств',
      'Финансовые документы: счета, квитанции',
      'Объяснительное письмо с целью патентования',
    ],
    approvalDays: 15,
    payoutDays: 5,
  },
];

// ════════════════════════════════════════════════════════════════════
// Ecosystem actors
// ════════════════════════════════════════════════════════════════════
const ECOSYSTEM = [
  {
    name: 'IT Park Ventures',
    role: 'Государственный оператор программы',
    desc: 'Единственный государственный венчурный оператор, реализующий Digital Startups Program. Принимает решения по скорингу, заключает инвестиционные соглашения, перечисляет средства стартапам.',
    url: 'https://startupbase.uz/',
    tag: 'оператор',
    Icon: Building2,
  },
  {
    name: 'UzVC',
    role: 'Национальный венчурный фонд',
    desc: 'Фонд прямых инвестиций, финансирует проекты средней и поздней стадии. Работает параллельно с IT Park Ventures, фокус — масштабирование и экспансия за рубеж.',
    url: '#',
    tag: 'фонд',
    Icon: Coins,
  },
  {
    name: 'Plug and Play Uzbekistan',
    role: 'Международный акселератор',
    desc: 'Локальное отделение крупнейшего мирового акселератора (Кремниевая долина). Программы для стартапов на ранних стадиях — demo day, менторство, связи с корпорациями.',
    url: '#',
    tag: 'акселератор',
    Icon: Rocket,
  },
  {
    name: 'Techstars',
    role: 'Международный акселератор (отбор)',
    desc: 'Узбекские стартапы регулярно попадают в программы Techstars. Возможность участия закрытая — через Demo Day или презентацию ментору сети.',
    url: '#',
    tag: 'акселератор',
    Icon: Rocket,
  },
  {
    name: 'Sturgeon Capital',
    role: 'Региональный VC-фонд',
    desc: 'Британский венчурный фонд, активный в Центральной Азии. Инвестирует в fintech, e-commerce и digital-компании региона. Партнёр программы «1+1».',
    url: '#',
    tag: 'иностранный фонд',
    Icon: Globe,
  },
  {
    name: 'Mastercard Foundation',
    role: 'Донор · программы развития',
    desc: 'Финансирует программы подготовки молодых предпринимателей и стартапов. Гранты на развитие экосистемы, обучение, менторство.',
    url: '#',
    tag: 'донор',
    Icon: Award,
  },
];

// ════════════════════════════════════════════════════════════════════
// Success stories · Uzbek startups
// ════════════════════════════════════════════════════════════════════
const STORIES = [
  {
    name: 'BILLZ',
    stage: 'Приобретена грузинским банком за ~$12 млн',
    year: '2025',
    summary: 'Retail-tech стартап, SaaS для розничных сетей. Прошёл путь от MVP в Ташкенте до региональной экспансии. Успешный exit через продажу крупному банку.',
    sector: 'Retail SaaS',
    milestone: 'Exit $12M',
  },
  {
    name: 'Uzum Group',
    stage: 'Первый узбекский технологический «единорог»',
    year: '2024',
    summary: 'Экосистема e-commerce, банкинга и маркетплейса. Оценка превысила $1 млрд. Крупнейший технологический проект в Центральной Азии.',
    sector: 'E-commerce / FinTech',
    milestone: 'Unicorn',
  },
  {
    name: 'Alif Group',
    stage: '$1 млрд ежемесячного оборота транзакций',
    year: '2026',
    summary: 'FinTech-платформа: BNPL, P2P-переводы, кредитование МСБ. Достигла отметки $1 млрд/месяц в апреле 2026, работает в РУз и Таджикистане.',
    sector: 'FinTech',
    milestone: '$1B GMV/мес',
  },
];

// ════════════════════════════════════════════════════════════════════
// FAQ
// ════════════════════════════════════════════════════════════════════
const FAQ = [
  {
    q: 'Что такое seed, Series A, Series B?',
    a: 'Стадии венчурного финансирования. Seed — первые $100K–$2M на доработку MVP и запуск. Series A — $2–15M на выход на устойчивый рост. Series B и далее — для масштабирования в новые рынки. Digital Startups Program покрывает pre-seed и seed стадии.',
  },
  {
    q: 'Чем займ отличается от инвестиций?',
    a: 'Займ — возвращаемые деньги с процентом (18% у IT Park Ventures), вы сохраняете 100% доли. Инвестиции — фонд получает долю в вашем стартапе (обычно 5–20% за первые раунды), возвращать не нужно, но отдаёте часть будущей прибыли и контроль.',
  },
  {
    q: 'Как оценивается стартап перед инвестицией?',
    a: 'Обычно смотрят на: команду (опыт, коммитмент), рынок (размер и рост), продукт (уникальность, защищённость), traction (пользователи, выручка, retention), конкурентов. IT Park Ventures дополнительно оценивает международный потенциал и скоринг по финансам.',
  },
  {
    q: 'Сколько раз можно получить соинвестиции «1+1»?',
    a: 'Несколько раз. Каждый новый раунд от иностранного фонда можно сопроводить заявкой на «1+1». Для каждого случая — новая заявка и отдельный договор. Основанием для отказа может быть нецелевое использование предыдущих инвестиций.',
  },
  {
    q: 'Можно ли получить все 4 инструмента одновременно?',
    a: 'Да, если стартап соответствует условиям каждого. Типичный путь: сначала компенсация патентов (защита IP) → потом займ без залога для MVP → затем акселерация за рубежом с компенсацией → когда привлекли иностранный фонд — программа «1+1».',
  },
  {
    q: 'Что если стартап «выпрыгнет» из лимита 10 млрд сум годового дохода?',
    a: 'Стартап теряет право на новые заявки в Digital Startups Program, но ранее полученные обязательства остаются в силе. По смыслу программы — это уже зрелый бизнес, ему доступны другие инструменты: Банк развития бизнеса, UzVC, коммерческое кредитование.',
  },
];

// ════════════════════════════════════════════════════════════════════
// Eligibility Calculator
// ════════════════════════════════════════════════════════════════════
interface CalcAnswers {
  age: 'new' | 'lt6m' | '6m-7y' | 'gt7y';
  revenue: 'nano' | 'small' | 'mid' | 'over';
  stage: 'idea' | 'mvp' | 'validated' | 'growth';
  hasForeignFund: boolean;
  wantsAccel: boolean;
  hasIp: boolean;
}

function computeEligibility(a: CalcAnswers): { available: InstrumentId[]; notes: Record<string, string> } {
  const available: InstrumentId[] = [];
  const notes: Record<string, string> = {};

  const baseOK = a.age !== 'new' && a.age !== 'gt7y' && a.revenue !== 'over';

  if (baseOK && a.wantsAccel) {
    available.push('acceleration');
    notes['acceleration'] = 'Для вашего стартапа доступно до $20 000 при прохождении международной акселерации.';
  } else if (!a.wantsAccel) {
    notes['acceleration'] = 'Инструмент не релевантен — вы не планируете акселерацию.';
  } else {
    notes['acceleration'] = a.age === 'new' ? 'Нужно минимум 6 месяцев работы.' : a.age === 'gt7y' ? 'Работа более 7 лет — вне программы.' : 'Доход превышает 10 млрд сум.';
  }

  if (baseOK && a.hasForeignFund) {
    available.push('coinvest');
    notes['coinvest'] = 'Вы привлекли иностранный фонд — доступна программа «1+1» до $100 000.';
  } else if (!a.hasForeignFund) {
    notes['coinvest'] = 'Нужно привлечь инвестиции от иностранного фонда с активами ≥ $50M.';
  }

  if (baseOK && (a.stage === 'validated' || a.stage === 'growth' || a.stage === 'mvp')) {
    available.push('loan');
    notes['loan'] = 'Вы прошли этап валидации идеи — доступен займ до 300 млн сум без залога.';
  } else {
    notes['loan'] = a.stage === 'idea' ? 'Нужно пройти этап валидации идеи (иметь MVP или подтверждённый спрос).' : 'Не соответствует базовым условиям.';
  }

  if (baseOK && a.hasIp) {
    available.push('ip');
    notes['ip'] = 'Вы регистрируете ИС — государство вернёт 100% госпошлин.';
  } else if (!a.hasIp) {
    notes['ip'] = 'Применимо при регистрации патентов, товарных знаков.';
  }

  return { available, notes };
}

// ════════════════════════════════════════════════════════════════════
// Main component
// ════════════════════════════════════════════════════════════════════
type TabId = 'overview' | 'calculator' | 'ecosystem' | 'stories' | 'faq';

export function N_Startup() {
  const [tab, setTab] = useState<TabId>('overview');
  const [expanded, setExpanded] = useState<InstrumentId | null>(null);

  return (
    <section className="container-wide py-10 md:py-14 space-y-6">
      {/* Hero */}
      <Card padding="lg" tone="navy" className="text-white relative overflow-hidden">
        <div className="absolute inset-0 pattern-dots opacity-25 pointer-events-none" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <Badge variant="new">NEW</Badge>
            <Rocket className="h-5 w-5 text-gold-light" />
            <span className="text-xs uppercase tracking-wider text-gold-light font-semibold">
              Digital Startups Program · ПП-4632 от октября 2024
            </span>
          </div>
          <h2 className="font-serif text-2xl md:text-3xl text-white mb-2 leading-tight">
            Стартап-программы от IT-парка и IT Park Ventures
          </h2>
          <p className="text-white/75 max-w-3xl text-sm">
            Четыре инструмента поддержки: акселерация за рубежом, соинвестирование 1:1 с иностранным фондом,
            беззалоговый займ, компенсация интеллектуальной собственности. Для стартапов 6 месяцев – 7 лет
            с оборотом до 10 млрд сум.
          </p>

          <div className="mt-5 grid grid-cols-2 md:grid-cols-4 gap-2">
            <HeroPill label="Акселерация" value="до $20K" sub="50% компенсации" />
            <HeroPill label="Программа «1+1»" value="до $100K" sub="от IT Park Ventures" />
            <HeroPill label="Займ без залога" value="300 млн" sub="сум · ставка 18%" />
            <HeroPill label="Компенсация ИС" value="100%" sub="госпошлин" />
          </div>

          <div className="mt-5 flex gap-2 flex-wrap">
            <a href="https://startupbase.uz/" target="_blank" rel="noopener noreferrer">
              <Button size="md" leftIcon={<ExternalLink className="h-4 w-4" />}>
                Зарегистрироваться на startupbase.uz
              </Button>
            </a>
            <Button size="md" variant="ghost" onClick={() => setTab('calculator')} leftIcon={<Calculator className="h-4 w-4" />}>
              Что мне доступно?
            </Button>
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
        {[
          { id: 'overview',   label: 'Четыре инструмента', Icon: Target },
          { id: 'calculator', label: 'Калькулятор доступности', Icon: Calculator },
          { id: 'ecosystem',  label: 'Экосистема', Icon: Users2 },
          { id: 'stories',    label: 'Истории успеха', Icon: TrendingUp },
          { id: 'faq',        label: 'FAQ', Icon: HelpCircle },
        ].map((t) => {
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id as TabId)}
              className={cn(
                'h-11 px-4 rounded-lg text-sm font-medium border transition-colors flex items-center gap-2',
                active ? 'bg-navy text-white border-navy' : 'bg-bg-white text-ink-muted border-ink-line hover:border-gold hover:text-gold',
              )}
            >
              <t.Icon className="h-4 w-4" /> {t.label}
            </button>
          );
        })}
      </div>

      {tab === 'overview'   && <OverviewTab expanded={expanded} setExpanded={setExpanded} />}
      {tab === 'calculator' && <CalculatorTab />}
      {tab === 'ecosystem'  && <EcosystemTab />}
      {tab === 'stories'    && <StoriesTab />}
      {tab === 'faq'        && <FAQTab />}

      {/* Footer */}
      <Card padding="lg" className="border-gold/25 bg-gold-soft/30">
        <div className="flex items-start gap-4">
          <div className="h-10 w-10 rounded-lg bg-gold/15 text-gold flex items-center justify-center shrink-0">
            <Sparkles className="h-5 w-5" />
          </div>
          <div className="text-sm text-ink">
            <strong>Источник данных:</strong> статья spot.uz от 24 июля 2025 «Инструкция: как стартапу получить
            компенсацию расходов и финансирование от государства», разбор с директором по развитию стартапов
            и инвестиций IT Park Эльёром Максудовым. Программа утверждена постановлением Президента № ПП-4632
            от октября 2024 года. Заявки подаются на{' '}
            <a href="https://startupbase.uz/" target="_blank" rel="noopener noreferrer" className="text-gold font-semibold hover:underline">
              startupbase.uz
            </a>
            {' '}· срок рассмотрения 15 рабочих дней.
          </div>
        </div>
      </Card>
    </section>
  );
}

// ────── Tab: Overview ──────
function OverviewTab({ expanded, setExpanded }: { expanded: InstrumentId | null; setExpanded: (v: InstrumentId | null) => void }) {
  return (
    <div className="space-y-3">
      {INSTRUMENTS.map((inst, i) => {
        const isOpen = expanded === inst.id;
        return (
          <motion.div
            key={inst.id}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
          >
            <Card padding="lg" className={cn('transition-all', isOpen && 'ring-2 ring-gold/40')}>
              <button
                onClick={() => setExpanded(isOpen ? null : inst.id)}
                className="w-full text-left"
              >
                <div className="flex items-start gap-4">
                  <div
                    className="h-12 w-12 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: `${inst.color}18`, color: inst.color }}
                  >
                    <inst.Icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                      <div>
                        <CardTitle>{inst.title}</CardTitle>
                        <div className="text-sm text-ink-muted mt-0.5">{inst.tagline}</div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="font-serif text-2xl font-semibold" style={{ color: inst.color }}>{inst.amount}</div>
                        <div className="text-[11px] text-ink-muted">{inst.coverage}</div>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center gap-3 flex-wrap text-xs">
                      <span className="text-ink-muted"><Clock className="inline h-3 w-3 -mt-0.5" /> рассмотрение {inst.approvalDays} раб. дней</span>
                      <span className="text-ink-muted">·</span>
                      <span className="text-ink-muted">выплата через {inst.payoutDays} дней после одобрения</span>
                      <span className="ml-auto text-gold text-sm font-medium flex items-center gap-1">
                        {isOpen ? 'Свернуть' : 'Подробнее'} <ChevronDown className={cn('h-4 w-4 transition-transform', isOpen && 'rotate-180')} />
                      </span>
                    </div>
                  </div>
                </div>
              </button>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-5 pt-5 border-t border-ink-line grid md:grid-cols-2 gap-5">
                      <div>
                        <div className="text-xs uppercase tracking-wider text-ink-muted font-semibold mb-2">Условия участия</div>
                        <ul className="space-y-2">
                          {inst.conditions.map((c) => (
                            <li key={c} className="flex items-start gap-2 text-sm text-ink">
                              <CheckCircle2 className="h-4 w-4 text-success mt-0.5 shrink-0" />
                              <span>{c}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <div className="text-xs uppercase tracking-wider text-ink-muted font-semibold mb-2">Как подать заявку</div>
                        <ol className="space-y-2">
                          {inst.howTo.map((h, idx) => (
                            <li key={h} className="flex items-start gap-2 text-sm text-ink">
                              <span className="h-5 w-5 rounded-full bg-gold/15 text-gold flex items-center justify-center shrink-0 text-[11px] font-semibold mt-0.5">{idx + 1}</span>
                              <span>{h}</span>
                            </li>
                          ))}
                        </ol>

                        <div className="mt-4 flex gap-2">
                          <a href="https://startupbase.uz/" target="_blank" rel="noopener noreferrer">
                            <Button size="sm" leftIcon={<ExternalLink className="h-3.5 w-3.5" />}>Подать заявку</Button>
                          </a>
                          <Button size="sm" variant="ghost">Скачать чек-лист</Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}

// ────── Tab: Calculator ──────
function CalculatorTab() {
  const [answers, setAnswers] = useState<CalcAnswers>({
    age: '6m-7y',
    revenue: 'small',
    stage: 'mvp',
    hasForeignFund: false,
    wantsAccel: false,
    hasIp: false,
  });
  const [showResult, setShowResult] = useState(false);

  const result = computeEligibility(answers);

  const QUESTIONS: { key: keyof CalcAnswers; label: string; options: { v: any; l: string }[] }[] = [
    { key: 'age',     label: 'Сколько времени работает стартап?',
      options: [{ v: 'new', l: 'Только идея (не зарегистрирован)' }, { v: 'lt6m', l: 'Меньше 6 месяцев' }, { v: '6m-7y', l: '6 месяцев – 7 лет' }, { v: 'gt7y', l: 'Более 7 лет' }] },
    { key: 'revenue', label: 'Годовая выручка?',
      options: [{ v: 'nano', l: 'Менее 100 млн сум' }, { v: 'small', l: '100 млн – 1 млрд сум' }, { v: 'mid', l: '1 – 10 млрд сум' }, { v: 'over', l: 'Более 10 млрд сум' }] },
    { key: 'stage',   label: 'На какой вы стадии?',
      options: [{ v: 'idea', l: 'Идея без MVP' }, { v: 'mvp', l: 'Есть MVP' }, { v: 'validated', l: 'Есть первые клиенты' }, { v: 'growth', l: 'Стадия роста' }] },
  ];

  const BOOLS: { key: 'hasForeignFund' | 'wantsAccel' | 'hasIp'; label: string; sub: string }[] = [
    { key: 'wantsAccel',     label: 'Планируете пройти международную акселерацию?', sub: 'Курс или акселератор за рубежом' },
    { key: 'hasForeignFund', label: 'Привлекли (или близко к этому) инвестиции от иностранного фонда?', sub: 'Фонд с активами ≥ $50M' },
    { key: 'hasIp',          label: 'Планируете регистрировать патенты или товарные знаки?', sub: 'В Узбекистане или за рубежом' },
  ];

  return (
    <div className="grid lg:grid-cols-[1.2fr_1fr] gap-5">
      {/* Questions */}
      <Card padding="lg">
        <div className="flex items-center gap-2 mb-4">
          <Calculator className="h-5 w-5 text-gold" />
          <CardTitle>Ответьте на 6 вопросов — узнаете что вам доступно</CardTitle>
        </div>

        <div className="space-y-5">
          {QUESTIONS.map((q) => (
            <div key={q.key}>
              <label className="text-[11px] uppercase tracking-wider text-ink-muted font-semibold">{q.label}</label>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {q.options.map((o) => {
                  const selected = answers[q.key] === o.v;
                  return (
                    <button
                      key={o.v}
                      onClick={() => setAnswers({ ...answers, [q.key]: o.v } as CalcAnswers)}
                      className={cn(
                        'p-2.5 rounded-lg border text-left text-sm transition-all',
                        selected ? 'border-gold bg-gold-soft/40 text-ink font-medium' : 'border-ink-line bg-bg-white text-ink hover:border-gold/40',
                      )}
                    >
                      {o.l}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {BOOLS.map((b) => (
            <div key={b.key} className="flex items-start gap-3 p-3 rounded-lg border border-ink-line bg-bg-white">
              <div className="flex-1">
                <div className="text-sm text-ink font-medium">{b.label}</div>
                <div className="text-xs text-ink-muted mt-0.5">{b.sub}</div>
              </div>
              <div className="flex gap-1.5 shrink-0">
                <button
                  onClick={() => setAnswers({ ...answers, [b.key]: true })}
                  className={cn(
                    'h-9 px-3 rounded-md text-sm font-medium transition-colors',
                    answers[b.key] === true ? 'bg-gold text-white' : 'bg-bg-band text-ink-muted hover:bg-gold/10',
                  )}
                >Да</button>
                <button
                  onClick={() => setAnswers({ ...answers, [b.key]: false })}
                  className={cn(
                    'h-9 px-3 rounded-md text-sm font-medium transition-colors',
                    answers[b.key] === false ? 'bg-ink text-white' : 'bg-bg-band text-ink-muted hover:bg-ink/10',
                  )}
                >Нет</button>
              </div>
            </div>
          ))}

          <Button className="w-full" size="lg" onClick={() => setShowResult(true)}>
            Рассчитать доступность
          </Button>
        </div>
      </Card>

      {/* Result */}
      <div className="sticky top-32 self-start">
        {!showResult ? (
          <Card padding="lg" className="h-full">
            <div className="text-center py-10">
              <div className="mx-auto h-14 w-14 rounded-full bg-gold/10 text-gold flex items-center justify-center mb-4">
                <Target className="h-7 w-7" />
              </div>
              <CardTitle>Результат появится здесь</CardTitle>
              <CardDescription className="mt-2">Ответьте на вопросы слева и нажмите «Рассчитать».</CardDescription>
            </div>
          </Card>
        ) : (
          <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}>
            <Card padding="lg" className="h-full">
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-ink-line">
                <CardTitle>Доступные инструменты</CardTitle>
                <Badge variant={result.available.length > 0 ? 'success' : 'warning'}>
                  {result.available.length} из 4
                </Badge>
              </div>

              <div className="space-y-3">
                {INSTRUMENTS.map((inst) => {
                  const isAvailable = result.available.includes(inst.id);
                  return (
                    <div
                      key={inst.id}
                      className={cn(
                        'p-3 rounded-lg border',
                        isAvailable ? 'border-success/40 bg-success/5' : 'border-ink-line bg-bg-band/40',
                      )}
                    >
                      <div className="flex items-start gap-2 mb-1.5">
                        <div
                          className="h-8 w-8 rounded-lg flex items-center justify-center shrink-0"
                          style={{ background: isAvailable ? `${inst.color}20` : '#EEE', color: isAvailable ? inst.color : '#999' }}
                        >
                          <inst.Icon className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className={cn('text-sm font-serif', isAvailable ? 'text-ink' : 'text-ink-muted')}>
                            {inst.title}
                          </div>
                          <div className="text-[11px] text-ink-muted">{inst.amount}</div>
                        </div>
                        {isAvailable
                          ? <CheckCircle2 className="h-5 w-5 text-success shrink-0" />
                          : <span className="text-[10.5px] text-ink-muted self-center">недоступно</span>}
                      </div>
                      <div className="text-[12px] text-ink-muted leading-snug pl-10">
                        {result.notes[inst.id]}
                      </div>
                    </div>
                  );
                })}
              </div>

              {result.available.length > 0 && (
                <div className="mt-4 pt-4 border-t border-ink-line">
                  <a href="https://startupbase.uz/" target="_blank" rel="noopener noreferrer">
                    <Button className="w-full" leftIcon={<ExternalLink className="h-4 w-4" />}>
                      Перейти к подаче заявки
                    </Button>
                  </a>
                </div>
              )}
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}

// ────── Tab: Ecosystem ──────
function EcosystemTab() {
  return (
    <div className="space-y-5">
      <Card padding="md" className="border-gold/30 bg-gold-soft/30">
        <div className="flex items-start gap-3">
          <div className="h-10 w-10 rounded-lg bg-gold text-white flex items-center justify-center shrink-0">
            <Users2 className="h-5 w-5" />
          </div>
          <div className="text-sm text-ink">
            <strong>Экосистема стартапов Узбекистана</strong> — не только IT Park Ventures. Программа «1+1» работает
            через партнёрство с иностранными фондами. Ниже — ключевые игроки, с которыми вы можете работать.
          </div>
        </div>
      </Card>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
        {ECOSYSTEM.map((e, i) => (
          <motion.div
            key={e.name}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.25, delay: i * 0.05 }}
          >
            <Card padding="md" hover>
              <div className="flex items-start gap-3 mb-2">
                <div className="h-10 w-10 rounded-lg bg-gold/10 text-gold flex items-center justify-center shrink-0">
                  <e.Icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-serif text-[15px] text-ink leading-tight">{e.name}</div>
                  <div className="text-[11px] text-gold uppercase tracking-wider font-semibold mt-0.5">{e.role}</div>
                </div>
                <Badge variant="outline">{e.tag}</Badge>
              </div>
              <div className="text-[13px] text-ink-muted leading-relaxed mb-3">{e.desc}</div>
              {e.url !== '#' && (
                <a href={e.url} target="_blank" rel="noopener noreferrer" className="text-xs text-gold hover:text-gold-dark font-semibold flex items-center gap-1">
                  Перейти на сайт <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ────── Tab: Stories ──────
function StoriesTab() {
  return (
    <div className="space-y-3">
      <Card padding="md" className="border-success/30 bg-success/5">
        <div className="flex items-start gap-3">
          <TrendingUp className="h-5 w-5 text-success shrink-0 mt-0.5" />
          <div className="text-sm text-ink">
            <strong>Узбекские истории успеха</strong> — проекты, которые прошли путь от идеи до значимых результатов
            на локальном и международном рынке. Не все они получали именно Digital Startups Program, но многие
            стали возможны благодаря экосистеме IT-парка.
          </div>
        </div>
      </Card>

      <div className="grid md:grid-cols-3 gap-3">
        {STORIES.map((s) => (
          <Card key={s.name} padding="lg" hover>
            <div className="flex items-start justify-between gap-2 mb-3">
              <div>
                <div className="font-serif text-xl text-ink">{s.name}</div>
                <div className="text-[11px] text-ink-muted uppercase tracking-wider mt-0.5">{s.sector}</div>
              </div>
              <Badge variant="priority">{s.year}</Badge>
            </div>
            <div className="p-3 rounded-lg bg-gold-soft/40 border border-gold/30 mb-3">
              <div className="text-[11px] uppercase tracking-wider text-gold-dark font-semibold mb-0.5">Ключевой результат</div>
              <div className="text-sm text-ink font-semibold">{s.milestone}</div>
            </div>
            <div className="text-[13px] text-ink-muted leading-relaxed mb-3">{s.stage}</div>
            <div className="text-[13px] text-ink leading-relaxed">{s.summary}</div>
          </Card>
        ))}
      </div>

      <Card padding="md" className="text-center">
        <div className="text-sm text-ink-muted">
          Данные о сделках — из публичных источников (spot.uz, пресс-релизы). Частичная информация, детали сделок могут быть конфиденциальными.
        </div>
      </Card>
    </div>
  );
}

// ────── Tab: FAQ ──────
function FAQTab() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="max-w-3xl space-y-2">
      {FAQ.map((item, i) => {
        const isOpen = open === i;
        return (
          <Card key={i} padding="md" className={cn('transition-all', isOpen && 'border-gold/40')}>
            <button
              onClick={() => setOpen(isOpen ? null : i)}
              className="w-full flex items-start gap-3 text-left"
            >
              <HelpCircle className="h-5 w-5 text-gold shrink-0 mt-0.5" />
              <div className="flex-1 font-serif text-[15px] text-ink">{item.q}</div>
              <ChevronDown className={cn('h-5 w-5 text-ink-muted shrink-0 transition-transform', isOpen && 'rotate-180')} />
            </button>
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="pt-3 mt-3 border-t border-ink-line pl-8 text-[14px] text-ink leading-relaxed">
                    {item.a}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        );
      })}
    </div>
  );
}

function HeroPill({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-lg p-3">
      <div className="text-[10.5px] uppercase tracking-wider text-gold-light/80 mb-1">{label}</div>
      <div className="font-serif text-xl md:text-2xl text-white font-semibold">{value}</div>
      <div className="text-[11px] text-white/60 mt-0.5">{sub}</div>
    </div>
  );
}
