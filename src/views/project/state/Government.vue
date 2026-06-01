<template>
  <div>
    <vs-tabs :value="selectedTab">
      <vs-tab :label="tabs[0].label">
        <check-government/>
      </vs-tab>
      <vs-tab :label="tabs[1].label">
        <state-government/>
      </vs-tab>
      <vs-tab :label="tabs[2].label">
        <monitor-government/>
      </vs-tab>
    </vs-tabs>
  </div>
</template>

<script>
import CheckGovernment from './government/CheckGovernment'
import StateGovernment from './government/StateGovernment'
import MonitorGovernment from './government/MonitorGovernment'

export default {
  name: 'Government',
  components: {
    MonitorGovernment,
    StateGovernment,
    CheckGovernment
  },
  data () {
    return {
      rootPath: '', // 프로젝트의 rootPath
      selectedTab: -1,
      tabs: [
        {
          label: '대관인허가체크',
          key: 'check',
          create: false,
          update: false
        },
        {
          label: '대관인허가신고',
          key: 'statement',
          create: false,
          update: false
        },
        {
          label: '대관인허가모니터링',
          key: 'monitoring',
          create: false,
          update: false
        }
      ]

    }
  }
}
</script>

<style scoped>

</style>
