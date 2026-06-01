<template>
  <div>
    <vs-tabs :value="selectedTab">
      <vs-tab :label="tabs[0].label" @click="()=>{ handleChangeTab(tabs[0].key) }">
        <daily-check-create
          v-if="tabs[0].create"
          @handleBackMenu="handleBackMenu"
        ></daily-check-create>
        <daily-check-update
          v-else-if="tabs[0].update"
          @handleBackMenu="handleBackMenu"
        ></daily-check-update>
        <daily-check
          v-else
          @handleClickRegister="handleClickRegister"
        ></daily-check>

      </vs-tab>

      <vs-tab :label="tabs[1].label" @click="()=>{ handleChangeTab(tabs[1].key) }">
        <monthly-check-create v-if="tabs[1].create"
                              @handleBackMenu="handleBackMenu"/>
        <monthly-check-update v-else-if="tabs[1].update"
                              @handleBackMenu="handleBackMenu"/>
        <monthly-check v-else
                       @handleClickRegister="handleClickRegister"/>
      </vs-tab>
      <vs-tab :label="tabs[2].label" @click="()=>{ handleChangeTab(tabs[2].key) }">
        <monitor-check/>
      </vs-tab>
    </vs-tabs>
  </div>
</template>

<script>
import DailyCheck from './check/DailyCheck'
import MonthlyCheck from './check/MonthlyCheck'
import MonitorCheck from './check/MonitorCheck'
import DailyCheckCreate from './check/DailyCheckCreate'
import DailyCheckUpdate from './check/DailyCheckUpdate'
import MonthlyCheckCreate from './check/MonthlyCheckCreate'
import MonthlyCheckUpdate from './check/MonthlyCheckUpdate'
import MonitorDetailCheck from '@/views/project/state/check/MonitorDetailCheck'

export default {
  name: 'Check',
  components: {
    MonitorDetailCheck,
    MonthlyCheckUpdate,
    MonthlyCheckCreate,
    DailyCheckUpdate,
    DailyCheckCreate,
    MonitorCheck,
    MonthlyCheck,
    DailyCheck
  },
  data () {
    return {
      rootPath: '', // 프로젝트의 rootPath
      selectedTab: -1,
      tabs: [
        {
          label: '환경일일점검',
          key: 'daily',
          create: false,
          update: false
        },
        {
          label: '월간점검',
          key: 'monthly',
          create: false,
          update: false
        },
        {
          label: '환경점검모니터링',
          key: 'monitoring',
          create: false,
          update: false
        }
      ]
    }
  },
  created () {
    const paths = this.$route.path.split('/')
    this.rootPath = `/${paths[1]}/${paths[2]}`

    this.checkPage()
  },

  methods: {

    // 리스트 / 상세 페이지 조절
    checkPage () {
      for (const index in this.tabs) {

        // 리스트 페이지를 보여주게 설정
        this.tabs[index].create = false
        this.tabs[index].update = false

        // 탭 변경
        if (this.$route.params.tab) {
          if (this.tabs[index].key === this.$route.params.tab) {
            this.selectedTab = index
          }


          if (this.$route.params.postId) {
            if (this.$route.params.postId === 'create') {
              // 작성페이지로 진입해야하는 경우
              this.tabs[index].create = true
              this.tabs[index].update = false

            } else {
              // 상세페이지로 진입해야하는 경우
              this.tabs[index].create = false
              this.tabs[index].update = true
            }
          }

        }
      }

      // 선택된 탭이 없다면 잘못 된 경로로 진입한 것으로 판단 (뒤로 이동)
      if (this.selectedTab === -1) {
        this.$router.push({path: '../'})
      }
    },

    handleChangeTab (tab) {
      if (this.$route.params.tab !== tab) {
        this.$router.push({path: `${this.rootPath}/state/check/${tab}`})
      }
    },

    handleClickRegister (tab) {
      this.$router.push({path: `${this.rootPath}/state/check/${tab}/create`})
    },

    handleClickItem (tab, id) {
      this.$router.push({path: `${this.rootPath}/state/check/${tab}/${id}`})
    },

    handleBackMenu (tab) {
      this.$router.push({path: `${this.rootPath}/state/check/${tab}`})
    }
  }
}
</script>

<style scoped>

</style>
