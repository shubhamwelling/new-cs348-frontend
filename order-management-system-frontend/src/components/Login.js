import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); // Clear any previous errors
        
        if (!username || !password) {
            setError('Please enter both username and password');
            return;
        }

        try {
            const endpoint = isRegistering ? '/auth/register' : '/auth/login';
            const response = await axios.post(`http://localhost:5000${endpoint}`, {
                username,
                password
            }, { withCredentials: true });
            
            if (response.data.message === 'Login successful' || response.data.message === 'User registered successfully') {
                navigate('/home');
            }
        } catch (err) {
            const errorMessage = err.response?.data?.error || 'An error occurred';
            setError(errorMessage);
            console.error('Auth error:', err.response?.data || err);
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h2>Dunder Mifflin</h2>
                <h3>{isRegistering ? 'Create Account' : 'Login'}</h3>
                {error && <div className="error-message">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button type="submit">{isRegistering ? 'Register' : 'Login'}</button>
                </form>
                <button 
                    className="toggle-button"
                    onClick={() => {
                        setIsRegistering(!isRegistering);
                        setError(''); // Clear error when switching modes
                    }}
                >
                    {isRegistering ? 'Already have an account? Login' : 'Need an account? Register'}
                </button>
            </div>
        </div>
    );
};

export default Login; 