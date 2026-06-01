<template>
  <div>
    <vs-row :class="getClasses" id="print-report">
      <vs-col style="position: relative">
        <vx-card style="width:calc(100% - 40px)" :style="isPrint ? {width: '100%', boxShadow: 'none', borderRadius: '0'} : {}">
          <vs-row class="mb-8">
            <vs-col v-if="!isPrint" class="mb-6 flex" vs-justify="flex-end">
              <vs-button class="mr-4" color="secondary" @click="handlePrint">인쇄</vs-button>
              <vs-button class="mr-4" color="secondary" type="border" @click="handleBackMenu">목록</vs-button>
              <vs-button v-if="board.savable" class="mr-4" color="secondary" @click="handleClickUpdate">임시저장</vs-button>
              <vs-button v-if="board.savable && isUpdateMode" class="mr-4" color="secondary" type="border" @click="handleDeletePost">삭제</vs-button>
              <vs-button v-if="board.collection" class="" color="secondary" @click="handleClickCollection">결재 문서 회수</vs-button>
              <vs-button v-if="board.resend" class="ml-2" color="secondary" @click="handleClickRegister">임시저장 후 재상신</vs-button>
            </vs-col>

            <!-- 기본정보 -->
            <vs-row class="mb-4">
              <vs-col><h5><i class="dot"></i>기본정보</h5></vs-col>
            </vs-row>
            <vs-col class="w-1/2 px-4  flex flex-wrap">
              <vs-row class="mb-4" style="display: grid; grid-template-columns: 110px 1fr;" vs-align="center">
                <vs-col class="title">공종명</vs-col>
                <vs-col>
                  <span v-if="isPrint">{{form.processType}}</span>
                  <ml-input v-else class="w-full" v-model="form.processType" :readonly="board.readonly"/>
                </vs-col>
              </vs-row>
              <vs-row class="mb-4" style="display: grid; grid-template-columns: 110px 1fr;" vs-align="center">
                <vs-col class="title">평가일시</vs-col>
                <vs-col>
                  <span v-if="isPrint">{{form.evaluation_date}}</span>
                  <date-selector v-else class="w-full"  v-model="form.evaluation_date" :readonly="board.readonly"/>
                </vs-col>
              </vs-row>
              <vs-row class="mb-4" style="display: grid; grid-template-columns: 110px 1fr;" vs-align="center">
                <vs-col class="title">평가장소</vs-col>
                <vs-col>
                  <span v-if="isPrint">{{form.location}}</span>
                  <ml-input v-else class="w-full" v-model="form.location" :readonly="board.readonly"/>
                </vs-col>
              </vs-row>
              <vs-row class="mb-4" style="display: grid; grid-template-columns: 110px 1fr;" vs-align="center">
                <vs-col class="title">현장명</vs-col>
                <vs-col>
                  <span v-if="isPrint">{{projectInfo.field_name}}</span>
                  <ml-input v-else class="w-full" :value="projectInfo.field_name" :readonly="true"/>
                </vs-col>
              </vs-row>
              <vs-row class="mb-4" style="display: grid; grid-template-columns: 110px 1fr;" vs-align="center">
                <vs-col class="title">대상기간</vs-col>
                <vs-col v-if="isPrint"><span>{{form.begin_ymd}} - {{form.end_ymd}}</span></vs-col>
                <vs-col v-else style="display: grid; grid-template-columns: 1fr 40px 1fr">
                  <date-selector v-model="form.begin_ymd" :readonly="board.readonly"/>
                  <span class="flex" style="align-items: center; justify-content: center;">~</span>
                  <date-selector v-model="form.end_ymd" :readonly="board.readonly"/>
                </vs-col>
              </vs-row>
            </vs-col>
            <vs-col class="w-1/2 px-4 flex flex-wrap">
              <vs-row class="mb-4" style="display: grid; grid-template-columns: 110px 1fr;" vs-align="center">
                <vs-col class="title">평가작업명</vs-col>
                <vs-col>
                  <span v-if="isPrint">{{form.workName}}</span>
                  <ml-input v-else class="w-full" v-model="form.workName" :readonly="board.readonly"/>
                </vs-col>
              </vs-row>
              <vs-row class="mb-4" style="display: grid; grid-template-columns: 110px 1fr;" vs-align="center">
                <vs-col class="title">평가자</vs-col>
                <vs-col>
                  <span v-if="isPrint">{{form.workChecker}}</span>
                  <ml-input v-else class="w-full" v-model="form.workChecker" :readonly="board.readonly"/>
                </vs-col>
              </vs-row>
              <vs-row class="mb-4" style="display: grid; grid-template-columns: 110px 1fr;" vs-align="center">
                <vs-col class="title">소속</vs-col>
                <vs-col>
                  <span v-if="isPrint">{{form.company}}</span>
                  <ml-input v-else class="w-full" v-model="form.company" :readonly="true"/>
                </vs-col>
              </vs-row>
              <vs-row class="mb-4" style="display: grid; grid-template-columns: 110px 1fr;" vs-align="center">
                <vs-col class="title">작성자</vs-col>
                <vs-col>
                  <span v-if="isPrint">{{form.writer}}</span>
                  <ml-input v-else class="w-full" v-model="form.writer" :readonly="true"/>
                </vs-col>
              </vs-row>
              <vs-row class="mb-4" style="display: grid; grid-template-columns: 110px 1fr;" vs-align="center">
                <vs-col class="title">예정공정표 첨부</vs-col>
                <vs-col>
                  <span v-if="isPrint"></span>
                  <file-uploader v-else class="w-full" v-model="form.attach" :readonly="board.readonly"></file-uploader>
                </vs-col>
              </vs-row>
            </vs-col>
          </vs-row>

          <!-- 평가서 내용 -->
          <vs-row class="my-4">
            <vs-col class="flex" vs-align="center">
              <h5><i class="dot"></i>위험성평가표</h5>
              <vs-col v-if="!isPrint" class="w-auto ml-auto">
                <vs-button class="mr-4" color="secondary" type="border" @click="handleClickAddEval">항목추가</vs-button>
                <vs-button class="mr-4" color="secondary" @click="handleClickRemoveEval">선택삭제</vs-button>
              </vs-col>
            </vs-col>
          </vs-row>

          <vs-row class="border mb-8" style="display: grid;">
            <vs-col style="overflow-x: auto">
              <ul class="table table-disaster">
                <li :style="isPrint ? {gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr'} : {}">
                  <span v-if="!isPrint" class="title" ><vs-checkbox v-model="evalAllCheck"
                                                   @change="changeEvalAllCheck"></vs-checkbox></span>
                  <span class="title">평가구분</span>
                  <span class="title">유해·위험요인</span>
                  <span class="title">재해형태</span>
                  <span class="title">관련법근거</span>
                  <span class="title">현재 안전보건조치</span>
                  <span class="title">
                    빈도
                    <vx-tooltip title="빈도란?" :html="'자세한 정보를 보시려면<br>느낌표ⓘ 아이콘을 클릭하세요'"
                                style="margin-left:4px; display: flex; align-items: center; justify-content: center;"
                                position="top" delay=".1s">
                      <feather-icon icon="AlertCircleIcon"
                                    style="cursor: pointer; width:16px;"
                                    @click="onClickToolTip('빈도')"
                      />
                    </vx-tooltip>
                  </span>
                  <span class="title">
                    강도
                    <vx-tooltip title="강도란?" :html="'자세한 정보를 보시려면<br>느낌표ⓘ 아이콘을 클릭하세요'"
                                style="margin-left:4px; display: flex; align-items: center; justify-content: center;"
                                position="top" delay=".1s">
                      <feather-icon icon="AlertCircleIcon"
                                    style="cursor: pointer; width:16px;"
                                    @click="onClickToolTip('강도')"
                      />
                    </vx-tooltip>
                  </span>
                  <span class="title" style="min-width:100px">
                    위험도
                    <vx-tooltip title="위험도이란?" :html="'자세한 정보를 보시려면<br>느낌표ⓘ 아이콘을 클릭하세요'"
                                style="margin-left:4px; display: flex; align-items: center; justify-content: center;"
                                position="top" delay=".1s">
                      <feather-icon icon="AlertCircleIcon"
                                    style="cursor: pointer; width:16px;"
                                    @click="onClickToolTip('위험도')"
                      />
                    </vx-tooltip>
                  </span>
                  <span class="title">No.</span>
                  <span class="title">위험감소대책</span>
                </li>

                <risk-assessment-eval-table-list2 :key="i" v-for="(data, i) in evalList"
                                                  v-if="evalList[i].is_show"
                                                  v-model="evalList[i]"
                                                  :isPrint="isPrint"
                                                  :readonly="board.readonly"
                                                  :one-head="true"
                                                  @handleChangeChecked="handleEvalChangeChecked"
                ></risk-assessment-eval-table-list2>

              </ul>
            </vs-col>
          </vs-row>

          <div v-if="!isPrint" class="vs-con-table">
            <div class="con-pagination-table vs-table--pagination">
              <k-pagination
                :total="lastPage"
                v-model="currentPage"
                @change="onChangePagination"
              ></k-pagination>
            </div>
          </div>

          <!-- 파일첨부 -->
          <vs-row v-if="!isPrint" class="mb-4">
            <file-upload-module class="w-full" v-model="fileList"></file-upload-module>
          </vs-row>

        </vx-card>

        <div v-if="!isPrint" style="position: absolute; top: 0px; right: 0px; bottom:0; z-index:20;">
          <label class="toggle-btn" @click="onClickToggleSide">
            <feather-icon v-if="this.toggleSide" icon="ChevronRightIcon" style="width:18px; height:18px;"/>
            <feather-icon v-else icon="ChevronLeftIcon" style="width:18px; height:18px;"/>
          </label>
        </div>
      </vs-col>
      <vs-col style="min-width:220px;">
        <approval-process-module
          :board = "board"
          :isPrint="isPrint"
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
      @handleSendApprovalProcess="handleSendApprovalProcess"
      @handleItemClickDetail="handleItemClickDetail"
    ></popup-std-safety-work-process>


    <popup-image-info v-model="showImageInfo" :image-name="imageInfoValue"/>

    <!-- TODO : 얼럿데이터 -->
    <popup-alert v-model="alert.show"
                 :is-confirm="alert.isConfirm"
                 :html="alert.html"
                 :message="alert.message"
                 :buttons="alert.buttons"

                 @upload="alertUpload"
                 @ok="alertOk"
                 @no="alertNo"
                 @print="alertPrint"
    ></popup-alert>
  </div>
</template>

<script>
import PopupStdSafetyWorkProcess from '@/views/project/popup/PopupStdSafetyWorkProcess'
import ApprovalProcessModule from '@/views/modules/ApprovalProcessModule'
import FileUploader from '@/components/FileUploader'
import RiskAssessmentEvalTableList from '@/views/project/risk/assessment/components/RiskAssessmentEvalTableList'
import PopupAlert from '@/popup/PopupAlert'
import OrderNumberSelectModule from '@/views/modules/OrderNumberSelectModule'
import KPagination from '@/components/kPagination/kPagination'
import DateSelector from '@/components/selector/DateSelector'
import RiskAssessmentEvalTableList2 from '@/views/project/risk/assessment/components/RiskAssessmentEvalTableList2'
import FileUploadModule from '@/views/modules/FileUploadModule'
import PopupImageInfo from '@/views/project/popup/PopupImageInfo'

export default {
  name: 'RiskAssessmentWrite',
  components: {
    PopupImageInfo,
    FileUploadModule,
    RiskAssessmentEvalTableList2,
    DateSelector,
    KPagination,
    OrderNumberSelectModule,
    PopupAlert,
    RiskAssessmentEvalTableList,
    FileUploader,
    ApprovalProcessModule,
    PopupStdSafetyWorkProcess
  },
  props: {
    isUpdateMode: Boolean,
    boardId: Number,
    boardSlug: String,
    tagKey: String
  },
  computed: {
    projectInfo () {
      return this.$store.state.project.projectInfo
    },
    locale () {
      return this.$i18n.locale
    },
    disasterList () {
      const list = this.$store.state.approval.disasterTypeList
      const returnList = []
      for (const item of list) {
        returnList.push({
          text:item.name,
          value:item.id
        })
      }
      return returnList
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
      // TODO : 글쓰기 정보 및 권한
      board: {
        slug: this.boardSlug,
        statusCode: '', // 문서 상태코드
        writer: {}, //작성자 정보
        turnApprovalId: 0, // 결재자 ID
        readonly: false, // 읽기전용인가
        isWriter: true, // 작성자인가
        savable: true, // 임시저장이 가능하나
        isCompleteApproval: false, // 결재완료된 문서인가
        isTurnApproval: false, // 결재할 차례인가
        approvalLine: [], // 결재라인
        commentList: [] // 댓글리스트
      },

      // TODO : 얼럿데이터
      alert: {
        show: false,
        message: '결재하시겠습니까?',
        buttons: [
          {
            label: '승인',
            action: 'ok'
          },
          {
            label: '취소',
            action: 'cancel'
          }
        ]
      },
      approvalLine: [], // 결재선 등록
      isPrint: false,

      lastPage: 1,
      currentPage: 1,
      perPage: 4,
      popupActive: false,

      project_title: '', //현장명
      company: '', //파트너사
      form: {
        created_at: new Date().format('yyyy-MM-dd'),
        project_title: '', //현장명
        writer: '', //작성자
        processType: '', //공종명
        workName: '', //평가작업명
        workChecker: '', //평가자
        evaluation_date: '', // 평가일시
        subProcessType: '', //세부공종
        company: '', //파트너사
        orderNumberId: '', //차수
        orderNumber: '', //차수
        attach: {}, //첨부
        date: '', //대상기간
        begin_ymd: '', //대상기간 시작일
        end_ymd: '', //대상기간 종료일
        evalList: [], //위험성평가

        // preview
        preview: {
          title: '',
          company: '',
          processType: '',
          orderNumber: '',
          created_at: '',
          writer: '',
          begin_ymd: '', //대상기간 시작일
          end_ymd: '', //대상기간 종료일
          approvalState: ''
        },

        summary: {
          disaster: []
        }
      },
      fileList: [],
      evalAllCheck: false,
      evalList: [],


      oldForm: {},
      oldEvalList: [],

      showImageInfo: false,
      imageInfoValue: '빈도',

      toggleSide: true
    }

  },

  mounted () {
    const backButtonRouteGuard = this.$router.beforeEach((to, from, next) => {

      if (JSON.stringify(this.oldForm) === JSON.stringify(this.form)
        && JSON.stringify(this.oldEvalList) === JSON.stringify(this.evalList)) {
        next(true)
      } else if (confirm('저장하지 않은 데이터는 삭제됩니다. 닫으시겠습니까?')) {
        next(true)
      }

    })
    this.$once('hook:destroyed', () => {
      backButtonRouteGuard()
    })
  },
  created () {
    if (this.isUpdateMode) {
      this.loadPost()
    } else {
      this.init()
    }
  },
  methods: {
    onClickToggleSide () {
      this.toggleSide = !this.toggleSide
    },
    getDisasterName (value) {
      for (const disaster of this.disasterList) {
        if (`${disaster.value}` === `${value}`) {
          return disaster.text
        }
      }
      return ''
    },

    back () {
      this.$router.back()
    },

    async init () {
      if (this.$store.state.auth.userInfo === null) {
        await this.$store.dispatch('USER_INFO')
      }
      this.board.writer = {
        id: this.$store.state.auth.userInfo.id,
        name: this.$store.state.auth.userInfo.name,
        company_id: this.$store.state.auth.userInfo.company_id,
        company_name: this.$store.state.auth.userInfo.company_name
      }
      await this.$store.dispatch('company/LOAD_COMPANY', {companyId: this.board.writer.company_id})
      this.board.writer.company_name = this.$store.state.company.companyInfo.com_name
      this.form.writer = this.board.writer.name
      this.form.company = this.board.writer.company_name

      this.oldForm = JSON.parse(JSON.stringify(this.form))
      this.oldEvalList = JSON.parse(JSON.stringify(this.evalList))
    },


    async loadPost () {
      const boardSlug = this.boardSlug
      const postId = this.$route.params.postId
      await this.$store.dispatch('approval/LOAD_POST', {
        boardSlug,
        postId
      })

      if (!this.$store.state.approval.postInfo) {
        alert('열람 권한이 없습니다.')
        this.oldForm = this.form
        this.$router.back()
        return
      }
      const post = JSON.parse(this.$store.state.approval.postInfo.post_content)
      this.form = post
      this.form.created_at = new Date().format('yyyy-MM-dd')

      // 파일첨부
      const files = this.$store.state.approval.postInfo.post_attachment
      if (files) {
        for (const file of files) {
          this.fileList.push({
            id: file.id,
            fileName: file.file_name,
            fileSize: file.file_size,
            path: file.path,
            thumb: file.thumb
          })
        }
      }

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

      this.evalList = this.form.evalList

      this.oldForm = JSON.parse(JSON.stringify(this.form))
      this.oldEvalList = JSON.parse(JSON.stringify(this.evalList))
      //this.addEvalEmpty()

      this.makeTable()
      this.updateLastPage()
    },

    async register (_isTemp) {

      if (_isTemp && (!this.approvalLine || this.approvalLine.length === 0)) {
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

      // 리스트 노출 정보
      this.form.project_title = title
      this.form.preview.title = this.form.project_title
      this.form.preview.company = this.form.company
      this.form.preview.processType = this.form.processType
      this.form.preview.writer = this.form.writer
      this.form.preview.begin_ymd = this.form.begin_ymd
      this.form.preview.end_ymd = this.form.end_ymd
      this.form.evalList = this.evalList

      // 첨부파일
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

      const disaster = []
      this.disasterList.map(data => {
        const key = data.text
        disaster.push( {[key]: 0} )
      })

      if (this.evalList.length > 0) {
        this.evalList.map(value => {
          const disaster_text = value.disaster
          let i;
          for (i=0; i<disaster.length; i++) {
            const keys = Object.keys(disaster[i])
            if (keys.length > 0) {
              if (keys[0] === this.getDisasterName(disaster_text)) {
                disaster[i][keys[0]] += 1
                break;
              }
            }
          }
        })
      }

      let i;
      for (i=0; i<disaster.length; i++) {
        const keys = Object.keys(disaster[i])
        if (keys.length > 0) {
          if (disaster[i][keys[0]] === 0) {
            disaster.splice(i, 1);
            i--;
          }
        }
      }

      if (!this.form.summary) {
        this.form.summary = {
          disaster
        }
      } else {
        this.form.summary.disaster = disaster
      }

      this.form.date = this.form.evaluation_date
      const content = JSON.stringify(this.form)

      try {
        if (this.isUpdateMode) {
          const postId = this.$route.params.postId

          if (_isTemp) {
            // 바로 상신하기
            const unTemp = 'y'

            await this.$store.dispatch('approval/UPDATE_POST', {boardSlug, postId, title, content, approvalLine, projectId, uploads, unTemp})
            alert('상신되었습니다.')
            this.oldForm = JSON.parse(JSON.stringify(this.form))
            this.$router.back()
          } else {
            // 임시 저장하기
            const unTemp = 'n'
            await this.$store.dispatch('approval/UPDATE_POST', {boardSlug, postId, title, content, approvalLine, projectId, uploads, unTemp})
            alert('임시저장되었습니다.')
            this.oldForm = JSON.parse(JSON.stringify(this.form))
            this.$router.back()
          }
        } else {

          if (_isTemp) {
            // 바로 상신하기
            await this.$store.dispatch('approval/CREATE_POST', {boardSlug, title, content, approvalLine, security, priority, uploads, projectId})
            alert('상신되었습니다.')

            this.oldForm = JSON.parse(JSON.stringify(this.form))
            this.$router.back()
          } else {
            // 임시 저장하기
            const isTemp = 1
            await this.$store.dispatch('approval/CREATE_POST', {boardSlug, title, content, approvalLine, security, priority, projectId, uploads, isTemp})
            alert('임시저장되었습니다.')

            this.oldForm = JSON.parse(JSON.stringify(this.form))
            this.$router.back()
          }
        }


      } catch (e) {
        if (this.$store.state.approval.error_data.title) {
          alert('현장명이 없습니다')
        } else {
        }
      }
    },

    popupActiveSync () {
      this.popupActive = false
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
    handleBackMenu () {
      this.$emit('handleBackMenu', this.tagKey)
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


    // TODO : 얼럿데이터
    alertUpload () {
      this.register(true)
    },

    async alertOk () {
      this.form.evalList = this.evalList

      // 리스트 노출 정보
      this.form.preview.title = this.form.project_title
      this.form.preview.company = this.form.company
      this.form.preview.processType = this.form.processType
      this.form.preview.orderNumber = this.form.orderNumber
      this.form.preview.writer = this.form.writer
      this.form.preview.approvalState = '결재상태'
      const content = JSON.stringify(this.form)


      const postId = this.$route.params.postId
      await this.$store.dispatch('approval/APPROVE_OK', {
        postId,
        content
      })
      this.oldForm = JSON.parse(JSON.stringify(this.form))
      this.oldEvalList = JSON.parse(JSON.stringify(this.evalList))
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
      this.oldEvalList = JSON.parse(JSON.stringify(this.evalList))
      document.location.reload()
    },

    // TODO : 결재프로세스
    // ApprovalProcessModule 에서 사용하는 line 방식에서 전송용 line 으로 변경
    lineToSendLine (data) {
      const approvalList = []

      for (const member of data) {
        if (member.type_code !== 'register') {
          approvalList.push({
            id: member.user_id,
            name: member.user_name,
            elementType: member.type_code
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
        {
          label: '상신',
          action: 'upload'
        },
        {
          label: '취소',
          action: 'cancel',
          type: 'border'
        }
      ]
      this.alert.show = true
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

    handleSendApprovalProcess (process) {
      this.approvalLine = process
    },

    handleItemClickDetail (data) {
      const unit_task = data.unit_task.name
      const work_flow = data.work_flow
      const work_risk = data.work_risk
      const work_safety_measure = data.work_safety_measure

      this.addEval(unit_task, work_flow, work_risk, work_safety_measure, 'A', '')
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
      const perPage = this.isPrint ? 1000 : this.perPage;
      for (let i = 0; i < this.evalList.length; i++) {
        const page = Math.floor(i / perPage) + 1
        this.evalList[i].is_show = (page === this.currentPage)
      }
    },

    updateLastPage () {
      this.lastPage = this.evalList.length > 0 ? (Math.floor((this.evalList.length - 1) / this.perPage)) + 1 : 1
    },

    onChangePagination (page) {
      this.currentPage = page

      this.makeTable()
    },

    onClickToolTip (value) {
      this.imageInfoValue = value
      if (value === '빈도') {
        this.showImageInfo = true
      }
      if (value === '강도') {
        this.showImageInfo = true
      }
      if (value === '위험도') {
        this.showImageInfo = true
      }
    },

    alertPrint () {
      this.print()
    },

    print () {
      this.isPrint = true
      this.makeTable();
      setTimeout(() => {
        var g_oBeforeBody = document.getElementById('print-report').innerHTML
        // 프린트를 보이는 그대로 나오기위한 셋팅
        window.onbeforeprint = function (ev) {
          document.body.innerHTML = g_oBeforeBody
        }
        window.print()
        location.reload()
      }, 300)
    },

    handlePrint () {
      this.alert.html = '<p>인쇄후 페이지가 새로고침됩니다. 저장하지 않은 데이터는 삭제 됩니다</p><p>인쇄하시겠습니까?</p>'
      this.alert.message = ''
      this.alert.isConfirm = false
      this.alert.buttons = [
        { label: '인쇄', action: 'print' },
        { label: '취소', action: 'cancel', type: 'border' }
      ]
      this.alert.show = true
    }
  }
}
</script>
<style>


</style>
<style scoped>
[dir] ul.table.table-disaster > li {
  grid-template-columns: 60px minmax(150px, 1fr) minmax(150px, 1fr) minmax(150px, 1fr) minmax(150px, 1fr) minmax(150px, 1fr) 80px 80px 80px 80px minmax(150px, 1fr);
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
