import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const AUTH_TOKEN = import.meta.env.VITE_AUTH_TOKEN;

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Authorization: AUTH_TOKEN
  }
});

export const sendQuery = async (query: Array<any>) => {
  try {
    const response = await axios.post(BASE_URL, {
      query,
      queryType: 'multi'
    });
    return response?.data?.results;
  } catch (error) {
    console.error('Error sending query:', error);
    throw error;
  }
};

export default axiosInstance;
