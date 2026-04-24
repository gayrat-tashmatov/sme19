'use client';

/**
 * Sprint 10.3 — Deep-link banner.
 *
 * A module-aware banner that appears above the module body whenever the URL
 * carries a known deep-link parameter. The goal is to make navigation context
 * visible: if the user landed here from a quick-task chip or from Services/Start,
 * the module shows that it understands what the user came for.
 *
 * Supported deep-links:
 *   /modules/geo?mode=start          — simplified "choose a location" flow
 *   /modules/comms?tab=b2g           — open the B2G tab
 *   /modules/comms?tab=b2b           — open the B2B tab
 *   /modules/registry?ai=1           — AI navigator is active
 *
 * Unknown combinations render nothing. This keeps the banner strictly additive.
 */

import { useSearchParams } from 'next/navigation';
import { Sparkles, MapPin, MessagesSquare, Handshake, X, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/cn';

interface DeepLinkBannerProps {
  slug: string;
}

export function DeepLinkBanner({ slug }: DeepLinkBannerProps) {
  const searchParams = useSearchParams();
  const [dismissed, setDismissed] = useState(false);

  const spec = resolveBanner(slug, searchParams);
  if (!spec || dismissed) return null;

  const Icon = spec.icon;

  return (
    <div className="container-wide pt-4">
      <div
        className={cn(
          'relative flex flex-col md:flex-row md:items-center gap-4 rounded-xl border p-4 md:p-5',
          spec.tone === 'gold' && 'bg-gold-soft/80 border-gold/30',
          spec.tone === 'navy' && 'bg-navy-50 border-navy/20',
          spec.tone === 'success' && 'bg-success/10 border-success/30',
        )}
      >
        <div
          className={cn(
            'h-11 w-11 rounded-xl flex items-center justify-center shrink-0',
            spec.tone === 'gold' && 'bg-gold-gradient text-white',
            spec.tone === 'navy' && 'bg-navy text-white',
            spec.tone === 'success' && 'bg-success text-white',
          )}
        >
          <Icon className="h-5 w-5" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="text-[10px] uppercase tracking-wider font-bold text-ink-muted">
              Deep-link
            </span>
            <span
              className={cn(
                'text-[10px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded',
                spec.tone === 'gold' && 'bg-gold/15 text-gold-dark',
                spec.tone === 'navy' && 'bg-navy/10 text-navy',
                spec.tone === 'success' && 'bg-success/15 text-success',
              )}
            >
              {spec.eyebrow}
            </span>
          </div>
          <div className="font-serif text-lg md:text-xl font-semibold text-navy leading-snug">
            {spec.title}
          </div>
          <div className="text-[13px] text-ink-muted mt-1 leading-relaxed">{spec.body}</div>

          {spec.cta && (
            <div className="mt-3 flex flex-wrap gap-2">
              {spec.cta.map((c, i) => (
                <Link
                  key={i}
                  href={c.href}
                  className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg bg-bg-white border border-ink-line text-[12.5px] font-medium text-navy hover:border-gold/40"
                >
                  {c.label}
                  <ArrowRight className="h-3 w-3" />
                </Link>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={() => setDismissed(true)}
          className="absolute top-2 right-2 h-7 w-7 rounded-md text-ink-muted hover:text-ink hover:bg-bg-band flex items-center justify-center"
          aria-label="Закрыть"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}

// ─── Resolution ───────────────────────────────────────────────────────

interface BannerSpec {
  icon: typeof Sparkles;
  tone: 'gold' | 'navy' | 'success';
  eyebrow: string;
  title: string;
  body: string;
  cta?: { label: string; href: string }[];
}

function resolveBanner(slug: string, params: URLSearchParams): BannerSpec | null {
  // Geoanalytics — startup mode
  if (slug === 'geo' && params.get('mode') === 'start') {
    return {
      icon: MapPin,
      tone: 'gold',
      eyebrow: 'Режим · Выбор места для старта',
      title: 'Помогаем выбрать район под ваш бизнес',
      body: 'Фильтры упрощены: отрасль, бюджет аренды, наличие свободных лотов Давактив в радиусе 30 км. После выбора района мы подскажем зарегистрировать бизнес по этому адресу через qBiz.',
      cta: [
        { label: 'К регистрации бизнеса', href: '/modules/qBiz' },
        { label: 'Полная аналитика', href: '/modules/geo' },
      ],
    };
  }

  // Communications — B2G tab
  if (slug === 'comms' && params.get('tab') === 'b2g') {
    return {
      icon: MessagesSquare,
      tone: 'navy',
      eyebrow: 'Вкладка · B2G · обращения в ведомства',
      title: 'Единое окно B2G-обращений через E-Ijro',
      body: 'До интеграции с E-Ijro (требует PKM + 6–7 мес.) — ручная маршрутизация через админку МЭФ. Интерфейс уже работает: форма обращения, отслеживание статуса, уведомления.',
      cta: [{ label: 'Вкладка B2B-партнёры', href: '/modules/comms?tab=b2b' }],
    };
  }

  // Communications — B2B tab
  if (slug === 'comms' && params.get('tab') === 'b2b') {
    return {
      icon: Handshake,
      tone: 'success',
      eyebrow: 'Вкладка · B2B · поиск партнёров',
      title: 'Cooperation.uz встроена в Платформу',
      body: 'Интерфейс поиска партнёров, B2B-контрактов, совместных тендеров подтягивается через embed-widget. Авторизация через OneID — один раз.',
      cta: [{ label: 'Вкладка B2G-обращений', href: '/modules/comms?tab=b2g' }],
    };
  }

  // Registry — AI navigator
  if (slug === 'registry' && params.get('ai') === '1') {
    return {
      icon: Sparkles,
      tone: 'gold',
      eyebrow: 'AI-навигатор активен',
      title: 'Подбор мер поддержки под ваш бизнес',
      body: 'AI-ассистент проанализирует профиль компании (ИНН из OneID, Soliq, Минюст) и предложит топ-5 подходящих из 359+ программ с процентом совпадения.',
      cta: [{ label: 'Полный реестр · все 359 мер', href: '/modules/registry' }],
    };
  }

  return null;
}
