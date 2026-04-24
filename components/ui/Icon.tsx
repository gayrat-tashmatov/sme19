'use client';

import * as L from 'lucide-react';
import { LucideProps } from 'lucide-react';

type IconName = keyof typeof L;

interface IconProps extends LucideProps {
  name: string;
  fallback?: IconName;
}

/**
 * Renders any lucide-react icon by name. Falls back to Circle if not found.
 * Lets data files reference icons as plain strings.
 */
export function Icon({ name, fallback = 'Circle', ...rest }: IconProps) {
  const Comp = (L as unknown as Record<string, React.ComponentType<LucideProps>>)[name]
    ?? (L as unknown as Record<string, React.ComponentType<LucideProps>>)[fallback];
  return <Comp {...rest} />;
}
