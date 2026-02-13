<script setup>
import { onMounted } from 'vue';
import { useCatalogStore } from '@/stores/catalog';
import { useAuthStore } from '@/stores/auth';
import { useCartStore } from '@/stores/cart';
import { useRouter } from 'vue-router';
import { Icon } from '@iconify/vue';
import ProductCard from '@/UI-elements/as_Inspira/ProductCard.vue';
import CartDropdown from '@/components/cart/CartDropdown.vue';
import AddToCartModal from '@/components/cart/AddToCartModal.vue';
import InteractiveGridPattern from '@/UI-elements/Inspira/background.vue';

const catalogStore = useCatalogStore();
const authStore = useAuthStore();
const cartStore = useCartStore();
const router = useRouter();

onMounted(async () => {
    await catalogStore.initHome();
    if (authStore.token) {
        await cartStore.fetchCart();
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
    if (!authStore.token) {
        router.push('/login');
        return;
    }
    const result = await cartStore.addToCart(item.id);
    if (result.success) {
        cartStore.showModal(item);
    } else {
        alert('Failed to add to cart: ' + result.error);
    }
};

const isSelected = (id) => catalogStore.selectedCategoryId === id;

const handleLogout = () => {
    authStore.logout();
    router.push('/login');
};
</script>

<template>
  <div class="min-h-screen bg-gray-50 text-gray-900 font-sans antialiased relative overflow-hidden selection:bg-amber-500 selection:text-white">
    
    <!-- Background Grid Pattern (UNTOUCHED as requested) -->
    <div class="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      <InteractiveGridPattern :width="50" :height="50" :squares="[80, 100]" class="opacity-60" />
    </div>
    
    <!-- Navbar -->
    <header class="sticky top-0 z-50 w-full backdrop-blur-xl border-b border-gray-200/50 bg-white/70">
        <div class="max-w-[1600px] mx-auto px-6 h-20 flex items-center justify-between">
            <!-- Brand -->
            <router-link to="/" class="flex items-center gap-3 group">
                <div class="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 shadow-lg shadow-orange-500/20 group-hover:scale-105 transition-transform duration-300">
                    <Icon icon="mdi:cpu-64-bit" class="text-white text-xl" />
                    <div class="absolute inset-0 rounded-xl ring-1 ring-white/20"></div>
                </div>
                <div>
                    <h1 class="text-xl font-black tracking-tight leading-none text-gray-900" style="font-family: 'Outfit', sans-serif;">
                        BUILD<span class="text-amber-500">MASTER</span>
                    </h1>
                    <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest" style="font-family: 'JetBrains Mono', monospace;">
                        Premium Hardware
                    </p>
                </div>
            </router-link>

            <!-- Navigation Actions -->
            <div class="flex items-center gap-6">
                
                <!-- Tools -->
                <div class="hidden md:flex items-center gap-2">
                    <router-link to="/builder" class="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold text-gray-600 hover:text-amber-600 hover:bg-amber-50 transition-all group">
                        <Icon icon="mdi:hammer-wrench" class="text-lg group-hover:rotate-12 transition-transform" />
                        <span style="font-family: 'Outfit', sans-serif;">PC_BUILDER</span>
                    </router-link>
                    
                    <template v-if="authStore.token && authStore.user?.role === 'Customer'">
                        <div class="w-px h-6 bg-gray-200 mx-2"></div>
                        <router-link to="/saved-builds" class="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold text-gray-600 hover:text-amber-600 hover:bg-amber-50 transition-all">
                            <Icon icon="mdi:folder-heart" class="text-lg" />
                            <span style="font-family: 'Outfit', sans-serif;">SAVED_LAYOUTS</span>
                        </router-link>
                    </template>
                </div>

                <!-- Cart -->
                <CartDropdown v-if="authStore.token" />

                <!-- User Profile -->
                <template v-if="authStore.user">
                    <div class="flex items-center gap-4 pl-6 border-l border-gray-200">
                        <div class="hidden sm:block text-right">
                            <p class="text-sm font-bold text-gray-900 leading-none">{{ authStore.user.firstName }}</p>
                            <p class="text-[10px] font-mono text-gray-400 uppercase tracking-wider">Online</p>
                        </div>
                        
                        <div class="relative group cursor-pointer">
                            <div class="h-10 w-10 rounded-xl bg-gray-100 flex items-center justify-center border border-gray-200 text-gray-600 font-bold group-hover:border-amber-500 group-hover:text-amber-500 transition-colors">
                                {{ authStore.user.firstName?.charAt(0) }}
                            </div>
                            <!-- Dropdown/Logout could go here, for now just a Logout button next to it -->
                        </div>

                        <router-link to="/admin" v-if="authStore.user.role === 'Admin'">
                            <button class="px-4 py-2 bg-amber-400 text-white text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-amber-500 transition-colors shadow-sm">
                                Dashboard
                            </button>
                        </router-link>
                        <button v-else @click="handleLogout" class="p-2 text-gray-400 hover:text-red-500 transition-colors" title="Logout">
                            <Icon icon="mdi:logout" class="text-xl" />
                        </button>
                    </div>
                </template>

                <!-- Auth Buttons -->
                <template v-else>
                    <div class="flex items-center gap-3 pl-4 border-l border-gray-200">
                        <router-link to="/login" class="px-5 py-2 text-sm font-bold text-gray-600 hover:text-gray-900 font-mono">
                            LOGIN
                        </router-link>
                        <router-link to="/signup" class="px-6 py-2.5 bg-amber-400 text-white text-sm font-bold rounded-lg hover:bg-amber-500 transition-all shadow-sm flex items-center gap-2 group">
                            <span>INITIALIZE</span>
                            <Icon icon="mdi:arrow-right" class="group-hover:translate-x-1 transition-transform" />
                        </router-link>
                    </div>
                </template>
            </div>
        </div>
    </header>

    <main class="max-w-[1600px] mx-auto px-8 md:px-16 lg:px-20 xl:px-24 py-12 space-y-16 relative z-10">
        
        <!-- Hero Section - Compact -->
        <section class="text-center space-y-3 py-4">
            <div class="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 border border-amber-200 rounded-full text-[10px] font-bold uppercase tracking-widest text-amber-700">
                <span class="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                Next Gen Hardware Available
            </div>
            
            <h1 class="text-4xl md:text-5xl font-black tracking-tighter text-gray-900 leading-tight">
                UPGRADE YOUR <br />
                <span class="text-amber-500">BATTLESTATION</span>
            </h1>
        </section>

        <!-- New Arrivals -->
        <section>
            <div class="flex items-end justify-between mb-8">
                <div>
                     <h2 class="text-3xl font-black tracking-tight text-gray-900" style="font-family: 'Outfit', sans-serif;">
                        NEW ARRIVALS
                    </h2>
                     <p class="text-xs font-mono text-gray-400 uppercase tracking-widest mt-1">Latest inventory additions</p>
                </div>
                <div class="h-px flex-1 bg-gray-200 mx-6 mb-2"></div>
                <button @click="() => { const fullCatalogSection = document.querySelector('.full-catalog-section'); if (fullCatalogSection) fullCatalogSection.scrollIntoView({ behavior: 'smooth' }); }" class="text-xs font-bold uppercase tracking-widest text-amber-600 hover:text-amber-700 flex items-center gap-1 group">
                    View All <Icon icon="mdi:arrow-right" class="group-hover:translate-x-1 transition-transform" />
                </button>
            </div>
            
            <div v-if="catalogStore.recentProducts.length > 0" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
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
             <div v-else class="text-center py-20 border-2 border-dashed border-gray-200 rounded-3xl">
                <p class="text-gray-400 font-mono">NO DATA AVAILABLE</p>
            </div>
        </section>

        <!-- Shop by Category -->
        <section class="categories-section bg-white/50 backdrop-blur-sm border border-white/60 p-8 rounded-3xl shadow-xl shadow-gray-200/50">
            <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                <div class="flex items-center gap-4">
                     <div class="h-12 w-12 rounded-xl bg-amber-400 flex items-center justify-center text-white text-xl shadow-sm">
                        <Icon icon="mdi:shape" />
                     </div>
                     <div>
                        <h2 class="text-2xl font-black tracking-tight text-gray-900" style="font-family: 'Outfit', sans-serif;">CATEGORIES</h2>
                        <p class="text-xs font-mono text-gray-400 uppercase tracking-widest">Filter Database by Component Type</p>
                     </div>
                </div>
                
                <div class="flex flex-wrap gap-2">
                    <button 
                        v-for="cat in catalogStore.categories" 
                        :key="cat.id"
                        @click="handleCategoryClick(cat.id)"
                        class="px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all"
                        :class="isSelected(cat.id) 
                            ? 'bg-amber-400 text-white shadow-md shadow-amber-200' 
                            : 'bg-white text-gray-500 border border-gray-200 hover:border-amber-300 hover:text-gray-900'"
                    >
                        {{ cat.name }}
                    </button>
                    
                    <button 
                        v-if="catalogStore.selectedCategoryId"
                        @click="catalogStore.selectedCategoryId = null"
                        class="px-3 py-2 rounded-lg text-gray-400 hover:text-red-500 transition-colors"
                    >
                        <Icon icon="mdi:close" />
                    </button>
                </div>
            </div>

            <div v-if="catalogStore.categoryProducts.length > 0" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
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
             <div v-else class="text-center py-20">
                <Icon icon="mdi:filter-variant" class="text-4xl text-gray-300 mx-auto mb-2" />
                <p class="text-gray-400 font-mono">SELECT A CATEGORY TO INITIALIZE VIEW</p>
            </div>
        </section>

        <!-- All Products -->
        <section class="full-catalog-section">
            <div class="flex items-center gap-3 mb-8">
                 <h2 class="text-3xl font-black tracking-tight text-gray-900" style="font-family: 'Outfit', sans-serif;">FULL CATALOG</h2>
                 <div class="h-px flex-1 bg-gray-200"></div>
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
    <footer class="bg-white border-t border-gray-200 py-12 mt-12 relative z-10">
        <div class="max-w-7xl mx-auto px-6 flex flex-col items-center justify-center text-center">
            <div class="flex items-center gap-2 mb-4 opacity-50 grayscale hover:grayscale-0 transition-all duration-500 cursor-help">
                 <div class="bg-yellow-500 rounded p-1">
                    <Icon icon="mdi:cpu-64-bit" class="text-white text-sm" />
                 </div>
                <span class="font-black text-gray-900 tracking-tight">BUILD<span class="text-yellow-500">MASTER</span></span>
            </div>
            <p class="text-xs text-gray-400 font-mono uppercase tracking-widest">&copy; {{ new Date().getFullYear() }} System Verified.</p>
        </div>
    </footer>

    <!-- Add to Cart Modal -->
    <AddToCartModal />

  </div>
</template>

<style scoped>
@keyframes gradient {
	0% { background-position: 0% 50%; }
	50% { background-position: 100% 50%; }
	100% { background-position: 0% 50%; }
}
.animate-gradient {
	animation: gradient 6s ease infinite;
}
</style>
