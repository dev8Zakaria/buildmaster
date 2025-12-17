<script setup>
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';
import IInput from '@/UI-elements/Inspira/IInput.vue';
import InteractiveHoverButton from '@/UI-elements/Inspira/InteractiveHoverButton.vue';

const authStore = useAuthStore();
const router = useRouter();

const form = ref({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'Customer' // Default role as per requirements
});

const error = ref('');
const isLoading = ref(false);

const handleSignup = async () => {
    error.value = '';
    isLoading.value = true;
    try {
        await authStore.signup(form.value);
        router.push('/login'); // Redirect to login after successful signup
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
                    Create an account
                </h2>
                <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    Join Build Master today
                </p>
            </div>
            
            <form class="mt-8 space-y-6" @submit.prevent="handleSignup">
                <div class="space-y-4 rounded-md shadow-sm">
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label for="firstName" class="sr-only">First Name</label>
                            <IInput
                                id="firstName"
                                v-model="form.firstName"
                                type="text"
                                required
                                placeholder="First Name"
                                class="bg-gray-50 dark:bg-zinc-900/50"
                            />
                        </div>
                         <div>
                            <label for="lastName" class="sr-only">Last Name</label>
                            <IInput
                                id="lastName"
                                v-model="form.lastName"
                                type="text"
                                required
                                placeholder="Last Name"
                                class="bg-gray-50 dark:bg-zinc-900/50"
                            />
                        </div>
                    </div>
                    <div>
                        <label for="email-address" class="sr-only">Email address</label>
                        <IInput
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
                        <IInput
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

                <div class="flex justify-center">
                    <InteractiveHoverButton
                        type="submit"
                        class="w-full"
                        :disabled="isLoading"
                        :text="isLoading ? 'Creating account...' : 'Sign up'"
                    />
                </div>
            </form>
             <div class="text-center text-sm">
                <span class="text-gray-600 dark:text-gray-400">Already have an account? </span>
                <router-link to="/login" class="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">
                    Sign in
                </router-link>
            </div>
        </div>
    </div>
</template>
