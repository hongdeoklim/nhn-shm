<template>
  <div class="w-full">
    <vs-row :class="getClasses" id="print-report">
      <vs-col style="position: relative">
        <vx-card style="width:calc(100% - 40px)" :style="isPrint ? {width: '100%', boxShadow: 'none', borderRadius: '0'} : {}">
          <div>
            <vs-row class="mb-4">
              <vs-col v-if="!isPrint" class="mb-6 flex" vs-justify="flex-end">
                <vs-button class="mr-4" color="secondary" @click="handlePrint">인쇄</vs-button>
                <vs-button v-if="board.savable" class="mr-4" color="secondary" type="border" @click="handleDeletePost">삭제</vs-button>
                <vs-button class="mr-4" color="secondary" type="border" @click="handleClickClose">닫기</vs-button>
                <vs-button v-if="board.savable" class="" color="secondary" @click="handleClickUpdate">임시저장</vs-button>
                <vs-button v-if="board.collection" class="" color="secondary" @click="handleClickCollection">결재 문서 회수</vs-button>
                <vs-button v-if="board.resend" class="" color="secondary" @click="handleClickRegister">임시저장 후 재상신</vs-button>
              </vs-col>
            </vs-row>

            <!-- 기본정보 -->
            <vs-row class="mb-8">
              <vs-col><h5><i class="dot"></i>기본정보</h5></vs-col>
            </vs-row>
            <vs-col class="flex flex-wrap mb-4">

              <vs-row class="w-1/2  mb-4 flex" vs-align="center">
                <vs-col class="w-4/12 title">현장명</vs-col>
                <vs-col class="w-8/12">
                  <span v-if="isPrint">{{ projectInfo.field_name }}</span>
                  <ml-input v-else class="w-full" :value="projectInfo.field_name" :readonly="true"/>
                </vs-col>
              </vs-row>
              <vs-row class="w-1/2  mb-4 flex" vs-align="center">
                <vs-col class="w-4/12 title pr-4" style="text-align: right">작성자</vs-col>
                <vs-col class="w-8/12">
                  <span v-if="isPrint">{{ form.writer }}</span>
                  <ml-input v-else class="w-full" v-model="form.writer" :readonly="true"/>
                </vs-col>
              </vs-row>


              <vs-row class="w-1/2  mb-4 flex" vs-align="center">
                <vs-col class="w-4/12 title">근무구분</vs-col>
                <vs-col class="w-8/12">
                  <span v-if="isPrint">{{ form.work_type }}</span>
                  <ml-input class="w-full" v-model="form.work_type" :readonly="board.readonly"/>
                </vs-col>
              </vs-row>
              <vs-row class="w-1/2  mb-4 flex" vs-align="center">
                <vs-col class="w-4/12 title pr-4" style="text-align: right">부서</vs-col>
                <vs-col class="w-8/12">
                  <span v-if="isPrint">{{ form.company }}</span>
                  <ml-input v-else lass="w-full" v-model="form.company" :readonly="true"/>
                </vs-col>
              </vs-row>

              <vs-row class="w-full  mb-4 flex" vs-align="center">
                <vs-col class="w-1/6 title">제목</vs-col>
                <vs-col class="w-5/6">
                  <span v-if="isPrint">{{ form.title }}</span>
                  <ml-input v-else class="w-full" v-model="form.title" :readonly="board.readonly"/>
                </vs-col>
              </vs-row>

            </vs-col>


            <!-- 점검계획 -->

            <vs-row class="my-4">
              <vs-col class="flex" vs-align="center">
                <h5><i class="dot"></i>점검계획</h5>
              </vs-col>
            </vs-row>
            <vs-row class="w-full  mb-4 flex" vs-align="center">
              <vs-col class="w-auto mr-4 title">점검계획일</vs-col>
              <vs-col class="w-auto mr-auto">
                <span v-if="isPrint">{{ form.check_date }}</span>
                <date-selector v-else class="w-full" v-model="form.check_date" :readonly="board.readonly"/>
              </vs-col>
              <vs-col v-if="!board.readonly && !isPrint" class="w-auto ml-auto">
                <vs-button class="mr-4" color="secondary" type="border" @click="handleClickAddPlan">+ 항목추가</vs-button>
                <vs-button color="secondary" type="border" @click="handleClickRemovePlan">- 항목삭제</vs-button>
              </vs-col>
              <vs-col v-else-if="!isPrint" class="w-auto ml-auto" style="display: flex; align-items: center; justify-content: end">
                <feather-icon icon="AlertCircleIcon" style=" width:16px; margin-right:8px;"/>
                <span>장비명을 클릭하여 점검결과를 입력 할 수 있습니다.</span>
              </vs-col>
            </vs-row>
            <vs-row class="border mb-8">
              <vs-col>
                <ul class="table  border-bottom" :class="board.readonly ? 'table-7' : 'table-8'">
                  <li>
                    <span class="title" v-if="!board.readonly" ><vs-checkbox v-model="planAllCheck"
                                                     @change="changePlanAllCheck"></vs-checkbox></span>
                    <span class="title">장비명</span>
                    <span class="title">규격</span>
                    <span class="title">관리번호</span>
                    <span class="title">모델명</span>
                    <span class="title">제조사</span>
                    <span class="title">안전인증일/<br>인증기관</span>
                    <span class="title">안전-정기 검사일/<br>검사기관</span>
                  </li>

                  <safety-equipment-plan-table-list :key="planIndex" v-for="(plan, planIndex) in plan_list"
                                                    :readonly="board.readonly"
                                                    :isPrint="isPrint"
                                                    :value="plan"
                                                    :selectIndex="planIndex"
                                                    @handleChangeChecked="handlePlanChangeChecked"
                                                    @handlePlanSelected="handlePlanSelected"
                  ></safety-equipment-plan-table-list>

                </ul>
              </vs-col>
            </vs-row>

            <!-- -->
            <file-upload-module v-if="!isPrint" class="w-full" v-model="fileList"></file-upload-module>

          </div>
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
          :board="board"
          :isPrint="isPrint"
          :commentabled="!(board.isCompleteApproval || board.savable)"

          @handleClickUpload="handleClickUpload"
          @handleClickOk="handleClickOk"
          @handleClickNo="handleClickNo"
          @handleSendApprovalProcess="handleSendApprovalProcess"
        ></approval-process-module>
      </vs-col>
    </vs-row>

    <!-- TODO : 얼럿데이터 -->
    <popup-alert v-model="alert.show"
                 :is-confirm="alert.isConfirm"
                 :html="alert.html"
                 :message="alert.message"
                 :buttons="alert.buttons"

                 @ok="alertOk"
                 @no="alertNo"
                 @upload="alertUpload"
                 @print="alertPrint"
    ></popup-alert>

    <popup-equipment-result
      :value="selectPlanDetail"
      :registerable="registerable"
      :popupActive="popupActive"
      @handleClickUploadDetail="handleClickUploadDetail"
      @popupActiveSync="popupActiveSync">
    </popup-equipment-result>
  </div>
</template>

<script>
import ApprovalProcessModule from '@/views/modules/ApprovalProcessModule'
import PopupAlert from '@/popup/PopupAlert'
import DateSelector from '@/components/selector/DateSelector'
import PopupEquipmentResult from '../../popup/PopupEquipmentResult'
import SafetyEquipmentPlanTableList from '@/views/project/safety/equipment/components/SafetyEquipmentPlanTableList'
import FileUploadModule from '@/views/modules/FileUploadModule'

export default {
  name: 'PlanUpdate',
  components: {
    FileUploadModule,
    SafetyEquipmentPlanTableList,
    PopupEquipmentResult,
    DateSelector,
    PopupAlert,
    ApprovalProcessModule
  },
  computed: {
    projectInfo () {
      return this.$store.state.project.projectInfo
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
      boardSlug: 'construction_equipment',
      boardId: '24',
      registerable:false,

      // TODO : 글쓰기 정보 및 권한
      board: {
        slug: 'construction_equipment',
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
      planAllCheck: false,
      approvalLine: [], // 결재선 등록


      table: {
        list: [],
        perPage: 7,
        keyword: ''
      },
      popupActive: false,

      form: {
        project_title: '',
        title: '',
        writer: '',
        work_type:'',
        company: '',
        check_date:'',
        plan_list: [],
        preview: {
          project_title: '',
          title: '',
          work_type:'',
          check_date: '',
          move_date: '',
          result_date: '',
          plan_list: []
        }
      },
      plan_list: [],
      selectPlanDetail:{},
      selectPlanIndex:'',
      afterId:'',
      oldForm:{},
      oldPlanList:[],
      fileList: [],

      toggleSide: true,
      isPrint: false,
    }
  },

  mounted () {
    const backButtonRouteGuard = this.$router.beforeEach((to, from, next) => {

      if (JSON.stringify(this.oldForm) === JSON.stringify(this.form)
        && JSON.stringify(this.oldPlanList) === JSON.stringify(this.plan_list)) {
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
    const paths = this.$route.path.split('/')
    this.rootPath = `/${paths[1]}/${paths[2]}`

    await this.loadPost()
  },

  methods: {
    onClickToggleSide () {
      this.toggleSide = !this.toggleSide
    },
    back () {
      this.$router.back()
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

      // 내용
      const post = this.$store.state.approval.postInfo
      this.form = JSON.parse(post.post_content)
      const afterList = this.$store.state.approval.postAfters

      //
      if (afterList.length > 0) {
        this.afterId = afterList[0].id
        const dataList = JSON.parse(afterList[0].after_content)
        for (let i = 0; i < dataList.data.length; i++) {
          const after = dataList.data[i]
          this.form.plan_list[i].after = after
        }
      } else {
        for (const plan of this.form.plan_list) {
          plan.after = {
            workPlan:[
              {
                check_list: '작업장의 지형,지반 사전조사 여부',
                check_result: '',
                action: ''
              },
              {
                check_list: '작업계획서 작성 적정여부',
                check_result: '',
                action: ''
              }
            ],
            driver:[
              {
                check_list: '운전원 면허 자격 여부(3톤 미만 소형건설기계 조종교육 이수...)',
                check_result: '',
                action: ''
              },
            ],
            safetyDevice:[
              {
                check_list: '버킷 유압커플러',
                check_result: '',
                action: ''
              },
              {
                check_list: '후진경보장치',
                check_result: '',
                action: ''
              }
            ],

            actionDate: '',
            actionResult: '',
            before:{},
            after:{}
          }
        }
      }


      const files = post.post_attachment
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

      this.plan_list = this.form.plan_list
      this.registerable = this.$store.state.approval.postInfo.author.id === this.$store.state.auth.userInfo.id

      // TODO : 결재프로세스
      await this.$store.dispatch('USER_INFO')
      const myId = this.$store.state.auth.userInfo.id
      const doc = this.$store.state.approval.document
      this.board.statusCode = doc.status.code
      this.board.writer = doc.writer
      this.board.turnApprovalId = doc.turn_approval_id
      this.board.isWriter = (this.board.writer.id === myId)
      this.board.isTurnApproval = (this.board.turnApprovalId === myId && (this.board.statusCode === 'registered' || this.board.statusCode === 'ongoing'))

      this.board.readonly = !(this.board.statusCode === 'temp' || this.board.statusCode === 'rejected')
      this.board.resend = (this.board.isWriter && this.board.statusCode === 'rejected')
      this.board.isCompleteApproval = (this.board.statusCode === 'approved' || this.board.statusCode === 'rejected')
      this.board.savable = this.board.isWriter && (this.board.statusCode === 'temp')
      this.board.collection = this.board.isWriter && (this.board.statusCode === 'registered')
      this.board.approvalLine = doc.line.slice() // 모듈 표기용
      this.approvalLine = doc.line.slice() // api 전송용

      this.oldForm = JSON.parse(JSON.stringify(this.form))
      this.oldPlanList = JSON.parse(JSON.stringify(this.plan_list))

    },

    async register (isUploaded) {
      if (isUploaded && (!this.approvalLine || this.approvalLine.length === 0)) {
        alert('결재선을 지정해주세요')
        return
      }

      // 등록정보
      const projectId = this.$route.params.proj_id
      const boardId = this.boardId
      const boardSlug = this.boardSlug
      const title = this.form.title
      const postId = this.$route.params.postId
      const approvalLine = JSON.stringify(this.lineToSendLine(this.approvalLine))

      for (const plan of this.plan_list) {
        plan.boardId = boardId
        plan.boardSlug = boardSlug
        plan.postId = postId
      }

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

      this.form.plan_list = this.plan_list

      // 리스트 노출 정보
      this.form.project_title = this.projectInfo.field_name
      this.form.preview.project_title = this.form.project_title
      this.form.preview.title = this.form.title
      this.form.preview.work_type = this.form.work_type
      this.form.preview.check_date = this.form.check_date
      this.form.preview.move_date = this.form.move_date
      this.form.preview.result_date = this.form.result_date
      this.form.preview.plan_list = this.form.plan_list
      this.form.preview.attach = this.fileList
      const content = JSON.stringify(this.form)

      try {
        if (this.formCheck()) {

          if (isUploaded) {
            // 바로 상신하기
            const unTemp = 'y'
            await this.$store.dispatch('approval/UPDATE_POST', {
              projectId,
              boardSlug,
              postId,
              title,
              content,
              approvalLine,
              uploads,
              unTemp
            })
            alert('상신되었습니다.')
            this.oldForm = JSON.parse(JSON.stringify(this.form))
            this.oldPlanList = JSON.parse(JSON.stringify(this.plan_list))
            this.back()
          } else {
            // 임시 저장하기
            const unTemp = 'n'
            await this.$store.dispatch('approval/UPDATE_POST', {
              projectId,
              boardSlug,
              postId,
              title,
              content,
              approvalLine,
              uploads,
              unTemp
            })
            alert('임시저장되었습니다.')
            this.oldForm = JSON.parse(JSON.stringify(this.form))
            this.oldPlanList = JSON.parse(JSON.stringify(this.plan_list))
            this.back()
          }
        }

      } catch (e) {
        if (this.$store.state.approval.error_data.title) {
          alert('현장명이 없습니다')
        } else {
          console.log(this.$store.state.approval.error_code)
        }
      }

    },

    async reRegister (isUploaded) {
      if (isUploaded && (!this.approvalLine || this.approvalLine.length === 0)) {
        alert('결재선을 지정해주세요')
        return
      }

      // 등록정보
      const projectId = this.$route.params.proj_id
      const boardSlug = this.boardSlug
      const title = this.form.title
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

      this.form.plan_list = this.plan_list

      // 리스트 노출 정보
      this.form.project_title = this.projectInfo.field_name
      this.form.preview.project_title = this.form.project_title
      this.form.preview.title = this.form.title
      this.form.preview.work_type = this.form.work_type
      this.form.preview.check_date = this.form.check_date
      this.form.preview.move_date = this.form.move_date
      this.form.preview.result_date = this.form.result_date
      this.form.preview.plan_list = this.form.plan_list
      this.form.preview.attach = this.fileList
      const content = JSON.stringify(this.form)

      try {
        if (this.formCheck()) {

          if (isUploaded) {
            // 바로 상신하기
            await this.$store.dispatch('approval/CREATE_POST', {
              projectId,
              boardSlug,
              title,
              content,
              approvalLine,
              security,
              priority,
              uploads
            })
            alert('상신되었습니다.')
            this.oldForm = JSON.parse(JSON.stringify(this.form))
            this.oldPlanList = JSON.parse(JSON.stringify(this.plan_list))
            this.back()
          } else {
            // 임시 저장하기
            const isTemp = 1
            await this.$store.dispatch('approval/CREATE_POST', {
              projectId,
              boardSlug,
              title,
              content,
              approvalLine,
              security,
              priority,
              uploads,
              isTemp
            })
            alert('임시저장되었습니다.')
            this.oldForm = JSON.parse(JSON.stringify(this.form))
            this.oldPlanList = JSON.parse(JSON.stringify(this.plan_list))
            this.back()
          }
        }

      } catch (e) {
        if (this.$store.state.approval.error_data.title) {
          alert('현장명이 없습니다')
        } else {
          console.log(this.$store.state.approval.error_code)
        }
      }

    },

    formCheck () {
      if (this.form.work_type.trim().length <= 0) {
        alert('장비명을 선택해주세요')
        return false
      } else if (this.form.title.trim().length <= 0) {
        alert('제목을 입력해주세요')
        return false
      }
      return true
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
            id: member.user_id,
            name: member.user_name,
            elementType: member.type_code
          })
        }
      }

      return approvalList
    },

    getContent (data) {
      if (data.post) {
        const content = data.post
        return content
      }
    },

    handleClickClose () {
      this.back()
    },

    addPlan (name, size, quantity, unit_price, price, etc) {
      this.plan_list.push({
        is_checked: this.planAllCheck,
        name, // 품목명
        size, // 규격
        quantity, // 수량
        unit_price, // 단가
        price, // 금액
        etc // 비고
      })
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
    addPlanEmpty () {
      this.addPlan('', '', '', '', '', '')
    },
    changePlanAllCheck () {
      for (const data of this.plan_list) {
        data.is_checked = this.orderAllCheck
      }
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

    handleClickAddPlan () {
      this.addPlanEmpty()
    },

    handlePlanChangeChecked () {
      let count = 0
      for (const data of this.plan_list) {
        if (data.is_checked === true) {
          count++
        }
      }
      this.planAllCheck = (Number(count) === Number(this.plan_list.length))
    },
    handlePlanSelected (selectIndex, item) {
      if (this.board.statusCode === 'approved') {
        const boardSlug = this.boardSlug
        const boardId = this.boardId
        const postId = this.$route.params.postId

        item.boardSlug = boardSlug
        item.boardId = boardId
        item.postId = postId

        this.selectPlanIndex = selectIndex
        this.selectPlanDetail = item.after

        this.popupActive = true

      }
    },
    handleClickRemovePlan () {
      for (let i = 0; i < this.plan_list.length; i++) {
        if (this.plan_list[i].is_checked) {
          this.plan_list.remove(this.plan_list[i])
          i = -1
        }
      }

      this.planAllCheck = false
    },

    handleBackMenu () {
      this.$emit('handleBackMenu', 'plan')
    },

    popupActiveSync () {
      this.popupActive = false
    },

    handleClickNo () {
      this.alert.html = '<p>반려하시겠습니까?</p><p>아래에 사유를 작성해주세요.</p>'
      this.alert.message = ''
      this.alert.isConfirm = true
      this.alert.buttons = [
        {
          label: '반려',
          action: 'no'
        },
        {
          label: '취소',
          action: 'cancel',
          type: 'border'
        }
      ]
      this.alert.show = true
    },

    async handleClickOk () {
      this.alert.html = ''
      this.alert.message = '승인하시겠습니까?'
      this.alert.isConfirm = false
      this.alert.buttons = [
        {
          label: '승인',
          action: 'ok'
        },
        {
          label: '취소',
          action: 'cancel',
          type: 'border'
        }
      ]
      this.alert.show = true

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

    async handleClickUploadDetail (detail) {
      const index = this.selectPlanIndex
      this.form.plan_list[index].after = detail

      const after = { data: []}
      for (const plan of this.form.plan_list) {
        after.data.push(plan.after)
      }

      const boardSlug = this.boardSlug
      const postId = this.$route.params.postId
      const content = JSON.stringify(after)
      const afterId = this.afterId
      if (afterId) {
        await this.$store.dispatch('approval/UPDATE_AFTER_DATA', {
          content,
          boardSlug,
          postId,
          afterId
        })
      } else {
        await this.$store.dispatch('approval/ADD_AFTER_DATA', {
          content: [content],
          boardSlug,
          postId
        })
      }

      alert('상세정보가 저장되었습니다.')
    },

    // TODO : 얼럿데이터
    async alertOk () {

      const postId = this.$route.params.postId
      await this.$store.dispatch('approval/APPROVE_OK', {
        postId
      })

      this.oldForm = JSON.parse(JSON.stringify(this.form))
      this.oldPlanList = JSON.parse(JSON.stringify(this.plan_list))
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
      this.oldPlanList = JSON.parse(JSON.stringify(this.plan_list))
      document.location.reload()
    },

    handleSendApprovalProcess (process) {
      this.approvalLine = process
    },

    alertPrint () {
      this.print()
    },

    print () {
      this.isPrint = true
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

<style scoped>
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

