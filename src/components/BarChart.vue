<script setup lang="ts">
import Chart from 'chart.js/auto'
import { type ChartType } from 'chart.js/auto'
import { onMounted, onUnmounted, ref, watch } from 'vue'
import months from '@/utils/monthsData'
import type { IRevenueByMonth } from '@/types/revenue_by_month'
const {
  dataValues,
  label = 'Doanh thu',
  chartType = 'bar',
} = defineProps<{
  label: string
  dataValues: Array<any>
  chartType?: ChartType
}>()
const canvasRef = ref<HTMLCanvasElement | null>(null)

onMounted(() => {
  const ctx = canvasRef.value?.getContext('2d')
  console.log('dataValues ', dataValues)
  if (ctx) {
    new Chart(ctx, {
      type: chartType,
      data: {
        labels: months,
        datasets: [
          {
            label,
            data: dataValues.map((value) => value),
            backgroundColor: ['#3498db', '#1abc9c', '#9b59b6', '#e74c3c'],
            borderColor: 'rgb(75, 192, 192)',
          },
        ],
      },
      options: {
        animations: {
          tension: {
            duration: 2000,
            easing: 'linear',
            from: 1,
            to: 0,
            loop: true,
          },
        },
        responsive: true,
        // maintainAspectRatio: true,
        layout: {
          padding: 16,
        },

        //       font: {
        //         size: 10,
        //       },
        //     },
        //   },
        // },
      },
    })
  }
})
</script>
<template>
  <canvas ref="canvasRef"></canvas>
</template>

<style scoped></style>
