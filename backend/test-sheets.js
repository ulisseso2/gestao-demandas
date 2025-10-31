require('dotenv').config();

// Script para testar configuração do Google Sheets
console.log('🔍 Verificando configuração do Google Sheets...\n');

// Verificar variáveis de ambiente
const checks = {
    'GOOGLE_SHEET_ID': process.env.GOOGLE_SHEET_ID,
    'GOOGLE_SERVICE_ACCOUNT_EMAIL': process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    'GOOGLE_PRIVATE_KEY': process.env.GOOGLE_PRIVATE_KEY ? '✅ Configurada' : '❌ Não encontrada'
};

let hasErrors = false;

for (const [key, value] of Object.entries(checks)) {
    if (!value || value === 'seu_sheet_id_aqui' || value === 'seu_email_aqui' || value === 'sua_chave_privada_aqui') {
        console.log(`❌ ${key}: NÃO CONFIGURADA`);
        hasErrors = true;
    } else {
        if (key === 'GOOGLE_PRIVATE_KEY') {
            console.log(`✅ ${key}: ${value}`);
        } else {
            console.log(`✅ ${key}: ${value}`);
        }
    }
}

console.log('\n---\n');

if (hasErrors) {
    console.log('❌ ERRO: Configure todas as variáveis de ambiente no arquivo .env\n');
    console.log('Passos:');
    console.log('1. Copie .env.example para .env: cp .env.example .env');
    console.log('2. Siga o guia em GOOGLE_SHEETS_SETUP.md');
    console.log('3. Edite o arquivo .env com suas credenciais\n');
    process.exit(1);
}

// Tentar conectar
console.log('🔄 Testando conexão com Google Sheets...\n');

const { initializeSheets } = require('./config/googleSheets');

initializeSheets()
    .then(() => {
        console.log('\n✅ Conexão bem-sucedida! As abas foram criadas na planilha.\n');
        process.exit(0);
    })
    .catch((error) => {
        console.log('\n❌ Erro ao conectar:\n');
        console.error(error.message);
        console.log('\n');
        console.log('Possíveis causas:');
        console.log('- A planilha não foi compartilhada com a conta de serviço');
        console.log('- O SHEET_ID está incorreto');
        console.log('- A chave privada está malformatada (deve ter \\n preservados)');
        console.log('\nVeja GOOGLE_SHEETS_SETUP.md para mais detalhes.\n');
        process.exit(1);
    });
