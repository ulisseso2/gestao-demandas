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
                        className={`tab ${activeTab === 'todas' ? 'active' : ''}`}
                        onClick={() => setActiveTab('todas')}
                    >
                        Todas as Demandas
                    </button>
                </div>

                <div className="tab-content">
                    {activeTab === 'solicitar' && <NovaDemanda user={user} />}
                    {activeTab === 'todas' && <ListaDemandas user={user} />}
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
