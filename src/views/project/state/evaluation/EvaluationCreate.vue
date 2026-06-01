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

              <vs-row class="w-1/3  mb-8 flex" vs-align="center">
                <vs-col class="w-3/12 title">구분</vs-col>
                <vs-row class="w-9/12">
                  <vs-col class="w-1/3">
                    <vs-radio v-model="form.work_type" vs-value="착공">착공</vs-radio>
                  </vs-col>
                  <vs-col class="w-1/3">
                    <vs-radio v-model="form.work_type" vs-value="준공">준공</vs-radio>
                  </vs-col>
                  <vs-col class="w-1/3">
                    <vs-radio v-model="form.work_type" vs-value="공사중지">공사중지</vs-radio>
                  </vs-col>
                </vs-row>
              </vs-row>
              <vs-row class="w-2/3  mb-4 flex" vs-align="center">
              </vs-row>

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
                <vs-col class="w-3/12 title pr-4">평가일</vs-col>
                <vs-col class="w-9/12">
                  <date-selector class="w-full" v-model="form.conference_date" :readonly="board.readonly"></date-selector>
                </vs-col>
              </vs-row>

              <vs-row class="w-1/3  mb-4 flex" vs-align="center">
                <vs-col class="w-3/12 title pr-4" style="text-align: right">공사중지일</vs-col>
                <vs-col class="w-9/12">
                  <date-selector class="w-full" v-model="form.stop_date" :readonly="board.readonly"></date-selector>
                </vs-col>
              </vs-row>

              <vs-row class="w-1/3  mb-4 flex" vs-align="center">
                <vs-col class="w-3/12 title pr-4" style="text-align: right">공사재개일</vs-col>
                <vs-col class="w-9/12">
                  <date-selector class="w-full" v-model="form.restart_date" :readonly="board.readonly"></date-selector>
                </vs-col>
              </vs-row>

            </vs-col>


            <!-- 평가내용 -->
            <vs-row class="mb-4">
              <vs-col><h5><i class="dot"></i>평가내용</h5></vs-col>
            </vs-row>
            <vs-col class="flex flex-wrap mb-4">

              <vs-row class="w-1/3  mb-4 flex" vs-align="center">
                <vs-col class="w-3/12 title">평가점수</vs-col>
                <vs-col class="w-9/12">
                  <ml-input class="w-full" v-model="form.point" :readonly="board.readonly"/>
                </vs-col>
              </vs-row>

              <vs-row class="w-1/3  mb-4 flex" vs-align="center">
                <vs-col class="w-3/12 title pr-4" style="text-align: right">평가등급</vs-col>
                <vs-col class="w-9/12">
                  <ml-input class="w-full" v-model="form.grade" :readonly="board.readonly"/>
                </vs-col>
              </vs-row>

              <vs-row class="w-1/3  mb-4 flex" vs-align="center">
              </vs-row>

              <vs-row class="w-full  mb-4 flex" vs-align="center">
                <vs-col class="w-1/12 title">공사중지 사유</vs-col>
                <vs-col class="w-11/12">
                  <ml-textarea v-model="form.reason" :readonly="board.readonly"/>
                </vs-col>
              </vs-row>


              <vs-row class="w-full  mb-4 flex" vs-align="center">
                <vs-col class="w-1/12 title">공사중지에 따른 영향 저감대책</vs-col>
                <vs-col class="w-11/12">
                  <ml-textarea v-model="form.measure" :readonly="board.readonly"/>
                </vs-col>
              </vs-row>
            </vs-col>

            <!-- 첨부파일 -->
            <file-upload-module id="state_evaluation_create" v-model="fileList"></file-upload-module>

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

import DateSelector from '@/components/selector/DateSelector'
import ApprovalProcessModule from '@/views/modules/ApprovalProcessModule'
import PopupAlert from '@/popup/PopupAlert'
import FileUploadModule from '@/views/modules/FileUploadModule'
export default {
  name: 'EvalutionCreate',
  components: {
    FileUploadModule,
    PopupAlert,
    ApprovalProcessModule,
    DateSelector},
  data () {
    return {
      boardSlug: 'environment_evaluation',

      // TODO : 글쓰기 정보 및 권한
      board: {
        slug: 'environment_evaluation',
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
          {label: '승인', action: 'ok'},
          {label: '취소', action: 'cancel'}
        ]
      },

      form:{
        work_type:'착공',
        field_name:'',
        writer:'',
        company: '',
        com_name:'',
        conference_date:'',
        stop_date:'',
        restart_date:'',

        point:'',
        grade:'',
        reason:'',
        measure:'',

        preview:{
          conference_date:'',
          attach: '',
          work_type:'',
          field_name:'',
          company:'',
          point:'',
          grade:''
        }
      },
      approvalLine: [], // 결재선 등록
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

      await this.$store.dispatch('company/LOAD_COMPANY', {companyId:this.board.writer.company_id})
      this.board.writer.company_name = this.$store.state.company.companyInfo.com_name

      const nowDate = new Date()
      this.form.project_date_year = nowDate.getFullYear()
      this.form.project_date_month = nowDate.getMonth() + 1
      this.form.writer = this.board.writer.name
      this.form.company = this.board.writer.company_name
      this.form.field_name = this.$store.state.project.projectInfo.field_name

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
      this.form.preview.conference_date = this.form.conference_date
      this.form.preview.work_type = this.form.work_type
      this.form.preview.field_name = this.form.field_name
      this.form.preview.point = this.form.point
      this.form.preview.grade = this.form.grade
      this.form.preview.attach = this.fileList
      this.form.preview.company = this.form.company
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
      if (this.form.conference_date.trim().length <= 0) {
        alert('평가일을 선택해주세요')
        return false
      } else if (this.form.stop_date.trim().length <= 0) {
        alert('공사중지일을 선택해주세요')
        return false
      } else if (this.form.restart_date.trim().length <= 0) {
        alert('공사재개일 선택해주세요')
        return false
      } else if (this.form.point.trim().length <= 0) {
        alert('평가점수를 입력해주세요')
        return false
      } else if (this.form.grade.trim().length <= 0) {
        alert('평가등급을 입력해주세요')
        return false
      } else if (this.form.reason.trim().length <= 0) {
        alert('공사중지 사유를 입력해주세요')
        return false
      } else if (this.form.measure.trim().length <= 0) {
        alert('공사중지에 따른 영향 저감대책을 입력해주세요')
        return false
      }
      return true
    },

    back () {
      this.$router.back()
    },

    handleClickRegister () {
      if (confirm('저장하시겠습니까?')) {
        this.register(false)
      }
    },

    handleClickClose () {
      this.back()
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
    }
  }
}
</script>

<style scoped>
</style>
