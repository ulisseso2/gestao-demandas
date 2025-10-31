# Backend - Gestão de Demandas

## 🚀 Início Rápido

### 1. Instalar dependências
```bash
npm install
```

### 2. Configurar variáveis de ambiente
```bash
cp .env.example .env
```

Edite o arquivo `.env` seguindo o guia `../GOOGLE_SHEETS_SETUP.md`

### 3. Testar conexão com Google Sheets
```bash
npm run test:sheets
```

Se tudo estiver OK, você verá:
```
✅ Conexão bem-sucedida! As abas foram criadas na planilha.
```

### 4. Iniciar servidor
```bash
npm run dev
```

Servidor rodará em: http://localhost:5000

## 📝 Scripts Disponíveis

- `npm start` - Inicia o servidor em produção
- `npm run dev` - Inicia o servidor com nodemon (auto-reload)
- `npm run test:sheets` - Testa configuração do Google Sheets

## 🔧 Troubleshooting

Se encontrar problemas, veja `../TROUBLESHOOTING.md`

### Erros comuns:

**Abas não são criadas:**
- Execute `npm run test:sheets` para diagnosticar
- Verifique se compartilhou a planilha com a conta de serviço
- Confirme que o SHEET_ID está correto

**Error: Invalid JWT:**
- Verifique se a `GOOGLE_PRIVATE_KEY` está entre aspas duplas
- Confirme que os `\n` estão preservados

## 📚 Documentação

- [Guia de Setup Google Sheets](../GOOGLE_SHEETS_SETUP.md)
- [Troubleshooting](../TROUBLESHOOTING.md)
- [Deploy](../DEPLOY.md)
