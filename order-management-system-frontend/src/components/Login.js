import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './Login.css';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    // Check for prefilled credentials in location state
    useEffect(() => {
        console.log('Location state:', location.state);
        if (location.state?.username) {
            setUsername(location.state.username);
            console.log('Setting username from state:', location.state.username);
        }
        if (location.state?.password) {
            setPassword(location.state.password);
            console.log('Setting password from state');
        }
    }, [location.state]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); // Clear any previous errors
        
        if (!username || !password) {
            setError('Please enter both username and password');
            return;
        }

        try {
            const endpoint = isRegistering ? '/auth/register' : '/auth/login';
            console.log('Making request to:', endpoint);
            const response = await axios.post(`https://cs348-backend-a1eh.onrender.com${endpoint}`, {
                username,
                password
            });
            
            console.log('Response:', response.data);
            
            if (response.data.message === 'Login successful') {
                // Store the token
                localStorage.setItem('token', response.data.token);
                // Set default auth header
                axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
                navigate('/home');
            } else if (response.data.message === 'User registered successfully') {
                console.log('Registration successful, redirecting to login with credentials');
                // Switch to login mode
                setIsRegistering(false);
                // Pass credentials to login page
                navigate('/login', { 
                    state: { 
                        username: username,
                        password: password
                    },
                    replace: true  // Replace current history entry
                });
            }
        } catch (err) {
            console.error('Auth error:', err.response?.data || err);
            const errorMessage = err.response?.data?.error || 'An error occurred';
            setError(errorMessage);
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