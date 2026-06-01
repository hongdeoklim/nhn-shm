<template>
  <div>
    <search-nav @handleSearch="handleSearch">
      <search-nav-item-date :label="$t('search.대상기간')" v-model="nav.date" />
      <search-nav-item-project class="ml-4" :label="$t('search.현장명')" v-model="nav.projectName" :use-name="true"/>
    </search-nav>

    <template-list-normal
      class="mb-6"
      :title="projectTitle"
      :list="projectList"
      :column="column"
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
import SearchNav from '@/components/nav/SearchNav'
import SearchNavItemKeyword from '@/components/nav/SearchNavItemKeyword'
import SearchNavItemDate from '@/components/nav/SearchNavItemDate'
import SearchNavItemProject from '@/components/nav/SearchNavItemProject'

export default {
  name: 'PlanProjectInfo',
  components : {
    SearchNavItemProject,
    SearchNavItemDate,
    SearchNavItemKeyword,
    SearchNav,
    ReportSearchNav,
    TemplateListNormal
  },
  data () {
    return {
      rootPath: '', // 프로젝트의 rootPath
      nav: {
        date: ['', ''],
        keyword: '',
        projectName:'',
      },
      filterBegin:'',
      filterEnd:'',

      viewTypeCode: 'normal',
      perPageOption: '10,20,30',
      projectTitle: '',
      column : [
        this.$t('content.plan.project.info.column.No'), // 0
        this.$t('content.plan.project.info.column.계약코드'), // 1
        this.$t('content.plan.project.info.column.현장명'), // 2
        this.$t('content.plan.project.info.column.지역'), // 3
        this.$t('content.plan.project.info.column.안전담당부서'), //8
        this.$t('content.plan.project.info.column.안전보건부서장'), // 9
        this.$t('content.plan.project.info.column.안전보건담당자'), // 10
        this.$t('content.plan.project.info.column.보기'),
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
        const contract_code = item.contract_code
        const field_location = item.field_location
        const field_name = item.field_name
        const work_date = `${item.date_work_start.substring(0, 10)} ~ ${item.date_complete.substring(0, 10)}`
        const work_money_amount = this.addComma(item.work_money_amount)
        const work_type = (item.work_type) ? item.work_type.name : ''
        const constructor_company = (item.constructor_company) ? item.constructor_company.com_name : ''
        const work_general = (item.work_general) ? item.work_general.com_name : ''
        const field_chief = (item.field_chief) ? item.field_chief.name : ''
        const safety_chief = (item.safety_chief) ? item.safety_chief.name : ''
        newList.push([no, contract_code,  field_name, field_location,  work_general, field_chief, safety_chief])

      }

      return newList
    }
  },

  created () {
    this.rootPath = '/'

    this.loadProjectList()
  },

  methods: {

    async loadProjectList () {
      const page = (this.currentPage) ? this.currentPage : 1
      const perPage = this.perPage
      const keyword = this.nav.keyword
      const filterBegin = this.filterBegin
      const filterEnd = this.filterEnd
      const project_group_id = this.nav.projectGroup
      const project_name = this.nav.projectName
      const constructor_name = this.nav._constructor
      const subcontractor = this.nav.subcontractor
      const location = this.nav.location
      const contract_code = this.nav.contract_code
      const employee = this.nav.employee

      let filterType = ''
      if (filterBegin || filterEnd) {
        filterType = 'business_duration' //this.filterType = {start, complete_expected, complete}
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
      this.$router.push(`/project/${data[0]}/plan/project`)
    },
    handleItemClickDetailBlank (data) {
      const routeData = this.$router.resolve(`/project/${data[0]}/plan/project`)
      window.open(routeData.href, '_blank')
    },
    handleSearch () {
      this.currentPage = 1
      this.filterBegin = (this.nav.date[0]) ? this.nav.date[0] : ''
      this.filterEnd = (this.nav.date[1]) ? this.nav.date[1] : ''
      this.loadProjectList()
    },
    handleChangePerPage (perPage) {
      this.perPage = perPage
      this.loadProjectList()
    },
    handleChangePage (_data) {
      this.currentPage = _data
      this.loadProjectList()
    },
    handleClickRegister () {

    }
  }


}
</script>

<style scoped>

</style>
