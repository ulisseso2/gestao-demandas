const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { sheets, SPREADSHEET_ID, SHEETS } = require('../config/googleSheets');
const { authenticateToken, isAdmin } = require('../middleware/auth');

const router = express.Router();

// Configuração do Multer para upload de arquivos
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = './uploads';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${file.originalname}`;
        cb(null, uniqueName);
    }
});

const upload = multer({
    storage,
    limits: { fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5242880 }, // 5MB padrão
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|pdf|doc|docx|xls|xlsx/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('Tipo de arquivo não permitido'));
    }
});

// Criar nova demanda
router.post('/', authenticateToken, upload.single('arquivo'), async (req, res) => {
    try {
        const { tema, cpfAluno, descricao, status = 'Solicitado', responsavel = '' } = req.body;
        const { nome, email } = req.user;

        if (!tema || !descricao) {
            return res.status(400).json({ error: 'Tema e descrição são obrigatórios' });
        }

        // Validar CPF se tema for "aluno"
        if (tema.toLowerCase() === 'aluno' && !cpfAluno) {
            return res.status(400).json({ error: 'CPF do aluno é obrigatório para este tema' });
        }

        const id = `DEM-${Date.now()}`;
        const data = new Date().toLocaleString('pt-BR');
        const arquivo = req.file ? req.file.filename : '';

        // Adicionar à planilha
        await sheets.spreadsheets.values.append({
            spreadsheetId: SPREADSHEET_ID,
            range: `${SHEETS.DEMANDAS}!A2:J`,
            valueInputOption: 'RAW',
            resource: {
                values: [[
                    id,
                    data,
                    nome,
                    email,
                    tema,
                    cpfAluno || '',
                    descricao,
                    arquivo,
                    status,
                    responsavel
                ]]
            }
        });

        res.status(201).json({
            message: 'Demanda criada com sucesso',
            demanda: { id, data, demandante: nome, tema, status }
        });
    } catch (error) {
        console.error('Erro ao criar demanda:', error);
        res.status(500).json({ error: 'Erro ao criar demanda' });
    }
});

// Listar demandas
router.get('/', authenticateToken, async (req, res) => {
    try {
        const { filtro = 'todos' } = req.query;
        const { email, tipo } = req.user;

        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: SPREADSHEET_ID,
            range: `${SHEETS.DEMANDAS}!A2:J`,
        });

        let demandas = (response.data.values || []).map(row => ({
            id: row[0],
            data: row[1],
            demandante: row[2],
            emailDemandante: row[3],
            tema: row[4],
            cpfAluno: row[5],
            descricao: row[6],
            arquivo: row[7],
            status: row[8],
            responsavel: row[9]
        }));

        // Aplicar filtros
        if (filtro === 'meus' && tipo !== 'admin') {
            demandas = demandas.filter(d => d.emailDemandante === email);
        }

        res.json({ demandas });
    } catch (error) {
        console.error('Erro ao listar demandas:', error);
        res.status(500).json({ error: 'Erro ao listar demandas' });
    }
});

// Atualizar demanda (apenas admin)
router.put('/:id', authenticateToken, isAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { status, responsavel } = req.body;

        // Buscar demanda
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: SPREADSHEET_ID,
            range: `${SHEETS.DEMANDAS}!A2:J`,
        });

        const demandas = response.data.values || [];
        const rowIndex = demandas.findIndex(row => row[0] === id);

        if (rowIndex === -1) {
            return res.status(404).json({ error: 'Demanda não encontrada' });
        }

        const rowNumber = rowIndex + 2; // +2 porque começa em A2

        // Atualizar status
        if (status) {
            await sheets.spreadsheets.values.update({
                spreadsheetId: SPREADSHEET_ID,
                range: `${SHEETS.DEMANDAS}!I${rowNumber}`,
                valueInputOption: 'RAW',
                resource: { values: [[status]] }
            });
        }

        // Atualizar responsável
        if (responsavel !== undefined) {
            await sheets.spreadsheets.values.update({
                spreadsheetId: SPREADSHEET_ID,
                range: `${SHEETS.DEMANDAS}!J${rowNumber}`,
                valueInputOption: 'RAW',
                resource: { values: [[responsavel]] }
            });
        }

        res.json({ message: 'Demanda atualizada com sucesso' });
    } catch (error) {
        console.error('Erro ao atualizar demanda:', error);
        res.status(500).json({ error: 'Erro ao atualizar demanda' });
    }
});

// Listar usuários (para select de responsável)
router.get('/usuarios/lista', authenticateToken, isAdmin, async (req, res) => {
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

module.exports = router;
