<template>
  <vs-row class="px-3 xl:px-0">
    <!-- 그래프 1 -->
    <vs-col class="w-full pb-4">
      <monthly-chart-card
        :title="graph1.title"
        :year="graph1.year"
        :data1="graph1.data1"
        :data2="graph1.data2"
        @change="yearChangeForGraph1"
      />
    </vs-col>

    <!-- 그래프 2 -->
    <vs-col class="w-full pb-4">
      <monthly-chart-card2
        :title="graph2.title"
        :year="graph2.year"
        :month="graph2.month"
        :labels="graph2.labels"
        :data1="graph2.data1"
        :data2="graph2.data2"
        @change="dateChangeForGraph2"
      >
        <template slot="tools" :set="lv = getLevel">
          <vs-button v-if="lv === 1 || lv === 2 || lv === 3" type="border" color="secondary" @click="dataTypeChangeForGraph2('company')">{{ lv === 3? '하도급업체' : '공사관리부' }}</vs-button>
          <vs-button v-if="lv === 1 || lv === 2" class="ml-2" type="border" color="secondary" @click="dataTypeChangeForGraph2('field')">현장</vs-button>
          <vs-button class="ml-2" type="border" color="secondary" @click="dataTypeChangeForGraph2('detail1')">구분</vs-button>
          <vs-button class="ml-2" type="border" color="secondary" @click="dataTypeChangeForGraph2('detail2')">세부구분</vs-button>
          <vs-button class="ml-2" type="border" color="secondary" @click="dataTypeChangeForGraph2('detail3')">직종</vs-button>
        </template>
      </monthly-chart-card2>
    </vs-col>

    <!-- 그래프 3 -->
    <vs-col class="w-full pb-4">
      <monthly-comparison-card
        :title="graph3.title"
        :year="graph3.year"
        :month="graph3.month"
        :unit="graph3.unit"
        :heads="graph3.heads"
        :list="graph3.list"
        :getCol="getColForGraph3"

        @change="dateChangeForGraph3"
      >
        <template slot="tools">
          <div class="flex">
            <vs-select autocomplete >
              <vs-select-item value="현장1" text="현장1"/>
              <vs-select-item value="현장2" text="현장2"/>
              <vs-select-item value="현장3" text="현장3"/>
              <vs-select-item value="현장4" text="현장4"/>
            </vs-select>
            <vs-select class="ml-2" autocomplete >
              <vs-select-item value="현장1" text="현장1"/>
              <vs-select-item value="현장2" text="현장2"/>
              <vs-select-item value="현장3" text="현장3"/>
              <vs-select-item value="현장4" text="현장4"/>
            </vs-select>
          </div>
          <div class="flex mt-2">
            <vs-button type="border" color="secondary" @click="dataTypeChangeForGraph3('company')">구분</vs-button>
            <vs-button class="ml-2" type="border" color="secondary" @click="dataTypeChangeForGraph3('field')">세부구분</vs-button>
            <vs-button class="ml-2" type="border" color="secondary" @click="dataTypeChangeForGraph3('detail')">직종</vs-button>
          </div>
        </template>
      </monthly-comparison-card>
    </vs-col>
  </vs-row>
</template>

<script>
import MonthlyChartCard from '@/views/graph-detail/components/MonthlyChartCard'
import GraphUtil from '@/util/GraphUtil'
import MonthlyChartCard2 from '@/views/graph-detail/components/MonthlyChartCard2'
import MonthlyComparisonCard from '@/views/graph-detail/components/MonthlyComparisonCard'
import MonthlyComparisonUtil from '@/util/MonthlyComparisonUtil'
import DailyComparisonUtil from '@/util/DailyComparisonUtil'
import CircleGraphUtil from '@/util/CircleGraphUtil'
export default {
  name: 'GraphDetail02',
  components: {
    MonthlyComparisonCard,
    MonthlyChartCard2,
    MonthlyChartCard
  },
  props: {
    comGroupList: Object,
  },
  computed: {
    projectId () {
      return this.$route.params.proj_id
    },
    graphId () {
      return Number(this.$route.params.graphId)
    },
    getLevel () {
      const projects = this.$store.state.member.memberInfo.projects
      if (projects) {
        for (const proj of projects) {
          if (proj.id == this.projectId && proj.company.length>0) {
            const path = proj.company[0].pivot.company_path
            const lv = path.split('/').length - 1
            return lv
          }
        }
      }
    },
  },
  data () {
    return {
      boardId: 142,
      summaryKey: ['내부종사자_직종', 'count'],
      graph1: {
        title: '전체 내부종사자 현황',
        year: new Date().getFullYear(),
        data1: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // 선택한 년도
        data2: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // 선택한 년도의 이전 년도
      },
      graph2: {
        title: '월별 내부종사자 현황',
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
        labels: ['현장1', '현장2', '현장3', '현장4', '현장5'],
        data1: [0, 0, 0, 0, 0], // 선택한 년도
        data2: [0, 0, 0, 0, 0], // 선택한 년도의 이전 년도
        dataType: 'detail',
      },
      graph3: {
        title: '월별 산업안전보건위원회 구성 현황',
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
        unit: '',
        heads: [
          {name: 'No.'},
          {name: '분야명'},
          {name: '건(원)'},
          {name: '전월대비 증감'}
        ],
        list: [],
        summaryKey1: '',
        dataType:  'detail',
      },
    }
  },
  async mounted () {
    await this.$store.dispatch('member/LOAD_MEMBER_DETAIL')
    await this.loadGraph1()
    await this.loadGraph2()
    await this.loadGraph3()
  },

  methods: {

    // 그래프 1
    async loadGraph1 () {
      const summaryKey1 = this.summaryKey
      const year = this.graph1.year
      const value = await this.$store.dispatch('summary/FIRA_LOAD_SUMMARY', {
        boardId: this.boardId,
        projectIds: this.projectId ? [this.projectId] : [],
        beginAt: `${year - 1}-01-01 00:00:00`,
        endAt: `${year}-12-31 23:59:59`
      }).then(value => {
        return GraphUtil.getDataMonthlyBarGraph(value, year, summaryKey1)
      })
      this.graph1.data1 = value.data1
      this.graph1.data2 = value.data2
    },
    yearChangeForGraph1 (year) { this.graph1.year = year; this.loadGraph1() },


    // 그래프 2
    async loadGraph2 () {
      const dataType = this.graph2.dataType
      let summaryKey1 = this.summaryKey
      if (dataType === 'field') {
        summaryKey1 = ['내부종사자_현장명', 'count']
      } else if (dataType === 'detail1') {
        summaryKey1 = ['내부종사자_구분', 'count']
      } else if (dataType === 'detail2') {
        summaryKey1 = ['내부종사자_세부구분', 'count']
      }

      const beginAt = new Date(this.graph2.year, this.graph2.month - 2, 1).format('yyyy-MM-dd 00:00:00')
      const endAt = new Date(this.graph2.year, this.graph2.month, 0).format('yyyy-MM-dd 23:59:59')

      const value = await this.$store.dispatch('summary/FIRA_LOAD_SUMMARY', {
        boardId: this.boardId,
        projectIds: this.projectId ? [this.projectId] : [],
        beginAt,
        endAt
      }).then(value => {
        if (dataType === 'company') {
          return GraphUtil.getData월별업체합막대그래프(value, this.graph2.year, this.graph2.month, summaryKey1)
        } else {
          return GraphUtil.getData월별종류합막대그래프(value, this.graph2.year, this.graph2.month, summaryKey1)
        }
      })


      this.graph2.labels = value.labels
      this.graph2.data1 = value.data1
      this.graph2.data2 = value.data2
    },
    yearChangeForGraph2 (year) { this.graph2.year = year; this.loadGraph2() },
    dataTypeChangeForGraph2 (dataType) { this.graph2.dataType = dataType; this.loadGraph2() },
    dateChangeForGraph2 (year, month) { this.graph2.year = year; this.graph2.month = month; this.loadGraph2() },


    // 그래프 3
    async loadGraph3 () {
      const dataType = this.graph3.dataType // 'company', 'field', 'detail'
      let summaryKey1 = this.summaryKey
      if (dataType === 'field') {
        summaryKey1 = ['내부종사자_현장명', 'count']
      } else if (dataType === 'detail1') {
        summaryKey1 = ['내부종사자_구분', 'count']
      } else if (dataType === 'detail2') {
        summaryKey1 = ['내부종사자_세부구분', 'count']
      }

      const value = await this.$store.dispatch('summary/FIRA_LOAD_SUMMARY', {
        boardId: this.boardId,
        projectIds: this.projectId ? [this.projectId] : [],
        beginAt: `${this.graph3.year}-01-01 00:00:00`,
        endAt: `${this.graph3.year}-12-31 23:59:59`
      }).then(value => {

        if (dataType === 'company') {
          return MonthlyComparisonUtil.getCompanyFromEachCompany(value, this.graph3.year, this.graph3.month, summaryKey1)
        } else {
          return MonthlyComparisonUtil.getColumnFromEachCompany(value, this.graph3.year, this.graph3.month, summaryKey1)
        }
      })

      this.graph3.list = MonthlyComparisonUtil.moduleWithData(value)
    },
    getColForGraph3 (index, value) {
      if (index === 0) return value.no
      if (index === 1) return value.name
      if (index === 2) return value.value
      if (index === 3) {
        let updown = 'default'
        if (value.gap > 0) updown = 'up'
        else if (value.gap < 0) updown = 'down'
        return {type: updown, value: value.gap}
      }
      return ''
    },
    dateChangeForGraph3 (year, month) { this.graph3.year = year; this.graph3.month = month; this.loadGraph3() },
    dataTypeChangeForGraph3 (dataType) { this.graph3.dataType = dataType; this.loadGraph3() },
  }
}
</script>

<style scoped>

</style>
