import { defineStore } from 'pinia';
import axios from 'axios';
import { ref } from 'vue';

export const useCatalogStore = defineStore('catalog', () => {
    const recentProducts = ref([]);
    const categoryProducts = ref([]);
    const allProducts = ref([]);
    const categories = ref([]);

    // UI States
    const selectedCategoryId = ref(null);
    const isLoading = ref(false);
    const error = ref(null);

    const api = axios.create({
        baseURL: import.meta.env.VITE_API_BASE_URL || '/api'
    });

    // Fetch Recents
    const fetchRecent = async () => {
        try {
            const response = await api.get('/component/recent');
            recentProducts.value = response.data;
        } catch (err) {
            console.error('Failed to fetch recents:', err);
        }
    };

    // Fetch All Categories (for filter buttons)
    const fetchCategories = async () => {
        try {
            const response = await api.get('/category');
            categories.value = response.data;
        } catch (err) {
            console.error('Failed to fetch categories:', err);
        }
    };

    // Fetch Products by Category
    const fetchByCategory = async (id) => {
        selectedCategoryId.value = id;
        try {
            const response = await api.get(`/component/category/${id}`);
            categoryProducts.value = response.data;
        } catch (err) {
            console.error('Failed to fetch category products:', err);
            categoryProducts.value = [];
        }
    };

    // Fetch All Products
    const fetchAll = async () => {
        isLoading.value = true;
        try {
            const response = await api.get('/component');
            allProducts.value = response.data;
        } catch (err) {
            error.value = err.message;
        } finally {
            isLoading.value = false;
        }
    };

    // Helper to initialize the home page data
    const initHome = async () => {
        isLoading.value = true;
        await Promise.all([
            fetchRecent(),
            fetchCategories(),
            fetchAll()
        ]);

        // Select first category by default if available
        if (categories.value.length > 0 && !selectedCategoryId.value) {
            await fetchByCategory(categories.value[0].id);
        }
        isLoading.value = false;
    };

    return {
        recentProducts,
        categoryProducts,
        allProducts,
        categories,
        selectedCategoryId,
        isLoading,
        error,
        fetchRecent,
        fetchByCategory,
        fetchCategories,
        fetchAll,
        initHome
    };
});
