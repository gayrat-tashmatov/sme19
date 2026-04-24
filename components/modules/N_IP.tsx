'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Shield, Award, FileText, Tag, Lightbulb, Code2, BookLock, ScrollText,
  Sparkles, CheckCircle2, AlertCircle, ArrowRight, ExternalLink, Info, Clock,
  DollarSign, Users2,
} from 'lucide-react';
import { Card, CardTitle, CardDescription } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { PhaseRoadmapStrip } from '@/components/sections/PhaseRoadmapStrip';

// ═══════════════════════════════════════════════════════════════════
// Sprint 7 · N_IP — Intellectual Property
// Trademark via ima.uz · patents · software for IT Park · copyrights · NDA
// ═══════════════════════════════════════════════════════════════════

interface IPType {
  id: 'trademark' | 'invention' | 'utility' | 'software' | 'copyright' | 'nda';
  name: string;
  description: string;
  duration: string;
  cost: string;
  term: string;
  Icon: typeof Tag;
  bestFor: string[];
  whyRegister: string;
}

const IP_TYPES: IPType[] = [
  {
    id: 'trademark',
    name: 'Товарный знак',
    description: 'Регистрация уникального названия или логотипа бренда. Даёт исключительное право использования в заявленных классах МКТУ.',
    duration: '~ 12 месяцев',
    cost: 'от 1.5 млн сум',
    term: '10 лет с продлением',
    Icon: Tag,
    bestFor: ['Розница и потребительские товары', 'Услуги', 'Франшиза', 'Экспорт под собственным брендом'],
    whyRegister: 'В Узбекистане принцип «first to file» — кто первый подал, тот и правообладатель. Конкуренты могут зарегистрировать ваше название раньше.',
  },
  {
    id: 'invention',
    name: 'Патент на изобретение',
    description: 'Защита технического решения (продукт, способ, устройство), обладающего новизной, изобретательским уровнем и промышленной применимостью.',
    duration: '~ 18–24 месяца',
    cost: 'от 4 млн сум',
    term: '20 лет',
    Icon: Lightbulb,
    bestFor: ['Производство', 'Энергетика', 'Медтехника', 'Химическая промышленность'],
    whyRegister: 'Патент даёт монополию на коммерческое использование изобретения. Без патента конкуренты могут копировать без ответственности.',
  },
  {
    id: 'utility',
    name: 'Патент на полезную модель',
    description: 'Упрощённый вид защиты — для технических решений устройств. Быстрее и дешевле патента на изобретение.',
    duration: '~ 6–8 месяцев',
    cost: 'от 2 млн сум',
    term: '10 лет',
    Icon: Lightbulb,
    bestFor: ['Модернизация оборудования', 'Улучшения конструкций', 'Промышленные образцы'],
    whyRegister: 'Быстрая защита инноваций на раннем этапе. Подходит для постепенного улучшения продукта.',
  },
  {
    id: 'software',
    name: 'Программа для ЭВМ',
    description: 'Регистрация авторского права на программный код. Критично для IT-парка и экспорта ПО.',
    duration: '~ 2 месяца',
    cost: 'от 500 тыс сум',
    term: 'жизнь автора + 70 лет',
    Icon: Code2,
    bestFor: ['IT-компании', 'Резиденты IT-парка', 'Разработчики SaaS', 'Экспортёры ПО'],
    whyRegister: 'Обязательное условие для регистрации в IT-парке. Даёт юридическую защиту кода от копирования.',
  },
  {
    id: 'copyright',
    name: 'Авторские права',
    description: 'Автоматическая защита произведений (тексты, музыка, видео, дизайн, фотографии) с момента их создания. Депонирование усиливает позиции в суде.',
    duration: 'автоматически',
    cost: 'от 300 тыс сум (депонирование)',
    term: 'жизнь автора + 70 лет',
    Icon: BookLock,
    bestFor: ['Медиа и контент', 'Дизайнеры', 'Музыканты', 'Блогеры и инфлюенсеры'],
    whyRegister: 'При споре — депонированный экземпляр служит доказательством авторства и даты создания.',
  },
  {
    id: 'nda',
    name: 'NDA и коммерческая тайна',
    description: 'Соглашения о неразглашении с сотрудниками, подрядчиками, партнёрами. Защищают know-how, клиентские базы, бизнес-процессы.',
    duration: '1 день (подписание)',
    cost: 'бесплатно (шаблоны)',
    term: 'по договору',
    Icon: ScrollText,
    bestFor: ['Все бизнесы с know-how', 'IT и консалтинг', 'Производство уникальной продукции'],
    whyRegister: 'Юридическая защита при утечке. Без NDA доказать ущерб от разглашения почти невозможно.',
  },
];

interface TrademarkStep {
  order: number;
  title: string;
  duration: string;
  details: string;
  outcome: string;
}

const TRADEMARK_STEPS: TrademarkStep[] = [
  {
    order: 1,
    title: 'Предварительный поиск',
    duration: '1–3 дня',
    details: 'Проверка идентичных и похожих знаков в базе ima.uz и международных реестрах WIPO, Мадридской системы.',
    outcome: 'Понимание, свободен ли знак и в каких классах МКТУ',
  },
  {
    order: 2,
    title: 'Выбор классов МКТУ',
    duration: '1 день',
    details: '45 международных классов (1–34 товары, 35–45 услуги). Выбирайте только те, где реально работаете — избыточные классы стоят денег.',
    outcome: 'Список классов для заявки (обычно 1–3)',
  },
  {
    order: 3,
    title: 'Подача заявки',
    duration: '1 день',
    details: 'Онлайн через ima.uz · приложение: изображение знака, перечень товаров/услуг, данные заявителя, документ об уплате пошлины.',
    outcome: 'Получение номера заявки и приоритетной даты',
  },
  {
    order: 4,
    title: 'Формальная экспертиза',
    duration: '1–2 месяца',
    details: 'Проверка правильности заполнения документов, уплаты пошлин, состава заявки.',
    outcome: 'Допуск к экспертизе по существу',
  },
  {
    order: 5,
    title: 'Экспертиза по существу',
    duration: '6–10 месяцев',
    details: 'Проверка охраноспособности: отличительная способность, отсутствие абсолютных оснований отказа, сходство с ранее зарегистрированными знаками.',
    outcome: 'Решение о регистрации или предварительный отказ',
  },
  {
    order: 6,
    title: 'Регистрация и выдача свидетельства',
    duration: '1 месяц',
    details: 'При положительном решении — уплата пошлины за регистрацию, внесение в реестр, выдача свидетельства.',
    outcome: 'Официальный товарный знак на 10 лет',
  },
];

interface Refusal {
  reason: string;
  examples: string;
  howToAvoid: string;
}

const TM_REFUSALS: Refusal[] = [
  { reason: 'Отсутствие отличительной способности', examples: '«Лучший хлеб», «Узбекский текстиль»',                  howToAvoid: 'Используйте уникальные, изобретённые слова или сочетания' },
  { reason: 'Описательный характер',                examples: 'Прямо описывает товар: «Сладкий сок», «Быстрая доставка»', howToAvoid: 'Знак должен быть ассоциативным, но не описательным' },
  { reason: 'Сходство с другими знаками',           examples: 'Похож на зарегистрированный знак в том же классе',      howToAvoid: 'Предварительный поиск ДО подачи' },
  { reason: 'Противоречие морали',                   examples: 'Оскорбительные слова, изображения',                     howToAvoid: 'Избегайте спорной символики' },
  { reason: 'Использование гос-символики',            examples: 'Флаги, гербы, изображения гос. учреждений',              howToAvoid: 'Не использовать в знаках' },
];

export function N_IP() {
  return (
    <section className="container-wide py-10 md:py-14 space-y-8">
      {/* Hero */}
      <Card padding="lg" tone="navy" className="text-white relative overflow-hidden">
        <div className="absolute inset-0 pattern-dots opacity-30 pointer-events-none" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <Badge variant="new">NEW · ч. жизненного цикла</Badge>
            <span className="text-xs uppercase tracking-wider text-gold-light">Этап 11 · Защита ИС</span>
          </div>
          <h2 className="font-serif text-2xl md:text-3xl text-white mb-2 leading-tight">
            Интеллектуальная собственность — товарный знак, патенты, софт
          </h2>
          <p className="text-white/75 max-w-3xl text-sm leading-relaxed">
            6 видов защиты ИС для МСБ: товарный знак через ima.uz, патенты на изобретения и полезные модели,
            программы для ЭВМ (критично для IT-парка), авторские права и депонирование, NDA. Пошаговая
            регистрация, типичные причины отказов, интеграция с Агентством по интеллектуальной собственности.
          </p>
        </div>
      </Card>

      <PhaseRoadmapStrip
        embedded
        currentPhase={2}
        points={[
          { phase: 2, text: '6 видов защиты ИС с описанием, сроками, стоимостью' },
          { phase: 2, text: 'Пошаговая регистрация товарного знака за 6 шагов' },
          { phase: 2, text: '5 типичных причин отказа в регистрации и как их избежать' },
          { phase: 2, text: 'Ссылки на ima.uz · Агентство по интеллектуальной собственности' },
          { phase: 2, text: 'Шаблоны NDA и соглашений о коммерческой тайне' },
          { phase: 3, text: 'Интеграция с ima.uz через МИП — подача заявок без ухода с Платформы', blockedBy: 'соглашение + кибер-экспертиза' },
          { phase: 3, text: 'База данных товарных знаков для предварительного поиска' },
          { phase: 4, text: 'AI-ассистент: проверка охраноспособности знака до подачи' },
        ]}
      />

      {/* ─── 6 IP types ─── */}
      <Card padding="lg">
        <div className="flex items-start gap-3 mb-5">
          <div className="h-11 w-11 rounded-xl bg-gold/15 text-gold flex items-center justify-center shrink-0">
            <Shield className="h-5 w-5" />
          </div>
          <div>
            <CardTitle>6 видов защиты интеллектуальной собственности</CardTitle>
            <CardDescription className="mt-0.5">
              Что защищаете → какой инструмент выбрать. Для большинства МСБ достаточно товарного знака + NDA.
              Для IT-компаний критично — программы для ЭВМ.
            </CardDescription>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-3">
          {IP_TYPES.map((ip, i) => (
            <motion.div
              key={ip.id}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.25, delay: i * 0.04 }}
            >
              <Card hover className="h-full flex flex-col">
                <div className="flex items-start gap-3 mb-2">
                  <div className="h-10 w-10 rounded-lg bg-gold/10 text-gold flex items-center justify-center shrink-0">
                    <ip.Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-[15px] leading-tight">{ip.name}</CardTitle>
                    <div className="flex gap-1.5 mt-1.5 flex-wrap">
                      <Badge variant="outline"><Clock className="h-3 w-3" />{ip.duration}</Badge>
                      <Badge variant="outline">{ip.term}</Badge>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="font-serif text-sm font-bold text-gold">{ip.cost}</div>
                    <div className="text-[10px] text-ink-muted">стоимость</div>
                  </div>
                </div>

                <CardDescription className="text-[12.5px] mt-2 leading-relaxed flex-1">
                  {ip.description}
                </CardDescription>

                <div className="mt-3 pt-3 border-t border-ink-line/60">
                  <div className="text-[10px] uppercase tracking-wider text-ink-muted font-semibold mb-1">Для кого</div>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {ip.bestFor.slice(0, 3).map((b, i) => (
                      <span key={i} className="text-[11px] px-1.5 py-0.5 rounded bg-bg-band/60 text-ink-soft">{b}</span>
                    ))}
                  </div>
                  <div className="text-[11.5px] text-gold-dark font-medium leading-snug">
                    💡 {ip.whyRegister}
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* ─── Trademark 6-step registration ─── */}
      <Card padding="lg" className="border-gold/25 bg-gold-soft/15">
        <div className="flex items-start gap-3 mb-5 flex-wrap">
          <div className="h-11 w-11 rounded-xl bg-gold text-white flex items-center justify-center shrink-0">
            <Tag className="h-5 w-5" />
          </div>
          <div className="flex-1 min-w-0">
            <CardTitle>Регистрация товарного знака · 6 шагов</CardTitle>
            <CardDescription className="mt-0.5">
              Онлайн через ima.uz (Агентство по интеллектуальной собственности). Общее время — около 12 месяцев.
              Ниже пошаговый путь с выходами каждого этапа.
            </CardDescription>
          </div>
          <a
            href="https://ima.uz"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-gold hover:text-gold-dark font-medium inline-flex items-center gap-1 shrink-0"
          >
            ima.uz <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>

        <div className="space-y-3">
          {TRADEMARK_STEPS.map((s, i) => (
            <motion.div
              key={s.order}
              initial={{ opacity: 0, x: -8 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.25, delay: i * 0.04 }}
              className="p-4 rounded-xl border border-gold/25 bg-bg-white flex items-start gap-4"
            >
              <div className="h-10 w-10 rounded-lg bg-gold text-white flex items-center justify-center shrink-0 font-serif font-bold">
                {s.order}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <div className="font-serif font-semibold text-ink text-[14.5px]">{s.title}</div>
                  <Badge variant="outline">{s.duration}</Badge>
                </div>
                <div className="text-[13px] text-ink-soft leading-relaxed mb-2">{s.details}</div>
                <div className="flex items-start gap-1.5 text-[12px] text-success">
                  <CheckCircle2 className="h-3 w-3 shrink-0 mt-0.5" />
                  <span><strong>Результат:</strong> {s.outcome}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* ─── Refusal reasons ─── */}
      <Card padding="lg">
        <div className="flex items-start gap-3 mb-5">
          <div className="h-11 w-11 rounded-xl bg-danger/15 text-danger flex items-center justify-center shrink-0">
            <AlertCircle className="h-5 w-5" />
          </div>
          <div>
            <CardTitle>5 типичных причин отказа в регистрации товарного знака</CardTitle>
            <CardDescription className="mt-0.5">
              Зная заранее, вы сэкономите время (до 12 месяцев) и деньги (от 1.5 млн сум пошлины).
            </CardDescription>
          </div>
        </div>

        <div className="space-y-2">
          {TM_REFUSALS.map((r, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -8 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.25, delay: i * 0.03 }}
              className="p-3 rounded-lg border border-ink-line bg-bg-white"
            >
              <div className="flex items-start gap-3 mb-2">
                <div className="h-8 w-8 rounded-lg bg-danger/10 text-danger flex items-center justify-center shrink-0 font-serif font-bold text-[13px]">
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-ink">{r.reason}</div>
                  <div className="text-[11.5px] text-ink-muted mt-0.5 italic">примеры: {r.examples}</div>
                </div>
              </div>
              <div className="pl-11 flex items-start gap-1.5 text-[12.5px] text-success">
                <ArrowRight className="h-3 w-3 shrink-0 mt-0.5" />
                <span><strong>Как избежать:</strong> {r.howToAvoid}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* ─── IT Park IP critical callout ─── */}
      <Card padding="lg" className="border-secondary/25 bg-secondary/5">
        <div className="flex items-start gap-4 flex-wrap">
          <div className="h-12 w-12 rounded-xl bg-secondary text-white flex items-center justify-center shrink-0">
            <Code2 className="h-6 w-6" />
          </div>
          <div className="flex-1 min-w-0">
            <CardTitle className="text-[17px]">Для резидентов IT-парка — программы для ЭВМ обязательны</CardTitle>
            <CardDescription className="text-[13px] mt-1">
              Регистрация исходного кода в Агентстве по интеллектуальной собственности — одно из обязательных условий
              получения и поддержания статуса резидента. Без этого — отказ в льготах IT-парка (0% ПИТ + 7.5% ЕСП).
            </CardDescription>

            <div className="grid sm:grid-cols-3 gap-3 mt-4">
              <div className="p-3 rounded-lg bg-bg-white border border-secondary/20">
                <DollarSign className="h-4 w-4 text-secondary mb-1.5" />
                <div className="text-[12px] font-medium text-ink">От 500 тыс сум</div>
                <div className="text-[11px] text-ink-muted">стоимость регистрации</div>
              </div>
              <div className="p-3 rounded-lg bg-bg-white border border-secondary/20">
                <Clock className="h-4 w-4 text-secondary mb-1.5" />
                <div className="text-[12px] font-medium text-ink">~ 2 месяца</div>
                <div className="text-[11px] text-ink-muted">срок оформления</div>
              </div>
              <div className="p-3 rounded-lg bg-bg-white border border-secondary/20">
                <Award className="h-4 w-4 text-secondary mb-1.5" />
                <div className="text-[12px] font-medium text-ink">Жизнь + 70 лет</div>
                <div className="text-[11px] text-ink-muted">срок защиты</div>
              </div>
            </div>

            <div className="mt-4 p-3 rounded-lg bg-bg-band/60 border border-ink-line text-[12px] text-ink-soft flex items-start gap-2">
              <Info className="h-3.5 w-3.5 text-secondary shrink-0 mt-0.5" />
              <span>
                Рекомендация: регистрируйте каждую крупную версию вашего продукта. Это создаёт «цепочку доказательств»
                эволюции кода — ценно при спорах о первенстве и при сделках M&A.
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* ─── Practical tips ─── */}
      <Card padding="lg">
        <div className="flex items-start gap-3 mb-5">
          <div className="h-11 w-11 rounded-xl bg-success/15 text-success flex items-center justify-center shrink-0">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <CardTitle>Практические советы</CardTitle>
            <CardDescription className="mt-0.5">
              Из опыта МСБ, прошедших регистрацию ИС в Узбекистане.
            </CardDescription>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-3">
          <TipCard
            title="Регистрируйте бренд до запуска"
            description="Процесс занимает 12 месяцев. Начинайте в момент регистрации ИП/ООО, а не когда конкурент уже заблокировал ваше название."
          />
          <TipCard
            title="Международная регистрация — Мадридская система"
            description="Для экспорта — одна заявка через WIPO покрывает до 130 стран. Дешевле, чем регистрация в каждой стране отдельно."
          />
          <TipCard
            title="Консультация Агентства ИС — бесплатная"
            description="Первая консультация в ima.uz бесплатная. Запишитесь перед подачей — сэкономите на исправлениях."
          />
          <TipCard
            title="NDA при первой встрече"
            description="Подписывайте NDA до раскрытия деталей продукта с потенциальными партнёрами, инвесторами, подрядчиками."
          />
          <TipCard
            title="Депонирование для фото, музыки, текстов"
            description="Для контента, где автоматические авторские права сложно доказать — депонируйте экземпляры в Агентстве ИС."
          />
          <TipCard
            title="Следите за сроками продления"
            description="Товарный знак — 10 лет, патент — 20 лет (с ежегодной пошлиной). Пропустите — потеряете защиту."
          />
        </div>
      </Card>

      {/* Footer callout */}
      <Card padding="lg" className="border-success/25 bg-success/[0.03]">
        <div className="flex items-start gap-4 flex-wrap">
          <div className="h-10 w-10 rounded-lg bg-success/10 text-success flex items-center justify-center shrink-0">
            <Sparkles className="h-5 w-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-serif font-semibold text-ink">Связано с другими модулями</div>
            <CardDescription className="mt-1">
              ИС — фундамент монетизации и роста. Связан с экспортом (защита за рубежом), наймом (NDA), IT-парком (обязательная регистрация ПО).
            </CardDescription>
            <div className="mt-3 grid sm:grid-cols-3 gap-2">
              <Link href="/modules/nHR" className="text-xs text-gold hover:text-gold-dark inline-flex items-center gap-1">
                Кадры · шаблоны NDA <ArrowRight className="h-3 w-3" />
              </Link>
              <Link href="/modules/nExport" className="text-xs text-gold hover:text-gold-dark inline-flex items-center gap-1">
                Экспорт · защита знака за рубежом <ArrowRight className="h-3 w-3" />
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

function TipCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="p-3 rounded-lg border border-ink-line bg-bg-white flex items-start gap-2.5">
      <CheckCircle2 className="h-4 w-4 text-success shrink-0 mt-0.5" />
      <div>
        <div className="text-sm font-medium text-ink leading-tight">{title}</div>
        <div className="text-[12px] text-ink-soft mt-1 leading-snug">{description}</div>
      </div>
    </div>
  );
}
