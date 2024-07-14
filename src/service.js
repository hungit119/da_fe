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
export const getBoard = (params) => {
    return axiosInstance.get("/v1/detail-board", {
        params
    })
}
export const updateBoard = (params) => {
    return axiosInstance.put("v1/update-board", params)
}

export const deleteBoard = (params) => {
    return axiosInstance.delete("/v1/delete-board", {
        params
    })
}