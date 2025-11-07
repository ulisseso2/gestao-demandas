require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const { sheets, SPREADSHEET_ID } = require('../config/googleSheets');

async function adicionarColunas() {
    try {
        console.log('Adicionando cabeçalhos das colunas K e L...');

        // Adicionar cabeçalhos na linha 1
        await sheets.spreadsheets.values.update({
            spreadsheetId: SPREADSHEET_ID,
            range: 'Demandas!K1:L1',
            valueInputOption: 'RAW',
            resource: {
                values: [['Data Conclusão', 'Tempo Conclusão']]
            }
        });

        console.log('✅ Colunas adicionadas com sucesso!');
        console.log('   - Coluna K: Data Conclusão');
        console.log('   - Coluna L: Tempo Conclusão');
        console.log('\nPróximos passos:');
        console.log('1. Quando um admin mudar o status para "Concluído", essas colunas serão preenchidas automaticamente');
        console.log('2. Data Conclusão: formato dd/mm/aaaa hh:mm');
        console.log('3. Tempo Conclusão: calculado desde a criação (ex: "2 dias, 3 horas")');

    } catch (error) {
        console.error('❌ Erro ao adicionar colunas:', error.message);
        process.exit(1);
    }
}

adicionarColunas();
