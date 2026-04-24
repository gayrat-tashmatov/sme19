'use client';

import { motion } from 'framer-motion';
import { Icon } from '@/components/ui/Icon';
import { useT } from '@/lib/i18n';
import { PARTNERS } from '@/lib/data/partners';
import { cn } from '@/lib/cn';

const STATUS_RING: Record<string, string> = {
  ready: 'ring-success/30 bg-success/5',
  'in-progress': 'ring-gold/30 bg-gold/5',
  planned: 'ring-ink-line bg-bg-white',
};

const STATUS_DOT: Record<string, string> = {
  ready: 'bg-success',
  'in-progress': 'bg-gold',
  planned: 'bg-ink-muted/50',
};

const STATUS_LABEL_RU: Record<string, string> = {
  ready: 'готово',
  'in-progress': 'в разработке',
  planned: 'запланировано',
};

export function PartnersGrid() {
  const t = useT();
  return (
    <section className="bg-bg-band">
      <div className="container-wide py-16 md:py-20">
        <div className="max-w-2xl mb-10">
          <p className="text-xs uppercase tracking-[0.18em] text-gold font-medium mb-3">
            {t('home.partners.eyebrow')}
          </p>
          <h2 className="text-balance">{t('home.partners.title')}</h2>
          <p className="mt-3 text-base">{t('home.partners.subtitle')}</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {PARTNERS.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.3, delay: i * 0.03, ease: 'easeOut' }}
              className={cn(
                'group relative surface-card p-5 flex flex-col items-start gap-3 ring-1',
                STATUS_RING[p.status],
              )}
            >
              <div className="h-11 w-11 rounded-full bg-bg-white border border-ink-line flex items-center justify-center text-gold">
                <Icon name={p.iconName} className="h-5 w-5" />
              </div>
              <div>
                <div className="font-serif font-semibold text-[15px] text-ink">{p.name}</div>
                <div className="text-xs text-ink-muted mt-0.5 uppercase tracking-wide">{p.category}</div>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-ink-muted">
                <span className={cn('h-1.5 w-1.5 rounded-full', STATUS_DOT[p.status])} />
                {STATUS_LABEL_RU[p.status]}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
