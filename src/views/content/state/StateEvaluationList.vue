<template>
  <div>

    <!--  상단 검색바-->
    <search-nav class="mt-4" @handleSearch="handleSearch">
      <search-nav-item-date :label="$t('search.평가일')" v-model="nav.date" @handleSearch="handleSearch"/>
      <search-nav-item-project :label="$t('search.현장명')" v-model="nav.projectId" />
    </search-nav>

    <div class="w-full text-right mb-4">
      <vs-button class="mr-4" color="secondary" type="border" @click="excelDownFunc">{{$t('button.Excel 다운로드')}}</vs-button>
    </div>

    <vs-row>
      <vs-col>
        <vs-table stripe
                  ref="table"
                  :sst="true"
                  :max-items="table.perPage"
                  :data="table.list"
                  noDataText="데이터가 없습니다"
                  @sort="handleSort"
                  @selected="handleItemClickDetailBlank"
        >

          <template slot="thead">
            <vs-th sort-key="id" class="w-1/12"><span class="w-full text-center">{{$t('content.state.evaluation.list.column.No')}}</span></vs-th>
            <vs-th sort-key="content$preview.work_type" class="w-1/12"><span class="w-full text-center">{{$t('content.state.evaluation.list.column.구분')}}</span></vs-th>
            <vs-th sort-key="content$preview.field_name" class="w-3/12"><span class="w-full text-center">{{$t('content.state.evaluation.list.column.현장명')}}</span></vs-th>
            <vs-th sort-key="content$preview.company" class="w-2/12"><span class="w-full text-center">{{$t('content.state.evaluation.list.column.파트너사')}}</span></vs-th>
            <vs-th sort-key="contentd$preview.point" class="w-1/12"><span class="w-full text-center">{{$t('content.state.evaluation.list.column.평가점수')}}</span></vs-th>
            <vs-th sort-key="content$preview.grade" class="w-1/12"><span class="w-full text-center">{{$t('content.state.evaluation.list.column.평가등급')}}</span></vs-th>
            <vs-th class="w-1/12"><span class="w-full text-center">{{$t('content.state.evaluation.list.column.첨부문서')}}</span></vs-th>
            <vs-th sort-key="status" class="w-1/12"><span class="w-full text-center">{{$t('content.state.evaluation.list.column.결재상태')}}</span></vs-th>
            <vs-th sort-key="content$conference_date" class="w-2/12"><span class="w-full text-center">{{$t('content.state.evaluation.list.column.평가일')}}</span></vs-th>
            <vs-th style="width: 200px !important; display: inline-block;"><vs-col vs-type="flex" vs-justify="center">{{$t('content.state.evaluation.list.column.보기')}}</vs-col></vs-th>
          </template>


          <template slot-scope="{data}">
            <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">

              <vs-td class="text-center">{{ tr.post_id }}</vs-td>
              <vs-td class="text-center">{{ getPreview(tr).work_type }}</vs-td>
              <vs-td class="text-center">{{ getPreview(tr).field_name }}</vs-td>
              <vs-td class="text-center">{{ getPreview(tr).company }}</vs-td>
              <vs-td class="text-center">{{ getPreview(tr).point }}</vs-td>
              <vs-td class="text-center">{{ getPreview(tr).grade }}</vs-td>
              <vs-td class="text-center">
                <a download target="_blank" :href="img.path" v-for="(img, index) in getProjectAttachList(tr)" :key="index" @click.stop>
                  <vs-icon icon-pack="feather" icon="icon-file" />
                </a>
              </vs-td>
              <vs-td class="text-center">{{ tr.document_status.name }}</vs-td>
              <vs-td class="text-center">{{ getContents(tr).conference_date }}</vs-td>
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
      title="환경평가"/>

  </div>
</template>

<script>
import DateSelector from '../../../components/selector/DateSelector'
import SearchNav from '@/components/nav/SearchNav'
import SearchNavItemDate from '@/components/nav/SearchNavItemDate'
import SearchNavItemSelect from '@/components/nav/SearchNavItemSelect'
import SearchNavItemKeyword from '@/components/nav/SearchNavItemKeyword'
import PopupApprovalProcess from '@/views/approval/PopupApprovalProcess'
import PopupExcelDownload from '@/popup/PopupExcelDownload'
import SearchNavItemProject from '@/components/nav/SearchNavItemProject'
import KPagination from '@/components/kPagination/kPagination'


export default {
  name: 'StateEvaluationList',
  components: {
    KPagination,
    SearchNavItemProject,
    PopupExcelDownload,
    PopupApprovalProcess,
    SearchNavItemKeyword,
    SearchNavItemSelect,
    SearchNavItemDate,
    SearchNav,
    DateSelector
  },

  computed: {
    excelList () {
      const list = []
      for (const data of this.table.listAll) {
        list.push({
          'No.': data.post_id,
          '구분': this.getPreview(data).work_type,
          '현장명': this.getPreview(data).field_name,
          '파트너사': this.getPreview(data).company,
          '평가점수': this.getPreview(data).point,
          '평가등급': this.getPreview(data).grade,
          '결재상태': data.document_status.name
        })
      }
      return list
    }
  },
  data () {
    return {
      // 검색 네비게이션
      nav: {
        projectId:'',
        date: ['', ''],
        keyword: '',
        orderNum: '',
        orderNumList: [],
        orderTarget:'created_at',
        orderDirection:'desc',
        dateTarget:'content$conference_date'
      },

      // approvalLine
      approvalLine: [],
      showApprovalLinePopup: false,
      showExcelDownload: false,

      rootPath: '', // 프로젝트의 rootPath

      table: {
        list: [],
        listAll: [],
        perPage: 10,
        keyword: '',
        currentPage: 1,
        lastPage: 1
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
      const projectId = this.nav.projectId
      const boardSlug = 'environment_evaluation' // project_monthly_report (id:3)
      const page = this.table.currentPage
      const perPage = this.table.perPage
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
      this.table.currentPage = listInfo.current_page
      this.table.lastPage = listInfo.last_page

    },

    async loadPostListAll () {
      const projectId = this.nav.projectId
      const boardSlug = 'environment_evaluation'
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

      await this.$store.dispatch('approval/LOAD_POST_ALL', {
        projectId,
        boardSlug,
        page,
        perPage,
        keyword,
        dateBegin, dateTarget, dateEnd,
        orderTarget, orderDirection
      })
      this.table.listAll = JSON.parse(JSON.stringify(this.$store.state.approval.list))
      await this.loadPostList()
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

    async excelDownFunc () {
      await this.loadPostListAll()
      this.showExcelDownload = true
    },

    getPreview (data) {
      if (data.post && data.post.preview) {
        const preview = JSON.parse(data.post.preview)
        return preview
      }
    },

    getContents (data) {
      if (data.post.post_content) {
        const preview = JSON.parse(data.post.post_content)
        return preview
      }
    },

    handleItemClickDetail (data) {
      this.$router.push({path: `/project/${data.project_id}/state/evaluation/${data.post_id}`})
    },
    handleItemClickDetailBlank (data) {
      if (data) {
        const routeData = this.$router.resolve(`/project/${data.project_id}/state/evaluation/${data.post_id}`)
        window.open(routeData.href, '_blank')
      }
    },

    handleSort (key, type) {
      if (key) {
        this.nav.orderTarget = key
        this.nav.orderDirection = type
        this.loadPostList()
      }

    },

    handleClickRegister () {
      this.$router.push({path: `${this.rootPath}/state/evaluation/create`})
    },

    handleClickApprovalLine () {
      this.showApprovalLinePopup = true
    },

    handleSearch () {
      this.currentPage = 1
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
