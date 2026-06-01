<template>
  <table-list-page
    board-slug="project_monthly_report"
    route-c="write|approval_create"
    route-u="write|approval_update"

    download="안전·보건예산 현황"
    :create="false"
    :approval="false"
    :move-project="true"

    :nav="nav"
    :heads="heads"
    :getCol="getCol"
  >
    <template #search>
      <search-nav-year-month class="mr-4" label="대상기간" v-model="nav.date"/>
      <search-nav-item-project :label="$t('search.현장명')" size="normal" v-model="nav.projectId"/>
    </template>

  </table-list-page>
</template>

<script>
import TableListPage from '@/views/list/TableListPage'
import SearchNav from '@/components/nav/SearchNav'
import SearchNavItemSelect from '@/components/nav/SearchNavItemSelect'
import SearchNavYearMonth from '@/components/nav/SearchNavYearMonth.vue'
import SearchNavItemProject from '@/components/nav/SearchNavItemProject'

export default {
  name: 'BusinessStatusReport',
  components: {
    SearchNavItemProject,
    SearchNavYearMonth,
    SearchNavItemSelect,
    SearchNav,
    TableListPage
  },
  data () {
    return {
      nav: {
        projectId: 0,
        orderTarget: 'created_at',
        orderDirection: 'desc',
        date: {year: new Date().getFullYear(), month:''},
        keyword: [
          'content$header.year*[:nav.date.year]',
          'content$header.month*[:nav.date.month]'
        ]
      },
      heads: [
        {name: '현장명'},
        {name: '작성자'},
        {name: '안전보건관리비 배정액'},
        {name: '안전보건관리비 집행률'},
        {name: '안전장비 배정액'},
        {name: '안전장비 집행률'},
      ]
    }
  },
  created () {
    const breadcrumb = [
      {title: 'Home'},
      {
        title: '안전·보건예산 현황',
        active: true
      }
    ]

    this.$store.commit('menu/UPDATE_PAGE_LIST', breadcrumb)
  },
  methods: {
    getCol (index, value) {
      switch (index) {
      case 0: return value.post.project.client.com_name
      case 1: return value.user ? value.user.name : ''
      case 2: return `${this.addComma(this.getPostContent(value).body.reportHealthAndSafetyManagementCost.accumulate.amount)  } 원`
      case 3: return `${this.addComma(this.getPostContent(value).body.reportHealthAndSafetyManagementCost.accumulate.run_rate)} %`
      case 4: return `${this.addComma(this.getPostContent(value).body.reportSafetyEquipment.accumulate.amount)  } 원`
      case 5: return `${this.addComma(this.getPostContent(value).body.reportSafetyEquipment.accumulate.run_rate)} %`
      }
    },

    getPostContent (data) {
      if (data.post_content) {
        const content = JSON.parse(data.post_content)
        return content
      }
    },

    getContent (data) {
      if (data.post) {
        const content = data.post
        return content
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
