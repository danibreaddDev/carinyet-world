<script setup lang="ts">
import { onMounted, reactive, watch } from 'vue';
import { useRoute, RouterLink } from 'vue-router';
import ArrowLeftCircleIcon from '@iconify-vue/mdi/arrow-left-circle';
import { useGoofyNotesStore } from '../../stores/goofynotes';
import { loadMomentsFromNote } from './useGoofyNotes';
import GoofyNotesMomentList from './GoofyNotesMomentList.vue';
import ProfileCard from '../../components/ProfileCard.vue';
import gameIcon from "@iconify-vue/mdi/cards-playing"
const route = useRoute();
const goofyNotesStore = useGoofyNotesStore();

const momentsByParticipant = reactive<Record<string, string[]>>({});

function loadMoments() {
    const note = goofyNotesStore.note;
    if (!note || !note.id) return;
    try {
        const data = loadMomentsFromNote(note);
        note.participants.forEach((p: any) => {
            momentsByParticipant[p.participant] = data[p.participant] ?? [];
        });
    } catch (e) {
        // ignore
    }
}

onMounted(() => {
    goofyNotesStore.loadNoteById(route.params.id as string);
});

watch(() => goofyNotesStore.note, (n) => {
    if (n) loadMoments();
});
import { ref } from 'vue'

const showRoulette = ref(false);

function openRoulette() {
  showRoulette.value = true;
}

function closeRoulette() {
  showRoulette.value = false;
}
</script>
<template>
    <div class="flex items-center justify-between gap-4 rounded-3xl border border-pink-200 bg-white p-4 shadow-sm">
      <RouterLink to="/goofy-notes" class="rounded-full border border-pink-200 bg-pink-200 p-2 text-pink-400">
        <ArrowLeftCircleIcon class="size-8" />
      </RouterLink>
      <ProfileCard />
    </div>

    <div v-if="goofyNotesStore.note" class="flex flex-col gap-4 ">
        <h2 class="text-3xl font-primary text-pink-300">{{ goofyNotesStore.note.name }}</h2>
        
        <button 
          @click="openRoulette"
          class="w-fit bg-pink-200 rounded-full p-2 self-end"
        >
          <gameIcon class="size-8 text-pink-500"/>
        </button>
            
        <GoofyNotesMomentList :participants="goofyNotesStore.note.participants" :moments="momentsByParticipant" @updated="loadMoments" />
    </div>

    <!-- Roulette Modal -->
    <div v-if="showRoulette" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div class="relative bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md">
        <button 
          @click="closeRoulette"
          class="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl"
        >
          ✕
        </button>
        
        <h3 class="text-2xl font-bold text-pink-400 mb-4 text-center">Ruleta de Juego</h3>
        
        <div class="flex justify-center mb-4">
          <!-- Ruleta eliminada; placeholder para el modal -->
          <div class="w-full text-center text-sm text-gray-500">Aquí irá la ruleta (eliminada)</div>
        </div>
      </div>
    </div>
</template>