import React, { useState } from 'react';
import { FaMoon, FaSun, FaTrash, FaRobot, FaKey } from 'react-icons/fa';
import './Header.css';

const Header = ({ 
  sessionId, 
  onSessionChange, 
  onClearChat, 
  isDarkMode, 
  onThemeToggle 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempSessionId, setTempSessionId] = useState(sessionId);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSessionChange(tempSessionId);
    setIsEditing(false);
  };

  return (
    <header className="app-header">
      <div className="header-logo">
        <FaRobot size={24} color="var(--neon-blue)" />
        <h1 className="app-title">Agentix</h1>
        <span className="app-version">v1.0</span>
      </div>

      <div className="header-actions">
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
              <FaKey size={14} />
              <span className="session-id">{sessionId}</span>
            </div>
          )}
        </div>

        <button className="header-btn clear-btn" onClick={onClearChat}>
          <FaTrash size={14} />
          <span>Limpar</span>
        </button>

        <button className="header-btn theme-btn" onClick={onThemeToggle}>
          {isDarkMode ? <FaSun size={14} /> : <FaMoon size={14} />}
          <span>{isDarkMode ? 'Claro' : 'Escuro'}</span>
        </button>
      </div>
    </header>
  );
};

export default Header; 