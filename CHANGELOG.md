# 🔄 CHANGELOG - Atualizações do Sistema

## 📅 31/10/2025 - Melhorias Importantes

### ✅ Implementações Realizadas

#### 1. 📁 Google Drive para Arquivos
**Antes**: Arquivos salvos em `./uploads` no servidor (perdidos após restart no Render)
**Agora**: Upload direto para Google Drive com links permanentes

**Mudanças**:
- ✅ Criado `backend/config/googleDrive.js` - Integração com Google Drive API
- ✅ Arquivos salvos em pasta específica no Drive
- ✅ Links públicos gerados automaticamente
- ✅ Arquivos temporários deletados após upload
- ✅ Coluna "Arquivo" no Google Sheets agora salva link do Drive

**Configuração necessária**:
```bash
# Adicionar no .env e Render
GOOGLE_DRIVE_FOLDER_ID=seu_folder_id_aqui
```

**Ver guia completo**: `GOOGLE_DRIVE_SETUP.md`

---

#### 2. 👁️ Todos Veem Todas as Demandas
**Antes**: Usuários comuns só viam "Meus Pedidos", admins viam "Todos os Pedidos"
**Agora**: Qualquer usuário vê todas as demandas do sistema

**Mudanças**:
- ✅ Removido filtro `filtro=meus` do backend
- ✅ Simplificado Dashboard - apenas 2 abas:
  - "Solicitar Demanda"
  - "Todas as Demandas"
- ✅ Usuários comuns podem acompanhar status de qualquer demanda
- ✅ Admins continuam podendo atualizar status e responsável

**Arquivos modificados**:
- `backend/routes/demandas.js` - Rota GET `/demandas` sem filtro por email
- `frontend/src/components/Dashboard.js` - Removidas abas "Meus" e "Todos"
- `frontend/src/components/ListaDemandas.js` - Removido prop `filtro`

---

#### 3. 🚫 Validação de CPF Duplicado
**Antes**: Sistema permitia múltiplas demandas para o mesmo CPF
**Agora**: CPF único - se já existe demanda para um CPF, não permite criar nova

**Mudanças**:
- ✅ Backend verifica CPF antes de criar demanda
- ✅ Retorna erro: `"Já tem uma solicitação para esse CPF"`
- ✅ Mostra informações da demanda existente (ID, data, status)
- ✅ Frontend exibe mensagem detalhada com dados da demanda anterior
- ✅ Arquivo temporário é deletado se CPF duplicado for detectado

**Validação**:
```javascript
// Busca todas demandas e verifica CPF
const cpfExistente = demandas.find(row => row[5] === cpfAluno);
if (cpfExistente) {
    return res.status(400).json({ 
        error: 'Já tem uma solicitação para esse CPF',
        demandaExistente: {...}
    });
}
```

**Mensagem de erro no frontend**:
```
❌ Já tem uma solicitação para esse CPF

Demanda existente: DEM-1730380000000
Criada em: 31/10/2025 08:30:00
Status: Em Andamento
```

---

#### 4. 📎 Link de Arquivo na Lista de Demandas
**Mudanças**:
- ✅ Adicionada coluna "Arquivo" na tabela
- ✅ Link clicável: "📎 Ver arquivo"
- ✅ Abre em nova aba (`target="_blank"`)
- ✅ Só mostra se houver arquivo anexado

---

## 📦 Dependências

Nenhuma nova dependência foi adicionada. Utilizamos APIs existentes:
- `googleapis` - já instalado (usado para Google Sheets)

---

## 🔧 Variáveis de Ambiente

### Nova variável obrigatória:
```bash
GOOGLE_DRIVE_FOLDER_ID=xxxxx
```

### Todas as variáveis atuais:
```bash
# Google APIs
GOOGLE_APPLICATION_CREDENTIALS={"type":"service_account",...}
GOOGLE_SPREADSHEET_ID=xxxxx
GOOGLE_DRIVE_FOLDER_ID=xxxxx  # ← NOVA

# JWT
JWT_SECRET=sua_chave_secreta

# Server
PORT=5000
MAX_FILE_SIZE=5242880

# Frontend (apenas para CORS)
FRONTEND_URL=https://gestao-demandas-three.vercel.app
```

---

## 🚀 Deploy

### Backend (Render)
1. Adicionar `GOOGLE_DRIVE_FOLDER_ID` nas variáveis de ambiente
2. Fazer push para GitHub (auto-deploy configurado)
3. Aguardar rebuild (~2 minutos)

### Frontend (Vercel)
1. Nenhuma mudança nas variáveis
2. Fazer push para GitHub (auto-deploy configurado)
3. Aguardar rebuild (~1 minuto)

---

## 🧪 Testes Necessários

### Google Drive
- [ ] Criar demanda com arquivo PDF
- [ ] Verificar se arquivo aparece no Drive
- [ ] Clicar no link do arquivo na lista
- [ ] Verificar se abre corretamente

### CPF Duplicado
- [ ] Criar demanda com CPF "123.456.789-00"
- [ ] Tentar criar outra com mesmo CPF
- [ ] Verificar mensagem de erro detalhada
- [ ] Confirmar que arquivo não foi salvo

### Visualização de Demandas
- [ ] Logar como usuário comum
- [ ] Verificar que vê todas as demandas
- [ ] Confirmar que NÃO pode alterar status
- [ ] Logar como admin
- [ ] Confirmar que PODE alterar status e responsável

---

## 🔄 Migração de Dados

### Arquivos Antigos
Se você já tinha demandas com arquivos em `./uploads`:

1. **Não é possível recuperá-los** - Render apaga após restart
2. **Solução**: Links antigos vão aparecer vazios
3. **Opcional**: Pedir que usuários anexem novamente se necessário

### Google Sheets
Nenhuma mudança na estrutura. Compatível com dados existentes.

---

## 📚 Documentação Atualizada

- ✅ `GOOGLE_DRIVE_SETUP.md` - Guia completo de configuração
- ✅ `CHANGELOG.md` - Este arquivo
- 📝 `README.md` - Atualizar com novas features

---

## 🐛 Problemas Conhecidos

Nenhum problema conhecido no momento.

---

## 📝 Notas para Desenvolvedores

### Estrutura do Upload
```
1. Usuário anexa arquivo → Multer salva em ./temp-uploads
2. Backend faz upload para Google Drive
3. Google Drive retorna link público
4. Link salvo no Google Sheets
5. Arquivo temporário deletado
6. Resposta enviada ao frontend
```

### Fluxo de Validação CPF
```
1. Usuário preenche CPF
2. Backend busca todas demandas
3. Verifica se CPF existe (coluna index 5)
4. Se existe: retorna erro 400 + dados demanda
5. Se não: prossegue com criação
```

---

**Implementado por**: GitHub Copilot
**Data**: 31/10/2025
**Versão**: 1.1.0
