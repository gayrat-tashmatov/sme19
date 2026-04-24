'use client';

import { notFound, useParams } from 'next/navigation';
import { ModuleHero } from '@/components/sections/ModuleHero';
import { ComingSoon } from '@/components/sections/ComingSoon';
import { A_Communications } from '@/components/modules/A_Communications';
import { B_Registry } from '@/components/modules/B_Registry';
import { V_Ecommerce } from '@/components/modules/V_Ecommerce';
import { GBusinessInfo } from '@/components/modules/G_BusinessInfo';
import { DGeoanalytics } from '@/components/modules/D_Geoanalytics';
import { EDigitalMaturity } from '@/components/modules/E_DigitalMaturity';
import { N_Counterparty } from '@/components/modules/N_Counterparty';
import { N_Pathways } from '@/components/modules/N_Pathways';
import { N_Procurement } from '@/components/modules/N_Procurement';
import { N_Learning } from '@/components/modules/N_Learning';
import { QChampions } from '@/components/modules/Q_Champions';
import { QRegProfile } from '@/components/modules/Q_RegProfile';
import { QBizRegistration } from '@/components/modules/Q_BizRegistration';
import { QReporting } from '@/components/modules/Q_Reporting';
import { QWorkflow } from '@/components/modules/Q_Workflow';
import { QInfrastructure } from '@/components/modules/Q_Infrastructure';
import { QNews } from '@/components/modules/Q_News';
import { Q_Closure } from '@/components/modules/Q_Closure';
import { N_Guide } from '@/components/modules/N_Guide';
import { N_Startup } from '@/components/modules/N_Startup';
import { N_Lifecycle } from '@/components/modules/N_Lifecycle';
import { N_Tax } from '@/components/modules/N_Tax';
import { N_HR } from '@/components/modules/N_HR';
import { N_Credit } from '@/components/modules/N_Credit';
import { N_Export } from '@/components/modules/N_Export';
import { N_Sales } from '@/components/modules/N_Sales';
import { N_IP } from '@/components/modules/N_IP';
import { getModuleBySlug } from '@/lib/data/modules';
import { useT } from '@/lib/i18n';
import { DeepLinkBanner } from '@/components/ui/DeepLinkBanner';

import { Suspense } from 'react';

export default function ModulePage() {
  const params = useParams<{ slug: string }>();
  const t = useT();
  const meta = getModuleBySlug(params.slug);

  if (!meta) return notFound();

  const Body = BODY[params.slug] ?? null;

  return (
    <>
      <ModuleHero
        letter={meta.letter ?? undefined}
        title={t(meta.titleKey)}
        subtitle={t(meta.descKey)}
        phase={meta.phase}
        priority={meta.priority}
      />
      {/* Sprint 10.3 — context-aware banner for deep-links */}
      <Suspense fallback={null}>
        <DeepLinkBanner slug={params.slug} />
      </Suspense>
      {Body ? (
        <Suspense fallback={null}>
          <Body />
        </Suspense>
      ) : (
        <ComingSoon
          title={t(meta.titleKey)}
          subtitle="Этот модуль входит в общую очередь — полноценная страница будет подготовлена в ходе 5."
          stage="Ход 5 · Очередь и кабинет"
          letter={meta.letter ?? undefined}
          backHref="/modules"
          backLabel="К каталогу модулей"
        />
      )}
    </>
  );
}

/** Wired: 6 priority + 4 new + 7 queue + 1 closure = 18 modules. */
const BODY: Record<string, () => JSX.Element> = {
  comms: A_Communications,
  registry: B_Registry,
  ecommerce: V_Ecommerce,
  info: GBusinessInfo,
  geo: DGeoanalytics,
  maturity: EDigitalMaturity,
  nCheck: N_Counterparty,
  nPath: N_Pathways,
  nProcure: N_Procurement,
  nLearn: N_Learning,
  qReg: QRegProfile,
  qBiz: QBizRegistration,
  qRep: QReporting,
  qWF: QWorkflow,
  qInf: QInfrastructure,
  qNews: QNews,
  qChamp: QChampions,
  qClose: Q_Closure,
  nGuide: N_Guide,
  nStartup: N_Startup,
  nLifecycle: N_Lifecycle,
  nTax: N_Tax,
  nHR: N_HR,
  nCredit: N_Credit,
  nExport: N_Export,
  nSales: N_Sales,
  nIP: N_IP,
};
