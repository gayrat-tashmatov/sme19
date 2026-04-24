'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ClipboardPlus, Building2, User, Users2, Briefcase, CheckCircle2, Search,
  Sparkles, ArrowRight, ArrowLeft, Loader2, Clock, Calculator, ExternalLink,
  Info, ShieldCheck,
} from 'lucide-react';
import { Card, CardTitle, CardDescription } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/cn';

type LegalForm = 'ip' | 'ltd' | 'family' | 'cooperative';

const FORMS: { id: LegalForm; title: string; sub: string; Icon: typeof User; time: string; fee: string }[] = [
  { id: 'ip',          title: 'Индивидуальный предприниматель', sub: 'Для самозанятых и малого бизнеса. Упрощённая отчётность.',    Icon: User,      time: '~ 30 мин', fee: '0 сум'       },
  { id: 'ltd',         title: 'ООО',                              sub: 'Наиболее распространённая форма. Для 1+ учредителей.',         Icon: Building2, time: '~ 1 час',  fee: '450 000 сум' },
  { id: 'family',      title: 'Семейное предприятие',             sub: 'Для семейного ведения бизнеса. Упрощённый режим.',             Icon: Users2,    time: '~ 45 мин', fee: '200 000 сум' },
  { id: 'cooperative', title: 'Кооператив',                       sub: 'Для 5+ учредителей с совместным ведением хозяйственной деятельности.', Icon: Briefcase, time: '~ 1.5 часа', fee: '350 000 сум' },
];

const OKED_SUGGESTIONS: Record<string, { code: string; desc: string }[]> = {
  'кафе':      [{ code: '56.10', desc: 'Ресторанная деятельность и услуги по доставке еды' }, { code: '56.30', desc: 'Деятельность по предоставлению напитков' }],
  'магазин':   [{ code: '47.11', desc: 'Розничная торговля в неспециализированных магазинах' }, { code: '47.19', desc: 'Прочая розничная торговля' }],
  'IT':        [{ code: '62.01', desc: 'Разработка компьютерного программного обеспечения' }, { code: '62.02', desc: 'Консультационные услуги в области ИТ' }],
  'ферма':     [{ code: '01.11', desc: 'Выращивание зерновых культур' }, { code: '01.41', desc: 'Разведение молочного крупного рогатого скота' }],
  'такси':     [{ code: '49.32', desc: 'Деятельность такси' }],
};

const TAX_REGIMES = [
  { id: 'simple-low',  label: 'Упрощённый · 4%',   desc: 'Для оборота до 1 млрд сум. Минимум отчётности.',     fit: 'recommended' as const },
  { id: 'simple-high', label: 'Упрощённый · 7.5%', desc: 'Для оборота от 1 до 10 млрд сум.',                   fit: 'ok' as const },
  { id: 'general',     label: 'Общий режим с НДС', desc: 'Обязательно при обороте от 10 млрд сум.',             fit: 'not-needed' as const },
];

export function QBizRegistration() {
  const [step, setStep] = useState(1);
  const [form, setForm]       = useState<LegalForm>('ltd');
  const [companyName, setName] = useState('Karimov Tekstil');
  const [nameCheck, setNameCheck] = useState<'idle' | 'checking' | 'ok' | 'taken'>('idle');
  const [activityInput, setActivity] = useState('');
  const [selectedOked, setOked] = useState<{ code: string; desc: string } | null>(null);
  const [taxRegime, setTax]     = useState('simple-high');
  const [submitted, setSubmitted] = useState(false);

  const okedSuggestions = activityInput.length > 2
    ? (Object.entries(OKED_SUGGESTIONS).find(([k]) => activityInput.toLowerCase().includes(k))?.[1] ?? [])
    : [];

  const checkName = (v: string) => {
    setName(v);
    if (v.length < 3) { setNameCheck('idle'); return; }
    setNameCheck('checking');
    setTimeout(() => setNameCheck(v.toLowerCase().includes('test') ? 'taken' : 'ok'), 450);
  };

  const nextDisabled =
    (step === 2 && (!companyName || nameCheck !== 'ok')) ||
    (step === 3 && !selectedOked);

  return (
    <section className="container-wide py-10 md:py-14 space-y-6">
      {/* Hero */}
      <Card padding="lg" tone="navy" className="text-white relative overflow-hidden">
        <div className="absolute inset-0 pattern-dots opacity-25 pointer-events-none" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-3">
            <ClipboardPlus className="h-5 w-5 text-gold-light" />
            <span className="text-xs uppercase tracking-wider text-gold-light font-semibold">Адаптация Singapore BizFile+ · Estonia e-Residency</span>
          </div>
          <h2 className="font-serif text-2xl md:text-3xl text-white mb-2 leading-tight">
            Регистрация бизнеса за 1 час — от идеи до свидетельства
          </h2>
          <p className="text-white/75 max-w-3xl text-sm">
            Пять шагов в одном мастере: выбор формы · проверка названия · ОКЭД с AI-подсказками ·
            расчёт налогового режима · подписание через ЭЦП. Параллельная постановка на учёт в Минюсте, Soliq и банках.
          </p>
        </div>
      </Card>

      {/* Stepper */}
      <div className="flex items-center gap-2 md:gap-3 overflow-x-auto">
        {[
          { n: 1, t: 'Форма бизнеса' },
          { n: 2, t: 'Название' },
          { n: 3, t: 'ОКЭД' },
          { n: 4, t: 'Налоговый режим' },
          { n: 5, t: 'Подписание' },
        ].map((s, i, arr) => {
          const done = submitted || step > s.n;
          const active = step === s.n && !submitted;
          return (
            <div key={s.n} className="flex items-center gap-2 md:gap-3 shrink-0">
              <div className={cn(
                'h-8 w-8 rounded-full flex items-center justify-center font-serif font-semibold text-sm transition-colors',
                done ? 'bg-success text-white' : active ? 'bg-gold text-white' : 'bg-bg-band text-ink-muted',
              )}>
                {done ? <CheckCircle2 className="h-4 w-4" /> : s.n}
              </div>
              <div className={cn('text-sm whitespace-nowrap', active ? 'text-ink font-semibold' : done ? 'text-ink' : 'text-ink-muted')}>
                {s.t}
              </div>
              {i < arr.length - 1 && <div className={cn('h-px w-6 md:w-12 shrink-0', done ? 'bg-success' : 'bg-ink-line')} />}
            </div>
          );
        })}
      </div>

      {/* Steps */}
      <AnimatePresence mode="wait">
        {!submitted ? (
          <motion.div key={step} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.22 }}>
            {step === 1 && (
              <Card padding="lg">
                <CardTitle className="mb-1">Шаг 1 · Выберите форму бизнеса</CardTitle>
                <CardDescription className="mb-5">Это определит налоговый режим и требования к отчётности.</CardDescription>
                <div className="grid md:grid-cols-2 gap-3">
                  {FORMS.map((f) => {
                    const active = form === f.id;
                    return (
                      <button
                        key={f.id}
                        onClick={() => setForm(f.id)}
                        className={cn(
                          'text-left p-4 rounded-xl border transition-all',
                          active ? 'border-gold bg-gold-soft/40 shadow-sm' : 'border-ink-line bg-bg-white hover:border-gold/50',
                        )}
                      >
                        <div className="flex items-start gap-3">
                          <div className={cn('h-11 w-11 rounded-lg flex items-center justify-center shrink-0', active ? 'bg-gold text-white' : 'bg-gold/10 text-gold')}>
                            <f.Icon className="h-5 w-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-serif text-[15px] text-ink">{f.title}</div>
                            <div className="text-xs text-ink-muted leading-snug mt-1">{f.sub}</div>
                            <div className="mt-2 flex gap-2 text-[11px]">
                              <span className="text-ink-muted"><Clock className="inline h-3 w-3 -mt-0.5" /> {f.time}</span>
                              <span className="text-gold font-medium">· {f.fee}</span>
                            </div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </Card>
            )}

            {step === 2 && (
              <Card padding="lg">
                <CardTitle className="mb-1">Шаг 2 · Название компании</CardTitle>
                <CardDescription className="mb-5">Проверяем уникальность в реестре Минюста в реальном времени.</CardDescription>
                <div className="max-w-xl">
                  <label className="text-xs text-ink-muted uppercase tracking-wider font-semibold">Название (без ООО/ИП)</label>
                  <div className="relative mt-1.5">
                    <input
                      value={companyName}
                      onChange={(e) => checkName(e.target.value)}
                      className={cn(
                        'w-full h-12 px-4 pr-10 rounded-lg border bg-bg-white text-[15px] focus:outline-none focus:ring-1 transition-colors',
                        nameCheck === 'ok'     ? 'border-success focus:border-success focus:ring-success/30' :
                        nameCheck === 'taken'  ? 'border-danger focus:border-danger focus:ring-danger/30' :
                                                 'border-ink-line focus:border-gold focus:ring-gold/30',
                      )}
                      placeholder="Введите название"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      {nameCheck === 'checking' && <Loader2 className="h-4 w-4 animate-spin text-ink-muted" />}
                      {nameCheck === 'ok'       && <CheckCircle2 className="h-5 w-5 text-success" />}
                      {nameCheck === 'taken'    && <span className="text-xs text-danger font-semibold">занято</span>}
                    </div>
                  </div>
                  <div className="mt-2 text-sm">
                    {nameCheck === 'ok'    && <span className="text-success">✓ Название свободно — можно регистрировать</span>}
                    {nameCheck === 'taken' && <span className="text-danger">Это название уже зарегистрировано. Попробуйте другое.</span>}
                    {nameCheck === 'idle'  && <span className="text-ink-muted">Введите минимум 3 символа</span>}
                  </div>

                  <div className="mt-6 p-3 rounded-lg bg-bg-band/50 border border-ink-line text-xs text-ink-muted">
                    <strong className="text-ink">Предпросмотр полного наименования:</strong>
                    <div className="font-serif text-ink text-[15px] mt-1">
                      {form === 'ip'          && `ИП Каримов А.Р. · «${companyName || '…'}»`}
                      {form === 'ltd'         && `ООО «${companyName || '…'}»`}
                      {form === 'family'      && `Семейное предприятие «${companyName || '…'}»`}
                      {form === 'cooperative' && `Кооператив «${companyName || '…'}»`}
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {step === 3 && (
              <Card padding="lg">
                <CardTitle className="mb-1">Шаг 3 · Виды деятельности (ОКЭД)</CardTitle>
                <CardDescription className="mb-5">Опишите что будете делать — AI предложит подходящие коды.</CardDescription>
                <div className="max-w-xl">
                  <label className="text-xs text-ink-muted uppercase tracking-wider font-semibold">Чем будет заниматься бизнес?</label>
                  <div className="relative mt-1.5">
                    <Search className="h-4 w-4 text-ink-muted absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      value={activityInput}
                      onChange={(e) => setActivity(e.target.value)}
                      placeholder='Например: «открываю кафе», «IT-разработка», «магазин одежды»'
                      className="w-full pl-9 pr-4 h-12 rounded-lg border border-ink-line bg-bg-white text-sm focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/30"
                    />
                  </div>

                  {okedSuggestions.length > 0 && (
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center gap-2 text-xs text-gold font-semibold uppercase tracking-wider">
                        <Sparkles className="h-3.5 w-3.5" /> AI-предложения
                      </div>
                      {okedSuggestions.map((o) => (
                        <button
                          key={o.code}
                          onClick={() => setOked(o)}
                          className={cn(
                            'w-full text-left p-3 rounded-lg border transition-colors flex items-start gap-3',
                            selectedOked?.code === o.code ? 'border-gold bg-gold-soft/40' : 'border-ink-line hover:border-gold/40',
                          )}
                        >
                          <span className="font-mono text-xs text-gold font-semibold shrink-0">{o.code}</span>
                          <span className="text-sm text-ink">{o.desc}</span>
                          {selectedOked?.code === o.code && <CheckCircle2 className="h-4 w-4 text-success ml-auto shrink-0" />}
                        </button>
                      ))}
                    </div>
                  )}

                  {activityInput.length > 2 && okedSuggestions.length === 0 && (
                    <div className="mt-4 text-sm text-ink-muted">Подсказок не найдено. Попробуйте: «кафе», «магазин», «IT», «ферма», «такси».</div>
                  )}
                </div>
              </Card>
            )}

            {step === 4 && (
              <Card padding="lg">
                <CardTitle className="mb-1">Шаг 4 · Налоговый режим</CardTitle>
                <CardDescription className="mb-5">Калькулятор на основе прогноза выручки.</CardDescription>
                <div className="max-w-2xl">
                  <div className="p-3 rounded-lg bg-bg-band/50 border border-ink-line mb-5 flex items-center gap-3">
                    <Calculator className="h-5 w-5 text-gold" />
                    <div className="text-sm text-ink">
                      <strong>Прогноз выручки в год 1:</strong> 480 млн сум ·
                      <span className="ml-1 text-ink-muted">(по AI-оценке для вашего ОКЭД)</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {TAX_REGIMES.map((r) => {
                      const active = taxRegime === r.id;
                      return (
                        <button
                          key={r.id}
                          onClick={() => setTax(r.id)}
                          className={cn(
                            'w-full text-left p-3.5 rounded-lg border transition-all',
                            active ? 'border-gold bg-gold-soft/40 shadow-sm' : 'border-ink-line bg-bg-white hover:border-gold/40',
                          )}
                        >
                          <div className="flex items-center justify-between gap-3">
                            <div className="min-w-0">
                              <div className="flex items-center gap-2 mb-0.5">
                                <div className="font-serif text-[15px] text-ink">{r.label}</div>
                                {r.fit === 'recommended' && <Badge variant="success">рекомендуется</Badge>}
                                {r.fit === 'not-needed'  && <Badge variant="outline">не нужен пока</Badge>}
                              </div>
                              <div className="text-xs text-ink-muted">{r.desc}</div>
                            </div>
                            {active && <CheckCircle2 className="h-5 w-5 text-gold shrink-0" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </Card>
            )}

            {step === 5 && (
              <Card padding="lg">
                <CardTitle className="mb-1">Шаг 5 · Подписание и параллельная регистрация</CardTitle>
                <CardDescription className="mb-5">Одна подпись ЭЦП — заявка уходит сразу в 3 ведомства.</CardDescription>
                <div className="max-w-2xl grid gap-3">
                  <SummaryRow label="Форма"    value={FORMS.find((f) => f.id === form)?.title ?? ''} />
                  <SummaryRow label="Название" value={`${form === 'ltd' ? 'ООО «' : ''}${companyName}${form === 'ltd' ? '»' : ''}`} />
                  <SummaryRow label="ОКЭД"     value={selectedOked ? `${selectedOked.code} · ${selectedOked.desc}` : '—'} />
                  <SummaryRow label="Налоговый режим" value={TAX_REGIMES.find((r) => r.id === taxRegime)?.label ?? ''} />

                  <div className="mt-3 p-4 rounded-lg bg-gold-soft/40 border border-gold/30">
                    <div className="text-xs uppercase tracking-wider text-gold font-semibold mb-2">Параллельная постановка на учёт</div>
                    <div className="space-y-1.5 text-sm">
                      {['Минюст · государственная регистрация', 'Soliq · налоговый учёт', 'ЦБ РУз · открытие расчётного счёта'].map((a) => (
                        <div key={a} className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-success" /> {a}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            )}
          </motion.div>
        ) : (
          <motion.div key="done" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            {/* Hero success */}
            <Card padding="lg" tone="gold" className="text-white">
              <div className="flex items-center gap-4 flex-wrap">
                <div className="h-14 w-14 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="h-7 w-7" />
                </div>
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-white">Готово — ваши данные подготовлены</CardTitle>
                  <CardDescription className="text-white/85 mt-1">
                    Форма собственности, название, ОКЭД и налоговый режим собраны и готовы к передаче в Минюст.
                    Дальнейшая регистрация происходит на <strong>birdarcha.uz</strong> — едином портале госуслуг Минюста.
                  </CardDescription>
                </div>
              </div>
            </Card>

            {/* Explanation of the split */}
            <Card padding="lg" className="border-secondary/25 bg-secondary/5">
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 text-secondary shrink-0 mt-0.5" />
                <div className="text-sm text-ink-soft leading-relaxed">
                  <strong className="text-ink">Почему редирект на birdarcha.uz?</strong>
                  <br />
                  birdarcha.uz — официальный портал Минюста для регистрации юридических лиц и ИП.
                  Платформа не дублирует эту функциональность, а готовит данные и передаёт их через OneID без повторного ввода.
                  После завершения регистрации статус (свидетельство, ИНН, реквизиты счёта) вернётся в ваш личный кабинет.
                </div>
              </div>
            </Card>

            {/* Summary + CTA */}
            <Card padding="lg">
              <CardTitle className="mb-4 text-[16px]">Проверьте данные перед передачей</CardTitle>
              <div className="space-y-2 mb-5">
                <SummaryRow label="Форма" value={FORMS.find((f) => f.id === form)?.title ?? ''} />
                <SummaryRow label="Название" value={companyName} />
                <SummaryRow label="ОКЭД" value={selectedOked ? `${selectedOked.code} · ${selectedOked.desc}` : '—'} />
                <SummaryRow label="Налоговый режим" value={TAX_REGIMES.find((t) => t.id === taxRegime)?.label ?? ''} />
              </div>

              <div className="pt-5 border-t border-ink-line space-y-3">
                <div className="flex items-center gap-2 text-[12px] text-ink-muted">
                  <ShieldCheck className="h-3.5 w-3.5 text-success" />
                  <span>Ваша OneID-сессия будет использована для автозаполнения — без повторного ввода данных.</span>
                </div>
                <a
                  href="https://birdarcha.uz"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 h-11 px-5 rounded-xl bg-gold hover:bg-gold-dark text-white font-semibold transition-all w-full justify-center"
                >
                  Перейти на birdarcha.uz для регистрации
                  <ExternalLink className="h-4 w-4" />
                </a>
                <div className="text-[11px] text-ink-muted text-center">
                  Статус регистрации появится в вашем личном кабинете после завершения в Минюсте
                </div>
              </div>
            </Card>

            {/* What happens next */}
            <Card padding="lg">
              <CardTitle className="text-[15px] mb-3">Что произойдёт после нажатия кнопки</CardTitle>
              <div className="space-y-2">
                <StepNote num={1} text="Откроется birdarcha.uz с предзаполненной формой по данным из вашей OneID-сессии" />
                <StepNote num={2} text="Проверьте и подпишите ЭЦП через E-Imzo или SMS-OTP" />
                <StepNote num={3} text="Минюст обработает заявку (регламент 30 минут для ИП, 1 час для ООО)" />
                <StepNote num={4} text="Свидетельство, ИНН и реквизиты счёта вернутся в ваш личный кабинет на Платформе" />
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation */}
      {!submitted && (
        <div className="flex justify-between">
          <Button size="md" variant="ghost" disabled={step === 1} onClick={() => setStep((s) => Math.max(1, s - 1))} leftIcon={<ArrowLeft className="h-4 w-4" />}>
            Назад
          </Button>
          {step < 5 ? (
            <Button size="md" onClick={() => setStep((s) => s + 1)} disabled={nextDisabled} rightIcon={<ArrowRight className="h-4 w-4" />}>
              Далее
            </Button>
          ) : (
            <Button size="md" onClick={() => setSubmitted(true)} rightIcon={<ArrowRight className="h-4 w-4" />}>
              Готово · подготовить для birdarcha.uz
            </Button>
          )}
        </div>
      )}

      {/* Footer */}
      <Card padding="lg" className="border-gold/25 bg-gold-soft/30">
        <div className="flex items-start gap-4">
          <div className="h-10 w-10 rounded-lg bg-gold/15 text-gold flex items-center justify-center shrink-0">
            <Sparkles className="h-5 w-5" />
          </div>
          <div className="text-sm text-ink">
            <strong className="font-semibold">Принцип «единое окно»: </strong>
            Платформа собирает данные и показывает сравнение форм/режимов, но не дублирует официальную регистрацию.
            Регистрация происходит на <strong>birdarcha.uz</strong> (Минюст), токен передаётся через OneID без повторного ввода.
            Это соответствует выбранной архитектуре — Платформа не подменяет существующие системы.
          </div>
        </div>
      </Card>
    </section>
  );
}

function StepNote({ num, text }: { num: number; text: string }) {
  return (
    <div className="flex items-start gap-3 p-2.5 rounded-lg bg-bg-band/40">
      <div className="h-6 w-6 rounded-full bg-gold/15 text-gold flex items-center justify-center shrink-0 font-serif font-bold text-xs">
        {num}
      </div>
      <div className="text-[13px] text-ink-soft leading-relaxed">{text}</div>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 p-2.5 rounded-lg bg-bg-band/40 border border-ink-line">
      <div className="text-xs uppercase tracking-wider text-ink-muted font-semibold w-40 shrink-0">{label}</div>
      <div className="text-sm text-ink font-medium flex-1">{value}</div>
    </div>
  );
}
