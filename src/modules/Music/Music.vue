<script setup lang="ts">
import MusicSwap from './MusicSwap.vue';
import { ArrowLeft } from '@lucide/vue';
import ProfileCard from '../../components/ProfileCard.vue';
</script>
<template>
    <div class="flex flex-col gap-5 w-full">
        <ProfileCard />
        <RouterLink to="/home" class="text-pink-200 border p-2 bg-pink-200 rounded-full w-fit">
            <ArrowLeft :size=16 class="text-white" />
        </RouterLink>
        <MusicSwap />
    </div>

</template>