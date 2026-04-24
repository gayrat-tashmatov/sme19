import type { Marketplace } from '@/lib/types';

/** 12 marketplaces for the E-commerce module. */
export const MARKETPLACES: Marketplace[] = [
  { id: 'uzum',      name: 'UZUM',       coverage: 'UZ',    category: 'marketplace', isPartner: true,  descKey: 'Крупнейшая площадка Узбекистана, 2M+ активных покупателей' },
  { id: 'robosell', name: 'Robosell',    coverage: 'UZ',    category: 'aggregator',  isPartner: true,  descKey: 'Агрегатор вывода МСБ на маркетплейсы — поддерживается Платформой' },
  { id: 'alif',     name: 'Alif Shop',   coverage: 'UZ',    category: 'marketplace', isPartner: false, descKey: 'Маркетплейс с встроенной рассрочкой 0%' },
  { id: 'olx',      name: 'OLX',         coverage: 'UZ',    category: 'marketplace', isPartner: false, descKey: 'Объявления C2C и малый B2B' },
  { id: 'uzex',     name: 'Uzex',        coverage: 'UZ',    category: 'B2B',         isPartner: true,  descKey: 'Узбекская товарно-сырьевая биржа, государственные закупки' },
  { id: 'yamarket', name: 'Yandex Market', coverage: 'CIS', category: 'marketplace', isPartner: false, descKey: 'Вход на рынок РФ и СНГ, 50M+ покупателей' },
  { id: 'wb',       name: 'Wildberries', coverage: 'CIS',   category: 'marketplace', isPartner: false, descKey: 'Крупнейший маркетплейс СНГ, поставщики из РУз принимаются' },
  { id: 'ozon',     name: 'Ozon',        coverage: 'CIS',   category: 'marketplace', isPartner: false, descKey: 'Российский маркетплейс с программой экспорт из РУз' },
  { id: 'amazon',   name: 'Amazon',      coverage: 'GLOBAL', category: 'marketplace', isPartner: false, descKey: 'Глобальный рынок — программа Amazon Global Selling' },
  { id: 'alibaba',  name: 'Alibaba',     coverage: 'GLOBAL', category: 'B2B',        isPartner: true,  descKey: 'B2B-платформа, меморандум сотрудничества с РУз' },
  { id: 'etsy',     name: 'Etsy',        coverage: 'GLOBAL', category: 'marketplace', isPartner: false, descKey: 'Handmade и традиционные товары — канал для ремесленников' },
  { id: 'ebay',     name: 'eBay',        coverage: 'GLOBAL', category: 'marketplace', isPartner: false, descKey: 'Глобальный C2C и малый B2B рынок' },
];

export const COVERAGE_LABELS = {
  UZ: 'Узбекистан',
  CIS: 'СНГ',
  GLOBAL: 'Мир',
};

export const CATEGORY_LABELS = {
  marketplace: 'Маркетплейс',
  aggregator:  'Агрегатор',
  B2B:         'B2B-платформа',
};

/** 10-item export checklist shown in module V. */
export const EXPORT_CHECKLIST = [
  { id: 'hs',    label: 'Код ТН ВЭД определён', critical: true },
  { id: 'orig',  label: 'Сертификат происхождения (CT-1, EUR.1 и др.)', critical: true },
  { id: 'san',   label: 'Санитарное заключение', critical: false },
  { id: 'phy',   label: 'Фитосанитарный сертификат', critical: false },
  { id: 'qual',  label: 'Сертификат соответствия качества', critical: true },
  { id: 'pack',  label: 'Экспортная упаковка и маркировка', critical: false },
  { id: 'logi',  label: 'Договор с логистическим оператором', critical: true },
  { id: 'cont',  label: 'Внешнеторговый контракт с иностранным покупателем', critical: true },
  { id: 'ban',   label: 'Банковская валютная проводка открыта', critical: false },
  { id: 'ins',   label: 'Страхование груза', critical: false },
];

/** Customs categories for the calculator. */
export const CUSTOMS_CATEGORIES = [
  { id: 'textile',   name: 'Текстиль и одежда', duty: 10, vat: 12, excise: 0 },
  { id: 'food',      name: 'Продовольствие',    duty: 5,  vat: 12, excise: 0 },
  { id: 'elec',      name: 'Электроника',       duty: 5,  vat: 12, excise: 0 },
  { id: 'auto',      name: 'Автомобили',        duty: 30, vat: 12, excise: 15 },
  { id: 'chem',      name: 'Химия и удобрения', duty: 5,  vat: 12, excise: 0 },
  { id: 'mach',      name: 'Оборудование',      duty: 0,  vat: 12, excise: 0 },
];
