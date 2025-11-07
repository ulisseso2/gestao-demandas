require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const { drive, FOLDER_ID } = require('../config/googleDrive');

async function mostrarInstrucoes() {
    try {
        console.log('📋 GUIA COMPLETO - Configurar Shared Drive Público\n');
        console.log('=' .repeat(70));
        
        // Verificar permissões atuais
        const permissions = await drive.permissions.list({
            fileId: FOLDER_ID,
            supportsAllDrives: true,
            fields: 'permissions(id, type, role, emailAddress, domain)',
        });

        console.log('\n🔐 PERMISSÕES ATUAIS DO SHARED DRIVE:\n');
        permissions.data.permissions.forEach((perm, index) => {
            console.log(`${index + 1}. Tipo: ${perm.type}`);
            console.log(`   Papel: ${perm.role}`);
            if (perm.emailAddress) console.log(`   Email: ${perm.emailAddress}`);
            if (perm.domain) console.log(`   Domínio: ${perm.domain}`);
            console.log('');
        });

        const temPermissaoPublica = permissions.data.permissions.some(p => p.type === 'anyone');

        if (temPermissaoPublica) {
            console.log('✅ ÓTIMO! O Shared Drive JÁ ESTÁ PÚBLICO!\n');
            console.log('Os arquivos devem estar acessíveis agora.\n');
        } else {
            console.log('❌ O Shared Drive ainda NÃO está público.\n');
            console.log('=' .repeat(70));
            console.log('\n📝 INSTRUÇÕES PASSO A PASSO:\n');
            console.log('1️⃣  Abra este link no navegador:');
            console.log('   https://drive.google.com/drive/folders/0ADXNyZ046I9xUk9PVA\n');
            
            console.log('2️⃣  Você verá o nome "Gestao Demandas" no topo da página\n');
            
            console.log('3️⃣  OPÇÃO A - Compartilhar pela pasta:');
            console.log('   - Clique com BOTÃO DIREITO em qualquer espaço vazio');
            console.log('   - Selecione "Configurações do Drive compartilhado"\n');
            
            console.log('   OPÇÃO B - Compartilhar pelo ícone:');
            console.log('   - Procure o ícone de PESSOA com + no canto superior direito');
            console.log('   - Clique nele\n');
            
            console.log('4️⃣  Na janela que abrir:');
            console.log('   - Procure por "Geral" ou "General access"');
            console.log('   - Pode estar escrito "Restricted" ou "Restrito"');
            console.log('   - Clique em "Change" ou "Alterar"\n');
            
            console.log('5️⃣  Selecione uma destas opções:');
            console.log('   - "Anyone with the link" (inglês)');
            console.log('   - "Qualquer pessoa com o link" (português)\n');
            
            console.log('6️⃣  Certifique-se que está marcado:');
            console.log('   - "Viewer" ou "Leitor" (NÃO Editor)\n');
            
            console.log('7️⃣  Clique em "Done" ou "Concluído"\n');
            
            console.log('=' .repeat(70));
            console.log('\n🔄 ALTERNATIVA - Configuração por Política:\n');
            console.log('Se não encontrar as opções acima:');
            console.log('1. Clique nos 3 pontos (⋮) ao lado de "Gestao Demandas"');
            console.log('2. Selecione "Configurações do Drive compartilhado"');
            console.log('3. Vá em "Compartilhamento"');
            console.log('4. Habilite "Membros podem compartilhar arquivos"\n');
        }

        console.log('=' .repeat(70));
        console.log('\n🧪 TESTE RÁPIDO:\n');
        console.log('Após configurar, abra este link em aba anônima:');
        console.log('https://drive.google.com/file/d/1pLVFVwi-FnBx56FLXmwi4HoMurt7aLnb/preview');
        console.log('\nSe abrir a imagem → SUCESSO! ✅');
        console.log('Se der erro 403 → Ainda não está público ❌\n');
        
        console.log('=' .repeat(70));
        console.log('\n💡 DICA FINAL:\n');
        console.log('Se mesmo assim não conseguir, você pode:');
        console.log('1. Mover os arquivos para uma pasta NORMAL (não Shared Drive)');
        console.log('2. Compartilhar essa pasta como "Qualquer pessoa com o link"');
        console.log('3. Atualizar o GOOGLE_DRIVE_FOLDER_ID no .env\n');

    } catch (error) {
        console.error('❌ Erro:', error.message);
        process.exit(1);
    }
}

mostrarInstrucoes();
