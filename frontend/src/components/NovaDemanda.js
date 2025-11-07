import React, { useState } from 'react';
import api from '../services/api';
import '../css/NovaDemanda.css';

const TEMAS = [
    'Aluno',
    'Dashboard',
    'CRM',
    'Octadesk',
    'Sala Virtual',
    'Turmas e Cursos',
    'Matrícula'
];

function NovaDemanda({ user }) {
    const [formData, setFormData] = useState({
        tema: '',
        cpfAluno: '',
        descricao: '',
        arquivo: null,
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            const data = new FormData();
            data.append('tema', formData.tema);
            data.append('descricao', formData.descricao);

            if (formData.tema.toLowerCase() === 'aluno') {
                if (!formData.cpfAluno) {
                    throw new Error('CPF do aluno é obrigatório para este tema');
                }
                data.append('cpfAluno', formData.cpfAluno);
            }

            if (formData.arquivo) {
                data.append('arquivo', formData.arquivo);
            }

            await api.post('/demandas', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            setSuccess('Demanda criada com sucesso!');
            setFormData({ tema: '', cpfAluno: '', descricao: '', arquivo: null });

            // Limpar o input de arquivo
            const fileInput = document.getElementById('arquivo');
            if (fileInput) fileInput.value = '';

            setTimeout(() => setSuccess(''), 5000);
        } catch (err) {
            // Tratamento especial para CPF duplicado
            const errorMessage = err.response?.data?.error || err.message || 'Erro ao criar demanda';

            if (errorMessage.includes('Já tem uma solicitação para esse CPF')) {
                const demandaExistente = err.response?.data?.demandaExistente;
                if (demandaExistente) {
                    setError(`❌ ${errorMessage}\n\nDemanda existente: ${demandaExistente.id}\nCriada em: ${demandaExistente.data}\nStatus: ${demandaExistente.status}`);
                } else {
                    setError(`❌ ${errorMessage}`);
                }
            } else {
                setError(errorMessage);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card">
            <h2>Nova Demanda</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Tema *</label>
                    <select
                        value={formData.tema}
                        onChange={(e) => setFormData({ ...formData, tema: e.target.value })}
                        required
                    >
                        <option value="">Selecione um tema</option>
                        {TEMAS.map(tema => (
                            <option key={tema} value={tema}>{tema}</option>
                        ))}
                    </select>
                </div>

                {formData.tema.toLowerCase() === 'aluno' && (
                    <div className="form-group">
                        <label>CPF do Aluno *</label>
                        <input
                            type="text"
                            value={formData.cpfAluno}
                            onChange={(e) => setFormData({ ...formData, cpfAluno: e.target.value })}
                            placeholder="000.000.000-00"
                            required
                        />
                    </div>
                )}

                <div className="form-group">
                    <label>Descrição do Problema *</label>
                    <textarea
                        value={formData.descricao}
                        onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                        placeholder="Descreva detalhadamente o problema..."
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Anexar Arquivo (opcional)</label>
                    <input
                        id="arquivo"
                        type="file"
                        onChange={(e) => setFormData({ ...formData, arquivo: e.target.files[0] })}
                        accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
                    />
                    <small className="file-hint">
                        Formatos aceitos: PDF, DOC, DOCX, XLS, XLSX, JPG, PNG (máx. 5MB)
                    </small>
                </div>

                {error && <div className="error">{error}</div>}
                {success && <div className="success">{success}</div>}

                <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Enviando...' : 'Enviar Demanda'}
                </button>
            </form>
        </div>
    );
}

export default NovaDemanda;
