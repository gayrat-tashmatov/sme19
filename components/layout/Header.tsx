'use client';

/**
 * Sprint 10.1 — Header.
 *
 * Five-category navigation with mega-menu dropdowns, OneID sign-in button,
 * role switcher (kept per Gayrat's request), dev auth toggle, language
 * switcher, currency widget.
 *
 * Mega-menu opens on hover on desktop, on tap on mobile. One dropdown at a
 * time. Clicking outside closes any open dropdown.
 *
 * The dropdown surface is wide (600–760px) so groups of links can sit in
 * columns with descriptions — a proper information-architecture showcase
 * for the Deputy Minister rather than a flat list.
 */

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import {
  Menu,
  X,
  Globe,
  Crown,
  ShieldCheck,
  UserCheck,
  User,
  Building2,
  ChevronDown,
  Check,
  ArrowRight,
  Lock,
  type LucideIcon,
} from 'lucide-react';
import { useStore } from '@/lib/store';
import { useT } from '@/lib/i18n';
import { cn } from '@/lib/cn';
import type { Lang, Role } from '@/lib/types';
import { CurrencyWidget } from '@/components/ui/CurrencyWidget';
import { DevAuthToggle } from '@/components/ui/DevAuthToggle';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { PhaseBadge } from '@/components/ui/PhaseBadge';
import { NAV_CATEGORIES } from '@/lib/data/navigation';
import { getModuleBySlug } from '@/lib/data/modules';

const LANGS: { id: Lang; label: string; short: string }[] = [
  { id: 'ru', label: 'Русский', short: 'RU' },
  { id: 'uz', label: 'Oʻzbekcha', short: 'UZ' },
  { id: 'en', label: 'English', short: 'EN' },
];

const ROLES: { id: Role; key: string; Icon: LucideIcon }[] = [
  { id: 'guest', key: 'role.guest', Icon: User },
  { id: 'entrepreneur', key: 'role.entrepreneur', Icon: UserCheck },
  { id: 'regionalMef', key: 'role.regionalMef', Icon: ShieldCheck },
  { id: 'mef', key: 'role.mef', Icon: Crown },
  { id: 'agency', key: 'role.agency', Icon: Building2 },
];

export default function Header() {
  const pathname = usePathname();
  const t = useT();
  const { lang, role, isAuthenticated, setLang, setRole } = useStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [roleOpen, setRoleOpen] = useState(false);
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  useEffect(() => {
    setMobileOpen(false);
    setOpenCategory(null);
  }, [pathname]);

  const currentRole = ROLES.find((r) => r.id === role)!;

  // Hover-intent: small delay before closing to allow cursor traversal
  // from header button down into the mega-menu panel.
  const scheduleClose = () => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    hoverTimer.current = setTimeout(() => setOpenCategory(null), 140);
  };
  const cancelClose = () => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
  };

  return (
    <header className="sticky top-0 z-40 bg-bg-white/92 backdrop-blur-md border-b border-ink-line">
      <div className="container-wide flex items-center h-16 gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0 focus-ring rounded-md">
          <div className="relative h-9 w-11 rounded-lg bg-navy-gradient flex items-center justify-center shadow-subtle">
            <span className="font-serif text-white text-[12px] font-bold leading-none tracking-wider">YRP</span>
            <span className="absolute -right-1 -bottom-1 h-3 w-3 rounded-full bg-gold border-2 border-bg-white" />
          </div>
          <div className="hidden sm:block leading-tight">
            <div className="font-serif font-semibold text-navy text-[15px]">{t('brand.short')}</div>
            <div className="text-[10px] text-ink-muted uppercase tracking-wider">
              Государственная поддержка МСБ
            </div>
          </div>
        </Link>

        {/* Desktop mega-menu */}
        <nav className="hidden lg:flex items-center gap-0.5 ml-2">
          {NAV_CATEGORIES.map((cat) => {
            const isOpen = openCategory === cat.id;
            return (
              <div
                key={cat.id}
                className="relative"
                onMouseEnter={() => {
                  cancelClose();
                  setOpenCategory(cat.id);
                }}
                onMouseLeave={scheduleClose}
              >
                <button
                  onClick={() => setOpenCategory(isOpen ? null : cat.id)}
                  className={cn(
                    'inline-flex items-center gap-1 px-3 py-2 rounded-lg text-[13.5px] font-medium transition-colors focus-ring',
                    isOpen ? 'text-navy bg-gold-soft' : 'text-ink hover:text-navy hover:bg-bg-band',
                  )}
                  aria-expanded={isOpen}
                >
                  {t(cat.labelKey)}
                  <ChevronDown
                    className={cn(
                      'h-3 w-3 text-ink-muted transition-transform',
                      isOpen && 'rotate-180',
                    )}
                  />
                </button>
                {isOpen && (
                  <MegaMenuPanel
                    category={cat}
                    onClose={() => setOpenCategory(null)}
                    onMouseEnter={cancelClose}
                    onMouseLeave={scheduleClose}
                  />
                )}
              </div>
            );
          })}
        </nav>

        <div className="flex-1" />

        {/* Currency (only on 2xl screens) */}
        <div className="hidden 2xl:block">
          <CurrencyWidget />
        </div>

        {/* Dev auth toggle */}
        <div className="hidden md:block">
          <DevAuthToggle />
        </div>

        {/* OneID CTA */}
        {!isAuthenticated && (
          <Button
            size="sm"
            variant="primary"
            leftIcon={<ShieldCheck className="h-4 w-4" />}
            onClick={() => useStore.getState().setAuthenticated(true)}
            className="hidden md:inline-flex"
          >
            {t('auth.signin.primary')}
          </Button>
        )}

        {/* Lang */}
        <div className="relative">
          <button
            onClick={() => {
              setLangOpen((v) => !v);
              setRoleOpen(false);
            }}
            className="hidden sm:inline-flex items-center gap-1 h-9 px-2.5 rounded-lg text-[13px] font-medium text-ink hover:bg-bg-band focus-ring"
            aria-label="Switch language"
          >
            <Globe className="h-4 w-4 text-ink-muted" />
            {LANGS.find((l) => l.id === lang)!.short}
            <ChevronDown className="h-3 w-3 text-ink-muted" />
          </button>
          {langOpen && (
            <DropdownMenu onClose={() => setLangOpen(false)}>
              {LANGS.map((l) => (
                <button
                  key={l.id}
                  onClick={() => {
                    setLang(l.id);
                    setLangOpen(false);
                  }}
                  className={cn(
                    'w-full flex items-center justify-between px-3 py-2 text-sm hover:bg-bg-band transition-colors',
                    lang === l.id && 'text-gold font-medium',
                  )}
                >
                  {l.label}
                  {lang === l.id && <Check className="h-4 w-4" />}
                </button>
              ))}
            </DropdownMenu>
          )}
        </div>

        {/* Role switcher — shown from md+ now that OneID CTA is compact */}
        <div className="relative hidden lg:block">
          <button
            onClick={() => {
              setRoleOpen((v) => !v);
              setLangOpen(false);
            }}
            className="inline-flex items-center gap-2 h-9 px-3 rounded-lg text-[13px] font-medium border border-ink-line bg-bg-white hover:bg-bg-band focus-ring"
          >
            <currentRole.Icon className="h-4 w-4 text-gold" />
            <span className="max-w-[120px] truncate">{t(currentRole.key)}</span>
            <ChevronDown className="h-3 w-3 text-ink-muted" />
          </button>
          {roleOpen && (
            <DropdownMenu onClose={() => setRoleOpen(false)} width="w-72">
              <div className="px-3 py-2 border-b border-ink-line">
                <div className="text-[10px] text-ink-muted uppercase tracking-wider">
                  {t('role.label')}
                </div>
              </div>
              {ROLES.map(({ id, key, Icon: RoleIcon }) => (
                <button
                  key={id}
                  onClick={() => {
                    setRole(id);
                    setRoleOpen(false);
                  }}
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-2.5 text-sm hover:bg-bg-band transition-colors',
                    role === id && 'bg-gold-soft',
                  )}
                >
                  <RoleIcon className={cn('h-4 w-4', role === id ? 'text-gold' : 'text-ink-muted')} />
                  <span className="flex-1 text-left">{t(key)}</span>
                  {role === id && <Check className="h-4 w-4 text-gold" />}
                </button>
              ))}
            </DropdownMenu>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          className="lg:hidden h-10 w-10 flex items-center justify-center rounded-lg hover:bg-bg-band focus-ring"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {mobileOpen && <MobileDrawer onClose={() => setMobileOpen(false)} />}
    </header>
  );
}

// ════════════════════════════════════════════════════════════════════
// Mega-menu panel — desktop
// ════════════════════════════════════════════════════════════════════

function MegaMenuPanel({
  category,
  onClose,
  onMouseEnter,
  onMouseLeave,
}: {
  category: (typeof NAV_CATEGORIES)[number];
  onClose: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}) {
  const t = useT();
  const widthClass = category.groups.length >= 4 ? 'w-[760px]' : 'w-[600px]';

  return (
    <>
      <div className="fixed inset-0 z-30" onClick={onClose} />
      <div
        className={cn(
          'absolute left-0 top-full mt-1 z-40 rounded-2xl border border-ink-line bg-bg-white shadow-card-hover overflow-hidden',
          widthClass,
        )}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <div className="px-6 pt-5 pb-3 border-b border-ink-line bg-bg-band">
          <div className="text-[10px] uppercase tracking-wider text-gold-dark font-semibold">
            {t(category.labelKey)}
          </div>
          <div className="text-[13px] text-ink-muted mt-0.5">{t(category.descKey)}</div>
        </div>

        <div
          className={cn(
            'grid gap-x-6 gap-y-5 p-6',
            category.groups.length <= 2 && 'grid-cols-2',
            category.groups.length === 3 && 'grid-cols-3',
            category.groups.length >= 4 && 'grid-cols-2',
          )}
        >
          {category.groups.map((group, i) => (
            <div key={i}>
              <div className="text-[11px] uppercase tracking-wider font-semibold text-navy mb-2">
                {t(group.titleKey)}
              </div>
              {group.descKey && (
                <div className="text-[11.5px] text-ink-muted mb-2.5">{t(group.descKey)}</div>
              )}
              <div className="space-y-1">
                {group.links.map((link, j) => (
                  <MegaMenuLink key={j} link={link} onNavigate={onClose} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function MegaMenuLink({
  link,
  onNavigate,
}: {
  link: (typeof NAV_CATEGORIES)[number]['groups'][number]['links'][number];
  onNavigate: () => void;
}) {
  const t = useT();
  const isAuth = useStore((s) => s.isAuthenticated);

  const mod = link.moduleSlug ? getModuleBySlug(link.moduleSlug) : null;
  const href = link.href ?? mod?.href ?? '#';
  const title = link.titleKey ? t(link.titleKey) : mod ? t(mod.titleKey) : '';
  const desc = link.descKey ? t(link.descKey) : mod ? t(mod.descKey) : null;
  const iconName = mod?.iconName ?? 'ArrowRight';
  const phaseTag = mod?.phaseTag;
  const requiresAuth = mod?.requiresAuth ?? false;
  const showLock = requiresAuth && !isAuth;

  return (
    <Link
      href={href}
      onClick={onNavigate}
      className="group flex items-start gap-3 rounded-lg px-2 py-2 hover:bg-bg-band transition-colors focus-ring"
    >
      <div className="h-8 w-8 rounded-lg bg-gold-soft border border-gold/20 flex items-center justify-center shrink-0 mt-0.5">
        <Icon name={iconName} className="h-4 w-4 text-gold" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[13px] font-semibold text-navy group-hover:text-gold-dark">
            {title}
          </span>
          {mod?.letter && (
            <span className="text-[10px] font-bold text-gold-dark bg-gold-soft border border-gold/30 rounded px-1 font-serif">
              {mod.letter}
            </span>
          )}
          {link.isDeepLink && (
            <span className="text-[9px] uppercase tracking-wider text-ink-muted font-semibold">
              · deep-link
            </span>
          )}
          {showLock && (
            <span className="inline-flex items-center gap-0.5 text-[9.5px] font-medium text-ink-muted">
              <Lock className="h-2.5 w-2.5" />
              {t('auth.locked.badge')}
            </span>
          )}
        </div>
        {desc && <div className="text-[11.5px] text-ink-muted mt-0.5 leading-snug">{desc}</div>}
        {phaseTag && (
          <div className="mt-1.5">
            <PhaseBadge phase={phaseTag} size="sm" compact />
          </div>
        )}
      </div>

      <ArrowRight className="h-3.5 w-3.5 text-ink-muted opacity-0 -translate-x-1 transition-all group-hover:opacity-100 group-hover:translate-x-0 mt-1" />
    </Link>
  );
}

// ════════════════════════════════════════════════════════════════════
// Simple dropdown for lang/role
// ════════════════════════════════════════════════════════════════════

function DropdownMenu({
  children,
  onClose,
  width = 'w-48',
}: {
  children: React.ReactNode;
  onClose: () => void;
  width?: string;
}) {
  return (
    <>
      <div className="fixed inset-0 z-30" onClick={onClose} />
      <div
        className={cn(
          'absolute right-0 top-full mt-2 z-40 rounded-xl border border-ink-line bg-bg-white shadow-card-hover overflow-hidden',
          width,
        )}
      >
        {children}
      </div>
    </>
  );
}

// ════════════════════════════════════════════════════════════════════
// Mobile drawer
// ════════════════════════════════════════════════════════════════════

function MobileDrawer({ onClose }: { onClose: () => void }) {
  const t = useT();
  const { lang, setLang, isAuthenticated, setAuthenticated } = useStore();
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className="lg:hidden border-t border-ink-line bg-bg-white max-h-[75vh] overflow-y-auto">
      <nav className="container-wide py-3 flex flex-col gap-1">
        {/* Auth strip */}
        <div className="flex items-center justify-between mb-2 px-3 py-2 rounded-lg bg-gold-soft border border-gold/20">
          <div className="flex-1 min-w-0">
            <div className="text-[10px] uppercase tracking-wider font-semibold text-gold-dark">
              {t('auth.devToggle.label')}
            </div>
            <div className="text-[11px] text-ink-muted">{t('auth.devToggle.hint')}</div>
          </div>
          <button
            onClick={() => setAuthenticated(!isAuthenticated)}
            className="shrink-0 h-9 px-3 rounded-md bg-navy text-white text-xs font-medium"
          >
            {isAuthenticated ? t('auth.devToggle.authorized') : t('auth.devToggle.guest')}
          </button>
        </div>

        {NAV_CATEGORIES.map((cat) => {
          const isExpanded = expanded === cat.id;
          return (
            <div key={cat.id} className="border-b border-ink-line/60 last:border-0">
              <button
                onClick={() => setExpanded(isExpanded ? null : cat.id)}
                className="w-full flex items-center justify-between px-3 py-3 text-[14px] font-medium text-navy"
              >
                {t(cat.labelKey)}
                <ChevronDown
                  className={cn(
                    'h-4 w-4 text-ink-muted transition-transform',
                    isExpanded && 'rotate-180',
                  )}
                />
              </button>
              {isExpanded && (
                <div className="pb-3 space-y-3">
                  {cat.groups.map((group, i) => (
                    <div key={i} className="px-3">
                      <div className="text-[10px] uppercase tracking-wider font-semibold text-ink-muted mb-1.5">
                        {t(group.titleKey)}
                      </div>
                      <div className="space-y-0.5">
                        {group.links.map((link, j) => {
                          const m = link.moduleSlug ? getModuleBySlug(link.moduleSlug) : null;
                          const href = link.href ?? m?.href ?? '#';
                          const title = link.titleKey
                            ? t(link.titleKey)
                            : m
                              ? t(m.titleKey)
                              : '';
                          return (
                            <Link
                              key={j}
                              href={href}
                              onClick={onClose}
                              className="flex items-center gap-2 px-2 py-1.5 rounded-md text-[13px] text-ink hover:bg-bg-band"
                            >
                              <ArrowRight className="h-3 w-3 text-ink-muted" />
                              {title}
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        <div className="mt-3 pt-3 border-t border-ink-line flex gap-2">
          {LANGS.map((l) => (
            <button
              key={l.id}
              onClick={() => setLang(l.id)}
              className={cn(
                'flex-1 h-9 rounded-lg text-sm font-medium',
                lang === l.id ? 'bg-navy text-white' : 'bg-bg-band text-ink',
              )}
            >
              {l.short}
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}
