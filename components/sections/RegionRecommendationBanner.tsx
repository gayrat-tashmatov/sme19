'use client';

import Link from 'next/link';
import { MapPin, ArrowRight, Sparkles } from 'lucide-react';
import { useStore } from '@/lib/store';
import { REGIONS } from '@/lib/data/regions';
import { MEASURES } from '@/lib/data/measures';
import { Badge } from '@/components/ui/Badge';
import type { Measure } from '@/lib/types';

/**
 * 7.2 — Cross-module linkage between Geoanalytics and Registry.
 * Reads selectedRegion from store and shows region-specific measure recommendations.
 */

// Region → relevant measure IDs (based on regional priority industries)
// In production this would come from Data Acquisition Plan / MIP filtering
const REGION_MEASURES: Record<string, string[]> = {
  tashkent_c:  ['M015', 'M005', 'M001'],  // capital — digital, IT, manufacturing
  tashkent_r:  ['M001', 'M002', 'M005'],  // region — industry, loans, export
  samarkand:   ['M008', 'M014', 'M011'],  // tourism, export, hospitality
  bukhara:     ['M008', 'M014', 'M011'],  // tourism, handicrafts
  fergana:     ['M014', 'M001', 'M011'],  // silk, textile
  namangan:    ['M014', 'M001'],
  andijan:     ['M014', 'M001'],
  khorezm:     ['M014', 'M008'],
  kashkadarya: ['M001', 'M014'],
  surkhandarya:['M014', 'M001'],
  navoi:       ['M001', 'M002'],
  jizzakh:     ['M001', 'M014'],
  sirdaryo:    ['M014', 'M001'],
  karakalpakstan: ['M014', 'M001'],  // special border region
};

export function RegionRecommendationBanner({
  onSelectMeasure,
}: {
  onSelectMeasure: (m: Measure) => void;
}) {
  const selectedRegion = useStore((s) => s.selectedRegion);

  if (!selectedRegion) return null;

  const region = REGIONS.find((r) => r.id === selectedRegion);
  if (!region) return null;

  const measureIds = REGION_MEASURES[selectedRegion] ?? [];
  const measures = measureIds
    .map((id) => MEASURES.find((m) => m.id === id))
    .filter((m): m is Measure => !!m)
    .slice(0, 3);

  if (measures.length === 0) return null;

  return (
    <div className="rounded-xl border-2 border-secondary/30 bg-secondary/5 p-4 md:p-5 relative">
      <div className="absolute top-3 right-3">
        <Badge variant="info">на основе региона</Badge>
      </div>

      <div className="flex items-start gap-3 mb-3 flex-wrap">
        <div className="h-12 w-12 rounded-xl bg-secondary/15 text-secondary flex items-center justify-center shrink-0">
          <MapPin className="h-6 w-6" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-serif text-[15px] text-ink font-semibold">
            Вы выбирали регион: {region.name_ru}
          </div>
          <div className="text-[12.5px] text-ink-muted mt-0.5">
            Специализация региона: <strong>{region.spec}</strong>. Рекомендуем меры, актуальные для этой отрасли:
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-2">
        {measures.map((m) => (
          <button
            key={m.id}
            onClick={() => onSelectMeasure(m)}
            className="p-3 rounded-lg bg-bg-white border border-ink-line hover:border-secondary/40 text-left transition-colors focus-ring"
          >
            <div className="flex items-start justify-between gap-2 mb-1">
              <div className="text-[10.5px] font-mono text-ink-muted">{m.id}</div>
              <Sparkles className="h-3.5 w-3.5 text-secondary" />
            </div>
            <div className="font-serif text-[13px] text-ink leading-tight mb-1">{m.titleKey}</div>
            <div className="text-[11px] text-ink-muted">{m.agency} · {m.amount}</div>
            <div className="mt-2 text-[11px] text-secondary font-semibold flex items-center gap-1">
              Открыть <ArrowRight className="h-3 w-3" />
            </div>
          </button>
        ))}
      </div>

      <Link href="/modules/geo" className="inline-flex items-center gap-1 mt-3 text-[12px] text-ink-muted hover:text-secondary transition-colors">
        Посмотреть другой регион <ArrowRight className="h-3 w-3" />
      </Link>
    </div>
  );
}
