<template>
  <div>
    <vx-card class="mb-6" v-if="rowHeader">
        <vs-row>
            <vs-col>
                <slot name="rowheader"/>
            </vs-col>
        </vs-row>
    </vx-card>
    <vx-card >
      <vs-row class="mb-6">
        <vs-col class="flex " vs-justify="flex-end">
          <div class="mr-auto" style="display:grid; align-items: center;">
            <slot name="header" :board="board" :isPrint="isPrint"/>
          </div>
          <div class="ml-auto">
            <vs-button v-if="isUpdateMode && created" class="ml-4" color="secondary" type="border" @click="onClickRemove">삭제</vs-button>
            <vs-button v-if="isUpdateMode && usePrint" class="ml-4" color="secondary" type="border" @click="onClickPrint">인쇄</vs-button>
            <vs-button class="ml-4" color="secondary" type="border" @click="onClickMoveList">목록</vs-button>
            <vs-button v-if="created" class="ml-4" color="secondary" @click="onClickSave">저장</vs-button>
          </div>
        </vs-col>
      </vs-row>
      <vs-row>
        <vs-col>
          <div id="print-report">
            <slot name="body" :board="board" :isPrint="isPrint"/>
          </div>
        </vs-col>
      </vs-row>
    </vx-card>
  </div>
</template>

<script>
export default {
  name: 'BSDocument',
  components: {},
  props: {
    usePrint: {
      type: Boolean,
      default: true
    },
    created: {
      type: Boolean,
      default: true
    },
    rowHeader: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    projectInfo() {
      return this.$store.state.project.projectInfo
    },
    projectId () {
      return parseInt(this.$route.params.proj_id)
    },
    boardId () {
      return parseInt(this.$route.params.boardId)
    },
    postId () {
      return parseInt(this.$route.params.postId)
    },


    isUpdateMode() {
      return this.$route.params.postId
    },
    getClasses() {
      if (this.toggleSide) {
        return 'fix-grid'
      }
      return 'hide-grid'
    },
  },
  watch: {
    projectInfo(value) {
      if (value) {
        this.board.projectTitle = value.field_name;
      }
    }
  },
  data() {
    return {
      isPrint: false,
      // TODO : 글쓰기 정보 및 권한
      board: {
        projectTitle: this.$store.state.project.projectInfo.field_name,
        writer: {}, //작성자 정보
        readonly: false, // 읽기전용인가
      }
    }
  },
  async mounted() {
    await this.init();
  },

  methods: {
    async init() {
      await this.$store.dispatch('USER_INFO')
      this.board.writer = {
        id: this.$store.state.auth.userInfo.id,
        name: this.$store.state.auth.userInfo.name,
        company_id: this.$store.state.auth.userInfo.company_id,
        department: this.$store.state.auth.userInfo.department,
        section: this.$store.state.auth.userInfo.section,
        com_name: ''
      }
      await this.$store.dispatch('company/LOAD_COMPANY', {companyId: this.board.writer.company_id})
      this.board.writer.com_name = this.$store.state.company.companyInfo.com_name
    },

    async onClickSave() {
      this.$emit('save')
    },

    onClickMoveList () {
      this.$emit('move', 'list')
    },

    onClickPrint () {
      // 프린트
      this.isPrint = true

      setTimeout(() => {
        const g_oBeforeBody = document.getElementById('print-report').innerHTML
        // 프린트를 보이는 그대로 나오기위한 셋팅
        window.onbeforeprint = function () {
          document.body.style.backgroundColor = '#fff'
          document.body.innerHTML = `${g_oBeforeBody}`
        }
        window.print()
        location.reload()
      }, 300)
    },

    onClickRemove () {
      this.$emit('remove')
    }
  }
}
</script>

<style lang="scss" scoped>
.fix-grid {
  display: grid !important;
  grid-template-columns: 9fr 3fr;
}

.hide-grid {
  display: grid !important;
  grid-template-columns: 9fr 0px;
}

.toggle-btn {
  padding: 0.5rem !important;
  height: 100%;
  width: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  background-color: lightgray;
  color: #fff;
}
</style>
<style>
.con-vs-tabs .con-slot-tabs {
  overflow: initial;
}
</style>
