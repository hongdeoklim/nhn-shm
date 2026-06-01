<template>
  <table-list-page
    board-slug="project_monthly_report"
    route-c="write|approval_create"
    route-u="write|approval_update"

    download="안전·보건예산 현황"
    :nav="nav"
    :heads="heads"
    :getCol="getCol"
  >
    <template #search>
      <search-nav-year-month label="대상기간" v-model="nav.date"/>
    </template>

    <!--    <template #col="{index, value}">-->
    <!--      {{ getCol(index, value) }}-->
    <!--    </template>-->

  </table-list-page>
</template>

<script>
import TableListPage from '@/views/list/TableListPage'
import SearchNav from '@/components/nav/SearchNav'
import SearchNavItemSelect from '@/components/nav/SearchNavItemSelect'
import SearchNavYearMonth from '@/components/nav/SearchNavYearMonth.vue'

export default {
  name: 'Index',
  components: {
    SearchNavYearMonth,
    SearchNavItemSelect,
    SearchNav,
    TableListPage
  },
  data () {
    return {
      nav: {
        orderTarget: 'created_at',
        orderDirection: 'desc',
        date: {},
        keyword: [
          'content$header.year*[:nav.date.year]',
          'content$header.month*[:nav.date.month]'
        ]
      },
      heads: [
        {name: '현장명'},
        {name: '작성자'},
        {name: '작성일'},
        {name: '안전보건관리비 배정액'},
        {name: '안전보건관리비 집행률'},
        {name: '안전장비 배정액'},
        {name: '안전장비 집행률'}
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
      case 1: return value.user.name
      case 2: return this.getContent(value).created_at.substring(0, 10)
      case 3: return `${this.addComma(this.getPostContent(value).body.reportHealthAndSafetyManagementCost.accumulate.amount)  } 원`
      case 4: return `${this.addComma(this.getPostContent(value).body.reportHealthAndSafetyManagementCost.accumulate.run_rate)} %`
      case 5: return `${this.addComma(this.getPostContent(value).body.reportSafetyEquipment.accumulate.amount)  } 원`
      case 6: return `${this.addComma(this.getPostContent(value).body.reportSafetyEquipment.accumulate.run_rate)} %`
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
