require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const { sheets, SPREADSHEET_ID, SHEETS } = require('../config/googleSheets');

async function verificarDemandas() {
    try {
        console.log('🔍 Verificando demandas no Google Sheets...\n');
        
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: SPREADSHEET_ID,
            range: `${SHEETS.DEMANDAS}!A1:L`,
        });

        const rows = response.data.values || [];
        
        if (rows.length === 0) {
            console.log('Nenhuma demanda encontrada.');
            return;
        }

        console.log('📊 CABEÇALHOS:');
        console.log(rows[0].join(' | '));
        console.log('='.repeat(100));
        
        console.log('\n📄 DEMANDAS:\n');
        
        for (let i = 1; i < rows.length; i++) {
            const row = rows[i];
            const id = row[0];
            const arquivo = row[7]; // Coluna H
            
            console.log(`${i}. ID: ${id}`);
            console.log(`   Arquivo: ${arquivo || '(sem arquivo)'}`);
            
            if (arquivo) {
                // Verificar se é URL ou fileId
                if (arquivo.startsWith('http')) {
                    console.log(`   Tipo: URL COMPLETA ✅`);
                } else {
                    console.log(`   Tipo: FILE ID (precisa construir URL) 🔧`);
                    console.log(`   Preview URL: https://drive.google.com/file/d/${arquivo}/preview`);
                }
            }
            console.log('');
        }

        console.log('='.repeat(100));
        console.log('\n💡 RESUMO:');
        console.log('- Arquivos antigos têm URL completa');
        console.log('- Arquivos novos têm apenas fileId');
        console.log('- O frontend precisa lidar com AMBOS os formatos\n');

    } catch (error) {
        console.error('❌ Erro:', error.message);
        process.exit(1);
    }
}

verificarDemandas();
