<template>
  <vx-card>
    <vs-row class="mb-8">
      <vs-col class="mb-2 flex" vs-justify="flex-end">
        <vs-button class="mr-4" color="secondary" type="border" @click="handleBackMenu">목록</vs-button>
        <vs-button class="mr-4" color="secondary" @click="handleClickRegister">저장</vs-button>
      </vs-col>

      <!-- 기본정보 -->
      <vs-row class="mb-4">
        <vs-col><h5><i class="dot"></i>기본정보</h5></vs-col>
      </vs-row>

      <vs-row class="flex flex-wrap mb-4">
        <vs-row class="w-1/3  mb-4 flex" vs-align="center">
          <vs-col class="w-3/12 title">현장명</vs-col>
          <vs-col class="w-9/12">
            <ml-input class="w-full" :value="projectInfo.field_name" :readonly="true"/>
          </vs-col>
        </vs-row>
        <vs-row class="w-1/3  mb-4 flex" vs-align="center">
          <vs-col class="w-3/12 title pr-4" style="text-align: right">소속</vs-col>
          <vs-col class="w-9/12">
            <ml-input class="w-full" :value="form.company" :readonly="true"/>
          </vs-col>
        </vs-row>
        <vs-row class="w-1/3  mb-4 flex" vs-align="center">
          <vs-col class="w-3/12 title pr-4" style="text-align: right">작성자</vs-col>
          <vs-col class="w-9/12">
            <ml-input class="w-full" :value="form.writer" :readonly="true"/>
          </vs-col>
        </vs-row>
      </vs-row>

      <!-- 교육내용 -->
      <vs-row class="mb-4">
        <vs-col><h5><i class="dot"></i>교육내용</h5></vs-col>
      </vs-row>
      <vs-row class="flex flex-wrap mb-4">
        <!-- 교육구분 -->
        <vs-row class="w-1/3  mb-4 flex" vs-align="center">
          <vs-col class="w-3/12 title">교육구분</vs-col>
          <vs-col class="w-9/12">
            <vs-select style="display: none" autocomplete class="selectExample w-full" v-model="form.hse_type" :disabled="board.readonly">
              <vs-select-item v-for="(item, index) in selectList" :key="index" :value="item.value" :text="item.text"/>
            </vs-select>
            <vs-select autocomplete class="selectExample w-full" v-model="form.hse_type_health" :disabled="board.readonly">
              <vs-select-item v-for=" (item, index) in selectHealthList" :key="index" :value="item.value" :text="item.text"/>
            </vs-select>
          </vs-col>
        </vs-row>

        <!-- 교육명 -->
        <vs-row class="w-1/3  mb-4 flex" vs-align="center">
          <vs-col class="w-3/12 title pr-4" style="text-align: right">교육명</vs-col>
          <vs-col class="w-9/12">
            <ml-input class="w-full" v-model="form.work" :readonly="board.readonly"/>
          </vs-col>
        </vs-row>

        <!-- 교육대상 -->
        <vs-row class="w-1/3  mb-4 flex" vs-align="center">
          <vs-col class="w-3/12 title pr-4" style="text-align: right">교육대상</vs-col>
          <vs-col class="w-9/12">
            <ml-input class="w-full" v-model="form.target" :readonly="board.readonly"/>
          </vs-col>
        </vs-row>

        <!-- 교육일 -->
        <vs-row class="w-1/3  mb-4 flex" vs-align="center">
          <vs-col class="w-3/12 title " >교육일</vs-col>
          <vs-col class="w-9/12 flex " style="align-items: center">
            <date-selector class="w-6/12 pr-2" v-model="form.date" :readonly="board.readonly"/>
            <time-selector class="w-3/12 " v-model="form.s_time" :readonly="board.readonly"/>
            <span class="px-2">~</span>
            <time-selector class="w-3/12" v-model="form.e_time" :readonly="board.readonly"/>
          </vs-col>
        </vs-row>

        <!-- 교육담당 -->
        <vs-row class="w-1/3  mb-8 flex" vs-align="center">
          <vs-col class="w-3/12 title pr-4" style="text-align: right">교육담당</vs-col>
          <vs-row class="w-9/12" vs-align="center">
            <vs-col class="w-2/12" style="text-align: center">공단</vs-col>
            <vs-col class="w-4/12">
              <ml-input class="w-full" v-model="form.main_manager" :readonly="board.readonly"/>
            </vs-col>
            <vs-col class="w-2/12" style="text-align: center">소속</vs-col>
            <vs-col class="w-4/12">
              <ml-input class="w-full" v-model="form.sub_manager" :readonly="board.readonly"/>
            </vs-col>
          </vs-row>
        </vs-row>

        <!-- 교육총인원 -->
        <vs-row class="w-1/3  mb-4 flex" vs-align="center">
          <vs-col class="w-3/12 title pr-4" style="text-align: right">교육총인원</vs-col>
          <vs-col class="w-9/12">
            <ml-input class="w-full" v-model="form.total" :readonly="board.readonly"/>
          </vs-col>
        </vs-row>

        <!-- 교육내용 -->
        <vs-row class="w-1/2 flex" vs-align="center">
          <vs-col class="w-1/6 title pr-4">교육내용</vs-col>
          <vs-col class="w-5/6">
            <ml-textarea class="m-0" v-model="form.prev_contents" rows="5" :readonly="board.readonly"/>
          </vs-col>
        </vs-row>

        <!-- 근로자의견 -->
        <vs-row class="w-1/2 flex" vs-align="center">
          <vs-col class="w-1/6 title pr-4" style="text-align: right">근로자의견</vs-col>
          <vs-col class="w-5/6">
            <ml-textarea class="m-0" v-model="form.move_contents" rows="5" :readonly="board.readonly"/>
          </vs-col>
        </vs-row>

        <file-upload-module class="w-full mt-8" id="bottom" v-model="fileList"/>

      </vs-row>
    </vs-row>

  </vx-card>
</template>

<script>
import DateSelector from '@/components/selector/DateSelector'
import FileUploadModule from '@/views/modules/FileUploadModule'
import TimeSelector from '@/components/selector/TimeSelector'

export default {
  name: 'HealthCreate',
  components: {
    TimeSelector,
    FileUploadModule,
    DateSelector
  },
  computed: {
    projectInfo () {
      return this.$store.state.project.projectInfo
    }
  },
  data () {
    return {
      boardId: '35',
      boardSlug: 'hse_management',

      // TODO : 글쓰기 정보 및 권한
      board: {
        slug: 'hse_management',
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

      form: {
        field_name: '',
        writer: '',
        hse_type: 'health',
        hse_type_health: '정기보건교육',
        total: '',
        target:'',
        work:'',
        date:'',
        s_time:'',
        e_time:'',
        main_manager:'',
        sub_manager:'',
        prev_contents:'',
        move_contents:'',

        preview:{
          hse_type:'',
          field_name:'',
          work:'',
          target:'',
          main_manager:'',
          sub_manager:'',
          date:'',
          s_time:'',
          e_time:'',
          attach:[]
        },

        // 통계를 위해서 저장하는 데이터
        summary: {
          hse_type: []
        }
      },
      fileList: [], //파일리스트
      oldForm:{},

      selectList: [
        {
          text: '안전',
          value: 'safety'
        },
        {
          text: '보건',
          value: 'health'
        }

      ],
      selectHealthList: [
        { text: '정기보건교육', value: '정기보건교육' },
        { text: '채용시 보건교육', value: '채용시 보건교육' },
        { text: '작업내용 변경시 보건교육', value: '작업내용 변경시 보건교육' },
        { text: '특별보건교육', value: '특별보건교육' },
        { text: '관리감독자 보건교육', value: '관리감독자 보건교육' },
        { text: 'MSDS(보건)', value: 'MSDS(보건)' },
        { text: '기타(보건)', value: '기타(보건)' }
      ],
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

      await this.$store.dispatch('company/LOAD_COMPANY', {companyId:this.board.writer.company_id})
      this.board.writer.company_name = this.$store.state.company.companyInfo.com_name
      this.form.writer = this.board.writer.name
      this.form.company = this.board.writer.company_name
      this.form.field_name = this.$store.state.project.projectInfo.field_name

      this.oldForm = JSON.parse(JSON.stringify(this.form))
    },
    async register () {
      const projectId = this.$route.params.proj_id
      const boardId = this.boardId
      const title = this.projectInfo.field_name

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

      const value = this.form.hse_type_health
      const total = isNaN(Number(this.form.total)) ? 0 : `${Number(this.form.total)}`
      const hse_type = []
      if (value === 'regular_safety') hse_type.push({'정기안전교육': total})
      if (value === 'hiring_safety') hse_type.push({'채용시 안전교육': total})
      if (value === 'changing_safety') hse_type.push({'작업내용 변경시 안전교육': total})
      if (value === 'special_safety') hse_type.push({'특별안전교육': total})
      if (value === 'supervisor_safety') hse_type.push({'관리감독자 안전교육': total})
      if (value === 'material_safety') hse_type.push({'MSDS_안전': total})
      if (value === 'etc_safety') hse_type.push({'기타(안전)': total})
      if (value === 'regular_health') hse_type.push({'정기보건교육': total})
      if (value === 'hiring_health') hse_type.push({'채용시 보건교육': total})
      if (value === 'changing_health') hse_type.push({'작업내용 변경시 보건교육': total})
      if (value === 'special_health') hse_type.push({'특별보건교육': total})
      if (value === 'supervisor_health') hse_type.push({'관리감독자 보건교육': total})
      if (value === 'material_health') hse_type.push({'MSDS_보건': total})
      if (value === 'etc_health') hse_type.push({'기타(보건)': total})
      this.form.summary.hse_type = hse_type
      this.form.date = this.form.date

      this.form.preview.hse_type = this.form.hse_type
      this.form.preview.field_name = this.form.field_name
      this.form.preview.work = this.form.work
      this.form.preview.target = this.form.target
      this.form.preview.total = this.form.total
      this.form.preview.main_manager = this.form.main_manager
      this.form.preview.sub_manager = this.form.sub_manager
      this.form.preview.date = this.form.date
      this.form.preview.s_time = this.form.s_time
      this.form.preview.e_time = this.form.e_time
      this.form.preview.attach = this.fileList

      this.form.summary = {
        "교육구분": [
          {[this.form.hse_type_health]: 1}
        ]
      }

      const content = JSON.stringify(this.form)

      if (this.formCheck()) {
        await this.$store.dispatch('board/CREATE_POST', {
          projectId,
          boardId,
          title,
          content,
          uploads
        })

        this.oldForm = JSON.parse(JSON.stringify(this.form))
        this.$router.back()
      }

    },

    formCheck () {
      if (this.form.hse_type.trim().length <= 0) {
        alert('교육구분을 선택해주세요')
        return false
      } else if (this.form.total.trim().length <= 0) {
        alert('교육총인원을 입력해주세요')
        return false
      } else if (this.form.target.trim().length <= 0) {
        alert('교육대상을 입력해주세요')
        return false
      } else if (this.form.work.trim().length <= 0) {
        alert('교육명을 입력해주세요')
        return false
      } else if (this.form.date.trim().length <= 0) {
        alert('교육일를 입력해주세요')
        return false
      } else if (this.form.s_time.trim().length <= 0) {
        alert('교육 시작시간을 입력해주세요')
        return false
      } else if (this.form.e_time.trim().length <= 0) {
        alert('교육 종료시간을 입력해주세요')
        return false
      } else if (this.form.main_manager.trim().length <= 0) {
        alert('교육담당(공단)을 입력해주세요')
        return false
      } else if (this.form.sub_manager.trim().length <= 0) {
        alert('교육담당(파트너사)을 입력해주세요')
        return false
      } else if (this.form.prev_contents.trim().length <= 0) {
        alert('교육내용을 입력해주세요')
        return false
      } else if (this.form.move_contents.trim().length <= 0) {
        alert('근로자의견을 입력해주세요')
        return false
      }

      return true
    },

    handleBackMenu () {
      this.$emit('handleBackMenu', 'health')
    },

    handleClickRegister () {
      if (confirm('저장하시겠습니까?')) {
        this.register()
      }
    },

    memberExcelDownload () {

    },
  }
}
</script>

<style scoped>

</style>
