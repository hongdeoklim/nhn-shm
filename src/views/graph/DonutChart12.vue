<template>
  <donut-chart-card
    title="안전보건 점검 현황"
    :value="data"
    unit="건"
    :isMoveWrite="isMoveWrite"
    @detail="onClickDetail"
    @write="onClickWrite"
  ></donut-chart-card>
</template>

<script>
import DonutChartCard from '@/components/DonutChartCard'
import CircleGraphUtil from '@/util/CircleGraphUtil'
export default {
  name: 'DonutChart12',
  components: {DonutChartCard},
  props: {
    dataType: 'detail' | 'field' | 'company' | 'project',
  },
  computed: {
    projectId () {
      return this.$route.params.proj_id
    },
    isMoveWrite () {
      // if (Number(`${this.projectId}`) === 1) return false
      // else return true
      return true
    }
  },
  watch: {
    dataType (/*value*/) {
      this.loadGraph()
    }
  },
  data () {
    return {
      graphId: 12,
      boardIds: [100, 112, 163, 216, 217, 218, 219, 220, 221, 326, 327, 328, 391], //110, 16
      summaryKey: this.dataType === 'field' ? ['안전보건점검_현장명', 'count'] : ['안전보건점검_점검표', 'count'],
      data: [{label: '데이터 없음', value: 0}],
    }
  },
  async mounted () {
    await this.loadGraph()
  },
  methods: {
    async loadGraph () {
      const summaryKey = this.summaryKey

      const dataList = []
      for (const boardId of this.boardIds) {
        const data = await this.loadGraphPiece(boardId, summaryKey)
        dataList.push(data)
      }
      //const data1 = await this.loadGraphPiece(this.boardIds[0], summaryKey)
      //const data2 = await this.loadGraphPiece(this.boardIds[1], summaryKey)

      let value = {}
      for (const data of dataList) {
        value = CircleGraphUtil.combineCircleGraphData(value, data)
      }
      //const value = CircleGraphUtil.combineCircleGraphData(data1, data2)

      const newData = CircleGraphUtil.circleModuleWithData(value)
      newData.sort((a, b) => b.value - a.value)
      this.data = newData
    },
    async loadGraphPiece (boardId, summaryKey) {
      const value = await this.$store.dispatch('summary/FIRA_LOAD_SUMMARY', {
        boardId,
        projectIds: this.projectId ? [this.projectId] : []
      }).then(value => {
        if (this.dataType === 'project') {
          return CircleGraphUtil.getProjectFromEachProject(value, summaryKey)
        } else if (this.dataType === 'company') {
          return CircleGraphUtil.getCompanyFromEachCompany(value, summaryKey)
        } else {
          return CircleGraphUtil.getColumnFromEachCompany(value, summaryKey)
        }
      })
      return value
    },
    onClickDetail () {
      const projectId = this.$route.params.proj_id
      const graphId = this.graphId
      if (projectId) {
        this.$router.push(`/project/${projectId}/graph-detail/${graphId}`)
      } else {
        this.$router.push(`/graph-detail/${graphId}`)
      }
    },
    onClickWrite () {
      const proj_id = this.$route.params.proj_id
      const boardId = `${this.boardIds[0]}`
      this.$router.push({name: 'write|tab', params: {proj_id, boardId}})
    }
  },
}
</script>

<style scoped>

</style>
