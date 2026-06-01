<template>
  <div>
    <search-nav  @handleSearch="handleSearch">
      <search-nav-item-project :label="$t('search.현장명')" v-model="nav.projectId" />
    </search-nav>

    <div class="flex mb-4" style="justify-content: flex-end;">
    </div>
    <vs-card >
      <vs-table
        stripe
        ref="table"
        :sst="true"
        :max-items="table.perPage"
        :data="table.list"
        :noDataText="$t('approval.결재문서가 없습니다')"
        @sort="handleSort"
        @selected="handleItemClickDetail">

        <template slot="thead">
          <vs-th sort-key="id" style="min-width:130px;"><span class="w-full text-center">{{ $t('approval.No') }}</span></vs-th>
          <vs-th sort-key="content$field_name" style="min-width:130px;"><span class="w-full text-center">{{ $t('approval.현장명') }}</span></vs-th>
          <vs-th style="min-width:130px;"><span class="w-full text-center">{{ $t('approval.게시판') }}</span></vs-th>
          <vs-th style="min-width:130px;"><span class="w-full text-center">{{ $t('approval.제목') }}</span></vs-th>
          <vs-th style="min-width:130px;"><span class="w-full text-center">{{ $t('approval.상세') }}</span></vs-th>
          <vs-th style="min-width:130px;"><span class="w-full text-center">{{ $t('approval.작성일') }}</span></vs-th>

        </template>

        <template slot-scope="{data}">
          <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
            <vs-td class="text-center">{{ getNo(indextr) }}</vs-td>
            <vs-td class="text-center">{{ (tr.post && tr.post.project) ? tr.post.project.field_name : '' }}</vs-td>
            <vs-td class="text-center">{{ getBoardTitle(tr) }}</vs-td>
            <vs-td class="text-center">{{ getPostTitle(tr) }}</vs-td>
            <vs-td class="text-center">{{ tr.document_status.name }}</vs-td>
            <vs-td class="text-center">{{ (tr.post) ? getDate(tr.post.created_at) : ''}}</vs-td>
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
    </vs-card>
  </div>
</template>

<script>
import SearchNav from '@/components/nav/SearchNav'
import SearchNavItemDate from '@/components/nav/SearchNavItemDate'
import SearchNavItemKeyword from '@/components/nav/SearchNavItemKeyword'
import SearchNavItemSelect from '@/components/nav/SearchNavItemSelect'
import KPagination from '@/components/kPagination/kPagination'
import SearchNavItemProject from '@/components/nav/SearchNavItemProject'

export default {
  name: 'ApprovalRequest',
  components: {
    SearchNavItemProject,
    KPagination,
    SearchNavItemSelect,
    SearchNavItemKeyword,
    SearchNavItemDate,
    SearchNav
  },
  computed: {
    projectId () {
      return this.$route.params.proj_id
    },
    rootPath () {
      const paths = this.$route.path.split('/')
      return `/${paths[1]}/${paths[2]}/${paths[3]}`
    }
  },
  data () {
    return {
      // 검색 네비게이션
      nav: {
        projectId:'',
        date: ['', ''],
        keyword: '',
        type: '',
        typeList: [],
        orderTarget:'created_at',
        orderDirection:'desc',
        searchTypes: [
          {text:'제목', value:'content$title'},
          {text:'작성자', value:'content$writer'},
        ],
        searchType: 'content$title',
      },

      currentPage: 1,
      lastPage: 1,
      total: 0,
      table: {
        list: [],
        perPage: 7,
        keyword: ''
      }
    }
  },
  created () {
    //this.loadPostList()
  },

  methods: {
    getNo (index) {
      return this.total - (((this.currentPage - 1) * this.table.perPage) + index)
    },

    async loadPostList () {
      const projectId = this.projectId //this.nav.projectId
      const boardSlug = ''
      const page = this.currentPage
      const perPage = this.table.perPage
      const keyword = []
      const orderTarget = this.nav.orderTarget
      const orderDirection = this.nav.orderDirection

      await this.$store.dispatch('approval/LOAD_REQUEST_LIST', {page, perPage, boardSlug, projectId, keyword, orderTarget, orderDirection})
      this.table.list = this.$store.state.approval.list

      const listInfo = this.$store.state.approval.postListInfo
      this.currentPage = listInfo.current_page
      this.lastPage = listInfo.last_page
      this.total = listInfo.total

    },

    handleSearch () {
      this.currentPage = 1
      this.loadPostList()
    },

    getBoardTitle (data) {
      if (data.post ) {
        if (data.post.board) {
          return data.post.board.board_title
        }
      } else {

      }

      return ''
    },

    getPostTitle (data) {
      return data.post.post_title
    },

    getDate (date) {
      return new Date(date).format('yyyy-MM-dd')
    },

    movePost (projectId, boardId, postId) {

      /* 안전·보건예산 현황 */
      if (boardId === 3) { this.$router.push({path: `/project/${projectId}/write/report/project_monthly_report/${postId}`}); return }
      /* 최초 위험성평가 */
      if (boardId === 6) { this.$router.push({path: `/project/${projectId}/risk/assessment/first/${postId}`}); return }
      /* 정기위험성평가 */
      if (boardId === 7) { this.$router.push({path: `/project/${projectId}/risk/assessment/regular/${postId}`}); return }
      /* 수시위험성평가 */
      if (boardId === 41) { this.$router.push({path: `/project/${projectId}/risk/assessment/always/${postId}`}); return }
      /* 위험성평가협의회 */
      if (boardId === 8) { this.$router.push({path: `/project/${projectId}/risk/conference/warning/${postId}`}); return }
      /* 수시 위험성평가협의회 */
      if (boardId === 42) { this.$router.push({path: `/project/${projectId}/risk/conference/warning-always/${postId}`}); return }
      /* 산업안전보건위원회 */
      if (boardId === 9) { this.$router.push({path: `/project/${projectId}/risk/conference/safety/${postId}`}); return }
      /* 작업허가서(내부용) */
      if (boardId === 10) { this.$router.push({path: `/project/${projectId}/risk/permit/work/${postId}`}); return }
      /* 작업허가서(외부용) */
      if (boardId === 11) { this.$router.push({path: `/project/${projectId}/risk/permit/work_export/${postId}`}); return }

      /* 안전점검일지 */
      if (boardId === 13) { this.$router.push({path: `/project/${projectId}/risk/check/checklog/${postId}`}); return }
      /* 안전점검일지 */
      if (boardId === 14) { this.$router.push({path: `/project/${projectId}/risk/check/checklogall/${postId}`}); return }
      /* 산업재해무재해 */
      if (boardId === 22) { this.$router.push({path: `/project/${projectId}/safety/accident/report/${postId}`}); return }
      /* 안전용품 현황 */
      if (boardId === 23) { this.$router.push({path: `/project/${projectId}/safety/supplies/${postId}`}); return }
      /* 건설장비관리 */
      if (boardId === 24) { this.$router.push({path: `/project/${projectId}/safety/equipment/plan/${postId}`}); return }
      /* 환경일일점검 */
      if (boardId === 28) { this.$router.push({path: `/project/${projectId}/state/check/daily/${postId}`}); return }
      /* 환경월간점검 */
      if (boardId === 29) { this.$router.push({path: `/project/${projectId}/state/check/monthly/${postId}`}); return }
      /* 환경지원 */
      if (boardId === 30) { this.$router.push({path: `/project/${projectId}/state/support/${postId}`}); return }
      /* 환경평가 */
      if (boardId === 31) { this.$router.push({path: `/project/${projectId}/state/evaluation/${postId}`}); return }
      /* 환경이슈보고 */
      if (boardId === 32) { this.$router.push({path: `/project/${projectId}/state/report/issue/${postId}`}); return }
      /* 환경사고보고 */
      if (boardId === 33) { this.$router.push({path: `/project/${projectId}/state/report/accident/${postId}`}); return }

      /* HSE 교육관리 */
      if (boardId === 35) { this.$router.push({path: `/project/${projectId}/hse/list/safety/${postId}`}); return }
      /* 안전요청 */
      if (boardId === 36) { this.$router.push({path: `/project/${projectId}/prevention/request/safety/${postId}`}); return }
      /* 환경요청 */
      if (boardId === 39) { this.$router.push({path: `/project/${projectId}/prevention/request/environment/${postId}`}); return }
      /* 보건요청 */
      if (boardId === 40) { this.$router.push({path: `/project/${projectId}/prevention/request/health/${postId}`}); return }

      /* 사고보고 */
      if (boardId === 45) { this.$router.push({path: `/project/${projectId}/write/accident/accident_report/${postId}`}); return }
      /* 산재검토 */
      if (boardId === 46) { this.$router.push({path: `/project/${projectId}/write/accident/accident_review/${postId}`}); return }

      /* 444점검 */
      if (boardId === 48) { this.$router.push({path: `/project/${projectId}/write/safety_check/safety_check_444/${postId}`}); return }
      /* 출역장비 */
      if (boardId === 49) { this.$router.push({path: `/project/${projectId}/write/safety_check/safety_check_444/${postId}`}); return }
      /* 파트너사 계약현황 */
      if (boardId === 50) { this.$router.push({path: `/project/${projectId}/plan/partners`}); return }
      /* 444점검 */
      if (boardId === 51) { this.$router.push({path: `/project/${projectId}/write/safety_check_partner/safety_check_partner_444/${postId}`}); return }

      /* 사고조사 보고서 */
      if (boardId === 53) { this.$router.push({path: `/project/${projectId}/tab/${boardId}/write/${postId}`}); return }
      /* 사고경위서 */
      if (boardId === 54) { this.$router.push({path: `/project/${projectId}/tab/${boardId}/write/${postId}`}); return }
      /* 목격자 진술서 */
      if (boardId === 55) { this.$router.push({path: `/project/${projectId}/tab/${boardId}/write/${postId}`}); return }
      /* 실험실 안전사고 보고 */
      if (boardId === 56) { this.$router.push({path: `/project/${projectId}/approval/${boardId}/write/${postId}`}); return }
      /* 산업재해조사표 */
      if (boardId === 57) { this.$router.push({path: `/project/${projectId}/normal/${boardId}/write/${postId}`}); return }
      /* 산업안전보건위원회 */
      if (boardId === 58) { this.$router.push({path: `/project/${projectId}/tab/${boardId}/write/${postId}`}); return }
      /* 안전경영위원회 */
      if (boardId === 59) { this.$router.push({path: `/project/${projectId}/tab/${boardId}/write/${postId}`}); return }
      /* 안전근로협의체 */
      if (boardId === 60) { this.$router.push({path: `/project/${projectId}/tab/${boardId}/write/${postId}`}); return }
      /* 안전보건협의체 */
      if (boardId === 61) { this.$router.push({path: `/project/${projectId}/normal/${boardId}/write/${postId}`}); return }
      /* 아차사고 사례 카드 */
      if (boardId === 62) { this.$router.push({path: `/project/${projectId}/tab/${boardId}/write/${postId}`}); return }
      /* 아차사고 사례 개선 확인 카드 */
      if (boardId === 63) { this.$router.push({path: `/project/${projectId}/tab/${boardId}/write/${postId}`}); return }
      /* 실험실 일상 점검표 */
      if (boardId === 64) { this.$router.push({path: `/project/${projectId}/tab/${boardId}/write/${postId}`}); return }
      /* 실험실 정기 점검표 */
      if (boardId === 65) { this.$router.push({path: `/project/${projectId}/tab/${boardId}/write/${postId}`}); return }
      /* TAC 안전관리 점검표 */
      if (boardId === 66) { this.$router.push({path: `/project/${projectId}/tab/${boardId}/write/${postId}`}); return }
      /* 밀폐공간 작업프로그램 평가표 */
      if (boardId === 67) { this.$router.push({path: `/project/${projectId}/tab/${boardId}/write/${postId}`}); return }
      /* 밀폐공간 작업 전 체크리스트 */
      if (boardId === 68) { this.$router.push({path: `/project/${projectId}/tab/${boardId}/write/${postId}`}); return }
      /* 고압가스 충전실 안전점검표 */
      if (boardId === 69) { this.$router.push({path: `/project/${projectId}/tab/${boardId}/write/${postId}`}); return }
      /* 한수단 2호 안전점검표 */
      if (boardId === 70) { this.$router.push({path: `/project/${projectId}/tab/${boardId}/write/${postId}`}); return }
      /* 잠수 운용 계획서 */
      if (boardId === 71) { this.$router.push({path: `/project/${projectId}/tab/${boardId}/write/${postId}`}); return }
      /* 잠수작업 전 안전점검표 */
      if (boardId === 72) { this.$router.push({path: `/project/${projectId}/tab/${boardId}/write/${postId}`}); return }
      /* 잠수 운용 결과서 */
      if (boardId === 73) { this.$router.push({path: `/project/${projectId}/tab/${boardId}/write/${postId}`}); return }
      /* 중량물·운반기계 안전점검표 */
      if (boardId === 74) { this.$router.push({path: `/project/${projectId}/tab/${boardId}/write/${postId}`}); return }
      /* 작업장 안전점검표 */
      if (boardId === 75) { this.$router.push({path: `/project/${projectId}/tab/${boardId}/write/${postId}`}); return }
      /* 부적합 및 시정조치 - 안전 */
      if (boardId === 76) { this.$router.push({path: `/project/${projectId}/tab/${boardId}/write/${postId}`}); return }
      /* 부적합 및 시정조치 - 보건 */
      if (boardId === 77) { this.$router.push({path: `/project/${projectId}/tab/${boardId}/write/${postId}`}); return }
      /* 작업중지보고서 - 임직원 */
      if (boardId === 78) { this.$router.push({path: `/project/${projectId}/tab/${boardId}/write/${postId}`}); return }
      /* 작업중지보고서 - 근로자 */
      if (boardId === 79) { this.$router.push({path: `/project/${projectId}/tab/${boardId}/write/${postId}`}); return }
      /* 작업중지 조치결과서 - 임직원 */
      if (boardId === 80) { this.$router.push({path: `/project/${projectId}/tab/${boardId}/write/${postId}`}); return }
      /* 작업중지 조치결과서 - 근로자 */
      if (boardId === 81) { this.$router.push({path: `/project/${projectId}/tab/${boardId}/write/${postId}`}); return }
      /* 정기 위험성 평가 */
      if (boardId === 82) { this.$router.push({path: `/project/${projectId}/tab/${boardId}/write/${postId}`}); return }
      /* 수시 위험성 평가 */
      if (boardId === 83) { this.$router.push({path: `/project/${projectId}/tab/${boardId}/write/${postId}`}); return }
      /* 안전작업허가 - 작업수행부서 */
      if (boardId === 84) { this.$router.push({path: `/project/${projectId}/tab/${boardId}/write/${postId}`}); return }
      /* 안전작업허가 - 하도급업체 */
      if (boardId === 85) { this.$router.push({path: `/project/${projectId}/tab/${boardId}/write/${postId}`}); return }
      /* 안전·보건예산 현황 */
      if (boardId === 86) { this.$router.push({path: `/project/${projectId}/approval/${boardId}/write/${postId}`}); return }
      /* 작업중지보고서 - 기타 */
      if (boardId === 87) { this.$router.push({path: `/project/${projectId}/tab/${boardId}/write/${postId}`}); return }
      /* 작업중지 조치결과서 - 기타 */
      if (boardId === 88) { this.$router.push({path: `/project/${projectId}/tab/${boardId}/write/${postId}`}); return }

      // BS
      if (boardId >= 100) { this.$router.push({path: `/project/${projectId}/tab/${boardId}/write/${postId}`}); return }


    },

    handleChangePage (page) {
      this.currentPage = page
      this.loadPostList()
    },

    handleItemClickDetail (data) {
      const projectId = data.post.project_id
      const boardId = data.post.board_id
      const postId = data.post.id
      this.movePost(projectId, boardId, postId)
    },
    handleClickRegister () {

    },

    handleSort (key, type) {
      if (key) {
        this.nav.orderTarget = key
        this.nav.orderDirection = type

        this.loadPostList()
      }
    },
  }
}
</script>

<style scoped>

</style>
