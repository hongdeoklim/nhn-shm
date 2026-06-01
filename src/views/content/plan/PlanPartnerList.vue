<template>
  <div>
    <table-list-page
      ref="table"
      route-u="project-plan-partners-update"
      :board-id="50"

      :moveProject="true"
      :moveNew="false"
      :moveDetail="false"
      :download="'파트너사 계약 현황'"
      :approval="false"
      :create="false"
      :nav="nav"
      :heads="heads"
      :getCol="getCol"

      @detail="onClickDetail"

      @new="onClickNew"
    >
      <template #search>
        <search-nav-start-end class="mr-2" label="계약기간" v-model="nav.date"/>
        <search-nav-item-keyword class="mr-2" label="업체명" v-model="nav.com_name"/>
        <search-nav-item-select class="mr-2" size="big" label="계약금액" v-model="nav.price" :list="nav.priceList"/>
      </template>
    </table-list-page>

    <popup-partner-agreement-add
      :popupActive="popupActive"
      @popupActiveSync="popupActiveSync"
      @add="onClickAdd"
    />
  </div>
</template>

<script>
import TableListPage from '@/views/list/TableListPage'
import SearchNavItemSelect from '@/components/nav/SearchNavItemSelect'
import SearchNavStartEnd from '@/components/nav/SearchNavStartEnd.vue'
import SearchNavItemKeyword from '@/components/nav/SearchNavItemKeyword'
import PopupPartnerAgreementAdd from '@/views/project/popup/PopupPartnerAgreementAdd'
export default {
  name: 'PlanPartnerList',
  components: {
    PopupPartnerAgreementAdd,
    SearchNavItemKeyword,
    SearchNavStartEnd,
    SearchNavItemSelect,
    TableListPage},
  data () {
    return {
      popupActive: false,
      nav: {
        projectId: '0',
        orderTarget: 'created_at',
        orderDirection: 'desc',
        date: {},
        com_name: '',
        price: '',
        priceList:[
          { text: '전체', value: '' },
          { text: '50억이상', value: '50' },
          { text: '10억이상 50억미만', value: '10' },
          { text: '5억이상 10억미만', value: '5' },
          { text: '5억미만', value: '0' }
        ],
        dateTarget: 'content$agreementInfo.termStartDate',
        dateBegin: 'nav.date.sDate',
        dateEnd: 'nav.date.eDate',
        keyword: [
          'content$basicInfo.com_name*%[:nav.com_name]%',
          'content$agreementInfo.amountGroup*[:nav.price]'
        ]
      },
      heads: [
        {name: '현장명'}, //0
        {name: '계약코드'}, //1
        {name: '사업명'}, //2
        {name: '업체명'}, //3
        {name: '계약 금액'}, //4
        {name: '계약일'}, //5
        {name: '계약 기간'} //6
      ]
    }
  },
  methods:{
    loadPost () {
      this.$refs.table.loadList()
    },
    onClickNew () {
      this.popupActive = true
    },
    popupActiveSync () {
      this.popupActive = false
    },
    getCol (index, value) {
      switch (index) {
      case 0: return value.project.field_name
      case 1: return this.getContent(value).agreementInfo.code
      case 2: return this.getContent(value).agreementInfo.title
      case 3: return this.getContent(value).basicInfo.com_name
      case 4: return this.comma(this.getContent(value).agreementInfo.amount)
      case 5: return this.getContent(value).agreementInfo.contractDate
      case 6: return `${this.getContent(value).agreementInfo.termStartDate}-${this.getContent(value).agreementInfo.termEndDate}`
      }
      return ''
    },
    getContent (data) {
      if (data.post_content) {
        const content = JSON.parse(data.post_content)
        return content
      }
    },

    comma (str) {
      str = `${str}`
      if (str && str.length > 0) {
        return str.replace(/,/gi, '').replace(/\B(?=(\d{3})+(?!\d))/gi, ',')
      }
    },

    onClickAdd () {
      this.loadPost()
    },

    onClickDetail (value) {
      window.open(`/project/${value.projId}/plan/partners/info/${value.No}`)
    }
  }
}
</script>

<style scoped>

</style>
