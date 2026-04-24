'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Store, TrendingUp, Target, GitCompare, ShoppingBag, Globe, Users2, Calendar,
  CheckCircle2, XCircle, ArrowRight, ExternalLink, Info, Truck, Banknote,
  FileText, AlertCircle, Sparkles, Briefcase, Rocket, UserPlus, Building, FileKey,
  Landmark, Image as ImageIcon, ChevronDown, Handshake,
} from 'lucide-react';
import { Card, CardTitle, CardDescription } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { MARKETPLACE_DETAILS, UNIVERSAL_STEPS, MARKETPLACE_OPERATORS, type MarketplaceDetail } from '@/lib/data/marketplace_details';
import { PhaseRoadmapStrip } from '@/components/sections/PhaseRoadmapStrip';
import { cn } from '@/lib/cn';

type TabId = 'catalog' | 'details' | 'steps' | 'compare';

const STEP_ICONS: Record<string, typeof UserPlus> = {
  UserPlus, Building, FileKey, Landmark, Store, Image: ImageIcon, Truck, TrendingUp,
};

const OPERATOR_ICONS: Record<string, typeof Briefcase> = {
  Briefcase, Globe, Rocket,
};

export function V_Ecommerce() {
  const [tab, setTab] = useState<TabId>('catalog');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('uzum');

  const selected = MARKETPLACE_DETAILS.find((m) => m.id === selectedPlatform)!;

  return (
    <section className="container-wide py-10 md:py-14 space-y-6">
      {/* Hero */}
      <Card padding="lg" tone="navy" className="text-white relative overflow-hidden">
        <div className="absolute inset-0 pattern-dots opacity-25 pointer-events-none" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-3">
            <Store className="h-5 w-5 text-gold-light" />
            <span className="text-xs uppercase tracking-wider text-gold-light font-semibold">
              Приоритетный компонент (в) · дедлайн 01.07.2026
            </span>
          </div>
          <h2 className="font-serif text-2xl md:text-3xl text-white mb-2 leading-tight">
            Поддержка e-commerce и выход на маркетплейсы
          </h2>
          <p className="text-white/75 max-w-3xl text-sm">
            Полный справочник: детальные гайды по топ-4 платформам (Uzum, Wildberries, Amazon, Alibaba),
            требования, комиссии, логистика, пошаговая инструкция регистрации, сравнительная матрица.
          </p>

          <div className="mt-5 grid grid-cols-2 md:grid-cols-4 gap-2">
            <HeroPill label="Локальный" value="Uzum" sub="10M+ покупателей" />
            <HeroPill label="СНГ" value="Wildberries" sub="80M+ покупателей" />
            <HeroPill label="Глобальный" value="Amazon" sub="300M+ покупателей" />
            <HeroPill label="B2B" value="Alibaba" sub="40M+ компаний" />
          </div>
        </div>
      </Card>

      <PhaseRoadmapStrip
        embedded
        currentPhase={1}
        points={[
          // Фаза 1 — до 01.07.2026
          { phase: 1, text: 'Справочник: 4 главные + 6 дополнительных маркетплейсов (местные и международные)' },
          { phase: 1, text: 'Сравнительная матрица комиссий, логистики, сроков вывода' },
          { phase: 1, text: 'Пошаговые гайды регистрации — со ссылкой на сайт платформы' },
          { phase: 1, text: 'Переговоры с Robosell — определить форму партнёрства (интеграция или доработка под нужды МЭФ)' },
          // Фаза 2 — 2-я половина 2026
          { phase: 2, text: 'Решение по Robosell: либо embed-widget, либо совместная доработка функциональности', blockedBy: 'итоги переговоров' },
          { phase: 2, text: 'Обсуждение партнёрств с Uzum, Wildberries, Yandex Market' },
          // Фаза 3 — 2027
          { phase: 3, text: 'Интеграция с Uzum/Wildberries: создание аккаунта через OneID', blockedBy: 'переговоры с площадками' },
          { phase: 3, text: 'Статус заявок на размещение — в личный кабинет' },
          // Фаза 4 — 2028+
          { phase: 4, text: 'Единый dashboard продавца по всем подключённым площадкам' },
        ]}
      />

      {/* Robosell negotiation — two parallel options (Sprint 5) */}
      <Card padding="lg" className="border-secondary/25 bg-secondary/5">
        <div className="flex items-start gap-4 mb-5 flex-wrap">
          <div className="h-11 w-11 rounded-xl bg-secondary/15 text-secondary flex items-center justify-center shrink-0">
            <Handshake className="h-5 w-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <CardTitle className="text-[17px]">Партнёрство с Robosell</CardTitle>
              <Badge variant="info">в работе</Badge>
              <Badge variant="outline">решение в Ф2</Badge>
            </div>
            <CardDescription className="text-[13px]">
              Robosell — частный агрегатор маркетплейсов Узбекистана. Рассматриваем два равноправных
              сценария интеграции. Решение — по итогам переговоров с командой Robosell на Фазе 2.
            </CardDescription>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {/* Option A: embed-widget */}
          <div className="p-4 rounded-xl border-2 border-gold/30 bg-bg-white">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-8 w-8 rounded-lg bg-gold/15 text-gold flex items-center justify-center font-serif font-bold">А</div>
              <div className="font-serif font-semibold text-ink">Embed-widget</div>
            </div>
            <p className="text-[13px] text-ink-soft leading-relaxed mb-3">
              Виджет Robosell встраивается в Платформу — по той же модели, что Cooperation.uz в B2B-модуле.
              Пользователь работает с Robosell внутри нашего интерфейса, авторизация через OneID. Вся
              бизнес-логика и данные остаются на стороне Robosell.
            </p>
            <div className="pt-3 border-t border-ink-line/60 space-y-1 text-[12px] text-ink-muted">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-3 w-3 text-success mt-0.5 shrink-0" />
                <span>Быстро к запуску — не нужна доработка Robosell</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-3 w-3 text-success mt-0.5 shrink-0" />
                <span>Пользовательский опыт без переходов</span>
              </div>
              <div className="flex items-start gap-2">
                <AlertCircle className="h-3 w-3 text-gold mt-0.5 shrink-0" />
                <span>Функциональность ограничена текущей Robosell</span>
              </div>
            </div>
          </div>

          {/* Option B: joint development */}
          <div className="p-4 rounded-xl border-2 border-gold/30 bg-bg-white">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-8 w-8 rounded-lg bg-gold/15 text-gold flex items-center justify-center font-serif font-bold">Б</div>
              <div className="font-serif font-semibold text-ink">Совместная доработка</div>
            </div>
            <p className="text-[13px] text-ink-soft leading-relaxed mb-3">
              МЭФ и Robosell совместно дорабатывают и усовершенствуют функциональность Robosell
              под требования Платформы: статусы заявок в кабинет, агрегация данных по МСБ-продавцам,
              SSOT через OneID. Robosell сохраняет открытый доступ для других пользователей.
            </p>
            <div className="pt-3 border-t border-ink-line/60 space-y-1 text-[12px] text-ink-muted">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-3 w-3 text-success mt-0.5 shrink-0" />
                <span>Расширенная функциональность под задачи Платформы</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-3 w-3 text-success mt-0.5 shrink-0" />
                <span>Данные продавцов — в общую аналитику Платформы</span>
              </div>
              <div className="flex items-start gap-2">
                <AlertCircle className="h-3 w-3 text-gold mt-0.5 shrink-0" />
                <span>Требует согласования бюджета и графика разработки</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 p-3 rounded-lg bg-bg-band/60 border border-ink-line/60 flex items-start gap-2 text-[12px] text-ink-soft">
          <Sparkles className="h-3.5 w-3.5 text-gold shrink-0 mt-0.5" />
          <span>
            После выбора модели на встрече в Ф2 обновим PhaseRoadmapStrip модуля и техспецификацию для IT-разработчика.
          </span>
        </div>
      </Card>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
        {[
          { id: 'catalog', label: 'Каталог платформ',      Icon: ShoppingBag },
          { id: 'details', label: 'Детали платформы',       Icon: Target      },
          { id: 'steps',   label: 'Шаги регистрации',       Icon: TrendingUp  },
          { id: 'compare', label: 'Сравнение',              Icon: GitCompare  },
        ].map((t) => {
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id as TabId)}
              className={cn(
                'h-11 px-4 rounded-lg text-sm font-medium border transition-colors flex items-center gap-2',
                active ? 'bg-navy text-white border-navy' : 'bg-bg-white text-ink-muted border-ink-line hover:border-gold hover:text-gold',
              )}
            >
              <t.Icon className="h-4 w-4" /> {t.label}
            </button>
          );
        })}
      </div>

      {tab === 'catalog' && <CatalogTab onOpenDetails={(id) => { setSelectedPlatform(id); setTab('details'); }} />}
      {tab === 'details' && <DetailsTab selected={selected} onSelect={setSelectedPlatform} />}
      {tab === 'steps'   && <StepsTab />}
      {tab === 'compare' && <CompareTab />}

      {/* Operators footer */}
      <Card padding="lg" className="border-gold/25 bg-gold-soft/20">
        <div className="flex items-start gap-3 mb-4">
          <Users2 className="h-5 w-5 text-gold shrink-0 mt-0.5" />
          <div>
            <CardTitle className="text-[15px]">Операторы, которые помогают МСБ выйти на маркетплейсы</CardTitle>
            <CardDescription>Если регистрация своими силами кажется сложной — обратитесь к профильным компаниям.</CardDescription>
          </div>
        </div>
        <div className="grid md:grid-cols-3 gap-3">
          {MARKETPLACE_OPERATORS.map((op) => {
            const Icon = OPERATOR_ICONS[op.Icon] ?? Briefcase;
            return (
              <div key={op.name} className="p-3 rounded-lg border border-ink-line bg-bg-white">
                <div className="flex items-start gap-2 mb-2">
                  <div className="h-9 w-9 rounded-lg bg-gold/10 text-gold flex items-center justify-center shrink-0">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-serif text-[14px] text-ink leading-tight">{op.name}</div>
                    <div className="text-[11px] text-gold uppercase tracking-wider font-semibold mt-0.5">{op.role}</div>
                  </div>
                </div>
                <ul className="space-y-0.5 text-[12px] text-ink-muted mb-2">
                  {op.services.slice(0, 3).map((s) => (
                    <li key={s} className="flex items-start gap-1.5">
                      <span className="text-gold mt-0.5">·</span> {s}
                    </li>
                  ))}
                </ul>
                <div className="pt-2 mt-2 border-t border-ink-line flex items-center justify-between text-xs">
                  <span className="text-ink-muted">{op.cost}</span>
                  <a href={op.url} target="_blank" rel="noopener noreferrer" className="text-gold font-semibold hover:underline">
                    Сайт →
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </section>
  );
}

// ════════════════════════════════════════════════════════════════════
// TAB: Catalog — grouped into Local (UZ/CIS) vs International
// ════════════════════════════════════════════════════════════════════
function CatalogTab({ onOpenDetails }: { onOpenDetails: (id: string) => void }) {
  // Sprint 8 · split into Local (UZ + CIS) and International (Global)
  const local = MARKETPLACE_DETAILS.filter((m) => m.coverage === 'UZ' || m.coverage === 'CIS');
  const international = MARKETPLACE_DETAILS.filter((m) => m.coverage !== 'UZ' && m.coverage !== 'CIS');

  return (
    <div className="space-y-8">
      {/* Local marketplaces */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <div className="h-9 w-9 rounded-lg bg-success/10 text-success flex items-center justify-center shrink-0">
            <span className="text-lg">🇺🇿</span>
          </div>
          <div>
            <div className="font-serif text-[18px] text-ink font-semibold">Местные маркетплейсы</div>
            <div className="text-[12px] text-ink-muted">Узбекистан и СНГ · быстрый старт, поддержка на русском, без валютных рисков</div>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {local.map((m, i) => (
            <MarketplaceCard key={m.id} m={m} i={i} onOpenDetails={onOpenDetails} />
          ))}
        </div>
      </div>

      {/* International marketplaces */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <div className="h-9 w-9 rounded-lg bg-gold/10 text-gold flex items-center justify-center shrink-0">
            <span className="text-lg">🌍</span>
          </div>
          <div>
            <div className="font-serif text-[18px] text-ink font-semibold">Международные маркетплейсы</div>
            <div className="text-[12px] text-ink-muted">Выход на глобальный рынок · высокая маржа, но сертификация, ВЭД и логистика</div>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {international.map((m, i) => (
            <MarketplaceCard key={m.id} m={m} i={i} onOpenDetails={onOpenDetails} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Marketplace card extracted for reuse in both groups ───
function MarketplaceCard({ m, i, onOpenDetails }: { m: MarketplaceDetail; i: number; onOpenDetails: (id: string) => void }) {
  return (
    <motion.button
      onClick={() => onOpenDetails(m.id)}
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.25, delay: i * 0.05 }}
      className="surface-card surface-card-hover p-5 text-left focus-ring"
    >
      <div className="flex items-start gap-3 mb-3">
        <div className="text-4xl">{m.logo}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <div className="font-serif text-[18px] text-ink font-semibold">{m.name}</div>
            <Badge variant={m.coverage === 'UZ' ? 'success' : m.coverage === 'CIS' ? 'warning' : 'priority'}>
              {m.coverage === 'UZ' ? 'РУз' : m.coverage === 'CIS' ? 'СНГ' : 'Мир'}
            </Badge>
          </div>
          <div className="text-[12px] text-ink-muted mt-0.5">с {m.launchedYear} года</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className="p-2.5 rounded-lg bg-bg-band/50">
          <div className="text-[10px] uppercase tracking-wider text-ink-muted">Аудитория</div>
          <div className="text-[13px] text-ink font-semibold mt-0.5 leading-tight">{m.audience}</div>
        </div>
        <div className="p-2.5 rounded-lg bg-bg-band/50">
          <div className="text-[10px] uppercase tracking-wider text-ink-muted">Продавцов</div>
          <div className="text-[13px] text-ink font-semibold mt-0.5 leading-tight">{m.sellersCount}</div>
        </div>
      </div>

      <div className="mb-3">
        <div className="text-[10px] uppercase tracking-wider text-ink-muted font-semibold mb-1">Комиссия</div>
        <div className="text-[13px] text-gold-dark font-semibold">{m.commission.typical}</div>
      </div>

      <div className="pt-3 mt-3 border-t border-ink-line flex items-center justify-between">
        <span className="text-[11px] text-ink-muted">
          {m.requirements.businessForm.join(' / ')} · выплаты за {m.payment.terms.split(' ').slice(-3).join(' ')}
        </span>
        <span className="text-sm text-gold font-semibold flex items-center gap-1">
          Подробнее <ArrowRight className="h-3.5 w-3.5" />
        </span>
      </div>
    </motion.button>
  );
}

// ════════════════════════════════════════════════════════════════════
// TAB: Details — deep dive into one platform
// ════════════════════════════════════════════════════════════════════
function DetailsTab({ selected, onSelect }: { selected: MarketplaceDetail; onSelect: (id: string) => void }) {
  return (
    <div className="space-y-4">
      {/* Platform switcher */}
      <div className="flex gap-2 overflow-x-auto scrollbar-slim pb-1">
        {MARKETPLACE_DETAILS.map((m) => {
          const active = selected.id === m.id;
          return (
            <button
              key={m.id}
              onClick={() => onSelect(m.id)}
              className={cn(
                'flex items-center gap-2 px-4 h-11 rounded-lg border text-sm font-medium whitespace-nowrap transition-colors',
                active ? 'bg-gold text-white border-gold' : 'bg-bg-white text-ink-muted border-ink-line hover:border-gold/50',
              )}
            >
              <span className="text-lg">{m.logo}</span>
              {m.name}
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={selected.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.22 }}
          className="space-y-4"
        >
          {/* KPI row */}
          <Card padding="lg">
            <div className="flex items-start justify-between gap-4 flex-wrap mb-4">
              <div className="flex items-center gap-3">
                <div className="text-5xl">{selected.logo}</div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <div className="font-serif text-2xl text-ink font-semibold">{selected.name}</div>
                    <Badge variant={selected.coverage === 'UZ' ? 'success' : selected.coverage === 'CIS' ? 'warning' : 'priority'}>
                      {selected.coverage === 'UZ' ? 'Узбекистан' : selected.coverage === 'CIS' ? 'СНГ' : 'Глобальный'}
                    </Badge>
                  </div>
                  <div className="text-sm text-ink-muted">С {selected.launchedYear} года · {selected.sellersCount} · {selected.audience}</div>
                </div>
              </div>
              <a href={selected.sellerPortalUrl} target="_blank" rel="noopener noreferrer">
                <Button size="sm" leftIcon={<ExternalLink className="h-4 w-4" />}>
                  Seller portal
                </Button>
              </a>
            </div>
          </Card>

          {/* Main grid: Commission, Logistics, Payment */}
          <div className="grid md:grid-cols-3 gap-3">
            <Card padding="md">
              <div className="flex items-center gap-2 mb-2">
                <Banknote className="h-4 w-4 text-gold" />
                <CardTitle className="text-[13px]">Комиссия</CardTitle>
              </div>
              <div className="font-serif text-2xl text-gold-dark font-semibold mb-1">{selected.commission.typical}</div>
              <div className="text-[11.5px] text-ink-muted leading-snug">{selected.commission.summary}</div>
            </Card>

            <Card padding="md">
              <div className="flex items-center gap-2 mb-2">
                <Truck className="h-4 w-4 text-gold" />
                <CardTitle className="text-[13px]">Логистика</CardTitle>
              </div>
              <div className="space-y-1 mb-2">
                {selected.logistics.model.map((m) => (
                  <div key={m} className="text-[12px] text-ink font-medium">· {m}</div>
                ))}
              </div>
              <div className="text-[11.5px] text-ink-muted leading-snug mt-2 pt-2 border-t border-ink-line">
                {selected.logistics.fees}
              </div>
              <div className="text-[11.5px] text-ink-muted leading-snug mt-1.5">
                <strong className="text-ink">Хранение:</strong> {selected.logistics.warehousing}
              </div>
            </Card>

            <Card padding="md">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="h-4 w-4 text-gold" />
                <CardTitle className="text-[13px]">Выплаты</CardTitle>
              </div>
              <div className="font-serif text-xl text-ink font-semibold mb-1">{selected.payment.currency}</div>
              <div className="text-[12.5px] text-ink leading-snug mb-1.5">{selected.payment.terms}</div>
              {selected.payment.minPayout && (
                <div className="text-[11.5px] text-ink-muted">
                  <strong>Минимум к выводу:</strong> {selected.payment.minPayout}
                </div>
              )}
            </Card>
          </div>

          {/* Requirements */}
          <Card padding="lg">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="h-5 w-5 text-gold" />
              <CardTitle>Требования к продавцу</CardTitle>
            </div>
            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <div className="text-xs uppercase tracking-wider text-ink-muted font-semibold mb-2">
                  Необходимые документы
                </div>
                <ul className="space-y-2">
                  {selected.requirements.documents.map((d) => (
                    <li key={d} className="flex items-start gap-2 text-[13px] text-ink">
                      <CheckCircle2 className="h-4 w-4 text-success mt-0.5 shrink-0" />
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-3 text-[12px] text-ink-muted">
                  <strong className="text-ink">Форма бизнеса:</strong> {selected.requirements.businessForm.join(' · ')}
                </div>
              </div>

              <div>
                <div className="text-xs uppercase tracking-wider text-ink-muted font-semibold mb-2">
                  Запрещённые категории
                </div>
                <ul className="space-y-1.5">
                  {selected.requirements.productRestrictions.map((r) => (
                    <li key={r} className="flex items-start gap-2 text-[13px] text-ink-muted">
                      <XCircle className="h-4 w-4 text-danger mt-0.5 shrink-0" />
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
                {selected.requirements.productLimits && (
                  <div className="mt-3 p-2.5 rounded-lg bg-gold-soft/30 border border-gold/25 text-[12px] text-ink leading-snug">
                    <strong>Ограничения по товару:</strong> {selected.requirements.productLimits}
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* Steps for this platform */}
          <Card padding="lg">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="h-5 w-5 text-gold" />
              <CardTitle>Шаги регистрации на {selected.name}</CardTitle>
            </div>
            <div className="space-y-2.5">
              {selected.steps.map((s) => (
                <div key={s.n} className="flex items-start gap-3 p-3 rounded-lg border border-ink-line bg-bg-white">
                  <div className="h-9 w-9 rounded-full bg-gold text-white flex items-center justify-center shrink-0 font-serif font-semibold text-sm">
                    {s.n}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2 flex-wrap">
                      <div className="font-serif text-[14px] text-ink font-semibold">{s.title}</div>
                      <span className="text-[11px] text-gold font-mono">{s.time}</span>
                    </div>
                    <div className="text-[12.5px] text-ink-muted mt-0.5 leading-snug">{s.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Pros & Cons */}
          <div className="grid md:grid-cols-2 gap-3">
            <Card padding="md" className="border-success/25 bg-success/5">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle2 className="h-4 w-4 text-success" />
                <CardTitle className="text-[14px]">Преимущества</CardTitle>
              </div>
              <ul className="space-y-1.5">
                {selected.pros.map((p) => (
                  <li key={p} className="flex items-start gap-2 text-[13px] text-ink">
                    <span className="text-success mt-0.5">+</span>
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </Card>

            <Card padding="md" className="border-danger/25 bg-danger/5">
              <div className="flex items-center gap-2 mb-3">
                <AlertCircle className="h-4 w-4 text-danger" />
                <CardTitle className="text-[14px]">Недостатки</CardTitle>
              </div>
              <ul className="space-y-1.5">
                {selected.cons.map((c) => (
                  <li key={c} className="flex items-start gap-2 text-[13px] text-ink-muted">
                    <span className="text-danger mt-0.5">−</span>
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════
// TAB: Universal registration steps
// ════════════════════════════════════════════════════════════════════
function StepsTab() {
  return (
    <div className="space-y-4">
      <Card padding="md" className="border-gold/30 bg-gold-soft/30">
        <div className="flex items-start gap-3">
          <Info className="h-5 w-5 text-gold shrink-0 mt-0.5" />
          <div className="text-sm text-ink">
            <strong>Универсальная инструкция</strong> — 8 шагов, которые нужно пройти для выхода на любой маркетплейс.
            В вкладке «Детали платформы» найдёте специфику для каждой из топ-4 платформ.
          </div>
        </div>
      </Card>

      <div className="space-y-3">
        {UNIVERSAL_STEPS.map((s, i) => {
          const Icon = STEP_ICONS[s.Icon] ?? UserPlus;
          return (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, x: -6 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.22, delay: i * 0.03 }}
            >
              <Card padding="md">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-xl bg-gold-gradient text-white flex items-center justify-center shrink-0 font-serif font-semibold text-lg">
                    {s.n}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Icon className="h-4 w-4 text-gold" />
                      <div className="font-serif text-[15px] text-ink font-semibold">{s.title}</div>
                    </div>
                    <div className="text-[13px] text-ink-muted leading-relaxed">{s.desc}</div>
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <Card padding="md" className="border-success/30 bg-success/5">
        <div className="flex items-start gap-3">
          <Sparkles className="h-5 w-5 text-success shrink-0 mt-0.5" />
          <div className="text-sm text-ink">
            <strong>Помощь государства:</strong> по программе Enterprise Uzbekistan МСБ могут получить компенсацию
            расходов на выход на Amazon и Alibaba (до $5 000), а также участие в международных B2B-выставках.
          </div>
        </div>
      </Card>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════
// TAB: Compare — matrix of all 4 platforms
// ════════════════════════════════════════════════════════════════════
function CompareTab() {
  const rows: { label: string; get: (m: MarketplaceDetail) => React.ReactNode; highlight?: (m: MarketplaceDetail) => boolean }[] = [
    { label: 'Охват',             get: (m) => <Badge variant={m.coverage === 'UZ' ? 'success' : m.coverage === 'CIS' ? 'warning' : 'priority'}>{m.coverage === 'UZ' ? 'Узбекистан' : m.coverage === 'CIS' ? 'СНГ' : 'Мир'}</Badge> },
    { label: 'Аудитория',         get: (m) => <span className="text-[13px] text-ink">{m.audience}</span> },
    { label: 'Комиссия',          get: (m) => <span className="text-[13px] text-ink font-semibold">{m.commission.typical}</span>, highlight: (m) => m.comparison.commission_pct <= 10 },
    { label: 'Срок выплаты',      get: (m) => <span className="text-[13px] text-ink">{m.comparison.payout_days === 0 ? 'прямые расчёты' : `${m.comparison.payout_days} дн.`}</span>, highlight: (m) => m.comparison.payout_days <= 3 && m.comparison.payout_days > 0 },
    { label: 'Валюта выплат',     get: (m) => <span className="text-[13px] text-ink font-mono">{m.payment.currency.split(' ')[0]}</span> },
    { label: 'Время на запуск',    get: (m) => <span className="text-[13px] text-ink">{m.comparison.setup_days} дн.</span>, highlight: (m) => m.comparison.setup_days <= 7 },
    { label: 'Модели логистики',   get: (m) => <span className="text-[12px] text-ink-muted">{m.logistics.model.length} вариантов</span> },
    { label: 'Для иностранцев',    get: (m) => {
      const map = { easy: '✓ Легко', possible: '○ Возможно', hard: '✗ Сложно' };
      const cls = { easy: 'text-success', possible: 'text-gold-dark', hard: 'text-danger' };
      return <span className={cn('text-[13px] font-medium', cls[m.comparison.foreign_seller])}>{map[m.comparison.foreign_seller]}</span>;
    }},
    { label: 'Seller portal',      get: (m) => <a href={m.sellerPortalUrl} target="_blank" rel="noopener noreferrer" className="text-[12px] text-gold hover:underline font-semibold flex items-center gap-1">открыть <ExternalLink className="h-3 w-3" /></a> },
  ];

  return (
    <div className="space-y-4">
      <Card padding="md" className="border-gold/30 bg-gold-soft/30">
        <div className="flex items-start gap-3">
          <GitCompare className="h-5 w-5 text-gold shrink-0 mt-0.5" />
          <div className="text-sm text-ink">
            <strong>Матрица сравнения:</strong> выбирайте платформу по своим целям. Для старта в РУз — Uzum.
            Для СНГ — Wildberries. Для валютной выручки — Amazon. Для B2B-оптовых продаж — Alibaba.
          </div>
        </div>
      </Card>

      <Card padding="none" className="overflow-hidden">
        <div className="overflow-x-auto scrollbar-slim">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-bg-band border-b border-ink-line">
                <th className="text-left py-3 px-4 font-semibold text-ink-muted text-[11px] uppercase tracking-wider">Параметр</th>
                {MARKETPLACE_DETAILS.map((m) => (
                  <th key={m.id} className="text-left py-3 px-4 font-semibold text-ink min-w-[150px]">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{m.logo}</span>
                      <span className="font-serif">{m.name}</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={row.label} className={cn(
                  'border-b border-ink-line/60',
                  i % 2 === 0 ? 'bg-bg-white' : 'bg-bg-band/30',
                )}>
                  <td className="py-3 px-4 font-medium text-ink text-[13px]">{row.label}</td>
                  {MARKETPLACE_DETAILS.map((m) => {
                    const highlight = row.highlight?.(m);
                    return (
                      <td key={m.id} className={cn(
                        'py-3 px-4',
                        highlight && 'bg-success/8',
                      )}>
                        {row.get(m)}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Quick recommendation */}
      <Card padding="lg">
        <div className="flex items-center gap-2 mb-3">
          <Target className="h-5 w-5 text-gold" />
          <CardTitle>Какую платформу выбрать?</CardTitle>
        </div>
        <div className="grid md:grid-cols-2 gap-3">
          {[
            { title: 'Новичок в e-commerce', platform: 'Uzum Market', why: 'Локальная поддержка на русском, короткий цикл запуска (7 дней), минимум валютных рисков, быстрая выплата.' },
            { title: 'Хочу в СНГ', platform: 'Wildberries', why: 'Доступ к 80M+ покупателям РФ/РБ/КЗ. Низкая базовая комиссия. Но нужен ВЭД и валютные операции.' },
            { title: 'Хочу валютную выручку', platform: 'Amazon', why: 'Выплаты в USD, глобальный рынок. Большие расходы на логистику из РУз, но и самая высокая маржа.' },
            { title: 'Оптовая торговля', platform: 'Alibaba.com', why: 'B2B-модель с подпиской, без процентов. Крупные заказы от международных покупателей. Подходит для производителей.' },
          ].map((r) => (
            <div key={r.title} className="p-3 rounded-lg border border-ink-line bg-bg-white">
              <div className="text-[11px] uppercase tracking-wider text-gold font-semibold">{r.title}</div>
              <div className="font-serif text-[15px] text-ink mt-0.5 mb-1">→ {r.platform}</div>
              <div className="text-[12.5px] text-ink-muted leading-snug">{r.why}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function HeroPill({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-lg p-2.5">
      <div className="text-[10px] uppercase tracking-wider text-gold-light/80">{label}</div>
      <div className="font-serif text-base md:text-lg text-white font-semibold mt-0.5">{value}</div>
      <div className="text-[10.5px] text-white/60 mt-0.5">{sub}</div>
    </div>
  );
}
