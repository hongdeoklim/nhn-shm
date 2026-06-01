<template>
<div class="" style="height:900px !important;">

  <search-nav class="mt-4" @handleSearch="handleSearch">
    <search-nav-item-date label="회의일" v-model="nav.date" @handleSearch="handleSearch"/>
    <search-nav-item-keyword label="키워드" v-model="nav.keyword" @keyupEvent="handleSearch"/>
  </search-nav>

  <vs-row class="mb-4">
    <vs-col class="flex" vs-justify="flex-end">
      <vs-button class="mr-2" type="border" color="secondary" @click="excelDownFunc">{{$t('button.Excel 다운로드')}}</vs-button>
      <vs-button class="mr-2" type="border" color="secondary" @click="handleClickApprovalLine">{{$t('button.결재선 지정')}}</vs-button>
      <vs-button color="secondary" @click="handleClickRegister">신규작성</vs-button>
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
                @selected="handleItemClickDetail"
      >

        <template slot="thead">
          <vs-th sort-key="id" class="w-1/12" ><span class="w-full text-center">No.</span></vs-th>
          <vs-th sort-key="content$preview.title" class="w-3/12" ><span class="w-full text-center">현장명</span></vs-th>
          <vs-th sort-key="content$preview.meetingDate" class="w-2/12" ><span class="w-full text-center">회의일</span></vs-th>
          <vs-th sort-key="content$preview.meetingPlace" class="w-2/12" ><span class="w-full text-center">회의장소</span></vs-th>
          <vs-th sort-key="created_at" class="w-2/12" ><span class="w-full text-center">작성일</span></vs-th>
          <vs-th sort-key="status" class="w-1/12" ><span class="w-full text-center">결재상태</span></vs-th>
        </template>

        <template slot-scope="{data}">
          <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">

            <vs-td class="text-center">{{ getNo(indextr) }}</vs-td>
            <vs-td class="text-center">{{ getPreview(tr).title }}</vs-td>
            <vs-td class="text-center">{{ getPreview(tr).meetingDate }}</vs-td>
            <vs-td class="text-center">{{ getPreview(tr).meetingPlace }}</vs-td>
            <vs-td class="text-center">{{ getContent(tr).created_at.substr(0, 10) }}</vs-td>
            <vs-td class="text-center">{{ tr.document_status.name }}</vs-td>

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
    @closePopup="handleCloseApprovalPopup" />

  <popup-excel-download
    v-model="showExcelDownload"
    :list="excelList"
    title="위험성평가협의회"/>

</div>
</template>

<script>
import PopupApprovalProcess from '@/views/approval/PopupApprovalProcess'
import PopupExcelDownload from '@/popup/PopupExcelDownload'
import SearchNav from '@/components/nav/SearchNav'
import SearchNavItemDate from '@/components/nav/SearchNavItemDate'
import SearchNavItemKeyword from '@/components/nav/SearchNavItemKeyword'
import KPagination from '@/components/kPagination/kPagination'

export default {
  name: 'RiskConferenceWarning',
  components: {
    KPagination,
    SearchNavItemKeyword,
    SearchNavItemDate,
    SearchNav,
    PopupExcelDownload,
    PopupApprovalProcess},
  data () {
    return {
      // 검색 네비게이션
      nav: {
        date: ['', ''],
        keyword: '',
        dateTarget:'content$preview.meetingDate',
        orderTarget:'created_at',
        orderDirection:'desc'
      },

      // approvalLine
      approvalLine: [],
      showApprovalLinePopup: false,
      showExcelDownload: false,

      rootPath: '', // 프로젝트의 rootPath
      lastPage: 1,
      currentPage: 1,
      total: 0,
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
          현장명: this.getPreview(data).title,
          회의구분: this.getPreview(data).meetingType,
          회의일: this.getPreview(data).meetingDate,
          회의장소: this.getPreview(data).meetingPlace,
          작성일: this.getContent(data).created_at,
          결재상태: data.document_status.name
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

    getNo (index) {
      return this.total - (((this.currentPage - 1) * this.table.perPage) + index)
    },
    async loadPostList () {
      const projectId = this.$route.params.proj_id
      const boardSlug = 'risk_evaluation_association' // risk_evaluation_association(id:8)
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

      if (this.nav.keyword) {
        keyword.push(this.nav.keyword)
      }

      await this.$store.dispatch('approval/LOAD_POST_ALL', {projectId, boardSlug, page, perPage, keyword, dateTarget, dateBegin, dateEnd, orderTarget, orderDirection})

      this.table.list = this.$store.state.approval.list
      const listInfo = this.$store.state.approval.postListInfo
      this.currentPage = listInfo.current_page
      this.lastPage = listInfo.last_page
      this.total = listInfo.total

    },

    async loadPostListAll () {
      const projectId = this.$route.params.proj_id
      const boardSlug = 'risk_evaluation_association'
      const page = 1
      const perPage = 10000
      const keyword = []
      const dateTarget = []
      const dateBegin = []
      const dateEnd = []
      const orderTarget = this.nav.orderTarget
      const orderDirection = this.nav.orderDirection

      if (this.nav.dateTarget) dateTarget.push(this.nav.dateTarget)
      if (this.nav.date[0]) dateBegin.push(this.nav.date[0])
      if (this.nav.date[1]) dateEnd.push(this.nav.date[1])

      if (this.nav.keyword) {
        keyword.push(this.nav.keyword)
      }

      await this.$store.dispatch('approval/LOAD_POST_ALL', {projectId, boardSlug, page, perPage, keyword, dateTarget, dateBegin, dateEnd, orderTarget, orderDirection})
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

    handleItemClickDetail (data) {
      this.$router.push({path: `${this.rootPath}/risk/conference/warning/${data.post_id}`})
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

    async excelDownFunc () {
      await this.loadPostListAll()
      this.showExcelDownload = true
    },
    handleClickApprovalLine () {
      this.showApprovalLinePopup = true
    },
    handleCloseApprovalPopup () {
      this.showApprovalLinePopup = false
    },

    handleClickRegister () {
      this.$emit('handleClickRegister', 'warning')
    },

    handleChangePage (page) {
      this.currentPage = page
      this.loadPostList()
    }
  }
}
</script>

<style scoped>

</style>
