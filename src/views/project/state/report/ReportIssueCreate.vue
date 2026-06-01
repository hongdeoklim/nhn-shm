<template>
  <div>
    <vs-row>
      <vs-col class="w-9/12">

        <vx-card>
          <div>
            <vs-row class="mb-4">
              <vs-col class="mb-6 flex" vs-justify="flex-end">
                <vs-button class="mr-4" color="secondary" type="border" @click="handleBackMenu">목록</vs-button>
                <vs-button class="mr-4" color="secondary" @click="handleClickRegister">임시저장</vs-button>
              </vs-col>
            </vs-row>

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
                <vs-col class="w-3/12 title pr-4" style="text-align: right">작성자</vs-col>
                <vs-col class="w-9/12">
                  <ml-input class="w-full" :value="form.writer" :readonly="true"/>
                </vs-col>
              </vs-row>
              <vs-row class="w-1/3  mb-4 flex" vs-align="center">
                <vs-col class="w-3/12 title pr-4" style="text-align: right">소속</vs-col>
                <vs-col class="w-9/12">
                  <ml-input class="w-full" :value="form.company" :readonly="true"/>
                </vs-col>
              </vs-row>

              <vs-row class="w-1/3  mb-4 flex" vs-align="center">
                <vs-col class="w-3/12 title">오염원</vs-col>
                <vs-col class="w-9/12">
                  <vs-select class="selectExample w-full" autocomplete v-model="form.pollution_cause">
                    <vs-select-item :key="index" :value="item.value" :text="item.text"
                                    v-for=" (item, index) in checkList"/>
                  </vs-select>
                </vs-col>
              </vs-row>
              <vs-row class="w-1/3  mb-4 flex" vs-align="center">
                <vs-col class="w-3/12 title pr-4" style="text-align: right">발생일</vs-col>
                <vs-col class="w-9/12">
                  <date-selector class="w-full" v-model="form.occurrence_date"></date-selector>
                </vs-col>
              </vs-row>
              <vs-row class="w-1/3  mb-4 flex" vs-align="center">
                <vs-col class="w-3/12 title pr-4" style="text-align: right">작성일</vs-col>
                <vs-col class="w-9/12">
                  <date-selector class="w-full" v-model="form.write_date"></date-selector>
                </vs-col>
              </vs-row>

            </vs-col>


            <!-- 사고내용 -->
            <vs-row class="mb-8">
              <vs-col><h5><i class="dot"></i>사고내용</h5></vs-col>
            </vs-row>
            <vs-col class="flex flex-wrap mb-4">

              <vs-row class="w-full  mb-8 flex" vs-align="center">
                <vs-col class="w-1/12 title">점검기관</vs-col>
                <vs-row class="w-11/12">
                  <vs-col class="w-1/5">
                    <vs-checkbox v-model="form.checkAdmin">관할행정기관(시/군/구청)</vs-checkbox>
                  </vs-col>
                  <vs-col class="w-1/5">
                    <vs-checkbox v-model="form.checkMedia">대중매체(방송, 신문사)</vs-checkbox>
                  </vs-col>
                  <vs-col class="w-1/5">
                    <vs-checkbox v-model="form.checkOfficials">이해관계자(주민, NGO 단체 등)</vs-checkbox>
                  </vs-col>
                  <vs-col class="w-1/5">
                    <vs-checkbox v-model="form.checkEtc">기타</vs-checkbox>
                  </vs-col>
                </vs-row>
              </vs-row>


              <vs-row class="w-full  mb-4 flex" vs-align="center">
                <vs-col class="w-1/12 title">사고원인 및 내용 ( 6하원칙에 따라 상세하게 기술 )
                </vs-col>
                <vs-col class="w-11/12">
                  <ml-textarea v-model="form.contents" :readonly="board.readonly"/>
                </vs-col>
              </vs-row>


              <vs-row class="w-full  mb-4 flex" vs-align="center">
                <vs-col class="w-1/12 title">사고원인 및 내용 ( 6하원칙에 따라 상세하게 기술 )
                </vs-col>
                <vs-col class="w-11/12">
                  <ml-textarea v-model="form.process" :readonly="board.readonly"/>
                </vs-col>
              </vs-row>
            </vs-col>

            <!-- 첨부파일 -->
            <file-upload-module v-model="fileList"></file-upload-module>

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
import ApprovalProcessModule from '../../../modules/ApprovalProcessModule'
import PopupAlert from '../../../../popup/PopupAlert'
import DateSelector from '../../../../components/selector/DateSelector'
import FileUploadModule from '@/views/modules/FileUploadModule'

export default {
  name: 'ReportIssueCreate',
  components: {
    FileUploadModule,
    DateSelector,
    PopupAlert,
    ApprovalProcessModule
  },
  computed: {
    projectInfo () {
      return this.$store.state.project.projectInfo
    }
  },
  data () {
    return {
      boardSlug: 'environment_report_issue',

      // TODO : 글쓰기 정보 및 권한
      board: {
        slug: 'environment_report_issue',
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

      lastPage: 1,
      currentPage: 1,
      popupActive: false,

      checkList: [
        {
          text: '오염원1',
          value: '1'
        },
        {
          text: '오염원2',
          value: '2'
        },
        {
          text: '오염원3',
          value: '3'
        },
        {
          text: '오염원4',
          value: '4'
        },
        {
          text: '오염원5',
          value: '5'
        }
      ],

      form: {
        field_name: '',
        writer: '',
        company:'',
        pollution_cause: '',
        occurrence_date: '',
        write_date: '',
        checkAdmin: false,
        checkMedia: false,
        checkOfficials: false,
        checkEtc: false,
        contents: '',
        process: '',

        preview: {
          field_name: '',
          writer: '',
          company:'',
          pollution_cause: '',
          occurrence_date: '',
          write_date: '',
          attach:[]
        }
      },
      fileList: [],
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

    this.form.date = `${this.projectInfo.date_work_start.substr(0, 10)} ~ ${this.projectInfo.date_complete.substr(0, 10)}`
    this.oldForm = JSON.parse(JSON.stringify(this.form))
    //this.addEvalEmpty()
  },
  methods: {
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
    },

    async register (isUploaded) {
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
      this.form.preview.field_name = this.form.field_name
      this.form.preview.writer = this.form.writer
      this.form.preview.company = this.form.company
      this.form.preview.pollution_cause = this.form.pollution_cause
      this.form.preview.occurrence_date = this.form.occurrence_date
      this.form.preview.write_date = this.form.write_date
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
      if (this.form.pollution_cause.trim().length <= 0) {
        alert('오염원을 입력해주세요')
        return false
      } else if (this.form.occurrence_date.trim().length <= 0) {
        alert('발생일를 선택해주세요')
        return false
      } else if (this.form.write_date.trim().length <= 0) {
        alert('작성일를 선택해주세요')
        return false
      } else if (this.form.contents.trim().length <= 0) {
        alert('사고원인 및 내용을 입력하세요')
        return false
      } else if (this.form.process.trim().length <= 0) {
        alert('조치 및 대책을 입력하세요')
        return false
      }
      return true
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

    handleBackMenu () {
      this.$emit('handleBackMenu', 'issue')
    },

    handleClickRegister () {
      if (confirm('저장하시겠습니까?')) {
        this.register(false)
      }
    },

    handleClickUpload () {
      this.register(true)
    },
    handleSendApprovalProcess (process) {
      this.approvalLine = process
    },
    handleClickOk () {

    },
    handleClickNo () {

    },
    alertUpload () {

    }
  }
}
</script>

<style scoped>

</style>
