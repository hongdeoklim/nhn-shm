<template>
  <div>
    <!--  상단 검색바-->
    <search-nav @handleSearch="handleSearch">
      <vs-row>
        <vs-col class="mb-6 flex">
          <search-nav-item-select label="검색조건" v-model="nav.dateTarget" :list="nav.dateTargettList"/>
          <search-nav-item-date label="대상기간" v-model="nav.date" />
          <search-nav-item-select label="재해구분" v-model="nav.accident" :list="nav.accidentList" />
          <vs-checkbox>산재여부</vs-checkbox>
        </vs-col>
        <vs-col class="flex mb-6">
          <search-nav-item-project label="현장명" size="large" v-model="nav.projectId" @keyupEvent="handleSearch"/>
        </vs-col>
      </vs-row>
    </search-nav>

    <vs-row class="mb-4">
      <vs-col class="w-full flex " vs-justify="flex-end">
        <vs-button class="mr-4" color="secondary" type="border" @click="excelDownFunc">{{$t('button.Excel 다운로드')}}</vs-button>
        <vs-button class="mr-2" type="border" color="secondary" @click="handleClickApprovalLine">{{$t('button.결재선 지정')}}</vs-button>
        <vs-button color="secondary" @click="handleClickAdd">신규작성</vs-button>
      </vs-col>
    </vs-row>

    <vs-row>
      <vs-col>
        <vs-table stripe
                  ref="table"
                  :sst="true"
                  pagination
                  :max-items="table.perPage"
                  :data="table.list"
                  noDataText="데이터가 없습니다"
                  @sort="handleSort"
                  @selected="handleItemClickDetail"
        >


          <template slot="thead">
            <vs-th sort-key="id" class="w-1/12"><span class="w-full text-center">No.</span></vs-th>
            <vs-th sort-key="content$preview.field_name" class="w-1/12"><span class="w-full text-center">현장명</span></vs-th>
            <vs-th sort-key="content$preview.accidentType" class="w-2/12"><span class="w-full text-center">구분</span></vs-th>
            <vs-th sort-key="content$preview.workType" class="w-1/12"><span class="w-full text-center">직종</span></vs-th>
            <vs-th sort-key="content$preview.disease_name" class="w-1/12"><span class="w-full text-center">상해명</span></vs-th>
            <vs-th sort-key="content$preview.victim_name" class="w-1/12"><span class="w-full text-center">재해자</span></vs-th>
            <vs-th sort-key="content$preview.biz_p_name" class="w-1/12"><span class="w-full text-center">소속</span></vs-th>
            <vs-th sort-key="content$preview.supervisor" class="w-1/12"><span class="w-full text-center">관리감독자</span></vs-th>
            <vs-th sort-key="content$preview.disaster_date" class="w-1/12"><span class="w-full text-center">재해일</span></vs-th>
            <vs-th sort-key="created_at" class="w-1/12"><span class="w-full text-center">작성일</span></vs-th>
            <vs-th sort-key="status" class="w-1/12"><span class="w-full text-center">결재상태</span></vs-th>
          </template>


          <template slot-scope="{data}">
            <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">

              <vs-td class="text-center">{{ tr.post.id }}</vs-td>
              <vs-td class="text-center">{{ getPreview(tr).field_name }}</vs-td>
              <vs-td class="text-center">{{ getAccidentType(getPreview(tr).accidentType) }}</vs-td>
              <vs-td class="text-center">{{ getWorkType(getPreview(tr).workType) }}</vs-td>
              <vs-td class="text-center">{{ getDiseaseName(getPreview(tr).disease_name) }}</vs-td>
              <vs-td class="text-center">{{ getPreview(tr).victim_name }}</vs-td>
              <vs-td class="text-center">{{ getPreview(tr).biz_p_name }}</vs-td>
              <vs-td class="text-center">{{ getPreview(tr).supervisor }}</vs-td>
              <vs-td class="text-center">{{ getPreview(tr).disaster_date }}</vs-td>
              <vs-td class="text-center">{{ getContent(tr).created_at.substr(0,11) }}</vs-td>
              <vs-td class="text-center">{{ tr.document_status.name }}</vs-td>
            </vs-tr>
          </template>
        </vs-table>
      </vs-col>
    </vs-row>

    <popup-excel-download
      v-model="showExcelDownload"
      :list="excelList"
      title="산업재해/무재해"/>

    <popup-approval-process
      v-model="approvalLine"
      :show-popup="showApprovalLinePopup"
      @closePopup="handleCloseApprovalPopup" />
  </div>
</template>

<script>
import DateSelector from '../../../../components/selector/DateSelector'
import SearchNav from '@/components/nav/SearchNav'
import SearchNavItemDate from '@/components/nav/SearchNavItemDate'
import SearchNavItemKeyword from '@/components/nav/SearchNavItemKeyword'
import SearchNavItemSelect from '@/components/nav/SearchNavItemSelect'
import PopupExcelDownload from '@/popup/PopupExcelDownload'
import PopupApprovalProcess from '@/views/approval/PopupApprovalProcess'
import SearchNavItemProject from '@/components/nav/SearchNavItemProject'

export default {
  name: 'accidentReportList',
  components: {
    SearchNavItemProject,
    PopupApprovalProcess,
    PopupExcelDownload,
    SearchNavItemSelect, SearchNavItemKeyword, SearchNavItemDate, SearchNav, DateSelector},
  data () {
    return {
      rootPath: '', // 프로젝트의 rootPath

      // 검색 네비게이션
      nav: {
        projectId:'',
        dateTarget:'created_at',
        dateTargettList: [
          {text:'재해일', value:'content$preview.disaster_date'},
          {text:'사고확정일', value:'content$accident_date'},
          {text:'작성일', value:'created_at'},
        ],
        date: ['', ''],
        keyword: '',
        accident: '',
        accidentList: [
          {text:'전체', value:''},
          {text:'미정', value:'none'},
          {text:'사고', value:'accident'},
          {text:'경미재해', value:'minor_disaster'},
          {text:'통신사고', value:'communication'},
          {text:'OEM사고', value:'oem'},
          {text:'불승인', value:'disapproved'},
          {text:'확정건', value:'confirmed_case'},
          {text:'업무상', value:'business_damage'},
          {text:'질병', value:'disease'}
        ],
        orderTarget:'created_at',
        orderDirection:'desc'

      },

      approvalLine: [],
      showExcelDownload: false,
      showApprovalLinePopup: false,
      popupActive: false,
      table: {
        list: [],
        perPage: 7,
        keyword: ''
      },
      currentPage: 1,
      listAll:[]
    }
  },

  computed: {
    excelList () {
      const list = []
      for (const data of this.listAll) {
        list.push({
          'No.': data.post.id,
          '현장명': this.getPreview(data).field_name,
          '구분': this.getAccidentType(this.getPreview(data).accidentType),
          '직종': this.getWorkType(this.getPreview(data).workType),
          '상해명': this.getDiseaseName(this.getPreview(data).disease_name),
          '재해자': this.getPreview(data).victim_name,
          '파트너사': this.getPreview(data).biz_p_name,
          '관리감독자': this.getPreview(data).supervisor,
          '재해일': this.getPreview(data).disaster_date,
          '작성일': data.created_at.substr(0, 11)
        })
      }
      return list
    }
  },

  created () {
    const paths = this.$route.path.split('/')
    this.rootPath = `/${paths[1]}/${paths[2]}`

    this.loadPostList()
  },

  methods: {
    // 현장 개요 불러오기
    async loadPostList () {
      const projectId = this.$route.params.proj_id
      const boardId = 22
      const boardSlug = 'industrial_accident'
      const page = this.currentPage
      const perPage = 30
      const dateTarget = []
      const dateBegin = []
      const dateEnd = []
      const orderTarget = this.nav.orderTarget
      const orderDirection = this.nav.orderDirection
      const keyword = []
      if (this.nav.dateTarget) dateTarget.push(this.nav.dateTarget)
      if (this.nav.date[0]) dateBegin.push(this.nav.date[0])
      if (this.nav.date[1]) dateEnd.push(this.nav.date[1])
      if (this.nav.accident) keyword.push(`content$preview.accidentType*${this.nav.accident}`)
      if (this.nav.keyword) keyword.push(`content$preview.field_name*${this.nav.keyword}`)

      await this.$store.dispatch('approval/LOAD_POST_ALL', {
        boardSlug,
        projectId,
        page,
        keyword,
        dateTarget, dateBegin, dateEnd,
        perPage, orderTarget, orderDirection
      })
      this.table.list = this.$store.state.approval.postListInfo.data
    },
    // 현장 개요 불러오기
    async loadPostListAll () {
      const projectId = this.$route.params.proj_id
      const boardId = 22
      const boardSlug = 'industrial_accident'
      const page = 1
      const perPage = 10000
      const dateTarget = []
      const dateBegin = []
      const dateEnd = []
      const orderTarget = this.nav.orderTarget
      const orderDirection = this.nav.orderDirection
      const keyword = []
      if (this.nav.dateTarget) dateTarget.push(this.nav.dateTarget)
      if (this.nav.date[0]) dateBegin.push(this.nav.date[0])
      if (this.nav.date[1]) dateEnd.push(this.nav.date[1])
      if (this.nav.accident) keyword.push('content$preview.accidentType')
      if (this.nav.keyword) keyword.push(`content$preview.field_name*${this.nav.keyword}`)

      await this.$store.dispatch('approval/LOAD_POST_ALL', {
        boardSlug,
        projectId,
        page,
        keyword,
        dateTarget, dateBegin, dateEnd,
        perPage, orderTarget, orderDirection
      })
      this.listAll = JSON.parse(JSON.stringify(this.$store.state.approval.postListInfo.data))
      await this.loadPostList()
    },
    getPreview (data) {
      if (data.post.preview) {
        const preview = JSON.parse(data.post.preview)
        return preview
      }
    },
    getContent (data) {
      if (data.post) {
        const content = data.post
        return content
      }
    },
    getAccidentType (type_key) {

      const type = []
      type['none'] = '미정'
      type['accident'] = '사고'
      type['minor_disaster'] = '경미재해'
      type['communication'] = '통신사고'
      type['oem'] = 'OEM사고'
      type['disapproved'] = '불승인'
      type['confirmed_case'] = '확정건'
      type['business_damage'] = '업무상'
      type['disease'] = '질병'

      return type[type_key]
    },
    getWorkType (type_key) {
      const type = []
      type['wood|carpenter'] = '[목공]도목수'
      type['wood|architecture'] = '[목공]건축목공'
      type['wood|concrete'] = '[목공]형틀목공'
      type['wood|window'] = '[목공]창호목공'
      type['steel|bar_bender'] = '[철근공]철근공'
      type['normal,service|special'] = '[용역/일반공]특별인부'
      type['normal,service|male'] = '[용역/일반공]보통인부(잡부-남)'
      type['normal,service|female'] = '[용역/일반공]보통인부(잡부-여)'

      return type[type_key]
    },
    getDiseaseName (type_key) {
      const type = []
      type['bruise'] = '타박상'
      type['sprain'] = '염좌'
      type['dislocation'] = '탈구'
      type['fracture'] = '골절'
      type['abrasion'] = '찰과상'
      type['cut'] = '절상'
      type['stab'] = '자상'
      type['sunstroke'] = '일사병'
      type['concussion'] = '뇌진탕'
      type['laceration'] = '열상'
      type['heart_attack'] = '심장마비'
      type['muscle_strain'] = '근육좌상'
      type['chronic_disease'] = '지병'
      type['hack'] = '창상'

      return type[type_key]
    },

    handleSearch () {
      this.currentPage = 1
      this.loadPostList()
    },
    handleItemClickDetail (data) {
      this.$emit('handleClickItem', 'report', data.post.id)
    },

    handleSort (key, type) {
      if (key) {
        this.nav.orderTarget = key
        this.nav.orderDirection = type
        this.loadPostList()
      }

    },
    handleClickAdd () {
      this.$emit('handleClickRegister', 'report')
    },

    async excelDownFunc () {
      await this.loadPostListAll()
      this.showExcelDownload = true
    },

    handleClickApprovalLine () {
      this.showApprovalLinePopup = true
    },
    handleCloseApprovalPopup () {
      this.showApprovalLinePopup = false
    }
  }
}
</script>

<style scoped>

</style>
