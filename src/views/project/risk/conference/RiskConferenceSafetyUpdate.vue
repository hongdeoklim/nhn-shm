<template>
  <div>
    <vs-row :class="getClasses" id="print-report">
      <vs-col style="position: relative">
        <vx-card style="width:calc(100% - 40px)" :style="isPrint ? {width: '100%', boxShadow: 'none', borderRadius: '0'} : {}">
          <vs-row v-if="!isPrint" class="mb-8 ">
            <vs-col class="mb-6 flex" vs-justify="flex-end">
              <vs-button v-if="board.savable" class="ml-4" color="secondary" type="border" @click="handleDeletePost">삭제</vs-button>
              <vs-button class="ml-4" color="secondary" @click="handlePrint">인쇄</vs-button>
              <vs-button class="ml-4" color="secondary" type="border" @click="handleBackMenu">목록</vs-button>
              <vs-button v-if="board.savable" class="ml-4" color="secondary" @click="handleClickUpdate">임시저장</vs-button>
              <vs-button v-if="board.collection" class="ml-4" color="secondary" @click="handleClickCollection">결재 문서 회수</vs-button>
              <vs-button v-if="board.resend" class="ml-4" color="secondary" @click="handleClickRegister">임시저장 후 재상신</vs-button>
            </vs-col>
          </vs-row>
          <!-- 기본정보 -->
          <vs-row class="mb-4">
            <vs-col><h5><i class="dot"></i>기본정보</h5></vs-col>
          </vs-row>
          <vs-row class="mb-8">
            <vs-col class="flex flex-wrap" >
              <vs-row class="w-1/2 px-4 mb-4 flex" vs-align="center">
                <vs-col class="w-3/12">현장명</vs-col>
                <vs-col class="w-9/12">
                  <span v-if="isPrint">{{form.project_title}}</span>
                  <ml-input v-else class="w-full" v-model="form.project_title" :readonly="true"/>
                </vs-col>
              </vs-row>
              <vs-row class="w-1/2 px-4 mb-4 flex" vs-align="center">
                <vs-col class="w-3/12">작성자</vs-col>
                <vs-col class="w-9/12">
                  <span v-if="isPrint">{{form.project_title}}</span>
                  <ml-input v-else class="w-full" v-model="form.writer" :readonly="true"/></vs-col>
              </vs-row>
            </vs-col>
          </vs-row>

          <!-- 회의내용 -->
          <vs-row class="mb-4">
            <vs-col><h5><i class="dot"></i>회의내용</h5></vs-col>
          </vs-row>
          <vs-row class="mb-8">
            <vs-col class="flex flex-wrap">
              <vs-row class="w-1/2 px-4 mb-4 flex" vs-align="center">
                <vs-col class="w-3/12">회의일</vs-col>
                <vs-col class="w-9/12">
                  <span v-if="isPrint">{{form.meetingDate}}</span>
                  <date-selector v-else class="popup-fixed w-full" v-model="form.meetingDate"
                                 :readonly="!board.savable"></date-selector>
                </vs-col>
              </vs-row>
              <vs-row class="w-1/2 px-4 mb-4 flex" vs-align="center">
                <vs-col class="w-3/12">회의장소</vs-col>
                <vs-col class="w-9/12">
                  <span v-if="isPrint">{{form.meetingPlace}}</span>
                  <ml-input v-else class="w-full" v-model="form.meetingPlace" :readonly="!board.savable"/>
                </vs-col>
              </vs-row>
              <vs-row class="w-1/2 px-4 mb-4 flex" vs-align="start">
                <vs-col class="w-3/12 pt-2 pr-2">전회 미결사항 및 우수사례 피드백</vs-col>
                <vs-col class="w-9/12">
                  <span v-if="isPrint">{{form.prevPassIssue}}</span>
                  <ml-textarea v-else rows="4" class="w-full" v-model="form.prevPassIssue" :readonly="!board.savable"/>
                </vs-col>
              </vs-row>
              <vs-row class="w-1/2 px-4 mb-4 flex" vs-align="start">
                <vs-col class="w-3/12 pt-2 pr-2">건의 및 전달사항</vs-col>
                <vs-col class="w-9/12">
                  <span v-if="isPrint">{{form.relayComment}}</span>
                  <ml-textarea v-else rows="4" class="w-full" v-model="form.relayComment" :readonly="!board.savable"/>
                </vs-col>
              </vs-row>
              <vs-row class="w-1/2 px-4 mb-4 flex" vs-align="start">
                <vs-col class="w-3/12 pt-2 pr-2">경영자 검토</vs-col>
                <vs-col class="w-9/12">
                  <span v-if="isPrint">{{form.leaderReview}}</span>
                  <ml-textarea v-else rows="4" class="w-full" v-model="form.leaderReview" :readonly="!board.savable"/>
                </vs-col>
              </vs-row>
              <vs-row class="w-1/2 px-4 mb-4 flex" vs-align="start">
                <vs-col class="w-3/12 pt-2 pr-2">위험요인 추가</vs-col>
                <vs-col class="w-9/12">
                  <span v-if="isPrint">{{form.addRisk}}</span>
                  <ml-textarea v-else rows="4" class="w-full" v-model="form.addRisk" :readonly="!board.savable"/>
                </vs-col>
              </vs-row>
            </vs-col>
          </vs-row>

          <!-- 첨부파일 -->
          <file-upload-module v-if="!isPrint" v-model="fileList" :readonly="board.readonly"></file-upload-module>

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

    <!-- TODO : 얼럿데이터 -->
    <popup-alert v-model="alert.show"
                 :is-confirm="alert.isConfirm"
                 :html="alert.html"
                 :message="alert.message"
                 :buttons="alert.buttons"

                 @ok="alertOk"
                 @no="alertNo"
                 @print="alertPrint"
    ></popup-alert>
  </div>
</template>

<script>
import ApprovalProcessModule from '@/views/modules/ApprovalProcessModule'
import PopupAlert from '@/popup/PopupAlert'
import FileUploadModule from '@/views/modules/FileUploadModule'
import DateSelector from '@/components/selector/DateSelector'
export default {
  name: 'RiskConferenceSafetyUpdate',
  components: {
    DateSelector,
    FileUploadModule,
    PopupAlert,
    ApprovalProcessModule},
  data () {
    return {
      boardSlug: 'industry_safety_health_association',

      // TODO : 글쓰기 정보 및 권한
      board:{
        slug:'industry_safety_health_association',
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
      approvalLine:[], // 결재선 등록
      isPrint: false,

      form:{
        project_title:'', //현장명
        writer:'', //작성자

        meetingDate:'', //회의일
        meetingPlace:'', //회의장소
        meetingType:'', //회의구분
        company1:'', //시공사
        company2:'', //파트너사 및 근로자
        comment1:'', //협의 및 심의
        comment2:'', //결정사항

        // preview
        preview: {
          title: '',
          meetingType:'', //회의구분
          meetingDate:'', //회의일
          meetingPlace:'' //회의장소
        }
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
  created () {
    this.loadPost()
  },
  computed: {
    getClasses () {
      if (this.toggleSide) {
        return 'fix-grid'
      }
      return 'hide-grid'
    }
  },
  methods:{
    onClickToggleSide () {
      this.toggleSide = !this.toggleSide
    },

    back () {
      this.$router.back()
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

      const files = this.$store.state.approval.postInfo.post_attachment
      if (files) {
        for (const file of files) {
          this.fileList.push({
            id:file.id,
            fileName:file.file_name,
            fileSize:file.file_size,
            path:file.path,
            thumb:file.thumb
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
    },

    async register (isUploaded) {
      if (isUploaded && (!this.approvalLine || this.approvalLine.length === 0)) {
        alert('결재선을 지정해주세요')
        return
      }

      // 등록정보
      const projectId = this.$route.params.proj_id
      const boardSlug = this.boardSlug
      const postId = this.$route.params.postId
      const title = this.form.project_title
      const approvalLine = JSON.stringify(this.lineToSendLine(this.approvalLine))

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
      this.form.preview.title = this.form.project_title
      this.form.preview.meetingType = this.form.meetingType
      this.form.preview.meetingDate = this.form.meetingDate
      this.form.preview.meetingPlace = this.form.meetingPlace
      this.form.preview.writer = this.form.writer

      const content = JSON.stringify(this.form)


      try {
        if (isUploaded) {
          // 바로 상신하기
          const unTemp = 'y'
          await this.$store.dispatch('approval/UPDATE_POST', {projectId, boardSlug, postId, title, content, approvalLine, unTemp, uploads})
          alert('상신되었습니다.')
          this.oldForm = JSON.parse(JSON.stringify(this.form))
          this.back()
        } else {
          // 임시 저장하기
          const unTemp = 'n'
          await this.$store.dispatch('approval/UPDATE_POST', {projectId, boardSlug, postId, title, content, approvalLine, unTemp, uploads})
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
      const projectId = this.$route.params.proj_id
      const boardSlug = this.boardSlug
      const title = this.form.project_title
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
      this.form.preview.title = this.form.project_title
      this.form.preview.meetingType = this.form.meetingType
      this.form.preview.meetingDate = this.form.meetingDate
      this.form.preview.meetingPlace = this.form.meetingPlace
      this.form.preview.writer = this.form.writer

      this.form.evalList = this.evalList
      this.form.addEvalList = this.addEvalList
      const content = JSON.stringify(this.form)


      try {
        if (isUploaded) {
          // 바로 상신하기
          await this.$store.dispatch('approval/CREATE_POST', {projectId, boardSlug, title, content, approvalLine, security, priority, uploads})
          alert('상신되었습니다.')
          this.oldForm = JSON.parse(JSON.stringify(this.form))
          this.back()
        } else {
          // 임시 저장하기
          const isTemp = 1
          await this.$store.dispatch('approval/CREATE_POST', {projectId, boardSlug, title, content, approvalLine, security, priority, isTemp, uploads})
          alert('임시저장되었습니다.')
          this.oldForm = JSON.parse(JSON.stringify(this.form))
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
      this.$emit('handleBackMenu', 'safety')
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

    // TODO : 얼럿데이터
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
      this.oldAddEvalList = JSON.parse(JSON.stringify(this.addEvalList))
      document.location.reload()
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

    handleClickUpload () {
      if (confirm('상신하시겠습니까?')) {
        this.register(true)
      }
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
