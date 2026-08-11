<script setup lang="ts">
import type { GoofyNote } from '../../stores/goofynotes';
import GoofyNotesCard from './GoofyNotesCard.vue';
defineProps<{
  notes: GoofyNote[]
}>();
</script>
<template>
    <section>
        <div v-if="notes.length === 0" class="flex flex-col items-center justify-center gap-4 rounded-3xl border border-pink-200 bg-white p-4 shadow-sm">
            <p class="text-pink-300">No hay notas aún</p>
        </div>
        <div v-else class="grid grid-cols-1 gap-4">
            <div v-for="note in notes" :key="note.id" >
                <GoofyNotesCard :note="note" />
            </div>
        </div>
    </section>
</template>