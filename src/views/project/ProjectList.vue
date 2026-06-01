<template>
<div>
  <search-nav @handleSearch = "handleSearch">
    <div v-if="showSearch === false" class="flex">
      <search-nav-item-select :label="$t('search.검색조건')" :list="nav.typeList" v-model="nav.type"></search-nav-item-select>
      <search-nav-item-keyword v-model="nav.keyword" @keyupEvent="handleSearch"/>
      <vs-button class="mr-4" type="border" @click="showSearch=true">{{$t('search.상세검색')}}</vs-button>
    </div>

    <div v-if="showSearch === true" >
      <vs-button type="border" @click="showSearch=false" class="mb-4 mr-4">{{$t('search.간편검색')}}</vs-button>
      <div class="grid" style=" grid-template-columns: auto auto">
        <search-nav-item-keyword label="현장명" v-model="nav.projectName" class="mb-4 mr-2"></search-nav-item-keyword>
        <search-nav-item-keyword label="파트너사" v-model="nav.subcontractor" class="mb-4 mr-2"></search-nav-item-keyword>
        <search-nav-item-select  label="분　　류" style="display: block" :list="nav.projectGroupList" v-model="nav.projectGroup" class="mb-4" />
        <search-nav-item-keyword :label="$t('search.지　　역')" v-model="nav.location" class="mb-4 mr-2"></search-nav-item-keyword>
        <search-nav-item-keyword :label="$t('search.계약코드')" v-model="nav.contract_code" class="mb-4 mr-2"></search-nav-item-keyword>
      </div>
      <search-nav-item-date label="대상기간" v-model="nav.date" @handleSearch="handleSearch"/>
    </div>

  </search-nav>

  <vs-row class="mb-4">
    <vs-col class="flex" vs-justify="flex-end">
      <vs-button class="mr-2" type="flat" icon-pack="feather" icon="icon-grid" color="black"
                 style="background-color: #fff; !important; box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.135216);"
                 @click="()=>{changeListType('grid');}"
      />
      <vs-button class="" type="flat" icon-pack="feather" icon="icon-menu" color="black"
                 style="background-color: #fff; !important; box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.135216);"
                 @click="()=>{changeListType('list');}"
      />
    </vs-col>
  </vs-row>


  <template-list-photo
    v-if="listType === 'grid'"
    :title="projectTitle"
    :list="projectList"
    :perPageOption="perPageOption"
    :perPage="Number(perPage)"
    :currentPage="currentPage"
    :lastPage="lastPage"

    @handleChangePerPage = "handleChangePerPage"
    @handleItemClickDetail = "handleItemClickDetail"
    @handleChangePage = "handleChangePage"
    @handleClickRegister = "handleClickRegister">
  </template-list-photo>

  <template-list-normal
    v-else
    class="mb-6"
    :title="projectTitle"
    :list="projectList"
    :perPageOption="perPageOption"
    :perPage="Number(perPage)"
    :currentPage="currentPage"
    :lastPage="lastPage"

    @handleChangePerPage = "handleChangePerPage"
    @handleItemClickDetail = "handleItemClickDetail"
    @handleChangePage = "handleChangePage"
    @handleClickRegister = "handleClickRegister">
  </template-list-normal>

  <popup-project-write v-model="showWrite"></popup-project-write>

</div>
</template>

<script>
import TemplateListPhoto from '@/views/project/template/TemplateListPhoto'
import TemplateListNormal from '@/views/project/template/TemplateListNormal'
import PopupProjectWrite from '@/views/project/PopupProjectWrite'
import SearchNav from '@/components/nav/SearchNav'
import SearchNavItemDate from '@/components/nav/SearchNavItemDate'
import SearchNavItemKeyword from '@/components/nav/SearchNavItemKeyword'
import PopupProjectSearch from '@/popup/PopupSearchProject'
import SearchNavItemSelect from '@/components/nav/SearchNavItemSelect'

export default {
  name: 'ProjectList',
  components: {
    SearchNavItemSelect,
    PopupProjectSearch,
    SearchNavItemKeyword,
    SearchNavItemDate,
    SearchNav,
    PopupProjectWrite,
    TemplateListPhoto,
    TemplateListNormal
  },

  data () {
    return {
      // 검색 네비게이션
      nav: {
        date: ['', ''],
        keyword: '',
        type: 'projectName',
        typeList: [
          {text: this.$t('select_box.project.현장명'), value: 'projectName'},
          {text: this.$t('select_box.project.계약업체명'), value: 'constructor'},
          {text: this.$t('select_box.project.계약코드'), value: 'contract_code'}
        ],
        projectGroup: '',
        projectGroupList:[],
        projectName:'',
        _constructor:'',
        subcontractor:'',
        location:'',
        contract_code:'',
        employee:'',
      },

      listType: 'list',

      viewTypeCode: 'normal',
      perPageOption: '10,20,30',
      projectTitle: '',
      projectList: [],

      //pagination
      perPage: 10,
      currentPage: 1,
      lastPage: 1,

      showWrite: false,
      showSearch: false,
      project_group:[],
    }
  },
  async created () {
    await this.loadProjectList()
    await this.loadProjectGroup()
  },
  methods: {

    // 게시물 불러오기
    async loadProjectList () {
      const page = (this.currentPage) ? this.currentPage : 1
      const perPage = this.perPage
      const filterBegin = this.filterBegin
      const filterEnd = this.filterEnd
      const project_group_id = this.nav.projectGroup
      const subcontractor = this.nav.subcontractor
      const location = this.nav.location
      const employee = this.nav.employee

      let constructor_name = this.nav._constructor
      let project_name = this.nav.projectName
      let contract_code = this.nav.contract_code

      if (this.nav.type === 'projectName') project_name = this.nav.keyword
      if (this.nav.type === 'constructor') constructor = this.nav.keyword
      if (this.nav.type === 'contract_code') contract_code = this.nav.keyword


      let filterType = ''
      if (filterBegin || filterEnd) {
        filterType = 'complete_expected' //this.filterType = {start, complete_expected, complete}
      }

      await this.$store.dispatch('project/LOAD_PROJECT_LIST', {
        page,
        perPage,
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
      this.projectList = projectListInfo.data

    },
    // 글 상세페이지로 이동
    moveProjectDetail (_postId) {
      this.$router.push({path: `/project/${_postId}`})
    },

    changeListType (listType) {
      this.listType = listType
    },
    handleChangePerPage (_data) {
      if (this.perPage !== _data) {
        this.currentPage = 1
        this.perPage = _data
        this.loadProjectList()
      }
    },
    handleSearch () {
      this.currentPage = 1
      this.filterBegin = (this.nav.date[0]) ? this.nav.date[0] : this.filterBegin
      this.filterEnd = (this.nav.date[1]) ? this.nav.date[1] : this.filterEnd

      this.loadProjectList()
    },
    handleChangePage (_data) {
      if (this.currentPage !== _data) {
        this.currentPage = _data
        this.loadProjectList()
      }
    },
    handleItemClickDetail (_data) {
      this.moveProjectDetail(_data.id)
    },
    handleClickRegister () {
      this.showWrite = true
      //this.$router.push({ path: './project/create' })
    },

    async loadProjectGroup () {
      const page = 1, perPage = 10, keyword = ''
      await this.$store.dispatch('project/LOAD_PROJECT_GROUP', {
        page,
        perPage,
        keyword
      })
      const project_group = this.$store.state.project.projectGroup

      this.nav.projectGroupList = [{text:'전체', value:''}]
      for (const pg of project_group) {
        this.nav.projectGroupList.push({
          text:pg.name,
          value:pg.id
        })
      }
    },

  }
}
</script>

<style scoped>

</style>
