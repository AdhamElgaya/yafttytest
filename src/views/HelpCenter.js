'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Youtube, Instagram, Search, MessageCircle, BookOpen, Phone, Mail, ChevronDown, ChevronUp, HelpCircle, Users, Settings, CreditCard } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useTranslations } from '../translations';
import { useChatbot } from '../contexts/ChatbotContext';
import FooterLanguageBlock from '../components/FooterLanguageBlock';
import FooterCopyright from '../components/FooterCopyright';
import YafttyLogo from '../components/YafttyLogo';
import { useLocaleFormat } from '../hooks/useLocaleFormat';
import './HelpCenter.css';

const HelpCenter = () => {
  const { openChatbot } = useChatbot();
  const [activeCategory, setActiveCategory] = useState('general');
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const { currentLanguage } = useLanguage();
  const { t } = useTranslations(currentLanguage);
  const locale = useLocaleFormat();

  const getCategories = (t) => [
    { id: 'general', name: t('help.categories.general'), icon: HelpCircle, color: '#123a8f' },
    { id: 'account', name: t('help.categories.account'), icon: Users, color: '#10b981' },
    { id: 'booking', name: t('help.categories.booking'), icon: BookOpen, color: '#8b5cf6' },
    { id: 'payment', name: t('help.categories.payment'), icon: CreditCard, color: '#f59e0b' },
    { id: 'technical', name: t('help.categories.technical'), icon: Settings, color: '#ef4444' }
  ];

  const getFaqs = (t) => ({
    general: [
      {
        question: t('help.faq.general.whatIsYaftty.question'),
        answer: t('help.faq.general.whatIsYaftty.answer')
      },
      {
        question: t('help.faq.general.howDoesItWork.question'),
        answer: t('help.faq.general.howDoesItWork.answer')
      },
      {
        question: t('help.faq.general.availability.question'),
        answer: t('help.faq.general.availability.answer')
      },
      {
        question: t('help.faq.general.costs.question'),
        answer: t('help.faq.general.costs.answer')
      }
    ],
    account: [
      {
        question: t('help.faq.account.createAccount.question'),
        answer: t('help.faq.account.createAccount.answer')
      },
      {
        question: t('help.faq.account.bothAccountTypes.question'),
        answer: t('help.faq.account.bothAccountTypes.answer')
      },
      {
        question: t('help.faq.account.addBanner.question'),
        answer: t('help.faq.account.addBanner.answer')
      },
      {
        question: t('help.faq.account.forgotPassword.question'),
        answer: t('help.faq.account.forgotPassword.answer')
      }
    ],
    booking: [
      {
        question: t('help.faq.booking.howToBook.question'),
        answer: t('help.faq.booking.howToBook.answer')
      },
      {
        question: t('help.faq.booking.cancelBooking.question'),
        answer: t('help.faq.booking.cancelBooking.answer')
      },
      {
        question: t('help.faq.booking.approvalTime.question'),
        answer: t('help.faq.booking.approvalTime.answer')
      },
      {
        question: t('help.faq.booking.adFormats.question'),
        answer: t('help.faq.booking.adFormats.answer')
      }
    ],
    payment: [
      {
        question: t('help.faq.payment.paymentMethods.question'),
        answer: t('help.faq.payment.paymentMethods.answer')
      },
      {
        question: t('help.faq.payment.whenPaid.question'),
        answer: t('help.faq.payment.whenPaid.answer')
      },
      {
        question: t('help.faq.payment.hiddenFees.question'),
        answer: t('help.faq.payment.hiddenFees.answer')
      },
      {
        question: t('help.faq.payment.security.question'),
        answer: t('help.faq.payment.security.answer')
      }
    ],
    technical: [
      {
        question: t('help.faq.technical.mapNotLoading.question'),
        answer: t('help.faq.technical.mapNotLoading.answer')
      },
      {
        question: t('help.faq.technical.cantUpload.question'),
        answer: t('help.faq.technical.cantUpload.answer')
      },
      {
        question: t('help.faq.technical.bookingStuck.question'),
        answer: t('help.faq.technical.bookingStuck.answer')
      },
      {
        question: t('help.faq.technical.noEmails.question'),
        answer: t('help.faq.technical.noEmails.answer')
      }
    ]
  });

  // Flatten all FAQs for search
  const allFaqs = Object.entries(getFaqs(t)).flatMap(([category, faqsArr]) =>
    faqsArr.map(faq => ({ ...faq, category }))
  );

  // Search handler
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (value.trim() === "") {
      setSearchResults([]);
      return;
    }
    const lower = value.toLowerCase();
    const results = allFaqs.filter(faq =>
      faq.question.toLowerCase().includes(lower) ||
      faq.answer.toLowerCase().includes(lower)
    );
    setSearchResults(results);
  };

  const getContactMethods = (t) => [
    {
      icon: Phone,
      title: t('help.contact.phone.title'),
      description: t('help.contact.phone.description'),
      action: "+201222524672",
      color: "#123a8f",
      type: "phone"
    },
    {
      icon: Mail,
      title: t('help.contact.email.title'),
      description: t('help.contact.email.description'),
      action: "yaftty.llc@gmail.com",
      color: "#10b981",
      type: "email"
    },
    {
      icon: MessageCircle,
      title: t('help.contact.liveChat.title'),
      description: t('help.contact.liveChat.description'),
      action: t('help.contact.liveChat.action'),
      color: "#8b5cf6",
      type: "chat"
    }
  ];

  return (
    <div className="help-center-new">
      {/* Hero Section */}
      <motion.section
        className="help-hero-new"
        initial={{ y: 60, opacity: 0, scale: 0.98 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <motion.div 
          className="hero-background-pattern"
          style={{ y }}
        ></motion.div>
        <div className="help-hero-content">
          <motion.div
            className="hero-badge"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            whileHover={{ scale: 1.05, rotate: 2 }}
          >
            <HelpCircle size={16} />
            <span>{t('help.badge')}</span>
          </motion.div>
          <motion.h1 
            className="help-title-new"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            {t('help.hero.title1')} <span className="gradient-text">{t('help.hero.title2')}</span>
          </motion.h1>
          <motion.p 
            className="help-desc-new"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            {t('help.hero.description')}
          </motion.p>
          
          {/* Search Bar */}
          <motion.div
            className="search-container"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <div className="search-bar">
              <Search size={20} />
              <input 
                type="text" 
                placeholder={t('help.search.placeholder')}
                className="search-input"
                value={searchQuery}
                onChange={handleSearch}
              />
            </div>
          </motion.div>

          {/* AI Assistant Button */}
          <motion.div
            className="ai-assistant-container"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <motion.button
              className="ai-assistant-btn"
              onClick={() => openChatbot()}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <MessageCircle size={20} />
              <span>Start Live Chat</span>
            </motion.button>
            <p className="ai-assistant-desc">Get instant help from our support team</p>
          </motion.div>
              </div>
      </motion.section>

      {searchQuery && (
        <section className="help-search-results" style={{ margin: '32px 0 0 0' }}>
          <div className="help-container">
            <motion.div
              className="section-header section-header-vertical"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2>{t('help.search.results.title')}</h2>
              <p>{t('help.search.results.for')} "{searchQuery}"</p>
            </motion.div>
            <div className="faqs-list">
              {searchResults.length === 0 ? (
                <div style={{ color: '#64748b', fontSize: 18, padding: 24 }}>{t('help.search.results.noResults')}</div>
              ) : (
                searchResults.map((faq, idx) => (
                  <motion.div
                    key={faq.category + idx + faq.question}
                    className="faq-item"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: idx * 0.05 }}
                    style={{ borderLeft: '4px solid #123a8f', marginBottom: 18, background: '#f8fafc', borderRadius: 10, padding: 18 }}
                  >
                    <div style={{ color: '#123a8f', fontWeight: 700, fontSize: 15, marginBottom: 4, textTransform: 'capitalize' }}>{faq.category} FAQ</div>
                    <h3 style={{ fontWeight: 700, fontSize: 18, marginBottom: 6 }}>
                      {faq.question.split(new RegExp(`(${searchQuery})`, 'gi')).map((part, i) =>
                        part.toLowerCase() === searchQuery.toLowerCase() ? <mark key={i} style={{ background: '#fef08a', color: '#b45309', padding: 0 }}>{part}</mark> : part
                      )}
                    </h3>
                    <div style={{ color: '#475569', fontSize: 16 }}>
                      {faq.answer.split(new RegExp(`(${searchQuery})`, 'gi')).map((part, i) =>
                        part.toLowerCase() === searchQuery.toLowerCase() ? <mark key={i} style={{ background: '#fef08a', color: '#b45309', padding: 0 }}>{part}</mark> : part
                      )}
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </section>
      )}

      {/* Categories Section */}
      <section className="help-categories">
        <div className="help-container">
          <motion.div
            className="section-header section-header-vertical"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2>{t('help.categories.title')}</h2>
            <p>{t('help.categories.subtitle')}</p>
          </motion.div>
          
          <div className="categories-grid">
            {getCategories(t).map((category, index) => (
              <motion.div
                key={category.id}
                className={`category-card ${activeCategory === category.id ? 'active' : ''}`}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ 
                  y: -8, 
                  scale: 1.03,
                  boxShadow: `0 12px 40px ${category.color}15`
                }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveCategory(category.id)}
              >
                <motion.div 
                  className="category-icon"
                  style={{ background: `linear-gradient(135deg, ${category.color}, ${category.color}dd)` }}
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                >
                  <category.icon size={32} />
                </motion.div>
                <h3>{category.name}</h3>
                <span className="faq-count">
                  {locale.n(getFaqs(t)[category.id].length)} {t('help.categories.faqs')}
                </span>
              </motion.div>
            ))}
                      </div>
                    </div>
      </section>

      {/* FAQs Section */}
      <section className="help-faqs">
        <div className="help-container">
          <motion.div
            className="section-header section-header-vertical"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2>{t('help.faq.title')}</h2>
            <p>{t('help.faq.subtitle')}</p>
          </motion.div>
          
          <div className="faqs-list">
            {getFaqs(t)[activeCategory].map((faq, index) => (
              <motion.div
                key={index}
                className="faq-item"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -2 }}
              >
                <motion.div
                  className="faq-question"
                  onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <h3>{faq.question}</h3>
                  <motion.div
                    className="faq-toggle"
                    animate={{ rotate: expandedFaq === index ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {expandedFaq === index ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </motion.div>
                </motion.div>
                <motion.div
                  className="faq-answer"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ 
                    height: expandedFaq === index ? 'auto' : 0,
                    opacity: expandedFaq === index ? 1 : 0
                  }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                >
                  <p>{faq.answer}</p>
                </motion.div>
              </motion.div>
            ))}
                      </div>
                    </div>
      </section>

      {/* Contact Section */}
      <section className="help-contact">
        <div className="help-container">
          <motion.div
            className="section-header section-header-vertical"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="section-badge">
              <MessageCircle size={16} />
              <span>{t('help.contact.stillNeedHelp')}</span>
              </div>
            <h2>{t('help.contact.getInTouch')}</h2>
            <p>{t('help.contact.description')}</p>
          </motion.div>
          
          <div className="contact-grid">
            {getContactMethods(t).map((method, index) => (
              <motion.div
                key={method.title}
                className="contact-card"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ 
                  y: -12, 
                  scale: 1.03,
                  boxShadow: `0 12px 40px ${method.color}15`
                }}
                whileTap={{ scale: 0.98 }}
              >
                <motion.div 
                  className="contact-icon"
                  style={{ background: `linear-gradient(135deg, ${method.color}, ${method.color}dd)` }}
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                >
                  <method.icon size={32} />
                </motion.div>
                <h3>{method.title}</h3>
                <p>{method.description}</p>
                {method.type === 'email' ? (
                  <motion.a
                    href={`mailto:${method.action}`}
                    className="contact-action"
                    style={{ color: method.color }}
                    whileHover={{ scale: 1.05, x: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <span>{method.action}</span>
                  </motion.a>
                ) : method.type === 'phone' ? (
                  <motion.a
                    href={`tel:${method.action}`}
                    className="contact-action"
                    style={{ color: method.color }}
                    whileHover={{ scale: 1.05, x: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <span>{method.action}</span>
                  </motion.a>
                ) : method.type === 'chat' ? (
                  <motion.button
                    onClick={() => openChatbot()}
                    className="contact-action"
                    style={{ 
                      color: method.color,
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: 0,
                      fontSize: 'inherit',
                      fontFamily: 'inherit'
                    }}
                    whileHover={{ scale: 1.05, x: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <span>{method.action}</span>
                  </motion.button>
                ) : (
                  <motion.div 
                    className="contact-action"
                    style={{ color: method.color }}
                    whileHover={{ scale: 1.05, x: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <span>{method.action}</span>
                  </motion.div>
                )}
              </motion.div>
            ))}
              </div>
            </div>
      </section>

      {/* Footer */}
      <footer className="footer-new footer-modern">
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
            <motion.a 
              href="https://www.youtube.com/@yaftty" 
              target="_blank" 
              rel="noopener noreferrer" 
              aria-label="YouTube"
              whileHover={{ scale: 1.2, y: -2 }}
              whileTap={{ scale: 0.9 }}
            >
              <Youtube size={22} />
            </motion.a>
            <motion.a 
              href="https://www.instagram.com/yaftty.co/" 
              target="_blank" 
              rel="noopener noreferrer" 
              aria-label="Instagram"
              whileHover={{ scale: 1.2, y: -2 }}
              whileTap={{ scale: 0.9 }}
            >
              <Instagram size={22} />
            </motion.a>
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

export default HelpCenter; 