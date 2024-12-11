<script setup lang="ts">
import apiRoutes from '@/config/api_routes.config'
import axiosConfig from '@/config/axios.config'
import type { IAPI_Response } from '@/types/apiResponse'
import formatCurrencyVN from '@/utils/formatMoney'
import { onBeforeMount, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import Loading from '@/components/common/Loading.vue'
const filterStatus = ref<string | null>(null)
const ordersList = ref<IOrderItem[]>([])
const ordersListFiltered = ref<IOrderItem[]>([])
const loading = ref<boolean>(true)
const router = useRouter()
const handleFilterStatus = (status: string) => {
  filterStatus.value = status
}
watch(filterStatus, (newValue) => {
  if (newValue === 'all') {
    ordersListFiltered.value = ordersList.value
  } else {
    ordersListFiltered.value = ordersList.value.filter((order) => order.orderStatus === newValue)
  }
})

onMounted(() => {
  loading.value = true
  const fetchData = async () => {
    try {
      const response = await axiosConfig.get<IAPI_Response<IOrderItem[]>>(apiRoutes.order.getAll)
      if (response.data.status === 'success') {
        console.log(response)
        ordersList.value = response.data.results
        filterStatus.value = 'all'
        ordersListFiltered.value = response.data.results
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
      <select
        class="form-select w-200 me-2"
        id="floatingSelect"
        aria-label="Floating label select example"
        v-model="filterStatus"
      >
        <option selected value="all">Tất cả</option>
        <option value="pending">pendding</option>
        <option value="canceled">canceled</option>
        <option value="completed">completed</option>
      </select>

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
          <th scope="col">Phương thức thanh toán</th>
          <th scope="col">Trạng thái đơn hàng</th>
          <th scope="col">Tổng đơn hàng</th>
          <th scope="col">Hành động</th>
        </tr>
      </thead>
      <TransitionGroup name="list" tag="tbody">
        <tr
          v-for="(order, index) in ordersListFiltered"
          :key="index"
          :style="`transition-delay: ${index * 300}ms;`"
        >
          <th scope="row" v-text="index + 1"></th>
          <td v-text="'Đơn hàng'"></td>
          <td v-text="new Date(order?.created_at).toLocaleDateString()"></td>
          <td>
            <span v-text="order.methodPayment"></span>
          </td>
          <td>
            <span
              v-text="order.orderStatus"
              class="text-white p-1 px-3 opacity-75 text-uppercase fw-lighter rounded-4"
              :class="
                order.orderStatus === 'pending'
                  ? 'bg-warning'
                  : order.orderStatus === 'completed'
                    ? 'bg-success'
                    : 'bg-danger'
              "
            ></span>
          </td>
          <td v-text="formatCurrencyVN(order.totalOrder)"></td>
          <td>
            <button
              class="btn btn-warning text-white me-2"
              @click="router.push({ path: `/order/${order.id}/edit` })"
            >
              Sửa
            </button>
          </td>
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
