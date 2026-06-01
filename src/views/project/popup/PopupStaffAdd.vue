<template>
  <vs-popup id="popupStaffAdd" title="출역인원" :active.sync="popupActiveSync">
    <vs-row>
      <vs-row class="mb-8">
        <vs-col><h5><i class="dot"></i>인원투입 입력</h5></vs-col>
      </vs-row>

      <vs-col class="flex flex-wrap mb-4 pl-4 pr-4">
        <vs-row class="w-1/2  mb-4 flex" vs-align="center">
          <vs-col class="w-4/12 title pl-4">현장명</vs-col>
          <vs-col class="w-8/12 pr-4">{{ projectInfo.field_name }}</vs-col>
        </vs-row>

        <vs-row class="w-1/2  mb-4 flex" vs-align="center">
          <vs-col class="w-4/12 title pl-4">소속</vs-col>
          <vs-col class="w-8/12 pr-4">{{ form.com_name }}</vs-col>
        </vs-row>

        <vs-row class="w-1/2  mb-4 flex" vs-align="center">
          <vs-col class="w-4/12 title pl-4">작성자</vs-col>
          <vs-col class="w-8/12 pr-4">{{ form.writer }}</vs-col>
        </vs-row>

        <vs-row class="w-1/2  mb-4 flex" vs-align="center">
          <vs-col class="w-4/12 title pl-4">구분</vs-col>
          <vs-col class="w-8/12 pr-4">
            <vs-select class="w-full" autocomplete v-model="form.type" style="color:#3c3c3c;">
              <vs-select-item text="(부문없음)" value="0"/>
              <vs-select-item text="건축주택" value="1"/>
              <vs-select-item text="인프라" value="2"/>
              <vs-select-item text="하이테크" value="3"/>
              <vs-select-item text="에너지" value="4"/>
            </vs-select>
          </vs-col>
        </vs-row>

        <vs-row class="w-1/2  mb-4 flex" vs-align="center">
          <vs-col class="w-4/12 title pl-4">전체인원</vs-col>
          <vs-col class="w-8/12 pr-4">
            <ml-input class="w-full" v-model="form.num_of_all"/>
          </vs-col>
        </vs-row>

        <vs-row class="w-1/2  mb-4 flex" vs-align="center">
          <vs-col class="w-4/12 title pl-4">남성근로자</vs-col>
          <vs-col class="w-8/12 pr-4">
            <ml-input class="w-full" v-model="form.num_of_tbm"/>
          </vs-col>
        </vs-row>

        <vs-row class="w-1/2  mb-4 flex" vs-align="center">
          <vs-col class="w-4/12 title pl-4">여성근로자</vs-col>
          <vs-col class="w-8/12 pr-4">
            <ml-input class="w-full" v-model="form.num_of_female"/>
          </vs-col>
        </vs-row>

        <vs-row class="w-1/2  mb-8 flex" vs-align="center">
          <vs-col class="w-4/12 title pl-4">일용직근로자</vs-col>
          <vs-col class="w-8/12 pr-4">
            <ml-input class="w-full" v-model="form.num_of_oldage"/>
          </vs-col>
        </vs-row>

        <vs-row class="w-1/2  mb-8 flex" vs-align="center">
          <vs-col class="w-4/12 title pl-4">외국인근로자</vs-col>
          <vs-col class="w-8/12 pr-4">
            <ml-input class="w-full" v-model="form.num_of_foreign"/>
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
import DateSelector from '../../../components/selector/DateSelector'
import FileUploader from '../../../components/FileUploader'

export default {
  name: 'PopupStaffAdd',
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
          field_name: '',
          type: '0',
          com_name: '',
          com_number: '',
          writer: '',
          num_of_all: '',
          num_of_tbm: '',
          num_of_female: '',
          num_of_oldage: '',
          num_of_foreign: '',
          preview: {
            field_name: '',
            type: '',
            com_name: '',
            com_number: '',
            writer: '',
            num_of_all: '',
            num_of_tbm: '',
            num_of_female: '',
            num_of_oldage: '',
            num_of_foreign: ''
          }
        }
        this.fileList = []
        this.init()
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
      isCreated: true,
      form: {
        field_name: '',
        type: '0',
        com_name: '',
        com_number: '',
        writer: '',
        num_of_all: '',
        num_of_tbm: '',
        num_of_female: '',
        num_of_oldage: '',
        num_of_foreign: '',
        preview: {
          field_name: '',
          type: '',
          com_name: '',
          com_number: '',
          writer: '',
          num_of_all: '',
          num_of_tbm: '',
          num_of_female: '',
          num_of_oldage: '',
          num_of_foreign: ''
        }
      }
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
    this.init()
  },
  methods: {

    async init () {
      await this.$store.dispatch('USER_INFO')
      this.form.writer = this.userInfo.name

      await this.$store.dispatch('company/LOAD_COMPANY', {companyId: this.userInfo.company_id})
      this.form.com_name = this.$store.state.company.companyInfo.com_name
      this.form.com_number = this.$store.state.company.companyInfo.com_number
    },

    async loadPost () {

      // 내용불러오기
      const projectId = this.$route.params.proj_id
      const boardId = 21 //manpower
      const postId = this.postId

      await this.$store.dispatch('board/LOAD_POST', {
        projectId,
        boardId,
        postId
      })
      const post = JSON.parse(this.$store.state.board.postInfo.post_content)
      this.form = post

    },

    async register () {
      this.form.field_name = this.projectInfo.field_name

      // 등록정보
      const projectId = this.$route.params.proj_id
      const boardId = 21 //manpower
      const title = this.form.field_name

      this.form.preview.field_name = this.form.field_name
      this.form.preview.type = this.form.type
      this.form.preview.com_name = this.form.com_name
      this.form.preview.com_number = this.form.com_number
      this.form.preview.writer = this.form.writer
      this.form.preview.num_of_all = this.form.num_of_all
      this.form.preview.num_of_tbm = this.form.num_of_tbm
      this.form.preview.num_of_female = this.form.num_of_female
      this.form.preview.num_of_oldage = this.form.num_of_oldage
      this.form.preview.num_of_foreign = this.form.num_of_foreign

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
      } else if (this.form.num_of_all.trim().length <= 0) {
        alert('전체인원을 입력해주세요')
        return false
      } else if (this.form.num_of_tbm.trim().length <= 0) {
        alert('남성근로자을 입력해주세요')
        return false
      } else if (this.form.num_of_female.trim().length <= 0) {
        alert('여성근로자를 입력해주세요')
        return false
      } else if (this.form.num_of_oldage.trim().length <= 0) {
        alert('일용직근로자를 입력해주세요')
        return false
      } else if (this.form.num_of_foreign.trim().length <= 0) {
        alert('외국인근로자를 입력해주세요')
        return false
      }
      return true
    },

    handleCloseSelf () {
      this.$emit('popupActiveSync', false)
    },

    handleSelectMember (member) {
      this.form.user_name = member.name
    }
  }
}

</script>

<style>
#popupStaffAdd > .vs-popup {
  width: 1024px !important;
}

#popupStaffAdd > .vs-popup > .vs-popup--content {
  width: 100%;
  padding: 0;
  margin: 0;
}

#popupStaffAdd > .vs-popup > .vs-popup--content > .vs-row {
  padding: 24px;

}
</style>

<style scoped>
</style>
