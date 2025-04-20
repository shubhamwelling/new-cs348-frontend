import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Navigation.css';

const Navigation = () => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await axios.post('http://localhost:5000/auth/logout', {}, { withCredentials: true });
            navigate('/login');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    return (
        <div className="navigation">
            <button onClick={handleLogout} className="logout-button">Logout</button>
        </div>
    );
};

export default Navigation; 