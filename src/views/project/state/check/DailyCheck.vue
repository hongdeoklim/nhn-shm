<template>
  <div>

    <!--  상단 검색바-->
    <search-nav @handleSearch="handleSearch">
      <search-nav-item-date label="실시일" v-model="nav.date" />
      <search-nav-item-keyword label="키워드" v-model="nav.keyword" />
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
            <vs-th sort-key="content$preview.s_check_date" class="w-2/12"><span class="w-full text-center">실시일</span></vs-th>
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
      title="환경실적_환경일일점검"/>

  </div>
</template>

<script>
import SearchNav from '@/components/nav/SearchNav'
import SearchNavItemKeyword from '@/components/nav/SearchNavItemKeyword'
import PopupApprovalProcess from '@/views/approval/PopupApprovalProcess'
import PopupExcelDownload from '@/popup/PopupExcelDownload'
import SearchNavItemDate from '@/components/nav/SearchNavItemDate'
import KPagination from '@/components/kPagination/kPagination'

export default {
  name: 'DailyCheck',
  components: {
    KPagination,
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
        keyword: '',
        dateTarget:'content$preview.s_check_date',
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
    const paths = this.$route.path.split('/')
    this.rootPath = `/${paths[1]}/${paths[2]}`
    this.loadPostList()
  },


  methods: {

    async loadPostList () {
      const projectId = this.$route.params.proj_id
      const boardSlug = 'environment_check_daily' //(id:28)
      const page = this.currentPage
      const perPage = this.table.perPage
      const keyword = []
      const dateTarget = []
      const dateBegin = []
      const dateEnd = []
      const orderTarget = this.nav.orderTarget
      const orderDirection = this.nav.orderDirection

      if (this.nav.dateTarget) dateTarget.push(this.nav.dateTarget)
      if (this.nav.date[0]) dateBegin.push(this.nav.date[0])
      if (this.nav.date[1]) dateEnd.push(this.nav.date[1])
      if (this.nav.keyword) keyword.push(this.nav.keyword)

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
      const boardSlug = 'environment_check_daily'
      const page = 1
      const perPage = 1000000
      const keyword = []
      const dateTarget = []
      const dateBegin = []
      const dateEnd = []
      const orderTarget = this.nav.orderTarget
      const orderDirection = this.nav.orderDirection

      if (this.nav.dateTarget) dateTarget.push(this.nav.dateTarget)
      if (this.nav.date[0]) dateBegin.push(this.nav.date[0])
      if (this.nav.date[1]) dateEnd.push(this.nav.date[1])
      if (this.nav.keyword) keyword.push(this.nav.keyword)

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
      this.$emit('handleClickRegister', 'daily')
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
      this.$router.push({path: `${this.rootPath}/state/check/daily/${data.post_id}`})
    },

    handleSort (key, type) {
      if (key) {
        this.nav.orderTarget = key
        this.nav.orderDirection = type
        this.loadPostList()
      }

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
