import axios from "axios";
import {jwtDecode} from "jwt-decode";


const API_URL = import.meta.env.VITE_API_URL;

export async function login(email, password) {
    const { data } = await axios.post(`${API_URL}/api/login_check`, {
        email,
        password,
    });
    localStorage.setItem('token', data.token);
    return data.token;
}

export function getRoles() {
    const token = getToken();
    if (!token) return [];
    try {
        const decoded = jwtDecode(token);
        return decoded.roles || [];
    } catch {
        return [];
    }
}

export function isAdmin() {
    return getRoles().includes("ROLE_ADMIN");
}

export function logout() {
    localStorage.removeItem('token');
}

export function getToken() {
    return localStorage.getItem('token');
}