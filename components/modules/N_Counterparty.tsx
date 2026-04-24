'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Search, ShieldCheck, AlertTriangle, CheckCircle2, XCircle, Clock, FileText,
  Building, Gavel, Coins, Users, MapPin, Sparkles, ExternalLink,
  Radar, TrendingUp, History, Filter, RefreshCw,
} from 'lucide-react';
import { Card, CardTitle, CardDescription } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { PhaseRoadmapStrip } from '@/components/sections/PhaseRoadmapStrip';

interface CheckResult {
  verdict: 'ok' | 'warn' | 'risk';
  label: string;
  detail: string;
}

const DEMO_RESULTS: Record<string, CheckResult> = {
  reg:         { verdict: 'ok',   label: 'Регистрация',          detail: 'Зарегистрировано в Минюсте 14.03.2019 · действующее' },
  address:     { verdict: 'ok',   label: 'Юридический адрес',    detail: 'Не адрес массовой регистрации · 1 компания' },
  tax:         { verdict: 'warn', label: 'Налоговая история',    detail: 'Задолженность 1.2 млн сум, возникла 12.03.2026' },
  msp:         { verdict: 'ok',   label: 'Реестр МСБ',           detail: 'В реестре с 2019, категория «среднее»' },
  court:       { verdict: 'ok',   label: 'Судебные дела',        detail: '0 открытых дел · 2 завершённых (хозяйственные)' },
  disqual:     { verdict: 'ok',   label: 'Дисквалификация',      detail: 'Руководители не дисквалифицированы' },
  sanction:    { verdict: 'ok',   label: 'Санкции и чёрные списки', detail: 'Не находится в списках' },
  customs:     { verdict: 'ok',   label: 'Таможенные нарушения', detail: '0 правонарушений · 34 декларации за 12 мес' },
  bankruptcy:  { verdict: 'ok',   label: 'Банкротство',          detail: 'Производство не возбуждалось' },
  procurement: { verdict: 'ok',   label: 'Госзакупки',           detail: '8 контрактов · 4.2 млрд сум · исполнено 100%' },
};

const RECENT_CHECKS = [
  { inn: '301234567', name: 'ООО «Karimov Tekstil»',     checked: '2 часа назад', risk: 'low' as const },
  { inn: '302857114', name: 'ООО «Zarafshan Agro»',       checked: 'вчера',        risk: 'low' as const },
  { inn: '305991407', name: 'Агрокластер «Oltin Vodiy»', checked: '3 дня назад',  risk: 'medium' as const },
];

export function N_Counterparty() {
  const [query, setQuery] = useState('');
  const [shown, setShown] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setShown(true);
  };

  return (
    <section className="container-wide py-10 md:py-14 space-y-8">
      {/* ─── Search hero ─── */}
      <Card padding="lg" tone="navy" className="text-white relative overflow-hidden">
        <div className="absolute inset-0 pattern-dots opacity-30 pointer-events-none" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-3">
            <Badge variant="new">NEW</Badge>
            <span className="text-xs uppercase tracking-wider text-gold-light">Адаптация мсп.рф · ФНС-модель</span>
          </div>
          <h2 className="font-serif text-2xl md:text-3xl text-white mb-2">Проверьте контрагента за секунды</h2>
          <p className="text-white/75 max-w-2xl text-sm mb-6">
            Бесплатно, без ограничений по запросам. Источники: Минюст (Adliya*), Soliq (GNK*),
            ГТК, реестр дисквалифицированных лиц, судебная статистика, реестр госзакупок.
          </p>

          <form onSubmit={handleSearch} className="flex gap-2 max-w-2xl">
            <div className="flex-1 relative">
              <Search className="h-5 w-5 text-white/60 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Введите ИНН, ПИНФЛ или название юрлица…"
                className="w-full pl-12 pr-4 h-12 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:border-gold focus:bg-white/15"
              />
            </div>
            <Button type="submit" size="lg">Проверить</Button>
          </form>

          <div className="mt-4 text-xs text-white/55 flex flex-wrap gap-4">
            <button onClick={() => { setQuery('301234567'); setShown(true); }} className="hover:text-gold-light">
              → 301234567 · ООО «Karimov Tekstil»
            </button>
            <span>·</span>
            <button onClick={() => { setQuery('305991407'); setShown(true); }} className="hover:text-gold-light">
              → 305991407 · Агрокластер «Oltin Vodiy»
            </button>
          </div>
        </div>
      </Card>

      <PhaseRoadmapStrip
        embedded
        currentPhase={2}
        points={[
          // Фаза 1 — до 01.07.2026
          { phase: 2, text: 'Проверка контрагента по ИНН: регистрация, адрес, реестр МСБ' },
          { phase: 2, text: 'Интегрированный рейтинг надёжности с открытой методологией' },
          { phase: 2, text: 'История проверок в личном кабинете (последние 20)' },
          // Фаза 2 — 2-я половина 2026
          { phase: 2, text: 'Подбор поставщиков по ОКЭД и радиусу' },
          // Фаза 3 — 2027
          { phase: 3, text: 'Интеграция с Soliq (данные формы 1, 2), ГТК, судебной системой', blockedBy: 'согласование с Минюстом/Soliq по составу открытых полей' },
          { phase: 3, text: 'Проверка дисквалификации руководителей и санкционных списков' },
          // Фаза 4 — 2028+
          { phase: 4, text: 'API для банков и государственных тендеров — автопроверка контрагентов' },
        ]}
      />

      {/* ─── Result card (shown after search) ─── */}
      {shown && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
          <Card padding="lg">
            <div className="flex items-start justify-between flex-wrap gap-3 mb-4 pb-4 border-b border-ink-line">
              <div>
                <div className="text-xs text-ink-muted font-mono">ИНН {query || '301234567'}</div>
                <CardTitle className="mt-1">ООО «Karimov Tekstil»</CardTitle>
                <CardDescription className="mt-0.5">
                  Производство текстильной продукции · г. Ташкент, Яшнабадский р-н ·
                  зарегистрировано 14.03.2019
                </CardDescription>
              </div>
              <div className="text-right">
                <Badge variant="warning">1 предупреждение</Badge>
                <div className="text-xs text-ink-muted mt-2">По 10 из 10 параметров</div>
              </div>
            </div>

            {/* Grid of checks */}
            <div className="grid md:grid-cols-2 gap-2">
              {Object.entries(DEMO_RESULTS).map(([key, r]) => (
                <CheckRow key={key} result={r} />
              ))}
            </div>

            <div className="mt-6 pt-5 border-t border-ink-line grid md:grid-cols-3 gap-3">
              <div className="p-3 rounded-lg bg-bg-band/40">
                <div className="flex items-center gap-2 mb-1">
                  <Users className="h-4 w-4 text-gold" />
                  <div className="text-sm font-medium text-ink">Руководство</div>
                </div>
                <div className="text-xs text-ink-muted">Каримов А. К. · директор с 2019</div>
                <div className="text-xs text-ink-muted">Юлдашева М. · главный бухгалтер</div>
              </div>
              <div className="p-3 rounded-lg bg-bg-band/40">
                <div className="flex items-center gap-2 mb-1">
                  <Coins className="h-4 w-4 text-gold" />
                  <div className="text-sm font-medium text-ink">Финансовые показатели</div>
                </div>
                <div className="text-xs text-ink-muted">Выручка 2025: 8.4 млрд сум</div>
                <div className="text-xs text-ink-muted">Налогов уплачено: 410 млн сум</div>
              </div>
              <div className="p-3 rounded-lg bg-bg-band/40">
                <div className="flex items-center gap-2 mb-1">
                  <Building className="h-4 w-4 text-gold" />
                  <div className="text-sm font-medium text-ink">Размер бизнеса</div>
                </div>
                <div className="text-xs text-ink-muted">42 сотрудника · категория «среднее»</div>
                <div className="text-xs text-ink-muted">В реестре МСБ с 2019</div>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              <Button size="sm" leftIcon={<FileText className="h-4 w-4" />}>Скачать PDF</Button>
              <Button size="sm" variant="ghost" leftIcon={<ExternalLink className="h-4 w-4" />}>Открыть в Минюсте</Button>
              <Button size="sm" variant="ghost">Добавить в избранное</Button>
            </div>
          </Card>
        </motion.div>
      )}

      {/* ─── Sources + Recent ─── */}
      <div className="grid lg:grid-cols-[2fr_1fr] gap-5">
        <Card padding="lg">
          <div className="flex items-center gap-2 mb-4">
            <ShieldCheck className="h-5 w-5 text-gold" />
            <CardTitle className="text-[16px]">По 10 параметрам · из государственных источников</CardTitle>
          </div>
          <div className="grid md:grid-cols-2 gap-2">
            {[
              { src: 'Минюст (Adliya*)',           what: 'Реестр юрлиц и ИП, статус, адрес, учредители' },
              { src: 'Soliq (GNK*)',               what: 'Налоговая задолженность, реестр плательщиков МСБ' },
              { src: 'ГТК',                        what: 'Таможенные декларации и нарушения' },
              { src: 'Суды',                       what: 'Открытые и завершённые дела' },
              { src: 'Реестр дисквалификации',     what: 'Запреты руководителям на должности' },
              { src: 'Реестр адресов',             what: 'Массовая регистрация по юр.адресу' },
              { src: 'Госзакупки · xarid.uz',      what: 'Контракты, исполнение, штрафы' },
              { src: 'Санкционные списки',         what: 'Международные и национальные ограничения' },
              { src: 'Единый реестр МСБ',          what: 'Категория · дата включения · статус' },
              { src: 'Банкротство',                what: 'История производств по банкротству' },
            ].map((s) => (
              <div key={s.src} className="flex items-start gap-2 p-2.5 rounded-lg bg-bg-band/40">
                <div className="h-1.5 w-1.5 rounded-full bg-gold mt-1.5 shrink-0" />
                <div>
                  <div className="text-[13px] font-medium text-ink">{s.src}</div>
                  <div className="text-[11.5px] text-ink-muted">{s.what}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card padding="lg">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="h-5 w-5 text-gold" />
            <CardTitle className="text-[16px]">Недавние проверки</CardTitle>
          </div>
          <div className="space-y-2">
            {RECENT_CHECKS.map((c) => (
              <div key={c.inn} className="p-3 rounded-lg border border-ink-line hover:border-gold/40 cursor-pointer transition-colors">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-xs font-mono text-ink-muted">{c.inn}</span>
                  <Badge variant={c.risk === 'low' ? 'success' : 'warning'}>
                    {c.risk === 'low' ? 'низкий риск' : 'средний риск'}
                  </Badge>
                </div>
                <div className="text-sm text-ink leading-snug">{c.name}</div>
                <div className="text-xs text-ink-muted mt-1">{c.checked}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* ─── Sprint 8 · Supplier matching (Safoev's idea) ─── */}
      <Card padding="lg">
        <div className="flex items-start gap-3 mb-5">
          <div className="h-11 w-11 rounded-xl bg-secondary/15 text-secondary flex items-center justify-center shrink-0">
            <Radar className="h-5 w-5" />
          </div>
          <div>
            <CardTitle>Подбор поставщиков по профилю</CardTitle>
            <CardDescription className="mt-0.5">
              Найдите действующих поставщиков в вашем регионе по ОКЭД и радиусу:
              используем реестр МСБ + геоданные, чтобы МСБ могли быстро находить локальных партнёров по цепочке поставок.
            </CardDescription>
          </div>
        </div>

        {/* Search form */}
        <div className="grid md:grid-cols-4 gap-3 mb-5">
          <div className="md:col-span-2">
            <label className="text-[11px] uppercase tracking-wider text-ink-muted font-semibold">Что ищу</label>
            <input
              placeholder="Например: цемент, ткань, упаковка, офисная мебель..."
              defaultValue="Цемент"
              className="mt-1.5 w-full h-10 px-3 rounded-lg border border-ink-line bg-bg-white text-sm focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/30"
            />
          </div>
          <div>
            <label className="text-[11px] uppercase tracking-wider text-ink-muted font-semibold">ОКЭД</label>
            <input
              placeholder="23.51 — Цемент"
              defaultValue="23.51"
              className="mt-1.5 w-full h-10 px-3 rounded-lg border border-ink-line bg-bg-white text-sm focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/30"
            />
          </div>
          <div>
            <label className="text-[11px] uppercase tracking-wider text-ink-muted font-semibold">Радиус</label>
            <select defaultValue="50" className="mt-1.5 w-full h-10 px-3 rounded-lg border border-ink-line bg-bg-white text-sm focus:outline-none focus:border-gold">
              <option value="10">до 10 км</option>
              <option value="25">до 25 км</option>
              <option value="50">до 50 км</option>
              <option value="100">до 100 км</option>
              <option value="200">до 200 км</option>
              <option value="any">любой</option>
            </select>
          </div>
        </div>

        {/* Demo matching results */}
        <div className="space-y-2">
          <div className="text-[11px] uppercase tracking-wider text-ink-muted font-semibold mb-2">
            Найдено 4 поставщика (демо-данные)
          </div>
          {[
            { name: 'ООО "Tashkent Tsement Grup"',   oked: '23.51', distance: '8 км',  region: 'Ташкент', rating: 'A',   ratingColor: 'bg-gold text-white',         stat: '12 лет · 140 сотр · оборот 45 млрд сум' },
            { name: 'СП "Ahangaran Tsement"',        oked: '23.51', distance: '32 км', region: 'Ташкент', rating: 'AA',  ratingColor: 'bg-success/90 text-white',   stat: '24 года · 580 сотр · оборот 180 млрд сум' },
            { name: 'ООО "Qurilish Materiallari"',   oked: '23.51', distance: '47 км', region: 'Ташкент', rating: 'B',   ratingColor: 'bg-gold/80 text-white',       stat: '6 лет · 65 сотр · оборот 18 млрд сум' },
            { name: 'ЧП "Stroi Servis Plus"',        oked: '23.51', distance: '41 км', region: 'Ташкент', rating: 'A',   ratingColor: 'bg-gold text-white',         stat: '9 лет · 92 сотр · оборот 28 млрд сум' },
          ].map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -8 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.25, delay: i * 0.03 }}
              className="p-3 rounded-lg border border-ink-line bg-bg-white hover:border-gold/40 transition-all flex items-start gap-3 flex-wrap"
            >
              <div className={`h-11 w-11 rounded-lg flex items-center justify-center font-serif font-bold text-[13px] shrink-0 ${s.ratingColor}`}>
                {s.rating}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-ink">{s.name}</div>
                <div className="text-[11.5px] text-ink-muted mt-0.5 flex flex-wrap gap-3">
                  <span>ОКЭД {s.oked}</span>
                  <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{s.region}, {s.distance}</span>
                </div>
                <div className="text-[11.5px] text-ink-soft mt-0.5">{s.stat}</div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Button size="sm" variant="ghost">Проверить</Button>
                <Button size="sm">Связаться</Button>
              </div>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* ─── Sprint 8 · Reliability rating ─── */}
      <Card padding="lg" className="border-gold/25 bg-gold-soft/20">
        <div className="flex items-start gap-3 mb-5">
          <div className="h-11 w-11 rounded-xl bg-gold text-white flex items-center justify-center shrink-0">
            <TrendingUp className="h-5 w-5" />
          </div>
          <div>
            <CardTitle>Рейтинг надёжности контрагента</CardTitle>
            <CardDescription className="mt-0.5">
              Интегральная оценка на основе всех 10 проверок. Методология открытая, без весов-секретов.
              В Ф3 — автоматический пересчёт каждый день на основе данных из Soliq, Минюст, Суды, Таможни.
            </CardDescription>
          </div>
        </div>

        <div className="grid md:grid-cols-[1fr_1.5fr] gap-5">
          {/* Overall score */}
          <div className="p-5 rounded-xl bg-bg-white border-2 border-gold/30 text-center">
            <div className="text-[11px] uppercase tracking-wider text-ink-muted font-semibold mb-2">
              Рейтинг «Karimov Tekstil»
            </div>
            <div className="relative inline-flex">
              <div className="h-28 w-28 rounded-full bg-success/10 border-4 border-success flex flex-col items-center justify-center">
                <div className="font-serif text-4xl font-bold text-success">A</div>
                <div className="text-[10px] text-ink-muted">82 / 100</div>
              </div>
            </div>
            <div className="mt-3 text-[12px] text-ink-soft leading-snug">
              <strong className="text-ink">Надёжный партнёр</strong> с одним замечанием по налогам
            </div>
          </div>

          {/* Methodology breakdown */}
          <div className="space-y-2">
            <div className="text-[11px] uppercase tracking-wider text-ink-muted font-semibold">
              Компоненты рейтинга
            </div>
            {[
              { label: 'Регистрация и адрес',       score: 10, max: 10, verdict: 'ok' },
              { label: 'Налоговая история',         score: 6,  max: 10, verdict: 'warn' },
              { label: 'Реестр МСБ · Soliq',        score: 10, max: 10, verdict: 'ok' },
              { label: 'Судебные и дисциплин.',     score: 10, max: 10, verdict: 'ok' },
              { label: 'Санкции и чёрные списки',   score: 10, max: 10, verdict: 'ok' },
              { label: 'Таможня и ВЭД',             score: 9,  max: 10, verdict: 'ok' },
              { label: 'Банкротство',               score: 10, max: 10, verdict: 'ok' },
              { label: 'Госзакупки · исполнение',   score: 10, max: 10, verdict: 'ok' },
              { label: 'Кредитная история',         score: 8,  max: 10, verdict: 'ok' },
              { label: 'Отзывы и публичные данные', score: 9,  max: 10, verdict: 'ok' },
            ].map((c, i) => (
              <div key={i} className="flex items-center gap-3 text-[12px]">
                <div className="flex-1 min-w-0 text-ink">{c.label}</div>
                <div className="w-28 h-1.5 rounded-full bg-bg-band overflow-hidden">
                  <div
                    className={`h-full ${c.verdict === 'warn' ? 'bg-gold' : 'bg-success'}`}
                    style={{ width: `${(c.score / c.max) * 100}%` }}
                  />
                </div>
                <div className="font-mono text-ink-soft w-12 text-right">{c.score} / {c.max}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 p-3 rounded-lg bg-bg-white border border-ink-line text-[12px] text-ink-soft leading-relaxed flex items-start gap-2">
          <ShieldCheck className="h-3.5 w-3.5 text-gold shrink-0 mt-0.5" />
          <span>
            <strong className="text-ink">Методология:</strong> каждый блок даёт 10 баллов максимум. Рейтинг — среднее арифметическое.
            A (86–100) — надёжный; B (71–85) — со средними рисками; C (50–70) — требует внимания; D (&lt; 50) — высокий риск.
            В Ф3 добавим весовые коэффициенты и ML-скоринг по отрасли.
          </span>
        </div>
      </Card>

      {/* ─── Sprint 8 · Check history ─── */}
      <Card padding="lg">
        <div className="flex items-start justify-between gap-3 mb-5 flex-wrap">
          <div className="flex items-start gap-3">
            <div className="h-11 w-11 rounded-xl bg-secondary/15 text-secondary flex items-center justify-center shrink-0">
              <History className="h-5 w-5" />
            </div>
            <div>
              <CardTitle>История моих проверок</CardTitle>
              <CardDescription className="mt-0.5">Последние проверки и кнопка «повторить». В Ф3 — полная история за всё время.</CardDescription>
            </div>
          </div>
          <Button size="sm" variant="ghost" leftIcon={<Filter className="h-3.5 w-3.5" />}>Фильтры</Button>
        </div>

        <div className="space-y-2">
          {[
            { id: 'CHK-2026-0423-001', name: 'Karimov Tekstil',           tin: '200 123 456', at: '23 апр 2026, 14:32', rating: 'A',  verdict: 'Надёжный' },
            { id: 'CHK-2026-0422-014', name: 'Tashkent Tsement Grup',     tin: '302 444 128', at: '22 апр 2026, 09:15', rating: 'AA', verdict: 'Высокая надёжность' },
            { id: 'CHK-2026-0421-028', name: 'ЧП "Marmar Dekor"',         tin: '301 982 771', at: '21 апр 2026, 16:44', rating: 'C',  verdict: 'Требует внимания' },
            { id: 'CHK-2026-0418-006', name: 'ООО "Energo Servis Plus"',  tin: '203 551 009', at: '18 апр 2026, 11:02', rating: 'B',  verdict: 'Средние риски' },
          ].map((h, i) => (
            <motion.div
              key={h.id}
              initial={{ opacity: 0, x: -8 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.25, delay: i * 0.03 }}
              className="p-3 rounded-lg border border-ink-line bg-bg-white flex items-center gap-3 flex-wrap"
            >
              <div className={`h-9 w-9 rounded-lg flex items-center justify-center font-serif font-bold text-[12px] shrink-0 ${
                h.rating === 'AA' ? 'bg-success/90 text-white' :
                h.rating === 'A'  ? 'bg-gold text-white' :
                h.rating === 'B'  ? 'bg-gold/80 text-white' :
                                    'bg-ink-muted text-white'
              }`}>
                {h.rating}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-mono text-ink-muted">{h.id}</span>
                  <span className="text-[11px] text-ink-muted">· {h.at}</span>
                </div>
                <div className="text-sm font-medium text-ink">{h.name}</div>
                <div className="text-[11.5px] text-ink-muted">ИНН {h.tin} · {h.verdict}</div>
              </div>
              <Button size="sm" variant="ghost" leftIcon={<RefreshCw className="h-3.5 w-3.5" />}>
                Повторить
              </Button>
            </motion.div>
          ))}
        </div>

        <div className="mt-4 text-center">
          <button className="text-sm text-gold hover:text-gold-dark font-medium">
            Показать все проверки за месяц →
          </button>
        </div>
      </Card>

      {/* ─── Footer callout ─── */}
      <Card padding="lg" className="border-success/25 bg-success/[0.03]">
        <div className="flex items-start gap-4">
          <div className="h-10 w-10 rounded-lg bg-success/10 text-success flex items-center justify-center shrink-0">
            <Sparkles className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <div className="font-serif font-semibold text-ink">Предложение из международного опыта</div>
            <CardDescription className="mt-1">
              Референс — сервис «Проверка контрагента» на <strong>мсп.рф</strong> (Корпорация МСП · Россия). Запущен в декабре 2022, проверка по 20+ параметрам из данных ФНС, бесплатно и без ограничений. В Узбекистане такого единого сервиса нет — проверка делается вручную по 5–7 источникам. Этот модуль предлагаем как НОВЫЙ — развёртывание во 2-й половине 2026 после фундамента.
            </CardDescription>
            <div className="mt-3 flex gap-2 flex-wrap">
              <Badge variant="new">NEW · 2-я половина 2026</Badge>
              <Badge variant="outline">Бесплатно и без ограничений</Badge>
              <Badge variant="outline">Связан с модулем (а) B2B/B2G</Badge>
            </div>
          </div>
        </div>
      </Card>
    </section>
  );
}

function CheckRow({ result }: { result: CheckResult }) {
  const Icon = result.verdict === 'ok' ? CheckCircle2 : result.verdict === 'warn' ? AlertTriangle : XCircle;
  const color = result.verdict === 'ok' ? 'text-success' : result.verdict === 'warn' ? 'text-gold' : 'text-danger';
  const bg = result.verdict === 'ok' ? 'bg-success/10' : result.verdict === 'warn' ? 'bg-gold/10' : 'bg-danger/10';
  return (
    <div className="flex items-start gap-3 p-3 rounded-lg border border-ink-line bg-bg-white">
      <div className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${bg} ${color}`}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[13px] font-medium text-ink">{result.label}</div>
        <div className="text-xs text-ink-muted mt-0.5 leading-snug">{result.detail}</div>
      </div>
    </div>
  );
}
