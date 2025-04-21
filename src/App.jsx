import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import ChatWindow from './components/ChatWindow/ChatWindow';
import InputBar from './components/InputBar/InputBar';
import Header from './components/Header/Header';
import useChat from './hooks/useChat';
import Settings from './components/Settings/Settings';
import toast, { Toaster } from 'react-hot-toast';
import { saveAs } from 'file-saver';

const defaultSettings = {
  theme: 'dark',
  model: 'gpt-3.5-turbo',
  temperature: 0.7,
  messageColor: "#6c757d",
  messageBackground: "rgba(40, 40, 40, 0.05)",
  assistantMessageColor: "#212529",
  assistantMessageBackground: "rgba(255, 255, 255, 0.8)",
  webhook1: "",
  webhook1Name: "Webhook 1",
  webhook1Active: false,
  webhook2: "",
  webhook2Name: "Webhook 2",
  webhook2Active: false,
  webhook3: "",
  webhook3Name: "Webhook 3",
  webhook3Active: false,
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
  const [settings, setSettings] = useState(defaultSettings);

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
    
    // Salvar configurações
    localStorage.setItem('chatSettings', JSON.stringify(newSettings));
  };

  // Carregar configurações salvas
  useEffect(() => {
    const savedSettings = localStorage.getItem('chatSettings');
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings);
        setSettings(parsedSettings);
        updateSettings(parsedSettings);
      } catch (e) {
        console.error('Erro ao carregar configurações:', e);
      }
    }
  }, []);

  // Função para enviar para webhook
  const sendToWebhook = async (webhookUrl, message) => {
    if (!webhookUrl) return;
    
    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message,
          sessionId: sessionId,
          timestamp: new Date().toISOString()
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Erro ao enviar para webhook: ${response.status}`);
      }
      
      console.log('Enviado para webhook:', webhookUrl);
      return true;
    } catch (error) {
      console.error('Erro ao enviar para webhook:', error);
      toast.error(`Erro ao enviar para webhook: ${error.message}`);
      return false;
    }
  };

  // Função para enviar para todos os webhooks ativos
  const sendToActiveWebhooks = (message) => {
    if (settings.webhook1Active && settings.webhook1) {
      sendToWebhook(settings.webhook1, message);
    }
    
    if (settings.webhook2Active && settings.webhook2) {
      sendToWebhook(settings.webhook2, message);
    }
    
    if (settings.webhook3Active && settings.webhook3) {
      sendToWebhook(settings.webhook3, message);
    }
  };

  // Lidar com envio de mensagem
  const handleSendMessage = (text, mediaType = null, mediaUrl = null) => {
    if (!text.trim() && !mediaUrl) return;
    
    sendTextMessage(text, mediaType, mediaUrl);
    
    // Enviar para webhooks ativos
    sendToActiveWebhooks(text);
  };

  // Lidar com gravação de áudio
  const handleTranscribeAudio = async (audioBlob) => {
    try {
      const transcription = await transcribeAudio(audioBlob);
      return transcription;
    } catch (error) {
      console.error('Erro ao transcrever áudio:', error);
      toast.error('Erro ao processar áudio. Tente novamente.');
      return '';
    }
  };

  // Exportar conversa como TXT
  const exportAsTxt = () => {
    if (messages.length === 0) {
      toast.error('Não há mensagens para exportar');
      return;
    }
    
    let content = `Conversa exportada em ${new Date().toLocaleString()}\n\n`;
    
    messages.forEach(msg => {
      const role = msg.sender === 'human' ? 'Você' : 'Assistente';
      const time = new Date(msg.timestamp).toLocaleTimeString();
      content += `[${time}] ${role}:\n${msg.text}\n\n`;
    });
    
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, `chat-${sessionId.substring(0, 8)}.txt`);
    
    toast.success('Conversa exportada com sucesso');
  };

  // Exportar conversa como JSON
  const exportAsJson = () => {
    if (messages.length === 0) {
      toast.error('Não há mensagens para exportar');
      return;
    }
    
    const exportData = {
      sessionId,
      timestamp: new Date().toISOString(),
      messages: messages.map(msg => ({
        role: msg.sender === 'human' ? 'user' : 'assistant',
        content: msg.text,
        timestamp: msg.timestamp
      }))
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    saveAs(blob, `chat-${sessionId.substring(0, 8)}.json`);
    
    toast.success('Conversa exportada com sucesso');
  };

  return (
    <div className="app-container">
      <Toaster position="top-center" toastOptions={{ 
        duration: 3000,
        style: {
          background: theme === 'dark' ? 'var(--dark-surface)' : 'var(--surface)',
          color: theme === 'dark' ? 'var(--dark-text-primary)' : 'var(--text-primary)',
          boxShadow: 'var(--box-shadow)'
        }
      }} />
      
      <Header 
        sessionId={sessionId}
        onSessionChange={updateSessionId}
        onClearChat={clearMessages}
        settings={settings}
        onSettingsChange={updateSettings}
      />
      
      <main className="chat-main-container">
        <div className="chat-container">
          <ChatWindow 
            messages={messages} 
            loading={loading}
            error={error}
            messagesEndRef={messagesEndRef}
            isSmallScreen={isSmallScreen}
          />
          
          <div className="input-area-container">
            <InputBar 
              onSendText={handleSendMessage}
              onTranscribeAudio={handleTranscribeAudio}
              disabled={loading}
              isTyping={isTyping}
              onStartTyping={() => setIsTyping(true)}
              onStopTyping={() => setIsTyping(false)}
              placeholder="Digite uma mensagem ou use o microfone..."
              theme={theme}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
