<script setup lang="ts">
import { ref } from 'vue';
import CameraIcon from '@iconify-vue/mdi/camera';
import type { Plan } from '../../stores/plans';
import { usePlanMemoryUpload } from './usePlanner';

const props = defineProps<{
    plan: Plan
}>();

const fileInputRef = ref<HTMLInputElement | null>(null);
const {
    isUploading,
    uploadMessage,
    uploadError,
    pendingMemoryUpload,
    handleMemoryUpload,
    triggerFilePicker,
} = usePlanMemoryUpload(props.plan, fileInputRef);
</script>
<template>
    <article class="flex flex-col gap-2 border rounded-2xl border-pink-400 p-5 bg-white relative">
        <img v-if="pendingMemoryUpload" class="size-20 absolute right-0 top-0 -translate-y-12" src="/assets/planner/pending_icon.png" />
        <p class="ms-12 font-bold text-pink-400">{{ new Date(plan.date).toLocaleDateString('es-ES', {
            weekday: 'long', day:
                '2-digit', month: 'long', year: 'numeric'
        }) }}</p>
        <p class="text-sm text-pink-300">{{ plan.plans.join(', ') }}</p>
        <p class="text-sm text-pink-300">{{ plan.food }}</p>
        <p class="text-sm text-pink-300">{{ plan.note }}</p>
        <img :src="plan.avatar_url" :alt="plan.username" class="size-16 -inset-x-2 -inset-y-5 absolute rounded-full" />

        <div v-if="pendingMemoryUpload" class="flex flex-col items-end gap-2">
            <button
                type="button"
                class="bg-pink-200 w-fit rounded-full p-2"
                :disabled="isUploading"
                @click="triggerFilePicker"
            >
                <CameraIcon class="size-6 text-pink-400" />
            </button>
            <input
                ref="fileInputRef"
                type="file"
                accept="image/*"
                class="hidden"
                @change="handleMemoryUpload"
            />
            <p v-if="uploadMessage" class="text-xs text-emerald-600">{{ uploadMessage }}</p>
            <p v-if="uploadError" class="text-xs text-rose-600">{{ uploadError }}</p>
        </div>
    </article>
</template>