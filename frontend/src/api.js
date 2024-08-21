import axios from 'axios';
const API_URL = process.env.REACT_APP_API_URL;
// Função para obter dados do InfluxDB
export const getData = async () => {
    const response = await axios.get(`${API_URL}/influx-data`);
    return response.data;
};

export const updateStatus = async (id, status) => {
    const response = await axios.put(`${API_URL}/data/${id}/status`, { status });
    return response.data;
};