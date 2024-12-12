<script setup lang="ts">
import apiRoutes from '@/config/api_routes.config'
import axiosConfig from '@/config/axios.config'
import type { IAPI_Response } from '@/types/apiResponse'
import type { IProduct } from '@/types/product'
import { onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from 'vue3-toastify'
import Loading from '@/components/common/Loading.vue'
import formatCurrencyVN from '@/utils/formatMoney'
const productsList = ref<IProduct[]>([])
const productsListCopy = ref<IProduct[]>([])
const searchValue = ref<string>('')
const loading = ref<boolean>(true)
const router = useRouter()
const handleDeleteProduct = async (productId: string) => {
  const isConfirm = confirm('Bạn có chắc chắn muốn xóa sản phẩm này không !')
  if (isConfirm) {
    try {
      const res = await axiosConfig.delete<IAPI_Response<IProduct>>(
        apiRoutes.product.delete(productId),
      )
      if (res.data.status === 'success') {
        productsList.value = productsList.value.filter((item) => item.id !== productId)
        return toast.success('Xóa sản phẩm thành công !')
      }
    } catch (error) {
      console.log(error)
    }
  }
}
const handleSearchProduct = () => {
  if (!searchValue.value) {
    productsList.value = productsListCopy.value
  }
  productsList.value = productsList.value.filter((item) =>
    item.productName.toLowerCase().trim().includes(searchValue.value.trim().toLowerCase()),
  )
}

onMounted(() => {
  const fetchData = async () => {
    try {
      const res = await axiosConfig.get<IAPI_Response<IProduct[]>>(apiRoutes.product.getAll)
      productsList.value = res.data.results
      productsListCopy.value = res.data.results
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
    <h1 class="text-uppercase py-4 animate__animated animate__lightSpeedInRight">
      Danh sách tất cả sản phẩm
    </h1>
  </div>
  <div class="flex-end flex-gap-4">
    <div>
      <input
        type="text"
        class="form-control"
        v-model="searchValue"
        @keyup.enter="handleSearchProduct"
      />
    </div>
    <button
      class="btn bg-secondary text-white p-2 rounded-2 opacity-75"
      @click="handleSearchProduct"
    >
      Tìm kiếm
    </button>
    <button
      class="btn bg-primary text-white p-2 rounded-2"
      @click="router.push({ path: '/products/create' })"
    >
      Thêm sản phẩm mới
    </button>
  </div>
  <Loading v-show="loading" />
  <table class="table py-4 table-hover" v-show="!loading">
    <thead>
      <tr>
        <th>#</th>
        <th>Tên sản phẩm</th>
        <th>Giá</th>
        <th>Hành động</th>
      </tr>
    </thead>

    <TransitionGroup name="list" tag="tbody">
      <tr v-show="productsList.length === 0">
        <td colspan="5" class="text-center fst-italic py-2">
          <span>Không tìm thấy sản phẩm nào phù hợp</span>
        </td>
      </tr>
      <tr
        v-for="(product, index) in productsList"
        :key="index"
        :style="`transition-delay: ${index * 300}ms;`"
      >
        <td v-text="index + 1"></td>
        <td v-text="product.productName"></td>
        <td v-text="formatCurrencyVN(product.productPrice)"></td>
        <td class="">
          <button
            class="btn btn-warning text-white me-2"
            @click="router.push({ path: `/products/${product.id}/edit` })"
          >
            Sửa
          </button>
          <button class="btn btn-danger text-white" @click="handleDeleteProduct(product.id)">
            Xóa
          </button>
        </td>
      </tr>
    </TransitionGroup>
  </table>
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
