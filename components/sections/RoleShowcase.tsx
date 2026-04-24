'use client';

/**
 * Sprint 10.2 — Role showcase.
 *
 * Three synchronised columns showing the SAME support-measure application
 * from three perspectives:
 *
 *   • Column 1 — Entrepreneur (applicant)
 *   • Column 2 — Line ministry / Bank (reviewer)
 *   • Column 3 — MoEF (policy & BI)
 *
 * This is the "one platform, different angles" story that the Deputy Minister
 * needs: it demonstrates the Platform is NOT only a citizen frontend. It's
 * also an internal instrument of state policy — aggregating aspirations and
 * decisions across 14 regions for analytics and course-correction.
 *
 * Inspired by мсп.рф "Бизнес-навигатор" cabinet differentiation and SBA's
 * split-view investor/applicant dashboards, but adapted with MEF-specific
 * BI framing.
 *
 * Each column uses a tabular story with 3–4 data points, so the columns
 * align visually row-by-row. No interactive filtering — this is a showcase.
 */

import { motion } from 'framer-motion';
import {
  UserCheck,
  Building2,
  Crown,
  CheckCircle2,
  Clock,
  AlertCircle,
  ArrowRight,
  BarChart3,
  Send,
  Eye,
  FileCheck,
  TrendingDown,
} from 'lucide-react';
import { useT } from '@/lib/i18n';
import { cn } from '@/lib/cn';

export function RoleShowcase() {
  return (
    <section className="container-wide py-16 md:py-20 border-t border-ink-line">
      <div className="max-w-3xl mb-10 md:mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-soft border border-gold/20 text-[11px] font-semibold text-gold-dark tracking-wider uppercase mb-3">
          Платформа в действии
        </div>
        <h2 className="font-serif text-3xl md:text-4xl font-semibold text-navy text-balance">
          Одна заявка — три угла зрения
        </h2>
        <p className="mt-3 text-lg text-ink-muted text-pretty">
          Предприниматель подаёт — Министерство сельского хозяйства рассматривает — МЭФ видит
          агрегат по 14 регионам. Одна запись данных, три интерфейса. Это и есть смысл единой
          платформы.
        </p>
      </div>

      {/* Scenario header — shared across all three columns */}
      <div className="rounded-xl border border-dashed border-gold/30 bg-gold-soft/40 px-5 py-3 mb-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px]">
        <span className="text-[10.5px] uppercase tracking-wider font-semibold text-gold-dark">
          Пример · заявка №234-678
        </span>
        <span className="text-navy font-medium">
          «Субсидия на экспорт текстиля» · ООО «Силк Трейд» · Ферганская обл.
        </span>
        <span className="text-ink-muted">· 340 млн сум · Агент: Минсельхоз + МЭФ</span>
      </div>

      {/* Three columns */}
      <div className="grid md:grid-cols-3 gap-4">
        <RoleColumn
          icon={UserCheck}
          role="Предприниматель"
          roleKey="Алишер Каримов · Кабинет ИП"
          accent="gold"
          delay={0}
          flow={[
            {
              icon: Send,
              status: 'success',
              title: 'Заявку подал',
              time: '17 апреля, 14:32',
              detail:
                'Через AI-навигатор реестра мер. Профиль «Силк Трейд» подтянулся из Soliq автоматически.',
              kpi: '12 мин',
              kpiLabel: 'заполнение',
            },
            {
              icon: Eye,
              status: 'info',
              title: 'Получил статус «На рассмотрении»',
              time: '19 апреля',
              detail:
                'Трек заявки в реальном времени. Уведомление в Telegram. Оценка шансов одобрения: 78%.',
              kpi: '3 этапа',
              kpiLabel: 'до решения',
            },
            {
              icon: CheckCircle2,
              status: 'success',
              title: 'Решение — одобрено',
              time: 'ожидается 2 мая',
              detail:
                'После одобрения — средства поступят в течение 10 рабочих дней. Отчётность через кабинет.',
              kpi: '340 млн',
              kpiLabel: 'сум субсидии',
            },
          ]}
          summary={{
            label: 'Экономия времени',
            value: '~14 дней',
            sub: 'относительно бумажного процесса',
          }}
        />

        <RoleColumn
          icon={Building2}
          role="Ведомство"
          roleKey="Минсельхоз · Оператор субсидии"
          accent="navy"
          delay={0.08}
          flow={[
            {
              icon: FileCheck,
              status: 'info',
              title: 'Получил заявку в очередь',
              time: '17 апреля, 14:35',
              detail:
                'Автоматическая маршрутизация по ОКЭД 13.10. Eligibility-скор от системы: 78/100.',
              kpi: '27',
              kpiLabel: 'в очереди',
            },
            {
              icon: Clock,
              status: 'warning',
              title: 'Проверка критериев',
              time: '18–22 апреля',
              detail:
                'Soliq · Минюст · Кадастр — данные подтянулись. Нужна верификация справки об экспорте.',
              kpi: '7 / 8',
              kpiLabel: 'критериев ок',
            },
            {
              icon: CheckCircle2,
              status: 'success',
              title: 'Передано на финальное решение',
              time: '24 апреля',
              detail:
                'Заключение подписано ЭЦП. Направлено в МЭФ для включения в транш Q2 2026.',
              kpi: '5 дн.',
              kpiLabel: 'SLA соблюдён',
            },
          ]}
          summary={{
            label: 'Разгрузка офиса',
            value: '−63%',
            sub: 'бумажных обращений',
          }}
        />

        <RoleColumn
          icon={Crown}
          role="МЭФ · Policy & BI"
          roleKey="Департамент анализа МСБ"
          accent="success"
          delay={0.16}
          flow={[
            {
              icon: BarChart3,
              status: 'info',
              title: 'Агрегат по программе',
              time: 'на лету',
              detail:
                'Субсидия на экспорт · Q2 2026. Одобрено 84 заявки, сумма 28.4 млрд сум. Охват 11 регионов.',
              kpi: '84',
              kpiLabel: 'одобрено YTD',
            },
            {
              icon: TrendingDown,
              status: 'warning',
              title: 'Триггер выявлен',
              time: '22 апреля',
              detail:
                'Охват в Сурхандарьинской обл. — 1.2% против целевых 4.5%. Система рекомендует точечный бриф для регионального МЭФ.',
              kpi: 'Surxondaryo',
              kpiLabel: 'регион риска',
            },
            {
              icon: AlertCircle,
              status: 'info',
              title: 'Коллегия МЭФ',
              time: '28 апреля',
              detail:
                'Отчёт об эффективности программы сформирован. 3 рекомендации по корректировке критериев.',
              kpi: '3',
              kpiLabel: 'предложения',
            },
          ]}
          summary={{
            label: 'Горизонт решений',
            value: '< 24 ч',
            sub: 'от события до сигнала',
          }}
        />
      </div>

      {/* Connective line at the bottom */}
      <div className="mt-8 rounded-2xl border border-ink-line bg-bg-band px-6 py-5 text-[14px] text-ink flex flex-wrap items-center gap-x-3 gap-y-1 justify-center">
        <span className="font-serif font-semibold text-navy">Одна запись данных.</span>
        <span className="text-ink-muted">Три интерфейса.</span>
        <span className="text-gold-dark font-medium">
          Без двойного ввода, без писем, без потери контекста.
        </span>
      </div>
    </section>
  );
}

// ─── Role column ──────────────────────────────────────────────────────

interface FlowStep {
  icon: typeof UserCheck;
  status: 'success' | 'info' | 'warning' | 'danger';
  title: string;
  time: string;
  detail: string;
  kpi: string;
  kpiLabel: string;
}

interface RoleColumnProps {
  icon: typeof UserCheck;
  role: string;
  roleKey: string;
  accent: 'gold' | 'navy' | 'success';
  flow: FlowStep[];
  summary: { label: string; value: string; sub: string };
  delay: number;
}

function RoleColumn({ icon: Icon, role, roleKey, accent, flow, summary, delay }: RoleColumnProps) {
  const accentSpec =
    accent === 'gold'
      ? { border: 'border-gold/30', bg: 'bg-gold-soft/30', header: 'bg-gold-gradient', text: 'text-white' }
      : accent === 'navy'
        ? { border: 'border-navy/20', bg: 'bg-navy-50', header: 'bg-navy-gradient', text: 'text-white' }
        : { border: 'border-success/30', bg: 'bg-success/5', header: 'bg-success', text: 'text-white' };

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay }}
      className={cn(
        'rounded-2xl border overflow-hidden flex flex-col',
        accentSpec.border,
        accentSpec.bg,
      )}
    >
      {/* Header strip */}
      <div className={cn('p-4 flex items-center gap-3', accentSpec.header, accentSpec.text)}>
        <div className="h-10 w-10 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center">
          <Icon className="h-5 w-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-serif font-semibold text-[17px] leading-tight">{role}</div>
          <div className="text-[11px] opacity-85 mt-0.5">{roleKey}</div>
        </div>
      </div>

      {/* Flow */}
      <div className="flex-1 p-4 space-y-3">
        {flow.map((step, i) => (
          <FlowStepCard key={i} step={step} isLast={i === flow.length - 1} />
        ))}
      </div>

      {/* Summary footer */}
      <div className="px-4 py-3 border-t border-dashed border-ink-line/60 bg-white/50 flex items-center justify-between">
        <div>
          <div className="text-[10px] uppercase tracking-wider font-semibold text-ink-muted">
            {summary.label}
          </div>
          <div className="font-serif text-xl font-semibold text-navy leading-tight mt-0.5">
            {summary.value}
          </div>
          <div className="text-[11px] text-ink-muted">{summary.sub}</div>
        </div>
        <ArrowRight className="h-5 w-5 text-ink-muted" />
      </div>
    </motion.div>
  );
}

function FlowStepCard({ step, isLast }: { step: FlowStep; isLast: boolean }) {
  const StepIcon = step.icon;
  const statusSpec = {
    success: { bg: 'bg-success/10', icon: 'text-success', bar: 'bg-success' },
    info: { bg: 'bg-secondary/10', icon: 'text-secondary', bar: 'bg-secondary' },
    warning: { bg: 'bg-gold-soft', icon: 'text-gold-dark', bar: 'bg-gold' },
    danger: { bg: 'bg-danger/10', icon: 'text-danger', bar: 'bg-danger' },
  }[step.status];

  return (
    <div className="relative flex gap-3">
      {/* Timeline bar */}
      <div className="relative shrink-0 w-8">
        <div
          className={cn(
            'h-8 w-8 rounded-full flex items-center justify-center',
            statusSpec.bg,
          )}
        >
          <StepIcon className={cn('h-3.5 w-3.5', statusSpec.icon)} />
        </div>
        {!isLast && (
          <div
            className={cn(
              'absolute left-1/2 -translate-x-1/2 top-8 bottom-[-12px] w-px',
              statusSpec.bar,
              'opacity-20',
            )}
          />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 pb-0">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="text-[13px] font-semibold text-navy leading-tight">{step.title}</div>
            <div className="text-[10.5px] text-ink-muted mt-0.5">{step.time}</div>
          </div>
          <div className="text-right shrink-0">
            <div className="font-serif text-[15px] font-semibold text-navy leading-none">
              {step.kpi}
            </div>
            <div className="text-[9.5px] uppercase tracking-wider text-ink-muted font-medium mt-0.5">
              {step.kpiLabel}
            </div>
          </div>
        </div>
        <div className="text-[11.5px] text-ink-muted mt-1.5 leading-snug">{step.detail}</div>
      </div>
    </div>
  );
}
