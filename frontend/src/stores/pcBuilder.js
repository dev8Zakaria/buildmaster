import { defineStore } from 'pinia';
import axios from 'axios';
import { ref, computed } from 'vue';

// Define the build steps in order
const BUILD_STEPS = [
    { id: 'cpu', category: 'Processeurs', label: 'CPU' },
    { id: 'motherboard', category: 'Cartes Mères', label: 'Motherboard' },
    { id: 'ram', category: 'Mémoire RAM', label: 'RAM' },
    { id: 'gpu', category: 'Cartes Graphiques', label: 'GPU' },
    { id: 'storage', category: 'Stockage', label: 'Storage' },
    { id: 'psu', category: 'Alimentation', label: 'PSU' },
    { id: 'case', category: 'Boîtiers', label: 'Case' }
];

export const usePCBuilderStore = defineStore('pcBuilder', () => {
    // --- State ---
    const currentStepIndex = ref(0);
    const selectedParts = ref({}); // { cpu: { id, name, price, ... }, gpu: {...}, ... }
    const availableComponents = ref([]);
    const savedBuilds = ref([]);
    const isLoading = ref(false);
    const error = ref(null);

    const api = axios.create({
        baseURL: 'http://localhost:3000/api'
    });

    // JWT Auth interceptor
    api.interceptors.request.use((config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    });

    // --- Computed ---
    const steps = computed(() => BUILD_STEPS);
    const currentStep = computed(() => BUILD_STEPS[currentStepIndex.value]);
    const isFirstStep = computed(() => currentStepIndex.value === 0);
    const isLastStep = computed(() => currentStepIndex.value === BUILD_STEPS.length - 1);

    const totalPrice = computed(() => {
        return Object.values(selectedParts.value).reduce((sum, part) => {
            return sum + (part ? parseFloat(part.price) || 0 : 0);
        }, 0);
    });

    const selectedPartsArray = computed(() => {
        return BUILD_STEPS.map(step => ({
            ...step,
            component: selectedParts.value[step.id] || null
        }));
    });

    const allPartsSelected = computed(() => {
        return BUILD_STEPS.every(step => selectedParts.value[step.id]);
    });

    // --- Actions ---
    const fetchStepComponents = async (categoryName) => {
        isLoading.value = true;
        error.value = null;
        try {
            const response = await api.get(`/pcBuild/step/${encodeURIComponent(categoryName)}`);
            availableComponents.value = response.data;
        } catch (err) {
            error.value = err.response?.data?.message || 'Failed to load components';
            availableComponents.value = [];
        } finally {
            isLoading.value = false;
        }
    };

    const selectPart = (stepId, component) => {
        selectedParts.value[stepId] = component;
    };

    const removePart = (stepId) => {
        delete selectedParts.value[stepId];
    };

    const nextStep = async () => {
        if (!isLastStep.value) {
            currentStepIndex.value++;
            await fetchStepComponents(currentStep.value.category);
        }
    };

    const prevStep = async () => {
        if (!isFirstStep.value) {
            currentStepIndex.value--;
            await fetchStepComponents(currentStep.value.category);
        }
    };

    const goToStep = async (index) => {
        if (index >= 0 && index < BUILD_STEPS.length) {
            currentStepIndex.value = index;
            await fetchStepComponents(currentStep.value.category);
        }
    };

    const resetBuild = () => {
        selectedParts.value = {};
        currentStepIndex.value = 0;
    };

    const saveBuild = async (name) => {
        isLoading.value = true;
        error.value = null;
        try {
            const componentIds = Object.values(selectedParts.value)
                .filter(Boolean)
                .map(part => part.id);

            await api.post('/pcBuild/save', { name, componentIds });
            await fetchSavedBuilds();
            return { success: true };
        } catch (err) {
            error.value = err.response?.data?.message || 'Failed to save build';
            return { success: false, error: error.value };
        } finally {
            isLoading.value = false;
        }
    };

    const fetchSavedBuilds = async () => {
        isLoading.value = true;
        try {
            const response = await api.get('/pcBuild');
            savedBuilds.value = response.data;
        } catch (err) {
            error.value = err.response?.data?.message || 'Failed to fetch saved builds';
        } finally {
            isLoading.value = false;
        }
    };

    const getSavedBuildById = async (id) => {
        isLoading.value = true;
        try {
            const response = await api.get(`/pcBuild/${id}`);
            return response.data;
        } catch (err) {
            error.value = err.response?.data?.message || 'Failed to fetch build';
            return null;
        } finally {
            isLoading.value = false;
        }
    };

    const deleteSavedBuild = async (id) => {
        try {
            await api.delete(`/pcBuild/${id}`);
            await fetchSavedBuilds();
            return { success: true };
        } catch (err) {
            return { success: false, error: err.response?.data?.message || 'Failed to delete' };
        }
    };

    const transferBuildToCart = async (buildId) => {
        isLoading.value = true;
        try {
            const response = await api.post(`/pcBuild/${buildId}/transfer`);
            return { success: true, orderId: response.data.orderId };
        } catch (err) {
            return { success: false, error: err.response?.data?.message || 'Failed to transfer' };
        } finally {
            isLoading.value = false;
        }
    };

    const initBuilder = async () => {
        resetBuild();
        await fetchStepComponents(BUILD_STEPS[0].category);
    };

    return {
        // State
        currentStepIndex,
        selectedParts,
        availableComponents,
        savedBuilds,
        isLoading,
        error,
        // Computed
        steps,
        currentStep,
        isFirstStep,
        isLastStep,
        totalPrice,
        selectedPartsArray,
        allPartsSelected,
        // Actions
        fetchStepComponents,
        selectPart,
        removePart,
        nextStep,
        prevStep,
        goToStep,
        resetBuild,
        saveBuild,
        fetchSavedBuilds,
        getSavedBuildById,
        deleteSavedBuild,
        transferBuildToCart,
        initBuilder
    };
});
