<template>
  <div>

    <search-nav @handleSearch="handleSearch">
      <search-nav-item-select label="대상기간" v-model="nav.year" :list="nav.yearList" />년
      <search-nav-item-select v-model="nav.month" :list="nav.monthList" /><span class="mr-6" >월</span>
    </search-nav>

    <div class="w-full text-right mb-4">
      <vs-button class="mr-4" color="secondary" type="border" @click="excelDownFunc">{{$t('button.Excel 다운로드')}}</vs-button>
      <vs-button class="mr-4" color="secondary" type="border" @click="handleClickApprovalLine">{{$t('button.결재선 지정')}}</vs-button>
      <vs-button class="" color="secondary" type="border" @click="handleClickRegister">신규작성</vs-button>
    </div>

    <template-list-normal
      class="mb-6"
      :title="projectTitle"
      :list="list"
      :enablePerPageDropDown="false"
      :perPage="Number(perPage)"
      :currentPage="currentPage"
      :lastPage="lastPage"

      @sort="sort"
      @handleChangePerPage="handleChangePerPage"
      @handleItemClickDetail="handleItemClickDetail"
      @handleChangePage="handleChangePage"
      @handleClickRegister="handleClickRegister">
    </template-list-normal>

    <popup-approval-process
      v-model="approvalLine"
      :show-popup="showApprovalLinePopup"
      @closePopup="handleCloseApprovalPopup"/>

    <popup-excel-download
      v-model="showExcelDownload"
      :list="excelList"
      title="안전·보건예산 현황"/>
  </div>
</template>

<script>
import TemplateListNormal from '@/views/project/report/template/TemplateListNormal'
import SearchNav from '@/components/nav/SearchNav'
import SearchNavItemKeyword from '@/components/nav/SearchNavItemKeyword'
import SearchNavItemDate from '@/components/nav/SearchNavItemDate'
import PopupApprovalProcess from '@/views/approval/PopupApprovalProcess'
import PopupExcelDownload from '@/popup/PopupExcelDownload'
import SearchNavItemSelect from '@/components/nav/SearchNavItemSelect'

export default {
  name: 'Report',
  components: {
    SearchNavItemSelect,
    PopupExcelDownload,
    PopupApprovalProcess,
    SearchNavItemDate,
    SearchNavItemKeyword,
    SearchNav,
    TemplateListNormal
  },
  data () {
    return {
      // 검색 네비게이션
      nav: {
        date: ['', ''],
        dateTarget:'created_at',
        orderTarget:'created_at',
        orderDirection:'desc',
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
      },

      // approvalLine
      approvalLine: [],
      showApprovalLinePopup: false,
      showExcelDownload: false,

      rootPath: '', // 프로젝트의 rootPath

      viewTypeCode: 'normal',
      perPageOption: '10,20,30',
      projectTitle: '',
      list: [],
      listAll: [],

      //pagination
      perPage: 10,
      currentPage: 1,
      lastPage: 1
    }
  },

  computed: {
    excelList () {
      const list = []
      for (const data of this.listAll) {
        list.push({
          현장명: this.getProjectPrev(data).title,
          작성자: data.user.name,
          작성일: data.created_at.substring(0, 10),
          결재상태: data.document_status.name,
          사업금액: this.getProjectPrev(data).work_money_amount
        })
      }
      return list
    }
  },

  created () {
    const paths = this.$route.path.split('/')
    this.rootPath = `/${paths[1]}/${paths[2]}`

    let nowYear = new Date().getFullYear()
    this.nav.yearList.push({text:'전체',  value:''})
    for (let i = 0; i < 50; i++) {
      this.nav.yearList.push({text:`${nowYear}`,  value:nowYear})
      nowYear--
    }

    this.loadPostList()
  },

  methods: {

    async loadPostList () {
      const projectId = this.$route.params.proj_id
      const boardSlug = 'project_monthly_report' // project_monthly_report (id:3)
      const page = this.currentPage
      const perPage = this.perPage
      const orderTarget = this.nav.orderTarget
      const orderDirection = this.nav.orderDirection
      const year = this.nav.year
      const month = this.nav.month
      const keyword = []
      if (year) keyword.push(`content$project_date_year*${year}`)
      if (month) keyword.push(`content$project_date_month*${month}`)


      await this.$store.dispatch('approval/LOAD_POST_ALL', {
        boardSlug,
        projectId,
        page,
        perPage,
        keyword,
        orderTarget,
        orderDirection
      })

      this.list = this.$store.state.approval.list
      const listInfo = this.$store.state.approval.postListInfo
      this.currentPage = listInfo.current_page
      this.lastPage = listInfo.last_page

    },

    async loadPostListAll () {
      const projectId = this.$route.params.proj_id
      const boardSlug = 'project_monthly_report'
      const page = 1
      const perPage = 10000
      const dateTarget = []
      const dateBegin = []
      const dateEnd = []
      const orderTarget = this.nav.orderTarget
      const orderDirection = this.nav.orderDirection

      if (this.nav.dateTarget) dateTarget.push(this.nav.dateTarget)
      if (this.nav.date[0]) dateBegin.push(this.nav.date[0])
      if (this.nav.date[1]) dateEnd.push(this.nav.date[1])

      await this.$store.dispatch('approval/LOAD_POST_ALL', {
        boardSlug,
        projectId,
        page,
        perPage,
        dateTarget,
        dateBegin,
        dateEnd,
        orderTarget,
        orderDirection
      })
      this.listAll = JSON.parse(JSON.stringify(this.$store.state.approval.list))
      await this.loadPostList()
    },

    async excelDownFunc () {
      await this.loadPostListAll()
      this.showExcelDownload = true
    },

    getProjectPrev (data) {
      if (data.post.preview) {
        const preview = JSON.parse(data.post.preview)
        return preview
      }

      return ''
    },

    // 글 상세페이지로 이동
    moveProjectDetail (_postId) {
      const boardSlug = 'project_monthly_report'
      const postId = _postId
      this.$router.push({name:'write|approval_update', params:{boardSlug, postId}})
    },

    sort (sort) {
      this.nav.orderTarget = sort.orderTarget
      this.nav.orderDirection = sort.orderDirection
      this.loadPostList()
    },

    handleChangePerPage (_data) {
      if (this.perPage !== _data) {
        this.currentPage = 1
        this.perPage = _data
        this.loadPostList()
      }
    },
    handleSearch () {
      this.currentPage = 1
      this.loadPostList()
    },
    handleChangePage (_data) {
      if (this.currentPage !== _data) {
        this.currentPage = _data
        this.loadPostList()
      }
    },
    handleItemClickDetail (_data) {
      this.moveProjectDetail(_data.post_id)
    },
    handleClickRegister () {
      const boardSlug = 'project_monthly_report'
      this.$router.push({name:'write|approval_create', params:{boardSlug}})
    },
    handleClickApprovalLine () {
      this.showApprovalLinePopup = true
    },
    handleCloseApprovalPopup () {
      this.showApprovalLinePopup = false
    }
  }
}
</script>

<style scoped>

</style>
