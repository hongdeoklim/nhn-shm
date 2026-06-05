<template>
  <div>
    <!-- 일별검색 -->
    <vs-tabs :value="selectedTab">
      <vs-tab :label="tabs[0].label">
        <div>
          <search-nav @handleSearch="handleSearch">
            <search-nav-item-date label="대상기간" v-model="nav.date" type="single" />
          </search-nav>

          <vs-row class="mb-4">
            <vs-col class="flex" vs-justify="flex-end">
              <vs-button color="secondary" type="border" @click="excelDownWithHtml('safety_staff_management_daily')">{{$t('button.Excel 다운로드')}}</vs-button>
            </vs-col>
          </vs-row>

          <vs-row class="border">
            <vs-col>
              <div class="border-top border-left border-right table-display-title">
                <span class="title table-center"></span>
                <span class="title table-center border-left">금일 합계</span>
                <span class="title table-center border-left">금일 비율</span>
                <span class="title table-center border-left">월 합계</span>
              </div>
            </vs-col>
          </vs-row>

          <vs-row class="border">
            <vs-col>
              <div class="border-top border-left border-right table-display-title">
                <span class="title table-center">현장명</span>
                <div class="table-display-sub-5">
                  <span class="title table-center border-left w-full">전체</span>
                  <span class="title table-center border-left w-full">덤프트럭(D/T)</span>
                  <span class="title table-center border-left w-full">포크레인(B/H)</span>
                  <span class="title table-center border-left w-full">이동식 크레인</span>
                  <span class="title table-center border-left w-full">발전기</span>
                </div>

                <div class="table-display-sub-4">
                  <span class="title table-center border-left w-full">덤프트럭(D/T)</span>
                  <span class="title table-center border-left w-full">포크레인(B/H)</span>
                  <span class="title table-center border-left w-full">이동식 크레인</span>
                  <span class="title table-center border-left w-full">발전기</span>
                </div>

                <div class="table-display-sub-5">
                  <span class="title table-center border-left w-full">전체</span>
                  <span class="title table-center border-left w-full">덤프트럭(D/T)</span>
                  <span class="title table-center border-left w-full">포크레인(B/H)</span>
                  <span class="title table-center border-left w-full">이동식 크레인</span>
                  <span class="title table-center border-left w-full">발전기</span>
                </div>

              </div>
            </vs-col>
          </vs-row>

          <vs-row >
            <vs-col class="border-bottom">
              <div class="border-top border-left border-right table-display-title"
                   :data="tr" :key="indextr" v-for="(tr, indextr) in table.listDaily">

                <span class="title table-center">{{ tr.type }}</span>
                <div class="table-display-sub-5 table-content">
                  <span class="title table-center border-left w-full">{{ tr.day_sum_all }}</span>
                  <span class="title table-center border-left w-full">{{ tr.day_sum_dump_truck }}</span>
                  <span class="title table-center border-left w-full">{{ tr.day_sum_fork_crane }}</span>
                  <span class="title table-center border-left w-full">{{ tr.day_sum_mobile_crane }}</span>
                  <span class="title table-center border-left w-full">{{ tr.day_sum_generator }}</span>
                </div>

                <div class="table-display-sub-4 table-content">
                  <span class="title table-center border-left w-full">{{
                      getRatio(tr.day_sum_dump_truck, tr.day_sum_all)
                    }}%</span>
                  <span class="title table-center border-left w-full">{{
                      getRatio(tr.day_sum_fork_crane, tr.day_sum_all)
                    }}%</span>
                  <span class="title table-center border-left w-full">{{
                      getRatio(tr.day_sum_mobile_crane, tr.day_sum_all)
                    }}%</span>
                  <span class="title table-center border-left w-full">{{
                      getRatio(tr.day_sum_generator, tr.day_sum_all)
                    }}%</span>
                </div>

                <div class="table-display-sub-5 table-content">
                  <span class="title table-center border-left w-full">{{ tr.month_sum_all }}</span>
                  <span class="title table-center border-left w-full">{{ tr.month_sum_dump_truck }}</span>
                  <span class="title table-center border-left w-full">{{ tr.month_sum_fork_crane }}</span>
                  <span class="title table-center border-left w-full">{{ tr.month_sum_mobile_crane }}</span>
                  <span class="title table-center border-left w-full">{{ tr.month_sum_generator }}</span>
                </div>
              </div>
            </vs-col>
          </vs-row>


          <!-- PJI -->
          <vs-row class="border mt-8">
            <vs-col>
              <div class="table-display-sum" style="border: 1px solid #cdcdcd !important;">
                <span class="title table-center" style="grid-row: 1/4; grid-column: 1; ">PJI</span>
                <span class="title table-center border-left border-bottom"
                      style="grid-row: 1; grid-column: 2;">금일 합계</span>
                <span class="title table-center border-left border-bottom"
                      style="grid-row: 1; grid-column: 3;">금일 비율</span>
                <span class="title table-center border-left border-bottom"
                      style="grid-row: 1; grid-column: 4;">월 합계</span>


                <div class="table-display-sub-5 border-bottom" style="grid-row: 2; grid-column: 2;">
                  <span class="title table-center border-left w-full">전체</span>
                  <span class="title table-center border-left w-full">덤프트럭(D/T)</span>
                  <span class="title table-center border-left w-full">포크레인(B/H)</span>
                  <span class="title table-center border-left w-full">이동식 크레인</span>
                  <span class="title table-center border-left w-full">발전기</span>
                </div>

                <div class="table-display-sub-4 border-bottom" style="grid-row: 2; grid-column: 3;">
                  <span class="title table-center border-left w-full">덤프트럭(D/T)</span>
                  <span class="title table-center border-left w-full">포크레인(B/H)</span>
                  <span class="title table-center border-left w-full">이동식 크레인</span>
                  <span class="title table-center border-left w-full">발전기</span>
                </div>

                <div class="table-display-sub-5 border-bottom" style="grid-row: 2; grid-column: 4;">
                  <span class="title table-center border-left w-full">전체</span>
                  <span class="title table-center border-left w-full">덤프트럭(D/T)</span>
                  <span class="title table-center border-left w-full">포크레인(B/H)</span>
                  <span class="title table-center border-left w-full">이동식 크레인</span>
                  <span class="title table-center border-left w-full">발전기</span>
                </div>


                <div class="table-display-sub-5 table-content" style="grid-row: 3; grid-column: 2;">
                  <span class="title table-center border-left w-full">{{ this.table.sumDaily.day_sum_all }}</span>
                  <span class="title table-center border-left w-full">{{ this.table.sumDaily.day_sum_dump_truck }}</span>
                  <span class="title table-center border-left w-full">{{ this.table.sumDaily.day_sum_fork_crane }}</span>
                  <span class="title table-center border-left w-full">{{ this.table.sumDaily.day_sum_mobile_crane }}</span>
                  <span class="title table-center border-left w-full">{{ this.table.sumDaily.day_sum_generator }}</span>
                </div>

                <div class="table-display-sub-4 table-content" style="grid-row: 3; grid-column: 3;">
                  <span class="title table-center border-left w-full">{{
                      getRatio(this.table.sumDaily.day_sum_dump_truck, this.table.sumDaily.day_sum_all)
                    }}%</span>
                  <span class="title table-center border-left w-full">{{
                      getRatio(this.table.sumDaily.day_sum_fork_crane, this.table.sumDaily.day_sum_all)
                    }}%</span>
                  <span class="title table-center border-left w-full">{{
                      getRatio(this.table.sumDaily.day_sum_mobile_crane, this.table.sumDaily.day_sum_all)
                    }}%</span>
                  <span class="title table-center border-left w-full">{{
                      getRatio(this.table.sumDaily.day_sum_generator, this.table.sumDaily.day_sum_all)
                    }}%</span>
                </div>

                <div class="table-display-sub-5 table-content" style="grid-row: 3; grid-column: 4;">
                  <span class="title table-center border-left w-full">{{ this.table.sumDaily.month_sum_all }}</span>
                  <span class="title table-center border-left w-full">{{ this.table.sumDaily.month_sum_dump_truck }}</span>
                  <span class="title table-center border-left w-full">{{ this.table.sumDaily.month_sum_fork_crane }}</span>
                  <span class="title table-center border-left w-full">{{ this.table.sumDaily.month_sum_mobile_crane }}</span>
                  <span class="title table-center border-left w-full">{{ this.table.sumDaily.month_sum_generator }}</span>
                </div>

              </div>
            </vs-col>
          </vs-row>


        </div>
      </vs-tab>

      <!-- 월별검색 -->
      <vs-tab :label="tabs[1].label">
        <div>

          <!--  상단 검색바-->
          <search-nav @handleSearch="handleSearchMonth">
            <search-nav-item-select label="대상기간" v-model="nav.year" :list="nav.yearList" @change="handleSearchMonth"/>년
            <search-nav-item-select v-model="nav.month" :list="nav.monthList" @change="handleSearchMonth"/>
            <span class="mr-6">월</span>
          </search-nav>


          <vs-row class="mb-4">
            <vs-col class="flex" vs-justify="flex-end">
              <vs-button color="secondary" type="border" @click="excelDownWithHtml('safety_staff_management_month')">{{$t('button.Excel 다운로드')}}</vs-button>
            </vs-col>
          </vs-row>


          <vs-row class="">
            <vs-col class="border-top border-left border-right" style="overflow-x:auto;">
              <div class="table-display-month">
                <span class="title table-center" style="min-width:120px;">사업자 번호</span>
                <span class="title table-center border-left" style="min-width:100px;">소속</span>
                <span :key="indextr" v-for="(tr, indextr) in this.numOflistMontly"
                      class="title table-center border-left">{{ indextr + 1 }}</span>
              </div>

              <div class="table-display-month">
                <span class="title table-center" style="min-width:120px;"></span>
                <span class="title table-center border-left" style="min-width:100px;">전체</span>
                <span :key="indextr" v-for="(tr, indextr) in this.table.sumMontly"
                      class="title table-center border-left table-content">{{tr}}</span>
              </div>

              <div
                v-for="(company, comIndex) in table.listMontlyWithCompany"
                :key="comIndex"
                class="table-display-month">
                <span class="title table-center" style="min-width:120px;">{{ company.com_number }}</span>
                <span class="title table-center border-left" style="min-width:100px;">{{ company.com_name }}</span>
                <span :key="valIndex" v-for="(value, valIndex) in company.values"
                      class="title table-center border-left table-content">{{ value }}</span>
              </div>
            </vs-col>
          </vs-row>
        </div>
      </vs-tab>
    </vs-tabs>

    <table id="safety_staff_management_daily" style="display: none;">
      <tr>
        <th></th>
        <th colspan="5" align="center">금일합계</th>
        <th colspan="4" align="center">금일비율</th>
        <th colspan="5" align="center">월 합계</th>
      </tr>
      <tr>
        <th>현장명</th>
        <th>전체</th>
        <th>덤프트럭(D/T)</th>
        <th>포크레인(B/H)</th>
        <th>이동식 크레인</th>
        <th>발전기</th>
        <th>덤프트럭(D/T)</th>
        <th>포크레인(B/H)</th>
        <th>이동식 크레인</th>
        <th>발전기</th>
        <th>전체</th>
        <th>덤프트럭(D/T)</th>
        <th>포크레인(B/H)</th>
        <th>이동식 크레인</th>
        <th>발전기</th>
      </tr>
      <tr :key="indextr" v-for="(tr, indextr) in table.listDaily">
        <td>{{ tr.type }}</td>
        <td>{{ tr.day_sum_all }}</td>
        <td>{{ tr.day_sum_dump_truck }}</td>
        <td>{{ tr.day_sum_fork_crane }}</td>
        <td>{{ tr.day_sum_mobile_crane }}</td>
        <td>{{ tr.day_sum_generator }}</td>
        <td>{{getRatio(tr.day_sum_dump_truck, tr.day_sum_all)}}%</td>
        <td>{{getRatio(tr.day_sum_fork_crane, tr.day_sum_all)}}%</td>
        <td>{{getRatio(tr.day_sum_mobile_crane, tr.day_sum_all)}}%</td>
        <td>{{getRatio(tr.day_sum_generator, tr.day_sum_all)}}%</td>
        <td>{{ tr.month_sum_all }}</td>
        <td>{{ tr.month_sum_dump_truck }}</td>
        <td>{{ tr.month_sum_fork_crane }}</td>
        <td>{{ tr.month_sum_mobile_crane }}</td>
        <td>{{ tr.month_sum_generator }}</td>
      </tr>

      <tr></tr>
      <tr></tr>

      <tr>
        <th rowspan="3">PJI</th>
        <th colspan="5" align="center">금일합계</th>
        <th colspan="4" align="center">금일비율</th>
        <th colspan="5" align="center">월 합계</th>
      </tr>
      <tr>
        <th>전체</th>
        <th>덤프트럭(D/T)</th>
        <th>포크레인(B/H)</th>
        <th>이동식 크레인</th>
        <th>발전기</th>
        <th>덤프트럭(D/T)</th>
        <th>포크레인(B/H)</th>
        <th>이동식 크레인</th>
        <th>발전기</th>
        <th>전체</th>
        <th>덤프트럭(D/T)</th>
        <th>포크레인(B/H)</th>
        <th>이동식 크레인</th>
        <th>발전기</th>
      </tr>

      <tr>
        <td>{{ this.table.sumDaily.day_sum_all }}</td>
        <td>{{ this.table.sumDaily.day_sum_dump_truck }}</td>
        <td>{{ this.table.sumDaily.day_sum_fork_crane }}</td>
        <td>{{ this.table.sumDaily.day_sum_mobile_crane }}</td>
        <td>{{ this.table.sumDaily.day_sum_generator }}</td>
        <td>{{ getRatio(this.table.sumDaily.day_sum_dump_truck, this.table.sumDaily.day_sum_all) }}%</td>
        <td>{{ getRatio(this.table.sumDaily.day_sum_fork_crane, this.table.sumDaily.day_sum_all) }}%</td>
        <td>{{ getRatio(this.table.sumDaily.day_sum_mobile_crane, this.table.sumDaily.day_sum_all) }}%</td>
        <td>{{ getRatio(this.table.sumDaily.day_sum_generator, this.table.sumDaily.day_sum_all) }}%</td>
        <td>{{ this.table.sumDaily.month_sum_all }}</td>
        <td>{{ this.table.sumDaily.month_sum_dump_truck }}</td>
        <td>{{ this.table.sumDaily.month_sum_fork_crane }}</td>
        <td>{{ this.table.sumDaily.month_sum_mobile_crane }}</td>
        <td>{{ this.table.sumDaily.month_sum_generator }}</td>
      </tr>

    </table>
    <table id="safety_staff_management_month" style="display: none;">
      <tr>
        <td>사업자 번호</td>
        <td>소속</td>
        <td :key="indextr" v-for="(tr, indextr) in this.numOflistMontly">{{ indextr + 1 }}</td>
      </tr>

      <tr>
        <td></td>
        <td>전체</td>
        <td :key="indextr" v-for="(tr, indextr) in this.table.sumMontly">{{ tr }}</td>
      </tr>

      <tr v-for="(company, comIndex) in table.listMontlyWithCompany"
          :key="comIndex">
        <td>{{ company.com_number }}</td>
        <td>{{ company.com_name }}</td>
        <td :key="valIndex" v-for="(value, valIndex) in company.values">{{ value }}</td>
      </tr>
    </table>
  </div>
</template>

<script>
import DateSelector from '../../../../components/selector/DateSelector'
import SearchNavItemKeyword from '@/components/nav/SearchNavItemKeyword'
import SearchNavItemDate from '@/components/nav/SearchNavItemDate'
import SearchNav from '@/components/nav/SearchNav'
import PopupExcelDownload from '@/popup/PopupExcelDownload'
import XLSX from 'xlsx'
import SearchNavItemSelect from '@/components/nav/SearchNavItemSelect'

export default {
  name: 'EquipmentManager',
  components: {
    SearchNavItemSelect,
    PopupExcelDownload,
    SearchNav,
    SearchNavItemDate,
    SearchNavItemKeyword,
    DateSelector
  },
  data () {
    return {
      // 검색 네비게이션
      nav: {
        date: ['', ''],
        keyword: '',
        year: '',
        yearList:[],
        month: new Date().getMonth() + 1,
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
      },
      rootPath: '', // 프로젝트의 rootPath
      selectedTab: -1,
      tabs: [
        {
          label: '일별검색',
          key: 'daily',
          create: false,
          update: false
        },
        {
          label: '월별검색',
          key: 'monthly',
          create: false,
          update: false
        }
      ],
      table: {
        sumDaily: {
          day_sum_all: 0,
          day_sum_dump_truck: 0,
          day_sum_fork_crane: 0,
          day_sum_mobile_crane: 0,
          day_sum_generator: 0,
          month_sum_all: 0,
          month_sum_dump_truck: 0,
          month_sum_fork_crane: 0,
          month_sum_mobile_crane: 0,
          month_sum_generator: 0
        },
        listDaily: [
          {
            type: '건축주택',
            day_sum_all: 0,
            day_sum_dump_truck: 0,
            day_sum_fork_crane: 0,
            day_sum_mobile_crane: 0,
            day_sum_generator: 0,
            month_sum_all: 0,
            month_sum_dump_truck: 0,
            month_sum_fork_crane: 0,
            month_sum_mobile_crane: 0,
            month_sum_generator: 0
          },
          {
            type: 'Infra',
            day_sum_all: 0,
            day_sum_dump_truck: 0,
            day_sum_fork_crane: 0,
            day_sum_mobile_crane: 0,
            day_sum_generator: 0,
            month_sum_all: 0,
            month_sum_dump_truck: 0,
            month_sum_fork_crane: 0,
            month_sum_mobile_crane: 0,
            month_sum_generator: 0
          },
          {
            type: '플랜트',
            day_sum_all: 0,
            day_sum_dump_truck: 0,
            day_sum_fork_crane: 0,
            day_sum_mobile_crane: 0,
            day_sum_generator: 0,
            month_sum_all: 0,
            month_sum_dump_truck: 0,
            month_sum_fork_crane: 0,
            month_sum_mobile_crane: 0,
            month_sum_generator: 0
          },
          {
            type: '에너지',
            day_sum_all: 0,
            day_sum_dump_truck: 0,
            day_sum_fork_crane: 0,
            day_sum_mobile_crane: 0,
            day_sum_generator: 0,
            month_sum_all: 0,
            month_sum_dump_truck: 0,
            month_sum_fork_crane: 0,
            month_sum_mobile_crane: 0,
            month_sum_generator: 0
          },
          {
            type: '전체합계',
            day_sum_all: 0,
            day_sum_dump_truck: 0,
            day_sum_fork_crane: 0,
            day_sum_mobile_crane: 0,
            day_sum_generator: 0,
            month_sum_all: 0,
            month_sum_dump_truck: 0,
            month_sum_fork_crane: 0,
            month_sum_mobile_crane: 0,
            month_sum_generator: 0
          }
        ],
        sumMontly: [],
        listMontlyWithCompany: [],
        perPage: 1,
        keyword: ''
      },
      numOflistMontly: 31,
      list: [],
      listAll: []
    }
  },

  async created () {
    this.nav.date = [new Date().format('yyyy-MM-dd'), '']

    let nowYear = new Date().getFullYear()
    for (let i = 0; i < 50; i++) {
      this.nav.yearList.push({text:`${nowYear}`,  value:nowYear})
      nowYear--
    }
    this.nav.year = new Date().getFullYear()

    await this.loadPostList()
    await this.loadPostListMonth()
  },
  methods: {
    // 현장 개요 불러오기
    async loadPostList () {
      this.table.sumDaily = {
        day_sum_all: 0,
        day_sum_dump_truck: 0,
        day_sum_fork_crane: 0,
        day_sum_mobile_crane: 0,
        day_sum_generator: 0,
        month_sum_all: 0,
        month_sum_dump_truck: 0,
        month_sum_fork_crane: 0,
        month_sum_mobile_crane: 0,
        month_sum_generator: 0
      }
      for (const daily of this.table.listDaily) {
        daily.day_sum_all = 0
        daily.day_sum_dump_truck = 0
        daily.day_sum_fork_crane = 0
        daily.day_sum_mobile_crane = 0
        daily.day_sum_generator = 0
        daily.month_sum_all = 0
        daily.month_sum_dump_truck = 0
        daily.month_sum_fork_crane = 0
        daily.month_sum_mobile_crane = 0
        daily.month_sum_generator = 0
      }

      const projectId = this.$route.params.proj_id
      const boardId = 49 // equipment_power
      const page = 1
      const perPage = 100000
      const dateTarget = 'created_at'
      let dateBegin = this.nav.date[0]
      let dateEnd = this.nav.date[0]

      const keyword = this.nav.keyword

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
      this.list = this.$store.state.board.postListInfo.data

      for (const item of this.list) {
        const preview = this.getContent(item)
        let all = 0, tbm = 0, female = 0, oldage = 0, foreign = 0
        all = Number(preview.num_of_all)
        tbm = Number(preview.num_of_dump_truck)
        female = Number(preview.num_of_fork_crane)
        oldage = Number(preview.num_of_mobile_crane)
        foreign = Number(preview.num_of_generator)

        this.table.listDaily[Number(preview.type) - 1].day_sum_all += all
        this.table.listDaily[Number(preview.type) - 1].day_sum_dump_truck += tbm
        this.table.listDaily[Number(preview.type) - 1].day_sum_fork_crane += female
        this.table.listDaily[Number(preview.type) - 1].day_sum_mobile_crane += oldage
        this.table.listDaily[Number(preview.type) - 1].day_sum_generator += foreign
      }

      dateEnd = this.getLastDateWithSearchDate(dateBegin)
      dateBegin = this.getFirstDateWithSearchDate(dateBegin)
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
      this.listAll = this.$store.state.board.postListInfo.data || []

      for (const item of this.listAll) {
        const preview = this.getContent(item)
        let all = 0, tbm = 0, female = 0, oldage = 0, foreign = 0
        all = Number(preview.num_of_all)
        tbm = Number(preview.num_of_dump_truck)
        female = Number(preview.num_of_fork_crane)
        oldage = Number(preview.num_of_mobile_crane)
        foreign = Number(preview.num_of_generator)

        this.table.listDaily[Number(preview.type) - 1].month_sum_all += all
        this.table.listDaily[Number(preview.type) - 1].month_sum_dump_truck += tbm
        this.table.listDaily[Number(preview.type) - 1].month_sum_fork_crane += female
        this.table.listDaily[Number(preview.type) - 1].month_sum_mobile_crane += oldage
        this.table.listDaily[Number(preview.type) - 1].month_sum_generator += foreign
      }

      for (const daily of this.table.listDaily) {
        this.table.sumDaily.day_sum_all += daily.day_sum_all
        this.table.sumDaily.day_sum_dump_truck += daily.day_sum_dump_truck
        this.table.sumDaily.day_sum_fork_crane += daily.day_sum_fork_crane
        this.table.sumDaily.day_sum_mobile_crane += daily.day_sum_mobile_crane
        this.table.sumDaily.day_sum_generator += daily.day_sum_generator
        this.table.sumDaily.month_sum_all += daily.month_sum_all
        this.table.sumDaily.month_sum_dump_truck += daily.month_sum_dump_truck
        this.table.sumDaily.month_sum_fork_crane += daily.month_sum_fork_crane
        this.table.sumDaily.month_sum_mobile_crane += daily.month_sum_mobile_crane
        this.table.sumDaily.month_sum_generator += daily.month_sum_generator
      }
    },
    // 현장 개요 불러오기
    async loadPostListMonth () {
      this.table.listMontlyWithCompany = []
      this.table.sumMontly = []

      const projectId = this.$route.params.proj_id
      const boardId = 49 // equipment_power
      const page = 1
      const perPage = 100000
      const dateTarget = 'created_at'

      const year = this.nav.year
      const month = this.nav.month
      const dateBegin = this.getFirstDateWithSearchDate(year, month)
      const dateEnd = this.getLastDateWithSearchDate(year, month)

      const keyword = this.nav.keyword
      this.numOflistMontly = Number(dateEnd.substr(8))
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
      this.listAll = this.$store.state.board.postListInfo.data || []

      const _temp_values = []//{ com_name:'', values:[] }
      for (const item of this.listAll) {
        const preview = this.getContent(item)
        const created_at = item.created_at.substr(0, 11)
        const created_day = Number(created_at.substr(8))

        if (_temp_values.length === 0) {
          const index = 0
          _temp_values[index] = {
            com_name: item.author.company.com_name,
            com_number: item.author.company.com_number,
            values: []
          }
          for (let d = 1; d <= Number(dateEnd.substr(8)); d++) {
            _temp_values[index].values[d - 1] = 0
          }
          _temp_values[index].values[created_day - 1] = Number(preview.num_of_all)

        } else {
          for (let i = 0; i < _temp_values.length; i++) {
            if (_temp_values[i].com_name === item.author.company.com_name) {
              const index = i
              _temp_values[index].values[created_day - 1] += Number(preview.num_of_all)
            } else {
              const index = _temp_values.length
              _temp_values[index] = {
                com_name: item.author.company.com_name,
                com_number: item.author.company.com_number,
                values: []
              }
              for (let d = 1; d <= Number(dateEnd.substr(8)); d++) {
                _temp_values[index].values[d - 1] = 0
              }
              _temp_values[index].values[created_day - 1] = Number(preview.num_of_all)
            }
          }
        }
      }

      this.table.listMontlyWithCompany = _temp_values

      for (const com of this.table.listMontlyWithCompany) {
        for (let i = 0; i < com.values.length; i++) {
          if (!this.table.sumMontly[i]) {
            this.table.sumMontly[i] = 0
          }
          this.table.sumMontly[i] += com.values[i]
        }
      }

    },

    getRatio (value, all) {
      if (all > 0) {
        const dig = 100 // 소수점 두자리까지
        return Math.floor(value * 100 * dig / all) / dig
      } else {
        return 0.00
      }
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

    handleSearch () {
      this.loadPostList()
    },

    handleSearchMonth () {
      this.loadPostListMonth()
    },

    excelDownWithHtml (tableName) {
      const wb = XLSX.utils.table_to_book(document.getElementById(tableName), {sheet:'인원투입 현황', raw:true})
      XLSX.writeFile(wb, ('인원투입 현황.xlsx'))
    }
  }
}
</script>

<style scoped>

.table-display-title {
  display: grid;
  grid-template-rows: minmax(52px, 100%);
  grid-template-columns: 2fr repeat(3, minmax(0, 5fr));
}

.table-display-sub-5 {
  display: grid;
  grid-template-rows: minmax(52px, 100%);
  grid-template-columns: repeat(5, minmax(0, 1fr));
}

.table-display-sub-4 {
  display: grid;
  grid-template-rows: minmax(52px, 100%);
  grid-template-columns: repeat(4, minmax(0, 1fr));
}

.table-display-sum {
  display: grid;
  grid-template-rows: repeat(3, minmax(52px, 100%));
  grid-template-columns: 2fr repeat(3, minmax(0, 5fr));
}

.table-display-month {
  display: flex;
  height: 53px;
  grid-template-rows: minmax(52px, 100%);
}

.table-display-month span {
  flex: 1;
  min-width: 40px;

  border-bottom: 1px solid #cdcdcd;
}

.table-content {
  background-color: white;
}

.table-center {
  display: flex;
  height: 100%;
  align-items: center;
  justify-content: center;
}
</style>
