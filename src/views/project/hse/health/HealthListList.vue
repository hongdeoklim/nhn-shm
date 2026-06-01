<template>
  <div>

    <search-nav @handleSearch="handleSearch">
      <search-nav-item-date label="교육일" v-model="nav.date" />
      <search-nav-item-keyword label="소속" v-model="nav.company" />
      <search-nav-item-keyword label="키워드" v-model="nav.keyword" />
    </search-nav>

    <vs-row class="mb-4">
      <vs-col class="flex" vs-justify="flex-end">
        <vs-button class="mr-2" type="border" color="secondary" @click="excelDownFunc">{{$t('button.Excel 다운로드')}}</vs-button>
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

                  noDataText="데이터가 없습니다."
                  @sort="handleSort"
                  @selected="handleItemClickDetail"
        >

          <template slot="thead">
            <vs-th sort-key="id" class="w-1/12" ><span class="w-full text-center">No.</span></vs-th>
            <vs-th sort-key="post_title" class="w-1/12" ><span class="w-full text-center">현장명</span></vs-th>
            <vs-th sort-key="content$company" class="w-1/12" ><span class="w-full text-center">소속</span></vs-th>
            <vs-th sort-key="content$hse_type_health" class="w-1/12" ><span class="w-full text-center">교육구분</span></vs-th>
            <vs-th sort-key="content$preview.work" class="w-1/12" ><span class="w-full text-center">교육명</span></vs-th>
            <vs-th sort-key="content$preview.target" class="w-1/12" ><span class="w-full text-center">교육대상</span></vs-th>
            <vs-th sort-key="content$preview.date" class="w-2/12" ><span class="w-full text-center">교육일</span></vs-th>
            <vs-th sort-key="content$preview.main_manager" class="w-2/12" ><span class="w-full text-center">교육담당</span></vs-th>
            <vs-th sort-key="content$preview.total" class="w-1/12" ><span class="w-full text-center">총인원</span></vs-th>
            <vs-th class="w-1/12" ><span class="w-full text-center">첨부파일</span></vs-th>
          </template>

          <template slot-scope="{data}">
            <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">

              <vs-td class="text-center">{{ getNo(indextr) }}</vs-td>
              <vs-td class="text-center">{{ tr.post_title }}</vs-td>
              <vs-td class="text-center">{{ getContent(tr).company }}</vs-td>
              <vs-td class="text-center">{{ getHseTypeHealth(getContent(tr).hse_type_health) }}</vs-td>
              <vs-td class="text-center">{{ getPreview(tr).work }}</vs-td>
              <vs-td class="text-center">{{ getPreview(tr).target }}</vs-td>
              <vs-td class="text-center">{{ getPreview(tr).date }}<br>{{ getPreview(tr).s_time.substr(0, 5) }} ~
                {{ getPreview(tr).e_time.substr(0, 5) }}
              </vs-td>
              <vs-td class="text-center">{{
                  getPreview(tr).main_manager
                }}{{ getPreview(tr).sub_manager ? ' / ' + getPreview(tr).sub_manager : '' }}
              </vs-td>
              <vs-td class="text-center">{{ getPreview(tr).total }}</vs-td>
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

    <popup-excel-download
      v-model="showExcelDownload"
      :list="excelList"
      title="안전교육"/>
  </div>
</template>

<script>
import SearchNav from '@/components/nav/SearchNav'
import SearchNavItemDate from '@/components/nav/SearchNavItemDate'
import SearchNavItemKeyword from '@/components/nav/SearchNavItemKeyword'
import PopupExcelDownload from '@/popup/PopupExcelDownload'
import KPagination from '@/components/kPagination/kPagination'

export default {
  name: 'HealthList',
  components: {
    KPagination,
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
          '현장명': this.getPreview(data).post_title,
          '교육명': this.getPreview(data).work,
          '교육대상': this.getPreview(data).target,
          '교육담당': `${this.getPreview(data).main_manager} / ${this.getPreview(data).sub_manager ? ` / ${  this.getPreview(data).sub_manager}` : ''} `,
          '교육일': `${this.getPreview(data).date}\n${this.getPreview(data).s_time.substr(0, 5)}~${ this.getPreview(data).e_time.substr(0, 5) }`,
          '총인원': this.getPreview(data).total
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
        keyword: '',
        company: '',
        orderTarget:'id',
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

      rootPath: '', // 프로젝트의 rootPath
      postId: '',
      table: {
        list: [],
        perPage: 10,
        keyword: ''
      }
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
      const boardId = 35
      const boardSlug = 'hse_management' // first_risk(id:6)
      const page = this.currentPage
      const perPage = this.table.perPage
      const dateBegin = this.nav.date[0]
      const dateEnd = this.nav.date[1]
      const keyword = []
      const dateTarget = 'content$preview.date'
      const orderTarget = this.nav.orderTarget
      const orderDirection = this.nav.orderDirection

      keyword.push('content$preview.hse_type*health')
      if (this.nav.keyword) keyword.push(this.nav.keyword)
      if (this.nav.company) keyword.push(`content$company*%${this.nav.company}%`)

      await this.$store.dispatch('board/LOAD_POST_LIST', {
        projectId,
        boardId,
        page,
        perPage,
        keyword,
        dateTarget, dateBegin, dateEnd,
        orderTarget,
        orderDirection
      })

      const postListInfo = this.$store.state.board.postListInfo
      this.table.list = postListInfo.data
      this.currentPage = postListInfo.current_page
      this.lastPage = postListInfo.last_page
      this.total = postListInfo.total

    },

    async loadPostListAll () {
      const projectId = this.$route.params.proj_id
      const boardId = 35
      const boardSlug = 'hse_management' // first_risk(id:6)
      const page = 1
      const perPage = 10000
      const dateBegin = this.nav.date[0]
      const dateEnd = this.nav.date[1]
      const keyword = []
      const dateTarget = 'content$preview.date'
      const orderTarget = this.nav.orderTarget
      const orderDirection = this.nav.orderDirection

      keyword.push('content$preview.hse_type*health')
      if (this.nav.keyword) keyword.push(this.nav.keyword)
      if (this.nav.company) keyword.push(`content$company*%${this.nav.company}%`)

      await this.$store.dispatch('board/LOAD_POST_LIST', {
        projectId,
        boardId,
        page,
        perPage,
        keyword,
        dateTarget, dateBegin, dateEnd,
        orderTarget,
        orderDirection
      })

      const postListInfo = this.$store.state.board.postListInfo
      this.listAll = postListInfo.data
      await this.loadPostList()
    },
    getContent (data) {
      if (data.post_content) {
        const content = JSON.parse(data.post_content)
        return content
      }
    },
    getHseTypeHealth (type) {
      const selectSafetyList = {
        'regular_health': '정기보건교육',
        'hiring_health': '채용시 보건교육',
        'changing_health': '작업내용 변경시 보건교육',
        'special_health': '특별보건교육',
        'supervisor_health': '관리감독자 보건교육',
        'material_health': 'MSDS',
        'etc_health': '기타(보건)',
      }

      return selectSafetyList[type]
    },

    handleSearch () {
      this.currentPage = 1
      this.loadPostList()
    },

    getPreview (data) {
      if (data.preview) {
        const preview = JSON.parse(data.preview)
        return preview
      }
    },

    async excelDownFunc () {
      await this.loadPostListAll()
      this.showExcelDownload = true
    },

    handleClickRegister () {
      this.$emit('handleClickRegister', 'health')
    },

    handleItemClickDetail (data) {
      this.$router.push({path: `${this.rootPath}/hse/list/health/${data.id}`})
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
