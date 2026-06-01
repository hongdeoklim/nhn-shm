<template>
  <div>
    <vs-row :class="getClasses">
      <vs-col style="position: relative">
        <vx-card style="width:calc(100% - 40px)">
          <vs-row class="mb-8 ">
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
                <vs-col class="w-3/12">현장명</vs-col>
                <vs-col class="w-9/12"><ml-input class="w-full" v-model="form.project_title" :readonly="true"/></vs-col>
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
                <vs-col class="w-9/12"><date-selector class="popup-fixed w-full" v-model="form.meetingDate"/></vs-col>
              </vs-row>
              <vs-row class="w-1/2 px-4 mb-4 flex" vs-align="center">
              </vs-row>
              <vs-row class="w-1/2 px-4 mb-4 flex" vs-align="center">
                <vs-col class="w-3/12">회의장소</vs-col>
                <vs-col class="w-9/12"><ml-input class="w-full" v-model="form.meetingPlace"/></vs-col>
              </vs-row>
              <vs-row class="w-1/2 px-4 mb-4 flex" vs-align="center">
                <vs-col class="w-3/12">회의구분</vs-col>
                <vs-col class="w-9/12">
                  <vs-select autocomplete class="w-full" value="1" v-model="form.meetingType">
                    <vs-select-item value="산업안전보건위원회" text="산업안전보건위원회" ></vs-select-item>
                  </vs-select>
                </vs-col>
              </vs-row>
              <vs-row class="w-1/2 px-4 mb-4 flex" vs-align="center">
                <vs-col class="w-3/12">출석위원</vs-col>
                <vs-col class="w-9/12">
                  <vs-row vs-align="center">
                    <vs-col class="w-3/12">시공사</vs-col>
                    <vs-col class="w-9/12"><ml-input class="w-full" v-model="form.company1"/></vs-col>
                  </vs-row>
                </vs-col>
              </vs-row>
              <vs-row class="w-1/2 px-4 mb-4 flex" vs-align="center">
                <vs-col class="w-3/12">파트너사 및 근로자</vs-col>
                <vs-col class="w-9/12"><ml-input class="w-full" v-model="form.company2"/></vs-col>
              </vs-row>
              <vs-row class="w-full px-4 mb-4 flex" vs-align="start">
                <vs-col class="pt-2 pr-2" style="width:12.5%;">협의 및 심의</vs-col>
                <vs-col class="m-0" style="width:87.5%;"><ml-textarea class="m-0 w-full" v-model="form.comment1"/></vs-col>
              </vs-row>
              <vs-row class="w-full px-4 mb-4 flex" vs-align="start">
                <vs-col class="pt-2 pr-2" style="width:12.5%;">결정사항</vs-col>
                <vs-col class="" style="width:87.5%;"><ml-textarea class="m-0 w-full" v-model="form.comment2"/></vs-col>
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
import DateSelector from '@/components/selector/DateSelector'
import FileUploadModule from '@/views/modules/FileUploadModule'
import PopupAlert from '@/popup/PopupAlert'
export default {
  name: 'RiskConferenceSafetyCreate',
  components: {
    PopupAlert,
    FileUploadModule,
    DateSelector,
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

  async created () {
    // 초기화
    await this.init()

    this.oldForm = JSON.parse(JSON.stringify(this.form))
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

    async init () {
      await this.$store.dispatch('USER_INFO')
      this.board.writer = {
        id: this.$store.state.auth.userInfo.id,
        name: this.$store.state.auth.userInfo.name,
        company_id: this.$store.state.auth.userInfo.company_id,
        company_name: this.$store.state.auth.userInfo.company_name
      }

      this.form.writer = this.board.writer.name
      this.form.project_title = this.$store.state.project.projectInfo.field_name
      this.form.company = this.$store.state.project.projectInfo.constructor_company.com_name
      const wStart = this.$store.state.project.projectInfo.date_work_start
      const wCompleteEx = this.$store.state.project.projectInfo.date_complete_expected
      if (wStart && wCompleteEx) {
        this.form.date = `${wStart.substr(0, 10)} ~ ${wCompleteEx.substr(0, 10)}`
      } else {
        this.form.date = ''
      }
    },
    async register (isUploaded) {
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
        }
      }
      //this.back()

    },

    handleBackMenu () {
      this.$emit('handleBackMenu', 'safety')
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
