<template>
  <vx-card>
    <div class="flex justify-between mb-5 md:mb-0">
      <span class="font-bold" style="font-size: 14px"><i class="dot"></i>{{ title }}</span>
      <vs-select style="width: 80px" v-model="selectYear" autocomplete @change="onChangeYear">
        <vs-select-item v-for="n in _nowYear - 2020 + 1" :key="`graph1_year_${n}`" :value="_nowYear - (n - 1)" :text="`${_nowYear - (n - 1)}년`" />
      </vs-select>
    </div>
    <div class="flex" v-if="showSum">
      <div class="flex" style="align-items: center">
        <feather-icon class="mr-2" icon="CircleIcon" style="width: 14px; color: #6670cb" />
        <span class="mr-2">{{ title1 }}</span>
        <span v-if="sum1" style="font-size: 24px; font-weight: 500">{{ sum1 }}</span>
        <span v-else style="font-size: 24px; font-weight: 500">{{ sum(data1) | comma }}</span>
      </div>
      <div class="flex ml-8" style="align-items: center">
        <feather-icon class="mr-2" icon="CircleIcon" style="width: 14px; color: #bcbcbc" />
        <span class="mr-2">{{ title2 }}</span>
        <span v-if="sum2" style="font-size: 24px; font-weight: 500">{{ sum2 }}</span>
        <span v-else style="font-size: 24px; font-weight: 500">{{ sum(data2) | comma }}</span>
      </div>
    </div>

    <comparison-bar-graph :data1="data1" :data2="data2" :max="maxY !== 0 ? maxY : graphMax" :labels="['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월']" :unit="unit" />
  </vx-card>
</template>

<script>
import ComparisonBarGraph from "@/components/ComparisonBarGraph";
export default {
  name: "MonthlyChartCard",
  components: { ComparisonBarGraph },
  props: {
    title: String,
    year: Number,
    data1: {
      type: Array,
      default: () => [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    },
    data2: {
      type: Array,
      default: () => [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    },
    showSum: {
      type: Boolean,
      default: true,
    },
    title1: {
      type: String,
      default: '금년 총계',
    },
    title2: {
      type: String,
      default: '전년 총계',
    },
    sum1: {
      type: String,
      default: "",
    },
    sum2: {
      type: String,
      default: "",
    },
    unit: {
      type: String,
      default: "",
    },
    maxY: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      selectYear: this.year,
    };
  },
  computed: {
    projectId() {
      return this.$route.params.proj_id;
    },

    _nowYear() {
      return new Date().getFullYear();
    },

    graphMax() {
      let max = 5;
      for (const value of this.data1) {
        max = Math.max(value, max);
      }
      for (const value of this.data2) {
        max = Math.max(value, max);
      }

      return (Math.floor((max - 1) / 5) + 1) * 5;
    },
  },
  methods: {
    onChangeYear(year) {
      this.$emit("change", year);
    },
    sum(values) {
      let sum = 0;
      if (values && values.length > 0) {
        values.map((value) => {
          sum += value;
        });
      }
      return sum;
    },
  },
};
</script>

<style scoped></style>
