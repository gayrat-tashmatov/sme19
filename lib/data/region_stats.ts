/**
 * Sprint 10.2 — Regional SME statistics.
 *
 * Mock figures used by the "Platform in figures" section's regional selector.
 * Numbers are representative (proportions follow real RUz demographics) —
 * absolute values should be verified against stat.uz and MoEF data before
 * public demos. Verification is tracked in Data Acquisition Plan (Request #12).
 *
 * Each region's record also powers the region-specific stat blocks inside
 * Geoanalytics module and the Regional MoEF cabinet.
 */

export interface RegionStats {
  /** Matches RegionWithPath.id in regions.ts */
  id: string;
  /** Russian region name — used as selector label */
  name: string;
  /** Number of registered SME entities — thousands */
  smeCount: number;
  /** Applications for support measures submitted via the Platform — YTD */
  applications: number;
  /** SME share in regional gross product (GRP) — % */
  smeShareGrp: number;
  /** Registered champions (entrepreneurship) */
  champions: number;
  /** Average monthly tickets to B2G (E-Ijro) per 1000 SMEs — proxy for digital maturity */
  b2gTicketsPer1k: number;
}

/** Aggregate national figures — shown by default in the selector. */
export const NATIONAL_STATS = {
  smeCount: 2_140, // ths
  applications: 28_540,
  smeShareGrp: 54.1, // % of GDP (cross-checked with stat.uz general figures)
  champions: 678,
  b2gTicketsPer1k: 12.4,
};

/**
 * Per-region stats. Indexed by region id (matches lib/data/regions.ts).
 * Ordered roughly by population to make the selector list scan-friendly.
 */
export const REGION_STATS: RegionStats[] = [
  {
    id: 'tashkent-city',
    name: 'г. Ташкент',
    smeCount: 355,
    applications: 8_420,
    smeShareGrp: 72.4,
    champions: 104,
    b2gTicketsPer1k: 21.8,
  },
  {
    id: 'samarkand',
    name: 'Самаркандская обл.',
    smeCount: 273,
    applications: 3_180,
    smeShareGrp: 56.8,
    champions: 78,
    b2gTicketsPer1k: 14.2,
  },
  {
    id: 'fergana',
    name: 'Ферганская обл.',
    smeCount: 252,
    applications: 3_020,
    smeShareGrp: 58.1,
    champions: 71,
    b2gTicketsPer1k: 13.6,
  },
  {
    id: 'tashkent',
    name: 'Ташкентская обл.',
    smeCount: 221,
    applications: 2_780,
    smeShareGrp: 55.2,
    champions: 58,
    b2gTicketsPer1k: 15.4,
  },
  {
    id: 'andijan',
    name: 'Андижанская обл.',
    smeCount: 203,
    applications: 2_310,
    smeShareGrp: 54.6,
    champions: 64,
    b2gTicketsPer1k: 11.8,
  },
  {
    id: 'kashkadarya',
    name: 'Кашкадарьинская обл.',
    smeCount: 182,
    applications: 1_940,
    smeShareGrp: 48.3,
    champions: 52,
    b2gTicketsPer1k: 9.2,
  },
  {
    id: 'namangan',
    name: 'Наманганская обл.',
    smeCount: 173,
    applications: 2_010,
    smeShareGrp: 52.7,
    champions: 49,
    b2gTicketsPer1k: 10.3,
  },
  {
    id: 'surkhandarya',
    name: 'Сурхандарьинская обл.',
    smeCount: 152,
    applications: 1_520,
    smeShareGrp: 46.9,
    champions: 41,
    b2gTicketsPer1k: 8.4,
  },
  {
    id: 'bukhara',
    name: 'Бухарская обл.',
    smeCount: 142,
    applications: 1_680,
    smeShareGrp: 54.2,
    champions: 46,
    b2gTicketsPer1k: 10.8,
  },
  {
    id: 'khorezm',
    name: 'Хорезмская обл.',
    smeCount: 134,
    applications: 1_340,
    smeShareGrp: 50.7,
    champions: 38,
    b2gTicketsPer1k: 9.6,
  },
  {
    id: 'karakalpakstan',
    name: 'Республика Каракалпакстан',
    smeCount: 112,
    applications: 980,
    smeShareGrp: 44.1,
    champions: 28,
    b2gTicketsPer1k: 7.2,
  },
  {
    id: 'jizzakh',
    name: 'Джизакская обл.',
    smeCount: 103,
    applications: 1_120,
    smeShareGrp: 49.4,
    champions: 32,
    b2gTicketsPer1k: 9.8,
  },
  {
    id: 'navoi',
    name: 'Навоийская обл.',
    smeCount: 87,
    applications: 910,
    smeShareGrp: 45.3,
    champions: 25,
    b2gTicketsPer1k: 8.6,
  },
  {
    id: 'syrdarya',
    name: 'Сырдарьинская обл.',
    smeCount: 68,
    applications: 680,
    smeShareGrp: 47.8,
    champions: 19,
    b2gTicketsPer1k: 8.9,
  },
];

/** Helper — lookup by id. */
export function getRegionStats(id: string | null): RegionStats | null {
  if (!id) return null;
  return REGION_STATS.find((r) => r.id === id) ?? null;
}
