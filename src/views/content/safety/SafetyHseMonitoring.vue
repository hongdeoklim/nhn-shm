<template>
  <div>

    <search-nav @handleSearch="handleSearch">
      <search-nav-item-select label="대상기간" v-model="nav.year" :list="nav.yearList" />년
      <search-nav-item-select v-model="nav.month" :list="nav.monthList" @change="handleSearch"/>월
    </search-nav>


    <div class="w-full text-right mb-4">
      <vs-button class="mr-4" color="secondary" type="border"
                 @click="onClickDownload">{{ $t('button.Excel 다운로드') }}
      </vs-button>
    </div>

    <div style="margin-bottom:60px;">
      <vs-row class="border">
        <vs-col>
          <div class="border-top border-left border-right table-display">
            <span class="title table-center border-left" style="grid-row: 1/3; grid-column: 1; ">현장명</span>
            <span class="title table-center border-left" style="grid-row: 1/3; grid-column: 2; ">대상기간(월)</span>
            <span class="title table-center border-left border-bottom" style="grid-row: 1; grid-column: 3/10">안전교육현황</span>

            <span class="title table-center border-left" style="grid-row: 2; grid-column: 3;">정기안전교육</span>
            <span class="title table-center border-left" style="grid-row: 2; grid-column: 4;">채용시 안전교육</span>
            <span class="title table-center border-left" style="grid-row: 2; grid-column: 5">작업내용 변경시 안전교육</span>
            <span class="title table-center border-left" style="grid-row: 2; grid-column: 6">특별안전교육</span>
            <span class="title table-center border-left" style="grid-row: 2; grid-column: 7">관리감독자 안전교육</span>
            <span class="title table-center border-left" style="grid-row: 2; grid-column: 8; ">MSDS</span>
            <span class="title table-center border-left" style="grid-row: 2; grid-column: 9; ">기타</span>
          </div>
        </vs-col>
      </vs-row>

      <vs-row class="">
        <vs-col class="border-bottom">
          <div class="border-top border-left border-right table-content" :data="tr" :key="indextr"
               v-for="(tr, indextr) in table.list">
            <span class="table-center border-left">{{tr['proj']}}</span>
            <span class="table-center border-left">{{tr['month']}}</span>
            <span class="table-center border-left">
              <span class="dot" :class="tr['정기안전교육'] > 0 ? 'blue' : 'red'"></span>
              <span v-if="tr['정기안전교육'] > 0">
                {{tr['정기안전교육']}}
              </span>
            </span>
            <span class="table-center border-left">
              <span class="dot" :class="tr['채용시 안전교육'] > 0 ? 'blue' : 'red'"></span>
              <span v-if="tr['채용시 안전교육'] > 0">
                {{tr['채용시 안전교육']}}
              </span>
            </span>
            <span class="table-center border-left">
              <span class="dot" :class="tr['작업내용 변경시 안전교육'] > 0 ? 'blue' : 'red'"></span>
              <span v-if="tr['작업내용 변경시 안전교육'] > 0">
                {{tr['작업내용 변경시 안전교육']}}
              </span>
            </span>
            <span class="table-center border-left">
              <span class="dot" :class="tr['특별안전교육'] > 0 ? 'blue' : 'red'"></span>
              <span v-if="tr['특별안전교육'] > 0">
                {{tr['특별안전교육']}}
              </span>
            </span>
            <span class="table-center border-left">
              <span class="dot" :class="tr['관리감독자 안전교육'] > 0 ? 'blue' : 'red'"></span>
              <span v-if="tr['관리감독자 안전교육'] > 0">
                {{tr['관리감독자 안전교육']}}
              </span>
            </span>
            <span class="table-center border-left">
              <span class="dot" :class="tr['MSDS_안전'] > 0 ? 'blue' : 'red'"></span>
              <span v-if="tr['MSDS_안전'] > 0">
                {{tr['MSDS_안전']}}
              </span>
            </span>
            <span class="table-center border-left">
              <span class="dot" :class="tr['기타(안전)'] > 0 ? 'blue' : 'red'"></span>
              <span v-if="tr['기타(안전)'] > 0">
                {{tr['기타(안전)']}}
              </span>
            </span>
          </div>
        </vs-col>
      </vs-row>
    </div>

    <popup-excel-download
      v-model="popup.excel1"
      :list="excelList1"
      title="안전 교육 모니터링"/>

  </div>
</template>

<script>
import SearchNav from '@/components/nav/SearchNav'
import SearchNavItemDate from '@/components/nav/SearchNavItemDate'
import SearchNavItemSelect from '@/components/nav/SearchNavItemSelect'
import SearchNavItemKeyword from '@/components/nav/SearchNavItemKeyword'
import PopupExcelDownload from '@/popup/PopupExcelDownload'

export default {
  name: 'Monitoring',
  components: {
    PopupExcelDownload,
    SearchNavItemKeyword,
    SearchNavItemSelect,
    SearchNavItemDate,
    SearchNav
  },
  data () {
    return {
      popup: {
        excel1: false,
        excel2: false,
      },
      // 검색 네비게이션
      nav: {
        date: ['', ''],
        year: new Date().getFullYear(),
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
        hse_type:'',
        hse_type_list: [
          { text: '전체',  value: '' },
          { text: '안전',  value: 'safety' },
          { text: '보건',  value: 'health' }
        ]
      },

      table: {
        list: [],
        perPage: 30,
        keyword: ''
      },

      table2: {
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
    for (let i = 0; i < 50; i++) {
      this.nav.yearList.push({text:`${nowYear}`,  value:nowYear})
      nowYear--
    }
  },

  computed: {
    excelList1 () {
      const list = []
      for (const tr of this.table.list) {
        const obj = {}
        obj['현장명'] = tr['proj']
        obj['대상기간'] = tr['month']
        obj['정기안전교육'] = tr['정기안전교육']
        obj['채용시 안전교육'] = tr['채용시 안전교육']
        obj['작업내용 변경시 안전교육'] = tr['작업내용 변경시 안전교육']
        obj['특별안전교육'] = tr['특별안전교육']
        obj['관리감독자 안전교육'] = tr['관리감독자 안전교육']
        obj['MSDS'] = tr['MSDS_안전']
        obj['기타'] = tr['기타(안전)']
        list.push(obj)
      }
      return list
    },
    excelList2 () {
      const list = []
      for (const tr of this.table2.list) {
        const obj = {}
        obj['현장명'] = tr['proj']
        obj['대상기간'] = tr['month']
        obj['정기보건교육'] = tr['정기보건교육']
        obj['채용시 보건교육'] = tr['채용시 보건교육']
        obj['작업내용 변경시 보건교육'] = tr['작업내용 변경시 보건교육']
        obj['특별보건교육'] = tr['특별보건교육']
        obj['관리감독자 보건교육'] = tr['관리감독자 보건교육']
        obj['MSDS'] = tr['MSDS_보건']
        obj['기타'] = tr['기타(보건)']
        list.push(obj)
      }
      return list
    }
  },

  mounted () {
    this.loadCountGraph(35, 'hse_type')
  },

  methods: {

    handleSearch () {
      this.loadCountGraph(35, 'hse_type')
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
    /////////////

    async loadCountGraph (boardId, groupName) {
      let list = []
      await this.$store.dispatch('project/LOAD_PROJECT_LIST', {page:1, perPage: 1000}).then(value => {
        if (value.data) {
          const data = value.data

          for (const proj of data) {
            for (let i=0; i<12; i++) {
              list.push({
                'proj': proj.field_name, 'month': i+1,
                '정기안전교육':0, '채용시 안전교육':0, '작업내용 변경시 안전교육':0, '특별안전교육':0, '관리감독자 안전교육':0, 'MSDS_안전':0, '기타(안전)':0,
                '정기보건교육':0, '채용시 보건교육':0, '작업내용 변경시 보건교육':0, '특별보건교육':0, '관리감독자 보건교육':0, 'MSDS_보건':0, '기타(보건)':0
              })
            }
          }
        }
      })

      const tMonth = this.nav.month
      try {
        await this.$store.dispatch('summary/LOAD_SUMMARY', {
          boardId,
          beginYear: this.nav.year,
          endYear: this.nav.year,
          groupByProject: 1,
          groupByMonthly: 1,
          dateField: 'content$date' //content$date
        }).then(value => {

          const projList = Object.keys(value)
          // this month
          // 정기안전교육, 채용시 안전교육, 작업내용 변경시 안전교육, 특별안전교육, 관리감독자 안전교육, MSDS_안전, 기타(안전)
          // 정기보건교육, 채용시 보건교육, 작업내용 변경시 보건교육, 특별보건교육, 관리감독자 보건교육, MSDS_보건, 기타(보건)

          list = []
          for (const proj of projList) {
            const tObj = value[proj]
            const monthList = Object.keys(tObj.count)
            for (const month of monthList) {
              if (tMonth && (month !== tMonth)) {
                continue;
              }
              const hseObject = tObj.count[month]
              const data = {
                'proj': proj, 'month': month,
                '정기안전교육':0, '채용시 안전교육':0, '작업내용 변경시 안전교육':0, '특별안전교육':0, '관리감독자 안전교육':0, 'MSDS_안전':0, '기타(안전)':0,
                '정기보건교육':0, '채용시 보건교육':0, '작업내용 변경시 보건교육':0, '특별보건교육':0, '관리감독자 보건교육':0, 'MSDS_보건':0, '기타(보건)':0
              }
              if (hseObject && hseObject[groupName]) {
                const columnList = Object.keys(hseObject[groupName])
                if (columnList.length > 0) {
                }
                for (let i = 0; i < columnList.length; i++) {
                  const column = columnList[i]
                  data[column] = hseObject[groupName][column]
                }
              }
              list.push(data)
            }

          }
          return value;
        })
      }catch (err){}
      this.table.list = []
      this.table2.list = []
      if (list.length) {
        list.map(value => {
          const proj = value.proj
          const month = value.month
          const safety = {
            proj,
            month,
            '정기안전교육': value['정기안전교육'],
            '채용시 안전교육': value['채용시 안전교육'],
            '작업내용 변경시 안전교육': value['작업내용 변경시 안전교육'],
            '특별안전교육': value['특별안전교육'],
            '관리감독자 안전교육': value['관리감독자 안전교육'],
            'MSDS_안전': value['MSDS_안전'],
            '기타(안전)': value['기타(안전)']
          }
          const health = {
            proj,
            month,
            '정기보건교육': value['정기보건교육'],
            '채용시 보건교육': value['채용시 보건교육'],
            '작업내용 변경시 보건교육': value['작업내용 변경시 보건교육'],
            '특별보건교육': value['특별보건교육'],
            '관리감독자 보건교육': value['관리감독자 보건교육'],
            '기타(보건)': value['기타(보건)']
          }

          if (this.nav.hse_type === 'safety' || this.nav.hse_type === '') {
            this.table.list.push(safety)
          }
          if (this.nav.hse_type === 'health' || this.nav.hse_type === '') {
            //this.table2.list.push(health)
          }
        })
      }
    },

    onClickDownload () {
      this.popup.excel1 = true
    },
  }

}
</script>

<style scoped>

.table-display {
  display: grid;
  grid-template-rows: repeat(2, minmax(52px, 100%));
  grid-template-columns: 2fr repeat(8, minmax(0, 1fr));
}

.table-content {
  display: grid;
  grid-template-rows: minmax(52px, 100%);
  grid-template-columns: 2fr repeat(8, minmax(0, 1fr));
  background-color: white;
}

.table-center {
  display: flex;
  height: 100%;
  align-items: center;
  justify-content: center;
}
</style>
