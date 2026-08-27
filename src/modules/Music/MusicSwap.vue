<script setup lang="ts">
import { computed, ref } from 'vue';
import SpotifyIcon from '@iconify-vue/mdi/spotify';
import CardsHeartIcon from '@iconify-vue/mdi/cards-heart';
import HeartOffIcon from '@iconify-vue/mdi/heart-off';
import type { DbSong, SpotifyTrack } from '../../stores/music';
import appleMusicIcon from "@iconify-vue/mdi/apple"
import { useSpotifyStore } from '../../stores/spotify';
import type { SpotifyPlaylist } from '../../stores/spotify';

const props = defineProps<{
    isAuthenticated: boolean;
    song: DbSong | null;
    spotifyTrack: SpotifyTrack | null;
    isAppleMusic: boolean;
}>();
const emit = defineEmits<{
    (e: 'increaseLevel', payload?: { rating: number; feedback: string }): void;
    (e: 'decreaseLevel'): void;
}>();

const isFeedbackModalOpen = ref(false);
const activeFeedbackAction = ref<'increase' | 'decrease' | null>(null);
const feedbackRating = ref(0);
const feedbackMessage = ref('');
const feedbackError = ref('');
const spotifyStore = useSpotifyStore();
const playlists = ref<SpotifyPlaylist[]>([]);
const arePlaylistsVisible = ref(false);
const isLoadingPlaylists = ref(false);
const addingPlaylistId = ref<string | null>(null);
const playlistMessage = ref('');

const currentSongTitle = computed(() => props.spotifyTrack?.name ?? props.song?.spotifyId ?? 'Canción sin nombre');
const currentArtist = computed(() => props.spotifyTrack?.artists?.join(', ') ?? 'Artista desconocido');

const openFeedbackModal = (action: 'increase' | 'decrease') => {
    activeFeedbackAction.value = action;
    feedbackRating.value = 0;
    feedbackMessage.value = '';
    feedbackError.value = '';
    arePlaylistsVisible.value = false;
    playlistMessage.value = '';
    isFeedbackModalOpen.value = true;
};

const closeFeedbackModal = () => {
    isFeedbackModalOpen.value = false;
    activeFeedbackAction.value = null;
    feedbackRating.value = 0;
    feedbackMessage.value = '';
    feedbackError.value = '';
    arePlaylistsVisible.value = false;
    playlistMessage.value = '';
};

const togglePlaylists = async () => {
    arePlaylistsVisible.value = !arePlaylistsVisible.value;
    playlistMessage.value = '';

    if (!arePlaylistsVisible.value || playlists.value.length > 0) return;

    isLoadingPlaylists.value = true;
    try {
        playlists.value = await spotifyStore.loadPlaylists();
    } catch (error) {
        playlistMessage.value = error instanceof Error ? error.message : 'No se pudieron cargar las playlists.';
    } finally {
        isLoadingPlaylists.value = false;
    }
};

const addCurrentSongToPlaylist = async (playlist: SpotifyPlaylist) => {
    const trackId = props.spotifyTrack?.id;
    if (!trackId) {
        playlistMessage.value = 'No hay una canción de Spotify disponible.';
        return;
    }

    addingPlaylistId.value = playlist.id;
    playlistMessage.value = '';
    try {
        await spotifyStore.addTrackToPlaylist(playlist.id, trackId);
        playlistMessage.value = `Canción añadida a ${playlist.name}.`;
    } catch (error) {
        playlistMessage.value = error instanceof Error ? error.message : 'No se pudo añadir la canción.';
    } finally {
        addingPlaylistId.value = null;
    }
};

const submitFeedback = () => {
    if (!activeFeedbackAction.value) return;

    if (feedbackRating.value < 1 || feedbackRating.value > 5) {
        feedbackError.value = 'Elige una puntuación del 1 al 5.';
        return;
    }

    if (!feedbackMessage.value.trim()) {
        feedbackError.value = 'Escribe un mensaje de feedback.';
        return;
    }

    const payload = {
        rating: feedbackRating.value,
        feedback: feedbackMessage.value.trim(),
    };

    if (activeFeedbackAction.value === 'increase') {
        emit('increaseLevel', payload);
    }

    closeFeedbackModal();
};

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
                        <div v-if="isAppleMusic" class="flex flex-row gap-2 items-center">
                            <a target="_blank"
                                :href="`https://music.apple.com/es/album/${props.song?.id}?i=${props.song?.id}`"
                                class="flex items-center justify-center gap-2 bg-pink-200 text-pink-400 p-2 rounded-full">
                                <appleMusicIcon class="size-6" />
                            </a>

                            <a :href="`https://open.spotify.com/intl-es/track/${props.song?.spotifyId}`" target="_blank"
                                class="flex items-center justify-center gap-2 bg-pink-200 text-pink-400 p-2 rounded-full">
                                <SpotifyIcon class="size-6 text-green-500" />
                            </a>
                        </div>
                        <button v-else @click=" openInSpotify()"
                            class="flex items-center justify-center gap-2 bg-pink-200 text-pink-400 p-2 rounded-full">
                            <SpotifyIcon class="size-6" />
                        </button>
                    </div>
                </div>

                <div class="flex flex-row gap-5 items-center w-full justify-around">
                    <button @click="openFeedbackModal('increase')" class="text-pink-400 bg-pink-200 rounded-full p-2">
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

    <div v-if="isFeedbackModalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
        <div class="w-full max-w-md rounded-3xl border border-pink-200 bg-white p-5 shadow-xl">
            <div class="flex items-start justify-between gap-3">
                <div>
                    <h3 class="text-lg font-semibold text-pink-500">Feedback de la canción</h3>
                    <p class="text-sm text-pink-300">{{ currentSongTitle }} • {{ currentArtist }}</p>
                </div>
                <button type="button" class="text-sm font-medium text-pink-300" @click="closeFeedbackModal">Cancelar</button>
            </div>

            <div class="mt-4 flex flex-col gap-4">
                <div>
                    <p class="mb-2 text-sm font-semibold text-pink-400">Puntuación</p>
                    <div class="flex gap-2">
                        <button
                            v-for="value in 5"
                            :key="value"
                            type="button"
                            class="text-2xl transition"
                            :class="feedbackRating >= value ? 'text-yellow-400' : 'text-pink-100'"
                            @click="feedbackRating = value"
                        >
                            ★
                        </button>
                    </div>
                </div>

                <label class="flex flex-col gap-2 text-sm font-semibold text-pink-400">
                    <span>Mensaje</span>
                    <textarea
                        v-model="feedbackMessage"
                        rows="4"
                        class="resize-none rounded-2xl border border-pink-200 bg-pink-50 px-4 py-3 text-pink-500 outline-none transition focus:border-pink-400"
                        placeholder="¿Te ha gustado la canción?"
                    />
                </label>

                <div class="flex flex-col gap-2">
                    <button
                        type="button"
                        class="rounded-2xl border border-green-200 px-4 py-3 text-left font-semibold text-green-600 transition hover:bg-green-50"
                        @click="togglePlaylists"
                    >
                        {{ arePlaylistsVisible ? 'Ocultar playlists' : 'Añadir a una playlist de Spotify' }}
                    </button>

                    <div v-if="arePlaylistsVisible" class="flex max-h-44 flex-col gap-2 overflow-y-auto rounded-2xl bg-green-50 p-3">
                        <span v-if="isLoadingPlaylists" class="text-sm text-green-700">Cargando playlists...</span>
                        <span v-else-if="!playlists.length && !playlistMessage" class="text-sm text-green-700">
                            No tienes playlists disponibles.
                        </span>
                        <button
                            v-for="playlist in playlists"
                            :key="playlist.id"
                            type="button"
                            class="flex items-center gap-3 rounded-xl bg-white px-3 py-2 text-left text-sm font-semibold text-green-700 transition hover:bg-green-100 disabled:cursor-wait disabled:opacity-60"
                            :disabled="addingPlaylistId === playlist.id"
                            @click="addCurrentSongToPlaylist(playlist)"
                        >
                            <img v-if="playlist.imageUrl" :src="playlist.imageUrl" :alt="playlist.name" class="size-9 rounded-lg object-cover" />
                            <span>{{ addingPlaylistId === playlist.id ? 'Añadiendo...' : playlist.name }}</span>
                        </button>
                    </div>

                    <p v-if="playlistMessage" class="text-sm font-medium text-green-600">{{ playlistMessage }}</p>
                </div>

                <p v-if="feedbackError" class="text-sm font-medium text-red-500">{{ feedbackError }}</p>

                <div class="flex gap-3">
                    <button
                        type="button"
                        class="flex-1 rounded-2xl border border-pink-200 px-4 py-3 font-semibold text-pink-400 transition hover:bg-pink-50"
                        @click="closeFeedbackModal"
                    >
                        Cancelar
                    </button>
                    <button
                        type="button"
                        class="flex-1 rounded-2xl bg-pink-400 px-4 py-3 font-semibold text-white transition hover:bg-pink-500"
                        @click="submitFeedback"
                    >
                        Aceptar
                    </button>
                </div>
            </div>
        </div>
    </div>
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