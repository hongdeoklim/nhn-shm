<template>
  <table-list-page
    board-slug="safety_check_partner_444"
    route-c="write|approval_tab_create|safety_check_partner"
    route-u="write|approval_tab_update|safety_check_partner"

    download="사고보고"
    :create="false"
    :approval="false"
    :move-project="true"

    :nav="nav"
    :heads="heads"
    :getCol="getCol"
  >
    <template #search>
      <search-nav-start-end class="mr-2" label="대상기간" v-model="nav.date"/>
      <search-nav-item-project :label="$t('search.현장명')" size="normal" v-model="nav.projectId"/>
    </template>
  </table-list-page>
</template>

<script>
import TableListPage from '@/views/list/TableListPage'
import SearchNavItemSelect from '@/components/nav/SearchNavItemSelect'
import SearchNavStartEnd from '@/components/nav/SearchNavStartEnd.vue'
import SearchNavItemProject from '@/components/nav/SearchNavItemProject'
export default {
  name: 'RiskCheckCheckLogPartner',
  components: {
    SearchNavItemProject,
    SearchNavStartEnd,
    SearchNavItemSelect,
    TableListPage},
  data () {
    return {
      nav: {
        projectId: 0,
        orderTarget: 'created_at',
        orderDirection: 'desc',
        date: {},
        dateTarget: ['content$body.safetyCheckBasicInfo.created_at'],
        dateBegin: ['nav.date.sDate'],
        dateEnd: ['nav.date.eDate'],
        keyword: []
      },
      heads: [
        {name: '현장명'},
        {name: '작성자'},
        {name: '안전보건담당자'},
        {name: '대상월'},
        {name: '발주공사현장'}
      ]
    }
  },
  methods:{
    getCol (index, value) {
      switch (index) {
      case 0: return value.post.project.client.com_name
      case 1: return this.getContent(value).safetyCheckBasicInfo.writer
      case 2: return this.getContent(value).safetyCheckBasicInfo.safety_and_health_officer
      case 3: return this.getContent(value).safetyCheckBasicInfo.month
      case 4: return this.getContent(value).safetyCheckDateAndLocation.orderConstructionSite.location
      }
    },
    getContent (data) {
      if (data.post_content) {
        const content = JSON.parse(data.post_content)
        return content.body
      }
    },

    addComma (str) {
      str = `${str}`
      if (str && str.length > 0) {
        return str.replace(/,/gi, '').replace(/\B(?=(\d{3})+(?!\d))/gi, ',')
      }
    }
  }
}
</script>

<style scoped>

</style>
