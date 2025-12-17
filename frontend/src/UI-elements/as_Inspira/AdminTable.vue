<script setup>
import { computed } from 'vue';
import { Icon } from '@iconify/vue';

const props = defineProps({
    columns: {
        type: Array, // [{ key: 'name', label: 'Name' }, ...]
        required: true
    },
    data: {
        type: Array,
        required: true
    },
    actions: {
        type: Boolean,
        default: false
    },
    loading: {
        type: Boolean,
        default: false
    }
});

const emit = defineEmits(['edit', 'delete']);
</script>

<template>
    <div class="w-full overflow-hidden rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm">
        <div class="overflow-x-auto">
            <table class="w-full text-sm text-left">
                <thead class="text-xs text-gray-500 uppercase bg-gray-50 dark:bg-zinc-800/50 dark:text-gray-400 border-b border-gray-100 dark:border-zinc-800">
                    <tr>
                        <th v-for="col in columns" :key="col.key" class="px-6 py-4 font-semibold tracking-wider">
                            {{ col.label }}
                        </th>
                        <th v-if="actions" class="px-6 py-4 font-semibold tracking-wider text-right">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-100 dark:divide-zinc-800">
                    <tr v-if="loading">
                        <td :colspan="columns.length + (actions ? 1 : 0)" class="px-6 py-8 text-center text-gray-500">
                            Loading data...
                        </td>
                    </tr>
                    <tr v-else-if="data.length === 0">
                         <td :colspan="columns.length + (actions ? 1 : 0)" class="px-6 py-8 text-center text-gray-500">
                            No items found.
                        </td>
                    </tr>
                    <tr 
                        v-else
                        v-for="item in data" 
                        :key="item.id"
                        class="bg-white dark:bg-zinc-900 hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors"
                    >
                        <td v-for="col in columns" :key="col.key" class="px-6 py-4 whitespace-nowrap text-gray-700 dark:text-gray-200">
                            <!-- Slot support for custom cell rendering -->
                            <slot :name="col.key" :item="item">
                                {{ item[col.key] }}
                            </slot>
                        </td>
                        <td v-if="actions" class="px-6 py-4 whitespace-nowrap text-right">
                            <div class="flex items-center justify-end gap-2">
                                <button 
                                    @click="$emit('edit', item)"
                                    class="p-2 text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 rounded-lg transition-colors"
                                    title="Edit"
                                >
                                    <Icon icon="mdi:pencil" />
                                </button>
                                <button 
                                    @click="$emit('delete', item.id)"
                                    class="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                    title="Delete"
                                >
                                    <Icon icon="mdi:delete" />
                                </button>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>
