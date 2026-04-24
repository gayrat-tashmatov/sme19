'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Clock, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { LetterBadge } from '@/components/ui/LetterBadge';

interface ComingSoonProps {
  title: string;
  subtitle?: string;
  letter?: string;
  stage: string;
  backHref?: string;
  backLabel?: string;
}

export function ComingSoon({ title, subtitle, letter, stage, backHref = '/', backLabel = 'На главную' }: ComingSoonProps) {
  return (
    <section className="relative hero-glow text-white overflow-hidden min-h-[70vh] flex items-center">
      <div className="absolute inset-0 pattern-grid opacity-50 pointer-events-none" />
      <div className="container-prose relative py-20 md:py-28">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <Link href={backHref} className="inline-flex items-center gap-1.5 text-sm text-white/70 hover:text-gold-light mb-8 transition-colors">
            <ArrowLeft className="h-4 w-4" /> {backLabel}
          </Link>

          <div className="flex items-start gap-4 mb-5">
            {letter && <LetterBadge letter={letter} size="lg" variant="gold" />}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-medium backdrop-blur-sm mt-1">
              <Clock className="h-3.5 w-3.5 text-gold-light" />
              <span>{stage}</span>
            </div>
          </div>

          <h1 className="text-balance">{title}</h1>
          {subtitle && <p className="mt-4 text-lg md:text-xl text-white/75 leading-relaxed max-w-2xl">{subtitle}</p>}

          <div className="mt-10">
            <Link href="/">
              <Button size="lg" variant="outline-white">На главную</Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
