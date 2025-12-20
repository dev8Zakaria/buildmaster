<script setup>
import { ref, computed, watch } from 'vue'
import { onClickOutside } from '@vueuse/core'
import { Icon } from '@iconify/vue'
import { cn } from '@/lib/utils'

const props = defineProps({
  options: {
    type: Array, // Array of { value: any, label: string }
    required: true
  },
  modelValue: {
    type: [String, Number, null],
    default: null
  },
  placeholder: {
    type: String,
    default: "Select option..."
  },
  class: {
    type: String,
    default: ""
  }
})

const emit = defineEmits(['update:modelValue'])

const isOpen = ref(false)
const containerRef = ref(null)
const searchQuery = ref("")

const selectedLabel = computed(() => {
  const selected = props.options.find(opt => opt.value === props.modelValue)
  return selected ? selected.label : null
})

const filteredOptions = computed(() => {
  if (!searchQuery.value) return props.options
  return props.options.filter(opt => 
    opt.label.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

const toggleOpen = () => {
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    searchQuery.value = "" // Reset search on open
  }
}

const selectOption = (value) => {
  emit('update:modelValue', value)
  isOpen.value = false
}

onClickOutside(containerRef, () => {
  isOpen.value = false
})
</script>

<template>
  <div ref="containerRef" :class="cn('relative w-full', props.class)">
    <!-- Trigger Button -->
    <button
      type="button"
      @click="toggleOpen"
      :class="cn(
        'flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-950 dark:ring-offset-zinc-950 dark:placeholder:text-gray-400 dark:focus:ring-yellow-400',
        isOpen ? 'ring-2 ring-yellow-500' : ''
      )"
    >
      <span v-if="selectedLabel" class="truncate">{{ selectedLabel }}</span>
      <span v-else class="text-gray-500 dark:text-gray-400">{{ placeholder }}</span>
      <Icon icon="lucide:chevrons-up-down" class="ml-2 h-4 w-4 shrink-0 opacity-50" />
    </button>

    <!-- Dropdown Content -->
    <div
      v-if="isOpen"
      class="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border border-gray-200 bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm dark:border-zinc-800 dark:bg-zinc-950"
    >
      <!-- Search Input -->
      <div class="sticky top-0 z-10 bg-white px-2 py-1.5 dark:bg-zinc-950 border-b border-gray-100 dark:border-zinc-800">
        <div class="relative flex items-center">
            <Icon icon="lucide:search" class="absolute left-2 h-4 w-4 text-gray-500" />
            <input
                v-model="searchQuery"
                type="text"
                class="w-full bg-transparent py-1 pl-8 pr-2 text-sm placeholder:text-gray-500 focus:outline-none dark:text-gray-100"
                placeholder="Search..."
                @click.stop
            />
        </div>
      </div>

      <!-- Options List -->
      <div class="py-1">
        <div
          v-if="filteredOptions.length === 0"
          class="relative cursor-default select-none px-4 py-2 text-center text-sm text-gray-500"
        >
          No results found.
        </div>
        
        <div
          v-for="option in filteredOptions"
          :key="option.value"
          @click="selectOption(option.value)"
          :class="cn(
            'relative cursor-pointer select-none py-2 pl-3 pr-9 text-sm outline-none transition-colors hover:bg-yellow-100 hover:text-yellow-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 dark:hover:bg-yellow-900/30 dark:hover:text-yellow-100',
            modelValue === option.value ? 'bg-yellow-50 text-yellow-900 dark:bg-yellow-900/20 dark:text-yellow-100' : 'text-gray-900 dark:text-gray-100'
          )"
        >
          <span class="block truncate font-medium">{{ option.label }}</span>
          
          <span
            v-if="modelValue === option.value"
            class="absolute inset-y-0 right-0 flex items-center pr-4 text-yellow-600 dark:text-yellow-400"
          >
            <Icon icon="lucide:check" class="h-4 w-4" />
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
