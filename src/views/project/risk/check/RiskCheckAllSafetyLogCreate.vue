<template>
  <div>
    <vs-row>
      <vs-col class="w-9/12">
        <vx-card>
          <vs-col class="mb-2 flex" vs-justify="flex-end">
            <vs-button class="mr-4" color="secondary" type="border" @click="handleBackMenu">목록</vs-button>
            <vs-button class="" color="secondary" @click="handleClickRegister">임시저장</vs-button>
          </vs-col>

          <!-- 기본정보 -->
          <vs-row class="mb-4">
            <vs-col><h5><i class="dot"></i>기본정보</h5></vs-col>
          </vs-row>
          <vs-col class="mb-4 flex flex-wrap" >
            <vs-row class="w-1/2 px-4 mb-4 mr-2 flex" vs-align="center">
              <vs-col class="w-3/12 title">제목</vs-col>
              <vs-col class="w-9/12"><ml-input class="w-full" v-model="form.title"/></vs-col>
            </vs-row>
            <vs-row class="w-1/2 px-4 mb-4 flex" vs-align="center">
              <vs-col class="w-3/12 title pr-4 ">현장명</vs-col>
              <vs-col class="w-9/12"><ml-input class="w-full" v-model="form.project_title" :readonly="true" /></vs-col>
            </vs-row>
            <vs-row class="w-1/2 px-4 mb-4 flex" vs-align="center">
              <vs-col class="w-3/12 title pr-4 text-right">점검일</vs-col>
              <vs-col class="w-9/12"><date-selector class="w-full" v-model="form.checkDate"/> </vs-col>
            </vs-row>
          </vs-col>

          <!-- 주요작업 및 위험작업 -->
          <vs-row>
            <vs-col class="">
              <h5 class="mb-4"><i class="dot"></i>점검 인원 정보</h5>
            </vs-col>
          </vs-row>
          <vs-col class="mb-4 flex flex-wrap" >
            <vs-row class="w-1/2 px-4 mb-4 mr-2 flex" vs-align="center">
              <vs-col class="w-3/12 title">시공사</vs-col>
              <vs-col class="w-9/12">
                <vs-select autocomplete v-model="form.member1">
                  <vs-select-item v-for="(item) in members" :key="item.id" :value="item.id" :text="item.name"/>
                </vs-select>
              </vs-col>
            </vs-row>
            <vs-row class="w-1/2 px-4 mb-4 flex" vs-align="center">
              <vs-col class="w-3/12 title pr-4 ">소속</vs-col>
              <vs-col class="w-9/12">
                <vs-select autocomplete v-model="form.member2">
                  <vs-select-item v-for="item in members" :key="item.id" :value="item.id" :text="item.name"/>
                </vs-select>
              </vs-col>
            </vs-row>
          </vs-col>


          <vs-row>
            <vs-col class="mb-4 flex" vs-align="center">
              <h5><i class="dot"></i>점검내용</h5>
              <vs-col class="w-auto ml-auto" >
                <vs-button class="mr-4" color="secondary" type="border" @click="handleClickAddEval">+ 항목추가</vs-button>
                <vs-button class="mr-4" color="secondary" type="border" @click="handleClickRemoveEval">- 항목삭제</vs-button>
              </vs-col>
            </vs-col>
          </vs-row>
          <vs-row class="mb-8">
            <vs-col class="border">
              <ul class="table table-no-3">
                <li>
                  <p>선택</p>
                  <p>지적사항</p>
                  <p>소속</p>
                  <p>조치기일</p>
                </li>
                <li class="tbody" v-for="(item, index) in form.pointoutList" :key="index">
                  <p class="p-2"><vs-checkbox v-model="item.is_checked"></vs-checkbox></p>
                  <p class="p-2"><ml-input class="w-full" v-model="item.text1"/></p>
                  <p class="p-2"><ml-input class="w-full" v-model="item.text2"/></p>
                  <p class="p-2"><date-selector class="w-full" v-model="item.date"/></p>
                </li>
              </ul>
            </vs-col>
          </vs-row>

          <vs-row>
            <vs-col class="">
              <h5 class="mb-4"><i class="dot"></i>현장점검내용(이슈사항, 합동점검,특별작업 등)</h5>
            </vs-col>
          </vs-row>
          <vs-row class="mb-4">
            <vs-col>
              <ml-textarea
                class="w-full"
                rows="5"
                v-model="form.comment2"
              />
            </vs-col>
          </vs-row>

          <file-upload-module id="bottom" v-model="fileList"/>
        </vx-card>
      </vs-col>
      <vs-col class="w-3/12 pl-6">
        <approval-process-module
          :board = "board"
          :commentabled="!(board.isCompleteApproval || board.savable)"

          @handleClickUpload="handleClickUpload"
          @handleSendApprovalProcess = "handleSendApprovalProcess"
        ></approval-process-module>

      </vs-col>
    </vs-row>

    <!-- TODO : 얼럿데이터 -->
    <popup-alert v-model="alert.show"
                 :message="alert.message"
                 :buttons="alert.buttons"

                 @upload="alertUpload"/>
  </div>
</template>

<script>
import ApprovalProcessModule from '@/views/modules/ApprovalProcessModule'
import DateSelector from '@/components/selector/DateSelector'
import FileUploadModule from '@/views/modules/FileUploadModule'
import PopupAlert from '@/popup/PopupAlert'
export default {
  name: 'RiskCheckAllSafetyLogCreate',
  components: {
    PopupAlert,
    FileUploadModule,
    DateSelector,
    ApprovalProcessModule
  },
  data () {
    return {
      boardSlug: 'joint_check_diary',
      selectItem:{},

      // TODO : 글쓰기 정보 및 권한
      board:{
        slug:'joint_check_diary',
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

      members:[],
      form:{
        title:'', //제목
        project_title:'', //현장명
        checkDate:'', //점검일
        member1:[], //시공사
        member2:[], //파트너사

        pointoutList:[], // 지적사항
        comment2:'', // 현장점검내용(이슈사항, 합동점검,특별작업 등)

        // preview
        preview: {
          title: '',
          project_title:'',
          checkDate:'',
          writer:''
        }
      },
      fileList:[], //파일리스트

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

    const page = 1
    const perPage = 10000
    const keyword = ''
    await this.$store.dispatch('member/LOAD_MEMBERS', {page, perPage, keyword, projectId: this.$route.params.proj_id})
    this.members = this.$store.state.member.list

    this.oldForm = JSON.parse(JSON.stringify(this.form))
  },

  methods:{

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

      const company = this.$store.state.project.projectInfo.constructor_company
      this.form.writer = this.board.writer.name
      this.form.project_title = this.$store.state.project.projectInfo.field_name
      this.form.company = (company) ? company.com_name : ''
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

      this.form.preview.title = this.form.title
      this.form.preview.project_title = this.form.project_title
      this.form.preview.checkDate = this.form.checkDate
      this.form.preview.writer = this.form.writer
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
          await this.$store.dispatch('approval/CREATE_POST', {projectId, boardSlug, title, content, approvalLine, security, priority, uploads, isTemp})
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
    handleClickAddEval () {

      this.form.pointoutList.push({
        is_checked: false,
        text1:'',
        text2:'',
        date:''
      })
    },
    handleClickRemoveEval () {
      for (let i = 0; i < this.form.pointoutList.length; i++) {
        if (this.form.pointoutList[i].is_checked) {
          this.form.pointoutList.remove(this.form.pointoutList[i])
          i = -1
        }
      }
    },

    handleBackMenu () {
      this.$emit('handleBackMenu', 'checklogall')
    },

    showPopupUploadImages () {
      this.popupUploadImage = true
    },

    handleClickFileUpload () {
      this.popupUploadImage = true
    },

    handleClose () {
      this.selectItem = {}
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

ul.table.table-no-3 > li { grid-template-columns: 54px repeat(3, minmax(0,1fr)); }
</style>
