<script setup lang="ts">
import { onMounted, reactive } from 'vue'
import { ref } from 'vue'
import type { IRevenueByMonth as IRevenueByYear } from '@/types/revenue_by_month'
import type { IRevenueByMonth } from '@/types/revenue_by_month'
import axiosConfig from '@/config/axios.config'
import apiRoutes from '@/config/api_routes.config'
import type { IAPI_Response } from '@/types/apiResponse'
import formatCurrencyVN from '@/utils/formatMoney'
import type { IRevenueByWeek } from '@/types/revenue_by_week'
import type { ITotalRevenueBy } from '@/types/totalRevenueBy'
import type { IRevenueByDay } from '@/types/revenue_by_date'
const totalRevenueBy = reactive<ITotalRevenueBy>({
  currentYear: 0,
  currentMonth: 0,
  currentWeek: 0,
  currentDay: 0,
})

const loading = ref<boolean>(true)
onMounted(() => {
  loading.value = true
  const fetchDataRevenueByYear = async () => {
    try {
      const [
        responseRevenueByYear,
        responseRevenueByMonth,
        responseRevenueByWeek,
        responseRevenueByDay,
      ] = await Promise.all([
        axiosConfig.get<IAPI_Response<IRevenueByYear[]>>(apiRoutes.revenue.getRevenueByYear),
        axiosConfig.get<IAPI_Response<IRevenueByMonth[]>>(apiRoutes.revenue.getRevenueByMonth),
        axiosConfig.get<IAPI_Response<IRevenueByWeek[]>>(apiRoutes.revenue.getRevenueByWeek),
        axiosConfig.get<IAPI_Response<IRevenueByDay[]>>(apiRoutes.revenue.getRevenueByDate),
      ])
      totalRevenueBy.currentYear = responseRevenueByYear.data.results.reduce(
        (total, item) => total + item.totalRevenue,
        0,
      )
      totalRevenueBy.currentMonth = responseRevenueByMonth.data.results.reduce(
        (total, item) => total + item.totalRevenue,
        0,
      )
      totalRevenueBy.currentWeek = responseRevenueByWeek.data.results.reduce(
        (total, item) => total + item.totalRevenue,
        0,
      )
      totalRevenueBy.currentDay = responseRevenueByDay.data.results.reduce(
        (total, item) => total + item.totalRevenue,
        0,
      )
    } catch (error) {
      console.log(error)
    } finally {
      loading.value = false
    }
  }
  fetchDataRevenueByYear()
})
</script>

<template>
  <div class="grid-col-4">
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
          v-text="formatCurrencyVN(totalRevenueBy.currentYear)"
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
        v-text="formatCurrencyVN(totalRevenueBy.currentMonth)"
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
        v-text="formatCurrencyVN(totalRevenueBy.currentWeek)"
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
          v-text="formatCurrencyVN(totalRevenueBy.currentDay)"
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
