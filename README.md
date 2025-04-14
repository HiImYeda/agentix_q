# Chat N8N - Interface de Chat em Tempo Real

Uma aplicação de chat moderna e minimalista que permite a comunicação entre usuários e agentes N8N através de webhooks personalizados.

## Funcionalidades

- Envio de mensagens em tempo real (texto, imagem, áudio)
- Suporte a envio de mídia em base64
- Recuperação de conversas por sessionId
- Interface responsiva com tema claro/escuro
- Design inspirado no Telegram
- Gravação de áudio com temporizador
- Preview de imagens e áudio antes do envio

## Tecnologias Utilizadas

- React.js + Vite
- Tailwind CSS para estilização 
- Framer Motion para animações
- Axios para integração com APIs

## Estrutura do Projeto

```
src/
├── components/
│   ├── ChatWindow/ - Janela de mensagens
│   ├── InputBar/ - Barra de entrada de mensagens
│   ├── MediaUpload/ - Upload de mídia (imagem/áudio)
│   ├── MessageBubble/ - Bolhas de mensagens
│   ├── ThemeToggle/ - Alternador de tema
├── hooks/
│   ├── useChat.js - Gerenciamento de mensagens e API
│   ├── useMediaUpload.js - Upload e conversão de mídia
│   ├── useTheme.js - Gerenciamento de temas
├── utils/
│   ├── apiClient.js - Cliente de API
│   ├── mediaHelpers.js - Funções auxiliares para mídia
├── config/
│   └── theme.js - Configuração de temas
```

## Integração com N8N

### Endpoints

- Envio de Mensagens: `https://auto-serv-teste.grupoquaestum.com/webhook/1431b174-4280-44fd-82de-16034264b508`
- Buscar Histórico: `https://auto-serv-teste.grupoquaestum.com/webhook/7a5da43a-5c92-44dd-a341-d9a64734add5`

### Formato de Dados

Para enviar mensagens:
```json
{
  "chatInput": "Conteúdo da mensagem ou legenda",
  "sessionId": "ID da sessão",
  "base64": "Conteúdo da mídia em base64 (opcional)",
  "chatinput_type": "text", "image" ou "audio"
}
```

Para buscar histórico:
```json
{
  "sessionId": "ID da sessão"
}
```

## Configuração e Instalação

1. Clone o repositório
2. Instale as dependências:
   ```
   npm install
   ```
3. Inicie o servidor de desenvolvimento:
   ```
   npm run dev
   ```
4. Para build de produção:
   ```
   npm run build
   ```

## Características de Interface

- Tema escuro (#191919) e Tema claro (#dfdfdf)
- Cor primária fixa: #f71e4c
- Design futurista com degradês e transições suaves
- Notificações sonoras ao receber novas mensagens
- Validação de arquivos por tipo e tamanho
- Salvamento automático da sessão no localStorage
