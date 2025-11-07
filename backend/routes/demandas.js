const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const os = require('os');
const { sheets, SPREADSHEET_ID, SHEETS } = require('../config/googleSheets');
const { uploadToDrive } = require('../config/googleDrive');
const { authenticateToken, isAdmin } = require('../middleware/auth');

const router = express.Router();

// Configuração do Multer para upload temporário (arquivos serão enviados ao Drive)
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Usar diretório temp do sistema (funciona melhor no Render)
        const uploadDir = path.join(os.tmpdir(), 'gestao-demandas-uploads');
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

        // 🔍 VALIDAR CPF DUPLICADO
        if (cpfAluno) {
            const response = await sheets.spreadsheets.values.get({
                spreadsheetId: SPREADSHEET_ID,
                range: `${SHEETS.DEMANDAS}!A2:J`,
            });

            const demandas = response.data.values || [];
            const cpfExistente = demandas.find(row => row[5] === cpfAluno);

            if (cpfExistente) {
                // Se existe arquivo temporário, deletar
                if (req.file) {
                    fs.unlinkSync(req.file.path);
                }
                return res.status(400).json({
                    error: 'Já tem uma solicitação para esse CPF',
                    demandaExistente: {
                        id: cpfExistente[0],
                        data: cpfExistente[1],
                        status: cpfExistente[8]
                    }
                });
            }
        }

        const id = `DEM-${Date.now()}`;
        const data = new Date().toLocaleString('pt-BR');
        let arquivoLink = '';

        // 📤 Upload para Google Drive se houver arquivo
        if (req.file) {
            try {
                const driveFile = await uploadToDrive(
                    req.file.path,
                    req.file.originalname,
                    req.file.mimetype
                );
                arquivoLink = driveFile.directLink; // Usar directLink que sempre funciona

                // Deletar arquivo temporário após upload
                fs.unlinkSync(req.file.path);
            } catch (uploadError) {
                console.error('❌ Erro no upload para Drive:', uploadError);
                console.error('Detalhes:', {
                    message: uploadError.message,
                    stack: uploadError.stack,
                    filePath: req.file?.path,
                    fileName: req.file?.originalname
                });

                // Deletar arquivo temporário em caso de erro
                if (fs.existsSync(req.file.path)) {
                    fs.unlinkSync(req.file.path);
                }

                return res.status(500).json({
                    error: 'Erro ao fazer upload do arquivo para Google Drive',
                    details: uploadError.message
                });
            }
        }

        // Adicionar à planilha
        await sheets.spreadsheets.values.append({
            spreadsheetId: SPREADSHEET_ID,
            range: `${SHEETS.DEMANDAS}!A2:L`, // Aumentado de J para L (2 novas colunas)
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
                    arquivoLink,
                    status,
                    responsavel,
                    '', // dataConclusao
                    ''  // tempoConclusao
                ]]
            }
        });

        res.status(201).json({
            message: 'Demanda criada com sucesso',
            demanda: { id, data, demandante: nome, tema, status }
        });
    } catch (error) {
        console.error('❌ Erro ao criar demanda:', error);
        console.error('Detalhes completos:', {
            message: error.message,
            stack: error.stack,
            hasFile: !!req.file,
            filePath: req.file?.path
        });

        // Limpar arquivo temporário em caso de erro
        if (req.file && fs.existsSync(req.file.path)) {
            try {
                fs.unlinkSync(req.file.path);
            } catch (unlinkError) {
                console.error('Erro ao deletar arquivo temp:', unlinkError);
            }
        }

        res.status(500).json({
            error: 'Erro ao criar demanda',
            details: error.message
        });
    }
});

// Listar demandas (TODOS podem ver TODAS)
router.get('/', authenticateToken, async (req, res) => {
    try {
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: SPREADSHEET_ID,
            range: `${SHEETS.DEMANDAS}!A2:L`, // Expandido para incluir novas colunas
        });

        const demandas = (response.data.values || []).map(row => ({
            id: row[0],
            data: row[1],
            demandante: row[2],
            emailDemandante: row[3],
            tema: row[4],
            cpfAluno: row[5],
            descricao: row[6],
            arquivo: row[7],
            status: row[8],
            responsavel: row[9],
            dataConclusao: row[10] || '',
            tempoConclusao: row[11] || ''
        }));

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
            range: `${SHEETS.DEMANDAS}!A2:L`, // Expandido para incluir novas colunas
        });

        const demandas = response.data.values || [];
        const rowIndex = demandas.findIndex(row => row[0] === id);

        if (rowIndex === -1) {
            return res.status(404).json({ error: 'Demanda não encontrada' });
        }

        const rowNumber = rowIndex + 2; // +2 porque começa em A2
        const demanda = demandas[rowIndex];

        // Atualizar status
        if (status) {
            await sheets.spreadsheets.values.update({
                spreadsheetId: SPREADSHEET_ID,
                range: `${SHEETS.DEMANDAS}!I${rowNumber}`,
                valueInputOption: 'RAW',
                resource: { values: [[status]] }
            });

            // Se mudou para "Concluído", calcular data e tempo de conclusão
            if (status === 'Concluído' && demanda[8] !== 'Concluído') {
                // Parse da data de criação (formato: dd/mm/aaaa hh:mm ou dd/mm/aaaa)
                const dataString = demanda[1]; // Coluna B (data)
                let dataCriacao;

                // Tentar fazer parse da data brasileira
                const partes = dataString.split(' ');
                const dataPartes = partes[0].split('/');

                if (dataPartes.length === 3) {
                    const dia = parseInt(dataPartes[0], 10);
                    const mes = parseInt(dataPartes[1], 10) - 1; // JavaScript usa 0-11 para meses
                    const ano = parseInt(dataPartes[2], 10);

                    if (partes.length > 1) {
                        // Tem hora
                        const horaPartes = partes[1].split(':');
                        const hora = parseInt(horaPartes[0], 10);
                        const minuto = parseInt(horaPartes[1], 10);
                        dataCriacao = new Date(ano, mes, dia, hora, minuto);
                    } else {
                        // Sem hora
                        dataCriacao = new Date(ano, mes, dia);
                    }
                } else {
                    // Fallback: tentar parse padrão
                    dataCriacao = new Date(dataString);
                }

                const dataConclusao = new Date();
                const dataConclusaoStr = dataConclusao.toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                });

                // Calcular diferença em milissegundos
                const diff = dataConclusao - dataCriacao;
                const dias = Math.floor(diff / (1000 * 60 * 60 * 24));
                const horas = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutos = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

                let tempoConclusao = '';
                if (dias > 0) tempoConclusao += `${dias} dia${dias > 1 ? 's' : ''}`;
                if (horas > 0) {
                    if (tempoConclusao) tempoConclusao += ', ';
                    tempoConclusao += `${horas} hora${horas > 1 ? 's' : ''}`;
                }
                if (minutos > 0 && dias === 0) { // Só mostra minutos se menos de 1 dia
                    if (tempoConclusao) tempoConclusao += ' e ';
                    tempoConclusao += `${minutos} min`;
                }

                if (!tempoConclusao) {
                    tempoConclusao = 'Menos de 1 minuto';
                }

                // Atualizar data de conclusão (coluna K)
                await sheets.spreadsheets.values.update({
                    spreadsheetId: SPREADSHEET_ID,
                    range: `${SHEETS.DEMANDAS}!K${rowNumber}`,
                    valueInputOption: 'RAW',
                    resource: { values: [[dataConclusaoStr]] }
                });

                // Atualizar tempo de conclusão (coluna L)
                await sheets.spreadsheets.values.update({
                    spreadsheetId: SPREADSHEET_ID,
                    range: `${SHEETS.DEMANDAS}!L${rowNumber}`,
                    valueInputOption: 'RAW',
                    resource: { values: [[tempoConclusao]] }
                });
            }
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

// Deletar demanda (apenas admin)
router.delete('/:id', authenticateToken, isAdmin, async (req, res) => {
    try {
        const { id } = req.params;

        // Buscar demanda
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: SPREADSHEET_ID,
            range: `${SHEETS.DEMANDAS}!A2:L`,
        });

        const demandas = response.data.values || [];
        const rowIndex = demandas.findIndex(row => row[0] === id);

        if (rowIndex === -1) {
            return res.status(404).json({ error: 'Demanda não encontrada' });
        }

        const rowNumber = rowIndex + 2; // +2 porque começa em A2

        // Deletar linha
        await sheets.spreadsheets.batchUpdate({
            spreadsheetId: SPREADSHEET_ID,
            resource: {
                requests: [{
                    deleteDimension: {
                        range: {
                            sheetId: 1547407055, // ID correto da aba Demandas
                            dimension: 'ROWS',
                            startIndex: rowNumber - 1,
                            endIndex: rowNumber
                        }
                    }
                }]
            }
        });

        res.json({ message: 'Demanda deletada com sucesso' });
    } catch (error) {
        console.error('Erro ao deletar demanda:', error);
        res.status(500).json({ error: 'Erro ao deletar demanda' });
    }
});

module.exports = router;
