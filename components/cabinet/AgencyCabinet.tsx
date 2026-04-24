'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Cell,
} from 'recharts';
import {
  Inbox, Clock, AlertCircle, CheckCircle2, Filter, Search, ChevronRight,
  Wallet, Wheat, Activity, DatabaseZap, Sparkles, MessageSquare, Building2,
} from 'lucide-react';
import { Card, CardTitle, CardDescription } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/Progress';
import { StatusPill } from '@/components/ui/StatusPill';
import { CabinetHero } from './CabinetHero';
import {
  MINAGRI_INBOX, MINAGRI_MEASURES,
  type AgencyInquiry, type AgencyInquiryStatus,
} from '@/lib/data/agency_inbox';

// ─────────────────────────────────────────────────────────
// KPI band
// ─────────────────────────────────────────────────────────
const WEEKLY_KPI = [
  { label: 'Обращений за неделю',              value: 43,    delta: '+8 к прошлой неделе',    positive: true,  Icon: MessageSquare },
  { label: 'SLA просрочено',                    value: 2,     delta: 'требуется ответ сегодня', positive: false, Icon: AlertCircle },
  { label: 'Активных заявок на программы',      value: 877,   delta: '+124 за неделю',          positive: true,  Icon: Wallet },
  { label: 'Получателей субсидий в 2026',       value: 2147,  delta: '+287 за квартал',         positive: true,  Icon: Wheat },
];

// ─────────────────────────────────────────────────────────
// Applications by region (for chart)
// ─────────────────────────────────────────────────────────
const REGIONAL_APPLICATIONS = [
  { name: 'Кашкадарья',   value: 184 },
  { name: 'Самарканд',    value: 152 },
  { name: 'Фергана',      value: 138 },
  { name: 'Ташкентская',  value: 121 },
  { name: 'Андижан',      value: 98 },
  { name: 'Хорезм',       value: 84 },
  { name: 'Бухара',       value: 71 },
  { name: 'Сурхандарья',  value: 62 },
  { name: 'Джизак',       value: 48 },
  { name: 'Каракалпакстан', value: 38 },
  { name: 'Сырдарья',     value: 26 },
  { name: 'Наманган',     value: 52 },
  { name: 'Навои',        value: 19 },
  { name: 'Ташкент',      value: 14 },
];

// ─────────────────────────────────────────────────────────
// Integrations status (MIP + direct APIs)
// ─────────────────────────────────────────────────────────
const INTEGRATIONS = [
  { name: 'agrosubsidiya.uz',        status: 'ok'      as const, latency: '~180мс', note: 'Приём заявок на 4 программы' },
  { name: 'MIP · Минсельхоз API',    status: 'ok'      as const, latency: '~220мс', note: 'Реестр фермерских хозяйств' },
  { name: 'MIP · Кадастр',           status: 'ok'      as const, latency: '~310мс', note: 'Земельные участки, срок владения' },
  { name: 'MIP · Soliq',             status: 'ok'      as const, latency: '~195мс', note: 'Проверка налоговой задолженности' },
  { name: 'UzEx (биржа)',            status: 'warn'    as const, latency: '~1.2с',  note: 'Цены сырья, иногда задержка' },
  { name: 'O‘zagrolizing',           status: 'pending' as const, latency: '—',      note: 'Соглашение на интеграции' },
];

// ─────────────────────────────────────────────────────────
// Category filter labels for inbox
// ─────────────────────────────────────────────────────────
const CATEGORY_LABELS: Record<AgencyInquiry['category'], string> = {
  subsidy:    'Субсидии и кредиты',
  irrigation: 'Орошение',
  land:       'Земля и участки',
  export:     'Экспорт',
  tech:       'Агротехнологии',
  general:    'Прочее',
};

const STATUS_LABEL: Record<AgencyInquiryStatus, string> = {
  new:           'новое',
  'in-progress': 'в работе',
  awaiting:      'ожидает ведомства',
  resolved:      'решено',
  overdue:       'просрочено',
};

function statusToPill(status: AgencyInquiryStatus) {
  if (status === 'new')         return 'in-review' as const;
  if (status === 'in-progress') return 'in-review' as const;
  if (status === 'awaiting')    return 'in-review' as const;
  if (status === 'resolved')    return 'approved'  as const;
  return 'rejected' as const;
}

// ─────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────
export function AgencyCabinet() {
  const [categoryFilter, setCategoryFilter] = useState<AgencyInquiry['category'] | 'all'>('all');
  const [query, setQuery] = useState('');

  const visibleInbox = useMemo(() => {
    return MINAGRI_INBOX.filter((q) => {
      if (categoryFilter !== 'all' && q.category !== categoryFilter) return false;
      if (query && !(q.theme.toLowerCase().includes(query.toLowerCase()) || q.author.toLowerCase().includes(query.toLowerCase()))) return false;
      return true;
    });
  }, [categoryFilter, query]);

  const openCount     = MINAGRI_INBOX.filter((q) => q.status === 'new' || q.status === 'in-progress' || q.status === 'awaiting').length;
  const overdueCount  = MINAGRI_INBOX.filter((q) => q.status === 'overdue').length;
  const resolvedCount = MINAGRI_INBOX.filter((q) => q.status === 'resolved').length;

  return (
    <>
      <CabinetHero
        eyebrow="Кабинет ведомства · Министерство сельского хозяйства"
        title="Inbox ведомства внутри Платформы"
        subtitle="Обращения от МСБ, автоматически маршрутизированные классификатором. Меры поддержки Минсельхоза. Статус интеграций."
        badge={<Badge variant="priority-solid">agency</Badge>}
        rightSlot={
          <div className="hidden md:block rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 px-5 py-3 text-sm">
            <div className="text-white/60 uppercase tracking-wider text-xs mb-1">Ответственные</div>
            <div className="font-medium text-white">14 сотрудников</div>
            <div className="text-xs text-gold-light mt-1">4 программы субсидий · 1 кредит · 1 грант</div>
          </div>
        }
      />

      <section className="container-wide py-10 md:py-14 space-y-6">
        {/* ─────────────────── KPI band ─────────────────── */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {WEEKLY_KPI.map((k, i) => (
            <motion.div
              key={k.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: i * 0.05 }}
            >
              <Card>
                <div className="flex items-start justify-between mb-2">
                  <k.Icon className="h-5 w-5 text-gold" />
                  <span className={`text-xs flex items-center gap-0.5 ${k.positive ? 'text-success' : 'text-danger'}`}>
                    {k.delta}
                  </span>
                </div>
                <div className="kpi-number text-navy">{k.value.toLocaleString('ru')}</div>
                <div className="text-sm text-ink-muted mt-1">{k.label}</div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* ─────────────────── Inbox + Measures ─────────────────── */}
        <div className="grid lg:grid-cols-[2fr_1fr] gap-5">
          {/* Inbox */}
          <Card padding="lg">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-2">
                <Inbox className="h-5 w-5 text-gold" />
                <CardTitle className="text-[16px]">Inbox обращений от МСБ</CardTitle>
                <Badge variant="priority-solid" className="ml-2">{openCount} открытых</Badge>
                {overdueCount > 0 && <Badge variant="danger">{overdueCount} просрочено</Badge>}
              </div>
              <div className="flex items-center gap-2 text-xs text-ink-muted">
                <CheckCircle2 className="h-3.5 w-3.5 text-success" />
                {resolvedCount} решено за неделю
              </div>
            </div>

            {/* Search + filter */}
            <div className="flex flex-wrap gap-2 mb-4">
              <div className="flex-1 min-w-[220px] relative">
                <Search className="h-4 w-4 text-ink-muted absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Поиск по теме или заявителю…"
                  className="w-full pl-9 pr-3 h-10 rounded-lg border border-ink-line bg-bg-white text-sm focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/30"
                />
              </div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <Filter className="h-4 w-4 text-ink-muted mx-1" />
                <FilterChip active={categoryFilter === 'all'} onClick={() => setCategoryFilter('all')}>
                  Все ({MINAGRI_INBOX.length})
                </FilterChip>
                {(Object.keys(CATEGORY_LABELS) as AgencyInquiry['category'][]).map((c) => {
                  const n = MINAGRI_INBOX.filter((q) => q.category === c).length;
                  if (n === 0) return null;
                  return (
                    <FilterChip key={c} active={categoryFilter === c} onClick={() => setCategoryFilter(c)}>
                      {CATEGORY_LABELS[c]} ({n})
                    </FilterChip>
                  );
                })}
              </div>
            </div>

            {/* Inquiry list */}
            <div className="space-y-2 max-h-[520px] overflow-y-auto scrollbar-slim pr-1">
              {visibleInbox.length === 0 && (
                <div className="text-sm text-ink-muted text-center py-10">Под эти фильтры обращений нет</div>
              )}
              {visibleInbox.map((q) => (
                <InquiryRow key={q.id} inquiry={q} />
              ))}
            </div>
          </Card>

          {/* Measures */}
          <Card padding="lg">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Wallet className="h-5 w-5 text-gold" />
                <CardTitle className="text-[16px]">Мои меры поддержки</CardTitle>
              </div>
              <span className="text-xs text-ink-muted">{MINAGRI_MEASURES.length} программ</span>
            </div>
            <div className="space-y-3">
              {MINAGRI_MEASURES.map((m) => {
                const usedPct = Math.round((m.usedUzs / m.yearLimitUzs) * 100);
                const remainingBln = ((m.yearLimitUzs - m.usedUzs) / 1_000_000_000).toFixed(1);
                const limitBln = (m.yearLimitUzs / 1_000_000_000).toFixed(0);
                return (
                  <div key={m.id} className="p-3 rounded-lg border border-ink-line bg-bg-band/40">
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <div className="min-w-0">
                        <div className="font-medium text-ink text-sm leading-snug">{m.title}</div>
                        <div className="text-xs text-ink-muted mt-0.5 font-mono">{m.id}</div>
                      </div>
                      <Badge variant={m.type === 'subsidy' ? 'priority-solid' : m.type === 'loan' ? 'info' : 'success'}>
                        {m.type === 'subsidy' ? 'субсидия' : m.type === 'loan' ? 'кредит' : 'грант'}
                      </Badge>
                    </div>
                    <ProgressBar
                      value={usedPct}
                      tone={usedPct > 85 ? 'danger' : usedPct > 60 ? 'gold' : 'success'}
                      height="sm"
                      className="mt-2"
                    />
                    <div className="flex items-center justify-between text-xs text-ink-muted mt-1.5">
                      <span>Освоено {usedPct}% · остаток {remainingBln} млрд из {limitBln} млрд сум</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs mt-2 pt-2 border-t border-ink-line/60">
                      <span className="text-ink-muted">30 дн:</span>
                      <span className="text-ink">{m.applications30d} заявок</span>
                      <span className="text-success">{m.approved30d} одобрено</span>
                      <span className="text-ink-muted">({Math.round((m.approved30d / m.applications30d) * 100)}%)</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* ─────────────────── Chart + Integrations ─────────────────── */}
        <div className="grid lg:grid-cols-[2fr_1fr] gap-5">
          {/* Regional chart */}
          <Card padding="lg">
            <div className="flex items-center justify-between mb-2">
              <div>
                <CardTitle>Заявки по регионам</CardTitle>
                <CardDescription>Программы Минсельхоза, этот месяц</CardDescription>
              </div>
              <Badge variant="info">апрель 2026</Badge>
            </div>
            <div className="h-80 mt-5">
              <ResponsiveContainer>
                <BarChart data={REGIONAL_APPLICATIONS} margin={{ top: 10, right: 16, left: 0, bottom: 60 }}>
                  <CartesianGrid vertical={false} stroke="#EFF1F4" />
                  <XAxis dataKey="name" fontSize={10} stroke="#5A6575" angle={-35} textAnchor="end" interval={0} />
                  <YAxis fontSize={11} stroke="#5A6575" tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid #E5E7EB', fontSize: 13 }} cursor={{ fill: 'rgba(139,111,58,0.08)' }} />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                    {REGIONAL_APPLICATIONS.map((_, i) => (
                      <Cell key={i} fill={i === 0 ? '#8B6F3A' : i < 3 ? '#B08D4C' : '#5B8DB8'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Integrations status */}
          <Card padding="lg" tone="navy" className="text-white">
            <div className="flex items-center gap-2 mb-4">
              <Activity className="h-5 w-5 text-gold-light" />
              <CardTitle className="text-white">Интеграции ведомства</CardTitle>
            </div>
            <div className="space-y-3">
              {INTEGRATIONS.map((x) => (
                <IntegrationRow key={x.name} name={x.name} status={x.status} latency={x.latency} note={x.note} />
              ))}
            </div>
            <div className="mt-5 pt-4 border-t border-white/10 text-xs text-white/60 flex items-center gap-1.5">
              <DatabaseZap className="h-3.5 w-3.5 text-gold-light" /> Обновлено 2 минуты назад
            </div>
          </Card>
        </div>

        {/* ─────────────────── Footer callout ─────────────────── */}
        <Card padding="lg" className="border-gold/25 bg-gold-soft/40">
          <div className="flex items-start gap-4">
            <div className="h-10 w-10 rounded-lg bg-gold/15 text-gold flex items-center justify-center shrink-0">
              <Sparkles className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-serif font-semibold text-ink">Этот кабинет — реализация слайда 24 концепции</div>
              <CardDescription className="mt-1">
                «Кабинеты ведомств внутри Платформы» — новая сущность. У каждого из 15 ведомств появляется собственный
                кабинет, где сотрудники работают с обращениями МСБ и администрируют свои меры поддержки. Без перехода на
                ведомственные системы. В полной версии: маршрутизация через классификатор обращений модуля (а),
                SLA-трекинг, логирование, аналитика.
              </CardDescription>
              <div className="mt-3 flex gap-2 flex-wrap">
                <Badge variant="outline">Модуль (а) · B2B/B2G</Badge>
                <Badge variant="outline">Модуль (б) · Меры поддержки</Badge>
                <Badge variant="priority-solid">Требует ПКМ об обязательном подключении</Badge>
              </div>
            </div>
          </div>
        </Card>
      </section>
    </>
  );
}

// ─────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────
function FilterChip({
  active, children, onClick,
}: { active: boolean; children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`h-8 px-3 rounded-full text-xs font-medium transition-colors border ${
        active
          ? 'bg-gold text-white border-gold'
          : 'bg-bg-white text-ink-muted border-ink-line hover:border-gold hover:text-gold'
      }`}
    >
      {children}
    </button>
  );
}

function InquiryRow({ inquiry }: { inquiry: AgencyInquiry }) {
  const overdue    = inquiry.status === 'overdue';
  const resolved   = inquiry.status === 'resolved';
  const slaText    = slaLabel(inquiry.slaHoursLeft, inquiry.status);
  const pill       = statusToPill(inquiry.status);
  const badgeColor =
    inquiry.status === 'new'         ? 'info'           :
    inquiry.status === 'in-progress' ? 'warning'        :
    inquiry.status === 'awaiting'    ? 'outline'        :
    inquiry.status === 'resolved'    ? 'success'        : 'danger';

  return (
    <div className={`p-3.5 rounded-xl border flex items-start gap-3 transition-colors ${
      overdue ? 'border-danger/30 bg-danger/5' : resolved ? 'border-ink-line bg-bg-band/30' : 'border-ink-line bg-bg-white hover:border-gold/40 hover:bg-gold-soft/20'
    }`}>
      <div className={`h-9 w-9 rounded-lg flex items-center justify-center shrink-0 ${
        overdue ? 'bg-danger/10 text-danger' :
        resolved ? 'bg-success/10 text-success' :
        'bg-gold/10 text-gold'
      }`}>
        {overdue ? <AlertCircle className="h-4 w-4" /> :
         resolved ? <CheckCircle2 className="h-4 w-4" /> :
         <Clock className="h-4 w-4" />}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-3 mb-1">
          <div className="min-w-0">
            <div className="font-medium text-ink text-[14.5px] leading-snug">{inquiry.theme}</div>
            <div className="text-xs text-ink-muted mt-0.5 font-mono">{inquiry.id} · {inquiry.author} · {inquiry.region}</div>
          </div>
          <Badge variant={badgeColor as any}>{STATUS_LABEL[inquiry.status]}</Badge>
        </div>
        <p className="text-xs text-ink-muted leading-snug line-clamp-2 mt-1">{inquiry.preview}</p>
        <div className="flex items-center justify-between mt-2">
          <span className={`text-xs font-medium ${overdue ? 'text-danger' : 'text-ink-muted'}`}>{slaText}</span>
          <span className="text-xs text-ink-muted flex items-center gap-1">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-gold" />
            {routedFromLabel(inquiry.routedFrom)}
          </span>
        </div>
      </div>

      <ChevronRight className="h-4 w-4 text-ink-muted mt-1 shrink-0" />
    </div>
  );
}

function slaLabel(hoursLeft: number, status: AgencyInquiryStatus): string {
  if (status === 'resolved') return 'Решено ' + ago(24 * 2);
  if (status === 'overdue')  return `SLA просрочен на ${Math.abs(hoursLeft)} ч`;
  if (hoursLeft >= 24)       return `Ответ до ${Math.floor(hoursLeft / 24)} дн · поступило ${Math.floor(Math.random() * 48) + 1} ч назад`;
  if (hoursLeft > 0)         return `Осталось ${hoursLeft} ч на первичный ответ`;
  return 'SLA истекает сейчас';
}

function ago(_h: number) {
  return 'вчера';
}

function routedFromLabel(from: AgencyInquiry['routedFrom']): string {
  if (from === 'b2g-form')    return 'Модуль (а) · форма B2G';
  if (from === 'ai-assistant') return 'AI-ассистент → эскалация';
  return 'Жалоба';
}

function IntegrationRow({
  name, status, latency, note,
}: { name: string; status: 'ok' | 'warn' | 'pending'; latency: string; note: string }) {
  const color = status === 'ok' ? '#4CAF50' : status === 'warn' ? '#B08D4C' : '#5A6575';
  const label = status === 'ok' ? 'online' : status === 'warn' ? 'slow' : 'pending';
  return (
    <div>
      <div className="flex items-center justify-between text-sm mb-1">
        <span className="text-white/90 font-medium truncate">{name}</span>
        <span className="text-[11px] font-mono font-semibold flex items-center gap-1.5" style={{ color }}>
          <span className="inline-block h-2 w-2 rounded-full" style={{ background: color }} />
          {label} · {latency}
        </span>
      </div>
      <div className="text-xs text-white/55">{note}</div>
    </div>
  );
}
