<template>
  <table-list-page
    board-slug="accident_review"
    route-c="write|approval_tab_create|accident"
    route-u="write|approval_tab_update|accident"
    download="산업재해검토"

    :nav="nav"
    :heads="heads"
    :getCol="getCol"
  >
    <template #search>
      <search-nav-start-end class="mr-2" label="대상기간" v-model="nav.date"/>
      <search-nav-item-select label="재해구분"  v-model="nav.disasterClass" :list="nav.disasterClassList" />
      <search-nav-item-select label="보고유형"  v-model="nav.compensationStatus" :list="nav.compensationStatusList" />
      <search-nav-item-select label="산재승인여부"  v-model="nav.accident_approval" :list="nav.accident_approvalList" />
    </template>
  </table-list-page>
</template>

<script>
import TableListPage from '@/views/list/TableListPage'
import SearchNavStartEnd from '@/components/nav/SearchNavStartEnd.vue'
import SearchNavItemSelect from '@/components/nav/SearchNavItemSelect'
import CompensationStatusSelector from '@/components/CompensationStatusSelector'
export default {
  name: 'AccidentReviewIndex',
  components: {
    CompensationStatusSelector,
    SearchNavItemSelect,
    SearchNavStartEnd,
    TableListPage},
  data () {
    return {
      nav: {
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
        compensationStatus: '',
        compensationStatusList:[
          { text: '전체선택', value: '' },
          { text: '산업재해', value: '산업재해' },
          { text: '업무상재해', value: '업무상재해' }
        ],
        accident_approval:'',
        accident_approvalList:[
          { text: '전체선택', value: '' },
          { text: '승인', value: '승인' },
          { text: '미승인', value: '미승인' }
        ],

        dateTarget: ['content$body.accidentBasicInfo.created_at'],
        dateBegin: ['nav.date.sDate'],
        dateEnd: ['nav.date.eDate'],
        keyword: [
          'content$body.accidentInvestigationReport.accidentPersonInformation.disasterClass*[:nav.disasterClass]',
          'content$body.accidentInvestigationReport.accidentPersonInformation.compensationStatus*[:nav.compensationStatus]',
          'content$body.accidentBasicInfo.accident_approval*[:nav.accident_approval]',
        ]
      },
      heads: [
        {name: '현장명'},
        {name: '업체명'},
        {name: '작성일'},
        {name: '재해일'},
        {name: '보고유형'},
        {name: '산재승인여부'},
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
      case 2: return this.getContent(value).accidentBasicInfo.created_at
      case 3: return this.getContent(value).accidentBasicInfo.accident_date
      case 4: return this.getContent(value).accidentInvestigationReport.accidentPersonInformation.compensationStatus
      case 5: return this.getContent(value).accidentBasicInfo.accident_approval
      case 6: return this.getContent(value).accidentInvestigationReport.accidentPersonInformation.name
      case 7: return this.getContent(value).accidentInvestigationReport.accidentPersonInformation.disasterClass
      case 8: return this.getContent(value).accidentInvestigationReport.accidentPersonInformation.shanghai
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
