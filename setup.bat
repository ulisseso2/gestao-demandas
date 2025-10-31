@echo off
echo 🚀 Configurando Sistema de Gestão de Demandas...
echo.

REM Verificar Node.js
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js não encontrado. Instale em: https://nodejs.org/
    exit /b 1
)

for /f "tokens=*" %%i in ('node -v') do set NODE_VERSION=%%i
echo ✅ Node.js %NODE_VERSION% detectado
echo.

REM Backend
echo 📦 Instalando dependências do backend...
cd backend
call npm install

if not exist .env (
    echo 📝 Criando arquivo .env do backend...
    copy .env.example .env
    echo ⚠️  ATENÇÃO: Configure o arquivo backend\.env com suas credenciais do Google Sheets!
)

cd ..

REM Frontend
echo 📦 Instalando dependências do frontend...
cd frontend
call npm install

if not exist .env (
    echo 📝 Criando arquivo .env do frontend...
    copy .env.example .env
)

cd ..

echo.
echo ✅ Instalação concluída!
echo.
echo 📋 Próximos passos:
echo 1. Configure o Google Sheets seguindo GOOGLE_SHEETS_SETUP.md
echo 2. Edite backend\.env com as credenciais
echo 3. Execute 'npm run dev' no backend (porta 5000)
echo 4. Execute 'npm start' no frontend (porta 3000)
echo.
echo 📚 Documentação completa: README.md

pause
