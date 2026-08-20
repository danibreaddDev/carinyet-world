<script setup lang="ts">

import { ref } from 'vue';
import HomeCard from './HomeCard.vue';
import { RouterLink } from 'vue-router';
import ArrowLeftCircleIcon from '@iconify-vue/mdi/arrow-left-circle';
import ProfileCard from '../../components/ProfileCard.vue';
import SpotifyUser from '../Music/SpotifyUser.vue';
import exclamationIcon from "@iconify-vue/boxicons/message-circle-exclamation-filled"
const selectedCharacter = sessionStorage.getItem('selectedCharacter') ?? 'kuromi';
const isModalOpen = ref(false);
const isProposalModalOpen = ref(false);

function closeModal() {
    isModalOpen.value = false;
}

function openProposalModal() {
    isModalOpen.value = false;
    isProposalModalOpen.value = true;
}

function closeProposalModal() {
    isProposalModalOpen.value = false;
}

</script>
<template>
    <div class="flex items-center justify-between gap-4 rounded-3xl border border-pink-200 bg-white p-4 shadow-sm mb-5">
        <RouterLink to="/" class="text-pink-200 border p-2 bg-pink-200 rounded-full w-fit">
            <ArrowLeftCircleIcon class="text-pink-400 size-8" />
        </RouterLink>
        <ProfileCard />
    </div>

    <section class="flex flex-col gap-5">
    <div class="flex flex-col gap-2">
        <h2 class="text-3xl font-primary text-pink-300">Bienvenida <span class="text-pink-400">Carinyet𓏲ּ𝄢</span>
        </h2>
       <button
            type="button"
            class="relative w-fit self-center px-5 py-2"
            aria-label="Abrir mensaje"
            @click="isModalOpen = true"
        >
            <img src="/assets/go-out/kuromi-go-out.png" alt="kuromi-go-out" class="size-24">
            <exclamationIcon class="absolute top-0 right-0 size-6 translate-x-4 translate-y-5 text-pink-400 animate-ping [animation-duration:3s]" />
        </button> 
    </div>
         <SpotifyUser />
    </section>
    <section class="grid grid-cols-2 gap-5 w-full">
        <HomeCard :title="'Musiquita'" :character-id="selectedCharacter" :tag="'music'" to="music" />
        <HomeCard :title="'Planes'" :character-id="selectedCharacter" to="plans" />
        <HomeCard :title="'Recuerdos'" :character-id="selectedCharacter" to="memories" :tag="'memories'" />
        <HomeCard :title="'Goofy notes'" :character-id="selectedCharacter" to="goofy-notes" :tag="'goofy'" />

    </section>

    <div
        v-if="isModalOpen"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
        @click="closeModal"
    >
        <div
            class="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-labelledby="go-out-message-title"
            @click.stop
        >
            <button
                type="button"
                class="absolute right-4 top-3 text-2xl text-gray-500 transition hover:text-gray-700"
                aria-label="Cerrar mensaje"
                @click="closeModal"
            >
                ✕
            </button>
            <h3 id="go-out-message-title" class="mb-3 text-3xl font-black text-pink-400">¡Hola Bebé!</h3>
                <p class="text-gray-600 text-xl">Espero que te haya gustado el album que te he preparado!!!!</p>
                <p class="text-gray-600 text-xl">Despues de que estemos pensando tanto tiempo el uno para el otro</p>
                <p class="text-gray-600 text-xl"> Mientras estabamos cada uno de viaje,no podiamos casi vernos y que hayas dedicado tu tiempo en pensar este día en Peñiscola</p>
                <p class="text-gray-600 text-xl">Me gustaría dar el paso y decirte lo siguiente:</p>
            <button
                type="button"
                class="mt-6 rounded-full bg-pink-300 px-6 py-3 font-bold text-white transition hover:bg-pink-400"
                @click="openProposalModal"
            >
                Mostrar
            </button>
        </div>
    </div>

    <div
        v-if="isProposalModalOpen"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
        @click="closeProposalModal"
    >
        <div
            class="relative w-full max-w-sm rounded-2xl bg-white p-8 text-center shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-labelledby="proposal-title"
            @click.stop
        >
            <button
                type="button"
                class="absolute right-4 top-3 text-2xl text-gray-500 transition hover:text-gray-700"
                aria-label="Cerrar pregunta"
                @click="closeProposalModal"
            >
                ✕
            </button>
            <h3 id="proposal-title" class="pt-3 text-3xl font-black text-pink-400">¿Quiéres ser mi novia?</h3>
        </div>
    </div>
</template>
