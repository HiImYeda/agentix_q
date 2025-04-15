import React, { useState } from 'react';
import { FaRobot } from 'react-icons/fa';
import './Header.css';
import { v4 as uuidv4 } from 'uuid';
import Settings from '../Settings/Settings';
import ReactDOM from 'react-dom';

const Header = ({ 
  sessionId, 
  onSessionChange, 
  onClearChat, 
  isDarkMode, 
  onThemeToggle,
  settings,
  onSettingsChange
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempSessionId, setTempSessionId] = useState(sessionId);
  const [showSettings, setShowSettings] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSessionChange(tempSessionId);
    setIsEditing(false);
  };

  const handleNewChat = () => {
    const newSessionId = uuidv4();
    onSessionChange(newSessionId);
    onClearChat();
  };

  // Portal para renderizar o componente Settings
  const SettingsPortal = () => {
    return showSettings ? ReactDOM.createPortal(
      <Settings 
        settings={settings} 
        onSettingsChange={onSettingsChange} 
        onClose={() => setShowSettings(false)}
      />,
      document.body
    ) : null;
  };

  return (
    <header className="header">
      <div className="header-content">
        <div className="header-left">
          <div className="header-logo">
            <FaRobot size={24} color="var(--neon-blue)" />
            <h1 className="header-title">Agentix</h1>
          </div>
          
          <div className="session-control">
            {isEditing ? (
              <form className="session-form" onSubmit={handleSubmit}>
                <input
                  type="text"
                  className="session-input"
                  value={tempSessionId}
                  onChange={(e) => setTempSessionId(e.target.value)}
                  placeholder="Digite o ID da sessão"
                  autoFocus
                />
                <button type="submit" className="header-btn">
                  <span>Salvar</span>
                </button>
              </form>
            ) : (
              <div className="session-display" onClick={() => setIsEditing(true)}>
                <span className="session-id">{sessionId}</span>
              </div>
            )}
          </div>
        </div>

        <div className="header-actions">
          <button 
            className="header-btn new-chat-button" 
            onClick={handleNewChat}
            title="Iniciar novo chat"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="button-icon">
              <path d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32L19.513 8.2z" />
            </svg>
            <span>Novo Chat</span>
          </button>

          <button 
            className="header-btn settings-btn" 
            onClick={() => setShowSettings(!showSettings)}
            title="Configurações"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="button-icon">
              <path fillRule="evenodd" d="M11.078 2.25c-.917 0-1.699.663-1.85 1.567L9.05 4.889c-.02.12-.115.26-.297.348a7.493 7.493 0 00-.986.57c-.166.115-.334.126-.45.083L6.3 5.508a1.875 1.875 0 00-2.282.819l-.922 1.597a1.875 1.875 0 00.432 2.385l.84.692c.095.078.17.229.154.43a7.598 7.598 0 000 1.139c.015.2-.059.352-.153.43l-.841.692a1.875 1.875 0 00-.432 2.385l.922 1.597a1.875 1.875 0 002.282.818l1.019-.382c.115-.043.283-.031.45.082.312.214.641.405.985.57.182.088.277.228.297.35l.178 1.071c.151.904.933 1.567 1.85 1.567h1.844c.916 0 1.699-.663 1.85-1.567l.178-1.072c.02-.12.114-.26.297-.349.344-.165.673-.356.985-.57.167-.114.335-.125.45-.082l1.02.382a1.875 1.875 0 002.28-.819l.923-1.597a1.875 1.875 0 00-.432-2.385l-.84-.692c-.095-.078-.17-.229-.154-.43a7.614 7.614 0 000-1.139c-.016-.2.059-.352.153-.43l.84-.692c.708-.582.891-1.59.433-2.385l-.922-1.597a1.875 1.875 0 00-2.282-.818l-1.02.382c-.114.043-.282.031-.449-.083a7.49 7.49 0 00-.985-.57c-.183-.087-.277-.227-.297-.348l-.179-1.072a1.875 1.875 0 00-1.85-1.567h-1.843zM12 15.75a3.75 3.75 0 100-7.5 3.75 3.75 0 000 7.5z" clipRule="evenodd" />
            </svg>
          </button>

          <button 
            className="header-btn theme-btn" 
            onClick={onThemeToggle}
            title={isDarkMode ? "Mudar para tema claro" : "Mudar para tema escuro"}
          >
            {isDarkMode ? (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="button-icon">
                <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="button-icon">
                <path fillRule="evenodd" d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z" clipRule="evenodd" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Renderizar o portal do Settings */}
      <SettingsPortal />
    </header>
  );
};

export default Header; 