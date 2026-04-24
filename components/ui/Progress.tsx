import { cn } from '@/lib/cn';

interface ProgressBarProps {
  value: number; // 0–100
  max?: number;
  tone?: 'gold' | 'success' | 'navy' | 'danger';
  height?: 'sm' | 'md';
  className?: string;
  showLabel?: boolean;
}

const TONE = {
  gold: 'bg-gold',
  success: 'bg-success',
  navy: 'bg-navy',
  danger: 'bg-danger',
};

export function ProgressBar({
  value,
  max = 100,
  tone = 'gold',
  height = 'md',
  className,
  showLabel,
}: ProgressBarProps) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div className={cn('w-full', className)}>
      {showLabel && (
        <div className="flex justify-between text-xs text-ink-muted mb-1.5 font-medium">
          <span>{Math.round(pct)}%</span>
          <span>{value} / {max}</span>
        </div>
      )}
      <div
        className={cn('w-full rounded-full bg-bg-band overflow-hidden', height === 'sm' ? 'h-1.5' : 'h-2.5')}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
      >
        <div
          className={cn('h-full rounded-full transition-all duration-500', TONE[tone])}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

interface CircularProgressProps {
  value: number; // 0–100
  size?: number;
  strokeWidth?: number;
  label?: string;
  sublabel?: string;
  tone?: 'gold' | 'success' | 'navy';
  className?: string;
}

export function CircularProgress({
  value,
  size = 140,
  strokeWidth = 12,
  label,
  sublabel,
  tone = 'gold',
  className,
}: CircularProgressProps) {
  const radius = (size - strokeWidth) / 2;
  const circ = 2 * Math.PI * radius;
  const pct = Math.max(0, Math.min(100, value));
  const offset = circ - (pct / 100) * circ;
  const color = tone === 'gold' ? '#8B6F3A' : tone === 'success' ? '#4CAF50' : '#1B2A3D';

  return (
    <div className={cn('relative inline-flex items-center justify-center', className)} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} stroke="#EFF1F4" strokeWidth={strokeWidth} fill="none" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 600ms ease-out' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {label && <div className="font-serif text-3xl font-semibold text-ink leading-none">{label}</div>}
        {sublabel && <div className="text-xs text-ink-muted mt-1 uppercase tracking-wide">{sublabel}</div>}
      </div>
    </div>
  );
}
