'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LogOut, AlertCircle, CheckCircle2, Clock, ArrowRight, ArrowLeft, FileSignature,
  Sparkles, Users2, Coins, FileText, Building2, ShieldCheck, Archive,
  Banknote, Briefcase, XCircle, Calendar, Info, Download,
} from 'lucide-react';
import { Card, CardTitle, CardDescription } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/Progress';
import { cn } from '@/lib/cn';

// ════════════════════════════════════════════════════════════════════
// Closure scenarios (which legal form + reason)
// ════════════════════════════════════════════════════════════════════
type EntityType = 'ip' | 'ltd-simple' | 'ltd-with-debts' | 'ltd-with-employees';

interface ClosureScenario {
  id: EntityType;
  title: string;
  description: string;
  Icon: typeof Building2;
  estDays: string;
  complexity: 'easy' | 'medium' | 'hard';
  fee: string;
}

const SCENARIOS: ClosureScenario[] = [
  {
    id: 'ip',
    title: 'ИП · без задолженностей',
    description: 'Индивидуальный предприниматель без сотрудников и долгов перед бюджетом. Самый простой сценарий.',
    Icon: Briefcase,
    estDays: '3–5 рабочих дней',
    complexity: 'easy',
    fee: 'Бесплатно',
  },
  {
    id: 'ltd-simple',
    title: 'ООО · добровольная ликвидация',
    description: 'ООО без сотрудников, без задолженностей, имущество распределено между учредителями.',
    Icon: Building2,
    estDays: '2–4 месяца',
    complexity: 'medium',
    fee: '300 000 сум',
  },
  {
    id: 'ltd-with-employees',
    title: 'ООО · с сотрудниками',
    description: 'ООО с активным штатом — добавляются процедуры увольнения, выплаты компенсаций, уведомлений в Минтруда.',
    Icon: Users2,
    estDays: '3–6 месяцев',
    complexity: 'hard',
    fee: '300 000 сум + расчёты с сотрудниками',
  },
  {
    id: 'ltd-with-debts',
    title: 'ООО · с задолженностями',
    description: 'Есть непогашенные долги перед бюджетом или кредиторами — потребуется погашение или банкротство.',
    Icon: AlertCircle,
    estDays: '6–12 месяцев',
    complexity: 'hard',
    fee: '300 000 сум + судебные расходы',
  },
];

// ════════════════════════════════════════════════════════════════════
// Step-by-step procedure for each scenario
// ════════════════════════════════════════════════════════════════════
interface ClosureStep {
  n: number;
  title: string;
  description: string;
  authority: string;
  durationDays: string;
  canDoOnline: boolean;
  documents: string[];
  linkedModule?: string;
}

const STEPS_BY_SCENARIO: Record<EntityType, ClosureStep[]> = {
  'ip': [
    { n: 1, title: 'Подача заявления о прекращении', description: 'Заполните форму в личном кабинете. Данные из профиля подтягиваются автоматически.', authority: 'Минюст', durationDays: '1 день', canDoOnline: true, documents: ['Заявление (генерируется)', 'Свидетельство ИП'], linkedModule: '/modules/qReg' },
    { n: 2, title: 'Сдача финальной отчётности', description: 'Налоговая декларация за период до даты прекращения. Предзаполнена из Soliq.', authority: 'Soliq', durationDays: '1 день', canDoOnline: true, documents: ['Финальная декларация'], linkedModule: '/modules/qRep' },
    { n: 3, title: 'Погашение налогов и взносов', description: 'Уплата начисленных сумм. Если задолженностей нет — шаг пропускается.', authority: 'Soliq', durationDays: '1–3 дня', canDoOnline: true, documents: ['Платёжные поручения'] },
    { n: 4, title: 'Закрытие расчётного счёта', description: 'Уведомление банка о прекращении деятельности. Банк сам сообщает в Soliq.', authority: 'Банк', durationDays: '1–2 дня', canDoOnline: true, documents: ['Заявление в банк'] },
    { n: 5, title: 'Получение свидетельства о прекращении', description: 'После успешного завершения предыдущих шагов свидетельство выдаётся автоматически.', authority: 'Минюст', durationDays: 'моментально', canDoOnline: true, documents: ['Свидетельство о прекращении (PDF)'] },
  ],
  'ltd-simple': [
    { n: 1, title: 'Решение учредителей о ликвидации', description: 'Протокол общего собрания учредителей. Шаблон генерируется Платформой.', authority: 'внутр.', durationDays: '1 день', canDoOnline: true, documents: ['Протокол собрания (шаблон)', 'Решение о ликвидации'] },
    { n: 2, title: 'Назначение ликвидационной комиссии', description: 'Комиссия или единоличный ликвидатор. Назначается в протоколе.', authority: 'внутр.', durationDays: '1 день', canDoOnline: true, documents: ['Решение о назначении'] },
    { n: 3, title: 'Публикация в «Официальной газете»', description: 'Обязательная публикация о ликвидации. Срок подачи претензий кредиторами — 2 месяца.', authority: 'Официальная газета', durationDays: '2 месяца (ожидание)', canDoOnline: true, documents: ['Текст публикации (шаблон)'] },
    { n: 4, title: 'Уведомление Soliq, Нацстата, Пенсионного фонда', description: 'Все три уведомления отправляются одним действием через МИП.', authority: 'Soliq + Нацстат + ПФ', durationDays: '3 дня', canDoOnline: true, documents: ['Единое уведомление'], linkedModule: '/modules/qRep' },
    { n: 5, title: 'Сдача промежуточного ликвидационного баланса', description: 'После окончания срока подачи требований кредиторов. Предзаполнен из Soliq.', authority: 'Soliq', durationDays: '7 дней', canDoOnline: true, documents: ['Промежуточный баланс', 'Список кредиторов'] },
    { n: 6, title: 'Расчёты с кредиторами и учредителями', description: 'Погашение долгов в установленной очерёдности. Распределение имущества.', authority: 'Банк', durationDays: '2–4 недели', canDoOnline: true, documents: ['Платёжные поручения'] },
    { n: 7, title: 'Окончательный ликвидационный баланс', description: 'Финальный документ после всех расчётов. Показывает нулевые остатки.', authority: 'Soliq', durationDays: '3 дня', canDoOnline: true, documents: ['Финальный баланс'] },
    { n: 8, title: 'Исключение из реестра юрлиц', description: 'Финальный шаг — после проверки Минюст вносит запись об исключении.', authority: 'Минюст', durationDays: '5 рабочих дней', canDoOnline: true, documents: ['Свидетельство об исключении'] },
  ],
  'ltd-with-employees': [
    { n: 1, title: 'Решение учредителей о ликвидации', description: 'Как в базовом сценарии ООО.', authority: 'внутр.', durationDays: '1 день', canDoOnline: true, documents: ['Протокол'] },
    { n: 2, title: 'Уведомление сотрудников за 2 месяца', description: 'Обязательное письменное уведомление. Шаблон генерируется автоматически для каждого штатника.', authority: 'Минтруда', durationDays: 'сразу (2 мес. ожидания)', canDoOnline: true, documents: ['Уведомления сотрудникам (N шт.)', 'Уведомление в Минтруда'] },
    { n: 3, title: 'Увольнение по сокращению', description: 'После истечения 2-месячного срока. Автоматический расчёт компенсаций (2-мес. оклад + неотгул. отпуск).', authority: 'Минтруда', durationDays: '3 дня', canDoOnline: true, documents: ['Приказы об увольнении', 'Расчётные листки'] },
    { n: 4, title: 'Выплата компенсаций', description: 'Выплата через банк. Автоматическое удержание налогов.', authority: 'Банк + Soliq', durationDays: '1–2 дня', canDoOnline: true, documents: ['Платёжные ведомости'] },
    { n: 5, title: 'Публикация в «Официальной газете»', description: 'Параллельно с увольнениями или после.', authority: 'Официальная газета', durationDays: '2 месяца (ожидание)', canDoOnline: true, documents: ['Публикация'] },
    { n: 6, title: 'Расчёты с кредиторами и партнёрами', description: 'Закрытие поставщиков, арендодателей, подрядчиков.', authority: 'Банк', durationDays: '3–4 недели', canDoOnline: true, documents: ['Акты сверки', 'Платёжные поручения'] },
    { n: 7, title: 'Финальная отчётность и ликвидационный баланс', description: 'Полный комплект для Soliq и Нацстата.', authority: 'Soliq + Нацстат', durationDays: '7 дней', canDoOnline: true, documents: ['Финальные декларации', 'Ликвидационный баланс'] },
    { n: 8, title: 'Исключение из реестра юрлиц', description: 'После проверки.', authority: 'Минюст', durationDays: '5 рабочих дней', canDoOnline: true, documents: ['Свидетельство об исключении'] },
  ],
  'ltd-with-debts': [
    { n: 1, title: 'Оценка финансового состояния', description: 'Платформа анализирует данные из Soliq и банков — показывает сумму долга и активов.', authority: 'автомат-ки', durationDays: 'моментально', canDoOnline: true, documents: ['Финансовый отчёт (генерируется)'] },
    { n: 2, title: 'Выбор процедуры: погашение или банкротство', description: 'Если активов хватает — добровольная ликвидация. Если нет — банкротство через суд.', authority: 'внутр.', durationDays: 'решение на уровне учредителей', canDoOnline: true, documents: ['Решение учредителей'] },
    { n: 3, title: 'Подача заявления о банкротстве (если применимо)', description: 'В экономический суд по месту регистрации. Платформа генерирует комплект документов.', authority: 'Экономический суд', durationDays: '5 дней подача + 30 дней рассмотрение', canDoOnline: false, documents: ['Заявление', 'Реестр кредиторов', 'Бухгалтерский баланс', 'Список имущества'] },
    { n: 4, title: 'Назначение внешнего управляющего', description: 'Управляющий принимает ведение дел, распоряжается имуществом.', authority: 'Суд', durationDays: '14 дней', canDoOnline: false, documents: ['Определение суда'] },
    { n: 5, title: 'Реализация имущества', description: 'Продажа имущества через торги, погашение долгов в очерёдности, установленной законом.', authority: 'Управляющий', durationDays: '3–6 месяцев', canDoOnline: false, documents: ['Отчёт о реализации', 'Протоколы торгов'] },
    { n: 6, title: 'Расчёты с кредиторами', description: 'Выплаты в порядке очерёдности: налоги → сотрудники → залоговые → остальные.', authority: 'Управляющий', durationDays: '1–2 месяца', canDoOnline: true, documents: ['Реестр выплат'] },
    { n: 7, title: 'Завершение процедуры банкротства', description: 'Определение суда о завершении. После этого — исключение из реестра.', authority: 'Суд + Минюст', durationDays: '30 дней', canDoOnline: false, documents: ['Определение суда', 'Уведомление Минюста'] },
    { n: 8, title: 'Исключение из реестра юрлиц', description: 'Финальный шаг после получения определения суда.', authority: 'Минюст', durationDays: '5 рабочих дней', canDoOnline: true, documents: ['Свидетельство об исключении'] },
  ],
};

// ════════════════════════════════════════════════════════════════════
// Pre-closure checklist — what to do BEFORE starting
// ════════════════════════════════════════════════════════════════════
const PRE_CHECKLIST = [
  { Icon: Banknote,     title: 'Рассчитайтесь с сотрудниками',         desc: 'Выплата зарплат, отпускных, компенсаций за неиспользованный отпуск' },
  { Icon: Coins,        title: 'Погасите налоговую задолженность',     desc: 'Справка об отсутствии задолженности от Soliq — обязательна' },
  { Icon: Users2,       title: 'Уведомите контрагентов',                desc: 'Поставщиков, клиентов, арендодателей — минимум за 30 дней' },
  { Icon: FileText,     title: 'Соберите бухгалтерские документы',      desc: 'За последние 5 лет — придётся предоставлять в проверке' },
  { Icon: Archive,      title: 'Сохраните архив за 5 лет',             desc: 'Обязательное требование. Хранение — минимум 5 лет после ликвидации' },
  { Icon: ShieldCheck,  title: 'Закройте лицензии и разрешения',       desc: 'Уведомите лицензирующие органы заранее' },
];

// ════════════════════════════════════════════════════════════════════
// Main component
// ════════════════════════════════════════════════════════════════════
type View = 'scenarios' | 'flow';

export function Q_Closure() {
  const [view, setView] = useState<View>('scenarios');
  const [scenarioId, setScenarioId] = useState<EntityType>('ltd-simple');
  const [currentStep, setCurrentStep] = useState<number>(0);

  const scenario = SCENARIOS.find((s) => s.id === scenarioId)!;
  const steps = STEPS_BY_SCENARIO[scenarioId];

  function start(id: EntityType) {
    setScenarioId(id);
    setCurrentStep(0);
    setView('flow');
  }

  return (
    <section className="container-wide py-10 md:py-14 space-y-6">
      {/* Hero */}
      <Card padding="lg" tone="navy" className="text-white relative overflow-hidden">
        <div className="absolute inset-0 pattern-dots opacity-25 pointer-events-none" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-3">
            <LogOut className="h-5 w-5 text-gold-light" />
            <span className="text-xs uppercase tracking-wider text-gold-light font-semibold">
              Адаптация Singapore ACRA «Strike Off» · Estonia e-Business Register
            </span>
          </div>
          <h2 className="font-serif text-2xl md:text-3xl text-white mb-2 leading-tight">
            Прекращение бизнеса — упорядоченный выход без сюрпризов
          </h2>
          <p className="text-white/75 max-w-3xl text-sm">
            Выберите сценарий закрытия — Платформа проведёт вас по всем шагам: Минюст · Soliq · Пенсионный фонд ·
            Минтруда. Шаблоны документов, автопроверка статуса, единое уведомление всех ведомств через МИП.
          </p>
        </div>
      </Card>

      {view === 'scenarios' && (
        <>
          {/* Pre-checklist */}
          <Card padding="lg">
            <div className="flex items-center gap-2 mb-3">
              <AlertCircle className="h-5 w-5 text-gold" />
              <CardTitle className="text-[16px]">До начала: обязательный чек-лист</CardTitle>
            </div>
            <CardDescription className="mb-4">
              Прежде чем запускать процедуру, убедитесь что выполнены базовые шаги. Платформа предупредит, если что-то упустили.
            </CardDescription>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
              {PRE_CHECKLIST.map((item, i) => (
                <div key={i} className="p-3 rounded-lg border border-ink-line bg-bg-white">
                  <div className="flex items-start gap-2">
                    <div className="h-8 w-8 rounded-lg bg-gold/10 text-gold flex items-center justify-center shrink-0">
                      <item.Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-ink leading-tight">{item.title}</div>
                      <div className="text-xs text-ink-muted mt-0.5 leading-snug">{item.desc}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Scenario chooser */}
          <div>
            <h3 className="font-serif text-xl text-ink mb-3">Выберите ваш сценарий</h3>
            <div className="grid md:grid-cols-2 gap-3">
              {SCENARIOS.map((s, i) => {
                const complexityConfig = {
                  easy:   { label: 'Простой',  variant: 'success' as const },
                  medium: { label: 'Средний',  variant: 'warning' as const },
                  hard:   { label: 'Сложный',  variant: 'danger' as const  },
                };
                return (
                  <motion.button
                    key={s.id}
                    onClick={() => start(s.id)}
                    initial={{ opacity: 0, y: 8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.25, delay: i * 0.05 }}
                    className="surface-card surface-card-hover p-5 text-left group focus-ring"
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <div className="h-11 w-11 rounded-xl bg-gold/10 text-gold flex items-center justify-center shrink-0">
                        <s.Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                          <div className="font-serif text-[15px] text-ink">{s.title}</div>
                          <Badge variant={complexityConfig[s.complexity].variant}>
                            {complexityConfig[s.complexity].label}
                          </Badge>
                        </div>
                        <div className="text-xs text-ink-muted leading-snug">{s.description}</div>
                      </div>
                    </div>
                    <div className="pt-3 border-t border-ink-line flex items-center justify-between text-xs">
                      <span className="text-ink-muted">
                        <Clock className="inline h-3 w-3 -mt-0.5" /> {s.estDays} · {STEPS_BY_SCENARIO[s.id].length} шагов
                      </span>
                      <span className="text-gold font-semibold">{s.fee}</span>
                    </div>
                    <div className="mt-3 text-sm text-gold font-medium flex items-center gap-1">
                      Начать процедуру <ArrowRight className="h-3.5 w-3.5" />
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Data retention notice */}
          <Card padding="md" className="border-danger/30 bg-danger/5">
            <div className="flex items-start gap-3">
              <ShieldCheck className="h-5 w-5 text-danger shrink-0 mt-0.5" />
              <div className="text-sm text-ink">
                <strong>Важно:</strong> после прекращения деятельности вы обязаны хранить бухгалтерские документы
                минимум <strong>5 лет</strong>. Платформа предлагает цифровой архив — все документы, созданные через
                профиль бизнеса, остаются доступными в «Архив закрытых бизнесов» в течение 5 лет.
              </div>
            </div>
          </Card>

          {/* Footer */}
          <Card padding="lg" className="border-gold/25 bg-gold-soft/30">
            <div className="flex items-start gap-4">
              <div className="h-10 w-10 rounded-lg bg-gold/15 text-gold flex items-center justify-center shrink-0">
                <Sparkles className="h-5 w-5" />
              </div>
              <div className="text-sm text-ink">
                <strong>Референсы:</strong> Singapore <strong>ACRA Strike-Off</strong> — автоматизированное закрытие
                ООО за 5–7 месяцев с публикацией в Government Gazette. Estonia <strong>e-Business Register</strong> —
                полностью онлайн-закрытие с цифровой подписью. В Узбекистане сейчас процедура часто затягивается
                на 6–12 месяцев из-за разрозненности ведомств — модуль объединяет всё в одну последовательность.
              </div>
            </div>
          </Card>
        </>
      )}

      {view === 'flow' && (
        <ClosureFlow
          scenario={scenario}
          steps={steps}
          currentStep={currentStep}
          onNext={() => setCurrentStep((s) => Math.min(s + 1, steps.length - 1))}
          onBack={() => setCurrentStep((s) => Math.max(0, s - 1))}
          onBackToScenarios={() => setView('scenarios')}
        />
      )}
    </section>
  );
}

// ════════════════════════════════════════════════════════════════════
// Flow component — step-by-step procedure
// ════════════════════════════════════════════════════════════════════
function ClosureFlow({
  scenario, steps, currentStep, onNext, onBack, onBackToScenarios,
}: {
  scenario: ClosureScenario;
  steps: ClosureStep[];
  currentStep: number;
  onNext: () => void;
  onBack: () => void;
  onBackToScenarios: () => void;
}) {
  const step = steps[currentStep];
  const pct = ((currentStep + 1) / steps.length) * 100;
  const isLast = currentStep === steps.length - 1;

  return (
    <div className="space-y-5">
      {/* Scenario bar */}
      <Card padding="md">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-gold/10 text-gold flex items-center justify-center">
              <scenario.Icon className="h-5 w-5" />
            </div>
            <div>
              <div className="text-[10.5px] uppercase tracking-wider text-gold font-semibold">Сценарий</div>
              <div className="font-serif text-[15px] text-ink leading-tight">{scenario.title}</div>
            </div>
          </div>
          <Button size="sm" variant="ghost" leftIcon={<ArrowLeft className="h-4 w-4" />} onClick={onBackToScenarios}>
            Сменить сценарий
          </Button>
        </div>
      </Card>

      {/* Progress */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-ink-muted">Шаг {currentStep + 1} из {steps.length}</span>
          <span className="text-xs text-gold font-mono">{Math.round(pct)}%</span>
        </div>
        <ProgressBar value={pct} tone="gold" height="md" />
      </div>

      {/* Horizontal stepper */}
      <div className="overflow-x-auto scrollbar-slim">
        <div className="flex items-center gap-1 min-w-max px-1 py-1">
          {steps.map((s, i) => {
            const done = i < currentStep;
            const active = i === currentStep;
            return (
              <div key={s.n} className="flex items-center">
                <button
                  onClick={() => { /* user can navigate by click */ }}
                  className={cn(
                    'h-8 min-w-8 px-2 rounded-full flex items-center justify-center font-serif font-semibold text-xs transition-colors shrink-0',
                    done ? 'bg-success text-white' : active ? 'bg-gold text-white' : 'bg-bg-band text-ink-muted',
                  )}
                  title={s.title}
                >
                  {done ? <CheckCircle2 className="h-4 w-4" /> : s.n}
                </button>
                {i < steps.length - 1 && <div className={cn('h-px w-8 shrink-0', done ? 'bg-success' : 'bg-ink-line')} />}
              </div>
            );
          })}
        </div>
      </div>

      {/* Current step detail */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step.n}
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -12 }}
          transition={{ duration: 0.22 }}
        >
          <Card padding="lg">
            <div className="flex items-start gap-4 mb-4">
              <div className="h-12 w-12 rounded-xl bg-gold text-white flex items-center justify-center shrink-0 font-serif font-semibold text-xl">
                {step.n}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <CardTitle>{step.title}</CardTitle>
                  {step.canDoOnline ? (
                    <Badge variant="success">онлайн</Badge>
                  ) : (
                    <Badge variant="warning">требуется суд/офлайн</Badge>
                  )}
                </div>
                <CardDescription>{step.description}</CardDescription>
              </div>
            </div>

            {/* Step metadata grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
              <div className="p-3 rounded-lg bg-bg-band/50 border border-ink-line">
                <div className="text-[10.5px] uppercase tracking-wider text-ink-muted font-semibold">Ведомство</div>
                <div className="text-sm text-ink font-semibold mt-0.5 flex items-center gap-1.5">
                  <Building2 className="h-3.5 w-3.5 text-gold" />
                  {step.authority}
                </div>
              </div>
              <div className="p-3 rounded-lg bg-bg-band/50 border border-ink-line">
                <div className="text-[10.5px] uppercase tracking-wider text-ink-muted font-semibold">Длительность</div>
                <div className="text-sm text-ink font-semibold mt-0.5 flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-gold" />
                  {step.durationDays}
                </div>
              </div>
              <div className="p-3 rounded-lg bg-bg-band/50 border border-ink-line">
                <div className="text-[10.5px] uppercase tracking-wider text-ink-muted font-semibold">Документов</div>
                <div className="text-sm text-ink font-semibold mt-0.5 flex items-center gap-1.5">
                  <FileText className="h-3.5 w-3.5 text-gold" />
                  {step.documents.length}
                </div>
              </div>
            </div>

            {/* Documents list */}
            <div className="mb-4">
              <div className="text-xs uppercase tracking-wider text-ink-muted font-semibold mb-2">Документы для этого шага</div>
              <div className="space-y-1.5">
                {step.documents.map((doc) => (
                  <div key={doc} className="flex items-center gap-2 p-2 rounded-lg bg-bg-band/40 border border-ink-line">
                    <FileText className="h-4 w-4 text-gold-dark shrink-0" />
                    <span className="text-sm text-ink flex-1">{doc}</span>
                    <button className="text-[11px] text-gold hover:text-gold-dark font-medium flex items-center gap-1">
                      <Download className="h-3 w-3" /> шаблон
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Linked module */}
            {step.linkedModule && (
              <div className="mb-4 p-3 rounded-lg border border-gold/30 bg-gold-soft/30">
                <div className="flex items-center gap-2 text-sm">
                  <Info className="h-4 w-4 text-gold shrink-0" />
                  <span className="text-ink">
                    Этот шаг связан с другим модулем Платформы —{' '}
                  </span>
                  <a href={step.linkedModule} className="text-gold font-semibold hover:underline">
                    открыть →
                  </a>
                </div>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex gap-2 flex-wrap pt-3 border-t border-ink-line">
              {step.canDoOnline ? (
                <Button size="md" leftIcon={<FileSignature className="h-4 w-4" />}>
                  {isLast ? 'Завершить процедуру' : 'Выполнить шаг и подписать ЭЦП'}
                </Button>
              ) : (
                <Button size="md" variant="ghost" leftIcon={<AlertCircle className="h-4 w-4" />}>
                  Требуется офлайн-подача в ведомство
                </Button>
              )}
              <Button size="md" variant="ghost" leftIcon={<Users2 className="h-4 w-4" />}>
                Консультация юриста
              </Button>
            </div>
          </Card>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex items-center justify-between gap-2">
        <Button variant="ghost" onClick={onBack} disabled={currentStep === 0} leftIcon={<ArrowLeft className="h-4 w-4" />}>
          Предыдущий шаг
        </Button>

        {!isLast ? (
          <Button onClick={onNext} rightIcon={<ArrowRight className="h-4 w-4" />}>
            Следующий шаг
          </Button>
        ) : (
          <Button onClick={onBackToScenarios} leftIcon={<CheckCircle2 className="h-4 w-4" />}>
            К списку сценариев
          </Button>
        )}
      </div>
    </div>
  );
}
