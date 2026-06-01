<template>
  <div>

    <vs-row class="mb-6">
      <vs-col class="w-9/12 flex " vs-justify="flex-end">
        <vs-button v-if="board.savable" class="mr-4" color="secondary" type="border" @click="handleDeletePost">삭제</vs-button>
        <vs-button class="mr-4" color="secondary" type="border" @click="handlePrint">인쇄</vs-button>
        <vs-button class="mr-4" color="secondary" type="border" @click="handleClickClose">닫기</vs-button>
        <vs-button v-if="board.savable" class="" color="secondary" @click="handleClickUpdate">임시저장</vs-button>
        <vs-button v-if="board.collection" class="" color="secondary" @click="handleClickCollection">결재 문서 회수</vs-button>
        <vs-button v-if="board.resend" class="" color="secondary" @click="handleClickRegister">임시저장 후 재상신</vs-button>
      </vs-col>
    </vs-row>

    <vs-row>
      <vs-col class="w-9/12">

        <vx-card>
          <div>

            <!-- 기본정보 -->
            <vs-row class="mb-8">
              <vs-col><h5><i class="dot"></i>기본정보</h5></vs-col>
            </vs-row>
            <vs-col class="flex flex-wrap mb-4">

              <vs-row class="w-1/3  mb-4 flex" vs-align="center">
                <vs-col class="w-3/12 title">현장명</vs-col>
                <vs-col class="w-9/12">
                  <ml-input class="w-full" :value="projectInfo.field_name" :readonly="true"/>
                </vs-col>
              </vs-row>
              <vs-row class="w-1/3  mb-4 flex" vs-align="center">
                <vs-col class="w-3/12 title pr-4" style="text-align: right">대상기간</vs-col>
                <vs-col class="w-4/12">
                  <ml-input class="w-full" :value="projectInfo.date_work_start ? projectInfo.date_work_start.substr(0,11) : ''"
                            :readonly="true"/>
                </vs-col>
                <vs-col class="w-1/12" style="text-align: center">-</vs-col>
                <vs-col class="w-4/12">
                  <ml-input class="w-full" :value="projectInfo.date_complete ? projectInfo.date_complete.substr(0,11) : ''" :readonly="true"/>
                </vs-col>
              </vs-row>
              <vs-row class="w-1/3  mb-4 flex" vs-align="center">
                <vs-col class="w-3/12 title pr-4" style="text-align: right">작성자</vs-col>
                <vs-col class="w-9/12">
                  <ml-input class="w-full" :value="form.writer" :readonly="true"/>
                </vs-col>
              </vs-row>


              <vs-row class="w-1/3  mb-4 flex" vs-align="center">
                <vs-col class="w-3/12 title">지원구분</vs-col>
                <vs-col class="w-9/12">
                  <vs-select autocomplete class="w-full" v-model="form.support_type" :disabled="board.readonly">
                    <vs-select-item text="지원구분1" value="1"/>
                    <vs-select-item text="지원구분2" value="2"/>
                    <vs-select-item text="지원구분3" value="3"/>
                    <vs-select-item text="지원구분4" value="4"/>
                    <vs-select-item text="지원구분5" value="5"/>
                  </vs-select>
                </vs-col>
              </vs-row>
              <vs-row class="w-1/3  mb-4 flex" vs-align="center">
                <vs-col class="w-3/12 title pr-4" style="text-align: right">지원일</vs-col>
                <vs-col class="w-9/12">
                  <date-selector class="w-full" v-model="form.support_date" :readonly="board.readonly"></date-selector>
                </vs-col>
              </vs-row>
              <vs-row class="w-1/3  mb-4 flex" vs-align="center">
              </vs-row>

            </vs-col>


            <!-- 지원결과 -->
            <vs-row class="mb-4">
              <vs-col><h5><i class="dot"></i>지원결과</h5></vs-col>
            </vs-row>
            <vs-col class="flex flex-wrap mb-4">

              <vs-row class="w-full  mb-4 flex" vs-align="center">
                <vs-col class="w-1/12 title">지원자</vs-col>
                <vs-col class="w-5/12">
                  <ml-input class="w-full" v-model="form.supporter" :readonly="board.readonly"/>
                </vs-col>
              </vs-row>

              <vs-row class="w-full  mb-4 flex" vs-align="center">
                <vs-col class="w-1/12 title">지원범위</vs-col>
                <vs-col class="w-7/12">
                  <ml-input class="w-full" v-model="form.scope" :readonly="board.readonly"/>
                </vs-col>
              </vs-row>

              <vs-row class="w-full  mb-4 flex" vs-align="center">
                <vs-col class="w-1/12 title">환경관리</vs-col>
                <vs-col class="w-11/12">
                  <ml-textarea class="w-full" v-model="form.management" :readonly="board.readonly"/>
                </vs-col>
              </vs-row>

              <vs-row class="w-full  mb-4 flex" vs-align="center">
                <vs-col class="w-1/12 title">향후 지원 계획</vs-col>
                <vs-col class="w-11/12">
                  <ml-textarea class="w-full" v-model="form.requirements" :readonly="board.readonly"/>
                </vs-col>
              </vs-row>


            </vs-col>

            <!-- 첨부파일 -->
            <vs-row class="mb-4">
              <vs-col><h5><i class="dot"></i>첨부파일</h5></vs-col>
            </vs-row>
            <!-- 첨부파일 -->
            <file-upload-module id="state_support_update" v-model="fileList" :visible-title="false" :readonly="board.readonly"></file-upload-module>

          </div>
        </vx-card>

      </vs-col>
      <vs-col class="w-3/12 pl-6">
        <approval-process-module
          :board="board"
          :commentabled="(!board.isCompleteApproval || board.savable)"

          @handleClickUpload="handleClickUpload"
          @handleClickOk="handleClickOk"
          @handleClickNo="handleClickNo"
          @handleSendApprovalProcess="handleSendApprovalProcess"
        ></approval-process-module>
      </vs-col>
    </vs-row>

    <div v-if="isPrint" id="print-report">
      <div style="background: #fff;">

        <!-- 기본정보 -->
        <vs-row class="mb-8">
          <vs-col><h5><i class="dot"></i>기본정보</h5></vs-col>
        </vs-row>
        <vs-col class="flex flex-wrap mb-4">

          <vs-row class="w-1/3  mb-4 flex" vs-align="center">
            <vs-col class="w-3/12 title">현장명</vs-col>
            <vs-col class="w-9/12">
              <span style="width:100%; height:38px; display: flex; align-items: center;">{{ form.field_name }}</span>
            </vs-col>
          </vs-row>
          <vs-row class="w-1/3  mb-4 flex" vs-align="center">
            <vs-col class="w-3/12 title pr-4" style="text-align: right">대상기간</vs-col>
            <vs-col class="w-4/12">
              <span style="width:100%; height:38px; display: flex; align-items: center;">{{ projectInfo.date_work_start.substr(0,11) }}</span>
            </vs-col>
            <vs-col class="w-1/12" style="text-align: center">-</vs-col>
            <vs-col class="w-4/12">
              <span style="width:100%; height:38px; display: flex; align-items: center;">{{ projectInfo.date_complete.substr(0,11) }}</span>
            </vs-col>
          </vs-row>
          <vs-row class="w-1/3  mb-4 flex" vs-align="center">
            <vs-col class="w-3/12 title pr-4" style="text-align: right">작성자</vs-col>
            <vs-col class="w-9/12">
              <span style="width:100%; height:38px; display: flex; align-items: center;">{{ form.writer }}</span>
            </vs-col>
          </vs-row>


          <vs-row class="w-1/3  mb-4 flex" vs-align="center">
            <vs-col class="w-3/12 title">지원구분</vs-col>
            <vs-col class="w-9/12">
              <span v-if="form.support_type === '1'" style="width:100%; height:38px; display: flex; align-items: center;">지원구분1</span>
              <span v-if="form.support_type === '2'" style="width:100%; height:38px; display: flex; align-items: center;">지원구분2</span>
              <span v-if="form.support_type === '3'" style="width:100%; height:38px; display: flex; align-items: center;">지원구분3</span>
              <span v-if="form.support_type === '4'" style="width:100%; height:38px; display: flex; align-items: center;">지원구분4</span>
              <span v-if="form.support_type === '5'" style="width:100%; height:38px; display: flex; align-items: center;">지원구분5</span>
            </vs-col>
          </vs-row>
          <vs-row class="w-1/3  mb-4 flex" vs-align="center">
            <vs-col class="w-3/12 title pr-4" style="text-align: right">지원일</vs-col>
            <vs-col class="w-9/12">
              <span style="width:100%; height:38px; display: flex; align-items: center;">{{ form.support_date.substr(0,11) }}</span>
            </vs-col>
          </vs-row>
          <vs-row class="w-1/3  mb-4 flex" vs-align="center">
          </vs-row>

        </vs-col>


        <!-- 지원결과 -->
        <vs-row class="mb-4">
          <vs-col><h5><i class="dot"></i>지원결과</h5></vs-col>
        </vs-row>
        <vs-col class="flex flex-wrap mb-4">

          <vs-row class="w-full  mb-4 flex" vs-align="center">
            <vs-col class="w-1/12 title">지원자</vs-col>
            <vs-col class="w-5/12">
              <span style="width:100%; height:38px; display: flex; align-items: center;">{{ form.supporter }}</span>
            </vs-col>
          </vs-row>

          <vs-row class="w-full  mb-4 flex" vs-align="center">
            <vs-col class="w-1/12 title">지원범위</vs-col>
            <vs-col class="w-7/12">
              <span style="width:100%; height:38px; display: flex; align-items: center;">{{ form.scope }}</span>
            </vs-col>
          </vs-row>

          <vs-row class="w-full  mb-4 flex" vs-align="center">
            <vs-col class="w-1/12 title">환경관리</vs-col>
            <vs-col class="w-11/12">
              <pre style="width:100%; text-align: left; white-space: pre-wrap;">{{ form.management }}</pre>
            </vs-col>
          </vs-row>

          <vs-row class="w-full  mb-4 flex" vs-align="center">
            <vs-col class="w-1/12 title">향후 지원 계획</vs-col>
            <vs-col class="w-11/12">
              <pre style="width:100%; text-align: left; white-space: pre-wrap;">{{ form.requirements }}</pre>
            </vs-col>
          </vs-row>

        </vs-col>

      </div>
    </div>

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
import DateSelector from '@/components/selector/DateSelector'
import FileUploadModule from '@/views/modules/FileUploadModule'

export default {
  name: 'SupportUpdate',
  components: {
    FileUploadModule,
    DateSelector,
    PopupAlert,
    ApprovalProcessModule
  },
  data () {
    return {
      isPrint: false,
      boardSlug: 'environment_support',

      // TODO : 글쓰기 정보 및 권한
      board: {
        slug: 'environment_support',
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
      approvalLine:[],

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
        sdate: '',
        edate: '',
        support_type: '1',
        support_date: '',
        supporter: '',
        scope: '',
        management: '',
        requirements: '',
        preview:{
          support_date:'',
          support_type:'',
          supporter:'',
          attach:[]
        }
      },
      fileList: [],
      oldForm:{}
    }
  },
  computed: {
    projectInfo () {
      return this.$store.state.project.projectInfo
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
  methods: {

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
      const title = this.projectInfo.field_name
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
      this.form.field_name = this.projectInfo.field_name
      this.form.sdate = this.projectInfo.date_work_start.substr(0, 11)
      this.form.edate = this.projectInfo.date_complete.substr(0, 11)
      this.form.preview.support_date = this.form.support_date
      this.form.preview.support_type = this.form.support_type
      this.form.preview.supporter = this.form.supporter
      this.form.preview.attach = this.fileList

      const content = JSON.stringify(this.form)

      try {
        if (isUploaded) {
          if (this.formCheck()) {
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
            this.back()
          }
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
          this.back()
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
      this.form.field_name = this.projectInfo.field_name
      this.form.sdate = this.projectInfo.date_work_start.substr(0, 11)
      this.form.edate = this.projectInfo.date_complete.substr(0, 11)
      this.form.preview.support_date = this.form.support_date
      this.form.preview.support_type = this.form.support_type
      this.form.preview.supporter = this.form.supporter
      this.form.preview.attach = this.fileList

      const content = JSON.stringify(this.form)

      try {
        if (isUploaded) {
          if (this.formCheck()) {
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
            this.back()
          }
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
          this.back()
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
      if (this.form.support_type.trim().length <= 0) {
        alert('지원구분을 선택해주세요')
        return false
      } else if (this.form.support_date.trim().length <= 0) {
        alert('지원일를 선택해주세요')
        return false
      } else if (this.form.supporter.trim().length <= 0) {
        alert('지원자를 입력해주세요')
        return false
      } else if (this.form.scope.trim().length <= 0) {
        alert('지원범위를 입력해주세요')
        return false
      } else if (this.form.management.trim().length <= 0) {
        alert('환경관리를 입력해주세요')
        return false
      } else if (this.form.requirements.trim().length <= 0) {
        alert('향후 지원 계획을 입력해주세요')
        return false
      }
      return true
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
      document.location.reload()
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

    handleClickClose () {
      this.back()
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

    alertUpload () {
      this.register(true)
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
      if (confirm('상신하시겠습니까?')) {
        this.register(true)
      }
    },

    handleSendApprovalProcess (process) {
      this.approvalLine = process
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
    }
  }
}
</script>

<style scoped>
</style>
