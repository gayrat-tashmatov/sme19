/**
 * 15 demo services from the MIP catalog, representative of what remains
 * after filtering the 614 total down to the ~50-70 relevant to SMB.
 * Used in the B (registry) module as examples of what "одно окно"
 * aggregates from my.gov.uz.
 */
export interface MipService {
  id: string;
  title: string;
  agency: string;
  processingDays: number;
  isDigital: boolean;
  cost: string;
  category: 'reg' | 'tax' | 'license' | 'land' | 'cert' | 'finance';
}

export const MIP_SERVICES: MipService[] = [
  { id: 'mip-001', title: 'Регистрация субъекта предпринимательства', agency: 'Минюст',  processingDays: 1,  isDigital: true,  cost: 'Бесплатно',          category: 'reg' },
  { id: 'mip-042', title: 'Получение ИНН юридического лица',           agency: 'ГНК',     processingDays: 1,  isDigital: true,  cost: 'Бесплатно',          category: 'tax' },
  { id: 'mip-087', title: 'Регистрация кассового аппарата',            agency: 'ГНК',     processingDays: 3,  isDigital: true,  cost: '50 тыс. сум',        category: 'tax' },
  { id: 'mip-112', title: 'Лицензия на производство пищевых продуктов', agency: 'Минздрав', processingDays: 30, isDigital: false, cost: 'от 2 млн сум',     category: 'license' },
  { id: 'mip-134', title: 'Разрешение на внешнеэкономическую деятельность', agency: 'Таможня', processingDays: 5, isDigital: true, cost: 'Бесплатно',     category: 'license' },
  { id: 'mip-156', title: 'Кадастровая оценка земельного участка',     agency: 'Кадастр', processingDays: 14, isDigital: false, cost: 'от 500 тыс. сум',   category: 'land' },
  { id: 'mip-178', title: 'Перевод земель из одной категории в другую', agency: 'Кадастр', processingDays: 60, isDigital: false, cost: 'от 1 млн сум',      category: 'land' },
  { id: 'mip-203', title: 'Сертификат соответствия продукции',         agency: 'Узстандарт', processingDays: 15, isDigital: true, cost: 'от 800 тыс. сум', category: 'cert' },
  { id: 'mip-221', title: 'Санитарно-эпидемиологическое заключение',   agency: 'Санэпиднадзор', processingDays: 10, isDigital: false, cost: 'от 1.2 млн сум', category: 'cert' },
  { id: 'mip-248', title: 'Получение фитосанитарного сертификата',     agency: 'Инспекция растений', processingDays: 7, isDigital: true, cost: 'от 300 тыс. сум', category: 'cert' },
  { id: 'mip-267', title: 'Открытие расчётного счёта',                 agency: 'Банки',   processingDays: 1,  isDigital: true,  cost: 'Бесплатно',          category: 'finance' },
  { id: 'mip-289', title: 'Заявка на субсидию (упрощённая процедура)', agency: 'МЭФ',     processingDays: 20, isDigital: true,  cost: 'Бесплатно',          category: 'finance' },
  { id: 'mip-312', title: 'Лицензия на розничную торговлю алкоголем',  agency: 'Минфин',  processingDays: 30, isDigital: false, cost: 'от 5 млн сум',       category: 'license' },
  { id: 'mip-334', title: 'Декларирование товара на импорт',           agency: 'Таможня', processingDays: 1,  isDigital: true,  cost: 'от 200 тыс. сум',    category: 'tax' },
  { id: 'mip-398', title: 'Регистрация изменений в учредительных документах', agency: 'Минюст', processingDays: 3, isDigital: true, cost: '100 тыс. сум',  category: 'reg' },
];

export const MIP_CATEGORY_LABELS = {
  reg:     'Регистрация',
  tax:     'Налоги',
  license: 'Лицензии',
  land:    'Земля',
  cert:    'Сертификация',
  finance: 'Финансы',
};
