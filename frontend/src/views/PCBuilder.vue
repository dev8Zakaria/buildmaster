<script setup>
import { onMounted, computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { Icon } from '@iconify/vue';
import { usePCBuilderStore } from '@/stores/pcBuilder';
import { useAuthStore } from '@/stores/auth';
import ProductCard from '@/UI-elements/as_Inspira/ProductCard.vue';
import Button from '@/UI-elements/as_Inspira/Button.vue';
import Input from '@/UI-elements/as_Inspira/Input.vue';
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
    // First save the build, then transfer
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
    return builderStore.isLastStep && isCurrentPartSelected.value;
});
</script>

<template>
    <div class="min-h-screen bg-gray-50 text-gray-900 font-sans antialiased">
        
        <!-- Header -->
        <header class="bg-white border-b border-gray-200 sticky top-0 z-50">
            <div class="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                <router-link to="/" class="flex items-center gap-2">
                    <div class="bg-yellow-500 rounded-lg p-1.5 rotate-3">
                        <Icon icon="mdi:cpu-64-bit" class="text-white text-xl" />
                    </div>
                    <h1 class="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-600 to-yellow-500">
                        PC Builder
                    </h1>
                </router-link>

                <div class="flex items-center gap-4">
                    <router-link to="/saved-builds">
                        <Button variant="ghost" size="sm">
                            <Icon icon="mdi:folder-heart" class="mr-1" />
                            My Builds
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

        <main class="max-w-7xl mx-auto p-6 space-y-8">

            <!-- Stepper -->
            <div class="bg-white rounded-2xl border border-gray-200 p-6 overflow-x-auto">
                <Stepper 
                    :steps="builderStore.steps"
                    :current-index="builderStore.currentStepIndex"
                    :completed-steps="completedSteps"
                    @step-click="handleStepClick"
                />
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                <!-- Component Selection Area -->
                <div class="lg:col-span-2 space-y-4">
                    <div class="flex items-center justify-between">
                        <h2 class="text-2xl font-bold">
                            Select {{ builderStore.currentStep?.label }}
                        </h2>
                        <span class="text-sm text-gray-500">
                            Step {{ builderStore.currentStepIndex + 1 }} of {{ builderStore.steps.length }}
                        </span>
                    </div>

                    <!-- Loading State -->
                    <div v-if="builderStore.isLoading" class="flex justify-center py-12">
                        <Icon icon="eos-icons:loading" class="text-4xl text-yellow-500 animate-spin" />
                    </div>

                    <!-- Empty State -->
                    <div v-else-if="builderStore.availableComponents.length === 0" class="text-center py-12 text-gray-500">
                        <Icon icon="mdi:package-variant" class="text-5xl mb-2 opacity-50" />
                        <p>No components available for this category.</p>
                    </div>

                    <!-- Component Grid -->
                    <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        <div 
                            v-for="comp in builderStore.availableComponents" 
                            :key="comp.id"
                            class="relative"
                        >
                            <ProductCard
                                :name="comp.name"
                                :brand="comp.brand"
                                :price="comp.price"
                                :stock="comp.stock"
                                :category="comp.category?.name || builderStore.currentStep?.label"
                                :image-url="comp.ImageUrl"
                                :show-add-to-cart="false"
                                @click="handleSelectComponent(comp)"
                                :class="{
                                    'ring-2 ring-yellow-500 ring-offset-2': builderStore.selectedParts[builderStore.currentStep?.id]?.id === comp.id
                                }"
                            />
                            <!-- Selection Indicator -->
                            <div 
                                v-if="builderStore.selectedParts[builderStore.currentStep?.id]?.id === comp.id"
                                class="absolute top-2 left-2 bg-yellow-500 text-white rounded-full p-1"
                            >
                                <Icon icon="mdi:check" class="text-sm" />
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Summary Sidebar -->
                <div class="space-y-4">
                    <div class="bg-white rounded-2xl border border-gray-200 p-6 sticky top-24">
                        <h3 class="text-lg font-bold mb-4 flex items-center gap-2">
                            <Icon icon="mdi:clipboard-list" class="text-yellow-500" />
                            Your Build
                        </h3>

                        <div class="space-y-3 mb-6">
                            <div 
                                v-for="step in builderStore.selectedPartsArray" 
                                :key="step.id"
                                class="flex items-center justify-between text-sm"
                            >
                                <span class="text-gray-500">{{ step.label }}</span>
                                <div v-if="step.component" class="flex items-center gap-2">
                                    <span class="font-medium truncate max-w-[120px]" :title="step.component.name">
                                        {{ step.component.name }}
                                    </span>
                                    <button 
                                        @click="handleRemoveComponent(step.id)"
                                        class="text-red-500 hover:text-red-600"
                                    >
                                        <Icon icon="mdi:close" />
                                    </button>
                                </div>
                                <span v-else class="text-gray-400 italic">Not selected</span>
                            </div>
                        </div>

                        <div class="border-t border-gray-100 pt-4 mb-6">
                            <div class="flex items-center justify-between text-lg font-bold">
                                <span>Total</span>
                                <span class="text-yellow-500">${{ builderStore.totalPrice.toFixed(2) }}</span>
                            </div>
                        </div>

                        <!-- Actions -->
                        <div class="space-y-2">
                            <Button 
                                @click="showSaveModal = true"
                                :disabled="!builderStore.allPartsSelected"
                                class="w-full border border-gray-300"
                                variant="outline"
                            >
                                <Icon icon="mdi:content-save" class="mr-2" />
                                Save Build
                            </Button>
                            <Button 
                                @click="handleBuyNow"
                                :disabled="!builderStore.allPartsSelected"
                                class="w-full"
                            >
                                <Icon icon="mdi:cart" class="mr-2" />
                                Buy Now
                            </Button>
                        </div>
                    </div>
                </div>

            </div>

            <!-- Navigation Buttons - Sticky at bottom for better UX -->
            <div class="sticky bottom-4 z-40">
                <!-- Build Complete State -->
                <div v-if="isBuildComplete" class="flex items-center justify-center gap-3 bg-green-50 rounded-2xl border border-green-200 p-6">
                    <Icon icon="mdi:check-circle" class="text-4xl text-green-500" />
                    <div class="text-center">
                        <span class="text-xl font-bold text-green-600">Build Complete!</span>
                        <p class="text-sm text-green-500">All components selected. Save or buy your build above.</p>
                    </div>
                </div>

                <!-- Normal Navigation -->
                <div v-else class="flex items-center justify-between bg-white rounded-2xl border border-gray-200 p-4 shadow-lg">
                    <Button 
                        @click="handlePrev" 
                        :disabled="builderStore.isFirstStep"
                        variant="ghost"
                    >
                        <Icon icon="mdi:arrow-left" class="mr-2" />
                        Previous
                    </Button>

                    <Button 
                        @click="handleNext" 
                        :disabled="builderStore.isLastStep"
                    >
                        Next
                        <Icon icon="mdi:arrow-right" class="ml-2" />
                    </Button>
                </div>
            </div>

        </main>

        <!-- Save Modal -->
        <div v-if="showSaveModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" @click.self="showSaveModal = false">
            <div class="bg-white w-full max-w-md rounded-2xl shadow-xl border border-gray-100 p-6">
                <h2 class="text-xl font-bold mb-4">Save Your Build</h2>
                <Input 
                    v-model="buildName" 
                    placeholder="Enter a name for your build..."
                    class="mb-4"
                />
                <div class="flex gap-3 justify-end">
                    <Button variant="ghost" @click="showSaveModal = false">Cancel</Button>
                    <Button @click="handleSave" :disabled="builderStore.isLoading">
                        <Icon icon="mdi:content-save" class="mr-2" />
                        Save
                    </Button>
                </div>
            </div>
        </div>

    </div>
</template>
