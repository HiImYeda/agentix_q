## 1 - Dockerfile + nginx para deploy EasyPanel (pasta [raiz])

Corrigido o deploy que servia o `index.html` de desenvolvimento (`/src/main.jsx`) via nixpacks/Caddy em vez do build Vite (`dist/`), causando erro de MIME type vazio em JS modules.

A partir de agora o agenteix-q usa o mesmo padrão do `site-lihumberg`:

### 1.1 - Dockerfile multi-stage

- Stage 1 (`node:22-alpine`): `npm ci` + `npm run build` → gera `dist/`
- Stage 2 (`nginx:1.27-alpine`): copia `dist/` para `/usr/share/nginx/html` e expõe porta **80**

### 1.2 - nginx.conf

- MIME correto para `.js`/`.css` (gzip + types padrão do nginx)
- Assets com hash: `try_files $uri =404` (sem fallback HTML)
- SPA: `try_files $uri $uri/ /index.html`

### 1.3 - .dockerignore

Exclui `node_modules`, `dist`, `.git`, `.hermes-qa`, `.cursor` e artefatos de editor do contexto de build.
