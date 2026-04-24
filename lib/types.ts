// ──────────────────────────────────────────────────────────────────
// Shared domain types for YARP prototype.
// Keep this file free of React — used by both server and client.
// ──────────────────────────────────────────────────────────────────

export type Lang = 'ru' | 'uz' | 'en';

export type Role = 'guest' | 'entrepreneur' | 'regionalMef' | 'mef' | 'agency';

export type LocaleString = { ru: string; uz: string; en: string };

/** Module priority — drives visual treatment across the product. */
export type ModulePriority = 'priority' | 'queue' | 'new-priority' | 'new-queue';

/**
 * Sprint 10.1 — Launch phase tag.
 * Controls visual treatment and copy around "when will this be available".
 * - phase1 · functional foundation by 01.07.2026 (the 6 UP-50 modules)
 * - phase2 · extension · H2 2026 – 2027
 * - phase3 · maturity · 2027+
 */
export type ModulePhase = 'phase1' | 'phase2' | 'phase3';

/**
 * Sprint 10.1 — Navigation category.
 * Top-level menu structure: 5 categories + OneID button.
 * Geoanalytics lives primarily in 'tools' with deep-links from 'services'.
 */
export type NavCategory = 'services' | 'measures' | 'tools' | 'knowledge' | 'cabinets';

/**
 * Sprint 10.1 — Business lifecycle stage.
 * Drives "4 big doors" under the hero and cross-module recommendations.
 */
export type LifecycleStage = 'start' | 'run' | 'grow' | 'close';

export type ModuleSlug =
  | 'comms'
  | 'registry'
  | 'ecommerce'
  | 'info'
  | 'geo'
  | 'maturity'
  | 'nCheck'
  | 'nPath'
  | 'qReg'
  | 'qBiz'
  | 'qRep'
  | 'qWF'
  | 'qInf'
  | 'qNews'
  | 'qChamp'
  | 'qClose'
  | 'nProcure'
  | 'nLearn'
  | 'nGuide'
  | 'nStartup'
  | 'nLifecycle'
  | 'nTax'
  | 'nCredit'
  | 'nSales'
  | 'nExport'
  | 'nHR'
  | 'nIP';

export interface ModuleMeta {
  slug: ModuleSlug;
  /** Latin letter a/b/v/g/d/e for the six priority modules; null for queue. */
  letter: 'а' | 'б' | 'в' | 'г' | 'д' | 'е' | null;
  titleKey: string;
  descKey: string;
  iconName: string; // name from lucide-react
  priority: ModulePriority;
  phase: string; // legacy "Фаза 1 · до 01.07.2026" label key used across older cards
  href: string;

  // ─── Sprint 10.1 extensions ───────────────────────────────────────
  /** Launch phase tag — drives visual treatment across the product. */
  phaseTag?: ModulePhase;
  /** Primary navigation category for the top menu. */
  category?: NavCategory;
  /** Lifecycle stages the module supports — one module may span several. */
  lifecycleStages?: LifecycleStage[];
  /**
   * Phase 1 modules only: whether the informational layer is ready by 01.07.2026.
   * When true, we show "Информация ✓ · Интеграции: Q3–Q4 2026" dual indicator.
   */
  infoReady?: boolean;
  /** Phase 1 modules only: target date for full integrations. Free-form string. */
  integrationBy?: string;
  /**
   * Sprint 10.1 — whether opening the module requires OneID sign-in.
   * Used to show a lock icon in guest mode.
   */
  requiresAuth?: boolean;
}

export type MeasureCategory = 'financial' | 'non-financial';

export type MeasureType =
  // financial
  | 'subsidy' | 'loan' | 'benefit' | 'grant'
  // non-financial
  | 'consulting' | 'training' | 'export-help' | 'partner-matching' | 'certification' | 'legal-help';

export interface Measure {
  id: string;
  titleKey: string;
  type: MeasureType;
  category: MeasureCategory;
  industry: string;
  amount: string;       // for financial — sum; for non-financial — duration / scope
  term: string;         // for financial — repayment term; for non-financial — format
  agency: string;
  criteria: MeasureCriterion[];
  docs: string[];
  okCount: number;
  totalCount: number;
  /** Optional narrative — if omitted, a generic description is rendered. */
  description?: string;
  /** Optional procedure steps — if omitted, generic 5-step procedure is used. */
  procedure?: string[];
  /** Optional FAQ pairs — if omitted, generic 3 FAQ are used. */
  faq?: { q: string; a: string }[];
}

export interface MeasureCriterion {
  key: string;
  label_ru: string;
  label_uz?: string;
  label_en?: string;
  ok: boolean;
}

export interface Region {
  id: string;
  svgId: string;
  name_ru: string;
  name_uz: string;
  name_en: string;
  spec: string;
  topIndustries: string[];
  lots: number;
  smeDensity: number; // per 1000 inhabitants — mock figure
}

export interface Lot {
  id: string;
  regionId: string;
  type: string;
  address: string;
  areaSqm: number;
  priceMonthUzs: number;
  status: 'available' | 'reserved' | 'leased';
  contact: string;
}

export interface Marketplace {
  id: string;
  name: string;
  coverage: 'UZ' | 'CIS' | 'GLOBAL';
  category: 'marketplace' | 'aggregator' | 'B2B';
  isPartner: boolean;
  descKey: string;
}

export interface Ministry {
  id: string;
  nameKey: string;
  iconName: string;
  jurisdictionKey: string;
}

export interface MaturityDimension {
  key: 'processes' | 'people' | 'data' | 'tech' | 'security' | 'customer';
  labelKey: string;
}

export interface MaturityQuestion {
  id: string;
  dimension: MaturityDimension['key'];
  textKey: string;
  type: 'scale' | 'radio';
  options?: string[];
}

export interface Course {
  id: string;
  titleKey: string;
  duration: string;
  level: 'basic' | 'intermediate' | 'advanced';
  dimension: MaturityDimension['key'];
}
