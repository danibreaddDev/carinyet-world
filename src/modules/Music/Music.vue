<script setup lang="ts">
import { onMounted } from 'vue';
import { RouterLink } from 'vue-router';
import MusicSwap from './MusicSwap.vue';
import ArrowLeftCircleIcon from '@iconify-vue/mdi/arrow-left-circle';
import ProfileCard from '../../components/ProfileCard.vue';
import SpotifyUser from '../../modules/Music/SpotifyUser.vue';
import { useSpotifyStore } from '../../stores/spotify.ts';
import { useMusicStore } from '../../stores/music.ts';
import { useCharacterStore } from '../../stores/character.ts';

const spotifyStore = useSpotifyStore();
const musicStore = useMusicStore();
const characterStore = useCharacterStore();

onMounted(async () => {
    await musicStore.loadSongAndSpotify();
});

const handleIncreaseLevel = async () => {
    await characterStore.increaseLevel();
    await musicStore.deleteSongRecommendation();
    await musicStore.loadSongAndSpotify();
};

const handleDecreaseLevel = async () => {
    await characterStore.decreaseLevel();
    await musicStore.deleteSongRecommendation();
    await musicStore.loadSongAndSpotify();
};
</script>
<template>
    <div class="flex flex-col gap-5 w-full">
        <ProfileCard />
        <div class="flex flex-row gap-5 justify-between items-center">
            <RouterLink to="/home" class="text-pink-200 border p-2 bg-pink-200 rounded-full w-fit">
                <ArrowLeftCircleIcon class="text-pink-400 size-8" />
            </RouterLink>
            <SpotifyUser />
        </div>
        <MusicSwap :isAppleMusic="true" :song="musicStore.song" :spotifyTrack="musicStore.spotifyTrack"
            :isAuthenticated="spotifyStore.isAuthenticated" @increaseLevel="handleIncreaseLevel"
            @decreaseLevel="handleDecreaseLevel" />
    </div>
</template>
