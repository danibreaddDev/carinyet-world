<script setup lang="ts">

import HomeCard from './HomeCard.vue';
import { RouterLink } from 'vue-router';
import ArrowLeftCircleIcon from '@iconify-vue/mdi/arrow-left-circle';
import ProfileCard from '../../components/ProfileCard.vue';


const selectedCharacter = sessionStorage.getItem('selectedCharacter') ?? 'kuromi';


</script>
<template>

    <section class="flex flex-col gap-5">
        <ProfileCard />
        <h2 class="text-3xl font-primary text-pink-300">Bienvenida <span class="text-pink-400">Carinyet𓏲ּ𝄢</span>
        </h2>
    </section>
    <section class="grid grid-cols-1 gap-5 w-full">
        <HomeCard :title="'Musiquita'" :character-id="selectedCharacter" :tag="'music'" />
    </section>
    <RouterLink to="/" class="text-pink-200 flex flex-row gap-2 items-center mt-5">
        <ArrowLeftCircleIcon class="text-pink-300 size-4" />
        <h2 class="text-xl font-primary">seleccion de personaje</h2>
    </RouterLink>


</template>