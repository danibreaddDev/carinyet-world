<script setup lang="ts">
import ArrowLeftCircleIcon from '@iconify-vue/mdi/arrow-left-circle';
import plusIcon from "@iconify-vue/mdi/add-circle";
import CloseIcon from '@iconify-vue/mdi/close';
import { useGoofyNotes } from './useGoofyNotes';
import { COLOR_OPTIONS, COLOR_MAP } from './colors';
import { router } from '../../router';
import { ref } from 'vue';

const {
  noteName,
  participantInput,
  participantColor,
  punishmentInput,
  participants,
  punishments,
  participantLabel,
  addParticipant,
  removeParticipant,
  addPunishment,
  removePunishment,
  saveNote,
  isSaving,
  error,
} = useGoofyNotes();

// referenced in template; keep a noop reference so TS/linters detect usage
void participantColor;

const colors = COLOR_OPTIONS;
const colorMap = COLOR_MAP;

const handleSave = async () => {
  await saveNote();
  if (!error.value) {
    router.push('/goofy-notes');
  }
};

function onInputEnter() {
  // open modal color picker when pressing enter
  openColorPicker();
}

function addWithSelectedColor() {
  // open modal color picker when clicking add (preferred UX)
  openColorPicker();
}

const showColorPicker = ref(false);
const pendingName = ref('');

function openColorPicker() {
  const name = participantInput.value?.trim();
  if (!name) return;
  pendingName.value = name;
  showColorPicker.value = true;
}

function closeColorPicker() {
  showColorPicker.value = false;
  pendingName.value = '';
}

function confirmColor(key?: any) {
  // ensure participantInput is set for the composable
  participantInput.value = pendingName.value;
  addParticipant(key ?? undefined);
  closeColorPicker();
}
</script>

<template>
  <div class="flex flex-col gap-6 p-4">
    <div class="flex items-center justify-between ">
      <RouterLink to="/goofy-notes" class="rounded-full border border-pink-200 bg-pink-200 p-2 text-pink-400">
        <ArrowLeftCircleIcon class="size-8" />
      </RouterLink>
    </div>

    <section class="rounded-3xl border border-pink-200 bg-white p-5 shadow-sm">
      <form class="flex flex-col gap-5" @submit.prevent>
        <label class="flex flex-col gap-2 text-pink-300">
          <span class="text-lg font-bold">Nombre de la nota</span>
          <input
            v-model="noteName"
            type="text"
            class="rounded-xl border border-pink-200 bg-pink-50 px-4 py-3 text-pink-400 outline-none placeholder:text-pink-200 focus:border-pink-400"
          />
        </label>

        <div class="flex flex-col gap-3">
          <div class="flex items-center justify-between gap-3">
            <span class="text-lg font-bold text-pink-300">Personitas</span>
            <span class="text-sm font-semibold text-pink-200">{{ participantLabel }}</span>
          </div>

          <div class="flex gap-2">
            <input
              v-model="participantInput"
              type="text"
              class="flex-1 rounded-xl border border-pink-200 bg-pink-50 px-4 py-3 text-pink-400 outline-none placeholder:text-pink-200 focus:border-pink-400"
              @keydown.enter.prevent="onInputEnter"
            />

           

            <button
              type="button"
              class="self-end rounded-full w-fit border border-pink-200 bg-pink-200 p-2 text-pink-400"
              @click="addWithSelectedColor"
            >
              <plusIcon class="size-6"/>
            </button>
          </div>

          <div v-if="participants.length" class="rounded-2xl border border-pink-100 bg-pink-50 p-3">
            <div class="flex flex-wrap gap-2">
              <span
                v-for="p in participants"
                :key="p.participant"
                class="inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-semibold"
                :style="{ background: colorMap[p.color ?? 'blue'].fill, color: colorMap[p.color ?? 'blue'].accent }"
              >
                {{ p.participant }}
                <button
                  type="button"
                  class="flex size-5 items-center justify-center rounded-full bg-white text-pink-400 transition hover:bg-pink-200"
                  @click="removeParticipant(p.participant)"
                  aria-label="Eliminar integrante"
                >
                  <CloseIcon class="size-3.5" />
                </button>
              </span>
            </div>
          </div>
        </div>

        <div class="flex flex-col gap-3">
          <div class="flex items-center justify-between gap-3">
            <span class="text-lg font-bold text-pink-300">Castigos y/o Retos</span>
            <span class="text-sm font-semibold text-pink-200">{{ punishments.length }} añadidos</span>
          </div>

          <div class="flex gap-2 items-center">
            <input
              v-model="punishmentInput"
              type="text"
              class="flex-1 rounded-xl border border-pink-200 bg-pink-50 px-4 py-3 text-pink-400 outline-none placeholder:text-pink-200 focus:border-pink-400"
              @keydown.enter.prevent="addPunishment"
            />
            <button
              type="button"
              class="rounded-full border border-pink-200 bg-pink-200 p-2 text-pink-400"
              @click="addPunishment"
            >
            <plusIcon class="size-6"/>
            </button>
          </div>

          <div v-if="punishments.length" class="rounded-2xl border border-pink-100 bg-pink-50 p-3">
            <div class="flex flex-wrap gap-2">
              <span
                v-for="punishment in punishments"
                :key="punishment"
                class="inline-flex items-center gap-2 rounded-full bg-pink-100 px-3 py-1 text-sm font-semibold text-pink-500"
              >
                {{ punishment }}
                <button
                  type="button"
                  class="flex size-5 items-center justify-center rounded-full bg-white text-pink-400 transition hover:bg-pink-200"
                  @click="removePunishment(punishment)"
                  aria-label="Eliminar castigo"
                >
                  <CloseIcon class="size-3.5" />
                </button>
              </span>
            </div>
          </div>
        </div>

        <button
          type="button"
          class="rounded-xl bg-pink-400 px-5 py-3 text-lg font-bold text-white shadow-sm transition hover:bg-pink-500 disabled:cursor-not-allowed disabled:opacity-50"
          :disabled="!noteName.trim() || !participants.length || isSaving"
          @click="handleSave"
        >
          {{ isSaving ? 'Guardando...' : 'Guardar nota' }}
        </button>

        <p v-if="error" class="text-sm font-bold text-red-500">{{ error }}</p>
      </form>
    </section>
    
    <!-- Color picker modal -->
    <Teleport to="body">
      <div v-if="showColorPicker" class="font-primary fixed inset-0 z-50 flex items-center justify-center p-6" @click.self="closeColorPicker">
        <div class="w-full max-w-sm rounded-2xl bg-white p-4 shadow-lg" @click.stop>
          <h3 class="text-lg font-bold mb-3">Elige color para: <span class="font-extrabold">{{ pendingName }}</span></h3>
          <div class="flex flex-row flex-wrap gap-5 items-center">
            <button v-for="opt in colors" :key="opt.key" type="button" class="size-12 rounded-full" @click="() => confirmColor(opt.key)" :style="{ border: '2px solid ' + opt.accent, background: opt.light }">
            </button>
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
