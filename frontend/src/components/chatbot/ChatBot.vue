<script setup>
import { ref, nextTick, watch, computed } from 'vue';
import { useRoute } from 'vue-router';
import { Icon } from '@iconify/vue';
import axios from 'axios';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();
const route = useRoute();
const api = axios.create({
    baseURL: 'http://localhost:3000/api'
});

// Visibility logic: Only show when logged in AND not on auth pages
const isVisible = computed(() => {
    return !!authStore.token && 
           authStore.user?.role !== 'Admin' && 
           !['SignIn', 'SignUp'].includes(route.name);
});

// Interceptor for Auth (if user logged in, use their context)
api.interceptors.request.use((config) => {
    if (authStore.token) {
        config.headers.Authorization = `Bearer ${authStore.token}`;
    }
    return config;
});

const isOpen = ref(false);
const messages = ref([
    { role: 'assistant', content: 'Hi! I can help you build a PC. Ask me for a recommendation or any hardware question!' }
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

    // Add user message
    const text = userInput.value;
    messages.value.push({ role: 'user', content: text });
    userInput.value = '';
    isLoading.value = true;
    scrollToBottom();

    try {
        const response = await api.post('/chat', { message: text });
        messages.value.push({ role: 'assistant', content: response.data.response });
    } catch (error) {
        messages.value.push({ role: 'assistant', content: "Sorry, I'm having trouble connecting to the server." });
    } finally {
        isLoading.value = false;
        scrollToBottom();
    }
};
</script>

<template>
    <div v-if="isVisible" class="fixed top-16 right-6 z-[9999] font-sans flex flex-col items-end gap-2 group">
        
        <!-- Tooltip (Visible on Hover) - Inversed Colors -->
        <div class="bg-white text-amber-600 text-[11px] font-bold py-2 px-4 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none mb-2 shadow-xl shadow-yellow-500/10 border border-yellow-500/20 whitespace-nowrap transform translate-x-2 group-hover:translate-x-0">
            Hey! Need a custom PC recommendation? 🤖
        </div>

        <!-- Chat Window -->
        <transition name="slide-up">
            <div v-if="isOpen" class="mr-2 bg-white dark:bg-zinc-900 w-[360px] h-[500px] rounded-2xl shadow-2xl flex flex-col border border-yellow-500/30 dark:border-yellow-500/20 overflow-hidden ring-4 ring-yellow-500/10">
                
                <!-- Header -->
                <div class="p-4 bg-gradient-to-r from-yellow-500 to-amber-600 text-white flex justify-between items-center shadow-md">
                    <div class="flex items-center gap-2">
                        <div class="bg-white/20 p-1.5 rounded-full">
                            <Icon icon="mdi:robot-happy" class="text-xl" />
                        </div>
                        <div class="flex flex-col">
                            <span class="font-bold text-sm">PC Master AI</span>
                            <span class="text-[10px] opacity-90 flex items-center gap-1">
                                <span class="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                                Online Technician
                            </span>
                        </div>
                    </div>
                    <button @click="toggleChat" class="hover:bg-white/20 rounded-full p-1 transition">
                        <Icon icon="mdi:close" />
                    </button>
                </div>

                <!-- Messages Area -->
                <div ref="messagesContainer" class="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-zinc-950/50">
                    <div 
                        v-for="(msg, index) in messages" 
                        :key="index"
                        :class="[
                            'max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap shadow-sm',
                            msg.role === 'user' 
                                ? 'bg-yellow-500 text-white ml-auto rounded-br-none' 
                                : 'bg-white dark:bg-zinc-800 text-gray-800 dark:text-gray-200 border border-gray-100 dark:border-zinc-700 rounded-bl-none'
                        ]"
                    >
                        {{ msg.content }}
                    </div>

                    <!-- Loading Indicator -->
                    <div v-if="isLoading" class="bg-white dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700 p-3 rounded-2xl rounded-bl-none w-16 flex items-center gap-1">
                        <div class="w-2 h-2 bg-yellow-500 rounded-full animate-bounce"></div>
                        <div class="w-2 h-2 bg-yellow-500 rounded-full animate-bounce delay-75"></div>
                        <div class="w-2 h-2 bg-yellow-500 rounded-full animate-bounce delay-150"></div>
                    </div>
                </div>

                <!-- Input Area -->
                <div class="p-4 bg-white dark:bg-zinc-900 border-t border-gray-100 dark:border-zinc-800">
                    <form @submit.prevent="sendMessage" class="flex items-center gap-2">
                        <input 
                            v-model="userInput"
                            placeholder="Ask for a build..."
                            class="flex-1 bg-gray-100 dark:bg-zinc-800 text-gray-900 dark:text-gray-100 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500/50 transition-all"
                        />
                        <button 
                            type="submit" 
                            :disabled="isLoading || !userInput.trim()"
                            class="bg-yellow-500 text-white p-2 rounded-full hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed transition transform active:scale-95 shadow-md shadow-yellow-500/30"
                        >
                            <Icon icon="mdi:send" />
                        </button>
                    </form>
                </div>

            </div>
        </transition>

        <!-- Toggle Button -->
        <button 
            v-if="!isOpen"
            @click="toggleChat"
            class="relative group bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-400 hover:to-amber-500 text-white p-4 rounded-full shadow-lg shadow-yellow-500/40 transition-all duration-300 hover:scale-110 hover:-translate-y-1"
        >
            <!-- Main Icon -->
            <Icon icon="mdi:robot-happy" class="text-3xl" />
        </button>

    </div>
</template>

<style scoped>
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.95);
}
</style>
