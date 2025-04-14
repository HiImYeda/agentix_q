import React, { useState, useEffect } from 'react';
import './App.css';
import ChatWindow from './components/ChatWindow/ChatWindow';
import InputBar from './components/InputBar/InputBar';
import Header from './components/Header/Header';
import useChat from './hooks/useChat';

// Estilos inline para debug
const debugStyles = {
  appContainer: {
    backgroundColor: '#121212',
    color: 'white',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column'
  },
  testElement: {
    padding: '20px',
    backgroundColor: 'rgba(255, 51, 102, 0.3)',
    margin: '10px',
    borderRadius: '8px',
    border: '1px solid #ff3366',
    textAlign: 'center'
  }
};

function App() {
  const [isTyping, setIsTyping] = useState(false);
  const [theme, setTheme] = useState('dark');
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 768);

  const {
    messages,
    loading,
    error,
    sessionId,
    sendTextMessage,
    transcribeAudio,
    clearMessages,
    updateSessionId,
    messagesEndRef,
  } = useChat();

  // Console log para debug
  useEffect(() => {
    console.log('App renderizado, tema atual:', theme);
    document.body.className = theme;
  }, [theme]);

  // Detectar tamanho da tela para ajustes responsivos
  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Definir o tema inicial baseado nas preferências do sistema
  useEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = prefersDark ? 'dark' : 'light';
    setTheme(initialTheme);
    document.body.className = initialTheme;
  }, []);

  // Alternar tema
  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    document.body.className = newTheme;
  };

  return (
    <div className="root-container">
      <div className="app">
        <div className="app-container">
          <Header 
            sessionId={sessionId}
            onSessionChange={updateSessionId}
            onClearChat={clearMessages} 
            isDarkMode={theme === 'dark'}
            onThemeToggle={toggleTheme}
          />
          
          <div className="chat-main-container">
            <ChatWindow 
              messages={messages} 
              loading={loading}
              error={error}
              messagesEndRef={messagesEndRef}
              isSmallScreen={isSmallScreen}
            />
            
            {loading && (
              <div className="typing-indicator">
                <div className="loading-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}
          </div>
          
          <InputBar
            onSendText={sendTextMessage}
            disabled={loading}
            isTyping={isTyping}
            onStartTyping={() => setIsTyping(true)}
            onStopTyping={() => setIsTyping(false)}
            placeholder="Digite uma mensagem..."
            showMediaButtons={!isSmallScreen || window.innerWidth > 480}
            theme={theme}
            onTranscribe={transcribeAudio}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
