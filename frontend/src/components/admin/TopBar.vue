<script setup>
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';
import { Icon } from '@iconify/vue';

const authStore = useAuthStore();
const router = useRouter();
const user = authStore.user;

const handleLogout = () => {
    authStore.logout();
    router.push('/login');
};
</script>

<template>
    <header class="bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800 h-16 flex items-center justify-between px-6 sticky top-0 z-50">
        <div class="flex items-center gap-3">
             <div class="bg-yellow-500 rounded-lg p-1.5">
                <Icon icon="mdi:cog" class="text-white text-xl" />
             </div>
            <h1 class="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-600 to-yellow-500">
                Admin Dashboard
            </h1>
        </div>

        <div class="flex items-center gap-6">
            <div class="flex items-center gap-3 text-sm">
                <div class="text-right hidden sm:block">
                    <p class="font-medium text-gray-900 dark:text-white">{{ user?.firstName }} {{ user?.lastName }}</p>
                    <p class="text-xs text-gray-500 dark:text-gray-400 capitalize">{{ user?.role }}</p>
                </div>
                <div class="h-10 w-10 rounded-full bg-yellow-100 dark:bg-yellow-900/50 flex items-center justify-center text-yellow-600 dark:text-yellow-400 font-bold border-2 border-white dark:border-zinc-800 shadow-sm">
                    {{ user?.firstName?.charAt(0) }}
                </div>
            </div>
            
            <button 
                @click="handleLogout"
                class="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-colors"
                title="Logout"
            >
               <Icon icon="mdi:logout" class="text-lg" />
            </button>
        </div>
    </header>
</template>
