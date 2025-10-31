@echo off
echo 🚀 Configurando Git e GitHub para o projeto...
echo.

REM Verificar se Git está instalado
where git >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Git não está instalado!
    echo.
    echo Baixe e instale em: https://git-scm.com/download/win
    echo.
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('git --version') do set GIT_VERSION=%%i
echo ✅ %GIT_VERSION% detectado
echo.

REM Verificar configuração Git
for /f "tokens=*" %%i in ('git config --global user.name') do set GIT_NAME=%%i
if "%GIT_NAME%"=="" (
    echo ⚙️  Configurando Git...
    set /p user_name="Digite seu nome: "
    set /p user_email="Digite seu email: "
    git config --global user.name "%user_name%"
    git config --global user.email "%user_email%"
    echo ✅ Git configurado!
    echo.
)

REM Verificar se já existe repositório Git
if exist .git (
    echo ℹ️  Repositório Git já existe
) else (
    echo 📁 Inicializando repositório Git...
    git init
    echo ✅ Repositório Git criado!
)

echo.
echo 📝 Adicionando arquivos ao Git...
git add .

echo.
echo 💾 Fazendo commit inicial...
git commit -m "feat: Implementação inicial do sistema de gestão de demandas"

echo.
echo ✅ Commit criado!
echo.
echo ───────────────────────────────────────────────────────
echo 📌 PRÓXIMOS PASSOS:
echo ───────────────────────────────────────────────────────
echo.
echo 1. Crie um repositório no GitHub:
echo    → Acesse: https://github.com/new
echo    → Nome: gestao-demandas
echo    → NÃO marque 'Initialize with README'
echo    → Clique em 'Create repository'
echo.
echo 2. Copie a URL do repositório (exemplo):
echo    https://github.com/SEU-USUARIO/gestao-demandas.git
echo.
echo 3. Execute os comandos:
echo.
set /p repo_url="Cole a URL do repositório GitHub aqui: "

if not "%repo_url%"=="" (
    echo.
    echo 🔗 Conectando ao repositório remoto...
    
    git remote remove origin 2>nul
    git remote add origin "%repo_url%"
    git branch -M main
    
    echo.
    echo 🚀 Enviando código para o GitHub...
    echo.
    
    git push -u origin main
    
    if %ERRORLEVEL% EQU 0 (
        echo.
        echo ✅ Código enviado com sucesso para o GitHub!
        echo.
        echo 🎉 Repositório criado: %repo_url%
        echo.
    ) else (
        echo.
        echo ❌ Erro ao enviar código
        echo.
        echo Possíveis soluções:
        echo 1. Configure autenticação (Personal Access Token ou SSH)
        echo 2. Veja GITHUB_SETUP.md seção 'Erros Comuns'
        echo.
    )
) else (
    echo.
    echo ⚠️  URL não fornecida. Execute manualmente:
    echo.
    echo git remote add origin https://github.com/SEU-USUARIO/gestao-demandas.git
    echo git branch -M main
    echo git push -u origin main
    echo.
)

echo 📚 Documentação completa: GITHUB_SETUP.md
echo.
pause
