# 🚀 Como Criar Repositório no GitHub

## Opção 1: Via Interface do GitHub (Recomendado para Iniciantes)

### Passo 1: Criar Repositório no GitHub.com

1. Acesse [github.com](https://github.com) e faça login
2. Clique no botão **"+"** no canto superior direito
3. Selecione **"New repository"**
4. Preencha:
   - **Repository name:** `gestao-demandas`
   - **Description:** "Sistema de gestão de demandas com React e Node.js"
   - **Visibilidade:** Public ou Private (sua escolha)
   - **NÃO marque:** "Initialize with README" (já temos um README.md)
   - **NÃO adicione:** .gitignore ou license (já temos)
5. Clique em **"Create repository"**

### Passo 2: Conectar Projeto Local ao GitHub

Copie a URL que aparece (exemplo: `https://github.com/seu-usuario/gestao-demandas.git`)

No terminal, execute:

```bash
# Certifique-se de estar na pasta do projeto
cd /home/ulisses/gestao_demandas

# Inicializar Git (se ainda não foi feito)
git init

# Adicionar todos os arquivos
git add .

# Fazer primeiro commit
git commit -m "feat: Implementação inicial do sistema de gestão de demandas"

# Adicionar repositório remoto (substitua pela SUA URL)
git remote add origin https://github.com/SEU-USUARIO/gestao-demandas.git

# Enviar código para o GitHub
git branch -M main
git push -u origin main
```

### Passo 3: Verificar

Recarregue a página do repositório no GitHub. Você verá todos os arquivos lá! ✅

---

## Opção 2: Via GitHub CLI (Para usuários avançados)

Se tiver o GitHub CLI instalado:

```bash
# Na pasta do projeto
cd /home/ulisses/gestao_demandas

# Criar repositório direto pelo terminal
gh repo create gestao-demandas --public --source=. --remote=origin

# Fazer push
git push -u origin main
```

---

## ⚠️ Erros Comuns e Soluções

### Erro: "remote origin already exists"

```bash
# Remover origin existente e adicionar novamente
git remote remove origin
git remote add origin https://github.com/SEU-USUARIO/gestao-demandas.git
```

### Erro: "failed to push some refs"

```bash
# Forçar push (CUIDADO: só use no primeiro push)
git push -u origin main --force
```

### Erro: "Git não instalado"

**Ubuntu/Debian:**

```bash
sudo apt update
sudo apt install git
```

**Fedora:**

```bash
sudo dnf install git
```

### Erro: "Authentication failed"

Se usar HTTPS, o GitHub não aceita mais senha. Use:

**Opção A: Personal Access Token**

1. GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. "Generate new token" → Marque "repo" → Generate
3. Copie o token
4. Use o token como senha quando fazer push

**Opção B: SSH (Recomendado)**

```bash
# Gerar chave SSH
ssh-keygen -t ed25519 -C "seu-email@exemplo.com"

# Copiar chave pública
cat ~/.ssh/id_ed25519.pub

# Adicionar no GitHub: Settings → SSH and GPG keys → New SSH key
# Cole a chave e salve

# Mudar remote para SSH
git remote set-url origin git@github.com:SEU-USUARIO/gestao-demandas.git
```

---

## 📋 Checklist Completo

Antes de fazer push, verifique:

- [ ] Arquivo `.env` está no `.gitignore` (✅ já está)
- [ ] Não tem credenciais no código
- [ ] README.md está atualizado
- [ ] Código está funcionando localmente

### Arquivos que NÃO devem ir para o GitHub

Já estão no `.gitignore`:

- `.env` (credenciais)
- `node_modules/` (dependências)
- `uploads/` (arquivos enviados)
- `build/` (build do frontend)

---

## 🎯 Comandos Git Úteis

```bash
# Ver status dos arquivos
git status

# Ver histórico de commits
git log --oneline

# Ver diferenças não commitadas
git diff

# Desfazer mudanças em um arquivo
git checkout -- arquivo.js

# Criar nova branch
git checkout -b nome-da-branch

# Ver repositórios remotos
git remote -v
```

---

## 📝 Estrutura de Commits Recomendada

Use prefixos para organizar commits:

```bash
git commit -m "feat: nova funcionalidade X"      # Nova feature
git commit -m "fix: correção do bug Y"           # Correção
git commit -m "docs: atualização README"         # Documentação
git commit -m "style: formatação código"         # Estilo
git commit -m "refactor: refatoração Z"          # Refatoração
git commit -m "test: adicionar testes"           # Testes
git commit -m "chore: atualizar dependências"    # Manutenção
```

---

## 🔐 Proteger Informações Sensíveis

**ANTES de fazer push:**

1. **Verifique se não tem credenciais:**

```bash
grep -r "GOOGLE_PRIVATE_KEY" . --exclude-dir=node_modules
grep -r "JWT_SECRET" . --exclude-dir=node_modules
```

2. **Se encontrar algo fora do .env:**

```bash
# Remover do histórico (ANTES do primeiro push)
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch arquivo-com-senha.txt" \
  --prune-empty --tag-name-filter cat -- --all
```

---

## 🌟 Após Criar o Repositório

### Configurar GitHub Actions (Opcional)

O GitHub pode rodar testes automaticamente. Veja `DEPLOY.md` para mais detalhes.

### Adicionar Badge no README

Depois do deploy, adicione badges:

```markdown
![Backend](https://img.shields.io/badge/backend-Node.js-green)
![Frontend](https://img.shields.io/badge/frontend-React-blue)
![License](https://img.shields.io/badge/license-MIT-yellow)
```

### Configurar Issues e Projects

No GitHub:

- **Issues:** Para rastrear bugs e melhorias
- **Projects:** Para organizar tarefas
- **Wiki:** Para documentação adicional

---

## 🚀 Próximos Passos

Depois de criar o repositório:

1. ✅ Código no GitHub
2. 📤 Deploy Backend no Render (veja `DEPLOY.md`)
3. 📤 Deploy Frontend no Vercel (veja `DEPLOY.md`)
4. 🎉 Aplicação online!

---

## 💡 Dica Pro

Crie um `.github/` com templates:

```bash
mkdir -p .github/ISSUE_TEMPLATE
```

Adicione templates para issues e pull requests para manter o projeto organizado!
