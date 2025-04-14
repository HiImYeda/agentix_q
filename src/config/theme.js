/**
 * Configuração de temas para o aplicativo
 */
export const THEMES = {
  DARK: {
    name: 'dark',
    background: 'linear-gradient(135deg, #121212, #1e1e1e, #242424)',
    textColor: '#f5f5f5',
    textSecondary: '#b0b0b0',
    surface: '#2a2a2a',
    card: '#2a2a2a',
    border: '#444444',
    primary: '#f71e4c',
    primaryLight: '#4F7CFF',
    primaryDark: '#1240D6',
    accent: '#FF3366',
    success: '#2ecc71',
    warning: '#f39c12',
    error: '#f71e4c',
    userMessageBg: 'linear-gradient(to bottom right, #2B5AFF, #4F7CFF)',
    aiMessageBg: '#3a3a3a',
    inputBackground: '#333333',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
    highlightColor: '#f71e4c',
    shadowColor: 'rgba(0, 0, 0, 0.3)',
    successColor: '#2ecc71',
    warningColor: '#f39c12',
    infoColor: '#3498db',
    senderBubble: '#f71e4c',
    senderText: '#ffffff',
    receiverBubble: '#3a3a3a',
    receiverText: '#f5f5f5'
  },
  LIGHT: {
    name: 'light',
    background: 'linear-gradient(135deg, #f8f9fa, #e9ecef, #f1f3f5)',
    textColor: '#333333',
    textSecondary: '#717171',
    surface: '#ffffff',
    card: '#ffffff',
    border: '#e0e0e0',
    primary: '#f71e4c',
    primaryLight: '#4F7CFF',
    primaryDark: '#1240D6',
    accent: '#FF3366',
    success: '#28a745',
    warning: '#ffc107',
    error: '#f71e4c',
    userMessageBg: 'linear-gradient(to bottom right, #2B5AFF, #4F7CFF)',
    aiMessageBg: '#f0f0f0',
    inputBackground: '#f5f5f5',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
    highlightColor: '#f71e4c',
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    successColor: '#28a745',
    warningColor: '#ffc107',
    infoColor: '#17a2b8',
    senderBubble: '#f71e4c',
    senderText: '#ffffff',
    receiverBubble: '#f0f0f0',
    receiverText: '#333333'
  }
};

/**
 * Obtém as cores do tema atual
 * @param {boolean} isDarkMode - Se o modo escuro está ativo
 * @returns {Object} Cores do tema
 */
export const getThemeColors = (isDarkMode) => {
  return isDarkMode ? THEMES.DARK : THEMES.LIGHT;
};

/**
 * Configuração de animações
 */
export const ANIMATIONS = {
  MESSAGE_APPEAR: {
    initial: { opacity: 0, y: 10, scale: 0.98 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, scale: 0.95, y: 10 },
    transition: { type: 'spring', damping: 25, stiffness: 500 }
  },
  
  FADE_IN: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.2 }
  },
  
  SLIDE_UP: {
    initial: { y: 20, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: 20, opacity: 0 },
    transition: { type: 'spring', damping: 25, stiffness: 500 }
  },
  
  SLIDE_RIGHT: {
    initial: { x: -20, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: -20, opacity: 0 },
    transition: { type: 'spring', damping: 25, stiffness: 500 }
  },
  
  SCALE: {
    initial: { scale: 0.9, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.9, opacity: 0 },
    transition: { type: 'spring', damping: 25, stiffness: 500 }
  },
  
  PULSE: {
    animate: { 
      scale: [1, 1.03, 1],
      opacity: [0.8, 1, 0.8]
    },
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
}; 