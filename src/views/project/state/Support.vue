<template>
  <div>
    <!--  상단 검색바-->
    <search-nav class="mt-4" @handleSearch="handleSearch">
      <search-nav-item-date label="지원일" v-model="nav.date" @handleSearch="handleSearch"/>
      <search-nav-item-select label="지원구분" v-model="nav.supportType" :list="nav.supportTypeList" @change="handleSearch"/>
      <search-nav-item-keyword label="지원자" v-model="nav.supporter" @keyupEvent="handleSearch"/>
    </search-nav>


    <div class="w-full text-right mb-4">
      <vs-button class="mr-4" color="secondary" type="border" @click="excelDownFunc">{{$t('button.Excel 다운로드')}}</vs-button>
      <vs-button class="mr-4" color="secondary" type="border" @click="handleClickApprovalLine">{{$t('button.결재선 지정')}}</vs-button>
      <vs-button class="" color="secondary" type="border" @click="handleClickRegister">신규작성</vs-button>
    </div>

    <vs-row>
      <vs-col>
        <vs-table stripe
                  ref="table"
                  :sst="true"
                  noDataText="데이터가 없습니다"
                  :max-items="table.perPage"
                  :data="table.list"
                  @sort="handleSort"
                  @selected="handleItemClickDetail"
        >


          <template slot="thead">
            <vs-th sort-key="id" class="w-1/12"><span class="w-full text-center">No.</span></vs-th>
            <vs-th sort-key="content$preview.support_date" class="w-2/12"><span class="w-full text-center">지원일</span></vs-th>
            <vs-th sort-key="content$preview.support_type" class="w-2/12"><span class="w-full text-center">구분</span></vs-th>
            <vs-th sort-key="content$preview.supporter" class="w-2/12"><span class="w-full text-center">지원자</span></vs-th>
            <vs-th sort-key="created_at" class="w-2/12"><span class="w-full text-center">작성일</span></vs-th>
            <vs-th class="w-2/12"><span class="w-full text-center">첨부문서</span></vs-th>
            <vs-th sort-key="status" class="w-1/12"><span class="w-full text-center">결재상태</span></vs-th>
          </template>


          <template slot-scope="{data}">
            <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">

              <vs-td class="text-center">{{ getContent(tr).id }}</vs-td>
              <vs-td class="text-center">{{ getPreview(tr).support_date }}</vs-td>
              <vs-td class="text-center">{{ getSupportTypeName(getPreview(tr).support_type) }}</vs-td>
              <vs-td class="text-center">{{ getPreview(tr).supporter }}</vs-td>
              <vs-td class="text-center">{{ getContent(tr).created_at }}</vs-td>
              <vs-td class="text-center">
                <a download target="_blank" :href="img.path" v-for="(img, index) in getProjectAttachList(tr)" :key="index" @click.stop>
                  <vs-icon icon-pack="feather" icon="icon-file" />
                </a>
              </vs-td>
              <vs-td class="text-center">{{tr.document_status.name}}</vs-td>
            </vs-tr>
          </template>
        </vs-table>

        <div class="vs-con-table">
          <div class="con-pagination-table vs-table--pagination">
            <k-pagination
              :total="(table.lastPage) ? table.lastPage : 1"
              v-model="table.currentPage" @change="handleTableChangePage"></k-pagination>
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
      title="환경지원"/>

  </div>
</template>

<script>
import DateSelector from '../../../components/selector/DateSelector'
import SearchNavItemKeyword from '@/components/nav/SearchNavItemKeyword'
import SearchNavItemDate from '@/components/nav/SearchNavItemDate'
import SearchNavItemSelect from '@/components/nav/SearchNavItemSelect'
import SearchNav from '@/components/nav/SearchNav'
import PopupApprovalProcess from '@/views/approval/PopupApprovalProcess'
import PopupExcelDownload from '@/popup/PopupExcelDownload'
import KPagination from '@/components/kPagination/kPagination'

export default {
  name: 'Support',
  components: {
    KPagination,
    PopupExcelDownload,
    PopupApprovalProcess,
    SearchNav,
    SearchNavItemSelect,
    SearchNavItemDate,
    SearchNavItemKeyword,
    DateSelector
  },

  computed: {
    excelList () {
      const list = []
      for (const data of this.table.listAll) {
        list.push({
          지원일: this.getPreview(data).support_date,
          구분: this.getPreview(data).support_type,
          지원자: this.getPreview(data).supporter,
          작성일: data.created_at,
          결재상태: data.document_status.name
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
        orderNum: '',
        orderNumList: [],
        dateTarget: 'content$preview.support_date',
        orderTarget:'created_at',
        orderDirection:'desc',
        supportType:'',
        supportTypeList:[
          {text:'전체선택', value:''},
          {text:'지원구분1', value:'1'},
          {text:'지원구분2', value:'2'},
          {text:'지원구분3', value:'3'},
          {text:'지원구분4', value:'4'},
          {text:'지원구분5', value:'5'},
        ]
      },

      // approvalLine
      approvalLine: [],
      showApprovalLinePopup: false,
      showExcelDownload: false,

      rootPath: '', // 프로젝트의 rootPath

      table: {
        list: [],
        listAll: [],
        keyword: '',
        currentPage:1,
        perPage: 7,
        lastPage:0

      }
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
      const boardSlug = 'environment_support'
      const page = this.table.currentPage
      const perPage = this.table.perPage
      const dateTarget = []
      const dateBegin = []
      const dateEnd = []
      const orderTarget = this.nav.orderTarget
      const orderDirection = this.nav.orderDirection

      if (this.nav.dateTarget) dateTarget.push(this.nav.dateTarget)
      if (this.nav.date[0]) dateBegin.push(this.nav.date[0])
      if (this.nav.date[1]) dateEnd.push(this.nav.date[1])

      const keyword = []
      if (this.nav.supporter) keyword.push(`content$preview.supporter*%${this.nav.supporter}%`)
      if (this.nav.supportType) keyword.push(`content$support_type*${this.nav.supportType}`)

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
      this.table.currentPage = listInfo.current_page
      this.table.lastPage = listInfo.last_page

    },

    async loadPostListAll () {
      const projectId = this.$route.params.proj_id
      const boardSlug = 'environment_support'
      const page = 1
      const perPage = 10000
      const dateTarget = []
      const dateBegin = []
      const dateEnd = []
      const orderTarget = this.nav.orderTarget
      const orderDirection = this.nav.orderDirection

      if (this.nav.dateTarget) dateTarget.push(this.nav.dateTarget)
      if (this.nav.date[0]) dateBegin.push(this.nav.date[0])
      if (this.nav.date[1]) dateEnd.push(this.nav.date[1])

      const keyword = []
      if (this.nav.supporter) keyword.push(`content$preview.supporter*%${this.nav.supporter}%`)
      if (this.nav.supportType) keyword.push(`content$support_type*${this.nav.supportType}`)

      await this.$store.dispatch('approval/LOAD_POST_ALL', {
        projectId,
        boardSlug,
        page,
        perPage,
        keyword,
        dateTarget, dateBegin, dateEnd,
        orderTarget, orderDirection
      })
      this.table.listAll = JSON.parse(JSON.stringify(this.$store.state.approval.list))
      await this.loadPostList()
    },

    async excelDownFunc () {
      await this.loadPostListAll()
      this.showExcelDownload = true
    },

    // 글 상세페이지로 이동
    movePostDetail (_postId) {
      this.$router.push({path: `${this.rootPath}/state/support/${_postId}`})
    },

    handleClickApprovalLine () {
      this.showApprovalLinePopup = true
    },

    handleItemClickDetail (_data) {
      this.movePostDetail(_data.post_id)
    },

    handleSort (key, type) {
      if (key) {
        this.nav.orderTarget = key
        this.nav.orderDirection = type
        this.loadPostList()
      }

    },

    getSupportTypeName (num) {
      return `지원구분${num}`
    },

    getPreview (data) {
      if (data.post && data.post.preview) {
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

    getProjectAttachList (data) {
      if (data.post.preview) {
        const preview = JSON.parse(data.post.preview)
        try {
          const attachList = preview.attach

          return attachList
        } catch (e) {
          return []
        }
      }
      return ''
    },

    handleClickRegister () {
      this.$router.push({path: `${this.rootPath}/state/support/create`})
    },

    handleSearch () {
      this.table.currentPage = 1
      this.loadPostList()
    },
    handleTableChangePage (page) {
      this.table.currentPage = page
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
