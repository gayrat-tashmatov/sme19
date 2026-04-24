'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { Download, Award, BookOpen, ChevronRight, Sparkles } from 'lucide-react';
import { Card, CardTitle, CardDescription } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { CircularProgress } from '@/components/ui/Progress';
import { DIMENSIONS, DIMENSION_LABELS, getLevel, RECOMMENDATIONS, COURSES, COURSE_LABELS } from '@/lib/data/maturity';
import type { Course } from '@/lib/types';

interface MaturityResultProps {
  dimensionScores: Record<string, number>; // each 0-100
  onRestart?: () => void;
}

export function MaturityResult({ dimensionScores, onRestart }: MaturityResultProps) {
  const total = Math.round(
    Object.values(dimensionScores).reduce((a, b) => a + b, 0) / Object.keys(dimensionScores).length,
  );
  const level = getLevel(total);

  const radarData = DIMENSIONS.map((d) => ({
    dim: DIMENSION_LABELS[d.labelKey].ru,
    value: dimensionScores[d.key] ?? 0,
  }));

  return (
    <div className="space-y-6">
      {/* Score headline */}
      <Card padding="lg" className="relative overflow-hidden">
        <div className="absolute inset-0 hero-glow opacity-[0.07] pointer-events-none" />
        <div className="relative grid md:grid-cols-[auto_1fr] gap-8 items-center">
          <CircularProgress
            value={total}
            size={180}
            strokeWidth={14}
            label={String(total)}
            sublabel="из 100"
            tone="gold"
          />
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-soft border border-gold/30 text-xs font-semibold text-gold-dark mb-3">
              <Award className="h-3.5 w-3.5" /> Уровень цифровой зрелости
            </div>
            <div className="font-serif text-5xl font-bold" style={{ color: level.color }}>
              {level.label}
            </div>
            <p className="mt-3 text-ink leading-relaxed max-w-xl">
              {level.key === 'bronze' && 'Стартовый уровень — есть база для цифровизации. Рекомендуем начать с процессов и безопасности.'}
              {level.key === 'silver' && 'Зрелая операционная модель. Следующий шаг — данные и персонализация клиентского опыта.'}
              {level.key === 'gold' && 'Высокий уровень цифровой зрелости. Можете претендовать на специализированные меры поддержки.'}
              {level.key === 'platinum' && 'Лидирующая позиция в отрасли. Ваши практики — предмет изучения для других МСБ региона.'}
            </p>
            {onRestart && (
              <Button variant="ghost" className="mt-4" onClick={onRestart}>
                Пройти опросник заново
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Radar by dimension */}
      <div className="grid lg:grid-cols-[1fr_1fr] gap-5">
        <Card padding="lg">
          <CardTitle>Профиль по 6 измерениям</CardTitle>
          <CardDescription>Сильные и слабые стороны цифровой зрелости</CardDescription>
          <div className="h-80 mt-5">
            <ResponsiveContainer>
              <RadarChart data={radarData} margin={{ top: 10, right: 20, bottom: 10, left: 20 }}>
                <PolarGrid stroke="#E5E7EB" />
                <PolarAngleAxis dataKey="dim" tick={{ fill: '#1B2A3D', fontSize: 11 }} />
                <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 10, fill: '#5A6575' }} />
                <Radar
                  dataKey="value"
                  stroke="#8B6F3A"
                  fill="#8B6F3A"
                  fillOpacity={0.3}
                  strokeWidth={2.5}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card padding="lg">
          <CardTitle>Баллы по измерениям</CardTitle>
          <CardDescription>0–100 в каждом измерении</CardDescription>
          <div className="mt-5 space-y-3">
            {DIMENSIONS.map((d) => {
              const v = dimensionScores[d.key] ?? 0;
              return (
                <div key={d.key}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-medium text-ink">{DIMENSION_LABELS[d.labelKey].ru}</span>
                    <span className="font-serif font-semibold text-ink">{Math.round(v)}</span>
                  </div>
                  <div className="h-2 rounded-full bg-bg-band overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${v}%` }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                      className="h-full rounded-full bg-gold-gradient"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Recommendations */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="h-5 w-5 text-gold" />
          <h3 className="font-serif text-xl font-semibold">Персональные рекомендации</h3>
          <Badge variant="priority">5 шагов</Badge>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {RECOMMENDATIONS.map((r, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
            >
              <Card className="h-full">
                <Badge variant={r.priority === 'high' ? 'priority-solid' : 'warning'} className="mb-3">
                  {r.priority === 'high' ? 'Высокий приоритет' : 'Средний приоритет'}
                </Badge>
                <CardTitle className="text-[16px]">{r.title}</CardTitle>
                <CardDescription>{r.desc}</CardDescription>
                <Link href="/modules/registry" className="mt-4 flex items-center gap-1 text-sm text-gold hover:text-gold-dark font-medium">
                  Связанная мера {r.linkedMeasureId} <ChevronRight className="h-4 w-4" />
                </Link>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Courses */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="h-5 w-5 text-gold" />
          <h3 className="font-serif text-xl font-semibold">Рекомендуемые курсы</h3>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {COURSES.map((c, i) => <CourseCard key={c.id} course={c} index={i} />)}
        </div>
      </div>

      {/* Certificate download */}
      <div className="rounded-2xl bg-gradient-to-br from-navy to-navy-700 p-6 md:p-8 flex items-center justify-between gap-5 flex-wrap relative overflow-hidden">
        <div className="absolute inset-0 pattern-dots opacity-30 pointer-events-none" />
        <div className="relative flex items-center gap-4 flex-1 min-w-0">
          <div className="h-14 w-14 rounded-xl bg-gold-gradient flex items-center justify-center shrink-0">
            <Award className="h-7 w-7 text-white" />
          </div>
          <div>
            <div className="font-serif text-xl font-semibold text-white">Сертификат цифровой зрелости</div>
            <div className="text-sm text-white/70 mt-1">PDF с вашими результатами · уровень {level.label} · {total}/100</div>
          </div>
        </div>
        <Button variant="primary" size="lg" leftIcon={<Download className="h-4 w-4" />}>
          Скачать PDF
        </Button>
      </div>
    </div>
  );
}

function CourseCard({ course, index }: { course: Course; index: number }) {
  const LEVEL_COLOR = { basic: 'text-success', intermediate: 'text-gold', advanced: 'text-secondary' };
  const LEVEL_LABEL = { basic: 'Начальный', intermediate: 'Средний', advanced: 'Продвинутый' };
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.3, delay: index * 0.04 }}
    >
      <Card hover className="h-full">
        <div className="h-11 w-11 rounded-xl bg-gold/10 text-gold flex items-center justify-center mb-3">
          <BookOpen className="h-5 w-5" />
        </div>
        <CardTitle className="text-[15px] leading-snug">{COURSE_LABELS[course.titleKey]}</CardTitle>
        <div className="mt-3 text-xs text-ink-muted flex items-center gap-3">
          <span>{course.duration}</span>
          <span>·</span>
          <span className={LEVEL_COLOR[course.level]}>{LEVEL_LABEL[course.level]}</span>
        </div>
      </Card>
    </motion.div>
  );
}
