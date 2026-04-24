/**
 * Sprint 12 — Navigation map (extended).
 *
 * Changes vs Sprint 10.1:
 *   • qWF (Workflow) removed from "Меры поддержки"
 *   • "Сервисы · Текущая работа" gains nTax, nHR
 *   • "Инструменты роста" gains two new groups: Финансы (nCredit), Право (nIP)
 *   • "Продажи и маркетплейсы" gains nExport, nSales
 *   • LIFECYCLE_DOORS now enumerate ALL modules per stage (no fixed 4-pill
 *     cap) — per Gayrat's C2 choice. Door heights may differ. Doors use
 *     `featuredModules` as curated slugs if needed, otherwise computed
 *     dynamically from module metadata.
 */

import type { NavCategory, Role } from '@/lib/types';

export interface NavLink {
  moduleSlug?: string;
  href?: string;
  titleKey?: string;
  descKey?: string;
  isDeepLink?: boolean;
  isPrimaryHome?: boolean;
}

export interface NavGroup {
  titleKey: string;
  descKey?: string;
  links: NavLink[];
}

export interface NavCategoryDef {
  id: NavCategory;
  labelKey: string;
  descKey: string;
  groups: NavGroup[];
  href?: string;
}

export const NAV_CATEGORIES: NavCategoryDef[] = [
  // ═════ 1. СЕРВИСЫ ═════════════════════════════════════════════════
  {
    id: 'services',
    labelKey: 'nav.services',
    descKey: 'nav.services.desc',
    groups: [
      {
        titleKey: 'nav.services.start',
        descKey: 'nav.services.start.desc',
        links: [
          { moduleSlug: 'qBiz' },
          { moduleSlug: 'qReg' },
          {
            href: '/modules/geo?mode=start',
            titleKey: 'nav.services.start.geo',
            descKey: 'nav.services.start.geo.desc',
            isDeepLink: true,
          },
        ],
      },
      {
        titleKey: 'nav.services.run',
        descKey: 'nav.services.run.desc',
        links: [
          { moduleSlug: 'qRep' },
          { moduleSlug: 'nTax' },
          { moduleSlug: 'nHR' },
          {
            href: '/modules/comms?tab=b2g',
            titleKey: 'nav.services.run.b2g',
            descKey: 'nav.services.run.b2g.desc',
            isDeepLink: true,
          },
          { moduleSlug: 'qInf' },
        ],
      },
      {
        titleKey: 'nav.services.close',
        descKey: 'nav.services.close.desc',
        links: [{ moduleSlug: 'qClose' }],
      },
    ],
  },

  // ═════ 2. МЕРЫ ПОДДЕРЖКИ ══════════════════════════════════════════
  {
    id: 'measures',
    labelKey: 'nav.measures',
    descKey: 'nav.measures.desc',
    groups: [
      {
        titleKey: 'nav.measures.registry',
        links: [{ moduleSlug: 'registry', isPrimaryHome: true }],
      },
      {
        titleKey: 'nav.measures.champions',
        links: [{ moduleSlug: 'qChamp' }],
      },
      {
        titleKey: 'nav.measures.ai',
        links: [
          {
            href: '/modules/registry?ai=1',
            titleKey: 'nav.measures.ai.title',
            descKey: 'nav.measures.ai.desc',
            isDeepLink: true,
          },
        ],
      },
    ],
  },

  // ═════ 3. ИНСТРУМЕНТЫ РОСТА ═══════════════════════════════════════
  {
    id: 'tools',
    labelKey: 'nav.tools',
    descKey: 'nav.tools.desc',
    groups: [
      {
        titleKey: 'nav.tools.partnerships',
        descKey: 'nav.tools.partnerships.desc',
        links: [
          {
            href: '/modules/comms?tab=b2b',
            titleKey: 'nav.tools.b2b',
            descKey: 'nav.tools.b2b.desc',
            isDeepLink: true,
          },
          { moduleSlug: 'nProcure' },
        ],
      },
      {
        titleKey: 'nav.tools.sales',
        descKey: 'nav.tools.sales.desc',
        links: [
          { moduleSlug: 'ecommerce' },
          { moduleSlug: 'nSales' },
          { moduleSlug: 'nExport' },
        ],
      },
      {
        titleKey: 'nav.tools.finance',
        descKey: 'nav.tools.finance.desc',
        links: [{ moduleSlug: 'nCredit' }],
      },
      {
        titleKey: 'nav.tools.law',
        descKey: 'nav.tools.law.desc',
        links: [{ moduleSlug: 'nIP' }],
      },
      {
        titleKey: 'nav.tools.analytics',
        descKey: 'nav.tools.analytics.desc',
        links: [
          { moduleSlug: 'geo', isPrimaryHome: true },
          { moduleSlug: 'maturity' },
        ],
      },
    ],
  },

  // ═════ 4. БАЗА ЗНАНИЙ ═════════════════════════════════════════════
  {
    id: 'knowledge',
    labelKey: 'nav.knowledge',
    descKey: 'nav.knowledge.desc',
    groups: [
      {
        titleKey: 'nav.knowledge.info',
        links: [{ moduleSlug: 'info', isPrimaryHome: true }],
      },
      {
        titleKey: 'nav.knowledge.guides',
        links: [{ moduleSlug: 'nPath' }, { moduleSlug: 'nStartup' }],
      },
      {
        titleKey: 'nav.knowledge.regulations',
        links: [{ moduleSlug: 'qNews' }],
      },
      {
        titleKey: 'nav.knowledge.learning',
        links: [{ moduleSlug: 'nLearn' }, { moduleSlug: 'nCheck' }],
      },
    ],
  },

  // ═════ 5. КАБИНЕТЫ ════════════════════════════════════════════════
  {
    id: 'cabinets',
    labelKey: 'nav.cabinets',
    descKey: 'nav.cabinets.desc',
    groups: [
      {
        titleKey: 'nav.cabinets.business',
        descKey: 'nav.cabinets.business.desc',
        links: [
          {
            href: '/cabinet?role=entrepreneur',
            titleKey: 'nav.cabinets.entrepreneur',
            descKey: 'nav.cabinets.entrepreneur.desc',
          },
        ],
      },
      {
        titleKey: 'nav.cabinets.government',
        descKey: 'nav.cabinets.government.desc',
        links: [
          {
            href: '/cabinet?role=regionalMef',
            titleKey: 'nav.cabinets.regionalMef',
            descKey: 'nav.cabinets.regionalMef.desc',
          },
          {
            href: '/cabinet?role=mef',
            titleKey: 'nav.cabinets.mef',
            descKey: 'nav.cabinets.mef.desc',
          },
          {
            href: '/cabinet?role=agency',
            titleKey: 'nav.cabinets.agency',
            descKey: 'nav.cabinets.agency.desc',
          },
        ],
      },
    ],
  },
];

// ═══ LIFECYCLE DOORS ═════════════════════════════════════════════════
/**
 * Sprint 12 — doors enumerate ALL modules per stage (no cap).
 * `featuredModules` is the ORDERED priority list. The LifecycleDoors
 * component renders every module from this list. Height may vary between
 * doors — that's fine per Gayrat's C2 choice.
 *
 * "close" door stays small (just qClose) — this is real, there simply aren't
 * many modules at this lifecycle stage.
 */
export interface LifecycleDoor {
  stage: 'start' | 'run' | 'grow' | 'close';
  titleKey: string;
  subtitleKey: string;
  iconName: string;
  featuredModules: string[];
  accent: 'navy' | 'gold' | 'success' | 'muted';
}

export const LIFECYCLE_DOORS: LifecycleDoor[] = [
  {
    stage: 'start',
    titleKey: 'lifecycle.start.title',
    subtitleKey: 'lifecycle.start.subtitle',
    iconName: 'Rocket',
    // 6 modules: registration, profile, geoanalytics, maturity diag, pathways, credit
    featuredModules: ['qBiz', 'qReg', 'geo', 'maturity', 'nPath', 'nCredit'],
    accent: 'gold',
  },
  {
    stage: 'run',
    titleKey: 'lifecycle.run.title',
    subtitleKey: 'lifecycle.run.subtitle',
    iconName: 'CheckCircle2',
    // 7 modules: reporting, taxes, HR, comms, business-info, infrastructure, news
    featuredModules: ['qRep', 'nTax', 'nHR', 'comms', 'info', 'qInf', 'qNews'],
    accent: 'navy',
  },
  {
    stage: 'grow',
    titleKey: 'lifecycle.grow.title',
    subtitleKey: 'lifecycle.grow.subtitle',
    iconName: 'TrendingUp',
    // 10 modules: registry, champions, e-commerce, procurement, export, sales, IP,
    // credit, geo (re-entry for expansion), counterparty-check
    featuredModules: [
      'registry',
      'qChamp',
      'ecommerce',
      'nProcure',
      'nExport',
      'nSales',
      'nIP',
      'nCredit',
      'geo',
      'nCheck',
    ],
    accent: 'success',
  },
  {
    stage: 'close',
    titleKey: 'lifecycle.close.title',
    subtitleKey: 'lifecycle.close.subtitle',
    iconName: 'LogOut',
    featuredModules: ['qClose'],
    accent: 'muted',
  },
];

// ═══ HERO CHIPS ══════════════════════════════════════════════════════

export interface HeroChip {
  id: string;
  labelKey: string;
  href: string;
  iconName: string;
}

export const HERO_CHIPS: HeroChip[] = [
  { id: 'register', labelKey: 'hero.chip.register', href: '/modules/qBiz', iconName: 'FilePlus2' },
  { id: 'find-measure', labelKey: 'hero.chip.findMeasure', href: '/modules/registry', iconName: 'BookMarked' },
  { id: 'place', labelKey: 'hero.chip.place', href: '/modules/geo?mode=start', iconName: 'MapPin' },
  { id: 'b2g', labelKey: 'hero.chip.b2g', href: '/modules/comms?tab=b2g', iconName: 'MessagesSquare' },
  { id: 'ecommerce', labelKey: 'hero.chip.ecommerce', href: '/modules/ecommerce', iconName: 'ShoppingBag' },
  { id: 'maturity', labelKey: 'hero.chip.maturity', href: '/modules/maturity', iconName: 'Gauge' },
];

export const CABINET_ROLES: { role: Role; labelKey: string; descKey: string; iconName: string }[] = [
  { role: 'entrepreneur', labelKey: 'cabinet.role.entrepreneur', descKey: 'cabinet.role.entrepreneur.desc', iconName: 'UserCheck' },
  { role: 'regionalMef', labelKey: 'cabinet.role.regionalMef', descKey: 'cabinet.role.regionalMef.desc', iconName: 'ShieldCheck' },
  { role: 'mef', labelKey: 'cabinet.role.mef', descKey: 'cabinet.role.mef.desc', iconName: 'Crown' },
  { role: 'agency', labelKey: 'cabinet.role.agency', descKey: 'cabinet.role.agency.desc', iconName: 'Building2' },
];
