'use client';

import { useState, FormEvent } from 'react';
import { motion } from 'framer-motion';
import { Send, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useT } from '@/lib/i18n';

export function FinalCTA() {
  const t = useT();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email.includes('@')) return;
    setSubmitted(true);
  }

  return (
    <section className="relative hero-glow text-white overflow-hidden">
      <div className="absolute inset-0 pattern-dots opacity-40 pointer-events-none" />
      <div className="container-prose relative py-20 md:py-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <h2 className="font-serif text-3xl md:text-5xl font-semibold text-white text-balance">
            {t('home.cta.title')}
          </h2>
          <p className="mt-4 text-lg text-white/75 max-w-xl mx-auto">
            {t('home.cta.subtitle')}
          </p>

          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-10 inline-flex items-center gap-3 px-5 py-3 rounded-xl bg-success/20 border border-success/40 text-white"
            >
              <CheckCircle2 className="h-5 w-5 text-success" />
              <span className="font-medium">Спасибо! Мы напишем в августе 2026.</span>
            </motion.div>
          ) : (
            <form
              onSubmit={onSubmit}
              className="mt-10 flex flex-col sm:flex-row items-stretch gap-3 max-w-xl mx-auto"
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('home.cta.email-placeholder')}
                className="flex-1 h-12 px-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder:text-white/50 focus-ring focus-visible:border-gold-light"
              />
              <Button size="lg" type="submit" rightIcon={<Send className="h-4 w-4" />}>
                {t('home.cta.button')}
              </Button>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
}
