<template>
  <donut-chart-card
    title="수시 위험성평가 현황"
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
  name: 'DonutChart10',
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
      graphId: 10,
      boardIds: [162, 523],
      summaryKeys: {
        'detail' : ['수시위험성평가_재해형태', 'count'],
        'field' : ['수시위험성평가_현장명', 'count'],
        'address' : ['수시위험성평가_재해형태', 'count'],
        'field_cat1' : ['수시위험성평가_재해형태', 'count'],
        'company' : ['수시위험성평가_재해형태', 'count'],
        'project' : ['수시위험성평가_재해형태', 'count'],
      },
      data: [{label: '데이터 없음', value: 0}],
    }
  },
  async mounted () {
    await this.loadGraph()
  },
  methods: {
    async loadGraph () {
      const projectIds = this.projectId ? [this.projectId] : []
      const summaryKey = this.summaryKeys[this.dataType]
      const boardIds = this.boardIds
      const dataType = this.dataType
      const dataList = await CircleGraphUtil.loadGraphPieces(this.$store, projectIds, boardIds, summaryKey, dataType)

      let value = {}
      for (const data of (dataList || [])) {
        value = CircleGraphUtil.combineCircleGraphData(value, data)
      }
      this.data = CircleGraphUtil.circleModuleWithData(value)
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
