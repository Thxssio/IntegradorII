// src/api.js
import axios from 'axios';

export const getData = async () => {
    const response = await axios.get('http://localhost:5000/api/data');
    return response.data;
};

export const updateStatus = async (id, status) => {
    const response = await axios.put(`http://localhost:5000/api/data/${id}/status`, { status });
    return response.data;
};
