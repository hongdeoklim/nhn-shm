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
          <vs-col class="w-4/12 title pl-4">전체장비</vs-col>
          <vs-col class="w-8/12 pr-4">
            <ml-input class="w-full" v-model="form.num_of_all"/>
          </vs-col>
        </vs-row>

        <vs-row class="w-1/2  mb-4 flex" vs-align="center">
          <vs-col class="w-4/12 title pl-4">덤프트럭(D/T)</vs-col>
          <vs-col class="w-8/12 pr-4">
            <ml-input class="w-full" v-model="form.num_of_dump_truck"/>
          </vs-col>
        </vs-row>

        <vs-row class="w-1/2  mb-4 flex" vs-align="center">
          <vs-col class="w-4/12 title pl-4">포크레인(B/H)</vs-col>
          <vs-col class="w-8/12 pr-4">
            <ml-input class="w-full" v-model="form.num_of_fork_crane"/>
          </vs-col>
        </vs-row>

        <vs-row class="w-1/2  mb-8 flex" vs-align="center">
          <vs-col class="w-4/12 title pl-4">이동식크레인</vs-col>
          <vs-col class="w-8/12 pr-4">
            <ml-input class="w-full" v-model="form.num_of_mobile_crane"/>
          </vs-col>
        </vs-row>

        <vs-row class="w-1/2  mb-8 flex" vs-align="center">
          <vs-col class="w-4/12 title pl-4">발전기</vs-col>
          <vs-col class="w-8/12 pr-4">
            <ml-input class="w-full" v-model="form.num_of_generator"/>
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
  name: 'PopupEquipmentAdd',
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
          num_of_dump_truck: '',
          num_of_fork_crane: '',
          num_of_mobile_crane: '',
          num_of_generator: '',
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
        num_of_dump_truck: '',
        num_of_fork_crane: '',
        num_of_mobile_crane: '',
        num_of_generator: '',
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
      const boardId = 49 // equipment_power
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
      const boardId = 49 // equipment_power
      const title = this.form.field_name

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
        alert('전체장비을 입력해주세요')
        return false
      } else if (this.form.num_of_dump_truck.trim().length <= 0) {
        alert('덤프트럭(D/T)을 입력해주세요')
        return false
      } else if (this.form.num_of_fork_crane.trim().length <= 0) {
        alert('포크레인(B/H)을 입력해주세요')
        return false
      } else if (this.form.num_of_mobile_crane.trim().length <= 0) {
        alert('이동식 크레인을 입력해주세요')
        return false
      } else if (this.form.num_of_generator.trim().length <= 0) {
        alert('발전기를 입력해주세요')
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
