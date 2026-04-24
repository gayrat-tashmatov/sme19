'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plug, Zap, Droplets, Flame, Wifi, Clock, CheckCircle2, AlertCircle,
  Sparkles, ExternalLink, Info, FileText, Building, Home, ArrowRight, Download,
  History,
} from 'lucide-react';
import { Card, CardTitle, CardDescription } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { PhaseRoadmapStrip } from '@/components/sections/PhaseRoadmapStrip';
import { useStore } from '@/lib/store';

// ═══════════════════════════════════════════════════════════════════
// Sprint 8 · Q_Infrastructure redesigned per Gayrat instruction:
// detailed info per utility + redirect button to my.gov.uz + statuses
// Electricity split by capacity: ≤20 kVA vs >20 kVA
// ═══════════════════════════════════════════════════════════════════

interface UtilityInfo {
  id: string;
  label: string;
  subtitle: string;
  Icon: typeof Zap;
  provider: string;
  myGovUrl: string;
  docs: string[];
  timeDays: string;
  estCost: string;
  steps: { title: string; detail: string }[];
  warnings?: string[];
}

const UTILITIES: UtilityInfo[] = [
  {
    id: 'electricity-small',
    label: 'Электричество · до 20 кВА',
    subtitle: 'Упрощённая процедура для малой мощности (офис, магазин, мастерская)',
    Icon: Zap,
    provider: 'Uzenergosotish · районное РЭС',
    myGovUrl: 'https://my.gov.uz/services/electricity-connection',
    docs: [
      'Копия свидетельства о регистрации ИП/ООО',
      'Документ на право пользования помещением',
      'Технический план объекта с указанием точки присоединения',
      'Расчёт суммарной мощности потребителей',
    ],
    timeDays: '15–20 рабочих дней',
    estCost: 'от 2.5 млн сум',
    steps: [
      { title: 'Подача заявки',      detail: 'Онлайн через my.gov.uz с OneID-авторизацией' },
      { title: 'Выдача ТУ',          detail: 'Технические условия в течение 10 рабочих дней' },
      { title: 'Монтаж и присоединение', detail: 'Проверка, опломбировка счётчика, ввод в эксплуатацию' },
    ],
  },
  {
    id: 'electricity-big',
    label: 'Электричество · свыше 20 кВА',
    subtitle: 'Стандартная процедура для производства, цехов, больших площадей',
    Icon: Zap,
    provider: 'Uzenergosotish · областное/городское РЭС',
    myGovUrl: 'https://my.gov.uz/services/electricity-connection-large',
    docs: [
      'Копия свидетельства о регистрации ИП/ООО',
      'Документ на право пользования земельным участком/помещением',
      'Проектная документация на электроустановки',
      'Расчёт максимальной мощности + график нагрузки',
      'Согласование с Энергонадзором',
    ],
    timeDays: '30–45 рабочих дней',
    estCost: 'от 8.5 млн сум',
    steps: [
      { title: 'Подача заявки',        detail: 'Онлайн через my.gov.uz + приложение проекта' },
      { title: 'Техусловия',            detail: 'Выдача ТУ 15 рабочих дней. Возможны платные варианты усиления сети.' },
      { title: 'Проектирование',        detail: 'Разработка проекта согласно ТУ в аккредитованной организации' },
      { title: 'Согласование',          detail: 'Экспертиза проекта в Энергонадзоре' },
      { title: 'Монтаж и присоединение', detail: 'Строительно-монтажные работы, приёмочные испытания, опломбировка' },
    ],
    warnings: [
      'Для мощности свыше 100 кВА требуется собственная трансформаторная подстанция',
      'Проект должен соответствовать ПУЭ и СНиП Узбекистана',
    ],
  },
  {
    id: 'gas',
    label: 'Газ',
    subtitle: 'Природный газ для котельных, производственного оборудования, общепита',
    Icon: Flame,
    provider: 'Худудгазтаъминот · региональное управление',
    myGovUrl: 'https://my.gov.uz/services/gas-connection',
    docs: [
      'Копия свидетельства о регистрации',
      'Документ на право пользования помещением/участком',
      'Технический паспорт газопотребляющего оборудования',
      'Согласование с Саноат қўриқчилиги (промбезопасность)',
    ],
    timeDays: '35–50 рабочих дней',
    estCost: 'от 4.2 млн сум',
    steps: [
      { title: 'Подача заявки',      detail: 'Онлайн через my.gov.uz' },
      { title: 'Выдача ТУ',          detail: 'Технические условия + схема подключения за 20 рабочих дней' },
      { title: 'Проектирование',     detail: 'Проект газоснабжения в специализированной организации' },
      { title: 'Экспертиза',         detail: 'Промышленная безопасность + экологическая экспертиза' },
      { title: 'Монтаж и пуск',      detail: 'СМР, приёмочные испытания, пусконаладка, подключение' },
    ],
    warnings: [
      'Для предприятий общепита обязательна приточно-вытяжная вентиляция',
      'Запрещено использование в помещениях без естественного освещения',
    ],
  },
  {
    id: 'water',
    label: 'Вода и канализация',
    subtitle: 'Холодное водоснабжение + отведение сточных вод',
    Icon: Droplets,
    provider: 'Тошканал · региональные водоканалы',
    myGovUrl: 'https://my.gov.uz/services/water-connection',
    docs: [
      'Копия свидетельства о регистрации',
      'Документ на право пользования участком/помещением',
      'Расчёт потребления воды + объёма стоков',
      'Технический паспорт водопотребляющего оборудования',
    ],
    timeDays: '20–30 рабочих дней',
    estCost: 'от 1.8 млн сум',
    steps: [
      { title: 'Подача заявки',      detail: 'Онлайн через my.gov.uz' },
      { title: 'Обследование',        detail: 'Выезд специалиста на объект для оценки точки присоединения' },
      { title: 'ТУ и договор',        detail: 'Выдача ТУ и подписание договора на водоснабжение' },
      { title: 'Монтаж и ввод',       detail: 'СМР, установка водомера, опломбировка, подключение к сети' },
    ],
  },
  {
    id: 'internet',
    label: 'Интернет · оптоволокно',
    subtitle: 'Корпоративный интернет с гарантированной скоростью и резервированием',
    Icon: Wifi,
    provider: 'Uzbektelecom · провайдер на выбор (Beeline, UMS, Comnet)',
    myGovUrl: 'https://my.gov.uz/services/internet-connection',
    docs: [
      'Копия свидетельства о регистрации',
      'Документ на право пользования помещением',
      'Заявление на выбранный тариф',
    ],
    timeDays: '5–10 рабочих дней',
    estCost: 'от 800 тыс сум (подключение)',
    steps: [
      { title: 'Выбор провайдера',   detail: 'Сравнение тарифов на my.gov.uz или напрямую у провайдера' },
      { title: 'Подача заявки',      detail: 'Онлайн через my.gov.uz или портал провайдера' },
      { title: 'Выезд монтажников',  detail: 'Прокладка кабеля + установка оборудования в течение 3–5 дней' },
      { title: 'Активация',          detail: 'Настройка, тестирование, подписание акта выполненных работ' },
    ],
  },
];

// My applications (status tracker demo)
interface MyApp {
  id: string;
  utility: string;
  status: 'submitted' | 'in-review' | 'tech-conditions' | 'installation' | 'completed';
  statusLabel: string;
  submittedAt: string;
  updatedAt: string;
  address: string;
}

const MY_APPS: MyApp[] = [
  { id: 'INF-2026-0412', utility: 'Электричество · до 20 кВА',   status: 'installation',      statusLabel: 'Монтаж и присоединение', submittedAt: '28 мар 2026', updatedAt: '18 апр 2026', address: 'г. Ташкент, ул. Навои, 15' },
  { id: 'INF-2026-0401', utility: 'Интернет · оптоволокно',        status: 'completed',         statusLabel: 'Подключено',              submittedAt: '10 апр 2026', updatedAt: '14 апр 2026', address: 'г. Ташкент, ул. Навои, 15' },
  { id: 'INF-2026-0378', utility: 'Газ',                            status: 'tech-conditions',   statusLabel: 'Выданы ТУ',               submittedAt: '25 фев 2026', updatedAt: '20 мар 2026', address: 'г. Ташкент, ул. Навои, 15' },
];

export function QInfrastructure() {
  const role = useStore((s) => s.role);
  const isAuthed = role !== 'guest';
  const [tab, setTab] = useState<'utilities' | 'my-apps'>('utilities');
  const [expanded, setExpanded] = useState<string | null>('electricity-small');

  return (
    <section className="container-wide py-10 md:py-14 space-y-8">
      {/* Hero */}
      <Card padding="lg" tone="navy" className="text-white relative overflow-hidden">
        <div className="absolute inset-0 pattern-dots opacity-30 pointer-events-none" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <Plug className="h-5 w-5 text-gold-light" />
            <span className="text-xs uppercase tracking-wider text-gold-light font-semibold">Подключение к инженерной инфраструктуре</span>
          </div>
          <h2 className="font-serif text-2xl md:text-3xl text-white mb-2 leading-tight">
            Инфраструктура для бизнеса — гайды + переход на my.gov.uz
          </h2>
          <p className="text-white/75 max-w-3xl text-sm leading-relaxed">
            Подробная информация по 5 видам подключения: электричество (≤20 кВА и свыше), газ, вода, интернет.
            Для каждого — процесс, сроки, документы, стоимость. Подача заявки — на my.gov.uz с OneID-пробросом.
            Статус заявок возвращается в ваш кабинет.
          </p>
        </div>
      </Card>

      <PhaseRoadmapStrip
        embedded
        currentPhase={2}
        points={[
          { phase: 2, text: 'Гайды по 5 видам подключения с документами, сроками, стоимостью' },
          { phase: 2, text: 'Разделение электричества по мощности: ≤20 кВА vs свыше 20 кВА' },
          { phase: 2, text: 'Редирект на my.gov.uz с OneID-token пробросом' },
          { phase: 2, text: 'Статус моих заявок (демо-данные)' },
          { phase: 2, text: 'Консультации ЦПП при выборе поставщика интернета/оборудования' },
          { phase: 3, text: 'Интеграция my.gov.uz → статусы в кабинет в реальном времени', blockedBy: 'кибер-экспертиза' },
          { phase: 3, text: 'Интеграция Uzenergo, Худудгаз, Тошканал для онлайн-оплаты' },
          { phase: 4, text: 'AI-помощник: расчёт мощности, подбор тарифов, оценка стоимости подключения' },
        ]}
      />

      {/* Main platform-role callout */}
      <Card padding="lg" className="border-secondary/25 bg-secondary/5">
        <div className="flex items-start gap-3">
          <Info className="h-5 w-5 text-secondary shrink-0 mt-0.5" />
          <div className="text-sm text-ink-soft leading-relaxed">
            <strong className="text-ink">Принцип «единое окно».</strong>{' '}
            Платформа даёт детальный справочник по процедуре, документам и стоимости. Саму заявку вы подаёте на <strong>my.gov.uz</strong> — едином портале государственных услуг Узбекистана, куда передаются данные через OneID без повторного ввода. Статусы возвращаются в ваш личный кабинет.
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-ink-line flex-wrap">
        <TabButton active={tab === 'utilities'} onClick={() => setTab('utilities')}>
          <Plug className="h-4 w-4" /> Виды подключения
        </TabButton>
        <TabButton active={tab === 'my-apps'} onClick={() => setTab('my-apps')} disabled={!isAuthed}>
          <History className="h-4 w-4" /> Статус моих заявок
          {isAuthed && <Badge variant="success">{MY_APPS.length}</Badge>}
        </TabButton>
      </div>

      <AnimatePresence mode="wait">
        {tab === 'utilities' && (
          <motion.div
            key="utilities"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="space-y-3"
          >
            {UTILITIES.map((u) => {
              const isOpen = expanded === u.id;
              return (
                <Card key={u.id} padding="lg" className={isOpen ? 'border-gold/40 shadow-subtle' : ''}>
                  {/* Header */}
                  <button
                    onClick={() => setExpanded(isOpen ? null : u.id)}
                    className="w-full flex items-start gap-4 text-left"
                  >
                    <div className={`h-11 w-11 rounded-xl flex items-center justify-center shrink-0 ${isOpen ? 'bg-gold text-white' : 'bg-gold/10 text-gold'}`}>
                      <u.Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-[16px]">{u.label}</CardTitle>
                      <CardDescription className="text-[12.5px] mt-0.5">{u.subtitle}</CardDescription>
                      <div className="flex items-center gap-3 mt-2 flex-wrap text-[11.5px]">
                        <Badge variant="outline"><Clock className="h-3 w-3" />{u.timeDays}</Badge>
                        <Badge variant="outline">{u.estCost}</Badge>
                        <span className="text-ink-muted">· {u.provider}</span>
                      </div>
                    </div>
                    <ArrowRight className={`h-4 w-4 text-ink-muted shrink-0 mt-3 transition-transform ${isOpen ? 'rotate-90' : ''}`} />
                  </button>

                  {/* Expanded body */}
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      transition={{ duration: 0.25 }}
                      className="mt-5 pt-5 border-t border-ink-line space-y-4 overflow-hidden"
                    >
                      {/* Process steps */}
                      <div>
                        <div className="text-[11px] uppercase tracking-wider text-ink-muted font-semibold mb-2">Процесс подключения</div>
                        <div className="space-y-2">
                          {u.steps.map((s, i) => (
                            <div key={i} className="p-3 rounded-lg bg-bg-band/40 flex items-start gap-3">
                              <div className="h-7 w-7 rounded-full bg-gold text-white flex items-center justify-center shrink-0 font-serif font-bold text-[12px]">
                                {i + 1}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="text-sm font-medium text-ink">{s.title}</div>
                                <div className="text-[12px] text-ink-soft mt-0.5 leading-snug">{s.detail}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Docs + warnings in 2 columns */}
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <FileText className="h-4 w-4 text-gold" />
                            <div className="text-[11px] uppercase tracking-wider text-ink-muted font-semibold">Документы для заявки</div>
                          </div>
                          <ul className="space-y-1.5">
                            {u.docs.map((d, i) => (
                              <li key={i} className="text-[12.5px] text-ink-soft flex items-start gap-1.5">
                                <CheckCircle2 className="h-3 w-3 text-success shrink-0 mt-0.5" />
                                <span>{d}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {u.warnings && u.warnings.length > 0 && (
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <AlertCircle className="h-4 w-4 text-danger" />
                              <div className="text-[11px] uppercase tracking-wider text-ink-muted font-semibold">На что обратить внимание</div>
                            </div>
                            <ul className="space-y-1.5">
                              {u.warnings.map((w, i) => (
                                <li key={i} className="text-[12.5px] text-ink-soft flex items-start gap-1.5">
                                  <span className="text-danger shrink-0 mt-0.5">!</span>
                                  <span>{w}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>

                      {/* Submit via my.gov.uz */}
                      <div className="pt-4 border-t border-ink-line">
                        <div className="flex items-center gap-2 text-[12px] text-ink-muted mb-3">
                          <Info className="h-3.5 w-3.5 text-secondary" />
                          <span>Подача заявки — на my.gov.uz через OneID. Статус появится в вашем кабинете.</span>
                        </div>
                        <a
                          href={u.myGovUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 h-11 px-5 rounded-xl bg-gold hover:bg-gold-dark text-white font-semibold transition-all w-full justify-center"
                        >
                          Подать на my.gov.uz
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </div>
                    </motion.div>
                  )}
                </Card>
              );
            })}
          </motion.div>
        )}

        {tab === 'my-apps' && (
          <motion.div
            key="my-apps"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
          >
            <Card padding="lg">
              <div className="flex items-start gap-3 mb-5">
                <div className="h-11 w-11 rounded-xl bg-gold/15 text-gold flex items-center justify-center shrink-0">
                  <History className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle>История ваших заявок</CardTitle>
                  <CardDescription className="mt-0.5">
                    В Ф3 — автоматическая синхронизация с my.gov.uz через МИП. Сейчас — демо-данные.
                  </CardDescription>
                </div>
              </div>

              <div className="space-y-2">
                {MY_APPS.map((a) => {
                  const statusStyle =
                    a.status === 'completed'       ? 'bg-success/10 text-success border-success/30' :
                    a.status === 'installation'    ? 'bg-gold/10 text-gold-dark border-gold/30' :
                    a.status === 'tech-conditions' ? 'bg-secondary/10 text-secondary border-secondary/30' :
                                                     'bg-bg-band text-ink-muted border-ink-line';
                  return (
                    <div key={a.id} className="p-3 rounded-lg border border-ink-line bg-bg-white flex items-start justify-between gap-3 flex-wrap">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className="text-[10px] font-mono text-ink-muted">{a.id}</span>
                          <span className="text-[11px] text-ink-muted">· подано {a.submittedAt}</span>
                          <span className="text-[11px] text-ink-muted">· обновлено {a.updatedAt}</span>
                        </div>
                        <div className="text-sm font-medium text-ink">{a.utility}</div>
                        <div className="text-[11.5px] text-ink-muted mt-0.5 flex items-center gap-1">
                          <Home className="h-3 w-3" /> {a.address}
                        </div>
                      </div>
                      <div className={`px-2.5 py-1 rounded-md border text-[11px] font-medium shrink-0 ${statusStyle}`}>
                        {a.statusLabel}
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer callout */}
      <Card padding="lg" className="border-success/25 bg-success/[0.03]">
        <div className="flex items-start gap-4 flex-wrap">
          <div className="h-10 w-10 rounded-lg bg-success/10 text-success flex items-center justify-center shrink-0">
            <Sparkles className="h-5 w-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-serif font-semibold text-ink">Связано с другими модулями</div>
            <CardDescription className="mt-1">
              Подключение инфраструктуры — этап запуска бизнеса. Связано с локацией (геоаналитика), формой собственности (регистрация), налоговым режимом.
            </CardDescription>
            <div className="mt-3 grid sm:grid-cols-3 gap-2">
              <Link href="/modules/geo" className="text-xs text-gold hover:text-gold-dark inline-flex items-center gap-1">
                Геоаналитика · подбор места <ArrowRight className="h-3 w-3" />
              </Link>
              <Link href="/modules/qBiz" className="text-xs text-gold hover:text-gold-dark inline-flex items-center gap-1">
                Регистрация бизнеса <ArrowRight className="h-3 w-3" />
              </Link>
              <Link href="/modules/nLifecycle" className="text-xs text-gold hover:text-gold-dark inline-flex items-center gap-1">
                Жизненный цикл бизнеса <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </div>
      </Card>
    </section>
  );
}

function TabButton({ children, active, onClick, disabled }: { children: React.ReactNode; active: boolean; onClick: () => void; disabled?: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-all inline-flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed ${
        active
          ? 'border-gold text-gold-dark'
          : 'border-transparent text-ink-muted hover:text-ink hover:border-ink-line'
      }`}
    >
      {children}
    </button>
  );
}
