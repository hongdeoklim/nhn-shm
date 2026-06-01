<template>
  <div>

    <search-nav @handleSearch="handleSearch">
      <search-nav-item-date :label="$t('search.대상기간')" v-model="nav.date" />
      <search-nav-item-select :label="$t('search.발행구분')" v-model="nav.occur_type" :list="nav.occur_type_list" />
      <search-nav-item-project :label="$t('search.현장명')" v-model="nav.projectId" />
    </search-nav>

    <vs-row class="mb-4">
      <vs-col class="flex" vs-justify="flex-end">
        <vs-button class="mr-2" type="border" color="secondary" @click="excelDownFunc">{{$t('button.Excel 다운로드')}}</vs-button>
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
                  @selected="handleItemClickDetailBlank"
        >

          <template slot="thead">
            <vs-th sort-key="id"><span class="w-full text-center">{{$t('content.state.prevention.request.column.No')}}</span></vs-th>
            <vs-th sort-key="content$preview.field_name"><span class="w-full text-center">{{$t('content.state.prevention.request.column.현장명')}}</span></vs-th>
            <vs-th sort-key="content$preview.occur_type"><span class="w-full text-center">{{$t('content.state.prevention.request.column.발행구분')}}</span></vs-th>
            <vs-th sort-key="content$preview.company"><span class="w-full text-center">{{$t('content.state.prevention.request.column.파트너사')}}</span></vs-th>
            <vs-th sort-key="content$preview.occur_date"><span class="w-full text-center">{{$t('content.state.prevention.request.column.발생일')}}</span></vs-th>
            <vs-th sort-key="content$preview.action_date"><span class="w-full text-center">{{$t('content.state.prevention.request.column.조치일')}}</span></vs-th>
            <vs-th sort-key="content$preview.action_date"><span class="w-full text-center">{{$t('content.state.prevention.request.column.작성자')}}</span></vs-th>
            <vs-th sort-key="status"><span class="w-full text-center">{{$t('content.state.prevention.request.column.결재상태')}}</span></vs-th>
            <vs-th ><span class="w-full text-center">{{$t('content.state.prevention.request.column.첨부문서')}}</span></vs-th>
            <vs-th style="width: 200px !important; display: inline-block;"><vs-col class="w-full" vs-type="flex" vs-justify="center">{{$t('content.state.prevention.request.column.보기')}}</vs-col></vs-th>
          </template>

          <template slot-scope="{data}">
            <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
              <vs-td class="text-center">{{ tr.post.id }}</vs-td>
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
      title="안전"/>
  </div>
</template>

<script>
import SearchNav from '@/components/nav/SearchNav'
import SearchNavItemDate from '@/components/nav/SearchNavItemDate'
import SearchNavItemKeyword from '@/components/nav/SearchNavItemKeyword'
import PopupApprovalProcess from '@/views/approval/PopupApprovalProcess'
import PopupExcelDownload from '@/popup/PopupExcelDownload'
import SearchNavItemSelect from '@/components/nav/SearchNavItemSelect'
import SearchNavItemProject from '@/components/nav/SearchNavItemProject'
import KPagination from '@/components/kPagination/kPagination'

export default {
  name: 'SafetyPreventionRequest',
  components: {
    KPagination,
    SearchNavItemProject,
    SearchNavItemSelect,
    PopupExcelDownload,
    PopupApprovalProcess,
    SearchNavItemKeyword,
    SearchNavItemDate,
    SearchNav
  },
  data () {
    return {
      // 검색 네비게이션
      nav: {
        projectId: '',
        date: ['', ''],
        keyword: '',
        company:'',
        orderTarget:'created_at',
        orderDirection:'desc',
        occur_type:'',
        occur_type_list: [
          {text:'전체선택', value:''},
          {text:'대기', value:'occur_type_1'},
          {text:'수질', value:'occur_type_2'},
          {text:'폐기물', value:'occur_type_3'},
          {text:'소음', value:'occur_type_4'},
          {text:'진동', value:'occur_type_5'},
          {text:'토양', value:'occur_type_6'},
          {text:'기타', value:'occur_type_7'},
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

      rootPath: '', // 프로젝트의 rootPath
      postId: '',
      table: {
        list: [],
        perPage: 10,
        keyword: ''
      }
    }
  },

  computed: {
    excelList () {
      const list = []
      for (const data of this.listAll) {
        list.push({
          'No.': data.post.id,
          '현장명': this.getPreview(data).field_name,
          '발행구분': this.getOccurTypeName(this.getPreview(data).occur_type),
          '파트너사': this.getPreview(data).company,
          '발생일': this.getPreview(data).occur_date,
          '조치일': this.getPreview(data).action_date,
          '작성자': this.getPreview(data).writer
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
      const boardId = 39
      const boardSlug = 'environment_request'
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

    },

    async loadPostListAll () {
      const projectId = this.nav.projectId
      const boardId = 39
      const boardSlug = 'environment_request'
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
      if (type === 'occur_type_1') return '대기'
      if (type === 'occur_type_2') return '수질'
      if (type === 'occur_type_3') return '폐기물'
      if (type === 'occur_type_4') return '소음'
      if (type === 'occur_type_5') return '진동'
      if (type === 'occur_type_6') return '토양'
      if (type === 'occur_type_7') return '기타'
      return name
    },

    handleItemClickDetail (data) {
      this.$router.push({path: `/project/${data.project_id}/prevention/request/environment/${data.post_id}`})
    },
    handleItemClickDetailBlank (data) {
      if (data) {
        const routeData = this.$router.resolve(`/project/${data.project_id}/prevention/request/environment/${data.post_id}`)
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
      this.$emit('handleClickRegister', 'environment')
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
    },
    handleTableChangePage (page) {
      this.currentPage = page
      this.loadPostList()
    }
  }
}
</script>

<style scoped>

</style>
