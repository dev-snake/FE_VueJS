<script setup lang="ts">
import BarChart from '@/components/BarChart.vue'
import PolarChart from '@/components/PolarChart.vue'
import PiaChart from '@/components/PiaChart.vue'
import HeaderDashboard from '@/components/HeaderDashboard.vue'
import * as bootstrap from 'bootstrap'
import { onMounted, ref, watch } from 'vue'
import axiosConfig from '@/config/axios.config'
import Loading from '@/components/common/Loading.vue'
import apiRoutes from '@/config/api_routes.config'
import type { IAPI_Response } from '@/types/apiResponse'
import type { IRevenueByMonth } from '@/types/revenue_by_month'
import type { IProductSoldInfo } from '@/types/get_quantity_sold'
import type { IProduct } from '@/types/product'
import type { IQuantitySoldCurrentYear } from '@/types/quantity_sold_current_year'
import type { IRevenueResponse } from '@/types/revenue'
import GenYears from '@/utils/gen_years'
import { toast } from 'vue3-toastify'

const currentMonth = ref('')
const revenueByMonth = ref<IRevenueResponse[]>([])
const revenueAllYears = ref<any[]>([])
const numberOfProductsSold = ref<IProductSoldInfo[]>([])
const numberOfProductInventory = ref<IProduct[]>([])
const quantitySoldCurrentYearList = ref<IQuantitySoldCurrentYear[]>([])
const seletedYear = ref<string | number>('')
const seletedMonth = ref<string | number>('')
const seletedType = ref<string | number>('')
const loading = ref<boolean>(true)
const isFiltering = ref<boolean>(true)
const filterData = ref<any[]>([])
const setCurrentMonth = () => {
  const date = new Date()
  const year = date.getFullYear()
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  currentMonth.value = `${year}-${month}`
}

const fetchRevenue = async () => {
  try {
    const [
      responseRevenueByMonth,
      responseQuantitySold,
      responseInventory,
      responseQuantitySoldCurrentYear,
      responseAllYears,
    ] = await Promise.all([
      axiosConfig.get<IAPI_Response<IRevenueByMonth[]>>(
        apiRoutes.revenue.getRevenueAllMonthsOfCurrentYear,
      ),
      axiosConfig.get<IAPI_Response<IProductSoldInfo[]>>(apiRoutes.product.getQuantitySold),
      axiosConfig.get<IAPI_Response<IProduct[]>>(apiRoutes.product.inventory),
      axiosConfig.get<IAPI_Response<IQuantitySoldCurrentYear[]>>(
        apiRoutes.product.getQuantitySoldCurrentYear,
      ),
      axiosConfig.get<IAPI_Response<any[]>>(apiRoutes.revenue.years),
    ])
    revenueByMonth.value = responseRevenueByMonth.data.results
    numberOfProductsSold.value = responseQuantitySold.data.results
    quantitySoldCurrentYearList.value = responseQuantitySoldCurrentYear.data.results
    numberOfProductInventory.value = responseInventory.data.results
    revenueAllYears.value = responseAllYears.data.results
    console.log(responseAllYears)
  } catch (error) {
    console.log(error)
  } finally {
    loading.value = false
  }
}
const handleFilter = async () => {
  if ([seletedYear.value, seletedType.value].includes('')) {
    return toast.warning('Vui lòng chọn đầy đủ')
  }
  const modalElement = document.getElementById('exampleModal') as HTMLDivElement
  if (modalElement) {
    const modal = new bootstrap.Modal(modalElement, {
      keyboard: false,
    })
    modal.show()
  }
  isFiltering.value = true
  try {
    const response = await axiosConfig.post<IAPI_Response>(apiRoutes.revenue.filter, {
      month: +seletedMonth.value,
      type: seletedType.value,
      year: +seletedYear.value,
    })
    filterData.value = response.data.results
    console.log(response)
  } catch (error) {
    console.log(error)
  } finally {
    isFiltering.value = false
  }
}
watch(seletedType, () => {
  console.log(seletedType.value, 'selected type')
})
onMounted(() => {
  setCurrentMonth()
  loading.value = true
  fetchRevenue()
})
</script>
<template>
  <div class="">
    <h1 class="animate__animated animate__lightSpeedInRight mb-4 fs-1 py-4 text-uppercase">
      Biểu đồ thống kê doanh thu
    </h1>
    <HeaderDashboard />
    <!-- modal -->
    <div
      class="modal fade"
      id="exampleModal"
      tabindex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="exampleModalLabel">Kết quả tìm kiếm</h1>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <Loading v-show="isFiltering" />
            <div v-if="!isFiltering">
              <div v-if="seletedType === 'revenue_month' || seletedType === 'revenue_year'">
                <PiaChart
                  :label="'Doanh thu'"
                  :data-values="filterData.map((item) => item.totalRevenue)"
                  :labels="filterData.map((item) => item.year)"
                />
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
          </div>
        </div>
      </div>
    </div>
    <!--  -->
    <Loading v-show="loading" />
    <div v-show="!loading" class="mt-4">
      <div class="flex-end">
        <select
          v-model="seletedYear"
          class="form-select w-200 me-2"
          aria-label="Default select example"
        >
          <option value="" selected disabled>Chọn năm</option>
          <option v-for="(year, index) in GenYears()" :key="index" v-text="year"></option>
        </select>

        <select
          v-model="seletedMonth"
          class="form-select w-200 me-2"
          aria-label="Default select example"
          v-show="seletedType === 'quantity_sold_month' || seletedType === 'revenue_month'"
        >
          <option selected value="" disabled>Chọn tháng</option>
          <option
            :value="month"
            v-for="(month, index) in [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]"
            :key="index"
          >
            Tháng {{ month }}
          </option>
        </select>
        <select
          v-model="seletedType"
          class="form-select w-200 me-2"
          aria-label="Default select example"
        >
          <option value="" selected disabled>Chọn Kiểu muốn lọc</option>
          <option value="quantity_sold_month">Số lượng bán theo tháng</option>
          <option value="quantity_sold_year">Số lượng bán theo năm</option>
          <option value="revenue_month">Doanh thu theo tháng</option>
          <option value="revenue_year">Doanh thu theo năm</option>
        </select>
        <button type="button" class="btn btn-primary" @click="handleFilter">Lọc kết quả</button>
      </div>
    </div>
    <div class="grid-col-2 py-4" v-if="!loading">
      <div class="grid-item shadow-sm">
        <BarChart
          :label="'Tổng doanh thu'"
          :data-values="revenueByMonth.map((item) => item.totalRevenue)"
        />
        <h5 class="text-center">Tổng doanh thu các tháng của năm hiện tại</h5>
      </div>
      <div class="grid-item shadow-sm">
        <BarChart
          :label="'Tổng số lượng bán'"
          :chart-type="'line'"
          :data-values="quantitySoldCurrentYearList.map((item) => item.total_quantity_sold)"
        />

        <h5 class="text-center py-2">Số lượng bán của các tháng trong năm hiện tại</h5>
      </div>
    </div>
    <div class="grid-item-12 shadow-sm rounded-2 w-full" v-if="!loading">
      <div class="flex flex-response p-4 justify-content-center gap-4">
        <div class="text-center">
          <PolarChart :data-values="numberOfProductsSold" />
          <h5 class="py-2">Số lượng sản phẩm đã bán</h5>
        </div>
        <div class="text-center">
          <PiaChart
            :label="'Tồn kho'"
            :data-values="numberOfProductInventory.map((item) => item.storage)"
            :labels="numberOfProductInventory.map((item) => item.productName)"
          />
          <h5 class="py-2">Số lượng sản phẩm tồn kho</h5>
        </div>
        <div class="text-center">
          <PiaChart
            :chart-type="'doughnut'"
            :data-values="revenueAllYears.map((item) => item.totalRevenue)"
            :labels="revenueAllYears.map((item) => item.year)"
          />
          <h5 class="py-2">Doanh thu bán hàng của các năm</h5>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
