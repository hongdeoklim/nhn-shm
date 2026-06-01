<template>
  <div class="w-full">
    <!--  상단 검색바-->
    <search-nav @handleSearch="handleSearch">
      <search-nav-item-select label="대상기간" v-model="nav.dateTarget" :list="nav.dateTargettList" />
      <search-nav-item-date label="대상기간" type="single" v-model="nav.date" />
      <search-nav-item-keyword label="현장명" v-model="nav.keyword" />
    </search-nav>

    <vs-row>
      <vs-col>
        <vs-table stripe
                  ref="table"
                  :sst="true"
                  :max-items="perPage"
                  :data="list"
                  noDataText="데이터가 없습니다"
                  @sort="handleSort"
                  @selected="handleItemClickDetail">

          <template slot="thead">
            <vs-th sort-key="id" class="w-1/12"><span class="w-full text-center">제목</span></vs-th>
            <vs-th sort-key="content$preview.project_title" class="w-1/12"><span class="w-full text-center">현장명</span></vs-th>
            <vs-th sort-key="content$check_date" class="w-1/12"><span class="w-full text-center">부서</span></vs-th>
            <vs-th sort-key="content$action_date" class="w-1/12"><span class="w-full text-center">작성자</span></vs-th>
            <vs-th sort-key="content$plan_created_at" class="w-1/12"><span class="w-full text-center">장비명</span></vs-th>
            <vs-th sort-key="status" class="w-1/12"><span class="w-full text-center">결재상태</span></vs-th>
            <vs-th class="w-1/12"><span class="w-full text-center">첨부파일</span></vs-th>
          </template>


          <template slot-scope="{data}">
            <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">

              <vs-td class="text-center">{{ getContents(tr).title }}</vs-td>
              <vs-td class="text-center">{{ getContents(tr).project_title }}</vs-td>
              <vs-td class="text-center">{{ getContents(tr).check_date }}</vs-td>
              <vs-td class="text-center">{{ tr.user ? tr.user.name : '' }}</vs-td>
              <vs-td class="text-center">{{ getContents(tr).work_type }}</vs-td>
              <vs-td class="text-center">{{ tr.document_status.name }}</vs-td>
              <vs-td class="text-center">
              <a download target="_blank" :href="img.path" v-for="(img, index) in getPreview(tr).attach" :key="index" @click.stop>
                <vs-icon icon-pack="feather" icon="icon-file"/>
              </a>
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
import SearchNavItemSelect from '@/components/nav/SearchNavItemSelect'

export default {
  name: 'ResultList',
  components: {
    SearchNavItemSelect,
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
          'No.': data.post_id,
          '현장명': this.getPreview(data).project_title,
          '안전점검일': this.getPreview(data).check_date,
          '조치일': this.getPreview(data).move_date,
          '결과입력일': this.getPreview(data).result_date,
          '결재상태': '',
          '첨부파일': ''
        })
      }
      return list
    }
  },

  data () {
    return {
      // 검색 네비게이션
      nav: {
        date: ['', ''],
        dateTarget:'',
        dateTargettList: [
          {text:'전체선택', value: ''},
          {text:'안전점검일', value: ''},
          {text:'조치일', value: ''},
          {text:'결과입력일', value: ''}
        ],
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
      lastPage: 1,
      total: 0
    }
  },
  async created () {
    // 초기화
    const paths = this.$route.path.split('/')
    this.rootPath = `/${paths[1]}/${paths[2]}`

    await this.loadPostList()
  },
  methods: {
    getNo (index) {
      return this.total - (((this.currentPage - 1) * this.perPage) + index)
    },

    async loadPostList () {
      const projectId = this.$route.params.proj_id
      const boardSlug = 'construction_equipment'
      const page = this.currentPage
      const perPage = this.perPage
      const dateTarget = []
      const dateBegin = []
      const dateEnd = []
      const keyword = this.nav.keyword
      const orderTarget = this.nav.orderTarget
      const orderDirection = this.nav.orderDirection
      if (this.nav.dateTarget) dateTarget.push(this.nav.dateTarget)
      if (this.nav.date[0]) dateBegin.push(this.nav.date[0])
      if (this.nav.date[1]) dateEnd.push(this.nav.date[1])

      await this.$store.dispatch('approval/LOAD_POST_ALL', {
        projectId,
        boardSlug,
        page,
        perPage,
        dateBegin,
        dateEnd,
        keyword,
        orderTarget,
        orderDirection
      })

      const list = this.$store.state.approval.list

      this.list = list

      const listInfo = this.$store.state.approval.postListInfo
      this.currentPage = listInfo.current_page
      this.lastPage = listInfo.last_page
      this.total = listInfo.total

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

    handleSearch () {
      this.currentPage = 1
      this.loadPostList()
    },
    handleClickApprovalLine () {
      this.showApprovalLinePopup = true
    },

    handleItemClickDetail (data) {
      this.$router.push({path: `${this.rootPath}/safety/equipment/result/${data.post_id}`})
    },

    handleSort (key, type) {
      if (key) {
        this.nav.orderTarget = key
        this.nav.orderDirection = type
        this.loadPostList()
      }

    },

    handleClickRegister () {
      this.$emit('handleClickRegister', 'result')
    },

    handleChangePage (page) {
      this.currentPage = page
      this.loadPostList()
    },
    handleCloseApprovalPopup () {
      this.showApprovalLinePopup = false
    }
  }
}
</script>

<style scoped>

</style>
