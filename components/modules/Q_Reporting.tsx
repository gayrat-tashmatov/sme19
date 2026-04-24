'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText, Calendar, Clock, CheckCircle2, AlertCircle, FileSignature,
  Sparkles, TrendingUp, Download, Send, Building2, BarChart3, Ship, HeartHandshake,
} from 'lucide-react';
import { Card, CardTitle, CardDescription } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/Progress';
import { cn } from '@/lib/cn';

type ReportStatus = 'upcoming' | 'due-soon' | 'overdue' | 'filed';
type ReportCategory = 'tax' | 'stats' | 'customs' | 'social';

interface Report {
  id: string;
  title: string;
  category: ReportCategory;
  deadline: string;
  daysUntil: number;
  status: ReportStatus;
  prefilledPct: number;
  estimatedMinutes: number;
  authority: string;
}

const REPORTS: Report[] = [
  { id: 'VAT-Q2',  title: 'Декларация НДС · Q2 2026',         category: 'tax',     deadline: '25 апр 2026', daysUntil: 3,   status: 'due-soon', prefilledPct: 94, estimatedMinutes: 4, authority: 'Soliq' },
  { id: 'PIT-Q2',  title: 'Налог на прибыль · Q2 2026',         category: 'tax',     deadline: '25 апр 2026', daysUntil: 3,   status: 'due-soon', prefilledPct: 88, estimatedMinutes: 5, authority: 'Soliq' },
  { id: 'SF-04',   title: 'Соц. отчисления · апрель',            category: 'social', deadline: '15 мая 2026', daysUntil: 23,  status: 'upcoming', prefilledPct: 98, estimatedMinutes: 2, authority: 'Пенсионный фонд' },
  { id: 'STAT-01', title: 'Статформа 1-К · ежемесячная',         category: 'stats',  deadline: '10 мая 2026', daysUntil: 18,  status: 'upcoming', prefilledPct: 92, estimatedMinutes: 3, authority: 'Нацкомстат' },
  { id: 'VAT-Q1',  title: 'Декларация НДС · Q1 2026',         category: 'tax',     deadline: '25 янв 2026', daysUntil: -88, status: 'filed',    prefilledPct: 95, estimatedMinutes: 4, authority: 'Soliq' },
  { id: 'CUS-03',  title: 'Таможенный отчёт · март',            category: 'customs',deadline: '10 апр 2026', daysUntil: -12, status: 'filed',    prefilledPct: 85, estimatedMinutes: 6, authority: 'ГТК' },
  { id: 'STAT-Q1', title: 'Статистика Q1 · форма П-1',          category: 'stats',  deadline: '20 апр 2026', daysUntil: -2,  status: 'filed',    prefilledPct: 90, estimatedMinutes: 3, authority: 'Нацкомстат' },
];

const CATEGORY_CONFIG: Record<ReportCategory, { label: string; Icon: typeof FileText; count: number }> = {
  tax:     { label: 'Налоговая',        Icon: FileText,  count: 18 },
  stats:   { label: 'Статистическая',   Icon: BarChart3, count: 12 },
  customs: { label: 'Таможенная',       Icon: Ship,      count: 6  },
  social:  { label: 'Соц. отчисления',  Icon: HeartHandshake, count: 4 },
};

export function QReporting() {
  const [activeCat, setCat] = useState<ReportCategory | 'all'>('all');
  const [opened, setOpened] = useState<Report | null>(null);

  const filtered = activeCat === 'all' ? REPORTS : REPORTS.filter((r) => r.category === activeCat);
  const upcoming = filtered.filter((r) => r.status !== 'filed');
  const filed    = filtered.filter((r) => r.status === 'filed');
  const hoursSaved = REPORTS.filter((r) => r.status === 'filed').length * 2.2;

  return (
    <section className="container-wide py-10 md:py-14 space-y-6">
      {/* Hero */}
      <Card padding="lg" tone="navy" className="text-white relative overflow-hidden">
        <div className="absolute inset-0 pattern-dots opacity-25 pointer-events-none" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-3">
            <FileText className="h-5 w-5 text-gold-light" />
            <span className="text-xs uppercase tracking-wider text-gold-light font-semibold">Адаптация Estonia e-Tax (e-MTA) · 95% онлайн</span>
          </div>
          <h2 className="font-serif text-2xl md:text-3xl text-white mb-2 leading-tight">
            Сдача отчётности — 3–5 минут на декларацию
          </h2>
          <p className="text-white/75 max-w-3xl text-sm">
            Календарь всех обязательств в одном окне. Декларации предзаполнены из Soliq, Нацкомстата и ГТК —
            только проверить и подписать. Одна подача обновляет несколько ведомств одновременно.
          </p>

          <div className="mt-5 grid grid-cols-2 md:grid-cols-4 gap-2">
            <HeroMetric label="Активных обязательств" value={upcoming.length.toString()} sub={`${upcoming.filter((r) => r.status === 'due-soon').length} срочных`} />
            <HeroMetric label="Средн. время сдачи"    value="3.8 мин" sub="благодаря предзаполнению" />
            <HeroMetric label="Предзаполненность"      value={`${Math.round(REPORTS.reduce((s, r) => s + r.prefilledPct, 0) / REPORTS.length)}%`} sub="полей автоматически" />
            <HeroMetric label="Сэкономлено времени"   value={`${hoursSaved.toFixed(0)} ч`} sub="за квартал" />
          </div>
        </div>
      </Card>

      {/* Category tabs */}
      <div className="flex flex-wrap gap-2">
        <TabButton active={activeCat === 'all'} onClick={() => setCat('all')}>
          <FileText className="h-4 w-4" /> Все отчёты ({REPORTS.length})
        </TabButton>
        {(Object.keys(CATEGORY_CONFIG) as ReportCategory[]).map((c) => {
          const cfg = CATEGORY_CONFIG[c];
          return (
            <TabButton key={c} active={activeCat === c} onClick={() => setCat(c)}>
              <cfg.Icon className="h-4 w-4" /> {cfg.label} ({cfg.count})
            </TabButton>
          );
        })}
      </div>

      {/* Calendar + Reports */}
      <div className="grid lg:grid-cols-[1fr_340px] gap-5">
        {/* Reports list */}
        <div className="space-y-5">
          {upcoming.length > 0 && (
            <Card padding="lg">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-gold" />
                  <CardTitle className="text-[16px]">К сдаче</CardTitle>
                </div>
                <Badge variant="priority">{upcoming.length} активных</Badge>
              </div>
              <div className="space-y-2">
                {upcoming.map((r) => <ReportRow key={r.id} report={r} onOpen={() => setOpened(r)} />)}
              </div>
            </Card>
          )}

          {filed.length > 0 && (
            <Card padding="lg">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-success" />
                  <CardTitle className="text-[16px]">Сданные · история</CardTitle>
                </div>
                <Badge variant="success">{filed.length} за квартал</Badge>
              </div>
              <div className="space-y-2">
                {filed.map((r) => <ReportRow key={r.id} report={r} onOpen={() => setOpened(r)} />)}
              </div>
            </Card>
          )}
        </div>

        {/* Sidebar calendar */}
        <div>
          <Card padding="md" className="sticky top-32">
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="h-4 w-4 text-gold" />
              <div className="font-serif font-semibold text-ink">Ближайшие сроки</div>
            </div>
            <div className="space-y-2">
              {REPORTS.filter((r) => r.status !== 'filed').sort((a, b) => a.daysUntil - b.daysUntil).map((r) => (
                <div key={r.id} className={cn(
                  'p-2.5 rounded-lg border text-xs',
                  r.status === 'due-soon' ? 'border-gold/40 bg-gold-soft/40' : 'border-ink-line bg-bg-white',
                )}>
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-ink font-semibold">{r.deadline}</span>
                    <span className={cn('font-mono', r.daysUntil <= 5 ? 'text-gold' : 'text-ink-muted')}>
                      {r.daysUntil > 0 ? `через ${r.daysUntil} дн` : `${Math.abs(r.daysUntil)} дн назад`}
                    </span>
                  </div>
                  <div className="text-ink truncate">{r.title}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Dialog */}
      <AnimatePresence>
        {opened && <ReportDialog report={opened} onClose={() => setOpened(null)} />}
      </AnimatePresence>

      {/* Footer */}
      <Card padding="lg" className="border-gold/25 bg-gold-soft/30">
        <div className="flex items-start gap-4">
          <div className="h-10 w-10 rounded-lg bg-gold/15 text-gold flex items-center justify-center shrink-0">
            <Sparkles className="h-5 w-5" />
          </div>
          <div className="text-sm text-ink">
            <strong>Референс:</strong> Estonia <strong>e-Tax (e-MTA)</strong> — 95% налоговых деклараций сдаётся онлайн,
            средняя декларация — 3–5 минут из-за предзаполнения. Одна подпись ID-картой — вся логика закрыта.
            В Узбекистане предприниматели сейчас ходят по 4 системам — Soliq, Нацкомстат, ГТК и Пенсионный фонд — с дублированием данных.
          </div>
        </div>
      </Card>
    </section>
  );
}

function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick} className={cn(
      'h-10 px-4 rounded-lg text-sm font-medium border transition-colors flex items-center gap-2',
      active ? 'bg-navy text-white border-navy' : 'bg-bg-white text-ink-muted border-ink-line hover:border-gold hover:text-gold',
    )}>
      {children}
    </button>
  );
}

function ReportRow({ report, onOpen }: { report: Report; onOpen: () => void }) {
  const CatIcon = CATEGORY_CONFIG[report.category].Icon;
  const tone =
    report.status === 'overdue'  ? 'border-danger/30 bg-danger/5' :
    report.status === 'due-soon' ? 'border-gold/30 bg-gold-soft/30' :
    report.status === 'filed'    ? 'border-success/20 bg-success/5' :
                                    'border-ink-line bg-bg-white';
  return (
    <div className={cn('p-3 rounded-lg border flex items-center gap-3 hover:border-gold/50 transition-colors', tone)}>
      <div className={cn(
        'h-10 w-10 rounded-lg flex items-center justify-center shrink-0',
        report.status === 'filed' ? 'bg-success/10 text-success' : 'bg-gold/10 text-gold',
      )}>
        <CatIcon className="h-5 w-5" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <div className="text-[14px] font-serif text-ink">{report.title}</div>
          {report.status === 'due-soon' && <Badge variant="warning">срок через {report.daysUntil} дн</Badge>}
          {report.status === 'filed'    && <Badge variant="success">сдано</Badge>}
        </div>
        <div className="flex items-center gap-3 text-xs text-ink-muted">
          <span>{report.authority}</span>
          <span>·</span>
          <span>{report.deadline}</span>
          <span>·</span>
          <span className="text-gold font-medium"><Clock className="inline h-3 w-3 -mt-0.5" /> ~{report.estimatedMinutes} мин</span>
        </div>
      </div>
      {report.status !== 'filed' && (
        <div className="flex flex-col items-end gap-1 shrink-0">
          <div className="text-[10.5px] text-ink-muted">предзаполнено</div>
          <div className="w-24 flex items-center gap-2">
            <ProgressBar value={report.prefilledPct} tone="success" height="sm" className="flex-1" />
            <span className="text-xs font-mono text-success">{report.prefilledPct}%</span>
          </div>
        </div>
      )}
      <Button size="sm" onClick={onOpen} variant={report.status === 'filed' ? 'ghost' : 'primary'}>
        {report.status === 'filed' ? 'Открыть' : 'Сдать →'}
      </Button>
    </div>
  );
}

function ReportDialog({ report, onClose }: { report: Report; onClose: () => void }) {
  const [step, setStep] = useState<'preview' | 'signed'>('preview');
  return (
    <motion.div
      className="fixed inset-0 z-50 bg-navy/60 backdrop-blur-sm flex items-center justify-center p-4"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
        className="bg-bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-card-hover"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-ink-line">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-xs uppercase tracking-wider text-gold font-semibold">{report.authority} · {report.id}</div>
              <CardTitle className="mt-0.5">{report.title}</CardTitle>
              <div className="text-sm text-ink-muted mt-1">Срок: {report.deadline}</div>
            </div>
            <button onClick={onClose} className="text-ink-muted hover:text-ink text-xl leading-none">&times;</button>
          </div>
        </div>

        <div className="p-6">
          {step === 'preview' && (
            <>
              <div className="p-3 rounded-lg bg-gold-soft/40 border border-gold/30 mb-4 flex items-start gap-2 text-sm">
                <Sparkles className="h-4 w-4 text-gold mt-0.5 shrink-0" />
                <span>
                  Декларация <strong>предзаполнена на {report.prefilledPct}%</strong> из Soliq и Нацкомстата.
                  Проверьте данные ниже — если всё корректно, нажмите «Подписать ЭЦП».
                </span>
              </div>

              <div className="space-y-2">
                <PrefilledRow label="Выручка за период (из Soliq)"     value="2 180 000 000 сум" auto />
                <PrefilledRow label="Экспортная выручка (из ГТК)"       value="410 000 000 сум" auto />
                <PrefilledRow label="Вычеты по НДС (из Soliq)"          value="185 400 000 сум" auto />
                <PrefilledRow label="Налоговая база"                      value="1 994 600 000 сум" auto />
                <PrefilledRow label="Сумма к доплате / возврату"           value="239 352 000 сум" auto />
                <PrefilledRow label="Примечания (заполните если нужно)" value="—" />
              </div>

              <div className="mt-6 flex gap-2 justify-end">
                <Button size="md" variant="ghost" onClick={onClose}>Отмена</Button>
                <Button size="md" leftIcon={<FileSignature className="h-4 w-4" />} onClick={() => setStep('signed')}>Подписать ЭЦП и отправить</Button>
              </div>
            </>
          )}

          {step === 'signed' && (
            <div className="text-center py-6">
              <div className="h-14 w-14 rounded-full bg-success/15 text-success flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="h-7 w-7" />
              </div>
              <CardTitle>Декларация подписана и отправлена</CardTitle>
              <CardDescription className="mt-1">Квитанция из Soliq придёт через ~2 минуты. Сохранена в истории.</CardDescription>
              <div className="mt-5 flex gap-2 justify-center">
                <Button size="md" variant="ghost" leftIcon={<Download className="h-4 w-4" />}>Скачать квитанцию</Button>
                <Button size="md" onClick={onClose}>Готово</Button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

function PrefilledRow({ label, value, auto }: { label: string; value: string; auto?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-2 p-2.5 rounded-lg bg-bg-band/40 border border-ink-line">
      <div className="flex-1 min-w-0">
        <div className="text-[11px] uppercase tracking-wider text-ink-muted font-semibold">{label}</div>
        <div className="text-sm text-ink font-medium font-mono mt-0.5">{value}</div>
      </div>
      {auto && <Badge variant="success">автозаполнено</Badge>}
    </div>
  );
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
