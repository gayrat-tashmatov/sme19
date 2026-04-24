'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  UserPlus, Users2, Calculator, FileText, Download, Award, AlertCircle,
  CheckCircle2, Sparkles, ArrowRight, ExternalLink, Info, Baby, Plane, Heart,
  Briefcase, GraduationCap,
} from 'lucide-react';
import { Card, CardTitle, CardDescription } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { PhaseRoadmapStrip } from '@/components/sections/PhaseRoadmapStrip';

// ═══════════════════════════════════════════════════════════════════
// Sprint 7 · N_HR — HR and Employment
// Hiring checklist · salary calculator (ESP + PIT) · document templates ·
// youth subsidies · leave/sickness calculator
// ═══════════════════════════════════════════════════════════════════

interface HiringStep {
  order: number;
  title: string;
  duration: string;
  details: string;
  docs: string[];
  Icon: typeof UserPlus;
}

const HIRING_STEPS: HiringStep[] = [
  {
    order: 1,
    title: 'Предложение и согласование условий',
    duration: '1–3 дня',
    details: 'Обсудите условия: зарплата gross/net, испытательный срок, график, место работы, социальный пакет.',
    docs: ['Оффер-письмо (опционально)'],
    Icon: UserPlus,
  },
  {
    order: 2,
    title: 'Запрос документов у кандидата',
    duration: '1 день',
    details: 'Паспорт, ИНН, СНИЛС (ПФИЛС), трудовая книжка / справка с прошлого места, военный билет, диплом.',
    docs: ['Копии документов', 'Фото 3×4'],
    Icon: FileText,
  },
  {
    order: 3,
    title: 'Подписание трудового договора',
    duration: '1 день',
    details: 'Бессрочный / срочный (до 5 лет) / срочный проектный. Обязательные поля: должность, оклад, условия труда, срок договора.',
    docs: ['Трудовой договор (2 экз.)', 'Договор о материальной ответственности (если нужен)'],
    Icon: FileText,
  },
  {
    order: 4,
    title: 'Приказ о приёме на работу',
    duration: '1 день',
    details: 'Издаётся в день начала работы. Знакомьте сотрудника под роспись. Копия — в личное дело.',
    docs: ['Приказ о приёме', 'Должностная инструкция'],
    Icon: Briefcase,
  },
  {
    order: 5,
    title: 'Регистрация в Soliq',
    duration: 'автоматически',
    details: 'Происходит автоматически при подаче ежемесячного расчёта ЕСП (до 30-го числа следующего месяца).',
    docs: ['Расчёт ЕСП (электронно через my3.soliq.uz)'],
    Icon: CheckCircle2,
  },
  {
    order: 6,
    title: 'Инструктаж по охране труда',
    duration: '1 день',
    details: 'Вводный + первичный на рабочем месте. Обязательно для всех сотрудников, включая офисных.',
    docs: ['Журналы инструктажей', 'Программы вводного + первичного инструктажа'],
    Icon: AlertCircle,
  },
  {
    order: 7,
    title: 'Открытие зарплатной карты',
    duration: '1–3 дня',
    details: 'Зарплата перечисляется безналично на карту сотрудника. Многие банки открывают бесплатно в рамках корпоративного обслуживания.',
    docs: ['Справка с места работы для банка', 'Заявление на открытие карты'],
    Icon: UserPlus,
  },
  {
    order: 8,
    title: 'Первая выплата зарплаты',
    duration: 'до 15-го числа след. месяца',
    details: 'Расчёт: оклад − подоходный 12% − обязательные отчисления работника. ЕСП работодателя платится отдельно в ГНК.',
    docs: ['Табель учёта рабочего времени', 'Расчётная ведомость'],
    Icon: Calculator,
  },
];

// ─── Salary calculator logic ────────────────────────────────────
// Illustrative rates — verify with Tax Code
// Worker: PIT 12% withheld; ESP INPS (накопительная) 1%
// Employer: ESP 25% (includes pension, social, medical)
interface SalaryBreakdown {
  gross: number;
  pitWithheld: number;       // 12% PIT (worker side)
  inpsWithheld: number;      // 1% INPS pension (worker side, mandatory)
  netToEmployee: number;     // what worker actually receives
  espEmployer: number;       // 25% ESP (employer side)
  totalEmployerCost: number; // gross + esp
  effectiveTaxRate: number;  // total taxes / total cost
}

function calcSalary(gross: number, isItPark: boolean): SalaryBreakdown {
  const pitRate  = isItPark ? 0 : 0.12;      // IT Park: 0% PIT
  const espRate  = isItPark ? 0.075 : 0.25;  // IT Park: 7.5% ESP
  const inpsRate = 0.01;

  const pitWithheld  = gross * pitRate;
  const inpsWithheld = gross * inpsRate;
  const netToEmployee = gross - pitWithheld - inpsWithheld;
  const espEmployer  = gross * espRate;
  const totalEmployerCost = gross + espEmployer;
  const totalTaxes = pitWithheld + inpsWithheld + espEmployer;
  const effectiveTaxRate = totalTaxes / totalEmployerCost;

  return { gross, pitWithheld, inpsWithheld, netToEmployee, espEmployer, totalEmployerCost, effectiveTaxRate };
}

// ─── Document templates ─────────────────────────────────────────
interface Template {
  title: string;
  description: string;
  formatNote: string;
  category: 'contracts' | 'orders' | 'attestations' | 'leave' | 'termination';
}

const TEMPLATES: Template[] = [
  { title: 'Трудовой договор (бессрочный)',         description: 'Типовой бессрочный договор для большинства должностей', formatNote: 'DOC · 4 стр.',  category: 'contracts' },
  { title: 'Срочный трудовой договор',                description: 'Для проектной работы или замещения',                     formatNote: 'DOC · 3 стр.',  category: 'contracts' },
  { title: 'Договор о материальной ответственности',  description: 'Для работников с доступом к товарам/деньгам',            formatNote: 'DOC · 2 стр.',  category: 'contracts' },
  { title: 'Приказ о приёме на работу',                description: 'Форма Т-1, заполненная',                                 formatNote: 'DOC · 1 стр.',  category: 'orders' },
  { title: 'Приказ об увольнении',                     description: 'С указанием основания по ТК',                            formatNote: 'DOC · 1 стр.',  category: 'orders' },
  { title: 'Должностная инструкция · менеджер',        description: 'Универсальный шаблон, адаптируется под отделы',         formatNote: 'DOC · 2 стр.',  category: 'orders' },
  { title: 'Заявление на отпуск',                      description: 'Стандартная форма 14+ дней',                             formatNote: 'DOC · 1 стр.',  category: 'leave' },
  { title: 'Заявление на декретный отпуск',            description: 'Отпуск по беременности и родам + по уходу за ребёнком', formatNote: 'DOC · 2 стр.',  category: 'leave' },
  { title: 'Аттестационный лист сотрудника',           description: 'Для ежегодной оценки',                                    formatNote: 'DOC · 3 стр.',  category: 'attestations' },
  { title: 'Акт об увольнении (дисциплинарном)',       description: 'С перечнем нарушений и протоколом',                      formatNote: 'DOC · 2 стр.',  category: 'termination' },
];

const TEMPLATE_CATEGORIES: Record<Template['category'], { label: string; color: string }> = {
  contracts:    { label: 'Договоры',          color: 'bg-gold/10 text-gold' },
  orders:       { label: 'Приказы и инструкции', color: 'bg-secondary/10 text-secondary' },
  attestations: { label: 'Аттестация',         color: 'bg-success/10 text-success' },
  leave:        { label: 'Отпуска',           color: 'bg-navy/10 text-navy' },
  termination:  { label: 'Увольнение',        color: 'bg-danger/10 text-danger' },
};

// ─── Youth subsidies ────────────────────────────────────────────
interface Subsidy {
  id: string;
  title: string;
  amount: string;
  conditions: string[];
  operator: string;
}

const SUBSIDIES: Subsidy[] = [
  {
    id: 'M009',
    title: 'Субсидия на создание рабочих мест для молодёжи',
    amount: 'до 10 млн сум / место',
    conditions: [
      'Трудоустройство молодёжи 18–30 лет из семей «железной тетради»',
      'Срочный или бессрочный трудовой договор от 12 мес',
      'Официальная зарплата не ниже МРОТ',
    ],
    operator: 'МЭФ + Министерство занятости',
  },
  {
    id: 'M011',
    title: 'Компенсация обучения сотрудников по профдисциплинам',
    amount: '30% стоимости обучения',
    conditions: [
      'Программа из аккредитованного перечня Министерства занятости',
      'Минимум 40 часов академического времени',
      'Сертификат по завершении',
    ],
    operator: 'Министерство занятости',
  },
  {
    id: 'M013',
    title: 'Субсидия на рабочие места для людей с инвалидностью',
    amount: 'до 15 млн сум / место',
    conditions: [
      'Адаптация рабочего места под ОВЗ',
      'Бессрочный трудовой договор',
      'Официальная зарплата не ниже 1.5 МРОТ',
    ],
    operator: 'Министерство занятости',
  },
];

function formatUzs(v: number): string {
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(2)} млн сум`;
  if (v >= 1_000)     return `${(v / 1_000).toFixed(0)} тыс сум`;
  return v.toLocaleString('ru') + ' сум';
}

export function N_HR() {
  const [grossSalary, setGrossSalary] = useState(6_000_000);
  const [isItPark, setIsItPark] = useState(false);
  const calc = useMemo(() => calcSalary(grossSalary, isItPark), [grossSalary, isItPark]);

  return (
    <section className="container-wide py-10 md:py-14 space-y-8">
      {/* Hero */}
      <Card padding="lg" tone="navy" className="text-white relative overflow-hidden">
        <div className="absolute inset-0 pattern-dots opacity-30 pointer-events-none" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <Badge variant="new">NEW · ч. жизненного цикла</Badge>
            <span className="text-xs uppercase tracking-wider text-gold-light">Этап 6 · Найм сотрудников</span>
          </div>
          <h2 className="font-serif text-2xl md:text-3xl text-white mb-2 leading-tight">
            Кадры и трудоустройство — от приёма до увольнения
          </h2>
          <p className="text-white/75 max-w-3xl text-sm leading-relaxed">
            Чек-лист найма за 8 шагов, калькулятор стоимости сотрудника, 10+ шаблонов трудовых договоров,
            приказов, заявлений. Субсидии на создание рабочих мест для молодёжи и людей с ОВЗ. Льготы для резидентов IT-парка.
          </p>
        </div>
      </Card>

      <PhaseRoadmapStrip
        embedded
        currentPhase={2}
        points={[
          { phase: 2, text: 'Чек-лист найма за 8 шагов с документами и сроками' },
          { phase: 2, text: 'Калькулятор стоимости сотрудника (gross, net, ЕСП, эффективная ставка)' },
          { phase: 2, text: '10+ шаблонов договоров и приказов (DOC, готовы к заполнению)' },
          { phase: 2, text: '3 субсидии на создание рабочих мест с условиями и ссылками на операторов' },
          { phase: 2, text: 'Гайды по сложным случаям: увольнение, декрет, совместительство, дистанционка' },
          { phase: 3, text: 'Интеграция с Soliq и boom.uz через МИП — автоматическое оформление', blockedBy: 'кибер-экспертиза' },
          { phase: 3, text: 'Электронная подпись трудовых документов через OneID (вместо бумажного)' },
          { phase: 4, text: 'HR-ассистент: проверка договоров на соответствие Трудовому кодексу' },
        ]}
      />

      {/* ─── Hiring checklist ─── */}
      <Card padding="lg">
        <div className="flex items-start gap-3 mb-5">
          <div className="h-11 w-11 rounded-xl bg-gold/15 text-gold flex items-center justify-center shrink-0">
            <UserPlus className="h-5 w-5" />
          </div>
          <div>
            <CardTitle>Чек-лист приёма сотрудника на работу</CardTitle>
            <CardDescription className="mt-0.5">
              8 последовательных шагов от оффера до первой зарплаты. Общее время — 5–10 рабочих дней.
            </CardDescription>
          </div>
        </div>

        <div className="space-y-3">
          {HIRING_STEPS.map((s, i) => (
            <motion.div
              key={s.order}
              initial={{ opacity: 0, x: -8 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.3, delay: i * 0.04 }}
              className="p-4 rounded-xl border border-ink-line bg-bg-white flex items-start gap-4"
            >
              <div className="h-10 w-10 rounded-lg bg-gold/10 text-gold flex items-center justify-center shrink-0 font-serif font-bold">
                {s.order}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <div className="font-serif font-semibold text-ink text-[15px]">{s.title}</div>
                  <Badge variant="outline">{s.duration}</Badge>
                </div>
                <div className="text-[13px] text-ink-soft leading-relaxed">{s.details}</div>
                {s.docs.length > 0 && (
                  <div className="mt-2.5 flex items-start gap-1.5 flex-wrap">
                    <span className="text-[11px] uppercase tracking-wider text-ink-muted font-semibold">
                      Документы:
                    </span>
                    {s.docs.map((d, di) => (
                      <span key={di} className="text-[11.5px] text-gold">
                        {d}{di < s.docs.length - 1 ? ',' : ''}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* ─── Salary calculator ─── */}
      <Card padding="lg">
        <div className="flex items-start gap-3 mb-5">
          <div className="h-11 w-11 rounded-xl bg-secondary/15 text-secondary flex items-center justify-center shrink-0">
            <Calculator className="h-5 w-5" />
          </div>
          <div>
            <CardTitle>Калькулятор стоимости сотрудника</CardTitle>
            <CardDescription className="mt-0.5">
              Введите оклад gross — увидите итоговую стоимость для работодателя, сумму на руки сотруднику и налоговые отчисления.
            </CardDescription>
          </div>
        </div>

        <div className="grid lg:grid-cols-[1fr_1.2fr] gap-5">
          {/* Input side */}
          <div className="space-y-4">
            <Input
              type="number"
              label="Оклад сотрудника (gross), сум/мес"
              value={grossSalary}
              onChange={(e) => setGrossSalary(Number(e.target.value))}
              leftIcon={<Briefcase className="h-4 w-4" />}
            />
            <div className="text-[11px] text-ink-muted -mt-2">
              Сейчас: {formatUzs(grossSalary)} / мес
            </div>

            <label className="flex items-center gap-2 p-3 rounded-lg border border-ink-line bg-bg-white cursor-pointer">
              <input
                type="checkbox"
                checked={isItPark}
                onChange={(e) => setIsItPark(e.target.checked)}
                className="h-4 w-4 rounded border-ink-line text-gold focus:ring-gold/30"
              />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-ink">Резидент IT-парка</div>
                <div className="text-[11px] text-ink-muted">0% подоходного + 7.5% ЕСП вместо 25%</div>
              </div>
              <Badge variant={isItPark ? 'success' : 'outline'}>{isItPark ? 'да' : 'нет'}</Badge>
            </label>

            <div className="p-3 rounded-lg bg-secondary/5 border border-secondary/20 text-[12px] text-ink-soft flex items-start gap-2">
              <Info className="h-3.5 w-3.5 text-secondary shrink-0 mt-0.5" />
              <span>
                Ставки: ЕСП 25% (работодатель), ПИТ 12% (с работника), ИНПС 1% (с работника).
                Для резидентов IT-парка до 2028 года — 0% ПИТ + 7.5% ЕСП. Окончательные ставки — в Налоговом кодексе.
              </span>
            </div>
          </div>

          {/* Result side */}
          <div className="space-y-3">
            <div className="p-4 rounded-xl border-2 border-gold/30 bg-gold-soft/30">
              <div className="text-[10px] uppercase tracking-wider text-gold-dark font-semibold mb-1">
                Итоговая стоимость работодателя
              </div>
              <div className="font-serif text-3xl font-bold text-navy">
                {formatUzs(calc.totalEmployerCost)}
              </div>
              <div className="text-[11px] text-ink-muted mt-0.5">
                За год: {formatUzs(calc.totalEmployerCost * 12)}
              </div>
            </div>

            <div className="p-4 rounded-xl border-2 border-success/30 bg-success/5">
              <div className="text-[10px] uppercase tracking-wider text-success font-semibold mb-1">
                Сотрудник на руки
              </div>
              <div className="font-serif text-2xl font-bold text-success">
                {formatUzs(calc.netToEmployee)}
              </div>
              <div className="text-[11px] text-ink-muted mt-0.5">
                {((calc.netToEmployee / calc.gross) * 100).toFixed(1)}% от gross
              </div>
            </div>

            <div className="p-3 rounded-lg border border-ink-line bg-bg-band/40 space-y-1.5">
              <BreakdownLine label="Gross оклад"                 value={calc.gross} />
              <BreakdownLine label="− ПИТ 12% (удерживается)"    value={-calc.pitWithheld} />
              <BreakdownLine label="− ИНПС 1% (удерживается)"    value={-calc.inpsWithheld} />
              <BreakdownLine label="+ ЕСП 25% работодателя"       value={calc.espEmployer} emphasised />
              <div className="pt-1.5 border-t border-ink-line/60 flex items-center justify-between text-[12px]">
                <span className="text-ink-muted">Эффективная налоговая нагрузка</span>
                <span className="font-mono font-semibold text-gold">
                  {(calc.effectiveTaxRate * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* ─── Templates ─── */}
      <Card padding="lg">
        <div className="flex items-start justify-between gap-3 mb-5 flex-wrap">
          <div className="flex items-start gap-3">
            <div className="h-11 w-11 rounded-xl bg-success/15 text-success flex items-center justify-center shrink-0">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <CardTitle>Шаблоны документов</CardTitle>
              <CardDescription className="mt-0.5">
                Готовые к заполнению DOC-шаблоны. В Ф3 — автозаполнение данными из цифрового профиля и E-Imzo.
              </CardDescription>
            </div>
          </div>
          <Button leftIcon={<Download className="h-4 w-4" />}>Скачать все (ZIP)</Button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
          {TEMPLATES.map((t, i) => {
            const cat = TEMPLATE_CATEGORIES[t.category];
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.25, delay: i * 0.03 }}
              >
                <div className="p-3 rounded-lg border border-ink-line bg-bg-white hover:border-gold/40 transition-all h-full flex flex-col">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className={`text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-md ${cat.color}`}>
                      {cat.label}
                    </span>
                    <span className="text-[10px] text-ink-muted font-mono">{t.formatNote}</span>
                  </div>
                  <div className="text-sm font-medium text-ink leading-tight">{t.title}</div>
                  <div className="text-[12px] text-ink-muted mt-1 leading-snug flex-1">{t.description}</div>
                  <button className="mt-2.5 text-xs text-gold hover:text-gold-dark font-medium flex items-center gap-1">
                    <Download className="h-3 w-3" />
                    Скачать
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </Card>

      {/* ─── Youth/OVZ subsidies ─── */}
      <Card padding="lg" className="border-gold/25 bg-gold-soft/20">
        <div className="flex items-start gap-3 mb-5">
          <div className="h-11 w-11 rounded-xl bg-gold text-white flex items-center justify-center shrink-0">
            <Award className="h-5 w-5" />
          </div>
          <div>
            <CardTitle>Субсидии на создание рабочих мест</CardTitle>
            <CardDescription className="mt-0.5">
              Государственные меры для работодателей, трудоустраивающих молодёжь, людей с ОВЗ, из уязвимых категорий.
            </CardDescription>
          </div>
        </div>

        <div className="space-y-3">
          {SUBSIDIES.map((s) => (
            <div key={s.id} className="p-4 rounded-xl border border-gold/25 bg-bg-white">
              <div className="flex items-start justify-between gap-3 mb-2 flex-wrap">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-mono text-ink-muted uppercase">{s.id}</span>
                    <div className="font-serif font-semibold text-ink text-[15px]">{s.title}</div>
                  </div>
                  <div className="text-[11px] text-ink-muted mt-0.5">Оператор: {s.operator}</div>
                </div>
                <Badge variant="priority-solid">{s.amount}</Badge>
              </div>
              <ul className="space-y-1 mt-2">
                {s.conditions.map((c, ci) => (
                  <li key={ci} className="text-[12.5px] text-ink-soft flex items-start gap-1.5">
                    <CheckCircle2 className="h-3 w-3 text-success shrink-0 mt-0.5" />
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-3 pt-3 border-t border-ink-line/60 flex items-center justify-between">
                <span className="text-[11px] text-ink-muted">Подробнее в реестре мер поддержки</span>
                <Link
                  href={`/modules/registry?measure=${s.id}`}
                  className="text-xs text-gold hover:text-gold-dark font-medium inline-flex items-center gap-1"
                >
                  Открыть в реестре <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* ─── Leave types quick reference ─── */}
      <Card padding="lg">
        <div className="flex items-start gap-3 mb-5">
          <div className="h-11 w-11 rounded-xl bg-secondary/15 text-secondary flex items-center justify-center shrink-0">
            <Plane className="h-5 w-5" />
          </div>
          <div>
            <CardTitle>Виды отпусков — быстрый справочник</CardTitle>
            <CardDescription className="mt-0.5">
              Основные виды отпусков и их длительность по Трудовому кодексу РУз.
            </CardDescription>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <LeaveCard Icon={Plane}         title="Ежегодный основной"      duration="15 раб. дней" note="+ дополнительный за вредность или стаж" />
          <LeaveCard Icon={Baby}          title="По беременности и родам" duration="126 дней"      note="70 до + 56 после; оплачивается ФСС" />
          <LeaveCard Icon={Heart}         title="По уходу за ребёнком"     duration="до 3 лет"      note="сохраняется место, частичная оплата до 2 лет" />
          <LeaveCard Icon={GraduationCap} title="Учебный"                  duration="до 40 дней"   note="для аттестации в аккредитованных вузах" />
        </div>
      </Card>

      {/* Footer callout with cross-links */}
      <Card padding="lg" className="border-success/25 bg-success/[0.03]">
        <div className="flex items-start gap-4 flex-wrap">
          <div className="h-10 w-10 rounded-lg bg-success/10 text-success flex items-center justify-center shrink-0">
            <Sparkles className="h-5 w-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-serif font-semibold text-ink">Связано с другими модулями</div>
            <CardDescription className="mt-1">
              Найм — один из ключевых этапов роста. Связан с налогами (ЕСП), льготами (субсидии), ростом (масштабирование команды).
            </CardDescription>
            <div className="mt-3 grid sm:grid-cols-3 gap-2">
              <Link href="/modules/nTax" className="text-xs text-gold hover:text-gold-dark inline-flex items-center gap-1">
                Налоги · ЕСП и ПИТ <ArrowRight className="h-3 w-3" />
              </Link>
              <Link href="/modules/registry?category=non-financial" className="text-xs text-gold hover:text-gold-dark inline-flex items-center gap-1">
                Нефинансовые меры поддержки <ArrowRight className="h-3 w-3" />
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

function BreakdownLine({ label, value, emphasised = false }: { label: string; value: number; emphasised?: boolean }) {
  const isNegative = value < 0;
  return (
    <div className="flex items-center justify-between gap-3 text-[12.5px]">
      <span className="text-ink-soft">{label}</span>
      <span className={`font-mono font-semibold ${
        emphasised ? 'text-gold' : isNegative ? 'text-danger' : 'text-ink'
      }`}>
        {isNegative ? '−' : ''}{formatUzs(Math.abs(value))}
      </span>
    </div>
  );
}

function LeaveCard({ Icon, title, duration, note }: {
  Icon: typeof Plane; title: string; duration: string; note: string;
}) {
  return (
    <div className="p-3 rounded-lg border border-ink-line bg-bg-white">
      <div className="h-8 w-8 rounded-lg bg-secondary/10 text-secondary flex items-center justify-center mb-2">
        <Icon className="h-4 w-4" />
      </div>
      <div className="text-sm font-medium text-ink leading-tight">{title}</div>
      <div className="font-serif text-[15px] text-gold font-semibold mt-1">{duration}</div>
      <div className="text-[11px] text-ink-muted mt-1.5 leading-snug">{note}</div>
    </div>
  );
}
