<script setup>
const props = defineProps({
  variant: {
    type: String,
    default: "default",
  },
  size: {
    type: String,
    default: "default",
  },
  class: {
    type: String,
    default: "",
  },
  type: {
    type: String,
    default: "button"
  },
  disabled: {
    type: Boolean,
    default: false
  }
});

const variants = {
  default: "bg-yellow-500 text-gray-900 hover:bg-yellow-600",
  destructive: "bg-red-500 text-white hover:bg-red-600",
  outline: "border border-gray-300 bg-white hover:bg-gray-100 text-gray-900",
  secondary: "bg-gray-200 text-gray-900 hover:bg-gray-300",
  ghost: "hover:bg-gray-100 text-gray-900",
};

const sizes = {
  default: "h-10 px-4 py-2",
  sm: "h-9 px-3 text-sm",
  lg: "h-11 px-8",
  icon: "h-10 w-10",
};

const className = [
  "inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium transition-colors",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500",
  "disabled:pointer-events-none disabled:opacity-50",
  variants[props.variant],
  sizes[props.size],
  props.class
].join(' ');
</script>

<template>
  <button :class="className" :type="type" :disabled="disabled">
    <slot />
  </button>
</template>
