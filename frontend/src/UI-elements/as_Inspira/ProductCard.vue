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
  },
  showAddToCart: {
    type: Boolean,
    default: true
  }
});

defineEmits(['click', 'addToCart']);

const handleAddToCart = (e) => {
  e.stopPropagation();
};
</script>

<template>
  <div 
    @click="$emit('click')"
    :class="cn(
      'group relative flex flex-col bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm hover:shadow-lg hover:border-yellow-200 dark:hover:border-yellow-900/50 transition-all duration-300 cursor-pointer h-full',
      props.class
    )"
  >
    <!-- Image Area - Reduced height -->
    <div class="h-36 w-full bg-gray-50 dark:bg-zinc-800/50 relative overflow-hidden p-4">
      <div class="w-full h-full flex items-center justify-center transition-transform duration-500 group-hover:scale-105">
        <img 
          v-if="imageUrl" 
          :src="imageUrl" 
          :alt="name" 
          class="w-full h-full object-contain drop-shadow-sm"
        >
        <div v-else class="flex flex-col items-center justify-center text-gray-400">
          <Icon icon="mdi:image-off" class="text-3xl opacity-50 mb-1" />
          <span class="text-xs">No Image</span>
        </div>
      </div>

      <!-- Price Badge -->
      <div class="absolute top-2 right-2 bg-yellow-400 text-yellow-950 text-xs font-bold px-2 py-0.5 rounded-full shadow-sm">
        ${{ price }}
      </div>
    </div>

    <!-- Content Area - More compact -->
    <div class="p-3 flex flex-col flex-1 gap-1">
      <div class="flex-1 min-w-0">
        <h3 class="font-semibold text-gray-900 dark:text-gray-100 truncate text-sm" :title="name">
          {{ name }}
        </h3>
        <p class="text-xs text-gray-500 dark:text-gray-400 truncate">{{ brand }}</p>
      </div>

      <div class="flex items-center justify-between pt-1">
        <span class="text-xs px-1.5 py-0.5 bg-gray-100 dark:bg-zinc-800 rounded text-gray-600 dark:text-gray-300 truncate max-w-[60%]">
          {{ category }}
        </span>
        
        <div class="flex items-center gap-1 text-xs" :class="Number(stock) > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'">
            <Icon v-if="Number(stock) > 0" icon="mdi:check-circle" class="text-sm" />
            <Icon v-else icon="mdi:alert-circle" class="text-sm" />
        </div>
      </div>

      <!-- Add to Cart Button -->
      <button 
        v-if="showAddToCart && Number(stock) > 0"
        @click.stop="$emit('addToCart')"
        class="mt-2 w-full flex items-center justify-center gap-1.5 py-2 px-3 bg-yellow-500 hover:bg-yellow-600 text-white text-xs font-semibold rounded-lg transition-colors"
      >
        <Icon icon="mdi:cart-plus" class="text-sm" />
        Add to Cart
      </button>
      <div 
        v-else-if="Number(stock) <= 0"
        class="mt-2 w-full flex items-center justify-center gap-1.5 py-2 px-3 bg-gray-200 dark:bg-zinc-700 text-gray-500 dark:text-gray-400 text-xs font-semibold rounded-lg cursor-not-allowed"
      >
        Out of Stock
      </div>
    </div>
  </div>
</template>

