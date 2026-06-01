<template>
  <vs-popup title="세부내역" :active.sync="popupActiveSync">
    <vs-row class="mb-4">

      <vs-col class="w-1/2 mb-4 px-2 flex" vs-align="center">
        <vs-col class="w-4/12"><h5 style="font-size: 1rem">작성일</h5></vs-col>
        <vs-col class="w-8/12"><ml-input class="w-full" readonly="readonly" v-model="form.date"/></vs-col>
      </vs-col>

      <vs-col class="w-1/2 mb-4 px-2 flex" vs-align="center">
        <vs-col class="w-4/12"><h5 style="font-size: 1rem">분야</h5></vs-col>
        <vs-col class="w-8/12">
          <vs-select autocomplete class="w-full" v-model="form.type">
            <vs-select-item text="안전" value="1"/>
          </vs-select>
        </vs-col>
      </vs-col>

      <vs-col class="w-1/2 mb-4 px-2 flex" vs-align="center">
        <vs-col class="w-4/12"><h5 style="font-size: 1rem">작성자</h5></vs-col>
        <vs-col class="w-8/12">
          <ml-input class="w-full" readonly="readonly" v-model="form.writer"/>
        </vs-col>
      </vs-col>

      <vs-col class="w-1/2 mb-4 px-2 flex" vs-align="center">
        <vs-col class="w-4/12"><h5 style="font-size: 1rem">관할부처</h5></vs-col>
        <vs-col class="w-8/12">
          <ml-input class="w-full" v-model="form.revision"/>
        </vs-col>
      </vs-col>

      <vs-col class="w-full mb-4 px-2 flex" vs-align="center">
        <vs-col class="w-2/12"><h5 style="font-size: 1rem">제목</h5></vs-col>
        <vs-col class="w-10/12">
          <ml-input class="w-full" v-model="form.project_title"/>
        </vs-col>
      </vs-col>

      <vs-col class="w-full mb-4 px-2 flex" vs-align="center">
        <vs-col class="w-2/12"><h5 style="font-size: 1rem">첨부파일</h5></vs-col>
        <vs-col class="w-10/12">
          <file-upload-module class="w-full" type="check_list_col" v-model="fileList"/>
        </vs-col>
      </vs-col>

    </vs-row>
    <vs-row>
      <vs-col class="flex" vs-justify="flex-end">
        <vs-button v-if="!isCreated && isWriter" class="mr-4" color="secondary" type="border" @click="handleDelete">삭제</vs-button>
        <vs-button v-if="!isCreated && isWriter" class="" color="secondary" @click="handleClickRegister">저장</vs-button>
        <vs-button v-if="isCreated" class="" color="secondary" @click="handleClickRegister">세부내역 등록</vs-button>
      </vs-col>

    </vs-row>
  </vs-popup>
</template>


<script>
import draggable from 'vuedraggable'
import memberModule from '@/store/member/memberModule.js'
import DateSelector from '@/components/selector/DateSelector'
import FileUploadModule from '@/views/modules/FileUploadModule'

export default {
  name: 'PopupPlanProject',
  components: {
    FileUploadModule,
    DateSelector,
    draggable
  },
  props: {
    value:Object,
    popupActive: Boolean
  },
  watch: {
    value (data) {
      if (data.created_at) {
        if (this.userInfo.id === data.author.id) {
          this.isWriter = true
        }else {
          this.isWriter = false
        }

        this.postId = data.id
        this.isCreated = false
        this.form.date = new Date(data.created_at).format('yyyy-MM-dd')
        this.form.writer = data.author.name
        this.form.project_title = data.post_title
        this.form.revision = this.getPreview(data).revision
        this.fileList = []
        for (const file of data.post_attachment) {
          this.fileList.push({
            id:file.id,
            fileName:file.file_name,
            fileSize:file.file_size,
            path:file.path
          })
        }

        this.oldForm = JSON.parse(JSON.stringify(this.form))
      } else {
        this.isCreated = true
        this.isWriter = true
        let data = this.userInfo
        this.form.date = new Date().format('yyyy-MM-dd')
        this.form.writer = data.name
        this.form.project_title = ''
        this.form.revision = ''
        this.fileList = []
        this.oldForm = {}
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
  computed: {
    popupActiveSync: {
      get () {
        return this.popupActive
      },
      set () {
        this.handleCloseSelf()
      }
    },
    userInfo () {
      return this.$store.state.auth.userInfo
    }
  },
  data () {
    return {
      active:false,

      isCreated:true,
      isWriter:true,
      postId:'',
      oldForm: {},
      form:{
        project_title:'',
        type:1,
        revision:'',
        writer:'',

        preview:{
          type:1,
          revision:'',
          writer:''
        }
      },
      fileList:[]
    }
  },
  mounted () {
    const backButtonRouteGuard = this.$router.beforeEach((to, from, next) => {
      if (this.popupActive) {
        this.handleCloseSelf()
        next(false); return
      }
      next(true)
    })
    this.$once('hook:destroyed', () => {
      backButtonRouteGuard()
    })
  },
  async created () {
    let data = this.$store.state.auth.userInfo
    if (data.name) {
    } else {
      await this.$store.dispatch('USER_INFO')
      data = this.$store.state.auth.userInfo
    }
    this.form.date = new Date().format('yyyy-MM-dd')
    this.form.writer = data.name
  },
  methods:{

    formChangeCheck () {
      if (this.oldForm.date) {
        if (this.form.date !== this.oldForm.date) return false
        else if (this.form.writer !== this.oldForm.writer) return false
        else if (this.form.project_title !== this.oldForm.project_title) return false
        else if (this.form.revision !== this.oldForm.revision) return false
      }

      return true
    },
    formCheck () {
      if (this.form.revision.trim().length <= 0) {
        alert('관할부처을 입력해주세요')
        return false
      } else if (this.form.project_title.trim().length <= 0 ) {
        alert('제목을 입력해주세요')
        return false
      }
      return true
    },

    async register () {
      // 등록정보
      const projectId = this.$route.params.proj_id
      const boardId = 15 //plan_management
      const title = this.form.project_title
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
      this.form.preview.revision = this.form.revision
      this.form.preview.type = this.form.type
      this.form.preview.writer = this.form.writer
      const content = JSON.stringify(this.form)

      if (this.formCheck()) {
        if (this.isCreated) {
          await this.$store.dispatch('board/CREATE_POST', {projectId, boardId, title, content, uploads})
          this.$emit('register')
        } else {
          const postId = this.postId
          await this.$store.dispatch('board/UPDATE_POST', {projectId, boardId, postId, title, content, uploads})
          this.$emit('update')
        }
        this.$emit('popupActiveSync', false)
      }

    },
    getPreview (data) {
      if (data.preview) {
        const preview = JSON.parse(data.preview)
        return preview
      }
    },

    async handleClickRegister () {
      await this.register()
    },

    handleCloseSelf () {
      if(this.formChangeCheck()){
        this.$emit('popupActiveSync', false)
      } else {
        if (confirm('업데이트 내용이 있습니다. 저장하지 않고 이동하시겠습니까?')) {
          this.form = JSON.parse(JSON.stringify(this.oldForm))
          this.$emit('popupActiveSync', false)
        }
      }
    },

    async handleDelete () {
      if (confirm('삭제하시겠습니까?')) {
        const boardId = 15 //plan_management
        const postId = this.postId
        await this.$store.dispatch('board/DELETE_POST', {boardId, postId})
        this.$emit('delete')
        this.$emit('popupActiveSync', false)
      }
    }
  }
}

</script>


<style>


</style>

<style scoped>

.table-layout {
  border: 1px solid #cdcdcd;
}
.table-layout .trow {
  border-bottom: 1px solid #cdcdcd;
}
.table-layout .tcol {
  border-right: 1px solid #cdcdcd;
}
</style>
