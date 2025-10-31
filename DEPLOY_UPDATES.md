# 🚀 Guia de Deploy - Atualizações

## ✅ O que foi implementado

1. **Google Drive** - Arquivos agora são salvos no Google Drive (não mais em ./uploads)
2. **Todos veem tudo** - Removido filtro "meus pedidos", todos os usuários veem todas demandas
3. **CPF único** - Sistema não permite criar demanda duplicada para o mesmo CPF
4. **Link de arquivo** - Coluna "Arquivo" clicável na lista de demandas

---

## 📋 Checklist de Deploy

### 1️⃣ Configurar Google Drive (OBRIGATÓRIO)

#### a) Criar pasta no Google Drive
1. Acesse https://drive.google.com
2. Crie uma pasta chamada: `gestao-demandas-arquivos`
3. Clique com botão direito → **Compartilhar**
4. Adicione o email da sua service account com permissão **Editor**
   - Email está no seu JSON do Google: `client_email`
   - Exemplo: `gestao-demandas@projeto-xxxxx.iam.gserviceaccount.com`

#### b) Pegar ID da pasta
1. Entre na pasta criada
2. Copie o ID da URL:
   ```
   https://drive.google.com/drive/folders/1AbCdEfGhIjKlMnOpQrStUvWxYz
                                           ^^^^^^^^^^^^^^^^^^^^^^^^^^^
                                           Este é o ID
   ```

#### c) Adicionar variável de ambiente

**No arquivo `.env` local:**
```bash
GOOGLE_DRIVE_FOLDER_ID=1AbCdEfGhIjKlMnOpQrStUvWxYz
```

**No Render:**
1. Acesse https://dashboard.render.com
2. Clique no serviço **gestao-demandas**
3. Vá em **Environment**
4. Clique **Add Environment Variable**
5. Adicione:
   - Key: `GOOGLE_DRIVE_FOLDER_ID`
   - Value: `1AbCdEfGhIjKlMnOpQrStUvWxYz`
6. Clique **Save Changes**

---

### 2️⃣ Fazer Push para GitHub

```bash
cd /home/ulisses/gestao_demandas

# Verificar arquivos modificados
git status

# Adicionar todos os arquivos
git add .

# Commit com descrição
git commit -m "feat: Google Drive upload, validação CPF, todos veem demandas"

# Enviar para GitHub
git push origin master
```

---

### 3️⃣ Aguardar Deploy Automático

#### Render (Backend)
1. Acesse https://dashboard.render.com
2. Veja o deploy acontecendo automaticamente
3. Aguarde ~2-3 minutos
4. Verifique logs: deve aparecer "Server rodando na porta 5000"

#### Vercel (Frontend)
1. Acesse https://vercel.com
2. Veja o deploy acontecendo automaticamente
3. Aguarde ~1-2 minutos
4. Verifique se deploy foi "Ready"

---

### 4️⃣ Testar em Produção

#### Teste 1: Google Drive Upload
1. Acesse https://gestao-demandas-three.vercel.app
2. Faça login
3. Vá em "Solicitar Demanda"
4. Preencha o formulário
5. **Anexe um arquivo PDF**
6. Envie
7. ✅ **Verifique**:
   - Demanda criada com sucesso
   - Arquivo aparece no Google Drive
   - Link clicável na lista de demandas

#### Teste 2: CPF Duplicado
1. Crie demanda com tema "Aluno"
2. Use CPF: `123.456.789-00`
3. Envie (deve funcionar)
4. Tente criar OUTRA demanda com MESMO CPF
5. ✅ **Deve mostrar erro**:
   ```
   ❌ Já tem uma solicitação para esse CPF
   
   Demanda existente: DEM-xxxxx
   Criada em: 31/10/2025
   Status: Solicitado
   ```

#### Teste 3: Todos Veem Demandas
1. Crie um segundo usuário (não admin)
2. Faça login com ele
3. ✅ **Deve ver**:
   - Apenas 2 abas: "Solicitar" e "Todas as Demandas"
   - Pode ver todas as demandas criadas
   - NÃO pode alterar status (somente admin)

---

## 🐛 Troubleshooting

### Erro: "File not found" no upload
**Causa**: `GOOGLE_DRIVE_FOLDER_ID` não configurado ou errado

**Solução**:
1. Verifique se a variável existe no Render
2. Confirme que o ID está correto
3. Verifique se a service account tem permissão na pasta

---

### Erro: "Invalid credentials"
**Causa**: Service account sem permissão no Drive

**Solução**:
1. Vá no Google Drive
2. Compartilhe a pasta com o email da service account
3. Permissão: **Editor** (não "Visualizador")

---

### Arquivo não aparece no Drive
**Causa**: Pasta ID errado ou permissões

**Solução**:
1. Verifique logs do Render: `console.error` mostrará erro
2. Teste o ID da pasta manualmente:
   ```
   https://drive.google.com/drive/folders/SEU_ID_AQUI
   ```
3. Se não abrir a pasta, ID está errado

---

### Demanda não bloqueia CPF duplicado
**Causa**: Google Sheets não foi atualizado ou código não foi deployd

**Solução**:
1. Verifique se o push foi feito
2. Confirme deploy no Render
3. Veja logs: deve mostrar versão nova do código

---

## 📊 Estrutura Final

### Backend
```
backend/
├── config/
│   ├── googleSheets.js    (existente)
│   └── googleDrive.js     (NOVO)
├── routes/
│   ├── auth.js
│   └── demandas.js        (MODIFICADO)
└── temp-uploads/          (pasta temporária)
```

### Frontend
```
frontend/src/components/
├── Dashboard.js      (MODIFICADO - 2 abas apenas)
├── ListaDemandas.js  (MODIFICADO - sem filtro, com link arquivo)
└── NovaDemanda.js    (MODIFICADO - erro CPF detalhado)
```

---

## 🎯 Próximos Passos (Opcional)

Após confirmar que tudo funciona:

1. **Limpar pasta temp-uploads**
   - Arquivos temporários são auto-deletados
   - Pasta pode ficar vazia

2. **Deletar pasta uploads antiga**
   ```bash
   rm -rf backend/uploads
   ```

3. **Atualizar README.md**
   - Adicionar seção sobre Google Drive
   - Documentar validação de CPF

4. **Criar primeiro admin**
   - Registre um usuário
   - Abra Google Sheets → aba "Usuarios"
   - Mude coluna "Tipo" de `user` para `admin`

---

## ✅ Checklist Final

- [ ] Pasta criada no Google Drive
- [ ] Service account compartilhada na pasta (Editor)
- [ ] `GOOGLE_DRIVE_FOLDER_ID` adicionado no Render
- [ ] Push feito para GitHub
- [ ] Deploy automático no Render OK
- [ ] Deploy automático na Vercel OK
- [ ] Teste de upload funcionando
- [ ] Teste de CPF duplicado funcionando
- [ ] Teste de visualização (todos veem tudo) OK

---

**Pronto!** 🎉 Sistema atualizado com sucesso!

Se tiver qualquer problema, verifique os logs:
- **Render**: Dashboard → Logs → Manual Deploy
- **Vercel**: Dashboard → Deployments → View Function Logs
