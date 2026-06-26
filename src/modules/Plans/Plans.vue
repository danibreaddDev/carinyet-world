<script setup lang="ts">
import { computed, onMounted, watch } from 'vue';
import { RouterLink } from 'vue-router';
import ArrowLeftCircleIcon from '@iconify-vue/mdi/arrow-left-circle';
import plusIcon from '@iconify-vue/mdi/plus-circle';
import ProfileCard from '../../components/ProfileCard.vue';
import { usePlansStore } from '../../stores/plans';
import { useSpotifyStore } from '../../stores/spotify';
import PlansList from './PlansList.vue';
import SpotifyUser from '../Music/SpotifyUser.vue';

const spotifyStore = useSpotifyStore();
const plansStore = usePlansStore();
const isAuthenticated = computed(() => spotifyStore.isAuthenticated);

onMounted(async () => {
    if (spotifyStore.isAuthenticated) {
        await plansStore.getPlans();
    }
});

watch(
    () => spotifyStore.isAuthenticated,
    async (value) => {
        if (value) {
            await plansStore.getPlans();
        }
    },
);
</script>

<template>
    <section class="mx-auto flex w-full flex-1 flex-col gap-5">
        <div class="flex items-center justify-between gap-4 rounded-3xl border border-pink-200 bg-white p-4 shadow-sm">
            <RouterLink to="/home" class="text-pink-200 border p-2 bg-pink-200 rounded-full w-fit">
                <ArrowLeftCircleIcon class="text-pink-400 size-8" />
            </RouterLink>
            <ProfileCard />
        </div>

        <div v-if="!isAuthenticated" class="mx-auto w-full max-w-lg">
            <SpotifyUser />
        </div>

        <div v-else class="flex flex-col gap-10 p-4">
            <div class="flex flex-row items-center justify-between">
                <SpotifyUser />
                <RouterLink to="/plans/planner" class="text-pink-200 border p-2 bg-pink-200 rounded-full w-fit">
                    <plusIcon class="text-pink-400 size-8" />
                </RouterLink>
            </div>

            <PlansList :plans="plansStore.plans" />
        </div>
    </section>
</template>
