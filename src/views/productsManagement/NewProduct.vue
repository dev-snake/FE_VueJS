<script setup lang="ts">
import apiRoutes from '@/config/api_routes.config'
import axiosConfig from '@/config/axios.config'
import type { IAPI_Response } from '@/types/apiResponse'
import type { INewProduct, IProduct } from '@/types/product'
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from 'vue3-toastify'
const router = useRouter()
const isSubmitting = ref<boolean>(false)
const newProduct = reactive<INewProduct>({
  productName: '',
  productPrice: 0,
  imageUrl: 'https://placehold.co/400',
  storage: 0,
})
const handleNewProduct = async () => {
  if (isSubmitting.value) return
  if ([newProduct.productName, newProduct.productPrice, newProduct.storage].includes('')) {
    return toast.warning('Vui lòng nhập thông tin đầy đủ !')
  }
  isSubmitting.value = true
  try {
    const res = await axiosConfig.post<IAPI_Response<IProduct>>(
      apiRoutes.product.create,
      newProduct,
    )
    if (res.data.status === 'success') {
      toast.success('Thêm sản phẩm thành công  !')
      router.push({ path: '/products' })
    }
    console.log(res)
  } catch (error) {
    console.log(error)
  } finally {
    isSubmitting.value = false
  }
}
</script>
<template>
  <div>
    <h1 class="py-4">Thêm sản phẩm</h1>
    <div>
      <form action="" @submit.prevent="handleNewProduct">
        <div class="flex-center w-full flex-gap-4 mb-2">
          <div class="w-full">
            <label for="" class="form-label">Nhập tên sản phẩm</label>
            <input type="text" class="w-full form-control" v-model="newProduct.productName" />
          </div>
          <div class="w-full">
            <label for="" class="form-label">Nhập giá sản phẩm</label>
            <input type="number" class="w-full form-control" v-model="newProduct.productPrice" />
          </div>
        </div>
        <div class="w-full">
          <label for="" class="form-label">Nhập số trong kho</label>
          <input type="number" class="w-full form-control" v-model="newProduct.storage" />
        </div>
        <button type="submit" class="w-full mt-3 btn btn-primary" :disabled="isSubmitting">
          {{ isSubmitting ? 'Đang xử lí ...' : 'Thêm sản phẩm' }}
        </button>
      </form>
    </div>
  </div>
</template>
<style scoped></style>
