<template>
  <div>
    <!--  상단 검색바-->
    <search-nav class="mt-4" @handleSearch="handleSearch">
      <search-nav-item-date :label="$t('search.대상기간')" v-model="nav.date" @handleSearch="handleSearch"/>
      <search-nav-item-select :label="$t('search.차수')" v-model="nav.orderNum" :list="nav.orderNumList" @change="handleSearch"/>
      <search-nav-item-project :label="$t('search.현장명')" v-model="nav.projectId" />
    </search-nav>


    <vs-row class="mb-8">
      <vs-col class="w-full flex " vs-justify="flex-end">
        <vs-button class="mr-4" color="secondary" type="border" @click="excelDownFunc">{{$t('button.Excel 다운로드')}}</vs-button>
      </vs-col>
    </vs-row>

    <vs-row>
      <vs-col>
        <vs-table stripe
                  ref="table"
                  :sst="true"
                  pagination
                  noDataText="데이터가 없습니다"
                  :max-items="table.perPage"
                  :data="table.list">


          <template slot="thead">
            <vs-th><span class="w-full text-center"><vs-checkbox></vs-checkbox></span></vs-th>
            <vs-th><span class="w-full text-center">{{$t('content.state.check.monitoring.column.No')}}</span></vs-th>
            <vs-th><span class="w-full text-center">{{$t('content.state.check.monitoring.column.현장명')}}</span></vs-th>
            <vs-th><span class="w-full text-center">{{$t('content.state.check.monitoring.column.기간(점검주)')}}</span></vs-th>
            <vs-th><span class="w-full text-center">{{$t('content.state.check.monitoring.column.점검실시')}}</span></vs-th>
            <vs-th><span class="w-full text-center">{{$t('content.state.check.monitoring.column.첨부파일')}}</span></vs-th>
            <vs-th><span class="w-full text-center">{{$t('content.state.check.monitoring.column.월간점검 실시여부')}}</span></vs-th>
            <vs-th><span class="w-full text-center">{{$t('content.state.check.monitoring.column.점검증빙')}}</span></vs-th>
            <vs-th><span class="w-full text-center">{{$t('content.state.check.monitoring.column.환경Issue')}}</span></vs-th>
            <vs-th style="width: 200px !important; display: inline-block;"><vs-col vs-type="flex" vs-justify="center">{{$t('content.state.check.monitoring.column.보기')}}</vs-col></vs-th>
          </template>


          <template slot-scope="{data}">
            <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">

              <vs-td class="text-center">
                <vs-checkbox></vs-checkbox>
              </vs-td>
              <vs-td class="text-center">{{ tr.post_id }}</vs-td>
              <vs-td class="text-center">{{ getPreview(tr).project_title }}</vs-td>
              <vs-td class="text-center">{{ getPreview(tr).s_check_date }} ~ {{ getPreview(tr).e_check_date }}</vs-td>
              <vs-td class="text-center"></vs-td>
              <vs-td class="text-center">
                <vs-icon v-if="getPreview(tr).attach_file.length>0" icon-pack="feather" icon="icon-file"/>
              </vs-td>
              <vs-td class="text-center"></vs-td>
              <vs-td class="text-center"></vs-td>
              <vs-td class="text-center"></vs-td>
              <vs-td class="text-center">
                <div class="flex justify-center">
                  <vs-button type="border" icon="open_in_new" class="mr-1" @click="()=>{handleItemClickDetailBlank(tr)}"></vs-button>
                  <vs-button type="border" @click.stop="()=>{handleItemClickDetail(tr)}">{{$t('button.바로가기')}}</vs-button>
                </div>
              </vs-td>

            </vs-tr>
          </template>
        </vs-table>
      </vs-col>
    </vs-row>

    <popup-excel-download
      v-model="showExcelDownload"
      :list="excelList"
      title="환경점검모니터링"/>
  </div>
</template>

<script>
import SearchNav from '@/components/nav/SearchNav'
import SearchNavItemKeyword from '@/components/nav/SearchNavItemKeyword'
import SearchNavItemDate from '@/components/nav/SearchNavItemDate'
import SearchNavItemSelect from '@/components/nav/SearchNavItemSelect'
import PopupExcelDownload from '@/popup/PopupExcelDownload'
import SearchNavItemProject from '@/components/nav/SearchNavItemProject'

export default {
  name: 'StateCheckMonitoring',
  components: {
    SearchNavItemProject,
    SearchNavItemSelect,
    SearchNavItemDate,
    SearchNavItemKeyword,
    SearchNav,
    PopupExcelDownload
  },
  data () {
    return {
      // 검색 네비게이션
      nav: {
        projectId: '',
        date: ['', ''],
        keyword: ''
      },

      showExcelDownload: false,
      rootPath: '', // 프로젝트의 rootPath
      lastPage: 1,
      currentPage: 1,
      table: {
        list: [],
        perPage: 10,
        keyword: ''
      },
      listAll: []
    }
  },
  computed: {
    excelList () {
      const list = []
      for (const data of this.listAll) {
        list.push({
          현장명: this.getPreview(data).project_title,
          점검일: this.getPreview(data).s_check_date + ' ~ ' + this.getPreview(data).e_check_date
          // 회의구분: this.getPreview(data).meetingType,
          // 회의일: this.getPreview(data).meetingDate,
          // 회의장소: this.getPreview(data).meetingPlace,
          // 작성일: data.created_at,
          // 결재상태: data.document_status.name
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
    async excelDownFunc () {
      await this.loadPostListAll()
      this.showExcelDownload = true
    },

    async loadPostList () {
      const projectId = this.nav.projectId
      const boardSlug = 'environment_check_daily' //(id:28)
      const page = this.currentPage
      const perPage = this.table.perPage
      const keyword = this.nav.keyword
      const dateBegin = this.nav.date[0]
      const dateEnd = this.nav.date[1]

      await this.$store.dispatch('approval/LOAD_POST_ALL', {
        projectId,
        boardSlug,
        page,
        perPage,
        keyword,
        dateBegin,
        dateEnd
      })

      this.table.list = this.$store.state.approval.list
      const listInfo = this.$store.state.approval.postListInfo
      this.currentPage = listInfo.current_page
      this.lastPage = listInfo.last_page

    },

    async loadPostListAll () {
      const projectId = this.nav.projectId
      const boardSlug = 'environment_check_daily'
      const page = 1
      const perPage = 10000
      const keyword = this.nav.keyword
      const dateBegin = this.nav.date[0]
      const dateEnd = this.nav.date[1]
      await this.$store.dispatch('approval/LOAD_POST_ALL', {
        projectId,
        boardSlug,
        page,
        perPage,
        keyword,
        dateBegin,
        dateEnd
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


    handleSearch () {
      this.currentPage = 1
      this.loadPostList()
    },



    handleItemClickDetail (data) {
      if (data.post) {
        this.$router.push(`/project/${data.post.project_id}/state/check/monitoring`)
      }
    },
    handleItemClickDetailBlank (data) {
      if (data.post) {
        const routeData = this.$router.resolve(`/project/${data.post.project_id}/state/check/monitoring`)
        window.open(routeData.href, '_blank')
      }
    }
  }
}
</script>

<style scoped>

</style>
