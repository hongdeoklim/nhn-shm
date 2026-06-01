<template>
  <table-list-page
    board-slug="accident_report"
    route-c="write|approval_tab_create|accident"
    route-u="write|approval_tab_update|accident"

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
      <search-nav-item-select label="재해구분"  v-model="nav.disasterClass" :list="nav.disasterClassList" />
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
  name: 'SafetyAccidentReport',
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
        disasterClass: '',
        disasterClassList:[
          { text: '전체선택', value: '' },
          { text: '넘어짐', value: '넘어짐' },
          { text: '떨어짐', value: '떨어짐' },
          { text: '끼임', value: '끼임' },
          { text: '물체에맞음', value: '물체에맞음' },
          { text: '무리한동작', value: '무리한동작' },
          { text: '베임·찔림', value: '베임·찔림' },
          { text: '교통사고', value: '교통사고' },
          { text: '동물상해', value: '동물상해' },
          { text: '부딪힘', value: '부딪힘' }
        ],
        dateTarget: ['content$body.accidentBasicInfo.created_at'],
        dateBegin: ['nav.date.sDate'],
        dateEnd: ['nav.date.eDate'],
        keyword: ['content$body.accidentInvestigationReport.accidentPersonInformation.disasterClass*[:nav.disasterClass]']
      },
      heads: [
        {name: '현장명'},
        {name: '업체명'},
        {name: '재해일'},
        {name: '사고자명'},
        {name: '재해구분'},
        {name: '상해종류'}
      ]
    }
  },
  methods:{
    getCol (index, value) {
      switch (index) {
      case 0: return value.post.project.client.com_name
      case 1: return this.getContent(value).accidentBasicInfo.com_name
      case 2: return this.getContent(value).accidentBasicInfo.accident_date
      case 3: return this.getContent(value).accidentInvestigationReport.accidentPersonInformation.name
      case 4: return this.getContent(value).accidentInvestigationReport.accidentPersonInformation.disasterClass
      case 5: return this.getContent(value).accidentInvestigationReport.accidentPersonInformation.shanghai
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
