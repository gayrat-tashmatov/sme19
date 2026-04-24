'use client';

import { motion } from 'framer-motion';
import { LogIn, Search, FileCheck2, Bell } from 'lucide-react';
import { useT } from '@/lib/i18n';

const STEPS = [
  { num: 1, titleKey: 'home.how.step1.title', descKey: 'home.how.step1.desc', Icon: LogIn },
  { num: 2, titleKey: 'home.how.step2.title', descKey: 'home.how.step2.desc', Icon: Search },
  { num: 3, titleKey: 'home.how.step3.title', descKey: 'home.how.step3.desc', Icon: FileCheck2 },
  { num: 4, titleKey: 'home.how.step4.title', descKey: 'home.how.step4.desc', Icon: Bell },
];

export function HowItWorks() {
  const t = useT();
  return (
    <section className="bg-bg-band">
      <div className="container-wide py-16 md:py-20">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-xs uppercase tracking-[0.18em] text-gold font-medium mb-3">
            {t('home.how.eyebrow')}
          </p>
          <h2 className="text-balance">{t('home.how.title')}</h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {STEPS.map(({ num, titleKey, descKey, Icon }, i) => (
            <motion.div
              key={num}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.4, delay: i * 0.08, ease: 'easeOut' }}
              className="relative"
            >
              <div className="surface-card p-5 md:p-6 h-full relative overflow-hidden">
                <span
                  aria-hidden
                  className="absolute -top-4 -right-3 font-serif font-bold text-[88px] leading-none text-gold/10 select-none"
                >
                  {num}
                </span>
                <div className="relative h-12 w-12 rounded-xl bg-gold/10 text-gold flex items-center justify-center mb-4">
                  <Icon className="h-6 w-6" />
                </div>
                <div className="relative font-serif font-semibold text-lg text-ink leading-tight">
                  {t(titleKey)}
                </div>
                <p className="relative mt-2 text-sm text-ink-muted leading-relaxed">
                  {t(descKey)}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
