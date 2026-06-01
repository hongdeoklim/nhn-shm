<template>
  <div>

    <search-nav @handleSearch="handleSearch">
      <search-nav-item-project :label="$t('search.현장명')" v-model="nav.projectId" />
    </search-nav>

    <vs-row class="mb-4">
      <vs-col class="flex" vs-justify="flex-end">
        <vs-button class="mr-2" type="border" color="secondary" @click="excelDownFunc">{{$t('button.Excel 다운로드')}}</vs-button>
      </vs-col>
    </vs-row>

    <vs-row  class="mb-4">
      <vs-col>
        <vs-table
          class="mr-6 mb-4"

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
            <vs-th sort-key="id"><span class="w-full text-center">{{$t('content.risk.check.checklogall.column.No')}}</span></vs-th>
            <vs-th sort-key="content$preview.project_title"><span class="w-full text-center">{{$t('content.risk.check.checklogall.column.현장명')}}</span></vs-th>
            <vs-th sort-key="content$preview.title"><span class="w-full text-center">{{$t('content.risk.check.checklogall.column.기안제목')}}</span></vs-th>
            <vs-th sort-key="content$preview.checkDate"><span class="w-full text-center">{{$t('content.risk.check.checklogall.column.점검일')}}</span></vs-th>
            <vs-th sort-key="content$preview.writer"><span class="w-full text-center">{{$t('content.risk.check.checklogall.column.작성자')}}</span></vs-th>
            <vs-th sort-key="content$preview.status"><span class="w-full text-center">{{$t('content.risk.check.checklogall.column.결재상태')}}</span></vs-th>
            <vs-th style="width: 200px !important; display: inline-block;"><vs-col vs-type="flex" vs-justify="center">{{$t('content.risk.check.checklogall.column.보기')}}</vs-col></vs-th>
          </template>

          <template slot-scope="{data}">
            <vs-tr class="text-center" :data="tr" :key="indextr" v-for="(tr, indextr) in data">
              <vs-td>{{tr.post_id}}</vs-td>
              <vs-td>{{getPreview(tr).project_title}}</vs-td>
              <vs-td>{{getPreview(tr).title}}</vs-td>
              <vs-td>{{getPreview(tr).checkDate}}</vs-td>
              <vs-td>{{getPreview(tr).writer}}</vs-td>
              <vs-td>{{tr.document_status.name}}</vs-td>
              <vs-td class="text-center">
                <div class="flex justify-center">
                  <vs-button type="border" icon="open_in_new" class="mr-1" @click="()=>{handleItemClickDetailBlank(tr)}"></vs-button>
                  <vs-button type="border" @click.stop="()=>{handleItemClickDetail(tr)}">{{$t('button.바로가기')}}</vs-button>
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
      title="합동점검일지"/>
  </div>
</template>

<script>
import SearchNav from '@/components/nav/SearchNav'
import SearchNavItemDate from '@/components/nav/SearchNavItemDate'
import SearchNavItemSelect from '@/components/nav/SearchNavItemSelect'
import SearchNavItemKeyword from '@/components/nav/SearchNavItemKeyword'
import SearchNavItemProject from '@/components/nav/SearchNavItemProject'
import PopupExcelDownload from '@/popup/PopupExcelDownload'
import KPagination from '@/components/kPagination/kPagination'
export default {
  name: 'RiskCheckAllSafetyLog',
  components: {
    KPagination,
    PopupExcelDownload,
    SearchNavItemProject,
    SearchNavItemKeyword, SearchNavItemSelect, SearchNavItemDate, SearchNav},
  data () {
    return {
      // 검색 네비게이션
      nav:{
        projectId:'',
        orderTarget:'created_at',
        orderDirection:'desc'
      },

      rootPath: '', // 프로젝트의 rootPath
      postId: '',
      table: {
        list:[],
        perPage:5,
        keyword:'',
        lastPage:1,
        currentPage:1
      },
      listAll:[],
      showExcelDownload:false,
    }
  },

  computed: {
    excelList () {
      const list = []
      for (const data of this.listAll) {
        list.push({
          'No.': data.post_id,
          '현장명': this.getPreview(data).project_title,
          '제목': this.getPreview(data).title ,
          '점검일': this.getPreview(data).checkDate,
          '작성자': this.getPreview(data).writer,
          '상태': data.document_status.name,
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
      const projectId = this.nav.projectId
      const boardSlug = 'joint_check_diary' // first_risk(id:6)
      const page = this.table.currentPage
      const perPage = this.table.perPage
      const orderTarget = this.nav.orderTarget
      const orderDirection = this.nav.orderDirection
      await this.$store.dispatch('approval/LOAD_POST_ALL', {projectId, boardSlug, page, perPage, orderTarget, orderDirection})

      this.table.list = this.$store.state.approval.list
      const listInfo = this.$store.state.approval.postListInfo
      this.table.currentPage = listInfo.current_page
      this.table.lastPage = listInfo.last_page
    },

    async loadPostListAll () {
      const projectId = this.nav.projectId
      const boardSlug = 'joint_check_diary' // first_risk(id:6)
      const page = 1
      const perPage = 10000
      const orderTarget = this.nav.orderTarget
      const orderDirection = this.nav.orderDirection
      await this.$store.dispatch('approval/LOAD_POST_ALL', {projectId, boardSlug, page, perPage, orderTarget, orderDirection})

      this.listAll = JSON.parse(JSON.stringify(this.$store.state.approval.list))
      await this.loadPostList()
    },

    async excelDownFunc () {
      await this.loadPostListAll()
      this.showExcelDownload = true
    },

    getPreview (data) {
      if (data.post.preview) {
        const preview = JSON.parse(data.post.preview)
        return preview
      }
    },

    handleItemClickDetail (data) {
      if (data.post) {
        this.$router.push(`/project/${data.post.project_id}/risk/check/checklogall/${data.post.id}`)
      }
    },
    handleItemClickDetailBlank (data) {
      if (data.post) {
        const routeData = this.$router.resolve(`/project/${data.post.project_id}/risk/check/checklogall/${data.post.id}`)
        window.open(routeData.href, '_blank')
      }
    },

    handleClickRegister () {
      this.$emit('handleClickRegister', 'checklogall')
    },

    handleSort (key, type) {
      if (key) {
        this.nav.orderTarget = key
        this.nav.orderDirection = type
        this.loadPostList()
      }
    },

    handleChangePage (page) {
      this.table.currentPage = page
      this.loadPostList()
    },

    handleSearch () {
      this.loadPostList()
    }
  }
}
</script>

<style scoped>

</style>
