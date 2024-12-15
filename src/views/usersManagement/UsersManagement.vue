<script setup lang="ts">
import apiRoutes from '@/config/api_routes.config'
import axiosConfig from '@/config/axios.config'
import type { IAPI_Response } from '@/types/apiResponse'
import type { IUser } from '@/types/user'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import Loading from '@/components/common/Loading.vue'
const usersList = ref<any[]>([])
const router = useRouter()
const isLoading = ref<boolean>(true)
const handleDeleteUser = async (userId: string) => {
  const isConfirm = confirm('Bạn có chắc chắn muốn xóa người dùng này không?')
  if (!isConfirm) return
  try {
    const response = await axiosConfig.delete<IAPI_Response<IUser>>(apiRoutes.user.delete(userId))
    if (response.data.status === 'success') {
      const newUsersList = usersList.value.filter((user) => user.id !== userId)
      usersList.value = newUsersList
    }
  } catch (error) {
    console.log(error)
  }
}
onMounted(() => {
  isLoading.value = true
  const fechData = async () => {
    try {
      const response = await axiosConfig.get<IAPI_Response<IUser[]>>(apiRoutes.user.getAll)
      console.log(response.data.results)
      usersList.value = response.data.results
    } catch (error) {
      console.log(error)
    } finally {
      isLoading.value = false
    }
  }
  fechData()
})
</script>
<template>
  <div>
    <div>
      <h1 class="text-uppercase py-4 animate__animated animate__lightSpeedInRight">
        Danh sách tất cả người dùng
      </h1>
    </div>
    <div class="flex justify-content-end">
      <button
        class="btn bg-primary text-white p-2 rounded-2"
        @click="router.push({ path: '/users/create' })"
      >
        Tạo người dùng
      </button>
    </div>
    <Loading v-show="isLoading" />
    <table class="table py-4 table-hover table-bordered text-center mt-4" v-show="!isLoading">
      <thead class="table-light">
        <tr>
          <th scope="col">#</th>
          <th scope="col">Tên người dùng</th>
          <th scope="col" class="t-hidden">Username</th>
          <th scope="col" class="t-hidden">Email</th>
          <th scope="col">Số điện thoại</th>
          <th scope="col">Hành động</th>
        </tr>
      </thead>
      <TransitionGroup name="list" tag="tbody">
        <tr v-show="usersList.length === 0">
          <td colspan="6" class="text-center fst-italic py-2">
            <span>Không tìm thấy người dùng nào phù hợp</span>
          </td>
        </tr>
        <tr
          v-for="(user, index) in usersList"
          :key="index"
          :style="`transition-delay: ${index * 300}ms;`"
        >
          <td v-text="index + 1"></td>
          <td v-text="user.fullname"></td>
          <td v-text="user.username" class="t-hidden"></td>
          <td v-text="user.email" class="t-hidden"></td>
          <td v-text="user.phoneNumber"></td>
          <td>
            <button
              class="btn btn-warning text-white me-2"
              @click="router.push({ path: `/users/${user.id}/edit` })"
            >
              Sửa
            </button>
            <button class="btn btn-danger text-white" @click="handleDeleteUser(user.id)">
              Xóa
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
