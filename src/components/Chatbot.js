'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, MessageCircle, X, HelpCircle, Paperclip, Headphones } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { chatFetch, getActiveProfileId } from '../lib/chatClient';
import { subscribeToChatMessages } from '../lib/chatRealtime';
import './Chatbot.css';

const FALLBACK_POLL_MS = 90_000;

function messageRole(message) {
  if (message.sender === 'system' || message.sender === 'error') return 'system';
  if (message.isFromSupport) return 'support';
  return 'customer';
}

function formatMessageTime(value) {
  const d = value ? new Date(value) : new Date();
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

const Chatbot = ({ isOpen, setIsOpen }) => {
  const { user } = useAuth();
  const { currentLanguage } = useLanguage();
  const isAr = currentLanguage === 'ar';
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [chatId, setChatId] = useState(null);
  const [attachments, setAttachments] = useState([]);
  const messagesEndRef = useRef(null);
  const loadConversationRef = useRef(null);

  const copy = {
    title: isAr ? 'دعم يافطتي' : 'Yaftty Support',
    subtitleLoggedIn: isAr ? 'فريق الدعم' : 'Support team',
    subtitleGuest: isAr ? 'سجّل الدخول للمحادثة' : 'Sign in to chat',
    emptyTitle: isAr ? 'راسل فريق الدعم' : 'Message our support team',
    emptyHint: isAr
      ? 'نرد على استفساراتك حول الحجوزات واليافطات والحساب.'
      : 'We reply to questions about bookings, banners, and your account.',
    loading: isAr ? 'جاري تحميل المحادثة…' : 'Loading conversation…',
    placeholder: isAr ? 'اكتب رسالتك…' : 'Type your message…',
    placeholderGuest: isAr ? 'سجّل الدخول للمحادثة' : 'Sign in to chat',
    sendFailed: isAr ? 'تعذّر إرسال الرسالة. حاول مرة أخرى.' : 'Failed to send message. Please try again.',
    connectionError: isAr
      ? 'تعذّر الإرسال. تحقق من الاتصال وحاول مرة أخرى.'
      : 'Failed to send. Check your connection and try again.',
    supportLabel: isAr ? 'الدعم' : 'Support',
    youLabel: isAr ? 'أنت' : 'You',
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!isOpen) return undefined;

    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    if (!isMobile) return undefined;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen]);

  loadConversationRef.current = async ({ silent = false } = {}) => {
    if (!user) return;
    try {
      if (!silent) setIsLoading(true);
      const profileId = getActiveProfileId();
      const query = profileId ? `?profileId=${encodeURIComponent(profileId)}` : '';
      const response = await chatFetch(`/api/chat/conversation${query}`);
      const data = await response.json();

      if (data.success) {
        setMessages(data.messages || []);
        setChatId(data.chat?.id || data.chat?._id || null);
      } else if (response.status === 401) {
        setMessages([]);
        setChatId(null);
      } else if (!silent) {
        toast.error(data.error || copy.connectionError);
      }
    } catch (error) {
      console.error('Failed to load conversation:', error);
      if (!silent) toast.error(copy.connectionError);
    } finally {
      if (!silent) setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isOpen || !user) return;
    loadConversationRef.current?.({ silent: false });
  }, [isOpen, user]);

  useEffect(() => {
    if (!isOpen || !user || !chatId) return;

    let fallbackInterval = null;
    let realtimeActive = false;

    const startFallbackPoll = () => {
      if (fallbackInterval) return;
      fallbackInterval = setInterval(() => {
        if (document.visibilityState === 'visible' && isOpen) {
          loadConversationRef.current?.({ silent: true });
        }
      }, FALLBACK_POLL_MS);
    };

    const stopFallbackPoll = () => {
      if (fallbackInterval) {
        clearInterval(fallbackInterval);
        fallbackInterval = null;
      }
    };

    const unsubscribe = subscribeToChatMessages(chatId, {
      onInsert: (msg) => {
        setMessages((prev) => {
          const key = msg.id || msg._id;
          if (prev.some((m) => (m.id || m._id) === key)) return prev;
          return [...prev, msg];
        });
      },
      onStatus: (status) => {
        if (status === 'SUBSCRIBED') {
          realtimeActive = true;
          stopFallbackPoll();
        } else if (
          status === 'CHANNEL_ERROR' ||
          status === 'TIMED_OUT' ||
          status === 'CLOSED' ||
          status === 'UNSUPPORTED'
        ) {
          realtimeActive = false;
          startFallbackPoll();
        }
      },
    });

    if (!realtimeActive) {
      startFallbackPoll();
    }

    const onVisibility = () => {
      if (document.visibilityState === 'visible' && isOpen && !realtimeActive) {
        loadConversationRef.current?.({ silent: true });
      }
    };
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      unsubscribe();
      stopFallbackPoll();
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [isOpen, user, chatId]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || !user || isSending) return;

    const messageText = inputValue.trim();
    setInputValue('');
    setIsSending(true);

    const optimistic = {
      id: `temp-${Date.now()}`,
      message: messageText,
      isFromSupport: false,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, optimistic]);

    if (attachments.length > 0) {
      setMessages((prev) => prev.filter((m) => m.id !== optimistic.id));
      toast.error(
        isAr
          ? 'المرفقات غير مدعومة حالياً. أرسل رسالة نصية.'
          : 'File attachments are not supported yet. Send a text message.'
      );
      setIsSending(false);
      return;
    }

    try {
      const profileId = getActiveProfileId();
      const response = await chatFetch('/api/chat/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: messageText,
          chatId,
          profileId,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setMessages((prev) =>
          prev.filter((m) => m.id !== optimistic.id).concat(data.message)
        );
        setChatId(data.chat?.id || data.chat?._id || chatId);
        setAttachments([]);
      } else {
        setMessages((prev) => prev.filter((m) => m.id !== optimistic.id));
        toast.error(data.message || data.error || copy.sendFailed);
      }
    } catch (error) {
      console.error('Send message error:', error);
      setMessages((prev) => prev.filter((m) => m.id !== optimistic.id));
      toast.error(copy.connectionError);
    } finally {
      setIsSending(false);
    }
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setAttachments((prev) => [...prev, ...files]);
  };

  const removeAttachment = (index) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const renderMessageBody = (message) => {
    const text = message.message || message.text || '';
    const attachments = message.attachments || [];

    return (
      <>
        <p>{text || (isAr ? '—' : '—')}</p>
        {attachments.length > 0 && (
          <div className="message-attachments">
            {attachments.map((att, index) => (
              <a
                key={index}
                href={att.url}
                target="_blank"
                rel="noopener noreferrer"
                className="message-attachment-link"
              >
                {att.originalName}
              </a>
            ))}
          </div>
        )}
        <span className="message-time">
          {formatMessageTime(message.createdAt || message.timestamp)}
        </span>
      </>
    );
  };

  return (
    <>
      <motion.button
        type="button"
        className={`chat-toggle${isOpen ? ' chat-toggle--open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? 'Close support chat' : 'Open support chat'}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 2, duration: 0.3 }}
      >
        {isOpen ? <X size={22} /> : <MessageCircle size={22} />}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="chat-window"
            dir={isAr ? 'rtl' : 'ltr'}
            lang={currentLanguage}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.22 }}
          >
            <div className="chat-header">
              <div className="chat-header-content">
                <div className="chat-avatar" aria-hidden>
                  <Headphones size={20} />
                </div>
                <div className="chat-info">
                  <h3>{copy.title}</h3>
                  <span className="chat-status">
                    {user ? copy.subtitleLoggedIn : copy.subtitleGuest}
                  </span>
                </div>
              </div>
              <div className="chat-header-actions">
                <Link href="/help" className="help-link" aria-label="Help center">
                  <HelpCircle size={18} />
                </Link>
                <button
                  type="button"
                  className="chat-close"
                  onClick={() => setIsOpen(false)}
                  aria-label="Close"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="chat-messages">
              {isLoading ? (
                <p className="chat-placeholder">{copy.loading}</p>
              ) : messages.length === 0 ? (
                <div className="chat-empty">
                  <p className="chat-empty-title">{copy.emptyTitle}</p>
                  <p className="chat-empty-hint">{copy.emptyHint}</p>
                </div>
              ) : (
                <AnimatePresence initial={false}>
                  {messages.map((message) => {
                    const role = messageRole(message);
                    const key = message._id || message.id;

                    if (role === 'system') {
                      return (
                        <motion.div
                          key={key}
                          className="chat-message-row chat-message-row--system"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                        >
                          <div className="message-bubble message-bubble--system">
                            {renderMessageBody(message)}
                          </div>
                        </motion.div>
                      );
                    }

                    const isSupport = role === 'support';
                    return (
                      <motion.div
                        key={key}
                        className={`chat-message-row ${
                          isSupport
                            ? 'chat-message-row--support'
                            : 'chat-message-row--customer'
                        }`}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <div className="message-meta">
                          {isSupport ? copy.supportLabel : copy.youLabel}
                        </div>
                        <div
                          className={`message-bubble ${
                            isSupport
                              ? 'message-bubble--support'
                              : 'message-bubble--customer'
                          }`}
                        >
                          {renderMessageBody(message)}
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="chat-input">
              {attachments.length > 0 && (
                <div className="chat-attachments-preview">
                  {attachments.map((file, index) => (
                    <div key={index} className="chat-attachment-chip">
                      <span>{file.name}</span>
                      <button
                        type="button"
                        onClick={() => removeAttachment(index)}
                        aria-label="Remove attachment"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <div className="chat-input-row">
                <input
                  type="file"
                  id="chat-file-input"
                  multiple
                  accept="image/*,.pdf,.doc,.docx,.txt"
                  onChange={handleFileUpload}
                  className="chat-file-input"
                />
                <label htmlFor="chat-file-input" className="chat-attach-btn">
                  <Paperclip size={18} />
                </label>
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={user ? copy.placeholder : copy.placeholderGuest}
                  className="chat-input-field"
                  disabled={!user || isSending}
                />
                <button
                  type="button"
                  className="chat-send"
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || !user || isSending}
                  aria-label="Send message"
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Chatbot;
