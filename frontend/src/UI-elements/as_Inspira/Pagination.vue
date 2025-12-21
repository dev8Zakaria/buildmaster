<script setup>
import { computed } from 'vue'
import { Icon } from '@iconify/vue'
import { cn } from '@/lib/utils'

const props = defineProps({
  total: {
    type: Number,
    required: true
  },
  itemsPerPage: {
    type: Number,
    default: 10
  },
  currentPage: {
    type: Number,
    default: 1
  },
  class: {
    type: String,
    default: ""
  }
})

const emit = defineEmits(['update:currentPage'])

const totalPages = computed(() => Math.ceil(props.total / props.itemsPerPage))

const pages = computed(() => {
  const p = []
  for (let i = 1; i <= totalPages.value; i++) {
    p.push(i)
  }
  return p
})

// Simple pagination logic for now (show all pages)
// For large numbers of pages, we would need ellipsis logic
const visiblePages = computed(() => {
    const total = totalPages.value
    const current = props.currentPage
    
    if (total <= 7) return pages.value

    if (current <= 4) return [1, 2, 3, 4, 5, '...', total]
    if (current >= total - 3) return [1, '...', total - 4, total - 3, total - 2, total - 1, total]
    
    return [1, '...', current - 1, current, current + 1, '...', total]
})

const goToPage = (page) => {
  if (page === '...') return
  if (page >= 1 && page <= totalPages.value) {
    emit('update:currentPage', page)
  }
}
</script>

<template>
  <nav :class="cn('flex items-center justify-center space-x-2', props.class)" aria-label="Pagination">
    <!-- Previous Button -->
    <button
      @click="goToPage(currentPage - 1)"
      :disabled="currentPage === 1"
      class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-zinc-100 hover:text-zinc-900 h-9 px-3 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
    >
      <Icon icon="lucide:chevron-left" class="h-4 w-4 mr-1" />
      <span>Previous</span>
    </button>

    <!-- Page Numbers -->
    <button
      v-for="(page, index) in visiblePages"
      :key="index"
      @click="goToPage(page)"
      :class="cn(
        'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-9 w-9',
        page === currentPage 
          ? 'bg-yellow-500 text-white hover:bg-yellow-600 shadow-sm' 
          : 'hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-50',
        page === '...' ? 'hover:bg-transparent cursor-default' : ''
      )"
    >
      <Icon v-if="page === '...'" icon="lucide:more-horizontal" class="h-4 w-4" />
      <span v-else>{{ page }}</span>
    </button>

    <!-- Next Button -->
    <button
      @click="goToPage(currentPage + 1)"
      :disabled="currentPage === totalPages"
      class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-zinc-100 hover:text-zinc-900 h-9 px-3 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
    >
      <span>Next</span>
      <Icon icon="lucide:chevron-right" class="h-4 w-4 ml-1" />
    </button>
  </nav>
</template>
