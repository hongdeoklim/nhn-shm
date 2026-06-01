<template>
  <div>
    <vx-card id="print-report" style="width:794px; visibility: hidden; position: absolute;">
      <!-- 타이틀 -->
      <vs-row class="mb-6">
        <vs-col class="flex " vs-justify="flex-end">
          <div class="mr-auto" style="display:grid; align-items: center;">
            <p class="h4 flex" style="align-items: center">
              농협네트웍스 SHM 스마트 보고서
            </p>
          </div>
        </vs-col>
      </vs-row>

      <!-- 기본정보 -->
      <vs-row class="mb-4" style="display: grid; grid-template-columns: 110px 1fr;" vs-align="center">
        <vs-col class="title">대상기간</vs-col>
        <vs-col >
          {{year}}년 {{month}}월
        </vs-col>
      </vs-row>
      <vs-row class="mb-4" style="display: grid; grid-template-columns: 110px 1fr;" vs-align="center">
        <vs-col class="title">소속</vs-col>
        <vs-col class="flex">
          <span >{{ comName }}</span>
        </vs-col>
      </vs-row>
      <vs-row class="mb-8" style="display: grid; grid-template-columns: 110px 1fr;" vs-align="center">
        <vs-col class="title">보고자</vs-col>
        <vs-col class="flex">
          <span >{{ writer }}</span>
        </vs-col>
      </vs-row>

      <!-- 모듈 -->
      <vs-row class="mb-4">
        <span class="font-bold" style="font-size: 14px;"><i class="dot"></i>모듈</span>
      </vs-row>
      <vs-row class="mb-4">
        <vs-col class="w-7/12">
          <div>
            {{ checkList }}
          </div>
        </vs-col>
      </vs-row>

      <!-- 현황 -->
      <vs-row class="mb-4">
        <span class="font-bold" style="font-size: 14px;"><i class="dot"></i>현황</span>
      </vs-row>
      <div>
        <smart-report-item
          v-for="(graph, index) in graphs"
          :key="`smart_report_item_${graph.name}`"
          :style="{ fontSize: '6px', pageBreakInside: 'avoid', pageBreakAfter: 'auto'}"
          :isPrint="true"
          :height="165"

          :value="graph"
          :year="year"
          :month="month"
        />
      </div>
    </vx-card>
    <vx-card>
      <!-- 타이틀 -->
      <vs-row class="mb-6">
        <vs-col class="flex " vs-justify="flex-end">
          <div class="mr-auto" style="display:grid; align-items: center;">
            <p class="h4 flex" style="align-items: center">
              농협네트웍스 SHM 스마트 보고서
            </p>
          </div>

          <div class="ml-auto" v-if="!isPrint">
            <vs-button class="ml-4" color="secondary" @click="onClickPrint">인쇄</vs-button>
            <vs-button class="ml-4" color="secondary" type="border" @click="onClickClose">뒤로</vs-button>
          </div>
        </vs-col>
      </vs-row>

      <!-- 기본정보 -->
      <vs-row class="mb-4" style="display: grid; grid-template-columns: 110px 1fr;" vs-align="center">
        <vs-col class="title">대상기간</vs-col>
        <vs-col v-if="isPrint">
          {{year}}년 {{month}}월
        </vs-col>
        <vs-col v-else class="flex">
          <search-nav-item-select v-model="year" style="width: 130px !important;" :list="yearList" @change="onChangeData"/>
          <span class="mr-4" style="display: flex; align-items: center;">년</span>
          <search-nav-item-select v-model="month" style="width: 130px !important;" :list="monthList" @change="onChangeData"/>
          <span style="display: flex; align-items: center;">월</span>
        </vs-col>
      </vs-row>
      <vs-row class="mb-4" style="display: grid; grid-template-columns: 110px 1fr;" vs-align="center">
        <vs-col class="title">소속</vs-col>
        <vs-col class="flex">
          <span v-if="isPrint">{{ comName }}</span>
          <ml-input v-else :value="comName" :readonly="true"/>
        </vs-col>
      </vs-row>
      <vs-row class="mb-8" style="display: grid; grid-template-columns: 110px 1fr;" vs-align="center">
        <vs-col class="title">보고자</vs-col>
        <vs-col class="flex">
          <span v-if="isPrint">{{ writer }}</span>
          <ml-input v-else v-model="writer" :readonly="true"/>
        </vs-col>
      </vs-row>

      <!-- 모듈 -->
      <vs-row class="mb-4">
        <span class="font-bold" style="font-size: 14px;"><i class="dot"></i>모듈</span>
      </vs-row>
      <vs-row class="mb-4">
        <vs-col class="w-7/12">
          <div v-if="isPrint">
            {{ checkList }}
          </div>
          <div v-else class="flex flex-wrap ">
            <vs-checkbox
              v-for="graph in graphs"
              :key="`select_graph_${graph.name}`"
              class="mb-4"
              v-model="graph.isShow">{{ graph.name }}
            </vs-checkbox>
          </div>
        </vs-col>
      </vs-row>

      <!-- 현황 -->
      <vs-row class="mb-4">
        <span class="font-bold" style="font-size: 14px;"><i class="dot"></i>현황</span>
      </vs-row>
      <div>
        <smart-report-item
          v-for="(graph, index) in graphs"
          :key="`smart_report_item_${graph.name}`"
          :isPrint="isPrint"

          :value="graph"
          :year="year"
          :month="month"
        />
      </div>
    </vx-card>
  </div>
</template>

<script>
import SearchNavItemSelect from '@/components/nav/SearchNavItemSelect'
import SmartReportItem from '@/views/smart-report/SmartReportItem'
export default {
  name: 'Index',
  components: { SmartReportItem, SearchNavItemSelect },
  data () {
    return {
      isPrint: false,
      boardId: 0,
      year: '',
      yearList: [],
      month: '',
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
      com_name: '',
      writer: '',
      graphs: [
        { isShow: false, name:'안전·보건 예산 현황', graphType: 1, boardId: '3' },
        { isShow: false, name:'산업재해발생 현황', graphType: 1, boardId: '45' },
        { isShow: false, name:'안전·보건 교육 현황', graphType: 1, boardId: '35' },
        { isShow: false, name:'파트너사 계약 현황', graphType: 1, boardId: '50' },
        { isShow: false, name:'위험성평가 현황', graphType: 1, boardId: '7' },
        { isShow: false, name:'작업허가서 현황', graphType: 1, boardId: '10' },
        { isShow: false, name:'안전점검 현황', graphType: 1, boardId: '48' },
        { isShow: false, name:'시정 및 예방조치 현황', graphType: 1, boardId: '36' },
      ],
    }
  },
  created () {
    let nowYear = new Date().getFullYear()
    this.year = nowYear
    this.month = new Date().getMonth() + 1
    for (let i = 0; i < 50; i++) {
      this.yearList.push({text:`${nowYear}`,  value:nowYear})
      nowYear--
    }
  },
  async mounted() {
    await this.$store.dispatch('company/LOAD_COMPANY', {companyId: this.$store.state.auth.userInfo.company_id})
    this.writer = this.$store.state.auth.userInfo.name
  },
  computed: {
    comName () {
      return this.$store.state.company.companyInfo.com_name
    },
    checkList () {
      let _temp = "";
      for (const graph of this.graphs) {
        if (graph.isShow) {
          if (_temp.length > 0) {
            _temp += ", "
          }
          _temp += graph.name
        }
      }
      return _temp;
    }
  },

  methods: {
    onClickPrint () {
      // 프린트
      this.isPrint = true

      setTimeout(() => {
        const g_oBeforeBody = document.getElementById('print-report').innerHTML
        // 프린트를 보이는 그대로 나오기위한 셋팅
        window.onbeforeprint = function () {
          document.body.style.width = '794px'
          document.body.style.backgroundColor = '#fff'
          //document.body.style.transform = `scale(${ 794 / window.innerHeight })`

          document.body.innerHTML = g_oBeforeBody
        }
        window.print()
        location.reload()
      }, 300)
    },
    onClickClose () { this.$router.back() },
    onChangeData () { },
  }
}
</script>

<style scoped>

</style>
