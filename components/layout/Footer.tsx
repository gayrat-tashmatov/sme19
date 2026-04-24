'use client';

import Link from 'next/link';
import { useT } from '@/lib/i18n';
import { Mail, Phone, MapPin } from 'lucide-react';

const MODULE_LINKS = [
  { href: '/modules/comms', labelKey: 'module.comms.title', fallback: 'B2B и B2G коммуникация' },
  { href: '/modules/registry', labelKey: 'module.registry.title', fallback: 'Реестр мер поддержки' },
  { href: '/modules/ecommerce', labelKey: 'module.ecommerce.title', fallback: 'E-commerce' },
  { href: '/modules/info', labelKey: 'module.info.title', fallback: 'Бизнес-информация' },
  { href: '/modules/geo', labelKey: 'module.geo.title', fallback: 'Геоаналитика' },
  { href: '/modules/maturity', labelKey: 'module.maturity.title', fallback: 'Цифровая зрелость' },
  { href: '/modules', labelKey: 'nav.modules', fallback: 'Все модули' },
];

export default function Footer() {
  const t = useT();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-navy text-white mt-auto">
      <div className="container-wide py-12 md:py-16 grid gap-10 md:grid-cols-2 lg:grid-cols-4">
        {/* Col 1 — brand */}
        <div>
          <div className="flex items-center gap-2.5 mb-4">
            <div className="h-10 w-12 rounded-lg bg-gold-gradient flex items-center justify-center shadow-subtle">
              <span className="font-serif text-white text-[13px] font-bold leading-none tracking-wider">YRP</span>
            </div>
            <div>
              <div className="font-serif font-semibold text-[15px]">{t('brand.short')}</div>
              <div className="text-[11px] text-white/60 uppercase tracking-wider">Государственная поддержка МСБ</div>
            </div>
          </div>
          <p className="text-sm text-white/70 leading-relaxed">{t('brand.full')}</p>
          <p className="text-xs text-white/50 mt-4 leading-relaxed">{t('footer.legal.up50')}</p>
        </div>

        {/* Col 2 — modules */}
        <div>
          <div className="font-serif font-semibold mb-4 text-white/90">{t('footer.section.modules')}</div>
          <ul className="space-y-2.5">
            {MODULE_LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-sm text-white/70 hover:text-gold-light transition-colors">
                  {t(l.labelKey) === l.labelKey ? l.fallback : t(l.labelKey)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Col 3 — audiences */}
        <div>
          <div className="font-serif font-semibold mb-4 text-white/90">{t('footer.section.audience')}</div>
          <ul className="space-y-2.5 text-sm text-white/70">
            <li>{t('footer.audience.entrepreneurs')}</li>
            <li>{t('footer.audience.ministries')}</li>
            <li>{t('footer.audience.mef')}</li>
            <li className="pt-3 mt-3 border-t border-white/10">
              <Link href="/architecture/roles" className="hover:text-gold-light transition-colors">
                Архитектура · матрица ролей →
              </Link>
            </li>
          </ul>
        </div>

        {/* Col 4 — contacts */}
        <div>
          <div className="font-serif font-semibold mb-4 text-white/90">{t('footer.section.contacts')}</div>
          <ul className="space-y-3 text-sm text-white/70">
            <li className="flex items-start gap-2.5">
              <MapPin className="h-4 w-4 text-gold-light mt-0.5 shrink-0" />
              <span>{t('footer.address')}</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Mail className="h-4 w-4 text-gold-light shrink-0" />
              <a href="mailto:info@yarp.uz" className="hover:text-gold-light transition-colors">info@yarp.uz</a>
            </li>
            <li className="flex items-center gap-2.5">
              <Phone className="h-4 w-4 text-gold-light shrink-0" />
              <span>+998 71 000 00 00</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10 bg-navy-700/40">
        <div className="container-wide py-5 flex flex-col md:flex-row items-start md:items-center gap-3 md:gap-6 justify-between text-xs text-white/50">
          <div>© {year} · {t('brand.short')} · Prototype draft v0.1</div>
          <div className="flex flex-wrap gap-x-5 gap-y-1.5">
            <Link href="#" className="hover:text-gold-light transition-colors">{t('footer.legal.policy')}</Link>
            <Link href="#" className="hover:text-gold-light transition-colors">{t('footer.legal.terms')}</Link>
            <span className="text-white/30">{t('footer.attribution')}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
