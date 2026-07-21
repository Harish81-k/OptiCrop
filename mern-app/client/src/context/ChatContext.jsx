import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [sessions, setSessions] = useState(() => {
    const saved = localStorage.getItem('chatgpt_sessions');
    if (saved) return JSON.parse(saved);
    return [{ id: Date.now(), title: 'New Chat', messages: [] }];
  });
  
  const [currentSessionId, setCurrentSessionId] = useState(() => {
    const saved = localStorage.getItem('chatgpt_current_session');
    if (saved) return JSON.parse(saved);
    return sessions.length > 0 ? sessions[0].id : Date.now();
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    localStorage.setItem('chatgpt_sessions', JSON.stringify(sessions));
    localStorage.setItem('chatgpt_current_session', JSON.stringify(currentSessionId));
  }, [sessions, currentSessionId]);

  const currentSession = sessions.find(s => s.id === currentSessionId) || { messages: [] };
  const messages = currentSession.messages;

  const createNewChat = () => {
    const newId = Date.now();
    setSessions(prev => [{ id: newId, title: 'New Chat', messages: [] }, ...prev]);
    setCurrentSessionId(newId);
  };

  const selectSession = (id) => {
    setCurrentSessionId(id);
  };

  const clearHistory = () => {
    if(window.confirm("Are you sure you want to clear all history?")) {
      const newId = Date.now();
      setSessions([{ id: newId, title: 'New Chat', messages: [] }]);
      setCurrentSessionId(newId);
    }
  };

  const updateSessionMessages = (newMessages) => {
    setSessions(prev => prev.map(s => {
      if (s.id === currentSessionId) {
        let newTitle = s.title;
        if (s.messages.length === 0 && newMessages.length > 0 && !newMessages[0].isBot) {
          newTitle = newMessages[0].text.substring(0, 30) + (newMessages[0].text.length > 30 ? '...' : '');
        }
        return { ...s, title: newTitle, messages: newMessages };
      }
      return s;
    }));
  };

  const sendMessage = async (userMsg) => {
    if (!userMsg.trim() || loading) return;

    const newMessages = [...messages, { text: userMsg, isBot: false }];
    updateSessionMessages(newMessages);
    setLoading(true);

    try {
      const res = await axios.post('http://localhost:5000/api/assistant/chat', { message: userMsg });
      let replyText = res.data.reply;
      
      replyText = replyText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      replyText = replyText.replace(/\n/g, '<br/>');

      updateSessionMessages([...newMessages, { text: replyText, isBot: true }]);
    } catch (err) {
      updateSessionMessages([...newMessages, { text: 'Sorry, I am having trouble connecting.', isBot: true }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ChatContext.Provider value={{
      sessions,
      currentSessionId,
      messages,
      loading,
      createNewChat,
      selectSession,
      clearHistory,
      sendMessage
    }}>
      {children}
    </ChatContext.Provider>
  );
};
