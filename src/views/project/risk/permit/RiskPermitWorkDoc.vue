<template>
  <div>
    <search-nav @handleSearch="handleSearch">
      <search-nav-item-date label="신청일지" v-model="nav.date" />
      <search-nav-item-select label="작업구분" v-model="nav.doc" :list="nav.docList" />
    </search-nav>

    <vs-row class="mb-4">
      <vs-col class="flex" vs-justify="flex-end">
        <vs-button class="mr-2" type="border" color="secondary" @click="excelDownFunc">{{$t('button.Excel 다운로드')}}</vs-button>
        <vs-button color="secondary" @click="handleClickRegister">신규작성</vs-button>
      </vs-col>
    </vs-row>

    <vs-row>
      <vs-col>
        <vs-table
          class="pb-wide"
          stripe
          ref="table"
          :data="postList"

          :sst="true"
          :max-items="itemsPerPage"
          noDataText="데이터가 없습니다"
          @sort="handleSort"
          @selected="handleItemClickDetail">

          <template slot="thead">
            <vs-th class=""><span class="w-full text-center">No.</span></vs-th>
            <vs-th sort-key="content$post_title" class=""><span class="w-full text-center">현장명</span></vs-th>
            <vs-th sort-key="content$permitDate" class=""><span class="w-full text-center">허가일자</span></vs-th>
            <vs-th sort-key="content$search.workTypeB" class=""><span class="w-full text-center">작업구분</span></vs-th>
            <vs-th sort-key="content$work_place" class=""><span class="w-full text-center">작업장소</span></vs-th>
            <vs-th sort-key="content$applicant.name" class=""><span class="w-full text-center">신청인</span></vs-th>
            <vs-th sort-key="created_at" class=""><span class="w-full text-center">작성일</span></vs-th>
            <vs-th sort-key="status" class=""><span class="w-full text-center">결재상태</span></vs-th>
          </template>

          <template slot-scope="{data}">
            <vs-tr :data="row" :key="indextr" v-for="(row, indextr) in data">
              <vs-td class="text-center">{{ getNo(indextr) }}</vs-td>
              <vs-td class="text-center">{{ row.post_title }}</vs-td>
              <vs-td class="text-center">{{ getContent(row).permitDate }}</vs-td>
              <vs-td class="text-center">{{ getContent(row).search && getContent(row).search.workTypeB.join(", ") }}</vs-td>
              <vs-td class="text-center">{{ getContent(row).work_place }}</vs-td>
              <vs-td class="text-center">{{ getContent(row).applicant.name }}</vs-td>
              <vs-td class="text-center">{{ row.created_at.substr(0, 10) }}</vs-td>
              <vs-td class="text-center">{{ row.document_status.name }}</vs-td>
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
      title="작업허가서"/>
  </div>
</template>

<script>
import SearchNav from '@/components/nav/SearchNav'
import SearchNavItemDate from '@/components/nav/SearchNavItemDate'
import SearchNavItemKeyword from '@/components/nav/SearchNavItemKeyword'
import SearchNavItemSelect from '@/components/nav/SearchNavItemSelect'
import PopupExcelDownload from '@/popup/PopupExcelDownload'
import KPagination from '@/components/kPagination/kPagination'

export default {
  name: 'RiskPermitWorkDoc',
  components: {
    KPagination,
    PopupExcelDownload,
    SearchNavItemSelect,
    SearchNavItemKeyword,
    SearchNavItemDate,
    SearchNav
  },
  props:{
    boardId: Number,
    boardSlug: String,
    tagKey: String
  },
  data () {
    return {
      // 검색 네비게이션
      nav: {
        date: ['', ''],
        doc: '',
        docList: [],
        type: '',
        typeList: [],
        orderTarget:'created_at',
        orderDirection:'desc'
      },

      showExcelDownload: false,

      postList: [],
      listAll: [],
      lastPage: 1,
      currentPage: 1,
      itemsPerPage: 10,
      perPage: 10,
      total:0,
    }
  },

  computed: {
    excelList () {
      const list = []
      for (const row of this.listAll) {
        list.push({
          현장명: row.post.project.field_name,
          허가일자: this.getContent(row).permitDate,
          작업구분: this.getContent(row).search && this.getContent(row).search.workTypeB.join(", "),
          작업장소: this.getContent(row).work_place,
          신청인: this.getContent(row).applicant.name,
          작성일: row.created_at.substr(0, 10),
        })
      }
      return list
    }
  },

  created () {
    this.setNavSelectList()
    this.loadPostList()
  },
  methods: {
    getNo (index) {
      return this.total - (((this.currentPage - 1) * this.perPage) + index)
    },
    getContent (data) {
      if (data.post_content) {
        const content = JSON.parse(data.post_content)
        return content
      }
    },
    setNavSelectList () {
      this.nav.docList = [
        {
          text: '전체',
          value: ''
        },
        {
          text: '화기작업',
          value: '화기작업'
        },
        {
          text: '밀폐공간작업',
          value: '밀폐공간작업'
        },
        {
          text: '정전작업',
          value: '정전작업'
        },
        {
          text: '위험기계 사용 작업',
          value: '위험기계 사용 작업'
        },
        {
          text: '고소작업',
          value: '고소작업'
        },
        {
          text: '중장비작업',
          value: '중장비작업'
        },
        {
          text: '헬기작업',
          value: '헬기작업'
        },
        {
          text: '일반작업',
          value: '일반작업'
        }
      ]
      this.nav.typeList = [
        {
          text: '{선택안함}',
          value: ''
        },
        {
          text: '건축',
          value: '건축'
        },
        {
          text: '인프라',
          value: '인프라'
        },
        {
          text: '플랜트',
          value: '플랜트'
        },
        {
          text: '통신',
          value: '통신'
        }
      ]

    },

    // 게시물 불러오기
    async loadPostList () {
      const projectId = this.$route.params.proj_id
      const boardSlug = this.boardSlug
      const page = (this.currentPage) ? this.currentPage : 1
      const perPage = this.perPage
      const orderTarget = this.nav.orderTarget
      const orderDirection = this.nav.orderDirection
      const dateTarget = ['created_at']
      const dateBegin = [this.nav.date[0]]
      const dateEnd = [this.nav.date[1]]
      const keyword = []

      if (this.nav.type) keyword.push(`content$preview.type*${this.nav.type}`)
      if (this.nav.doc) keyword.push(`content$search.workTypeB*%${this.nav.doc}%`)

      await this.$store.dispatch('approval/LOAD_POST_ALL', {
        projectId,
        boardSlug,
        page,
        perPage,
        keyword,
        orderTarget,
        orderDirection,
        dateTarget,
        dateBegin,
        dateEnd
      })

      // 게시물 불러오기
      const postListInfo = this.$store.state.approval.postListInfo

      // 페이지네이션 정보
      this.currentPage = postListInfo.current_page
      this.lastPage = postListInfo.last_page
      this.perPage = postListInfo.per_page
      this.total = postListInfo.total

      // 보여지는 게시물 리스트
      this.postList = postListInfo.data
    },

    async loadPostListAll () {
      const projectId = this.$route.params.proj_id
      const boardSlug = this.boardSlug
      const page = 1
      const perPage = 10000
      const orderTarget = this.nav.orderTarget
      const orderDirection = this.nav.orderDirection
      const dateTarget = ['created_at']
      const dateBegin = [this.nav.date[0]]
      const dateEnd = [this.nav.date[1]]
      const keyword = []

      if (this.nav.type) keyword.push(`content$preview.type*${this.nav.type}`)
      if (this.nav.doc) keyword.push(`content$search.workTypeB*%${this.nav.doc}%`)

      await this.$store.dispatch('approval/LOAD_POST_ALL', {
        projectId,
        boardSlug,
        page,
        perPage,
        keyword,
        orderTarget,
        orderDirection,
        dateTarget,
        dateBegin,
        dateEnd
      })
      // 게시물 불러오기
      this.listAll = JSON.parse(JSON.stringify(this.$store.state.approval.postListInfo.data))
      await this.loadPostList()
    },

    getPreview (data) {
      if (data.post && data.post.preview) {
        const preview = JSON.parse(data.post.preview)
        return preview
      }

      return {
        sdate: '',
        edate: '',
        place: ''
      }
    },

    handleItemClickDetail (data) {
      this.$emit('handleClickItem', this.tagKey, data.post.id)
    },

    handleSort (key, type) {
      if (key) {
        this.nav.orderTarget = key
        this.nav.orderDirection = type
        this.loadPostList()
      }

    },

    handleTableChangePage (page) {
      this.currentPage = page
      this.loadPostList()
    },

    handleClickRegister () {
      this.$emit('handleClickRegister', this.tagKey)
    },

    async excelDownFunc () {
      await this.loadPostListAll()
      this.showExcelDownload = true
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
