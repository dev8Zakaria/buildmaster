<script setup>
import { computed } from 'vue';
import { cn } from '@/lib/utils';
import { Icon } from '@iconify/vue';

const props = defineProps({
    steps: {
        type: Array,
        required: true
        // { id, label }
    },
    currentIndex: {
        type: Number,
        default: 0
    },
    completedSteps: {
        type: Object,
        default: () => ({})
        // { stepId: boolean }
    }
});

const emit = defineEmits(['step-click']);

const getStepStatus = (index, stepId) => {
    if (index < props.currentIndex) return 'completed';
    if (index === props.currentIndex) return 'current';
    return 'upcoming';
};
</script>

<template>
    <div class="w-full">
        <nav aria-label="Progress">
            <ol class="flex items-center">
                <li 
                    v-for="(step, index) in steps" 
                    :key="step.id"
                    class="relative flex-1"
                    :class="{ 'pr-8 sm:pr-20': index !== steps.length - 1 }"
                >
                    <!-- Connector Line -->
                    <div 
                        v-if="index !== steps.length - 1"
                        class="absolute top-4 left-7 -ml-px w-full h-0.5"
                        :class="index < currentIndex ? 'bg-yellow-500' : 'bg-gray-200 dark:bg-zinc-700'"
                    />

                    <!-- Step Circle + Label -->
                    <button
                        @click="emit('step-click', index)"
                        class="group relative flex flex-col items-center cursor-pointer"
                        :class="{ 'pointer-events-none': index > currentIndex }"
                    >
                        <!-- Circle -->
                        <span
                            :class="cn(
                                'flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all z-10',
                                getStepStatus(index, step.id) === 'completed' && 'bg-yellow-500 border-yellow-500 text-white',
                                getStepStatus(index, step.id) === 'current' && 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400',
                                getStepStatus(index, step.id) === 'upcoming' && 'border-gray-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-gray-500 dark:text-gray-400',
                                props.completedSteps[step.id] && getStepStatus(index, step.id) === 'current' && 'ring-2 ring-green-500 ring-offset-2 dark:ring-offset-zinc-900'
                            )"
                        >
                            <Icon 
                                v-if="getStepStatus(index, step.id) === 'completed' || props.completedSteps[step.id]" 
                                icon="mdi:check" 
                                class="text-lg"
                            />
                            <span v-else class="text-xs font-semibold">{{ index + 1 }}</span>
                        </span>

                        <!-- Label -->
                        <span 
                            class="mt-2 text-xs font-medium text-center whitespace-nowrap"
                            :class="getStepStatus(index, step.id) === 'current' ? 'text-yellow-600 dark:text-yellow-400' : 'text-gray-500 dark:text-gray-400'"
                        >
                            {{ step.label }}
                        </span>
                    </button>
                </li>
            </ol>
        </nav>
    </div>
</template>
