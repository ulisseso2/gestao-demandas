require('dotenv').config();
const { google } = require('googleapis');

async function testDrivePermissions() {
    try {
        console.log('🔍 Testando permissões do Google Drive...\n');

        // Autenticação
        const auth = new google.auth.GoogleAuth({
            credentials: {
                client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
                private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
            },
            scopes: ['https://www.googleapis.com/auth/drive'],
        });

        const drive = google.drive({ version: 'v3', auth });
        const FOLDER_ID = process.env.GOOGLE_DRIVE_FOLDER_ID;

        console.log('📧 Service Account:', process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL);
        console.log('📁 Folder ID:', FOLDER_ID);
        console.log('');

        // 1. Tentar acessar a pasta
        console.log('1️⃣ Tentando acessar a pasta...');
        try {
            const folder = await drive.files.get({
                fileId: FOLDER_ID,
                fields: 'id, name, owners, permissions'
            });
            console.log('✅ Pasta encontrada:', folder.data.name);
            console.log('   Proprietário:', folder.data.owners?.[0]?.emailAddress);
        } catch (error) {
            console.error('❌ ERRO: Não consegue acessar a pasta!');
            console.error('   Código:', error.code);
            console.error('   Mensagem:', error.message);
            console.error('');
            console.error('🔧 SOLUÇÃO:');
            console.error('   1. Abra a pasta no Google Drive');
            console.error('   2. Clique com botão direito → Compartilhar');
            console.error('   3. Adicione o email:', process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL);
            console.error('   4. Permissão: Editor');
            process.exit(1);
        }

        // 2. Tentar listar arquivos (teste de leitura)
        console.log('\n2️⃣ Testando permissão de LEITURA...');
        try {
            const list = await drive.files.list({
                q: `'${FOLDER_ID}' in parents`,
                pageSize: 5,
                fields: 'files(id, name)'
            });
            console.log('✅ Permissão de leitura OK');
            console.log('   Arquivos na pasta:', list.data.files?.length || 0);
        } catch (error) {
            console.error('❌ ERRO: Sem permissão de leitura!');
            console.error('   Mensagem:', error.message);
        }

        // 3. Tentar criar arquivo de teste (teste de escrita)
        console.log('\n3️⃣ Testando permissão de ESCRITA...');
        try {
            const testFile = await drive.files.create({
                requestBody: {
                    name: `test-${Date.now()}.txt`,
                    parents: [FOLDER_ID],
                },
                media: {
                    mimeType: 'text/plain',
                    body: 'Teste de permissão de escrita'
                },
                fields: 'id, name, webViewLink'
            });
            console.log('✅ Permissão de escrita OK');
            console.log('   Arquivo criado:', testFile.data.name);
            console.log('   ID:', testFile.data.id);

            // Deletar arquivo de teste
            await drive.files.delete({ fileId: testFile.data.id });
            console.log('   (Arquivo de teste deletado)');
        } catch (error) {
            console.error('❌ ERRO: Sem permissão de escrita!');
            console.error('   Código:', error.code);
            console.error('   Mensagem:', error.message);
            console.error('');
            console.error('🔧 SOLUÇÃO:');
            console.error('   A service account precisa de permissão "Editor" (não apenas "Visualizador")');
            process.exit(1);
        }

        console.log('\n✅ TODAS AS PERMISSÕES OK! Google Drive configurado corretamente! 🎉');

    } catch (error) {
        console.error('\n❌ ERRO GERAL:', error);
        process.exit(1);
    }
}

testDrivePermissions();
