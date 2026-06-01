<template>
  <div>
    <search-nav @handleSearch="handleSearch">
      <search-nav-item-date :label="$t('search.대상기간')" v-model="nav.date"/>
      <search-nav-item-keyword label="소속" v-model="nav.company"/>
      <search-nav-item-project :label="$t('search.현장명')" v-model="nav.projectId"/>
    </search-nav>

    <vs-row class="mb-4">
      <vs-col class="flex" vs-justify="flex-end">
        <vs-button class="mr-2" type="border" color="secondary" @click="excelDownFunc">{{ $t('button.Excel 다운로드') }}
        </vs-button>
      </vs-col>
    </vs-row>

    <vs-row>
      <vs-col>
        <vs-table stripe
                  ref="table"
                  :sst="true"
                  :max-items="table.perPage"
                  :data="table.list"
                  noDataText="'대상기간' 을 선택하거나, 키워드 검색을 진행하여 주세요."

                  @sort="handleSort"
                  @selected="handleItemClickDetailBlank"
        >

          <template slot="thead">
            <vs-th sort-key="id"><vs-col vs-type="flex" vs-justify="center">No.</vs-col></vs-th>
            <vs-th sort-key="content$preview.title"><vs-col vs-type="flex" vs-justify="center">현장명</vs-col></vs-th>
            <vs-th sort-key="content$preview.processType"><vs-col vs-type="flex" vs-justify="center">공종명</vs-col></vs-th>
            <vs-th ><vs-col vs-type="flex" vs-justify="center">대상기간</vs-col></vs-th>
            <vs-th sort-key="created_at"><vs-col vs-type="flex" vs-justify="center">작성일</vs-col></vs-th>
            <vs-th sort-key="content$preview.writer"><vs-col vs-type="flex" vs-justify="center">작성자</vs-col></vs-th>
            <vs-th sort-key="status"><vs-col vs-type="flex" vs-justify="center">결재상태</vs-col></vs-th>
            <vs-th ><vs-col vs-type="flex" vs-justify="center">보기</vs-col></vs-th>
          </template>

          <template slot-scope="{data}">
            <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
              <vs-td class="text-center">{{ getNo(indextr) }}</vs-td>
              <vs-td class="text-center">{{ getPreview(tr).title }}</vs-td>
              <vs-td class="text-center">{{ getPreview(tr).processType }}</vs-td>
              <vs-td class="text-center">{{ getPreview(tr).begin_ymd }} ~ {{ getPreview(tr).end_ymd }}</vs-td>
              <vs-td class="text-center">{{ (getContent(tr).created_at) ? getContent(tr).created_at.substr(0, 10) : '' }}</vs-td>
              <vs-td class="text-center">{{ getPreview(tr).writer }}</vs-td>
              <vs-td class="text-center">{{ tr.document_status.name }}</vs-td>
              <vs-td class="text-center">
                <div class="flex justify-center">
                  <vs-button type="border" icon="open_in_new" class="mr-1" @click.stop @click="()=>{handleItemClickDetailBlank(tr)}"></vs-button>
                  <vs-button type="border" @click.stop @click="()=>{handleItemClickDetail(tr)}">{{$t('button.바로가기')}}</vs-button>
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
      title="정기 위험성평가"/>
  </div>
</template>

<script>
import SearchNav from '@/components/nav/SearchNav'
import SearchNavItemKeyword from '@/components/nav/SearchNavItemKeyword'
import SearchNavItemDate from '@/components/nav/SearchNavItemDate'
import PopupExcelDownload from '@/popup/PopupExcelDownload'
import PopupApprovalProcess from '@/views/approval/PopupApprovalProcess'
import KPagination from '@/components/kPagination/kPagination'
import SearchNavItemProject from '@/components/nav/SearchNavItemProject'
import SearchNavItemCompany from '@/components/nav/SearchNavItemCompany'

export default {
  name: 'RiskAssessmentAlwaysRisk',
  components: {
    SearchNavItemCompany,
    SearchNavItemProject,
    KPagination,
    PopupApprovalProcess,
    PopupExcelDownload,
    SearchNavItemDate,
    SearchNavItemKeyword,
    SearchNav
  },
  data () {
    return {
      // 검색 네비게이션
      nav: {
        date: ['', ''],
        orderNum: '',
        projectId: '',
        company: '',
        dateTarget: 'created_at',
        orderTarget: 'created_at',
        orderDirection: 'desc'
      },

      // approvalLine
      approvalLine: [],
      showApprovalLinePopup: false,
      showExcelDownload: false,
      listAll: [],

      currentPage: 1,
      lastPage: 1,
      total: 0,

      table: {
        list: [],
        perPage: 12,
        keyword: ''
      }
    }
  },

  computed: {
    excelList () {
      const list = []
      for (const data of this.listAll) {
        list.push({
          현장명: this.getPreview(data).title,
          소속: this.getPreview(data).company,
          대상공종: this.getPreview(data).processType,
          차수: this.getPreview(data).orderNumber,
          작성일: this.getContent(data).created_at.substr(0, 10),
          작성자: this.getPreview(data).writer,
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
      const projectId = this.nav.projectId
      const boardSlug = 'always_risk' // always_risk(id:41)
      const page = this.currentPage
      const perPage = this.table.perPage
      const keyword = []
      const dateTarget = []
      const dateBegin = []
      const dateEnd = []
      const orderTarget = this.nav.orderTarget
      const orderDirection = this.nav.orderDirection

      if (this.nav.keyword) keyword.push(this.nav.keyword)
      if (this.nav.company) keyword.push(`content$preview.company*%${this.nav.company}%`)
      if (this.nav.orderNum) keyword.push(`contentd$preview.orderNumber*${this.nav.orderNum}`)

      if (this.nav.dateTarget) dateTarget.push(this.nav.dateTarget)
      if (this.nav.date[0]) dateBegin.push(this.nav.date[0])
      if (this.nav.date[1]) dateEnd.push(this.nav.date[1])

      await this.$store.dispatch('approval/LOAD_POST_ALL', {
        projectId,
        boardSlug,
        page,
        perPage,
        dateTarget,
        dateBegin,
        dateEnd,
        orderTarget,
        orderDirection,
        keyword
      })

      this.table.list = this.$store.state.approval.list
      const listInfo = this.$store.state.approval.postListInfo
      this.currentPage = listInfo.current_page
      this.lastPage = listInfo.last_page
      this.total = listInfo.total

    },

    async loadPostListAll () {
      const projectId = this.nav.projectId
      const boardSlug = 'always_risk'
      const page = 1
      const perPage = 10000
      const keyword = []
      const dateTarget = []
      const dateBegin = []
      const dateEnd = []
      const orderTarget = this.nav.orderTarget
      const orderDirection = this.nav.orderDirection
      if (this.nav.keyword) keyword.push(this.nav.keyword)
      if (this.nav.company) keyword.push(`content$preview.company*%${this.nav.company}%`)
      if (this.nav.orderNum) keyword.push(`contentd$preview.orderNumber*${this.nav.orderNum}`)

      if (this.nav.dateTarget) dateTarget.push(this.nav.dateTarget)
      if (this.nav.date[0]) dateBegin.push(this.nav.date[0])
      if (this.nav.date[1]) dateEnd.push(this.nav.date[1])

      await this.$store.dispatch('approval/LOAD_POST_ALL', {
        projectId,
        boardSlug,
        page,
        perPage,
        dateTarget,
        dateBegin,
        dateEnd,
        orderTarget,
        orderDirection,
        keyword
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

    handleSearch () {
      this.currentPage = 1
      this.loadPostList()
    },

    handleClickRegister () {
      this.$emit('handleClickRegister', 'always')
    },
    handleItemClickDetail (data) {
      if (data.post) {
        this.$router.push(`/project/${data.post.project_id}/risk/assessment/always/${data.post.id}`)
      }
    },
    handleItemClickDetailBlank (data) {
      if (data.post) {
        const routeData = this.$router.resolve(`/project/${data.post.project_id}/risk/assessment/always/${data.post.id}`)
        window.open(routeData.href, '_blank')
      }
    },

    handleSort (key, type) {
      if (key) {
        this.nav.orderTarget = key
        this.nav.orderDirection = type
        this.loadPostList()
      }
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
