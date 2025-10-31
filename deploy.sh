#!/bin/bash

# 🚀 Script de Deploy Automático
# Execute este script quando estiver pronto para fazer deploy

echo "🚀 DEPLOY - Gestão de Demandas"
echo "=============================="
echo ""

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Verificar se está no diretório correto
if [ ! -f "package.json" ] && [ ! -d "backend" ]; then
    echo -e "${RED}❌ Execute este script na raiz do projeto!${NC}"
    exit 1
fi

# 1. Verificar se há mudanças
echo -e "${BLUE}1️⃣ Verificando mudanças...${NC}"
git status
echo ""

read -p "Continuar com o deploy? (s/n) " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Ss]$ ]]; then
    echo "Deploy cancelado."
    exit 0
fi

# 2. Adicionar todos os arquivos
echo ""
echo -e "${BLUE}2️⃣ Adicionando arquivos ao Git...${NC}"
git add .
echo -e "${GREEN}✅ Arquivos adicionados${NC}"

# 3. Criar commit
echo ""
echo -e "${BLUE}3️⃣ Criando commit...${NC}"
TIMESTAMP=$(date +"%d/%m/%Y %H:%M")
git commit -m "feat: Google Drive upload, validação CPF único, todos veem demandas - $TIMESTAMP"

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Commit criado${NC}"
else
    echo -e "${YELLOW}⚠️  Nenhuma mudança para commitar ou erro${NC}"
fi

# 4. Push para GitHub
echo ""
echo -e "${BLUE}4️⃣ Enviando para GitHub...${NC}"
git push origin master

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Push realizado com sucesso!${NC}"
else
    echo -e "${RED}❌ Erro no push${NC}"
    exit 1
fi

# 5. Instruções finais
echo ""
echo "=============================="
echo -e "${GREEN}✅ DEPLOY INICIADO!${NC}"
echo "=============================="
echo ""
echo -e "${YELLOW}⏳ Aguarde deploy automático:${NC}"
echo ""
echo "🔧 Render (Backend):"
echo "   1. Acesse: https://dashboard.render.com"
echo "   2. Deploy automático iniciado (~2-3 min)"
echo "   3. Verifique logs para confirmar"
echo ""
echo "🌐 Vercel (Frontend):"
echo "   1. Acesse: https://vercel.com"
echo "   2. Deploy automático iniciado (~1-2 min)"
echo "   3. Aguarde status 'Ready'"
echo ""
echo -e "${RED}⚠️  IMPORTANTE:${NC}"
echo "   Não esqueça de adicionar no Render:"
echo "   GOOGLE_DRIVE_FOLDER_ID=seu_folder_id"
echo ""
echo "📋 Após deploy:"
echo "   1. Teste upload de arquivo"
echo "   2. Teste CPF duplicado"
echo "   3. Verifique que todos veem todas demandas"
echo ""
echo -e "${GREEN}🎉 Pronto!${NC}"
echo ""
