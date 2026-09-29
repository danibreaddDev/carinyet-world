<script setup lang="ts">
import { computed, ref } from 'vue';
import SpotifyIcon from '@iconify-vue/mdi/spotify';
import CardsHeartIcon from '@iconify-vue/mdi/cards-heart';
import HeartOffIcon from '@iconify-vue/mdi/heart-off';
import type { DbSong, SpotifyTrack } from '../../stores/music';
import appleMusicIcon from "@iconify-vue/mdi/apple";
import { useSpotifyStore } from '../../stores/spotify';
import type { SpotifyPlaylist } from '../../stores/spotify';
import { CHARACTERS } from '../../core/constants/characters';

export type VotePayload = {
    rating: number;
    feedback: string;
    characterId: string;
};

const props = defineProps<{
    isAuthenticated: boolean;
    song: DbSong | null;
    spotifyTrack: SpotifyTrack | null;
    isAppleMusic: boolean;
}>();

const emit = defineEmits<{
    (e: 'increaseLevel', payload: VotePayload): void;
    (e: 'decreaseLevel', payload: VotePayload): void;
}>();

const isFeedbackModalOpen = ref(false);
const activeFeedbackAction = ref<'increase' | 'decrease' | null>(null);
const feedbackRating = ref(0);
const feedbackMessage = ref('');
const feedbackError = ref('');
const selectedCharacterId = ref('');

const spotifyStore = useSpotifyStore();
const playlists = ref<SpotifyPlaylist[]>([]);
const arePlaylistsVisible = ref(false);
const isLoadingPlaylists = ref(false);
const addingPlaylistId = ref<string | null>(null);
const playlistMessage = ref('');

const currentSongTitle = computed(() => props.spotifyTrack?.name ?? props.song?.spotifyId ?? 'Canción sin nombre');
const currentArtist = computed(() => props.spotifyTrack?.artists?.join(', ') ?? 'Artista desconocido');

const isLowRating = computed(() => {
    if (activeFeedbackAction.value === 'decrease') return true;
    return feedbackRating.value > 0 && feedbackRating.value <= 2;
});

const openFeedbackModal = (action: 'increase' | 'decrease') => {
    activeFeedbackAction.value = action;
    feedbackRating.value = action === 'increase' ? 5 : 1;
    selectedCharacterId.value = '';
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
    selectedCharacterId.value = '';
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

    if (!selectedCharacterId.value) {
        feedbackError.value = isLowRating.value
            ? 'Por favor, selecciona al personaje que quieres bajarle el nivel.'
            : 'Por favor, selecciona al personaje que quieres subirle el nivel.';
        return;
    }

    if (!feedbackMessage.value.trim()) {
        feedbackError.value = 'Escribe un mensaje de feedback.';
        return;
    }

    const payload: VotePayload = {
        rating: feedbackRating.value,
        feedback: feedbackMessage.value.trim(),
        characterId: selectedCharacterId.value,
    };

    if (isLowRating.value) {
        emit('decreaseLevel', payload);
    } else {
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
                        class="rounded-2xl shadow-md" />

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
                                class="flex items-center justify-center gap-2 bg-pink-200 text-pink-400 p-2 rounded-full transition hover:bg-pink-300">
                                <appleMusicIcon class="size-6" />
                            </a>

                            <a :href="`https://open.spotify.com/intl-es/track/${props.song?.spotifyId}`" target="_blank"
                                class="flex items-center justify-center gap-2 bg-pink-200 text-pink-400 p-2 rounded-full transition hover:bg-pink-300">
                                <SpotifyIcon class="size-6 text-green-500" />
                            </a>
                        </div>
                        <button v-else @click="openInSpotify()"
                            class="flex items-center justify-center gap-2 bg-pink-200 text-pink-400 p-2 rounded-full transition hover:bg-pink-300">
                            <SpotifyIcon class="size-6" />
                        </button>
                    </div>
                </div>

                <div class="flex flex-row gap-5 items-center w-full justify-around mt-2">
                    <button
                        @click="openFeedbackModal('increase')"
                        class="text-pink-400 bg-pink-200 rounded-full p-2 transition hover:bg-pink-300 hover:scale-105 active:scale-95"
                        title="Me gusta / Subir nivel"
                    >
                        <CardsHeartIcon class="size-12" />
                    </button>
                    <button
                        @click="openFeedbackModal('decrease')"
                        class="text-pink-400 bg-pink-200 rounded-full p-2 transition hover:bg-pink-300 hover:scale-105 active:scale-95"
                        title="No me gusta / Bajar nivel"
                    >
                        <HeartOffIcon class="size-12" />
                    </button>
                </div>
            </div>
            <div v-else key="no-song">
                <span class="text-pink-300 text-sm">No hay canción disponible</span>
            </div>
        </Transition>
    </section>
    <section v-else class="flex flex-col gap-5">
        <p class="text-pink-300 text-sm">Conecta tu spoti, <span class="text-pink-500 text-lg">Bauti</span></p>
    </section>

    <!-- Modal de Voto y Selección de Personaje -->
    <div v-if="isFeedbackModalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4 py-6">
        <div class="w-full max-w-md max-h-[90vh] flex flex-col rounded-3xl border border-pink-200 bg-white shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <!-- Modal Header -->
            <div class="flex items-start justify-between gap-3 p-5 pb-3 border-b border-pink-100 bg-gradient-to-r from-pink-50/50 to-white">
                <div>
                    <div class="flex items-center gap-2 mb-1">
                        <span
                            class="text-xs font-bold px-2.5 py-0.5 rounded-full inline-flex items-center gap-1"
                            :class="isLowRating ? 'bg-rose-100 text-rose-600' : 'bg-pink-100 text-pink-600'"
                        >
                            {{ isLowRating ? '💔 Bajar nivel a personaje' : '💖 Subir nivel a personaje' }}
                        </span>
                    </div>
                    <h3 class="text-lg font-bold" :class="isLowRating ? 'text-rose-500' : 'text-pink-500'">
                        {{ isLowRating ? 'Voto negativo / Dislike' : 'Voto positivo / Like' }}
                    </h3>
                    <p class="text-xs text-pink-300 truncate max-w-[280px]">{{ currentSongTitle }} • {{ currentArtist }}</p>
                </div>
                <button
                    type="button"
                    class="text-sm font-semibold text-pink-300 hover:text-pink-500 transition px-2 py-1 rounded-lg"
                    @click="closeFeedbackModal"
                >
                    ✕
                </button>
            </div>

            <!-- Modal Content (Scrollable) -->
            <div class="overflow-y-auto p-5 flex flex-col gap-4">
                <!-- Rating Stars -->
                <div>
                    <div class="flex items-center justify-between mb-1.5">
                        <p class="text-sm font-semibold text-pink-500">Puntuación</p>
                        <span class="text-xs font-semibold" :class="isLowRating ? 'text-rose-500' : 'text-emerald-600'">
                            {{ feedbackRating }} / 5 estrellas
                        </span>
                    </div>
                    <div class="flex gap-2 items-center">
                        <button
                            v-for="value in 5"
                            :key="value"
                            type="button"
                            class="text-2xl transition hover:scale-110"
                            :class="feedbackRating >= value ? (isLowRating ? 'text-rose-400' : 'text-yellow-400') : 'text-pink-100'"
                            @click="feedbackRating = value"
                        >
                            ★
                        </button>
                    </div>
                    <!-- Helper indicator -->
                    <div
                        class="mt-2 text-xs font-medium px-3 py-1.5 rounded-xl border flex items-center gap-1.5"
                        :class="isLowRating ? 'bg-rose-50 border-rose-200 text-rose-600' : 'bg-pink-50 border-pink-200 text-pink-600'"
                    >
                        <span>{{ isLowRating ? '📉' : '📈' }}</span>
                        <span>
                            {{ isLowRating ? 'Puntuación baja (≤ 2★): se bajará el nivel (-0.2) al personaje que elijas.' : 'Puntuación buena (≥ 3★): se subirá el nivel (+0.2) al personaje que elijas.' }}
                        </span>
                    </div>
                </div>

                <!-- Character Selector -->
                <div class="flex flex-col gap-2">
                    <label class="text-sm font-semibold" :class="isLowRating ? 'text-rose-500' : 'text-pink-500'">
                        {{ isLowRating ? 'Elige a qué personaje quieres bajarle el nivel (-0.2):' : 'Elige a qué personaje quieres subirle el nivel (+0.2):' }}
                    </label>
                    <div class="grid grid-cols-3 gap-2 max-h-52 overflow-y-auto p-1.5 rounded-2xl bg-pink-50/40 border border-pink-100">
                        <button
                            v-for="char in CHARACTERS"
                            :key="char.id"
                            type="button"
                            @click="selectedCharacterId = char.id"
                            class="flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-150 cursor-pointer"
                            :class="selectedCharacterId === char.id
                                ? (isLowRating
                                    ? 'border-2 border-rose-400 bg-rose-50 text-rose-600 scale-102 shadow-sm ring-2 ring-rose-200/60'
                                    : 'border-2 border-pink-400 bg-pink-50 text-pink-600 scale-102 shadow-sm ring-2 ring-pink-200/60')
                                : 'border border-pink-100 bg-white hover:bg-pink-50/60 text-gray-600 hover:border-pink-200'"
                        >
                            <img :src="char.icon" :alt="char.name" class="size-11 object-contain pointer-events-none" />
                            <span class="text-[11px] font-semibold truncate max-w-full mt-1">{{ char.name }}</span>
                        </button>
                    </div>
                </div>

                <!-- Feedback Message -->
                <label class="flex flex-col gap-1.5 text-sm font-semibold text-pink-400">
                    <span>Mensaje de feedback</span>
                    <textarea
                        v-model="feedbackMessage"
                        rows="3"
                        class="resize-none rounded-2xl border border-pink-200 bg-pink-50 px-4 py-3 text-pink-500 outline-none transition focus:border-pink-400 placeholder:text-pink-300 text-sm"
                        :placeholder="isLowRating ? '¿Por qué no te ha gustado la canción?' : '¿Qué te ha parecido la canción?'"
                    />
                </label>

                <!-- Spotify Playlists -->
                <div class="flex flex-col gap-2">
                    <button
                        type="button"
                        class="rounded-2xl border border-green-200 px-4 py-2.5 text-left text-sm font-semibold text-green-600 transition hover:bg-green-50"
                        @click="togglePlaylists"
                    >
                        {{ arePlaylistsVisible ? 'Ocultar playlists' : 'Añadir a una playlist de Spotify' }}
                    </button>

                    <div v-if="arePlaylistsVisible" class="flex max-h-40 flex-col gap-2 overflow-y-auto rounded-2xl bg-green-50 p-3">
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
                            <img v-if="playlist.imageUrl" :src="playlist.imageUrl" :alt="playlist.name" class="size-8 rounded-lg object-cover" />
                            <span class="truncate">{{ addingPlaylistId === playlist.id ? 'Añadiendo...' : playlist.name }}</span>
                        </button>
                    </div>

                    <p v-if="playlistMessage" class="text-xs font-medium text-green-600">{{ playlistMessage }}</p>
                </div>

                <!-- Error message -->
                <p v-if="feedbackError" class="text-xs font-semibold text-red-500 bg-red-50 border border-red-200 px-3 py-2 rounded-xl">
                    {{ feedbackError }}
                </p>
            </div>

            <!-- Modal Footer -->
            <div class="flex gap-3 p-5 pt-3 border-t border-pink-100 bg-white">
                <button
                    type="button"
                    class="flex-1 rounded-2xl border border-pink-200 px-4 py-3 font-semibold text-pink-400 transition hover:bg-pink-50 text-sm"
                    @click="closeFeedbackModal"
                >
                    Cancelar
                </button>
                <button
                    type="button"
                    class="flex-1 rounded-2xl px-4 py-3 font-semibold text-white transition shadow-sm text-sm"
                    :class="isLowRating ? 'bg-rose-400 hover:bg-rose-500' : 'bg-pink-400 hover:bg-pink-500'"
                    @click="submitFeedback"
                >
                    {{ isLowRating ? 'Bajar nivel y Enviar' : 'Subir nivel y Enviar' }}
                </button>
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