'use client';

/**
 * Sprint 10.1 — DashboardPreview.
 *
 * Right-hand-side visual of the hero. Two modes driven by `isAuthenticated`
 * from the global store:
 *
 *   • Guest: blurred mockup of the cabinet + overlay "Sign in with OneID"
 *     plus a single-line copy explaining what will appear after sign-in.
 *     Solves the "guest misses what's available" concern from Sprint 10
 *     planning without adding a separate route.
 *
 *   • Authenticated: real (mocked) dashboard of the current role with 3 KPIs
 *     (tasks / matched measures / alerts), greeting line, and "Open cabinet"
 *     CTA.
 *
 * The toggle between the two is instant — driven by the dev auth toggle in
 * the header. No animation, to make the demonstration crisp.
 *
 * Mock data is hand-crafted per role to avoid pulling from cabinet components
 * and creating a circular dependency.
 */

import Link from 'next/link';
import { CheckCircle2, BookMarked, Bell, ArrowRight, ShieldCheck } from 'lucide-react';
import { useStore } from '@/lib/store';
import { useT } from '@/lib/i18n';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/cn';
import type { Role } from '@/lib/types';

export function DashboardPreview() {
  const isAuth = useStore((s) => s.isAuthenticated);
  const role = useStore((s) => s.role);

  return isAuth ? <AuthenticatedPreview role={role} /> : <GuestPreview />;
}

// ─── Guest mode ───────────────────────────────────────────────────────
// Blurred mock dashboard + overlay card.

function GuestPreview() {
  const t = useT();
  const setAuthenticated = useStore((s) => s.setAuthenticated);

  return (
    <div className="relative rounded-2xl overflow-hidden border border-white/15 bg-white/5 backdrop-blur-sm">
      {/* Blurred mock content behind */}
      <div className="pointer-events-none select-none blur-[6px] opacity-70">
        <MockDashboardBody role="entrepreneur" />
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-gradient-to-b from-navy/55 via-navy/70 to-navy/85">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-soft/95 border border-gold/50 text-[11px] font-semibold text-gold-dark tracking-wider uppercase mb-4">
          <ShieldCheck className="h-3.5 w-3.5" />
          {t('preview.guest.badge')}
        </div>
        <div className="font-serif text-xl md:text-2xl font-semibold text-white text-center leading-tight max-w-xs">
          {t('preview.guest.title')}
        </div>
        <div className="mt-2 text-sm text-white/75 text-center max-w-xs">
          {t('preview.guest.subtitle')}
        </div>
        <Button
          size="lg"
          className="mt-5"
          rightIcon={<ArrowRight className="h-4 w-4" />}
          onClick={() => setAuthenticated(true)}
        >
          {t('preview.guest.cta')}
        </Button>
        <div className="mt-3 text-[11px] text-white/50 text-center">
          {t('auth.devToggle.hint')}
        </div>
      </div>
    </div>
  );
}

// ─── Authenticated mode ───────────────────────────────────────────────
// Real-looking dashboard of the current role.

function AuthenticatedPreview({ role }: { role: Role }) {
  const t = useT();

  return (
    <div className="rounded-2xl overflow-hidden border border-white/15 bg-white/8 backdrop-blur-sm shadow-card-hover">
      <MockDashboardBody role={role} />
      <div className="p-4 border-t border-white/10 bg-white/5">
        <Link href="/cabinet">
          <Button size="md" variant="primary" fullWidth rightIcon={<ArrowRight className="h-4 w-4" />}>
            {t('preview.auth.openCabinet')}
          </Button>
        </Link>
      </div>
    </div>
  );
}

// ─── Shared dashboard body ────────────────────────────────────────────
// Used by both guest (blurred) and authenticated (crisp).

function MockDashboardBody({ role }: { role: Role }) {
  const t = useT();
  const data = ROLE_PREVIEW[role] ?? ROLE_PREVIEW.entrepreneur;

  return (
    <div className="p-5">
      {/* Greeting strip */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-[10px] uppercase tracking-wider text-gold-light font-semibold">
            {data.cabinetLabel}
          </div>
          <div className="font-serif text-base text-white font-semibold mt-0.5">
            {t('preview.auth.greeting')} {data.name}
          </div>
        </div>
        <div className="h-10 w-10 rounded-full bg-gold-gradient text-white flex items-center justify-center font-serif font-semibold text-sm">
          {data.initials}
        </div>
      </div>

      {/* 3 KPI strip */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <KpiCell
          icon={<CheckCircle2 className="h-3.5 w-3.5" />}
          value={data.tasks}
          label={t('preview.auth.tasksLabel')}
          accent="gold"
        />
        <KpiCell
          icon={<BookMarked className="h-3.5 w-3.5" />}
          value={data.measures}
          label={t('preview.auth.measuresLabel')}
          accent="navy"
        />
        <KpiCell
          icon={<Bell className="h-3.5 w-3.5" />}
          value={data.alerts}
          label={t('preview.auth.alertsLabel')}
          accent="success"
        />
      </div>

      {/* 3 task items */}
      <div className="space-y-2">
        {data.items.map((item, i) => (
          <div
            key={i}
            className="flex items-center gap-2.5 rounded-lg bg-white/5 border border-white/10 px-3 py-2"
          >
            <div
              className={cn(
                'h-2 w-2 rounded-full shrink-0',
                item.accent === 'gold' && 'bg-gold-light',
                item.accent === 'navy' && 'bg-secondary',
                item.accent === 'success' && 'bg-success',
                item.accent === 'danger' && 'bg-danger',
              )}
            />
            <div className="flex-1 min-w-0">
              <div className="text-[12.5px] text-white font-medium truncate">{item.title}</div>
              <div className="text-[10.5px] text-white/55 truncate">{item.sub}</div>
            </div>
            <div className="text-[10px] text-white/50 shrink-0">{item.meta}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function KpiCell({
  icon,
  value,
  label,
  accent,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
  accent: 'gold' | 'navy' | 'success';
}) {
  const color =
    accent === 'gold' ? 'text-gold-light' : accent === 'navy' ? 'text-secondary' : 'text-success';
  return (
    <div className="rounded-lg bg-white/5 border border-white/10 px-2.5 py-2">
      <div className={cn('flex items-center gap-1 mb-0.5', color)}>
        {icon}
        <span className="text-[9.5px] uppercase tracking-wider font-semibold opacity-90">{label}</span>
      </div>
      <div className={cn('font-serif text-xl font-semibold leading-none', color)}>{value}</div>
    </div>
  );
}

// ─── Role-specific mock data ──────────────────────────────────────────

type PreviewItem = {
  title: string;
  sub: string;
  meta: string;
  accent: 'gold' | 'navy' | 'success' | 'danger';
};

interface RolePreview {
  cabinetLabel: string;
  name: string;
  initials: string;
  tasks: string;
  measures: string;
  alerts: string;
  items: PreviewItem[];
}

const ROLE_PREVIEW: Record<Role, RolePreview> = {
  guest: {
    // Never actually rendered — guest mode overlays this.
    cabinetLabel: 'КАБИНЕТ',
    name: 'Гость',
    initials: 'Г',
    tasks: '0',
    measures: '0',
    alerts: '0',
    items: [],
  },
  entrepreneur: {
    cabinetLabel: 'КАБИНЕТ ПРЕДПРИНИМАТЕЛЯ',
    name: 'Алишер',
    initials: 'АК',
    tasks: '4',
    measures: '7',
    alerts: '2',
    items: [
      {
        title: 'Подать квартальный отчёт',
        sub: 'До 20 июля · Soliq',
        meta: '2 дня',
        accent: 'danger',
      },
      {
        title: 'Заявка «Субсидия на экспорт»',
        sub: 'На рассмотрении · МЭФ',
        meta: 'обновлено',
        accent: 'gold',
      },
      {
        title: 'Подобрано 7 новых мер',
        sub: 'AI-навигатор · текстиль',
        meta: 'сегодня',
        accent: 'success',
      },
    ],
  },
  regionalMef: {
    cabinetLabel: 'РЕГИОНАЛЬНЫЙ МЭФ · САМАРКАНД',
    name: 'Дилшод',
    initials: 'ДР',
    tasks: '12',
    measures: '89',
    alerts: '5',
    items: [
      {
        title: '12 новых заявок в области',
        sub: 'Распределить по 3 ведомствам',
        meta: 'сегодня',
        accent: 'gold',
      },
      {
        title: 'Список чемпионов · январь',
        sub: 'Утвердить 48 кандидатов',
        meta: '3 дня',
        accent: 'navy',
      },
      {
        title: 'Отчёт о ходе мер',
        sub: 'В центральный МЭФ · до 25.07',
        meta: '5 дней',
        accent: 'success',
      },
    ],
  },
  mef: {
    cabinetLabel: 'МЭФ · ПОЛИТИКА И BI',
    name: 'Азиза',
    initials: 'АМ',
    tasks: '8',
    measures: '359',
    alerts: '14',
    items: [
      {
        title: '3 региона · падение охвата',
        sub: 'Navoi, Surxondaryo, Jizzax',
        meta: 'триггер',
        accent: 'danger',
      },
      {
        title: 'Эффективность мер Q2 2026',
        sub: 'Сводный отчёт готов',
        meta: 'new',
        accent: 'gold',
      },
      {
        title: 'Возвратность по 8 программам',
        sub: 'Анализ для коллегии',
        meta: 'завтра',
        accent: 'navy',
      },
    ],
  },
  agency: {
    cabinetLabel: 'МИНИСТЕРСТВО СЕЛЬСКОГО ХОЗЯЙСТВА',
    name: 'Фаррух',
    initials: 'ФК',
    tasks: '27',
    measures: '14',
    alerts: '3',
    items: [
      {
        title: '27 заявок в очереди',
        sub: 'Агросубсидии · подпрограмма 3',
        meta: 'сегодня',
        accent: 'gold',
      },
      {
        title: 'Решение по 14 лотам Давактив',
        sub: 'Ургут и Бухара',
        meta: '2 дня',
        accent: 'navy',
      },
      {
        title: 'Новые чемпионы из хокимиятов',
        sub: '6 человек на проверку',
        meta: 'new',
        accent: 'success',
      },
    ],
  },
};
