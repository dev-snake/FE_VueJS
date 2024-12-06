<script setup lang="ts">
import apiRoutes from '@/config/api_routes.config'
import axiosConfig from '@/config/axios.config'
import type { IAPI_Response } from '@/types/apiResponse'
import type { INewProduct, IProduct } from '@/types/product'
import { onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { toast } from 'vue3-toastify'
const router = useRouter()
const { params } = useRoute()
const newProduct = reactive<INewProduct>({
  productName: '',
  productPrice: 0,
  imageUrl: 'https://placehold.co/400',
  storage: 0,
})
const handleEditProduct = async () => {
  if ([newProduct.productName, newProduct.productPrice, newProduct.storage].includes('')) {
    return toast.warning('Vui lòng nhập thông tin đầy đủ !')
  }

  try {
    const res = await axiosConfig.put<IAPI_Response<IProduct>>(
      apiRoutes.product.edit(params.productId as string),
      newProduct,
    )
    if (res.data.status === 'success') {
      toast.success('Cập nhật sản phẩm thành công  !')
      router.push({ path: '/products' })
    }
    console.log(res)
  } catch (error) {
    console.log(error)
  }
}
onMounted(() => {
  const fetchData = async () => {
    try {
      const res = await axiosConfig.get<IAPI_Response<IProduct>>(
        apiRoutes.product.getOne(params.productId as string),
      )
      const productInfo = res.data.results
      if (res.data.status === 'success') {
        newProduct.productName = productInfo.productName
        newProduct.productPrice = productInfo.productPrice
        newProduct.storage = productInfo.storage
        console.log(res)
      }
    } catch (error) {
      console.log(error)
    }
  }
  fetchData()
})
</script>
<template>
  <div>
    <h1 class="py-4">Sửa sản phẩm</h1>
    <div>
      <form action="" @submit.prevent="handleEditProduct">
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
        <button type="submit" class="w-full mt-3 btn btn-primary">Sửa sản phẩm</button>
      </form>
    </div>
  </div>
</template>
<style scoped></style>
