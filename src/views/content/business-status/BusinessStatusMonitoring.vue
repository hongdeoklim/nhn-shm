<template>
<div>
  <search-nav @handleSearch="handleSearch">
    <search-nav-item-select :label="$t('search.대상기간')" v-model="nav.year" :list="nav.yearList" />년
    <search-nav-item-select v-model="nav.month" :list="nav.monthList" />월
    <search-nav-item-project class="ml-4" :label="$t('search.현장명')" v-model="nav.projectName" :use-name="true"/>
  </search-nav>

  <template-list-normal
    class="mb-6"
    :title="projectTitle"
    :column="column"
    :list="projectList"
    :perPageOption="perPageOption"
    :perPage="Number(perPage)"
    :currentPage="currentPage"
    :lastPage="lastPage"

    @handleChangePerPage = "handleChangePerPage"
    @handleItemClickDetail = "handleItemClickDetail"
    @handleItemClickDetailBlank = "handleItemClickDetailBlank"
    @handleChangePage = "handleChangePage"
    @handleClickRegister = "handleClickRegister">
  </template-list-normal>

</div>
</template>

<script>
import ReportSearchNav from '@/components/nav/global/StatusSearchNav'
import TemplateListNormal from '@/views/content/business-status/template/TemplateListNormal'
import SearchNavItemKeyword from '@/components/nav/SearchNavItemKeyword'
import SearchNav from '@/components/nav/SearchNav'
import SearchNavItemDate from '@/components/nav/SearchNavItemDate'
import SearchNavItemSelect from '@/components/nav/SearchNavItemSelect'
import SearchNavItemProject from '@/components/nav/SearchNavItemProject'

export default {
  name: 'BusinessStatusMonitoring',
  components : {
    SearchNavItemProject,
    SearchNavItemSelect,
    SearchNavItemDate,
    SearchNav,
    SearchNavItemKeyword,
    ReportSearchNav,
    TemplateListNormal
  },
  data () {
    return {
      rootPath: '', // 프로젝트의 rootPath
      nav: {
        date: ['', ''],
        year: '',
        yearList:[],
        month:'',
        monthList:[
          {text:'전체', value:''},
          {text:'1', value:'1'},
          {text:'2', value:'2'},
          {text:'3', value:'3'},
          {text:'4', value:'4'},
          {text:'5', value:'5'},
          {text:'6', value:'6'},
          {text:'7', value:'7'},
          {text:'8', value:'8'},
          {text:'9', value:'9'},
          {text:'10', value:'10'},
          {text:'11', value:'11'},
          {text:'12', value:'12'}
        ],
        projectName:''
      },

      viewTypeCode: 'normal',
      perPageOption: '10,20,30',
      projectTitle: '',
      column : [
        this.$t('content.business-status.monitoring.column.No'),
        this.$t('content.business-status.monitoring.column.현장명'),
        this.$t('content.business-status.monitoring.column.모니터링'),
        this.$t('content.business-status.monitoring.column.안전이슈'),
        this.$t('content.business-status.monitoring.column.보건이슈'),
        this.$t('content.business-status.monitoring.column.안전보건부서장'),
        this.$t('content.business-status.monitoring.column.안전보건부서장'),
        this.$t('content.business-status.monitoring.column.대상기간'),
        this.$t('content.business-status.monitoring.column.사업금액'),
        this.$t('content.business-status.monitoring.column.보기')
      ],
      list:[],

      //pagination
      perPage: 10,
      date:'',
      searchKeyword: '',
      currentPage: 1,
      lastPage: 1
    }
  },

  computed: {
    projectList () {
      const newList = []

      for (let i = 0; i < this.list.length; i++) {
        const item = this.list[i]
        const no = item.id
        const field_name = item.field_name
        const monitoring = {t:'●', c:'#1E0D61'}
        const safety = {t:'●', c:'#7E72F2'}
        const health = {t:'●', c:'#C4C4C4'}
        const field_chief = (item.field_chief) ? item.field_chief.name : ''
        const safety_chief = (item.safety_chief) ? item.safety_chief.name : ''
        const work_date = `${item.date_work_start.substring(0,10)} ~ ${item.date_complete.substring(0,10)}`
        const work_money_amount = this.addComma(item.work_money_amount)
        //[1, '울산-포항 복선전철 1공구', {t:'●', c:'#1E0D61'}, {t:'●', c:'#7E72F2'}, {t:'●', c:'#C4C4C4'}, '권순철', '김일수, 김이수', '2020-11-11~2020-11-30', '3,400,000,000원'],
        newList.push([no, field_name, monitoring, safety, health, field_chief, safety_chief, work_date, work_money_amount])
      }

      return newList
    }
  },
  created () {
    this.rootPath = '/'

    let nowYear = new Date().getFullYear()
    this.nav.yearList.push({text:'전체',  value:''})
    for (let i = 0; i < 50; i++) {
      this.nav.yearList.push({text:`${nowYear}`,  value:nowYear})
      nowYear--
    }

    this.loadProjectList()
  },
  methods: {

    async loadProjectList () {
      const page = (this.currentPage) ? this.currentPage : 1
      const perPage = this.perPage
      const keyword = this.nav.keyword
      const project_group_id = this.nav.projectGroup
      const project_name = this.nav.projectName
      const constructor_name = this.nav._constructor
      const subcontractor = this.nav.subcontractor
      const location = this.nav.location
      const contract_code = this.nav.contract_code
      const employee = this.nav.employee


      const year = this.nav.year
      const month = this.nav.month
      const filterBegin = this.getFirstDateWithSearchDate(year, month)
      const filterEnd = this.getLastDateWithSearchDate(year, month)

      let filterType = ''
      if (filterBegin || filterEnd) {
        filterType = 'complete_expected' //this.filterType = {start, complete_expected, complete}
      }

      await this.$store.dispatch('project/LOAD_PROJECT_LIST', {
        page,
        perPage,
        keyword,
        filterType,
        filterBegin,
        filterEnd,
        project_group_id,
        project_name,
        constructor_name,
        subcontractor,
        location,
        contract_code,
        employee
      })

      // 게시물 불러오기
      const projectListInfo = this.$store.state.project.projectListInfo

      // 페이지네이션 정보
      this.currentPage = projectListInfo.current_page
      this.lastPage = projectListInfo.last_page
      this.perPage = projectListInfo.per_page

      // 보여지는 게시물 리스트
      this.list = projectListInfo.data

    },
    addComma (str) {
      let text = ''
      if (str) {
        text = str.toString()
      }

      if (text && text.length > 0) {
        return text.replace(/,/gi, '').replace(/\B(?=(\d{3})+(?!\d))/gi, ',')
      }
    },

    handleItemClickDetail (data) {
      this.$router.push(`/project/${data[0]}`)
    },
    handleItemClickDetailBlank (data) {
      const routeData = this.$router.resolve(`/project/${data[0]}`)
      window.open(routeData.href, '_blank')
    },
    handleSearch () {
      this.currentPage = 1
      this.loadProjectList()
    },
    handleChangePerPage (perPage) {
      this.perPage = perPage
      this.loadProjectList()
    },
    handleChangePage (page) {
      this.currentPage = page
      this.loadProjectList()
    },
    handleClickRegister () {

    },
    getFirstDateWithSearchDate (year, month) {
      if (year > 0 && month > 0) {
        return new Date(`${year}-${month}-01`).format('yyyy-MM-dd')
      } else if (year > 0 && month === '') {
        return new Date(`${year}-01-01`).format('yyyy-MM-dd')
      }

      return ''
    },

    getLastDateWithSearchDate (year, month) {
      if (year > 0 && month > 0) {
        let last = new Date(year, month)
        last = new Date(last - 1)
        return new Date(`${year}-${month}-${last.getDate()}`).format('yyyy-MM-dd')
      } else if (year > 0 && month === '') {
        return new Date(`${year}-12-31`).format('yyyy-MM-dd')
      }

      return ''
    },
  }
}
</script>

<style scoped>

</style>
