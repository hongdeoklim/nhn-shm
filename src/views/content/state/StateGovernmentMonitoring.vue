<template>
  <div>

    <vs-row class="mt-4 mb-4 w-full">
      <vs-col class="w-1/12">
        <span><i class="dot"></i>{{$t('content.state.government.monitoring.신고이행')}}</span>
      </vs-col>
      <vs-col class="w-1/12">
        <span><i class="dot red"></i>{{$t('content.state.government.monitoring.신고미이행')}}</span>
      </vs-col>
    </vs-row>

    <vs-row class="border">
      <vs-col>
        <div class="border-top border-left border-right table-display">

          <span class="title table-center">{{$t('content.state.government.monitoring.현장명')}}</span>
          <span class="title table-center border-left" v-for="(tr, indexTr) in checkList" :key="indexTr">{{ getPreview(tr).reportType }}</span>

        </div>
      </vs-col>
    </vs-row>


    <vs-row class="">
      <vs-col class="border-bottom">
        <div class="border-top border-left border-right table-display table-content" v-for="(item, index) in monitoringList" :key="index">
          <span class="table-center">{{ item.field_name }}</span>
          <span class="table-center border-left" v-for="(tr, indexTr) in checkList" :key="indexTr">
            <i v-if="item.data[getPreview(tr).reportType] > 0" class="dot"></i>
            <i v-else class="dot red"></i>
          </span>
        </div>
      </vs-col>
    </vs-row>


  </div>
</template>

<script>
export default {
  name: 'StateGovernMonitoring',
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
      const projectList = {}

      for (const item of this.stateList) {
        if (!projectList[item.project_id]) {
          projectList[item.project_id] = {
            project_id: item.project_id,
            field_name: (item.project) ? item.project.field_name : '',
            data:{}
          }
        }

        const type = this.getPreview(item).type
        if (projectList[item.project_id].data[type]) {
          projectList[item.project_id].data[type]++
        } else {
          projectList[item.project_id].data[type] = 1
        }
      }

      return projectList
    }

  },
  methods: {
    async loadPostStateList () {
      const projectId = ''
      const boardId = 27 //state_government
      const page = 1
      const perPage = 1000000

      await this.$store.dispatch('board/LOAD_POST_LIST', {
        projectId,
        boardId,
        page,
        perPage
      })
      this.stateList = this.$store.state.board.postListInfo.data
    },

    async loadPostCheckList () {
      const boardId = 34 //state_government_checklist
      const page = 1
      const perPage = 1000000

      await this.$store.dispatch('board/LOAD_POST_LIST', {
        boardId,
        page,
        perPage
      })
      const listData = this.$store.state.board.postListInfo.data
      this.checkList = []
      for (const data of listData) {
        if (this.getPreview(data).isTarget) {
          this.checkList.push(data)
        }
      }
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
