<script setup>
import { ref } from 'vue';
import { Icon } from '@iconify/vue';
import Button from '@/UI-elements/as_Inspira/Button.vue';
import { useCartStore } from '@/stores/cart';
import { useRouter } from 'vue-router';
import { onClickOutside } from '@vueuse/core';

const cartStore = useCartStore();
const router = useRouter();

const isOpen = ref(false);
const dropdownRef = ref(null);

const toggle = () => {
    isOpen.value = !isOpen.value;
    if (isOpen.value) {
        cartStore.fetchCart();
    }
};

const goToCheckout = () => {
    isOpen.value = false;
    router.push('/checkout');
};

onClickOutside(dropdownRef, () => {
    isOpen.value = false;
});

defineExpose({ toggle });
</script>

<template>
    <div ref="dropdownRef" class="relative">
        <!-- Cart Icon Button -->
        <button 
            @click="toggle"
            class="relative p-2 rounded-lg text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-zinc-800 transition-colors"
        >
            <Icon icon="mdi:cart-outline" class="text-2xl" />
            
            <!-- Badge -->
            <span 
                v-if="cartStore.itemCount > 0"
                class="absolute -top-1 -right-1 min-w-5 h-5 flex items-center justify-center bg-red-500 text-white text-xs font-bold rounded-full px-1"
            >
                {{ cartStore.itemCount > 99 ? '99+' : cartStore.itemCount }}
            </span>
        </button>

        <!-- Dropdown -->
        <Transition name="dropdown">
            <div 
                v-if="isOpen"
                class="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-zinc-900 rounded-xl shadow-2xl border border-gray-200 dark:border-zinc-800 overflow-hidden z-50"
            >
                <!-- Header -->
                <div class="p-4 border-b border-gray-100 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-800/50">
                    <h3 class="font-semibold text-gray-900 dark:text-white">
                        Shopping Cart ({{ cartStore.itemCount }})
                    </h3>
                </div>

                <!-- Items List -->
                <div class="max-h-64 overflow-y-auto">
                    <div v-if="cartStore.isLoading" class="p-8 text-center">
                        <Icon icon="eos-icons:loading" class="text-3xl text-yellow-500 animate-spin" />
                    </div>
                    
                    <div v-else-if="cartStore.items.length === 0" class="p-8 text-center text-gray-500">
                        <Icon icon="mdi:cart-off" class="text-4xl mb-2 opacity-50" />
                        <p>Your cart is empty</p>
                    </div>

                    <div v-else class="divide-y divide-gray-100 dark:divide-zinc-800">
                        <div 
                            v-for="item in cartStore.items" 
                            :key="item.id"
                            class="p-3 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-zinc-800/50"
                        >
                            <!-- Product Image -->
                            <div class="w-12 h-12 rounded-lg bg-gray-100 dark:bg-zinc-800 overflow-hidden flex-shrink-0 p-1">
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
                                <p class="text-sm font-medium text-gray-900 dark:text-white truncate">
                                    {{ item.component?.name }}
                                </p>
                                <p class="text-xs text-gray-500 dark:text-gray-400">
                                    Qty: {{ item.quantity }} × ${{ item.unitPrice }}
                                </p>
                            </div>

                            <!-- Item Total -->
                            <div class="text-sm font-semibold text-yellow-600 dark:text-yellow-400">
                                ${{ (item.quantity * item.unitPrice).toFixed(2) }}
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Footer -->
                <div v-if="cartStore.items.length > 0" class="p-4 border-t border-gray-100 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-800/50 space-y-3">
                    <div class="flex items-center justify-between">
                        <span class="text-sm text-gray-600 dark:text-gray-400">Total:</span>
                        <span class="text-lg font-bold text-gray-900 dark:text-white">
                            ${{ Number(cartStore.totalAmount).toFixed(2) }}
                        </span>
                    </div>
                    <Button 
                        @click="goToCheckout" 
                        class="w-full bg-yellow-500 hover:bg-yellow-600 text-white"
                    >
                        <Icon icon="mdi:cart-check" class="mr-2" />
                        Order
                    </Button>
                </div>
            </div>
        </Transition>
    </div>
</template>

<style scoped>
.dropdown-enter-active,
.dropdown-leave-active {
    transition: all 0.2s ease;
}
.dropdown-enter-from,
.dropdown-leave-to {
    opacity: 0;
    transform: translateY(-10px);
}
</style>
