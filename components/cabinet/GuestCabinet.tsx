'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Fingerprint, ArrowRight, ShieldCheck, Layers, MapPin, Gauge } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardTitle, CardDescription } from '@/components/ui/Card';

const PREVIEW_FEATURES = [
  { Icon: Layers,  title: 'Цифровой паспорт бизнеса',   desc: 'Все данные вашего бизнеса в едином кабинете' },
  { Icon: Gauge,   title: 'Уровень цифровой зрелости', desc: 'Персональные рекомендации по цифровизации' },
  { Icon: MapPin,  title: 'Карта вашего региона',       desc: 'Свободные лоты Давактив и локальные льготы' },
  { Icon: ShieldCheck, title: 'Обязательства и SLA',    desc: 'Календарь отчётов, платежей, сроков решений' },
];

export function GuestCabinet() {
  return (
    <>
      {/* Hero */}
      <section className="relative hero-glow text-white overflow-hidden">
        <div className="absolute inset-0 pattern-grid opacity-50 pointer-events-none" />
        <div className="container-wide relative py-20 md:py-24 text-center">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mx-auto h-20 w-20 rounded-2xl bg-gold/15 border border-gold/30 flex items-center justify-center mb-6">
              <Fingerprint className="h-10 w-10 text-gold-light" />
            </div>
            <h1 className="font-serif text-4xl md:text-5xl font-semibold text-white text-balance leading-tight">
              Войдите, чтобы открыть ваш кабинет
            </h1>
            <p className="mt-4 text-lg text-white/75 max-w-2xl mx-auto">
              Единая авторизация через OneID. Никаких отдельных логинов в Soliq, Кадастре или Давактив.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button size="lg" leftIcon={<Fingerprint className="h-5 w-5" />}>
                Войти через OneID
              </Button>
              <Link href="/about">
                <Button size="lg" variant="outline-white">О платформе</Button>
              </Link>
            </div>
            <div className="mt-6 text-sm text-white/60">
              Или переключите роль в шапке, чтобы посмотреть демо кабинета
            </div>
          </motion.div>
        </div>
      </section>

      {/* Preview of what's inside */}
      <section className="container-wide py-16 md:py-20">
        <div className="max-w-2xl mb-10">
          <h2 className="text-balance">Что будет доступно после входа</h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {PREVIEW_FEATURES.map(({ Icon, title, desc }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.35, delay: i * 0.08 }}
            >
              <Card className="h-full">
                <div className="h-11 w-11 rounded-xl bg-gold/10 text-gold flex items-center justify-center mb-4">
                  <Icon className="h-5 w-5" />
                </div>
                <CardTitle className="text-[16px]">{title}</CardTitle>
                <CardDescription>{desc}</CardDescription>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="mt-10 rounded-xl border border-gold/30 bg-gold-soft/50 p-5 flex items-start gap-4">
          <ShieldCheck className="h-6 w-6 text-gold-dark mt-0.5 shrink-0" />
          <div>
            <div className="font-serif font-semibold text-ink">OneID — единая авторизация в РУз</div>
            <div className="text-sm text-ink-muted mt-1">
              Ваши данные не покидают защищённого периметра государственной информационной инфраструктуры. Платформа получает доступ только к тем полям, которые необходимы для оказания конкретной услуги.
            </div>
            <Link href="/modules/registry" className="mt-3 inline-flex items-center gap-1 text-sm text-gold hover:text-gold-dark font-medium">
              Посмотреть каталог мер поддержки <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
