<script setup lang="ts">
import SpotifyIcon from '@iconify-vue/mdi/spotify';
import { useSpotifyAuth } from './useSpotifyAuth.ts';

const { spotifyStore, signInWithSpotify, logout } = useSpotifyAuth();
</script>
<template>
    <button @click="spotifyStore.isAuthenticated ? logout() : signInWithSpotify()">
        <div v-if="spotifyStore.isAuthenticated" class="flex flex-row gap-2 items-center">
            <img v-if="spotifyStore.user?.imageUrl" :src="spotifyStore.user.imageUrl" alt=""
                class="size-10 rounded-full object-cover">
            <span>{{ spotifyStore.user?.displayName }}</span>
        </div>
        <div v-else class="flex flex-row gap-2 items-center border bg-white w-fit">
            <SpotifyIcon class="size-12 text-green-500" />

        </div>
    </button>
</template>
