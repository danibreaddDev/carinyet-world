<script setup lang="ts">
import { ref, watch, computed, toRefs } from 'vue';
import plusIcon from '@iconify-vue/mdi/plus-circle';
import deleteIcon from '@iconify-vue/mdi/cross-circle-outline';
const props = withDefaults(
  defineProps<{
    participant: string;
    moments: string[];
    noteId?: string | number;
    tags?: string[];
    color?: 'purple' | 'pink' | 'yellow' | 'blue';
  }>(),
  {
    tags: () => ['UX', 'Research', 'UI'],
    color: 'blue',
  }
);

const emits = defineEmits<{
  (e: 'update', payload: string[]): void;
  (e: 'request-save'): void;
}>();

const { participant, moments, color } = toRefs(props);

const localMoments = ref<string[]>([]);
const input = ref('');

watch(moments, (value) => {
  localMoments.value = (value ?? []).slice();
}, { immediate: true });

function add() {
  const value = input.value.trim();
  if (!value) return;
  localMoments.value.unshift(value);
  input.value = '';
  emits('update', localMoments.value.slice());
  emits('request-save');
}

function remove(index: number) {
  localMoments.value.splice(index, 1);
  emits('update', localMoments.value.slice());
  emits('request-save');
}

const fillColor = computed(() => {
  const map: Record<string, string> = {
    purple: '#E3E0F8',
    pink: '#FDE2DC',
    yellow: '#FFF6C8',
    blue: '#DDF2FF',
  };
  return map[color.value ?? 'blue'] ?? '#DDF2FF';
});

const colorClasses = computed(() => {
  return {
    purple: {
      title: 'text-[#1E1B2E]',
      text: 'text-[#6C6682]',
    },
    pink: {
      title: 'text-[#1E1B2E]',
      text: 'text-[#7A6765]',
    },
    yellow: {
      title: 'text-[#1E1B2E]',
      text: 'text-[#736F52]',
    },
    blue: {
      title: 'text-[#1E1B2E]',
      text: 'text-[#5C7180]',
    },
  }[color.value];
});

const accent = computed(() => {
  return ({
    purple: '#6D28D9',
    pink: '#EC4899',
    yellow: '#D97706',
    blue: '#0EA5E9',
  } as Record<string, string>)[color.value ?? 'blue'];
});

const light = computed(() => {
  return ({
    purple: '#EDE9FE',
    pink: '#FDE8EE',
    yellow: '#FFFBEB',
    blue: '#E6F9FF',
  } as Record<string, string>)[color.value ?? 'blue'];
});
</script>

<template>
  <article class="relative w-full flex flex-col gap-5">
    <svg class="absolute inset-0 w-full h-full block pointer-events-none" viewBox="0 0 304 104" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M23 7 C17 7 11 9 8 14 C5 18 5 23 5 28 L5 91 C5 96 9 99 14 99 C70 99 125 101 176 99 C220 98 260 97 285 98 C291 98 294 94 294 89 L294 25 C294 17 291 11 285 8 C280 6 275 7 268 7 C180 10 100 10 23 7 Z"
        :fill="fillColor"
      />

    </svg>
    <div v-if="participant === 'MAR' || participant=== 'Mar' || participant === 'mar'" class="absolute inset-0 top-0 -translate-4">
        <img src="/assets/goofy-notes/mar-minion.png" alt="mar-minion" class="size-20">
    </div>

    <div class="p-8 box-border relative z-10">
      <div class="flex items-center justify-between px-3 gap-2.5">
        <h3 class="text-2xl font-extrabold leading-snug tracking-tight" :class="colorClasses.title">{{ participant }}</h3>
        <span class="font-bold text-3xl" :class="colorClasses.text">{{ moments.length }}</span>
    </div>

      <div class="flex flex-col mt-4 space-y-2.5">
        <div v-for="(moment, index) in localMoments" :key="index" class="flex items-center justify-between px-3 gap-2.5">
          <span class="truncate text-[14px] font-medium leading-tight" :class="colorClasses.text">{{ moment }}</span>
          <button type="button" class="flex size-5 items-center justify-center rounded-full transition" @click="() => remove(index)" :style="{ color: accent }">
            <deleteIcon class="size-8" :style="{ color: accent }" />
          </button>
        </div>

        <div v-if="!localMoments.length" class="text-[13px] opacity-70" :class="colorClasses.text">No hay monguerias</div>

        <div class="mt-2 flex items-center gap-2">
          <input v-model="input" type="text" class="flex-1 rounded-full border border-gray-200 bg-white/60 px-3 py-2 text-sm outline-none" @keyup.enter="add" />
          <button type="button" class="rounded-full p-2" @click="add" :style="{ background: light, border: '1px solid ' + light, color: accent }" aria-label="Añadir momento">
            <plusIcon class="size-6" :style="{ color: accent }" />
          </button>
        </div>
      </div>
    </div>
  </article>
</template>
