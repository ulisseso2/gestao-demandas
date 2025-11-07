import React, { useState, useEffect } from 'react';
import api from '../services/api';
import '../css/ListaDemandas.css';

const STATUS_OPTIONS = ['Solicitado', 'Em Andamento', 'Concluído'];

function ListaDemandas({ user, filtro = 'todas' }) {
    const [demandas, setDemandas] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [modalArquivo, setModalArquivo] = useState(null);
    const [filtroStatus, setFiltroStatus] = useState('');

    useEffect(() => {
        loadDemandas();
        if (user.tipo === 'admin') {
            loadUsuarios();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filtro]);

    const loadDemandas = async () => {
        try {
            setLoading(true);
            const response = await api.get('/demandas');
            let demandasFiltradas = response.data.demandas;

            // Filtrar por tipo
            if (filtro === 'minhas') {
                demandasFiltradas = demandasFiltradas.filter(d => d.demandante === user.nome);
            }

            setDemandas(demandasFiltradas);
        } catch (err) {
            setError('Erro ao carregar demandas');
        } finally {
            setLoading(false);
        }
    };

    const loadUsuarios = async () => {
        try {
            const response = await api.get('/demandas/usuarios/lista');
            setUsuarios(response.data.usuarios);
        } catch (err) {
            console.error('Erro ao carregar usuários:', err);
        }
    };

    const handleUpdateStatus = async (id, status) => {
        try {
            await api.put(`/demandas/${id}`, { status });
            loadDemandas();
        } catch (err) {
            alert('Erro ao atualizar status');
        }
    };

    const handleUpdateResponsavel = async (id, responsavel) => {
        try {
            await api.put(`/demandas/${id}`, { responsavel });
            loadDemandas();
        } catch (err) {
            alert('Erro ao atualizar responsável');
        }
    };

    const handleDeleteDemanda = async (id) => {
        if (!window.confirm('Tem certeza que deseja deletar esta demanda?')) {
            return;
        }

        try {
            await api.delete(`/demandas/${id}`);
            loadDemandas();
            alert('Demanda deletada com sucesso');
        } catch (err) {
            alert('Erro ao deletar demanda');
        }
    };

    const getStatusClass = (status) => {
        const statusMap = {
            'Solicitado': 'status-solicitado',
            'Em Andamento': 'status-andamento',
            'Concluído': 'status-concluido'
        };
        return statusMap[status] || '';
    };

    // Extrair fileId da URL do Google Drive ou usar diretamente se já for um fileId
    const getFileIdFromUrl = (url) => {
        if (!url) return null;

        // Se já for um ID puro (sem http), retornar direto
        if (!url.startsWith('http')) {
            return url;
        }

        // Tentar extrair o ID de diferentes formatos de URL
        const patterns = [
            /\/d\/([a-zA-Z0-9_-]+)/,  // /d/{fileId}/
            /id=([a-zA-Z0-9_-]+)/,     // id={fileId}
            /file\/d\/([a-zA-Z0-9_-]+)/  // /file/d/{fileId}/
        ];

        for (const pattern of patterns) {
            const match = url.match(pattern);
            if (match && match[1]) {
                return match[1];
            }
        }
        return null;
    };

    const abrirArquivo = (fileIdOrUrl) => {
        const fileId = getFileIdFromUrl(fileIdOrUrl);
        if (fileId) {
            // Usar URL de preview do Google Drive
            setModalArquivo(`https://drive.google.com/file/d/${fileId}/preview`);
        } else {
            // Fallback: abrir em nova aba
            window.open(fileIdOrUrl, '_blank');
        }
    };

    // Filtrar demandas por status
    const demandasFiltradas = filtroStatus
        ? demandas.filter(d => d.status === filtroStatus)
        : demandas;

    if (loading) return <div>Carregando...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="card">
            <div className="card-header">
                <h2>{filtro === 'minhas' ? 'Minhas Demandas' : 'Todas as Demandas'}</h2>

                <div className="filtros">
                    <label>
                        Filtrar por status:
                        <select
                            value={filtroStatus}
                            onChange={(e) => setFiltroStatus(e.target.value)}
                            className="filtro-status"
                        >
                            <option value="">Todos</option>
                            {STATUS_OPTIONS.map(status => (
                                <option key={status} value={status}>{status}</option>
                            ))}
                        </select>
                    </label>
                </div>
            </div>

            {demandasFiltradas.length === 0 ? (
                <p>Nenhuma demanda encontrada.</p>
            ) : (
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Data</th>
                                <th>Demandante</th>
                                <th>Tema</th>
                                <th>Descrição</th>
                                <th>Arquivo</th>
                                <th>Status</th>
                                {user.tipo === 'admin' && <th>Responsável</th>}
                                <th>Data Conclusão</th>
                                <th>Tempo</th>
                                {user.tipo === 'admin' && <th>Ações</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {demandasFiltradas.map(demanda => (
                                <tr key={demanda.id}>
                                    <td>{demanda.id}</td>
                                    <td>{demanda.data}</td>
                                    <td>{demanda.demandante}</td>
                                    <td>
                                        {demanda.tema}
                                        {demanda.cpfAluno && (
                                            <div className="cpf-info">CPF: {demanda.cpfAluno}</div>
                                        )}
                                    </td>
                                    <td className="descricao-cell">{demanda.descricao}</td>
                                    <td>
                                        {demanda.arquivo && (
                                            <button
                                                onClick={() => abrirArquivo(demanda.arquivo)}
                                                className="arquivo-link"
                                            >
                                                📎 Ver arquivo
                                            </button>
                                        )}
                                    </td>
                                    <td>
                                        {user.tipo === 'admin' ? (
                                            <select
                                                value={demanda.status}
                                                onChange={(e) => handleUpdateStatus(demanda.id, e.target.value)}
                                                className={`status-select ${getStatusClass(demanda.status)}`}
                                            >
                                                {STATUS_OPTIONS.map(status => (
                                                    <option key={status} value={status}>{status}</option>
                                                ))}
                                            </select>
                                        ) : (
                                            <span className={`status-badge ${getStatusClass(demanda.status)}`}>
                                                {demanda.status}
                                            </span>
                                        )}
                                    </td>
                                    {user.tipo === 'admin' && (
                                        <td>
                                            <select
                                                value={demanda.responsavel || ''}
                                                onChange={(e) => handleUpdateResponsavel(demanda.id, e.target.value)}
                                                className="responsavel-select"
                                            >
                                                <option value="">Não atribuído</option>
                                                {usuarios.map(usuario => (
                                                    <option key={usuario.id} value={usuario.nome}>
                                                        {usuario.nome}
                                                    </option>
                                                ))}
                                            </select>
                                        </td>
                                    )}
                                    <td>{demanda.dataConclusao || '-'}</td>
                                    <td>{demanda.tempoConclusao || '-'}</td>
                                    {user.tipo === 'admin' && (
                                        <td>
                                            <button
                                                onClick={() => handleDeleteDemanda(demanda.id)}
                                                className="btn-delete"
                                                title="Deletar demanda"
                                            >
                                                🗑️
                                            </button>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal para visualizar arquivo */}
            {modalArquivo && (
                <div className="modal-overlay" onClick={() => setModalArquivo(null)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Visualizar Arquivo</h3>
                            <button className="modal-close" onClick={() => setModalArquivo(null)}>✕</button>
                        </div>
                        <div className="modal-body">
                            <iframe
                                src={modalArquivo}
                                className="pdf-viewer"
                                title="Visualizador de arquivo"
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ListaDemandas;
