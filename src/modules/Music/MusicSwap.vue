<script setup lang="ts">
import { Play, Pause, LucideHeart, LucideHeartCrack } from '@lucide/vue';
</script>
<template>
    <section class="flex flex-col gap-5">
        <div class="album flex flex-col gap-5 items-center">
            <img src="../../assets/music/portada.webp" alt="Portada del Álbum" class="rounded-2xl">

            <h2 class="text-xl text-pink-300 font-bold">Título de la Canción</h2>
            <div class="flex flex-row gap-5 items-center text-lg text-pink-200">
                <h4>Album</h4>
                <h3>Artista</h3>
            </div>
        </div>
        <div class=" flex flex-row gap-2 justify-center w-full">
            <button class="bg-pink-400 text-white p-2 rounded-full">
                <Play :size=32 />
            </button>
            <button class="bg-pink-400 text-white p-2 rounded-full">
                <Pause :size=32 />
            </button>
        </div>
        <div class="flex flex-row gap-5 items-center w-full justify-around">
            <button class="text-pink-400">
                <LucideHeart :size=56 />
            </button>
            <button class="text-pink-400">
                <LucideHeartCrack :size=56 />
            </button>
        </div>
    </section>
</template>