<script setup>
import ChatBot from '@/components/chatbot/ChatBot.vue';
</script>

<template>
  <div class="bg-gray-50 text-gray-900 min-h-screen font-sans antialiased">
    <router-view />
    <ChatBot />
  </div>
</template>
