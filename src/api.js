import axios from 'axios';

const API = axios.create({
  baseURL: 'https://laughing-winner-5gjr9vrxvgq2774g-8000.app.github.dev/api/',
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
});

export default API;