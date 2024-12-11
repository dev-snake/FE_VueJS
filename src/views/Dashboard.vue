<script setup lang="ts">
import { RouterView } from 'vue-router'
import Sidebar from '@/components/partials/sidebar.vue'
</script>
<template>
  <div>
    <div class="grid-cols-12">
      <Sidebar />
      <div class="grid-cols-10 px-4">
        <RouterView />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
