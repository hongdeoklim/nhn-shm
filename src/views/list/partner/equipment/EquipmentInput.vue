<template>
  <div>
    <search-nav @handleSearch="handleSearch">
      <search-nav-item-date label="작성일" v-model="nav.date" />
      <search-nav-item-keyword label="파트너사" v-model="nav.keyword" />
    </search-nav>


    <vs-row class="mb-8">
      <vs-col class="w-full flex " vs-justify="flex-end">
        <vs-button class="mr-4" type="border" color="secondary" @click="excelDownFunc">{{$t('button.Excel 다운로드')}}</vs-button>
        <vs-button color="secondary" @click="handleClickRegister">신규작성</vs-button>
      </vs-col>
    </vs-row>

    <vs-row>
      <vs-col>
        <vs-table stripe
                  ref="table"
                  :sst="true"
                  pagination
                  :max-items="table.perPage"
                  noDataText="데이터가 없습니다"
                  :data="table.list"
                  @sort="handleSort"
                  @selected="handleItemClickDetail"
        >

          <template slot="thead">
            <vs-th sort-key="id" class="w-1/12"><span class="w-full text-center">No.</span></vs-th>
            <vs-th sort-key="content$preview.field_name" class="w-1/12"><span class="w-full text-center">현장명</span></vs-th>
            <vs-th sort-key="content$preview.type" class="w-1/12"><span class="w-full text-center">구분</span></vs-th>
            <vs-th sort-key="content$preview.com_name" class="w-1/12"><span class="w-full text-center">소속</span></vs-th>
            <vs-th sort-key="content$preview.writer" class="w-1/12"><span class="w-full text-center">사용자명</span></vs-th>
            <vs-th sort-key="contentd$preview.num_of_all" class="w-1/12"><span class="w-full text-center">전체장비</span></vs-th>
            <vs-th sort-key="contentd$preview.num_of_tbm" class="w-1/12"><span class="w-full text-center">덤프트럭(D/T)</span></vs-th>
            <vs-th sort-key="contentd$preview.num_of_female" class="w-1/12"><span class="w-full text-center">포크레인(B/H)</span></vs-th>
            <vs-th sort-key="contentd$preview.num_of_oldage" class="w-1/12"><span class="w-full text-center">이동식 크레인</span></vs-th>
            <vs-th sort-key="contentd$preview.num_of_foreign" class="w-1/12"><span class="w-full text-center">발전기</span></vs-th>
            <vs-th sort-key="created_at" class="w-1/12"><span class="w-full text-center">작성일</span></vs-th>
          </template>


          <template slot-scope="{data}">
            <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
              <vs-td class="text-center">{{ tr.id }}</vs-td>
              <vs-td class="text-center">{{ getContent(tr).field_name }}</vs-td>
              <vs-td class="text-center">{{ getTypeName(getContent(tr).type) }}</vs-td>
              <vs-td class="text-center">{{ getContent(tr).com_name }}</vs-td>
              <vs-td class="text-center">{{ getContent(tr).writer }}</vs-td>
              <vs-td class="text-center">{{ getContent(tr).num_of_all }}</vs-td>
              <vs-td class="text-center">{{ getContent(tr).num_of_dump_truck }}</vs-td>
              <vs-td class="text-center">{{ getContent(tr).num_of_fork_crane }}</vs-td>
              <vs-td class="text-center">{{ getContent(tr).num_of_mobile_crane }}</vs-td>
              <vs-td class="text-center">{{ getContent(tr).num_of_generator }}</vs-td>
              <vs-td class="text-center">{{ tr.created_at.substr(0, 11) }}</vs-td>
            </vs-tr>
          </template>
        </vs-table>
      </vs-col>
    </vs-row>

    <popup-equipment-add
      :postId="popupPostId"
      :popupActive="popupActive"
      @popupActiveSync="popupActiveSync"
      @register="loadPostList"
      @update="loadPostList"
    >
    </popup-equipment-add>

    <popup-excel-download
      v-model="showExcelDownload"
      :list="excelList"
      title="인원투입 현황"/>

  </div>
</template>

<script>
import SearchNav from '@/components/nav/SearchNav'
import SearchNavItemDate from '@/components/nav/SearchNavItemDate'
import SearchNavItemKeyword from '@/components/nav/SearchNavItemKeyword'
import PopupExcelDownload from '@/popup/PopupExcelDownload'
import PopupEquipmentAdd from '@/views/project/popup/PopupEquipmentAdd'

export default {
  name: 'EquipmentInput',
  components: {
    PopupEquipmentAdd,
    PopupExcelDownload,
    SearchNavItemKeyword,
    SearchNavItemDate,
    SearchNav
  },
  computed: {
    excelList () {
      const list = []
      for (const data of this.listAll) {
        list.push({
          'No.': data.id,
          '현장명': this.getContent(data).field_name,
          '구분': this.getContent(data).type,
          '파트너사': this.getContent(data).com_name,
          '사용자명': this.getContent(data).writer,
          '작성일': data.created_at.substr(0, 11),
          '전체장비': this.getContent(data).num_of_all,
          '덤프트럭(D/T)': this.getContent(data).num_of_dump_truck,
          '포크레인(B/H)': this.getContent(data).num_of_fork_crane,
          '이동식 크레인': this.getContent(data).num_of_mobile_crane,
          '발전기': this.getContent(data).num_of_generator

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
        orderTarget:'created_at',
        orderDirection:'desc'
      },
      popupPostId: '',
      showExcelDownload: false,
      popupActive: false,
      table: {
        list: [],
        perPage: 7,
        keyword: ''
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
      const projectId = this.$route.params.proj_id
      const boardId = 49 // equipment_power
      const page = 1
      const perPage = 30
      const dateTarget = 'created_at'
      const dateBegin = this.nav.date[0]
      const dateEnd = this.nav.date[1]
      const orderTarget = this.nav.orderTarget
      const orderDirection = this.nav.orderDirection
      const keyword = []
      if (this.nav.keyword) keyword.push(`content$com_name*%${this.nav.keyword}%`)

      await this.$store.dispatch('board/LOAD_POST_LIST', {
        projectId,
        boardId,
        page,
        perPage,
        keyword,
        dateTarget,
        dateBegin,
        dateEnd, orderTarget, orderDirection
      })
      this.table.list = this.$store.state.board.postListInfo.data
    },

    // 현장 개요 불러오기
    async loadPostListAll () {
      const projectId = this.$route.params.proj_id
      const boardId = 49 // equipment_power
      const page = 1
      const perPage = 10000
      const orderTarget = this.nav.orderTarget
      const orderDirection = this.nav.orderDirection
      const keyword = []
      if (this.nav.keyword) keyword.push(`content$preview.com_name*%${this.nav.keyword}%`)

      await this.$store.dispatch('board/LOAD_POST_LIST', {
        projectId,
        boardId,
        page,
        perPage,
        orderTarget,
        orderDirection,
        keyword
      })
      this.listAll = JSON.parse(JSON.stringify(this.$store.state.board.postListInfo.data))
      await this.loadPostList()
    },

    async excelDownFunc () {
      await this.loadPostListAll()
      this.showExcelDownload = true
    },

    getContent (data) {
      if (data.post_content) {
        const preview = JSON.parse(data.post_content)
        return preview
      } else {
        return {
          field_name: '',
          type: '0',
          com_name: '',
          com_number: '',
          writer: '',
          num_of_all: '',
          num_of_dump_truck: '',
          num_of_fork_crane: '',
          num_of_mobile_crane: '',
          num_of_generator: '',
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
      this.popupPostId = data.id
      this.popupActive = true
    },
    handleSort (key, type) {
      if (key) {
        this.nav.orderTarget = key
        this.nav.orderDirection = type
        this.loadPostList()
      }
    },
    handleClickRegister () {
      this.popupPostId = ''
      this.popupActive = true
    },
    popupActiveSync () {
      this.popupActive = false
    },
    handleSearch () {
      this.loadPostList()
    }
  }
}
</script>

<style scoped>

</style>
