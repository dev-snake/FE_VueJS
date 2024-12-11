<script setup lang="ts">
import formatCurrencyVN from '@/utils/formatMoney'
const {
  loading,
  revenueByCurrentDay,
  revenueByCurrentMonth,
  revenueByCurrentWeek,
  revenueByCurrentYear,
} = defineProps<{
  loading: boolean
  revenueByCurrentYear: number | undefined
  revenueByCurrentDay: number | undefined
  revenueByCurrentMonth: number | undefined
  revenueByCurrentWeek: number | undefined
}>()
</script>

<template>
  <div class="grid grid-cols-4 quick-stats-responsive gap-2">
    <div class="shadow-sm p-4 rounded-4">
      <div>
        <span class="fs-6 fw-bolder text-dark opacity-25 animate__animated animate__bounce d-block"
          >Doanh thu năm này</span
        >
        <div class="flex-center" v-if="loading">
          <div class="spinner-border spinner-border-sm text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
          <div class="spinner-grow spinner-grow-sm text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>
        <h2
          v-else="!loading"
          class="py-2 fs-1 animate__animated animate__bounce text-success text-shadow"
          v-text="formatCurrencyVN(revenueByCurrentYear ?? 0)"
        ></h2>
      </div>
    </div>
    <div class="shadow-sm p-4 rounded-4">
      <span class="fs-6 fw-bolder text-dark opacity-25 animate__animated animate__bounce d-block"
        >Doanh thu tháng này</span
      >
      <div class="flex-center" v-if="loading">
        <div class="spinner-border spinner-border-sm text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        <div class="spinner-grow spinner-grow-sm text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
      <h2
        class="py-2 animate__animated animate__bounce text-danger text-shadow-red fs-1"
        v-else
        v-text="formatCurrencyVN(revenueByCurrentMonth ?? 0)"
      ></h2>
    </div>
    <div class="shadow-sm p-4 rounded-4">
      <span class="fs-6 fw-bolder text-dark opacity-25 animate__animated animate__bounce d-block"
        >Doanh thu tuần này</span
      >
      <div class="flex-center" v-if="loading">
        <div class="spinner-border spinner-border-sm text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        <div class="spinner-grow spinner-grow-sm text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
      <h2
        class="py-2 animate__animated animate__bounce text-secondary fs-1"
        v-else
        v-text="formatCurrencyVN(revenueByCurrentWeek ?? 0)"
      ></h2>
    </div>
    <div class="shadow-sm p-4 rounded-4">
      <div class="">
        <span class="fs-6 fw-bolder text-dark opacity-25 animate__animated animate__bounce d-block"
          >Doanh thu hôm nay</span
        >
        <div class="flex-center" v-if="loading">
          <div class="spinner-border spinner-border-sm text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
          <div class="spinner-grow spinner-grow-sm text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>
        <h2
          class="py-2 animate__animated animate__bounce fs-1"
          v-else
          v-text="formatCurrencyVN(revenueByCurrentDay ?? 0)"
        ></h2>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
// .text-shadow {
//   text-shadow: 2px 2px greenyellow;
// }
// .text-shadow-red {
//   text-shadow: 2px 2px #f7c3c3;
// }
</style>
