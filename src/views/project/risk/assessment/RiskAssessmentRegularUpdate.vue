<template>
  <div>
    <vs-row>
      <vs-col class="w-9/12">
        <vx-card>
          <vs-row class="mb-8">
            <vs-col class="mb-6 flex" vs-justify="flex-end">
              <vs-button class="mr-4" color="secondary" type="border" @click="handleBackMenu">목록</vs-button>
              <vs-button class="w-1/2 ml-2" color="secondary" v-if="board.savable" @click="handleClickUpdate">임시저장</vs-button>
              <vs-button v-if="board.resend" class="ml-2" color="secondary" @click="handleClickRegister">임시저장 후 재상신</vs-button>
              <vs-button v-if="this.board.savable" class="mr-2" color="secondary" type="border" @click="handleDeletePost">삭제</vs-button>
            </vs-col>

            <!-- 기본정보 -->
            <vs-row class="mb-4">
              <vs-col><h5><i class="dot"></i>기본정보</h5></vs-col>
            </vs-row>
            <vs-col class="w-1/2 px-4  flex flex-wrap">
              <vs-row class="mb-4" style="display: grid; grid-template-columns: 110px 1fr;" vs-align="center">
                <vs-col class="title">현장명</vs-col>
                <vs-col>
                  <ml-input class="w-full" :value="projectInfo.field_name" :readonly="true"/>
                </vs-col>
              </vs-row>
              <vs-row class="mb-4" style="display: grid; grid-template-columns: 110px 1fr;" vs-align="center">
                <vs-col class="title">위치/장소</vs-col>
                <vs-col>
                  <ml-input class="w-full" v-model="form.location"/>
                </vs-col>
              </vs-row>
              <vs-row class="mb-4" style="display: grid; grid-template-columns: 110px 1fr;" vs-align="center">
                <vs-col class="title">대상공종</vs-col>
                <vs-col>
                  <ml-input class="w-full" v-model="form.processType" :readonly="board.readonly"/>
                </vs-col>
              </vs-row>
              <vs-row class="mb-4" style="display: grid; grid-template-columns: 110px 1fr;" vs-align="center">
                <vs-col class="title">세부공종</vs-col>
                <vs-col>
                  <ml-input class="w-full" v-model="form.subProcessType" :readonly="board.readonly"/>
                </vs-col>
              </vs-row>
              <vs-row class="mb-4" style="display: grid; grid-template-columns: 110px 1fr;" vs-align="center">
                <vs-col class="title">대상기간</vs-col>
                <vs-col style="display: grid; grid-template-columns: 1fr 40px 1fr">
                  <date-selector v-model="form.begin_ymd"/>
                  <span class="flex" style="align-items: center; justify-content: center;">~</span>
                  <date-selector v-model="form.end_ymd"/>
                </vs-col>
              </vs-row>
            </vs-col>
            <vs-col class="w-1/2 px-4 flex flex-wrap">
              <vs-row class="mb-4" style="display: grid; grid-template-columns: 110px 1fr;" vs-align="center">
                <vs-col class="title">차수</vs-col>
                <vs-col>
                  <order-number-select-module class="w-full" :use-zero="true" v-model="form.orderNumber"
                                              :readonly="board.readonly" @handleChange="handleChange"/>
                </vs-col>
              </vs-row>
              <vs-row class="mb-4" style="display: grid; grid-template-columns: 110px 1fr;" vs-align="center">
                <vs-col class="title">작성일</vs-col>
                <vs-col>
                  <date-selector class="w-full" v-model="form.created_at" :readonly="true"/>
                </vs-col>
              </vs-row>
              <vs-row class="mb-4" style="display: grid; grid-template-columns: 110px 1fr;" vs-align="center">
                <vs-col class="title">소속</vs-col>
                <vs-col>
                  <ml-input class="w-full" v-model="form.company" :readonly="true"/>
                </vs-col>
              </vs-row>
              <vs-row class="mb-4" style="display: grid; grid-template-columns: 110px 1fr;" vs-align="center">
                <vs-col class="title">작성자</vs-col>
                <vs-col>
                  <ml-input class="w-full" v-model="form.writer" :readonly="true"/>
                </vs-col>
              </vs-row>
              <vs-row class="mb-4" style="display: grid; grid-template-columns: 110px 1fr;" vs-align="center">
                <vs-col class="title">예정공정표 첨부</vs-col>
                <vs-col>
                  <file-uploader class="w-full" v-model="form.attach" :readonly="board.readonly"></file-uploader>
                </vs-col>
              </vs-row>
            </vs-col>
          </vs-row>

          <!-- 평가서 내용 -->
          <vs-row class="my-4">
            <vs-col class="flex" vs-align="center">
              <h5><i class="dot"></i>정기 위험성평가</h5>
              <vs-col
                v-if="board.isWriter"
                class="w-auto ml-auto">
                <vs-button class="mr-4" color="secondary" type="border" @click="handleClickAddEval">항목추가</vs-button>
                <vs-button class="mr-4" color="secondary" @click="handleClickRemoveEval">선택삭제</vs-button>
              </vs-col>
            </vs-col>
          </vs-row>

          <vs-row class="border mb-8">
            <vs-col>
              <ul class="table table-disaster">
                <li>
                  <span class="title"><vs-checkbox v-model="evalAllCheck"
                                                   @change="changeEvalAllCheck"></vs-checkbox></span>
                  <span class="title">단위공정</span>
                  <span class="title">위험요인</span>
                  <span class="title">재해형태</span>
                  <span class="title">안전보건대책</span>
                  <span class="title">위험등급</span>
                </li>

                <risk-assessment-eval-table-list :key="`eval_${i}`" v-for="(data, i) in evalList"
                                                 v-if="evalList[i].is_show"
                                                 v-model="evalList[i]"
                                                 :readonly="board.readonly"
                                                 :warningLvList="warningLvList"
                                                 :one-head="true"
                                                 @handleChangeChecked="handleEvalChangeChecked"
                ></risk-assessment-eval-table-list>

                <risk-assessment-eval-table-list :key="`readonly_eval_${i}`" v-for="(data, i) in readonlyEvalList"
                                                 v-if="readonlyEvalList[i].is_show"
                                                 v-model="readonlyEvalList[i]"
                                                 :readonly="true"
                                                 :warningLvList="warningLvList"
                                                 :one-head="true"
                                                 @handleChangeChecked="handleEvalChangeChecked"
                ></risk-assessment-eval-table-list>

              </ul>
            </vs-col>
          </vs-row>

          <div class="vs-con-table">
            <div class="con-pagination-table vs-table--pagination">
              <k-pagination
                :total="lastPage"
                v-model="currentPage"
                @change="onChangePagination"
              ></k-pagination>
            </div>
          </div>

        </vx-card>
      </vs-col>
      <vs-col class="w-3/12 pl-6">
        <approval-process-module
          :board = "board"
          :commentabled="!(board.isCompleteApproval || board.savable)"

          @handleClickUpload="handleClickUpload"
          @handleClickOk="handleClickOk"
          @handleClickNo="handleClickNo"
          @handleSendApprovalProcess = "handleSendApprovalProcess"
        ></approval-process-module>
      </vs-col>

    </vs-row>

    <popup-std-safety-work-process
      :popupActive="popupActive"
      @popupActiveSync="popupActiveSync"
      @handleItemClickDetail="handleItemClickDetail"
    ></popup-std-safety-work-process>

    <!-- TODO : 얼럿데이터 -->
    <popup-alert v-model="alert.show"
                 :is-confirm="alert.isConfirm"
                 :html="alert.html"
                 :message="alert.message"
                 :buttons="alert.buttons"

                 @ok="alertOk"
                 @no="alertNo"
    ></popup-alert>
  </div>
</template>

<script>
import ApprovalProcessModule from '@/views/modules/ApprovalProcessModule'
import DateSelector from '@/components/selector/DateSelector'
import PopupAlert from '@/popup/PopupAlert'
import FileUploader from '@/components/FileUploader'
import PopupStdSafetyWorkProcess from '@/views/project/popup/PopupStdSafetyWorkProcess'
import OrderNumberSelectModule from '@/views/modules/OrderNumberSelectModule'
import WarningLvSelector from '@/components/selector/WarningLvSelector'
import AutoCompletionTextField from '@/components/AutoCompletionTextField'
import CompanySelector from '@/components/selector/CompanySelector'
import DisasterTypeSelector from '@/components/DisasterTypeSelector'
import KPagination from '@/components/kPagination/kPagination'
import RiskAssessmentEvalTableList from '@/views/project/risk/assessment/components/RiskAssessmentEvalTableList'
export default {
  name: 'RiskAssessmentRegularUpdate',
  components: {
    RiskAssessmentEvalTableList,
    KPagination,
    DisasterTypeSelector,
    CompanySelector,
    AutoCompletionTextField,
    WarningLvSelector,
    OrderNumberSelectModule,
    PopupStdSafetyWorkProcess,
    FileUploader,
    PopupAlert,
    DateSelector,
    ApprovalProcessModule
  },
  computed:{
    projectInfo () {
      return this.$store.state.project.projectInfo
    },
    locale () {
      return this.$i18n.locale
    },
    isConstruct () {
      return this.locale === 'ko_construct' || this.locale === 'en_construct'
    },
    warningLvList () {
      if (this.isConstruct) {
        return [
          {text:'A', value:'A'},
          {text:'B', value:'B'},
          {text:'C', value:'C'}
        ]
      } else {
        return [
          {text:'AE', value:'AE'},
          {text:'A', value:'A'},
          {text:'B', value:'B'},
          {text:'C', value:'C'}
        ]
      }
    },
    memberAll () {
      const memberAll = []
      for (const member of this.$store.state.project.projectUserList) {
        memberAll.push({text:member.name, value:member.id})
      }

      return memberAll
    },

    joinComTable () {
      const join = []
      for (const company of this.$store.state.project.projectInfo.company) {
        join.push({text:company.com_name, value:company.id})
      }
      return join
    }
  },
  data () {
    return {
      boardSlug: 'periodical_risk',

      // TODO : 글쓰기 정보 및 권한
      board:{
        slug:'periodical_risk',
        statusCode: '', // 문서 상태코드
        writer: {}, //작성자 정보
        turnApprovalId: 0, // 결재자 ID
        readonly: false, // 읽기전용인가
        resend: false, // 재등록 가능한가
        isWriter: true, // 작성자인가
        savable: true, // 임시저장이 가능하나
        collection: true, // 문서 회수가 가능하나
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

      lastPage: 1,
      currentPage: 1,
      perPage:4,
      hideStdSafetyProc: false,

      popupActive:false,
      form :{
        project_title:'', //현장명
        writer:'', //작성자
        processType:'', //대상공종
        company:'', //파트너사
        orderNumberId:'', //차수
        orderNumber:'', //차수
        attach:{}, //첨부
        date:'', //대상기간
        sdate:'',
        edate:'',
        issueList:[], // 위험평가서 이슈 리스트
        evalList:[], //위험성평가서 작성 리스트

        preview:{
          title:'',
          company:'',
          processType:'',
          orderNumber:'',
          sdate:'',
          writer:'',
          status:''
        }
      },
      readonlyEvalList: [],
      evalAllCheck: false,
      evalList: [],
      oldForm:{}
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

    // 전체 참여 인원
    await this.loadMemberAll()

    await this.loadPost()
    this.oldForm = JSON.parse(JSON.stringify(this.form))
  },
  methods:{

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
      await this.$store.dispatch('company/LOAD_COMPANY', {companyId:this.board.writer.company_id})
      this.board.writer.company_name = this.$store.state.company.companyInfo.com_name
    },
    async loadPost () {
      const boardSlug = this.boardSlug
      const postId = this.$route.params.postId
      await this.$store.dispatch('approval/LOAD_POST', {boardSlug, postId})

      if (!this.$store.state.approval.postInfo) {
        alert('열람 권한이 없습니다.')
        this.oldForm = this.form
        this.$router.back()
        return
      }
      const post = JSON.parse(this.$store.state.approval.postInfo.post_content)
      this.form = post

      // TODO : 결재프로세스
      await this.$store.dispatch('USER_INFO')
      const myId = this.$store.state.auth.userInfo.id
      const doc = this.$store.state.approval.document
      this.board.statusCode = doc.status.code
      this.board.writer = doc.writer
      this.board.turnApprovalId = doc.turn_approval_id
      this.board.isWriter = (this.board.writer.id === myId)
      this.board.isTurnApproval = (this.board.turnApprovalId === myId && (this.board.statusCode === 'registered' || this.board.statusCode === 'ongoing'))
      this.board.readonly = !((this.board.isWriter && (this.board.statusCode === 'temp' || this.board.statusCode === 'rejected')) || this.board.isTurnApproval)
      this.board.resend = (this.board.isWriter && this.board.statusCode === 'rejected')
      this.board.isCompleteApproval = (this.board.statusCode === 'approved' || this.board.statusCode === 'rejected')
      this.board.savable = this.board.isWriter && (this.board.statusCode === 'temp')
      this.board.collection = this.board.isWriter && (this.board.statusCode === 'registered')
      this.board.approvalLine = doc.line.slice() // 모듈 표기용
      this.approvalLine = doc.line.slice() // api 전송용

      if (this.board.isWriter) {
        this.evalList = this.form.evalList
      } else {
        this.readonlyEvalList = this.form.evalList
      }

      this.oldForm = JSON.parse(JSON.stringify(this.form))
      this.oldEvalList = JSON.parse(JSON.stringify(this.evalList))
      //this.addEvalEmpty()

      this.makeTable()
      this.updateLastPage()

    },

    async register (isUploaded) {


      if (isUploaded && (!this.approvalLine || this.approvalLine.length === 0)) {
        alert('결재선을 지정해주세요')
        return
      }
      if (!this.form.orderNumber) {
        alert('차수를 선택하세요.')
        return
      }

      // 등록정보
      const boardSlug = this.boardSlug
      const postId = this.$route.params.postId
      const title = this.form.project_title
      const approvalLine = JSON.stringify(this.lineToSendLine(this.approvalLine))
      const projectId = this.$route.params.proj_id
      const projectOrderId = this.form.orderNumberId

      // 리스트 노출 정보
      this.form.preview.title = this.form.project_title
      this.form.preview.company = this.form.company
      this.form.preview.processType = this.form.processType
      this.form.preview.orderNumber = this.form.orderNumber
      this.form.preview.date = this.form.date
      this.form.preview.writer = this.form.writer
      this.form.evalList = this.evalList
      const content = JSON.stringify(this.form)

      try {
        if (isUploaded) {
          // 바로 상신하기
          const unTemp = 'y'
          await this.$store.dispatch('approval/UPDATE_POST', {boardSlug, postId, title, content, approvalLine, projectId, projectOrderId, unTemp})
          alert('상신되었습니다.')
          this.oldForm = JSON.parse(JSON.stringify(this.form))
          this.back()
        } else {
          // 임시 저장하기
          const unTemp = 'n'
          await this.$store.dispatch('approval/UPDATE_POST', {boardSlug, postId, title, content, approvalLine, projectId, projectOrderId, unTemp})
          alert('임시저장되었습니다.')
          this.oldForm = JSON.parse(JSON.stringify(this.form))
          this.back()
        }

      } catch (e) {
        if (this.$store.state.approval.error_data.title) {
          alert('현장명이 없습니다')
        } else {
        }
      }


      //this.back()

    },
    async reRegister (isUploaded) {
      if (isUploaded && (!this.approvalLine || this.approvalLine.length === 0)) {
        alert('결재선을 지정해주세요')
        return
      }

      // 등록정보
      const boardSlug = this.boardSlug
      const postId = this.$route.params.postId
      const title = this.projectInfo.field_name
      const approvalLine = JSON.stringify(this.lineToSendLine(this.approvalLine))
      const security = 'normal' // 문서보안 등급 ['일반', 대외비 1급, 대외비 2급, 인비, 극비] [normal,confidential1,confidential2,personally,confidential0]
      const priority = 'medium' // 문서 중요도 [매우낮음, 낮음, 보통, 높음, 매우 높음] [lowest,low,medium,high,highest]
      const projectId = this.$route.params.proj_id
      const projectOrderId = this.form.orderNumberId

      // 리스트 노출 정보
      this.form.project_title = title
      this.form.preview.title = this.form.project_title
      this.form.preview.company = this.form.company
      this.form.preview.processType = this.form.processType
      this.form.preview.orderNumber = this.form.orderNumber
      this.form.preview.date = this.form.date
      this.form.preview.writer = this.form.writer
      this.form.evalList = this.evalList
      const content = JSON.stringify(this.form)


      try {
        if (isUploaded) {
          // 바로 상신하기
          await this.$store.dispatch('approval/UPDATE_POST', {boardSlug, postId, title, content, approvalLine, security, priority, projectId, projectOrderId})
          alert('상신되었습니다.')
          this.oldForm = JSON.parse(JSON.stringify(this.form))
          this.back()
        } else {
          // 임시 저장하기
          const isTemp = 1
          await this.$store.dispatch('approval/UPDATE_POST', {boardSlug, postId, title, content, approvalLine, security, priority, projectId, projectOrderId, isTemp})
          alert('임시저장되었습니다.')
          this.oldForm = JSON.parse(JSON.stringify(this.form))
          this.back()
        }

      } catch (e) {
        if (this.$store.state.approval.error_data.title) {
          alert('현장명이 없습니다')
        } else {
        }
      }
    },

    async loadMemberAll () {
      const page = 1
      const perPage = 100
      const projectId = this.$route.params.proj_id
      await this.$store.dispatch('project/LOAD_PROJECT_USER', {page, perPage, projectId})
    },

    popupActiveSync () {
      this.popupActive = false
    },

    // 이슈추가
    addIssue (id, work_img, work_type, work_unit, risk_factor, safety_measures, work_space, work_sdate, work_edate) {
      const issue = {
        is_checked: false,
        id,
        work_img, // 표준절차 작업사진
        work_type, // 표준절차 대상공종
        work_unit, // 표준절차 소공종
        risk_factor, // 표준절차 위험요인
        safety_measures, // 표준절차 안전보건대책
        work_space, // 장소/위치
        work_sdate, // 작업 시작시간
        work_edate, // 작업 종료시간
        contents:[]  // 작업일지
      }

      const _company = this.board.writer.company_name
      const _risk_factor = ''
      const _safety_measures = ''
      const _warningLv = 'A'
      const _writer = this.$store.state.auth.userInfo.name
      const _processor_1 = {user_name:'', sdate:'', edate:''}
      const _processor_2 = ''
      const _work_document = ''
      this.addContentForIssue(issue, _company, _risk_factor, _safety_measures, _warningLv, _writer, _processor_1, _processor_2, _work_document)

      this.form.issueList.push(issue)
    },
    handleClickAddEval () {
      this.addEvalEmpty()
    },

    handleClickAddIssue () {
      this.addIssue(2, '', '', '', '', '', '', '', '')
    },

    // 이슈에 코멘트 추가
    addContentForIssue (issue, company, risk_factor, safety_measures, warningLv, writer, processor_1, processor_2, work_document) {
      issue.contents.push({
        company, // 파트너사
        risk_factor, // 위험요인
        safety_measures, // 안전보건대책
        warningLv, // 위험도
        writer, // 작성자
        processor_1, // 조치자 (파트너사) 저장방식 -> "id|sdate|edate"
        processor_2, // 조치자 (시공사)
        work_document //작업허가서
      })
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
    handleClickRemoveIssue () {
      for (let i = 0; i < this.form.issueList.length; i++) {
        if (this.form.issueList[i].is_checked) {
          this.form.issueList.remove(this.form.issueList[i])
          i = -1
        }
      }
    },
    handleShowTemplatePopup () {
      this.popupActive = true
    },
    handleBackMenu () {
      this.$emit('handleBackMenu', 'regular')
    },
    handleHideStdSafetyProc () {
      this.hideStdSafetyProc = !this.hideStdSafetyProc
    },

    handleClickUpdate () {
      if (confirm('저장하시겠습니까?')) {
        this.register(false)
      }
    },

    handleClickCollection () {
      if (confirm('회수 후 임시저장 상태로 변경하시겠습니까?')) {
        this.register(false)

      }
    },

    handleClickRegister () {
      if (confirm('임시저장 하시겠습니까?')) {
        this.reRegister(false)
      }
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

    isCompleteApproval () {
      return (this.line[this.line.length - 1].status_id === 2)
    },
    handleSendApprovalProcess (approvalLine) {
      this.approvalLine = approvalLine
      this.board.approvalLine = approvalLine
    },
    handleClickNo () {
      this.alert.html = '<p>반려하시겠습니까?</p><p>아래에 사유를 작성해주세요.</p>'
      this.alert.message = ''
      this.alert.isConfirm = true
      this.alert.buttons = [
        { label:'반려', action:'no' },
        { label:'취소', action:'cancel', type:'border' }
      ]
      this.alert.show = true
    },
    async handleClickOk () {
      this.alert.html = ''
      this.alert.message = '승인하시겠습니까?'
      this.alert.isConfirm = false
      this.alert.buttons = [
        { label:'승인', action:'ok' },
        { label:'취소', action:'cancel', type:'border' }
      ]
      this.alert.show = true

    },
    handleClickUpload () {
      if (confirm('상신하시겠습니까?')) {
        this.register(true)
      }
    },


    // TODO : 얼럿데이터
    async alertOk () {

      this.form.projectOrderId = this.form.orderNumberId

      // 리스트 노출 정보
      this.form.preview.title = this.form.project_title
      this.form.preview.company = this.form.company
      this.form.preview.processType = this.form.processType
      this.form.preview.orderNumber = this.form.orderNumber
      this.form.preview.writer = this.form.writer
      this.form.preview.approvalState = '결재상태'
      const content = JSON.stringify(this.form)

      const postId = this.$route.params.postId
      await this.$store.dispatch('approval/APPROVE_OK', {postId, content})

      this.oldForm = JSON.parse(JSON.stringify(this.form))
      document.location.reload()
    },

    async alertNo (text) {
      const postId = this.$route.params.postId
      const comment = text
      await this.$store.dispatch('approval/APPROVE_NO', {
        postId,
        comment
      })

      this.oldForm = JSON.parse(JSON.stringify(this.form))
      document.location.reload()
    },
    handleClickRemoveEval () {
      for (let i = 0; i < this.evalList.length; i++) {
        if (this.evalList[i].is_checked) {
          this.evalList.remove(this.evalList[i])
          i = -1
        }
      }

      this.evalAllCheck = false

      // 모든 항목을 삭제할경우 빈 항목을 추가한다.
      //if (this.evalList.length === 0) {
      //  this.addEvalEmpty()
      //}
      this.updateLastPage()

    },
    handleItemClickDetail (data) {
      const unit_task = data.unit_task.name
      const work_flow = data.work_flow
      const work_risk = data.work_risk
      const work_safety_measure = data.work_safety_measure

      this.addEval(unit_task, work_flow, work_risk, work_safety_measure, 'A', '')
    },

    handleChangeOrderNumber (data) {
      this.orderNumberId = data.id
      this.orderNumber = data.order_number
      this.form.sdate = data.begin_ymd.substr(0, 10)
      this.form.edate = data.end_ymd.substr(0, 10)
      this.form.date = `${this.form.sdate} ~ ${this.form.edate}`
    },

    // 글 삭제
    async handleDeletePost () {
      if (confirm('삭제하시겠습니까?')) {
        const boardSlug = this.boardSlug
        const postId = this.$route.params.postId
        await this.$store.dispatch('approval/DELETE_POST', {boardSlug, postId})
        this.oldForm = this.form
        this.$router.back()
      }
    },

    addEval (work_unit, work_flow, risk_factor, safety_measures, warningLv, disaster_type) {
      this.evalList.push({
        is_checked: this.evalAllCheck,
        is_show: false,
        work_unit,
        risk_factor,
        safety_measures: `${work_flow}\n${safety_measures}`,
        warningLv,
        disaster_type
      })

      this.makeTable()
      this.updateLastPage()
    },

    addEvalEmpty () {
      this.addEval('', '', '', '', '', '')
    },

    changeEvalAllCheck () {

      // 전체 페이지 체크
      for (const data of this.evalList) {
        data.is_checked = this.evalAllCheck
      }

      /* 현재 페이지만 체크
      for (let i = 0; i < this.evalList.length; i++) {
        const page = Math.floor(i / this.perPage) + 1
        if (page === this.currentPage) {
          this.evalList[i].is_checked = this.evalAllCheck
        }
      }*/
    },

    handleChange (data) {
      this.form.orderNumberId = data.id
      this.form.orderNumber = data.order_number
      if (data.begin_ymd) {
        this.form.date = `${data.begin_ymd.substr(0, 10)} ~ ${data.end_ymd.substr(0, 10)}`
        this.form.begin_ymd = data.begin_ymd
        this.form.end_ymd = data.end_ymd
      } else {
        this.form.date = `${this.projectInfo.date_work_start.substr(0, 10)} ~ ${this.projectInfo.date_complete.substr(0, 10)}`
        this.form.begin_ymd = this.projectInfo.date_work_start.substr(0, 10)
        this.form.end_ymd = this.projectInfo.date_complete.substr(0, 10)
      }
    },

    makeTable () {
      for (let i = 0; i < this.evalList.length; i++) {
        const page = Math.floor(i / this.perPage) + 1
        this.evalList[i].is_show = (page === this.currentPage)
      }
    },

    updateLastPage () {
      this.lastPage = this.evalList.length > 0 ? (Math.floor((this.evalList.length - 1) / this.perPage)) + 1 : 1
    },

    onChangePagination (page) {
      this.currentPage = page

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
