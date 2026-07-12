<script setup lang="ts">
import arrowLeftCircleIcon from '@iconify-vue/mdi/arrow-left-circle';
import { RouterLink } from 'vue-router';
import ProfileCard from '../../components/ProfileCard.vue';
import { useMusicPage } from './useMusicPage.ts';
import { onMounted } from 'vue';
import MusicFeedbackCard from './MusicFeedbackCard.vue';
const {musicStore} = useMusicPage();
onMounted(async () => {
    await musicStore.loadFeedbacks();
  });
</script>
<template>
    <div class="flex items-center justify-between gap-4 rounded-3xl border border-pink-200 bg-white p-4 shadow-sm">
            <RouterLink to="/music" class="text-pink-200 border p-2 bg-pink-200 rounded-full w-fit">
                <arrowLeftCircleIcon class="text-pink-400 size-8" />
            </RouterLink>
            <ProfileCard />
        </div>
        <h1 class="text-2xl text-pink-300 font-bold">Estas opiniones van misa...</h1>
        <section class="grid grid-cols-1 gap-5">
        <MusicFeedbackCard v-if="musicStore.feedbacks.length > 0" v-for="feedback in musicStore.feedbacks" :feedback="feedback" :key="feedback.song" />
        <div v-else class="text-pink-300 text-sm">No hay opiniones disponibles.</div>
        </section>
</template>