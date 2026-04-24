import type { Ministry } from '@/lib/types';

/** 8 integrated agencies shown in B2G tab of module A, Partners grid, etc. */
export const MINISTRIES: Ministry[] = [
  { id: 'soliq',         nameKey: 'ministry.soliq',        iconName: 'Receipt',      jurisdictionKey: 'jurisdiction.tax' },
  { id: 'justice',       nameKey: 'ministry.justice',      iconName: 'Scale',        jurisdictionKey: 'jurisdiction.justice' },
  { id: 'customs',       nameKey: 'ministry.customs',      iconName: 'PackageCheck', jurisdictionKey: 'jurisdiction.customs' },
  { id: 'mef',           nameKey: 'ministry.mef',          iconName: 'Landmark',     jurisdictionKey: 'jurisdiction.mef' },
  { id: 'itpark',        nameKey: 'ministry.itpark',       iconName: 'Cpu',          jurisdictionKey: 'jurisdiction.it' },
  { id: 'davaktiv',      nameKey: 'ministry.davaktiv',     iconName: 'Warehouse',    jurisdictionKey: 'jurisdiction.assets' },
  { id: 'cadastre',      nameKey: 'ministry.cadastre',     iconName: 'Map',          jurisdictionKey: 'jurisdiction.cadastre' },
  { id: 'antimonopoly',  nameKey: 'ministry.antimonopoly', iconName: 'ShieldAlert',  jurisdictionKey: 'jurisdiction.antimono' },
];

/** Display labels (built into the data file to keep i18n concentrated on UI). */
export const MINISTRY_LABELS: Record<string, Record<string, string>> = {
  'ministry.soliq':        { ru: 'Налоговый комитет', uz: 'Soliq qoʻmitasi', en: 'Tax Committee' },
  'ministry.justice':      { ru: 'Министерство юстиции', uz: 'Adliya vazirligi', en: 'Ministry of Justice' },
  'ministry.customs':      { ru: 'Таможенный комитет', uz: 'Bojxona qoʻmitasi', en: 'Customs Committee' },
  'ministry.mef':          { ru: 'МЭФ', uz: 'IMV', en: 'MEF' },
  'ministry.itpark':       { ru: 'IT-парк', uz: 'IT-park', en: 'IT-Park' },
  'ministry.davaktiv':     { ru: 'Давактив', uz: 'Davaktiv', en: 'Davaktiv' },
  'ministry.cadastre':     { ru: 'Кадастр', uz: 'Kadastr', en: 'Cadastre' },
  'ministry.antimonopoly': { ru: 'Антимонопольный комитет', uz: 'Monopoliyaga qarshi qoʻmita', en: 'Antimonopoly Committee' },
  'jurisdiction.tax':       { ru: 'Налоговые обращения', uz: 'Soliq murojaatlari', en: 'Tax applications' },
  'jurisdiction.justice':   { ru: 'Регистрация, лицензии', uz: 'Roʻyxatdan oʻtish, litsenziyalar', en: 'Registration, licensing' },
  'jurisdiction.customs':   { ru: 'Внешнеэкономическая деятельность', uz: 'Tashqi iqtisodiy faoliyat', en: 'External economic activity' },
  'jurisdiction.mef':       { ru: 'Финансовые меры', uz: 'Moliyaviy choralar', en: 'Financial measures' },
  'jurisdiction.it':        { ru: 'ИТ-резиденция, льготы', uz: 'IT-rezidentlik, imtiyozlar', en: 'IT residency, benefits' },
  'jurisdiction.assets':    { ru: 'Госактивы, аукционы', uz: 'Davlat aktivlari, auksionlar', en: 'State assets, auctions' },
  'jurisdiction.cadastre':  { ru: 'Земля, недвижимость', uz: 'Yer, koʻchmas mulk', en: 'Land, real estate' },
  'jurisdiction.antimono':  { ru: 'Конкуренция, жалобы', uz: 'Raqobat, shikoyatlar', en: 'Competition, complaints' },
};
