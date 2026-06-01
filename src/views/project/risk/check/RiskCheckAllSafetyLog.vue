<template>
  <div>

    <search-nav @handleSearch="handleSearch">
      <search-nav-item-date label="점검일자" v-model="nav.date" />
      <search-nav-item-keyword label="키워드" v-model="nav.keyword" />
    </search-nav>

    <vs-row class="mb-4">
      <vs-col class="flex" vs-justify="flex-end">
        <vs-button class="mr-2" type="border" color="secondary" @click="excelDownFunc">{{$t('button.Excel 다운로드')}}</vs-button>
        <vs-button class="mr-2" type="border" color="secondary" @click="handleClickApprovalLine">{{$t('button.결재선 지정')}}</vs-button>
        <vs-button color="secondary" @click="handleClickRegister">신규작성</vs-button>
      </vs-col>
    </vs-row>

    <vs-row  class="mb-4">
      <vs-col>
        <vs-table
          class="mr-6 mb-4"

          ref="table"
          stripe
          :data="table.list"
          :sst="true"
          :max-items="table.perPage"
          color="success"
          noDataText="데이터가 없습니다"

          @sort="handleSort"
          @selected="handleItemClickDetail">

          <template slot="thead">
            <vs-th sort-key="id"><span class="w-full text-center">No.</span></vs-th>
            <vs-th sort-key="content$preview.title"><span class="w-full text-center">제목</span></vs-th>
            <vs-th sort-key="content$preview.checkDate"><span class="w-full text-center">점검일</span></vs-th>
            <vs-th sort-key="content$preview.writer"><span class="w-full text-center">작성자</span></vs-th>
            <vs-th sort-key="status"><span class="w-full text-center">결재상태</span></vs-th>
          </template>

          <template slot-scope="{data}">
            <vs-tr class="text-center" :data="tr" :key="indextr" v-for="(tr, indextr) in data">
              <vs-td>{{tr.post_id}}</vs-td>
              <vs-td>{{getPreview(tr).title}}</vs-td>
              <vs-td>{{getPreview(tr).checkDate}}</vs-td>
              <vs-td>{{getPreview(tr).writer}}</vs-td>
              <vs-td>{{tr.document_status.name}}</vs-td>

            </vs-tr>
          </template>
        </vs-table>
      </vs-col>
    </vs-row>

    <popup-approval-process
      :show-popup="showApprovalLinePopup"
      @closePopup="handleCloseApprovalPopup"/>

    <popup-excel-download
      v-model="showExcelDownload"
      :list="excelList"
      title="합동점검일지"/>

  </div>
</template>

<script>
import SearchNav from '@/components/nav/SearchNav'
import SearchNavItemDate from '@/components/nav/SearchNavItemDate'
import SearchNavItemSelect from '@/components/nav/SearchNavItemSelect'
import SearchNavItemKeyword from '@/components/nav/SearchNavItemKeyword'
import PopupApprovalProcess from '@/views/approval/PopupApprovalProcess'
import PopupExcelDownload from '@/popup/PopupExcelDownload'
export default {
  name: 'RiskCheckAllSafetyLog',
  components: {
    PopupExcelDownload,
    PopupApprovalProcess,
    SearchNavItemKeyword, SearchNavItemSelect, SearchNavItemDate, SearchNav},
  data () {
    return {
      // 검색 네비게이션
      nav:{
        date:['', ''],
        orderNum:'',
        keyword:'',
        dateTarget: 'content$preview.checkDate',
        orderTarget:'created_at',
        orderDirection:'desc'
      },

      currentPage: 1,
      lastPage: 1,

      rootPath: '', // 프로젝트의 rootPath
      postId: '',
      table: {
        list: [],
        perPage: 5,
        keyword: ''
      },

      listAll: [],
      showExcelDownload: false,
      showApprovalLinePopup: false
    }
  },

  computed: {
    excelList () {
      const list = []
      for (const data of this.listAll) {
        list.push({
          'No.': data.post_id,
          '제목': this.getPreview(data).title,
          '점검일': this.getPreview(data).checkDate,
          '작성자': this.getPreview(data).writer,
          '상태': data.document_status.name
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

    async loadPostList () {
      const projectId = this.$route.params.proj_id
      const boardSlug = 'joint_check_diary' // first_risk(id:6)
      const page = this.currentPage
      const perPage = this.table.perPage
      const orderTarget = this.nav.orderTarget
      const orderDirection = this.nav.orderDirection
      const dateTarget = []
      const dateBegin = []
      const dateEnd = []
      const keyword = []
      if (this.nav.dateTarget) dateTarget.push(this.nav.dateTarget)
      if (this.nav.date[0]) dateBegin.push(this.nav.date[0])
      if (this.nav.date[1]) dateEnd.push(this.nav.date[1])

      if (this.nav.keyword) keyword.push(this.nav.keyword)

      await this.$store.dispatch('approval/LOAD_POST_ALL', {projectId, boardSlug, keyword, page, perPage, orderTarget, orderDirection, dateTarget, dateBegin, dateEnd})

      this.table.list = this.$store.state.approval.list
      const listInfo = this.$store.state.approval.postListInfo
      this.currentPage = listInfo.current_page
      this.lastPage = listInfo.last_page
    },

    async loadPostListAll () {
      const projectId = this.$route.params.proj_id
      const boardSlug = 'joint_check_diary' // first_risk(id:6)
      const page = 1
      const perPage = 10000
      const orderTarget = this.nav.orderTarget
      const orderDirection = this.nav.orderDirection
      const dateTarget = []
      const dateBegin = []
      const dateEnd = []
      const keyword = []
      if (this.nav.dateTarget) dateTarget.push(this.nav.dateTarget)
      if (this.nav.date[0]) dateBegin.push(this.nav.date[0])
      if (this.nav.date[1]) dateEnd.push(this.nav.date[1])

      if (this.nav.keyword) keyword.push(this.nav.keyword)

      await this.$store.dispatch('approval/LOAD_POST_ALL', {projectId, boardSlug, keyword, page, perPage, orderTarget, orderDirection, dateTarget, dateBegin, dateEnd})

      this.listAll = this.$store.state.approval.list
    },

    getPreview (data) {
      if (data.post.preview) {
        const preview = JSON.parse(data.post.preview)
        return preview
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

    handleItemClickDetail (data) {
      this.$emit('handleClickItem', 'checklogall', data.post_id)
    },

    handleSort (key, type) {
      if (key) {
        this.nav.orderTarget = key
        this.nav.orderDirection = type
        this.loadPostList()
      }

    },

    handleClickRegister () {
      this.$emit('handleClickRegister', 'checklogall')
    },

    handleSearch () {
      this.currentPage = 1
      this.loadPostList()
    }
  }
}
</script>

<style scoped>

</style>
