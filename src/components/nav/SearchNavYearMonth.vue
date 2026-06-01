<template>
  <fragment class="search-nav-year-month">
    <span class="year-month-title">{{label}}</span>
    <div v-if="type === 'year-month' || type === 'year'"
      class="flex items-center gap-2" style="width: 160px;">
      <search-nav-item-select class="w-full mt-0 row-gap-0" v-model="year" :list="yearList" @change="onChangeData"/>{{yearAfter}}</div>
    <div v-if="type === 'year-month' || type === 'month'"
         class="flex items-center gap-2" style="width: 100px;">
      <search-nav-item-select v-if="monthType !== 'each'" class="w-full mt-0 row-gap-0" style="width:100% !important;" v-model="half" :list="monthList" @change="onChangeData"/>
      <search-nav-item-select v-else class="w-full mt-0 row-gap-0" style="width:100% !important;" v-model="month" :list="monthList" @change="onChangeData"/>
          <span v-if="monthType === 'each'">{{monthAfter}}</span>
    </div>
  </fragment>
</template>

<script>
import SearchNavItemSelect from '@/components/nav/SearchNavItemSelect.vue'
export default {
  name: 'SearchNavYearMonth',
  components: {SearchNavItemSelect},
  props:{
    label: {
      default: '대상기간',
      type: String
    },
    value: Object,
    type: {
      default: 'year-month', // year-month, year, month
      type: String
    },
    useAllYear: {
      default: true,
      type: Boolean
    },
    useAllMonth: {
      default: true,
      type: Boolean
    },
    monthType: {
      default: 'each', // each (1월~12월), half (상반기, 하반기)
      type: String
    },
    yearAfter: {
      type: String,
      default: "년",
    },
    monthAfter: {
      type: String,
      default: "월",
    },
  },
  computed: {
    yearList () {
      let nowYear = new Date().getFullYear()
      const yearList = []
      if (this.useAllYear) {
        yearList.push({text:'전체',  value:''})
      }
      for (let i = 0; i < 50; i++) {
        yearList.push({text:`${nowYear}`,  value:nowYear})
        nowYear--
      }
      return yearList
    },
    monthList () {
      const monthList = []
      if (this.useAllMonth) {
        monthList.push({text:'전체', value:''})
      }
      if (this.monthType === 'half') {
        monthList.push({text:'상반기', value:'상반기'})
        monthList.push({text:'하반기', value:'하반기'})
        return monthList
      } else {
        for (let i = 0; i < 12; i++) {
          monthList.push({text:`${i+1}월`, value:i+1})
        }
      }
      return monthList
    },
    getYearMonthAt () {
      const query = this.$route.query;
      if (query.year || query.month || query.half) {
        try {
          return {
            year: query.year ? query.year : '',
            month: query.month ? query.month : '',
            half: query.half ? query.half : '',
          }
        } catch (e) {}
      }

      return {
        year: this.useAllYear ? '' : new Date().getFullYear(),
        month: this.useAllMonth ? '' : new Date().getMonth() + 1,
        half: this.useAllMonth ? '' : '상반기',
      }
    },
  },
  data () {
    return {
      year: "",
      month: "",
      half: "",
    }
  },
  created () {
    this.year = this.getYearMonthAt.year
    this.month = this.getYearMonthAt.month
    this.half = this.getYearMonthAt.half
  },
  methods: {
    onChangeData () {
      this.$emit('input', {year:this.year, month:this.month, half:this.half})
      this.$emit('change', {year:this.year, month:this.month, half:this.half})
    }
  }
}
</script>

<style lang="scss" scoped>
.search-nav-year-month {
  display: flex;

  .year-month-title { white-space: nowrap;}

  & > span {
    display: flex;
    align-items: center;
    justify-content: center;
  }

}
</style>
