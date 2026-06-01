<template>
  <div>

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
                  <vs-select autocomplete class="w-full" v-model="form.support_type">
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
                  <date-selector class="w-full" v-model="form.support_date"></date-selector>
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
            <file-upload-module id="state_support_create" v-model="fileList" :visible-title="false"></file-upload-module>

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
import ApprovalProcessModule from '@/views/modules/ApprovalProcessModule'
import PopupAlert from '@/popup/PopupAlert'
import DateSelector from '@/components/selector/DateSelector'
import FileUploadModule from '@/views/modules/FileUploadModule'

export default {
  name: 'SupportCreate',
  components: {
    FileUploadModule,
    DateSelector,
    PopupAlert,
    ApprovalProcessModule
  },
  data () {
    return {
      boardSlug: 'environment_support',

      // TODO : 글쓰기 정보 및 권한
      board: {
        slug: 'environment_support',
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
    this.init()
  },
  methods: {
    async init () {
      await this.$store.dispatch('USER_INFO')
      this.board.writer = {
        id: this.$store.state.auth.userInfo.id,
        name: this.$store.state.auth.userInfo.name,
        company_id: this.$store.state.auth.userInfo.company_id,
        company_name: this.$store.state.auth.userInfo.company_name
      }

      const nowDate = new Date()
      this.form.project_date_year = nowDate.getFullYear()
      this.form.project_date_month = nowDate.getMonth() + 1
      this.form.writer = this.board.writer.name
      this.form.field_name = this.$store.state.project.projectInfo.field_name

      this.oldForm = JSON.parse(JSON.stringify(this.form))
    },
    back () {
      this.$router.back()
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

    handleClickRegister () {
      if (confirm('저장하시겠습니까?')) {
        this.register(false)
      }
    },

    handleClickClose () {
      this.back()
    },

    alertUpload () {
      this.register(true)
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
