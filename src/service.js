import axios from "axios"
import { API_URL } from "./env"

export const login = (params) => {
    return axios.post(`${API_URL}/login`, params)
}
