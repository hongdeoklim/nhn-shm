<template>
  <div>

    <search-nav @handleSearch="handleSearch">
      <search-nav-item-select :label="$t('search.대상기간')" v-model="nav.year" :list="nav.yearList" />년
      <search-nav-item-select v-model="nav.month" :list="nav.monthList" />
      <search-nav-item-project :label="$t('search.현장명')" v-model="nav.projectId" class="mr-4"/>
    </search-nav>

    <vs-row class="mb-4">
      <vs-col class="flex" vs-justify="flex-end">
        <vs-button type="border mr-2" color="secondary">{{$t('button.Excel 다운로드')}}</vs-button>
      </vs-col>
    </vs-row>

    <vs-row class="border">
      <vs-col>
        <div class="border-top border-left border-right table-display">
          <span class="title table-center " style="grid-row: 1/3; grid-column: 1; ">{{$t('content.state.hse.monitoring.table.현장명')}}</span>
          <span class="title table-center border-left" style="grid-row: 1/3; grid-column: 2; ">{{$t('content.state.hse.monitoring.table.대상기간')}}</span>
          <span class="title table-center border-left border-bottom" style="grid-row: 1; grid-column: 3/8">{{$t('content.state.hse.monitoring.table.보건교육현황')}}</span>
          <span class="title table-center border-left" style="grid-row: 2; grid-column: 3;">{{$t('content.state.hse.monitoring.table.실시여부')}}</span>
          <span class="title table-center border-left" style="grid-row: 2; grid-column: 4;">{{$t('content.state.hse.monitoring.table.교육참석자')}}</span>
          <span class="title table-center border-left" style="grid-row: 2; grid-column: 5">{{$t('content.state.hse.monitoring.table.교육안')}}</span>
          <span class="title table-center border-left" style="grid-row: 2; grid-column: 6">{{$t('content.state.hse.monitoring.table.교육시간')}}</span>
          <span class="title table-center border-left" style="grid-row: 2; grid-column: 7">{{$t('content.state.hse.monitoring.table.교육인원')}}</span>
          <span class="title table-center border-left" style="grid-row: 1/3; grid-column: 8; ">{{$t('content.state.hse.monitoring.table.보기')}}</span>
        </div>
      </vs-col>
    </vs-row>


    <vs-row class="">
      <vs-col class="border-bottom">
        <div class="border-top border-left border-right table-content" :data="tr" :key="indextr"
             v-for="(tr, indextr) in table.list">
          <span class="table-center">{{ getPreview(tr).field_name }}</span>
          <span class="table-center border-left">{{ getStdDate(tr.created_at) }}</span>
          <span class="table-center border-left"><i class="dot yellow"></i></span>
          <span class="table-center border-left"><i class="dot"></i><i class="dot red"></i></span>
          <span class="table-center border-left">
            <a download target="_blank" :href="file.path" v-for="(file, index) in getPreview(tr).attach" :key="index"
               @click.stop>
              <vs-icon icon-pack="feather" icon="icon-file"/>
            </a>
          </span>
          <span class="table-center border-left">
            {{ getHseTime(tr) }}
          </span>
          <span class="table-center border-left">{{getPreview(tr).total}}</span>
          <span class="table-center border-left"></span>
        </div>
      </vs-col>
    </vs-row>

  </div>
</template>

<script>
import SearchNav from '@/components/nav/SearchNav'
import SearchNavItemDate from '@/components/nav/SearchNavItemDate'
import SearchNavItemSelect from '@/components/nav/SearchNavItemSelect'
import SearchNavItemKeyword from '@/components/nav/SearchNavItemKeyword'
import SearchNavItemProject from '@/components/nav/SearchNavItemProject'

export default {
  name: 'StateHSEMonitoring',
  components: {
    SearchNavItemProject,
    SearchNavItemKeyword,
    SearchNavItemSelect,
    SearchNavItemDate,
    SearchNav
  },
  data () {
    return {
      // 검색 네비게이션
      nav: {
        projectId:'',
        date: ['', ''],
        year: '',
        yearList:[],
        month: '',
        monthList:[
          {text:'전체', value:''},
          {text:'1', value:'1'},
          {text:'2', value:'2'},
          {text:'3', value:'3'},
          {text:'4', value:'4'},
          {text:'5', value:'5'},
          {text:'6', value:'6'},
          {text:'7', value:'7'},
          {text:'8', value:'8'},
          {text:'9', value:'9'},
          {text:'10', value:'10'},
          {text:'11', value:'11'},
          {text:'12', value:'12'}
        ],
        hse_type:'environ',
        hse_type_list: [
          { text: '전체',  value: '' },
          { text: '안전',  value: 'safety' },
          { text: '환경',  value: 'environ' },
          { text: '보건',  value: 'health' },
        ],
      },

      table: {
        list: [],
        perPage: 30,
        keyword: ''
      }
    }
  },

  created () {
    const paths = this.$route.path.split('/')
    this.rootPath = `/${paths[1]}/${paths[2]}`

    let nowYear = new Date().getFullYear()
    this.nav.yearList.push({text:'전체',  value:''})
    for (let i = 0; i < 50; i++) {
      this.nav.yearList.push({text:`${nowYear}`,  value:nowYear})
      nowYear--
    }

    this.loadPostList()
  },

  methods: {
    async loadPostList () {
      const projectId = this.nav.projectId
      const boardId = 35
      const boardSlug = 'hse_management' // first_risk(id:6)
      const page = this.currentPage
      const perPage = this.table.perPage
      const dateTarget = 'created_at'
      const year = this.nav.year
      const month = this.nav.month
      const dateBegin = this.getFirstDateWithSearchDate(year, month)
      const dateEnd = this.getLastDateWithSearchDate(year, month)

      const keyword = []
      if (this.nav.hse_type) keyword.push(`content$hse_type*${this.nav.hse_type}`)

      await this.$store.dispatch('board/LOAD_POST_LIST', {
        projectId,
        boardId,
        page,
        perPage,
        dateTarget,
        dateBegin,
        dateEnd,
        keyword
      })

      const postListInfo = this.$store.state.board.postListInfo
      this.table.list = postListInfo.data
      this.currentPage = postListInfo.current_page
      this.lastPage = postListInfo.last_page

    },

    handleSearch () {
      this.currentPage = 1
      this.loadPostList()
    },

    getPreview (data) {
      if (data.preview) {
        const preview = JSON.parse(data.preview)
        return preview
      }
    },

    getHseType (hse_type) {

      if (hse_type === 'safety') return '안전'
      if (hse_type === 'environ') return '환경'
      if (hse_type === 'health') return '보건'

      return ''
    },

    getStdDate (date) {
      const d = new Date(date)

      return `${d.getFullYear()}년 ${d.getMonth() + 1}월`
    },

    getHseTime (data) {
      const preview = this.getPreview(data)
      const date = new Date(preview.date).format('yyyy-MM-dd')
      const s_time = preview.s_time.split(':')
      const s_hh = s_time[0]
      const s_mm = s_time[1]
      const s_dd = s_time[2]
      const e_time = preview.e_time.split(':')
      const e_hh = e_time[0]
      const e_mm = e_time[1]
      const e_dd = e_time[2]
      const time = Math.abs(new Date(`${date} ${s_hh}:${s_mm}:${s_dd}`) - new Date(`${date} ${e_hh}:${e_mm}:${e_dd}`))
      const t_hh = Math.floor(time / (1000 * 60 * 60))
      const t_mm = Math.floor((time - (t_hh * (1000 * 60 * 60))) / (1000 * 60))
      let strReturn = `${t_hh}시간 ${t_mm}분`

      if (t_mm === 0) {
        strReturn = `${t_hh}시간`
      }

      return strReturn
    },

    getFirstDateWithSearchDate (year, month) {
      if (year > 0 && month > 0) {
        return new Date(`${year}-${month}-01`).format('yyyy-MM-dd')
      } else if (year > 0 && month === '') {
        return new Date(`${year}-01-01`).format('yyyy-MM-dd')
      }

      return ''
    },

    getLastDateWithSearchDate (year, month) {
      if (year > 0 && month > 0) {
        let last = new Date(year, month)
        last = new Date(last - 1)
        return new Date(`${year}-${month}-${last.getDate()}`).format('yyyy-MM-dd')
      } else if (year > 0 && month === '') {
        return new Date(`${year}-12-31`).format('yyyy-MM-dd')
      }

      return ''
    },
  }

}
</script>

<style scoped>

.table-display {
  display: grid;
  grid-template-rows: repeat(2, minmax(52px, 100%));
  grid-template-columns: 2fr repeat(7, minmax(0, 1fr));
}

.table-content {
  display: grid;
  grid-template-rows: minmax(52px, 100%);
  grid-template-columns: 2fr repeat(7, minmax(0, 1fr));
  background-color: white;
}

.table-center {
  display: flex;
  height: 100%;
  align-items: center;
  justify-content: center;
}
</style>
