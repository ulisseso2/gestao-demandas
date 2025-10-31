# 🔧 Resolução de Problemas - Setup Google Sheets

## ❌ Problema: Abas não foram criadas na planilha

### Diagnóstico

Execute o script de teste:

```bash
cd backend
npm run test:sheets
```

### Possíveis Causas e Soluções

#### 1. Variáveis de ambiente não configuradas

**Sintoma:**

```
❌ GOOGLE_SHEET_ID: NÃO CONFIGURADA
```

**Solução:**

```bash
# Verifique se o arquivo .env existe
ls -la .env

# Se não existir, crie:
cp .env.example .env

# Edite o arquivo:
nano .env  # ou use seu editor preferido
```

Preencha com as credenciais reais (veja GOOGLE_SHEETS_SETUP.md passo 6).

---

#### 2. Planilha não compartilhada

**Sintoma:**

```
Error: The caller does not have permission
```

**Solução:**

1. Abra sua planilha no Google Sheets
2. Clique em "Compartilhar" (botão azul no canto superior direito)
3. Cole o email da conta de serviço (está no arquivo JSON baixado, campo `client_email`)
   - Exemplo: `gestao-demandas@projeto-xxx.iam.gserviceaccount.com`
4. Altere a permissão para "Editor"
5. Desmarque "Notificar pessoas" (se aparecer)
6. Clique em "Compartilhar"

---

#### 3. SHEET_ID incorreto

**Sintoma:**

```
Error: Unable to parse range
```

ou

```
Error: Requested entity was not found
```

**Solução:**

O SHEET_ID é a parte da URL entre `/d/` e `/edit`:

```
https://docs.google.com/spreadsheets/d/1ABC123xyz-ESTE_É_O_SHEET_ID/edit
```

Copie apenas essa parte e cole no `.env`:

```env
GOOGLE_SHEET_ID=1ABC123xyz-ESTE_É_O_SHEET_ID
```

---

#### 4. Chave privada malformatada

**Sintoma:**

```
Error: Invalid JWT
```

ou

```
Error: error:1E08010C:DECODER routines::unsupported
```

**Solução:**

A chave privada deve manter as quebras de linha (`\n`). No arquivo `.env`:

```env
# ❌ ERRADO (sem aspas, quebras removidas)
GOOGLE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----MIIEvgIBADANBgkqhkiG9w...

# ✅ CORRETO (com aspas duplas e \n preservados)
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASC...\n-----END PRIVATE KEY-----\n"
```

**Dica:** Copie diretamente do arquivo JSON baixado do Google Cloud.

---

#### 5. API do Google Sheets não ativada

**Sintoma:**

```
Error: Google Sheets API has not been used in project
```

**Solução:**

1. Acesse [Google Cloud Console](https://console.cloud.google.com/)
2. Selecione seu projeto
3. Vá em "APIs e Serviços" > "Biblioteca"
4. Busque "Google Sheets API"
5. Clique em "Ativar"

---

## ✅ Checklist de Verificação

Antes de executar `npm run dev`, confirme:

- [ ] Arquivo `.env` existe e não é o `.env.example`
- [ ] `GOOGLE_SHEET_ID` está preenchido (não é "seu_sheet_id_aqui")
- [ ] `GOOGLE_SERVICE_ACCOUNT_EMAIL` está preenchido com email real
- [ ] `GOOGLE_PRIVATE_KEY` está entre aspas duplas e com `\n` preservados
- [ ] Google Sheets API está ativada no projeto
- [ ] Planilha foi criada no Google Sheets
- [ ] Planilha foi compartilhada com a conta de serviço (Editor)
- [ ] `npm run test:sheets` executa sem erros

---

## 🧪 Teste Manual

Se o script de teste não funcionar, teste manualmente:

```bash
cd backend
node -e "require('dotenv').config(); console.log('SHEET_ID:', process.env.GOOGLE_SHEET_ID);"
```

Deve mostrar seu SHEET_ID real, não "seu_sheet_id_aqui".

---

## 📞 Ainda não funciona?

1. **Verifique os logs completos:**

   ```bash
   npm run test:sheets 2>&1 | tee error.log
   ```

2. **Informações para debug:**
   - Sistema operacional
   - Versão do Node.js: `node -v`
   - Conteúdo do erro completo
   - Primeiro arquivo do `.env` (SEM AS CREDENCIAIS):

     ```bash
     cat .env | sed 's/=.*/=***OCULTO***/g'
     ```

3. **Teste direto no navegador:**
   - Acesse: <https://console.cloud.google.com/>
   - Vá em "IAM e Admin" > "Contas de serviço"
   - Confirme que a conta existe e está ativa

---

## 💡 Dicas Importantes

### Formato correto do .env

```env
# ✅ Sem espaços ao redor do =
GOOGLE_SHEET_ID=1ABC123xyz

# ❌ Com espaços (pode causar problemas)
GOOGLE_SHEET_ID = 1ABC123xyz

# ✅ Chave privada entre aspas duplas
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# ❌ Sem aspas ou aspas simples
GOOGLE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----...
GOOGLE_PRIVATE_KEY='-----BEGIN PRIVATE KEY-----...'
```

### Onde encontrar cada informação

| Variável | Onde encontrar |
|----------|---------------|
| `GOOGLE_SHEET_ID` | URL da planilha (entre `/d/` e `/edit`) |
| `GOOGLE_SERVICE_ACCOUNT_EMAIL` | Arquivo JSON baixado → campo `client_email` |
| `GOOGLE_PRIVATE_KEY` | Arquivo JSON baixado → campo `private_key` |

---

## 🎯 Depois que funcionar

Quando `npm run test:sheets` mostrar sucesso:

1. As duas abas ("Demandas" e "Usuarios") estarão na planilha
2. Pode iniciar o servidor: `npm run dev`
3. Pode testar o cadastro de usuário no frontend

---

## 📚 Recursos Adicionais

- [Documentação Google Sheets API](https://developers.google.com/sheets/api)
- [Como criar conta de serviço](https://cloud.google.com/iam/docs/service-accounts-create)
- [Troubleshooting OAuth](https://developers.google.com/identity/protocols/oauth2/service-account#error-codes)
