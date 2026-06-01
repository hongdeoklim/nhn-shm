<template>
<vx-card class="donut-chart-card" style="overflow-x: auto; max-width: 100%;">
  <vs-row>
    <vs-col style="position: relative">
      <div class="flex flex-col justify-between">
        <div class="w-full flex mt-6 flex-col" style="">
          <div v-for="index in 5" class="flex flex-col" style="margin-top: 20px; margin-bottom: 10px;" :key="index">
            <div class="flex w-full justify-between" style="">
              <div>{{ realValue[index - 1] ? realValue[index - 1].label : '' }}</div>
              <div>{{ realValue[index - 1] ? Math.floor(realValue[index - 1].value*100)/100 : '' }} {{ realValue[index - 1] ? unit : '&nbsp;' }}</div>
            </div>
            <div class="relative w-full" style="background-color:#F2F2F2; height: 7px; margin-top: 7px;" :style="{visibility: realValue[index - 1] ? 'visible': 'hidden'}">
              <div class="absolute h-full" :style="{backgroundColor: dataGroup.colors[index - 1], width: `${realValue[index - 1] ? (realValue[index - 1].value > 100 ? 100: realValue[index - 1].value) : '0'}%`}"></div>
            </div>
          </div>
        </div>

        <div class="my-2" style="height:1px; background-color: #E6E9F4"></div>
        <donut-chart-label v-if="realValue.length === 0" :label="'데이터 없음'" :value="``" color="#535767" />
        <donut-chart-label v-else :label="totalLabel" :unit="unit" :value="`${total}` | comma" color="#535767" />
      </div>
      <!-- header tools -->
      <div class="donut-chart-card-header">
        <span class="font-bold" style="font-size: 1em;"><i class="dot"></i>{{ title }}</span>
        <div style="justify-content: end">
          <!--  TODO: 임시로 숨겨둠 -->
          <a href="javascript:;" v-if="isMoveDetail" style="font-size:0.85em; display:flex; align-items: center; justify-content: flex-end;" @click="onClickDetail">자세히 보기<feather-icon icon="ChevronRightIcon" style="width:1.42em;"/></a>
<!--          <a v-if="isMoveWrite" href="javascript:;" style="font-size:0.85em; display:flex; align-items: center; justify-content: flex-end;" @click="onClickWrite">작성페이지 이동<feather-icon icon="ChevronRightIcon" style="width:1.42em;"/></a>-->
        </div>
      </div>
    </vs-col>
  </vs-row>

</vx-card>
</template>

<script>
import DonutChartLabel from '@/popup/DonutChartLabel'
export default {
  name: 'HBarChartCard',
  components: {DonutChartLabel},
  props: {
    title: String,
    unit: String,
    value: Array,
    isMoveDetail: {
      type:Boolean,
      default: true
    },
    isMoveWrite: Boolean,
    totalLabel: {
      type: String,
      default: '전체 집행률'
    },
    total: {
      type: String,
      default: '0',
    }
  },
  data () {
    return {
    }
  },
  computed: {
    projectId () {
      return this.$route.params.proj_id
    },
    myLv () {
      return this.$store.state.auth.userInfo.position
    },

    realValue () {
      const maxLength = 5

      if (this.value.length) {
        const value = JSON.parse(JSON.stringify(this.value))
        if (value.length > maxLength) {
          return value.slice(0, maxLength)
        }
        return value
      } else {
        return []
      }
    },

    dataGroup () {
      const labels = []
      const colors = ['#0058FF', '#21D59B', '#FFC700', '#F99600', '#F0142F']
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
        series: [
          {
            data: this.dataGroup.values
          }
        ],
        chartOptions: {
          plotOptions: {
            bar:{
              horizontal: true,
              dataLabels: {
                position: 'bottom',
              }
            }
          },
          chart: {
            redrawOnParentResize: false,
            redrawOnWindowResize: false,

            type: 'bar'
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
          xaxis: {
            categories: this.dataGroup.labels
          },
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
    },
    onClickItem (data) {
      this.$emit('item', data)
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
