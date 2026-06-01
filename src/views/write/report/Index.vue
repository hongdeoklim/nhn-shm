<template>
  <div>
    <ApprovalDocument
      :board="board"
      :value="form.body"

      @close="onClickClose"
      @delete="onClickDelete"
      @recall="onClickRecall"
      @print="onClickPrint"
      @tempsave="onClickTempsave"
      @retempsave="onClickReTempsave"
      @upload="onClickUpload"
      @ok="onClickOk"
      @no="onClickNo"
    >
      <template #header="props">
        <p v-if="boardSlug === 'project_monthly_report'" class="h4 flex" style="align-items: center">
          안전·보건예산 현황
          <ml-input class="ml-8 mr-2" style="width:100px;" v-model="form.header.year" :readonly="true"/>년
          <ml-input class="ml-8 mr-2" style="width:100px;" v-model="form.header.month" :readonly="board.readonly"/>월
        </p>
      </template>

      <template #print="props" v-if="isPrint" >
        <component :is="template" :value="props.data" :header="form.header" :board="props.board" :com_name="companyInfo.com_name" :files="fileList" :isPrint="true" id="print-report" />
      </template>

      <template #body="props" >
        <component :is="template" :value="props.data" :header="form.header" :board="props.board" :com_name="companyInfo.com_name" :files="fileList" @input="onChangeInput"/>
      </template>
    </ApprovalDocument>
  </div>
</template>

<script>
import ApprovalDocument from '@/views/write/document/ApprovalDocument'

export default {
  name: 'ReportWrite',
  components: {
    ApprovalDocument},
  data () {
    return {
      isPrint: false,

      // TODO : 글쓰기 정보 및 권한
      board: {
        slug: this.boardSlug,
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

      form:{
        header:{
          year: new Date().getFullYear(),
          month: new Date().getMonth() + 1
        },
        body:{}
      },

      fileList:[],
      company: '',
    }
  },
  computed:{
    companyInfo () {
      if (this.isUpdateMode) {
        return this.company
      } else {
        return this.$store.state.auth.companyInfo
      }
    },
    isUpdateMode () {
      return this.$route.params.postId
    },
    boardSlug () {
      return this.$route.params.boardSlug
    },
    projectId () {
      return parseInt(this.$route.params.proj_id)
    },
    template () {
      switch (this.boardSlug) {
      case 'project_monthly_report':
        return () => import('./template/TemplateProjectMonthlyReport')
      }
      return () => import('./template/TemplateNone')
    }
  },
  created () {
    const breadcrumb = [
      {title: 'Home'},
      {
        title: '안전·보건예산 현황',
        active: true
      }
    ]

    this.$store.commit('menu/UPDATE_PAGE_LIST', breadcrumb)
  },
  mounted () {
    this.board.slug = this.boardSlug

    if (this.isUpdateMode) {
      this.loadPost()
    }
  },
  methods: {
    async loadPost () {
      const boardSlug = this.$route.params.boardSlug
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
      this.company = this.$store.state.approval.postInfo.author.company;
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

      // TODO : 결재프로세스
      await this.$store.dispatch('USER_INFO')
      const myId = this.$store.state.auth.userInfo.id
      const doc = this.$store.state.approval.document
      this.board.slug = this.boardSlug
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
    },

    convertFileListToApiFiles () {
      let uploads = '[]'
      const uploadFileIds = []

      if (this.fileList.length > 0) {
        for (const file of this.fileList) {
          uploadFileIds.push(file.id)
        }
        uploads = JSON.stringify(uploadFileIds)
      }

      return uploads
    },

    getOptions (option) {
      const value = JSON.parse(JSON.stringify(this.form))

      if (value.body.reportHealthAndSafetyManagementCost) {
        const rowNames = [
          'safety_and_health_labor_cost', 'safety_and_health_education', 'risk_assessment', 'industrial_accident_compensation',
          'safety_and_health_management_system', 'health_care', 'safety_and_health_integrated_management_system', 'installation_and_maintenance_of_musculoskeletal_prevention_facilities',
          'musculoskeletal_service', 'eap_operation', 'accumulate'
        ]
        const reportHealthAndSafetyManagementCost = value.body.reportHealthAndSafetyManagementCost
        rowNames.map(rowName => {
          const amount = reportHealthAndSafetyManagementCost[rowName]['amount'] ? this.removeComma(reportHealthAndSafetyManagementCost[rowName]['amount']) : ''
          const amount_used = reportHealthAndSafetyManagementCost[rowName]['amount_used'] ? this.removeComma(reportHealthAndSafetyManagementCost[rowName]['amount_used']) : ''
          const accumulated_amount = reportHealthAndSafetyManagementCost[rowName]['accumulated_amount'] ? this.removeComma(reportHealthAndSafetyManagementCost[rowName]['accumulated_amount']) : 0

          reportHealthAndSafetyManagementCost[rowName]['amount'] = amount
          reportHealthAndSafetyManagementCost[rowName]['amount_used'] = amount_used
          reportHealthAndSafetyManagementCost[rowName]['accumulated_amount'] = accumulated_amount
        })
        value.body.reportHealthAndSafetyManagementCost = reportHealthAndSafetyManagementCost
      }
      value.date = new Date(value.header.year, value.header.month - 1, 1).format('yyyy-MM-dd')

      const projectId = parseInt(this.$route.params.proj_id)
      const content = JSON.stringify(value)
      const uploads = this.convertFileListToApiFiles()

      return {
        projectId,
        content,
        uploads,
        ...option
      }
    },

    async sendUpload (option) {
      if (this.isUpdateMode) {
        const postId = parseInt(this.$route.params.postId)
        await this.$store.dispatch('approval/UPDATE_POST', {postId, unTemp:'y', ...this.getOptions(option)})
      } else {
        await this.$store.dispatch('approval/CREATE_POST', {...this.getOptions(option)})
      }
      alert('상신되었습니다.')
      this.onClickClose()
    },
    async sendTemp (option, isCreate) {
      //임시 저장하기
      if (isCreate || !this.isUpdateMode) {
        await this.$store.dispatch('approval/CREATE_POST', {isTemp: 1, ...this.getOptions(option)})
      } else {
        const postId = parseInt(this.$route.params.postId)
        await this.$store.dispatch('approval/UPDATE_POST', {postId, unTemp: 'n', ...this.getOptions(option)})
      }
      alert('임시저장되었습니다.')
      this.onClickClose()
    },

    onChangeInput (value, files) {

      this.form.summary = {}
      if (value.reportHealthAndSafetyManagementCost.summary) {
        this.form.summary.reportHealthAndSafetyManagementCost = value.reportHealthAndSafetyManagementCost.summary.reportHealthAndSafetyManagementCost
      }
      if (value.reportSafetyEquipment.summary) {
        this.form.summary.reportSafetyEquipment = value.reportSafetyEquipment.summary.reportSafetyEquipment
      }

      this.form.body = value
      this.fileList = files
    },

    onClickClose () {
      // 닫기
      this.$router.back()
    },
    async onClickDelete () {
      // 삭제
      if (confirm('삭제하시겠습니까?')) {
        const boardSlug = this.boardSlug
        const postId = this.$route.params.postId
        await this.$store.dispatch('approval/DELETE_POST', {boardSlug, postId})
        this.oldForm = this.form
        this.onClickClose()
      }
    },
    onClickPrint () {
      // 프린트
      this.isPrint = true

      setTimeout(() => {
        const g_oBeforeBody = document.getElementById('print-report').innerHTML
        // 프린트를 보이는 그대로 나오기위한 셋팅
        window.onbeforeprint = function () {
          document.body.style.backgroundColor = '#fff'
          document.body.innerHTML = g_oBeforeBody
        }
        window.print()
        location.reload()
      }, 300)
    },
    async onClickRecall (option) {
      // 결재문서 회수
      if (confirm('회수 후 임시저장 상태로 변경하시겠습니까?')) {
        await this.sendTemp(option)
      }
    },
    async onClickTempsave (option) {
      // 임시 저장하기
      await this.sendTemp(option)
    },
    async onClickReTempsave (option) {
      // 재상신
      await this.sendTemp(option, true)
    },
    async onClickUpload (option) {
      // 상신
      await this.sendUpload(option)
    },
    async onClickOk () {
      // 승인
      const postId = this.$route.params.postId
      await this.$store.dispatch('approval/APPROVE_OK', {postId})
      this.onClickClose()
    },
    async onClickNo (text) {
      // 반려
      const postId = parseInt(this.$route.params.postId)
      const comment = text
      await this.$store.dispatch('approval/APPROVE_NO', { postId, comment })
      this.onClickClose()
    },

    removeComma (str) {
      if (str) {
        const noneComma = `${str}`.replaceAll(',', '')
        return noneComma
      }
      return str
    }
  }
}
</script>

<style scoped>

</style>
