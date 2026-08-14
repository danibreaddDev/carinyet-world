<script setup lang="ts">
import { reactive, watch } from 'vue';
import GoofyNotesMomentCard from './GoofyNotesMomentCard.vue';
import { saveMoments } from './useGoofyNotes';
import { useGoofyNotesStore } from '../../stores/goofynotes';
import type { ParticipantObj } from '../../stores/goofynotes';

const { participants, moments } = defineProps<{
  participants: ParticipantObj[];
  moments: Record<string, string[]>;
}>();

const emits = defineEmits<{
  (e: 'updated'): void;
}>();

const goofyNotesStore = useGoofyNotesStore();

const local = reactive<Record<string, string[]>>({});

if (participants && participants.length) {
  participants.forEach((p) => {
    local[p.participant] = (moments?.[p.participant] ?? []).slice();
  });
}

watch(
  () => moments,
  (m) => {
    if (!participants) return;
    participants.forEach((p) => {
      local[p.participant] = (m?.[p.participant] ?? []).slice();
    });
  },
  { deep: true },
);

function onUpdateParticipant(participant: string, list: string[]) {
  local[participant] = list.slice();
  // build full object and persist
  const toSave: Record<string, string[]> = {};
  Object.keys(local).forEach((k) => (toSave[k] = local[k] ?? []));
  const noteId = goofyNotesStore.note?.id;
  if (!noteId) return;
  saveMoments(noteId, toSave).then(() => emits('updated'));
}
</script>

<template>
    <div class="space-y-4">
    <GoofyNotesMomentCard
      v-for="participant in participants"
      :key="participant.participant"
      :participant="participant.participant"
      :moments="local[participant.participant] || []"
      :noteId="goofyNotesStore.note?.id"
      @update="(list) => onUpdateParticipant(participant.participant, list)"
      :color="participant.color"
    />
    </div>
</template>
