'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Badge } from '@/components/ui/Badge';
import { Card, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { LetterBadge } from '@/components/ui/LetterBadge';
import { Icon } from '@/components/ui/Icon';
import { PartnersGrid } from '@/components/sections/PartnersGrid';
import { PRIORITY_MODULES } from '@/lib/data/modules';
import { useT } from '@/lib/i18n';
import {
  Target, Users, BadgeCheck, Building2, ShoppingBag, Bot, Scale, ArrowRight,
} from 'lucide-react';

const GOAL_ICONS = [Target, BadgeCheck, Bot, Users, ShoppingBag, Building2] as const;

export default function AboutPage() {
  const t = useT();

  return (
    <>
      {/* ─── Hero ─── */}
      <section className="relative hero-glow text-white overflow-hidden">
        <div className="absolute inset-0 pattern-grid opacity-50 pointer-events-none" />
        <div className="container-prose relative py-20 md:py-28">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gold/20 border border-gold/30 text-xs font-medium mb-6">
              <Scale className="h-3.5 w-3.5 text-gold-light" />
              <span>{t('about.hero.eyebrow')}</span>
            </div>
            <h1 className="font-serif text-4xl md:text-5xl font-semibold text-white leading-[1.05] text-balance">
              {t('about.hero.title')}
            </h1>
            <p className="mt-5 text-lg md:text-xl text-white/80 leading-relaxed max-w-3xl">
              {t('about.hero.subtitle')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* ─── Purpose ─── */}
      <section className="container-prose py-16 md:py-20">
        <div className="max-w-3xl">
          <h2 className="text-balance">{t('about.purpose.title')}</h2>
          <div className="mt-6 space-y-5 text-base md:text-lg leading-relaxed">
            <p>{t('about.purpose.p1')}</p>
            <p>{t('about.purpose.p2')}</p>
          </div>
        </div>
      </section>

      {/* ─── UP-50 callout ─── */}
      <section className="bg-navy text-white relative overflow-hidden">
        <div className="absolute inset-0 pattern-dots opacity-40 pointer-events-none" />
        <div className="container-wide relative py-16 md:py-20">
          <div className="grid lg:grid-cols-[1fr_1.4fr] gap-10 items-start">
            <div>
              <Badge variant="priority-solid" className="mb-4">Постановление Президента № УП-50</Badge>
              <h2 className="text-white text-balance">Пункт 4 — шесть приоритетных модулей к 1 июля 2026 года</h2>
              <p className="mt-4 text-white/75 leading-relaxed max-w-lg">
                Фундамент шести модулей должен быть запущен в работу к 1 июля 2026 года согласно прямому поручению Президента Республики Узбекистан от 19 марта 2025 года.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              {PRIORITY_MODULES.map((m) => (
                <Link
                  key={m.slug}
                  href={m.href}
                  className="group relative bg-white/5 hover:bg-white/10 border border-white/10 hover:border-gold/40 rounded-xl p-4 flex items-start gap-3 transition-all"
                >
                  {m.letter && <LetterBadge letter={m.letter} size="sm" variant="gold" className="!bg-gold !text-white !border-gold" />}
                  <div className="flex-1 min-w-0">
                    <div className="font-serif font-semibold text-white text-[15px] leading-snug">
                      {t(m.titleKey)}
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-white/40 group-hover:text-gold-light transition-colors shrink-0" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── Goals ─── */}
      <section className="container-wide py-16 md:py-20">
        <div className="max-w-2xl mb-10">
          <h2 className="text-balance">{t('about.goals.title')}</h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((n, i) => {
            const GoalIcon = GOAL_ICONS[i];
            return (
              <motion.div
                key={n}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.35, delay: i * 0.05 }}
              >
                <Card className="h-full">
                  <div className="h-11 w-11 rounded-full bg-gold/10 text-gold flex items-center justify-center mb-4">
                    <GoalIcon className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-[17px]">{t(`about.goals.${n}.title`)}</CardTitle>
                  <CardDescription>{t(`about.goals.${n}.desc`)}</CardDescription>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ─── Audiences ─── */}
      <section className="bg-bg-band">
        <div className="container-wide py-16 md:py-20">
          <div className="max-w-2xl mb-10">
            <h2 className="text-balance">{t('about.audience.title')}</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              { key: 'ent', Icon: Users, accent: 'gold' as const },
              { key: 'min', Icon: Building2, accent: 'navy' as const },
              { key: 'mef', Icon: Scale, accent: 'secondary' as const },
            ].map(({ key, Icon: AIcon, accent }, i) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
              >
                <Card className="h-full" padding="lg">
                  <div
                    className={
                      'h-14 w-14 rounded-xl flex items-center justify-center mb-5 ' +
                      (accent === 'gold' ? 'bg-gold text-white' : accent === 'navy' ? 'bg-navy text-white' : 'bg-secondary text-white')
                    }
                  >
                    <AIcon className="h-7 w-7" />
                  </div>
                  <CardTitle>{t(`about.audience.${key}.title`)}</CardTitle>
                  <CardDescription className="text-[15px] leading-relaxed">
                    {t(`about.audience.${key}.desc`)}
                  </CardDescription>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Partners (reused) ─── */}
      <PartnersGrid />

      {/* ─── Contacts / CTA ─── */}
      <section className="container-prose py-16 md:py-20 text-center">
        <h2 className="text-balance">Присоединиться к работе над концепцией</h2>
        <p className="mt-4 text-lg max-w-xl mx-auto">
          Проект открыт к обратной связи от ведомств, отраслевых ассоциаций и предпринимательского сообщества.
        </p>
        <div className="mt-8 flex flex-wrap gap-3 justify-center">
          <Link href="/modules">
            <Button size="lg">Посмотреть модули</Button>
          </Link>
          <Link href="/cabinet">
            <Button size="lg" variant="ghost">В личный кабинет</Button>
          </Link>
        </div>
      </section>
    </>
  );
}
