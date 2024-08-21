import axios from 'axios';

// Base URL from environment variable
const API_URL = process.env.REACT_APP_API_URL;

export const getData = async () => {
    const response = await axios.get(`${API_URL}/data`);
    return response.data;
};

export const updateStatus = async (id, status) => {
    const response = await axios.put(`${API_URL}/data/${id}/status`, { status });
    return response.data;
};
