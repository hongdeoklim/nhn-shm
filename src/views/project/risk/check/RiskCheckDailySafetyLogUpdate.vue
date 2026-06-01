<template>
  <div>
    <vs-row>
      <vs-col class="w-9/12">
        <vx-card>
          <vs-col class="mb-2 flex" vs-justify="flex-end">

            <vs-button v-if="board.savable" class="mr-4" color="secondary" type="border" @click="handleDeletePost">삭제
            </vs-button>
            <vs-button class="mr-4" color="secondary" type="border" @click="handleBackMenu">목록</vs-button>
            <vs-button v-if="board.savable" class="" color="secondary" @click="handleClickUpdate">임시저장</vs-button>
            <vs-button v-if="board.collection" class="" color="secondary" @click="handleClickCollection">결재 문서 회수
            </vs-button>
            <vs-button v-if="board.resend" class="" color="secondary" @click="handleClickRegister">임시저장 후 재상신
            </vs-button>
          </vs-col>

          <!-- 기본정보 -->
          <vs-row class="mb-4">
            <vs-col><h5><i class="dot"></i>기본정보</h5></vs-col>
          </vs-row>
          <vs-col class="mb-4 flex flex-wrap">
            <vs-row class="w-1/2 px-4 mb-4 flex" vs-align="center">
              <vs-col class="w-3/12 title">{{ $t('project.risk.check.checklog.update.현장명') }}</vs-col>
              <vs-col class="w-9/12">
                <ml-input class="w-full" v-model="form.project_title" :readonly="true"/>
              </vs-col>
            </vs-row>
            <vs-row class="w-1/2 px-4 mb-4 flex" vs-align="center">
              <vs-col class="w-3/12 title">대상기간</vs-col>
              <vs-col class="w-9/12"><date-selector class="w-full" v-model="form.date"/></vs-col>
            </vs-row>
            <vs-row class="w-1/2 px-4 mb-4 flex" vs-align="center">
              <vs-col class="w-3/12 title pr-4 ">소속</vs-col>
              <vs-col class="w-9/12">
                <ml-input class="w-full" v-model="form.com_name" :readonly="true"/>
              </vs-col>
            </vs-row>
            <vs-row class="w-1/2 px-4 mb-4 flex" vs-align="center">
              <vs-col class="w-3/12 title">점검일</vs-col>
              <vs-col class="w-9/12">
                <date-selector class="w-full" v-model="form.checkDate" :readonly="board.readonly"/>
              </vs-col>
            </vs-row>
            <vs-row class="w-1/2 px-4 mb-4 flex" vs-align="center">
              <vs-col class="w-3/12 title pr-4 ">작성자</vs-col>
              <vs-col class="w-9/12">
                <ml-input class="w-full" v-model="form.writer" :readonly="true"/>
              </vs-col>
            </vs-row>
          </vs-col>

          <!-- 주요작업 및 위험작업 -->
          <vs-row>
            <vs-col class="flex mb-2">
              <h5 class="mb-4"><i class="dot"></i>주요작업 및 점검내용</h5>
              <vs-spacer/>
            </vs-col>
          </vs-row>
          <vs-row class="mb-4">
            <vs-col>
              <ml-textarea
                class="w-full"
                rows="5"
                v-model="form.comment1"
                :readonly="board.readonly"
              />
            </vs-col>
          </vs-row>

          <vs-row>
            <vs-col class="flex">
              <h5 class="mb-4"><i class="dot"></i>중점 점검항목 - A등급</h5>
              <vs-spacer></vs-spacer>
              <a class="mr-4" @click="()=>{handleCheckAdd(1)}">+ 항목추가</a>
              <a class="mr-4" @click="()=>{handleClickRemoveEval(1)}">+ 항목삭제</a>
            </vs-col>
          </vs-row>
          <vs-row class="mb-8">
            <vs-col class="border">
              <ul class="table table-10">
                <li>
                  <p class="p-2" @click="onClickCheckAll(1)">
                    <vs-checkbox :value="isCheckAll1" :readonly="board.readonly" ></vs-checkbox>
                  </p>
                  <p>No.</p>
                  <p>소속</p>
                  <p>대상공종</p>
                  <p>위치/장소</p>
                  <p>위험요인</p>
                  <p>재해형태</p>
                  <p>안전보건대책</p>
                  <p>안전대책이행</p>
                  <p>점검결과 조치사항</p>
                </li>
                <li class="tbody" v-for="(item, index) in list1" :key="index" >
                  <p class="p-2">
                    <vs-checkbox v-model="item.is_checked" :readonly="board.readonly"></vs-checkbox>
                  </p>
                  <p class="p-2">{{index}}</p>
                  <p class="p-2"><ml-input class="w-full" v-model="item.com_name"/> </p>
                  <p class="p-2"><ml-textarea class="w-full m-0" v-model="item.work_unit"/> </p>
                  <p class="p-2"><ml-input class="w-full" v-model="item.location"/> </p>
                  <p class="p-2"><ml-textarea class="w-full m-0" v-model="item.risk_factor"/> </p>
                  <p class="p-2"><disaster-type-selector class="w-full" v-model="item.disaster_type"/> </p>
                  <p class="p-2"><ml-textarea class="w-full m-0" v-model="item.safety_measures"/> </p>
                  <p class="p-2">
                    <vs-select autocomplete class="w-full m-0" v-model="item.exe">
                      <vs-select-item text="Y" value="Y"/>
                      <vs-select-item text="N" value="N"/>
                    </vs-select>
                  </p>
                  <p class="p-2 text-center" style="cursor: pointer">
                    <ml-textarea class="m-0" v-model="item.etc"/>
                  </p>
                </li>
              </ul>
            </vs-col>
          </vs-row>

          <vs-row>
            <vs-col class="flex">
              <h5 class="mb-4"><i class="dot"></i>일상 점검항목-B,C 등급</h5>
              <vs-spacer></vs-spacer>
              <a class="mr-4" @click="()=>{handleCheckAdd(2)}">+ 항목추가</a>
              <a class="mr-4" @click="()=>{handleClickRemoveEval(2)}">+ 항목삭제</a>
            </vs-col>
          </vs-row>
          <vs-row class="mb-8">
            <vs-col class="border">
              <ul class="table table-10">
                <li>
                  <p class="p-2" @click="onClickCheckAll(2)">
                    <vs-checkbox :value="isCheckAll2" :readonly="board.readonly" ></vs-checkbox>
                  </p>
                  <p>No.</p>
                  <p>소속</p>
                  <p>대상공종</p>
                  <p>위치/장소</p>
                  <p>위험요인</p>
                  <p>재해형태</p>
                  <p>안전보건대책</p>
                  <p>안전대책이행</p>
                  <p>점검결과 조치사항</p>
                </li>
                <li class="tbody" v-for="(item, index) in list2" :key="index" >
                  <p class="p-2">
                    <vs-checkbox v-model="item.is_checked" :readonly="board.readonly"></vs-checkbox>
                  </p>
                  <p class="p-2">{{index}}</p>
                  <p class="p-2"><ml-input class="w-full" v-model="item.com_name"/> </p>
                  <p class="p-2"><ml-textarea class="w-full m-0" v-model="item.work_unit"/> </p>
                  <p class="p-2"><ml-input class="w-full" v-model="item.location"/> </p>
                  <p class="p-2"><ml-textarea class="w-full m-0" v-model="item.risk_factor"/> </p>
                  <p class="p-2"><disaster-type-selector class="w-full" v-model="item.disaster_type"/> </p>
                  <p class="p-2"><ml-textarea class="w-full m-0" v-model="item.safety_measures"/> </p>
                  <p class="p-2">
                    <vs-select autocomplete class="w-full m-0" v-model="item.exe">
                      <vs-select-item text="Y" value="Y"/>
                      <vs-select-item text="N" value="N"/>
                    </vs-select>
                  </p>
                  <p class="p-2 text-center" style="cursor: pointer">
                    <ml-textarea class="m-0" v-model="item.etc"/>
                  </p>
                </li>
              </ul>
            </vs-col>
          </vs-row>

          <file-upload-module id="bottom" v-model="fileList" :readonly="board.readonly"/>
        </vx-card>
      </vs-col>
      <vs-col class="w-3/12 pl-6">

        <work-detail-module
          v-if="selectItem.is_checked"
          v-model="selectItem"
          :readonly="board.readonly"
          board-slug="daily_safety_check_diary"

          @handleClickFileUpload="handleClickFileUpload"
          @handleClose="handleClose"
          @delete="onClickDelete"
        >
        </work-detail-module>

        <approval-process-module
          v-else
          :board="board"
          :commentabled="!(board.isCompleteApproval || board.savable)"

          @handleClickUpload="handleClickUpload"
          @handleClickOk="handleClickOk"
          @handleClickNo="handleClickNo"
          @handleSendApprovalProcess="handleSendApprovalProcess"
        ></approval-process-module>


      </vs-col>
    </vs-row>


    <vs-popup id="popupAddProjectMember" title="사진업로드" :active.sync="popupUploadImage">
      <div>
        <file-upload-module type="check_list_col" :readonly="board.readonly"
                            v-model="selectItem.fileList"></file-upload-module>
      </div>
    </vs-popup>

    <!-- TODO : 얼럿데이터 -->
    <popup-alert v-model="alert.show"
                 :message="alert.message"
                 :buttons="alert.buttons"

                 @ok="alertOk"
                 @no="alertNo"/>

    <vs-popup id="popupKakao" class="no-drag" title="카카오 알림톡 테스트" :active.sync="showKakao">
      <vs-row>
        <vs-col class="w-full p-4 mb-4">
          <span style="display:block; width:100%; text-align: center;">일일안전 점검일지 카카오알림톡 발송</span>
        </vs-col>
        <vs-col class="w-full flex mb-6" style="align-items: center; justify-content: center;">
          <span class="mr-3">전화번호</span>
          <ml-input style="width:150px;" v-model="kakaoPhoneNumber"/>
        </vs-col>
        <vs-col class="w-full flex mt-6" style="align-items: center;">
          <vs-spacer></vs-spacer>
          <vs-button @click="handleSendKakao">전송</vs-button>
        </vs-col>
      </vs-row>
    </vs-popup>

  </div>
</template>

<script>
import config from '/public/config'
import FileUploadModule from '@/views/modules/FileUploadModule'
import DateSelector from '@/components/selector/DateSelector'
import ApprovalProcessModule from '@/views/modules/ApprovalProcessModule'
import WorkDetailModule from '@/views/modules/WorkDetailModule'
import OrderNumberSelectModule from '@/views/modules/OrderNumberSelectModule'
import PopupAlert from '@/popup/PopupAlert'
import DisasterTypeSelector from '@/components/DisasterTypeSelector'

export default {
  name: 'RiskCheckDailySafetyLogUpdate',
  components: {
    DisasterTypeSelector,
    PopupAlert,
    OrderNumberSelectModule,
    WorkDetailModule,
    ApprovalProcessModule,
    DateSelector,
    FileUploadModule
  },
  data () {
    return {
      rand: Math.floor(Math.random() * 10000),
      boardSlug: 'daily_safety_check_diary',
      selectItem: {},

      showKakao: false,
      kakaoPhoneNumber: '',

      // TODO : 글쓰기 정보 및 권한
      board: {
        slug: 'daily_safety_check_diary',
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
      approvalLine: [], // 결재선 등록

      popupUploadImage: false,

      list1: [],
      list2: [],

      form: {
        project_title: '', //현장명
        writer: '', //작성자
        com_name: '', //소속
        date: '', //대상기간
        sdate: '',
        edate: '',
        orderNumberId: '', //차수
        orderNumber: '', //차수
        checkDate: '', //점검일

        comment1: '', // 주요작업 및 위험작업
        comment2: '', // 현장점검내용(이슈사항, 합동점검,특별작업 등)
        attach: {}, //첨부
        list1: [], //확인점검내용
        list2: [], //일상 위험관리

        // preview
        preview: {
          title: '',
          orderNumber: '',
          date: '',
          checkDate: '',
          writer: ''
        }
      },
      fileList: [], //파일리스트
      oldForm: {}
    }
  },

  computed: {
    projectInfo () {
      return this.$store.state.project.projectInfo
    },
    isCheckAll1 () {
      let isCheckAll = true
      this.list1.map(value => {
        if (value.is_checked === false) {
          isCheckAll = false
        }
      })

      if (this.list1.length === 0) {
        return false
      }

      return isCheckAll
    },
    isCheckAll2 () {
      let isCheckAll = true
      this.list2.map(value => {
        if (value.is_checked === false) {
          isCheckAll = false
        }
      })

      if (this.list2.length === 0) {
        return false
      }

      return isCheckAll
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
    await this.loadPost()
  },

  methods: {

    onClickCheckAll (index) {
      if (this.board.readonly) {
        return false
      }
      if (index === 1) {
        if (this.isCheckAll1) {
          this.list1.map(value => {
            value.is_checked = false
          })
        } else {
          this.list1.map(value => {
            value.is_checked = true
          })
        }
      } else if (index === 2) {
        if (this.isCheckAll2) {
          this.list2.map(value => {
            value.is_checked = false
          })
        } else {
          this.list2.map(value => {
            value.is_checked = true
          })
        }
      }
    },

    back () {
      this.$router.push({path: '.'})
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
      this.form.project_title = this.$store.state.approval.postInfo.post_title
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

      this.list1 = this.form.list1
      this.list2 = this.form.list2

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
      const boardSlug = this.boardSlug
      const postId = this.$route.params.postId
      const title = this.projectInfo.field_name
      const approvalLine = JSON.stringify(this.lineToSendLine(this.approvalLine))
      let uploads = ''
      const listUploads = []
      const uploadFileIds = []
      const projectId = this.$route.params.proj_id
      const projectOrderId = this.form.orderNumberId

      if (this.fileList.length > 0) {
        for (const file of this.fileList) {
          listUploads.push(file)
          uploadFileIds.push(file.id)
        }
        uploads = JSON.stringify(uploadFileIds)
      }

      this.form.list1 = this.list1
      this.form.list2 = this.list2
      this.form.preview.title = title
      this.form.preview.orderNumber = this.form.orderNumber
      this.form.preview.date = this.form.date
      this.form.preview.checkDate = this.form.checkDate
      this.form.preview.writer = this.form.writer
      const content = JSON.stringify(this.form)

      try {
        if (isUploaded) {
          // 바로 상신하기
          const unTemp = 'y'
          await this.$store.dispatch('approval/UPDATE_POST', {
            boardSlug,
            postId,
            title,
            content,
            approvalLine,
            uploads,
            unTemp,
            projectId
          })
          alert('상신되었습니다.')
          this.oldForm = JSON.parse(JSON.stringify(this.form))
          this.back()
        } else {
          // 임시 저장하기
          const unTemp = 'n'
          await this.$store.dispatch('approval/UPDATE_POST', {
            boardSlug,
            postId,
            title,
            content,
            approvalLine,
            uploads,
            unTemp,
            projectId
          })
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

    },
    async reRegister (isUploaded) {
      if (isUploaded && (!this.approvalLine || this.approvalLine.length === 0)) {
        alert('결재선을 지정해주세요')
        return
      }

      // 등록정보
      const boardSlug = this.boardSlug
      const title = this.projectInfo.field_name
      const approvalLine = JSON.stringify(this.lineToSendLine(this.approvalLine))
      const security = 'normal' // 문서보안 등급 ['일반', 대외비 1급, 대외비 2급, 인비, 극비] [normal,confidential1,confidential2,personally,confidential0]
      const priority = 'medium' // 문서 중요도 [매우낮음, 낮음, 보통, 높음, 매우 높음] [lowest,low,medium,high,highest]
      const projectId = this.$route.params.proj_id
      const projectOrderId = this.orderNumberId

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

      this.form.list1 = this.list1
      this.form.list2 = this.list2
      this.form.preview.title = title
      this.form.preview.orderNumber = this.form.orderNumber
      this.form.preview.date = this.form.date
      this.form.preview.checkDate = this.form.checkDate
      this.form.preview.writer = this.form.writer
      const content = JSON.stringify(this.form)

      try {
        if (isUploaded) {
          // 바로 상신하기
          await this.$store.dispatch('approval/CREATE_POST', {
            boardSlug,
            title,
            content,
            approvalLine,
            security,
            priority,
            uploads,
            projectId
          })
          alert('상신되었습니다.')
          this.oldForm = JSON.parse(JSON.stringify(this.form))
          this.back()
        } else {
          // 임시 저장하기
          const isTemp = 1
          await this.$store.dispatch('approval/CREATE_POST', {
            boardSlug,
            title,
            content,
            approvalLine,
            security,
            priority,
            uploads,
            projectId,
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
        }
      }

    },

    handleBackMenu () {
      this.$emit('handleBackMenu', 'checklog')
    },

    // 글 삭제
    async handleDeletePost () {
      if (confirm('삭제하시겠습니까?')) {
        const boardSlug = this.boardSlug
        const postId = this.$route.params.postId
        await this.$store.dispatch('approval/DELETE_POST', {
          boardSlug,
          postId
        })
        this.oldForm = this.form
        this.$router.back()
      }
    },

    showPopupUploadImages () {
      this.popupUploadImage = true
    },

    handleClickFileUpload () {
      this.popupUploadImage = true
    },

    handleSelectItem (item) {
      if (this.selectItem) {
        this.selectItem.is_checked = false
      }

      this.selectItem = item
      this.selectItem.is_checked = true
      this.selectItem.orderNumber = this.form.orderNumber
    },

    handleCheckAdd (index) {
      if (index === 1) {
        const length = this.list1.length
        this.list1.push({
          listType: 'list1',
          num: length,
          fileList: [],
          work_unit: '',
          risk_factor:'',
          safety_measures:'',
          disaster_type: '',
          exe: '',
          solution:'',
          orderNumber:'',
          is_checked: false
        })
      } else if (index === 2) {

        const length = this.list2.length
        this.list2.push({
          listType: 'list2',
          num: length,
          fileList: [],
          work_unit: '',
          risk_factor:'',
          safety_measures:'',
          disaster_type: '',
          exe: '',
          solution:'',
          orderNumber:'',
          is_checked: false
        })
      }
    },

    handleClickRemoveEval (index) {
      if (index === 1) {
        for (let i = 0; i < this.list1.length; i++) {
          if (this.list1[i].is_checked) {
            this.list1.splice(i, 1)
            i--
          }
        }
      } else if (index === 2) {
        for (let i = 0; i < this.list2.length; i++) {
          if (this.list2[i].is_checked) {
            this.list2.splice(i, 1)
            i--
          }
        }
      }
    },

    onClickDelete (data) {
      if (data.listType === 'list1') {
        const index = this.list1.indexOf(data)
        this.list1.splice(index, 1)
      } else if (data.listType === 'list2') {
        const index = this.list2.indexOf(data)
        this.list2.splice(index, 1)
      }
      this.selectItem = {}
    },

    handleClose () {
      this.selectItem = {}
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
      document.location.reload()
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

    handleClickUpload () {
      if (confirm('상신하시겠습니까?')) {
        this.register(true)
      }
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

    handleSendApprovalProcess (process) {
      this.approvalLine = process
    },

    handleChangeOrderNumber (data) {

    },

    handleShowKakao () {
      this.showKakao = true
    },

    handleSendKakao () {
      this.showKakao = false

      const projectId = this.$route.params.proj_id
      const postId = this.$route.params.postId
      const phone = this.kakaoPhoneNumber
      const sendDate = new Date().format('MM/dd')

      let gj = '#A-AE 등급\n'
      let item = {}
      for (let i = 0; i < this.list1.length; i++) {
        item = this.list1[i]

        gj += `${(i + 1)} - `
        gj += (item.risk_factor && item.risk_factor.length > 32) ? `${item.risk_factor.substr(0, 32).replace(/\n/g, '')}..` : (item.risk_factor > 0 ? item.risk_factor.replace(/\n/g, '') : '')
        gj += '\n'
      }
      gj += `총 ${this.list1.length} 개 항목\n\n`

      gj += '#B-C 등급\n'
      gj += `총 ${this.list2.length} 개 항목\n\n`
      gj += `■ <안전점검일지> MAOT 앱에서 작성하기 ${config.BASE_URL}/m/project/${projectId}/safety/${postId}/daily-checklog-update`

      this.$store.dispatch('kakao/SEND_KAKAO', {
        phone,
        sendDate,
        gj
      })
    }


  }
}
</script>

<style>
#popupKakao.con-vs-popup .vs-popup {
  width: 350px;
}
</style>
