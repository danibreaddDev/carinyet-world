<script setup lang="ts">

import HomeCard from './HomeCard.vue';
import { RouterLink } from 'vue-router';
import ArrowLeftCircleIcon from '@iconify-vue/mdi/arrow-left-circle';
import ProfileCard from '../../components/ProfileCard.vue';


const selectedCharacter = sessionStorage.getItem('selectedCharacter') ?? 'kuromi';


</script>
<template>
    <RouterLink to="/" class="text-pink-200 border p-2 bg-pink-200 rounded-full w-fit">
        <ArrowLeftCircleIcon class="text-pink-400 size-8" />
    </RouterLink>
    <section class="flex flex-col gap-5">
        <ProfileCard />
        <h2 class="text-3xl font-primary text-pink-300">Bienvenida <span class="text-pink-400">Carinyet𓏲ּ𝄢</span>
        </h2>
    </section>
    <section class="grid grid-cols-2 gap-5 w-full">
        <HomeCard :title="'Musiquita'" :character-id="selectedCharacter" :tag="'music'" to="music" />
        <HomeCard :title="'Planner'" :character-id="selectedCharacter" to="planner" />
    </section>



</template>
