require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const { drive, FOLDER_ID } = require('../config/googleDrive');

async function verificarPermissoes() {
    try {
        console.log('🔍 Verificando configuração do Shared Drive...\n');
        console.log('Shared Drive ID:', FOLDER_ID);

        // Verificar informações do Drive
        const driveInfo = await drive.drives.get({
            driveId: FOLDER_ID,
        });

        console.log('\n📁 Informações do Shared Drive:');
        console.log('Nome:', driveInfo.data.name);
        console.log('ID:', driveInfo.data.id);
        console.log('\n');

        // Listar permissões do Shared Drive
        console.log('🔐 Permissões do Shared Drive:');
        const permissions = await drive.permissions.list({
            fileId: FOLDER_ID,
            supportsAllDrives: true,
            fields: 'permissions(id, type, role, emailAddress)',
        });

        permissions.data.permissions.forEach(perm => {
            console.log(`  - Tipo: ${perm.type}, Papel: ${perm.role}, Email: ${perm.emailAddress || 'N/A'}`);
        });

        // Listar alguns arquivos do Shared Drive
        console.log('\n📄 Arquivos recentes no Shared Drive:');
        const files = await drive.files.list({
            q: `'${FOLDER_ID}' in parents and trashed=false`,
            supportsAllDrives: true,
            includeItemsFromAllDrives: true,
            fields: 'files(id, name, mimeType, webViewLink)',
            pageSize: 5,
        });

        if (files.data.files.length === 0) {
            console.log('  Nenhum arquivo encontrado.');
        } else {
            files.data.files.forEach(file => {
                console.log(`\n  📎 ${file.name}`);
                console.log(`     ID: ${file.id}`);
                console.log(`     Link: ${file.webViewLink}`);
                console.log(`     Preview: https://drive.google.com/file/d/${file.id}/preview`);
            });
        }

        console.log('\n\n✅ Verificação concluída!');
        console.log('\n💡 IMPORTANTE:');
        console.log('Para que os arquivos sejam acessíveis:');
        console.log('1. O Shared Drive deve permitir acesso "Qualquer pessoa com o link"');
        console.log('2. Ou configure manualmente no Google Drive:');
        console.log('   - Abra o Shared Drive: https://drive.google.com/drive/folders/' + FOLDER_ID);
        console.log('   - Clique com botão direito > Compartilhar');
        console.log('   - Configure "Qualquer pessoa com o link" como "Leitor"');

    } catch (error) {
        console.error('❌ Erro:', error.message);
        if (error.code === 404) {
            console.error('\n⚠️ O Shared Drive não foi encontrado ou você não tem acesso.');
        }
        process.exit(1);
    }
}

verificarPermissoes();
