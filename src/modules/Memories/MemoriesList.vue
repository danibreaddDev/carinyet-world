<script setup lang="ts">
import type { MemoryItem } from '../../stores/memories';
import MemoriesCard from './MemoriesCard.vue';

const props = defineProps<{
  memories: MemoryItem[];
}>();

function getMemorySize(index: number): 'small' | 'medium' | 'large' {
  const pattern = [2, 1, 1, 2, 0, 1];
  const sizeMap = { 0: 'large', 1: 'medium', 2: 'small' } as const;
  return sizeMap[pattern[index % pattern.length] as keyof typeof sizeMap];
}
</script>

<template>
  <section class="grid grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-[300px]">
    <MemoriesCard
      v-for="(memory, index) in props.memories"
      :key="memory.id"
      :memory="memory"
      :size="getMemorySize(index)"
    />
  </section>
</template>
