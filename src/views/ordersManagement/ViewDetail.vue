<script setup lang="ts">
import apiRoutes from '@/config/api_routes.config'
import axiosConfig from '@/config/axios.config'
import type { IAPI_Response } from '@/types/apiResponse'
import type { IProduct } from '@/types/product'
import type { IUser } from '@/types/user'
import formatCurrencyVN from '@/utils/formatMoney'
import { onMounted, ref, watch, Transition } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { toast } from 'vue3-toastify'

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
const usersList = ref<IUser[]>([])
const newOrder = ref<NewOrderItem[]>([])
const paymentInfo = ref<PaymentInfo>({} as PaymentInfo)
const loading = ref<boolean>(true)
const totalOrder = ref<number>(0)
const router = useRouter()
const { params } = useRoute()
onMounted(() => {})
</script>
<template>
  <h1 class="text-uppercase py-4">Chi tiết đơn hàng</h1>
  <div class="grid grid-cols-12 flex-gap-8 responsive-create-order p-2">
    <div class="col-span-6 border-2">
      <div class="shadow-sm w-full bg-white p-4 rounded-4">
        <h5>Chọn sản phẩm để thêm</h5>
        <div class="w-full">
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
          </div>
        </div>
      </div>
      <div class="p-4 bg-white shadow-sm rounded-3 mt-4">
        <label for="floatingSelect">Người mua hàng</label>
      </div>
    </div>
    <div class="col-span-6 bg-white">
      <div class="shadow-sm p-4 rounded-4">
        <h5>Số lượng sản phẩm đã thêm</h5>
        <TransitionGroup name="orderItem" tag="div">
          <div
            class="border rounded-2 flex justify-center items-center mb-2"
            v-for="(order, index) in newOrder"
            :key="index"
          >
            <div class="w-100">
              <img src="https://placehold.co/400" alt="" class="size-4 p-2 rounded-4" />
              <span v-text="order.productName"></span>
            </div>
          </div>
        </TransitionGroup>
      </div>
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
