#!/bin/bash

echo "🚀 Configurando Sistema de Gestão de Demandas..."
echo ""

# Verificar Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js não encontrado. Instale em: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js $(node -v) detectado"
echo ""

# Backend
echo "📦 Instalando dependências do backend..."
cd backend
npm install

if [ ! -f .env ]; then
    echo "📝 Criando arquivo .env do backend..."
    cp .env.example .env
    echo "⚠️  ATENÇÃO: Configure o arquivo backend/.env com suas credenciais do Google Sheets!"
fi

cd ..

# Frontend
echo "📦 Instalando dependências do frontend..."
cd frontend
npm install

if [ ! -f .env ]; then
    echo "📝 Criando arquivo .env do frontend..."
    cp .env.example .env
fi

cd ..

echo ""
echo "✅ Instalação concluída!"
echo ""
echo "📋 Próximos passos:"
echo "1. Configure o Google Sheets seguindo GOOGLE_SHEETS_SETUP.md"
echo "2. Edite backend/.env com as credenciais"
echo "3. Execute 'npm run dev' no backend (porta 5000)"
echo "4. Execute 'npm start' no frontend (porta 3000)"
echo ""
echo "📚 Documentação completa: README.md"
