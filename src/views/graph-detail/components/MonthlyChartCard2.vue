<template>
  <vx-card>
    <div class="flex">
      <span class="font-bold" style="font-size: 14px;"><i class="dot"></i>{{ title }}</span>
      <vs-select class="ml-auto" style="width:80px;" v-model="selectYear" autocomplete @change="onChangeYear" >
        <vs-select-item
          v-for="n in (_nowYear-2020) + 1"
          :key="`graph2_year_${n}`"
          :value="_nowYear - (n-1)"
          :text="`${_nowYear - (n-1)}년`" />
      </vs-select>
      <vs-select class="ml-2" style="width:80px;" v-model="selectMonth" autocomplete @change="onChangeMonth" >
        <vs-select-item
          v-for="n in 12"
          :key="`graph2_month_${n}`"
          :value="n"
          :text="`${n}월`" />
      </vs-select>
    </div>
    <div class="mt-2">
      <slot name="tools"></slot>
    </div>
    <div class="flex">
      <div class="flex" style="align-items: center;">
        <feather-icon class="mr-2" icon="CircleIcon" style="width:14px; color:#6670CB"/>
        <span class="mr-2">금년 총계</span>
        <span style="font-size:24px; font-weight:500;">{{ sum(data1) | comma }}</span>
      </div>
      <div class="flex ml-8" style="align-items: center;">
        <feather-icon class="mr-2" icon="CircleIcon" style="width:14px; color:#BCBCBC"/>
        <span class="mr-2">전년 총계</span>
        <span style="font-size:24px; font-weight:500;">{{ sum(data2) | comma }}</span>
      </div>
    </div>

    <comparison-bar-graph
      :data1="data1"
      :data2="data2"
      :max="graphMax"
      :labels="labels"
      unit=""/>
  </vx-card>
</template>

<script>
import ComparisonBarGraph from '@/components/ComparisonBarGraph'
export default {
  name: 'MonthlyChartCard2',
  components: {ComparisonBarGraph},
  props: {
    title: String,
    year: Number,
    month: Number,
    labels: {
      type: Array,
      default: () => []
    },
    data1: {
      type: Array,
      default: () => []
    },
    data2: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      selectYear: this.year,
      selectMonth: this.month,
    }
  },
  computed: {
    projectId () {
      return this.$route.params.proj_id
    },

    _nowYear () {
      return new Date().getFullYear()
    },

    graphMax () {
      let max = 5
      for (const value of this.data1) {
        max = Math.max(value, max)
      }
      for (const value of this.data2) {
        max = Math.max(value, max)
      }

      return (Math.floor((max - 1) / 5) + 1) * 5
    }
  },
  methods: {
    onChangeYear (year) {
      this.$emit('change', year, this.month)
    },
    onChangeMonth (month) {
      this.$emit('change', this.year, month)
    },
    onClickSearchDataType (dataType) {
      this.$emit('changeDataType', dataType)
    },
    sum (values) {
      let sum = 0
      if (values && values.length > 0) {
        values.map(value => {
          sum += value
        })
      }
      return sum
    },
  }
}
</script>

<style scoped>

</style>
