<template>
<vx-card class="donut-chart-card" style="overflow-x: auto; max-width: 100%;">
  <vs-row>
    <vs-col style="position: relative">
      <div class="w-full flex mt-6" style="justify-content: center; position: relative">
        <apexchart type="donut" :options="donutOptions.chartOptions" :series="donutOptions.series" ></apexchart>
        <div style="position: absolute; top:0; right:0; left:0; bottom:0; justify-content: center; align-items: center; display: flex; ">
          <div class="total">
            <div class="total-value">{{ `${total}` | comma }}</div>
            <div class="total-unit">{{ unit }}</div>
          </div>
        </div>
      </div>
      <ul>
        <li v-for="(data, index) in realValue" :key="`donut_${index}`">
          <donut-chart-label :label="dataGroup.labels[index]" :unit="unit" :value="dataGroup.values[index] | comma" :color="dataGroup.colors[index]" />
        </li>
      </ul>
      <div class="my-2" style="height:1px; background-color: #E6E9F4"></div>
      <donut-chart-label label="누적" :unit="unit" :value="`${total}` | comma" color="#535767" />

      <!-- header tools -->
      <div class="donut-chart-card-header">
        <span class="font-bold" style="font-size: 1em;"><i class="dot"></i>{{ title }}</span>
        <div style="justify-content: end">
          <a href="javascript:;" v-if="myLv !== 3 && isMoveDetail" style="font-size:0.85em; display:flex; align-items: center; justify-content: flex-end;" @click="onClickDetail">자세히 보기<feather-icon icon="ChevronRightIcon" style="width:1.42em;"/></a>
          <!-- <a v-if="isMoveWrite" href="javascript:;" style="font-size:0.85em; display:flex; align-items: center; justify-content: flex-end;" @click="onClickWrite">작성페이지 이동<feather-icon icon="ChevronRightIcon" style="width:1.42em;"/></a> -->
        </div>
      </div>
    </vs-col>
  </vs-row>

</vx-card>
</template>

<script>
import DonutChartLabel from '@/popup/DonutChartLabel'
export default {
  name: 'DonutChartCard',
  components: {DonutChartLabel},
  props: {
    title: String,
    unit: String,
    value: Array,
    isMoveDetail: {
      type:Boolean,
      default: true
    },
    isMoveWrite: Boolean
  },
  data () {
    return {
    }
  },

  computed: {
    myLv () {
      return this.$store.state.auth.userInfo.position
    },

    total () {
      let sum = 0
      try {
        const chartData = Array.isArray(this.value) ? this.value : []
        for (const data of chartData.filter((data) => !!data.label)) {
          const num = Number(`${data.value}`)
          if (!isNaN(num)) {
            sum += Number(`${data.value}`)
          }
        }
      } catch (err) {
      }
      return sum
    },

    realValue () {
      const maxLength = 5
      const chartData = Array.isArray(this.value) ? this.value : []

      if (chartData.length) {
        const value = JSON.parse(JSON.stringify(chartData.filter((data) => !!data.label)))
        value.sort((a, b) => b.value - a.value)
        if (value.length > maxLength) {
          return value.slice(0, maxLength)
        }
        return value
      } else {
        return [{label: '데이터 없음', value: 0}]
      }
    },

    dataGroup () {
      const labels = []
      const colors = ['#0058FF', '#F99600', '#FFC700', '#21D59B', '#F0142F']
      const values = []

      this.realValue.map(value => {
        if (value.label) labels.push(value.label)
        if (value.value || value.value === 0) {
          values.push(value.value)
        }
      })

      return { labels, colors, values }
    },

    donutOptions () {
      return {
        series: this.dataGroup.values,
        chartOptions: {
          plotOptions: {
            pie:{
              donut:{
                size: '85%'
              }
            }
          },
          chart: {
            redrawOnParentResize: false,
            redrawOnWindowResize: false,

            type: 'donut'
          },
          dataLabels: {
            enabled: false
          },
          responsive: [
            {
              breakpoint: 480,
              options: {
                chart: {
                  width: 200
                },
                legend: {
                  show: false
                }
              }
            }
          ],
          colors: this.dataGroup.colors,
          labels: this.dataGroup.labels,
          legend: { show: false }
        }
      }
    }

  },

  methods: {
    onClickDetail () {
      this.$emit('detail')
    },
    onClickWrite () {
      this.$emit('write')
    }
  }
}
</script>

<style lang="scss" scoped>
.donut-chart-card {
  position: relative;

  .total {
    display: grid;
    justify-content: center;
    align-items: center;
    text-align: center;

    .total-value {
      font-size: 1.71em;
      font-weight: bold;
      color:#000
    }

    .total-unit {
      font-size: 1em;
      font-weight: bold;
      color:#757575
    }
  }
}
.donut-chart-card-header {
  display: flex;
  justify-content: space-between;
  align-items: start;

  position: absolute;
  top:0;
  left:0;
  right:0;

}
</style>
