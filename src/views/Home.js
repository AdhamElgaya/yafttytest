'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import './Home.css';
import './Home.mobile.css';
import './Home.desktop.css';
import { motion } from 'framer-motion';
import { UserPlus, MapPin, FileText, BarChart, Building2, ClipboardList, CheckCircle, DollarSign, Youtube, Instagram, CreditCard } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useTranslations } from '../translations';
import FooterLanguageBlock from '../components/FooterLanguageBlock';
import FooterCopyright from '../components/FooterCopyright';
import YafttyLogo from '../components/YafttyLogo';

const getFeatures = (t) => [
  {
    icon: '⚡',
    title: t('home.features.discover.title'),
    description: t('home.features.discover.description')
  },
  {
    icon: '🔒',
    title: t('home.features.book.title'),
    description: t('home.features.book.description')
  },
  {
    icon: '🌍',
    title: t('home.features.manage.title'),
    description: t('home.features.manage.description')
  }
];

const getAdvertiserSteps = (t) => [
  { icon: <UserPlus size={22} />, text: t('home.steps.advertisers.steps.0') },
  { icon: <MapPin size={22} />, text: t('home.steps.advertisers.steps.1') },
  { icon: <FileText size={22} />, text: t('home.steps.advertisers.steps.2') },
  { icon: <BarChart size={22} />, text: t('home.steps.advertisers.steps.3') },
];

const getOwnerSteps = (t) => [
  { icon: <Building2 size={22} />, text: t('home.steps.owners.steps.0') },
  { icon: <CreditCard size={22} />, text: t('home.steps.owners.steps.1') },
  { icon: <ClipboardList size={22} />, text: t('home.steps.owners.steps.2') },
  { icon: <CheckCircle size={22} />, text: t('home.steps.owners.steps.3') },
  { icon: <DollarSign size={22} />, text: t('home.steps.owners.steps.4') },
];

const Home = () => {
  const { currentLanguage } = useLanguage();
  const { t } = useTranslations(currentLanguage);
  const isArabic = currentLanguage === 'ar';
  const btnArrow = '→';

  const [scrollHintVisible, setScrollHintVisible] = useState(true);
  const hasReachedAboutRef = useRef(false);

  const scrollToAbout = (e) => {
    e.preventDefault();
    hasReachedAboutRef.current = true;
    setScrollHintVisible(false);
    document.getElementById('home-about')?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const aboutSection = document.getElementById('home-about');
    if (!aboutSection) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          hasReachedAboutRef.current = true;
        }
        setScrollHintVisible(!hasReachedAboutRef.current);
      },
      { threshold: 0, rootMargin: '0px 0px -10% 0px' }
    );

    observer.observe(aboutSection);
    return () => observer.disconnect();
  }, []);

  const heroMapCard = (
    <div className="hero-card">
      <div className="card-header">
        <div className="card-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
      <div className="card-content">
        <div className="map-grid">
          <div className="map-cell active"></div>
          <div className="map-cell"></div>
          <div className="map-cell active"></div>
          <div className="map-cell"></div>
          <div className="map-cell active"></div>
          <div className="map-cell"></div>
          <div className="map-cell"></div>
          <div className="map-cell active"></div>
          <div className="map-cell"></div>
        </div>
        <div className="map-pins">
          <div className="pin pin-1"></div>
          <div className="pin pin-2"></div>
          <div className="pin pin-3"></div>
        </div>
      </div>
    </div>
  );

  const heroContent = (
    <div className={`hero-content-new${isArabic ? ' hero-content--ar' : ''}`}>
      <div className="hero-badge">
        <span>🚀</span>
        {t('home.hero.badge')}
      </div>
      <h1 className="hero-title-new">
        {t('home.hero.title').split(/<br\s*\/?>/i).map((line, i) => (
          <React.Fragment key={i}>
            {i > 0 && <br />}
            {line}
          </React.Fragment>
        ))}
      </h1>
      <p className="hero-desc-new">{t('home.hero.subtitle')}</p>
      <div className={`hero-actions-new${isArabic ? ' hero-actions--ar' : ''}`}>
        <motion.div
          className="hero-action-item"
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link href="/signup" className="btn-primary-new">
            {t('home.hero.cta')}
            <span className={`btn-icon${isArabic ? ' btn-icon--rtl' : ''}`}>{btnArrow}</span>
          </Link>
        </motion.div>
        <motion.div
          className="hero-action-item"
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
        >
          <a href="#home-about" className="btn-secondary-new" onClick={scrollToAbout}>
            {t('home.hero.learnMore')}
            <span className={`btn-icon${isArabic ? ' btn-icon--rtl' : ''}`}>{btnArrow}</span>
          </a>
        </motion.div>
      </div>
    </div>
  );
  
  return (
    <div className={`home-new${isArabic ? ' home-new--ar' : ''}`}>
      <div className="home-first-screen">
        <motion.section
          className="hero-new"
          initial={{ y: 16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
        >
          <div className={`hero-container${isArabic ? ' hero-container--ar' : ''}`}>
            {heroContent}
            <div className="hero-visual-new" aria-hidden="true">
              {heroMapCard}
            </div>
          </div>
        </motion.section>
      </div>

      <a
        href="#home-about"
        className={`hero-scroll-indicator${scrollHintVisible ? '' : ' hero-scroll-indicator--hidden'}`}
        onClick={scrollToAbout}
        aria-label={t('home.hero.scrollHint')}
      >
        <span className="hero-scroll-indicator-mouse" aria-hidden="true">
          <span className="hero-scroll-indicator-wheel" />
        </span>
      </a>

      {/* About — below first viewport; revealed on scroll */}
      <section className="content-new" id="home-about">
        <h2 className="section-title-new">{t('about.title')}</h2>
        <p className="content-desc-new">
          {t('about.description')}
        </p>
        <div className="content-grid-new">
          <div className="content-card-new">
            <h3>{t('home.content.advertisers.title')}</h3>
            <p>{t('home.content.advertisers.description')}</p>
          </div>
          <div className="content-card-new">
            <h3>{t('home.content.owners.title')}</h3>
            <p>{t('home.content.owners.description')}</p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-new">
        <h2 className="section-title-new">{t('home.features.title')}</h2>
        <div className="features-grid-new">
          {getFeatures(t).map((feature, idx) => (
            <div className="feature-card-new" key={feature.title} style={{ animationDelay: `${idx * 0.1}s` }}>
              <div className="feature-icon-new">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Steps to Get Started Section */}
      <section className="steps-section-new steps-section-gradient">
        <h2 className="section-title-new">{t('home.steps.title')}</h2>
        <div className="steps-grid-new">
          <div className={`steps-card-new${isArabic ? ' steps-card-new--ar' : ''}`}>
            <h3>{t('home.steps.advertisers.title')}</h3>
            <motion.ol 
              className="steps-list-new" 
              initial="hidden" 
              whileInView="visible" 
              viewport={{ once: true }} 
              variants={{ visible: { transition: { staggerChildren: 0.13 } } }}
            >
              {getAdvertiserSteps(t).map((step, idx) => (
                <motion.li
                  className="step-item-new"
                  key={idx}
                  variants={{ hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                >
                  <span className="step-number-new step-icon-new">{step.icon}</span>
                  <span>{step.text}</span>
                </motion.li>
              ))}
            </motion.ol>
          </div>
          <div className={`steps-card-new${isArabic ? ' steps-card-new--ar' : ''}`}>
            <h3>{t('home.steps.owners.title')}</h3>
            <motion.ol 
              className="steps-list-new" 
              initial="hidden" 
              whileInView="visible" 
              viewport={{ once: true }} 
              variants={{ visible: { transition: { staggerChildren: 0.13 } } }}
            >
              {getOwnerSteps(t).map((step, idx) => (
                <motion.li
                  className="step-item-new"
                  key={idx}
                  variants={{ hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                >
                  <span className="step-number-new step-icon-new">{step.icon}</span>
                  <span>{step.text}</span>
                </motion.li>
              ))}
            </motion.ol>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer-new footer-modern">
        {/* Removed the footer-wave SVG for a cleaner look */}
        <div className="footer-content-new footer-content-modern">
          <div className="footer-brand">
            <YafttyLogo variant="footer" className="footer-logo-new" />
            <span className="footer-tagline">
              {currentLanguage === 'ar' ? 'معلن. صاحب يافطة. اتصل.' : 'Advertiser. Banner Owner. Connect.'}
            </span>
          </div>
          <div className="footer-nav-links">
            <Link href="/help">{t('nav.help')}</Link>
            <Link href="/map">{t('nav.map')}</Link>
            <Link href="/signup">{t('nav.signup')}</Link>
            <Link href="/login">{t('nav.login')}</Link>
          </div>
          <div className="footer-social">
            <a href="https://www.youtube.com/@yaftty" target="_blank" rel="noopener noreferrer" aria-label="YouTube"><Youtube size={22} /></a>
            <a href="https://www.instagram.com/yaftty.co/" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><Instagram size={22} /></a>
          </div>
        </div>
        <div className="footer-bottom">
          <FooterLanguageBlock />
          <FooterCopyright />
        </div>
      </footer>
    </div>
  );
};

export default Home; 