import React, { useState, useEffect, useRef } from 'react';
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

  // Adicionando o estado de configurações
  const [settings, setSettings] = useState({
    theme: 'dark',
    model: 'gpt-3.5-turbo',
    temperature: 0.7
  });

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

  const updateSettings = (newSettings) => {
    console.log('Aplicando novas configurações:', newSettings);
    setSettings(newSettings);
    
    // Aplicar tema
    if (newSettings.theme !== 'system') {
      setTheme(newSettings.theme);
      document.body.className = newSettings.theme;
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const systemTheme = prefersDark ? 'dark' : 'light';
      setTheme(systemTheme);
      document.body.className = systemTheme;
    }
    
    // Aplicar cores na raiz do documento
    document.documentElement.style.setProperty('--neon-blue', newSettings.primaryColor);
    document.documentElement.style.setProperty('--neon-purple', newSettings.accentColor);
    
    // Aplicar cores do chat
    if (newSettings.chatBgColor) {
      document.documentElement.style.setProperty('--bg-primary', newSettings.chatBgColor);
    }
    
    // Aplicar cores dos balões de mensagem - corrigido para usar as variáveis corretas
    if (newSettings.messageBgColor) {
      // Variáveis antigas
      document.documentElement.style.setProperty('--message-bg', newSettings.messageBgColor + '22');
      document.documentElement.style.setProperty('--message-border', newSettings.messageBgColor + '33');
      document.documentElement.style.setProperty('--message-shadow', newSettings.messageBgColor + '66');
      
      // Variáveis novas para gradientes
      document.documentElement.style.setProperty('--ai-gradient-start', newSettings.messageBgColor);
      document.documentElement.style.setProperty('--ai-gradient-end', adjustColorBrightness(newSettings.messageBgColor, 20));
      document.documentElement.style.setProperty('--ai-message-bg', newSettings.messageBgColor);
      document.documentElement.style.setProperty('--ai-message-text', '#ffffff');
    }
    
    if (newSettings.userMessageBgColor) {
      // Variáveis antigas
      document.documentElement.style.setProperty('--message-user-bg', newSettings.userMessageBgColor + '22');
      document.documentElement.style.setProperty('--message-user-border', newSettings.userMessageBgColor + '33');
      
      // Variáveis novas para gradientes
      document.documentElement.style.setProperty('--user-gradient-start', newSettings.userMessageBgColor);
      document.documentElement.style.setProperty('--user-gradient-end', adjustColorBrightness(newSettings.userMessageBgColor, 20));
      document.documentElement.style.setProperty('--user-message-bg', newSettings.userMessageBgColor);
      document.documentElement.style.setProperty('--user-message-text', '#ffffff');
    }
    
    // Adicionar variáveis CSS para os balões de mensagem usando cores primárias
    document.documentElement.style.setProperty('--message-bg', newSettings.primaryColor + '22'); // 22 = 13% opacidade
    document.documentElement.style.setProperty('--message-border', newSettings.primaryColor + '33'); // 33 = 20% opacidade
    document.documentElement.style.setProperty('--message-user-bg', newSettings.accentColor + '22');
    document.documentElement.style.setProperty('--message-user-border', newSettings.accentColor + '33');
    document.documentElement.style.setProperty('--message-shadow', newSettings.primaryColor + '66'); // 66 = 40% opacidade
    
    // Aplicar as cores primárias também para os gradientes
    document.documentElement.style.setProperty('--ai-gradient-start', newSettings.primaryColor);
    document.documentElement.style.setProperty('--ai-gradient-end', adjustColorBrightness(newSettings.primaryColor, 20));
    document.documentElement.style.setProperty('--user-gradient-start', newSettings.accentColor);
    document.documentElement.style.setProperty('--user-gradient-end', adjustColorBrightness(newSettings.accentColor, 20));
    
    // Converter hex para rgb para usar em rgba()
    const hexToRgb = (hex) => {
      const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
      const fullHex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(fullHex);
      return result ? 
        `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : 
        null;
    };
    
    document.documentElement.style.setProperty('--neon-blue-rgb', hexToRgb(newSettings.primaryColor));
    document.documentElement.style.setProperty('--neon-purple-rgb', hexToRgb(newSettings.accentColor));
    
    // Aplicar estilo de fundo (corrigindo para garantir que seja aplicado)
    const rootElement = document.querySelector('.root-container');
    if (rootElement) {
      rootElement.dataset.backgroundStyle = newSettings.backgroundStyle;
      
      // Forçar a aplicação do estilo de fundo
      if (newSettings.backgroundStyle === 'grid') {
        rootElement.style.backgroundImage = 
          `linear-gradient(rgba(${hexToRgb(newSettings.primaryColor)}, 0.1) 1px, transparent 1px),
           linear-gradient(90deg, rgba(${hexToRgb(newSettings.primaryColor)}, 0.1) 1px, transparent 1px)`;
        rootElement.style.backgroundSize = '20px 20px';
      } 
      else if (newSettings.backgroundStyle === 'gradient') {
        rootElement.style.background = 
          `linear-gradient(135deg, 
            #121212, 
            rgba(${hexToRgb(newSettings.primaryColor)}, 0.15), 
            #121212, 
            rgba(${hexToRgb(newSettings.accentColor)}, 0.15), 
            #121212)`;
        rootElement.style.backgroundSize = '400% 400%';
        rootElement.style.animation = 'gradientBackground 15s ease infinite';
      }
      else if (newSettings.backgroundStyle === 'solid') {
        rootElement.style.backgroundImage = 'none';
        rootElement.style.background = '#121212';
        rootElement.style.animation = 'none';
      }
    }
    
    // Aplicar estilos diretos
    const setDirectChatStyles = () => {
      const style = document.createElement('style');
      style.id = 'custom-message-styles';
      
      // Remover estilos existentes se houver
      const existingStyle = document.getElementById('custom-message-styles');
      if (existingStyle) {
        existingStyle.remove();
      }
      
      style.innerHTML = `
        .message-bubble.ai-bubble {
          background: linear-gradient(135deg, ${newSettings.messageBgColor || '#1e1e1e'}, ${newSettings.messageBgColor ? adjustColorBrightness(newSettings.messageBgColor, 20) : '#2a2a2a'}) !important;
          color: #ffffff !important;
        }
        
        .message-bubble.user-bubble {
          background: linear-gradient(135deg, ${newSettings.userMessageBgColor || '#232323'}, ${newSettings.userMessageBgColor ? adjustColorBrightness(newSettings.userMessageBgColor, 20) : '#333333'}) !important;
          color: #ffffff !important;
        }
        
        .chat-window {
          background-color: ${newSettings.chatBgColor || '#090928'} !important;
        }
        
        .settings-panel {
          background-color: #121236 !important;
        }
        
        .root-container {
          background-color: ${newSettings.containerColor || '#121236'} !important;
        }
        
        .app-container {
          border-color: ${adjustColorBrightness(newSettings.containerColor || '#121236', 20)} !important;
        }
      `;
      
      document.head.appendChild(style);
    };
    
    // Função para ajustar a luminosidade de uma cor hex
    function adjustColorBrightness(hex, percent) {
      hex = hex.replace(/^\s*#|\s*$/g, '');
      
      // Converte para RGB
      let r = parseInt(hex.substr(0, 2), 16);
      let g = parseInt(hex.substr(2, 2), 16);
      let b = parseInt(hex.substr(4, 2), 16);
      
      // Ajusta a luminosidade
      r = parseInt(r * (100 + percent) / 100);
      g = parseInt(g * (100 + percent) / 100);
      b = parseInt(b * (100 + percent) / 100);
      
      // Garante que os valores estejam dentro dos limites
      r = r < 255 ? r : 255;
      g = g < 255 ? g : 255;
      b = b < 255 ? b : 255;
      
      // Converte de volta para hex
      return "#" + 
        (r.toString(16).length === 1 ? "0" + r.toString(16) : r.toString(16)) +
        (g.toString(16).length === 1 ? "0" + g.toString(16) : g.toString(16)) +
        (b.toString(16).length === 1 ? "0" + b.toString(16) : b.toString(16));
    }
    
    // Aplicar estilos diretos
    setDirectChatStyles();
    
    // Salvar as configurações no localStorage para persistência
    localStorage.setItem('chatSettings', JSON.stringify(newSettings));
  };

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('chatSettings');
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings);
        console.log('Carregando configurações salvas:', parsedSettings);
        
        // Atualiza o estado
        setSettings(parsedSettings);
        
        // Aplica o tema
        if (parsedSettings.theme && parsedSettings.theme !== 'system') {
          setTheme(parsedSettings.theme);
          document.body.className = parsedSettings.theme;
        }
        
        // Aplica as cores principais
        if (parsedSettings.primaryColor) {
          document.documentElement.style.setProperty('--neon-blue', parsedSettings.primaryColor);
          // Adicionar variáveis para balões de mensagem
          document.documentElement.style.setProperty('--message-bg', parsedSettings.primaryColor + '22');
          document.documentElement.style.setProperty('--message-border', parsedSettings.primaryColor + '33');
          document.documentElement.style.setProperty('--message-shadow', parsedSettings.primaryColor + '66');
        }
        if (parsedSettings.accentColor) {
          document.documentElement.style.setProperty('--neon-purple', parsedSettings.accentColor);
          // Adicionar variáveis para balões de mensagem do usuário
          document.documentElement.style.setProperty('--message-user-bg', parsedSettings.accentColor + '22');
          document.documentElement.style.setProperty('--message-user-border', parsedSettings.accentColor + '33');
        }
        
        // Aplica cores do chat
        if (parsedSettings.chatBgColor) {
          document.documentElement.style.setProperty('--bg-primary', parsedSettings.chatBgColor);
        }
        
        // Aplica cor do container principal
        if (parsedSettings.containerColor) {
          const setContainerColor = () => {
            const style = document.createElement('style');
            style.id = 'custom-container-styles';
            
            // Remover estilos existentes se houver
            const existingStyle = document.getElementById('custom-container-styles');
            if (existingStyle) {
              existingStyle.remove();
            }
            
            style.innerHTML = `
              .settings-panel {
                background-color: #121236 !important;
              }
              
              .root-container {
                background-color: ${parsedSettings.containerColor || '#121236'} !important;
              }
              
              .app-container {
                border-color: ${adjustColorBrightness(parsedSettings.containerColor || '#121236', 20)} !important;
              }
            `;
            
            document.head.appendChild(style);
          };
          
          setContainerColor();
        }
        
        // Aplica cores específicas dos balões de mensagem (se definidas)
        if (parsedSettings.messageBgColor) {
          document.documentElement.style.setProperty('--message-bg', parsedSettings.messageBgColor + '22');
          document.documentElement.style.setProperty('--message-border', parsedSettings.messageBgColor + '33');
          document.documentElement.style.setProperty('--message-shadow', parsedSettings.messageBgColor + '66');
          
          // Adicionando variáveis de gradiente
          document.documentElement.style.setProperty('--ai-gradient-start', parsedSettings.messageBgColor);
          document.documentElement.style.setProperty('--ai-gradient-end', adjustColorBrightness(parsedSettings.messageBgColor, 20));
          document.documentElement.style.setProperty('--ai-message-bg', parsedSettings.messageBgColor);
          document.documentElement.style.setProperty('--ai-message-text', '#ffffff');
        }
        
        if (parsedSettings.userMessageBgColor) {
          document.documentElement.style.setProperty('--message-user-bg', parsedSettings.userMessageBgColor + '22');
          document.documentElement.style.setProperty('--message-user-border', parsedSettings.userMessageBgColor + '33');
          
          // Adicionando variáveis de gradiente
          document.documentElement.style.setProperty('--user-gradient-start', parsedSettings.userMessageBgColor);
          document.documentElement.style.setProperty('--user-gradient-end', adjustColorBrightness(parsedSettings.userMessageBgColor, 20));
          document.documentElement.style.setProperty('--user-message-bg', parsedSettings.userMessageBgColor);
          document.documentElement.style.setProperty('--user-message-text', '#ffffff');
        }
        
        // Converte hex para rgb
        const hexToRgb = (hex) => {
          const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
          const fullHex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);
          const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(fullHex);
          return result ? 
            `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : 
            null;
        };
        
        if (parsedSettings.primaryColor) {
          document.documentElement.style.setProperty(
            '--neon-blue-rgb', 
            hexToRgb(parsedSettings.primaryColor)
          );
        }
        
        if (parsedSettings.accentColor) {
          document.documentElement.style.setProperty(
            '--neon-purple-rgb', 
            hexToRgb(parsedSettings.accentColor)
          );
        }
        
        // Função para ajustar a luminosidade de uma cor hex
        function adjustColorBrightness(hex, percent) {
          hex = hex.replace(/^\s*#|\s*$/g, '');
          
          // Converte para RGB
          let r = parseInt(hex.substr(0, 2), 16);
          let g = parseInt(hex.substr(2, 2), 16);
          let b = parseInt(hex.substr(4, 2), 16);
          
          // Ajusta a luminosidade
          r = parseInt(r * (100 + percent) / 100);
          g = parseInt(g * (100 + percent) / 100);
          b = parseInt(b * (100 + percent) / 100);
          
          // Garante que os valores estejam dentro dos limites
          r = r < 255 ? r : 255;
          g = g < 255 ? g : 255;
          b = b < 255 ? b : 255;
          
          // Converte de volta para hex
          return "#" + 
            (r.toString(16).length === 1 ? "0" + r.toString(16) : r.toString(16)) +
            (g.toString(16).length === 1 ? "0" + g.toString(16) : g.toString(16)) +
            (b.toString(16).length === 1 ? "0" + b.toString(16) : b.toString(16));
        }
        
        // Aplicar estilos diretos
        setDirectChatStyles();
        
        // Aplica o estilo de fundo
        if (parsedSettings.backgroundStyle) {
          const rootElement = document.querySelector('.root-container');
          if (rootElement) {
            rootElement.dataset.backgroundStyle = parsedSettings.backgroundStyle;
            
            // Forçar a aplicação do estilo de fundo
            if (parsedSettings.backgroundStyle === 'grid' && parsedSettings.primaryColor) {
              rootElement.style.backgroundImage = 
                `linear-gradient(rgba(${hexToRgb(parsedSettings.primaryColor)}, 0.1) 1px, transparent 1px),
                 linear-gradient(90deg, rgba(${hexToRgb(parsedSettings.primaryColor)}, 0.1) 1px, transparent 1px)`;
              rootElement.style.backgroundSize = '20px 20px';
            } 
            else if (parsedSettings.backgroundStyle === 'gradient' && parsedSettings.primaryColor && parsedSettings.accentColor) {
              rootElement.style.background = 
                `linear-gradient(135deg, 
                  #121212, 
                  rgba(${hexToRgb(parsedSettings.primaryColor)}, 0.15), 
                  #121212, 
                  rgba(${hexToRgb(parsedSettings.accentColor)}, 0.15), 
                  #121212)`;
              rootElement.style.backgroundSize = '400% 400%';
              rootElement.style.animation = 'gradientBackground 15s ease infinite';
            }
            else if (parsedSettings.backgroundStyle === 'solid') {
              rootElement.style.backgroundImage = 'none';
              rootElement.style.background = '#121212';
              rootElement.style.animation = 'none';
            }
          }
        }
        
      } catch (e) {
        console.error('Erro ao carregar configurações:', e);
      }
    }
  }, []);

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
            settings={settings}
            onSettingsChange={updateSettings}
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
