<template>
  <div>
    <vs-tabs :value="tabIndex">
      <vs-tab label="안전점검" @click="moveTab('safety_check_partner_444')">
        <safety-check-partner444-index/>
      </vs-tab>
    </vs-tabs>
  </div>
</template>

<script>
import AccidentReportIndex from '@/views/list/accident/AccidentReportIndex'
import AccidentReviewIndex from '@/views/list/accident/AccidentReviewIndex'
import AccidentStatisticsIndex from '@/views/list/accident/AccidentStatisticsIndex'
import SafetyCheckPartner444Index from '@/views/list/safetycheckpartner/SafetyCheckPartner444Index'
export default {
  name: 'Index',
  components: {
    SafetyCheckPartner444Index,
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
      {title: '파트너사 일일보고'},
      {
        title: '안전점검',
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
      if (this.boardSlug === 'safety_check_444') return 0
      return 0
    }
  },
  methods:{
    moveTab (boardSlug) {
      this.$router.push({name:'list|approval_tab_list|safety_check', params:{boardSlug}})
    }
  }
}
</script>

<style scoped>

</style>
