require('dotenv').config();
const { google } = require('googleapis');

async function testSharedDrive() {
    try {
        console.log('🔍 Testando Shared Drive...\n');

        const auth = new google.auth.GoogleAuth({
            credentials: {
                client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
                private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
            },
            scopes: ['https://www.googleapis.com/auth/drive'],
        });

        const drive = google.drive({ version: 'v3', auth });
        const driveId = process.env.GOOGLE_DRIVE_FOLDER_ID;

        console.log('📧 Service Account:', process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL);
        console.log('📁 Drive ID:', driveId);
        console.log('');

        // Listar Shared Drives
        console.log('1️⃣ Listando todos os Shared Drives...\n');
        const drivesList = await drive.drives.list({
            pageSize: 10,
            fields: 'drives(id, name)'
        });

        if (drivesList.data.drives.length === 0) {
            console.log('❌ Nenhum Shared Drive encontrado!');
            console.log('\n💡 A service account precisa ser adicionada como membro do Shared Drive.');
            return;
        }

        console.log(`✅ Encontrados ${drivesList.data.drives.length} Shared Drive(s):\n`);
        drivesList.data.drives.forEach((d, i) => {
            console.log(`${i + 1}. ${d.name}`);
            console.log(`   ID: ${d.id}`);
            console.log('');
        });

        // Verificar se o drive ID está na lista
        const targetDrive = drivesList.data.drives.find(d => d.id === driveId);
        if (!targetDrive) {
            console.log('⚠️  O Shared Drive alvo NÃO foi encontrado!');
            console.log('ID procurado:', driveId);
            console.log('\n📋 Certifique-se de:');
            console.log('1. Adicionar a service account como membro do Shared Drive');
            console.log('2. Dar permissão de "Gerente de conteúdo" ou "Colaborador"');
            return;
        }

        console.log('🎉 Shared Drive alvo encontrado!');
        console.log('Nome:', targetDrive.name);
        console.log('');

        // Testar escrita
        console.log('2️⃣ Testando permissão de ESCRITA...\n');
        const testFile = await drive.files.create({
            requestBody: {
                name: `test-${Date.now()}.txt`,
                parents: [driveId],
            },
            media: {
                mimeType: 'text/plain',
                body: 'Teste de permissão de escrita no Shared Drive'
            },
            supportsAllDrives: true,
            fields: 'id, name, webViewLink'
        });

        console.log('✅ Arquivo criado com sucesso!');
        console.log('   Nome:', testFile.data.name);
        console.log('   ID:', testFile.data.id);
        console.log('');

        // Deletar arquivo de teste
        await drive.files.delete({
            fileId: testFile.data.id,
            supportsAllDrives: true
        });
        console.log('✅ Arquivo de teste deletado');
        console.log('');

        console.log('🎉 SHARED DRIVE CONFIGURADO CORRETAMENTE! ✅');

    } catch (error) {
        console.error('❌ Erro:', error.message);
        if (error.response) {
            console.error('Detalhes:', error.response.data);
        }
    }
}

testSharedDrive();
