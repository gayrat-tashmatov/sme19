'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ShieldCheck, User, UserCheck, UserPlus, Building2, Crown, Map, Trophy, Home,
  ArrowRight, CheckCircle2, Eye, Pencil, Lock, Sparkles, Users2,
} from 'lucide-react';
import { Card, CardTitle, CardDescription } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

// ════════════════════════════════════════════════════════════════════
//  Role × Module access matrix — Sprint 1 architecture artefact.
//  Purpose: give IT-developer an explicit RACI-like grid of what each
//  role can do in each module. Four access levels: none / view / interact / admin.
// ════════════════════════════════════════════════════════════════════

type AccessLevel = 'none' | 'view' | 'interact' | 'admin';

interface RoleDef {
  id: string;
  name: string;
  nameUz: string;
  auth: string;
  Icon: typeof User;
  active: boolean;
  description: string;
}

interface ModuleRow {
  slug: string;
  label: string;
  group: 'priority' | 'new-priority' | 'queue' | 'new-queue' | 'cross';
  access: Record<string, AccessLevel>;
}

const ROLES: RoleDef[] = [
  {
    id: 'guest',
    name: 'Гость',
    nameUz: 'Mehmon',
    auth: 'без OneID',
    Icon: User,
    active: true,
    description: 'Без авторизации. Доступ к публичным материалам — реестр мер, новости, гайды, карта регионов без персонализации.',
  },
  {
    id: 'futureEnt',
    name: 'Будущий предприниматель',
    nameUz: 'Kelajak tadbirkor',
    auth: 'OneID (физ. лицо без ИНН)',
    Icon: UserPlus,
    active: false,
    description: 'Физическое лицо, рассматривающее открытие бизнеса. Видит гайды, опросники зрелости, справочники. Не имеет цифрового профиля МСБ.',
  },
  {
    id: 'entrepreneur',
    name: 'Предприниматель',
    nameUz: 'Tadbirkor',
    auth: 'OneID + ИНН (ФЛ/ЮЛ)',
    Icon: UserCheck,
    active: true,
    description: 'ИП/ООО/семейное предприятие/кооператив. Полный личный кабинет: профиль, заявки на меры, обращения в ведомства, отчётность-зеркало.',
  },
  {
    id: 'champion',
    name: 'Чемпион',
    nameUz: 'Chempion',
    auth: 'OneID + ИНН + метка МЭФ',
    Icon: Trophy,
    active: false,
    description: 'Надстройка над ролью «Предприниматель». Дополнительно: закрытый канал с региональным МЭФ, приоритетный доступ к программам МФИ.',
  },
  {
    id: 'agency',
    name: 'Сотрудник ведомства',
    nameUz: 'Vazirlik xodimi',
    auth: 'OneID + ИНН организации',
    Icon: Building2,
    active: true,
    description: 'Ответственный сотрудник министерства или ведомства. Отвечает на обращения B2G, управляет своими мерами поддержки.',
  },
  {
    id: 'hokimAsst',
    name: 'Помощник хокима',
    nameUz: 'Hokim yordamchisi',
    auth: 'через «Онлайн-махалля» API',
    Icon: Map,
    active: false,
    description: 'Махалля-уровень. НЕ регистрируется напрямую в Платформе — подтягивается через API «Онлайн-махалля» (Фаза 3).',
  },
  {
    id: 'regionalMef',
    name: 'Региональный МЭФ',
    nameUz: 'Mintaqaviy IMV',
    auth: 'OneID + ИНН + доступ МЭФ',
    Icon: ShieldCheck,
    active: true,
    description: 'Взаимодействует с хокимиятом в одной из 14 областей. Ведёт паспорта районов, выдвигает чемпионов, маршрутизирует B2G, управляет региональными мерами.',
  },
  {
    id: 'mef',
    name: 'МЭФ · админ',
    nameUz: 'IMV · administrator',
    auth: 'OneID + ИНН МЭФ',
    Icon: Crown,
    active: true,
    description: 'Глобальный администратор Платформы. Модерация контента, управление справочниками, настройка ролей, публикация новостей.',
  },
  {
    id: 'mefAnalyst',
    name: 'МЭФ · аналитик',
    nameUz: 'IMV · tahlilchi',
    auth: 'OneID + расширенные права',
    Icon: Sparkles,
    active: false,
    description: 'Доступ к backend BI-инструменту: дашборды по регионам, отраслям, мерам. Экспорт данных для Policy Making. Без доступа к операциям.',
  },
];

const MODULES: ModuleRow[] = [
  // Priority 6
  { slug: 'comms',     label: 'а · B2B/B2G коммуникация',         group: 'priority',
    access: { guest: 'view', futureEnt: 'view', entrepreneur: 'interact', champion: 'interact', agency: 'admin', hokimAsst: 'none', regionalMef: 'admin', mef: 'admin', mefAnalyst: 'view' } },
  { slug: 'registry',  label: 'б · Реестр мер поддержки',         group: 'priority',
    access: { guest: 'view', futureEnt: 'view', entrepreneur: 'interact', champion: 'interact', agency: 'admin', hokimAsst: 'view', regionalMef: 'admin', mef: 'admin', mefAnalyst: 'view' } },
  { slug: 'ecommerce', label: 'в · E-commerce',                   group: 'priority',
    access: { guest: 'view', futureEnt: 'view', entrepreneur: 'interact', champion: 'interact', agency: 'view',  hokimAsst: 'none', regionalMef: 'view',  mef: 'admin', mefAnalyst: 'view' } },
  { slug: 'info',      label: 'г · Бизнес-информация',            group: 'priority',
    access: { guest: 'view', futureEnt: 'view', entrepreneur: 'view',     champion: 'view',    agency: 'view',  hokimAsst: 'view', regionalMef: 'view',  mef: 'admin', mefAnalyst: 'view' } },
  { slug: 'geo',       label: 'д · Геоаналитика',                 group: 'priority',
    access: { guest: 'view', futureEnt: 'view', entrepreneur: 'interact', champion: 'interact', agency: 'view',  hokimAsst: 'admin', regionalMef: 'admin', mef: 'admin', mefAnalyst: 'view' } },
  { slug: 'maturity',  label: 'е · Оценка зрелости',              group: 'priority',
    access: { guest: 'view', futureEnt: 'interact', entrepreneur: 'interact', champion: 'interact', agency: 'none', hokimAsst: 'none', regionalMef: 'view',  mef: 'admin', mefAnalyst: 'view' } },

  // New priority 2
  { slug: 'nCheck',    label: 'NEW · Проверка контрагента',       group: 'new-priority',
    access: { guest: 'view', futureEnt: 'view', entrepreneur: 'interact', champion: 'interact', agency: 'view',  hokimAsst: 'none', regionalMef: 'view',  mef: 'admin', mefAnalyst: 'view' } },
  { slug: 'nPath',     label: 'NEW · Гайды для предпринимателей (Pathways + Guide)', group: 'new-priority',
    access: { guest: 'view', futureEnt: 'interact', entrepreneur: 'view', champion: 'view',    agency: 'none', hokimAsst: 'none', regionalMef: 'view',  mef: 'admin', mefAnalyst: 'view' } },

  // Queue 8
  { slug: 'qReg',      label: 'Цифровой профиль бизнеса',         group: 'queue',
    access: { guest: 'none', futureEnt: 'none', entrepreneur: 'view',     champion: 'view',    agency: 'view',  hokimAsst: 'none', regionalMef: 'view',  mef: 'admin', mefAnalyst: 'view' } },
  { slug: 'qBiz',      label: 'Регистрация бизнеса',              group: 'queue',
    access: { guest: 'view', futureEnt: 'interact', entrepreneur: 'view', champion: 'view',    agency: 'none', hokimAsst: 'none', regionalMef: 'view',  mef: 'admin', mefAnalyst: 'view' } },
  { slug: 'qRep',      label: 'Сдача отчётности (зеркало)',       group: 'queue',
    access: { guest: 'none', futureEnt: 'none', entrepreneur: 'interact', champion: 'interact', agency: 'view', hokimAsst: 'none', regionalMef: 'none',  mef: 'view',  mefAnalyst: 'view' } },
  { slug: 'qWF',       label: 'Расширенный workflow мер',         group: 'queue',
    access: { guest: 'none', futureEnt: 'none', entrepreneur: 'interact', champion: 'interact', agency: 'admin', hokimAsst: 'none', regionalMef: 'admin', mef: 'admin', mefAnalyst: 'view' } },
  { slug: 'qInf',      label: 'Подключение к инфраструктуре',     group: 'queue',
    access: { guest: 'view', futureEnt: 'view', entrepreneur: 'interact', champion: 'interact', agency: 'none', hokimAsst: 'none', regionalMef: 'view',  mef: 'admin', mefAnalyst: 'view' } },
  { slug: 'qNews',     label: 'Новости и НПА',                    group: 'queue',
    access: { guest: 'view', futureEnt: 'view', entrepreneur: 'view',     champion: 'view',    agency: 'view',  hokimAsst: 'view', regionalMef: 'view',  mef: 'admin', mefAnalyst: 'view' } },
  { slug: 'qChamp',    label: 'Чемпионы предпринимательства',     group: 'queue',
    access: { guest: 'view', futureEnt: 'view', entrepreneur: 'view',     champion: 'view',    agency: 'view',  hokimAsst: 'none', regionalMef: 'admin', mef: 'admin', mefAnalyst: 'view' } },
  { slug: 'qClose',    label: 'Регистрация прекращения',          group: 'queue',
    access: { guest: 'view', futureEnt: 'none', entrepreneur: 'interact', champion: 'interact', agency: 'view',  hokimAsst: 'none', regionalMef: 'view',  mef: 'admin', mefAnalyst: 'view' } },

  // New queue 4
  { slug: 'nStartup',  label: 'NEW · Стартап-гайд',               group: 'new-queue',
    access: { guest: 'view', futureEnt: 'interact', entrepreneur: 'interact', champion: 'view', agency: 'none', hokimAsst: 'none', regionalMef: 'view',  mef: 'admin', mefAnalyst: 'view' } },
  { slug: 'nProcure',  label: 'NEW · Госзакупки',                 group: 'new-queue',
    access: { guest: 'view', futureEnt: 'view', entrepreneur: 'interact', champion: 'interact', agency: 'admin', hokimAsst: 'none', regionalMef: 'view',  mef: 'admin', mefAnalyst: 'view' } },
  { slug: 'nLearn',    label: 'NEW · Обучающий центр (LMS)',      group: 'new-queue',
    access: { guest: 'view', futureEnt: 'interact', entrepreneur: 'interact', champion: 'interact', agency: 'view', hokimAsst: 'none', regionalMef: 'view', mef: 'admin', mefAnalyst: 'view' } },

  // Sprint 7 · Lifecycle navigator + 6 thematic modules
  { slug: 'nLifecycle', label: 'NEW · Жизненный цикл бизнеса (навигатор)', group: 'new-queue',
    access: { guest: 'view', futureEnt: 'interact', entrepreneur: 'interact', champion: 'view', agency: 'view', hokimAsst: 'view', regionalMef: 'view', mef: 'admin', mefAnalyst: 'view' } },
  { slug: 'nTax',      label: 'NEW · Налоги для МСБ',             group: 'new-queue',
    access: { guest: 'view', futureEnt: 'interact', entrepreneur: 'interact', champion: 'view', agency: 'view', hokimAsst: 'none', regionalMef: 'view', mef: 'admin', mefAnalyst: 'view' } },
  { slug: 'nCredit',   label: 'NEW · Кредитный навигатор',        group: 'new-queue',
    access: { guest: 'view', futureEnt: 'interact', entrepreneur: 'interact', champion: 'view', agency: 'view', hokimAsst: 'none', regionalMef: 'view', mef: 'admin', mefAnalyst: 'view' } },
  { slug: 'nSales',    label: 'NEW · Каналы сбыта',               group: 'new-queue',
    access: { guest: 'view', futureEnt: 'view', entrepreneur: 'interact', champion: 'view', agency: 'view', hokimAsst: 'none', regionalMef: 'view', mef: 'admin', mefAnalyst: 'view' } },
  { slug: 'nExport',   label: 'NEW · Экспортный навигатор',       group: 'new-queue',
    access: { guest: 'view', futureEnt: 'view', entrepreneur: 'interact', champion: 'view', agency: 'view', hokimAsst: 'none', regionalMef: 'view', mef: 'admin', mefAnalyst: 'view' } },
  { slug: 'nHR',       label: 'NEW · Кадры и трудоустройство',    group: 'new-queue',
    access: { guest: 'view', futureEnt: 'view', entrepreneur: 'interact', champion: 'view', agency: 'view', hokimAsst: 'none', regionalMef: 'view', mef: 'admin', mefAnalyst: 'view' } },
  { slug: 'nIP',       label: 'NEW · Интеллектуальная собственность', group: 'new-queue',
    access: { guest: 'view', futureEnt: 'interact', entrepreneur: 'interact', champion: 'interact', agency: 'view', hokimAsst: 'none', regionalMef: 'view', mef: 'admin', mefAnalyst: 'view' } },

  // Cross-cutting functions
  { slug: 'auth',      label: '◇ OneID авторизация',              group: 'cross',
    access: { guest: 'view', futureEnt: 'interact', entrepreneur: 'interact', champion: 'interact', agency: 'interact', hokimAsst: 'view', regionalMef: 'interact', mef: 'admin', mefAnalyst: 'interact' } },
  { slug: 'cabinet',   label: '◇ Личный кабинет',                 group: 'cross',
    access: { guest: 'view', futureEnt: 'interact', entrepreneur: 'admin',    champion: 'admin',    agency: 'admin', hokimAsst: 'none', regionalMef: 'admin',   mef: 'admin', mefAnalyst: 'admin' } },
  { slug: 'notify',    label: '◇ Уведомления (SMS/TG/push)',      group: 'cross',
    access: { guest: 'none', futureEnt: 'interact', entrepreneur: 'interact', champion: 'interact', agency: 'interact', hokimAsst: 'none', regionalMef: 'interact', mef: 'admin', mefAnalyst: 'view' } },
  { slug: 'ai',        label: '◇ AI-ассистент',                   group: 'cross',
    access: { guest: 'interact', futureEnt: 'interact', entrepreneur: 'interact', champion: 'interact', agency: 'interact', hokimAsst: 'none', regionalMef: 'interact', mef: 'admin', mefAnalyst: 'interact' } },
  { slug: 'bi',        label: '◇ Backend BI · Policy Making',     group: 'cross',
    access: { guest: 'none', futureEnt: 'none', entrepreneur: 'none', champion: 'none', agency: 'none', hokimAsst: 'none', regionalMef: 'view', mef: 'view', mefAnalyst: 'admin' } },
];

const ACCESS_META: Record<AccessLevel, { label: string; color: string; Icon: typeof Eye }> = {
  none:      { label: 'Нет доступа',           color: 'bg-ink-line text-ink-muted',     Icon: Lock },
  view:      { label: 'Просмотр',              color: 'bg-secondary/15 text-secondary', Icon: Eye },
  interact:  { label: 'Просмотр + действия',    color: 'bg-gold/15 text-gold-dark',      Icon: Pencil },
  admin:     { label: 'Полные права',          color: 'bg-success/15 text-success',     Icon: CheckCircle2 },
};

const GROUP_META: Record<ModuleRow['group'], { label: string; tone: string }> = {
  priority:       { label: 'Приоритет УП-50 · до 01.07.2026', tone: 'text-gold' },
  'new-priority': { label: 'NEW · приоритетные (бенчмарки)',  tone: 'text-gold' },
  queue:          { label: 'Общая очередь · 2027–2028',      tone: 'text-ink-muted' },
  'new-queue':    { label: 'NEW · общая очередь',            tone: 'text-ink-muted' },
  cross:          { label: 'Сквозные функции',                tone: 'text-secondary' },
};

export default function RolesMatrixPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative hero-glow text-white overflow-hidden">
        <div className="absolute inset-0 pattern-grid opacity-50 pointer-events-none" />
        <div className="container-wide relative py-14 md:py-20">
          <nav className="mb-6 flex items-center gap-2 text-sm text-white/60" aria-label="breadcrumb">
            <Link href="/" className="hover:text-gold-light transition-colors flex items-center gap-1">
              <Home className="h-3 w-3" /> Главная
            </Link>
            <span>·</span>
            <span className="text-white/90">Архитектура · Роли и доступ</span>
          </nav>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-medium mb-5">
              <Users2 className="h-3.5 w-3.5 text-gold-light" />
              <span>Архитектура доступа · Sprint 1</span>
            </div>
            <h1 className="font-serif text-4xl md:text-5xl font-semibold text-white leading-[1.05] text-balance">
              Матрица ролей × модулей
            </h1>
            <p className="mt-4 text-lg text-white/80 max-w-3xl leading-relaxed">
              9 ролей и 25 точек функциональности — сводная таблица прав доступа для IT-разработчика.
              Разграничение готово к 01.07.2026 как основа для user-auth модуля; активные в прототипе
              роли подсвечены, остальные описаны в концепции и подключаются во второй и третьей фазе.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Legend */}
      <section className="container-wide py-10">
        <div className="grid md:grid-cols-4 gap-3 mb-8">
          {(Object.keys(ACCESS_META) as AccessLevel[]).map((level) => {
            const meta = ACCESS_META[level];
            const Ic = meta.Icon;
            return (
              <div key={level} className={`flex items-center gap-3 p-3 rounded-lg border border-ink-line ${meta.color}`}>
                <div className="h-8 w-8 rounded-md bg-white/60 flex items-center justify-center shrink-0">
                  <Ic className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-sm font-semibold">{meta.label}</div>
                  <div className="text-xs opacity-75">уровень: {level}</div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Roles cards */}
      <section className="container-wide pb-10">
        <div className="mb-6">
          <h2 className="font-serif text-2xl font-semibold mb-2">9 ролей · 5 активных в прототипе</h2>
          <p className="text-sm text-ink-muted max-w-3xl">
            Пять ролей (гость, предприниматель, региональный МЭФ, админ МЭФ, сотрудник ведомства)
            полностью функциональны в прототипе и могут быть выбраны через Роль-свитчер. Остальные
            четыре — модель для разработки Фазы 2–3.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {ROLES.map((r) => (
            <Card key={r.id} className="relative h-full">
              {r.active ? (
                <Badge variant="success" className="absolute top-3 right-3">актив в прототипе</Badge>
              ) : (
                <Badge variant="queue" className="absolute top-3 right-3">модель Ф2–Ф3</Badge>
              )}
              <div className="flex items-start gap-3 mb-3">
                <div className="h-11 w-11 rounded-xl bg-gold/10 text-gold flex items-center justify-center shrink-0">
                  <r.Icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0 mr-16">
                  <CardTitle className="text-[15px] leading-snug">{r.name}</CardTitle>
                  <div className="text-[11px] text-ink-muted mt-0.5 italic font-mono">
                    {r.nameUz}
                  </div>
                </div>
              </div>
              <div className="text-xs text-gold-dark font-medium mb-2">
                Авторизация: {r.auth}
              </div>
              <CardDescription className="text-[12.5px] leading-relaxed">
                {r.description}
              </CardDescription>
            </Card>
          ))}
        </div>
      </section>

      {/* The matrix */}
      <section className="container-wide py-10">
        <div className="mb-6">
          <h2 className="font-serif text-2xl font-semibold mb-2">Матрица доступа</h2>
          <p className="text-sm text-ink-muted max-w-3xl">
            Структура из 20 модулей + 5 сквозных функций. Передаётся IT-разработчику
            как формальная основа для реализации user-auth и RBAC.
          </p>
        </div>

        <div className="surface-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead className="bg-bg-band/80 sticky top-0 z-10">
                <tr>
                  <th className="sticky left-0 bg-bg-band/80 border-b border-r border-ink-line p-3 text-left font-semibold text-ink min-w-[260px]">
                    Модуль / Роль
                  </th>
                  {ROLES.map((r) => (
                    <th key={r.id} className={`border-b border-l border-ink-line p-2 text-left font-semibold align-bottom min-w-[88px] max-w-[110px] ${r.active ? 'text-ink' : 'text-ink-muted'}`}>
                      <div className="flex flex-col items-start gap-1.5">
                        <r.Icon className={`h-4 w-4 ${r.active ? 'text-gold' : 'text-ink-line'}`} />
                        <div className="text-[11px] font-medium leading-tight">{r.name}</div>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(['priority', 'new-priority', 'queue', 'new-queue', 'cross'] as const).map((group) => (
                  <GroupRows key={group} group={group} />
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-6 p-4 rounded-lg bg-bg-band/60 border border-ink-line text-sm text-ink-soft leading-relaxed">
          <strong className="font-serif text-ink">Передаётся IT-разработчику:</strong> эта матрица — основа для реализации
          user-auth с RBAC. В Фазе 1 реализуются 5 активных ролей с OneID-провайдером, в Фазе 2 подключается
          «Будущий предприниматель» и «Чемпион», в Фазе 3 — «Помощник хокима» через «Онлайн-махалля» API
          и «МЭФ-аналитик» с доступом к BI-инструменту.
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/modules" className="inline-flex items-center gap-2 text-sm font-medium text-gold hover:text-gold-dark transition-colors">
            К каталогу модулей <ArrowRight className="h-4 w-4" />
          </Link>
          <Link href="/cabinet" className="inline-flex items-center gap-2 text-sm font-medium text-gold hover:text-gold-dark transition-colors">
            Переключить роль и открыть кабинет <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  );
}

function GroupRows({ group }: { group: ModuleRow['group'] }) {
  const rows = MODULES.filter((m) => m.group === group);
  const meta = GROUP_META[group];

  return (
    <>
      <tr className="bg-bg-band/50">
        <td colSpan={10} className={`p-2.5 text-[11px] uppercase tracking-wider font-semibold ${meta.tone}`}>
          {meta.label} · {rows.length}
        </td>
      </tr>
      {rows.map((m) => (
        <tr key={m.slug} className="hover:bg-bg-band/40 transition-colors">
          <td className="sticky left-0 bg-bg-white hover:bg-bg-band/40 border-r border-ink-line/60 p-2.5 text-[12px] font-medium text-ink">
            {m.label}
          </td>
          {ROLES.map((r) => {
            const level = m.access[r.id];
            const am = ACCESS_META[level];
            const Ic = am.Icon;
            return (
              <td key={r.id} className="border-l border-ink-line/40 p-1.5">
                <div
                  className={`h-8 rounded-md flex items-center justify-center ${am.color}`}
                  title={`${r.name}: ${am.label}`}
                >
                  <Ic className="h-3.5 w-3.5" />
                </div>
              </td>
            );
          })}
        </tr>
      ))}
    </>
  );
}
