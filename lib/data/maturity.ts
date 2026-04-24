import type { MaturityDimension, MaturityQuestion, Course } from '@/lib/types';

/** 6 dimensions of digital maturity assessment. */
export const DIMENSIONS: MaturityDimension[] = [
  { key: 'processes', labelKey: 'maturity.dim.processes' },
  { key: 'people',    labelKey: 'maturity.dim.people' },
  { key: 'data',      labelKey: 'maturity.dim.data' },
  { key: 'tech',      labelKey: 'maturity.dim.tech' },
  { key: 'security',  labelKey: 'maturity.dim.security' },
  { key: 'customer',  labelKey: 'maturity.dim.customer' },
];

export const DIMENSION_LABELS: Record<string, { ru: string; uz: string; en: string }> = {
  'maturity.dim.processes': { ru: 'Процессы',        uz: 'Jarayonlar',     en: 'Processes' },
  'maturity.dim.people':    { ru: 'Люди и навыки',    uz: 'Odamlar va koʻnikmalar', en: 'People & Skills' },
  'maturity.dim.data':      { ru: 'Данные',           uz: 'Maʼlumotlar',    en: 'Data' },
  'maturity.dim.tech':      { ru: 'Технологии',       uz: 'Texnologiyalar', en: 'Technology' },
  'maturity.dim.security':  { ru: 'Безопасность',    uz: 'Xavfsizlik',     en: 'Security' },
  'maturity.dim.customer':  { ru: 'Клиентоориентированность', uz: 'Mijozga yoʻnaltirilganlik', en: 'Customer-centricity' },
};

/** 15 questions — 2-3 per dimension. */
export const QUESTIONS: MaturityQuestion[] = [
  { id: 'q1',  dimension: 'processes', textKey: 'mat.q.q1',  type: 'scale' },
  { id: 'q2',  dimension: 'processes', textKey: 'mat.q.q2',  type: 'scale' },
  { id: 'q3',  dimension: 'processes', textKey: 'mat.q.q3',  type: 'scale' },
  { id: 'q4',  dimension: 'people',    textKey: 'mat.q.q4',  type: 'scale' },
  { id: 'q5',  dimension: 'people',    textKey: 'mat.q.q5',  type: 'scale' },
  { id: 'q6',  dimension: 'data',      textKey: 'mat.q.q6',  type: 'scale' },
  { id: 'q7',  dimension: 'data',      textKey: 'mat.q.q7',  type: 'scale' },
  { id: 'q8',  dimension: 'data',      textKey: 'mat.q.q8',  type: 'scale' },
  { id: 'q9',  dimension: 'tech',      textKey: 'mat.q.q9',  type: 'scale' },
  { id: 'q10', dimension: 'tech',      textKey: 'mat.q.q10', type: 'scale' },
  { id: 'q11', dimension: 'security',  textKey: 'mat.q.q11', type: 'scale' },
  { id: 'q12', dimension: 'security',  textKey: 'mat.q.q12', type: 'scale' },
  { id: 'q13', dimension: 'customer',  textKey: 'mat.q.q13', type: 'scale' },
  { id: 'q14', dimension: 'customer',  textKey: 'mat.q.q14', type: 'scale' },
  { id: 'q15', dimension: 'customer',  textKey: 'mat.q.q15', type: 'scale' },
];

export const QUESTION_TEXT: Record<string, string> = {
  'mat.q.q1':  'Процессы документируются и регулярно пересматриваются',
  'mat.q.q2':  'Ключевые задачи автоматизированы (без Excel и бумаги)',
  'mat.q.q3':  'Измеряется время выполнения основных бизнес-процессов',
  'mat.q.q4':  'Сотрудники имеют доступ к программам повышения квалификации',
  'mat.q.q5':  'Есть ответственный за цифровую трансформацию',
  'mat.q.q6':  'Данные о продажах и клиентах хранятся централизованно',
  'mat.q.q7':  'Используется BI / аналитика для принятия решений',
  'mat.q.q8':  'Отчётность формируется автоматически',
  'mat.q.q9':  'Используется облачная инфраструктура / SaaS',
  'mat.q.q10': 'Интеграция с госсервисами (Soliq, Кадастр) настроена',
  'mat.q.q11': 'Проводится резервное копирование и аудит доступа',
  'mat.q.q12': 'Есть политика обработки персональных данных',
  'mat.q.q13': 'Онлайн-канал продаж или присутствие на маркетплейсе',
  'mat.q.q14': 'Собирается обратная связь от клиентов',
  'mat.q.q15': 'Поддержка клиентов через несколько каналов',
};

/** Catalog of surveys — 4 specialised assessments for different aspects of business. */
export const SURVEYS = [
  {
    id: 's-digital',
    type: 'digital' as const,
    title_ru: 'Цифровая зрелость',
    desc_ru: '15 вопросов по 6 измерениям: процессы, люди, данные, технологии, безопасность, клиенты. Референс: EU Open DMAT.',
    iconName: 'Cpu',
    duration: '~10 мин',
    questions: 15,
    color: '#1B2A3D',
    reference: 'EU Digital Maturity Assessment',
  },
  {
    id: 's-finlit',
    type: 'finlit' as const,
    title_ru: 'Финансовая грамотность',
    desc_ru: '10 вопросов по методике OECD/INFE MSME Toolkit. Измеряет знания, поведение и отношение к финансам. Международный стандарт.',
    iconName: 'Coins',
    duration: '~5 мин',
    questions: 10,
    color: '#8B6F3A',
    reference: 'OECD/INFE 2022 Toolkit',
  },
  {
    id: 's-export',
    type: 'export' as const,
    title_ru: 'Экспортная готовность',
    desc_ru: '10 вопросов про готовность выходить на зарубежные рынки: продукт, сертификаты, логистика, финансы, маркетинг.',
    iconName: 'Plane',
    duration: '~5 мин',
    questions: 10,
    color: '#4CAF50',
    reference: 'Enterprise Singapore Export Readiness',
  },
  {
    id: 's-finance',
    type: 'finance' as const,
    title_ru: 'Готовность к финансированию',
    desc_ru: '8 вопросов: как банк или инвестор увидит ваш бизнес. Учёт, отчётность, залог, кредитная дисциплина.',
    iconName: 'Briefcase',
    duration: '~4 мин',
    questions: 8,
    color: '#5B8DB8',
    reference: 'BDC Canada · Financial Knowledge Quiz',
  },
  {
    id: 's-legal',
    type: 'legal' as const,
    title_ru: 'Правовая грамотность',
    desc_ru: '10 вопросов по трудовому, договорному и корпоративному праву Узбекистана. Ориентир: правовой минимум для руководителя МСБ.',
    iconName: 'Scale',
    duration: '~5 мин',
    questions: 10,
    color: '#B08D4C',
    reference: 'Минюст + Адвокатская палата · правовой минимум МСБ',
  },
  {
    id: 's-tax',
    type: 'tax' as const,
    title_ru: 'Налоговая грамотность',
    desc_ru: '10 вопросов по Налоговому кодексу в части МСБ: режимы, НДС, отчётность, льготы, рейтинг устойчивости.',
    iconName: 'Receipt',
    duration: '~5 мин',
    questions: 10,
    color: '#C58E4A',
    reference: 'Институт налоговой и бюджетной политики',
  },
];

/** Levels: Bronze < 50 | Silver 50-69 | Gold 70-84 | Platinum 85+ */
export function getLevel(score: number): { key: 'bronze'|'silver'|'gold'|'platinum'; label: string; color: string } {
  if (score >= 85) return { key: 'platinum', label: 'Platinum', color: '#E5E4E2' };
  if (score >= 70) return { key: 'gold',     label: 'Gold',     color: '#8B6F3A' };
  if (score >= 50) return { key: 'silver',   label: 'Silver',   color: '#A8A8A8' };
  return              { key: 'bronze',   label: 'Bronze',   color: '#B26B35' };
}

/** Demo recommendations linked to concrete measures. */
export const RECOMMENDATIONS = [
  {
    dimension: 'tech' as const,
    title: 'Переход на облачную инфраструктуру',
    desc: 'Перевод учётной системы в SaaS сократит IT-издержки на 30–40%.',
    linkedMeasureId: 'M015',
    priority: 'high' as const,
  },
  {
    dimension: 'customer' as const,
    title: 'Выход на онлайн-маркетплейс',
    desc: 'Добавит канал продаж с охватом до 5× вашей нынешней аудитории.',
    linkedMeasureId: 'M014',
    priority: 'high' as const,
  },
  {
    dimension: 'data' as const,
    title: 'Внедрение CRM',
    desc: 'Централизация клиентских данных повысит конверсию повторных продаж.',
    linkedMeasureId: 'M015',
    priority: 'medium' as const,
  },
  {
    dimension: 'security' as const,
    title: 'Политика ИБ и резервное копирование',
    desc: 'Обязательный минимум перед внедрением облачных сервисов.',
    linkedMeasureId: 'M012',
    priority: 'medium' as const,
  },
  {
    dimension: 'people' as const,
    title: 'Программа обучения персонала',
    desc: 'Субсидия покроет до 70% расходов на обучение сотрудников.',
    linkedMeasureId: 'M012',
    priority: 'medium' as const,
  },
];

/** 6 recommended courses (no real provider names per project rules). */
export const COURSES: Course[] = [
  { id: 'c1', titleKey: 'course.process-automation', duration: '6 нед.',  level: 'basic',        dimension: 'processes' },
  { id: 'c2', titleKey: 'course.digital-leadership', duration: '4 нед.',  level: 'intermediate', dimension: 'people' },
  { id: 'c3', titleKey: 'course.data-bi',            duration: '8 нед.',  level: 'intermediate', dimension: 'data' },
  { id: 'c4', titleKey: 'course.cloud-migration',    duration: '5 нед.',  level: 'advanced',     dimension: 'tech' },
  { id: 'c5', titleKey: 'course.cybersecurity-sme',  duration: '3 нед.',  level: 'basic',        dimension: 'security' },
  { id: 'c6', titleKey: 'course.ecommerce-launch',   duration: '6 нед.',  level: 'intermediate', dimension: 'customer' },
];

export const COURSE_LABELS: Record<string, string> = {
  'course.process-automation': 'Автоматизация бизнес-процессов',
  'course.digital-leadership': 'Цифровое лидерство для руководителей',
  'course.data-bi':            'Данные и BI-аналитика для МСБ',
  'course.cloud-migration':    'Переход в облако для производственного бизнеса',
  'course.cybersecurity-sme':  'Кибербезопасность малого бизнеса',
  'course.ecommerce-launch':   'Запуск онлайн-продаж и e-commerce',
};

// ════════════════════════════════════════════════════════════════════
// Additional assessments (OECD/INFE, Export Readiness, Finance Readiness)
// ════════════════════════════════════════════════════════════════════

export interface AssessmentQuestion {
  id: string;
  text: string;
  options: { label: string; score: number }[];
  /** For OECD — the dimension: knowledge / behaviour / attitude */
  dim?: string;
}

/** 10 questions · OECD/INFE MSME Toolkit methodology */
export const FINLIT_QUESTIONS: AssessmentQuestion[] = [
  {
    id: 'fl-1',
    text: 'Если положить 100 тыс сум на депозит под 2% годовых, сколько будет на счёте через 5 лет (без доп. взносов)?',
    dim: 'knowledge',
    options: [
      { label: 'Меньше 110 тыс', score: 0 },
      { label: 'Ровно 110 тыс', score: 0 },
      { label: 'Больше 110 тыс (сложный процент)', score: 3 },
      { label: 'Не знаю', score: 0 },
    ],
  },
  {
    id: 'fl-2',
    text: 'Если инфляция 8%, а ставка по депозиту 5% — что произойдёт с вашими деньгами в реальном выражении?',
    dim: 'knowledge',
    options: [
      { label: 'Вырастут', score: 0 },
      { label: 'Не изменятся', score: 0 },
      { label: 'Уменьшатся', score: 3 },
      { label: 'Не знаю', score: 0 },
    ],
  },
  {
    id: 'fl-3',
    text: 'Разнообразие вложений (акции + облигации + депозит) снижает риск потерь. Это верно?',
    dim: 'knowledge',
    options: [
      { label: 'Верно', score: 3 },
      { label: 'Неверно', score: 0 },
      { label: 'Не знаю', score: 0 },
    ],
  },
  {
    id: 'fl-4',
    text: 'Как часто вы разделяете личные и бизнес-финансы?',
    dim: 'behaviour',
    options: [
      { label: 'Отдельные счета и бюджеты', score: 3 },
      { label: 'Общий счёт, веду учёт', score: 2 },
      { label: 'Не разделяю', score: 0 },
    ],
  },
  {
    id: 'fl-5',
    text: 'Перед крупной покупкой для бизнеса сравниваете ли вы предложения от нескольких поставщиков/банков?',
    dim: 'behaviour',
    options: [
      { label: 'Всегда сравниваю 3+ варианта', score: 3 },
      { label: 'Иногда сравниваю', score: 1 },
      { label: 'Обычно беру первый', score: 0 },
    ],
  },
  {
    id: 'fl-6',
    text: 'Ведёте ли вы регулярно бюджет / финансовый план бизнеса?',
    dim: 'behaviour',
    options: [
      { label: 'Ежемесячный детальный бюджет', score: 3 },
      { label: 'Квартальный укрупнённый', score: 2 },
      { label: 'Не веду', score: 0 },
    ],
  },
  {
    id: 'fl-7',
    text: 'Оплачиваете ли вы все счета в срок?',
    dim: 'behaviour',
    options: [
      { label: 'Всегда в срок', score: 3 },
      { label: 'Иногда опаздываю', score: 1 },
      { label: 'Часто плачу штрафы', score: 0 },
    ],
  },
  {
    id: 'fl-8',
    text: 'Если бизнес завтра потеряет основного клиента, на сколько месяцев хватит резерва?',
    dim: 'attitude',
    options: [
      { label: '6+ месяцев', score: 3 },
      { label: '3–6 месяцев', score: 2 },
      { label: '1–3 месяца', score: 1 },
      { label: 'Меньше месяца', score: 0 },
    ],
  },
  {
    id: 'fl-9',
    text: 'Какое ваше отношение к долгосрочному планированию (3+ года)?',
    dim: 'attitude',
    options: [
      { label: 'Есть письменный 3-летний план', score: 3 },
      { label: 'Есть общие ориентиры', score: 1 },
      { label: 'Планирую «по ходу»', score: 0 },
    ],
  },
  {
    id: 'fl-10',
    text: 'Знакомы ли вы с предложениями Банка развития бизнеса и Госфонда МСБ?',
    dim: 'knowledge',
    options: [
      { label: 'Использовал какие-то из них', score: 3 },
      { label: 'Слышал, но не изучал', score: 1 },
      { label: 'Не слышал', score: 0 },
    ],
  },
];

/** 10 questions · Export readiness */
export const EXPORT_QUESTIONS: AssessmentQuestion[] = [
  { id: 'ex-1',  text: 'Есть ли у вас стабильное производство с запасом мощности 30%+ для экспорта?',
    options: [{ label: 'Да, полностью готовы', score: 3 }, { label: 'Частично', score: 1 }, { label: 'Нет', score: 0 }] },
  { id: 'ex-2',  text: 'Есть ли у вашей продукции сертификаты для целевого рынка (ЕС, СНГ, США)?',
    options: [{ label: 'Все необходимые', score: 3 }, { label: 'Частично', score: 1 }, { label: 'Нет', score: 0 }] },
  { id: 'ex-3',  text: 'Есть ли каталог продукции на английском языке?',
    options: [{ label: 'Да, полный', score: 3 }, { label: 'Базовый', score: 1 }, { label: 'Нет', score: 0 }] },
  { id: 'ex-4',  text: 'Понимаете ли вы логистику доставки в целевую страну?',
    options: [{ label: 'Есть проверенный партнёр', score: 3 }, { label: 'В общих чертах', score: 1 }, { label: 'Нет', score: 0 }] },
  { id: 'ex-5',  text: 'Есть ли валютный счёт и возможность принимать платежи в USD/EUR?',
    options: [{ label: 'Да, работает', score: 3 }, { label: 'Можно открыть', score: 1 }, { label: 'Нет', score: 0 }] },
  { id: 'ex-6',  text: 'Изучили ли вы таможенные требования целевой страны?',
    options: [{ label: 'Да, детально', score: 3 }, { label: 'Поверхностно', score: 1 }, { label: 'Нет', score: 0 }] },
  { id: 'ex-7',  text: 'Есть ли конкурентное преимущество на внешнем рынке (цена, качество, уникальность)?',
    options: [{ label: 'Явное преимущество', score: 3 }, { label: 'Скорее паритет', score: 1 }, { label: 'Сложно оценить', score: 0 }] },
  { id: 'ex-8',  text: 'Есть ли опыт участия в международных выставках или B2B-встречах?',
    options: [{ label: 'Регулярно участвуем', score: 3 }, { label: 'Был 1–2 раза', score: 1 }, { label: 'Нет опыта', score: 0 }] },
  { id: 'ex-9',  text: 'Готовы ли вы адаптировать продукт под требования целевого рынка (упаковка, состав, инструкции)?',
    options: [{ label: 'Уже адаптирован', score: 3 }, { label: 'Частично', score: 1 }, { label: 'Нет', score: 0 }] },
  { id: 'ex-10', text: 'Есть ли финансовая подушка на 6–12 месяцев продвижения за рубежом без быстрой окупаемости?',
    options: [{ label: 'Да', score: 3 }, { label: 'На 3–6 мес', score: 1 }, { label: 'Нет', score: 0 }] },
];

/** 8 questions · Finance readiness */
export const FINANCE_READY_QUESTIONS: AssessmentQuestion[] = [
  { id: 'fr-1', text: 'Ведётся ли у вас бухгалтерский учёт по стандартам (1С или эквивалент)?',
    options: [{ label: 'Полностью ведётся', score: 3 }, { label: 'Частично', score: 1 }, { label: 'Только «для налоговой»', score: 0 }] },
  { id: 'fr-2', text: 'Есть ли финансовая отчётность за последние 2 года (баланс, P&L, cash flow)?',
    options: [{ label: 'Полный комплект', score: 3 }, { label: 'Только часть', score: 1 }, { label: 'Нет', score: 0 }] },
  { id: 'fr-3', text: 'Есть ли у вас активы, которые можно заложить (недвижимость, оборудование)?',
    options: [{ label: 'Да, в собственности', score: 3 }, { label: 'Есть, но не оформлены', score: 1 }, { label: 'Нет', score: 0 }] },
  { id: 'fr-4', text: 'Есть ли положительная кредитная история?',
    options: [{ label: 'Да, есть успешно погашенные', score: 3 }, { label: 'Нет истории', score: 1 }, { label: 'Были просрочки', score: 0 }] },
  { id: 'fr-5', text: 'Есть ли налоговая задолженность?',
    options: [{ label: 'Нет, всё чисто', score: 3 }, { label: 'Небольшая, в рамках графика', score: 1 }, { label: 'Есть просроченная', score: 0 }] },
  { id: 'fr-6', text: 'Есть ли письменный бизнес-план с финансовой моделью?',
    options: [{ label: 'Детальный, с прогнозом 24+ мес', score: 3 }, { label: 'Краткий', score: 1 }, { label: 'Нет', score: 0 }] },
  { id: 'fr-7', text: 'Стабильная ли у вас выручка последние 12 месяцев?',
    options: [{ label: 'Стабильная или растёт', score: 3 }, { label: 'Колеблется', score: 1 }, { label: 'Падает', score: 0 }] },
  { id: 'fr-8', text: 'Понимаете ли вы, сколько и зачем вам нужно финансирование?',
    options: [{ label: 'Точная сумма и цель', score: 3 }, { label: 'Приблизительно', score: 1 }, { label: 'Не определились', score: 0 }] },
];

export function getFinlitLevel(scorePct: number): { label: string; color: string; verdict: string } {
  if (scorePct >= 75) return { label: 'Высокий', color: '#4CAF50', verdict: 'Отличная финансовая грамотность. Готовы к сложным финансовым инструментам.' };
  if (scorePct >= 50) return { label: 'Средний', color: '#8B6F3A', verdict: 'Базовый уровень в норме. Есть зоны роста — рекомендуем курс ЦПП.' };
  return               { label: 'Базовый', color: '#E57373', verdict: 'Рекомендуем начать с курса финансовой грамотности (бесплатно, ЦПП).' };
}

export function getExportLevel(scorePct: number): { label: string; color: string; verdict: string } {
  if (scorePct >= 75) return { label: 'Export-Ready', color: '#4CAF50', verdict: 'Готовы к экспорту. Подавайте заявку в Enterprise Uzbekistan.' };
  if (scorePct >= 50) return { label: 'Ready to Start', color: '#8B6F3A', verdict: 'Можно начинать в пилотном режиме. Подтяните 2–3 слабых блока.' };
  return               { label: 'Novice', color: '#E57373', verdict: 'Фокус на внутреннем рынке. Параллельно развивайте экспортные компетенции.' };
}

export function getFinanceLevel(scorePct: number): { label: string; color: string; verdict: string } {
  if (scorePct >= 75) return { label: 'Банк скажет ДА', color: '#4CAF50', verdict: 'Хорошие шансы на льготный кредит или инвестиции. Подавайте заявку.' };
  if (scorePct >= 50) return { label: 'Вероятно',     color: '#8B6F3A', verdict: 'Нужно подтянуть отчётность и кредитную историю. Потенциал хороший.' };
  return               { label: 'Нужна подготовка', color: '#E57373', verdict: 'Сначала приведите в порядок учёт и отчётность. Это базовое требование.' };
}

// ═══════════════════════════════════════════════════════════════════
// Sprint 4 · Legal literacy questions
// ═══════════════════════════════════════════════════════════════════
export const LEGAL_QUESTIONS: AssessmentQuestion[] = [
  { id: 'L01', dim: 'legal', text: 'Какой документ оформляется при приёме сотрудника на работу?',
    options: [{ label: 'Трудовой договор и приказ', score: 3 }, { label: 'Устное соглашение', score: 0 }, { label: 'Только запись в табеле', score: 1 }] },
  { id: 'L02', dim: 'legal', text: 'Максимальная продолжительность рабочей недели по Трудовому кодексу РУз?',
    options: [{ label: '40 часов', score: 3 }, { label: '48 часов', score: 0 }, { label: 'Не знаю', score: 0 }] },
  { id: 'L03', dim: 'legal', text: 'Договор с контрагентом подписан только с вашей стороны. Когда он вступает в силу?',
    options: [{ label: 'После подписи обеими сторонами', score: 3 }, { label: 'После первой оплаты', score: 1 }, { label: 'После моей подписи', score: 0 }] },
  { id: 'L04', dim: 'legal', text: 'Что такое ПКМ?',
    options: [{ label: 'Постановление Кабинета Министров', score: 3 }, { label: 'Президентский контрольный механизм', score: 0 }, { label: 'Не знаю', score: 0 }] },
  { id: 'L05', dim: 'legal', text: 'Если контрагент не заплатил — с чего начать?',
    options: [{ label: 'Письменная претензия, потом суд', score: 3 }, { label: 'Сразу в суд', score: 1 }, { label: 'Звонить и требовать', score: 0 }] },
  { id: 'L06', dim: 'legal', text: 'Обязательна ли электронная цифровая подпись (e-imzo) для ООО?',
    options: [{ label: 'Да, для взаимодействия с госорганами', score: 3 }, { label: 'Нет, по желанию', score: 0 }, { label: 'Не знаю', score: 0 }] },
  { id: 'L07', dim: 'legal', text: 'Срок хранения первичной бухгалтерской документации?',
    options: [{ label: 'Не менее 5 лет', score: 3 }, { label: '1 год', score: 0 }, { label: '3 года', score: 1 }] },
  { id: 'L08', dim: 'legal', text: 'Что делать при получении претензии от клиента?',
    options: [{ label: 'Ответить в срок 30 дней письменно', score: 3 }, { label: 'Проигнорировать, если не согласен', score: 0 }, { label: 'Ответить по телефону', score: 1 }] },
  { id: 'L09', dim: 'legal', text: 'Кто несёт ответственность за нарушения сотрудника на рабочем месте?',
    options: [{ label: 'Работодатель — с правом регресса к сотруднику', score: 3 }, { label: 'Только сотрудник', score: 0 }, { label: 'Зависит от ситуации', score: 2 }] },
  { id: 'L10', dim: 'legal', text: 'Знакомы ли вы с Законом «О защите прав потребителей»?',
    options: [{ label: 'Да, применяю в работе', score: 3 }, { label: 'Слышал, не читал', score: 1 }, { label: 'Нет', score: 0 }] },
];

export function getLegalLevel(scorePct: number): { label: string; color: string; verdict: string } {
  if (scorePct >= 75) return { label: 'Уверенный',   color: '#4CAF50', verdict: 'Хороший правовой уровень. Можете самостоятельно готовить договоры и претензии.' };
  if (scorePct >= 50) return { label: 'Средний',     color: '#8B6F3A', verdict: 'Базу знаете, но при сложных кейсах лучше консультация юриста.' };
  return               { label: 'Нужна подготовка', color: '#E57373', verdict: 'Рекомендуем курс «Правовой минимум руководителя МСБ» — бесплатно, Адвокатская палата.' };
}

// ═══════════════════════════════════════════════════════════════════
// Sprint 4 · Tax literacy questions
// ═══════════════════════════════════════════════════════════════════
export const TAX_QUESTIONS: AssessmentQuestion[] = [
  { id: 'T01', dim: 'tax', text: 'Какие режимы налогообложения доступны для ООО в Узбекистане?',
    options: [{ label: 'Общий и упрощённый (налог с оборота)', score: 3 }, { label: 'Только общий', score: 1 }, { label: 'Не знаю', score: 0 }] },
  { id: 'T02', dim: 'tax', text: 'Порог оборота для применения налога с оборота?',
    options: [{ label: 'до 10 млрд сум в год', score: 3 }, { label: 'до 1 млрд сум', score: 1 }, { label: 'Нет порога', score: 0 }] },
  { id: 'T03', dim: 'tax', text: 'В какой срок нужно сдавать НДС-отчётность?',
    options: [{ label: 'Ежемесячно, до 20 числа', score: 3 }, { label: 'Ежеквартально', score: 1 }, { label: 'Раз в год', score: 0 }] },
  { id: 'T04', dim: 'tax', text: 'Что такое «Рейтинг устойчивости субъектов предпринимательства»?',
    options: [{ label: 'Категория AAA–D от Налогового комитета', score: 3 }, { label: 'Внутренний рейтинг банка', score: 0 }, { label: 'Не слышал', score: 0 }] },
  { id: 'T05', dim: 'tax', text: 'Преимущество рейтинга «ААА»?',
    options: [{ label: 'Возмещение НДС за 1 день, без проверок', score: 3 }, { label: 'Скидка на налог 50%', score: 0 }, { label: 'Не знаю', score: 0 }] },
  { id: 'T06', dim: 'tax', text: 'Срок уплаты ЕСП (единый социальный платёж)?',
    options: [{ label: 'Ежемесячно, до 15 числа', score: 3 }, { label: 'Ежеквартально', score: 1 }, { label: 'Не знаю', score: 0 }] },
  { id: 'T07', dim: 'tax', text: 'Что такое электронная счёт-фактура (ЭСФ)?',
    options: [{ label: 'Обязательный документ для НДС-плательщиков', score: 3 }, { label: 'Факультативный инструмент', score: 0 }, { label: 'Не использую', score: 0 }] },
  { id: 'T08', dim: 'tax', text: 'Налоговые проверки ААА-субъектов?',
    options: [{ label: 'Не проводятся (кроме уголовных дел)', score: 3 }, { label: 'Проводятся как обычно', score: 0 }, { label: 'Раз в 3 года', score: 1 }] },
  { id: 'T09', dim: 'tax', text: 'Где можно посмотреть свою категорию рейтинга устойчивости?',
    options: [{ label: 'my3.soliq.uz и Soliq biznes', score: 3 }, { label: 'В кабмине', score: 0 }, { label: 'Не знаю', score: 0 }] },
  { id: 'T10', dim: 'tax', text: 'Какие льготы действуют для IT-компаний?',
    options: [{ label: 'Нулевая ставка налога на прибыль (резидент IT-парка)', score: 3 }, { label: 'Пониженная ставка 5%', score: 1 }, { label: 'Таких льгот нет', score: 0 }] },
];

export function getTaxLevel(scorePct: number): { label: string; color: string; verdict: string } {
  if (scorePct >= 75) return { label: 'Уверенный',   color: '#4CAF50', verdict: 'Налоговая грамотность на высоком уровне. Можете использовать льготы и оптимизацию.' };
  if (scorePct >= 50) return { label: 'Средний',     color: '#8B6F3A', verdict: 'Есть пробелы. Рекомендуем курс «Налоги для МСБ» от Института налоговой и бюджетной политики.' };
  return               { label: 'Нужна подготовка', color: '#E57373', verdict: 'Серьёзные пробелы — риск штрафов. Пройдите курс и проконсультируйтесь с бухгалтером.' };
}
