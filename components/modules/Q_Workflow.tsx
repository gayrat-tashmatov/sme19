'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  GitBranch, Clock, CheckCircle2, AlertCircle, Zap, FileText, Award,
  Coins, Gavel, MessageCircle, ArrowUpRight, Sparkles, Filter, TrendingUp,
} from 'lucide-react';
import { Card, CardTitle, CardDescription } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/cn';

type AppStatus = 'submitted' | 'in-review' | 'info-requested' | 'approved' | 'rejected';
type AppType = 'measure' | 'license' | 'procurement' | 'inquiry';

interface Application {
  id: string;
  title: string;
  type: AppType;
  authority: string;
  status: AppStatus;
  step: 1 | 2 | 3 | 4;
  slaHours: number;      // total SLA in hours
  elapsedHours: number;  // how many hours since submission
  submittedDate: string;
  lastUpdate: string;
  escalated: boolean;
}

const APPS: Application[] = [
  { id: 'YRP-MSR-2026-3421', title: 'Субсидия на промышленное оборудование', type: 'measure',     authority: 'МЭФ',         status: 'in-review',       step: 2, slaHours: 240, elapsedHours: 86,  submittedDate: '10 апр',  lastUpdate: '2 часа назад', escalated: false },
  { id: 'YRP-LIC-2026-1840', title: 'Лицензия на розничную торговлю алкоголем', type: 'license',   authority: 'Хокимият Ташкента', status: 'info-requested', step: 3, slaHours: 336, elapsedHours: 210, submittedDate: '5 апр',   lastUpdate: 'вчера',       escalated: false },
  { id: 'YRP-PRC-2026-0912', title: 'Заявка на тендер · поставка мебели',      type: 'procurement', authority: 'xarid.uz · Минобр', status: 'submitted',   step: 1, slaHours: 72,  elapsedHours: 18,  submittedDate: 'сегодня', lastUpdate: '18 мин. назад', escalated: false },
  { id: 'YRP-INQ-2026-5571', title: 'Разъяснение по компенсации тарифа на электроэнергию', type: 'inquiry', authority: 'Минэнерго', status: 'in-review', step: 2, slaHours: 120, elapsedHours: 132, submittedDate: '28 мар', lastUpdate: '5 дней назад', escalated: true },
  { id: 'YRP-MSR-2026-2895', title: 'Льготный кредит на оборотные средства',   type: 'measure',    authority: 'ЦБ РУз',        status: 'approved',        step: 4, slaHours: 336, elapsedHours: 310, submittedDate: '22 мар',  lastUpdate: '3 дня назад', escalated: false },
  { id: 'YRP-LIC-2026-1643', title: 'Резидентство IT-парка',                    type: 'license',    authority: 'IT-парк',       status: 'approved',        step: 4, slaHours: 240, elapsedHours: 180, submittedDate: '15 мар', lastUpdate: '1 нед. назад', escalated: false },
  { id: 'YRP-MSR-2026-1234', title: 'Налоговая льгота для нового производства', type: 'measure',   authority: 'Soliq',         status: 'rejected',        step: 4, slaHours: 168, elapsedHours: 158, submittedDate: '1 мар',  lastUpdate: '2 нед. назад', escalated: false },
];

const TYPE_CFG: Record<AppType, { label: string; Icon: typeof Award; color: string }> = {
  measure:     { label: 'Мера поддержки', Icon: Coins,       color: 'text-gold bg-gold/10' },
  license:     { label: 'Лицензия',         Icon: Award,       color: 'text-secondary bg-secondary/10' },
  procurement: { label: 'Закупки',           Icon: Gavel,       color: 'text-navy bg-navy/10' },
  inquiry:     { label: 'Обращение',         Icon: MessageCircle, color: 'text-success bg-success/10' },
};

const AUTHORITY_STATS = [
  { authority: 'МЭФ',             onTime: 94, total: 180 },
  { authority: 'Soliq',           onTime: 98, total: 425 },
  { authority: 'Минсельхоз',       onTime: 87, total: 92 },
  { authority: 'Хокимият Ташкента', onTime: 72, total: 208 },
  { authority: 'ЦБ РУз',           onTime: 91, total: 54 },
  { authority: 'IT-парк',          onTime: 96, total: 38 },
];

export function QWorkflow() {
  const [statusFilter, setStatus] = useState<'all' | 'active' | 'completed' | 'escalated'>('all');
  const [opened, setOpened] = useState<Application | null>(APPS[0]);

  const filtered = APPS.filter((a) => {
    if (statusFilter === 'active')    return !['approved', 'rejected'].includes(a.status);
    if (statusFilter === 'completed') return ['approved', 'rejected'].includes(a.status);
    if (statusFilter === 'escalated') return a.escalated;
    return true;
  });

  const active = APPS.filter((a) => !['approved', 'rejected'].includes(a.status)).length;
  const escalated = APPS.filter((a) => a.escalated).length;

  return (
    <section className="container-wide py-10 md:py-14 space-y-6">
      {/* Hero */}
      <Card padding="lg" tone="navy" className="text-white relative overflow-hidden">
        <div className="absolute inset-0 pattern-dots opacity-25 pointer-events-none" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-3">
            <GitBranch className="h-5 w-5 text-gold-light" />
            <span className="text-xs uppercase tracking-wider text-gold-light font-semibold">Адаптация Singapore GoBusiness Dashboard · GOV.UK</span>
          </div>
          <h2 className="font-serif text-2xl md:text-3xl text-white mb-2 leading-tight">
            Одно окно для всех заявок — с SLA-таймером и эскалацией
          </h2>
          <p className="text-white/75 max-w-3xl text-sm">
            Все обращения предпринимателя: меры поддержки, лицензии, тендеры, обращения. Горизонтальный stepper
            на каждой заявке: Submit → Review → Info Request → Approved/Rejected. SLA с таймером по каждому шагу —
            при превышении автоматическое уведомление руководству ведомства.
          </p>

          <div className="mt-5 grid grid-cols-2 md:grid-cols-4 gap-2">
            <HeroMetric label="Всего заявок"        value={APPS.length.toString()} sub="за 2 квартала" />
            <HeroMetric label="Активных"              value={active.toString()}      sub="в работе" />
            <HeroMetric label="Эскалированных"       value={escalated.toString()}   sub="превышен SLA" />
            <HeroMetric label="Среднее время"         value="5.2 дн"                 sub="от подачи до решения" />
          </div>
        </div>
      </Card>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 items-center">
        <Filter className="h-4 w-4 text-ink-muted" />
        {[
          { id: 'all',        label: `Все (${APPS.length})` },
          { id: 'active',     label: `Активные (${active})` },
          { id: 'completed',  label: `Завершённые (${APPS.length - active})` },
          { id: 'escalated',  label: `Эскалация (${escalated})`, accent: true },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setStatus(f.id as typeof statusFilter)}
            className={cn(
              'h-9 px-3.5 rounded-full text-xs font-semibold transition-colors border',
              statusFilter === f.id
                ? (f.accent ? 'bg-danger text-white border-danger' : 'bg-navy text-white border-navy')
                : 'bg-bg-white text-ink-muted border-ink-line hover:border-gold hover:text-gold',
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Applications + Detail */}
      <div className="grid lg:grid-cols-[1.2fr_1fr] gap-5">
        <Card padding="md">
          <div className="space-y-2 max-h-[620px] overflow-y-auto scrollbar-slim pr-1">
            {filtered.map((a) => (
              <ApplicationRow key={a.id} app={a} active={opened?.id === a.id} onClick={() => setOpened(a)} />
            ))}
          </div>
        </Card>

        {opened && (
          <motion.div key={opened.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
            <ApplicationDetail app={opened} />
          </motion.div>
        )}
      </div>

      {/* Authority stats */}
      <Card padding="lg">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="h-5 w-5 text-gold" />
          <CardTitle className="text-[16px]">Соблюдение сроков по ведомствам · публичная метрика</CardTitle>
        </div>
        <CardDescription className="mb-4">
          Процент заявок, обработанных в рамках SLA. Обновляется в реальном времени. Создаёт здоровое давление
          на ведомства и помогает МЭФ выявлять узкие места.
        </CardDescription>
        <div className="space-y-2">
          {AUTHORITY_STATS.map((s) => {
            const tone = s.onTime >= 95 ? 'success' : s.onTime >= 85 ? 'gold' : 'danger';
            return (
              <div key={s.authority} className="flex items-center gap-3">
                <div className="w-40 shrink-0 text-sm text-ink font-medium">{s.authority}</div>
                <div className="flex-1 h-7 bg-bg-band rounded-full relative overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${s.onTime}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className={cn(
                      'h-full flex items-center justify-end pr-2',
                      tone === 'success' ? 'bg-success' : tone === 'gold' ? 'bg-gold' : 'bg-danger',
                    )}
                  >
                    <span className="text-xs text-white font-semibold">{s.onTime}%</span>
                  </motion.div>
                </div>
                <div className="w-16 text-right text-xs text-ink-muted">{s.total} заявок</div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Footer */}
      <Card padding="lg" className="border-gold/25 bg-gold-soft/30">
        <div className="flex items-start gap-4">
          <div className="h-10 w-10 rounded-lg bg-gold/15 text-gold flex items-center justify-center shrink-0">
            <Sparkles className="h-5 w-5" />
          </div>
          <div className="text-sm text-ink">
            <strong>Референсы:</strong> Singapore <strong>GoBusiness Dashboard</strong> — единое место для всех
            government-to-business транзакций, уже 6+ миллионов. <strong>GOV.UK Application Journey</strong> — прозрачный
            stepper с таймером на каждом шаге. Механизм эскалации решает главную боль предпринимателей —
            непредсказуемые сроки рассмотрения.
          </div>
        </div>
      </Card>
    </section>
  );
}

function ApplicationRow({ app, active, onClick }: { app: Application; active: boolean; onClick: () => void }) {
  const cfg = TYPE_CFG[app.type];
  const slaPct = (app.elapsedHours / app.slaHours) * 100;
  const isOverSla = slaPct >= 100;
  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full text-left p-3 rounded-lg border transition-all',
        active ? 'border-gold bg-gold-soft/30 shadow-sm' : 'border-ink-line bg-bg-white hover:border-gold/40',
      )}
    >
      <div className="flex items-start gap-3">
        <div className={cn('h-9 w-9 rounded-lg flex items-center justify-center shrink-0', cfg.color)}>
          <cfg.Icon className="h-4 w-4" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5 flex-wrap">
            <span className="text-[10.5px] font-mono text-ink-muted">{app.id}</span>
            <StatusBadge status={app.status} />
            {app.escalated && <Badge variant="danger">эскалация</Badge>}
          </div>
          <div className="text-[14px] font-serif text-ink leading-snug">{app.title}</div>
          <div className="flex items-center justify-between mt-1.5">
            <div className="text-[11.5px] text-ink-muted">{app.authority} · {cfg.label}</div>
            {!['approved', 'rejected'].includes(app.status) && (
              <div className="text-[11px] font-mono flex items-center gap-1">
                <Clock className={cn('h-3 w-3', isOverSla ? 'text-danger' : slaPct > 70 ? 'text-gold' : 'text-ink-muted')} />
                <span className={cn(isOverSla ? 'text-danger font-semibold' : slaPct > 70 ? 'text-gold' : 'text-ink-muted')}>
                  {Math.round(slaPct)}% SLA
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </button>
  );
}

function ApplicationDetail({ app }: { app: Application }) {
  const cfg = TYPE_CFG[app.type];
  const steps = [
    { n: 1, t: 'Submit · подача', sub: 'Заявка принята' },
    { n: 2, t: 'In Review · на рассмотрении', sub: 'Ведомство проверяет' },
    { n: 3, t: 'Additional Info · запрос документов', sub: 'Нужны доп. данные' },
    { n: 4, t: 'Decision · решение', sub: app.status === 'approved' ? 'Одобрено' : app.status === 'rejected' ? 'Отклонено' : 'Ожидается' },
  ];
  const slaPct = Math.min(100, (app.elapsedHours / app.slaHours) * 100);

  return (
    <Card padding="lg" className="h-full">
      <div className="flex items-start gap-3 mb-4 pb-4 border-b border-ink-line">
        <div className={cn('h-11 w-11 rounded-lg flex items-center justify-center shrink-0', cfg.color)}>
          <cfg.Icon className="h-5 w-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[10.5px] font-mono text-ink-muted">{app.id}</div>
          <CardTitle className="text-[16px] mt-0.5 leading-tight">{app.title}</CardTitle>
          <div className="text-xs text-ink-muted mt-1">
            {app.authority} · подано {app.submittedDate} · обновление {app.lastUpdate}
          </div>
        </div>
      </div>

      {/* Horizontal stepper */}
      <div className="mb-5">
        <div className="flex items-center gap-1">
          {steps.map((s, i) => {
            const done   = app.step > s.n || app.status === 'approved' || app.status === 'rejected';
            const active = app.step === s.n && !['approved', 'rejected'].includes(app.status);
            return (
              <div key={s.n} className="flex-1 flex flex-col items-center gap-1.5">
                <div className="flex items-center w-full">
                  <div className={cn(
                    'h-7 w-7 rounded-full flex items-center justify-center shrink-0 font-serif font-semibold text-xs transition-colors',
                    done ? 'bg-success text-white' : active ? 'bg-gold text-white' : 'bg-bg-band text-ink-muted',
                  )}>
                    {done ? <CheckCircle2 className="h-3.5 w-3.5" /> : s.n}
                  </div>
                  {i < steps.length - 1 && <div className={cn('flex-1 h-px mx-1', done ? 'bg-success' : 'bg-ink-line')} />}
                </div>
                <div className="text-center">
                  <div className={cn('text-[11px] leading-tight', done || active ? 'text-ink font-semibold' : 'text-ink-muted')}>
                    {s.t}
                  </div>
                  <div className="text-[10px] text-ink-muted leading-tight mt-0.5">{s.sub}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SLA */}
      {!['approved', 'rejected'].includes(app.status) && (
        <div className={cn(
          'p-3 rounded-lg border mb-4',
          app.escalated ? 'border-danger/30 bg-danger/5' : slaPct > 70 ? 'border-gold/30 bg-gold-soft/40' : 'border-ink-line bg-bg-band/40',
        )}>
          <div className="flex items-center justify-between mb-1.5">
            <div className="text-xs uppercase tracking-wider text-ink-muted font-semibold">
              SLA: {Math.floor(app.slaHours / 24)} дней на решение
            </div>
            <div className={cn(
              'text-xs font-mono font-semibold',
              app.escalated ? 'text-danger' : slaPct > 70 ? 'text-gold' : 'text-ink',
            )}>
              прошло {Math.floor(app.elapsedHours / 24)} дн · {Math.round(slaPct)}%
            </div>
          </div>
          <div className="h-2 bg-bg-white rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${slaPct}%` }}
              transition={{ duration: 0.6 }}
              className={cn('h-full', app.escalated ? 'bg-danger' : slaPct > 70 ? 'bg-gold' : 'bg-success')}
            />
          </div>
          {app.escalated && (
            <div className="mt-2 flex items-start gap-2 text-[12px] text-danger">
              <Zap className="h-3.5 w-3.5 mt-0.5 shrink-0" />
              <span>
                <strong>Эскалация активирована:</strong> SLA превышен на {Math.floor((app.elapsedHours - app.slaHours) / 24)} дн.
                Уведомление отправлено заместителю руководителя ведомства и в МЭФ.
              </span>
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2 flex-wrap">
        {app.status === 'info-requested' && (
          <Button size="sm" leftIcon={<FileText className="h-4 w-4" />}>Предоставить документы</Button>
        )}
        {app.escalated && (
          <Button size="sm" variant="ghost" leftIcon={<ArrowUpRight className="h-4 w-4" />}>История эскалации</Button>
        )}
        <Button size="sm" variant="ghost" leftIcon={<FileText className="h-4 w-4" />}>Все документы</Button>
        <Button size="sm" variant="ghost" leftIcon={<MessageCircle className="h-4 w-4" />}>Связаться с исполнителем</Button>
      </div>
    </Card>
  );
}

function StatusBadge({ status }: { status: AppStatus }) {
  const cfg: Record<AppStatus, { label: string; variant: 'outline' | 'info' | 'warning' | 'success' | 'danger' }> = {
    'submitted':       { label: 'подано',          variant: 'outline' },
    'in-review':       { label: 'на рассмотрении', variant: 'info'    },
    'info-requested':  { label: 'запрос документов', variant: 'warning' },
    'approved':        { label: 'одобрено',         variant: 'success' },
    'rejected':        { label: 'отклонено',        variant: 'danger'  },
  };
  const c = cfg[status];
  return <Badge variant={c.variant}>{c.label}</Badge>;
}

function HeroMetric({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-lg p-3">
      <div className="text-[10.5px] uppercase tracking-wider text-gold-light/80 mb-1">{label}</div>
      <div className="font-serif text-2xl text-white font-semibold">{value}</div>
      <div className="text-[11px] text-white/60 mt-0.5">{sub}</div>
    </div>
  );
}
