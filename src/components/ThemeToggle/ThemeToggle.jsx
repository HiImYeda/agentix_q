import React from 'react';
import { motion } from 'framer-motion';

const ThemeToggle = ({ isDarkMode, toggleTheme }) => {
  return (
    <div className="absolute top-4 right-4 z-10">
      <motion.button
        className={`
          relative w-14 h-7 rounded-full p-1 shadow-md overflow-hidden
          ${isDarkMode ? 'bg-dark-card' : 'bg-light-card border border-light-border'}
        `}
        onClick={toggleTheme}
        whileTap={{ scale: 0.95 }}
        aria-label={isDarkMode ? "Mudar para modo claro" : "Mudar para modo escuro"}
      >
        {/* Background gradiente animado */}
        <motion.div 
          className="absolute inset-0 z-0"
          style={{
            background: isDarkMode 
              ? 'linear-gradient(to right, #121212, #2d3748)' 
              : 'linear-gradient(to right, #e2e8f0, #ffffff)'
          }}
          initial={false}
          animate={{ opacity: isDarkMode ? 1 : 0 }}
          transition={{ duration: 0.6 }}
        />
        
        {/* Botão deslizante */}
        <motion.div
          className={`
            z-10 relative w-5 h-5 rounded-full shadow-md flex items-center justify-center
            ${isDarkMode ? 'bg-primary' : 'bg-white'}
          `}
          initial={false}
          animate={{
            x: isDarkMode ? 26 : 0,
            backgroundColor: isDarkMode ? '#2B5AFF' : '#FFFFFF'
          }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        >
          {/* Ícones Sol/Lua com animação de opacidade */}
          <motion.svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-3.5 w-3.5 text-white absolute"
            viewBox="0 0 20 20" 
            fill="currentColor"
            initial={false}
            animate={{ opacity: isDarkMode ? 1 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
          </motion.svg>
          
          <motion.svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-3.5 w-3.5 text-yellow-400 absolute"
            viewBox="0 0 20 20" 
            fill="currentColor"
            initial={false}
            animate={{ opacity: isDarkMode ? 0 : 1 }}
            transition={{ duration: 0.2 }}
          >
            <path 
              fillRule="evenodd" 
              d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" 
              clipRule="evenodd" 
            />
          </motion.svg>
        </motion.div>
        
        {/* Estrelas animadas (visíveis apenas no modo escuro) */}
        {isDarkMode && (
          <>
            <motion.div 
              className="absolute w-1 h-1 bg-white rounded-full"
              style={{ top: '30%', left: '20%' }}
              animate={{ 
                opacity: [0, 1, 0],
                scale: [0.8, 1, 0.8],
              }}
              transition={{ duration: 3, repeat: Infinity, delay: 0.2 }}
            />
            <motion.div 
              className="absolute w-0.5 h-0.5 bg-white rounded-full"
              style={{ top: '50%', left: '40%' }}
              animate={{ 
                opacity: [0, 1, 0],
                scale: [0.8, 1, 0.8],
              }}
              transition={{ duration: 2.5, repeat: Infinity, delay: 1.5 }}
            />
          </>
        )}
      </motion.button>
    </div>
  );
};

export default ThemeToggle; 