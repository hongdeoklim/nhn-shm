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
              <vs-button v-if="board.savable && isUpdateMode" class="mr-4" color="secondary" type="border"
                         @click="handleDeletePost">삭제
              </vs-button>
              <vs-button v-if="board.collection" class="" color="secondary" @click="handleClickCollection">결재 문서 회수
              </vs-button>
              <vs-button v-if="board.resend" class="ml-2" color="secondary" @click="handleClickRegister">임시저장 후 재상신
              </vs-button>
            </vs-col>

            <!-- 기본정보 -->
            <vs-row class="mb-4">
              <vs-col><h5><i class="dot"></i>기본정보</h5></vs-col>
            </vs-row>
            <vs-col class="flex flex-wrap">

              <vs-row class="w-1/3  mb-4 flex" vs-align="center">
                <vs-col class="w-3/12 title">현장명</vs-col>
                <vs-col class="w-9/12">
                  <span v-if="isPrint">{{ projectInfo.field_name }}</span>
                  <ml-input v-else class="w-full" :value="projectInfo.field_name" :readonly="true"/>
                </vs-col>
              </vs-row>
              <vs-row class="w-1/3  mb-4 flex" vs-align="center">
                <vs-col class="w-3/12 title pr-4" style="text-align: right">소속</vs-col>
                <vs-col class="w-9/12">
                  <span v-if="isPrint">{{ form.company }}</span>
                  <ml-input v-else class="w-full" v-model="form.company" :readonly="true"/>
                </vs-col>
              </vs-row>
              <vs-row class="w-1/3  mb-4 flex" vs-align="center">
                <vs-col class="w-3/12 title pr-4" style="text-align: right">작성자</vs-col>
                <vs-col class="w-9/12">
                  <span v-if="isPrint">{{ form.writer }}</span>
                  <ml-input v-else class="w-full" v-model="form.writer" :readonly="true"/>
                </vs-col>
              </vs-row>


              <vs-row class="w-1/3  mb-4 flex" vs-align="center">
                <vs-col class="w-3/12 title">재해형태</vs-col>
                <vs-col class="w-9/12">
                  <span v-if="isPrint">{{ getDisaster(form.occur_type) }}</span>
                  <disaster-type-selector v-else class="w-full" v-model="form.occur_type" @change="changeSelect"
                                          :readonly="board.readonly"/>
                </vs-col>
              </vs-row>
              <vs-row class="w-1/3  mb-4 flex" vs-align="center">
                <vs-col class="w-3/12 title pr-4" style="text-align: right">발생일</vs-col>
                <vs-col class="w-9/12">
                  <span v-if="isPrint">{{ form.occur_date }}</span>
                  <date-selector v-else class="w-full" v-model="form.occur_date" :readonly="board.readonly"></date-selector>
                </vs-col>
              </vs-row>
              <vs-row class="w-1/3  mb-4 flex" vs-align="center">
                <vs-col class="w-3/12 title pr-4" style="text-align: right">조치일</vs-col>
                <vs-col class="w-9/12">
                  <span v-if="isPrint">{{ form.action_date }}</span>
                  <date-selector v-else class="w-full" v-model="form.action_date" :readonly="board.readonly"></date-selector>
                </vs-col>
              </vs-row>
            </vs-col>

            <!-- 시정 및 예방근로자의견 -->
            <vs-row>
              <vs-col class="mb-4 flex" vs-align="center">
                <h5><i class="dot"></i>관련내용</h5>
                <vs-col v-if="!board.readonly || board.resend" class="w-auto ml-auto">
                  <vs-button class="mr-4" color="secondary" type="border" @click="handleClickAddEval">+ 항목추가</vs-button>
                  <vs-button class="mr-4" color="secondary" type="border" @click="handleClickRemoveEval">- 항목삭제
                  </vs-button>
                </vs-col>
              </vs-col>
            </vs-row>

            <vs-row class="mb-8">
              <vs-col class="border">
                <ul class="table">
                  <li class="tbody" style="grid-template-columns: 50px 1fr 1fr;">
                    <p lass="p-2" @click="onClickCheckAll">
                      <vs-checkbox v-if="!isPrint" :value="isCheckAll" :readonly="board.readonly"></vs-checkbox>
                    </p>
                    <p class="p-4">조치 전</p>
                    <p class="p-4">조치 후</p>
                  </li>
                  <li class="tbody" v-for="(item, index) in form.actionList" :key="index"
                      style="grid-template-columns: 50px 1fr 1fr;">
                    <p class="p-2">
                      <vs-checkbox v-if="!isPrint" v-model="item.is_checked" :readonly="board.readonly"></vs-checkbox>
                      <span v-else >내용</span>
                    </p>
                    <p v-if="isPrint">
                      <span>{{item.actionContent}}</span>
                    </p>
                    <p class="p-4" v-else>
                      <vs-row>
                        <vs-col class="w-full">
                          <vs-col class="w-1/4 h-full flex title" style="align-items: center">내용</vs-col>
                          <vs-col class="w-3/4">
                            <ml-textarea class="w-full m-0 p-0" v-model="item.actionContent"
                                         :readonly="board.readonly"/>
                          </vs-col>
                        </vs-col>
                      </vs-row>
                    </p>
                    <p v-if="isPrint">
                      <span>{{item.actionResult}}</span>
                    </p>
                    <p class="p-4" v-if="!isPrint">
                      <vs-row class="">
                        <vs-col class="w-full">
                          <vs-col class="w-1/4 h-full flex title" style="align-items: center">내용</vs-col>
                          <vs-col class="w-3/4">
                            <ml-textarea class="w-full m-0 p-0" v-model="item.actionResult" :readonly="board.readonly"/>
                          </vs-col>
                        </vs-col>
                      </vs-row>
                    </p>
                  </li>
                </ul>
              </vs-col>
            </vs-row>


          </vs-row>

          <!-- 첨부파일 -->
          <file-upload-module v-if="!isPrint" v-model="fileList" :readonly="board.readonly"/>


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

                 @upload="alertUpload"
                 @ok="alertOk"
                 @no="alertNo"
                 @print="alertPrint"
    ></popup-alert>
  </div>
</template>

<script>
import DateSelector from '@/components/selector/DateSelector'
import FileUploader from '@/components/FileUploader'
import ApprovalProcessModule from '@/views/modules/ApprovalProcessModule'
import PopupAlert from '@/popup/PopupAlert'
import FileUploadModule from '@/views/modules/FileUploadModule'
import DisasterTypeSelector from '@/components/DisasterTypeSelector'

export default {
  name: 'PreventionWrite',
  components: {
    DisasterTypeSelector,
    FileUploadModule,
    PopupAlert,
    ApprovalProcessModule,
    FileUploader,
    DateSelector
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

    isCheckAll () {
      let isCheckAll = true
      this.form.actionList.map(value => {
        if (value.is_checked === false) {
          isCheckAll = false
        }
      })

      if (this.form.actionList.length === 0) {
        return false
      }

      return isCheckAll
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
      approvalLine: [], // 결재선 등록

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

      form: {
        field_name: '',
        writer: '',
        company: '',
        occur_type: '', //재해형태
        occur_date: '', //요청일
        action_date: '', //조치일
        actionList: [],
        preview: {
          field_name: '', //현장
          occur_type: '', //재해형태
          company: '', //파트너사
          writer: '', //작성자
          occur_date: '', //요청일
          action_date: '' //조치일
        },

        // 통계를 위해서 저장하는 데이터
        summary: {
          disaster: []
        }
      },
      fileList: [], // 파일 리스트
      oldForm: {},

      toggleSide: true,
      isPrint: false

    }
  },

  watch: {
    'form.occur_type' (value) {
      const disaster = []
      this.disasterList.map(data => {
        const key = data.text
        disaster.push( {[key]: 0} )
      })

      let i;
      for (i=0; i<disaster.length; i++) {
        const keys = Object.keys(disaster[i])
        if (keys.length > 0) {
          if (keys[0] === this.getOccurTypeName(value)) {
            disaster[i][keys[0]] += 1
          }
        }
      }

      i = 0;
      for (i=0; i<disaster.length; i++) {
        const keys = Object.keys(disaster[i])
        if (keys.length > 0) {
          if (disaster[i][keys[0]] === 0) {
            disaster.splice(i, 1)
            i--;
          }
        }
      }

      this.form.summary.disaster = disaster
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

    async init () {
      await this.$store.dispatch('USER_INFO')
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
      this.form.field_name = this.$store.state.project.projectInfo.field_name

      this.oldForm = JSON.parse(JSON.stringify(this.form))
    },

    async loadPost () {

      // 내용불러오기
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

      this.postAfters = this.$store.state.approval.postAfters
      const post = JSON.parse(this.$store.state.approval.postInfo.post_content)
      this.form = post

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
      this.board.readonly = !(this.board.statusCode === 'temp' || this.board.statusCode === 'rejected')
      this.board.resend = (this.board.isWriter && this.board.statusCode === 'rejected')
      this.board.isCompleteApproval = (this.board.statusCode === 'approved' || this.board.statusCode === 'rejected')
      this.board.savable = this.board.isWriter && (this.board.statusCode === 'temp')
      this.board.collection = this.board.isWriter && (this.board.statusCode === 'registered')
      this.board.approvalLine = doc.line.slice() // 모듈 표기용
      this.approvalLine = doc.line.slice() // api 전송용

      this.oldForm = JSON.parse(JSON.stringify(this.form))

      if (this.board.statusCode === 'approved' && this.form.actionList) {
        this.after = []
        for (let i = 0; i < this.form.actionList.length; i++) {
          this.after.push({
            text: '',
            attach: {}

          })
        }

        if (this.postAfters.length > 0) {
          const list = JSON.parse(this.postAfters[0].after_content)
          this.after = list
        }
      }
    },

    async register (_isTemp) {
      if (_isTemp && (!this.approvalLine || this.approvalLine.length === 0)) {
        alert('결재선을 지정해주세요')
        return
      }

      const projectId = this.$route.params.proj_id
      const boardSlug = this.boardSlug
      const title = this.$store.state.project.projectInfo.field_name
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
      this.form.preview.attach = JSON.stringify(listUploads)

      this.form.preview.field_name = title
      this.form.preview.occur_type = this.form.occur_type
      this.form.preview.company = this.form.company
      this.form.preview.writer = this.form.writer
      this.form.preview.occur_date = this.form.occur_date
      this.form.preview.action_date = this.form.action_date

      this.form.date = this.form.occur_date
      const content = JSON.stringify(this.form)

      try {
        if (this.isUpdateMode) {
          const postId = this.$route.params.postId

          if (_isTemp) {
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
            this.$router.back()
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
            this.$router.back()
          }
        } else {

          if (_isTemp) {
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
            this.$router.back()
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

    async reRegister () {
      if (!this.approvalLine || this.approvalLine.length === 0) {
        alert('결재선을 지정해주세요')
        return
      }

      const projectId = this.$route.params.proj_id
      const boardSlug = this.boardSlug
      const title = this.form.field_name
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
      this.form.preview.attach = JSON.stringify(listUploads)

      this.form.preview.field_name = this.form.field_name
      this.form.preview.occur_type = this.form.occur_type
      this.form.preview.company = this.form.company
      this.form.preview.writer = this.form.writer
      this.form.preview.occur_date = this.form.occur_date
      this.form.preview.action_date = this.form.action_date

      this.form.date = this.form.occur_date
      const content = JSON.stringify(this.form)

      try {
        // 임시 저장하기
        const isTemp = 1
        await this.$store.dispatch('approval/CREATE_POST', {
          projectId, boardSlug, title, content, approvalLine, security, priority, uploads, isTemp
        })
        alert('임시저장되었습니다.')
        this.oldForm = JSON.parse(JSON.stringify(this.form))
        this.$router.back()
      } catch (e) {
        if (this.$store.state.approval.error_data.title) {
          alert('현장명이 없습니다')
          this.oldForm = JSON.parse(JSON.stringify(this.form))
        } else {
        }
      }

    },

    formCheck () {
      if (this.form.occur_type.trim().length <= 0) {
        alert('발생구분을 선택하세요')
        return false
      } else if (this.form.occur_date.trim().length <= 0) {
        alert('발생일을 선택하세요')
        return false
      } else if (this.form.action_date.trim().length <= 0) {
        alert('조치일를 선택하세요')
        return false
      }
      return true
    },

    handleClickAddEval () {

      this.form.actionList.push({
        is_checked: false,
        actionContent: '',
        actionResult: '',
        before: {},
        after: {}
      })
    },

    handleClickRemoveEval () {
      for (let i = 0; i < this.form.actionList.length; i++) {
        if (this.form.actionList[i].is_checked) {
          this.form.actionList.remove(this.form.actionList[i])
          i = -1
        }
      }
    },

    handleBackMenu () {
      this.$emit('handleBackMenu', this.tagKey)
    },

    handleClickCollection () {
      if (confirm('회수 후 임시저장 상태로 변경하시겠습니까?')) {
        this.register(false)

      }
    },

    handleClickUpdate () {
      if (confirm('저장하시겠습니까?')) {
        this.register(false)
      }
    },

    handleClickRegister () {
      if (confirm('임시저장 하시겠습니까?')) {
        this.reRegister(false)
      }
    },

    // TODO : 얼럿데이터
    alertUpload () {
      this.register(true)
    },

    async alertOk () {

      const postId = this.$route.params.postId
      await this.$store.dispatch('approval/APPROVE_OK', {
        postId
      })

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

    handleSendApprovalProcess (process) {
      this.approvalLine = process
    },

    changeSelect () {

    },

    onClickCheckAll () {
      if (this.board.readonly) {
        return false
      }
      if (this.isCheckAll) {
        this.form.actionList.map(value => {
          value.is_checked = false
        })
      } else {
        this.form.actionList.map(value => {
          value.is_checked = true
        })
      }
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

    getOccurTypeName (type) {
      let typeName = type
      this.disasterList.map(data => {
        if (`${type}` === `${data.value}`) {
          typeName = data.text
        }
      })
      return typeName
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
    },
    getDisaster (value) {
      value = value ? parseInt(value) : 0 ;
      if (value === 1) return '감염'
      if (value === 2) return '감전'
      if (value === 3) return '교통사고'
      if (value === 4) return '깔림'
      if (value === 5) return '끼임'
      if (value === 6) return '낙하'
      if (value === 7) return '넘어짐'
      if (value === 8) return '뒤집힘'
      if (value === 9) return '떨어짐'
      if (value === 10) return '맞음'
      if (value === 11) return '무너짐'
      if (value === 12) return '근골격계질환'
      if (value === 14) return '베임'
      if (value === 15) return '붕괴'
      if (value === 16) return '빠짐'
      if (value === 17) return '(산소)결핍'
      if (value === 18) return '소음노출'
      if (value === 19) return '아차사고'
      if (value === 20) return '이상기압 노출, 접촉'
      if (value === 21) return '익사'
      if (value === 22) return '유해광선 노출'
      if (value === 23) return '절단'
      if (value === 24) return '중독'
      if (value === 25) return '질식'
      if (value === 26) return '질환'
      if (value === 27) return '찔림'
      if (value === 28) return '충돌'
      if (value === 29) return '탈락'
      if (value === 30) return '파열'
      if (value === 31) return '폭발'
      if (value === 32) return '화재'
      if (value === 33) return '화학물질 누출 접촉'
      if (value === 34) return '기타'
    }
  }
}
</script>

<style scoped>

ul.table.table-no-1 > li {
  grid-template-columns: 54px repeat(1, minmax(0, 1fr));
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
