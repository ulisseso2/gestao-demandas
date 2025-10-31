const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

// Verificar se as credenciais existem
if (!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY) {
    console.error('❌ Credenciais do Google não configuradas!');
    console.error('Configure GOOGLE_SERVICE_ACCOUNT_EMAIL e GOOGLE_PRIVATE_KEY no .env');
    process.exit(1);
}

// Verificar se o FOLDER_ID existe
if (!process.env.GOOGLE_DRIVE_FOLDER_ID) {
    console.error('❌ GOOGLE_DRIVE_FOLDER_ID não configurado!');
    console.error('Configure esta variável de ambiente no .env');
    process.exit(1);
}

// Autenticação com Google Drive (mesmo padrão do googleSheets.js)
const auth = new google.auth.GoogleAuth({
    credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    },
    scopes: ['https://www.googleapis.com/auth/drive.file'],
});

const drive = google.drive({ version: 'v3', auth });

// ID da pasta no Google Drive onde os arquivos serão salvos
const FOLDER_ID = process.env.GOOGLE_DRIVE_FOLDER_ID;

console.log('✅ Google Drive configurado com sucesso');

/**
 * Faz upload de arquivo para o Google Drive
 * @param {string} filePath - Caminho local do arquivo
 * @param {string} fileName - Nome do arquivo
 * @param {string} mimeType - Tipo MIME do arquivo
 * @returns {Promise<Object>} - Objeto com fileId e webViewLink
 */
async function uploadToDrive(filePath, fileName, mimeType) {
    try {
        const fileMetadata = {
            name: fileName,
            parents: [FOLDER_ID], // Pasta onde será salvo
        };

        const media = {
            mimeType: mimeType,
            body: fs.createReadStream(filePath),
        };

        const response = await drive.files.create({
            requestBody: fileMetadata,
            media: media,
            fields: 'id, webViewLink, webContentLink',
        });

        // Tornar o arquivo público (qualquer pessoa com o link pode ver)
        await drive.permissions.create({
            fileId: response.data.id,
            requestBody: {
                role: 'reader',
                type: 'anyone',
            },
        });

        // Retornar informações do arquivo
        return {
            fileId: response.data.id,
            webViewLink: response.data.webViewLink,
            webContentLink: response.data.webContentLink,
            directLink: `https://drive.google.com/uc?export=view&id=${response.data.id}`
        };
    } catch (error) {
        console.error('Erro ao fazer upload para Google Drive:', error);
        throw error;
    }
}

/**
 * Deleta arquivo do Google Drive
 * @param {string} fileId - ID do arquivo no Drive
 */
async function deleteFromDrive(fileId) {
    try {
        await drive.files.delete({
            fileId: fileId,
        });
        return { success: true };
    } catch (error) {
        console.error('Erro ao deletar arquivo do Google Drive:', error);
        throw error;
    }
}

module.exports = {
    drive,
    uploadToDrive,
    deleteFromDrive,
    FOLDER_ID
};
