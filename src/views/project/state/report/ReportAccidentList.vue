<template>
  <div>
    <!--  상단 검색바-->
    <search-nav class="mt-4" @handleSearch="handleSearch">
      <search-nav-item-date label="사고발생일" v-model="nav.date" @handleSearch="handleSearch"/>
      <search-nav-item-select label="사고구분" v-model="nav.pollution_cause" :list="nav.pollution_cause_list" @change="handleSearch"/>
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
            <vs-th sort-key="id" class="w-1/12"><span class="w-full text-center">No.</span></vs-th>
            <vs-th sort-key="content$preview.field_name" class="w-2/12"><span class="w-full text-center">현장명</span></vs-th>
            <vs-th sort-key="content$preview.pollution_cause" class="w-1/12"><span class="w-full text-center">오염원</span></vs-th>
            <vs-th sort-key="content$preview.occurrence_date" class="w-1/12"><span class="w-full text-center">사고발생일</span></vs-th>
            <vs-th sort-key="content$preview.company" class="w-1/12"><span class="w-full text-center">소속</span></vs-th>
            <vs-th sort-key="content$preview.writer" class="w-1/12"><span class="w-full text-center">작성자</span></vs-th>
            <vs-th sort-key="content$preview.write_date" class="w-1/12"><span class="w-full text-center">작성일</span></vs-th>
            <vs-th sort-key="status" class="w-1/12"><span class="w-full text-center">결재상태</span></vs-th>
            <vs-th class="w-1/12"><span class="w-full text-center">첨부</span></vs-th>
          </template>


          <template slot-scope="{data}">
            <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">

              <vs-td class="text-center">{{ getContent(tr).id }}</vs-td>
              <vs-td class="text-center">{{ getPreview(tr).field_name }}</vs-td>
              <vs-td class="text-center">{{ getPollutionName(getPreview(tr).pollution_cause) }}</vs-td>
              <vs-td class="text-center">{{ getPreview(tr).occurrence_date }}</vs-td>
              <vs-td class="text-center">{{ getPreview(tr).company }}</vs-td>
              <vs-td class="text-center">{{ getPreview(tr).writer }}</vs-td>
              <vs-td class="text-center">{{ getPreview(tr).write_date }}</vs-td>
              <vs-td class="text-center">{{ tr.document_status.name }}</vs-td>
              <vs-td class="text-center">
                <a target="_blank" :href="img.path" v-for="(img, index) in getProjectAttachList(tr)" :key="index" @click.stop>
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
      title="환경사고/이슈보고"/>

  </div>
</template>

<script>
import SearchNav from '@/components/nav/SearchNav'
import SearchNavItemSelect from '@/components/nav/SearchNavItemSelect'
import SearchNavItemKeyword from '@/components/nav/SearchNavItemKeyword'
import SearchNavItemDate from '@/components/nav/SearchNavItemDate'
import PopupApprovalProcess from '@/views/approval/PopupApprovalProcess'
import PopupExcelDownload from '@/popup/PopupExcelDownload'
import KPagination from '@/components/kPagination/kPagination'

export default {
  name: 'ReportAccidentList',
  components: {
    KPagination,
    PopupExcelDownload,
    PopupApprovalProcess,
    SearchNavItemDate,
    SearchNavItemKeyword,
    SearchNavItemSelect,
    SearchNav
  },
  data () {
    return {
      // 검색 네비게이션
      nav: {
        date: ['', ''],
        keyword: '',
        orderNum: '',
        orderNumList: [],
        orderTarget:'created_at',
        orderDirection:'desc',
        dateTarget:'content$preview.occurrence_date',
        pollution_cause:'',
        pollution_cause_list: [
          { text: '전체선택', value: '' },
          { text: '오염원1', value: '1' },
          { text: '오염원2', value: '2' },
          { text: '오염원3', value: '3' },
          { text: '오염원4', value: '4' },
          { text: '오염원5', value: '5' }
        ]
      },

      // approvalLine
      approvalLine: [],
      showApprovalLinePopup: false,
      showExcelDownload: false,
      listAll: [],

      table: {
        list: [],
        perPage: 7,
        keyword: ''
      },

      currentPage: 1,
      lastPage: 1
    }
  },

  computed: {
    excelList () {
      const list = []
      for (const data of this.listAll) {
        list.push({

          현장명: this.getPreview(data).field_name,
          오염원: this.getPollutionName(this.getPreview(data).pollution_cause),
          사고발생일: this.getPreview(data).occurrence_date,
          작성자: this.getPreview(data).writer,
          작성일: this.getPreview(data).write_date,
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
    async loadPostList () {
      const projectId = this.$route.params.proj_id
      const boardSlug = 'environment_report_accident' // first_risk(id:6)
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
      if (this.nav.keyword) keyword.push(this.nav.keyword)
      if (this.nav.pollution_cause) keyword.push(`content$preview.pollution_cause*${this.nav.pollution_cause}`)

      await this.$store.dispatch('approval/LOAD_POST_ALL', {
        projectId,
        boardSlug,
        page,
        perPage,
        keyword,
        dateBegin, dateTarget, dateEnd,
        orderTarget, orderDirection
      })

      this.table.list = this.$store.state.approval.list
      const listInfo = this.$store.state.approval.postListInfo
      this.currentPage = listInfo.current_page
      this.lastPage = listInfo.last_page

    },

    async loadPostListAll () {
      const projectId = this.$route.params.proj_id
      const boardSlug = 'environment_report_accident'
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
      if (this.nav.keyword) keyword.push(this.nav.keyword)
      if (this.nav.pollution_cause) keyword.push(`content$preview.pollution_cause*${this.nav.pollution_cause}`)

      await this.$store.dispatch('approval/LOAD_POST_ALL', {
        projectId,
        boardSlug,
        page,
        perPage,
        keyword,
        dateBegin, dateTarget, dateEnd,
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
      this.$emit('handleClickRegister', 'accident')
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

    handleItemClickDetail (data) {
      this.$router.push({path: `${this.rootPath}/state/report/accident/${data.post_id}`})
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
    },

    getPollutionName (index) {
      if (Number(index) === 1) return '오염원 1'
      if (Number(index) === 2) return '오염원 2'
      if (Number(index) === 3) return '오염원 3'
      if (Number(index) === 4) return '오염원 4'
      if (Number(index) === 5) return '오염원 5'
      return ''
    }
  }
}
</script>

<style scoped>

</style>
