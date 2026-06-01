<template>
  <div>

    <search-nav @handleSearch="handleSearch">
      <search-nav-item-select label="대상기간" v-model="nav.year" :list="nav.yearList" />년
      <search-nav-item-select v-model="nav.month" :list="nav.monthList"/>월
      <search-nav-item-select class="ml-4" label="교육구분" v-model="nav.hse_type" :list="nav.hse_type_list"/>
    </search-nav>

    <vs-row class="mb-4">
      <vs-col class="flex" vs-justify="flex-end">
        <vs-button type="border mr-2" color="secondary" @click="onClickDownload">{{$t('button.Excel 다운로드')}}</vs-button>
      </vs-col>
    </vs-row>

    <div v-if="table.list.length > 0" style="margin-bottom:60px;">
      <vs-row class="border">
        <vs-col>
          <div class="border-top border-left border-right table-display">
            <span class="title table-center border-left" style="grid-row: 1/3; grid-column: 1; ">대상기간(월)</span>
            <span class="title table-center border-left border-bottom" style="grid-row: 1; grid-column: 2/9">안전교육현황</span>

            <span class="title table-center border-left" style="grid-row: 2; grid-column: 2;">정기안전교육</span>
            <span class="title table-center border-left" style="grid-row: 2; grid-column: 3;">채용시 안전교육</span>
            <span class="title table-center border-left" style="grid-row: 2; grid-column: 4">작업내용 변경시 안전교육</span>
            <span class="title table-center border-left" style="grid-row: 2; grid-column: 5">특별안전교육</span>
            <span class="title table-center border-left" style="grid-row: 2; grid-column: 6">관리감독자 안전교육</span>
            <span class="title table-center border-left" style="grid-row: 2; grid-column: 7; ">MSDS</span>
            <span class="title table-center border-left" style="grid-row: 2; grid-column: 8; ">기타</span>
          </div>
        </vs-col>
      </vs-row>

      <vs-row class="">
        <vs-col class="border-bottom">
          <div class="border-top border-left border-right table-content" :data="tr" :key="indextr"
               v-for="(tr, indextr) in table.list">
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
              <span class="dot" :class="tr['MSDS(안전)'] > 0 ? 'blue' : 'red'"></span>
              <span v-if="tr['MSDS(안전)'] > 0">
                {{tr['MSDS(안전)']}}
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

    <div v-if="table2.list.length > 0">
      <vs-row class="border" >
        <vs-col>
          <div class="border-top border-left border-right table-display">
            <span class="title table-center border-left" style="grid-row: 1/3; grid-column: 1; ">대상기간(월)</span>
            <span class="title table-center border-left border-bottom" style="grid-row: 1; grid-column: 2/9">보건교육현황</span>

            <span class="title table-center border-left" style="grid-row: 2; grid-column: 2;">정기보건교육</span>
            <span class="title table-center border-left" style="grid-row: 2; grid-column: 3;">채용시 보건교육</span>
            <span class="title table-center border-left" style="grid-row: 2; grid-column: 4">작업내용 변경시 보건교육</span>
            <span class="title table-center border-left" style="grid-row: 2; grid-column: 5">특별보건교육</span>
            <span class="title table-center border-left" style="grid-row: 2; grid-column: 6">관리감독자 보건교육</span>
            <span class="title table-center border-left" style="grid-row: 2; grid-column: 7; ">MSDS</span>
            <span class="title table-center border-left" style="grid-row: 2; grid-column: 8; ">기타</span>
          </div>
        </vs-col>
      </vs-row>

      <vs-row class="">
        <vs-col class="border-bottom">
          <div class="border-top border-left border-right table-content" :data="tr" :key="indextr"
               v-for="(tr, indextr) in table2.list">
            <span class="table-center border-left">{{tr['month']}}</span>
            <span class="table-center border-left">
              <span class="dot" :class="tr['정기보건교육'] > 0 ? 'blue' : 'red'"></span>
              <span v-if="tr['정기보건교육'] > 0">
                {{tr['정기보건교육']}}
              </span>
            </span>
            <span class="table-center border-left">
              <span class="dot" :class="tr['채용시 보건교육'] > 0 ? 'blue' : 'red'"></span>
              <span v-if="tr['채용시 보건교육'] > 0">
                {{tr['채용시 보건교육']}}
              </span>
            </span>
            <span class="table-center border-left">
              <span class="dot" :class="tr['작업내용 변경시 보건교육'] > 0 ? 'blue' : 'red'"></span>
              <span v-if="tr['작업내용 변경시 보건교육'] > 0">
                {{tr['작업내용 변경시 보건교육']}}
              </span>
            </span>
            <span class="table-center border-left">
              <span class="dot" :class="tr['특별보건교육'] > 0 ? 'blue' : 'red'"></span>
              <span v-if="tr['특별보건교육'] > 0">
                {{tr['특별보건교육']}}
              </span>
            </span>
            <span class="table-center border-left">
              <span class="dot" :class="tr['관리감독자 보건교육'] > 0 ? 'blue' : 'red'"></span>
              <span v-if="tr['관리감독자 보건교육'] > 0">
                {{tr['관리감독자 보건교육']}}
              </span>
            </span>
            <span class="table-center border-left">
              <span class="dot" :class="tr['MSDS(보건)'] > 0 ? 'blue' : 'red'"></span>
              <span v-if="tr['MSDS(보건)'] > 0">
                {{tr['MSDS(보건)']}}
              </span>
            </span>
            <span class="table-center border-left">
              <span class="dot" :class="tr['기타(보건)'] > 0 ? 'blue' : 'red'"></span>
              <span v-if="tr['기타(보건)'] > 0">
                {{tr['기타(보건)']}}
              </span>
            </span>
          </div>
        </vs-col>
      </vs-row>
    </div>

    <popup-excel-download
      v-model="popup.excel"
      :list="excelList"
      title="교육 모니터링"/>

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
        excel: false,
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
    excelList () {
      const list = []
      for (const tr of this.table.list) {
        const obj = {}
        obj['교육종류'] = '안전교육'
        obj['대상기간'] = tr['month']
        obj['정기안전·보건교육'] = tr['정기안전교육']
        obj['채용시 안전·보건교육'] = tr['채용시 안전교육']
        obj['작업내용 변경시 안전·보건교육'] = tr['작업내용 변경시 안전교육']
        obj['특별안전·보건교육'] = tr['특별안전교육']
        obj['관리감독자 안전·보건교육'] = tr['관리감독자 안전교육']
        obj['MSDS'] = tr['MSDS(안전)']
        obj['기타'] = tr['기타(안전)']
        list.push(obj)
      }
      list.push({})
      list.push({})
      for (const tr of this.table2.list) {
        const obj = {}
        obj['교육종류'] = '보건교육'
        obj['대상기간'] = tr['month']
        obj['정기안전·보건교육'] = tr['정기보건교육']
        obj['채용시 안전·보건교육'] = tr['채용시 보건교육']
        obj['작업내용 변경시 안전·보건교육'] = tr['작업내용 변경시 보건교육']
        obj['특별안전·보건교육'] = tr['특별보건교육']
        obj['관리감독자 안전·보건교육'] = tr['관리감독자 보건교육']
        obj['MSDS'] = tr['MSDS(보건)']
        obj['기타'] = tr['기타(보건)']
        list.push(obj)
      }

      return list
    },
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
      for (let i=0; i<12; i++) {
        list.push({
          'month': i+1,
          '정기안전교육':0, '채용시 안전교육':0, '작업내용 변경시 안전교육':0, '특별안전교육':0, '관리감독자 안전교육':0, 'MSDS(안전)':0, '기타(안전)':0,
          '정기보건교육':0, '채용시 보건교육':0, '작업내용 변경시 보건교육':0, '특별보건교육':0, '관리감독자 보건교육':0, 'MSDS(보건)':0, '기타(보건)':0
        })
      }

      try {
        const tMonth = this.nav.month
        await this.$store.dispatch('summary/FIRA_LOAD_SUMMARY', {
          projectId: this.$route.params.proj_id,
          boardId,
          beginYear: this.nav.year,
          endYear: this.nav.year,
          groupByMonthly: 1,
          dateField: 'content$date' //content$date
        }).then(value => {
          list = []
          const tObj = value.all["교육구분"]
          const year = this.nav.year
          const monthList = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"]
          for (const month of monthList) {
            const key = `${year}-${month}`

            if (Number(`${tMonth}`) === 0
              || (Number(`${month}`) === Number(`${tMonth}`))
            ) {
              const hseObject = tObj[key]
              const data = {
                'month': month,
                '정기안전교육':0, '채용시 안전교육':0, '작업내용 변경시 안전교육':0, '특별안전교육':0, '관리감독자 안전교육':0, 'MSDS(안전)':0, '기타(안전)':0,
                '정기보건교육':0, '채용시 보건교육':0, '작업내용 변경시 보건교육':0, '특별보건교육':0, '관리감독자 보건교육':0, 'MSDS(보건)':0, '기타(보건)':0
              }
              if (hseObject) {
                data['정기안전교육'] += hseObject['count']['정기안전교육'] ? hseObject['count']['정기안전교육'] : 0
                data['채용시 안전교육'] += hseObject['count']['채용시 안전교육'] ? hseObject['count']['채용시 안전교육'] : 0
                data['작업내용 변경시 안전교육'] += hseObject['count']['작업내용 변경시 안전교육'] ? hseObject['count']['작업내용 변경시 안전교육'] : 0
                data['특별안전교육'] += hseObject['count']['특별안전교육'] ? hseObject['count']['특별안전교육'] : 0
                data['관리감독자 안전교육'] += hseObject['count']['관리감독자 안전교육'] ? hseObject['count']['관리감독자 안전교육'] : 0
                data['MSDS(안전)'] += hseObject['count']['MSDS(안전)'] ? hseObject['count']['MSDS(안전)'] : 0
                data['기타(안전)'] += hseObject['count']['기타(안전)'] ? hseObject['count']['기타(안전)'] : 0

                data['정기보건교육'] += hseObject['count']['정기보건교육'] ? hseObject['count']['정기보건교육'] : 0
                data['채용시 보건교육'] += hseObject['count']['채용시 보건교육'] ? hseObject['count']['채용시 보건교육'] : 0
                data['작업내용 변경시 보건교육'] += hseObject['count']['작업내용 변경시 보건교육'] ? hseObject['count']['작업내용 변경시 보건교육'] : 0
                data['특별보건교육'] += hseObject['count']['특별보건교육'] ? hseObject['count']['특별보건교육'] : 0
                data['관리감독자 보건교육'] += hseObject['count']['관리감독자 보건교육'] ? hseObject['count']['관리감독자 보건교육'] : 0
                data['MSDS(보건)'] += hseObject['count']['MSDS(보건)'] ? hseObject['count']['MSDS(보건)'] : 0
                data['기타(보건)'] += hseObject['count']['기타(보건)'] ? hseObject['count']['기타(보건)'] : 0
              }
              list.push(data)
            }

          }
        })
      } catch(err) {}

      this.table.list = []
      this.table2.list = []
      if (list.length) {
        list.map(value => {
          const month = value.month
          const safety = {
            month,
            '정기안전교육': value['정기안전교육'],
            '채용시 안전교육': value['채용시 안전교육'],
            '작업내용 변경시 안전교육': value['작업내용 변경시 안전교육'],
            '특별안전교육': value['특별안전교육'],
            '관리감독자 안전교육': value['관리감독자 안전교육'],
            'MSDS(안전)': value['MSDS(안전)'],
            '기타(안전)': value['기타(안전)']
          }
          const health = {
            month,
            '정기보건교육': value['정기보건교육'],
            '채용시 보건교육': value['채용시 보건교육'],
            '작업내용 변경시 보건교육': value['작업내용 변경시 보건교육'],
            '특별보건교육': value['특별보건교육'],
            '관리감독자 보건교육': value['관리감독자 보건교육'],
            'MSDS(보건)': value['MSDS(보건)'],
            '기타(보건)': value['기타(보건)']
          }

          if (this.nav.hse_type === 'safety' || this.nav.hse_type === '') {
            this.table.list.push(safety)
          }
          if (this.nav.hse_type === 'health' || this.nav.hse_type === '') {
            this.table2.list.push(health)
          }
        })
      }
    },

    onClickDownload () {
      this.popup.excel = true
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
