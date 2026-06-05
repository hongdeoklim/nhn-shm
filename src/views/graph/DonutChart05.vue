<template>
  <donut-chart-card
    title="안전보건 예산 현황"
    :value="data"
    unit="원"
    :isMoveWrite="isMoveWrite"
    @detail="onClickDetail"
    @write="onClickWrite"
  ></donut-chart-card>
</template>

<script>
import DonutChartCard from '@/components/DonutChartCard'
import CircleGraphUtil from '@/util/CircleGraphUtil'
export default {
  name: 'DonutChart05',
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
    dataType (value) {
      this.loadGraph()
    }
  },
  data () {
    return {
      graphId: 5,
      boardIds: [250, 329], //250, 329
      summaryKey: this.dataType === 'field' ? ['안전보건예산_현장명', 'sum'] : ['안전보건예산_항목명', 'sum'],
      data: [{label: '데이터 없음', value: 0}],
    }
  },
  async mounted () {
    await this.loadGraph()
  },
  methods: {
    async loadGraph () {
      try {
        const summaryKey = this.summaryKey
        const data1 = await this.loadGraphPiece(this.boardIds[0], summaryKey)
        const data2 = await this.loadGraphPiece(this.boardIds[1], summaryKey)

        let value = data1
        value = CircleGraphUtil.combineCircleGraphData(value, data2)

        const newData = CircleGraphUtil.circleModuleWithData(value)
        newData.sort((a, b) => b.value - a.value)
        this.data = newData.length ? newData : [{label: '데이터 없음', value: 0}]
      } catch (err) {
        this.data = [{label: '데이터 없음', value: 0}]
      }
    },
    async loadGraphPiece (boardId, summaryKey) {
      const value = await this.$store.dispatch('summary/FIRA_LOAD_SUMMARY', {
        boardId,
        projectIds: this.projectId ? [this.projectId] : [],
        dateField: 'content$body.headerDate',
        beginAt: '2020-01-01 00:00:00',
        endAt: `${new Date().getFullYear()  }-12-31 23:59:59`,
      }).then(response => {
        const summary = CircleGraphUtil.normalizeSummaryResponse(response)
        if (this.dataType === 'project') {
          return CircleGraphUtil.getProjectFromEachProjectAllYear(summary, summaryKey)
        } else if (this.dataType === 'company') {
          return CircleGraphUtil.getCompanyFromEachCompanyAllYear(summary, summaryKey)
        } else {
          return CircleGraphUtil.getColumnFromEachCompanyAllYear(summary, summaryKey)
        }
      })
      return value || {}
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
