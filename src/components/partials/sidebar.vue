<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>
<template>
  <div class="side-bar col-span-2 shadow-sm h-screen">
    <h2 class="text-center py-4 fs-1 text-uppercase">Dashboard</h2>

    <div class="p-4 flex-column">
      <RouterLink
        to="/dashboard"
        activeClass="bg-primary  text-white"
        class="text-size-1 fw-medium text-uppercase text-decoration-none px-2 py-3 w-full text-center rounded-2 cursor-pointer"
        >Thống kê</RouterLink
      >
      <RouterLink
        activeClass="bg-primary  text-white"
        to="/products"
        class="text-size-1 fw-medium text-uppercase text-decoration-none px-2 py-3 w-full text-center rounded-2 cursor-pointer"
        >Sản Phẩm</RouterLink
      >
      <RouterLink
        activeClass="bg-primary  text-white"
        to="/orders"
        class="text-size-1 fw-medium text-uppercase text-decoration-none px-2 py-3 w-full text-center rounded-2 cursor-pointer"
        >Đơn hàng</RouterLink
      >
      <RouterLink
        activeClass="bg-primary  text-white"
        to="/users"
        class="text-size-1 fw-medium text-uppercase text-decoration-none px-2 py-3 w-full text-center rounded-2 cursor-pointer"
        >Người dùng</RouterLink
      >
    </div>
  </div>
</template>

<style scoped></style>
