<script setup lang="ts">
import SpotifyIcon from '@iconify-vue/mdi/spotify';
import CardsHeartIcon from '@iconify-vue/mdi/cards-heart';
import HeartOffIcon from '@iconify-vue/mdi/heart-off';
import type { DbSong, SpotifyTrack } from '../../stores/music';
import appleMusicIcon from "@iconify-vue/mdi/apple"

const props = defineProps<{
    isAuthenticated: boolean;
    song: DbSong | null;
    spotifyTrack: SpotifyTrack | null;
    isAppleMusic: boolean;
}>();
const emit = defineEmits<{
    (e: 'increaseLevel'): void;
    (e: 'decreaseLevel'): void;
}>();
/** Logica para cuando el usuario es premium, puede añadirle la cancion a la reproduccion */
const openInSpotify = async () => {
    const tokenObj = localStorage.getItem('sb-hjuacsvuuqkexnpfhywo-auth-token');
    if (!tokenObj) {
        console.error('No se encontró el token de autenticación de Spotify.');
        return;
    }

    const token = JSON.parse(tokenObj).provider_token;
    if (!token) {
        console.error('El token de Spotify no es válido.');
        return;
    }

    const trackId = props.spotifyTrack?.id ?? props.song?.id;
    if (!trackId) {
        console.error('No hay ID de pista para reproducir.');
        return;
    }

    await fetch(`https://api.spotify.com/v1/me/player/play`, {
        method: 'PUT',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            uris: [`spotify:track:${trackId}`]
        })
    });
};
</script>
<template>
    <section v-if="isAuthenticated" class="flex flex-col gap-5">
        <Transition name="swap" mode="out-in">
            <div v-if="song && spotifyTrack" :key="props.song?.id ?? props.spotifyTrack?.id ?? 'no-song'"
                class="flex flex-col gap-2">
                <div class="album flex flex-col gap-5 items-center">
                    <img v-if="props.spotifyTrack?.imageUrl" :src="props.spotifyTrack.imageUrl" alt="Portada del Álbum"
                        class="rounded-2xl" />

                    <h2 class="text-xl text-pink-300 font-bold">
                        {{ props.spotifyTrack?.name ?? 'Título de la Canción' }}
                    </h2>
                    <div class="flex flex-row gap-5 items-center text-lg text-pink-200">
                        <h4>{{ props.spotifyTrack?.album ?? 'Álbum' }}</h4>
                        <h3>{{ props.spotifyTrack?.artists?.join(', ') ?? 'Artista' }}</h3>
                    </div>
                    <div class="flex flex-row items-center gap-5">
                        <p class="text-sm text-pink-200">{{ props.song?.message ?? '' }}</p>
                        <a v-if="isAppleMusic" target="_blank"
                            :href="`https://music.apple.com/es/album/${props.song?.id}?i=${props.song?.id}`"
                            class="flex items-center justify-center gap-2 bg-pink-200 text-pink-400 p-2 rounded-full">
                            <appleMusicIcon class="size-6" />
                        </a>

                        <button v-else @click=" openInSpotify()"
                            class="flex items-center justify-center gap-2 bg-pink-200 text-pink-400 p-2 rounded-full">
                            <SpotifyIcon class="size-6" />
                        </button>
                    </div>
                </div>

                <div class="flex flex-row gap-5 items-center w-full justify-around">
                    <button @click="emit('increaseLevel')" class="text-pink-400 bg-pink-200 rounded-full p-2">
                        <CardsHeartIcon class="size-12" />
                    </button>
                    <button @click="emit('decreaseLevel')" class="text-pink-400 bg-pink-200 rounded-full p-2">
                        <HeartOffIcon class="size-12" />
                    </button>
                </div>
            </div>
            <div v-else key="no-song">
                <span class="text-pink-300 text-sm">No hay cancion disponible</span>
            </div>
        </Transition>
    </section>
    <section v-else class="flex flex-col gap-5">
        <p class="text-pink-300 text-sm">Conecta tu spoti, <span class="text-pink-500 text-lg">Bauti</span></p>
    </section>
</template>
<style>
.swap-enter-active,
.swap-leave-active {
    transition: transform 300ms ease, opacity 300ms ease;
}

.swap-enter-from,
.swap-leave-to {
    transform: translateX(30px);
    opacity: 0;
}

.swap-enter-to,
.swap-leave-from {
    transform: translateX(0);
    opacity: 1;
}
</style>