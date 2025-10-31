require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const demandasRoutes = require('./routes/demandas');
const { initializeSheets } = require('./config/googleSheets');

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
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
