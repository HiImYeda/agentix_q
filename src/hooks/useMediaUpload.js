import { useState, useRef, useEffect } from 'react';

export default function useMediaUpload() {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [mediaPreview, setMediaPreview] = useState(null);
  const [mediaType, setMediaType] = useState(null);
  const [mediaData, setMediaData] = useState(null);
  const [audioReady, setAudioReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Usar refs para manter as referências entre renders
  const mediaRecorderRef = useRef(null);
  const recordingIntervalRef = useRef(null);
  const audioChunksRef = useRef([]);
  const streamRef = useRef(null);
  const audioPlayerRef = useRef(null);
  
  // Efeito para monitorar o estado de reprodução de áudio
  useEffect(() => {
    const audioElement = audioPlayerRef.current;
    
    if (!audioElement) return;
    
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => setIsPlaying(false);
    
    audioElement.addEventListener('play', handlePlay);
    audioElement.addEventListener('pause', handlePause);
    audioElement.addEventListener('ended', handleEnded);
    
    return () => {
      audioElement.removeEventListener('play', handlePlay);
      audioElement.removeEventListener('pause', handlePause);
      audioElement.removeEventListener('ended', handleEnded);
    };
  }, [audioPlayerRef.current]);
  
  // Converter arquivo para base64
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        // Extrair apenas a parte base64, removendo o prefixo data:image/jpeg;base64,
        const base64String = reader.result.split(',')[1];
        resolve(base64String);
      };
      reader.onerror = error => reject(error);
    });
  };
  
  // Processar upload de imagem
  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    try {
      // Verificar o tipo e tamanho do arquivo
      if (!file.type.startsWith('image/')) {
        throw new Error('O arquivo selecionado não é uma imagem válida.');
      }
      
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('A imagem deve ter menos de 5MB.');
      }
      
      // Gerar preview
      const objectUrl = URL.createObjectURL(file);
      setMediaPreview(objectUrl);
      setMediaType('image');
      
      // Converter para base64
      const base64Data = await fileToBase64(file);
      setMediaData(base64Data);
      
      return {
        base64: base64Data,
        type: 'image',
        preview: objectUrl
      };
    } catch (error) {
      console.error('Erro ao processar imagem:', error);
      setMediaPreview(null);
      setMediaType(null);
      setMediaData(null);
      throw error;
    }
  };
  
  // Função para limpar todos os recursos de áudio
  const cleanupAudioResources = () => {
    // Parar o temporizador
    if (recordingIntervalRef.current) {
      clearInterval(recordingIntervalRef.current);
      recordingIntervalRef.current = null;
    }
    
    // Parar todos os tracks do stream de áudio
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    // Parar qualquer reprodução em andamento
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
      audioPlayerRef.current.currentTime = 0;
    }
  };
  
  // Iniciar gravação de áudio
  const startAudioRecording = () => {
    // Limpar qualquer áudio ou mídia anterior
    clearMediaPreview();
    
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
          streamRef.current = stream;
          mediaRecorderRef.current = new MediaRecorder(stream);
          audioChunksRef.current = [];
          
          mediaRecorderRef.current.addEventListener('dataavailable', event => {
            audioChunksRef.current.push(event.data);
          });
          
          mediaRecorderRef.current.addEventListener('stop', async () => {
            if (audioChunksRef.current.length === 0) {
              console.log('Nenhum áudio gravado');
              return;
            }
            
            try {
              // Criamos o blob com o tipo correto para áudio
              const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/mp3' });
              console.log('Áudio gravado:', { 
                chunks: audioChunksRef.current.length, 
                blobSize: audioBlob.size, 
                blobType: audioBlob.type 
              });
              
              // Criamos o URL para reprodução local
              const audioUrl = URL.createObjectURL(audioBlob);
              
              // Configurar para reprodução
              if (audioPlayerRef.current) {
                audioPlayerRef.current.src = audioUrl;
                console.log('URL do áudio definida para o player:', audioUrl);
              }
              
              // Atualizar o estado
              setMediaPreview(audioUrl);
              setMediaType('audio');
              setAudioReady(true);
              
              // Converter para base64
              const reader = new FileReader();
              reader.onload = (event) => {
                try {
                  // Extrair a parte base64 da string data:audio/mp3;base64,XXXXXX
                  const base64Data = event.target.result.split(',')[1];
                  console.log('Áudio convertido para base64 com sucesso, tamanho:', base64Data.length);
                  setMediaData(base64Data);
                } catch (error) {
                  console.error('Erro ao processar base64 do áudio:', error);
                }
              };
              reader.onerror = (error) => {
                console.error('Erro ao ler o blob de áudio:', error);
              };
              reader.readAsDataURL(audioBlob);
            } catch (error) {
              console.error('Erro ao processar o áudio gravado:', error);
            }
          });
          
          // Iniciar gravação
          mediaRecorderRef.current.start();
          setIsRecording(true);
          setAudioReady(false);
          
          // Iniciar temporizador
          let seconds = 0;
          setRecordingTime(seconds);
          recordingIntervalRef.current = setInterval(() => {
            seconds++;
            setRecordingTime(seconds);
            
            // Limite de 3 minutos para evitar arquivos muito grandes
            if (seconds >= 180) {
              console.log('Limite de tempo de gravação atingido (3 minutos)');
              stopAudioRecording();
            }
          }, 1000);
          
          console.log('Gravação de áudio iniciada');
        })
        .catch(error => {
          console.error('Erro ao acessar o microfone:', error);
          alert('Não foi possível acessar o microfone. Verifique as permissões do navegador.');
        });
    } else {
      console.error('Gravação de áudio não suportada neste navegador.');
      alert('Seu navegador não suporta gravação de áudio.');
    }
  };
  
  // Função para parar a gravação de áudio
  const handleStopRecording = async () => {
    if (!mediaRecorderRef.current || !isRecording) {
      console.log('Nenhuma gravação em andamento para parar.');
      return;
    }
    
    try {
      // Parar a gravação
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      // Parar o contador
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
        recordingIntervalRef.current = null;
      }
      
      // Desligar o microfone
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
      
      // Atualizar estado
      console.log('Gravação de áudio parada:', { chunks: audioChunksRef.current.length });
      
      // Processar os chunks de áudio somente se houver dados
      if (audioChunksRef.current.length > 0) {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/mp3' });
        console.log('Áudio blob criado:', { size: audioBlob.size, type: audioBlob.type });
        
        // Converter para Base64
        const reader = new FileReader();
        
        reader.onloadend = () => {
          try {
            const base64Audio = reader.result.split(',')[1];
            
            // Configurar o áudio para reprodução
            if (audioPlayerRef.current) {
              const audioURL = URL.createObjectURL(audioBlob);
              audioPlayerRef.current.src = audioURL;
              console.log('URL do áudio criada para o player:', audioURL);
            }
            
            // Atualizar o estado com os dados do áudio
            setMediaType('audio');
            setMediaData(base64Audio);
            setMediaPreview(URL.createObjectURL(audioBlob));
            setAudioReady(true);
            
            console.log('Áudio processado com sucesso, pronto para envio');
          } catch (error) {
            console.error('Erro ao processar áudio após leitura:', error);
          }
        };
        
        reader.onerror = (error) => {
          console.error('Erro ao ler blob de áudio:', error);
        };
        
        reader.readAsDataURL(audioBlob);
      } else {
        console.warn('Nenhum dado de áudio foi capturado durante a gravação.');
      }
    } catch (error) {
      console.error('Erro ao parar gravação de áudio:', error);
    }
  };
  
  // Cancelar gravação sem salvar
  const cancelAudioRecording = () => {
    if (isRecording) {
      if (mediaRecorderRef.current) {
        try {
          mediaRecorderRef.current.stop();
        } catch (error) {
          console.error('Erro ao parar gravação:', error);
        }
      }
      
      setIsRecording(false);
      setRecordingTime(0);
    }
    
    // Limpar quaisquer previews existentes
    clearMediaPreview();
    cleanupAudioResources();
  };
  
  // Função para toggle da reprodução de áudio
  const toggleAudioPlayback = () => {
    if (!audioPlayerRef.current || !mediaData) {
      console.error('Não é possível reproduzir: player ou dados de áudio ausentes');
      return;
    }
    
    try {
      if (isPlaying) {
        // Se estiver tocando, pausa
        audioPlayerRef.current.pause();
        setIsPlaying(false);
        console.log('Áudio pausado');
      } else {
        // Se não tiver src, configura
        if (!audioPlayerRef.current.src || audioPlayerRef.current.src === '') {
          const audioSource = `data:audio/mp3;base64,${mediaData}`;
          audioPlayerRef.current.src = audioSource;
          console.log('Fonte de áudio configurada:', audioSource.substring(0, 50) + '...');
        }
        
        // Tenta reproduzir
        const playPromise = audioPlayerRef.current.play();
        
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setIsPlaying(true);
              console.log('Áudio iniciado com sucesso');
              
              // Quando o áudio terminar
              audioPlayerRef.current.onended = () => {
                setIsPlaying(false);
                console.log('Áudio terminou de reproduzir');
              };
            })
            .catch(error => {
              console.error('Erro ao iniciar reprodução de áudio:', error);
              alert('Não foi possível reproduzir o áudio. Tente novamente.');
              setIsPlaying(false);
            });
        }
      }
    } catch (error) {
      console.error('Erro no controle de áudio:', error);
      setIsPlaying(false);
    }
  };
  
  // Limpar preview de mídia
  const clearMediaPreview = () => {
    if (mediaPreview) {
      URL.revokeObjectURL(mediaPreview);
    }
    
    setMediaPreview(null);
    setMediaType(null);
    setMediaData(null);
    setAudioReady(false);
    setIsPlaying(false);
    
    cleanupAudioResources();
  };
  
  // Formatar tempo de gravação
  const formatRecordingTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  return {
    isRecording,
    recordingTime,
    formatRecordingTime,
    mediaPreview,
    mediaType,
    mediaData,
    audioReady,
    isPlaying,
    audioPlayerRef,
    handleImageUpload,
    handleStartRecording: startAudioRecording,
    handleStopRecording: handleStopRecording,
    handleDeleteMedia: clearMediaPreview,
    toggleAudioPlayback
  };
} 