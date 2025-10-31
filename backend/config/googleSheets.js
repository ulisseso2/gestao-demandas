const { google } = require('googleapis');

// Configuração do Google Sheets
const auth = new google.auth.GoogleAuth({
    credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({ version: 'v4', auth });
const SPREADSHEET_ID = process.env.GOOGLE_SHEET_ID;

// Nome das abas
const SHEETS = {
    DEMANDAS: 'Demandas',
    USUARIOS: 'Usuarios',
};

// Função para inicializar as planilhas
async function initializeSheets() {
    try {
        const spreadsheet = await sheets.spreadsheets.get({
            spreadsheetId: SPREADSHEET_ID,
        });

        const sheetNames = spreadsheet.data.sheets.map(sheet => sheet.properties.title);

        // Criar aba de Demandas se não existir
        if (!sheetNames.includes(SHEETS.DEMANDAS)) {
            await sheets.spreadsheets.batchUpdate({
                spreadsheetId: SPREADSHEET_ID,
                resource: {
                    requests: [{
                        addSheet: {
                            properties: { title: SHEETS.DEMANDAS }
                        }
                    }]
                }
            });

            // Adicionar cabeçalhos
            await sheets.spreadsheets.values.update({
                spreadsheetId: SPREADSHEET_ID,
                range: `${SHEETS.DEMANDAS}!A1:J1`,
                valueInputOption: 'RAW',
                resource: {
                    values: [[
                        'ID', 'Data', 'Demandante', 'Email', 'Tema', 'CPF Aluno',
                        'Descrição', 'Arquivo', 'Status', 'Responsável'
                    ]]
                }
            });
        }

        // Criar aba de Usuários se não existir
        if (!sheetNames.includes(SHEETS.USUARIOS)) {
            await sheets.spreadsheets.batchUpdate({
                spreadsheetId: SPREADSHEET_ID,
                resource: {
                    requests: [{
                        addSheet: {
                            properties: { title: SHEETS.USUARIOS }
                        }
                    }]
                }
            });

            // Adicionar cabeçalhos
            await sheets.spreadsheets.values.update({
                spreadsheetId: SPREADSHEET_ID,
                range: `${SHEETS.USUARIOS}!A1:E1`,
                valueInputOption: 'RAW',
                resource: {
                    values: [['ID', 'Nome', 'Email', 'Senha Hash', 'Tipo']]
                }
            });
        }

        console.log('✅ Google Sheets inicializado com sucesso');
    } catch (error) {
        console.error('❌ Erro ao inicializar Google Sheets:', error.message);
    }
}

module.exports = {
    sheets,
    SPREADSHEET_ID,
    SHEETS,
    initializeSheets,
};
