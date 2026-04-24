'use client';

import { useState } from 'react';
import { X, CheckCircle2, XCircle, FileText, FileSignature, ChevronDown, HelpCircle } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/cn';
import type { Measure } from '@/lib/types';
import { MEASURE_TYPES } from '@/lib/data/measures';

type TabId = 'description' | 'criteria' | 'docs' | 'procedure' | 'faq';

interface Props {
  measure: Measure;
  /** When true — hide 4/5 count and "requires action" red flags (guest mode). */
  guestMode?: boolean;
  onClose: () => void;
}

// ════════════════════════════════════════════════════════════════════
// Default narratives — used when measure doesn't provide its own
// ════════════════════════════════════════════════════════════════════
function getDefaultDescription(m: Measure): string {
  const industryLabel: Record<string, string> = {
    manufacturing: 'промышленность',
    trade: 'торговля',
    services: 'сфера услуг',
    agro: 'сельское хозяйство',
    it: 'IT-сектор',
    tourism: 'туризм',
    export: 'экспортная деятельность',
    all: 'все отрасли МСБ',
  };
  const ind = industryLabel[m.industry] ?? m.industry;
  const typeLabel = MEASURE_TYPES[m.type]?.label ?? 'Мера поддержки';
  return `${typeLabel.toLowerCase()} направлен${m.category === 'financial' ? 'а' : 'о'} на поддержку ${ind} с целью компенсации части расходов на инвестиции и развитие производства.`;
}

function getDefaultProcedure(m: Measure): string[] {
  if (m.category === 'financial') {
    return [
      'Заполнение заявки через мастер «Подай один раз» — до 15 минут',
      'Автоматическая первичная проверка — 1 рабочий день',
      `Отраслевая экспертиза ведомством «${m.agency}» — 3–7 рабочих дней`,
      'Решение комиссии — 10–20 рабочих дней',
      'Перечисление средств или оформление льготы — 5 рабочих дней после решения',
    ];
  }
  return [
    'Заполнение заявки через мастер «Подай один раз» — до 15 минут',
    'Автоматическая первичная проверка — 1 рабочий день',
    `Согласование с ведомством «${m.agency}» — 2–5 рабочих дней`,
    'Подтверждение участия — 3 рабочих дня',
    'Начало оказания услуги / консультации — в течение недели',
  ];
}

function getDefaultFAQ(m: Measure): { q: string; a: string }[] {
  const base = [
    {
      q: 'Можно ли подавать заявку повторно при отказе?',
      a: 'Да, после устранения причин отказа вы можете подать заявку повторно. Обычно это возможно через 30 дней после получения отказа. Рекомендуем внимательно изучить причину отказа и подготовить уточнённые документы.',
    },
    {
      q: 'Что считается налоговой задолженностью?',
      a: 'Любая задолженность перед бюджетом на дату подачи заявки, включая НДС, налог на прибыль, ЕСП. Рассрочки и реструктуризации не считаются задолженностью, если вы соблюдаете график. Получить справку об отсутствии задолженности можно за 1 день через soliq.uz.',
    },
  ];
  if (m.type === 'loan') {
    base.push({
      q: 'Возможно ли досрочное погашение льготного кредита?',
      a: 'Да, досрочное погашение разрешено без штрафов. После погашения сумма компенсации процентов из бюджета пересчитывается пропорционально фактическому сроку использования средств.',
    });
  } else if (m.type === 'subsidy' || m.type === 'grant') {
    base.push({
      q: 'Нужно ли возвращать полученные средства?',
      a: 'Нет, субсидии и гранты не возвращаются при условии целевого использования. Однако вы обязаны предоставить отчёт об использовании в течение 6 месяцев после получения и сохранить подтверждающие документы минимум 5 лет.',
    });
  } else {
    base.push({
      q: 'Сколько длится услуга?',
      a: 'Срок зависит от формата: консультация — 1–3 часа, обучение — от 40 до 120 академических часов, менторинг — 3–6 месяцев. Точные параметры указаны в поле «Срок».',
    });
  }
  return base;
}

// ════════════════════════════════════════════════════════════════════
// Component
// ════════════════════════════════════════════════════════════════════
export function MeasureDetailModal({ measure, guestMode = false, onClose }: Props) {
  const [tab, setTab] = useState<TabId>('description');
  const [openFAQ, setOpenFAQ] = useState<number | null>(0);

  const description = measure.description ?? getDefaultDescription(measure);
  const procedure = measure.procedure ?? getDefaultProcedure(measure);
  const faq = measure.faq ?? getDefaultFAQ(measure);

  // Criteria label depends on mode
  const criteriaLabel = guestMode
    ? 'Критерии'
    : `Критерии (${measure.okCount}/${measure.totalCount})`;

  const TABS: { id: TabId; label: string }[] = [
    { id: 'description', label: 'Описание' },
    { id: 'criteria',    label: criteriaLabel },
    { id: 'docs',        label: 'Документы' },
    { id: 'procedure',   label: 'Процедура' },
    { id: 'faq',         label: 'FAQ' },
  ];

  // Industry label for description tab
  const industryLabel: Record<string, string> = {
    manufacturing: 'Промышленность',
    trade: 'Торговля',
    services: 'Услуги',
    agro: 'Сельское хозяйство',
    it: 'IT',
    tourism: 'Туризм',
    export: 'Экспорт',
    all: 'Все отрасли',
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-6 bg-ink/50 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl bg-bg-white rounded-t-2xl md:rounded-2xl shadow-2xl flex flex-col max-h-[92vh] md:max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 md:p-6 pb-4 border-b border-ink-line">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 h-9 w-9 rounded-lg flex items-center justify-center text-ink-muted hover:bg-bg-band hover:text-ink transition-colors"
            aria-label="Закрыть"
          >
            <X className="h-5 w-5" />
          </button>
          <h2 className="font-serif text-xl md:text-2xl text-ink font-semibold pr-10 leading-tight">
            {measure.titleKey}
          </h2>
          <div className="text-sm text-ink-muted mt-1 font-mono">
            Код {measure.id} · {measure.agency} · {MEASURE_TYPES[measure.type]?.label ?? measure.type}
          </div>
        </div>

        {/* Tabs nav */}
        <div className="px-5 md:px-6 border-b border-ink-line">
          <div className="flex gap-1 md:gap-3 overflow-x-auto scrollbar-slim -mb-px">
            {TABS.map((t) => {
              const active = tab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={cn(
                    'py-3 px-2 md:px-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors',
                    active
                      ? 'border-gold text-gold'
                      : 'border-transparent text-ink-muted hover:text-ink',
                  )}
                >
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 md:p-6">
          {tab === 'description' && (
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-[11px] uppercase tracking-wider text-ink-muted font-semibold">Сумма</div>
                  <div className="font-serif text-[22px] text-ink font-semibold mt-1 leading-tight">{measure.amount}</div>
                </div>
                <div>
                  <div className="text-[11px] uppercase tracking-wider text-ink-muted font-semibold">Срок</div>
                  <div className="font-serif text-[22px] text-ink font-semibold mt-1 leading-tight">{measure.term}</div>
                </div>
                <div>
                  <div className="text-[11px] uppercase tracking-wider text-ink-muted font-semibold">Отрасль</div>
                  <div className="font-serif text-[18px] text-ink font-semibold mt-1 leading-tight">
                    {industryLabel[measure.industry] ?? measure.industry}
                  </div>
                </div>
                <div>
                  <div className="text-[11px] uppercase tracking-wider text-ink-muted font-semibold">Орган</div>
                  <div className="font-serif text-[18px] text-ink font-semibold mt-1 leading-tight">{measure.agency}</div>
                </div>
              </div>

              <hr className="border-ink-line" />

              <p className="text-[15px] text-ink leading-relaxed">{description}</p>
            </div>
          )}

          {tab === 'criteria' && (
            <div className="space-y-2">
              {measure.criteria.map((c) => {
                // In guest mode — all criteria shown without colour indication
                const showAsOK = guestMode ? true : c.ok;
                return (
                  <div
                    key={c.key}
                    className={cn(
                      'flex items-start gap-3 p-3.5 rounded-xl border transition-colors',
                      showAsOK
                        ? 'bg-success/5 border-success/25'
                        : 'bg-danger/5 border-danger/25',
                    )}
                  >
                    {guestMode ? (
                      <div className="h-5 w-5 rounded-full border-2 border-ink-line shrink-0 mt-0.5" />
                    ) : c.ok ? (
                      <CheckCircle2 className="h-5 w-5 text-success shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="h-5 w-5 text-danger shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1 text-[15px] text-ink font-medium">{c.label_ru}</div>
                    {!guestMode && !c.ok && (
                      <span className="text-xs text-danger shrink-0 self-center">требует действия</span>
                    )}
                  </div>
                );
              })}

              {guestMode && (
                <div className="mt-4 p-3 rounded-lg bg-gold-soft/40 border border-gold/30 text-sm text-ink">
                  <strong>Авторизуйтесь,</strong> чтобы увидеть по каким критериям вы уже подходите,
                  а по каким нужно доработать.
                </div>
              )}
            </div>
          )}

          {tab === 'docs' && (
            <div className="space-y-2">
              {measure.docs.map((doc) => (
                <div
                  key={doc}
                  className="flex items-center gap-3 p-3.5 rounded-xl bg-bg-band/60 border border-ink-line hover:bg-bg-band transition-colors"
                >
                  <FileText className="h-5 w-5 text-gold shrink-0" />
                  <div className="flex-1 text-[14px] text-ink font-medium">{doc}</div>
                </div>
              ))}
            </div>
          )}

          {tab === 'procedure' && (
            <div className="space-y-3">
              {procedure.map((step, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="h-9 w-9 rounded-full bg-gold text-white flex items-center justify-center shrink-0 font-serif font-semibold text-sm">
                    {i + 1}
                  </div>
                  <div className="flex-1 text-[14.5px] text-ink leading-relaxed pt-1.5">{step}</div>
                </div>
              ))}
            </div>
          )}

          {tab === 'faq' && (
            <div className="space-y-2">
              {faq.map((item, i) => {
                const isOpen = openFAQ === i;
                return (
                  <div
                    key={i}
                    className={cn(
                      'rounded-xl border transition-colors',
                      isOpen ? 'border-gold/40 bg-gold-soft/20' : 'border-ink-line bg-bg-white',
                    )}
                  >
                    <button
                      onClick={() => setOpenFAQ(isOpen ? null : i)}
                      className="w-full flex items-start gap-3 text-left p-4"
                    >
                      <HelpCircle className="h-5 w-5 text-gold-dark shrink-0 mt-0.5" />
                      <div className="flex-1 text-[14.5px] text-ink font-medium">{item.q}</div>
                      <ChevronDown className={cn('h-5 w-5 text-ink-muted shrink-0 transition-transform', isOpen && 'rotate-180')} />
                    </button>
                    {isOpen && (
                      <div className="px-4 pb-4 pl-12 text-[14px] text-ink-muted leading-relaxed">
                        {item.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 md:p-5 bg-bg-band/50 border-t border-ink-line flex items-center justify-end gap-3">
          <Button variant="ghost" onClick={onClose}>Закрыть</Button>
          <Button leftIcon={<FileSignature className="h-4 w-4" />}>Подать заявку</Button>
        </div>
      </div>
    </div>
  );
}
