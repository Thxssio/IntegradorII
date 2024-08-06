import React, { useState, useEffect } from 'react';
import './styles.css';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    console.log('Login component rendered');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        document.body.classList.add('login-page');
        return () => {
            document.body.classList.remove('login-page');
        };
    }, []);

    const handleSubmit = (event) => {
        event.preventDefault();
        if (username === 'vini' && password === '12345') {
            navigate('/');
        } else {
            setError('Nome de usuário ou senha incorretos.');
        }
    };

    return (
        <div className="login-container">
            <img src="/images/water-tank-login.jpg" alt="Ícone de Bomba de Água" />
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Nome de usuário" value={username} onChange={(e) => setUsername(e.target.value)} required />
                <input type="password" placeholder="Senha" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <button type="submit">Entrar</button>
                {error && <div className="error">{error}</div>}
            </form>
        </div>
    );
};

export default Login;
