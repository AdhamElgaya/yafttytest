'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageCircle,
  Send,
  Clock,
  CheckCircle,
  AlertCircle,
  Search,
  Lock,
  ArrowLeft,
  Trash2,
  RefreshCw,
} from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { adminFetch, setAdminSecret, getAdminSecret } from '../lib/adminClient';
import { getTranslation, translations } from '../translations';
import './AdminDashboard.css';
import './AdminChat.css';

function adminTr(key) {
  return getTranslation(translations.en, key) || key;
}

const AdminChat = () => {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [loadError, setLoadError] = useState('');
  const [needsSecret, setNeedsSecret] = useState(false);
  const [secretInput, setSecretInput] = useState('');
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const messagesEndRef = useRef(null);
  const loadChatsRef = useRef(null);
  const loadMessagesRef = useRef(null);
  const prevMessageCountRef = useRef(0);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (messages.length > prevMessageCountRef.current) {
      scrollToBottom();
    }
    prevMessageCountRef.current = messages.length;
  }, [messages]);

  loadChatsRef.current = async ({ silent = false } = {}) => {
    try {
      if (!silent) setIsLoading(true);
      setLoadError('');
      const response = await adminFetch(`/api/admin/chat/chats?status=${encodeURIComponent(filter)}`);
      const data = await response.json();

      if (response.status === 401) {
        setNeedsSecret(true);
        setChats([]);
        setSelectedChat(null);
        setMessages([]);
        setLoadError(data.error || adminTr('admin.errors.secretRequired'));
        return;
      }

      if (!response.ok || !data.success) {
        setLoadError(data.error || 'Failed to load chats');
        setChats([]);
        return;
      }

      setNeedsSecret(false);
      const list = data.chats || [];
      setChats(list);
      if (list.length > 0) {
        setSelectedChat((prev) => {
          if (prev) {
            const updated = list.find((c) => c._id === prev._id);
            if (updated) return updated;
          }
          return list[0];
        });
      } else {
        setSelectedChat(null);
        setMessages([]);
      }
    } catch (error) {
      console.error('Failed to load chats:', error);
      setLoadError(adminTr('admin.errors.apiUnreachable'));
    } finally {
      if (!silent) setIsLoading(false);
    }
  };

  loadMessagesRef.current = async (chatId, { silent = false } = {}) => {
    if (!chatId) return;
    try {
      const response = await adminFetch(`/api/admin/chat/${chatId}`);
      const data = await response.json();
      if (data.success) {
        setMessages(data.messages || []);
        if (data.chat) {
          setSelectedChat((prev) =>
            prev?._id === data.chat._id ? { ...prev, ...data.chat } : data.chat
          );
        }
      } else if (!silent) {
        toast.error(data.error || 'Failed to load messages');
      }
    } catch (error) {
      console.error('Failed to load messages:', error);
      if (!silent) toast.error('Failed to load messages');
    }
  };

  useEffect(() => {
    if (needsSecret) return;

    loadChatsRef.current?.({ silent: false });

    const tick = () => {
      if (document.visibilityState === 'visible') {
        loadChatsRef.current?.({ silent: true });
      }
    };

    const listInterval = setInterval(tick, 45_000);
    document.addEventListener('visibilitychange', tick);

    return () => {
      clearInterval(listInterval);
      document.removeEventListener('visibilitychange', tick);
    };
  }, [filter, needsSecret]);

  useEffect(() => {
    if (!selectedChat || needsSecret) return;

    const chatId = selectedChat._id;
    loadMessagesRef.current?.(chatId, { silent: false });

    const tick = () => {
      if (document.visibilityState === 'visible') {
        loadMessagesRef.current?.(chatId, { silent: true });
      }
    };

    const messagesInterval = setInterval(tick, 20_000);
    document.addEventListener('visibilitychange', tick);

    return () => {
      clearInterval(messagesInterval);
      document.removeEventListener('visibilitychange', tick);
    };
  }, [selectedChat?._id, needsSecret]);

  const saveSecretAndReload = () => {
    setAdminSecret(secretInput.trim());
    setNeedsSecret(false);
    loadChatsRef.current?.();
  };

  const sendReply = async () => {
    if (!newMessage.trim() || !selectedChat) return;

    try {
      setIsSending(true);
      const response = await adminFetch('/api/admin/chat/reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chatId: selectedChat._id,
          message: newMessage.trim(),
        }),
      });

      const data = await response.json();
      if (data.success) {
        setNewMessage('');
        loadMessagesRef.current?.(selectedChat._id, { silent: true });
        loadChatsRef.current?.({ silent: true });
      } else {
        toast.error(data.message || data.error || 'Failed to send reply');
      }
    } catch (error) {
      console.error('Failed to send reply:', error);
      toast.error('Failed to send reply. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  const refreshChat = async () => {
    if (isRefreshing || needsSecret) return;
    setIsRefreshing(true);
    try {
      await loadChatsRef.current?.({ silent: true });
      if (selectedChat?._id) {
        await loadMessagesRef.current?.(selectedChat._id, { silent: true });
      }
    } catch (error) {
      console.error('Refresh failed:', error);
      toast.error('Failed to refresh');
    } finally {
      setIsRefreshing(false);
    }
  };

  const deleteChat = async () => {
    if (!selectedChat || isDeleting) return;

    const name = selectedChat.user?.fullName || 'this customer';
    const confirmed = window.confirm(
      `Delete the entire chat with ${name}?\n\nAll messages will be removed for you and the customer. This cannot be undone.`
    );
    if (!confirmed) return;

    const chatId = selectedChat._id;
    try {
      setIsDeleting(true);
      const response = await adminFetch(`/api/admin/chat/${chatId}`, { method: 'DELETE' });
      const data = await response.json();

      if (data.success) {
        toast.success('Chat deleted');
        setSelectedChat(null);
        setMessages([]);
        setNewMessage('');
        await loadChatsRef.current?.({ silent: true });
      } else {
        toast.error(data.error || 'Failed to delete chat');
      }
    } catch (error) {
      console.error('Failed to delete chat:', error);
      toast.error('Failed to delete chat');
    } finally {
      setIsDeleting(false);
    }
  };

  const updateChatStatus = async (chatId, status) => {
    try {
      const response = await adminFetch(`/api/admin/chat/${chatId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      const data = await response.json();
      if (data.success) {
        loadChatsRef.current?.();
        if (selectedChat && selectedChat._id === chatId) {
          setSelectedChat(data.chat);
        }
      } else {
        toast.error(data.error || 'Failed to update status');
      }
    } catch (error) {
      console.error('Failed to update chat status:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'open':
        return '#10b981';
      case 'closed':
        return '#6b7280';
      default:
        return '#6b7280';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'open':
        return <CheckCircle size={16} />;
      case 'closed':
        return <AlertCircle size={16} />;
      default:
        return <Clock size={16} />;
    }
  };

  const filteredChats = chats.filter((chat) => {
    if (!searchTerm) return true;
    const q = searchTerm.toLowerCase();
    return (
      chat.user.fullName.toLowerCase().includes(q) ||
      chat.user.email.toLowerCase().includes(q)
    );
  });

  const formatListTime = (value) => {
    if (!value) return '—';
    return new Date(value).toLocaleString([], {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (needsSecret) {
    return (
      <div className="admin-chat-page" dir="ltr" lang="en">
        <div className="admin-chat-secret-wrap">
          <Link href="/admin" className="admin-chat-back">
            <ArrowLeft size={18} aria-hidden />
            Back to Admin
          </Link>
          <form
            className="admin-secret-form"
            onSubmit={(e) => {
              e.preventDefault();
              saveSecretAndReload();
            }}
          >
            <label htmlFor="admin-chat-secret">
              <Lock size={16} aria-hidden />
              {adminTr('admin.secretLabel')}
            </label>
            <input
              id="admin-chat-secret"
              type="password"
              value={secretInput}
              onChange={(e) => setSecretInput(e.target.value)}
              placeholder={adminTr('admin.secretPlaceholder')}
              autoComplete="off"
            />
            <button type="submit">{adminTr('admin.unlockDashboard')}</button>
            {!getAdminSecret() && (
              <p className="admin-chat-secret-hint">
                Enter the same admin secret you use on the main admin dashboard.
              </p>
            )}
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-chat-page" dir="ltr" lang="en">
      <div className="admin-chat-layout">
        <aside className="admin-chat-sidebar">
          <div className="admin-chat-sidebar-head">
            <Link href="/admin" className="admin-chat-back">
              <ArrowLeft size={16} aria-hidden />
              Admin
            </Link>
            <h2>Support Chat</h2>
            <p>Manage customer conversations</p>
          </div>

          <div className="admin-chat-filters">
            <div className="admin-chat-filters-row">
              <select value={filter} onChange={(e) => setFilter(e.target.value)}>
                <option value="all">All Chats</option>
                <option value="waiting">Needs reply</option>
                <option value="open">Open</option>
                <option value="closed">Closed</option>
              </select>
              <button
                type="button"
                className="admin-chat-refresh-btn"
                onClick={refreshChat}
                disabled={isRefreshing}
                aria-label="Refresh chats and messages"
              >
                <RefreshCw
                  size={16}
                  aria-hidden
                  className={isRefreshing ? 'admin-chat-refresh-spin' : undefined}
                />
                {isRefreshing ? 'Refreshing…' : 'Refresh'}
              </button>
            </div>
            <div className="admin-chat-search">
              <Search size={16} aria-hidden />
              <input
                type="text"
                placeholder="Search chats..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {loadError && (
            <p className="admin-alert admin-alert--error admin-chat-sidebar-error" role="alert">
              {loadError}
            </p>
          )}

          <div className="admin-chat-list">
            {isLoading ? (
              <p className="admin-chat-list-empty">Loading chats…</p>
            ) : filteredChats.length === 0 ? (
              <p className="admin-chat-list-empty">No chats found</p>
            ) : (
              filteredChats.map((chat) => {
                const selected = selectedChat?._id === chat._id;
                return (
                  <motion.button
                    type="button"
                    key={chat._id}
                    className={`admin-chat-list-item${selected ? ' admin-chat-list-item--active' : ''}`}
                    onClick={() => setSelectedChat(chat)}
                    whileHover={{ backgroundColor: selected ? undefined : '#f8fafc' }}
                  >
                    <div className="admin-chat-list-item-top">
                      <strong>{chat.user.fullName}</strong>
                      <span
                        className="admin-chat-status"
                        style={{ color: getStatusColor(chat.status) }}
                      >
                        {getStatusIcon(chat.status)}
                        {chat.status}
                      </span>
                    </div>
                    <span className="admin-chat-list-email">{chat.user.email}</span>
                    <span className="admin-chat-list-time">{formatListTime(chat.lastMessage)}</span>
                    {chat.needsReply && (
                      <span className="admin-chat-needs-reply">Needs reply</span>
                    )}
                  </motion.button>
                );
              })
            )}
          </div>
        </aside>

        <main className="admin-chat-main">
          {selectedChat ? (
            <>
              <header className="admin-chat-main-head">
                <div>
                  <h3>{selectedChat.user.fullName}</h3>
                  <p>{selectedChat.user.email}</p>
                </div>
                <div className="admin-chat-main-actions">
                  <button
                    type="button"
                    className="admin-chat-refresh-btn admin-chat-refresh-btn--head"
                    onClick={refreshChat}
                    disabled={isRefreshing}
                    aria-label="Refresh conversation"
                  >
                    <RefreshCw
                      size={16}
                      aria-hidden
                      className={isRefreshing ? 'admin-chat-refresh-spin' : undefined}
                    />
                    Refresh
                  </button>
                  <select
                    value={selectedChat.status}
                    onChange={(e) => updateChatStatus(selectedChat._id, e.target.value)}
                    aria-label="Chat status"
                  >
                    <option value="open">Open</option>
                    <option value="closed">Closed</option>
                  </select>
                  <button
                    type="button"
                    className="admin-chat-delete-btn"
                    onClick={deleteChat}
                    disabled={isDeleting}
                    aria-label="Delete chat history"
                  >
                    <Trash2 size={16} aria-hidden />
                    {isDeleting ? 'Deleting…' : 'Delete chat'}
                  </button>
                </div>
              </header>

              <div className="admin-chat-messages">
                <AnimatePresence initial={false}>
                  {messages.map((message) => (
                    <motion.div
                      key={message._id || message.id}
                      className={`admin-chat-bubble-row ${
                        message.isFromSupport
                          ? 'admin-chat-bubble-row--support'
                          : 'admin-chat-bubble-row--customer'
                      }`}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <div
                        className={`admin-chat-bubble ${
                          message.isFromSupport
                            ? 'admin-chat-bubble--support'
                            : 'admin-chat-bubble--customer'
                        }`}
                      >
                        <p>{message.message}</p>
                        <time>
                          {new Date(message.createdAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </time>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                <div ref={messagesEndRef} />
              </div>

              <footer className="admin-chat-compose">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendReply()}
                  placeholder="Type your reply..."
                  disabled={isSending}
                />
                <button
                  type="button"
                  onClick={sendReply}
                  disabled={!newMessage.trim() || isSending}
                >
                  <Send size={16} />
                  {isSending ? 'Sending…' : 'Send'}
                </button>
              </footer>
            </>
          ) : (
            <div className="admin-chat-placeholder">
              <MessageCircle size={48} aria-hidden />
              <h3>Select a chat to start</h3>
              <p>Choose a conversation from the sidebar to view messages</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminChat;
