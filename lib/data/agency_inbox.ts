/**
 * Demo inbox для «Кабинета ведомства» · Минсельхоз.
 * Эти обращения приходят из модуля (а) B2G через автомаршрутизацию
 * классификатора: тема «сельское хозяйство / субсидии / орошение» →
 * кабинет Минсельхоза внутри Платформы.
 */

export type AgencyInquiryStatus = 'new' | 'in-progress' | 'awaiting' | 'resolved' | 'overdue';

export interface AgencyInquiry {
  id: string;
  theme: string;
  author: string;
  pinfl: string;
  region: string;
  arrivedAt: string;      // DD.MM
  slaHoursLeft: number;   // <=0 → overdue
  status: AgencyInquiryStatus;
  preview: string;
  routedFrom: 'b2g-form' | 'ai-assistant' | 'appeal';
  category: 'subsidy' | 'irrigation' | 'land' | 'export' | 'tech' | 'general';
}

export const MINAGRI_INBOX: AgencyInquiry[] = [
  {
    id: 'MoA-2026-04-3847',
    theme: 'Разъяснение по субсидии на лазерное выравнивание земли',
    author: 'Жасур Турдиев (ИП)',
    pinfl: '3 **** **** 1847',
    region: 'Кашкадарья, Касан',
    arrivedAt: '19.04',
    slaHoursLeft: 14,
    status: 'in-progress',
    preview: 'Уточните, учитывается ли в пороге площади 5 га земля в пользовании, но не в собственности. У меня оформлено 3 га, ещё 4 га в аренде от махалли…',
    routedFrom: 'b2g-form',
    category: 'subsidy',
  },
  {
    id: 'MoA-2026-04-3829',
    theme: 'Ремонт оросительной канавы К-14',
    author: 'Шерзод Норматов (ФХ)',
    pinfl: '4 **** **** 0293',
    region: 'Кашкадарья, Касан',
    arrivedAt: '19.04',
    slaHoursLeft: 56,
    status: 'new',
    preview: 'Прошу направить заявку в отдел водного хозяйства района — канава К-14 не пропускает воду на участок №72. Приложены 3 фото с геометкой…',
    routedFrom: 'b2g-form',
    category: 'irrigation',
  },
  {
    id: 'MoA-2026-04-3810',
    theme: 'Статус заявки на субсидию по тепличному хозяйству',
    author: 'ООО «Zarafshan Agro»',
    pinfl: '302 857 114',
    region: 'Самарканд',
    arrivedAt: '18.04',
    slaHoursLeft: -8,
    status: 'overdue',
    preview: 'Подавали заявку 22.03 на программу MoA-SUB-021. Статус не обновлялся 26 дней. Менеджер в районе не отвечает…',
    routedFrom: 'appeal',
    category: 'subsidy',
  },
  {
    id: 'MoA-2026-04-3801',
    theme: 'Требования к экспорту хлопкового волокна в Турцию',
    author: 'Абдулла Ахмедов (ИП)',
    pinfl: '3 **** **** 9014',
    region: 'Фергана',
    arrivedAt: '18.04',
    slaHoursLeft: 32,
    status: 'in-progress',
    preview: 'Какие фитосанитарные сертификаты требуются для экспорта партии 12 тонн в Турцию? Требуется ли предварительное согласование…',
    routedFrom: 'b2g-form',
    category: 'export',
  },
  {
    id: 'MoA-2026-04-3795',
    theme: 'Подключение к программе агрострахования',
    author: 'ФХ «Бобур-2010»',
    pinfl: '3 **** **** 5522',
    region: 'Андижан',
    arrivedAt: '17.04',
    slaHoursLeft: 24,
    status: 'awaiting',
    preview: 'Ожидаем от ведомства список страховых партнёров-участников программы 2026 года. Нужно до 01.05 определиться с страхованием урожая…',
    routedFrom: 'b2g-form',
    category: 'subsidy',
  },
  {
    id: 'MoA-2026-04-3781',
    theme: 'Земельный участок под теплицы',
    author: 'Бунёд Каримов (ИП)',
    pinfl: '3 **** **** 7290',
    region: 'Ташкентская обл.',
    arrivedAt: '17.04',
    slaHoursLeft: 40,
    status: 'new',
    preview: 'Интересует возможность выкупа земельного участка площадью 0.4 га из лотов Давактива. Подходит ли он под капельное орошение для томатов…',
    routedFrom: 'b2g-form',
    category: 'land',
  },
  {
    id: 'MoA-2026-04-3772',
    theme: 'Дронное опрыскивание · включение в перечень техники',
    author: 'Агрокластер «Oltin Vodiy»',
    pinfl: '305 991 407',
    region: 'Фергана',
    arrivedAt: '16.04',
    slaHoursLeft: 8,
    status: 'in-progress',
    preview: 'Предлагаем включить БПЛА DJI Agras T40 в перечень субсидируемой техники. Готовы предоставить отчёт о сравнительной эффективности…',
    routedFrom: 'appeal',
    category: 'tech',
  },
  {
    id: 'MoA-2026-04-3765',
    theme: 'Жалоба на задержку выплаты субсидии',
    author: 'ФХ «Усман-Бобо»',
    pinfl: '3 **** **** 0019',
    region: 'Хорезм',
    arrivedAt: '16.04',
    slaHoursLeft: -32,
    status: 'overdue',
    preview: 'Субсидия одобрена 12.02, прошло 64 дня, перечисления нет. Обращался в районный офис трижды. Прошу ускорить…',
    routedFrom: 'appeal',
    category: 'subsidy',
  },
  {
    id: 'MoA-2026-04-3758',
    theme: 'Документы для экспорта сухофруктов в ЕС',
    author: 'ООО «Samarkand Fruits»',
    pinfl: '301 450 882',
    region: 'Самарканд',
    arrivedAt: '15.04',
    slaHoursLeft: 48,
    status: 'awaiting',
    preview: 'Какой пакет документов требуется по регламенту EU 2019/1793 для органических сухофруктов? Нужна поддержка по HACCP-аудиту…',
    routedFrom: 'ai-assistant',
    category: 'export',
  },
  {
    id: 'MoA-2026-04-3731',
    theme: 'Полив капельным методом · вопрос о субсидии',
    author: 'Илхом Шоймардонов (ИП)',
    pinfl: '3 **** **** 3308',
    region: 'Джизак',
    arrivedAt: '14.04',
    slaHoursLeft: 0,
    status: 'resolved',
    preview: 'Спасибо за ответ. Вопрос закрыт, подам заявку по указанному регламенту.',
    routedFrom: 'b2g-form',
    category: 'subsidy',
  },
  {
    id: 'MoA-2026-04-3720',
    theme: 'Лицензия на производство кормов',
    author: 'ООО «Fergana Feed»',
    pinfl: '305 774 023',
    region: 'Фергана',
    arrivedAt: '14.04',
    slaHoursLeft: 0,
    status: 'resolved',
    preview: 'Получили ответ. Направили документы на лицензирование в указанный отдел.',
    routedFrom: 'b2g-form',
    category: 'general',
  },
  {
    id: 'MoA-2026-04-3711',
    theme: 'Компенсация процентной ставки по кредиту на трактор',
    author: 'Шавкат Ортиков (ИП)',
    pinfl: '3 **** **** 7712',
    region: 'Сурхандарья',
    arrivedAt: '13.04',
    slaHoursLeft: 72,
    status: 'new',
    preview: 'Купил трактор МТЗ-82 в лизинг у «O‘zagrolizing». Могу ли претендовать на компенсацию ставки в рамках программы AgroSubsidy-2025…',
    routedFrom: 'b2g-form',
    category: 'subsidy',
  },
];

/** Программы поддержки, которыми администрирует Минсельхоз (5 демо). */
export interface AgencyMeasure {
  id: string;
  title: string;
  type: 'subsidy' | 'loan' | 'benefit' | 'grant';
  yearLimitUzs: number;
  usedUzs: number;
  applications30d: number;
  approved30d: number;
  active: boolean;
}

export const MINAGRI_MEASURES: AgencyMeasure[] = [
  {
    id: 'MoA-SUB-007',
    title: 'Субсидия на лазерное выравнивание земли',
    type: 'subsidy',
    yearLimitUzs: 140_000_000_000,
    usedUzs: 89_600_000_000,
    applications30d: 412,
    approved30d: 287,
    active: true,
  },
  {
    id: 'MoA-SUB-021',
    title: 'Компенсация до 50% стоимости капельного орошения',
    type: 'subsidy',
    yearLimitUzs: 210_000_000_000,
    usedUzs: 94_500_000_000,
    applications30d: 298,
    approved30d: 194,
    active: true,
  },
  {
    id: 'MoA-LOAN-004',
    title: 'Льготный кредит на сельхозтехнику',
    type: 'loan',
    yearLimitUzs: 520_000_000_000,
    usedUzs: 367_000_000_000,
    applications30d: 84,
    approved30d: 41,
    active: true,
  },
  {
    id: 'MoA-SUB-013',
    title: 'Субсидия на строительство тепличных комплексов',
    type: 'subsidy',
    yearLimitUzs: 75_000_000_000,
    usedUzs: 62_400_000_000,
    applications30d: 57,
    approved30d: 22,
    active: true,
  },
  {
    id: 'MoA-GRN-002',
    title: 'Грант на внедрение агротехнологий (БПЛА, IoT)',
    type: 'grant',
    yearLimitUzs: 18_000_000_000,
    usedUzs: 4_100_000_000,
    applications30d: 26,
    approved30d: 9,
    active: true,
  },
];
