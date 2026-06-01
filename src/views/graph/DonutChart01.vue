<template>
  <donut-chart-card
    title="현장 현황"
    :value="data"
    unit="개사"
    :is-move-detail="isMoveWrite"
    @detail="onClickDetail"
    @write="onClickWrite"
  ></donut-chart-card>
</template>

<script>
import DonutChartCard from '@/components/DonutChartCard'

export default {
  name: 'DonutChart01',
  components: {DonutChartCard},
  props: {
    dataType: 'detail' | 'field' | 'company' | 'project',
  },
  computed: {
    projectId () {
      return this.$route.params.proj_id
    }
  },
  watch: {
    dataType (/*value*/) {
      this.loadGraph()
    }
  },
  data () {
    return {
      graphId: 1,
      isMoveWrite: false,
      data: [{label: '데이터 없음', value: 0}],
    }
  },
  async mounted () {
    await this.loadGraph()
  },
  methods: {
    async loadGraph () {
      if (this.projectId) {
        await this.loadGraphCompany()
      } else {
        await this.loadGraphFieldType()
      }
    },
    async loadGraphFieldType () {
      const data = await this.$store.dispatch('summary/LOAD_SUMMARY_FIELD_BY_PROJECT', {})
      const keys = Object.keys(data)
      if (keys && keys.length > 0) {
        const list = keys.map((value) => {
          return {label: data[value].project.field_name, value: data[value].field_count}
        })

        list.sort((a, b) => {
          if (a.value > b.value) return -1
          else if (a.value < b.value) return 1
          else return 0
        })

        this.data = list
      }
    },
    async loadGraphCompany () {
      const projectId = this.projectId
      const data = await this.$store.dispatch('summary/LOAD_SUMMARY_COMPANY_FIELD', {projectId})
      if (data && data.length > 0) {
        this.data = data.map((value) => {
          return {label: value.info.field_name, value: value.count}
        })
      }
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
      this.$router.push({name: 'field-workplace-create', params: {proj_id}})
    }
  },
}
</script>

<style scoped>

</style>
