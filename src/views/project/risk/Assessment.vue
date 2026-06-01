<template>
  <div>
    <vs-tabs :value="selectedTab">

      <vs-tab :label="tabs[0].label" @click="()=>{ handleChangeTab(tabs[0].key) }">
        <risk-assessment-write v-if="tabs[0].create"
                               :isUpdateMode="tabs[0].update"
                               :boardId="tabs[0].boardId"
                               :boardSlug="tabs[0].boardSlug"
                               :tagKey="tabs[0].key"
                               @handleBackMenu="handleBackMenu"/>
        <risk-assessment-write v-else-if="tabs[0].update"
                               :isUpdateMode="tabs[0].update"
                               :boardId="tabs[0].boardId"
                               :boardSlug="tabs[0].boardSlug"
                               :tagKey="tabs[0].key"
                               @handleBackMenu="handleBackMenu"/>
        <risk-assessment-list v-else
                              :boardId="tabs[0].boardId"
                              :boardSlug="tabs[0].boardSlug"
                              :tagKey="tabs[0].key"
                              @handleClickRegister="handleClickRegister"/>
      </vs-tab>

      <vs-tab :label="tabs[1].label" @click="()=>{ handleChangeTab(tabs[1].key) }">
        <risk-assessment-write v-if="tabs[1].create"
                               :isUpdateMode="tabs[1].update"
                               :boardId="tabs[1].boardId"
                               :boardSlug="tabs[1].boardSlug"
                               :tagKey="tabs[1].key"
                               @handleBackMenu="handleBackMenu"/>
        <risk-assessment-write v-else-if="tabs[1].update"
                               :isUpdateMode="tabs[1].update"
                               :boardId="tabs[1].boardId"
                               :boardSlug="tabs[1].boardSlug"
                               :tagKey="tabs[1].key"
                               @handleBackMenu="handleBackMenu"/>
        <risk-assessment-list v-else
                              :boardId="tabs[1].boardId"
                              :boardSlug="tabs[1].boardSlug"
                              :tagKey="tabs[1].key"
                              @handleClickRegister="handleClickRegister"/>
      </vs-tab>

      <vs-tab :label="tabs[2].label" @click="()=>{ handleChangeTab(tabs[2].key) }">
        <risk-assessment-write v-if="tabs[2].create"
                               :isUpdateMode="tabs[2].update"
                               :boardId="tabs[2].boardId"
                               :boardSlug="tabs[2].boardSlug"
                               :tagKey="tabs[2].key"
                               @handleBackMenu="handleBackMenu"/>
        <risk-assessment-write v-else-if="tabs[2].update"
                               :isUpdateMode="tabs[2].update"
                               :boardId="tabs[2].boardId"
                               :boardSlug="tabs[2].boardSlug"
                               :tagKey="tabs[2].key"
                               @handleBackMenu="handleBackMenu"/>
        <risk-assessment-list v-else
                              :boardId="tabs[2].boardId"
                              :boardSlug="tabs[2].boardSlug"
                              :tagKey="tabs[2].key"
                              @handleClickRegister="handleClickRegister"/>
      </vs-tab>

    </vs-tabs>
  </div>
</template>

<script>
import RiskAssessmentRegular from '@/views/project/risk/assessment/RiskAssessmentRegular'
import RiskAssessmentStdDoc from '@/views/project/risk/assessment/RiskAssessmentStdDoc'
import RiskAssessmentWrite from '@/views/project/risk/assessment/RiskAssessmentWrite'
import RiskAssessmentList from '@/views/project/risk/assessment/RiskAssessmentList'

export default {
  name: 'Assessment',
  components: {
    RiskAssessmentList,
    RiskAssessmentWrite,
    RiskAssessmentStdDoc,
    RiskAssessmentRegular
  },
  data () {
    return {
      rootPath: '', // 프로젝트의 rootPath
      selectedTab: -1,
      tabs: [
        {
          label: '최초 위험성평가',
          key: 'first',
          boardId: 6,
          boardSlug: 'first_risk',
          create: false,
          update: false
        },
        {
          label: '정기 위험성평가',
          key: 'regular',
          boardId: 7,
          boardSlug: 'periodical_risk',
          create: false,
          update: false
        },
        {
          label: '수시 위험성평가',
          key: 'always',
          boardId: 41,
          boardSlug: 'always_risk',
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
        this.$router.push({path: `${this.rootPath}/risk/assessment/${tab}`})
      }
    },

    handleClickRegister (tab) {
      this.$router.push({path: `${this.rootPath}/risk/assessment/${tab}/create`})
    },

    handleClickItem (tab, id) {
      this.$router.push({path: `${this.rootPath}/risk/assessment/${tab}/${id}`})
    },

    handleBackMenu (tab) {
      this.$router.push({path: `${this.rootPath}/risk/assessment/${tab}`})
    }

  }
}
</script>

<style scoped>

</style>
