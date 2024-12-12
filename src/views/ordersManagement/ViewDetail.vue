<script setup lang="ts">
import Loading from '@/components/common/Loading.vue'
import apiRoutes from '@/config/api_routes.config'
import axiosConfig from '@/config/axios.config'
import type { IAPI_Response } from '@/types/apiResponse'
import type { IProduct } from '@/types/product'
import type { IUser } from '@/types/user'
import formatCurrencyVN from '@/utils/formatMoney'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

interface PaymentInfo {
  customerId: string
  methodPayment: TMethodPayment
  orderStatus: TOrderStatus
}
interface NewOrderItem {
  productId: string | undefined
  productPrice: number | undefined
  productName?: string
  quantity: number
}
const productsList = ref<IProduct[]>([])
const totalOrder = ref<number>(0)
const userInfo = ref<IUser>({} as IUser)
const { params } = useRoute()
const isLoading = ref<boolean>(true)
onMounted(() => {
  isLoading.value = true
  const fetchData = async () => {
    try {
      const [response, responseUserList] = await Promise.all([
        axiosConfig.get<IAPI_Response>(apiRoutes.order.getOne(params.orderId as string)),
        axiosConfig.get<IAPI_Response<IUser[]>>(apiRoutes.user.getAll),
      ])
      productsList.value = response.data.results.products
      userInfo.value =
        responseUserList.data.results.find(
          (user) => user.id === response.data.results.customerId,
        ) || ({} as IUser)

      console.log(userInfo.value)
      totalOrder.value = response.data.results.totalOrder
    } catch (error) {
      console.log(error)
    } finally {
      isLoading.value = false
    }
  }
  fetchData()
})
</script>
<template>
  <h1 class="text-uppercase py-4">Chi tiết đơn hàng</h1>
  <Loading v-show="isLoading" />
  <div class="grid grid-cols-12 flex-gap-8 responsive-create-order p-2" v-show="!isLoading">
    <div class="col-span-6 border-2">
      <div class="shadow-sm w-full bg-white p-4 rounded-4">
        <h5>Số lượng sản phẩm đã mua</h5>
        <div class="w-full">
          <TransitionGroup name="orderItem" tag="div">
            <div
              class="border rounded-2 flex justify-center items-center mb-2"
              v-for="(product, index) in productsList"
              :key="index"
            >
              <div class="flex items-center">
                <img src="https://placehold.co/400" alt="" class="size-4 p-2 rounded-4" />
                <div>
                  <span v-text="product.productName"></span>
                  <h5 v-text="formatCurrencyVN(product.productPrice)"></h5>
                </div>
              </div>
              <div class="px-2">
                <span class="fs-6 me-2 fw-bold" v-text="`Số lượng  ${product.quantity}`"></span>
              </div>
            </div>
          </TransitionGroup>
        </div>
      </div>
      <div class="p-4 bg-white shadow-sm rounded-3 mt-4">
        <h5>Thông tin người mua hàng</h5>
        <div class="mt-2">
          <div class="flex justify-between items-center">
            <span class="fw-medium">Tên người dùng</span>
            <span v-text="userInfo.fullname"></span>
          </div>
          <div class="flex justify-between items-center">
            <span class="fw-medium">Email người dùng</span>
            <span v-text="userInfo.email"></span>
          </div>
          <div class="flex justify-between items-center">
            <span class="fw-medium">Địa chỉ</span>
            <span v-text="userInfo.address"></span>
          </div>
          <div class="flex justify-between items-center">
            <span class="fw-medium">Số điện thoại</span>
            <span v-text="userInfo.phoneNumber"></span>
          </div>
          <div class="flex justify-between items-center">
            <span class="fw-medium">Username</span>
            <span v-text="userInfo.username"></span>
          </div>
        </div>
      </div>
    </div>
    <div class="col-span-6 bg-white">
      <div class="mt-4">
        <div class="bg-white shadow-sm p-4 rounded-4">
          <div class="flex justify-content-between items-center">
            <h5>Tổng đơn hàng :</h5>
            <h3 v-text="formatCurrencyVN(totalOrder)" class="text-danger"></h3>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.orderItem-move,
.orderItem-enter-active,
.orderItem-leave-active {
  transition: all 0.5s ease;
}
.orderItem-leave-active {
  position: absolute;
  width: 717px;
}
.orderItem-enter-from,
.orderItem-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
.orderItem-enter-to,
.orderItem-leave-from {
  opacity: 1;
  transform: translateX(0);
}
</style>
