<script setup lang="ts">

import HomeCard from './HomeCard.vue';
import { RouterLink } from 'vue-router';
import ArrowLeftCircleIcon from '@iconify-vue/mdi/arrow-left-circle';
import ProfileCard from '../../components/ProfileCard.vue';


const selectedCharacter = sessionStorage.getItem('selectedCharacter') ?? 'kuromi';


</script>
<template>
    <div class="flex items-center justify-between gap-4 rounded-3xl border border-pink-200 bg-white p-4 shadow-sm mb-5">
        <RouterLink to="/" class="text-pink-200 border p-2 bg-pink-200 rounded-full w-fit">
            <ArrowLeftCircleIcon class="text-pink-400 size-8" />
        </RouterLink>
        <ProfileCard />
    </div>

    <section class="flex flex-col gap-5">
        <h2 class="text-3xl font-primary text-pink-300">Bienvenida <span class="text-pink-400">Carinyet𓏲ּ𝄢</span>
        </h2>
    </section>
    <section class="grid grid-cols-2 gap-5 w-full">
        <HomeCard :title="'Musiquita'" :character-id="selectedCharacter" :tag="'music'" to="music" />
        <HomeCard :title="'Planes'" :character-id="selectedCharacter" to="plans" />
    </section>
</template>
