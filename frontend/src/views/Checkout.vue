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
        alert('Transaction failed: ' + result.error);
    }
};

const goHome = () => {
    router.push('/');
};
</script>

<template>
    <div class="min-h-screen bg-gray-50 font-sans text-gray-900 antialiased selection:bg-amber-500 selection:text-white">
        
        <!-- Header -->
        <header class="sticky top-0 z-50 w-full backdrop-blur-xl border-b border-gray-200 bg-white/80">
            <div class="max-w-5xl mx-auto px-6 h-20 flex items-center justify-between">
                <button @click="goBack" class="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors group">
                    <Icon icon="mdi:arrow-left" class="text-xl group-hover:-translate-x-1 transition-transform" />
                    <span class="text-sm font-bold uppercase tracking-wider">Return to Catalog</span>
                </button>
                <div class="flex items-center gap-3">
                    <Icon icon="mdi:secure" class="text-amber-600" />
                    <span class="text-sm font-mono text-gray-400">SECURE CHECKOUT</span>
                </div>
            </div>
        </header>

        <main class="max-w-5xl mx-auto p-6 py-12">
            
            <!-- Order Complete State -->
            <div v-if="orderComplete" class="flex flex-col items-center justify-center py-12 text-center animate-in zoom-in-95 duration-500">
                <div class="relative w-32 h-32 mb-8">
                    <div class="absolute inset-0 bg-emerald-500/20 rounded-full blur-xl animate-pulse"></div>
                    <div class="relative w-full h-full bg-white rounded-full border-2 border-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                        <Icon icon="mdi:check-bold" class="text-6xl text-emerald-500" />
                    </div>
                </div>
                
                <h2 class="text-4xl font-black text-gray-900 mb-2 tracking-tight" style="font-family: 'Outfit', sans-serif;">ORDER CONFIRMED</h2>
                <p class="text-gray-500 font-mono mb-8 uppercase tracking-widest">Transaction ID: #{{ completedOrder?.id }}</p>
                
                <div class="bg-white border-l-4 border-amber-500 p-6 rounded-r-xl max-w-md mx-auto mb-10 text-left shadow-md border border-gray-100">
                    <div class="flex items-start gap-4">
                        <Icon icon="mdi:cash-multiple" class="text-2xl text-amber-600 mt-1" />
                        <div>
                            <h3 class="font-bold text-gray-900 uppercase text-sm mb-1">Payment Pending</h3>
                            <p class="text-xs text-gray-500 leading-relaxed">
                                Please prepare the exact amount of <span class="text-gray-900 font-bold font-mono">${{ completedOrder?.totalAmount }}</span> for the courier service upon delivery.
                            </p>
                        </div>
                    </div>
                </div>

                <div class="flex items-center gap-4">
                    <button @click="goHome" class="px-8 py-3 bg-white text-gray-900 border border-gray-200 font-bold uppercase tracking-wider rounded-xl hover:bg-gray-50 transition-colors shadow-sm">
                        Return Home
                    </button>
                    <button @click="goBack" class="px-8 py-3 bg-white text-gray-900 border border-gray-200 font-bold uppercase tracking-wider rounded-xl hover:bg-gray-50 transition-colors shadow-sm">
                        Continue Shopping
                    </button>
                </div>
            </div>

            <!-- Checkout Form -->
            <div v-else class="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                <!-- Main Invoice Area -->
                <div class="lg:col-span-8 space-y-6">
                    <div class="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xl shadow-gray-200/50">
                        
                        <!-- Header -->
                        <div class="p-6 border-b border-gray-200 bg-gray-50/50 flex justify-between items-center">
                            <h2 class="text-xl font-bold text-gray-900 tracking-tight" style="font-family: 'Outfit', sans-serif;">INVOICE SUMMARY</h2>
                             <div class="px-3 py-1 rounded bg-white border border-gray-200 text-[10px] font-mono text-gray-400">
                                {{ new Date().toLocaleDateString() }}
                            </div>
                        </div>

                        <!-- Content -->
                        <div v-if="cartStore.isLoading" class="p-20 text-center">
                            <Icon icon="eos-icons:loading" class="text-4xl text-amber-500 animate-spin mx-auto mb-4" />
                            <p class="text-xs font-mono text-gray-500">CALCULATING_METRICS...</p>
                        </div>

                        <div v-else-if="cartStore.items.length === 0" class="p-20 text-center border-b border-gray-200">
                            <Icon icon="mdi:cart-off" class="text-5xl text-gray-300 mb-4" />
                            <p class="text-gray-400 font-mono text-sm mb-6">CART_EMPTY</p>
                            <button @click="goBack" class="px-6 py-2 bg-gray-100 text-gray-600 text-xs font-bold uppercase rounded-lg hover:bg-gray-200 transition-colors">Initialize Order</button>
                        </div>

                        <div v-else>
                            <div class="divide-y divide-gray-100 text-sm">
                                <!-- Table Header -->
                                <div class="grid grid-cols-12 gap-4 px-6 py-3 bg-gray-50 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-200">
                                    <div class="col-span-6">Item Description</div>
                                    <div class="col-span-2 text-center">Qty</div>
                                    <div class="col-span-4 text-right">Subtotal</div>
                                </div>

                                <!-- Items -->
                                <div 
                                    v-for="item in cartStore.items" 
                                    :key="item.id"
                                    class="grid grid-cols-12 gap-4 px-6 py-4 items-center group hover:bg-gray-50/50 transition-colors"
                                >
                                    <!-- Description -->
                                    <div class="col-span-6 flex items-center gap-4">
                                        <div class="w-12 h-12 rounded bg-white border border-gray-200 p-1 flex items-center justify-center flex-shrink-0">
                                            <img v-if="item.component?.ImageUrl" :src="item.component.ImageUrl" class="w-full h-full object-contain mix-blend-multiply" />
                                            <Icon v-else icon="mdi:chip" class="text-gray-400" />
                                        </div>
                                        <div>
                                            <p class="font-bold text-gray-900">{{ item.component?.name }}</p>
                                            <p class="text-[10px] text-gray-500 font-mono uppercase">{{ item.component?.brand }}</p>
                                        </div>
                                    </div>

                                    <!-- Qty -->
                                    <div class="col-span-2 text-center font-mono text-gray-500">
                                        x{{ item.quantity }}
                                    </div>

                                    <!-- Price -->
                                    <div class="col-span-4 text-right font-mono font-bold text-gray-900">
                                        ${{ (item.quantity * item.unitPrice).toFixed(2) }}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Summary & Payment -->
                <div class="lg:col-span-4 space-y-6">
                    <div class="bg-white border border-gray-200 rounded-2xl p-6 shadow-xl shadow-gray-200/50 sticky top-24">
                        <h3 class="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6">Payment Details</h3>
                        
                        <div class="space-y-4 mb-8">
                            <div class="flex justify-between text-sm">
                                <span class="text-gray-500">Subtotal</span>
                                <span class="text-gray-900 font-mono">${{ Number(cartStore.totalAmount).toFixed(2) }}</span>
                            </div>
                            <div class="flex justify-between text-sm">
                                <span class="text-gray-500">Taxes (Est.)</span>
                                <span class="text-gray-900 font-mono">$0.00</span>
                            </div>
                            <div class="flex justify-between text-sm">
                                <span class="text-gray-500">Shipping</span>
                                <span class="text-emerald-600 font-mono font-bold">FREE</span>
                            </div>
                            <div class="h-px bg-gray-100 my-4"></div>
                            <div class="flex justify-between items-end">
                                <span class="font-bold text-gray-900">TOTAL DUE</span>
                                <span class="text-3xl font-black text-amber-600 font-mono tracking-tighter">${{ Number(cartStore.totalAmount).toFixed(2) }}</span>
                            </div>
                        </div>

                        <button 
                            @click="handlePay"
                            :disabled="isProcessing || cartStore.items.length === 0"
                            class="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white font-bold rounded-xl shadow-lg hover:shadow-orange-500/25 transition-all text-sm uppercase tracking-wider flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <span v-if="!isProcessing">Confirm Transaction</span>
                            <Icon v-if="!isProcessing" icon="mdi:arrow-right" class="group-hover:translate-x-1 transition-transform" />
                            
                            <div v-else class="flex items-center gap-2">
                                <Icon icon="eos-icons:loading" class="animate-spin text-lg" />
                                <span>PROCESSING...</span>
                            </div>
                        </button>
                        
                        <p class="text-[10px] text-center text-gray-400 mt-4 leading-relaxed">
                            By confirming, you agree to the Terms of Service. Payment is collected securely upon delivery by our authorized logistics partners.
                        </p>
                    </div>
                </div>

            </div>
        </main>
    </div>
</template>
