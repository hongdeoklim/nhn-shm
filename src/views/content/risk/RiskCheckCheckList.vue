<template>
  <div>
    <search-nav @handleSearch="handleSearch">
      <search-nav-item-project :label="$t('search.현장명')" v-model="nav.projectId" />
      <search-nav-item-keyword :label="$t('차수')" v-model="nav.orderNum"/>
    </search-nav>

    <vs-row class="mb-4">
      <vs-col class="flex" vs-justify="flex-end">
        <vs-button class="mr-2" type="border" color="secondary" @click="excelDownFunc">{{$t('button.Excel 다운로드')}}</vs-button>
      </vs-col>
    </vs-row>

    <vs-row>
      <vs-col>
        <vs-table class="mr-6 mb-4"
                  ref="table"
                  stripe
                  :data="table.list"
                  :sst="true"
                  :max-items="table.perPage"
                  color="success"

                  @sort="handleSort"
                  @selected="handleItemClickDetailBlank"
        >

          <template slot="thead">
            <vs-th sort-key="id" ><span class="w-full text-center">{{$t('content.risk.check.checklist.column.No')}}</span></vs-th>
            <vs-th sort-key="content$preview.title" ><span class="w-full text-center">{{$t('content.risk.check.checklist.column.현장명')}}</span></vs-th>
            <vs-th sort-key="content$preview.company" ><span class="w-full text-center">{{$t('content.risk.check.checklist.column.파트너사')}}</span></vs-th>
            <vs-th sort-key="contentd$preview.orderNumber" ><span class="w-full text-center">{{$t('content.risk.check.checklist.column.차수')}}</span></vs-th>
            <vs-th ><span class="w-full text-center">{{$t('content.risk.check.checklist.column.대상기간')}}</span></vs-th>
            <vs-th style="width: 200px !important; display: inline-block;"><vs-col vs-type="flex" vs-justify="center">{{$t('content.risk.check.checklist.column.보기')}}</vs-col></vs-th>
          </template>

          <template slot-scope="{data}">
            <vs-tr class="text-center" :data="tr" :key="indextr" v-for="(tr, indextr) in data">

              <vs-td> {{tr.id}} </vs-td>
              <vs-td> {{getPreview(tr).title}} </vs-td>
              <vs-td> {{getPreview(tr).company}} </vs-td>
              <vs-td> {{getPreview(tr).orderNumber + '차'}} </vs-td>
              <vs-td> {{getPreview(tr).date}} </vs-td>
              <vs-td class="text-center">
                <div class="flex justify-center">
                  <vs-button type="border" icon="open_in_new" class="mr-1" @click.stop  @click="()=>{handleItemClickDetailBlank(tr)}"></vs-button>
                  <vs-button type="border" @click.stop @click="()=>{handleItemClickDetail(tr)}">{{$t('button.바로가기')}}</vs-button>
                </div>
              </vs-td>

            </vs-tr>
          </template>
        </vs-table>

        <div class="vs-con-table">
          <div class="con-pagination-table vs-table--pagination">
            <k-pagination
              :total="(table.lastPage) ? table.lastPage : 1"
              v-model="table.currentPage" @change="handleChangePage"></k-pagination>
          </div>
        </div>
      </vs-col>
    </vs-row>

    <popup-excel-download
      v-model="showExcelDownload"
      :list="excelList"
      title="일일안전점검표"/>
  </div>
</template>

<script>
import SearchNav from '@/components/nav/SearchNav'
import SearchNavItemSelect from '@/components/nav/SearchNavItemSelect'
import SearchNavItemDate from '@/components/nav/SearchNavItemDate'
import SearchNavItemKeyword from '@/components/nav/SearchNavItemKeyword'
import KPagination from '@/components/kPagination/kPagination'
import SearchNavItemProject from '@/components/nav/SearchNavItemProject'
import PopupExcelDownload from '@/popup/PopupExcelDownload'
export default {
  name: 'RiskCheckDailySafetyChecklist',
  components: {
    PopupExcelDownload,
    SearchNavItemProject,
    KPagination,
    SearchNavItemKeyword,
    SearchNavItemDate,
    SearchNavItemSelect,
    SearchNav},
  data () {
    return {
      // 검색 네비게이션
      nav: {
        date: ['', ''],
        orderNum:'',
        projectId:'',
        dateTarget:'created_at',
        orderTarget:'created_at',
        orderDirection:'desc'
      },

      showExcelDownload: false,
      table: {
        list:[],
        perPage:10,
        keyword:'',
        lastPage:1,
        currentPage:1
      },
      listAll:[]
    }
  },

  computed: {
    excelList () {
      const list = []
      for (const data of this.listAll) {
        list.push({
          'No.': data.id,
          '현장명': this.getPreview(data).title,
          '파트너사': this.getPreview(data).company,
          '차수': this.getPreview(data).orderNumber + '차',
          '대상기간': this.getPreview(data).date,
        })
      }

      return list
    }
  },

  created () {
    this.loadPostList()
  },

  methods:{
    async loadPostList () {
      const projectId = this.nav.projectId
      const boardId = 12
      const page = this.table.currentPage
      const perPage = 10
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

      // 현재 페이지의 공지사항을 불러온다.
      await this.$store.dispatch('board/LOAD_POST_LIST', {
        projectId,
        boardId,
        page,
        perPage,
        dateTarget, dateBegin, dateEnd,
        orderTarget, orderDirection,
        keyword
      })
      const postListInfo = this.$store.state.board.postListInfo
      this.table.list = postListInfo.data
      this.table.currentPage = postListInfo.current_page
      this.table.lastPage = postListInfo.last_page

    },

    async loadPostListAll () {
      const projectId = this.nav.projectId
      const boardId = 12
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

      // 현재 페이지의 공지사항을 불러온다.
      await this.$store.dispatch('board/LOAD_POST_LIST', {
        projectId,
        boardId,
        page,
        perPage,
        dateTarget, dateBegin, dateEnd,
        orderTarget, orderDirection,
        keyword
      })
      this.listAll = JSON.parse(JSON.stringify(this.$store.state.board.list))
      await this.loadPostList()
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
    handleItemClickDetail (data) {
      if (data) {
        this.$router.push(`/project/${data.project_id}/risk/check/checklist/${data.id}`)
      }
    },
    handleItemClickDetailBlank (data) {
      if (data) {
        const routeData = this.$router.resolve(`/project/${data.project_id}/risk/check/checklist/${data.id}`)
        window.open(routeData.href, '_blank')
      }
    },

    handleSearch () {
      this.loadPostList()
    },

    handleChangePage (page) {
      this.table.currentPage = page
      this.loadPostList()
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
