<script setup>
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';
import InteractiveHoverButton from '@/UI-elements/Inspira/InteractiveHoverButton.vue';

const authStore = useAuthStore();
const router = useRouter();

const handleLogout = () => {
    authStore.logout();
    router.push('/login');
};
</script>

<template>
  <div class="flex min-h-screen flex-col items-center justify-center p-4 bg-white dark:bg-black text-center">
    <!-- Hero Section -->
    <div class="max-w-2xl space-y-8">
        <h1 class="text-6xl font-extrabold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-yellow-600 dark:from-yellow-400 dark:to-yellow-500">
            Build Master
        </h1>
        
        <p class="text-xl text-gray-600 dark:text-gray-300">
            Experience the future of grocery shopping. Fresh, fast, and at your fingertips.
        </p>

        <!-- Dynamic Content based on Auth State -->
        <div v-if="authStore.user" class="space-y-6">
            <div class="p-6 rounded-2xl bg-gray-50 dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800">
                <p class="text-2xl font-bold dark:text-white">
                    Welcome back, {{ authStore.user.firstName || 'User' }}!
                </p>
                <p class="text-gray-500 dark:text-gray-400 mt-2">
                    You are logged in as <span class="badge bg-yellow-100 text-yellow-800 text-xs font-semibold px-2.5 py-0.5 rounded dark:bg-yellow-200 dark:text-yellow-900">{{ authStore.user.role || 'Customer' }}</span>
                </p>
            </div>
            
            <div class="flex justify-center">
                <InteractiveHoverButton @click="handleLogout" text="Log Out" class="bg-red-500 hover:bg-red-600 text-white border-red-500" />
            </div>
        </div>

        <div v-else class="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <router-link to="/login">
                <InteractiveHoverButton text="Sign In" />
            </router-link>
            <router-link to="/signup">
                <InteractiveHoverButton text="Create Account" class="bg-transparent border border-yellow-500 text-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-900/20" />
            </router-link>
        </div>
    </div>
  </div>
</template>
