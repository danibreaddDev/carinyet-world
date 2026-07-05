<script setup lang="ts">
import MusicNoteIcon from '@iconify-vue/mdi/music-note';
import SpotifyIcon from '@iconify-vue/mdi/spotify';
import AppleIcon from '@iconify-vue/mdi/apple';
import SendIcon from '@iconify-vue/mdi/send';
import { useAdmin } from './useAdmin';

const {
  appleMusicId,
  spotifyId,
  message,
  isSubmitting,
  submitError,
  submitSuccess,
  setAppleMusicId,
  setSpotifyId,
  handleSubmit,
} = useAdmin();
</script>

<template>
  <section class="min-h-screen bg-pink-50 px-4 py-6 sm:px-6 lg:px-8">
    <div class="mx-auto flex max-w-2xl flex-col gap-6 rounded-3xl border border-pink-200 bg-white p-5 shadow-sm sm:p-8">
      <div class="flex items-center gap-3">
        <div class="rounded-2xl bg-pink-100 p-3 text-pink-500">
          <MusicNoteIcon class="size-7" />
        </div>
        <div>
          <p class="text-sm font-semibold uppercase tracking-[0.3em] text-pink-300">Admin</p>
          <h1 class="text-2xl font-bold text-pink-500">Nueva recomendación</h1>
        </div>
      </div>

      <form class="flex flex-col gap-4" @submit.prevent="handleSubmit">
        <label class="flex flex-col gap-2 text-sm font-semibold text-pink-400">
          <span class="flex items-center gap-2">
            <AppleIcon class="size-5" />
            ID de Apple Music
          </span>
          <input
            :value="appleMusicId"
            type="text"
            class="rounded-2xl border border-pink-200 bg-pink-50 px-4 py-3 text-pink-500 outline-none transition focus:border-pink-400"
            @input="(event) => setAppleMusicId((event.target as HTMLInputElement).value)"
          />
        </label>

        <label class="flex flex-col gap-2 text-sm font-semibold text-pink-400">
          <span class="flex items-center gap-2">
            <SpotifyIcon class="size-5" />
            ID de Spotify
          </span>
          <input
            :value="spotifyId"
            type="text"
            class="rounded-2xl border border-pink-200 bg-pink-50 px-4 py-3 text-pink-500 outline-none transition focus:border-pink-400"
            required
            @input="(event) => setSpotifyId((event.target as HTMLInputElement).value)"
          />
        </label>

        <label class="flex flex-col gap-2 text-sm font-semibold text-pink-400">
          <span>Mensaje</span>
          <textarea
            v-model="message"
            rows="5"
            class="resize-none rounded-2xl border border-pink-200 bg-pink-50 px-4 py-3 text-pink-500 outline-none transition focus:border-pink-400"
            required
          />
        </label>

        <button
          type="submit"
          :disabled="isSubmitting"
          class="flex items-center justify-center gap-2 rounded-2xl bg-pink-400 px-4 py-3 font-semibold text-white transition hover:bg-pink-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <SendIcon class="size-5" />
          {{ isSubmitting ? 'Guardando...' : 'Guardar recomendación' }}
        </button>

        <p v-if="submitError" class="text-sm font-medium text-red-500">{{ submitError }}</p>
        <p v-if="submitSuccess" class="text-sm font-medium text-emerald-600">{{ submitSuccess }}</p>
      </form>
    </div>
  </section>
</template>
