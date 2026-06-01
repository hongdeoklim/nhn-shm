<template>
  <div>

    <!--  상단 검색바-->
    <search-nav @handleSearch="handleSearch">
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
                  :max-items="table.perPage"
                  :data="table.list"
                  noDataText="데이터가 없습니다"
                  @sort="handleSort"
                  @selected="handleItemClickDetail">


          <template slot="thead">
            <vs-th sort-key="content$preview.type" class="w-1/12"><span class="w-full text-center">종류</span></vs-th>
            <vs-th sort-key="content$preview.period" class="w-1/12"><span class="w-full text-center">시기</span></vs-th>
            <vs-th sort-key="content$preview.report_content" class="w-2/12"><span class="w-full text-center">내용</span></vs-th>
            <vs-th sort-key="content$preview.writer" class="w-1/12"><span class="w-full text-center">작성자</span></vs-th>
            <vs-th sort-key="content$preview.create_at" class="w-1/12"><span class="w-full text-center">작성일</span></vs-th>
            <vs-th sort-key="content$preview.report_date" class="w-1/12"><span class="w-full text-center">신고변경일</span></vs-th>
            <vs-th class="w-1/12"><span class="w-full text-center">신고서</span></vs-th>
            <vs-th class="w-1/12"><span class="w-full text-center">신고필증</span></vs-th>
          </template>


          <template slot-scope="{data}">
            <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">

              <vs-td class="text-center">{{ getPreview(tr).type }}</vs-td>
              <vs-td class="text-center">{{ getPreview(tr).period }}</vs-td>
              <vs-td class="text-center">{{ getPreview(tr).report_content }}</vs-td>
              <vs-td class="text-center">{{ getPreview(tr).writer }}</vs-td>
              <vs-td class="text-center">{{ getPreview(tr).create_at }}</vs-td>
              <vs-td class="text-center">{{ getPreview(tr).report_date }}</vs-td>
              <vs-td class="text-center">
                <a v-if="getPreview(tr).attach_file.id" :href="getPreview(tr).attach_file.path" target="_blank" @click.stop>
                  <vs-icon icon-pack="feather" icon="icon-file"/>
                </a>
              </vs-td>
              <vs-td class="text-center">
                <a v-if="getPreview(tr).attach_certificate.id" :href="getPreview(tr).attach_certificate.path" target="_blank" @click.stop>
                  <vs-icon icon-pack="feather" icon="icon-file"/>
                </a>
              </vs-td>


            </vs-tr>
          </template>
        </vs-table>
      </vs-col>
    </vs-row>

    <popup-government-add
        :post-id="popupPostId"
        :popupActive="popupActiveReg"
        @popupActiveSync="popupActiveRegSync">
    </popup-government-add>

    <popup-excel-download
        v-model="showExcelDownload"
        :list="excelList"
        title="대관인허가신고"/>
  </div>
</template>

<script>
import PopupGovernmentAdd from '../../popup/PopupGovernmentAdd'
import SearchNav from '@/components/nav/SearchNav'
import SearchNavItemKeyword from '@/components/nav/SearchNavItemKeyword'
import PopupExcelDownload from '@/popup/PopupExcelDownload'

export default {
  name: 'StateGovernment',
  components: {
    SearchNavItemKeyword,
    SearchNav,
    PopupGovernmentAdd,
    PopupExcelDownload
  },
  data () {
    return {
      // 검색 네비게이션
      nav: {
        keyword: '',
        orderTarget:'created_at',
        orderDirection:'desc'
      },

      showExcelDownload: false,
      post_id: '',
      form: {
        field_name: '',          // 현장명
        type: '',                // 신고종류
        writer: '',              // 작성자
        period: '',              // 유효일
        report_date: '',         // 신고일
        report_content: '',      // 내용
        create_at: '',           // 작성일
        attach_file: {},         // 신고서
        attach_certificate: {},  // 신고필증
        preview: {
          field_name: '',
          type: '',
          writer: '',
          period: '',
          report_date: '',
          report_content: '',
          create_at: '',
          attach_file: {},
          attach_certificate: {}
        }
      },
      listAll: [],
      table: {
        list: [],
        perPage: 10,
        keyword: ''
      },
      currentPage: 1,
      popupPostId: '',
      popupActiveReg: false
    }
  },

  computed: {
    excelList () {
      const list = []
      for (const data of this.listAll) {
        list.push({
          'No.': data.id,
          '프로젝트': this.getPreview(data).field_name,
          '종류': this.getPreview(data).type,
          '작성자': this.getPreview(data).writer,
          '시기': this.getPreview(data).period,
          '신고일': this.getPreview(data).report_date,
          '내용': this.getPreview(data).report_content,
          '작성일': this.getPreview(data).create_at
        })
      }
      return list
    }
  },

  created () {
    this.loadPostList()
  },

  methods: {
    async loadPostList () {
      const projectId = this.$route.params.proj_id
      const boardId = 27 //state_government
      const page = 1
      const perPage = 30
      const orderTarget = this.nav.orderTarget
      const orderDirection = this.nav.orderDirection
      const keyword = []
      if (this.nav.keyword) {
        keyword.push(this.nav.keyword)
      }

      await this.$store.dispatch('board/LOAD_POST_LIST', {
        projectId,
        boardId,
        page,
        keyword,
        perPage, orderTarget, orderDirection
      })
      this.table.list = this.$store.state.board.postListInfo.data
    },

    async loadPostListAll () {
      const projectId = this.$route.params.proj_id
      const boardId = 27 //state_government
      const page = 1
      const perPage = 10000
      const orderTarget = this.nav.orderTarget
      const orderDirection = this.nav.orderDirection
      const keyword = []
      if (this.nav.keyword) {
        keyword.push(this.nav.keyword)
      }

      await this.$store.dispatch('board/LOAD_POST_LIST', {
        projectId,
        boardId,
        page,
        keyword,
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
          type: '',
          writer: '',
          period: '',
          report_date: '',
          report_content: '',
          create_at: '',
          attach_file: {},
          attach_certificate: {}
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

    handleClickRegister () {
      this.popupPostId = ''
      this.popupActiveReg = true
    },
    popupActiveRegSync () {
      this.popupActiveReg = false
      this.loadPostList()
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
