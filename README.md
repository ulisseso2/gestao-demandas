# Sistema de Gestão de Demandas

Sistema completo para gerenciamento de demandas com backend Node.js, frontend React e armazenamento em Google Sheets.

## 🚀 Funcionalidades

### Para Usuários Comuns:
- ✅ Login e cadastro
- ✅ Criar nova demanda com campos dinâmicos por tema
- ✅ Upload de arquivos (PDF, DOC, XLS, imagens)
- ✅ Visualizar apenas suas próprias demandas
- ✅ Acompanhar status das demandas

### Para Administradores:
- ✅ Todas as funcionalidades de usuário comum
- ✅ Visualizar todas as demandas do sistema
- ✅ Atualizar status das demandas (Solicitado, Em Andamento, Concluído)
- ✅ Atribuir responsável para cada demanda

### Temas Disponíveis:
- Aluno (requer CPF)
- Dashboard
- CRM
- Octadesk
- Sala Virtual
- Turmas e Cursos
- Matrícula

## 📋 Pré-requisitos

- Node.js 16+ instalado
- Conta Google para usar Google Sheets
- Git (opcional)

## 🔧 Instalação Local

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env
```

**IMPORTANTE:** Edite o arquivo `.env` com suas configurações (veja `GOOGLE_SHEETS_SETUP.md` para detalhes).

**Teste a configuração antes de iniciar:**
```bash
npm run test:sheets
```

Se ver "✅ Conexão bem-sucedida!", pode iniciar o servidor:
```bash
npm run dev
```

O backend rodará em `http://localhost:5000`

### 2. Frontend

```bash
cd frontend
npm install
cp .env.example .env
```

Edite o `.env` se necessário (opcional em desenvolvimento).

Inicie o frontend:
```bash
npm start
```

O frontend rodará em `http://localhost:3000`

## 🌐 Deploy Gratuito

### Backend - Render.com

1. Crie uma conta em [Render.com](https://render.com)
2. Clique em "New +" e selecione "Web Service"
3. Conecte seu repositório GitHub
4. Configure:
   - **Name:** gestao-demandas-api
   - **Environment:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Instance Type:** Free
5. Adicione as variáveis de ambiente:
   - `GOOGLE_SHEET_ID`
   - `GOOGLE_SERVICE_ACCOUNT_EMAIL`
   - `GOOGLE_PRIVATE_KEY`
   - `JWT_SECRET`
   - `NODE_ENV=production`
6. Clique em "Create Web Service"

A URL será algo como: `https://gestao-demandas-api.onrender.com`

**Nota:** O plano gratuito do Render hiberna após 15 minutos de inatividade. A primeira requisição pode demorar ~30s.

### Frontend - Vercel

1. Crie uma conta em [Vercel.com](https://vercel.com)
2. Clique em "Add New Project"
3. Importe seu repositório
4. Configure:
   - **Framework Preset:** Create React App
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `build`
5. Adicione a variável de ambiente:
   - `REACT_APP_API_URL=https://gestao-demandas-api.onrender.com/api`
6. Clique em "Deploy"

A URL será algo como: `https://gestao-demandas.vercel.app`

### Alternativa para Frontend - Netlify

1. Crie uma conta em [Netlify.com](https://netlify.com)
2. Arraste a pasta `frontend/build` para o Netlify Drop
3. Ou conecte via GitHub:
   - Clique em "Add new site" > "Import existing project"
   - Conecte o repositório
   - Configure:
     - **Base directory:** `frontend`
     - **Build command:** `npm run build`
     - **Publish directory:** `build`
   - Adicione variável: `REACT_APP_API_URL`

## 📊 Configuração do Google Sheets

Siga o guia completo em [GOOGLE_SHEETS_SETUP.md](./GOOGLE_SHEETS_SETUP.md)

Resumo:
1. Crie projeto no Google Cloud Console
2. Ative a Google Sheets API
3. Crie conta de serviço e baixe JSON
4. Crie planilha e compartilhe com a conta de serviço
5. Configure variáveis de ambiente

## 👤 Primeiro Acesso

1. Acesse a aplicação
2. Clique em "Cadastre-se"
3. Preencha nome, email e senha
4. Faça login com as credenciais

### Criar Usuário Admin

Para criar um usuário administrador, após registrar um usuário normal:

1. Abra a planilha Google Sheets
2. Vá na aba "Usuarios"
3. Encontre o usuário desejado
4. Na coluna "Tipo", altere de `user` para `admin`
5. Faça logout e login novamente

## 🗂️ Estrutura do Projeto

```
gestao_demandas/
├── backend/
│   ├── config/
│   │   └── googleSheets.js      # Configuração Google Sheets
│   ├── middleware/
│   │   └── auth.js               # Autenticação JWT
│   ├── routes/
│   │   ├── auth.js               # Rotas de autenticação
│   │   └── demandas.js           # Rotas de demandas
│   ├── uploads/                  # Arquivos enviados
│   ├── .env                      # Variáveis de ambiente
│   ├── package.json
│   └── server.js                 # Servidor Express
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Auth.css
│   │   │   ├── Dashboard.css/js
│   │   │   ├── Header.css/js
│   │   │   ├── ListaDemandas.css/js
│   │   │   ├── Login.js
│   │   │   ├── NovaDemanda.css/js
│   │   │   └── Register.js
│   │   ├── services/
│   │   │   └── api.js            # Axios configurado
│   │   ├── App.js
│   │   ├── index.css
│   │   └── index.js
│   ├── .env
│   └── package.json
│
├── GOOGLE_SHEETS_SETUP.md        # Guia de configuração
└── README.md                     # Este arquivo
```

## 🔒 Segurança

- ✅ Autenticação JWT
- ✅ Senhas com hash bcrypt
- ✅ Validação de tipos de arquivo
- ✅ Limite de tamanho de upload (5MB)
- ✅ CORS configurado
- ⚠️ **NUNCA** commite arquivos `.env` ou credenciais

## 🛠️ Tecnologias Utilizadas

### Backend
- Node.js + Express
- Google Sheets API (googleapis)
- JWT (jsonwebtoken)
- Bcrypt (senhas)
- Multer (upload de arquivos)

### Frontend
- React 18
- React Router
- Axios
- CSS puro

## 📝 API Endpoints

### Autenticação
- `POST /api/auth/register` - Cadastrar usuário
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Verificar token

### Demandas
- `POST /api/demandas` - Criar demanda
- `GET /api/demandas?filtro=meus|todos` - Listar demandas
- `PUT /api/demandas/:id` - Atualizar demanda (admin)
- `GET /api/demandas/usuarios/lista` - Listar usuários (admin)

## 🐛 Troubleshooting

### Backend não conecta ao Google Sheets
- Execute `npm run test:sheets` no diretório backend para diagnosticar
- Verifique se a planilha foi compartilhada com a conta de serviço
- Confirme que as variáveis de ambiente estão corretas
- Veja `TROUBLESHOOTING.md` para guia detalhado

### Erro de CORS no frontend
- Certifique-se de que o backend está rodando
- Verifique se a URL da API está correta no `.env` do frontend

### Upload de arquivos não funciona
- Crie a pasta `backend/uploads` manualmente se não existir
- Verifique permissões de escrita na pasta

## 📄 Licença

MIT

## 🤝 Suporte

Para dúvidas ou problemas, abra uma issue no repositório.
