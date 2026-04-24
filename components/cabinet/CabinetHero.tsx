'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/cn';
import type { ReactNode } from 'react';

interface CabinetHeroProps {
  eyebrow: string;
  title: string;
  subtitle?: string;
  badge?: ReactNode;
  rightSlot?: ReactNode;
  tone?: 'navy' | 'gold';
}

export function CabinetHero({ eyebrow, title, subtitle, badge, rightSlot, tone = 'navy' }: CabinetHeroProps) {
  return (
    <section className={cn('relative overflow-hidden', tone === 'navy' ? 'band-navy text-white' : 'bg-gold-gradient text-white')}>
      <div className="absolute inset-0 pattern-grid opacity-45 pointer-events-none" />
      <div className="container-wide relative py-12 md:py-16">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="grid md:grid-cols-[1fr_auto] gap-6 items-center"
        >
          <div>
            <div className="text-xs uppercase tracking-[0.18em] text-gold-light font-medium mb-2 flex items-center gap-2">
              {eyebrow} {badge}
            </div>
            <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-semibold text-white leading-tight text-balance">
              {title}
            </h1>
            {subtitle && <p className="mt-3 text-base md:text-lg text-white/75 max-w-2xl">{subtitle}</p>}
          </div>
          {rightSlot}
        </motion.div>
      </div>
    </section>
  );
}
