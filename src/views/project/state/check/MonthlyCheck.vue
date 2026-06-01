<template>
  <div>

    <!--  상단 검색바-->
    <search-nav @handleSearch="handleSearch">
      <search-nav-item-select label="대상기간" v-model="nav.year" :list="nav.yearList" />년
      <search-nav-item-select v-model="nav.month" :list="nav.monthList" />월
      <search-nav-item-keyword class="ml-4" label="키워드" v-model="nav.keyword" />
    </search-nav>


    <vs-row class="mb-8">
      <vs-col class="w-full flex " vs-justify="flex-end">
        <vs-button class="mr-4" type="border" color="secondary" @click="excelDownFunc">{{$t('button.Excel 다운로드')}}</vs-button>
        <vs-button autocomplete class="mr-4" color="secondary" type="border" @click="handleClickApprovalLine">{{$t('button.결재선 지정')}}</vs-button>
        <vs-button autocomplete class="mr-4" color="secondary" @click="handleClickRegister">신규작성</vs-button>
      </vs-col>
    </vs-row>

    <vs-row>
      <vs-col>
        <vs-table stripe
                  ref="table"
                  :sst="true"
                  :max-items="table.perPage"
                  :data="table.list"
                  noDataText="데이터가 없습니다"
                  @sort="handleSort"
                  @selected="handleItemClickDetail">

          <template slot="thead">
            <vs-th sort-key="id" class="w-1/12"><span class="w-full text-center">No.</span></vs-th>
            <vs-th sort-key="content$preview.title" class="w-2/12"><span class="w-full text-center">제목</span></vs-th>
            <vs-th sort-key="content$preview.writer" class="w-1/12"><span class="w-full text-center">작성자</span></vs-th>
            <vs-th sort-key="content$preview.s_check_date" class="w-3/12"><span class="w-full text-center">실시일</span></vs-th>
            <vs-th sort-key="status" class="w-1/12"><span class="w-full text-center">결재상태</span></vs-th>
            <vs-th class="w-1/12"><span class="w-full text-center">첨부파일</span></vs-th>
          </template>

          <template slot-scope="{data}">
            <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">

              <vs-td class="text-center">{{ getContent(tr).id }}</vs-td>
              <vs-td class="text-center">{{ getPreview(tr).title }}</vs-td>
              <vs-td class="text-center">{{ getPreview(tr).writer }}</vs-td>
              <vs-td class="text-center">{{ getPreview(tr).s_check_date }} ~ {{ getPreview(tr).e_check_date }}</vs-td>
              <vs-td class="text-center">{{ tr.document_status.name }}</vs-td>
              <vs-td class="text-center">
                <a download target="_blank" :href="img.path" v-for="(img, index) in getPreview(tr).attach_file" :key="index" @click.stop>
                  <vs-icon icon-pack="feather" icon="icon-file"/>
                </a>
              </vs-td>

            </vs-tr>
          </template>

          <div class="vs-con-table">
            <div class="con-pagination-table vs-table--pagination">
              <k-pagination
                :total="(lastPage) ? lastPage : 1"
                v-model="currentPage" @change="handleTableChangePage"></k-pagination>
            </div>
          </div>

        </vs-table>
      </vs-col>
    </vs-row>

    <popup-approval-process
      :show-popup="showApprovalLinePopup"
      @closePopup="handleCloseApprovalPopup" />

    <popup-excel-download
      v-model="showExcelDownload"
      :list="excelList"
      title="환경실적_월간점검"/>

  </div>
</template>

<script>
import SearchNav from '@/components/nav/SearchNav'
import SearchNavItemKeyword from '@/components/nav/SearchNavItemKeyword'
import PopupApprovalProcess from '@/views/approval/PopupApprovalProcess'
import PopupExcelDownload from '@/popup/PopupExcelDownload'
import SearchNavItemDate from '@/components/nav/SearchNavItemDate'
import SearchNavItemSelect from '@/components/nav/SearchNavItemSelect'
import KPagination from '@/components/kPagination/kPagination'

export default {
  name: 'MonthlyCheck',
  components: {
    KPagination,
    SearchNavItemSelect,
    SearchNavItemDate,
    PopupExcelDownload,
    PopupApprovalProcess,
    SearchNavItemKeyword,
    SearchNav
  },

  computed: {
    excelList () {
      const list = []
      if (this.listAll) {
        for (const data of this.listAll) {
          list.push({
            'No.': this.getContent(data).id,
            '제목': this.getPreview(data).title,
            '작성자': this.getPreview(data).writer,
            '실시일': `${this.getPreview(data).s_check_date } ~ ${ this.getPreview(data).e_check_date}`,
            '결재상태': data.document_status.name,

          })
        }
      }
      return list
    }
  },

  data () {
    return {
      // 검색 네비게이션
      nav: {
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
        dateTarget: 'content$preview.s_check_date',
        orderTarget:'created_at',
        orderDirection:'desc'
      },
      showApprovalLinePopup: false,
      rootPath: '', // 프로젝트의 rootPath
      lastPage: 1,
      currentPage: 1,
      table: {
        list: [],
        perPage: 10,
        keyword: ''
      },
      showExcelDownload: false,
      listAll: []
    }
  },
  created () {
    let nowYear = new Date().getFullYear()
    this.nav.yearList.push({text:'전체',  value:''})
    for (let i = 0; i < 50; i++) {
      this.nav.yearList.push({text:`${nowYear}`,  value:nowYear})
      nowYear--
    }
    //this.nav.year = new Date().getFullYear()

    const paths = this.$route.path.split('/')
    this.rootPath = `/${paths[1]}/${paths[2]}`
    this.loadPostList()
  },


  methods: {

    async loadPostList () {
      const projectId = this.$route.params.proj_id
      const boardSlug = 'environment_check_monthly' //(id:29)
      const page = this.currentPage
      const perPage = this.table.perPage
      const keyword = []
      const orderTarget = this.nav.orderTarget
      const orderDirection = this.nav.orderDirection

      if (this.nav.keyword) keyword.push(this.nav.keyword)

      const year = this.nav.year
      const month = this.nav.month
      const dateTarget = []
      const dateBegin = []
      const dateEnd = []

      if (this.nav.dateTarget) dateTarget.push(this.nav.dateTarget)
      if (year && month) dateBegin.push(this.getFirstDateWithSearchDate(year, month))
      if (year && month) dateEnd.push(this.getLastDateWithSearchDate(year, month))

      await this.$store.dispatch('approval/LOAD_POST_ALL', {
        projectId,
        boardSlug,
        page,
        perPage,
        keyword,
        dateTarget, dateBegin, dateEnd,
        orderTarget, orderDirection
      })

      this.table.list = this.$store.state.approval.list
      const listInfo = this.$store.state.approval.postListInfo
      this.currentPage = listInfo.current_page
      this.lastPage = listInfo.last_page

    },

    async loadPostListAll () {
      const projectId = this.$route.params.proj_id
      const boardSlug = 'environment_check_monthly'
      const page = 1
      const perPage = 10000
      const keyword = []
      const orderTarget = this.nav.orderTarget
      const orderDirection = this.nav.orderDirection

      if (this.nav.keyword) keyword.push(this.nav.keyword)

      const year = this.nav.year
      const month = this.nav.month
      const dateTarget = []
      const dateBegin = []
      const dateEnd = []

      if (this.nav.dateTarget) dateTarget.push(this.nav.dateTarget)
      if (year && month) dateBegin.push(this.getFirstDateWithSearchDate(year, month))
      if (year && month) dateEnd.push(this.getLastDateWithSearchDate(year, month))

      await this.$store.dispatch('approval/LOAD_POST_ALL', {
        projectId,
        boardSlug,
        page,
        perPage,
        keyword,
        dateTarget, dateBegin, dateEnd,
        orderTarget, orderDirection
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

    getContent (data) {
      if (data.post) {
        const content = data.post
        return content
      }
    },


    handleSearch () {
      this.currentPage = 1
      this.loadPostList()
    },
    handleTableChangePage (page) {
      this.currentPage = page
      this.loadPostList()
    },
    handleClickRegister () {
      this.$emit('handleClickRegister', 'monthly')
    },
    handleChangePage (page) {
      this.currentPage = page
      this.loadPostList()
    },

    handleClickApprovalLine () {
      this.showApprovalLinePopup = true
    },

    handleCloseApprovalPopup () {
      this.showApprovalLinePopup = false
    },

    handleItemClickDetail (data) {
      this.$router.push({path: `${this.rootPath}/state/check/monthly/${data.post_id}`})
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
    },

    async excelDownFunc () {
      await this.loadPostListAll()
      this.showExcelDownload = true
    }
  }
}
</script>

<style scoped>

</style>
