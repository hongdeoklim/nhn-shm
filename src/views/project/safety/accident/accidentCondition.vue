<template>
  <div>
    <!--  상단 검색바-->
    <search-nav @handleSearch="handleSearch">
      <search-nav-item-select label="대상기간" v-model="nav.year" :list="nav.yearList" />년
      <search-nav-item-select v-model="nav.month" :list="nav.monthList" />월
      <search-nav-item-keyword class="ml-4" label="현장명" v-model="nav.keyword" />
      <vs-button class="flex" type="border">상세검색</vs-button>
    </search-nav>

    <div class="mt-12">
      <table class="accidentTable">
        <thead>
        <tr>
          <th rowspan="2">구분</th>
          <th rowspan="2">현장명</th>
          <th colspan="2">[목공]도목수</th>
          <th colspan="2">[목공]건축목공</th>
          <th colspan="2">[목공]형틀목공</th>
          <th colspan="2">[목공]창호목공</th>
          <th colspan="2">[철근공]철근공</th>
          <th colspan="2">[용역/일반공]특별인부</th>
          <th colspan="2">[용역/일반공]보통인부(잡부-남)</th>
          <th colspan="2">[용역/일반공]보통인부(잡부-여)</th>
          <th colspan="2">전체</th>
        </tr>
        <tr>
          <th>전월까지</th>
          <th>누계</th>
          <th>전월까지</th>
          <th>누계</th>
          <th>전월까지</th>
          <th>누계</th>
          <th>전월까지</th>
          <th>누계</th>
          <th>전월까지</th>
          <th>누계</th>
          <th>전월까지</th>
          <th>누계</th>
          <th>전월까지</th>
          <th>누계</th>
          <th>전월까지</th>
          <th>누계</th>
          <th>전월까지</th>
          <th>누계</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(item, index) in list" :key="index">
          <th>구분</th>
          <td>{{item.field_name}}</td>

          <td>{{item['wood|carpenter']}}</td>
          <td>{{item['wood|carpenter_all']}}</td>

          <td>{{item['wood|architecture']}}</td>
          <td>{{item['wood|architecture_all']}}</td>

          <td>{{item['wood|concrete']}}</td>
          <td>{{item['wood|concrete_all']}}</td>

          <td>{{item['wood|window']}}</td>
          <td>{{item['wood|window_all']}}</td>

          <td>{{item['steel|bar_bender']}}</td>
          <td>{{item['steel|bar_bender_all']}}</td>

          <td>{{item['normal,service|special']}}</td>
          <td>{{item['normal,service|special_all']}}</td>

          <td>{{item['normal,service|male']}}</td>
          <td>{{item['normal,service|male_all']}}</td>

          <td>{{item['normal,service|female']}}</td>
          <td>{{item['normal,service|female_all']}}</td>

          <td>{{item['all']}}</td>
          <td>{{item['all_all']}}</td>

        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import DateSelector from '@/components/selector/DateSelector'
import ECharts from 'vue-echarts/components/ECharts'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/legend'
import 'echarts/lib/chart/bar'
import SearchNav from '@/components/nav/SearchNav'
import SearchNavItemDate from '@/components/nav/SearchNavItemDate'
import SearchNavItemKeyword from '@/components/nav/SearchNavItemKeyword'
import SearchNavItemSelect from '@/components/nav/SearchNavItemSelect'


export default {
  name: 'AccidentCondition',
  components: {
    SearchNavItemSelect,
    SearchNavItemKeyword,
    SearchNavItemDate,
    SearchNav,
    DateSelector,
    ECharts
  },
  data () {
    return {
      // 검색 네비게이션
      nav: {
        date: ['', ''],
        year: new Date().getFullYear(),
        yearList:[],
        month:new Date().getMonth() + 1,
        monthList:[
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
        keyword: ''
      },

      list:[],
      data:[]
    }
  },
  async created () {
    let nowYear = new Date().getFullYear()
    for (let i = 0; i < 50; i++) {
      this.nav.yearList.push({text:`${nowYear}`,  value:nowYear})
      nowYear--
    }
    this.nav.year = new Date().getFullYear()

    this.list = []
    this.data = []
    await this.loadPostListAll()
    await this.loadPostListMonth()
    const keys = Object.keys(this.data)
    for (const key of keys) {
      this.list.push(this.data[key])
    }
  },
  methods: {
    async loadPostListAll () {
      const boardId = 22
      const boardSlug = 'industrial_accident' // first_risk(id:6)
      const page = 1
      const perPage = 10000
      const keyword = []
      if (this.nav.keyword) keyword.push(`content$preview.field_name*%${this.nav.keyword}%`)

      await this.$store.dispatch('board/LOAD_POST_LIST', {
        boardId,
        page,
        perPage,
        keyword
      })

      const postListInfo = this.$store.state.board.postListInfo
      const list = postListInfo.data
      for (const item of list) {
        if (item.project) {
          const field_name = item.project.field_name
          const workType = this.getPreview(item).workType
          if (!this.data[field_name]) {
            this.data[field_name] = {
              field_name,
              'wood|carpenter': 0,
              'wood|architecture': 0,
              'wood|concrete': 0,
              'wood|window': 0,
              'steel|bar_bender': 0,
              'normal,service|special': 0,
              'normal,service|male': 0,
              'normal,service|female': 0,
              'all': 0,

              'wood|carpenter_all': 0,
              'wood|architecture_all': 0,
              'wood|concrete_all': 0,
              'wood|window_all': 0,
              'steel|bar_bender_all': 0,
              'normal,service|special_all': 0,
              'normal,service|male_all': 0,
              'normal,service|female_all': 0,
              'all_all': 0
            }
          }
          if (workType.length > 0) {
            this.data[field_name][`${workType}_all`] += 1
            this.data[field_name]['all_all'] += 1
          }
        }
      }
    },
    async loadPostListMonth () {
      const boardId = 22
      const boardSlug = 'industrial_accident' // first_risk(id:6)
      const page = 1
      const perPage = 10000
      const keyword = []
      if (this.nav.keyword) keyword.push(`content$preview.field_name*%${this.nav.keyword}%`)

      const year = this.nav.year
      const month = this.nav.month
      const dateBegin = this.getFirstDateWithSearchDate(year, month)
      const dateEnd = this.getLastDateWithSearchDate(year, month)

      await this.$store.dispatch('board/LOAD_POST_LIST', {
        boardId,
        page,
        perPage,
        dateTarget: 'created_at', //content$preview.disaster_date
        dateBegin,
        dateEnd,
        keyword
      })

      const postListInfo = this.$store.state.board.postListInfo
      const list = postListInfo.data
      for (const item of list) {
        if (item.project) {
          const field_name = item.project.field_name
          const workType = this.getPreview(item).workType
          if (!this.data[field_name]) {
            this.data[field_name] = {
              field_name,
              'wood|carpenter': 0,
              'wood|architecture': 0,
              'wood|concrete': 0,
              'wood|window': 0,
              'steel|bar_bender': 0,
              'normal,service|special': 0,
              'normal,service|male': 0,
              'normal,service|female': 0,
              'all': 0,

              'wood|carpenter_all': 0,
              'wood|architecture_all': 0,
              'wood|concrete_all': 0,
              'wood|window_all': 0,
              'steel|bar_bender_all': 0,
              'normal,service|special_all': 0,
              'normal,service|male_all': 0,
              'normal,service|female_all': 0,
              'all_all': 0
            }
          }
          if (workType.length > 0) {
            this.data[field_name][workType] += 1
            this.data[field_name]['all'] += 1
          }
        }
      }
    },

    getFirstDateWithSearchDate (year, month) {
      return new Date(`${year}-${month}-01`).format('yyyy-MM-dd')
    },

    getLastDateWithSearchDate (year, month) {
      let last = new Date(year, month)
      last = new Date(last - 1)
      return new Date(`${year}-${month}-${last.getDate()}`).format('yyyy-MM-dd')
    },

    getPreview (data) {
      if (data.preview) {
        const preview = JSON.parse(data.preview)
        return preview
      }

      return {
        'workType': '',
        'biz_p_name': '',
        'field_name': '',
        'supervisor': '',
        'victim_name': '',
        'accidentType': '',
        'disease_name': '',
        'bruise': '',
        'disease_type': '',
        'human_downfall': '',
        'disaster_date': ''
      }
    },

    async handleSearch () {
      this.list = []
      this.data = []
      await this.loadPostListAll()
      await this.loadPostListMonth()
      const keys = Object.keys(this.data)
      for (const key of keys) {
        this.list.push(this.data[key])
      }
    }
  }
}
</script>

<style scoped>
.tabList {

}

.tabList li {
  float: left;
  margin-right: 5px;
  padding: 12px 0;
  width: 120px;
  background-color: #fff;
  text-align: center;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  border: solid 1px #cdcdcd;
  border-bottom: none;
  box-sizing: border-box;
  color: #757575;
}

.tabList li.active {
  border: 1px solid #1E0D61;
  border-bottom: none;
  color: #1E0D61;
}

.accidentTable {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
}

.accidentTable, .accidentTable tr, .accidentTable th, .accidentTable td {
  border: 1px solid #cdcdcd;
  text-align: center;
  font-size: 14px;
  height: 50px;
}

.accidentTable th {
  background-color: #f0f0f0;
}
</style>
