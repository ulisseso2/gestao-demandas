#!/bin/bash

# 🧪 Script de Teste Local - Gestão de Demandas
# Este script testa todas as novas funcionalidades antes do deploy

echo "🔍 TESTANDO NOVAS FUNCIONALIDADES - Gestão de Demandas"
echo "======================================================"
echo ""

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Função para verificar resposta HTTP
check_status() {
    if [ $1 -eq 200 ] || [ $1 -eq 201 ]; then
        echo -e "${GREEN}✅ OK - Status: $1${NC}"
        return 0
    else
        echo -e "${RED}❌ ERRO - Status: $1${NC}"
        return 1
    fi
}

# 1. Verificar se backend está rodando
echo "1️⃣ Verificando se backend está rodando..."
HEALTH_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:5000/health)

if [ $HEALTH_STATUS -eq 200 ]; then
    echo -e "${GREEN}✅ Backend rodando na porta 5000${NC}"
else
    echo -e "${RED}❌ Backend NÃO está rodando!${NC}"
    echo "   Execute: cd backend && npm run dev"
    exit 1
fi
echo ""

# 2. Verificar variável GOOGLE_DRIVE_FOLDER_ID
echo "2️⃣ Verificando variável GOOGLE_DRIVE_FOLDER_ID..."
if [ -f "backend/.env" ]; then
    if grep -q "GOOGLE_DRIVE_FOLDER_ID" backend/.env; then
        FOLDER_ID=$(grep GOOGLE_DRIVE_FOLDER_ID backend/.env | cut -d '=' -f2)
        if [ ! -z "$FOLDER_ID" ]; then
            echo -e "${GREEN}✅ GOOGLE_DRIVE_FOLDER_ID configurado${NC}"
            echo "   ID: $FOLDER_ID"
        else
            echo -e "${YELLOW}⚠️  GOOGLE_DRIVE_FOLDER_ID vazio!${NC}"
            echo "   Configure no arquivo backend/.env"
        fi
    else
        echo -e "${RED}❌ GOOGLE_DRIVE_FOLDER_ID não encontrado em .env${NC}"
        echo "   Adicione: GOOGLE_DRIVE_FOLDER_ID=seu_folder_id"
    fi
else
    echo -e "${RED}❌ Arquivo backend/.env não encontrado${NC}"
fi
echo ""

# 3. Testar criação de usuário (para testes)
echo "3️⃣ Criando usuário de teste..."
TIMESTAMP=$(date +%s)
TEST_EMAIL="teste${TIMESTAMP}@teste.com"

REGISTER_RESPONSE=$(curl -s -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"nome\":\"Usuário Teste\",\"email\":\"$TEST_EMAIL\",\"senha\":\"123456\"}" \
  -w "\n%{http_code}")

STATUS=$(echo "$REGISTER_RESPONSE" | tail -n1)
BODY=$(echo "$REGISTER_RESPONSE" | head -n-1)

if [ $STATUS -eq 201 ]; then
    echo -e "${GREEN}✅ Usuário criado${NC}"
    echo "   Email: $TEST_EMAIL"
    USER_ID=$(echo $BODY | grep -o '"id":"[^"]*' | cut -d'"' -f4)
    echo "   ID: $USER_ID"
else
    echo -e "${RED}❌ Erro ao criar usuário${NC}"
    echo "   Status: $STATUS"
    echo "   Resposta: $BODY"
    exit 1
fi
echo ""

# 4. Fazer login para obter token
echo "4️⃣ Fazendo login..."
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$TEST_EMAIL\",\"senha\":\"123456\"}" \
  -w "\n%{http_code}")

STATUS=$(echo "$LOGIN_RESPONSE" | tail -n1)
BODY=$(echo "$LOGIN_RESPONSE" | head -n-1)

if [ $STATUS -eq 200 ]; then
    echo -e "${GREEN}✅ Login realizado${NC}"
    TOKEN=$(echo $BODY | grep -o '"token":"[^"]*' | cut -d'"' -f4)
    echo "   Token obtido: ${TOKEN:0:20}..."
else
    echo -e "${RED}❌ Erro ao fazer login${NC}"
    echo "   Status: $STATUS"
    exit 1
fi
echo ""

# 5. Listar demandas (deve ver todas)
echo "5️⃣ Testando listagem de demandas (todos veem todas)..."
DEMANDAS_RESPONSE=$(curl -s -X GET http://localhost:5000/api/demandas \
  -H "Authorization: Bearer $TOKEN" \
  -w "\n%{http_code}")

STATUS=$(echo "$DEMANDAS_RESPONSE" | tail -n1)
BODY=$(echo "$DEMANDAS_RESPONSE" | head -n-1)

if [ $STATUS -eq 200 ]; then
    echo -e "${GREEN}✅ Listagem funcionando${NC}"
    COUNT=$(echo $BODY | grep -o '"id":' | wc -l)
    echo "   Total de demandas: $COUNT"
else
    echo -e "${RED}❌ Erro ao listar demandas${NC}"
    echo "   Status: $STATUS"
fi
echo ""

# 6. Testar validação de CPF duplicado
echo "6️⃣ Testando validação de CPF duplicado..."

# 6.1 Criar primeira demanda com CPF
echo "   6.1. Criando primeira demanda com CPF..."
DEMANDA1_RESPONSE=$(curl -s -X POST http://localhost:5000/api/demandas \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"tema\":\"Aluno\",\"cpfAluno\":\"999.999.999-99\",\"descricao\":\"Teste de CPF único\"}" \
  -w "\n%{http_code}")

STATUS=$(echo "$DEMANDA1_RESPONSE" | tail -n1)
BODY=$(echo "$DEMANDA1_RESPONSE" | head -n-1)

if [ $STATUS -eq 201 ]; then
    echo -e "   ${GREEN}✅ Primeira demanda criada${NC}"
    DEMANDA_ID=$(echo $BODY | grep -o '"id":"[^"]*' | cut -d'"' -f4)
    echo "      ID: $DEMANDA_ID"
else
    echo -e "   ${RED}❌ Erro ao criar primeira demanda${NC}"
    echo "      Status: $STATUS"
fi

# 6.2 Tentar criar segunda demanda com MESMO CPF
echo "   6.2. Tentando criar segunda demanda com MESMO CPF..."
DEMANDA2_RESPONSE=$(curl -s -X POST http://localhost:5000/api/demandas \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"tema\":\"Aluno\",\"cpfAluno\":\"999.999.999-99\",\"descricao\":\"Deve dar erro\"}" \
  -w "\n%{http_code}")

STATUS=$(echo "$DEMANDA2_RESPONSE" | tail -n1)
BODY=$(echo "$DEMANDA2_RESPONSE" | head -n-1)

if [ $STATUS -eq 400 ]; then
    if echo "$BODY" | grep -q "Já tem uma solicitação para esse CPF"; then
        echo -e "   ${GREEN}✅ Validação de CPF funcionando!${NC}"
        echo "      Mensagem: $(echo $BODY | grep -o '"error":"[^"]*' | cut -d'"' -f4)"
    else
        echo -e "   ${YELLOW}⚠️  Retornou 400 mas mensagem diferente${NC}"
        echo "      Resposta: $BODY"
    fi
else
    echo -e "   ${RED}❌ ERRO: Deveria bloquear CPF duplicado!${NC}"
    echo "      Status: $STATUS (esperado: 400)"
    echo "      Resposta: $BODY"
fi
echo ""

# 7. Resumo final
echo "======================================================"
echo "📊 RESUMO DOS TESTES"
echo "======================================================"
echo ""
echo "✅ Features testadas:"
echo "   1. Backend rodando"
echo "   2. GOOGLE_DRIVE_FOLDER_ID configurado"
echo "   3. Criação de usuário"
echo "   4. Login e token JWT"
echo "   5. Listagem de demandas (todos veem todas)"
echo "   6. Validação de CPF duplicado"
echo ""
echo "⚠️  Não testado automaticamente:"
echo "   - Upload de arquivo para Google Drive (precisa arquivo real)"
echo "   - Link de arquivo na listagem"
echo ""
echo "💡 Próximo passo:"
echo "   1. Teste manual: criar demanda com arquivo PDF anexo"
echo "   2. Verifique se arquivo aparece no Google Drive"
echo "   3. Clique no link do arquivo na lista"
echo ""
echo "🚀 Se tudo OK, faça deploy seguindo: DEPLOY_UPDATES.md"
echo ""
