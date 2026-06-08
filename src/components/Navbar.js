'use client';

import React, { useEffect, useState, useCallback, useRef, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import './Navbar.css';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useTranslations } from '../translations';
import { Home, HelpCircle, Map, User, UserPlus } from 'lucide-react';
import YafttyLogo from './YafttyLogo';

const MOBILE_BREAKPOINT = 768;

const Navbar = () => {
  const pathname = usePathname();
  const [activePath, setActivePath] = useState(pathname);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [navHeight, setNavHeight] = useState(64);
  const navRef = useRef(null);
  const { user } = useAuth();
  const { currentLanguage } = useLanguage();
  const { t } = useTranslations(currentLanguage);

  useEffect(() => {
    setMounted(true);
  }, []);

  const updateNavHeight = useCallback(() => {
    const el = navRef.current;
    if (!el) return;
    const height = Math.ceil(el.getBoundingClientRect().height);
    setNavHeight(height);
    document.documentElement.style.setProperty('--navbar-height', `${height}px`);
  }, []);

  useLayoutEffect(() => {
    updateNavHeight();
  }, [updateNavHeight, currentLanguage]);

  useEffect(() => {
    if (typeof document === 'undefined' || !document.fonts?.ready) return undefined;
    let cancelled = false;
    document.fonts.ready.then(() => {
      if (!cancelled) updateNavHeight();
    });
    return () => {
      cancelled = true;
    };
  }, [updateNavHeight, currentLanguage]);

  useLayoutEffect(() => {
    if (!menuOpen) return undefined;

    updateNavHeight();
    const raf = requestAnimationFrame(updateNavHeight);
    window.addEventListener('resize', updateNavHeight);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', updateNavHeight);
    };
  }, [menuOpen, updateNavHeight]);

  useEffect(() => {
    setActivePath(pathname);
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (e) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [menuOpen]);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth > MOBILE_BREAKPOINT) setMenuOpen(false);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const isActive = (path) => {
    if (path === '/') {
      return activePath === '/';
    }
    return activePath.startsWith(path);
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const handleLogoClick = (e) => {
    setMenuOpen(false);
    if (pathname === '/') {
      e.preventDefault();
      scrollToTop();

      const logoElement = e.currentTarget;
      logoElement.classList.add('logo-link-pressed');
      window.setTimeout(() => {
        logoElement.classList.remove('logo-link-pressed');
      }, 150);
    }
  };

  const navItems = [
    { to: '/', label: t('nav.home'), icon: Home },
    { to: '/help', label: t('nav.help'), icon: HelpCircle },
    { to: '/map', label: t('nav.map'), icon: Map },
  ];

  const isArabic = currentLanguage === 'ar';
  const desktopNavItems = isArabic ? [...navItems].reverse() : navItems;

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  const handleNavClick = (to, e) => {
    setActivePath(to);
    setMenuOpen(false);
    if (to === '/' && pathname === '/') {
      e.preventDefault();
      scrollToTop();

      const linkElement = e.currentTarget;
      linkElement.style.transform = 'scale(0.95)';
      setTimeout(() => {
        linkElement.style.transform = 'scale(1)';
      }, 150);
    }
  };

  const renderSignupLink = (mobile = false) => (
    <motion.div
      key="signup"
      className={mobile ? 'navbar-mobile-item' : undefined}
      whileHover={mobile ? undefined : { scale: 1.05 }}
      whileTap={{ scale: 0.96 }}
      style={{ display: mobile ? 'block' : 'inline-block' }}
      initial={{ opacity: 0, y: mobile ? 8 : -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: mobile ? 0.05 : 0.1 }}
    >
      <Link
        href="/signup"
        className={`navbar-link-new navbar-link-signup${isActive('/signup') ? ' active' : ''}${mobile ? ' navbar-link-mobile' : ''}`}
        onClick={() => {
          setActivePath('/signup');
          setMenuOpen(false);
        }}
      >
        {mobile ? (
          <>
            <span className="navbar-link-mobile-icon" aria-hidden="true">
              <UserPlus size={20} strokeWidth={2} />
            </span>
            <span className="navbar-link-text">{t('nav.signup')}</span>
          </>
        ) : (
          <>
            <UserPlus size={16} />
            <span className="navbar-link-text">{t('nav.signup')}</span>
          </>
        )}
        {isActive('/signup') && !mobile && (
          <motion.span
            className="navbar-underline"
            layoutId="navbar-underline-signup"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: '100%', opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          />
        )}
      </Link>
    </motion.div>
  );

  const renderProfileLink = (mobile = false) => (
    <motion.div
      key="profile"
      className={mobile ? 'navbar-mobile-item' : undefined}
      whileHover={mobile ? undefined : { scale: 1.08 }}
      whileTap={{ scale: 0.96 }}
      style={{ display: mobile ? 'block' : 'inline-block' }}
      initial={{ opacity: 0, y: mobile ? 8 : -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: mobile ? 0.05 : 0.1 }}
    >
      <Link
        href="/profile"
        className={`navbar-link-new${isActive('/profile') ? ' active' : ''}${mobile ? ' navbar-link-mobile' : ''}`}
        onClick={() => {
          setActivePath('/profile');
          setMenuOpen(false);
        }}
      >
        {mobile ? (
          <>
            <span className="navbar-link-mobile-icon" aria-hidden="true">
              <User size={20} strokeWidth={2} />
            </span>
            <span className="navbar-link-text">{t('nav.profile')}</span>
          </>
        ) : (
          <>
            <User size={16} />
            <span className="navbar-link-text">{t('nav.profile')}</span>
          </>
        )}
        {isActive('/profile') && !mobile && (
          <motion.span
            className="navbar-underline"
            layoutId="navbar-underline-profile"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: '100%', opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          />
        )}
      </Link>
    </motion.div>
  );

  const renderNavLink = ({ to, label, icon: Icon }, mobile = false) => {
    const active = isActive(to);
    return (
      <motion.div
        key={to}
        className={mobile ? 'navbar-mobile-item' : undefined}
        whileHover={mobile ? undefined : { scale: 1.08 }}
        whileTap={{ scale: 0.96 }}
        style={{ display: mobile ? 'block' : 'inline-block' }}
        initial={{ opacity: 0, y: mobile ? 8 : -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: mobile ? 8 : -10 }}
        transition={{ duration: 0.2 }}
      >
        <Link
          href={to}
          className={`navbar-link-new${active ? ' active' : ''}${mobile ? ' navbar-link-mobile' : ''}`}
          onClick={(e) => handleNavClick(to, e)}
        >
          {mobile ? (
            <>
              <span className="navbar-link-mobile-icon" aria-hidden="true">
                <Icon size={20} strokeWidth={2} />
              </span>
              <span className="navbar-link-text">{label}</span>
            </>
          ) : (
            <span className="navbar-link-text">{label}</span>
          )}
          {active && !mobile && (
            <motion.span
              className="navbar-underline"
              layoutId="navbar-underline"
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: '100%', opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            />
          )}
        </Link>
      </motion.div>
    );
  };

  const overlayTop = { top: navHeight };
  const menuPanelStyle = {
    top: navHeight,
    maxHeight: `calc(100dvh - ${navHeight}px)`,
  };

  const mobileMenu = mounted
    ? createPortal(
        <AnimatePresence>
          {menuOpen && (
            <>
              <motion.div
                className="navbar-backdrop"
                aria-hidden="true"
                style={overlayTop}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={closeMenu}
              />
              <motion.div
                id="navbar-mobile-menu"
                className={`navbar-mobile-menu${isArabic ? ' navbar-mobile-menu-rtl' : ''}`}
                dir={isArabic ? 'rtl' : 'ltr'}
                role="dialog"
                aria-modal="true"
                aria-label={t('nav.openMenu')}
                style={menuPanelStyle}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
              >
                <div className="navbar-mobile-links">
                  {navItems.map((item) => renderNavLink(item, true))}
                </div>
                <div className="navbar-mobile-footer">
                  {!user ? renderSignupLink(true) : renderProfileLink(true)}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>,
        document.body
      )
    : null;

  return (
    <nav
      ref={navRef}
      className={`navbar-new${menuOpen ? ' navbar-new--menu-open' : ''}`}
    >
      <div className="navbar-container-new">
        <div className="navbar-header-row">
          <div className="navbar-logo-new">
            <Link href="/" className="logo-link-new" onClick={handleLogoClick}>
              <YafttyLogo variant="navbar" className="navbar-logo-text" />
            </Link>
          </div>

          <button
            type="button"
            className={`navbar-toggle${menuOpen ? ' navbar-toggle--open' : ''}`}
            aria-expanded={menuOpen}
            aria-controls="navbar-mobile-menu"
            aria-label={menuOpen ? t('nav.closeMenu') : t('nav.openMenu')}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span className="navbar-toggle-bar" aria-hidden="true" />
            <span className="navbar-toggle-bar" aria-hidden="true" />
            <span className="navbar-toggle-bar" aria-hidden="true" />
          </button>
        </div>

        <div
          className={`navbar-menu-new navbar-menu-desktop${isArabic ? ' navbar-menu-rtl' : ''}`}
          dir={isArabic ? 'rtl' : 'ltr'}
        >
          {isArabic && user && renderProfileLink()}
          {isArabic && !user && renderSignupLink()}
          <AnimatePresence mode="popLayout">
            {desktopNavItems.map((item) => renderNavLink(item))}
          </AnimatePresence>
          {!isArabic && user && renderProfileLink()}
          {!isArabic && !user && renderSignupLink()}
        </div>
      </div>

      {mobileMenu}
    </nav>
  );
};

export default Navbar;
