<script setup>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { Icon } from '@iconify/vue';
import { usePCBuilderStore } from '@/stores/pcBuilder';
import { useAuthStore } from '@/stores/auth';

const builderStore = usePCBuilderStore();
const authStore = useAuthStore();
const router = useRouter();

const selectedBuild = ref(null);
const showDetailModal = ref(false);

onMounted(async () => {
    if (!authStore.token) {
        router.push('/login');
        return;
    }
    await builderStore.fetchSavedBuilds();
});

const viewBuildDetails = async (buildId) => {
    const details = await builderStore.getSavedBuildById(buildId);
    if (details) {
        selectedBuild.value = details;
        showDetailModal.value = true;
    }
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

const handleLogout = () => {
    authStore.logout();
    router.push('/login');
};
</script>

<template>
    <div class="min-h-screen bg-gray-50 font-sans text-gray-900 antialiased relative selection:bg-amber-500 selection:text-white">

        <!-- Background Grid -->
        <div class="absolute inset-0 z-0 opacity-40 pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzAwMCIgb3BhY2l0eT0iMC4wMyIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')]"></div>
        
        <!-- Header -->
        <header class="sticky top-0 z-50 w-full backdrop-blur-xl border-b border-gray-200 bg-white/80">
            <div class="max-w-[1600px] mx-auto px-6 h-20 flex items-center justify-between">
                <router-link to="/" class="flex items-center gap-3 decoration-0 group">
                    <div class="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 shadow-lg shadow-orange-500/20 group-hover:scale-105 transition-transform duration-300">
                        <Icon icon="mdi:cpu-64-bit" class="text-white text-xl" />
                        <div class="absolute inset-0 rounded-xl ring-1 ring-white/20"></div>
                    </div>
                    <div>
                        <h1 class="text-xl font-black tracking-tight leading-none text-gray-900" style="font-family: 'Outfit', sans-serif;">
                            BUILD<span class="text-amber-500">MASTER</span>
                        </h1>
                        <p class="text-[10px] font-bold text-gray-500 uppercase tracking-widest font-mono">
                            User Archive
                        </p>
                    </div>
                </router-link>

                <div class="flex items-center gap-4">
                    <router-link to="/" class="hidden sm:flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-gray-900 font-bold uppercase tracking-wider text-xs transition-colors">
                        <Icon icon="mdi:arrow-left" />
                        <span>Exit</span>
                    </router-link>
                    <div class="w-px h-6 bg-gray-200 hidden sm:block"></div>
                    <router-link to="/builder" class="flex items-center gap-2 px-4 py-2 bg-amber-400 text-white text-sm font-bold uppercase tracking-wider rounded-lg hover:bg-amber-500 transition-all shadow-sm">
                        <Icon icon="mdi:plus" />
                        <span>Create New</span>
                    </router-link>
                </div>
            </div>
        </header>

        <main class="max-w-[1600px] mx-auto p-6 space-y-8 relative z-10 py-12">

            <div class="flex items-end justify-between border-b border-gray-200 pb-6">
                <div>
                    <h1 class="text-4xl font-black tracking-tighter text-gray-900 mb-2" style="font-family: 'Outfit', sans-serif;">
                        SAVED CONFIGURATIONS
                    </h1>
                    <div class="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-widest font-mono">
                        <span class="text-amber-600">Database Access</span>
                        <span>//</span>
                        <span>{{ builderStore.savedBuilds.length }} Files Stored</span>
                    </div>
                </div>
            </div>

            <!-- Loading State -->
            <div v-if="builderStore.isLoading" class="flex flex-col items-center justify-center py-20 gap-4">
                <Icon icon="eos-icons:loading" class="text-5xl text-amber-500 animate-spin" />
                <p class="text-xs font-mono text-gray-500 animate-pulse">RETRIEVING_DATA...</p>
            </div>

            <!-- Empty State -->
            <div v-else-if="builderStore.savedBuilds.length === 0" class="flex flex-col items-center justify-center py-24 border-2 border-dashed border-gray-200 rounded-3xl">
                <div class="p-6 bg-white rounded-full mb-6 border border-gray-100 shadow-sm">
                     <Icon icon="mdi:folder-open-outline" class="text-6xl text-gray-300" />
                </div>
                <h2 class="text-xl font-bold text-gray-900 mb-2">ARCHIVE EMPTY</h2>
                <p class="text-gray-500 mb-8 max-w-sm text-center font-mono text-sm">No custom configurations found in your repository.</p>
                <router-link to="/builder" class="px-8 py-3 bg-amber-400 text-white font-bold uppercase tracking-wider rounded-xl hover:bg-amber-500 transition-colors shadow-sm">
                    Initialize Builder
                </router-link>
            </div>

            <!-- Builds Grid -->
            <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <div 
                    v-for="build in builderStore.savedBuilds" 
                    :key="build.id"
                    class="group bg-white rounded-2xl border border-gray-200 p-6 hover:border-amber-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/10 flex flex-col h-full"
                >
                    <!-- Card Header -->
                    <div class="flex items-start justify-between mb-6">
                        <div class="px-3 py-1 rounded bg-amber-50 border border-amber-100">
                            <span class="text-amber-600 font-black font-mono">${{ build.total_price }}</span>
                        </div>
                    </div>

                    <!-- Info -->
                    <div class="mb-6 flex-1">
                        <h3 class="text-lg font-bold text-gray-900 mb-2 line-clamp-1 group-hover:text-amber-600 transition-colors">{{ build.name }}</h3>
                        <div class="flex items-center gap-2 text-xs text-gray-500 font-mono">
                            <Icon icon="mdi:calendar-blank" />
                            {{ formatDate(build.createdAt) }}
                        </div>
                    </div>

                    <!-- Actions -->
                    <div class="grid grid-cols-2 gap-3 mt-auto">
                        <button 
                            @click="viewBuildDetails(build.id)"
                            class="px-4 py-2 border border-gray-200 rounded-lg text-xs font-bold uppercase text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                        >
                            Details
                        </button>
                        <button 
                            @click="handleBuyNow(build.id)"
                            class="px-4 py-2 bg-amber-400 text-white rounded-lg text-xs font-bold uppercase hover:bg-amber-500 transition-colors flex items-center justify-center gap-2 shadow-sm"
                        >
                            <Icon icon="mdi:cart" />
                            Buy
                        </button>
                    </div>
                </div>
            </div>
        </main>

        <!-- Detail Modal -->
        <div v-if="showDetailModal && selectedBuild" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in" @click.self="showDetailModal = false">
            <div class="bg-white w-full max-w-lg max-h-[90vh] overflow-y-auto scrollbar-hide rounded-2xl shadow-2xl border border-gray-200 flex flex-col">
                
                <div class="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white z-10 glass-header">
                    <div>
                         <h2 class="text-xl font-bold text-gray-900">{{ selectedBuild.name }}</h2>
                         <p class="text-xs text-amber-600 font-mono uppercase tracking-wider">Configuration Details</p>
                    </div>
                    <button @click="showDetailModal = false" class="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-900 transition-colors">
                        <Icon icon="mdi:close" class="text-xl" />
                    </button>
                </div>

                <div class="p-6 space-y-6">
                    <div class="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
                        <span class="text-xs text-gray-500 font-mono uppercase">Total Valuation</span>
                        <span class="text-2xl font-black text-amber-600 font-mono">${{ selectedBuild.total_price }}</span>
                    </div>

                    <div class="space-y-3">
                        <h3 class="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">Components List</h3>
                        <div class="space-y-2">
                             <div 
                                v-for="comp in selectedBuild.components" 
                                :key="comp.id"
                                class="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg hover:border-amber-500/30 transition-colors shadow-sm"
                            >
                                <div class="flex items-center gap-3">
                                    <div class="w-8 h-8 rounded bg-gray-50 flex items-center justify-center border border-gray-100">
                                         <img v-if="comp.ImageUrl" :src="comp.ImageUrl" class="w-full h-full object-contain p-0.5" />
                                         <Icon v-else icon="mdi:chip" class="text-gray-400" />
                                    </div>
                                    <div>
                                        <p class="text-sm font-bold text-gray-900">{{ comp.name }}</p>
                                        <p class="text-[10px] text-gray-500 font-mono">{{ comp.brand }}</p>
                                    </div>
                                </div>
                                <span class="text-sm font-mono text-amber-600">${{ comp.price }}</span>
                            </div>
                        </div>
                       
                    </div>
                </div>

                <div class="p-6 border-t border-gray-200 flex gap-4 sticky bottom-0 bg-gray-50">
                    <button 
                        @click="handleDelete(selectedBuild.id)"
                        class="px-4 py-3 border border-red-200 text-red-500 bg-red-50 hover:bg-red-100 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-colors"
                    >
                        <Icon icon="mdi:trash-can-outline" />
                        Delete
                    </button>
                    <button 
                        @click="handleBuyNow(selectedBuild.id)"
                        class="flex-1 px-4 py-3 bg-amber-400 text-white hover:bg-amber-500 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors shadow-sm"
                    >
                        <Icon icon="mdi:cart-arrow-right" class="text-lg" />
                        Proceed to Checkout
                    </button>
                </div>

            </div>
        </div>

    </div>
</template>
