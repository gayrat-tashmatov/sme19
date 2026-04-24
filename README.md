# ЯРП · Yagona Raqamli Platforma

**Интерактивный прототип** Единой цифровой платформы государственной
поддержки малого и среднего бизнеса Республики Узбекистан.

Политический артефакт для презентации руководству Министерства экономики
и финансов, Всемирному банку и отраслевым ведомствам. Создаётся на
основании п. 4 Постановления Президента № **УП-50 от 19 марта 2025 г.**

---

## Быстрый старт

```bash
# Требования: Node.js ≥ 18
npm install
npm run dev
# → http://localhost:3000
```

Production build: `npm run build && npm start`.

---

## Стек

| Слой | Технология |
|---|---|
| Фреймворк | Next.js 14 · App Router · TypeScript strict |
| Стили | Tailwind CSS 3.4 (кастомные токены: navy / gold / ink) |
| Анимация | framer-motion |
| Графика | recharts (Line / Area / Bar / Pie / Radar) |
| Иконки | lucide-react (динамический резолвер через `<Icon name>`) |
| Состояние | zustand (lang · role · AI assistant) с persist в localStorage |
| Шрифты | Playfair Display (`font-serif`) · Inter (`font-sans`) — замена Georgia/Calibri |
| Utility | clsx + tailwind-merge |

Deploy target: **Vercel** (zero-config Next.js 14).

---

## Структура проекта

```
yarp-prototype/
├── app/
│   ├── layout.tsx              Root: fonts, Header, Footer, AIAssistant
│   ├── globals.css             Base styles + component classes
│   ├── page.tsx                Главная: 8 секций
│   ├── about/page.tsx          О платформе · УП-50 · цели · аудитории
│   ├── modules/
│   │   ├── page.tsx            Каталог 16 модулей с фильтром
│   │   └── [slug]/page.tsx     Dynamic router → 6 приоритетных модулей
│   ├── queue/
│   │   └── [slug]/page.tsx     Полноценные страницы 9+1 модулей очереди
│   └── cabinet/page.tsx        Router по 4 ролям
├── components/
│   ├── ui/                     12 примитивов (Button, Card, Tabs, Dialog, Progress, ...)
│   ├── layout/                 Header (lang+role), Footer, AIAssistant
│   ├── sections/               HeroHome, StatsBand, ModuleCardGrid,
│   │                           HowItWorks, RoadmapTimeline, PartnersGrid,
│   │                           FinalCTA, ModuleHero, ComingSoon
│   ├── modules/                6 приоритетных модулей:
│   │                           A_Communications, B_Registry + B_ApplyOnceWizard,
│   │                           V_Ecommerce, G_BusinessInfo, D_Geoanalytics + D_UzMap,
│   │                           E_DigitalMaturity + E_MaturityResult
│   └── cabinet/                GuestCabinet, EntrepreneurCabinet,
│                               HokimCabinet, AdminCabinet, CabinetHero
├── lib/
│   ├── cn.ts                   tailwind-merge utility
│   ├── types.ts                Shared domain types
│   ├── store.ts                zustand (lang, role, AI)
│   ├── i18n.ts                 230 ключей × 3 языка (ru / uz / en)
│   └── data/
│       ├── modules.ts          15 модулей + closure = 16
│       ├── ministries.ts       8 ведомств на старте
│       ├── partners.ts         12 интеграций (OneID, Soliq, ..., OASIS)
│       ├── measures.ts         15 мер с 5-critical eligibility
│       ├── marketplaces.ts     12 маркетплейсов (абстрагированы) + customs + export checklist
│       ├── mip_services.ts     15 демо-сервисов из 614 МИП
│       ├── regions.ts          14 регионов РУз + реальные SVG paths
│       ├── davaktiv_lots.ts    7 демо-лотов
│       ├── macro.ts            GDP timeline, отрасли, торговля, commodities
│       ├── maturity.ts         6 измерений, 15 вопросов, уровни, курсы
│       └── queue_details.ts    Полная спецификация 10 очередных модулей
├── public/
│   ├── favicon.svg
│   ├── og-image.svg            1200×630 для соцсетей
│   └── uz-map.svg              Исходная карта РУз (simplemaps.com, free for commercial use)
├── styles/patterns.css         SVG-паттерны для navy-секций
├── next.config.js · tailwind.config.js · tsconfig.json · vercel.json
└── package.json
```

Итого **74 файла**, ~12 500 строк TS/TSX.

---

## Что работает

### Главная `/`
Hero (80vh, navy-gradient, SVG-коллаж) → KPI band (359/419/14/8) → 6 приоритетных модулей → How-it-works (4 шага) → 9 queue-модулей → Roadmap timeline (4 фазы) → 12 партнёров → Final CTA с email-формой.

### `/about`
Правовая основа УП-50 → 6 приоритетных модулей → SVG-диаграмма «5 логинов vs 1 OneID» → 6 целей → 3 аудитории → 12 интеграций → команда без имён.

### `/modules`
Sticky-фильтр **Все (16) / Приоритет (6) / Очередь (10)** с live-счётчиками.

### Приоритетные модули (6/6 живые)

| Slug | Модуль | Ключевой интерактив |
|---|---|---|
| `/modules/comms`     | а · B2B/B2G коммуникация | 3 таба, модалка обращения, **admin**: 4 KPI + BarChart модерации |
| `/modules/registry`  | б · Реестр мер + Apply Once | 15 мер, фильтры, 5-таб паспорт, **4-шаговый wizard + success screen** |
| `/modules/ecommerce` | в · E-commerce | 12 MP, 3 модели партнёрства, чеклист live-скор, **таможенный калькулятор** |
| `/modules/info`      | г · Бизнес-информация | AreaChart GDP, PieChart отраслей, топ-7 стран, таблица commodities |
| `/modules/geo`       | д · Геоаналитика | **Интерактивная карта 14 регионов** с hover/click, паспорт региона, "куда пойти" скоринг, heat map |
| `/modules/maturity`  | е · Цифровая зрелость | 15 вопросов → Radar + CircularProgress, 4 уровня, 5 рекомендаций со ссылками на меры M005/M012/M014/M015, 6 курсов, сертификат |

### Очередь (`/queue/qReg` … `/queue/qClose`)
10 полноценных страниц: hero, KPI strip, 6 features, 4 интеграции, международный референс (Эстония, Сингапур, Индия, Корея, GOV.UK), navy-блок с фазой запуска, CTA.

### Кабинет `/cabinet` — реактивный по роли
| Роль | Что показывается |
|---|---|
| **guest**        | Hero «Войти через OneID» + 4 preview-фичи + OneID-объяснение |
| **entrepreneur** | 7 виджетов: Gauge зрелости 62 (Gold), 2 активные заявки с ProgressBar + SLA, календарь 4 обязательств с отметкой «срочно», 3 рекомендованные меры с match-скором, 3 маркетплейс-партнёра, navy-карточка района (12 лотов · 45 МСБ/1000), 3 уведомления |
| **hokim**        | 4 KPI района, 3 action-карточки, горизонтальный BarChart МСБ по отраслям, таблица лотов с кнопкой «Добавить» |
| **admin**        | 4 global KPI (127k МСБ, 8 430 заявок, ₽ 412 млрд), LineChart динамики, PieChart распределения мер, BarChart по 14 регионам, 3 системных алерта, статус 4 сервисов |

### AI-ассистент
Floating gold-button bottom-right · разворачивается в панель 360×480 с 3 быстрыми переходами. Без реального LLM — mock-UI, но production-качество.

### Трёхязычность (ru / uz / en)
**230 ключей × 3 языка = 690 строк переводов.** Переключатель в хедере, persist в localStorage. Узбекский — латиница. Все модули, cabinet, footer, AI — переведены.

### Ролевая модель (4 роли)
Активно меняет контент, не косметика: admin видит отдельные секции в `/modules/comms` и `/modules/maturity`, hokim — редактируемую панель района в `/modules/geo`, entrepreneur — auto-location баннер на карте.

---

## Деплой на Vercel

**Через GitHub (рекомендуется, 3 минуты):**

```bash
cd yarp-prototype
git init
git add .
git commit -m "YARP prototype v0.1 — initial"
# Создайте новый приватный репозиторий на github.com/new
git remote add origin git@github.com:<ваш-аккаунт>/yarp-prototype.git
git branch -M main
git push -u origin main
```

1. Откройте [vercel.com/new](https://vercel.com/new)
2. Import Git Repository → выберите созданный репо
3. Framework Preset: **Next.js** (определится автоматически)
4. Deploy. Через ~60 секунд получите URL `https://yarp-prototype-xxx.vercel.app`

**Через Vercel CLI:**

```bash
npm i -g vercel
vercel login
vercel           # preview
vercel --prod    # production
```

**Custom domain:**
В Vercel Project Settings → Domains. Привязка `yarp.uz` потребует изменения DNS.

---

## Настройка под финальные данные

Файлы, требующие обновления перед презентацией руководству МЭФ:

1. **`lib/data/measures.ts`** — 15 демо-мер поменять на реальные из отфильтрованного списка 50–70 из `03_MIP_Services_Filtered.xlsx`. Формат не меняется, только текст.
2. **`lib/data/macro.ts`** — числа ВВП/инфляции/доли МСБ сверить со stat.uz и cbu.uz (на текущий момент помечены «требует верификации»).
3. **`lib/data/marketplaces.ts`** — абстрактные ID `MP-UZ-01..` заменить на реальные названия площадок, если политически согласовано (сейчас сознательно абстрагированы).
4. **`lib/data/davaktiv_lots.ts`** — заменить на реальный snapshot аукционов с auksion.uz.
5. **`components/layout/Footer.tsx`** — финальный email/телефон.
6. **Шрифты** — сейчас Playfair+Inter как прокси Georgia/Calibri. Если нужен реальный Calibri — заменить `next/font/google` на `next/font/local` с файлом `.ttf`.

---

## Правовая основа

Создаётся на основании п. 4 **Постановления Президента Республики
Узбекистан № УП-50 от 19 марта 2025 года**. Фундамент шести приоритетных
модулей (а/б/в/г/д/е) должен быть запущен в работу к **1 июля 2026 года**.

## Лицензии

- Код прототипа — персональный консалтинговый артефакт.
- Карта Узбекистана: **simplemaps.com**, free for commercial use,
  attribution на странице футера.
- Шрифты: Playfair Display и Inter — SIL Open Font License.
- lucide-react, framer-motion, recharts — MIT.

---

## История версий

| Версия | Что появилось |
|---|---|
| v0.1 stage 1 | Scaffold, design system, 12 UI-примитивов, Header/Footer/AIAssistant |
| v0.1 stage 2 | Полная главная, 230 ключей i18n, ~~метаданные 16 модулей |
| v0.1 stage 3 | About, каталог, 3 приоритетных модуля (a/б/в), Apply Once wizard |
| v0.1 stage 4 | Приоритетные г/д/е, интерактивная карта с реальными SVG paths |
| v0.1 stage 5 | 10 полных страниц очереди, cabinet с 4 ролями, финальный README |

Следующие шаги (вне scope прототипа): интеграция с OneID sandbox,
подключение реальной МИП-витрины, верификация макропоказателей,
настройка Vercel preview deployments на PR.
