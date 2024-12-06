<script setup lang="ts">
import { RouterView } from 'vue-router'
import Sidebar from '@/components/partials/sidebar.vue'
</script>
<template>
  <div>
    <div class="grid-container">
      <Sidebar />
      <div class="main-content px-4">
        <RouterView />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
