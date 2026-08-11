<script setup lang="ts">
import type { GoofyNote } from '../../stores/goofynotes';
import { RouterLink } from 'vue-router';
defineProps<{
  note: GoofyNote;
}>();
</script>
<template>
    <RouterLink :to="`/goofy-notes/${note.id}`" class="flex flex-col gap-2 rounded-3xl border border-pink-200 bg-white p-4 shadow-sm">
        <h3 class="text-2xl font-bold text-pink-300">{{ note.name }}</h3>
        <div class="flex flex-row items-center gap-5">
            <span v-for="participant in note.participants" :key="participant" class="font-bold text-lg text-pink-200 rounded-full  border border-pink-200  px-3 py-2 w-fit">
                {{ participant }}
            </span>
        </div>
    </RouterLink>
</template>