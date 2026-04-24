'use client';

import { useStore } from '@/lib/store';
import { GuestCabinet } from '@/components/cabinet/GuestCabinet';
import { EntrepreneurCabinet } from '@/components/cabinet/EntrepreneurCabinet';
import { RegionalMefCabinet } from '@/components/cabinet/RegionalMefCabinet';
import { MefCabinet } from '@/components/cabinet/MefCabinet';
import { AgencyCabinet } from '@/components/cabinet/AgencyCabinet';

export default function CabinetPage() {
  const role = useStore((s) => s.role);
  if (role === 'guest')        return <GuestCabinet />;
  if (role === 'entrepreneur') return <EntrepreneurCabinet />;
  if (role === 'regionalMef')  return <RegionalMefCabinet />;
  if (role === 'mef')          return <MefCabinet />;
  if (role === 'agency')       return <AgencyCabinet />;
  return <GuestCabinet />;
}
