<template>

  <vs-tabs :value="selectedTab">
    <vs-tab :label="tabs[0].label" @click="()=>{ handleChangeTab(tabs[0].key) }">
      <plan-partners-info v-if="id || isCreate" :id="id"/>
      <plan-partner-agreement v-else/>
    </vs-tab>
  </vs-tabs>
</template>

<script>
import PlanPartnersInfo from '@/views/project/plan/part/PlanPartnersInfo'
import PlanPartnerAgreement from '@/views/project/plan/part/PlanPartnerAgreement'
export default {
  name: 'Project',
  components: {
    PlanPartnerAgreement,
    PlanPartnersInfo
  },
  created () {
    const paths = this.$route.path.split('/')
    this.rootPath = `/${paths[1]}/${paths[2]}`
    this.checkPage()
  },
  computed: {
    id () {
      return this.$route.params.postId
    },
    isCreate () {
      return this.$route.params.tab === 'create'
    }
  },
  data () {
    return {
      rootPath:'', // 프로젝트의 rootPath
      selectedTab: -1,
      tabs: [
        {
          label: '계약 현황',
          key: 'list',
          create: false,
          update: false
        }
      ],
    }
  },
  methods:{
    handleChangeTab (tab) {
      if (this.$route.params.tab !== tab) {
        this.$router.push({path: `${this.rootPath}/plan/partners/${tab}`})
      }
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
        //this.$router.push({ path: '../' })
      }
    },
  }


}
</script>

<style scoped>
</style>
