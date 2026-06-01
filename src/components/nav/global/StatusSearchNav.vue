<template>
<vx-card class="mb-4 ">
  <div class="flex justify-between" style="align-items:center">
    <div class="flex justify-center">
      <div class="pr-3 self-center">대상기간</div>
      <date-selector class="popup-fixed" v-model="sdate"></date-selector>
      <div class="ml-5"></div>
      <div class="px-3 self-center">현장명</div>
      <ml-input class="mr-2" v-model="keyword"/>
      <vs-button class="flex" type="border">상세검색</vs-button>
    </div>
    <vs-button class="self-stretch" @click="handleSearch">검색</vs-button>
  </div>
</vx-card>
</template>

<script>
import DateSelector from '@/components/selector/DateSelector'

export default {
  name: 'ProjectSearchNav',
  components: {
    DateSelector
  },
  props: {
    // 제목
    searchKeyword: String
  },
  data () {
    return {
      keyword:'',
      sdate:'',
      edate:''
    }
  },
  created () {
    this.keyword = this.searchKeyword
  },
  methods: {
    // 검색어 입력시출
    handleSearch () {
      this.sdate = new Date(this.sdate).format('yyyy-MM-dd')
      this.edate = new Date(this.edate).format('yyyy-MM-dd')
      this.$emit('handleSearch', this.sdate, this.edate, this.keyword)
    }
  }
}
</script>

<style scoped>

</style>
