<script setup lang="ts">
import { computed } from 'vue';
import type { SongRatingPayload } from '../../stores/music';

const props = defineProps<{
    feedback: SongRatingPayload;
}>();

const stars = computed(() => Array.from({ length: 5 }, (_, index) => index < Math.round(props.feedback.rating)));
</script>
<template>
    <div class="grid grid-cols-3 gap-5 rounded-3xl border border-pink-200 bg-white p-5 shadow-sm">
        <img :src="props.feedback.image_url" :alt="props.feedback.song" class="size-fit rounded-2xl self-center col-span-1">
        <div class="flex flex-col gap-2 col-span-2">
            <div class="flex flex-col gap-2">
                <h1>{{ props.feedback.song }}</h1>
                <p>{{ props.feedback.artist }}</p>
            </div>
            <div class="flex gap-1">
                <span
                    v-for="(filled, index) in stars"
                    :key="index"
                    class="text-xl"
                    :class="filled ? 'text-pink-400' : 'text-pink-100'"
                >
                    ★
                </span>
            </div>
            <p>{{ props.feedback.feedback }}</p>
        </div>
    </div>
</template>
