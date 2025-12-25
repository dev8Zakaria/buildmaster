<script setup>
import { onMounted, computed } from 'vue';
import { useCatalogStore } from '@/stores/catalog';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';
import { Icon } from '@iconify/vue';
import ProductCard from '@/UI-elements/as_Inspira/ProductCard.vue';
import Button from '@/UI-elements/as_Inspira/Button.vue';

const catalogStore = useCatalogStore();
const authStore = useAuthStore();
const router = useRouter();

onMounted(async () => {
    await catalogStore.initHome();
});

const handleCategoryClick = (id) => {
    catalogStore.fetchByCategory(id);
};

const handleProductClick = (item) => {
    // Future: navigate to product details page
    console.log('Product clicked:', item.name);
};

// Helper to check if a category is selected
const isSelected = (id) => catalogStore.selectedCategoryId === id;

</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-black font-sans text-gray-900 dark:text-gray-100">
    
    <!-- Navbar -->
    <header class="bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800 sticky top-0 z-50">
        <div class="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            <div class="flex items-center gap-2">
                 <div class="bg-yellow-500 rounded-lg p-1.5 rotate-3">
                    <Icon icon="mdi:cpu-64-bit" class="text-white text-xl" />
                 </div>
                <h1 class="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-600 to-yellow-500">
                    Build Master
                </h1>
            </div>

            <div class="flex items-center gap-4">
                <template v-if="authStore.user">
                    <span class="text-sm hidden sm:inline-block">Hi, {{ authStore.user.firstName }}</span>
                     <router-link to="/admin" v-if="authStore.user.role === 'Admin'">
                        <Button size="sm">Dashboard</Button>
                    </router-link>
                     <Button v-else size="sm" variant="outline" @click="authStore.logout(); router.push('/login')">Logout</Button>
                </template>
                <template v-else>
                    <router-link to="/login">
                        <Button variant="ghost" size="sm">Sign In</Button>
                    </router-link>
                    <router-link to="/signup">
                        <Button size="sm">Get Started</Button>
                    </router-link>
                </template>
            </div>
        </div>
    </header>

    <main class="max-w-7xl mx-auto p-6 space-y-16 py-12">
        
        <!-- Hero Section -->
        <section class="text-center space-y-4 py-8">
            <h1 class="text-5xl md:text-6xl font-extrabold tracking-tight">
                Upgrade Your <span class="text-yellow-500">Battlestation</span>
            </h1>
            <p class="text-xl text-gray-500 max-w-2xl mx-auto">
                Premium components for the ultimate gaming experience.
            </p>
        </section>

        <!-- Section 1: New Arrivals -->
        <section>
            <div class="flex items-center gap-3 mb-6">
                 <Icon icon="mdi:sparkles" class="text-yellow-500 text-2xl" />
                <h2 class="text-2xl font-bold">New Arrivals</h2>
            </div>
            
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                 <ProductCard 
                    v-for="item in catalogStore.recentProducts" 
                    :key="item.id"
                    v-bind="{
                        name: item.name,
                        brand: item.brand,
                        price: item.price,
                        stock: item.stock,
                        category: item.category?.name || 'Unknown',
                        imageUrl: item.ImageUrl
                    }"
                    @click="handleProductClick(item)"
                />
            </div>
             <div v-if="catalogStore.recentProducts.length === 0" class="text-center py-8 text-gray-500">
                No new arrivals yet.
            </div>
        </section>

        <!-- Section 2: Shop by Category -->
        <section class="bg-white dark:bg-zinc-900/50 p-8 rounded-3xl border border-gray-100 dark:border-zinc-800/50">
            <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                <div class="flex items-center gap-3">
                     <Icon icon="mdi:filter-variant" class="text-yellow-500 text-2xl" />
                    <h2 class="text-2xl font-bold">Shop by Category</h2>
                </div>
                
                <!-- Category Pills -->
                <div class="flex flex-wrap gap-2">
                    <button 
                        v-for="cat in catalogStore.categories" 
                        :key="cat.id"
                        @click="handleCategoryClick(cat.id)"
                        class="px-4 py-2 rounded-full text-sm font-medium transition-all"
                        :class="isSelected(cat.id) ? 'bg-yellow-500 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-zinc-800 dark:text-gray-300'"
                    >
                        {{ cat.name }}
                    </button>
                </div>
            </div>

            <!-- Filtered Grid -->
             <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                 <ProductCard 
                    v-for="item in catalogStore.categoryProducts" 
                    :key="item.id"
                     v-bind="{
                        name: item.name,
                        brand: item.brand,
                        price: item.price,
                        stock: item.stock,
                        category: item.category?.name || 'Unknown',
                        imageUrl: item.ImageUrl
                    }"
                    @click="handleProductClick(item)"
                />
            </div>
             <div v-if="catalogStore.categoryProducts.length === 0" class="text-center py-12 text-gray-500">
                select a category to view products.
            </div>
        </section>

        <!-- Section 3: All Products -->
        <section>
            <div class="flex items-center gap-3 mb-6">
                 <Icon icon="mdi:view-grid" class="text-yellow-500 text-2xl" />
                <h2 class="text-2xl font-bold">All Products</h2>
            </div>

             <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                 <ProductCard 
                    v-for="item in catalogStore.allProducts" 
                    :key="item.id"
                     v-bind="{
                        name: item.name,
                        brand: item.brand,
                        price: item.price,
                        stock: item.stock,
                        category: item.category?.name || 'Unknown',
                        imageUrl: item.ImageUrl
                    }"
                    @click="handleProductClick(item)"
                />
            </div>
        </section>

    </main>

    <!-- Footer -->
    <footer class="bg-white dark:bg-zinc-950 border-t border-gray-200 dark:border-zinc-900 py-12 mt-12">
        <div class="max-w-7xl mx-auto px-6 text-center text-gray-500 text-sm">
            <p>&copy; {{ new Date().getFullYear() }} Build Master. All rights reserved.</p>
        </div>
    </footer>

  </div>
</template>
