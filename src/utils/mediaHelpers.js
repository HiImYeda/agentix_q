/**
 * Converte um arquivo para string base64
 * @param {File} file - O arquivo a ser convertido
 * @returns {Promise<string>} String base64 do arquivo
 */
export const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      // Extrai apenas a parte base64, removendo o prefixo (ex: data:image/jpeg;base64,)
      const base64String = reader.result.split(',')[1];
      resolve(base64String);
    };
    reader.onerror = error => reject(error);
  });
};

/**
 * Valida se um arquivo é do tipo esperado e está dentro do tamanho limite
 * @param {File} file - O arquivo a ser validado
 * @param {string} type - O tipo esperado ('image', 'audio', 'video')
 * @param {number} maxSizeInMB - Tamanho máximo em MB
 * @returns {Object} Objeto com status e mensagem
 */
export const validateFile = (file, type, maxSizeInMB = 5) => {
  const maxSize = maxSizeInMB * 1024 * 1024; // Converter para bytes
  
  if (!file) {
    return { isValid: false, message: 'Nenhum arquivo selecionado.' };
  }
  
  if (file.size > maxSize) {
    return { isValid: false, message: `O arquivo deve ter menos de ${maxSizeInMB}MB.` };
  }
  
  // Validar tipo de arquivo
  switch (type) {
    case 'image':
      if (!file.type.startsWith('image/')) {
        return { isValid: false, message: 'O arquivo selecionado não é uma imagem válida.' };
      }
      break;
    case 'audio':
      if (!file.type.startsWith('audio/')) {
        return { isValid: false, message: 'O arquivo selecionado não é um áudio válido.' };
      }
      break;
    case 'video':
      if (!file.type.startsWith('video/')) {
        return { isValid: false, message: 'O arquivo selecionado não é um vídeo válido.' };
      }
      break;
    default:
      return { isValid: false, message: 'Tipo de arquivo não suportado.' };
  }
  
  return { isValid: true, message: 'Arquivo válido.' };
};

/**
 * Funções utilitárias para lidar com mídia no chat
 */

/**
 * Formata um tempo em milissegundos para o formato mm:ss
 * @param {number} milliseconds - tempo em milissegundos
 * @returns {string} - tempo formatado como mm:ss
 */
export const formatTime = (milliseconds) => {
  if (!milliseconds && milliseconds !== 0) return '00:00';
  
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

/**
 * Gera uma string legível para o tamanho do arquivo
 * @param {number} bytes - tamanho em bytes
 * @returns {string} - tamanho formatado (ex: "1.5 MB")
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

/**
 * Verifica se um arquivo é uma imagem com base no tipo MIME
 * @param {string} mimeType - tipo MIME do arquivo
 * @returns {boolean} - verdadeiro se for uma imagem
 */
export const isImageType = (mimeType) => {
  return mimeType && mimeType.startsWith('image/');
};

/**
 * Verifica se um arquivo é um áudio com base no tipo MIME
 * @param {string} mimeType - tipo MIME do arquivo
 * @returns {boolean} - verdadeiro se for um áudio
 */
export const isAudioType = (mimeType) => {
  return mimeType && mimeType.startsWith('audio/');
};

/**
 * Formata a data para exibição no chat
 * @param {string} dateString - String de data ISO
 * @returns {string} Data formatada
 */
export const formatDateTime = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString('pt-BR', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: false 
  });
}; 