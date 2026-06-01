<template>
  <div>
    <search-nav @handleSearch="handleSearch">
      <search-nav-item-date :label="$t('search.발령일')" v-model="nav.date" @handleSearch="handleSearch"/>
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
                  pagination
                  :max-items="table.perPage"
                  :data="table.list"
                  noDataText="데이터가 없습니다"
                  @sort="handleSort"
                  @selected="handleItemClickDetailBlank"
        >

          <template slot="thead">
            <vs-th sort-key="id" class="w-1/12"><span class="w-full text-center">{{$t('content.state.director.list.column.No')}}</span></vs-th>
            <vs-th sort-key="content$preview.field_name" class="w-2/12"><span class="w-full text-center">{{$t('content.state.director.list.column.현장명')}}</span></vs-th>
            <vs-th sort-key="content$preview.safety_chief_name" class="w-1/12"><span class="w-full text-center">{{$t('content.state.director.list.column.안전보건책임자')}}</span></vs-th>
            <vs-th sort-key="content$preview.date_issuance" class="w-1/12"><span class="w-full text-center">{{$t('content.state.director.list.column.발령일')}}</span></vs-th>
            <vs-th sort-key="content$preview.date_appointment" class="w-1/12"><span class="w-full text-center">{{$t('content.state.director.list.column.선임일')}}</span></vs-th>
            <vs-th sort-key="content$preview.date_moving" class="w-1/12"><span class="w-full text-center">{{$t('content.state.director.list.column.이동일')}}</span></vs-th>
            <vs-th sort-key="content$preview.date_complete" class="w-1/12"><span class="w-full text-center">{{$t('content.state.director.list.column.이수일')}}</span></vs-th>
            <vs-th style="width: 200px !important; display: inline-block;"><vs-col vs-type="flex" vs-justify="center">{{$t('content.state.director.list.column.보기')}}</vs-col></vs-th>
          </template>

          <template slot-scope="{data}">
            <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">

              <vs-td class="text-center">{{ tr.id }}</vs-td>
              <vs-td class="text-center">{{ getPreview(tr).field_name }}</vs-td>
              <vs-td class="text-center">{{ getPreview(tr).safety_chief_name }}</vs-td>
              <vs-td class="text-center">{{ getPreview(tr).date_issuance }}</vs-td>
              <vs-td class="text-center">{{ getPreview(tr).date_appointment }}</vs-td>
              <vs-td class="text-center">{{ getPreview(tr).date_moving }}</vs-td>
              <vs-td class="text-center">{{ getPreview(tr).date_complete }}</vs-td>
              <vs-td class="text-center">
                <div class="flex justify-center">
                  <vs-button type="border" icon="open_in_new" class="mr-1" @click.stop @click="()=>{handleItemClickDetailBlank(tr)}"></vs-button>
                  <vs-button type="border" @click.stop @click="()=>{handleItemClickDetail(tr)}">{{$t('button.바로가기')}}</vs-button>
                </div>
              </vs-td>

            </vs-tr>
          </template>
        </vs-table>
      </vs-col>
    </vs-row>

    <popup-search-member v-model="popupActive"/>

    <popup-plan-reg-admin
      :postId="popupPostId"
      :popupActive="popupActiveReg"
      @popupActiveSync="popupActiveRegSync"
      @register="loadPostList"
      @update="loadPostList"
    >
    </popup-plan-reg-admin>

    <popup-excel-download
      v-model="showExcelDownload"
      :list="excelList"
      title="안전보건책임자"/>
  </div>
</template>

<script>

//import PopupSearchMember from '../../components/popup/PopupSearchMember'
//import PopupPlanRegAdmin from '../popup/PopupPlanRegAdmin'
import DateSelector from '../../../components/selector/DateSelector'
import SearchNav from '@/components/nav/SearchNav'
import SearchNavItemDate from '@/components/nav/SearchNavItemDate'
import SearchNavItemKeyword from '@/components/nav/SearchNavItemKeyword'
import PopupExcelDownload from '@/popup/PopupExcelDownload'
import PopupSearchMember from '@/popup/PopupSearchMember'
import PopupPlanRegAdmin from '@/views/project/popup/PopupPlanRegAdmin'
import SearchNavItemProject from '@/components/nav/SearchNavItemProject'

export default {
  name: 'StateDirectorList',
  components: {
    SearchNavItemProject,
    PopupPlanRegAdmin,
    PopupSearchMember,
    PopupExcelDownload,
    SearchNavItemKeyword,
    SearchNavItemDate,
    SearchNav,
    DateSelector,
  },
  data () {
    return {
      // 검색 네비게이션
      nav: {
        projectId:'',
        date: ['', ''],
        keyword: '',
        orderTarget:'created_at',
        orderDirection:'desc'
      },
      showExcelDownload: false,

      popupPostId: '',
      popupActive: false,
      popupActiveReg: false,
      listAll: [],
      table: {
        list: [
          {
            no: 100,
            title: 'AA프로젝트',
            manager: '박휘순',
            author: '황지규',
            createAt: '2020-09-09 09:19'
          },
          {
            no: 99,
            title: 'AA프로젝트',
            manager: '박휘순',
            author: '황지규',
            createAt: '2020-09-09 09:19'
          },
          {
            no: 98,
            title: 'AA프로젝트',
            manager: '박휘순',
            author: '황지규',
            createAt: '2020-09-09 09:19'
          }
        ],
        perPage: 7,
        keyword: ''
      }
    }
  },

  computed: {
    excelList () {
      const list = []
      for (const data of this.listAll) {
        list.push({
          'No.': data.id,
          '프로젝트': this.getPreview(data).field_name,
          '안전보건책임자': this.getPreview(data).safety_chief_name,
          '발령일': this.getPreview(data).date_issuance,
          '선임일': this.getPreview(data).date_appointment,
          '이동일': this.getPreview(data).date_moving,
          '이수일': this.getPreview(data).date_complete
        })
      }
      return list
    }
  },
  created () {
    this.loadPostList()
  },
  methods: {

    // 현장 개요 불러오기
    async loadPostList () {
      const projectId = this.nav.projectId
      const boardId = 20 // safety_chief
      const page = 1
      const perPage = 30
      const orderTarget = this.nav.orderTarget
      const orderDirection = this.nav.orderDirection
      const dateTarget = 'content$preview.date_issuance'
      const dateBegin = this.nav.date[0]
      const dateEnd = this.nav.date[1]
      let keyword = []
      if (this.nav.keyword) keyword.push(this.nav.keyword)

      await this.$store.dispatch('board/LOAD_POST_LIST', {
        projectId,
        boardId,
        page,
        perPage,
        orderTarget,
        orderDirection,
        keyword,
        dateTarget,
        dateBegin,
        dateEnd
      })
      this.table.list = this.$store.state.board.postListInfo.data
    },
    // 현장 개요 불러오기
    async loadPostListAll () {
      const projectId = this.nav.projectId
      const boardId = 20 // safety_chief
      const page = 1
      const perPage = 10000
      const orderTarget = this.nav.orderTarget
      const orderDirection = this.nav.orderDirection
      const dateTarget = 'content$preview.date_issuance'
      const dateBegin = this.nav.date[0]
      const dateEnd = this.nav.date[1]
      let keyword = []
      if (this.nav.keyword) keyword.push(this.nav.keyword)

      await this.$store.dispatch('board/LOAD_POST_LIST', {
        projectId,
        boardId,
        page,
        perPage,
        orderTarget,
        orderDirection,
        keyword,
        dateTarget,
        dateBegin,
        dateEnd
      })
      this.listAll = JSON.parse(JSON.stringify(this.$store.state.board.postListInfo.data))
      await this.loadPostList()
    },

    async excelDownFunc () {
      await this.loadPostListAll()
      this.showExcelDownload = true
    },

    getPreview (data) {
      if (data.preview) {
        const preview = JSON.parse(data.preview)
        return preview
      } else {
        return {
          field_name: '',
          safety_chief_name: '',
          date_issuance: '',
          date_appointment: '',
          date_moving: '',
          date_complete: ''
        }
      }
    },

    handleItemClickDetail (data) {
      if (data) {
        this.$router.push(`/project/${data.project_id}/state/director`)
      }
    },
    handleItemClickDetailBlank (data) {
      if (data) {
        const routeData = this.$router.resolve(`/project/${data.project_id}/state/director`)
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

    handleClickAdd () {
      this.popupActive = true
    },
    handleClickRegister () {
      this.popupPostId = ''
      this.popupActiveReg = true
    },
    popupActiveSync () {
      this.popupActive = false
    },
    popupActiveRegSync () {
      this.popupActiveReg = false
    },
    handleSearch () {
      this.loadPostList()
    }
  }
}
</script>

<style scoped>

</style>
