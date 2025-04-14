import { useState, useEffect } from 'react';

export default function useSession() {
  const [sessionId, setSessionId] = useState(() => {
    return localStorage.getItem('chatSessionId') || generateSessionId();
  });
  
  const [showSessionInput, setShowSessionInput] = useState(false);
  const [sessionInputValue, setSessionInputValue] = useState('');
  
  // Salvar sessionId no localStorage quando mudar
  useEffect(() => {
    localStorage.setItem('chatSessionId', sessionId);
  }, [sessionId]);
  
  // Gerar um sessionId único
  function generateSessionId() {
    const newSessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    return newSessionId;
  }
  
  // Atualizar sessionId manualmente
  const updateSessionId = (newSessionId) => {
    if (newSessionId && newSessionId.trim()) {
      setSessionId(newSessionId.trim());
      setShowSessionInput(false);
      setSessionInputValue('');
    }
  };
  
  // Iniciar nova sessão
  const startNewSession = () => {
    const newSessionId = generateSessionId();
    setSessionId(newSessionId);
  };
  
  // Alternar visibilidade do input de sessionId
  const toggleSessionInput = () => {
    setShowSessionInput(prev => !prev);
  };
  
  return {
    sessionId,
    showSessionInput,
    sessionInputValue,
    setSessionInputValue,
    updateSessionId,
    startNewSession,
    toggleSessionInput
  };
} 