import axios from 'axios';

// Configura la URL base del backend
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL, // Para proyectos con Vite
});

// Interceptor para incluir el token JWT en cada solicitud
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token'); // Obtiene el token almacenado
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        console.error('Error al configurar la solicitud:', error);
        return Promise.reject(error);
    }
);

// Interceptor de respuesta para manejar errores globales
api.interceptors.response.use(
    (response) => response, // Devuelve la respuesta si es exitosa
    (error) => {
        if (error.response?.status === 401) {
            console.error('No autorizado, redirigiendo al inicio de sesión.');
            localStorage.removeItem('token'); // Limpia el token en caso de error 401
            window.location.href = '/login'; // Cambia la ruta según tu app
        }
        return Promise.reject(error);
    }
);

export default api;
