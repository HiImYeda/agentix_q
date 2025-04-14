import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const SEND_MESSAGE_URL = 'https://auto-serv-teste.grupoquaestum.com/webhook/1431b174-4280-44fd-82de-16034264b508';
const GET_HISTORY_URL = 'https://auto-serv-teste.grupoquaestum.com/webhook/7a5da43a-5c92-44dd-a341-d9a64734add5';
const TRANSCRIBE_URL = 'https://auto-serv-teste.grupoquaestum.com/webhook/6e5ca8f2-9be2-44b7-9fd9-aa52f458a5a1';

export default function useChat() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sessionId, setSessionId] = useState(() => {
    // Recuperar sessionId do localStorage ou gerar um novo
    return localStorage.getItem('chatSessionId') || generateSessionId();
  });
  
  const messagesEndRef = useRef(null);

  // Função para gerar sessionId único
  function generateSessionId() {
    const newSessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    localStorage.setItem('chatSessionId', newSessionId);
    return newSessionId;
  }

  // Carregar histórico de mensagens quando o componente montar ou sessionId mudar
  useEffect(() => {
    if (sessionId) {
      fetchMessageHistory(sessionId);
      // Adiciona mensagem inicial se não houver mensagens
      if (messages.length === 0) {
        const welcomeMessage = {
          sender: 'ai',
          text: 'Olá! Eu sou o assistente virtual da Quaestum. Como posso ajudar você hoje?',
          timestamp: new Date().toISOString()
        };
        setMessages([welcomeMessage]);
      }
    }
  }, [sessionId]);

  // Auto-scroll para a última mensagem
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Buscar histórico de mensagens
  const fetchMessageHistory = async (sid) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Buscando histórico para a sessão:', sid);
      
      const response = await axios.post(GET_HISTORY_URL, { 
        sessionId: sid 
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Resposta da API de histórico (raw):', response);
      console.log('Resposta da API de histórico (data):', response.data);
      console.log('Resposta da API de histórico (tipo):', typeof response.data);
      
      // Inicializar array para armazenar mensagens formatadas
      const formattedMessages = [];
      
      // Verificar diferentes formatos possíveis da resposta
      if (response.data) {
        // Caso 1: Array com objeto contendo array de mensagens
        if (Array.isArray(response.data) && response.data.length > 0 && response.data[0].messages && Array.isArray(response.data[0].messages)) {
          console.log('Formato da resposta de histórico: Array com objeto contendo array de mensagens');
          processMessages(response.data[0].messages, formattedMessages);
        }
        // Caso 2: Objeto contendo array de mensagens diretamente
        else if (typeof response.data === 'object' && response.data.messages && Array.isArray(response.data.messages)) {
          console.log('Formato da resposta de histórico: Objeto contendo array de mensagens');
          processMessages(response.data.messages, formattedMessages);
        }
        // Caso 3: Array de mensagens diretamente
        else if (Array.isArray(response.data)) {
          console.log('Formato da resposta de histórico: Array de mensagens direto');
          processMessages(response.data, formattedMessages);
        }
      }
      
      console.log('Mensagens formatadas do histórico:', formattedMessages);
      
      if (formattedMessages.length > 0) {
        setMessages(formattedMessages);
      } else {
        console.warn('Nenhuma mensagem encontrada no histórico ou formato não reconhecido');
        console.warn('Estrutura completa da resposta:', JSON.stringify(response.data, null, 2));
        setMessages([]);
      }
    } catch (err) {
      console.error('Erro ao carregar histórico:', err);
      if (err.response) {
        console.error('Detalhes da resposta de erro:', err.response.data);
      }
      setError('Erro ao carregar o histórico de mensagens.');
    } finally {
      setLoading(false);
    }
  };
  
  // Função auxiliar para processar mensagens do histórico
  const processMessages = (messagesArray, formattedMessages) => {
    console.log('Processando array de mensagens:', messagesArray);
    
    messagesArray.forEach((msg, index) => {
      console.log(`Processando mensagem ${index} do histórico:`, msg);
      
      // Caso 1: Formato { human, ai }
      if (msg.human !== undefined) {
        formattedMessages.push({
          sender: 'human',
          text: msg.human,
          timestamp: new Date().toISOString()
        });
        
        // Se tiver resposta da IA
        if (msg.ai !== undefined) {
          formattedMessages.push({
            sender: 'ai',
            text: msg.ai,
            timestamp: new Date().toISOString()
          });
        }
      }
      // Caso 2: Formato { type/sender, content/text }
      else if ((msg.type || msg.sender) && (msg.content || msg.text)) {
        formattedMessages.push({
          sender: msg.sender || msg.type,
          text: msg.text || msg.content,
          timestamp: msg.timestamp || new Date().toISOString(),
          mediaType: msg.mediaType,
          mediaData: msg.mediaData
        });
      }
      // Caso 3: Formato { role, content } (estilo OpenAI)
      else if (msg.role && msg.content) {
        formattedMessages.push({
          sender: msg.role === 'user' ? 'human' : 'ai',
          text: msg.content,
          timestamp: msg.timestamp || new Date().toISOString()
        });
      }
    });
  };

  // Enviar mensagem de texto
  const sendTextMessage = async (text) => {
    if (!text.trim()) return;
    
    // Adicionar mensagem do usuário ao estado local
    const userMessage = { 
      sender: 'human', 
      text: text, 
      timestamp: new Date().toISOString() 
    };
    
    console.log('Adicionando mensagem do usuário ao estado:', userMessage);
    setMessages(prev => [...prev, userMessage]);
    
    try {
      setLoading(true);
      setError(null);
      
      console.log('Enviando mensagem para a sessão:', sessionId, 'Texto:', text);
      
      // Enviar para a API
      const payload = {
        chatInput: text,
        sessionId: sessionId,
        chatinput_type: 'text'
      };
      
      console.log('Payload para API:', payload);
      
      const response = await axios.post(SEND_MESSAGE_URL, payload, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Resposta da API de envio (raw):', response);
      console.log('Resposta da API de envio (data):', response.data);
      
      // Processar resposta da API
      let aiResponse = null;
      
      if (Array.isArray(response.data) && response.data.length > 0) {
        // Caso 1: Array com objeto contendo output
        if (response.data[0].output !== undefined) {
          aiResponse = response.data[0].output;
        }
        // Caso 2: Array com objeto contendo ai
        else if (response.data[0].ai !== undefined) {
          aiResponse = response.data[0].ai;
        }
        // Caso 3: Array com objeto contendo text/content
        else if (response.data[0].text || response.data[0].content) {
          aiResponse = response.data[0].text || response.data[0].content;
        }
      } else if (typeof response.data === 'object') {
        // Caso 4: Objeto com output/ai/text/content
        aiResponse = response.data.output || response.data.ai || response.data.text || response.data.content;
      } else if (typeof response.data === 'string') {
        // Caso 5: String direta
        aiResponse = response.data;
      }
      
      if (aiResponse) {
        const aiMessage = {
          sender: 'ai',
          text: aiResponse,
          timestamp: new Date().toISOString()
        };
        
        console.log('Adicionando resposta da IA ao estado:', aiMessage);
        setMessages(prev => [...prev, aiMessage]);
      } else {
        console.warn('Não foi possível extrair a resposta da IA:', response.data);
        setError('Não foi possível processar a resposta do assistente.');
      }
      
    } catch (err) {
      console.error('Erro ao enviar mensagem:', err);
      if (err.response) {
        console.error('Detalhes da resposta de erro:', err.response.data);
      }
      setError('Erro ao enviar a mensagem. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  // Função para gerar ID único para mensagens
  const generateMessageId = () => {
    return `msg_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  };

  // Função para salvar mensagens no localStorage
  const saveMessages = (sid, messageList) => {
    if (!sid) return;
    try {
      localStorage.setItem(`chat_messages_${sid}`, JSON.stringify(messageList));
    } catch (error) {
      console.error('Erro ao salvar mensagens no localStorage:', error);
    }
  };

  // Gerar atraso aleatório para simular resposta
  const getRandomDelay = () => {
    return Math.floor(Math.random() * 1000) + 500; // 500-1500ms
  };

  // Gerar resposta da IA simulada
  const generateAIResponse = async (message, mediaType = null) => {
    const responses = [
      "Entendi! Obrigado por compartilhar isso comigo.",
      "Interessante! Posso ajudar com mais alguma coisa?",
      "Legal! Como posso te auxiliar agora?",
      "Recebi sua mensagem. Em que mais posso ajudar?",
      "Ótimo! Estou aqui se precisar de mais alguma coisa.",
      "Certo, entendi o que você enviou. Precisa de alguma orientação adicional?"
    ];
    
    const mediaResponses = {
      image: [
        "Recebi sua imagem! É uma bela foto.",
        "Obrigado por compartilhar essa imagem comigo.",
        "Imagem recebida com sucesso. Posso ajudar com algo relacionado a ela?"
      ],
      audio: [
        "Recebi seu áudio! Obrigado pela mensagem de voz.",
        "Mensagem de áudio recebida com sucesso.",
        "Entendi seu áudio. Posso ajudar com mais alguma coisa?"
      ]
    };
    
    let responseText;
    
    if (mediaType && mediaResponses[mediaType]) {
      // Selecionar resposta específica para o tipo de mídia
      const mediaSpecificResponses = mediaResponses[mediaType];
      responseText = mediaSpecificResponses[Math.floor(Math.random() * mediaSpecificResponses.length)];
    } else {
      // Resposta genérica para texto
      responseText = responses[Math.floor(Math.random() * responses.length)];
    }
    
    // Simular processamento assíncrono
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Retornar mensagem formatada
    return {
      id: generateMessageId(),
      type: 'ai',
      content: responseText,
      timestamp: new Date().toISOString()
    };
  };

  // Enviar mensagem com mídia
  const sendMediaMessage = async (mediaData, mediaType, text = '') => {
    setLoading(true);
    setError(null);
    
    try {
      // Adicionar mensagem do usuário ao estado local (preview da mídia)
      const userMessage = { 
        id: generateMessageId(),
        type: 'human', 
        content: text,
        mediaType: mediaType,
        mediaData: mediaData,
        timestamp: new Date().toISOString() 
      };
      
      console.log('Enviando mídia para a API:', {
        tipo: mediaType, 
        temTexto: !!text, 
        tamanhoDados: mediaData?.length || 0
      });
      
      // Adicionar ao estado para atualizar a UI imediatamente
      const updatedMessages = [...messages, userMessage];
      setMessages(updatedMessages);
      
      // Salvar no localStorage
      localStorage.setItem(`chat_messages_${sessionId}`, JSON.stringify(updatedMessages));
      
      // Descer o scroll
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
      
      // Enviar para a API
      const payload = {
        chatInput: text || '',
        sessionId: sessionId,
        base64: mediaData,
        chatinput_type: mediaType // 'image' ou 'audio'
      };
      
      console.log('Enviando payload para API (sem mostrar base64 completo)');
      
      const response = await axios.post(SEND_MESSAGE_URL, payload, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Resposta da API de mídia:', response.status);
      
      // Verificação mais flexível da resposta
      let aiContent = null;
      
      // Caso 1: response.data é um array de objetos com propriedade output
      if (Array.isArray(response.data) && response.data.length > 0 && response.data[0].output !== undefined) {
        console.log('Formato da resposta de mídia: Array com objeto contendo output');
        aiContent = response.data[0].output;
      } 
      // Caso 2: response.data é um objeto com propriedade output
      else if (response.data && typeof response.data === 'object' && response.data.output !== undefined) {
        console.log('Formato da resposta de mídia: Objeto com propriedade output');
        aiContent = response.data.output;
      }
      // Caso 3: response.data é diretamente o conteúdo da resposta
      else if (response.data !== undefined && (typeof response.data === 'string' || typeof response.data === 'object')) {
        console.log('Formato da resposta de mídia: Conteúdo direto');
        aiContent = response.data;
      }
      
      // Se não conseguiu extrair conteúdo da API, usar resposta simulada
      if (aiContent === null) {
        console.warn('Não foi possível extrair conteúdo da resposta. Usando resposta simulada.');
        
        if (mediaType === 'image') {
          aiContent = "Recebi sua imagem! É uma bela foto. Posso ajudar com mais alguma coisa?";
        } else if (mediaType === 'audio') {
          aiContent = "Recebi seu áudio! Obrigado pela mensagem de voz. Em que mais posso ajudar?";
        } else {
          aiContent = "Recebi sua mídia! Obrigado por compartilhar.";
        }
      }
      
      // Adicionar a resposta da IA
      const aiMessage = {
        id: generateMessageId(),
        type: 'ai',
        content: aiContent,
        timestamp: new Date().toISOString()
      };
      
      const finalMessages = [...updatedMessages, aiMessage];
      setMessages(finalMessages);
      
      // Salvar no localStorage
      localStorage.setItem(`chat_messages_${sessionId}`, JSON.stringify(finalMessages));
      
      // Reproduzir som de notificação
      playNotificationSound();
      
    } catch (error) {
      console.error('Erro ao enviar mensagem de mídia:', error);
      
      if (error.response) {
        console.error('Detalhes da resposta de erro:', error.response.status, error.response.statusText);
      }
      
      setError('Ocorreu um erro ao enviar a mídia.');
    } finally {
      // Desativar carregamento
      setLoading(false);
      
      // Descer novamente o scroll
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  // Reproduzir som de notificação
  const playNotificationSound = () => {
    try {
      const audio = new Audio('/notification.mp3');
      audio.play().catch(err => console.error('Erro ao reproduzir som:', err));
    } catch (err) {
      console.error('Erro ao inicializar som de notificação:', err);
    }
  };

  // Atualizar sessionId manualmente
  const updateSessionId = (newSessionId) => {
    if (newSessionId && newSessionId.trim()) {
      console.log('Atualizando sessionId para:', newSessionId);
      localStorage.setItem('chatSessionId', newSessionId);
      setSessionId(newSessionId);
      // Limpar mensagens ao mudar de sessão
      setMessages([]);
      // Carregar novo histórico
      fetchMessageHistory(newSessionId);
    }
  };

  // Limpar sessão atual
  const clearSession = () => {
    const newSessionId = generateSessionId();
    console.log('Criando nova sessão:', newSessionId);
    setSessionId(newSessionId);
    setMessages([]);
  };

  // Transcrever áudio
  const transcribeAudio = async (base64Audio) => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.post(TRANSCRIBE_URL, {
        base64: base64Audio
      });

      if (response.data && response.data.transcricao) {
        return response.data.transcricao;
      } else {
        throw new Error('Resposta inválida da API de transcrição');
      }
    } catch (err) {
      setError('Erro ao transcrever áudio');
      console.error('Erro ao transcrever áudio:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    messages,
    loading,
    error,
    sessionId,
    sendTextMessage,
    sendMediaMessage,
    updateSessionId,
    clearSession,
    messagesEndRef,
    transcribeAudio
  };
} 