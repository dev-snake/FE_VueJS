<script setup lang="ts">
import { ref, watch } from 'vue'
import GenYears from '@/utils/gen_years'
const props = defineProps<{
  isFiltering: boolean
  seletedYear: string | number
  seletedType: string
  seletedMonth: string | number
  handleFilter: () => void
}>()

const emit = defineEmits(['update:seletedYear', 'update:seletedType', 'update:seletedMonth'])

const localSelectedYear = ref(props.seletedYear)
const localSelectedType = ref(props.seletedType)
const localSelectedMonth = ref(props.seletedMonth)

watch(
  () => props.seletedYear,
  (newYear) => {
    localSelectedYear.value = newYear
  },
)
watch(
  () => props.seletedType,
  (newType) => {
    localSelectedType.value = newType
  },
)

const updateSelectedYear = (year: string | number) => emit('update:seletedYear', year)
const updateSelectedMonth = (month: string | number) => emit('update:seletedMonth', month)
const updateSelectedType = (type: string) => emit('update:seletedType', type)
</script>

<template>
  <div class="mt-4">
    <div class="flex-end">
      <select
        v-model="localSelectedYear"
        @change="updateSelectedYear(localSelectedYear)"
        class="form-select w-200 me-2"
        aria-label="Default select example"
      >
        <option value="" selected disabled>Chọn năm</option>
        <option v-for="(year, index) in GenYears()" :key="index" v-text="year"></option>
      </select>
      <select
        v-model="localSelectedMonth"
        @change="updateSelectedMonth(localSelectedMonth)"
        class="form-select w-200 me-2"
        aria-label="Default select example"
        v-if="
          localSelectedType === 'REVENUE_BY_MONTH' || localSelectedType === 'QUANTITY_SOLD_BY_MONTH'
        "
      >
        <option value="" selected>Chọn tháng</option>
        <option
          :value="month"
          v-for="(month, index) in Array.from({ length: 12 }, (_, i) => i + 1)"
          :key="index"
          v-text="`Tháng ${month}`"
        ></option>
      </select>
      <select
        v-model="localSelectedType"
        @change="updateSelectedType(localSelectedType)"
        class="form-select w-200 me-2"
        aria-label="Default select example"
      >
        <option value="" selected disabled>Chọn Kiểu muốn lọc</option>
        <option value="QUANTITY_SOLD_BY_YEAR">Số lượng bán</option>
        <option value="REVENUE_BY_YEAR">Doanh thu</option>
        <option value="REVENUE_BY_MONTH">Doanh thu theo tháng</option>
        <option value="QUANTITY_SOLD_BY_MONTH">Số lượng bán theo tháng</option>
      </select>

      <button type="button" :disabled="isFiltering" class="btn btn-primary" @click="handleFilter">
        {{ isFiltering ? 'Đang lọc ...' : 'Lọc kết quả' }}
      </button>
    </div>
  </div>
</template>

<style scoped></style>
