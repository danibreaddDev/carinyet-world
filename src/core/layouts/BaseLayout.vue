<script setup lang="ts">
import { RouterView } from 'vue-router';
</script>
<template>
    <main class="bg-yellow-50 min-h-screen p-5">
        <div class="flex flex-col gap-5 h-screen font-primary container mx-auto">
            <RouterView />
        </div>
    </main>
</template>