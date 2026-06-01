<template>
  <div>
    <!--  상단 검색바-->
    <search-nav class="mt-4" @handleSearch="handleSearch">
      <search-nav-item-date label="대상기간" v-model="nav.date" />
      <search-nav-item-keyword label="파트너사" v-model="nav.keyword" />
    </search-nav>


    <vs-row class="mb-8">
      <vs-col class="w-full flex " vs-justify="flex-end">
        <vs-button class="mr-4" color="secondary" type="border" @click="excelDownFunc">{{$t('button.Excel 다운로드')}}</vs-button>
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
                  @sort="handleSort">


          <template slot="thead">
            <vs-th sort-key="id" ><span class="w-full text-center">No.</span></vs-th>
            <vs-th sort-key="content$preview.project_title" ><span class="w-full text-center">현장명</span></vs-th>
            <vs-th sort-key="content$preview.s_check_date" ><span class="w-full text-center">기간(점검주)</span></vs-th>
            <vs-th ><span class="w-full text-center">점검실시</span></vs-th>
            <vs-th ><span class="w-full text-center">첨부파일</span></vs-th>
            <vs-th ><span class="w-full text-center">월간점검 실시여부</span></vs-th>
            <vs-th ><span class="w-full text-center">점검증빙</span></vs-th>
            <vs-th ><span class="w-full text-center">환경Issue</span></vs-th>
          </template>


          <template slot-scope="{data}">
            <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">

              <vs-td class="text-center">{{ tr.post_id }}</vs-td>
              <vs-td class="text-center">{{ getPreview(tr).project_title }}</vs-td>
              <vs-td class="text-center">{{ getPreview(tr).s_check_date }} ~ {{ getPreview(tr).e_check_date }}</vs-td>
              <vs-td class="text-center">점검실시?</vs-td>
              <vs-td class="text-center">
                <vs-icon v-if="getPreview(tr).attach_file.length>0" icon-pack="feather" icon="icon-file"/>
              </vs-td>
              <vs-td class="text-center">월간점검 실시여부?</vs-td>
              <vs-td class="text-center">점검증빙?</vs-td>
              <vs-td class="text-center">환경Issue?</vs-td>

            </vs-tr>
          </template>
        </vs-table>

        <div class="vs-con-table">
          <div class="con-pagination-table vs-table--pagination">
            <k-pagination
              :total="(lastPage) ? lastPage : 1"
              v-model="currentPage" @change="handleTableChangePage"></k-pagination>
          </div>
        </div>
      </vs-col>
    </vs-row>

    <popup-excel-download
      v-model="showExcelDownload"
      :list="excelList"
      title="환경점검모니터링"/>
  </div>
</template>

<script>
import DateSelector from '../../../../components/selector/DateSelector'
import SearchNav from '@/components/nav/SearchNav'
import SearchNavItemKeyword from '@/components/nav/SearchNavItemKeyword'
import SearchNavItemDate from '@/components/nav/SearchNavItemDate'
import SearchNavItemSelect from '@/components/nav/SearchNavItemSelect'
import PopupExcelDownload from '@/popup/PopupExcelDownload'
import KPagination from '@/components/kPagination/kPagination'

export default {
  name: 'MonitorCheck',
  components: {
    KPagination,
    SearchNavItemSelect,
    SearchNavItemDate,
    SearchNavItemKeyword,
    SearchNav,
    DateSelector,
    PopupExcelDownload
  },
  data () {
    return {
      // 검색 네비게이션
      nav: {
        date: ['', ''],
        keyword: '',
        dateTarget: 'created_at',
        orderTarget:'created_at',
        orderDirection:'desc'
      },

      showExcelDownload: false,
      rootPath: '', // 프로젝트의 rootPath
      lastPage: 1,
      currentPage: 1,
      table: {
        list: [],
        perPage: 10,
        keyword: ''
      },
      listAll: []
    }
  },
  computed: {
    excelList () {
      const list = []
      for (const data of this.listAll) {
        list.push({
          현장명: this.getPreview(data).project_title,
          점검일: this.getPreview(data).s_check_date + ' ~ ' + this.getPreview(data).e_check_date
          // 회의구분: this.getPreview(data).meetingType,
          // 회의일: this.getPreview(data).meetingDate,
          // 회의장소: this.getPreview(data).meetingPlace,
          // 작성일: data.created_at,
          // 결재상태: data.document_status.name
        })
      }

      return list
    }
  },
  created () {
    const paths = this.$route.path.split('/')
    this.rootPath = `/${paths[1]}/${paths[2]}`
    this.loadPostList()
  },
  methods: {
    async excelDownFunc () {
      await this.loadPostListAll()
      this.showExcelDownload = true
    },

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

      if (this.nav.keyword) keyword.push(this.nav.keyword)

      if (this.nav.dateTarget) dateTarget.push(this.nav.dateTarget)
      if (this.nav.date[0]) dateBegin.push(this.nav.date[0])
      if (this.nav.date[1]) dateEnd.push(this.nav.date[1])

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
      const perPage = 10000
      const keyword = []
      const dateTarget = []
      const dateBegin = []
      const dateEnd = []
      const orderTarget = this.nav.orderTarget
      const orderDirection = this.nav.orderDirection

      if (this.nav.keyword) keyword.push(this.nav.keyword)

      if (this.nav.dateTarget) dateTarget.push(this.nav.dateTarget)
      if (this.nav.date[0]) dateBegin.push(this.nav.date[0])
      if (this.nav.date[1]) dateEnd.push(this.nav.date[1])

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

    handleSort (key, type) {
      if (key) {
        this.nav.orderTarget = key
        this.nav.orderDirection = type
        this.loadPostList()
      }

    },


    handleSearch () {
      this.currentPage = 1
      this.loadPostList()
    },
    handleTableChangePage (page) {
      this.currentPage = page
      this.loadPostList()
    }
  }
}
</script>

<style scoped>

</style>
