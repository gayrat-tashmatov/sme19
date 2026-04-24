'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Card, CardTitle, CardDescription } from '@/components/ui/Card';
import { LetterBadge } from '@/components/ui/LetterBadge';
import { Badge } from '@/components/ui/Badge';
import { Icon } from '@/components/ui/Icon';
import { PhaseBadge } from '@/components/ui/PhaseBadge';
import { useT } from '@/lib/i18n';
import { cn } from '@/lib/cn';
import type { ModuleMeta } from '@/lib/types';

interface ModuleCardGridProps {
  modules: ModuleMeta[];
  variant: 'priority' | 'queue' | 'new-priority' | 'new-queue';
  columns?: 3 | 2;
}

export function ModuleCardGrid({ modules, variant, columns = 3 }: ModuleCardGridProps) {
  const t = useT();
  const grid = columns === 2
    ? 'grid md:grid-cols-2 gap-4'
    : 'grid md:grid-cols-2 lg:grid-cols-3 gap-4';
  const isNew = variant === 'new-priority' || variant === 'new-queue';

  return (
    <div className={grid}>
      {modules.map((m, i) => (
        <motion.div
          key={m.slug}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.35, delay: i * 0.04, ease: 'easeOut' }}
        >
          <Link href={m.href} className="block h-full focus-ring rounded-xl relative group">
            {isNew && (
              <div className="absolute -top-2 -right-2 z-10">
                <Badge variant="new" className="shadow-md">NEW</Badge>
              </div>
            )}
            <Card hover className={cn(
              'h-full flex flex-col',
              variant === 'queue' && 'bg-bg-band/60',
              isNew && 'border-success/40 bg-success/[0.03]',
            )}>
              <div className="flex items-start gap-4">
                {m.letter ? (
                  <LetterBadge letter={m.letter} size="md" variant="gold" />
                ) : (
                  <div className={cn(
                    'h-10 w-10 rounded-full border flex items-center justify-center bg-bg-white',
                    isNew ? 'border-success/40 text-success' : 'border-ink-line text-ink-muted',
                  )}>
                    <Icon name={m.iconName} className="h-5 w-5" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-[17px] leading-snug">{t(m.titleKey)}</CardTitle>
                  <CardDescription className="mt-1.5 text-[13px] leading-relaxed">
                    {t(m.descKey)}
                  </CardDescription>
                </div>
              </div>

              {/* Phase badge — dual-layer for Phase 1, compact for 2/3 */}
              {m.phaseTag && (
                <div className="mt-4">
                  <PhaseBadge
                    phase={m.phaseTag}
                    integrationBy={m.integrationBy}
                    infoReady={m.infoReady}
                    size="md"
                    compact={m.phaseTag !== 'phase1'}
                  />
                </div>
              )}

              <div className="flex-1" />

              <div className="mt-5 flex items-center justify-end">
                <span className="text-sm text-gold font-medium flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                  {t('ui.open')} <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </Card>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
