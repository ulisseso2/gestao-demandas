import React, { useState } from 'react';
import NovaDemanda from './NovaDemanda';
import ListaDemandas from './ListaDemandas';
import './Dashboard.css';

function Dashboard({ user }) {
    const [activeTab, setActiveTab] = useState('solicitar');

    return (
        <div className="dashboard">
            <div className="container">
                <div className="tabs">
                    <button
                        className={`tab ${activeTab === 'solicitar' ? 'active' : ''}`}
                        onClick={() => setActiveTab('solicitar')}
                    >
                        Solicitar Demanda
                    </button>
                    <button
                        className={`tab ${activeTab === 'meus' ? 'active' : ''}`}
                        onClick={() => setActiveTab('meus')}
                    >
                        Meus Pedidos
                    </button>
                    {user.tipo === 'admin' && (
                        <button
                            className={`tab ${activeTab === 'todos' ? 'active' : ''}`}
                            onClick={() => setActiveTab('todos')}
                        >
                            Todos os Pedidos
                        </button>
                    )}
                </div>

                <div className="tab-content">
                    {activeTab === 'solicitar' && <NovaDemanda user={user} />}
                    {activeTab === 'meus' && <ListaDemandas filtro="meus" user={user} />}
                    {activeTab === 'todos' && user.tipo === 'admin' && (
                        <ListaDemandas filtro="todos" user={user} />
                    )}
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
