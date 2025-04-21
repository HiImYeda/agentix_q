import React, { useState } from 'react';
import './Settings.css';

const Settings = ({ 
  settings = {}, // Valor padrão para evitar erros
  onSettingsChange,
  onClose
}) => {
  // Valores padrão caso settings não esteja definido ou não tenha certas propriedades
  const defaultSettings = {
    theme: 'dark',
    primaryColor: '#f71e4c', // Cor padrão para botões e bordas
    gradientStartColor: '#f71e4c', // Cor inicial do degradê do balão do usuário
    gradientEndColor: '#ff4e75', // Cor final do degradê do balão do usuário
    backgroundColor: '#ffffff', // Branco
    textColor: '#232323', // Preto
    borderColor: '#dddddd', // Cinza
    backgroundStyle: 'gradient', // grid, solid, gradient
    chatBgColor: '#090928', // Cor de fundo do chat
    messageBgColor: '#1e1e1e', // Cor de fundo dos balões de mensagem
    userMessageBgColor: '#232323', // Cor de fundo dos balões do usuário
    messageTextColor: '#ffffff', // Cor do texto das mensagens do sistema
    userMessageTextColor: '#ffffff', // Cor do texto das mensagens do usuário
    chatTextColor: '#ffffff', // Cor do texto geral do chat
    uiEffects: 'advanced', // basic, advanced, minimal
    messageCornerRadius: '10px', // Raio dos cantos dos balões de mensagem
    fontFamily: 'System', // Fonte do texto
    animationSpeed: 'normal', // Velocidade das animações
    containerColor: '#121236', // Cor do container principal
    // Configurações de webhooks
    webhook1: '',
    webhook2: '',
    webhook3: '',
    webhook1Name: 'Webhook 1',
    webhook2Name: 'Webhook 2',
    webhook3Name: 'Webhook 3',
    webhook1Active: true,
    webhook2Active: false,
    webhook3Active: false
  };
  
  // Estado temporário para as configurações
  const [tempSettings, setTempSettings] = useState({
    ...defaultSettings,
    ...settings
  });

  // Estado para controlar a aba ativa
  const [activeTab, setActiveTab] = useState('colors');

  const handleChange = (key, value) => {
    setTempSettings({
      ...tempSettings,
      [key]: value
    });
    
    // Aplicação imediata das cores
      const rootElement = document.querySelector('.root-container');
    const appContainer = document.querySelector('.app-container');
    const chatContainer = document.querySelector('.chat-container');
    const userMessages = document.querySelectorAll('.chat-message-user');
    const botMessages = document.querySelectorAll('.chat-message-bot');
    const buttons = document.querySelectorAll('.button');
    const scrollbarThumb = document.querySelector('::-webkit-scrollbar-thumb');
    
    // Aplicar cor de fundo
    if (key === 'backgroundColor' && rootElement) {
      document.body.style.backgroundColor = value;
        rootElement.style.backgroundColor = value;
      if (appContainer) {
        appContainer.style.backgroundColor = value;
      }
    }
    
    // Aplicar cor do texto
    if (key === 'textColor' && appContainer) {
      appContainer.style.color = value;
      document.body.style.color = value;
    }
    
    // Aplicar cor da borda
    if (key === 'borderColor' && appContainer) {
      appContainer.style.borderColor = value;
      if (chatContainer) {
        chatContainer.style.borderColor = value;
      }
      // Atualizar a cor de fundo das mensagens do bot
      botMessages.forEach(msg => {
        msg.style.backgroundColor = value;
        // Ajustar a cor do texto baseado na cor de fundo
        const textColor = tempSettings.backgroundColor === '#ffffff' ? '#232323' : '#ffffff';
        msg.style.color = textColor;
      });
    }
    
    // Aplicar cor dos botões
    if (key === 'primaryColor') {
      buttons.forEach(button => {
        button.style.borderColor = value;
        button.style.color = value;
      });
      
      const activeButtons = document.querySelectorAll('.button.active, .apply-button');
      activeButtons.forEach(button => {
        button.style.backgroundColor = value;
        button.style.color = '#ffffff';
      });
      
      // Atualizar cor do scrollbar
      document.documentElement.style.setProperty('--primary-color', value);
    }
    
    // Aplicar degradê nos balões de usuário
    if (key === 'gradientStartColor' || key === 'gradientEndColor') {
      const startColor = key === 'gradientStartColor' ? value : tempSettings.gradientStartColor;
      const endColor = key === 'gradientEndColor' ? value : tempSettings.gradientEndColor;
      
      userMessages.forEach(msg => {
        msg.style.background = `linear-gradient(to right, ${startColor}, ${endColor})`;
        msg.style.color = '#ffffff';
      });
    }
    
    // Garantir que o painel de configurações mantenha a aparência correta
      const settingsPanel = document.querySelector('.settings-panel');
      if (settingsPanel) {
      settingsPanel.style.backgroundColor = '#232323';
      settingsPanel.style.color = '#ffffff';
    }
  };

  const handleSelectChange = (e) => {
    handleChange(e.target.id, e.target.value);
  };

  const handleColorChange = (e) => {
    handleChange(e.target.name, e.target.value);
  };
  
  const handleApply = () => {
    if (onSettingsChange) {
      onSettingsChange(tempSettings);
    }
    if (onClose) {
      onClose();
    }
  };

  // Formatar hora atual para a pré-visualização das mensagens
  const getFormattedTime = () => {
    const now = new Date();
    return now.getHours().toString().padStart(2, '0') + ':' + 
           now.getMinutes().toString().padStart(2, '0');
  };

  return (
    <div 
      className="settings-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget && onClose) {
          onClose();
        }
      }}
    >
      <div className="settings-container">
        <div className="settings-panel">
          <div className="settings-header">
            <h2 className="settings-title">Configurações</h2>
            <button className="close-button" onClick={onClose}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          
          {/* Tabs */}
          <div className="settings-tabs">
            <button 
              className={`tab-button ${activeTab === 'colors' ? 'active' : ''}`} 
              onClick={() => setActiveTab('colors')}
            >
              Cores
            </button>
            <button 
              className={`tab-button ${activeTab === 'webhooks' ? 'active' : ''}`} 
              onClick={() => setActiveTab('webhooks')}
            >
              Webhooks
            </button>
          </div>
          
          <div className="settings-content">
            {/* Conteúdo da aba Cores */}
            {activeTab === 'colors' && (
              <div className="tab-content">
                {/* Coluna 1 */}
                <div>
                  <div className="settings-section">
                    <h3>Cores Base</h3>
                    
                    <div className="settings-option">
                      <label htmlFor="backgroundColor">Cor de Fundo</label>
                      <div className="color-options">
                        <button 
                          className="color-option" 
                          title="Branco"
                          onClick={() => handleChange('backgroundColor', '#ffffff')} 
                          style={{
                            backgroundColor: '#ffffff',
                            border: tempSettings.backgroundColor === '#ffffff' ? '2px solid var(--primary-color)' : '2px solid transparent',
                            color: '#232323'
                          }}
                        >Branco</button>
                        <button 
                          className="color-option" 
                          title="Preto"
                          onClick={() => handleChange('backgroundColor', '#232323')} 
                          style={{
                            backgroundColor: '#232323',
                            border: tempSettings.backgroundColor === '#232323' ? '2px solid var(--primary-color)' : '2px solid transparent',
                            color: '#ffffff'
                          }}
                        >Preto</button>
                        <button 
                          className="color-option" 
                          title="Cinza"
                          onClick={() => handleChange('backgroundColor', '#dddddd')} 
                          style={{
                            backgroundColor: '#dddddd',
                            border: tempSettings.backgroundColor === '#dddddd' ? '2px solid var(--primary-color)' : '2px solid transparent',
                            color: '#232323'
                          }}
                        >Cinza</button>
                      </div>
                    </div>

                    <div className="settings-option">
                      <label htmlFor="textColor">Cor do Texto</label>
                      <div className="color-options">
                        <button 
                          className="color-option" 
                          title="Branco"
                          onClick={() => handleChange('textColor', '#ffffff')} 
                          style={{
                            backgroundColor: '#ffffff',
                            border: tempSettings.textColor === '#ffffff' ? '2px solid var(--primary-color)' : '2px solid transparent',
                            color: '#232323'
                          }}
                        >Branco</button>
                        <button 
                          className="color-option" 
                          title="Preto"
                          onClick={() => handleChange('textColor', '#232323')} 
                          style={{
                            backgroundColor: '#232323',
                            border: tempSettings.textColor === '#232323' ? '2px solid var(--primary-color)' : '2px solid transparent',
                            color: '#ffffff'
                          }}
                        >Preto</button>
                      </div>
                    </div>

                    <div className="settings-option">
                      <label htmlFor="borderColor">Cor da Borda</label>
                      <div className="color-options">
                        <button 
                          className="color-option" 
                          title="Branco"
                          onClick={() => handleChange('borderColor', '#ffffff')} 
                          style={{
                            backgroundColor: '#ffffff',
                            border: tempSettings.borderColor === '#ffffff' ? '2px solid var(--primary-color)' : '2px solid transparent',
                            color: '#232323'
                          }}
                        >Branco</button>
                        <button 
                          className="color-option" 
                          title="Preto"
                          onClick={() => handleChange('borderColor', '#232323')} 
                          style={{
                            backgroundColor: '#232323',
                            border: tempSettings.borderColor === '#232323' ? '2px solid var(--primary-color)' : '2px solid transparent',
                            color: '#ffffff'
                          }}
                        >Preto</button>
                        <button 
                          className="color-option" 
                          title="Cinza"
                          onClick={() => handleChange('borderColor', '#dddddd')} 
                          style={{
                            backgroundColor: '#dddddd',
                            border: tempSettings.borderColor === '#dddddd' ? '2px solid var(--primary-color)' : '2px solid transparent',
                            color: '#232323'
                          }}
                        >Cinza</button>
                      </div>
                    </div>
                  </div>

                  <div className="settings-section">
                    <h3>Cores de Destaque</h3>
                    
                    <div className="settings-option">
                      <label htmlFor="primaryColor">Cor de Botões e Bordas</label>
                      <div className="color-picker-container">
                        <div className="color-preview" style={{backgroundColor: tempSettings.primaryColor}}></div>
                        <input
                          type="color"
                          id="primaryColor"
                          name="primaryColor"
                          value={tempSettings.primaryColor}
                          onChange={handleColorChange}
                          className="color-picker"
                        />
                        <span className="color-value">{tempSettings.primaryColor}</span>
                      </div>
                    </div>
                      </div>

                  <div className="settings-section">
                    <h3>Degradê dos Balões de Chat</h3>
                    
                    <div className="settings-option">
                      <label htmlFor="gradientStartColor">Cor Inicial do Degradê</label>
                      <div className="color-picker-container">
                        <div className="color-preview" style={{backgroundColor: tempSettings.gradientStartColor}}></div>
                        <input
                          type="color"
                          id="gradientStartColor"
                          name="gradientStartColor"
                          value={tempSettings.gradientStartColor}
                          onChange={handleColorChange}
                          className="color-picker"
                        />
                        <span className="color-value">{tempSettings.gradientStartColor}</span>
                      </div>
                    </div>
                    
                    <div className="settings-option">
                      <label htmlFor="gradientEndColor">Cor Final do Degradê</label>
                      <div className="color-picker-container">
                        <div className="color-preview" style={{backgroundColor: tempSettings.gradientEndColor}}></div>
                        <input
                          type="color"
                          id="gradientEndColor"
                          name="gradientEndColor"
                          value={tempSettings.gradientEndColor}
                          onChange={handleColorChange}
                          className="color-picker"
                        />
                        <span className="color-value">{tempSettings.gradientEndColor}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Coluna 2 */}
                <div>
                  <div className="settings-section">
                    <h3>Pré-visualização</h3>
                    <div className="preview-container" style={{backgroundColor: tempSettings.backgroundColor, color: tempSettings.textColor, border: `1px solid ${tempSettings.borderColor}`}}>
                      <div className="preview-header">
                        <span className="preview-title">Pré-visualização do Chat</span>
                      </div>
                      
                      <div className="preview-chat">
                        <div 
                          className="message-preview system-message" 
                          style={{
                            backgroundColor: tempSettings.borderColor,
                            color: tempSettings.backgroundColor === '#ffffff' ? '#232323' : '#ffffff',
                            borderRadius: '8px',
                            borderTopLeftRadius: '2px'
                          }}
                        >
                          <div className="message-content">
                            <span className="message-text">Olá! Como posso ajudar?</span>
                          </div>
                          <div className="message-time">{getFormattedTime()}</div>
                        </div>
                        
                        <div 
                          className="message-preview user-message" 
                          style={{
                            background: `linear-gradient(to right, ${tempSettings.gradientStartColor}, ${tempSettings.gradientEndColor})`,
                            color: '#ffffff',
                            borderRadius: '8px',
                            borderTopRightRadius: '2px'
                          }}
                        >
                          <div className="message-content">
                            <span className="message-text">Sobre inteligência artificial</span>
                          </div>
                          <div className="message-time">{getFormattedTime()}</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="preview-button-container" style={{marginTop: '20px'}}>
                      <button
                        className="preview-button"
                        style={{
                          backgroundColor: 'transparent',
                          color: tempSettings.primaryColor,
                          border: `1px solid ${tempSettings.primaryColor}`,
                          padding: '8px 16px',
                          borderRadius: '4px',
                          cursor: 'pointer'
                        }}
                      >
                        Botão Normal
                      </button>
                      <button
                        className="preview-button active"
                        style={{
                          backgroundColor: tempSettings.primaryColor,
                          color: '#ffffff',
                          border: `1px solid ${tempSettings.primaryColor}`,
                          padding: '8px 16px',
                          borderRadius: '4px',
                          marginLeft: '10px',
                          cursor: 'pointer'
                        }}
                      >
                        Botão Ativo
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Conteúdo da aba Webhooks */}
            {activeTab === 'webhooks' && (
              <div className="tab-content">
                <div className="webhooks-container">
                  <div className="settings-section webhook-section">
                    <h3 style={{color: "#00b3ff"}}>Configuração de Webhooks</h3>
                    <p style={{color: "white", marginBottom: "15px"}}>
                      Configure os webhooks para integrar com serviços externos.
                    </p>
                  
                    {/* Webhook de Transcrição */}
                    <div className="webhook-item">
                      <div className="webhook-header">
                        <div className="webhook-toggle">
                          <input 
                            type="checkbox" 
                            id="webhook1Active" 
                            checked={tempSettings.webhook1Active}
                            onChange={(e) => handleChange('webhook1Active', e.target.checked)}
                          />
                          <label htmlFor="webhook1Active" style={{color: "white"}}>Ativo</label>
                        </div>
                        <span style={{color: "white", fontWeight: "bold", marginLeft: "10px"}}>
                          Transcrição de Áudio
                        </span>
                      </div>
                      <p style={{color: "#a0aec0", marginBottom: "10px", fontSize: "0.9rem"}}>
                        Endpoint para processar a transcrição de áudio para texto.
                      </p>
                      <div className="webhook-url">
                        <input
                          type="url"
                          placeholder="URL do Webhook de Transcrição (https://...)"
                          value={tempSettings.webhook1}
                          onChange={(e) => handleChange('webhook1', e.target.value)}
                          className="webhook-input"
                          style={{backgroundColor: "#1e1e4f", color: "white"}}
                        />
                      </div>
                    </div>

                    {/* Webhook de Mensagens */}
                    <div className="webhook-item">
                      <div className="webhook-header">
                        <div className="webhook-toggle">
                          <input 
                            type="checkbox" 
                            id="webhook2Active" 
                            checked={tempSettings.webhook2Active}
                            onChange={(e) => handleChange('webhook2Active', e.target.checked)}
                          />
                          <label htmlFor="webhook2Active" style={{color: "white"}}>Ativo</label>
                        </div>
                        <span style={{color: "white", fontWeight: "bold", marginLeft: "10px"}}>
                          Processamento de Mensagens
                        </span>
                      </div>
                      <p style={{color: "#a0aec0", marginBottom: "10px", fontSize: "0.9rem"}}>
                        Endpoint para processar e responder às mensagens do chat.
                      </p>
                      <div className="webhook-url">
                        <input
                          type="url"
                          placeholder="URL do Webhook de Mensagens (https://...)"
                          value={tempSettings.webhook2}
                          onChange={(e) => handleChange('webhook2', e.target.value)}
                          className="webhook-input"
                          style={{backgroundColor: "#1e1e4f", color: "white"}}
                        />
                      </div>
                    </div>

                    {/* Webhook de Histórico */}
                    <div className="webhook-item">
                      <div className="webhook-header">
                        <div className="webhook-toggle">
                          <input 
                            type="checkbox" 
                            id="webhook3Active" 
                            checked={tempSettings.webhook3Active}
                            onChange={(e) => handleChange('webhook3Active', e.target.checked)}
                          />
                          <label htmlFor="webhook3Active" style={{color: "white"}}>Ativo</label>
                        </div>
                        <span style={{color: "white", fontWeight: "bold", marginLeft: "10px"}}>
                          Histórico de Conversas
                        </span>
                      </div>
                      <p style={{color: "#a0aec0", marginBottom: "10px", fontSize: "0.9rem"}}>
                        Endpoint para salvar e recuperar o histórico de conversas.
                      </p>
                      <div className="webhook-url">
                        <input
                          type="url"
                          placeholder="URL do Webhook de Histórico (https://...)"
                          value={tempSettings.webhook3}
                          onChange={(e) => handleChange('webhook3', e.target.value)}
                          className="webhook-input"
                          style={{backgroundColor: "#1e1e4f", color: "white"}}
                        />
                      </div>
                    </div>

                    <div className="webhook-info" style={{color: "#a0aec0", marginTop: "20px"}}>
                      <p>Os webhooks permitem que o chat se conecte a APIs externas para processamento adicional.</p>
                      <p>Use webhooks para conectar o chat a modelos de IA, bancos de dados ou outros serviços.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="settings-footer">
            <p className="settings-version" style={{color: "white"}}>Versão 1.0.0</p>
            <button 
              className="apply-button" 
              onClick={handleApply}
              style={{
                backgroundColor: tempSettings.primaryColor,
                color: '#ffffff',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              Aplicar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;