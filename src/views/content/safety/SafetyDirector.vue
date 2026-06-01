<template>
  <div>
    <search-nav @handleSearch="handleSearch">
      <search-nav-item-select :label="$t('search.검색조건')" v-model="nav.type" :list="nav.typeList" />
      <search-nav-item-date :label="$t('search.대상기간')" v-model="nav.date" />
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
                  noDataText="데이터가 없습니다"

                  @sort="handleSort"
                  @selected="handleItemClickDetailBlank"
        >

          <template slot="thead">
            <vs-th class="w-1/12" sort-key="id" ><span class="w-full text-center">{{$t('content.safety.director.column.No')}}</span></vs-th>
            <vs-th class="w-2/12" sort-key="content$preview.field_name" ><span class="w-full text-center">{{$t('content.safety.director.column.현장명')}}</span></vs-th>
            <vs-th class="w-1/12" sort-key="content$preview.safety_chief_name" ><span class="w-full text-center">{{$t('content.safety.director.column.안전보건책임자')}}</span></vs-th>
            <vs-th class="w-1/12" sort-key="content$preview.date_issuance" ><span class="w-full text-center">{{$t('content.safety.director.column.발령일')}}</span></vs-th>
            <vs-th class="w-1/12" sort-key="content$preview.date_appointment" ><span class="w-full text-center">{{$t('content.safety.director.column.선임일')}}</span></vs-th>
            <vs-th class="w-1/12" sort-key="content$preview.date_moving" ><span class="w-full text-center">{{$t('content.safety.director.column.이동일')}}</span></vs-th>
            <vs-th class="w-1/12" sort-key="content$preview.date_complete" ><span class="w-full text-center">교육 이수일</span></vs-th>
            <vs-th class="w-1/12" sort-key="content$preview.date_complete" ><span class="w-full text-center">{{$t('content.safety.director.column.작성자')}}</span></vs-th>
            <vs-th style="width: 200px !important; display: inline-block;"><vs-col vs-type="flex" vs-justify="center">{{$t('content.safety.director.column.보기')}}</vs-col></vs-th>
          </template>

          <template slot-scope="{data}">
            <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">

              <vs-td class="text-center">{{ getNo(indextr) }}</vs-td>
              <vs-td class="text-center">{{ getPreview(tr).field_name }}</vs-td>
              <vs-td class="text-center">{{ getPreview(tr).safety_chief_name }}</vs-td>
              <vs-td class="text-center">{{ getPreview(tr).date_issuance }}</vs-td>
              <vs-td class="text-center">{{ getPreview(tr).date_appointment }}</vs-td>
              <vs-td class="text-center">{{ getPreview(tr).date_moving }}</vs-td>
              <vs-td class="text-center">{{ getPreview(tr).date_complete }}</vs-td>
              <vs-td class="text-center">{{ (tr.author) ? tr.author.name : '' }}</vs-td>
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

    <popup-search-member v-model="popupActive"/>

    <popup-excel-download
      v-model="showExcelDownload"
      :list="excelList"
      title="안전보건책임자"/>
  </div>
</template>

<script>

import PopupSearchMember from '@/popup/PopupSearchMember'
import DateSelector from '@/components/selector/DateSelector'
import SearchNav from '@/components/nav/SearchNav'
import SearchNavItemDate from '@/components/nav/SearchNavItemDate'
import SearchNavItemKeyword from '@/components/nav/SearchNavItemKeyword'
import PopupExcelDownload from '@/popup/PopupExcelDownload'
import SearchNavItemProject from '@/components/nav/SearchNavItemProject'
import SearchNavItemSelect from '@/components/nav/SearchNavItemSelect'
import KPagination from '@/components/kPagination/kPagination'

export default {
  name: 'SafetyDirector',
  components: {
    KPagination,
    SearchNavItemSelect,
    SearchNavItemProject,
    PopupExcelDownload,
    SearchNavItemKeyword,
    SearchNavItemDate,
    SearchNav,
    DateSelector,
    PopupSearchMember
  },
  data () {
    return {
      // 검색 네비게이션
      nav: {
        date: ['', ''],
        projectId: '',
        dateTarget:'created_at',
        orderTarget:'created_at',
        orderDirection:'desc',
        type:'content$preview.date_issuance',
        typeList:[
          {text:'발령일', value:'content$preview.date_issuance'},
          {text:'선임일', value:'content$preview.date_appointment'},
          {text:'이동일', value:'content$preview.date_moving'},
          {text:'이수일', value:'content$preview.date_complete'},
        ]
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
        keyword: '',

        perPage:10,
        lastPage:1,
        currentPage:1,
        total:0
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
    getNo (index) {
      return this.table.total - (((this.table.currentPage - 1) * this.table.perPage) + index)
    },

    // 현장 개요 불러오기
    async loadPostList () {
      const projectId = this.nav.projectId
      const boardId = 20 // safety_chief
      const page = this.table.currentPage
      const perPage = this.table.perPage

      const dateTarget = this.nav.type
      const dateBegin = this.nav.date[0]
      const dateEnd = this.nav.date[1]
      const orderTarget = this.nav.orderTarget
      const orderDirection = this.nav.orderDirection

      await this.$store.dispatch('board/LOAD_POST_LIST', {
        projectId,
        boardId,
        page,
        perPage,
        dateTarget, dateBegin, dateEnd,
        orderTarget, orderDirection,
      })
      const listInfo = this.$store.state.board.postListInfo
      this.table.list = this.$store.state.board.postListInfo.data

      this.table.currentPage = listInfo.current_page
      this.table.lastPage = listInfo.last_page
      this.table.total = listInfo.total

    },
    // 현장 개요 불러오기
    async loadPostListAll () {
      const projectId = ''
      const boardId = 20 // safety_chief
      const page = 1
      const perPage = 10000

      const dateTarget = this.nav.type
      const dateBegin = this.nav.date[0]
      const dateEnd = this.nav.date[1]
      const orderTarget = this.nav.orderTarget
      const orderDirection = this.nav.orderDirection

      await this.$store.dispatch('board/LOAD_POST_LIST', {
        projectId,
        boardId,
        page,
        perPage,
        dateTarget, dateBegin, dateEnd,
        orderTarget, orderDirection,
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
        this.$router.push(`/project/${data.project_id}/safety/director`)
      }
    },
    handleItemClickDetailBlank (data) {
      if (data) {
        const routeData = this.$router.resolve(`/project/${data.project_id}/safety/director`)
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
    handleChangePage (_data) {
      this.table.currentPage = _data
      this.loadPostList()
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
      this.table.currentPage = 1
      this.loadPostList()
    }
  }
}
</script>

<style scoped>

</style>
