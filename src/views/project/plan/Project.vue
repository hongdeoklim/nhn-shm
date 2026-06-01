<template>
<vs-tabs>

  <vs-tab label="현장 정보">
    <plan-project-info></plan-project-info>
  </vs-tab>

  <vs-tab label="조직도">
    <plan-project-organization></plan-project-organization>
  </vs-tab>

</vs-tabs>
</template>

<script>
import PlanProjectInfo from '@/views/project/plan/proj/PlanProjectInfo'
import PlanProjectOrganization from '@/views/project/plan/proj/PlanProjectOrganization'

export default {
  name: 'Project',
  components: {
    PlanProjectOrganization,
    PlanProjectInfo
  },
  data () {
    return {

    }
  }
}
</script>

<style scoped>

</style>
