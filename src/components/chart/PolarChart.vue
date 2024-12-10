<script setup lang="ts">
import type { IProductSoldInfo } from '@/types/get_quantity_sold'
import Chart from 'chart.js/auto'
import { onMounted, ref } from 'vue'
const { dataValues, labels } = defineProps<{
  labels: string[]
  dataValues: number[]
}>()
const canvasRef = ref<HTMLCanvasElement | null>(null)
onMounted(() => {
  const ctx = canvasRef.value?.getContext('2d')
  if (!ctx) {
    console.error('Canvas element not found!')
    return
  }
  new Chart(ctx, {
    type: 'polarArea',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Số lượng bán',
          data: dataValues.map((value) => value),
          backgroundColor: [
            'rgb(255, 99, 132)',
            'rgb(75, 192, 192)',
            'rgb(255, 205, 86)',
            'rgb(201, 203, 207)',
            'rgb(54, 162, 235)',
          ],
        },
      ],
    },
    options: {
      responsive: true,
      aspectRatio: 1,
    },
  })
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
</style>
