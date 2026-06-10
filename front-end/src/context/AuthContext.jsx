import { createContext, useContext, useState } from "react";
import { login as loginService, logout as logoutService, getToken } from "../services/auth";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [token, setToken] = useState(getToken());

    async function login(email, password) {
        const newToken = await loginService(email, password);
        setToken(newToken);
    }

    function logout() {
        logoutService();
        setToken(null);
    }

    return (
        <AuthContext.Provider value={{token, isAuthenticated: !!token, login, logout}}>
            {children}
        </AuthContext.Provider>
    );
}


export function useAuth() {
    return useContext(AuthContext);
}