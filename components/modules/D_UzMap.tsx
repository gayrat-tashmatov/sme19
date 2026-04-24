'use client';

import { useState } from 'react';
import { cn } from '@/lib/cn';
import { REGIONS, REGIONS_VIEWBOX } from '@/lib/data/regions';
import type { RegionWithPath } from '@/lib/data/regions';

interface UzMapProps {
  selected?: string | null;
  onSelect?: (regionId: string) => void;
  highlightIds?: string[]; // e.g. auto-location for current user
  className?: string;
}

/**
 * Interactive SVG map of Uzbekistan.
 * Uses real simplemaps.com paths (attribution in Footer).
 * 14 administrative units: 12 oblasts + Karakalpakstan + Tashkent city.
 */
export function UzMap({ selected, onSelect, highlightIds = [], className }: UzMapProps) {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div className={cn('relative', className)}>
      <svg
        viewBox={REGIONS_VIEWBOX}
        className="w-full h-auto"
        aria-label="Карта Узбекистана"
      >
        <defs>
          <filter id="region-shadow" x="-2%" y="-2%" width="104%" height="104%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="2" />
            <feOffset dx="0" dy="1" />
            <feComponentTransfer><feFuncA type="linear" slope="0.18" /></feComponentTransfer>
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id="map-bg" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0" stopColor="#F7F8FA" />
            <stop offset="1" stopColor="#EFF1F4" />
          </linearGradient>
        </defs>

        <rect width="1000" height="652" fill="url(#map-bg)" rx="10" />

        {/* subtle pattern */}
        <g opacity="0.35">
          {Array.from({ length: 20 }).map((_, i) =>
            Array.from({ length: 13 }).map((_, j) => (
              <circle key={`${i}-${j}`} cx={50 + i * 47} cy={30 + j * 47} r={0.8} fill="#B08D4C" />
            )),
          ).flat()}
        </g>

        {/* regions */}
        {REGIONS.map((r) => {
          const isSel = selected === r.id;
          const isHov = hovered === r.id;
          const isHighlighted = highlightIds.includes(r.id);
          return (
            <path
              key={r.id}
              d={r.d}
              data-region-id={r.id}
              data-region-name={r.name_ru}
              className={cn(
                'transition-all duration-200 cursor-pointer',
                'stroke-2',
              )}
              style={{
                fill: isSel
                  ? '#8B6F3A'
                  : isHighlighted
                    ? '#B08D4C'
                    : isHov
                      ? '#D9C9A3'
                      : '#FFFFFF',
                fillOpacity: isSel ? 0.75 : isHighlighted ? 0.45 : isHov ? 0.85 : 1,
                stroke: isSel
                  ? '#6E5829'
                  : isHighlighted
                    ? '#8B6F3A'
                    : isHov
                      ? '#8B6F3A'
                      : '#C5CBD3',
                filter: isSel || isHighlighted ? 'url(#region-shadow)' : undefined,
              }}
              onMouseEnter={() => setHovered(r.id)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => onSelect?.(r.id)}
            >
              <title>{r.name_ru}</title>
            </path>
          );
        })}

        {/* Tashkent city marker ring if tashkent_c is present */}
        <circle cx="673.4" cy="506" r="6" fill="#1B2A3D" opacity="0.9" />
        <circle cx="673.4" cy="506" r="3" fill="#FFFFFF" />
      </svg>

      {/* Hover tooltip */}
      {hovered && (
        <div className="absolute top-3 left-3 bg-navy text-white text-sm rounded-lg px-3 py-2 shadow-card-hover pointer-events-none">
          <div className="font-serif font-semibold">{REGIONS.find((r) => r.id === hovered)?.name_ru}</div>
          <div className="text-xs text-white/70">{REGIONS.find((r) => r.id === hovered)?.spec}</div>
        </div>
      )}

      {/* Legend */}
      <div className="absolute bottom-3 right-3 flex flex-col gap-1.5 bg-bg-white/90 backdrop-blur rounded-lg border border-ink-line px-3 py-2 text-xs">
        <Legend color="#8B6F3A" label="Выбран" />
        <Legend color="#B08D4C" label="Ваш регион" />
        <Legend color="#C5CBD3" label="Регион" variant="outline" />
      </div>
    </div>
  );
}

function Legend({ color, label, variant = 'solid' }: { color: string; label: string; variant?: 'solid' | 'outline' }) {
  return (
    <div className="flex items-center gap-2">
      <span
        className="h-3 w-4 rounded-sm inline-block"
        style={variant === 'outline'
          ? { border: `2px solid ${color}`, background: 'transparent' }
          : { background: color }}
      />
      <span className="text-ink">{label}</span>
    </div>
  );
}

export function getRegionSummary(id: string): RegionWithPath | undefined {
  return REGIONS.find((r) => r.id === id);
}
