import axios from "axios";

export const API = axios.create({
    baseURL: process.env.REACT_APP_BE_URL || 'http://localhost:4001',
    responseType: "json"
});