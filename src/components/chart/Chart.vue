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
  dataValues: Array<any>
  chartType?: ChartType
}>()
const canvasRef = ref<HTMLCanvasElement | null>(null)

let chartInstance: Chart | null = null
const footer = (tooltipItems: any) => {
  let sum = 0

  tooltipItems.forEach(function (tooltipItem: any) {
    sum += tooltipItem.parsed.y
  })
  return 'Tổng : ' + sum
}
onMounted(() => {
  const ctx = canvasRef.value?.getContext('2d')
  if (ctx) {
    chartInstance = new Chart(ctx, {
      type: chartType,
      data: {
        labels: labels,
        datasets: [
          {
            label,
            data: dataValues,
            backgroundColor: ['#3498db', '#1abc9c', '#9b59b6', '#ffb0c1'],
            // borderColor: 'rgb(75, 192, 192)',
            borderSkipped: false,
            borderWidth: 2,

            pointStyle: 'circle',
            pointRadius: 6,
            pointHoverRadius: 15,
            borderRadius: 24,
          },
        ],
      },
      options: {
        responsive: true,
        layout: { padding: 16 },

        plugins: {
          tooltip: {
            callbacks: {
              footer: footer,
            },
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
