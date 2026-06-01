<template>
  <vs-popup id="popupRegAdmin" title="대관인허가" :active.sync="popupActiveSync">


    <vs-row class="mb-8">
      <vs-col><h5><i class="dot"></i>대관인허가신고</h5></vs-col>
    </vs-row>
    <vs-col class="flex flex-wrap mb-4 pl-4 pr-4">
      <vs-row class="w-1/2  mb-4 flex" vs-align="center">
        <vs-col class="w-4/12 title pl-4">현장명</vs-col>
        <vs-col class="w-8/12 pr-4">{{ form.field_name }}</vs-col>
      </vs-row>
      <vs-row class="w-1/2  mb-4 flex" vs-align="center">
        <vs-col class="w-4/12 title pl-4">작성자</vs-col>
        <vs-col class="w-8/12 pr-4">{{ form.writer }}</vs-col>
      </vs-row>

      <vs-row class="w-1/2  mb-4 flex" vs-align="center">
        <vs-col class="w-4/12 title pl-4">신고종류</vs-col>
        <vs-col class="w-8/12 pr-4">
          <vs-select class="w-full" autocomplete v-model="form.type" style="color:#3c3c3c;">
            <vs-select-item :key="index" :value="item.type" :text="item.type"
                            v-for=" (item, index) in governmentList"/>
          </vs-select>
        </vs-col>
      </vs-row>
      <vs-row class="w-1/2  mb-4 flex" vs-align="center">
        <vs-col class="w-4/12 title pl-4">유효일</vs-col>
        <vs-col class="w-8/12 pr-4">
          <ml-input class="w-full" v-model="form.period"/>
        </vs-col>
      </vs-row>

      <vs-row class="w-1/2  mb-4 flex" vs-align="center">
        <vs-col class="w-4/12 title pl-4">신고일</vs-col>
        <vs-col class="w-8/12 pr-4">
          <date-selector class="w-full" v-model="form.report_date"/>
        </vs-col>
      </vs-row>
      <vs-row class="w-1/2  mb-4 flex" vs-align="center">
      </vs-row>

      <vs-row class="w-full  mb-4 flex" vs-align="center">
        <vs-col class="w-2/12 title pl-4">내용</vs-col>
        <vs-col class="w-10/12 pr-4">
          <ml-textarea class="w-full" v-model="form.report_content"/>
        </vs-col>
      </vs-row>

      <vs-row class="w-full  mb-4 flex" vs-align="center">
        <vs-col class="w-2/12 title pl-4">신고서</vs-col>
        <vs-col class="w-10/12 pr-4">
          <file-uploader class="w-full" v-model="form.attach_file"></file-uploader>
        </vs-col>
      </vs-row>

      <vs-row class="w-full  mb-8 flex" vs-align="center">
        <vs-col class="w-2/12 title pl-4">신고필증</vs-col>
        <vs-col class="w-10/12 pr-4">
          <file-uploader class="w-full" v-model="form.attach_certificate"></file-uploader>
        </vs-col>
      </vs-row>

      <vs-row class="mb-8" v-if="!readonly">
        <vs-col class="flex" vs-justify="center">
          <vs-button class="mr-2" color="secondary" @click="register">저장</vs-button>
          <vs-button type="border" color="secondary" @click="handleCloseSelf">닫기</vs-button>
        </vs-col>
      </vs-row>
    </vs-col>

  </vs-popup>
</template>

<script>
import DateSelector from '../../../components/selector/DateSelector'
import FileUploader from '../../../components/FileUploader'

export default {
  name: 'PopupGovernmentAdd',
  props: {
    popupActive: Boolean,
    readonly: Boolean,
    postId: [Number, String]
  },
  watch: {
    postId (id) {
      if (id) {
        this.isCreated = false
        this.post_id = id
        this.loadPost()
      } else {
        this.isCreated = true
        this.form = {
          field_name: '',          // 현장명
          type: '',                // 신고종류
          writer: '',              // 작성자
          period: '',              // 유효일
          report_date: '',         // 신고일
          report_content: '',      // 내용
          create_at: '',           // 작성일
          attach_file: {},         // 신고서
          attach_certificate: {},  // 신고필증
          preview: {
            field_name: '',
            type: '',
            writer: '',
            period: '',
            report_date: '',
            report_content: '',
            create_at: '',
            attach_file: {},
            attach_certificate: {}
          }
        },
          this.fileList = []
      }
    },
    popupActiveSync(value) {
      const body = document.querySelector('body');
      if (value) {
        body.style.overflow = 'hidden'
      } else {
        body.style.overflow = 'auto'
      }
    },
  },
  components: {
    FileUploader,
    DateSelector
  },
  data () {
    return {
      post_id: '',
      governmentList: [], // 신고종류
      form: {
        field_name: '',          // 현장명
        type: '',                // 신고종류
        writer: '',              // 작성자
        period: '',              // 유효일
        report_date: '',         // 신고일
        report_content: '',      // 내용
        create_at: '',           // 작성일
        attach_file: {},         // 신고서
        attach_certificate: {},  // 신고필증
        preview: {
          field_name: '',
          type: '',
          writer: '',
          period: '',
          report_date: '',
          report_content: '',
          create_at: '',
          attach_file: {},
          attach_certificate: {}
        }
      },
      isCreated: true

    }
  },
  computed: {
    projectInfo () {
      return this.$store.state.project.projectInfo
    },
    userInfo () {
      return this.$store.state.auth.userInfo
    },
    popupActiveSync: {
      get () {
        return this.popupActive
      },
      set () {
        this.handleCloseSelf()
      }
    }

  },
  created () {
    this.init()
    this.loadGovernmentList()
  },
  methods: {

    async init () {
      await this.$store.dispatch('USER_INFO')
      this.form.writer = this.userInfo.name
      this.form.field_name = this.projectInfo.field_name
    },

    async loadGovernmentList () {

      const projectId = this.$route.params.proj_id
      await this.$store.dispatch('project/HSE_LOAD_INFO_RENTWORK_PROJECT', {projectId})

      this.governmentList = this.$store.state.project.hseProjectRentWorkList
    },

    async loadPost () {

      // 내용불러오기
      const boardId = 27 //state_government
      const postId = this.postId

      await this.$store.dispatch('board/LOAD_POST', {
        boardId,
        postId
      })
      const post = JSON.parse(this.$store.state.board.postInfo.post_content)
      this.form = post
    },

    getPreview (data) {
      if (data.preview) {
        const preview = JSON.parse(data.preview)
        return preview
      } else {
        return {
          type: '', // 구분
          reportType: '', // 신고종류
          isTarget: false, // 대상여부
          content: '' // 신고대상기준
        }
      }
    },

    async register () {
      // 등록정보
      const projectId = this.$route.params.proj_id
      const boardId = 27 //state_government
      const title = this.form.field_name

      this.form.preview.field_name = this.form.field_name
      this.form.preview.type = this.form.type
      this.form.preview.writer = this.form.writer
      this.form.preview.period = this.form.period
      this.form.preview.report_date = this.form.report_date
      this.form.preview.report_content = this.form.report_content
      this.form.preview.attach_file = this.form.attach_file
      this.form.preview.attach_certificate = this.form.attach_certificate

      this.form.create_at = new Date().format('yyyy-MM-dd')
      this.form.preview.create_at = this.form.create_at

      const content = JSON.stringify(this.form)

      if (this.formCheck()) {
        if (this.isCreated) {
          await this.$store.dispatch('board/CREATE_POST', {
            projectId,
            boardId,
            title,
            content
          })
          this.$emit('register')
        } else {
          const postId = this.postId
          await this.$store.dispatch('board/UPDATE_POST', {
            projectId,
            boardId,
            postId,
            title,
            content
          })
          this.$emit('update')
        }
        this.$emit('popupActiveSync', false)
      }

    },

    formCheck () {
      if (this.form.type.trim().length <= 0) {
        alert('현장명을 선택해주세요')
        return false
      } else if (this.form.period.trim().length <= 0) {
        alert('시기를 입력해주세요')
        return false
      } else if (this.form.report_date.trim().length <= 0) {
        alert('신고일을 선택해주세요')
        return false
      } else if (this.form.report_content.trim().length <= 0) {
        alert('내용을 입력해주세요')
        return false
      }
      return true
    },

    handleCloseSelf () {
      this.$emit('popupActiveSync', false)
    }
  }
}

</script>

<style>

#popupRegAdmin > .vs-popup {
  width: 1024px !important;
}

#popupRegAdmin > .vs-popup > .vs-popup--content {
  width: 100%;
  padding: 0;
  margin: 0;
}

#popupRegAdmin > .vs-popup > .vs-popup--content > .vs-row {
  padding: 24px;

}

</style>
