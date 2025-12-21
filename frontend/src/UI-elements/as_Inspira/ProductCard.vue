<script setup>
import { Icon } from '@iconify/vue';
import { cn } from '@/lib/utils';

const props = defineProps({
  name: {
    type: String,
    required: true
  },
  brand: {
    type: String,
    required: true
  },
  price: {
    type: [String, Number],
    required: true
  },
  stock: {
    type: [String, Number],
    required: true
  },
  category: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    default: undefined
  },
  class: {
    type: String,
    default: ""
  }
});

defineEmits(['click']);
</script>

<template>
  <div 
    @click="$emit('click')"
    :class="cn(
      'group relative flex flex-col bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg hover:border-yellow-200 dark:hover:border-yellow-900/50 transition-all duration-300 cursor-pointer h-full',
      props.class
    )"
  >
    <!-- Image Area with Zoom-out effect (padding) -->
    <div class="h-52 w-full bg-gray-50 dark:bg-zinc-800/50 relative overflow-hidden p-6">
      <div class="w-full h-full flex items-center justify-center transition-transform duration-500 group-hover:scale-105">
        <img 
          v-if="imageUrl" 
          :src="imageUrl" 
          :alt="name" 
          class="w-full h-full object-contain drop-shadow-sm"
        >
        <div v-else class="flex flex-col items-center justify-center text-gray-400">
          <Icon icon="mdi:image-off" class="text-4xl opacity-50 mb-2" />
          <span class="text-xs">No Image</span>
        </div>
      </div>

      <!-- Price Badge -->
      <div class="absolute top-3 right-3 bg-yellow-400 text-yellow-950 text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
        ${{ price }}
      </div>
    </div>

    <!-- Content Area -->
    <div class="p-4 flex flex-col flex-1 gap-2">
      <div class="flex justify-between items-start gap-2">
        <div class="flex-1 min-w-0">
          <h3 class="font-bold text-gray-900 dark:text-gray-100 truncate text-base" :title="name">
            {{ name }}
          </h3>
          <p class="text-sm text-gray-500 dark:text-gray-400 truncate">{{ brand }}</p>
        </div>
      </div>

      <div class="mt-auto flex items-center justify-between pt-2">
        <div class="inline-flex items-center px-2 py-1 bg-gray-100 dark:bg-zinc-800 rounded-md text-xs font-medium text-gray-600 dark:text-gray-300">
          {{ category }}
        </div>
        
        <div class="flex items-center gap-1 text-xs font-medium" :class="Number(stock) > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'">
            <Icon v-if="Number(stock) > 0" icon="mdi:check-circle" class="mr-0.5" />
            <Icon v-else icon="mdi:alert-circle" class="mr-0.5" />
            {{ Number(stock) > 0 ? `${stock} in stock` : 'Out of stock' }}
        </div>
      </div>
    </div>
  </div>
</template>
