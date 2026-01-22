<script setup>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { Icon } from '@iconify/vue';
import { usePCBuilderStore } from '@/stores/pcBuilder';
import { useAuthStore } from '@/stores/auth';
import Button from '@/UI-elements/as_Inspira/Button.vue';

const builderStore = usePCBuilderStore();
const authStore = useAuthStore();
const router = useRouter();

const selectedBuild = ref(null);
const showDetailModal = ref(false);
const detailLoading = ref(false);

onMounted(async () => {
    if (!authStore.token) {
        router.push('/login');
        return;
    }
    await builderStore.fetchSavedBuilds();
});

const viewBuildDetails = async (buildId) => {
    detailLoading.value = true;
    const details = await builderStore.getSavedBuildById(buildId);
    if (details) {
        selectedBuild.value = details;
        showDetailModal.value = true;
    }
    detailLoading.value = false;
};

const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this build?')) return;
    const result = await builderStore.deleteSavedBuild(id);
    if (!result.success) {
        alert('Failed to delete: ' + result.error);
    }
    showDetailModal.value = false;
};

const handleBuyNow = async (buildId) => {
    const result = await builderStore.transferBuildToCart(buildId);
    if (result.success) {
        router.push('/checkout');
    } else {
        alert('Failed to transfer to cart: ' + result.error);
    }
};

const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
};
</script>

<template>
    <div class="min-h-screen bg-gray-50 dark:bg-black font-sans text-gray-900 dark:text-gray-100">
        
        <!-- Header -->
        <header class="bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800 sticky top-0 z-50">
            <div class="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                <router-link to="/" class="flex items-center gap-2">
                    <div class="bg-yellow-500 rounded-lg p-1.5 rotate-3">
                        <Icon icon="mdi:cpu-64-bit" class="text-white text-xl" />
                    </div>
                    <h1 class="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-600 to-yellow-500">
                        Build Master
                    </h1>
                </router-link>

                <div class="flex items-center gap-4">
                    <router-link to="/builder">
                        <Button size="sm">
                            <Icon icon="mdi:plus" class="mr-1" />
                            New Build
                        </Button>
                    </router-link>
                    <router-link to="/">
                        <Button variant="ghost" size="sm">
                            <Icon icon="mdi:home" class="mr-1" />
                            Home
                        </Button>
                    </router-link>
                </div>
            </div>
        </header>

        <main class="max-w-7xl mx-auto p-6 space-y-6">

            <div class="flex items-center justify-between">
                <div>
                    <h1 class="text-3xl font-bold">My Saved Builds</h1>
                    <p class="text-gray-500 mt-1">Manage your PC configurations</p>
                </div>
            </div>

            <!-- Loading State -->
            <div v-if="builderStore.isLoading" class="flex justify-center py-12">
                <Icon icon="eos-icons:loading" class="text-4xl text-yellow-500 animate-spin" />
            </div>

            <!-- Empty State -->
            <div v-else-if="builderStore.savedBuilds.length === 0" class="text-center py-16">
                <Icon icon="mdi:folder-open" class="text-6xl text-gray-300 dark:text-zinc-700 mb-4" />
                <h2 class="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">No Saved Builds</h2>
                <p class="text-gray-500 mb-6">Start building your dream PC!</p>
                <router-link to="/builder">
                    <Button>
                        <Icon icon="mdi:hammer-wrench" class="mr-2" />
                        Start Building
                    </Button>
                </router-link>
            </div>

            <!-- Builds Grid -->
            <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div 
                    v-for="build in builderStore.savedBuilds" 
                    :key="build.id"
                    class="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 p-6 hover:shadow-lg hover:border-yellow-200 dark:hover:border-yellow-900/50 transition-all"
                >
                    <div class="flex items-start justify-between mb-4">
                        <div>
                            <h3 class="text-lg font-bold">{{ build.name }}</h3>
                            <p class="text-sm text-gray-500">{{ formatDate(build.createdAt) }}</p>
                        </div>
                        <div class="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 font-bold px-3 py-1 rounded-full text-sm">
                            ${{ build.total_price }}
                        </div>
                    </div>

                    <div class="flex gap-2 mt-4">
                        <Button 
                            variant="ghost" 
                            size="sm" 
                            class="flex-1"
                            @click="viewBuildDetails(build.id)"
                        >
                            <Icon icon="mdi:eye" class="mr-1" />
                            View
                        </Button>
                        <Button 
                            size="sm" 
                            class="flex-1"
                            @click="handleBuyNow(build.id)"
                        >
                            <Icon icon="mdi:cart" class="mr-1" />
                            Buy Now
                        </Button>
                    </div>
                </div>
            </div>

        </main>

        <!-- Detail Modal -->
        <div v-if="showDetailModal && selectedBuild" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" @click.self="showDetailModal = false">
            <div class="bg-white dark:bg-zinc-900 w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl shadow-xl border border-gray-100 dark:border-zinc-800">
                
                <div class="p-6 border-b border-gray-100 dark:border-zinc-800 flex items-center justify-between sticky top-0 bg-white dark:bg-zinc-900 z-10">
                    <h2 class="text-xl font-bold">{{ selectedBuild.name }}</h2>
                    <button @click="showDetailModal = false" class="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg">
                        <Icon icon="mdi:close" />
                    </button>
                </div>

                <div class="p-6 space-y-4">
                    <div class="flex items-center justify-between text-sm text-gray-500">
                        <span>Created {{ formatDate(selectedBuild.createdAt) }}</span>
                        <span class="text-lg font-bold text-yellow-500">${{ selectedBuild.total_price }}</span>
                    </div>

                    <div class="space-y-3">
                        <h3 class="font-semibold text-gray-700 dark:text-gray-300">Components</h3>
                        <div 
                            v-for="comp in selectedBuild.components" 
                            :key="comp.id"
                            class="flex items-center justify-between p-3 bg-gray-50 dark:bg-zinc-800/50 rounded-lg"
                        >
                            <span class="font-medium">{{ comp.name }}</span>
                            <span class="text-sm text-gray-500">${{ comp.price }}</span>
                        </div>
                    </div>
                </div>

                <div class="p-6 border-t border-gray-100 dark:border-zinc-800 flex gap-3 sticky bottom-0 bg-white dark:bg-zinc-900">
                    <Button 
                        variant="ghost" 
                        class="text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                        @click="handleDelete(selectedBuild.id)"
                    >
                        <Icon icon="mdi:delete" class="mr-1" />
                        Delete
                    </Button>
                    <Button 
                        class="flex-1"
                        @click="handleBuyNow(selectedBuild.id)"
                    >
                        <Icon icon="mdi:cart" class="mr-2" />
                        Buy Now
                    </Button>
                </div>

            </div>
        </div>

    </div>
</template>
