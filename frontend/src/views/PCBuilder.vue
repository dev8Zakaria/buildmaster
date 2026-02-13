<script setup>
import { onMounted, computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { Icon } from '@iconify/vue';
import { usePCBuilderStore } from '@/stores/pcBuilder';
import { useAuthStore } from '@/stores/auth';
import ProductCard from '@/UI-elements/as_Inspira/ProductCard.vue';
import Stepper from '@/UI-elements/as_Inspira/Stepper.vue';

const builderStore = usePCBuilderStore();
const authStore = useAuthStore();
const router = useRouter();

const showSaveModal = ref(false);
const buildName = ref('');

onMounted(async () => {
    await builderStore.initBuilder();
});

const completedSteps = computed(() => {
    const completed = {};
    builderStore.steps.forEach(step => {
        completed[step.id] = !!builderStore.selectedParts[step.id];
    });
    return completed;
});

const handleSelectComponent = (component) => {
    console.log('Selecting component:', component);
    if (!builderStore.currentStep) {
        console.warn('No current step defined');
        return;
    }
    // Direct assignment to store action
    builderStore.selectPart(builderStore.currentStep.id, component);
};

const handleRemoveComponent = (stepId) => {
    builderStore.removePart(stepId);
};

const handleStepClick = (index) => {
    builderStore.goToStep(index);
};

const handleNext = async () => {
    await builderStore.nextStep();
};

const handlePrev = async () => {
    await builderStore.prevStep();
};

const handleSave = async () => {
    if (!authStore.token) {
        router.push('/login');
        return;
    }
    if (!buildName.value.trim()) {
        alert('Please enter a name for your build');
        return;
    }
    const result = await builderStore.saveBuild(buildName.value);
    if (result.success) {
        showSaveModal.value = false;
        buildName.value = '';
        router.push('/saved-builds');
    } else {
        alert('Failed to save: ' + result.error);
    }
};

const handleBuyNow = async () => {
    if (!authStore.token) {
        router.push('/login');
        return;
    }
    const saveName = `Quick Build - ${new Date().toLocaleDateString()}`;
    const saveResult = await builderStore.saveBuild(saveName);
    if (saveResult.success && builderStore.savedBuilds.length > 0) {
        const latestBuild = builderStore.savedBuilds[builderStore.savedBuilds.length - 1];
        const transferResult = await builderStore.transferBuildToCart(latestBuild.id);
        if (transferResult.success) {
            router.push('/checkout');
        } else {
            alert('Failed to add to cart: ' + transferResult.error);
        }
    }
};

const isCurrentPartSelected = computed(() => {
    return !!builderStore.selectedParts[builderStore.currentStep?.id];
});

const isBuildComplete = computed(() => {
    return builderStore.allPartsSelected;
});
</script>

<template>
    <div class="min-h-screen bg-gray-50 font-sans text-gray-900 antialiased relative selection:bg-amber-500 selection:text-white">
        
        <!-- Background Grid -->
        <div class="absolute inset-0 z-0 opacity-30 pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzAwMCIgb3BhY2l0eT0iMC4wNSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')]"></div>

        <!-- Header -->
        <header class="sticky top-0 z-50 w-full backdrop-blur-xl border-b border-gray-200 bg-white/80">
            <div class="max-w-[1600px] mx-auto px-6 h-20 flex items-center justify-between">
                <router-link to="/" class="flex items-center gap-3 decoration-0 group">
                    <div class="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 shadow-lg shadow-orange-500/20 group-hover:scale-105 transition-transform duration-300">
                        <Icon icon="mdi:hammer-wrench" class="text-white text-xl" />
                        <div class="absolute inset-0 rounded-xl ring-1 ring-white/20"></div>
                    </div>
                    <div>
                        <h1 class="text-xl font-black tracking-tight leading-none text-gray-900" style="font-family: 'Outfit', sans-serif;">
                            PC<span class="text-amber-600">BUILDER</span>
                        </h1>
                        <p class="text-[10px] font-bold text-gray-500 uppercase tracking-widest font-mono">
                            Custom Shop
                        </p>
                    </div>
                </router-link>

                <div class="flex items-center gap-4">
                    <router-link to="/saved-builds" class="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-all">
                        <Icon icon="mdi:folder-heart-outline" class="text-lg" />
                        <span class="hidden sm:inline">Saved Builds</span>
                    </router-link>
                    <router-link to="/" class="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-all">
                        <Icon icon="mdi:close" class="text-lg" />
                        <span class="hidden sm:inline">Exit</span>
                    </router-link>
                </div>
            </div>
        </header>

        <main class="max-w-[1600px] mx-auto p-6 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 py-8">

            <!-- Left: Stepper & Selection -->
            <div class="lg:col-span-8 xl:col-span-9 space-y-6">
                
                <!-- Stepper Container -->
                <div class="bg-white/70 backdrop-blur-md border border-gray-200 rounded-2xl p-6 overflow-x-auto shadow-sm">
                    <Stepper 
                        :steps="builderStore.steps"
                        :current-index="builderStore.currentStepIndex"
                        :completed-steps="completedSteps"
                        @step-click="handleStepClick"
                    />
                </div>

                <!-- Current Step Header - More compact -->
                <div class="flex items-center justify-between bg-white px-5 py-3 rounded-xl border-l-4 border-amber-500 shadow-sm border border-gray-100">
                    <div>
                        <h2 class="text-xl font-black tracking-tight text-gray-900" style="font-family: 'Outfit', sans-serif;">
                            {{ builderStore.currentStep?.label }}
                        </h2>
                        <p class="text-[10px] font-mono text-amber-600 uppercase tracking-widest">
                            Step {{ builderStore.currentStepIndex + 1 }} of {{ builderStore.steps.length }}
                        </p>
                    </div>
                    <div v-if="builderStore.isLoading" class="flex items-center gap-2">
                         <Icon icon="eos-icons:loading" class="text-xl text-amber-500 animate-spin" />
                         <span class="text-xs font-mono text-gray-500 animate-pulse">Loading...</span>
                    </div>
                </div>

                <!-- Components Grid -->
                <div class="min-h-[400px]">
                     <!-- Empty State -->
                    <div v-if="!builderStore.isLoading && builderStore.availableComponents.length === 0" class="flex flex-col items-center justify-center h-96 border-2 border-dashed border-gray-200 rounded-3xl bg-white/50">
                        <Icon icon="mdi:package-variant-closed" class="text-6xl text-gray-300 mb-4" />
                        <p class="text-gray-500 font-medium text-lg">No compatible parts found.</p>
                    </div>

                    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                        <div 
                            v-for="comp in builderStore.availableComponents" 
                            :key="comp.id"
                            class="relative h-full group"
                        >
                            <!-- ProductCard with direct click handler -->
                            <div 
                                @click="handleSelectComponent(comp)"
                                class="h-full cursor-pointer"
                            >
                                <ProductCard
                                    :name="comp.name"
                                    :brand="comp.brand"
                                    :price="comp.price"
                                    :stock="comp.stock"
                                    :category="comp.category?.name || builderStore.currentStep?.label"
                                    :image-url="comp.ImageUrl"
                                    :show-add-to-cart="false"
                                    class="h-full bg-white border-gray-200 hover:border-amber-400 transition-all duration-200"
                                    :class="{
                                        'ring-2 ring-amber-400 ring-offset-2 ring-offset-white': builderStore.selectedParts[builderStore.currentStep?.id]?.id === comp.id
                                    }"
                                />
                            </div>
                            
                            <!-- Checkmark Badge - Moved to Center Overlay -->
                            <div 
                                v-if="builderStore.selectedParts[builderStore.currentStep?.id]?.id === comp.id"
                                class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-amber-400 text-white rounded-full p-3 shadow-xl z-20 pointer-events-none"
                            >
                                <Icon icon="mdi:check-bold" class="text-2xl" />
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Bottom Navigation -->
                <div class="sticky bottom-6 z-40 bg-white/95 backdrop-blur-xl border border-gray-200 p-4 rounded-2xl flex items-center justify-between shadow-xl">
                     <button 
                        @click="handlePrev" 
                        :disabled="builderStore.isFirstStep"
                        class="px-6 py-3 rounded-xl font-bold text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                    >
                        <Icon icon="mdi:arrow-left" />
                        Back
                    </button>

                    <button 
                        @click="handleNext" 
                        :disabled="builderStore.isLastStep"
                        class="px-8 py-3 rounded-xl font-bold text-sm bg-amber-400 text-white hover:bg-amber-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 shadow-sm"
                    >
                        Next Step
                        <Icon icon="mdi:arrow-right" />
                    </button>
                </div>

            </div>

            <!-- Right: Build Summary Sidebar -->
            <div class="lg:col-span-4 xl:col-span-3 space-y-6">
                <div class="sticky top-28 bg-white/90 backdrop-blur-md border border-gray-200 rounded-2xl overflow-hidden shadow-xl">
                    <!-- Header -->
                    <div class="p-5 border-b border-gray-100 bg-gray-50 flex items-center gap-3">
                        <Icon icon="mdi:clipboard-list-outline" class="text-amber-600 text-xl" />
                        <div>
                            <h3 class="font-bold text-gray-900 text-sm">Build Summary</h3>
                            <p class="text-xs text-gray-500">Your configuration</p>
                        </div>
                    </div>

                    <!-- Items List -->
                    <div class="p-4 space-y-2 max-h-[60vh] overflow-y-auto scrollbar-hide" style="scrollbar-width: none; -ms-overflow-style: none;">
                        <div 
                            v-for="step in builderStore.selectedPartsArray" 
                            :key="step.id"
                            class="group flex flex-col gap-1 p-3 rounded-lg transition-colors border"
                            :class="step.component ? 'bg-white border-gray-200 hover:border-gray-300' : 'bg-gray-50 border-dashed border-gray-200'"
                            @click="handleStepClick(builderStore.steps.findIndex(s => s.id === step.id))"
                        >
                            <div class="flex items-center justify-between cursor-pointer">
                                <span class="text-xs font-bold text-gray-500 uppercase tracking-wide">{{ step.label }}</span>
                                <button 
                                    v-if="step.component"
                                    @click.stop="handleRemoveComponent(step.id)"
                                    class="text-gray-400 hover:text-red-500 transition-colors p-1"
                                >
                                    <Icon icon="mdi:close" class="text-xs" />
                                </button>
                            </div>
                            
                            <div v-if="step.component" class="flex items-center gap-3 mt-1">
                                <div class="w-10 h-10 rounded-lg bg-white flex items-center justify-center p-1 border border-gray-100">
                                    <img v-if="step.component.ImageUrl" :src="step.component.ImageUrl" class="w-full h-full object-contain mix-blend-multiply" />
                                    <Icon v-else icon="mdi:chip" class="text-gray-400" />
                                </div>
                                <div class="min-w-0 flex-1">
                                    <p class="text-sm font-bold text-gray-900 truncate">{{ step.component.name }}</p>
                                    <p class="text-xs text-amber-600 font-mono font-bold">${{ Number(step.component.price).toFixed(2) }}</p>
                                </div>
                            </div>
                            <div v-else class="flex items-center gap-2 mt-1">
                                <div class="w-8 h-8 rounded border border-gray-200 bg-white flex items-center justify-center text-gray-300">
                                    <Icon icon="mdi:plus" class="text-xs" />
                                </div>
                                <span class="text-xs text-gray-400 italic">Not selected</span>
                            </div>
                        </div>
                    </div>

                    <!-- Footer Totals -->
                    <div class="p-5 border-t border-gray-100 bg-gray-50 space-y-4">
                        <div class="flex items-end justify-between">
                            <span class="text-sm font-bold text-gray-600">Total</span>
                            <span class="text-2xl font-black text-gray-900 font-mono tracking-tight">${{ builderStore.totalPrice.toFixed(2) }}</span>
                        </div>

                        <!-- Action Buttons -->
                        <div class="grid grid-cols-2 gap-3">
                            <button 
                                @click="showSaveModal = true"
                                :disabled="!isBuildComplete"
                                class="px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-700 font-bold text-sm hover:bg-gray-50 hover:text-gray-900 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Icon icon="mdi:content-save-outline" class="text-lg" />
                                Save
                            </button>
                            <button 
                                @click="handleBuyNow"
                                :disabled="!isBuildComplete"
                                class="px-4 py-3 rounded-xl bg-amber-400 text-white font-bold text-sm hover:bg-amber-500 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                            >
                                <Icon icon="mdi:cart-outline" class="text-lg" />
                                Checkout
                            </button>
                        </div>
                    </div>
                </div>
            </div>

        </main>

        <!-- Save Modal -->
        <div v-if="showSaveModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in" @click.self="showSaveModal = false">
            <div class="bg-white w-full max-w-md rounded-2xl border border-gray-200 shadow-2xl p-8 relative overflow-hidden">
                <div class="absolute top-0 left-0 w-full h-1 bg-amber-500"></div>
                
                <h2 class="text-2xl font-black text-gray-900 mb-2" style="font-family: 'Outfit', sans-serif;">Save Configuration</h2>
                <p class="text-sm text-gray-500 mb-6">Give your build a memorable name.</p>
                
                <div class="space-y-6">
                    <div>
                        <input 
                            v-model="buildName" 
                            type="text" 
                            placeholder="e.g. My Gaming Rig"
                            class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
                        />
                    </div>
                    
                    <div class="flex gap-3 justify-end">
                        <button 
                            @click="showSaveModal = false"
                            class="px-6 py-2.5 text-sm font-bold text-gray-500 hover:text-gray-700 transition-colors"
                        >
                            Cancel
                        </button>
                        <button 
                            @click="handleSave" 
                            :disabled="builderStore.isLoading"
                            class="px-6 py-2.5 bg-amber-500 text-white font-bold text-sm rounded-lg hover:bg-amber-600 transition-colors flex items-center gap-2"
                        >
                            <Icon icon="mdi:content-save-check" />
                            Save Build
                        </button>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>

<style scoped>
/* Hide scrollbar for webkit browsers */
.scrollbar-hide::-webkit-scrollbar {
    display: none;
}

/* Additional scoped styles if needed */
</style>
