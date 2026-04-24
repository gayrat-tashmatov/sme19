'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  BookOpenCheck, Rocket, Building, ScrollText, FileSpreadsheet, ArrowRight,
  CheckCircle2, ExternalLink, Download, Search, Filter, Sparkles,
  Calendar, MapPin, Clock, Monitor, AlertCircle, FileText, BookMarked,
} from 'lucide-react';
import { Card, CardTitle, CardDescription } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/cn';

type TabId = 'stages' | 'services' | 'laws' | 'templates';

// ════════════════════════════════════════════════════════════════════
// Tab 1 · Startup stages (universal path)
// ════════════════════════════════════════════════════════════════════
const STAGES = [
  {
    id: 'idea',
    order: 1,
    title: 'Идея и валидация',
    duration: '2–4 недели',
    Icon: Rocket,
    checklist: [
      { t: 'Определите проблему, которую решает ваш бизнес', m: null },
      { t: 'Изучите конкурентов и рыночный спрос', m: '/modules/info' },
      { t: 'Опросите 20–30 потенциальных клиентов', m: null },
      { t: 'Пройдите самооценку готовности', m: '/modules/maturity' },
      { t: 'Выберите подходящий вид бизнеса из 12 сценариев', m: '/modules/nPath' },
    ],
  },
  {
    id: 'register',
    order: 2,
    title: 'Регистрация и оформление',
    duration: '1–3 дня',
    Icon: Building,
    checklist: [
      { t: 'Выберите юридическую форму: ИП / ООО / семейное предприятие', m: '/modules/qBiz' },
      { t: 'Зарегистрируйте бизнес через birdarcha.uz', m: '/modules/qBiz' },
      { t: 'Получите ИНН и встаньте на учёт в Soliq', m: '/modules/qReg' },
      { t: 'Откройте расчётный счёт в банке', m: null },
      { t: 'Подключите электронную подпись (ЭЦП)', m: null },
      { t: 'Оформите необходимые лицензии (если нужны)', m: '/modules/qWF' },
    ],
  },
  {
    id: 'setup',
    order: 3,
    title: 'Первые клиенты и операции',
    duration: '1–3 месяца',
    Icon: MapPin,
    checklist: [
      { t: 'Найдите локацию: карта участков и аукционов', m: '/modules/geo' },
      { t: 'Подключите коммунальные услуги одной заявкой', m: '/modules/qInf' },
      { t: 'Настройте процессы продаж и учёта', m: null },
      { t: 'Запустите маркетинг и привлеките первых клиентов', m: null },
      { t: 'Наймите и обучите первых сотрудников', m: '/modules/nLearn' },
      { t: 'Подайте первую налоговую декларацию', m: '/modules/qRep' },
    ],
  },
  {
    id: 'grow',
    order: 4,
    title: 'Рост и масштабирование',
    duration: '3–12 месяцев',
    Icon: FileText,
    checklist: [
      { t: 'Получите меру поддержки под вашу стадию', m: '/modules/registry' },
      { t: 'Участвуйте в госзакупках с квотой МСБ', m: '/modules/nProcure' },
      { t: 'Выйдите на маркетплейсы', m: '/modules/ecommerce' },
      { t: 'Оцените цифровую зрелость и автоматизируйте процессы', m: '/modules/maturity' },
      { t: 'Расширьте команду и откройте филиалы', m: null },
    ],
  },
  {
    id: 'export',
    order: 5,
    title: 'Экспорт и международный рынок',
    duration: '6–18 месяцев',
    Icon: Sparkles,
    checklist: [
      { t: 'Сертифицируйте продукцию для целевых рынков', m: null },
      { t: 'Разработайте экспортную упаковку и маркетинг', m: null },
      { t: 'Воспользуйтесь программой компенсации участия в выставках', m: '/modules/registry' },
      { t: 'Подайте заявку в Enterprise Uzbekistan', m: null },
      { t: 'Выйдите на Amazon, Etsy, Alibaba', m: '/modules/ecommerce' },
    ],
  },
];

// ════════════════════════════════════════════════════════════════════
// Tab 2 · Government services catalog (~40 demo entries from 614 MIP)
// ════════════════════════════════════════════════════════════════════
type ServiceCategory = 'open' | 'tax' | 'reports' | 'licence' | 'procure' | 'export' | 'close';
type OnlineLevel = 'full' | 'partial' | 'offline';

interface GovService {
  id: string;
  name: string;
  category: ServiceCategory;
  authority: string;
  onlineLevel: OnlineLevel;
  fee: string;
  time: string;
  audience: ('ИП' | 'ООО' | 'ФЛ')[];
}

const SERVICES: GovService[] = [
  // Open business
  { id: 'S-001', name: 'Государственная регистрация ИП',       category: 'open',    authority: 'Минюст',      onlineLevel: 'full',    fee: 'Бесплатно',     time: '1 день',       audience: ['ИП'] },
  { id: 'S-002', name: 'Государственная регистрация ООО',      category: 'open',    authority: 'Минюст',      onlineLevel: 'full',    fee: '450 000 сум',  time: '1 день',       audience: ['ООО'] },
  { id: 'S-003', name: 'Резервирование названия компании',     category: 'open',    authority: 'Минюст',      onlineLevel: 'full',    fee: 'Бесплатно',     time: 'моментально',  audience: ['ООО'] },
  { id: 'S-004', name: 'Получение ЭЦП для физ.лица',             category: 'open',    authority: 'Центр ЭЦП',    onlineLevel: 'full',    fee: 'Бесплатно',     time: '10 минут',     audience: ['ФЛ'] },
  { id: 'S-005', name: 'Открытие расчётного счёта',              category: 'open',    authority: 'Коммерч. банки',onlineLevel: 'partial', fee: 'Бесплатно',     time: '1–3 дня',       audience: ['ИП','ООО'] },
  { id: 'S-006', name: 'Постановка на учёт в Soliq',              category: 'open',    authority: 'Soliq',         onlineLevel: 'full',    fee: 'Бесплатно',     time: 'автомат-ки',   audience: ['ИП','ООО'] },
  // Tax
  { id: 'S-010', name: 'Декларация НДС',                          category: 'tax',     authority: 'Soliq',         onlineLevel: 'full',    fee: 'Бесплатно',     time: '5 минут',      audience: ['ИП','ООО'] },
  { id: 'S-011', name: 'Декларация налога на прибыль',             category: 'tax',     authority: 'Soliq',         onlineLevel: 'full',    fee: 'Бесплатно',     time: '5–10 минут',   audience: ['ООО'] },
  { id: 'S-012', name: 'Переход на упрощённый режим налогообл.', category: 'tax',     authority: 'Soliq',         onlineLevel: 'full',    fee: 'Бесплатно',     time: '1 день',       audience: ['ИП','ООО'] },
  { id: 'S-013', name: 'Получение справки об отсутствии задолж.', category: 'tax',     authority: 'Soliq',         onlineLevel: 'full',    fee: 'Бесплатно',     time: 'моментально',  audience: ['ИП','ООО'] },
  { id: 'S-014', name: 'Регистрация кассового аппарата ONLINE-KKM', category: 'tax',    authority: 'Soliq',         onlineLevel: 'full',    fee: 'Бесплатно',     time: '1 день',       audience: ['ИП','ООО'] },
  // Reports
  { id: 'S-020', name: 'Статистическая форма П-1',                category: 'reports', authority: 'Нацкомстат',    onlineLevel: 'full',    fee: 'Бесплатно',     time: '3 минуты',     audience: ['ООО'] },
  { id: 'S-021', name: 'Отчёт по соц. отчислениям',                category: 'reports', authority: 'Пенсионный фонд',onlineLevel: 'full',   fee: 'Бесплатно',     time: '3 минуты',     audience: ['ИП','ООО'] },
  { id: 'S-022', name: 'Уведомление о приёме сотрудника',          category: 'reports', authority: 'Минтруда',      onlineLevel: 'full',    fee: 'Бесплатно',     time: '2 минуты',     audience: ['ИП','ООО'] },
  // Licences
  { id: 'S-030', name: 'Лицензия на розничную торговлю алкоголем', category: 'licence',authority: 'Хокимияты',       onlineLevel: 'partial',fee: '2.8 млн сум',  time: '15–30 дней',   audience: ['ИП','ООО'] },
  { id: 'S-031', name: 'Санитарно-эпидемиологическое заключение', category: 'licence',authority: 'СЭС',             onlineLevel: 'partial',fee: 'от 300 тыс',   time: '10–20 дней',   audience: ['ИП','ООО'] },
  { id: 'S-032', name: 'Пожарный сертификат объекта',               category: 'licence',authority: 'МЧС',              onlineLevel: 'partial',fee: 'от 500 тыс',   time: '10–15 дней',   audience: ['ИП','ООО'] },
  { id: 'S-033', name: 'Разрешение на наружную рекламу',            category: 'licence',authority: 'Хокимияты',       onlineLevel: 'partial',fee: 'от 200 тыс',   time: '7–14 дней',    audience: ['ИП','ООО'] },
  { id: 'S-034', name: 'Резидентство IT-парка',                     category: 'licence',authority: 'IT-парк',          onlineLevel: 'full',    fee: 'Бесплатно',     time: '10 дней',      audience: ['ООО'] },
  // Procurement
  { id: 'S-040', name: 'Регистрация на xarid.uz',                   category: 'procure',authority: 'Агентство госзакупок',onlineLevel: 'full',fee: 'Бесплатно',   time: '1 день',       audience: ['ИП','ООО'] },
  { id: 'S-041', name: 'Аккредитация как поставщик МСБ',             category: 'procure',authority: 'Агентство госзакупок',onlineLevel: 'full',fee: 'Бесплатно',   time: '3 дня',        audience: ['ИП','ООО'] },
  // Export
  { id: 'S-050', name: 'Получение УНП экспортёра',                  category: 'export', authority: 'ГТК',               onlineLevel: 'full',    fee: 'Бесплатно',     time: '1 день',       audience: ['ООО'] },
  { id: 'S-051', name: 'Сертификат происхождения СТ-1',              category: 'export', authority: 'ТПП',                onlineLevel: 'partial',fee: 'от 400 тыс',   time: '3–5 дней',     audience: ['ИП','ООО'] },
  { id: 'S-052', name: 'Компенсация расходов на выставки за рубеж', category: 'export', authority: 'Enterprise Uzbekistan',onlineLevel: 'full',fee: 'Бесплатно',    time: '14 дней',      audience: ['ООО'] },
  // Close
  { id: 'S-060', name: 'Прекращение деятельности ИП',               category: 'close',  authority: 'Минюст',             onlineLevel: 'full',    fee: 'Бесплатно',     time: '3 дня',        audience: ['ИП'] },
  { id: 'S-061', name: 'Ликвидация ООО',                             category: 'close',  authority: 'Минюст',             onlineLevel: 'partial', fee: '300 000 сум',  time: '2–6 месяцев',  audience: ['ООО'] },
];

const CATEGORY_LABEL: Record<ServiceCategory, string> = {
  open: 'Открытие бизнеса', tax: 'Налоги', reports: 'Отчётность', licence: 'Лицензии',
  procure: 'Госзакупки', export: 'Экспорт', close: 'Закрытие',
};

const ONLINE_CONFIG: Record<OnlineLevel, { label: string; tone: string }> = {
  full:    { label: 'Онлайн полностью', tone: 'bg-success/10 text-success border-success/20' },
  partial: { label: 'Частично онлайн',   tone: 'bg-gold/10 text-gold-dark border-gold/20' },
  offline: { label: 'Только офлайн',     tone: 'bg-ink-line text-ink-muted border-ink-line' },
};

// ════════════════════════════════════════════════════════════════════
// Tab 3 · Legal acts
// ════════════════════════════════════════════════════════════════════
interface LegalAct {
  id: string;
  title: string;
  type: 'constitution' | 'code' | 'decree' | 'resolution' | 'order';
  year: string;
  summary: string;
  lexUrl: string;
  relevantFor: string[];
}

const LAWS: LegalAct[] = [
  {
    id: 'L-001',
    title: 'Конституция Республики Узбекистан',
    type: 'constitution',
    year: '2023 (новая редакция)',
    summary: 'Ст. 53–55: права на предпринимательскую деятельность, собственность и свободу экономической инициативы. Базовый документ, гарантирующий защиту частной собственности и равенство всех форм собственности.',
    lexUrl: 'https://lex.uz/',
    relevantFor: ['все'],
  },
  {
    id: 'L-002',
    title: 'Налоговый кодекс Республики Узбекистан',
    type: 'code',
    year: '2019 (действ. редакция)',
    summary: 'Основной документ по налогообложению. Устанавливает виды налогов (НДС 12%, налог на прибыль 15%, ЕСП 4.5%), налоговые режимы, льготы для МСБ, порядок сдачи отчётности и ответственность.',
    lexUrl: 'https://lex.uz/',
    relevantFor: ['ИП', 'ООО'],
  },
  {
    id: 'L-003',
    title: 'Предпринимательский кодекс',
    type: 'code',
    year: 'проект 2025',
    summary: 'Объединяет все законы о предпринимательской деятельности. Определяет формы предпринимательства, процедуры регистрации, государственные гарантии и защиту прав предпринимателей.',
    lexUrl: 'https://lex.uz/',
    relevantFor: ['все'],
  },
  {
    id: 'L-004',
    title: 'ПФ-50 · О дальнейшей поддержке МСБ',
    type: 'decree',
    year: '19.03.2025',
    summary: 'Базовый документ для Платформы. Пункт 4: создание 6 цифровых компонентов до 01.07.2026. Пункт 6: реестр 678 чемпионов предпринимательства в 3 уровнях. Льготы для МСБ до 2030 года.',
    lexUrl: 'https://lex.uz/',
    relevantFor: ['все'],
  },
  {
    id: 'L-005',
    title: 'ПФ-138 · Стратегия развития МСБ до 2030',
    type: 'decree',
    year: '2025',
    summary: 'Долгосрочная стратегия. Целевые показатели: 60% ВВП, 80% занятости в МСБ к 2030. Национальная экосистема поддержки, цифровизация, программы финансирования.',
    lexUrl: 'https://lex.uz/',
    relevantFor: ['все'],
  },
  {
    id: 'L-006',
    title: 'УП-50 · Об антикоррупционных мерах для бизнеса',
    type: 'decree',
    year: '2025',
    summary: 'Мораторий на внеплановые проверки для добросовестных МСБ до 2026. Плановые — не чаще 1 раза в 3 года. Упрощение налогового администрирования.',
    lexUrl: 'https://lex.uz/',
    relevantFor: ['все'],
  },
  {
    id: 'L-007',
    title: 'Постановление КМ № 180 · НДС для розничной торговли',
    type: 'resolution',
    year: '01.07.2026',
    summary: 'Снижение ставки НДС для розничной торговли одеждой с 12% до 10%. Касается предпринимателей с ОКЭД 47.71. Вступает в силу 1 июля 2026.',
    lexUrl: 'https://lex.uz/',
    relevantFor: ['ИП', 'ООО'],
  },
  {
    id: 'L-008',
    title: 'Постановление КМ № 96 · Субсидия на POS-системы',
    type: 'resolution',
    year: '01.05.2026',
    summary: 'Компенсация до 30% стоимости POS-системы, лимит 15 млн сум на предприятие. Для сферы услуг и розничной торговли. Срок подачи заявок до 01.10.2026.',
    lexUrl: 'https://lex.uz/',
    relevantFor: ['ИП', 'ООО'],
  },
  {
    id: 'L-009',
    title: 'Трудовой кодекс Республики Узбекистан',
    type: 'code',
    year: '2022 (действ.)',
    summary: 'Основной документ по трудовым отношениям. Трудовые договоры, рабочее время, отпуска, МРОТ, соц. отчисления, охрана труда. Обязателен при найме.',
    lexUrl: 'https://lex.uz/',
    relevantFor: ['ИП', 'ООО'],
  },
  {
    id: 'L-010',
    title: 'Приказ Минтруда № 48 · Электронный журнал инструктажей',
    type: 'order',
    year: '01.06.2026',
    summary: 'Обязательное оформление инструктажей по охране труда через электронный журнал. Штраф за нарушение — до 6 БРВ на каждого сотрудника. Касается предприятий от 5 сотрудников.',
    lexUrl: 'https://lex.uz/',
    relevantFor: ['ИП', 'ООО'],
  },
  {
    id: 'L-011',
    title: 'Закон «О государственных закупках»',
    type: 'code',
    year: '2021',
    summary: 'Правила участия в тендерах, обязательная квота МСБ 25%, процедуры конкурсов и аукционов. Регулирует работу xarid.uz и других площадок.',
    lexUrl: 'https://lex.uz/',
    relevantFor: ['ИП', 'ООО'],
  },
  {
    id: 'L-012',
    title: 'Закон «О лицензировании отдельных видов деятельности»',
    type: 'code',
    year: '2021',
    summary: 'Перечень видов деятельности, подлежащих лицензированию (~50 видов). Порядок получения, продления и отзыва лицензий.',
    lexUrl: 'https://lex.uz/',
    relevantFor: ['ИП', 'ООО'],
  },
];

const LAW_TYPE_LABEL: Record<LegalAct['type'], { label: string; variant: 'priority' | 'info' | 'success' | 'outline' | 'warning' }> = {
  constitution: { label: 'Конституция', variant: 'priority' },
  code:         { label: 'Кодекс',      variant: 'info' },
  decree:       { label: 'Указ',        variant: 'warning' },
  resolution:   { label: 'Постановление', variant: 'success' },
  order:        { label: 'Приказ',       variant: 'outline' },
};

// ════════════════════════════════════════════════════════════════════
// Tab 4 · Business plan templates
// ════════════════════════════════════════════════════════════════════
const TEMPLATES = [
  { id: 'T-001', name: 'Кафе и общепит',             emoji: '☕', pages: 24, sections: 15, est: '80–300 млн сум', format: ['docx', 'xlsx-модель'] },
  { id: 'T-002', name: 'IT-компания',                emoji: '💻', pages: 28, sections: 16, est: '50–200 млн сум', format: ['docx', 'xlsx-модель'] },
  { id: 'T-003', name: 'Фермерское хозяйство',       emoji: '🌾', pages: 32, sections: 17, est: '150–800 млн сум', format: ['docx', 'xlsx-модель'] },
  { id: 'T-004', name: 'Beauty-салон',                emoji: '💅', pages: 20, sections: 14, est: '40–120 млн сум', format: ['docx', 'xlsx-модель'] },
  { id: 'T-005', name: 'Интернет-магазин',            emoji: '🛒', pages: 22, sections: 15, est: '30–150 млн сум', format: ['docx', 'xlsx-модель'] },
  { id: 'T-006', name: 'Автосервис',                   emoji: '🔧', pages: 26, sections: 16, est: '100–400 млн сум', format: ['docx', 'xlsx-модель'] },
  { id: 'T-007', name: 'Пекарня',                      emoji: '🥐', pages: 24, sections: 15, est: '80–250 млн сум', format: ['docx', 'xlsx-модель'] },
  { id: 'T-008', name: 'Детский центр',                emoji: '🧸', pages: 22, sections: 14, est: '60–180 млн сум', format: ['docx', 'xlsx-модель'] },
  { id: 'T-009', name: 'Аптека',                       emoji: '💊', pages: 26, sections: 16, est: '120–400 млн сум', format: ['docx', 'xlsx-модель'] },
  { id: 'T-010', name: 'Консалтинг',                   emoji: '📊', pages: 20, sections: 13, est: '20–60 млн сум',   format: ['docx', 'xlsx-модель'] },
  { id: 'T-011', name: 'Логистика и доставка',         emoji: '🚚', pages: 28, sections: 16, est: '200–700 млн сум', format: ['docx', 'xlsx-модель'] },
  { id: 'T-012', name: 'Ателье и швейное дело',        emoji: '✂️', pages: 22, sections: 15, est: '40–150 млн сум', format: ['docx', 'xlsx-модель'] },
];

// ════════════════════════════════════════════════════════════════════
// Main component
// ════════════════════════════════════════════════════════════════════
export function N_Guide() {
  const [tab, setTab] = useState<TabId>('stages');

  return (
    <section className="container-wide py-10 md:py-14 space-y-6">
      {/* Hero */}
      <Card padding="lg" tone="navy" className="text-white relative overflow-hidden">
        <div className="absolute inset-0 pattern-dots opacity-25 pointer-events-none" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-3">
            <Badge variant="new">NEW</Badge>
            <span className="text-xs uppercase tracking-wider text-gold-light">Бизнес учун маслаҳатлар · адаптация business.gov.au + SBA</span>
          </div>
          <h2 className="font-serif text-2xl md:text-3xl text-white mb-2 leading-tight">
            Справочник бизнеса — всё самое важное в одной точке
          </h2>
          <p className="text-white/75 max-w-3xl text-sm">
            Этапы запуска от идеи до экспорта · 26 государственных услуг с указанием онлайн-готовности ·
            НПА с саммари и прямыми ссылками на lex.uz · 12 шаблонов бизнес-планов с финансовой моделью в Excel.
          </p>
        </div>
      </Card>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
        {[
          { id: 'stages',    label: 'Этапы запуска бизнеса', Icon: Rocket,          count: STAGES.length },
          { id: 'services',  label: 'Государственные услуги', Icon: Building,         count: SERVICES.length },
          { id: 'laws',      label: 'НПА и законодательство', Icon: ScrollText,       count: LAWS.length },
          { id: 'templates', label: 'Типовые бизнес-планы',    Icon: FileSpreadsheet,  count: TEMPLATES.length },
        ].map((t) => {
          const active = tab === t.id;
          return (
            <button key={t.id} onClick={() => setTab(t.id as TabId)} className={cn(
              'h-11 px-4 rounded-lg text-sm font-medium border transition-colors flex items-center gap-2',
              active ? 'bg-navy text-white border-navy' : 'bg-bg-white text-ink-muted border-ink-line hover:border-gold hover:text-gold',
            )}>
              <t.Icon className="h-4 w-4" /> {t.label}
              <span className={cn('text-[11px] font-mono ml-1', active ? 'text-white/70' : 'text-ink-muted')}>({t.count})</span>
            </button>
          );
        })}
      </div>

      {/* Content */}
      {tab === 'stages'    && <TabStages />}
      {tab === 'services'  && <TabServices />}
      {tab === 'laws'      && <TabLaws />}
      {tab === 'templates' && <TabTemplates />}

      {/* Footer callout */}
      <Card padding="lg" className="border-success/25 bg-success/[0.03]">
        <div className="flex items-start gap-4">
          <div className="h-10 w-10 rounded-lg bg-success/10 text-success flex items-center justify-center shrink-0">
            <Sparkles className="h-5 w-5" />
          </div>
          <div className="text-sm text-ink">
            <strong>Референсы:</strong> <strong>business.gov.au Guides</strong> (Австралия) — справочник в 4 блоках,
            от планирования до экспорта. <strong>SBA Learning Center</strong> (США) — структура Plan/Launch/Manage/Grow.
            В Узбекистане нет единого справочника — информация разбросана между lex.uz, my.gov.uz, biznes-portal.uz и десятками
            других сайтов. Модуль объединяет всё и даёт контекст для каждого предпринимателя.
          </div>
        </div>
      </Card>
    </section>
  );
}

// ─────────── Tab 1: Stages ───────────
function TabStages() {
  return (
    <div className="space-y-4">
      {STAGES.map((s, i) => (
        <motion.div
          key={s.id}
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, delay: i * 0.05 }}
        >
          <Card padding="lg">
            <div className="flex items-start gap-4">
              <div className="shrink-0">
                <div className="h-12 w-12 rounded-xl bg-gold-gradient text-white flex items-center justify-center font-serif font-semibold text-lg">
                  {s.order}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <s.Icon className="h-4 w-4 text-gold" />
                  <div className="text-[10.5px] uppercase tracking-wider text-gold font-semibold">Этап {s.order} · {s.duration}</div>
                </div>
                <CardTitle>{s.title}</CardTitle>

                <div className="mt-4 space-y-2">
                  {s.checklist.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-2.5 rounded-lg border border-ink-line bg-bg-white hover:border-gold/40 transition-colors">
                      <CheckCircle2 className="h-4 w-4 text-gold mt-0.5 shrink-0" />
                      <div className="flex-1 text-sm text-ink">{item.t}</div>
                      {item.m && (
                        <a href={item.m} className="text-xs text-gold hover:text-gold-dark font-medium flex items-center gap-1 whitespace-nowrap shrink-0">
                          модуль <ArrowRight className="h-3 w-3" />
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}

// ─────────── Tab 2: Services ───────────
function TabServices() {
  const [cat, setCat] = useState<ServiceCategory | 'all'>('all');
  const [online, setOnline] = useState<OnlineLevel | 'all'>('all');
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => SERVICES.filter((s) => {
    if (cat !== 'all' && s.category !== cat) return false;
    if (online !== 'all' && s.onlineLevel !== online) return false;
    if (query && !s.name.toLowerCase().includes(query.toLowerCase())) return false;
    return true;
  }), [cat, online, query]);

  const fullPct = Math.round(SERVICES.filter((s) => s.onlineLevel === 'full').length / SERVICES.length * 100);

  return (
    <div className="space-y-4">
      <Card padding="md">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="flex-1 min-w-[220px] relative">
            <Search className="h-4 w-4 text-ink-muted absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              value={query} onChange={(e) => setQuery(e.target.value)}
              placeholder="Поиск по названию услуги…"
              className="w-full pl-9 pr-3 h-10 rounded-lg border border-ink-line bg-bg-white text-sm focus:outline-none focus:border-gold"
            />
          </div>
          <div className="text-xs text-ink-muted">
            <strong className="text-success">{fullPct}%</strong> услуг доступны 100% онлайн
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 mt-3">
          <Filter className="h-4 w-4 text-ink-muted self-center mr-1" />
          <Chip active={cat === 'all'} onClick={() => setCat('all')}>Все категории</Chip>
          {(Object.keys(CATEGORY_LABEL) as ServiceCategory[]).map((c) => (
            <Chip key={c} active={cat === c} onClick={() => setCat(c)}>{CATEGORY_LABEL[c]}</Chip>
          ))}
          <span className="h-4 w-px bg-ink-line mx-2 self-center" />
          <Chip active={online === 'all'} onClick={() => setOnline('all')}>Любой доступ</Chip>
          <Chip active={online === 'full'} onClick={() => setOnline('full')} tone="success">Полный онлайн</Chip>
          <Chip active={online === 'partial'} onClick={() => setOnline('partial')}>Частично</Chip>
        </div>
      </Card>

      <div className="grid md:grid-cols-2 gap-3">
        {filtered.map((s) => (
          <div key={s.id} className="p-4 rounded-xl border border-ink-line bg-bg-white hover:border-gold/40 transition-all">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex-1 min-w-0">
                <div className="text-[10.5px] font-mono text-ink-muted">{s.id} · {CATEGORY_LABEL[s.category]}</div>
                <div className="font-serif text-[14px] text-ink leading-snug mt-0.5">{s.name}</div>
              </div>
              <span className={cn('shrink-0 px-2 py-0.5 rounded text-[10.5px] font-semibold border', ONLINE_CONFIG[s.onlineLevel].tone)}>
                {ONLINE_CONFIG[s.onlineLevel].label}
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs text-ink-muted flex-wrap mt-2 pt-2 border-t border-ink-line/50">
              <span><Building className="inline h-3 w-3 -mt-0.5" /> {s.authority}</span>
              <span>·</span>
              <span><Clock className="inline h-3 w-3 -mt-0.5" /> {s.time}</span>
              <span>·</span>
              <span className="text-gold font-medium">{s.fee}</span>
              <span>·</span>
              <span>{s.audience.join(' / ')}</span>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="md:col-span-2 text-center py-10 text-sm text-ink-muted surface-card">
            По этим фильтрам услуг не найдено
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────── Tab 3: Laws ───────────
function TabLaws() {
  const [type, setType] = useState<LegalAct['type'] | 'all'>('all');
  const filtered = type === 'all' ? LAWS : LAWS.filter((l) => l.type === type);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <Chip active={type === 'all'} onClick={() => setType('all')}>Все типы ({LAWS.length})</Chip>
        {(Object.keys(LAW_TYPE_LABEL) as LegalAct['type'][]).map((t) => {
          const count = LAWS.filter((l) => l.type === t).length;
          if (count === 0) return null;
          return <Chip key={t} active={type === t} onClick={() => setType(t)}>{LAW_TYPE_LABEL[t].label} ({count})</Chip>;
        })}
      </div>

      <div className="space-y-3">
        {filtered.map((law) => (
          <Card key={law.id} hover>
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-lg bg-gold/10 text-gold flex items-center justify-center shrink-0">
                <BookMarked className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <Badge variant={LAW_TYPE_LABEL[law.type].variant}>{LAW_TYPE_LABEL[law.type].label}</Badge>
                  <span className="text-[11px] text-ink-muted">{law.year}</span>
                  <span className="text-[11px] text-ink-muted font-mono">· {law.id}</span>
                </div>
                <CardTitle className="text-[15px] leading-snug">{law.title}</CardTitle>
                <div className="mt-2 text-[13px] text-ink leading-relaxed">{law.summary}</div>
                <div className="mt-3 pt-3 border-t border-ink-line flex items-center justify-between flex-wrap gap-2">
                  <div className="text-xs text-ink-muted">
                    Касается: <strong className="text-ink">{law.relevantFor.join(', ')}</strong>
                  </div>
                  <a
                    href={law.lexUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-gold hover:text-gold-dark font-semibold flex items-center gap-1"
                  >
                    Открыть на lex.uz <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ─────────── Tab 4: Templates ───────────
function TabTemplates() {
  return (
    <>
      <Card padding="md" className="border-gold/30 bg-gold-soft/30 mb-4">
        <div className="flex items-start gap-3">
          <div className="h-10 w-10 rounded-lg bg-gold text-white flex items-center justify-center shrink-0">
            <FileSpreadsheet className="h-5 w-5" />
          </div>
          <div className="text-sm text-ink">
            <strong>Формат шаблона:</strong> Word-документ с 13–17 разделами (резюме, рынок, операции, маркетинг, финансы,
            риски) + Excel-модель на 24 месяца с денежными потоками, точкой безубыточности и прогнозом.
            Референс — <strong>business.gov.au MyBizPlan</strong> template.
          </div>
        </div>
      </Card>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
        {TEMPLATES.map((t) => (
          <div key={t.id} className="p-4 rounded-xl border border-ink-line bg-bg-white hover:border-gold/40 transition-all">
            <div className="flex items-center gap-3 mb-3">
              <div className="text-3xl">{t.emoji}</div>
              <div className="flex-1 min-w-0">
                <div className="font-serif text-[15px] text-ink leading-tight">{t.name}</div>
                <div className="text-[11px] text-ink-muted mt-0.5">{t.pages} стр · {t.sections} разделов</div>
              </div>
            </div>
            <div className="space-y-1 text-xs text-ink-muted border-t border-ink-line pt-3">
              <div><strong className="text-ink">Стартовый капитал:</strong> {t.est}</div>
              <div><strong className="text-ink">Форматы:</strong> {t.format.join(' · ')}</div>
            </div>
            <div className="mt-3 flex gap-1.5">
              <Button size="sm" leftIcon={<Download className="h-3.5 w-3.5" />} className="flex-1">Скачать</Button>
              <Button size="sm" variant="ghost" className="flex-1">Онлайн</Button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

function Chip({ active, onClick, tone, children }: {
  active: boolean; onClick: () => void; tone?: 'success'; children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'h-8 px-3 rounded-full text-xs font-medium transition-colors border',
        active
          ? tone === 'success' ? 'bg-success text-white border-success' : 'bg-navy text-white border-navy'
          : 'bg-bg-white text-ink-muted border-ink-line hover:border-gold hover:text-gold',
      )}
    >
      {children}
    </button>
  );
}
