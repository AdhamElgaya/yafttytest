'use client';

import { createContext, useContext, useState } from 'react';

const ChatbotContext = createContext({
  isOpen: false,
  setIsOpen: () => {},
  openChatbot: () => {},
});

export function ChatbotProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const openChatbot = () => setIsOpen(true);

  return (
    <ChatbotContext.Provider value={{ isOpen, setIsOpen, openChatbot }}>
      {children}
    </ChatbotContext.Provider>
  );
}

export function useChatbot() {
  return useContext(ChatbotContext);
}
