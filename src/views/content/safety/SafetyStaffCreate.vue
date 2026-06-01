<template>
  <div>
    <search-nav @handleSearch="handleSearch">
      <search-nav-item-date :label="$t('search.대상기간')" v-model="nav.date" />
      <search-nav-item-project :label="$t('search.현장명')" v-model="nav.projectId"/>
      <search-nav-item-company :label="$t('search.파트너사')" v-model="nav.keyword" :useName="true"/>
    </search-nav>


    <vs-row class="mb-8">
      <vs-col class="w-full flex " vs-justify="flex-end">
        <vs-button class="mr-4" type="border" color="secondary" @click="excelDownFunc">{{$t('button.Excel 다운로드')}}</vs-button>
      </vs-col>
    </vs-row>

    <vs-row>
      <vs-col>
        <vs-table stripe
                  ref="table"
                  :sst="true"
                  :max-items="table.perPage"
                  noDataText="데이터가 없습니다"
                  :data="table.list"

                  @sort="handleSort"
                  @selected="handleItemClickDetailBlank"
        >

          <template slot="thead">
            <vs-th class="w-1/12" sort-key="id"><span class="w-full text-center">{{$t('content.safety.staff.create.column.No')}}</span></vs-th>
            <vs-th class="w-1/12" sort-key="content$preview.type"><span class="w-full text-center">{{$t('content.safety.staff.create.column.현장명')}}</span></vs-th>
            <vs-th class="w-1/12" sort-key="content$preview.field_name"><span class="w-full text-center">{{$t('content.safety.staff.create.column.현장명')}}</span></vs-th>
            <vs-th class="w-1/12" sort-key="content$preview.com_name"><span class="w-full text-center">{{$t('content.safety.staff.create.column.파트너사')}}</span></vs-th>
            <vs-th class="w-1/12" sort-key="content$preview.writer"><span class="w-full text-center">{{$t('content.safety.staff.create.column.담당자')}}</span></vs-th>
            <vs-th class="w-1/12" sort-key="contentd$preview.num_of_all"><span class="w-full text-center">{{$t('content.safety.staff.create.column.전체인원')}}</span></vs-th>
            <vs-th class="w-1/12" sort-key="contentd$preview.num_of_tbm"><span class="w-full text-center">{{$t('content.safety.staff.create.column.남성근로자')}}</span></vs-th>
            <vs-th class="w-1/12" sort-key="contentd$preview.num_of_female"><span class="w-full text-center">{{$t('content.safety.staff.create.column.여성근로자')}}</span></vs-th>
            <vs-th class="w-1/12" sort-key="contentd$preview.num_of_oldage"><span class="w-full text-center">{{$t('content.safety.staff.create.column.일용직근로자')}}</span></vs-th>
            <vs-th class="w-1/12" sort-key="contentd$preview.num_of_foreign"><span class="w-full text-center">{{$t('content.safety.staff.create.column.외국인근로자')}}</span></vs-th>
            <vs-th class="w-1/12" sort-key="created_at"><span class="w-full text-center">{{$t('content.safety.staff.create.column.작성일')}}</span></vs-th>
            <vs-th style="width: 200px !important; display: inline-block;"><vs-col vs-type="flex" vs-justify="center">{{$t('content.safety.staff.create.column.보기')}}</vs-col></vs-th>
          </template>


          <template slot-scope="{data}">
            <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
              <vs-td class="text-center">{{ tr.id }}</vs-td>
              <vs-td class="text-center">{{ getTypeName(getPreview(tr).type) }}</vs-td>
              <vs-td class="text-center">{{ getPreview(tr).field_name }}</vs-td>
              <vs-td class="text-center">{{ getPreview(tr).com_name }}</vs-td>
              <vs-td class="text-center">{{ getPreview(tr).writer }}</vs-td>
              <vs-td class="text-center">{{ getPreview(tr).num_of_all }}</vs-td>
              <vs-td class="text-center">{{ getPreview(tr).num_of_tbm }}</vs-td>
              <vs-td class="text-center">{{ getPreview(tr).num_of_female }}</vs-td>
              <vs-td class="text-center">{{ getPreview(tr).num_of_oldage }}</vs-td>
              <vs-td class="text-center">{{ getPreview(tr).num_of_foreign }}</vs-td>
              <vs-td class="text-center">{{ tr.created_at.substr(0, 11) }}</vs-td>
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
      title="인원투입 현황"/>

  </div>
</template>

<script>
import DateSelector from '@/components/selector/DateSelector'
import SearchNav from '@/components/nav/SearchNav'
import SearchNavItemDate from '@/components/nav/SearchNavItemDate'
import SearchNavItemKeyword from '@/components/nav/SearchNavItemKeyword'
import PopupExcelDownload from '@/popup/PopupExcelDownload'
import SearchNavItemProject from '@/components/nav/SearchNavItemProject'
import KPagination from '@/components/kPagination/kPagination'
import SearchNavItemCompany from '@/components/nav/SearchNavItemCompany'

export default {
  name: 'SafetyStaffCreate',
  components: {
    SearchNavItemCompany,
    KPagination,
    SearchNavItemProject,
    PopupExcelDownload,
    SearchNavItemKeyword,
    SearchNavItemDate,
    SearchNav,
    DateSelector
  },
  computed: {
    excelList () {
      const list = []
      for (const data of this.listAll) {
        list.push({
          'No.': data.id,
          '현장명': this.getPreview(data).field_name,
          '현장명': this.getPreview(data).type,
          '파트너사': this.getPreview(data).com_name,
          '사용자명': this.getPreview(data).writer,
          '작성일': data.created_at.substr(0, 11),
          '전체인원': this.getPreview(data).num_of_all,
          '남성근로자': this.getPreview(data).num_of_tbm,
          '여성근로자': this.getPreview(data).num_of_female,
          '일용직근로자': this.getPreview(data).num_of_oldage,
          '외국인근로자': this.getPreview(data).num_of_foreign
        })
      }
      return list
    }
  },
  data () {
    return {
      // 검색 네비게이션
      nav: {
        date: ['', ''],
        keyword: '',
        projectId:'',
        dateTarget:'created_at'
      },
      popupPostId: '',
      showExcelDownload: false,
      popupActive: false,
      table: {
        list: [],
        keyword: '',

        perPage:10,
        lastPage:1,
        currentPage:1
      },
      listAll: []
    }
  },

  created () {
    this.loadPostList()
  },
  methods: {

    // 현장 개요 불러오기
    async loadPostList () {
      const projectId = this.nav.projectId
      const boardId = 21 // manpower
      const page = this.table.currentPage
      const perPage = this.table.perPage

      const dateTarget = this.nav.dateTarget
      const dateBegin = this.nav.date[0]
      const dateEnd = this.nav.date[1]
      const orderTarget = this.nav.orderTarget
      const orderDirection = this.nav.orderDirection

      const keyword = []
      if (this.nav.keyword) keyword.push(`content$preview.com_name*%${this.nav.keyword}%`)

      await this.$store.dispatch('board/LOAD_POST_LIST', {
        projectId,
        boardId,
        page,
        perPage,
        dateTarget, dateBegin, dateEnd,
        orderTarget, orderDirection,
        keyword
      })
      const listInfo = this.$store.state.board.postListInfo
      this.table.list = this.$store.state.board.postListInfo.data

      this.table.currentPage = listInfo.current_page
      this.table.lastPage = listInfo.last_page
    },

    // 현장 개요 불러오기
    async loadPostListAll () {
      const projectId = this.nav.projectId
      const boardId = 21 // manpower
      const page = 1
      const perPage = 10000

      const dateTarget = this.nav.type
      const dateBegin = this.nav.date[0]
      const dateEnd = this.nav.date[1]
      const orderTarget = this.nav.orderTarget
      const orderDirection = this.nav.orderDirection

      const keyword = []
      if (this.nav.keyword) keyword.push(`content$preview.com_name*%${this.nav.keyword}%`)

      await this.$store.dispatch('board/LOAD_POST_LIST', {
        projectId,
        boardId,
        page,
        perPage,
        dateTarget, dateBegin, dateEnd,
        orderTarget, orderDirection,
        keyword
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
          type: '',
          com_name: '',
          com_number: '',
          writer: '',
          num_of_all: '',
          num_of_tbm: '',
          num_of_female: '',
          num_of_oldage: '',
          num_of_foreign: ''
        }
      }
    },

    getTypeName (type) {
      if (type === '0') return '부문없음'
      else if (type === '1') return '건축주택'
      else if (type === '2') return '인프라'
      else if (type === '3') return '하이테크'
      else if (type === '4') return '에너지'
    },

    handleItemClickDetail (data) {
      if (data) {
        this.$router.push(`/project/${data.project_id}/safety/staff/input`)
      }
    },
    handleItemClickDetailBlank (data) {
      if (data) {
        const routeData = this.$router.resolve(`/project/${data.project_id}/safety/staff/input`)
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

    handleClickRegister () {
      this.popupPostId = ''
      this.popupActive = true
    },
    popupActiveSync () {
      this.popupActive = false
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
