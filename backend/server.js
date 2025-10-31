require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const demandasRoutes = require('./routes/demandas');
const { initializeSheets } = require('./config/googleSheets');

const app = express();
const PORT = process.env.PORT || 5000;

// Configuração CORS - Aceitar Vercel e localhost
const corsOptions = {
    origin: function (origin, callback) {
        // Permitir requisições sem origin (mobile apps, Postman, etc)
        if (!origin) return callback(null, true);

        // Permitir localhost em desenvolvimento
        if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
            return callback(null, true);
        }

        // Permitir Vercel (todos os deploys: produção e preview)
        if (origin.includes('vercel.app')) {
            return callback(null, true);
        }

        // Permitir domínio personalizado se configurado
        if (process.env.FRONTEND_URL && origin === process.env.FRONTEND_URL) {
            return callback(null, true);
        }

        // Por segurança, negar outras origens
        callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};

// Middlewares
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rotas
app.use('/api/auth', authRoutes);
app.use('/api/demandas', demandasRoutes);

// Rota de saúde
app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Iniciar servidor e Google Sheets
app.listen(PORT, async () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
    console.log('');

    // Inicializar Google Sheets
    await initializeSheets();
});
