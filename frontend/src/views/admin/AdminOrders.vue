<script setup>
import { ref, computed, onMounted } from 'vue';
import { Icon } from '@iconify/vue';
import TopBar from '@/components/admin/TopBar.vue';
import { useAdminStore } from '@/stores/admin';

const adminStore = useAdminStore();
const expandedOrderId = ref(null);
const searchQuery = ref('');

onMounted(async () => {
    await adminStore.fetchOrders();
});

const toggleOrder = (id) => {
    expandedOrderId.value = expandedOrderId.value === id ? null : id;
};

const filteredOrders = computed(() => {
    if (!searchQuery.value.trim()) return adminStore.orders;
    const q = searchQuery.value.toLowerCase();
    return adminStore.orders.filter(order => {
        const customerName = `${order.user?.firstName || ''} ${order.user?.lastName || ''}`.toLowerCase();
        const email = (order.user?.email || '').toLowerCase();
        const orderId = String(order.id);
        return customerName.includes(q) || email.includes(q) || orderId.includes(q);
    });
});

const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

const formatPrice = (price) => {
    return Number(price).toFixed(2);
};
</script>

<template>
    <div class="min-h-screen bg-gray-50 font-sans text-gray-900">
        <TopBar />

        <main class="max-w-[1400px] mx-auto p-6 space-y-8">

            <!-- Header and Controls -->
            <div class="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h2 class="text-4xl font-black tracking-tighter text-gray-900 mb-2" style="font-family: 'Outfit', sans-serif;">
                        ORDER LOGS
                    </h2>
                    <div class="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-widest" style="font-family: 'JetBrains Mono', monospace;">
                        <span class="text-amber-600">System Database</span>
                        <span>//</span>
                        <span>{{ adminStore.orders.length }} Records Found</span>
                    </div>
                </div>

                <!-- Search Bar -->
                <div class="relative w-full md:w-96 group">
                    <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Icon icon="mdi:magnify" class="text-gray-400 group-focus-within:text-amber-600 transition-colors" />
                    </div>
                    <input
                        v-model="searchQuery"
                        type="text"
                        placeholder="SEARCH_QUERY: name, email, id..."
                        class="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all shadow-sm text-gray-900 placeholder-gray-400"
                    />
                    <div class="absolute inset-y-0 right-2 flex items-center">
                        <div class="px-2 py-1 bg-gray-100 rounded text-[10px] text-gray-400 font-mono">/</div>
                    </div>
                </div>
            </div>

            <!-- Loading -->
            <div v-if="adminStore.isLoading" class="flex flex-col items-center justify-center p-20 space-y-4">
                <Icon icon="eos-icons:loading" class="text-5xl text-amber-500 animate-spin" />
                <p class="text-xs font-mono text-gray-500 animate-pulse">FETCHING_DATA...</p>
            </div>

            <!-- Empty State -->
            <div v-else-if="filteredOrders.length === 0" class="flex flex-col items-center justify-center py-24 border-2 border-dashed border-gray-200 rounded-3xl">
                <div class="p-4 bg-gray-100 rounded-full mb-4">
                    <Icon icon="mdi:database-off" class="text-4xl text-gray-400" />
                </div>
                <p class="text-lg font-bold text-gray-900" style="font-family: 'Outfit', sans-serif;">NO RECORDS FOUND</p>
                <p class="text-sm text-gray-500 font-mono mt-1">Adjust search parameters</p>
            </div>

            <!-- Orders List -->
            <div v-else class="grid gap-4">
                <div
                    v-for="order in filteredOrders"
                    :key="order.id"
                    class="bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-amber-500/30 transition-all duration-300 group shadow-sm hover:shadow-md"
                    :class="{'ring-2 ring-amber-500/20 border-amber-500/50': expandedOrderId === order.id}"
                >
                    <!-- Order Header / Summary Row -->
                    <button
                        @click="toggleOrder(order.id)"
                        class="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                    >
                        <div class="flex items-center gap-6">
                            <!-- ID Badge -->
                            <div class="hidden sm:flex flex-col items-center justify-center h-12 w-16 bg-gray-50 rounded-lg border border-gray-200">
                                <span class="text-[10px] text-gray-400 font-mono">ID</span>
                                <span class="text-sm font-bold font-mono text-gray-900">#{{ order.id }}</span>
                            </div>

                            <!-- Customer Info -->
                            <div class="flex items-center gap-4 text-left">
                                <div class="h-10 w-10 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-orange-500/20">
                                    {{ order.user?.firstName?.charAt(0) || '?' }}
                                </div>
                                <div>
                                    <h3 class="font-bold text-gray-900 text-sm">
                                        {{ order.user?.firstName }} {{ order.user?.lastName }}
                                    </h3>
                                    <p class="text-xs text-gray-500 font-mono">
                                        {{ order.user?.email }}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <!-- Right Stats -->
                        <div class="flex items-center gap-8">
                            <!-- Date & Status -->
                            <div class="text-right hidden md:block">
                                <div class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 border border-emerald-100 text-emerald-600 text-[10px] font-bold uppercase tracking-wider mb-1">
                                    <div class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                                    PAYMENT_VERIFIED
                                </div>
                                <p class="text-xs text-gray-400 font-mono">{{ formatDate(order.createdAt) }}</p>
                            </div>

                            <!-- Amount -->
                            <div class="text-right w-24">
                                <span class="text-xs text-gray-400 uppercase font-bold tracking-wider block mb-0.5">Total</span>
                                <span class="text-lg font-black text-gray-900 font-mono">
                                    ${{ formatPrice(order.totalAmount) }}
                                </span>
                            </div>

                            <!-- Expand Icon -->
                            <div class="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center transition-transform duration-300 text-gray-500"
                                :class="{'rotate-180 bg-amber-100 text-amber-600': expandedOrderId === order.id}">
                                <Icon icon="mdi:chevron-down" />
                            </div>
                        </div>
                    </button>

                    <!-- Expanded Details -->
                    <div
                        v-show="expandedOrderId === order.id"
                        class="border-t border-gray-100 bg-gray-50/50"
                    >
                        <!-- Items Grid -->
                        <div class="p-4 grid gap-2">
                            <div class="flex items-center justify-between px-4 py-2 text-[10px] font-bold uppercase text-gray-400 tracking-wider">
                                <span>Component Manifest</span>
                                <span>Valuation</span>
                            </div>
                            
                            <div
                                v-for="item in order.items"
                                :key="item.id"
                                class="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg hover:border-amber-500/30 transition-colors shadow-sm"
                            >
                                <div class="flex items-center gap-4">
                                    <div class="h-10 w-10 bg-gray-50 rounded flex items-center justify-center p-1 border border-gray-100">
                                        <img
                                            v-if="item.component?.ImageUrl"
                                            :src="item.component.ImageUrl"
                                            class="w-full h-full object-contain"
                                        />
                                        <Icon v-else icon="mdi:chip" class="text-gray-300" />
                                    </div>
                                    <div>
                                        <p class="text-sm font-bold text-gray-900">{{ item.component?.name }}</p>
                                        <p class="text-xs text-gray-500 font-mono">QTY: {{ item.quantity }} × ${{ formatPrice(item.unitPrice) }}</p>
                                    </div>
                                </div>
                                <div class="font-mono font-bold text-gray-900">
                                    ${{ formatPrice(item.unitPrice * item.quantity) }}
                                </div>
                            </div>
                        </div>

                        <!-- Footer Actions -->
                        <div class="p-4 border-t border-gray-200 flex justify-end gap-3 bg-white">
                            <button class="px-4 py-2 text-xs font-bold uppercase tracking-wider text-gray-500 hover:text-gray-900 transition-colors flex items-center gap-2 border border-gray-200 rounded-lg hover:bg-gray-50">
                                <Icon icon="mdi:printer" />
                                Print Invoice
                            </button>
                            <button class="px-4 py-2 bg-gray-900 text-white rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-2 hover:bg-gray-800 transition-colors shadow-lg shadow-gray-900/10">
                                <Icon icon="mdi:email-outline" />
                                Contact Customer
                            </button>
                        </div>
                    </div>
                </div>
            </div>

        </main>
    </div>
</template>
