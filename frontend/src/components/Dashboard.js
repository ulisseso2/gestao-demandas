import React, { useState } from 'react';
import NovaDemanda from './NovaDemanda';
import ListaDemandas from './ListaDemandas';
import GerenciarUsuarios from './GerenciarUsuarios';
import '../css/Dashboard.css';

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
                        className={`tab ${activeTab === 'minhas' ? 'active' : ''}`}
                        onClick={() => setActiveTab('minhas')}
                    >
                        Minhas Demandas
                    </button>
                    <button
                        className={`tab ${activeTab === 'todas' ? 'active' : ''}`}
                        onClick={() => setActiveTab('todas')}
                    >
                        Todas as Demandas
                    </button>
                    {user.tipo === 'admin' && (
                        <button
                            className={`tab ${activeTab === 'usuarios' ? 'active' : ''}`}
                            onClick={() => setActiveTab('usuarios')}
                        >
                            👥 Usuários
                        </button>
                    )}
                </div>

                <div className="tab-content">
                    {activeTab === 'solicitar' && <NovaDemanda user={user} />}
                    {activeTab === 'minhas' && <ListaDemandas user={user} filtro="minhas" />}
                    {activeTab === 'todas' && <ListaDemandas user={user} filtro="todas" />}
                    {activeTab === 'usuarios' && user.tipo === 'admin' && <GerenciarUsuarios user={user} />}
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
