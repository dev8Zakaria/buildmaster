<script setup>
import { ref, nextTick, computed } from 'vue';
import { useRoute } from 'vue-router';
import { Icon } from '@iconify/vue';
import axios from 'axios';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();
const route = useRoute();
const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || '/api'
});

const isVisible = computed(() => {
    return !!authStore.token && 
           authStore.user?.role !== 'Admin' && 
           !['SignIn', 'SignUp'].includes(route.name);
});

api.interceptors.request.use((config) => {
    if (authStore.token) {
        config.headers.Authorization = `Bearer ${authStore.token}`;
    }
    return config;
});

const isOpen = ref(false);
const messages = ref([
    { role: 'assistant', content: 'System Initialized. I am your specialized hardware configuration assistant. How can I optimize your build today?' }
]);
const userInput = ref('');
const isLoading = ref(false);
const messagesContainer = ref(null);

const toggleChat = () => {
    isOpen.value = !isOpen.value;
    if (isOpen.value) scrollToBottom();
};

const scrollToBottom = async () => {
    await nextTick();
    if (messagesContainer.value) {
        messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
    }
};

const sendMessage = async () => {
    if (!userInput.value.trim() || isLoading.value) return;

    const text = userInput.value;
    messages.value.push({ role: 'user', content: text });
    userInput.value = '';
    isLoading.value = true;
    scrollToBottom();

    try {
        const response = await api.post('/chat', { message: text });
        messages.value.push({ role: 'assistant', content: response.data.response });
    } catch (error) {
        messages.value.push({ role: 'assistant', content: "Connection severed. Unable to reach neural core." });
    } finally {
        isLoading.value = false;
        scrollToBottom();
    }
};
</script>

<template>
    <div v-if="isVisible" class="fixed bottom-6 right-6 z-[9999] font-sans flex flex-col items-end gap-4">
        
        <!-- Chat Window -->
        <transition name="slide-up">
            <div v-if="isOpen" class="mb-4 bg-white/95 backdrop-blur-xl w-[380px] h-[600px] rounded-2xl shadow-2xl flex flex-col border border-gray-200 overflow-hidden ring-1 ring-gray-100">
                
                <!-- Header -->
                <div class="p-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center relative overflow-hidden">
                    <div class="absolute inset-0 bg-gradient-to-r from-amber-500/5 to-transparent"></div>
                    <div class="relative flex items-center gap-3">
                        <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/20">
                            <Icon icon="mdi:robot" class="text-white text-xl" />
                        </div>
                        <div class="flex flex-col">
                            <span class="font-black text-gray-900 text-sm tracking-wide" style="font-family: 'Outfit', sans-serif;">PC_MASTER_AI</span>
                            <span class="text-[10px] text-emerald-600 font-mono flex items-center gap-1.5 uppercase tracking-wider">
                                <span class="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
                                Online
                            </span>
                        </div>
                    </div>
                    <button @click="toggleChat" class="relative z-10 text-gray-400 hover:text-gray-900 transition-colors bg-white hover:bg-gray-100 p-2 rounded-lg border border-gray-100">
                        <Icon icon="mdi:close" />
                    </button>
                </div>

                <!-- Messages Area -->
                <div ref="messagesContainer" class="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
                    <div 
                        v-for="(msg, index) in messages" 
                        :key="index"
                        class="flex flex-col max-w-[85%]"
                        :class="msg.role === 'user' ? 'ml-auto items-end' : 'mr-auto items-start'"
                    >   
                        <span class="text-[10px] uppercase font-mono text-gray-400 mb-1 ml-1" v-if="msg.role === 'assistant'">AI_RESPONSE</span>
                        <div 
                            :class="[
                                'p-4 rounded-2xl text-sm leading-relaxed shadow-sm',
                                msg.role === 'user' 
                                    ? 'bg-zinc-900 text-white rounded-br-none font-bold' 
                                    : 'bg-gray-100 border border-gray-200 text-gray-800 rounded-bl-none'
                            ]"
                        >
                            {{ msg.content }}
                        </div>
                    </div>

                    <!-- Loading Indicator -->
                    <div v-if="isLoading" class="flex flex-col items-start mr-auto max-w-[85%]">
                        <span class="text-[10px] uppercase font-mono text-gray-400 mb-1 ml-1">PROCESSING</span>
                        <div class="bg-gray-100 border border-gray-200 p-4 rounded-2xl rounded-bl-none flex items-center gap-1.5">
                            <div class="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce"></div>
                            <div class="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce delay-75"></div>
                            <div class="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce delay-150"></div>
                        </div>
                    </div>
                </div>

                <!-- Input Area -->
                <div class="p-4 bg-gray-50/50 border-t border-gray-100 backdrop-blur-sm">
                    <form @submit.prevent="sendMessage" class="relative group">
                        <input 
                            v-model="userInput"
                            placeholder="Input command or query..."
                            class="w-full bg-white text-gray-900 rounded-xl pl-4 pr-12 py-3.5 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all border border-gray-200 font-mono placeholder-gray-400 shadow-sm"
                        />
                        <button 
                            type="submit" 
                            :disabled="isLoading || !userInput.trim()"
                            class="absolute right-2 top-1/2 -translate-y-1/2 bg-amber-500 hover:bg-amber-400 text-white p-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105 active:scale-95 shadow-lg shadow-amber-500/20"
                        >
                            <Icon icon="mdi:send-variant" class="text-lg" />
                        </button>
                    </form>
                </div>

            </div>
        </transition>

        <!-- Toggle Button -->
        <button 
            @click="toggleChat"
            class="group relative flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-zinc-900 to-black border border-zinc-800 shadow-xl hover:scale-110 active:scale-95 transition-all duration-300 z-50 overflow-hidden"
        >   
            <div class="absolute inset-0 bg-amber-500/0 group-hover:bg-amber-500/10 transition-colors"></div>
            
            <!-- Glow Effect behind icon -->
            <div class="absolute w-full h-full bg-amber-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>

            <Icon v-if="!isOpen" icon="mdi:message-text-outline" class="text-2xl text-white relative z-10 group-hover:text-amber-500 transition-colors" />
            <Icon v-else icon="mdi:chevron-down" class="text-3xl text-white relative z-10" />
            
            <!-- Notification Dot (Simulated) -->
            <span v-if="!isOpen" class="absolute top-3 right-3 w-2.5 h-2.5 bg-amber-500 rounded-full border-2 border-zinc-900 z-20"></span>
        </button>

    </div>
</template>

<style scoped>
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.4s cubic-bezier(0.19, 1, 0.22, 1);
}

.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(40px) scale(0.95);
  filter: blur(10px);
}
</style>
