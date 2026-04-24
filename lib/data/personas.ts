/**
 * Demo personas for the «After authorisation» mode of module (б).
 * Each persona has profile attributes and a hand-picked subset of measures
 * that reflects what the eligibility filter would return for them.
 *
 * The IDs reference measures in `measures.ts` (financial M*, non-financial NF*).
 */

export interface Persona {
  id: 'abror' | 'jasur' | 'zulfiya' | 'timur';
  name: string;
  age: number;
  region: string;
  business: string;
  legalForm: string;
  industry: string;
  stage: 'starting' | 'operating' | 'growing' | 'exporting';
  employees: number;
  revenue?: string;
  /** Measure IDs from measures.ts that pass the eligibility filter for this persona. */
  matchedFinancial: string[];
  matchedNonFinancial: string[];
  /** Short narrative shown under the persona's profile summary. */
  story: string;
}

export const PERSONAS: Persona[] = [
  {
    id: 'abror',
    name: 'Аброр Каримов',
    age: 25,
    region: 'г. Ташкент · Яшнабадский р-н',
    business: 'Открывает первое кафе-пекарню',
    legalForm: 'ИП (планируется)',
    industry: 'Общепит',
    stage: 'starting',
    employees: 0,
    matchedFinancial:    ['M001', 'M005', 'M006'],
    matchedNonFinancial: ['NF001', 'NF002', 'NF003'],
    story: 'Молодой предприниматель, без опыта. Нуждается в стартовом капитале, обучении основам и сертификации HACCP для пищевого производства.',
  },
  {
    id: 'jasur',
    name: 'Жасур Турдиев',
    age: 45,
    region: 'Кашкадарьинская обл. · Касан',
    business: 'Действующее фермерское хозяйство, 120 га',
    legalForm: 'ФХ',
    industry: 'Сельское хозяйство',
    stage: 'operating',
    employees: 7,
    revenue: '~ 2.4 млрд сум/год',
    matchedFinancial:    ['M005', 'M008'],
    matchedNonFinancial: ['NF003', 'NF005'],
    story: 'Опытный фермер. Главные задачи — модернизация (лазерное выравнивание, орошение) и помощь в спорах с ведомствами.',
  },
  {
    id: 'zulfiya',
    name: 'Зульфия Рахматова',
    age: 32,
    region: 'Ферганская обл. · Маргилан',
    business: 'Beauty-салон, 3 сотрудника',
    legalForm: 'ИП',
    industry: 'Услуги',
    stage: 'growing',
    employees: 3,
    revenue: '~ 360 млн сум/год',
    matchedFinancial:    ['M002', 'M006', 'M015'],
    matchedNonFinancial: ['NF010', 'NF011', 'NF002'],
    story: 'Женщина-предприниматель в регионе. Ищет программы для женщин, маркетинг, и хочет внедрить онлайн-запись клиентов.',
  },
  {
    id: 'timur',
    name: 'Тимур Усманов',
    age: 28,
    region: 'г. Ташкент · резидент IT-парка',
    business: 'IT-стартап (SaaS для логистики)',
    legalForm: 'ООО',
    industry: 'IT и связь',
    stage: 'exporting',
    employees: 9,
    revenue: '~ 1.2 млрд сум/год',
    matchedFinancial:    ['M003', 'M007', 'M015'],
    matchedNonFinancial: ['NF004', 'NF006', 'NF008'],
    story: 'Готов выходить на международный рынок. Нуждается в R&D-грантах, менторстве и помощи с экспортной упаковкой / поиском партнёров.',
  },
];

export function getPersonaById(id: string): Persona | undefined {
  return PERSONAS.find((p) => p.id === id);
}
