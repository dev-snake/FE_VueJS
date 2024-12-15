<script setup lang="ts">
import Chart from 'chart.js/auto'
import { type ChartType } from 'chart.js/auto'
import { onMounted, onUnmounted, ref, watch } from 'vue'
import months from '@/utils/monthsData'
import getGradient from './lib/animation'
type TLabelType = 'Tháng' | 'Ngày' | 'Năm' | ''
const {
  dataValues,
  label = 'Doanh thu',
  chartType = 'bar',
  labels = months,
  labelType = '',
} = defineProps<{
  label: string
  labelType?: TLabelType
  labels?: Array<string>
  dataValues: Array<any>
  chartType?: ChartType
}>()
const canvasRef = ref<HTMLCanvasElement | null>(null)

let chartInstance: Chart | null = null

onMounted(() => {
  const ctx = canvasRef.value?.getContext('2d')
  if (ctx) {
    chartInstance = new Chart(ctx, {
      type: chartType,
      data: {
        labels: labels.map((item) => labelType + ' ' + item),
        datasets: [
          {
            label,
            data: dataValues,
            backgroundColor: '#ffb0c1',
            borderColor: function (context: any) {
              const chart = context.chart
              const { ctx, chartArea } = chart

              if (!chartArea) {
                // This case happens on initial chart load
                return
              }
              return getGradient(ctx, chartArea)
            },
          },
        ],
      },
      options: {
        animations: {
          radius: {
            duration: 400,
            easing: 'linear',
            loop: (context) => context.active,
          },
        },
        elements: {
          point: {
            hoverRadius: 12,
          },
        },
        hoverBackgroundColor: '#FCCD2A',
        interaction: {
          mode: 'index',
          intersect: false,
          axis: 'x',
        },
        plugins: {
          tooltip: {
            // enabled: false,
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
      chartInstance.data.labels = newLabels.map((item) => labelType + ' ' + item)
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
