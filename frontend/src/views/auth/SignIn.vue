<script setup>
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';
import { Icon } from '@iconify/vue';

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
        router.push('/'); 
    } catch (err) {
        error.value = err.message || 'Failed to sign in';
    } finally {
        isLoading.value = false;
    }
};
</script>

<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-50 relative overflow-hidden font-sans text-gray-900">
        
        <!-- Background Decor -->
        <div class="absolute inset-0 z-0 opacity-40">
            <div class="absolute top-0 left-1/4 w-96 h-96 bg-amber-200/50 rounded-full blur-3xl"></div>
            <div class="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-200/50 rounded-full blur-3xl"></div>
            <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzMzMyIgb3BhY2l0eT0iMC4wNSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')]"></div>
        </div>

        <!-- Card -->
        <div class="relative z-10 w-full max-w-md p-8">
            <!-- Brand/Logo Area -->
            <div class="mb-10 text-center">
                <div class="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-amber-400 mb-4 shadow-sm">
                    <Icon icon="mdi:cpu-64-bit" class="text-white text-2xl" />
                </div>
                <h2 class="text-3xl font-black tracking-tighter text-gray-900 mb-2" style="font-family: 'Outfit', sans-serif;">
                    WELCOME BACK
                </h2>
                <p class="text-xs font-bold text-gray-500 uppercase tracking-widest" style="font-family: 'JetBrains Mono', monospace;">
                    Sign in to your account
                </p>
            </div>

            <!-- Form Container -->
            <div class="bg-white/80 backdrop-blur-xl border border-gray-100 rounded-2xl p-8 shadow-2xl shadow-gray-200/50 relative group">
                
                <form @submit.prevent="handleLogin" class="space-y-6">
                    
                    <div class="space-y-4">
                        <div class="group/input">
                            <label class="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2" style="font-family: 'JetBrains Mono', monospace;">
                                Email Address
                            </label>
                            <div class="relative">
                                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Icon icon="mdi:email-outline" class="text-gray-400 group-focus-within/input:text-amber-500 transition-colors" />
                                </div>
                                <input
                                    v-model="form.email"
                                    type="email"
                                    required
                                    class="block w-full pl-10 pr-3 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all font-mono text-sm shadow-sm"
                                    placeholder="user@example.com"
                                />
                            </div>
                        </div>

                        <div class="group/input">
                            <label class="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2" style="font-family: 'JetBrains Mono', monospace;">
                                Password
                            </label>
                            <div class="relative">
                                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Icon icon="mdi:lock-outline" class="text-gray-400 group-focus-within/input:text-amber-500 transition-colors" />
                                </div>
                                <input
                                    v-model="form.password"
                                    type="password"
                                    required
                                    class="block w-full pl-10 pr-3 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all font-mono text-sm shadow-sm"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>
                    </div>

                    <!-- Error Alert -->
                    <div v-if="error" class="bg-red-50 border border-red-100 p-3 rounded-lg flex items-center gap-2">
                        <Icon icon="mdi:alert-circle" class="text-red-500" />
                        <span class="text-xs text-red-500 font-mono">{{ error }}</span>
                    </div>

                    <!-- Submit Button -->
                    <button
                        type="submit"
                        :disabled="isLoading"
                        class="w-full relative overflow-hidden group/btn bg-amber-400 hover:bg-amber-500 text-white font-bold py-4 rounded-xl transition-all shadow-sm hover:scale-[1.01] disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        <span class="relative z-10 flex items-center justify-center gap-2">
                            <Icon v-if="isLoading" icon="eos-icons:loading" class="animate-spin" />
                            <span v-else>SIGN IN</span>
                            <Icon v-if="!isLoading" icon="mdi:arrow-right" class="group-hover/btn:translate-x-1 transition-transform" />
                        </span>
                        
                        <!-- Shine Effect -->
                        <div class="absolute top-0 -left-[100%] w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 group-hover/btn:animate-shine"></div>
                    </button>

                </form>

                <!-- Footer -->
                <div class="mt-6 text-center">
                    <p class="text-xs text-gray-500" style="font-family: 'JetBrains Mono', monospace;">
                        NO ACCOUNT? 
                        <router-link to="/signup" class="text-amber-600 hover:text-amber-500 font-bold ml-1 hover:underline decoration-amber-500/50 underline-offset-4">
                            REGISTER NOW
                        </router-link>
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
@keyframes shine {
    0% { left: -100%; }
    100% { left: 100%; }
}
.group-hover\/btn\:animate-shine:hover {
    animation: shine 1s;
}
</style>
