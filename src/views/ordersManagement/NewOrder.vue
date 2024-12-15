<script setup lang="ts">
import apiRoutes from '@/config/api_routes.config'
import axiosConfig from '@/config/axios.config'
import type { IAPI_Response } from '@/types/apiResponse'
import type { IProduct } from '@/types/product'
import type { IUser } from '@/types/user'
import formatCurrencyVN from '@/utils/formatMoney'
import GenYears from '@/utils/gen_years'
import { onMounted, ref, watch, Transition } from 'vue'
import { useRouter } from 'vue-router'
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
const isCreatingOrder = ref<boolean>(false)
const date = ref({
  year: new Date().getFullYear(),
  month: new Date().getMonth() + 1,
})
const handleAddProduct = (productId: string) => {
  const product = productsList.value.find((p) => p.id === productId)
  const newOrderItem = {
    productId: product?.id,
    productPrice: product?.productPrice,
    productName: product?.productName,
    quantity: 1,
  }
  const checkExist = newOrder.value.find((item) => item.productId === productId)
  if (checkExist) {
    checkExist.quantity += 1
  } else {
    newOrder.value = [...newOrder.value, newOrderItem]
  }
}
const handleDeleteItemOrder = (productId: string) => {
  newOrder.value = newOrder.value.filter((item) => item.productId !== productId)
}
const handleIncreaseItemOrder = (productId: string) => {
  const orderItem = newOrder.value.find((item) => item.productId === productId)
  if (orderItem) {
    orderItem.quantity += 1
  }
}
const handleDecreaseItemOrder = (productId: string) => {
  const orderItem = newOrder.value.find((item) => item.productId === productId)
  if (orderItem && orderItem.quantity >= 2) {
    orderItem.quantity -= 1
  }
}
const handleCreateOrder = async () => {
  if (newOrder.value.length === 0) {
    return toast.warning('Vui lòng thêm sản phẩm trước khi tạo  !')
  }
  if (!paymentInfo.value.customerId || !paymentInfo.value.methodPayment) {
    return toast.warning('Vui lòng nhập người đầy đủ thông tin')
  }
  isCreatingOrder.value = true
  try {
    const res = await axiosConfig.post<IAPI_Response>(apiRoutes.order.create, {
      products: newOrder.value,
      methodPayment: paymentInfo.value.methodPayment,
      customerId: paymentInfo.value.customerId,
      orderStatus: 'completed',
      year: date.value.year,
      month: date.value.month,
    })
    if (res.data.status === 'success') {
      toast.success('Tạo đơn hàng thành công !')
      return router.push({ path: '/orders' })
    }
  } catch (error) {
    console.log(error)
  } finally {
    isCreatingOrder.value = false
  }
}
watch(
  newOrder,
  (newData) => {
    totalOrder.value = newData.reduce(
      (total, orderItem) => total + (orderItem.productPrice ?? 0) * orderItem.quantity,
      0,
    )
    console.log(totalOrder.value)
  },

  { deep: true },
)
watch(
  paymentInfo,
  (newValue) => {
    console.log('', newValue)
  },
  { deep: true },
)
onMounted(() => {
  const fetchData = async () => {
    loading.value = true
    try {
      const [res, responseUsersList] = await Promise.all([
        axiosConfig.get<IAPI_Response<IProduct[]>>(apiRoutes.product.getAll),
        axiosConfig.get<IAPI_Response<IUser[]>>(apiRoutes.user.getAll),
      ])
      if (res.data.status === 'success') {
        productsList.value = res.data.results
        usersList.value = responseUsersList.data.results

        console.log(responseUsersList)
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
  <h1 class="text-uppercase py-4">Tạo đơn hàng</h1>
  <div class="grid grid-cols-12 flex-gap-8 responsive-create-order p-2">
    <div class="col-span-6 border-2">
      <div class="shadow-sm w-full bg-white p-4 rounded-4">
        <h5>Chọn sản phẩm để thêm</h5>
        <div class="flex-center mt-4" v-show="loading">
          <div class="spinner-border spinner-border-sm text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
          <div class="spinner-grow spinner-grow-sm text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>
        <div class="w-full" v-show="!loading">
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
            <div class="px-4">
              <button class="btn border-2 btn-primary" @click="handleAddProduct(product.id)">
                <i class="bi bi-plus-circle"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="p-4 bg-white shadow-sm rounded-3 mt-4">
        <h5 class="mb-2">Chọn người mua hàng</h5>
        <div class="form-floating">
          <select
            v-model="paymentInfo.customerId"
            class="form-select"
            id="floatingSelect"
            aria-label="Floating label select example"
          >
            <option selected>Chọn người mua</option>
            <option
              :value="user.id"
              v-for="(user, index) in usersList"
              :key="index"
              v-text="user.fullname"
            ></option>
          </select>
          <label for="floatingSelect">Người mua hàng</label>
        </div>
      </div>
      <div class="p-4 bg-white shadow-sm rounded-3 mt-4">
        <h5 class="mb-2">Chọn Phương thức thanh toán</h5>
        <div class="form-floating">
          <select
            v-model="paymentInfo.methodPayment"
            class="form-select"
            id="floatingSelect"
            aria-label="Floating label select example"
          >
            <option selected disabled>Chọn phương thức thanh toán</option>
            <option value="cash">Cash</option>
            <option value="momo">Momo</option>
            <option value="zalo">Zalo</option>
            <option value="visa">Visa</option>
          </select>
          <label for="floatingSelect">Chọn phương thức thanh toán</label>
        </div>
      </div>
      <div class="p-4 bg-white shadow-sm rounded-3 mt-4">
        <h5 class="mb-2">Chọn tháng và năm</h5>
        <div class="flex gap-2">
          <div class="form-floating w-100">
            <select
              v-model="date.year"
              class="form-select"
              id="floatingSelect"
              aria-label="choose year"
            >
              <option selected>Chọn Năm</option>
              <option
                :value="item"
                v-for="(item, index) in GenYears()"
                :key="index"
                v-text="item"
              ></option>
            </select>
            <label for="floatingSelect">Chọn năm </label>
          </div>
          <div class="form-floating w-100">
            <select
              v-model="date.month"
              class="form-select"
              id="floatingSelect"
              aria-label="Floating label select example"
            >
              <option selected>Chọn tháng</option>
              <option
                :value="item"
                v-for="(item, index) in Array.from({ length: 12 }).map((_, i) => i + 1)"
                :key="index"
                v-text="item"
              ></option>
            </select>
            <label for="floatingSelect">Chọn tháng</label>
          </div>
        </div>
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
            <div class="flex flex-gap-2">
              <button
                class="btn border"
                @click="handleDecreaseItemOrder(order.productId as string)"
              >
                -
              </button>
              <input type="text" class="form-control w-25" readonly v-model="order.quantity" />
              <button
                @click="handleIncreaseItemOrder(order.productId as string)"
                class="btn border"
              >
                +
              </button>
            </div>
            <div class="px-4">
              <button
                class="btn border-2 btn-danger"
                @click="handleDeleteItemOrder(order.productId as string)"
              >
                <i class="bi bi-trash-fill"></i>
              </button>
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
      <div class="mt-4">
        <button
          :disabled="isCreatingOrder"
          class="w-full p-2 btn btn-primary"
          @click="handleCreateOrder"
        >
          Tạo đơn hàng
        </button>
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
