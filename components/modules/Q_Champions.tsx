'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trophy, Building2, MapPin, Phone, TrendingUp, Users2, Landmark, Factory,
  Sparkles, CheckCircle2, AlertCircle, ArrowRight, ExternalLink, Info, Calendar,
  Globe, Award, DollarSign, Briefcase, Wallet, Send, ShieldCheck, FileText,
  Database, ChevronRight,
} from 'lucide-react';
import { Card, CardTitle, CardDescription } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { PhaseRoadmapStrip } from '@/components/sections/PhaseRoadmapStrip';
import { useStore } from '@/lib/store';

// ═══════════════════════════════════════════════════════════════════
// Sprint 8 · Q_Champions full redesign per Document (April 2026)
// Source: ПФ-50 от 19.03.2025, Article 6
// 5 parts: (1) Online list of 678 champions with criteria by level,
// (2) Monthly data updates via Soliq+MinPoverty+Banks integration,
// (3) IFI announcements (EBRD/GIZ/IsDB/KFW), (4) VIP banking process,
// (5) Champion inquiries system routed through MEF SME Dept
// ═══════════════════════════════════════════════════════════════════

type TabId = 'list' | 'monthly' | 'ifi' | 'banks' | 'inquiries';

// ─── Level-based criteria ─────────────────────────────────────
interface ChampionLevel {
  id: 'district' | 'regional' | 'republican';
  name: string;
  count: number;
  minTurnover: string;
  minJobs: string;
  minPerArea: string;
  colorClass: string;
}

const LEVELS: ChampionLevel[] = [
  { id: 'district',   name: 'Районный уровень',    count: 569, minTurnover: '> 10 млрд сум',   minJobs: '> 50 мест',   minPerArea: 'мин. 2 на район',    colorClass: 'bg-gold/10 text-gold-dark border-gold/30' },
  { id: 'regional',   name: 'Региональный уровень', count: 109, minTurnover: '> 100 млрд сум',  minJobs: '> 500 мест',  minPerArea: 'мин. 5 на регион',   colorClass: 'bg-secondary/10 text-secondary border-secondary/30' },
  { id: 'republican', name: 'Республиканский уровень', count: 3,  minTurnover: '> 1 трлн сум',    minJobs: '> 5 000 мест', minPerArea: '1–5 на регион',      colorClass: 'bg-success/10 text-success border-success/30' },
];

// Industry breakdown matches the document
const INDUSTRY_STATS = [
  { label: 'Промышленность',       count: 484, pct: 71 },
  { label: 'Услуги',                count: 92,  pct: 14 },
  { label: 'Сельское хозяйство',    count: 48,  pct: 7  },
  { label: 'Строительство',         count: 54,  pct: 8  },
];

const TURNOVER_STATS = [
  { label: 'Свыше 10 млрд сум',  count: 514, pct: 76 },
  { label: 'Свыше 100 млрд сум', count: 161, pct: 24 },
  { label: 'Свыше 1 трлн сум',   count: 3,   pct: 0.4 },
];

// ─── Public champion card data ──────────────────────────────
interface Champion {
  id: string;
  companyName: string;
  brand: string;
  level: 'district' | 'regional' | 'republican';
  region: string;
  district?: string;
  industry: string;
  oked: string;
  directorName: string;
  directorGender: 'М' | 'Ж';
  phone: string;
  stir: string;
  ownershipForm: string;
  foundedYear: number;
  turnover2024: number; // mln sum
  turnover2025: number;
  turnover2026: number; // forecast
  charterFund: number;
  employeesTotal: number;
  employeesPermanent: number;
  employeesSeasonal: number;
  bank: string;
  story: string;
  exportCountries?: string[];
  mfiPartner?: string;
}

// Demo champions (selection)
const CHAMPIONS: Champion[] = [
  {
    id: 'CH-RP-001',
    companyName: 'ООО «Узтекс Индустриал»',
    brand: 'Uztex',
    level: 'republican',
    region: 'Ташкентская область',
    industry: 'Лёгкая промышленность',
    oked: '13.20',
    directorName: 'Абдуллаев Ш.Н.',
    directorGender: 'М',
    phone: '+998 71 123 45 67',
    stir: '200 123 456',
    ownershipForm: 'ООО',
    foundedYear: 2008,
    turnover2024: 1_200_000,
    turnover2025: 1_350_000,
    turnover2026: 1_520_000,
    charterFund: 85_000,
    employeesTotal: 5400,
    employeesPermanent: 5100,
    employeesSeasonal: 300,
    bank: 'Национальный банк ВЭД',
    story: 'Вертикально интегрированный текстильный холдинг. Начали с прядильной фабрики на 50 работников в 2008 году, сейчас — полный цикл от хлопка до готовой одежды. Основные экспортные рынки: Россия (62%), Турция (18%), ЕС (12%).',
    exportCountries: ['RU', 'TR', 'DE', 'PL'],
    mfiPartner: 'EBRD',
  },
  {
    id: 'CH-RG-014',
    companyName: 'СП «Агромилк Фергана»',
    brand: 'Milka-Uz',
    level: 'regional',
    region: 'Ферганская область',
    industry: 'Пищевая промышленность',
    oked: '10.51',
    directorName: 'Каримова Н.А.',
    directorGender: 'Ж',
    phone: '+998 73 245 67 89',
    stir: '302 445 128',
    ownershipForm: 'Совместное предприятие',
    foundedYear: 2014,
    turnover2024: 142_000,
    turnover2025: 168_000,
    turnover2026: 195_000,
    charterFund: 12_500,
    employeesTotal: 820,
    employeesPermanent: 720,
    employeesSeasonal: 100,
    bank: 'Агробанк',
    story: 'Молочный комбинат в Фергане. Запущены в 2014 с линией на 50 тонн молока в день. К 2025 году — 280 тонн/день, 12 видов продукции, собственная молочная ферма на 4 000 голов.',
    exportCountries: ['KZ', 'KG'],
    mfiPartner: 'IsDB',
  },
  {
    id: 'CH-DT-047',
    companyName: 'ООО «Тошкент Мебел Парк»',
    brand: 'TashMebel',
    level: 'district',
    region: 'г. Ташкент',
    district: 'Яшнабадский район',
    industry: 'Мебельное производство',
    oked: '31.09',
    directorName: 'Рахимов А.К.',
    directorGender: 'М',
    phone: '+998 71 345 12 34',
    stir: '201 774 009',
    ownershipForm: 'ООО',
    foundedYear: 2019,
    turnover2024: 14_500,
    turnover2025: 18_200,
    turnover2026: 22_000,
    charterFund: 1_500,
    employeesTotal: 85,
    employeesPermanent: 82,
    employeesSeasonal: 3,
    bank: 'Ипотека банк',
    story: 'Мебельная фабрика офисной мебели. Выиграли тендер МНО на 1.8 млрд сум в 2024. Планируют экспорт в Казахстан в 2026.',
    mfiPartner: 'GIZ',
  },
  {
    id: 'CH-RG-022',
    companyName: 'ЧП «Самарканд Керамика»',
    brand: 'SamCeram',
    level: 'regional',
    region: 'Самаркандская область',
    industry: 'Строительная керамика',
    oked: '23.31',
    directorName: 'Юсупов И.Р.',
    directorGender: 'М',
    phone: '+998 66 112 34 56',
    stir: '303 221 789',
    ownershipForm: 'Частное предприятие',
    foundedYear: 2011,
    turnover2024: 108_000,
    turnover2025: 121_000,
    turnover2026: 135_000,
    charterFund: 8_200,
    employeesTotal: 625,
    employeesPermanent: 580,
    employeesSeasonal: 45,
    bank: 'УзПромСтройБанк',
    story: 'Завод керамической плитки. Вошли в топ-3 производителей Узбекистана. 40% экспорта в РФ, остальное — внутренний рынок.',
    exportCountries: ['RU', 'KZ'],
    mfiPartner: 'World Bank (KFW)',
  },
  {
    id: 'CH-DT-212',
    companyName: 'Семейное предприятие «Бухара Шёлк»',
    brand: 'BukharaSilk',
    level: 'district',
    region: 'Бухарская область',
    district: 'Ромитанский район',
    industry: 'Лёгкая промышленность',
    oked: '13.10',
    directorName: 'Мавлонова З.С.',
    directorGender: 'Ж',
    phone: '+998 65 223 45 67',
    stir: '204 556 112',
    ownershipForm: 'Семейное предприятие',
    foundedYear: 2017,
    turnover2024: 11_800,
    turnover2025: 14_200,
    turnover2026: 17_500,
    charterFund: 850,
    employeesTotal: 72,
    employeesPermanent: 68,
    employeesSeasonal: 4,
    bank: 'Халк банк',
    story: 'Семейное предприятие по производству шёлковых тканей и изделий. Участник туристических маршрутов Бухары.',
    mfiPartner: 'EBRD',
  },
];

// ─── IFI announcements ─────────────────────────────────────
interface IFIAnnouncement {
  id: string;
  institution: 'EBRD' | 'GIZ' | 'IsDB' | 'World Bank';
  title: string;
  focus: string;
  amount: string;
  deadline: string;
  status: 'open' | 'closing-soon' | 'processing';
}

const IFI_ANNOUNCEMENTS: IFIAnnouncement[] = [
  { id: 'IFI-2026-EBRD-012',  institution: 'EBRD',       title: 'Women in Business · Uzbekistan II',        focus: 'Кредиты + менторство для женщин-учредителей чемпионов',        amount: 'до $2 млн',    deadline: '30 мая 2026', status: 'open' },
  { id: 'IFI-2026-GIZ-005',   institution: 'GIZ',        title: 'Green Economy · Textile Modernization',    focus: 'Грант на энергоэффективное оборудование для текстильщиков', amount: 'до €500 тыс',  deadline: '15 мая 2026', status: 'closing-soon' },
  { id: 'IFI-2026-ISDB-008',  institution: 'IsDB',       title: 'Agribusiness Value Chain Programme',       focus: 'Долгосрочное финансирование АПК-переработки',                  amount: 'до $5 млн',    deadline: '20 июня 2026', status: 'open' },
  { id: 'IFI-2026-WB-003',    institution: 'World Bank', title: 'FINGROW SME Growth Facility (KFW)',        focus: 'Льготные кредиты для чемпионов-экспортёров',                    amount: 'до $10 млн',   deadline: '31 июля 2026', status: 'open' },
];

// ─── My inquiries data (for authorized champion) ──────────
interface ChampionInquiry {
  id: string;
  subject: string;
  submittedAt: string;
  status: 'received' | 'routed' | 'in-progress' | 'answered';
  statusLabel: string;
  routedTo?: string;
}

const MY_INQUIRIES: ChampionInquiry[] = [
  { id: 'INQ-2026-C-0041', subject: 'Запрос на участие в торговой миссии в Казахстан · июнь 2026',      submittedAt: '18 апр 2026', status: 'routed',      statusLabel: 'Направлено в Enterprise.uz',   routedTo: 'Enterprise Uzbekistan' },
  { id: 'INQ-2026-C-0038', subject: 'Проблема с экспортным кредитом — документы застряли 3 недели',       submittedAt: '10 апр 2026', status: 'answered',    statusLabel: 'Отвечено',                      routedTo: 'Банк развития' },
  { id: 'INQ-2026-C-0025', subject: 'Предложение: налоговые каникулы для чемпионов-экспортёров',           submittedAt: '02 апр 2026', status: 'in-progress', statusLabel: 'В работе · Минфин',            routedTo: 'Минфин РУз' },
];

function formatUzsMln(v: number): string {
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(2)} трлн сум`;
  if (v >= 1_000)     return `${(v / 1_000).toFixed(1)} млрд сум`;
  return `${v.toFixed(0)} млн сум`;
}

export function QChampions() {
  const role = useStore((s) => s.role);
  const isAuthed = role !== 'guest';
  const [tab, setTab] = useState<TabId>('list');
  const [levelFilter, setLevelFilter] = useState<'all' | 'district' | 'regional' | 'republican'>('all');
  const [selectedChampion, setSelectedChampion] = useState<Champion | null>(null);

  const filteredChampions = levelFilter === 'all' ? CHAMPIONS : CHAMPIONS.filter((c) => c.level === levelFilter);

  return (
    <section className="container-wide py-10 md:py-14 space-y-8">
      {/* Hero */}
      <Card padding="lg" tone="navy" className="text-white relative overflow-hidden">
        <div className="absolute inset-0 pattern-dots opacity-30 pointer-events-none" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <Badge variant="priority-solid">Программа «Чемпион тадбиркорлар»</Badge>
            <span className="text-xs uppercase tracking-wider text-gold-light">ПФ-50 от 19.03.2025, ст. 6</span>
          </div>
          <h2 className="font-serif text-2xl md:text-3xl text-white mb-2 leading-tight">
            Реестр чемпионов предпринимательства — 678 быстрорастущих МСБ
          </h2>
          <p className="text-white/75 max-w-3xl text-sm leading-relaxed">
            Программа сопровождения быстрорастущих тадбиркорлар с целью увеличения производства и создания
            рабочих мест. 569 районных + 109 региональных + 3 республиканских чемпионов. Интеграции с Soliq,
            Министерством сокращения бедности, коммерческими банками. Объявления МФИ (ЕБРР, GIZ, IsDB, KFW).
          </p>
        </div>
      </Card>

      <PhaseRoadmapStrip
        embedded
        currentPhase={2}
        points={[
          { phase: 2, text: 'Онлайн-реестр 678 чемпионов по 3 уровням (район/регион/республика)' },
          { phase: 2, text: 'Ручной ввод 14 замначальников ГУ МЭФ в регионах + утверждение 2 сотрудниками Департамента МЭФ' },
          { phase: 2, text: 'Раздел объявлений МФИ (ЕБРР/GIZ/IsDB/World Bank) с формой заявки' },
          { phase: 2, text: 'Система обращений чемпионов → Департамент анализа МСБ МЭФ' },
          { phase: 2, text: 'Пересмотр списка в январе (ежегодно), обновления с разрешения МЭФ' },
          { phase: 3, text: 'Ежемесячное обновление финпоказателей через интеграцию Soliq + МинБедности + банки', blockedBy: 'кибер-экспертиза' },
          { phase: 3, text: 'VIP-процесс в коммерческих банках · бэкенд-отчётность по фин. помощи' },
          { phase: 4, text: 'AI-скоринг кандидатов на категорию чемпион по рост-траектории' },
        ]}
      />

      {/* KPI stats */}
      <div className="grid md:grid-cols-4 gap-3">
        <KpiCard label="Всего чемпионов"    value="678"   note="по ПФ-50"              Icon={Trophy}       />
        <KpiCard label="Районный уровень"   value="569"   note="мин. 2 на район"        Icon={MapPin}       />
        <KpiCard label="Региональный"        value="109"   note="мин. 5 на регион"       Icon={Building2}    />
        <KpiCard label="Республиканский"    value="3"     note="> 1 трлн сум оборота"   Icon={Landmark}     />
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-ink-line flex-wrap">
        <TabButton active={tab === 'list'}      onClick={() => setTab('list')}>
          <Trophy className="h-4 w-4" /> Реестр чемпионов
        </TabButton>
        <TabButton active={tab === 'monthly'}   onClick={() => setTab('monthly')}>
          <Database className="h-4 w-4" /> Ежемесячная БД
        </TabButton>
        <TabButton active={tab === 'ifi'}       onClick={() => setTab('ifi')}>
          <Globe className="h-4 w-4" /> Объявления МФИ
        </TabButton>
        <TabButton active={tab === 'banks'}     onClick={() => setTab('banks')}>
          <Wallet className="h-4 w-4" /> VIP-процесс в банках
        </TabButton>
        <TabButton active={tab === 'inquiries'} onClick={() => setTab('inquiries')} disabled={!isAuthed}>
          <Send className="h-4 w-4" /> Обращения
        </TabButton>
      </div>

      <AnimatePresence mode="wait">
        {/* ═══════════════════════ LIST (Part 1) ═══════════════════════ */}
        {tab === 'list' && (
          <motion.div key="list" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="space-y-5">
            {/* Criteria card */}
            <Card padding="lg" className="border-gold/25 bg-gold-soft/15">
              <div className="flex items-start gap-3 mb-4">
                <div className="h-11 w-11 rounded-xl bg-gold text-white flex items-center justify-center shrink-0">
                  <Award className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle>Критерии включения в реестр (ПФ-50, ст. 6)</CardTitle>
                  <CardDescription className="mt-0.5">
                    Ежегодно формируется в январе. Изменения — с разрешения Министерства экономики и финансов.
                  </CardDescription>
                </div>
              </div>
              <div className="grid md:grid-cols-3 gap-3">
                {LEVELS.map((l) => (
                  <div key={l.id} className={`p-4 rounded-xl border ${l.colorClass}`}>
                    <div className="font-serif text-[16px] font-semibold mb-2">{l.name}</div>
                    <div className="font-serif text-2xl font-bold mb-3">{l.count}</div>
                    <div className="space-y-1.5 text-[12px] text-ink-soft">
                      <div className="flex items-start gap-1.5">
                        <CheckCircle2 className="h-3 w-3 shrink-0 mt-0.5" />
                        <span>Оборот {l.minTurnover}</span>
                      </div>
                      <div className="flex items-start gap-1.5">
                        <CheckCircle2 className="h-3 w-3 shrink-0 mt-0.5" />
                        <span>{l.minJobs}</span>
                      </div>
                      <div className="flex items-start gap-1.5">
                        <CheckCircle2 className="h-3 w-3 shrink-0 mt-0.5" />
                        <span>{l.minPerArea}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 p-3 rounded-lg bg-bg-white border border-gold/20 text-[12px] text-ink-soft leading-relaxed">
                <strong className="text-ink">Процесс формирования:</strong> список составляют <strong>14 заместителей</strong> начальников Главного управления экономики и финансов Каракалпакстана, г. Ташкента и областей
                (начальники отделов развития и мониторинга программ МСБ и развития земельного рынка).
                Утверждает <strong>2 сотрудника</strong> Департамента анализа, поддержки и координации госполитики развития МСБ МЭФ.
              </div>
            </Card>

            {/* Industry + turnover breakdown */}
            <div className="grid md:grid-cols-2 gap-4">
              <Card padding="lg">
                <div className="flex items-center gap-2 mb-4">
                  <Factory className="h-5 w-5 text-gold" />
                  <CardTitle className="text-[15px]">По отраслям</CardTitle>
                </div>
                <div className="space-y-2.5">
                  {INDUSTRY_STATS.map((s) => (
                    <div key={s.label} className="flex items-center gap-3 text-[13px]">
                      <div className="flex-1 min-w-0 text-ink">{s.label}</div>
                      <div className="w-32 h-2 rounded-full bg-bg-band overflow-hidden">
                        <div className="h-full bg-gold" style={{ width: `${s.pct}%` }} />
                      </div>
                      <div className="font-mono font-semibold text-ink w-12 text-right">{s.count}</div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card padding="lg">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="h-5 w-5 text-gold" />
                  <CardTitle className="text-[15px]">По обороту</CardTitle>
                </div>
                <div className="space-y-2.5">
                  {TURNOVER_STATS.map((s) => (
                    <div key={s.label} className="flex items-center gap-3 text-[13px]">
                      <div className="flex-1 min-w-0 text-ink">{s.label}</div>
                      <div className="w-32 h-2 rounded-full bg-bg-band overflow-hidden">
                        <div className="h-full bg-success" style={{ width: `${s.pct}%` }} />
                      </div>
                      <div className="font-mono font-semibold text-ink w-12 text-right">{s.count}</div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Filter + Champion cards */}
            <Card padding="lg">
              <div className="flex items-start justify-between gap-3 mb-4 flex-wrap">
                <div>
                  <CardTitle>Чемпионы · онлайн-реестр</CardTitle>
                  <CardDescription className="mt-0.5">
                    Показаны демо-данные. Полный реестр 678 чемпионов загружается ежегодно в январе. Клик по карточке — паспорт.
                  </CardDescription>
                </div>
                <div className="flex gap-1.5 flex-wrap">
                  {[
                    { id: 'all',         label: 'Все · 678' },
                    { id: 'republican',  label: 'Республика · 3' },
                    { id: 'regional',    label: 'Регион · 109' },
                    { id: 'district',    label: 'Район · 569' },
                  ].map((f) => (
                    <button
                      key={f.id}
                      onClick={() => setLevelFilter(f.id as typeof levelFilter)}
                      className={`h-8 px-3 rounded-full text-xs font-medium transition-all border ${
                        levelFilter === f.id ? 'bg-gold text-white border-gold' : 'bg-bg-white text-ink-muted border-ink-line hover:border-gold hover:text-gold'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                {filteredChampions.map((c, i) => (
                  <motion.button
                    key={c.id}
                    onClick={() => setSelectedChampion(c)}
                    initial={{ opacity: 0, y: 8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-40px' }}
                    transition={{ duration: 0.25, delay: i * 0.04 }}
                    className="surface-card surface-card-hover text-left p-4"
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex-1 min-w-0">
                        <div className="font-serif text-[14px] font-semibold text-ink leading-tight">{c.brand}</div>
                        <div className="text-[11px] text-ink-muted mt-0.5">{c.companyName}</div>
                      </div>
                      <Badge variant={c.level === 'republican' ? 'priority-solid' : c.level === 'regional' ? 'info' : 'outline'}>
                        {c.level === 'republican' ? 'респ.' : c.level === 'regional' ? 'регион' : 'район'}
                      </Badge>
                    </div>

                    <div className="space-y-1 text-[11.5px] text-ink-muted mt-3">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="h-3 w-3" />
                        {c.region}{c.district ? `, ${c.district}` : ''}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Factory className="h-3 w-3" />
                        {c.industry} · ОКЭД {c.oked}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Users2 className="h-3 w-3" />
                        {c.employeesTotal.toLocaleString('ru')} сотрудников
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-ink-line/60 flex items-center justify-between">
                      <span className="text-[11px] text-gold font-semibold">
                        {formatUzsMln(c.turnover2025)} (2025)
                      </span>
                      <ChevronRight className="h-3.5 w-3.5 text-ink-muted" />
                    </div>
                  </motion.button>
                ))}
              </div>
            </Card>
          </motion.div>
        )}

        {/* ═══════════════════════ MONTHLY (Part 2) ═══════════════════════ */}
        {tab === 'monthly' && (
          <motion.div key="monthly" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="space-y-5">
            <Card padding="lg">
              <div className="flex items-start gap-3 mb-5">
                <div className="h-11 w-11 rounded-xl bg-secondary/15 text-secondary flex items-center justify-center shrink-0">
                  <Database className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle>Ежемесячная актуализация данных</CardTitle>
                  <CardDescription className="mt-0.5">
                    По каждому чемпиону ежемесячно обновляется информация через интеграции с Налоговым комитетом,
                    Министерством по сокращению бедности и занятости, коммерческими банками.
                  </CardDescription>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-3 mb-5">
                {[
                  { label: 'Название продукта/услуги + бренд',       icon: Briefcase, source: 'Ручной ввод + реестр товарных знаков' },
                  { label: 'Средний оборот 2024, 2025, 2026',        icon: TrendingUp, source: 'Soliq Committee · API' },
                  { label: 'Уставный фонд',                           icon: DollarSign, source: 'Минюст · реестр ЮЛ' },
                  { label: 'Количество работников',                   icon: Users2, source: 'Мин. по сокращению бедности и занятости' },
                  { label: 'Сезонные vs постоянные сотрудники',       icon: Calendar, source: 'Мин. по сокращению бедности и занятости' },
                  { label: 'Обслуживающий банк',                      icon: Landmark, source: 'Интеграция с коммерческими банками' },
                ].map((f, i) => (
                  <div key={i} className="p-3 rounded-lg border border-ink-line bg-bg-white flex items-start gap-3">
                    <div className="h-9 w-9 rounded-lg bg-secondary/10 text-secondary flex items-center justify-center shrink-0">
                      <f.icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[13px] font-medium text-ink">{f.label}</div>
                      <div className="text-[11px] text-gold mt-0.5">Источник: {f.source}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-3 rounded-lg bg-gold-soft/40 border border-gold/20 text-[12px] text-ink-soft flex items-start gap-2">
                <Info className="h-3.5 w-3.5 text-gold shrink-0 mt-0.5" />
                <span>
                  В Ф3 данные обновляются <strong>автоматически в конце каждого месяца</strong> через МИП.
                  До интеграции — ручной ввод данными сотрудниками Департамента МЭФ.
                </span>
              </div>
            </Card>

            {/* Sample monthly snapshot */}
            <Card padding="lg">
              <CardTitle className="text-[16px] mb-4">Пример ежемесячного среза · «Uztex»</CardTitle>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <MonthlyStat label="Оборот 2024"       value={formatUzsMln(1_200_000)} trend="base" />
                <MonthlyStat label="Оборот 2025"       value={formatUzsMln(1_350_000)} trend="+12.5%" />
                <MonthlyStat label="Оборот 2026 план"  value={formatUzsMln(1_520_000)} trend="+12.6%" />
                <MonthlyStat label="Сотрудники"         value="5 400" trend="+6.3%" />
                <MonthlyStat label="Постоянные"         value="5 100" trend="" />
                <MonthlyStat label="Сезонные"            value="300"   trend="" />
                <MonthlyStat label="Уставный фонд"       value="85 млн сум" trend="" />
                <MonthlyStat label="Банк"                value="Нацбанк ВЭД" trend="" />
              </div>
            </Card>
          </motion.div>
        )}

        {/* ═══════════════════════ IFI (Part 3) ═══════════════════════ */}
        {tab === 'ifi' && (
          <motion.div key="ifi" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="space-y-5">
            <Card padding="lg">
              <div className="flex items-start gap-3 mb-5">
                <div className="h-11 w-11 rounded-xl bg-gold/15 text-gold flex items-center justify-center shrink-0">
                  <Globe className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle>Объявления международных финансовых институтов</CardTitle>
                  <CardDescription className="mt-0.5">
                    Программы от ЕБРР, GIZ, IsDB и World Bank (KFW) — кредиты, гранты, менторство для чемпионов.
                    Чемпион выбирает программу → подаёт заявку → МЭФ отслеживает результат (ежемесячный отчёт).
                  </CardDescription>
                </div>
              </div>

              <div className="space-y-3">
                {IFI_ANNOUNCEMENTS.map((a, i) => (
                  <motion.div
                    key={a.id}
                    initial={{ opacity: 0, x: -8 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: '-40px' }}
                    transition={{ duration: 0.25, delay: i * 0.05 }}
                    className="p-4 rounded-xl border border-ink-line bg-bg-white hover:border-gold/40 transition-all"
                  >
                    <div className="flex items-start gap-3 flex-wrap">
                      <div className={`h-11 w-11 rounded-xl flex items-center justify-center shrink-0 font-serif font-bold text-xs ${
                        a.institution === 'EBRD'       ? 'bg-secondary/15 text-secondary' :
                        a.institution === 'GIZ'        ? 'bg-gold/15 text-gold-dark' :
                        a.institution === 'IsDB'       ? 'bg-success/15 text-success' :
                                                         'bg-navy/15 text-navy'
                      }`}>
                        {a.institution === 'World Bank' ? 'WB' : a.institution}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className="text-[10px] font-mono text-ink-muted">{a.id}</span>
                          {a.status === 'closing-soon' && <Badge variant="danger">срочно · до {a.deadline}</Badge>}
                          {a.status === 'open' && <Badge variant="success">открыто</Badge>}
                        </div>
                        <div className="font-serif font-semibold text-ink text-[14.5px] leading-tight">{a.title}</div>
                        <div className="text-[12px] text-ink-soft mt-1 leading-snug">{a.focus}</div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="font-serif text-sm font-bold text-gold">{a.amount}</div>
                        <div className="text-[10px] text-ink-muted mt-0.5">до {a.deadline}</div>
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-ink-line/60 flex items-center justify-between">
                      <span className="text-[11px] text-ink-muted">Только для реестра чемпионов</span>
                      <Button size="sm" leftIcon={<Send className="h-3.5 w-3.5" />}>
                        Подать заявку
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-4 p-3 rounded-lg bg-secondary/5 border border-secondary/20 text-[12px] text-ink-soft flex items-start gap-2">
                <Info className="h-3.5 w-3.5 text-secondary shrink-0 mt-0.5" />
                <span>
                  <strong className="text-ink">Ежемесячный отчёт:</strong> Департамент анализа МСБ МЭФ ежемесячно вносит результаты работы чемпионов с МФИ — одобренные кредиты, выделенные гранты, пройденные программы. Это формирует стратегическую картину для правительства.
                </span>
              </div>
            </Card>
          </motion.div>
        )}

        {/* ═══════════════════════ BANKS (Part 4) ═══════════════════════ */}
        {tab === 'banks' && (
          <motion.div key="banks" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="space-y-5">
            <Card padding="lg" className="border-gold/25 bg-gold-soft/20">
              <div className="flex items-start gap-3 mb-4">
                <div className="h-11 w-11 rounded-xl bg-gold text-white flex items-center justify-center shrink-0">
                  <Wallet className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle>VIP-клиент в коммерческих банках</CardTitle>
                  <CardDescription className="mt-0.5">
                    Каждый чемпион получает статус VIP-клиента в обслуживающем банке. Банки адресно работают с чемпионами, ведут прозрачный учёт всей финансовой помощи, разрабатывают предложения для перевода малого бизнеса в категорию чемпион.
                  </CardDescription>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-3 mt-5">
                <div className="p-4 rounded-xl bg-bg-white border border-gold/20">
                  <ShieldCheck className="h-5 w-5 text-gold mb-2" />
                  <div className="font-serif text-[14.5px] font-semibold text-ink">VIP-обслуживание</div>
                  <div className="text-[12px] text-ink-soft mt-1.5 leading-snug">
                    Персональный менеджер, приоритет в очередях, упрощённые процедуры, доступ к новым продуктам первыми.
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-bg-white border border-gold/20">
                  <DollarSign className="h-5 w-5 text-gold mb-2" />
                  <div className="font-serif text-[14.5px] font-semibold text-ink">Прозрачный учёт</div>
                  <div className="text-[12px] text-ink-soft mt-1.5 leading-snug">
                    Все виды финансовой помощи (кредиты, субсидии, гарантии) с суммой и целевым назначением видны в бэкенде МЭФ.
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-bg-white border border-gold/20">
                  <TrendingUp className="h-5 w-5 text-gold mb-2" />
                  <div className="font-serif text-[14.5px] font-semibold text-ink">Перевод в категорию</div>
                  <div className="text-[12px] text-ink-soft mt-1.5 leading-snug">
                    Банки разрабатывают предложения по поддержке перспективных МСБ для их перевода в реестр чемпионов.
                  </div>
                </div>
              </div>
            </Card>

            {/* Example pipeline */}
            <Card padding="lg">
              <CardTitle className="text-[16px] mb-4">Пример: финансовая помощь · «Samarkand Keramika»</CardTitle>
              <div className="space-y-2">
                {[
                  { type: 'Экспортный кредит',           amount: '4.8 млрд сум', bank: 'УзПромСтройБанк', purpose: 'Модернизация линии обжига', status: 'active',     date: 'март 2026' },
                  { type: 'Субсидия от GIZ · зелёная энергетика', amount: '€180 тыс',     bank: '—',               purpose: 'Солнечные панели на заводе', status: 'disbursed', date: 'февраль 2026' },
                  { type: 'Льготный лизинг',              amount: '1.2 млрд сум', bank: 'УзПромСтройБанк', purpose: 'Погрузочная техника',         status: 'active',     date: 'январь 2026' },
                  { type: 'Банковская гарантия',           amount: '850 млн сум',  bank: 'УзПромСтройБанк', purpose: 'Тендер Минобразования',       status: 'used',       date: 'декабрь 2025' },
                ].map((h, i) => (
                  <div key={i} className="p-3 rounded-lg border border-ink-line bg-bg-white flex items-center gap-3 flex-wrap">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-0.5">
                        <span className="text-sm font-medium text-ink">{h.type}</span>
                        <Badge variant={h.status === 'active' ? 'success' : h.status === 'disbursed' ? 'info' : 'outline'}>
                          {h.status === 'active' ? 'активен' : h.status === 'disbursed' ? 'выдан' : 'использован'}
                        </Badge>
                      </div>
                      <div className="text-[11.5px] text-ink-muted">
                        {h.bank !== '—' && `${h.bank} · `}{h.purpose} · {h.date}
                      </div>
                    </div>
                    <div className="font-mono font-semibold text-gold text-[13px] shrink-0">{h.amount}</div>
                  </div>
                ))}
              </div>

              <div className="mt-4 p-3 rounded-lg bg-bg-band/60 border border-ink-line text-[12px] text-ink-soft">
                Эта информация видна в <strong className="text-ink">бэкенде МЭФ</strong> для всех чемпионов — позволяет анализировать эффективность финансовой поддержки в масштабе страны. В открытом доступе — только общие истории успеха.
              </div>
            </Card>
          </motion.div>
        )}

        {/* ═══════════════════════ INQUIRIES (Part 5) ═══════════════════════ */}
        {tab === 'inquiries' && isAuthed && (
          <motion.div key="inquiries" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="space-y-5">
            <Card padding="lg">
              <div className="flex items-start gap-3 mb-5">
                <div className="h-11 w-11 rounded-xl bg-secondary/15 text-secondary flex items-center justify-center shrink-0">
                  <Send className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle>Обращения чемпионов в МЭФ</CardTitle>
                  <CardDescription className="mt-0.5">
                    Чемпионы авторизуются и отправляют предложения/проблемы. Департамент анализа МСБ МЭФ направляет ответственным, контролирует исполнение, ведёт статистику.
                  </CardDescription>
                </div>
              </div>

              {/* Submit form */}
              <div className="p-4 rounded-xl border-2 border-dashed border-gold/40 bg-gold-soft/20 mb-5">
                <div className="text-sm font-medium text-ink mb-2">Новое обращение</div>
                <textarea
                  rows={3}
                  placeholder="Опишите проблему, предложение или запрос. Например: «Запрос на налоговую каникулу для инвестиций в новый цех»"
                  className="w-full px-3 py-2 rounded-lg border border-ink-line bg-bg-white text-sm focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/30"
                />
                <div className="flex items-center justify-between mt-3 gap-3">
                  <select className="h-9 px-3 rounded-lg border border-ink-line bg-bg-white text-sm">
                    <option>Экспорт и ВЭД</option>
                    <option>Налоги и льготы</option>
                    <option>Финансирование</option>
                    <option>Регулирование</option>
                    <option>Кадры и обучение</option>
                    <option>Другое</option>
                  </select>
                  <Button size="sm" leftIcon={<Send className="h-3.5 w-3.5" />}>
                    Отправить в МЭФ
                  </Button>
                </div>
              </div>

              {/* My inquiries */}
              <div className="text-[11px] uppercase tracking-wider text-ink-muted font-semibold mb-2">
                Мои обращения ({MY_INQUIRIES.length})
              </div>
              <div className="space-y-2">
                {MY_INQUIRIES.map((inq) => {
                  const statusStyle =
                    inq.status === 'answered'    ? 'bg-success/10 text-success border-success/30' :
                    inq.status === 'in-progress' ? 'bg-gold/10 text-gold-dark border-gold/30' :
                    inq.status === 'routed'      ? 'bg-secondary/10 text-secondary border-secondary/30' :
                                                   'bg-bg-band text-ink-muted border-ink-line';
                  return (
                    <div key={inq.id} className="p-3 rounded-lg border border-ink-line bg-bg-white">
                      <div className="flex items-start justify-between gap-3 mb-2 flex-wrap">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[10px] font-mono text-ink-muted">{inq.id}</span>
                            <span className="text-[11px] text-ink-muted">· {inq.submittedAt}</span>
                          </div>
                          <div className="text-sm text-ink mt-1">{inq.subject}</div>
                          {inq.routedTo && (
                            <div className="text-[11.5px] text-ink-muted mt-0.5 flex items-center gap-1">
                              <ArrowRight className="h-3 w-3" /> {inq.routedTo}
                            </div>
                          )}
                        </div>
                        <div className={`px-2.5 py-1 rounded-md border text-[11px] font-medium shrink-0 ${statusStyle}`}>
                          {inq.statusLabel}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* Process explanation */}
            <Card padding="lg" className="border-secondary/25 bg-secondary/5">
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 text-secondary shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <div className="font-serif font-semibold text-ink">Процесс обращения</div>
                  <ol className="mt-2 space-y-1.5 text-[13px] text-ink-soft">
                    <li className="flex items-start gap-2">
                      <span className="h-5 w-5 rounded-full bg-secondary/15 text-secondary font-serif font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">1</span>
                      <span>Чемпион авторизуется через OneID и отправляет обращение</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="h-5 w-5 rounded-full bg-secondary/15 text-secondary font-serif font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">2</span>
                      <span>Департамент МЭФ определяет ответственное ведомство (или берёт в работу сам)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="h-5 w-5 rounded-full bg-secondary/15 text-secondary font-serif font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">3</span>
                      <span>Обращение направляется по интеграции E-Ijro (в Ф3) или вручную через админку</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="h-5 w-5 rounded-full bg-secondary/15 text-secondary font-serif font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">4</span>
                      <span>Исполнение контролируется; статистика ведётся для политики правительства</span>
                    </li>
                  </ol>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Champion detail modal */}
      <AnimatePresence>
        {selectedChampion && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setSelectedChampion(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto"
            >
              <div className="p-6 border-b border-ink-line">
                <div className="flex items-start justify-between gap-3 mb-3 flex-wrap">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <Badge variant={selectedChampion.level === 'republican' ? 'priority-solid' : selectedChampion.level === 'regional' ? 'info' : 'outline'}>
                        {selectedChampion.level === 'republican' ? 'Республиканский' : selectedChampion.level === 'regional' ? 'Региональный' : 'Районный'}
                      </Badge>
                      <span className="text-[11px] font-mono text-ink-muted">{selectedChampion.id}</span>
                    </div>
                    <CardTitle className="text-[20px]">{selectedChampion.brand}</CardTitle>
                    <CardDescription className="text-[13px] mt-0.5">{selectedChampion.companyName}</CardDescription>
                  </div>
                  <button onClick={() => setSelectedChampion(null)} className="text-ink-muted hover:text-ink shrink-0 text-2xl leading-none">×</button>
                </div>

                {/* Story */}
                <div className="p-3 rounded-lg bg-gold-soft/40 border border-gold/20 text-[13px] text-ink-soft leading-relaxed">
                  <strong className="text-ink">История:</strong> {selectedChampion.story}
                </div>
              </div>

              <div className="p-6 space-y-4">
                {/* Company info grid */}
                <div className="grid sm:grid-cols-2 gap-3">
                  <DetailRow label="Форма собственности" value={selectedChampion.ownershipForm} />
                  <DetailRow label="Год основания"        value={String(selectedChampion.foundedYear)} />
                  <DetailRow label="Отрасль + ОКЭД"       value={`${selectedChampion.industry} · ${selectedChampion.oked}`} />
                  <DetailRow label="Регион"                value={`${selectedChampion.region}${selectedChampion.district ? `, ${selectedChampion.district}` : ''}`} />
                  <DetailRow label="СТИР"                   value={selectedChampion.stir} />
                  <DetailRow label="Обслуживающий банк"   value={selectedChampion.bank} />
                </div>

                {/* Director */}
                <div className="p-3 rounded-lg border border-ink-line bg-bg-band/30">
                  <div className="text-[11px] uppercase tracking-wider text-ink-muted font-semibold mb-2">Руководитель</div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <div className="flex items-center gap-1.5 text-sm text-ink">
                      <Users2 className="h-4 w-4 text-gold" />
                      {selectedChampion.directorName}
                    </div>
                    <Badge variant="outline">{selectedChampion.directorGender === 'Ж' ? '♀ Женщина' : '♂ Мужчина'}</Badge>
                    <div className="flex items-center gap-1.5 text-sm text-gold">
                      <Phone className="h-3.5 w-3.5" />
                      {selectedChampion.phone}
                    </div>
                  </div>
                </div>

                {/* Financials (backend-level but shown in demo) */}
                <div>
                  <div className="text-[11px] uppercase tracking-wider text-ink-muted font-semibold mb-2">
                    Финансовые показатели · ежемесячно обновляется через Soliq
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <StatMini label="Оборот 2024"  value={formatUzsMln(selectedChampion.turnover2024)} />
                    <StatMini label="Оборот 2025"  value={formatUzsMln(selectedChampion.turnover2025)} />
                    <StatMini label="Оборот 2026 план" value={formatUzsMln(selectedChampion.turnover2026)} />
                    <StatMini label="Уставный фонд"     value={formatUzsMln(selectedChampion.charterFund)} />
                    <StatMini label="Всего сотрудников"  value={selectedChampion.employeesTotal.toLocaleString('ru')} />
                    <StatMini label="Постоянные"          value={selectedChampion.employeesPermanent.toLocaleString('ru')} />
                  </div>
                </div>

                {selectedChampion.exportCountries && selectedChampion.exportCountries.length > 0 && (
                  <div>
                    <div className="text-[11px] uppercase tracking-wider text-ink-muted font-semibold mb-2">Экспортные рынки</div>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedChampion.exportCountries.map((c) => (
                        <span key={c} className="text-[11.5px] px-2 py-1 rounded-md bg-success/10 text-success font-medium">
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {selectedChampion.mfiPartner && (
                  <div className="p-3 rounded-lg bg-secondary/5 border border-secondary/20 flex items-center gap-2 text-[12px] text-ink-soft">
                    <Globe className="h-3.5 w-3.5 text-secondary shrink-0" />
                    <span>Партнёр МФИ: <strong className="text-ink">{selectedChampion.mfiPartner}</strong></span>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer callout */}
      <Card padding="lg" className="border-success/25 bg-success/[0.03]">
        <div className="flex items-start gap-4 flex-wrap">
          <div className="h-10 w-10 rounded-lg bg-success/10 text-success flex items-center justify-center shrink-0">
            <Sparkles className="h-5 w-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-serif font-semibold text-ink">Правовое основание и оператор</div>
            <CardDescription className="mt-1">
              Модуль реализует пункт 6 Указа Президента РУз <strong>ПФ-50 от 19.03.2025</strong>. Оператор — Департамент анализа, поддержки и координации государственной политики развития малого и среднего бизнеса МЭФ.
            </CardDescription>
            <div className="mt-3 grid sm:grid-cols-3 gap-2">
              <Link href="/modules/registry" className="text-xs text-gold hover:text-gold-dark inline-flex items-center gap-1">
                Реестр мер поддержки <ArrowRight className="h-3 w-3" />
              </Link>
              <Link href="/modules/nExport" className="text-xs text-gold hover:text-gold-dark inline-flex items-center gap-1">
                Экспортный навигатор <ArrowRight className="h-3 w-3" />
              </Link>
              <Link href="/modules/comms" className="text-xs text-gold hover:text-gold-dark inline-flex items-center gap-1">
                B2G коммуникация · обращения <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </div>
      </Card>
    </section>
  );
}

// ─── Helper components ─────────────────────────────────────
function KpiCard({ label, value, note, Icon }: { label: string; value: string; note: string; Icon: typeof Trophy }) {
  return (
    <Card>
      <div className="flex items-start justify-between mb-2">
        <Icon className="h-5 w-5 text-gold" />
      </div>
      <div className="kpi-number text-navy text-[26px]">{value}</div>
      <div className="text-sm text-ink-muted mt-1">{label}</div>
      <div className="text-[11px] text-ink-muted mt-1 italic">{note}</div>
    </Card>
  );
}

function TabButton({ children, active, onClick, disabled }: { children: React.ReactNode; active: boolean; onClick: () => void; disabled?: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-all inline-flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed ${
        active ? 'border-gold text-gold-dark' : 'border-transparent text-ink-muted hover:text-ink hover:border-ink-line'
      }`}
    >
      {children}
    </button>
  );
}

function MonthlyStat({ label, value, trend }: { label: string; value: string; trend: string }) {
  return (
    <div className="p-3 rounded-lg border border-ink-line bg-bg-white">
      <div className="text-[10px] uppercase tracking-wider text-ink-muted font-semibold">{label}</div>
      <div className="font-serif text-lg font-bold text-navy mt-0.5">{value}</div>
      {trend && <div className={`text-[11px] mt-0.5 ${trend.startsWith('+') ? 'text-success' : 'text-ink-muted'}`}>{trend}</div>}
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-2.5 rounded-lg bg-bg-band/40 border border-ink-line/60">
      <div className="text-[10px] uppercase tracking-wider text-ink-muted font-semibold">{label}</div>
      <div className="text-sm text-ink font-medium mt-0.5">{value}</div>
    </div>
  );
}

function StatMini({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-2.5 rounded-lg bg-bg-band/40 border border-ink-line/60 text-center">
      <div className="text-[10px] uppercase tracking-wider text-ink-muted font-semibold leading-tight">{label}</div>
      <div className="font-serif text-[14px] font-bold text-gold mt-0.5">{value}</div>
    </div>
  );
}
