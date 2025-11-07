require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const { sheets, SPREADSHEET_ID, SHEETS } = require('../config/googleSheets');

async function limparArquivoInvalido() {
    try {
        console.log('🧹 Limpando arquivo inválido da demanda DEM-1761911833203...\n');
        
        // Buscar demandas
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: SPREADSHEET_ID,
            range: `${SHEETS.DEMANDAS}!A2:L`,
        });

        const demandas = response.data.values || [];
        const rowIndex = demandas.findIndex(row => row[0] === 'DEM-1761911833203');

        if (rowIndex === -1) {
            console.log('❌ Demanda não encontrada');
            return;
        }

        const rowNumber = rowIndex + 2;

        // Limpar a coluna de arquivo
        await sheets.spreadsheets.values.update({
            spreadsheetId: SPREADSHEET_ID,
            range: `${SHEETS.DEMANDAS}!H${rowNumber}`,
            valueInputOption: 'RAW',
            resource: { values: [['']] }
        });

        console.log('✅ Arquivo inválido removido da demanda');
        console.log('   A demanda agora aparecerá sem arquivo anexado\n');

    } catch (error) {
        console.error('❌ Erro:', error.message);
        process.exit(1);
    }
}

limparArquivoInvalido();
