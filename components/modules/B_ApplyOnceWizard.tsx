'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2, FileCheck2, Upload, Sparkles, Calendar, ArrowLeft, ArrowRight,
  FileText, Shield, User, Building2, Wallet,
} from 'lucide-react';
import { ProgressSteps } from '@/components/ui/ProgressSteps';
import { Button } from '@/components/ui/Button';
import { Card, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { cn } from '@/lib/cn';
import type { Measure } from '@/lib/types';

interface Props {
  measure?: Measure;
  onClose: () => void;
}

const STEPS = [
  { id: 's1', label: 'Данные', description: 'Автозаполнение из реестров' },
  { id: 's2', label: 'Документы', description: '3 + 2 оп.' },
  { id: 's3', label: 'Параметры', description: 'Сумма и цель' },
  { id: 's4', label: 'Подписание', description: 'ЭЦП' },
];

export function B_ApplyOnceWizard({ measure, onClose }: Props) {
  const [current, setCurrent] = useState(0);
  const [done, setDone] = useState(false);
  const [applicationId] = useState('YARP-MZR-2026-' + String(Math.floor(Math.random() * 9000) + 1000));

  const next = () => {
    if (current === STEPS.length - 1) {
      setDone(true);
    } else {
      setCurrent((c) => c + 1);
    }
  };
  const back = () => setCurrent((c) => Math.max(0, c - 1));

  if (done) return <SuccessScreen id={applicationId} onClose={onClose} />;

  return (
    <div className="space-y-6">
      {/* Steps header */}
      <div className="surface-card p-5 md:p-6">
        <ProgressSteps steps={STEPS} current={current} />
      </div>

      {/* Measure context */}
      {measure && (
        <div className="surface-card p-4 bg-gold-soft/40 border-gold/20 flex items-center gap-3">
          <Sparkles className="h-5 w-5 text-gold shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="text-xs uppercase tracking-wide text-ink-muted font-medium">Мера поддержки</div>
            <div className="font-serif font-semibold text-ink text-[15px] truncate">{measure.titleKey}</div>
          </div>
          <Badge variant="success">{measure.okCount}/{measure.totalCount} критериев</Badge>
        </div>
      )}

      {/* Step content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -12 }}
          transition={{ duration: 0.25 }}
        >
          {current === 0 && <Step1_Profile />}
          {current === 1 && <Step2_Documents />}
          {current === 2 && <Step3_Parameters />}
          {current === 3 && <Step4_Sign measure={measure} />}
        </motion.div>
      </AnimatePresence>

      {/* Nav */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={current === 0 ? onClose : back}
          leftIcon={<ArrowLeft className="h-4 w-4" />}
        >
          {current === 0 ? 'Отмена' : 'Назад'}
        </Button>
        <Button
          onClick={next}
          rightIcon={<ArrowRight className="h-4 w-4" />}
        >
          {current === STEPS.length - 1 ? 'Подписать и отправить' : 'Далее'}
        </Button>
      </div>
    </div>
  );
}

// ─── Step 1 ──────────────────────────────────────────────────
function Step1_Profile() {
  const fields = [
    { label: 'Наименование', value: 'ООО «Алишер Текстиль»', from: 'Минюст · через OneID' },
    { label: 'ИНН', value: '301 234 567', from: 'ГНК' },
    { label: 'ОКЭД', value: '13.10 — Прядение текстильных волокон', from: 'Минюст' },
    { label: 'Регион', value: 'г. Ташкент, Яшнабадский район', from: 'ГНК' },
    { label: 'Дата регистрации', value: '03.11.2019', from: 'Минюст' },
    { label: 'Количество сотрудников', value: '47 человек', from: 'Soliq · ФСС' },
    { label: 'Выручка за 2024', value: '4.2 млрд сум', from: 'Soliq' },
    { label: 'Налоговая задолженность', value: 'Нет', from: 'ГНК' },
  ];
  return (
    <Card>
      <div className="flex items-center gap-3 mb-5">
        <div className="h-10 w-10 rounded-xl bg-gold/10 text-gold flex items-center justify-center">
          <User className="h-5 w-5" />
        </div>
        <div>
          <CardTitle>Подтвердите данные бизнеса</CardTitle>
          <p className="text-sm text-ink-muted mt-0.5">Все поля заполнены автоматически из интегрированных систем</p>
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-x-8 gap-y-4">
        {fields.map((f) => (
          <div key={f.label}>
            <div className="text-xs uppercase tracking-wide text-ink-muted font-medium mb-1">{f.label}</div>
            <div className="flex items-start gap-2">
              <div className="font-medium text-ink flex-1">{f.value}</div>
              <Badge variant="success" className="shrink-0 !text-[10px]">
                <Sparkles className="h-2.5 w-2.5" />
                {f.from}
              </Badge>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 pt-5 border-t border-ink-line text-sm text-ink-muted">
        Если данные неточны — обновите их через соответствующие системы; в Платформе они подтянутся автоматически.
      </div>
    </Card>
  );
}

// ─── Step 2 ──────────────────────────────────────────────────
function Step2_Documents() {
  const required = [
    { id: 'd1', name: 'Свидетельство о регистрации', status: 'uploaded' },
    { id: 'd2', name: 'Бизнес-план', status: 'pending' },
    { id: 'd3', name: 'Финансовая отчётность за 2 года', status: 'pending' },
  ];
  const optional = [
    { id: 'd4', name: 'Сертификаты качества (опционально)', status: 'pending' },
    { id: 'd5', name: 'Рекомендации партнёров (опционально)', status: 'pending' },
  ];
  return (
    <Card>
      <div className="flex items-center gap-3 mb-5">
        <div className="h-10 w-10 rounded-xl bg-gold/10 text-gold flex items-center justify-center">
          <FileText className="h-5 w-5" />
        </div>
        <div>
          <CardTitle>Загрузите документы</CardTitle>
          <p className="text-sm text-ink-muted mt-0.5">3 обязательных и 2 опциональных документа</p>
        </div>
      </div>
      <div className="space-y-3">
        <div className="text-xs uppercase tracking-wide text-ink-muted font-medium">Обязательные</div>
        {required.map((d) => <DocRow key={d.id} name={d.name} uploaded={d.status === 'uploaded'} required />)}
        <div className="pt-4 text-xs uppercase tracking-wide text-ink-muted font-medium">Дополнительные</div>
        {optional.map((d) => <DocRow key={d.id} name={d.name} uploaded={false} required={false} />)}
      </div>
    </Card>
  );
}

function DocRow({ name, uploaded, required }: { name: string; uploaded: boolean; required: boolean }) {
  return (
    <div className={cn(
      'flex items-center gap-4 px-4 py-3 rounded-lg border transition-colors',
      uploaded ? 'bg-success/5 border-success/30' : 'bg-bg border-dashed border-ink-line hover:bg-bg-band',
    )}>
      <div className={cn(
        'h-9 w-9 rounded-lg flex items-center justify-center shrink-0',
        uploaded ? 'bg-success text-white' : 'bg-bg-band text-ink-muted',
      )}>
        {uploaded ? <CheckCircle2 className="h-5 w-5" /> : <Upload className="h-4 w-4" />}
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-medium text-ink text-[14px] leading-tight">{name}</div>
        <div className="text-xs text-ink-muted mt-0.5">
          {uploaded ? 'Загружен 12 апр 2026 · 2.4 MB' : required ? 'Обязательный документ' : 'Не обязательно'}
        </div>
      </div>
      <Button size="sm" variant={uploaded ? 'ghost' : 'secondary'}>
        {uploaded ? 'Заменить' : 'Загрузить'}
      </Button>
    </div>
  );
}

// ─── Step 3 ──────────────────────────────────────────────────
function Step3_Parameters() {
  return (
    <Card>
      <div className="flex items-center gap-3 mb-5">
        <div className="h-10 w-10 rounded-xl bg-gold/10 text-gold flex items-center justify-center">
          <Wallet className="h-5 w-5" />
        </div>
        <div>
          <CardTitle>Параметры заявки</CardTitle>
          <p className="text-sm text-ink-muted mt-0.5">Укажите сумму, срок и цель использования средств</p>
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <Input label="Запрашиваемая сумма" placeholder="400" rightAddon="млн сум" defaultValue="400" />
        <Input label="Срок" placeholder="2" rightAddon="года" defaultValue="2" />
      </div>
      <div className="mt-4">
        <Textarea
          label="Цель использования средств"
          rows={4}
          defaultValue="Приобретение прядильного оборудования Rieter G38 для расширения производственных мощностей и выхода на экспортный рынок Турции и Казахстана. План: рост выручки на 40% в течение 18 месяцев, создание 15 новых рабочих мест."
        />
      </div>
      <div className="mt-5 p-4 rounded-lg bg-secondary/5 border border-secondary/20 flex gap-3">
        <Sparkles className="h-4 w-4 text-secondary shrink-0 mt-0.5" />
        <div className="text-sm text-ink">
          <div className="font-medium mb-1">Подсказка AI-ассистента</div>
          <div className="text-ink-muted">При указании суммы 400 млн сум вероятность одобрения — <span className="text-success font-medium">87%</span> на основе похожих заявок. Если сумма превысит 500 млн сум, потребуется дополнительное обоснование.</div>
        </div>
      </div>
    </Card>
  );
}

// ─── Step 4 ──────────────────────────────────────────────────
function Step4_Sign({ measure }: { measure?: Measure }) {
  return (
    <Card>
      <div className="flex items-center gap-3 mb-5">
        <div className="h-10 w-10 rounded-xl bg-gold/10 text-gold flex items-center justify-center">
          <Shield className="h-5 w-5" />
        </div>
        <div>
          <CardTitle>Подтверждение и ЭЦП</CardTitle>
          <p className="text-sm text-ink-muted mt-0.5">Проверьте данные и подпишите заявку электронной подписью</p>
        </div>
      </div>
      <div className="rounded-xl bg-bg-band p-5 space-y-3 text-sm">
        <Row label="Мера поддержки" value={measure?.titleKey || 'Субсидия на промышленное оборудование'} />
        <Row label="Заявитель" value="ООО «Алишер Текстиль»" />
        <Row label="Запрошено" value="400 млн сум, 2 года" />
        <Row label="Документы" value="5 файлов (3 обязательных + 2 опциональных)" />
        <Row label="Агентство" value={measure?.agency || 'МЭФ'} />
      </div>
      <div className="mt-5 p-4 rounded-lg border border-gold/30 bg-gold-soft/40 flex items-start gap-3">
        <Building2 className="h-5 w-5 text-gold shrink-0 mt-0.5" />
        <div>
          <div className="font-medium text-ink">ЭЦП «e-IMZO»</div>
          <p className="text-sm text-ink-muted mt-1">При нажатии «Подписать и отправить» откроется окно e-IMZO для подписания заявки.</p>
        </div>
      </div>
    </Card>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start gap-4">
      <div className="w-36 shrink-0 text-ink-muted">{label}</div>
      <div className="flex-1 font-medium text-ink">{value}</div>
    </div>
  );
}

// ─── Success ──────────────────────────────────────────────────
function SuccessScreen({ id, onClose }: { id: string; onClose: () => void }) {
  const tracker = [
    { label: 'Заявка принята', done: true, date: 'Только что' },
    { label: 'Первичная проверка', done: false, date: 'В течение 1 рабочего дня' },
    { label: 'Отраслевая экспертиза', done: false, date: '3–7 рабочих дней' },
    { label: 'Решение комиссии', done: false, date: '10–20 рабочих дней' },
    { label: 'Перечисление средств', done: false, date: 'при одобрении' },
  ];
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <Card tone="default" padding="lg" className="border-success/30 bg-success/5">
        <div className="flex items-start gap-4">
          <div className="h-14 w-14 rounded-full bg-success text-white flex items-center justify-center shrink-0">
            <CheckCircle2 className="h-7 w-7" />
          </div>
          <div className="flex-1 min-w-0">
            <CardTitle className="text-2xl">Заявка успешно отправлена</CardTitle>
            <p className="text-ink-muted mt-1">
              Номер заявки: <span className="font-mono font-semibold text-ink">{id}</span>
            </p>
            <p className="text-sm text-ink-muted mt-2">
              Уведомления о каждом изменении статуса будут приходить на ваш email и в личный кабинет.
            </p>
          </div>
        </div>
      </Card>

      <Card className="mt-4">
        <div className="flex items-center gap-2 mb-5">
          <FileCheck2 className="h-5 w-5 text-gold" />
          <CardTitle>Этапы рассмотрения</CardTitle>
        </div>
        <div className="space-y-3">
          {tracker.map((t, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className={cn(
                'h-8 w-8 rounded-full flex items-center justify-center text-sm font-semibold shrink-0',
                t.done ? 'bg-success text-white' : 'bg-bg-band text-ink-muted',
              )}>
                {t.done ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
              </div>
              <div className="flex-1 min-w-0">
                <div className={cn('font-medium', t.done ? 'text-ink' : 'text-ink-muted')}>{t.label}</div>
                <div className="text-xs text-ink-muted mt-0.5 flex items-center gap-1.5">
                  <Calendar className="h-3 w-3" />
                  {t.date}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <div className="mt-6 flex justify-end">
        <Button onClick={onClose}>Вернуться к реестру</Button>
      </div>
    </motion.div>
  );
}
