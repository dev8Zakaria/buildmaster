import { defineStore } from 'pinia';
import axios from 'axios';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

export const useAuthStore = defineStore('auth', () => {
    const user = ref(JSON.parse(localStorage.getItem('user')) || null);
    const token = ref(localStorage.getItem('token') || null);
    const router = useRouter();

    const api = axios.create({
        baseURL: 'http://localhost:3000/api'
    });

    const setAuth = (userData, tokenValue) => {
        user.value = userData;
        token.value = tokenValue;
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', tokenValue);
        api.defaults.headers.common['Authorization'] = `Bearer ${tokenValue}`;
    };

    const clearAuth = () => {
        user.value = null;
        token.value = null;
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        delete api.defaults.headers.common['Authorization'];
    };

    const signup = async (credentials) => {
        try {
            // Backend returns user object on signup
            const response = await api.post('/signup', credentials);
            // Note: The backend currently returns the created user, not a token immediately upon signup.
            // We usually redirect to login, or auto-login if the backend supported it.
            // Based on requirements, we'll verify this flow.
            return response.data;
        } catch (error) {
            throw error.response?.data?.msg || 'Signup failed';
        }
    };

    const login = async (credentials) => {
        try {
            const response = await api.post('/login', credentials);
            const { token: accessToken } = response.data;

            // Decode token to get user info if needed, or just store it.
            // The backend token payload structure: { userInfo: { userEmail, userRole } }
            // We can decode it or just store the token.

            // For now, let's assume we store the token.
            setAuth({ email: credentials.email }, accessToken);
            return accessToken;
        } catch (error) {
            throw error.response?.data?.msg || 'Login failed';
        }
    };

    const logout = () => {
        clearAuth();
        // Router push handled in component usually
    };

    return {
        user,
        token,
        signup,
        login,
        logout
    };
});
