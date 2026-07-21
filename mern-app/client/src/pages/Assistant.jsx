import React, { useState, useRef, useEffect, useContext } from 'react';
import { ChatContext } from '../context/ChatContext';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';

function Assistant() {
  const {
    sessions,
    currentSessionId,
    messages,
    loading,
    createNewChat,
    selectSession,
    clearHistory,
    sendMessage
  } = useContext(ChatContext);

  const [input, setInput] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const chatBoxRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleInput = (e) => {
    setInput(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = `${Math.min(e.target.scrollHeight, 200)}px`;
  };

  const handleSend = async (e) => {
    if (e) e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'; // reset height
    }
    
    // Call the context's sendMessage (this handles the API request and updates state)
    sendMessage(userMsg);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSessionSelect = (id) => {
    selectSession(id);
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

  return (
    <>
      <style>{`
        /* Override global styles to make it full screen */
        .chatgpt-wrapper {
            position: fixed;
            top: 76px; /* Approx navbar height */
            left: 0;
            right: 0;
            bottom: 0;
            background-color: #ffffff;
            z-index: 1000;
            display: flex;
            overflow: hidden;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        }

        /* Sidebar Styles */
        .chatgpt-sidebar {
            width: 260px;
            background-color: #171717; /* Dark sidebar */
            color: #ffffff;
            display: flex;
            flex-direction: column;
            transition: transform 0.3s ease;
            flex-shrink: 0;
        }
        .chatgpt-sidebar.closed {
            transform: translateX(-100%);
            margin-right: -260px;
        }
        
        .sidebar-header {
            padding: 12px;
        }
        .new-chat-btn {
            display: flex;
            align-items: center;
            gap: 12px;
            width: 100%;
            padding: 10px 14px;
            background-color: transparent;
            color: #ffffff;
            border: 1px solid rgba(255,255,255,0.2);
            border-radius: 8px;
            font-size: 0.95rem;
            cursor: pointer;
            transition: background-color 0.2s;
            text-align: left;
        }
        .new-chat-btn:hover {
            background-color: rgba(255,255,255,0.1);
        }
        
        .history-list {
            flex-grow: 1;
            overflow-y: auto;
            padding: 8px 12px;
        }
        .history-list::-webkit-scrollbar { width: 6px; }
        .history-list::-webkit-scrollbar-track { background: transparent; }
        .history-list::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
        
        .history-item {
            padding: 12px 14px;
            border-radius: 8px;
            color: #ececf1;
            font-size: 0.9rem;
            cursor: pointer;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            display: flex;
            align-items: center;
            gap: 12px;
            transition: background-color 0.2s;
            margin-bottom: 4px;
        }
        .history-item:hover {
            background-color: rgba(255,255,255,0.05);
        }
        .history-item.active {
            background-color: rgba(255,255,255,0.1);
        }
        
        .sidebar-footer {
            padding: 12px;
            border-top: 1px solid rgba(255,255,255,0.1);
        }
        .clear-btn {
            color: #ececf1;
            background: transparent;
            border: none;
            width: 100%;
            text-align: left;
            padding: 12px 14px;
            font-size: 0.9rem;
            border-radius: 8px;
            display: flex;
            align-items: center;
            gap: 12px;
        }
        .clear-btn:hover {
            background-color: rgba(255,255,255,0.05);
        }

        /* Main Chat Area */
        .chat-main {
            flex-grow: 1;
            display: flex;
            flex-direction: column;
            background-color: #ffffff;
            position: relative;
            min-width: 0;
        }
        
        .top-bar {
            height: 56px;
            display: flex;
            align-items: center;
            padding: 0 16px;
            border-bottom: 1px solid rgba(0,0,0,0.1);
            color: #374151;
            font-weight: 500;
        }
        .toggle-sidebar-btn {
            background: transparent;
            border: none;
            font-size: 1.25rem;
            color: #6b7280;
            cursor: pointer;
            padding: 8px;
            border-radius: 8px;
            margin-right: 12px;
        }
        .toggle-sidebar-btn:hover {
            background-color: #f3f4f6;
        }

        .chat-scroll-area {
            flex-grow: 1;
            overflow-y: auto;
        }
        .chat-scroll-area::-webkit-scrollbar { width: 6px; }
        .chat-scroll-area::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 10px; }

        .chat-message-row {
            padding: 24px 20px;
            display: flex;
            justify-content: center;
        }
        .chat-message-row.bot-row {
            background-color: #ffffff;
        }
        .chat-message-content {
            max-width: 768px;
            width: 100%;
            display: flex;
            gap: 20px;
            font-size: 1.05rem; /* Slightly larger text */
            line-height: 1.7;
            color: #1a1a1a;
        }
        .user-bubble {
            background-color: #f4f4f5;
            padding: 12px 20px;
            border-radius: 24px;
            border-bottom-right-radius: 4px;
            margin-left: auto;
            max-width: 85%;
            color: #000;
        }
        .avatar {
            width: 32px;
            height: 32px;
            border-radius: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
            color: white;
            font-size: 1.2rem;
            margin-top: 4px;
        }
        .avatar-bot {
            background-color: #10a37f;
            border-radius: 50%;
        }
        
        .markdown-body {
            font-family: inherit;
        }
        .markdown-body p {
            margin-bottom: 1.2rem;
        }
        .markdown-body p:last-child {
            margin-bottom: 0;
        }
        .markdown-body ul, .markdown-body ol {
            margin-bottom: 1.2rem;
            padding-left: 1.5rem;
        }
        .markdown-body li {
            margin-bottom: 0.5rem;
        }

        .input-container {
            padding: 24px;
            background: linear-gradient(180deg, rgba(255,255,255,0) 0%, #ffffff 30%);
            display: flex;
            flex-direction: column;
            align-items: center;
            position: sticky;
            bottom: 0;
            width: 100%;
        }
        .input-box {
            max-width: 768px;
            width: 100%;
            position: relative;
            background-color: #f4f4f5;
            border: 1px solid transparent;
            border-radius: 24px;
            padding: 14px 18px;
            display: flex;
            align-items: flex-end;
            transition: all 0.2s ease;
        }
        .input-box:focus-within {
            background-color: #ffffff;
            border-color: #e5e7eb;
            box-shadow: 0 4px 15px rgba(0,0,0,0.05);
        }
        .chat-textarea {
            flex-grow: 1;
            border: none;
            resize: none;
            outline: none;
            max-height: 200px;
            overflow-y: auto;
            background: transparent;
            padding: 2px 0;
            font-size: 1.05rem;
            line-height: 1.5;
        }
        .chat-textarea::placeholder {
            color: #9ca3af;
        }
        
        .send-btn {
            background-color: #000000;
            color: white;
            border: none;
            border-radius: 50%;
            width: 34px;
            height: 34px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: background-color 0.2s;
            margin-left: 12px;
            margin-bottom: 2px;
        }
        .send-btn:hover {
            background-color: #333333;
        }
        .send-btn:disabled {
            background-color: #e5e7eb;
            cursor: not-allowed;
            color: #9ca3af;
        }
        
        .disclaimer {
            font-size: 0.8rem;
            color: #9ca3af;
            margin-top: 12px;
            text-align: center;
        }

        .typing-indicator span {
            display: inline-block;
            width: 6px;
            height: 6px;
            background-color: #10a37f;
            border-radius: 50%;
            margin-right: 5px;
            animation: bounce 1.4s infinite ease-in-out both;
        }
        .typing-indicator span:nth-child(1) { animation-delay: -0.32s; }
        .typing-indicator span:nth-child(2) { animation-delay: -0.16s; }
        
        /* Mobile handling */
        @media (max-width: 768px) {
            .chatgpt-sidebar {
                position: absolute;
                height: 100%;
                z-index: 1010;
            }
            .chat-main {
                width: 100%;
            }
        }
      `}</style>
      
      <div className="chatgpt-wrapper">
          {/* Sidebar */}
          <div className={`chatgpt-sidebar ${sidebarOpen ? '' : 'closed'}`}>
              <div className="sidebar-header">
                  <button className="new-chat-btn" onClick={createNewChat}>
                      <i className="bi bi-plus-lg fs-6"></i>
                      New Chat
                  </button>
              </div>
              
              <div className="history-list">
                  <div className="text-muted small fw-semibold mb-2 px-2 mt-2" style={{fontSize: '0.8rem'}}>Recent</div>
                  {sessions.map(s => (
                      <div 
                          key={s.id} 
                          className={`history-item ${currentSessionId === s.id ? 'active' : ''}`}
                          onClick={() => handleSessionSelect(s.id)}
                      >
                          <i className="bi bi-chat-left"></i>
                          {s.title}
                      </div>
                  ))}
              </div>
              
              <div className="sidebar-footer">
                  <button className="clear-btn" onClick={clearHistory}>
                      <i className="bi bi-trash"></i>
                      Clear conversations
                  </button>
              </div>
          </div>

          {/* Main Chat Area */}
          <div className="chat-main">
              <div className="top-bar">
                  <button className="toggle-sidebar-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
                      <i className="bi bi-layout-sidebar"></i>
                  </button>
                  <span className="fw-semibold fs-5">OptiCrop AI</span>
              </div>
              
              <div className="chat-scroll-area" ref={chatBoxRef}>
                  
                  {messages.length === 0 && (
                      <div className="d-flex flex-column align-items-center justify-content-center h-100 text-center" style={{padding: '0 20px'}}>
                          <div className="avatar-bot mb-4" style={{width: '64px', height: '64px', fontSize: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                              <i className="bi bi-robot"></i>
                          </div>
                          <h3 className="fw-bold mb-3">How can I help you today?</h3>
                          <p className="text-muted fs-5" style={{maxWidth: '500px', margin: '0 auto'}}>I'm your OptiCrop AI assistant. Ask me about crop diseases, soil health, fertilizer recommendations, or farming best practices.</p>
                      </div>
                  )}

                  {messages.map((msg, i) => (
                      msg.isBot ? (
                          <div key={i} className="chat-message-row bot-row">
                              <div className="chat-message-content">
                                  <div className="avatar avatar-bot">
                                      <i className="bi bi-robot"></i>
                                  </div>
                                  <div className="pt-1 markdown-body w-100">
                                      <ReactMarkdown rehypePlugins={[rehypeRaw]}>{msg.text}</ReactMarkdown>
                                  </div>
                              </div>
                          </div>
                      ) : (
                          <div key={i} className="chat-message-row">
                              <div className="chat-message-content" style={{ justifyContent: 'flex-end' }}>
                                  <div className="user-bubble">
                                      {msg.text}
                                  </div>
                              </div>
                          </div>
                      )
                  ))}

                  {loading && (
                      <div className="chat-message-row bot-row">
                          <div className="chat-message-content">
                              <div className="avatar avatar-bot">
                                  <i className="bi bi-robot"></i>
                              </div>
                              <div className="pt-2 typing-indicator">
                                  <span></span><span></span><span></span>
                              </div>
                          </div>
                      </div>
                  )}
              </div>

              <div className="input-container">
                  <div className="input-box">
                      <textarea 
                          ref={textareaRef}
                          className="chat-textarea" 
                          placeholder="Message OptiCrop AI..."
                          value={input}
                          rows={1}
                          onChange={handleInput}
                          onKeyDown={handleKeyDown}
                      />
                      <button 
                          className="send-btn" 
                          onClick={handleSend}
                          disabled={loading || !input.trim()}>
                          <i className="bi bi-arrow-up fs-6 fw-bold"></i>
                      </button>
                  </div>
                  <div className="disclaimer">
                      OptiCrop AI can make mistakes. Consider verifying important agricultural information.
                  </div>
              </div>
          </div>
      </div>
    </>
  );
}

export default Assistant;

