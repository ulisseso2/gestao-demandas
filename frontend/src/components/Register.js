import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Auth.css';

function Register() {
    const [formData, setFormData] = useState({ nome: '', email: '', senha: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Erro ao cadastrar');
            }

            alert('Cadastro realizado com sucesso! Faça login para continuar.');
            navigate('/login');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2>Cadastro</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Nome</label>
                        <input
                            type="text"
                            value={formData.nome}
                            onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Senha</label>
                        <input
                            type="password"
                            value={formData.senha}
                            onChange={(e) => setFormData({ ...formData, senha: e.target.value })}
                            required
                            minLength={6}
                        />
                    </div>
                    {error && <div className="error">{error}</div>}
                    <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                        {loading ? 'Cadastrando...' : 'Cadastrar'}
                    </button>
                </form>
                <p className="auth-link">
                    Já tem uma conta? <Link to="/login">Faça login</Link>
                </p>
            </div>
        </div>
    );
}

export default Register;
