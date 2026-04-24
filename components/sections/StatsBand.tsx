'use client';

import { motion } from 'framer-motion';
import { useT } from '@/lib/i18n';

const STATS = [
  { num: '359', labelKey: 'home.stats.measures' },
  { num: '419', labelKey: 'home.stats.tax-benefits' },
  { num: '14',  labelKey: 'home.stats.regions' },
  { num: '8',   labelKey: 'home.stats.agencies' },
];

export function StatsBand() {
  const t = useT();
  return (
    <section className="bg-navy text-white relative overflow-hidden">
      <div className="absolute inset-0 pattern-dots opacity-50 pointer-events-none" />
      <div className="container-wide relative py-14 md:py-16">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.7 }}
          viewport={{ once: true }}
          className="text-xs uppercase tracking-[0.18em] text-gold-light mb-8 font-medium"
        >
          {t('home.stats.intro')}
        </motion.p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-10">
          {STATS.map((s, i) => (
            <motion.div
              key={s.labelKey}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: i * 0.08, ease: 'easeOut' }}
            >
              <div className="kpi-number text-gold-light">{s.num}</div>
              <div className="mt-2.5 text-sm md:text-base text-white/70 leading-snug">
                {t(s.labelKey)}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
