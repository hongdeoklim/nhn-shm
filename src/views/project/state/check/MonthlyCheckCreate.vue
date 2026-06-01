<template>
  <div>
    <vs-row>
      <vs-col class="w-9/12">

        <vx-card>
          <div>
            <vs-row class="mb-4">
              <vs-col class="flex" vs-justify="flex-end">
                <vs-button class="mr-2" color="secondary" type="border" @click="handleBackMenu">목록</vs-button>
                <vs-button color="secondary" @click="handleClickRegister">임시저장</vs-button>
              </vs-col>
            </vs-row>

            <!-- 기본정보 -->
            <vs-row class="mb-4">
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
                  <date-selector class="w-full" v-model="form.s_construction_date"></date-selector>
                </vs-col>
                <vs-col class="w-1/12" style="text-align: center">-</vs-col>
                <vs-col class="w-4/12">
                  <date-selector class="w-full" v-model="form.e_construction_date"></date-selector>
                </vs-col>
              </vs-row>
              <vs-row class="w-1/3  mb-4 flex" vs-align="center">
                <vs-col class="w-3/12 title pr-4" style="text-align: right">작성자</vs-col>
                <vs-col class="w-9/12">
                  <ml-input class="w-full" v-model="form.writer" :readonly="true"/>
                </vs-col>
              </vs-row>


              <vs-row class="w-1/3  mb-4 flex" vs-align="center">
                <vs-col class="w-3/12 title">점검기간</vs-col>
                <vs-col class="w-4/12">
                  <date-selector class="w-full" v-model="form.s_check_date"></date-selector>
                </vs-col>
                <vs-col class="w-1/12" style="text-align: center">-</vs-col>
                <vs-col class="w-4/12">
                  <date-selector class="w-full" v-model="form.e_check_date"></date-selector>
                </vs-col>
              </vs-row>
              <vs-row class="w-1/3  mb-4 flex" vs-align="center">
                <vs-col class="w-3/12 title pr-4" style="text-align: right">공정률</vs-col>
                <vs-col class="w-9/12">
                  <ml-input class="w-full" v-model="form.process_rate"
                            icon-pack="feather" icon="icon-percent" icon-after="true" type="number"
                            oninput="javascript: if (this.value > 100) this.value = 100; if(this.value < 0) this.value = 0;"/>
                </vs-col>
              </vs-row>
            </vs-col>

            <!-- 점검 인원 정보 -->
            <vs-row class="mb-4">
              <vs-col><h5><i class="dot"></i>점검 인원 정보</h5></vs-col>
            </vs-row>
            <vs-col class="flex flex-wrap mb-4">

              <vs-row class="w-1/3  mb-4 flex" vs-align="center">
                <vs-col class="w-3/12 title">시공사</vs-col>
                <vs-col class="w-9/12">
                  <member-selector v-model="form.main_contractor"/>
                </vs-col>
              </vs-row>
              <vs-row class="w-1/3  mb-4 flex" vs-align="center">
                <vs-col class="w-3/12 title pr-4" style="text-align: right">소속</vs-col>
                <vs-col class="w-9/12">
                  <member-selector v-model="form.sub_contractor"/>
                </vs-col>
              </vs-row>
              <vs-row class="w-1/3  mb-4 flex" vs-align="center">
                <vs-col class="w-3/12 title pr-4" style="text-align: right">그외</vs-col>
                <vs-col class="w-9/12">
                  <ml-input class="w-full" v-model="form.etc"/>
                </vs-col>
              </vs-row>
            </vs-col>

            <!-- 점검내용 -->
            <vs-row class="mb-4">
              <vs-col class="w-9/12"><h5><i class="dot"></i>점검내용</h5></vs-col>
              <vs-col class="w-3/12" style="text-align: right"><a @click="handleCheckAdd">+ 항목추가</a>&nbsp;&nbsp;<a
                @click="handleCheckDel">- 항목삭제</a></vs-col>
            </vs-row>

            <vs-row class="">
              <vs-col>
                <div class="border-top table-display">
                  <span class="title table-center">선택</span>
                  <span class="title table-center">항목</span>
                  <span class="title table-center">점검사항(개선요구사항)</span>
                  <span class="title table-center">이행책임자</span>
                  <span class="title table-center">조치기일</span>
                  <span class="title table-center">조치완료일</span>
                </div>
              </vs-col>
            </vs-row>

            <vs-row class="mb-8">
              <vs-col class="border-bottom">
                <div class="border-top table-display table-content"
                     :data="tr" :key="indextr" v-for="(tr, indextr) in form.checkList">

                  <span class="table-center"><vs-checkbox v-model="tr.isSelected"></vs-checkbox></span>
                  <span class="table-center"><ml-input v-model="tr.title"/></span>
                  <span class="table-center"><ml-input v-model="tr.content"/></span>
                  <span class="table-center"><member-selector v-model="tr.manager"/></span>
                  <span class="table-center"><div><date-selector class="ml-2 mr-2"
                                                                 v-model="tr.start_date"></date-selector></div></span>
                  <span class="table-center"><div><date-selector class="ml-2 mr-2" v-model="tr.end_date"
                                                                 :readonly="true"></date-selector></div></span>
                </div>
              </vs-col>
            </vs-row>

            <!-- 파일첨부 -->
            <vs-row class="mb-4">
              <file-upload-module class="w-full" v-model="fileList"></file-upload-module>
            </vs-row>

          </div>
        </vx-card>

      </vs-col>
      <vs-col class="w-3/12 pl-6">
        <approval-process-module
          :board="board"
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
import MemberSelector from '@/components/selector/MemberSelector'

export default {
  name: 'MonthlyCheckCreate',
  components: {
    MemberSelector,
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
      boardSlug: 'environment_check_monthly',
      // TODO : 글쓰기 정보 및 권한
      board: {
        slug: 'environment_check_monthly',
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

      form: {
        title: '환경-월간점검', //제목
        project_title: '', //현장명
        writer: '', //작성자
        s_check_date: '', //점검기간 시작
        e_check_date: '', //점검기간 종료
        s_construction_date: '', //대상기간 시작
        e_construction_date: '', //대상기간 종료
        process_rate: 0, //공정률
        main_contractor: '', //시공사인원
        sub_contractor: '', //파트너사인원
        etc: '', //그외
        checkList: [
          {
            isSelected: false,
            title: '',
            project_title: '',
            content: '',
            manager: '',
            start_date: '',
            end_date: ''
          }
        ], // 점검내용

        // preview
        preview: {
          title: '환경-월간점검', //제목
          writer: '', //작성자
          s_check_date: '', //점검기간 시작
          e_check_date: '', //점검기간 종료
          attach_file: [] //첨부파일
        }
      },
      fileList: [],

      checkListItem: {
        isSelected: false,
        title: '',
        content: '',
        manager: '',
        start_date: '',
        end_date: ''
      },

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

      this.form.writer = this.board.writer.name
      this.form.project_title = this.$store.state.project.projectInfo.field_name

      this.oldForm = JSON.parse(JSON.stringify(this.form))
    },

    async register (isUploaded) {
      if (isUploaded && !this.formCheck()) {
        return
      }

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

      this.form.s_check_date = new Date(this.form.s_check_date).format('yyyy-MM-dd')
      this.form.e_check_date = new Date(this.form.e_check_date).format('yyyy-MM-dd')
      this.form.s_construction_date = new Date(this.form.s_construction_date).format('yyyy-MM-dd')
      this.form.e_construction_date = new Date(this.form.e_construction_date).format('yyyy-MM-dd')

      for (let i = 0; i < this.form.checkList.length; i++) {
        this.form.checkList[i].start_date = new Date(this.form.checkList[i].start_date).format('yyyy-MM-dd')
        // this.form.checkList[i].end_date = new Date(this.form.checkList[i].end_date).format('yyyy-MM-dd')
      }

      // 리스트 노출 정보
      this.form.preview.project_title = this.form.project_title
      this.form.preview.writer = this.form.writer
      this.form.preview.s_check_date = this.form.s_check_date
      this.form.preview.e_check_date = this.form.e_check_date
      this.form.preview.attach_file = this.fileList


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

    formCheck () {
      if (this.form.s_check_date.trim().length <= 0
        || this.form.e_check_date.trim().length <= 0) {
        alert('점검기간을 입력해주세요')
        return false
      } else if (this.form.s_construction_date.trim().length <= 0
        || this.form.e_construction_date.trim().length <= 0) {
        alert('대상기간을 입력해주세요')
        return false
      }

      if (this.form.checkList.length > 0) {
        for (let i = 0; i < this.form.checkList.length; i++) {
          if (this.form.checkList[i].title.trim().length <= 0
            || this.form.checkList[i].content.trim().length <= 0
            || this.form.checkList[i].manager.length <= 0
            || this.form.checkList[i].start_date.trim().length <= 0
            // || this.form.checkList[i].end_date.trim().length <= 0
          ) {
            alert('점검내용을 입력해주세요')
            return false
          }
        }
      } else {
        alert('점검내용을 입력해주세요')
        return false
      }
      return true
    },

    handleCheckAdd () {
      const item = Object.assign({}, this.checkListItem)
      this.form.checkList.push(item)
    },
    handleCheckDel () {
      if (this.form.checkList.length <= 1) {
        if (this.form.checkList[0].isSelected === true) {
          alert('최소 하나이상의 점검항목이 필요합니다')
        }
        return
      }

      for (var i = 0; i < this.form.checkList.length; i++) {
        if (this.form.checkList[i].isSelected === true) {
          this.form.checkList.splice(i, 1)
          i--
        }
      }

      if (this.form.checkList.length === 0) {
        alert('최소 하나이상의 점검항목이 필요합니다')
        this.handleCheckAdd()
      }
    },

    handleBackMenu () {
      this.$emit('handleBackMenu', 'monthly')
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
    handleClickOk () {

    },
    handleClickNo () {

    },
    handleClickRegister () {
      if (confirm('저장하시겠습니까?')) {
        this.register(false)
      }
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
.table-display {
  display: grid;
  grid-template-rows: minmax(52px, 100%);
  grid-template-columns: 1fr repeat(3, minmax(0, 4fr)) repeat(2, minmax(0, 3fr));
  background-color: #F9F9F9;
}

.table-content {
  background-color: white;
}

.table-center {
  display: flex;
  height: 100%;
  align-items: center;
  justify-content: center;
}
</style>
