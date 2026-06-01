<template>
  <div>
    <vs-tabs :value="selectedTab">
      <vs-tab :label="tabs[0].label" @click="()=>{ handleChangeTab(tabs[0].key) }">
        <staff-input-list/>
      </vs-tab>
      <vs-tab :label="tabs[1].label" @click="()=>{ handleChangeTab(tabs[1].key) }">
        <staff-management/>
      </vs-tab>
      <vs-tab :label="tabs[2].label" @click="()=>{ handleChangeTab(tabs[2].key) }">
        <staff-view-list/>
      </vs-tab>
    </vs-tabs>
  </div>
</template>

<script>
import StaffInputList from './staff/StaffInputList'
import StaffManagement from './staff/StaffManagement'
import StaffViewList from './staff/StaffViewList'

export default {
  name: 'Staff',
  components: {
    StaffViewList,
    StaffManagement,
    StaffInputList
  },
  data () {
    return {
      rootPath: '', // 프로젝트의 rootPath
      selectedTab: -1,
      tabs: [
        {
          label: '인원투입 입력',
          key: 'input'
        },
        {
          label: '인원투입 관리',
          key: 'management'
        },
        {
          label: '출역인원조회',
          key: 'view'
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
        }
      }

      // 선택된 탭이 없다면 잘못 된 경로로 진입한 것으로 판단 (뒤로 이동)
      if (this.selectedTab === -1) {
        this.$router.push({path: '../'})
      }
    },

    handleChangeTab (tab) {
      if (this.$route.params.tab !== tab) {
        this.$router.push({path: `${this.rootPath}/safety/staff/${tab}`})
      }
    }
  }
}
</script>

<style scoped>

</style>
