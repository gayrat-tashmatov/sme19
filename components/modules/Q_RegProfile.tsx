'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ContactIcon as IdCard, Building2, Users, MapPin, FileText, Coins, ShieldCheck, Database,
  CheckCircle2, Clock, Download, Sparkles, ExternalLink, Edit3, AlertCircle,
} from 'lucide-react';
import { Card, CardTitle, CardDescription } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/cn';

// ─────────────────────────────────────
// Demo profile: ООО «Karimov Tekstil»
// ─────────────────────────────────────
interface ProfileField {
  label: string;
  value: string;
  source: string;
  updated: string;
  verified?: boolean;
}

interface ProfileSection {
  id: string;
  title: string;
  Icon: typeof Building2;
  fields: ProfileField[];
  fieldsAutoCount: number;
}

const PROFILE_SECTIONS: ProfileSection[] = [
  {
    id: 'basic',
    title: 'Основные данные',
    Icon: Building2,
    fieldsAutoCount: 7,
    fields: [
      { label: 'Полное наименование', value: 'ООО «Karimov Tekstil»',       source: 'Минюст (Adliya)',       updated: '3 дня назад',   verified: true },
      { label: 'Сокращённое',          value: 'Karimov Tekstil',              source: 'Минюст (Adliya)',       updated: '3 дня назад',   verified: true },
      { label: 'ИНН',                  value: '301 234 567',                    source: 'Soliq (GNK)',           updated: 'сегодня',       verified: true },
      { label: 'ОГРН',                 value: '30123456789',                    source: 'Минюст (Adliya)',       updated: '3 дня назад',   verified: true },
      { label: 'Форма собственности',  value: 'ООО (общество с огр. отв-тью)',  source: 'Минюст (Adliya)',       updated: '3 дня назад',   verified: true },
      { label: 'Дата регистрации',     value: '14.03.2019',                    source: 'Минюст (Adliya)',       updated: 'зафиксировано', verified: true },
      { label: 'Уставный капитал',     value: '120 000 000 сум',                source: 'Минюст (Adliya)',       updated: '4 мес. назад',  verified: true },
    ],
  },
  {
    id: 'founders',
    title: 'Учредители и руководство',
    Icon: Users,
    fieldsAutoCount: 4,
    fields: [
      { label: 'Учредитель 1',      value: 'Каримов Алишер Р. · 70%',     source: 'Минюст (Adliya)',  updated: 'при регистрации', verified: true },
      { label: 'Учредитель 2',      value: 'Каримова Дильноза · 30%',      source: 'Минюст (Adliya)',  updated: 'при регистрации', verified: true },
      { label: 'Директор',          value: 'Каримов Алишер Рустамович',    source: 'Минюст (Adliya)',  updated: 'с 2019',           verified: true },
      { label: 'Главный бухгалтер', value: 'Юлдашева Мадина Шакировна',    source: 'Минюст · изменения', updated: '8 мес. назад',    verified: true },
    ],
  },
  {
    id: 'address',
    title: 'Адрес и филиалы',
    Icon: MapPin,
    fieldsAutoCount: 3,
    fields: [
      { label: 'Юридический адрес', value: 'г. Ташкент, Яшнабадский р-н, ул. Навои, 15', source: 'Кадастр',          updated: 'сегодня',       verified: true },
      { label: 'Фактический адрес', value: 'тот же',                                        source: 'Кадастр',          updated: 'сегодня',       verified: true },
      { label: 'Филиалы',           value: '1 филиал · Самарканд, ул. Амира Темура 28',    source: 'Минюст (Adliya)',  updated: '2 мес. назад',  verified: true },
    ],
  },
  {
    id: 'tax',
    title: 'Налоговый статус',
    Icon: Coins,
    fieldsAutoCount: 5,
    fields: [
      { label: 'Режим налогообложения', value: 'Общий режим с НДС',         source: 'Soliq (GNK)',    updated: 'сегодня',           verified: true },
      { label: 'Ставка НДС',             value: '12%',                        source: 'Soliq (GNK)',    updated: 'сегодня',           verified: true },
      { label: 'Налоговая задолженность',value: '0 сум',                      source: 'Soliq (GNK)',    updated: 'сегодня',           verified: true },
      { label: 'Статус МСБ',             value: 'Среднее предприятие',         source: 'Единый реестр МСБ', updated: '10 число каждого мес.', verified: true },
      { label: 'Категория по обороту',   value: 'от 1 до 10 млрд сум',        source: 'Soliq · Нацстат', updated: 'ежекв-но',          verified: true },
    ],
  },
  {
    id: 'activity',
    title: 'Виды деятельности (ОКЭД)',
    Icon: FileText,
    fieldsAutoCount: 3,
    fields: [
      { label: 'Основной ОКЭД',      value: '13.20 · Производство текстильных тканей',        source: 'Минюст (Adliya)', updated: 'при регистрации', verified: true },
      { label: 'Дополнительный',     value: '47.71 · Розничная торговля одеждой в маг-нах',   source: 'Минюст (Adliya)', updated: '1 год назад',      verified: true },
      { label: 'Доп. лицензии',      value: 'отсутствуют',                                     source: 'Реестр лицензий', updated: 'сегодня',           verified: true },
    ],
  },
  {
    id: 'finance',
    title: 'Финансовые показатели',
    Icon: Database,
    fieldsAutoCount: 4,
    fields: [
      { label: 'Выручка 2025',         value: '8.4 млрд сум',        source: 'Soliq (GNK) · декларация',  updated: '10 марта 2026',     verified: true },
      { label: 'Налогов уплачено',     value: '410 млн сум',          source: 'Soliq (GNK)',               updated: 'сегодня',            verified: true },
      { label: 'Средняя ЗП',           value: '6.2 млн сум/мес.',     source: 'Пенсионный фонд',           updated: 'ежемес-но',          verified: true },
      { label: 'Сотрудников',          value: '42',                   source: 'Пенсионный фонд · Минтруда', updated: 'сегодня',            verified: true },
    ],
  },
];

const SOURCES = [
  { name: 'Минюст (Adliya*)',        desc: 'Реестр юрлиц и ИП, учредители, адреса', status: 'ok' as const, latency: '~180 мс' },
  { name: 'Soliq (GNK*)',             desc: 'Налоговый статус, декларации, задолженности', status: 'ok' as const, latency: '~195 мс' },
  { name: 'Кадастр',                   desc: 'Адреса, земельные участки', status: 'ok' as const, latency: '~310 мс' },
  { name: 'МВД',                       desc: 'Данные ФЛ по ПИНФЛ', status: 'ok' as const, latency: '~220 мс' },
  { name: 'Таможня (Customs)',         desc: 'Экспортно-импортные декларации', status: 'warn' as const, latency: '~1.1 с' },
];

// ─────────────────────────────────────
export function QRegProfile() {
  const [activeSection, setActiveSection] = useState<string>('basic');
  const section = PROFILE_SECTIONS.find((s) => s.id === activeSection) ?? PROFILE_SECTIONS[0];
  const totalFields    = PROFILE_SECTIONS.reduce((sum, s) => sum + s.fields.length, 0);
  const totalAutoFields = PROFILE_SECTIONS.reduce((sum, s) => sum + s.fieldsAutoCount, 0);

  return (
    <section className="container-wide py-10 md:py-14 space-y-6">
      {/* Hero */}
      <Card padding="lg" tone="navy" className="text-white relative overflow-hidden">
        <div className="absolute inset-0 pattern-dots opacity-25 pointer-events-none" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-3">
            <IdCard className="h-5 w-5 text-gold-light" />
            <span className="text-xs uppercase tracking-wider text-gold-light font-semibold">Адаптация Singapore BizFile+ · Estonia e-Business Register</span>
          </div>
          <h2 className="font-serif text-2xl md:text-3xl text-white mb-2 leading-tight">
            Цифровой профиль бизнеса — сводный, актуальный, once-only
          </h2>
          <p className="text-white/75 max-w-3xl text-sm">
            Сводный профиль ФЛ / ЮЛ собран из 5 государственных реестров через МИП. Данные обновляются
            автоматически: ни одно поле не вводится вручную повторно. Основа для персонализации мер
            поддержки и фильтрации каталога.
          </p>

          <div className="mt-5 grid grid-cols-2 md:grid-cols-4 gap-2">
            <Metric label="Полей в профиле" value={totalFields.toString()} sub="6 разделов" />
            <Metric label="Автозаполнено" value={`${totalAutoFields}/${totalFields}`} sub={`${Math.round(totalAutoFields/totalFields*100)}% once-only`} />
            <Metric label="Повторных вводов" value="0" sub="принцип «раз введён = везде»" />
            <Metric label="Время сборки" value="< 2 сек" sub="через МИП" />
          </div>
        </div>
      </Card>

      {/* Profile + navigation */}
      <div className="grid lg:grid-cols-[280px_1fr] gap-5">
        {/* Section nav */}
        <Card padding="md">
          <div className="text-xs uppercase tracking-wider text-ink-muted font-semibold mb-3">Разделы профиля</div>
          <div className="space-y-1">
            {PROFILE_SECTIONS.map((s) => {
              const active = s.id === activeSection;
              return (
                <button
                  key={s.id}
                  onClick={() => setActiveSection(s.id)}
                  className={cn(
                    'w-full text-left flex items-center gap-2.5 p-2.5 rounded-lg transition-colors',
                    active ? 'bg-gold text-white' : 'hover:bg-bg-band text-ink',
                  )}
                >
                  <s.Icon className="h-4 w-4 shrink-0" />
                  <span className="text-sm flex-1 truncate">{s.title}</span>
                  <span className={cn('text-[10.5px] font-mono', active ? 'text-white/80' : 'text-ink-muted')}>
                    {s.fields.length}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mt-4 pt-4 border-t border-ink-line">
            <Button size="sm" leftIcon={<Download className="h-4 w-4" />} className="w-full">
              Скачать PDF профиля
            </Button>
            <Button size="sm" variant="ghost" className="w-full mt-2">
              Экспорт в банк (JSON)
            </Button>
          </div>
        </Card>

        {/* Active section */}
        <motion.div key={activeSection} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
          <Card padding="lg">
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-ink-line">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-gold/10 text-gold flex items-center justify-center">
                  <section.Icon className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle>{section.title}</CardTitle>
                  <CardDescription>
                    {section.fields.length} полей · {section.fieldsAutoCount} автозаполнено из реестров
                  </CardDescription>
                </div>
              </div>
              <Badge variant="success">актуально</Badge>
            </div>

            <div className="space-y-2">
              {section.fields.map((f) => (
                <div key={f.label} className="p-3 rounded-lg border border-ink-line bg-bg-white hover:border-gold/40 transition-colors">
                  <div className="flex items-start justify-between gap-3 mb-1">
                    <div className="flex-1 min-w-0">
                      <div className="text-[11px] uppercase tracking-wider text-ink-muted font-semibold">{f.label}</div>
                      <div className="text-sm text-ink font-medium mt-0.5">{f.value}</div>
                    </div>
                    {f.verified && <CheckCircle2 className="h-4 w-4 text-success shrink-0 mt-1" />}
                  </div>
                  <div className="flex items-center justify-between gap-2 mt-2 pt-2 border-t border-ink-line/60">
                    <div className="text-[11px] text-ink-muted">
                      <span className="inline-block h-1.5 w-1.5 rounded-full bg-success mr-1.5" />
                      Источник: <span className="text-ink font-medium">{f.source}</span>
                      <span className="mx-1.5">·</span>
                      обновлено {f.updated}
                    </div>
                    <button className="text-[11px] text-gold hover:text-gold-dark font-medium flex items-center gap-1">
                      <Edit3 className="h-3 w-3" /> запрос на исправление
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Source integrations */}
      <Card padding="lg">
        <div className="flex items-center gap-2 mb-4">
          <Database className="h-5 w-5 text-gold" />
          <CardTitle className="text-[16px]">Подключённые реестры — источники истины</CardTitle>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-2">
          {SOURCES.map((s) => (
            <div key={s.name} className="p-3 rounded-lg border border-ink-line bg-bg-band/40">
              <div className="flex items-center justify-between mb-1">
                <div className="text-sm font-semibold text-ink">{s.name}</div>
                <span className={cn('text-[10.5px] font-mono flex items-center gap-1', s.status === 'ok' ? 'text-success' : 'text-gold')}>
                  <span className={cn('h-1.5 w-1.5 rounded-full', s.status === 'ok' ? 'bg-success' : 'bg-gold')} />
                  {s.latency}
                </span>
              </div>
              <div className="text-xs text-ink-muted leading-snug">{s.desc}</div>
            </div>
          ))}
        </div>
        <div className="mt-4 p-3 rounded-lg bg-gold-soft/40 border border-gold/20 text-xs text-ink flex items-start gap-2">
          <Sparkles className="h-3.5 w-3.5 text-gold-dark mt-0.5 shrink-0" />
          <span>
            Принцип <strong>once-only</strong>: если данные уже есть в государственном реестре — вы не вводите их повторно.
            МИП обеспечивает шину интеграции между реестрами. При изменении данных в источнике профиль обновляется
            автоматически в течение 24 часов.
          </span>
        </div>
      </Card>

      {/* Footer callout */}
      <Card padding="lg" className="border-gold/25 bg-gold-soft/30">
        <div className="flex items-start gap-4">
          <div className="h-10 w-10 rounded-lg bg-gold/15 text-gold flex items-center justify-center shrink-0">
            <Sparkles className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <div className="font-serif font-semibold text-ink">Референсы</div>
            <CardDescription className="mt-1">
              Singapore <strong>BizFile+</strong> (ACRA): единый профиль юрлица поверх 100+ e-сервисов, без повторного ввода данных.
              Estonia <strong>e-Business Register</strong>: декларации предзаполнены из реестров на 95%, типовой отчёт сдаётся за 3–5 минут.
              В Узбекистане единого профиля сейчас нет — данные предприниматель заполняет каждый раз при подаче любой заявки.
            </CardDescription>
          </div>
        </div>
      </Card>
    </section>
  );
}

function Metric({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-lg p-3">
      <div className="text-[10.5px] uppercase tracking-wider text-gold-light/80 mb-1">{label}</div>
      <div className="font-serif text-2xl text-white font-semibold">{value}</div>
      <div className="text-[11px] text-white/60 mt-0.5">{sub}</div>
    </div>
  );
}
