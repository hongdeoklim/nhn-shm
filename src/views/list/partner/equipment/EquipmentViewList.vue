<template>
  <div>

    <!--  상단 검색바-->
    <search-nav @handleSearch="handleSearch">
      <search-nav-item-date label="출역기간" v-model="nav.date" />
    </search-nav>

    <vs-row>
      <vs-col class="mt-4 pr-4 w-6/12">

        <vs-row vs-align="center" style="height: 50px">
          <vs-col class="w-1/2 flex">
            <h5><i class="dot"></i>기간별 투입장비</h5>
          </vs-col>
        </vs-row>

        <vs-row>
          <vs-col class="w-full mt-4 mb-4">
            <vs-table stripe
                      ref="table"
                      :sst="true"
                      pagination
                      :max-items="getSearchList.length"
                      :data="getSearchList"
                      @selected ="selectSearchList"
            >


              <template slot="thead">
                <vs-th class="w-1/12"><span class="w-full text-center">No.</span></vs-th>
                <vs-th class="w-4/12"><span class="w-full text-center">사업자 번호</span></vs-th>
                <vs-th class="w-3/12"><span class="w-full text-center">소속</span></vs-th>
                <vs-th class="w-2/12"><span class="w-full text-center">기간 누계</span></vs-th>
                <vs-th class="w-2/12"><span class="w-full text-center">총 누계</span></vs-th>
              </template>


              <template slot-scope="{data}">
                <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">

                  <vs-td class="text-center">{{ (indextr + 1) }}</vs-td>
                  <vs-td class="text-center">{{ tr.com_number }}</vs-td>
                  <vs-td class="text-center">{{ tr.com_name }}</vs-td>
                  <vs-td class="text-center">{{ tr.search_sum }}</vs-td>
                  <vs-td class="text-center">{{ tr.all_sum }}</vs-td>
                </vs-tr>
              </template>
            </vs-table>
          </vs-col>
        </vs-row>


      </vs-col>


      <vs-col class="mt-4 pl-4 w-6/12">
        <vs-row vs-align="center" style="height: 50px">
          <vs-col class="w-1/2 flex">
            <h5><i class="dot"></i>일별 투입장비</h5>
          </vs-col>

        </vs-row>

        <vs-row>
          <vs-col class="w-full mt-4 mb-4">
            <vs-table stripe
                      ref="table"
                      :sst="true"
                      pagination
                      :max-items="(detailList.length == 0) ? 1 : detailList.length"
                      :data="detailList">


              <template slot="thead">
                <vs-th class="w-3/12"><span class="w-full text-center">일자</span></vs-th>
                <vs-th class="w-2/12"><span class="w-full text-center">전체인원</span></vs-th>
                <vs-th class="w-2/12"><span class="w-full text-center">출역인원</span></vs-th>
                <vs-th class="w-2/12"><span class="w-full text-center">출석률</span></vs-th>
                <vs-th class="w-2/12"><span class="w-full text-center">재해발생</span></vs-th>
              </template>


              <template slot-scope="{data}">
                <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">

                  <vs-td class="text-center">{{ new Date(tr.created_at).format('yyyy-MM-dd') }}</vs-td>
                  <vs-td class="text-center">{{ tr.num_of_all }}</vs-td>
                  <vs-td class="text-center">{{ tr.num_of_dump_truck }}</vs-td>
                  <vs-td class="text-center">{{ tr.num_of_attend }}%</vs-td>
                  <vs-td class="text-center">{{ tr.disaster_num }}</vs-td>
                </vs-tr>
              </template>
            </vs-table>
          </vs-col>
        </vs-row>

      </vs-col>
    </vs-row>


  </div>
</template>

<script>
import DateSelector from '../../../../components/selector/DateSelector'
import SearchNav from '@/components/nav/SearchNav'
import SearchNavItemDate from '@/components/nav/SearchNavItemDate'
import SearchNavItemKeyword from '@/components/nav/SearchNavItemKeyword'

export default {
  name: 'EquipmentViewList',
  components: {SearchNavItemKeyword, SearchNavItemDate, SearchNav, DateSelector},
  data () {
    return {
      // 검색 네비게이션
      nav:{
        date:['', ''],
        keyword:''
      },
      staffList:[],
      staffListAll:[],
      detailList:[],
      old_com_number:''
    }
  },

  computed: {
    getSearchList () {
      const json = {}
      const staffList = this.staffList
      const staffListAll = this.staffListAll

      for (const staff of Object.keys(staffListAll)) {
        if (!json[staff]) {
          json[staff] = {
            contract_code : staffListAll[staff].contract_code,
            com_number : staffListAll[staff].com_number,
            com_name : staffListAll[staff].com_name,
            search_sum: 0,
            all_sum: 0
          }
        }

        json[staff].all_sum = json[staff].all_sum + parseInt(staffListAll[staff].num_of_all)
      }

      for (const staff of Object.keys(staffList)) {
        if (!json[staff] && staffList[staff]) {
          json[staff] = {
            contract_code : staffList[staff].contract_code,
            com_number : staffList[staff].com_number,
            com_name : staffList[staff].com_name,
            search_sum: 0,
            all_sum: 0

          }
        }

        json[staff].search_sum = json[staff].search_sum + parseInt(staffList[staff].num_of_all)
      }


      const list = []
      for (const staff of Object.keys(json)) {
        list.push(json[staff])
      }

      return list
    }
  },

  async created () {
    await this.loadStaffList()
    await this.loadStaffListAll()
    await this.selectSearchList({'com_number':null})
  },
  methods: {

    // 현장 개요 불러오기
    async loadStaffList () {
      const projectId = this.$route.params.proj_id
      const boardId = 49 // equipment_power
      const page = 1
      const perPage = 30
      const dateTarget = 'created_at'
      const dateBegin = this.nav.date[0]
      const dateEnd = this.nav.date[1]

      await this.$store.dispatch('board/LOAD_POST_LIST', {
        projectId,
        boardId,
        page,
        perPage,
        dateTarget,
        dateBegin,
        dateEnd
      })

      this.staffList = this.getConvertStaffList(this.$store.state.board.postListInfo.data)
    },

    async loadStaffListAll () {
      const projectId = this.$route.params.proj_id
      const boardId = 49 // equipment_power
      const page = 1
      const perPage = 30

      await this.$store.dispatch('board/LOAD_POST_LIST', {
        projectId,
        boardId,
        page,
        perPage
      })
      this.staffListAll = this.getConvertStaffList(this.$store.state.board.postListInfo.data)
    },

    async handleSearch () {
      await this.loadStaffList()
      await this.loadStaffListAll()
      this.detailList = []
      await this.selectSearchList({'com_number':null})
    },

    async selectSearchList (data) {
      const projectId = this.$route.params.proj_id
      const dateTarget = 'created_at'
      const dateBegin = this.nav.date[0]
      const dateEnd = this.nav.date[1]
      let com_number = data.com_number
      if (this.old_com_number === com_number) {
        com_number = null
      }

      const keyword = []
      if (com_number) keyword.push(`content$com_number*${com_number}`)


      let boardId = 22
      let page = 1
      let perPage = 30

      await this.$store.dispatch('board/LOAD_POST_LIST', {
        projectId,
        boardId,
        page,
        perPage,
        keyword,
        dateTarget,
        dateBegin,
        dateEnd
      })
      const accidednts = this.$store.state.board.postListInfo.data


      boardId = 49 // equipment_power
      page = 1
      perPage = 30
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

      this.detailList = this.getConvertDetailList(this.$store.state.board.postListInfo.data, accidednts)
      this.old_com_number = com_number

    },

    getConvertStaffList (staffList) {
      const list = {}
      let preview = {}
      for (const staff of staffList) {
        const key = staff.author.company.com_number
        preview = this.getContent(staff)
        if (key) {
          if (!list[key]) {
            list[key] = {
              contract_code : staff.project.contract_code,
              com_name : staff.author.company.com_name,
              com_number : staff.author.company.com_number,
              num_of_all: 0,
              num_of_dump_truck: 0,
              num_of_fork_crane: 0,
              num_of_mobile_crane: 0,
              num_of_generator: 0
            }
          }

          list[key].num_of_all = list[key].num_of_all + parseInt(preview.num_of_all)
          list[key].num_of_dump_truck = list[key].num_of_dump_truck + parseInt(preview.num_of_dump_truck)
          list[key].num_of_fork_crane = list[key].num_of_fork_crane + parseInt(preview.num_of_fork_crane)
          list[key].num_of_mobile_crane = list[key].num_of_mobile_crane + parseInt(preview.num_of_mobile_crane)
          list[key].num_of_generator = list[key].num_of_generator + parseInt(preview.num_of_generator)
        }
      }

      return list
    },

    getConvertDetailList (detailList, disasterList) {
      let preview = {}
      const detail = {}
      let date_yyyyMMdd = ''


      for (const staff of detailList) {
        preview = this.getContent(staff)
        date_yyyyMMdd = new Date(staff.created_at).format('yyyy-MM-dd')
        if (!detail[date_yyyyMMdd]) {
          detail[date_yyyyMMdd] = {
            created_at : date_yyyyMMdd,
            num_of_all : 0,
            num_of_dump_truck : 0,
            num_of_attend : 0,
            disaster_num : 0
          }
        }

        detail[date_yyyyMMdd].num_of_all = detail[date_yyyyMMdd].num_of_all + parseInt(preview.num_of_all)
        detail[date_yyyyMMdd].num_of_dump_truck = detail[date_yyyyMMdd].num_of_dump_truck + parseInt(preview.num_of_dump_truck)
        detail[date_yyyyMMdd].num_of_attend = (parseInt(preview.num_of_dump_truck) * 100 / parseInt(preview.num_of_all)).toFixed(2)
      }

      for (const disaster of disasterList) {
        preview = this.getContent(disaster)
        date_yyyyMMdd = new Date(preview.disaster_date).format('yyyy-MM-dd')
        if (detail[date_yyyyMMdd]) {
          detail[date_yyyyMMdd].disaster_num = parseInt(detail[date_yyyyMMdd].disaster_num) + 1
        }
      }

      const list = []
      for (const item of Object.keys(detail)) {
        list.push(detail[item])
      }

      return list
    },

    getContent (data) {
      if (data.post_content) {
        const preview = JSON.parse(data.post_content)
        return preview
      }
    }
  }
}
</script>

<style scoped>

</style>
