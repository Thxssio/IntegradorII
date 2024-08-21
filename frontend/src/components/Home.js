import React, { useEffect, useState } from 'react';
import './styles.css';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { useNavigate } from 'react-router-dom';
import { getData } from '../api';
import Footer from './Footer';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Home = () => {
    console.log('Home component rendered');
    const [data, setData] = useState([]);
    const navigate = useNavigate();

    const maxPoints = 50; 

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await getData();
                console.log('Fetched data:', result);

                // Transforma a resposta em um array se não for um array
                const dataArray = Array.isArray(result) ? result : [result];

                // Verifica se os dados são nulos e substitui por 0
                const normalizedData = dataArray.map(entry => ({
                    ...entry,
                    level: entry.level ?? 0,
                    power: entry.power ?? 0,
                    voltage: entry.voltage ?? 0,
                    current: entry.current ?? 0,
                }));

                setData(prevData => [...prevData, ...normalizedData].slice(-maxPoints)); // Mantém apenas os últimos maxPoints dados
            } catch (error) {
                console.error('Error fetching data', error);
            }
        };

        // Fetch data initially
        fetchData();

        // Set up interval to fetch data every second
        const intervalId = setInterval(fetchData, 1000);

        // Clean up interval on component unmount
        return () => clearInterval(intervalId);
    }, []);

    const chartData = {
        labels: data.map((_, index) => `Entry ${index + 1}`),
        datasets: [
            {
                label: 'Nível da Água (%)',
                data: data.map(entry => entry.level),
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            },
        ],
    };

    console.log('Chart data:', chartData);

    const goToControl = () => {
        navigate('/control');
    };

    const options = {
        scales: {
            y: {
                beginAtZero: true,
            },
        },
    };

    return (
        <main>
            <h1>Monitoramento do Sistema de Água</h1>
            <button className="toggleButton" onClick={goToControl}>Ir para Controle</button> 
            <section className="info-section">
                <h2>Informações sobre a caixa de água:</h2>
                <div className="info-box">
                    <img src="./images/water-tank-icon.png" alt="Ícone de Caixa de Água" />
                    <div className="info-text">Nível da Água: {data.length > 0 ? data[data.length - 1].level : 0}</div>
                    <div className="progress-bar">
                        <div className="progress" style={{ width: `${data.length > 0 ? data[data.length - 1].level : 0}%` }}></div>
                    </div>
                </div>
            </section>
            <section className="info-section">
                <h2>Informações sobre a bomba:</h2>
                <div className="info-box">
                    <img src="./images/pump.png" alt="Ícone de Bomba" />
                    {data.length > 0 ? (
                        <>
                            <div className="info-text">Potência: {data[data.length - 1].power || 0}W</div>
                            <div className="info-text">Tensão: {data[data.length - 1].voltage || 0}V</div>
                            <div className="info-text">Corrente: {data[data.length - 1].current || 0}A</div>
                        </>
                    ) : (
                        <div className="info-text">Carregando...</div>
                    )}
                </div>
            </section>
            <section className="info-section">
                <h2>Histórico dos Níveis da Caixa de Água</h2>
                <Line data={chartData} options={options} />
            </section>
            <Footer/>
        </main>
    );
};

export default Home;
