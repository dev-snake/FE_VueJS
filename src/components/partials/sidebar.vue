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
  <div class="hide responsive-sidebar">
    <i
      class="bx bx-menu fs-3 cursor-pointer mx-auto rounded-4 d-block ms-4 mt-4"
      data-bs-toggle="offcanvas"
      data-bs-target="#offcanvasScrolling"
      aria-controls="offcanvasScrolling"
    ></i>

    <div
      class="offcanvas offcanvas-start"
      data-bs-scroll="true"
      data-bs-backdrop="false"
      tabindex="-1"
      id="offcanvasScrolling"
      aria-labelledby="offcanvasScrollingLabel"
    >
      <div class="offcanvas-header">
        <h5 class="offcanvas-title" id="offcanvasScrollingLabel">Dashboard</h5>
        <button
          type="button"
          class="btn-close"
          data-bs-dismiss="offcanvas"
          aria-label="Close"
        ></button>
      </div>
      <div class="offcanvas-body">
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
    </div>
  </div>
</template>

<style scoped></style>
