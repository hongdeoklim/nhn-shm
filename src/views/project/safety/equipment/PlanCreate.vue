<template>
  <div class="w-full">
    <popup-equipment-result
      :popupActive="popupActive"
      @popupActiveSync="popupActiveSync">
    </popup-equipment-result>
    <vs-row :class="getClasses">
      <vs-col style="position: relative">

        <vx-card style="width:calc(100% - 40px)">
          <div>
            <vs-row class="mb-4">
              <vs-col class="flex" vs-justify="flex-end">
                <vs-button class="mr-4" color="secondary" type="border" @click="handleClickClose">닫기</vs-button>
                <vs-button class="" color="secondary" @click="handleClickRegister">임시저장</vs-button>
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
                <vs-col class="w-4/12 title">장비명</vs-col>
                <vs-col class="w-8/12">
                  <ml-input class="w-full" v-model="form.work_type" :readonly="board.readonly"/>
                </vs-col>
              </vs-row>
              <vs-row class="w-1/2  mb-4 flex" vs-align="center">
                <vs-col class="w-4/12 title pr-4" style="text-align: right">부서</vs-col>
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


            <!-- 점검계획 -->
            <vs-row class="my-4">
              <vs-col class="flex" vs-align="center">
                <h5><i class="dot"></i>점검계획</h5>
              </vs-col>
            </vs-row>
            <vs-row class="w-full  mb-4 flex" vs-align="center">
              <vs-col class="w-1/12 title">점검계획일</vs-col>
              <vs-col class="w-auto mr-auto">
                <date-selector class="w-full" v-model="form.check_date"/>
              </vs-col>
              <vs-col v-if="!board.readonly" class="w-auto ml-auto">
                <vs-button class="mr-4" color="secondary" type="border" @click="handleClickAddPlan">+ 항목추가
                </vs-button>
                <vs-button class="mr-4" color="secondary" type="border" @click="handleClickRemovePlan">- 항목삭제
                </vs-button>
              </vs-col>
            </vs-row>
            <vs-row class="border mb-8">
              <vs-col>
                <ul class="table table-8 border-bottom">
                  <li>
                    <span class="title"><vs-checkbox v-model="planAllCheck"
                                                     @change="changePlanAllCheck"></vs-checkbox></span>
                    <span class="title">장비명</span>
                    <span class="title">규격</span>
                    <span class="title">관리번호</span>
                    <span class="title">모델명</span>
                    <span class="title">제조사</span>
                    <span class="title">안전인증일/<br>인증기관</span>
                    <span class="title">안전-정기 검사일/<br>검사기관</span>
                  </li>

                  <safety-equipment-plan-table-list :key="i" v-for="(data, i) in plan_list"
                                                    v-model="plan_list[i]"
                                                    :readonly="board.readonly"
                                                    @handleChangeChecked="handlePlanChangeChecked"
                  ></safety-equipment-plan-table-list>

                </ul>
              </vs-col>
            </vs-row>

            <!-- -->
            <file-upload-module class="w-full" v-model="fileList"></file-upload-module>

          </div>
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
          :board="board"
          :commentabled="!(board.isCompleteApproval || board.savable)"

          @handleClickUpload="handleClickUpload"
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
    ></popup-alert>
  </div>
</template>

<script>
import ApprovalProcessModule from '@/views/modules/ApprovalProcessModule'
import PopupAlert from '../../../../popup/PopupAlert'
import DateSelector from '../../../../components/selector/DateSelector'
import PopupEquipmentResult from '../../popup/PopupEquipmentResult'
import VueCookie from 'vue-cookie'
import SafetyEquipmentPlanTableList from '@/views/project/safety/equipment/components/SafetyEquipmentPlanTableList'
import FileUploadModule from '@/views/modules/FileUploadModule'

export default {
  name: 'PlanCreate',
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

      // TODO : 글쓰기 정보 및 권한
      board: {
        slug: 'construction_equipment',
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
      oldForm:{},
      oldPlanList:[],
      fileList: [],

      toggleSide: true
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
    // 초기화
    this.form.check_date = VueCookie.get('equipment_create_selectday')
    await this.init()
  },

  methods: {
    onClickToggleSide () {
      this.toggleSide = !this.toggleSide
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
      await this.$store.dispatch('company/LOAD_COMPANY', {companyId: this.board.writer.company_id})
      this.board.writer.company_name = this.$store.state.company.companyInfo.com_name
      this.form.writer = this.board.writer.name
      this.form.company = this.board.writer.company_name

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
    addPlanEmpty () {
      this.addPlan('', '', '', '', '', '')
    },
    changePlanAllCheck () {
      for (const data of this.plan_list) {
        data.is_checked = this.orderAllCheck
      }
    },
    handleClickRegister () {
      if (confirm('저장하시겠습니까?')) {
        this.register(false)
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
    handleClickRemovePlan () {
      for (let i = 0; i < this.plan_list.length; i++) {
        if (this.plan_list[i].is_checked) {
          this.plan_list.remove(this.plan_list[i])
          i = -1
        }
      }

      this.planAllCheck = false
    },

    handleClickResult () {
      this.popupActive = true
    },

    handleBackMenu () {
      this.$emit('handleBackMenu', 'plan')
    },

    popupActiveSync () {
      this.popupActive = false
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

    handleSendApprovalProcess (process) {
      this.approvalLine = process
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
