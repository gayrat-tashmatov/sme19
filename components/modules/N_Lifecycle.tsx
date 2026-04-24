'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Lightbulb, ClipboardCheck, Building, Receipt, Coins, UserPlus, Rocket,
  ShoppingBag, TrendingUp, Plane, Shield, Trophy, CheckCircle2, ArrowRight,
  Sparkles, AlertCircle, FileText, MapPin, Clock, Target, BookOpen,
} from 'lucide-react';
import { Card, CardTitle, CardDescription } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { PhaseRoadmapStrip } from '@/components/sections/PhaseRoadmapStrip';
import { useStore } from '@/lib/store';

// ═══════════════════════════════════════════════════════════════════
// Sprint 7 · Business Lifecycle Navigator — 12 stages from idea to exit
// Central orchestrator linking all modules of the Платформа together
// ═══════════════════════════════════════════════════════════════════

interface LifecycleStage {
  id: string;
  order: number;
  title: string;
  subtitle: string;
  duration: string;
  Icon: typeof Lightbulb;
  tone: 'gold' | 'navy' | 'secondary' | 'success' | 'danger';
  keyActions: string[];
  commonMistakes: string[];
  relevantMeasures: { id: string; title: string; amount?: string }[];
  linkedModules: { title: string; href: string; icon: typeof Lightbulb; isNew?: boolean; isPlanned?: boolean }[];
  stageInsight: string;
}

const STAGES: LifecycleStage[] = [
  {
    id: 'idea',
    order: 1,
    title: 'Идея и валидация',
    subtitle: 'Проверить гипотезу — до того как тратить деньги',
    duration: '2–4 недели',
    Icon: Lightbulb,
    tone: 'gold',
    keyActions: [
      'Сформулируйте проблему, которую решает ваш бизнес',
      'Изучите 5–10 прямых конкурентов и их цены',
      'Проведите 20–30 глубинных интервью с потенциальными клиентами',
      'Выберите подходящий вид бизнеса из 12 сценариев в Гайдах',
    ],
    commonMistakes: [
      'Начинать с регистрации ИП до проверки спроса',
      'Опираться только на мнения друзей и семьи',
    ],
    relevantMeasures: [
      { id: 'NF001', title: 'Оценка идеи и консультации от ЦПП',             amount: 'бесплатно' },
    ],
    linkedModules: [
      { title: 'Гайды по видам бизнеса',      href: '/modules/nPath',     icon: BookOpen },
      { title: 'Оценка цифровой зрелости',     href: '/modules/maturity',  icon: Target },
    ],
    stageInsight: 'Статистика WB: 42% стартапов в первый год закрываются из-за отсутствия спроса. Валидация до запуска — самый важный этап.',
  },
  {
    id: 'planning',
    order: 2,
    title: 'Планирование',
    subtitle: 'Бизнес-план, финмодель, дорожная карта',
    duration: '2–3 недели',
    Icon: ClipboardCheck,
    tone: 'gold',
    keyActions: [
      'Составьте бизнес-план (цель, рынок, финмодель, риски)',
      'Постройте unit-экономику: стоимость привлечения клиента, маржа, точка безубыточности',
      'Оцените стартовые инвестиции и период окупаемости',
      'Определите юридическую форму (ИП / ООО / семейное предприятие)',
    ],
    commonMistakes: [
      'Завышение выручки, занижение расходов в финмодели',
      'Отсутствие плана B на случай медленного старта',
    ],
    relevantMeasures: [
      { id: 'NF002', title: 'Консультации по бизнес-плану от ЦПП',           amount: 'бесплатно' },
      { id: 'NF005', title: 'Шаблоны бизнес-плана (12 отраслей)',            amount: 'бесплатно' },
    ],
    linkedModules: [
      { title: 'Гайды: шаблоны бизнес-планов', href: '/modules/nPath',     icon: FileText },
      { title: 'Оценка готовности к финансированию', href: '/modules/maturity', icon: Target },
    ],
    stageInsight: 'Банки отказывают в 65% заявок на кредит из-за слабого бизнес-плана. Готовность к финансированию — ваша инвестиция в будущие деньги.',
  },
  {
    id: 'register',
    order: 3,
    title: 'Регистрация бизнеса',
    subtitle: 'ИП, ООО или семейное предприятие — birdarcha.uz',
    duration: '1–3 дня',
    Icon: Building,
    tone: 'navy',
    keyActions: [
      'Выберите юридическую форму исходя из стадии и оборотов',
      'Зарегистрируйте бизнес на birdarcha.uz (единое окно Минюста)',
      'Получите ИНН и встаньте на учёт в Soliq (автоматически)',
      'Откройте расчётный счёт в банке, подключите ЭЦП',
    ],
    commonMistakes: [
      'Выбор ООО для одного человека (дороже, сложнее, но без реальной выгоды для старта)',
      'Регистрация по домашнему адресу без проверки правил местного хокимията',
    ],
    relevantMeasures: [
      { id: 'M004', title: 'Льгота на государственную пошлину при регистрации', amount: 'скидка 50%' },
    ],
    linkedModules: [
      { title: 'Регистрация бизнеса',          href: '/modules/qBiz',      icon: Building },
      { title: 'Подключение к Soliq',           href: '/modules/qReg',      icon: Receipt },
    ],
    stageInsight: 'birdarcha.uz обеспечивает регистрацию за 30 минут онлайн. 3 дня — это включая открытие счёта в банке и оформление ЭЦП.',
  },
  {
    id: 'tax-regime',
    order: 4,
    title: 'Налоговый режим',
    subtitle: 'Упрощёнка vs НДС vs ЕСП — выбор с первого месяца',
    duration: '1 день (при регистрации)',
    Icon: Receipt,
    tone: 'secondary',
    keyActions: [
      'Оцените ожидаемые обороты: до 1 млрд сум — можно упрощёнку; выше — НДС',
      'Учтите специфику: IT-парк (0% налоги), приоритетные районы (4–5 категории), ремесленники (фиксированный)',
      'Зарегистрируйтесь как плательщик НДС сразу, если работаете с крупными клиентами',
      'Настройте календарь налоговых деклараций (ежемесячно для НДС, квартально для УСН)',
    ],
    commonMistakes: [
      'Выбор УСН при высоких оборотах — потом сложно переключиться',
      'Пропуск льгот для приоритетных районов и отраслей',
    ],
    relevantMeasures: [
      { id: 'M015', title: 'Льготы для категории ААА Рейтинга устойчивости',    amount: 'НДС без проверки за 1 день' },
      { id: 'M012', title: 'Льготы для резидентов IT-парка',                    amount: '0% подоходного, 7.5% ЕСП' },
    ],
    linkedModules: [
      { title: 'Налоги для МСБ · калькулятор',  href: '/modules/nTax',     icon: Receipt, isNew: true },
      { title: 'Реестр мер поддержки',          href: '/modules/registry',  icon: Sparkles },
    ],
    stageInsight: 'Рейтинг устойчивости (AAA–D, ПКМ №55 от 30.01.2024) начинает рассчитываться через 6 мес после регистрации. Высокая категория — льготы и упрощённый НДС.',
  },
  {
    id: 'capital',
    order: 5,
    title: 'Стартовый капитал',
    subtitle: 'Собственные, грант, кредит или инвестор',
    duration: '1–3 месяца',
    Icon: Coins,
    tone: 'gold',
    keyActions: [
      'Оцените минимально необходимую сумму и сумму подушки безопасности (x1.5)',
      'Подайте на стартап-грант до 200 млн сум (если подходите по критериям)',
      'Подготовьте credit story: финмодель, залог, кредитная история учредителей',
      'Рассмотрите family & friends, семейный бюджет, частных инвесторов',
    ],
    commonMistakes: [
      'Брать дорогой кредит на неоткрытый бизнес — лучше сначала органический рост',
      'Пропускать гос-гранты, считая «мне не дадут»',
    ],
    relevantMeasures: [
      { id: 'M001', title: 'Стартап-грант до 200 млн сум',                        amount: 'до 200 млн' },
      { id: 'M005', title: 'Льготный кредит Банка развития',                       amount: 'до 2 млрд, ЦБ+3%' },
      { id: 'M002', title: 'Субсидия для женщин-предпринимателей',                amount: '30% возмещение' },
    ],
    linkedModules: [
      { title: 'Кредитный навигатор',           href: '/modules/nCredit',  icon: Coins, isNew: true },
      { title: 'Реестр финансовых мер',          href: '/modules/registry?tab=financial', icon: Sparkles },
    ],
    stageInsight: '67% стартапов в Узбекистане стартуют на собственные средства. Стартап-гранты выдают ~12 000 в год — конкурс высокий, готовьтесь тщательно.',
  },
  {
    id: 'hire',
    order: 6,
    title: 'Найм сотрудников',
    subtitle: 'Трудовые договоры, ЕСП, регистрация в Soliq',
    duration: '1–2 недели на человека',
    Icon: UserPlus,
    tone: 'navy',
    keyActions: [
      'Подготовьте шаблон трудового договора (бессрочный / срочный / срочный проектный)',
      'Зарегистрируйте сотрудника в Soliq (автоматически при подаче расчёта ЕСП)',
      'Рассчитайте ЕСП + подоходный налог (12%) + соцстрах (12% работодатель)',
      'Оформите приказы о приёме, должностные инструкции, табель учёта рабочего времени',
    ],
    commonMistakes: [
      'Работа без трудового договора — штрафы до 50 БРВ + доначисление всех взносов',
      'Оформление на низкую зарплату «для налогов» при реальной выплате конвертом — риск проверки',
    ],
    relevantMeasures: [
      { id: 'NF003', title: 'HR-консультации от ЦПП',                              amount: 'бесплатно' },
      { id: 'M009', title: 'Субсидия на создание рабочих мест для молодёжи',        amount: 'до 10 млн/раб. место' },
    ],
    linkedModules: [
      { title: 'Кадры и трудоустройство',       href: '/modules/nHR',      icon: UserPlus, isNew: true },
    ],
    stageInsight: 'Субсидия на создание рабочих мест для молодёжи (18–30 лет) из категорий уязвимых граждан — реальная возможность сэкономить до 10 млн сум за каждое место.',
  },
  {
    id: 'launch',
    order: 7,
    title: 'Запуск',
    subtitle: 'Локация, лицензии, первые клиенты',
    duration: 'от 1 недели',
    Icon: Rocket,
    tone: 'success',
    keyActions: [
      'Выберите локацию: свободные лоты Давактив со скидкой 30% для МСБ',
      'Оформите необходимые лицензии: торговля алкоголем, фарма, образование и т.д.',
      'Настройте POS/CRM и базовые бизнес-процессы',
      'Запустите сайт и маркетинг: социальные сети, Google My Business, таргет',
    ],
    commonMistakes: [
      'Запуск без лицензий для лицензируемых видов деятельности — закрытие и штрафы',
      'Экономия на локации — плохой трафик приводит к закрытию',
    ],
    relevantMeasures: [
      { id: 'M006', title: 'Скидка на аренду Давактив для МСБ',                    amount: '30% для МСБ 4–5 кат.' },
    ],
    linkedModules: [
      { title: 'Геоаналитика · подбор мест',    href: '/modules/geo',       icon: MapPin },
      { title: 'Расширенный workflow мер',      href: '/modules/qWF',       icon: FileText },
    ],
    stageInsight: 'Плотность МСБ в Ташкенте — 74 на 1000 населения. В приоритетных регионах (Каракалпакстан — 28) конкуренция ниже, льготы выше.',
  },
  {
    id: 'sales',
    order: 8,
    title: 'Каналы сбыта',
    subtitle: 'B2C · B2B · онлайн · тендеры',
    duration: 'continuous',
    Icon: ShoppingBag,
    tone: 'secondary',
    keyActions: [
      'Постройте mix каналов: B2C (retail), B2B (Cooperation.uz), онлайн (Uzum/Wildberries), тендеры',
      'Подпишитесь на B2B-гильдии в «Сообществе» Платформы по своей отрасли',
      'Выйдите на маркетплейсы: Uzum (UZ), Wildberries (СНГ), Amazon (международно)',
      'Зарегистрируйтесь на xarid.uzex.uz — в 2026 обязательная квота МСБ в госзакупках = 25%',
    ],
    commonMistakes: [
      'Зависимость от одного канала — закрытие канала = закрытие бизнеса',
      'Игнорирование госзакупок из-за мнимой сложности',
    ],
    relevantMeasures: [
      { id: 'NF007', title: 'Консультация ЦПП · упаковка на экспорт',              amount: 'бесплатно' },
      { id: 'NF008', title: 'Поддержка экспортной логистики',                      amount: 'субсидия 30%' },
    ],
    linkedModules: [
      { title: 'Каналы сбыта',                  href: '/modules/nSales',   icon: ShoppingBag, isNew: true },
      { title: 'B2B и B2G коммуникация',        href: '/modules/comms',    icon: ShoppingBag },
      { title: 'E-commerce и маркетплейсы',     href: '/modules/ecommerce',icon: ShoppingBag },
      { title: 'Госзакупки',                     href: '/modules/nProcure', icon: Trophy },
    ],
    stageInsight: 'Обязательная квота МСБ в государственных закупках с 2026 — 25%. Средний контракт МСБ на xarid.uzex.uz — ~680 млн сум. Одна победа = годовой план продаж.',
  },
  {
    id: 'scale',
    order: 9,
    title: 'Масштабирование',
    subtitle: 'Рост оборотов, новые продукты и регионы',
    duration: '12–24 месяца',
    Icon: TrendingUp,
    tone: 'gold',
    keyActions: [
      'Автоматизируйте процессы: CRM, складской учёт, расчёт з/п',
      'Расширьте команду на руководящие должности (финансы, продажи, операции)',
      'Откройте филиалы в новых регионах или запустите новые продукты',
      'Улучшите категорию Рейтинга устойчивости до AA/AAA для доступа к премиум-льготам',
    ],
    commonMistakes: [
      'Рост без операционных процессов — хаос и потеря качества',
      'Открытие филиалов без проверки рынка — закрытие через год',
    ],
    relevantMeasures: [
      { id: 'M008', title: 'Субсидия на модернизацию оборудования',                amount: 'до 30% стоимости' },
      { id: 'M015', title: 'Льгота по НДС для категории ААА',                     amount: 'НДС возмещается за 1 день' },
      { id: 'M010', title: 'Субсидия на внедрение цифровизации',                  amount: 'до 40% на SaaS' },
    ],
    linkedModules: [
      { title: 'Реестр мер поддержки',          href: '/modules/registry', icon: Sparkles },
      { title: 'Оценка цифровой зрелости',      href: '/modules/maturity', icon: Target },
    ],
    stageInsight: 'Категория AAA Рейтинга устойчивости даёт возмещение НДС за 1 рабочий день без налоговых проверок. Прямая экономия для компаний с крупными оборотами.',
  },
  {
    id: 'export',
    order: 10,
    title: 'Экспорт',
    subtitle: 'Выход на зарубежные рынки',
    duration: '6–12 месяцев подготовки',
    Icon: Plane,
    tone: 'secondary',
    keyActions: [
      'Пройдите оценку экспортной готовности (опросник по методике Enterprise Singapore)',
      'Получите международные сертификаты: ISO, HACCP (пищепром), CE (Европа), FSC (лес)',
      'Оформите таможенные разрешения и валютный контроль с банком',
      'Подайте на субсидию экспортной логистики + получите поддержку Enterprise Uzbekistan',
    ],
    commonMistakes: [
      'Экспорт без сертификатов целевой страны — груз разворачивают на границе',
      'Отсутствие подготовки к валютным рискам',
    ],
    relevantMeasures: [
      { id: 'M007', title: 'Экспортный кредит Банка развития',                     amount: 'до $3 млн' },
      { id: 'NF008', title: 'Субсидия экспортной логистики',                        amount: '30% возмещение' },
    ],
    linkedModules: [
      { title: 'Экспортный навигатор',          href: '/modules/nExport',  icon: Plane, isNew: true },
      { title: 'E-commerce и маркетплейсы',     href: '/modules/ecommerce',icon: ShoppingBag },
    ],
    stageInsight: 'Доля МСБ в экспорте Узбекистана ~ 30%. Топ-рынки: Россия, Китай, Казахстан. Обязательна регистрация на Enterprise.uz для полноценной поддержки.',
  },
  {
    id: 'ip',
    order: 11,
    title: 'Защита интеллектуальной собственности',
    subtitle: 'Товарный знак, патенты, авторские права',
    duration: 'параллельно с запуском',
    Icon: Shield,
    tone: 'navy',
    keyActions: [
      'Зарегистрируйте товарный знак в Агентстве по ИС (ima.uz) — до конкурентов',
      'Патентуйте изобретения и полезные модели, если есть технологический компонент',
      'Оформите программы для ЭВМ (критично для IT-парка)',
      'Заключайте NDA с сотрудниками и подрядчиками, имеющими доступ к know-how',
    ],
    commonMistakes: [
      'Затягивание регистрации товарного знака — конкуренты регистрируют первыми',
      'Игнорирование ИС до первого конфликта — тогда уже поздно',
    ],
    relevantMeasures: [
      { id: 'NF012', title: 'Консультации Агентства по ИС',                         amount: 'бесплатно' },
    ],
    linkedModules: [
      { title: 'Интеллектуальная собственность', href: '/modules/nIP',      icon: Shield, isNew: true },
    ],
    stageInsight: 'Регистрация товарного знака занимает ~12 месяцев и стоит от 1.5 млн сум. В Узбекистане принят принцип «first to file» — кто первый подал, тот и прав.',
  },
  {
    id: 'exit',
    order: 12,
    title: 'Зрелость и выход',
    subtitle: 'Продажа · передача · закрытие',
    duration: '5+ лет от старта',
    Icon: Trophy,
    tone: 'success',
    keyActions: [
      'Подготовьте compliance-отчётность для due diligence (3 года финансов)',
      'Определите модель выхода: продажа целиком, IPO, передача наследникам',
      'Консультируйтесь с M&A-специалистами для оценки стоимости бизнеса',
      'При закрытии — подайте форму Ф-1 в Soliq и ликвидируйте через birdarcha.uz',
    ],
    commonMistakes: [
      'Занижение оборотов все годы → низкая оценка при продаже',
      'Несоблюдение процедуры закрытия → долгосрочные долги и штрафы',
    ],
    relevantMeasures: [
      { id: 'NF015', title: 'Юридические консультации по сделкам M&A',              amount: 'бесплатно, 3 ч' },
    ],
    linkedModules: [
      { title: 'Регистрация прекращения бизнеса', href: '/modules/qClose',  icon: FileText },
    ],
    stageInsight: 'Средний мультипликатор продажи устоявшегося МСБ в Узбекистане — 3–5× годовой прибыли. Высокая категория Рейтинга устойчивости + чистая отчётность = +30–50% к оценке.',
  },
];

const toneClasses = {
  gold:      { bg: 'bg-gold/10',       text: 'text-gold',       border: 'border-gold/30' },
  navy:      { bg: 'bg-navy/10',       text: 'text-navy',       border: 'border-navy/30' },
  secondary: { bg: 'bg-secondary/10',  text: 'text-secondary',  border: 'border-secondary/30' },
  success:   { bg: 'bg-success/10',    text: 'text-success',    border: 'border-success/30' },
  danger:    { bg: 'bg-danger/10',     text: 'text-danger',     border: 'border-danger/30' },
};

export function N_Lifecycle() {
  const role = useStore((s) => s.role);
  const [activeStageId, setActiveStageId] = useState<string>('tax-regime'); // demo: where our entrepreneur is
  const activeStage = STAGES.find((s) => s.id === activeStageId) ?? STAGES[0];
  const activeIndex = STAGES.findIndex((s) => s.id === activeStageId);

  return (
    <section className="container-wide py-10 md:py-14 space-y-8">
      {/* ─── Hero ─── */}
      <Card padding="lg" tone="navy" className="text-white relative overflow-hidden">
        <div className="absolute inset-0 pattern-dots opacity-30 pointer-events-none" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <Badge variant="new">NEW · навигатор</Badge>
            <span className="text-xs uppercase tracking-wider text-gold-light">
              Business Lifecycle Navigator
            </span>
          </div>
          <h2 className="font-serif text-2xl md:text-3xl text-white mb-2 leading-tight">
            Жизненный цикл бизнеса — от идеи до масштабирования и выхода
          </h2>
          <p className="text-white/75 max-w-3xl text-sm leading-relaxed">
            12 ключевых этапов развития МСБ в единой визуальной карте. Для каждого этапа — ключевые действия,
            типичные ошибки, применимые меры поддержки и ссылки на специализированные модули Платформы. Это
            логическая цепочка всей Платформы: где вы сейчас, куда идти дальше, что не упустить.
          </p>
        </div>
      </Card>

      <PhaseRoadmapStrip
        embedded
        currentPhase={2}
        points={[
          { phase: 2, text: '12 этапов жизненного цикла с чек-листами и примерами ошибок' },
          { phase: 2, text: 'Cross-ссылки на все модули Платформы: реестр мер, геоаналитика, зрелость, гайды' },
          { phase: 2, text: 'Индикация «Вы здесь» для авторизованного предпринимателя' },
          { phase: 2, text: 'Обсуждение состава чек-листов с отраслевыми ассоциациями' },
          { phase: 3, text: 'AI-ассистент внутри этапов: «проверь мою готовность к шагу X»' },
          { phase: 3, text: 'Автоматическое определение текущего этапа по данным из Soliq / Минюста через МИП' },
          { phase: 4, text: 'Отраслевые варианты цикла: отдельные для IT, АПК, пищепрома, услуг' },
        ]}
      />

      {/* ─── Personal progress for authorised entrepreneur ─── */}
      {role === 'entrepreneur' && (
        <Card padding="lg" className="border-gold/25 bg-gold-soft/25">
          <div className="flex items-start gap-4 flex-wrap">
            <div className="h-11 w-11 rounded-xl bg-gold text-white flex items-center justify-center shrink-0">
              <Target className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <CardTitle>Вы сейчас здесь</CardTitle>
                <Badge variant="priority-solid">Этап {activeStage.order} / 12</Badge>
              </div>
              <CardDescription className="text-[13px]">
                Определено по данным вашего цифрового профиля: бизнес зарегистрирован, на упрощённом режиме,
                оборот растёт. Следующий этап — {STAGES[Math.min(activeIndex + 1, STAGES.length - 1)].title}.
              </CardDescription>
            </div>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div>
                <div className="font-serif text-xl font-semibold text-navy">{activeIndex + 1}</div>
                <div className="text-[10px] uppercase tracking-wider text-ink-muted">пройдено</div>
              </div>
              <div>
                <div className="font-serif text-xl font-semibold text-gold">1</div>
                <div className="text-[10px] uppercase tracking-wider text-ink-muted">текущий</div>
              </div>
              <div>
                <div className="font-serif text-xl font-semibold text-ink-muted">{STAGES.length - activeIndex - 1}</div>
                <div className="text-[10px] uppercase tracking-wider text-ink-muted">впереди</div>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* ─── Visual timeline ─── */}
      <div>
        <h3 className="font-serif text-xl text-ink mb-4">Выберите этап для деталей</h3>
        <div className="overflow-x-auto pb-3">
          <div className="flex gap-0 min-w-[1050px] items-start">
            {STAGES.map((s, i) => {
              const isActive = s.id === activeStageId;
              const isPassed = i < activeIndex;
              const tone = toneClasses[s.tone];
              return (
                <div key={s.id} className="flex-1 flex flex-col items-center relative">
                  {/* Connector line */}
                  {i < STAGES.length - 1 && (
                    <div
                      className={`absolute top-6 left-1/2 right-0 h-[2px] ${
                        isPassed ? 'bg-success' : 'bg-ink-line'
                      }`}
                      style={{ width: '100%' }}
                    />
                  )}
                  <button
                    onClick={() => setActiveStageId(s.id)}
                    className={`relative h-12 w-12 rounded-full flex items-center justify-center shrink-0 transition-all z-10 ${
                      isActive
                        ? `${tone.bg} ${tone.text} ring-4 ring-gold/30 scale-110 shadow-card`
                        : isPassed
                        ? 'bg-success text-white'
                        : 'bg-bg-band text-ink-muted hover:bg-gold-soft hover:text-gold'
                    }`}
                    aria-label={s.title}
                  >
                    {isPassed ? <CheckCircle2 className="h-5 w-5" /> : <s.Icon className="h-5 w-5" />}
                  </button>
                  <div className={`text-[10px] uppercase tracking-wider font-semibold mt-2 ${isActive ? 'text-gold-dark' : 'text-ink-muted'}`}>
                    Этап {s.order}
                  </div>
                  <div className={`text-[11px] text-center mt-0.5 px-1 leading-tight ${isActive ? 'text-ink font-medium' : 'text-ink-muted'}`}>
                    {s.title}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ─── Active stage details ─── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeStage.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3 }}
        >
          <Card padding="lg">
            {/* Header */}
            <div className="flex items-start gap-4 mb-5 flex-wrap">
              <div className={`h-14 w-14 rounded-xl ${toneClasses[activeStage.tone].bg} ${toneClasses[activeStage.tone].text} flex items-center justify-center shrink-0`}>
                <activeStage.Icon className="h-6 w-6" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <Badge variant="outline">Этап {activeStage.order} / 12</Badge>
                  <Badge variant="queue"><Clock className="h-3 w-3" />{activeStage.duration}</Badge>
                </div>
                <CardTitle className="text-[20px]">{activeStage.title}</CardTitle>
                <CardDescription className="mt-0.5 text-[13px]">{activeStage.subtitle}</CardDescription>
              </div>
            </div>

            {/* Insight callout */}
            <div className={`p-4 rounded-xl border ${toneClasses[activeStage.tone].border} ${toneClasses[activeStage.tone].bg} mb-5 flex items-start gap-3`}>
              <Sparkles className={`h-4 w-4 ${toneClasses[activeStage.tone].text} shrink-0 mt-0.5`} />
              <div className="text-[13px] text-ink-soft leading-relaxed">{activeStage.stageInsight}</div>
            </div>

            {/* Grid: key actions + common mistakes */}
            <div className="grid md:grid-cols-2 gap-4 mb-5">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle2 className="h-4 w-4 text-success" />
                  <div className="font-serif font-semibold text-ink">Ключевые действия</div>
                </div>
                <ul className="space-y-2">
                  {activeStage.keyActions.map((a, i) => (
                    <li key={i} className="flex items-start gap-2 text-[13px] text-ink-soft leading-relaxed">
                      <span className={`h-5 w-5 rounded-full ${toneClasses[activeStage.tone].bg} ${toneClasses[activeStage.tone].text} flex items-center justify-center shrink-0 font-mono text-[10px] font-semibold mt-0.5`}>
                        {i + 1}
                      </span>
                      <span>{a}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-3">
                  <AlertCircle className="h-4 w-4 text-danger" />
                  <div className="font-serif font-semibold text-ink">Типичные ошибки</div>
                </div>
                <ul className="space-y-2">
                  {activeStage.commonMistakes.map((m, i) => (
                    <li key={i} className="flex items-start gap-2 text-[13px] text-ink-soft leading-relaxed">
                      <span className="text-danger mt-1 shrink-0">✕</span>
                      <span>{m}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Relevant measures */}
            {activeStage.relevantMeasures.length > 0 && (
              <div className="mb-5">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="h-4 w-4 text-gold" />
                  <div className="font-serif font-semibold text-ink">Применимые меры поддержки</div>
                </div>
                <div className="grid md:grid-cols-2 gap-2">
                  {activeStage.relevantMeasures.map((m) => (
                    <Link
                      key={m.id}
                      href={`/modules/registry?measure=${m.id}`}
                      className="p-3 rounded-lg border border-ink-line bg-bg-white hover:border-gold/50 hover:bg-gold-soft/30 transition-all block group"
                    >
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="text-[10px] font-mono text-ink-muted uppercase">{m.id}</span>
                        {m.amount && <span className="text-[11px] text-gold font-semibold">{m.amount}</span>}
                      </div>
                      <div className="text-[13px] text-ink leading-tight flex items-center justify-between gap-2">
                        <span>{m.title}</span>
                        <ArrowRight className="h-3 w-3 text-ink-muted group-hover:text-gold shrink-0" />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Linked modules */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <ArrowRight className="h-4 w-4 text-secondary" />
                <div className="font-serif font-semibold text-ink">Подробно в модулях</div>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-2">
                {activeStage.linkedModules.map((m, i) => (
                  <Link
                    key={i}
                    href={m.href}
                    className="p-3 rounded-lg border border-ink-line bg-bg-white hover:border-secondary/50 hover:bg-secondary/5 transition-all group"
                  >
                    <div className="flex items-start gap-2.5">
                      <div className="h-8 w-8 rounded-lg bg-secondary/10 text-secondary flex items-center justify-center shrink-0">
                        <m.icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
                          {m.isNew && <Badge variant="new">NEW</Badge>}
                          {m.isPlanned && <Badge variant="queue">в работе</Badge>}
                        </div>
                        <div className="text-[12.5px] font-medium text-ink leading-tight group-hover:text-secondary transition-colors">
                          {m.title}
                        </div>
                      </div>
                      <ArrowRight className="h-3 w-3 text-ink-muted group-hover:text-secondary shrink-0 mt-2 group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Navigation */}
            <div className="mt-6 pt-5 border-t border-ink-line flex items-center justify-between gap-3 flex-wrap">
              <Button
                variant="ghost"
                size="sm"
                disabled={activeIndex === 0}
                onClick={() => setActiveStageId(STAGES[Math.max(0, activeIndex - 1)].id)}
                leftIcon={<ArrowRight className="h-3.5 w-3.5 rotate-180" />}
              >
                Предыдущий этап
              </Button>
              <div className="text-xs text-ink-muted">
                {activeIndex + 1} из {STAGES.length}
              </div>
              <Button
                size="sm"
                disabled={activeIndex === STAGES.length - 1}
                onClick={() => setActiveStageId(STAGES[Math.min(STAGES.length - 1, activeIndex + 1)].id)}
                rightIcon={<ArrowRight className="h-3.5 w-3.5" />}
              >
                Следующий этап
              </Button>
            </div>
          </Card>
        </motion.div>
      </AnimatePresence>

      {/* ─── Footer callout ─── */}
      <Card padding="lg" className="border-success/25 bg-success/[0.03]">
        <div className="flex items-start gap-4">
          <div className="h-10 w-10 rounded-lg bg-success/10 text-success flex items-center justify-center shrink-0">
            <Sparkles className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <div className="font-serif font-semibold text-ink">Это логическая карта всей Платформы</div>
            <CardDescription className="mt-1">
              Жизненный цикл — не отдельный деливерабл, а навигатор. Каждый этап ведёт в специализированный
              модуль с глубоким контентом. Политическое значение: показывает МЭФ и ведомствам, что Платформа —
              не каталог разрозненных сервисов, а последовательная поддержка МСБ на всех этапах от рождения до зрелости.
            </CardDescription>
            <div className="mt-3 flex gap-2 flex-wrap">
              <Badge variant="new">NEW · навигатор</Badge>
              <Badge variant="outline">12 этапов · 25+ модулей</Badge>
              <Badge variant="outline">Связан со всеми модулями Платформы</Badge>
            </div>
          </div>
        </div>
      </Card>
    </section>
  );
}
