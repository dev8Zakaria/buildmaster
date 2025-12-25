<script setup>
import { onMounted, ref } from 'vue';
import { Icon } from '@iconify/vue';
import Button from '@/UI-elements/as_Inspira/Button.vue';
import { useCartStore } from '@/stores/cart';
import { useRouter } from 'vue-router';

const cartStore = useCartStore();
const router = useRouter();

const isProcessing = ref(false);
const orderComplete = ref(false);
const completedOrder = ref(null);

onMounted(() => {
    cartStore.fetchCart();
});

const goBack = () => {
    router.push('/');
};

const handlePay = async () => {
    isProcessing.value = true;
    const result = await cartStore.checkout();
    isProcessing.value = false;
    
    if (result.success) {
        orderComplete.value = true;
        completedOrder.value = result.order;
    } else {
        alert('Payment failed: ' + result.error);
    }
};

const goHome = () => {
    router.push('/');
};
</script>

<template>
    <div class="min-h-screen bg-gray-50 dark:bg-black">
        <!-- Header -->
        <header class="bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800 sticky top-0 z-50">
            <div class="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
                <button @click="goBack" class="flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors">
                    <Icon icon="mdi:arrow-left" class="text-xl" />
                    <span>Back to Shop</span>
                </button>
                <h1 class="text-xl font-bold text-gray-900 dark:text-white">Checkout</h1>
                <div class="w-24"></div>
            </div>
        </header>

        <main class="max-w-4xl mx-auto p-6">
            
            <!-- Order Complete State -->
            <div v-if="orderComplete" class="bg-white dark:bg-zinc-900 rounded-2xl shadow-lg border border-gray-100 dark:border-zinc-800 p-12 text-center">
                <div class="inline-flex items-center justify-center w-24 h-24 rounded-full bg-green-100 dark:bg-green-900/30 mb-6">
                    <Icon icon="mdi:check-circle" class="text-6xl text-green-600 dark:text-green-400" />
                </div>
                <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">Payment Successful!</h2>
                <p class="text-gray-500 dark:text-gray-400 mb-8">Thank you for your order. Your order ID is #{{ completedOrder?.id }}</p>
                <Button @click="goHome" class="bg-yellow-500 hover:bg-yellow-600 text-white">
                    <Icon icon="mdi:home" class="mr-2" />
                    Back to Home
                </Button>
            </div>

            <!-- Checkout Form -->
            <div v-else class="space-y-6">
                
                <!-- Order Summary -->
                <div class="bg-white dark:bg-zinc-900 rounded-2xl shadow-lg border border-gray-100 dark:border-zinc-800 overflow-hidden">
                    <div class="p-6 border-b border-gray-100 dark:border-zinc-800">
                        <h2 class="text-xl font-bold text-gray-900 dark:text-white">Order Summary</h2>
                    </div>

                    <!-- Loading -->
                    <div v-if="cartStore.isLoading" class="p-12 text-center">
                        <Icon icon="eos-icons:loading" class="text-4xl text-yellow-500 animate-spin" />
                    </div>

                    <!-- Empty Cart -->
                    <div v-else-if="cartStore.items.length === 0" class="p-12 text-center text-gray-500">
                        <Icon icon="mdi:cart-off" class="text-5xl mb-4 opacity-50" />
                        <p class="text-lg">Your cart is empty</p>
                        <Button @click="goBack" variant="ghost" class="mt-4">
                            Go Shopping
                        </Button>
                    </div>

                    <!-- Items List -->
                    <div v-else>
                        <div class="divide-y divide-gray-100 dark:divide-zinc-800">
                            <div 
                                v-for="item in cartStore.items" 
                                :key="item.id"
                                class="p-4 flex items-center gap-4"
                            >
                                <!-- Product Image -->
                                <div class="w-16 h-16 rounded-lg bg-gray-100 dark:bg-zinc-800 overflow-hidden flex-shrink-0 p-2">
                                    <img 
                                        v-if="item.component?.ImageUrl" 
                                        :src="item.component.ImageUrl" 
                                        :alt="item.component?.name"
                                        class="w-full h-full object-contain"
                                    />
                                    <Icon v-else icon="mdi:image-off" class="w-full h-full text-gray-400" />
                                </div>

                                <!-- Product Info -->
                                <div class="flex-1 min-w-0">
                                    <h3 class="font-semibold text-gray-900 dark:text-white">
                                        {{ item.component?.name }}
                                    </h3>
                                    <p class="text-sm text-gray-500 dark:text-gray-400">
                                        {{ item.component?.brand }}
                                    </p>
                                </div>

                                <!-- Quantity -->
                                <div class="text-sm text-gray-500 dark:text-gray-400">
                                    × {{ item.quantity }}
                                </div>

                                <!-- Price -->
                                <div class="text-lg font-bold text-gray-900 dark:text-white w-24 text-right">
                                    ${{ (item.quantity * item.unitPrice).toFixed(2) }}
                                </div>
                            </div>
                        </div>

                        <!-- Total -->
                        <div class="p-6 bg-gray-50 dark:bg-zinc-800/50 border-t border-gray-100 dark:border-zinc-800">
                            <div class="flex items-center justify-between">
                                <span class="text-lg text-gray-600 dark:text-gray-400">Total Amount</span>
                                <span class="text-3xl font-bold text-yellow-600 dark:text-yellow-400">
                                    ${{ Number(cartStore.totalAmount).toFixed(2) }}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Action Buttons -->
                <div v-if="cartStore.items.length > 0" class="flex gap-4">
                    <Button 
                        @click="goBack" 
                        variant="outline" 
                        class="flex-1"
                    >
                        <Icon icon="mdi:close" class="mr-2" />
                        Cancel
                    </Button>
                    <Button 
                        @click="handlePay" 
                        :disabled="isProcessing"
                        class="flex-1 bg-green-600 hover:bg-green-700 text-white"
                    >
                        <Icon v-if="isProcessing" icon="eos-icons:loading" class="mr-2 animate-spin" />
                        <Icon v-else icon="mdi:credit-card-check" class="mr-2" />
                        {{ isProcessing ? 'Processing...' : 'Pay Now' }}
                    </Button>
                </div>

            </div>
        </main>
    </div>
</template>
