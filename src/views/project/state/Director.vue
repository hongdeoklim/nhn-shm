<template>
  <div>
    <!--  상단 검색바-->
    <search-nav @handleSearch="handleSearch">
      <search-nav-item-date label="발령일" v-model="nav.date" type="single" />
      <search-nav-item-keyword label="키워드" v-model="nav.keyword" />
    </search-nav>

    <vs-row class="mb-4">
      <vs-col class="flex" vs-justify="flex-end">
        <vs-button class="mr-2" type="border" color="secondary" @click="excelDownFunc">{{$t('button.Excel 다운로드')}}</vs-button>
        <vs-button color="secondary" @click="handleClickRegister">신규작성</vs-button>
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
                  :data="table.list"
                  @sort="handleSort"
                  @selected="handleItemClickDetail">

          <template slot="thead">
            <vs-th sort-key="id" class="w-1/12"><span class="w-full text-center">No.</span></vs-th>
            <vs-th sort-key="content$preview.field_name" class="w-2/12"><span class="w-full text-center">현장명</span></vs-th>
            <vs-th sort-key="content$preview.safety_chief_name" class="w-1/12"><span class="w-full text-center">환경책임자</span></vs-th>
            <vs-th sort-key="content$preview.date_issuance" class="w-1/12"><span class="w-full text-center">발령일</span></vs-th>
            <vs-th sort-key="content$preview.date_appointment" class="w-1/12"><span class="w-full text-center">선임일</span></vs-th>
            <vs-th sort-key="content$preview.date_moving" class="w-1/12"><span class="w-full text-center">이동일</span></vs-th>
            <vs-th sort-key="content$preview.date_complete" class="w-1/12"><span class="w-full text-center">이수일</span></vs-th>
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

            </vs-tr>
          </template>
        </vs-table>
      </vs-col>
    </vs-row>


    <popup-search-member v-model="popupActive"/>

    <popup-state-director-reg-admin
      :post-id="popupPostId"
      :popupActive="popupActiveReg"
      @register= "register"
      @popupActiveSync="popupActiveRegSync">
    </popup-state-director-reg-admin>

    <popup-excel-download
      v-model="showExcelDownload"
      :list="excelList"
      title="안전보건책임자"/>
  </div>
</template>

<script>

import PopupStateDirectorRegAdmin from './popup/PopupStateDirectorRegAdmin'
import PopupSearchMember from '../../../popup/PopupSearchMember'
import SearchNavItemSelect from '@/components/nav/SearchNavItemSelect'
import SearchNav from '@/components/nav/SearchNav'
import SearchNavItemKeyword from '@/components/nav/SearchNavItemKeyword'
import PopupExcelDownload from '@/popup/PopupExcelDownload'
import SearchNavItemDate from '@/components/nav/SearchNavItemDate'

export default {
  name: 'Director',
  components: {
    SearchNavItemDate,
    PopupSearchMember,
    PopupExcelDownload,
    SearchNavItemKeyword,
    SearchNav,
    SearchNavItemSelect,
    PopupStateDirectorRegAdmin
  },
  data () {
    return {
      // 검색 네비게이션
      nav: {
        keyword: '',
        date: ['', ''],
        orderTarget:'created_at',
        orderDirection:'desc'
      },
      showExcelDownload: false,

      popupPostId: '',
      popupActive: false,
      popupActiveReg: false,
      listAll: [],
      table: {
        list: [],
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
      const projectId = this.$route.params.proj_id
      const boardId = 25 // state_director
      const page = 1
      const perPage = 30
      const keyword = []
      const dateTarget = 'content$preview.date_issuance'
      const dateBegin = this.nav.date[0]
      const dateEnd = this.nav.date[1]
      const orderTarget = this.nav.orderTarget
      const orderDirection = this.nav.orderDirection

      if (this.nav.keyword) {
        keyword.push(this.nav.keyword)
      }

      await this.$store.dispatch('board/LOAD_POST_LIST', {
        projectId,
        boardId,
        page,
        keyword,
        dateTarget, dateBegin, dateEnd,
        perPage, orderTarget, orderDirection
      })
      this.table.list = this.$store.state.board.postListInfo.data
    },
    // 현장 개요 불러오기
    async loadPostListAll () {
      const projectId = this.$route.params.proj_id
      const boardId = 25 // state_director
      const page = 1
      const perPage = 10000
      const keyword = []
      const dateTarget = 'content$preview.date_issuance'
      const dateBegin = this.nav.date[0]
      const dateEnd = this.nav.date[1]
      const orderTarget = this.nav.orderTarget
      const orderDirection = this.nav.orderDirection

      if (this.nav.keyword) {
        keyword.push(this.nav.keyword)
      }

      await this.$store.dispatch('board/LOAD_POST_LIST', {
        projectId,
        boardId,
        page,
        keyword,
        dateTarget, dateBegin, dateEnd,
        perPage, orderTarget, orderDirection
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
      this.popupPostId = data.id
      this.popupActiveReg = true
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
      this.popupPostId = null
      this.popupActiveReg = false
    },
    register () {
      this.loadPostList()
    },
    handleSearch () {
      this.loadPostList();
    }
  }
}
</script>

<style scoped>

</style>
