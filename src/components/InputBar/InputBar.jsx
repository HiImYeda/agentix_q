import React, { useState, useRef, useEffect } from 'react';
import { IoSend, IoMic, IoStop, IoImage } from 'react-icons/io5';
import axios from 'axios';
import './InputBar.css';

const TRANSCRIBE_URL = 'https://auto-serv-teste.grupoquaestum.com/webhook/6e5ca8f2-9be2-44b7-9fd9-aa52f458a5a1';

/**
 * Componente de barra de entrada para envio de mensagens
 */
const InputBar = ({
  onSendText,
  disabled = false,
  isTyping,
  onStartTyping,
  onStopTyping,
  placeholder = "Digite uma mensagem...",
  maxLength,
  showMediaButtons = true,
  theme = 'dark'
}) => {
  const [text, setText] = useState('');
  const [textHeight, setTextHeight] = useState('auto');
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  
  const textAreaRef = useRef(null);
  const fileInputRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  
  // Reiniciar o estado do componente quando desabilitado
  useEffect(() => {
    if (disabled) {
      resetInput();
    }
  }, [disabled]);
  
  // Ajustar a altura do textarea com base no conteúdo
  useEffect(() => {
    if (textAreaRef.current) {
      adjustTextAreaHeight();
    }
  }, [text]);
  
  // Lidar com eventos de digitação para notificar o componente pai
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (text && !isTyping) {
        onStartTyping && onStartTyping();
      } else if (!text && isTyping) {
        onStopTyping && onStopTyping();
      }
    }, 500);
    
    return () => clearTimeout(timeoutId);
  }, [text, isTyping, onStartTyping, onStopTyping]);
  
  // Parar gravação quando o componente for desmontado
  useEffect(() => {
    return () => {
      if (isRecording) {
        stopRecording();
      }
    };
  }, [isRecording]);
  
  // Ajustar a altura do textarea
  const adjustTextAreaHeight = () => {
    if (!textAreaRef.current) return;
    
    textAreaRef.current.style.height = 'auto';
    
    const newHeight = Math.min(
      Math.max(textAreaRef.current.scrollHeight, 24),
      120
    );
    
    setTextHeight(`${newHeight}px`);
    textAreaRef.current.style.height = `${newHeight}px`;
  };
  
  // Manipular a mudança de texto
  const handleTextChange = (e) => {
    const value = e.target.value;
    if (maxLength && value.length > maxLength) return;
    setText(value);
  };
  
  // Manipular envio de mensagens
  const handleSend = () => {
    if (disabled || !text.trim()) return;
    
    onSendText && onSendText(text.trim());
    setText('');
    setTextHeight('auto');
    if (textAreaRef.current) {
      textAreaRef.current.style.height = 'auto';
    }
    
    onStopTyping && onStopTyping();
  };
  
  // Manipular tecla Enter para enviar
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
  
  // Manipular upload de arquivo de imagem
  const handleImageUpload = () => {
    if (disabled) return;
    fileInputRef.current.click();
  };
  
  // Manipular quando arquivo é selecionado
  const handleFileSelected = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Resetar o input para permitir selecionar o mesmo arquivo novamente
    e.target.value = null;
    
    // Lidar com arquivo de imagem
    if (file.type.startsWith('image/')) {
      setSelectedMedia({
        type: 'image',
        file,
        preview: URL.createObjectURL(file)
      });
    }
  };
  
  // Iniciar gravação de áudio
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        await processAudio(audioBlob);
        
        // Parar todos os tracks do stream para liberar o microfone
        if (stream) {
          stream.getTracks().forEach(track => track.stop());
        }
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      
    } catch (error) {
      console.error('Erro ao acessar o microfone:', error);
      alert('Não foi possível acessar o microfone. Verifique as permissões do navegador.');
    }
  };
  
  // Parar gravação de áudio
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };
  
  // Processar o áudio gravado
  const processAudio = async (audioBlob) => {
    try {
      setIsTranscribing(true);
      
      // Converter Blob para Base64
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      
      reader.onload = async () => {
        try {
          // Extrair a parte base64 da string (remover o prefixo "data:audio/wav;base64,")
          const base64Audio = reader.result.split(',')[1];
          
          // Enviar para a API de transcrição
          const response = await axios.post(TRANSCRIBE_URL, {
            base64: base64Audio
          });
          
          console.log('Resposta da API (bruta):', JSON.stringify(response.data));
          
          let transcricaoTexto = '';
          
          // Verificar cada formato possível da resposta
          if (response.data && Array.isArray(response.data) && response.data.length > 0) {
            // Formato 1: Array [{ "data": { "transcricao": "..." } }]
            console.log('Processando resposta como array');
            const firstItem = response.data[0];
            if (firstItem.data && firstItem.data.transcricao) {
              transcricaoTexto = firstItem.data.transcricao;
              console.log('Transcrição obtida do array:', transcricaoTexto);
            } else {
              console.error('Formato de resposta inválido (array):', firstItem);
            }
          } else if (response.data && response.data.data && response.data.data.transcricao) {
            // Formato 2: Objeto aninhado { "data": { "transcricao": "..." } }
            console.log('Processando resposta como objeto aninhado');
            transcricaoTexto = response.data.data.transcricao;
            console.log('Transcrição obtida do objeto aninhado:', transcricaoTexto);
          } else if (response.data && response.data.transcricao) {
            // Formato 3: Objeto direto { "transcricao": "..." }
            console.log('Processando resposta como objeto direto');
            transcricaoTexto = response.data.transcricao;
            console.log('Transcrição obtida do objeto direto:', transcricaoTexto);
          } else {
            console.error('Formato de resposta não reconhecido:', response.data);
            
            // Tentativa de encontrar qualquer campo de transcrição em qualquer nível
            const jsonStr = JSON.stringify(response.data);
            const match = jsonStr.match(/"transcricao"\s*:\s*"([^"]+)"/);
            if (match && match[1]) {
              transcricaoTexto = match[1];
              console.log('Transcrição encontrada por regex:', transcricaoTexto);
            }
          }
          
          // Se obteve texto, atualiza o estado de maneira forçada
          if (transcricaoTexto) {
            console.log('Definindo texto no campo:', transcricaoTexto);
            
            // Força a atualização do estado com um timeout mínimo
            setTimeout(() => {
              setText(transcricaoTexto);
              console.log('Estado do texto atualizado');
              
              // Força o ajuste da altura após um breve delay
              setTimeout(() => {
                if (textAreaRef.current) {
                  textAreaRef.current.style.height = 'auto';
                  const newHeight = Math.min(
                    Math.max(textAreaRef.current.scrollHeight, 24),
                    120
                  );
                  textAreaRef.current.style.height = `${newHeight}px`;
                  setTextHeight(`${newHeight}px`);
                  console.log('Altura do textarea ajustada manualmente');
                }
              }, 50);
            }, 0);
          }
        } catch (err) {
          console.error('Erro ao processar resposta da API:', err);
        }
      };
      
      reader.onerror = (error) => {
        console.error('Erro ao ler o arquivo:', error);
      };
    } catch (error) {
      console.error('Erro ao transcrever áudio:', error);
    } finally {
      setTimeout(() => {
        setIsTranscribing(false);
      }, 500); // Pequeno delay para garantir que outras operações terminem
    }
  };
  
  // Alternar entre gravação e parada
  const toggleRecording = () => {
    if (disabled) return;
    
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };
  
  // Remover mídia selecionada
  const handleRemoveMedia = () => {
    if (selectedMedia && selectedMedia.preview) {
      URL.revokeObjectURL(selectedMedia.preview);
    }
    setSelectedMedia(null);
  };
  
  // Reiniciar o input
  const resetInput = () => {
    setText('');
    if (selectedMedia && selectedMedia.preview) {
      URL.revokeObjectURL(selectedMedia.preview);
    }
    setSelectedMedia(null);
    if (isRecording) {
      stopRecording();
    }
  };
  
  return (
    <div className={`input-bar ${theme} ${isTranscribing ? 'transcribing' : ''}`}>
      {selectedMedia && selectedMedia.type === 'image' && (
        <div className="media-preview-container">
          <div className="media-preview">
            <img src={selectedMedia.preview} alt="Preview" />
            <button
              className="delete-media-button"
              onClick={handleRemoveMedia}
              aria-label="Remover mídia"
            >
              ×
            </button>
          </div>
        </div>
      )}
      
      <textarea
        ref={textAreaRef}
        className="input-text-area"
        placeholder={isTranscribing ? "Transcrevendo áudio..." : placeholder}
        value={text}
        onChange={handleTextChange}
        onKeyDown={handleKeyDown}
        disabled={disabled || isTranscribing}
        style={{ height: textHeight }}
        aria-label="Caixa de mensagem"
      />
      
      <div className="action-buttons">
        {showMediaButtons && (
          <>
            <button
              className="button-action"
              onClick={handleImageUpload}
              disabled={disabled || isTranscribing || isRecording}
              aria-label="Enviar imagem"
            >
              <IoImage size={24} />
            </button>
            
            <button
              className={`button-action ${isRecording ? 'recording' : ''}`}
              onClick={toggleRecording}
              disabled={disabled || isTranscribing}
              aria-label={isRecording ? "Parar gravação" : "Iniciar gravação"}
            >
              {isRecording ? <IoStop size={24} /> : <IoMic size={24} />}
            </button>
          </>
        )}
        
        <button
          className="button-send"
          onClick={handleSend}
          disabled={disabled || (!text.trim() && !selectedMedia) || isTranscribing}
          aria-label="Enviar mensagem"
        >
          <IoSend size={24} />
        </button>
      </div>
      
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelected}
        style={{ display: 'none' }}
        accept="image/*"
      />
    </div>
  );
};

export default InputBar; 