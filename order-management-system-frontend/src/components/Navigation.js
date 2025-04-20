import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Navigation.css';

const Navigation = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Remove token from localStorage
        localStorage.removeItem('token');
        // Clear axios default headers
        delete axios.defaults.headers.common['Authorization'];
        // Navigate to login page
        navigate('/login');
    };

    return (
        <div className="navigation">
            <button onClick={handleLogout} className="logout-button">Logout</button>
        </div>
    );
};

export default Navigation; 