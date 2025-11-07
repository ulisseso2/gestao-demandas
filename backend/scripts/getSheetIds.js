require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const { sheets, SPREADSHEET_ID } = require('../config/googleSheets');

async function getSheetIds() {
    try {
        console.log('Buscando IDs das abas...\n');

        const spreadsheet = await sheets.spreadsheets.get({
            spreadsheetId: SPREADSHEET_ID,
        });

        spreadsheet.data.sheets.forEach(sheet => {
            console.log(`Aba: ${sheet.properties.title}`);
            console.log(`  Sheet ID: ${sheet.properties.sheetId}`);
            console.log(`  Index: ${sheet.properties.index}\n`);
        });

    } catch (error) {
        console.error('❌ Erro:', error.message);
        process.exit(1);
    }
}

getSheetIds();
