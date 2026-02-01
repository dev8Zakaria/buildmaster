<script lang="ts" setup>
import type { HTMLAttributes } from "vue";
import { computed, onMounted, onUnmounted, reactive } from "vue";

interface InteractiveGridPatternProps {
  className?: HTMLAttributes["class"];
  squaresClassName?: HTMLAttributes["class"];
  width?: number;
  height?: number;
  squares?: [number, number];
}

const props = withDefaults(defineProps<InteractiveGridPatternProps>(), {
  width: 40,
  height: 40,
  squares: () => [24, 24],
});

const horizontal = computed(() => props.squares[0]);
const vertical = computed(() => props.squares[1]);

const totalSquares = computed(() => horizontal.value * vertical.value);

const activeSquares = reactive(new Set<number>());
let animationInterval: ReturnType<typeof setInterval> | null = null;
const SNAKE_COUNT = 20; // Number of simultaneous trails
const TRAIL_LENGTH = 1000; // How long a square stays lit (ms)
const UPDATE_SPEED = 40; // Speed of movement (ms)

// Store current head positions for each snake
const snakeHeads = reactive<number[]>([]);

const gridWidth = computed(() => props.width * horizontal.value);
const gridHeight = computed(() => props.height * vertical.value);

function getX(index: number) {
  return (index % horizontal.value) * props.width;
}

function getY(index: number) {
  return Math.floor(index / horizontal.value) * props.height;
}

const svgClass = computed(() => [
  "absolute inset-0 h-full w-full border border-gray-200/30",
  props.className,
]);

function getRectClass(index: number) {
  return [
    "stroke-gray-300/40 transition-all duration-300 ease-in-out", // Faster transition for snake movement
    activeSquares.has(index) ? "fill-yellow-400/30" : "fill-transparent", // More visible yellow
    props.squaresClassName,
  ];
}

// Helper to get valid neighbors (Up, Right, Down, Left) - Restricted to top half
function getNeighbors(index: number): number[] {
  const h = horizontal.value;
  const v = vertical.value;
  const limitY = Math.floor(v / 2); // Limit to top 50%
  const neighbors: number[] = [];
  
  const x = index % h;
  const y = Math.floor(index / h);

  if (x > 0) neighbors.push(index - 1); // Left
  if (x < h - 1) neighbors.push(index + 1); // Right
  if (y > 0) neighbors.push(index - h); // Up
  if (y < limitY - 1) neighbors.push(index + h); // Down (restricted)

  return neighbors;
}

onMounted(() => {
  const h = horizontal.value;
  const limitY = Math.floor(vertical.value / 2); // Half height
  const maxIndex = h * limitY; // Total squares in top half

  // Initialize snakes at random positions in the TOP HALF only
  for (let i = 0; i < SNAKE_COUNT; i++) {
    snakeHeads.push(Math.floor(Math.random() * maxIndex));
  }

  // Start animation loop
  animationInterval = setInterval(() => {
    if (totalSquares.value > 0) {
      // Move each snake independent of others
      for (let i = 0; i < snakeHeads.length; i++) {
        const currentHead = snakeHeads[i];
        
        // Light up current position
        activeSquares.add(currentHead);

        // Schedule fade out
        setTimeout(() => {
          activeSquares.delete(currentHead);
        }, TRAIL_LENGTH);

        // Move to random neighbor
        const neighbors = getNeighbors(currentHead);
        if (neighbors.length > 0) {
          const nextHead = neighbors[Math.floor(Math.random() * neighbors.length)];
          snakeHeads[i] = nextHead; // Directly update index
        } else {
          // If stuck (rare) or out of bounds, respawn randomly in top half
          snakeHeads[i] = Math.floor(Math.random() * maxIndex);
        }
      }
    }
  }, UPDATE_SPEED);
});

onUnmounted(() => {
  if (animationInterval) clearInterval(animationInterval);
});
</script>

<template>
  <svg
    :width="gridWidth"
    :height="gridHeight"
    :class="svgClass"
    preserveAspectRatio="none"
  >
    <rect
      v-for="(_, index) in totalSquares"
      :key="index"
      :x="getX(index)"
      :y="getY(index)"
      :width="width"
      :height="height"
      :class="getRectClass(index)"
    />
  </svg>
</template>

