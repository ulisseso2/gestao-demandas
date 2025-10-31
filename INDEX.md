# 📚 Índice da Documentação - Gestão de Demandas

Este é o guia central com links para toda a documentação do projeto.

---

## 🎯 Início Rápido

Você acabou de pedir 4 melhorias no sistema. Todas foram implementadas!

**Leia primeiro**: [`RESPOSTAS.md`](RESPOSTAS.md) - Resposta completa às suas 4 questões

---

## 📖 Documentação Principal

### 1. Setup Inicial

- [`README.md`](README.md) - Visão geral do projeto, instalação, uso
- [`GOOGLE_SHEETS_SETUP.md`](GOOGLE_SHEETS_SETUP.md) - Configurar Google Sheets API
- [`GOOGLE_DRIVE_SETUP.md`](GOOGLE_DRIVE_SETUP.md) - **NOVO** - Configurar Google Drive para arquivos

### 2. Deploy

- [`DEPLOY.md`](DEPLOY.md) - Deploy original (Render + Vercel)
- [`DEPLOY_UPDATES.md`](DEPLOY_UPDATES.md) - **NOVO** - Deploy das atualizações
- [`deploy.sh`](deploy.sh) - **NOVO** - Script automático de deploy

### 3. GitHub

- [`GITHUB_SETUP.md`](GITHUB_SETUP.md) - Criar repositório e configurar

### 4. Troubleshooting

- [`TROUBLESHOOTING.md`](TROUBLESHOOTING.md) - Problemas comuns e soluções
- [`CORS_FIX.md`](CORS_FIX.md) - Correção de erros CORS

---

## 🆕 Novas Funcionalidades (31/10/2025)

### Resumo das Mudanças

- [`RESPOSTAS.md`](RESPOSTAS.md) - **LEIA AQUI PRIMEIRO** - Resposta às suas 4 questões
- [`CHANGELOG.md`](CHANGELOG.md) - Histórico detalhado de mudanças
- [`MUDANCAS_VISUAL.md`](MUDANCAS_VISUAL.md) - Diagrama visual antes/depois

### O que foi implementado

#### 1. 📁 Google Drive para Arquivos

- **Antes**: Arquivos perdidos após restart do servidor
- **Agora**: Upload automático para Google Drive
- **Doc**: [`GOOGLE_DRIVE_SETUP.md`](GOOGLE_DRIVE_SETUP.md)

#### 2. 👁️ Todos Veem Todas as Demandas

- **Antes**: Usuários só viam "Meus Pedidos"
- **Agora**: Todos veem todas as demandas
- **Doc**: [`RESPOSTAS.md`](RESPOSTAS.md#2️⃣)

#### 3. 🚫 Validação CPF Único

- **Antes**: Permitia CPF duplicado
- **Agora**: Bloqueia com mensagem detalhada
- **Doc**: [`RESPOSTAS.md`](RESPOSTAS.md#3️⃣)

#### 4. 📎 Link de Arquivo Clicável

- **Agora**: Coluna "Arquivo" com link direto para Google Drive

---

## 🧪 Testes

- [`test-local.sh`](test-local.sh) - **NOVO** - Script de testes automáticos

**Como usar**:

```bash
./test-local.sh
```

Testa:

- ✅ Backend rodando
- ✅ Variável GOOGLE_DRIVE_FOLDER_ID configurada
- ✅ Criação de usuário
- ✅ Login e token
- ✅ Listagem de demandas
- ✅ Validação CPF duplicado

---

## 🚀 Como Fazer Deploy

### Passo a Passo Rápido

1. **Configure Google Drive** (obrigatório)

   ```bash
   # Ver: GOOGLE_DRIVE_SETUP.md
   - Criar pasta no Drive
   - Compartilhar com service account
   - Copiar ID da pasta
   - Adicionar GOOGLE_DRIVE_FOLDER_ID no .env e Render
   ```

2. **Teste localmente**

   ```bash
   ./test-local.sh
   ```

3. **Faça deploy**

   ```bash
   ./deploy.sh
   ```

4. **Aguarde deploy automático**
   - Render: ~2-3 minutos
   - Vercel: ~1-2 minutos

5. **Teste em produção**
   - Upload de arquivo
   - CPF duplicado
   - Visualização de demandas

**Guia completo**: [`DEPLOY_UPDATES.md`](DEPLOY_UPDATES.md)

---

## 📂 Estrutura do Projeto

```
gestao-demandas/
├── backend/
│   ├── config/
│   │   ├── googleSheets.js
│   │   └── googleDrive.js          ← NOVO
│   ├── routes/
│   │   ├── auth.js
│   │   └── demandas.js             ← MODIFICADO
│   ├── middleware/
│   │   └── auth.js
│   └── server.js
│
├── frontend/
│   └── src/
│       ├── components/
│       │   ├── Dashboard.js        ← MODIFICADO
│       │   ├── ListaDemandas.js    ← MODIFICADO
│       │   └── NovaDemanda.js      ← MODIFICADO
│       └── services/
│           └── api.js
│
├── 📚 DOCUMENTAÇÃO:
│   ├── INDEX.md                    ← Você está aqui
│   ├── README.md
│   ├── RESPOSTAS.md                ← LEIA PRIMEIRO
│   ├── CHANGELOG.md
│   ├── MUDANCAS_VISUAL.md
│   ├── GOOGLE_DRIVE_SETUP.md
│   ├── GOOGLE_SHEETS_SETUP.md
│   ├── DEPLOY.md
│   ├── DEPLOY_UPDATES.md
│   ├── GITHUB_SETUP.md
│   ├── TROUBLESHOOTING.md
│   └── CORS_FIX.md
│
└── 🛠️ SCRIPTS:
    ├── deploy.sh                   ← Deploy automático
    └── test-local.sh               ← Testes locais
```

---

## 🔧 Variáveis de Ambiente

### Backend (.env e Render)

```bash
# Google APIs
GOOGLE_APPLICATION_CREDENTIALS={"type":"service_account",...}
GOOGLE_SPREADSHEET_ID=xxxxx
GOOGLE_DRIVE_FOLDER_ID=xxxxx       # ← NOVA (OBRIGATÓRIA)

# JWT
JWT_SECRET=sua_chave_secreta

# Server
PORT=5000
MAX_FILE_SIZE=5242880

# Frontend (apenas para CORS)
FRONTEND_URL=https://gestao-demandas-three.vercel.app
```

### Frontend (.env e .env.production)

```bash
# Produção
REACT_APP_API_URL=https://gestao-demandas.onrender.com/api

# Desenvolvimento
REACT_APP_API_URL=http://localhost:5000/api
```

---

## ❓ Dúvidas Frequentes

### "Como faço upload de arquivo agora?"

O processo é automático. Quando usuário anexa arquivo na interface, ele vai automaticamente para o Google Drive.

**Ver**: [`GOOGLE_DRIVE_SETUP.md`](GOOGLE_DRIVE_SETUP.md)

---

### "Arquivos antigos foram perdidos?"

Se você já tinha arquivos em `./uploads`, sim, foram perdidos (Render apaga após restart).

**Solução**: Peça aos usuários para reenviar se necessário.

---

### "Como testar CPF duplicado?"

1. Crie demanda com tema "Aluno" e CPF "123.456.789-00"
2. Tente criar outra com mesmo CPF
3. Deve mostrar erro detalhado

**Ver**: [`test-local.sh`](test-local.sh) - Testa automaticamente

---

### "Usuários comuns podem editar demandas?"

**NÃO**. Apenas admins podem:

- Alterar status (Solicitado → Em Andamento → Concluído)
- Atribuir responsável

Usuários comuns podem:

- Ver todas as demandas
- Ver status e responsável
- Criar novas demandas

---

### "Como criar primeiro admin?"

1. Registre um usuário normal
2. Abra Google Sheets → aba "Usuarios"
3. Mude coluna "Tipo" de `user` para `admin`
4. Faça logout e login novamente

---

## 🐛 Problemas?

1. **Verifique**: [`TROUBLESHOOTING.md`](TROUBLESHOOTING.md)
2. **Teste local**: `./test-local.sh`
3. **Verifique logs**:
   - Render: Dashboard → Logs
   - Vercel: Deployments → View Logs
4. **CORS**: [`CORS_FIX.md`](CORS_FIX.md)

---

## 📊 Status do Projeto

### Funcionalidades

- ✅ Autenticação JWT
- ✅ Usuários (user/admin)
- ✅ CRUD de demandas
- ✅ Upload de arquivos (Google Drive)
- ✅ Status tracking
- ✅ Atribuição de responsável
- ✅ Validação CPF único
- ✅ Todos veem todas demandas
- ✅ Links de arquivo clicáveis

### Deploy

- ✅ Backend: Render.com
- ✅ Frontend: Vercel
- ✅ Database: Google Sheets
- ✅ Storage: Google Drive
- ✅ Auto-deploy: GitHub integrado

---

## 📞 Suporte

**Documentação completa**: Todos os arquivos `.md` nesta pasta

**Ordem de leitura recomendada**:

1. [`RESPOSTAS.md`](RESPOSTAS.md) - O que mudou
2. [`DEPLOY_UPDATES.md`](DEPLOY_UPDATES.md) - Como fazer deploy
3. [`GOOGLE_DRIVE_SETUP.md`](GOOGLE_DRIVE_SETUP.md) - Configuração obrigatória
4. [`test-local.sh`](test-local.sh) - Testes antes do deploy

---

## 🎉 Próximos Passos

1. ✅ Implementações concluídas
2. 📝 Configure Google Drive ([GOOGLE_DRIVE_SETUP.md](GOOGLE_DRIVE_SETUP.md))
3. 🧪 Teste localmente (`./test-local.sh`)
4. 🚀 Faça deploy (`./deploy.sh`)
5. ✨ Teste em produção

---

**Última atualização**: 31/10/2025
**Versão**: 1.1.0
**Implementado por**: GitHub Copilot
