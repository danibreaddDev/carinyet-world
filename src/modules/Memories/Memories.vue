<script setup lang="ts">
import { computed } from 'vue';
import { RouterLink } from 'vue-router';
import ArrowLeftCircleIcon from '@iconify-vue/mdi/arrow-left-circle';
import MemoriesList from './MemoriesList.vue';
import { useMemories } from './useMemories';
import ProfileCard from '../../components/ProfileCard.vue';
const { memoriesStore } = useMemories();
const memories = computed(() => memoriesStore.memories);
const isLoading = computed(() => memoriesStore.isLoading);
const error = computed(() => memoriesStore.error);
</script>

<template>
    <div class="flex items-center justify-between gap-4 rounded-3xl border border-pink-200 bg-white p-4 shadow-sm">
      <RouterLink to="/home" class="rounded-full border border-pink-200 bg-pink-200 p-2 text-pink-400">
        <ArrowLeftCircleIcon class="size-8" />
      </RouterLink>
      <ProfileCard />
    </div>

    <div v-if="isLoading" class="text-center text-pink-400">
      Cargando recuerdos...
    </div>

    <div v-else-if="error" class=" text-center text-rose-600">
      {{ error }}
    </div>

    <MemoriesList v-else :memories="memories" />
</template>
