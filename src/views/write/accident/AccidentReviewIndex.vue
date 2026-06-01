<template>
  <div>
    <ApprovalDocument
      :board="board"
      :value="form.body"
      :isPrint="isPrint"

      @documentSearch="onClickDocumentSearch"
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
        <div class="flex align-item-center">
          <feather-icon class="mr-2" icon="AlertCircleIcon" style="cursor: pointer; width:16px;" />
          <span class="bold">작성 전, 불러오기 버튼을 통해 작성된 사고보고 문서를 불러올 수 있습니다.</span>
        </div>
      </template>

      <template #print="props" v-if="isPrint" >
        <component :is="template" :isCheck="true" :value="props.data" :board="props.board" :files="fileList" :isPrint="true" id="print-report" />
      </template>

      <template #body="props" >
        <component :is="template" :isCheck="true" :value="props.data" :board="props.board" :files="fileList" @input="onChangeInput"/>
      </template>
    </ApprovalDocument>

    <popup-accident-report-list v-model="showPopup" @click="onClickAccidentReport"/>
  </div>
</template>

<script>
import ApprovalDocument from '@/views/write/document/ApprovalDocument'
import PopupAccidentReportList from '@/popup/PopupAccidentReportList'

export default {
  name: 'AccidentReviewIndex',
  components: {
    PopupAccidentReportList,
    ApprovalDocument},
  data () {
    return {
      isPrint: false,
      showPopup: false,

      // TODO : 글쓰기 정보 및 권한
      board: {
        slug: this.boardSlug,
        search: true, // 사고보고 검색
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

      fileList:[]
    }
  },
  computed:{
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
      return () => import('./template/TemplateAccidentReportIndex')
    }
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

      if (this.fileList && this.fileList.length > 0) {
        for (const file of this.fileList) {
          uploadFileIds.push(file.id)
        }
        uploads = JSON.stringify(uploadFileIds)
      }

      return uploads
    },

    getOptions (option) {
      const projectId = parseInt(this.$route.params.proj_id)
      const content = JSON.stringify(this.form)
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
      // 임시 저장하기
      if (isCreate || !this.isUpdateMode) {
        await this.$store.dispatch('approval/CREATE_POST', {isTemp: 1, ...this.getOptions(option)})
      } else {
        const postId = parseInt(this.$route.params.postId)
        await this.$store.dispatch('approval/UPDATE_POST', {postId, unTemp: 'n', ...this.getOptions(option)})
      }
      alert('임시저장되었습니다.')
      this.onClickClose()
    },

    loadAccidentReport () {
      this.showPopup = true
    },

    async onClickAccidentReport (_postId) {
      const boardSlug = 'accident_report'
      const postId = typeof _postId === 'number' ? _postId : 0
      if (postId > 0) {
        await this.$store.dispatch('approval/LOAD_POST', {
          boardSlug,
          postId
        })

        // 내용
        const post = JSON.parse(this.$store.state.approval.postInfo.post_content)
        this.form = post

        this.showPopup = false
      } else {
        alert('사고보고를 불러오지 못 했습니다.')
      }
    },

    onChangeInput (value, files) {
      this.form.body = value
      this.fileList = files
    },


    onClickDocumentSearch () {
      this.loadAccidentReport()
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
        const g_oBeforeApproval = document.getElementById('print-approval').innerHTML
        // 프린트를 보이는 그대로 나오기위한 셋팅
        window.onbeforeprint = function () {
          document.body.style.backgroundColor = '#fff'
          document.body.innerHTML = `${g_oBeforeBody}<br>${g_oBeforeApproval}`
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
    }
  }
}
</script>

<style scoped>

</style>
