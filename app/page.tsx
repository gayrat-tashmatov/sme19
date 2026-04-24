'use client';

/**
 * Sprint 10.2 — Home page with content sections added.
 *
 * Section order:
 *   1. HeroHome V2 — two-mode hero (guest blur / authenticated preview)
 *   2. LifecycleDoors — 4 big doors "Start / Run / Grow / Close"
 *   3. PlatformInFigures — 6 KPIs + regional selector (★ new 10.2)
 *   4. 6 priority modules grid — dual-layer phase badges
 *   5. MeasuresFocus — focal block for Unified Measures Registry (★ new 10.2)
 *   6. 2 NEW priority modules (benchmark proposals)
 *   7. HowItWorks — 4 steps from entry to decision
 *   8. RoleShowcase — 3-column same-application-three-angles (★ new 10.2)
 *   9. 7 queue modules
 *  10. 2 NEW queue modules
 *  11. RoadmapTimeline — 4-horizon plan
 *  12. PartnersGrid
 *  13. FinalCTA
 */

import { Badge } from '@/components/ui/Badge';
import { HeroHome } from '@/components/sections/HeroHome';
import { LifecycleDoors } from '@/components/sections/LifecycleDoors';
import { PlatformInFigures } from '@/components/sections/PlatformInFigures';
import { MeasuresFocus } from '@/components/sections/MeasuresFocus';
import { RoleShowcase } from '@/components/sections/RoleShowcase';
import { ModuleCardGrid } from '@/components/sections/ModuleCardGrid';
import { HowItWorks } from '@/components/sections/HowItWorks';
import { RoadmapTimeline } from '@/components/sections/RoadmapTimeline';
import { PartnersGrid } from '@/components/sections/PartnersGrid';
import { FinalCTA } from '@/components/sections/FinalCTA';
import {
  PRIORITY_MODULES,
  NEW_PRIORITY_MODULES,
  QUEUE_MODULES,
  NEW_QUEUE_MODULES,
} from '@/lib/data/modules';
import { useT } from '@/lib/i18n';

export default function Home() {
  const t = useT();

  return (
    <>
      {/* 1. Hero V2 — two-mode with DashboardPreview */}
      <HeroHome />

      {/* 2. Lifecycle doors — 4 entry points by business stage */}
      <LifecycleDoors />

      {/* 3. ★ Platform in figures with regional selector */}
      <PlatformInFigures />

      {/* 4. 6 priority modules with dual-layer phase badges */}
      <section className="container-wide py-16 md:py-20 border-t border-ink-line">
        <div className="max-w-3xl mb-10 md:mb-12">
          <Badge variant="priority" className="mb-4">
            {t('home.priority.eyebrow')}
          </Badge>
          <h2 className="text-balance">{t('home.priority.title')}</h2>
          <p className="mt-3 text-lg text-pretty">{t('home.priority.subtitle')}</p>
        </div>
        <ModuleCardGrid modules={PRIORITY_MODULES} variant="priority" />
      </section>

      {/* 5. ★ Measures focus — deeper anchor for the Registry priority module */}
      <MeasuresFocus />

      {/* 6. 2 NEW priority modules (benchmark proposals) */}
      <section className="container-wide py-12 md:py-16 border-t border-ink-line">
        <div className="max-w-3xl mb-8">
          <Badge variant="new" className="mb-4">NEW · предложение из бенчмарков</Badge>
          <h2 className="text-balance">
            Два новых модуля — расширение после 01.07.2026
          </h2>
          <p className="mt-3 text-pretty text-ink-muted">
            Из международного опыта: проверка контрагентов (мсп.рф · Россия) и пошаговые гайды по
            видам бизнеса (business.gov.au · Австралия). Не входят в 6 приоритетных по УП-50 —
            разворачиваются во 2-й половине 2026 после фундамента.
          </p>
        </div>
        <ModuleCardGrid modules={NEW_PRIORITY_MODULES} variant="new-priority" columns={2} />
      </section>

      {/* 7. How it works */}
      <HowItWorks />

      {/* 8. ★ Role showcase — one application through three cabinets */}
      <RoleShowcase />

      {/* 9. Queue modules */}
      <section className="container-wide py-16 md:py-20 border-t border-ink-line">
        <div className="max-w-3xl mb-10 md:mb-12">
          <Badge variant="queue" className="mb-4">
            {t('home.queue.eyebrow')}
          </Badge>
          <h2 className="text-balance">{t('home.queue.title')}</h2>
          <p className="mt-3 text-lg text-pretty">{t('home.queue.subtitle')}</p>
        </div>
        <ModuleCardGrid modules={QUEUE_MODULES} variant="queue" />
      </section>

      {/* 10. 2 NEW queue modules */}
      <section className="container-wide py-12 md:py-16 border-t border-ink-line">
        <div className="max-w-3xl mb-8">
          <Badge variant="new" className="mb-4">NEW · предложение из бенчмарков</Badge>
          <h2 className="text-balance">Ещё два модуля — в общую очередь</h2>
          <p className="mt-3 text-pretty text-ink-muted">
            Государственные закупки для МСБ (мсп.рф, 223-ФЗ) и единая LMS по образцу SBA Learning
            Center (США). Развёртывание 2027–2028.
          </p>
        </div>
        <ModuleCardGrid modules={NEW_QUEUE_MODULES} variant="new-queue" columns={2} />
      </section>

      {/* 11. Roadmap */}
      <RoadmapTimeline />

      {/* 12. Partners */}
      <PartnersGrid />

      {/* 13. Final CTA */}
      <FinalCTA />
    </>
  );
}
