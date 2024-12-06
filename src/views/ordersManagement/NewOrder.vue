<script setup lang="ts">
import apiRoutes from '@/config/api_routes.config'
import axiosConfig from '@/config/axios.config'
import type { IAPI_Response } from '@/types/apiResponse'
import type { IProduct } from '@/types/product'
import formatCurrencyVN from '@/utils/formatMoney'
import { onMounted, ref, watch, Transition } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from 'vue3-toastify'
interface NewOrderItem {
  productId: string | undefined
  productPrice: number | undefined
  productName?: string
  quantity: number
}
const productsList = ref<IProduct[]>([])
const newOrder = ref<NewOrderItem[]>([])
const loading = ref<boolean>(true)
const totalOrder = ref<number>(0)
const router = useRouter()
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
  try {
    const res = await axiosConfig.post<IAPI_Response>(apiRoutes.order.create, {
      products: newOrder.value,
    })
    if (res.data.status === 'success') {
      toast.success('Tạo đơn hàng thành công !')
      return router.push({ path: '/orders' })
    }
  } catch (error) {
    console.log(error)
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
onMounted(() => {
  const fetchData = async () => {
    loading.value = true
    try {
      const res = await axiosConfig.get<IAPI_Response<IProduct[]>>(apiRoutes.product.getAll)
      if (res.data.status === 'success') {
        productsList.value = res.data.results
        console.log(res)
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
  <h1 class="text-uppercase py-4 grid-item-12">Tạo đơn hàng</h1>
  <div class="grid-container flex-gap-8">
    <div class="grid-item-m-6 border-2 shadow-sm w-full bg-white p-4 rounded-4">
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
    <div class="grid-item-7-end shadow-sm w-full bg-white p-4 rounded-4 position-relative">
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
            <button class="btn border" @click="handleDecreaseItemOrder(order.productId as string)">
              -
            </button>
            <input type="text" class="form-control w-25" readonly v-model="order.quantity" />
            <button @click="handleIncreaseItemOrder(order.productId as string)" class="btn border">
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
    <div class="grid-item-7-end bg-white shadow-sm p-4 rounded-4">
      <div class="flex justify-content-between items-center">
        <h5>Tổng đơn hàng :</h5>
        <h3 v-text="formatCurrencyVN(totalOrder)" class="text-danger"></h3>
      </div>
    </div>
    <div class="grid-item-7-end">
      <button class="w-full p-2 btn btn-primary" @click="handleCreateOrder">Tạo đơn hàng</button>
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
