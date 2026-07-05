<script setup lang="ts">
import musicIcon from "@iconify-vue/mdi/music-box"
import planIcon from "@iconify-vue/mdi/planner"
</script>
<template>
    <div class="absolute bottom-10 w-full flex flex-col items-center">
        <nav class="border-2 bg-white border-pink-300 px-5 py-2 rounded-full w-full max-w-xs self-center">
            <ul class="flex flex-row w-full justify-around items-center">
                <li>
                    <RouterLink to="/admin/music">
                        <musicIcon class="size-12 text-pink-300" />
                    </RouterLink>
                </li>
                <li>
                    <RouterLink to="/admin/planner">
                        <planIcon class="size-12 text-pink-300" />
                    </RouterLink>
                </li>
            </ul>
        </nav>
    </div>
</template>