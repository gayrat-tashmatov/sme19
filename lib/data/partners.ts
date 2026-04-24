export interface Partner {
  id: string;
  name: string;
  category: string;
  iconName: string;
  status: 'ready' | 'in-progress' | 'planned';
}

/** 12 key integrations to be displayed on the Partners grid. */
export const PARTNERS: Partner[] = [
  { id: 'oneid',      name: 'OneID',        category: 'auth',       iconName: 'Fingerprint', status: 'ready' },
  { id: 'soliq',      name: 'Soliq',        category: 'tax',        iconName: 'Receipt',     status: 'ready' },
  { id: 'justice',    name: 'Минюст',       category: 'registry',   iconName: 'Scale',       status: 'in-progress' },
  { id: 'customs',    name: 'Таможня',      category: 'foreign',    iconName: 'PackageCheck', status: 'in-progress' },
  { id: 'cadastre',   name: 'Кадастр',      category: 'land',       iconName: 'Map',         status: 'in-progress' },
  { id: 'davaktiv',   name: 'Давактив',     category: 'assets',     iconName: 'Warehouse',   status: 'planned' },
  { id: 'mygov',      name: 'my.gov.uz',    category: 'portal',     iconName: 'Globe',       status: 'in-progress' },
  { id: 'sw',         name: 'Single Window', category: 'export',    iconName: 'DoorOpen',    status: 'planned' },
  { id: 'cbu',        name: 'ЦБ РУз',       category: 'finance',    iconName: 'Landmark',    status: 'planned' },
  { id: 'itpark',     name: 'IT-парк',      category: 'it',         iconName: 'Cpu',         status: 'ready' },
  { id: 'stat',       name: 'Stat.uz',      category: 'stats',      iconName: 'BarChart3',   status: 'ready' },
  { id: 'oasis',      name: 'OASIS',        category: 'future',     iconName: 'Rocket',      status: 'planned' },
];
