const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sheets, SPREADSHEET_ID, SHEETS } = require('../config/googleSheets');

const router = express.Router();

// Registro de usuário
router.post('/register', async (req, res) => {
    try {
        const { nome, email, senha, tipo = 'user' } = req.body;

        if (!nome || !email || !senha) {
            return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
        }

        // Verificar se usuário já existe
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: SPREADSHEET_ID,
            range: `${SHEETS.USUARIOS}!A2:E`,
        });

        const usuarios = response.data.values || [];
        const usuarioExiste = usuarios.find(u => u[2] === email);

        if (usuarioExiste) {
            return res.status(400).json({ error: 'Email já cadastrado' });
        }

        // Hash da senha
        const hashedPassword = await bcrypt.hash(senha, 10);

        // Gerar ID
        const id = `USER-${Date.now()}`;

        // Adicionar usuário
        await sheets.spreadsheets.values.append({
            spreadsheetId: SPREADSHEET_ID,
            range: `${SHEETS.USUARIOS}!A2:E`,
            valueInputOption: 'RAW',
            resource: {
                values: [[id, nome, email, hashedPassword, tipo]]
            }
        });

        res.status(201).json({ message: 'Usuário cadastrado com sucesso', id });
    } catch (error) {
        console.error('Erro ao registrar usuário:', error);
        res.status(500).json({ error: 'Erro ao cadastrar usuário' });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, senha } = req.body;

        if (!email || !senha) {
            return res.status(400).json({ error: 'Email e senha são obrigatórios' });
        }

        // Buscar usuário
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: SPREADSHEET_ID,
            range: `${SHEETS.USUARIOS}!A2:E`,
        });

        const usuarios = response.data.values || [];
        const usuario = usuarios.find(u => u[2] === email);

        if (!usuario) {
            return res.status(401).json({ error: 'Credenciais inválidas' });
        }

        const [id, nome, emailUser, hashedPassword, tipo] = usuario;

        // Verificar senha
        const senhaValida = await bcrypt.compare(senha, hashedPassword);

        if (!senhaValida) {
            return res.status(401).json({ error: 'Credenciais inválidas' });
        }

        // Gerar token
        const token = jwt.sign(
            { id, nome, email: emailUser, tipo },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            token,
            user: { id, nome, email: emailUser, tipo }
        });
    } catch (error) {
        console.error('Erro ao fazer login:', error);
        res.status(500).json({ error: 'Erro ao fazer login' });
    }
});

// Verificar token
router.get('/me', async (req, res) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({ error: 'Token não fornecido' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        res.json({ user: decoded });
    } catch (error) {
        res.status(403).json({ error: 'Token inválido' });
    }
});

module.exports = router;
