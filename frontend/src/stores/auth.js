import { defineStore } from 'pinia';
import axios from 'axios';
import { ref } from 'vue';
import { jwtDecode } from 'jwt-decode';

export const useAuthStore = defineStore('auth', () => {
  const user = ref(JSON.parse(localStorage.getItem('user')) || null);
  const token = ref(localStorage.getItem('token') || null);

  const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || '/api'
  });

  // Restore Authorization header safely
  if (token.value) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token.value}`;
  }

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

  const login = async (credentials) => {
    try {
      const response = await api.post('/login', credentials);
      const { token: accessToken } = response.data;

      const decoded = jwtDecode(accessToken);

      const userData = {
        email: decoded.userInfo?.email || decoded.userInfo?.userEmail,
        role: decoded.userInfo?.role || decoded.userInfo?.userRole,
        firstName: decoded.userInfo?.firstName || null
      };

      setAuth(userData, accessToken);
      return accessToken;
    } catch (error) {
      clearAuth(); // prevents infinite blank page
      throw error.response?.data?.msg || 'Login failed';
    }
  };

  const signup = async (credentials) => {
    const response = await api.post('/signup', credentials);
    return response.data;
  };

  const logout = () => {
    clearAuth();
  };

  return { user, token, signup, login, logout };
});
