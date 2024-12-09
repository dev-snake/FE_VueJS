<script setup lang="ts">
import Chart from '@/components/chart/Chart.vue'
import PiaChart from '@/components/chart/PiaChart.vue'
import HeaderDashboard from '@/components/HeaderDashboard.vue'
import { onMounted, ref, watch } from 'vue'
import axiosConfig from '@/config/axios.config'
import Loading from '@/components/common/Loading.vue'
import apiRoutes from '@/config/api_routes.config'
import type { IAPI_Response, TFilterType } from '@/types/apiResponse'
import type { IProductSoldInfo } from '@/types/get_quantity_sold'
import type { IProduct } from '@/types/product'
import type { IQuantitySoldCurrentYear } from '@/types/quantity_sold_current_year'
import FilterBar from '@/components/FilterBar.vue'
import { toast } from 'vue3-toastify'
import PolarChart from '@/components/chart/PolarChart.vue'
const seletedType = ref<TFilterType>('')
const numberOfProductsSold = ref<IProductSoldInfo[]>([])
const numberOfProductInventory = ref<IProduct[]>([])
const quantitySoldCurrentYearList = ref<IQuantitySoldCurrentYear[]>([])
const seletedYear = ref<string | number>(new Date().getFullYear())
const revenueData = ref<IRevenueData>()
const selectedMonthOfRevenue = ref<number>()
const selectedMonthOfQuantitySold = ref<number>()
const seletedMonth = ref<string | number>('')
const loading = ref<boolean>(true)
const filterInfoOfRevenue = ref<{ month: number | null; type: TFilterType; year: number }>(
  {} as { month: number | null; type: TFilterType; year: number },
)
const filterInfoOfQuantitySold = ref<{ month: number | null; type: TFilterType; year: number }>(
  {} as { month: number | null; type: TFilterType; year: number },
)
const isFiltering = ref<boolean>(false)
const fetchRevenue = async () => {
  try {
    const [
      responseRevenueData,
      responseQuantitySold,
      responseInventory,
      responseQuantitySoldCurrentYear,
    ] = await Promise.all([
      axiosConfig.get<IAPI_Response<IRevenueData>>(apiRoutes.revenue.overview),
      axiosConfig.get<IAPI_Response<IProductSoldInfo[]>>(apiRoutes.product.getQuantitySold),
      axiosConfig.get<IAPI_Response<IProduct[]>>(apiRoutes.product.inventory),
      axiosConfig.get<IAPI_Response<IQuantitySoldCurrentYear[]>>(
        apiRoutes.product.getQuantitySoldCurrentYear,
      ),
    ])
    revenueData.value = responseRevenueData.data.results
    numberOfProductsSold.value = responseQuantitySold.data.results
    quantitySoldCurrentYearList.value = responseQuantitySoldCurrentYear.data.results
    numberOfProductInventory.value = responseInventory.data.results
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
  isFiltering.value = true
  try {
    const response = await axiosConfig.post<IAPI_Response>(apiRoutes.revenue.filter, {
      month: +seletedMonth.value,
      type: seletedType.value,
      year: +seletedYear.value,
    })
    if (seletedType.value === 'REVENUE_BY_YEAR') {
      if (revenueData.value) {
        revenueData.value.revenueByYear = response.data.results
      }
      filterInfoOfRevenue.value = {
        month: null,
        type: response.data.payload.type,
        year: response.data.payload.year,
      }
    } else if (seletedType.value === 'REVENUE_BY_MONTH') {
      if (revenueData.value) {
        revenueData.value.revenueByYear = response.data.results
      }
      filterInfoOfRevenue.value = response.data.payload
      console.log(filterInfoOfRevenue.value)
    } else if (seletedType.value === 'QUANTITY_SOLD_BY_YEAR') {
      quantitySoldCurrentYearList.value = response.data.results
      filterInfoOfQuantitySold.value = {
        month: null,
        type: response.data.payload.type,
        year: response.data.payload.year,
      }
    } else if (seletedType.value === 'QUANTITY_SOLD_BY_MONTH') {
      quantitySoldCurrentYearList.value = response.data.results
      filterInfoOfQuantitySold.value = response.data.payload
    }
    console.log(response)
  } catch (error) {
    console.log(error)
  } finally {
    isFiltering.value = false
  }
}

onMounted(() => {
  loading.value = true
  fetchRevenue()
})
</script>
<template>
  <div class="">
    <h1 class="animate__animated animate__lightSpeedInRight mb-4 fs-1 py-4 text-uppercase">
      Biểu đồ thống kê doanh thu
    </h1>
    <HeaderDashboard
      :loading="loading"
      :revenueByCurrentDay="revenueData?.revenueByDay[0]?.totalRevenue"
      :revenueByCurrentMonth="revenueData?.revenueByMonth[0].totalRevenue"
      :revenueByCurrentWeek="revenueData?.revenueByWeek[0].totalRevenue"
      :revenueByCurrentYear="
        revenueData?.revenueByYear.reduce((total, item) => total + item.totalRevenue, 0)
      "
    />

    <FilterBar
      v-show="!loading"
      v-model:seleted-year="seletedYear"
      v-model:selected-month-of-revenue="selectedMonthOfRevenue"
      v-model:selected-month-of-quantity-sold="selectedMonthOfQuantitySold"
      v-model:seleted-type="seletedType"
      v-model:seleted-month="seletedMonth"
      :isFiltering="isFiltering"
      :handleFilter="handleFilter"
    />
    <Loading v-show="loading" />
    <Loading v-show="isFiltering" />
    <div class="grid grid-cols-2 main-content-responsive gap-2 py-4" v-if="!loading">
      <div class="grid-item shadow-sm">
        <h5 class="text-center" v-text="`Biểu đồ doanh thu của năm`"></h5>
        <Chart
          :labels="
            revenueData?.revenueByYear.map((item) =>
              item.day === undefined ? item.month.toString() : item.day.toString(),
            )
          "
          :label="`
            Biểu đồ doanh thu của năm ${filterInfoOfRevenue.year || new Date().getFullYear()}  ${filterInfoOfRevenue.month ? 'Tháng ' + filterInfoOfRevenue.month : ''}
          `"
          :data-values="revenueData?.revenueByYear.map((item) => item.totalRevenue) ?? []"
        />
      </div>
      <div class="grid-item shadow-sm">
        <h5 class="text-center py-2" v-text="`Biểu đồ số lượng bán trong năm `"></h5>

        <Chart
          :labels="
            quantitySoldCurrentYearList.map((item) =>
              item.day === undefined ? item.month.toString() : item.day.toString(),
            )
          "
          :label="`
            Biểu đồ số lượng bán trong năm ${filterInfoOfQuantitySold.year || new Date().getFullYear()}  ${filterInfoOfQuantitySold.month ? 'Tháng ' + filterInfoOfQuantitySold.month : ''}
          `"
          :chart-type="'line'"
          :data-values="quantitySoldCurrentYearList.map((item) => item.total_quantity_sold)"
        />
      </div>
      <div class="text-center shadow-sm p-4">
        <h5 class="py-2">Số lượng sản phẩm đã bán</h5>
        <Chart
          :label="'Đã bán'"
          chart-type="line"
          :labels="numberOfProductsSold.map((item) => item.productName)"
          :data-values="numberOfProductsSold.map((item) => item.quantitySold)"
        />
      </div>
      <div class="text-center grid-item shadow-sm">
        <h5 class="py-2">Số lượng sản phẩm tồn kho</h5>
        <Chart
          :label="'Tồn kho'"
          :data-values="numberOfProductInventory.map((item) => item.storage)"
          :labels="numberOfProductInventory.map((item) => item.productName)"
        />
      </div>
    </div>
    <!--  -->
    <div class="grid-item-12 shadow-sm rounded-2 w-full" v-if="!loading">
      <div class="flex flex-response p-4 justify-content-center gap-4">
        <div class="text-center">
          <h5 class="py-2">Doanh thu bán hàng của các năm</h5>
          <PiaChart
            :chart-type="'doughnut'"
            :data-values="revenueData?.revenueAllYears.map((item) => item.totalRevenue) ?? []"
            :labels="revenueData?.revenueAllYears.map((item) => item.year) as any"
          />
        </div>
        <div class="text-center">
          <h5 class="py-2">Doanh thu bán hàng của các năm</h5>
          <PolarChart
            :chart-type="'doughnut'"
            :data-values="revenueData?.revenueAllYears.map((item) => item.totalRevenue) ?? []"
            :labels="revenueData?.revenueAllYears.map((item) => item.year) as any"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
