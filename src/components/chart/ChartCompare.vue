<script setup lang="ts">
import Chart from 'chart.js/auto'
import { type ChartType } from 'chart.js/auto'
import { onMounted, onUnmounted, ref, watch } from 'vue'
import months from '@/utils/monthsData'
const {
  dataValues,
  label = 'Doanh thu',
  chartType = 'bar',
  labels = months,
} = defineProps<{
  label: string
  labels?: Array<string>
  dataValues: any
  chartType?: ChartType
}>()
const canvasRef = ref<HTMLCanvasElement | null>(null)

let chartInstance: Chart | null = null
const x = [
  ...Array.from({ length: dataValues.bestSellingProduct.length }).fill(0),
  ...dataValues.nonSellingProduct.map((item: any) => item.totalQuantitySold),
]
console.log(x)
onMounted(() => {
  const ctx = canvasRef.value?.getContext('2d')
  if (ctx) {
    chartInstance = new Chart(ctx, {
      type: chartType,
      data: {
        labels: [
          ...dataValues.bestSellingProduct.map((item: any) => item.productName),
          ...dataValues.nonSellingProduct.map((item: any) => item.productName),
        ],
        datasets: [
          {
            // label,
            label: 'Số lượng bán chạy ',
            data: dataValues.bestSellingProduct.map((item: any) => item.totalQuantitySold),
            backgroundColor: ['#3498db', '#1abc9c', '#9b59b6', '#ffb0c1'],
            borderColor: 'rgb(75, 192, 192)',
          },
          {
            label: 'Số lượng bán chậm ',
            data: [
              ...Array.from({ length: dataValues.bestSellingProduct.length }).fill(0),
              ...dataValues.nonSellingProduct.map((item: any) => item.totalQuantitySold),
            ],
            backgroundColor: ['#3498db', '#1abc9c', '#9b59b6', '#ffb0c1'],
            borderColor: 'rgb(75, 192, 192)',
            borderSkipped: false,

            borderRadius: 24,
          },
        ],
      },
      options: {
        responsive: true,
        layout: { padding: 16 },
        animations: {
          tension: {
            duration: 1000,
            easing: 'linear',
            from: 1,
            to: 0,
            loop: true,
          },
        },
      },
    })
  }
})

watch(
  () => [dataValues, labels],
  ([newData, newLabels]) => {
    if (chartInstance) {
      chartInstance.data.datasets[0].data = newData
      chartInstance.data.labels = newLabels
      chartInstance.data.datasets[0].label = label
      chartInstance.update()
    }
  },
)

onUnmounted(() => {
  if (chartInstance) {
    chartInstance.destroy()
  }
})
</script>
<template>
  <canvas ref="canvasRef"></canvas>
</template>

<style scoped>
canvas {
  width: 100% !important;
}
</style>
