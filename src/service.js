import axios from "axios"
import { API_URL } from "./env"
import axiosInstance from "./utils/axiosInstance";

export const login = (params) => {
    return axios.post(`${API_URL}/login`, params)
}

export const createBoard = (params) => {
    return axiosInstance.post("v1/create-board", params)
}

export const getListBoard = (params) => {
    return axiosInstance.get("/v1/get-list-board", {
        params
    })
}
