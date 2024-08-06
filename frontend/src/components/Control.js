import React, { useState, useEffect } from 'react';
import { getData, updateStatus } from '../api';
import './styles.css';

const Control = () => {
    const [bombaLigada, setBombaLigada] = useState(false);
    const [history, setHistory] = useState([]);
    const [lastEntryId, setLastEntryId] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await getData();
                if (result.length > 0) {
                    const latestEntry = result[result.length - 1];
                    setBombaLigada(latestEntry.status === 'ligado');
                    setLastEntryId(latestEntry._id);
                    setHistory(result.map(entry => ({
                        status: `Status: ${entry.status.charAt(0).toUpperCase() + entry.status.slice(1)}`,
                        date: new Date(entry._id.getTimestamp()).toLocaleString()
                    })));
                }
            } catch (error) {
                console.error('Error fetching data', error);
            }
        };

        fetchData();
    }, []);

    const toggleBomba = async () => {
        const newStatus = !bombaLigada ? 'ligado' : 'desligado';
        try {
            if (lastEntryId) {
                const updatedData = await updateStatus(lastEntryId, newStatus);
                setBombaLigada(updatedData.status === 'ligado');
                const statusText = updatedData.status.charAt(0).toUpperCase() + updatedData.status.slice(1);
                setHistory([{ status: `Status: ${statusText}`, date: new Date().toLocaleString() }, ...history]);
            }
        } catch (error) {
            console.error('Error updating status', error);
        }
    };

    return (
        <main>
            <h1>Controle do Sistema de Água</h1>
            <section className="control-section">
                <h2>Controle da Bomba d'Água</h2>
                <div className="info-box">
                    <img src="/images/pump.png" alt="Ícone de Bomba" />
                    <div className="status" id="status">Status: {bombaLigada ? 'Ligado' : 'Desligado'}</div>
                    <button id="toggleButton" onClick={toggleBomba}>{bombaLigada ? 'Desligar' : 'Ligar'}</button>
                </div>
            </section>
            <section className="info-section">
                <h2>Histórico de Alterações de Status da Bomba</h2>
                <ul id="statusHistory" className="history-list">
                    {history.map((item, index) => (
                        <li key={index}>{item.date}: {item.status}</li>
                    ))}
                </ul>
            </section>
        </main>
    );
};

export default Control;
