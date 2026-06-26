<script setup lang="ts">
import { RouterLink } from 'vue-router';
import MusicSwap from './MusicSwap.vue';
import ArrowLeftCircleIcon from '@iconify-vue/mdi/arrow-left-circle';
import ProfileCard from '../../components/ProfileCard.vue';
import SpotifyUser from '../../modules/Music/SpotifyUser.vue';
import { useMusicPage } from './useMusicPage.ts';

const { spotifyStore, musicStore, handleIncreaseLevel, handleDecreaseLevel } = useMusicPage();
</script>
<template>
    <div class="flex flex-col gap-5 w-full">
        <div class="flex items-center justify-between gap-4 rounded-3xl border border-pink-200 bg-white p-4 shadow-sm">
            <RouterLink to="/home" class="text-pink-200 border p-2 bg-pink-200 rounded-full w-fit">
                <ArrowLeftCircleIcon class="text-pink-400 size-8" />
            </RouterLink>
            <ProfileCard />
        </div>

        <SpotifyUser />

        <MusicSwap :isAppleMusic="true" :song="musicStore.song" :spotifyTrack="musicStore.spotifyTrack"
            :isAuthenticated="spotifyStore.isAuthenticated" @increaseLevel="handleIncreaseLevel"
            @decreaseLevel="handleDecreaseLevel" />
    </div>
</template>
