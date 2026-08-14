<script setup lang="ts">
import type { GoofyNote } from '../../stores/goofynotes';
import { RouterLink } from 'vue-router';
import { COLOR_MAP } from './colors';
import { ref } from 'vue';
import GoofyNotesEditForm from './GoofyNotesEditForm.vue';
import editIcon from '@iconify-vue/mdi/edit-box';
defineProps<{
        note: GoofyNote;
}>();

const showEdit = ref(false);

const openEdit = () => {
    showEdit.value = true;
};

const closeEdit = () => {
    showEdit.value = false;
};

const onSaved = () => {
  // store already updated via composable/store – close modal
  showEdit.value = false;
};
</script>
<template>
    <div class="relative">
      <RouterLink :to="`/goofy-notes/${note.id}`" class="flex flex-col gap-2 rounded-3xl border border-pink-200 bg-white p-4 shadow-sm">
        <h3 class="text-2xl font-bold text-pink-300">{{ note.name }}</h3>
        <div class="flex flex-row items-center gap-5">
            <span v-for="p in note.participants" :key="p.participant" class="font-bold text-lg rounded-full px-3 py-2 w-fit" :style="{ background: COLOR_MAP[p.color ?? 'blue'].fill, color: COLOR_MAP[p.color ?? 'blue'].accent }">
                {{ p.participant }}
            </span>
        </div>
      </RouterLink>

      <button @click.stop="openEdit" class="absolute top-3 right-3 bg-pink-200 rounded-full p-2">
        <editIcon class="size-8 text-pink-400" />
      </button>

      <GoofyNotesEditForm :note="note" :visible="showEdit" @close="closeEdit" @saved="onSaved" />
    </div>
</template>