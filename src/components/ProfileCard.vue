<script setup lang="ts">
import { RouterLink } from 'vue-router';
import { onMounted } from 'vue';
import { useCharacterStore } from '../stores/character';

const store = useCharacterStore();

async function getCharacterInfo() {
    const selectedCharacter = sessionStorage.getItem('selectedCharacter') ?? 'kuromi';
    await store.loadCharacter(selectedCharacter);
}
onMounted(() => {
    getCharacterInfo();
})
</script>
<template>
    <RouterLink to="/profile" class="flex flex-row gap-1 items-center w-fit px-4 py-2">

        <img :src="'src/assets/home/' + store.character.id + '_icon.png'" alt="" class="size-24">
        <span class="text-lg font-primary text-pink-300">Nivel {{ store.character.level }}</span>

    </RouterLink>
</template>
