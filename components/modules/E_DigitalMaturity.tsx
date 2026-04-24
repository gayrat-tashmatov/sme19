'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Factory, Store, Briefcase, Cpu, Play, Settings, Plus, Gauge, Coins, Plane,
  CheckCircle2, ArrowRight, RefreshCw, Award, TrendingUp, Scale, Receipt,
  GraduationCap, Video, FileText, Clock,
} from 'lucide-react';
import { Tabs, TabPanel } from '@/components/ui/Tabs';
import { Card, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/Progress';
import { useT } from '@/lib/i18n';
import { useStore } from '@/lib/store';
import {
  SURVEYS, QUESTIONS, QUESTION_TEXT, DIMENSIONS, DIMENSION_LABELS,
  FINLIT_QUESTIONS, EXPORT_QUESTIONS, FINANCE_READY_QUESTIONS, LEGAL_QUESTIONS, TAX_QUESTIONS,
  getFinlitLevel, getExportLevel, getFinanceLevel, getLegalLevel, getTaxLevel,
  type AssessmentQuestion,
} from '@/lib/data/maturity';
import { MaturityResult } from './E_MaturityResult';
import { PhaseRoadmapStrip } from '@/components/sections/PhaseRoadmapStrip';
import { cn } from '@/lib/cn';

const ICONS: Record<string, typeof Factory> = {
  Factory, Store, Briefcase, Cpu, Coins, Plane, Scale, Receipt,
};

type View = 'catalog' | 'flow' | 'result' | 'admin' | 'courses';
type SurveyType = 'digital' | 'finlit' | 'export' | 'finance' | 'legal' | 'tax';

export function EDigitalMaturity() {
  // const t = useT(); // currently unused
  const role = useStore((s) => s.role);
  const [tab, setTab] = useState<View>('catalog');
  const [activeType, setActiveType] = useState<SurveyType>('digital');
  const [scaleAnswers, setScaleAnswers] = useState<Record<string, number>>({});
  const [choiceAnswers, setChoiceAnswers] = useState<Record<string, number>>({});
  const [qi, setQi] = useState(0);

  const activeQuestions: AssessmentQuestion[] | null =
    activeType === 'finlit'  ? FINLIT_QUESTIONS :
    activeType === 'export'  ? EXPORT_QUESTIONS :
    activeType === 'finance' ? FINANCE_READY_QUESTIONS :
    activeType === 'legal'   ? LEGAL_QUESTIONS :
    activeType === 'tax'     ? TAX_QUESTIONS : null;

  const totalCount = activeType === 'digital' ? QUESTIONS.length : (activeQuestions?.length ?? 0);

  function startFlow(type: SurveyType) {
    setActiveType(type);
    setScaleAnswers({});
    setChoiceAnswers({});
    setQi(0);
    setTab('flow');
  }

  function next() {
    if (qi < totalCount - 1) setQi(qi + 1);
    else setTab('result');
  }

  const dimensionScores = Object.fromEntries(
    DIMENSIONS.map((d) => {
      const qs = QUESTIONS.filter((q) => q.dimension === d.key);
      const vals = qs.map((q) => scaleAnswers[q.id] ?? 0);
      const avg = vals.reduce((a, b) => a + b, 0) / Math.max(1, vals.length);
      return [d.key, Math.round((avg / 5) * 100)];
    }),
  );

  const choiceScorePct = activeQuestions
    ? Math.round(
        (Object.values(choiceAnswers).reduce((a, b) => a + b, 0) /
          (activeQuestions.length * 3)) * 100,
      )
    : 0;

  // Persist assessment result when user reaches the result tab (7.1 — cross-module linkage)
  const recordAssessment = useStore((s) => s.recordAssessment);
  useEffect(() => {
    if (tab !== 'result') return;
    if (activeType === 'digital' && Object.keys(scaleAnswers).length > 0) {
      // For digital maturity, use average of dimension scores
      const avg = Math.round(Object.values(dimensionScores).reduce((a, b) => a + b, 0) / DIMENSIONS.length);
      const level: 'low' | 'medium' | 'high' = avg >= 70 ? 'high' : avg >= 50 ? 'medium' : 'low';
      recordAssessment({ type: 'digital', scorePct: avg, level, completedAt: Date.now() });
    } else if (activeType !== 'digital' && Object.keys(choiceAnswers).length > 0) {
      const level: 'low' | 'medium' | 'high' = choiceScorePct >= 75 ? 'high' : choiceScorePct >= 50 ? 'medium' : 'low';
      recordAssessment({ type: activeType, scorePct: choiceScorePct, level, completedAt: Date.now() });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  return (
    <div className="container-wide py-10 md:py-14">
      <PhaseRoadmapStrip
        embedded
        currentPhase={1}
        points={[
          // Фаза 1 — до 01.07.2026
          { phase: 1, text: '6 опросников: цифровая, финансовая, правовая, налоговая грамотность, экспортная и финансовая готовность' },
          { phase: 1, text: 'Персональная AI-рекомендация после прохождения опросника' },
          { phase: 1, text: 'Связка с реестром мер поддержки: «Вот меры для ваших слабых зон»' },
          { phase: 1, text: '1 демо-курс «Финансовая грамотность» + заглушки для 4 курсов в продакшне + ссылка на внешний курс «Экспорт»' },
          // Фаза 2 — 2-я половина 2026
          { phase: 2, text: 'Обсуждение программ 5 курсов с отраслевыми экспертами и корректировка' },
          // Фаза 3 — 2027
          { phase: 3, text: 'Расширение до 20+ опросников через конструктор модератора МЭФ' },
          { phase: 3, text: 'Полноценная LMS: все 6 базовых курсов с видео-продакшн + SCORM' },
          { phase: 3, text: 'Сертификаты прохождения в цифровом профиле' },
          // Фаза 4 — 2028+
          { phase: 4, text: 'Персональные learning paths на основе AI и данных из Soliq' },
        ]}
      />

      <Tabs
        items={[
          { id: 'catalog', label: 'Каталог оценок' },
          { id: 'flow',    label: 'Прохождение' },
          { id: 'result',  label: 'Результат' },
          { id: 'courses', label: 'Курсы' },
          { id: 'admin',   label: 'Конструктор (admin)' },
        ]}
        value={tab}
        onChange={(v) => setTab(v as View)}
        size="lg"
      />

      <TabPanel active={tab === 'catalog'}>
        <div className="mb-6 max-w-3xl">
          <h2 className="font-serif text-2xl font-semibold">Четыре оценки — четыре среза зрелости бизнеса</h2>
          <p className="text-sm text-ink-muted mt-1">
            Пройдите все 4 опросника, чтобы получить полную картину сильных и слабых сторон.
            Каждая оценка построена на международной методологии.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {SURVEYS.map((s, i) => {
            const Ic = ICONS[s.iconName] ?? Gauge;
            return (
              <motion.button
                key={s.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                onClick={() => startFlow(s.type)}
                className="surface-card surface-card-hover p-5 text-left group focus-ring flex flex-col"
              >
                <div
                  className="h-12 w-12 rounded-xl flex items-center justify-center mb-4 transition-colors"
                  style={{ background: `${s.color}18`, color: s.color }}
                >
                  <Ic className="h-6 w-6" />
                </div>
                <div className="font-serif font-semibold text-[16px] text-ink leading-tight">{s.title_ru}</div>
                <div className="text-xs text-ink-muted mt-1.5 flex items-center gap-2">
                  <span>{s.duration}</span>
                  <span>·</span>
                  <span>{s.questions} вопросов</span>
                </div>
                <div className="text-[12.5px] text-ink-muted mt-2.5 leading-relaxed flex-1">{s.desc_ru}</div>
                <div className="mt-3 pt-3 border-t border-ink-line text-[11px] text-ink-muted">
                  <strong className="text-gold">Референс:</strong> {s.reference}
                </div>
                <div className="mt-3 text-sm text-gold font-medium flex items-center gap-1">
                  <Play className="h-3.5 w-3.5" /> Начать
                </div>
              </motion.button>
            );
          })}
        </div>
      </TabPanel>

      <TabPanel active={tab === 'flow'}>
        {activeType === 'digital' ? (
          <ScaleFlow
            qi={qi}
            answers={scaleAnswers}
            onAnswer={(id, v) => setScaleAnswers((a) => ({ ...a, [id]: v }))}
            onNext={next}
            onBack={() => setQi(Math.max(0, qi - 1))}
          />
        ) : activeQuestions ? (
          <ChoiceFlow
            qi={qi}
            questions={activeQuestions}
            answers={choiceAnswers}
            onAnswer={(id, v) => setChoiceAnswers((a) => ({ ...a, [id]: v }))}
            onNext={next}
            onBack={() => setQi(Math.max(0, qi - 1))}
            type={activeType}
          />
        ) : null}
      </TabPanel>

      <TabPanel active={tab === 'result'}>
        {activeType === 'digital' ? (
          Object.keys(scaleAnswers).length === 0 ? (
            <EmptyResult onStart={() => setTab('catalog')} />
          ) : (
            <MaturityResult dimensionScores={dimensionScores} onRestart={() => setTab('catalog')} />
          )
        ) : Object.keys(choiceAnswers).length === 0 ? (
          <EmptyResult onStart={() => setTab('catalog')} />
        ) : (
          <ChoiceResult
            type={activeType}
            scorePct={choiceScorePct}
            onRestart={() => setTab('catalog')}
          />
        )}
      </TabPanel>

      <TabPanel active={tab === 'courses'}>
        <CoursesCatalog />
      </TabPanel>

      <TabPanel active={tab === 'admin'}>
        {role === 'mef' ? (
          <AdminConstructor />
        ) : (
          <div className="surface-card p-10 text-center">
            <div className="mx-auto h-14 w-14 rounded-full bg-gold/10 text-gold flex items-center justify-center mb-4">
              <Settings className="h-7 w-7" />
            </div>
            <h3 className="font-serif text-xl font-semibold">Доступно администратору МЭФ</h3>
            <p className="mt-2 text-ink-muted">Переключите роль в шапке, чтобы увидеть конструктор опросников.</p>
          </div>
        )}
      </TabPanel>
    </div>
  );
}

// ────────── Scale flow (digital maturity, 1–5) ──────────
function ScaleFlow({
  qi, answers, onAnswer, onNext, onBack,
}: {
  qi: number; answers: Record<string, number>; onAnswer: (id: string, v: number) => void;
  onNext: () => void; onBack: () => void;
}) {
  const q = QUESTIONS[qi];
  const dim = DIMENSIONS.find((d) => d.key === q.dimension)!;
  const pct = ((qi + 1) / QUESTIONS.length) * 100;
  const val = answers[q.id];

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-ink-muted">Вопрос {qi + 1} из {QUESTIONS.length}</span>
          <Badge variant="warning">{DIMENSION_LABELS[dim.labelKey].ru}</Badge>
        </div>
        <ProgressBar value={pct} tone="gold" height="md" />
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={q.id} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.25 }}>
          <Card padding="lg">
            <div className="font-serif text-2xl font-semibold text-ink leading-snug">{QUESTION_TEXT[q.textKey]}</div>
            <p className="text-sm text-ink-muted mt-3">Оцените по шкале от 1 (совсем нет) до 5 (полностью внедрено).</p>
            <div className="mt-8 grid grid-cols-5 gap-2 md:gap-3">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  onClick={() => onAnswer(q.id, n)}
                  className={`h-16 rounded-xl border-2 font-serif text-2xl font-bold transition-all focus-ring ${
                    val === n ? 'bg-gold text-white border-gold shadow-card scale-105' : 'bg-bg-white text-ink border-ink-line hover:border-gold hover:bg-gold-soft'
                  }`}
                >{n}</button>
              ))}
            </div>
            <div className="mt-3 flex justify-between text-xs text-ink-muted px-1">
              <span>Совсем нет</span><span>Полностью</span>
            </div>
          </Card>
        </motion.div>
      </AnimatePresence>

      <div className="mt-6 flex items-center justify-between">
        <Button variant="ghost" onClick={onBack} disabled={qi === 0}>← Назад</Button>
        <Button onClick={onNext} disabled={val === undefined}>
          {qi === QUESTIONS.length - 1 ? 'Посмотреть результат' : 'Далее →'}
        </Button>
      </div>
    </div>
  );
}

// ────────── Choice flow (finlit/export/finance/legal/tax) ──────────
const TYPE_META: Record<Exclude<SurveyType, 'digital'>, { label: string; color: string; Icon: typeof Factory }> = {
  finlit:  { label: 'Финансовая грамотность',     color: '#8B6F3A', Icon: Coins },
  export:  { label: 'Экспортная готовность',       color: '#4CAF50', Icon: Plane },
  finance: { label: 'Готовность к финансированию', color: '#5B8DB8', Icon: Briefcase },
  legal:   { label: 'Правовая грамотность',        color: '#B08D4C', Icon: Scale },
  tax:     { label: 'Налоговая грамотность',       color: '#C58E4A', Icon: Receipt },
};

function ChoiceFlow({
  qi, questions, answers, onAnswer, onNext, onBack, type,
}: {
  qi: number; questions: AssessmentQuestion[]; answers: Record<string, number>;
  onAnswer: (id: string, v: number) => void; onNext: () => void; onBack: () => void;
  type: Exclude<SurveyType, 'digital'>;
}) {
  const q = questions[qi];
  const pct = ((qi + 1) / questions.length) * 100;
  const val = answers[q.id];
  const meta = TYPE_META[type];

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
          <span className="text-sm text-ink-muted">Вопрос {qi + 1} из {questions.length}</span>
          <div className="flex items-center gap-2">
            <meta.Icon className="h-4 w-4" style={{ color: meta.color }} />
            <Badge variant="info">{meta.label}</Badge>
            {q.dim && <Badge variant="outline">{q.dim}</Badge>}
          </div>
        </div>
        <ProgressBar value={pct} tone="gold" height="md" />
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={q.id} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.25 }}>
          <Card padding="lg">
            <div className="font-serif text-[20px] md:text-[22px] font-semibold text-ink leading-snug">{q.text}</div>
            <div className="mt-6 space-y-2">
              {q.options.map((opt) => {
                const selected = val === opt.score;
                return (
                  <button
                    key={opt.label}
                    onClick={() => onAnswer(q.id, opt.score)}
                    className={cn(
                      'w-full text-left p-3.5 rounded-xl border-2 transition-all focus-ring',
                      selected ? 'bg-gold-soft border-gold shadow-card' : 'bg-bg-white border-ink-line hover:border-gold/50',
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        'h-6 w-6 rounded-full border-2 flex items-center justify-center shrink-0',
                        selected ? 'bg-gold border-gold' : 'border-ink-line',
                      )}>
                        {selected && <CheckCircle2 className="h-4 w-4 text-white" />}
                      </div>
                      <div className={cn('text-[14px]', selected ? 'text-ink font-medium' : 'text-ink')}>{opt.label}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </Card>
        </motion.div>
      </AnimatePresence>

      <div className="mt-6 flex items-center justify-between">
        <Button variant="ghost" onClick={onBack} disabled={qi === 0}>← Назад</Button>
        <Button onClick={onNext} disabled={val === undefined}>
          {qi === questions.length - 1 ? 'Посмотреть результат' : 'Далее →'}
        </Button>
      </div>
    </div>
  );
}

// ────────── Choice result ──────────
function ChoiceResult({
  type, scorePct, onRestart,
}: {
  type: Exclude<SurveyType, 'digital'>; scorePct: number; onRestart: () => void;
}) {
  const meta = TYPE_META[type];
  const result =
    type === 'finlit'  ? getFinlitLevel(scorePct) :
    type === 'export'  ? getExportLevel(scorePct) :
    type === 'finance' ? getFinanceLevel(scorePct) :
    type === 'legal'   ? getLegalLevel(scorePct) :
                         getTaxLevel(scorePct);

  const recommendations: Record<typeof type, { high: string[]; medium: string[]; low: string[] }> = {
    finlit: {
      high:   ['Продвинутый курс по финансовому планированию в ЦПП', 'Инвестиционные инструменты UZSE'],
      medium: ['Базовый курс «Финансы предпринимателя» (бесплатно · ЦПП)', 'Модуль учёта и контроля денежных потоков'],
      low:    ['Стартовый курс финграмотности (бесплатно · ЦПП)', 'Практикум: разделение личных и бизнес-финансов', 'Консультация наставника'],
    },
    export: {
      high:   ['Заявка в Enterprise Uzbekistan', 'Субсидия на участие в международной выставке', 'Выход на Amazon через модуль (в)'],
      medium: ['Обучение в Export Promotion Agency', 'Сертификат происхождения СТ-1', 'Подключение валютного счёта'],
      low:    ['Консультация экспортного наставника', 'Курс «Экспорт для МСБ» в ЦПП', 'Подготовка англоязычного каталога'],
    },
    finance: {
      high:   ['Льготный кредит от Банка развития бизнеса', 'Гарантийный фонд · покрытие до 80%', 'Лизинг оборудования'],
      medium: ['Услуги бухгалтерского сопровождения', 'Постановка на учёт в Реестре кредитных историй', 'Консультация по оформлению отчётности'],
      low:    ['Курс «Бухгалтерия для предпринимателя» (ЦПП, бесплатно)', 'Переход на 1С или аналогичную систему', 'Ведение учёта через Soliq online'],
    },
    legal: {
      high:   ['Вы готовы к сложным сделкам', 'Можно вести переговоры по большим контрактам', 'Сертификация процедур'],
      medium: ['Курс «Договорное право для МСБ» (Адвокатская палата)', 'Шаблоны договоров и претензий', 'Консультация по конкретным кейсам'],
      low:    ['Курс «Правовой минимум руководителя» (бесплатно · Минюст)', 'Практикум по трудовому кодексу', 'Юридическая консультация по текущим договорам'],
    },
    tax: {
      high:   ['Применяйте статус ААА для возмещения НДС за 1 день', 'Налоговое планирование и льготы IT-парка', 'Оптимизация налогового режима'],
      medium: ['Курс «Налоги для МСБ» (Институт налоговой и бюджетной политики)', 'Практикум по ЭСФ и e-imzo', 'Консультация по рейтингу устойчивости'],
      low:    ['Базовый курс налоговой грамотности (бесплатно)', 'Регистрация в Soliq online', 'Нанять бухгалтера на аутсорс'],
    },
  };

  const level = scorePct >= 75 ? 'high' : scorePct >= 50 ? 'medium' : 'low';
  const recs = recommendations[type][level];

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      <Card padding="lg" tone="navy" className="text-white relative overflow-hidden">
        <div className="absolute inset-0 pattern-dots opacity-25 pointer-events-none" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-3">
            <meta.Icon className="h-5 w-5" style={{ color: '#EDD9A6' }} />
            <span className="text-xs uppercase tracking-wider text-gold-light font-semibold">Результат · {meta.label}</span>
          </div>
          <div className="flex items-baseline gap-4 mb-2 flex-wrap">
            <div className="font-serif text-5xl md:text-6xl text-white font-bold">{scorePct}%</div>
            <div>
              <div className="text-xs uppercase tracking-wider text-white/70">Ваш уровень</div>
              <div className="font-serif text-2xl" style={{ color: result.color }}>{result.label}</div>
            </div>
          </div>
          <p className="text-white/80 text-sm max-w-2xl mt-2">{result.verdict}</p>
        </div>
      </Card>

      <Card padding="lg">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="h-5 w-5 text-gold" />
          <CardTitle className="text-[16px]">Персональные рекомендации</CardTitle>
        </div>
        <CardDescription className="mb-4">
          Сформированы на основе ваших ответов. Связаны с конкретными программами поддержки Платформы.
        </CardDescription>
        <div className="space-y-2">
          {recs.map((r, i) => (
            <div key={i} className="flex items-start gap-3 p-3 rounded-lg border border-ink-line bg-bg-white hover:border-gold/40 transition-colors">
              <div className="h-7 w-7 rounded-full bg-gold/15 text-gold flex items-center justify-center shrink-0 font-mono text-xs font-semibold">{i + 1}</div>
              <div className="flex-1 text-sm text-ink">{r}</div>
              <ArrowRight className="h-4 w-4 text-gold shrink-0 mt-0.5" />
            </div>
          ))}
        </div>
      </Card>

      <div className="flex gap-2 flex-wrap">
        <Button onClick={onRestart} leftIcon={<RefreshCw className="h-4 w-4" />}>Пройти другой опросник</Button>
        <Button variant="ghost" leftIcon={<Award className="h-4 w-4" />}>Скачать сертификат (PDF)</Button>
      </div>
    </div>
  );
}

function EmptyResult({ onStart }: { onStart: () => void }) {
  return (
    <div className="surface-card p-10 text-center">
      <div className="mx-auto h-14 w-14 rounded-full bg-gold/10 text-gold flex items-center justify-center mb-4">
        <Gauge className="h-7 w-7" />
      </div>
      <h3 className="font-serif text-xl font-semibold">Результат появится после опроса</h3>
      <p className="mt-2 text-ink-muted">Выберите один из 4 опросников и ответьте на вопросы.</p>
      <Button className="mt-6" onClick={onStart}>Перейти в каталог</Button>
    </div>
  );
}

function AdminConstructor() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h2 className="font-serif text-2xl font-semibold">Конструктор оценок</h2>
          <p className="text-sm text-ink-muted mt-1">Управляйте опросниками и их привязкой к мерам поддержки.</p>
        </div>
        <Button leftIcon={<Plus className="h-4 w-4" />}>Создать опросник</Button>
      </div>
      <Card padding="none" className="overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-ink-muted bg-bg-band">
              <th className="py-3 px-5 font-medium">Опросник</th>
              <th className="py-3 px-5 font-medium">Тип</th>
              <th className="py-3 px-5 font-medium">Вопросов</th>
              <th className="py-3 px-5 font-medium">Прохождений</th>
              <th className="py-3 px-5 font-medium">Статус</th>
              <th className="py-3 px-5"></th>
            </tr>
          </thead>
          <tbody>
            {SURVEYS.map((s, i) => (
              <tr key={s.id} className="border-t border-ink-line hover:bg-bg-band/60 transition-colors">
                <td className="py-3 px-5 font-medium text-ink">{s.title_ru}</td>
                <td className="py-3 px-5 text-ink-muted font-mono text-xs">{s.type}</td>
                <td className="py-3 px-5 font-mono">{s.questions}</td>
                <td className="py-3 px-5 font-mono">{1234 + i * 287}</td>
                <td className="py-3 px-5"><Badge variant="success">активен</Badge></td>
                <td className="py-3 px-5 text-right"><Button variant="ghost" size="sm">Редактировать</Button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// Sprint 4 · Courses catalog (учебная библиотека)
// ═══════════════════════════════════════════════════════════════════

interface CourseEntry {
  id: string;
  title: string;
  topic: string;
  operator: string;
  duration: string;
  format: 'video' | 'reading' | 'mixed';
  state: 'available-demo' | 'in-production-q4' | 'external-link';
  externalUrl?: string;
  summary: string;
  connectedAssessment?: string;
}

const COURSES: CourseEntry[] = [
  {
    id: 'c-finlit',
    title: 'Финансовая грамотность для МСБ',
    topic: 'Деньги · отчётность · управление',
    operator: 'Бизнес-школа МЭФ',
    duration: '2 ч 40 мин · 8 модулей',
    format: 'video',
    state: 'available-demo',
    summary: 'Базовый курс: управление денежным потоком, чтение P&L, бюджетирование, работа с бухгалтером. Единственный полнофункциональный курс в Ф1 — служит образцом качества для остальных.',
    connectedAssessment: 'finlit',
  },
  {
    id: 'c-legal',
    title: 'Правовой минимум руководителя МСБ',
    topic: 'Трудовое · договорное · корпоративное право',
    operator: 'Институт повышения квалификации юристов + Адвокатская палата',
    duration: '~3 ч · 7 модулей',
    format: 'video',
    state: 'in-production-q4',
    summary: 'Трудовые договоры и их оформление, защита интересов в контрактах, корпоративные процедуры, споры с ведомствами, обращение в суды.',
    connectedAssessment: 'legal',
  },
  {
    id: 'c-tax',
    title: 'Налоги для МСБ: режимы, отчётность, льготы',
    topic: 'Налоговый кодекс · Рейтинг устойчивости',
    operator: 'Институт налоговой и бюджетной политики',
    duration: '~3 ч · 9 модулей',
    format: 'video',
    state: 'in-production-q4',
    summary: 'Выбор налогового режима, правила НДС, ЕСП и социального налога, подача отчётности, достижение высокой категории Рейтинга устойчивости для доступа к льготам.',
    connectedAssessment: 'tax',
  },
  {
    id: 'c-bizplan',
    title: 'Основы бизнес-плана',
    topic: 'Стратегия · рыночный анализ · финмодель',
    operator: 'Бизнес-школа МЭФ',
    duration: '~4 ч · 10 модулей',
    format: 'mixed',
    state: 'in-production-q4',
    summary: 'От идеи до финансовой модели: анализ рынка, CustDev, unit-экономика, подготовка документов для подачи на гранты/субсидии/кредит.',
  },
  {
    id: 'c-export',
    title: 'Экспорт для МСБ: выход на зарубежные рынки',
    topic: 'Контракты · логистика · сертификация',
    operator: 'Enterprise Uzbekistan + УзТПП',
    duration: '~6 ч · 12 модулей',
    format: 'mixed',
    state: 'external-link',
    externalUrl: 'https://enterprise.uz/training',
    summary: 'Внешний курс от Enterprise Uzbekistan. Проходится на их портале, результаты — в личный кабинет. После интеграции SCORM в Ф3 — без ухода со Платформы.',
    connectedAssessment: 'export',
  },
  {
    id: 'c-finance',
    title: 'Финансирование: кредиты, гранты, инвестиции',
    topic: 'Банк развития · МФИ · venture',
    operator: 'Банк развития Узбекистана + EDC',
    duration: '~3 ч · 8 модулей',
    format: 'video',
    state: 'in-production-q4',
    summary: 'Типы финансирования для каждой стадии бизнеса, подготовка credit story, подача заявки, работа с залоговым обеспечением и экспортным финансированием.',
    connectedAssessment: 'finance',
  },
];

function CoursesCatalog() {
  return (
    <div>
      <div className="mb-6 max-w-3xl">
        <h2 className="font-serif text-2xl font-semibold">Учебная библиотека</h2>
        <p className="text-sm text-ink-muted mt-1 leading-relaxed">
          Базовые курсы, которые связаны с оценками: пройдя опросник, вы увидите слабые места и сможете пройти
          соответствующий курс. В демо-версии доступен 1 курс (Финансовая грамотность); остальные будут добавляться
          по мере готовности материалов.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {COURSES.map((c, i) => (
          <motion.div
            key={c.id}
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.3, delay: i * 0.04 }}
          >
            <Card hover className="h-full flex flex-col">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="h-10 w-10 rounded-xl bg-gold/10 text-gold flex items-center justify-center shrink-0">
                  <GraduationCap className="h-5 w-5" />
                </div>
                <CourseStateBadge state={c.state} />
              </div>

              <CardTitle className="text-[15px] leading-snug">{c.title}</CardTitle>
              <div className="text-[11px] text-gold-dark uppercase tracking-wider font-semibold mt-1">
                {c.topic}
              </div>

              <CardDescription className="text-[12.5px] mt-2.5 leading-relaxed flex-1">
                {c.summary}
              </CardDescription>

              <div className="mt-4 pt-3 border-t border-ink-line/60 space-y-1.5 text-[12px] text-ink-muted">
                <div className="flex items-center gap-1.5">
                  <Clock className="h-3 w-3" />
                  {c.duration}
                </div>
                <div className="flex items-center gap-1.5">
                  <FileText className="h-3 w-3" />
                  <span className="truncate">{c.operator}</span>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-ink-line/60">
                <CourseAction course={c} />
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Future vision */}
      <div className="mt-8 surface-card bg-secondary/5 border-secondary/25 p-5 flex items-start gap-4">
        <div className="h-10 w-10 rounded-xl bg-secondary/15 text-secondary flex items-center justify-center shrink-0">
          <TrendingUp className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <CardTitle className="text-[15px]">Дорожная карта учебной библиотеки</CardTitle>
          <ul className="mt-2 space-y-1.5 text-[13px] text-ink-soft leading-relaxed">
            <li>• <strong>Ф1 (до 01.07.2026):</strong> 1 демо-курс «Финграмотность» + заглушки остальных + ссылка на внешний курс «Экспорт»</li>
            <li>• <strong>Ф2 (2-я половина 2026):</strong> обсуждение с экспертами и корректировка программ курсов</li>
            <li>• <strong>Ф3 (2027):</strong> все 6 курсов доступны; SCORM-интеграция с внешними LMS; сертификаты в цифровом профиле</li>
            <li>• <strong>Ф4 (2028+):</strong> расширение до 20+ курсов, персональные learning paths на основе AI и данных профиля</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function CourseStateBadge({ state }: { state: CourseEntry['state'] }) {
  if (state === 'available-demo')    return <Badge variant="success">доступен</Badge>;
  if (state === 'external-link')      return <Badge variant="info">внешний портал</Badge>;
  return <Badge variant="warning">в подготовке</Badge>;
}

function CourseAction({ course }: { course: CourseEntry }) {
  if (course.state === 'available-demo') {
    return (
      <Button size="sm" className="w-full" leftIcon={<Play className="h-3.5 w-3.5" />}>
        Начать курс
      </Button>
    );
  }
  if (course.state === 'external-link' && course.externalUrl) {
    return (
      <a
        href={course.externalUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex w-full h-9 px-3 items-center justify-center gap-1.5 rounded-lg border border-secondary/40 text-secondary bg-secondary/5 hover:bg-secondary/10 text-sm font-medium transition-colors"
      >
        <ArrowRight className="h-3.5 w-3.5" />
        Открыть на Enterprise.uz
      </a>
    );
  }
  return (
    <Button size="sm" variant="ghost" disabled className="w-full">
      Подписаться на релиз
    </Button>
  );
}
