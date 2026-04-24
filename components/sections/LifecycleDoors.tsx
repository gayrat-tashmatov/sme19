'use client';

/**
 * Sprint 10.1 — LifecycleDoors.
 *
 * The "4 big doors" strip placed directly under the hero. Inspired by
 * business.gov.au / gobusiness.gov.sg lifecycle entry points — but adapted
 * with visible module pills inside each door so users can see the concrete
 * platform tools available at each stage, not just abstract stage names.
 *
 * Each door is a link to a filtered view of the module catalog
 * (/modules?stage=start|run|grow|close) — routing implemented in the modules
 * page in Sprint 10.3.
 */

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Rocket, CheckCircle2, TrendingUp, LogOut } from 'lucide-react';
import { LIFECYCLE_DOORS, type LifecycleDoor } from '@/lib/data/navigation';
import { getModuleBySlug } from '@/lib/data/modules';
import { useT } from '@/lib/i18n';
import { cn } from '@/lib/cn';

const ICONS = {
  Rocket,
  CheckCircle2,
  TrendingUp,
  LogOut,
} as const;

export function LifecycleDoors() {
  const t = useT();

  return (
    <section className="container-wide py-14 md:py-20">
      <div className="max-w-3xl mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-soft border border-gold/20 text-[11px] font-semibold text-gold-dark tracking-wider uppercase mb-3">
          {t('lifecycle.eyebrow')}
        </div>
        <h2 className="font-serif text-3xl md:text-4xl font-semibold text-navy text-balance">
          {t('lifecycle.title')}
        </h2>
        <p className="mt-3 text-lg text-ink-muted text-pretty">
          {t('lifecycle.subtitle')}
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
        {LIFECYCLE_DOORS.map((door, i) => (
          <motion.div
            key={door.stage}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.07 }}
          >
            <DoorCard door={door} />
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function DoorCard({ door }: { door: LifecycleDoor }) {
  const t = useT();
  const Icon = ICONS[door.iconName as keyof typeof ICONS] ?? Rocket;

  // Accent palette — each stage gets its own colour treatment.
  const palette = PALETTE[door.accent];

  // Sprint 12 — show ALL modules for this stage (no 4-pill cap).
  // Doors may render at different heights; that's acceptable per Gayrat's C2.
  const featured = door.featuredModules
    .map((slug) => getModuleBySlug(slug))
    .filter((m): m is NonNullable<typeof m> => Boolean(m));

  return (
    <Link
      href={`/modules?stage=${door.stage}`}
      className={cn(
        'group block h-full rounded-2xl border p-6 transition-all focus-ring',
        'hover:shadow-card-hover hover:-translate-y-0.5',
        palette.card,
      )}
    >
      {/* Icon + heading */}
      <div className="flex items-start justify-between mb-4">
        <div
          className={cn(
            'h-12 w-12 rounded-xl flex items-center justify-center',
            palette.iconBg,
          )}
        >
          <Icon className={cn('h-6 w-6', palette.icon)} />
        </div>
        <ArrowRight
          className={cn(
            'h-4 w-4 opacity-0 -translate-x-1 transition-all duration-200',
            'group-hover:opacity-100 group-hover:translate-x-0',
            palette.icon,
          )}
        />
      </div>

      <h3 className={cn('font-serif text-xl font-semibold leading-tight', palette.title)}>
        {t(door.titleKey)}
      </h3>
      <p className={cn('mt-1.5 text-sm', palette.subtitle)}>{t(door.subtitleKey)}</p>

      {/* Featured modules — visible pills inside the door */}
      {featured.length > 0 && (
        <div className="mt-5 pt-4 border-t border-dashed border-current/10">
          <div className="flex flex-wrap gap-1.5">
            {featured.map((m) => (
              <span
                key={m.slug}
                className={cn(
                  'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10.5px] font-medium',
                  palette.pill,
                )}
              >
                {m.letter && <span className="font-serif">{m.letter}</span>}
                {t(m.titleKey)}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className={cn('mt-4 text-sm font-medium inline-flex items-center gap-1', palette.cta)}>
        {t('lifecycle.doorCta')}
        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
      </div>
    </Link>
  );
}

// Colour palette per stage. Each palette is a flat object of Tailwind classes.
const PALETTE: Record<
  LifecycleDoor['accent'],
  {
    card: string;
    iconBg: string;
    icon: string;
    title: string;
    subtitle: string;
    pill: string;
    cta: string;
  }
> = {
  gold: {
    card: 'bg-gold-soft/60 border-gold/25 hover:border-gold/50',
    iconBg: 'bg-gold-gradient text-white',
    icon: 'text-white',
    title: 'text-navy',
    subtitle: 'text-ink-muted',
    pill: 'bg-white/70 text-gold-dark border border-gold/20',
    cta: 'text-gold-dark',
  },
  navy: {
    card: 'bg-navy-50 border-navy/15 hover:border-navy/35',
    iconBg: 'bg-navy text-white',
    icon: 'text-white',
    title: 'text-navy',
    subtitle: 'text-ink-muted',
    pill: 'bg-white/80 text-navy border border-navy/10',
    cta: 'text-navy',
  },
  success: {
    card: 'bg-success/8 border-success/25 hover:border-success/50',
    iconBg: 'bg-success text-white',
    icon: 'text-white',
    title: 'text-navy',
    subtitle: 'text-ink-muted',
    pill: 'bg-white/80 text-success border border-success/20',
    cta: 'text-success',
  },
  muted: {
    card: 'bg-bg-band border-ink-line hover:border-ink-muted/30',
    iconBg: 'bg-ink-muted text-white',
    icon: 'text-white',
    title: 'text-navy',
    subtitle: 'text-ink-muted',
    pill: 'bg-white text-ink-muted border border-ink-line',
    cta: 'text-ink-muted',
  },
};
