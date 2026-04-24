'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar } from 'lucide-react';
import { LetterBadge } from '@/components/ui/LetterBadge';
import { Badge } from '@/components/ui/Badge';
import { Icon } from '@/components/ui/Icon';

interface ModuleHeroProps {
  letter?: string;
  iconName?: string;
  title: string;
  subtitle: string;
  phase: string;
  priority?: 'priority' | 'queue' | 'new-priority' | 'new-queue';
}

export function ModuleHero({ letter, iconName, title, subtitle, phase, priority = 'priority' }: ModuleHeroProps) {
  const isPriority = priority === 'priority' || priority === 'new-priority';
  const isNew = priority === 'new-priority' || priority === 'new-queue';
  return (
    <section className="relative hero-glow text-white overflow-hidden">
      <div className="absolute inset-0 pattern-grid opacity-50 pointer-events-none" />
      <div className="container-wide relative py-14 md:py-20">
        {/* Breadcrumb */}
        <nav className="mb-8 flex items-center gap-2 text-sm text-white/60" aria-label="breadcrumb">
          <Link href="/" className="hover:text-gold-light transition-colors">Главная</Link>
          <span>·</span>
          <Link href="/modules" className="hover:text-gold-light transition-colors">Модули</Link>
          <span>·</span>
          <span className="text-white/90">{title}</span>
        </nav>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="flex items-start gap-5"
        >
          {letter ? (
            <LetterBadge letter={letter} size="lg" variant="gold" className="shrink-0 !bg-gold !text-white !border-gold" />
          ) : iconName ? (
            <div className="shrink-0 h-14 w-14 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm flex items-center justify-center text-gold-light">
              <Icon name={iconName} className="h-6 w-6" />
            </div>
          ) : null}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <Badge variant={isPriority ? 'priority-solid' : 'outline'} className="!border-white/20 !text-white/90 !bg-white/10">
                <Calendar className="h-3 w-3" />
                {phase}
              </Badge>
              {priority === 'priority' && (
                <Badge variant="priority-solid">Приоритет УП-50</Badge>
              )}
              {isNew && (
                <Badge variant="new">NEW · предложение из бенчмарка</Badge>
              )}
            </div>
            <h1 className="font-serif text-3xl md:text-5xl font-semibold text-white leading-[1.08] text-balance">
              {title}
            </h1>
            <p className="mt-3 text-lg text-white/80 max-w-3xl leading-relaxed">
              {subtitle}
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
