<template>
  <div>

    <search-nav @handleSearch="handleSearch">
      <search-nav-item-date label="대상기간" v-model="nav.date" />
      <search-nav-item-select label="재해형태" v-model="nav.occur_type" :list="nav.occur_type_list" />
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

                  noDataText="데이터가 없습니다."
                  @sort="handleSort"
                  @selected="handleItemClickDetail"
        >

          <template slot="thead">
            <vs-th sort-key="id"><span class="w-full text-center">No.</span></vs-th>
            <vs-th sort-key="content$preview.field_name"><span class="w-full text-center">현장명</span></vs-th>
            <vs-th sort-key="content$preview.occur_type"><span class="w-full text-center">재해형태</span></vs-th>
            <vs-th sort-key="content$preview.company"><span class="w-full text-center">소속</span></vs-th>
            <vs-th sort-key="content$preview.occur_date"><span class="w-full text-center">발생일</span></vs-th>
            <vs-th sort-key="content$preview.action_date"><span class="w-full text-center">조치일</span></vs-th>
            <vs-th sort-key="content$preview.action_date"><span class="w-full text-center">작성자</span></vs-th>
            <vs-th sort-key="status"><span class="w-full text-center">결재상태</span></vs-th>
            <vs-th ><span class="w-full text-center">첨부문서</span></vs-th>
          </template>

          <template slot-scope="{data}">
            <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
              <vs-td class="text-center">{{ getNo(indextr) }}</vs-td>
              <vs-td class="text-center">{{ (getPreview(tr)) ? getPreview(tr).field_name : ''}}</vs-td>
              <vs-td class="text-center">{{ (getPreview(tr)) ? getOccurTypeName(getPreview(tr).occur_type) : ''}}</vs-td>
              <vs-td class="text-center">{{ (getPreview(tr)) ? getPreview(tr).company : ''}}</vs-td>
              <vs-td class="text-center">{{ (getPreview(tr)) ? getPreview(tr).occur_date : ''}}</vs-td>
              <vs-td class="text-center">{{ (getPreview(tr)) ? getPreview(tr).action_date : ''}}</vs-td>
              <vs-td class="text-center">{{ (getPreview(tr)) ? getPreview(tr).writer : ''}}</vs-td>
              <vs-td class="text-center">{{ tr.document_status.name }}</vs-td>
              <vs-td class="text-center">
                <a download target="_blank" :href="img.path" v-for="(img, index) in getProjectAttachList(tr)" :key="index" @click.stop>
                  <vs-icon icon-pack="feather" icon="icon-file" />
                </a>
              </vs-td>
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
    <popup-approval-process
      :show-popup="showApprovalLinePopup"
      @closePopup="handleCloseApprovalPopup"/>

    <popup-excel-download
      v-model="showExcelDownload"
      :list="excelList"
      :title="this.boardId === 36 ? '안전' : '보건'"/>
  </div>
</template>

<script>
import SearchNav from '@/components/nav/SearchNav'
import SearchNavItemDate from '@/components/nav/SearchNavItemDate'
import SearchNavItemKeyword from '@/components/nav/SearchNavItemKeyword'
import PopupApprovalProcess from '@/views/approval/PopupApprovalProcess'
import PopupExcelDownload from '@/popup/PopupExcelDownload'
import SearchNavItemSelect from '@/components/nav/SearchNavItemSelect'
import KPagination from '@/components/kPagination/kPagination'

export default {
  name: 'PreventionList',
  components: {
    KPagination,
    SearchNavItemSelect,
    PopupExcelDownload,
    PopupApprovalProcess,
    SearchNavItemKeyword,
    SearchNavItemDate,
    SearchNav
  },
  props: {
    boardId: Number,
    boardSlug: String,
    tagKey: String
  },
  data () {
    return {
      board: {
        id: this.boardId,
        slug: this.boardSlug
      },
      // 검색 네비게이션
      nav: {
        date: ['', ''],
        keyword: '',
        company:'',
        orderTarget:'created_at',
        orderDirection:'desc',
        occur_type:'',
        occur_type_list: [
          {text:'전체선택', value:''},
        ],
        dateTarget:'content$preview.occur_date'
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
  watch:{
    disasterList () {
      this.nav.occur_type_list = [{text:'전체선택', value:''}]
      this.nav.occur_type_list.push(...this.disasterList)
    }
  },

  computed: {
    excelList () {
      const list = []
      for (const data of this.listAll) {
        list.push({
          'No.': data.post.id,
          '현장명': this.getPreview(data).field_name,
          '재해형태': this.getOccurTypeName(this.getPreview(data).occur_type),
          '파트너사': this.getPreview(data).company,
          '발생일': this.getPreview(data).occur_date,
          '조치일': this.getPreview(data).action_date,
          '작성자': this.getPreview(data).writer
        })
      }
      return list
    },
    disasterList () {
      const list = this.$store.state.approval.disasterTypeList
      const returnList = []
      for (const item of list) {
        returnList.push({
          text:item.name,
          value:item.id
        })
      }
      return returnList
    }
  },
  created () {
    const paths = this.$route.path.split('/')
    this.rootPath = `/${paths[1]}/${paths[2]}`

    this.$store.dispatch('approval/LOAD_DISASTER_TYPE_LIST', {})
    this.loadPostList()
  },
  methods: {
    getNo (index) {
      return this.total - (((this.currentPage - 1) * this.table.perPage) + index)
    },

    handleTableChangePage (page) {
      this.currentPage = page
      this.loadPostList()
    },
    async loadPostList () {
      const projectId = this.$route.params.proj_id
      const boardId = this.board.id
      const boardSlug = this.board.slug
      const page = this.currentPage
      const perPage = this.perPage
      const dateTarget = []
      const dateBegin = []
      const dateEnd = []
      const orderTarget = this.nav.orderTarget
      const orderDirection = this.nav.orderDirection
      const keyword = []

      if (this.nav.dateTarget) dateTarget.push(this.nav.dateTarget)
      if (this.nav.date[0]) dateBegin.push(this.nav.date[0])
      if (this.nav.date[1]) dateEnd.push(this.nav.date[1])
      if (this.nav.keyword) keyword.push(this.nav.keyword)
      if (this.nav.company) keyword.push(`content$preview.company*%${this.nav.company}%`)
      if (this.nav.occur_type) keyword.push(`content$preview.occur_type*${this.nav.occur_type}`)

      await this.$store.dispatch('approval/LOAD_POST_ALL', {
        boardSlug,
        projectId,
        page,
        perPage,
        dateTarget,
        dateBegin,
        dateEnd,
        orderTarget,
        orderDirection,
        keyword
      })

      const listInfo = this.$store.state.approval.postListInfo
      this.table.list = this.$store.state.approval.list
      this.currentPage = listInfo.current_page
      this.lastPage = listInfo.last_page
      this.total = listInfo.total

    },

    async loadPostListAll () {
      const projectId = this.$route.params.proj_id
      const boardId = this.board.id
      const boardSlug = this.board.slug
      const page = 1
      const perPage = 10000
      const dateTarget = []
      const dateBegin = []
      const dateEnd = []
      const orderTarget = this.nav.orderTarget
      const orderDirection = this.nav.orderDirection
      const keyword = []

      if (this.nav.dateTarget) dateTarget.push(this.nav.dateTarget)
      if (this.nav.date[0]) dateBegin.push(this.nav.date[0])
      if (this.nav.date[1]) dateEnd.push(this.nav.date[1])

      if (this.nav.keyword) keyword.push(this.nav.keyword)
      if (this.nav.company) keyword.push(`content$preview.company*%${this.nav.company}%`)
      if (this.nav.occur_type) keyword.push(`content$preview.occur_type*${this.nav.occur_type}`)

      await this.$store.dispatch('approval/LOAD_POST_ALL', {
        boardSlug,
        projectId,
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

    getProjectAttachList (data) {
      if (data.post.preview) {
        const preview = JSON.parse(data.post.preview)
        try {
          const attachList = JSON.parse(preview.attach)

          return attachList
        } catch (e) {
          return []
        }

      }

      return ''
    },

    getOccurTypeName (type) {
      let typeName = type
      this.disasterList.map(data => {
        if (`${type}` === `${data.value}`) {
          typeName = data.text
        }
      })
      return typeName
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

    handleClickRegister () {
      this.$emit('handleClickRegister', this.tagKey)
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
    }
  }
}
</script>

<style scoped>

</style>
