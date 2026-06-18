<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import type { User } from '@supabase/supabase-js';
import SpotifyIcon from '@iconify-vue/mdi/spotify';
import { useSpotifyStore, type SpotifyUser } from '../../stores/spotify';
import { supabase } from '../../core/lib/supabaseClient';

const spotifyStore = useSpotifyStore();
let unsubscribeAuth: (() => void) | undefined;

function mapSupabaseUser(user: User): SpotifyUser {
    const metadata = user.user_metadata;

    return {
        id: user.id,
        displayName: metadata.full_name ?? metadata.name ?? metadata.user_name ?? user.email ?? 'Spotify',
        email: user.email,
        imageUrl: metadata.avatar_url ?? metadata.picture,
    };
}

const signInWithSpotify = async () => {
    if (spotifyStore.isAuthenticated) return;

    const { error } = await supabase.auth.signInWithOAuth({
        provider: 'spotify',
        options: {
            redirectTo: `${window.location.origin}`,
            scopes: 'user-read-email user-read-private user-modify-playback-state user-read-playback-state',
        },
    });

    if (error) console.error('Spotify login error:', error.message);
};

const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.error('Spotify logout error:', error.message);

    spotifyStore.logout();
};

onMounted(async () => {
    const { data } = await supabase.auth.getUser();
    if (data.user) spotifyStore.setUser(mapSupabaseUser(data.user));

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
            spotifyStore.setUser(mapSupabaseUser(session.user));
            return;
        }

        spotifyStore.logout();
    });

    unsubscribeAuth = () => listener.subscription.unsubscribe();
});

onUnmounted(() => {
    unsubscribeAuth?.();
});
</script>
<template>
    <button @click="spotifyStore.isAuthenticated ? logout() : signInWithSpotify()">
        <div v-if="spotifyStore.isAuthenticated" class="flex flex-row gap-2 items-center">
            <img v-if="spotifyStore.user?.imageUrl" :src="spotifyStore.user.imageUrl" alt=""
                class="size-10 rounded-full object-cover">
            <span>{{ spotifyStore.user?.displayName }}</span>
        </div>
        <div v-else class="flex flex-row gap-2 items-center border bg-white">
            <SpotifyIcon class="size-12 text-green-500" />

        </div>
    </button>
</template>
