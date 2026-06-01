<template>
  <div>
    <vs-tabs :value="tabIndex">
      <vs-tab label="사고보고" @click.stop="moveTab('accident_report')">
        <accident-report-index/>
      </vs-tab>
      <vs-tab label="산업재해검토" @click.stop="moveTab('accident_review')">
        <accident-review-index/>
      </vs-tab>
      <vs-tab label="산업재해발생 현황" @click.stop="moveTab('accident_statistics')">
        <accident-statistics-index/>
      </vs-tab>
    </vs-tabs>
  </div>
</template>

<script>
import ApprovalDocument from '@/views/write/document/ApprovalDocument'
import AccidentReportIndex from '@/views/write/accident/AccidentReportIndex'
import AccidentReviewIndex from '@/views/write/accident/AccidentReviewIndex'
import AccidentStatisticsIndex from '@/views/write/accident/AccidentStatisticsIndex'

export default {
  name: 'ReportWrite',
  components: {
    AccidentStatisticsIndex,
    AccidentReviewIndex,
    AccidentReportIndex,
    ApprovalDocument},
  computed:{
    tabIndex () {
      if (this.boardSlug === 'accident_report') return 0
      if (this.boardSlug === 'accident_review') return 1
      if (this.boardSlug === 'accident_statistics') return 2
      return 0
    },
    boardSlug () {
      return this.$route.params.boardSlug
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
  mounted () {
  },
  methods: {
    moveTab (boardSlug) {
      this.$router.push({name:'list|approval_tab_list|accident', params:{boardSlug}})
    }
  }
}
</script>

<style scoped>

</style>
