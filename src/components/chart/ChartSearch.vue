<script setup lang="ts">
import Chart from 'chart.js/auto'
import { type ChartType } from 'chart.js/auto'
import { onMounted, onUnmounted, ref, watch } from 'vue'
import months from '@/utils/monthsData'
import getGradient from './lib/animation'
type TLabelType = 'Tháng' | 'Ngày' | 'Năm' | ''
type TChartSearchType = 'REVENUE_BAR' | 'QUANTITY_SOLD_LINE'

const {
  dataValues,
  chartType = 'bar',
  selectedChartType,
} = defineProps<{
  selectedChartType: TChartSearchType
  dataValues: Array<any>
  chartType?: ChartType
}>()
const canvasRef = ref<HTMLCanvasElement | null>(null)

let chartInstance: Chart | null = null
console.log('props :::', selectedChartType)
onMounted(() => {
  const ctx = canvasRef.value?.getContext('2d')
  if (ctx) {
    chartInstance = new Chart(ctx, {
      type: selectedChartType === 'REVENUE_BAR' ? 'bar' : 'line',
      data: {
        labels: [
          'Tháng 1',
          'Tháng 2',
          'Tháng 3',
          'Tháng 4',
          'Tháng 5',
          'Tháng 6',
          'Tháng 7',
          'Tháng 8 ',
          'Tháng 9',
          'Tháng 10',
          'Tháng 11',
          'Tháng 12',
        ],
        datasets: dataValues.map((data, index) => ({
          label:
            selectedChartType === 'REVENUE_BAR'
              ? 'Doanh thu ' + dataValues[index].year
              : 'Số lượng bán ' + data.year,
          data: data.monthlyRevenue.map((item: any) =>
            selectedChartType === 'REVENUE_BAR' ? item.totalRevenue : item.total_quantity_sold,
          ),
          backgroundColor: [
            '#BFECFF',
            '#CDC1FF',
            '#FFF6E3',
            '#FFCCEA',
            '#FF76CE',
            '#FDFFC2',
            '#FFC0CB',
            '#94FFD8',
            '#A3D8FF',
            '#FFFFFF',
            '#FF00FF',
            '#00FFFF',
          ][index % 12],
          borderColor: function (context: any) {
            const chart = context.chart
            const { ctx, chartArea } = chart

            if (!chartArea) {
              // This case happens on initial chart load
              return
            }
            return getGradient(ctx, chartArea)
          },
        })),
      },
      options: {
        // indexAxis: 'y',

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
        plugins: {
          tooltip: {},
          title: {
            display: true,
            text: 'Doanh thu của sản phẩm theo các năm',
          },
        },
      },
    })
  }
})

watch(
  () => selectedChartType,
  (newSelectedChartType) => {
    if (chartInstance) {
      console.log('newSelectedChartType :::', newSelectedChartType)
      chartInstance.data.datasets.forEach((dataset, index) => {
        dataset.label =
          newSelectedChartType === 'REVENUE_BAR'
            ? 'Doanh thu ' + dataValues[index].year
            : 'Số lượng bán ' + dataValues[index].year
        dataset.data = dataValues[index].monthlyRevenue.map((item: any) =>
          newSelectedChartType === 'REVENUE_BAR' ? item.totalRevenue : item.total_quantity_sold,
        )
        dataset.type = newSelectedChartType === 'REVENUE_BAR' ? 'bar' : 'line'
      })
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
