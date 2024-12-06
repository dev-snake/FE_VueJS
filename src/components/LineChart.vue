<script setup lang="ts">
import Chart from 'chart.js/auto'
import months from '@/utils/monthsData'
import { onMounted, ref } from 'vue'

const data = {
  labels: months,
  datasets: [
    {
      label: 'My First Dataset',
      data: [65, 59, 80, 81, 56, 55, 40, 20, 90, 10, 90, 50],
      fill: false,
      borderColor: 'rgb(75, 192, 192)',
      tension: 0.1,
    },
    {
      label: 'oke',
      data: [69, 59, 8, 88, 6, 85, 40, 20, 10, 100, 0, 50],
      fill: false,
      borderColor: 'rgba(255, 32, 7, 1)',
      tension: 0.1,
    },
    {
      label: 'ahihi',
      data: [6, 89, 78, 38, 16, 5, 209, 2, 91, 10, 0, 510],
      fill: false,
      borderColor: 'rgba(155, 89, 182, 1)',
      tension: 0.1,
    },
  ],
}

onMounted(() => {
  const ctx = document.getElementById('chartCanvas') as HTMLCanvasElement
  new Chart(ctx, {
    type: 'line',
    data: data,
    options: {
      animations: {
        tension: {
          duration: 1000,
          easing: 'linear',
          from: 1,
          to: 0,
          loop: true,
        },
      },
      scales: {
        y: {
          min: 0,
          max: 600,
        },
      },
    },
  })
})
</script>

<template>
  <div>
    <canvas id="chartCanvas"></canvas>
  </div>
</template>

<style scoped></style>
