const express = require('express');
const { sheets, SPREADSHEET_ID, SHEETS } = require('../config/googleSheets');
const { authenticateToken, isAdmin } = require('../middleware/auth');

const router = express.Router();

// Listar todos os usuários (apenas admin)
router.get('/', authenticateToken, isAdmin, async (req, res) => {
    try {
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: SPREADSHEET_ID,
            range: `${SHEETS.USUARIOS}!A2:E`,
        });

        const usuarios = (response.data.values || []).map(row => ({
            id: row[0],
            nome: row[1],
            email: row[2],
            tipo: row[4]
        }));

        res.json({ usuarios });
    } catch (error) {
        console.error('Erro ao listar usuários:', error);
        res.status(500).json({ error: 'Erro ao listar usuários' });
    }
});

// Deletar usuário (apenas admin)
router.delete('/:id', authenticateToken, isAdmin, async (req, res) => {
    try {
        const { id } = req.params;

        // Buscar usuário
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: SPREADSHEET_ID,
            range: `${SHEETS.USUARIOS}!A2:E`,
        });

        const usuarios = response.data.values || [];
        const rowIndex = usuarios.findIndex(row => row[0] === id);

        if (rowIndex === -1) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        // Verificar se não é o próprio usuário logado
        if (usuarios[rowIndex][2] === req.user.email) {
            return res.status(400).json({ error: 'Você não pode deletar seu próprio usuário' });
        }

        const rowNumber = rowIndex + 2; // +2 porque começa em A2

        // Deletar linha
        await sheets.spreadsheets.batchUpdate({
            spreadsheetId: SPREADSHEET_ID,
            resource: {
                requests: [{
                    deleteDimension: {
                        range: {
                            sheetId: 1164134244, // ID da aba Usuarios
                            dimension: 'ROWS',
                            startIndex: rowNumber - 1,
                            endIndex: rowNumber
                        }
                    }
                }]
            }
        });

        res.json({ message: 'Usuário deletado com sucesso' });
    } catch (error) {
        console.error('Erro ao deletar usuário:', error);
        res.status(500).json({ error: 'Erro ao deletar usuário' });
    }
});

module.exports = router;
