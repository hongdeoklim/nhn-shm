<template>
  <div class="w-full">
    <vs-tabs :value="selectedTab">
      <vs-tab :label="tabs[0].label" @click="()=>{ handleChangeTab(tabs[0].key) }">
        <accident-report-create
          v-if="tabs[0].create"
          @handleBackMenu="handleBackMenu"
        />
        <accident-report-update
          v-else-if="tabs[0].update"
          @handleBackMenu="handleBackMenu"
        />
        <accident-report-list
          v-else
          @handleClickItem="handleClickItem"
          @handleClickRegister="handleClickRegister"
        />
      </vs-tab>
      <vs-tab :label="tabs[1].label" @click="()=>{ handleChangeTab(tabs[1].key) }">
        <accident-condition/>
      </vs-tab>
    </vs-tabs>
  </div>
</template>

<script>
import AccidentReportList from './accident/accidentReportList'
import AccidentCondition from './accident/accidentCondition'
import AccidentAnalysis from './accident/accidentAnalysis'
import AccidentBasicData from './accident/accidentBasicData'
import AccidentReportCreate from '@/views/project/safety/accident/accidentReportCreate'
import AccidentReportUpdate from '@/views/project/safety/accident/accidentReportUpdate'

export default {
  name: 'Accident',
  components: {
    AccidentReportUpdate,
    AccidentReportCreate,
    AccidentBasicData,
    AccidentAnalysis,
    AccidentCondition,
    AccidentReportList
  },
  data () {
    return {
      rootPath: '', // 프로젝트의 rootPath
      selectedTab: -1,
      tabs: [
        {
          label: '사고보고',
          key: 'report',
          create: false,
          update: false
        },
        {
          label: '산재발생현황',
          key: 'condition',
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
        this.$router.push({path: `${this.rootPath}/safety/accident/${tab}`})
      }
    },

    handleClickRegister (tab) {
      this.$router.push({path: `${this.rootPath}/safety/accident/${tab}/create`})
    },

    handleClickItem (tab, id) {
      this.$router.push({path: `${this.rootPath}/safety/accident/${tab}/${id}`})
    },

    handleBackMenu (tab) {
      this.$router.push({path: `${this.rootPath}/safety/accident/${tab}`})
    }

  }
}
</script>

<style scoped>

</style>
