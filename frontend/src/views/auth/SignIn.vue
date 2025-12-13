<script setup>
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';
import Input from '@/components/ui/Input.vue';
import Button from '@/components/ui/Button.vue';

const authStore = useAuthStore();
const router = useRouter();

const form = ref({
    email: '',
    password: ''
});

const error = ref('');
const isLoading = ref(false);

const handleLogin = async () => {
    error.value = '';
    isLoading.value = true;
    try {
        await authStore.login(form.value);
        router.push('/'); // Redirect to home after successful login
    } catch (err) {
        error.value = err;
    } finally {
        isLoading.value = false;
    }
};
</script>

<template>
    <div class="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-zinc-900 px-4">
        <div class="w-full max-w-md space-y-8 bg-white dark:bg-zinc-800 p-8 rounded-xl shadow-lg border border-gray-100 dark:border-zinc-700">
            <div class="text-center">
                <h2 class="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                    Welcome back
                </h2>
                <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    Sign in to your account
                </p>
            </div>
            
            <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
                <div class="space-y-4 rounded-md shadow-sm">
                    <div>
                        <label for="email-address" class="sr-only">Email address</label>
                        <Input
                            id="email-address"
                            v-model="form.email"
                            type="email"
                            autocomplete="email"
                            required
                            placeholder="Email address"
                            class="bg-gray-50 dark:bg-zinc-900/50"
                        />
                    </div>
                    <div>
                        <label for="password" class="sr-only">Password</label>
                        <Input
                            id="password"
                            v-model="form.password"
                            type="password"
                            autocomplete="current-password"
                            required
                            placeholder="Password"
                            class="bg-gray-50 dark:bg-zinc-900/50"
                        />
                    </div>
                </div>

                <div v-if="error" class="text-red-500 text-sm text-center bg-red-50 dark:bg-red-900/20 p-2 rounded">
                    {{ error }}
                </div>

                <div>
                    <Button
                        type="submit"
                        class="w-full"
                        :disabled="isLoading"
                    >
                        <span v-if="isLoading">Signing in...</span>
                        <span v-else>Sign in</span>
                    </Button>
                </div>
            </form>

            <div class="text-center text-sm">
                <span class="text-gray-600 dark:text-gray-400">Don't have an account? </span>
                <router-link to="/signup" class="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">
                    Sign up
                </router-link>
            </div>
        </div>
    </div>
</template>
