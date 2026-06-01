<template>
  <div id="chart">
    <apexchart type="bar" :height="height" :options="chart.chartOptions" :series="chart.series"></apexchart>
  </div>
</template>

<script>
import VueApexCharts from 'vue-apexcharts'
export default {
  name: 'ComparisonBarGraph',
  props:{
    data1: Array,
    data2: Array,
    unit: String,
    height: {
      type: Number,
      default: () => {
        return 350;
      }
    },
    labels: {
      type: Array,
      default: () => {
        return []
      }
    },
    max: Number
  },
  computed: {
    chart () {
      const unit = this.unit
      const max = Math.max(this.max, 5)
      return {
        series: [{
          name: '금년 실적',
          data: this.data1
        }, {
          name: '전년 실적',
          data: this.data2
        }],
        chartOptions: {
          chart: {
            type: 'bar',
            height: 280,
          },
          plotOptions: {
            bar: {
              horizontal: false,
              columnWidth: '45%',
            },
          },
          dataLabels: {
            enabled: false
          },
          stroke: {
            show: true,
            width: 4,
          },
          fill: {
            opacity: 1
          },
          yaxis: {
            tickAmount: 5,
            max,
            labels: {
              formatter: function (value) {
                let str = `${value}`
                if (str && str.length > 0) {
                  return str.replace(/,/gi, '').replace(/\B(?=(\d{3})+(?!\d))/gi, ',') + unit
                }
              }
            },
          },
          tooltip: {
            y: {
              formatter: function (val) {
                return `${val}`.replace(/,/gi, '').replace(/\B(?=(\d{3})+(?!\d))/gi, ',') + unit
              }
            }
          },
          colors: ['#826AF9', '#CDCDCD'],
          labels: this.labels,
        },
      }
    }
  }
}
</script>

<style scoped>

</style>
