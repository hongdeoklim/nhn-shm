<template>
  <div>
    <vs-tabs :value="tabIndex">
      <vs-tab label="안전점검" @click.stop="moveTab('safety_check_444')">
        <safety-check444-index/>
      </vs-tab>
    </vs-tabs>
  </div>
</template>

<script>
import ApprovalDocument from '@/views/write/document/ApprovalDocument'
import AccidentReportIndex from '@/views/write/accident/AccidentReportIndex'
import AccidentReviewIndex from '@/views/write/accident/AccidentReviewIndex'
import AccidentStatisticsIndex from '@/views/write/accident/AccidentStatisticsIndex'
import SafetyCheck444Index from '@/views/write/safetycheck/SafetyCheck444Index'

export default {
  name: 'ReportWrite',
  components: {
    SafetyCheck444Index,
    AccidentStatisticsIndex,
    AccidentReviewIndex,
    AccidentReportIndex,
    ApprovalDocument},
  computed:{
    tabIndex () {
      if (this.boardSlug === 'safety_check_444') return 0
      return 0
    },
    boardSlug () {
      return this.$route.params.boardSlug
    }
  },
  created () {
    let breadcrumb = [
      {title: 'Home'},
      {title: '안전점검'},
      {
        title: '안전점검',
        active: true
      }
    ]

    if (this.boardSlug === 'safety_check_partner_444') {
      breadcrumb = [
        {title: 'Home'},
        {title: '파트너사 일일보고'},
        {
          title: '안전점검',
          active: true
        }
      ]
    }

    this.$store.commit('menu/UPDATE_PAGE_LIST', breadcrumb)
  },
  mounted () {
  },
  methods: {
    moveTab (boardSlug) {
      this.$router.push({name:'list|approval_tab_list|safety_check', params:{boardSlug}})
    }
  }
}
</script>

<style scoped>

</style>
