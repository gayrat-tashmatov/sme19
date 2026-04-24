'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Cell } from 'recharts';
import {
  MapPin, Warehouse, TrendingUp, Briefcase, Users2, Sparkles, Plus, ShieldCheck, LandPlot,
  Gavel, Building2, Factory, Search, Filter, Calendar, Coins, ExternalLink, ArrowRight,
} from 'lucide-react';
import { Tabs, TabPanel } from '@/components/ui/Tabs';
import { Card, CardTitle, CardDescription } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Dialog } from '@/components/ui/Dialog';
import { useT } from '@/lib/i18n';
import { useStore } from '@/lib/store';
import { UzMap } from './D_UzMap';
import { REGIONS } from '@/lib/data/regions';
import { LOTS, getLotsByRegion } from '@/lib/data/davaktiv_lots';
import { PhaseRoadmapStrip } from '@/components/sections/PhaseRoadmapStrip';

// ═══════════════════════════════════════════════════════════════════
// Sprint 4 · District drill-down (Mock — until Online Mahalla integration in Ph3)
// 4 sample districts per region for demo.
// ═══════════════════════════════════════════════════════════════════

interface DistrictSummary {
  id: string;
  name: string;
  smeCount: number;
  topIndustry: string;
  lots: number;
  passportState: 'complete' | 'partial' | 'missing';
  specialization: string;
  opportunities: string[];
}

const DISTRICTS_BY_REGION: Record<string, DistrictSummary[]> = {
  samarkand: [
    { id: 'samarkand-city', name: 'Самарканд · город',  smeCount: 8240, topIndustry: 'Торговля', lots: 24, passportState: 'complete',
      specialization: 'Туризм · текстиль · торговля · услуги', opportunities: ['Гостиничный бизнес в охранной зоне', 'Сувенирная продукция', 'Рестораны национальной кухни'] },
    { id: 'urgut', name: 'Ургут', smeCount: 4120, topIndustry: 'АПК', lots: 12, passportState: 'complete',
      specialization: 'Чайная промышленность · плодоводство', opportunities: ['Переработка сухофруктов', 'Производство чайных смесей'] },
    { id: 'kattakurgan-city', name: 'Каттакурган · город', smeCount: 4890, topIndustry: 'Производство', lots: 18, passportState: 'complete',
      specialization: 'Пищепром · стройматериалы', opportunities: ['Модернизация мукомолья', 'Кирпичное производство'] },
    { id: 'koshrabad', name: 'Кошрабад', smeCount: 2890, topIndustry: 'АПК', lots: 8, passportState: 'partial',
      specialization: 'Хлопководство · животноводство', opportunities: ['Молочная переработка', 'Кормопроизводство'] },
  ],
  tashkent_c: [
    { id: 'yashnabad', name: 'Яшнабадский р-н', smeCount: 12400, topIndustry: 'Услуги', lots: 34, passportState: 'complete',
      specialization: 'ИТ · финансы · торговля · услуги', opportunities: ['IT-аутсорсинг', 'Коворкинги', 'Сервисы доставки'] },
    { id: 'mirzo-ulugbek', name: 'Мирзо-Улугбекский р-н', smeCount: 15200, topIndustry: 'Услуги', lots: 28, passportState: 'complete',
      specialization: 'Медицина · образование · ИТ', opportunities: ['Частные клиники', 'EdTech', 'Медлаборатории'] },
    { id: 'chilanzar', name: 'Чиланзарский р-н', smeCount: 11800, topIndustry: 'Торговля', lots: 42, passportState: 'complete',
      specialization: 'Потребительский рынок · общепит', opportunities: ['Сеть пекарен', 'Детские развивающие центры'] },
    { id: 'bektemir', name: 'Бектемирский р-н', smeCount: 3400, topIndustry: 'Производство', lots: 16, passportState: 'partial',
      specialization: 'Промзона · логистика', opportunities: ['Склады класса B', 'Пищевое производство'] },
  ],
  namangan: [
    { id: 'chust', name: 'Чуст', smeCount: 3250, topIndustry: 'Ремёсла', lots: 6, passportState: 'complete',
      specialization: 'Национальные ремёсла (ножи, тюбетейки)', opportunities: ['Экспорт ремесленной продукции', 'Туристические мастер-классы'] },
    { id: 'pop', name: 'Пап', smeCount: 2850, topIndustry: 'АПК', lots: 4, passportState: 'partial',
      specialization: 'Плодоводство · коконы', opportunities: ['Сушильные комплексы', 'Шелкопрядение'] },
    { id: 'namangan-city', name: 'Наманган · город', smeCount: 7600, topIndustry: 'Текстиль', lots: 18, passportState: 'complete',
      specialization: 'Текстильный кластер', opportunities: ['Крашение тканей', 'Готовая одежда для экспорта'] },
    { id: 'kosonsoy', name: 'Касансайский р-н', smeCount: 1980, topIndustry: 'АПК', lots: 3, passportState: 'missing',
      specialization: 'Требуется заполнение', opportunities: [] },
  ],
  ferghana: [
    { id: 'margilon', name: 'Маргилан', smeCount: 4500, topIndustry: 'Текстиль', lots: 9, passportState: 'complete',
      specialization: 'Шёлкопрядение · хан-атлас', opportunities: ['Туристические шёлковые туры', 'Экспорт шёлковых изделий'] },
    { id: 'kuva', name: 'Кува', smeCount: 2100, topIndustry: 'АПК', lots: 5, passportState: 'complete',
      specialization: 'Гранатоводство · переработка', opportunities: ['Гранатовый сок', 'Сушёные фрукты на экспорт'] },
    { id: 'ferghana-city', name: 'Фергана · город', smeCount: 6800, topIndustry: 'Услуги', lots: 20, passportState: 'complete',
      specialization: 'Услуги · торговля · нефтехимия', opportunities: ['Логистические хабы', 'Сервис для нефтехимии'] },
    { id: 'rishton', name: 'Риштан', smeCount: 1750, topIndustry: 'Керамика', lots: 2, passportState: 'partial',
      specialization: 'Знаменитая керамика Риштана', opportunities: ['Экспорт керамики', 'Туристические мастерские'] },
  ],
  bukhara: [
    { id: 'bukhara-city', name: 'Бухара · город', smeCount: 6200, topIndustry: 'Туризм', lots: 22, passportState: 'complete',
      specialization: 'Туризм · ремёсла · сувениры', opportunities: ['Бутик-отели', 'Гиды и турфирмы', 'Сувенирная мастерская'] },
    { id: 'gijduvan', name: 'Гиждуван', smeCount: 2100, topIndustry: 'Керамика', lots: 4, passportState: 'complete',
      specialization: 'Керамика · национальная одежда', opportunities: ['Экспорт керамики', 'Пошив национальной одежды'] },
    { id: 'kagan', name: 'Каган', smeCount: 2850, topIndustry: 'Логистика', lots: 10, passportState: 'partial',
      specialization: 'Ж/д узел · логистика', opportunities: ['Таможенные склады', 'Оптовая торговля'] },
    { id: 'vabkent', name: 'Вабкент', smeCount: 1650, topIndustry: 'АПК', lots: 2, passportState: 'missing',
      specialization: 'Требуется заполнение', opportunities: [] },
  ],
};

function getDistrictsForRegion(regionId: string): DistrictSummary[] {
  return DISTRICTS_BY_REGION[regionId] ?? [];
}
import { cn } from '@/lib/cn';

const USER_HOME_REGION = 'tashkent_c'; // Алишер Каримов — entrepreneur persona lives here

export function DGeoanalytics() {
  // const t = useT(); // currently unused
  const role = useStore((s) => s.role);
  const setGlobalRegion = useStore((s) => s.setSelectedRegion);

  // Sprint 11 — URL-driven tab + startup mode.
  // ?mode=start → auto-open "Куда пойти" (simplified wizard) + show the
  //               StartupModeBanner inviting a 3-step location pick.
  // ?tab=map|here-to-go|auctions|szs|hokim|heat → honour explicit tab pick.
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const validTabs = ['map', 'here-to-go', 'auctions', 'szs', 'hokim', 'heat'];
  const urlTab = searchParams.get('tab');
  const urlMode = searchParams.get('mode');
  const isStartupMode = urlMode === 'start';
  const initialTab =
    urlTab && validTabs.includes(urlTab)
      ? urlTab
      : isStartupMode
        ? 'here-to-go'
        : 'map';

  const [tab, setTabInternal] = useState<string>(initialTab);
  const [selectedRegion, setSelectedRegion] = useState<string | null>('tashkent_c');
  const [openedDistrict, setOpenedDistrict] = useState<DistrictSummary | null>(null);

  // Sync when URL changes from outside (navigation, deep-link chip).
  useEffect(() => {
    const next =
      urlTab && validTabs.includes(urlTab)
        ? urlTab
        : isStartupMode
          ? 'here-to-go'
          : 'map';
    if (next !== tab) setTabInternal(next);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlTab, urlMode]);

  const setTab = (next: string) => {
    setTabInternal(next);
    // Write to URL, preserve `mode=start` if it's present.
    const params = new URLSearchParams(searchParams.toString());
    const defaultTab = isStartupMode ? 'here-to-go' : 'map';
    if (next === defaultTab) params.delete('tab');
    else params.set('tab', next);
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  // 7.2 — sync local region selection to global store
  // so /modules/registry can show region-aware recommendations
  useEffect(() => {
    setGlobalRegion(selectedRegion);
  }, [selectedRegion, setGlobalRegion]);

  const canEdit = role === 'regionalMef' || role === 'mef';

  return (
    <div className="container-wide py-10 md:py-14">
      {/* Sprint 11 — startup-mode banner replaces the deep-link banner in this mode */}
      {isStartupMode && <StartupModeBanner onExit={() => {
        const params = new URLSearchParams(searchParams.toString());
        params.delete('mode');
        const qs = params.toString();
        router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
      }} />}

      <PhaseRoadmapStrip
        embedded
        currentPhase={1}
        points={[
          // Фаза 1 — до 01.07.2026
          { phase: 1, text: 'Интерактивная карта 14 регионов + Ташкент + Каракалпакстан' },
          { phase: 1, text: 'Drill-down до уровня 209 районов: паспорта специализации, топ-3 отрасли' },
          { phase: 2, text: 'Интеграция с E-auksion: свободные лоты зданий и участков в районе' },
          { phase: 1, text: 'МПЗ, СЭЗ и индустриальные зоны — справочник с контактами' },
          { phase: 1, text: 'Раздел «Куда пойти»: подбор локации по отрасли и бюджету' },
          // Фаза 2 — 2-я половина 2026
          { phase: 2, text: 'Панель регионального МЭФ (взаимодействие с хокимиятом): редактирование паспортов районов' },
          // Фаза 3 — 2027
          { phase: 3, text: 'Интеграция с «Онлайн-махалля»: данные по 10 000 махаллям', blockedBy: 'PKM + кибер-экспертиза' },
          { phase: 3, text: 'Drill-down до уровня махалли с потребностями по видам бизнеса' },
          // Фаза 4 — 2028+
          { phase: 4, text: 'Heat map МСБ, инвестиционные программы по районам, AI-рекомендации локаций' },
        ]}
      />

      <Tabs
        items={[
          { id: 'map',         label: 'Карта регионов' },
          { id: 'here-to-go',  label: 'Куда пойти' },
          { id: 'auctions',    label: 'Аукционы · Давактив' },
          { id: 'szs',         label: 'МПЗ и отрасли' },
          { id: 'hokim',       label: 'Панель регионального МЭФ' },
          { id: 'heat',        label: 'Heat map · МСБ' },
        ]}
        value={tab}
        onChange={setTab}
        size="lg"
      />

      <TabPanel active={tab === 'map'}>
        <MapTab
          selected={selectedRegion}
          onSelect={setSelectedRegion}
          entrepreneur={role === 'entrepreneur'}
          onDistrictOpen={setOpenedDistrict}
          canEdit={canEdit}
        />
      </TabPanel>

      <TabPanel active={tab === 'here-to-go'}>
        <HereToGoTab />
      </TabPanel>

      <TabPanel active={tab === 'auctions'}>
        <AuctionsTab />
      </TabPanel>

      <TabPanel active={tab === 'szs'}>
        <SZSTab />
      </TabPanel>

      <TabPanel active={tab === 'hokim'}>
        <HokimTab allowEdit={role === 'regionalMef' || role === 'mef'} />
      </TabPanel>

      <TabPanel active={tab === 'heat'}>
        <HeatMapTab />
      </TabPanel>

      {/* Sprint 4 · District passport modal */}
      <DistrictPassportDialog
        district={openedDistrict}
        onClose={() => setOpenedDistrict(null)}
        canEdit={canEdit}
      />
    </div>
  );
}

/* ─────────── Tab 1: interactive map ─────────── */
function MapTab({
  selected, onSelect, entrepreneur, onDistrictOpen, canEdit,
}: {
  selected: string | null;
  onSelect: (id: string) => void;
  entrepreneur: boolean;
  onDistrictOpen: (d: DistrictSummary) => void;
  canEdit: boolean;
}) {
  const highlightIds = entrepreneur ? [USER_HOME_REGION] : [];
  const sel = REGIONS.find((r) => r.id === selected);
  const lots = selected ? getLotsByRegion(selected) : [];
  const districts = selected ? getDistrictsForRegion(selected) : [];

  return (
    <>
      {entrepreneur && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-5 rounded-xl bg-gold/10 border border-gold/30 px-5 py-3 flex items-center gap-3"
        >
          <Sparkles className="h-5 w-5 text-gold shrink-0" />
          <div className="text-sm text-ink">
            <strong>Ваш бизнес расположен в г. Ташкенте, Яшнабадском районе.</strong> Регион выделен золотом на карте.
          </div>
        </motion.div>
      )}
      <div className="grid lg:grid-cols-[3fr_2fr] gap-5">
        <Card padding="none" className="overflow-hidden">
          <UzMap selected={selected} onSelect={onSelect} highlightIds={highlightIds} className="p-2" />
        </Card>

        <div>
          {sel ? (
            <motion.div
              key={sel.id}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25 }}
            >
              <Card padding="lg">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-xl bg-gold/10 text-gold flex items-center justify-center">
                    <MapPin className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <CardTitle>{sel.name_ru}</CardTitle>
                    <CardDescription>{sel.spec}</CardDescription>
                    {highlightIds.includes(sel.id) && (
                      <Badge variant="priority-solid" className="mt-2">
                        <ShieldCheck className="h-3 w-3" /> Рекомендуется по вашему бизнесу
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3">
                  <div className="rounded-lg bg-bg-band p-3">
                    <div className="text-xs text-ink-muted uppercase tracking-wider">Плотность МСБ</div>
                    <div className="font-serif text-2xl font-semibold text-navy mt-1">{sel.smeDensity}<span className="text-xs text-ink-muted"> /1000</span></div>
                  </div>
                  <div className="rounded-lg bg-bg-band p-3">
                    <div className="text-xs text-ink-muted uppercase tracking-wider">Лотов Давактив</div>
                    <div className="font-serif text-2xl font-semibold text-gold mt-1">{sel.lots}</div>
                  </div>
                </div>

                <div className="mt-5">
                  <div className="text-sm font-medium text-ink mb-2">Топ-3 отрасли</div>
                  <div className="flex flex-wrap gap-2">
                    {sel.topIndustries.map((ind) => (
                      <span key={ind} className="chip">{ind}</span>
                    ))}
                  </div>
                </div>

                {lots.length > 0 && (
                  <div className="mt-5">
                    <div className="text-sm font-medium text-ink mb-2">Свободные лоты</div>
                    <div className="space-y-2">
                      {lots.slice(0, 3).map((l) => (
                        <div key={l.id} className="rounded-lg border border-ink-line bg-bg-white p-3 flex items-start gap-3">
                          <Warehouse className="h-4 w-4 text-gold mt-0.5 shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-ink">{l.type}</div>
                            <div className="text-xs text-ink-muted mt-0.5">{l.address} · {l.areaSqm} м²</div>
                            <div className="text-xs text-gold font-semibold mt-1">
                              {(l.priceMonthUzs / 1_000_000).toFixed(1)} млн сум/мес
                            </div>
                          </div>
                          <Badge variant={l.status === 'available' ? 'success' : 'outline'}>
                            {l.status === 'available' ? 'свободно' : 'занято'}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Sprint 4 · Drill-down to districts */}
                {districts.length > 0 && (
                  <div className="mt-6 pt-5 border-t border-ink-line">
                    <div className="flex items-center justify-between mb-2.5">
                      <div className="text-sm font-medium text-ink flex items-center gap-2">
                        <LandPlot className="h-4 w-4 text-gold" />
                        Районы региона · {districts.length}
                      </div>
                      {canEdit && <Badge variant="priority">редактирование доступно</Badge>}
                    </div>
                    <div className="space-y-1.5">
                      {districts.map((d) => (
                        <button
                          key={d.id}
                          onClick={() => onDistrictOpen(d)}
                          className="w-full rounded-lg border border-ink-line hover:border-gold/50 hover:bg-gold-soft/30 bg-bg-white p-2.5 flex items-center gap-3 text-left transition-all focus-ring"
                        >
                          <MapPin className="h-4 w-4 text-gold-dark shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <div className="text-sm font-medium text-ink leading-tight">{d.name}</div>
                              {d.passportState === 'complete' && <Badge variant="success">паспорт готов</Badge>}
                              {d.passportState === 'partial'  && <Badge variant="warning">частично</Badge>}
                              {d.passportState === 'missing'  && <Badge variant="danger">не заполнен</Badge>}
                            </div>
                            <div className="text-[11px] text-ink-muted mt-0.5">
                              {d.smeCount.toLocaleString('ru')} МСБ · топ: {d.topIndustry} · лотов {d.lots}
                            </div>
                          </div>
                          <ArrowRight className="h-3.5 w-3.5 text-ink-muted shrink-0" />
                        </button>
                      ))}
                    </div>

                    <div className="mt-4 p-3 rounded-lg bg-bg-band/60 border border-ink-line/60 text-[11px] text-ink-soft flex items-start gap-2">
                      <Sparkles className="h-3.5 w-3.5 text-gold mt-0.5 shrink-0" />
                      <span>
                        Уровень <strong>махалли</strong> (10 000+ точек) подключится в Ф3 через API
                        «Онлайн-махалля» — после выхода PKM и кибер-экспертизы.
                      </span>
                    </div>
                  </div>
                )}
              </Card>
            </motion.div>
          ) : (
            <Card padding="lg">
              <div className="text-center py-8">
                <MapPin className="h-10 w-10 text-ink-muted mx-auto mb-3 opacity-40" />
                <div className="text-ink-muted">Кликните на регион, чтобы увидеть паспорт</div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </>
  );
}

/* ─────────── Tab 2: "here to go" scoring ─────────── */
function HereToGoTab() {
  const [form, setForm] = useState({ industry: 'manufacturing', budget: '200', employees: '20', priority: 'near-tashkent' });
  const [results, setResults] = useState<null | Array<{ region: typeof REGIONS[number]; score: number; reasons: string[] }>>(null);

  function compute() {
    const scores = REGIONS.map((r) => {
      let score = 50;
      const reasons: string[] = [];
      if (form.priority === 'near-tashkent' && (r.id === 'tashkent_c' || r.id === 'tashkent_o')) {
        score += 25;
        reasons.push('Близко к столице и логистическим узлам');
      }
      if (form.priority === 'cheap-rent' && r.id !== 'tashkent_c') {
        score += 15;
        reasons.push('Низкие ставки аренды');
      }
      if (form.priority === 'benefits' && ['karakalpakstan', 'jizzakh', 'surkhandarya'].includes(r.id)) {
        score += 20;
        reasons.push('Расширенные налоговые льготы для приоритетных районов');
      }
      const indMatch = r.topIndustries.some((i) => i.toLowerCase().includes(form.industry));
      if (indMatch) { score += 15; reasons.push(`Специализация региона соответствует вашей отрасли`); }
      if (r.lots >= 5) { score += 8; reasons.push(`${r.lots} свободных лотов Давактив`); }
      return { region: r, score: Math.min(100, score), reasons };
    });
    scores.sort((a, b) => b.score - a.score);
    setResults(scores.slice(0, 3));
  }

  return (
    <div id="here-to-go-form" className="grid lg:grid-cols-[1fr_1.3fr] gap-6 scroll-mt-24">
      <Card padding="lg">
        <CardTitle>Параметры вашего бизнеса</CardTitle>
        <CardDescription>Рассчитаем 3 рекомендованных региона</CardDescription>
        <div className="mt-5 space-y-4">
          <Select
            label="Отрасль"
            options={[
              { value: 'manufacturing', label: 'Промышленность' },
              { value: 'текстиль', label: 'Текстиль' },
              { value: 'сельхоз', label: 'Сельское хозяйство' },
              { value: 'туризм', label: 'Туризм' },
              { value: 'ит', label: 'ИТ' },
            ]}
            value={form.industry}
            onChange={(e) => setForm({ ...form, industry: e.target.value })}
          />
          <Input
            label="Бюджет инвестиций, млн сум"
            value={form.budget}
            onChange={(e) => setForm({ ...form, budget: e.target.value })}
            rightAddon="млн"
          />
          <Input
            label="Планируемое число сотрудников"
            value={form.employees}
            onChange={(e) => setForm({ ...form, employees: e.target.value })}
            rightAddon="чел."
          />
          <Select
            label="Приоритет при выборе"
            options={[
              { value: 'near-tashkent', label: 'Близость к Ташкенту' },
              { value: 'cheap-rent',    label: 'Дешёвая аренда' },
              { value: 'benefits',      label: 'Максимум льгот' },
            ]}
            value={form.priority}
            onChange={(e) => setForm({ ...form, priority: e.target.value })}
          />
          <Button fullWidth onClick={compute}>Получить рекомендации</Button>
        </div>
      </Card>

      <div>
        {!results ? (
          <Card padding="lg" className="h-full flex items-center justify-center text-center">
            <div>
              <TrendingUp className="h-10 w-10 text-ink-muted mx-auto mb-3 opacity-40" />
              <div className="text-ink-muted">Заполните параметры и нажмите «Получить рекомендации»</div>
            </div>
          </Card>
        ) : (
          <AnimatePresence>
            <div className="space-y-3">
              {results.map((r, i) => (
                <motion.div
                  key={r.region.id}
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.1 }}
                >
                  <Card>
                    <div className="flex items-start gap-4">
                      <div className={`font-serif text-2xl font-bold w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                        i === 0 ? 'bg-gold text-white' : i === 1 ? 'bg-gold/30 text-gold-dark' : 'bg-bg-band text-ink-muted'
                      }`}>
                        {i + 1}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <CardTitle className="text-[17px]">{r.region.name_ru}</CardTitle>
                          <div className="text-right">
                            <div className="font-serif font-bold text-2xl text-gold">{r.score}</div>
                            <div className="text-xs text-ink-muted uppercase tracking-wider">из 100</div>
                          </div>
                        </div>
                        <CardDescription>{r.region.spec}</CardDescription>
                        <ul className="mt-3 space-y-1">
                          {r.reasons.map((rr, j) => (
                            <li key={j} className="text-sm text-ink flex items-start gap-2">
                              <ShieldCheck className="h-4 w-4 text-success mt-0.5 shrink-0" /> {rr}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}

/* ─────────── Tab 3: hokim admin panel ─────────── */
function HokimTab({ allowEdit }: { allowEdit: boolean }) {
  const [addOpen, setAddOpen] = useState(false);
  return (
    <div>
      <div className="mb-6 flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="font-serif text-2xl font-semibold">Управление Яшнабадским районом</h2>
          <p className="text-sm text-ink-muted mt-1">
            Специализация района и свободные лоты.
          </p>
        </div>
        {allowEdit ? (
          <Button leftIcon={<Plus className="h-4 w-4" />} onClick={() => setAddOpen(true)}>Добавить лот</Button>
        ) : (
          <Badge variant="outline">Просмотр только для роли хокимията</Badge>
        )}
      </div>

      {/* Specialization editor */}
      <Card padding="lg" className="mb-6">
        <div className="flex items-center gap-3 mb-4">
          <LandPlot className="h-5 w-5 text-gold" />
          <CardTitle>Специализация района</CardTitle>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <Input
            label="Основная специализация"
            defaultValue="Финансы · ИТ · услуги · логистика"
            disabled={!allowEdit}
          />
          <Input
            label="Приоритетные отрасли для привлечения"
            defaultValue="ИТ, fintech, логистика"
            disabled={!allowEdit}
          />
        </div>
      </Card>

      {/* Lots table */}
      <Card padding="none" className="overflow-hidden">
        <div className="p-5 border-b border-ink-line flex items-center justify-between">
          <CardTitle>Лоты Давактив района</CardTitle>
          <Badge variant="info">{LOTS.filter((l) => l.regionId === 'tashkent_c').length} лот(а)</Badge>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-ink-muted bg-bg-band">
              <th className="py-3 px-5 font-medium">ID</th>
              <th className="py-3 px-5 font-medium">Тип</th>
              <th className="py-3 px-5 font-medium">Адрес</th>
              <th className="py-3 px-5 font-medium text-right">Площадь</th>
              <th className="py-3 px-5 font-medium text-right">Цена/мес</th>
              <th className="py-3 px-5 font-medium">Статус</th>
            </tr>
          </thead>
          <tbody>
            {LOTS.slice(0, 5).map((l) => (
              <tr key={l.id} className="border-t border-ink-line hover:bg-bg-band/60 transition-colors">
                <td className="py-3 px-5 font-mono text-xs text-ink-muted">{l.id}</td>
                <td className="py-3 px-5 font-medium text-ink">{l.type}</td>
                <td className="py-3 px-5 text-ink-muted text-xs">{l.address}</td>
                <td className="py-3 px-5 text-right font-mono">{l.areaSqm} м²</td>
                <td className="py-3 px-5 text-right font-mono font-semibold text-ink">{(l.priceMonthUzs / 1_000_000).toFixed(1)} млн</td>
                <td className="py-3 px-5">
                  <Badge variant={l.status === 'available' ? 'success' : l.status === 'reserved' ? 'warning' : 'queue'}>
                    {l.status === 'available' ? 'свободно' : l.status === 'reserved' ? 'резерв' : 'аренда'}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {/* Add lot dialog */}
      <Dialog
        open={addOpen}
        onClose={() => setAddOpen(false)}
        title="Добавить лот Давактив"
        size="lg"
        footer={
          <>
            <Button variant="ghost" onClick={() => setAddOpen(false)}>Отмена</Button>
            <Button onClick={() => setAddOpen(false)}>Опубликовать лот</Button>
          </>
        }
      >
        <div className="grid md:grid-cols-2 gap-4">
          <Select label="Тип объекта" options={[
            { value: 'cex', label: 'Производственный цех' },
            { value: 'sklad', label: 'Склад' },
            { value: 'office', label: 'Офисное помещение' },
          ]} />
          <Input label="Адрес" placeholder="Район, улица, дом" />
          <Input label="Площадь" rightAddon="м²" />
          <Input label="Цена за месяц" rightAddon="сум" />
          <Input label="Контакт" placeholder="+998 71 ..." />
          <Select label="Статус" options={[
            { value: 'available', label: 'Свободно' },
            { value: 'reserved',  label: 'Резерв' },
          ]} />
        </div>
      </Dialog>
    </div>
  );
}

/* ─────────── Tab 4: heat map ─────────── */
function HeatMapTab() {
  const data = [...REGIONS]
    .map((r) => ({ name: r.name_ru.replace(' обл.', '').replace('Республика ', ''), density: r.smeDensity }))
    .sort((a, b) => b.density - a.density);
  return (
    <Card padding="lg">
      <CardTitle>Плотность МСБ по регионам</CardTitle>
      <CardDescription>Число МСБ на 1000 человек населения</CardDescription>
      <div className="h-96 mt-5">
        <ResponsiveContainer>
          <BarChart data={data} layout="vertical" margin={{ top: 10, right: 16, left: 20, bottom: 0 }}>
            <CartesianGrid horizontal={false} stroke="#EFF1F4" />
            <XAxis type="number" fontSize={11} stroke="#5A6575" tickLine={false} axisLine={false} />
            <YAxis type="category" dataKey="name" fontSize={11} stroke="#1B2A3D" width={170} tickLine={false} axisLine={false} />
            <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid #E5E7EB', fontSize: 13 }} cursor={{ fill: 'rgba(139,111,58,0.08)' }} />
            <Bar dataKey="density" radius={[0, 6, 6, 0]}>
              {data.map((_, i) => (
                <Cell key={i} fill={i === 0 ? '#8B6F3A' : i < 5 ? '#B08D4C' : '#C5A476'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

// ════════════════════════════════════════════════════════════════════
// TAB: Auctions · Давактив / auksion.uz integration
// ════════════════════════════════════════════════════════════════════
type LotType = 'land' | 'building';

interface AuctionLot {
  id: string;
  cadastre: string;
  type: LotType;
  title: string;
  region: string;
  area: number; // m² or hectares for land
  areaUnit: 'м²' | 'га';
  landCategory?: string;
  condition?: string;
  startPrice: number; // млн сум
  currentBid?: number;
  auctionDate: string;
  status: 'active' | 'upcoming' | 'completed';
  bidsCount: number;
  auksionUrl: string;
}

const AUCTION_LOTS: AuctionLot[] = [
  // Land plots
  { id: 'A-L-001', cadastre: '10:05:0104001:2847', type: 'land',    title: 'Участок под производство (пром. зона)', region: 'Ташкентская обл. · Ангрен',     area: 0.8,   areaUnit: 'га',  landCategory: 'Промышленного назначения', startPrice: 180,  currentBid: 210,  auctionDate: '28 апр 2026', status: 'active',    bidsCount: 7,  auksionUrl: 'https://auksion.uz/' },
  { id: 'A-L-002', cadastre: '05:02:0605007:1102', type: 'land',    title: 'Земля под кафе/ресторан у трассы',       region: 'Самаркандская обл. · Самарканд', area: 1_200, areaUnit: 'м²',  landCategory: 'Коммерческая',               startPrice: 95,   currentBid: 108,  auctionDate: '5 мая 2026',  status: 'active',    bidsCount: 4,  auksionUrl: 'https://auksion.uz/' },
  { id: 'A-L-003', cadastre: '12:08:0302010:0458', type: 'land',    title: 'Участок под торговый центр',               region: 'Ферганская обл. · Маргилан',    area: 3_400, areaUnit: 'м²',  landCategory: 'Коммерческая',               startPrice: 240,  auctionDate: '12 мая 2026',  status: 'upcoming',  bidsCount: 0,  auksionUrl: 'https://auksion.uz/' },
  { id: 'A-L-004', cadastre: '14:03:0905004:3121', type: 'land',    title: 'Земля под фермерское хозяйство',           region: 'Кашкадарьинская обл. · Касан',  area: 25,    areaUnit: 'га',  landCategory: 'С/х назначения',             startPrice: 320,  auctionDate: '20 мая 2026',  status: 'upcoming',  bidsCount: 0,  auksionUrl: 'https://auksion.uz/' },
  { id: 'A-L-005', cadastre: '10:01:0504001:8721', type: 'land',    title: 'Участок под офисный комплекс',              region: 'г. Ташкент · Мирабадский р-н',   area: 850,   areaUnit: 'м²',  landCategory: 'Коммерческая',               startPrice: 480,  currentBid: 540, auctionDate: '30 апр 2026', status: 'active',    bidsCount: 11, auksionUrl: 'https://auksion.uz/' },
  { id: 'A-L-006', cadastre: '08:04:0708003:1245', type: 'land',    title: 'Земля под склад и логистику',               region: 'Бухарская обл. · Каракуль',      area: 1.2,   areaUnit: 'га',  landCategory: 'Промышленного назначения', startPrice: 140,  auctionDate: '8 мая 2026',   status: 'upcoming',  bidsCount: 0,  auksionUrl: 'https://auksion.uz/' },
  // Buildings
  { id: 'A-B-001', cadastre: '10:01:0208001:4521', type: 'building', title: 'Административное здание 2 этажа',           region: 'г. Ташкент · Шайхантахурский р-н',area: 680,   areaUnit: 'м²',  condition: 'Требует ремонта',                 startPrice: 850,  currentBid: 920, auctionDate: '26 апр 2026', status: 'active',    bidsCount: 6,  auksionUrl: 'https://auksion.uz/' },
  { id: 'A-B-002', cadastre: '05:02:0502001:2894', type: 'building', title: 'Цех лёгкой промышленности',                 region: 'Самаркандская обл. · Каттакурган',area: 1_800, areaUnit: 'м²',  condition: 'Хорошее',                         startPrice: 1_100, auctionDate: '15 мая 2026',  status: 'upcoming',  bidsCount: 0,  auksionUrl: 'https://auksion.uz/' },
  { id: 'A-B-003', cadastre: '14:06:0304012:0822', type: 'building', title: 'Складской комплекс',                        region: 'Кашкадарьинская обл. · Шахрисабз',area: 2_400, areaUnit: 'м²',  condition: 'Требует ремонта',                 startPrice: 580,  currentBid: 640, auctionDate: '3 мая 2026',   status: 'active',    bidsCount: 3,  auksionUrl: 'https://auksion.uz/' },
  { id: 'A-B-004', cadastre: '10:05:0603005:1134', type: 'building', title: 'Торговый павильон',                         region: 'Ташкентская обл. · Чирчик',      area: 240,   areaUnit: 'м²',  condition: 'Хорошее',                         startPrice: 320,  auctionDate: '10 мая 2026',  status: 'upcoming',  bidsCount: 0,  auksionUrl: 'https://auksion.uz/' },
  { id: 'A-B-005', cadastre: '07:01:0901007:2301', type: 'building', title: 'Неиспользуемое здание школы',                region: 'Наманганская обл. · Чуст',        area: 1_280, areaUnit: 'м²',  condition: 'Требует реконструкции',           startPrice: 420,  auctionDate: '18 мая 2026',  status: 'upcoming',  bidsCount: 0,  auksionUrl: 'https://auksion.uz/' },
  { id: 'A-B-006', cadastre: '08:04:0605001:0489', type: 'building', title: 'Здание бывшей хлопкобазы',                   region: 'Бухарская обл. · город',         area: 3_200, areaUnit: 'м²',  condition: 'Частично функциональное',         startPrice: 680,  currentBid: 740, auctionDate: '24 апр 2026', status: 'active',    bidsCount: 5,  auksionUrl: 'https://auksion.uz/' },
];

function AuctionsTab() {
  const [type, setType] = useState<'all' | LotType>('all');
  const [status, setStatus] = useState<'all' | 'active' | 'upcoming'>('all');
  const [query, setQuery] = useState('');

  const filtered = AUCTION_LOTS.filter((l) => {
    if (type !== 'all' && l.type !== type) return false;
    if (status !== 'all' && l.status !== status) return false;
    if (query && !l.region.toLowerCase().includes(query.toLowerCase()) && !l.title.toLowerCase().includes(query.toLowerCase())) return false;
    return true;
  });

  const activeCount   = AUCTION_LOTS.filter((l) => l.status === 'active').length;
  const upcomingCount = AUCTION_LOTS.filter((l) => l.status === 'upcoming').length;

  return (
    <div className="space-y-4">
      {/* Hero */}
      <Card padding="lg" tone="navy" className="text-white relative overflow-hidden">
        <div className="absolute inset-0 pattern-dots opacity-25 pointer-events-none" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-2">
            <Gavel className="h-5 w-5 text-gold-light" />
            <span className="text-xs uppercase tracking-wider text-gold-light font-semibold">Интеграция с auksion.uz (Давактив)</span>
          </div>
          <h3 className="font-serif text-xl text-white mb-1">Аукционы земельных участков и зданий</h3>
          <p className="text-white/75 text-sm max-w-3xl">
            Государственные активы, выставленные на открытые торги. Прямая интеграция с auksion.uz — ставка
            делается на Платформе, профиль синхронизируется автоматически.
          </p>

          <div className="mt-4 grid grid-cols-3 gap-2">
            <MiniMetric label="Активных лотов"   value={activeCount.toString()} sub="торги идут" />
            <MiniMetric label="Предстоящих"       value={upcomingCount.toString()} sub="скоро откроются" />
            <MiniMetric label="Всего в каталоге"  value={AUCTION_LOTS.length.toString()} sub="для МСБ" />
          </div>
        </div>
      </Card>

      {/* Filters */}
      <Card padding="md">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="flex-1 min-w-[220px] relative">
            <Search className="h-4 w-4 text-ink-muted absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              value={query} onChange={(e) => setQuery(e.target.value)}
              placeholder="Поиск: регион, назначение, кадастровый номер…"
              className="w-full pl-9 pr-3 h-10 rounded-lg border border-ink-line bg-bg-white text-sm focus:outline-none focus:border-gold"
            />
          </div>
          <div className="flex gap-1.5 flex-wrap">
            <AucChip active={type === 'all'}      onClick={() => setType('all')}>Все типы</AucChip>
            <AucChip active={type === 'land'}      onClick={() => setType('land')}>Земельные участки</AucChip>
            <AucChip active={type === 'building'}  onClick={() => setType('building')}>Здания и сооружения</AucChip>
          </div>
          <div className="flex gap-1.5 flex-wrap">
            <AucChip active={status === 'all'}      onClick={() => setStatus('all')}>Все статусы</AucChip>
            <AucChip active={status === 'active'}   onClick={() => setStatus('active')} tone="success">Торги идут</AucChip>
            <AucChip active={status === 'upcoming'} onClick={() => setStatus('upcoming')}>Предстоящие</AucChip>
          </div>
        </div>
      </Card>

      {/* Lots grid */}
      <div className="grid md:grid-cols-2 gap-3">
        {filtered.map((lot) => (
          <div key={lot.id} className="p-4 rounded-xl border border-ink-line bg-bg-white hover:border-gold/40 transition-all">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <div className={cn('h-9 w-9 rounded-lg flex items-center justify-center shrink-0',
                  lot.type === 'land' ? 'bg-success/10 text-success' : 'bg-secondary/10 text-secondary')}>
                  {lot.type === 'land' ? <LandPlot className="h-4 w-4" /> : <Building2 className="h-4 w-4" />}
                </div>
                <div>
                  <div className="text-[10.5px] font-mono text-ink-muted">{lot.cadastre}</div>
                  <div className="text-[10px] uppercase tracking-wider text-ink-muted">{lot.type === 'land' ? 'Участок' : 'Здание'}</div>
                </div>
              </div>
              {lot.status === 'active'    && <Badge variant="success">торги идут</Badge>}
              {lot.status === 'upcoming'  && <Badge variant="warning">{lot.auctionDate}</Badge>}
            </div>

            <div className="font-serif text-[14px] text-ink leading-snug mb-2">{lot.title}</div>
            <div className="text-xs text-ink-muted mb-2"><MapPin className="inline h-3 w-3 -mt-0.5" /> {lot.region}</div>

            <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
              <div className="p-2 rounded bg-bg-band/50">
                <div className="text-[10.5px] uppercase tracking-wider text-ink-muted">Площадь</div>
                <div className="text-ink font-semibold">{lot.area.toLocaleString('ru')} {lot.areaUnit}</div>
              </div>
              <div className="p-2 rounded bg-bg-band/50">
                <div className="text-[10.5px] uppercase tracking-wider text-ink-muted">{lot.type === 'land' ? 'Категория' : 'Состояние'}</div>
                <div className="text-ink font-semibold truncate">{lot.landCategory || lot.condition}</div>
              </div>
            </div>

            <div className="flex items-center justify-between mb-3 pt-2 border-t border-ink-line/60">
              <div>
                <div className="text-[10.5px] uppercase tracking-wider text-ink-muted">Стартовая цена</div>
                <div className="text-sm text-ink font-semibold">{lot.startPrice} млн сум</div>
              </div>
              {lot.currentBid && (
                <div className="text-right">
                  <div className="text-[10.5px] uppercase tracking-wider text-gold">Текущая ставка</div>
                  <div className="text-base text-gold font-serif font-semibold">{lot.currentBid} млн</div>
                </div>
              )}
              {lot.bidsCount > 0 && <Badge variant="info">{lot.bidsCount} ставок</Badge>}
            </div>

            <div className="flex gap-2">
              <Button size="sm" className="flex-1">{lot.status === 'active' ? 'Сделать ставку' : 'Подписаться'}</Button>
              <a href={lot.auksionUrl} target="_blank" rel="noopener noreferrer">
                <Button size="sm" variant="ghost" leftIcon={<ExternalLink className="h-3.5 w-3.5" />}>auksion.uz</Button>
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════
// TAB: SZS (МПЗ) and priority industries
// ════════════════════════════════════════════════════════════════════
interface SZS {
  id: string;
  name: string;
  region: string;
  area: string;
  residents: number;
  freePlots: number;
  industries: string[];
  benefits: string[];
}

const SZS_LIST: SZS[] = [
  { id: 'K-001', name: 'МПЗ «Янги Ангрен»',         region: 'Ташкентская обл. · Ангрен',       area: '340 га',  residents: 84, freePlots: 12, industries: ['Машиностроение', 'Металлургия', 'Химия'],            benefits: ['Освобождение от налога на прибыль 3 года', 'Таможенные льготы', 'Инфраструктура подведена'] },
  { id: 'K-002', name: 'МПЗ «Джизак»',              region: 'Джизакская обл. · Джизак',        area: '240 га',  residents: 52, freePlots: 18, industries: ['Текстиль', 'Пищевая промышленность', 'Стройматериалы'], benefits: ['Освобождение от налога на имущество', 'Субсидии на зарплату 2 года', 'Готовые помещения'] },
  { id: 'K-003', name: 'МПЗ «Навои»',               region: 'Навоийская обл. · Навои',         area: '450 га',  residents: 108, freePlots: 4, industries: ['Добывающая', 'Химия', 'Фармацевтика'],               benefits: ['Свободная экономическая зона', 'Отсутствие таможенных пошлин', 'Доступ к энергоресурсам'] },
  { id: 'K-004', name: 'МПЗ «Хазарасп»',             region: 'Хорезмская обл. · Хазарасп',     area: '180 га',  residents: 38, freePlots: 22, industries: ['Пищевая', 'Лёгкая промышленность', 'С/х переработка'], benefits: ['Льготные кредиты от Госфонда', 'ЕСП 2% в первые 5 лет'] },
  { id: 'K-005', name: 'МПЗ «Сирдарё»',              region: 'Сырдарьинская обл.',              area: '220 га',  residents: 46, freePlots: 16, industries: ['Текстиль', 'С/х машиностроение'],                    benefits: ['Компенсация аренды земли', 'Упрощённые таможенные процедуры'] },
  { id: 'K-006', name: 'МПЗ «Маргилан»',              region: 'Ферганская обл. · Маргилан',    area: '95 га',   residents: 67, freePlots: 8,  industries: ['Шёлк', 'Ремёсла', 'Лёгкая промышленность'],          benefits: ['Программа «Один махалля — один продукт»', 'Экспортные льготы'] },
  { id: 'K-007', name: 'МПЗ «Нукус»',                 region: 'Каракалпакстан · Нукус',         area: '160 га',  residents: 29, freePlots: 24, industries: ['Пищевая', 'Стройматериалы', 'Рыболовство'],           benefits: ['Дополнительные льготы для приграничных МПЗ', 'Субсидии на логистику'] },
  { id: 'K-008', name: 'МПЗ «Чирчик»',                region: 'Ташкентская обл. · Чирчик',      area: '310 га',  residents: 91, freePlots: 6,  industries: ['Химия', 'Металлургия', 'Электроника'],                 benefits: ['Доступ к квалифицированным кадрам', 'Близость к столице'] },
];

const PRIORITY_INDUSTRIES = [
  { region: 'Ферганская долина',        top: ['Шёлк', 'Текстиль', 'Ремёсла', 'Фрукты'], color: 'bg-gold/20' },
  { region: 'Ташкент и область',         top: ['IT и связь', 'Лёгкая пром-ть', 'Машиностроение', 'Услуги'], color: 'bg-secondary/20' },
  { region: 'Самарканд · Бухара',        top: ['Туризм', 'Ремёсла', 'С/х переработка'], color: 'bg-success/20' },
  { region: 'Навоийская · Джизакская',   top: ['Горнодобыча', 'Стройматериалы', 'Логистика'], color: 'bg-gold-light/20' },
  { region: 'Хорезм · Каракалпакстан',   top: ['С/х переработка', 'Рыболовство', 'Ремёсла'], color: 'bg-secondary/10' },
  { region: 'Кашкадарья · Сурхандарья',  top: ['Газохимия', 'С/х', 'Приграничная торговля'], color: 'bg-danger/10' },
];

interface FEZ {
  id: string;
  name: string;
  region: string;
  area: string;
  established: string;
  specialization: string;
  topBenefit: string;
}

/** 7 official Free Economic Zones of Uzbekistan · source: mfer.uz */
const FEZ_LIST: FEZ[] = [
  { id: 'F-001', name: 'СЭЗ «Навои»',       region: 'Навоийская обл.',     area: '564 га',   established: '2008',
    specialization: 'Химия, фармацевтика, машиностроение, стройматериалы',
    topBenefit: 'Освобождение от всех налогов на 3–10 лет (зависит от объёма инвестиций)' },
  { id: 'F-002', name: 'СЭЗ «Ангрен»',      region: 'Ташкентская обл.',    area: '1 270 га',  established: '2012',
    specialization: 'Металлургия, стройматериалы, электротехника, текстиль',
    topBenefit: 'Освобождение от налога на прибыль, имущество и ЕСП до 7 лет' },
  { id: 'F-003', name: 'СЭЗ «Джизак»',      region: 'Джизакская обл.',      area: '730 га',    established: '2013',
    specialization: 'Машиностроение, автомобилестроение, кабельная продукция',
    topBenefit: 'Таможенные льготы на импорт сырья и оборудования' },
  { id: 'F-004', name: 'СЭЗ «Ургут»',       region: 'Самаркандская обл.',   area: '53 га',    established: '2017',
    specialization: 'Машиностроение (MAN, Isuzu), плодоовощная переработка',
    topBenefit: 'Нулевая ставка налога на прибыль и имущество на 10 лет' },
  { id: 'F-005', name: 'СЭЗ «Коканд»',      region: 'Ферганская обл.',      area: '200 га',    established: '2017',
    specialization: 'Текстиль, лёгкая промышленность, пищевая',
    topBenefit: 'Упрощённые таможенные процедуры, валютные послабления' },
  { id: 'F-006', name: 'СЭЗ «Гиждуван»',    region: 'Бухарская обл.',        area: '48 га',    established: '2017',
    specialization: 'Пищевая промышленность, текстиль, упаковка',
    topBenefit: 'Компенсация ставки по кредитам, освобождение от НДС' },
  { id: 'F-007', name: 'СЭЗ «Хазарасп»',    region: 'Хорезмская обл.',        area: '760 га',   established: '2019',
    specialization: 'С/х переработка, текстиль, стройматериалы',
    topBenefit: 'Доп. льготы для приграничной СЭЗ + субсидии на логистику' },
];

function SZSTab() {
  const [opened, setOpened] = useState<SZS | null>(null);

  return (
    <div className="space-y-5">
      {/* Intro */}
      <Card padding="lg" tone="navy" className="text-white relative overflow-hidden">
        <div className="absolute inset-0 pattern-dots opacity-25 pointer-events-none" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-2">
            <Factory className="h-5 w-5 text-gold-light" />
            <span className="text-xs uppercase tracking-wider text-gold-light font-semibold">МПЗ · СЭЗ · приоритетные отрасли</span>
          </div>
          <h3 className="font-serif text-xl text-white mb-1">Промышленные зоны и ниши для бизнеса</h3>
          <p className="text-white/75 text-sm max-w-3xl">
            8 демо-МПЗ из ~340 действующих, 7 официальных СЭЗ с особыми налоговыми и таможенными режимами,
            приоритетные отрасли по 6 макрорегионам.
          </p>
        </div>
      </Card>

      {/* МПЗ grid — first, as per ПФ-138 */}
      <div>
        <h4 className="font-serif text-lg text-ink mb-1">Малые промышленные зоны (МПЗ)</h4>
        <p className="text-[13px] text-ink-muted mb-3">
          Локальные индустриальные парки с готовой инфраструктурой, преимущественно для малого и среднего бизнеса.
          Льготы региональные, вход относительно простой.
        </p>
        <div className="grid md:grid-cols-2 gap-3">
          {SZS_LIST.map((k) => (
            <button
              key={k.id}
              onClick={() => setOpened(k)}
              className="text-left p-4 rounded-xl border border-ink-line bg-bg-white hover:border-gold/50 transition-all"
            >
              <div className="flex items-start gap-3 mb-2">
                <div className="h-10 w-10 rounded-lg bg-gold/10 text-gold flex items-center justify-center shrink-0">
                  <Factory className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-serif text-[15px] text-ink">{k.name}</div>
                  <div className="text-xs text-ink-muted">{k.region} · {k.area}</div>
                </div>
                {k.freePlots > 0 && <Badge variant="success">{k.freePlots} свободно</Badge>}
              </div>

              <div className="flex flex-wrap gap-1 mb-3">
                {k.industries.map((ind) => (
                  <span key={ind} className="text-[10.5px] px-1.5 py-0.5 rounded bg-bg-band/60 text-ink-muted border border-ink-line">
                    {ind}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-ink-muted">{k.residents} резидентов</span>
                <span className="text-gold font-medium flex items-center gap-1">
                  Подробнее <ArrowRight className="h-3 w-3" />
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* FEZ (СЭЗ) grid — secondary, with stronger benefits */}
      <div>
        <h4 className="font-serif text-lg text-ink mb-1">Свободные экономические зоны (СЭЗ)</h4>
        <p className="text-[13px] text-ink-muted mb-3">
          7 федеральных СЭЗ с особым правовым режимом: освобождение от налогов 3–10 лет, таможенные льготы,
          свободная репатриация валюты. Вход с порогом инвестиций — для более крупных проектов.
        </p>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
          {FEZ_LIST.map((f) => (
            <div key={f.id} className="p-4 rounded-xl border border-secondary/30 bg-secondary/5 hover:border-secondary/60 transition-all">
              <div className="flex items-start gap-2 mb-2">
                <div className="h-9 w-9 rounded-lg bg-secondary/15 text-secondary flex items-center justify-center shrink-0">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-serif text-[14px] text-ink leading-tight">{f.name}</div>
                  <div className="text-[11px] text-ink-muted">{f.region}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-1.5 mb-2 text-[11px]">
                <div className="p-1.5 rounded bg-bg-band/50">
                  <div className="text-[9.5px] uppercase tracking-wider text-ink-muted">Площадь</div>
                  <div className="text-ink font-semibold mt-0.5">{f.area}</div>
                </div>
                <div className="p-1.5 rounded bg-bg-band/50">
                  <div className="text-[9.5px] uppercase tracking-wider text-ink-muted">Создана</div>
                  <div className="text-ink font-semibold mt-0.5">{f.established}</div>
                </div>
              </div>

              <div className="mb-2">
                <div className="text-[9.5px] uppercase tracking-wider text-ink-muted font-semibold mb-1">Специализация</div>
                <div className="text-[11.5px] text-ink leading-snug">{f.specialization}</div>
              </div>

              <div className="pt-2 border-t border-secondary/20">
                <div className="text-[9.5px] uppercase tracking-wider text-secondary font-semibold mb-1">Ключевая льгота</div>
                <div className="text-[11.5px] text-ink font-medium leading-snug">{f.topBenefit}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-3 p-3 rounded-lg bg-gold-soft/30 border border-gold/25 text-[12.5px] text-ink">
          <strong>Порог инвестиций для входа в СЭЗ:</strong> от $300 000 (малые проекты) до $3 000 000 (крупные промышленные).
          Заявки подаются через Дирекцию СЭЗ по принципу «одного окна» · источник: <a href="https://mfer.uz/" target="_blank" rel="noopener noreferrer" className="text-gold font-semibold hover:underline">mfer.uz</a>
        </div>
      </div>

      {/* Priority industries */}
      <div>
        <h4 className="font-serif text-lg text-ink mb-3">Приоритетные отрасли по макрорегионам</h4>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
          {PRIORITY_INDUSTRIES.map((r) => (
            <div key={r.region} className={cn('p-4 rounded-xl border border-ink-line', r.color)}>
              <div className="font-serif text-[14px] text-ink mb-2">{r.region}</div>
              <div className="space-y-1">
                {r.top.map((ind, i) => (
                  <div key={ind} className="flex items-center gap-2 text-[13px]">
                    <span className="h-5 w-5 rounded-full bg-white/60 text-navy flex items-center justify-center text-[10px] font-semibold shrink-0">{i + 1}</span>
                    <span className="text-ink">{ind}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dialog */}
      {opened && (
        <Dialog open onClose={() => setOpened(null)} title={opened.name}>
          <div className="text-sm text-ink-muted mb-3">{opened.region} · площадь {opened.area}</div>

          <div className="grid grid-cols-3 gap-2 mb-4">
            <div className="p-3 rounded-lg bg-bg-band/50">
              <div className="text-[10.5px] uppercase tracking-wider text-ink-muted">Резидентов</div>
              <div className="font-serif text-xl text-navy font-semibold">{opened.residents}</div>
            </div>
            <div className="p-3 rounded-lg bg-bg-band/50">
              <div className="text-[10.5px] uppercase tracking-wider text-ink-muted">Свободных участков</div>
              <div className="font-serif text-xl text-gold font-semibold">{opened.freePlots}</div>
            </div>
            <div className="p-3 rounded-lg bg-bg-band/50">
              <div className="text-[10.5px] uppercase tracking-wider text-ink-muted">Площадь МПЗ</div>
              <div className="font-serif text-xl text-success font-semibold">{opened.area}</div>
            </div>
          </div>

          <div className="mb-4">
            <div className="text-xs uppercase tracking-wider text-ink-muted font-semibold mb-2">Специализация</div>
            <div className="flex flex-wrap gap-1.5">
              {opened.industries.map((ind) => (
                <Badge key={ind} variant="outline">{ind}</Badge>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <div className="text-xs uppercase tracking-wider text-ink-muted font-semibold mb-2">Льготы для резидентов</div>
            <ul className="space-y-1.5">
              {opened.benefits.map((b) => (
                <li key={b} className="flex items-start gap-2 text-sm text-ink">
                  <ShieldCheck className="h-4 w-4 text-success mt-0.5 shrink-0" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex gap-2 pt-3 border-t border-ink-line">
            <Button size="md">Подать заявку на участок</Button>
            <Button size="md" variant="ghost">Связаться с управляющей компанией</Button>
          </div>
        </Dialog>
      )}
    </div>
  );
}

function AucChip({ active, onClick, tone, children }: {
  active: boolean; onClick: () => void; tone?: 'success'; children: React.ReactNode;
}) {
  return (
    <button onClick={onClick} className={cn(
      'h-8 px-3 rounded-full text-xs font-medium transition-colors border',
      active
        ? tone === 'success' ? 'bg-success text-white border-success' : 'bg-navy text-white border-navy'
        : 'bg-bg-white text-ink-muted border-ink-line hover:border-gold hover:text-gold',
    )}>{children}</button>
  );
}

function MiniMetric({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-lg p-2.5">
      <div className="text-[10px] uppercase tracking-wider text-gold-light/80">{label}</div>
      <div className="font-serif text-xl text-white font-semibold mt-0.5">{value}</div>
      <div className="text-[10.5px] text-white/60 mt-0.5">{sub}</div>
    </div>
  );
}

/* ─────────── Sprint 4 · District passport dialog ─────────── */
function DistrictPassportDialog({
  district, onClose, canEdit,
}: {
  district: DistrictSummary | null;
  onClose: () => void;
  canEdit: boolean;
}) {
  if (!district) return null;
  return (
    <Dialog
      open={district !== null}
      onClose={onClose}
      title={`Паспорт района · ${district.name}`}
      description="Сводная карточка района: специализация, приоритетные отрасли, возможности для бизнеса и свободные объекты."
      size="md"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>Закрыть</Button>
          {canEdit ? (
            <Button leftIcon={<LandPlot className="h-4 w-4" />}>Редактировать паспорт</Button>
          ) : (
            <Button variant="ghost" disabled title="Доступно для регионального МЭФ">
              Только просмотр
            </Button>
          )}
        </>
      }
    >
      <div className="space-y-4">
        {/* Passport state */}
        <div className="flex items-center gap-3">
          <span className="text-xs uppercase tracking-wider text-ink-muted font-semibold">Статус паспорта:</span>
          {district.passportState === 'complete' && <Badge variant="success">готов</Badge>}
          {district.passportState === 'partial'  && <Badge variant="warning">заполнен частично</Badge>}
          {district.passportState === 'missing'  && <Badge variant="danger">не заполнен</Badge>}
          <span className="text-xs text-ink-muted ml-auto">обновлено: 14 апр 2026</span>
        </div>

        {/* KPI grid */}
        <div className="grid grid-cols-3 gap-2">
          <div className="p-3 rounded-lg bg-bg-band/60 border border-ink-line/60">
            <div className="text-[10px] uppercase tracking-wider text-ink-muted font-semibold">МСБ в районе</div>
            <div className="kpi-number text-navy text-xl mt-0.5">{district.smeCount.toLocaleString('ru')}</div>
          </div>
          <div className="p-3 rounded-lg bg-gold-soft/40 border border-gold/25">
            <div className="text-[10px] uppercase tracking-wider text-gold-dark font-semibold">Топ-отрасль</div>
            <div className="font-serif font-semibold text-ink text-[15px] mt-0.5 leading-tight">{district.topIndustry}</div>
          </div>
          <div className="p-3 rounded-lg bg-secondary/10 border border-secondary/25">
            <div className="text-[10px] uppercase tracking-wider text-secondary font-semibold">Лоты E-auksion</div>
            <div className="kpi-number text-secondary text-xl mt-0.5">{district.lots}</div>
          </div>
        </div>

        {/* Specialization */}
        <div>
          <div className="text-xs uppercase tracking-wider text-ink-muted font-semibold mb-1.5">Специализация</div>
          <div className="text-sm text-ink leading-relaxed p-3 rounded-lg bg-bg-band/40 border border-ink-line/60">
            {district.specialization}
          </div>
        </div>

        {/* Opportunities */}
        {district.opportunities.length > 0 ? (
          <div>
            <div className="text-xs uppercase tracking-wider text-ink-muted font-semibold mb-1.5">
              Возможности для бизнеса в районе
            </div>
            <ul className="space-y-1.5">
              {district.opportunities.map((o, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-ink-soft">
                  <Sparkles className="h-3.5 w-3.5 text-gold shrink-0 mt-0.5" />
                  <span>{o}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="p-3 rounded-lg bg-danger/5 border border-danger/20 text-sm text-ink-soft">
            Паспорт ещё не заполнен. Ждём ввода от сотрудника регионального МЭФ или интеграции с «Онлайн-махалля».
          </div>
        )}

        {/* Ph3 notice */}
        <div className="p-3 rounded-lg bg-secondary/5 border border-secondary/25 text-xs text-ink-soft leading-relaxed flex items-start gap-2">
          <Sparkles className="h-3.5 w-3.5 text-secondary shrink-0 mt-0.5" />
          <span>
            В Ф3 паспорт района автоматически обновляется данными от <strong>«Онлайн-махалля»</strong> (10 000+ помощников хокима),
            <strong> E-auksion</strong> (свободные лоты) и <strong>Soliq</strong> (динамика МСБ).
            Сейчас — ручной ввод сотрудником регионального МЭФ.
          </span>
        </div>
      </div>
    </Dialog>
  );
}

/* ─────────── Sprint 11 · Startup-mode banner ─────────── */
/**
 * Compact 3-step guide shown above the normal Geoanalytics UI when the user
 * arrives via a deep-link like /modules/geo?mode=start. Reframes the module
 * from "analytics for decision-makers" to "wizard that helps a brand-new
 * entrepreneur pick a location". The full map + heat map + hokimiyat
 * panel all remain available below — the banner doesn't hide anything.
 */
function StartupModeBanner({ onExit }: { onExit: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mb-6 rounded-2xl border border-gold/30 bg-gradient-to-br from-gold-soft via-gold-soft/70 to-bg-white overflow-hidden"
    >
      <div className="p-5 md:p-6 flex flex-col lg:flex-row lg:items-center gap-5">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] uppercase tracking-wider font-bold text-gold-dark bg-bg-white px-2 py-0.5 rounded">
              Режим · Старт бизнеса
            </span>
            <span className="text-[10px] uppercase tracking-wider font-semibold text-ink-muted">
              упрощённый мастер
            </span>
          </div>
          <h3 className="font-serif text-xl md:text-2xl font-semibold text-navy leading-tight">
            Найдите район под ваш бизнес за 3 шага
          </h3>
          <p className="mt-1.5 text-[13.5px] text-ink-muted">
            Укажите отрасль, регион и бюджет аренды — покажем 3 подходящих района и свободные лоты
            Давактив. После выбора — перейдёте к регистрации бизнеса по этому адресу.
          </p>
        </div>

        <div className="flex flex-col gap-2 shrink-0">
          <button
            onClick={() => {
              const el = document.getElementById('here-to-go-form');
              if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }}
            className="inline-flex items-center justify-center gap-1.5 h-10 px-4 rounded-lg bg-gold-gradient text-white font-medium text-sm shadow-subtle hover:shadow-card-hover"
          >
            Начать подбор
            <ArrowRight className="h-4 w-4" />
          </button>
          <button
            onClick={onExit}
            className="text-[12px] text-ink-muted hover:text-ink"
          >
            Выйти в полный режим
          </button>
        </div>
      </div>

      <div className="px-5 md:px-6 pb-5 grid grid-cols-1 md:grid-cols-3 gap-3">
        <StartupStep n={1} title="Что за бизнес" sub="Отрасль (ОКЭД), тип помещения" />
        <StartupStep n={2} title="Где ищем" sub="Область, радиус от центра, удалённость от магистрали" />
        <StartupStep n={3} title="Сколько готовы" sub="Бюджет аренды, формат (покупка/аренда)" />
      </div>
    </motion.div>
  );
}

function StartupStep({ n, title, sub }: { n: number; title: string; sub: string }) {
  return (
    <div className="rounded-xl bg-bg-white border border-gold/20 p-3 flex items-start gap-3">
      <div className="h-7 w-7 rounded-full bg-gold text-white font-serif font-semibold text-sm flex items-center justify-center shrink-0">
        {n}
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-serif font-semibold text-navy text-[14px] leading-tight">{title}</div>
        <div className="text-[11.5px] text-ink-muted mt-0.5">{sub}</div>
      </div>
    </div>
  );
}
