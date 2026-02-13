<script setup>
import { ref } from 'vue';
import { Icon } from '@iconify/vue';
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

const handleRemoveItem = async (itemId) => {
    await cartStore.removeCartItem(itemId);
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
            class="relative p-2.5 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-all group"
        >
            <Icon icon="mdi:cart-outline" class="text-2xl group-hover:scale-110 transition-transform" />
            
            <!-- Badge -->
            <span 
                v-if="cartStore.itemCount > 0"
                class="absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center bg-amber-600 text-white text-[10px] font-black rounded-full px-1 shadow-lg shadow-amber-500/30 animate-in zoom-in"
            >
                {{ cartStore.itemCount > 99 ? '99+' : cartStore.itemCount }}
            </span>
        </button>

        <!-- Dropdown -->
        <Transition name="dropdown">
            <div 
                v-if="isOpen"
                class="absolute right-0 top-full mt-4 w-96 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200 overflow-hidden z-50 origin-top-right ring-1 ring-gray-100"
            >
                <!-- Header -->
                <div class="p-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
                    <div>
                        <h3 class="font-bold text-gray-900 text-sm uppercase tracking-wider" style="font-family: 'Outfit', sans-serif;">Cart Manifest</h3>
                        <p class="text-[10px] text-amber-600 font-mono">{{ cartStore.itemCount }} UNIT{{ cartStore.itemCount !== 1 ? 'S' : '' }} LOGGED</p>
                    </div>
                    <button @click="toggle" class="p-1 text-gray-400 hover:text-gray-900 transition-colors">
                        <Icon icon="mdi:close" class="text-lg" />
                    </button>
                </div>

                <!-- Items List -->
                <div class="max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
                    <div v-if="cartStore.isLoading" class="p-12 text-center">
                        <Icon icon="eos-icons:loading" class="text-2xl text-amber-500 animate-spin mx-auto mb-2" />
                        <span class="text-[10px] text-gray-500 font-mono">LOADING_DATA...</span>
                    </div>
                    
                    <div v-else-if="cartStore.items.length === 0" class="p-12 text-center text-gray-400">
                        <Icon icon="mdi:cart-off" class="text-4xl mb-3 opacity-30 mx-auto" />
                        <p class="text-xs font-mono">NO ITEMS DETECTED</p>
                    </div>

                    <div v-else class="divide-y divide-gray-100">
                        <div 
                            v-for="item in cartStore.items" 
                            :key="item.id"
                            class="p-4 flex gap-4 hover:bg-gray-50/50 transition-colors group relative"
                        >
                            <!-- Product Image -->
                            <div class="w-14 h-14 rounded bg-white border border-gray-200 p-1 flex-shrink-0 flex items-center justify-center">
                                <img 
                                    v-if="item.component?.ImageUrl" 
                                    :src="item.component.ImageUrl" 
                                    :alt="item.component?.name"
                                    class="w-full h-full object-contain mix-blend-multiply"
                                >
                                <Icon v-else icon="mdi:chip" class="text-gray-400" />
                            </div>

                            <!-- Product Info -->
                            <div class="flex-1 min-w-0">
                                <h4 class="text-xs font-bold text-gray-900 truncate" :title="item.component?.name">
                                    {{ item.component?.name }}
                                </h4>
                                <div class="flex items-center justify-between mt-1">
                                    <span class="text-[10px] text-gray-500 font-mono">{{ item.quantity }} × ${{ item.unitPrice }}</span>
                                    <span class="text-xs font-bold text-amber-600 font-mono">${{ (item.quantity * item.unitPrice).toFixed(2) }}</span>
                                </div>
                            </div>

                            <!-- Remove Button (Absolute) -->
                            <button 
                                @click="handleRemoveItem(item.id)"
                                class="absolute top-2 right-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all p-1"
                                title="Remove Item"
                            >
                                <Icon icon="mdi:close" class="text-xs" />
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Footer -->
                <div v-if="cartStore.items.length > 0" class="p-4 border-t border-gray-100 bg-gray-50/80">
                    <div class="flex items-end justify-between mb-4">
                        <span class="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Estimated Total</span>
                        <span class="text-lg font-black text-gray-900 font-mono tracking-tight">
                            ${{ Number(cartStore.totalAmount).toFixed(2) }}
                        </span>
                    </div>
                    
                    <button 
                        @click="goToCheckout" 
                        class="w-full bg-amber-400 text-white font-bold py-3 px-4 rounded-xl hover:bg-amber-500 transition-colors flex items-center justify-center gap-2 text-xs uppercase tracking-wider shadow-sm"
                    >
                        <span>Proceed to Checkout</span>
                        <Icon icon="mdi:arrow-right" class="text-sm" />
                    </button>
                </div>
            </div>
        </Transition>
    </div>
</template>

<style scoped>
.dropdown-enter-active,
.dropdown-leave-active {
    transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}
.dropdown-enter-from,
.dropdown-leave-to {
    opacity: 0;
    transform: translateY(10px) scale(0.95);
}
</style>
