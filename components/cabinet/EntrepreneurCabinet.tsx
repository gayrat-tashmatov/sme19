'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Gauge, MapPin, FileText, Bell, ShoppingBag, Calendar, TrendingUp, AlertCircle, CheckCircle2, Clock, ChevronRight, ArrowRight, ShieldCheck, MessageCircle, Newspaper, Fingerprint, Globe } from 'lucide-react';
import { Card, CardTitle, CardDescription } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { CircularProgress, ProgressBar } from '@/components/ui/Progress';
import { StatusPill } from '@/components/ui/StatusPill';
import { CabinetHero } from './CabinetHero';
import { DashboardToday } from './DashboardToday';
import { getLevel } from '@/lib/data/maturity';
import { MARKETPLACES } from '@/lib/data/marketplaces';

const USER = {
  name: 'Алишер Каримов',
  company: 'ООО «Karimov Tekstil»',
  inn: '301234567',
  region: 'г. Ташкент, Яшнабадский р-н',
  sector: 'Производство текстиля',
  oked: '13.20',
  legalForm: 'ООО',
  employees: 42,
  revenue: '~ 4.2 млрд сум/год',
  vatRegistered: true,
  maturityScore: 62,
  // Рейтинг устойчивости субъектов предпринимательства (ПКМ №55 от 30.01.2024)
  sustainabilityRating: {
    category: 'AA' as 'AAA' | 'AA' | 'A' | 'B' | 'C' | 'D',
    score: 93,
    updatedAt: '12 апр 2026',
  },
  taxDebt: { amount: 0, overdue: false },
};

const ACTIVE_APPS = [
  { id: 'YARP-MZR-2026-1847', title: 'Льготный кредит для производства',       agency: 'ОАБ «Узнацбанк»',  progress: 65, status: 'in-review' as const, sla: '7 дн. осталось' },
  { id: 'YARP-MZR-2026-1602', title: 'Субсидия на модернизацию оборудования',  agency: 'МЭФ',              progress: 100, status: 'approved' as const, sla: 'Одобрено 22.03' },
];

// Sprint 3 · My B2G inquiries (E-Ijro-aligned)
const B2G_INQUIRIES = [
  { id: 'YARP-COM-2026-0142', title: 'Разъяснение по НДС при экспорте в ЕАЭС',    to: 'Налоговый комитет', status: 'in-review'  as const, statusLabel: 'У исполнителя',  date: '10 апр', sla: '18 дн осталось' },
  { id: 'YARP-COM-2026-0128', title: 'Справка об отсутствии задолженности',       to: 'Минюст',             status: 'approved'   as const, statusLabel: 'Ответ получен', date: '05 апр', sla: 'исполнено за 9 дн' },
  { id: 'YARP-COM-2026-0115', title: 'Консультация по таможенной пошлине',        to: 'Таможня',            status: 'submitted'  as const, statusLabel: 'На маршрутизации МЭФ', date: '02 апр', sla: 'SLA 3 дн' },
];

// Sprint 3 · News/НПА feed personalised for this user's profile
const RELEVANT_NEWS = [
  {
    id: 'N-2026-0412',
    title: 'С 01.07.2026 меняется ставка НДС для розничной торговли одеждой с 12 на 10%',
    date: '14 апр',
    source: 'ПКМ №180',
    aiSummary: 'Касается ваших ОКЭД 13.20 + 47.71. После 01 июля НДС в накладных на розничную продукцию снизится — пересчитайте цены и настройки в кассе. Экономия ~ 9 млн сум/квартал при текущих оборотах.',
    impact: 'high' as const,
  },
  {
    id: 'N-2026-0408',
    title: 'Упрощены требования к сертификации текстильной продукции',
    date: '10 апр',
    source: 'Приказ Torgsert №124',
    aiSummary: 'Ваш ОКЭД 13.20. Перечень испытаний сокращён с 12 до 7, срок выдачи сертификата — с 45 до 21 дня. Экономия на партию ~ 2.4 млн сум.',
    impact: 'high' as const,
  },
  {
    id: 'N-2026-0402',
    title: 'Продление субсидии на внедрение POS-систем до конца 2026 года',
    date: '05 апр',
    source: 'ПКМ №96',
    aiSummary: 'Косвенно применимо — для розничного сегмента вашего бизнеса. Компенсация до 30% стоимости POS, лимит 15 млн сум на предприятие.',
    impact: 'medium' as const,
  },
];

const RATING_META: Record<'AAA' | 'AA' | 'A' | 'B' | 'C' | 'D', { label: string; color: string; range: string }> = {
  AAA: { label: 'Высокий',  color: 'bg-success text-white',  range: '96–100 баллов' },
  AA:  { label: 'Высокий',  color: 'bg-success text-white',  range: '91–95 баллов' },
  A:   { label: 'Средний',  color: 'bg-gold text-white',     range: '86–90 баллов' },
  B:   { label: 'Средний',  color: 'bg-gold/80 text-white',  range: '81–85 баллов' },
  C:   { label: 'Низкий',   color: 'bg-ink-muted text-white', range: '26–80 баллов' },
  D:   { label: 'Низкий',   color: 'bg-danger text-white',   range: 'до 25 баллов' },
};

const OBLIGATIONS = [
  { id: 1, title: 'Налоговая декларация Q1 2026', due: '25.04.2026', urgent: true,  type: 'tax' },
  { id: 2, title: 'Статотчёт «ДФС»',              due: '30.04.2026', urgent: true,  type: 'stat' },
  { id: 3, title: 'Погашение по кредиту',          due: '15.05.2026', urgent: false, type: 'payment' },
  { id: 4, title: 'Продление лицензии на торговлю', due: '12.06.2026', urgent: false, type: 'license' },
];

const NEW_MEASURES_FIN = [
  { id: 'M015', title: 'Грант на цифровизацию МСБ',            match: 92, amount: 'до 120 млн сум' },
  { id: 'M014', title: 'Компенсация выставочных расходов',     match: 78, amount: 'до 25 млн сум' },
  { id: 'M008', title: 'Компенсация процентной ставки',        match: 70, amount: '50% от ставки' },
];

const NEW_MEASURES_NONFIN = [
  { id: 'N007', title: 'Консультация ЦПП · упаковка на экспорт', match: 88, meta: 'Центр развития предпринимательства · Ташкент' },
  { id: 'N012', title: 'Обучение HACCP (сертификат, 16 ч)',      match: 82, meta: 'ЦПП + Torgsert · онлайн · бесплатно' },
  { id: 'N003', title: 'Подбор международного партнёра по экспорту', match: 64, meta: 'Enterprise Uzbekistan · 5 стран на выбор' },
];

export function EntrepreneurCabinet() {
  const level = getLevel(USER.maturityScore);
  const partnerMarketplaces = MARKETPLACES.filter((m) => m.isPartner).slice(0, 3);

  return (
    <>
      <CabinetHero
        eyebrow="Личный кабинет · предприниматель"
        title={`Добро пожаловать, ${USER.name}`}
        subtitle={`${USER.company} · ИНН ${USER.inn} · ${USER.employees} сотрудников`}
        badge={<Badge variant="priority-solid">Gold</Badge>}
        rightSlot={
          <div className="hidden md:block rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 px-5 py-3 text-sm">
            <div className="text-white/60 uppercase tracking-wider text-xs mb-1">Ваш регион</div>
            <div className="font-medium text-white">{USER.region}</div>
            <Link href="/modules/geo" className="text-xs text-gold-light mt-1 inline-flex items-center gap-1 hover:gap-1.5 transition-all">
              На карте <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        }
      />

      {/* 7.4 — Live dashboard "Ваш бизнес сегодня" */}
      <DashboardToday />

      {/* Sprint 3 · Digital Profile (цифровой профиль бизнеса) */}
      <section className="container-wide pt-10">
        <Card padding="lg" className="border-gold/25 bg-gold-soft/15">
          <div className="flex items-start gap-4 mb-5 flex-wrap">
            <div className="h-11 w-11 rounded-xl bg-gold/15 text-gold flex items-center justify-center shrink-0">
              <Fingerprint className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <CardTitle>Цифровой профиль бизнеса</CardTitle>
                <Badge variant="outline">через МИП</Badge>
              </div>
              <CardDescription className="mt-0.5">
                Сводная карточка профиля из государственных реестров: Минюст, Soliq, Кадастр, Таможня.
                Обновляется автоматически. Используется для персонализации мер и проверки соответствия.
              </CardDescription>
            </div>
            <div className={`px-4 py-2 rounded-xl text-center ${RATING_META[USER.sustainabilityRating.category].color}`}>
              <div className="text-[10px] uppercase tracking-wider opacity-80 font-semibold">Рейтинг устойчивости</div>
              <div className="font-serif font-bold text-2xl leading-tight">{USER.sustainabilityRating.category}</div>
              <div className="text-[11px] opacity-90">{USER.sustainabilityRating.score}/100</div>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <ProfileField label="ИНН / PINFL" value={USER.inn} />
            <ProfileField label="Форма" value={USER.legalForm} />
            <ProfileField label="ОКЭД" value={USER.oked} subtitle="Производство текстиля" />
            <ProfileField label="Сотрудники" value={`${USER.employees}`} subtitle="официально трудоустроены" />
            <ProfileField label="Обороты" value={USER.revenue} subtitle="по данным Soliq" />
            <ProfileField label="Регион" value="Ташкент · Яшнабад" subtitle="основной адрес" />
            <ProfileField
              label="Задолженности"
              value={USER.taxDebt.amount === 0 ? 'отсутствуют' : `${USER.taxDebt.amount.toLocaleString('ru')} сум`}
              subtitle="на текущую дату"
              tone={USER.taxDebt.amount === 0 ? 'success' : 'danger'}
            />
            <ProfileField
              label="НДС"
              value={USER.vatRegistered ? 'плательщик' : 'не плательщик'}
              subtitle="реестр Налогового комитета"
            />
          </div>

          <div className="mt-4 pt-4 border-t border-ink-line/60 flex items-center justify-between flex-wrap gap-3">
            <div className="text-xs text-ink-muted flex items-center gap-2">
              <ShieldCheck className="h-3.5 w-3.5 text-success" />
              Данные актуализированы {USER.sustainabilityRating.updatedAt} через МИП · рейтинг из{' '}
              <a href="https://my3.soliq.uz" target="_blank" rel="noopener noreferrer" className="text-gold hover:underline inline-flex items-center gap-1">
                my3.soliq.uz <Globe className="h-3 w-3" />
              </a>
            </div>
            <div className="text-xs text-ink-muted">
              {RATING_META[USER.sustainabilityRating.category].range} · уровень {RATING_META[USER.sustainabilityRating.category].label.toLowerCase()}
            </div>
          </div>
        </Card>
      </section>

      {/* Dashboard grid */}
      <section className="container-wide py-10 md:py-14 grid lg:grid-cols-3 gap-5">
        {/* ─── Maturity score ─── */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Card padding="lg" className="h-full">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Gauge className="h-5 w-5 text-gold" />
                <CardTitle className="text-[16px]">Цифровая зрелость</CardTitle>
              </div>
              <Badge variant="priority-solid">{level.label}</Badge>
            </div>
            <div className="flex items-center gap-5 mt-4">
              <CircularProgress value={USER.maturityScore} size={120} strokeWidth={10} label={String(USER.maturityScore)} sublabel="/100" tone="gold" />
              <div className="flex-1 min-w-0 text-sm text-ink">
                <p>Ваш уровень — Gold. Рекомендуем укрепить направление «Данные» перед переходом на Platinum.</p>
                <Link href="/modules/maturity" className="mt-3 inline-flex items-center gap-1 text-gold font-medium hover:text-gold-dark text-xs">
                  Посмотреть полный результат <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* ─── Active applications ─── */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="lg:col-span-2"
        >
          <Card padding="lg" className="h-full">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-gold" />
                <CardTitle className="text-[16px]">Активные заявки</CardTitle>
              </div>
              <Link href="/modules/registry" className="text-xs text-gold font-medium hover:text-gold-dark">Все заявки →</Link>
            </div>
            <div className="space-y-3">
              {ACTIVE_APPS.map((a) => (
                <div key={a.id} className="p-3.5 rounded-xl border border-ink-line bg-bg-band/40">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="min-w-0">
                      <div className="font-medium text-ink text-[15px]">{a.title}</div>
                      <div className="text-xs text-ink-muted mt-0.5 font-mono">{a.id} · {a.agency}</div>
                    </div>
                    <StatusPill
                      status={a.status}
                      label={a.status === 'approved' ? 'одобрено' : 'рассмотрение'}
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <ProgressBar value={a.progress} tone={a.status === 'approved' ? 'success' : 'gold'} height="sm" className="flex-1" />
                    <span className="text-xs text-ink-muted whitespace-nowrap">{a.sla}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* ─── Obligations ─── */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="lg:col-span-2"
        >
          <Card padding="lg" className="h-full">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-gold" />
                <CardTitle className="text-[16px]">Обязательства и сроки</CardTitle>
              </div>
              <Badge variant="warning">2 срочных</Badge>
            </div>
            <div className="space-y-2">
              {OBLIGATIONS.map((o) => (
                <div key={o.id} className="p-3 rounded-lg flex items-center gap-3 hover:bg-bg-band/60 transition-colors">
                  <div className={`h-9 w-9 rounded-lg flex items-center justify-center shrink-0 ${
                    o.urgent ? 'bg-danger/10 text-danger' : 'bg-bg-band text-ink-muted'
                  }`}>
                    {o.urgent ? <AlertCircle className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-ink text-sm">{o.title}</div>
                    <div className="text-xs text-ink-muted">Срок: {o.due}</div>
                  </div>
                  {o.urgent && <Badge variant="danger">срочно</Badge>}
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* ─── Sprint 3 · Мои обращения в ведомства (B2G) ─── */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.12 }}
          className="lg:col-span-2"
        >
          <Card padding="lg" className="h-full">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-gold" />
                <CardTitle className="text-[16px]">Мои обращения в ведомства</CardTitle>
              </div>
              <Link href="/modules/comms" className="text-xs text-gold font-medium hover:text-gold-dark">
                Все обращения →
              </Link>
            </div>
            <div className="space-y-2.5">
              {B2G_INQUIRIES.map((inq) => (
                <div key={inq.id} className="p-3 rounded-lg border border-ink-line bg-bg-band/40">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-ink text-[14px] leading-tight">{inq.title}</div>
                      <div className="text-[11px] text-ink-muted mt-1 font-mono">{inq.id} · {inq.to}</div>
                      <div className="mt-1.5 flex items-center gap-3 text-[11px] text-ink-muted">
                        <span>{inq.date}</span>
                        <span className="text-gold">· {inq.sla}</span>
                      </div>
                    </div>
                    <StatusPill status={inq.status} label={inq.statusLabel} />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-3 pt-3 border-t border-ink-line/60 text-[11px] text-ink-muted flex items-center gap-2">
              <Clock className="h-3 w-3" />
              До интеграции с E-Ijro — ручная маршрутизация через МЭФ (SLA 3 дн)
            </div>
          </Card>
        </motion.div>

        {/* ─── Sprint 3 · Новые НПА для вас ─── */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.14 }}
        >
          <Card padding="lg" className="h-full">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Newspaper className="h-5 w-5 text-gold" />
                <CardTitle className="text-[16px]">Новые НПА для вас</CardTitle>
              </div>
              <Link href="/modules/qNews" className="text-xs text-gold font-medium hover:text-gold-dark">
                Все →
              </Link>
            </div>
            <div className="space-y-3">
              {RELEVANT_NEWS.slice(0, 3).map((n) => (
                <div key={n.id} className="p-3 rounded-lg border border-ink-line bg-bg-white hover:border-gold/40 transition-colors">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <span className="text-[10px] uppercase tracking-wider font-mono text-ink-muted">{n.source}</span>
                    {n.impact === 'high' && <Badge variant="priority">важно</Badge>}
                  </div>
                  <div className="text-[13px] font-medium text-ink leading-snug mb-1.5">{n.title}</div>
                  <div className="flex items-start gap-1.5 p-2 rounded-md bg-gold-soft/40 border border-gold/15">
                    <TrendingUp className="h-3 w-3 text-gold mt-0.5 shrink-0" />
                    <div className="text-[11px] text-ink-soft leading-snug">
                      {n.aiSummary}
                    </div>
                  </div>
                  <div className="mt-1.5 text-[10px] text-ink-muted">{n.date}</div>
                </div>
              ))}
            </div>
            <div className="mt-3 pt-3 border-t border-ink-line/60 text-[11px] text-ink-muted flex items-center gap-2">
              <Bell className="h-3 w-3" />
              AI-резюме по вашему профилю (ОКЭД {USER.oked}, регион, размер)
            </div>
          </Card>
        </motion.div>

        {/* ─── Recommended measures ─── */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
        >
          <Card padding="lg" className="h-full">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="h-5 w-5 text-gold" />
              <CardTitle className="text-[16px]">Рекомендованные меры</CardTitle>
            </div>

            {/* ─── Financial group ─── */}
            <div className="mb-4">
              <div className="text-[10.5px] uppercase tracking-[0.14em] text-gold font-semibold mb-2 flex items-center gap-2">
                <span className="inline-block h-[2px] w-5 bg-gold" /> Финансовые
              </div>
              <div className="space-y-2">
                {NEW_MEASURES_FIN.map((m) => (
                  <Link key={m.id} href="/modules/registry" className="block p-3 rounded-lg border border-ink-line bg-bg-white hover:border-gold hover:bg-gold-soft/40 transition-all">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-[11px] uppercase tracking-wider text-ink-muted font-mono">{m.id}</span>
                      <span className="text-[11px] font-semibold text-success">{m.match}% match</span>
                    </div>
                    <div className="text-sm font-medium text-ink leading-snug">{m.title}</div>
                    <div className="text-[11.5px] text-gold mt-1 font-medium">{m.amount}</div>
                  </Link>
                ))}
              </div>
            </div>

            {/* ─── Non-financial group ─── */}
            <div>
              <div className="text-[10.5px] uppercase tracking-[0.14em] text-secondary font-semibold mb-2 flex items-center gap-2">
                <span className="inline-block h-[2px] w-5 bg-secondary" /> Нефинансовые
              </div>
              <div className="space-y-2">
                {NEW_MEASURES_NONFIN.map((m) => (
                  <Link key={m.id} href="/modules/registry" className="block p-3 rounded-lg border border-ink-line bg-bg-white hover:border-secondary hover:bg-secondary/5 transition-all">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-[11px] uppercase tracking-wider text-ink-muted font-mono">{m.id}</span>
                      <span className="text-[11px] font-semibold text-success">{m.match}% match</span>
                    </div>
                    <div className="text-sm font-medium text-ink leading-snug">{m.title}</div>
                    <div className="text-[11.5px] text-ink-muted mt-1">{m.meta}</div>
                  </Link>
                ))}
              </div>
            </div>
          </Card>
        </motion.div>

        {/* ─── Marketplaces ─── */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="lg:col-span-2"
        >
          <Card padding="lg" className="h-full">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-gold" />
                <CardTitle className="text-[16px]">Маркетплейсы-партнёры</CardTitle>
              </div>
              <Link href="/modules/ecommerce" className="text-xs text-gold font-medium hover:text-gold-dark">Все 12 →</Link>
            </div>
            <div className="grid sm:grid-cols-3 gap-3">
              {partnerMarketplaces.map((mp) => (
                <div key={mp.id} className="p-3 rounded-lg border border-ink-line bg-bg-band/40">
                  <Badge variant="priority-solid" className="mb-2">Партнёр Платформы</Badge>
                  <div className="text-sm font-medium text-ink leading-snug">{mp.name}</div>
                  <div className="text-xs text-ink-muted mt-1">{mp.coverage} · {mp.category}</div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* ─── Region quick link ─── */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.25 }}
        >
          <Card padding="lg" tone="navy" className="text-white h-full flex flex-col">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="h-5 w-5 text-gold-light" />
              <CardTitle className="text-white text-[16px]">Район · Яшнабад</CardTitle>
            </div>
            <div className="flex-1">
              <p className="text-sm text-white/75">
                В вашем районе 12 свободных лотов Давактив и активные программы цифровизации от хокимията.
              </p>
              <div className="mt-5 grid grid-cols-2 gap-3">
                <div>
                  <div className="font-serif text-2xl font-semibold text-gold-light">12</div>
                  <div className="text-xs text-white/60 uppercase tracking-wider">лотов</div>
                </div>
                <div>
                  <div className="font-serif text-2xl font-semibold text-gold-light">45</div>
                  <div className="text-xs text-white/60 uppercase tracking-wider">МСБ/1000</div>
                </div>
              </div>
            </div>
            <Link href="/modules/geo" className="mt-5 inline-flex items-center gap-1 text-sm text-gold-light font-medium hover:text-white">
              Открыть на карте <ChevronRight className="h-4 w-4" />
            </Link>
          </Card>
        </motion.div>

        {/* ─── Notifications ─── */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="lg:col-span-3"
        >
          <Card padding="lg">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-gold" />
                <CardTitle className="text-[16px]">Уведомления</CardTitle>
              </div>
              <button className="text-xs text-gold font-medium hover:text-gold-dark">Отметить всё прочитанным</button>
            </div>
            <div className="space-y-2">
              <NotificationRow
                Icon={CheckCircle2} color="text-success" bg="bg-success/10"
                title="Заявка YARP-MZR-2026-1602 одобрена"
                meta="МЭФ · 22 марта · 350 млн сум"
              />
              <NotificationRow
                Icon={Bell} color="text-gold" bg="bg-gold/10"
                title="Новая мера M015 «Грант на цифровизацию МСБ» — 92% match с вашим профилем"
                meta="Подробнее в каталоге мер"
              />
              <NotificationRow
                Icon={AlertCircle} color="text-danger" bg="bg-danger/10"
                title="До сдачи налоговой декларации Q1 2026 — 4 дня"
                meta="Нажмите, чтобы открыть форму (модуль появится в 2027)"
              />
            </div>
          </Card>
        </motion.div>
      </section>
    </>
  );
}

function NotificationRow({ Icon, color, bg, title, meta }: { Icon: typeof Bell; color: string; bg: string; title: string; meta: string }) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-bg-band/60 transition-colors">
      <div className={`h-9 w-9 rounded-lg flex items-center justify-center shrink-0 ${bg} ${color}`}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-ink">{title}</div>
        <div className="text-xs text-ink-muted mt-0.5">{meta}</div>
      </div>
    </div>
  );
}

function ProfileField({
  label, value, subtitle, tone = 'default',
}: {
  label: string;
  value: string;
  subtitle?: string;
  tone?: 'default' | 'success' | 'danger';
}) {
  const valueColor =
    tone === 'success' ? 'text-success' :
    tone === 'danger'  ? 'text-danger'  : 'text-ink';
  return (
    <div className="p-3 rounded-lg bg-bg-white border border-ink-line/60">
      <div className="text-[10.5px] uppercase tracking-wider text-ink-muted font-semibold mb-0.5">
        {label}
      </div>
      <div className={`font-serif font-semibold text-[15px] leading-tight ${valueColor}`}>
        {value}
      </div>
      {subtitle && (
        <div className="text-[11px] text-ink-muted mt-0.5 leading-tight">
          {subtitle}
        </div>
      )}
    </div>
  );
}
