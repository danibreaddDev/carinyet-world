<script setup lang="ts">
import { ref } from 'vue';
import type { MemoryItem } from '../../stores/memories';

interface Props {
  memory: MemoryItem;
  size?: 'small' | 'medium' | 'large';
}

const props = withDefaults(defineProps<Props>(), {
  size: 'medium',
});

const isExpanded = ref(false);

const sizeClasses = {
  small: 'col-span-1 row-span-1',
  medium: 'col-span-1 row-span-2',
  large: 'col-span-2 row-span-2',
};

function closeModal() {
  isExpanded.value = false;
}
</script>

<template>
  <div>
    <article
      class="relative overflow-hidden rounded-3xl border border-pink-200 bg-white shadow-sm h-full cursor-pointer hover:shadow-lg transition-shadow"
      :class="sizeClasses[size]"
      @click="isExpanded = true"
    >
      <img
        :src="props.memory.imageUrl"
        :alt="props.memory.id.toString()"
        class="h-full w-full object-cover"
      />

      <div class="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/60 to-transparent p-4">
        <p class="text-sm font-medium text-white">
          {{ new Date(props.memory.date).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }) }}
        </p>
      </div>
    </article>

    <Teleport to="body">
      <div
        v-if="isExpanded"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
        @click="closeModal"
      >
        <button
          class="absolute top-4 right-4 z-10 text-white hover:text-pink-300 transition-colors"
          @click="closeModal"
        >
          <svg class="size-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <img
          :src="props.memory.imageUrl"
          :alt="props.memory.id.toString()"
          class="max-h-[90vh] max-w-[90vw] object-contain rounded-2xl"
          @click.stop
        />
      </div>
    </Teleport>
  </div>
</template>
