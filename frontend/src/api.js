import axios from 'axios';
const API_URL = process.env.REACT_APP_API_URL;

// Função para obter dados do InfluxDB
export const getData = async () => {
    const response = await axios.get(`${API_URL}/influx-data`);
    
    const influxData = response.data;

    // Verifica se influxData é um array
    if (Array.isArray(influxData)) {
        if (influxData.length === 0) {
            throw new Error('Nenhum dado disponível');
        }

        // Ordena os dados pelo timestamp mais recente
        influxData.sort((a, b) => new Date(b.time) - new Date(a.time));

        // Seleciona o dado mais recente
        const mostRecentData = influxData[0];

        return mostRecentData; // Retorna apenas o dado mais recente
    } else {
        throw new Error('Dados retornados não estão no formato esperado');
    }
};

export const updateStatus = async (id, status) => {
    const response = await axios.put(`${API_URL}/data/${id}/status`, { status });
    return response.data;
};
