<script setup lang="ts">
import { RouterLink } from 'vue-router';
defineProps<{
    title?: string;
    characterId?: string;
    tag?: string;
    to: string;
}>();
</script>
<template>
    <RouterLink :to="to" class="border rounded-2xl border-pink-300 p-5 bg-white flex flex-col items-center">
        <h2 class="text-3xl text-pink-300 font-primary font-bold">{{ title }}</h2>
        <img :src="tag ? '/assets/home/' + characterId + '_' + tag + '.png' : '/assets/home/default.png'"
            :alt="characterId" class="size-28">
    </RouterLink>
</template>
