<script setup lang="ts">
import { computed } from 'vue';
const props = defineProps<{ value: number; height?: string }>();
const pct = computed(() => Math.max(0, Math.min(100, props.value)));
</script>

<template>
  <div :class="[props.height ?? 'h-3', 'w-full', 'bg-pink-900/40', 'rounded-full', 'overflow-hidden']">
    <div
      class="h-full transition-all duration-300"
      :style="{
        width: pct + '%',
        background: 'linear-gradient(to right, #f472b6, #fb7185, #facc15)'
      }"
      role="progressbar"
      :aria-valuenow="pct"
      aria-valuemin="0"
      aria-valuemax="100"
      :title="pct + '%'"
    ></div>
  </div>
</template>
