import React from 'react';
import { Link } from 'react-router-dom';
import './styles.css';

const Header = () => (
    <header>
        <div className="menu">
            <Link to="/"><button>HOME</button></Link>
            <Link to="/control"><button>CONTROLE</button></Link>
        </div>
        <div className="user-info">
            <span>Ola, Usuário</span> {/* Ajuste aqui */}
        </div>
    </header>
);

export default Header;
