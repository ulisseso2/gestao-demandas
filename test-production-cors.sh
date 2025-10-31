#!/bin/bash

echo "🔍 Diagnóstico de CORS - Produção"
echo "=================================="
echo ""

# URL da API no Render
API_URL="https://gestao-demandas-api.onrender.com"

echo "1️⃣ Testando endpoint /health..."
HEALTH_RESPONSE=$(curl -s -w "\nHTTP_CODE:%{http_code}" "$API_URL/health")
echo "$HEALTH_RESPONSE"
echo ""

echo "2️⃣ Testando CORS headers..."
echo "Simulando requisição do navegador:"
curl -v -X OPTIONS "$API_URL/api/auth/register" \
  -H "Origin: https://gestao-demandas-k9oitqe32-ulissesrce-gmailcoms-projects.vercel.app" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: content-type" \
  2>&1 | grep -i "access-control"
echo ""

echo "3️⃣ Testando POST /api/auth/register..."
REGISTER_RESPONSE=$(curl -s -w "\nHTTP_CODE:%{http_code}" -X POST "$API_URL/api/auth/register" \
  -H "Content-Type: application/json" \
  -H "Origin: https://gestao-demandas-k9oitqe32-ulissesrce-gmailcoms-projects.vercel.app" \
  -d '{"nome":"Teste","email":"teste@teste.com","senha":"123456"}')
echo "$REGISTER_RESPONSE"
echo ""

echo "4️⃣ Verificando se API está acessível..."
if curl -s --head "$API_URL/health" | grep "200 OK" > /dev/null; then
  echo "✅ API está respondendo"
else
  echo "❌ API não está respondendo corretamente"
fi
echo ""

echo "=================================="
echo "📋 Checklist:"
echo "- /health deve retornar JSON com status OK"
echo "- CORS headers devem incluir Access-Control-Allow-Origin"
echo "- POST /register deve retornar 201 ou mensagem de erro clara"
echo ""
echo "Se tudo acima funcionar mas o navegador falhar = problema de CORS"
echo "Se /health não responder = Render não está rodando corretamente"
