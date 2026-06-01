<template>
  <vs-popup id="popupRegAdmin" title="환경책임자" :active.sync="popupActiveSync">
    <vs-row>
      <vs-row class="mb-8">
        <vs-col><h5><i class="dot"></i>환경책임자 등록</h5></vs-col>
      </vs-row>

      <vs-col class="flex flex-wrap mb-4 pl-4 pr-4">
        <vs-row class="w-1/2  mb-4 flex" vs-align="center">
          <vs-col class="w-4/12 title pl-4">성명</vs-col>
          <vs-col class="w-8/12 pr-4">
            <member-selector class="w-full" v-model="form.user_id" @select="handleSelectMember"/>
          </vs-col>
        </vs-row>
        <vs-row class="w-1/2  mb-4 flex" vs-align="center">
          <vs-col class="w-4/12 title pl-4">사번</vs-col>
          <vs-col class="w-8/12 pr-4">
            <ml-input class="w-full" v-model="form.user_number"/>
          </vs-col>
        </vs-row>

        <vs-row class="w-1/2  mb-4 flex" vs-align="center">
          <vs-col class="w-4/12 title pl-4">구분</vs-col>
          <vs-col class="w-8/12 pr-4">
            <vs-select class="w-full" autocomplete v-model="form.work_type" style="color:#3c3c3c;">
              <vs-select-item text="참여안함" value="0"/>
              <vs-select-item text="직책구분1" value="1"/>
              <vs-select-item text="직책구분2" value="2"/>
              <vs-select-item text="직책구분3" value="3"/>
              <vs-select-item text="직책구분4" value="4"/>
              <vs-select-item text="직책구분5" value="5"/>
              <vs-select-item text="직책구분6" value="6"/>
              <vs-select-item text="직책구분7" value="7"/>
              <vs-select-item text="직책구분8" value="8"/>
              <vs-select-item text="직책구분9" value="9"/>
              <vs-select-item text="직책구분10" value="10"/>
            </vs-select>
          </vs-col>
        </vs-row>
        <vs-row class="w-1/2  mb-4 flex" vs-align="center">
          <vs-col class="w-4/12 title pl-4">부서</vs-col>
          <vs-col class="w-8/12 pr-4">
            <ml-input class="w-full" v-model="form.department"/>
          </vs-col>
        </vs-row>

        <vs-row class="w-1/2  mb-4 flex" vs-align="center">
          <vs-col class="w-4/12 title pl-4">발령일</vs-col>
          <vs-col class="w-8/12 pr-4">
            <date-selector class="w-full" v-model="form.date_issuance"/>
          </vs-col>
        </vs-row>
        <vs-row class="w-1/2  mb-4 flex" vs-align="center">
          <vs-col class="w-4/12 title pl-4">선임일</vs-col>
          <vs-col class="w-8/12 pr-4">
            <date-selector class="w-full" v-model="form.date_appointment"/>
          </vs-col>
        </vs-row>

        <vs-row class="w-1/2  mb-4 flex" vs-align="center">
          <vs-col class="w-4/12 title pl-4">이동일</vs-col>
          <vs-col class="w-8/12 pr-4">
            <date-selector class="w-full" v-model="form.date_moving"/>
          </vs-col>
        </vs-row>
        <vs-row class="w-1/2  mb-4 flex" vs-align="center">
          <vs-col class="w-4/12 title pl-4">자격증 취득일</vs-col>
          <vs-col class="w-8/12 pr-4">
            <date-selector class="w-full" v-model="form.date_complete"/>
          </vs-col>
        </vs-row>

        <vs-row class="w-full mb-2">
          <vs-col class="w-full mb-4 px-2 flex" vs-align="center">
            <vs-col class="w-2/12"><h5 style="font-size: 1rem">첨부파일</h5></vs-col>
            <vs-col class="w-10/12">
              <file-upload-module class="w-full" type="check_list_col" v-model="fileList"/>
            </vs-col>
          </vs-col>
        </vs-row>

        <vs-row>
          <vs-col class="flex" vs-justify="center">
            <vs-button class="mr-2" color="secondary" @click="register">등록</vs-button>
            <vs-button type="border" color="secondary" @click="handleCloseSelf">닫기</vs-button>
          </vs-col>
        </vs-row>
      </vs-col>
    </vs-row>

  </vs-popup>
</template>

<script>
import FileUploadModule from '@/views/modules/FileUploadModule'
import MemberSelector from '@/components/selector/MemberSelector'
import DateSelector from '@/components/selector/DateSelector'

export default {
  name: 'PopupStateDirectorRegAdmin',
  components: {
    DateSelector,
    MemberSelector,
    FileUploadModule
  },
  props: {
    popupActive: Boolean,
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
          field_name: '', // 프로젝트 이름
          user_id: '0',
          user_name: '',
          user_number: '',
          work_type: '0',
          department: '', //부서
          date_issuance: '', //발령일
          date_appointment: '', //선임일
          date_moving: '', //이동일
          date_complete: '', //이수일

          preview: {
            field_name: '', // 프로젝트 이름
            safety_chief_name: '', // 안전보건책임자
            date_issuance: '', //발령일
            date_appointment: '', //선임일
            date_moving: '', //이동일
            date_complete: '' //이수일
          }
        }
        this.fileList = []
      }
    }
  },

  computed: {
    projectInfo () {
      return this.$store.state.project.projectInfo
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
  data () {
    return {
      post_id: '',
      form: {
        field_name: '', // 프로젝트 이름
        user_id: '0',
        user_name: '',
        user_number: '',
        work_type: '0',
        department: '', //부서
        date_issuance: '', //발령일
        date_appointment: '', //선임일
        date_moving: '', //이동일
        date_complete: '', //이수일

        preview: {
          field_name: '', // 프로젝트 이름
          safety_chief_name: '', // 안전보건책임자
          date_issuance: '', //발령일
          date_appointment: '', //선임일
          date_moving: '', //이동일
          date_complete: '' //이수일
        }
      },
      fileList: [],
      isCreated: true
    }
  },
  mounted () {
    const backButtonRouteGuard = this.$router.beforeEach((to, from, next) => {
      if (this.showPopup) {
        this.handleCloseSelf()
        next(false); return
      }
      next(true)
    })
    this.$once('hook:destroyed', () => {
      backButtonRouteGuard()
    })
  },
  created () {

  },
  methods: {

    initData () {
    },

    async loadPost () {

      // 내용불러오기
      const boardId = 25 //state_director
      const postId = this.postId

      await this.$store.dispatch('board/LOAD_POST', {
        boardId,
        postId
      })
      const post = JSON.parse(this.$store.state.board.postInfo.post_content)
      this.form = post
      const files = this.$store.state.board.postInfo.post_attachment
      if (files) {
        this.fileList = []
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
    },

    async register () {

      this.form.field_name = this.projectInfo.field_name
      this.form.date_issuance = new Date(this.form.date_issuance).format('yyyy-MM-dd')
      this.form.date_appointment = new Date(this.form.date_appointment).format('yyyy-MM-dd')
      this.form.date_moving = new Date(this.form.date_moving).format('yyyy-MM-dd')
      this.form.date_complete = new Date(this.form.date_complete).format('yyyy-MM-dd')

      // 등록정보
      const projectId = this.$route.params.proj_id
      const boardId = 25 //state_director
      const title = this.form.field_name
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

      this.form.preview.field_name = this.form.field_name
      this.form.preview.safety_chief_name = this.form.user_name
      this.form.preview.date_issuance = this.form.date_issuance
      this.form.preview.date_appointment = this.form.date_appointment
      this.form.preview.date_moving = this.form.date_moving
      this.form.preview.date_complete = this.form.date_complete
      const content = JSON.stringify(this.form)

      if (this.formCheck()) {
        if (this.isCreated) {
          await this.$store.dispatch('board/CREATE_POST', {
            projectId,
            boardId,
            title,
            content,
            uploads
          })
          this.$emit('register')
        } else {
          const postId = this.postId
          await this.$store.dispatch('board/UPDATE_POST', {
            projectId,
            boardId,
            postId,
            title,
            content,
            uploads
          })
          this.$emit('update')
        }
        this.$emit('popupActiveSync', false)
      }

    },

    formCheck () {
      if (this.form.user_number.trim().length <= 0) {
        alert('사번을 입력해주세요')
        return false
      } else if (this.form.department.trim().length <= 0) {
        alert('부서를 입력해주세요')
        return false
      } else if (this.form.date_issuance.trim().length <= 0) {
        alert('발령일을 선택해주세요')
        return false
      }
      return true
    },

    handleCloseSelf () {
      this.$emit('popupActiveSync', false)
      this.initData()
    },

    handleSelectMember (member) {
      this.form.user_name = member.name
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
