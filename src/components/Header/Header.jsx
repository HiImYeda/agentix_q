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
          <div className="logo">
            <div className="logo-icon-container">
              <FaRobot className="logo-icon" />
            </div>
            <span className="logo-text">Agentix</span>
          </div>
          
          {isEditing ? (
            <form onSubmit={handleSubmit} className="session-id-form">
              <input
                type="text"
                value={tempSessionId}
                onChange={(e) => setTempSessionId(e.target.value)}
                className="session-id-input"
              />
              <button type="submit" className="header-btn">Salvar</button>
            </form>
          ) : (
            <div className="session-id" onClick={() => setIsEditing(true)}>
              {sessionId}
            </div>
          )}
        </div>
        
        <div className="header-right">
          <button 
            className="header-btn new-chat-btn" 
            onClick={handleNewChat}
            title="Iniciar novo chat"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="button-icon">
              <path fillRule="evenodd" d="M12 3.75a.75.75 0 01.75.75v6.75h6.75a.75.75 0 010 1.5h-6.75v6.75a.75.75 0 01-1.5 0v-6.75H4.5a.75.75 0 010-1.5h6.75V4.5a.75.75 0 01.75-.75z" clipRule="evenodd" />
            </svg>
          </button>
          
          <button 
            className="header-btn settings-btn" 
            onClick={() => setShowSettings(true)}
            title="Abrir configurações"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="button-icon">
              <path fillRule="evenodd" d="M11.078 2.25c-.917 0-1.699.663-1.85 1.567L9.05 4.889c-.02.12-.115.26-.297.348a7.493 7.493 0 00-.986.57c-.166.115-.334.126-.45.083L6.3 5.508a1.875 1.875 0 00-2.282.819l-.922 1.597a1.875 1.875 0 00.432 2.385l.84.692c.095.078.17.229.154.43a7.598 7.598 0 000 1.139c.015.2-.059.352-.153.43l-.841.692a1.875 1.875 0 00-.432 2.385l.922 1.597a1.875 1.875 0 002.282.818l1.019-.382c.115-.043.283-.031.45.082.312.214.641.405.985.57.182.088.277.228.297.35l.178 1.071c.151.904.933 1.567 1.85 1.567h1.844c.916 0 1.699-.663 1.85-1.567l.178-1.072c.02-.12.114-.26.297-.349.344-.165.673-.356.985-.57.167-.114.335-.125.45-.082l1.02.382a1.875 1.875 0 002.28-.819l.923-1.597a1.875 1.875 0 00-.432-2.385l-.84-.692c-.095-.078-.17-.229-.154-.43a7.614 7.614 0 000-1.139c-.016-.2.059-.352.153-.43l.84-.692c.708-.582.891-1.59.433-2.385l-.922-1.597a1.875 1.875 0 00-2.282-.818l-1.02.382c-.114.043-.282.031-.449-.083a7.49 7.49 0 00-.985-.57c-.183-.087-.277-.227-.297-.348l-.179-1.072a1.875 1.875 0 00-1.85-1.567h-1.843zM12 15.75a3.75 3.75 0 100-7.5 3.75 3.75 0 000 7.5z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>

      {/* Renderizar o portal do Settings */}
      <SettingsPortal />
    </header>
  );
};

export default Header; 