'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Cell } from 'recharts';
import {
  Users2, Building2, TrendingUp, ShieldCheck, Plus, ChevronRight, Sparkles,
  Trophy, Map, MessageCircle, FileText, Briefcase,
} from 'lucide-react';
import { Card, CardTitle, CardDescription } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { CabinetHero } from './CabinetHero';

// ═══════════════════════════════════════════════════════════════════
// Regional MEF cabinet — for Hokimiyat employees in 14 regions.
// This role was renamed from HokimCabinet in Sprint 1 based on MEF
// April 2026 feedback: hokim and hokim-assistant data flows should
// be integrated via «Онлайн-махалля» API (Wave 2), not modelled
// directly in the platform. Regional MEF employees work at the
// област/viloyat level — aggregating district passports, running
// the champion programme, routing B2G enquiries.
// ═══════════════════════════════════════════════════════════════════

const REGIONAL_KPI = [
  { labelRu: 'Активных МСБ в области',     value: 48_247, delta: '+1 284 за мес.', positive: true },
  { labelRu: 'Поданных заявок на меры',   value: 1_842,  delta: '+216 за мес.',   positive: true },
  { labelRu: 'Районов в области',          value: 15,     delta: 'паспорта заполнены', positive: true },
  { labelRu: 'Чемпионов-предпринимателей', value: 32,     delta: '12 выдвинуто Q2', positive: true },
];

// Top industries in the region — aggregated across districts
const INDUSTRIES = [
  { name: 'Сельское хозяйство', count: 12_450 },
  { name: 'Торговля', count: 9_820 },
  { name: 'Производство', count: 7_640 },
  { name: 'Услуги', count: 6_990 },
  { name: 'Строительство', count: 4_810 },
  { name: 'Транспорт', count: 3_520 },
  { name: 'Прочее', count: 3_017 },
];

// Mock: 15 districts of the region with passport completion state
const DISTRICTS = [
  { name: 'Самарканд · город',     smeCount: 8_240,  topIndustry: 'Торговля',            passport: 'complete' },
  { name: 'Ургут',                 smeCount: 4_120,  topIndustry: 'АПК',                  passport: 'complete' },
  { name: 'Кошрабад',              smeCount: 2_890,  topIndustry: 'АПК',                  passport: 'partial'  },
  { name: 'Пастдаргом',            smeCount: 3_450,  topIndustry: 'АПК',                  passport: 'complete' },
  { name: 'Пайарык',               smeCount: 2_670,  topIndustry: 'АПК',                  passport: 'partial'  },
  { name: 'Нурабад',               smeCount: 1_980,  topIndustry: 'Транспорт',            passport: 'complete' },
  { name: 'Булунгур',              smeCount: 3_210,  topIndustry: 'АПК',                  passport: 'complete' },
  { name: 'Иштыхан',               smeCount: 2_150,  topIndustry: 'АПК',                  passport: 'missing'  },
  { name: 'Каттакурган · город',   smeCount: 4_890,  topIndustry: 'Производство',         passport: 'complete' },
  { name: 'Каттакурганский',       smeCount: 2_760,  topIndustry: 'АПК',                  passport: 'partial'  },
  { name: 'Нарпай',                smeCount: 2_310,  topIndustry: 'АПК',                  passport: 'complete' },
  { name: 'Пахтачи',               smeCount: 2_060,  topIndustry: 'Торговля',             passport: 'partial'  },
  { name: 'Самаркандский',         smeCount: 2_890,  topIndustry: 'Услуги',               passport: 'complete' },
  { name: 'Акдарья',               smeCount: 1_870,  topIndustry: 'АПК',                  passport: 'missing'  },
  { name: 'Тайлак',                smeCount: 2_740,  topIndustry: 'АПК',                  passport: 'partial'  },
];

export function RegionalMefCabinet() {
  const passportComplete = DISTRICTS.filter((d) => d.passport === 'complete').length;

  return (
    <>
      <CabinetHero
        eyebrow="Региональное подразделение МЭФ · Самаркандская область"
        title="Взаимодействует с хокимиятом — сводная панель области"
        subtitle="Координация мер поддержки, ведение паспортов 15 районов, формирование чемпионов, маршрутизация B2G."
        badge={<Badge variant="priority-solid">Региональный МЭФ</Badge>}
      />

      <section className="container-wide py-10 md:py-14">
        {/* KPI */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {REGIONAL_KPI.map((k, i) => (
            <motion.div
              key={k.labelRu}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: i * 0.06 }}
            >
              <Card>
                <div className="text-xs uppercase tracking-wider text-ink-muted mb-1">{k.labelRu}</div>
                <div className="kpi-number text-navy">{k.value.toLocaleString('ru')}</div>
                <div className={`text-xs mt-2 flex items-center gap-1 ${k.positive ? 'text-success' : 'text-danger'}`}>
                  <TrendingUp className="h-3 w-3" /> {k.delta}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Actions row */}
        <div className="grid lg:grid-cols-3 gap-5 mb-8">
          <Link href="/modules/geo" className="group">
            <Card hover className="h-full">
              <div className="flex items-center gap-3 mb-2">
                <div className="h-11 w-11 rounded-xl bg-gold/10 text-gold flex items-center justify-center">
                  <Map className="h-5 w-5" />
                </div>
                <CardTitle className="text-[16px]">Паспорта районов</CardTitle>
              </div>
              <CardDescription>
                Ведение специализации, топ-отраслей и лотов E-auksion по 15 районам области
              </CardDescription>
              <div className="mt-4 text-sm text-gold font-medium flex items-center gap-1 group-hover:gap-1.5 transition-all">
                Перейти к картам <ChevronRight className="h-4 w-4" />
              </div>
            </Card>
          </Link>

          <Link href="/modules/qChamp" className="group">
            <Card hover className="h-full">
              <div className="flex items-center gap-3 mb-2">
                <div className="h-11 w-11 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center">
                  <Trophy className="h-5 w-5" />
                </div>
                <CardTitle className="text-[16px]">Чемпионы области</CardTitle>
              </div>
              <CardDescription>
                32 подтверждённых · 12 выдвинуто зам.хокимами районов · 5 на согласовании МЭФ
              </CardDescription>
              <div className="mt-4 text-sm text-gold font-medium flex items-center gap-1 group-hover:gap-1.5 transition-all">
                Реестр чемпионов <ChevronRight className="h-4 w-4" />
              </div>
            </Card>
          </Link>

          <Link href="/modules/comms" className="group">
            <Card hover className="h-full">
              <div className="flex items-center gap-3 mb-2">
                <div className="h-11 w-11 rounded-xl bg-success/10 text-success flex items-center justify-center">
                  <MessageCircle className="h-5 w-5" />
                </div>
                <CardTitle className="text-[16px]">B2G · маршрутизация</CardTitle>
              </div>
              <CardDescription>
                67 обращений к обработке · SLA 3 дня · до интеграции с E-Ijro — ручная маршрутизация
              </CardDescription>
              <div className="mt-4 text-sm text-gold font-medium flex items-center gap-1 group-hover:gap-1.5 transition-all">
                К очереди <ChevronRight className="h-4 w-4" />
              </div>
            </Card>
          </Link>
        </div>

        {/* ─────────────── District passports — core function of Regional MEF ─────────────── */}
        <Card padding="lg" className="mb-8 border-gold/25">
          <div className="flex items-start justify-between gap-4 mb-2 flex-wrap">
            <div>
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-gold" />
                <CardTitle>Паспорта районов области</CardTitle>
                <Badge variant="priority">до Фазы 3</Badge>
              </div>
              <CardDescription className="mt-1">
                Паспорт содержит специализацию района, топ-3 отрасли, потребности в инвестициях и бизнес-объектах.
                Видны каждому предпринимателю в модуле (д) Геоаналитика. После интеграции с «Онлайн-махалля»
                (Фаза 3) данные по 650+ махаллям области будут подтягиваться автоматически.
              </CardDescription>
            </div>
            <div className="text-right">
              <div className="text-2xl font-serif text-gold font-semibold">{passportComplete}/15</div>
              <div className="text-xs text-ink-muted uppercase tracking-wide">паспортов готово</div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3 mt-5">
            {DISTRICTS.map((d) => (
              <div
                key={d.name}
                className="p-4 rounded-xl border border-ink-line bg-bg-band/40 hover:border-gold/50 hover:bg-gold-soft/30 transition-all group"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="font-serif text-[14px] text-navy leading-snug">{d.name}</div>
                  <PassportBadge state={d.passport as 'complete' | 'partial' | 'missing'} />
                </div>
                <div className="text-xs text-ink-muted mb-2">
                  {d.smeCount.toLocaleString('ru')} МСБ · топ: {d.topIndustry}
                </div>
                <div className="pt-2 border-t border-ink-line/70 flex items-center justify-between">
                  <Button variant="ghost" size="sm" className="text-xs px-2 h-7">
                    {d.passport === 'missing' ? 'Заполнить' : 'Редактировать'}
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 p-4 rounded-lg bg-gold-soft/50 border border-gold/20 flex items-start gap-3">
            <Sparkles className="h-4 w-4 text-gold-dark mt-0.5 shrink-0" />
            <div className="text-xs text-ink">
              До интеграции с «Онлайн-махалля» (Фаза 3) паспорта районов заполняет сотрудник регионального МЭФ
              вручную — при необходимости собирая данные у хокимията области. После интеграции данные на уровне
              района и махалли будут обновляться автоматически через API. Это ключевой узел наполнения модуля
              Геоаналитики контентом к 01.07.2026.
            </div>
          </div>
        </Card>

        {/* Chart + Champions pipeline */}
        <div className="grid lg:grid-cols-[1fr_1fr] gap-5">
          <Card padding="lg">
            <div className="flex items-center gap-2 mb-2">
              <Users2 className="h-5 w-5 text-gold" />
              <CardTitle>МСБ по отраслям · Самаркандская обл.</CardTitle>
            </div>
            <CardDescription>48 247 субъектов МСБ в области</CardDescription>
            <div className="h-80 mt-5">
              <ResponsiveContainer>
                <BarChart data={INDUSTRIES} layout="vertical" margin={{ top: 10, right: 20, left: 30, bottom: 0 }}>
                  <CartesianGrid horizontal={false} stroke="#EFF1F4" />
                  <XAxis type="number" fontSize={11} stroke="#5A6575" tickLine={false} axisLine={false} />
                  <YAxis type="category" dataKey="name" fontSize={12} stroke="#1B2A3D" width={140} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid #E5E7EB', fontSize: 13 }} cursor={{ fill: 'rgba(139,111,58,0.08)' }} />
                  <Bar dataKey="count" radius={[0, 6, 6, 0]}>
                    {INDUSTRIES.map((_, i) => (
                      <Cell key={i} fill={i === 0 ? '#8B6F3A' : i < 3 ? '#B08D4C' : '#C5CBD3'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card padding="lg">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-gold" />
                <CardTitle>Пайплайн чемпионов области</CardTitle>
              </div>
              <Button size="sm" leftIcon={<Plus className="h-4 w-4" />}>Выдвинуть</Button>
            </div>
            <CardDescription>
              Чемпионы выдвигаются зам.хокимами районов (2-3 на район, годовое обновление)
            </CardDescription>

            <div className="mt-5 space-y-3">
              <ChampionPipelineRow
                stage="Подтверждено"
                count={32}
                detail="В сопроводительной программе — 32 предпринимателя"
                tone="success"
              />
              <ChampionPipelineRow
                stage="На согласовании МЭФ"
                count={5}
                detail="Кандидаты на получение статуса из Пайарык, Ургут, Самарканда"
                tone="gold"
              />
              <ChampionPipelineRow
                stage="Выдвинуто зам.хокимами"
                count={12}
                detail="В процессе проверки критериев (оборот, экспорт, штат, рост)"
                tone="secondary"
              />
              <ChampionPipelineRow
                stage="Партнёрство с IFI"
                count={8}
                detail="EBRD · 3 · GIZ · 2 · IsDB · 2 · WB · 1"
                tone="queue"
              />
            </div>

            <div className="mt-5 p-3 rounded-lg bg-bg-band/60 border border-ink-line/60 text-xs text-ink-muted flex items-start gap-2">
              <ShieldCheck className="h-4 w-4 text-ink-muted mt-0.5 shrink-0" />
              Личные данные чемпионов (финпоказатели, экспортные обязательства) — только в backend-аналитике.
              Публичный реестр содержит только истории успеха и контакты с согласия чемпиона.
            </div>
          </Card>
        </div>
      </section>
    </>
  );
}

function PassportBadge({ state }: { state: 'complete' | 'partial' | 'missing' }) {
  if (state === 'complete') return <Badge variant="success">готов</Badge>;
  if (state === 'partial')  return <Badge variant="warning">частично</Badge>;
  return <Badge variant="danger">не заполнен</Badge>;
}

function ChampionPipelineRow({
  stage, count, detail, tone,
}: {
  stage: string;
  count: number;
  detail: string;
  tone: 'success' | 'gold' | 'secondary' | 'queue';
}) {
  const toneMap = {
    success:   'bg-success/10 text-success',
    gold:      'bg-gold/10 text-gold',
    secondary: 'bg-secondary/10 text-secondary',
    queue:     'bg-ink-line text-ink-muted',
  };

  return (
    <div className="flex items-start gap-3 p-3 rounded-lg bg-bg-band/40 border border-ink-line/60">
      <div className={`h-10 w-12 rounded-lg flex items-center justify-center font-serif font-bold text-[15px] shrink-0 ${toneMap[tone]}`}>
        {count}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-ink leading-tight">{stage}</div>
        <div className="text-xs text-ink-muted mt-0.5 leading-snug">{detail}</div>
      </div>
    </div>
  );
}
