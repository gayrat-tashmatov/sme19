'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Gavel, Filter, Search, MapPin, Clock, Building, TrendingUp, Sparkles,
  CheckCircle2, ExternalLink, Bookmark, BellRing, X, History, Trophy,
  FileText, AlertCircle, ChevronDown,
} from 'lucide-react';
import { Card, CardTitle, CardDescription } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { PhaseRoadmapStrip } from '@/components/sections/PhaseRoadmapStrip';
import { useStore } from '@/lib/store';

// ═══════════════════════════════════════════════════════════════════
// Sprint 5 · Deep procurement search — tenders from xarid.uzex.uz + 6 agency platforms
// ═══════════════════════════════════════════════════════════════════

interface Tender {
  id: string;
  title: string;
  customer: string;
  sector: string;
  oked: string;
  region: string;
  value: number;
  smeQuota: boolean;
  daysLeft: number;
  matchPct: number;
  platform: 'xarid' | 'customs' | 'moh' | 'agency' | 'hokimiat';
  tags: string[];
  deadlineISO: string;
}

const TENDERS: Tender[] = [
  { id: 'UZ-2026-004-7821', title: 'Поставка офисной мебели для областной администрации',     customer: 'Хокимият Ферганской области',     sector: 'Мебель',                oked: '31.01', region: 'Фергана',     value: 820_000_000, smeQuota: true,  daysLeft: 9,  matchPct: 92, platform: 'hokimiat', tags: ['новое', 'МСБ-квота'],   deadlineISO: '2026-05-02' },
  { id: 'UZ-2026-004-7794', title: 'Пошив униформы · 1200 комплектов',                         customer: 'Министерство здравоохранения',     sector: 'Лёгкая промышленность', oked: '14.12', region: 'Ташкент',     value: 1_450_000_000, smeQuota: true, daysLeft: 14, matchPct: 84, platform: 'moh',      tags: ['МСБ-квота', 'оплата 30д'], deadlineISO: '2026-05-07' },
  { id: 'UZ-2026-004-7712', title: 'Разработка сайта и мобильного приложения',                 customer: 'Агентство государственных услуг',  sector: 'IT-услуги',             oked: '62.01', region: 'Ташкент',     value: 680_000_000, smeQuota: true, daysLeft: 5,  matchPct: 78, platform: 'agency',   tags: ['МСБ-квота', 'срочно'],   deadlineISO: '2026-04-28' },
  { id: 'UZ-2026-004-7688', title: 'Услуги клининга офисных помещений',                        customer: 'Государственная налоговая служба', sector: 'Клининг',               oked: '81.21', region: 'Самарканд',   value: 340_000_000, smeQuota: true, daysLeft: 21, matchPct: 58, platform: 'xarid',    tags: ['МСБ-квота'],              deadlineISO: '2026-05-14' },
  { id: 'UZ-2026-004-7641', title: 'Продукты питания для дома-интерната',                      customer: 'Министерство занятости',           sector: 'Пищевая продукция',     oked: '10.51', region: 'Хорезм',      value: 215_000_000, smeQuota: true, daysLeft: 11, matchPct: 45, platform: 'xarid',    tags: ['МСБ-квота'],              deadlineISO: '2026-05-04' },
  { id: 'UZ-2026-004-7602', title: 'Текстильные изделия для детских садов',                   customer: 'Министерство дошкольного образования', sector: 'Лёгкая промышленность', oked: '13.92', region: 'Наманган',    value: 680_000_000, smeQuota: true, daysLeft: 18, matchPct: 72, platform: 'agency',   tags: ['МСБ-квота'],              deadlineISO: '2026-05-11' },
  { id: 'UZ-2026-004-7588', title: 'Поставка канцелярии для университета',                     customer: 'Ташкентский государственный университет', sector: 'Канцтовары',       oked: '46.49', region: 'Ташкент',     value: 45_000_000,  smeQuota: true, daysLeft: 7,  matchPct: 38, platform: 'agency',   tags: ['МСБ-квота', 'малая сумма'], deadlineISO: '2026-04-30' },
  { id: 'UZ-2026-004-7544', title: 'Грузоперевозки по области',                                customer: 'Хокимият Самаркандской области',   sector: 'Логистика',             oked: '49.41', region: 'Самарканд',   value: 1_200_000_000, smeQuota: true, daysLeft: 30, matchPct: 62, platform: 'hokimiat', tags: ['МСБ-квота', 'долгосрочно'], deadlineISO: '2026-05-23' },
  { id: 'UZ-2026-004-7501', title: 'Ремонт административных зданий',                           customer: 'Хокимият Джизакской области',       sector: 'Строительство',         oked: '43.39', region: 'Джизак',      value: 2_100_000_000, smeQuota: false, daysLeft: 42, matchPct: 0,  platform: 'hokimiat', tags: ['без квоты'],                deadlineISO: '2026-06-04' },
  { id: 'UZ-2026-004-7489', title: 'Медоборудование для фельдшерских пунктов',                customer: 'Министерство здравоохранения',     sector: 'Медтехника',           oked: '46.46', region: 'Каракалпакстан', value: 540_000_000, smeQuota: true, daysLeft: 25, matchPct: 28, platform: 'moh',      tags: ['МСБ-квота', 'спецификация'], deadlineISO: '2026-05-18' },
  { id: 'UZ-2026-004-7445', title: 'Хлопок-волокно для текстильного кластера',                 customer: 'ГУП «Узбекхлопкопром»',            sector: 'АПК',                   oked: '01.16', region: 'Кашкадарья',  value: 5_800_000_000, smeQuota: false, daysLeft: 38, matchPct: 0,  platform: 'xarid',    tags: ['крупный контракт'],         deadlineISO: '2026-05-31' },
  { id: 'UZ-2026-004-7398', title: 'Бухгалтерские услуги на год',                             customer: 'Центр занятости населения',         sector: 'Проф. услуги',          oked: '69.20', region: 'Бухара',      value: 92_000_000,  smeQuota: true, daysLeft: 12, matchPct: 54, platform: 'agency',   tags: ['МСБ-квота', 'услуги'],     deadlineISO: '2026-05-05' },
];

interface SavedSearch { id: string; name: string; filters: string; count: number }

const SAVED_SEARCHES: SavedSearch[] = [
  { id: 'ss-1', name: 'Текстиль + Ташкент + до 1 млрд',       filters: 'ОКЭД 13.x · Ташкентская обл. · ≤ 1 млрд сум', count: 6 },
  { id: 'ss-2', name: 'IT-услуги с квотой МСБ',                filters: 'ОКЭД 62.x · Любой регион · квота МСБ',        count: 18 },
  { id: 'ss-3', name: 'Мебель и канцтовары',                   filters: 'ОКЭД 31.x, 46.49 · ≤ 500 млн сум',            count: 4 },
];

interface MyApplication { id: string; tenderId: string; tenderTitle: string; submittedAt: string; status: 'submitted' | 'reviewing' | 'won' | 'lost'; statusLabel: string; value: number }

const MY_APPLICATIONS: MyApplication[] = [
  { id: 'APP-2026-0401', tenderId: 'UZ-2026-003-6182', tenderTitle: 'Поставка текстильных изделий для школ Наманганской обл.', submittedAt: '12 апр 2026', status: 'reviewing', statusLabel: 'На рассмотрении',                 value: 340_000_000 },
  { id: 'APP-2026-0328', tenderId: 'UZ-2026-002-5441', tenderTitle: 'Униформа для сотрудников социальной службы',                submittedAt: '28 мар 2026', status: 'won',       statusLabel: 'Победа · контракт подписан',    value: 480_000_000 },
  { id: 'APP-2026-0315', tenderId: 'UZ-2026-002-5221', tenderTitle: 'Спецодежда для коммунальных служб',                         submittedAt: '15 мар 2026', status: 'lost',      statusLabel: 'Проиграно конкуренту',           value: 285_000_000 },
];

const STATS = [
  { label: 'Активных тендеров с квотой МСБ', value: '4 280', delta: '+182 за неделю' },
  { label: 'Обязательная доля МСБ в 2026',    value: '25%',   delta: 'по законодательству' },
  { label: 'Средний размер контракта МСБ',    value: '~ 680 млн сум', delta: '+12% к 2025' },
  { label: 'Площадок в агрегаторе',           value: '7',     delta: 'xarid.uz + 6 ведомственных' },
];

function formatUzs(v: number): string {
  if (v >= 1_000_000_000) return `${(v / 1_000_000_000).toFixed(2)} млрд сум`;
  if (v >= 1_000_000)     return `${(v / 1_000_000).toFixed(0)} млн сум`;
  return v.toLocaleString('ru') + ' сум';
}

export function N_Procurement() {
  const role = useStore((s) => s.role);
  const isAuthed = role !== 'guest';

  const [sector, setSector] = useState<string | null>(null);
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [valueRange, setValueRange] = useState<string>('any');
  const [region, setRegion] = useState<string>('any');
  const [deadline, setDeadline] = useState<string>('any');
  const [onlyQuota, setOnlyQuota] = useState(false);

  const filtered = useMemo(() => {
    return TENDERS.filter((t) => {
      if (sector && t.sector !== sector) return false;
      if (region !== 'any' && t.region !== region) return false;
      if (onlyQuota && !t.smeQuota) return false;
      if (valueRange === 'sub-100m' && t.value >= 100_000_000) return false;
      if (valueRange === '100m-500m' && (t.value < 100_000_000 || t.value > 500_000_000)) return false;
      if (valueRange === '500m-1b' && (t.value < 500_000_000 || t.value > 1_000_000_000)) return false;
      if (valueRange === '1b-plus' && t.value < 1_000_000_000) return false;
      if (deadline === 'week' && t.daysLeft > 7) return false;
      if (deadline === 'two-weeks' && t.daysLeft > 14) return false;
      if (deadline === 'month' && t.daysLeft > 30) return false;
      return true;
    });
  }, [sector, region, onlyQuota, valueRange, deadline]);

  const platformLabels: Record<Tender['platform'], string> = {
    xarid:    'xarid.uzex.uz',
    customs:  'customs.uz',
    moh:      'zdrav.uz',
    agency:   'ведомственная',
    hokimiat: 'хокимият-площадка',
  };

  return (
    <section className="container-wide py-10 md:py-14 space-y-8">
      <Card padding="lg" tone="navy" className="text-white relative overflow-hidden">
        <div className="absolute inset-0 pattern-dots opacity-30 pointer-events-none" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-3">
            <Badge variant="new">NEW</Badge>
            <span className="text-xs uppercase tracking-wider text-gold-light">Глубокий поиск · xarid.uzex.uz + 6 ведомственных площадок</span>
          </div>
          <h2 className="font-serif text-2xl md:text-3xl text-white mb-2">
            Государственные закупки для МСБ — глубокий поиск тендеров
          </h2>
          <p className="text-white/75 max-w-2xl text-sm">
            Не витрина-агрегатор, а полноценный поисковый движок: фильтры по ОКЭД, региону, сумме, сроку подачи,
            площадке. Сохранение запросов, Telegram-уведомления о новых тендерах по вашему профилю,
            автоматическая сверка на квоту МСБ 25%.
          </p>
        </div>
      </Card>

      <PhaseRoadmapStrip
        embedded
        currentPhase={2}
        points={[
          { phase: 2, text: 'Витрина + глубокие фильтры по ОКЭД, региону, сумме, сроку' },
          { phase: 2, text: 'Сохранённые запросы с Telegram-уведомлениями' },
          { phase: 2, text: 'История подач предпринимателя, статистика побед/проигрышей' },
          { phase: 2, text: 'Обсуждение с Агентством госзакупок по формату интеграции' },
          { phase: 3, text: 'Полная интеграция с xarid.uzex.uz — подача заявок без ухода с Платформы', blockedBy: 'соглашение с Агентством госзакупок' },
          { phase: 3, text: 'Автоподтягивание всех 7 площадок через единый индекс' },
          { phase: 4, text: 'AI-assistant: проверка комплекта документов, шаблоны заявок, прогноз шансов на победу' },
        ]}
      />

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: i * 0.05 }}>
            <Card>
              <div className="flex items-start justify-between mb-2">
                <Gavel className="h-5 w-5 text-gold" />
                <TrendingUp className="h-3.5 w-3.5 text-success" />
              </div>
              <div className="kpi-number text-navy">{s.value}</div>
              <div className="text-sm text-ink-muted mt-1">{s.label}</div>
              <div className="text-xs text-ink-muted mt-1 italic">{s.delta}</div>
            </Card>
          </motion.div>
        ))}
      </div>

      {isAuthed && (
        <Card padding="lg" className="border-gold/25 bg-gold-soft/20">
          <div className="flex items-start justify-between gap-4 mb-4 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 rounded-xl bg-gold/15 text-gold flex items-center justify-center">
                <History className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-[17px]">Мои заявки и результаты</CardTitle>
                <CardDescription className="text-[13px]">
                  История подачи заявок на тендеры и статус каждой. В Ф3 — автоматическая синхронизация с xarid.uzex.uz.
                </CardDescription>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="text-right">
                <div className="font-serif text-xl font-semibold text-navy">{MY_APPLICATIONS.length}</div>
                <div className="text-[10px] uppercase tracking-wider text-ink-muted">подано</div>
              </div>
              <div className="text-right">
                <div className="font-serif text-xl font-semibold text-success">
                  {MY_APPLICATIONS.filter((a) => a.status === 'won').length}
                </div>
                <div className="text-[10px] uppercase tracking-wider text-ink-muted">побед</div>
              </div>
              <div className="text-right">
                <div className="font-serif text-xl font-semibold text-gold">
                  {Math.round(MY_APPLICATIONS.filter((a) => a.status === 'won').length / MY_APPLICATIONS.length * 100)}%
                </div>
                <div className="text-[10px] uppercase tracking-wider text-ink-muted">win-rate</div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            {MY_APPLICATIONS.map((a) => {
              const statusStyle =
                a.status === 'won'       ? 'bg-success/10 text-success border-success/30' :
                a.status === 'lost'      ? 'bg-danger/10 text-danger border-danger/30' :
                a.status === 'reviewing' ? 'bg-gold/10 text-gold-dark border-gold/30' :
                                           'bg-bg-band text-ink-muted border-ink-line';
              return (
                <div key={a.id} className="p-3 rounded-lg border border-ink-line bg-bg-white flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="text-[10px] font-mono text-ink-muted">{a.id}</span>
                      <span className="text-[11px] text-ink-muted">· {a.submittedAt}</span>
                      {a.status === 'won' && <Trophy className="h-3.5 w-3.5 text-success" />}
                    </div>
                    <div className="text-sm font-medium text-ink leading-tight">{a.tenderTitle}</div>
                    <div className="text-[11px] text-gold font-medium mt-1">{formatUzs(a.value)}</div>
                  </div>
                  <div className={`px-2.5 py-1 rounded-md border text-[11px] font-medium shrink-0 ${statusStyle}`}>
                    {a.statusLabel}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {isAuthed && (
        <Card padding="lg">
          <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Bookmark className="h-5 w-5 text-gold" />
              <CardTitle className="text-[16px]">Сохранённые запросы</CardTitle>
            </div>
            <Button size="sm" variant="ghost" leftIcon={<BellRing className="h-3.5 w-3.5" />}>
              + Сохранить текущий фильтр
            </Button>
          </div>
          <div className="grid md:grid-cols-3 gap-3">
            {SAVED_SEARCHES.map((s) => (
              <div key={s.id} className="p-3 rounded-lg border border-ink-line bg-bg-white hover:border-gold/40 transition-all">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div className="text-sm font-medium text-ink leading-tight">{s.name}</div>
                  <button className="text-ink-muted hover:text-danger shrink-0">
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
                <div className="text-[11px] text-ink-muted mb-2">{s.filters}</div>
                <div className="flex items-center justify-between pt-2 border-t border-ink-line/60">
                  <span className="text-[11px] text-gold font-medium">{s.count} актуальных тендеров</span>
                  <span className="text-[10px] text-success flex items-center gap-1">
                    <BellRing className="h-3 w-3" /> уведомления в Telegram
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      <Card padding="lg">
        <div className="flex items-center gap-2 mb-4">
          <Search className="h-5 w-5 text-gold" />
          <CardTitle className="text-[16px]">Найти подходящий тендер</CardTitle>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          <div className="flex-1 min-w-[240px] relative">
            <Search className="h-4 w-4 text-ink-muted absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              placeholder="Поиск по заказчику, описанию, ключевому слову…"
              className="w-full pl-9 pr-3 h-10 rounded-lg border border-ink-line bg-bg-white text-sm focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/30"
            />
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            <Filter className="h-4 w-4 text-ink-muted mx-1" />
            {['Все', 'Мебель', 'Лёгкая промышленность', 'IT-услуги', 'Клининг', 'Пищевая продукция'].map((s) => {
              const active = (s === 'Все' && !sector) || s === sector;
              return (
                <button
                  key={s}
                  onClick={() => setSector(s === 'Все' ? null : s)}
                  className={`h-8 px-3 rounded-full text-xs font-medium transition-colors border ${
                    active ? 'bg-gold text-white border-gold' : 'bg-bg-white text-ink-muted border-ink-line hover:border-gold hover:text-gold'
                  }`}
                >
                  {s}
                </button>
              );
            })}
          </div>
        </div>

        <button
          onClick={() => setAdvancedOpen(!advancedOpen)}
          className="text-sm text-gold hover:text-gold-dark font-medium flex items-center gap-1 mb-3"
        >
          {advancedOpen ? 'Скрыть' : 'Развернуть'} продвинутые фильтры
          <ChevronDown className={`h-3.5 w-3.5 transition-transform ${advancedOpen ? 'rotate-180' : ''}`} />
        </button>

        {advancedOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.25 }}
            className="p-4 rounded-xl bg-bg-band/40 border border-ink-line mb-4 overflow-hidden"
          >
            <div className="grid md:grid-cols-4 gap-3">
              <Select
                label="Размер контракта"
                value={valueRange}
                onChange={(e) => setValueRange(e.target.value)}
                options={[
                  { value: 'any',       label: 'Любой' },
                  { value: 'sub-100m',  label: '< 100 млн сум' },
                  { value: '100m-500m', label: '100 – 500 млн' },
                  { value: '500m-1b',   label: '500 млн – 1 млрд' },
                  { value: '1b-plus',   label: '> 1 млрд сум' },
                ]}
              />
              <Select
                label="Регион"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                options={[
                  { value: 'any',            label: 'Любой регион' },
                  { value: 'Ташкент',        label: 'г. Ташкент' },
                  { value: 'Самарканд',      label: 'Самарканд' },
                  { value: 'Фергана',        label: 'Фергана' },
                  { value: 'Наманган',       label: 'Наманган' },
                  { value: 'Бухара',         label: 'Бухара' },
                  { value: 'Хорезм',         label: 'Хорезм' },
                  { value: 'Кашкадарья',     label: 'Кашкадарья' },
                  { value: 'Каракалпакстан', label: 'Каракалпакстан' },
                  { value: 'Джизак',         label: 'Джизак' },
                ]}
              />
              <Select
                label="Срок подачи"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                options={[
                  { value: 'any',       label: 'Любой' },
                  { value: 'week',      label: 'До 7 дней' },
                  { value: 'two-weeks', label: 'До 14 дней' },
                  { value: 'month',     label: 'До 30 дней' },
                ]}
              />
              <div className="flex items-end">
                <label className="flex items-center gap-2 h-10 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={onlyQuota}
                    onChange={(e) => setOnlyQuota(e.target.checked)}
                    className="h-4 w-4 rounded border-ink-line text-gold focus:ring-gold/30"
                  />
                  <span className="text-sm text-ink">Только с квотой МСБ</span>
                </label>
              </div>
            </div>
          </motion.div>
        )}

        <div className="flex items-center justify-between mb-3 text-xs text-ink-muted">
          <span>
            Найдено <strong className="text-ink">{filtered.length}</strong> тендер(ов)
          </span>
          {filtered.length !== TENDERS.length && (
            <button
              onClick={() => { setSector(null); setValueRange('any'); setRegion('any'); setDeadline('any'); setOnlyQuota(false); }}
              className="text-gold hover:text-gold-dark font-medium"
            >
              Сбросить все фильтры
            </button>
          )}
        </div>

        <div className="space-y-3">
          {filtered.length === 0 && (
            <div className="p-10 text-center text-ink-muted">
              <Filter className="h-8 w-8 mx-auto mb-3 opacity-40" />
              <div>Под ваши фильтры ничего не найдено. Попробуйте ослабить критерии или сохраните запрос — уведомим, когда появится подходящий тендер.</div>
            </div>
          )}
          {filtered.map((t) => (
            <div key={t.id} className="p-4 rounded-xl border border-ink-line hover:border-gold/40 bg-bg-white transition-all">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="text-xs font-mono text-ink-muted">{t.id}</span>
                    <span className="text-[10px] uppercase tracking-wider text-ink-muted">· ОКЭД {t.oked}</span>
                    {t.smeQuota && <Badge variant="priority-solid">квота МСБ</Badge>}
                    {t.daysLeft <= 7 && <Badge variant="danger">осталось {t.daysLeft} дн</Badge>}
                    {t.matchPct >= 85 && <Badge variant="success">{t.matchPct}% match</Badge>}
                  </div>
                  <div className="font-serif text-[16px] text-ink leading-snug">{t.title}</div>
                  <div className="text-xs text-ink-muted mt-1">{t.customer}</div>
                </div>
                <div className="text-right shrink-0">
                  <div className="font-serif text-[17px] text-gold font-semibold">{formatUzs(t.value)}</div>
                  <div className="text-xs text-ink-muted mt-0.5">{t.sector}</div>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs text-ink-muted mt-3 pt-3 border-t border-ink-line/50 flex-wrap">
                <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {t.region}</span>
                <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> до {t.daysLeft} дн · {t.deadlineISO}</span>
                <span className="flex items-center gap-1"><Building className="h-3 w-3" /> {platformLabels[t.platform]}</span>
                <div className="flex-1" />
                <Button size="sm" variant="ghost" leftIcon={<Bookmark className="h-3.5 w-3.5" />}>В избранное</Button>
                <Button size="sm" leftIcon={<ExternalLink className="h-3.5 w-3.5" />}>Подать заявку</Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <div className="grid lg:grid-cols-3 gap-4">
        <Card>
          <div className="h-10 w-10 rounded-lg bg-gold/15 text-gold flex items-center justify-center mb-3">
            <span className="font-serif font-bold">1</span>
          </div>
          <CardTitle className="text-[16px]">Регистрация на площадке</CardTitle>
          <CardDescription className="mt-1.5">
            Через OneID — автоматическое подключение к xarid.uzex.uz и 6 ведомственным площадкам.
          </CardDescription>
        </Card>
        <Card>
          <div className="h-10 w-10 rounded-lg bg-gold/15 text-gold flex items-center justify-center mb-3">
            <span className="font-serif font-bold">2</span>
          </div>
          <CardTitle className="text-[16px]">Подбор тендеров</CardTitle>
          <CardDescription className="mt-1.5">
            Автофильтр по отрасли, размеру, региону. Уведомления о новых подходящих закупках.
          </CardDescription>
        </Card>
        <Card>
          <div className="h-10 w-10 rounded-lg bg-gold/15 text-gold flex items-center justify-center mb-3">
            <span className="font-serif font-bold">3</span>
          </div>
          <CardTitle className="text-[16px]">Подача заявки</CardTitle>
          <CardDescription className="mt-1.5">
            Шаблоны документов, автозаполнение из цифрового профиля бизнеса, помощь AI-ассистента (Ф4).
          </CardDescription>
        </Card>
      </div>

      <Card padding="lg" className="border-success/25 bg-success/[0.03]">
        <div className="flex items-start gap-4">
          <div className="h-10 w-10 rounded-lg bg-success/10 text-success flex items-center justify-center shrink-0">
            <Sparkles className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <div className="font-serif font-semibold text-ink">Глубокий модуль, не витрина-агрегатор</div>
            <CardDescription className="mt-1">
              Референсы — «Доступ к закупкам крупных госкомпаний» на мсп.рф, Enterprise Singapore Government eMarketplace.
              Решено: делаем полноценный поисковый интерфейс с сохранением запросов, уведомлениями и историей подач —
              а не просто каталог со ссылками. Интеграция с xarid.uzex.uz и biznes-portal.uz в Ф3 по соглашению с Агентством госзакупок.
            </CardDescription>
            <div className="mt-3 flex gap-2 flex-wrap">
              <Badge variant="new">NEW · общая очередь</Badge>
              <Badge variant="outline">Требует соглашения с Агентством госзакупок</Badge>
              <Badge variant="outline">Связан с модулями (б), (в), B2G</Badge>
            </div>
          </div>
        </div>
      </Card>
    </section>
  );
}
