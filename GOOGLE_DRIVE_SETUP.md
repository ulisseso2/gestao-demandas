# 📁 Configuração do Google Drive

Este guia explica como configurar o Google Drive para armazenar os arquivos anexados às demandas.

## 🎯 Por que Google Drive?

- ✅ **Grátis**: 15GB de armazenamento gratuito
- ✅ **Confiável**: Backup automático pela Google
- ✅ **Acessível**: Links permanentes para download
- ✅ **Escalável**: Melhor que armazenar no servidor (Render apaga arquivos)

---

## 📋 Passo a Passo

### 1️⃣ Criar Pasta no Google Drive

1. Acesse [Google Drive](https://drive.google.com)
2. Crie uma nova pasta chamada `gestao-demandas-arquivos`
3. Clique com botão direito na pasta → **Compartilhar**
4. Adicione o **email da service account** (o mesmo do `GOOGLE_APPLICATION_CREDENTIALS`)
   - Email: `gestao-demandas@xxxxx.iam.gserviceaccount.com`
   - Permissão: **Editor**

### 2️⃣ Pegar ID da Pasta

1. Entre na pasta que você criou
2. Veja a URL no navegador:
   ```
   https://drive.google.com/drive/folders/1AbCdEfGhIjKlMnOpQrStUvWxYz123456
   ```
3. Copie apenas o ID (última parte da URL):
   ```
   1AbCdEfGhIjKlMnOpQrStUvWxYz123456
   ```

### 3️⃣ Configurar Variável de Ambiente

#### No arquivo `.env` (desenvolvimento local):

```bash
# Google Drive
GOOGLE_DRIVE_FOLDER_ID=1AbCdEfGhIjKlMnOpQrStUvWxYz123456
```

#### No Render (produção):

1. Acesse [Render Dashboard](https://dashboard.render.com)
2. Clique no seu serviço **gestao-demandas**
3. Vá em **Environment**
4. Clique em **Add Environment Variable**
5. Adicione:
   - **Key**: `GOOGLE_DRIVE_FOLDER_ID`
   - **Value**: `1AbCdEfGhIjKlMnOpQrStUvWxYz123456`
6. Clique em **Save Changes**
7. O servidor será reiniciado automaticamente

---

## ✅ Verificação

Após configurar, teste criando uma demanda com arquivo anexo. O arquivo deve:

1. ✅ Aparecer no Google Drive (pasta `gestao-demandas-arquivos`)
2. ✅ Link salvo no Google Sheets (coluna "Arquivo")
3. ✅ Ser clicável na lista de demandas (abre em nova aba)

---

## 🔐 Permissões dos Arquivos

Os arquivos enviados são configurados como **público com link**:
- ✅ Qualquer pessoa com o link pode visualizar
- ❌ Não aparece em buscas públicas do Google
- ❌ Não pode ser editado por terceiros

Se quiser que apenas usuários autenticados vejam, edite `backend/config/googleDrive.js`:

```javascript
// Mudar de 'anyone' para 'user'
await drive.permissions.create({
    fileId: response.data.id,
    requestBody: {
        role: 'reader',
        type: 'user', // ← Aqui
        emailAddress: 'email@exemplo.com' // Email de quem pode ver
    },
});
```

---

## 🐛 Troubleshooting

### Erro: "File not found"
- Verifique se o ID da pasta está correto
- Confirme que a service account tem permissão de **Editor** na pasta

### Erro: "Invalid credentials"
- Verifique se `GOOGLE_APPLICATION_CREDENTIALS` está configurado
- Confirme que o JSON das credenciais está correto

### Arquivo não aparece no Drive
- Aguarde alguns segundos (pode ter delay)
- Verifique se a pasta ID está correta
- Confirme logs do servidor: `console.log` mostrará erros

---

## 📊 Estrutura no Drive

```
📁 gestao-demandas-arquivos/
   📄 1730380000000-documento.pdf
   📄 1730380100000-planilha.xlsx
   📷 1730380200000-foto.jpg
   ...
```

Os arquivos têm timestamp no nome para evitar conflitos.

---

## 🔄 Migração de Arquivos Antigos

Se você já tinha arquivos na pasta `./uploads` do servidor:

```bash
# 1. Baixar arquivos antigos do servidor (se existirem)
# 2. Fazer upload manual para o Drive
# 3. Atualizar links no Google Sheets manualmente
```

**Nota**: Arquivos em `./uploads` no Render são perdidos após 15 minutos de inatividade.

---

## 💡 Dicas

- **Organização**: Crie subpastas por mês se quiser organizar melhor
- **Limite**: Cuidado com o limite de 15GB gratuito
- **Limpeza**: Periodicamente delete arquivos de demandas antigas/concluídas
- **Backup**: O Google Drive já faz backup automático

---

**Pronto!** 🎉 Agora seus arquivos estão seguros no Google Drive!
