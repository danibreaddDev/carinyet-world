<script setup lang="ts">
import { RouterLink } from 'vue-router';
import { onMounted, computed } from 'vue';
import { useCharacterStore } from '../stores/character';
import ProgressBar from './ProgressBar.vue';

const getCharacterInfo = async () => {
    const selectedCharacter = sessionStorage.getItem('selectedCharacter') ?? 'kuromi';
    await useCharacterStore().loadCharacter(selectedCharacter);
}
onMounted(() => {
    getCharacterInfo();
})

const level = computed(() => useCharacterStore().character.level ?? 0);
const intLevel = computed(() => Math.floor(level.value));
const progressPct = computed(() => {
    const p = (level.value - intLevel.value) * 100;
    return Math.round(Math.max(0, Math.min(100, p)));
});
</script>
<template>
    <RouterLink to="/profile" class="flex flex-row gap-2 items-center w-fit px-4 py-2">
        <img :src="'/assets/home/' + useCharacterStore().character.id + '_icon.png'" alt="" class="size-24">
        <div class="flex flex-col">
            <div class="text-lg font-primary text-pink-300">Nivel {{ intLevel }}</div>
            <div class="w-36">
                <ProgressBar :value="progressPct" />
            </div>
        </div>

    </RouterLink>
</template>
