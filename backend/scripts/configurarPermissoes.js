require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const { drive, FOLDER_ID } = require('../config/googleDrive');

async function configurarPermissoesPublicas() {
    try {
        console.log('🔓 Configurando Shared Drive como público...\n');
        console.log('Shared Drive ID:', FOLDER_ID);

        // Tentar adicionar permissão pública ao Shared Drive
        try {
            await drive.permissions.create({
                fileId: FOLDER_ID,
                requestBody: {
                    role: 'reader',
                    type: 'anyone',
                },
                supportsAllDrives: true,
                sendNotificationEmail: false,
            });

            console.log('✅ Permissão pública adicionada ao Shared Drive!');
            console.log('   Agora qualquer pessoa com o link pode visualizar os arquivos.\n');

        } catch (error) {
            if (error.code === 403) {
                console.error('❌ Erro 403: Sem permissão para modificar o Shared Drive.');
                console.error('\n⚠️ SOLUÇÃO MANUAL NECESSÁRIA:');
                console.error('Como você é o proprietário (ulisses@maisquestoes.com.br), faça o seguinte:');
                console.error('\n1. Abra o Shared Drive:');
                console.error('   https://drive.google.com/drive/folders/0ADXNyZ046I9xUk9PVA');
                console.error('\n2. Clique com botão direito no Shared Drive "Gestao Demandas"');
                console.error('   (ou clique nos 3 pontos ao lado do nome)');
                console.error('\n3. Selecione "Compartilhar"');
                console.error('\n4. Clique em "Alterar" ao lado de "Restrito"');
                console.error('\n5. Selecione "Qualquer pessoa com o link"');
                console.error('\n6. Certifique-se que o papel está como "Leitor"');
                console.error('\n7. Clique em "Concluído"');
                console.error('\n⚠️ IMPORTANTE: Isso tornará TODOS os arquivos do Shared Drive públicos!');
                console.error('   Qualquer pessoa com o link poderá visualizar.\n');
            } else {
                throw error;
            }
        }

        // Listar arquivos e tentar configurar permissões individuais
        console.log('🔄 Verificando arquivos individuais...\n');
        const files = await drive.files.list({
            q: `'${FOLDER_ID}' in parents and trashed=false`,
            supportsAllDrives: true,
            includeItemsFromAllDrives: true,
            fields: 'files(id, name)',
            pageSize: 100,
        });

        if (files.data.files.length > 0) {
            console.log(`📄 Encontrados ${files.data.files.length} arquivos.\n`);

            let sucessos = 0;
            let erros = 0;

            for (const file of files.data.files) {
                try {
                    await drive.permissions.create({
                        fileId: file.id,
                        requestBody: {
                            role: 'reader',
                            type: 'anyone',
                        },
                        supportsAllDrives: true,
                        sendNotificationEmail: false,
                    });
                    console.log(`✅ ${file.name}`);
                    sucessos++;
                } catch (error) {
                    console.log(`⚠️  ${file.name} - ${error.message}`);
                    erros++;
                }
            }

            console.log(`\n📊 Resultado: ${sucessos} sucessos, ${erros} erros`);

            if (erros > 0) {
                console.log('\n💡 Se houve erros, use a solução manual acima.');
            }
        }

    } catch (error) {
        console.error('❌ Erro:', error.message);
        process.exit(1);
    }
}

configurarPermissoesPublicas();
