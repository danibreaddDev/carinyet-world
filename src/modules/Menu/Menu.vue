<script setup lang="ts">
import CharacterSelector from './Character-selector.vue';
import { useMenu } from './useMenu.ts';

const { handleStartIn } = useMenu();
</script>

<template>
    <div class="flex flex-col items-center justify-center h-screen">
        <div class="font-bold text-pink-400 self-baseline sm:self-center sm:mr-32">
            <h1 class="text-6xl">Bauti</h1>
            <div class="text-2xl text-pink-300">
                <h2>elige un personaje</h2>
                <h3>por fa</h3>
            </div>
        </div>
        <CharacterSelector @characterSelected="handleStartIn" />
    </div>
</template>