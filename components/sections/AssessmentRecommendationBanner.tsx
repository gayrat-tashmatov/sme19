'use client';

import Link from 'next/link';
import { useStore, type AssessmentResult } from '@/lib/store';
import { Sparkles, ArrowRight, Gauge, Coins, Plane, Briefcase, ScrollText, Receipt } from 'lucide-react';
import { MEASURES } from '@/lib/data/measures';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/cn';
import type { Measure } from '@/lib/types';

/**
 * 7.1 — Cross-module linkage between Самооценка and Реестр.
 * Reads assessment results from store and suggests relevant measures.
 */

const TYPE_META: Record<AssessmentResult['type'], { label: string; Icon: typeof Gauge; color: string }> = {
  digital:  { label: 'Цифровая зрелость',         Icon: Gauge,      color: '#1B2A3D' },
  finlit:   { label: 'Финансовая грамотность',     Icon: Coins,      color: '#8B6F3A' },
  export:   { label: 'Экспортная готовность',      Icon: Plane,      color: '#4CAF50' },
  finance:  { label: 'Готовность к финансированию', Icon: Briefcase,  color: '#5B8DB8' },
  legal:    { label: 'Правовая грамотность',       Icon: ScrollText, color: '#5A6575' },
  tax:      { label: 'Налоговая грамотность',      Icon: Receipt,    color: '#B08D4C' },
};

const LEVEL_LABEL: Record<'low' | 'medium' | 'high', { text: string; variant: 'danger' | 'warning' | 'success' }> = {
  low:    { text: 'Базовый',     variant: 'danger'  },
  medium: { text: 'Средний',     variant: 'warning' },
  high:   { text: 'Высокий',     variant: 'success' },
};

// Which measure IDs are relevant for each assessment type + level combo
function getRecommendedMeasureIds(type: AssessmentResult['type'], level: 'low' | 'medium' | 'high'): string[] {
  // For demo — pick first N relevant measures by type/category
  if (type === 'digital') {
    if (level === 'low')    return ['M015', 'M013', 'M014']; // basic digital transformation
    if (level === 'medium') return ['M015', 'M014'];
    return ['M014']; // advanced — just one export-ready
  }
  if (type === 'finlit') {
    return ['M013', 'M015']; // training and consulting
  }
  if (type === 'export') {
    if (level === 'high')   return ['M014', 'M008', 'M011']; // export ready — export subsidies
    if (level === 'medium') return ['M014', 'M011'];
    return ['M013']; // novice — training first
  }
  if (type === 'finance') {
    if (level === 'high')   return ['M001', 'M002', 'M005']; // finance ready — loans
    if (level === 'medium') return ['M002', 'M013'];
    return ['M013', 'M015']; // not ready — training first
  }
  return [];
}

export function AssessmentRecommendationBanner({
  onSelectMeasure,
}: {
  onSelectMeasure: (m: Measure) => void;
}) {
  const assessments = useStore((s) => s.assessments);
  const completedAssessments = Object.values(assessments).filter(Boolean) as AssessmentResult[];

  if (completedAssessments.length === 0) return null;

  // Pick the most recent assessment
  const latest = completedAssessments.sort((a, b) => b.completedAt - a.completedAt)[0];
  const meta = TYPE_META[latest.type];
  const levelInfo = LEVEL_LABEL[latest.level];

  const recommendedIds = getRecommendedMeasureIds(latest.type, latest.level);
  const recommended = recommendedIds
    .map((id) => MEASURES.find((m) => m.id === id))
    .filter((m): m is Measure => !!m)
    .slice(0, 3);

  if (recommended.length === 0) return null;

  return (
    <div
      className="rounded-xl border-2 p-4 md:p-5 relative overflow-hidden"
      style={{ borderColor: meta.color + '40', background: meta.color + '08' }}
    >
      <div className="absolute top-3 right-3">
        <Badge variant="new">на основе оценки</Badge>
      </div>

      <div className="flex items-start gap-4 flex-wrap">
        {/* Icon + title */}
        <div className="flex items-center gap-3">
          <div
            className="h-12 w-12 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: meta.color + '18', color: meta.color }}
          >
            <meta.Icon className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-0.5 flex-wrap">
              <div className="font-serif text-[15px] text-ink font-semibold">Вы прошли: {meta.label}</div>
              <Badge variant={levelInfo.variant}>{levelInfo.text} · {latest.scorePct}%</Badge>
            </div>
            <div className="text-[12.5px] text-ink-muted">
              На основе результатов рекомендуем эти {recommended.length} мер{recommended.length > 1 ? 'ы' : 'у'} поддержки:
            </div>
          </div>
        </div>
      </div>

      {/* Recommended measures */}
      <div className="mt-4 grid md:grid-cols-3 gap-2">
        {recommended.map((m) => (
          <button
            key={m.id}
            onClick={() => onSelectMeasure(m)}
            className="p-3 rounded-lg bg-bg-white border border-ink-line hover:border-gold/40 text-left transition-colors focus-ring"
          >
            <div className="flex items-start justify-between gap-2 mb-1">
              <div className="text-[10.5px] font-mono text-ink-muted">{m.id}</div>
              <Sparkles className="h-3.5 w-3.5 text-gold" />
            </div>
            <div className="font-serif text-[13px] text-ink leading-tight mb-1">{m.titleKey}</div>
            <div className="text-[11px] text-ink-muted">{m.agency} · {m.amount}</div>
            <div className="mt-2 text-[11px] text-gold font-semibold flex items-center gap-1">
              Открыть <ArrowRight className="h-3 w-3" />
            </div>
          </button>
        ))}
      </div>

      <Link href="/modules/maturity" className="inline-flex items-center gap-1 mt-3 text-[12px] text-ink-muted hover:text-gold transition-colors">
        Пройти ещё одну оценку <ArrowRight className="h-3 w-3" />
      </Link>
    </div>
  );
}
