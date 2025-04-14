import React, { useRef, useEffect, useCallback } from 'react';
import MessageBubble from '../MessageBubble/MessageBubble';
import './ChatWindow.css';

const ChatWindow = ({ messages, loading, error, messagesEndRef, isSmallScreen }) => {
  const messagesContainerRef = useRef(null);
  
  // Log para depuração quando o array de mensagens mudar
  React.useEffect(() => {
    if (messages.length > 0) {
      console.log(`Mensagens atualizadas (${messages.length})`);
    }
  }, [messages]);

  // Scroll para a última mensagem quando novas mensagens são adicionadas
  useEffect(() => {
    // Função para scroll para o final das mensagens
    const scrollToBottom = () => {
      if (messagesEndRef && messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ block: 'start' });
      }
    };
    
    // Scroll imediato
    scrollToBottom();
    
    // Para garantir que o scroll funcione mesmo com imagens que podem carregar depois
    const timeoutId = setTimeout(scrollToBottom, 100);
    
    return () => clearTimeout(timeoutId);
  }, [messages, loading, messagesEndRef]);

  // Função para verificar se deve mostrar o avatar
  const shouldShowAvatar = useCallback((msg, idx) => {
    if (idx === 0) return true;
    return messages[idx - 1].sender !== msg.sender;
  }, [messages]);
  
  // Renderizar tela de boas-vindas se não houver mensagens
  const renderWelcomeScreen = () => {
    return (
      <div className={`welcome-container ${isSmallScreen ? 'welcome-container-small' : ''}`}>
        <h1 className="welcome-title">
          Agentix
        </h1>
        <p className="welcome-subtitle">
          Seu assistente virtual inteligente pronto para te ajudar. Envie uma mensagem para começar a conversa.
        </p>
        
        <div className={`welcome-hints ${isSmallScreen ? 'welcome-hints-small' : ''}`}>
          <div className="hint-item">
            <div className="hint-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path d="M4.913 2.658c2.075-.27 4.19-.408 6.337-.408 2.147 0 4.262.139 6.337.408 1.922.25 3.291 1.861 3.405 3.727a4.403 4.403 0 00-1.032-.211 50.89 50.89 0 00-8.42 0c-2.358.196-4.04 2.19-4.04 4.434v4.286a4.47 4.47 0 002.433 3.984L7.28 21.53A.75.75 0 016 21v-4.03a48.527 48.527 0 01-1.087-.128C2.905 16.58 1.5 14.833 1.5 12.862V6.638c0-1.97 1.405-3.718 3.413-3.979z" />
                <path d="M15.75 7.5c-1.376 0-2.739.057-4.086.169C10.124 7.797 9 9.103 9 10.609v4.285c0 1.507 1.128 2.814 2.67 2.94 1.243.102 2.5.157 3.768.165l2.782 2.781a.75.75 0 001.28-.53v-2.39l.33-.026c1.542-.125 2.67-1.433 2.67-2.94v-4.286c0-1.505-1.125-2.811-2.664-2.94A49.392 49.392 0 0015.75 7.5z" />
              </svg>
            </div>
            <div className="hint-content">
              <h3 className="hint-title">Converse naturalmente</h3>
              <p className="hint-description">Faça perguntas, peça conselhos ou simplesmente converse como faria com uma pessoa.</p>
            </div>
          </div>
          
          <div className="hint-item">
            <div className="hint-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path fillRule="evenodd" d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="hint-content">
              <h3 className="hint-title">Compartilhe mídia</h3>
              <p className="hint-description">Envie imagens ou grave mensagens de áudio para uma experiência mais rica.</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`chat-window ${isSmallScreen ? 'chat-window-small' : ''}`}>
      <div className={`messages-container ${isSmallScreen ? 'messages-container-small' : ''}`} ref={messagesContainerRef}>
        {messages.length === 0 ? (
          renderWelcomeScreen()
        ) : (
          <>
            {messages.map((message, index) => (
              <MessageBubble 
                key={`msg-${message.sender}-${index}`}
                message={message}
                showAvatar={shouldShowAvatar(message, index)}
                isSmallScreen={isSmallScreen}
              />
            ))}
            
            {/* Bolha de carregamento */}
            {loading && (
              <MessageBubble 
                message={{ 
                  sender: 'ai', 
                  text: '', 
                  timestamp: new Date().toISOString() 
                }}
                showAvatar={
                  messages.length === 0 || 
                  messages[messages.length-1].sender !== 'ai'
                }
                isLoading={true}
                isSmallScreen={isSmallScreen}
              />
            )}
            
            {/* Mensagem de erro */}
            {error && (
              <div className="error-message">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="error-icon">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                </svg>
                <p>{error}</p>
              </div>
            )}
            
            {/* Referência para rolagem automática */}
            <div ref={messagesEndRef} className="scroll-anchor" />
          </>
        )}
      </div>
    </div>
  );
};

export default React.memo(ChatWindow); 