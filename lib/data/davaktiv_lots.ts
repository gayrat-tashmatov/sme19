import type { Lot } from '@/lib/types';

/**
 * Demo Davaktiv lots — sample snapshot for prototype UI.
 * Production integration: realtime API from auksion.uz.
 */
export const LOTS: Lot[] = [
  {
    id: 'L-2026-0001', regionId: 'tashkent_c', type: 'Производственный цех',
    address: 'Яшнабадский р-н, ул. Паркент, 5', areaSqm: 450,
    priceMonthUzs: 12_000_000, status: 'available',
    contact: '+998 71 200-XX-XX',
  },
  {
    id: 'L-2026-0002', regionId: 'tashkent_o', type: 'Складское помещение',
    address: 'Зангиатинский р-н, с. Назарбек', areaSqm: 1200,
    priceMonthUzs: 18_500_000, status: 'available',
    contact: '+998 71 204-XX-XX',
  },
  {
    id: 'L-2026-0003', regionId: 'samarkand', type: 'Цех швейного производства',
    address: 'г. Самарканд, Иштыханский массив', areaSqm: 680,
    priceMonthUzs: 8_200_000, status: 'available',
    contact: '+998 66 233-XX-XX',
  },
  {
    id: 'L-2026-0004', regionId: 'ferghana', type: 'Производственная площадка',
    address: 'г. Фергана, промзона', areaSqm: 950,
    priceMonthUzs: 6_800_000, status: 'reserved',
    contact: '+998 73 244-XX-XX',
  },
  {
    id: 'L-2026-0005', regionId: 'andijon', type: 'Автокомпонентный цех',
    address: 'Мархаматский р-н, СЭЗ «Андижан»', areaSqm: 2100,
    priceMonthUzs: 14_000_000, status: 'available',
    contact: '+998 74 223-XX-XX',
  },
  {
    id: 'L-2026-0006', regionId: 'bukhara', type: 'Ремесленная мастерская',
    address: 'г. Бухара, ул. Мехнат', areaSqm: 180,
    priceMonthUzs: 2_100_000, status: 'available',
    contact: '+998 65 224-XX-XX',
  },
  {
    id: 'L-2026-0007', regionId: 'namangan', type: 'Цех пищевого производства',
    address: 'Чустский р-н, промзона', areaSqm: 540,
    priceMonthUzs: 4_900_000, status: 'leased',
    contact: '+998 69 223-XX-XX',
  },
];

export function getLotsByRegion(regionId: string) {
  return LOTS.filter((l) => l.regionId === regionId);
}
