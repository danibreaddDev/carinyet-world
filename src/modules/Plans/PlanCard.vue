<script setup lang="ts">
import type { Plan } from '../../stores/plans';

defineProps<{
    plan: Plan
}>()
</script>
<template>
    <article class="flex flex-col gap-2 border rounded-2xl border-pink-400 p-5 bg-white relative">
        <p class="ms-12 font-bold text-pink-400">{{ new Date(plan.date).toLocaleDateString('es-ES', {
            weekday: 'long', day:
                '2-digit', month: 'long', year: 'numeric'
        }) }}</p>
        <p class="text-sm text-pink-300">{{ plan.plans.join(', ') }}</p>
        <p class="text-sm text-pink-300">{{ plan.food }}</p>
        <p class="text-sm text-pink-300">{{ plan.note }}</p>
        <img :src="plan.avatar_url" :alt="plan.username" class="size-16 -inset-x-2 -inset-y-5 absolute rounded-full" />
    </article>
</template>