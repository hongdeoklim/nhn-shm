<template>
  <div class="w-full">
    <!--  상단 검색바-->
    <search-nav @handleSearch="handleSearch">
      <search-nav-item-select :label="$t('search.대상기간')" v-model="nav.year" :list="nav.yearList" />년
      <search-nav-item-select v-model="nav.month" :list="nav.monthList" />월
      <search-nav-item-project class="ml-4" :label="$t('search.현장명')" v-model="nav.projectId" />
    </search-nav>

    <div class="w-full text-right mb-4">
      <vs-button class="mr-4" color="secondary" type="border" @click="excelDownFunc">{{$t('button.Excel 다운로드')}}</vs-button>
    </div>

    <vs-row>
      <vs-col>
        <vs-table stripe
                  ref="table"
                  :sst="true"
                  :max-items="perPage"
                  :data="list"
                  noDataText="데이터가 없습니다"
                  @sort="handleSort"
                  @selected="handleItemClickDetailBlank">

          <template slot="thead">
            <vs-th sort-key="id"><span class="w-full text-center">{{$t('content.safety.supplies.apply.column.No')}}</span></vs-th>
            <vs-th sort-key="content$preview.project_title" ><span class="w-full text-center">{{$t('content.safety.supplies.apply.column.현장명')}}</span></vs-th>
            <vs-th sort-key="post_title" ><span class="w-full text-center">{{$t('content.safety.supplies.apply.column.제목')}}</span></vs-th>
            <vs-th sort-key="content$writer" ><span class="w-full text-center">{{$t('content.safety.supplies.apply.column.작성자')}}</span></vs-th>
            <vs-th sort-key="created_at" ><span class="w-full text-center">{{$t('content.safety.supplies.apply.column.작성일')}}</span></vs-th>
            <vs-th sort-key="status" ><span class="w-full text-center">{{$t('content.safety.supplies.apply.column.결재상태')}}</span></vs-th>
            <vs-th ><span class="w-full text-center">{{$t('content.safety.supplies.apply.column.첨부파일')}}</span></vs-th>
            <vs-th style="width: 200px !important; display: inline-block;"><vs-col vs-type="flex" vs-justify="center">{{$t('content.safety.supplies.apply.column.보기')}}</vs-col></vs-th>

          </template>


          <template slot-scope="{data}">
            <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">

              <vs-td class="text-center">{{ tr.post_id }}</vs-td>
              <vs-td class="text-center">{{ getPreview(tr).project_title }}</vs-td>
              <vs-td class="text-center">{{ getContents(tr).title }}</vs-td>
              <vs-td class="text-center">{{ getContents(tr).writer }}</vs-td>
              <vs-td class="text-center">{{ tr.post.created_at }}</vs-td>
              <vs-td class="text-center">{{ tr.document_status.name }}</vs-td>
              <vs-td class="text-center">
                <a download target="_blank" :href="img.path" v-for="(img, index) in getPreview(tr).attach" :key="index" @click.stop>
                  <vs-icon icon-pack="feather" icon="icon-file"/>
                </a>
              </vs-td>
              <vs-td class="text-center">
                <div class="flex justify-center">
                  <vs-button type="border" icon="open_in_new" class="mr-1" @click="()=>{handleItemClickDetailBlank(tr)}"></vs-button>
                  <vs-button type="border" @click.stop="()=>{handleItemClickDetail(tr)}">{{$t('button.바로가기')}}</vs-button>
                </div>
              </vs-td>
            </vs-tr>
          </template>
        </vs-table>

        <div class="vs-con-table">
          <div class="con-pagination-table vs-table--pagination">
            <k-pagination
              :total="(lastPage) ? lastPage : 1"
              v-model="currentPage" @change="handleChangePage"></k-pagination>
          </div>
        </div>
      </vs-col>
    </vs-row>

    <popup-approval-process
      v-model="approvalLine"
      :show-popup="showApprovalLinePopup"
      @closePopup="handleCloseApprovalPopup"/>

    <popup-excel-download
      v-model="showExcelDownload"
      :list="excelList"
      title="안전용품 현황"/>
  </div>
</template>

<script>
import SearchNav from '@/components/nav/SearchNav'
import SearchNavItemDate from '@/components/nav/SearchNavItemDate'
import SearchNavItemKeyword from '@/components/nav/SearchNavItemKeyword'
import PopupExcelDownload from '@/popup/PopupExcelDownload'
import PopupApprovalProcess from '@/views/approval/PopupApprovalProcess'
import KPagination from '@/components/kPagination/kPagination'
import SearchNavItemProject from '@/components/nav/SearchNavItemProject'
import SearchNavItemSelect from '@/components/nav/SearchNavItemSelect'

export default {
  name: 'Supplies',
  components: {
    SearchNavItemSelect,
    SearchNavItemProject,
    KPagination,
    PopupApprovalProcess,
    PopupExcelDownload,
    SearchNavItemKeyword,
    SearchNavItemDate,
    SearchNav
  },

  computed: {
    excelList () {
      const list = []
      for (const data of this.listAll) {
        list.push({
          'No.': data.id,
          '현장명': this.getPreview(data).project_title,
          '제목': this.getContents(data).title,
          '작성자': data.user.name,
          '작성일': data.created_at,
          '결재상태': data.document_status.name
        })
      }
      return list
    }
  },

  data () {
    return {
      // 검색 네비게이션
      nav: {
        projectId: '',
        date: ['', ''],
        year: '',
        yearList:[],
        month: '',
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
        keyword: '',
        dateTarget:'created_at',
        orderTarget:'created_at',
        orderDirection:'desc'
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
      const projectId = this.nav.projectId
      const boardSlug = 'safety_supplies'
      const page = this.currentPage
      const perPage = this.perPage
      const year = this.nav.year
      const month = this.nav.month
      const dateTarget = []
      const dateBegin = []
      const dateEnd = []

      if (this.nav.dateTarget) dateTarget.push(this.nav.dateTarget)
      if (year && month) dateBegin.push(this.getFirstDateWithSearchDate(year, month))
      if (year && month) dateEnd.push(this.getLastDateWithSearchDate(year, month))

      const orderTarget = this.nav.orderTarget
      const orderDirection = this.nav.orderDirection

      const keyword = []
      if (this.nav.keyword) keyword.push(this.nav.keyword)

      await this.$store.dispatch('approval/LOAD_POST_ALL', {
        projectId,
        boardSlug,
        page,
        perPage,
        dateTarget,
        dateBegin,
        dateEnd,
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
      const projectId = this.nav.projectId
      const boardSlug = 'safety_supplies'
      const page = 1
      const perPage = 10000
      const year = this.nav.year
      const month = this.nav.month
      const dateTarget = []
      const dateBegin = []
      const dateEnd = []
      const keyword = this.nav.keyword
      const orderTarget = this.nav.orderTarget
      const orderDirection = this.nav.orderDirection

      if (this.nav.dateTarget) dateTarget.push(this.nav.dateTarget)
      if (year && month) dateBegin.push(this.getFirstDateWithSearchDate(year, month))
      if (year && month) dateEnd.push(this.getLastDateWithSearchDate(year, month))
      await this.$store.dispatch('approval/LOAD_POST_ALL', {
        projectId,
        boardSlug,
        page,
        perPage,
        dateTarget,
        dateBegin,
        dateEnd,
        keyword,
        orderTarget,
        orderDirection
      })
      this.listAll = JSON.parse(JSON.stringify(this.$store.state.approval.list))
      await this.loadPostList()
    },

    getPreview (data) {
      if (data.post.preview) {
        const preview = JSON.parse(data.post.preview)
        return preview
      }
    },

    getContents (data) {
      if (data.post.preview) {
        const preview = JSON.parse(data.post.post_content)
        return preview
      }
    },
    async excelDownFunc () {
      await this.loadPostListAll()
      this.showExcelDownload = true
    },

    handleSearch () {
      this.currentPage = 1
      this.loadPostList()
    },
    handleClickApprovalLine () {
      this.showApprovalLinePopup = true
    },

    handleItemClickDetail (data) {
      if (data.post) {
        this.$router.push(`/project/${data.post.project_id}/safety/supplies/${data.post.id}`)
      }
    },
    handleItemClickDetailBlank (data) {
      if (data.post) {
        const routeData = this.$router.resolve(`/project/${data.post.project_id}/safety/supplies/${data.post.id}`)
        window.open(routeData.href, '_blank')
      }
    },

    handleClickRegister () {
      this.$router.push({path: `${this.rootPath}/safety/supplies/create`})
    },

    handleChangePage (page) {
      this.currentPage = page
      this.loadPostList()
    },
    handleCloseApprovalPopup () {
      this.showApprovalLinePopup = false
    },

    handleSort (key, type) {
      if (key) {
        this.nav.orderTarget = key
        this.nav.orderDirection = type
        this.loadPostList()
      }

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
    }
  }
}
</script>

<style scoped>

</style>
