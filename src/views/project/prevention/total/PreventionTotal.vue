<template>
  <div>
    <vs-tabs :value="selectedTab">
      <vs-tab :label="tabs[0].label" @click="()=>{ handleChangeTab(tabs[0].key) }">
        <prevention-total-list
          :boardId="tabs[0].boardId"
          :boardSlug="tabs[0].boardSlug"
          :tagKey="tabs[0].key"/>
      </vs-tab>
      <vs-tab :label="tabs[1].label" @click="()=>{ handleChangeTab(tabs[1].key) }">
        <prevention-total-list
          :boardId="tabs[1].boardId"
          :boardSlug="tabs[1].boardSlug"
          :tagKey="tabs[1].key"/>
      </vs-tab>
    </vs-tabs>
  </div>
</template>

<script>
import PreventionTotalList from '@/views/project/prevention/total/PreventionTotalList'

export default {
  name: 'PreventionTotal',
  components: {
    PreventionTotalList,
  },
  data () {
    return {
      rootPath: '', // 프로젝트의 rootPath
      selectedTab: -1,
      tabs: [
        {
          label: '안전',
          key: 'safety',
          boardId: 36,
          boardSlug: 'safety_request',
          create: false,
          update: false
        },
        {
          label: '보건',
          key: 'health',
          boardId: 40,
          boardSlug: 'health_request',
          create: false,
          update: false
        },
      ]
    }
  },
  methods: {
    handleChangeTab (tab) {
    }
  }
}
</script>

<style scoped>

</style>
