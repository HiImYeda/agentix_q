import React, { useState, useRef, useEffect } from 'react';
import { FiImage, FiMic, FiPlayCircle, FiPauseCircle, FiTrash2 } from 'react-icons/fi';
import './MediaUpload.css';

const MediaUpload = ({ 
  isRecording, 
  recordingTime, 
  mediaPreview, 
  mediaType, 
  handleImageUpload, 
  handleStartRecording, 
  handleStopRecording,
  handleDeleteMedia,
  isPlaying,
  toggleAudioPlayback,
  audioPlayerRef
}) => {
  const fileInputRef = useRef(null);
  const localAudioRef = useRef(null);
  const audioRef = audioPlayerRef || localAudioRef;
  const [audioReady, setAudioReady] = useState(false);
  const [audioDuration, setAudioDuration] = useState('00:00');
  
  useEffect(() => {
    if (mediaType === 'audio' && mediaPreview && audioRef.current) {
      audioRef.current.src = mediaPreview;
      audioRef.current.onloadedmetadata = () => {
        const duration = Math.floor(audioRef.current.duration);
        const minutes = Math.floor(duration / 60);
        const seconds = duration % 60;
        setAudioDuration(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
        console.log('Áudio pronto para reprodução, duração:', duration);
        setAudioReady(true);
      };
      audioRef.current.load();
    } else {
      setAudioReady(false);
      setAudioDuration('00:00');
    }
  }, [mediaPreview, mediaType]);

  const handlePlayAudio = () => {
    if (audioRef.current && audioReady) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(error => {
          console.error('Erro ao reproduzir áudio:', error);
        });
      }
      toggleAudioPlayback();
    } else {
      console.log('Áudio não está pronto para reprodução');
    }
  };

  const renderAudioWaveform = () => {
    const bars = [];
    for (let i = 0; i < 20; i++) {
      // Criar alturas variadas para uma representação mais natural
      const height = Math.floor(Math.random() * 15) + 5;
      bars.push(
        <div 
          key={i} 
          className="audio-waveform-bar"
          style={{ 
            height: `${height}px`,
            backgroundColor: isPlaying ? 'var(--neon-red)' : 'rgba(247, 30, 76, 0.5)'
          }} 
        />
      );
    }
    return bars;
  };

  const renderAudioPreview = () => {
    if (mediaType === 'audio' && mediaPreview) {
      return (
        <div className="audio-preview-container glass-effect rounded-lg p-2 neon-border mr-2">
          <audio 
            ref={audioRef} 
            className="hidden-audio-player" 
            preload="auto"
            onEnded={() => {
              if (isPlaying) toggleAudioPlayback();
            }}
          />
          <div className="audio-player flex items-center">
            <button 
              className={`audio-play-button mr-2 p-1 rounded-full ${isPlaying ? 'text-white bg-neon-red' : 'text-neon-red'} transition-colors`}
              onClick={handlePlayAudio}
              disabled={!audioReady}
            >
              {isPlaying ? <FiPauseCircle size={20} /> : <FiPlayCircle size={20} />}
            </button>
            <div className="audio-waveform flex items-center h-6 space-x-[2px] mx-2">
              {renderAudioWaveform()}
            </div>
            <div className="audio-duration text-xs text-gray-400">{audioDuration}</div>
            <button 
              className="audio-delete-button ml-2 text-gray-400 hover:text-neon-red transition-colors p-1"
              onClick={handleDeleteMedia}
              aria-label="Excluir áudio"
            >
              <FiTrash2 size={16} />
            </button>
          </div>
        </div>
      );
    }
    return null;
  };

  const renderImagePreview = () => {
    if (mediaType === 'image' && mediaPreview) {
      return (
        <div className="image-preview-container glass-effect rounded-lg p-1 neon-border mr-2 relative">
          <img 
            src={mediaPreview} 
            alt="Prévia da imagem" 
            className="image-preview rounded h-10 w-auto object-cover" 
          />
          <div className="image-type-indicator absolute bottom-1 left-1 text-[10px] bg-black/50 px-1 rounded text-white">
            Imagem
          </div>
          <button 
            className="image-delete-button absolute -top-2 -right-2 text-neon-red bg-dark-blue/90 rounded-full p-1 animate-pulse-neon"
            onClick={handleDeleteMedia}
            aria-label="Excluir imagem"
          >
            <FiTrash2 size={14} />
          </button>
        </div>
      );
    }
    return null;
  };

  const renderAudioRecording = () => {
    if (isRecording) {
      return (
        <div className="audio-recording-container glass-effect rounded-lg neon-border py-1 px-3 mr-2 flex items-center">
          <div className="audio-recording-content flex items-center">
            <div className="audio-recording-dot w-3 h-3 rounded-full bg-neon-red animate-pulse-strong-neon"></div>
            <div className="audio-recording-time mx-2 text-neon-red">{recordingTime}</div>
            <button 
              className="audio-recording-stop-btn py-1 px-3 bg-neon-red text-white rounded-md text-sm hover:bg-neon-red/80 transition-colors"
              onClick={handleStopRecording}
              aria-label="Parar gravação"
            >
              Parar
            </button>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="media-upload-container flex items-center">
      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        ref={fileInputRef}
        className="file-input hidden"
        aria-label="Carregar imagem"
      />
      
      {renderAudioRecording()}
      {renderAudioPreview()}
      {renderImagePreview()}
      
      {!isRecording && !mediaPreview && (
        <div className="media-upload-buttons flex space-x-2">
          <button 
            className="media-upload-btn p-2 rounded-full text-gray-400 hover:text-neon-red hover:bg-dark-blue/50 transition-colors"
            onClick={() => fileInputRef.current?.click()}
            aria-label="Enviar imagem"
          >
            <FiImage size={18} />
          </button>
          <button 
            className="media-upload-btn p-2 rounded-full text-gray-400 hover:text-neon-red hover:bg-dark-blue/50 transition-colors"
            onClick={handleStartRecording}
            disabled={isRecording}
            aria-label="Gravar áudio"
          >
            <FiMic size={18} />
          </button>
        </div>
      )}
    </div>
  );
};

export default MediaUpload; 