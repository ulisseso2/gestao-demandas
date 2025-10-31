# Configuração do Google Sheets API

## Passo 1: Criar Projeto no Google Cloud Console

1. Acesse [Google Cloud Console](https://console.cloud.google.com/)
2. Clique em "Novo Projeto" e dê um nome (ex: "gestao-demandas")
3. Selecione o projeto criado

## Passo 2: Ativar a API do Google Sheets

1. No menu lateral, vá em "APIs e Serviços" > "Biblioteca"
2. Busque por "Google Sheets API"
3. Clique em "Ativar"

## Passo 3: Criar Credenciais de Conta de Serviço

1. Vá em "APIs e Serviços" > "Credenciais"
2. Clique em "Criar Credenciais" > "Conta de serviço"
3. Preencha:
   - Nome: `gestao-demandas-service`
   - ID: (será preenchido automaticamente)
   - Descrição: "Conta de serviço para gestão de demandas"
4. Clique em "Criar e continuar"
5. Em "Conceder acesso", selecione "Editor" e clique em "Concluir"

## Passo 4: Gerar Chave JSON

1. Na lista de contas de serviço, clique na conta criada
2. Vá na aba "Chaves"
3. Clique em "Adicionar Chave" > "Criar nova chave"
4. Selecione "JSON" e clique em "Criar"
5. O arquivo será baixado automaticamente - **GUARDE ESSE ARQUIVO COM SEGURANÇA!**

## Passo 5: Criar Planilha Google

1. Acesse [Google Sheets](https://sheets.google.com)
2. Crie uma nova planilha com o nome "Gestão de Demandas"
3. Copie o ID da planilha da URL:
   ```
   https://docs.google.com/spreadsheets/d/SEU_SHEET_ID_AQUI/edit
   ```
4. Clique em "Compartilhar" no canto superior direito
5. Cole o email da conta de serviço (está no arquivo JSON baixado, campo `client_email`)
6. Dê permissão de "Editor"
7. Clique em "Compartilhar"

## Passo 6: Configurar Variáveis de Ambiente

Abra o arquivo JSON baixado e extraia as informações:

```json
{
  "client_email": "seu-email@projeto.iam.gserviceaccount.com",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
}
```

No backend, crie o arquivo `.env` baseado no `.env.example`:

```bash
cd backend
cp .env.example .env
```

Edite o arquivo `.env` e preencha:

```env
PORT=5000
NODE_ENV=development

# Google Sheets API
GOOGLE_SHEET_ID=seu_sheet_id_aqui
GOOGLE_SERVICE_ACCOUNT_EMAIL=seu-email@projeto.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# JWT Secret (gere uma string aleatória segura)
JWT_SECRET=sua_chave_secreta_super_segura_aqui

# Upload
MAX_FILE_SIZE=5242880
```

**Importante:** 
- A chave privada deve estar entre aspas duplas
- Mantenha os `\n` na chave privada
- NUNCA commite o arquivo `.env` no Git!

## Passo 7: Testar Conexão

Primeiro, verifique se o arquivo `.env` foi criado:

```bash
cd backend
ls -la .env
```

Se não existir, crie a partir do exemplo:

```bash
cp .env.example .env
```

**IMPORTANTE:** Antes de rodar o servidor, execute o script de teste:

```bash
npm run test:sheets
```

Este script irá:
- ✅ Verificar se todas as variáveis estão configuradas
- ✅ Testar a conexão com Google Sheets
- ✅ Criar as abas automaticamente

Se tudo estiver correto, você verá:
```
✅ Conexão bem-sucedida! As abas foram criadas na planilha.
```

Agora pode iniciar o servidor normalmente:

```bash
npm run dev
```

## Estrutura da Planilha

O sistema criará automaticamente duas abas:

### Aba "Demandas"
| ID | Data | Demandante | Email | Tema | CPF Aluno | Descrição | Arquivo | Status | Responsável |
|----|------|------------|-------|------|-----------|-----------|---------|--------|-------------|

### Aba "Usuarios"
| ID | Nome | Email | Senha Hash | Tipo |
|----|------|-------|------------|------|

## Troubleshooting

### Erro: "The caller does not have permission"
- Verifique se compartilhou a planilha com o email da conta de serviço
- Certifique-se de que deu permissão de "Editor"

### Erro: "Invalid JWT"
- Verifique se a chave privada está correta e com `\n` preservados
- Certifique-se de que está entre aspas duplas no `.env`

### Erro: "Unable to parse range"
- Verifique se o SHEET_ID está correto
- Confirme que as abas foram criadas corretamente
