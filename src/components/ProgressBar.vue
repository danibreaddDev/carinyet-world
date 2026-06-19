<script setup lang="ts">
import { computed } from 'vue';
const props = defineProps<{ value: number; height?: string }>();
const pct = computed(() => Math.max(0, Math.min(100, Math.round(props.value))));
</script>

<template>
  <div :class="[props.height ?? 'h-3', 'w-full', 'bg-pink-900/40', 'rounded-full', 'overflow-hidden']">
    <div
      class="h-full bg-gradient-to-r from-pink-400 via-pink-300 to-yellow-300 transition-all"
      :style="{ width: pct + '%' }"
      role="progressbar"
      :aria-valuenow="pct"
      aria-valuemin="0"
      aria-valuemax="100"
      :title="pct + '%'"
    />
  </div>
</template>
