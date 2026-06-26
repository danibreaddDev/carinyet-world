<script setup lang="ts">
import { RouterLink } from 'vue-router';
import ArrowLeftCircleIcon from '@iconify-vue/mdi/arrow-left-circle';
import ProfileCard from '../../components/ProfileCard.vue';
import PlannerForm from './PlannerForm.vue';
</script>

<template>
    <section class="mx-auto flex w-full flex-1 flex-col gap-5">
        <RouterLink to="/home" class="text-pink-200 border p-2 bg-pink-200 rounded-full w-fit">
            <ArrowLeftCircleIcon class="text-pink-400 size-8" />
        </RouterLink>

        <ProfileCard />

        <PlannerForm />
    </section>
</template>
