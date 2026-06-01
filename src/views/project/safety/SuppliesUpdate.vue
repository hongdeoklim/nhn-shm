<template>
  <div class="w-full">
    <vs-row class="mb-6">
      <vs-col class="w-9/12 flex" vs-justify="flex-end">
        <vs-button v-if="board.savable" class="mr-4" color="secondary" type="border" @click="handleDeletePost">삭제</vs-button>
        <vs-button class="mr-4" color="secondary" @click="handlePrint">인쇄</vs-button>
        <vs-button class="mr-4" color="secondary" type="border" @click="handleBackMenu">목록</vs-button>
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

              <vs-row class="w-1/2  mb-4 flex" vs-align="center">
                <vs-col class="w-4/12 title">현장명</vs-col>
                <vs-col class="w-8/12">
                  <ml-input class="w-full" :value="projectInfo.field_name" :readonly="true"/>
                </vs-col>
              </vs-row>
              <vs-row class="w-1/2  mb-4 flex" vs-align="center">
                <vs-col class="w-4/12 title pr-4" style="text-align: right">작성자</vs-col>
                <vs-col class="w-8/12">
                  <ml-input class="w-full" v-model="form.writer" :readonly="true"/>
                </vs-col>
              </vs-row>


              <vs-row class="w-1/2  mb-4 flex" vs-align="center">
                <vs-col class="w-4/12 title">근무구분</vs-col>
                <vs-col class="w-8/12">
                  <vs-select autocomplete class="w-full" v-model="form.workType" :disabled="board.readonly">
                    <vs-select-item text="근무구분1" value="workType1"/>
                    <vs-select-item text="근무구분2" value="workType2"/>
                    <vs-select-item text="근무구분3" value="workType3"/>
                    <vs-select-item text="근무구분4" value="workType4"/>
                    <vs-select-item text="근무구분5" value="workType5"/>
                  </vs-select>
                </vs-col>
              </vs-row>
              <vs-row class="w-1/2  mb-4 flex" vs-align="center">
                <vs-col class="w-4/12 title pr-4" style="text-align: right">소속</vs-col>
                <vs-col class="w-8/12">
                  <ml-input class="w-full" v-model="form.company" :readonly="true"/>
                </vs-col>
              </vs-row>

              <vs-row class="w-full  mb-4 flex" vs-align="center">
                <vs-col class="w-1/6 title">제목</vs-col>
                <vs-col class="w-5/6">
                  <ml-input class="w-full" v-model="form.title" :readonly="board.readonly"/>
                </vs-col>
              </vs-row>

            </vs-col>


            <!-- 평가서 내용 -->
            <vs-row class="my-4">
              <vs-col class="flex" vs-align="center">
                <h5><i class="dot"></i>구매 품목 정보</h5>
                <vs-col v-if="!board.readonly" class="w-auto ml-auto">
                  <vs-button class="mr-4" color="secondary" type="border" @click="handleClickAddOrder">+ 항목추가
                  </vs-button>
                  <vs-button class="mr-4" color="secondary" type="border" @click="handleClickRemoveOrder">- 항목삭제
                  </vs-button>
                </vs-col>
              </vs-col>
            </vs-row>

            <vs-row class="border mb-8">
              <vs-col>
                <ul class="table table-7">
                  <li>
                    <span class="title"><vs-checkbox v-model="orderAllCheck" @change="changeOrderAllCheck"></vs-checkbox></span>
                    <span class="title">품목명</span>
                    <span class="title">규격</span>
                    <span class="title">수량</span>
                    <span class="title">단가</span>
                    <span class="title">금액</span>
                    <span class="title">비고</span>
                  </li>

                  <safety-supplies-order-table-list :key="i" v-for="(data, i) in purchase_order_list"
                                                    v-model="purchase_order_list[i]"
                                                    :readonly="board.readonly"
                                                    @handleChangeChecked="handleOrderChangeChecked"
                  ></safety-supplies-order-table-list>

                </ul>
              </vs-col>
            </vs-row>

            <file-upload-module class="w-full" v-model="fileList" :readonly="board.readonly"></file-upload-module>

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


    <!-- 출력영역 -->

    <div v-if="isPrint" id="print-report">
      <div style="background: #fff;">
        <!-- 기본정보 -->
        <vs-row class="mb-8">
          <vs-col><h5><i class="dot"></i>기본정보</h5></vs-col>
        </vs-row>
        <vs-col class="flex flex-wrap mb-4">

          <vs-row class="w-1/2  mb-4 flex" vs-align="center">
            <vs-col class="w-4/12 title">현장명</vs-col>
            <vs-col class="w-8/12">
              {{projectInfo.field_name}}
            </vs-col>
          </vs-row>
          <vs-row class="w-1/2  mb-4 flex" vs-align="center">
            <vs-col class="w-4/12 title pr-4" style="text-align: right">작성자</vs-col>
            <vs-col class="w-8/12">
              {{form.writer}}
            </vs-col>
          </vs-row>


          <vs-row class="w-1/2  mb-4 flex" vs-align="center">
            <vs-col class="w-4/12 title">근무구분</vs-col>
            <vs-col class="w-8/12">
              <span v-if="form.workType === 'workType1'">근무구분1</span>
              <span v-if="form.workType === 'workType2'">근무구분2</span>
              <span v-if="form.workType === 'workType3'">근무구분3</span>
              <span v-if="form.workType === 'workType4'">근무구분4</span>
              <span v-if="form.workType === 'workType5'">근무구분5</span>
            </vs-col>
          </vs-row>
          <vs-row class="w-1/2  mb-4 flex" vs-align="center">
            <vs-col class="w-4/12 title pr-4" style="text-align: right">소속</vs-col>
            <vs-col class="w-8/12">
              {{form.company}}
            </vs-col>
          </vs-row>

          <vs-row class="w-full  mb-4 flex" vs-align="center">
            <vs-col class="w-1/6 title">제목</vs-col>
            <vs-col class="w-5/6">
              {{form.title}}
            </vs-col>
          </vs-row>

        </vs-col>


        <!-- 평가서 내용 -->
        <vs-row class="my-4">
          <vs-col class="flex" vs-align="center">
            <h5><i class="dot"></i>위험성평가</h5>
          </vs-col>
        </vs-row>

        <vs-row class="border mb-8">
          <vs-col>
            <ul class="table table-6 border">
              <li>
                <span class="title">품목명</span>
                <span class="title">규격</span>
                <span class="title">수량</span>
                <span class="title">단가</span>
                <span class="title">금액</span>
                <span class="title">비고</span>
              </li>

              <safety-supplies-order-table-list :key="i" v-for="(data, i) in purchase_order_list"
                                                v-model="purchase_order_list[i]"
                                                :isPrint="isPrint"
                                                :readonly="board.readonly"
                                                @handleChangeChecked="handleOrderChangeChecked"
              ></safety-supplies-order-table-list>

            </ul>
          </vs-col>
        </vs-row>
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

import PopupAlert from '@/popup/PopupAlert'
import ApprovalProcessModule from '@/views/modules/ApprovalProcessModule'
import SafetySuppliesOrderTableList from '@/views/project/safety/supplies/components/SafetySuppliesOrderTableList'
import FileUploadModule from '@/views/modules/FileUploadModule'

export default {
  name: 'SuppliesUpdate',
  components: {
    FileUploadModule,
    SafetySuppliesOrderTableList,
    ApprovalProcessModule,
    PopupAlert
  },
  computed:{
    projectInfo () {
      return this.$store.state.project.projectInfo
    }
  },
  data () {
    return {
      isPrint: false,
      boardSlug: 'safety_supplies',

      // TODO : 글쓰기 정보 및 권한
      board: {
        slug: 'safety_supplies',
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
      fileList: [], //파일리스트
      approvalLine: [], // 결재선 등록

      form: {
        title:'',
        writer:'',
        company:'',
        purchase_order_list: [],
        preview:{
          project_title:''
        }
      },
      orderAllCheck: false,
      purchase_order_list: [],
      oldForm:{},
      oldPurchaseOrderList:[]
    }
  },

  mounted () {
    const backButtonRouteGuard = this.$router.beforeEach((to, from, next) => {

      if (JSON.stringify(this.oldForm) === JSON.stringify(this.form)
        && JSON.stringify(this.oldPurchaseOrderList) === JSON.stringify(this.purchase_order_list)) {
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

    back () {
      this.$router.push({ path: '.' })
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
      this.purchase_order_list = this.form.purchase_order_list
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
      this.oldPurchaseOrderList = JSON.parse(JSON.stringify(this.purchase_order_list))
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
      const title = this.form.title
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

      this.form.project_title = this.projectInfo.field_name //현장명
      this.form.work_period = (new Date(this.projectInfo.date_complete) - new Date(this.projectInfo.date_work_start)) / (1000 * 60 * 60 * 24) //대상기간
      this.form.work_money_amount = this.projectInfo.work_money_amount //사업금액
      this.form.field_general_id = this.projectInfo.field_chief.name //안전보건부서장 최역소
      this.form.safety_chief_id = this.projectInfo.safety_chief.name //안전보건담당자

      // 리스트 노출 정보
      this.form.preview.project_title = this.form.project_title
      this.form.preview.attach = this.fileList
      this.form.purchase_order_list = this.purchase_order_list
      const content = JSON.stringify(this.form)

      try {
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
          this.oldPurchaseOrderList = JSON.parse(JSON.stringify(this.purchase_order_list))
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
          this.oldPurchaseOrderList = JSON.parse(JSON.stringify(this.purchase_order_list))
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

      this.form.project_title = this.projectInfo.field_name //현장명
      this.form.work_period = (new Date(this.projectInfo.date_complete) - new Date(this.projectInfo.date_work_start)) / (1000 * 60 * 60 * 24) //대상기간
      this.form.work_money_amount = this.projectInfo.work_money_amount //사업금액
      this.form.field_general_id = this.projectInfo.field_chief.name //안전보건부서장 최역소
      this.form.safety_chief_id = this.projectInfo.safety_chief.name //안전보건담당자

      // 리스트 노출 정보
      this.form.preview.project_title = this.form.project_title
      this.form.preview.attach = this.fileList
      this.form.purchase_order_list = this.purchase_order_list
      const content = JSON.stringify(this.form)

      try {
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
          this.oldPurchaseOrderList = JSON.parse(JSON.stringify(this.purchase_order_list))
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
          this.oldPurchaseOrderList = JSON.parse(JSON.stringify(this.purchase_order_list))
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

    addOrder (name, size, quantity, unit_price, price, etc) {
      this.purchase_order_list.push({
        is_checked:this.orderAllCheck,
        name, // 품목명
        size, // 규격
        quantity, // 수량
        unit_price, // 단가
        price, // 금액
        etc // 비고
      })
    },
    addOrderEmpty () {
      this.addOrder('', '', '', '', '', '')
    },
    changeOrderAllCheck () {
      for (const data of this.purchase_order_list) {
        data.is_checked = this.orderAllCheck
      }
    },
    handleClickAddOrder () {
      this.addOrderEmpty()
    },
    handleOrderChangeChecked () {
      let count = 0
      for (const data of this.purchase_order_list) {
        if (data.is_checked === true) {
          count++
        }
      }
      this.orderAllCheck = (Number(count) === Number(this.purchase_order_list.length))
    },
    handleClickRemoveOrder () {
      for (let i = 0; i < this.purchase_order_list.length; i++) {
        if (this.purchase_order_list[i].is_checked) {
          this.purchase_order_list.remove(this.purchase_order_list[i])
          i = -1
        }
      }

      this.orderAllCheck = false
    },
    handleClickClose () {
      this.back()
    },

    handleClickUpload () {
      this.register(true)
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
    handleSendApprovalProcess (process) {
      this.approvalLine = process
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

    // 글 삭제
    async handleDeletePost () {
      if (confirm('삭제하시겠습니까?')) {
        const boardSlug = this.boardSlug
        const postId = this.$route.params.postId
        if (postId <= 0) {
          return
        }
        await this.$store.dispatch('approval/DELETE_POST', {
          boardSlug,
          postId
        })

        this.oldForm = JSON.parse(JSON.stringify(this.form))
        this.oldPurchaseOrderList = JSON.parse(JSON.stringify(this.purchase_order_list))

        this.$router.back()
      }
    },

    handleBackMenu () {
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
      this.oldPurchaseOrderList = JSON.parse(JSON.stringify(this.purchase_order_list))
      document.location.reload()
    },

    alertPrint () {
      this.print()
    }
  }
}
</script>

<style scoped>
</style>
