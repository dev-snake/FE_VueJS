<script setup lang="ts">
import Chart from 'chart.js/auto'
import { onMounted, watch } from 'vue'
import months from '@/utils/monthsData'
import type { IRevenueByMonth } from '@/types/revenue_by_month'
import type { IQuantitySoldCurrentYear } from '@/types/quantity_sold_current_year'
const { quantitySoldCurrentYear } = defineProps<{
  quantitySoldCurrentYear: IQuantitySoldCurrentYear[]
}>()
let chartInstance: Chart | null = null

onMounted(() => {
  const ctx = document.getElementById('barChartCanvasSold') as HTMLCanvasElement

  watch(
    () => quantitySoldCurrentYear,
    (newValue) => {
      if (newValue.length > 0) {
        if (chartInstance) {
          chartInstance.destroy()
        }

        chartInstance = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: months,
            datasets: [
              {
                label: 'Số lượng đã bán',
                data: quantitySoldCurrentYear.map((item) => item.total_quantity_sold),
                backgroundColor: ['#3498db', '#1abc9c', '#9b59b6', '#e74c3c'],
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            layout: {
              padding: 16,
            },
          },
        })
      }
    },
    { immediate: true },
  )
})
</script>
<template>
  <canvas id="barChartCanvasSold"></canvas>
</template>

<style scoped>
canvas {
  height: 360px !important;
}
</style>
