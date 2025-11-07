import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import Header from './components/Header';

function App() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
            fetch(`${apiUrl}/auth/me`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
                .then(res => res.json())
                .then(data => {
                    if (data.user) {
                        setUser(data.user);
                    } else {
                        localStorage.removeItem('token');
                    }
                })
                .catch(() => {
                    localStorage.removeItem('token');
                })
                .finally(() => {
                    setLoading(false);
                });
        } else {
            setLoading(false);
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    if (loading) {
        return <div style={{ padding: '20px', textAlign: 'center' }}>Carregando...</div>;
    }

    return (
        <Router>
            <div className="App">
                {user && <Header user={user} onLogout={handleLogout} />}
                <Routes>
                    <Route
                        path="/login"
                        element={user ? <Navigate to="/dashboard" /> : <Login setUser={setUser} />}
                    />
                    <Route
                        path="/register"
                        element={user ? <Navigate to="/dashboard" /> : <Register />}
                    />
                    <Route
                        path="/dashboard"
                        element={user ? <Dashboard user={user} /> : <Navigate to="/login" />}
                    />
                    <Route
                        path="/"
                        element={<Navigate to={user ? "/dashboard" : "/login"} />}
                    />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
