<template>
<div>
  <search-nav @handleSearch="handleSearch">
    <search-nav-item-select label="차수" :list="nav.list" v-model="nav.orderNum" />
    <search-nav-item-keyword label="키워드" v-model="nav.keyword" />
  </search-nav>

  <vs-row class="mb-4">
    <vs-col class="flex" vs-justify="flex-end">
      <vs-button class="mr-2" type="border" color="secondary" @click="excelDownFunc">{{$t('button.Excel 다운로드')}}</vs-button>
    </vs-col>
  </vs-row>

  <vs-row>
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
          <vs-th sort-key="content$title"><span class="w-full text-center">현장명</span></vs-th>
          <vs-th sort-key="content$company"><span class="w-full text-center">소속</span></vs-th>
          <vs-th sort-key="contentd$orderNumber"><span class="w-full text-center">차수</span></vs-th>
          <vs-th sort-key="content$date"><span class="w-full text-center">대상기간</span></vs-th>
        </template>

        <template slot-scope="{data}">
          <vs-tr class="text-center" :data="tr" :key="indextr" v-for="(tr, indextr) in data">

            <vs-td>{{tr.id}}</vs-td>
            <vs-td>{{getPreview(tr).title}}</vs-td>
            <vs-td>{{getPreview(tr).company}}</vs-td>
            <vs-td>{{getPreview(tr).orderNumber + '차'}}</vs-td>
            <vs-td>{{getPreview(tr).date}}</vs-td>

          </vs-tr>
        </template>
      </vs-table>

      <div class="vs-con-table">
        <div class="con-pagination-table vs-table--pagination">
          <k-pagination
            :total="(table.lastPage) ? table.lastPage : 1"
            v-model="table.currentPage"></k-pagination>
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
import PopupExcelDownload from '@/popup/PopupExcelDownload'
export default {
  name: 'RiskCheckDailySafetyChecklistAlways',
  components: {
    PopupExcelDownload,
    KPagination,
    SearchNavItemKeyword,
    SearchNavItemDate,
    SearchNavItemSelect,
    SearchNav},
  data () {
    return {
      // 검색 네비게이션
      nav:{
        date:['', ''],
        list:[],
        orderNum:'',
        keyword:'',
        orderTarget:'created_at',
        orderDirection:'desc'
      },

      table: {
        list:[],
        perPage:10,
        keyword:'',
        lastPage:1,
        currentPage:1
      },

      listAll: [],
      showExcelDownload: false
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
          '차수':`${this.getPreview(data).orderNumber}차`,
          '대상기간': this.getPreview(data).date
        })
      }
      return list
    }
  },

  async created () {
    await this.loadPostList()
    await this.loadOrderList()
  },

  methods:{
    async loadOrderList () {
      const page = 1
      const perPage = 10000
      const projectId = this.$route.params.proj_id
      await this.$store.dispatch('project/LOAD_PROJECT_ORDER', {page, perPage, projectId})
      const orderList = this.$store.state.project.orderList
      this.nav.list = []
      this.nav.list.push({value:'', text:'{선택안함}'})
      for (const order of orderList) {
        this.nav.list.push({value:order.order_number, text:`${order.order_number}차`})
      }
    },

    async loadPostList () {
      const projectId = this.$route.params.proj_id
      const boardId = 43 // 수시 일일안전점검표 daily_safety_always_check_table
      const page = 1
      const perPage = 100
      const orderTarget = this.nav.orderTarget
      const orderDirection = this.nav.orderDirection
      const keyword = []
      if (this.nav.keyword) keyword.push(`content$preview.company*%${this.nav.keyword}%`)
      if (this.nav.orderNum) keyword.push(`contentd$preview.orderNumber*${this.nav.orderNum}`)

      await this.$store.dispatch('board/LOAD_POST_LIST', {projectId, boardId, page, perPage, keyword, orderTarget, orderDirection})
      const postListInfo = this.$store.state.board.postListInfo
      this.table.list = postListInfo.data


    },
    async loadPostListAll () {
      const projectId = this.$route.params.proj_id
      const boardId = 43 // 수시 일일안전점검표 daily_safety_always_check_table
      const page = 1
      const perPage = 1000
      const keyword = []
      const orderTarget = this.nav.orderTarget
      const orderDirection = this.nav.orderDirection
      if (this.nav.keyword) keyword.push(`content$preview.company*%${this.nav.keyword}%`)
      if (this.nav.orderNum) keyword.push(`contentd$preview.orderNumber*${this.nav.orderNum}`)

      await this.$store.dispatch('board/LOAD_POST_LIST', {projectId, boardId, page, perPage, keyword, orderTarget, orderDirection})
      const postListInfo = this.$store.state.board.postListInfo
      this.listAll = postListInfo.data

    },


    getPreview (data) {
      if (data.preview) {
        const preview = JSON.parse(data.preview)
        return preview
      }
    },


    handleItemClickDetail (data) {
      this.$emit('handleClickItem', 'checklist-always', data.id)
    },

    handleSort (key, type) {
      if (key) {
        this.nav.orderTarget = key
        this.nav.orderDirection = type
        this.loadPostList()
      }

    },

    handleSearch () {
      this.loadPostList()
    },

    async excelDownFunc () {
      await this.loadPostListAll()
      this.showExcelDownload = true
    },
  }
}
</script>

<style scoped>

</style>
