// api/index.js
import axios from 'axios';

const api = axios.create({
    baseURL: 'https://kinotower.polytech.kz/api/v1', // Базовый URL
    headers: {
        'Content-Type': 'application/json',
    },
});

// Добавляем токен в заголовки всех запросов
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken'); // Получаем токен из localStorage
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`; // Добавляем токен в заголовок
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export { api };
