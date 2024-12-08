<script setup lang="ts">
import Chart from 'chart.js/auto'
import { onMounted, ref } from 'vue'
import { type ChartType } from 'chart.js/auto'
const canvasRef = ref<HTMLCanvasElement | null>(null)
const {
  labels,
  dataValues,
  chartType = 'pie',
  label = 'Doanh thu',
} = defineProps<{
  chartType?: ChartType
  label?: string
  labels: Array<string>
  dataValues: Array<any>
}>()
onMounted(() => {
  const ctx = canvasRef.value?.getContext('2d')
  if (ctx) {
    new Chart(ctx, {
      type: chartType,
      data: {
        labels: labels.map((item) => item),
        datasets: [
          {
            label: label,
            data: dataValues.map((value) => value),
            backgroundColor: [
              'rgb(255, 99, 132)',
              'rgb(54, 162, 235)',
              'rgb(255, 205, 86)',
              '#00FF9C',
              '#CB9DF0',
            ],
            hoverOffset: 4,
          },
        ],
      },
      options: {
        responsive: true,
        aspectRatio: 1,
      },
    })
  }
})
</script>

<template>
  <div class="flex-center">
    <canvas ref="canvasRef"></canvas>
  </div>
</template>

<style scoped>
canvas {
  height: 400px !important;
}
.flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
