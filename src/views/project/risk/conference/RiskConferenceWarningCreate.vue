<template>
  <div>
    <vs-row :class="getClasses">
      <vs-col style="position: relative">
        <vx-card style="width:calc(100% - 40px)">
          <vs-row class="mb-8">
            <vs-col class="w-full flex " vs-justify="flex-end">
              <vs-button class="mr-4" color="secondary" type="border" @click="memberExcelDownload">참여자명단 서식</vs-button>
              <vs-button class="mr-4" color="secondary" type="border" @click="handleBackMenu">목록</vs-button>
              <vs-button class="mr-4" color="secondary" @click="handleClickRegister" >임시저장</vs-button>
            </vs-col>
          </vs-row>
          <!-- 기본정보 -->
          <vs-row class="mb-4">
            <vs-col><h5><i class="dot"></i>기본정보</h5></vs-col>
          </vs-row>
          <vs-row class="mb-8">
            <vs-col class="flex flex-wrap" >
              <vs-row class="w-1/2 px-4 mb-4 flex" vs-align="center">
                <vs-col class="w-3/12">{{ $t('project.risk.conference.warning.create.현장명') }}</vs-col>
                <vs-col class="w-9/12"><ml-input class="w-full" :value="projectInfo.field_name" :readonly="true"/></vs-col>
              </vs-row>
              <vs-row class="w-1/2 px-4 mb-4 flex" vs-align="center">
                <vs-col class="w-3/12 title">대상기간</vs-col>
                <vs-col class="w-9/12"><ml-input class="w-full" v-model="form.date" /></vs-col>
              </vs-row>
              <vs-row class="w-1/2 px-4 mb-4 flex" vs-align="center">
                <vs-col class="w-3/12">작성자</vs-col>
                <vs-col class="w-9/12"><ml-input class="w-full" v-model="form.writer" :readonly="true"/></vs-col>
              </vs-row>
            </vs-col>
          </vs-row>

          <!-- 회의내용 -->
          <vs-row class="mb-4">
            <vs-col><h5><i class="dot"></i>회의내용</h5></vs-col>
          </vs-row>
          <vs-row class="mb-8">
            <vs-col class="flex flex-wrap" >
              <vs-row class="w-1/2 px-4 mb-4 flex" vs-align="center">
                <vs-col class="w-3/12" >회의일</vs-col>
                <vs-col class="w-9/12"><date-selector class="popup-fixed w-full" v-model="form.meetingDate"></date-selector></vs-col>
              </vs-row>
              <vs-row class="w-1/2 px-4 mb-4 flex" vs-align="center">
                <vs-col class="w-3/12">회의장소</vs-col>
                <vs-col class="w-9/12"><ml-input class="w-full" v-model="form.meetingPlace"/></vs-col>
              </vs-row>
              <vs-row class="w-1/2 px-4 mb-4 flex" vs-align="start">
                <vs-col class="w-3/12 pt-2 pr-2">전회 미결사항 및 우수사례 피드백</vs-col>
                <vs-col class="w-9/12"><ml-textarea rows="4" class="w-full" v-model="form.prevPassIssue"/></vs-col>
              </vs-row>
              <vs-row class="w-1/2 px-4 mb-4 flex" vs-align="start">
                <vs-col class="w-3/12 pt-2 pr-2">건의 및 전달사항</vs-col>
                <vs-col class="w-9/12"><ml-textarea rows="4" class="w-full" v-model="form.relayComment"/></vs-col>
              </vs-row>
              <vs-row class="w-1/2 px-4 mb-4 flex" vs-align="start">
                <vs-col class="w-3/12 pt-2 pr-2">경영자 검토</vs-col>
                <vs-col class="w-9/12"><ml-textarea rows="4" class="w-full" v-model="form.leaderReview"/></vs-col>
              </vs-row>
              <vs-row class="w-1/2 px-4 mb-4 flex" vs-align="start">
                <vs-col class="w-3/12 pt-2 pr-2">위험요인 추가</vs-col>
                <vs-col class="w-9/12"><ml-textarea rows="4" class="w-full" v-model="form.addRisk"/></vs-col>
              </vs-row>
            </vs-col>
          </vs-row>

          <!-- 첨부파일 -->
          <file-upload-module v-model="fileList"></file-upload-module>


        </vx-card>

        <div style="position: absolute; top: 0px; right: 0px; bottom:0; z-index:20;">
          <label class="toggle-btn" @click="onClickToggleSide">
            <feather-icon v-if="this.toggleSide" icon="ChevronRightIcon" style="width:18px; height:18px;"/>
            <feather-icon v-else icon="ChevronLeftIcon" style="width:18px; height:18px;"/>
          </label>
        </div>
      </vs-col>
      <vs-col style="min-width:220px;">
        <approval-process-module
          :board = "board"
          :commentabled="!(board.isCompleteApproval || board.savable)"

          @handleClickUpload="handleClickUpload"
          @handleSendApprovalProcess = "handleSendApprovalProcess"
        ></approval-process-module>
      </vs-col>
    </vs-row>

    <!-- TODO : 얼럿데이터 -->
    <popup-alert v-model="alert.show" :message="alert.message" :buttons="alert.buttons" @upload="alertUpload"/>
  </div>
</template>

<script>
import ApprovalProcessModule from '@/views/modules/ApprovalProcessModule'
import PopupAlert from '@/popup/PopupAlert'
import FileUploadModule from '@/views/modules/FileUploadModule'
import DateSelector from '@/components/selector/DateSelector'
import WarningLvSelector from '@/components/selector/WarningLvSelector'
import OrderNumberSelectModule from '@/views/modules/OrderNumberSelectModule'
import MemberSelector from '@/components/selector/MemberSelector'
import AutoCompletionTextField from '@/components/AutoCompletionTextField'
import CompanySelector from '@/components/selector/CompanySelector'
import DisasterTypeSelector from '@/components/DisasterTypeSelector'
import KPagination from '@/components/kPagination/kPagination'
import RiskAssessmentEvalTableList from '@/views/project/risk/assessment/components/RiskAssessmentEvalTableList'
export default {
  name: 'RiskConferenceWarningCreate',
  components: {
    RiskAssessmentEvalTableList,
    KPagination,
    DisasterTypeSelector,
    CompanySelector,
    AutoCompletionTextField,
    MemberSelector,
    OrderNumberSelectModule,
    WarningLvSelector,
    DateSelector,
    FileUploadModule,
    PopupAlert,
    ApprovalProcessModule},
  computed: {
    projectInfo () {
      return this.$store.state.project.projectInfo
    },

    memberAll () {
      const memberAll = []
      for (const member of this.$store.state.project.projectUserList) {
        memberAll.push({text:member.name, value:member.id})
      }

      return memberAll
    },
    getClasses () {
      if (this.toggleSide) {
        return 'fix-grid'
      }
      return 'hide-grid'
    }
  },
  data () {
    return {
      boardSlug: 'risk_evaluation_association',

      // TODO : 글쓰기 정보 및 권한
      board:{
        slug:'risk_evaluation_association',
        statusCode: '', // 문서 상태코드
        writer: {}, //작성자 정보
        turnApprovalId: 0, // 결재자 ID
        readonly: false, // 읽기전용인가
        isWriter: true, // 작성자인가
        savable: true, // 임시저장이 가능하나
        isCompleteApproval: false, // 결재완료된 문서인가
        isTurnApproval: false, // 결재할 차례인가
        approvalLine:[], // 결재라인
        commentList:[] // 댓글리스트
      },

      // TODO : 얼럿데이터
      alert:{
        show:false,
        message:'결재하시겠습니까?',
        buttons:[
          { label:'승인', action:'ok' },
          { label:'취소', action:'cancel' }
        ]
      },
      approvalLine:[], // 결재선 등록

      lastPage: 1,
      currentPage: 1,
      popupActive:false,
      form:{
        project_title:'', //현장명
        writer:'', //작성자
        orderNumberId:'', //차수
        orderNumber:'', //차수
        date:'', //대상기간
        sdate:'',
        edate:'',
        local:'',

        meetingDate:'', //회의일
        meetingPlace:'', //회의장소
        prevPassIssue:'', //전회 미결사항 및 우수 사례 피드백
        relayComment:'', //건의 및 전달사항
        leaderReview:'', //경영자 검토
        addRisk:'', //위험요인 추가

        evalList:[], //위험성평가 (정기위험성평가)

        // preview
        preview: {
          title: '',
          meetingType:'', //회의구분
          meetingDate:'', //회의일
          meetingPlace:'' //회의장소
        }
      },
      evalAllCheck:false,
      evalList:[],
      evalListTable: {
        list:[],
        currentPage:1,
        lastPage:1,
        perPage:5
      },
      fileList:[],

      oldForm:{},

      toggleSide: true

    }

  },

  mounted () {
    const backButtonRouteGuard = this.$router.beforeEach((to, from, next) => {

      if (JSON.stringify(this.oldForm) === JSON.stringify(this.form)) {
        next(true)
      } else if (confirm('저장하지 않은 데이터는 삭제됩니다. 닫으시겠습니까?')) {
        next(true)
      }

    })
    this.$once('hook:destroyed', () => {
      backButtonRouteGuard()
    })
  },

  async created () {
    // 초기화
    await this.init()
    await this.loadProjectMember()
  },
  methods:{

    onClickToggleSide () {
      this.toggleSide = !this.toggleSide
    },
    async loadProjectMember () {
      const page = 1
      const perPage = 10000
      const projectId = this.$route.params.proj_id

      await this.$store.dispatch('project/LOAD_PROJECT_USER', {
        page,
        perPage,
        projectId
      })
    },

    back () {
      this.$router.back()
    },

    async init () {
      await this.$store.dispatch('USER_INFO')
      this.board.writer = {
        id: this.$store.state.auth.userInfo.id,
        name: this.$store.state.auth.userInfo.name,
        company_id: this.$store.state.auth.userInfo.company_id,
        company_name: this.$store.state.auth.userInfo.company_name
      }

      const company = this.$store.state.project.projectInfo.constructor_company
      this.form.writer = this.board.writer.name
      this.form.project_title = this.$store.state.project.projectInfo.field_name
      this.form.company = (company) ? company.com_name : ''
      const wStart = this.$store.state.project.projectInfo.date_work_start
      const wCompleteEx = this.$store.state.project.projectInfo.date_complete_expected
      if (wStart && wCompleteEx) {
        this.form.date = `${wStart.substr(0, 10)} ~ ${wCompleteEx.substr(0, 10)}`
      } else {
        this.form.date = ''
      }

      this.oldForm = JSON.parse(JSON.stringify(this.form))
    },

    async register (isUploaded) {
      if (isUploaded && (!this.approvalLine || this.approvalLine.length === 0)) {
        alert('결재선을 지정해주세요')
        return
      }

      // 등록정보
      const projectId = this.$route.params.proj_id
      const boardSlug = this.boardSlug
      const title = this.projectInfo.field_name
      const approvalLine = JSON.stringify(this.lineToSendLine(this.approvalLine))
      const security = 'normal' // 문서보안 등급 ['일반', 대외비 1급, 대외비 2급, 인비, 극비] [normal,confidential1,confidential2,personally,confidential0]
      const priority = 'medium' // 문서 중요도 [매우낮음, 낮음, 보통, 높음, 매우 높음] [lowest,low,medium,high,highest]
      let uploads = ''
      const listUploads = []
      const uploadFileIds = []

      if (this.fileList.length > 0) {
        for (const file of this.fileList) {
          listUploads.push(file)
          uploadFileIds.push(file.id)
        }
        uploads = JSON.stringify(uploadFileIds)
      }

      // 리스트 노출 정보
      this.form.project_title = title
      this.form.company = this.projectInfo.constructor_company.com_name
      this.form.preview.title = this.form.project_title
      this.form.preview.meetingType = this.form.meetingType
      this.form.preview.meetingDate = this.form.meetingDate
      this.form.preview.meetingPlace = this.form.meetingPlace
      this.form.preview.writer = this.form.writer

      this.form.evalList = this.evalList
      const content = JSON.stringify(this.form)


      try {
        if (isUploaded) {
          // 바로 상신하기
          await this.$store.dispatch('approval/CREATE_POST', {projectId, boardSlug, title, content, approvalLine, security, priority, uploads})
          this.oldForm = JSON.parse(JSON.stringify(this.form))
          alert('상신되었습니다.')
          this.back()
        } else {
          // 임시 저장하기
          const isTemp = 1
          await this.$store.dispatch('approval/CREATE_POST', {projectId, boardSlug, title, content, approvalLine, security, priority, isTemp, uploads})
          this.oldForm = JSON.parse(JSON.stringify(this.form))
          alert('임시저장되었습니다.')
          this.back()
        }

      } catch (e) {
        if (this.$store.state.approval.error_data.title) {
          alert('현장명이 없습니다')
        } else {
          console.log(this.$store.state.approval.error_code)
        }
      }


      //this.back()

    },

    popupActiveSync () {
      this.popupActive = false
    },

    addEval (company, place, work_sdate, work_edate, work_type, risk, grade, safety) {
      this.evalList.push({
        is_checked: false, //선택
        company, //파트너사
        place, //장소/위치
        work_sdate, //작업시간 - 시작시간
        work_edate, //작업시간 - 종료시간
        work_type, //대상공종
        risk, //위험요인
        grade, //등급
        safety, //안전대책
        leader_checked: false, //안전보건부서장, 점검항목
        processor_1: { sdate: '', edate: '' }, // , //파트너사
        processor_2: { name:'' }, //시공사
        processor_3: { name:''} //안전팀 담당
      })

      this.makeTable()
    },
    addEvalEmpty () {
      this.addEval('', '', '', '', '', '', '', '')
    },
    changeEvalAllCheck () {
      for (const data of this.evalList) {
        data.is_checked = this.evalAllCheck
      }
    },

    handleClickRemoveEval () {
      for (let i = 0; i < this.evalList.length; i++) {
        if (this.evalList[i].is_checked) {
          this.evalList.remove(this.evalList[i])
          i = -1
        }
      }
      this.makeTable()
    },
    handleClickAddEval () {
      this.addEvalEmpty()
    },
    handleEvalChangeChecked () {
      let count = 0
      for (const data of this.evalList) {
        if (data.is_checked === true) {
          count++
        }
      }
      this.evalAllCheck = (Number(count) === Number(this.evalList.length))
    },
    handleShowTemplatePopup () {
      this.popupActive = true
    },
    handleBackMenu () {
      this.$emit('handleBackMenu', 'warning')
    },
    memberExcelDownload () {

    },


    // TODO : 얼럿데이터
    alertUpload () {
      this.register(true)
    },

    // TODO : 결재프로세스
    // ApprovalProcessModule 에서 사용하는 line 방식에서 전송용 line 으로 변경
    lineToSendLine (data) {
      const approvalList = []

      for (const member of data) {
        if (member.type_code !== 'register') {
          approvalList.push({
            id : member.user_id,
            name : member.user_name,
            elementType : member.type_code
          })
        }
      }

      return approvalList
    },

    handleClickRegister () {
      if (confirm('저장하시겠습니까?')) {
        this.register(false)
      }
    },

    handleClickUpload () {
      this.alert.buttons = [
        { label:'상신', action:'upload' },
        { label:'취소', action:'cancel', type:'border' }
      ]
      this.alert.show = true

    },

    handleSendApprovalProcess (process) {
      this.approvalLine = process
    },

    handleChangeOrderNumber (data) {
      if (this.form.orderNumber !== data.order_number) {

        this.form.orderNumberId = data.id
        this.form.orderNumber = data.order_number
        this.form.sdate = data.begin_ymd.substr(0, 10)
        this.form.edate = data.end_ymd.substr(0, 10)
        this.form.date = `${this.form.sdate} ~ ${this.form.edate}`

        // 정기위험성평가 불러오기
        //this.loadRiskAssessmentRegular()
      }
    },

    async loadRiskAssessmentRegular () {
      const boardSlug = 'periodical_risk'
      const page = 1
      const perPage = 100
      const projectId = this.$route.params.proj_id
      const projectOrder = this.form.orderNumber
      await this.$store.dispatch('approval/LOAD_POST_COMPLETE', {boardSlug, page, perPage, projectId, projectOrder})

      const list = this.$store.state.approval.list
      this.evalList = []
      for (const data of list) {
        const strContent = data.post.post_content
        const content = JSON.parse(strContent)
        const evalList = content.evalList

        for (const evaldata of evalList) {
          //마지막 라인이 최종 결정된 위험등급이다.
          this.evalList.push({
            is_checked:false,
            work_unit:evaldata.work_unit,
            work_order:evaldata.work_order,
            risk_factor:evaldata.risk_factor,
            safety_measures:evaldata.safety_measures,
            warningLv:evaldata.warningLv,
            disaster_type:evaldata.disaster_type,
            manager:evaldata.manager,

            person_in_charge:evaldata.head, // 담당자:정
            deputy_head:'' // 담당자:부
          })
        }
      }


      this.makeTable()
    },

    makeTable () {

      const lastPage = this.evalList.length > 0 ? (Math.floor((this.evalList.length - 1) / this.evalListTable.perPage)) + 1 : 1
      this.evalListTable.lastPage = lastPage

      for (let i = 0; i < this.evalList.length; i++) {
        const page = Math.floor(i / this.evalListTable.perPage) + 1
        this.evalList[i].is_show = (page === this.evalListTable.currentPage)
      }
    },

    onChangePagination (page) {
      this.evalListTable.currentPage = page

      this.makeTable()
    }
  }
}
</script>
<style scoped>
[dir] ul.table.table-disaster > li {
  grid-template-columns: 60px 1fr 1fr 1fr 1fr 1fr 80px;
}
</style>

<style lang="scss" scoped>
.fix-grid {
  display: grid !important;
  grid-template-columns: 9fr 3fr;
}
.hide-grid {
  display: grid !important;
  grid-template-columns: 9fr 0px;
}
.toggle-btn {
  padding: 0.5rem !important;
  height: 100%;
  width: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  background-color: lightgray;
  color:#fff;
}
</style>
<style>
.con-vs-tabs .con-slot-tabs {
  overflow: initial;
}
</style>

