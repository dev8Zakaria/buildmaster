<script setup>
import { ref, nextTick, watch } from 'vue';
import { Icon } from '@iconify/vue';
import axios from 'axios';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();
const api = axios.create({
    baseURL: 'http://localhost:3000/api'
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
    <div class="fixed bottom-6 right-6 z-[9999] font-sans">
        
        <!-- Chat Window -->
        <transition name="slide-up">
            <div v-if="isOpen" class="bg-white dark:bg-zinc-900 w-[360px] h-[500px] rounded-2xl shadow-2xl flex flex-col border border-gray-200 dark:border-zinc-800 mb-4 overflow-hidden">
                
                <!-- Header -->
                <div class="p-4 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white flex justify-between items-center">
                    <div class="flex items-center gap-2">
                        <Icon icon="mdi:robot-happy" class="text-2xl" />
                        <span class="font-bold">PC Builder AI</span>
                    </div>
                    <button @click="toggleChat" class="hover:bg-white/20 rounded-full p-1 transition">
                        <Icon icon="mdi:close" />
                    </button>
                </div>

                <!-- Messages Area -->
                <div ref="messagesContainer" class="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-black/50">
                    <div 
                        v-for="(msg, index) in messages" 
                        :key="index"
                        :class="[
                            'max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap',
                            msg.role === 'user' 
                                ? 'bg-yellow-500 text-white ml-auto rounded-br-none' 
                                : 'bg-white dark:bg-zinc-800 text-gray-800 dark:text-gray-200 border border-gray-100 dark:border-zinc-700 rounded-bl-none'
                        ]"
                    >
                        {{ msg.content }}
                    </div>

                    <!-- Loading Indicator -->
                    <div v-if="isLoading" class="bg-white dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700 p-3 rounded-2xl rounded-bl-none w-16 flex items-center gap-1">
                        <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75"></div>
                        <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></div>
                    </div>
                </div>

                <!-- Input Area -->
                <div class="p-4 bg-white dark:bg-zinc-900 border-t border-gray-100 dark:border-zinc-800">
                    <form @submit.prevent="sendMessage" class="flex items-center gap-2">
                        <input 
                            v-model="userInput"
                            placeholder="Type a message..."
                            class="flex-1 bg-gray-100 dark:bg-zinc-800 text-gray-900 dark:text-gray-100 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
                        />
                        <button 
                            type="submit" 
                            :disabled="isLoading || !userInput.trim()"
                            class="bg-yellow-500 text-white p-2 rounded-full hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
                        >
                            <Icon icon="mdi:send" />
                        </button>
                    </form>
                </div>

            </div>
        </transition>

        <!-- Toggle Button -->
        <button 
            @click="toggleChat"
            class="bg-yellow-500 hover:bg-yellow-600 text-white p-4 rounded-full shadow-lg transition-transform hover:scale-110 flex items-center justify-center"
        >
            <Icon v-if="!isOpen" icon="mdi:message-text-outline" class="text-2xl" />
            <Icon v-else icon="mdi:chevron-down" class="text-2xl" />
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
