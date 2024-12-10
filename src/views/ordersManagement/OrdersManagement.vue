<script setup lang="ts">
import apiRoutes from '@/config/api_routes.config'
import axiosConfig from '@/config/axios.config'
import type { IAPI_Response } from '@/types/apiResponse'
import formatCurrencyVN from '@/utils/formatMoney'
import { onMounted, ref, Transition } from 'vue'
import { useRouter } from 'vue-router'
import Loading from '@/components/common/Loading.vue'
interface IOrderItem {
  id: string
  totalOrder: number
  created_at: string
  updated_at: string
}
const ordersList = ref<IOrderItem[]>([])
const loading = ref<boolean>(true)
const router = useRouter()
onMounted(() => {
  loading.value = true
  const fetchData = async () => {
    try {
      const response = await axiosConfig.get<IAPI_Response<IOrderItem[]>>(apiRoutes.order.getAll)
      if (response.data.status === 'success') {
        console.log(response)
        ordersList.value = response.data.results
      }
    } catch (error) {
      console.log(error)
    } finally {
      loading.value = false
    }
  }
  fetchData()
})
</script>
<template>
  <div>
    <div>
      <h1 class="text-uppercase py-4 animate__animated animate__lightSpeedInRight">
        Danh sách tất cả đơn hàng
      </h1>
    </div>
    <div class="flex-end">
      <button
        class="btn bg-primary text-white p-2 rounded-2"
        @click="router.push({ path: '/order/create' })"
      >
        Tạo đơn hàng
      </button>
    </div>
    <Loading v-show="loading" />
    <table class="table" v-show="!loading">
      <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">Đơn hàng</th>
          <th scope="col">Ngày tạo đơn</th>
          <th scope="col">Tổng đơn hàng</th>
        </tr>
      </thead>
      <TransitionGroup name="list" tag="tbody">
        <tr v-for="(order, index) in ordersList" :key="index">
          <th scope="row" v-text="index + 1"></th>
          <td v-text="'Đơn hàng'"></td>
          <td v-text="new Date(order?.created_at).toLocaleDateString()"></td>
          <td v-text="formatCurrencyVN(order.totalOrder)"></td>
        </tr>
      </TransitionGroup>
    </table>
  </div>
</template>

<style scoped>
.list-move,
.list-enter-active,
.list-leave-active {
  transition: all 1s ease;
}
/* .list-leave-active{
  position: absolute;
} */
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
.list-enter-to,
.list-leave-from {
  opacity: 1;
  transform: translateX(0);
}
</style>
