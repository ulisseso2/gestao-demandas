import React, { useState, useEffect } from 'react';
import api from '../services/api';
import './ListaDemandas.css';

const STATUS_OPTIONS = ['Solicitado', 'Em Andamento', 'Concluído'];

function ListaDemandas({ user }) {
    const [demandas, setDemandas] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        loadDemandas();
        if (user.tipo === 'admin') {
            loadUsuarios();
        }
    }, []);

    const loadDemandas = async () => {
        try {
            setLoading(true);
            const response = await api.get('/demandas');
            setDemandas(response.data.demandas);
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

    const getStatusClass = (status) => {
        const statusMap = {
            'Solicitado': 'status-solicitado',
            'Em Andamento': 'status-andamento',
            'Concluído': 'status-concluido'
        };
        return statusMap[status] || '';
    };

    if (loading) return <div>Carregando...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="card">
            <h2>Todas as Demandas</h2>

            {demandas.length === 0 ? (
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
                            </tr>
                        </thead>
                        <tbody>
                            {demandas.map(demanda => (
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
                                            <a href={demanda.arquivo} target="_blank" rel="noopener noreferrer" className="arquivo-link">
                                                📎 Ver arquivo
                                            </a>
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
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default ListaDemandas;
