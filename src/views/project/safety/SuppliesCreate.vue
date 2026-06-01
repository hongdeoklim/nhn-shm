<template>
  <div class="w-full">
    <vs-row class="mb-6">
      <vs-col class="w-9/12 flex " vs-justify="flex-end">
        <vs-button class="mr-4" color="secondary" type="border" @click="handleClickClose">닫기</vs-button>
        <vs-button class="" color="secondary" @click="handleClickRegister">임시저장</vs-button>
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
                  <vs-select autocomplete class="w-full" v-model="form.workType">
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
                  <ml-input class="w-full" v-model="form.title"/>
                </vs-col>
              </vs-row>

            </vs-col>

            <!-- 평가서 내용 -->
            <vs-row class="my-4">
              <vs-col class="flex" vs-align="center">
                <h5><i class="dot"></i>구매 품목 정보</h5>
                <vs-col class="w-auto ml-auto">
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

            <file-upload-module class="w-full" v-model="fileList"></file-upload-module>

          </div>
        </vx-card>

      </vs-col>
      <vs-col class="w-3/12 pl-6">
        <approval-process-module
          :board="board"
          :commentabled="!(board.isCompleteApproval || board.savable)"
          @handleClickUpload="handleClickUpload"
          @handleSendApprovalProcess="handleSendApprovalProcess"
        ></approval-process-module>
      </vs-col>
    </vs-row>

    <!-- TODO : 얼럿데이터 -->
    <popup-alert v-model="alert.show"
                 :message="alert.message"
                 :buttons="alert.buttons"

                 @upload="alertUpload"
    ></popup-alert>

  </div>
</template>

<script>

import PopupAlert from '@/popup/PopupAlert'
import ApprovalProcessModule from '@/views/modules/ApprovalProcessModule'
import SafetySuppliesOrderTableList from '@/views/project/safety/supplies/components/SafetySuppliesOrderTableList'
import FileUploader from '@/components/FileUploader'
import FileUploadModule from '@/views/modules/FileUploadModule'

export default {
  name: 'SuppliesCreate',
  components: {
    FileUploadModule,
    FileUploader,
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
      boardSlug: 'safety_supplies',

      // TODO : 글쓰기 정보 및 권한
      board: {
        slug: 'safety_supplies',
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

  async created () {
    // 초기화
    await this.init()
  },
  methods: {
    back () {
      this.$router.push({ path: '.' })
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
      this.form.writer = this.board.writer.name
      this.form.company = this.board.writer.company_name

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
            isTemp,
            uploads
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
    handleClickRegister () {
      if (confirm('저장하시겠습니까?')) {
        this.register(false)
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
      this.alert.buttons = [
        { label:'상신', action:'upload' },
        { label:'취소', action:'cancel', type:'border' }
      ]
      this.alert.show = true
    },
    handleClickOk () {

    },
    handleClickNo () {

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
    }
  }
}
</script>

<style scoped>
</style>
