import { API } from './axios';
import { getToken } from "./tokenUtils";

export async function loginUser(credentials) {
    return await API.post('/login', credentials)
}

function getHeaders() {
    return {
        'x-access-token': getToken()
    }
}

export function getProfile() {
    return API.get('/me', {
        headers: getHeaders()
    })
}

export function callCreateTaskAPI(payload) {
    return API.post('/tasks', payload, {
        headers: getHeaders()
    })
}

export function callFetchTasksAPI(urlEndpoint) {
    return API.get(urlEndpoint, {
        headers: getHeaders()
    })
}

export function callOverViewAPI() {
    return API.get('/overview', {
        headers: getHeaders()
    })
}

export function callUpdateAPI(payload, id) {
    return API.put(`/tasks/${id}`, payload, {
        headers: getHeaders()
    });
}

export function callDeleteAPI(id) {
    return API.delete(`/tasks/${id}`, {
        headers: getHeaders()
    });
}