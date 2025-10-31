import React from 'react';
import './Header.css';

function Header({ user, onLogout }) {
    return (
        <header className="header">
            <div className="header-container">
                <h1 className="header-title">Gestão de Demandas</h1>
                <div className="header-user">
                    <span className="user-name">
                        {user.nome} {user.tipo === 'admin' && <span className="badge-admin">(Admin)</span>}
                    </span>
                    <button onClick={onLogout} className="btn btn-secondary btn-sm">
                        Sair
                    </button>
                </div>
            </div>
        </header>
    );
}

export default Header;
