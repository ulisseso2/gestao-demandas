require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const demandasRoutes = require('./routes/demandas');
const { initializeSheets } = require('./config/googleSheets');

const app = express();
const PORT = process.env.PORT || 5000;

// Configuração CORS
const corsOptions = {
    origin: function (origin, callback) {
        // Permitir requisições sem origin (mobile apps, Postman, etc)
        if (!origin) return callback(null, true);

        // Lista de origens permitidas
        const allowedOrigins = [
            'http://localhost:3000',
            'http://localhost:3001',
            'http://127.0.0.1:3000',
            process.env.FRONTEND_URL,
        ].filter(Boolean);

        // Permitir qualquer origem em desenvolvimento
        if (process.env.NODE_ENV !== 'production') {
            return callback(null, true);
        }

        // Em produção, verificar origem
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(null, true); // Permissivo por enquanto
        }
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
