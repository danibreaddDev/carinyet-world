<script setup lang="ts">
 import { RouterLink } from 'vue-router'
 import ArrowLeftCircleIcon from '@iconify-vue/mdi/arrow-left-circle'
 import plusIcon from '@iconify-vue/mdi/plus-circle';
 import ProfileCard from '../../components/ProfileCard.vue'
import { useSpotifyStore } from '../../stores/spotify.ts';
import { computed, onMounted } from 'vue';
import { useGoofyNotesStore } from '../../stores/goofynotes.ts';
import GoofyNotesList from './GoofyNotesList.vue';
 const spotifyStore = useSpotifyStore();
 const goofyNotesStore = useGoofyNotesStore();
 onMounted(() => {
    goofyNotesStore.loadNotes();
  });
const isAuthenticated = computed(() => spotifyStore.isAuthenticated);

 </script>
<template>
   <div class="flex items-center justify-between gap-4 rounded-3xl border border-pink-200 bg-white p-4 shadow-sm">
      <RouterLink to="/home" class="rounded-full border border-pink-200 bg-pink-200 p-2 text-pink-400">
        <ArrowLeftCircleIcon class="size-8" />
      </RouterLink>
      <ProfileCard />
    </div>
    <div v-if="!isAuthenticated" class="mx-auto w-full max-w-lg">
        <SpotifyUser />
    </div>

    <div  class="flex flex-col gap-10 p-4">
        <div class="flex flex-row items-center justify-between">
            <RouterLink to="/goofy-notes/new" class="text-pink-200 border p-2 bg-pink-200 rounded-full w-fit">
                <plusIcon class="text-pink-400 size-8" />
            </RouterLink>
            <SpotifyUser />
        </div>
    </div>
    <GoofyNotesList :notes="goofyNotesStore.notes" />
</template>