<template>
  <div>
    <vs-tabs :value="selectedTab">
      <!--
      <vs-tab :label="tabs[0].label" @click="()=>{ handleChangeTab(tabs[0].key) }">
        <risk-check-daily-safety-checklist-detail v-if="tabs[0].update" @handleBackMenu="handleBackMenu"/>
        <risk-check-daily-safety-checklist v-else
                                           @handleClickItem="handleClickItem"
                                           @handleClickRegister="handleClickRegister"/>
      </vs-tab>
      <vs-tab :label="tabs[1].label" @click="()=>{ handleChangeTab(tabs[1].key) }">
        <risk-check-daily-safety-checklist-always-detail v-if="tabs[1].update" @handleBackMenu="handleBackMenu"/>
        <risk-check-daily-safety-checklist-always v-else
                                                  @handleClickItem="handleClickItem"
                                                  @handleClickRegister="handleClickRegister"/>
      </vs-tab>
-->
      <vs-tab :label="tabs[0].label" @click="()=>{ handleChangeTab(tabs[0].key) }">
        <risk-check-daily-safety-log-create v-if="tabs[0].create" @handleBackMenu="handleBackMenu"/>
        <risk-check-daily-safety-log-update v-else-if="tabs[0].update" @handleBackMenu="handleBackMenu"/>
        <risk-check-daily-safety-log v-else
                                     @handleClickItem="handleClickItem"
                                     @handleClickRegister="handleClickRegister"/>
      </vs-tab>

      <vs-tab :label="tabs[1].label" @click="()=>{ handleChangeTab(tabs[1].key) }">
        <risk-check-all-safety-log-create v-if="tabs[1].create" @handleBackMenu="handleBackMenu"/>
        <risk-check-all-safety-log-update v-else-if="tabs[1].update" @handleBackMenu="handleBackMenu"/>
        <risk-check-all-safety-log v-else
                                   @handleClickItem="handleClickItem"
                                   @handleClickRegister="handleClickRegister"/>
      </vs-tab>

    </vs-tabs>
  </div>
</template>

<script>
import RiskCheckDailySafetyChecklist from '@/views/project/risk/check/RiskCheckDailySafetyChecklist'
import RiskCheckDailySafetyLog from '@/views/project/risk/check/RiskCheckDailySafetyLog'
import RiskCheckAllSafetyLog from '@/views/project/risk/check/RiskCheckAllSafetyLog'
import RiskCheckDailySafetyChecklistDetail from '@/views/project/risk/check/RiskCheckDailySafetyChecklistDetail'
import RiskCheckDailySafetyLogCreate from '@/views/project/risk/check/RiskCheckDailySafetyLogCreate'
import RiskCheckDailySafetyLogUpdate from '@/views/project/risk/check/RiskCheckDailySafetyLogUpdate'
import RiskCheckAllSafetyLogCreate from '@/views/project/risk/check/RiskCheckAllSafetyLogCreate'
import RiskCheckAllSafetyLogUpdate from '@/views/project/risk/check/RiskCheckAllSafetyLogUpdate'
import RiskCheckDailySafetyChecklistAlwaysDetail
  from '@/views/project/risk/check/RiskCheckDailySafetyChecklistAlwaysDetail'
import RiskCheckDailySafetyChecklistAlways from '@/views/project/risk/check/RiskCheckDailySafetyChecklistAlways'
import RiskCheckDailySafetyLogAlwaysCreate from '@/views/project/risk/check/RiskCheckDailySafetyLogAlwaysCreate'
import RiskCheckDailySafetyLogAlwaysUpdate from '@/views/project/risk/check/RiskCheckDailySafetyLogAlwaysUpdate'
import RiskCheckDailySafetyLogAlways from '@/views/project/risk/check/RiskCheckDailySafetyLogAlways'
export default {
  name: 'Check',
  components: {
    RiskCheckDailySafetyLogAlways,
    RiskCheckDailySafetyLogAlwaysUpdate,
    RiskCheckDailySafetyLogAlwaysCreate,
    RiskCheckDailySafetyChecklistAlways,
    RiskCheckDailySafetyChecklistAlwaysDetail,
    RiskCheckAllSafetyLogUpdate,
    RiskCheckAllSafetyLogCreate,
    RiskCheckDailySafetyLogUpdate,
    RiskCheckDailySafetyLogCreate,
    RiskCheckDailySafetyChecklistDetail,
    RiskCheckAllSafetyLog,
    RiskCheckDailySafetyLog,
    RiskCheckDailySafetyChecklist},
  data () {
    return {
      rootPath:'', // 프로젝트의 rootPath
      selectedTab: -1,
      tabs:[
        { label: '일일안전점검일지', key: 'checklog', create: false, update: false },
        { label: '합동점검일지', key: 'checklogall', create: false, update: false }
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
        this.$router.push({ path: '../' })
      }
    },

    handleChangeTab (tab) {
      if (this.$route.params.tab !== tab) {
        this.$router.push({ path: `${this.rootPath}/risk/check/${tab}` })
      }
    },

    handleClickRegister (tab) {
      this.$router.push({ path: `${this.rootPath}/risk/check/${tab}/create` })
    },

    handleClickItem (tab, id) {
      this.$router.push({ path: `${this.rootPath}/risk/check/${tab}/${id}` })
    },

    handleBackMenu (tab) {
      this.$router.push({ path: `${this.rootPath}/risk/check/${tab}` })
    }

  }
}
</script>

<style scoped>

</style>
