import React, { useState, useEffect } from 'react';
import api from '../services/api';
import '../css/GerenciarUsuarios.css';

function GerenciarUsuarios({ user }) {
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        loadUsuarios();
    }, []);

    const loadUsuarios = async () => {
        try {
            setLoading(true);
            const response = await api.get('/usuarios');
            setUsuarios(response.data.usuarios);
        } catch (err) {
            setError('Erro ao carregar usuários');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteUsuario = async (id, nomeUsuario) => {
        if (!window.confirm(`Tem certeza que deseja deletar o usuário "${nomeUsuario}"?`)) {
            return;
        }

        try {
            await api.delete(`/usuarios/${id}`);
            loadUsuarios();
            alert('Usuário deletado com sucesso');
        } catch (err) {
            if (err.response?.data?.error) {
                alert(err.response.data.error);
            } else {
                alert('Erro ao deletar usuário');
            }
        }
    };

    const getTipoBadgeClass = (tipo) => {
        return tipo === 'admin' ? 'tipo-admin' : 'tipo-usuario';
    };

    if (loading) return <div>Carregando...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="card">
            <div className="card-header">
                <h2>Gerenciar Usuários</h2>
                <div className="usuarios-count">
                    Total: {usuarios.length} usuário{usuarios.length !== 1 ? 's' : ''}
                </div>
            </div>

            {usuarios.length === 0 ? (
                <p>Nenhum usuário encontrado.</p>
            ) : (
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nome</th>
                                <th>Email</th>
                                <th>Tipo</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {usuarios.map(usuario => (
                                <tr key={usuario.id}>
                                    <td>{usuario.id}</td>
                                    <td>{usuario.nome}</td>
                                    <td>{usuario.email}</td>
                                    <td>
                                        <span className={`tipo-badge ${getTipoBadgeClass(usuario.tipo)}`}>
                                            {usuario.tipo === 'admin' ? '👑 Admin' : '👤 Usuário'}
                                        </span>
                                    </td>
                                    <td>
                                        <button
                                            onClick={() => handleDeleteUsuario(usuario.id, usuario.nome)}
                                            className="btn-delete"
                                            title="Deletar usuário"
                                            disabled={usuario.email === user.email}
                                        >
                                            🗑️
                                        </button>
                                        {usuario.email === user.email && (
                                            <span className="self-label">(Você)</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default GerenciarUsuarios;
