'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import {
  MessageSquare, Building2, Inbox, Send, Plus, Search, Filter,
  TrendingUp, AlertCircle, CheckCircle2, Clock3, ExternalLink, Users2,
  Handshake, MapPin, Briefcase, Factory, Plane, Code, Cookie, Wheat, Truck, Flower2,
  Lock, Eye, UserPlus, Link2, Shield, Info, ShieldCheck, ClipboardList, ArrowRight,
} from 'lucide-react';
import { PhaseRoadmapStrip } from '@/components/sections/PhaseRoadmapStrip';
import { Tabs, TabPanel } from '@/components/ui/Tabs';
import { Card, CardTitle, CardDescription } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { Dialog } from '@/components/ui/Dialog';
import { StatusPill } from '@/components/ui/StatusPill';
import { Icon } from '@/components/ui/Icon';
import { MINISTRIES, MINISTRY_LABELS } from '@/lib/data/ministries';
import { useStore } from '@/lib/store';

// ════════════════════════════════════════════════════════════════════
// SPRINT 2 reimplementation — reflects МЭФ April 2026 feedback:
//  • B2B → embed-widget Cooperation.uz (not a duplicate)
//  • NEW «Сообщество» — industry guilds with private profiles
//  • NEW «Подбор партнёров» — match by OKED/region/radius
//  • B2G → dual scenario: E-Ijro integration (Ph3) vs МЭФ manual routing (Ph1)
//  • Admin → routing queue for МЭФ operators
// ════════════════════════════════════════════════════════════════════

// ─── B2B listings (sourced from Cooperation.uz) ───
const B2B_LISTINGS = [
  { id: 'COOP-2026-14821', type: 'offer',  title: 'Хлопковая пряжа 20/1, 50 тонн/мес', company: 'ООО «Текстиль Наманган»',   inn: '205 *** 481', price: '$3.20/кг',          region: 'Наманганская обл.', date: '14 апр 2026', source: 'Cooperation.uz' },
  { id: 'COOP-2026-14794', type: 'demand', title: 'Ищу: упаковка картон A4, от 10 тыс. шт', company: 'ИП Каримов А.',        inn: '301 *** 117', price: 'договорная',        region: 'г. Ташкент',        date: '13 апр 2026', source: 'Cooperation.uz' },
  { id: 'COOP-2026-14763', type: 'offer',  title: 'IT-аутсорсинг (React/Node, 8 чел.)',   company: 'ООО «Digital Uzb»',      inn: '301 *** 902', price: '$25–40/час',        region: 'г. Ташкент',        date: '12 апр 2026', source: 'Cooperation.uz' },
  { id: 'COOP-2026-14721', type: 'demand', title: 'Ищу: грузоперевозка Ташкент–Самарканд', company: 'ООО «Производство+»',   inn: '305 *** 488', price: '6 млн сум/мес',     region: 'Самаркандская обл.', date: '11 апр 2026', source: 'Cooperation.uz' },
  { id: 'COOP-2026-14689', type: 'offer',  title: 'Складские услуги 500 м², класс B',    company: 'ООО «Логистика Ташкент»', inn: '301 *** 554', price: 'от 25 тыс. сум/м²', region: 'Ташкентская обл.',  date: '10 апр 2026', source: 'Cooperation.uz' },
];

// ─── My applications with E-Ijro-aligned statuses ───
const MY_APPLICATIONS = [
  { id: 'YARP-COM-2026-0142', title: 'Обращение в ГНК: разъяснение по НДС',          to: 'Налоговый комитет',      routing: 'mef-manual' as const, status: 'in-review' as const,  statusLabel: 'У исполнителя · МЭФ отправил',   date: '10 апр 2026', sla: '18 дней' },
  { id: 'YARP-COM-2026-0128', title: 'Запрос справки в Минюст',                       to: 'Министерство юстиции',   routing: 'mef-manual' as const, status: 'approved' as const,   statusLabel: 'Ответ получен',                  date: '05 апр 2026', sla: 'исполнено за 12 дн.' },
  { id: 'YARP-COM-2026-0115', title: 'Жалоба в Антимонопольный комитет',              to: 'Антимоноп. комитет',      routing: 'mef-manual' as const, status: 'submitted' as const,  statusLabel: 'На маршрутизации МЭФ',           date: '02 апр 2026', sla: 'SLA 3 дн.' },
  { id: 'YARP-COM-2026-0097', title: 'Консультация по таможенной пошлине',            to: 'Таможенный комитет',      routing: 'mef-manual' as const, status: 'approved' as const,   statusLabel: 'Ответ получен',                  date: '28 мар 2026', sla: 'исполнено за 9 дн.' },
];

const ADMIN_BY_AGENCY = [
  { agency: 'ГНК',     count: 842 },
  { agency: 'Минюст',  count: 517 },
  { agency: 'Таможня', count: 402 },
  { agency: 'МЭФ',    count: 364 },
  { agency: 'IT-парк', count: 298 },
  { agency: 'Давактив', count: 201 },
  { agency: 'Кадастр', count: 156 },
  { agency: 'Антимон.', count: 67 },
];

// ─── NEW: Community industry guilds (отраслевые гильдии) ───
interface GuildPost {
  author: string;
  company: string;
  text: string;
  time: string;
  replies: number;
  visibility: 'public' | 'members';
}

interface Guild {
  id: string;
  name: string;
  Icon: typeof Factory;
  members: number;
  online: number;
  description: string;
  topPost?: GuildPost;
}

const GUILDS: Guild[] = [
  {
    id: 'textile',
    name: 'Текстильщики',
    Icon: Factory,
    members: 843,
    online: 52,
    description: 'Хлопок, пряжа, ткани, готовая одежда. Экспорт в СНГ и Турцию.',
    topPost: {
      author: 'Алишер К.',
      company: 'ООО «Karimov Tekstil»',
      text: 'Коллеги, кто возит в Россию? После апрельских квот ищу логистический маршрут до Екатеринбурга.',
      time: '2 ч назад',
      replies: 7,
      visibility: 'members',
    },
  },
  {
    id: 'tourism',
    name: 'Туризм и авиабилеты',
    Icon: Plane,
    members: 412,
    online: 34,
    description: 'Туроператоры, турагенты, отели, билетные B2B-агрегаторы.',
    topPost: {
      author: 'Диёра С.',
      company: 'Silk Road Travel',
      text: 'Поделитесь опытом работы с новой системой электронной визы — какие лайфхаки при оформлении для групп от 10 чел?',
      time: '5 ч назад',
      replies: 12,
      visibility: 'public',
    },
  },
  {
    id: 'it',
    name: 'IT и сервисы',
    Icon: Code,
    members: 1207,
    online: 128,
    description: 'SaaS, аутсорсинг, интеграции, резидентство IT-парка.',
    topPost: {
      author: 'Тимур Б.',
      company: 'BrightDev',
      text: 'Ищу партнёров для тендера на 1.2 млрд сум (госзаказ, банковский CRM). Нужны Angular и интеграция с E-Imzo.',
      time: '1 ч назад',
      replies: 4,
      visibility: 'members',
    },
  },
  {
    id: 'bakery',
    name: 'Пекари и общепит',
    Icon: Cookie,
    members: 286,
    online: 19,
    description: 'Пекарни, кондитерские, кафе, столовые, сеть кофеен.',
    topPost: {
      author: 'Мадина Р.',
      company: 'Non Dunyo',
      text: 'Меняем поставщика муки — кто работает с «Бухара Дон» или «Чирчик Мельница»? Интересует стабильность качества.',
      time: '3 ч назад',
      replies: 6,
      visibility: 'public',
    },
  },
  {
    id: 'agri',
    name: 'АПК и фермеры',
    Icon: Wheat,
    members: 1584,
    online: 89,
    description: 'Растениеводство, животноводство, переработка, семена, с/х техника.',
  },
  {
    id: 'logistics',
    name: 'Логистика и доставка',
    Icon: Truck,
    members: 378,
    online: 41,
    description: 'Грузоперевозки, склады, таможенное брокерство, последняя миля.',
  },
  {
    id: 'beauty',
    name: 'Beauty и услуги',
    Icon: Flower2,
    members: 542,
    online: 28,
    description: 'Салоны красоты, барбершопы, косметология, wellness, фитнес.',
  },
];

// ─── NEW: Partner match results ───
const MATCH_POOL = [
  { inn: '205 *** 118', name: 'ООО «Хлопкопрядильная фабрика Наманган»', oked: '13.10', industry: 'Текстиль', region: 'Наманганская обл.', distance: 42, rating: 4.6, verified: true,  employees: '~180' },
  { inn: '205 *** 472', name: 'ООО «Yetti Gul Tekstil»',                inn2: '205 *** 472', oked: '13.20', industry: 'Текстиль', region: 'Наманганская обл.', distance: 56, rating: 4.2, verified: true,  employees: '~95' },
  { inn: '205 *** 883', name: 'ИП Юлдашев Ф.',                           oked: '13.10', industry: 'Текстиль', region: 'Ферганская обл.',    distance: 84, rating: 4.0, verified: false, employees: '~15' },
  { inn: '305 *** 221', name: 'ООО «Samarqand Cotton»',                  oked: '13.10', industry: 'Текстиль', region: 'Самаркандская обл.', distance: 120, rating: 4.4, verified: true, employees: '~210' },
  { inn: '306 *** 145', name: 'ООО «Buxoro Ip»',                         oked: '13.20', industry: 'Текстиль', region: 'Бухарская обл.',     distance: 340, rating: 4.1, verified: true, employees: '~60' },
];

// ─── NEW: Admin routing queue ───
const ROUTING_QUEUE = [
  { id: 'YARP-COM-2026-0198', from: 'ООО «Караван Агро»',             inn: '305 *** 118', subject: 'Жалоба: задержка выплаты субсидии M-104 с 15.03.2026',                type: 'complaint',     priority: 'high',   received: '2 ч назад', suggestedAgency: 'МЭФ'     },
  { id: 'YARP-COM-2026-0197', from: 'ИП Нодиров Б.',                   inn: '301 *** 442', subject: 'Разъяснение: применение НДС 10% к услугам IT-аутсорсинга в 2026',     type: 'question',      priority: 'medium', received: '4 ч назад', suggestedAgency: 'Налоговый комитет' },
  { id: 'YARP-COM-2026-0196', from: 'ООО «Textile Factory»',           inn: '205 *** 881', subject: 'Предложение: упрощение процедуры экспорта в ЕАЭС для МСБ текстиля',   type: 'proposal',      priority: 'low',    received: '6 ч назад', suggestedAgency: 'Минэкономики' },
  { id: 'YARP-COM-2026-0195', from: 'ИП Худойбердиев С.',              inn: '303 *** 552', subject: 'Запрос справки: о налоговых обязательствах за Q1 2026',                type: 'request',       priority: 'medium', received: '8 ч назад', suggestedAgency: 'Налоговый комитет' },
  { id: 'YARP-COM-2026-0194', from: 'ООО «Namangan Logistics»',        inn: '205 *** 668', subject: 'Жалоба: длительное таможенное оформление на посту Дустлик',            type: 'complaint',     priority: 'high',   received: '11 ч назад', suggestedAgency: 'Таможенный комитет' },
];

export function A_Communications() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Sprint 11 — deep-link support: ?tab=b2g|b2b|community|match|my|admin
  // The URL is the source of truth. Clicking a tab updates the URL;
  // landing from a chip/deep-link immediately opens the right tab.
  const validTabs = ['b2b', 'community', 'match', 'b2g', 'my', 'admin'];
  const urlTab = searchParams.get('tab');
  const initialTab = urlTab && validTabs.includes(urlTab) ? urlTab : 'b2b';

  const [tab, setTabInternal] = useState<string>(initialTab);

  // Keep tab in sync when the URL changes externally (back-forward, chip clicks
  // while already on the module page).
  useEffect(() => {
    if (urlTab && validTabs.includes(urlTab) && urlTab !== tab) {
      setTabInternal(urlTab);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlTab]);

  const setTab = (next: string) => {
    setTabInternal(next);
    // Write tab into URL, preserve other params. Only write when value differs
    // from current URL — avoids a no-op history entry.
    const params = new URLSearchParams(searchParams.toString());
    if (next === 'b2b') {
      params.delete('tab'); // b2b is the default, keep URL clean
    } else {
      params.set('tab', next);
    }
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  const [b2bFilter, setB2bFilter] = useState<'all' | 'offer' | 'demand'>('all');
  const [contactOpen, setContactOpen] = useState<string | null>(null);
  const [createListingOpen, setCreateListingOpen] = useState(false);
  const [openGuild, setOpenGuild] = useState<Guild | null>(null);
  const [b2gScenario, setB2gScenario] = useState<'mef-manual' | 'e-ijro'>('mef-manual');
  const [matchForm, setMatchForm] = useState({ oked: '', region: 'any', radius: '100' });
  const [matchesShown, setMatchesShown] = useState(false);
  const role = useStore((s) => s.role);

  const filteredListings = B2B_LISTINGS.filter((l) => b2bFilter === 'all' || l.type === b2bFilter);
  const isMef = role === 'mef';

  return (
    <>
      <PhaseRoadmapStrip
        currentPhase={1}
        points={[
          { phase: 2, text: 'B2B-витрина через embed-widget Cooperation.uz' },
          { phase: 1, text: 'Новая вкладка «Сообщество» — 7 отраслевых гильдий с профилями' },
          { phase: 1, text: 'Подбор партнёров по ОКЭД, региону и радиусу' },
          { phase: 1, text: 'B2G — ручная маршрутизация через админку МЭФ (до E-Ijro)' },
          { phase: 2, text: 'Публичное обсуждение функциональности с ведомствами и отраслевыми ассоциациями' },
          { phase: 3, text: 'Интеграция с E-Ijro: автомаршрутизация обращений с SLA-контролем', blockedBy: 'PKM + кибер-экспертиза' },
          { phase: 3, text: 'Приватные чаты между предпринимателями (продакшн)' },
          { phase: 4, text: 'Интеграция с отраслевыми Telegram-каналами и ассоциациями' },
        ]}
      />

      <section className="container-wide py-10 md:py-12">
        <Tabs
          items={[
            { id: 'b2b',       label: 'B2B · Cooperation',  icon: <Handshake className="h-4 w-4" /> },
            { id: 'community', label: 'Сообщество',          icon: <Users2 className="h-4 w-4" /> },
            { id: 'match',     label: 'Подбор партнёров',    icon: <Link2 className="h-4 w-4" /> },
            { id: 'b2g',       label: 'B2G · ведомства',     icon: <Building2 className="h-4 w-4" /> },
            { id: 'my',        label: 'Мои обращения',       icon: <Inbox className="h-4 w-4" /> },
            ...(isMef ? [{ id: 'admin', label: 'Админ · маршрутизация', icon: <ShieldCheck className="h-4 w-4" /> }] : []),
          ]}
          value={tab}
          onChange={setTab}
        />

        {/* ═══════════════ B2B · Cooperation ═══════════════ */}
        <TabPanel active={tab === 'b2b'}>
          <div className="surface-card bg-secondary/5 border-secondary/30 p-4 mb-5 flex items-start gap-3">
            <Info className="h-5 w-5 text-secondary shrink-0 mt-0.5" />
            <div className="text-sm text-ink leading-relaxed">
              <strong className="font-serif text-ink">Объявления публикуются и обслуживаются на Cooperation.uz</strong> — Платформа
              встраивает витрину через embed-widget (ДКМ-регулируемое B2B-поле). Статус каждой карточки привязан к первоисточнику,
              регистрация новых объявлений происходит в системе-владельце.
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 mb-6">
            <div className="flex items-center gap-1.5 bg-bg-band rounded-lg p-1">
              {[
                { id: 'all', label: 'Все' },
                { id: 'offer', label: 'Предложения' },
                { id: 'demand', label: 'Запросы' },
              ].map((f) => {
                const active = b2bFilter === f.id;
                return (
                  <button
                    key={f.id}
                    onClick={() => setB2bFilter(f.id as typeof b2bFilter)}
                    className={`h-9 px-3 rounded-md text-sm font-medium transition-all ${
                      active ? 'bg-bg-white text-ink shadow-subtle' : 'text-ink-muted hover:text-ink'
                    }`}
                  >
                    {f.label}
                  </button>
                );
              })}
            </div>
            <div className="flex-1 min-w-[200px] max-w-md">
              <Input leftIcon={<Search className="h-4 w-4" />} placeholder="Поиск по объявлениям…" />
            </div>
            <Button leftIcon={<Plus className="h-4 w-4" />} onClick={() => setCreateListingOpen(true)}>
              Разместить в Cooperation
            </Button>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {filteredListings.map((l, i) => (
              <motion.div
                key={l.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.04 }}
              >
                <Card hover className="h-full">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <Badge variant={l.type === 'offer' ? 'success' : 'info'}>
                      {l.type === 'offer' ? 'Предложение' : 'Запрос'}
                    </Badge>
                    <span className="text-xs text-ink-muted">{l.date}</span>
                  </div>
                  <CardTitle className="text-[16px] leading-snug">{l.title}</CardTitle>
                  <div className="mt-3 space-y-1.5 text-sm text-ink-muted">
                    <div className="flex items-center gap-2"><Building2 className="h-3.5 w-3.5" /> {l.company}</div>
                    <div className="text-[11px] font-mono text-ink-muted/80">ИНН {l.inn}</div>
                    <div>Цена: <span className="text-ink font-medium">{l.price}</span></div>
                    <div>Регион: <span className="text-ink">{l.region}</span></div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-ink-line flex items-center justify-between">
                    <div className="text-[11px] text-ink-muted flex items-center gap-1">
                      <Link2 className="h-3 w-3" /> {l.source} · {l.id}
                    </div>
                    <Button size="sm" variant="ghost" rightIcon={<ExternalLink className="h-3.5 w-3.5" />}>
                      Открыть
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabPanel>

        {/* ═══════════════ Сообщество ═══════════════ */}
        <TabPanel active={tab === 'community'}>
          <div className="surface-card bg-gold-soft/40 border-gold/25 p-4 mb-6 flex items-start gap-3">
            <Users2 className="h-5 w-5 text-gold shrink-0 mt-0.5" />
            <div className="text-sm text-ink leading-relaxed">
              <strong className="font-serif text-ink">Отраслевые гильдии без ДКМ-надзора.</strong>{' '}
              Инструмент для отраслевой коммуникации по модели текстильщиков Турции и туристических
              B2B-каналов. Два режима видимости: публичный профиль (видят все) и по приглашению (только участники гильдии).
              Приватные сообщения — 1 на 1.
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {GUILDS.map((g, i) => (
              <motion.button
                key={g.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.04 }}
                onClick={() => setOpenGuild(g)}
                className="text-left"
              >
                <Card hover className="h-full">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="h-10 w-10 rounded-xl bg-gold/10 text-gold flex items-center justify-center shrink-0">
                      <g.Icon className="h-5 w-5" />
                    </div>
                    <div className="text-right text-xs">
                      <div className="font-mono text-ink font-semibold">{g.members.toLocaleString('ru')}</div>
                      <div className="text-ink-muted">участников</div>
                    </div>
                  </div>
                  <CardTitle className="text-[15px] leading-snug">{g.name}</CardTitle>
                  <CardDescription className="mt-1.5 text-[12.5px]">{g.description}</CardDescription>

                  {g.topPost && (
                    <div className="mt-4 p-3 rounded-lg bg-bg-band/60 border border-ink-line/50">
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="text-[11px] text-ink-muted font-medium">{g.topPost.author} · {g.topPost.company}</div>
                        {g.topPost.visibility === 'members' ? (
                          <Lock className="h-3 w-3 text-ink-muted" />
                        ) : (
                          <Eye className="h-3 w-3 text-success" />
                        )}
                      </div>
                      <div className="text-[12.5px] text-ink leading-snug line-clamp-2">{g.topPost.text}</div>
                      <div className="mt-2 text-[11px] text-gold flex items-center gap-2">
                        <MessageSquare className="h-3 w-3" />
                        {g.topPost.replies} ответов · {g.topPost.time}
                      </div>
                    </div>
                  )}

                  <div className="mt-4 pt-3 border-t border-ink-line/60 flex items-center justify-between text-[11px]">
                    <div className="flex items-center gap-1 text-success">
                      <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
                      {g.online} онлайн
                    </div>
                    <div className="text-gold font-medium">Войти в гильдию →</div>
                  </div>
                </Card>
              </motion.button>
            ))}
          </div>
        </TabPanel>

        {/* ═══════════════ Подбор партнёров ═══════════════ */}
        <TabPanel active={tab === 'match'}>
          <div className="surface-card bg-success/5 border-success/25 p-4 mb-6 flex items-start gap-3">
            <Link2 className="h-5 w-5 text-success shrink-0 mt-0.5" />
            <div className="text-sm text-ink leading-relaxed">
              <strong className="font-serif text-ink">Подбор партнёров по ОКЭД, региону и радиусу.</strong>{' '}
              Ищем поставщиков и клиентов из реестра МСБ с геопривязкой.
              В Фазе 3 подключится фильтр по рейтингу надёжности контрагента из модуля «Проверка контрагента».
            </div>
          </div>

          <Card padding="lg" className="mb-6">
            <div className="grid md:grid-cols-4 gap-4">
              <div>
                <Input
                  label="ОКЭД или ключевое слово"
                  placeholder="Например: 13.10 или хлопок"
                  value={matchForm.oked}
                  onChange={(e) => setMatchForm({ ...matchForm, oked: e.target.value })}
                />
              </div>
              <div>
                <Select
                  label="Регион"
                  value={matchForm.region}
                  onChange={(e) => setMatchForm({ ...matchForm, region: e.target.value })}
                  options={[
                    { value: 'any', label: 'Любой регион' },
                    { value: 'tashkent', label: 'г. Ташкент' },
                    { value: 'namangan', label: 'Наманганская обл.' },
                    { value: 'fergana', label: 'Ферганская обл.' },
                    { value: 'samarkand', label: 'Самаркандская обл.' },
                    { value: 'bukhara', label: 'Бухарская обл.' },
                  ]}
                />
              </div>
              <div>
                <Select
                  label="Радиус поиска"
                  value={matchForm.radius}
                  onChange={(e) => setMatchForm({ ...matchForm, radius: e.target.value })}
                  options={[
                    { value: '50',  label: 'до 50 км' },
                    { value: '100', label: 'до 100 км' },
                    { value: '250', label: 'до 250 км' },
                    { value: '500', label: 'до 500 км' },
                    { value: 'any', label: 'не ограничен' },
                  ]}
                />
              </div>
              <div className="flex items-end">
                <Button
                  className="w-full"
                  leftIcon={<Search className="h-4 w-4" />}
                  onClick={() => setMatchesShown(true)}
                >
                  Найти партнёров
                </Button>
              </div>
            </div>
          </Card>

          {matchesShown && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
              <div className="flex items-center justify-between mb-4">
                <div className="font-serif text-lg text-ink">
                  Найдено {MATCH_POOL.length} подходящих МСБ
                </div>
                <div className="text-xs text-ink-muted">
                  По ОКЭД 13.10 · в радиусе 500 км от г. Ташкент
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-3">
                {MATCH_POOL.map((m, i) => (
                  <motion.div
                    key={m.inn}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.05 }}
                  >
                    <Card hover>
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-[15px] leading-tight">{m.name}</CardTitle>
                          <div className="text-[11px] font-mono text-ink-muted mt-0.5">ИНН {m.inn}</div>
                        </div>
                        {m.verified && (
                          <Badge variant="success">
                            <ShieldCheck className="h-3 w-3" />верифицирован
                          </Badge>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs text-ink-muted mt-2">
                        <div>ОКЭД: <span className="text-ink font-medium">{m.oked}</span></div>
                        <div>Отрасль: <span className="text-ink">{m.industry}</span></div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" /> {m.region}
                        </div>
                        <div>~ {m.distance} км · {m.employees}</div>
                      </div>
                      <div className="mt-3 pt-3 border-t border-ink-line/60 flex items-center justify-between">
                        <div className="text-xs text-gold font-medium">
                          ★ {m.rating.toFixed(1)} · рейтинг надёжности
                        </div>
                        <Button size="sm" variant="ghost" rightIcon={<Send className="h-3 w-3" />}>
                          Написать
                        </Button>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </TabPanel>

        {/* ═══════════════ B2G · ведомства (dual scenario) ═══════════════ */}
        <TabPanel active={tab === 'b2g'}>
          <div className="surface-card bg-bg-band/60 border-ink-line p-4 mb-6 flex items-start gap-3">
            <Shield className="h-5 w-5 text-gold shrink-0 mt-0.5" />
            <div className="text-sm text-ink leading-relaxed">
              <strong className="font-serif text-ink">До интеграции с E-Ijro — ручная маршрутизация через МЭФ.</strong>{' '}
              Обращение поступает в МЭФ, оператор направляет в профильное ведомство или отвечает сам, SLA 3 дня.
              Интеграция с <strong>ijro.gov.uz</strong> (система исполнительской дисциплины с персональной
              ответственностью руководителей) — вторая волна после выхода PKM и 3-ступенчатой кибер-экспертизы (Ф3).
              Канал доставки можно выбрать в самой форме обращения.
            </div>
          </div>

          <div className="mb-6 text-ink-muted">
            Нажмите на ведомство, чтобы подать обращение.
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {MINISTRIES.map((m, i) => (
              <motion.button
                key={m.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.04 }}
                onClick={() => setContactOpen(m.id)}
                className="text-left group surface-card surface-card-hover p-5 focus-ring"
              >
                <div className="h-12 w-12 rounded-full bg-gold/10 text-gold flex items-center justify-center mb-3 group-hover:bg-gold group-hover:text-white transition-colors">
                  <Icon name={m.iconName} className="h-5 w-5" />
                </div>
                <div className="font-serif font-semibold text-ink text-[15px] leading-tight">
                  {MINISTRY_LABELS[m.nameKey].ru}
                </div>
                <div className="mt-1.5 text-xs text-ink-muted">
                  {MINISTRY_LABELS[m.jurisdictionKey].ru}
                </div>
                <div className="mt-4 text-sm text-gold font-medium">Написать обращение →</div>
              </motion.button>
            ))}
          </div>
        </TabPanel>

        {/* ═══════════════ Мои обращения ═══════════════ */}
        <TabPanel active={tab === 'my'}>
          <div className="surface-card overflow-hidden">
            <div className="px-5 py-4 bg-bg-band border-b border-ink-line flex items-center gap-3">
              <Inbox className="h-5 w-5 text-ink-muted" />
              <div className="font-serif font-semibold">Мои обращения в ведомства</div>
              <span className="ml-auto text-sm text-ink-muted">{MY_APPLICATIONS.length} обращений</span>
            </div>
            <div className="divide-y divide-ink-line">
              {MY_APPLICATIONS.map((a) => (
                <div key={a.id} className="px-5 py-4 hover:bg-bg-band/50 transition-colors flex items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-ink leading-tight">{a.title}</div>
                    <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink-muted">
                      <span className="font-mono">{a.id}</span>
                      <span>· {a.to}</span>
                      <span>· {a.date}</span>
                      <span className="text-gold">· {a.sla}</span>
                    </div>
                    <div className="mt-1 text-[11px] text-ink-muted">
                      Канал: {a.routing === 'mef-manual' ? 'ручная маршрутизация МЭФ' : 'E-Ijro'}
                    </div>
                  </div>
                  <StatusPill status={a.status} label={a.statusLabel} />
                </div>
              ))}
            </div>
          </div>
        </TabPanel>

        {/* ═══════════════ Admin · routing (МЭФ only) ═══════════════ */}
        {isMef && (
          <TabPanel active={tab === 'admin'}>
            <div className="grid md:grid-cols-4 gap-4 mb-6">
              {[
                { num: '2 847', label: 'Всего обращений', tone: 'navy', Icon: MessageSquare },
                { num: '67',    label: 'В очереди на маршрут', tone: 'gold', Icon: Clock3 },
                { num: '2 290', label: 'Закрыто',         tone: 'success', Icon: CheckCircle2 },
                { num: '134',   label: 'Просрочено',      tone: 'danger', Icon: AlertCircle },
              ].map((k) => {
                const bgTone =
                  k.tone === 'navy' ? 'bg-navy text-white'
                  : k.tone === 'gold' ? 'bg-gold/10 text-gold'
                  : k.tone === 'success' ? 'bg-success/10 text-success'
                  : 'bg-danger/10 text-danger';
                return (
                  <Card key={k.label}>
                    <div className={`inline-flex h-10 w-10 rounded-xl items-center justify-center mb-3 ${bgTone}`}>
                      <k.Icon className="h-5 w-5" />
                    </div>
                    <div className="kpi-number text-ink">{k.num}</div>
                    <div className="mt-1 text-sm text-ink-muted">{k.label}</div>
                  </Card>
                );
              })}
            </div>

            {/* Routing queue */}
            <Card padding="lg" className="mb-6">
              <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <ClipboardList className="h-5 w-5 text-gold" />
                    <CardTitle>Очередь маршрутизации B2G</CardTitle>
                    <Badge variant="priority">SLA 3 дн.</Badge>
                  </div>
                  <CardDescription className="mt-1">
                    До интеграции с E-Ijro обращения приходят в МЭФ — оператор направляет в ведомство
                    или отвечает сам. После интеграции (Ф3) — автоматически.
                  </CardDescription>
                </div>
                <div className="text-xs text-ink-muted">
                  Обновлено 2 мин назад
                </div>
              </div>

              <div className="space-y-2">
                {ROUTING_QUEUE.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-lg border border-ink-line bg-bg-band/40 hover:bg-bg-band/80 hover:border-gold/40 transition-all"
                  >
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                          <PriorityBadge level={item.priority as 'high' | 'medium' | 'low'} />
                          <TypeBadge type={item.type as 'complaint' | 'question' | 'proposal' | 'request'} />
                          <span className="text-[11px] font-mono text-ink-muted">{item.id}</span>
                          <span className="text-[11px] text-ink-muted">· {item.received}</span>
                        </div>
                        <div className="font-medium text-ink leading-snug mb-1">{item.subject}</div>
                        <div className="text-xs text-ink-muted">
                          От: <strong>{item.from}</strong> · ИНН <span className="font-mono">{item.inn}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Select
                          value={item.suggestedAgency}
                          options={[
                            { value: 'МЭФ',                label: 'МЭФ (ответим сами)' },
                            { value: 'Налоговый комитет',  label: 'ГНК' },
                            { value: 'Минюст',             label: 'Минюст' },
                            { value: 'Таможенный комитет', label: 'Таможня' },
                            { value: 'Минэкономики',       label: 'Минэкономики' },
                            { value: 'Антимоноп. комитет', label: 'Антимонопольный' },
                            { value: 'Давактив',           label: 'Давактив' },
                            { value: 'IT-парк',            label: 'IT-парк' },
                          ]}
                          onChange={() => {}}
                        />
                        <Button size="sm" leftIcon={<ArrowRight className="h-3.5 w-3.5" />}>
                          Направить
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card>
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="h-5 w-5 text-gold" />
                <CardTitle>Распределение обращений по ведомствам</CardTitle>
              </div>
              <div className="h-64">
                <ResponsiveContainer>
                  <BarChart data={ADMIN_BY_AGENCY} margin={{ top: 10, right: 10, bottom: 0, left: -10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis dataKey="agency" tick={{ fontSize: 12, fill: '#5A6575' }} stroke="#E5E7EB" />
                    <YAxis tick={{ fontSize: 12, fill: '#5A6575' }} stroke="#E5E7EB" />
                    <Tooltip
                      contentStyle={{ borderRadius: 8, border: '1px solid #E5E7EB', fontSize: 13 }}
                      cursor={{ fill: '#F5EFE3', opacity: 0.5 }}
                    />
                    <Bar dataKey="count" fill="#8B6F3A" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </TabPanel>
        )}
      </section>

      {/* ═══════════════ Modals ═══════════════ */}

      {/* Ministry contact */}
      <Dialog
        open={contactOpen !== null}
        onClose={() => setContactOpen(null)}
        title={contactOpen ? `Обращение в ${MINISTRY_LABELS[MINISTRIES.find((m) => m.id === contactOpen)!.nameKey].ru}` : ''}
        description="Выберите канал доставки и заполните форму — обращение получит номер в Платформе и будет отслеживаться в «Мои обращения»"
        size="md"
        footer={
          <>
            <Button variant="ghost" onClick={() => setContactOpen(null)}>Отмена</Button>
            <Button leftIcon={<Send className="h-4 w-4" />} onClick={() => setContactOpen(null)}>Отправить</Button>
          </>
        }
      >
        <div className="space-y-4">
          {/* Channel selector */}
          <div>
            <div className="text-xs uppercase tracking-wider text-ink-muted font-semibold mb-2">
              Канал доставки обращения
            </div>
            <div className="grid grid-cols-2 gap-2">
              <ScenarioCard
                id="mef-manual"
                active={b2gScenario === 'mef-manual'}
                onSelect={() => setB2gScenario('mef-manual')}
                title="Через МЭФ"
                subtitle="Активно · SLA 3 дн."
                description="Оператор МЭФ направляет в ведомство или отвечает сам."
                Icon={ClipboardList}
                tone="gold"
                available
              />
              <ScenarioCard
                id="e-ijro"
                active={b2gScenario === 'e-ijro'}
                onSelect={() => setB2gScenario('e-ijro')}
                title="Через E-Ijro"
                subtitle="Ф3 · ждёт PKM"
                description="Автомаршрутизация с персональной ответственностью руководителей."
                Icon={Shield}
                tone="muted"
                available={false}
              />
            </div>
          </div>

          <Select
            label="Тип обращения"
            options={[
              { value: 'q', label: 'Разъяснение / консультация' },
              { value: 'c', label: 'Жалоба' },
              { value: 'p', label: 'Предложение' },
              { value: 'r', label: 'Запрос справки' },
            ]}
          />
          <Input label="Тема" placeholder="Коротко опишите тему обращения" />
          <Textarea label="Текст обращения" placeholder="Подробно изложите суть…" rows={6} />
          <div className="text-xs text-ink-muted">
            По Закону № 445 «Об обращениях физических и юридических лиц» ответ — в срок до 30 дней.
          </div>
        </div>
      </Dialog>

      {/* Create Cooperation listing modal */}
      <Dialog
        open={createListingOpen}
        onClose={() => setCreateListingOpen(false)}
        title="Разместить объявление в Cooperation.uz"
        description="Публикация откроется в системе-владельце. Карточка и статус вернутся в Платформу через embed-widget."
        footer={
          <>
            <Button variant="ghost" onClick={() => setCreateListingOpen(false)}>Отмена</Button>
            <Button
              rightIcon={<ExternalLink className="h-4 w-4" />}
              onClick={() => setCreateListingOpen(false)}
            >
              Перейти в Cooperation
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="p-3 rounded-lg bg-secondary/10 border border-secondary/30 text-xs text-ink-soft flex items-start gap-2">
            <Info className="h-4 w-4 text-secondary mt-0.5 shrink-0" />
            OneID-авторизация будет передана автоматически — повторный вход не потребуется.
          </div>
          <Select
            label="Тип"
            options={[
              { value: 'offer', label: 'Предложение (я продаю / предлагаю)' },
              { value: 'demand', label: 'Запрос (я ищу / покупаю)' },
            ]}
          />
          <Input label="Заголовок" placeholder="Например: Хлопковая пряжа 20/1, 50 тонн/мес" />
          <Textarea label="Описание" placeholder="Характеристики, условия, сроки…" rows={4} />
          <div className="grid sm:grid-cols-2 gap-4">
            <Input label="Цена" placeholder="или «договорная»" />
            <Input label="Регион" placeholder="Ташкент, Наманган…" />
          </div>
        </div>
      </Dialog>

      {/* Guild detail modal */}
      <Dialog
        open={openGuild !== null}
        onClose={() => setOpenGuild(null)}
        title={openGuild ? `Гильдия · ${openGuild.name}` : ''}
        description={openGuild?.description}
        size="md"
        footer={
          <>
            <Button variant="ghost" onClick={() => setOpenGuild(null)}>Закрыть</Button>
            <Button leftIcon={<UserPlus className="h-4 w-4" />}>Вступить в гильдию</Button>
          </>
        }
      >
        {openGuild && (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 rounded-lg bg-bg-band/60">
                <div className="kpi-number text-navy text-2xl">{openGuild.members.toLocaleString('ru')}</div>
                <div className="text-xs text-ink-muted">участников</div>
              </div>
              <div className="p-3 rounded-lg bg-success/10">
                <div className="kpi-number text-success text-2xl">{openGuild.online}</div>
                <div className="text-xs text-ink-muted">сейчас онлайн</div>
              </div>
              <div className="p-3 rounded-lg bg-gold/10">
                <div className="kpi-number text-gold text-2xl">—</div>
                <div className="text-xs text-ink-muted">обсуждений / день</div>
              </div>
            </div>
            <div className="text-sm text-ink-muted leading-relaxed">
              В Фазе 1 гильдия — публичная витрина профилей компаний и ленты обсуждений.
              Приватные чаты 1-на-1 с вложениями и истории сообщений активируются в Фазе 3 после
              прохождения кибер-экспертизы. Модерация — волонтёры из числа участников плюс
              оператор МЭФ по жалобам.
            </div>
          </div>
        )}
      </Dialog>
    </>
  );
}

/* ─────────────── helper subcomponents ─────────────── */

function ScenarioCard({
  active, onSelect, title, subtitle, description, Icon, tone, available,
}: {
  id: string;
  active: boolean;
  onSelect: () => void;
  title: string;
  subtitle: string;
  description: string;
  Icon: typeof ClipboardList;
  tone: 'gold' | 'muted';
  available: boolean;
}) {
  const isGold = tone === 'gold' && active;
  const isMutedAndInactive = tone === 'muted' && !available;

  return (
    <button
      onClick={onSelect}
      disabled={!available}
      className={`text-left p-4 rounded-xl border-2 transition-all group ${
        active && available
          ? 'border-gold bg-gold-soft/40 shadow-sm'
          : isMutedAndInactive
          ? 'border-ink-line bg-bg-band/30 cursor-not-allowed opacity-80'
          : 'border-ink-line bg-bg-white hover:border-gold/50 hover:bg-gold-soft/20'
      }`}
      aria-pressed={active}
    >
      <div className="flex items-start gap-3">
        <div className={`h-10 w-10 rounded-lg flex items-center justify-center shrink-0 ${
          isGold ? 'bg-gold text-white' : 'bg-ink-line text-ink-muted'
        }`}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <div className="font-serif font-semibold text-[15px] text-ink">{title}</div>
            {!available && <Badge variant="queue">Ф3</Badge>}
          </div>
          <div className={`text-xs uppercase tracking-wide mt-0.5 font-medium ${
            available ? 'text-gold-dark' : 'text-ink-muted'
          }`}>
            {subtitle}
          </div>
          <div className="text-xs text-ink-muted leading-relaxed mt-2">{description}</div>
        </div>
      </div>
    </button>
  );
}

function PriorityBadge({ level }: { level: 'high' | 'medium' | 'low' }) {
  if (level === 'high')   return <Badge variant="danger">срочно</Badge>;
  if (level === 'medium') return <Badge variant="warning">средний</Badge>;
  return <Badge variant="queue">низкий</Badge>;
}

function TypeBadge({ type }: { type: 'complaint' | 'question' | 'proposal' | 'request' }) {
  const map = {
    complaint: { label: 'жалоба',    variant: 'danger' as const },
    question:  { label: 'вопрос',    variant: 'info' as const },
    proposal:  { label: 'предложение', variant: 'success' as const },
    request:   { label: 'запрос',    variant: 'outline' as const },
  };
  return <Badge variant={map[type].variant}>{map[type].label}</Badge>;
}
