<template>
  <div>
    <div id="chart">
      <apexchart type="bar" :height="height" :options="chart.chartOptions" :series="chart.series"></apexchart>
    </div>
  </div>
</template>

<script>
import VueApexCharts from 'vue-apexcharts'
export default {
  name: 'BasicBarGraph',
  props:{
    value: Array,
    useSubValue:Boolean,
    unit:String,
    max:[String, Number],
    isPartner: Boolean,
    height: {
      type: Number,
      default: () => {
        return 480
      }
    },
  },
  computed: {
    dataList () {
      const dataList = []
      if (this.value.length > 0) {
        this.value.map(value => {
          dataList.push(value.value) //[1,2,3,4,5]
        })
      }

      return dataList
    },
    categories () {
      const categories = []
      if (this.value.length > 0) {
        this.value.map(value => {
          categories.push(value.label)
        })
      }
      return categories
    },
    chart () {
      const _max = this.max ? Math.max(Number(this.max), 5) : 5
      const unit = this.unit
      const values = this.value
      const isPartner = this.isPartner
      return {
        series: [{name:'', data: this.dataList }],
        chartOptions: {
          colors: ['#26D6EB'],
          label: ['a'],
          chart: {
            type: 'bar',
            height: this.height
          },
          plotOptions: {
            bar: {
              borderRadius: 0,
              barHeight:'20%',
              horizontal: true,
              distributed: false,
            }
          },
          dataLabels: {
            enabled: false
          },
          xaxis: {
            categories: this.categories,
            max: _max,
            tickAmount: 5,
            labels: {
              formatter: function (value) {
                let str = `${value}`
                if (str && str.length > 0) {
                  return str.replace(/,/gi, '').replace(/\B(?=(\d{3})+(?!\d))/gi, ',') + unit
                }
              }
            },
          },
          yaxis:{
            axisBorder: {
              show: true,
              color: '#78909C',
              offsetX: 0,
              offsetY: 0
            },
          },
          tooltip: {
            custom: function({series, seriesIndex, dataPointIndex, w}) {
              const data = w.globals.initialSeries[seriesIndex].data[dataPointIndex];
              const _values = values
              const value = `${series[seriesIndex][dataPointIndex]}`.replace(/,/gi, '').replace(/\B(?=(\d{3})+(?!\d))/gi, ',') + unit
              let sum = _values[dataPointIndex].sum
              sum = `${sum}`.replace(/,/gi, '').replace(/\B(?=(\d{3})+(?!\d))/gi, ',') + '원'

              if (isPartner) {
                return (`
                <div class="arrow_box">
                    <span class="title">${w.globals.labels[dataPointIndex]}</span>
                    <div class="body">
                        <div class="item">건수 : <span class="bold">${value}</span></div>
                        <div class="item">총 계약 금액 : <span class="bold">${sum}</span></div>
                    </div>
                </div>
                `);
              } else {
                return (`
                <div class="arrow_box">
                    <span class="title">${w.globals.labels[dataPointIndex]}</span>
                    <div class="body">
                        <div class="item"><span class="bold">${value}</span></div>
                    </div>
                </div>
                `);
              }

            }
          },
        },
      }
    }
  }
}
</script>

<style lang="scss">
div.arrow_box {
  display: grid;
  .title {
    padding:0.5rem 1rem;
    background-color: #EDEDED
  }
  div.body {
    padding:0.5rem 1rem !important;
    .bold {
      font-weight: bold;
    }
  }
}
</style>
