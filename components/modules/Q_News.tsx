'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Newspaper, Bell, Calendar, Target, Lightbulb, Sparkles, Filter,
  TrendingUp, AlertCircle, Info, BookmarkPlus, ArrowRight, CheckCircle2,
} from 'lucide-react';
import { Card, CardTitle, CardDescription } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/cn';

type Relevance = 'affects-you' | 'useful' | 'general';
type NewsCategory = 'tax' | 'labour' | 'customs' | 'licence' | 'support' | 'industry';

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  category: NewsCategory;
  relevance: Relevance;
  publishedDate: string;
  effectiveDate?: string;
  source: string;
  affectsOkeds: string[];
  affectsRegions: string[];
  affectsSize: string[];
  aiExplanation: string;
}

const NEWS: NewsItem[] = [
  {
    id: 'N-2026-0412',
    title: 'С 01.07.2026 меняется ставка НДС для розничной торговли одеждой с 12 на 10%',
    summary: 'Кабмин утвердил снижение ставки для стимулирования внутреннего производства. Изменения касаются всех, кто торгует текстильной продукцией в рознице (ОКЭД 47.71).',
    category: 'tax',
    relevance: 'affects-you',
    publishedDate: '14 апр 2026',
    effectiveDate: '01 июл 2026',
    source: 'Постановление КМ № 180',
    affectsOkeds: ['47.71', '13.20'],
    affectsRegions: ['все'],
    affectsSize: ['все'],
    aiExplanation: 'Вы попадаете под это изменение: ваш дополнительный ОКЭД 47.71. С 1 июля НДС в накладных на розничную продукцию снизится с 12 на 10% — пересчитайте отпускные цены и обновите настройки в кассовом аппарате. Экономия на налоге: ~9 млн сум/квартал при текущих оборотах.',
  },
  {
    id: 'N-2026-0408',
    title: 'Введены упрощённые требования к сертификации текстильной продукции',
    summary: 'Torgsert сократил перечень обязательных испытаний с 12 до 7. Срок выдачи сертификата сокращается с 45 до 21 дня.',
    category: 'industry',
    relevance: 'affects-you',
    publishedDate: '10 апр 2026',
    effectiveDate: '15 апр 2026',
    source: 'Приказ Torgsert № 124',
    affectsOkeds: ['13.20'],
    affectsRegions: ['все'],
    affectsSize: ['все'],
    aiExplanation: 'Ваш основной ОКЭД — 13.20. Теперь сертификация новых артикулов ткани займёт 21 день вместо 45, и вы сэкономите на 5 устаревших испытаниях (~2.4 млн сум на партию).',
  },
  {
    id: 'N-2026-0405',
    title: 'Новая субсидия на внедрение POS-систем для услуг · до 15 млн сум',
    summary: 'МЭФ объявил старт программы. Компенсация до 30% от стоимости, лимит 15 млн сум на предприятие.',
    category: 'support',
    relevance: 'useful',
    publishedDate: '7 апр 2026',
    effectiveDate: '1 мая 2026',
    source: 'Постановление МЭФ № 96',
    affectsOkeds: ['56.10', '56.30', '96.02', '47.71'],
    affectsRegions: ['все'],
    affectsSize: ['МСБ'],
    aiExplanation: 'Прямо для вас не обязательна, но может быть полезна для розничного магазина (ОКЭД 47.71) при обновлении касс. Срок подачи заявки — до 01.10.2026.',
  },
  {
    id: 'N-2026-0401',
    title: 'Минтруда утвердил новые требования к охране труда на производстве',
    summary: 'Обязательное оформление инструктажей через электронный журнал. Штраф за нарушение — до 6 БРВ на каждого сотрудника.',
    category: 'labour',
    relevance: 'affects-you',
    publishedDate: '3 апр 2026',
    effectiveDate: '01 июн 2026',
    source: 'Приказ Минтруда № 48',
    affectsOkeds: ['13.20', 'все производственные'],
    affectsRegions: ['все'],
    affectsSize: ['от 5 сотр.'],
    aiExplanation: 'Касается вас: 42 сотрудника на производстве. До 1 июня нужно внедрить электронный журнал инструктажей. Рекомендую использовать бесплатное решение от Минтруда (до 50 сотрудников — бесплатно).',
  },
  {
    id: 'N-2026-0329',
    title: 'Таможня упрощает процедуры для экспорта текстиля в СНГ',
    summary: 'Внедряется режим «зелёного коридора» для экспортёров с опытом от 1 года. Оформление — 2 часа вместо 2 дней.',
    category: 'customs',
    relevance: 'useful',
    publishedDate: '30 мар 2026',
    effectiveDate: '15 апр 2026',
    source: 'Приказ ГТК № 88',
    affectsOkeds: ['13.20', '14.'],
    affectsRegions: ['все'],
    affectsSize: ['с экспортом'],
    aiExplanation: 'У вас пока нет экспортной истории, но при планировании экспорта одежды в Казахстан или Россию — готовый упрощённый путь.',
  },
  {
    id: 'N-2026-0325',
    title: 'Обновлены правила проверок ГНК: мораторий на внеплановые для МСБ',
    summary: 'До конца 2026 года отменены все внеплановые проверки для добросовестных МСБ. Плановые — не чаще 1 раза в 3 года.',
    category: 'tax',
    relevance: 'useful',
    publishedDate: '26 мар 2026',
    effectiveDate: 'уже действует',
    source: 'УП-176',
    affectsOkeds: ['все'],
    affectsRegions: ['все'],
    affectsSize: ['МСБ'],
    aiExplanation: 'Общая хорошая новость для всего МСБ. Вы попадаете — статус «среднее предприятие» + нет налоговой задолженности.',
  },
  {
    id: 'N-2026-0320',
    title: 'Зарегистрирован проект повышения МРОТ с 01.09.2026',
    summary: 'Минтруда направил на согласование увеличение МРОТ на 12%.',
    category: 'labour',
    relevance: 'general',
    publishedDate: '22 мар 2026',
    source: 'Проект постановления',
    affectsOkeds: ['все'],
    affectsRegions: ['все'],
    affectsSize: ['все'],
    aiExplanation: 'Пока на согласовании. Ваша средняя ЗП 6.2 млн сум выше МРОТ в разы — прямого влияния нет.',
  },
];

const CATEGORY_LABEL: Record<NewsCategory, string> = {
  tax:      'Налоги',
  labour:   'Труд и кадры',
  customs:  'Таможня',
  licence:  'Лицензии',
  support:  'Меры поддержки',
  industry: 'Отраслевое',
};

const RELEVANCE_CONFIG: Record<Relevance, { label: string; Icon: typeof Target; accent: string; variant: 'danger' | 'warning' | 'outline' }> = {
  'affects-you': { label: 'Касается вас',   Icon: Target,   accent: 'border-gold/40 bg-gold-soft/20',     variant: 'warning' },
  'useful':      { label: 'Полезно знать',  Icon: Lightbulb, accent: 'border-secondary/30 bg-secondary/5', variant: 'outline' },
  'general':     { label: 'Общее',          Icon: Info,      accent: 'border-ink-line bg-bg-white',        variant: 'outline' },
};

export function QNews() {
  const [relevanceFilter, setRel] = useState<Relevance | 'all'>('all');
  const [catFilter, setCat] = useState<NewsCategory | 'all'>('all');
  const [opened, setOpened] = useState<NewsItem | null>(null);

  const filtered = useMemo(() => NEWS.filter((n) => {
    if (relevanceFilter !== 'all' && n.relevance !== relevanceFilter) return false;
    if (catFilter !== 'all' && n.category !== catFilter) return false;
    return true;
  }), [relevanceFilter, catFilter]);

  const affectsYouCount = NEWS.filter((n) => n.relevance === 'affects-you').length;
  const upcoming = NEWS.filter((n) => n.effectiveDate && n.effectiveDate.includes('мая') || n.effectiveDate?.includes('июн') || n.effectiveDate?.includes('июл'));

  return (
    <section className="container-wide py-10 md:py-14 space-y-6">
      {/* Hero */}
      <Card padding="lg" tone="navy" className="text-white relative overflow-hidden">
        <div className="absolute inset-0 pattern-dots opacity-25 pointer-events-none" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-3">
            <Newspaper className="h-5 w-5 text-gold-light" />
            <span className="text-xs uppercase tracking-wider text-gold-light font-semibold">Адаптация КонсультантПлюс · GOV.UK notifications</span>
          </div>
          <h2 className="font-serif text-2xl md:text-3xl text-white mb-2 leading-tight">
            Новости и НПА — отфильтрованы под ваш профиль бизнеса
          </h2>
          <p className="text-white/75 max-w-3xl text-sm">
            Лента изменений в законодательстве с учётом вашего ОКЭД, региона и размера бизнеса. AI-объяснение
            «что это значит для вас». Календарь предстоящих изменений. Email и Telegram-уведомления.
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            <ProfileBadge label="Ваш профиль" value="ООО «Karimov Tekstil» · 42 сотрудн." />
            <ProfileBadge label="ОКЭД" value="13.20 · 47.71" />
            <ProfileBadge label="Регион" value="Ташкент · Яшнабадский р-н" />
            <ProfileBadge label="Размер" value="Среднее МСБ" />
          </div>
        </div>
      </Card>

      {/* Personal alert banner */}
      <Card padding="md" className="border-gold/40 bg-gold-soft/30">
        <div className="flex items-start gap-3">
          <div className="h-10 w-10 rounded-lg bg-gold text-white flex items-center justify-center shrink-0">
            <Bell className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <div className="font-serif text-[15px] text-ink font-semibold">
              {affectsYouCount} изменения касаются вашего бизнеса
            </div>
            <div className="text-sm text-ink-muted mt-0.5">
              Обновления с 29 марта. Самое срочное — снижение НДС на текстиль с 01.07.2026 (пересчёт цен).
            </div>
          </div>
          <Button size="sm" leftIcon={<Bell className="h-4 w-4" />} variant="ghost">
            Настроить уведомления
          </Button>
        </div>
      </Card>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 items-center">
        <Filter className="h-4 w-4 text-ink-muted" />
        <Chip active={relevanceFilter === 'all'}          onClick={() => setRel('all')}>Все ({NEWS.length})</Chip>
        <Chip active={relevanceFilter === 'affects-you'}  onClick={() => setRel('affects-you')} tone="gold">
          Касается вас ({NEWS.filter((n) => n.relevance === 'affects-you').length})
        </Chip>
        <Chip active={relevanceFilter === 'useful'}       onClick={() => setRel('useful')}     tone="blue">
          Полезно ({NEWS.filter((n) => n.relevance === 'useful').length})
        </Chip>
        <Chip active={relevanceFilter === 'general'}      onClick={() => setRel('general')}>
          Общее ({NEWS.filter((n) => n.relevance === 'general').length})
        </Chip>

        <span className="h-4 w-px bg-ink-line mx-1" />

        <Chip active={catFilter === 'all'} onClick={() => setCat('all')}>Все категории</Chip>
        {(Object.keys(CATEGORY_LABEL) as NewsCategory[]).map((c) => (
          <Chip key={c} active={catFilter === c} onClick={() => setCat(c)}>{CATEGORY_LABEL[c]}</Chip>
        ))}
      </div>

      {/* Grid */}
      <div className="grid lg:grid-cols-[2fr_1fr] gap-5">
        {/* News list */}
        <div className="space-y-3">
          {filtered.length === 0 && <div className="surface-card p-8 text-center text-sm text-ink-muted">По этим фильтрам ничего не найдено</div>}
          {filtered.map((n) => <NewsCard key={n.id} item={n} onOpen={() => setOpened(n)} />)}
        </div>

        {/* Calendar sidebar */}
        <div>
          <Card padding="md" className="sticky top-32">
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="h-4 w-4 text-gold" />
              <div className="font-serif font-semibold text-ink">Календарь предстоящих изменений</div>
            </div>
            <div className="space-y-2">
              {NEWS.filter((n) => n.effectiveDate && !n.effectiveDate.includes('действует') && !n.effectiveDate.includes('15 апр')).map((n) => (
                <button key={n.id} onClick={() => setOpened(n)} className="w-full text-left p-2.5 rounded-lg border border-ink-line bg-bg-white hover:border-gold/40 transition-colors">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10.5px] font-mono text-gold font-semibold">{n.effectiveDate}</span>
                    {n.relevance === 'affects-you' && <Badge variant="warning">касается вас</Badge>}
                  </div>
                  <div className="text-[12.5px] text-ink leading-snug line-clamp-2">{n.title}</div>
                </button>
              ))}
            </div>
            <div className="mt-4 pt-3 border-t border-ink-line text-[11px] text-ink-muted">
              Добавьте в свой календарь через интеграцию с Google Calendar или Outlook
            </div>
          </Card>
        </div>
      </div>

      {/* Dialog */}
      {opened && <NewsDialog item={opened} onClose={() => setOpened(null)} />}

      {/* Footer */}
      <Card padding="lg" className="border-gold/25 bg-gold-soft/30">
        <div className="flex items-start gap-4">
          <div className="h-10 w-10 rounded-lg bg-gold/15 text-gold flex items-center justify-center shrink-0">
            <Sparkles className="h-5 w-5" />
          </div>
          <div className="text-sm text-ink">
            <strong>Референсы:</strong> <strong>КонсультантПлюс</strong> · <strong>Гарант.РУ</strong> — лента НПА
            с фильтрами по отрасли. <strong>GOV.UK notifications</strong> — прицельные уведомления об изменениях.
            Главная идея — предприниматель не должен следить за десятками каналов, Платформа делает это за него.
          </div>
        </div>
      </Card>
    </section>
  );
}

function NewsCard({ item, onOpen }: { item: NewsItem; onOpen: () => void }) {
  const cfg = RELEVANCE_CONFIG[item.relevance];
  return (
    <motion.button
      onClick={onOpen}
      initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
      className={cn('w-full text-left p-4 rounded-xl border transition-all hover:border-gold', cfg.accent)}
    >
      <div className="flex items-start gap-3">
        <div className={cn(
          'h-10 w-10 rounded-lg flex items-center justify-center shrink-0',
          item.relevance === 'affects-you' ? 'bg-gold text-white' : 'bg-bg-band text-ink-muted',
        )}>
          <cfg.Icon className="h-5 w-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <Badge variant={cfg.variant}>{cfg.label}</Badge>
            <Badge variant="outline">{CATEGORY_LABEL[item.category]}</Badge>
            {item.effectiveDate && (
              <span className="text-[11px] text-ink-muted">
                <Calendar className="inline h-3 w-3 -mt-0.5" /> вступает {item.effectiveDate}
              </span>
            )}
          </div>
          <div className="font-serif text-[15px] text-ink leading-snug mb-1">{item.title}</div>
          <div className="text-[13px] text-ink-muted leading-relaxed line-clamp-2">{item.summary}</div>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-[11px] text-ink-muted">{item.source} · {item.publishedDate}</span>
            <span className="text-[12px] text-gold font-medium flex items-center gap-1">
              Подробнее <ArrowRight className="h-3 w-3" />
            </span>
          </div>
        </div>
      </div>
    </motion.button>
  );
}

function NewsDialog({ item, onClose }: { item: NewsItem; onClose: () => void }) {
  const cfg = RELEVANCE_CONFIG[item.relevance];
  return (
    <motion.div
      className="fixed inset-0 z-50 bg-navy/60 backdrop-blur-sm flex items-center justify-center p-4"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={onClose}
    >
      <motion.div
        initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
        className="bg-bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-card-hover"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-ink-line">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <Badge variant={cfg.variant}>{cfg.label}</Badge>
                <Badge variant="outline">{CATEGORY_LABEL[item.category]}</Badge>
              </div>
              <CardTitle className="text-[18px]">{item.title}</CardTitle>
              <div className="text-xs text-ink-muted mt-1">{item.source} · опубликовано {item.publishedDate}</div>
            </div>
            <button onClick={onClose} className="text-ink-muted hover:text-ink text-xl leading-none">&times;</button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <div className="text-sm text-ink leading-relaxed">{item.summary}</div>
          </div>

          {item.effectiveDate && (
            <div className="p-3 rounded-lg bg-bg-band/50 border border-ink-line flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gold" />
              <div className="text-sm">
                <strong>Вступает в силу:</strong> {item.effectiveDate}
              </div>
            </div>
          )}

          <div className="p-4 rounded-xl bg-gold-soft/40 border border-gold/30">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-4 w-4 text-gold-dark" />
              <div className="text-xs uppercase tracking-wider text-gold-dark font-semibold">AI: что это значит для вашего бизнеса</div>
            </div>
            <div className="text-[14px] text-ink leading-relaxed">{item.aiExplanation}</div>
          </div>

          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="p-2 rounded-lg bg-bg-band/40 border border-ink-line">
              <div className="text-ink-muted text-[10.5px] uppercase tracking-wider mb-0.5">ОКЭД</div>
              <div className="text-ink font-mono">{item.affectsOkeds.join(', ')}</div>
            </div>
            <div className="p-2 rounded-lg bg-bg-band/40 border border-ink-line">
              <div className="text-ink-muted text-[10.5px] uppercase tracking-wider mb-0.5">Регионы</div>
              <div className="text-ink">{item.affectsRegions.join(', ')}</div>
            </div>
            <div className="p-2 rounded-lg bg-bg-band/40 border border-ink-line">
              <div className="text-ink-muted text-[10.5px] uppercase tracking-wider mb-0.5">Размер</div>
              <div className="text-ink">{item.affectsSize.join(', ')}</div>
            </div>
          </div>

          <div className="flex gap-2 flex-wrap">
            <Button size="sm" leftIcon={<BookmarkPlus className="h-4 w-4" />}>В избранное</Button>
            <Button size="sm" variant="ghost" leftIcon={<Bell className="h-4 w-4" />}>Напомнить за 7 дней</Button>
            <Button size="sm" variant="ghost">Открыть полный текст НПА</Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function Chip({ active, onClick, tone, children }: {
  active: boolean; onClick: () => void; tone?: 'gold' | 'blue'; children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'h-8 px-3 rounded-full text-xs font-medium transition-colors border',
        active ? (
          tone === 'gold' ? 'bg-gold text-white border-gold' :
          tone === 'blue' ? 'bg-secondary text-white border-secondary' :
                            'bg-navy text-white border-navy'
        ) : 'bg-bg-white text-ink-muted border-ink-line hover:border-gold hover:text-gold',
      )}
    >
      {children}
    </button>
  );
}

function ProfileBadge({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white/10 border border-white/15 rounded-lg px-3 py-1.5">
      <div className="text-[10px] uppercase tracking-wider text-gold-light/70">{label}</div>
      <div className="text-xs text-white font-medium mt-0.5">{value}</div>
    </div>
  );
}
