<script setup lang="ts">
import { ref, watch } from "vue";
import type { GoofyNote } from "../../stores/goofynotes";
import { COLOR_OPTIONS } from "./colors";
import plusIcon from "@iconify-vue/mdi/add-circle";
import CloseIcon from "@iconify-vue/mdi/close";
import { useGoofyNotes } from "./useGoofyNotes";

const props = defineProps<{
  note: GoofyNote;
  visible: boolean;
}>();

const emit = defineEmits(["close", "saved"] as const);

const {
  noteName,
  participantInput,
  punishmentInput,
  participants,
  punishments,
  addParticipant,
  removeParticipant,
  addPunishment,
  removePunishment,
  initEdit,
  updateNote,
  resetForm,
  isSaving,
} = useGoofyNotes();

watch(
  () => props.visible,
  (v) => {
    if (v && props.note) {
      initEdit(props.note);
    }
  },
  { immediate: true },
);

const colors = COLOR_OPTIONS;

const showColorPicker = ref(false);
const pendingName = ref("");

function openColorPicker() {
  const name = participantInput.value?.trim();
  if (!name) return;
  pendingName.value = name;
  showColorPicker.value = true;
}

function closeColorPicker() {
  showColorPicker.value = false;
  pendingName.value = "";
}

function confirmColor(key?: any) {
  participantInput.value = pendingName.value;
  addParticipant(key ?? undefined);
  closeColorPicker();
}

const onSave = async () => {
  const updated = await updateNote(props.note.id as any);
  if (updated) {
    emit("saved", updated);
    emit("close");
    resetForm();
  }
};

const onCancel = () => {
  emit("close");
  resetForm();
};
</script>

<template>
  <div v-if="props.visible" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
    <div class="relative bg-white rounded-2xl shadow-2xl p-6 w-full max-w-lg">
      <button @click="onCancel" class="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl">✕</button>

      <h3 class="text-2xl font-bold text-pink-400 mb-4 text-center">Editar nota</h3>

      <!-- Name -->
      <label class="block mb-2">Nombre</label>
      <input v-model="noteName" placeholder="Nombre" class="w-full rounded-md border px-3 py-2 mb-4" />

      <!-- Participants -->
      <div class="mb-4">
        <label class="block mb-2">Participantes</label>
        <div class="flex flex-col gap-2 mb-2">
          <div v-for="(p, idx) in participants" :key="idx" class="flex items-center gap-2">
            <input v-model="participants[idx].participant" class="flex-1 rounded-md border px-2 py-1" />
            <select v-model="participants[idx].color" class="hidden" />
            <button @click.prevent="removeParticipant(p.participant)" class="flex size-5 items-center justify-center rounded-full bg-white text-pink-400 transition hover:bg-pink-200" aria-label="Eliminar integrante">
              <CloseIcon class="size-3.5" />
            </button>
          </div>
        </div>

        <div class="flex gap-2">
          <input v-model="participantInput" placeholder="Nuevo participante" class="flex-1 rounded-md border px-2 py-1" />
          <button type="button" @click.prevent="openColorPicker" class="self-end rounded-full w-fit border border-pink-200 bg-pink-200 p-2 text-pink-400">
            <plusIcon class="size-6"/>
          </button>
        </div>
      </div>

      <!-- Punishments -->
      <div class="mb-4">
        <label class="block mb-2">Castigos / Retos</label>
        <div class="flex flex-col gap-2 mb-2">
          <div v-for="(c, idx) in punishments" :key="idx" class="flex items-center gap-2">
            <input v-model="punishments[idx]" class="flex-1 rounded-md border px-2 py-1" />
            <button @click.prevent="removePunishment(c)" class="flex size-5 items-center justify-center rounded-full bg-white text-pink-400 transition hover:bg-pink-200" aria-label="Eliminar castigo">
              <CloseIcon class="size-3.5" />
            </button>
          </div>
        </div>

        <div class="flex gap-2">
          <input v-model="punishmentInput" placeholder="Nuevo castigo / reto" class="flex-1 rounded-md border px-2 py-1" />
          <button type="button" class="rounded-full border border-pink-200 bg-pink-200 p-2 text-pink-400" @click.prevent="addPunishment">
            <plusIcon class="size-6"/>
          </button>
        </div>
      </div>

      <div class="flex gap-2">
        <button @click="onSave" :disabled="isSaving" class="flex-1 px-4 py-2 bg-pink-400 text-white font-semibold rounded-lg">Guardar</button>
        <button @click="onCancel" class="flex-1 px-4 py-2 border rounded-lg">Cancelar</button>
      </div>
    </div>

    <!-- Color picker modal -->
    <Teleport to="body">
      <div v-if="showColorPicker" class="font-primary fixed inset-0 z-50 flex items-center justify-center p-6" @click.self="closeColorPicker">
        <div class="w-full max-w-sm rounded-2xl bg-white p-4 shadow-lg" @click.stop>
          <h3 class="text-lg font-bold mb-3">Elige color para: <span class="font-extrabold">{{ pendingName }}</span></h3>
          <div class="flex flex-row flex-wrap gap-5 items-center">
            <button v-for="opt in colors" :key="opt.key" type="button" class="size-12 rounded-full" @click="() => confirmColor(opt.key)" :style="{ border: '2px solid ' + opt.accent, background: opt.light }"></button>
          </div>
          <div class="mt-4 flex justify-end gap-2">
            <button type="button" class="rounded-full px-4 py-2 text-sm text-gray-600 hover:bg-gray-100" @click="closeColorPicker">Cancelar</button>
            <button type="button" class="rounded-full px-4 py-2 text-sm font-medium text-white" @click="() => confirmColor(undefined)" :style="{ background: '#9CA3AF' }">Añadir sin color</button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>
