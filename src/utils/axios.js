import axios from "axios";
import { getToken } from "./tokenUtils";

export const API = axios.create({
    baseURL: process.env.REACT_APP_BE_URL || 'http://localhost:4001',
    responseType: "json"
});
API.defaults.headers.common['x-access-token'] = getToken();