# 🔧 Resolver Erro CORS - Frontend não conecta ao Backend

## ✅ Solução Rápida

### 1. Reiniciar o Backend

O servidor precisa ser reiniciado para aplicar as mudanças no CORS:

```bash
# No terminal onde o backend está rodando, pressione Ctrl+C
# Depois inicie novamente:
cd backend
npm run dev
```

### 2. Verificar se está rodando

Abra no navegador:
```
http://localhost:5000/health
```

Deve ver: `{"status":"OK","timestamp":"..."}`

### 3. Reiniciar o Frontend

```bash
# Pare o frontend (Ctrl+C) e reinicie:
cd frontend
npm start
```

### 4. Testar cadastro

Acesse `http://localhost:3000` e tente criar um usuário novamente.

---

## 🔍 Verificações

### Backend está rodando?

```bash
curl http://localhost:5000/health
```

Deve retornar JSON com status OK.

### Frontend está usando a URL correta?

Verifique o arquivo `frontend/.env`:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

**Importante:**
- ✅ Deve ter `/api` no final
- ✅ Deve usar `http://localhost:5000` (não `127.0.0.1`)
- ❌ NÃO deve ter `/` no final depois de `/api`

### Variável de ambiente sendo lida?

No console do navegador (F12), digite:

```javascript
console.log(process.env.REACT_APP_API_URL)
```

Deve mostrar: `http://localhost:5000/api`

Se mostrar `undefined`, **reinicie o frontend** (Ctrl+C e `npm start` novamente).

---

## 🐛 Erros Comuns

### Erro: "Failed to fetch"

**Causa:** Backend não está rodando ou CORS não configurado.

**Solução:**
1. Verifique se o backend está rodando: `http://localhost:5000/health`
2. Reinicie o backend: `npm run dev`
3. Verifique os logs do backend no terminal

### Erro: "CORS policy"

**Causa:** Backend não permite requisições do frontend.

**Solução:**
1. Verifique se o arquivo `backend/server.js` tem a configuração CORS atualizada
2. Reinicie o backend

### Erro: "Network Error"

**Causa:** URL incorreta ou backend não acessível.

**Solução:**
1. Verifique o arquivo `frontend/.env`
2. Confirme que a URL é `http://localhost:5000/api` (com `/api`)
3. Teste a URL no navegador: `http://localhost:5000/health`

### Variável de ambiente não carrega

**Causa:** React precisa reiniciar para ler o `.env`.

**Solução:**
1. Pare o frontend (Ctrl+C)
2. Inicie novamente: `npm start`
3. **NUNCA** mude `.env` com o servidor rodando sem reiniciar

---

## 🧪 Teste Manual

### 1. Teste o Backend (Terminal)

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"nome":"Teste","email":"teste@teste.com","senha":"123456"}'
```

Deve retornar algo como:
```json
{"message":"Usuário cadastrado com sucesso","id":"USER-..."}
```

### 2. Teste no Navegador

Abra o Console (F12 → Console) e execute:

```javascript
fetch('http://localhost:5000/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    nome: 'Teste',
    email: 'teste@teste.com',
    senha: '123456'
  })
})
.then(r => r.json())
.then(console.log)
.catch(console.error)
```

Se funcionar aqui mas não na aplicação = problema no `.env`.

---

## 📋 Checklist Completo

Antes de tentar criar usuário:

- [ ] Backend está rodando (`npm run dev` na pasta `backend`)
- [ ] Frontend está rodando (`npm start` na pasta `frontend`)
- [ ] `http://localhost:5000/health` retorna JSON
- [ ] `frontend/.env` existe e tem `REACT_APP_API_URL=http://localhost:5000/api`
- [ ] Reiniciou o frontend depois de criar/modificar o `.env`
- [ ] Reiniciou o backend depois das mudanças no `server.js`
- [ ] Não há erros no console do terminal (backend)
- [ ] Não há erros no console do navegador (F12)

---

## 🚀 Passo a Passo Completo

Se nada funcionar, siga esta ordem:

```bash
# 1. Parar tudo (Ctrl+C em todos os terminais)

# 2. Backend
cd backend
npm run dev
# Aguarde: "🚀 Servidor rodando na porta 5000"
# Deixe rodando

# 3. Em OUTRO terminal - Frontend
cd frontend
npm start
# Aguarde: "Compiled successfully!"
# Deixe rodando

# 4. Abrir navegador
# http://localhost:3000
```

---

## 💡 Dica: Verificar Logs

### Logs do Backend (terminal)

Ao tentar criar usuário, você deve ver:

```
POST /api/auth/register 201 123ms
```

Se não aparecer nada = requisição não está chegando.

### Logs do Frontend (Console do navegador - F12)

Na aba "Network":
- Procure a requisição para `register`
- Clique nela
- Veja a aba "Headers" → deve ter `Access-Control-Allow-Origin`
- Veja a aba "Response" → mensagem de erro ou sucesso

---

## 🔐 Configuração Google Sheets

Se o backend iniciar mas der erro ao criar usuário:

```
Error: The caller does not have permission
```

Significa que o Google Sheets não está configurado. Veja `GOOGLE_SHEETS_SETUP.md`.

Para testar apenas o CORS (sem Google Sheets), você pode comentar temporariamente a inicialização:

```javascript
// Em backend/server.js, comente esta linha:
// await initializeSheets();
```

Mas lembre-se de descomentar depois!
