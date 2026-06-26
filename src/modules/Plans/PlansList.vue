<script setup lang="ts">
import type { Plan } from '../../stores/plans';
import PlanCard from './PlanCard.vue';

const props = defineProps<{
    plans: Plan[]
}>();
</script>
<template>
    <section class="grid grid-cols-1 md:grid-cols-2 gap-5">
        <PlanCard v-for="plan in plans" :plan="plan" />
    </section>
</template>