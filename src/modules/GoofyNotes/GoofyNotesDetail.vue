<script setup lang="ts">
import { onMounted, reactive, watch } from 'vue';
import { useRoute, RouterLink } from 'vue-router';
import ArrowLeftCircleIcon from '@iconify-vue/mdi/arrow-left-circle';
import { useGoofyNotesStore } from '../../stores/goofynotes';
import ProfileCard from '../../components/ProfileCard.vue';
import plusIcon from '@iconify-vue/mdi/plus-circle';
import deleteIcon from '@iconify-vue/mdi/cross-circle-outline';
const route = useRoute();
const goofyNotesStore = useGoofyNotesStore();

const momentsByParticipant = reactive<Record<string, string[]>>({});
const inputs = reactive<Record<string, string>>({});

function storageKey(noteId: string) {
    return `goofynote-moments-${noteId}`;
}

function loadMoments() {
    const note = goofyNotesStore.note;
    if (!note || !note.id) return;
    const key = storageKey(String(note.id));
    try {
        const raw = localStorage.getItem(key);
        const data = raw ? (JSON.parse(raw) as Record<string, string[]>) : {};

        note.participants.forEach((p) => {
            momentsByParticipant[p] = data[p] ?? [];
            inputs[p] = '';
        });
    } catch (e) {
        // ignore
    }
}

function saveAll() {
    const note = goofyNotesStore.note;
    if (!note || !note.id) return;
    const key = storageKey(String(note.id));
    const toSave: Record<string, string[]> = {};
    Object.keys(momentsByParticipant).forEach((k) => {
        toSave[k] = momentsByParticipant[k] ?? [];
    });
    try {
        localStorage.setItem(key, JSON.stringify(toSave));
    } catch (e) {
        // ignore storage issues
    }
}

function addMoment(participant: string) {
    const value = (inputs[participant] || '').trim();
    if (!value) return;
    if (!momentsByParticipant[participant]) momentsByParticipant[participant] = [];
    momentsByParticipant[participant].unshift(value);
    inputs[participant] = '';
    saveAll();
}

function removeMoment(participant: string, index: number) {
    if (!momentsByParticipant[participant]) return;
    momentsByParticipant[participant].splice(index, 1);
    saveAll();
}

onMounted(() => {
    goofyNotesStore.loadNoteById(route.params.id as string);
});

watch(() => goofyNotesStore.note, (n) => {
    if (n) loadMoments();
});
</script>
<template>
    <div class="flex items-center justify-between ">
        <RouterLink to="/home" class="rounded-full border border-pink-200 bg-pink-200 p-2 text-pink-400">
            <ArrowLeftCircleIcon class="size-8" />
        </RouterLink>
        <ProfileCard />
    </div>

    <div v-if="goofyNotesStore.note" class="flex flex-col gap-4 rounded-3xl border border-pink-200 bg-white p-4 shadow-sm">
        <h2 class="text-3xl font-primary text-pink-300">{{ goofyNotesStore.note.name }}</h2>

        <div class="grid gap-4 mt-2">
            <div v-for="participant in goofyNotesStore.note.participants" :key="participant" class="rounded-lg p-3">
                <div class="flex items-center justify-between">
                    <h3 class="font-bold text-pink-300">{{ participant }} </h3>
                    <span class="font-extrabold text-pink-300 text-xl">{{ momentsByParticipant[participant]?.length || 0 }}</span>
                </div>

                <div v-if="momentsByParticipant[participant] && momentsByParticipant[participant].length" class="flex flex-col gap-2 mt-3">
                    <div v-for="(m, i) in momentsByParticipant[participant]" :key="i" class="flex items-center justify-between bg-white p-2 rounded">
                        <span class="text-sm text-pink-300 break-words">{{i + 1}}. {{ m }}</span>
                        <button @click="removeMoment(participant, i)" class="text-xs text-pink-500 ml-3">
                            <deleteIcon class="size-5" />
                        </button>
                    </div>
                </div>

                <div class="flex gap-2 items-center mt-3">
                    <input v-model="inputs[participant]" @keyup.enter="addMoment(participant)" placeholder="Añadir momento..." class="flex-1 rounded-full px-3 py-2 border border-pink-200 bg-white" />
                    <button @click="addMoment(participant)" class="bg-pink-200 text-white p-2 rounded-full">
                    <plusIcon class="text-pink-400 size-8" />
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>