'use client';

import Link from 'next/link';
import { useStore, type UserProfile } from '@/lib/store';
import { Card, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import {
  Calendar, TrendingUp, Bell, Sparkles, Award, ArrowRight,
  Users2, Factory, MapPin, Building2, Gauge, Clock,
} from 'lucide-react';
import { cn } from '@/lib/cn';

// ════════════════════════════════════════════════════════════════════
// "Ваш бизнес сегодня" — consolidated daily snapshot for entrepreneur
// Uses UserProfile from store + assessments + selected region
// ════════════════════════════════════════════════════════════════════

interface UpcomingDeadline {
  title: string;
  daysLeft: number;
  severity: 'urgent' | 'normal';
}

// Hardcoded demo data — in production from user data
const UPCOMING_DEADLINES: UpcomingDeadline[] = [
  { title: 'Квартальная декларация по налогу на прибыль',     daysLeft: 5,  severity: 'urgent' },
  { title: 'Отчёт в Нацстат за I квартал',                   daysLeft: 12, severity: 'normal' },
  { title: 'Продление ЭЦП директора',                        daysLeft: 23, severity: 'normal' },
];

const NEWS_ITEMS = [
  { title: 'Новые ставки льготного кредитования вступили в силу с 01.04.2026', date: '22 апр', isNew: true },
  { title: 'Расширена программа компенсации Amazon — лимит до $7 000',         date: '18 апр', isNew: true },
  { title: 'ПФ-138: стратегия МСБ 2030 — ключевые изменения',                   date: '10 апр', isNew: false },
];

export function DashboardToday() {
  const profile = useStore((s) => s.profile);
  const assessments = useStore((s) => s.assessments);
  const selectedRegion = useStore((s) => s.selectedRegion);

  const completedAssessments = Object.values(assessments).filter(Boolean).length;

  return (
    <section className="container-wide pt-10 md:pt-14 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div>
          <div className="text-[11px] uppercase tracking-wider text-gold font-semibold">Панель предпринимателя</div>
          <h2 className="font-serif text-2xl text-ink font-semibold mt-0.5">Ваш бизнес сегодня</h2>
        </div>
        <div className="text-[12.5px] text-ink-muted">
          {new Date().toLocaleDateString('ru', { day: 'numeric', month: 'long', year: 'numeric' })}
        </div>
      </div>

      {/* Profile overview — business context */}
      <Card padding="lg" className="bg-gradient-to-br from-navy to-ink text-white relative overflow-hidden">
        <div className="absolute inset-0 pattern-dots opacity-20 pointer-events-none" />
        <div className="relative flex items-start gap-4 flex-wrap">
          <div className="h-14 w-14 rounded-xl bg-gold-gradient flex items-center justify-center shrink-0">
            <Building2 className="h-7 w-7 text-white" />
          </div>
          <div className="flex-1 min-w-[240px]">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <div className="font-serif text-xl text-white font-semibold">{profile.businessName}</div>
              {profile.isChampion && <Badge variant="new">Чемпион</Badge>}
              {profile.isItParkResident && <Badge variant="priority">IT-Park</Badge>}
            </div>
            <div className="text-[13px] text-white/70">
              ИНН {profile.inn} · {profile.form === 'ooo' ? 'ООО' : 'ИП'} · основано {profile.yearFounded}
            </div>
            <div className="text-[13px] text-white/70 mt-0.5 flex items-center gap-3 flex-wrap">
              <span className="flex items-center gap-1"><Factory className="h-3.5 w-3.5" /> {profile.industry}</span>
              <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {profile.region}</span>
              <span className="flex items-center gap-1"><Users2 className="h-3.5 w-3.5" /> {profile.employees} сотрудников</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 ml-auto">
            <ProfileStat label="Выручка 2025" value={`${profile.revenueLastYear.toLocaleString('ru')} млн`} sub="сум" />
            <ProfileStat label="Оценок пройдено" value={`${completedAssessments}/4`} sub="опросников" />
          </div>
        </div>
      </Card>

      {/* Main daily widgets grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Deadlines */}
        <Card padding="lg">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-gold" />
              <CardTitle className="text-[15px]">Ближайшие сроки</CardTitle>
            </div>
            <Link href="/modules/qRep" className="text-[11px] text-gold font-semibold hover:underline">
              Все →
            </Link>
          </div>
          <div className="space-y-2">
            {UPCOMING_DEADLINES.map((d, i) => (
              <div
                key={i}
                className={cn(
                  'p-2.5 rounded-lg border',
                  d.severity === 'urgent' ? 'border-danger/25 bg-danger/5' : 'border-ink-line bg-bg-band/40',
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 text-[13px] text-ink leading-snug">{d.title}</div>
                  <div className={cn(
                    'text-[11px] font-mono font-semibold shrink-0',
                    d.severity === 'urgent' ? 'text-danger' : 'text-gold-dark',
                  )}>
                    <Clock className="h-3 w-3 inline -mt-0.5 mr-0.5" />
                    {d.daysLeft} дн.
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Recommendations from assessments */}
        <Card padding="lg">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Gauge className="h-5 w-5 text-gold" />
              <CardTitle className="text-[15px]">Рекомендации</CardTitle>
            </div>
            <Link href="/modules/maturity" className="text-[11px] text-gold font-semibold hover:underline">
              Оценки →
            </Link>
          </div>
          {completedAssessments === 0 ? (
            <div className="text-center py-6">
              <Gauge className="h-10 w-10 mx-auto text-ink-muted/40 mb-2" />
              <div className="text-[13px] text-ink-muted mb-3">
                Пройдите оценку зрелости, чтобы получить персональные рекомендации по мерам поддержки.
              </div>
              <Link
                href="/modules/maturity"
                className="inline-flex items-center gap-1 text-[12px] text-gold font-semibold hover:underline"
              >
                Начать оценку <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              {Object.entries(assessments).map(([type, result]) => {
                if (!result) return null;
                const labels: Record<string, string> = {
                  digital: 'Цифровая зрелость',
                  finlit: 'Финграмотность',
                  export: 'Экспортная готовность',
                  finance: 'Готовность к финансированию',
                };
                return (
                  <div key={type} className="flex items-center justify-between p-2.5 rounded-lg bg-bg-band/40 border border-ink-line">
                    <div>
                      <div className="text-[12.5px] text-ink font-medium">{labels[type]}</div>
                      <div className="text-[10.5px] text-ink-muted">Пройдено</div>
                    </div>
                    <Badge variant={result.level === 'high' ? 'success' : result.level === 'medium' ? 'warning' : 'danger'}>
                      {result.scorePct}%
                    </Badge>
                  </div>
                );
              })}
              <Link
                href="/modules/registry"
                className="block text-center text-[12px] text-gold font-semibold mt-3 hover:underline"
              >
                Рекомендованные меры в Реестре →
              </Link>
            </div>
          )}
        </Card>

        {/* News & NPA */}
        <Card padding="lg">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-gold" />
              <CardTitle className="text-[15px]">Новости и НПА</CardTitle>
            </div>
            <Link href="/modules/qNews" className="text-[11px] text-gold font-semibold hover:underline">
              Все →
            </Link>
          </div>
          <div className="space-y-2">
            {NEWS_ITEMS.map((n, i) => (
              <div key={i} className="p-2.5 rounded-lg border border-ink-line bg-bg-white">
                <div className="flex items-start justify-between gap-2 mb-0.5">
                  <div className="text-[12.5px] text-ink leading-snug">{n.title}</div>
                  {n.isNew && <Badge variant="new">new</Badge>}
                </div>
                <div className="text-[10.5px] text-ink-muted font-mono">{n.date}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Quick actions strip */}
      <Card padding="md" className="border-gold/25 bg-gold-soft/30">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-gold" />
            <span className="text-[12px] text-ink-muted font-semibold">Быстрые действия:</span>
          </div>
          <div className="flex gap-2 flex-wrap">
            <QuickAction href="/modules/registry" label="Реестр мер" />
            <QuickAction href="/modules/qBiz" label="Регистрация бизнеса" />
            <QuickAction href="/modules/qRep" label="Сдать отчёт" />
            <QuickAction href="/modules/nCheck" label="Проверить контрагента" />
            <QuickAction href="/modules/ecommerce" label="Выход на маркетплейс" />
          </div>
        </div>
      </Card>
    </section>
  );
}

function ProfileStat({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="bg-white/10 border border-white/15 rounded-lg px-3 py-2 min-w-[100px]">
      <div className="text-[9.5px] uppercase tracking-wider text-gold-light/80">{label}</div>
      <div className="font-serif text-base text-white font-semibold leading-tight mt-0.5">{value}</div>
      <div className="text-[10px] text-white/55">{sub}</div>
    </div>
  );
}

function QuickAction({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="px-3 py-1.5 rounded-full bg-bg-white border border-gold/30 text-[12px] text-ink hover:border-gold hover:bg-gold-soft/60 transition-colors"
    >
      {label}
    </Link>
  );
}
