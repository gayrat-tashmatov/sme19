'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  GraduationCap, Rocket, Play, Briefcase, TrendingUp, Globe, Star, Filter,
  Clock, Users, Award, Sparkles, ArrowRight, BookOpen, Video, FileCheck,
} from 'lucide-react';
import { Card, CardTitle, CardDescription } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { DEMO_COURSE } from '@/lib/data/finlit_course';

const TRACKS = [
  { id: 'plan',    title: 'Старт',      desc: 'Оценка идеи, бизнес-план, юр.форма',          courses: 12, Icon: Rocket,    accent: 'text-gold' },
  { id: 'launch',  title: 'Запуск',     desc: 'Регистрация, налоги, первые клиенты',          courses: 18, Icon: Play,      accent: 'text-gold' },
  { id: 'manage',  title: 'Управление', desc: 'Финансы, кадры, процессы, отчётность',         courses: 24, Icon: Briefcase, accent: 'text-gold' },
  { id: 'grow',    title: 'Рост',       desc: 'Масштабирование, инвестиции, новые рынки',     courses: 16, Icon: TrendingUp, accent: 'text-gold' },
  { id: 'export',  title: 'Экспорт',    desc: 'Выход на зарубежные рынки, таможня, ВЭД',      courses: 14, Icon: Globe,     accent: 'text-gold' },
];

const SPECIAL_PROGRAMS = [
  {
    id: 'women',
    title: 'Женский бизнес',
    desc: 'Специальная программа для женщин-предпринимательниц. 12 модулей, менторство, круг поддержки.',
    reference: 'Референс: SBA Ascent for Women Entrepreneurs',
    seats: '284 активных участниц',
    Icon: Users,
  },
  {
    id: 'farmers',
    title: 'Фермерский трек',
    desc: 'Агротехнологии, субсидии, экспорт сельхозпродукции. Совместно с Минсельхозом.',
    reference: 'Совместно с МСХ · Tashkent SAU · Samarkand SAU',
    seats: '1 147 активных фермеров',
    Icon: GraduationCap,
  },
  {
    id: 'it',
    title: 'IT-предприниматели',
    desc: 'Резидентство IT-парка, выход на экспорт IT-услуг, SaaS-модели.',
    reference: 'Совместно с IT Park · UzVC · международные акселераторы',
    seats: '623 активных ИТ-компаний',
    Icon: Briefcase,
  },
  {
    id: 'champion',
    title: 'Чемпионы предпринимательства',
    desc: 'Ускоренный трек для высокопотенциального МСБ с амбициями в среднем и крупном бизнесе.',
    reference: 'Референс: SBA T.H.R.I.V.E. Emerging Leaders',
    seats: '89 участников · набор 2 раза в год',
    Icon: Star,
  },
];

const FEATURED_COURSES = [
  {
    id: 'C-2026-014',
    title: 'Финансовая грамотность для начинающего предпринимателя',
    track: 'launch',
    format: 'Онлайн · видео + тесты',
    duration: '8 часов',
    level: 'Начальный',
    provider: 'ЦПП',
    rating: 4.7,
    students: 3_240,
    free: true,
  },
  {
    id: 'C-2026-021',
    title: 'HACCP: система безопасности пищевой продукции',
    track: 'launch',
    format: 'Онлайн + очный экзамен',
    duration: '16 часов',
    level: 'Средний',
    provider: 'Torgsert + ЦПП',
    rating: 4.8,
    students: 890,
    free: true,
  },
  {
    id: 'C-2026-033',
    title: 'Экспорт продукции в страны ЕС: таможня, сертификаты, платежи',
    track: 'export',
    format: 'Онлайн · 6 вебинаров',
    duration: '12 часов',
    level: 'Продвинутый',
    provider: 'Enterprise Uzbekistan + ГТК',
    rating: 4.6,
    students: 412,
    free: true,
  },
  {
    id: 'C-2026-041',
    title: 'Выход на Amazon и Etsy для ремесленников',
    track: 'export',
    format: 'Онлайн · мастер-классы',
    duration: '10 часов',
    level: 'Средний',
    provider: 'Hunarmand + IT-Park',
    rating: 4.9,
    students: 628,
    free: true,
  },
  {
    id: 'C-2026-052',
    title: 'Цифровая трансформация малого бизнеса',
    track: 'grow',
    format: 'Смешанный',
    duration: '24 часа',
    level: 'Продвинутый',
    provider: 'ПРООН + IT-Park',
    rating: 4.8,
    students: 1_180,
    free: true,
  },
  {
    id: 'C-2026-064',
    title: 'Инвестиции в стартап: от pre-seed до Series A',
    track: 'grow',
    format: 'Очно · Ташкент',
    duration: '40 часов',
    level: 'Продвинутый',
    provider: 'UzVC + IT-Park',
    rating: 4.7,
    students: 156,
    free: false,
  },
];

export function N_Learning() {
  const [tab, setTab] = useState<'catalog' | 'course'>('catalog');
  const [track, setTrack] = useState<string | null>(null);
  const filtered = track ? FEATURED_COURSES.filter((c) => c.track === track) : FEATURED_COURSES;

  return (
    <section className="container-wide py-10 md:py-14 space-y-8">
      {/* Tab switcher */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setTab('catalog')}
          className={`h-11 px-4 rounded-lg text-sm font-medium border transition-colors flex items-center gap-2 ${
            tab === 'catalog' ? 'bg-navy text-white border-navy' : 'bg-bg-white text-ink-muted border-ink-line hover:border-gold hover:text-gold'
          }`}
        >
          <BookOpen className="h-4 w-4" /> Каталог программ
        </button>
        <button
          onClick={() => setTab('course')}
          className={`h-11 px-4 rounded-lg text-sm font-medium border transition-colors flex items-center gap-2 ${
            tab === 'course' ? 'bg-navy text-white border-navy' : 'bg-bg-white text-ink-muted border-ink-line hover:border-gold hover:text-gold'
          }`}
        >
          <Play className="h-4 w-4" /> Демо-курс: Финансовая грамотность
          <Badge variant="new" className="ml-1">NEW</Badge>
        </button>
      </div>

      {tab === 'course' ? <DemoCourse /> : <CatalogView track={track} setTrack={setTrack} filtered={filtered} />}
    </section>
  );
}

function CatalogView({ track, setTrack, filtered }: { track: string | null; setTrack: (v: string | null) => void; filtered: typeof FEATURED_COURSES }) {
  return (
    <div className="space-y-8">
      {/* Hero */}
      <Card padding="lg" tone="navy" className="text-white relative overflow-hidden">
        <div className="absolute inset-0 pattern-dots opacity-30 pointer-events-none" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-3">
            <Badge variant="new">NEW</Badge>
            <span className="text-xs uppercase tracking-wider text-gold-light">Адаптация SBA Learning Center · США</span>
          </div>
          <h2 className="font-serif text-2xl md:text-3xl text-white mb-2">
            Единая образовательная платформа для МСБ Узбекистана
          </h2>
          <p className="text-white/75 max-w-2xl text-sm">
            Все программы обучения ЦПП, ТПП, IT-парка, международных провайдеров — в одной витрине.
            Пять треков: Старт → Запуск → Управление → Рост → Экспорт. Персональные рекомендации
            по результатам опросника цифровой зрелости.
          </p>
        </div>
      </Card>

      {/* 5 tracks */}
      <div>
        <h3 className="font-serif text-xl text-ink mb-4">Пять треков предпринимателя</h3>
        <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-3">
          {TRACKS.map((t, i) => {
            const active = track === t.id;
            return (
              <motion.button
                key={t.id}
                onClick={() => setTrack(active ? null : t.id)}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className={`text-left p-4 rounded-xl border transition-all group ${
                  active ? 'border-gold bg-gold/10 shadow-md' : 'border-ink-line bg-bg-white hover:border-gold/50 hover:-translate-y-0.5'
                }`}
              >
                <div className={`h-10 w-10 rounded-lg flex items-center justify-center mb-3 ${active ? 'bg-gold text-white' : 'bg-gold/10 text-gold'}`}>
                  <t.Icon className="h-5 w-5" />
                </div>
                <div className="font-serif text-lg text-ink mb-1">{t.title}</div>
                <div className="text-xs text-ink-muted leading-snug mb-3">{t.desc}</div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gold font-medium">{t.courses} курсов</span>
                  <ArrowRight className="h-3 w-3 text-gold group-hover:translate-x-0.5 transition-transform" />
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Featured courses */}
      <Card padding="lg">
        <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-gold" />
            <CardTitle className="text-[16px]">
              {track ? `Курсы · ${TRACKS.find((t) => t.id === track)?.title}` : 'Рекомендуемые курсы'}
            </CardTitle>
            <Badge variant="outline">{filtered.length} программ</Badge>
          </div>
          {track && (
            <button onClick={() => setTrack(null)} className="text-xs text-gold hover:text-gold-dark">
              ← Все треки
            </button>
          )}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
          {filtered.map((c) => (
            <div key={c.id} className="p-4 rounded-xl border border-ink-line hover:border-gold/40 bg-bg-white transition-all group">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-mono text-ink-muted">{c.id}</span>
                {c.free && <Badge variant="success">бесплатно</Badge>}
                <span className="text-xs text-gold font-medium ml-auto flex items-center gap-0.5">
                  <Star className="h-3 w-3 fill-gold" /> {c.rating}
                </span>
              </div>
              <div className="font-serif text-[15px] text-ink leading-snug mb-2 min-h-[56px]">{c.title}</div>
              <div className="space-y-1 text-xs text-ink-muted mb-3">
                <div className="flex items-center gap-1.5"><Video className="h-3 w-3" />{c.format}</div>
                <div className="flex items-center gap-1.5"><Clock className="h-3 w-3" />{c.duration} · {c.level}</div>
                <div className="flex items-center gap-1.5"><Award className="h-3 w-3" />{c.provider}</div>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-ink-line/60">
                <span className="text-xs text-ink-muted flex items-center gap-1">
                  <Users className="h-3 w-3" /> {c.students.toLocaleString('ru')}
                </span>
                <Button size="sm">Начать</Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Special programs */}
      <div>
        <h3 className="font-serif text-xl text-ink mb-2">Специальные программы</h3>
        <p className="text-sm text-ink-muted mb-4">
          Как SBA Ascent (для женщин), Boots to Business (для ветеранов), T.H.R.I.V.E. (для underserved) —
          мы адаптируем концепцию спецпрограмм под приоритеты Узбекистана.
        </p>
        <div className="grid md:grid-cols-2 gap-4">
          {SPECIAL_PROGRAMS.map((p) => (
            <Card key={p.id} hover>
              <div className="flex items-start gap-3">
                <div className="h-12 w-12 rounded-xl bg-gold/10 text-gold flex items-center justify-center shrink-0">
                  <p.Icon className="h-6 w-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-[16px]">{p.title}</CardTitle>
                  <CardDescription className="mt-1">{p.desc}</CardDescription>
                  <div className="mt-3 pt-3 border-t border-ink-line flex items-center justify-between flex-wrap gap-2 text-xs">
                    <span className="text-ink-muted italic">{p.reference}</span>
                    <span className="text-gold font-medium">{p.seats}</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Maturity bridge */}
      <Card padding="lg" tone="gold" className="text-white">
        <div className="flex items-start gap-4">
          <div className="h-10 w-10 rounded-lg bg-white/15 flex items-center justify-center shrink-0">
            <FileCheck className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <CardTitle className="text-white">Пройдите опросник «Цифровая зрелость» — получите персональные рекомендации</CardTitle>
            <CardDescription className="text-white/80 mt-1">
              LMS связан с модулем (е) Цифровая зрелость. После прохождения опросника автоматически
              подбираются 3–5 курсов под слабые блоки. Не всё подряд — только то, что реально нужно
              вашему бизнесу на текущем этапе.
            </CardDescription>
            <div className="mt-3">
              <Button size="sm" variant="outline-white">Пройти опросник →</Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Footer callout */}
      <Card padding="lg" className="border-success/25 bg-success/[0.03]">
        <div className="flex items-start gap-4">
          <div className="h-10 w-10 rounded-lg bg-success/10 text-success flex items-center justify-center shrink-0">
            <Sparkles className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <div className="font-serif font-semibold text-ink">Предложение из международного опыта</div>
            <CardDescription className="mt-1">
              Референс — <strong>SBA Learning Center</strong> (США): 4 трека (Plan · Launch · Manage · Grow)
              + спецпрограммы. Бесплатно, онлайн, с выдачей сертификатов. В Узбекистане обучение МСБ
              сейчас разобщено между ЦПП, ТПП, IT-парком и международными провайдерами — модуль
              объединит это в единую витрину к 2027–2028.
            </CardDescription>
            <div className="mt-3 flex gap-2 flex-wrap">
              <Badge variant="new">NEW · общая очередь</Badge>
              <Badge variant="outline">5 треков + 4 спецпрограммы</Badge>
              <Badge variant="outline">Связан с модулем (е) Цифровая зрелость</Badge>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════
// DemoCourse — full interactive course "Финансовая грамотность"
// ════════════════════════════════════════════════════════════════════

function DemoCourse() {
  const [selectedLesson, setSelectedLesson] = useState<number | null>(null);
  const [progress, setProgress] = useState<Record<number, boolean>>({}); // lessonN → completed
  const [quizState, setQuizState] = useState<Record<string, number>>({}); // "lessonN-qIdx" → selected option

  const completedCount = Object.values(progress).filter(Boolean).length;
  const totalLessons = DEMO_COURSE.lessons.length;
  const progressPct = (completedCount / totalLessons) * 100;
  const allCompleted = completedCount === totalLessons;

  if (selectedLesson !== null) {
    const lesson = DEMO_COURSE.lessons.find((l) => l.n === selectedLesson)!;
    return (
      <LessonView
        lesson={lesson}
        quizState={quizState}
        setQuizState={setQuizState}
        onComplete={() => {
          setProgress({ ...progress, [lesson.n]: true });
          setSelectedLesson(null);
        }}
        onBack={() => setSelectedLesson(null)}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Hero */}
      <Card padding="lg" tone="navy" className="text-white relative overflow-hidden">
        <div className="absolute inset-0 pattern-dots opacity-30 pointer-events-none" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-3">
            <GraduationCap className="h-5 w-5 text-gold-light" />
            <span className="text-xs uppercase tracking-wider text-gold-light font-semibold">{DEMO_COURSE.methodology}</span>
          </div>
          <h2 className="font-serif text-2xl md:text-3xl text-white mb-1 leading-tight">{DEMO_COURSE.title}</h2>
          <p className="text-white/75 text-sm mb-4">{DEMO_COURSE.subtitle}</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-4">
            <CourseStat label="Уроков"          value={`${DEMO_COURSE.totalLessons}`} />
            <CourseStat label="Продолжительность" value={DEMO_COURSE.totalDuration} />
            <CourseStat label="Уровень"          value={DEMO_COURSE.level} />
            <CourseStat label="Провайдер"        value={DEMO_COURSE.provider} />
          </div>
        </div>
      </Card>

      {/* Progress bar */}
      <Card padding="md">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <FileCheck className="h-5 w-5 text-gold" />
            <CardTitle className="text-[15px]">Ваш прогресс</CardTitle>
          </div>
          <span className="font-mono text-[13px] text-gold font-semibold">
            {completedCount} / {totalLessons} уроков · {Math.round(progressPct)}%
          </span>
        </div>
        <div className="h-2 bg-bg-band rounded-full overflow-hidden">
          <div
            className="h-full bg-gold transition-all"
            style={{ width: `${progressPct}%` }}
          />
        </div>
        {allCompleted && (
          <div className="mt-3 p-3 rounded-lg bg-success/10 border border-success/30 flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5 text-success" />
              <div>
                <div className="font-serif text-sm text-ink font-semibold">Поздравляем! Курс пройден.</div>
                <div className="text-[12px] text-ink-muted">Сертификат готов к скачиванию.</div>
              </div>
            </div>
            <Button size="sm" leftIcon={<Award className="h-4 w-4" />}>
              Скачать сертификат (PDF)
            </Button>
          </div>
        )}
      </Card>

      {/* Lessons list */}
      <div className="space-y-2.5">
        {DEMO_COURSE.lessons.map((lesson) => {
          const isCompleted = progress[lesson.n] ?? false;
          return (
            <button
              key={lesson.n}
              onClick={() => setSelectedLesson(lesson.n)}
              className="w-full text-left surface-card surface-card-hover p-4 flex items-start gap-4 focus-ring"
            >
              <div className={`h-11 w-11 rounded-xl flex items-center justify-center shrink-0 font-serif font-semibold text-sm ${
                isCompleted ? 'bg-success text-white' : 'bg-gold-soft/50 text-gold-dark'
              }`}>
                {isCompleted ? <FileCheck className="h-5 w-5" /> : lesson.n}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-0.5">
                  <div className="font-serif text-[15px] text-ink font-semibold">{lesson.title}</div>
                  <span className="text-[11px] text-ink-muted font-mono">{lesson.duration}</span>
                  {isCompleted && <Badge variant="success">пройдено</Badge>}
                </div>
                <div className="text-[13px] text-ink-muted leading-snug">{lesson.summary}</div>
              </div>
              <ArrowRight className="h-4 w-4 text-ink-muted self-center shrink-0" />
            </button>
          );
        })}
      </div>

      <Card padding="md" className="border-gold/30 bg-gold-soft/20">
        <div className="flex items-start gap-3 text-sm text-ink">
          <Sparkles className="h-5 w-5 text-gold shrink-0 mt-0.5" />
          <div>
            Этот курс связан с опросником <strong>«Финансовая грамотность»</strong> из модуля{' '}
            <a href="/modules/maturity" className="text-gold font-semibold hover:underline">Оценка зрелости</a>.
            Пройдите опросник перед курсом, чтобы увидеть ваши слабые места, и после — чтобы замерить прогресс.
          </div>
        </div>
      </Card>
    </div>
  );
}

function CourseStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-lg p-2.5">
      <div className="text-[10px] uppercase tracking-wider text-gold-light/80 mb-0.5">{label}</div>
      <div className="font-serif text-base text-white font-semibold leading-tight">{value}</div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════
// LessonView — single lesson with content, video placeholder, quiz
// ════════════════════════════════════════════════════════════════════

function LessonView({
  lesson, quizState, setQuizState, onComplete, onBack,
}: {
  lesson: import('@/lib/data/finlit_course').Lesson;
  quizState: Record<string, number>;
  setQuizState: (s: Record<string, number>) => void;
  onComplete: () => void;
  onBack: () => void;
}) {
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const correctCount = lesson.quiz.reduce((sum, q, idx) => {
    const key = `${lesson.n}-${idx}`;
    return sum + (quizState[key] === q.correctIndex ? 1 : 0);
  }, 0);

  const allAnswered = lesson.quiz.every((_, idx) => quizState[`${lesson.n}-${idx}`] !== undefined);
  const passed = quizSubmitted && correctCount >= 2; // need 2 of 3 correct

  return (
    <div className="space-y-5">
      <button onClick={onBack} className="inline-flex items-center gap-2 text-sm text-ink-muted hover:text-gold transition-colors">
        <ArrowRight className="h-4 w-4 rotate-180" /> К списку уроков
      </button>

      {/* Lesson header */}
      <Card padding="lg">
        <div className="flex items-start gap-4 mb-2">
          <div className="h-12 w-12 rounded-xl bg-gold text-white flex items-center justify-center shrink-0 font-serif font-semibold text-lg">
            {lesson.n}
          </div>
          <div className="flex-1">
            <CardTitle>{lesson.title}</CardTitle>
            <CardDescription className="mt-1">{lesson.summary}</CardDescription>
            <div className="mt-2 flex items-center gap-2 text-[12px] text-ink-muted">
              <Clock className="h-3.5 w-3.5" />
              <span>Урок {lesson.n} из {DEMO_COURSE.lessons.length} · {lesson.duration}</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Video placeholder */}
      {lesson.videoTitle && (
        <Card padding="none" className="overflow-hidden">
          <div className="aspect-video bg-gradient-to-br from-navy to-ink flex items-center justify-center relative">
            <div className="absolute inset-0 pattern-dots opacity-20" />
            <div className="relative text-center text-white">
              <div className="mx-auto h-16 w-16 rounded-full bg-gold/20 border-2 border-gold flex items-center justify-center mb-3 backdrop-blur-sm">
                <Play className="h-7 w-7 text-gold ml-1" />
              </div>
              <div className="font-serif text-lg font-semibold mb-1">{lesson.videoTitle}</div>
              <div className="text-xs text-white/60">Видео-плейсхолдер · {lesson.duration}</div>
            </div>
          </div>
        </Card>
      )}

      {/* Content */}
      <Card padding="lg">
        <div className="flex items-center gap-2 mb-3">
          <BookOpen className="h-5 w-5 text-gold" />
          <CardTitle className="text-[15px]">Материал урока</CardTitle>
        </div>
        <div className="prose-like space-y-3">
          {lesson.content.map((p, i) => (
            <p key={i} className="text-[14.5px] text-ink leading-relaxed">{p}</p>
          ))}
        </div>
      </Card>

      {/* Quiz */}
      <Card padding="lg">
        <div className="flex items-center gap-2 mb-4">
          <FileCheck className="h-5 w-5 text-gold" />
          <CardTitle className="text-[15px]">Проверка знаний · {lesson.quiz.length} вопросов</CardTitle>
        </div>

        <div className="space-y-5">
          {lesson.quiz.map((q, qIdx) => {
            const key = `${lesson.n}-${qIdx}`;
            const selected = quizState[key];
            return (
              <div key={qIdx}>
                <div className="font-serif text-[14px] text-ink font-semibold mb-2">
                  {qIdx + 1}. {q.q}
                </div>
                <div className="space-y-1.5">
                  {q.options.map((opt, optIdx) => {
                    const isSelected = selected === optIdx;
                    const isCorrect = q.correctIndex === optIdx;
                    const showCorrect = quizSubmitted && isCorrect;
                    const showWrong = quizSubmitted && isSelected && !isCorrect;
                    return (
                      <button
                        key={optIdx}
                        onClick={() => !quizSubmitted && setQuizState({ ...quizState, [key]: optIdx })}
                        disabled={quizSubmitted}
                        className={`w-full text-left p-3 rounded-lg border text-[13px] transition-colors ${
                          showCorrect
                            ? 'border-success bg-success/10 text-ink font-medium'
                            : showWrong
                            ? 'border-danger bg-danger/10 text-ink'
                            : isSelected
                            ? 'border-gold bg-gold-soft/40 text-ink font-medium'
                            : 'border-ink-line bg-bg-white text-ink hover:border-gold/40'
                        } ${quizSubmitted ? 'cursor-default' : 'cursor-pointer'}`}
                      >
                        <div className="flex items-center gap-2">
                          <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                            showCorrect ? 'border-success bg-success text-white' :
                            showWrong  ? 'border-danger bg-danger text-white' :
                            isSelected ? 'border-gold bg-gold text-white' : 'border-ink-line'
                          }`}>
                            {(showCorrect || (isSelected && !quizSubmitted)) && <div className="h-2 w-2 rounded-full bg-white" />}
                            {showWrong && <span className="text-xs">✕</span>}
                          </div>
                          <span>{opt}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
                {quizSubmitted && (
                  <div className={`mt-2 p-2.5 rounded-lg text-[12px] ${
                    selected === q.correctIndex
                      ? 'bg-success/8 border border-success/25 text-ink'
                      : 'bg-danger/8 border border-danger/25 text-ink'
                  }`}>
                    <strong>{selected === q.correctIndex ? 'Верно.' : 'Неверно.'}</strong> {q.explanation}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Actions */}
        <div className="mt-6 pt-4 border-t border-ink-line flex items-center justify-between gap-2 flex-wrap">
          {!quizSubmitted ? (
            <>
              <div className="text-[12px] text-ink-muted">
                {allAnswered ? 'Все вопросы отмечены. Проверить результат?' : `Отвечено ${Object.keys(quizState).filter((k) => k.startsWith(`${lesson.n}-`)).length} из ${lesson.quiz.length}`}
              </div>
              <Button disabled={!allAnswered} onClick={() => setQuizSubmitted(true)}>
                Проверить ответы
              </Button>
            </>
          ) : (
            <>
              <div className={`text-[13px] font-semibold ${passed ? 'text-success' : 'text-danger'}`}>
                Результат: {correctCount} из {lesson.quiz.length} правильных. {passed ? 'Урок засчитан.' : 'Нужно минимум 2 верных ответа.'}
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" onClick={() => { setQuizSubmitted(false); }}>
                  Пройти заново
                </Button>
                {passed && (
                  <Button onClick={onComplete} rightIcon={<ArrowRight className="h-4 w-4" />}>
                    Завершить урок
                  </Button>
                )}
              </div>
            </>
          )}
        </div>
      </Card>
    </div>
  );
}
