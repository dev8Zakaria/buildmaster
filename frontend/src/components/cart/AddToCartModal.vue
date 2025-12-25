<script setup>
import { Icon } from '@iconify/vue';
import Button from '@/UI-elements/as_Inspira/Button.vue';
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
                        class="bg-white dark:bg-zinc-900 w-full max-w-md rounded-2xl shadow-2xl border border-gray-100 dark:border-zinc-800 overflow-hidden"
                    >
                        <!-- Header -->
                        <div class="bg-green-50 dark:bg-green-900/20 p-6 text-center border-b border-green-100 dark:border-green-900/30">
                            <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/40 mb-4">
                                <Icon icon="mdi:check-circle" class="text-4xl text-green-600 dark:text-green-400" />
                            </div>
                            <h2 class="text-xl font-bold text-green-800 dark:text-green-300">Added to Cart!</h2>
                        </div>

                        <!-- Product Info -->
                        <div class="p-6" v-if="cartStore.lastAddedProduct">
                            <div class="flex items-center gap-4">
                                <div class="w-20 h-20 rounded-lg bg-gray-100 dark:bg-zinc-800 overflow-hidden flex-shrink-0 p-2">
                                    <img 
                                        v-if="cartStore.lastAddedProduct.ImageUrl || cartStore.lastAddedProduct.imageUrl" 
                                        :src="cartStore.lastAddedProduct.ImageUrl || cartStore.lastAddedProduct.imageUrl" 
                                        :alt="cartStore.lastAddedProduct.name"
                                        class="w-full h-full object-contain"
                                    />
                                    <Icon v-else icon="mdi:image-off" class="w-full h-full text-gray-400" />
                                </div>
                                <div class="flex-1 min-w-0">
                                    <h3 class="font-semibold text-gray-900 dark:text-white truncate">
                                        {{ cartStore.lastAddedProduct.name }}
                                    </h3>
                                    <p class="text-sm text-gray-500 dark:text-gray-400">
                                        {{ cartStore.lastAddedProduct.brand }}
                                    </p>
                                    <p class="text-lg font-bold text-yellow-600 dark:text-yellow-400 mt-1">
                                        ${{ cartStore.lastAddedProduct.price }}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <!-- Actions -->
                        <div class="p-6 pt-0 flex flex-col gap-3">
                            <Button 
                                @click="goToCheckout" 
                                class="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold"
                            >
                                <Icon icon="mdi:cart-arrow-right" class="mr-2" />
                                Order Now
                            </Button>
                            <Button 
                                @click="continueShopping" 
                                variant="ghost" 
                                class="w-full"
                            >
                                Continue Shopping
                            </Button>
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
    transition: all 0.2s ease;
}
.scale-enter-from,
.scale-leave-to {
    opacity: 0;
    transform: scale(0.95);
}
</style>
