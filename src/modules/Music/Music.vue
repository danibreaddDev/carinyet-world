<script setup lang="ts">
import { onMounted } from 'vue';
import MusicSwap from './MusicSwap.vue';
import ArrowLeftCircleIcon from '@iconify-vue/mdi/arrow-left-circle';
import ProfileCard from '../../components/ProfileCard.vue';
import SpotifyUser from './SpotifyUser.vue';
import { useSpotifyStore } from '../../stores/spotify.ts';
import { useMusicStore } from '../../stores/music.ts';

const spotifyStore = useSpotifyStore();
const musicStore = useMusicStore();

onMounted(async () => {
    await musicStore.loadSongAndSpotify();
});
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
            :isAuthenticated="spotifyStore.isAuthenticated" />
    </div>

</template>
