import React, { useState, useEffect, useContext } from 'react';
import './styles.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../AuthContext';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

    useEffect(() => {
        document.body.classList.add('login-page');
        return () => {
            document.body.classList.remove('login-page');
        };
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/login', { username, password });
            if (response.data.message === 'Login successful') {
                login({ username });
                navigate('/home');
            } else {
                setError(response.data.message);
            }
        } catch (error) {
            setError('Failed to login');
        }
    };

    return (
        <div className="login-container">
            <img src="./images/water-tank-login.jpg" alt="Ícone de Bomba de Água" />
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
                <input type="text" placeholder="Nome de usuário" value={username} onChange={(e) => setUsername(e.target.value)} required />
                <input type="password" placeholder="Senha" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <button type="submit">Entrar</button>
                {error && <div className="error">{error}</div>}
            </form>
        </div>
    );
};

export default Login;
