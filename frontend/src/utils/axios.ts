import axios from "axios";

const backendURL = process.env.BACKEND_API_URL || 'http://localhost:8080'

const axiosInstance  = axios.create({
    baseURL: backendURL,
});

export default axiosInstance;