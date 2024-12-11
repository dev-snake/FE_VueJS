<script setup lang="ts">
import apiRoutes from '@/config/api_routes.config'
import axiosConfig from '@/config/axios.config'
import type { IAPI_Response } from '@/types/apiResponse'
import type { IUser } from '@/types/user'
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { toast } from 'vue3-toastify'

const newUser = ref<IUser>({
  fullname: '',
  username: '',
  email: '',
  phoneNumber: '',
  address: '',
  password: 'Haudang2004@',
})
const { params } = useRoute()
const router = useRouter()
const isSubmitting = ref<boolean>(false)
const handleEditUser = async () => {
  if (
    [
      newUser.value.fullname,
      newUser.value.username,
      newUser.value.email,
      newUser.value.phoneNumber,
    ].includes('')
  ) {
    toast.warning('Vui lòng điền đầy đủ thông tin')
    return
  }
  isSubmitting.value = true
  try {
    const response = await axiosConfig.put<IAPI_Response<IUser>>(
      apiRoutes.user.edit(params.userId as string),
      newUser.value,
    )
    if (response.data.status === 'success') {
      toast.success('Tạo người dùng thành công')
      return router.push({ path: '/users' })
    }
  } catch (error) {
    console.log(error)
  }
  console.log(newUser.value)
}
onMounted(() => {
  const fetchData = async () => {
    try {
      const response = await axiosConfig.get<IAPI_Response<IUser>>(
        apiRoutes.user.getOne(params.userId as string),
      )
      newUser.value = response.data.results
      console.log(response.data.results, 'getOne')
    } catch (error) {
      console.log(error)
    }
  }
  fetchData()
})
</script>
<template>
  <div>
    <h1 class="text-uppercase py-4 animate__animated animate__lightSpeedInRight">
      Tạo người dùng mới
    </h1>
  </div>
  <div class="row">
    <div class="col-6">
      <div class="form-group">
        <label for="fullName">Họ và tên</label>
        <input type="text" class="form-control" id="fullName" v-model="newUser.fullname" />
      </div>
    </div>
    <div class="col-6">
      <div class="form-group">
        <label for="username">Tên đăng nhập</label>
        <input type="text" class="form-control" id="username" v-model="newUser.username" />
      </div>
    </div>
  </div>
  <div class="row">
    <div class="col-6">
      <div class="form-group">
        <label for="email">Email</label>
        <input type="email" class="form-control" id="email" v-model="newUser.email" />
      </div>
    </div>
    <div class="col-6">
      <div class="form-group">
        <label for="phoneNumber">Số điện thoại</label>
        <input type="text" class="form-control" id="phoneNumber" v-model="newUser.phoneNumber" />
      </div>
    </div>
  </div>
  <div class="row">
    <div class="form-group">
      <label for="phoneNumber">Địa chỉ</label>
      <input type="text" class="form-control" id="address" v-model="newUser.address" />
    </div>
  </div>
  <div class="row mt-4">
    <div class="col-12 w-full">
      <button
        class="btn bg-primary text-white p-2 rounded-2 w-full"
        :disabled="isSubmitting"
        @click="handleEditUser"
      >
        Cập nhật người dùng
      </button>
    </div>
  </div>
</template>

<style scoped></style>
