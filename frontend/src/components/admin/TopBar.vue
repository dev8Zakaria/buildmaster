<script setup>
import { useAuthStore } from '@/stores/auth';
import { useRouter, useRoute } from 'vue-router';
import { computed } from 'vue';
import { Icon } from '@iconify/vue';

const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();
const user = computed(() => authStore.user);

const handleLogout = () => {
    authStore.logout();
    router.push('/login');
};

const navItems = [
    { name: 'Analytics', icon: 'mdi:chart-box-outline', route: 'AdminAnalytics' },
    { name: 'Orders', icon: 'mdi:clipboard-list-outline', route: 'AdminOrders' },
    { name: 'Inventory', icon: 'mdi:package-variant-closed', route: 'AdminDashboard' },
];

const isActive = (routeName) => route.name === routeName;
</script>

<template>
    <header class="sticky top-0 z-50 w-full backdrop-blur-xl border-b border-gray-200 bg-white/80">
        <div class="flex h-16 items-center justify-between px-6 max-w-[1600px] mx-auto">
            
            <div class="flex items-center gap-8">
                <!-- Brand -->
                <router-link to="/admin" class="flex items-center gap-2.5 group">
                    <div class="relative flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 shadow-lg shadow-orange-500/20 group-hover:scale-105 transition-transform duration-300">
                        <Icon icon="mdi:cpu-64-bit" class="text-white text-lg" />
                        <div class="absolute inset-0 rounded-xl ring-1 ring-white/20"></div>
                    </div>
                    <div class="hidden md:block">
                        <h1 class="text-lg font-black tracking-tight leading-none text-gray-900" style="font-family: 'Outfit', sans-serif;">
                            BUILD<span class="text-amber-500">MASTER</span>
                        </h1>
                        <p class="text-[9px] font-bold text-gray-500 uppercase tracking-widest" style="font-family: 'JetBrains Mono', monospace;">
                            Admin Console
                        </p>
                    </div>
                </router-link>

                <!-- Navigation -->
                <nav class="flex items-center gap-1">
                    <router-link
                        v-for="item in navItems"
                        :key="item.route"
                        :to="{ name: item.route }"
                        class="relative px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 group overflow-hidden"
                        :class="isActive(item.route) 
                            ? 'text-amber-600 bg-amber-50' 
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'"
                    >
                        <Icon :icon="item.icon" class="text-lg transition-transform group-hover:scale-110" />
                        <span class="font-medium" style="font-family: 'Outfit', sans-serif;">{{ item.name }}</span>
                        
                        <!-- Active Indicator -->
                        <div v-if="isActive(item.route)" class="absolute bottom-0 left-0 h-0.5 w-full bg-amber-500"></div>
                    </router-link>
                </nav>
            </div>

            <!-- Right Actions -->
            <div class="flex items-center gap-4">
                <!-- User Profile -->
                <div class="flex items-center gap-3 pl-4 border-l border-gray-200">
                    <div class="text-right hidden sm:block">
                        <p class="text-sm font-bold text-gray-900 leading-tight">
                            {{ user?.firstName }} {{ user?.lastName }}
                        </p>
                        <p class="text-[10px] text-amber-600 font-bold uppercase tracking-wider" style="font-family: 'JetBrains Mono', monospace;">
                            {{ user?.role }}
                        </p>
                    </div>
                    <div class="relative h-9 w-9 rounded-lg bg-gray-100 flex items-center justify-center border border-gray-200">
                        <span class="font-black text-gray-700" style="font-family: 'Outfit', sans-serif;">
                            {{ user?.firstName?.charAt(0) }}
                        </span>
                        <div class="absolute -bottom-1 -right-1 h-3 w-3 rounded-full bg-emerald-500 border-2 border-white"></div>
                    </div>
                </div>

                <!-- Logout -->
                <button 
                    @click="handleLogout"
                    class="p-2 text-gray-400 hover:text-red-500 bg-transparent hover:bg-red-50 rounded-lg transition-all duration-200"
                    title="Sign Out"
                >
                    <Icon icon="mdi:logout-variant" class="text-xl" />
                </button>
            </div>
            
        </div>
    </header>
</template>
