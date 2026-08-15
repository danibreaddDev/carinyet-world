<script setup lang="ts">
import checkIcon from "@iconify-vue/mdi/check-circle";
import failIcon from "@iconify-vue/mdi/close-circle";
import { useGoofyNotesRoulette } from "./useGoofyNotesRoulette";

const props = defineProps<{
  punishments: string[];
}>();

const emit = defineEmits<{
  (event: "close"): void;
}>();

const {
  selectedPunishment,
  isSpinning,
  pendingAction,
  segments,
  wheelGradient,
  wheelStyle,
  getLabelStyle,
  spinRoulette,
  chooseCompleted,
  chooseFailed,
  cancelAction,
  confirmAction,
} = useGoofyNotesRoulette(props.punishments);

const handleConfirmAction = async () => {
  const confirmed = await confirmAction();
  if (confirmed) emit("close");
};
</script>

<template>
  <div class="flex flex-col items-center gap-4">
    <div class="relative flex items-center justify-center">
      <div class="pointer-events-none absolute left-1/2 top-0 z-20 -translate-x-1/2">
        <img src="/assets/goofy-notes/kuromi_roulette.jfif" alt="kuromi_roulette" class="size-12 rounded-full">
      </div>

      <div
        class="relative h-72 w-72 cursor-pointer overflow-hidden rounded-full border-[10px] border-pink-200 bg-pink-50 shadow-inner"
        @click.stop="spinRoulette"
      >
        <div v-if="segments.length" :style="wheelStyle" class="relative h-full w-full rounded-full">
          <div class="absolute inset-0 rounded-full" :style="{ background: wheelGradient }"></div>

          <div
            v-for="(segment, index) in segments"
            :key="`${segment.punishment}-${index}`"
            class="absolute flex max-w-20 items-center justify-center rounded-full text-center text-[10px] font-semibold leading-tight text-pink-700"
            :style="getLabelStyle(segment)"
          >
            {{ segment.punishment }}
          </div>
        </div>

        <div v-else class="flex h-full w-full items-center justify-center p-6 text-center text-sm text-pink-300">
            Sois pussys y no os poneis retos.        
        </div>
      </div>
    </div>

    <div v-if="selectedPunishment" class="w-full text-center">
      <p class="text-xs font-semibold uppercase tracking-[0.2em] text-pink-300">Castigo</p>
      <p class="mt-2 text-xl font-bold text-pink-500">{{ selectedPunishment }}</p>
    </div>

    <p v-if="isSpinning" class="text-sm font-medium text-pink-400">Girando...</p>

    <div v-if="selectedPunishment && !pendingAction" class="grid w-full grid-cols-2 gap-3 place-items-center">
      <button
        type="button"
        class="rounded-full bg-pink-200 p-2"
        @click.stop="chooseCompleted"
      >
        <checkIcon class="size-8 text-pink-400" />
      </button>

      <button
        type="button"
        class="rounded-full bg-pink-200 p-2"
        @click.stop="chooseFailed"
      >
        <failIcon class="size-8 text-pink-400" />
      </button>
    </div>

    <div v-else-if="selectedPunishment && pendingAction" class="w-full font-semibold p-3 text-center">
      
      <div class="mt-3 grid grid-cols-1 gap-3">
           <button
          type="button"
          class="rounded-full bg-pink-200 p-2"
          @click.stop="handleConfirmAction"
        >
          <div class="flex flex-row items-center gap-2">
            <checkIcon class="size-8 text-pink-400" />
            {{ pendingAction === "completed" ? "Espero que hayas hecho el reto eh!" : "Confirmo que soy pussy" }}
          </div>
        </button>
        <button
          type="button"
          class="rounded-full bg-pink-200 p-2"
          @click.stop="cancelAction"
        >
          <div class="flex flex-row items-center gap-2">
            <failIcon class="size-8 text-pink-400" />
            {{ pendingAction === "completed" ? "Me acabo de cagar y no lo quiero hacer" : "Voy a intentarlo" }}
          </div>
        </button>
      </div>
    </div>
  </div>
</template>
