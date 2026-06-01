<template>
  <vs-popup id="tableListPopup" title="사고보고" :active.sync="showPopup" >
    <table-list-page
      board-slug="accident_report"
      route-c="write|approval_tab_create|accident"
      route-u="write|approval_tab_update|accident"

      :download="false"
      :approval="false"
      :create="false"
      :move-detail="false"

      :nav="nav"
      :heads="heads"
      :getCol="getCol"

      @detail="onClickDetail"
    >
      <template #search>
        <search-nav-start-end class="mr-2" label="대상기간" v-model="nav.date"/>
        <search-nav-item-select label="재해구분"  v-model="nav.disasterClass" :list="nav.disasterClassList" />
      </template>
    </table-list-page>
  </vs-popup>
</template>

<script>
import KPagination from '@/components/kPagination/kPagination'
import DateSelector from '@/components/selector/DateSelector'
import TableListPage from '@/views/list/TableListPage'
import SearchNavStartEnd from '@/components/nav/SearchNavStartEnd.vue'
import SearchNavItemSelect from '@/components/nav/SearchNavItemSelect'
export default {
  name: 'PopupAccidentReportList',
  components: {
    SearchNavItemSelect,
    SearchNavStartEnd,
    TableListPage,
    DateSelector,
    KPagination},
  props: {
    value: Boolean
  },
  watch: {
    value (data) {
      this.showPopup = data
    },
    showPopup (value) {
      const body = document.querySelector('body');
      if (value) {
        body.style.overflow = 'hidden'
      } else {
        body.style.overflow = 'auto'
      }
      this.$emit('input', value)
    }
  },
  data () {
    return {
      showPopup: false,
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
        dateTarget: ['content$body.accidentBasicInfo.created_at'],
        dateBegin: ['nav.date.sDate'],
        dateEnd: ['nav.date.eDate'],
        keyword: ['content$body.accidentInvestigationReport.accidentPersonInformation.disasterClass*[:nav.disasterClass]']
      },
      heads: [
        {name: '현장명'},
        {name: '업체명'},
        {name: '작성일'},
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
      case 2: return this.getContent(value).accidentBasicInfo.created_at
      case 3: return this.getContent(value).accidentBasicInfo.accident_date
      case 4: return this.getContent(value).accidentInvestigationReport.accidentPersonInformation.name
      case 5: return this.getContent(value).accidentInvestigationReport.accidentPersonInformation.disasterClass
      case 6: return this.getContent(value).accidentInvestigationReport.accidentPersonInformation.shanghai
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
    },

    onClickDetail (value) {
      const postId = value.postId
      this.$emit('click', postId)
    }
  }
}
</script>

<style lang="scss">
#tableListPopup.con-vs-popup {
  z-index: 53000;

  .vs-popup {
    width: 80% !important;
    height: auto;
  }
  .vs-popup--content {
    width: auto !important;
    padding: 1rem;
    font-size: 1rem;
  }
}
</style>

<style scoped>

.tableListPopup {
  width: 80%;
}


.table-layout {
  border: 1px solid #cdcdcd;
}

.table-layout .trow {
  border-bottom: 1px solid #cdcdcd;
}

.table-layout .tcol {
  border-right: 1px solid #cdcdcd;
}

.vs-con-table.stripe .tr-values.active {
  background: rgb(102, 112, 203) !important;
  color: #fff;
  font-width: bold;
}

</style>
