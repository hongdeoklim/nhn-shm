<template>
  <div>
    <vs-tabs :value="tabIndex">
      <vs-tab label="사고보고" @click="moveTab('accident_report')">
        <accident-report-index/>
      </vs-tab>
      <vs-tab label="산업재해검토" @click="moveTab('accident_review')">
        <accident-review-index/>
      </vs-tab>
      <vs-tab label="산업재해발생 현황" @click="moveTab('accident_statistics')">
        <accident-statistics-index/>
      </vs-tab>
    </vs-tabs>
  </div>
</template>

<script>
import AccidentReportIndex from '@/views/list/accident/AccidentReportIndex'
import AccidentReviewIndex from '@/views/list/accident/AccidentReviewIndex'
import AccidentStatisticsIndex from '@/views/list/accident/AccidentStatisticsIndex'
export default {
  name: 'Index',
  components: {
    AccidentStatisticsIndex,
    AccidentReviewIndex,
    AccidentReportIndex},
  data () {
    return {
    }
  },
  created () {
    const breadcrumb = [
      {title: 'Home'},
      {title: '산업재해발생'},
      {
        title: '안전사고',
        active: true
      }
    ]

    this.$store.commit('menu/UPDATE_PAGE_LIST', breadcrumb)
  },
  computed: {
    boardSlug () {
      return this.$route.params.boardSlug
    },
    tabIndex () {
      if (this.boardSlug === 'accident_report') return 0
      if (this.boardSlug === 'accident_review') return 1
      if (this.boardSlug === 'accident_statistics') return 2
      return 0
    }
  },
  methods:{
    moveTab (boardSlug) {
      this.$router.push({name:'list|approval_tab_list|accident', params:{boardSlug}})
    }
  }
}
</script>

<style scoped>

</style>
