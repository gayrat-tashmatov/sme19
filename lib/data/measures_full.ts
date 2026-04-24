/**
 * Sprint 11 — Full support-measures registry.
 *
 * Source: /mnt/project/03_Support_Measures_Registry.xlsx, sheet "Subsidiya+yordam"
 * Extracted: 24.04.2026. 352 rows (out of 359 in raw file — 7 skipped as
 * they had empty record numbers / header fragments).
 *
 * This dataset is rendered inside B_Registry — replaces the demo set of ~30
 * hand-crafted measures. Fields normalized:
 *   • agency — top-level ministry/agency, classified into ~15 buckets
 *   • type — normalized Russian type label (Субсидия / Компенсация / Грант etc.)
 *   • category — 'financial' | 'non-financial' (for top-level filter)
 *   • active — whether status "Амалда" (в силе) was recorded
 *
 * Original raw agency strings preserved? No — consolidated. If we need
 * disambiguation back to the source row, `id` → row number in XLSX.
 */

import raw from './measures_full.json';

export interface FullMeasure {
  id: string;
  name: string;
  agency: string;
  fund: string;
  type: string;
  source: string;
  amount: string;
  legal: string;
  recipient: 'physical' | 'legal' | 'both' | 'any';
  active: boolean;
  category: 'financial' | 'non-financial';
}

export const ALL_MEASURES: FullMeasure[] = raw as FullMeasure[];

// ─── Aggregate helpers for UI ─────────────────────────────────────────

/** Distinct agencies sorted by measure count desc. */
export function getAgencies(): { name: string; count: number }[] {
  const map = new Map<string, number>();
  for (const m of ALL_MEASURES) {
    map.set(m.agency, (map.get(m.agency) ?? 0) + 1);
  }
  return Array.from(map.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}

/** Distinct types sorted by measure count desc. */
export function getTypes(): { name: string; count: number }[] {
  const map = new Map<string, number>();
  for (const m of ALL_MEASURES) {
    map.set(m.type, (map.get(m.type) ?? 0) + 1);
  }
  return Array.from(map.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}

/** Summary block for the registry module hero. */
export const REGISTRY_STATS = {
  total: ALL_MEASURES.length,
  active: ALL_MEASURES.filter((m) => m.active).length,
  financial: ALL_MEASURES.filter((m) => m.category === 'financial').length,
  nonFinancial: ALL_MEASURES.filter((m) => m.category === 'non-financial').length,
  agencyCount: getAgencies().length,
};
