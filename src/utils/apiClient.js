import axios from 'axios';

// Endpoints da API
const API_ENDPOINTS = {
  SEND_MESSAGE: 'https://auto-serv-teste.grupoquaestum.com/webhook/1431b174-4280-44fd-82de-16034264b508',
  GET_HISTORY: 'https://auto-serv-teste.grupoquaestum.com/webhook/7a5da43a-5c92-44dd-a341-d9a64734add5'
};

// Cliente Axios configurado
const apiClient = axios.create({
  timeout: 30000, // 30 segundos
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para logs e tratamento global de erros
apiClient.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

// Funções de API
export const sendMessage = async (payload) => {
  try {
    return await apiClient.post(API_ENDPOINTS.SEND_MESSAGE, payload);
  } catch (error) {
    console.error('Erro ao enviar mensagem:', error);
    throw error;
  }
};

export const getHistory = async (sessionId) => {
  try {
    return await apiClient.post(API_ENDPOINTS.GET_HISTORY, { sessionId });
  } catch (error) {
    console.error('Erro ao buscar histórico:', error);
    throw error;
  }
};

export default {
  sendMessage,
  getHistory
}; 