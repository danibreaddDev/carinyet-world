<script setup lang="ts">
import AdminBar from '../../components/AdminBar.vue';
</script>

<template>
  <div class="relative min-h-screen">
    <div v-if="$route.matched.length === 1" class="p-4">
      <h1 class="text-xl font-semibold">Admin</h1>
      <p class="mt-1 text-sm text-gray-600">pues no se esto lo ve el bauti todo poderoso.</p>
    </div>

    <RouterView v-else />
    <AdminBar />
  </div>
</template>