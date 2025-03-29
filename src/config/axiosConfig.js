import axios from 'axios';

const api = axios.create({
  baseURL: 'https://dicionariodosnomes.most-w.com/controller', // Substitua pela URL da sua API
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
