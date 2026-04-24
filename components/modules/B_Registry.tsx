'use client';

import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Filter, CheckCircle2, XCircle, Sparkles, ArrowRight, Fingerprint,
  Eye, EyeOff, Wallet, GraduationCap, Users2, ShieldCheck, MessageCircle,
  ScrollText, Award, Coins, Globe,
} from 'lucide-react';
import { Card, CardTitle, CardDescription } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { ProgressBar } from '@/components/ui/Progress';
import { useStore } from '@/lib/store';
import { MEASURES, MEASURE_TYPES, MEASURE_INDUSTRIES } from '@/lib/data/measures';
import { PERSONAS, type Persona } from '@/lib/data/personas';
import { MEASURE_TYPE_EXPLAIN, INSTRUMENT_EXPLAIN } from '@/lib/data/term_explanations';
import { InfoPopover } from '@/components/ui/InfoPopover';
import { MeasureDetailModal } from './MeasureDetailModal';
import { AssessmentRecommendationBanner } from '@/components/sections/AssessmentRecommendationBanner';
import { RegionRecommendationBanner } from '@/components/sections/RegionRecommendationBanner';
import { PhaseRoadmapStrip } from '@/components/sections/PhaseRoadmapStrip';
import { FullRegistrySection } from './B_FullRegistrySection';
import { cn } from '@/lib/cn';
import type { Measure } from '@/lib/types';

type ViewMode = 'guest' | 'authorised';

// ════════════════════════════════════════════════════════════════════
// Signature operators — institutions with a recognizable product line.
// When the agency matches, show an "exclusive" badge on the measure card
// so the operator is visible up-front without opening the detail modal.
// ════════════════════════════════════════════════════════════════════
const SIGNATURE_OPERATORS: Record<string, { label: string; tone: 'gold' | 'navy' | 'secondary' | 'success' }> = {
  'Банк развития':          { label: 'эксклюзивно · Банк развития',        tone: 'gold'      },
  'IT-парк':                 { label: 'эксклюзивно · IT-парк',               tone: 'secondary' },
  'Давактив':                { label: 'эксклюзивно · Давактив',              tone: 'navy'      },
  'Enterprise Uzbekistan':   { label: 'эксклюзивно · Enterprise Uzbekistan', tone: 'success'   },
  'Хунарманд':               { label: 'эксклюзивно · Хунарманд',             tone: 'gold'      },
  'UZUM × МЭФ':              { label: 'спецпрограмма · UZUM × МЭФ',          tone: 'secondary' },
  'ЦБ РУз':                  { label: 'эксклюзивно · Центральный банк',      tone: 'navy'      },
};

function getSignatureOperator(agency: string): { label: string; tone: 'gold' | 'navy' | 'secondary' | 'success' } | null {
  // Try exact match first, then substring match for compound agencies
  if (SIGNATURE_OPERATORS[agency]) return SIGNATURE_OPERATORS[agency];
  for (const [key, value] of Object.entries(SIGNATURE_OPERATORS)) {
    if (agency.includes(key)) return value;
  }
  return null;
}

function OperatorBadge({ agency }: { agency: string }) {
  const sig = getSignatureOperator(agency);
  if (!sig) return null;
  const toneClass =
    sig.tone === 'gold'      ? 'bg-gold/10 text-gold-dark border-gold/30' :
    sig.tone === 'navy'      ? 'bg-navy/10 text-navy border-navy/30' :
    sig.tone === 'secondary' ? 'bg-secondary/10 text-secondary border-secondary/30' :
                               'bg-success/10 text-success border-success/30';
  return (
    <div className={cn(
      'inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-[10.5px] font-semibold uppercase tracking-wider',
      toneClass,
    )}>
      <Sparkles className="h-2.5 w-2.5" />
      {sig.label}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════
// Top-level: choose mode by store role
// ════════════════════════════════════════════════════════════════════
export function B_Registry() {
  const role = useStore((s) => s.role);
  const setRole = useStore((s) => s.setRole);
  const setAuthenticated = useStore((s) => s.setAuthenticated);
  const [view, setView] = useState<ViewMode>(role === 'guest' ? 'guest' : 'authorised');
  const [openedMeasure, setOpenedMeasure] = useState<Measure | null>(null);

  // Sprint 11 — deep-link: /modules/registry?ai=1 opens the AI-navigator
  // (authorised view, persona-matched measures). If the user is a guest,
  // we elevate to entrepreneur so the view has a meaningful persona to match.
  const searchParams = useSearchParams();
  const aiDeepLink = searchParams.get('ai') === '1';
  useEffect(() => {
    if (!aiDeepLink) return;
    setView('authorised');
    if (role === 'guest') {
      setAuthenticated(true);
      setRole('entrepreneur');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aiDeepLink]);

  // Sync view with role changes from outside
  const isGuest = role === 'guest';

  return (
    <>
      <PhaseRoadmapStrip
        currentPhase={1}
        points={[
          // Фаза 1 — до 01.07.2026
          { phase: 1, text: 'Гостевой и персональный просмотр реестра (~30 мер в демо-базе)' },
          { phase: 1, text: 'Подача заявок — по ссылке на портал оператора (agrosubsidiya.uz и т.д.)' },
          { phase: 1, text: 'Фильтр по категории Рейтинга устойчивости субъектов предпринимательства' },
          // Фаза 2 — 2-я половина 2026
          { phase: 2, text: 'Пополнение реестра по мере поступления данных от минведов', blockedBy: 'рассылку окончательной таблицы критериев' },
          // Фаза 3 — 2027
          { phase: 3, text: 'Интеграция с Soliq через МИП — рейтинг устойчивости автоматически в профиле', blockedBy: 'кибер-экспертиза' },
          { phase: 3, text: 'Интеграция с project.gov.uz — реестр пополняется автоматически при регистрации новой меры' },
          { phase: 3, text: 'Подача заявок внутри Платформы (после интеграции с операторами мер)' },
          // Фаза 4 — 2028+
          { phase: 4, text: 'Обязательная миграция: все меры предоставляются только через Платформу (01.07.2027+)' },
        ]}
      />
      <section className="container-wide py-10 md:py-14 space-y-6">
      {/* ─── Registry formation banner — Sprint 3 (МЭФ April 2026) ─── */}
      <div className="surface-card bg-gold-soft/40 border-gold/30 p-5">
        <div className="flex items-start gap-4">
          <div className="h-11 w-11 rounded-xl bg-gold/15 text-gold flex items-center justify-center shrink-0">
            <Sparkles className="h-5 w-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1.5">
              <div className="font-serif font-semibold text-ink">Реестр сейчас формируется</div>
              <Badge variant="priority">проект в АП</Badge>
            </div>
            <p className="text-sm text-ink-soft leading-relaxed">
              Единый реестр всех мер государственной поддержки МСБ формируется в рамках проекта
              постановления, который находится на согласовании в <strong>Администрации Президента</strong>.
              МЭФ совместно с отраслевыми министерствами дорабатывает окончательную таблицу критериев мер —
              после утверждения она будет разослана минведам для сверки и наполнения. В демо-базе Платформы
              сейчас 30 мер для иллюстрации функциональности; полная база появится по мере поступления
              данных от ведомств.
            </p>
            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-xs text-ink-muted">
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-gold" />
                Источник: решения встречи МЭФ · апрель 2026
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-gold" />
                Канал наполнения в Ф3: project.gov.uz через МИП
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ─── 01.07.2027 mandatory migration banner ─── */}
      <div className="flex items-start gap-3 p-4 rounded-lg bg-secondary/5 border border-secondary/25">
        <Globe className="h-5 w-5 text-secondary shrink-0 mt-0.5" />
        <div className="flex-1 text-sm text-ink leading-relaxed">
          <strong className="font-serif text-ink">С 01.07.2027 — обязательный переход.</strong>{' '}
          Согласно проекту постановления Кабмина, все меры государственной поддержки предоставляются
          только через эту Платформу или интегрированные с ней системы. До этой даты ведомственные
          порталы (agrosubsidiya.uz, subsidiya.imv.uz и другие) работают параллельно.
        </div>
      </div>

      {/* View switcher */}
      <div className="flex flex-wrap gap-2 items-center">
        <div className="text-xs uppercase tracking-wider text-ink-muted font-semibold mr-2">
          Режим просмотра реестра:
        </div>
        <ViewButton
          active={view === 'guest'}
          onClick={() => { setView('guest'); setRole('guest'); }}
          Icon={EyeOff}
          label="Гостевой · 30 мер в демо-базе"
        />
        <ViewButton
          active={view === 'authorised'}
          onClick={() => { setView('authorised'); setRole('entrepreneur'); }}
          Icon={Fingerprint}
          label="По профилю · точечные меры"
          tone="gold"
        />
      </div>

      {/* Assessment-based recommendations banner (7.1) — shows if user completed any assessment */}
      {(view === 'guest' || view === 'authorised') && (
        <>
          <AssessmentRecommendationBanner onSelectMeasure={setOpenedMeasure} />
          <RegionRecommendationBanner onSelectMeasure={setOpenedMeasure} />
        </>
      )}

      {/* Mode-specific view */}
      {view === 'guest'      && <GuestView       onOpenMeasure={setOpenedMeasure} />}
      {view === 'authorised' && <AuthorisedView  onOpenMeasure={setOpenedMeasure} />}

      {/* Sprint 11 — real 352-measure registry from МЭФ XLSX */}
      <FullRegistrySection />

      {/* Measure detail modal — unified across all modes */}
      {openedMeasure && (
        <MeasureDetailModal
          measure={openedMeasure}
          guestMode={view === 'guest'}
          onClose={() => setOpenedMeasure(null)}
        />
      )}
    </section>
    </>
  );
}

function ViewButton({ active, onClick, Icon, label, tone = 'default' }: {
  active: boolean; onClick: () => void; Icon: typeof Fingerprint; label: string; tone?: 'default' | 'gold' | 'navy';
}) {
  const activeClass =
    tone === 'gold' ? 'bg-gold text-white border-gold' :
    tone === 'navy' ? 'bg-navy text-white border-navy' :
                      'bg-ink text-white border-ink';
  return (
    <button
      onClick={onClick}
      className={cn(
        'h-11 px-4 rounded-lg text-sm font-semibold border transition-colors flex items-center gap-2',
        active ? activeClass : 'bg-bg-white text-ink-muted border-ink-line hover:border-gold hover:text-gold',
      )}
    >
      <Icon className="h-4 w-4" />
      {label}
    </button>
  );
}

// ════════════════════════════════════════════════════════════════════
// GUEST VIEW — full catalog with category badges (slide 20)
// ════════════════════════════════════════════════════════════════════
function GuestView({ onOpenMeasure }: { onOpenMeasure: (m: Measure) => void }) {
  const [query, setQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<'all' | 'financial' | 'non-financial'>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterIndustry, setFilterIndustry] = useState<string>('all');
  const [filterRating, setFilterRating] = useState<string>('all');

  const filtered = useMemo(() => MEASURES.filter((m) => {
    if (filterCategory !== 'all' && m.category !== filterCategory) return false;
    if (filterType !== 'all' && m.type !== filterType) return false;
    if (filterIndustry !== 'all' && m.industry !== filterIndustry && m.industry !== 'all') return false;
    if (query && !m.titleKey.toLowerCase().includes(query.toLowerCase())) return false;
    return true;
  }), [query, filterCategory, filterType, filterIndustry]);

  const finCount    = MEASURES.filter((m) => m.category === 'financial').length;
  const nonFinCount = MEASURES.filter((m) => m.category === 'non-financial').length;

  return (
    <div className="grid lg:grid-cols-[1fr_320px] gap-6">
      {/* Left: search + filters + list */}
      <div>
        <div className="surface-card p-4 mb-4">
          {/* Search */}
          <div className="relative mb-3">
            <Search className="h-4 w-4 text-ink-muted absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder='Поиск: «субсидия на хлопок», «льготный кредит для кафе», «грант IT»…'
              className="w-full pl-9 pr-3 h-11 rounded-lg border border-ink-line bg-bg-white text-sm focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/30"
            />
          </div>

          {/* Category pills */}
          <div className="flex gap-2 mb-3">
            <CategoryPill active={filterCategory === 'all'}            onClick={() => setFilterCategory('all')}>
              Все ({MEASURES.length})
            </CategoryPill>
            <CategoryPill active={filterCategory === 'financial'}      onClick={() => setFilterCategory('financial')}      tone="gold">
              Финансовые ({finCount})
            </CategoryPill>
            <CategoryPill active={filterCategory === 'non-financial'}  onClick={() => setFilterCategory('non-financial')}  tone="blue">
              Нефинансовые ({nonFinCount})
            </CategoryPill>
          </div>

          {/* Secondary filters */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-3">
            <Select
              label=""
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              options={[
                { value: 'all',          label: 'Тип меры' },
                { value: 'subsidy',      label: 'Субсидии' },
                { value: 'loan',         label: 'Льготные кредиты' },
                { value: 'benefit',      label: 'Налоговые льготы' },
                { value: 'grant',        label: 'Гранты' },
                { value: 'consulting',   label: 'Консультации' },
                { value: 'training',     label: 'Обучение' },
                { value: 'export-help',  label: 'Экспортная помощь' },
                { value: 'partner-matching', label: 'Подбор партнёра' },
                { value: 'certification', label: 'Сертификация' },
                { value: 'legal-help',   label: 'Юр. помощь' },
              ]}
            />
            <Select
              label=""
              value={filterIndustry}
              onChange={(e) => setFilterIndustry(e.target.value)}
              options={Object.entries(MEASURE_INDUSTRIES).map(([v, l]) => ({ value: v, label: l }))}
            />
            <div className="text-xs text-ink-muted self-center text-right">
              Показано <strong className="text-ink">{filtered.length}</strong> из {MEASURES.length}
            </div>
          </div>

          {/* Rating filter row — Sprint 3 */}
          <div className="pt-3 border-t border-ink-line/60">
            <div className="flex items-start gap-3 flex-wrap">
              <div className="flex items-center gap-2 shrink-0">
                <ShieldCheck className="h-4 w-4 text-gold" />
                <span className="text-xs uppercase tracking-wider text-ink-muted font-semibold whitespace-nowrap">
                  Рейтинг устойчивости
                </span>
                <InfoPopover
                  title="Рейтинг устойчивости субъектов предпринимательства"
                  whatIs="Официальный рейтинг Налогового комитета (ПКМ №55 от 30.01.2024) — 23 критерия, 100 баллов, категории AAA (96–100), AA (91–95), A (86–90), B, C, D. С 01.04.2024 субсидии и льготы применяются в зависимости от категории. На Платформу будет передаваться через МИП (межведомственный обмен данными)."
                />
              </div>
              <div className="flex flex-wrap gap-1.5">
                {(['all', 'AAA', 'AA', 'A', 'B', 'C', 'D'] as const).map((r) => {
                  const active = filterRating === r;
                  const colorMap: Record<string, string> = {
                    all:  'border-ink-line text-ink-muted hover:border-gold/40',
                    AAA:  'border-success/40 text-success',
                    AA:   'border-success/40 text-success',
                    A:    'border-gold/40 text-gold-dark',
                    B:    'border-gold/40 text-gold-dark',
                    C:    'border-ink-line text-ink-muted',
                    D:    'border-danger/40 text-danger',
                  };
                  return (
                    <button
                      key={r}
                      onClick={() => setFilterRating(r)}
                      className={`h-7 px-2.5 rounded-md text-xs font-medium border transition-all ${
                        active
                          ? 'bg-gold text-white border-gold shadow-subtle'
                          : `bg-bg-white ${colorMap[r]}`
                      }`}
                    >
                      {r === 'all' ? 'Все' : r}
                    </button>
                  );
                })}
              </div>
              <a
                href="https://my3.soliq.uz"
                target="_blank"
                rel="noopener noreferrer"
                className="ml-auto text-xs text-gold hover:text-gold-dark underline-offset-2 hover:underline inline-flex items-center gap-1"
              >
                Узнать свою категорию в Soliq
                <Globe className="h-3 w-3" />
              </a>
            </div>
            {filterRating !== 'all' && (
              <div className="mt-2 text-[11px] text-ink-muted">
                Фильтр по категории активен в демо-режиме. В Фазе 3 данные подтягиваются из Soliq автоматически через МИП.
              </div>
            )}
          </div>
        </div>

        {/* Measure cards */}
        <div className="space-y-2.5">
          {filtered.length === 0 && (
            <div className="surface-card p-12 text-center text-ink-muted">
              Под эти фильтры ничего не найдено
            </div>
          )}
          {filtered.map((m, i) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: Math.min(i, 8) * 0.025 }}
            >
              <GuestMeasureCard measure={m} onClick={() => onOpenMeasure(m)} />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Right: «what guest sees / doesn't see» panel */}
      <aside>
        <div className="sticky top-32 space-y-4">
          <div>
            <h3 className="font-serif text-lg text-ink mb-3 flex items-center gap-2">
              <Eye className="h-4 w-4 text-gold" /> Что видит гость
            </h3>
            <ul className="space-y-2">
              {[
                'Полный каталог 885 инструментов',
                'Фильтры: тип, отрасль, регион, стадия, сумма',
                'Паспорт каждой меры — все поля',
                'Общие требования и документы',
              ].map((t) => (
                <li key={t} className="flex items-start gap-2 text-sm text-ink">
                  <span className="inline-block h-px w-3 bg-gold mt-2.5 shrink-0" /> {t}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-serif text-lg text-ink mb-3 flex items-center gap-2">
              <EyeOff className="h-4 w-4 text-ink-muted" /> Чего не видит гость
            </h3>
            <ul className="space-y-2 opacity-70">
              {[
                'Персонализацию «подходит именно вам»',
                'Автопроверку критериев по профилю',
                'Остаток лимита применительно к нему',
                'Кнопку «Подать заявку» → редирект на OneID',
              ].map((t) => (
                <li key={t} className="flex items-start gap-2 text-sm text-ink-muted">
                  <span className="inline-block h-px w-3 bg-ink-line mt-2.5 shrink-0" /> {t}
                </li>
              ))}
            </ul>
          </div>

          <Card padding="md" className="border-gold/30 bg-gold-soft/40">
            <div className="text-xs uppercase tracking-wider text-gold font-semibold mb-2">Призыв</div>
            <p className="text-sm text-ink leading-relaxed">
              «Войдите через OneID — покажем точечно применимые меры с автоматической проверкой критериев»
            </p>
          </Card>
        </div>
      </aside>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════
// AUTHORISED VIEW — funnel + persona switcher + 2 groups (slide 21)
// ════════════════════════════════════════════════════════════════════
function AuthorisedView({ onOpenMeasure }: { onOpenMeasure: (m: Measure) => void }) {
  const [personaId, setPersonaId] = useState<Persona['id']>('zulfiya');
  const persona = PERSONAS.find((p) => p.id === personaId)!;

  const finMeasures    = useMemo(() => MEASURES.filter((m) => persona.matchedFinancial.includes(m.id)),    [persona]);
  const nonFinMeasures = useMemo(() => MEASURES.filter((m) => persona.matchedNonFinancial.includes(m.id)), [persona]);
  const matchedCount = finMeasures.length + nonFinMeasures.length;

  // Symmetric side: measures that the profile does NOT pass. Demo-simulated reasons.
  const rejected = useMemo(() => getRejectedForPersona(persona.id), [persona.id]);

  return (
    <div className="space-y-6">
      {/* ─────── Funnel diagram ─────── */}
      <Card padding="lg" tone="navy" className="text-white relative overflow-hidden">
        <div className="absolute inset-0 pattern-dots opacity-25 pointer-events-none" />
        <div className="relative">
          <div className="text-xs uppercase tracking-wider text-gold-light font-semibold mb-2">Воронка персонализации</div>
          <h3 className="font-serif text-xl md:text-2xl text-white mb-5 leading-tight">
            Из 885 инструментов → 5–12 точечных мер за 2 секунды
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-2 md:gap-1">
            <FunnelStep n="01" title="OneID · MyID"      sub="вход в систему"                                        tone="dark"  />
            <FunnelStep n="02" title="МИП → профиль"     sub="Минюст · Soliq · Кадастр · МВД · Таможня"             tone="dark"  />
            <FunnelStep n="03" title="Атрибуты профиля"  sub="форма · ПИНФЛ/ИНН · отрасль · регион · стадия"        tone="med"   />
            <FunnelStep n="04" title="Фильтр применимых" sub="автопроверка каждого критерия меры"                    tone="gold"  />
            <FunnelStep n="05" title={`${finMeasures.length + nonFinMeasures.length} точечных мер`} sub={`${finMeasures.length} фин · ${nonFinMeasures.length} нефин`} tone="result" />
          </div>
        </div>
      </Card>

      {/* ─────── Persona switcher ─────── */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-serif text-lg text-ink flex items-center gap-2">
            <Users2 className="h-4 w-4 text-gold" /> Демо-персона
          </h3>
          <span className="text-xs text-ink-muted">переключите — увидите как меняется набор точечных мер</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {PERSONAS.map((p) => (
            <PersonaCard key={p.id} persona={p} active={p.id === personaId} onClick={() => setPersonaId(p.id)} />
          ))}
        </div>
      </div>

      {/* ─────── Result: persona profile + measures ─────── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={persona.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.25 }}
        >
          {/* Profile summary */}
          <Card padding="lg" className="mb-4 border-gold/25 bg-gold-soft/20">
            <div className="grid md:grid-cols-[2fr_3fr] gap-4 items-center">
              <div>
                <div className="text-xs uppercase tracking-wider text-gold font-semibold mb-1">
                  Профиль · {persona.id === 'abror' ? '01' : persona.id === 'jasur' ? '02' : persona.id === 'zulfiya' ? '03' : '04'}
                </div>
                <CardTitle className="text-[18px]">{persona.name} · {persona.age} лет</CardTitle>
                <div className="text-sm text-ink-muted mt-1">{persona.region}</div>
                <div className="mt-3 flex gap-2 flex-wrap">
                  <Badge variant="outline">{persona.legalForm}</Badge>
                  <Badge variant="outline">{persona.industry}</Badge>
                  <Badge variant="outline">{persona.employees > 0 ? `${persona.employees} сотрудн.` : 'без сотрудников'}</Badge>
                  {persona.revenue && <Badge variant="outline">{persona.revenue}</Badge>}
                </div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-wider text-ink-muted mb-1.5">{persona.business}</div>
                <p className="text-sm text-ink leading-relaxed">{persona.story}</p>
                <div className="mt-3 flex items-center justify-end gap-2">
                  <span className="text-sm text-ink-muted">Из 885 →</span>
                  <span className="text-base font-serif font-semibold text-gold">
                    {finMeasures.length + nonFinMeasures.length} точечных мер
                  </span>
                </div>
              </div>
            </div>
          </Card>

          {/* ─── Eligibility result (Sprint 3) — 2 groups: pass / fail ─── */}
          <Card padding="lg" className="mb-4">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle2 className="h-5 w-5 text-success" />
              <CardTitle>Результат проверки соответствия</CardTitle>
            </div>
            <CardDescription className="mb-4">
              Проверено по данным вашего профиля (ИНН, ОКЭД, размер, обороты, задолженности, рейтинг устойчивости).
              В Ф3 проверка — автоматическая через МИП на основе данных Soliq/Минюста.
            </CardDescription>

            <div className="grid md:grid-cols-2 gap-4">
              {/* Group A: Can apply */}
              <div className="rounded-xl border border-success/30 bg-success/5 p-4">
                <div className="flex items-center gap-2 mb-2.5">
                  <div className="h-8 w-8 rounded-lg bg-success/15 text-success flex items-center justify-center">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="font-serif font-semibold text-success text-[15px]">Можете подать</div>
                    <div className="text-xs text-ink-muted">{matchedCount} мер соответствуют профилю</div>
                  </div>
                </div>
                <ul className="space-y-1 text-[12.5px] text-ink-soft">
                  <li className="flex items-start gap-1.5">
                    <span className="mt-[6px] h-1 w-1 rounded-full bg-success shrink-0" />
                    ОКЭД, регион и размер бизнеса подходят под критерии
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="mt-[6px] h-1 w-1 rounded-full bg-success shrink-0" />
                    Категория рейтинга устойчивости позволяет подать
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="mt-[6px] h-1 w-1 rounded-full bg-success shrink-0" />
                    Нет блокирующих задолженностей на текущую дату
                  </li>
                </ul>
                <div className="mt-3 text-xs text-success font-medium">
                  Список ↓ ниже
                </div>
              </div>

              {/* Group B: Cannot apply — with reasons */}
              <div className="rounded-xl border border-danger/25 bg-danger/5 p-4">
                <div className="flex items-center gap-2 mb-2.5">
                  <div className="h-8 w-8 rounded-lg bg-danger/15 text-danger flex items-center justify-center">
                    <XCircle className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="font-serif font-semibold text-danger text-[15px]">Не можете подать</div>
                    <div className="text-xs text-ink-muted">{rejected.length} мер с отказом — причины указаны</div>
                  </div>
                </div>
                <div className="space-y-2">
                  {rejected.slice(0, 3).map((r, i) => (
                    <div key={i} className="p-2 rounded-lg bg-bg-white border border-danger/15">
                      <div className="text-[12.5px] font-medium text-ink leading-tight">{r.title}</div>
                      <div className="mt-1 text-[11px] text-danger/90 leading-snug">
                        <XCircle className="h-3 w-3 inline mr-1 -mt-0.5" />
                        {r.reason}
                      </div>
                    </div>
                  ))}
                </div>
                {rejected.length > 3 && (
                  <div className="mt-2 text-xs text-ink-muted">
                    + ещё {rejected.length - 3} мер…
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* Two groups: financial + non-financial */}
          <div className="grid lg:grid-cols-2 gap-4">
            {/* Financial */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="inline-block h-[3px] w-6 bg-gold" />
                  <h3 className="text-xs uppercase tracking-[0.18em] text-gold font-semibold">
                    Финансовые · {finMeasures.length}
                  </h3>
                </div>
                <span className="text-xs text-ink-muted">субсидии · гранты · кредиты · льготы</span>
              </div>
              <div className="space-y-2">
                {finMeasures.length === 0 && (
                  <div className="surface-card p-6 text-center text-sm text-ink-muted">
                    Финансовых мер под этот профиль не найдено
                  </div>
                )}
                {finMeasures.map((m) => <MatchedMeasureCard key={m.id} measure={m} category="financial" onClick={() => onOpenMeasure(m)} />)}
              </div>
            </div>

            {/* Non-financial */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="inline-block h-[3px] w-6 bg-secondary" />
                  <h3 className="text-xs uppercase tracking-[0.18em] text-secondary font-semibold">
                    Нефинансовые · {nonFinMeasures.length}
                  </h3>
                </div>
                <span className="text-xs text-ink-muted">консультации · обучение · экспорт · сертификация</span>
              </div>
              <div className="space-y-2">
                {nonFinMeasures.length === 0 && (
                  <div className="surface-card p-6 text-center text-sm text-ink-muted">
                    Нефинансовых мер под этот профиль не найдено
                  </div>
                )}
                {nonFinMeasures.map((m) => <MatchedMeasureCard key={m.id} measure={m} category="non-financial" onClick={() => onOpenMeasure(m)} />)}
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Footer callout */}
      <Card padding="lg" className="border-gold/25 bg-gold-soft/30">
        <div className="flex items-start gap-4">
          <div className="h-10 w-10 rounded-lg bg-gold/15 text-gold flex items-center justify-center shrink-0">
            <Sparkles className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <div className="font-serif font-semibold text-ink">Это реализация слайдов 20–21 концепции</div>
            <CardDescription className="mt-1">
              Принципиальное отличие от существующих ведомственных порталов: каталог объединяет <strong>финансовые и нефинансовые</strong> инструменты в одной витрине, а после авторизации через OneID/МИП показывает только то, что подходит конкретному предпринимателю — с автопроверкой критериев против атрибутов профиля.
            </CardDescription>
            <div className="mt-3 flex gap-2 flex-wrap">
              <Badge variant="priority-solid">Модуль (б) · 01.07.2026</Badge>
              <Badge variant="outline">SSOT через МИП</Badge>
              <Badge variant="outline">Связан с модулями (а), (е)</Badge>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════
// Sub-components
// ════════════════════════════════════════════════════════════════════
function CategoryPill({ active, onClick, tone, children }: {
  active: boolean; onClick: () => void; tone?: 'gold' | 'blue'; children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'h-9 px-4 rounded-full text-xs font-semibold transition-colors border',
        active
          ? tone === 'gold'  ? 'bg-gold text-white border-gold' :
            tone === 'blue'  ? 'bg-secondary text-white border-secondary' :
                               'bg-navy text-white border-navy'
          : 'bg-bg-white text-ink-muted border-ink-line hover:border-gold hover:text-gold',
      )}
    >
      {children}
    </button>
  );
}

// ─── Sprint 3 · Rejected measures helper ─────────────────────────────
// Per-persona hardcoded list of measures that do NOT match the profile,
// with concrete reasons. In Ф3 this will be replaced with automatic checks
// against live data from Soliq / Минюст / Банки via МИП.
interface RejectedItem { title: string; reason: string }

function getRejectedForPersona(personaId: Persona['id']): RejectedItem[] {
  const byPersona: Record<Persona['id'], RejectedItem[]> = {
    abror: [
      { title: 'M003 · Грант R&D для IT-стартапов',              reason: 'Не ваш ОКЭД (62.x требуется, у вас 56.x — общепит)' },
      { title: 'M008 · Субсидия на модернизацию орошения',       reason: 'Не ваша отрасль (сельское хозяйство)' },
      { title: 'M007 · Экспортный кредит Банка развития',        reason: 'Требуется экспортный контракт и 12 мес работы (у вас 0)' },
      { title: 'M015 · Льгота по НДС для «ААА»',                 reason: 'Рейтинг устойчивости ещё не сформирован (нужно ≥ 6 мес деятельности)' },
      { title: 'NF008 · Поддержка экспортной логистики',         reason: 'Требуется действующий бизнес с экспортной историей' },
    ],
    jasur: [
      { title: 'M002 · Субсидия для женщин-предпринимателей',    reason: 'Программа ограничена женщинами-учредителями' },
      { title: 'M003 · Грант R&D для IT-стартапов',              reason: 'Не ваш ОКЭД (62.x требуется, у вас 01.x — АПК)' },
      { title: 'M015 · Льгота по НДС для «ААА»',                 reason: 'Ваша категория рейтинга устойчивости — «A», требуется «AAA»' },
      { title: 'NF006 · Менторство от IT-парка',                 reason: 'Только для резидентов IT-парка' },
    ],
    zulfiya: [
      { title: 'M003 · Грант R&D для IT-стартапов',              reason: 'Не ваш ОКЭД (62.x требуется, у вас 96.02 — beauty)' },
      { title: 'M007 · Экспортный кредит Банка развития',        reason: 'Нет экспортного контракта и валютной выручки' },
      { title: 'M008 · Субсидия на модернизацию орошения',       reason: 'Не ваша отрасль (сельское хозяйство)' },
      { title: 'NF008 · Поддержка экспортной логистики',         reason: 'Требуется экспортная деятельность' },
      { title: 'M015 · Льгота по НДС для «ААА»',                 reason: 'Ваша категория рейтинга устойчивости — «B», требуется «AAA»' },
    ],
    timur: [
      { title: 'M002 · Субсидия для женщин-предпринимателей',    reason: 'Программа ограничена женщинами-учредителями' },
      { title: 'M008 · Субсидия на модернизацию орошения',       reason: 'Не ваша отрасль (сельское хозяйство)' },
      { title: 'M001 · Стартап-грант до 200 млн сум',            reason: 'Превышен потолок годового оборота (500 млн сум)' },
      { title: 'NF011 · Консультации для женщин-предпринимателей', reason: 'Только для женщин-учредителей' },
    ],
  };
  return byPersona[personaId] ?? [];
}

function GuestMeasureCard({ measure, onClick }: { measure: Measure; onClick: () => void }) {
  const isFin = measure.category === 'financial';
  return (
    <button
      onClick={onClick}
      className="surface-card p-4 hover:border-gold/40 hover:shadow-card transition-all cursor-pointer w-full text-left focus-ring"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          {/* Exclusive-operator badge above title, when applicable */}
          <OperatorBadge agency={measure.agency} />
          <div className={cn('font-serif text-[15px] text-ink leading-snug', getSignatureOperator(measure.agency) && 'mt-1.5')}>
            {measure.titleKey}
          </div>
          <div className="mt-1.5 text-xs text-ink-muted flex items-center gap-1.5 flex-wrap">
            <span>{measure.agency}</span>
            <span>·</span>
            <span>{measure.amount}</span>
            <span>·</span>
            <span>{measure.term}</span>
          </div>
        </div>
        <Badge variant={isFin ? 'priority' : 'info'} className={cn(
          'shrink-0 uppercase font-bold tracking-wider',
          !isFin && 'bg-secondary/10 text-secondary border-secondary/20',
        )}>
          {isFin ? 'финансовая' : 'нефинансовая'}
        </Badge>
      </div>
    </button>
  );
}

function MatchedMeasureCard({ measure, category, onClick }: {
  measure: Measure; category: 'financial' | 'non-financial'; onClick: () => void;
}) {
  const accent = category === 'financial' ? 'gold' : 'secondary';
  const eligibilityPct = (measure.okCount / measure.totalCount) * 100;
  const typeExplain = MEASURE_TYPE_EXPLAIN[measure.type];
  return (
    <div className={cn(
      'p-3 rounded-lg border bg-bg-white transition-colors',
      category === 'financial' ? 'border-ink-line hover:border-gold/40' : 'border-ink-line hover:border-secondary/40',
    )}>
      <button onClick={onClick} className="w-full text-left focus-ring rounded">
        <div className="flex items-start justify-between gap-2 mb-1.5">
          <div className="flex-1 min-w-0">
            {/* Exclusive-operator badge above title, when applicable */}
            <OperatorBadge agency={measure.agency} />
            <div className={cn('font-serif text-[14px] text-ink leading-snug', getSignatureOperator(measure.agency) && 'mt-1')}>
              {measure.titleKey}
            </div>
            <div className="text-[11.5px] text-ink-muted mt-0.5">
              {measure.agency} · {measure.amount}
            </div>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <span className={cn(
              'text-[10.5px] font-mono px-1.5 py-0.5 rounded',
              accent === 'gold' ? 'bg-gold/10 text-gold-dark' : 'bg-secondary/10 text-secondary',
            )}>
              {MEASURE_TYPES[measure.type].label}
            </span>
            {typeExplain && (
              <InfoPopover
                title={typeExplain.title}
                whatIs={typeExplain.whatIs}
                whenNeeded={typeExplain.whenNeeded}
                example={typeExplain.example}
                size="sm"
              />
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <ProgressBar
            value={eligibilityPct}
            tone={eligibilityPct >= 80 ? 'success' : 'gold'}
            height="sm"
            className="flex-1"
          />
          <span className="text-[11px] text-ink-muted whitespace-nowrap">
            {measure.okCount}/{measure.totalCount} критериев
          </span>
        </div>
      </button>
    </div>
  );
}

function FunnelStep({ n, title, sub, tone }: { n: string; title: string; sub: string; tone: 'dark' | 'med' | 'gold' | 'result' }) {
  const bg =
    tone === 'dark'   ? 'bg-navy text-white' :
    tone === 'med'    ? 'bg-navy-2 text-white' :
    tone === 'gold'   ? 'bg-gold text-white' :
                        'bg-gold-light text-white';
  return (
    <div className="relative">
      <div className={cn('rounded-lg p-3 h-full flex flex-col', bg)}>
        <div className="text-[10px] tracking-[0.2em] opacity-70 mb-1">{n}</div>
        <div className="font-serif text-[13px] leading-tight mb-1">{title}</div>
        <div className="text-[11px] opacity-80 leading-snug">{sub}</div>
      </div>
    </div>
  );
}

function PersonaCard({ persona, active, onClick }: { persona: Persona; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'text-left p-3 rounded-xl border transition-all',
        active
          ? 'border-gold bg-gold-soft/50 shadow-sm'
          : 'border-ink-line bg-bg-white hover:border-gold/50 hover:-translate-y-0.5',
      )}
    >
      <div className="flex items-start gap-2.5">
        <div className={cn(
          'h-9 w-9 rounded-full flex items-center justify-center shrink-0 font-serif font-semibold text-sm',
          active ? 'bg-gold text-white' : 'bg-bg-band text-ink-muted',
        )}>
          {persona.name.split(' ')[0][0]}
        </div>
        <div className="min-w-0 flex-1">
          <div className="font-serif text-[14px] text-ink leading-tight">{persona.name.split(' ')[0]}</div>
          <div className="text-[11px] text-ink-muted leading-snug mt-0.5">{persona.business}</div>
          <div className="mt-1.5 flex gap-1 flex-wrap">
            <span className="text-[10px] text-gold font-semibold">
              {persona.matchedFinancial.length + persona.matchedNonFinancial.length} мер
            </span>
            <span className="text-[10px] text-ink-muted">·</span>
            <span className="text-[10px] text-ink-muted">{persona.region.split(' · ')[1] || persona.region.split(' · ')[0]}</span>
          </div>
        </div>
      </div>
    </button>
  );
}

