<script setup>
import ChatBot from '@/components/chatbot/ChatBot.vue';
</script>

<template>
  <div class="bg-background text-foreground min-h-screen font-sans antialiased">
    <router-view />
    <ChatBot />
  </div>
</template>
