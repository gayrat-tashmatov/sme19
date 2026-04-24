/**
 * Macroeconomic demo data — representative, requires verification against
 * stat.uz / cbu.uz before publishing externally.
 */

export const GDP_TIMELINE = [
  { year: 2020, gdp: 60,  export: 15 },
  { year: 2021, gdp: 69,  export: 16 },
  { year: 2022, gdp: 80,  export: 19 },
  { year: 2023, gdp: 90,  export: 24 },
  { year: 2024, gdp: 102, export: 27 },
  { year: 2025, gdp: 115, export: 30 },
];

export const SME_SHARE = [
  { year: 2020, share: 53.9 },
  { year: 2021, share: 54.8 },
  { year: 2022, share: 56.1 },
  { year: 2023, share: 57.4 },
  { year: 2024, share: 58.6 },
  { year: 2025, share: 60.2 },
];

/** 4 top-line KPIs for the macro tab */
export const MACRO_KPI = [
  { labelKey: 'macro.kpi.gdp',       value: '115',  unit: 'млрд $', delta: '+12.7%', positive: true },
  { labelKey: 'macro.kpi.inflation', value: '8.3',  unit: '%',      delta: '-1.4 п.п.', positive: true },
  { labelKey: 'macro.kpi.sme',       value: '60.2', unit: '%',      delta: '+1.6 п.п.', positive: true },
  { labelKey: 'macro.kpi.wage',      value: '5.8',  unit: 'млн сум', delta: '+18.4%', positive: true },
];

/** Industry distribution (% of GDP, 2025). Order matters for PieChart colouring. */
export const INDUSTRIES_BREAKDOWN = [
  { name: 'Торговля',       value: 28, color: '#8B6F3A' },
  { name: 'Промышленность', value: 24, color: '#1B2A3D' },
  { name: 'Сельхоз',        value: 15, color: '#B08D4C' },
  { name: 'Услуги',         value: 13, color: '#5B8DB8' },
  { name: 'Строительство',  value: 10, color: '#4CAF50' },
  { name: 'Транспорт',      value: 6,  color: '#5A6575' },
  { name: 'ИТ и связь',     value: 4,  color: '#E57373' },
];

/** YoY industry growth, 2025 */
export const INDUSTRY_GROWTH = [
  { name: 'ИТ и связь',     growth: 28.4 },
  { name: 'Торговля',       growth: 14.2 },
  { name: 'Строительство',  growth: 11.6 },
  { name: 'Промышленность', growth: 9.8 },
  { name: 'Услуги',         growth: 8.1 },
  { name: 'Сельхоз',        growth: 4.3 },
  { name: 'Транспорт',      growth: 6.7 },
];

/** Top-7 export destinations (2025, % of exports) */
export const TOP_EXPORT_COUNTRIES = [
  { country: 'Китай',      pct: 21.4, billion: 6.4 },
  { country: 'Россия',     pct: 18.6, billion: 5.6 },
  { country: 'Казахстан',  pct: 11.2, billion: 3.4 },
  { country: 'Турция',     pct: 8.9,  billion: 2.7 },
  { country: 'Кыргызстан', pct: 6.1,  billion: 1.8 },
  { country: 'Таджикистан',pct: 4.4,  billion: 1.3 },
  { country: 'Афганистан', pct: 3.2,  billion: 1.0 },
];

export const TRADE_BALANCE = {
  exports: 30,
  imports: 42,
  balance: -12,
  coverage: 71,
};

/** Commodity prices — weekly snapshot for the prices tab. */
export const COMMODITY_PRICES = [
  { name: 'Хлопок',   unit: '$/т',    price: 1820, change: +1.8 },
  { name: 'Золото',   unit: '$/oz',   price: 2945, change: +0.6 },
  { name: 'Газ',      unit: '$/тыс.м³', price: 268, change: -2.4 },
  { name: 'Пшеница',  unit: '$/т',    price: 245,  change: +0.9 },
  { name: 'Медь',     unit: '$/т',    price: 9380, change: +3.1 },
  { name: 'Нефть Brent', unit: '$/барр.', price: 78.4, change: -1.2 },
];

export const MACRO_LABELS = {
  'macro.kpi.gdp':       { ru: 'ВВП 2025',            en: 'GDP 2025' },
  'macro.kpi.inflation': { ru: 'Инфляция (YoY)',      en: 'Inflation (YoY)' },
  'macro.kpi.sme':       { ru: 'Доля МСБ в ВВП',       en: 'SME share of GDP' },
  'macro.kpi.wage':      { ru: 'Средняя зарплата',    en: 'Average salary' },
};
