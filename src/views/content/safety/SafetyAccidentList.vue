<template>
  <table-list-page
    board-slug="accident_review"
    route-c="write|approval_tab_create|accident"
    route-u="write|approval_tab_update|accident"

    download="산재발생현황"
    :create="false"
    :approval="false"
    :move-detail="false"

    :nav="nav"
    :heads="heads"
    :getCol="getCol"
  >
    <template #search>
      <search-nav-start-end class="mr-2" label="대상기간" v-model="nav.date"/>
    </template>
  </table-list-page>
</template>

<script>
import TableListPage from '@/views/list/TableListPage'
import SearchNavStartEnd from '@/components/nav/SearchNavStartEnd.vue'
export default {
  name: 'SafetyAccidentList',
  components: {
    SearchNavStartEnd,
    TableListPage},
  data () {
    return {
      nav: {
        orderTarget: 'created_at',
        orderDirection: 'desc',
        date: {},
        dateTarget: ['content$body.accidentBasicInfo.created_at'],
        dateBegin: ['nav.date.sDate'],
        dateEnd: ['nav.date.eDate'],
        keyword: ['content$body.accidentInvestigationReport.accidentPersonInformation.disasterClass*[:nav.disasterClass]']
      },
      heads: [
        {name: '현장명'},
        {name: '재해일'},
        {name: '재해월'},
        {name: '산재승인일'},
        {name: '직급(직종)분류'},
        {name: '재해자명'},
        {name: '상해종류'},
        {name: '재해구분'},
        {name: '업무분류'},
        {name: '재해원인'},
        {name: '보상현황'}
      ]
    }
  },
  methods:{
    getCol (index, value) {
      switch (index) {
        case 0: return value.post.project.client.com_name
        case 1: return this.getContent(value).accidentBasicInfo.accident_date
        case 2: return parseInt(new Date(this.getContent(value).accidentBasicInfo.accident_date).format('MM'))
        case 3: return this.getContent(value).accidentBasicInfo.accident_approval_date
        case 4: return this.getContent(value).accidentInvestigationReport.accidentPersonInformation.occupation
        case 5: return this.getContent(value).accidentInvestigationReport.accidentPersonInformation.name
        case 6: return this.getContent(value).accidentInvestigationReport.accidentPersonInformation.shanghai
        case 7: return this.getContent(value).accidentInvestigationReport.accidentPersonInformation.disasterClass
        case 8: return this.getContent(value).accidentInvestigationReport.accidentPersonInformation.task
        case 9: return this.getContent(value).accidentInvestigationReport.overviewAndAnalyze.analyze.administrativeCause
        case 10: return this.getContent(value).accidentInvestigationReport.accidentPersonInformation.compensationStatus
      }
    },

    getContent (data) {
      if (data.post_content) {
        const content = JSON.parse(data.post_content)
        return content.body
      }
    }
  }
}
</script>

<style scoped>

</style>
