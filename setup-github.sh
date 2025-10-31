#!/bin/bash

echo "🚀 Configurando Git e GitHub para o projeto..."
echo ""

# Verificar se Git está instalado
if ! command -v git &> /dev/null; then
    echo "❌ Git não está instalado!"
    echo ""
    echo "Instale o Git:"
    echo "  Ubuntu/Debian: sudo apt install git"
    echo "  Fedora: sudo dnf install git"
    echo ""
    exit 1
fi

echo "✅ Git $(git --version) detectado"
echo ""

# Configurar usuário Git se não estiver configurado
if [ -z "$(git config --global user.name)" ]; then
    echo "⚙️  Configurando Git..."
    read -p "Digite seu nome: " user_name
    read -p "Digite seu email: " user_email
    git config --global user.name "$user_name"
    git config --global user.email "$user_email"
    echo "✅ Git configurado!"
    echo ""
fi

# Verificar se já existe repositório Git
if [ -d .git ]; then
    echo "ℹ️  Repositório Git já existe"
else
    echo "📁 Inicializando repositório Git..."
    git init
    echo "✅ Repositório Git criado!"
fi

echo ""
echo "📝 Adicionando arquivos ao Git..."
git add .

echo ""
echo "💾 Fazendo commit inicial..."
git commit -m "feat: Implementação inicial do sistema de gestão de demandas

- Backend com Node.js + Express
- Frontend com React
- Integração com Google Sheets
- Autenticação JWT
- Upload de arquivos
- Sistema de permissões (user/admin)"

echo ""
echo "✅ Commit criado!"
echo ""
echo "───────────────────────────────────────────────────────"
echo "📌 PRÓXIMOS PASSOS:"
echo "───────────────────────────────────────────────────────"
echo ""
echo "1. Crie um repositório no GitHub:"
echo "   → Acesse: https://github.com/new"
echo "   → Nome: gestao-demandas"
echo "   → NÃO marque 'Initialize with README'"
echo "   → Clique em 'Create repository'"
echo ""
echo "2. Copie a URL do repositório (exemplo):"
echo "   https://github.com/SEU-USUARIO/gestao-demandas.git"
echo ""
echo "3. Execute os comandos que o GitHub mostra, ou:"
echo ""
read -p "Cole a URL do repositório GitHub aqui: " repo_url

if [ -n "$repo_url" ]; then
    echo ""
    echo "🔗 Conectando ao repositório remoto..."
    
    # Remover origin se existir
    git remote remove origin 2>/dev/null
    
    git remote add origin "$repo_url"
    git branch -M main
    
    echo ""
    echo "🚀 Enviando código para o GitHub..."
    echo ""
    
    if git push -u origin main; then
        echo ""
        echo "✅ Código enviado com sucesso para o GitHub!"
        echo ""
        echo "🎉 Repositório criado:"
        echo "   $repo_url"
        echo ""
        echo "📋 Próximos passos:"
        echo "   1. Configure o Google Sheets (veja GOOGLE_SHEETS_SETUP.md)"
        echo "   2. Faça deploy gratuito (veja DEPLOY.md)"
        echo ""
    else
        echo ""
        echo "❌ Erro ao enviar código"
        echo ""
        echo "Possíveis soluções:"
        echo "1. Configure autenticação (Personal Access Token ou SSH)"
        echo "2. Veja GITHUB_SETUP.md seção 'Erros Comuns'"
        echo ""
    fi
else
    echo ""
    echo "⚠️  URL não fornecida. Execute manualmente:"
    echo ""
    echo "git remote add origin https://github.com/SEU-USUARIO/gestao-demandas.git"
    echo "git branch -M main"
    echo "git push -u origin main"
    echo ""
fi

echo "📚 Documentação completa: GITHUB_SETUP.md"
