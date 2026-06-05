<template>
  <vs-row>
    <!-- 그래프 1 -->
    <vs-col class="w-full pb-4">
      <vx-card>
        <div class="flex" style="justify-content: space-between;">
          <span class="font-bold" style="font-size: 14px;"><i class="dot"></i>{{ graph1.title }}</span>
          <vs-select style="width:80px;" v-model="graph1.year" autocomplete @change="loadGraph1">
            <vs-select-item v-for="n in (nowYear-2020) + 1" :key="`graph1_year_${n}`" :value="nowYear - (n-1)"
                            :text="`${nowYear - (n-1)}년`"/>
          </vs-select>
        </div>
        <div class="flex">
          <div class="flex" style="align-items: center;">
            <feather-icon class="mr-2" icon="CircleIcon" style="width:14px; color:#6670CB"/>
            <span class="mr-2">금년 총계</span>
            <span style="font-size:24px; font-weight:500;">{{ sum(graph1.thisYear) | comma }}</span>
          </div>
          <div class="flex ml-8" style="align-items: center;">
            <feather-icon class="mr-2" icon="CircleIcon" style="width:14px; color:#BCBCBC"/>
            <span class="mr-2">전년 총계</span>
            <span style="font-size:24px; font-weight:500;">{{ sum(graph1.previousYear) | comma }}</span>
          </div>
        </div>

        <comparison-bar-graph :data1="graph1.thisYear" :data2="graph1.previousYear" :max="graph1Max"
                              :unit="graph1.unit"/>
      </vx-card>
    </vs-col>

    <!-- 그래프 2 -->
    <vs-col class="w-1/2 pr-2 pb-4">
      <vx-card class="graph2" style="height:100%;">
        <div class="flex"
             style="justify-content: space-between; padding-top:1.5rem; padding-right:1.5rem; padding-left:1.5rem;">
          <span class="font-bold" style="font-size: 14px;"><i class="dot"></i>{{ graph2.title }}</span>
          <div class="flex" style="gap:12px">
            <vs-select style="width:80px;" v-model="graph2.year" autocomplete @change="loadGraph2">
              <vs-select-item v-for="n in (nowYear-2020) + 1" :key="`graph2_year_${n}`" :value="nowYear - (n-1)"
                              :text="`${nowYear - (n-1)}년`"/>
            </vs-select>
            <vs-select style="width:80px;" v-model="graph2.month" autocomplete @change="loadGraph2">
              <vs-select-item v-for="n in 12" :key="`graph2_month_${n}`" :value="n" :text="`${n}월`"/>
            </vs-select>
          </div>
        </div>

        <table-list-page
          bodyStyle="none"

          download="안전·보건예산 현황"
          :base-column="false"
          :create="false"
          :move-detail="false"
          :approval="false"
          :showNav="false"
          :download="false"

          :list="graph2.list"
          :use-list="true"
          :nav="graph2.nav"
          :heads="graph2.heads"
          :getCol="getGraph2Col"
          @detail="onClickDetailLv2"
        >
        </table-list-page>
      </vx-card>
    </vs-col>

    <!-- 그래프 3 -->
    <vs-col class="w-1/2 pl-2 pb-4">
      <vx-card>
        <div class="flex" style="justify-content: space-between;">
          <span class="font-bold" style="font-size: 14px;"><i class="dot"></i>{{ graph3.title }}</span>
          <div v-if="graph3.dateType === 'day'" class="flex" style="gap:12px">
            <search-nav-item-select v-if="$route.params.boardId === '50'"
                                    class="mr-2" size="big" v-model="price" :list="priceList" @change="loadGraph3"/>
            <date-selector style="width:127px;" v-model="graph3.beginDate" @change="loadGraph3"/>
            <span class="flex" style="align-items: center;">~</span>
            <date-selector style="width:127px;" v-model="graph3.endDate" @change="loadGraph3"/>
          </div>
          <div v-else class="flex" style="gap:12px">
            <vs-select style="width:80px;" v-model="graph3.beginYear" autocomplete>
              <vs-select-item v-for="n in (nowYear-2020) + 1" :key="`graph3_beginYear_${n}`" :value="nowYear - (n-1)"
                              :text="`${nowYear - (n-1)}년`"/>
            </vs-select>
            <vs-select style="width:80px;" v-model="graph3.beginMonth" autocomplete @change="loadGraph3">
              <vs-select-item v-for="n in 12" :key="`graph3_beginMonth_${n}`" :value="n" :text="`${n}월`"/>
            </vs-select>
            <span class="flex" style="align-items: center;">~</span>
            <vs-select style="width:80px;" v-model="graph3.endYear" autocomplete>
              <vs-select-item v-for="n in (nowYear-2020) + 1" :key="`graph3_beginYear_${n}`" :value="nowYear - (n-1)"
                              :text="`${nowYear - (n-1)}년`"/>
            </vs-select>
            <vs-select style="width:80px;" v-model="graph3.endMonth" autocomplete @change="loadGraph3">
              <vs-select-item v-for="n in 12" :key="`graph3_beginMonth_${n}`" :value="n" :text="`${n}월`"/>
            </vs-select>
          </div>
        </div>

        <basic-bar-graph v-if="$route.params.boardId === '50'" :value="graph3List" :unit="graph3.unit" :max="graph3Max"
                         :useSubValue="true" :sub-value="[1000,100]" :is-partner="true"/>
        <basic-bar-graph v-else :value="graph3List" :unit="graph3.unit" :max="graph3Max" :useSubValue="true"
                         :sub-value="[1000,100]"/>
        <div class="vs-con-table">
          <div class="con-pagination-table vs-table--pagination">
            <k-pagination :total="graph3Total" v-model="graph3.page" @change="onChangeGraph3Page"/>
          </div>
        </div>
      </vx-card>
    </vs-col>

    <!-- 그래프 4 -->
    <vs-col v-if="isShowGraph4" class="w-1/2 pr-2">
      <vx-card class="graph2" style="height:100%;">
        <div class="flex"
             style="justify-content: space-between; padding-top:1.5rem; padding-right:1.5rem; padding-left:1.5rem;">
          <span class="font-bold" style="font-size: 14px;"><i class="dot"></i>{{ graph4.title }}</span>
          <div class="flex" style="gap:12px">
            <vs-select style="width:80px;" v-model="graph4.year" autocomplete @change="loadGraph4">
              <vs-select-item v-for="n in (nowYear-2020) + 1" :key="`graph4_year_${n}`" :value="nowYear - (n-1)"
                              :text="`${nowYear - (n-1)}년`"/>
            </vs-select>
            <vs-select style="width:80px;" v-model="graph4.month" autocomplete @change="loadGraph4">
              <vs-select-item v-for="n in 12" :key="`graph4_month_${n}`" :value="n" :text="`${n}월`"/>
            </vs-select>
          </div>
        </div>

        <table-list-page
          bodyStyle="none"

          download="안전·보건예산 현황"
          :base-column="false"
          :create="false"
          :move-detail="false"
          :approval="false"
          :showNav="false"
          :download="false"

          :list="graph4.list"
          :use-list="true"
          :nav="graph4.nav"
          :heads="graph4.heads"
          :getCol="getGraph4Col"
        >
        </table-list-page>
      </vx-card>
    </vs-col>

    <!-- 그래프 5 -->
    <vs-col v-if="isShowGraph5" class="w-1/2 pl-2">
      <vx-card>
        <div class="flex" style="justify-content: space-between;">
          <span class="font-bold" style="font-size: 14px;"><i class="dot"></i>{{ graph5.title }}</span>
          <div v-if="graph5.dateType === 'day'" class="flex" style="gap:12px">
            <search-nav-item-select v-if="$route.params.boardId === '50'"
                                    class="mr-2" size="big" v-model="price" :list="priceList" @change="loadGraph5"/>
            <date-selector style="width:127px;" v-model="graph5.beginDate" @change="loadGraph5"/>
            <span class="flex" style="align-items: center;">~</span>
            <date-selector style="width:127px;" v-model="graph5.endDate" @change="loadGraph5"/>
          </div>
          <div v-else class="flex" style="gap:12px">
            <vs-select style="width:80px;" v-model="graph5.beginYear" autocomplete>
              <vs-select-item v-for="n in (nowYear-2020) + 1" :key="`graph5_beginYear_${n}`" :value="nowYear - (n-1)"
                              :text="`${nowYear - (n-1)}년`"/>
            </vs-select>
            <vs-select style="width:80px;" v-model="graph5.beginMonth" autocomplete @change="loadGraph5">
              <vs-select-item v-for="n in 12" :key="`graph5_beginMonth_${n}`" :value="n" :text="`${n}월`"/>
            </vs-select>
            <span class="flex" style="align-items: center;">~</span>
            <vs-select style="width:80px;" v-model="graph5.endYear" autocomplete>
              <vs-select-item v-for="n in (nowYear-2020) + 1" :key="`graph5_beginYear_${n}`" :value="nowYear - (n-1)"
                              :text="`${nowYear - (n-1)}년`"/>
            </vs-select>
            <vs-select style="width:80px;" v-model="graph5.endMonth" autocomplete @change="loadGraph5">
              <vs-select-item v-for="n in 12" :key="`graph5_beginMonth_${n}`" :value="n" :text="`${n}월`"/>
            </vs-select>
          </div>
        </div>

        <basic-bar-graph v-if="$route.params.boardId === '50'" :value="graph5List" :unit="graph5.unit" :max="graph5Max"
                         :useSubValue="true" :sub-value="[1000,100]" :is-partner="true"/>
        <basic-bar-graph v-else :value="graph5List" :unit="graph5.unit" :max="graph5Max" :useSubValue="true"
                         :sub-value="[1000,100]"/>
        <div class="vs-con-table">
          <div class="con-pagination-table vs-table--pagination">
            <k-pagination :total="graph5Total" v-model="graph5.page" @change="onChangeGraph5Page"/>
          </div>
        </div>
      </vx-card>
    </vs-col>
  </vs-row>
</template>

<script>
import ComparisonBarGraph from '@/components/ComparisonBarGraph'
import TableListPage from '@/views/list/TableListPage'
import BasicBarGraph from '@/components/BasicBarGraph'
import KPagination from '@/components/kPagination/kPagination'
import DateSelector from '@/components/selector/DateSelector'
import SearchNavItemSelect from '@/components/nav/SearchNavItemSelect'

export default {
  name: 'Index',
  components: {
    SearchNavItemSelect,
    DateSelector,
    KPagination,
    BasicBarGraph,
    TableListPage,
    ComparisonBarGraph
  },
  data () {
    return {
      graph1: {
        title: '',
        year: '',
        thisYear: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        previousYear: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        unit: ''
      },
      graph2: {
        unit: '',
        title: '',
        year: '',
        month: '',
        nav: {
          projectId: 0,
          orderTarget: 'created_at',
          orderDirection: 'desc',
          date: {},
          keyword: [
            'content$header.year*[:nav.date.year]',
            'content$header.month*[:nav.date.month]'
          ]
        },
        heads: [
          {name: '순위'},
          {name: '현장명'},
          {name: '예산'},
          {name: '전월대비증감'}
        ],
        list: []
      },
      graph3: {
        title: '',
        list: [],
        perPage: 10,
        page: 1,
        unit: '',
        beginYear: '',
        beginMonth: '',
        beginDate: new Date().format('yyyy-MM-dd'),
        endYear: '',
        endMonth: '',
        endDate: new Date().addDays(1).format('yyyy-MM-dd'),
        dateType: 'day'
      },

      graph4: {
        unit: '',
        title: '',
        year: '',
        month: '',
        nav: {
          projectId: 0,
          orderTarget: 'created_at',
          orderDirection: 'desc',
          date: {},
          keyword: [
            'content$header.year*[:nav.date.year]',
            'content$header.month*[:nav.date.month]'
          ]
        },
        heads: [
          {name: '순위'},
          {name: '항목명'},
          {name: '예산'},
          {name: '전월대비증감'}
        ],
        list: []
      },
      graph5: {
        title: '',
        list: [],
        perPage: 10,
        page: 1,
        unit: '',
        beginYear: '',
        beginMonth: '',
        beginDate: new Date().format('yyyy-MM-dd'),
        endYear: '',
        endMonth: '',
        endDate: new Date().addDays(1).format('yyyy-MM-dd'),
        dateType: 'day'
      },
      price: '',
      priceList: [
        {
          text: '전체',
          value: ''
        },
        {
          text: '50억이상',
          value: '50'
        },
        {
          text: '10억이상 50억미만',
          value: '10'
        },
        {
          text: '5억이상 10억미만',
          value: '5'
        },
        {
          text: '5억미만',
          value: '0'
        }
      ]
    }
  },
  mounted () {

    const boardId = this.boardId
    this.graph1.year = new Date().format('yyyy')
    this.graph2.year = new Date().format('yyyy')
    this.graph2.month = new Date().getMonth() + 1
    this.graph3.beginYear = new Date().format('yyyy')
    this.graph3.beginMonth = new Date().getMonth() + 1
    this.graph3.endYear = new Date().format('yyyy')
    this.graph3.endMonth = new Date().getMonth() + 1
    this.graph4.year = new Date().format('yyyy')
    this.graph4.year = new Date().format('yyyy')
    this.graph4.month = new Date().getMonth() + 1
    this.graph5.beginYear = new Date().format('yyyy')
    this.graph5.beginMonth = new Date().getMonth() + 1
    this.graph5.endYear = new Date().format('yyyy')
    this.graph5.endMonth = new Date().getMonth() + 1

    if (boardId === '3') this.initDateLabel3()
    else if (boardId === '45') this.initDateLabel45()
    else if (boardId === '35') this.initDateLabel35()
    else if (boardId === '50') this.initDateLabel50()
    else if (boardId === '7') this.initDateLabel7()
    else if (boardId === '10') this.initDateLabel10()
    else if (boardId === '48') this.initDateLabel48()
    else if (boardId === '36') this.initDateLabel36()

    this.loadGraph1()
    this.loadGraph2()
    this.loadGraph3()
    if (this.myLv < 4) {
      this.loadGraph4()
      this.loadGraph5()
    }
  },

  computed: {
    projectId () {
      return this.$route.params.proj_id
    },
    companyInfo () {
      return this.$store.state.auth.companyInfo
    },
    boardId () {
      return this.$route.params.boardId
    },
    nowYear () {
      return new Date().getFullYear()
    },
    isShowGraph4 () {
      if (this.projectId && this.myLv >= 4) return false
      return (`${this.boardId}` !== '35') && (`${this.boardId}` !== '48') && (`${this.boardId}` !== '50')
    },
    isShowGraph5 () {
      if (this.projectId && this.myLv >= 4) return false
      return (`${this.boardId}` !== '35') && (`${this.boardId}` !== '48') && (`${this.boardId}` !== '50')
    },
    graph3List () {
      const perPage = this.graph3.perPage
      const index = (this.graph3.page - 1) * perPage
      const list = JSON.parse(JSON.stringify(this.graph3.list))
      return list.splice(index, perPage)
    },
    graph3Total () {
      const total = this.graph3.list.length
      const perPage = this.graph3.perPage
      return Math.floor((total - 1) / perPage) + 1
    },
    graph5List () {
      const perPage = this.graph5.perPage
      const index = (this.graph5.page - 1) * perPage
      const list = JSON.parse(JSON.stringify(this.graph5.list))
      return list.splice(index, perPage)
    },
    graph5Total () {
      const total = this.graph5.list.length
      const perPage = this.graph5.perPage
      return Math.floor((total - 1) / perPage) + 1
    },
    graph1Max () {
      let max = 5
      if (this.graph1.thisYear && this.graph1.thisYear.length > 0) {
        for (const value of this.graph1.thisYear) {
          max = Math.max(value, max)
        }
      }
      if (this.graph1.previousYear && this.graph1.previousYear.length > 0) {
        for (const value of this.graph1.previousYear) {
          max = Math.max(value, max)
        }
      }
      return max
    },
    graph3Max () {
      if (this.graph3.list.length > 0) {
        let f = parseInt(`${this.graph3.list[0].value}`[0]) + 1
        for (let i = 0; i < `${this.graph3.list[0].value}`.length - 1; i++) {
          f = `${f}0`
        }
        return f
      }
      return 0
    },
    graph5Max () {
      if (this.graph5.list.length > 0) {
        let f = parseInt(`${this.graph5.list[0].value}`[0]) + 1
        for (let i = 0; i < `${this.graph5.list[0].value}`.length - 1; i++) {
          f = `${f}0`
        }
        return f
      }
      return 0
    },
    myLv () {
      return this.$store.state.auth.userInfo.position
    },
    projectList () {
      const list = this.$store.state.project.projectListInfo.data
      const projectList = []
      if (list && list.length > 0) {
        for (const proj of list) {
          projectList.push(proj.field_name)
        }
      }
      return projectList
    },
  },

  methods: {
    onChangeGraph3Page (page) {
      this.graph3.page = page
    },
    onChangeGraph5Page (page) {
      this.graph5.page = page
    },
    getGraph2Col (index, value) {
      if (index === 0) return value.no
      if (index === 1) return value.name
      if (index === 2) return `${this.comma(value.value)} ${this.graph2.unit}`

      if (index === 3) {
        if (this.$route.params.boardId === '50') {
          return `${(value.sum) ? this.comma(value.sum) : '0'} 원`
        } else if (this.$route.params.boardId === '35') {
          return `${(value.sum) ? this.comma(value.sum) : '0'} 명`
        } else {
          return {
            value: `${this.comma(value.gap)} ${this.graph2.unit}`,
            type: value.gap > 0 ? 'up' : (value.gap < 0) ? 'down' : 'forward'
          }
        }
      }

      return ''
    },
    getGraph4Col (index, value) {
      if (index === 0) return value.no
      if (index === 1) return value.name
      if (index === 2) return `${this.comma(value.value)} ${this.graph2.unit}`

      if (index === 3) {
        if (this.$route.params.boardId === '50') {
          return `${(value.sum) ? this.comma(value.sum) : '0'} 원`
        } else {
          return {
            value: `${this.comma(value.gap)} ${this.graph2.unit}`,
            type: value.gap > 0 ? 'up' : (value.gap < 0) ? 'down' : 'forward'
          }
        }
      }

      return ''
    },
    sum (values) {
      let sum = 0
      if (values && values.length > 0) {
        values.map(value => {
          sum += value
        })
      }
      return sum
    },
    comma (str) {
      str = `${str}`
      if (str && str.length > 0) {
        return str.replace(/,/gi, '').replace(/\B(?=(\d{3})+(?!\d))/gi, ',')
      }
    },

    async loadGraph1 () {
      const boardId = this.$route.params.boardId
      let graphThis
      let graphPrev

      if (boardId === '3') {
        graphThis = await this.loadGraphMonthly(3, 'sum', 1, {year: this.graph1.year})
        graphPrev = await this.loadGraphMonthly(3, 'sum', 1, {year: `${parseInt(this.graph1.year) - 1}`})
      } else if (boardId === '45') {
        graphThis = await this.loadGraphMonthly(45, 'count', 1, {year: this.graph1.year})
        graphPrev = await this.loadGraphMonthly(45, 'count', 1, {year: `${parseInt(this.graph1.year) - 1}`})
      } else if (boardId === '35') {
        graphThis = await this.loadGraphMonthly(35, 'count', 1, {year: this.graph1.year})
        graphPrev = await this.loadGraphMonthly(35, 'count', 1, {year: `${parseInt(this.graph1.year) - 1}`})
      } else if (boardId === '7') {
        const boardIds = [7, 41]

        if (this.myLv >= 4) {
          const graphThis1 = await this.loadGraphMonthly(boardIds[0], 'count', 1, {year: this.graph1.year})
          const graphThis2 = await this.loadGraphMonthly(boardIds[1], 'count', 1, {year: this.graph1.year})
          const graphPrev1 = await this.loadGraphMonthly(boardIds[0], 'count', 1, {year: `${parseInt(this.graph1.year) - 1}`})
          const graphPrev2 = await this.loadGraphMonthly(boardIds[1], 'count', 1, {year: `${parseInt(this.graph1.year) - 1}`})
          graphThis = this.combineGraph1(graphThis1, graphThis2)
          graphPrev = this.combineGraph1(graphPrev1, graphPrev2)
        } else if (this.myLv >= 3) {
          const data1 = await this.loadGraphRowTotalMonthly_lv2(boardIds[0], 'content$summary.disaster', new Date().getFullYear())
          const data2 = await this.loadGraphRowTotalMonthly_lv2(boardIds[1], 'content$summary.disaster', new Date().getFullYear())
          const dataSum = this.combineRowGraph1(data1, data2)
          graphThis = dataSum['now']
          graphPrev = dataSum['prev']
        } else {
          const data1 = await this.loadGraphRowTotalMonthly_lv1(boardIds[0], 'content$summary.disaster', new Date().getFullYear())
          const data2 = await this.loadGraphRowTotalMonthly_lv1(boardIds[1], 'content$summary.disaster', new Date().getFullYear())
          const dataSum = this.combineRowGraph1(data1, data2)
          graphThis = dataSum['now']
          graphPrev = dataSum['prev']

        }
      } else if (boardId === '10') {
        const boardIds = [10, 11]
        if (this.myLv >= 4) {
          const graphThis1 = await this.loadGraphMonthly(boardIds[0], 'count', 1, {year: this.graph1.year})
          const graphThis2 = await this.loadGraphMonthly(boardIds[1], 'count', 1, {year: this.graph1.year})
          const graphPrev1 = await this.loadGraphMonthly(boardIds[0], 'count', 1, {year: `${parseInt(this.graph1.year) - 1}`})
          const graphPrev2 = await this.loadGraphMonthly(boardIds[1], 'count', 1, {year: `${parseInt(this.graph1.year) - 1}`})
          graphThis = this.combineGraph1(graphThis1, graphThis2)
          graphPrev = this.combineGraph1(graphPrev1, graphPrev2)
        } else if (this.myLv >= 3) {
          const data1 = await this.loadGraphRowTotalMonthly_lv2(boardIds[0], 'content$summary.disaster', new Date().getFullYear())
          const data2 = await this.loadGraphRowTotalMonthly_lv2(boardIds[1], 'content$summary.disaster', new Date().getFullYear())
          const dataSum = this.combineRowGraph1(data1, data2)
          graphThis = dataSum['now']
          graphPrev = dataSum['prev']
        } else {
          const data1 = await this.loadGraphRowTotalMonthly_lv1(boardIds[0], 'content$summary.workTypeB', new Date().getFullYear())
          const data2 = await this.loadGraphRowTotalMonthly_lv1(boardIds[1], 'content$summary.workTypeB', new Date().getFullYear())
          const dataSum = this.combineRowGraph1(data1, data2)
          graphThis = dataSum['now']
          graphPrev = dataSum['prev']
        }
      } else if (boardId === '36') {
        const boardIds = [36, 40]
        const graphThis1 = await this.loadGraphMonthly(boardIds[0], 'count', 1, {year: this.graph1.year})
        const graphThis2 = await this.loadGraphMonthly(boardIds[1], 'count', 1, {year: this.graph1.year})
        const graphPrev1 = await this.loadGraphMonthly(boardIds[0], 'count', 1, {year: `${parseInt(this.graph1.year) - 1}`})
        const graphPrev2 = await this.loadGraphMonthly(boardIds[1], 'count', 1, {year: `${parseInt(this.graph1.year) - 1}`})
        graphThis = this.combineGraph1(graphThis1, graphThis2)
        graphPrev = this.combineGraph1(graphPrev1, graphPrev2)
      } else if (boardId === '48') {
        graphThis = await this.loadGraphMonthly(48, 'count', 1, {year: this.graph1.year})
        graphPrev = await this.loadGraphMonthly(48, 'count', 1, {year: `${parseInt(this.graph1.year) - 1}`})
      }

      if (boardId !== '50') {
        this.graph1.thisYear = graphThis
        this.graph1.previousYear = graphPrev
      }

      if (this.projectId) {
        if (boardId === '50') await this.loadCountGraph1_summary_lv2(boardId, 'agreementInfo.amount')
      } else if (boardId === '50') this.loadCountGraph1_lv1(boardId, 'agreementInfo.amount')
    },
    async loadGraph2 () {
      const boardId = this.$route.params.boardId
      let summaryMonthly
      let summaryMonthlySum
      if (boardId === '3') {
        summaryMonthly = await this.loadGraphMonthly(3, 'sum', 2, {year: this.graph2.year})
      } else if (boardId === '45') {
        summaryMonthly = await this.loadGraphMonthly(45, 'count', 2, {year: this.graph2.year})
      } else if (boardId === '35') {
        summaryMonthly = await this.loadGraphMonthly(35, 'count', 2, {year: this.graph2.year})
        summaryMonthlySum = await this.loadGraphMonthly(35, 'sum', 2, {year: this.graph2.year})
      } else if (boardId === '7') {
        const boardIds = [7, 41]
        // [ {label: '', value:[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]}, ..., {}]
        if (this.myLv >= 4) {
          const data1 = await this.loadGraphMonthly(boardIds[0], 'count', 2, {year: this.graph2.year})
          const data2 = await this.loadGraphMonthly(boardIds[1], 'count', 2, {year: this.graph2.year})
          summaryMonthly = this.combineGraph2(data1, data2)
        } else if (this.myLv >= 3) {
          const data1 = await this.loadGraphRowMonthly_lv2(boardIds[0], 'content$summary.disaster', new Date().getFullYear())
          const data2 = await this.loadGraphRowMonthly_lv2(boardIds[1], 'content$summary.disaster', new Date().getFullYear())
          summaryMonthly = this.combineGraph2(data1, data2)
        } else {
          const data1 = await this.loadGraphRowMonthly_lv1(boardIds[0], 'content$summary.disaster', new Date().getFullYear())
          const data2 = await this.loadGraphRowMonthly_lv1(boardIds[1], 'content$summary.disaster', new Date().getFullYear())
          summaryMonthly = this.combineGraph2(data1, data2)
        }
      } else if (boardId === '10') {
        const boardIds = [10, 11]
        if (this.myLv >= 4) {
          const data1 = await this.loadGraphMonthly(boardIds[0], 'count', 2, {year: this.graph2.year})
          const data2 = await this.loadGraphMonthly(boardIds[1], 'count', 2, {year: this.graph2.year})
          summaryMonthly = this.combineGraph2(data1, data2)
        } else if (this.myLv >= 3) {
          const data1 = await this.loadGraphRowMonthly_lv2(boardIds[0], 'content$summary.workTypeB', new Date().getFullYear())
          const data2 = await this.loadGraphRowMonthly_lv2(boardIds[1], 'content$summary.workTypeB', new Date().getFullYear())
          summaryMonthly = this.combineGraph2(data1, data2)
        } else {
          const data1 = await this.loadGraphRowMonthly_lv1(boardIds[0], 'content$summary.workTypeB', new Date().getFullYear())
          const data2 = await this.loadGraphRowMonthly_lv1(boardIds[1], 'content$summary.workTypeB', new Date().getFullYear())
          summaryMonthly = this.combineGraph2(data1, data2)
        }
      } else if (boardId === '36') {
        const boardIds = [36, 40]
        const data1 = await this.loadGraphMonthly(boardIds[0], 'count', 2, {year: this.graph2.year})
        const data2 = await this.loadGraphMonthly(boardIds[1], 'count', 2, {year: this.graph2.year})
        summaryMonthly = this.combineGraph2(data1, data2)
      } else if (boardId === '48') {
        summaryMonthly = await this.loadGraphMonthly(48, 'count', 2, {year: this.graph2.year})
      }

      if (boardId !== '50' &&  summaryMonthly) {
        const data = []
        const month = this.graph2.month - 1
        for (const summary of summaryMonthly) {
          const value = summary.value.length > 0 ? summary.value[month] : 0
          const prev = summary.value.length > 0 && month > 0 ? summary.value[month - 1] : 0
          const option = {project_id: '', post_id: '', id: '', document_status: { name: '' }}
          const obj = {
            ...option,
            name: summary.label,
            value,
            prevValue: prev,
            gap: value - prev,
            no: 0
          }
          if (summaryMonthlySum && summaryMonthlySum.length > 0) {
            for (const sumSummary of summaryMonthlySum) {
              if (sumSummary.label === summary.label) {
                obj.sum = sumSummary.value[month]
                break
              }
            }
          }
          data.push(obj)
        }
        data.sort((a, b) => {
          if (b.value - a.value === 0) {
            return b.gap - a.gap
          } else {
            return b.value - a.value
          }
        })
        this.graph2.list = data.map((data, index) => {
          data.no = index + 1
          return data
        })
      }

      if (this.projectId) {
        if (boardId === '50') this.loadCountGraph2_summary(boardId, 'agreementInfo')
      } else if (boardId === '50') this.loadCountGraph2_lv1(boardId, 'agreementInfo.amount')
    },
    async loadGraph3 () {
      const boardId = this.$route.params.boardId
      let summaryMonthly
      if (boardId === '3') {
        const beginAt = new Date(this.graph3.beginYear, this.graph3.beginMonth - 1, 1).format('yyyy-MM-dd 00:00:00')
        const endAt = new Date(this.graph3.endYear, this.graph3.endMonth, 0).format('yyyy-MM-dd 23:59:59')
        summaryMonthly = await this.loadGraphMonthly(3, 'sum', 3, {beginAt, endAt})
      } else if (boardId === '45') {
        const beginAt = new Date(this.graph3.beginDate).format('yyyy-MM-dd 00:00:00')
        const endAt = new Date(this.graph3.endDate).format('yyyy-MM-dd 23:59:59')
        summaryMonthly = await this.loadGraphMonthly(45, 'count', 3, {beginAt, endAt})
      } else if (boardId === '35') {
        const beginAt = new Date(this.graph3.beginDate).format('yyyy-MM-dd 00:00:00')
        const endAt = new Date(this.graph3.endDate).format('yyyy-MM-dd 23:59:59')
        summaryMonthly = await this.loadGraphMonthly(35, 'count', 3, {beginAt, endAt})
      } else if (boardId === '7') {
        const boardIds = [7, 41]
        const beginAt = new Date(this.graph3.beginDate).format('yyyy-MM-dd 00:00:00')
        const endAt = new Date(this.graph3.endDate).format('yyyy-MM-dd 23:59:59')
        if (this.myLv >= 4) {
          const data1 = await this.loadGraphMonthly(boardIds[0], 'count', 3, {beginAt, endAt})
          const data2 = await this.loadGraphMonthly(boardIds[1], 'count', 3, {beginAt, endAt})
          summaryMonthly = this.combineGraph3(data1, data2)
        } else if (this.myLv >= 3) {
          const data1 = await this.loadGraphRow_lv2(boardIds[0], 'content$summary.disaster', beginAt, endAt)
          const data2 = await this.loadGraphRow_lv2(boardIds[1], 'content$summary.disaster', beginAt, endAt)
          summaryMonthly = this.combineGraph3(data1, data2)
        } else {
          const data1 = await this.loadGraphRow_lv1(boardIds[0], 'content$summary.disaster', beginAt, endAt)
          const data2 = await this.loadGraphRow_lv1(boardIds[1], 'content$summary.disaster', beginAt, endAt)
          summaryMonthly = this.combineGraph3(data1, data2)
        }
      } else if (boardId === '10') {
        const boardIds = [10, 11]
        const beginAt = new Date(this.graph3.beginDate).format('yyyy-MM-dd 00:00:00')
        const endAt = new Date(this.graph3.endDate).format('yyyy-MM-dd 23:59:59')
        if (this.myLv >= 4) {
          const data1 = await this.loadGraphMonthly(boardIds[0], 'count', 3, {beginAt, endAt})
          const data2 = await this.loadGraphMonthly(boardIds[1], 'count', 3, {beginAt, endAt})
          summaryMonthly = this.combineGraph3(data1, data2)
        } else if (this.myLv >= 3) {
          const data1 = await this.loadGraphRow_lv2(boardIds[0], 'content$summary.workTypeB', beginAt, endAt)
          const data2 = await this.loadGraphRow_lv2(boardIds[1], 'content$summary.workTypeB', beginAt, endAt)
          summaryMonthly = this.combineGraph3(data1, data2)
        } else {
          const data1 = await this.loadGraphRow_lv1(boardIds[0], 'content$summary.workTypeB', beginAt, endAt)
          const data2 = await this.loadGraphRow_lv1(boardIds[1], 'content$summary.workTypeB', beginAt, endAt)
          summaryMonthly = this.combineGraph3(data1, data2)
        }
      } else if (boardId === '36') {
        const boardIds = [36, 40]
        const beginAt = new Date(this.graph3.beginDate).format('yyyy-MM-dd 00:00:00')
        const endAt = new Date(this.graph3.endDate).format('yyyy-MM-dd 23:59:59')
        const data1 = await this.loadGraphMonthly(boardIds[0], 'count', 3, {beginAt, endAt})
        const data2 = await this.loadGraphMonthly(boardIds[1], 'count', 3, {beginAt, endAt})
        summaryMonthly = this.combineGraph3(data1, data2)
      } else if (boardId === '48') {
        const beginAt = new Date(this.graph3.beginYear, this.graph3.beginMonth - 1, 1).format('yyyy-MM-dd 00:00:00')
        const endAt = new Date(this.graph3.endYear, this.graph3.endMonth, 0).format('yyyy-MM-dd 23:59:59')
        summaryMonthly = await this.loadGraphMonthly(48, 'count', 3, {beginAt, endAt})
      }

      if (boardId !== '50' &&  summaryMonthly) {
        this.graph3.list = summaryMonthly
      }

      if (this.projectId) {
        if (boardId === '50') this.loadCountGraph3_summary(boardId, 'agreementInfo')
      } else if (boardId === '50') this.loadCountGraph3_lv1(boardId, 'agreementInfo.amount')
    },

    async loadGraph4 () {
      const boardId = this.$route.params.boardId
      let summaryItems
      let summaryItemsSum

      if (boardId === '3') {
        summaryItems = await this.loadGraphItems(3, 'sum', 4, {year: this.graph4.year})
      } else if (boardId === '45') {
        summaryItems = await this.loadGraphItems(45, 'count', 4, {year: this.graph4.year})
      } else if (boardId === '35') {
        summaryItems = await this.loadGraphItems(35, 'count', 4, {year: this.graph4.year})
      } else if (boardId === '7') {
        const boardIds = [7, 41]
        const data1 = await this.loadGraphItems(boardIds[0], 'count', 4, {year: this.graph4.year})
        const data2 = await this.loadGraphItems(boardIds[1], 'count', 4, {year: this.graph4.year})
        summaryItems = this.combineGraph2(data1, data2)
      } else if (boardId === '10') {
        const boardIds = [10, 11]
        const data1 = await this.loadGraphItems(boardIds[0], 'count', 4, {year: this.graph4.year})
        const data2 = await this.loadGraphItems(boardIds[1], 'count', 4, {year: this.graph4.year})
        summaryItems = this.combineGraph2(data1, data2)
      } else if (boardId === '36') {
        const boardIds = [36, 40]
        const data1 = await this.loadGraphItems(boardIds[0], 'count', 4, {year: this.graph4.year})
        const data2 = await this.loadGraphItems(boardIds[1], 'count', 4, {year: this.graph4.year})
        summaryItems = this.combineGraph2(data1, data2)
      }
      if (boardId !== '48' && boardId !== '50' &&  summaryItems) {
        const data = []
        const month = this.graph4.month - 1
        for (const summary of summaryItems) {
          const value = summary.value.length > 0 ? summary.value[month] : 0
          const prev = summary.value.length > 0 && month > 0 ? summary.value[month - 1] : 0
          const option = {project_id: '', post_id: '', id: '', document_status: { name: '' }}
          const obj = {
            ...option,
            name: summary.label,
            value,
            prevValue: prev,
            gap: value - prev,
            no: 0
          }
          if (summaryItemsSum && summaryItemsSum.length > 0) {
            for (const sumSummary of summaryItemsSum) {
              if (sumSummary.label === summary.label) {
                obj.sum = sumSummary.value[month]
                break
              }
            }
          }
          data.push(obj)
        }
        data.sort((a, b) => {
          if (b.value - a.value === 0) {
            return b.gap - a.gap
          } else {
            return b.value - a.value
          }
        })
        this.graph4.list = data.map((data, index) => {
          data.no = index + 1
          return data
        })
      }

    },

    async loadGraph5 () {
      const boardId = this.$route.params.boardId
      let summaryItems
      let summaryItemsSum

      if (boardId === '3') {
        const beginAt = new Date(this.graph5.beginYear, this.graph5.beginMonth - 1, 1).format('yyyy-MM-dd 00:00:00')
        const endAt = new Date(this.graph5.endYear, this.graph5.endMonth, 0).format('yyyy-MM-dd 23:59:59')
        summaryItems = await this.loadGraphItems(3, 'sum', 5, {beginAt, endAt})
      } else if (boardId === '45') {
        const beginAt = new Date(this.graph5.beginDate).format('yyyy-MM-dd 00:00:00')
        const endAt = new Date(this.graph5.endDate).format('yyyy-MM-dd 23:59:59')
        summaryItems = await this.loadGraphItems(45, 'count', 5, {beginAt, endAt})
      } else if (boardId === '35') {
        const beginAt = new Date(this.graph5.beginDate).format('yyyy-MM-dd 00:00:00')
        const endAt = new Date(this.graph5.endDate).format('yyyy-MM-dd 23:59:59')
        summaryItems = await this.loadGraphItems(35, 'count', 5, {beginAt, endAt})
      } else if (boardId === '7') {
        const boardIds = [7, 41]
        const beginAt = new Date(this.graph5.beginDate).format('yyyy-MM-dd 00:00:00')
        const endAt = new Date(this.graph5.endDate).format('yyyy-MM-dd 23:59:59')
        const data1 = await this.loadGraphItems(boardIds[0], 'count', 5, {beginAt, endAt})
        const data2 = await this.loadGraphItems(boardIds[1], 'count', 5, {beginAt, endAt})
        summaryItems = this.combineGraph3(data1, data2)
      } else if (boardId === '10') {
        const boardIds = [10, 11]
        const beginAt = new Date(this.graph5.beginDate).format('yyyy-MM-dd 00:00:00')
        const endAt = new Date(this.graph5.endDate).format('yyyy-MM-dd 23:59:59')
        const data1 = await this.loadGraphItems(boardIds[0], 'count', 5, {beginAt, endAt})
        const data2 = await this.loadGraphItems(boardIds[1], 'count', 5, {beginAt, endAt})
        summaryItems = this.combineGraph3(data1, data2)
      } else if (boardId === '36') {
        const boardIds = [36, 40]
        const beginAt = new Date(this.graph5.beginDate).format('yyyy-MM-dd 00:00:00')
        const endAt = new Date(this.graph5.endDate).format('yyyy-MM-dd 23:59:59')
        const data1 = await this.loadGraphItems(boardIds[0], 'count', 5, {beginAt, endAt})
        const data2 = await this.loadGraphItems(boardIds[1], 'count', 5, {beginAt, endAt})
        summaryItems = this.combineGraph3(data1, data2)
      }

      if (boardId !== '48' && boardId !== '50' &&  summaryItems) {
        this.graph5.list = summaryItems
      }
    },

    // meta:{year, beginAt, endAt}
    async loadGraphMonthly (boardId, type, graphNum, meta) {
      const data = []
      try {
        const option = { boardId }
        if (this.projectId) option.projectId = this.projectId
        if (this.myLv > 2) option.onlyMyCompany = 1

        if (meta && meta.year) { option.year = meta.year }
        if (meta && meta.beginAt) { option.beginAt = meta.beginAt }
        if (meta && meta.endAt) { option.endAt = meta.endAt }

        await this.$store.dispatch('summary/LOAD_SUMMARY_GROUP_MONTHLY', option)
        const summary = this.$store.state.summary.summaryMonthly
        if (graphNum === 1) {
          if (this.projectId && this.myLv >= 4) {
            if (summary && summary[type] && summary[type].child && summary[type].child[this.companyInfo.com_name]) {
              const monthly = summary[type].child[this.companyInfo.com_name].monthly
              if (monthly && monthly.length > 0) data.push(...monthly.map(value => value))
            }
          } else {
            if (summary && summary[type] && summary[type].monthly) {
              data.push(...summary[type].monthly.map(value => value))
            }
          }
        } else if (graphNum === 2) {
          let summaryMonthly
          if (this.projectId && this.myLv >= 4) summaryMonthly = this.convertSummaryMonthlyToGraph2(summary, this.companyInfo.com_name)[type]
          else summaryMonthly = this.convertSummaryMonthlyToGraph2(summary)[type]
          if (summaryMonthly && summaryMonthly.length > 0) data.push(...summaryMonthly)
        } else if (graphNum === 3) {
          let summaryConvertSum
          if (this.projectId && this.myLv >= 4) summaryConvertSum = this.convertSummaryMonthlyToGraphData(summary, this.companyInfo.com_name)[type]
          else summaryConvertSum = this.convertSummaryMonthlyToGraphData(summary)[type]
          if (summaryConvertSum && summaryConvertSum.length > 0) {
            summaryConvertSum.sort(function (a, b) { return b.value - a.value })
            const max = summaryConvertSum.length
            for (let i = 0; i < Math.min(summaryConvertSum.length, max); i++) {
              data.push(summaryConvertSum[i])
            }
          }
        } else {
          let summaryConvertSum
          if (this.projectId && this.myLv >= 4) summaryConvertSum = this.convertSummaryMonthlyToGraphData(summary, this.companyInfo.com_name)[type]
          else summaryConvertSum = this.convertSummaryMonthlyToGraphData(summary)[type]

          if (summaryConvertSum && summaryConvertSum.length > 0) {
            summaryConvertSum.sort(function (a, b) {
              return b.value - a.value
            })

            const max = summaryConvertSum.length
            for (let i = 0; i < Math.min(summaryConvertSum.length, max); i++) {
              data.push(summaryConvertSum[i])
            }
          }
        }

        // eslint-disable-next-line no-empty
      } catch (err) {  }

      if (graphNum === 1) {
        if (data.length === 0) {
          data.push(...[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
        }
      }

      return data
    },
    async loadGraphRow_lv1 (boardId, keyword, beginAt, endAt) {
      const data = []
      try {
        const values = await this.$store.dispatch('summary/LOAD_LV1_CONTENT', {
          boardId, //
          beginAt,
          endAt,
          keyword,
          dateField: 'content$date',
          order: 'desc'
        })
        if (values && values.length > 0) {
          for (const value of values) {
            data.push({
              label: value.project.field_name,
              value: value.count
            })
          }
        }
      } catch (err) {}

      return data
    },
    async loadGraphRow_lv2 (boardId, keyword, beginAt, endAt) {
      const data = []
      const projectId = this.projectId
      try {
        const values = await this.$store.dispatch('summary/LOAD_LV2_CONTENT', {
          projectId,
          boardId, //
          beginAt,
          endAt,
          keyword,
          dateField: 'content$date',
          order: 'desc'
        })
        if (values && values.length > 0) {
          for (const value of values) {
            data.push({
              label: value.company.com_name,
              value: value.count
            })
          }
        }
      } catch (err) {}

      return data
    },
    async loadGraphRowMonth_lv1 (boardId, keyword, year, month) {
      const datas = []
      try {
        const values = await this.$store.dispatch('summary/LOAD_LV1_CONTENT', {
          boardId, //
          beginAt: new Date(year, month - 1, 1).format('yyyy-MM-dd 00:00:00'),
          endAt: new Date(year, month, 0).format('yyyy-MM-dd 23:59:59'),
          keyword,
          dateField: 'content$date',
          order: 'desc'
        })
        if (values && values.length > 0) {
          for (const value of values) {
            datas.push({
              label: value.project.field_name,
              value: value.count
            })
          }
        }
      } catch (err) {}

      for (const data of datas) {
        const oldData = data.value;
        data.value = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        data.value[month - 1] = oldData;
      }
      return datas
    },
    async loadGraphRowMonth_lv2 (boardId, keyword, year, month) {
      const datas = []
      const projectId = this.projectId;
      try {
        const values = await this.$store.dispatch('summary/LOAD_LV2_CONTENT', {
          projectId,
          boardId, //
          beginAt: new Date(year, month - 1, 1).format('yyyy-MM-dd 00:00:00'),
          endAt: new Date(year, month, 0).format('yyyy-MM-dd 23:59:59'),
          keyword,
          dateField: 'content$date',
          order: 'desc'
        })
        if (values && values.length > 0) {
          for (const value of values) {
            datas.push({
              label: value.company.com_name,
              value: value.count
            })
          }
        }
      } catch (err) {}

      for (const data of datas) {
        const oldData = data.value;
        data.value = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        data.value[month - 1] = oldData;
      }
      return datas
    },
    async loadGraphRowMonthly_lv1 (boardId, keyword, year) {
      await this.$store.dispatch('project/LOAD_PROJECT_LIST', { page: 1, perPage: 100 })
      let data = [];
      for (const projName of this.projectList) {
        data.push({
          label: projName,
          value: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        })
      }

      const data1 = await this.loadGraphRowMonth_lv1(boardId, keyword, year, 1)
      const data2 = await this.loadGraphRowMonth_lv1(boardId, keyword, year, 2)
      const data3 = await this.loadGraphRowMonth_lv1(boardId, keyword, year, 3)
      const data4 = await this.loadGraphRowMonth_lv1(boardId, keyword, year, 4)
      const data5 = await this.loadGraphRowMonth_lv1(boardId, keyword, year, 5)
      const data6 = await this.loadGraphRowMonth_lv1(boardId, keyword, year, 6)
      const data7 = await this.loadGraphRowMonth_lv1(boardId, keyword, year, 7)
      const data8 = await this.loadGraphRowMonth_lv1(boardId, keyword, year, 8)
      const data9 = await this.loadGraphRowMonth_lv1(boardId, keyword, year, 9)
      const data10 = await this.loadGraphRowMonth_lv1(boardId, keyword, year, 10)
      const data11 = await this.loadGraphRowMonth_lv1(boardId, keyword, year, 11)
      const data12 = await this.loadGraphRowMonth_lv1(boardId, keyword, year, 12)

      data = this.combineGraph2(data, data1)
      data = this.combineGraph2(data, data2)
      data = this.combineGraph2(data, data3)
      data = this.combineGraph2(data, data4)
      data = this.combineGraph2(data, data5)
      data = this.combineGraph2(data, data6)
      data = this.combineGraph2(data, data7)
      data = this.combineGraph2(data, data8)
      data = this.combineGraph2(data, data9)
      data = this.combineGraph2(data, data10)
      data = this.combineGraph2(data, data11)
      data = this.combineGraph2(data, data12)

      // [ {label: '', value:[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]}, ..., {}]
      return data
    },
    async loadGraphRowMonthly_lv2 (boardId, keyword, year) {
      await this.$store.dispatch('project/LOAD_PROJECT_LIST', { page: 1, perPage: 100 })
      let data = [];
      for (const projName of this.projectList) {
        data.push({
          label: projName,
          value: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        })
      }

      const data1 = await this.loadGraphRowMonth_lv2(boardId, keyword, year, 1)
      const data2 = await this.loadGraphRowMonth_lv2(boardId, keyword, year, 2)
      const data3 = await this.loadGraphRowMonth_lv2(boardId, keyword, year, 3)
      const data4 = await this.loadGraphRowMonth_lv2(boardId, keyword, year, 4)
      const data5 = await this.loadGraphRowMonth_lv2(boardId, keyword, year, 5)
      const data6 = await this.loadGraphRowMonth_lv2(boardId, keyword, year, 6)
      const data7 = await this.loadGraphRowMonth_lv2(boardId, keyword, year, 7)
      const data8 = await this.loadGraphRowMonth_lv2(boardId, keyword, year, 8)
      const data9 = await this.loadGraphRowMonth_lv2(boardId, keyword, year, 9)
      const data10 = await this.loadGraphRowMonth_lv2(boardId, keyword, year, 10)
      const data11 = await this.loadGraphRowMonth_lv2(boardId, keyword, year, 11)
      const data12 = await this.loadGraphRowMonth_lv2(boardId, keyword, year, 12)

      data = this.combineGraph2(data, data1)
      data = this.combineGraph2(data, data2)
      data = this.combineGraph2(data, data3)
      data = this.combineGraph2(data, data4)
      data = this.combineGraph2(data, data5)
      data = this.combineGraph2(data, data6)
      data = this.combineGraph2(data, data7)
      data = this.combineGraph2(data, data8)
      data = this.combineGraph2(data, data9)
      data = this.combineGraph2(data, data10)
      data = this.combineGraph2(data, data11)
      data = this.combineGraph2(data, data12)

      // [ {label: '', value:[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]}, ..., {}]
      return data
    },
    async loadGraphRowTotalMonthly_lv1 (boardId, keyword, year) {
      const data = {
        'prev': [],
        'now': []
      }
      try {
        const values = await this.$store.dispatch('summary/LOAD_LV1_CONTENT_MONTHLY', {
          boardId, //
          beginYear: parseInt(`${year}`) - 1,
          endYear: parseInt(`${year}`),
          keyword,
          dateField: 'content$date',
          order: 'desc'
        })

        const years = Object.keys(values)
        const prev = values[years[0]]
        const now = values[years[1]]

        for (const prevData of prev) {
          data['prev'].push(prevData.count)
        }
        for (const nowData of now) {
          data['now'].push(nowData.count)
        }
      } catch (err) {}

      return data
    },
    async loadGraphRowTotalMonthly_lv2 (boardId, keyword, year) {
      const data = {
        'prev': [],
        'now': []
      }
      const projectId = this.projectId;
      try {
        const values = await this.$store.dispatch('summary/LOAD_LV2_CONTENT_MONTHLY', {
          projectId,
          boardId, //
          beginYear: parseInt(`${year}`) - 1,
          endYear: parseInt(`${year}`),
          keyword,
          dateField: 'content$date',
          order: 'desc'
        })

        const years = Object.keys(values)
        const prev = values[years[0]]
        const now = values[years[1]]

        for (const prevData of prev) {
          data['prev'].push(prevData.count)
        }
        for (const nowData of now) {
          data['now'].push(nowData.count)
        }
      } catch (err) {}

      return data
    },
    async loadGraphItems (boardId, type, graphNum, meta) {
      const data = []
      try {
        const option = { boardId }
        if (this.projectId) option.projectId = this.projectId
        if (this.myLv >= 4) option.onlyMyCompany = 1

        if (meta && meta.year) { option.year = meta.year }
        if (meta && meta.beginAt) { option.beginAt = meta.beginAt }
        if (meta && meta.endAt) { option.endAt = meta.endAt }

        await this.$store.dispatch('summary/LOAD_SUMMARY_GROUP_ITEMS', option)
        const summary = this.$store.state.summary.summaryItems
        const items = Object.keys(summary[type].items)
        if (graphNum === 4) {
          const itemObj = {}
          for (const item of items) {
            if (!itemObj[item]) itemObj[item] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            for (let i = 0; i < summary[type].monthly.length; i++) {
              const month = summary[type].monthly[i]
              if (!month[item]) month[item] = 0
              itemObj[item][i] += month[item]
            }
          }
          data.push(...items.map(item => {
            return { label:item, value: itemObj[item]}
          }))
        } else if (graphNum === 5) {
          items.sort((a, b) => {
            return summary[type].items[b] - summary[type].items[a]
          })
          data.push(...items.map(item => {
            return { label:item, value: summary[type].items[item]}
          }))
        }

        // eslint-disable-next-line no-empty
      } catch (err) { }

      return data
    },

    combineGraph3 (data1, data2) {
      const list = []
      const obj = {}

      for (const data of data1) {
        if (!obj[data.label]) obj[data.label] = 0
        obj[data.label] += data.value
      }
      for (const data of data2) {
        if (!obj[data.label]) obj[data.label] = 0
        obj[data.label] += data.value
      }

      const keys = Object.keys(obj)
      for (const key of keys) {
        list.push({ label: key, value: obj[key]})
      }
      return list
    },
    combineGraph2 (data1, data2) {
      const list = []
      const obj = {}

      for (const data of data1) {
        if (!obj[data.label]) obj[data.label] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        let i = 0
        for (i = 0; i < 12; i++) {
          obj[data.label][i] += data.value[i]
        }
      }
      for (const data of data2) {
        if (!obj[data.label]) obj[data.label] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        let i = 0
        for (i = 0; i < 12; i++) {
          obj[data.label][i] += data.value[i]
        }
      }

      const keys = Object.keys(obj)
      for (const key of keys) {
        list.push({ label: key, value: obj[key]})
      }

      return list
    },
    combineGraph1 (data1, data2) {
      const data = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      let i = 0
      for (i = 0; i < 12; i++) {
        data[i] += (data1[i] + data2[i])
      }
      return data
    },
    combineRowGraph1 (data1, data2) {
      const data = {
        'now': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        'prev': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      }
      let i = 0
      for (i = 0; i < 12; i++) {
        data['now'][i] += (data1['now'][i] + data2['now'][i])
        data['prev'][i] += (data1['prev'][i] + data2['prev'][i])
      }
      return data
    },
    convertSummaryMonthlyToGraphData (summary, com_name) {
      const list = {}
      for (const type of ['sum', 'count']) {
        if (!list[type]) list[type] = []
        let child = summary[type].child
        if (com_name) child = summary[type].child[com_name].child
        const keys = Object.keys(child)
        for (const key of keys) {
          list[type].push({label: key, value: child[key].total})
        }
      }
      return list
    },
    convertSummaryMonthlyToGraph2 (summary, com_name) {
      const list = {}
      for (const type of ['sum', 'count']) {
        if (!list[type]) list[type] = []
        let child = summary[type].child
        if (com_name) child = summary[type].child[com_name].child
        const keys = Object.keys(child)
        for (const key of keys) {
          list[type].push({label: key, value: child[key].monthly})
        }
      }
      return list
    },

    // 안전·보건 예산 현황
    initDateLabel3 () {
      this.graph1.title = '전체 안전·보건예산 현황'
      this.graph1.unit = '원'
      this.graph2.title = '현장별 안전·보건예산 현황'
      this.graph2.unit = '원'
      this.graph2.heads = [
        {name: '순위'},
        {name: '현장명'},
        {name: '예산'},
        {name: '전월대비증감'}
      ]
      this.graph3.title = '기간별 안전·보건예산 현황'
      this.graph3.unit = '원'
      this.graph3.dateType = 'month'

      this.graph4.title = '비목별 안전·보건예산 현황'
      this.graph4.unit = '원'
      this.graph4.heads = [
        {name: '순위'},
        {name: '항목명'},
        {name: '예산'},
        {name: '전월대비증감'}
      ]
      this.graph5.title = '항목별 안전·보건예산 현황'
      this.graph5.unit = '원'
      this.graph5.dateType = 'month'

      if (this.projectId) {
        this.graph2.heads = [
          {name: '순위'},
          {name: '항목'},
          {name: '예산'},
          {name: '전월대비증감'}
        ]
      }
    },

    // 산업재해발생 현황
    initDateLabel45 () {
      this.graph1.title = '전체 산업재해발생 현황'
      this.graph1.unit = '건'
      this.graph2.title = '현장별 산업재해구분 현황'
      this.graph2.unit = '건'
      this.graph2.heads = [
        {name: '순위'},
        {name: '현장명'},
        {name: '건'},
        {name: '전월대비증감'}
      ]
      this.graph3.title = '기간별 산업재해발생 현황'
      this.graph3.unit = '건'
      this.graph4.title = '재해구분별 산업재해구분 현황'
      this.graph4.unit = '건'
      this.graph4.heads = [
        {name: '순위'},
        {name: '재해구분'},
        {name: '건'},
        {name: '전월대비증감'}
      ]
      this.graph5.title = '항목별 산업재해발생 현황'
      this.graph5.unit = '건'

      if (this.projectId) {
        this.graph2.heads = [
          {name: '순위'},
          {name: '항목'},
          {name: '건'},
          {name: '전월대비증감'}
        ]
      }
    },

    // 안전·보건 교육 현황
    initDateLabel35 () {
      this.graph1.title = '전체 안전·보건교육 현황'
      this.graph1.unit = '건'
      this.graph2.title = '월별 안전·보건교육 현황'
      this.graph2.unit = '건'
      this.graph2.heads = [
        {name: '순위'},
        {name: '현장명'},
        {name: '교육 건수'},
        {name: '교육 총인원'}
      ]
      this.graph3.title = '기간별 안전·보건교육 현황'
      this.graph3.unit = '건'
      this.graph4.title = '월별 안전·보건교육 현황'
      this.graph4.unit = '명'
      this.graph4.heads = [
        {name: '순위'},
        {name: '교육구분'},
        {name: '교육 건수'},
        {name: '교육 총인원'}
      ]
      this.graph5.title = '기간별 안전·보건교육 현황'
      this.graph5.unit = '건'

      if (this.projectId) {
        this.graph2.heads = [
          {name: '순위'},
          {name: '교육구분'},
          {name: '교육 건수'},
          {name: '교육 총인원'}
        ]
      }
    },

    // 파트너사 계약 현황
    initDateLabel50 () {
      this.graph1.title = '전체 계약 현황'
      this.graph1.unit = '건'
      this.graph2.title = '계약 정보'
      this.graph2.unit = '건'
      this.graph2.heads = [
        {name: '순위'},
        {name: '현장명'},
        {name: '계약 건수'},
        {name: '계약 금액'}
      ]
      this.graph3.title = '기간별 계약건수'
      this.graph3.unit = '건'
      this.graph4.title = '계약 정보'
      this.graph4.unit = '건'
      this.graph4.heads = [
        {name: '순위'},
        {name: '현장명'},
        {name: '계약 건수'},
        {name: '계약 금액'}
      ]
      this.graph5.title = '기간별 계약건수'
      this.graph5.unit = '건'

      if (this.projectId) {
        this.graph2.heads = [
          {name: '순위'},
          {name: '항목'},
          {name: '계약 건수'},
          {name: '계약 금액'}
        ]
      }
    },

    // 위험성평가 현황
    initDateLabel7 () {
      this.graph1.title = '전체 위험성평가 현황'
      this.graph1.unit = '건'
      this.graph2.title = '현장별 위험성평가 현황'
      this.graph2.unit = '건'
      this.graph2.heads = [
        {name: '순위'},
        {name: '현장명'},
        {name: '건'},
        {name: '전월대비증감'}
      ]
      this.graph3.title = '기간별 위험성평가 현황'
      this.graph3.unit = '건'
      this.graph4.title = '재해구분별 위험성평가 현황'
      this.graph4.unit = '건'
      this.graph4.heads = [
        {name: '순위'},
        {name: '재해구분'},
        {name: '건'},
        {name: '전월대비증감'}
      ]
      this.graph5.title = '항목별 위험성평가 현황'
      this.graph5.unit = '건'

      if (this.projectId) {
        this.graph2.heads = [
          {name: '순위'},
          {name: '항목'},
          {name: '건'},
          {name: '전월대비증감'}
        ]
      }
    },

    // 작업허가서 현황
    initDateLabel10 () {
      this.graph1.title = '전체 작업허가서 현황'
      this.graph1.unit = '건'
      this.graph2.title = '현장별 작업허가서 현황'
      this.graph2.unit = '건'
      this.graph2.heads = [
        {name: '순위'},
        {name: '현장명'},
        {name: '건'},
        {name: '전월대비증감'}
      ]
      this.graph3.title = '기간별 작업허가서 현황'
      this.graph3.unit = '건'
      this.graph4.title = '작업구분별 작업허가서 현황'
      this.graph4.unit = '건'
      this.graph4.heads = [
        {name: '순위'},
        {name: '작업구분'},
        {name: '건'},
        {name: '전월대비증감'}
      ]
      this.graph5.title = '항목별 작업허가서 현황'
      this.graph5.unit = '건'

      if (this.projectId) {
        this.graph2.heads = [
          {name: '순위'},
          {name: '항목'},
          {name: '건'},
          {name: '전월대비증감'}
        ]
      }
    },

    // 안전점검 현황
    initDateLabel48 () {
      this.graph1.title = '전체 안전점검 현황'
      this.graph1.unit = '건'
      this.graph2.title = '월별 안전점검 현황'
      this.graph2.unit = '건'
      this.graph2.heads = [
        {name: '순위'},
        {name: '현장명'},
        {name: '건'},
        {name: '전월대비증감'}
      ]
      this.graph3.title = '기간별 안전점검 현황'
      this.graph3.unit = '건'
      this.graph3.dateType = 'month'
      this.graph4.title = '월별 안전점검 현황'
      this.graph4.unit = '건'
      this.graph4.heads = [
        {name: '순위'},
        {name: '현장명'},
        {name: '건'},
        {name: '전월대비증감'}
      ]
      this.graph5.title = '기간별 안전점검 현황'
      this.graph5.unit = '건'
      this.graph5.dateType = 'month'

      if (this.projectId) {
        this.graph2.heads = [
          {name: '순위'},
          {name: '항목'},
          {name: '건'},
          {name: '전월대비증감'}
        ]
      }
    },

    // 시정 및 예방조치 현황
    initDateLabel36 () {
      this.graph1.title = '전체 시정 및 예방조치 현황'
      this.graph1.title = '전체 시정 및 예방조치 현황'
      this.graph1.unit = '건'
      this.graph2.title = '현장별 시정 및 예방조치 현황'
      this.graph2.unit = '건'
      this.graph2.heads = [
        {name: '순위'},
        {name: '현장명'},
        {name: '건'},
        {name: '전월대비증감'}
      ]
      this.graph3.title = '기간별 시정 및 예방조치 현황'
      this.graph3.unit = '건'
      this.graph4.title = '재해구분별 시정 및 예방조치 현황'
      this.graph4.unit = '건'
      this.graph4.heads = [
        {name: '순위'},
        {name: '재해구분'},
        {name: '건'},
        {name: '전월대비증감'}
      ]
      this.graph5.title = '항목별 시정 및 예방조치 현황'
      this.graph5.unit = '건'

      if (this.projectId) {
        this.graph2.heads = [
          {name: '순위'},
          {name: '항목'},
          {name: '건'},
          {name: '전월대비증감'}
        ]
      }
    },

    loadCountGraph1_lv1 (boardId, keyword) {
      this.graph1.thisYear = []
      this.graph1.previousYear = []

      this.$store.dispatch('summary/LOAD_LV1_CONTENT_MONTHLY', {
        boardId, //
        beginYear: parseInt(this.graph1.year) - 1,
        endYear: this.graph1.year,
        keyword,
        order: 'desc'
      }).then(value => {
        const keys = Object.keys(value)

        const thisYear = []
        const previousYear = []
        if (keys.length > 1) {
          for (let i = 0; i < value[`${parseInt(this.graph1.year) - 1}`].length; i++) {
            previousYear.push(value[`${parseInt(this.graph1.year) - 1}`][i].count)
            thisYear.push(value[`${parseInt(this.graph1.year)}`][i].count)
          }
        }
        this.graph1.thisYear = thisYear
        this.graph1.previousYear = previousYear
      })
    },
    loadCountGraph1_lv2 (boardId, groupName) {
      this.$store.dispatch('summary/LOAD_SUMMARY_MONTHLY', {
        boardId,
        beginYear: parseInt(this.graph1.year) - 1,
        endYear: this.graph1.year,
        projectId: this.projectId
      }).then(value => {
        const yearList = Object.keys(value)
        const thisYear = []
        const previousYear = []
        if (yearList.length > 1) {

          // previousYear
          const pYear = yearList[0]
          for (let month = 1; month <= 12; month++) {
            const obj = value[`${pYear}`][`${month}`]
            let sum = 0
            if (obj && obj.sum[groupName]) {
              const columnList = Object.keys(obj.sum[groupName])
              for (const column of columnList) {
                if (obj.sum[groupName][column]) {
                  sum += obj.sum[groupName][column]
                }
              }
            }
            previousYear.push(sum)
          }

          // thisYear
          const tYear = yearList[1]
          for (let month = 1; month <= 12; month++) {
            const obj = value[`${tYear}`][`${month}`]
            let sum = 0
            if (obj && obj.sum[groupName]) {
              const columnList = Object.keys(obj.sum[groupName])
              for (const column of columnList) {
                if (obj.sum[groupName][column]) {
                  sum += obj.sum[groupName][column]
                }
              }
            }
            thisYear.push(sum)
          }
        }

        this.graph1.thisYear = thisYear
        this.graph1.previousYear = previousYear
      })
    },
    async loadCountGraph1_summary_lv2 (boardId, keyword) {
      this.graph1.thisYear = []
      this.graph1.previousYear = []

      this.$store.dispatch('summary/LOAD_LV2_CONTENT_MONTHLY', {
        projectId: this.projectId,
        boardId, //
        beginYear: parseInt(this.graph1.year) - 1,
        endYear: this.graph1.year,
        keyword,
        order: 'desc'
      }).then(value => {
        const keys = Object.keys(value)

        const thisYear = []
        const previousYear = []
        if (keys.length > 1) {
          for (let i = 0; i < value[`${parseInt(this.graph1.year) - 1}`].length; i++) {
            previousYear.push(value[`${parseInt(this.graph1.year) - 1}`][i].count)
            thisYear.push(value[`${parseInt(this.graph1.year)}`][i].count)
          }
        }
        this.graph1.thisYear = thisYear
        this.graph1.previousYear = previousYear
      })
    },

    async loadCountGraph2_lv1 (boardId, keyword) {
      let beginAt = new Date(this.graph2.year, this.graph2.month - 1, 1)
      let endAt = new Date(this.graph2.year, this.graph2.month, 0)

      const data = {}
      // 이번달
      await this.$store.dispatch('summary/LOAD_LV1_CONTENT', {
        boardId, //
        beginAt: beginAt.format('yyyy-MM-dd HH:mm:ss'),
        endAt: endAt.format('yyyy-MM-dd HH:mm:ss'),
        keyword,
        order: 'desc'
      }).then(value1 => {
        const value = JSON.parse(JSON.stringify(value1))
        if (value && value.length > 0) {
          if (value.length > 1) {
            value.sort(function (a, b) {
              return b.sum - a.sum
            })
          }

          let index = 0
          for (index = 0; index < value.length; index++) {
            data[value[index].project.field_name] = {
              project_id: value[index].project.id,
              post_id: '',
              id: '',
              document_status: {
                name: ''
              },

              name: value[index].project.field_name,
              count: value[index].count,
              sum: value[index].sum,
              value: value[index].count,
              prevValue: 0,
              gap: value[index].count,
              no: index + 1
            }
          }
        }

        return value
      })


      // 지난달
      beginAt = new Date(this.graph2.year, (this.graph2.month - 1) - 1, 1)
      endAt = new Date(this.graph2.year, (this.graph2.month) - 1, 0)

      await this.$store.dispatch('summary/LOAD_LV1_CONTENT', {
        boardId, //
        beginAt: beginAt.format('yyyy-MM-dd HH:mm:ss'),
        endAt: endAt.format('yyyy-MM-dd HH:mm:ss'),
        keyword,
        order: 'desc'
      }).then(value => {
        let index = 0
        for (index = 0; index < value.length; index++) {
          if (data[value[index].project.field_name]) {
            data[value[index].project.field_name].prevValue = value[index].sum
            data[value[index].project.field_name].gap = data[value[index].project.field_name].value - value[index].sum
          } else {
            data[value[index].project.field_name] = {
              project_id: value[index].project.id,
              post_id: '',
              id: '',
              document_status: {
                name: ''
              },

              name: value[index].project.field_name,
              count: value[index].count,
              value: 0,
              prevValue: value[index].count,
              gap: value[index].sum * (-1),
              no: index + 1
            }
          }
        }
        return value
      })

      const values = Object.values(data)
      // 정렬
      values.sort((a, b) => {
        if (b.value - a.value === 0) {
          return b.gap - a.gap
        }
        return b.value - a.value
      })
      for (let i = 0; i < values.length; i++) {
        values[i].no = (i + 1)
      }

      this.graph2.list = values
    },
    loadCountGraph2_lv2 (boardId, groupName) {
      const tMonth = this.graph2.month
      const pMonth = this.graph2.month - 1 > 0 ? this.graph2.month - 1 : 12
      const data = {}
      this.$store.dispatch('summary/LOAD_SUMMARY_MONTHLY', {
        boardId,
        beginYear: parseInt(this.graph2.year) - 1,
        endYear: this.graph2.year,
        projectId: this.projectId
      }).then(value => {
        const yearList = Object.keys(value)
        if (yearList.length > 1) {

          // this month
          const pYear = yearList[0]
          const tYear = yearList[1]
          const tObj = value[`${tYear}`][`${tMonth}`]
          const pObj = value[`${pMonth === 12 ? pYear : tYear}`][`${pMonth}`]
          if (tObj && tObj.sum[groupName]) {
            const columnList = Object.keys(tObj.sum[groupName])
            for (let i = 0; i < columnList.length; i++) {
              const column = columnList[i]
              data[column] = {
                project_id: this.projectId,
                post_id: '',
                id: '',
                document_status: {
                  name: ''
                },

                name: column,
                sum: tObj.sum[groupName][column],
                value: tObj.sum[groupName][column],
                prevValue: 0,
                gap: tObj.sum[groupName][column],
                no: i + 1
              }

            }

          }

          // previous month
          if (pObj && pObj.sum[groupName]) {
            const columnList = Object.keys(pObj.sum[groupName])
            for (let i = 0; i < columnList.length; i++) {
              const column = columnList[i]
              if (data[column]) {

                data[column].prevValue = pObj.sum[groupName][column]
                data[column].gap = data[column].value - pObj.sum[groupName][column]
              } else {
                data[column] = {
                  project_id: this.projectId,
                  post_id: '',
                  id: '',
                  document_status: {
                    name: ''
                  },

                  name: column,
                  count: pObj.sum[groupName][column],
                  value: 0,
                  prevValue: pObj.sum[groupName][column],
                  gap: pObj.sum[groupName][column] * (-1),
                  no: i + 1
                }
              }
            }
          }
        }

        const values = Object.values(data)

        // 정렬
        values.sort((a, b) => {
          if (b.value - a.value === 0) {
            return b.gap - a.gap
          }
          return b.value - a.value
        })

        this.graph2.list = values
      })
    },
    async loadCountGraph2_summary (boardId, groupName) {
      const data = {}
      const beginAt = new Date(this.graph2.year, this.graph2.month - 1, 1).format('yyyy-MM-dd HH:mm:ss')
      const endAt = new Date(this.graph2.year, this.graph2.month, 0).format('yyyy-MM-dd HH:mm:ss')
      await this.$store.dispatch('summary/LOAD_SUMMARY', {
        projectId: this.projectId,
        boardId,
        beginAt,
        endAt
      }).then(value => {

        if (value.all) {
          const _count = value.all.count[groupName]
          const _sum = value.all.sum[groupName]

          // sum 으로 체크
          const sumKeys = Object.keys(_sum)
          sumKeys.map(key => {
            data[key] = {
              project_id: this.projectId,
              post_id: '',
              id: '',
              document_status: {
                name: ''
              },

              name: key,
              sum: _sum[key],
              value: _count[key],
              prevValue: 0,
              no: 1
            }
          })
        }

        const values = Object.values(data)
        values.sort(function (a, b) { return b.value - a.value })
        for (let i = 0; i < values.length; +i++) { values[i].no = i + 1 }
        this.graph2.list = values

      }).catch(reason => {
        this.graph2.list = []
      })
    },

    loadCountGraph3_lv1 (boardId, keyword) {
      const price = parseInt(this.price ? this.price : 0)

      let beginAt = new Date(this.graph3.beginYear, this.graph3.beginMonth - 1, 1)
      let endAt = new Date(this.graph3.endYear, this.graph3.endMonth, 0)

      if (this.graph3.dateType === 'day') {
        beginAt = new Date(this.graph3.beginDate)
        endAt = new Date(this.graph3.endDate)
      }

      this.$store.dispatch('summary/LOAD_LV1_CONTENT', {
        boardId, //
        beginAt: beginAt.format('yyyy-MM-dd HH:mm:ss'),
        endAt: endAt.format('yyyy-MM-dd HH:mm:ss'),
        keyword,
        order: 'desc'
      }).then(value1 => {
        const value = JSON.parse(JSON.stringify(value1))
        if (value && value.length > 0) {

          if (value.length > 1) {
            value.sort(function (a, b) {
              return b.count - a.count
            })
          }

          let index = 0
          this.graph3.list = []
          for (index = 0; index < value.length; index++) {

            if (price === 50) {
              if (50 * 100000000 <= value[index].sum) {
                this.graph3.list.push({
                  label: value[index].project.field_name,
                  value: value[index].count,
                  sum: value[index].sum
                })
              }
            } else if (price === 10) {
              if (50 * 100000000 > value[index].sum
                && 10 * 100000000 <= value[index].sum) {
                this.graph3.list.push({
                  label: value[index].project.field_name,
                  value: value[index].count,
                  sum: value[index].sum
                })
              }
            } else if (price === 5) {
              if (10 * 100000000 > value[index].sum
                && 5 * 100000000 <= value[index].sum) {
                this.graph3.list.push({
                  label: value[index].project.field_name,
                  value: value[index].count,
                  sum: value[index].sum
                })
              }
            } else if (price === 0) {
              if (5 * 100000000 > value[index].sum) {
                this.graph3.list.push({
                  label: value[index].project.field_name,
                  value: value[index].count,
                  sum: value[index].sum
                })
              }
            }

          }
        }

        return value
      })

    },
    loadCountGraph3_lv2 (boardId, groupName) {
      let beginAt = new Date(this.graph3.beginYear, this.graph3.beginMonth - 1, 1)
      let endAt = new Date(this.graph3.endYear, this.graph3.endMonth, 0)

      if (this.graph3.dateType === 'day') {
        beginAt = new Date(this.graph3.beginDate)
        endAt = new Date(this.graph3.endDate)
      }

      this.$store.dispatch('summary/LOAD_SUMMARY', {
        projectId: this.projectId,
        boardId,
        beginAt: beginAt.format('yyyy-MM-dd HH:mm:ss'),
        endAt: endAt.format('yyyy-MM-dd HH:mm:ss')
      }).then(value => {
        this.graph3.list = []

        if (value.all && value.all.count && value.all.sum[groupName]) {
          const obj = value.all.sum[groupName]
          const keys = Object.keys(obj)
          for (const key of keys) {
            this.graph3.list.push({
              label: key,
              value: obj[key]
            })
          }

          this.graph3.list.sort((a, b) => {
            return b.value - a.value
          })
        }

      })
    },
    async loadCountGraph3_summary (boardId, groupName) {
      const data = {}
      const beginAt = new Date(this.graph3.beginDate).format('yyyy-MM-dd HH:mm:ss')
      const endAt = new Date(this.graph3.endDate).format('yyyy-MM-dd HH:mm:ss')
      await this.$store.dispatch('summary/LOAD_SUMMARY', {
        projectId: this.projectId,
        boardId,
        beginAt,
        endAt
      }).then(value => {
        if (value.all) {
          const _count = value.all.count[groupName]
          const _sum = value.all.sum[groupName]

          // sum 으로 체크
          const sumKeys = Object.keys(_sum)
          sumKeys.map(key => {
            if ((this.price === '50' && _sum[key] >= 5000000000)
              || (this.price === '10' && _sum[key] < 5000000000 && _sum[key] >= 1000000000)
              || (this.price === '5' && _sum[key] < 1000000000 && _sum[key] >= 500000000)
              || (this.price === '0')
              || (this.price === '')) {
              data[key] = {
                label: key,
                sum: _sum[key],
                value: _count[key]
              }
            }

          })
        }

        const values = Object.values(data)
        values.sort(function (a, b) { return b.value - a.value })
        for (let i = 0; i < values.length; +i++) { values[i].no = i + 1 }
        this.graph3.list = values

      }).catch(reason => {
        this.graph3.list = []
      })
    },

    // Summary Graph
    async loadGraph3Summary (boardId, groupName, dateField) {
      const projectId = this.projectId
      let beginAt = new Date(this.graph3.beginYear, this.graph3.beginMonth - 1, 1).format('yyyy-MM-dd HH:mm:ss')
      let endAt = new Date(this.graph3.endYear, this.graph3.endMonth, 0).format('yyyy-MM-dd HH:mm:ss')

      if (this.graph3.dateType === 'day') {
        beginAt = new Date(this.graph3.beginDate).format('yyyy-MM-dd HH:mm:ss')
        endAt = new Date(this.graph3.endDate).format('yyyy-MM-dd HH:mm:ss')
      }

      const data = {}
      this.$store.dispatch('summary/LOAD_SUMMARY', {
        projectId,
        boardId,
        beginAt,
        endAt,
        dateField,
        groupByProject: projectId ? 0 : 1
      }).then(value => {

        if (projectId) {
          const sum = value.all.sum[groupName]
          const count = value.all.count[groupName]
          if (sum) {
            const columns = Object.keys(sum)
            columns.map(column => {
              if (!data[column]) {
                data[column] = {
                  label: column,
                  value: 0,
                  sum: 0
                }
              }
              data[column].value += count[column]
              data[column].sum += sum[column]
            })

          }
        } else {
          const projects = Object.keys(value)
          projects.map(project => {
            const sum = value[project].sum[groupName]
            const count = value[project].count[groupName]
            if (sum) {
              const columns = Object.keys(sum)
              columns.map(column => {
                if (!data[project]) {
                  data[project] = {
                    label: project,
                    value: 0,
                    sum: 0
                  }
                }
                data[project].value += count[column]
                data[project].sum += sum[column]
              })

            }
          })
        }

        this.graph3.list = []
        const list = Object.values(data)
        list.sort((a, b) => {
          return b.value - a.value
        })
        for (let i = 0; i < list.length; i++) {
          list[i].no = i + 1
        }
        this.graph3.list = list

      }).catch(reason => {
        this.graph3.list = []
      })
    },

    onClickDetailLv2 (value, target, route) {
      const fieldName = value.현장명

      if (fieldName) {
        this.$store.dispatch('project/LOAD_PROJECT_LIST', {
          page:1,
          perPage:100
        }).then(res => {
          if (res.data) {
            const boardId = this.$route.params.boardId
            const list = res.data
            for (const project of list) {
              if (project.field_name === fieldName) {
                if (boardId === '3') this.$router.push({name:'list|approval_list', params:{proj_id:project.id, boardSlug:'project_monthly_report'}})
                else if (boardId === '45') this.$router.push({name:'list|approval_tab_list|accident', params:{proj_id:project.id, boardSlug:'accident_report'}})
                else if (boardId === '35') this.$router.push({name:'project-hse-list-tab', params:{proj_id:project.id, tab:'safety'}})
                else if (boardId === '50') this.$router.push({name:'project-plan-partners', params:{proj_id:project.id, tab:'list'}})
                else if (boardId === '7') this.$router.push({name:'project-risk-assessment-tab', params:{proj_id:project.id, tab:'first'}})
                else if (boardId === '10') this.$router.push({name:'project-risk-permit-tab', params:{proj_id:project.id, tab:'work'}})
                else if (boardId === '48') this.$router.push({name:'list|approval_tab_list|safety_check', params:{proj_id:project.id, boardSlug:'safety_check_444'}})
                else if (boardId === '36') this.$router.push({name:'project-prevention-request-tab', params:{proj_id:project.id, tab:'safety'}})
                break
              }
            }
          }
        })
      }
    }
  }
}
</script>

<style lang="scss">
[dir] .vx-card.graph2 .vx-card__collapsible-content .vx-card__body {
  padding: 0 0 1.5rem 0;
}
</style>
