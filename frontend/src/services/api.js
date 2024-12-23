import axios from 'axios';

// Configura la URL base del backend
const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL, // Cambia esta URL si tu backend está en otro lugar
});

// Interceptor para incluir el token JWT en cada solicitud
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token'); // Obtiene el token almacenado
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
