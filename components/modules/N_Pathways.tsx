'use client';

import Link from 'next/link';
import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Coffee, Laptop, Wheat, Flower2, ShoppingBag as ShopBag, Wrench, Baby, Pill,
  Croissant, Briefcase, Truck, Scissors, CheckCircle2, Circle, ArrowRight,
  Clock, FileText, Sparkles, Route, Rocket, Building, ScrollText, FileSpreadsheet,
} from 'lucide-react';
import { Card, CardTitle, CardDescription } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { PhaseRoadmapStrip } from '@/components/sections/PhaseRoadmapStrip';

const BUSINESS_TYPES = [
  { slug: 'cafe',       name: 'Кафе и общепит',          emoji: '☕', Icon: Coffee,     popular: true  },
  { slug: 'it',         name: 'IT-компания',              emoji: '💻', Icon: Laptop,     popular: true  },
  { slug: 'farm',       name: 'Фермерское хозяйство',     emoji: '🌾', Icon: Wheat,      popular: true  },
  { slug: 'beauty',     name: 'Beauty-салон',             emoji: '💅', Icon: Flower2,    popular: true  },
  { slug: 'shop',       name: 'Интернет-магазин',         emoji: '🛒', Icon: ShopBag,    popular: true  },
  { slug: 'auto',       name: 'Автосервис',               emoji: '🔧', Icon: Wrench,     popular: false },
  { slug: 'kids',       name: 'Детский центр',            emoji: '🧸', Icon: Baby,       popular: false },
  { slug: 'pharma',     name: 'Аптека',                   emoji: '💊', Icon: Pill,       popular: false },
  { slug: 'bakery',     name: 'Пекарня',                  emoji: '🥐', Icon: Croissant,  popular: true  },
  { slug: 'consulting', name: 'Консалтинг',               emoji: '📊', Icon: Briefcase,  popular: false },
  { slug: 'logistics',  name: 'Логистика и доставка',     emoji: '🚚', Icon: Truck,      popular: false },
  { slug: 'tailor',     name: 'Ателье и швейное дело',    emoji: '✂️', Icon: Scissors,   popular: false },
];

interface PathStep {
  id: string;
  title: string;
  estimate: string;
  done?: boolean;
  items: string[];
  module?: string;
}

const CAFE_PATHWAY: { category: string; steps: PathStep[] }[] = [
  {
    category: 'Plan · планирование',
    steps: [
      {
        id: 'ready',
        title: 'Оцените готовность',
        estimate: '1 день',
        items: [
          'Проверить стартовый капитал — от 80 до 300 млн сум',
          'Определиться с форматом: кафе, кофейня, столовая, сендвич-бар',
          'Оценить личную готовность к 12–14 часам в день первый год',
        ],
      },
      {
        id: 'location',
        title: 'Выбор локации',
        estimate: '2 недели',
        items: [
          'Район: проверить трафик, конкурентов, платёжеспособность',
          'Спросить помощника хокима о «рекомендуемых нишах» махалли',
          'Посмотреть свободные объекты на Давактив',
        ],
        module: '/modules/geo',
      },
      {
        id: 'plan',
        title: 'Бизнес-план',
        estimate: '1 неделя',
        items: [
          'Шаблон бизнес-плана для общепита (15 разделов)',
          'Финансовая модель: 24 месяца с разбивкой по статьям',
          'Маркетинговый план и первые 3 месяца операционной работы',
        ],
      },
    ],
  },
  {
    category: 'Launch · запуск',
    steps: [
      {
        id: 'register',
        title: 'Регистрация ИП/ООО',
        estimate: '1 день',
        items: [
          'birdarcha.uz — выбрать юридическую форму (ИП или ООО)',
          'Упрощённый налоговый режим или НДС',
          'Получение ИНН и постановка на учёт в Soliq',
        ],
      },
      {
        id: 'licenses',
        title: 'Лицензии и разрешения',
        estimate: '2–4 недели',
        items: [
          'Санитарно-эпидемиологическое заключение (СЭС)',
          'Пожарный сертификат',
          'Разрешение на вывеску в хокимияте',
          'Лицензия на алкоголь — если планируется',
        ],
      },
      {
        id: 'support',
        title: 'Меры поддержки',
        estimate: '1 неделя',
        items: [
          'Льготный кредит «Бизнес-старт» для молодых предпринимателей',
          'Субсидия на внедрение POS-системы — до 15 млн сум',
          'Налоговая льгота по ЕСП на 1 год для новых ИП',
        ],
        module: '/modules/registry',
      },
    ],
  },
  {
    category: 'Manage · управление',
    steps: [
      {
        id: 'staff',
        title: 'Найм и обучение персонала',
        estimate: '2 недели',
        items: [
          'Бариста / повар / официанты / администратор',
          'Бесплатные курсы ЦПП: «Обслуживание в HoReCa», HACCP',
          'Трудовые договоры и отчисления в Пенсионный фонд',
        ],
      },
      {
        id: 'tech',
        title: 'Технологии и процессы',
        estimate: '1 неделя',
        items: [
          'POS-касса с онлайн-ККМ · синхронизация с Soliq',
          'Онлайн-бронирование / система лояльности',
          'Автоматизация инвентаря и закупок',
        ],
      },
    ],
  },
];

export function N_Pathways() {
  const [selected, setSelected] = useState<string | null>(null);
  const current = selected ?? 'cafe';

  return (
    <section className="container-wide py-10 md:py-14 space-y-8">
      {/* ─── Hero ─── */}
      <Card padding="lg" tone="navy" className="text-white relative overflow-hidden">
        <div className="absolute inset-0 pattern-dots opacity-30 pointer-events-none" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-3">
            <Badge variant="new">NEW · объединённый модуль</Badge>
            <span className="text-xs uppercase tracking-wider text-gold-light">Pathways + Guide · business.gov.au + gobusiness.gov.sg</span>
          </div>
          <h2 className="font-serif text-2xl md:text-3xl text-white mb-2">
            Гайды для предпринимателей — два уровня детализации
          </h2>
          <p className="text-white/75 max-w-2xl text-sm">
            Специальные маршруты по 12 популярным видам бизнеса (кафе, IT, beauty, пекарня и др.)
            плюс универсальный путь от идеи до запуска, каталог государственных сервисов,
            шаблоны документов и ссылки на ключевые НПА.
          </p>
        </div>
      </Card>

      <PhaseRoadmapStrip
        embedded
        currentPhase={2}
        points={[
          // Фаза 1 — до 01.07.2026
          { phase: 2, text: '12 пошаговых маршрутов по популярным видам бизнеса (кафе, IT, beauty, пекарня и т.д.)' },
          { phase: 2, text: 'Универсальный путь: идея → регистрация → запуск → рост (5 этапов, ~40 шагов)' },
          { phase: 2, text: 'Каталог 15+ государственных сервисов и ссылки на 8 ключевых НПА' },
          { phase: 2, text: 'Шаблоны документов: бизнес-план, финмодель, учредительные, кадровые (ZIP-архив)' },
          { phase: 2, text: 'Связка с другими модулями: регистрация → qBiz, локация → геоаналитика, меры → реестр' },
          // Фаза 2 — 2-я половина 2026
          { phase: 2, text: 'Расширение до 20 видов бизнеса + 15 готовых шаблонов бизнес-плана по отраслям' },
          // Фаза 3 — 2027
          { phase: 3, text: 'AI-ассистент внутри pathway: персональные подсказки на каждом шаге' },
          { phase: 3, text: 'Сохранение прогресса в личном кабинете: «я на шаге 3 из 8»' },
          // Фаза 4 — 2028+
          { phase: 4, text: 'Mentorship: связка с чемпионами предпринимательства и отраслевыми ассоциациями' },
        ]}
      />

      {/* ─── Business type selector ─── */}
      <div>
        <h3 className="font-serif text-xl text-ink mb-4">Выберите вид бизнеса</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {BUSINESS_TYPES.map((b) => {
            const active = current === b.slug;
            return (
              <button
                key={b.slug}
                onClick={() => setSelected(b.slug)}
                className={[
                  'p-4 rounded-xl border transition-all text-left group relative',
                  active
                    ? 'border-gold bg-gold/10 shadow-md'
                    : 'border-ink-line bg-bg-white hover:border-gold/50 hover:-translate-y-0.5',
                ].join(' ')}
              >
                {b.popular && (
                  <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded text-[9px] uppercase tracking-wider font-bold bg-gold-soft text-gold-dark">
                    популярно
                  </span>
                )}
                <div className={`h-10 w-10 rounded-lg flex items-center justify-center mb-3 text-2xl ${active ? 'bg-gold/20' : 'bg-bg-band'}`}>
                  {b.emoji}
                </div>
                <div className="text-sm font-medium text-ink leading-snug">{b.name}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ─── Pathway for selected ─── */}
      <motion.div key={current} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <Card padding="lg">
          <div className="flex items-start justify-between flex-wrap gap-3 mb-6 pb-4 border-b border-ink-line">
            <div>
              <div className="text-xs text-gold uppercase tracking-wider mb-1 flex items-center gap-2">
                <Route className="h-3.5 w-3.5" />
                Маршрут: {BUSINESS_TYPES.find((b) => b.slug === current)?.name || 'Кафе'}
              </div>
              <CardTitle>От идеи до первого клиента за 6–8 недель</CardTitle>
              <CardDescription className="mt-1">
                Готовый путь: 8 шагов в 3 категориях. Чек-листы, документы, контакты. Связь с модулями Платформы — регистрация, меры поддержки, геоаналитика.
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button size="sm" leftIcon={<FileText className="h-4 w-4" />}>Скачать PDF</Button>
              <Button size="sm" variant="ghost">Добавить в избранное</Button>
            </div>
          </div>

          <div className="space-y-6">
            {CAFE_PATHWAY.map((cat, i) => (
              <div key={cat.category}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-8 w-8 rounded-full bg-gold text-white flex items-center justify-center font-serif text-sm">
                    {i + 1}
                  </div>
                  <h3 className="font-serif text-lg text-ink">{cat.category}</h3>
                </div>

                <div className="ml-4 pl-6 border-l-2 border-ink-line space-y-3">
                  {cat.steps.map((step) => (
                    <div key={step.id} className="relative">
                      <span className="absolute -left-[33px] top-1.5 h-3 w-3 rounded-full bg-bg-white border-2 border-gold" />
                      <div className="p-4 rounded-lg border border-ink-line bg-bg-band/40 hover:border-gold/40 transition-colors">
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <div>
                            <div className="font-medium text-ink">{step.title}</div>
                            <div className="text-xs text-ink-muted flex items-center gap-1 mt-0.5">
                              <Clock className="h-3 w-3" /> {step.estimate}
                            </div>
                          </div>
                          {step.module && (
                            <a href={step.module} className="text-xs text-gold hover:text-gold-dark font-medium flex items-center gap-1 whitespace-nowrap">
                              Модуль Платформы <ArrowRight className="h-3 w-3" />
                            </a>
                          )}
                        </div>
                        <ul className="space-y-1.5 mt-3">
                          {step.items.map((item, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-[13px] text-ink">
                              <Circle className="h-3 w-3 text-gold mt-1 shrink-0" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-5 border-t border-ink-line flex items-center justify-between">
            <div className="text-sm text-ink-muted">
              <CheckCircle2 className="h-4 w-4 text-success inline mr-1.5 -mt-0.5" />
              Прохождение маршрута сохраняется в личном кабинете
            </div>
            <Button size="sm">Начать по этому маршруту</Button>
          </div>
        </Card>
      </motion.div>

      {/* ─── Sprint 5 · Bridge to Guide content (объединённый модуль) ─── */}
      <div>
        <div className="mb-4">
          <h3 className="font-serif text-xl text-ink">Также полезно для любого вида бизнеса</h3>
          <p className="text-sm text-ink-muted mt-1">
            Дополнительные разделы объединённого модуля — универсальные материалы, не привязанные к конкретной отрасли.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <Link
            href="/modules/nGuide#stages"
            className="surface-card surface-card-hover p-4 block group"
          >
            <div className="h-10 w-10 rounded-xl bg-gold/10 text-gold flex items-center justify-center mb-3">
              <Rocket className="h-5 w-5" />
            </div>
            <div className="font-serif font-semibold text-ink text-[14.5px] leading-tight">Универсальный путь</div>
            <div className="text-xs text-ink-muted mt-1.5">5 этапов, ~40 шагов: идея → регистрация → запуск → рост</div>
            <div className="mt-3 text-xs text-gold font-medium inline-flex items-center gap-1">
              Открыть <ArrowRight className="h-3 w-3" />
            </div>
          </Link>
          <Link
            href="/modules/nGuide#services"
            className="surface-card surface-card-hover p-4 block group"
          >
            <div className="h-10 w-10 rounded-xl bg-gold/10 text-gold flex items-center justify-center mb-3">
              <Building className="h-5 w-5" />
            </div>
            <div className="font-serif font-semibold text-ink text-[14.5px] leading-tight">Гос-сервисы</div>
            <div className="text-xs text-ink-muted mt-1.5">15+ ключевых сервисов: регистрация, лицензии, ЭЦП, таможня</div>
            <div className="mt-3 text-xs text-gold font-medium inline-flex items-center gap-1">
              Открыть <ArrowRight className="h-3 w-3" />
            </div>
          </Link>
          <Link
            href="/modules/nGuide#laws"
            className="surface-card surface-card-hover p-4 block group"
          >
            <div className="h-10 w-10 rounded-xl bg-gold/10 text-gold flex items-center justify-center mb-3">
              <ScrollText className="h-5 w-5" />
            </div>
            <div className="font-serif font-semibold text-ink text-[14.5px] leading-tight">Ключевые НПА</div>
            <div className="text-xs text-ink-muted mt-1.5">8 главных законов и постановлений для МСБ с краткими выдержками</div>
            <div className="mt-3 text-xs text-gold font-medium inline-flex items-center gap-1">
              Открыть <ArrowRight className="h-3 w-3" />
            </div>
          </Link>
          <Link
            href="/modules/nGuide#templates"
            className="surface-card surface-card-hover p-4 block group"
          >
            <div className="h-10 w-10 rounded-xl bg-gold/10 text-gold flex items-center justify-center mb-3">
              <FileSpreadsheet className="h-5 w-5" />
            </div>
            <div className="font-serif font-semibold text-ink text-[14.5px] leading-tight">Шаблоны документов</div>
            <div className="text-xs text-ink-muted mt-1.5">Бизнес-план, финмодель, договоры, кадровые — ZIP-архив</div>
            <div className="mt-3 text-xs text-gold font-medium inline-flex items-center gap-1">
              Скачать <ArrowRight className="h-3 w-3" />
            </div>
          </Link>
        </div>
      </div>

      {/* ─── Footer callout ─── */}
      <Card padding="lg" className="border-success/25 bg-success/[0.03]">
        <div className="flex items-start gap-4">
          <div className="h-10 w-10 rounded-lg bg-success/10 text-success flex items-center justify-center shrink-0">
            <Sparkles className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <div className="font-serif font-semibold text-ink">Предложение из международного опыта</div>
            <CardDescription className="mt-1">
              Референс — <strong>business.gov.au</strong> (Department of Industry · Австралия): многоступенчатые гайды Plan → Launch → Manage → Grow с чек-листами, шаблонами бизнес-плана (MyBizPlan), интеграцией с ABLIS для лицензий. Мы адаптируем модель под 12 популярных видов бизнеса в Узбекистане: к 01.07.2026 стартовый набор, к 2027 — расширение до 50+ сценариев (как у мсп.рф).
            </CardDescription>
            <div className="mt-3 flex gap-2 flex-wrap">
              <Badge variant="new">NEW · 2-я половина 2026</Badge>
              <Badge variant="outline">12 видов бизнеса на старт</Badge>
              <Badge variant="outline">Связан с модулями (б), (д), регистрация</Badge>
            </div>
          </div>
        </div>
      </Card>
    </section>
  );
}
