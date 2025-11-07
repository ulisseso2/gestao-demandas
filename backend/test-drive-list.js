require('dotenv').config();
const { google } = require('googleapis');

async function testDriveAccess() {
    try {
        console.log('🔍 Testando acesso geral ao Google Drive...\n');

        const auth = new google.auth.GoogleAuth({
            credentials: {
                client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
                private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
            },
            scopes: ['https://www.googleapis.com/auth/drive'],
        });

        const drive = google.drive({ version: 'v3', auth });

        console.log('1️⃣ Listando TODOS os arquivos/pastas compartilhados com a service account...\n');

        const response = await drive.files.list({
            pageSize: 50,
            fields: 'files(id, name, mimeType, shared, ownedByMe, owners)',
            q: "sharedWithMe=true"
        });

        if (response.data.files.length === 0) {
            console.log('❌ NENHUM arquivo ou pasta foi encontrado!');
            console.log('\n💡 Isso significa que o compartilhamento NÃO está funcionando.');
            console.log('\n📋 Possíveis causas:');
            console.log('1. O compartilhamento ainda não propagou (aguarde 1-2 minutos)');
            console.log('2. A pasta foi compartilhada com um email diferente');
            console.log('3. O projeto Google Cloud está em uma organização diferente');
        } else {
            console.log(`✅ Encontrados ${response.data.files.length} arquivos/pastas compartilhados:\n`);

            response.data.files.forEach((file, index) => {
                console.log(`${index + 1}. ${file.name}`);
                console.log(`   ID: ${file.id}`);
                console.log(`   Tipo: ${file.mimeType}`);
                console.log(`   Proprietário: ${file.owners?.[0]?.emailAddress || 'N/A'}`);
                console.log('');
            });

            const targetFolder = response.data.files.find(f => f.id === process.env.GOOGLE_DRIVE_FOLDER_ID);
            if (targetFolder) {
                console.log('🎉 A pasta alvo FOI ENCONTRADA!');
                console.log('Nome:', targetFolder.name);
            } else {
                console.log('⚠️  A pasta alvo NÃO está na lista de compartilhados.');
                console.log('ID procurado:', process.env.GOOGLE_DRIVE_FOLDER_ID);
            }
        }

    } catch (error) {
        console.error('❌ Erro:', error.message);
        if (error.response) {
            console.error('Detalhes:', error.response.data);
        }
    }
}

testDriveAccess();
