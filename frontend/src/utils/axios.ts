import axios from "axios";
import { getSession } from "next-auth/react";

const backendURL = process.env.BACKEND_URL || "http://localhost:8080";

const axiosInstance = axios.create({
  baseURL: '/api',
});

axiosInstance.interceptors.request.use(
  async (config) => {
    if (typeof window !== "undefined") {
      const session = await getSession();

      let token: string | null = null;

      if (session?.user) {
        if (session.user.id) {
          token = session.user.id;
        }
      }

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
