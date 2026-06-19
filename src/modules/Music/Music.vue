<script setup lang="ts">
import { onMounted } from 'vue';
import MusicSwap from './MusicSwap.vue';
import ArrowLeftCircleIcon from '@iconify-vue/mdi/arrow-left-circle';
import ProfileCard from '../../components/ProfileCard.vue';
import SpotifyUser from './SpotifyUser.vue';
import { useSpotifyStore } from '../../stores/spotify.ts';
import { useMusicStore } from '../../stores/music.ts';
import { useCharacterStore } from '../../stores/character.ts';

onMounted(async () => {
    await useMusicStore().loadSongAndSpotify();
});
const increaseLevel = () => useMusicStore().increaseLevel(useCharacterStore().character.id);
const decreaseLevel = () => useMusicStore().decreaseLevel(useCharacterStore().character.id);

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
        <MusicSwap :isAppleMusic="true" :song="useMusicStore().song" :spotifyTrack="useMusicStore().spotifyTrack"
            :isAuthenticated="useSpotifyStore().isAuthenticated" @increaseLevel="increaseLevel()"
            @decreaseLevel="decreaseLevel()" />
    </div>

</template>
