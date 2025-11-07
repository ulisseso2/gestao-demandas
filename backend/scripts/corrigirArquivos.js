require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const { sheets, SPREADSHEET_ID, SHEETS } = require('../config/googleSheets');
const { drive, FOLDER_ID } = require('../config/googleDrive');

async function corrigirArquivos() {
    try {
        console.log('🔧 Corrigindo arquivos nas demandas...\n');
        
        // Buscar todas as demandas
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: SPREADSHEET_ID,
            range: `${SHEETS.DEMANDAS}!A2:L`,
        });

        const demandas = response.data.values || [];
        
        // Listar todos os arquivos do Drive
        console.log('📂 Listando arquivos do Google Drive...\n');
        const filesResponse = await drive.files.list({
            q: `'${FOLDER_ID}' in parents and trashed=false`,
            supportsAllDrives: true,
            includeItemsFromAllDrives: true,
            fields: 'files(id, name)',
            pageSize: 100,
        });

        const driveFiles = filesResponse.data.files;
        console.log(`Encontrados ${driveFiles.length} arquivos no Drive\n`);

        let corrigidos = 0;

        for (let i = 0; i < demandas.length; i++) {
            const demanda = demandas[i];
            const rowNumber = i + 2; // +2 porque começa em A2
            const arquivo = demanda[7]; // Coluna H

            if (!arquivo) continue;

            // Se já é uma URL, pular
            if (arquivo.startsWith('http')) {
                console.log(`✅ ${demanda[0]} - Já tem URL correta`);
                continue;
            }

            // Procurar o arquivo no Drive pelo nome
            const driveFile = driveFiles.find(f => f.name === arquivo);

            if (driveFile) {
                const directLink = `https://drive.google.com/uc?export=view&id=${driveFile.id}`;
                
                // Atualizar no Sheets
                await sheets.spreadsheets.values.update({
                    spreadsheetId: SPREADSHEET_ID,
                    range: `${SHEETS.DEMANDAS}!H${rowNumber}`,
                    valueInputOption: 'RAW',
                    resource: { values: [[directLink]] }
                });

                console.log(`🔧 ${demanda[0]} - Corrigido`);
                console.log(`   Nome: ${arquivo}`);
                console.log(`   ID: ${driveFile.id}`);
                console.log(`   URL: ${directLink}\n`);
                corrigidos++;
            } else {
                console.log(`❌ ${demanda[0]} - Arquivo não encontrado no Drive: ${arquivo}\n`);
            }
        }

        console.log('='.repeat(70));
        console.log(`\n✅ Processo concluído! ${corrigidos} arquivo(s) corrigido(s)\n`);

    } catch (error) {
        console.error('❌ Erro:', error.message);
        process.exit(1);
    }
}

corrigirArquivos();
