import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Home from './components/Home';
import Control from './components/Control';
import Login from './components/Login';
import './components/styles.css';

function App() {
    const location = useLocation();
    const hideHeader = location.pathname === '/login';

    console.log('App component rendered');
    return (
        <div>
            {!hideHeader && <Header />}
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/control" element={<Control />} />
                <Route path="/login" element={<Login />} />
            </Routes>
        </div>
    );
}

function AppWrapper() {
    return (
        <Router>
            <App />
        </Router>
    );
}

export default AppWrapper;
