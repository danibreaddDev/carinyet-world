<script setup lang="ts">
import { RouterLink } from 'vue-router';
import { onMounted, computed, ref, watch } from 'vue';
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
const intLevel = ref(Math.trunc(level.value));
const progressPct = ref(0);

function computeProgress(current: number) {
    if (Number.isInteger(current)) {
        return 0;
    }

    const currentLevel = Math.trunc(current);
    return Math.round(Math.max(0, Math.min(100, Math.abs(current - currentLevel) * 100)));
}

watch(level, (current) => {
    intLevel.value = Math.trunc(current);
    progressPct.value = computeProgress(current);
}, { immediate: true });
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
