import axios from "axios";
import {
    ACCESS_TOKEN_LOCALSTORAGE,
} from "../constant";
import {API_URL} from "../env";
const axiosInstance = axios.create({
    baseURL: API_URL,
    timeout: 1000000,
});
axiosInstance.interceptors.request.use(
    async (config) => {
        const accessToken = localStorage.getItem(ACCESS_TOKEN_LOCALSTORAGE);
        if (accessToken) {
            config.headers.token = accessToken.replace(/"/g, "");
        }
        return config;
    },
    (error) => {
        Promise.reject(error);
    }
);
export default axiosInstance;
