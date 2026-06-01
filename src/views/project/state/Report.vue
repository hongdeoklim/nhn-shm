<template>
  <div>
    <vs-tabs :value="selectedTab" >
      <vs-tab :label="tabs[0].label" @click="()=>{ handleChangeTab(tabs[0].key) }">
        <report-accident-create v-if="tabs[0].create"
                                @handleBackMenu="handleBackMenu">
        </report-accident-create>
        <report-accident-update v-else-if="tabs[0].update"
                                @handleBackMenu="handleBackMenu">
        </report-accident-update>
        <report-accident-list
          v-else
          @handleClickItem="handleClickItem"
          @handleClickRegister="handleClickRegister">
        </report-accident-list>
      </vs-tab>
      <vs-tab :label="tabs[1].label" @click="()=>{ handleChangeTab(tabs[1].key) }">
        <report-issue-create v-if="tabs[1].create"
                             @handleBackMenu="handleBackMenu"
        ></report-issue-create>
        <report-issue-update v-else-if="tabs[1].update"
                             @handleBackMenu="handleBackMenu"
        ></report-issue-update>
        <report-issue-list
          v-else
          @handleClickItem="handleClickItem"
          @handleClickRegister="handleClickRegister"
        ></report-issue-list>
      </vs-tab>
    </vs-tabs>
  </div>
</template>

<script>
import ReportIssueList from './report/ReportIssueList'
import ReportIssueCreate from './report/ReportIssueCreate'
import ReportAccidentList from './report/ReportAccidentList'
import ReportAccidentCreate from './report/ReportAccidentCreate'
import ReportAccidentUpdate from '@/views/project/state/report/ReportAccidentUpdate'
import ReportIssueUpdate from '@/views/project/state/report/ReportIssueUpdate'

export default {
  name: 'Report',
  components: {
    ReportIssueUpdate,
    ReportAccidentUpdate,
    ReportAccidentCreate,
    ReportAccidentList,
    ReportIssueCreate,
    ReportIssueList
  },
  data () {
    return {
      rootPath: '', // 프로젝트의 rootPath
      selectedTab: -1,
      tabs: [
        {
          label: '환경사고보고',
          key: 'accident',
          create: false,
          update: false
        },
        {
          label: '환경이슈보고',
          key: 'issue',
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
        this.$router.push({ path: `${this.rootPath}/state/report/${tab}` })
      }
    },

    handleClickRegister (tab) {
      this.$router.push({ path: `${this.rootPath}/state/report/${tab}/create` })
    },

    handleClickItem (tab, id) {
      this.$router.push({ path: `${this.rootPath}/state/report/${tab}/${id}` })
    },

    handleBackMenu (tab) {
      this.$router.push({ path: `${this.rootPath}/state/report/${tab}` })
    }
  }
}
</script>

<style scoped>

</style>
