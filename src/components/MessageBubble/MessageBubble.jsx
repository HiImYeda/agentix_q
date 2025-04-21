import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaUser, FaRobot } from 'react-icons/fa';
import CodeBlock from '../CodeBlock/CodeBlock';
import './MessageBubble.css';

const MessageBubble = ({ message, showAvatar = true, isLoading = false, isSmallScreen = false }) => {
  const [typedText, setTypedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  
  // Extraindo propriedades da mensagem
  const { sender, text, timestamp } = message;
  const isUser = sender === 'human';
  
  // Efeito para animação de digitação para mensagens do AI
  useEffect(() => {
    if (!isUser && !isLoading && text) {
      let index = 0;
      setIsComplete(false);
      setTypedText('');
      
      // Verifica se deve animar a digitação
      const shouldAnimate = text && text.length > 0 && text.length < 300;
      
      if (shouldAnimate) {
        // Animação de digitação para textos menores
        const intervalId = setInterval(() => {
          setTypedText(text.substring(0, index));
          index++;
          
          if (index > text.length) {
            clearInterval(intervalId);
            setIsComplete(true);
          }
        }, 10); // Velocidade de digitação
        
        return () => clearInterval(intervalId);
      } else {
        // Textos muito longos são exibidos de uma vez
        setTypedText(text || '');
        setIsComplete(true);
      }
    }
  }, [message, isLoading, isUser, text]);
  
  // Classes condicionais baseadas no tipo de mensagem e estado
  const bubbleClasses = `
    message-bubble
    ${isUser ? 'user-bubble' : 'ai-bubble'}
    ${isComplete ? 'complete' : ''}
    ${isLoading ? 'loading' : ''}
  `;
  
  // Função para renderizar conteúdo da mensagem
  const renderContent = () => {
    // Se tiver mídia, renderizar a mídia
    if (message.mediaType && message.mediaUrl) {
      switch (message.mediaType) {
        case 'image':
          return (
            <div className="media-container">
              <img 
                src={message.mediaUrl} 
                alt="Imagem enviada" 
                className="media-image"
              />
            </div>
          );
        case 'audio':
          return (
            <div className="media-container">
              <audio 
                controls 
                src={message.mediaUrl} 
                className="media-audio"
              />
            </div>
          );
        default:
          return null;
      }
    }
    
    // Obter o conteúdo da mensagem
    const content = isUser ? text : typedText;
    
    // Se o conteúdo for uma string vazia ou undefined, retornar div vazia
    if (!content) {
      return <div className="message-text empty-message"></div>;
    }
    
    // Para mensagens curtas sem formatação especial, renderizar diretamente
    if (content.length < 100 && !content.includes('```') && !content.includes('<')) {
      return (
        <div className="message-content simple-message">
          <p className="message-text single-line">{content.trim()}</p>
        </div>
      );
    }
    
    // Função para dividir o conteúdo em partes (tokens) de texto normal e código
    const tokenizeContent = (text) => {
      if (!text) return [];
      
      const tokens = [];
      let remainingText = text;
      
      // Padrões para detectar blocos de código
      const codePatterns = [
        // Bloco de código com linguagem especificada: ```python print("Hello")```
        { regex: /(['"`]{3})([a-zA-Z0-9_+-]+)[\s\n]+([\s\S]+?)(\1)/g, type: 'code' },
        
        // Código XML/HTML: <tag>content</tag>
        { regex: /<(\w+)[^>]*>[\s\S]*?<\/\1>/g, type: 'xml' },
        
        // Código com aspas triplas e "python", "java", etc.: """python print("Hello")"""
        { regex: /(['"`]{3})(python|java|javascript|js|cpp|csharp|cs|json|xml|html)[\s\n]+([\s\S]+?)(\1)/g, type: 'code' }
      ];
      
      // Loop para encontrar todos os blocos de código
      let foundMatch = false;
      
      do {
        foundMatch = false;
        let earliestMatch = null;
        let earliestIndex = Number.MAX_SAFE_INTEGER;
        let matchingPattern = null;
        
        // Encontrar o próximo bloco de código no texto restante
        for (const pattern of codePatterns) {
          const regex = new RegExp(pattern.regex.source, 'g');
          regex.lastIndex = 0; // Reiniciar a busca
          
          const match = regex.exec(remainingText);
          if (match && match.index < earliestIndex) {
            earliestMatch = match;
            earliestIndex = match.index;
            matchingPattern = pattern;
          }
        }
        
        if (earliestMatch) {
          foundMatch = true;
          
          // Adicionar texto antes do bloco de código como token de texto
          if (earliestIndex > 0) {
            tokens.push({
              type: 'text',
              content: remainingText.substring(0, earliestIndex)
            });
          }
          
          // Adicionar o bloco de código como token de código
          if (matchingPattern.type === 'code') {
            // Extrair linguagem e código
            const language = earliestMatch[2].toLowerCase();
            const code = earliestMatch[3];
            
            tokens.push({
              type: 'code',
              language: language,
              content: code
            });
          } else if (matchingPattern.type === 'xml') {
            // Tratar XML/HTML
            tokens.push({
              type: 'code',
              language: 'markup',
              content: earliestMatch[0]
            });
          }
          
          // Atualizar o texto restante
          remainingText = remainingText.substring(
            earliestIndex + earliestMatch[0].length
          );
        }
      } while (foundMatch);
      
      // Adicionar qualquer texto restante
      if (remainingText.length > 0) {
        tokens.push({
          type: 'text',
          content: remainingText
        });
      }
      
      return tokens;
    };
    
    const tokens = tokenizeContent(content);
    
    // Se não houver tokens, exibir mensagem vazia
    if (tokens.length === 0) {
      return <div className="message-text"></div>;
    }
    
    // Renderizar cada token
    return (
      <div className="message-content">
        {tokens.map((token, index) => {
          if (token.type === 'text') {
            return (
              <div key={index} className="message-text">
                {token.content}
              </div>
            );
          } else if (token.type === 'code') {
            return (
              <CodeBlock 
                key={index} 
                code={token.content} 
                language={token.language} 
              />
            );
          }
          return null;
        })}
      </div>
    );
  };
  
  return (
    <motion.div 
      className={`message-row ${isUser ? 'message-user' : 'message-ai'}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {showAvatar && !isUser && (
        <div className="avatar-container">
          <div className="avatar">
            <FaRobot className="avatar-icon" />
          </div>
        </div>
      )}
      
      <div className={`bubble-container ${isUser ? 'user-container' : 'ai-container'}`}>
        <div className={bubbleClasses}>
          {isLoading ? (
            <div className="loading-indicator">
              <div className="dot"></div>
              <div className="dot"></div>
              <div className="dot"></div>
            </div>
          ) : (
            renderContent()
          )}
        </div>
      </div>
      
      {showAvatar && isUser && (
        <div className="avatar-container">
          <div className="avatar">
            <FaUser className="avatar-icon" />
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default React.memo(MessageBubble);