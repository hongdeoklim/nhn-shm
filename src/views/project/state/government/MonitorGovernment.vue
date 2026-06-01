<template>
  <div>

    <vs-row class="mt-4 mb-4 w-full">
      <vs-col class="w-2/12">
        <span><i class="dot"></i>신고이행</span>
      </vs-col>
      <vs-col class="w-2/12">
        <span><i class="dot red"></i>신고미이행</span>
      </vs-col>
    </vs-row>

    <vs-row class="border">
      <vs-col>
        <div class="border-top border-left border-right table-display">

          <span class="title table-center">현장명</span>
          <span class="title table-center border-left" v-for="(tr, indexTr) in monitoringList" :key="indexTr">{{ tr.title }}</span>

        </div>
      </vs-col>
    </vs-row>


    <vs-row class="">
      <vs-col class="border-bottom">
        <div class="border-top border-left border-right table-display table-content">
          <span class="table-center">{{ projectInfo.field_name }}</span>
          <span class="table-center border-left" v-for="(tr, indexTr) in monitoringList" :key="indexTr">
            <i v-if="tr.content" class="dot"></i>
            <i v-else class="dot red"></i>
          </span>
        </div>
      </vs-col>
    </vs-row>


  </div>
</template>

<script>
export default {
  name: 'MonitorGovernment',
  data () {
    return {
      stateList: [],
      checkList: [],
      table: {
        list: [],
        perPage: 1,
        keyword: ''
      }
    }
  },
  created () {
    this.loadPostStateList()
    this.loadPostCheckList()
  },
  computed: {
    projectInfo () {
      return this.$store.state.project.projectInfo
    },
    monitoringList () {
      const list = []
      for (const data of this.checkList) {
        let isCheck = false
        const type = data.type
        for (const item of this.stateList) {
          if (type === this.getPreview(item).type) {
            isCheck = true
            break
          }
        }

        list.push(
          {
            title: type,
            content: isCheck
          }
        )
      }

      return list
    }

  },
  methods: {
    async loadPostStateList () {
      const projectId = this.$route.params.proj_id
      const boardId = 27 //state_government
      const page = 1
      const perPage = 10000

      await this.$store.dispatch('board/LOAD_POST_LIST', {
        projectId,
        boardId,
        page,
        perPage
      })
      this.stateList = this.$store.state.board.postListInfo.data
    },

    async loadPostCheckList () {
      const projectId = this.$route.params.proj_id
      await this.$store.dispatch('project/HSE_LOAD_INFO_RENTWORK_PROJECT', {projectId})

      this.checkList = this.$store.state.project.hseProjectRentWorkList
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
    }
  }
}
</script>

<style scoped>

.table-display {
  display: grid;
  grid-template-rows: minmax(52px, 100%);
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
}

.table-content {
  background-color: white;
}

.table-center {
  display: flex;
  height: 100%;
  align-items: center;
  justify-content: center;
}

</style>
