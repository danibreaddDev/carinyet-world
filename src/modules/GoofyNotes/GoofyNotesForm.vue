<script setup lang="ts">
import ArrowLeftCircleIcon from '@iconify-vue/mdi/arrow-left-circle';
import plusIcon from "@iconify-vue/mdi/add-circle";
import CloseIcon from '@iconify-vue/mdi/close';
import { useGoofyNotes } from './useGoofyNotes';

const {
  noteName,
  participantInput,
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

const handleSave = async () => {
  await saveNote();
};
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
            placeholder="Ej: Día de caos"
            class="rounded-xl border border-pink-200 bg-pink-50 px-4 py-3 text-pink-400 outline-none placeholder:text-pink-200 focus:border-pink-400"
          />
        </label>

        <div class="flex flex-col gap-3">
          <div class="flex items-center justify-between gap-3">
            <span class="text-lg font-bold text-pink-300">Personitas</span>
            <span class="text-sm font-semibold text-pink-200">{{ participantLabel }}</span>
          </div>

          <div class="flex gap-2 items-center">
            <input
              v-model="participantInput"
              type="text"
              placeholder="Añadir integrante"
              class="flex-1 rounded-xl border border-pink-200 bg-pink-50 px-4 py-3 text-pink-400 outline-none placeholder:text-pink-200 focus:border-pink-400"
              @keydown.enter.prevent="addParticipant"
            />
             <button
              type="button"
              class="rounded-full border border-pink-200 bg-pink-200 p-2 text-pink-400"
              @click="addParticipant"
            >
            <plusIcon class="size-6"/>
             </button>
          </div>

          <div v-if="participants.length" class="rounded-2xl border border-pink-100 bg-pink-50 p-3">
            <div class="flex flex-wrap gap-2">
              <span
                v-for="participant in participants"
                :key="participant"
                class="inline-flex items-center gap-2 rounded-full bg-pink-200 px-3 py-1 text-sm font-semibold text-pink-500"
              >
                {{ participant }}
                <button
                  type="button"
                  class="flex size-5 items-center justify-center rounded-full bg-white text-pink-400 transition hover:bg-pink-200"
                  @click="removeParticipant(participant)"
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
              placeholder="Añadir castigo"
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
  </div>
</template>
