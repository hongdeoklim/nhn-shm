<template>
  <vs-tabs :value="selectedTab">
    <vs-tab :label="tabs[0].label" @click="()=>{ handleChangeTab(tabs[0].key) }">
      <risk-conference-warning-create
        v-if="tabs[0].create"
        @handleBackMenu="handleBackMenu"
      ></risk-conference-warning-create>
      <risk-conference-warning-update
        v-else-if="tabs[0].update"
        @handleBackMenu="handleBackMenu"
      ></risk-conference-warning-update>
      <risk-conference-warning
        v-else
        @handleClickRegister="handleClickRegister"
      ></risk-conference-warning>

    </vs-tab>

    <vs-tab :label="tabs[1].label" @click="()=>{ handleChangeTab(tabs[1].key) }">
      <risk-conference-warning-always-create
        v-if="tabs[1].create"
        @handleBackMenu="handleBackMenu"
      ></risk-conference-warning-always-create>
      <risk-conference-warning-always-update
        v-else-if="tabs[1].update"
        @handleBackMenu="handleBackMenu"
      ></risk-conference-warning-always-update>
      <risk-conference-warning-always
        v-else
        @handleSelected="handleSelected"
        @handleClickRegister="handleClickRegister"
      ></risk-conference-warning-always>
    </vs-tab>

    <vs-tab :label="tabs[2].label" @click="()=>{ handleChangeTab(tabs[2].key) }">
      <risk-conference-safety-create
        v-if="tabs[2].create"
        @handleBackMenu="handleBackMenu"
      ></risk-conference-safety-create>
      <risk-conference-safety-update
        v-else-if="tabs[2].update"
        @handleBackMenu="handleBackMenu"
      ></risk-conference-safety-update>
      <risk-conference-safety
        v-else
        @handleSelected="handleSelected"
        @handleClickRegister="handleClickRegister"
      ></risk-conference-safety>
    </vs-tab>

  </vs-tabs>
</template>

<script>
import RiskConferenceWarning from '@/views/project/risk/conference/RiskConferenceWarning'
import RiskConferenceWarningCreate from '@/views/project/risk/conference/RiskConferenceWarningCreate'
import RiskConferenceWarningUpdate from '@/views/project/risk/conference/RiskConferenceWarningUpdate'
import RiskConferenceSafety from '@/views/project/risk/conference/RiskConferenceSafety'
import RiskConferenceSafetyCreate from '@/views/project/risk/conference/RiskConferenceSafetyCreate'
import RiskConferenceSafetyUpdate from '@/views/project/risk/conference/RiskConferenceSafetyUpdate'
import RiskConferenceWarningAlways from '@/views/project/risk/conference/RiskConferenceWarningAlways'
import RiskConferenceWarningAlwaysCreate from '@/views/project/risk/conference/RiskConferenceWarningAlwaysCreate'
import RiskConferenceWarningAlwaysUpdate from '@/views/project/risk/conference/RiskConferenceWarningAlwaysUpdate'

export default {
  name: 'Conference',
  components: {
    RiskConferenceWarningAlwaysUpdate,
    RiskConferenceWarningAlwaysCreate,
    RiskConferenceWarningAlways,
    RiskConferenceSafetyUpdate,
    RiskConferenceSafetyCreate,
    RiskConferenceSafety,
    RiskConferenceWarning,
    RiskConferenceWarningCreate,
    RiskConferenceWarningUpdate
  },
  data () {
    return {
      rootPath: '', // 프로젝트의 rootPath
      selectedTab: -1,
      tabs: [
        {
          label: '정기 위험성평가협의회',
          key: 'warning',
          create: false,
          update: false
        },
        {
          label: '수시 위험성평가협의회',
          key: 'warning-always',
          create: false,
          update: false
        },
        {
          label: '산업안전보건위원회',
          key: 'safety',
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

    onClickToggleSide () {
      this.toggleSide = !this.toggleSide
    },
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
        this.$router.push({path: `${this.rootPath}/risk/conference/${tab}`})
      }
    },

    handleSelected (tab, id) {
      this.$router.push({path: `${this.rootPath}/risk/conference/${tab}/${id}`})
    },

    handleClickRegister (tab) {
      this.$router.push({path: `${this.rootPath}/risk/conference/${tab}/create`})
    },

    handleBackMenu (tab) {
      this.$router.push({path: `${this.rootPath}/risk/conference/${tab}`})
    }
  }
}
</script>

<style scoped>

</style>
