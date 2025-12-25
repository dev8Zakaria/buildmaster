import { defineStore } from 'pinia';
import axios from 'axios';
import { ref, computed } from 'vue';

export const useCartStore = defineStore('cart', () => {
    const cart = ref(null);
    const isLoading = ref(false);
    const error = ref(null);

    // Modal state
    const showAddedModal = ref(false);
    const lastAddedProduct = ref(null);

    const api = axios.create({
        baseURL: 'http://localhost:3000/api'
    });

    // Add auth header to requests
    api.interceptors.request.use((config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    });

    // Getters
    const itemCount = computed(() => {
        if (!cart.value || !cart.value.items) return 0;
        return cart.value.items.reduce((sum, item) => sum + item.quantity, 0);
    });

    const totalAmount = computed(() => {
        if (!cart.value) return 0;
        return cart.value.totalAmount || 0;
    });

    const items = computed(() => {
        return cart.value?.items || [];
    });

    // Actions
    const fetchCart = async () => {
        isLoading.value = true;
        try {
            const response = await api.get('/cart');
            cart.value = response.data;
        } catch (err) {
            console.error('Failed to fetch cart:', err);
            error.value = err.response?.data?.msg || 'Failed to fetch cart';
        } finally {
            isLoading.value = false;
        }
    };

    const addToCart = async (componentId, quantity = 1) => {
        isLoading.value = true;
        error.value = null;
        try {
            const response = await api.post('/cart/add', { componentId, quantity });
            cart.value = response.data;
            return { success: true };
        } catch (err) {
            console.error('Failed to add to cart:', err);
            error.value = err.response?.data?.msg || 'Failed to add to cart';
            return { success: false, error: error.value };
        } finally {
            isLoading.value = false;
        }
    };

    const checkout = async () => {
        isLoading.value = true;
        error.value = null;
        try {
            const response = await api.post('/cart/checkout');
            const order = response.data;
            // Clear local cart after successful checkout
            cart.value = null;
            return { success: true, order };
        } catch (err) {
            console.error('Checkout failed:', err);
            error.value = err.response?.data?.msg || 'Checkout failed';
            return { success: false, error: error.value };
        } finally {
            isLoading.value = false;
        }
    };

    const showModal = (product) => {
        lastAddedProduct.value = product;
        showAddedModal.value = true;
    };

    const hideModal = () => {
        showAddedModal.value = false;
        lastAddedProduct.value = null;
    };

    return {
        cart,
        isLoading,
        error,
        showAddedModal,
        lastAddedProduct,
        itemCount,
        totalAmount,
        items,
        fetchCart,
        addToCart,
        checkout,
        showModal,
        hideModal
    };
});
