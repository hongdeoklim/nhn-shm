<template>
  <vs-popup v-if="size === 'mobile'" id="search-project-mobile" title="분야 상세검색" :active.sync="showPopup" >
    <vs-row class="w-full " >

      <vs-col class="w-full mr-4 mb-3 flex" vs-align="center">
        <span class="w-3/12" >분야명 {{this.size}}</span>
        <ml-input class="w-9/12" v-model="search.projectName"/>
      </vs-col>
      <vs-spacer/>

      <vs-col class="w-full mr-4 mb-3 flex" vs-align="center">
        <span class="w-3/12" >지역</span>
        <ml-input class="w-9/12" v-model="search.location"/>
      </vs-col>

      <vs-col class="w-full mr-4 mb-3 flex" vs-align="center">
        <span class="w-3/12" >소속</span>
        <ml-input class="w-9/12" v-model="search.subcontractor"/>
      </vs-col>

      <vs-spacer/>
      <vs-col class="w-full mr-4 mb-3 flex" vs-align="center">
        <span class="w-3/12" >계약코드</span>
        <ml-input class="w-9/12" v-model="search.contract_code"/>
      </vs-col>
      <vs-col class="w-full mr-4 mb-3 flex" vs-align="center">
        <span class="w-3/12" >대상기간</span>
        <div class="flex w-9/12" style="align-items: center;">
          <date-selector v-model="search.date[0]"/>
          <span class="mx-2">~</span>
          <date-selector v-model="search.date[1]"/>
        </div>
      </vs-col>
    </vs-row>

    <vs-row class="mb-4 flex">
      <vs-button class="ml-auto" color="secondary" @click="loadProjectList">검색</vs-button>
    </vs-row>

    <vs-row>
      <vs-table
        class="w-full mb-4"
        noDataText="검색된 현장이 없습니다"
        ref="table"
        stripe
        :data="table.list"
        :sst="true"
        :max-items="table.perPage"
        color="success"
        @selected="handleItemClickDetail"
      >

        <template slot="thead">
          <vs-th style="min-width:80px; max-width: 80px;"><span class="w-full text-center">계약코드</span></vs-th>
          <vs-th style="min-width:260px;"><span class="w-full text-center">분류</span></vs-th>
          <vs-th style="min-width:130px;"><span class="w-full text-center">현장명</span></vs-th>
        </template>

        <template slot-scope="{data}">
          <vs-tr class="text-center" :class="(project.id === tr.id) ? 'active' : '' " :data="tr" :key="indextr" v-for="(tr, indextr) in data">
            <vs-td>{{tr.contract_code}}</vs-td>
            <vs-td>{{getProjectGroupName(tr.project_group_id)}}</vs-td>
            <vs-td>{{tr.field_name}}</vs-td>
          </vs-tr>
        </template>
      </vs-table>


      <div class="w-full vs-con-table">
        <div class="con-pagination-table vs-table--pagination">
          <k-pagination
            :total="(lastPage) ? lastPage : 1"
            v-model="currentPage" @change="handleChangePage"></k-pagination>
        </div>
      </div>

      <vs-col class="mt-4 flex" vs-align="center" vs-justify="flex-end">
        <vs-button class="mr-4 " color="#EDEDED" text-color="black" type="filled" @click="handleClickClose">닫기
        </vs-button>
        <vs-button class="" color="secondary" @click="handleClickSelect">선택</vs-button>
      </vs-col>
    </vs-row>
  </vs-popup>







  <vs-popup v-else id="search-project" title="분야 상세검색" :active.sync="showPopup" >
    <vs-row class="w-full grid" style="grid-template-columns: 1fr 50px 1fr;">

      <vs-col class="w-full mr-4 mb-3 flex" vs-align="center">
        <span class="w-3/12" >분야명</span>
        <ml-input class="w-9/12" v-model="search.projectName"/>
      </vs-col>
      <vs-spacer/>

      <vs-col class="w-full mr-4 mb-3 flex" vs-align="center">
        <span class="w-3/12" >지역</span>
        <ml-input class="w-9/12" v-model="search.location"/>
      </vs-col>

      <vs-col class="w-full mr-4 mb-3 flex" vs-align="center">
        <span class="w-3/12" >소속</span>
        <ml-input class="w-9/12" v-model="search.subcontractor"/>
      </vs-col>

      <vs-spacer/>

      <vs-col class="w-full mr-4 mb-3 flex" vs-align="center">
        <span class="w-3/12" >계약코드</span>
        <ml-input class="w-9/12" v-model="search.contract_code"/>
      </vs-col>
      <vs-col class="w-full mr-4 mb-3 flex" vs-align="center">
        <span class="w-3/12" >대상기간</span>
        <div class="flex w-9/12" style="align-items: center;">
          <date-selector v-model="search.date[0]"/>
          <span class="mx-2">~</span>
          <date-selector v-model="search.date[1]"/>
        </div>
      </vs-col>
    </vs-row>

    <vs-row class="mb-4 flex">
      <vs-button class="ml-auto" color="secondary" @click="handleSearch">검색</vs-button>
    </vs-row>

    <vs-row>
      <vs-table
        class="w-full mb-4"

        noDataText="검색된 분야가 없습니다"
        ref="table"
        stripe
        :data="table.list"
        :sst="true"
        :max-items="table.perPage"
        color="success"
        @selected="handleItemClickDetail"
      >

        <template slot="thead">
          <vs-th class="w-4/12" ><span class="w-full text-center">계약코드</span></vs-th>
          <vs-th class="w-4/12" ><span class="w-full text-center">분류</span></vs-th>
          <vs-th class="w-4/12" ><span class="w-full text-center">분야명</span></vs-th>
        </template>

        <template slot-scope="{data}">
          <vs-tr class="text-center" :class="(project.id === tr.id) ? 'active' : '' " :data="tr" :key="indextr" v-for="(tr, indextr) in data">
            <vs-td>{{tr.contract_code}}</vs-td>
            <vs-td>{{getProjectGroupName(tr.project_group_id)}}</vs-td>
            <vs-td>{{tr.field_name}}</vs-td>
          </vs-tr>
        </template>
      </vs-table>


      <div class="w-full vs-con-table">
        <div class="con-pagination-table vs-table--pagination">
          <k-pagination
            :total="(lastPage) ? lastPage : 1"
            v-model="currentPage" @change="handleChangePage"></k-pagination>
        </div>
      </div>

      <vs-col class="mt-4 flex" vs-align="center" vs-justify="flex-end">
        <vs-button class="mr-4 " color="#EDEDED" text-color="black" type="filled" @click="handleClickClose">닫기
        </vs-button>
        <vs-button class="" color="secondary" @click="handleClickSelect">선택</vs-button>
      </vs-col>
    </vs-row>
  </vs-popup>
</template>

<script>
import KPagination from '@/components/kPagination/kPagination'
import DateSelector from '@/components/selector/DateSelector'
export default {
  name: 'PopupSearchProject',
  components: {
    DateSelector,
    KPagination},
  props: {
    value: Boolean,
    size: String,
  },

  watch: {
    value (data) {
      this.showPopup = data
    },
    showPopup (value) {
      const body = document.querySelector('body');
      if (value) {
        body.style.overflow = 'hidden'
      } else {
        body.style.overflow = 'auto'
      }
      this.$emit('input', value)
    },
  },

  data () {
    return {
      showPopup: false,

      // 겅색
      search: {
        date: ['', ''],
        company:'', // 회사명
        name:'', // 이름
        _constructor:'',
        location:'',
        contract_code:'',
        projectName:'',
        subcontractor:'',
      },

      //pagination
      perPage: 10,
      searchKeyword: '',
      currentPage: 1,
      lastPage: 1,

      table: {
        list: [],
        perPage: 5,
        keyword: ''
      },
      projectGroupList:[],
      project: '',
    }
  },

  created () {
    this.loadProjectGroup()
  },

  methods : {
    async loadProjectList () {
      const page = (this.currentPage) ? this.currentPage : 1
      const keyword = (this.keyword) ? this.keyword : ''
      const perPage = this.perPage
      const filterBegin = `${this.search.date[0]}`.trim()
      const filterEnd = `${this.search.date[1]}`.trim()
      let filterType = ''
      if ((filterBegin && filterBegin !== '') || (filterEnd && filterEnd !== '')) {
        filterType = 'business_duration' //this.filterType = {start, complete_expected, complete}
      }
      const project_group_id = ''
      const project_name = this.search.projectName
      const constructor_name = this.search._constructor
      const subcontractor = this.search.subcontractor
      const location = this.search.location
      const contract_code = this.search.contract_code
      const employee = ''

      await this.$store.dispatch('project/LOAD_PROJECT_LIST', {
        page,
        perPage,
        keyword,
        filterType,
        filterBegin,
        filterEnd,
        project_group_id,
        project_name,
        constructor_name,
        subcontractor,
        location,
        contract_code,
        employee
      })

      // 게시물 불러오기
      const projectListInfo = this.$store.state.project.projectListInfo

      // 페이지네이션 정보
      this.currentPage = projectListInfo.current_page
      this.lastPage = projectListInfo.last_page
      this.perPage = projectListInfo.per_page

      // 보여지는 게시물 리스트
      this.table.list = projectListInfo.data

    },

    async loadProjectGroup () {
      const page = 1, perPage = 10, keyword = ''
      await this.$store.dispatch('project/LOAD_PROJECT_GROUP', {
        page,
        perPage,
        keyword
      })
      const project_group = this.$store.state.project.projectGroup

      this.projectGroupList = []
      for (const pg of project_group) {
        this.projectGroupList.push({
          text:pg.name,
          value:pg.id
        })
      }
    },

    getProjectGroupName (groupId) {
      for (const data of this.projectGroupList) {
        if (data.value === groupId) {
          return data.text
        }
      }
      return ''
    },

    handleSearch () {
      this.currentPage = 1
      this.loadProjectList()
    },

    handleChangePage (page) {
      this.currentPage = page
      this.loadProjectList()
    },

    handleItemClickDetail (data) {
      if (data) {
        if (this.project && this.project.id === data.id) {
          this.project = {}
        } else {
          this.project = data
        }
      }
    },

    handleClickClose () {
      this.$emit('input', false)
      this.$emit('handleClickClose')
    },

    handleClickSelect () {
      this.$emit('input', false)
      this.$emit('handleClickSelect', this.project)
    }
  }
}
</script>

<style lang="scss">
#search-project-mobile.con-vs-popup,
#search-project.con-vs-popup {
  z-index: 53000;

  .vs-popup {
    width: 800px !important;
    height: auto;
  }
  .vs-popup--content {
    width: auto !important;
    padding: 1rem;
    font-size: 1rem;
  }
}
</style>

<style scoped>


.table-layout {
  border: 1px solid #cdcdcd;
}

.table-layout .trow {
  border-bottom: 1px solid #cdcdcd;
}

.table-layout .tcol {
  border-right: 1px solid #cdcdcd;
}

.vs-con-table.stripe .tr-values.active {
  background: rgb(102, 112, 203) !important;
  color: #fff;
  font-width: bold;
}

</style>
