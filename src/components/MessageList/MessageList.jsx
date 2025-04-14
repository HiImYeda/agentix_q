import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';
import Message from '../Message/Message';
import { ANIMATIONS } from '../../config/theme';

/**
 * Componente que exibe a lista de mensagens do chat
 */
const MessageList = ({ messages, isLoading, isDarkMode }) => {
  const messagesEndRef = useRef(null);

  // Rola automaticamente para a mensagem mais recente
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <motion.div 
      className={`flex-1 overflow-y-auto p-4 ${
        isDarkMode ? 'bg-dark' : 'bg-light'
      } scrollbar-thin scrollbar-thumb-rounded-full ${
        isDarkMode 
          ? 'scrollbar-thumb-gray-700 scrollbar-track-dark' 
          : 'scrollbar-thumb-gray-300 scrollbar-track-gray-100'
      }`}
      initial="hidden"
      animate="visible"
      variants={ANIMATIONS.FADE_IN}
    >
      {messages.length === 0 && !isLoading ? (
        <motion.div 
          className="h-full flex flex-col items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className={`text-center p-6 rounded-2xl ${
            isDarkMode ? 'bg-dark-card' : 'bg-light-card'
          } shadow-soft max-w-md`}>
            <div className="mb-4">
              <motion.div 
                className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center ${
                  isDarkMode ? 'bg-dark-hover' : 'bg-light-hover'
                }`}
                animate={{ 
                  scale: [1, 1.05, 1],
                  opacity: [0.8, 1, 0.8],
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className={`h-8 w-8 ${isDarkMode ? 'text-primary' : 'text-primary-light'}`} 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" 
                  />
                </svg>
              </motion.div>
            </div>
            <h3 className={`text-lg font-semibold mb-2 ${
              isDarkMode ? 'text-white' : 'text-dark'
            }`}>
              Bem-vindo ao Chat N8N
            </h3>
            <p className={`text-sm ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Digite sua primeira mensagem para iniciar uma conversa com a IA.
            </p>
          </div>
        </motion.div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {messages.map((message, index) => (
              <motion.div
                key={index}
                variants={ANIMATIONS.MESSAGE_APPEAR}
                initial="initial"
                animate="animate"
                exit="exit"
                custom={index}
                layout
              >
                <Message
                  message={message}
                  isDarkMode={isDarkMode}
                  isLast={index === messages.length - 1}
                />
              </motion.div>
            ))}
          </AnimatePresence>
          
          {isLoading && (
            <motion.div 
              className={`flex gap-2 justify-center p-3 rounded-full w-24 mx-auto ${
                isDarkMode ? 'bg-dark-card' : 'bg-light-hover'
              }`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className={`w-2 h-2 rounded-full ${
                    isDarkMode ? 'bg-primary' : 'bg-primary-light'
                  }`}
                  animate={{
                    y: ["0%", "-50%", "0%"],
                    opacity: [0.5, 1, 0.5]
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    delay: i * 0.2,
                    ease: "easeInOut"
                  }}
                />
              ))}
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>
      )}
    </motion.div>
  );
};

MessageList.propTypes = {
  messages: PropTypes.arrayOf(
    PropTypes.shape({
      content: PropTypes.string.isRequired,
      role: PropTypes.string.isRequired,
      timestamp: PropTypes.instanceOf(Date),
    })
  ).isRequired,
  isLoading: PropTypes.bool.isRequired,
  isDarkMode: PropTypes.bool.isRequired,
};

export default MessageList; 