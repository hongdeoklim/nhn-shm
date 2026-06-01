<template>
  <donut-chart-card
    title="정기 위험성평가 현황"
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
  name: 'DonutChart09',
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
      graphId: 9,
      boardId: 161,
      summaryKey: this.dataType === 'field' ? ['정기위험성평가_현장명', 'count'] : ['정기위험성평가_재해형태', 'count'],
      data: [{label: '데이터 없음', value: 0}],
    }
  },
  async mounted () {
    await this.loadGraph()
  },
  methods: {
    async loadGraph () {
      const summaryKey1 = this.summaryKey
      const value = await this.$store.dispatch('summary/FIRA_LOAD_SUMMARY', {
        boardId: this.boardId,
        projectIds: this.projectId ? [this.projectId] : []
      }).then(value => {
        if (this.dataType === 'project') {
          return CircleGraphUtil.getProjectFromEachProject(value, summaryKey1)
        } else if (this.dataType === 'company') {
          return CircleGraphUtil.getCompanyFromEachCompany(value, summaryKey1)
        } else {
          return CircleGraphUtil.getColumnFromEachCompany(value, summaryKey1)
        }
      })

      const newData = CircleGraphUtil.circleModuleWithData(value)
      newData.sort((a, b) => b.value - a.value )
      this.data = newData
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
      const boardId = `${this.boardId}`
      this.$router.push({name: 'write|tab', params: {proj_id, boardId}})
    }
  },
}
</script>

<style scoped>

</style>
