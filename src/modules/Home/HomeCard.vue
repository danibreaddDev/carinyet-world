<script setup lang="ts">
import { RouterLink } from 'vue-router';
defineProps<{
    title?: string;
    characterId?: string;
    tag?: string;
}>();
</script>
<template>
    <RouterLink to="/music" class="border border-pink-300 p-5 bg-white h-56 relative flex flex-col  ">
        <h2 class="text-3xl text-pink-300 font-primary font-bold">{{ title }}</h2>
        <img :src="'src/assets/home/' + characterId + '_' + tag + '.png'" :alt="characterId"
            class="absolute bottom-0 right-0 size-28">
    </RouterLink>
</template>
