/**
 * Configuração de temas para o aplicativo
 */
export const THEMES = {
  DARK: {
    name: 'dark',
    background: '#232323',
    textColor: '#ffffff',
    textSecondary: '#dddddd',
    surface: '#232323',
    card: '#232323',
    border: '#dddddd',
    primary: '#f71e4c',
    userMessageBg: 'linear-gradient(to right, #f71e4c, #ff4e75)',
    aiMessageBg: '#dddddd',
    inputBackground: '#232323',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    senderBubble: '#f71e4c',
    senderText: '#ffffff',
    receiverBubble: '#dddddd',
    receiverText: '#232323'
  },
  LIGHT: {
    name: 'light',
    background: '#ffffff',
    textColor: '#232323',
    textSecondary: '#232323',
    surface: '#ffffff',
    card: '#ffffff',
    border: '#dddddd',
    primary: '#f71e4c',
    userMessageBg: 'linear-gradient(to right, #f71e4c, #ff4e75)',
    aiMessageBg: '#dddddd',
    inputBackground: '#ffffff',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
    senderBubble: '#f71e4c',
    senderText: '#ffffff',
    receiverBubble: '#dddddd',
    receiverText: '#232323'
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
 * Configuração de animações - simplificadas
 */
export const ANIMATIONS = {
  MESSAGE_APPEAR: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.2 }
  },
  
  FADE_IN: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.2 }
  }
}; 