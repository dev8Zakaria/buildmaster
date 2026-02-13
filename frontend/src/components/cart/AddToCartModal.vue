<script setup>
import { Icon } from '@iconify/vue';
import { useCartStore } from '@/stores/cart';
import { useRouter } from 'vue-router';

const cartStore = useCartStore();
const router = useRouter();

const continueShopping = () => {
    cartStore.hideModal();
};

const goToCheckout = () => {
    cartStore.hideModal();
    router.push('/checkout');
};
</script>

<template>
    <Teleport to="body">
        <Transition name="fade">
            <div 
                v-if="cartStore.showAddedModal" 
                class="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                @click.self="continueShopping"
            >
                <Transition name="scale">
                    <div 
                        v-if="cartStore.showAddedModal"
                        class="bg-white w-full max-w-sm rounded-2xl border border-gray-100 shadow-2xl relative overflow-hidden"
                    >
                        <!-- Top Accent Line -->
                        <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-green-400"></div>

                        <!-- Content -->
                        <div class="p-6 text-center" v-if="cartStore.lastAddedProduct">
                            
                            <!-- Success Icon -->
                            <div class="relative w-16 h-16 mx-auto mb-4">
                                <div class="absolute inset-0 bg-emerald-500/20 rounded-full blur animate-pulse"></div>
                                <div class="relative w-full h-full bg-emerald-50 rounded-full border border-emerald-200 flex items-center justify-center text-emerald-600">
                                    <Icon icon="mdi:check-bold" class="text-2xl" />
                                </div>
                            </div>
                            
                            <h2 class="text-xl font-black text-gray-900 mb-1 tracking-tight" style="font-family: 'Outfit', sans-serif;">ITEM SECURED</h2>
                            <p class="text-[10px] text-gray-500 font-mono uppercase tracking-widest mb-6">Added to Cart Manifest</p>

                            <!-- Product Card Mini -->
                            <div class="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-6 flex items-center gap-4 text-left">
                                <div class="w-12 h-12 rounded bg-white border border-gray-100 p-1 flex-shrink-0 flex items-center justify-center">
                                    <img 
                                        v-if="cartStore.lastAddedProduct.ImageUrl || cartStore.lastAddedProduct.imageUrl" 
                                        :src="cartStore.lastAddedProduct.ImageUrl || cartStore.lastAddedProduct.imageUrl" 
                                        :alt="cartStore.lastAddedProduct.name"
                                        class="w-full h-full object-contain mix-blend-multiply"
                                    />
                                    <Icon v-else icon="mdi:chip" class="text-gray-400" />
                                </div>
                                <div class="min-w-0">
                                    <h3 class="font-bold text-gray-900 text-sm truncate">
                                        {{ cartStore.lastAddedProduct.name }}
                                    </h3>
                                    <p class="text-[10px] text-gray-500 font-mono uppercase">
                                        {{ cartStore.lastAddedProduct.brand }}
                                    </p>
                                    <p class="text-sm font-black text-amber-600 font-mono mt-0.5">
                                        ${{ cartStore.lastAddedProduct.price }}
                                    </p>
                                </div>
                            </div>

                            <!-- Actions -->
                            <div class="space-y-3">
                                <button 
                                    @click="goToCheckout" 
                                    class="w-full py-3 bg-zinc-900 text-white font-bold uppercase text-xs tracking-wider rounded-lg hover:bg-zinc-800 transition-colors shadow-lg shadow-zinc-900/10 flex items-center justify-center gap-2"
                                >
                                    <Icon icon="mdi:cart-arrow-right" class="text-lg" />
                                    Proceed to Checkout
                                </button>
                                <button 
                                    @click="continueShopping" 
                                    class="w-full py-3 text-gray-500 text-xs font-bold uppercase tracking-wider hover:text-gray-900 transition-colors"
                                >
                                    Continue Shopping
                                </button>
                            </div>

                        </div>
                    </div>
                </Transition>
            </div>
        </Transition>
    </Teleport>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

.scale-enter-active,
.scale-leave-active {
    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.scale-enter-from,
.scale-leave-to {
    opacity: 0;
    transform: scale(0.9);
}
</style>
