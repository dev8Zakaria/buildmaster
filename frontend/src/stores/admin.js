import { defineStore } from 'pinia';
import axios from 'axios';
import { ref } from 'vue';

export const useAdminStore = defineStore('admin', () => {
    const categories = ref([]);
    const components = ref([]);
    const categoryStats = ref([]); // For component counts per category
    const isLoading = ref(false);
    const error = ref(null);

    const api = axios.create({
        baseURL: 'http://localhost:3000/api'
    });

    // Add JWT token to all requests
    api.interceptors.request.use((config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    });

    // --- Categories ---

    const fetchCategories = async () => {
        isLoading.value = true;
        try {
            const response = await api.get('/category');
            categories.value = response.data;
            categoryStats.value = response.data.map(c => ({
                ...c,
                count: c._count?.components || 0
            }));
        } catch (err) {
            error.value = err.response?.data?.message || err.message;
        } finally {
            isLoading.value = false;
        }
    };

    const createCategory = async (data) => {
        isLoading.value = true;
        try {
            await api.post('/category', data);
            await fetchCategories();
        } catch (err) {
            error.value = err.response?.data?.details || err.response?.data?.error || err.response?.data?.message || 'Failed to create category';
            throw error.value;
        } finally {
            isLoading.value = false;
        }
    };

    const deleteCategory = async (id) => {
        try {
            await api.delete(`/category/${id}`);
            await fetchCategories();
        } catch (err) {
            throw err.response?.data?.details || err.response?.data?.error || err.response?.data?.message || 'Failed to delete category';
        }
    };

    // --- Components ---

    const fetchComponents = async () => {
        isLoading.value = true;
        try {
            const response = await api.get('/component');
            components.value = response.data;
        } catch (err) {
            error.value = err.response?.data?.message || err.message;
        } finally {
            isLoading.value = false;
        }
    };

    const createComponent = async (data) => {
        isLoading.value = true;
        try {
            await api.post('/component', data);
            await fetchComponents();
            // Also refresh categories to update counts
            await fetchCategories();
        } catch (err) {
            error.value = err.response?.data?.details || err.response?.data?.error || err.response?.data?.message || 'Failed to create component';
            throw error.value;
        } finally {
            isLoading.value = false;
        }
    };

    const updateComponent = async (id, data) => {
        isLoading.value = true;
        try {
            await api.put(`/component/${id}`, data);
            await fetchComponents();
        } catch (err) {
            error.value = err.response?.data?.details || err.response?.data?.error || err.response?.data?.message || 'Failed to update component';
            throw error.value;
        } finally {
            isLoading.value = false;
        }
    }

    const deleteComponent = async (id) => {
        try {
            await api.delete(`/component/${id}`);
            await fetchComponents();
            await fetchCategories();
        } catch (err) {
            throw err.response?.data?.details || err.response?.data?.error || err.response?.data?.message || 'Failed to delete';
        }
    };

    return {
        categories,
        components,
        categoryStats,
        isLoading,
        error,
        fetchCategories,
        createCategory,
        deleteCategory,
        fetchComponents,
        createComponent,
        updateComponent,
        deleteComponent
    };
});
