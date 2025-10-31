# Deploy Gratuito - Guia Completo

Este guia detalha como fazer deploy gratuito do sistema de gestão de demandas.

## 🎯 Opções de Deploy Gratuito

### Backend
- **Render.com** ⭐ (Recomendado)
- Railway.app
- Fly.io

### Frontend
- **Vercel** ⭐ (Recomendado)
- Netlify
- GitHub Pages (requer configuração adicional)

---

## 🔧 Deploy do Backend no Render

### Vantagens
- ✅ 750 horas gratuitas/mês
- ✅ Deploy automático via GitHub
- ✅ SSL gratuito
- ✅ Fácil configuração de variáveis de ambiente

### Limitações do Plano Gratuito
- ⏸️ Hiberna após 15 min de inatividade
- 🐌 Primeira requisição pode levar ~30s (cold start)
- 💾 500MB de armazenamento

### Passo a Passo

#### 1. Preparar Repositório

Crie arquivo `backend/.gitignore`:
```
node_modules/
.env
uploads/
*.log
```

Crie arquivo `backend/.node-version`:
```
18
```

Commit e push para GitHub:
```bash
git add .
git commit -m "Preparar para deploy"
git push origin main
```

#### 2. Criar Conta no Render

1. Acesse [render.com](https://render.com)
2. Clique em "Get Started"
3. Conecte sua conta GitHub

#### 3. Criar Web Service

1. No dashboard, clique em "New +" → "Web Service"
2. Conecte seu repositório
3. Configure:

**Basic Configuration:**
- Name: `gestao-demandas-api`
- Region: `Oregon (US West)` (ou mais próximo)
- Branch: `main`
- Root Directory: `backend`
- Environment: `Node`
- Build Command: `npm install`
- Start Command: `npm start`

**Instance Type:**
- Selecione: `Free`

#### 4. Configurar Variáveis de Ambiente

Na seção "Environment Variables", adicione:

```
GOOGLE_SHEET_ID=seu_sheet_id
GOOGLE_SERVICE_ACCOUNT_EMAIL=seu-email@projeto.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n
JWT_SECRET=sua_chave_secreta_complexa_aqui
NODE_ENV=production
PORT=5000
MAX_FILE_SIZE=5242880
```

**Importante:** Para `GOOGLE_PRIVATE_KEY`:
- Copie toda a chave do arquivo JSON
- Mantenha os `\n` (quebras de linha)
- NÃO coloque entre aspas no Render

#### 5. Deploy

1. Clique em "Create Web Service"
2. Aguarde o build (leva ~2-3 minutos)
3. Quando ver "Live", sua API está no ar! 🎉

Sua URL será: `https://gestao-demandas-api.onrender.com`

#### 6. Testar API

Teste no navegador ou Postman:
```
GET https://gestao-demandas-api.onrender.com/health
```

Deve retornar:
```json
{
  "status": "OK",
  "timestamp": "..."
}
```

---

## 🎨 Deploy do Frontend no Vercel

### Vantagens
- ✅ Deploy automático via GitHub
- ✅ SSL gratuito
- ✅ CDN global ultrarrápida
- ✅ Sem hibernação
- ✅ Preview deployments

### Passo a Passo

#### 1. Preparar Build

Atualize `frontend/.env.production`:
```
REACT_APP_API_URL=https://gestao-demandas-api.onrender.com/api
```

Commit:
```bash
git add .
git commit -m "Configurar para produção"
git push
```

#### 2. Criar Conta na Vercel

1. Acesse [vercel.com](https://vercel.com)
2. Clique em "Sign Up"
3. Conecte com GitHub

#### 3. Importar Projeto

1. No dashboard, clique em "Add New..." → "Project"
2. Selecione seu repositório
3. Configure:

**Project Settings:**
- Project Name: `gestao-demandas`
- Framework Preset: `Create React App`
- Root Directory: `frontend`

**Build Settings:**
- Build Command: `npm run build`
- Output Directory: `build`
- Install Command: `npm install`

**Environment Variables:**
- Key: `REACT_APP_API_URL`
- Value: `https://gestao-demandas-api.onrender.com/api`

#### 4. Deploy

1. Clique em "Deploy"
2. Aguarde ~2 minutos
3. Quando finalizar, clique em "Visit" 🎉

Sua URL será: `https://gestao-demandas.vercel.app`

---

## 🔄 Deploy Alternativo - Netlify

### Opção 1: Deploy Manual (Build Local)

```bash
cd frontend
npm run build
```

1. Acesse [netlify.com](https://netlify.com)
2. Arraste a pasta `frontend/build` para o Netlify Drop
3. Site estará online em segundos!

### Opção 2: Deploy Automático (GitHub)

1. Login na Netlify
2. "Add new site" → "Import an existing project"
3. Conecte GitHub e selecione o repo
4. Configure:
   - Base directory: `frontend`
   - Build command: `npm run build`
   - Publish directory: `build`
5. Environment variables:
   - `REACT_APP_API_URL`: URL da sua API no Render
6. Deploy!

---

## 🔐 Configuração de Domínio Personalizado (Opcional)

### No Render (Backend)

1. Vá em "Settings" do seu serviço
2. "Custom Domain"
3. Adicione: `api.seudominio.com`
4. Configure DNS conforme instruções

### Na Vercel (Frontend)

1. Vá em "Settings" → "Domains"
2. Adicione: `seudominio.com`
3. Configure DNS:
   - Tipo: `A` → `76.76.21.21`
   - Tipo: `CNAME` → `cname.vercel-dns.com`

---

## 🐛 Troubleshooting Comum

### Backend

**Erro: "Application failed to respond"**
- Verifique se `PORT=5000` está nas variáveis de ambiente
- Confirme que `server.js` usa `process.env.PORT`

**Erro: Google Sheets authentication failed**
- Verifique `GOOGLE_PRIVATE_KEY` (mantenha `\n`)
- Confirme que compartilhou a planilha

**Service hibernando muito**
- No plano gratuito é normal
- Considere fazer ping periódico (cron job) para manter ativo
- Ou upgrade para plano pago ($7/mês)

### Frontend

**Erro 404 ao recarregar página**

Para Netlify, crie `frontend/public/_redirects`:
```
/*    /index.html   200
```

Para Vercel, crie `frontend/vercel.json`:
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

**API não responde**
- Verifique se `REACT_APP_API_URL` está correto
- Confirme que não tem `/` no final da URL
- Teste a API diretamente no navegador

**CORS Error**
- Verifique se CORS está habilitado no backend
- Confirme que a URL da API está correta

---

## 📊 Monitoramento

### Render
- Dashboard mostra logs em tempo real
- Métricas de CPU e memória
- Alertas por email

### Vercel
- Analytics disponível
- Logs de cada deploy
- Function logs (se usar)

---

## 💡 Dicas de Produção

### Performance

1. **Comprimir respostas (Backend)**
```bash
npm install compression
```

```javascript
const compression = require('compression');
app.use(compression());
```

2. **Cache no Frontend**
Já configurado no Create React App

3. **Lazy Loading**
```javascript
const Dashboard = lazy(() => import('./components/Dashboard'));
```

### Segurança

1. **Helmet (Backend)**
```bash
npm install helmet
```

```javascript
const helmet = require('helmet');
app.use(helmet());
```

2. **Rate Limiting**
```bash
npm install express-rate-limit
```

```javascript
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use('/api/', limiter);
```

3. **Variáveis de Ambiente**
- NUNCA commite arquivos `.env`
- Use secrets do Render/Vercel
- Gere JWT_SECRET complexo: `openssl rand -base64 32`

---

## 💰 Custos e Limites

### Render (Free)
- ✅ 750 horas/mês
- ✅ 100GB bandwidth
- ✅ 500MB storage
- ⚠️ Hiberna após 15 min

### Vercel (Hobby - Free)
- ✅ 100GB bandwidth/mês
- ✅ Unlimited requests
- ✅ 100 deployments/dia
- ✅ Sem hibernação

### Upgrade (se necessário)

**Render Starter:** $7/mês
- Sem hibernação
- 512MB RAM
- Deploy prioritário

**Vercel Pro:** $20/mês
- 1TB bandwidth
- Analytics avançado
- Mais previews

---

## 🚀 Deploy via CI/CD

### GitHub Actions (Opcional)

Crie `.github/workflows/deploy.yml`:

```yaml
name: Deploy
on:
  push:
    branches: [main]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Render
        run: echo "Render faz deploy automático"

  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Vercel
        run: echo "Vercel faz deploy automático"
```

Render e Vercel já fazem deploy automático ao detectar push!

---

## 📝 Checklist de Deploy

### Antes do Deploy

- [ ] Testei localmente backend e frontend
- [ ] Google Sheets está configurado e compartilhado
- [ ] Variáveis de ambiente documentadas
- [ ] `.gitignore` configurado (não commitar `.env`)
- [ ] Código no GitHub

### Backend (Render)

- [ ] Web Service criado
- [ ] Variáveis de ambiente configuradas
- [ ] Build concluído com sucesso
- [ ] Endpoint `/health` responde
- [ ] Teste de login funciona

### Frontend (Vercel)

- [ ] Projeto importado
- [ ] `REACT_APP_API_URL` configurada
- [ ] Build concluído
- [ ] Site acessível
- [ ] Teste de login e criação de demanda

### Pós-Deploy

- [ ] Criar primeiro usuário
- [ ] Promover usuário para admin na planilha
- [ ] Testar todas as funcionalidades
- [ ] Configurar domínio personalizado (opcional)
- [ ] Monitorar logs por 24h

---

## 🆘 Suporte

Problemas? Verifique:
1. Logs do Render
2. Console do navegador (F12)
3. Network tab para ver requisições
4. Google Sheets para confirmar dados

Se persistir, abra issue com:
- Logs completos
- Passos para reproduzir
- Screenshots
