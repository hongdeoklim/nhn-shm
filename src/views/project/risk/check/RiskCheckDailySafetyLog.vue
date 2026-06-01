<template>
<div>

  <search-nav @handleSearch="handleSearch">
    <search-nav-item-keyword label="키워드" v-model="nav.keyword" />
  </search-nav>

  <vs-row>
    <vs-col class="flex" vs-justify="flex-end">
      <vs-button class="mr-2" type="border" color="secondary" @click="excelDownFunc">{{$t('button.Excel 다운로드')}}</vs-button>
      <vs-button class="mr-2" type="border" color="secondary" @click="handleClickApprovalLine">{{$t('button.결재선 지정')}}</vs-button>
      <vs-button color="secondary" @click="handleClickRegister">신규작성</vs-button>
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
          <vs-th sort-key="content$preview.title"><span class="w-full text-center">현장명</span></vs-th>
          <vs-th sort-key="content$preview.date"><span class="w-full text-center">대상기간</span></vs-th>
          <vs-th sort-key="content$preview.checkDate"><span class="w-full text-center">점검일</span></vs-th>
          <vs-th sort-key="content$preview.writer"><span class="w-full text-center">점검자</span></vs-th>
          <vs-th sort-key="status"><span class="w-full text-center">결재상태</span></vs-th>
        </template>

        <template slot-scope="{data}">
          <vs-tr class="text-center" :data="tr" :key="indextr" v-for="(tr, indextr) in data">
            <vs-td>{{tr.post_id}}</vs-td>
            <vs-td>{{getPreview(tr).title}}</vs-td>
            <vs-td>{{getPreview(tr).date}}</vs-td>
            <vs-td>{{getPreview(tr).checkDate}}</vs-td>
            <vs-td>{{getPreview(tr).writer}}</vs-td>
            <vs-td>{{tr.document_status.name}}</vs-td>

          </vs-tr>
        </template>
      </vs-table>
<!--      <vs-tabs>-->
<!--        <vs-tab label="안전보건부서장">-->
<!--          <vs-table-->
<!--            class="mr-6 mb-4"-->

<!--            ref="table"-->
<!--            stripe-->
<!--            :data="table.list"-->
<!--            :sst="true"-->
<!--            :max-items="table.perPage"-->
<!--            color="success"-->

<!--            @sort="handleSort"-->
<!--            @selected="handleItemClickDetail">-->

<!--            <template slot="thead">-->
<!--              <vs-th sort-key="id"><span class="w-full text-center">No.</span></vs-th>-->
<!--              <vs-th sort-key="content$preview.title"><span class="w-full text-center">현장명</span></vs-th>-->
<!--              <vs-th sort-key="contentd$preview.orderNumber"><span class="w-full text-center">차수</span></vs-th>-->
<!--              <vs-th sort-key="content$preview.date"><span class="w-full text-center">대상기간</span></vs-th>-->
<!--              <vs-th sort-key="content$preview.checkDate"><span class="w-full text-center">점검일</span></vs-th>-->
<!--              <vs-th sort-key="content$preview.writer"><span class="w-full text-center">점검자</span></vs-th>-->
<!--              <vs-th sort-key="status"><span class="w-full text-center">결재상태</span></vs-th>-->
<!--            </template>-->

<!--            <template slot-scope="{data}">-->
<!--              <vs-tr class="text-center" :data="tr" :key="indextr" v-for="(tr, indextr) in data">-->
<!--                <vs-td>{{tr.post_id}}</vs-td>-->
<!--                <vs-td>{{getPreview(tr).title}}</vs-td>-->
<!--                <vs-td>{{getPreview(tr).orderNumber}}</vs-td>-->
<!--                <vs-td>{{getPreview(tr).date}}</vs-td>-->
<!--                <vs-td>{{getPreview(tr).checkDate}}</vs-td>-->
<!--                <vs-td>{{getPreview(tr).writer}}</vs-td>-->
<!--                <vs-td>{{tr.document_status.name}}</vs-td>-->

<!--              </vs-tr>-->
<!--            </template>-->
<!--          </vs-table>-->

<!--        </vs-tab>-->


<!--        <vs-tab label="시공">-->
<!--          <vs-table-->
<!--            class="mr-6 mb-4"-->

<!--            ref="table"-->
<!--            stripe-->
<!--            :data="table.list"-->
<!--            :sst="true"-->
<!--            :max-items="table.perPage"-->
<!--            color="success"-->

<!--            @sort="handleSort"-->
<!--            @selected="handleItemClickDetail">-->

<!--            <template slot="thead">-->
<!--              <vs-th sort-key="id"><span class="w-full text-center">No.</span></vs-th>-->
<!--              <vs-th sort-key="content$preview.title"><span class="w-full text-center">현장명</span></vs-th>-->
<!--              <vs-th sort-key="contentd$preview.orderNumber"><span class="w-full text-center">차수</span></vs-th>-->
<!--              <vs-th sort-key="content$preview.date"><span class="w-full text-center">대상기간</span></vs-th>-->
<!--              <vs-th sort-key="content$preview.checkDate"><span class="w-full text-center">점검일</span></vs-th>-->
<!--              <vs-th sort-key="content$preview.writer"><span class="w-full text-center">점검자</span></vs-th>-->
<!--              <vs-th sort-key="status"><span class="w-full text-center">결재상태</span></vs-th>-->
<!--            </template>-->

<!--            <template slot-scope="{data}">-->
<!--              <vs-tr class="text-center" :data="tr" :key="indextr" v-for="(tr, indextr) in data">-->
<!--                <vs-td>{{tr.post_id}}</vs-td>-->
<!--                <vs-td>{{getPreview(tr).title}}</vs-td>-->
<!--                <vs-td>{{getPreview(tr).orderNumber}}</vs-td>-->
<!--                <vs-td>{{getPreview(tr).date}}</vs-td>-->
<!--                <vs-td>{{getPreview(tr).checkDate}}</vs-td>-->
<!--                <vs-td>{{getPreview(tr).writer}}</vs-td>-->
<!--                <vs-td>{{tr.document_status.name}}</vs-td>-->

<!--              </vs-tr>-->
<!--            </template>-->
<!--          </vs-table>-->
<!--        </vs-tab>-->

<!--        <vs-tab label="안전">-->
<!--          <vs-table-->
<!--            class="mr-6 mb-4"-->

<!--            ref="table"-->
<!--            stripe-->
<!--            :data="table.list"-->
<!--            :sst="true"-->
<!--            :max-items="table.perPage"-->
<!--            color="success"-->

<!--            @sort="handleSort"-->
<!--            @selected="handleItemClickDetail">-->

<!--            <template slot="thead">-->
<!--              <vs-th sort-key="id"><span class="w-full text-center">No.</span></vs-th>-->
<!--              <vs-th sort-key="content$preview.title"><span class="w-full text-center">현장명</span></vs-th>-->
<!--              <vs-th sort-key="contentd$preview.orderNumber"><span class="w-full text-center">차수</span></vs-th>-->
<!--              <vs-th sort-key="content$preview.date"><span class="w-full text-center">대상기간</span></vs-th>-->
<!--              <vs-th sort-key="content$preview.checkDate"><span class="w-full text-center">점검일</span></vs-th>-->
<!--              <vs-th sort-key="content$preview.writer"><span class="w-full text-center">점검자</span></vs-th>-->
<!--              <vs-th sort-key="status"><span class="w-full text-center">결재상태</span></vs-th>-->
<!--            </template>-->

<!--            <template slot-scope="{data}">-->
<!--              <vs-tr class="text-center" :data="tr" :key="indextr" v-for="(tr, indextr) in data">-->
<!--                <vs-td>{{tr.post_id}}</vs-td>-->
<!--                <vs-td>{{getPreview(tr).title}}</vs-td>-->
<!--                <vs-td>{{getPreview(tr).orderNumber}}</vs-td>-->
<!--                <vs-td>{{getPreview(tr).date}}</vs-td>-->
<!--                <vs-td>{{getPreview(tr).checkDate}}</vs-td>-->
<!--                <vs-td>{{getPreview(tr).writer}}</vs-td>-->
<!--                <vs-td>{{tr.document_status.name}}</vs-td>-->

<!--              </vs-tr>-->
<!--            </template>-->
<!--          </vs-table>-->
<!--        </vs-tab>-->

<!--        <vs-tab label="파트너사">-->
<!--          <vs-table-->
<!--            class="mr-6 mb-4"-->

<!--            ref="table"-->
<!--            stripe-->
<!--            :data="table.list"-->
<!--            :sst="true"-->
<!--            :max-items="table.perPage"-->
<!--            color="success"-->

<!--            @sort="handleSort"-->
<!--            @selected="handleItemClickDetail">-->

<!--            <template slot="thead">-->
<!--              <vs-th sort-key="id"><span class="w-full text-center">No.</span></vs-th>-->
<!--              <vs-th sort-key="content$preview.title"><span class="w-full text-center">현장명</span></vs-th>-->
<!--              <vs-th sort-key="contentd$preview.orderNumber"><span class="w-full text-center">차수</span></vs-th>-->
<!--              <vs-th sort-key="content$preview.date"><span class="w-full text-center">대상기간</span></vs-th>-->
<!--              <vs-th sort-key="content$preview.checkDate"><span class="w-full text-center">점검일</span></vs-th>-->
<!--              <vs-th sort-key="content$preview.writer"><span class="w-full text-center">점검자</span></vs-th>-->
<!--              <vs-th sort-key="status"><span class="w-full text-center">결재상태</span></vs-th>-->
<!--            </template>-->

<!--            <template slot-scope="{data}">-->
<!--              <vs-tr class="text-center" :data="tr" :key="indextr" v-for="(tr, indextr) in data">-->
<!--                <vs-td>{{tr.post_id}}</vs-td>-->
<!--                <vs-td>{{getPreview(tr).title}}</vs-td>-->
<!--                <vs-td>{{getPreview(tr).orderNumber}}</vs-td>-->
<!--                <vs-td>{{getPreview(tr).date}}</vs-td>-->
<!--                <vs-td>{{getPreview(tr).checkDate}}</vs-td>-->
<!--                <vs-td>{{getPreview(tr).writer}}</vs-td>-->
<!--                <vs-td>{{tr.document_status.name}}</vs-td>-->

<!--              </vs-tr>-->
<!--            </template>-->
<!--          </vs-table>-->
<!--        </vs-tab>-->
<!--      </vs-tabs>-->
    </vs-col>
  </vs-row>

  <popup-approval-process
    :show-popup="showApprovalLinePopup"
    @closePopup="handleCloseApprovalPopup"/>

  <popup-excel-download
    v-model="showExcelDownload"
    :list="excelList"
    title="안전점검일지"/>

</div>
</template>

<script>
import SearchNav from '@/components/nav/SearchNav'
import SearchNavItemSelect from '@/components/nav/SearchNavItemSelect'
import SearchNavItemDate from '@/components/nav/SearchNavItemDate'
import SearchNavItemKeyword from '@/components/nav/SearchNavItemKeyword'
import PopupApprovalProcess from '@/views/approval/PopupApprovalProcess'
import PopupExcelDownload from '@/popup/PopupExcelDownload'
export default {
  name: 'RiskCheckDailySafetyLog',
  components: {
    PopupExcelDownload,
    PopupApprovalProcess,
    SearchNavItemKeyword, SearchNavItemDate, SearchNavItemSelect, SearchNav},
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
      currentPage:1,
      lastPage:1,

      rootPath:'', // 프로젝트의 rootPath
      postId:'',
      table:{
        list:[],
        perPage: 5,
        keyword: ''
      },
      listAll:[],

      showApprovalLinePopup:false,
      showExcelDownload: false
    }
  },

  computed: {
    excelList () {
      const list = []
      for (const data of this.listAll) {
        list.push({
          'No.': data.post_id,
          '현장명': this.getPreview(data).title,
          '차수':`${this.getPreview(data).orderNumber}차`,
          '대상기간': this.getPreview(data).date,
          '점검일': this.getPreview(data).checkDate,
          '점검자': this.getPreview(data).writer,
          '결재상태': data.document_status.name,
        })
      }
      return list
    }
  },

  async created () {
    const paths = this.$route.path.split('/')
    this.rootPath = `/${paths[1]}/${paths[2]}`
    await this.loadPostList()
    await this.loadOrderList()
  },
  methods: {

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
      const boardSlug = 'daily_safety_check_diary' // first_risk(id:6)
      const page = this.currentPage
      const perPage = this.table.perPage
      const orderTarget = this.nav.orderTarget
      const orderDirection = this.nav.orderDirection
      const keyword = []

      if (this.nav.keyword) keyword.push(this.nav.keyword)
      if (this.nav.orderNum) keyword.push(`content$preview.orderNumber*${this.nav.orderNum}`)

      await this.$store.dispatch('approval/LOAD_POST_ALL', {projectId, boardSlug, page, perPage, keyword, orderTarget, orderDirection})

      this.table.list = this.$store.state.approval.list
      const listInfo = this.$store.state.approval.postListInfo
      this.currentPage = listInfo.current_page
      this.lastPage = listInfo.last_page
    },

    async loadPostListAll () {
      const projectId = this.$route.params.proj_id
      const boardSlug = 'daily_safety_check_diary' // first_risk(id:6)
      const page = 1
      const perPage = 1000
      const orderTarget = this.nav.orderTarget
      const orderDirection = this.nav.orderDirection
      const keyword = []

      if (this.nav.keyword) keyword.push(this.nav.keyword)
      if (this.nav.orderNum) keyword.push(`content$preview.orderNumber*${this.nav.orderNum}`)

      await this.$store.dispatch('approval/LOAD_POST_ALL', {projectId, boardSlug, page, perPage, keyword, orderTarget, orderDirection})

      this.listAll = this.$store.state.approval.list
    },

    getPreview (data) {
      if (data.post.preview) {
        const preview = JSON.parse(data.post.preview)
        return preview
      }
    },

    handleItemClickDetail (data) {
      this.$emit('handleClickItem', 'checklog', data.post_id)
    },

    handleSort (key, type) {
      if (key) {
        this.nav.orderTarget = key
        this.nav.orderDirection = type
        this.loadPostList()
      }

    },

    handleClickRegister () {
      this.$emit('handleClickRegister', 'checklog')
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
