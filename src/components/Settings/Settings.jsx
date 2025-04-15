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
    primaryColor: '#00b3ff', // Neon azul padrão
    accentColor: '#ff00ff', // Neon roxo padrão
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
    animationSpeed: 'normal' // Velocidade das animações
  };
  
  // Estado temporário para as configurações
  const [tempSettings, setTempSettings] = useState({
    ...defaultSettings,
    ...settings
  });

  const handleChange = (key, value) => {
    setTempSettings({
      ...tempSettings,
      [key]: value
    });
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
          
          <div className="settings-content">
            {/* Coluna 1 */}
            <div>
              <div className="settings-section">
                <h3 style={{color: "#00b3ff"}}>Aparência</h3>
                <div className="settings-option">
                  <label htmlFor="theme" style={{color: "white"}}>Tema</label>
                  <select 
                    id="theme" 
                    value={tempSettings.theme} 
                    onChange={handleSelectChange}
                    style={{color: "white", backgroundColor: "#1e1e4f"}}
                  >
                    <option value="dark">Escuro</option>
                    <option value="light">Claro</option>
                    <option value="system">Sistema</option>
                  </select>
                </div>
                
                <div className="settings-option">
                  <label htmlFor="backgroundStyle" style={{color: "white"}}>Estilo de Fundo</label>
                  <select 
                    id="backgroundStyle" 
                    value={tempSettings.backgroundStyle} 
                    onChange={handleSelectChange}
                    style={{color: "white", backgroundColor: "#1e1e4f"}}
                  >
                    <option value="grid">Grade</option>
                    <option value="gradient">Gradiente</option>
                    <option value="solid">Sólido</option>
                  </select>
                </div>
                
                <div className="settings-option">
                  <label htmlFor="uiEffects" style={{color: "white"}}>Efeitos Visuais</label>
                  <select 
                    id="uiEffects" 
                    value={tempSettings.uiEffects} 
                    onChange={handleSelectChange}
                    style={{color: "white", backgroundColor: "#1e1e4f"}}
                  >
                    <option value="advanced">Avançados</option>
                    <option value="basic">Básicos</option>
                    <option value="minimal">Mínimos</option>
                  </select>
                </div>
                
                <div className="settings-option">
                  <label htmlFor="fontFamily" style={{color: "white"}}>Fonte</label>
                  <select 
                    id="fontFamily" 
                    value={tempSettings.fontFamily} 
                    onChange={handleSelectChange}
                    style={{color: "white", backgroundColor: "#1e1e4f"}}
                  >
                    <option value="System">Padrão do Sistema</option>
                    <option value="Roboto">Roboto</option>
                    <option value="Montserrat">Montserrat</option>
                    <option value="SpaceMono">Space Mono</option>
                  </select>
                </div>
                
                <div className="settings-option">
                  <label htmlFor="animationSpeed" style={{color: "white"}}>Velocidade das Animações</label>
                  <select 
                    id="animationSpeed" 
                    value={tempSettings.animationSpeed} 
                    onChange={handleSelectChange}
                    style={{color: "white", backgroundColor: "#1e1e4f"}}
                  >
                    <option value="slow">Lenta</option>
                    <option value="normal">Normal</option>
                    <option value="fast">Rápida</option>
                    <option value="off">Desativadas</option>
                  </select>
                </div>
              </div>

              <div className="settings-section">
                <h3 style={{color: "#00b3ff"}}>Cores Principais</h3>
                <div className="color-presets">
                  <span className="presets-label" style={{color: "white"}}>Temas rápidos:</span>
                  <div className="preset-buttons">
                    <button 
                      className="preset-button cyberpunk"
                      onClick={() => {
                        setTempSettings({
                          ...tempSettings,
                          primaryColor: '#00b3ff',
                          accentColor: '#ff00ff',
                          chatBgColor: '#090928',
                          messageBgColor: '#1e1e1e',
                          userMessageBgColor: '#232323'
                        });
                      }}
                      title="Tema Cyberpunk"
                    ></button>
                    <button 
                      className="preset-button synthwave"
                      onClick={() => {
                        setTempSettings({
                          ...tempSettings,
                          primaryColor: '#ff2a6d',
                          accentColor: '#05d9e8',
                          chatBgColor: '#1a1a2e',
                          messageBgColor: '#262640',
                          userMessageBgColor: '#2e275e'
                        });
                      }}
                      title="Tema Synthwave"
                    ></button>
                    <button 
                      className="preset-button matrix"
                      onClick={() => {
                        setTempSettings({
                          ...tempSettings,
                          primaryColor: '#00ff41',
                          accentColor: '#8bff8b',
                          chatBgColor: '#0d0208',
                          messageBgColor: '#143601',
                          userMessageBgColor: '#1a4301'
                        });
                      }}
                      title="Tema Matrix"
                    ></button>
                    <button 
                      className="preset-button pastel"
                      onClick={() => {
                        setTempSettings({
                          ...tempSettings,
                          primaryColor: '#ffafcc',
                          accentColor: '#a2d2ff',
                          chatBgColor: '#2b2d42',
                          messageBgColor: '#3d405b',
                          userMessageBgColor: '#4a4e69'
                        });
                      }}
                      title="Tema Pastel"
                    ></button>
                  </div>
                </div>
                
                <div className="settings-option">
                  <label htmlFor="primaryColor" style={{color: "white"}}>Cor Primária</label>
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

                <div className="settings-option">
                  <label htmlFor="accentColor" style={{color: "white"}}>Cor de Destaque</label>
                  <div className="color-picker-container">
                    <div className="color-preview" style={{backgroundColor: tempSettings.accentColor}}></div>
                    <input
                      type="color"
                      id="accentColor"
                      name="accentColor"
                      value={tempSettings.accentColor}
                      onChange={handleColorChange}
                      className="color-picker"
                    />
                    <span className="color-value">{tempSettings.accentColor}</span>
                  </div>
                </div>
                
                <div className="settings-option">
                  <label htmlFor="chatBgColor" style={{color: "white"}}>Cor de Fundo do Chat</label>
                  <div className="color-picker-container">
                    <div className="color-preview" style={{backgroundColor: tempSettings.chatBgColor}}></div>
                    <input
                      type="color"
                      id="chatBgColor"
                      name="chatBgColor"
                      value={tempSettings.chatBgColor}
                      onChange={handleColorChange}
                      className="color-picker"
                    />
                    <span className="color-value">{tempSettings.chatBgColor}</span>
                  </div>
                </div>
                
                <div className="settings-option">
                  <label htmlFor="chatTextColor" style={{color: "white"}}>Cor do Texto do Chat</label>
                  <div className="color-picker-container">
                    <div className="color-preview" style={{backgroundColor: tempSettings.chatTextColor}}></div>
                    <input
                      type="color"
                      id="chatTextColor"
                      name="chatTextColor"
                      value={tempSettings.chatTextColor}
                      onChange={handleColorChange}
                      className="color-picker"
                    />
                    <span className="color-value">{tempSettings.chatTextColor}</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Coluna 2 */}
            <div>
              <div className="settings-section">
                <h3 style={{color: "#00b3ff"}}>Balões de Mensagem</h3>
                <div className="settings-option">
                  <label htmlFor="messageBgColor" style={{color: "white"}}>Fundo das Mensagens do Sistema</label>
                  <div className="color-picker-container">
                    <div className="color-preview" style={{backgroundColor: tempSettings.messageBgColor}}></div>
                    <input
                      type="color"
                      id="messageBgColor"
                      name="messageBgColor"
                      value={tempSettings.messageBgColor}
                      onChange={handleColorChange}
                      className="color-picker"
                    />
                    <span className="color-value">{tempSettings.messageBgColor}</span>
                  </div>
                </div>
                
                <div className="settings-option">
                  <label htmlFor="messageTextColor" style={{color: "white"}}>Texto das Mensagens do Sistema</label>
                  <div className="color-picker-container">
                    <div className="color-preview" style={{backgroundColor: tempSettings.messageTextColor}}></div>
                    <input
                      type="color"
                      id="messageTextColor"
                      name="messageTextColor"
                      value={tempSettings.messageTextColor}
                      onChange={handleColorChange}
                      className="color-picker"
                    />
                    <span className="color-value">{tempSettings.messageTextColor}</span>
                  </div>
                </div>
                
                <div className="settings-option">
                  <label htmlFor="userMessageBgColor" style={{color: "white"}}>Fundo das Mensagens do Usuário</label>
                  <div className="color-picker-container">
                    <div className="color-preview" style={{backgroundColor: tempSettings.userMessageBgColor}}></div>
                    <input
                      type="color"
                      id="userMessageBgColor"
                      name="userMessageBgColor"
                      value={tempSettings.userMessageBgColor}
                      onChange={handleColorChange}
                      className="color-picker"
                    />
                    <span className="color-value">{tempSettings.userMessageBgColor}</span>
                  </div>
                </div>
                
                <div className="settings-option">
                  <label htmlFor="userMessageTextColor" style={{color: "white"}}>Texto das Mensagens do Usuário</label>
                  <div className="color-picker-container">
                    <div className="color-preview" style={{backgroundColor: tempSettings.userMessageTextColor}}></div>
                    <input
                      type="color"
                      id="userMessageTextColor"
                      name="userMessageTextColor"
                      value={tempSettings.userMessageTextColor}
                      onChange={handleColorChange}
                      className="color-picker"
                    />
                    <span className="color-value">{tempSettings.userMessageTextColor}</span>
                  </div>
                </div>
                
                <div className="settings-option">
                  <label htmlFor="messageCornerRadius" style={{color: "white"}}>Raio dos Cantos dos Balões</label>
                  <div className="range-container">
                    <input
                      type="range"
                      id="messageCornerRadius"
                      name="messageCornerRadius"
                      min="0"
                      max="20"
                      step="1"
                      value={parseInt(tempSettings.messageCornerRadius) || 10}
                      onChange={(e) => handleChange('messageCornerRadius', `${e.target.value}px`)}
                    />
                    <span style={{color: "white"}}>{tempSettings.messageCornerRadius}</span>
                  </div>
                </div>
              </div>
              
              <div className="settings-section">
                <h3 style={{color: "#00b3ff"}}>Pré-visualização</h3>
                <div className="preview-container" style={{backgroundColor: tempSettings.chatBgColor}}>
                  <div className="preview-header">
                    <span className="preview-title" style={{color: "white"}}>Pré-visualização do Chat</span>
                  </div>
                  
                  <div className="preview-chat">
                    <div 
                      className="message-preview system-message" 
                      style={{
                        backgroundColor: tempSettings.messageBgColor,
                        color: tempSettings.messageTextColor,
                        borderRadius: tempSettings.messageCornerRadius,
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
                        backgroundColor: tempSettings.userMessageBgColor,
                        color: tempSettings.userMessageTextColor,
                        borderRadius: tempSettings.messageCornerRadius,
                        borderTopRightRadius: '2px'
                      }}
                    >
                      <div className="message-content">
                        <span className="message-text">Sobre inteligência artificial</span>
                      </div>
                      <div className="message-time">{getFormattedTime()}</div>
                    </div>
                    
                    <div 
                      className="message-preview system-message" 
                      style={{
                        backgroundColor: tempSettings.messageBgColor,
                        color: tempSettings.messageTextColor,
                        borderRadius: tempSettings.messageCornerRadius,
                        borderTopLeftRadius: '2px'
                      }}
                    >
                      <div className="message-content">
                        <span className="message-text">A IA é um campo da computação...</span>
                      </div>
                      <div className="message-time">{getFormattedTime()}</div>
                    </div>
                  </div>
                </div>
                
                <div className="preview-info">
                  <div className="effects-preview" data-effects={tempSettings.uiEffects}>
                    <span style={{color: "#00b3ff"}}>Efeitos visuais: {tempSettings.uiEffects}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="settings-footer">
            <p className="settings-version" style={{color: "white"}}>Versão 1.0.0</p>
            <button 
              className="apply-button" 
              onClick={handleApply}
              style={{
                backgroundColor: "#00b3ff",
                color: "#121236",
                fontWeight: "bold",
                padding: "10px 20px",
                fontSize: "1rem"
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