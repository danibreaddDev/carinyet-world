<script setup lang="ts">
import { onMounted, reactive, ref, watch } from 'vue';
import { useRoute, RouterLink } from 'vue-router';
import ArrowLeftCircleIcon from '@iconify-vue/mdi/arrow-left-circle';
import gameIcon from "@iconify-vue/mdi/cards-playing";
import finishIcon from "@iconify-vue/mdi/calendar-lock";
import checkIcon from "@iconify-vue/mdi/check-circle";
import xIcon from "@iconify-vue/mdi/cross-circle";
import { useGoofyNotesStore } from '../../stores/goofynotes';
import { loadMomentsFromNote } from './useGoofyNotes';
import GoofyNotesMomentList from './GoofyNotesMomentList.vue';
import GoofyNotesRoulette from './GoofyNotesRoulette.vue';
import ProfileCard from '../../components/ProfileCard.vue';

const route = useRoute();
const goofyNotesStore = useGoofyNotesStore();
const showRoulette = ref(false);
const showFinishModal = ref(false);

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

function openRoulette() {
  showRoulette.value = true;
}

function closeRoulette() {
  showRoulette.value = false;
}
function openFinishModal() {
showFinishModal.value = true;
}
function closeFinishModal() {
  showFinishModal.value = false;
}

async function finishCurrentNote() {
  const noteId = goofyNotesStore.note?.id;
  if (!noteId || typeof goofyNotesStore.finishNote !== 'function') return;

  await goofyNotesStore.finishNote(noteId);
  closeFinishModal();
}

onMounted(() => {
    goofyNotesStore.loadNoteById(route.params.id as string);
});

watch(() => goofyNotesStore.note, (n) => {
    if (n) loadMoments();
});
</script>
<template>
    <div class="flex items-center justify-between gap-4 rounded-3xl border border-pink-200 bg-white p-4 shadow-sm">
      <RouterLink to="/goofy-notes" class="rounded-full border border-pink-200 bg-pink-200 p-2 text-pink-400">
        <ArrowLeftCircleIcon class="size-8" />
      </RouterLink>
      <ProfileCard />
    </div>

    <div v-if="goofyNotesStore.note" class="flex flex-col gap-5">
        <h2 class="text-3xl font-primary text-pink-300">{{ goofyNotesStore.note.name }}</h2>
        <div class="flex flex-row items-center gap-5">
        <button
          v-if="goofyNotesStore.note?.status !== 'completed'"
          @click="openRoulette"
          class="w-fit bg-pink-200 rounded-full p-2"
        >
          <gameIcon class="size-8 text-pink-500"/>
        </button>
         <button
          v-if="goofyNotesStore.note?.status !== 'completed'"
          @click="openFinishModal"
          class="w-fit bg-pink-200 rounded-full p-2"
        >
          <finishIcon class="size-8 text-pink-500"/>
          </button>
        </div>
        <GoofyNotesMomentList :participants="goofyNotesStore.note.participants" :moments="momentsByParticipant" @updated="loadMoments" />
    </div>

    <!-- Roulette Modal -->
    <div v-if="showRoulette" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div class="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
        <button
          @click="closeRoulette"
          class="absolute right-4 top-4 text-2xl text-gray-500 transition hover:text-gray-700"
        >
          ✕
        </button>

        <h3 class="mb-5 text-center text-2xl font-black text-pink-400">Ruleta Rusa</h3>

        <GoofyNotesRoulette
          v-if="goofyNotesStore.note"
          :punishments="goofyNotesStore.note.punishments ?? []"
          @close="closeRoulette"
        />
      </div>
    </div>
    <!-- Finish Modal -->
    <div v-if="showFinishModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div class="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
        <button
          @click="closeFinishModal"
          class="absolute right-4 top-4 text-2xl text-gray-500 transition hover:text-gray-700"
        >
          ✕
        </button>

        <h3 class="mb-5 text-center text-2xl font-black text-pink-400">Finalizar nota</h3>

        <div class="mt-5 flex justify-center gap-4">
          <button
            @click="finishCurrentNote"
            class="rounded-full bg-pink-200 p-2"
          >
            <checkIcon class="size-6 text-pink-400" />
          </button>
          <button
            @click="closeFinishModal"
            class="rounded-full bg-pink-200 p-2"
          >
            <xIcon class="size-6 text-pink-400" />
          </button>
        </div>
      </div>
    </div>
</template>