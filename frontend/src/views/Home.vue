<script setup>
import { onMounted } from 'vue';
import { useCatalogStore } from '@/stores/catalog';
import { useAuthStore } from '@/stores/auth';
import { useCartStore } from '@/stores/cart';
import { useRouter } from 'vue-router';
import { Icon } from '@iconify/vue';
import ProductCard from '@/UI-elements/as_Inspira/ProductCard.vue';
import Button from '@/UI-elements/as_Inspira/Button.vue';
import CartDropdown from '@/components/cart/CartDropdown.vue';
import AddToCartModal from '@/components/cart/AddToCartModal.vue';

const catalogStore = useCatalogStore();
const authStore = useAuthStore();
const cartStore = useCartStore();
const router = useRouter();

onMounted(async () => {
    await catalogStore.initHome();
    // Fetch cart if logged in
    if (authStore.token) {
        cartStore.fetchCart();
    }
});

const handleCategoryClick = (id) => {
    catalogStore.fetchByCategory(id);
};

const handleProductClick = (item) => {
    // Future: navigate to product details page
    console.log('Product clicked:', item.name);
};

const handleAddToCart = async (item) => {
    // Check if user is logged in
    if (!authStore.token) {
        // Store intended action and redirect to login
        router.push('/login');
        return;
    }

    // Add to cart
    const result = await cartStore.addToCart(item.id);
    if (result.success) {
        // Show success modal
        cartStore.showModal(item);
    } else {
        alert('Failed to add to cart: ' + result.error);
    }
};

// Helper to check if a category is selected
const isSelected = (id) => catalogStore.selectedCategoryId === id;

const handleLogout = () => {
    authStore.logout();
    router.push('/login');
};
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
                <!-- PC Builder Links -->
                <router-link to="/builder">
                    <Button variant="ghost" size="sm">
                        <Icon icon="mdi:hammer-wrench" class="mr-1" />
                        Build PC
                    </Button>
                </router-link>
                <router-link to="/saved-builds" v-if="authStore.token && authStore.user?.role === 'Customer'">
                    <Button variant="ghost" size="sm">
                        <Icon icon="mdi:folder-heart" class="mr-1" />
                        My Builds
                    </Button>
                </router-link>

                <!-- Cart Icon (for logged in users) -->
                <CartDropdown v-if="authStore.token" />

                <template v-if="authStore.user">
                    <div class="hidden sm:flex items-center gap-2">
                        <div class="h-8 w-8 rounded-full bg-yellow-100 dark:bg-yellow-900/50 flex items-center justify-center text-yellow-600 dark:text-yellow-400 font-bold text-sm">
                            {{ authStore.user.firstName?.charAt(0) || 'U' }}
                        </div>
                        <span class="text-sm font-medium">{{ authStore.user.firstName }}</span>
                    </div>
                    <router-link to="/admin" v-if="authStore.user.role === 'Admin'">
                        <Button size="sm">Dashboard</Button>
                    </router-link>
                    <Button v-else size="sm" variant="ghost" @click="handleLogout">
                        <Icon icon="mdi:logout" class="mr-1" />
                        Logout
                    </Button>
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

    <main class="max-w-7xl mx-auto p-6 space-y-12 py-8">
        
        <!-- Hero Section -->
        <section class="text-center space-y-4 py-6">
            <h1 class="text-4xl md:text-5xl font-extrabold tracking-tight">
                Upgrade Your <span class="text-yellow-500">Battlestation</span>
            </h1>
            <p class="text-lg text-gray-500 max-w-2xl mx-auto">
                Premium components for the ultimate gaming experience.
            </p>
        </section>

        <!-- Section 1: New Arrivals -->
        <section>
            <div class="flex items-center gap-3 mb-4">
                 <Icon icon="mdi:sparkles" class="text-yellow-500 text-xl" />
                <h2 class="text-xl font-bold">New Arrivals</h2>
            </div>
            
            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                 <ProductCard 
                    v-for="item in catalogStore.recentProducts" 
                    :key="item.id"
                    :name="item.name"
                    :brand="item.brand"
                    :price="item.price"
                    :stock="item.stock"
                    :category="item.category?.name || 'Unknown'"
                    :image-url="item.ImageUrl"
                    @click="handleProductClick(item)"
                    @add-to-cart="handleAddToCart(item)"
                />
            </div>
             <div v-if="catalogStore.recentProducts.length === 0" class="text-center py-8 text-gray-500">
                No new arrivals yet.
            </div>
        </section>

        <!-- Section 2: Shop by Category -->
        <section class="bg-white dark:bg-zinc-900/50 p-6 rounded-2xl border border-gray-100 dark:border-zinc-800/50">
            <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div class="flex items-center gap-3">
                     <Icon icon="mdi:filter-variant" class="text-yellow-500 text-xl" />
                    <h2 class="text-xl font-bold">Shop by Category</h2>
                </div>
                
                <!-- Category Pills -->
                <div class="flex flex-wrap gap-2">
                    <button 
                        v-for="cat in catalogStore.categories" 
                        :key="cat.id"
                        @click="handleCategoryClick(cat.id)"
                        class="px-3 py-1.5 rounded-full text-xs font-medium transition-all"
                        :class="isSelected(cat.id) ? 'bg-yellow-500 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-zinc-800 dark:text-gray-300'"
                    >
                        {{ cat.name }}
                    </button>
                </div>
            </div>

            <!-- Filtered Grid -->
             <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                 <ProductCard 
                    v-for="item in catalogStore.categoryProducts" 
                    :key="item.id"
                    :name="item.name"
                    :brand="item.brand"
                    :price="item.price"
                    :stock="item.stock"
                    :category="item.category?.name || 'Unknown'"
                    :image-url="item.ImageUrl"
                    @click="handleProductClick(item)"
                    @add-to-cart="handleAddToCart(item)"
                />
            </div>
             <div v-if="catalogStore.categoryProducts.length === 0" class="text-center py-8 text-gray-500">
                Select a category to view products.
            </div>
        </section>

        <!-- Section 3: All Products -->
        <section>
            <div class="flex items-center gap-3 mb-4">
                 <Icon icon="mdi:view-grid" class="text-yellow-500 text-xl" />
                <h2 class="text-xl font-bold">All Products</h2>
            </div>

             <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                 <ProductCard 
                    v-for="item in catalogStore.allProducts" 
                    :key="item.id"
                    :name="item.name"
                    :brand="item.brand"
                    :price="item.price"
                    :stock="item.stock"
                    :category="item.category?.name || 'Unknown'"
                    :image-url="item.ImageUrl"
                    @click="handleProductClick(item)"
                    @add-to-cart="handleAddToCart(item)"
                />
            </div>
        </section>

    </main>

    <!-- Footer -->
    <footer class="bg-white dark:bg-zinc-950 border-t border-gray-200 dark:border-zinc-900 py-8 mt-8">
        <div class="max-w-7xl mx-auto px-6 text-center text-gray-500 text-sm">
            <p>&copy; {{ new Date().getFullYear() }} Build Master. All rights reserved.</p>
        </div>
    </footer>

    <!-- Add to Cart Modal -->
    <AddToCartModal />

  </div>
</template>

