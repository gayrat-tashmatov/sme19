'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { User, UserCheck, ShieldCheck, Crown, Building2, ArrowRight, LogIn } from 'lucide-react';
import { useStore } from '@/lib/store';
import type { Role } from '@/lib/types';

/**
 * Role selector band on the home page.
 * Makes role switching highly visible — one click sets role in store and
 * navigates to /cabinet, which then renders the role-specific cabinet.
 */
export function RoleSwitcherBand() {
  const router = useRouter();
  const setRole = useStore((s) => s.setRole);
  const currentRole = useStore((s) => s.role);

  const chooseRole = (role: Role) => {
    setRole(role);
    router.push('/cabinet');
  };

  const roles: { id: Role; title: string; subtitle: string; tag: string; Icon: typeof User; accent: string }[] = [
    {
      id: 'entrepreneur',
      title: 'Предприниматель',
      subtitle: 'Профиль бизнеса, меры, заявки, цифровая зрелость, рекомендации',
      tag: 'демо: Алишер Каримов · ООО «Karimov Tekstil»',
      Icon: UserCheck,
      accent: 'border-gold text-gold',
    },
    {
      id: 'regionalMef',
      title: 'Региональный МЭФ',
      subtitle: 'Взаимодействует с хокимиятом: паспорта районов, выдвижение чемпионов, маршрутизация B2G, меры области',
      tag: 'демо: Самаркандское подразделение МЭФ',
      Icon: ShieldCheck,
      accent: 'border-secondary text-secondary',
    },
    {
      id: 'mef',
      title: 'МЭФ',
      subtitle: 'Глобальная аналитика Платформы: 14 регионов, 885 инструментов, статус системы',
      tag: 'администратор министерства',
      Icon: Crown,
      accent: 'border-navy text-navy',
    },
    {
      id: 'agency',
      title: 'Ведомство',
      subtitle: 'Inbox обращений, мои меры поддержки с остатком лимитов, статус интеграций',
      tag: 'демо: Министерство сельского хозяйства',
      Icon: Building2,
      accent: 'border-success text-success',
    },
    {
      id: 'guest',
      title: 'Гость',
      subtitle: 'Осмотреться до входа. Общий каталог мер и карта без персонализации',
      tag: 'без авторизации',
      Icon: User,
      accent: 'border-ink-line text-ink-muted',
    },
  ];

  return (
    <section className="relative band-navy text-white overflow-hidden">
      <div className="absolute inset-0 pattern-grid opacity-40 pointer-events-none" />

      <div className="container-wide relative py-16 md:py-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.45 }}
          className="max-w-3xl mb-10"
        >
          <div className="flex items-center gap-2 mb-3">
            <LogIn className="h-4 w-4 text-gold-light" />
            <span className="text-xs uppercase tracking-[0.2em] text-gold-light font-medium">
              Пять кабинетов · одна Платформа
            </span>
          </div>
          <h2 className="font-serif text-3xl md:text-4xl font-semibold text-white leading-tight text-balance">
            Войдите в один из&nbsp;пяти кабинетов
          </h2>
          <p className="mt-3 text-white/75 text-lg max-w-2xl">
            Каждая роль видит свой интерфейс: предприниматель — меры для своего бизнеса, ведомство — обращения и свои программы, МЭФ — аналитику. Нажмите карточку — мы переключим роль и покажем кабинет.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-3">
          {roles.map((r, i) => {
            const active = r.id === currentRole;
            return (
              <motion.button
                key={r.id}
                onClick={() => chooseRole(r.id)}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.35, delay: i * 0.05 }}
                whileHover={{ y: -4 }}
                className={[
                  'group text-left relative rounded-xl p-4 transition-all',
                  'border backdrop-blur-sm',
                  active
                    ? 'bg-gold/20 border-gold shadow-lg'
                    : 'bg-white/5 border-white/15 hover:bg-white/10 hover:border-gold/40',
                ].join(' ')}
                aria-pressed={active}
              >
                {active && (
                  <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded text-[9px] uppercase tracking-wider font-bold bg-gold text-white">
                    активен
                  </span>
                )}

                <div className="h-11 w-11 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center mb-3 group-hover:bg-gold group-hover:border-gold transition-colors">
                  <r.Icon className="h-5 w-5 text-gold-light group-hover:text-white" />
                </div>

                <div className="font-serif text-[17px] text-white mb-1.5 leading-tight">{r.title}</div>
                <div className="text-[12.5px] text-white/70 leading-snug line-clamp-3 min-h-[54px]">{r.subtitle}</div>
                <div className="mt-3 pt-3 border-t border-white/10 text-[11px] text-gold-light/80 font-mono line-clamp-1">
                  {r.tag}
                </div>

                <div className="mt-3 flex items-center gap-1 text-[12px] text-gold-light font-medium">
                  Войти
                  <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                </div>
              </motion.button>
            );
          })}
        </div>

        <div className="mt-8 text-xs text-white/55 max-w-3xl">
          Переключение роли не требует реальной авторизации — это демо-режим. Данные каждого кабинета заполнены иллюстративными примерами. В продакшене будет OneID/MyID.
        </div>
      </div>
    </section>
  );
}
